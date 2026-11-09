import React, { useState, useEffect } from 'react';
import { 
  Sliders, Link2, Sparkles, Trash2, ArrowRight, Play, Eye, 
  Layers, Palette, Type, MousePointer, Shield, Check, Info, Settings,
  ChevronRight, Video, Volume2, Clock, Smartphone, Droplet, CheckCircle2, Film, Upload,
  Plus, ExternalLink, Zap, ChevronDown, ChevronUp, RefreshCw, CornerDownRight, Compass,
  Image as ImageIcon, GalleryHorizontalEnd, Maximize2, Square, Circle, Triangle, Star,
  StickyNote, MapPin, FolderSearch, HardDrive, PlayCircle, FileCheck,
  Activity, LineChart, PieChart, BarChart3, Database, Wifi, Globe, Gauge, Table, TrendingUp, Code2
} from 'lucide-react';
import { 
  Screen, ElementProperties, ActionTrigger, ActionType, TransitionType, FlowConnection, 
  SliderSlideItem, CarouselSlideItem, ScreenAnnotation, AnnotationCategory, AnnotationColor,
  DataBindingConfig, DataSourceType
} from '../../types/builder';
import { PRESET_SWATCH_COLORS } from '../../data/colorPalettes';
import { MotionVideoSplashResizer } from './MotionVideoSplashResizer';

interface PropertiesSidebarProps {
  selectedScreen: Screen | null;
  selectedElement: ElementProperties | null;
  screens: Screen[];
  connections?: FlowConnection[];
  selectedConnectionId?: string | null;
  initialTab?: 'props' | 'flow' | 'screen';
  onTabChange?: (tab: 'props' | 'flow' | 'screen') => void;
  onUpdateElement: (updated: ElementProperties) => void;
  onUpdateScreen: (updated: Screen) => void;
  onDeleteElement: (elementId: string) => void;
  onSelectElement?: (elementId: string) => void;
  onSelectScreen?: (screenId: string) => void;
  onSelectConnection?: (conn: FlowConnection | null) => void;
  onAddConnection?: (conn: FlowConnection) => void;
  onUpdateConnection?: (conn: FlowConnection) => void;
  onDeleteConnection?: (connId: string) => void;
  onTestInteraction?: (element?: ElementProperties | null, targetScreenId?: string, transition?: TransitionType, duration?: number, easing?: string) => void;
  onOpenGraphicCms?: (context?: { elementName?: string; elementType?: string; mode?: 'image' | 'video' | 'carousel_slide' | 'all'; targetSlideIndex?: number }) => void;
  onClose?: () => void;
}

export const PropertiesSidebar: React.FC<PropertiesSidebarProps> = ({
  selectedScreen,
  selectedElement,
  screens,
  connections = [],
  selectedConnectionId,
  initialTab,
  onTabChange,
  onUpdateElement,
  onUpdateScreen,
  onDeleteElement,
  onSelectElement,
  onSelectScreen,
  onSelectConnection,
  onAddConnection,
  onUpdateConnection,
  onDeleteConnection,
  onTestInteraction,
  onOpenGraphicCms,
  onClose,
}) => {
  const [activeTab, setActiveTabState] = useState<'props' | 'flow' | 'screen'>(() => {
    if (initialTab) return initialTab;
    if (selectedConnectionId) return 'flow';
    if (selectedElement) return 'props';
    return 'screen';
  });

  const setActiveTab = (tab: 'props' | 'flow' | 'screen') => {
    setActiveTabState(tab);
    onTabChange?.(tab);
  };

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTabState(initialTab);
    }
  }, [initialTab]);

  if (!selectedScreen && !selectedElement && !selectedConnectionId) {
    return (
      <div className="relative flex h-full w-80 flex-col items-center justify-center border-l border-slate-800 bg-slate-900/90 p-6 text-center text-slate-400 select-none shrink-0 transition-all duration-300">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-800/80 p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            title="Collapse Properties Panel (Close Arrow)"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        <MousePointer className="mb-3 h-8 w-8 text-slate-600 stroke-[1.5]" />
        <h4 className="text-sm font-semibold text-slate-300">No Selection</h4>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
          Select an artboard, component, or transition wire on the canvas to configure visual properties and prototype flows.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-80 flex-col border-l border-slate-800 bg-slate-900/95 backdrop-blur-md text-slate-100 select-none shrink-0 transition-all duration-300">
      {/* Sidebar Header & Tab Bar */}
      <div className="border-b border-slate-800 p-2 bg-slate-950/60 flex items-center gap-1.5">
        <div className="flex flex-1 rounded-lg bg-slate-900 p-1">
          <button
            onClick={() => setActiveTab('props')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'props'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="h-3 w-3" />
            <span>Props</span>
          </button>

          <button
            onClick={() => setActiveTab('flow')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'flow'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 className="h-3 w-3" />
            <span>Transitions</span>
          </button>

          <button
            onClick={() => setActiveTab('screen')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'screen'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>Screen</span>
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors shrink-0"
            title="Collapse Properties Panel (Close Arrow)"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {activeTab === 'props' && (
          selectedElement ? (
            <ElementPropertiesPanel
              element={selectedElement}
              screens={screens}
              onUpdate={onUpdateElement}
              onDelete={() => onDeleteElement(selectedElement.id)}
              onTest={onTestInteraction}
              onSwitchToTransitions={() => setActiveTab('flow')}
              onOpenGraphicCms={onOpenGraphicCms}
            />
          ) : selectedScreen ? (
            <ScreenPropertiesPanel
              screen={selectedScreen}
              onUpdate={onUpdateScreen}
              onSelectElement={(elId) => {
                onSelectElement?.(elId);
                setActiveTab('props');
              }}
            />
          ) : null
        )}

        {activeTab === 'flow' && (
          <TransitionsFlowPanel
            element={selectedElement}
            screen={selectedScreen}
            screens={screens}
            connections={connections}
            selectedConnectionId={selectedConnectionId}
            onUpdateElement={onUpdateElement}
            onUpdateConnection={onUpdateConnection}
            onDeleteConnection={onDeleteConnection}
            onAddConnection={onAddConnection}
            onSelectElement={onSelectElement}
            onSelectScreen={onSelectScreen}
            onSelectConnection={onSelectConnection}
            onTest={onTestInteraction}
          />
        )}

        {activeTab === 'screen' && selectedScreen && (
          <ScreenPropertiesPanel
            screen={selectedScreen}
            onUpdate={onUpdateScreen}
            onSelectElement={(elId) => {
              onSelectElement?.(elId);
              setActiveTab('props');
            }}
          />
        )}
      </div>
    </div>
  );
};

/* ---------------- Element Properties Sub-Panel ---------------- */
function ElementPropertiesPanel({
  element,
  screens,
  onUpdate,
  onDelete,
  onTest,
  onSwitchToTransitions,
  onOpenGraphicCms,
}: {
  element: ElementProperties;
  screens: Screen[];
  onUpdate: (updated: ElementProperties) => void;
  onDelete: () => void;
  onTest?: (element?: ElementProperties | null, targetScreenId?: string, transition?: TransitionType, duration?: number, easing?: string) => void;
  onSwitchToTransitions?: () => void;
  onOpenGraphicCms?: (context?: { elementName?: string; elementType?: string; mode?: 'image' | 'video' | 'carousel_slide' | 'all'; targetSlideIndex?: number }) => void;
}) {
  const isInteractiveComponent = (
    element.type === 'button' || 
    element.type === 'card' || 
    element.type === 'list_item' || 
    element.type === 'metric' || 
    element.type === 'image_banner' || 
    element.type === 'badge'
  );

  return (
    <div className="space-y-4">
      {/* Element Identification */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">{element.type.replace('_', ' ')} component</span>
          <h3 className="text-sm font-bold text-white tracking-tight">{element.name}</h3>
        </div>
        <button
          title="Delete component"
          onClick={onDelete}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Primary Label */}
      <div>
        <label className="block font-medium text-slate-300 mb-1">Component Label / Title</label>
        <input
          type="text"
          value={element.label}
          onChange={(e) => onUpdate({ ...element, label: e.target.value })}
          className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Helper text or description */}
      {element.type !== 'divider' && element.type !== 'splash_screen' && (
        <div>
          <label className="block font-medium text-slate-300 mb-1">Helper Text / Subtitle</label>
          <input
            type="text"
            value={element.helperText || ''}
            onChange={(e) => onUpdate({ ...element, helperText: e.target.value })}
            placeholder="Optional descriptive subtext"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* INTERACTIVE TRANSITION & DESTINATION CONFIGURATION             */}
      {/* ============================================================== */}
      {isInteractiveComponent && (
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
            <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-indigo-400" />
              Screen Transition & Link
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="checkbox"
                id="elHasAction"
                checked={!!element.hasAction}
                onChange={(e) =>
                  onUpdate({
                    ...element,
                    hasAction: e.target.checked,
                    actionType: 'navigate',
                    targetScreenId: element.targetScreenId || screens[1]?.id || screens[0]?.id,
                    transition: element.transition || 'slide-left',
                    transitionDuration: element.transitionDuration || 350,
                  })
                }
                className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="elHasAction" className="text-[10px] font-semibold text-slate-300 cursor-pointer">
                Link Active
              </label>
            </div>
          </div>

          {element.hasAction && (
            <>
              {/* Destination Screen Picker */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">Destination Target Screen</label>
                <select
                  value={element.targetScreenId || ''}
                  onChange={(e) => onUpdate({ ...element, targetScreenId: e.target.value, actionType: 'navigate' })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Choose Destination Artboard...</option>
                  {screens.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.route})
                    </option>
                  ))}
                </select>
              </div>

              {/* Animated Transition Type */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">Screen Transition Effect</label>
                <select
                  value={element.transition || 'slide-left'}
                  onChange={(e) => onUpdate({ ...element, transition: e.target.value as TransitionType })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="slide-left">Slide Left (Forward Push - iOS Style)</option>
                  <option value="slide-right">Slide Right (Back / Return)</option>
                  <option value="slide-up">Slide Up (Bottom Modal Sheet)</option>
                  <option value="slide-down">Slide Down (Top Drawer Reveal)</option>
                  <option value="fade">Crossfade (Dissolve Blend)</option>
                  <option value="pop">Scale Pop (Spring Dialog / Alert)</option>
                  <option value="flip">3D Card Flip (Perspective Flip)</option>
                  <option value="bounce">Spring Elastic Bounce</option>
                </select>
              </div>

              {/* Transition Duration & Speed */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Duration</label>
                  <select
                    value={element.transitionDuration || 350}
                    onChange={(e) => onUpdate({ ...element, transitionDuration: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-2 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value={200}>Fast (200ms)</option>
                    <option value={350}>Normal (350ms)</option>
                    <option value={500}>Smooth (500ms)</option>
                    <option value={800}>Cinematic (800ms)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Easing</label>
                  <select
                    value={element.transitionEasing || 'ease-out'}
                    onChange={(e) => onUpdate({ ...element, transitionEasing: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-2 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="ease-out">Ease Out (Decel)</option>
                    <option value="ease-in-out">Ease In-Out</option>
                    <option value="spring">Spring Curve</option>
                    <option value="linear">Linear</option>
                  </select>
                </div>
              </div>

              {/* Actions & Live Simulation */}
              <div className="space-y-1.5 pt-1">
                {onTest && (
                  <button
                    type="button"
                    onClick={() => onTest(element, element.targetScreenId, element.transition || 'slide-left', element.transitionDuration || 350, element.transitionEasing || 'ease-out')}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all active:scale-98"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Simulate Transition in Phone</span>
                  </button>
                )}
                {onSwitchToTransitions && (
                  <button
                    type="button"
                    onClick={onSwitchToTransitions}
                    className="w-full flex items-center justify-center gap-1 py-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    <span>Open in full Transitions Panel</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SPLASH SCREEN INTRO & OUTRO PROPERTIES PANEL                   */}
      {/* ============================================================== */}
      {element.type === 'splash_screen' && (
        <div className="space-y-4 rounded-2xl border border-blue-500/40 bg-slate-950/80 p-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h4 className="font-bold text-white text-xs">Splash Screen Launch Settings</h4>
            </div>
            <span className="rounded bg-blue-500/15 border border-blue-500/30 px-1.5 py-0.5 text-[9px] font-mono font-bold text-blue-300">
              Intro & Outro
            </span>
          </div>

          {/* 1. File Type Picker (.PNG vs .MP4) */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Media Asset File Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdate({ ...element, splashFileType: 'png' })}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold border transition-all ${
                  element.splashFileType !== 'mp4'
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300 ring-1 ring-blue-500/40'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>.PNG (Static Emblem)</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({
                  ...element,
                  splashFileType: 'mp4',
                  splashMediaUrl: element.splashMediaUrl || 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4',
                  splashVideoSizeMode: element.splashVideoSizeMode || 'fullscreen',
                })}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold border transition-all ${
                  element.splashFileType === 'mp4'
                    ? 'border-purple-500 bg-purple-600/20 text-purple-300 ring-1 ring-purple-500/40'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <Video className="h-3.5 w-3.5 text-purple-400" />
                <span>.MP4 (Motion Video)</span>
              </button>
            </div>
          </div>

          {/* Media URL + Upload + Demo Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-slate-300">
                {element.splashFileType === 'mp4' ? 'Motion Video Source' : 'Image Source URL'}
              </label>
              {element.splashFileType === 'mp4' && (
                <span className="text-[10px] text-purple-300 font-mono flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Active Video
                </span>
              )}
            </div>

            {/* Upload Video / Choose File Button */}
            {element.splashFileType === 'mp4' && (
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 px-3 py-2 text-xs font-semibold text-purple-200 cursor-pointer transition-all shadow-sm">
                  <Film className="h-3.5 w-3.5 text-purple-400" />
                  <span>Choose Video File from Computer</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const blobUrl = URL.createObjectURL(file);
                        onUpdate({
                          ...element,
                          splashFileType: 'mp4',
                          splashMediaUrl: blobUrl,
                          splashVideoSizeMode: element.splashVideoSizeMode || 'fullscreen',
                        });
                      }
                    }}
                  />
                </label>
              </div>
            )}

            {/* URL Input with auto-video detection */}
            <div>
              <input
                type="text"
                value={element.splashMediaUrl || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const isVid = val.toLowerCase().includes('.mp4') || val.toLowerCase().includes('.webm') || val.toLowerCase().includes('.mov') || val.startsWith('blob:') || val.toLowerCase().includes('video');
                  onUpdate({
                    ...element,
                    splashMediaUrl: val,
                    ...(isVid ? { splashFileType: 'mp4', splashVideoSizeMode: element.splashVideoSizeMode || 'fullscreen' } : {}),
                  });
                }}
                placeholder={element.splashFileType === 'mp4' ? 'Enter video URL (e.g. .mp4) or pick preset below' : 'https://...image.png'}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Quick Presets Grid */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>Instant Motion Presets:</span>
                <span className="text-[9px] text-purple-400 font-mono">1-Click Apply</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...element,
                      splashFileType: 'mp4',
                      splashMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4',
                      splashVideoSizeMode: 'fullscreen',
                    })
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/60 p-1.5 text-left text-purple-200 transition-colors"
                >
                  <Play className="h-3 w-3 text-purple-400 shrink-0" />
                  <span className="truncate">Digital Screens</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...element,
                      splashFileType: 'mp4',
                      splashMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
                      splashVideoSizeMode: 'fullscreen',
                    })
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/60 p-1.5 text-left text-purple-200 transition-colors"
                >
                  <Play className="h-3 w-3 text-cyan-400 shrink-0" />
                  <span className="truncate">Fluid Waves</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...element,
                      splashFileType: 'mp4',
                      splashMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
                      splashVideoSizeMode: 'fullscreen',
                    })
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/60 p-1.5 text-left text-purple-200 transition-colors"
                >
                  <Play className="h-3 w-3 text-amber-400 shrink-0" />
                  <span className="truncate">Cosmic Particles</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...element,
                      splashFileType: 'mp4',
                      splashMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1728-large.mp4',
                      splashVideoSizeMode: 'fullscreen',
                    })
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/60 p-1.5 text-left text-purple-200 transition-colors"
                >
                  <Play className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span className="truncate">Tech Code Loop</span>
                </button>
              </div>
            </div>
          </div>

          {/* Motion Video Splash Full Screen & Proportional Resizer Tool */}
          {element.splashFileType === 'mp4' ? (
            <MotionVideoSplashResizer element={element} onUpdate={onUpdate} />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-2.5 text-center">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Motion Video Sizing Tool</span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...element,
                      splashFileType: 'mp4',
                      splashMediaUrl:
                        element.splashMediaUrl ||
                        'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4',
                    })
                  }
                  className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Enable .MP4 Resizer →
                </button>
              </div>
            </div>
          )}

          {/* Brand Title & Tagline */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Brand Title</label>
              <input
                type="text"
                value={element.splashBrandTitle || ''}
                onChange={(e) => onUpdate({ ...element, splashBrandTitle: e.target.value })}
                placeholder="App Title"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Tagline</label>
              <input
                type="text"
                value={element.splashTagline || ''}
                onChange={(e) => onUpdate({ ...element, splashTagline: e.target.value })}
                placeholder="Subtitle slogan"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. INTRO PROPERTIES PANEL */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 space-y-2.5">
            <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1.5 uppercase tracking-wide">
              <Play className="h-3 w-3 fill-current" />
              Intro Properties Panel
            </span>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Intro Animation Effect</label>
              <select
                value={element.splashIntroAnimation || 'scale-up'}
                onChange={(e) => onUpdate({ ...element, splashIntroAnimation: e.target.value as any })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="scale-up">Scale-Up Zoom (iOS Fluid Zoom)</option>
                <option value="fade-in">Smooth Fade-In (Gentle Dissolve)</option>
                <option value="blur-in">Lens Blur-In (Cinematic Optics)</option>
                <option value="slide-up">Slide Up From Bottom</option>
                <option value="pulse">Holographic Pulse Reveal</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Intro Duration</label>
                <select
                  value={element.splashIntroDuration || 0.8}
                  onChange={(e) => onUpdate({ ...element, splashIntroDuration: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value={0.4}>Fast (0.4s)</option>
                  <option value={0.8}>Standard (0.8s)</option>
                  <option value={1.2}>Slow (1.2s)</option>
                  <option value={1.8}>Cinematic (1.8s)</option>
                </select>
              </div>

              <div className="flex items-end pb-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!element.splashIntroSound}
                    onChange={(e) => onUpdate({ ...element, splashIntroSound: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                  />
                  <span>Haptic & Audio</span>
                </label>
              </div>
            </div>
          </div>

          {/* 3. DWELL & DISPLAY TIME */}
          <div className="grid grid-cols-2 gap-2 items-center bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Dwell Display Time</label>
              <select
                value={element.splashDwellDuration || 2.5}
                onChange={(e) => onUpdate({ ...element, splashDwellDuration: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value={1.5}>1.5 Seconds</option>
                <option value={2.0}>2.0 Seconds</option>
                <option value={2.5}>2.5 Seconds (Default)</option>
                <option value={3.5}>3.5 Seconds</option>
                <option value={5.0}>5.0 Seconds (Long Video)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 pt-3">
              <input
                type="checkbox"
                id="splashAutoAdv"
                checked={element.splashAutoAdvance !== false}
                onChange={(e) => onUpdate({ ...element, splashAutoAdvance: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
              />
              <label htmlFor="splashAutoAdv" className="text-xs text-slate-300 cursor-pointer">
                Auto-advance on finish
              </label>
            </div>
          </div>

          {/* 4. OUTRO PROPERTIES PANEL */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 space-y-2.5">
            <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wide">
              <ArrowRight className="h-3 w-3" />
              Outro Properties Panel
            </span>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Outro Animation Effect</label>
              <select
                value={element.splashOutroAnimation || 'fade-out'}
                onChange={(e) => onUpdate({ ...element, splashOutroAnimation: e.target.value as any })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="fade-out">Fade Out to App (Classic Crossfade)</option>
                <option value="slide-up-curtain">Slide-Up Curtain (Theatrical Reveal)</option>
                <option value="zoom-through">Zoom-Through Fly-In (Immersive Dive)</option>
                <option value="iris-wipe">Iris Wipe (Circular Radial)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Outro Duration</label>
                <select
                  value={element.splashOutroDuration || 0.5}
                  onChange={(e) => onUpdate({ ...element, splashOutroDuration: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value={0.3}>Fast (0.3s)</option>
                  <option value={0.5}>Standard (0.5s)</option>
                  <option value={0.8}>Slow (0.8s)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Next Destination</label>
                <select
                  value={element.splashTargetScreenId || element.targetScreenId || ''}
                  onChange={(e) =>
                    onUpdate({
                      ...element,
                      splashTargetScreenId: e.target.value,
                      targetScreenId: e.target.value,
                      hasAction: true,
                      actionType: 'navigate',
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Next Flow Screen...</option>
                  {screens.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Test Splash Button */}
          {onTest && (
            <button
              type="button"
              onClick={() => onTest(element)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Simulate Splash Sequence Now</span>
            </button>
          )}
        </div>
      )}

      {/* Social Login specific properties */}
      {element.type === 'social_login' && (
        <div>
          <label className="block font-medium text-slate-300 mb-1">Active Provider</label>
          <select
            value={element.socialProvider || 'stack'}
            onChange={(e) => onUpdate({ ...element, socialProvider: e.target.value as any })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="stack">Google & Apple Dual Stack</option>
            <option value="google">Google SSO Button Only</option>
            <option value="apple">Apple Sign-In Button Only</option>
            <option value="github">GitHub OAuth Button Only</option>
          </select>
        </div>
      )}

      {/* Input specific properties */}
      {element.type === 'input' && (
        <>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Input Field Type</label>
            <select
              value={element.inputType || 'text'}
              onChange={(e) => onUpdate({ ...element, inputType: e.target.value as any })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="text">Text (General)</option>
              <option value="email">Email Address</option>
              <option value="password">Password (Masked)</option>
              <option value="number">Numeric / Currency</option>
              <option value="search">Search Input</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Placeholder Text</label>
            <input
              type="text"
              value={element.placeholder || ''}
              onChange={(e) => onUpdate({ ...element, placeholder: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </>
      )}

      {/* Metric specific properties */}
      {element.type === 'metric' && (
        <>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Metric Value</label>
            <input
              type="text"
              value={element.metricValue || ''}
              onChange={(e) => onUpdate({ ...element, metricValue: e.target.value })}
              placeholder="$148,920.45"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Trend / Percentage Change</label>
            <input
              type="text"
              value={element.metricChange || ''}
              onChange={(e) => onUpdate({ ...element, metricChange: e.target.value })}
              placeholder="+12.4% past 30 days"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-emerald-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </>
      )}

      {/* Financial KPI Stat specific properties */}
      {element.type === 'kpi_stat' && (
        <div className="space-y-2.5 rounded-2xl border border-blue-500/30 bg-blue-950/20 p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Fintech KPI Stat Properties</span>
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Metric Value</label>
            <input
              type="text"
              value={element.metricValue || ''}
              onChange={(e) => onUpdate({ ...element, metricValue: e.target.value })}
              placeholder="$148,920.45"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Trend / Percentage Delta</label>
            <input
              type="text"
              value={element.metricChange || ''}
              onChange={(e) => onUpdate({ ...element, metricChange: e.target.value })}
              placeholder="+14.2% past 30 days"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-emerald-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Financial Line & Bar Chart Specific Properties */}
      {(element.type === 'line_chart' || element.type === 'bar_chart') && (
        <div className="space-y-3 rounded-2xl border border-blue-500/30 bg-blue-950/20 p-3">
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
            <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
              {element.type === 'line_chart' ? <LineChart className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
              {element.type === 'line_chart' ? 'Line / Area Chart Settings' : 'Histogram Bar Chart Settings'}
            </span>
            <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-blue-300">
              Interactive
            </span>
          </div>

          {/* Timeframe Presets */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Active Timeframe Range</label>
            <div className="grid grid-cols-5 gap-1 text-center">
              {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => onUpdate({ ...element, chartTimeframe: tf })}
                  className={`rounded-lg py-1 text-[11px] font-mono font-bold border transition-all ${
                    (element.chartTimeframe || '1M') === tf
                      ? 'border-blue-500 bg-blue-600 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color & Fill Gradient */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Chart Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={element.chartLineColor || (element.type === 'line_chart' ? '#3B82F6' : '#10B981')}
                  onChange={(e) => onUpdate({ ...element, chartLineColor: e.target.value })}
                  className="h-8 w-8 cursor-pointer rounded-lg border border-slate-700 bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={element.chartLineColor || (element.type === 'line_chart' ? '#3B82F6' : '#10B981')}
                  onChange={(e) => onUpdate({ ...element, chartLineColor: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 font-mono text-[11px] text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Currency Prefix</label>
              <input
                type="text"
                value={element.chartYAxisPrefix || '$'}
                onChange={(e) => onUpdate({ ...element, chartYAxisPrefix: e.target.value })}
                placeholder="$"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 font-mono text-xs text-white"
              />
            </div>
          </div>

          {/* Visual Toggles */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            {element.type === 'line_chart' && (
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Area Gradient Fill</span>
                <input
                  type="checkbox"
                  checked={element.chartShowAreaGradient ?? true}
                  onChange={(e) => onUpdate({ ...element, chartShowAreaGradient: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                />
              </label>
            )}

            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span>Show Background Grid</span>
              <input
                type="checkbox"
                checked={element.chartShowGrid ?? true}
                onChange={(e) => onUpdate({ ...element, chartShowGrid: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
              />
            </label>

            {element.type === 'line_chart' && (
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Highlight Data Points</span>
                <input
                  type="checkbox"
                  checked={element.chartShowPoints ?? true}
                  onChange={(e) => onUpdate({ ...element, chartShowPoints: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Portfolio Donut Diagram Properties */}
      {element.type === 'donut_chart' && (
        <div className="space-y-3 rounded-2xl border border-purple-500/30 bg-purple-950/20 p-3">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <PieChart className="h-4 w-4 text-purple-400" />
              <span>Asset Allocation Donut Segments</span>
            </span>
            <span className="text-[10px] font-mono text-purple-300">
              {(element.donutSegments || []).length} assets
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {(element.donutSegments || [
              { label: 'Bitcoin (BTC)', value: 62540, color: '#F59E0B', percentage: 42 },
              { label: 'Ethereum (ETH)', value: 41700, color: '#6366F1', percentage: 28 },
              { label: 'Solana (SOL)', value: 26800, color: '#10B981', percentage: 18 },
              { label: 'USDC Treasury', value: 17880, color: '#0EA5E9', percentage: 12 },
            ]).map((seg, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-2">
                <input
                  type="color"
                  value={seg.color}
                  onChange={(e) => {
                    const next = [...(element.donutSegments || [])];
                    if (next[idx]) next[idx] = { ...next[idx], color: e.target.value };
                    onUpdate({ ...element, donutSegments: next });
                  }}
                  className="h-6 w-6 rounded border border-slate-700 bg-transparent cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={seg.label}
                  onChange={(e) => {
                    const next = [...(element.donutSegments || [])];
                    if (next[idx]) next[idx] = { ...next[idx], label: e.target.value };
                    onUpdate({ ...element, donutSegments: next });
                  }}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white"
                />
                <input
                  type="number"
                  value={seg.value}
                  onChange={(e) => {
                    const next = [...(element.donutSegments || [])];
                    if (next[idx]) next[idx] = { ...next[idx], value: Number(e.target.value) };
                    onUpdate({ ...element, donutSegments: next });
                  }}
                  className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-xs text-white"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              const current = element.donutSegments || [];
              const colors = ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
              const nextColor = colors[current.length % colors.length];
              const newSeg = { label: `Asset ${current.length + 1}`, value: 15000, color: nextColor, percentage: 10 };
              onUpdate({ ...element, donutSegments: [...current, newSeg] });
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-purple-500/40 bg-purple-500/10 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Asset Segment</span>
          </button>
        </div>
      )}

      {/* Credit & Risk Gauge Diagram Properties */}
      {element.type === 'gauge_diagram' && (
        <div className="space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-emerald-400" />
              <span>Radial Gauge & Score Meter</span>
            </span>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
              {element.gaugeValue ?? 785} / {element.gaugeMax ?? 850}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Current Score</label>
              <input
                type="number"
                value={element.gaugeValue ?? 785}
                onChange={(e) => onUpdate({ ...element, gaugeValue: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1.5 font-mono text-xs text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Scale Min</label>
              <input
                type="number"
                value={element.gaugeMin ?? 300}
                onChange={(e) => onUpdate({ ...element, gaugeMin: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1.5 font-mono text-xs text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Scale Max</label>
              <input
                type="number"
                value={element.gaugeMax ?? 850}
                onChange={(e) => onUpdate({ ...element, gaugeMax: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1.5 font-mono text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Score Label</label>
            <input
              type="text"
              value={element.gaugeLabel || 'Excellent Standing'}
              onChange={(e) => onUpdate({ ...element, gaugeLabel: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Health Status</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['healthy', 'moderate', 'critical'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onUpdate({ ...element, gaugeStatus: st })}
                  className={`rounded-lg py-1.5 text-[11px] font-semibold capitalize border transition-all ${
                    (element.gaugeStatus || 'healthy') === st
                      ? st === 'healthy' ? 'border-emerald-500 bg-emerald-600/30 text-emerald-300' :
                        st === 'moderate' ? 'border-amber-500 bg-amber-600/30 text-amber-300' :
                        'border-rose-500 bg-rose-600/30 text-rose-300'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Market Ticker Tape Properties */}
      {element.type === 'live_ticker' && (
        <div className="space-y-3 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-3">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>Real-Time Market Ticker Tape</span>
            </span>
            <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-cyan-300">
              {(element.tickerItems || []).length} Tickers
            </span>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {(element.tickerItems || [
              { symbol: 'BTC/USD', price: '$68,450.00', change: '+3.42%', isUp: true },
              { symbol: 'ETH/USD', price: '$3,520.80', change: '+2.15%', isUp: true },
              { symbol: 'SOL/USD', price: '$184.25', change: '+8.60%', isUp: true },
              { symbol: 'S&P 500', price: '5,815.20', change: '+0.54%', isUp: true },
            ]).map((tick, tIdx) => (
              <div key={tIdx} className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 text-xs">
                <input
                  type="text"
                  value={tick.symbol}
                  onChange={(e) => {
                    const next = [...(element.tickerItems || [])];
                    if (next[tIdx]) next[tIdx] = { ...next[tIdx], symbol: e.target.value };
                    onUpdate({ ...element, tickerItems: next });
                  }}
                  className="w-20 rounded border border-slate-700 bg-slate-950 px-1.5 py-1 font-mono text-[11px] text-white"
                />
                <input
                  type="text"
                  value={tick.price}
                  onChange={(e) => {
                    const next = [...(element.tickerItems || [])];
                    if (next[tIdx]) next[tIdx] = { ...next[tIdx], price: e.target.value };
                    onUpdate({ ...element, tickerItems: next });
                  }}
                  className="flex-1 rounded border border-slate-700 bg-slate-950 px-1.5 py-1 font-mono text-[11px] text-white"
                />
                <input
                  type="text"
                  value={tick.change}
                  onChange={(e) => {
                    const next = [...(element.tickerItems || [])];
                    const val = e.target.value;
                    const isUp = !val.startsWith('-');
                    if (next[tIdx]) next[tIdx] = { ...next[tIdx], change: val, isUp };
                    onUpdate({ ...element, tickerItems: next });
                  }}
                  className={`w-16 rounded border border-slate-700 bg-slate-950 px-1.5 py-1 font-mono text-[11px] font-bold ${
                    tick.isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              const current = element.tickerItems || [];
              const newItem = { symbol: 'NEW/USD', price: '$100.00', change: '+1.50%', isUp: true };
              onUpdate({ ...element, tickerItems: [...current, newItem] });
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/10 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Ticker Symbol</span>
          </button>
        </div>
      )}

      {/* Form Container specific properties */}
      {element.type === 'form_container' && (
        <>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Form Card Title</label>
            <input
              type="text"
              value={element.formTitle || ''}
              onChange={(e) => onUpdate({ ...element, formTitle: e.target.value })}
              placeholder="e.g. Account Registration"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Submit CTA Button Label</label>
            <input
              type="text"
              value={element.formSubmitLabel || ''}
              onChange={(e) => onUpdate({ ...element, formSubmitLabel: e.target.value })}
              placeholder="e.g. Complete Verification"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Compliance / Security Footnote</label>
            <input
              type="text"
              value={element.formFooterNote || ''}
              onChange={(e) => onUpdate({ ...element, formFooterNote: e.target.value })}
              placeholder="e.g. 256-bit TLS encrypted"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </>
      )}

      {/* Media Placeholder & Internet Video Player Specific Properties */}
      {(element.type === 'media_placeholder' || element.type === 'video_player') && (
        <div className="space-y-4 rounded-2xl border border-blue-500/40 bg-slate-950/80 p-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Video className="h-4 w-4 text-blue-400" />
              <h4 className="text-xs font-bold text-white">Internet Video & Media Streaming</h4>
            </div>
            <span className="rounded bg-blue-500/20 text-blue-300 px-1.5 py-0.5 text-[9px] font-mono font-bold">
              16:9 Stream
            </span>
          </div>

          {element.type === 'media_placeholder' && (
            <div>
              <label className="block font-medium text-slate-300 mb-1.5">Media Frame Mode</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                {[
                  { id: 'video', label: '16:9 Video Frame', icon: Video },
                  { id: 'image', label: 'Image Frame', icon: ImageIcon },
                  { id: 'document', label: 'KYC Document', icon: FileCheck },
                  { id: 'audio', label: 'Audio Wave', icon: Volume2 },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = (element.mediaType || 'video') === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => onUpdate({ ...element, mediaType: mode.id as any })}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIDEO SOURCE FILE INPUT (Where to put the source file in properties panel) */}
          {(element.type === 'video_player' || (element.mediaType || 'video') === 'video') ? (
            <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wide flex items-center gap-1">
                  <PlayCircle className="h-3.5 w-3.5 text-blue-400" />
                  Video Source File & Stream URL
                </span>
                <span className="text-[9px] font-mono text-slate-400">.mp4 / WebM / Stream</span>
              </div>

              {/* Main Source File URL Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-200 mb-1">
                  Video File URL (Internet or Local)
                </label>
                <input
                  type="text"
                  value={element.videoUrl || element.imageUrl || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const isVid = val.match(/\.(mp4|webm|mov)$/i) || val.includes('mixkit') || val.includes('video') || val.includes('youtube') || val.includes('youtu.be');
                    onUpdate({
                      ...element,
                      videoUrl: val,
                      imageUrl: val,
                      mediaType: isVid ? 'video' : element.mediaType || 'video',
                    });
                  }}
                  placeholder="https://.../video.mp4 or internet stream link"
                  className="w-full rounded-xl border border-blue-500/40 bg-slate-900 px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <p className="mt-1 text-[10px] text-slate-400 leading-tight">
                  Paste your internet video URL (.mp4, direct video stream, or embed link) here.
                </p>
              </div>

              {/* Action Buttons: Browse Graphic Assets CMS + Local Computer Picker */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenGraphicCms?.({ elementName: element.name, elementType: element.type, mode: 'video' })}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/40 border border-violet-500/40 p-2 text-xs font-semibold text-violet-200 shadow-sm transition-all text-center"
                  title="Open Graphic Assets CMS with local computer search"
                >
                  <FolderSearch className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                  <span className="truncate">Open Assets CMS</span>
                </button>

                <label className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 p-2 text-xs font-semibold text-blue-200 cursor-pointer shadow-sm transition-all text-center">
                  <HardDrive className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">Computer Disk</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        onUpdate({
                          ...element,
                          videoUrl: url,
                          imageUrl: url,
                          label: file.name.replace(/\.[^/.]+$/, ''),
                        });
                      }
                    }}
                  />
                </label>
              </div>

              {/* 1-Click High-Quality Internet Video Presets */}
              <div className="pt-1 border-t border-slate-800/80">
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">
                  Quick Internet Video Presets
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Tech Screens Loop', url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4', dur: '00:15' },
                    { label: 'Ocean Waves', url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4', dur: '00:18' },
                    { label: 'Deep Space Stars', url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4', dur: '00:24' },
                    { label: 'Developer Terminal', url: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1728-large.mp4', dur: '00:20' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => onUpdate({ ...element, videoUrl: preset.url, imageUrl: preset.url, mediaDuration: preset.dur })}
                      className="flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 px-2 py-1 text-[10px] text-slate-300 hover:text-white transition-all text-left"
                    >
                      <span className="truncate">{preset.label}</span>
                      <span className="text-[9px] text-blue-400 font-mono ml-1">{preset.dur}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Playback Controls Configuration */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Playback Controls
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={element.videoAutoplay ?? false}
                      onChange={(e) => onUpdate({ ...element, videoAutoplay: e.target.checked })}
                      className="h-3.5 w-3.5 rounded text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Autoplay</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={element.videoLoop ?? true}
                      onChange={(e) => onUpdate({ ...element, videoLoop: e.target.checked })}
                      className="h-3.5 w-3.5 rounded text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Loop Video</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={element.videoMuted ?? true}
                      onChange={(e) => onUpdate({ ...element, videoMuted: e.target.checked })}
                      className="h-3.5 w-3.5 rounded text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Mute Audio</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={element.videoControls ?? true}
                      onChange={(e) => onUpdate({ ...element, videoControls: e.target.checked })}
                      className="h-3.5 w-3.5 rounded text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Show Controls</span>
                  </label>
                </div>
              </div>

              {/* Poster Image URL */}
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">
                  Video Poster Thumbnail URL (Optional)
                </label>
                <input
                  type="text"
                  value={element.videoPoster || ''}
                  onChange={(e) => onUpdate({ ...element, videoPoster: e.target.value })}
                  placeholder="https://...poster.jpg"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5 text-blue-400" />
                  Media / Graphic Asset Source
                </span>
                <button
                  type="button"
                  onClick={() => onUpdate({ ...element, mediaType: 'video' })}
                  className="rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white px-2 py-0.5 text-[9px] font-semibold transition-all"
                >
                  Switch to 16:9 Video
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-200 mb-1">
                  Media Source URL
                </label>
                <input
                  type="text"
                  value={element.imageUrl || element.videoUrl || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const isVid = val.match(/\.(mp4|webm|mov)$/i) || val.includes('mixkit') || val.includes('video') || val.includes('youtube') || val.includes('youtu.be');
                    onUpdate({
                      ...element,
                      imageUrl: val,
                      videoUrl: isVid ? val : element.videoUrl,
                      mediaType: isVid ? 'video' : element.mediaType || 'image',
                    });
                  }}
                  placeholder="https://...image.png or video stream link"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* Action Buttons: Browse Graphic Assets CMS + Local Computer Picker */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenGraphicCms?.({ elementName: element.name, elementType: element.type, mode: 'image' })}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/40 border border-violet-500/40 p-2 text-xs font-semibold text-violet-200 shadow-sm transition-all text-center"
                  title="Open Graphic Assets CMS with local computer search"
                >
                  <FolderSearch className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                  <span className="truncate">Open Assets CMS</span>
                </button>

                <label className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 p-2 text-xs font-semibold text-blue-200 cursor-pointer shadow-sm transition-all text-center">
                  <HardDrive className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">Computer Disk</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        onUpdate({
                          ...element,
                          imageUrl: url,
                          label: file.name.replace(/\.[^/.]+$/, ''),
                        });
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-300 mb-1">Duration Tag</label>
            <input
              type="text"
              value={element.mediaDuration || ''}
              onChange={(e) => onUpdate({ ...element, mediaDuration: e.target.value })}
              placeholder="e.g. 02:45"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Media Caption</label>
            <input
              type="text"
              value={element.mediaCaption || ''}
              onChange={(e) => onUpdate({ ...element, mediaCaption: e.target.value })}
              placeholder="e.g. Watch product demo"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* RESPONSIVE & FULLSCREEN IMAGE BANNER PROPERTIES                */}
      {/* ============================================================== */}
      {element.type === 'image_banner' && (
        <div className="space-y-4 rounded-2xl border border-blue-500/40 bg-slate-950/80 p-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-blue-400" />
              <h4 className="text-xs font-bold text-white">Image Sizing & Fullscreen Controls</h4>
            </div>
            <span className="rounded bg-blue-500/20 text-blue-300 px-1.5 py-0.5 text-[9px] font-mono font-bold">
              Responsive
            </span>
          </div>

          {/* Upload or URL or CMS */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Image Source</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => onOpenGraphicCms?.({ elementName: element.name, elementType: element.type, mode: 'image' })}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/40 border border-violet-500/40 px-2 py-2 text-xs font-semibold text-violet-200 transition-all shadow-sm"
                title="Browse Graphic Assets CMS and search local computer"
              >
                <FolderSearch className="h-3.5 w-3.5 text-violet-400" />
                <span>Browse CMS</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 px-2 py-2 text-xs font-semibold text-blue-200 cursor-pointer transition-all shadow-sm">
                <Upload className="h-3.5 w-3.5 text-blue-400" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      onUpdate({
                        ...element,
                        imageUrl: url,
                      });
                    }
                  }}
                />
              </label>
            </div>
            <input
              type="text"
              value={element.imageUrl || ''}
              onChange={(e) => onUpdate({ ...element, imageUrl: e.target.value })}
              placeholder="https://...image.png"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Sizing Mode: Fullscreen vs Responsive vs Custom */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Display Size Mode</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'responsive', label: 'Responsive' },
                { id: 'fullscreen', label: 'Fullscreen' },
                { id: 'custom', label: 'Custom' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onUpdate({ ...element, imageSizeMode: mode.id as any })}
                  className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    (element.imageSizeMode || 'responsive') === mode.id
                      ? 'border-blue-500 bg-blue-600/20 text-blue-300 ring-1 ring-blue-500/40'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Aspect Ratio</label>
            <div className="grid grid-cols-5 gap-1 text-center">
              {['16:9', '4:3', '1:1', '9:16', 'custom'].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => onUpdate({ ...element, imageAspectRatio: ratio as any })}
                  className={`py-1 text-[10px] font-mono rounded-lg border transition-all ${
                    (element.imageAspectRatio || '16:9') === ratio
                      ? 'border-blue-500 bg-blue-600/20 text-blue-300 font-bold'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Height Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-slate-300">Height</label>
              <span className="text-[10px] font-mono text-blue-400">
                {element.imageCustomHeight || 140}px
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={450}
              step={10}
              value={element.imageCustomHeight || 140}
              onChange={(e) => onUpdate({ ...element, imageCustomHeight: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Object Fit & Dark Scrim */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Object Fit</label>
              <select
                value={element.imageFit || 'cover'}
                onChange={(e) => onUpdate({ ...element, imageFit: e.target.value as any })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="cover">Cover (Fill Frame)</option>
                <option value="contain">Contain (Full Image)</option>
                <option value="fill">Stretch / Fill</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Scrim Gradient</label>
              <button
                type="button"
                onClick={() => onUpdate({ ...element, imageDarkScrim: !element.imageDarkScrim })}
                className={`w-full py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  element.imageDarkScrim !== false
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400'
                }`}
              >
                {element.imageDarkScrim !== false ? 'Scrim Active' : 'No Scrim'}
              </button>
            </div>
          </div>

          {/* Allow Tap-to-Fullscreen Modal */}
          <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2.5 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Tap to Expand Fullscreen</span>
              <span className="text-[10px] text-slate-400">Allow users to open full photo lightbox in simulator</span>
            </div>
            <input
              type="checkbox"
              checked={element.imageAllowFullscreenModal !== false}
              onChange={(e) => onUpdate({ ...element, imageAllowFullscreenModal: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BANNER IMAGE CAROUSEL & GRAPHIC ASSET SLIDER CUSTOMIZATION     */}
      {/* ============================================================== */}
      {(element.type === 'asset_slider' || element.type === 'carousel') && (
        <div className="space-y-4 rounded-2xl border border-indigo-500/40 bg-slate-950/80 p-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <GalleryHorizontalEnd className="h-4 w-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white">Banner Image Carousel Settings</h4>
            </div>
            <span className="rounded bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 text-[9px] font-mono font-bold">
              Interactive
            </span>
          </div>

          {/* Quick Actions: Open Graphic Assets CMS + Upload Local Computer Files */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              Insert Banner Graphic Assets
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOpenGraphicCms?.({ elementName: element.name, elementType: element.type, mode: 'carousel_slide' })}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/40 border border-violet-500/40 px-3 py-2 text-xs font-semibold text-violet-200 transition-all shadow-sm"
                title="Browse Graphic Assets CMS and search local computer"
              >
                <FolderSearch className="h-3.5 w-3.5 text-violet-400" />
                <span>Browse CMS</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 px-3 py-2 text-xs font-semibold text-indigo-200 cursor-pointer transition-all shadow-sm">
                <Upload className="h-3.5 w-3.5 text-indigo-400" />
                <span>Upload Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      const newSlides: CarouselSlideItem[] = files.map((file, i) => ({
                        id: `slide_upload_${Date.now()}_${i}`,
                        imageUrl: URL.createObjectURL(file),
                        title: file.name.replace(/\.[^/.]+$/, ''),
                        subtitle: 'Uploaded banner image',
                        targetScreenId: screens[1]?.id || screens[0]?.id,
                        transition: 'slide-left',
                      }));
                      const existing = (element.carouselSlides || element.sliderSlides || []);
                      onUpdate({
                        ...element,
                        carouselSlides: [...existing, ...newSlides],
                        sliderSlides: [...existing, ...newSlides],
                      });
                    }
                  }}
                />
              </label>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">
              Pick from the Graphic Assets CMS or select multiple .PNG/.JPG files from your computer.
            </p>
          </div>

          {/* TIMING & SPEED CUSTOMIZATION PANEL */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3 space-y-3">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide block">
              Carousel Timing & Motion Controls
            </span>

            {/* 1. Dwell / Pause Timing Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-200">
                  Pause Dwell Timing
                </label>
                <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/30">
                  {(((element.carouselInterval || element.sliderInterval || 3000)) / 1000).toFixed(1)}s Pause
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={8000}
                step={250}
                value={element.carouselInterval || element.sliderInterval || 3000}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdate({ ...element, carouselInterval: val, sliderInterval: val });
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>1.0s fast cycle</span>
                <span>3.0s standard</span>
                <span>8.0s leisurely</span>
              </div>
            </div>

            {/* 2. Slide Animation Speed Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-200">
                  Animation Slide Speed
                </label>
                <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/30">
                  {element.carouselAnimationSpeed || 500}ms Slide
                </span>
              </div>
              <input
                type="range"
                min={150}
                max={1200}
                step={50}
                value={element.carouselAnimationSpeed || 500}
                onChange={(e) => onUpdate({ ...element, carouselAnimationSpeed: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>150ms snappy</span>
                <span>500ms balanced</span>
                <span>1200ms cinematic</span>
              </div>
            </div>

            {/* Auto Play & Pause on Hover Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-indigo-900/40">
              <div className="flex items-center justify-between rounded-lg bg-slate-950/80 p-2 border border-slate-800">
                <span className="text-xs text-slate-300">Auto Slide</span>
                <input
                  type="checkbox"
                  checked={(element.carouselAutoplay ?? element.sliderAutoPlay) !== false}
                  onChange={(e) => onUpdate({ ...element, carouselAutoplay: e.target.checked, sliderAutoPlay: e.target.checked })}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-slate-950/80 p-2 border border-slate-800">
                <span className="text-xs text-slate-300">Pause on Hover</span>
                <input
                  type="checkbox"
                  checked={(element.carouselPauseOnHover ?? element.sliderPauseOnHover) !== false}
                  onChange={(e) => onUpdate({ ...element, carouselPauseOnHover: e.target.checked, sliderPauseOnHover: e.target.checked })}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Height Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Container Height</label>
                <span className="text-[10px] font-mono text-indigo-400">
                  {element.carouselHeight || element.sliderHeight || 190}px
                </span>
              </div>
              <input
                type="range"
                min={120}
                max={360}
                step={10}
                value={element.carouselHeight || element.sliderHeight || 190}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdate({ ...element, carouselHeight: val, sliderHeight: val });
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Dots & Arrows Toggles */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(element.carouselShowDots ?? element.sliderShowDots) !== false}
                  onChange={(e) => onUpdate({ ...element, carouselShowDots: e.target.checked, sliderShowDots: e.target.checked })}
                  className="h-3.5 w-3.5 rounded text-indigo-600 focus:ring-0"
                />
                <span className="text-slate-300">Pagination Dots</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(element.carouselShowArrows ?? element.sliderShowArrows) !== false}
                  onChange={(e) => onUpdate({ ...element, carouselShowArrows: e.target.checked, sliderShowArrows: e.target.checked })}
                  className="h-3.5 w-3.5 rounded text-indigo-600 focus:ring-0"
                />
                <span className="text-slate-300">Nav Arrows</span>
              </label>
            </div>
          </div>

          {/* BANNER SLIDES MANAGER & HYPERLINK NAVIGATION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">
                Banner Slides & Hyperlinks ({((element.carouselSlides || element.sliderSlides)?.length) || 3})
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentSlides = (element.carouselSlides || element.sliderSlides || []);
                  const newSlide: CarouselSlideItem = {
                    id: `slide_${Date.now()}`,
                    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
                    title: `Banner ${currentSlides.length + 1}`,
                    subtitle: 'Tap to navigate to app section',
                    targetScreenId: screens[0]?.id,
                    transition: 'slide-left',
                  };
                  const updated = [...currentSlides, newSlide];
                  onUpdate({
                    ...element,
                    carouselSlides: updated,
                    sliderSlides: updated,
                  });
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <Plus className="h-3 w-3" />
                <span>Add Banner</span>
              </button>
            </div>

            {/* Slides list */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {((element.carouselSlides || element.sliderSlides) || [
                {
                  id: 's1',
                  imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
                  title: 'Season 9: Cyber Void Pass',
                  subtitle: 'Exclusive armory loadout',
                  targetScreenId: screens[0]?.id,
                  transition: 'slide-left',
                },
                {
                  id: 's2',
                  imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200',
                  title: 'Holographic Plasma Weapon',
                  subtitle: 'Special neon finish',
                  targetScreenId: screens[1]?.id || screens[0]?.id,
                  transition: 'fade',
                },
              ]).map((slide: any, sIdx: number) => {
                const currentSlides = (element.carouselSlides || element.sliderSlides || []);
                return (
                  <div
                    key={slide.id || sIdx}
                    className="rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 space-y-2 hover:border-indigo-500/40 transition-colors"
                  >
                    {/* Header: Thumbnail, Title, Delete */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img
                          src={slide.imageUrl}
                          alt=""
                          className="h-9 w-9 rounded-lg object-cover shrink-0 border border-slate-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={slide.title || ''}
                            onChange={(e) => {
                              const updated = currentSlides.map((s: any, i: number) =>
                                i === sIdx ? { ...s, title: e.target.value } : s
                              );
                              onUpdate({ ...element, carouselSlides: updated, sliderSlides: updated });
                            }}
                            placeholder="Banner Title (e.g. Flash Sale)"
                            className="w-full bg-transparent text-xs font-bold text-white focus:outline-none truncate"
                          />
                          <input
                            type="text"
                            value={slide.subtitle || slide.caption || ''}
                            onChange={(e) => {
                              const updated = currentSlides.map((s: any, i: number) =>
                                i === sIdx ? { ...s, subtitle: e.target.value, caption: e.target.value } : s
                              );
                              onUpdate({ ...element, carouselSlides: updated, sliderSlides: updated });
                            }}
                            placeholder="Subtitle / CTA note"
                            className="w-full bg-transparent text-[10px] text-slate-400 focus:outline-none truncate"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = currentSlides.filter((_: any, i: number) => i !== sIdx);
                            onUpdate({ ...element, carouselSlides: updated, sliderSlides: updated });
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Delete banner slide"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Image URL Input & CMS Picker for this slide */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        value={slide.imageUrl || ''}
                        onChange={(e) => {
                          const updated = currentSlides.map((s: any, i: number) =>
                            i === sIdx ? { ...s, imageUrl: e.target.value } : s
                          );
                          onUpdate({ ...element, carouselSlides: updated, sliderSlides: updated });
                        }}
                        placeholder="https://...banner.png"
                        className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => onOpenGraphicCms?.({ elementName: slide.title || `Slide ${sIdx + 1}`, elementType: 'carousel_slide', mode: 'carousel_slide', targetSlideIndex: sIdx })}
                        className="rounded-lg bg-violet-600/30 hover:bg-violet-600 px-2 py-1 text-[10px] font-semibold text-violet-200 transition-colors shrink-0"
                        title="Pick from Graphic Assets CMS"
                      >
                        CMS
                      </button>
                    </div>

                    {/* Hyperlink Destination to App Area */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-800/80">
                      <div>
                        <label className="text-[10px] font-semibold text-indigo-300 block mb-0.5 flex items-center gap-1">
                          <Link2 className="h-2.5 w-2.5" />
                          <span>Hyperlink to Screen</span>
                        </label>
                        <select
                          value={slide.targetScreenId || ''}
                          onChange={(e) => {
                            const updated = currentSlides.map((s: any, i: number) =>
                              i === sIdx ? { ...s, targetScreenId: e.target.value } : s
                            );
                            onUpdate({ ...element, carouselSlides: updated, sliderSlides: updated });
                          }}
                          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="">No Hyperlink</option>
                          {screens.map((sc) => (
                            <option key={sc.id} value={sc.id}>
                              {sc.title} ({sc.route})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">
                          Transition Animation
                        </label>
                        <select
                          value={slide.transition || 'slide-left'}
                          onChange={(e) => {
                            const updated = currentSlides.map((s: any, i: number) =>
                              i === sIdx ? { ...s, transition: e.target.value as any } : s
                            );
                            onUpdate({ ...element, carouselSlides: updated, sliderSlides: updated });
                          }}
                          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="slide-left">Slide Left</option>
                          <option value="slide-right">Slide Right</option>
                          <option value="slide-up">Slide Up</option>
                          <option value="fade">Fade In</option>
                          <option value="pop">Pop / Zoom</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FIGMA VECTOR SHAPE CONTROLS                                    */}
      {/* ============================================================== */}
      {element.type === 'shape' && (
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5">
          <span className="text-xs font-bold text-white uppercase tracking-wider block">
            Vector Shape Geometry
          </span>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Shape Kind</label>
            <div className="grid grid-cols-4 gap-1 text-xs">
              {(['rectangle', 'circle', 'triangle', 'star'] as const).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => onUpdate({ ...element, shapeKind: kind })}
                  className={`py-1.5 capitalize rounded-lg border transition-all ${
                    (element.shapeKind || 'rectangle') === kind
                      ? 'border-indigo-500 bg-indigo-600/30 text-white font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {kind}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Fill Color</label>
              <input
                type="color"
                value={element.bg || '#1E293B'}
                onChange={(e) => onUpdate({ ...element, bg: e.target.value })}
                className="h-8 w-full rounded border border-slate-700 bg-transparent p-0 cursor-pointer"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Stroke Color</label>
              <input
                type="color"
                value={element.shapeStroke || '#3B82F6'}
                onChange={(e) => onUpdate({ ...element, shapeStroke: e.target.value })}
                className="h-8 w-full rounded border border-slate-700 bg-transparent p-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
      {(element.type === 'button' || element.type === 'card' || element.type === 'header' || element.type === 'badge') && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block font-medium text-slate-300">Component Custom Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={element.bg || '#2563EB'}
              onChange={(e) => onUpdate({ ...element, bg: e.target.value })}
              className="h-8 w-10 cursor-pointer rounded border border-slate-700 bg-transparent p-0"
            />
            <input
              type="text"
              value={element.bg || ''}
              onChange={(e) => onUpdate({ ...element, bg: e.target.value })}
              placeholder="Custom HEX e.g. #2563EB"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none uppercase"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESET_SWATCH_COLORS.slice(0, 10).map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => onUpdate({ ...element, bg: hex })}
                style={{ backgroundColor: hex }}
                className="h-5 w-5 rounded-full border border-white/20 transition-transform hover:scale-125"
                title={hex}
              />
            ))}
          </div>
        </div>
      )}

      {/* Button & Card Variant Styling */}
      {(element.type === 'button' || element.type === 'card' || element.type === 'badge') && (
        <div>
          <label className="block font-medium text-slate-300 mb-1.5">Visual Variant</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['primary', 'secondary', 'outline', 'ghost', 'success', 'danger'] as const).map((variant) => (
              <button
                key={variant}
                type="button"
                onClick={() => onUpdate({ ...element, variant })}
                className={`rounded-lg py-1.5 text-[10px] font-semibold capitalize border transition-all ${
                  element.variant === variant
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300 shadow-sm'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DATA BINDING & LIVE DATA SOURCE CONFIGURATION                 */}
      {/* ============================================================== */}
      <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-b from-blue-950/30 to-slate-900/80 p-3.5 space-y-3.5 shadow-lg shadow-blue-950/20">
        <div className="flex items-center justify-between border-b border-blue-500/25 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Database className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Data Binding & Live Feeds</span>
              <span className="text-[10px] text-blue-300">Connect component to dynamic data</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="checkbox"
              id="enableDataBinding"
              checked={!!element.dataBinding?.enabled}
              onChange={(e) => {
                const isEnabled = e.target.checked;
                const prev = element.dataBinding || {
                  enabled: false,
                  sourceType: 'live_market_ws',
                  marketTicker: 'BTC/USD',
                  marketFrequencySec: 2,
                  marketVolatility: 'medium',
                  currencyPrefix: '$',
                  showLivePulse: true,
                };
                onUpdate({
                  ...element,
                  dataBinding: { ...prev, enabled: isEnabled },
                });
              }}
              className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="enableDataBinding" className="text-[11px] font-bold text-slate-300 cursor-pointer">
              {element.dataBinding?.enabled ? 'Active' : 'Disabled'}
            </label>
          </div>
        </div>

        {element.dataBinding?.enabled && (
          <div className="space-y-3 pt-1 animate-in fade-in duration-200">
            {/* Choose Data Source Provider / Origin */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Data Source Origin</span>
                <span className="font-mono text-[9px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                  {element.dataBinding.sourceType}
                </span>
              </label>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'live_market_ws', label: 'WebSocket Feed', desc: 'Real-Time Market Stream', icon: Activity },
                  { id: 'rest_api', label: 'REST API', desc: 'HTTP JSON Polling', icon: Globe },
                  { id: 'preset_dataset', label: 'Preset Datasets', desc: 'Curated Financial Data', icon: Database },
                  { id: 'custom_json', label: 'Custom JSON', desc: 'Direct Payload Input', icon: Code2 },
                ].map((src) => {
                  const IconC = src.icon;
                  const isSelected = (element.dataBinding?.sourceType || 'live_market_ws') === src.id;
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => {
                        const current = element.dataBinding!;
                        onUpdate({
                          ...element,
                          dataBinding: {
                            ...current,
                            sourceType: src.id as DataSourceType,
                          },
                        });
                      }}
                      className={`flex flex-col items-start p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-600/25 text-white shadow-xs ring-1 ring-blue-500/40'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <IconC className={`h-3.5 w-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                        <span className="text-[11px] font-bold">{src.label}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 line-clamp-1">{src.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Provider 1: Simulated Real-Time WebSocket Market Stream */}
            {element.dataBinding.sourceType === 'live_market_ws' && (
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-2.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                  <div className="flex items-center gap-1.5">
                    <Wifi className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                    <span>Real-Time WebSocket Stream</span>
                  </div>
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono text-emerald-300 font-bold">
                    Connected (WS://)
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-slate-300 mb-1">Market Ticker Symbol</label>
                  <select
                    value={element.dataBinding.marketTicker || 'BTC/USD'}
                    onChange={(e) => {
                      const ticker = e.target.value as any;
                      onUpdate({
                        ...element,
                        dataBinding: { ...element.dataBinding!, marketTicker: ticker },
                      });
                    }}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="BTC/USD">Bitcoin (BTC/USD) - $68,450.00</option>
                    <option value="ETH/USD">Ethereum (ETH/USD) - $3,520.80</option>
                    <option value="SOL/USD">Solana (SOL/USD) - $184.25</option>
                    <option value="S&P 500">S&P 500 Index - 5,815.20</option>
                    <option value="NASDAQ">NASDAQ 100 - 20,410.50</option>
                    <option value="AAPL">Apple Inc (AAPL) - $232.10</option>
                    <option value="NVDA">NVIDIA Corp (NVDA) - $138.90</option>
                    <option value="EUR/USD">Euro / US Dollar (EUR/USD) - 1.0845</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-300 mb-1">Tick Frequency</label>
                    <select
                      value={element.dataBinding.marketFrequencySec || 2}
                      onChange={(e) => {
                        onUpdate({
                          ...element,
                          dataBinding: { ...element.dataBinding!, marketFrequencySec: Number(e.target.value) },
                        });
                      }}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1 text-xs text-white"
                    >
                      <option value="1">1s (High Speed)</option>
                      <option value="2">2s (Standard)</option>
                      <option value="5">5s (Relaxed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-300 mb-1">Volatility</label>
                    <select
                      value={element.dataBinding.marketVolatility || 'medium'}
                      onChange={(e) => {
                        onUpdate({
                          ...element,
                          dataBinding: { ...element.dataBinding!, marketVolatility: e.target.value as any },
                        });
                      }}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1 text-xs text-white"
                    >
                      <option value="low">Low (0.2%)</option>
                      <option value="medium">Medium (0.8%)</option>
                      <option value="high">High (2.5%)</option>
                    </select>
                  </div>
                </div>

                {/* Live simulation action button */}
                <button
                  type="button"
                  onClick={() => {
                    const prefix = element.dataBinding?.currencyPrefix || '$';
                    const isBtc = (element.dataBinding?.marketTicker || 'BTC/USD').includes('BTC');
                    const basePrice = isBtc ? 68450 : 148920;
                    const delta = (Math.random() - 0.48) * (isBtc ? 1200 : 2500);
                    const newPrice = Math.max(100, Math.round((basePrice + delta) * 100) / 100);
                    const pct = ((delta / basePrice) * 100).toFixed(2);
                    const isUp = delta >= 0;

                    const updated: ElementProperties = {
                      ...element,
                      metricValue: `${prefix}${newPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                      metricChange: `${isUp ? '+' : ''}${pct}% real-time tick`,
                    };

                    // If it's a chart, add or update the latest point
                    if (element.type === 'line_chart' && element.chartPointsData) {
                      const pts = [...element.chartPointsData];
                      pts[pts.length - 1] = {
                        label: 'Now',
                        value: Math.round(newPrice),
                      };
                      updated.chartPointsData = pts;
                    }

                    onUpdate(updated);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 py-1.5 text-xs font-bold text-cyan-200 transition-colors shadow-xs"
                >
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Simulate Real-Time Market Tick</span>
                </button>
              </div>
            )}

            {/* Provider 2: External REST API */}
            {element.dataBinding.sourceType === 'rest_api' && (
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-2.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-indigo-400" />
                    <span>REST API Endpoint</span>
                  </div>
                  <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-mono text-indigo-300">
                    HTTP Polling
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-medium text-slate-300 mb-1">Method</label>
                    <select
                      value={element.dataBinding.method || 'GET'}
                      onChange={(e) => {
                        onUpdate({
                          ...element,
                          dataBinding: { ...element.dataBinding!, method: e.target.value as any },
                        });
                      }}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1.5 text-xs text-white"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] font-medium text-slate-300 mb-1">API Endpoint URL</label>
                    <input
                      type="text"
                      value={element.dataBinding.endpoint || 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'}
                      onChange={(e) => {
                        onUpdate({
                          ...element,
                          dataBinding: { ...element.dataBinding!, endpoint: e.target.value },
                        });
                      }}
                      placeholder="https://api.domain.com/v1/..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1.5 font-mono text-[11px] text-white"
                    />
                  </div>
                </div>

                {/* Preset Suggestions */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block">Quick Preset Endpoints:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { name: 'CoinGecko BTC', url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', path: 'bitcoin.usd' },
                      { name: 'Binance Ticker', url: 'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT', path: 'lastPrice' },
                      { name: 'Currency Rates', url: 'https://api.frankfurter.app/latest?from=USD', path: 'rates.EUR' },
                    ].map((pre) => (
                      <button
                        key={pre.name}
                        type="button"
                        onClick={() => {
                          onUpdate({
                            ...element,
                            dataBinding: {
                              ...element.dataBinding!,
                              endpoint: pre.url,
                              dataPath: pre.path,
                            },
                          });
                        }}
                        className="rounded-md bg-slate-800/80 hover:bg-slate-700 px-1.5 py-0.5 text-[9px] font-medium text-slate-300 transition-colors"
                      >
                        {pre.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-300 mb-1">JSON Data Pointer Path</label>
                    <input
                      type="text"
                      value={element.dataBinding.dataPath || 'data.price'}
                      onChange={(e) => {
                        onUpdate({
                          ...element,
                          dataBinding: { ...element.dataBinding!, dataPath: e.target.value },
                        });
                      }}
                      placeholder="e.g. bitcoin.usd"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1 font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-300 mb-1">Refresh Interval</label>
                    <select
                      value={element.dataBinding.refreshIntervalSec || 5}
                      onChange={(e) => {
                        onUpdate({
                          ...element,
                          dataBinding: { ...element.dataBinding!, refreshIntervalSec: Number(e.target.value) },
                        });
                      }}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1 text-xs text-white"
                    >
                      <option value="3">3 seconds</option>
                      <option value="5">5 seconds</option>
                      <option value="15">15 seconds</option>
                      <option value="60">60 seconds</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Provider 3: Curated Preset Datasets */}
            {element.dataBinding.sourceType === 'preset_dataset' && (
              <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-2.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-violet-300">
                  <div className="flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-violet-400" />
                    <span>Curated Financial Datasets</span>
                  </div>
                  <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[9px] font-mono text-violet-300">
                    Built-in
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-slate-300 mb-1">Select Dataset</label>
                  <select
                    value={element.dataBinding.presetId || 'crypto_portfolio'}
                    onChange={(e) => {
                      const pid = e.target.value as any;
                      let updated = { ...element };
                      if (pid === 'crypto_portfolio') {
                        updated.metricValue = '$148,920.45';
                        updated.metricChange = '+14.2% past 30 days';
                      } else if (pid === 'stock_tech_rally') {
                        updated.metricValue = '$5,815.20';
                        updated.metricChange = '+2.35% Tech Index';
                      } else if (pid === 'fintech_revenue_monthly') {
                        updated.metricValue = '$76,500.00';
                        updated.metricChange = '+28.4% MRR Growth';
                      } else if (pid === 'credit_score_gauge') {
                        updated.gaugeValue = 785;
                        updated.gaugeLabel = 'Excellent Standing';
                        updated.gaugeStatus = 'healthy';
                      }
                      updated.dataBinding = { ...element.dataBinding!, presetId: pid };
                      onUpdate(updated);
                    }}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="crypto_portfolio">Crypto Asset Allocation & Liquidity</option>
                    <option value="stock_tech_rally">S&P 500 & Tech Rally (Mag 7)</option>
                    <option value="fintech_revenue_monthly">SaaS MRR, Inflows & Settlement</option>
                    <option value="defi_liquidity">DeFi Yields & Liquidity Pools</option>
                    <option value="credit_score_gauge">Consumer Risk & Credit Score (300-850)</option>
                    <option value="expense_breakdown">Corporate Card Dept Spend</option>
                  </select>
                </div>
              </div>
            )}

            {/* Provider 4: Custom JSON Payload */}
            {element.dataBinding.sourceType === 'custom_json' && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-2.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-amber-400" />
                    <span>Dynamic JSON Payload</span>
                  </div>
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-mono text-amber-300">
                    Editable
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={
                    element.dataBinding.customJsonPayload ||
                    JSON.stringify(
                      {
                        asset: 'Ethereum',
                        balance: 41700.5,
                        change24h: 3.25,
                        history: [39500, 40200, 41100, 41700],
                      },
                      null,
                      2
                    )
                  }
                  onChange={(e) => {
                    onUpdate({
                      ...element,
                      dataBinding: { ...element.dataBinding!, customJsonPayload: e.target.value },
                    });
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 font-mono text-[10px] text-emerald-300 focus:outline-none"
                />
              </div>
            )}

            {/* Dynamic Field Key Mappings */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Field Key Mappings & Formatting
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Value Key</label>
                  <input
                    type="text"
                    value={element.dataBinding.valueKey || 'price'}
                    onChange={(e) => {
                      onUpdate({
                        ...element,
                        dataBinding: { ...element.dataBinding!, valueKey: e.target.value },
                      });
                    }}
                    placeholder="e.g. price, amount"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1 font-mono text-[11px] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Change Delta Key</label>
                  <input
                    type="text"
                    value={element.dataBinding.changeKey || 'changePercent'}
                    onChange={(e) => {
                      onUpdate({
                        ...element,
                        dataBinding: { ...element.dataBinding!, changeKey: e.target.value },
                      });
                    }}
                    placeholder="e.g. changePercent"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1 font-mono text-[11px] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Currency Prefix</label>
                  <input
                    type="text"
                    value={element.dataBinding.currencyPrefix || '$'}
                    onChange={(e) => {
                      onUpdate({
                        ...element,
                        dataBinding: { ...element.dataBinding!, currencyPrefix: e.target.value },
                      });
                    }}
                    placeholder="$"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1 font-mono text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Unit Suffix</label>
                  <input
                    type="text"
                    value={element.dataBinding.unitSuffix || ''}
                    onChange={(e) => {
                      onUpdate({
                        ...element,
                        dataBinding: { ...element.dataBinding!, unitSuffix: e.target.value },
                      });
                    }}
                    placeholder="e.g. k, %, M"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1 font-mono text-xs text-white"
                  />
                </div>
              </div>

              {/* Live Pulse Indicator Toggle */}
              <label className="flex items-center justify-between text-xs text-slate-300 pt-1 cursor-pointer">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Show Live Pulsing Light Tag</span>
                </span>
                <input
                  type="checkbox"
                  checked={element.dataBinding.showLivePulse !== false}
                  onChange={(e) => {
                    onUpdate({
                      ...element,
                      dataBinding: { ...element.dataBinding!, showLivePulse: e.target.checked },
                    });
                  }}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Corner Radius */}
      {element.type !== 'splash_screen' && (
        <div>
          <label className="block font-medium text-slate-300 mb-1.5">Corner Radius</label>
          <div className="grid grid-cols-5 gap-1 text-center">
            {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onUpdate({ ...element, borderRadius: r as any })}
                className={`rounded-lg py-1 text-[10px] uppercase font-mono border transition-all ${
                  element.borderRadius === r
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300 font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Comprehensive Transitions & Interaction Flows Panel ---------------- */
function TransitionsFlowPanel({
  element,
  screen,
  screens,
  connections = [],
  selectedConnectionId,
  onUpdateElement,
  onUpdateConnection,
  onDeleteConnection,
  onAddConnection,
  onSelectElement,
  onSelectScreen,
  onSelectConnection,
  onTest,
}: {
  element: ElementProperties | null;
  screen: Screen | null;
  screens: Screen[];
  connections: FlowConnection[];
  selectedConnectionId?: string | null;
  onUpdateElement: (updated: ElementProperties) => void;
  onUpdateConnection?: (updated: FlowConnection) => void;
  onDeleteConnection?: (connId: string) => void;
  onAddConnection?: (conn: FlowConnection) => void;
  onSelectElement?: (elementId: string) => void;
  onSelectScreen?: (screenId: string) => void;
  onSelectConnection?: (conn: FlowConnection | null) => void;
  onTest?: (element?: ElementProperties | null, targetScreenId?: string, transition?: TransitionType, duration?: number, easing?: string) => void;
}) {
  const [tabView, setTabView] = useState<'component' | 'screen' | 'all'>(() => {
    if (selectedConnectionId) return 'component';
    if (element) return 'component';
    if (screen) return 'screen';
    return 'all';
  });

  // State for quick-adding a transition from the current screen
  const [quickElId, setQuickElId] = useState<string>('');
  const [quickTargetId, setQuickTargetId] = useState<string>('');
  const [quickTransition, setQuickTransition] = useState<TransitionType>('slide-left');

  // Selected wire connection
  const activeConn = connections.find(c => c.id === selectedConnectionId);

  // Active element connection
  const elConn = element ? connections.find(c => c.sourceElementId === element.id) : null;

  // Elements on current screen that have transitions or wires
  const screenInteractiveElements = screen?.elements.filter(
    el => el.hasAction || connections.some(c => c.sourceElementId === el.id)
  ) || [];

  // Outgoing wire connections from current screen
  const screenOutgoingConns = screen ? connections.filter(c => c.sourceScreenId === screen.id) : [];

  // Incoming wire connections to current screen
  const screenIncomingConns = screen ? connections.filter(c => c.targetScreenId === screen.id) : [];

  const transitionPresets: { id: TransitionType; label: string; desc: string; icon: string }[] = [
    { id: 'slide-left', label: 'Slide Left', desc: 'iOS Forward Push', icon: '→' },
    { id: 'slide-right', label: 'Slide Right', desc: 'Back / Return Pop', icon: '←' },
    { id: 'slide-up', label: 'Slide Up', desc: 'Bottom Modal Sheet', icon: '↑' },
    { id: 'slide-down', label: 'Slide Down', desc: 'Top Drawer Reveal', icon: '↓' },
    { id: 'fade', label: 'Crossfade', desc: 'Dissolve Blend', icon: '✦' },
    { id: 'pop', label: 'Scale Pop', desc: 'Spring Dialog Alert', icon: '❖' },
    { id: 'flip', label: '3D Flip', desc: 'Perspective Turn', icon: '↻' },
    { id: 'bounce', label: 'Bounce', desc: 'Elastic Spring', icon: '⚡' },
  ];

  return (
    <div className="space-y-4">
      {/* Transitions Sub-Tab Navigator */}
      <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 text-[11px] font-semibold">
        <button
          type="button"
          onClick={() => setTabView('component')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
            tabView === 'component'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="h-3 w-3" />
          <span>Active Item</span>
        </button>

        <button
          type="button"
          onClick={() => setTabView('screen')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
            tabView === 'screen'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="h-3 w-3" />
          <span>Artboard ({screenInteractiveElements.length + screenOutgoingConns.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTabView('all')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
            tabView === 'all'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="h-3 w-3" />
          <span>All Flows ({connections.length})</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. COMPONENT / ACTIVE WIRE VIEW                                 */}
      {/* ============================================================== */}
      {tabView === 'component' && (
        <>
          {activeConn ? (
            /* Selected Canvas Wire Transition Inspector */
            <div className="rounded-2xl border border-pink-500/40 bg-pink-950/20 p-3.5 space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between border-b border-pink-500/20 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Link2 className="h-4 w-4 text-pink-400" />
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-pink-300">Canvas Wire Connection</span>
                    <h4 className="text-xs font-bold text-white">Interactive Flow Wire</h4>
                  </div>
                </div>
                {onDeleteConnection && (
                  <button
                    type="button"
                    onClick={() => onDeleteConnection(activeConn.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                    title="Delete Wire"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Wire Path summary */}
              <div className="rounded-xl bg-slate-900/80 p-2.5 border border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>From:</span>
                  <span className="font-semibold text-white truncate max-w-[170px]">
                    {screens.find(s => s.id === activeConn.sourceScreenId)?.title || activeConn.sourceScreenId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>To:</span>
                  <span className="font-semibold text-emerald-300 truncate max-w-[170px]">
                    {screens.find(s => s.id === activeConn.targetScreenId)?.title || activeConn.targetScreenId}
                  </span>
                </div>
              </div>

              {/* Transition effect for wire */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">Transition Animation</label>
                <select
                  value={activeConn.transition || 'slide-left'}
                  onChange={(e) => onUpdateConnection?.({ ...activeConn, transition: e.target.value as TransitionType })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
                >
                  {transitionPresets.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.icon} {tp.label} ({tp.desc})
                    </option>
                  ))}
                </select>
              </div>

              {/* Trigger */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">Trigger Event</label>
                <select
                  value={activeConn.trigger || 'onClick'}
                  onChange={(e) => onUpdateConnection?.({ ...activeConn, trigger: e.target.value as ActionTrigger })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
                >
                  <option value="onClick">On Tap / Click</option>
                  <option value="onSubmit">On Submit</option>
                  <option value="onChange">On Value Change</option>
                </select>
              </div>

              {/* Simulate Wire Transition */}
              {onTest && (
                <button
                  type="button"
                  onClick={() => {
                    const srcScreen = screens.find(s => s.id === activeConn.sourceScreenId);
                    const srcEl = srcScreen?.elements.find(e => e.id === activeConn.sourceElementId);
                    onTest(
                      srcEl || null,
                      activeConn.targetScreenId,
                      activeConn.transition || 'slide-left',
                      350,
                      'ease-out'
                    );
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/20 transition-all active:scale-95"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Simulate Wire Transition in Phone</span>
                </button>
              )}
            </div>
          ) : element ? (
            /* Selected Element Transition Inspector */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                    {element.type.replace('_', ' ')} interaction
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight">{element.label || element.name}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="enableElementAction"
                    checked={!!element.hasAction}
                    onChange={(e) =>
                      onUpdateElement({
                        ...element,
                        hasAction: e.target.checked,
                        trigger: element.trigger || 'onClick',
                        actionType: element.actionType || 'navigate',
                        targetScreenId: element.targetScreenId || screens.find(s => s.id !== screen?.id)?.id || screens[0]?.id,
                        transition: element.transition || 'slide-left',
                        transitionDuration: element.transitionDuration || 350,
                        transitionEasing: element.transitionEasing || 'ease-out',
                      })
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="enableElementAction" className="text-xs font-semibold text-slate-300 cursor-pointer">
                    Link Active
                  </label>
                </div>
              </div>

              {!element.hasAction ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-5 text-center bg-slate-950/40 space-y-2">
                  <Link2 className="mx-auto h-7 w-7 text-indigo-500/60" />
                  <h4 className="text-xs font-bold text-slate-300">No Active Transition</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Check <strong>Link Active</strong> above to turn this {element.type.replace('_', ' ')} into a clickable prototype link that navigates between screens with animated transitions.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateElement({
                        ...element,
                        hasAction: true,
                        trigger: 'onClick',
                        actionType: 'navigate',
                        targetScreenId: screens.find(s => s.id !== screen?.id)?.id || screens[0]?.id,
                        transition: 'slide-left',
                        transitionDuration: 350,
                        transitionEasing: 'ease-out',
                      })
                    }
                    className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow transition-all"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Enable Transition Now</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Event Trigger */}
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Event Trigger</label>
                    <select
                      value={element.trigger || 'onClick'}
                      onChange={(e) => onUpdateElement({ ...element, trigger: e.target.value as ActionTrigger })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="onClick">On Tap / Click</option>
                      <option value="onSubmit">On Form Submit</option>
                      <option value="onChange">On Value Change</option>
                    </select>
                  </div>

                  {/* Action Type */}
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Execution Action</label>
                    <select
                      value={element.actionType || 'navigate'}
                      onChange={(e) => onUpdateElement({ ...element, actionType: e.target.value as ActionType })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="navigate">Navigate to Screen</option>
                      <option value="back">Go Back (History Pop)</option>
                      <option value="toast">Show Push Toast Banner</option>
                      <option value="bottomSheet">Open Modal Sheet</option>
                    </select>
                  </div>

                  {/* Target Screen (if navigate) */}
                  {element.actionType === 'navigate' && (
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">Destination Target Screen</label>
                      <select
                        value={element.targetScreenId || ''}
                        onChange={(e) => onUpdateElement({ ...element, targetScreenId: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">Select Destination Screen...</option>
                        {screens.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title} ({s.route}) {s.isEntry ? '• [Entry]' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Transition Type */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-medium text-slate-300">Screen Transition Effect</label>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                        {element.transition || 'slide-left'}
                      </span>
                    </div>

                    <select
                      value={element.transition || 'slide-left'}
                      onChange={(e) => onUpdateElement({ ...element, transition: e.target.value as TransitionType })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none mb-2"
                    >
                      {transitionPresets.map((tp) => (
                        <option key={tp.id} value={tp.id}>
                          {tp.icon} {tp.label} ({tp.desc})
                        </option>
                      ))}
                    </select>

                    {/* Quick Visual Chips */}
                    <div className="grid grid-cols-4 gap-1">
                      {transitionPresets.map((tp) => (
                        <button
                          key={tp.id}
                          type="button"
                          onClick={() => onUpdateElement({ ...element, transition: tp.id })}
                          className={`rounded-lg py-1 px-1.5 text-[10px] font-medium border text-center transition-all truncate ${
                            (element.transition || 'slide-left') === tp.id
                              ? 'border-indigo-500 bg-indigo-600/30 text-white font-bold ring-1 ring-indigo-500/40 shadow-sm'
                              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                          title={`${tp.label} - ${tp.desc}`}
                        >
                          <span className="mr-0.5">{tp.icon}</span> {tp.label.replace('Slide ', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transition Duration & Easing */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">Duration</label>
                      <select
                        value={element.transitionDuration || 350}
                        onChange={(e) => onUpdateElement({ ...element, transitionDuration: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value={200}>Fast (200ms)</option>
                        <option value={350}>Normal (350ms)</option>
                        <option value={500}>Smooth (500ms)</option>
                        <option value={800}>Cinematic (800ms)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">Easing</label>
                      <select
                        value={element.transitionEasing || 'ease-out'}
                        onChange={(e) => onUpdateElement({ ...element, transitionEasing: e.target.value as any })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="ease-out">Ease Out (Decel)</option>
                        <option value="ease-in-out">Ease In-Out</option>
                        <option value="spring">Spring</option>
                        <option value="linear">Linear</option>
                      </select>
                    </div>
                  </div>

                  {/* Toast Alert Message (if actionType === 'toast') */}
                  {element.actionType === 'toast' && (
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">Toast Alert Message</label>
                      <input
                        type="text"
                        value={element.toastMessage || ''}
                        onChange={(e) => onUpdateElement({ ...element, toastMessage: e.target.value })}
                        placeholder="Operation completed successfully"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* PROMINENT LIVE SIMULATE BUTTON */}
                  {onTest && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const target = element.actionType === 'back'
                            ? (screens.find(s => s.id !== screen?.id)?.id || screens[0]?.id)
                            : (element.targetScreenId || screens[0]?.id);
                          onTest(
                            element,
                            target,
                            element.transition || 'slide-left',
                            element.transitionDuration || 350,
                            element.transitionEasing || 'ease-out'
                          );
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-98"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        <span>Simulate Transition in Phone Simulator</span>
                      </button>
                    </div>
                  )}

                  {/* Canvas Wire Status Card */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${elConn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span className="text-[11px] text-slate-400">
                        {elConn ? 'Canvas Wire Synced' : 'Action Only (No Wire)'}
                      </span>
                    </div>

                    {elConn ? (
                      <button
                        type="button"
                        onClick={() => onDeleteConnection?.(elConn.id)}
                        className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold"
                      >
                        Unlink Wire
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (screen && element.targetScreenId && onAddConnection) {
                            onAddConnection({
                              id: `conn_${Date.now()}`,
                              sourceScreenId: screen.id,
                              sourceElementId: element.id,
                              targetScreenId: element.targetScreenId,
                              trigger: element.trigger || 'onClick',
                              transition: element.transition || 'slide-left',
                            });
                          }
                        }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        + Add Canvas Wire
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center space-y-2">
              <MousePointer className="mx-auto h-6 w-6 text-slate-600" />
              <h4 className="text-xs font-bold text-slate-300">No Component Selected</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Click on any button, card, list item, or wire on the canvas to inspect its transition, or view Artboard Flows below.
              </p>
              <button
                type="button"
                onClick={() => setTabView('screen')}
                className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                View Screen Flows →
              </button>
            </div>
          )}
        </>
      )}

      {/* ============================================================== */}
      {/* 2. ARTBOARD (SCREEN) FLOWS VIEW                                 */}
      {/* ============================================================== */}
      {tabView === 'screen' && screen && (
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-2.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Artboard Transitions</span>
            <h3 className="text-sm font-bold text-white tracking-tight">{screen.title}</h3>
            <span className="text-[10px] font-mono text-slate-400">{screen.route}</span>
          </div>

          {/* Outgoing Transitions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <CornerDownRight className="h-3.5 w-3.5 text-indigo-400" />
                Outgoing Transitions ({screenInteractiveElements.length})
              </span>
            </div>

            {screenInteractiveElements.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-3 text-center text-[11px] text-slate-500">
                No interactive links on this screen yet.
              </div>
            ) : (
              <div className="space-y-1.5">
                {screenInteractiveElements.map((el) => {
                  const targetScreen = screens.find(s => s.id === el.targetScreenId);
                  return (
                    <div
                      key={el.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 hover:border-slate-700 transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                          <span>{el.label || el.name}</span>
                          <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/15 px-1 py-0.2 rounded border border-indigo-500/20">
                            {el.transition || 'slide-left'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                          <span>→</span>
                          <span className="text-emerald-300 truncate">{targetScreen?.title || el.targetScreenId || 'No target'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {onTest && el.targetScreenId && (
                          <button
                            type="button"
                            onClick={() => onTest(el, el.targetScreenId, el.transition || 'slide-left', el.transitionDuration || 350, el.transitionEasing || 'ease-out')}
                            className="flex items-center justify-center rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white p-1.5 transition-colors"
                            title="Simulate this transition"
                          >
                            <Play className="h-3 w-3 fill-current" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            onSelectElement?.(el.id);
                            setTabView('component');
                          }}
                          className="flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 transition-colors"
                          title="Edit this element"
                        >
                          <Sliders className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Incoming Transitions */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <ArrowRight className="h-3.5 w-3.5 text-emerald-400 rotate-180" />
              Incoming Flows to this Artboard ({screenIncomingConns.length})
            </span>

            {screenIncomingConns.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-3 text-center text-[11px] text-slate-500">
                No external screens currently navigate here.
              </div>
            ) : (
              <div className="space-y-1.5">
                {screenIncomingConns.map((conn) => {
                  const srcScreen = screens.find(s => s.id === conn.sourceScreenId);
                  const srcEl = srcScreen?.elements.find(e => e.id === conn.sourceElementId);
                  return (
                    <div
                      key={conn.id}
                      className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-2.5 flex items-center justify-between text-[11px]"
                    >
                      <div className="min-w-0 flex-1 truncate">
                        <span className="font-semibold text-white block truncate">{srcScreen?.title}</span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          via {srcEl?.label || srcEl?.name || 'Screen action'} ({conn.transition})
                        </span>
                      </div>
                      {onTest && (
                        <button
                          type="button"
                          onClick={() => onTest(srcEl || null, screen.id, conn.transition || 'slide-left', 350, 'ease-out')}
                          className="rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white p-1.5 transition-colors shrink-0"
                          title="Simulate incoming transition"
                        >
                          <Play className="h-3 w-3 fill-current" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Transition Creator */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 space-y-2.5">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add New Flow from this Artboard
            </span>

            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Source Component</label>
              <select
                value={quickElId}
                onChange={(e) => setQuickElId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select component...</option>
                {screen.elements.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.label || el.name} ({el.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Destination Screen</label>
              <select
                value={quickTargetId}
                onChange={(e) => setQuickTargetId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select destination...</option>
                {screens.filter(s => s.id !== screen.id).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.route})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Transition Effect</label>
              <select
                value={quickTransition}
                onChange={(e) => setQuickTransition(e.target.value as TransitionType)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                {transitionPresets.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.icon} {tp.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={!quickElId || !quickTargetId}
              onClick={() => {
                const targetEl = screen.elements.find(e => e.id === quickElId);
                if (targetEl && quickTargetId) {
                  onUpdateElement({
                    ...targetEl,
                    hasAction: true,
                    trigger: 'onClick',
                    actionType: 'navigate',
                    targetScreenId: quickTargetId,
                    transition: quickTransition,
                    transitionDuration: 350,
                    transitionEasing: 'ease-out',
                  });
                  if (onAddConnection) {
                    onAddConnection({
                      id: `conn_${Date.now()}`,
                      sourceScreenId: screen.id,
                      sourceElementId: quickElId,
                      targetScreenId: quickTargetId,
                      trigger: 'onClick',
                      transition: quickTransition,
                    });
                  }
                  setQuickElId('');
                  setQuickTargetId('');
                }
              }}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 py-2 text-xs font-semibold text-white shadow-sm transition-all"
            >
              + Create Transition Link
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. ALL PROJECT FLOWS DIRECTORY                                  */}
      {/* ============================================================== */}
      {tabView === 'all' && (
        <div className="space-y-3">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">Project Directory</span>
            <h3 className="text-sm font-bold text-white tracking-tight">All Flows & Transitions ({connections.length})</h3>
            <p className="text-[10px] text-slate-400">
              Click play on any connection to test and verify its transition directly in the mobile simulator.
            </p>
          </div>

          {connections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center text-slate-500 space-y-2">
              <Link2 className="mx-auto h-6 w-6 text-slate-600" />
              <p className="text-xs">No active connections in project.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {connections.map((conn, idx) => {
                const srcScreen = screens.find(s => s.id === conn.sourceScreenId);
                const tgtScreen = screens.find(s => s.id === conn.targetScreenId);
                const srcEl = srcScreen?.elements.find(e => e.id === conn.sourceElementId);

                return (
                  <div
                    key={conn.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 hover:border-slate-700 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white truncate">
                          <span className="text-slate-400 font-mono text-[10px]">#{idx + 1}</span>
                          <span className="truncate">{srcScreen?.title || conn.sourceScreenId}</span>
                          <span className="text-indigo-400">→</span>
                          <span className="text-emerald-300 truncate">{tgtScreen?.title || conn.targetScreenId}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          Via: <span className="text-slate-200">{srcEl?.label || srcEl?.name || 'Screen Connector'}</span>
                        </div>
                      </div>

                      {/* Transition Badge */}
                      <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-indigo-300 shrink-0">
                        {conn.transition}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">{conn.trigger}</span>

                      <div className="flex items-center gap-1.5">
                        {onTest && (
                          <button
                            type="button"
                            onClick={() => onTest(srcEl || null, conn.targetScreenId, conn.transition || 'slide-left', 350, 'ease-out')}
                            className="flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 text-[10px] font-bold text-white shadow transition-all active:scale-95"
                          >
                            <Play className="h-2.5 w-2.5 fill-current" />
                            <span>Simulate</span>
                          </button>
                        )}
                        {onSelectConnection && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectConnection(conn);
                              setTabView('component');
                            }}
                            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[10px] text-slate-300 transition-colors"
                          >
                            Inspect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Screen Properties Sub-Panel ---------------- */
function ScreenPropertiesPanel({
  screen,
  onUpdate,
  onSelectElement,
}: {
  screen: Screen;
  onUpdate: (updated: Screen) => void;
  onSelectElement?: (elementId: string) => void;
}) {
  const splashEl = screen.elements.find((e) => e.type === 'splash_screen');

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-[10px] font-mono text-slate-500 uppercase">Artboard Settings</span>
        <h3 className="text-sm font-bold text-white tracking-tight">{screen.title}</h3>
      </div>

      {/* Direct Splash Screen Component Shortcut */}
      {splashEl && (
        <div className="rounded-2xl border border-purple-500/50 bg-purple-950/30 p-3 space-y-2 ring-1 ring-purple-500/20">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-xs text-purple-200">
              <Video className="h-3.5 w-3.5 text-purple-400" />
              Motion Video Splash Attached
            </span>
            <span className="text-[9px] font-mono font-bold text-purple-300 rounded bg-purple-500/20 px-1.5 py-0.5 border border-purple-500/30">
              {splashEl.splashFileType?.toUpperCase() || 'MP4'}
            </span>
          </div>
          <p className="text-[10px] text-slate-300">
            This screen contains the motion launch splash screen. Click below to adjust full size video and proportional resizer properties.
          </p>
          <button
            type="button"
            onClick={() => onSelectElement?.(splashEl.id)}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 py-2 px-3 text-xs font-bold text-white transition-all shadow-md active:scale-95"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Open Splash & Video Resizer Props →</span>
          </button>
        </div>
      )}

      <div>
        <label className="block font-medium text-slate-300 mb-1">Screen Name</label>
        <input
          type="text"
          value={screen.title}
          onChange={(e) => onUpdate({ ...screen, title: e.target.value })}
          className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block font-medium text-slate-300 mb-1">URL Route Path</label>
        <input
          type="text"
          value={screen.route}
          onChange={(e) => onUpdate({ ...screen, route: e.target.value })}
          className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Background Color Fill */}
      <div>
        <label className="block font-medium text-slate-300 mb-1.5">Background Fill Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={screen.backgroundColor}
            onChange={(e) => onUpdate({ ...screen, backgroundColor: e.target.value })}
            className="h-8 w-10 cursor-pointer rounded border border-slate-700 bg-transparent p-0"
          />
          <input
            type="text"
            value={screen.backgroundColor}
            onChange={(e) => onUpdate({ ...screen, backgroundColor: e.target.value })}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none uppercase"
          />
        </div>
      </div>

      {/* Preset Swatches */}
      <div>
        <span className="block text-[10px] text-slate-400 mb-1.5">Theme Palette Swatches</span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_SWATCH_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onUpdate({ ...screen, backgroundColor: c })}
              style={{ backgroundColor: c }}
              className={`h-6 w-6 rounded-full border border-slate-700 transition-transform hover:scale-125 ${
                screen.backgroundColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-blue-500 scale-110' : ''
              }`}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Entry Screen Toggle */}
      <div className="pt-2 border-t border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={screen.isEntry}
            onChange={(e) => onUpdate({ ...screen, isEntry: e.target.checked })}
            className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
          />
          <div>
            <div className="font-semibold text-slate-200">Starting Entry Screen</div>
            <div className="text-[10px] text-slate-500">Journey flow begins at this screen in the simulator</div>
          </div>
        </label>
      </div>

      {/* Developer Sticky Notes & Architecture Pins */}
      <div className="pt-3 border-t border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-xs text-amber-200">
            <StickyNote className="h-3.5 w-3.5 text-amber-400" />
            Developer Context Notes ({(screen.annotations || []).length})
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                const count = screen.annotations?.length || 0;
                const newNote: ScreenAnnotation = {
                  id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                  screenId: screen.id,
                  type: 'sticky_note',
                  number: count + 1,
                  title: 'Developer Note',
                  content: '',
                  category: 'dev_note',
                  color: 'yellow',
                  author: 'Lead Architect',
                  x: 24,
                  y: 90 + (count % 4) * 35,
                  width: 210,
                  createdAt: new Date().toISOString(),
                };
                onUpdate({
                  ...screen,
                  annotations: [...(screen.annotations || []), newNote],
                });
              }}
              className="flex items-center gap-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300 transition-all"
            >
              <Plus className="h-2.5 w-2.5" />
              <span>+ Note</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const count = screen.annotations?.length || 0;
                const newPin: ScreenAnnotation = {
                  id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                  screenId: screen.id,
                  type: 'pin',
                  number: count + 1,
                  title: 'Context Pin',
                  content: '',
                  category: 'api_spec',
                  color: 'violet',
                  author: 'Lead Architect',
                  x: 220,
                  y: 120 + (count % 5) * 30,
                  createdAt: new Date().toISOString(),
                };
                onUpdate({
                  ...screen,
                  annotations: [...(screen.annotations || []), newPin],
                });
              }}
              className="flex items-center gap-1 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 px-2 py-0.5 text-[10px] font-bold text-violet-300 transition-all"
            >
              <MapPin className="h-2.5 w-2.5" />
              <span>+ Pin</span>
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-400">
          Notes and pins are rendered on the canvas and exported in the developer JSON schema handoff payload.
        </p>

        {/* Existing annotations list */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {(screen.annotations || []).map((ann) => (
            <div
              key={ann.id}
              className="rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                  ann.type === 'pin' ? 'bg-violet-500/20 text-violet-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {ann.type === 'pin' ? `📍 PIN #${ann.number || 1}` : '📝 NOTE'} • {ann.category}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onUpdate({
                      ...screen,
                      annotations: (screen.annotations || []).filter(a => a.id !== ann.id),
                    });
                  }}
                  className="text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              <input
                type="text"
                value={ann.title || ''}
                placeholder="Title..."
                onChange={(e) => {
                  onUpdate({
                    ...screen,
                    annotations: (screen.annotations || []).map(a => a.id === ann.id ? { ...a, title: e.target.value } : a),
                  });
                }}
                className="w-full bg-transparent text-[11px] font-bold text-slate-200 focus:outline-none"
              />

              <textarea
                rows={2}
                value={ann.content}
                placeholder="Developer instruction..."
                onChange={(e) => {
                  onUpdate({
                    ...screen,
                    annotations: (screen.annotations || []).map(a => a.id === ann.id ? { ...a, content: e.target.value } : a),
                  });
                }}
                className="w-full resize-none rounded bg-slate-900 border border-slate-800 p-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>
          ))}

          {(!screen.annotations || screen.annotations.length === 0) && (
            <div className="py-2 text-center text-[10px] text-slate-500 italic">
              No sticky notes placed on this screen.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

