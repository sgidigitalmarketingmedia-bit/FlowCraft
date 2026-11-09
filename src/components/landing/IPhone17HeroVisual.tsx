import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, CheckCircle2, ArrowRight, Fingerprint, Lock, 
  Send, DollarSign, TrendingUp, RefreshCw, Zap, Shield, FileCheck, ScanLine
} from 'lucide-react';

interface IPhone17HeroVisualProps {
  onSelectScreen?: (screenIndex: number) => void;
  activeScreenIndex?: number;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

export const IPhone17HeroVisual: React.FC<IPhone17HeroVisualProps> = ({
  onSelectScreen,
  activeScreenIndex: controlledIndex,
  isPlaying: controlledIsPlaying,
  onTogglePlay,
}) => {
  const [internalScreenIndex, setInternalScreenIndex] = useState<number>(0);
  const [internalIsPlaying, setInternalIsPlaying] = useState<boolean>(true);
  const [scanProgress, setScanProgress] = useState<number>(20);
  const [tapEffect, setTapEffect] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });

  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : internalIsPlaying;

  const screens = [
    {
      id: 'onboarding',
      name: '01. Welcome',
      shortName: 'Welcome',
      tagline: 'Frictionless User Entry',
      accentColor: 'from-violet-600 to-indigo-600',
      badgeColor: 'text-violet-300 bg-violet-600/15 border-violet-500/30',
    },
    {
      id: 'biometric',
      name: '02. FaceID',
      shortName: 'FaceID',
      tagline: 'Secure Enclave Auth',
      accentColor: 'from-emerald-500 to-teal-600',
      badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    },
    {
      id: 'kyc',
      name: '03. KYC',
      shortName: 'KYC Gate',
      tagline: 'AML & Liveness Match',
      accentColor: 'from-amber-500 to-orange-600',
      badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    },
    {
      id: 'dashboard',
      name: '04. Wallet',
      shortName: 'Portfolio',
      tagline: 'Multi-Currency Flow',
      accentColor: 'from-indigo-500 to-violet-600',
      badgeColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
    },
    {
      id: 'transfer',
      name: '05. Wire',
      shortName: 'Settled',
      tagline: 'Instant Settlement',
      accentColor: 'from-violet-600 to-fuchsia-600',
      badgeColor: 'text-violet-400 bg-violet-500/15 border-violet-500/30',
    },
  ];

  const rawIndex = controlledIndex !== undefined ? controlledIndex : internalScreenIndex;
  const activeIndex = ((rawIndex % screens.length) + screens.length) % screens.length;

  // Auto-cycle internally ONLY if not controlled by parent component
  useEffect(() => {
    if (controlledIndex !== undefined) return;
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setInternalScreenIndex((prev) => (prev + 1) % screens.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [controlledIndex, isPlaying, screens.length]);

  // Biometric screen scan progress animation
  useEffect(() => {
    if (activeIndex !== 1 && activeIndex !== 2) {
      setScanProgress(20);
      return;
    }
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 100 : prev + 8));
    }, 180);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTapEffect({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true,
    });
    setTimeout(() => {
      setTapEffect((prev) => ({ ...prev, show: false }));
    }, 500);

    const next = (activeIndex + 1) % screens.length;
    if (controlledIndex === undefined) {
      setInternalScreenIndex(next);
    }
    if (onSelectScreen) {
      onSelectScreen(next);
    }
  };

  const handleSelectTab = (idx: number) => {
    if (controlledIndex === undefined) {
      setInternalScreenIndex(idx);
      setInternalIsPlaying(false);
    }
    if (onSelectScreen) {
      onSelectScreen(idx);
    }
  };

  const handleTogglePlayback = () => {
    if (onTogglePlay) {
      onTogglePlay();
    } else {
      setInternalIsPlaying(!internalIsPlaying);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* OneSeven Ambient Glow behind floating device */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#6B39F4]/25 via-indigo-600/20 to-purple-600/25 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

      {/* Floating 3D Device Container */}
      <div className="relative animate-float-phone transition-transform duration-700 ease-out">
        {/* 3D Physical iPhone 17 Frame with OneSeven Titanium & Obsidian finish */}
        <div 
          onClick={handleScreenClick}
          className="relative w-[265px] xs:w-[280px] sm:w-[290px] h-[535px] xs:h-[565px] sm:h-[585px] rounded-[46px] p-[8px] bg-gradient-to-b from-[#2A2345] via-[#17132B] to-[#0B0916] shadow-[0_24px_55px_-12px_rgba(107,57,244,0.4),0_0_0_1px_rgba(139,92,246,0.3),inset_0_1px_2px_rgba(255,255,255,0.25)] cursor-pointer group"
          title="Click to advance to the next journey screen"
        >
          {/* Outer Titanium Bevel Highlight */}
          <div className="absolute inset-0 rounded-[46px] border border-violet-400/20 pointer-events-none"></div>

          {/* Side Buttons - Left (Action button + Volume) */}
          <div className="absolute -left-[3px] top-[95px] w-[3px] h-[22px] bg-violet-400/50 rounded-l-sm shadow-sm"></div>
          <div className="absolute -left-[3px] top-[132px] w-[3px] h-[38px] bg-violet-400/50 rounded-l-sm shadow-sm"></div>
          <div className="absolute -left-[3px] top-[178px] w-[3px] h-[38px] bg-violet-400/50 rounded-l-sm shadow-sm"></div>

          {/* Side Buttons - Right (Power + Camera Control) */}
          <div className="absolute -right-[3px] top-[125px] w-[3px] h-[52px] bg-violet-400/50 rounded-r-sm shadow-sm"></div>
          <div className="absolute -right-[3px] top-[215px] w-[3px] h-[34px] bg-violet-400/50 rounded-r-sm shadow-sm"></div>

          {/* Inner Display Bezel */}
          <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-[#0A0914] border border-violet-500/20 shadow-inner flex flex-col justify-between">
            {/* Front Glass Diagonal Specular Glare */}
            <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent opacity-70"></div>

            {/* Tap Ripple Effect on Screen Click */}
            {tapEffect.show && (
              <span 
                className="absolute z-40 rounded-full bg-violet-400/40 pointer-events-none animate-ping"
                style={{
                  left: tapEffect.x - 20,
                  top: tapEffect.y - 20,
                  width: 40,
                  height: 40,
                }}
              />
            )}

            {/* Top iOS Status Bar & Dynamic Island */}
            <div className="relative z-30 pt-2.5 px-5 flex items-center justify-between text-white text-[11px] font-semibold shrink-0">
              {/* Time */}
              <span className="font-mono tracking-tight text-[10px] font-bold">9:41</span>

              {/* Dynamic Island */}
              <div className="relative flex items-center justify-between px-2.5 h-[24px] min-w-[95px] max-w-[135px] bg-black rounded-full border border-violet-500/30 shadow-lg text-white">
                <div className="flex items-center gap-1.5">
                  {activeIndex === 1 ? (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ) : activeIndex === 2 ? (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                  ) : activeIndex === 4 ? (
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  )}
                  <span className="text-[8.5px] font-mono tracking-wider text-slate-300">
                    {activeIndex === 1 ? 'FaceID' : activeIndex === 2 ? 'KYC Gate' : activeIndex === 4 ? 'Settled' : 'FlowCraft'}
                  </span>
                </div>
                {/* Camera Lens Cutout */}
                <div className="h-2 w-2 rounded-full bg-[#110E20] border border-violet-900 ml-1.5"></div>
              </div>

              {/* Status Icons: Signal, WiFi, Battery */}
              <div className="flex items-center gap-1 text-slate-300 text-[9px]">
                <span className="text-[8px] font-bold text-slate-400">5G</span>
                <div className="h-2 w-3.5 rounded-xs border border-slate-400 p-[1px] flex items-center">
                  <div className="h-full w-full bg-violet-400 rounded-[1px]"></div>
                </div>
              </div>
            </div>

            {/* =================================================================== */}
            {/* INNER JOURNEY SCREENS PLAYING INSIDE PHONE                          */}
            {/* =================================================================== */}
            <div className="relative flex-1 px-3.5 py-2.5 flex flex-col justify-between overflow-hidden">
              {/* SCREEN 0: ONBOARDING & WELCOME */}
              {activeIndex === 0 && (
                <div className="h-full flex flex-col justify-between animate-fadeIn text-left">
                  <div className="pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-md border border-violet-500/30">
                        Step 1 of 5
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">FlowCraft v2.4</span>
                    </div>

                    {/* Animated SVG Hero Visual with Vivid Violet gradient */}
                    <div className="my-3 flex items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-20 h-20" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="44" fill="none" stroke="#221C3A" strokeWidth="3" />
                          <circle cx="50" cy="50" r="44" fill="none" stroke="url(#violetGrad)" strokeWidth="3.5" strokeDasharray="180 100" strokeLinecap="round" className="animate-spin" style={{ animationDuration: '8s' }} />
                          <defs>
                            <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8B5CF6" />
                              <stop offset="100%" stopColor="#6B39F4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#6B39F4] to-[#8B5CF6] flex items-center justify-center text-white shadow-md shadow-violet-600/40">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-base font-black text-white tracking-tight">
                      FlowCraft Studio
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      High-performance mobile journeys, verified state routes, and multi-device sync.
                    </p>
                  </div>

                  {/* Onboarding Feature Highlights */}
                  <div className="space-y-1.5 my-auto">
                    <div className="flex items-center gap-2 rounded-xl bg-[#141026]/90 border border-violet-500/20 p-2">
                      <div className="h-6 w-6 rounded-lg bg-violet-600/20 text-violet-300 flex items-center justify-center shrink-0">
                        <Shield className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-white leading-tight">Zero Dead-End Screens</div>
                        <div className="text-[8.5px] text-slate-400">Deterministic graph verified</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-[#141026]/90 border border-violet-500/20 p-2">
                      <div className="h-6 w-6 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Fingerprint className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-white leading-tight">Hardware Biometrics</div>
                        <div className="text-[8.5px] text-slate-400">Native Secure Enclave gates</div>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button in OneSeven Vivid Violet */}
                  <div className="pt-1">
                    <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] text-white text-[11px] font-bold shadow-md shadow-violet-600/35 flex items-center justify-center gap-1.5">
                      <span>Get Started Now</span>
                      <ArrowRight className="h-3 w-3 text-violet-200" />
                    </button>
                    <p className="text-[8.5px] text-center text-slate-500 mt-1">
                      Tap screen to advance step
                    </p>
                  </div>
                </div>
              )}

              {/* SCREEN 1: BIOMETRIC SCAN & AUTH */}
              {activeIndex === 1 && (
                <div className="h-full flex flex-col justify-between animate-fadeIn text-left">
                  <div className="pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Step 2 of 5 · FaceID
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">
                        {scanProgress >= 100 ? 'AUTHENTICATED' : `${scanProgress}%`}
                      </span>
                    </div>

                    <h2 className="text-base font-black text-white tracking-tight mt-2">
                      Biometric Security Gate
                    </h2>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Secure Enclave scan validating biometric user policy.
                    </p>
                  </div>

                  {/* Biometric SVG Scanning Visual */}
                  <div className="relative my-auto flex flex-col items-center justify-center">
                    <div className="relative w-28 h-28 rounded-2xl border-2 border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center overflow-hidden">
                      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] animate-radar-scan"></div>

                      <svg className="w-20 h-20 text-emerald-400/80" viewBox="0 0 100 100" fill="none">
                        <ellipse cx="50" cy="48" rx="30" ry="38" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                        <circle cx="38" cy="42" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="#10b981" fillOpacity="0.2" />
                        <circle cx="62" cy="42" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="#10b981" fillOpacity="0.2" />
                        <path d="M50 44 L50 56 L46 60 L54 60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M40 70 Q50 76 60 70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="20" y1="48" x2="26" y2="48" stroke="#34d399" strokeWidth="2" />
                        <line x1="74" y1="48" x2="80" y2="48" stroke="#34d399" strokeWidth="2" />
                        <line x1="50" y1="12" x2="50" y2="18" stroke="#34d399" strokeWidth="2" />
                        <line x1="50" y1="78" x2="50" y2="84" stroke="#34d399" strokeWidth="2" />
                      </svg>

                      {scanProgress >= 100 && (
                        <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center animate-fadeIn">
                          <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50">
                            <CheckCircle2 className="h-6 w-6" />
                          </div>
                          <span className="text-[10px] font-bold text-white mt-1">99.8% Match</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-[9px] font-mono text-emerald-300">
                      <Lock className="h-2.5 w-2.5" />
                      <span>Encrypted via Secure Enclave</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#141026] border border-violet-500/20 p-2.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Node Logic:</span>
                      <span className="font-mono text-emerald-400 font-bold">BRANCH_PASS</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] mt-0.5 text-slate-400">
                      <span>Confidence Threshold:</span>
                      <span className="font-mono text-slate-200">≥ 98.0% (Passed)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 2: IDENTITY KYC CHECK */}
              {activeIndex === 2 && (
                <div className="h-full flex flex-col justify-between animate-fadeIn text-left">
                  <div className="pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        Step 3 of 5 · Compliance
                      </span>
                      <span className="text-[9px] font-mono text-amber-400 font-bold">AML: 99.4%</span>
                    </div>

                    <h2 className="text-base font-black text-white tracking-tight mt-2">
                      Identity KYC Verification
                    </h2>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      AML screening & OCR liveness scoring in under 400ms.
                    </p>
                  </div>

                  {/* ID Document Visual */}
                  <div className="my-auto flex flex-col items-center justify-center">
                    <div className="relative w-40 h-24 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-[#141026] p-2.5 flex flex-col justify-between shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <FileCheck className="h-3.5 w-3.5 text-amber-400" />
                          <span className="text-[9px] font-bold text-white tracking-wider">PASSPORT OCR</span>
                        </div>
                        <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/20 px-1 py-0.5 rounded">VERIFIED</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                          <Fingerprint className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="space-y-1 w-full">
                          <div className="h-1.5 w-16 bg-slate-700 rounded"></div>
                          <div className="h-1.5 w-12 bg-slate-800 rounded"></div>
                          <div className="h-1.5 w-14 bg-emerald-500/40 rounded"></div>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-slate-800 flex justify-between font-mono text-[7px] text-slate-500">
                        <span>P&lt;USAJONES&lt;&lt;SARAH</span>
                        <span>0x4E...82</span>
                      </div>

                      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#f59e0b] animate-radar-scan"></div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-[9px] font-mono text-amber-300">
                      <ScanLine className="h-2.5 w-2.5" />
                      <span>Tamper-Proof Liveness Verified</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#141026] border border-violet-500/20 p-2.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">KYC Status:</span>
                      <span className="font-mono text-emerald-400 font-bold">APPROVED (AUTO)</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] mt-0.5 text-slate-400">
                      <span>Next Node:</span>
                      <span className="font-mono text-slate-200">Portfolio &gt;</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 3: LIVE PORTFOLIO & WEALTH DASHBOARD */}
              {activeIndex === 3 && (
                <div className="h-full flex flex-col justify-between animate-fadeIn text-left">
                  <div className="pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded-md border border-violet-500/30">
                        Step 4 of 5 · Wallet
                      </span>
                      <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold">
                        <TrendingUp className="h-2.5 w-2.5" />
                        <span>+14.8%</span>
                      </div>
                    </div>

                    {/* Balance Card */}
                    <div className="mt-2 rounded-xl bg-gradient-to-br from-[#1C1635] via-[#120F24] to-[#0A0814] border border-violet-500/30 p-2.5 shadow-md">
                      <div className="text-[9px] text-violet-300/80 uppercase tracking-wider font-semibold">
                        Multi-Currency Wealth
                      </div>
                      <div className="text-xl font-black text-white tracking-tight mt-0.5">
                        $84,250.00
                      </div>

                      {/* Animated SVG Sparkline Chart */}
                      <div className="mt-1.5 h-10 w-full">
                        <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0,40 Q30,10 60,30 T120,15 T180,8 L200,5 L200,50 L0,50 Z"
                            fill="url(#chartGrad)"
                          />
                          <path
                            d="M0,40 Q30,10 60,30 T120,15 T180,8 L200,5"
                            fill="none"
                            stroke="#A78BFA"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <circle cx="200" cy="5" r="3.5" fill="#DDD6FE" className="animate-ping" />
                          <circle cx="200" cy="5" r="2.5" fill="#ffffff" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Matrix */}
                  <div className="grid grid-cols-3 gap-1.5 my-auto">
                    <div className="rounded-xl bg-[#141026] border border-violet-500/20 p-1.5 text-center">
                      <div className="h-6 w-6 mx-auto rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center mb-0.5">
                        <Send className="h-3 w-3" />
                      </div>
                      <span className="text-[9px] font-bold text-white block">Send</span>
                    </div>

                    <div className="rounded-xl bg-[#141026] border border-violet-500/20 p-1.5 text-center">
                      <div className="h-6 w-6 mx-auto rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-0.5">
                        <DollarSign className="h-3 w-3" />
                      </div>
                      <span className="text-[9px] font-bold text-white block">Receive</span>
                    </div>

                    <div className="rounded-xl bg-[#141026] border border-violet-500/20 p-1.5 text-center">
                      <div className="h-6 w-6 mx-auto rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center mb-0.5">
                        <RefreshCw className="h-3 w-3" />
                      </div>
                      <span className="text-[9px] font-bold text-white block">FX Swap</span>
                    </div>
                  </div>

                  {/* Active Pathway Wire Action */}
                  <div className="rounded-xl bg-[#191432] border border-violet-500/40 p-2 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-white">Wire: $2,500.00 USD</div>
                      <div className="text-[8.5px] text-slate-400">Target: Sarah Jenkins</div>
                    </div>
                    <button className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] text-white text-[9px] font-bold shadow-xs">
                      Confirm
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 4: INSTANT WIRE SUCCESS & SETTLEMENT */}
              {activeIndex === 4 && (
                <div className="h-full flex flex-col justify-between animate-fadeIn text-left">
                  <div className="pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded-md border border-violet-500/30">
                        Step 5 of 5 · Completed
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">180ms Latency</span>
                    </div>
                  </div>

                  {/* Success SVG Animation */}
                  <div className="my-auto flex flex-col items-center justify-center text-center">
                    <div className="relative">
                      <div className="absolute -inset-2.5 rounded-full bg-emerald-500/20 animate-ping"></div>
                      <div className="relative h-13 w-13 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    <h3 className="text-base font-black text-white tracking-tight mt-3">
                      Transfer Completed!
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      $2,500.00 USD deposited
                    </p>

                    {/* Receipt Details Card */}
                    <div className="mt-3 w-full rounded-xl bg-[#141026] border border-violet-500/20 p-2.5 text-left space-y-1">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-slate-400">Recipient:</span>
                        <span className="font-semibold text-white">Sarah Jenkins</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-slate-400">Account:</span>
                        <span className="font-mono text-slate-300">•••• 4892 (Chase)</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-slate-400">Ledger Hash:</span>
                        <span className="font-mono text-emerald-400 text-[8.5px]">0x7F2...8E9A</span>
                      </div>
                    </div>
                  </div>

                  {/* Return / Loop Action */}
                  <div className="pt-1">
                    <button className="w-full py-2 rounded-xl bg-[#1C1635] hover:bg-[#251D48] text-slate-200 text-[10px] font-bold border border-violet-500/30 flex items-center justify-center gap-1 transition-colors">
                      <RefreshCw className="h-2.5 w-2.5 text-violet-400" />
                      <span>Replay Flow Journey</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* iOS Bottom Home Indicator Bar */}
            <div className="relative z-30 pb-2 flex justify-center shrink-0">
              <div className="h-1 w-24 rounded-full bg-slate-600/80"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Floating Shadow on Ground */}
      <div className="w-[180px] xs:w-[200px] sm:w-[220px] h-[14px] mt-5 rounded-[100%] bg-gradient-to-r from-violet-600/30 via-slate-900/60 to-purple-600/30 blur-md animate-float-shadow"></div>

      {/* Screen Selection Pills underneath Floating Phone */}
      <div className="mt-4 flex items-center justify-center gap-1 sm:gap-1.5 w-full max-w-full overflow-x-auto no-scrollbar whitespace-nowrap px-1">
        {screens.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => handleSelectTab(idx)}
            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
              activeIndex === idx
                ? 'bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] text-white shadow-md shadow-violet-600/35 ring-1 ring-violet-400'
                : 'bg-[#141026]/90 text-slate-400 hover:text-white hover:bg-[#1E173A] border border-violet-500/20'
            }`}
          >
            {s.name}
          </button>
        ))}

        {/* Play / Pause Toggle */}
        <button
          onClick={handleTogglePlayback}
          className="p-1 rounded-lg bg-[#141026] hover:bg-[#1E173A] text-slate-400 hover:text-white border border-violet-500/25 transition-colors shrink-0"
          title={isPlaying ? 'Pause screen playback' : 'Play screen playback'}
        >
          {isPlaying ? <Pause className="h-3 w-3 text-amber-400" /> : <Play className="h-3 w-3 text-emerald-400" />}
        </button>
      </div>
    </div>
  );
};
