import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Copy, Trash2, Plus, GripVertical, ChevronUp, ChevronDown, 
  ArrowRight, ShieldCheck, Lock, Bell, ChevronLeft, ArrowDownLeft, 
  Send, Home, CreditCard, Settings, Zap, Check, CheckCircle2, Download, 
  FileText, Key, Server, Video, Mic, Smartphone, PlayCircle, Eye,
  Sparkles, Camera, ScanLine, Radio, ImageIcon, Maximize2, Ratio, X, Scaling,
  AlertCircle, StickyNote, MapPin, TrendingUp, LineChart, PieChart, BarChart3, 
  Activity, Gauge, Table, Wifi, Coins
} from 'lucide-react';
import { Screen, ElementProperties, FlowConnection, ScreenAnnotation, AnnotationCategory, AnnotationColor } from '../../types/builder';
import { AppLogo } from '../brand/AppLogo';
import { GraphicAssetSlider } from './GraphicAssetSlider';
import { StickyNoteOverlay } from './StickyNoteOverlay';

interface ScreenCardProps {
  screen: Screen;
  screens?: Screen[];
  isSelected: boolean;
  selectedElementId: string | null;
  onSelectScreen: (screenId: string) => void;
  onSelectElement: (elementId: string) => void;
  onDuplicateScreen: (screenId: string) => void;
  onDeleteScreen: (screenId: string) => void;
  onSetEntryScreen: (screenId: string) => void;
  onAddElement: (screenId: string) => void;
  onAddElementWithProps?: (screenId: string, element: ElementProperties) => void;
  onMoveElement: (screenId: string, elementIndex: number, direction: 'up' | 'down') => void;
  onDeleteElement: (screenId: string, elementId: string) => void;
  onStartWireFromElement?: (screenId: string, elementId: string, clientX?: number, clientY?: number) => void;
  onStartWireFromScreen?: (screenId: string, clientX?: number, clientY?: number) => void;
  onOpenContextMenu?: (e: React.MouseEvent, screen: Screen, element?: ElementProperties | null) => void;
  onQuickConnect?: (sourceScreenId: string, sourceElementId: string | undefined, targetScreenId: string) => void;
  isDraftTarget?: boolean;
  isWiringActive?: boolean;
  onConnectAsTarget?: (targetScreenId: string) => void;
  connections: FlowConnection[];
  isAnnotateMode?: boolean;
  annotateToolType?: 'sticky_note' | 'pin';
  annotateCategory?: AnnotationCategory;
  annotateColor?: AnnotationColor;
  showAnnotations?: boolean;
  scale?: number;
  selectedAnnotationId?: string | null;
  onSelectAnnotation?: (id: string | null) => void;
  onAddAnnotation?: (screenId: string, annotation: ScreenAnnotation) => void;
  onUpdateAnnotation?: (screenId: string, annotationId: string, updates: Partial<ScreenAnnotation>) => void;
  onDeleteAnnotation?: (screenId: string, annotationId: string) => void;
  onMoveAnnotation?: (screenId: string, annotationId: string, x: number, y: number) => void;
}

export const ScreenCard: React.FC<ScreenCardProps> = ({
  screen,
  screens,
  isSelected,
  selectedElementId,
  onSelectScreen,
  onSelectElement,
  onDuplicateScreen,
  onDeleteScreen,
  onSetEntryScreen,
  onAddElement,
  onAddElementWithProps,
  onMoveElement,
  onDeleteElement,
  onStartWireFromElement,
  onStartWireFromScreen,
  onOpenContextMenu,
  onQuickConnect,
  isDraftTarget,
  isWiringActive,
  onConnectAsTarget,
  connections,
  isAnnotateMode,
  annotateToolType,
  annotateCategory,
  annotateColor,
  showAnnotations = true,
  scale = 1,
  selectedAnnotationId,
  onSelectAnnotation,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  onMoveAnnotation,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showQuickConnect, setShowQuickConnect] = useState(false);
  const [quickConnectElId, setQuickConnectElId] = useState<string | undefined>(undefined);
  const splashEl = screen.elements.find((e) => e.type === 'splash_screen');
  const hasFullscreenSplashVideo = splashEl && splashEl.splashFileType === 'mp4' && (splashEl.splashVideoSizeMode !== 'proportional');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only reset if leaving the artboard card
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const rawData = e.dataTransfer.getData('application/flowcraft-element');
    if (rawData) {
      try {
        const template = JSON.parse(rawData);
        const newElement: ElementProperties = {
          ...template,
          id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        };
        if (onAddElementWithProps) {
          onAddElementWithProps(screen.id, newElement);
        } else {
          onAddElement(screen.id);
        }
      } catch (err) {
        console.error('Failed to parse dropped element data:', err);
      }
    }
  };

  return (
    <div
      style={{
        transform: `translate3d(${screen.x}px, ${screen.y}px, 0)`,
        width: `${screen.width}px`,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`absolute top-0 left-0 rounded-3xl transition-all select-none ${
        isDragOver
          ? 'ring-4 ring-violet-400 shadow-2xl shadow-violet-600/50 scale-[1.01]'
          : isSelected
          ? 'ring-2 ring-[#6B39F4] shadow-2xl shadow-violet-600/35 ring-offset-2 ring-offset-[#08070D]'
          : 'ring-1 ring-violet-500/20 shadow-xl shadow-black/70 hover:ring-violet-500/40'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        if (isWiringActive && onConnectAsTarget) {
          onConnectAsTarget(screen.id);
          return;
        }
        onSelectScreen(screen.id);
        if (screen.elements.length === 1) {
          onSelectElement(screen.elements[0].id);
        }
      }}
    >
      {/* Drop Zone Active Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl bg-violet-950/90 backdrop-blur-xs border-2 border-dashed border-violet-400 p-4 text-center pointer-events-none animate-in fade-in duration-150">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/30 text-violet-200 ring-2 ring-violet-400/50 mb-2">
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold text-white tracking-tight">Drop to Add to Screen</span>
          <span className="text-[11px] font-medium text-violet-200 mt-0.5">{screen.title}</span>
        </div>
      )}
      {/* Artboard Top Bar */}
      <div 
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenContextMenu?.(e, screen, null);
        }}
        className="flex items-center justify-between rounded-t-3xl bg-[#0F0D1F]/95 border-b border-violet-500/20 px-4 py-2.5 backdrop-blur-md"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <GripVertical className="h-3.5 w-3.5 text-slate-500 shrink-0 cursor-grab" />
          <span className="truncate text-xs font-bold text-white tracking-tight">
            {screen.title}
          </span>
          <span className="shrink-0 rounded bg-[#181335] px-1.5 py-0.5 font-mono text-[10px] text-violet-300 border border-violet-500/20">
            {screen.route}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Wire Screen Button */}
          <button
            title="⚡ Connect Wire from this Screen (or right-click anywhere)"
            onClick={(e) => {
              e.stopPropagation();
              onStartWireFromScreen?.(screen.id, e.clientX, e.clientY);
            }}
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] border border-violet-400/40 transition-all shadow-sm shadow-violet-950/40"
          >
            <Zap className="h-3 w-3 fill-current text-violet-200" />
            <span>Wire</span>
          </button>

          {/* Quick Sticky Note Button */}
          {onAddAnnotation && (
            <button
              title="Drop a Sticky Note on this screen with developer context"
              onClick={(e) => {
                e.stopPropagation();
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
                onAddAnnotation(screen.id, newNote);
                onSelectAnnotation?.(newNote.id);
              }}
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 transition-all shadow-xs"
            >
              <StickyNote className="h-2.5 w-2.5 text-amber-300" />
              <span>Note</span>
              {(screen.annotations?.length || 0) > 0 && (
                <span className="rounded-full bg-amber-400/25 px-1 py-0.1 text-[8.5px] font-mono text-amber-200">
                  {screen.annotations?.length}
                </span>
              )}
            </button>
          )}

          {/* Quick Pin Button */}
          {onAddAnnotation && (
            <button
              title="Drop an Annotation Pin on this screen"
              onClick={(e) => {
                e.stopPropagation();
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
                  x: Math.min(screen.width - 60, 40 + (count % 3) * 60),
                  y: 120 + (count % 5) * 45,
                  createdAt: new Date().toISOString(),
                };
                onAddAnnotation(screen.id, newPin);
                onSelectAnnotation?.(newPin.id);
              }}
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-violet-200 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/35 transition-all shadow-xs"
            >
              <MapPin className="h-2.5 w-2.5 text-violet-300" />
              <span>Pin</span>
            </button>
          )}

          {/* Entry screen badge */}
          <button
            title={screen.isEntry ? 'Entry Screen (Flow starts here)' : 'Set as Entry Screen'}
            onClick={(e) => {
              e.stopPropagation();
              onSetEntryScreen(screen.id);
            }}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all ${
              screen.isEntry
                ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Play className={`h-2.5 w-2.5 ${screen.isEntry ? 'fill-emerald-400 text-emerald-400' : ''}`} />
            <span>{screen.isEntry ? 'Entry Flow' : 'Set Entry'}</span>
          </button>

          {/* Duplicate */}
          <button
            title="Duplicate Screen"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateScreen(screen.id);
            }}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Copy className="h-3 w-3" />
          </button>

          {/* Delete */}
          <button
            title="Delete Screen"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteScreen(screen.id);
            }}
            className="rounded p-1 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Screen Left Input Connector Port */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (isWiringActive && onConnectAsTarget) {
            onConnectAsTarget(screen.id);
          }
        }}
        className={`absolute -left-3.5 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-800 text-slate-300 transition-all cursor-pointer ${
          isDraftTarget
            ? 'bg-cyan-500 text-white scale-125 ring-4 ring-cyan-400/60 shadow-lg shadow-cyan-500/50 animate-pulse'
            : isWiringActive
            ? 'border-cyan-400 bg-cyan-950/90 text-cyan-300 ring-2 ring-cyan-400/60 hover:scale-125 animate-pulse'
            : 'hover:border-cyan-400 hover:text-cyan-300'
        }`}
        title="Input Connection Port (Click or drop incoming wire here)"
      >
        <ArrowRight className="h-4 w-4 text-cyan-300" />
      </div>

      {/* Screen Right Output Connector Port */}
      <div
        title="⚡ Click or Drag to connect wire to another screen (Right-click for options)"
        onClick={(e) => {
          e.stopPropagation();
          onStartWireFromScreen?.(screen.id, e.clientX, e.clientY);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartWireFromScreen?.(screen.id, e.clientX, e.clientY);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenContextMenu?.(e, screen, null);
        }}
        className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/50 hover:scale-125 hover:ring-4 hover:ring-pink-400/50 cursor-crosshair transition-all"
      >
        <Zap className="h-4 w-4 fill-current" />
      </div>

      {/* Quick Connect Popover */}
      {showQuickConnect && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -right-64 top-1/2 -translate-y-1/2 z-50 w-60 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-2.5 text-xs text-white shadow-2xl backdrop-blur-xl ring-1 ring-white/10 animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 px-1 mb-1.5">
            <div className="flex items-center gap-1 font-bold text-[11px] text-indigo-300 truncate">
              <Zap className="h-3 w-3 text-indigo-400 shrink-0" />
              <span className="truncate">Connect {screen.title}</span>
            </div>
            <button
              onClick={() => setShowQuickConnect(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-[10px] text-slate-400 px-1 mb-1 font-semibold uppercase">
            Select Target Screen:
          </div>
          <div className="max-h-44 overflow-y-auto space-y-1 custom-scrollbar pr-0.5">
            {screens?.filter((s) => s.id !== screen.id).map((target) => (
              <button
                key={target.id}
                onClick={() => {
                  onQuickConnect?.(screen.id, quickConnectElId, target.id);
                  setShowQuickConnect(false);
                }}
                className="flex w-full items-center justify-between rounded-xl bg-slate-800/70 px-2 py-1.5 text-left text-[11px] font-medium text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <div
                    style={{ backgroundColor: target.backgroundColor || '#1e293b' }}
                    className="h-2.5 w-2.5 rounded-full border border-slate-600 shrink-0"
                  />
                  <span className="truncate">{target.title}</span>
                </div>
                <ArrowRight className="h-3 w-3 opacity-60 shrink-0" />
              </button>
            ))}
          </div>

          <div className="mt-2 pt-1 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400 px-1">
            <span>Or drag dot to screen</span>
            <button
              onClick={(e) => {
                setShowQuickConnect(false);
                onOpenContextMenu?.(e, screen, null);
              }}
              className="text-indigo-400 hover:underline"
            >
              Right-click menu
            </button>
          </div>
        </div>
      )}

      {/* Screen Viewport Container */}
      <div 
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenContextMenu?.(e, screen, null);
        }}
        onClick={(e) => {
          if (isAnnotateMode && onAddAnnotation) {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = Math.round((e.clientX - rect.left) / (scale || 1));
            const clickY = Math.round((e.clientY - rect.top) / (scale || 1));
            const count = screen.annotations?.length || 0;
            const isPin = annotateToolType === 'pin';
            const newAnnotation: ScreenAnnotation = {
              id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              screenId: screen.id,
              type: isPin ? 'pin' : 'sticky_note',
              number: count + 1,
              title: isPin ? 'Context Pin' : 'Developer Note',
              content: '',
              category: annotateCategory || (isPin ? 'api_spec' : 'dev_note'),
              color: annotateColor || (isPin ? 'violet' : 'yellow'),
              author: 'Lead Architect',
              x: Math.max(10, Math.min(screen.width - (isPin ? 40 : 210), clickX - (isPin ? 14 : 30))),
              y: Math.max(10, Math.min(520, clickY - 14)),
              width: 210,
              createdAt: new Date().toISOString(),
            };
            onAddAnnotation(screen.id, newAnnotation);
            onSelectAnnotation?.(newAnnotation.id);
          }
        }}
        style={{ backgroundColor: screen.backgroundColor }}
        className={`relative min-h-[560px] overflow-hidden rounded-b-3xl p-4 text-slate-100 flex flex-col justify-between ${
          isAnnotateMode ? 'cursor-crosshair ring-2 ring-amber-400/40' : ''
        }`}
      >
        {/* Sticky Notes & Architecture Pins Overlay */}
        <StickyNoteOverlay
          screenId={screen.id}
          annotations={screen.annotations || []}
          elements={screen.elements}
          scale={scale || 1}
          showAnnotations={showAnnotations !== false}
          selectedAnnotationId={selectedAnnotationId || null}
          onSelectAnnotation={onSelectAnnotation || (() => {})}
          onUpdateAnnotation={onUpdateAnnotation || (() => {})}
          onDeleteAnnotation={onDeleteAnnotation || (() => {})}
          onMoveAnnotation={onMoveAnnotation || (() => {})}
        />
        {/* Full Screen Edge-to-Edge Motion Video Background */}
        {hasFullscreenSplashVideo && splashEl && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <VideoPlayerPreview
              src={splashEl.splashMediaUrl}
              fit={splashEl.splashVideoFit || 'cover'}
              opacity={splashEl.splashVideoOpacity ?? 90}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60 pointer-events-none" />
          </div>
        )}

        {/* Device Status Bar Mock */}
        <div className="relative z-20 mb-3 flex items-center justify-between text-xs font-semibold text-slate-300 px-1.5">
          <span className="font-bold">9:41</span>
          <div className="h-4.5 w-24 rounded-full bg-black/90 border border-slate-700/80 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-violet-500/80 mr-1 animate-pulse" />
            <span className="text-[9px] font-mono text-slate-400">Dynamic Island</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">100%</span>
            <div className="h-2.5 w-4 rounded-xs border border-slate-400 p-[1px] flex items-center">
              <div className="h-full w-full bg-emerald-400 rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Dynamic Elements List */}
        <div className="flex-1 space-y-2.5">
          {screen.elements.map((el, index) => {
            const isElSelected = selectedElementId === el.id;
            const hasWire = connections.some(c => c.sourceElementId === el.id);

            return (
              <div
                key={`${screen.id}_el_${el.id}_${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement(el.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenContextMenu?.(e, screen, el);
                }}
                className={`group relative rounded-xl transition-all cursor-pointer ${
                  isElSelected
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900'
                    : 'hover:ring-1 hover:ring-slate-500/60'
                }`}
              >
                {/* Element Hover / Selected Mini Action Bar */}
                {isElSelected && (
                  <div className="absolute -top-6 left-0 right-0 z-30 flex items-center justify-between bg-blue-600 rounded-t-md px-2 py-0.5 text-[9px] text-white">
                    <span className="font-semibold truncate">{el.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        title="Move Up"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveElement(screen.id, index, 'up');
                        }}
                        className="hover:text-blue-200 disabled:opacity-30"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        title="Move Down"
                        disabled={index === screen.elements.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveElement(screen.id, index, 'down');
                        }}
                        className="hover:text-blue-200 disabled:opacity-30"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <button
                        title="Remove Element"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteElement(screen.id, el.id);
                        }}
                        className="hover:text-rose-200"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Journey Flow Connector Dot (Right Anchor) */}
                <div
                  title={hasWire ? 'Journey Connection Active (Click/Drag to rewire)' : '⚡ Click or Drag to Wire to Screen'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickConnectElId(el.id);
                    setShowQuickConnect(true);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    onStartWireFromElement?.(screen.id, el.id, e.clientX, e.clientY);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenContextMenu?.(e, screen, el);
                  }}
                  className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-5 w-5 rounded-full border-2 border-slate-900 flex items-center justify-center transition-all hover:scale-125 cursor-crosshair ${
                    hasWire
                      ? 'bg-pink-500 shadow-md shadow-pink-500/50 ring-2 ring-pink-300'
                      : el.hasAction
                      ? 'bg-indigo-500 ring-2 ring-indigo-400'
                      : 'bg-indigo-600 ring-1 ring-white/60 hover:bg-pink-500'
                  }`}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                </div>

                {/* Render Component Content */}
                <RenderElementUI el={el} screens={screens} />
              </div>
            );
          })}
        </div>

        {/* Add Element Quick Action */}
        <div className="mt-4 pt-2 border-t border-slate-800/60">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddElement(screen.id);
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 bg-slate-800/40 py-2 text-xs font-semibold text-slate-300 hover:border-blue-500 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Component to Screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function VideoPlayerPreview({
  src,
  fit = 'cover',
  opacity = 85,
  borderRadius,
  className = '',
}: {
  src?: string;
  fit?: 'cover' | 'contain' | 'fill';
  opacity?: number;
  borderRadius?: number;
  className?: string;
}) {
  const [loadError, setLoadError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = src || 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4';

  useEffect(() => {
    setLoadError(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [videoUrl]);

  return (
    <div
      style={{ borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined }}
      className={`relative overflow-hidden bg-black/95 ${className}`}
    >
      {!loadError ? (
        <video
          ref={videoRef}
          key={videoUrl}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setLoadError(true)}
          style={{ opacity: opacity / 100 }}
          className={`h-full w-full ${
            fit === 'contain' ? 'object-contain' : fit === 'fill' ? 'object-fill' : 'object-cover'
          } filter contrast-125 brightness-95`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center text-xs text-purple-300 bg-slate-900">
          <Video className="h-6 w-6 text-purple-400 mb-1 opacity-70" />
          <span className="text-[10px] text-slate-300 font-semibold">Motion Video Preview</span>
          <span className="text-[8px] text-slate-500 font-mono truncate max-w-[180px]">{videoUrl}</span>
        </div>
      )}
    </div>
  );
}

function RenderElementUI({ el, screens }: { el: ElementProperties; screens?: Screen[] }) {
  const targetScreen = screens?.find(s => s.id === el.targetScreenId);

  switch (el.type) {
    case 'header':
      return (
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 px-1">
          <div className="flex items-center gap-2.5">
            {el.hasAction && (
              <div className="rounded-lg p-1 text-slate-400 bg-slate-800/40">
                <ChevronLeft className="h-4 w-4" />
              </div>
            )}
            <div>
              <div className="text-sm font-bold text-white tracking-tight">{el.label}</div>
              {el.helperText && <div className="text-xs text-slate-400 mt-0.5">{el.helperText}</div>}
            </div>
          </div>
          <Bell className="h-4 w-4 text-slate-400" />
        </div>
      );

    case 'button': {
      const variantClass = el.variant === 'primary'
        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 hover:bg-blue-500'
        : el.variant === 'outline'
        ? 'border border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800'
        : el.variant === 'ghost'
        ? 'text-slate-300 bg-slate-800/30 hover:bg-slate-800/50'
        : 'bg-emerald-600 text-white hover:bg-emerald-500';

      const customBgStyle = el.bg ? { backgroundColor: el.bg } : undefined;

      return (
        <div className="space-y-1.5 w-full">
          <div 
            style={customBgStyle}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold transition-all ${variantClass}`}
          >
            <span>{el.label}</span>
            <ArrowRight className="h-4 w-4" />
          </div>

          {/* Interactive Screen Transition Badge */}
          {el.hasAction && el.actionType === 'navigate' && el.targetScreenId && (
            <div className="flex items-center justify-between rounded-lg bg-indigo-950/70 border border-indigo-500/40 px-2.5 py-1 text-[10px] font-mono text-indigo-300 shadow-sm">
              <span className="flex items-center gap-1 font-bold">
                ⇄ {el.transition || 'slide-left'} <span className="opacity-70 font-normal">({el.transitionDuration || 350}ms)</span>
              </span>
              <span className="truncate max-w-[130px] text-slate-200 font-medium">
                → {targetScreen ? targetScreen.title : 'Next Screen'}
              </span>
            </div>
          )}
        </div>
      );
    }

    case 'input':
      return (
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-300">{el.label}</div>
          <div className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 shadow-inner">
            {el.value || el.placeholder || 'Enter value...'}
          </div>
          {el.helperText && <div className="text-[11px] text-slate-400">{el.helperText}</div>}
        </div>
      );

    case 'card':
      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-3.5 backdrop-blur-sm shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-500/15 p-2 text-blue-400 shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-white">{el.label}</div>
              {el.helperText && <div className="mt-0.5 text-xs text-slate-400 leading-relaxed">{el.helperText}</div>}
            </div>
          </div>
        </div>
      );

    case 'metric':
      return (
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{el.label}</div>
          <div className="mt-1 font-mono text-2xl font-bold tracking-tight text-white tabular-nums">{el.metricValue || '$0.00'}</div>
          {el.metricChange && <div className="mt-1 text-xs font-semibold text-emerald-400">{el.metricChange}</div>}
        </div>
      );

    case 'list_item':
      return (
        <div className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-800/40 p-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-slate-700/60 p-1.5 text-slate-300">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-white">{el.label}</div>
              {el.helperText && <div className="text-xs text-slate-400 mt-0.5">{el.helperText}</div>}
            </div>
          </div>
          <span className="font-mono text-xs sm:text-sm font-bold text-white tabular-nums">{el.metricValue}</span>
        </div>
      );

    case 'carousel':
    case 'asset_slider':
      return (
        <div className="w-full">
          <GraphicAssetSlider
            element={el}
            isInteractive={false}
          />
          {(el.hasAction && el.targetScreenId) || el.carouselInterval || el.sliderInterval ? (
            <div className="mt-1 flex items-center justify-between rounded-lg bg-indigo-950/70 border border-indigo-500/30 px-2 py-0.5 text-[9px] font-mono text-indigo-300">
              <span>Carousel ({((el.carouselInterval || el.sliderInterval || 3000) / 1000).toFixed(1)}s dwell • {el.carouselAnimationSpeed || 500}ms speed)</span>
              <span>{targetScreen ? `→ ${targetScreen.title}` : `${(el.carouselSlides || el.sliderSlides)?.length || 3} Banners`}</span>
            </div>
          ) : null}
        </div>
      );

    case 'image_banner': {
      const isFullscreen = el.imageSizeMode === 'fullscreen';
      const aspectRatio = el.imageAspectRatio || '16:9';
      const customHeight = el.imageCustomHeight || (isFullscreen ? 180 : 120);

      return (
        <div 
          style={{ height: `${customHeight}px`, borderRadius: `${el.imageBorderRadius ?? 16}px` }}
          className="relative w-full overflow-hidden border border-slate-800 shadow-md group"
        >
          <img 
            src={el.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'} 
            alt={el.label} 
            style={{ objectFit: (el.imageFit || 'cover') as any }}
            className="h-full w-full" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate max-w-[180px]">{el.label}</span>
              {el.imageAllowFullscreenModal && (
                <span className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[8px] text-cyan-300 border border-white/10 flex items-center gap-1">
                  <Maximize2 className="h-2.5 w-2.5" /> Fullscreen
                </span>
              )}
            </div>
            {el.helperText && <span className="text-[10px] text-slate-300 line-clamp-1">{el.helperText}</span>}
          </div>
        </div>
      );
    }

    case 'shape': {
      const kind = el.shapeKind || 'rectangle';
      const fill = el.bg || '#1E293B';
      const stroke = el.shapeStroke || '#3B82F6';
      const strokeW = el.shapeStrokeWidth || 1;

      return (
        <div 
          style={{
            backgroundColor: kind === 'line' ? 'transparent' : fill,
            borderColor: stroke,
            borderWidth: `${strokeW}px`,
            borderRadius: kind === 'circle' ? '9999px' : '12px',
            height: kind === 'circle' ? '56px' : kind === 'line' ? '2px' : '48px',
            width: kind === 'circle' ? '56px' : '100%',
          }}
          className={`flex items-center justify-center p-2 text-xs font-medium text-slate-200 shadow-sm ${
            kind === 'circle' ? 'mx-auto' : ''
          }`}
        >
          <span className="text-[10px] text-slate-300 truncate">{el.label || `Vector ${kind}`}</span>
        </div>
      );
    }

    case 'avatar_group': {
      const urls = el.avatarUrls || [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
      ];
      return (
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
          <div className="flex items-center -space-x-2">
            {urls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Avatar"
                className="h-7 w-7 rounded-full border-2 border-slate-900 object-cover"
              />
            ))}
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-[10px] font-bold text-slate-300">
              +4
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-300">{el.label || 'Team Active'}</span>
        </div>
      );
    }

    case 'progress_bar': {
      const pct = el.progressPercent ?? 68;
      return (
        <div className="space-y-1 w-full rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold text-slate-300">{el.label || 'Progress'}</span>
            <span className="font-mono font-bold text-blue-400">{pct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div 
              style={{ width: `${pct}%` }} 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
            />
          </div>
        </div>
      );
    }

    case 'segmented_control': {
      const opts = el.segmentedOptions || ['1D', '1W', '1M', '1Y', 'ALL'];
      const activeIdx = el.segmentedActiveIndex ?? 2;
      return (
        <div className="flex w-full items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-[10px]">
          {opts.map((opt, oIdx) => (
            <div
              key={opt}
              className={`flex-1 py-1 text-center rounded-lg font-semibold transition-all ${
                oIdx === activeIdx
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400'
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      );
    }

    case 'checkbox':
      return (
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-2.5">
          <div className="flex h-4 w-4 items-center justify-center rounded border border-blue-500 bg-blue-600 text-white">
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
          <span className="text-xs text-slate-300">{el.label}</span>
        </div>
      );

    case 'alert_banner':
      return (
        <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/30 bg-blue-950/20 p-2.5 text-xs text-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-white text-[11px]">{el.alertTitle || 'Notice'}</span>
            <span className="text-[10px] text-slate-300">{el.label}</span>
          </div>
        </div>
      );

    case 'badge':
      return (
        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 text-[10px] font-medium text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          <span>{el.label}</span>
        </div>
      );

    case 'toggle':
      return (
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/40 p-2.5">
          <div>
            <div className="text-xs font-medium text-white">{el.label}</div>
            {el.helperText && <div className="text-[9px] text-slate-400">{el.helperText}</div>}
          </div>
          <div className="h-5 w-9 rounded-full bg-blue-600 p-0.5">
            <div className="h-4 w-4 rounded-full bg-white translate-x-4 shadow"></div>
          </div>
        </div>
      );

    case 'tabbar':
      return (
        <div className="flex items-center justify-around border-t border-slate-800 pt-2 text-slate-400">
          <div className="flex flex-col items-center gap-0.5 text-blue-400">
            <Home className="h-3.5 w-3.5" />
            <span className="text-[9px] font-medium">Home</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Send className="h-3.5 w-3.5" />
            <span className="text-[9px] font-medium">Transfer</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <CreditCard className="h-3.5 w-3.5" />
            <span className="text-[9px] font-medium">Cards</span>
          </div>
        </div>
      );

    case 'divider':
      return (
        <div className="my-2 flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="text-[9px] text-slate-500">{el.label || 'or'}</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>
      );

    case 'social_login': {
      const isGoogleOnly = el.socialProvider === 'google';
      const isAppleOnly = el.socialProvider === 'apple';
      const isGithubOnly = el.socialProvider === 'github';

      return (
        <div className="space-y-1.5 w-full">
          {(!isAppleOnly && !isGithubOnly) && (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-white text-slate-900 py-2 px-3 text-xs font-semibold shadow-sm hover:bg-slate-100 transition-colors">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isGoogleOnly ? el.label : 'Continue with Google'}</span>
            </div>
          )}

          {(!isGoogleOnly && !isGithubOnly) && (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-black text-white border border-slate-700/80 py-2 px-3 text-xs font-semibold shadow-sm hover:bg-slate-900 transition-colors">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.04-.49 2.66-1.24z"/>
              </svg>
              <span>{isAppleOnly ? el.label : 'Continue with Apple'}</span>
            </div>
          )}

          {isGithubOnly && (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#24292F] text-white border border-slate-700/80 py-2 px-3 text-xs font-semibold shadow-sm hover:bg-[#1a1f24] transition-colors">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span>{el.label || 'Sign in with GitHub'}</span>
            </div>
          )}
        </div>
      );
    }

    case 'form_container': {
      const fields = el.formFields && el.formFields.length > 0 
        ? el.formFields 
        : [
            { id: 'f1', label: 'Work Email', placeholder: 'name@company.com', type: 'email' },
            { id: 'f2', label: 'Password', placeholder: '••••••••', type: 'password' },
          ];

      return (
        <div className="rounded-2xl border border-slate-700/90 bg-slate-900/80 p-3 space-y-2 backdrop-blur-md shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-bold text-white tracking-tight">
              {el.formTitle || el.label || 'Form Container'}
            </span>
            <Lock className="h-3 w-3 text-slate-400" />
          </div>

          <div className="space-y-1.5">
            {fields.map((f, i) => (
              <div key={f.id || i} className="space-y-0.5">
                <label className="text-[10px] font-medium text-slate-400 block">{f.label}</label>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 text-[11px] text-slate-400">
                  {f.placeholder}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <div className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20">
              <span>{el.formSubmitLabel || 'Submit Form'}</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {el.formFooterNote && (
            <p className="text-[9px] text-slate-500 text-center pt-0.5">{el.formFooterNote}</p>
          )}
        </div>
      );
    }

    case 'video_player':
    case 'media_placeholder': {
      const mediaType = el.mediaType || 'video';

      if (el.type === 'video_player' || mediaType === 'video') {
        const videoSrc = el.videoUrl || (el.imageUrl?.match(/\.(mp4|webm|mov)$/i) ? el.imageUrl : '') || (el.imageUrl?.startsWith('blob:') ? el.imageUrl : '');
        const isEmbed = videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be') || videoSrc.includes('vimeo.com');

        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 group shadow-md">
            {videoSrc ? (
              isEmbed ? (
                <iframe
                  src={videoSrc}
                  title={el.label}
                  className="h-full w-full pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <video
                  src={videoSrc}
                  poster={el.videoPoster || el.imageUrl}
                  autoPlay={el.videoAutoplay ?? false}
                  loop={el.videoLoop ?? true}
                  muted={el.videoMuted ?? true}
                  controls={el.videoControls ?? true}
                  playsInline
                  className="h-full w-full object-cover"
                />
              )
            ) : (
              <>
                <img
                  src={el.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
                  alt={el.label}
                  className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-between p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white border border-white/10">
                      HD VIDEO
                    </span>
                    <span className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-slate-300">
                      {el.mediaDuration || '02:45'}
                    </span>
                  </div>

                  <div className="flex items-center justify-center my-auto">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-lg shadow-blue-500/30 ring-4 ring-white/20">
                      <Play className="h-4 w-4 fill-white translate-x-0.5" />
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-white block truncate">{el.label}</span>
                    {el.mediaCaption && <p className="text-[9px] text-slate-400 truncate">{el.mediaCaption}</p>}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      }

      if (mediaType === 'document') {
        return (
          <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-3 flex flex-col justify-between">
            {/* Viewfinder corner brackets */}
            <div className="absolute top-2 left-2 h-3.5 w-3.5 border-t-2 border-l-2 border-sky-400"></div>
            <div className="absolute top-2 right-2 h-3.5 w-3.5 border-t-2 border-r-2 border-sky-400"></div>
            <div className="absolute bottom-2 left-2 h-3.5 w-3.5 border-b-2 border-l-2 border-sky-400"></div>
            <div className="absolute bottom-2 right-2 h-3.5 w-3.5 border-b-2 border-r-2 border-sky-400"></div>

            {/* Glowing laser scan line */}
            <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_8px_#38bdf8]"></div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-sky-400">
                <Camera className="h-3 w-3" /> CAMERA KYC
              </span>
              <span className="font-mono text-[9px] text-slate-500">AUTO-ALIGN</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <FileText className="h-6 w-6 text-slate-600 mb-1" />
              <span className="text-xs font-bold text-white">{el.label}</span>
              <span className="text-[9px] text-slate-400 mt-0.5">{el.mediaCaption || 'Center document in viewfinder'}</span>
            </div>

            <div className="h-2"></div>
          </div>
        );
      }

      if (mediaType === 'audio') {
        return (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Play className="h-3 w-3 fill-white translate-x-0.5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">{el.label}</span>
                  <span className="text-[9px] text-slate-400">{el.mediaCaption || 'Voice verification'}</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{el.mediaDuration || '00:42'}</span>
            </div>

            {/* Simulated sound wave bars */}
            <div className="flex items-center justify-between gap-1 h-5 px-1 bg-slate-950/60 rounded-lg py-1">
              {[40, 75, 55, 90, 60, 80, 45, 100, 70, 50, 85, 65, 95, 40, 60, 30].map((h, idx) => (
                <div 
                  key={idx} 
                  style={{ height: `${h}%` }} 
                  className={`w-1 rounded-full ${idx < 6 ? 'bg-blue-400' : 'bg-slate-700'}`} 
                />
              ))}
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 p-4 text-center">
          <ImageIcon className="h-6 w-6 text-slate-500 mb-1" />
          <span className="text-xs font-medium text-white">{el.label}</span>
          {el.mediaCaption && <span className="text-[10px] text-slate-400">{el.mediaCaption}</span>}
        </div>
      );
    }

    case 'splash_screen': {
      const isVideo = el.splashFileType === 'mp4';
      const fileExt = isVideo ? '.MP4' : '.PNG';
      const introAnim = el.splashIntroAnimation || 'scale-up';
      const outroAnim = el.splashOutroAnimation || 'fade-out';
      const sizeMode = el.splashVideoSizeMode || 'fullscreen';
      const aspectRatio = el.splashVideoAspectRatio || '9:16';
      const customWidth = el.splashVideoCustomWidth ?? 88;
      const isBlueBg = (() => {
        const c = (el.splashBgColor || '').toLowerCase();
        if (c.includes('blue') || c.includes('sky') || c.includes('cyan')) return true;
        if (c.startsWith('#') && c.length >= 7) {
          const r = parseInt(c.slice(1, 3), 16);
          const b = parseInt(c.slice(5, 7), 16);
          return b > 120 && b > r + 25;
        }
        return false;
      })();

      // Proportional Resized Video Splash mode
      if (isVideo && sizeMode === 'proportional') {
        return (
          <div className="relative overflow-hidden rounded-2xl border border-purple-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-3 shadow-xl">
            {/* Top metadata tags */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Video className="h-2.5 w-2.5" />
                  .MP4 SPLASH
                </span>
                <span className="flex items-center gap-1 rounded bg-purple-950/60 border border-purple-500/30 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-cyan-300">
                  <Ratio className="h-2 w-2 text-cyan-400" />
                  <span>{aspectRatio} ({customWidth}%)</span>
                </span>
              </div>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] text-slate-400 shrink-0">
                {el.splashDwellDuration || 2.5}s Dwell
              </span>
            </div>

            {/* Proportional Video Player Container */}
            <div className="flex justify-center my-2.5 w-full">
              <div
                style={{
                  width: `${customWidth}%`,
                  borderRadius: `${el.splashVideoBorderRadius ?? 20}px`,
                  transform: `scale(${(el.splashVideoScale ?? 100) / 100})`,
                }}
                className={`relative overflow-hidden border border-purple-400/50 bg-black shadow-2xl transition-all ${
                  aspectRatio === '9:16' ? 'aspect-[9/16]' :
                  aspectRatio === '16:9' ? 'aspect-[16/9]' :
                  aspectRatio === '1:1' ? 'aspect-square' :
                  aspectRatio === '4:5' ? 'aspect-[4/5]' :
                  aspectRatio === '4:3' ? 'aspect-[4/3]' :
                  aspectRatio === '21:9' ? 'aspect-[21/9]' :
                  'aspect-[9/16]'
                } ${el.splashVideoGlow !== false ? 'shadow-purple-500/40 ring-1 ring-purple-500/50' : ''}`}
              >
                <VideoPlayerPreview
                  src={el.splashMediaUrl}
                  fit={el.splashVideoFit || 'cover'}
                  opacity={el.splashVideoOpacity ?? 85}
                  borderRadius={el.splashVideoBorderRadius ?? 20}
                  className="h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />
                <div className="absolute bottom-2 left-2 rounded bg-black/80 backdrop-blur-md px-1.5 py-0.5 text-[8px] font-mono font-bold text-purple-200 border border-white/10 pointer-events-none">
                  {aspectRatio} • {customWidth}%
                </div>
              </div>
            </div>

            {/* Logo & Tagline */}
            <div className="flex flex-col items-center justify-center text-center pb-2">
              <div className="mb-2">
                <AppLogo size={42} onBlueBackground={isBlueBg} animated={false} iconOnly={true} />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {el.splashBrandTitle || el.label || 'FlowCraft Pro'}
              </h3>
              <p className="mt-0.5 text-[10px] text-slate-300 max-w-[200px] truncate font-medium">
                {el.splashTagline || 'From Idea to Automated'}
              </p>
            </div>

            {/* Intro / Outro badges */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80 text-[9px]">
              <div className="rounded-lg bg-slate-800/60 p-1.5 text-slate-300">
                <span className="text-slate-500 block uppercase font-mono text-[8px]">Intro</span>
                <span className="font-semibold text-blue-300 capitalize">{introAnim}</span>
              </div>
              <div className="rounded-lg bg-slate-800/60 p-1.5 text-slate-300">
                <span className="text-slate-500 block uppercase font-mono text-[8px]">Outro</span>
                <span className="font-semibold text-indigo-300 capitalize">{outroAnim}</span>
              </div>
            </div>
          </div>
        );
      }

      // Full screen or standard mode
      return (
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-4 shadow-xl">
          {/* Background Video if MP4 */}
          {isVideo && (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <VideoPlayerPreview
                src={el.splashMediaUrl}
                fit={el.splashVideoFit || 'cover'}
                opacity={el.splashVideoOpacity ?? 85}
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/75 pointer-events-none" />
            </div>
          )}

          {/* Top metadata tags */}
          <div className="relative z-10 flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[9px] font-bold ${
                isVideo 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {isVideo && <Video className="h-2.5 w-2.5" />}
                {fileExt} SPLASH
              </span>

              {isVideo && (
                <span className="flex items-center gap-1 rounded bg-purple-950/80 border border-purple-500/40 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-purple-200 backdrop-blur-sm">
                  <Maximize2 className="h-2 w-2 text-purple-400" />
                  <span>Full Screen Bleed</span>
                </span>
              )}
            </div>

            <span className="rounded bg-slate-800/80 backdrop-blur-sm px-1.5 py-0.5 font-mono text-[9px] text-slate-300 shrink-0">
              {el.splashDwellDuration || 2.5}s Dwell
            </span>
          </div>

          {/* Central Logo / Media Preview */}
          <div className="relative z-10 flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-3">
              <AppLogo size={52} onBlueBackground={isBlueBg} animated={false} iconOnly={true} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight drop-shadow-md">
              {el.splashBrandTitle || el.label || 'FlowCraft Pro'}
            </h3>
            <p className="mt-1 text-[11px] text-slate-200 max-w-[220px] truncate font-medium drop-shadow-sm">
              {el.splashTagline || 'From Idea to Automated'}
            </p>
          </div>

          {/* Intro / Outro badges */}
          <div className="relative z-10 mt-2 grid grid-cols-2 gap-1.5 pt-2 border-t border-white/10 text-[9px]">
            <div className="rounded-lg bg-slate-900/80 backdrop-blur-sm p-1.5 text-slate-300 border border-white/5">
              <span className="text-slate-400 block uppercase font-mono text-[8px]">Intro</span>
              <span className="font-semibold text-blue-300 capitalize">{introAnim}</span>
            </div>
            <div className="rounded-lg bg-slate-900/80 backdrop-blur-sm p-1.5 text-slate-300 border border-white/5">
              <span className="text-slate-400 block uppercase font-mono text-[8px]">Outro</span>
              <span className="font-semibold text-indigo-300 capitalize">{outroAnim}</span>
            </div>
          </div>
        </div>
      );
    }

    case 'kpi_stat': {
      const isBound = el.dataBinding?.enabled;
      const showPulse = isBound && el.dataBinding?.showLivePulse !== false;
      const currency = el.dataBinding?.currencyPrefix || '$';
      const isNegative = (el.metricChange || '').trim().startsWith('-');

      return (
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-3.5 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">{el.label}</span>
            {isBound && (
              <span className="flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 text-[9px] font-mono font-bold text-blue-300">
                {showPulse && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />}
                <span>{el.dataBinding?.sourceType === 'live_market_ws' ? 'LIVE WS' : el.dataBinding?.sourceType === 'rest_api' ? 'REST API' : 'DATA BOUND'}</span>
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
              {el.metricValue || `${currency}148,920.45`}
            </div>
            {el.metricChange && (
              <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-bold font-mono ${
                isNegative 
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              }`}>
                <TrendingUp className={`h-3 w-3 ${isNegative ? 'rotate-180' : ''}`} />
                {el.metricChange}
              </span>
            )}
          </div>
        </div>
      );
    }

    case 'line_chart': {
      const isBound = el.dataBinding?.enabled;
      const showPulse = isBound && el.dataBinding?.showLivePulse !== false;
      const timeframe = el.chartTimeframe || '1M';
      const lineColor = el.chartLineColor || '#3B82F6';
      const showArea = el.chartShowAreaGradient ?? true;
      const showGrid = el.chartShowGrid ?? true;
      const showPoints = el.chartShowPoints ?? true;
      const prefix = el.chartYAxisPrefix || '$';

      const points = el.chartPointsData || [
        { label: 'Mon', value: 142300 },
        { label: 'Tue', value: 144800 },
        { label: 'Wed', value: 143900 },
        { label: 'Thu', value: 146500 },
        { label: 'Fri', value: 147800 },
        { label: 'Sat', value: 147100 },
        { label: 'Sun', value: 148920 },
      ];

      const minVal = Math.min(...points.map(p => p.value));
      const maxVal = Math.max(...points.map(p => p.value));
      const range = maxVal - minVal || 1;

      // Generate SVG path coordinates
      const width = 330;
      const height = 110;
      const padX = 12;
      const padY = 14;

      const coords = points.map((p, i) => {
        const x = padX + (i / (points.length - 1)) * (width - 2 * padX);
        const y = height - padY - ((p.value - minVal) / range) * (height - 2 * padY);
        return { x, y, ...p };
      });

      const pathD = coords.reduce((acc, curr, idx) => {
        if (idx === 0) return `M ${curr.x} ${curr.y}`;
        // Cubic bezier control points for smooth line
        const prev = coords[idx - 1];
        const cx1 = prev.x + (curr.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (curr.x - prev.x) / 2;
        const cy2 = curr.y;
        return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
      }, '');

      const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;
      const gradientId = `line_grad_${el.id || Math.random().toString(36).substring(2, 7)}`;

      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg space-y-2.5">
          {/* Header & Live Status */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">{el.label || 'Valuation Curve'}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                High: {prefix}{maxVal.toLocaleString()} • Low: {prefix}{minVal.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {isBound && (
                <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300">
                  {showPulse && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />}
                  <span>{el.dataBinding?.marketTicker || 'LIVE'}</span>
                </span>
              )}
            </div>
          </div>

          {/* Timeframe Presets Bar */}
          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-1 border border-slate-800 text-[10px]">
            {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
              <span
                key={tf}
                className={`flex-1 py-1 text-center rounded-lg font-mono font-bold transition-all ${
                  tf === timeframe ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400'
                }`}
              >
                {tf}
              </span>
            ))}
          </div>

          {/* SVG Chart Graphic */}
          <div className="relative w-full overflow-hidden rounded-xl bg-slate-950/70 border border-slate-800/80 p-1">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {showGrid && (
                <g stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3">
                  <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} opacity="0.4" />
                  <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} opacity="0.4" />
                  <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} opacity="0.4" />
                </g>
              )}

              {/* Area gradient fill */}
              {showArea && <path d={areaD} fill={`url(#${gradientId})`} />}

              {/* Main curve line */}
              <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" />

              {/* Data points */}
              {showPoints && coords.map((c, i) => (
                <circle
                  key={i}
                  cx={c.x}
                  cy={c.y}
                  r={i === coords.length - 1 ? 4.5 : 2.5}
                  fill={i === coords.length - 1 ? '#FFFFFF' : lineColor}
                  stroke={lineColor}
                  strokeWidth="1.5"
                />
              ))}
            </svg>

            {/* Bottom X-Axis labels */}
            <div className="flex items-center justify-between px-2 pt-1 font-mono text-[9px] text-slate-400">
              {coords.map((c, i) => (
                <span key={i}>{c.label}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'bar_chart': {
      const isBound = el.dataBinding?.enabled;
      const barColor = el.chartLineColor || '#10B981';
      const points = el.chartPointsData || [
        { label: 'May', value: 34500 },
        { label: 'Jun', value: 48200 },
        { label: 'Jul', value: 41800 },
        { label: 'Aug', value: 62400 },
        { label: 'Sep', value: 58900 },
        { label: 'Oct', value: 76500 },
      ];

      const maxVal = Math.max(...points.map(p => p.value)) || 1;

      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white block">{el.label || 'Volume Histogram'}</span>
            {isBound && (
              <span className="rounded bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 text-[9px] font-mono text-emerald-300 font-bold">
                MONTHLY FLOW
              </span>
            )}
          </div>

          <div className="flex items-end justify-between gap-2 h-28 pt-4 pb-1 px-1 bg-slate-950/70 rounded-xl border border-slate-800/80">
            {points.map((pt, i) => {
              const heightPct = Math.max(14, (pt.value / maxVal) * 100);
              const isLatest = i === points.length - 1;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[8px] font-mono text-slate-400 tabular-nums">
                    {(pt.value / 1000).toFixed(0)}k
                  </span>
                  <div
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: isLatest ? '#10B981' : barColor,
                      opacity: isLatest ? 1 : 0.75,
                    }}
                    className="w-full rounded-t-md transition-all duration-300 hover:opacity-100 shadow-sm"
                  />
                  <span className="text-[9px] font-mono text-slate-300 mt-0.5">{pt.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case 'donut_chart': {
      const isBound = el.dataBinding?.enabled;
      const segments = el.donutSegments || [
        { label: 'Bitcoin (BTC)', value: 62540, color: '#F59E0B', percentage: 42 },
        { label: 'Ethereum (ETH)', value: 41700, color: '#6366F1', percentage: 28 },
        { label: 'Solana (SOL)', value: 26800, color: '#10B981', percentage: 18 },
        { label: 'USDC Treasury', value: 17880, color: '#0EA5E9', percentage: 12 },
      ];

      const total = segments.reduce((sum, s) => sum + s.value, 0);

      // SVG Donut calculation
      const size = 110;
      const strokeWidth = 14;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;

      let runningPct = 0;

      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-xs font-bold text-white block">{el.label || 'Asset Allocation'}</span>
              <span className="text-[10px] text-slate-400">Total Holdings: ${total.toLocaleString()}</span>
            </div>
            {isBound && (
              <span className="rounded bg-purple-500/15 border border-purple-500/25 px-1.5 py-0.5 text-[9px] font-mono text-purple-300 font-bold">
                PORTFOLIO
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Donut SVG Ring */}
            <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
                {/* Background Ring */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke="#1E293B"
                  strokeWidth={strokeWidth}
                />
                {/* Donut segments */}
                {segments.map((seg, i) => {
                  const pct = seg.percentage || (seg.value / total) * 100;
                  const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((runningPct / 100) * circumference);
                  runningPct += pct;

                  return (
                    <circle
                      key={i}
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-mono text-xs font-bold text-white tabular-nums">100%</span>
                <span className="text-[8px] font-mono text-slate-400">DIVERSIFIED</span>
              </div>
            </div>

            {/* Color Legend List */}
            <div className="flex-1 space-y-1.5 min-w-0">
              {segments.map((seg, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span style={{ backgroundColor: seg.color }} className="h-2 w-2 rounded-full shrink-0" />
                    <span className="text-slate-300 font-medium truncate">{seg.label}</span>
                  </div>
                  <span className="font-mono font-bold text-white ml-1">
                    {seg.percentage || Math.round((seg.value / total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'live_ticker': {
      const isBound = el.dataBinding?.enabled;
      const items = el.tickerItems || [
        { symbol: 'BTC/USD', price: '$68,450.00', change: '+3.42%', isUp: true },
        { symbol: 'ETH/USD', price: '$3,520.80', change: '+2.15%', isUp: true },
        { symbol: 'SOL/USD', price: '$184.25', change: '+8.60%', isUp: true },
        { symbol: 'S&P 500', price: '5,815.20', change: '+0.54%', isUp: true },
      ];

      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-2.5 shadow-md space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>{el.label || 'Live Market Ticker Feed'}</span>
            </span>
            {isBound && (
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>STREAM</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {items.map((tick, i) => (
              <div
                key={i}
                className="flex items-center gap-2 shrink-0 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 shadow-xs"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-300 block">{tick.symbol}</span>
                  <span className="font-mono text-xs font-bold text-white tabular-nums">{tick.price}</span>
                </div>
                <span className={`font-mono text-[10px] font-bold ${tick.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tick.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'gauge_diagram': {
      const min = el.gaugeMin ?? 300;
      const max = el.gaugeMax ?? 850;
      const score = Math.max(min, Math.min(max, el.gaugeValue ?? 785));
      const pct = (score - min) / (max - min);

      // Semi-circle gauge arc calculation
      const size = 160;
      const strokeW = 12;
      const r = (size - strokeW) / 2;
      const halfCircumference = Math.PI * r;
      const dashoffset = halfCircumference * (1 - pct);

      const statusColor = el.gaugeStatus === 'critical' ? '#EF4444' : el.gaugeStatus === 'moderate' ? '#F59E0B' : '#10B981';

      return (
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-3.5 shadow-lg flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-white">{el.label || 'Credit & Risk Gauge'}</span>
            <span className="text-[10px] font-mono text-slate-400">Scale: {min}–{max}</span>
          </div>

          {/* Half circle radial gauge */}
          <div className="relative h-24 w-40 flex items-center justify-center overflow-hidden pt-2">
            <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`} className="overflow-visible">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              {/* Base background track */}
              <path
                d={`M ${strokeW / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - strokeW / 2} ${size / 2}`}
                fill="none"
                stroke="#1E293B"
                strokeWidth={strokeW}
                strokeLinecap="round"
              />

              {/* Colored active score arc */}
              <path
                d={`M ${strokeW / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - strokeW / 2} ${size / 2}`}
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth={strokeW}
                strokeDasharray={`${halfCircumference} ${halfCircumference}`}
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Score Center Value */}
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="font-mono text-2xl font-bold text-white tracking-tight tabular-nums drop-shadow">
                {score}
              </span>
              <span style={{ color: statusColor }} className="text-[10px] font-bold uppercase tracking-wider">
                {el.gaugeLabel || 'Excellent Standing'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    case 'data_table': {
      const cols = el.tableColumns || [
        { key: 'time', label: 'Time' },
        { key: 'counterparty', label: 'Counterparty' },
        { key: 'status', label: 'Status' },
        { key: 'amount', label: 'Amount', align: 'right' },
      ];

      const rows = el.tableRows || [
        { id: '1', time: '14:28:02', counterparty: 'Stripe Settlement', status: 'Settled', amount: '+$14,250.00' },
        { id: '2', time: '13:50:11', counterparty: 'AWS Cloud Services', status: 'Cleared', amount: '-$840.20' },
        { id: '3', time: '12:15:44', counterparty: 'Silicon Valley Bank', status: 'Settled', amount: '+$85,000.00' },
      ];

      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-md space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white">{el.label || 'Transactions Ledger'}</span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
              {rows.length} Entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-400 font-mono">
                  {cols.map((c) => (
                    <th key={c.key} className={`pb-1.5 font-semibold ${c.align === 'right' ? 'text-right' : 'text-left'}`}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono text-slate-300">
                {rows.map((r, rIdx) => {
                  const isPositive = (r.amount || '').startsWith('+');
                  return (
                    <tr key={r.id || rIdx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 text-slate-400">{r.time}</td>
                      <td className="py-2 font-medium text-white truncate max-w-[120px]">{r.counterparty}</td>
                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          r.status === 'Settled' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          r.status === 'Cleared' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className={`py-2 text-right font-bold ${isPositive ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {r.amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
