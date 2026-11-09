import React from 'react';
import { 
  Maximize2, Minimize2, Lock, Unlock, Scaling, Ratio, 
  Sparkles, Video, Check, RefreshCw, Eye, Sliders, ChevronDown
} from 'lucide-react';
import { ElementProperties } from '../../types/builder';

interface MotionVideoSplashResizerProps {
  element: ElementProperties;
  onUpdate: (updated: ElementProperties) => void;
}

export const MotionVideoSplashResizer: React.FC<MotionVideoSplashResizerProps> = ({
  element,
  onUpdate,
}) => {
  const sizeMode = element.splashVideoSizeMode || 'fullscreen';
  const aspectRatio = element.splashVideoAspectRatio || '9:16';
  const isLocked = element.splashVideoLockProportions !== false;
  const customWidth = element.splashVideoCustomWidth ?? 88;
  const scale = element.splashVideoScale ?? 100;
  const fit = element.splashVideoFit || 'cover';
  const borderRadius = element.splashVideoBorderRadius ?? 20;
  const opacity = element.splashVideoOpacity ?? 85;
  const alignment = element.splashVideoAlignment || 'center';
  const hasGlow = element.splashVideoGlow !== false;

  // Preset ratios with width/height factor
  const RATIO_CONFIGS: { id: '9:16' | '16:9' | '1:1' | '4:5' | '4:3' | '21:9' | 'custom'; label: string; desc: string; ratioW: number; ratioH: number }[] = [
    { id: '9:16', label: '9:16', desc: 'Story / Reel', ratioW: 9, ratioH: 16 },
    { id: '16:9', label: '16:9', desc: 'Cinema Wide', ratioW: 16, ratioH: 9 },
    { id: '1:1', label: '1:1', desc: 'Square Tile', ratioW: 1, ratioH: 1 },
    { id: '4:5', label: '4:5', desc: 'Feed Portrait', ratioW: 4, ratioH: 5 },
    { id: '4:3', label: '4:3', desc: 'Classic TV', ratioW: 4, ratioH: 3 },
    { id: '21:9', label: '21:9', desc: 'Ultrawide', ratioW: 21, ratioH: 9 },
    { id: 'custom', label: 'Custom', desc: 'Freeform', ratioW: 1, ratioH: 1 },
  ];

  const handleSetFullscreen = () => {
    onUpdate({
      ...element,
      splashVideoSizeMode: 'fullscreen',
      splashVideoFit: 'cover',
      splashVideoScale: 100,
      splashVideoCustomWidth: 100,
    });
  };

  const handleSetProportional = () => {
    onUpdate({
      ...element,
      splashVideoSizeMode: 'proportional',
      splashVideoAspectRatio: element.splashVideoAspectRatio || '9:16',
      splashVideoCustomWidth: element.splashVideoCustomWidth || 88,
      splashVideoScale: element.splashVideoScale || 100,
      splashVideoFit: element.splashVideoFit || 'cover',
      splashVideoBorderRadius: element.splashVideoBorderRadius ?? 20,
      splashVideoLockProportions: true,
    });
  };

  // Quick 1-click proportion presets
  const applyPreset = (preset: 'story' | 'cinema' | 'square' | 'island' | 'fullscreen') => {
    if (preset === 'fullscreen') {
      handleSetFullscreen();
      return;
    }

    if (preset === 'story') {
      onUpdate({
        ...element,
        splashVideoSizeMode: 'proportional',
        splashVideoAspectRatio: '9:16',
        splashVideoCustomWidth: 88,
        splashVideoScale: 100,
        splashVideoBorderRadius: 24,
        splashVideoFit: 'cover',
        splashVideoAlignment: 'center',
        splashVideoGlow: true,
        splashVideoLockProportions: true,
      });
    } else if (preset === 'cinema') {
      onUpdate({
        ...element,
        splashVideoSizeMode: 'proportional',
        splashVideoAspectRatio: '16:9',
        splashVideoCustomWidth: 100,
        splashVideoScale: 100,
        splashVideoBorderRadius: 16,
        splashVideoFit: 'cover',
        splashVideoAlignment: 'center',
        splashVideoGlow: false,
        splashVideoLockProportions: true,
      });
    } else if (preset === 'square') {
      onUpdate({
        ...element,
        splashVideoSizeMode: 'proportional',
        splashVideoAspectRatio: '1:1',
        splashVideoCustomWidth: 76,
        splashVideoScale: 100,
        splashVideoBorderRadius: 28,
        splashVideoFit: 'cover',
        splashVideoAlignment: 'center',
        splashVideoGlow: true,
        splashVideoLockProportions: true,
      });
    } else if (preset === 'island') {
      onUpdate({
        ...element,
        splashVideoSizeMode: 'proportional',
        splashVideoAspectRatio: '4:5',
        splashVideoCustomWidth: 82,
        splashVideoScale: 95,
        splashVideoBorderRadius: 32,
        splashVideoFit: 'cover',
        splashVideoAlignment: 'center',
        splashVideoGlow: true,
        splashVideoLockProportions: true,
      });
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-purple-500/40 bg-purple-950/20 p-3 shadow-md">
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
        <div className="flex items-center gap-1.5">
          <Video className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-bold text-purple-200">Motion Video Sizing</span>
        </div>
        <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-purple-300">
          {sizeMode === 'fullscreen' ? 'Full Viewport' : `${aspectRatio} Ratio`}
        </span>
      </div>

      {/* Primary Switcher: Full Screen vs Proportional Resizer */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
          Display & Sizing Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {/* Option 1: Go Full Screen */}
          <button
            type="button"
            onClick={handleSetFullscreen}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-xs font-semibold border transition-all ${
              sizeMode === 'fullscreen'
                ? 'border-purple-500 bg-purple-600/30 text-purple-200 ring-1 ring-purple-500/50 shadow-sm'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Maximize2 className="h-3.5 w-3.5 text-purple-300" />
            <span>Go Full Screen</span>
          </button>

          {/* Option 2: Proportional Resizer */}
          <button
            type="button"
            onClick={handleSetProportional}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-xs font-semibold border transition-all ${
              sizeMode === 'proportional'
                ? 'border-purple-500 bg-purple-600/30 text-purple-200 ring-1 ring-purple-500/50 shadow-sm'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Ratio className="h-3.5 w-3.5 text-cyan-300" />
            <span>Resizer Tool</span>
          </button>
        </div>
      </div>

      {/* FULL SCREEN MODE CONTROLS */}
      {sizeMode === 'fullscreen' && (
        <div className="space-y-2.5 rounded-lg border border-purple-500/20 bg-slate-900/80 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
            <Check className="h-3.5 w-3.5" />
            <span>Full Screen Active: Video covers 100% of mobile phone display</span>
          </div>

          {/* Video Fit Mode in Fullscreen */}
          <div>
            <div className="flex justify-between items-center mb-1 text-[11px] text-slate-300">
              <span>Fullscreen Video Fit</span>
              <span className="font-mono text-purple-300 uppercase text-[10px]">{fit}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onUpdate({ ...element, splashVideoFit: 'cover' })}
                className={`py-1 px-2 rounded-md border text-[11px] font-medium transition-colors ${
                  fit === 'cover'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                Cover (Full Bleed Fill)
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ ...element, splashVideoFit: 'contain' })}
                className={`py-1 px-2 rounded-md border text-[11px] font-medium transition-colors ${
                  fit === 'contain'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                Contain (Letterbox)
              </button>
            </div>
          </div>

          {/* Overlay Opacity Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-[11px] text-slate-300">
              <span>Video Background Opacity</span>
              <span className="font-mono text-purple-300">{opacity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={opacity}
              onChange={(e) => onUpdate({ ...element, splashVideoOpacity: Number(e.target.value) })}
              className="w-full h-1.5 rounded-lg bg-slate-800 accent-purple-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* PROPORTIONAL RESIZER TOOL */}
      {sizeMode === 'proportional' && (
        <div className="space-y-3 rounded-lg border border-purple-500/30 bg-slate-900/90 p-2.5 text-xs">
          {/* Proportion Presets Row */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium text-slate-300 text-[11px]">Aspect Ratio Proportions</span>
              {/* Lock Proportions Toggle */}
              <button
                type="button"
                onClick={() =>
                  onUpdate({
                    ...element,
                    splashVideoLockProportions: !isLocked,
                  })
                }
                className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold border transition-all ${
                  isLocked
                    ? 'border-cyan-500/40 bg-cyan-950/50 text-cyan-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
                }`}
                title={isLocked ? 'Proportions are locked' : 'Click to lock proportions'}
              >
                {isLocked ? <Lock className="h-3 w-3 text-cyan-400" /> : <Unlock className="h-3 w-3 text-amber-400" />}
                <span>{isLocked ? 'Ratio Locked' : 'Freeform'}</span>
              </button>
            </div>

            {/* Grid of Aspect Ratios */}
            <div className="grid grid-cols-4 gap-1">
              {RATIO_CONFIGS.slice(0, 4).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...element,
                      splashVideoAspectRatio: r.id,
                    })
                  }
                  className={`flex flex-col items-center justify-center rounded-lg py-1.5 px-1 border transition-all ${
                    aspectRatio === r.id
                      ? 'border-purple-500 bg-purple-600/30 text-purple-200 font-bold ring-1 ring-purple-500/40'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[11px] font-mono leading-tight">{r.label}</span>
                  <span className="text-[8px] text-slate-400 leading-tight">{r.desc}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1 mt-1">
              {RATIO_CONFIGS.slice(4).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...element,
                      splashVideoAspectRatio: r.id,
                    })
                  }
                  className={`flex flex-col items-center justify-center rounded-lg py-1 px-1 border transition-all ${
                    aspectRatio === r.id
                      ? 'border-purple-500 bg-purple-600/30 text-purple-200 font-bold ring-1 ring-purple-500/40'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[11px] font-mono leading-tight">{r.label}</span>
                  <span className="text-[8px] text-slate-400 leading-tight">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Proportions Resizer Canvas Simulator Mini-Preview */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-2.5 flex flex-col items-center justify-center select-none">
            <span className="text-[9px] uppercase tracking-wider font-mono text-slate-500 mb-1.5">
              Live Proportion Preview ({aspectRatio})
            </span>
            {/* Phone Screen Mockup Container */}
            <div className="relative w-36 h-48 rounded-xl border-2 border-slate-700 bg-slate-900 overflow-hidden flex flex-col items-center justify-center shadow-inner">
              {/* Notch */}
              <div className="absolute top-1 w-10 h-2 bg-slate-800 rounded-full" />
              
              {/* Motion Video Proportional Container Preview */}
              <div
                style={{
                  width: `${customWidth}%`,
                  borderRadius: `${Math.min(borderRadius, 18)}px`,
                  transform: `scale(${scale / 100})`,
                }}
                className={`relative flex items-center justify-center border border-purple-400/60 bg-gradient-to-tr from-purple-900/80 to-indigo-900/80 transition-all ${
                  aspectRatio === '9:16'
                    ? 'aspect-[9/16] max-h-[80%]'
                    : aspectRatio === '16:9'
                    ? 'aspect-[16/9]'
                    : aspectRatio === '1:1'
                    ? 'aspect-square max-h-[70%]'
                    : aspectRatio === '4:5'
                    ? 'aspect-[4/5] max-h-[75%]'
                    : aspectRatio === '4:3'
                    ? 'aspect-[4/3]'
                    : aspectRatio === '21:9'
                    ? 'aspect-[21/9]'
                    : 'aspect-[3/4]'
                } ${hasGlow ? 'shadow-lg shadow-purple-500/40' : ''}`}
              >
                <div className="flex flex-col items-center justify-center p-1 text-center">
                  <Video className="h-3.5 w-3.5 text-purple-300 animate-pulse" />
                  <span className="font-mono text-[8px] font-bold text-white mt-0.5">{aspectRatio}</span>
                  <span className="text-[7px] text-purple-300 font-mono">{customWidth}% w</span>
                </div>
              </div>

              {/* Bottom Home bar */}
              <div className="absolute bottom-1 w-12 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>

          {/* Width Resizer Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-[11px] text-slate-300">
              <span className="flex items-center gap-1 font-medium">
                <Scaling className="h-3 w-3 text-purple-400" />
                <span>Width Proportion</span>
              </span>
              <div className="flex items-center gap-1.5 font-mono text-purple-300">
                <button
                  type="button"
                  onClick={() => onUpdate({ ...element, splashVideoCustomWidth: Math.max(30, customWidth - 5) })}
                  className="px-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300"
                >
                  -
                </button>
                <span>{customWidth}%</span>
                <button
                  type="button"
                  onClick={() => onUpdate({ ...element, splashVideoCustomWidth: Math.min(100, customWidth + 5) })}
                  className="px-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300"
                >
                  +
                </button>
              </div>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="2"
              value={customWidth}
              onChange={(e) => onUpdate({ ...element, splashVideoCustomWidth: Number(e.target.value) })}
              className="w-full h-1.5 rounded-lg bg-slate-800 accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Scale Multiplier Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-[11px] text-slate-300">
              <span>Zoom Scale</span>
              <span className="font-mono text-purple-300">{scale}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="140"
              step="5"
              value={scale}
              onChange={(e) => onUpdate({ ...element, splashVideoScale: Number(e.target.value) })}
              className="w-full h-1.5 rounded-lg bg-slate-800 accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Object Fit & Alignment */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">Video Fit</label>
              <select
                value={fit}
                onChange={(e) => onUpdate({ ...element, splashVideoFit: e.target.value as any })}
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-1.5 py-1 text-[11px] text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="cover">Cover (Crop)</option>
                <option value="contain">Contain (Box)</option>
                <option value="fill">Fill (Stretch)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">Alignment</label>
              <select
                value={alignment}
                onChange={(e) => onUpdate({ ...element, splashVideoAlignment: e.target.value as any })}
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-1.5 py-1 text-[11px] text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="center">Center</option>
                <option value="top">Top Header</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </div>

          {/* Corner Radius & Ambient Glow */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400">
                <span>Corner Radius</span>
                <span className="font-mono text-purple-300">{borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="36"
                step="4"
                value={borderRadius}
                onChange={(e) => onUpdate({ ...element, splashVideoBorderRadius: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg bg-slate-800 accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={hasGlow}
                  onChange={(e) => onUpdate({ ...element, splashVideoGlow: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-0"
                />
                <span>Ambient Glow Aura</span>
              </label>
            </div>
          </div>

          {/* Quick Proportion Presets */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="block text-[10px] font-semibold text-slate-400 mb-1">Quick Presets</span>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => applyPreset('story')}
                className="rounded bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 text-[9px] text-purple-300 font-medium"
              >
                9:16 Reel
              </button>
              <button
                type="button"
                onClick={() => applyPreset('cinema')}
                className="rounded bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 text-[9px] text-blue-300 font-medium"
              >
                16:9 Banner
              </button>
              <button
                type="button"
                onClick={() => applyPreset('square')}
                className="rounded bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 text-[9px] text-amber-300 font-medium"
              >
                1:1 Tile
              </button>
              <button
                type="button"
                onClick={() => applyPreset('island')}
                className="rounded bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 text-[9px] text-emerald-300 font-medium"
              >
                Floating Island
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
