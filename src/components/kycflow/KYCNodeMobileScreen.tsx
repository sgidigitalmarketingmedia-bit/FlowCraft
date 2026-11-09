import React from 'react';
import { 
  Scan, Camera, ShieldCheck, MapPin, Mail, Smartphone, 
  FileText, UserCheck, ShieldAlert, Shield, CheckCircle2, 
  Sparkles, Check, RefreshCw, AlertCircle, ArrowRight, 
  Lock, Globe, Cpu, Volume2, Share2, Compass, Download,
  Layers, Sliders, Play, Bell, MessageSquare, Gift, CreditCard,
  ShoppingCart, HelpCircle, Star, Settings, WifiOff, RefreshCcw,
  Trash2, User, Search, Eye, Award, ExternalLink
} from 'lucide-react';
import { StudioNode } from './types';

interface KYCNodeMobileScreenProps {
  node: StudioNode | null;
  isSimulatingStep?: boolean;
  stepIndex?: number;
  totalSteps?: number;
  progressPercent?: number;
  isSpeaking?: boolean;
  onDoneAction?: () => void;
}

export const KYCNodeMobileScreen: React.FC<KYCNodeMobileScreenProps> = ({
  node,
  isSimulatingStep = false,
  stepIndex = 1,
  totalSteps = 4,
  progressPercent = 100,
  isSpeaking = false,
  onDoneAction,
}) => {
  if (!node) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-400">
        <Smartphone className="h-12 w-12 text-slate-600 mb-3" />
        <h4 className="text-sm font-bold text-white">Select a Journey Node</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
          Click any node in the journey flow to preview its live mobile screen.
        </p>
      </div>
    );
  }

  const nodeType = node.type || '';
  const nodeProps = node.properties || {};

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-black text-white select-none">
      {/* Phone Status Bar */}
      <div className="relative z-30 flex items-center justify-between px-6 pt-3 text-[11px] font-bold text-slate-300">
        <span>9:41</span>
        <div className="h-4 w-20 rounded-full bg-[#181B20] border border-slate-800"></div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">5G</span>
          <div className="h-2.5 w-5 rounded-sm border border-slate-400 p-0.5">
            <div className="h-full w-full bg-emerald-400 rounded-2xs"></div>
          </div>
        </div>
      </div>

      {/* Breadcrumb / Step Indicator */}
      <div className="relative z-30 flex items-center justify-between px-4 py-2 border-b border-[#1E2228] bg-[#0E1013]/90 backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0">
          <span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300 shrink-0">
            Step {stepIndex} of {totalSteps}
          </span>
          <span className="text-[11px] font-bold text-white truncate max-w-[120px]">
            {node.name}
          </span>
        </div>

        {isSpeaking && (
          <div className="flex items-center gap-1 text-[9px] font-semibold text-amber-400 bg-amber-400/10 rounded-full px-2 py-0.5 border border-amber-400/30 animate-pulse shrink-0">
            <Volume2 className="h-3 w-3" />
            <span>UK Audio</span>
          </div>
        )}
      </div>

      {/* Screen Body Based on Node Type */}
      <div className="relative flex-1 flex flex-col justify-between p-4 overflow-y-auto">
        {/* ========================================================= */}
        {/* 1. DISCOVERY & ACQUISITION NODES                          */}
        {/* ========================================================= */}

        {/* Marketing Touchpoint */}
        {nodeType === 'marketing_touchpoint' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20 mb-1">
                <Share2 className="h-3 w-3" />
                <span>{nodeProps.campaignSource || 'Meta / Instagram'} Ad</span>
              </div>
              <h3 className="text-sm font-bold text-white">Social Campaign Touchpoint</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">External discovery touchpoint before app install</p>
            </div>

            <div className="my-auto w-full rounded-2xl border border-slate-800 bg-[#14171C] overflow-hidden shadow-2xl">
              <div className="relative h-32 w-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-amber-500 p-3 flex flex-col justify-between">
                <span className="bg-black/50 backdrop-blur-md text-[9px] font-bold px-2 py-0.5 rounded-full text-white w-max">Sponsored Post</span>
                <div className="text-left">
                  <div className="font-extrabold text-sm text-white">FinPulse: The 0% Fee Mobile Vault</div>
                  <div className="text-[9px] text-white/80">Manage 42 global currencies effortlessly</div>
                </div>
              </div>
              <div className="p-3 text-left space-y-1 font-mono text-[9px]">
                <div className="text-slate-400">Attribution: <span className="text-amber-400">utm_source=instagram_reels</span></div>
                <div className="text-slate-400">Attribution Window: <span className="text-white">{nodeProps.attributionWindowDays || 7} Days</span></div>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-blue-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-400 transition-all"
            >
              Simulate Ad Click &amp; Install
            </button>
          </div>
        )}

        {/* Deep Link / Universal Link */}
        {nodeType === 'deep_link' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 mb-1">
                <ExternalLink className="h-3 w-3" />
                <span>Universal Deep Link</span>
              </div>
              <h3 className="text-sm font-bold text-white">Resolving Deep Link URI</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Directing user to specific in-app destination</p>
            </div>

            <div className="my-auto w-full rounded-2xl border border-indigo-500/30 bg-[#121418] p-4 text-left font-mono text-[9px] space-y-2 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#262A30] pb-2">
                <span className="text-indigo-400 font-bold">URI SCHEME</span>
                <span className="text-emerald-400 font-semibold">VALIDATED</span>
              </div>
              <div className="rounded bg-black p-2 text-amber-300 break-all">
                finpulse://invite?ref=vip_alpha_2026&amp;target=onboarding
              </div>
              <div className="text-slate-400">Deferred Routing: <span className="text-white">Enabled</span></div>
              <div className="text-slate-400">Web Fallback: <span className="text-slate-300">https://finpulse.io/download</span></div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-indigo-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-400 transition-all"
            >
              Open Route in App
            </button>
          </div>
        )}

        {/* App Store Listing */}
        {nodeType === 'app_store_listing' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-700 mb-1">
                <Download className="h-3 w-3 text-amber-400" />
                <span>Apple App Store</span>
              </div>
              <h3 className="text-sm font-bold text-white">App Store Product Listing</h3>
            </div>

            <div className="my-auto w-full rounded-2xl border border-slate-800 bg-[#14171C] p-4 shadow-2xl text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center font-extrabold text-slate-950 text-xl shadow-lg">
                  F
                </div>
                <div>
                  <div className="font-bold text-xs text-white">FinPulse: Smart Wealth</div>
                  <div className="text-[10px] text-slate-400">FinPulse Technologies Ltd</div>
                  <div className="flex items-center gap-1 text-[9px] text-amber-400 font-bold mt-0.5">
                    <span>4.9 ★★★★★</span>
                    <span className="text-slate-500">(18.4K reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#262A30] pt-2 text-[9px] font-mono text-slate-400">
                <div>Age: 4+</div>
                <div>Category: Finance</div>
                <div>Size: 42.1 MB</div>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-blue-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-400 transition-all"
            >
              Download &amp; Open
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. ONBOARDING & ACTIVATION NODES                           */}
        {/* ========================================================= */}

        {/* Splash Screen */}
        {nodeType === 'splash_screen' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div className="opacity-0">Placeholder</div>

            <div className="my-auto flex flex-col items-center">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)] animate-pulse">
                <Sparkles className="h-10 w-10 text-slate-950 fill-current" />
              </div>
              <h2 className="mt-4 font-black text-xl text-white tracking-tight">FinPulse</h2>
              <p className="text-[10px] text-amber-400/80 font-mono tracking-widest mt-1">SMART WEALTH PLATFORM</p>
            </div>

            <div className="w-full text-center">
              <div className="inline-block h-1 w-16 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div className="h-full bg-amber-400 animate-pulse w-full"></div>
              </div>
              <div className="text-[9px] font-mono text-slate-500">v4.2.0 • Bank-Grade Encrypted</div>
            </div>
          </div>
        )}

        {/* Value Proposition Tour */}
        {nodeType === 'value_prop_tour' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-400/20">
                Product Tour (Slide 1/3)
              </span>
            </div>

            <div className="my-auto w-full flex flex-col items-center">
              <div className="h-36 w-36 rounded-full bg-gradient-to-tr from-amber-500/20 to-blue-500/20 border border-amber-400/30 flex items-center justify-center p-4 mb-4">
                <ShieldCheck className="h-16 w-16 text-amber-400" />
              </div>
              <h3 className="font-bold text-sm text-white">Bank-Grade Biometric Security</h3>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
                Your funds are protected with 3D facial depth authentication and military-grade encryption.
              </p>

              <div className="flex items-center gap-1.5 mt-4">
                <span className="h-1.5 w-6 rounded-full bg-amber-400"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700"></span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <button 
                onClick={onDoneAction}
                className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
              >
                Next Feature
              </button>
            </div>
          </div>
        )}

        {/* Identity Provision (Sign up/Login) */}
        {nodeType === 'identity_provision' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <h3 className="text-sm font-bold text-white">Create Your Account</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Get started with 1-click biometric sign-on</p>
            </div>

            <div className="my-auto w-full space-y-2.5">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-xs font-bold text-black shadow-md hover:bg-slate-100">
                <span>Continue with Apple</span>
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1C2028] border border-[#262A30] py-2.5 text-xs font-bold text-white hover:bg-[#222730]">
                <span>Continue with Google</span>
              </button>
              <div className="flex items-center gap-2 my-2 text-[10px] text-slate-500">
                <div className="h-px flex-1 bg-slate-800"></div>
                <span>OR EMAIL</span>
                <div className="h-px flex-1 bg-slate-800"></div>
              </div>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full rounded-xl border border-slate-800 bg-[#121418] px-3 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Continue to Onboarding
            </button>
          </div>
        )}

        {/* System Permissions Request */}
        {nodeType === 'permissions_request' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                System Access
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Enable Permissions</h3>
            </div>

            <div className="my-auto w-full space-y-2 text-left text-xs">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#14171C] p-3">
                <div className="flex items-center gap-2.5">
                  <Camera className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="font-bold text-white text-[11px]">Camera Access</div>
                    <div className="text-[9px] text-slate-400">Used for passport OCR &amp; 3D face scan</div>
                  </div>
                </div>
                <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center text-black">✓</div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#14171C] p-3">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="font-bold text-white text-[11px]">Location Services</div>
                    <div className="text-[9px] text-slate-400">Fraud prevention &amp; local compliance</div>
                  </div>
                </div>
                <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center text-black">✓</div>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Grant Permissions
            </button>
          </div>
        )}

        {/* Profile Personalization */}
        {nodeType === 'profile_personalization' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <h3 className="text-sm font-bold text-white">Customize Your Experience</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">What are your primary financial goals?</p>
            </div>

            <div className="my-auto w-full grid grid-cols-2 gap-2 text-left text-xs">
              {['Global Transfers', 'Crypto Vault', 'High-Yield APY', 'Business Invoice'].map((tag, idx) => (
                <div key={idx} className="rounded-xl border border-amber-400/50 bg-amber-400/10 p-3 text-white font-semibold text-[11px] flex items-center justify-between cursor-pointer">
                  <span>{tag}</span>
                  <Check className="h-3 w-3 text-amber-400" />
                </div>
              ))}
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Save Preferences
            </button>
          </div>
        )}

        {/* Interactive Guided Walkthrough */}
        {nodeType === 'interactive_walkthrough' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/20">
                Interactive Tutorial
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Guided Feature Spotlight</h3>
            </div>

            <div className="my-auto w-full rounded-2xl border-2 border-dashed border-amber-400 p-4 bg-[#14171C] text-left relative">
              <div className="absolute -top-3 left-4 bg-amber-400 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-full">
                Step 1: Your First Transfer
              </div>
              <p className="text-xs text-slate-200 mt-1">
                Tap the gold <span className="text-amber-400 font-bold">[Transfer]</span> button below to send your first fee-free payment to any contact.
              </p>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Try First Action
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. CORE ENGAGEMENT & NAVIGATION NODES                     */}
        {/* ========================================================= */}

        {/* Home Dashboard */}
        {nodeType === 'home_dashboard' && (
          <div className="flex flex-col h-full justify-between text-left">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Total Vault Balance</div>
                  <div className="text-xl font-extrabold text-white font-mono">$42,850.00</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs">
                  JD
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <button className="rounded-xl bg-amber-400 py-2 text-center text-slate-950 font-bold text-[10px]">
                  Send
                </button>
                <button className="rounded-xl bg-[#1C2028] py-2 text-center text-white font-bold text-[10px] border border-slate-800">
                  Receive
                </button>
                <button className="rounded-xl bg-[#1C2028] py-2 text-center text-white font-bold text-[10px] border border-slate-800">
                  Invest
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="my-auto space-y-1.5 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Activity</div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#14171C] border border-[#262A30]">
                <div>
                  <div className="font-bold text-white text-[11px]">Stripe Wire Payout</div>
                  <div className="text-[9px] text-slate-500">Today, 2:15 PM</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold">+$1,250.00</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#14171C] border border-[#262A30]">
                <div>
                  <div className="font-bold text-white text-[11px]">British Gas Electric</div>
                  <div className="text-[9px] text-slate-500">Yesterday</div>
                </div>
                <span className="font-mono text-slate-300 font-bold">-$84.20</span>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              View Full Portfolio
            </button>
          </div>
        )}

        {/* Global Navigation */}
        {nodeType === 'global_navigation' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                Primary Layout
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Global App Navigation</h3>
            </div>

            <div className="my-auto w-full rounded-2xl border border-slate-800 bg-[#121418] p-4 text-center">
              <div className="text-xs text-slate-300 font-semibold mb-3">Docked Tab Bar Navigation</div>
              <div className="flex items-center justify-around rounded-xl bg-black p-2.5 border border-slate-800 text-[10px]">
                <div className="text-amber-400 font-bold flex flex-col items-center">
                  <span>●</span>
                  <span>Home</span>
                </div>
                <div className="text-slate-500 flex flex-col items-center">
                  <span>○</span>
                  <span>Transfers</span>
                </div>
                <div className="text-slate-500 flex flex-col items-center">
                  <span>○</span>
                  <span>Cards</span>
                </div>
                <div className="text-slate-500 flex flex-col items-center">
                  <span>○</span>
                  <span>Vault</span>
                </div>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Switch Tab Destination
            </button>
          </div>
        )}

        {/* Search & Discovery */}
        {nodeType === 'search_discovery' && (
          <div className="flex flex-col h-full justify-between text-left">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assets, payees, transactions..."
                  defaultValue="Jane"
                  className="w-full rounded-xl border border-slate-800 bg-[#14171C] pl-9 pr-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex gap-1.5 mt-2 overflow-x-auto text-[9px] font-semibold text-slate-300">
                <span className="rounded-lg bg-amber-400/20 text-amber-300 px-2 py-0.5 border border-amber-400/30">All</span>
                <span className="rounded-lg bg-slate-800 px-2 py-0.5">Contacts</span>
                <span className="rounded-lg bg-slate-800 px-2 py-0.5">Crypto</span>
                <span className="rounded-lg bg-slate-800 px-2 py-0.5">Invoices</span>
              </div>
            </div>

            <div className="my-auto space-y-2 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Search Results (2 Matches)</div>
              <div className="rounded-xl border border-slate-800 bg-[#14171C] p-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Jane Eleanor Doe</div>
                  <div className="text-[9px] text-slate-400">jane.doe@enterprise.io</div>
                </div>
                <span className="text-[10px] font-mono text-amber-400">Saved Contact</span>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Select Result
            </button>
          </div>
        )}

        {/* Detail/Item Views */}
        {nodeType === 'detail_item_view' && (
          <div className="flex flex-col h-full justify-between text-left">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Ethereum Vault (ETH)</h3>
                <span className="font-mono text-xs font-bold text-emerald-400">+5.4%</span>
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">$3,420.50</div>
            </div>

            <div className="my-auto h-28 w-full rounded-2xl bg-[#14171C] border border-[#262A30] p-3 flex flex-col justify-between">
              <div className="text-[9px] font-mono text-slate-400">7-Day Performance Chart</div>
              <div className="h-12 w-full flex items-end gap-1">
                {[40, 55, 48, 65, 70, 62, 85].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-amber-400 rounded-t-sm" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-xl bg-amber-400 py-2.5 text-center text-xs font-bold text-slate-950">
                Buy Asset
              </button>
              <button className="rounded-xl bg-[#1C2028] border border-slate-800 py-2.5 text-center text-xs font-bold text-white">
                Transfer
              </button>
            </div>
          </div>
        )}

        {/* Action Confirmation */}
        {nodeType === 'action_confirmation' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div className="opacity-0">Placeholder</div>

            <div className="my-auto flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-white">Task Completed Successfully</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-[220px]">
                Your changes have been authenticated and written to the immutable ledger.
              </p>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition-all"
            >
              Dismiss Notification
            </button>
          </div>
        )}

        {/* Empty States */}
        {nodeType === 'empty_state' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div className="opacity-0">Placeholder</div>

            <div className="my-auto flex flex-col items-center p-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-white">No Transactions Yet</h3>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
                You haven't initiated any transfers or trades in this vault.
              </p>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Make Your First Deposit
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. RETENTION & RE-ENGAGEMENT NODES                        */}
        {/* ========================================================= */}

        {/* Push Notifications */}
        {nodeType === 'push_notifications' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-400/20">
                Lock Screen Push
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Push Alert Simulation</h3>
            </div>

            <div className="my-auto w-full rounded-2xl border border-slate-700 bg-[#161920]/95 backdrop-blur-xl p-3 text-left shadow-2xl space-y-1">
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span className="font-bold text-amber-400">FINPULSE • NOW</span>
                <span>Lock Screen</span>
              </div>
              <div className="font-bold text-xs text-white">Direct Deposit Credited: $2,500.00</div>
              <p className="text-[10px] text-slate-300 leading-snug">
                Your monthly dividend has settled. Tap to review your yield breakdown.
              </p>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Simulate User Tap
            </button>
          </div>
        )}

        {/* In-App Messages */}
        {nodeType === 'in_app_messages' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div className="opacity-0">Placeholder</div>

            <div className="my-auto w-full rounded-2xl border-2 border-amber-400 bg-[#121418] p-4 text-center shadow-2xl">
              <Sparkles className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-white">Spring APY Booster Unlocked!</h3>
              <p className="text-[10px] text-slate-300 mt-1">
                Earn 5.2% annualized return on all USD Vault balances starting today.
              </p>
              <button className="mt-3 w-full rounded-xl bg-amber-400 py-2 text-xs font-bold text-slate-950">
                Activate APY Booster
              </button>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Dismiss Modal
            </button>
          </div>
        )}

        {/* Activity Feed / Notifications Center */}
        {nodeType === 'activity_feed' && (
          <div className="flex flex-col h-full justify-between text-left">
            <div>
              <h3 className="text-sm font-bold text-white">Notification Inbox</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">3 unread notifications</p>
            </div>

            <div className="my-auto space-y-2 text-xs">
              <div className="rounded-xl border border-amber-400/40 bg-amber-400/5 p-2.5">
                <div className="font-bold text-amber-300 text-[11px]">Security: 3D Face ID Enrolled</div>
                <div className="text-[9px] text-slate-400">Sub-mm biometric depth certified</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-[#14171C] p-2.5">
                <div className="font-bold text-white text-[11px]">Card Shipped via Royal Mail</div>
                <div className="text-[9px] text-slate-500">Tracking: GBR-9402-182</div>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2 text-xs font-bold text-slate-950"
            >
              Mark All Read
            </button>
          </div>
        )}

        {/* Gamification / Loyalty Rewards */}
        {nodeType === 'gamification_rewards' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                Tier 4: Gold Member
              </span>
              <h3 className="text-sm font-bold text-white mt-1">1,450 XP Points</h3>
            </div>

            <div className="my-auto w-full rounded-2xl border border-amber-400/50 bg-[#14171C] p-4 text-center shadow-2xl">
              <Award className="h-10 w-10 text-amber-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white">Next Reward: Zero FX Spread</div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full my-2 overflow-hidden">
                <div className="h-full bg-amber-400 w-3/4"></div>
              </div>
              <div className="text-[9px] font-mono text-slate-400">350 XP to Platinum Tier</div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Claim Rewards
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. CONVERSION & TRANSACTION NODES                         */}
        {/* ========================================================= */}

        {/* Paywall / Pricing Tier View */}
        {nodeType === 'paywall_pricing' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-400/20">
                FinPulse Pro
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Upgrade to Institutional Tier</h3>
            </div>

            <div className="my-auto w-full rounded-2xl border-2 border-amber-400 bg-[#14171C] p-4 text-center shadow-2xl space-y-2">
              <div className="font-mono text-2xl font-black text-amber-400">$9.99 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
              <div className="space-y-1 text-[10px] text-slate-300 text-left">
                <div>✓ Unlimited Free Global Wires</div>
                <div>✓ 5.2% Guaranteed Yield APY</div>
                <div>✓ Dedicated 24/7 Wealth Advisor</div>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Start 30-Day Free Trial
            </button>
          </div>
        )}

        {/* Cart / Checkout Flow */}
        {nodeType === 'cart_checkout' && (
          <div className="flex flex-col h-full justify-between text-left">
            <div>
              <h3 className="text-sm font-bold text-white">Review Order Summary</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Order #GBR-9481</p>
            </div>

            <div className="my-auto space-y-2 rounded-2xl border border-slate-800 bg-[#14171C] p-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>FinPulse Metal Card</span>
                <span className="font-mono font-bold text-white">$49.00</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Express Courier Shipping</span>
                <span className="font-mono font-bold text-emerald-400">FREE</span>
              </div>
              <div className="border-t border-[#262A30] pt-2 flex justify-between font-bold text-white">
                <span>Total Due</span>
                <span className="font-mono text-amber-400 text-sm">$49.00</span>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Payment Gateway Integration */}
        {nodeType === 'payment_gateway' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <h3 className="text-sm font-bold text-white">Secure Biometric Payment</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Apple Pay / Google Pay</p>
            </div>

            <div className="my-auto w-full rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl flex flex-col items-center">
              <div className="h-10 w-10 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-2 animate-pulse">
                <Lock className="h-5 w-5" />
              </div>
              <div className="font-mono font-bold text-lg text-white">$49.00</div>
              <div className="text-[10px] text-slate-400 mt-1">Double Click Side Button to Confirm</div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-white py-2.5 text-xs font-bold text-black shadow-md hover:bg-slate-200 transition-all"
            >
              Pay with Apple Pay
            </button>
          </div>
        )}

        {/* Success & Receipt Generation */}
        {nodeType === 'success_receipt' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1 border border-emerald-400">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Payment Confirmed</h3>
              <div className="font-mono text-xs text-emerald-400 font-bold">$49.00 PAID</div>
            </div>

            <div className="my-auto w-full rounded-2xl border border-slate-800 bg-[#14171C] p-3 text-left font-mono text-[9px] text-slate-300 space-y-1">
              <div>Transaction ID: <span className="text-white">tx_98412894</span></div>
              <div>Receipt sent to: <span className="text-amber-400">jane.doe@enterprise.io</span></div>
              <div>Date: <span className="text-slate-400">03 Oct 2026, 20:15 UTC</span></div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. SUPPORT & FEEDBACK NODES                                */}
        {/* ========================================================= */}

        {/* Help Center / FAQ */}
        {nodeType === 'help_center_faq' && (
          <div className="flex flex-col h-full justify-between text-left">
            <div>
              <h3 className="text-sm font-bold text-white">Help Center &amp; Guides</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Instant answers to common questions</p>
            </div>

            <div className="my-auto space-y-1.5 text-xs">
              {['How to verify identity with passport', 'Managing multi-currency wallets', 'Exporting tax reports'].map((faq, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-[#14171C] p-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-200">{faq}</span>
                  <span className="text-slate-500">→</span>
                </div>
              ))}
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-slate-800 py-2 text-xs font-semibold text-white"
            >
              Contact Support
            </button>
          </div>
        )}

        {/* Live Chat / Ticketing Support */}
        {nodeType === 'live_chat_support' && (
          <div className="flex flex-col h-full justify-between text-left">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
              <h3 className="text-xs font-bold text-white">Live Customer Concierge</h3>
            </div>

            <div className="my-auto space-y-2 text-xs">
              <div className="rounded-2xl rounded-tl-sm bg-slate-800 p-2.5 max-w-[85%] text-slate-200 text-[11px]">
                Hello Jane! I see your passport OCR scan succeeded with 98% confidence. How may I assist you today?
              </div>
              <div className="rounded-2xl rounded-tr-sm bg-amber-400 p-2.5 max-w-[85%] ml-auto text-slate-950 font-medium text-[11px]">
                I'd like to increase my daily transfer limit.
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2 text-xs font-bold text-slate-950"
            >
              Send Message
            </button>
          </div>
        )}

        {/* In-App Feedback Prompt */}
        {nodeType === 'in_app_feedback' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <h3 className="text-sm font-bold text-white">How was your onboarding?</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Rate your satisfaction from 1 to 10</p>
            </div>

            <div className="my-auto w-full space-y-2">
              <div className="flex justify-between gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    className={`h-8 w-7 rounded-lg text-[10px] font-bold ${num >= 9 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                <span>Needs Work</span>
                <span>Exceptional</span>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950"
            >
              Submit Feedback
            </button>
          </div>
        )}

        {/* App Store Rating Prompt */}
        {nodeType === 'app_store_rating' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div className="opacity-0">Placeholder</div>

            <div className="my-auto w-full rounded-2xl border border-slate-700 bg-[#161920] p-4 shadow-2xl">
              <h3 className="text-sm font-bold text-white">Enjoying FinPulse?</h3>
              <p className="text-[10px] text-slate-400 mt-1">Tap a star to rate on the App Store</p>
              <div className="flex justify-center gap-1.5 my-3 text-amber-400 text-lg">
                ★★★★★
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded-xl bg-slate-800 py-1.5 text-xs text-slate-300">Not Now</button>
                <button className="flex-1 rounded-xl bg-amber-400 py-1.5 text-xs font-bold text-slate-950">Submit</button>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-400"
            >
              Close Dialog
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 7. ACCOUNT MANAGEMENT & SYSTEM NODES                      */}
        {/* ========================================================= */}

        {/* Profile / Settings Adjustment */}
        {nodeType === 'profile_settings' && (
          <div className="flex flex-col h-full justify-between text-left">
            <div>
              <h3 className="text-sm font-bold text-white">Account Settings</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Security &amp; Preferences</p>
            </div>

            <div className="my-auto space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-[#14171C]">
                <span>Two-Factor Authentication</span>
                <span className="text-emerald-400 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-[#14171C]">
                <span>Dark Mode Theme</span>
                <span className="text-amber-400 font-bold">Always On</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-[#14171C]">
                <span>Default Currency</span>
                <span className="text-white font-mono">USD ($)</span>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950"
            >
              Save Settings
            </button>
          </div>
        )}

        {/* Offline Mode Indicator */}
        {nodeType === 'offline_mode' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20 mb-1">
                <WifiOff className="h-3 w-3" />
                <span>Offline Mode</span>
              </div>
            </div>

            <div className="my-auto w-full rounded-2xl border border-rose-500/30 bg-[#14171C] p-4 text-center">
              <WifiOff className="h-10 w-10 text-rose-400 mx-auto mb-2" />
              <div className="font-bold text-sm text-white">No Internet Connection</div>
              <div className="text-[10px] text-slate-400 mt-1">Viewing locally cached vault ledger</div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-white"
            >
              Retry Reconnect
            </button>
          </div>
        )}

        {/* App Update / Maintenance Modals */}
        {nodeType === 'app_update_modal' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div className="opacity-0">Placeholder</div>

            <div className="my-auto w-full rounded-2xl border border-blue-500/40 bg-[#14171C] p-4 text-center shadow-2xl">
              <RefreshCcw className="h-8 w-8 text-blue-400 mx-auto mb-2 animate-spin-slow" />
              <h3 className="text-sm font-bold text-white">New Update Available</h3>
              <p className="text-[10px] text-slate-300 mt-1">Version 4.3 includes critical security patches &amp; speed boosts.</p>
              <button className="mt-3 w-full rounded-xl bg-blue-500 py-2 text-xs font-bold text-white">
                Update Now
              </button>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-400"
            >
              Later
            </button>
          </div>
        )}

        {/* Account Deletion / Data Export */}
        {nodeType === 'account_deletion' && (
          <div className="flex flex-col h-full justify-between text-left">
            <div>
              <h3 className="text-sm font-bold text-white">GDPR Privacy &amp; Data Rights</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Manage your personal data records</p>
            </div>

            <div className="my-auto space-y-2 text-xs">
              <div className="rounded-xl border border-slate-800 bg-[#14171C] p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Download All Data</div>
                  <div className="text-[9px] text-slate-400">JSON Archive of all activity</div>
                </div>
                <button className="rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] text-amber-400 font-bold">Export</button>
              </div>

              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
                <div className="font-bold text-rose-300">Request Account Deletion</div>
                <div className="text-[9px] text-rose-400/80 mt-0.5">30-day cooling off period before permanent purge</div>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-500 transition-all"
            >
              Confirm Privacy Choice
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* EXISTING VERIFICATION / KYC NODES (PRESERVED)             */}
        {/* ========================================================= */}

        {/* PASSPORT SCAN */}
        {nodeType === 'id_scan_passport' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-400/20 mb-1">
                <Scan className="h-3 w-3" />
                <span>OCR Extractor</span>
              </div>
              <h3 className="text-sm font-bold text-white">Scan Passport Information Page</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Fit your passport within the frame. Avoid glare and reflections.
              </p>
            </div>

            <div className="relative my-auto flex h-52 w-full max-w-[240px] flex-col justify-between rounded-2xl border-2 border-dashed border-amber-400/80 bg-[#121418] p-3 shadow-2xl overflow-hidden">
              <div className="absolute top-1 left-1 h-3 w-3 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-1 right-1 h-3 w-3 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-1 left-1 h-3 w-3 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-1 right-1 h-3 w-3 border-b-2 border-r-2 border-amber-400" />

              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#F59E0B] animate-bounce" />

              <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 border-b border-[#262A30] pb-1">
                <span className="font-bold text-amber-300">PASSPORT / PASSEPORT</span>
                <span>TYPE: P • GBR</span>
              </div>

              <div className="flex items-center gap-2.5 my-auto text-left">
                <div className="h-16 w-12 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    alt="Passport Portrait"
                    className="h-full w-full object-cover grayscale contrast-125"
                  />
                </div>
                <div className="space-y-0.5 text-[8px] font-mono leading-tight">
                  <div className="text-slate-500">SURNAME / NOM</div>
                  <div className="font-bold text-white">DOE</div>
                  <div className="text-slate-500">GIVEN NAMES / PRENOMS</div>
                  <div className="font-bold text-white">JANE ELEANOR</div>
                  <div className="text-slate-500">PASSPORT NO.</div>
                  <div className="font-bold text-amber-400">GBR-98234120</div>
                </div>
              </div>

              <div className="rounded bg-black/60 p-1 font-mono text-[7px] text-amber-300/90 leading-tight tracking-wider text-left border border-amber-400/20">
                P&lt;GBRDOE&lt;&lt;JANE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
                9823412094GBR9001015F2809121&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">OCR Confidence:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {nodeProps.ocrConfidenceThreshold || 96}% (Verified)
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  style={{ width: `${progressPercent}%` }} 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
                />
              </div>
              <button 
                onClick={onDoneAction}
                className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
              >
                {isSimulatingStep ? 'Verifying Details...' : 'Capture & Verify'}
              </button>
            </div>
          </div>
        )}

        {/* DRIVER LICENSE SCAN */}
        {nodeType === 'id_scan_dl' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20 mb-1">
                <Scan className="h-3 w-3" />
                <span>DMV Barcode Scanner</span>
              </div>
              <h3 className="text-sm font-bold text-white">Scan Driver's License</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Align barcode within the guide</p>
            </div>

            <div className="relative my-auto flex h-48 w-full max-w-[240px] flex-col justify-between rounded-2xl border-2 border-dashed border-blue-400/80 bg-[#121418] p-3 shadow-2xl">
              <div className="flex items-center justify-between text-[8px] font-mono text-blue-300 border-b border-[#262A30] pb-1">
                <span>STATE DRIVER LICENSE</span>
                <span className="font-bold text-white">CLASS C</span>
              </div>

              <div className="flex items-center gap-3 my-auto text-left">
                <div className="h-14 w-12 rounded bg-slate-800 overflow-hidden border border-slate-700">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    alt="DL Portrait"
                    className="h-full w-full object-cover grayscale"
                  />
                </div>
                <div className="space-y-0.5 text-[8px] font-mono leading-tight">
                  <div className="font-bold text-white">DOE, JANE E</div>
                  <div className="text-slate-400">DL: D84920194</div>
                  <div className="text-emerald-400 font-semibold">REAL ID Verified ★</div>
                </div>
              </div>

              <div className="rounded bg-slate-900 border border-blue-500/30 p-1 flex items-center justify-center font-mono text-[7px] text-blue-300">
                <span>||||||||||||||||||||||||||||||||||||||||||||||||||</span>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-blue-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-400 transition-all"
            >
              Scan PDF417 Barcode
            </button>
          </div>
        )}

        {/* 3D LIVENESS DETECTION */}
        {nodeType === 'liveness_3d' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-400/20 mb-1">
                <Camera className="h-3 w-3" />
                <span>3D Biometric Depth</span>
              </div>
              <h3 className="text-sm font-bold text-white">Face Liveness Verification</h3>
            </div>

            <div className="relative my-auto flex h-52 w-52 items-center justify-center rounded-full border-2 border-dashed border-amber-400/80 p-2 shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                alt="Biometric Face"
                className="h-full w-full rounded-full object-cover grayscale contrast-125"
              />
              <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#F59E0B] animate-bounce" />
              <div className="absolute bottom-2 rounded-full bg-emerald-500/90 border border-emerald-400 px-3 py-1 text-[9px] font-bold text-white shadow-lg backdrop-blur-md flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-white" />
                <span>Sub-mm Depth Validated</span>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Perform 3D Depth Check
            </button>
          </div>
        )}

        {/* FACIAL 1:1 MATCH */}
        {nodeType === 'face_match' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/20 mb-1">
                <UserCheck className="h-3 w-3" />
                <span>Facial Match</span>
              </div>
              <h3 className="text-sm font-bold text-white">Biometric 1:1 Comparison</h3>
            </div>

            <div className="relative my-auto flex w-full items-center justify-center gap-3">
              <div className="flex flex-col items-center">
                <div className="h-24 w-20 rounded-2xl border-2 border-slate-700 bg-slate-800 overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                    alt="ID Photo"
                    className="h-full w-full object-cover grayscale"
                  />
                </div>
                <span className="mt-1.5 text-[9px] font-mono text-slate-400">GOV ID CROP</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40">
                  <Check className="h-5 w-5" />
                </div>
                <span className="mt-1 text-[10px] font-mono text-emerald-400 font-bold">99.4%</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-24 w-20 rounded-2xl border-2 border-amber-400 bg-slate-800 overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                    alt="Live Selfie"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mt-1.5 text-[9px] font-mono text-amber-400">LIVE SELFIE</span>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-purple-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-400 transition-all"
            >
              Confirm Match
            </button>
          </div>
        )}

        {/* AI RISK SCORE */}
        {nodeType === 'risk_score' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-400/20 mb-1">
                <ShieldAlert className="h-3 w-3" />
                <span>Fraud ML Engine</span>
              </div>
              <h3 className="text-sm font-bold text-white">AI Real-Time Risk Score</h3>
            </div>

            <div className="relative my-auto flex flex-col items-center justify-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-slate-800 bg-slate-900 shadow-2xl">
                <div className="text-center">
                  <div className="font-mono text-3xl font-extrabold text-emerald-400">12</div>
                  <div className="text-[9px] font-mono text-slate-400">/ 100 RISK</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>LOW RISK • APPROVED</span>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition-all"
            >
              Approve Risk Profile
            </button>
          </div>
        )}

        {/* GEOIP VELOCITY */}
        {nodeType === 'geoip_velocity' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20 mb-1">
                <MapPin className="h-3 w-3" />
                <span>Geolocation Intelligence</span>
              </div>
              <h3 className="text-sm font-bold text-white">GeoIP &amp; Device Velocity</h3>
            </div>

            <div className="my-auto w-full rounded-2xl border border-slate-800 bg-[#121418] p-3 text-left font-mono text-[9px] space-y-1 shadow-2xl">
              <div>IP: <span className="text-blue-300 font-bold">82.165.197.10</span></div>
              <div>Location: <span className="text-white font-bold">London, United Kingdom</span></div>
              <div>VPN / Proxy: <span className="text-emerald-400 font-bold">None (Clean Residential IP)</span></div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-blue-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-400 transition-all"
            >
              Confirm Location
            </button>
          </div>
        )}

        {/* PHONE SMS OTP */}
        {nodeType === 'sms_otp' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-400/20 mb-1">
                <Smartphone className="h-3 w-3" />
                <span>Contact Verification</span>
              </div>
              <h3 className="text-sm font-bold text-white">Enter 6-Digit SMS Code</h3>
            </div>

            <div className="my-auto flex items-center justify-center gap-2">
              {['7', '4', '9', '2', '0', '1'].map((digit, idx) => (
                <div
                  key={idx}
                  className="flex h-11 w-9 items-center justify-center rounded-xl border-2 border-amber-400 bg-[#161920] font-mono text-base font-bold text-white shadow-lg"
                >
                  {digit}
                </div>
              ))}
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Verify Passcode
            </button>
          </div>
        )}

        {/* ADDRESS VERIFICATION */}
        {nodeType === 'address_registry' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <h3 className="text-sm font-bold text-white">Residential Address Match</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">National Postal Authority</p>
            </div>

            <div className="my-auto w-full rounded-2xl border border-amber-400/50 bg-[#14171C] p-4 text-left shadow-2xl space-y-1 text-xs">
              <div className="font-bold text-white">Jane Eleanor Doe</div>
              <div className="text-slate-300">42 Berkeley Square, Mayfair</div>
              <div className="text-slate-400">London, W1J 5AW, United Kingdom</div>
              <div className="text-emerald-400 font-mono text-[9px] pt-1">✓ PAF Database 100% Match</div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Confirm Address
            </button>
          </div>
        )}

        {/* AML & SANCTIONS PEP */}
        {nodeType === 'aml_sanctions' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <h3 className="text-sm font-bold text-white">AML &amp; Sanctions PEP Check</h3>
            </div>

            <div className="my-auto w-full space-y-1.5 text-left text-[10px] font-mono">
              <div className="p-2 rounded-xl bg-[#14171C] border border-emerald-500/30 flex justify-between">
                <span>OFAC SDN List</span>
                <span className="text-emerald-400 font-bold">CLEARED (0 Hits)</span>
              </div>
              <div className="p-2 rounded-xl bg-[#14171C] border border-emerald-500/30 flex justify-between">
                <span>UN Security Council</span>
                <span className="text-emerald-400 font-bold">CLEARED (0 Hits)</span>
              </div>
              <div className="p-2 rounded-xl bg-[#14171C] border border-emerald-500/30 flex justify-between">
                <span>PEP Database</span>
                <span className="text-emerald-400 font-bold">NOT A PEP</span>
              </div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition-all"
            >
              All Sanctions Cleared
            </button>
          </div>
        )}

        {/* DOCUMENT UPLOAD */}
        {nodeType === 'doc_upload' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <h3 className="text-sm font-bold text-white">Document Auto-Deskew</h3>
            </div>

            <div className="my-auto w-full max-w-[240px] rounded-2xl border-2 border-dashed border-amber-400 p-3 bg-[#121418] text-left text-[9px] font-mono space-y-1">
              <div className="text-amber-300 font-bold">UTILITY BILL / PROOF</div>
              <div className="text-white">British Gas Statement</div>
              <div className="text-emerald-400">✓ Date Validated (&lt;90 Days)</div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 transition-all"
            >
              Upload Document
            </button>
          </div>
        )}

        {/* EMAIL DELIVERABILITY */}
        {nodeType === 'email_verify' && (
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <h3 className="text-sm font-bold text-white">Email Deliverability Check</h3>
            </div>

            <div className="my-auto w-full rounded-2xl border border-blue-500/40 bg-[#14171C] p-4 text-left font-mono text-[9px] space-y-1">
              <div>Email: <span className="text-white">jane.doe@enterprise.io</span></div>
              <div>MX Records: <span className="text-emerald-400">ACTIVE</span></div>
              <div>Disposable Domain: <span className="text-emerald-400">CLEAN</span></div>
            </div>

            <button 
              onClick={onDoneAction}
              className="w-full rounded-xl bg-blue-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-400 transition-all"
            >
              Confirm Email
            </button>
          </div>
        )}
      </div>

      {/* Phone Hardware Home Bar */}
      <div className="pb-2 flex justify-center">
        <div className="h-1 w-24 rounded-full bg-slate-600/60"></div>
      </div>
    </div>
  );
};
