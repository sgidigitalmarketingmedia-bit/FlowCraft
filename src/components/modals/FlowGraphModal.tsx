import React from 'react';
import { 
  GitFork, ArrowRight, Play, CheckCircle2, ShieldCheck, 
  ExternalLink, Layers, Sparkles, AlertCircle 
} from 'lucide-react';
import { Screen, FlowConnection } from '../../types/builder';

interface FlowGraphModalProps {
  screens: Screen[];
  connections: FlowConnection[];
  onSelectScreen: (screenId: string) => void;
  onOpenSimulatorWithScreen: (screenId: string) => void;
}

export const FlowGraphModal: React.FC<FlowGraphModalProps> = ({
  screens,
  connections,
  onSelectScreen,
  onOpenSimulatorWithScreen,
}) => {
  const getScreen = (id: string) => screens.find(s => s.id === id);

  return (
    <div className="flex h-full w-full flex-col bg-slate-950 p-6 overflow-y-auto text-slate-100 select-none">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="h-5 w-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Journey Flow Interaction State Machine
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Interactive map of all decision points, navigation events, and animated transitions across the prototype.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
            <span>{connections.length} Active Journey Connections</span>
          </span>
        </div>
      </div>

      {/* Screen Journey Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {screens.map((screen, idx) => {
          const outgoing = connections.filter(c => c.sourceScreenId === screen.id);
          const incoming = connections.filter(c => c.targetScreenId === screen.id);

          return (
            <div
              key={`graph_screen_${screen.id}_${idx}`}
              className={`rounded-2xl border bg-slate-900/80 p-5 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:shadow-xl ${
                screen.isEntry
                  ? 'border-emerald-500/50 ring-1 ring-emerald-500/30'
                  : 'border-slate-800'
              }`}
            >
              {/* Card Title */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      Step {idx + 1}
                    </span>
                    {screen.isEntry && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                        START ENTRY
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                    {screen.title}
                  </h3>
                  <span className="font-mono text-[11px] text-slate-400">{screen.route}</span>
                </div>

                <button
                  onClick={() => onOpenSimulatorWithScreen(screen.id)}
                  title="Simulate starting at this screen"
                  className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                </button>
              </div>

              {/* Elements summary */}
              <div className="mb-4 text-xs text-slate-400">
                <span>{screen.elements.length} components configured</span>
                <span className="mx-1.5">·</span>
                <span className="capitalize">{screen.statusBarColor} status bar</span>
              </div>

              {/* Outgoing Transitions */}
              <div className="border-t border-slate-800/80 pt-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Outgoing Journey Paths ({outgoing.length})
                </span>

                {outgoing.length === 0 ? (
                  <div className="flex items-center gap-1.5 text-xs text-amber-400/80 py-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Terminal screen (no outgoing transition)</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {outgoing.map((conn) => {
                      const target = getScreen(conn.targetScreenId);
                      const el = screen.elements.find(e => e.id === conn.sourceElementId);

                      return (
                        <div
                          key={`graph_conn_${conn.id}_${screen.id}_${conn.sourceElementId}`}
                          className="flex items-center justify-between rounded-xl bg-slate-800/50 border border-slate-800 p-2 text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <ArrowRight className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                            <div className="truncate">
                              <span className="font-semibold text-slate-200">
                                {el?.name || 'Action'}
                              </span>
                              <span className="ml-1 text-[10px] text-slate-500">
                                ({conn.trigger})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-mono text-indigo-300">
                              {conn.transition}
                            </span>
                            <span className="font-semibold text-slate-300 truncate max-w-[90px]">
                              → {target?.title.split('.')[1] || target?.title}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
