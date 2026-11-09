import React from 'react';
import { 
  Zap, ArrowRight, Trash2, Copy, Play, Check, 
  Settings, X, Sparkles, Plus, Split, Shuffle,
  StickyNote, MapPin
} from 'lucide-react';
import { Screen, ElementProperties, FlowConnection, TransitionType, ActionTrigger } from '../../types/builder';

interface CanvasContextMenuProps {
  x: number;
  y: number;
  sourceScreen: Screen;
  sourceElement?: ElementProperties | null;
  screens: Screen[];
  connections: FlowConnection[];
  onConnectToScreen: (targetScreenId: string, trigger?: ActionTrigger, transition?: TransitionType) => void;
  onStartDragWire: () => void;
  onDisconnect: () => void;
  onDuplicateScreen: (screenId: string) => void;
  onDeleteScreen: (screenId: string) => void;
  onAddStickyNote?: (screenId: string) => void;
  onAddPin?: (screenId: string) => void;
  onClose: () => void;
}

export const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  x,
  y,
  sourceScreen,
  sourceElement,
  screens,
  connections,
  onConnectToScreen,
  onStartDragWire,
  onDisconnect,
  onDuplicateScreen,
  onDeleteScreen,
  onAddStickyNote,
  onAddPin,
  onClose,
}) => {
  const [showScreenList, setShowScreenList] = React.useState(true);
  const [selectedTransition, setSelectedTransition] = React.useState<TransitionType>('slide-left');
  const otherScreens = screens.filter((s) => s.id !== sourceScreen.id);

  // Check if this source element or screen already has an outgoing connection
  const activeConn = connections.find(
    (c) =>
      c.sourceScreenId === sourceScreen.id &&
      (!sourceElement || c.sourceElementId === sourceElement.id)
  );

  // Prevent menu from overflowing viewport
  const menuWidth = 260;
  const menuHeight = 360;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 20);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 20);

  return (
    <div
      style={{ top: `${adjustedY}px`, left: `${adjustedX}px` }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
      className="fixed z-50 w-64 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-2 text-xs text-slate-200 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 select-none ring-1 ring-white/10"
    >
      {/* Header with Source Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-2 pt-1 mb-1.5">
        <div className="flex items-center gap-1.5 truncate">
          <Zap className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <div className="truncate">
            <span className="font-bold text-white block text-[11px] truncate">
              {sourceElement ? sourceElement.name : sourceScreen.title}
            </span>
            <span className="text-[9px] text-slate-400 block truncate">
              {sourceElement ? `in ${sourceScreen.title}` : 'Screen Connector'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Transition Selector for new wire */}
      <div className="mb-2 px-1">
        <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">
          Transition Effect:
        </label>
        <div className="grid grid-cols-4 gap-1">
          {(['slide-left', 'slide-up', 'fade', 'pop'] as TransitionType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTransition(t)}
              className={`rounded-md py-1 text-[9px] font-bold capitalize transition-all border ${
                selectedTransition === t
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
            >
              {t.replace('slide-', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action 1: Connect Wire to Screen */}
      <div className="mb-2">
        <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>⚡ Connect Wire To:</span>
          <span className="text-indigo-400 text-[9px]">{otherScreens.length} Available</span>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {otherScreens.map((target) => {
            const isTarget = activeConn?.targetScreenId === target.id;
            return (
              <button
                key={target.id}
                onClick={() => {
                  onConnectToScreen(target.id, 'onClick', selectedTransition);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs font-semibold transition-all ${
                  isTarget
                    ? 'bg-pink-600/30 text-pink-300 border border-pink-500/40 ring-1 ring-pink-500/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-indigo-600 hover:text-white hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div
                    style={{ backgroundColor: target.backgroundColor || '#1e293b' }}
                    className="h-3 w-3 rounded-full border border-slate-600 shrink-0"
                  />
                  <span className="truncate">{target.title}</span>
                </div>
                {isTarget ? (
                  <Check className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                ) : (
                  <ArrowRight className="h-3 w-3 opacity-50 shrink-0" />
                )}
              </button>
            );
          })}

          {otherScreens.length === 0 && (
            <div className="py-2 text-center text-[10px] text-slate-500">
              No other screens available to connect.
            </div>
          )}
        </div>
      </div>

      {/* Interactive Mode: Click & Drag Wire */}
      <button
        onClick={() => {
          onStartDragWire();
          onClose();
        }}
        className="flex w-full items-center justify-between rounded-xl bg-indigo-600/30 border border-indigo-500/40 px-2.5 py-2 text-xs font-bold text-indigo-200 hover:bg-indigo-600 hover:text-white transition-all mb-1.5 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Draw Wire (Click or Drag to Screen)</span>
        </div>
        <ArrowRight className="h-3 w-3" />
      </button>

      {/* Quick Add Connector Port / Handle */}
      <button
        onClick={() => {
          onStartDragWire();
          onClose();
        }}
        className="flex w-full items-center gap-2 rounded-xl bg-slate-800/80 border border-slate-700/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all mb-1.5"
      >
        <Plus className="h-3.5 w-3.5 text-cyan-400" />
        <span>Add Connector Wire Point</span>
      </button>

      {/* Disconnect Wire if active */}
      {activeConn && (
        <button
          onClick={() => {
            onDisconnect();
            onClose();
          }}
          className="flex w-full items-center gap-2 rounded-xl bg-rose-500/15 border border-rose-500/30 px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-600 hover:text-white transition-all mb-1.5"
        >
          <Trash2 className="h-3.5 w-3.5 text-rose-400" />
          <span>Disconnect Active Wire</span>
        </button>
      )}

      {/* Developer Notes & Annotations */}
      {(onAddStickyNote || onAddPin) && (
        <div className="grid grid-cols-2 gap-1 mb-1.5 pt-1 border-t border-slate-800">
          {onAddStickyNote && (
            <button
              onClick={() => {
                onAddStickyNote(sourceScreen.id);
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 px-2 py-1.5 text-xs font-bold text-amber-200 hover:bg-amber-500/30 hover:text-white transition-all shadow-xs"
            >
              <StickyNote className="h-3.5 w-3.5 text-amber-300" />
              <span>+ Sticky Note</span>
            </button>
          )}
          {onAddPin && (
            <button
              onClick={() => {
                onAddPin(sourceScreen.id);
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-violet-500/15 border border-violet-500/30 px-2 py-1.5 text-xs font-bold text-violet-200 hover:bg-violet-500/30 hover:text-white transition-all shadow-xs"
            >
              <MapPin className="h-3.5 w-3.5 text-violet-300" />
              <span>+ Context Pin</span>
            </button>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="my-1.5 border-t border-slate-800" />

      {/* Screen Management Actions */}
      <div className="space-y-0.5">
        <button
          onClick={() => {
            onDuplicateScreen(sourceScreen.id);
            onClose();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Copy className="h-3.5 w-3.5 text-slate-400" />
          <span>Duplicate Screen</span>
        </button>

        <button
          onClick={() => {
            onDeleteScreen(sourceScreen.id);
            onClose();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1 text-rose-400 hover:bg-rose-500/20 hover:text-rose-200 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Screen</span>
        </button>
      </div>
    </div>
  );
};
