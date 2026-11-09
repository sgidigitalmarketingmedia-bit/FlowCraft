import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize2, Plus, Move, Eye, Link2, 
  Layers, MousePointer, Sparkles, SlidersHorizontal, RefreshCw,
  ChevronLeft, ChevronRight, Palette, Zap, X, StickyNote, MapPin,
  EyeOff, MessageSquareCode
} from 'lucide-react';
import { 
  Screen, ElementProperties, FlowConnection, ElementType, 
  ActionTrigger, TransitionType, ScreenAnnotation, AnnotationCategory, 
  AnnotationColor, AnnotationType 
} from '../../types/builder';
import { ScreenCard } from './ScreenCard';
import { FlowWiresOverlay } from './FlowWiresOverlay';
import { AssetPalette } from './AssetPalette';
import { AIFlowBuilderModal } from './AIFlowBuilderModal';
import { CanvasContextMenu } from './CanvasContextMenu';

interface InteractiveCanvasProps {
  screens: Screen[];
  connections: FlowConnection[];
  selectedScreenId: string | null;
  selectedElementId: string | null;
  onSelectScreen: (screenId: string) => void;
  onSelectElement: (elementId: string) => void;
  onUpdateScreenPos: (screenId: string, x: number, y: number) => void;
  onDuplicateScreen: (screenId: string) => void;
  onDeleteScreen: (screenId: string) => void;
  onSetEntryScreen: (screenId: string) => void;
  onAddElementToScreen: (screenId: string, type: ElementType) => void;
  onAddElementWithProps?: (screenId: string, element: ElementProperties) => void;
  onMoveElement: (screenId: string, elementIndex: number, direction: 'up' | 'down') => void;
  onDeleteElement: (screenId: string, elementId: string) => void;
  onOpenAddScreenModal: () => void;
  onSelectConnection: (conn: FlowConnection) => void;
  onAddConnection?: (conn: FlowConnection) => void;
  onDeleteConnection?: (connId: string) => void;
  onOpenFlowWirePicker?: (sourceScreenId: string, sourceElementId: string) => void;
  onApplyFlow?: (screens: Screen[], connections: FlowConnection[], flowTitle?: string) => void;
  onOpenColorPalette?: () => void;
  onAddAnnotation?: (screenId: string, annotation: ScreenAnnotation) => void;
  onUpdateAnnotation?: (screenId: string, annotationId: string, updates: Partial<ScreenAnnotation>) => void;
  onDeleteAnnotation?: (screenId: string, annotationId: string) => void;
  onMoveAnnotation?: (screenId: string, annotationId: string, x: number, y: number) => void;
  isDarkMode: boolean;
  showPropertiesSidebar?: boolean;
  onTogglePropertiesSidebar?: () => void;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  screens,
  connections,
  selectedScreenId,
  selectedElementId,
  onSelectScreen,
  onSelectElement,
  onUpdateScreenPos,
  onDuplicateScreen,
  onDeleteScreen,
  onSetEntryScreen,
  onAddElementToScreen,
  onAddElementWithProps,
  onMoveElement,
  onDeleteElement,
  onOpenAddScreenModal,
  onSelectConnection,
  onAddConnection,
  onDeleteConnection,
  onOpenFlowWirePicker,
  onApplyFlow,
  onOpenColorPalette,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  onMoveAnnotation,
  isDarkMode,
  showPropertiesSidebar = false,
  onTogglePropertiesSidebar,
}) => {
  const [scale, setScale] = useState(1.0);
  const [pan, setPan] = useState({ x: 80, y: 40 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<'design' | 'prototype' | 'annotate'>('design');
  const [annotateTool, setAnnotateTool] = useState<'sticky_note' | 'pin'>('sticky_note');
  const [annotateCategory, setAnnotateCategory] = useState<AnnotationCategory>('dev_note');
  const [annotateColor, setAnnotateColor] = useState<AnnotationColor>('yellow');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [showAssetPalette, setShowAssetPalette] = useState(true);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Context Menu State (Right-click on screen/element)
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    sourceScreen: Screen;
    sourceElement?: ElementProperties | null;
  } | null>(null);

  // Live Wire Dragging State
  const [draftWire, setDraftWire] = useState<{
    sourceScreenId: string;
    sourceElementId?: string;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const [hoveredTargetScreenId, setHoveredTargetScreenId] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to find vertical center of an element in canvas coordinates
  const getElementVerticalCenter = (screen: Screen, elementId?: string) => {
    if (!elementId) return screen.height / 2;
    let top = 48; // header
    for (const el of screen.elements) {
      if (el.id === elementId) {
        return top + 24;
      }
      top += 58;
    }
    return screen.height / 2;
  };

  const handleStartWireFromScreen = (screenId: string, clientX?: number, clientY?: number) => {
    const screen = screens.find((s) => s.id === screenId);
    if (!screen) return;
    const startX = screen.x + screen.width;
    const startY = screen.y + screen.height / 2;
    const initialCurrentX = clientX !== undefined ? (clientX - pan.x) / scale : startX + 50;
    const initialCurrentY = clientY !== undefined ? (clientY - pan.y) / scale : startY;

    setDraftWire({
      sourceScreenId: screenId,
      sourceElementId: undefined,
      startX,
      startY,
      currentX: initialCurrentX,
      currentY: initialCurrentY,
    });
    setContextMenu(null);
  };

  const handleStartWireFromElement = (screenId: string, elementId: string, clientX?: number, clientY?: number) => {
    const screen = screens.find((s) => s.id === screenId);
    if (!screen) return;
    const startX = screen.x + screen.width;
    const startY = screen.y + getElementVerticalCenter(screen, elementId);
    const initialCurrentX = clientX !== undefined ? (clientX - pan.x) / scale : startX + 50;
    const initialCurrentY = clientY !== undefined ? (clientY - pan.y) / scale : startY;

    setDraftWire({
      sourceScreenId: screenId,
      sourceElementId: elementId,
      startX,
      startY,
      currentX: initialCurrentX,
      currentY: initialCurrentY,
    });
    setContextMenu(null);
  };

  const handleConnect = (
    sourceScreenId: string,
    sourceElementId: string | undefined,
    targetScreenId: string,
    trigger: ActionTrigger = 'onClick',
    transition: TransitionType = 'slide-left'
  ) => {
    if (sourceScreenId === targetScreenId) return;
    const sourceScreen = screens.find((s) => s.id === sourceScreenId);
    const targetScreen = screens.find((s) => s.id === targetScreenId);
    if (!sourceScreen || !targetScreen) return;

    const elId = sourceElementId || sourceScreen.elements[0]?.id || `el_screen_${sourceScreenId}`;
    const newConn: FlowConnection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      sourceScreenId,
      sourceElementId: elId,
      targetScreenId,
      trigger,
      transition,
    };

    if (onAddConnection) {
      onAddConnection(newConn);
    }
    showToast(`⚡ Wire connected: "${sourceScreen.title}" → "${targetScreen.title}"`);
    setDraftWire(null);
    setHoveredTargetScreenId(null);
  };

  const handleDisconnect = (sourceScreenId: string, sourceElementId?: string | null) => {
    const conn = connections.find(
      (c) =>
        c.sourceScreenId === sourceScreenId &&
        (!sourceElementId || c.sourceElementId === sourceElementId)
    );
    if (conn && onDeleteConnection) {
      onDeleteConnection(conn.id);
      showToast('Wire disconnected');
    }
  };

  // Close context menu on global click or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
        setDraftWire(null);
        setHoveredTargetScreenId(null);
      }
    };
    const handleGlobalClick = () => {
      setContextMenu(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const handleFlowApplied = (newScreens: Screen[], newConnections: FlowConnection[], flowTitle?: string) => {
    if (onApplyFlow) {
      onApplyFlow(newScreens, newConnections, flowTitle);
    }
    setPan({ x: 60, y: 60 });
    setScale(0.78);
  };

  // Dragging artboard logic
  const [draggingScreenId, setDraggingScreenId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Pan canvas handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking direct canvas background or holding space
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-bg')) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draftWire) {
      const mouseCanvasX = (e.clientX - pan.x) / scale;
      const mouseCanvasY = (e.clientY - pan.y) / scale;
      setDraftWire((prev) => (prev ? { ...prev, currentX: mouseCanvasX, currentY: mouseCanvasY } : null));

      // Check if hovering over any other screen
      const hoveredScreen = screens.find(
        (s) =>
          s.id !== draftWire.sourceScreenId &&
          mouseCanvasX >= s.x - 20 &&
          mouseCanvasX <= s.x + s.width + 20 &&
          mouseCanvasY >= s.y - 20 &&
          mouseCanvasY <= s.y + s.height + 20
      );
      setHoveredTargetScreenId(hoveredScreen ? hoveredScreen.id : null);
    } else if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    } else if (draggingScreenId) {
      const screen = screens.find(s => s.id === draggingScreenId);
      if (screen) {
        // Adjust for canvas scale
        const newX = Math.round((e.clientX - pan.x) / scale - dragOffset.x);
        const newY = Math.round((e.clientY - pan.y) / scale - dragOffset.y);
        onUpdateScreenPos(draggingScreenId, Math.max(10, newX), Math.max(10, newY));
      }
    }
  };

  const handleMouseUp = () => {
    if (draftWire) {
      if (hoveredTargetScreenId && hoveredTargetScreenId !== draftWire.sourceScreenId) {
        handleConnect(draftWire.sourceScreenId, draftWire.sourceElementId, hoveredTargetScreenId);
        setDraftWire(null);
        setHoveredTargetScreenId(null);
      }
      // Keep draftWire active if user just clicked to start wire drawing mode, so they can click their target screen!
    }
    setIsPanning(false);
    setDraggingScreenId(null);
  };

  const zoomIn = () => setScale(prev => Math.min(Number((prev + 0.15).toFixed(2)), 2.0));
  const zoomOut = () => setScale(prev => Math.max(Number((prev - 0.15).toFixed(2)), 0.35));

  // Smart Fit to Viewport: centers the selected screen or artboard with optimal comfortable scale
  const fitToViewport = (targetScreenId?: string) => {
    if (!canvasRef.current) return;
    const canvasW = canvasRef.current.clientWidth;
    const canvasH = canvasRef.current.clientHeight;
    const targetId = targetScreenId || selectedScreenId;
    const screenToFit = screens.find(s => s.id === targetId) || screens[0];
    
    if (screenToFit) {
      const targetW = screenToFit.width || 390;
      const targetH = screenToFit.height || 844;
      // Scale so phone fills ~80-85% of visible canvas height or width comfortably
      const fitH = (canvasH - 120) / targetH;
      const fitW = (canvasW - 60) / targetW;
      const optimalScale = Math.min(Math.max(Number(Math.min(fitH, fitW, 1.25).toFixed(2)), 0.45), 1.25);
      
      const targetX = canvasW / 2 - (screenToFit.x + targetW / 2) * optimalScale;
      const targetY = Math.max(30, canvasH / 2 - (screenToFit.y + targetH / 2) * optimalScale);
      
      setScale(optimalScale);
      setPan({ x: Math.round(targetX), y: Math.round(targetY) });
    } else {
      setScale(1.0);
      setPan({ x: 60, y: 40 });
    }
  };

  const setExactScale = (newScale: number) => {
    if (!canvasRef.current) {
      setScale(newScale);
      return;
    }
    const canvasW = canvasRef.current.clientWidth;
    const canvasH = canvasRef.current.clientHeight;
    const screenToCenter = screens.find(s => s.id === selectedScreenId) || screens[0];
    if (screenToCenter) {
      const targetW = screenToCenter.width || 390;
      const targetH = screenToCenter.height || 844;
      const targetX = canvasW / 2 - (screenToCenter.x + targetW / 2) * newScale;
      const targetY = Math.max(30, canvasH / 2 - (screenToCenter.y + targetH / 2) * newScale);
      setScale(newScale);
      setPan({ x: Math.round(targetX), y: Math.round(targetY) });
    } else {
      setScale(newScale);
    }
  };

  const resetZoom = () => {
    setExactScale(1.0);
  };

  const activeScreen = screens.find(s => s.id === selectedScreenId) || screens[0];

  const handleAddTemplateToActiveScreen = (template: Omit<ElementProperties, 'id'>) => {
    if (!activeScreen) return;
    const newElement: ElementProperties = {
      ...template,
      id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    if (onAddElementWithProps) {
      onAddElementWithProps(activeScreen.id, newElement);
    } else {
      onAddElementToScreen(activeScreen.id, template.type);
    }
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden select-none bg-slate-950">
      {/* Left Collapsible Asset Palette (Responsive Drawer on mobile, sidebar on desktop) */}
      {showAssetPalette && (
        <>
          <div 
            onClick={() => setShowAssetPalette(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 md:relative md:inset-auto h-full shadow-2xl flex shrink-0">
            <AssetPalette
              onAddElement={handleAddTemplateToActiveScreen}
              activeScreenTitle={activeScreen?.title}
              onClose={() => setShowAssetPalette(false)}
            />
          </div>
        </>
      )}

      {/* Main Figma Canvas Workspace */}
      <div
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => {
          if (draftWire && (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-bg'))) {
            setDraftWire(null);
            setHoveredTargetScreenId(null);
          }
        }}
        onContextMenu={(e) => {
          if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-bg')) {
            e.preventDefault();
          }
        }}
        className={`relative flex-1 overflow-hidden cursor-default canvas-bg ${
          isDarkMode ? 'bg-[#080B11] text-slate-100' : 'bg-slate-100 bg-canvas-dots-light text-slate-900'
        }`}
        style={
          isDarkMode
            ? {
                backgroundColor: '#080B11',
                backgroundImage:
                  'radial-gradient(#3B82F6 0.75px, transparent 0.75px), radial-gradient(#1E293B 0.75px, transparent 0.75px)',
                backgroundSize: '28px 28px',
                backgroundPosition: '0 0, 14px 14px',
              }
            : undefined
        }
      >
        {/* Docked Open Arrow Tab when Asset Palette is collapsed */}
        {!showAssetPalette && (
          <button
            onClick={() => setShowAssetPalette(true)}
            className="absolute left-0 top-16 sm:top-20 z-40 flex items-center gap-1 rounded-r-xl border border-l-0 border-violet-500/30 bg-[#120F24]/95 px-2 py-3 text-xs font-semibold text-slate-300 shadow-2xl backdrop-blur-xl hover:bg-gradient-to-r hover:from-[#6B39F4] hover:to-[#8B5CF6] hover:text-white hover:border-violet-400 transition-all group"
            title="Open Asset Palette"
          >
            <ChevronRight className="h-4 w-4 text-violet-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider [writing-mode:vertical-lr] rotate-180 py-1">
              Assets
            </span>
          </button>
        )}

        {/* Floating Canvas Top Control Bar with FlowCraft Obsidian Frosted Glass */}
        <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-30 flex max-w-[calc(100vw-20px)] flex-wrap items-center gap-1.5 sm:gap-2">
          {/* AI Flow Architect Generator Button */}
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B39F4] via-[#8B5CF6] to-[#4B22B8] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-violet-600/35 border border-violet-400/30 transition-all active:scale-95"
            title="AI Flow Architect: Build custom flow with prompt or pick from 10 industry flows"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span className="hidden xs:inline">AI Flow Architect</span>
            <span className="xs:hidden">AI Architect</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px] font-mono tracking-tight font-semibold hidden sm:inline">
              &lt; 2 min
            </span>
          </button>

          {/* Toggle Asset Palette with Close/Open Arrow */}
          <button
            onClick={() => setShowAssetPalette(!showAssetPalette)}
            title={showAssetPalette ? "Collapse Asset Palette" : "Open Asset Palette"}
            className={`flex items-center gap-1 sm:gap-1.5 rounded-xl border px-2 sm:px-3 py-1.5 text-xs font-semibold backdrop-blur-xl shadow-md transition-all ${
              showAssetPalette
                ? 'border-violet-500/40 bg-[#1A1435] text-white shadow-sm shadow-violet-950/50'
                : 'border-violet-500/20 bg-[#100D22]/90 text-slate-400 hover:text-white hover:bg-[#1A1435]'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-violet-400" />
            <span className="hidden sm:inline">Asset Palette</span>
            <span className="sm:hidden">Assets</span>
            {showAssetPalette ? (
              <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>

          {/* Mode Switcher: Design vs Prototype / Journey Flow vs Annotate (Notes & Pins) */}
          <div className="flex items-center gap-1 rounded-xl border border-violet-500/20 bg-[#100D22]/90 p-0.5 sm:p-1 backdrop-blur-xl shadow-md text-xs">
            <button
              onClick={() => setMode('design')}
              className={`flex items-center gap-1 rounded-lg px-2 sm:px-3 py-1 font-semibold transition-all ${
                mode === 'design'
                  ? 'bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MousePointer className="h-3 w-3" />
              <span>Design</span>
            </button>

            <button
              onClick={() => setMode('prototype')}
              className={`flex items-center gap-1 rounded-lg px-2 sm:px-3 py-1 font-semibold transition-all ${
                mode === 'prototype'
                  ? 'bg-gradient-to-r from-[#4B22B8] to-[#6B39F4] text-white shadow-sm ring-1 ring-violet-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Link2 className="h-3 w-3" />
              <span className="hidden sm:inline">Flow Wires</span>
              <span className="sm:hidden">Wires</span>
            </button>

            <button
              onClick={() => setMode('annotate')}
              className={`flex items-center gap-1 rounded-lg px-2 sm:px-3 py-1 font-semibold transition-all ${
                mode === 'annotate'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/30 ring-1 ring-amber-300'
                  : 'text-slate-400 hover:text-amber-200'
              }`}
              title="Sticky Notes & Developer Annotation Pins Tool"
            >
              <StickyNote className="h-3 w-3 text-amber-300 fill-amber-300/30" />
              <span className="hidden sm:inline">Annotate & Notes</span>
              <span className="sm:hidden">Notes</span>
              {screens.reduce((sum, s) => sum + (s.annotations?.length || 0), 0) > 0 && (
                <span className="rounded-full bg-white/20 px-1 py-0.2 text-[9px] font-mono font-bold">
                  {screens.reduce((sum, s) => sum + (s.annotations?.length || 0), 0)}
                </span>
              )}
            </button>
          </div>

          {/* Add New Artboard Screen Button */}
          <button
            onClick={onOpenAddScreenModal}
            className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-600/30 backdrop-blur-xl transition-all active:scale-95 border border-violet-400/30"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Artboard</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Color Palette Design System Button */}
          {onOpenColorPalette && (
            <button
              onClick={onOpenColorPalette}
              className="flex items-center gap-1 sm:gap-1.5 rounded-xl border border-violet-500/30 bg-[#100D22]/90 hover:bg-[#1A1435] hover:text-white px-2 sm:px-3 py-1.5 text-xs font-semibold text-violet-300 backdrop-blur-xl shadow-md transition-all active:scale-95"
              title="App Color Palette & Design System"
            >
              <Palette className="h-3.5 w-3.5 text-violet-400" />
              <span className="hidden sm:inline">Color Palette</span>
            </button>
          )}

          {/* Toggle Properties Panel with Close/Open Arrow */}
          {onTogglePropertiesSidebar && (
            <button
              onClick={onTogglePropertiesSidebar}
              title={showPropertiesSidebar ? "Collapse Properties Panel" : "Open Properties Panel"}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-xl border px-2 sm:px-3 py-1.5 text-xs font-semibold backdrop-blur-xl shadow-md transition-all ${
                showPropertiesSidebar
                  ? 'border-violet-500/40 bg-[#1A1435] text-white shadow-sm shadow-violet-950/50'
                  : 'border-violet-500/20 bg-[#100D22]/90 text-slate-400 hover:text-white hover:bg-[#1A1435]'
              }`}
            >
              <span>Props</span>
              {showPropertiesSidebar ? (
                <ChevronRight className="h-3.5 w-3.5 text-violet-400" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5 text-violet-400" />
              )}
            </button>
          )}
        </div>

        {/* Floating Annotation Sub-Bar (Sticky Notes & Pins Controls) */}
        {mode === 'annotate' && (
          <div className="absolute top-14 left-2.5 sm:top-16 sm:left-4 z-30 flex max-w-[calc(100vw-20px)] flex-wrap items-center gap-1.5 sm:gap-2 rounded-2xl border border-amber-500/40 bg-[#141024]/95 p-1.5 backdrop-blur-2xl shadow-2xl shadow-black/80 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Tool Toggle: Sticky Note vs Pin */}
            <div className="flex items-center rounded-xl bg-black/50 p-0.5 border border-white/10">
              <button
                onClick={() => setAnnotateTool('sticky_note')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  annotateTool === 'sticky_note'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <StickyNote className="h-3.5 w-3.5" />
                <span>Sticky Note</span>
              </button>

              <button
                onClick={() => setAnnotateTool('pin')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  annotateTool === 'pin'
                    ? 'bg-violet-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Pin Marker</span>
              </button>
            </div>

            {/* Category Selector */}
            <select
              value={annotateCategory}
              onChange={(e) => setAnnotateCategory(e.target.value as AnnotationCategory)}
              className="rounded-xl border border-white/10 bg-black/40 px-2 py-1 text-xs font-semibold text-slate-200 focus:outline-none"
            >
              <option value="dev_note">📝 Dev Note</option>
              <option value="api_spec">⚡ API Spec</option>
              <option value="interaction">👆 Interaction</option>
              <option value="business_logic">⚙️ Logic</option>
              <option value="todo">⏳ TODO</option>
            </select>

            {/* Color Swatch Picker */}
            <div className="flex items-center gap-1 bg-black/40 rounded-xl px-2 py-1 border border-white/10">
              {(['yellow', 'violet', 'emerald', 'amber', 'rose', 'blue'] as AnnotationColor[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setAnnotateColor(c)}
                  className={`h-3.5 w-3.5 rounded-full transition-transform ${
                    c === 'yellow' ? 'bg-yellow-400' :
                    c === 'violet' ? 'bg-violet-500' :
                    c === 'emerald' ? 'bg-emerald-400' :
                    c === 'amber' ? 'bg-amber-500' :
                    c === 'rose' ? 'bg-rose-500' : 'bg-sky-400'
                  } ${annotateColor === c ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-[#141024]' : 'opacity-60 hover:opacity-100'}`}
                  title={`Color: ${c}`}
                />
              ))}
            </div>

            {/* Quick Drop on Selected Screen Button */}
            {onAddAnnotation && (
              <button
                onClick={() => {
                  const targetScreen = screens.find((s) => s.id === selectedScreenId) || screens[0];
                  if (!targetScreen) return;
                  const count = targetScreen.annotations?.length || 0;
                  const isPin = annotateTool === 'pin';
                  const newAnnotation: ScreenAnnotation = {
                    id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                    screenId: targetScreen.id,
                    type: isPin ? 'pin' : 'sticky_note',
                    number: count + 1,
                    title: isPin ? 'Context Pin' : 'Developer Note',
                    content: '',
                    category: annotateCategory,
                    color: annotateColor,
                    author: 'Lead Architect',
                    x: isPin ? 220 : 24,
                    y: 90 + (count % 4) * 35,
                    width: 210,
                    createdAt: new Date().toISOString(),
                  };
                  onAddAnnotation(targetScreen.id, newAnnotation);
                  setSelectedAnnotationId(newAnnotation.id);
                  showToast(`Dropped ${isPin ? 'pin' : 'sticky note'} on ${targetScreen.title}`);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-2.5 py-1 text-xs font-bold text-amber-300 transition-all active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Drop on Screen</span>
              </button>
            )}

            {/* Show / Hide Toggle */}
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`flex items-center gap-1 rounded-xl px-2 py-1 text-xs font-medium transition-colors ${
                showAnnotations ? 'text-slate-300 hover:text-white bg-white/10' : 'text-slate-500 bg-black/40'
              }`}
              title={showAnnotations ? "Hide Annotations" : "Show Annotations"}
            >
              {showAnnotations ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{showAnnotations ? 'Visible' : 'Hidden'}</span>
            </button>

            {/* Instruction Pill */}
            <span className="text-[10.5px] text-amber-200/70 px-1 hidden lg:inline">
              👉 Click anywhere on an artboard to place note
            </span>
          </div>
        )}

        {/* Floating Zoom & Responsive Viewport Bar (Bottom-Right) */}
        <div className="absolute bottom-16 sm:bottom-4 right-3 sm:right-4 z-30 flex items-center gap-1 sm:gap-1.5 rounded-2xl border border-violet-500/25 bg-[#100D22]/95 p-1 sm:p-1.5 backdrop-blur-2xl shadow-xl text-slate-300 text-xs shadow-black/60">
          <button
            onClick={() => fitToViewport()}
            title="Auto-Fit Active Screen to Viewport"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold bg-violet-600/25 border border-violet-500/30 text-violet-200 hover:bg-violet-600 hover:text-white transition-all shadow-xs"
          >
            <Maximize2 className="h-3.5 w-3.5 text-violet-400" />
            <span>Fit</span>
          </button>

          <button
            onClick={() => setExactScale(1.0)}
            title="100% Native Pixel Scale (1:1 Crisp & Readable)"
            className={`rounded-lg px-2 py-1 text-[11px] font-mono font-bold transition-all ${
              Math.round(scale * 100) === 100
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-[#1C1635] hover:text-white'
            }`}
          >
            100%
          </button>

          <button
            onClick={() => setExactScale(1.25)}
            title="125% Enlarged Readability Scale"
            className={`hidden xs:inline-block rounded-lg px-2 py-1 text-[11px] font-mono font-bold transition-all ${
              Math.round(scale * 100) === 125
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-[#1C1635] hover:text-white'
            }`}
          >
            125%
          </button>

          <div className="h-4 w-px bg-violet-500/20 mx-0.5"></div>

          <button
            onClick={zoomOut}
            title="Zoom Out (-15%)"
            className="rounded-lg p-1.5 hover:bg-[#1C1635] hover:text-white transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <span className="px-1.5 py-0.5 font-mono text-[11px] font-bold text-violet-300 tabular-nums min-w-[36px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={zoomIn}
            title="Zoom In (+15%)"
            className="rounded-lg p-1.5 hover:bg-[#1C1635] hover:text-white transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>


        {/* Scalable & Pannable Canvas Viewport */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
          className="absolute top-0 left-0 h-full w-full pointer-events-auto"
        >
          {/* Real-time Journey Flow Bezier Wires */}
          <FlowWiresOverlay
            screens={screens}
            connections={connections}
            selectedElementId={selectedElementId}
            onSelectConnection={onSelectConnection}
            onDeleteConnection={onDeleteConnection}
            draftWire={draftWire}
            scale={scale}
          />

          {/* Artboard Screens */}
          {screens.map((screen) => (
            <div
              key={screen.id}
              data-screen-id={screen.id}
              onMouseDown={(e) => {
                // If user clicks screen header, start dragging
                const target = e.target as HTMLElement;
                if (target.closest('.cursor-grab') || target.tagName === 'SPAN' || target.closest('header')) {
                  setDraggingScreenId(screen.id);
                  setDragOffset({
                    x: (e.clientX - pan.x) / scale - screen.x,
                    y: (e.clientY - pan.y) / scale - screen.y,
                  });
                }
              }}
            >
              <ScreenCard
                screen={screen}
                screens={screens}
                isSelected={selectedScreenId === screen.id}
                selectedElementId={selectedElementId}
                onSelectScreen={onSelectScreen}
                onSelectElement={onSelectElement}
                onDuplicateScreen={onDuplicateScreen}
                onDeleteScreen={onDeleteScreen}
                onSetEntryScreen={onSetEntryScreen}
                onAddElement={(screenId) => {
                  onSelectScreen(screenId);
                  onAddElementToScreen(screenId, 'button');
                }}
                onAddElementWithProps={onAddElementWithProps}
                onMoveElement={onMoveElement}
                onDeleteElement={onDeleteElement}
                onStartWireFromElement={handleStartWireFromElement}
                onStartWireFromScreen={handleStartWireFromScreen}
                onOpenContextMenu={(e, scr, el) => {
                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    sourceScreen: scr,
                    sourceElement: el,
                  });
                }}
                onQuickConnect={(srcId, srcElId, targetId) => {
                  handleConnect(srcId, srcElId, targetId);
                }}
                isDraftTarget={hoveredTargetScreenId === screen.id}
                isWiringActive={!!draftWire}
                onConnectAsTarget={(targetId) => {
                  if (draftWire) {
                    handleConnect(draftWire.sourceScreenId, draftWire.sourceElementId, targetId);
                  }
                }}
                connections={connections}
                isAnnotateMode={mode === 'annotate'}
                annotateToolType={annotateTool}
                annotateCategory={annotateCategory}
                annotateColor={annotateColor}
                showAnnotations={showAnnotations}
                scale={scale}
                selectedAnnotationId={selectedAnnotationId}
                onSelectAnnotation={setSelectedAnnotationId}
                onAddAnnotation={onAddAnnotation}
                onUpdateAnnotation={onUpdateAnnotation}
                onDeleteAnnotation={onDeleteAnnotation}
                onMoveAnnotation={onMoveAnnotation}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right-click Context Menu */}
      {contextMenu && (
        <CanvasContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          sourceScreen={contextMenu.sourceScreen}
          sourceElement={contextMenu.sourceElement}
          screens={screens}
          connections={connections}
          onConnectToScreen={(targetId, trigger, transition) => {
            handleConnect(
              contextMenu.sourceScreen.id,
              contextMenu.sourceElement?.id,
              targetId,
              trigger,
              transition
            );
          }}
          onStartDragWire={() => {
            if (contextMenu.sourceElement) {
              handleStartWireFromElement(contextMenu.sourceScreen.id, contextMenu.sourceElement.id);
            } else {
              handleStartWireFromScreen(contextMenu.sourceScreen.id);
            }
          }}
          onDisconnect={() => {
            handleDisconnect(contextMenu.sourceScreen.id, contextMenu.sourceElement?.id);
          }}
          onDuplicateScreen={onDuplicateScreen}
          onDeleteScreen={onDeleteScreen}
          onAddStickyNote={(screenId) => {
            if (onAddAnnotation) {
              const targetScr = screens.find(s => s.id === screenId);
              const count = targetScr?.annotations?.length || 0;
              const newNote: ScreenAnnotation = {
                id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                screenId,
                type: 'sticky_note',
                number: count + 1,
                title: 'Developer Note',
                content: '',
                category: annotateCategory,
                color: annotateColor,
                author: 'Lead Architect',
                x: 24,
                y: 100 + (count % 4) * 35,
                width: 210,
                createdAt: new Date().toISOString(),
              };
              onAddAnnotation(screenId, newNote);
              setSelectedAnnotationId(newNote.id);
              showToast(`Added Sticky Note to ${targetScr?.title || 'screen'}`);
            }
          }}
          onAddPin={(screenId) => {
            if (onAddAnnotation) {
              const targetScr = screens.find(s => s.id === screenId);
              const count = targetScr?.annotations?.length || 0;
              const newPin: ScreenAnnotation = {
                id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                screenId,
                type: 'pin',
                number: count + 1,
                title: 'Context Pin',
                content: '',
                category: 'api_spec',
                color: 'violet',
                author: 'Lead Architect',
                x: 200,
                y: 120 + (count % 5) * 35,
                createdAt: new Date().toISOString(),
              };
              onAddAnnotation(screenId, newPin);
              setSelectedAnnotationId(newPin.id);
              showToast(`Added Annotation Pin to ${targetScr?.title || 'screen'}`);
            }
          }}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Wire Dragging Helper Top Banner */}
      {draftWire && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full border border-indigo-500/50 bg-slate-900/95 px-4 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-bounce ring-1 ring-white/10">
          <Zap className="h-4 w-4 text-indigo-400 fill-current animate-pulse" />
          <span>Click or drop onto any target screen to connect wire</span>
          <button
            onClick={() => {
              setDraftWire(null);
              setHoveredTargetScreenId(null);
            }}
            className="ml-2 rounded-full bg-slate-800 p-1 text-slate-400 hover:text-white"
            title="Cancel wire (or press Esc)"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-indigo-500/40 bg-slate-900/95 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 ring-1 ring-white/10">
          <Sparkles className="h-4 w-4 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AI Flow Architect Modal (< 2 min flow builder) */}
      <AIFlowBuilderModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onApplyFlow={handleFlowApplied}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
