import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, ArrowRight, ArrowUp, Check, Copy, ExternalLink, 
  Smartphone, Layers, Sparkles, GitFork, RefreshCw, Shield, FileText, 
  Download, Monitor, CheckCircle2, ChevronRight, HelpCircle, Building2, 
  Landmark, Stethoscope, ShoppingBag, Globe, Video, Volume2, VolumeX, 
  Share2, Zap, Terminal, Sliders, Cpu, Compass, Users, Lock,
  ChevronDown, Sun, Moon, ArrowDown, X, Menu
} from 'lucide-react';
import { Project } from '../../types/builder';
import { IPhone17HeroVisual } from './IPhone17HeroVisual';
import { AppLogo } from '../brand/AppLogo';

interface LandingPageProps {
  onLaunchStudio: (initialView?: 'canvas' | 'simulator' | 'node-studio' | 'graph') => void;
  onOpenAuth: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  project: Project;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchStudio,
  onOpenAuth,
  isDarkMode,
  onToggleDarkMode,
  project,
}) => {
  // Navigation & Scroll State
  const [activeNavSection, setActiveNavSection] = useState<string>('hero');
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Hero Animated Journey Flow State
  const [heroFlowStep, setHeroFlowStep] = useState<number>(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState<boolean>(true);
  const [heroSpeed, setHeroSpeed] = useState<number>(2400);

  // 10-Second Interactive Video Tour State
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0); // 0 to 10 seconds
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);

  // Industry Solution Tab State
  const [selectedIndustry, setSelectedIndustry] = useState<string>('fintech');

  // Hero Journey Nodes Definition
  const journeySteps = [
    {
      id: 'step_welcome',
      title: '01. Welcome Onboarding',
      category: 'User Entry',
      route: '/welcome',
      badge: 'Entry Screen',
      action: 'User taps "Get Started Now"',
      target: 'Biometric Auth',
      hardware: 'Apple iPhone 17 Pro',
      desc: 'High-conversion introductory screen with brand hero visual, value proposition chips, and localized legal disclaimer.',
      codeSnippet: 'NavigationLink(destination: BiometricScanView())',
      tagColor: 'text-violet-300 bg-violet-600/15 border-violet-500/30',
      activeColor: 'border-violet-500 shadow-violet-600/40 ring-violet-500/50',
    },
    {
      id: 'step_biometric',
      title: '02. Biometric Verification',
      category: 'Security & Auth',
      route: '/auth/face-id',
      badge: 'Secure Enclave',
      action: 'FaceID / TouchID biometric scan verified',
      target: 'ID Verification',
      hardware: 'Google Pixel 9 Pro',
      desc: 'Hardware-backed biometric authentication with native Secure Enclave cryptographic key validation.',
      codeSnippet: 'LocalAuthentication.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics)',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      activeColor: 'border-emerald-500 shadow-emerald-500/30 ring-emerald-500/40',
    },
    {
      id: 'step_kyc',
      title: '03. Identity KYC Check',
      category: 'Compliance',
      route: '/kyc/verify',
      badge: 'Logic Node',
      action: 'Government ID OCR + Liveness matching score >= 98%',
      target: 'Portfolio Dashboard',
      hardware: 'Samsung Galaxy S25',
      desc: 'Automated AML/KYC identity verification evaluating document tampering and facial match confidence in under 400ms.',
      codeSnippet: 'FlowEngine.evaluateDecisionNode("kyc_confidence", minScore: 0.98)',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      activeColor: 'border-amber-500 shadow-amber-500/30 ring-amber-500/40',
    },
    {
      id: 'step_dashboard',
      title: '04. Wealth Portfolio',
      category: 'Core Dashboard',
      route: '/dashboard',
      badge: 'Active State',
      action: 'User selects "Instant Global Transfer"',
      target: 'Wire Transfer',
      hardware: 'Multi-Device Emulation',
      desc: 'Interactive account balance matrix displaying multi-currency balances, real-time FX yield, and quick navigation tabs.',
      codeSnippet: 'PortfolioState.observeLiveRates { balances, fxMatrix in ... }',
      tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
      activeColor: 'border-purple-500 shadow-purple-500/30 ring-purple-500/40',
    },
    {
      id: 'step_transfer',
      title: '05. Instant Global Transfer',
      category: 'Transaction',
      route: '/transfer/confirm',
      badge: 'Completion',
      action: '2-Factor Authenticated Payment confirmation',
      target: 'Success Toast',
      hardware: 'All 3 Devices In Sync',
      desc: 'Frictionless funds transfer confirmation with biometric re-authorization, real-time fee quotes, and receipt generation.',
      codeSnippet: 'PaymentGateway.dispatchInstantTransfer(payload, authProof: token)',
      tagColor: 'text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-500/30',
      activeColor: 'border-fuchsia-500 shadow-fuchsia-500/30 ring-fuchsia-500/40',
    },
  ];

  // Auto-play hero journey animation
  useEffect(() => {
    if (!isHeroPlaying) return;
    const timer = setInterval(() => {
      setHeroFlowStep(prev => (prev + 1) % journeySteps.length);
    }, heroSpeed);
    return () => clearInterval(timer);
  }, [isHeroPlaying, heroSpeed, journeySteps.length]);

  // Auto-play 10-second interactive video tour
  useEffect(() => {
    if (!isVideoPlaying) return;
    const interval = setInterval(() => {
      setVideoCurrentTime(prev => {
        if (prev >= 10) return 0;
        return Number((prev + 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // Track window scroll for Back-To-Top and Section Highlights
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      const sections = ['hero', 'why-us', 'capabilities', 'industries', 'video-tour', 'tech-handoff'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveNavSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveNavSection(sectionId);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveNavSection('hero');
  };

  // Industry Data
  const industries = [
    {
      id: 'fintech',
      title: 'Fintech & Neobanking',
      icon: <Landmark className="h-5 w-5 text-violet-400" />,
      tagline: 'High-Security KYC, Biometrics, and Wire Transfer Pathways',
      challenge: 'Multi-step regulatory compliance and zero-tolerance biometric authentication failure rates.',
      solution: 'Stateful decision nodes that branch dynamically between instant automated approvals, biometric liveness retries, and AML manual compliance reviews.',
      flows: ['Biometric FaceID Gate', 'Document OCR Verification', 'Multi-Currency Wallet', 'Instant Wire Transfer'],
      metrics: '82% faster compliance audit signoff · 0 dead-end states',
    },
    {
      id: 'healthcare',
      title: 'HealthTech & Patient Care',
      icon: <Stethoscope className="h-5 w-5 text-emerald-400" />,
      tagline: 'HIPAA-Compliant Patient Intake, Triage & Telehealth Appointments',
      challenge: 'Complex conditional medical intake questionnaires with strict patient data privacy requirements.',
      solution: 'Deterministic flow pathways that validate symptom triage, emergency escalation flags, and digital doctor scheduling with audited state transitions.',
      flows: ['Emergency Triage Flow', 'HIPAA Digital Signature', 'Vitals Upload Flow', 'Video Consult Booking'],
      metrics: '65% reduction in intake drop-offs · 100% audited pathways',
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce & Retail',
      icon: <ShoppingBag className="h-5 w-5 text-purple-400" />,
      tagline: 'High-Converting Checkout Funnels & Re-Engagement Journeys',
      challenge: 'Cart abandonment during checkout and clunky multi-step shipping/payment forms.',
      solution: 'Seamless 1-click Express Pay journeys, automated fallback address lookups, and visual promo code validations across iOS and Android.',
      flows: ['1-Click Apple Pay / Google Pay', 'Flash Sale Timer Journey', 'Order Tracker Map', 'Returns Self-Service'],
      metrics: '+24% mobile checkout conversion · Real-time device test',
    },
    {
      id: 'enterprise',
      title: 'Enterprise SaaS & Identity',
      icon: <Building2 className="h-5 w-5 text-amber-400" />,
      tagline: 'SAML/SSO Onboarding, RBAC Permissions & Approval Workflows',
      challenge: 'Complex role hierarchies and device posture checks across distributed mobile workforces.',
      solution: 'Enterprise identity trees that test multi-tenant organization switching, hardware biometric passkeys, and manager approval queues.',
      flows: ['Okta/Azure SSO Gateway', 'Manager Approval Queue', 'Device Posture Check', 'Audit Trail Export'],
      metrics: 'Zero security compliance gaps · Instant developer handoff',
    },
  ];

  // Video Tour Current Scene Details
  const getVideoSceneInfo = (time: number) => {
    if (time < 2.5) {
      return {
        chapter: 'Chapter 1 · 0:00 - 0:02',
        title: 'Visual Canvas & Figma Asset Palette',
        badge: 'UI Artboards',
        color: 'text-violet-400',
        desc: 'Drag artboards, configure Figma-grade vector primitives, and assemble responsive components with instant visual feedback.',
      };
    } else if (time < 5.0) {
      return {
        chapter: 'Chapter 2 · 0:02 - 0:05',
        title: 'Node Journey Studio & Decision Trees',
        badge: 'Logic Engine',
        color: 'text-emerald-400',
        desc: 'Model biometric authentication, KYC verification thresholds, and conditional branching pathways visually.',
      };
    } else if (time < 7.5) {
      return {
        chapter: 'Chapter 3 · 0:05 - 0:08',
        title: 'Multi-Device Spatial Simulator',
        badge: 'Hardware Emulation',
        color: 'text-purple-400',
        desc: 'Drag iPhone 17 Pro, Pixel 9, and Galaxy S25 onto the canvas. Rotate to landscape and test journey steps in sync.',
      };
    } else {
      return {
        chapter: 'Chapter 4 · 0:08 - 0:10',
        title: 'Automated Native Code & PDF Handoff',
        badge: 'Production Ready',
        color: 'text-amber-400',
        desc: 'Generate complete SwiftUI, Jetpack Compose, and technical handoff PDF specifications in 1 click.',
      };
    }
  };

  const currentVideoScene = getVideoSceneInfo(videoCurrentTime);

  return (
    <div className="min-h-screen w-full bg-[#08070D] text-slate-100 font-sans selection:bg-[#6B39F4] selection:text-white">
      {/* Sticky Top Navigation Bar with FlowCraft Obsidian Frosted Glass */}
      <header className="sticky top-0 z-50 w-full border-b border-violet-500/15 bg-[#090812]/92 backdrop-blur-2xl shadow-lg shadow-black/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3">
            <AppLogo size="sm" showText={true} showTagline={true} tagline="Next-Gen Mobile UX Studio" onBlueBackground={false} />
          </div>

          {/* Center Navigation Categories */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            {[
              { id: 'hero', label: 'Journey Flow' },
              { id: 'why-us', label: 'Agency Stack' },
              { id: 'capabilities', label: 'Core Engines' },
              { id: 'industries', label: 'Industry Flows' },
              { id: 'video-tour', label: '10s Tour' },
              { id: 'tech-handoff', label: 'Code Handoff' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`rounded-xl px-3.5 py-1.5 transition-all ${
                  activeNavSection === item.id
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/35 shadow-sm shadow-violet-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-violet-950/25'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="rounded-xl border border-violet-500/20 bg-[#141026] p-2 text-slate-400 hover:text-white hover:bg-[#1E1838] transition-colors"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-violet-400" />}
            </button>

            {/* Launch Studio CTA */}
            <button
              onClick={() => onLaunchStudio('canvas')}
              className="hidden xs:flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-3 sm:px-4.5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-600/35 border border-violet-400/30 transition-all active:scale-95"
            >
              <span>Launch Studio</span>
              <Sparkles className="h-3.5 w-3.5 text-violet-200" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden flex items-center justify-center rounded-xl border border-violet-500/30 bg-[#161228] p-2 text-slate-200 hover:bg-[#201B3A] transition-all"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileNavOpen ? <X className="h-4 w-4 text-violet-300" /> : <Menu className="h-4 w-4 text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer (< lg) */}
        {isMobileNavOpen && (
          <div className="lg:hidden border-t border-violet-500/20 bg-[#0A0815]/98 backdrop-blur-3xl px-4 py-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="text-[10px] font-bold uppercase tracking-wider text-violet-400 px-1">
              Navigate Sections
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'hero', label: 'Journey Flow' },
                { id: 'why-us', label: 'Agency Stack' },
                { id: 'capabilities', label: 'Core Engines' },
                { id: 'industries', label: 'Industry Flows' },
                { id: 'video-tour', label: '10s Tour' },
                { id: 'tech-handoff', label: 'Code Handoff' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-violet-500/20 bg-[#141026] text-xs font-semibold text-left text-slate-200 hover:bg-[#1E1738] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  onLaunchStudio('canvas');
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] py-3 text-xs font-bold text-white shadow-lg shadow-violet-600/35 border border-violet-400/30"
              >
                <span>Launch FlowCraft Studio</span>
                <Sparkles className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-[#141026] py-2.5 text-xs font-semibold text-slate-300"
              >
                <span>Sign In / Cloud Account</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Landing Page Content */}
      <main className="relative bg-oneseven-mesh">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO SECTION WITH 3D FLOATING IPHONE 17 & ANIMATED JOURNEY FLOW */}
        {/* ========================================================================= */}
        <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-violet-500/15">
          {/* Subtle glowing ambient backdrop */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-gradient-to-b from-[#6B39F4]/20 via-[#4B22B8]/10 to-transparent blur-3xl animate-ambient-pulse"></div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Two-Column Hero: 3D iPhone 17 Floating on the LEFT, Text on the RIGHT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* LEFT COLUMN: 3D Floating iPhone 17 with SVG Journey Animation */}
              <div className="lg:col-span-5 flex justify-center order-1 lg:order-1">
                <IPhone17HeroVisual
                  activeScreenIndex={heroFlowStep}
                  onSelectScreen={(screenIdx) => {
                    setHeroFlowStep(screenIdx);
                    setIsHeroPlaying(false);
                  }}
                  isPlaying={isHeroPlaying}
                  onTogglePlay={() => setIsHeroPlaying(!isHeroPlaying)}
                />
              </div>

              {/* RIGHT COLUMN: Hero Copy & Marketing CTAs */}
              <div className="lg:col-span-7 text-left order-2 lg:order-2 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-600/15 px-3.5 py-1 text-xs font-semibold text-violet-300 backdrop-blur-md mb-4 w-fit shadow-sm shadow-violet-950/40">
                  <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                  <span>High-Performance Digital Product Studio</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.12]">
                  From Idea to Automated{' '}
                  <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                    Mobile Journeys
                  </span>{' '}
                  Across Any Industry
                </h1>

                <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  FlowCraft unites Figma-grade artboard composition, stateful decision logic trees, real-time multi-device hardware simulation, and automated production-ready native code handoffs into a single luxury workspace.
                </p>

                {/* Marketing CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <button
                    onClick={onOpenAuth}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-600/35 border border-violet-400/30 transition-all active:scale-95"
                  >
                    <span>Launch Studio Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => scrollToSection('video-tour')}
                    className="flex items-center gap-2 rounded-xl border border-violet-500/25 bg-[#141026]/90 hover:bg-[#1E1838] px-5 py-3.5 text-sm font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
                  >
                    <Video className="h-4 w-4 text-violet-400" />
                    <span>Watch 10-Second Demo</span>
                  </button>
                </div>

                {/* Unboxed Metadata Metrics */}
                <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Figma-Grade Vector & Component Palette</span>
                  </div>
                  <span className="text-violet-500/40 hidden sm:inline">·</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>iPhone 17 Pro Emulation</span>
                  </div>
                  <span className="text-violet-500/40 hidden sm:inline">·</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>SwiftUI · Compose · PDF Spec</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Animated Journey Flow Visualizer Showcase */}
            <div className="mt-16 rounded-3xl border border-violet-500/20 bg-[#100D22]/85 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-violet-950/40">
              {/* Visualizer Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-violet-500/15">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Live Journey Flow Animation</span>
                      <span className="text-[11px] font-mono font-normal text-violet-300">
                        (Step {heroFlowStep + 1} of {journeySteps.length})
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Signals propagate across screen artboards, decision gates, and hardware frames
                    </p>
                  </div>
                </div>

                {/* Animation Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsHeroPlaying(!isHeroPlaying)}
                    className="flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-[#17132C] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-[#221B40] transition-colors"
                  >
                    {isHeroPlaying ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
                    <span>{isHeroPlaying ? 'Pause Flow' : 'Auto Play'}</span>
                  </button>

                  <button
                    onClick={() => setHeroFlowStep(prev => (prev + 1) % journeySteps.length)}
                    className="flex items-center gap-1 rounded-xl border border-violet-500/30 bg-[#17132C] px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-[#221B40] transition-colors"
                    title="Next step"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>

                  <button
                    onClick={() => setHeroFlowStep(0)}
                    className="rounded-xl border border-violet-500/30 bg-[#17132C] p-1.5 text-slate-400 hover:text-white hover:bg-[#221B40] transition-colors"
                    title="Reset to beginning"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Animated Journey Timeline Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {journeySteps.map((step, idx) => {
                  const isActive = heroFlowStep === idx;
                  const isCompleted = heroFlowStep > idx;

                  return (
                    <div
                      key={step.id}
                      onClick={() => {
                        setHeroFlowStep(idx);
                        setIsHeroPlaying(false);
                      }}
                      className={`group relative rounded-2xl border p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                        isActive
                          ? `bg-[#181335] ring-2 ${step.activeColor} -translate-y-1 shadow-lg shadow-violet-950/60`
                          : isCompleted
                          ? 'border-emerald-500/40 bg-[#120F24]/80 opacity-90'
                          : 'border-violet-500/15 bg-[#0C0A18]/70 opacity-65 hover:opacity-100 hover:border-violet-500/35'
                      }`}
                    >
                      {/* Step Header */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${step.tagColor}`}>
                            {step.badge}
                          </span>
                          <span className="text-xs font-mono text-slate-500 font-bold">
                            {idx + 1}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                          {step.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          {step.route}
                        </span>

                        <p className="mt-2 text-[11px] text-slate-300 leading-snug line-clamp-3">
                          {step.desc}
                        </p>
                      </div>

                      {/* Hardware target pill & transition */}
                      <div className="mt-4 pt-3 border-t border-violet-500/15 text-[10px] text-slate-400 flex flex-col gap-1 font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Target:</span>
                          <span className="text-slate-300 font-semibold">{step.target}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Device:</span>
                          <span className="text-violet-300 truncate max-w-[95px]">{step.hardware}</span>
                        </div>
                      </div>

                      {/* Active Pulse Ring */}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Active Step Deep Inspector */}
              <div className="mt-8 rounded-2xl border border-violet-500/20 bg-[#0A0816]/95 p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-inner">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                      Active Step Inspector
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs font-semibold text-white">
                      {journeySteps[heroFlowStep].title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <span className="text-slate-500">Action Trigger:</span> {journeySteps[heroFlowStep].action}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-400">
                    {journeySteps[heroFlowStep].codeSnippet}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>State Verified</span>
                  </span>
                  <button
                    onClick={onOpenAuth}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-600/30 transition-all active:scale-95"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: WHY ONESEVEN FLOWCRAFT (THE UNIFIED AGENCY STACK)               */}
        {/* ========================================================================= */}
        <section id="why-us" className="py-20 lg:py-28 border-b border-violet-500/15 bg-[#0A0914]/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                Architectural Breakdown
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">
                Why FlowCraft Replaces 4 Fragmented Mobile Design Tools
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                Traditional mobile engineering is hindered by disconnected design handoffs and untestable flow logic. FlowCraft delivers a single synchronized digital product studio.
              </p>
            </div>

            {/* Comparison Grid: Fragmented Old Stack vs FlowCraft Unified Solution */}
            <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* The Fragmented Problem */}
              <div className="rounded-3xl border border-red-500/20 bg-[#120F1D]/70 p-8 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                    <X className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">The Fragmented Mobile Stack</h3>
                    <p className="text-xs text-slate-400">High friction, misaligned teams, and endless rework</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      tool: 'Figma & Sketch',
                      issue: 'Static artboards cannot express conditional runtime logic, API thresholds, or biometric failure loops.',
                    },
                    {
                      tool: 'Miro & Lucidchart',
                      issue: 'Flowcharts remain visual diagrams disconnected from actual UI components and code tokens.',
                    },
                    {
                      tool: 'Jira & Confluence Specs',
                      issue: 'Wordy specs become obsolete within days, causing misunderstandings between PMs and engineers.',
                    },
                    {
                      tool: 'Manual Native Coding',
                      issue: 'Developers spend hundreds of hours recreating layouts in SwiftUI, Jetpack Compose, and React Native by hand.',
                    },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl border border-slate-800/80 bg-[#090812]/80 p-4">
                      <div className="text-xs font-bold text-red-400">{item.tool}</div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.issue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* The FlowCraft Unified Solution */}
              <div className="rounded-3xl border border-violet-500/30 bg-[#141028]/80 p-8 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-violet-950/50">
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl"></div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">The FlowCraft Unified Engine</h3>
                    <p className="text-xs text-slate-400">Single source of truth from conception to native production</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      engine: '1. Visual Artboard Studio & Figma Palette',
                      benefit: 'High-fidelity UI canvas with Figma properties, vector shapes, responsive image resizer, and graphic asset sliders.',
                    },
                    {
                      engine: '2. Stateful Node Journey Studio',
                      benefit: 'Real decision trees, KYC verification gates, biometric authentication checks, and conditional transitions.',
                    },
                    {
                      engine: '3. Multi-Phone Spatial Emulation',
                      benefit: 'Simultaneous simulation across iPhone 17 Pro, Pixel 9, and Galaxy S25 with free drag-to-place and rotation.',
                    },
                    {
                      engine: '4. Automated Native Code & PDF Handoff',
                      benefit: '1-click export of complete SwiftUI views, Jetpack Compose activities, React Native code, and developer PDF specifications.',
                    },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl border border-violet-500/25 bg-[#0D0B1A]/80 p-4">
                      <div className="text-xs font-bold text-violet-300">{item.engine}</div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Value Metrics */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="rounded-2xl border border-violet-500/20 bg-[#120F24]/80 p-5 shadow-lg">
                <div className="text-3xl font-black text-white">80%</div>
                <div className="text-xs text-slate-400 mt-1">Faster Design-to-Code Delivery</div>
              </div>
              <div className="rounded-2xl border border-violet-500/20 bg-[#120F24]/80 p-5 shadow-lg">
                <div className="text-3xl font-black text-emerald-400">0</div>
                <div className="text-xs text-slate-400 mt-1">Dead-End Journey States</div>
              </div>
              <div className="rounded-2xl border border-violet-500/20 bg-[#120F24]/80 p-5 shadow-lg">
                <div className="text-3xl font-black text-violet-400">3</div>
                <div className="text-xs text-slate-400 mt-1">Simultaneous Hardware Emulators</div>
              </div>
              <div className="rounded-2xl border border-violet-500/20 bg-[#120F24]/80 p-5 shadow-lg">
                <div className="text-3xl font-black text-purple-300">100%</div>
                <div className="text-xs text-slate-400 mt-1">Deterministic Schema Compliance</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: CORE CAPABILITIES (THE 4 ENGINES)                               */}
        {/* ========================================================================= */}
        <section id="capabilities" className="py-20 lg:py-28 border-b border-violet-500/15">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                Studio Capabilities
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">
                Four Powerful Engines Under One Roof
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                Everything required to conceptualize, wire, simulate, and deploy production mobile user journeys.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Engine 1: Canvas Workboard */}
              <div className="rounded-3xl border border-violet-500/20 bg-[#120F22]/80 p-7 hover:border-violet-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/40">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/20 border border-violet-500/35 text-violet-300 mb-5 shadow-md shadow-violet-900/40">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">01. Interactive Canvas Workboard</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Figma-grade artboard canvas with full pan, zoom (35% to 115%), drag-and-drop artboard repositioning, and a comprehensive Asset Shelf containing everything Figma has: vector shapes, graphic asset sliders with multi-PNG support, buttons, and responsive images.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-violet-500/15 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Figma Primitives & Multi-PNG Sliders</span>
                  <span className="text-xs font-semibold text-violet-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Active Engine</span>
                  </span>
                </div>
              </div>

              {/* Engine 2: Node Journey Studio */}
              <div className="rounded-3xl border border-violet-500/20 bg-[#120F22]/80 p-7 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/40">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/20 border border-emerald-500/35 text-emerald-400 mb-5 shadow-md shadow-emerald-950/40">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">02. Node Journey Studio</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Model conditional branching, KYC identity verification gates, biometric FaceID scan triggers, and multi-tier approval trees with real-time execution speeds and state inspector.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-violet-500/15 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Decision Nodes & Verification Gates</span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Stateful Logic</span>
                  </span>
                </div>
              </div>

              {/* Engine 3: Multi-Device Simulator */}
              <div className="rounded-3xl border border-violet-500/20 bg-[#120F22]/80 p-7 hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/40">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/20 border border-purple-500/35 text-purple-300 mb-5 shadow-md shadow-purple-950/40">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">03. Multi-Device Spatial Simulator</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Simulate across Apple iPhone 17 Pro, Google Pixel 9 Pro, and Samsung Galaxy S25. Drag devices anywhere onto the canvas, rotate orientation between portrait and landscape, and test journey steps independently on each model.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-violet-500/15 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Drag Library, Rotator & Independent Scrubbers</span>
                  <span className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Hardware Emulation</span>
                  </span>
                </div>
              </div>

              {/* Engine 4: State Machine Journey Graph */}
              <div className="rounded-3xl border border-violet-500/20 bg-[#120F22]/80 p-7 hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/40">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600/20 border border-amber-500/35 text-amber-400 mb-5 shadow-md shadow-amber-950/40">
                    <GitFork className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">04. Deterministic Journey Graph</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Mathematical state-machine visualization that renders transitions, entry nodes, and action pathways. Guarantees zero orphan screens, cyclic traps, or unhandled user states.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-violet-500/15 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Formal State Machine Verification</span>
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Deterministic Graph</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: CROSS-INDUSTRY SOLUTIONS (10 STANDARD DESIGN FLOWS)            */}
        {/* ========================================================================= */}
        <section id="industries" className="py-20 lg:py-28 border-b border-violet-500/15 bg-[#090812]/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                10 Standard Industry Flows
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">
                Engineered for Any Vertical: Gaming, Financial, Retail & Banking
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                Inspect 10 standard design flows across Gaming, Wealth Management, Retail, Mobile Banking, Grocery Delivery, Healthcare, and SaaS. Users can determine what is closest to their needs and customize directly.
              </p>
            </div>

            {/* Industry Selector Tabs */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {industries.map(ind => (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIndustry(ind.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    selectedIndustry === ind.id
                      ? 'bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] text-white shadow-lg shadow-violet-600/35 border border-violet-400/40'
                      : 'border border-violet-500/20 bg-[#120F24]/80 text-slate-400 hover:text-white hover:bg-[#1C1635]'
                  }`}
                >
                  {ind.icon}
                  <span>{ind.title}</span>
                </button>
              ))}
            </div>

            {/* Selected Industry Card Showcase */}
            {(() => {
              const currentInd = industries.find(i => i.id === selectedIndustry) || industries[0];
              return (
                <div className="mt-8 rounded-3xl border border-violet-500/25 bg-[#120F24]/90 p-8 backdrop-blur-2xl shadow-2xl shadow-violet-950/40">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-violet-500/15">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30">
                          {currentInd.icon}
                        </span>
                        <h3 className="text-xl font-bold text-white">{currentInd.title}</h3>
                      </div>
                      <p className="text-xs text-violet-300 font-semibold mt-1">{currentInd.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full font-mono">
                        {currentInd.metrics}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Industry Challenge</h4>
                        <p className="mt-1 text-xs text-slate-300 leading-relaxed">{currentInd.challenge}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">The FlowCraft Solution</h4>
                        <p className="mt-1 text-xs text-slate-300 leading-relaxed">{currentInd.solution}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Pre-Engineered Flow Pathways
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentInd.flows.map((flow, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-[#0A0816]/80 p-3 text-xs text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" />
                            <span>{flow}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={onOpenAuth}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-4.5 py-2 text-xs font-bold text-white shadow-md shadow-violet-600/30 transition-all active:scale-95"
                        >
                          <span>Customize {currentInd.title} Flow</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: 10-SECOND INTERACTIVE GUIDED VIDEO TOUR                        */}
        {/* ========================================================================= */}
        <section id="video-tour" className="py-20 lg:py-28 border-b border-violet-500/15">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                10-Second Guided Tour
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">
                See FlowCraft Studio in Action Under 10 Seconds
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                Watch how seamlessly you can move from canvas layout to conditional logic, multi-device hardware testing, and developer code generation.
              </p>
            </div>

            {/* Custom Interactive Simulated Video Player */}
            <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-violet-500/25 bg-[#100D22]/90 overflow-hidden shadow-2xl backdrop-blur-2xl shadow-violet-950/50">
              {/* Video Screen Simulation Display */}
              <div className="relative aspect-video w-full bg-[#08070F] flex flex-col justify-between p-6 sm:p-8 overflow-hidden select-none border-b border-violet-500/20">
                {/* Background Video Grid Animation */}
                <div className="absolute inset-0 bg-canvas-dots-dark opacity-60"></div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08070F] via-[#08070F]/40 to-transparent"></div>

                {/* Top Video Header HUD */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse"></span>
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      FlowCraft 10s Product Walkthrough
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#181335] px-2.5 py-0.5 font-mono text-[11px] font-bold text-violet-300 border border-violet-500/30">
                      0:0{Math.floor(videoCurrentTime)} / 0:10
                    </span>
                  </div>
                </div>

                {/* Center Animated Frame Content based on Current Second */}
                <div className="relative z-10 max-w-lg mx-auto text-center space-y-3">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest ${currentVideoScene.color}`}>
                    {currentVideoScene.chapter}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentVideoScene.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentVideoScene.desc}
                  </p>
                </div>

                {/* Bottom Video Overlays */}
                <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-violet-300 font-bold bg-violet-600/20 px-2 py-0.5 rounded border border-violet-500/30">
                      {currentVideoScene.badge}
                    </span>
                    <span className="hidden sm:inline text-slate-500">· Interactive Product Studio</span>
                  </div>

                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white"
                  >
                    {isVideoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
                    <span className="text-[10px]">{isVideoMuted ? 'Muted' : 'Audio On'}</span>
                  </button>
                </div>
              </div>

              {/* Video Player Scrubber & Controls Bar */}
              <div className="p-4 sm:p-5 bg-[#0C0A18] flex flex-col gap-3">
                {/* 10-Second Interactive Scrubber Bar */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400 w-8">
                    0:0{Math.floor(videoCurrentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={videoCurrentTime}
                    onChange={(e) => {
                      setVideoCurrentTime(Number(e.target.value));
                      setIsVideoPlaying(false);
                    }}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#1B1536] accent-violet-500"
                  />
                  <span className="font-mono text-xs font-bold text-slate-400 w-8">
                    0:10
                  </span>
                </div>

                {/* Video Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-600/30 transition-all"
                    >
                      {isVideoPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      <span>{isVideoPlaying ? 'Pause Video' : 'Play 10s Tour'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setVideoCurrentTime(0);
                        setIsVideoPlaying(true);
                      }}
                      className="flex items-center gap-1 rounded-xl border border-violet-500/25 bg-[#16122C] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
                      title="Replay from start"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Replay</span>
                    </button>
                  </div>

                  {/* Chapter Quick Jump Buttons */}
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
                    <button
                      onClick={() => setVideoCurrentTime(0)}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        videoCurrentTime < 2.5 ? 'border-violet-500 text-violet-300 bg-violet-600/20' : 'border-violet-500/20 text-slate-400 hover:text-white'
                      }`}
                    >
                      Canvas (0s)
                    </button>
                    <button
                      onClick={() => setVideoCurrentTime(2.6)}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        videoCurrentTime >= 2.5 && videoCurrentTime < 5.0 ? 'border-emerald-500 text-emerald-300 bg-emerald-500/10' : 'border-violet-500/20 text-slate-400 hover:text-white'
                      }`}
                    >
                      KYC Nodes (3s)
                    </button>
                    <button
                      onClick={() => setVideoCurrentTime(5.1)}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        videoCurrentTime >= 5.0 && videoCurrentTime < 7.5 ? 'border-purple-500 text-purple-300 bg-purple-500/10' : 'border-violet-500/20 text-slate-400 hover:text-white'
                      }`}
                    >
                      Simulator (6s)
                    </button>
                    <button
                      onClick={() => setVideoCurrentTime(7.6)}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        videoCurrentTime >= 7.5 ? 'border-amber-500 text-amber-300 bg-amber-500/10' : 'border-violet-500/20 text-slate-400 hover:text-white'
                      }`}
                    >
                      Export (8s)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: DEVELOPER TECHNICAL HANDOFF & PDF GENERATOR                    */}
        {/* ========================================================================= */}
        <section id="tech-handoff" className="py-20 lg:py-28 border-b border-violet-500/15 bg-[#090812]/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Automated Technical Handoff
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">
                From Visual Journeys to Native Code & PDF Specifications
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                Zero manual translation. FlowCraft compiles your journey graphs into production-grade SwiftUI 5+, Jetpack Compose Material 3, React Native, and complete PDF technical documentation.
              </p>
            </div>

            {/* Code & Handoff Feature Cards */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* PDF Generator Card */}
              <div className="rounded-3xl border border-rose-500/30 bg-[#120F24]/80 p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/15 text-rose-400 border border-rose-500/30 mb-4">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Developer PDF Technical Spec</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Compiles component schemas, flow transitions, design tokens (colors, typography, radii), and hardware device specs into an audit-ready PDF document.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-violet-500/15">
                  <button
                    onClick={onOpenAuth}
                    className="w-full rounded-xl border border-rose-500/30 bg-rose-600/10 hover:bg-rose-600 hover:text-white py-2.5 text-xs font-bold text-rose-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Generate PDF Spec</span>
                  </button>
                </div>
              </div>

              {/* Native Apple iOS (SwiftUI) Card */}
              <div className="rounded-3xl border border-violet-500/30 bg-[#120F24]/80 p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 mb-4 font-mono font-bold text-base">
                    
                  </div>
                  <h3 className="text-base font-bold text-white">Apple iOS (SwiftUI 5+)</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Complete `ContentView.swift` featuring NavigationStack, state observables, FaceID Secure Enclave authentication, and native SwiftUI design tokens.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-violet-500/15">
                  <button
                    onClick={onOpenAuth}
                    className="w-full rounded-xl border border-violet-500/30 bg-violet-600/15 hover:bg-violet-600 hover:text-white py-2.5 text-xs font-bold text-violet-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Generate SwiftUI Code</span>
                  </button>
                </div>
              </div>

              {/* Native Android (Jetpack Compose) Card */}
              <div className="rounded-3xl border border-emerald-500/30 bg-[#120F24]/80 p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 mb-4 font-mono font-bold text-base">
                    G
                  </div>
                  <h3 className="text-base font-bold text-white">Google Android (Compose M3)</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Clean `MainActivity.kt` with NavHost routing, Material 3 Scaffold styling, BiometricPrompt integration, and Kotlin Coroutine state handlers.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-violet-500/15">
                  <button
                    onClick={onOpenAuth}
                    className="w-full rounded-xl border border-emerald-500/30 bg-emerald-600/10 hover:bg-emerald-600 hover:text-white py-2.5 text-xs font-bold text-emerald-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Generate Compose Code</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: FINAL CTA BANNER & FOOTER                                      */}
        {/* ========================================================================= */}
        <section className="py-20 lg:py-28 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-violet-900/15 via-transparent to-transparent"></div>

          <div className="mx-auto max-w-5xl px-4 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Ready to Build Production Mobile Journeys?
            </h2>
            <p className="mt-4 text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Design artboards, model decision logic, simulate across iPhone 17 Pro, Pixel 9, and Galaxy S25, and export native code in seconds.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onLaunchStudio('canvas')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-600/40 border border-violet-400/30 transition-all active:scale-95"
              >
                <span>Launch FlowCraft Studio</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Luxury Studio Footer */}
      <footer className="border-t border-violet-500/15 bg-[#08070D] py-10 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AppLogo size="xs" showText={true} showTagline={true} tagline="Next-Gen Mobile UX Studio" onBlueBackground={false} />
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => scrollToSection('hero')} className="hover:text-violet-300 transition-colors">Journey Flow</button>
            <button onClick={() => scrollToSection('why-us')} className="hover:text-violet-300 transition-colors">Agency Stack</button>
            <button onClick={() => scrollToSection('industries')} className="hover:text-violet-300 transition-colors">10 Flows</button>
            <button onClick={() => scrollToSection('video-tour')} className="hover:text-violet-300 transition-colors">10s Tour</button>
            <button onClick={() => scrollToSection('tech-handoff')} className="hover:text-violet-300 transition-colors">Handoff</button>
          </div>

          <div>
            <span>© 2026 FlowCraft Studio. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/30 bg-[#120F24]/95 text-slate-300 shadow-2xl backdrop-blur-xl hover:bg-gradient-to-tr hover:from-[#6B39F4] hover:to-[#8B5CF6] hover:text-white hover:border-violet-400 transition-all group"
          title="Scroll smoothly to top"
        >
          <ArrowUp className="h-5 w-5 text-violet-400 group-hover:text-white transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}
    </div>
  );
};
