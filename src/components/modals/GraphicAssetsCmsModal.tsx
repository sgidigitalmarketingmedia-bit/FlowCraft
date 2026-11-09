import React, { useState, useRef, useEffect } from 'react';
import { 
  FolderSearch, Upload, Search, Film, Image as ImageIcon, Video, 
  Trash2, Copy, Check, Plus, ExternalLink, X, Sparkles, Filter,
  Tag, Download, Eye, Layers, Compass, Play, FileCheck, HardDrive
} from 'lucide-react';
import { GraphicAssetItem } from '../../types/builder';
import { getAllCmsAssets, saveCmsAsset, deleteCmsAsset } from '../../data/graphicAssetsCatalog';

interface GraphicAssetsCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset?: (asset: GraphicAssetItem) => void;
  onAddAsCarouselSlide?: (asset: GraphicAssetItem) => void;
  targetContext?: {
    elementName?: string;
    elementType?: string;
    mode?: 'image' | 'video' | 'carousel_slide' | 'all';
  };
}

export const GraphicAssetsCmsModal: React.FC<GraphicAssetsCmsModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
  onAddAsCarouselSlide,
  targetContext,
}) => {
  const [assets, setAssets] = useState<GraphicAssetItem[]>(() => getAllCmsAssets());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [newNameInput, setNewNameInput] = useState('');
  const [newTypeInput, setNewTypeInput] = useState<'image' | 'video'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with localStorage on open
  useEffect(() => {
    if (isOpen) {
      setAssets(getAllCmsAssets());
      if (targetContext?.mode === 'video') {
        setSelectedCategory('video');
      } else if (targetContext?.mode === 'carousel_slide') {
        setSelectedCategory('banner');
      }
    }
  }, [isOpen, targetContext]);

  if (!isOpen) return null;

  // Handle local computer file search/import
  const handleLocalFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const isVid = file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov)$/i);
      const url = URL.createObjectURL(file);
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const ext = file.name.split('.').pop()?.toLowerCase() || (isVid ? 'mp4' : 'png');

      const newAsset: GraphicAssetItem = {
        id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url,
        type: isVid ? 'video' : 'image',
        format: (ext as any) || (isVid ? 'mp4' : 'png'),
        category: 'user_upload',
        dimensions: isVid ? '1080p Video' : 'Local Computer Asset',
        size: sizeStr,
        tags: ['local', 'computer', isVid ? 'video' : 'image', ext],
        createdAt: new Date().toISOString().split('T')[0],
        isLocalUpload: true,
      };

      const updated = saveCmsAsset(newAsset);
      setAssets(updated);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle manual Internet URL addition
  const handleAddInternetUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlInput.trim()) return;

    const url = newUrlInput.trim();
    const isVid = newTypeInput === 'video' || url.match(/\.(mp4|webm|mov)$/i) || url.includes('video');
    const name = newNameInput.trim() || `Internet Asset ${assets.length + 1}`;

    const newAsset: GraphicAssetItem = {
      id: `web_${Date.now()}`,
      name,
      url,
      type: isVid ? 'video' : 'image',
      format: isVid ? 'mp4' : 'jpg',
      category: isVid ? 'video' : 'banner',
      dimensions: isVid ? '1080p Streaming' : 'Internet Graphic',
      size: 'Web Stream',
      tags: ['internet', 'web', isVid ? 'video' : 'graphic'],
      createdAt: new Date().toISOString().split('T')[0],
      isLocalUpload: false,
    };

    const updated = saveCmsAsset(newAsset);
    setAssets(updated);
    setNewUrlInput('');
    setNewNameInput('');
    setIsAddingUrl(false);
  };

  const handleCopyUrl = (asset: GraphicAssetItem) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (assetId: string) => {
    const updated = deleteCmsAsset(assetId);
    setAssets(updated);
  };

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'banner' && asset.category === 'banner') ||
      (selectedCategory === 'video' && (asset.category === 'video' || asset.type === 'video')) ||
      (selectedCategory === 'ui' && asset.category === 'ui') ||
      (selectedCategory === 'document' && asset.category === 'document') ||
      (selectedCategory === 'local' && (asset.isLocalUpload || asset.category === 'user_upload'));

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      asset.name.toLowerCase().includes(q) ||
      asset.format.toLowerCase().includes(q) ||
      asset.tags.some((t) => t.toLowerCase().includes(q)) ||
      asset.url.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-5xl h-[88vh] rounded-2xl border border-violet-500/30 bg-[#0C0A17] text-slate-100 shadow-2xl shadow-violet-950/60 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-violet-500/20 bg-[#120F24] px-5 py-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30">
              <FolderSearch className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Graphic Assets CMS & Media Hub</h3>
                <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-violet-300 border border-violet-500/30">
                  Mini CMS Site
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Browse curated graphic assets, search your local computer disk, and stream internet videos into your UI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {targetContext?.elementName && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 px-2.5 py-1 text-xs font-medium text-blue-300">
                <Sparkles className="h-3 w-3 text-blue-400" />
                Target: {targetContext.elementName}
              </span>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Close Assets CMS"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Local Computer Search Button, Add Internet URL */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-[#15122B]/70 px-5 py-3 shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by name, tag, format (e.g. mp4, banner, card)..."
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Action Buttons: Local Search on Computer + Add Internet Video/Image */}
          <div className="flex items-center gap-2">
            {/* Native Local Computer Disk Search Picker */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLocalFiles}
              multiple
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,video/mp4,video/webm,video/quicktime,video/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              title="Open your computer file explorer to search and import images or videos"
            >
              <HardDrive className="h-4 w-4 text-blue-200" />
              <span>Search Local Computer</span>
            </button>

            {/* Add from Internet URL */}
            <button
              type="button"
              onClick={() => setIsAddingUrl(!isAddingUrl)}
              className="flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1.5 text-xs font-semibold text-violet-300 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Internet URL</span>
            </button>
          </div>
        </div>

        {/* Add Internet URL expandable form */}
        {isAddingUrl && (
          <form
            onSubmit={handleAddInternetUrl}
            className="flex flex-wrap items-center gap-2 border-b border-violet-500/20 bg-violet-950/20 px-5 py-2.5 animate-in slide-in-from-top-2"
          >
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-700 p-0.5">
              <button
                type="button"
                onClick={() => setNewTypeInput('image')}
                className={`px-2 py-1 text-[11px] rounded font-medium ${
                  newTypeInput === 'image' ? 'bg-violet-600 text-white' : 'text-slate-400'
                }`}
              >
                Image URL
              </button>
              <button
                type="button"
                onClick={() => setNewTypeInput('video')}
                className={`px-2 py-1 text-[11px] rounded font-medium ${
                  newTypeInput === 'video' ? 'bg-violet-600 text-white' : 'text-slate-400'
                }`}
              >
                Video / MP4 URL
              </button>
            </div>

            <input
              type="text"
              required
              value={newUrlInput}
              onChange={(e) => setNewUrlInput(e.target.value)}
              placeholder={newTypeInput === 'video' ? 'https://...video.mp4 or internet stream link' : 'https://...image.png or unsplash url'}
              className="flex-1 min-w-[200px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-white focus:outline-none focus:border-violet-500"
            />

            <input
              type="text"
              value={newNameInput}
              onChange={(e) => setNewNameInput(e.target.value)}
              placeholder="Asset title (optional)"
              className="w-44 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-white focus:outline-none focus:border-violet-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-xs font-semibold text-white transition-all shadow-sm"
            >
              Save to CMS
            </button>

            <button
              type="button"
              onClick={() => setIsAddingUrl(false)}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2 py-1 text-xs text-slate-300"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Category Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-800/80 bg-[#0E0C1C] px-5 py-2 shrink-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Media', count: assets.length },
            { id: 'banner', label: 'Banner Carousels', count: assets.filter((a) => a.category === 'banner').length },
            { id: 'video', label: 'Internet Videos (.mp4)', count: assets.filter((a) => a.type === 'video' || a.category === 'video').length },
            { id: 'ui', label: 'UI Mockups & Graphics', count: assets.filter((a) => a.category === 'ui').length },
            { id: 'document', label: 'KYC Document Scanners', count: assets.filter((a) => a.category === 'document').length },
            { id: 'local', label: 'Local Computer Uploads', count: assets.filter((a) => a.isLocalUpload || a.category === 'user_upload').length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                selectedCategory === cat.id ? 'bg-violet-900/60 text-violet-200' : 'bg-slate-800 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FolderSearch className="h-12 w-12 text-slate-600 mb-3" />
              <h4 className="text-sm font-semibold text-slate-300">No assets match your search</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Try searching for another term, switch categories, or click "Search Local Computer" to import graphic assets from your hard drive.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-violet-500 transition-all"
              >
                <HardDrive className="h-4 w-4" />
                <span>Search Local Computer Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isVideo = asset.type === 'video' || asset.format === 'mp4';
                return (
                  <div
                    key={asset.id}
                    className="group relative flex flex-col rounded-2xl border border-slate-800 bg-[#120F24] overflow-hidden hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-950/40 transition-all"
                  >
                    {/* Media Preview Container */}
                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                      {isVideo ? (
                        <div className="relative h-full w-full">
                          <video
                            src={asset.url}
                            muted
                            loop
                            playsInline
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onMouseEnter={(e) => {
                              try { e.currentTarget.play(); } catch (_) {}
                            }}
                            onMouseLeave={(e) => {
                              try { e.currentTarget.pause(); } catch (_) {}
                            }}
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/70 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-mono font-bold text-rose-400 border border-rose-500/30">
                            <Video className="h-2.5 w-2.5" />
                            <span>MP4 VIDEO</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative h-full w-full">
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
                            }}
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/70 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-mono font-bold text-sky-400 border border-sky-500/30 uppercase">
                            <ImageIcon className="h-2.5 w-2.5" />
                            <span>{asset.format}</span>
                          </div>
                        </div>
                      )}

                      {/* Local disk badge */}
                      {asset.isLocalUpload && (
                        <div className="absolute top-2 right-2 rounded bg-emerald-500/80 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-mono font-bold text-white shadow">
                          LOCAL DISK
                        </div>
                      )}

                      {/* Quick Hover Overlay: Copy or Play */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        {onSelectAsset && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectAsset(asset);
                              onClose();
                            }}
                            className="rounded-xl bg-violet-600 hover:bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-transform active:scale-95"
                          >
                            Apply to Element
                          </button>
                        )}
                        {onAddAsCarouselSlide && (
                          <button
                            type="button"
                            onClick={() => {
                              onAddAsCarouselSlide(asset);
                              onClose();
                            }}
                            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg transition-transform active:scale-95"
                            title="Add as a new banner slide to the active carousel"
                          >
                            + Carousel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Meta & Info */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-violet-300 transition-colors" title={asset.name}>
                          {asset.name}
                        </h4>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>{asset.dimensions || '1920x1080'}</span>
                          <span>{asset.size || 'Web'}</span>
                        </div>
                      </div>

                      {/* Actions footer */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(asset)}
                          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                          title="Copy asset URL to clipboard"
                        >
                          {copiedId === asset.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy URL</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1">
                          {asset.isLocalUpload && (
                            <button
                              type="button"
                              onClick={() => handleDelete(asset.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Delete from CMS"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {onSelectAsset && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectAsset(asset);
                                onClose();
                              }}
                              className="rounded-lg bg-violet-600/30 hover:bg-violet-600 px-2 py-0.5 text-[11px] font-semibold text-violet-200 hover:text-white transition-all"
                            >
                              Insert
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-[#0E0C1C] px-5 py-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CMS Database Connected • {assets.length} Assets Registered</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
