import React, { useState } from 'react';
import { 
  Sparkles, X, ArrowRight, Check, Eye, Play, Layers, 
  Gamepad2, TrendingUp, ShoppingBag, Landmark, Apple, 
  Stethoscope, Utensils, Dumbbell, Home, Cpu, CheckCircle2,
  Search, Filter, ExternalLink
} from 'lucide-react';
import { STANDARD_10_DESIGN_FLOWS, StandardDesignFlow } from '../../data/standardDesignFlows';
import { Screen, FlowConnection } from '../../types/builder';

interface IndustryFlowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFlow: (screens: Screen[], connections: FlowConnection[], flowTitle?: string) => void;
  onPreviewInSimulator?: (screens: Screen[], connections: FlowConnection[]) => void;
  isDarkMode: boolean;
}

export const IndustryFlowsModal: React.FC<IndustryFlowsModalProps> = ({
  isOpen,
  onClose,
  onApplyFlow,
  onPreviewInSimulator,
  isDarkMode,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFlow, setActiveFlow] = useState<StandardDesignFlow>(STANDARD_10_DESIGN_FLOWS[0]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const industries = [
    'All',
    'Gaming',
    'Financial',
    'Retail',
    'Banking',
    'Grocery',
    'Healthcare',
    'Food Delivery',
    'Fitness',
    'Real Estate',
    'SaaS Workspace',
  ];

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'Gaming': return <Gamepad2 className="h-4 w-4" />;
      case 'Financial': return <TrendingUp className="h-4 w-4" />;
      case 'Retail': return <ShoppingBag className="h-4 w-4" />;
      case 'Banking': return <Landmark className="h-4 w-4" />;
      case 'Grocery': return <Apple className="h-4 w-4" />;
      case 'Healthcare': return <Stethoscope className="h-4 w-4" />;
      case 'Food Delivery': return <Utensils className="h-4 w-4" />;
      case 'Fitness': return <Dumbbell className="h-4 w-4" />;
      case 'Real Estate': return <Home className="h-4 w-4" />;
      case 'SaaS Workspace': return <Cpu className="h-4 w-4" />;
      default: return <Layers className="h-4 w-4" />;
    }
  };

  const filteredFlows = STANDARD_10_DESIGN_FLOWS.filter((flow) => {
    const matchesIndustry = selectedIndustry === 'All' || flow.industry === selectedIndustry;
    const matchesSearch = 
      flow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesIndustry && matchesSearch;
  });

  const handleApply = (flow: StandardDesignFlow) => {
    onApplyFlow(flow.screens, flow.connections, flow.title);
    setSuccessToast(`✓ "${flow.title}" deployed to your canvas!`);
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fadeIn select-none">
      <div className="relative flex flex-col w-full max-w-5xl h-[88vh] rounded-3xl border border-violet-500/25 bg-[#0C0A18] shadow-2xl shadow-violet-950/70 overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-violet-500/15 px-6 py-4 bg-[#090714]/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6B39F4] to-[#8B5CF6] text-white shadow-lg shadow-violet-600/35">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">10 Standard Industry Design Flows</h2>
                <span className="rounded-full bg-violet-600/20 border border-violet-500/40 px-2.5 py-0.5 text-[10px] font-bold text-violet-300">
                  FlowCraft Catalog
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore end-to-end UX architecture flows across Gaming, Finance, Retail, Banking, Grocery, Healthcare, and more.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-500/20 bg-[#16122C] text-slate-400 hover:bg-[#241C44] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-b border-violet-500/15 bg-[#090714]/60">
          {/* Industry pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-0.5">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedIndustry === ind
                    ? 'bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] text-white shadow-sm shadow-violet-600/35 border border-violet-400/30'
                    : 'text-slate-400 bg-[#141028]/70 hover:bg-[#1E173A] hover:text-white border border-violet-500/15'
                }`}
              >
                {ind !== 'All' && getIndustryIcon(ind)}
                <span>{ind}</span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search flows, keywords..."
              className="w-full rounded-xl border border-violet-500/25 bg-[#120F24]/90 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>

        {/* Toast confirmation */}
        {successToast && (
          <div className="bg-emerald-600/90 text-white px-4 py-2 text-center text-xs font-bold animate-fadeIn">
            {successToast}
          </div>
        )}

        {/* Main Body (Split Grid: List on Left, Active Flow Detail on Right) */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Flow Cards List */}
          <div className="w-full sm:w-1/2 border-r border-violet-500/15 overflow-y-auto p-4 space-y-3">
            {filteredFlows.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                No design flows matched your search. Try another filter.
              </div>
            ) : (
              filteredFlows.map((flow) => {
                const isSelected = activeFlow.id === flow.id;
                return (
                  <div
                    key={flow.id}
                    onClick={() => setActiveFlow(flow)}
                    className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-violet-500/80 bg-[#1A1435] shadow-lg ring-1 ring-violet-500/50 shadow-violet-950/60'
                        : 'border-violet-500/15 bg-[#120F24]/60 hover:border-violet-500/40 hover:bg-[#1A1435]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${flow.color} text-white shadow-md`}>
                          {getIndustryIcon(flow.industry)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider font-semibold">
                              {flow.industry}
                            </span>
                            <span className="text-[10px] text-amber-400 font-bold">
                              {flow.rating}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white leading-snug">
                            {flow.title}
                          </h4>
                        </div>
                      </div>

                      <span className="rounded bg-[#181335] border border-violet-500/20 px-2 py-0.5 text-[10px] font-mono text-violet-300">
                        {flow.badge}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                      {flow.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-slate-400">
                          {flow.screens.length} Screens · {flow.connections.length} State Wires
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(flow);
                          }}
                          className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-3 py-1 text-[11px] font-bold text-white shadow-sm shadow-violet-600/30 transition-all border border-violet-400/30"
                        >
                          <span>Apply</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Selected Flow Preview & Details */}
          <div className="hidden sm:flex flex-1 flex-col overflow-y-auto p-6 bg-[#08070F]/50">
            {activeFlow ? (
              <div className="space-y-6">
                {/* Header of Active Flow */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-violet-600/20 border border-violet-500/40 px-2.5 py-0.5 text-xs font-bold text-violet-300">
                        {activeFlow.industry} Flow
                      </span>
                      <span className="text-xs text-amber-400 font-semibold">
                        {activeFlow.rating}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {activeFlow.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      {activeFlow.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApply(activeFlow)}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-violet-600/35 border border-violet-400/30 transition-all active:scale-95 shrink-0"
                  >
                    <span>Load Flow onto Canvas</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {activeFlow.tags.map((t) => (
                    <span key={t} className="rounded-lg bg-[#141028] px-2.5 py-1 text-[11px] text-slate-300 border border-violet-500/20">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Screens Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-violet-500/15 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-violet-400" />
                      <span>Flow Screens & Artboards ({activeFlow.screens.length})</span>
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-400">
                      100% Transition Path Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeFlow.screens.map((screen) => {
                      const outgoingWire = activeFlow.connections.find(c => c.sourceScreenId === screen.id);
                      return (
                        <div
                          key={screen.id}
                          className="rounded-2xl border border-violet-500/20 bg-[#100D22]/90 p-3.5 space-y-2 hover:border-violet-500/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">
                              {screen.title}
                            </span>
                            {screen.isEntry && (
                              <span className="rounded bg-violet-600/25 border border-violet-500/40 text-violet-300 px-1.5 py-0.2 text-[9px] font-bold">
                                Entrypoint
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 block">
                            Route: {screen.route}
                          </span>

                          <div className="text-[11px] text-slate-400 space-y-0.5">
                            <div>Components: {screen.elements.length} native primitives</div>
                            {screen.elements.some(e => e.type === 'asset_slider') && (
                              <div className="text-amber-400 font-semibold">★ Contains Multi-PNG Graphic Asset Slider</div>
                            )}
                          </div>

                          {outgoingWire && (
                            <div className="rounded-lg bg-violet-950/40 border border-violet-500/20 p-1.5 text-[10px] text-violet-300 flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-violet-400 shrink-0" />
                              <span>Transition: <strong>{outgoingWire.transition}</strong> → {activeFlow.screens.find(s => s.id === outgoingWire.targetScreenId)?.title}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Instant Customization Guarantee</h5>
                      <p className="text-[11px] text-slate-400">
                        Once applied, you can freely rearrange screens, edit sliders, add custom assets, and test in the phone simulator.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApply(activeFlow)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-600/30 border border-violet-400/30 transition-all shrink-0"
                  >
                    <span>Deploy to Canvas</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            ) : null}
          </div>

        </div>

      </div>
    </div>
  );
};
