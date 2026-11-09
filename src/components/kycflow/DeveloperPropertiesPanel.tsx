import React, { useState } from 'react';
import { 
  Sliders, X, Shield, Clock, Code2, CheckCircle2, 
  Settings, Key, AlertTriangle, Layers, Sparkles, Database, Globe,
  Copy, Check, ChevronDown, ChevronRight, Smartphone, SlidersHorizontal,
  Share2, Compass, Bell, ShoppingCart, HelpCircle, User, WifiOff
} from 'lucide-react';
import { StudioNode } from './types';

interface DeveloperPropertiesPanelProps {
  selectedNode: StudioNode | null;
  onClose: () => void;
  onUpdateProperties: (nodeId: string, updatedProps: Partial<StudioNode['properties']>) => void;
  onDeleteNode: (nodeId: string) => void;
  onSwitchToSimulator?: () => void;
}

export const DeveloperPropertiesPanel: React.FC<DeveloperPropertiesPanelProps> = ({
  selectedNode,
  onClose,
  onUpdateProperties,
  onDeleteNode,
  onSwitchToSimulator,
}) => {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [openSections, setOpenSections] = useState({
    general: true,
    rules: true,
    schema: true,
  });

  if (!selectedNode) return null;

  const props = selectedNode.properties || {};

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const schemaPayload = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: `${selectedNode.name.replace(/[^a-zA-Z0-9]/g, '')}Config`,
    nodeId: selectedNode.id,
    type: selectedNode.type,
    category: selectedNode.category,
    properties: props,
    runtime: {
      estimatedSeconds: props.estimatedCompletionSeconds || 15,
      complianceStandard: 'ISO-30107-3 / SOC-2 / GDPR',
      environment: 'production',
    },
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(schemaPayload, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0D1117] border-l border-slate-800 text-slate-100 select-none text-xs">
      {/* Header - FlowCraft Pro Blue Branding */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#111827] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/30 shrink-0">
            <Sliders className="h-3.5 w-3.5" />
          </div>
          <div className="truncate">
            <h3 className="text-xs font-bold text-white tracking-tight truncate">{selectedNode.name}</h3>
            <span className="font-mono text-[10px] text-blue-400">{selectedNode.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onSwitchToSimulator && (
            <button
              onClick={onSwitchToSimulator}
              title="Preview on mobile device"
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:text-white hover:border-blue-500/50 hover:bg-slate-800 transition-colors"
            >
              <Smartphone className="h-3 w-3 text-blue-400" />
              <span>Preview</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Property Controls Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pr-3 scrollbar-thin">
        {/* Real-world duration budget badge */}
        <div className="rounded-xl border border-blue-500/30 bg-blue-600/10 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-blue-300">Target Time Budget</div>
              <div className="text-[9px] text-slate-400">Node impact on 2m flow limit</div>
            </div>
          </div>
          <div className="flex items-center gap-1 font-mono text-sm font-bold text-blue-400">
            <span>~{props.estimatedCompletionSeconds || 15}s</span>
          </div>
        </div>

        {/* Section 1: General & Timing */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#111827]">
          <button
            onClick={() => toggleSection('general')}
            className="w-full flex items-center justify-between p-2.5 bg-[#161F30] text-left hover:bg-[#1E293B] transition-colors"
          >
            <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
              <SlidersHorizontal className="h-3 w-3 text-blue-400" />
              Node Parameters &amp; Timing
            </span>
            {openSections.general ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
          </button>

          {openSections.general && (
            <div className="p-3 space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Estimated Step Duration ({props.estimatedCompletionSeconds || 15}s)
                </label>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={props.estimatedCompletionSeconds || 15}
                  onChange={(e) => onUpdateProperties(selectedNode.id, { estimatedCompletionSeconds: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                  <span>Instant (1s)</span>
                  <span>Friction Limit (60s)</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Execution Mode</label>
                <select
                  value={props.extractionMode || 'realtime'}
                  onChange={(e) => onUpdateProperties(selectedNode.id, { extractionMode: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-800 bg-[#0D1117] px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="realtime">Edge Execution (Synchronous Realtime)</option>
                  <option value="async">Asynchronous Background Queue</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Domain-Specific Verification & Functional Rules */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#111827]">
          <button
            onClick={() => toggleSection('rules')}
            className="w-full flex items-center justify-between p-2.5 bg-[#161F30] text-left hover:bg-[#1E293B] transition-colors"
          >
            <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-blue-400" />
              Category Specific Rules
            </span>
            {openSections.rules ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
          </button>

          {openSections.rules && (
            <div className="p-3 space-y-3">
              {/* 1. Discovery & Acquisition Controls */}
              {selectedNode.category === 'Discovery & Acquisition' && (
                <>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Campaign Channel Source</label>
                    <select
                      value={props.campaignSource || 'Meta / Instagram'}
                      onChange={(e) => onUpdateProperties(selectedNode.id, { campaignSource: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-800 bg-[#0D1117] px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Meta / Instagram">Meta / Instagram</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Organic / Referral">Organic / Referral</option>
                      <option value="TikTok">TikTok Campaign</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Attribution Window: {props.attributionWindowDays || 7} Days</label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={props.attributionWindowDays || 7}
                      onChange={(e) => onUpdateProperties(selectedNode.id, { attributionWindowDays: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </>
              )}

              {/* 2. Onboarding & Activation Controls */}
              {selectedNode.category === 'Onboarding & Activation' && (
                <>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Tour Carousel Slides</label>
                    <select
                      value={props.carouselSlidesCount || 3}
                      onChange={(e) => onUpdateProperties(selectedNode.id, { carouselSlidesCount: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-800 bg-[#0D1117] px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value={3}>3 Slides (Recommended)</option>
                      <option value={4}>4 Slides</option>
                      <option value={5}>5 Slides</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                    <div>
                      <div className="font-semibold text-slate-300">Allow User Skip</div>
                      <div className="text-[9px] text-slate-500">Provide Skip button during tour</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={props.skipEnabled ?? true}
                      onChange={(e) => onUpdateProperties(selectedNode.id, { skipEnabled: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-700 bg-[#0D1117] text-blue-600 focus:ring-0 cursor-pointer accent-blue-600"
                    />
                  </div>
                </>
              )}

              {/* 3. Core Engagement & Navigation Controls */}
              {selectedNode.category === 'Core Engagement & Navigation' && (
                <>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Navigation Pattern</label>
                    <select
                      value={props.navStyle || 'Bottom Tab Bar'}
                      onChange={(e) => onUpdateProperties(selectedNode.id, { navStyle: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-800 bg-[#0D1117] px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Bottom Tab Bar">Docked Bottom Tab Bar</option>
                      <option value="Drawer / Hamburger">Side Drawer Menu</option>
                      <option value="Floating Rail">Floating Island</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Active Navigation Tabs: {props.activeTabsCount || 4}</label>
                    <input
                      type="range"
                      min="3"
                      max="5"
                      value={props.activeTabsCount || 4}
                      onChange={(e) => onUpdateProperties(selectedNode.id, { activeTabsCount: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </>
              )}

              {/* 4. Retention & Re-engagement Controls */}
              {selectedNode.category === 'Retention & Re-engagement' && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Push Alert Cadence</label>
                  <select
                    value={props.pushCadence || 'Smart AI Optimized'}
                    onChange={(e) => onUpdateProperties(selectedNode.id, { pushCadence: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-800 bg-[#0D1117] px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Immediate">Immediate Real-time</option>
                    <option value="Daily Digest">Daily Summary Digest</option>
                    <option value="Smart AI Optimized">Smart AI Engagement Optimized</option>
                  </select>
                </div>
              )}

              {/* 5. Conversion & Transaction Controls */}
              {selectedNode.category === 'Conversion & Transaction' && (
                <>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Default Billing Cycle</label>
                    <select
                      value={props.pricingBillingCycle || 'Annual (20% Off)'}
                      onChange={(e) => onUpdateProperties(selectedNode.id, { pricingBillingCycle: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-800 bg-[#0D1117] px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Annual (20% Off)">Annual (20% Discount)</option>
                      <option value="Monthly">Monthly Recurring</option>
                      <option value="Lifetime">Lifetime Membership</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                    <div>
                      <div className="font-semibold text-slate-300">Biometric Pay (Apple/Google Pay)</div>
                      <div className="text-[9px] text-slate-500">Enable 1-touch FaceID payment</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={props.biometricPayAuth ?? true}
                      onChange={(e) => onUpdateProperties(selectedNode.id, { biometricPayAuth: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-700 bg-[#0D1117] text-blue-600 focus:ring-0 cursor-pointer accent-blue-600"
                    />
                  </div>
                </>
              )}

              {/* 6. Support & Feedback Controls */}
              {selectedNode.category === 'Support & Feedback' && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Live Chat Provider</label>
                  <select
                    value={props.liveChatProvider || 'AI Assistant'}
                    onChange={(e) => onUpdateProperties(selectedNode.id, { liveChatProvider: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-800 bg-[#0D1117] px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="AI Assistant">Autonomous AI Concierge</option>
                    <option value="Intercom">Intercom Live Chat</option>
                    <option value="Zendesk">Zendesk Enterprise</option>
                  </select>
                </div>
              )}

              {/* 7. Account Management Controls */}
              {selectedNode.category === 'Account Management & System' && (
                <>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">MFA Security Method</label>
                    <select
                      value={props.securityMfaMethod || 'TOTP Authenticator'}
                      onChange={(e) => onUpdateProperties(selectedNode.id, { securityMfaMethod: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-800 bg-[#0D1117] px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="TOTP Authenticator">Authenticator App (TOTP)</option>
                      <option value="Hardware Key">FIDO2 / YubiKey Hardware</option>
                      <option value="SMS">SMS Passcode</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Offline Cache Duration: {props.offlineCacheDurationHours || 24} Hours</label>
                    <input
                      type="range"
                      min="6"
                      max="72"
                      value={props.offlineCacheDurationHours || 24}
                      onChange={(e) => onUpdateProperties(selectedNode.id, { offlineCacheDurationHours: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </>
              )}

              {/* Existing KYC Node Specifics */}
              {selectedNode.name.includes('ID Scan') && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    OCR Confidence Threshold ({props.ocrConfidenceThreshold || 95}%)
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="99"
                    value={props.ocrConfidenceThreshold || 95}
                    onChange={(e) => onUpdateProperties(selectedNode.id, { ocrConfidenceThreshold: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}

              {selectedNode.name.includes('Liveness') && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    3D Depth Sensitivity ({((props.depthSensitivity ?? 0.85) * 100).toFixed(0)}%)
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.05"
                    value={props.depthSensitivity ?? 0.85}
                    onChange={(e) => onUpdateProperties(selectedNode.id, { depthSensitivity: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}

              {selectedNode.name.includes('Risk') && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    Risk Threshold ({props.riskThreshold || 15}/100)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={props.riskThreshold || 15}
                    onChange={(e) => onUpdateProperties(selectedNode.id, { riskThreshold: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Live Developer JSON Schema Contract */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#111827]">
          <button
            onClick={() => toggleSection('schema')}
            className="w-full flex items-center justify-between p-2.5 bg-[#161F30] text-left hover:bg-[#1E293B] transition-colors"
          >
            <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
              <Code2 className="h-3 w-3 text-blue-400" />
              Runtime JSON Schema Contract
            </span>
            {openSections.schema ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
          </button>

          {openSections.schema && (
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Frontend JSON Prop Definition</span>
                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  {copiedSchema ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedSchema ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#080B11] p-2.5 font-mono text-[9px] text-blue-300/90 max-h-48 overflow-auto leading-relaxed">
                <pre>{JSON.stringify(schemaPayload, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Remove Button */}
      <div className="border-t border-slate-800 bg-[#111827] p-3 shrink-0">
        <button
          onClick={() => onDeleteNode(selectedNode.id)}
          className="w-full rounded-xl border border-rose-500/40 bg-rose-500/10 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 active:scale-98 transition-all"
        >
          Delete Node from Pipeline
        </button>
      </div>
    </div>
  );
};
