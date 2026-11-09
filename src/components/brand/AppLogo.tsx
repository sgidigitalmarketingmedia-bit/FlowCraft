import React from 'react';

export interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  onBlueBackground?: boolean;
  animated?: boolean;
  showText?: boolean;
  showTagline?: boolean;
  tagline?: string;
  className?: string;
  iconOnly?: boolean;
}

/**
 * FlowCraft Studio Brand Mark & Logo
 * Designed with OneSeven Tech luxury aesthetic:
 * - Vivid Violet (#6B39F4) primary brand color
 * - Deep Obsidian (#08070D) and Electric Violet (#8B5CF6 / #A78BFA) gradients
 * - Geometric faceted origami flow insignia (FlowCraft Wings & Journey Nodes)
 * - Wordmark: "FlowCraft" + "Studio"
 */
export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  onBlueBackground = false,
  animated = false,
  showText = false,
  showTagline = false,
  tagline = 'Next-Gen Mobile UX & Journey Studio',
  className = '',
  iconOnly = false,
}) => {
  const pixelSize =
    typeof size === 'number'
      ? size
      : size === 'xs'
      ? 20
      : size === 'sm'
      ? 26
      : size === 'md'
      ? 36
      : size === 'lg'
      ? 50
      : 68; // 'xl'

  // ID generator for unique SVG gradient IDs
  const uid = React.useId().replace(/:/g, '_');

  const primaryGradient = onBlueBackground
    ? ['#FBBF24', '#F59E0B', '#EF4444'] // Amber-Gold on blue
    : ['#8B5CF6', '#6B39F4', '#4B22B8']; // Vivid Violet -> Deep Indigo

  const accentGradient = onBlueBackground
    ? ['#FFFFFF', '#FEF08A']
    : ['#DDD6FE', '#C084FC']; // Lavender-Violet light

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* FlowCraft Faceted Insignia Container */}
      <div
        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
        className={`relative flex shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
          onBlueBackground
            ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/40 ring-1 ring-amber-300/40'
            : 'bg-gradient-to-br from-[#12101E] via-[#1B1630] to-[#0D0B16] text-white shadow-xl shadow-violet-950/60 border border-violet-500/30 ring-1 ring-white/10'
        } ${animated ? 'hover:scale-105 active:scale-95 hover:border-violet-400/60 hover:shadow-violet-600/30' : ''}`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute inset-0 rounded-xl bg-violet-600/25 blur-sm pointer-events-none -z-10 animate-pulse"
          style={{ opacity: onBlueBackground ? 0 : 0.8 }}
        />

        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-[78%] h-[78%] ${animated ? 'transition-transform duration-500 hover:rotate-2' : ''}`}
        >
          <defs>
            <linearGradient id={`flowCraftPrimary_${uid}`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={primaryGradient[0]} />
              <stop offset="50%" stopColor={primaryGradient[1]} />
              <stop offset="100%" stopColor={primaryGradient[2]} />
            </linearGradient>

            <linearGradient id={`flowCraftAccent_${uid}`} x1="10" y1="38" x2="38" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={accentGradient[0]} />
              <stop offset="100%" stopColor={accentGradient[1]} />
            </linearGradient>

            <filter id={`flowCraftGlow_${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* FlowCraft Origami Facet 1: Primary Flow Vector (Top Wing) */}
          <path
            d="M 12,12 L 36,12 C 39,12 40,15 38,18 L 26,30 L 18,22 L 30,16 L 14,16 Z"
            fill={`url(#flowCraftPrimary_${uid})`}
          />

          {/* FlowCraft Origami Facet 2: Craft Stem & Chevron Vector */}
          <path
            d="M 12,14 L 17,14 L 17,36 L 12,36 Z"
            fill={`url(#flowCraftAccent_${uid})`}
            filter={`url(#flowCraftGlow_${uid})`}
          />

          {/* FlowCraft Origami Facet 3: Dynamic Cross-Flow Fin */}
          <path
            d="M 17,21 L 28,21 L 24,26 L 17,26 Z"
            fill={`url(#flowCraftAccent_${uid})`}
          />

          {/* FlowCraft Node Connection Orbit Dot */}
          <circle
            cx="32"
            cy="32"
            r="3"
            fill={onBlueBackground ? '#FFFFFF' : '#DDD6FE'}
            filter={`url(#flowCraftGlow_${uid})`}
          />

          {/* Subtle connecting spline wire */}
          <path
            d="M 23,29 C 26,33 29,33 32,32"
            stroke={`url(#flowCraftPrimary_${uid})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography: Wordmark & Tagline */}
      {!iconOnly && (showText || showTagline) && (
        <div className="flex flex-col min-w-0">
          {showText && (
            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm sm:text-base font-extrabold tracking-tight whitespace-nowrap transition-colors ${
                  onBlueBackground ? 'text-amber-300 drop-shadow-sm' : 'text-white'
                }`}
              >
                FlowCraft
              </span>
              <span
                className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${
                  onBlueBackground
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-violet-600/25 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-900/30'
                }`}
              >
                Studio
              </span>
            </div>
          )}
          {showTagline && (
            <span
              className={`text-[10px] sm:text-[11px] font-medium tracking-wide whitespace-nowrap truncate max-w-[180px] sm:max-w-none ${
                onBlueBackground ? 'text-amber-200/90' : 'text-slate-400'
              }`}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Dedicated iOS App Icon component for the Simulated iPhone Home Screen.
 * Authentic Apple squircle shape with FlowCraft luxury obsidian and vivid violet styling.
 */
export const IPhoneAppSquircleIcon: React.FC<{
  size?: number;
  label?: string;
  isClicked?: boolean;
  onClick?: () => void;
  badge?: string | number;
  showGlow?: boolean;
}> = ({
  size = 62,
  label = 'FlowCraft',
  isClicked = false,
  onClick,
  badge,
  showGlow = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group flex flex-col items-center gap-1.5 select-none cursor-pointer transition-transform duration-200 ${
        isClicked ? 'scale-90 brightness-90' : 'hover:scale-105 active:scale-95'
      }`}
      style={{ width: `${size + 14}px` }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${Math.round(size * 0.225)}px`,
        }}
        className={`relative flex items-center justify-center bg-gradient-to-br from-[#1E1638] via-[#120F24] to-[#090812] p-2 shadow-2xl shadow-black/80 border border-violet-500/30 overflow-hidden transition-all duration-300 ${
          showGlow ? 'ring-4 ring-violet-500/80 shadow-violet-600/50' : ''
        } ${isClicked ? 'ring-4 ring-white/90 scale-95' : ''}`}
      >
        {/* Apple Gloss Overlay (Curved light reflection) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-[14px]"></div>

        {/* Ambient violet spotlight backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 via-indigo-600/20 to-purple-500/20 blur-sm pointer-events-none"></div>

        {/* FlowCraft Logo */}
        <AppLogo
          size={Math.round(size * 0.72)}
          onBlueBackground={false}
          animated={false}
          iconOnly={true}
        />

        {/* Notification Badge if specified */}
        {badge !== undefined && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white shadow-md border-2 border-[#120F24]">
            {badge}
          </span>
        )}
      </div>

      {/* App Title beneath squircle icon */}
      <span className="text-[11px] font-semibold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate max-w-full text-center">
        {label}
      </span>
    </div>
  );
};
