import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, CloudSun, Camera, Phone, Mail, 
  Compass, Music, MessageCircle, Settings, Image as ImageIcon,
  Clock, MapPin, Sparkles, MousePointer, Play, RotateCcw
} from 'lucide-react';
import { IPhoneAppSquircleIcon, AppLogo } from '../brand/AppLogo';

interface IPhoneHomeScreenProps {
  onLaunchApp: () => void;
  appName?: string;
  autoLaunchDelayMs?: number; // defaults to 1500 (1.5s)
  isLandscape?: boolean;
}

export const IPhoneHomeScreen: React.FC<IPhoneHomeScreenProps> = ({
  onLaunchApp,
  appName = 'FlowCraft',
  autoLaunchDelayMs = 1500,
  isLandscape = false,
}) => {
  const [phase, setPhase] = useState<'idle' | 'pause' | 'clicking' | 'launching'>('pause');
  const [timeLeftMs, setTimeLeftMs] = useState<number>(autoLaunchDelayMs);
  const [isManualPaused, setIsManualPaused] = useState<boolean>(false);
  const appIconRef = useRef<HTMLDivElement>(null);

  // Play subtle Apple iOS haptic tap sound using Web Audio API
  const playHapticTapSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext unavailable or blocked by browser policy
    }
  };

  // 1.5-second pause countdown -> click animation -> zoom launch
  useEffect(() => {
    if (isManualPaused || phase === 'launching' || phase === 'idle') return;

    const interval = 50; // update progress every 50ms
    const timer = setInterval(() => {
      setTimeLeftMs((prev) => {
        if (prev <= interval) {
          clearInterval(timer);
          triggerClickSequence();
          return 0;
        }
        return prev - interval;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isManualPaused, phase]);

  // Execute authentic Click -> Launch transition
  const triggerClickSequence = () => {
    setPhase('clicking');
    playHapticTapSound();

    // Icon press depression lasts 260ms, then expands to launch splash screen
    setTimeout(() => {
      setPhase('launching');
      setTimeout(() => {
        onLaunchApp();
      }, 420);
    }, 260);
  };

  const handleManualClick = () => {
    if (phase === 'launching') return;
    triggerClickSequence();
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeLeftMs(autoLaunchDelayMs);
    setPhase('pause');
    setIsManualPaused(false);
  };

  const progressPercent = Math.min(100, Math.max(0, ((autoLaunchDelayMs - timeLeftMs) / autoLaunchDelayMs) * 100));
  const isClicked = phase === 'clicking';
  const isLaunching = phase === 'launching';

  // Current Date for iOS Calendar widget
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dayNum = today.getDate();

  return (
    <div
      className={`relative h-full w-full select-none overflow-hidden flex flex-col justify-between p-3.5 transition-all duration-500 ${
        isLaunching ? 'scale-125 opacity-0 filter blur-sm' : 'scale-100 opacity-100'
      }`}
      style={{
        // iOS 18 Dynamic Mesh Gradient Wallpaper
        background: 'radial-gradient(circle at 50% 20%, #2E1065 0%, #0F172A 50%, #030712 100%)',
      }}
    >
      {/* Ambient Wallpaper Glow Circles */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full bg-indigo-600/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-12 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 left-1/4 h-52 w-52 rounded-full bg-amber-500/15 blur-3xl" />

      {/* TOP FLOATING BANNER: Countdown status & Replay Controls */}
      <div className="relative z-30 flex items-center justify-between rounded-xl bg-slate-900/80 px-2.5 py-1.5 border border-white/10 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span className="text-[10px] font-mono text-slate-200 truncate">
            {phase === 'clicking'
              ? 'Tapping App Icon...'
              : phase === 'launching'
              ? 'Opening Splash Screen...'
              : `Simulating Home Screen • Launch in ${(timeLeftMs / 1000).toFixed(1)}s`}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsManualPaused(!isManualPaused)}
            className="rounded px-1.5 py-0.5 text-[9px] font-semibold text-slate-300 hover:text-white bg-slate-800 border border-slate-700"
            title={isManualPaused ? 'Resume countdown' : 'Pause countdown'}
          >
            {isManualPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={handleReplay}
            className="rounded p-1 text-slate-300 hover:text-white bg-slate-800 border border-slate-700"
            title="Restart 1.5s Home Screen simulation"
          >
            <RotateCcw className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {/* Mini Progress Bar for 1.5s Pause */}
      <div className="relative z-30 -mt-1 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          style={{ width: `${progressPercent}%` }}
          className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 transition-all duration-75 linear"
        />
      </div>

      {/* iOS TOP WIDGETS SECTION */}
      <div className="relative z-20 mt-2 grid grid-cols-2 gap-3">
        {/* Widget 1: Apple Calendar */}
        <div className="flex h-28 flex-col justify-between rounded-2xl bg-white/10 p-3 backdrop-blur-xl border border-white/15 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-red-400 tracking-wider uppercase">{dayName}</span>
            <CalendarIcon className="h-3.5 w-3.5 text-white/60" />
          </div>
          <div>
            <span className="text-3xl font-light tracking-tight">{dayNum}</span>
            <p className="text-[10px] text-white/80 font-medium truncate mt-0.5">Design Prototype</p>
            <p className="text-[9px] text-white/50">10:00 AM - 11:30 AM</p>
          </div>
        </div>

        {/* Widget 2: Weather */}
        <div className="flex h-28 flex-col justify-between rounded-2xl bg-gradient-to-br from-blue-500/25 to-indigo-600/25 p-3 backdrop-blur-xl border border-white/15 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-white/80">San Francisco</span>
            <CloudSun className="h-4 w-4 text-amber-300" />
          </div>
          <div>
            <span className="text-3xl font-light">72°</span>
            <p className="text-[10px] text-white/80 font-medium mt-0.5">Mostly Sunny</p>
            <p className="text-[9px] text-white/50">H: 76° · L: 58°</p>
          </div>
        </div>
      </div>

      {/* iOS APP ICONS GRID */}
      <div className="relative z-20 my-auto grid grid-cols-4 gap-y-4 gap-x-2 pt-2 px-1">
        {/* App 1: THE NEW FEATURED APP (FlowCraft Pro / From Idea to Automated) */}
        <div ref={appIconRef} className="relative flex flex-col items-center">
          {/* Simulated Touch/Cursor Finger during auto-click */}
          {phase === 'pause' && (
            <div className="pointer-events-none absolute -bottom-1 -right-1 z-40 flex items-center gap-1 rounded-full bg-amber-400 text-slate-950 px-1.5 py-0.5 text-[8px] font-bold shadow-lg animate-bounce">
              <MousePointer className="h-2.5 w-2.5 fill-current" />
              <span>Tap</span>
            </div>
          )}

          {/* Ripple Wave when clicked */}
          {isClicked && (
            <div className="pointer-events-none absolute inset-0 -m-3 rounded-3xl bg-amber-400/40 animate-ping z-30" />
          )}

          <IPhoneAppSquircleIcon
            size={56}
            label={appName}
            isClicked={isClicked}
            onClick={handleManualClick}
            badge="1"
            showGlow={true}
          />
        </div>

        {/* Standard iOS Apps for Authentic Simulation */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-md border border-white/20">
            <Compass className="h-7 w-7" />
          </div>
          <span className="text-[10px] font-medium text-white drop-shadow">Safari</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-b from-amber-400 via-rose-400 to-purple-500 text-white shadow-md border border-white/20">
            <ImageIcon className="h-7 w-7" />
          </div>
          <span className="text-[10px] font-medium text-white drop-shadow">Photos</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-b from-slate-700 to-slate-900 text-white shadow-md border border-white/20">
            <Camera className="h-7 w-7" />
          </div>
          <span className="text-[10px] font-medium text-white drop-shadow">Camera</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-md border border-white/20">
            <MessageCircle className="h-7 w-7" />
          </div>
          <span className="text-[10px] font-medium text-white drop-shadow">Messages</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-b from-rose-500 to-red-600 text-white shadow-md border border-white/20">
            <Music className="h-7 w-7" />
          </div>
          <span className="text-[10px] font-medium text-white drop-shadow">Music</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-b from-sky-400 to-blue-500 text-white shadow-md border border-white/20">
            <MapPin className="h-7 w-7" />
          </div>
          <span className="text-[10px] font-medium text-white drop-shadow">Maps</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-b from-slate-500 to-slate-700 text-white shadow-md border border-white/20">
            <Settings className="h-7 w-7" />
          </div>
          <span className="text-[10px] font-medium text-white drop-shadow">Settings</span>
        </div>
      </div>

      {/* iOS SCREEN PAGINATION DOTS */}
      <div className="relative z-20 flex justify-center items-center gap-1.5 py-1">
        <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
      </div>

      {/* iOS FROSTED GLASS DOCK */}
      <div className="relative z-20 mx-auto w-full max-w-[320px] rounded-[28px] bg-white/15 px-4 py-2.5 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-around">
        <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-md border border-white/20">
          <Phone className="h-6 w-6" />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-md border border-white/20">
          <Mail className="h-6 w-6" />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-md border border-white/20">
          <Compass className="h-6 w-6" />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-gradient-to-b from-pink-500 to-rose-600 text-white shadow-md border border-white/20">
          <Music className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
