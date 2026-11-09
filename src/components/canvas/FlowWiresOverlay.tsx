import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Screen, FlowConnection } from '../../types/builder';

export interface DraftWireData {
  sourceScreenId: string;
  sourceElementId?: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface FlowWiresOverlayProps {
  screens: Screen[];
  connections: FlowConnection[];
  selectedElementId: string | null;
  onSelectConnection?: (conn: FlowConnection) => void;
  onDeleteConnection?: (connId: string) => void;
  draftWire?: DraftWireData | null;
  scale: number;
}

export const FlowWiresOverlay: React.FC<FlowWiresOverlayProps> = ({
  screens,
  connections,
  selectedElementId,
  onSelectConnection,
  onDeleteConnection,
  draftWire,
}) => {
  const getScreenById = (id: string) => screens.find(s => s.id === id);

  // Helper to find vertical center of an element inside its screen
  const getElementVerticalOffset = (screen: Screen, elementId: string) => {
    let top = 48; // header height of screen card
    for (const el of screen.elements) {
      if (el.id === elementId) {
        return top + 24; // approximate center of element
      }
      top += 58; // rough element item height + gap
    }
    return screen.height / 2;
  };

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible z-20">
      <defs>
        {/* Glowing gradients for journey wires */}
        <linearGradient id="flowGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        <linearGradient id="flowGradientNormal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
        </linearGradient>

        {/* Arrow markers */}
        <marker
          id="flowArrowActive"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#EC4899" />
        </marker>

        <marker
          id="flowArrowNormal"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#8B5CF6" />
        </marker>
      </defs>

      {connections.map((conn) => {
        const sourceScreen = getScreenById(conn.sourceScreenId);
        const targetScreen = getScreenById(conn.targetScreenId);

        if (!sourceScreen || !targetScreen) return null;

        const elOffsetY = getElementVerticalOffset(sourceScreen, conn.sourceElementId);
        const startX = sourceScreen.x + sourceScreen.width;
        const startY = sourceScreen.y + elOffsetY;

        // Target screen left edge, center port
        const endX = targetScreen.x;
        const endY = targetScreen.y + targetScreen.height / 2;

        const isSelected = conn.sourceElementId === selectedElementId;

        // Compute smooth cubic bezier control points
        const deltaX = Math.abs(endX - startX);
        const controlOffsetX = Math.max(deltaX * 0.5, 60);

        let cp1X = startX + controlOffsetX;
        let cp1Y = startY;
        let cp2X = endX - controlOffsetX;
        let cp2Y = endY;

        // If target is to the left of source (e.g. Back button or looping flow), loop curve gracefully
        if (endX < startX) {
          cp1X = startX + 120;
          cp1Y = startY + 80;
          cp2X = endX - 120;
          cp2Y = endY + 80;
        }

        const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        return (
          <g key={conn.id} className="group pointer-events-auto cursor-pointer">
            {/* Wider transparent hit area */}
            <path
              d={pathData}
              fill="none"
              stroke="transparent"
              strokeWidth="18"
              onClick={() => onSelectConnection?.(conn)}
            />

            {/* Background halo when active */}
            {isSelected && (
              <path
                d={pathData}
                fill="none"
                stroke="#EC4899"
                strokeWidth="6"
                strokeOpacity="0.4"
                className="animate-pulse"
              />
            )}

            {/* Visible Bezier Path */}
            <path
              d={pathData}
              fill="none"
              stroke={isSelected ? 'url(#flowGradientActive)' : 'url(#flowGradientNormal)'}
              strokeWidth={isSelected ? '3' : '2'}
              strokeDasharray={isSelected ? '6 3' : 'none'}
              markerEnd={isSelected ? 'url(#flowArrowActive)' : 'url(#flowArrowNormal)'}
              className={`transition-all duration-200 ${isSelected ? 'stroke-pink-500' : 'group-hover:stroke-indigo-400'}`}
              onClick={() => onSelectConnection?.(conn)}
            />

            {/* Connection start connector node */}
            <circle
              cx={startX}
              cy={startY}
              r={isSelected ? 5 : 4}
              fill={isSelected ? '#EC4899' : '#8B5CF6'}
              stroke="#0F172A"
              strokeWidth="2"
            />

            {/* Midpoint Action Badge Label */}
            <foreignObject
              x={midX - 55}
              y={midY - 12}
              width="110"
              height="26"
              className="overflow-visible pointer-events-auto"
            >
              <div
                onClick={() => onSelectConnection?.(conn)}
                className={`flex items-center justify-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold shadow-md transition-all ${
                  isSelected
                    ? 'bg-pink-600 text-white ring-2 ring-pink-400 scale-105'
                    : 'bg-slate-900/90 border border-indigo-500/60 text-indigo-200 group-hover:scale-105 backdrop-blur-sm'
                }`}
              >
                <span>{conn.trigger}</span>
                <span className="opacity-60">→</span>
                <span>{conn.transition}</span>
                {isSelected && onDeleteConnection && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConnection(conn.id);
                    }}
                    title="Disconnect wire"
                    className="ml-1 text-white hover:text-rose-200 p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* Dynamic Draft Wire being dragged live */}
      {draftWire && (() => {
        const startX = draftWire.startX;
        const startY = draftWire.startY;
        const endX = draftWire.currentX;
        const endY = draftWire.currentY;

        const deltaX = Math.abs(endX - startX);
        const controlOffsetX = Math.max(deltaX * 0.5, 60);

        let cp1X = startX + controlOffsetX;
        let cp1Y = startY;
        let cp2X = endX - controlOffsetX;
        let cp2Y = endY;

        if (endX < startX) {
          cp1X = startX + 100;
          cp1Y = startY + 60;
          cp2X = endX - 100;
          cp2Y = endY + 60;
        }

        const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

        return (
          <g className="pointer-events-none">
            <path
              d={pathData}
              fill="none"
              stroke="#EC4899"
              strokeWidth="6"
              strokeOpacity="0.4"
              className="animate-pulse"
            />
            <path
              d={pathData}
              fill="none"
              stroke="url(#flowGradientActive)"
              strokeWidth="3"
              strokeDasharray="6 4"
              markerEnd="url(#flowArrowActive)"
            />
            <circle cx={startX} cy={startY} r="6" fill="#EC4899" stroke="#FFF" strokeWidth="2" />
            <circle cx={endX} cy={endY} r="5" fill="#38BDF8" stroke="#FFF" strokeWidth="2" />
          </g>
        );
      })()}
    </svg>
  );
};
