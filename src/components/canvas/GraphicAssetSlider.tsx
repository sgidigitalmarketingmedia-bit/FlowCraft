import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Image as ImageIcon, ExternalLink, Link2, Sparkles } from 'lucide-react';
import { ElementProperties, SliderSlideItem, CarouselSlideItem, TransitionType } from '../../types/builder';

interface GraphicAssetSliderProps {
  element: ElementProperties;
  isInteractive?: boolean;
  onNavigateScreen?: (targetScreenId: string, transition?: TransitionType, duration?: number) => void;
  onSelectSlide?: (slide: any) => void;
}

export const GraphicAssetSlider: React.FC<GraphicAssetSliderProps> = ({
  element,
  isInteractive = true,
  onNavigateScreen,
  onSelectSlide,
}) => {
  const defaultSlides: (SliderSlideItem | CarouselSlideItem)[] = [
    {
      id: 'default_s1',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      title: 'Season 9: Cyber Void Pass',
      caption: 'Tap to view exclusive armory loadout',
      targetScreenId: element.targetScreenId || 'screen_transfer',
      transition: 'slide-left',
    },
    {
      id: 'default_s2',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      title: 'Holographic Plasma Weapon',
      caption: 'Special edition neon particle finish',
      targetScreenId: element.targetScreenId || 'screen_dashboard',
      transition: 'fade',
    },
    {
      id: 'default_s3',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      title: 'Ranked 5v5 Tournament',
      caption: 'Registrations closing in 2 hours',
      targetScreenId: element.targetScreenId || 'screen_success',
      transition: 'slide-up',
    },
  ];

  // Resolve slides from either carouselSlides or sliderSlides
  const rawSlides = (element.carouselSlides && element.carouselSlides.length > 0)
    ? element.carouselSlides
    : (element.sliderSlides && element.sliderSlides.length > 0)
    ? element.sliderSlides
    : defaultSlides;

  const slides = rawSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Timing & Animation Customization
  const autoPlay = (element.carouselAutoplay ?? element.sliderAutoPlay) !== false;
  const intervalTime = element.carouselInterval || element.sliderInterval || 3000; // Dwell timing pause between slides
  const animationSpeed = element.carouselAnimationSpeed || 500; // How fast the animation slides glide (ms)
  const pauseOnHover = (element.carouselPauseOnHover ?? element.sliderPauseOnHover) !== false;
  const showDots = (element.carouselShowDots ?? element.sliderShowDots) !== false;
  const showArrows = (element.carouselShowArrows ?? element.sliderShowArrows) !== false;
  const sliderHeight = element.carouselHeight || element.sliderHeight || 190;
  const borderRadius = element.carouselBorderRadius ?? element.sliderBorderRadius ?? 16;
  const objectFit = element.carouselObjectFit || element.sliderFit || 'cover';

  // Autoplay ticker with pause control
  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, intervalTime, slides.length]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleSlideClick = (slide: any) => {
    if (onSelectSlide) {
      onSelectSlide(slide);
    }
    const target = slide.targetScreenId || element.targetScreenId;
    if (target && onNavigateScreen) {
      onNavigateScreen(target, slide.transition || element.transition || 'slide-left', slide.transitionDuration || 350);
    } else if (slide.externalUrl) {
      window.open(slide.externalUrl, '_blank');
    }
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        if (pauseOnHover) setIsPaused(true);
      }}
      onTouchEnd={(e) => {
        if (pauseOnHover) setIsPaused(false);
        if (touchStartX.current !== null) {
          const deltaX = e.changedTouches[0].clientX - touchStartX.current;
          if (deltaX > 40) handlePrev();
          if (deltaX < -40) handleNext();
          touchStartX.current = null;
        }
      }}
      style={{
        height: `${sliderHeight}px`,
        borderRadius: `${borderRadius}px`,
      }}
      className="group relative w-full overflow-hidden shadow-xl select-none bg-slate-950 border border-slate-800/90 transition-all"
    >
      {/* Sliding Banner Images Container */}
      <div
        className="flex h-full w-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: `transform ${animationSpeed}ms cubic-bezier(0.25, 1, 0.5, 1)`,
        }}
      >
        {slides.map((slide, sIdx) => {
          const hasLink = !!(slide.targetScreenId || element.targetScreenId || (slide as any).externalUrl);
          return (
            <div
              key={slide.id || `slide_${sIdx}`}
              onClick={() => isInteractive && handleSlideClick(slide)}
              className={`relative h-full w-full shrink-0 overflow-hidden ${
                hasLink ? 'cursor-pointer hover:opacity-95' : ''
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title || 'Banner Slide'}
                className="h-full w-full select-none"
                style={{ objectFit: objectFit as any }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';
                }}
              />

              {/* Gradient Scrim for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Slide text and hyperlink indicator badge */}
              <div className="absolute bottom-3 left-3 right-3 pointer-events-none space-y-1">
                {hasLink && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-blue-600/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white shadow-md border border-blue-400/30">
                    <Link2 className="h-2.5 w-2.5" />
                    <span>Navigate to {slide.targetScreenId ? 'App Screen' : 'Web Link'}</span>
                  </div>
                )}
                {slide.title && (
                  <h4 className="text-xs font-bold text-white drop-shadow-md line-clamp-1">
                    {slide.title}
                  </h4>
                )}
                {((slide as any).subtitle || slide.caption) && (
                  <p className="text-[10px] text-slate-300 drop-shadow line-clamp-1">
                    {(slide as any).subtitle || slide.caption}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous Slide"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-black/90 active:scale-90 z-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next Slide"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-black/90 active:scale-90 z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Pagination Dot Track & Pause Status */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {slides.map((_, dotIdx) => (
            <button
              key={`dot_${dotIdx}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(dotIdx);
              }}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === dotIdx ? 'w-5 bg-white shadow' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              title={`Jump to banner ${dotIdx + 1}`}
            />
          ))}
          {isPaused && (
            <span
              className="ml-1 flex items-center gap-0.5 rounded-full bg-amber-500/90 backdrop-blur-md px-1.5 py-0.2 text-[8px] font-bold text-black uppercase"
              title="Carousel paused on hover"
            >
              Paused
            </span>
          )}
        </div>
      )}

      {/* Slide Index Counter pill */}
      <div className="absolute top-2.5 right-2.5 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono font-bold text-slate-200 border border-white/10 z-10">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
};
