import React, { useState, useRef, useEffect } from 'react';
import { 
  StickyNote, MapPin, X, Trash2, ChevronDown, ChevronUp, 
  Move, Check, MessageSquareCode, Sparkles, User, Tag, 
  ExternalLink, Layers, Edit3, Plus, Eye, EyeOff
} from 'lucide-react';
import { ScreenAnnotation, AnnotationCategory, AnnotationColor, AnnotationType, ElementProperties } from '../../types/builder';

interface StickyNoteOverlayProps {
  screenId: string;
  annotations: ScreenAnnotation[];
  elements: ElementProperties[];
  scale: number;
  showAnnotations: boolean;
  selectedAnnotationId: string | null;
  onSelectAnnotation: (id: string | null) => void;
  onUpdateAnnotation: (screenId: string, annotationId: string, updates: Partial<ScreenAnnotation>) => void;
  onDeleteAnnotation: (screenId: string, annotationId: string) => void;
  onMoveAnnotation: (screenId: string, annotationId: string, x: number, y: number) => void;
}

const CATEGORY_META: Record<AnnotationCategory, { label: string; icon: string; bg: string; text: string; border: string }> = {
  api_spec: { label: 'API Spec', icon: '⚡', bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700/60' },
  dev_note: { label: 'Dev Note', icon: '📝', bg: 'bg-blue-100 dark:bg-blue-950/80', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700/60' },
  interaction: { label: 'Interaction', icon: '👆', bg: 'bg-purple-100 dark:bg-purple-950/80', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700/60' },
  business_logic: { label: 'Business Logic', icon: '⚙️', bg: 'bg-emerald-100 dark:bg-emerald-950/80', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700/60' },
  todo: { label: 'TODO', icon: '⏳', bg: 'bg-rose-100 dark:bg-rose-950/80', text: 'text-rose-800 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-700/60' },
};

const COLOR_STYLES: Record<AnnotationColor, {
  cardBg: string;
  border: string;
  accent: string;
  shadow: string;
  text: string;
  tape: string;
  dot: string;
}> = {
  yellow: {
    cardBg: 'bg-[#FEF9C3] dark:bg-[#2A240A]',
    border: 'border-yellow-400 dark:border-yellow-500/70',
    accent: 'text-yellow-900 dark:text-yellow-200',
    shadow: 'shadow-yellow-950/20 shadow-lg',
    text: 'text-slate-900 dark:text-yellow-100',
    tape: 'bg-yellow-300/80 dark:bg-yellow-500/50',
    dot: 'bg-yellow-400',
  },
  violet: {
    cardBg: 'bg-[#EDE9FE] dark:bg-[#1E1438]',
    border: 'border-violet-400 dark:border-violet-500/70',
    accent: 'text-violet-900 dark:text-violet-200',
    shadow: 'shadow-violet-950/25 shadow-lg',
    text: 'text-slate-900 dark:text-violet-100',
    tape: 'bg-violet-300/80 dark:bg-violet-500/50',
    dot: 'bg-violet-400',
  },
  emerald: {
    cardBg: 'bg-[#D1FAE5] dark:bg-[#0E2A1E]',
    border: 'border-emerald-400 dark:border-emerald-500/70',
    accent: 'text-emerald-900 dark:text-emerald-200',
    shadow: 'shadow-emerald-950/20 shadow-lg',
    text: 'text-slate-900 dark:text-emerald-100',
    tape: 'bg-emerald-300/80 dark:bg-emerald-500/50',
    dot: 'bg-emerald-400',
  },
  amber: {
    cardBg: 'bg-[#FFEDD5] dark:bg-[#2E1A0A]',
    border: 'border-amber-400 dark:border-amber-500/70',
    accent: 'text-amber-900 dark:text-amber-200',
    shadow: 'shadow-amber-950/20 shadow-lg',
    text: 'text-slate-900 dark:text-amber-100',
    tape: 'bg-amber-300/80 dark:bg-amber-500/50',
    dot: 'bg-amber-400',
  },
  rose: {
    cardBg: 'bg-[#FFE4E6] dark:bg-[#2E1018]',
    border: 'border-rose-400 dark:border-rose-500/70',
    accent: 'text-rose-900 dark:text-rose-200',
    shadow: 'shadow-rose-950/20 shadow-lg',
    text: 'text-slate-900 dark:text-rose-100',
    tape: 'bg-rose-300/80 dark:bg-rose-500/50',
    dot: 'bg-rose-400',
  },
  blue: {
    cardBg: 'bg-[#E0F2FE] dark:bg-[#0C2238]',
    border: 'border-sky-400 dark:border-sky-500/70',
    accent: 'text-sky-900 dark:text-sky-200',
    shadow: 'shadow-sky-950/20 shadow-lg',
    text: 'text-slate-900 dark:text-sky-100',
    tape: 'bg-sky-300/80 dark:bg-sky-500/50',
    dot: 'bg-sky-400',
  },
  slate: {
    cardBg: 'bg-[#F1F5F9] dark:bg-[#1A202C]',
    border: 'border-slate-400 dark:border-slate-600',
    accent: 'text-slate-900 dark:text-slate-200',
    shadow: 'shadow-slate-950/20 shadow-lg',
    text: 'text-slate-900 dark:text-slate-100',
    tape: 'bg-slate-300/80 dark:bg-slate-600/50',
    dot: 'bg-slate-400',
  },
};

export const StickyNoteOverlay: React.FC<StickyNoteOverlayProps> = ({
  screenId,
  annotations,
  elements,
  scale,
  showAnnotations,
  selectedAnnotationId,
  onSelectAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  onMoveAnnotation,
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openPinPopoverId, setOpenPinPopoverId] = useState<string | null>(null);

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!draggingId) return;
      const targetAnnotation = annotations.find(a => a.id === draggingId);
      if (!targetAnnotation) return;

      const newX = Math.round((e.clientX - dragOffset.x) / scale);
      const newY = Math.round((e.clientY - dragOffset.y) / scale);

      onMoveAnnotation(screenId, draggingId, Math.max(-100, Math.min(380, newX)), Math.max(-40, Math.min(740, newY)));
    };

    const handleWindowMouseUp = () => {
      if (draggingId) {
        setDraggingId(null);
      }
    };

    if (draggingId) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [draggingId, dragOffset, scale, annotations, onMoveAnnotation, screenId]);

  if (!showAnnotations || annotations.length === 0) {
    return null;
  }

  const handleStartDrag = (e: React.MouseEvent, ann: ScreenAnnotation) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggingId(ann.id);
    onSelectAnnotation(ann.id);
    setDragOffset({
      x: e.clientX - ann.x * scale,
      y: e.clientY - ann.y * scale,
    });
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-visible">
      {annotations.map((ann, idx) => {
        const isSelected = selectedAnnotationId === ann.id;
        const isDragging = draggingId === ann.id;
        const styleTheme = COLOR_STYLES[ann.color] || COLOR_STYLES.yellow;
        const categoryMeta = CATEGORY_META[ann.category] || CATEGORY_META.dev_note;
        const attachedElement = elements.find(el => el.id === ann.pinnedElementId);

        // -------------------------------------------------------------
        // RENDER: ANNOTATION PIN
        // -------------------------------------------------------------
        if (ann.type === 'pin') {
          const isPopoverOpen = openPinPopoverId === ann.id || isSelected;

          return (
            <div
              key={ann.id}
              style={{
                left: `${ann.x}px`,
                top: `${ann.y}px`,
              }}
              className="absolute pointer-events-auto select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pin Pulsing Marker */}
              <div
                onMouseDown={(e) => handleStartDrag(e, ann)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAnnotation(ann.id);
                  setOpenPinPopoverId(openPinPopoverId === ann.id ? null : ann.id);
                }}
                className={`group relative flex h-7 w-7 items-center justify-center rounded-full border-2 cursor-grab active:cursor-grabbing transition-transform ${
                  isSelected ? 'scale-110 ring-4 ring-violet-500/40 z-50' : 'hover:scale-105 z-30'
                } ${styleTheme.border} ${styleTheme.cardBg} ${styleTheme.shadow}`}
                title={`Pin #${ann.number || idx + 1}: ${ann.title || ann.content}`}
              >
                {/* Pin Sequence / Number */}
                <span className={`text-[10.5px] font-mono font-black ${styleTheme.accent}`}>
                  {ann.number || idx + 1}
                </span>

                {/* Subtle Pulse Animation */}
                <span className={`absolute -inset-1 rounded-full opacity-30 animate-ping pointer-events-none ${styleTheme.dot}`}></span>

                {/* Floating Tooltip Label (when collapsed) */}
                {!isPopoverOpen && (
                  <div className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-950/90 px-2 py-1 text-[10px] font-semibold text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700/80 shadow-md">
                    <span className="mr-1">{categoryMeta.icon}</span>
                    <strong className="text-white">{ann.title || 'Context Pin'}</strong>
                    {attachedElement && <span className="text-slate-400 text-[9px] ml-1">→ {attachedElement.name}</span>}
                  </div>
                )}
              </div>

              {/* Pin Context Popover Card */}
              {isPopoverOpen && (
                <div
                  className={`absolute left-8 -top-3 w-64 rounded-2xl border p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${styleTheme.cardBg} ${styleTheme.border} ${styleTheme.shadow}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Popover Header */}
                  <div className="flex items-center justify-between gap-1 pb-2 border-b border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-mono font-bold ${styleTheme.dot} text-black font-bold`}>
                        {ann.number || idx + 1}
                      </span>
                      <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${categoryMeta.bg} ${categoryMeta.text} ${categoryMeta.border}`}>
                        {categoryMeta.icon} {categoryMeta.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onDeleteAnnotation(screenId, ann.id)}
                        className="rounded-md p-1 text-slate-500 hover:bg-black/10 dark:hover:bg-white/10 hover:text-red-600 transition-colors"
                        title="Delete Pin"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setOpenPinPopoverId(null)}
                        className="rounded-md p-1 text-slate-500 hover:bg-black/10 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="Close popover"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <input
                    type="text"
                    value={ann.title || ''}
                    placeholder="Pin title or instruction..."
                    onChange={(e) => onUpdateAnnotation(screenId, ann.id, { title: e.target.value })}
                    className={`mt-2 w-full bg-transparent text-xs font-bold ${styleTheme.text} placeholder:text-slate-400 focus:outline-none`}
                  />

                  {/* Body Content */}
                  <textarea
                    rows={3}
                    value={ann.content}
                    placeholder="Enter developer context, API payload, or interaction notes..."
                    onChange={(e) => onUpdateAnnotation(screenId, ann.id, { content: e.target.value })}
                    className={`mt-1.5 w-full resize-none rounded-lg bg-black/5 dark:bg-black/30 p-2 text-xs leading-relaxed ${styleTheme.text} placeholder:text-slate-400 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-violet-500`}
                  />

                  {/* Target Component Selector */}
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      Target:
                    </span>
                    <select
                      value={ann.pinnedElementId || ''}
                      onChange={(e) => onUpdateAnnotation(screenId, ann.id, { pinnedElementId: e.target.value || undefined })}
                      className="rounded bg-black/5 dark:bg-black/40 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-black/10 dark:border-white/10 max-w-[140px] truncate"
                    >
                      <option value="">Whole Screen</option>
                      {elements.map(el => (
                        <option key={el.id} value={el.id}>
                          {el.name} ({el.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category & Color Pickers */}
                  <div className="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-1">
                    <select
                      value={ann.category}
                      onChange={(e) => onUpdateAnnotation(screenId, ann.id, { category: e.target.value as AnnotationCategory })}
                      className="rounded bg-black/5 dark:bg-black/40 px-1 py-0.5 text-[9.5px] font-bold text-slate-700 dark:text-slate-300 border border-black/10 dark:border-white/10"
                    >
                      <option value="api_spec">⚡ API Spec</option>
                      <option value="dev_note">📝 Dev Note</option>
                      <option value="interaction">👆 Interaction</option>
                      <option value="business_logic">⚙️ Logic</option>
                      <option value="todo">⏳ TODO</option>
                    </select>

                    <div className="flex items-center gap-1">
                      {(['yellow', 'violet', 'emerald', 'amber', 'rose', 'blue'] as AnnotationColor[]).map(c => (
                        <button
                          key={c}
                          onClick={() => onUpdateAnnotation(screenId, ann.id, { color: c })}
                          className={`h-3 w-3 rounded-full transition-transform ${COLOR_STYLES[c].dot} ${ann.color === c ? 'scale-125 ring-1 ring-black dark:ring-white' : 'opacity-70 hover:opacity-100'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        // -------------------------------------------------------------
        // RENDER: STICKY NOTE CARD
        // -------------------------------------------------------------
        const isCollapsed = ann.isCollapsed;

        return (
          <div
            key={ann.id}
            style={{
              left: `${ann.x}px`,
              top: `${ann.y}px`,
              width: isCollapsed ? '160px' : `${ann.width || 210}px`,
            }}
            className={`absolute pointer-events-auto rounded-2xl border p-2.5 select-none transition-shadow ${
              isSelected ? 'ring-2 ring-violet-500 shadow-2xl z-50' : 'z-30 hover:shadow-xl'
            } ${styleTheme.cardBg} ${styleTheme.border} ${styleTheme.shadow}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectAnnotation(ann.id);
            }}
          >
            {/* Top Tape Strip Accent / Drag Handle */}
            <div
              onMouseDown={(e) => handleStartDrag(e, ann)}
              className="group -mt-4 mb-1.5 mx-auto flex h-3.5 w-16 items-center justify-center rounded-md cursor-grab active:cursor-grabbing shadow-xs transition-colors"
            >
              <div className={`h-2.5 w-14 rounded-sm ${styleTheme.tape} border border-black/10 dark:border-white/10 flex items-center justify-center`}>
                <div className="h-0.5 w-6 bg-black/20 dark:bg-white/20 rounded-full"></div>
              </div>
            </div>

            {/* Note Header Bar */}
            <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-black/10 dark:border-white/10">
              {/* Category Pill */}
              <div className="flex items-center gap-1 min-w-0">
                <span className={`rounded-md border px-1.5 py-0.5 text-[8.5px] font-bold tracking-tight truncate ${categoryMeta.bg} ${categoryMeta.text} ${categoryMeta.border}`}>
                  {categoryMeta.icon} {categoryMeta.label}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateAnnotation(screenId, ann.id, { isCollapsed: !isCollapsed });
                  }}
                  className="rounded p-0.5 text-slate-500 hover:bg-black/10 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white transition-colors"
                  title={isCollapsed ? "Expand note" : "Collapse note"}
                >
                  {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAnnotation(screenId, ann.id);
                  }}
                  className="rounded p-0.5 text-slate-500 hover:bg-black/10 dark:hover:bg-white/10 hover:text-red-600 transition-colors"
                  title="Delete Sticky Note"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Note Title */}
            <div className="mt-1.5">
              <input
                type="text"
                value={ann.title || ''}
                placeholder="Note Title..."
                onChange={(e) => onUpdateAnnotation(screenId, ann.id, { title: e.target.value })}
                className={`w-full bg-transparent text-xs font-bold leading-tight ${styleTheme.text} placeholder:text-slate-400 focus:outline-none`}
              />
            </div>

            {/* Note Body (when expanded) */}
            {!isCollapsed && (
              <>
                <textarea
                  rows={3}
                  value={ann.content}
                  placeholder="Type developer instructions, API contracts, state requirements..."
                  onChange={(e) => onUpdateAnnotation(screenId, ann.id, { content: e.target.value })}
                  className={`mt-1.5 w-full resize-none rounded-lg bg-black/5 dark:bg-black/25 p-2 text-[11px] leading-relaxed ${styleTheme.text} placeholder:text-slate-400 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-violet-500 font-sans`}
                />

                {/* Pinned Component & Author Footer */}
                <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 truncate max-w-[110px]" title={attachedElement ? attachedElement.name : 'Unpinned'}>
                    <Layers className="h-2.5 w-2.5 shrink-0" />
                    {attachedElement ? attachedElement.name : 'Whole Screen'}
                  </span>

                  <span className="text-[8.5px] font-mono opacity-80">
                    {ann.author ? ann.author.split(' ')[0] : 'Architect'}
                  </span>
                </div>

                {/* Color Swatches & Category Quick Cycle */}
                <div className="mt-2 pt-1.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                  {/* Category selector */}
                  <select
                    value={ann.category}
                    onChange={(e) => onUpdateAnnotation(screenId, ann.id, { category: e.target.value as AnnotationCategory })}
                    className="rounded bg-black/5 dark:bg-black/35 px-1 py-0.5 text-[8.5px] font-bold text-slate-700 dark:text-slate-300 border border-black/10 dark:border-white/10"
                  >
                    <option value="api_spec">⚡ API Spec</option>
                    <option value="dev_note">📝 Dev Note</option>
                    <option value="interaction">👆 Interaction</option>
                    <option value="business_logic">⚙️ Logic</option>
                    <option value="todo">⏳ TODO</option>
                  </select>

                  {/* Colors */}
                  <div className="flex items-center gap-1">
                    {(['yellow', 'violet', 'emerald', 'amber', 'rose', 'blue'] as AnnotationColor[]).map(c => (
                      <button
                        key={c}
                        onClick={() => onUpdateAnnotation(screenId, ann.id, { color: c })}
                        className={`h-2.5 w-2.5 rounded-full transition-transform ${COLOR_STYLES[c].dot} ${ann.color === c ? 'scale-125 ring-1 ring-black dark:ring-white' : 'opacity-60 hover:opacity-100'}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
