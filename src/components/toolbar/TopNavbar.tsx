import React, { useState } from 'react';
import { 
  Sparkles, Download, Play, Sun, Moon, User, LogOut, 
  RefreshCw, Check, Layers, Smartphone, GitFork, Shield, ChevronDown,
  FileText, Home, Palette, Share2, Users, Compass, Menu, X, FolderSearch, Package
} from 'lucide-react';
import { AuthUser, Project } from '../../types/builder';
import { downloadDeveloperHandoffPdf } from '../../utils/pdfGenerator';
import { AppLogo } from '../brand/AppLogo';

interface TopNavbarProps {
  project: Project;
  activeView: 'landing' | 'canvas' | 'simulator' | 'node-studio' | 'graph';
  onChangeView: (view: 'landing' | 'canvas' | 'simulator' | 'node-studio' | 'graph') => void;
  onExecuteBuild: () => void;
  isBuilding: boolean;
  onOpenExport: () => void;
  onOpenColorPalette: () => void;
  onOpenIndustryFlows?: () => void;
  onOpenShareCanvas?: () => void;
  onOpenGraphicCms?: () => void;
  onOpenFigmaExport?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onUpdateProjectName: (newName: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  project,
  activeView,
  onChangeView,
  onExecuteBuild,
  isBuilding,
  onOpenExport,
  onOpenColorPalette,
  onOpenIndustryFlows,
  onOpenShareCanvas,
  onOpenGraphicCms,
  onOpenFigmaExport,
  isDarkMode,
  onToggleDarkMode,
  currentUser,
  onOpenAuth,
  onLogout,
  onUpdateProjectName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (projectName.trim()) {
      onUpdateProjectName(projectName.trim());
    }
  };

  const navItems: { id: 'landing' | 'canvas' | 'node-studio' | 'simulator' | 'graph'; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'landing', label: 'Overview', icon: Home, desc: 'Journey Guide & Studio Specs' },
    { id: 'canvas', label: 'Canvas', icon: Layers, desc: 'Artboards & Interactive Wireframes' },
    { id: 'node-studio', label: 'Node Studio', icon: Sparkles, desc: 'KYC Logic & Decision Matrix' },
    { id: 'simulator', label: 'Simulator', icon: Smartphone, desc: 'Multi-Device Native Simulation' },
    { id: 'graph', label: 'Journey Graph', icon: GitFork, desc: 'Interactive State Diagram' },
  ];

  return (
    <>
      <header className="relative flex h-14 shrink-0 w-full items-center justify-between border-b border-violet-500/15 bg-[#090812]/95 px-3 sm:px-4 backdrop-blur-2xl text-slate-100 select-none z-30 shadow-lg shadow-black/40">
        {/* Zone 1: FlowCraft Wordmark & Project Name */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <button
            onClick={() => onChangeView('landing')}
            className="flex items-center gap-2 text-left group transition-all hover:opacity-95"
            title="Return to FlowCraft Product Overview"
          >
            <AppLogo size="sm" showText={true} showTagline={false} onBlueBackground={false} />
          </button>

          {/* Project Title / Quick Renaming */}
          <div className="flex items-center gap-2 text-xs text-slate-400 border-l border-violet-500/20 pl-2.5 sm:pl-3">
            {isEditingName ? (
              <input
                type="text"
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
                className="rounded-lg bg-[#161226] border border-violet-500/40 px-2 py-0.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500 max-w-[120px] sm:max-w-[160px]"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="max-w-[100px] sm:max-w-[140px] md:max-w-[180px] truncate hover:text-white transition-colors font-medium text-slate-300 text-left"
                title="Click to rename project"
              >
                {project.name}
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Synced</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Desktop Segmented View Switcher Tabs (Hidden on mobile/tablet < xl) */}
        <div className="hidden xl:flex items-center gap-1 rounded-xl border border-violet-500/20 bg-[#120F20]/90 p-1 shrink-0 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 2xl:px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] text-white shadow-md shadow-violet-600/35 border border-violet-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-violet-950/30'
                }`}
                title={item.desc}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Zone 3: Desktop Actions (lg and up) */}
        <div className="hidden lg:flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Execute Build */}
          <button
            onClick={onExecuteBuild}
            disabled={isBuilding}
            className="flex items-center gap-1.5 rounded-xl bg-[#171328] hover:bg-[#201B3A] border border-violet-500/25 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-all active:scale-95 disabled:opacity-50"
            title="Execute Build Test"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-violet-400 ${isBuilding ? 'animate-spin' : ''}`} />
            <span>{isBuilding ? 'Building...' : 'Build'}</span>
          </button>

          {/* Download PDF Technical Spec */}
          <button
            onClick={() => downloadDeveloperHandoffPdf(project)}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-600/10 hover:bg-rose-600 hover:text-white px-2.5 py-1.5 text-xs font-semibold text-rose-300 transition-all active:scale-95 shadow-sm"
            title="Download PDF Technical Handoff Specification"
          >
            <FileText className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden xl:inline">PDF Spec</span>
          </button>

          {/* Color Palette Theme Engine */}
          <button
            onClick={onOpenColorPalette}
            className="flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-600/15 hover:bg-violet-600 hover:text-white px-2.5 py-1.5 text-xs font-semibold text-violet-300 transition-all active:scale-95 shadow-sm"
            title="App Color Palette & Design System"
          >
            <Palette className="h-3.5 w-3.5 text-violet-400" />
            <span className="hidden xl:inline">Palette</span>
            {project.activeTheme && (
              <span 
                className="h-2 w-2 rounded-full border border-white/40 ml-0.5" 
                style={{ backgroundColor: project.activeTheme.primary }} 
                title={project.activeTheme.name}
              />
            )}
          </button>

          {/* 10 Standard Design Flows across Industries */}
          {onOpenIndustryFlows && (
            <button
              onClick={onOpenIndustryFlows}
              className="flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-gradient-to-r from-violet-600/25 to-purple-600/25 hover:from-[#6B39F4] hover:to-[#8B5CF6] hover:text-white px-2.5 py-1.5 text-xs font-bold text-violet-200 transition-all active:scale-95 shadow-sm shadow-violet-950/50"
              title="Inspect 10 Standard Design Flows: Gaming, Financial, Retail, Banking, Grocery..."
            >
              <Compass className="h-3.5 w-3.5 text-violet-300" />
              <span>10 Flows</span>
              <span className="rounded bg-violet-500/30 text-[9px] px-1 font-mono text-violet-200">10</span>
            </button>
          )}

          {/* Graphic Assets CMS & Media Hub */}
          {onOpenGraphicCms && (
            <button
              onClick={onOpenGraphicCms}
              className="flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-600/15 hover:bg-violet-600 hover:text-white px-2.5 py-1.5 text-xs font-semibold text-violet-300 transition-all active:scale-95 shadow-sm"
              title="Open Graphic Assets CMS & Media Hub (Search Local Computer)"
            >
              <FolderSearch className="h-3.5 w-3.5 text-violet-400" />
              <span>Assets CMS</span>
            </button>
          )}

          {/* Share Canvas with Partners */}
          {onOpenShareCanvas && (
            <button
              onClick={onOpenShareCanvas}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-600/15 hover:bg-emerald-600 hover:text-white px-2.5 py-1.5 text-xs font-bold text-emerald-300 transition-all active:scale-95 shadow-sm"
              title="Share Canvas with Partners (Create Sharable Link)"
            >
              <Share2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Share</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          )}

          {/* Export to Figma REST API */}
          {onOpenFigmaExport && (
            <button
              onClick={onOpenFigmaExport}
              className="flex items-center gap-1.5 rounded-xl border border-pink-500/40 bg-pink-500/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white px-2.5 py-1.5 text-xs font-bold text-pink-300 transition-all active:scale-95 shadow-sm group"
              title="Export Screen Layouts & Element Hierarchies to Figma REST API"
            >
              <Layers className="h-3.5 w-3.5 text-pink-400 group-hover:text-white" />
              <span>Figma</span>
            </button>
          )}

          {/* Bundle ZIP (Build + Screenshots) */}
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/flowcraft-finpulse-build-and-screenshots.zip';
              link.download = 'flowcraft-finpulse-build-and-screenshots.zip';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-white px-2.5 py-1.5 text-xs font-bold text-amber-300 transition-all active:scale-95 shadow-sm group"
            title="Download Full Project ZIP Bundle with High-Res Screenshots, Production Build, and Multi-Platform Native Source"
          >
            <Package className="h-3.5 w-3.5 text-amber-400 group-hover:text-white" />
            <span>Bundle (.ZIP)</span>
            <span className="rounded bg-amber-500/25 text-amber-200 text-[9px] px-1 font-bold group-hover:bg-white/20">4.2MB</span>
          </button>

          {/* Export Code & Multi-Platform Bundle */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#7C3AED] hover:from-[#5B2FE3] hover:to-[#6D28D9] px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-600/35 border border-violet-400/30 transition-all active:scale-95"
            title="Export Source Code & Schemas"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>

          {/* Dark Mode toggle */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light theme' : 'Switch to Dark theme'}
            className="rounded-xl border border-violet-500/20 bg-[#161328] p-1.5 text-slate-400 hover:bg-[#201B3A] hover:text-white transition-colors"
          >
            {isDarkMode ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-violet-400" />}
          </button>

          {/* User profile dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 rounded-xl border border-violet-500/25 bg-[#161328] p-1 pr-2 hover:bg-[#201B3A] transition-colors"
                title={currentUser.name}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-6 w-6 rounded-lg bg-violet-600/20"
                />
                <span className="hidden 2xl:inline text-xs font-semibold text-slate-200 truncate max-w-[90px]">
                  {currentUser.name}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-violet-500/25 bg-[#120F22]/95 p-2 shadow-2xl backdrop-blur-2xl z-50 text-xs shadow-violet-950/60">
                  <div className="border-b border-violet-500/20 p-2">
                    <div className="font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-violet-400">
                      <Shield className="h-3 w-3" />
                      <span>{currentUser.role}</span>
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenExport();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-300 hover:bg-violet-950/40 hover:text-white"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-400" />
                      <span>Download React Code</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-rose-300 hover:bg-rose-500/10"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-[#161328] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-[#201B3A] hover:text-white transition-colors"
            >
              <User className="h-3.5 w-3.5 text-violet-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Zone 4: Mobile & Tablet Controls (< lg) */}
        <div className="flex lg:hidden items-center gap-1.5">
          {/* Quick Export CTA on Mobile */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] px-2.5 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-600/30 border border-violet-400/30 transition-all active:scale-95"
            title="Export Code"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Export</span>
          </button>

          {/* Quick Share CTA on Mobile */}
          {onOpenShareCanvas && (
            <button
              onClick={onOpenShareCanvas}
              className="flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-600/15 p-1.5 text-emerald-300 transition-all active:scale-95"
              title="Share Canvas"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Theme Toggle on Mobile */}
          <button
            onClick={onToggleDarkMode}
            className="rounded-xl border border-violet-500/20 bg-[#161328] p-1.5 text-slate-400 transition-colors"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-violet-400" />}
          </button>

          {/* Mobile Menu Hamburger / Close Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex items-center justify-center rounded-xl border p-2 transition-all active:scale-95 ${
              isMobileMenuOpen
                ? 'border-violet-400 bg-violet-600 text-white shadow-lg shadow-violet-600/40'
                : 'border-violet-500/30 bg-[#171328] text-slate-200 hover:bg-[#201B3A]'
            }`}
            aria-label="Toggle Navigation Menu"
            title="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Down / Fullscreen Drawer Menu (< lg) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-14 bottom-14 z-50 bg-[#08070D]/95 backdrop-blur-3xl overflow-y-auto p-4 border-b border-violet-500/20 shadow-2xl flex flex-col justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            {/* Project Header Info */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#120F24] border border-violet-500/20">
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold tracking-wider text-violet-400">Current Workspace</div>
                <div className="font-bold text-white text-sm truncate">{project.name}</div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active</span>
              </div>
            </div>

            {/* View Navigation Grid */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Studio Views
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onChangeView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                        isActive
                          ? 'border-violet-400/60 bg-gradient-to-r from-violet-600/30 to-[#6B39F4]/20 text-white shadow-lg shadow-violet-950/60 ring-1 ring-violet-400/30'
                          : 'border-violet-500/15 bg-[#120F22]/80 text-slate-300 hover:bg-[#1A1435]'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-[#6B39F4] text-white shadow-md' : 'bg-[#18132F] text-violet-400'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                          <span>{item.label}</span>
                          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Project Actions & Tools
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* 10 Industry Flows */}
                {onOpenIndustryFlows && (
                  <button
                    onClick={() => {
                      onOpenIndustryFlows();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col gap-1.5 p-3 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-900/30 to-[#120F22] text-left text-violet-200 active:scale-98 transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <Compass className="h-4 w-4 text-violet-400" />
                      <span className="rounded bg-violet-500/40 text-[9px] px-1.5 py-0.2 font-mono text-white font-bold">10</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">10 Industry Flows</div>
                      <div className="text-[10px] text-slate-400">Gaming, Banking, Retail...</div>
                    </div>
                  </button>
                )}

                {/* Share Canvas */}
                {onOpenShareCanvas && (
                  <button
                    onClick={() => {
                      onOpenShareCanvas();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col gap-1.5 p-3 rounded-2xl border border-emerald-500/30 bg-[#120F22] text-left text-emerald-200 active:scale-98 transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <Share2 className="h-4 w-4 text-emerald-400" />
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Share Canvas</div>
                      <div className="text-[10px] text-slate-400">Live Partner Link</div>
                    </div>
                  </button>
                )}

                {/* Design Color Palette */}
                <button
                  onClick={() => {
                    onOpenColorPalette();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col gap-1.5 p-3 rounded-2xl border border-violet-500/20 bg-[#120F22] text-left active:scale-98 transition-all shadow-sm"
                >
                  <Palette className="h-4 w-4 text-violet-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Design Tokens</div>
                    <div className="text-[10px] text-slate-400">Color Themes & Presets</div>
                  </div>
                </button>

                {/* Graphic Assets CMS & Media Hub */}
                {onOpenGraphicCms && (
                  <button
                    onClick={() => {
                      onOpenGraphicCms();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col gap-1.5 p-3 rounded-2xl border border-violet-500/20 bg-[#120F22] text-left active:scale-98 transition-all shadow-sm"
                  >
                    <FolderSearch className="h-4 w-4 text-violet-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Assets CMS</div>
                      <div className="text-[10px] text-slate-400">Computer Search & Media</div>
                    </div>
                  </button>
                )}

                {/* Run Build Test */}
                <button
                  onClick={() => {
                    onExecuteBuild();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isBuilding}
                  className="flex flex-col gap-1.5 p-3 rounded-2xl border border-violet-500/20 bg-[#120F22] text-left active:scale-98 transition-all shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 text-violet-400 ${isBuilding ? 'animate-spin' : ''}`} />
                  <div>
                    <div className="text-xs font-bold text-white">{isBuilding ? 'Building...' : 'Run Build'}</div>
                    <div className="text-[10px] text-slate-400">Validate Architecture</div>
                  </div>
                </button>

                {/* Export to Figma REST API */}
                {onOpenFigmaExport && (
                  <button
                    onClick={() => {
                      onOpenFigmaExport();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col gap-1.5 p-3 rounded-2xl border border-pink-500/30 bg-pink-950/20 text-left active:scale-98 transition-all shadow-sm col-span-2"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-pink-400" />
                      <span className="text-xs font-bold text-pink-200">Export to Figma REST API JSON</span>
                      <span className="rounded bg-pink-500/30 text-white text-[9px] px-1 font-bold">REST</span>
                    </div>
                    <div className="text-[10px] text-pink-300/70">Canonical screen layouts, element hierarchy tree, & prototyping links</div>
                  </button>
                )}

                {/* Technical PDF Spec */}
                <button
                  onClick={() => {
                    downloadDeveloperHandoffPdf(project);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col gap-1.5 p-3 rounded-2xl border border-rose-500/30 bg-rose-950/15 text-left active:scale-98 transition-all shadow-sm col-span-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-rose-400" />
                    <span className="text-xs font-bold text-rose-200">Download Developer PDF Handoff Spec</span>
                  </div>
                  <div className="text-[10px] text-rose-300/70">Full architecture, screen wiring, and component checklist</div>
                </button>
              </div>
            </div>
          </div>

          {/* User Account / Auth Footer inside Mobile Drawer */}
          <div className="pt-4 mt-4 border-t border-violet-500/20">
            {currentUser ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#120F24] border border-violet-500/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 rounded-xl bg-violet-600/30" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 rounded-xl bg-rose-500/15 border border-rose-500/30 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/25"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Exit</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] py-3 text-xs font-bold text-white shadow-lg shadow-violet-600/30"
              >
                <User className="h-4 w-4" />
                <span>Sign In to Cloud Sync</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar (< lg) */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex h-14 items-center justify-around border-t border-violet-500/20 bg-[#090812]/95 px-1 backdrop-blur-2xl text-slate-400 shadow-2xl shadow-black"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onChangeView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all ${
                isActive
                  ? 'text-white'
                  : 'hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-all ${
                isActive ? 'bg-[#6B39F4] text-white shadow-md shadow-violet-600/50' : ''
              }`}>
                <Icon className="h-4 w-4" />
                {isActive && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-violet-300 animate-ping" />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight font-semibold ${
                isActive ? 'text-violet-300 font-bold' : 'text-slate-400'
              }`}>
                {item.label === 'Node Studio' ? 'Nodes' : item.label === 'Journey Graph' ? 'Graph' : item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
