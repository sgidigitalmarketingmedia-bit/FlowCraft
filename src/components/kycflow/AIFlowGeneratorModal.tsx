import React, { useState } from 'react';
import { 
  Sparkles, X, Check, Clock, AlertTriangle, ArrowRight, ShieldCheck, 
  Zap, Compass, ChevronRight, CheckCircle2, RotateCcw
} from 'lucide-react';
import { StudioNode, StudioCable } from './types';

interface AIFlowGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommitFlow: (nodes: StudioNode[], cables: StudioCable[]) => void;
}

export const AIFlowGeneratorModal: React.FC<AIFlowGeneratorModalProps> = ({
  isOpen,
  onClose,
  onCommitFlow,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // User selections
  const [answers, setAnswers] = useState({
    industry: 'fintech',
    speedTolerance: 'balanced',
    verificationLevel: 'standard_kyc',
    fraudRisk: 'moderate',
  });

  const [isApplyingOptimizations, setIsApplyingOptimizations] = useState(false);

  if (!isOpen) return null;

  // Calculate estimated completion time in seconds based on selections
  const calculateTotalSeconds = () => {
    let seconds = 0;
    // Industry baseline
    if (answers.industry === 'crypto') seconds += 20;
    if (answers.industry === 'enterprise') seconds += 45;
    if (answers.industry === 'marketplace') seconds += 10;
    if (answers.industry === 'fintech') seconds += 15;

    // Verification level
    if (answers.verificationLevel === 'fast_biometric') seconds += 35; // ID + Passive Liveness
    if (answers.verificationLevel === 'standard_kyc') seconds += 55; // ID + Liveness + Risk
    if (answers.verificationLevel === 'enhanced_edd') seconds += 110; // ID + Liveness + Address + Risk + PEP

    // Fraud risk checks
    if (answers.fraudRisk === 'high') seconds += 30; // Device + GeoIP
    if (answers.fraudRisk === 'moderate') seconds += 15;

    return seconds;
  };

  const totalEstimatedSeconds = calculateTotalSeconds();
  const exceedsTwoMinutes = totalEstimatedSeconds > 120;

  // AI speed optimizer
  const handleApplyAIOptimizations = () => {
    setIsApplyingOptimizations(true);
    setTimeout(() => {
      setAnswers(prev => ({
        ...prev,
        verificationLevel: 'standard_kyc',
        speedTolerance: 'lightning',
        fraudRisk: 'moderate',
      }));
      setIsApplyingOptimizations(false);
    }, 400);
  };

  const handleCommit = () => {
    // Generate intelligent pipeline based on selections
    const generatedNodes: StudioNode[] = [];
    const generatedCables: StudioCable[] = [];

    // Node 1: ID Scan
    generatedNodes.push({
      id: 'node_ai_1',
      type: 'id_scan_passport',
      name: 'ID Scan',
      category: 'Identity & OCR',
      x: 140,
      y: 180,
      status: 'completed',
      description: 'Automated government photo ID capture',
      properties: {
        ocrConfidenceThreshold: 94,
        extractionMode: 'realtime',
        barcodeParsing: true,
        estimatedCompletionSeconds: 22,
      },
    });

    // Node 2: 3D Liveness
    generatedNodes.push({
      id: 'node_ai_2',
      type: 'liveness_3d',
      name: 'Liveness',
      category: 'Biometrics',
      x: 400,
      y: 180,
      status: 'completed',
      description: 'Passive 3D biometric depth validation',
      properties: {
        livenessMode: 'passive',
        depthSensitivity: 0.88,
        antiSpoofModel: 'neural-depth-v3.4',
        estimatedCompletionSeconds: 14,
      },
    });

    generatedCables.push({
      id: 'cable_ai_1',
      fromNodeId: 'node_ai_1',
      toNodeId: 'node_ai_2',
    });

    // Node 3: Risk Score
    generatedNodes.push({
      id: 'node_ai_3',
      type: 'risk_score',
      name: 'Risk Score',
      category: 'Risk & Fraud',
      x: 660,
      y: 180,
      status: 'completed',
      description: 'Real-time ML fraud threshold check',
      properties: {
        riskThreshold: 14,
        fraudEngine: 'Internal ML',
        sanctionsCheck: true,
        estimatedCompletionSeconds: 4,
      },
    });

    generatedCables.push({
      id: 'cable_ai_2',
      fromNodeId: 'node_ai_2',
      toNodeId: 'node_ai_3',
    });

    // If enhanced or crypto, add Address Verification or AML
    if (answers.verificationLevel === 'enhanced_edd' || answers.industry === 'crypto') {
      generatedNodes.push({
        id: 'node_ai_4',
        type: 'address_registry',
        name: 'Address Verification',
        category: 'Compliance & AML',
        x: 400,
        y: 360,
        status: 'completed',
        description: 'Instant postal database registry match',
        properties: {
          addressValidityDays: 90,
          matchingRigor: 'strict',
          estimatedCompletionSeconds: 25,
        },
      });

      generatedCables.push({
        id: 'cable_ai_3',
        fromNodeId: 'node_ai_2',
        toNodeId: 'node_ai_4',
      });
    }

    onCommitFlow(generatedNodes, generatedCables);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-blue-500/50 bg-[#0D1117] shadow-2xl text-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#111827] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30">
              <Sparkles className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>AI Journey Flow Intelligence</span>
                <span className="rounded-full bg-blue-600/20 px-2 py-0.5 text-[10px] font-mono text-blue-300 border border-blue-500/30">
                  Real-time Optimizer
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Answer 4 quick questions to auto-generate an optimal KYC flow under the strict 2-minute threshold.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Real-world Time Budget Gauge Banner */}
        <div className={`px-6 py-3 border-b flex items-center justify-between transition-colors ${
          exceedsTwoMinutes
            ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${exceedsTwoMinutes ? 'text-rose-400' : 'text-emerald-400'}`} />
            <div>
              <span className="text-xs font-bold">
                {exceedsTwoMinutes 
                  ? 'Exceeds 2-Minute Maximum Real-World Target!' 
                  : 'Friction Target Verified (< 2 Minutes)'}
              </span>
              <p className="text-[10px] opacity-80">
                {exceedsTwoMinutes
                  ? `Estimated time: ${Math.floor(totalEstimatedSeconds / 60)}m ${totalEstimatedSeconds % 60}s. AI recommends trimming high-friction steps.`
                  : `Estimated time: ${Math.floor(totalEstimatedSeconds / 60)}m ${totalEstimatedSeconds % 60}s. High conversion guaranteed.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold tabular-nums">
              {Math.floor(totalEstimatedSeconds / 60)}m {totalEstimatedSeconds % 60}s
            </span>
            {exceedsTwoMinutes && (
              <button
                onClick={handleApplyAIOptimizations}
                disabled={isApplyingOptimizations}
                className="rounded-lg bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-slate-950 shadow hover:bg-amber-300"
              >
                {isApplyingOptimizations ? 'Optimizing...' : 'Apply AI Speed Fix'}
              </button>
            )}
          </div>
        </div>

        {/* Questions Carousel Body */}
        <div className="p-6 space-y-5 text-xs max-h-[60vh] overflow-y-auto">
          {/* Question 1: Industry */}
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">
              1. What is your industry & regulatory jurisdiction?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'fintech', title: 'FinTech / Neo-Banking', desc: 'Standard FinCEN / BaFin banking KYC' },
                { id: 'crypto', title: 'Crypto & Web3 Exchange', desc: 'FATF Travel rule & blockchain address check' },
                { id: 'marketplace', title: 'E-Commerce Marketplace', desc: 'High-speed frictionless seller onboarding' },
                { id: 'enterprise', title: 'High-Value Wealth Vault', desc: 'Enhanced Due Diligence & PEP check' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, industry: opt.id }))}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    answers.industry === opt.id
                      ? 'border-blue-500 bg-blue-600/15 text-white shadow-md ring-1 ring-blue-500/40'
                      : 'border-slate-800 bg-[#14171C] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{opt.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Verification Level */}
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">
              2. What depth of identity verification is required?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fast_biometric', title: 'Fast Biometric', desc: 'Gov ID + Passive 3D Liveness (~36s)' },
                { id: 'standard_kyc', title: 'Standard KYC', desc: 'ID + 3D Liveness + Real-Time Risk (~55s)' },
                { id: 'enhanced_edd', title: 'Enhanced EDD', desc: 'ID + Liveness + Address + PEP (~2m 15s)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, verificationLevel: opt.id }))}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    answers.verificationLevel === opt.id
                      ? 'border-blue-500 bg-blue-600/15 text-white shadow-md ring-1 ring-blue-500/40'
                      : 'border-slate-800 bg-[#14171C] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{opt.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Fraud Risk Environment */}
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">
              3. What is the expected fraud risk environment?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', title: 'Low Threat (Domestic)', desc: 'Standard velocity rules' },
                { id: 'moderate', title: 'Moderate Threat', desc: 'IP anomaly & device check' },
                { id: 'high', title: 'High Threat (Bot/Syndicate)', desc: 'Deep fraud graph & sanctions' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, fraudRisk: opt.id }))}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    answers.fraudRisk === opt.id
                      ? 'border-blue-500 bg-blue-600/15 text-white shadow-md ring-1 ring-blue-500/40'
                      : 'border-slate-800 bg-[#14171C] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{opt.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with One-Click Commit */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-[#111827] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] text-slate-300">
              Flow will auto-deploy to Journey Canvas &amp; Mobile Simulator.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleCommit}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            >
              <Sparkles className="h-4 w-4 fill-current" />
              <span>Commit &amp; Generate Journey Flow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
