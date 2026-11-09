import React, { useState } from 'react';
import { 
  Palette, Check, Sparkles, X, RefreshCw, Sliders, 
  Layers, CheckCircle2, Droplet, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { ColorPaletteTheme, Screen } from '../../types/builder';
import { COLOR_PALETTES, PRESET_SWATCH_COLORS } from '../../data/colorPalettes';

interface ColorPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: ColorPaletteTheme;
  onApplyTheme: (theme: ColorPaletteTheme, applyToAllScreens: boolean) => void;
  selectedScreen?: Screen | null;
  onUpdateScreenBg?: (screenId: string, color: string) => void;
  isDarkMode: boolean;
}

export const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({
  isOpen,
  onClose,
  currentTheme = COLOR_PALETTES[0],
  onApplyTheme,
  selectedScreen,
  onUpdateScreenBg,
  isDarkMode,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(currentTheme.id || 'theme_electric_blue');
  const [customTheme, setCustomTheme] = useState<ColorPaletteTheme>({ ...currentTheme });
  const [applyToAllScreens, setApplyToAllScreens] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: ColorPaletteTheme) => {
    setSelectedThemeId(preset.id);
    setCustomTheme({ ...preset });
  };

  const handleApply = () => {
    onApplyTheme(customTheme, applyToAllScreens);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col h-[90vh] max-h-[760px] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl text-slate-100">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">App Color Palette & Design System</h2>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                  Global Theme Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Customize branding, screen surface colors, buttons, and high-contrast typography across your journey flows.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-800/80 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Controls: Presets vs Custom Color Sliders */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-2.5 bg-slate-950/40">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 p-1 text-xs">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all ${
                activeTab === 'presets'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Presets ({COLOR_PALETTES.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all ${
                activeTab === 'custom'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Custom Palette Builder</span>
            </button>
          </div>

          {/* Scope Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={applyToAllScreens}
                onChange={(e) => setApplyToAllScreens(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>Apply background & styling to all screens</span>
            </label>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'presets' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COLOR_PALETTES.map((preset) => {
                const isSelected = selectedThemeId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/20 ring-2 ring-blue-500/50 shadow-xl'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500 block">
                            {preset.category}
                          </span>
                          <h4 className="text-sm font-bold text-white">{preset.name}</h4>
                        </div>
                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Swatch chips */}
                      <div className="flex items-center gap-2 mt-3">
                        <div
                          className="h-8 w-12 rounded-lg border border-white/10 shadow-inner flex items-center justify-center text-[9px] font-mono text-white/90"
                          style={{ backgroundColor: preset.primary }}
                          title={`Primary: ${preset.primary}`}
                        >
                          Primary
                        </div>
                        <div
                          className="h-8 w-12 rounded-lg border border-white/10 shadow-inner flex items-center justify-center text-[9px] font-mono text-white/90"
                          style={{ backgroundColor: preset.accent }}
                          title={`Accent: ${preset.accent}`}
                        >
                          Accent
                        </div>
                        <div
                          className="h-8 w-12 rounded-lg border border-white/10 shadow-inner flex items-center justify-center text-[9px] font-mono text-white/90"
                          style={{ backgroundColor: preset.background }}
                          title={`Background: ${preset.background}`}
                        >
                          Bg
                        </div>
                        <div
                          className="h-8 w-12 rounded-lg border border-white/10 shadow-inner flex items-center justify-center text-[9px] font-mono text-white/90"
                          style={{ backgroundColor: preset.cardBg }}
                          title={`Surface: ${preset.cardBg}`}
                        >
                          Card
                        </div>
                      </div>
                    </div>

                    {/* Mini in-card mockup preview */}
                    <div
                      className="mt-4 rounded-xl p-3 border"
                      style={{
                        backgroundColor: preset.background,
                        borderColor: preset.border,
                      }}
                    >
                      <div
                        className="rounded-lg p-2.5 border"
                        style={{
                          backgroundColor: preset.cardBg,
                          borderColor: preset.border,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold" style={{ color: preset.textPrimary }}>
                            Card Preview
                          </span>
                          <span className="text-[10px] font-mono" style={{ color: preset.accent }}>
                            +12.8%
                          </span>
                        </div>
                        <div
                          className="mt-2 rounded-md py-1.5 text-center text-[10px] font-bold text-white shadow-sm"
                          style={{ backgroundColor: preset.primary }}
                        >
                          Action Button
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Custom Color Builder Form */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Brand & UI Token Variables</h3>

                {/* Primary Brand Color */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Primary Brand Accent</span>
                    <span className="font-mono text-slate-400">{customTheme.primary}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customTheme.primary}
                      onChange={(e) => setCustomTheme({ ...customTheme, primary: e.target.value, primaryHover: e.target.value })}
                      className="h-9 w-12 rounded-lg border border-slate-700 bg-slate-800 p-1 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.primary}
                      onChange={(e) => setCustomTheme({ ...customTheme, primary: e.target.value, primaryHover: e.target.value })}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-mono text-white uppercase"
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Secondary / Accent Color</span>
                    <span className="font-mono text-slate-400">{customTheme.accent}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customTheme.accent}
                      onChange={(e) => setCustomTheme({ ...customTheme, accent: e.target.value })}
                      className="h-9 w-12 rounded-lg border border-slate-700 bg-slate-800 p-1 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.accent}
                      onChange={(e) => setCustomTheme({ ...customTheme, accent: e.target.value })}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-mono text-white uppercase"
                    />
                  </div>
                </div>

                {/* Screen Background Color */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Screen Canvas Background</span>
                    <span className="font-mono text-slate-400">{customTheme.background}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customTheme.background}
                      onChange={(e) => setCustomTheme({ ...customTheme, background: e.target.value })}
                      className="h-9 w-12 rounded-lg border border-slate-700 bg-slate-800 p-1 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.background}
                      onChange={(e) => setCustomTheme({ ...customTheme, background: e.target.value })}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-mono text-white uppercase"
                    />
                  </div>
                </div>

                {/* Card Surface Color */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Card & Surface Background</span>
                    <span className="font-mono text-slate-400">{customTheme.cardBg}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customTheme.cardBg}
                      onChange={(e) => setCustomTheme({ ...customTheme, cardBg: e.target.value, surface: e.target.value })}
                      className="h-9 w-12 rounded-lg border border-slate-700 bg-slate-800 p-1 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.cardBg}
                      onChange={(e) => setCustomTheme({ ...customTheme, cardBg: e.target.value, surface: e.target.value })}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-mono text-white uppercase"
                    />
                  </div>
                </div>

                {/* Quick Swatch Bar */}
                <div className="pt-2">
                  <span className="text-[11px] font-medium text-slate-400 block mb-2">Quick Accent Swatches</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_SWATCH_COLORS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setCustomTheme({ ...customTheme, primary: hex, primaryHover: hex })}
                        style={{ backgroundColor: hex }}
                        className="h-6 w-6 rounded-full border border-white/20 transition-transform hover:scale-125 focus:ring-2 focus:ring-white"
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Mockup Preview Column */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live Simulation Preview</span>

                <div
                  className="w-full max-w-[280px] rounded-3xl p-5 border shadow-2xl transition-all"
                  style={{
                    backgroundColor: customTheme.background,
                    borderColor: customTheme.border,
                  }}
                >
                  {/* Status Bar Mock */}
                  <div className="flex items-center justify-between text-[10px] font-semibold mb-4" style={{ color: customTheme.textSecondary }}>
                    <span>9:41</span>
                    <div className="h-3 w-16 rounded-full bg-slate-900 border border-slate-800"></div>
                    <span>100%</span>
                  </div>

                  {/* Surface Card */}
                  <div
                    className="rounded-2xl p-4 border mb-4 space-y-2.5 transition-all shadow-md"
                    style={{
                      backgroundColor: customTheme.cardBg,
                      borderColor: customTheme.border,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: customTheme.textPrimary }}>
                        Total Balance
                      </span>
                      <span className="text-[10px] font-mono font-bold" style={{ color: customTheme.accent }}>
                        +24.6%
                      </span>
                    </div>
                    <div className="text-xl font-bold font-mono tracking-tight" style={{ color: customTheme.textPrimary }}>
                      $24,850.00
                    </div>
                    <p className="text-[10px]" style={{ color: customTheme.textSecondary }}>
                      Vault connected & verified
                    </p>
                  </div>

                  {/* Primary CTA */}
                  <button
                    type="button"
                    style={{ backgroundColor: customTheme.primary }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white shadow-lg transition-transform active:scale-95"
                  >
                    <span>Instant Transfer</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/80">
          <button
            onClick={() => {
              setCustomTheme({ ...COLOR_PALETTES[0] });
              setSelectedThemeId(COLOR_PALETTES[0].id);
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
            >
              <Check className="h-4 w-4" />
              <span>Apply Color Palette</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
