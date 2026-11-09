import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, Smartphone, ChevronLeft, ChevronRight, Bell, Sparkles, 
  Check, RefreshCw, Send, Home, CreditCard, Settings, ShieldCheck, 
  Lock, ArrowRight, ArrowDownLeft, Server, Zap, CheckCircle2, 
  Download, FileText, Layers, ZoomIn, ZoomOut, Maximize2, 
  Scaling, SlidersHorizontal, FastForward, Repeat, Info, Compass,
  Move, RotateCw, Plus, X, GripHorizontal, GripVertical, ArrowDown, Eye, Monitor, Cpu,
  Video, Mic, Camera, Volume2, VolumeX, ImageIcon, CheckSquare, AlertCircle, BarChart3, Users, Star,
  TrendingUp, LineChart, PieChart, Activity, Gauge, Table, Wifi
} from 'lucide-react';
import { Screen, ElementProperties, DevicePreset, FlowConnection, TransitionType } from '../../types/builder';
import { DEVICE_PRESETS } from '../../data/initialProject';
import { AppLogo } from '../brand/AppLogo';
import { IPhoneHomeScreen } from './IPhoneHomeScreen';
import { GraphicAssetSlider } from '../canvas/GraphicAssetSlider';

interface MobileSimulatorProps {
  screens: Screen[];
  connections: FlowConnection[];
  devicePreset: DevicePreset;
  onChangeDevicePreset: (preset: DevicePreset) => void;
  onSelectScreenInCanvas?: (screenId: string) => void;
  onOpenCodeExport?: () => void;
  buildVersion?: number;
  lastBuildTime?: string;
  onExecuteBuild?: () => void;
  isBuilding?: boolean;
  testTransition?: {
    sourceScreenId?: string;
    targetScreenId: string;
    transition?: TransitionType;
    duration?: number;
    easing?: string;
  } | null;
  onClearTestTransition?: () => void;
}

export type DeviceModelId = 'iphone16pro' | 'pixel9' | 'galaxys25';

export interface SimulatedDeviceInstance {
  id: string; // e.g. 'dev_iphone16pro'
  preset: DeviceModelId;
  name: string;
  brand: 'apple' | 'google' | 'samsung';
  tagline: string;
  x: number;
  y: number;
  orientation: 'portrait' | 'landscape';
  currentScreenId: string;
  history: string[];
  isPlaying: boolean;
  playSpeed: number;
  formInputs: Record<string, string>;
  toggleStates: Record<string, boolean>;
  toastMessage: string | null;
  transitionEffect: string;
  transitionDurationMs?: number;
  transitionEasingStr?: string;
  transitionKey?: number;
  isHomeScreenMode?: boolean; // When true, simulates iPhone Home Screen
  activeTransitionFeedback?: {
    transition: string;
    duration: number;
    targetTitle: string;
  } | null;
  simulatedTapPosition: { x: number; y: number; active: boolean };
  zIndex: number;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  screens,
  connections,
  devicePreset,
  onChangeDevicePreset,
  onSelectScreenInCanvas,
  onOpenCodeExport,
  buildVersion = 1,
  lastBuildTime,
  onExecuteBuild,
  isBuilding = false,
  testTransition,
  onClearTestTransition,
}) => {
  const initialScreen = screens.find(s => s.isEntry) || screens[0];
  const initialScreenId = initialScreen?.id || '';

  // Centering & Global Canvas Resizer state
  const stageRef = useRef<HTMLDivElement>(null);
  const [currentScale, setCurrentScale] = useState<number>(0.90);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('9:41');
  const [showDeviceLibrary, setShowDeviceLibrary] = useState<boolean>(true);
  const [activeDeviceId, setActiveDeviceId] = useState<string>('dev_iphone16pro');
  const [highestZIndex, setHighestZIndex] = useState<number>(20);

  // Initialize the 3 Phone Devices on the Canvas
  const [devices, setDevices] = useState<SimulatedDeviceInstance[]>([
    {
      id: 'dev_iphone16pro',
      preset: 'iphone16pro',
      name: 'Apple iPhone 16 Pro',
      brand: 'apple',
      tagline: 'Dynamic Island • 6.3" Super Retina XDR • Titanium',
      x: 40,
      y: 30,
      orientation: 'portrait',
      currentScreenId: initialScreenId,
      history: [initialScreenId],
      isPlaying: false,
      playSpeed: 2500,
      formInputs: {},
      toggleStates: {},
      toastMessage: null,
      transitionEffect: 'animate-in fade-in duration-200',
      isHomeScreenMode: true,
      simulatedTapPosition: { x: 0, y: 0, active: false },
      zIndex: 10,
    },
    {
      id: 'dev_pixel9',
      preset: 'pixel9',
      name: 'Google Pixel 9 Pro',
      brand: 'google',
      tagline: 'Super Actua • Centered Punch Hole • Visor Aesthetic',
      x: 520,
      y: 30,
      orientation: 'portrait',
      currentScreenId: initialScreenId,
      history: [initialScreenId],
      isPlaying: false,
      playSpeed: 2500,
      formInputs: {},
      toggleStates: {},
      toastMessage: null,
      transitionEffect: 'animate-in fade-in duration-200',
      isHomeScreenMode: false,
      simulatedTapPosition: { x: 0, y: 0, active: false },
      zIndex: 11,
    },
    {
      id: 'dev_galaxys25',
      preset: 'galaxys25',
      name: 'Samsung Galaxy S25',
      brand: 'samsung',
      tagline: 'Dynamic AMOLED 2X • Squared Titanium Corners • Ultra-Slim',
      x: 1000,
      y: 30,
      orientation: 'portrait',
      currentScreenId: initialScreenId,
      history: [initialScreenId],
      isPlaying: false,
      playSpeed: 2500,
      formInputs: {},
      toggleStates: {},
      toastMessage: null,
      transitionEffect: 'animate-in fade-in duration-200',
      isHomeScreenMode: false,
      simulatedTapPosition: { x: 0, y: 0, active: false },
      zIndex: 12,
    },
  ]);

  // Which devices are active/spawned on the canvas (defaults to iPhone active)
  const [activeDeviceIds, setActiveDeviceIds] = useState<string[]>(['dev_iphone16pro']);
  const [isDraggingFromLibrary, setIsDraggingFromLibrary] = useState<boolean>(false);
  const [dragOverCanvas, setDragOverCanvas] = useState<boolean>(false);

  // Update clock every 15s
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Compute auto-fit scale based on stage dimensions and number of active devices
  const computeFitScale = useCallback(() => {
    if (!stageRef.current) return 0.95;
    const stageW = stageRef.current.clientWidth;
    const stageH = stageRef.current.clientHeight;

    const activeCount = Math.max(activeDeviceIds.length, 1);
    const approxTotalW = activeCount === 1 ? 420 : activeCount * 440 + 60;
    const approxTotalH = 880;

    const scaleW = (stageW - 40) / approxTotalW;
    const scaleH = (stageH - 60) / approxTotalH;
    const fit = Math.min(scaleW, scaleH);

    return Math.min(Math.max(Number(fit.toFixed(2)), 0.45), 1.15);
  }, [activeDeviceIds.length]);

  useEffect(() => {
    const handleResize = () => {
      if (isAutoFit) {
        const fit = computeFitScale();
        setCurrentScale(fit);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (stageRef.current) {
      observer.observe(stageRef.current);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [isAutoFit, computeFitScale]);

  // Device bringing to front on focus
  const bringDeviceToFront = (devId: string) => {
    setActiveDeviceId(devId);
    setHighestZIndex(prev => {
      const nextZ = prev + 1;
      setDevices(curr => curr.map(d => d.id === devId ? { ...d, zIndex: nextZ } : d));
      return nextZ;
    });
  };

  // Device Dragging state
  const isDraggingDeviceRef = useRef<{ devId: string; startX: number; startY: number; initDevX: number; initDevY: number } | null>(null);

  const handleDeviceMouseDown = (e: React.MouseEvent, devId: string) => {
    // Only drag when clicking on header or bezel, ignore inner inputs/buttons
    bringDeviceToFront(devId);
    setIsAutoFit(false);

    const dev = devices.find(d => d.id === devId);
    if (!dev) return;

    isDraggingDeviceRef.current = {
      devId,
      startX: e.clientX,
      startY: e.clientY,
      initDevX: dev.x,
      initDevY: dev.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingDeviceRef.current) return;
      const { startX, startY, initDevX, initDevY, devId: currentDevId } = isDraggingDeviceRef.current;
      const deltaX = (moveEvent.clientX - startX) / currentScale;
      const deltaY = (moveEvent.clientY - startY) / currentScale;

      setDevices(prev => prev.map(d => {
        if (d.id === currentDevId) {
          return {
            ...d,
            x: Math.round(initDevX + deltaX),
            y: Math.round(initDevY + deltaY),
          };
        }
        return d;
      }));
    };

    const handleMouseUp = () => {
      isDraggingDeviceRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Rotate single device between Portrait & Landscape
  const handleToggleRotateDevice = (devId: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === devId) {
        const nextOrientation = d.orientation === 'portrait' ? 'landscape' : 'portrait';
        return {
          ...d,
          orientation: nextOrientation,
        };
      }
      return d;
    }));
  };

  // Rotate all active devices at once
  const handleRotateAllDevices = () => {
    setDevices(prev => {
      const anyPortrait = prev.some(d => activeDeviceIds.includes(d.id) && d.orientation === 'portrait');
      const target = anyPortrait ? 'landscape' : 'portrait';
      return prev.map(d => activeDeviceIds.includes(d.id) ? { ...d, orientation: target } : d);
    });
  };

  // Auto-arrange all active devices in a neat row
  const handleAutoArrange = () => {
    if (activeDeviceIds.length === 0) return;
    setIsAutoFit(true);
    setDevices(prev => {
      let currentX = 40;
      return prev.map(d => {
        if (activeDeviceIds.includes(d.id)) {
          const spec = DEVICE_PRESETS[d.preset] || DEVICE_PRESETS.iphone16pro;
          const width = d.orientation === 'landscape' ? spec.height : spec.width;
          const assignedX = currentX;
          currentX += width + 70; // 70px gap between phones
          return {
            ...d,
            x: assignedX,
            y: 30,
          };
        }
        return d;
      });
    });
    setTimeout(() => {
      setCurrentScale(computeFitScale());
    }, 50);
  };

  // Show all 3 devices side-by-side
  const handleShowAll3Devices = () => {
    setActiveDeviceIds(['dev_iphone16pro', 'dev_pixel9', 'dev_galaxys25']);
    setIsAutoFit(true);
    setDevices(prev => [
      { ...prev[0], x: 40, y: 30 },
      { ...prev[1], x: 520, y: 30 },
      { ...prev[2], x: 1000, y: 30 },
    ]);
    setTimeout(() => {
      setCurrentScale(computeFitScale());
    }, 50);
  };

  // Spawn or toggle device from library
  const handleToggleDeviceActive = (presetId: DeviceModelId) => {
    const devId = `dev_${presetId}`;
    if (activeDeviceIds.includes(devId)) {
      setActiveDeviceIds(prev => prev.filter(id => id !== devId));
    } else {
      setActiveDeviceIds(prev => [...prev, devId]);
      // Position new device nicely
      const currentActive = devices.filter(d => activeDeviceIds.includes(d.id));
      if (currentActive.length === 0) {
        setDevices(prev => prev.map(d => d.id === devId ? { ...d, x: 60, y: 30 } : d));
      } else {
        const maxX = Math.max(...currentActive.map(d => d.x), 0);
        setDevices(prev => prev.map(d => d.id === devId ? { ...d, x: maxX + 460, y: 30 } : d));
      }
      bringDeviceToFront(devId);
    }
  };

  // Drag-and-drop phone from library to canvas
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!dragOverCanvas) {
      setDragOverCanvas(true);
    }
  };

  const handleCanvasDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverCanvas(true);
  };

  const handleCanvasDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setDragOverCanvas(false);
    }
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverCanvas(false);
    setIsDraggingFromLibrary(false);

    const presetId = e.dataTransfer.getData('text/plain') as DeviceModelId;
    if (!presetId) return;

    const devId = `dev_${presetId}`;
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const scrollLeft = stageRef.current.scrollLeft || 0;
    const scrollTop = stageRef.current.scrollTop || 0;

    const spec = DEVICE_PRESETS[presetId] || DEVICE_PRESETS.iphone16pro;
    const dropX = Math.round(((e.clientX - rect.left) + scrollLeft) / currentScale - (spec.width / 2));
    const dropY = Math.round(((e.clientY - rect.top) + scrollTop) / currentScale - 50);

    const finalX = Math.max(dropX, 40);
    const finalY = Math.max(dropY, 30);

    if (!activeDeviceIds.includes(devId)) {
      setActiveDeviceIds(prev => [...prev, devId]);
    }
    setDevices(prev => prev.map(d => d.id === devId ? { ...d, x: finalX, y: finalY } : d));
    bringDeviceToFront(devId);
  };

  // Individual Device Navigation & Scrubber Handlers
  const handleNavigateDevice = (
    devId: string, 
    targetId: string, 
    transition?: TransitionType | string,
    duration?: number,
    easing?: string
  ) => {
    const targetScreen = screens.find(s => s.id === targetId);
    const durMs = duration || 350;
    const easingVal = easing === 'ease-in-out' 
      ? 'cubic-bezier(0.65, 0, 0.35, 1)'
      : easing === 'spring'
      ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      : easing === 'linear'
      ? 'linear'
      : 'cubic-bezier(0.16, 1, 0.3, 1)';

    // High-performance hardware-accelerated CSS keyframes classes from index.css
    let animClass = 'sim-transition-slide-left';
    if (transition === 'slide-left') animClass = 'sim-transition-slide-left';
    else if (transition === 'slide-right') animClass = 'sim-transition-slide-right';
    else if (transition === 'slide-up') animClass = 'sim-transition-slide-up';
    else if (transition === 'slide-down') animClass = 'sim-transition-slide-down';
    else if (transition === 'fade') animClass = 'sim-transition-fade';
    else if (transition === 'pop') animClass = 'sim-transition-pop';
    else if (transition === 'flip') animClass = 'sim-transition-flip';
    else if (transition === 'bounce') animClass = 'sim-transition-bounce';

    setDevices(prev => prev.map(d => {
      if (d.id === devId) {
        return {
          ...d,
          isHomeScreenMode: false,
          currentScreenId: targetId,
          history: [...d.history, targetId],
          transitionEffect: animClass,
          transitionDurationMs: durMs,
          transitionEasingStr: easingVal,
          transitionKey: (d.transitionKey || 0) + 1,
          activeTransitionFeedback: {
            transition: (transition as string) || 'slide-left',
            duration: durMs,
            targetTitle: targetScreen?.title || 'Screen',
          },
        };
      }
      return d;
    }));

    // Auto-dismiss transition feedback notification HUD after duration + 1s
    setTimeout(() => {
      setDevices(prev => prev.map(d => d.id === devId ? { ...d, activeTransitionFeedback: null } : d));
    }, Math.max(durMs + 900, 1800));
  };

  const handleBackDevice = (devId: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === devId && d.history.length > 1) {
        const newHist = [...d.history];
        newHist.pop();
        const prevScreenId = newHist[newHist.length - 1];
        const prevScreen = screens.find(s => s.id === prevScreenId);
        return {
          ...d,
          isHomeScreenMode: false,
          currentScreenId: prevScreenId,
          history: newHist,
          transitionEffect: 'sim-transition-slide-right',
          transitionDurationMs: 350,
          transitionEasingStr: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transitionKey: (d.transitionKey || 0) + 1,
          activeTransitionFeedback: {
            transition: 'slide-right (back)',
            duration: 350,
            targetTitle: prevScreen?.title || 'Previous Screen',
          },
        };
      }
      return d;
    }));

    setTimeout(() => {
      setDevices(prev => prev.map(d => d.id === devId ? { ...d, activeTransitionFeedback: null } : d));
    }, 1800);
  };

  const handleResetDevice = (devId: string) => {
    const entry = screens.find(s => s.isEntry) || screens[0];
    if (entry) {
      setDevices(prev => prev.map(d => {
        if (d.id === devId) {
          return {
            ...d,
            isHomeScreenMode: false,
            currentScreenId: entry.id,
            history: [entry.id],
            isPlaying: false,
            formInputs: {},
            transitionEffect: 'sim-transition-fade',
            transitionDurationMs: 350,
            transitionEasingStr: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionKey: (d.transitionKey || 0) + 1,
            toastMessage: 'Flow reset to initial entry artboard.',
          };
        }
        return d;
      }));
      setTimeout(() => {
        setDevices(prev => prev.map(d => d.id === devId ? { ...d, toastMessage: null } : d));
      }, 2500);
    }
  };

  const handleStepDeviceToScreen = (devId: string, idx: number) => {
    if (idx >= 0 && idx < screens.length) {
      const target = screens[idx];
      const dev = devices.find(d => d.id === devId);
      const currIdx = screens.findIndex(s => s.id === dev?.currentScreenId);
      const anim = idx > currIdx ? 'slide-left' : 'slide-right';
      handleNavigateDevice(devId, target.id, anim, 350, 'ease-out');
    }
  };

  const handleTogglePlayDevice = (devId: string) => {
    setDevices(prev => prev.map(d => d.id === devId ? { ...d, isPlaying: !d.isPlaying } : d));
  };

  // Listen for live transition test requests from Properties Sidebar
  useEffect(() => {
    if (!testTransition || !testTransition.targetScreenId) return;

    const targetDevId = activeDeviceId || activeDeviceIds[0] || 'dev_iphone16pro';

    // Wake up the active device from home screen mode & determine starting screen
    let startingScreenId = testTransition.sourceScreenId;
    if (!startingScreenId || startingScreenId === testTransition.targetScreenId) {
      const other = screens.find(s => s.id !== testTransition.targetScreenId);
      startingScreenId = other ? other.id : testTransition.targetScreenId;
    }

    setDevices(prev => prev.map(d => {
      if (d.id === targetDevId) {
        return {
          ...d,
          isHomeScreenMode: false,
          currentScreenId: startingScreenId || d.currentScreenId,
        };
      }
      return d;
    }));

    // Trigger target transition after a brief tick so screen mounts cleanly
    const timer = setTimeout(() => {
      handleNavigateDevice(
        targetDevId,
        testTransition.targetScreenId,
        testTransition.transition || 'slide-left',
        testTransition.duration || 350,
        testTransition.easing || 'ease-out'
      );
      onClearTestTransition?.();
    }, 150);

    return () => clearTimeout(timer);
  }, [testTransition]);

  const handleElementInteraction = (devId: string, element: ElementProperties) => {
    const dev = devices.find(d => d.id === devId);
    const currScreenId = dev?.currentScreenId;

    // Check direct element interaction first
    if (element.hasAction) {
      if (element.actionType === 'navigate' && element.targetScreenId) {
        handleNavigateDevice(
          devId, 
          element.targetScreenId, 
          element.transition || 'slide-left',
          element.transitionDuration || 350,
          element.transitionEasing || 'ease-out'
        );
        return;
      } else if (element.actionType === 'back') {
        if (dev && dev.history.length > 1) {
          handleBackDevice(devId);
        } else if (element.targetScreenId) {
          handleNavigateDevice(
            devId,
            element.targetScreenId,
            element.transition || 'slide-right',
            element.transitionDuration || 350,
            element.transitionEasing || 'ease-out'
          );
        } else {
          const entry = screens.find(s => s.isEntry) || screens[0];
          if (entry && entry.id !== currScreenId) {
            handleNavigateDevice(devId, entry.id, 'slide-right', 350, 'ease-out');
          }
        }
        return;
      } else if (element.actionType === 'toast') {
        setDevices(prev => prev.map(d => d.id === devId ? { ...d, toastMessage: element.toastMessage || 'Action performed' } : d));
        setTimeout(() => {
          setDevices(prev => prev.map(d => d.id === devId ? { ...d, toastMessage: null } : d));
        }, 3500);
        return;
      }
    }

    // Check wire connections for this element or screen-level wire
    const conn = connections.find(c => 
      (c.sourceElementId === element.id || (currScreenId && c.sourceScreenId === currScreenId && c.sourceElementId.startsWith('el_screen_'))) &&
      c.targetScreenId
    );

    if (conn) {
      handleNavigateDevice(
        devId,
        conn.targetScreenId,
        conn.transition || element.transition || 'slide-left',
        element.transitionDuration || 350,
        element.transitionEasing || 'ease-out'
      );
      return;
    }
  };

  // Self-Playing automated tour for devices that have isPlaying: true
  useEffect(() => {
    const activeIntervals = devices.map(dev => {
      if (!dev.isPlaying || !activeDeviceIds.includes(dev.id)) return null;

      const interval = setInterval(() => {
        const current = screens.find(s => s.id === dev.currentScreenId);
        const actionElement = current?.elements.find(e => e.hasAction && e.actionType === 'navigate' && e.targetScreenId);
        const currentIdx = screens.findIndex(s => s.id === dev.currentScreenId);

        if (actionElement && actionElement.targetScreenId) {
          handleNavigateDevice(dev.id, actionElement.targetScreenId, actionElement.transition);
        } else {
          const nextIdx = (currentIdx + 1) % screens.length;
          handleNavigateDevice(dev.id, screens[nextIdx].id, 'slide-left');
        }
      }, dev.playSpeed);

      return interval;
    });

    return () => {
      activeIntervals.forEach(inv => inv && clearInterval(inv));
    };
  }, [devices, activeDeviceIds, screens]);

  // Corner Drag Resizer handle for global canvas scale
  const handleCornerDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAutoFit(false);

    const initialY = e.clientY;
    const initialScale = currentScale;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - initialY;
      const newScale = Math.min(Math.max(Number((initialScale + deltaY / 350).toFixed(2)), 0.35), 1.15);
      setCurrentScale(newScale);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#08070D] text-slate-100 select-none overflow-hidden font-sans">
      {/* Top Simulator Control Bar with OneSeven Obsidian Frosted Glass */}
      <div className="flex h-12 shrink-0 w-full items-center justify-between border-b border-violet-500/15 bg-[#090812]/95 px-4 backdrop-blur-2xl gap-2 z-20 overflow-x-auto no-scrollbar whitespace-nowrap shadow-md shadow-black/40">
        {/* Left: Device Library Toggle + Multi-Phone Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Phone Library Drawer Toggle */}
          <button
            onClick={() => setShowDeviceLibrary(!showDeviceLibrary)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition-all ${
              showDeviceLibrary 
                ? 'border-violet-500/50 bg-[#1A1435] text-violet-300 shadow-sm shadow-violet-950/40' 
                : 'border-violet-500/20 bg-[#120F24]/80 text-slate-400 hover:text-slate-200 hover:bg-[#1A1435]'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-violet-400" />
            <span>Library ({activeDeviceIds.length}/3)</span>
          </button>

          {/* Quick Show All 3 Phones button */}
          <button
            onClick={handleShowAll3Devices}
            className={`flex items-center gap-1.5 rounded-xl border border-violet-500/20 px-3 py-1 text-xs font-semibold transition-all ${
              activeDeviceIds.length === 3 
                ? 'bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] text-white shadow-md shadow-violet-600/35 border-violet-400/30' 
                : 'bg-[#120F24]/80 text-slate-400 hover:text-slate-200 hover:bg-[#1A1435]'
            }`}
            title="Display all 3 phone models side-by-side on the canvas"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>All 3</span>
          </button>

          {/* Auto-Arrange / Align button */}
          <button
            onClick={handleAutoArrange}
            className="flex items-center gap-1 rounded-xl border border-violet-500/20 bg-[#120F24]/80 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#1A1435]"
            title="Automatically space active phones side-by-side"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Align</span>
          </button>

          {/* ROTATOR TOOL */}
          <button
            onClick={handleRotateAllDevices}
            className="flex items-center gap-1.5 rounded-xl border border-violet-500/25 bg-[#120F24]/80 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-[#1A1435] transition-colors"
            title="Rotate all active phones between Vertical Portrait and Landscape"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Rotate</span>
          </button>

          {/* GLOBAL SIMULATOR RESIZER TOOL */}
          <div className="flex items-center gap-1.5 rounded-xl border border-violet-500/20 bg-[#120F24]/80 px-2 py-0.5">
            <button
              onClick={() => {
                setIsAutoFit(true);
                setCurrentScale(computeFitScale());
              }}
              title="Auto-Fit phones centered in view"
              className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold transition-all ${
                isAutoFit
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Maximize2 className="h-3 w-3" />
              <span>Fit</span>
            </button>

            <button
              onClick={() => {
                setIsAutoFit(false);
                setCurrentScale(1.0);
              }}
              title="100% 1:1 Native Resolution (Crisp & Readable)"
              className={`rounded-lg px-2 py-0.5 text-xs font-mono font-bold transition-all ${
                !isAutoFit && Math.round(currentScale * 100) === 100
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-[#1A1435] hover:text-white'
              }`}
            >
              100%
            </button>

            <button
              onClick={() => {
                setIsAutoFit(false);
                setCurrentScale(1.25);
              }}
              title="125% Large & Comfortable Scale"
              className={`hidden sm:inline-block rounded-lg px-1.5 py-0.5 text-xs font-mono font-bold transition-all ${
                !isAutoFit && Math.round(currentScale * 100) === 125
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-[#1A1435] hover:text-white'
              }`}
            >
              125%
            </button>

            <button
              onClick={() => {
                setIsAutoFit(false);
                setCurrentScale(prev => Math.max(Number((prev - 0.05).toFixed(2)), 0.35));
              }}
              title="Zoom Out (-5%)"
              className="rounded p-0.5 text-slate-400 hover:bg-[#1A1435] hover:text-white"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>

            <input
              type="range"
              min="40"
              max="150"
              step="1"
              value={Math.round(currentScale * 100)}
              onChange={(e) => {
                setIsAutoFit(false);
                setCurrentScale(Number(e.target.value) / 100);
              }}
              className="h-1.5 w-16 cursor-pointer appearance-none rounded-lg bg-[#201A38] accent-violet-500"
            />

            <button
              onClick={() => {
                setIsAutoFit(false);
                setCurrentScale(prev => Math.min(Number((prev + 0.05).toFixed(2)), 1.50));
              }}
              title="Zoom In (+5%)"
              className="rounded p-0.5 text-slate-400 hover:bg-[#1A1435] hover:text-white"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>

            <span className="min-w-[36px] font-mono text-[11px] font-bold text-violet-300 tabular-nums text-right">
              {Math.round(currentScale * 100)}%
            </span>
          </div>
        </div>

        {/* Right: Export Native Code & PDF Handoff button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCodeExport}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-600/10 hover:bg-rose-600 hover:text-white px-3 py-1 text-xs font-semibold text-rose-300 transition-all shadow-sm"
            title="Export Technical PDF Spec and Native Code"
          >
            <FileText className="h-3.5 w-3.5 text-rose-400" />
            <span>Export Code & PDF</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Stage */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* Collapsible Device Library Tray (Responsive drawer on mobile) */}
        {showDeviceLibrary && (
          <>
            <div 
              onClick={() => setShowDeviceLibrary(false)}
              className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 z-40 md:relative md:inset-auto h-full w-72 border-r border-violet-500/15 bg-[#0C0A18]/95 backdrop-blur-2xl flex flex-col shrink-0 shadow-2xl shadow-black/60">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-blue-400" />
                  Phone Library
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Click or drag phones onto the canvas</p>
              </div>
              <button
                onClick={() => setShowDeviceLibrary(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="p-3 space-y-2.5 overflow-y-auto flex-1">
              {([
                {
                  id: 'iphone16pro',
                  name: 'Apple iPhone 16 Pro',
                  badge: 'iOS 18',
                  desc: 'Dynamic Island • 393×852 px • Titanium Frame',
                  icon: '',
                  color: 'from-orange-500/20 to-blue-500/10 border-orange-500/30',
                },
                {
                  id: 'pixel9',
                  name: 'Google Pixel 9 Pro',
                  badge: 'Android 15',
                  desc: 'Super Actua • 412×915 px • Visor Aesthetic',
                  icon: 'G',
                  color: 'from-emerald-500/20 to-blue-500/10 border-emerald-500/30',
                },
                {
                  id: 'galaxys25',
                  name: 'Samsung Galaxy S25',
                  badge: 'One UI 7',
                  desc: 'Squared Titanium Corners • 384×832 px • Slim Bezel',
                  icon: 'S',
                  color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30',
                },
              ] as const).map(item => {
                const devId = `dev_${item.id}`;
                const isOnCanvas = activeDeviceIds.includes(devId);

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', item.id);
                      e.dataTransfer.effectAllowed = 'copyMove';
                      setIsDraggingFromLibrary(true);
                    }}
                    onDragEnd={() => {
                      setIsDraggingFromLibrary(false);
                      setDragOverCanvas(false);
                    }}
                    className={`group rounded-xl border p-3 bg-gradient-to-br ${item.color} backdrop-blur-sm transition-all cursor-grab active:cursor-grabbing hover:shadow-lg ${
                      isOnCanvas ? 'ring-1 ring-blue-500/50' : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white">
                          {item.icon}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-blue-200 transition-colors">{item.name}</div>
                          <span className="text-[10px] font-semibold text-blue-400">{item.badge}</span>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        isOnCanvas ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isOnCanvas ? 'Active' : 'Standby'}
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] text-slate-400 leading-tight">{item.desc}</p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 group-hover:text-blue-300 transition-colors">
                        Drag onto canvas
                      </span>
                      <button
                        onClick={() => handleToggleDeviceActive(item.id)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                          isOnCanvas
                            ? 'bg-slate-800 text-slate-300 hover:bg-red-950/60 hover:text-red-300'
                            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'
                        }`}
                      >
                        {isOnCanvas ? 'Remove' : '+ Add Phone'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Multi-Device Info Card */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span>Multi-Device Simulator</span>
                <span className="text-emerald-400">Live</span>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-500">
                Each phone moves freely on the canvas, has its own independent journey scrubber, and rotates between vertical and landscape.
              </p>
            </div>
          </div>
        </>
      )}

        {/* Free-Roam Spatial Canvas Viewport (Phones can be moved around freely here) */}
        <div
          ref={stageRef}
          onDragOver={handleCanvasDragOver}
          onDragEnter={handleCanvasDragEnter}
          onDragLeave={handleCanvasDragLeave}
          onDrop={handleCanvasDrop}
          className={`relative flex-1 w-full h-full overflow-auto bg-canvas-dots-dark p-8 transition-colors ${
            dragOverCanvas ? 'ring-4 ring-inset ring-blue-500/60 bg-blue-950/20' : ''
          }`}
        >
          {/* Canvas Floating Top Info Banner */}
          <div className="absolute top-4 left-6 z-20 flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/90 px-4 py-1.5 text-xs text-slate-300 backdrop-blur-md shadow-xl pointer-events-none">
            <div className={`h-2 w-2 rounded-full ${activeDeviceIds.length > 0 ? 'bg-blue-500 animate-pulse' : 'bg-amber-400'}`}></div>
            <span className="font-semibold text-white">Interactive Mobile Workboard</span>
            <span className="text-slate-500">•</span>
            <span className="text-[11px] text-slate-400">
              {activeDeviceIds.length === 0 
                ? '0 of 3 phones on canvas • Drag phones from the library to test your app' 
                : `${activeDeviceIds.length} of 3 phones active • Click & drag phone headers to reposition anywhere`}
            </span>
          </div>

          {/* Drag Over Active Canvas Drop Guide Overlay */}
          {dragOverCanvas && (
            <div className="absolute inset-4 pointer-events-none z-50 flex items-center justify-center rounded-3xl border-2 border-dashed border-blue-400 bg-blue-950/40 backdrop-blur-[2px] transition-all">
              <div className="flex items-center gap-3 rounded-2xl border border-blue-400/50 bg-slate-900/95 px-6 py-3.5 shadow-2xl text-blue-300 font-bold text-sm animate-bounce">
                <ArrowDown className="h-5 w-5 text-blue-400" />
                <span>Drop phone anywhere on canvas to place</span>
              </div>
            </div>
          )}

          {/* Scaled Coordinate Container */}
          <div
            style={{
              transform: `scale(${currentScale})`,
              transformOrigin: activeDeviceIds.length > 1 ? 'top left' : 'top center',
              minWidth: activeDeviceIds.length > 1 ? '2400px' : '100%',
              minHeight: activeDeviceIds.length > 1 ? '1600px' : '100%',
              position: 'relative',
            }}
            className="w-full h-full"
          >
            {/* Empty Canvas Workboard Guide (When 0 phones are active on screen) */}
            {activeDeviceIds.length === 0 && (
              <div className="absolute left-16 top-16 max-w-3xl rounded-3xl border-2 border-dashed border-slate-700/80 bg-slate-900/70 p-8 backdrop-blur-md shadow-2xl transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-inner">
                    <Smartphone className="h-7 w-7 text-blue-400" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                      +
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Choose & Drag a Phone to Begin
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 max-w-md leading-relaxed">
                    Select a smartphone model from the <span className="text-blue-400 font-semibold">Phone Library</span> on the left and drag it onto this canvas, or click a model below to place it instantly.
                  </p>

                  {/* Preset Cards to Drag or Click */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full text-left">
                    {[
                      {
                        id: 'iphone16pro',
                        name: 'Apple iPhone 16 Pro',
                        badge: 'iOS 18',
                        desc: 'Dynamic Island • 393×852 px • Titanium Frame',
                        icon: '',
                        color: 'from-orange-500/15 to-blue-500/10 border-orange-500/30 hover:border-orange-500/60',
                      },
                      {
                        id: 'pixel9',
                        name: 'Google Pixel 9 Pro',
                        badge: 'Android 15',
                        desc: 'Super Actua • 412×915 px • Visor Aesthetic',
                        icon: 'G',
                        color: 'from-emerald-500/15 to-blue-500/10 border-emerald-500/30 hover:border-emerald-500/60',
                      },
                      {
                        id: 'galaxys25',
                        name: 'Samsung Galaxy S25',
                        badge: 'One UI 7',
                        desc: 'Squared Titanium Corners • 384×832 px • Slim Bezel',
                        icon: 'S',
                        color: 'from-purple-500/15 to-indigo-500/10 border-purple-500/30 hover:border-purple-500/60',
                      },
                    ].map(item => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', item.id);
                          e.dataTransfer.effectAllowed = 'copyMove';
                          setIsDraggingFromLibrary(true);
                        }}
                        onDragEnd={() => {
                          setIsDraggingFromLibrary(false);
                          setDragOverCanvas(false);
                        }}
                        className={`group rounded-2xl border bg-gradient-to-br ${item.color} p-4 backdrop-blur-sm cursor-grab active:cursor-grabbing hover:shadow-xl transition-all flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white shadow-sm">
                                {item.icon}
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">{item.name}</h4>
                                <span className="text-[10px] font-semibold text-blue-400">{item.badge}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 group-hover:text-blue-300">
                            <GripVertical className="h-3 w-3 text-slate-500" />
                            Drag to place
                          </span>
                          <button
                            onClick={() => handleToggleDeviceActive(item.id as DeviceModelId)}
                            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all active:scale-95"
                          >
                            + Place
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick action button to spawn all */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={handleShowAll3Devices}
                      className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                    >
                      <Monitor className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Or spawn all 3 phones side-by-side</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Render all active simulated phone devices */}
            {devices
              .filter(dev => activeDeviceIds.includes(dev.id))
              .map(dev => {
                const spec = DEVICE_PRESETS[dev.preset] || DEVICE_PRESETS.iphone16pro;
                const isLandscape = dev.orientation === 'landscape';
                const frameWidth = isLandscape ? spec.height : spec.width;
                const frameHeight = isLandscape ? spec.width : spec.height;
                const currentScreen = screens.find(s => s.id === dev.currentScreenId) || screens[0];
                const currentScreenIndex = screens.findIndex(s => s.id === dev.currentScreenId);

                return (
                  <div
                    key={dev.id}
                    style={{
                      position: 'absolute',
                      left: activeDeviceIds.length === 1 && dev.x === 40 ? 'calc(50% - 208px)' : `${dev.x}px`,
                      top: `${dev.y}px`,
                      width: `${frameWidth + 24}px`,
                      zIndex: dev.zIndex,
                    }}
                    className="flex flex-col select-none transition-shadow"
                  >
                    {/* PHONE HEADER BAR & DRAG HANDLE (User moves mobile device here) */}
                    <div
                      onMouseDown={(e) => handleDeviceMouseDown(e, dev.id)}
                      className={`flex items-center justify-between rounded-t-2xl border border-b-0 border-slate-700/80 bg-slate-900/95 px-3.5 py-2 backdrop-blur-md cursor-grab active:cursor-grabbing transition-colors ${
                        activeDeviceId === dev.id ? 'ring-2 ring-blue-500/60' : ''
                      }`}
                      title="Click and drag to move this phone anywhere on the canvas"
                    >
                      <div className="flex items-center gap-2">
                        <GripHorizontal className="h-4 w-4 text-slate-400" />
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                          {dev.brand === 'apple' ? '' : dev.brand === 'google' ? 'G' : 'S'}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{dev.name}</span>
                            <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-medium text-slate-400 uppercase">
                              {dev.orientation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5" onMouseDown={(e) => e.stopPropagation()}>
                        {/* Orientation Rotator tool right on device */}
                        <button
                          onClick={() => handleToggleRotateDevice(dev.id)}
                          className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-semibold text-amber-300 hover:bg-slate-700 transition-colors"
                          title="Rotate between Portrait and Landscape"
                        >
                          <RotateCw className="h-3 w-3" />
                          <span>{isLandscape ? 'Portrait' : 'Landscape'}</span>
                        </button>

                        {/* Close/Remove device button */}
                        <button
                          onClick={() => setActiveDeviceIds(prev => prev.filter(id => id !== dev.id))}
                          className="rounded-lg p-1 text-slate-400 hover:bg-red-950/60 hover:text-red-300 transition-colors"
                          title="Remove phone from canvas"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* VIRTUAL SMARTPHONE HARDWARE CHASSIS */}
                    <div
                      style={{
                        width: `${frameWidth}px`,
                        height: `${frameHeight}px`,
                        borderRadius: `${isLandscape ? Math.max(spec.cornerRadius - 8, 24) : spec.cornerRadius}px`,
                      }}
                      className={`relative mx-auto flex flex-col overflow-hidden border-[10px] ${
                        dev.brand === 'apple' 
                          ? 'border-slate-800 ring-1 ring-slate-700 shadow-2xl' 
                          : dev.brand === 'google'
                          ? 'border-slate-800 ring-1 ring-emerald-500/20 shadow-2xl'
                          : 'border-slate-800 ring-1 ring-purple-500/20 shadow-2xl'
                      } bg-slate-950 select-none shrink-0 transition-all duration-300`}
                    >
                      {/* Metallic Bezel Highlight */}
                      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 z-40"></div>

                      {/* Top Status Bar & Notch (Adapts in Landscape and Portrait) */}
                      <div className="relative z-50 flex items-center justify-between px-6 pt-3 pb-2 text-xs font-semibold text-slate-200">
                        <span className="font-mono text-xs font-bold tracking-tight">{currentTime}</span>

                        {/* Notch / Punch-hole based on brand & orientation */}
                        {spec.notchType === 'island' ? (
                          <div className={`group flex ${isLandscape ? 'h-5 w-24' : 'h-6 w-28'} items-center justify-between rounded-full bg-black px-2 shadow-inner ring-1 ring-white/10 transition-all hover:w-36`}>
                            <div className="h-2 w-2 rounded-full bg-slate-900"></div>
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                iOS 18
                              </span>
                            </div>
                          </div>
                        ) : dev.brand === 'google' ? (
                          <div className="h-3.5 w-3.5 rounded-full bg-black ring-1 ring-slate-800 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-900/60"></div>
                          </div>
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-black ring-1 ring-slate-900"></div>
                        )}

                        {/* Status Icons */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <span className="text-[10px] font-bold">5G</span>
                          <div className="h-2.5 w-4 rounded-sm border border-slate-300 p-0.5">
                            <div className="h-full w-full bg-slate-200"></div>
                          </div>
                        </div>
                      </div>

                      {/* Screen Content Viewport (Adapts layout in Landscape) */}
                      <div
                        style={{ backgroundColor: dev.isHomeScreenMode ? '#000000' : (currentScreen?.backgroundColor || '#0F172A') }}
                        className={`relative flex-1 overflow-y-auto overflow-x-hidden text-slate-100 flex flex-col justify-between ${
                          dev.isHomeScreenMode || currentScreen?.elements.some(e => e.type === 'splash_screen') ? 'p-0 overflow-hidden' : 'px-5 py-2'
                        }`}
                      >
                        {/* If in Home Screen Simulation Mode, show authentic iPhone 18 Home Screen with Logo and 1.5s auto-click */}
                        {dev.isHomeScreenMode ? (
                          <div className="h-full w-full">
                            <IPhoneHomeScreen
                              appName="FlowCraft"
                              autoLaunchDelayMs={1500}
                              isLandscape={isLandscape}
                              onLaunchApp={() => {
                                setDevices(prev => prev.map(d => d.id === dev.id ? {
                                  ...d,
                                  isHomeScreenMode: false,
                                  currentScreenId: initialScreenId,
                                  transitionEffect: 'sim-transition-pop',
                                  transitionDurationMs: 400,
                                  transitionEasingStr: 'cubic-bezier(0.16, 1, 0.3, 1)',
                                  transitionKey: (d.transitionKey || 0) + 1,
                                } : d));
                              }}
                            />
                          </div>
                        ) : (
                          <>
                            {/* Animated Active Screen with Hardware Acceleration */}
                            <div 
                              key={`${dev.id}_${dev.currentScreenId}_${dev.transitionKey || 0}`} 
                              className={`flex-1 ${dev.transitionEffect || 'sim-transition-fade'}`}
                              style={{
                                '--sim-duration': `${dev.transitionDurationMs || 350}ms`,
                                '--sim-easing': dev.transitionEasingStr || 'cubic-bezier(0.16, 1, 0.3, 1)',
                              } as React.CSSProperties}
                            >
                              {currentScreen ? (
                                <div className={`space-y-3 pb-4 ${isLandscape ? 'grid grid-cols-2 gap-3 space-y-0' : ''}`}>
                                  {currentScreen.elements.map((el, elIdx) => (
                                    <div key={`dev_el_${dev.id}_${currentScreen.id}_${el.id}_${elIdx}`} className={isLandscape && (el.type === 'tabbar' || el.type === 'header') ? 'col-span-2' : ''}>
                                      <SimulatorElementRenderer
                                        el={el}
                                        onInteract={() => handleElementInteraction(dev.id, el)}
                                        onBack={() => handleBackDevice(dev.id)}
                                        onToast={(msg) => {
                                          setDevices(prev => prev.map(d => d.id === dev.id ? { ...d, toastMessage: msg } : d));
                                          setTimeout(() => setDevices(prev => prev.map(d => d.id === dev.id ? { ...d, toastMessage: null } : d)), 3000);
                                        }}
                                        formInputs={dev.formInputs}
                                        setFormInputs={(updater) => {
                                          setDevices(prev => prev.map(d => {
                                            if (d.id === dev.id) {
                                              const next = typeof updater === 'function' ? updater(d.formInputs) : updater;
                                              return { ...d, formInputs: next };
                                            }
                                            return d;
                                          }));
                                        }}
                                        toggleStates={dev.toggleStates}
                                        setToggleStates={(updater) => {
                                          setDevices(prev => prev.map(d => {
                                            if (d.id === dev.id) {
                                              const next = typeof updater === 'function' ? updater(d.toggleStates) : updater;
                                              return { ...d, toggleStates: next };
                                            }
                                            return d;
                                          }));
                                        }}
                                        onNavigateScreen={(targetId, transition, duration, easing) => handleNavigateDevice(dev.id, targetId, transition || 'slide-left', duration, easing)}
                                        connections={connections}
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex h-64 items-center justify-center text-xs text-slate-500">
                                  Screen empty.
                                </div>
                              )}
                            </div>

                            {/* In-app Toast Banner */}
                            {dev.toastMessage && (
                              <div className="absolute top-14 left-4 right-4 z-50 rounded-2xl bg-slate-900/95 border border-slate-700 p-3 shadow-2xl backdrop-blur-md text-xs text-white flex items-center gap-2.5 animate-in slide-in-from-top-3">
                                <Bell className="h-4 w-4 text-blue-400 shrink-0" />
                                <span className="flex-1 font-medium">{dev.toastMessage}</span>
                              </div>
                            )}

                            {/* Interactive Transition Feedback HUD Pill */}
                            {dev.activeTransitionFeedback && (
                              <div className="pointer-events-none absolute bottom-12 left-3 right-3 z-50 flex items-center justify-center animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <div className="flex items-center gap-2 rounded-full border border-indigo-400/60 bg-slate-950/95 px-3.5 py-1.5 shadow-2xl backdrop-blur-md">
                                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping shrink-0"></span>
                                  <span className="text-[10px] font-mono font-bold text-indigo-200 uppercase tracking-tight truncate flex items-center gap-1.5">
                                    <span className="text-white">⚡ {dev.activeTransitionFeedback.transition}</span>
                                    <span className="text-indigo-400 font-normal">({dev.activeTransitionFeedback.duration}ms)</span>
                                    <span className="opacity-60">→</span>
                                    <span className="text-emerald-300 truncate">{dev.activeTransitionFeedback.targetTitle}</span>
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Home Bar Indicator (Tapping returns to iPhone Home Screen) */}
                      <div className="relative z-50 flex justify-center pb-2 pt-1 bg-transparent">
                        <div 
                          onClick={() => {
                            setDevices(prev => prev.map(d => d.id === dev.id ? {
                              ...d,
                              isHomeScreenMode: true,
                              transitionEffect: 'animate-in fade-in duration-300'
                            } : d));
                          }}
                          className={`h-1 ${isLandscape ? 'w-44' : 'w-32'} rounded-full bg-slate-400/50 hover:bg-slate-200 transition-colors cursor-pointer`}
                          title="Click Home Bar to return to iPhone Home Screen"
                        />
                      </div>
                    </div>

                    {/* DEDICATED JOURNEY SCRUBBER DOCKED UNDERNEATH THIS PHONE */}
                    <div className="mt-2 rounded-2xl border border-slate-800 bg-slate-900/95 p-3 backdrop-blur-md shadow-xl flex flex-col gap-2">
                      {/* Scrubber Top Controls Row */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setDevices(prev => prev.map(d => d.id === dev.id ? {
                                ...d,
                                isHomeScreenMode: true,
                                transitionEffect: 'animate-in fade-in duration-300'
                              } : d));
                            }}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-sm"
                            title="Simulate iPhone Home Screen (1.5s pause, icon click animation, splash launch)"
                          >
                            <Sparkles className="h-3 w-3 text-amber-400" />
                            <span>Home (1.5s)</span>
                          </button>

                          <button
                            onClick={() => handleTogglePlayDevice(dev.id)}
                            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                              dev.isPlaying 
                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {dev.isPlaying ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                            <span>{dev.isPlaying ? 'Pause' : 'Tour'}</span>
                          </button>

                          <button
                            onClick={() => handleResetDevice(dev.id)}
                            title="Reset to entry screen"
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </button>

                          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800 text-[10px] font-semibold text-slate-300">
                            <button
                              onClick={() => handleStepDeviceToScreen(dev.id, currentScreenIndex - 1)}
                              disabled={currentScreenIndex <= 0}
                              className="text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                            <span>Step {currentScreenIndex + 1}/{screens.length}</span>
                            <button
                              onClick={() => handleStepDeviceToScreen(dev.id, currentScreenIndex + 1)}
                              disabled={currentScreenIndex >= screens.length - 1}
                              className="text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Active Screen Title & Route */}
                        <div className="text-right truncate max-w-[170px]">
                          <span className="font-semibold text-white text-[11px] truncate block">{currentScreen?.title}</span>
                          <span className="font-mono text-[9px] text-slate-500 block truncate">{currentScreen?.route}</span>
                        </div>
                      </div>

                      {/* Screen Step Scrubber Buttons */}
                      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 pt-1">
                        {screens.map((s, idx) => (
                          <button
                            key={`dev_${dev.id}_scrub_${s.id}_${idx}`}
                            onClick={() => handleStepDeviceToScreen(dev.id, idx)}
                            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold shrink-0 transition-all ${
                              s.id === dev.currentScreenId
                                ? 'bg-blue-600 text-white shadow-sm font-bold'
                                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            <span>{idx + 1}.</span>
                            <span className="truncate max-w-[70px]">{s.title.replace(/^\d+\.\s*/, '')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Interactive Drag Resizer Handle for the entire simulator pinned bottom-right */}
          <div
            onMouseDown={handleCornerDragStart}
            title="Click and drag to scale the entire simulator viewport"
            className="fixed bottom-6 right-6 z-50 flex h-9 w-9 cursor-nwse-resize items-center justify-center rounded-full border-2 border-slate-700 bg-blue-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform"
          >
            <Scaling className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Element Renderer inside Simulator ---------------- */
function SimulatorElementRenderer({
  el,
  onInteract,
  onBack,
  onToast,
  formInputs,
  setFormInputs,
  toggleStates,
  setToggleStates,
  onNavigateScreen,
  connections = [],
}: {
  el: ElementProperties;
  onInteract: () => void;
  onBack: () => void;
  onToast: (msg: string) => void;
  formInputs: Record<string, string>;
  setFormInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  toggleStates: Record<string, boolean>;
  setToggleStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onNavigateScreen: (screenId: string, transition?: TransitionType, duration?: number, easing?: string) => void;
  connections?: FlowConnection[];
}) {
  const hasInteractiveLink = el.hasAction || connections.some(c => c.sourceElementId === el.id);

  switch (el.type) {
    case 'header':
      return (
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 pt-1">
          <div className="flex items-center gap-2">
            {el.hasAction && (
              <button
                onClick={onBack}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">{el.label}</h2>
              {el.helperText && <p className="text-[11px] text-slate-400">{el.helperText}</p>}
            </div>
          </div>
          <button
            onClick={() => onToast('Notifications are up to date')}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      );

    case 'button': {
      const variantClass = el.variant === 'primary'
        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 active:scale-[0.98]'
        : el.variant === 'outline'
        ? 'border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 active:scale-[0.98]'
        : el.variant === 'ghost'
        ? 'text-slate-400 hover:text-white hover:bg-slate-800/40'
        : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-[0.98]';

      const customBgStyle = el.bg ? { backgroundColor: el.bg } : undefined;

      return (
        <button
          onClick={onInteract}
          style={customBgStyle}
          className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all shadow-md ${variantClass}`}
        >
          <span className="truncate">{el.label}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            {el.hasAction && el.transition && (
              <span className="rounded bg-black/30 border border-white/10 px-1.5 py-0.5 text-[9px] font-mono text-white/90 group-hover:bg-black/50 transition-colors">
                {el.transition}
              </span>
            )}
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </button>
      );
    }

    case 'input':
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-300">{el.label}</label>
          <input
            type={el.inputType || 'text'}
            value={formInputs[el.id] !== undefined ? formInputs[el.id] : (el.value || '')}
            onChange={(e) => setFormInputs({ ...formInputs, [el.id]: e.target.value })}
            placeholder={el.placeholder || 'Enter value...'}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {el.helperText && <p className="text-[10px] text-slate-400">{el.helperText}</p>}
        </div>
      );

    case 'card':
      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : undefined}
          className={`rounded-2xl border border-slate-800 bg-slate-800/50 p-3.5 backdrop-blur-sm transition-all ${
            hasInteractiveLink ? 'cursor-pointer hover:border-blue-500/50 hover:bg-slate-800/70 active:scale-[0.98] ring-1 ring-blue-500/20' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400 shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-white">{el.label}</h4>
                {hasInteractiveLink && el.transition && (
                  <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {el.transition}
                  </span>
                )}
              </div>
              {el.helperText && <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed">{el.helperText}</p>}
            </div>
          </div>
        </div>
      );

    case 'metric':
      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : undefined}
          className={`rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-4 transition-all ${
            hasInteractiveLink ? 'cursor-pointer hover:border-indigo-500/50 active:scale-[0.98]' : ''
          }`}
        >
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{el.label}</span>
          <div className="mt-1 font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
            {el.metricValue || '$0.00'}
          </div>
          {el.metricChange && (
            <div className="mt-1 text-xs font-semibold text-emerald-400">{el.metricChange}</div>
          )}
        </div>
      );

    case 'list_item':
      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : undefined}
          className={`flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-800/30 p-3 transition-colors ${
            hasInteractiveLink ? 'cursor-pointer hover:bg-slate-800/60 hover:border-blue-500/40 active:scale-[0.98]' : ''
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-slate-700/60 p-2 text-slate-300">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{el.label}</div>
              {el.helperText && <div className="text-[10px] text-slate-400">{el.helperText}</div>}
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-white tabular-nums">{el.metricValue}</span>
        </div>
      );

    case 'carousel':
    case 'asset_slider':
      return (
        <div className="w-full">
          <GraphicAssetSlider
            element={el}
            isInteractive={true}
            onNavigateScreen={(targetId, transition, duration) => {
              onNavigateScreen(targetId, transition || el.transition || 'slide-left', duration || 350);
            }}
          />
        </div>
      );

    case 'image_banner': {
      const isFullscreen = el.imageSizeMode === 'fullscreen';
      const customHeight = el.imageCustomHeight || (isFullscreen ? 180 : 130);

      return (
        <div 
          onClick={() => {
            if (el.imageAllowFullscreenModal) {
              onToast('Image lightbox expanded');
            }
            if (hasInteractiveLink) onInteract();
          }}
          style={{ height: `${customHeight}px`, borderRadius: `${el.imageBorderRadius ?? 16}px` }}
          className={`relative w-full overflow-hidden border border-slate-800 transition-all ${
            hasInteractiveLink || el.imageAllowFullscreenModal ? 'cursor-pointer hover:border-blue-500/50 hover:shadow-lg active:scale-[0.98]' : ''
          }`}
        >
          <img
            src={el.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
            alt={el.label}
            style={{ objectFit: (el.imageFit || 'cover') as any }}
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate max-w-[180px]">{el.label}</span>
              {el.imageAllowFullscreenModal && (
                <span className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[8px] text-cyan-300 border border-white/10 flex items-center gap-1">
                  <Maximize2 className="h-2.5 w-2.5" /> Fullscreen
                </span>
              )}
            </div>
            {el.helperText && <span className="text-[10px] text-slate-300 line-clamp-1">{el.helperText}</span>}
          </div>
        </div>
      );
    }

    case 'shape': {
      const kind = el.shapeKind || 'rectangle';
      const fill = el.bg || '#1E293B';
      const stroke = el.shapeStroke || '#3B82F6';
      const strokeW = el.shapeStrokeWidth || 1;

      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : undefined}
          style={{
            backgroundColor: kind === 'line' ? 'transparent' : fill,
            borderColor: stroke,
            borderWidth: `${strokeW}px`,
            borderRadius: kind === 'circle' ? '9999px' : '12px',
            height: kind === 'circle' ? '56px' : kind === 'line' ? '2px' : '48px',
            width: kind === 'circle' ? '56px' : '100%',
          }}
          className={`flex items-center justify-center p-2 text-xs font-medium text-slate-200 shadow-sm ${
            kind === 'circle' ? 'mx-auto' : ''
          } ${hasInteractiveLink ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''}`}
        >
          <span className="text-[10px] text-slate-300 truncate">{el.label || `Vector ${kind}`}</span>
        </div>
      );
    }

    case 'avatar_group': {
      const urls = el.avatarUrls || [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
      ];
      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : () => onToast('Team collaborators active')}
          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 cursor-pointer hover:bg-slate-800/80 transition-colors"
        >
          <div className="flex items-center -space-x-2">
            {urls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Avatar"
                className="h-7 w-7 rounded-full border-2 border-slate-900 object-cover"
              />
            ))}
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-[10px] font-bold text-slate-300">
              +4
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-300">{el.label || 'Team Active'}</span>
        </div>
      );
    }

    case 'progress_bar': {
      const pct = el.progressPercent ?? 68;
      return (
        <div className="space-y-1 w-full rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold text-slate-300">{el.label || 'Progress'}</span>
            <span className="font-mono font-bold text-blue-400">{pct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div 
              style={{ width: `${pct}%` }} 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
            />
          </div>
        </div>
      );
    }

    case 'segmented_control': {
      const opts = el.segmentedOptions || ['1D', '1W', '1M', '1Y', 'ALL'];
      const activeIdx = el.segmentedActiveIndex ?? 2;
      return (
        <div className="flex w-full items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-[10px]">
          {opts.map((opt, oIdx) => (
            <button
              key={opt}
              type="button"
              onClick={() => onToast(`Selected ${opt} view`)}
              className={`flex-1 py-1 text-center rounded-lg font-semibold transition-all ${
                oIdx === activeIdx
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }

    case 'checkbox':
      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : undefined}
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-2.5 cursor-pointer hover:bg-slate-800/60"
        >
          <div className="flex h-4 w-4 items-center justify-center rounded border border-blue-500 bg-blue-600 text-white">
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
          <span className="text-xs text-slate-300">{el.label}</span>
        </div>
      );

    case 'alert_banner':
      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : undefined}
          className="flex items-start gap-2.5 rounded-xl border border-blue-500/30 bg-blue-950/20 p-2.5 text-xs text-blue-200"
        >
          <AlertCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-white text-[11px]">{el.alertTitle || 'Notice'}</span>
            <span className="text-[10px] text-slate-300">{el.label}</span>
          </div>
        </div>
      );

    case 'badge':
      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : undefined}
          className={`flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-400 ${
            hasInteractiveLink ? 'cursor-pointer hover:bg-emerald-500/20 active:scale-[0.98]' : ''
          }`}
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{el.label}</span>
        </div>
      );

    case 'toggle': {
      const isChecked = toggleStates[el.id] !== undefined ? toggleStates[el.id] : !!el.toggleChecked;
      return (
        <div
          onClick={() => setToggleStates({ ...toggleStates, [el.id]: !isChecked })}
          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/40 p-3 cursor-pointer hover:bg-slate-800/60 transition-colors"
        >
          <div>
            <div className="text-xs font-medium text-white">{el.label}</div>
            {el.helperText && <div className="text-[10px] text-slate-400">{el.helperText}</div>}
          </div>
          <div className={`h-6 w-11 rounded-full p-0.5 transition-colors ${isChecked ? 'bg-blue-600' : 'bg-slate-700'}`}>
            <div className={`h-5 w-5 rounded-full bg-white transition-transform ${isChecked ? 'translate-x-5' : 'translate-x-0'} shadow`} />
          </div>
        </div>
      );
    }

    case 'tabbar': {
      const tabs = el.tabItems && el.tabItems.length > 0 ? el.tabItems : [
        { id: 'tab_home', label: 'Home', icon: 'home', targetScreenId: 'screen_dashboard' },
        { id: 'tab_send', label: 'Transfer', icon: 'send', targetScreenId: 'screen_transfer' },
        { id: 'tab_cards', label: 'Cards', icon: 'card', targetScreenId: undefined },
        { id: 'tab_security', label: 'Security', icon: 'settings', targetScreenId: 'screen_auth' },
      ];

      return (
        <div className="mt-3 flex items-center justify-around border-t border-slate-800 pt-2 text-slate-400">
          {tabs.map((tab) => {
            const IconComp = tab.icon === 'home' ? Home : tab.icon === 'send' ? Send : tab.icon === 'settings' ? Settings : CreditCard;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.targetScreenId) {
                    onNavigateScreen(tab.targetScreenId, 'slide-left', 300, 'ease-out');
                  } else {
                    onToast(`${tab.label} tab preview active`);
                  }
                }}
                className="flex flex-col items-center gap-0.5 hover:text-white transition-colors"
              >
                <IconComp className="h-4 w-4" />
                <span className="text-[9px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    case 'divider':
      return (
        <div className="my-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="text-[10px] text-slate-500">{el.label || 'or'}</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>
      );

    case 'social_login': {
      const isGoogleOnly = el.socialProvider === 'google';
      const isAppleOnly = el.socialProvider === 'apple';
      const isGithubOnly = el.socialProvider === 'github';

      const handleSocialAction = (provider: string) => {
        onToast(`Authenticated via ${provider}`);
        if (onInteract) onInteract();
      };

      return (
        <div className="space-y-2 w-full">
          {(!isAppleOnly && !isGithubOnly) && (
            <button
              onClick={() => handleSocialAction('Google')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white text-slate-900 py-2.5 px-4 text-xs font-semibold shadow-md active:scale-[0.98] hover:bg-slate-100 transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isGoogleOnly ? el.label : 'Continue with Google'}</span>
            </button>
          )}

          {(!isGoogleOnly && !isGithubOnly) && (
            <button
              onClick={() => handleSocialAction('Apple ID')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black text-white border border-slate-700/80 py-2.5 px-4 text-xs font-semibold shadow-md active:scale-[0.98] hover:bg-slate-900 transition-all"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.04-.49 2.66-1.24z"/>
              </svg>
              <span>{isAppleOnly ? el.label : 'Continue with Apple'}</span>
            </button>
          )}

          {isGithubOnly && (
            <button
              onClick={() => handleSocialAction('GitHub')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#24292F] text-white border border-slate-700/80 py-2.5 px-4 text-xs font-semibold shadow-md active:scale-[0.98] hover:bg-[#1a1f24] transition-all"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span>{el.label || 'Sign in with GitHub'}</span>
            </button>
          )}
        </div>
      );
    }

    case 'form_container': {
      const fields = el.formFields && el.formFields.length > 0 
        ? el.formFields 
        : [
            { id: 'f1', label: 'Work Email', placeholder: 'name@company.com', type: 'email' },
            { id: 'f2', label: 'Password', placeholder: '••••••••', type: 'password' },
          ];

      return (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-4 space-y-2.5 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white tracking-tight">
              {el.formTitle || el.label || 'Form Container'}
            </span>
            <Lock className="h-3.5 w-3.5 text-blue-400" />
          </div>

          <div className="space-y-2">
            {fields.map((f, i) => {
              const fieldKey = `${el.id}_${f.id || i}`;
              const curVal = formInputs[fieldKey] !== undefined ? formInputs[fieldKey] : '';

              return (
                <div key={fieldKey} className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300 block">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={curVal}
                    onChange={(e) => setFormInputs({ ...formInputs, [fieldKey]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-1.5">
            <button
              onClick={() => {
                onToast(`Form "${el.formTitle || el.label}" submitted successfully!`);
                if (onInteract) onInteract();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all"
            >
              <span>{el.formSubmitLabel || 'Submit Form'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {el.formFooterNote && (
            <p className="text-[10px] text-slate-400 text-center pt-0.5">{el.formFooterNote}</p>
          )}
        </div>
      );
    }

    case 'video_player':
    case 'media_placeholder': {
      const mediaType = el.mediaType || 'video';

      if (el.type === 'video_player' || mediaType === 'video') {
        const videoSrc = el.videoUrl || (el.imageUrl?.match(/\.(mp4|webm|mov)$/i) ? el.imageUrl : '') || (el.imageUrl?.startsWith('blob:') ? el.imageUrl : '');
        const isEmbed = videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be') || videoSrc.includes('vimeo.com');

        return (
          <div 
            onClick={() => {
              if (onInteract) onInteract();
            }}
            className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 group shadow-md"
          >
            {videoSrc ? (
              isEmbed ? (
                <iframe
                  src={videoSrc}
                  title={el.label}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <video
                  src={videoSrc}
                  poster={el.videoPoster || el.imageUrl}
                  autoPlay={el.videoAutoplay ?? false}
                  loop={el.videoLoop ?? true}
                  muted={el.videoMuted ?? true}
                  controls={el.videoControls ?? true}
                  playsInline
                  className="h-full w-full object-cover"
                />
              )
            ) : (
              <>
                <img
                  src={el.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
                  alt={el.label}
                  className="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-between p-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] font-bold text-white border border-white/10">
                      HD VIDEO
                    </span>
                    <span className="rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                      {el.mediaDuration || '02:45'}
                    </span>
                  </div>

                  <div className="flex items-center justify-center my-auto">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-xl shadow-blue-500/40 ring-4 ring-white/20 group-hover:scale-110 transition-transform">
                      <Play className="h-5 w-5 fill-white translate-x-0.5" />
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-white block truncate">{el.label}</span>
                    {el.mediaCaption && <p className="text-[10px] text-slate-300 truncate">{el.mediaCaption}</p>}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      }

      if (mediaType === 'document') {
        return (
          <div 
            onClick={() => {
              onToast('Document captured and OCR verified');
              if (onInteract) onInteract();
            }}
            className="relative h-36 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-3.5 flex flex-col justify-between cursor-pointer hover:border-sky-500/50 transition-colors shadow-md"
          >
            <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-sky-400"></div>
            <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-sky-400"></div>
            <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-sky-400"></div>
            <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-sky-400"></div>

            <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_10px_#38bdf8] animate-pulse"></div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono text-sky-400 font-bold">
                <Camera className="h-3.5 w-3.5" /> CAMERA VIEW
              </span>
              <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[9px] font-mono text-sky-300">
                AUTO-CAPTURE
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center my-auto">
              <FileText className="h-7 w-7 text-slate-500 mb-1" />
              <span className="text-xs font-bold text-white">{el.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{el.mediaCaption || 'Center document within viewfinder'}</span>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-medium text-sky-400 hover:underline">Tap to simulate scan capture</span>
            </div>
          </div>
        );
      }

      if (mediaType === 'audio') {
        return (
          <div 
            onClick={() => {
              onToast('Voice note playing...');
              if (onInteract) onInteract();
            }}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-2.5 cursor-pointer hover:border-blue-500/40 transition-colors shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/25">
                  <Play className="h-3.5 w-3.5 fill-white translate-x-0.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{el.label}</span>
                  <span className="text-[10px] text-slate-400">{el.mediaCaption || 'Voice note recording'}</span>
                </div>
              </div>
              <span className="font-mono text-xs text-slate-400">{el.mediaDuration || '00:42'}</span>
            </div>

            <div className="flex items-center justify-between gap-1 h-6 px-1.5 bg-slate-950/70 rounded-lg py-1">
              {[40, 75, 55, 90, 60, 80, 45, 100, 70, 50, 85, 65, 95, 40, 60, 30].map((h, idx) => (
                <div 
                  key={idx} 
                  style={{ height: `${h}%` }} 
                  className={`w-1 rounded-full ${idx < 6 ? 'bg-blue-400' : 'bg-slate-700'}`} 
                />
              ))}
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 p-4 text-center">
          <ImageIcon className="h-7 w-7 text-slate-500 mb-1" />
          <span className="text-xs font-medium text-white">{el.label}</span>
          {el.mediaCaption && <span className="text-[10px] text-slate-400 mt-0.5">{el.mediaCaption}</span>}
        </div>
      );
    }

    case 'splash_screen':
      return (
        <SimulatorSplashScreenRenderer
          el={el}
          onNavigateScreen={onNavigateScreen}
          onToast={onToast}
          onInteract={onInteract}
        />
      );

    case 'kpi_stat': {
      const isBound = el.dataBinding?.enabled;
      const showPulse = isBound && el.dataBinding?.showLivePulse !== false;
      const currency = el.dataBinding?.currencyPrefix || '$';
      const isNegative = (el.metricChange || '').trim().startsWith('-');

      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : () => onToast(`${el.label}: ${el.metricValue || '$148,920.45'}`)}
          className={`rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-4 shadow-lg space-y-2.5 transition-all ${
            hasInteractiveLink ? 'cursor-pointer hover:border-blue-500/50 active:scale-[0.98]' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{el.label}</span>
            {isBound && (
              <span className="flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 text-[9px] font-mono font-bold text-blue-300">
                {showPulse && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />}
                <span>{el.dataBinding?.sourceType === 'live_market_ws' ? 'LIVE WS' : 'DATA BOUND'}</span>
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
              {el.metricValue || `${currency}148,920.45`}
            </div>
            {el.metricChange && (
              <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold font-mono ${
                isNegative 
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              }`}>
                <TrendingUp className={`h-3 w-3 ${isNegative ? 'rotate-180' : ''}`} />
                {el.metricChange}
              </span>
            )}
          </div>
        </div>
      );
    }

    case 'line_chart': {
      const isBound = el.dataBinding?.enabled;
      const showPulse = isBound && el.dataBinding?.showLivePulse !== false;
      const timeframe = el.chartTimeframe || '1M';
      const lineColor = el.chartLineColor || '#3B82F6';
      const showArea = el.chartShowAreaGradient ?? true;
      const showGrid = el.chartShowGrid ?? true;
      const showPoints = el.chartShowPoints ?? true;
      const prefix = el.chartYAxisPrefix || '$';

      const points = el.chartPointsData || [
        { label: 'Mon', value: 142300 },
        { label: 'Tue', value: 144800 },
        { label: 'Wed', value: 143900 },
        { label: 'Thu', value: 146500 },
        { label: 'Fri', value: 147800 },
        { label: 'Sat', value: 147100 },
        { label: 'Sun', value: 148920 },
      ];

      const minVal = Math.min(...points.map(p => p.value));
      const maxVal = Math.max(...points.map(p => p.value));
      const range = maxVal - minVal || 1;

      const width = 330;
      const height = 110;
      const padX = 12;
      const padY = 14;

      const coords = points.map((p, i) => {
        const x = padX + (i / (points.length - 1)) * (width - 2 * padX);
        const y = height - padY - ((p.value - minVal) / range) * (height - 2 * padY);
        return { x, y, ...p };
      });

      const pathD = coords.reduce((acc, curr, idx) => {
        if (idx === 0) return `M ${curr.x} ${curr.y}`;
        const prev = coords[idx - 1];
        const cx1 = prev.x + (curr.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (curr.x - prev.x) / 2;
        const cy2 = curr.y;
        return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
      }, '');

      const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;
      const gradientId = `sim_line_grad_${el.id || 'graph'}`;

      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : undefined}
          className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">{el.label || 'Portfolio Growth'}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {prefix}{points[points.length - 1].value.toLocaleString()} ({timeframe})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {isBound && (
                <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300">
                  {showPulse && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />}
                  <span>{el.dataBinding?.marketTicker || 'LIVE WS'}</span>
                </span>
              )}
            </div>
          </div>

          {/* Timeframe Bar */}
          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-1 border border-slate-800 text-[10px]">
            {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
              <button
                key={tf}
                onClick={(e) => {
                  e.stopPropagation();
                  onToast(`Timeframe switched to ${tf}`);
                }}
                className={`flex-1 py-1 text-center rounded-lg font-mono font-bold transition-all ${
                  tf === timeframe ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* SVG Graph Graphic */}
          <div className="relative w-full overflow-hidden rounded-xl bg-slate-950/70 border border-slate-800/80 p-1">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {showGrid && (
                <g stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3">
                  <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} opacity="0.4" />
                  <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} opacity="0.4" />
                  <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} opacity="0.4" />
                </g>
              )}

              {showArea && <path d={areaD} fill={`url(#${gradientId})`} />}
              <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" />

              {showPoints && coords.map((c, i) => (
                <circle
                  key={i}
                  cx={c.x}
                  cy={c.y}
                  r={i === coords.length - 1 ? 4.5 : 2.5}
                  fill={i === coords.length - 1 ? '#FFFFFF' : lineColor}
                  stroke={lineColor}
                  strokeWidth="1.5"
                />
              ))}
            </svg>

            <div className="flex items-center justify-between px-2 pt-1 font-mono text-[9px] text-slate-400">
              {coords.map((c, i) => (
                <span key={i}>{c.label}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'bar_chart': {
      const isBound = el.dataBinding?.enabled;
      const barColor = el.chartLineColor || '#10B981';
      const points = el.chartPointsData || [
        { label: 'May', value: 34500 },
        { label: 'Jun', value: 48200 },
        { label: 'Jul', value: 41800 },
        { label: 'Aug', value: 62400 },
        { label: 'Sep', value: 58900 },
        { label: 'Oct', value: 76500 },
      ];

      const maxVal = Math.max(...points.map(p => p.value)) || 1;

      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : undefined}
          className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white block">{el.label || 'Volume Histogram'}</span>
            {isBound && (
              <span className="rounded bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 text-[9px] font-mono text-emerald-300 font-bold">
                MONTHLY FLOW
              </span>
            )}
          </div>

          <div className="flex items-end justify-between gap-2 h-28 pt-4 pb-1 px-1 bg-slate-950/70 rounded-xl border border-slate-800/80">
            {points.map((pt, i) => {
              const heightPct = Math.max(14, (pt.value / maxVal) * 100);
              const isLatest = i === points.length - 1;

              return (
                <div 
                  key={i} 
                  onClick={() => onToast(`${pt.label} Volume: $${pt.value.toLocaleString()}`)}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
                >
                  <span className="text-[8px] font-mono text-slate-400 tabular-nums group-hover:text-emerald-300 transition-colors">
                    {(pt.value / 1000).toFixed(0)}k
                  </span>
                  <div
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: isLatest ? '#10B981' : barColor,
                      opacity: isLatest ? 1 : 0.75,
                    }}
                    className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-100 shadow-sm"
                  />
                  <span className="text-[9px] font-mono text-slate-300 mt-0.5">{pt.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case 'donut_chart': {
      const isBound = el.dataBinding?.enabled;
      const segments = el.donutSegments || [
        { label: 'Bitcoin (BTC)', value: 62540, color: '#F59E0B', percentage: 42 },
        { label: 'Ethereum (ETH)', value: 41700, color: '#6366F1', percentage: 28 },
        { label: 'Solana (SOL)', value: 26800, color: '#10B981', percentage: 18 },
        { label: 'USDC Treasury', value: 17880, color: '#0EA5E9', percentage: 12 },
      ];

      const total = segments.reduce((sum, s) => sum + s.value, 0);
      const size = 110;
      const strokeWidth = 14;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;

      let runningPct = 0;

      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : undefined}
          className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-xs font-bold text-white block">{el.label || 'Asset Allocation'}</span>
              <span className="text-[10px] text-slate-400">Total: ${total.toLocaleString()}</span>
            </div>
            {isBound && (
              <span className="rounded bg-purple-500/15 border border-purple-500/25 px-1.5 py-0.5 text-[9px] font-mono text-purple-300 font-bold">
                PORTFOLIO
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke="#1E293B"
                  strokeWidth={strokeWidth}
                />
                {segments.map((seg, i) => {
                  const pct = seg.percentage || (seg.value / total) * 100;
                  const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((runningPct / 100) * circumference);
                  runningPct += pct;

                  return (
                    <circle
                      key={i}
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-mono text-xs font-bold text-white tabular-nums">100%</span>
                <span className="text-[8px] font-mono text-slate-400">DIVERSIFIED</span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 min-w-0">
              {segments.map((seg, i) => (
                <div 
                  key={i} 
                  onClick={() => onToast(`${seg.label}: $${seg.value.toLocaleString()} (${seg.percentage || Math.round((seg.value / total) * 100)}%)`)}
                  className="flex items-center justify-between text-[10px] cursor-pointer hover:bg-slate-800/50 p-0.5 rounded transition-colors"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span style={{ backgroundColor: seg.color }} className="h-2 w-2 rounded-full shrink-0" />
                    <span className="text-slate-300 font-medium truncate">{seg.label}</span>
                  </div>
                  <span className="font-mono font-bold text-white ml-1">
                    {seg.percentage || Math.round((seg.value / total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'live_ticker': {
      const isBound = el.dataBinding?.enabled;
      const items = el.tickerItems || [
        { symbol: 'BTC/USD', price: '$68,450.00', change: '+3.42%', isUp: true },
        { symbol: 'ETH/USD', price: '$3,520.80', change: '+2.15%', isUp: true },
        { symbol: 'SOL/USD', price: '$184.25', change: '+8.60%', isUp: true },
        { symbol: 'S&P 500', price: '5,815.20', change: '+0.54%', isUp: true },
      ];

      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-2.5 shadow-md space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>{el.label || 'Real-Time Market Quotes'}</span>
            </span>
            {isBound && (
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>STREAM</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {items.map((tick, i) => (
              <div
                key={i}
                onClick={() => onToast(`${tick.symbol} Price: ${tick.price} (${tick.change})`)}
                className="flex items-center gap-2 shrink-0 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 shadow-xs cursor-pointer hover:border-cyan-500/40 active:scale-[0.98] transition-all"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-300 block">{tick.symbol}</span>
                  <span className="font-mono text-xs font-bold text-white tabular-nums">{tick.price}</span>
                </div>
                <span className={`font-mono text-[10px] font-bold ${tick.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tick.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'gauge_diagram': {
      const min = el.gaugeMin ?? 300;
      const max = el.gaugeMax ?? 850;
      const score = Math.max(min, Math.min(max, el.gaugeValue ?? 785));
      const pct = (score - min) / (max - min);

      const size = 160;
      const strokeW = 12;
      const r = (size - strokeW) / 2;
      const halfCircumference = Math.PI * r;
      const dashoffset = halfCircumference * (1 - pct);
      const statusColor = el.gaugeStatus === 'critical' ? '#EF4444' : el.gaugeStatus === 'moderate' ? '#F59E0B' : '#10B981';

      return (
        <div 
          onClick={hasInteractiveLink ? onInteract : () => onToast(`Risk Score: ${score} / ${max}`)}
          className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-3.5 shadow-lg flex flex-col items-center text-center space-y-2 cursor-pointer hover:border-emerald-500/40 transition-colors"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-white">{el.label || 'Credit & Risk Gauge'}</span>
            <span className="text-[10px] font-mono text-slate-400">Scale: {min}–{max}</span>
          </div>

          <div className="relative h-24 w-40 flex items-center justify-center overflow-hidden pt-2">
            <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`} className="overflow-visible">
              <defs>
                <linearGradient id="simGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              <path
                d={`M ${strokeW / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - strokeW / 2} ${size / 2}`}
                fill="none"
                stroke="#1E293B"
                strokeWidth={strokeW}
                strokeLinecap="round"
              />

              <path
                d={`M ${strokeW / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - strokeW / 2} ${size / 2}`}
                fill="none"
                stroke="url(#simGaugeGradient)"
                strokeWidth={strokeW}
                strokeDasharray={`${halfCircumference} ${halfCircumference}`}
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="font-mono text-2xl font-bold text-white tracking-tight tabular-nums drop-shadow">
                {score}
              </span>
              <span style={{ color: statusColor }} className="text-[10px] font-bold uppercase tracking-wider">
                {el.gaugeLabel || 'Excellent Standing'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    case 'data_table': {
      const cols = el.tableColumns || [
        { key: 'time', label: 'Time' },
        { key: 'counterparty', label: 'Counterparty' },
        { key: 'status', label: 'Status' },
        { key: 'amount', label: 'Amount', align: 'right' },
      ];

      const rows = el.tableRows || [
        { id: '1', time: '14:28:02', counterparty: 'Stripe Settlement', status: 'Settled', amount: '+$14,250.00' },
        { id: '2', time: '13:50:11', counterparty: 'AWS Cloud Services', status: 'Cleared', amount: '-$840.20' },
        { id: '3', time: '12:15:44', counterparty: 'Silicon Valley Bank', status: 'Settled', amount: '+$85,000.00' },
      ];

      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-md space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white">{el.label || 'Transactions Ledger'}</span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
              {rows.length} Entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-400 font-mono">
                  {cols.map((c) => (
                    <th key={c.key} className={`pb-1.5 font-semibold ${c.align === 'right' ? 'text-right' : 'text-left'}`}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono text-slate-300">
                {rows.map((r, rIdx) => {
                  const isPositive = (r.amount || '').startsWith('+');
                  return (
                    <tr 
                      key={r.id || rIdx} 
                      onClick={() => onToast(`Viewing TX: ${r.counterparty} (${r.amount})`)}
                      className="hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <td className="py-2 text-slate-400">{r.time}</td>
                      <td className="py-2 font-medium text-white truncate max-w-[120px]">{r.counterparty}</td>
                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          r.status === 'Settled' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          r.status === 'Cleared' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className={`py-2 text-right font-bold ${isPositive ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {r.amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

/* ---------------- Interactive Simulator Splash Screen Component ---------------- */
function SimulatorSplashScreenRenderer({
  el,
  onNavigateScreen,
  onToast,
  onInteract,
}: {
  el: ElementProperties;
  onNavigateScreen: (targetId: string, transition?: TransitionType, duration?: number, easing?: string) => void;
  onToast: (msg: string) => void;
  onInteract?: () => void;
}) {
  const isVideo = el.splashFileType === 'mp4';
  const dwellTotal = el.splashDwellDuration || 2.5;
  const [timeLeft, setTimeLeft] = useState<number>(dwellTotal);
  const [isOutroTriggered, setIsOutroTriggered] = useState<boolean>(false);
  const [isIntroDone, setIsIntroDone] = useState<boolean>(false);
  const [isTaglineRevealed, setIsTaglineRevealed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [replayKey, setReplayKey] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Motion Video Sizing & Proportional Resizer settings
  const sizeMode = el.splashVideoSizeMode || 'fullscreen';
  const aspectRatio = el.splashVideoAspectRatio || '9:16';
  const customWidth = el.splashVideoCustomWidth ?? 88;
  const scale = el.splashVideoScale ?? 100;
  const fit = el.splashVideoFit || 'cover';
  const borderRadius = el.splashVideoBorderRadius ?? 20;
  const opacity = (el.splashVideoOpacity ?? 85) / 100;
  const alignment = el.splashVideoAlignment || 'center';
  const hasGlow = el.splashVideoGlow !== false;

  const [liveSizeMode, setLiveSizeMode] = useState<'fullscreen' | 'proportional'>(sizeMode);
  const [liveAspectRatio, setLiveAspectRatio] = useState<string>(aspectRatio);

  useEffect(() => {
    setLiveSizeMode(el.splashVideoSizeMode || 'fullscreen');
    setLiveAspectRatio(el.splashVideoAspectRatio || '9:16');
  }, [el.splashVideoSizeMode, el.splashVideoAspectRatio]);

  // Check if background is a blue shade to adjust logo color for maximum contrast
  const isBlueBg = (() => {
    const c = (el.splashBgColor || '').toLowerCase();
    if (c.includes('blue') || c.includes('sky') || c.includes('cyan')) return true;
    if (c.startsWith('#') && c.length >= 7) {
      const r = parseInt(c.slice(1, 3), 16);
      const b = parseInt(c.slice(5, 7), 16);
      return b > 120 && b > r + 25;
    }
    return false;
  })();

  // Reset timers on replayKey change
  useEffect(() => {
    setTimeLeft(dwellTotal);
    setIsOutroTriggered(false);
    setIsIntroDone(false);
    setIsTaglineRevealed(false);

    const introDurationMs = (el.splashIntroDuration || 0.8) * 1000;
    const introTimer = setTimeout(() => {
      setIsIntroDone(true);
    }, introDurationMs);

    // Tagline follows smoothly after the logo intro animation settles
    const taglineTimer = setTimeout(() => {
      setIsTaglineRevealed(true);
    }, Math.min(introDurationMs + 300, 1100));

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(taglineTimer);
      clearInterval(interval);
    };
  }, [dwellTotal, el.splashIntroDuration, replayKey]);

  // Handle Dwell timeout -> trigger outro
  useEffect(() => {
    if (timeLeft === 0 && !isOutroTriggered && el.splashAutoAdvance !== false) {
      handleTriggerOutro();
    }
  }, [timeLeft, isOutroTriggered, el.splashAutoAdvance]);

  const handleTriggerOutro = () => {
    if (isOutroTriggered) return;
    setIsOutroTriggered(true);

    const outroDurationMs = (el.splashOutroDuration || 0.5) * 1000;
    setTimeout(() => {
      const target = el.splashTargetScreenId || el.targetScreenId;
      if (target) {
        const outroTrans = el.splashOutroAnimation === 'slide-up-curtain' 
          ? 'slide-up' 
          : (el.transition || 'fade');
        onNavigateScreen(target, outroTrans as TransitionType, 400, 'ease-out');
      } else if (onInteract) {
        onInteract();
      } else {
        onToast('Splash sequence finished');
      }
    }, outroDurationMs);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReplayKey((prev) => prev + 1);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  // Determine Intro class
  const introAnim = el.splashIntroAnimation || 'scale-up';
  let introClass = 'scale-100 opacity-100 transition-all duration-700 ease-out';
  if (!isIntroDone) {
    if (introAnim === 'scale-up') introClass = 'scale-75 opacity-0';
    else if (introAnim === 'fade-in') introClass = 'opacity-0';
    else if (introAnim === 'blur-in') introClass = 'opacity-0 blur-md';
    else if (introAnim === 'slide-up') introClass = 'translate-y-12 opacity-0';
    else if (introAnim === 'pulse') introClass = 'opacity-50 animate-pulse';
  }

  // Determine Outro class
  const outroAnim = el.splashOutroAnimation || 'fade-out';
  let outroClass = '';
  if (isOutroTriggered) {
    if (outroAnim === 'slide-up-curtain') outroClass = '-translate-y-full opacity-0 transition-all ease-in-out';
    else if (outroAnim === 'zoom-through') outroClass = 'scale-150 opacity-0 transition-all ease-in';
    else if (outroAnim === 'iris-wipe') outroClass = 'scale-0 opacity-0 rounded-full transition-all ease-in';
    else outroClass = 'opacity-0 transition-opacity ease-out';
  }

  const progressPercent = Math.min(100, Math.max(0, ((dwellTotal - timeLeft) / dwellTotal) * 100));

  return (
    <div 
      key={replayKey}
      onClick={handleTriggerOutro}
      style={{
        transitionDuration: `${(el.splashOutroDuration || 0.5) * 1000}ms`,
        backgroundColor: el.splashBgColor || '#070A12',
      }}
      className={`relative ${liveSizeMode === 'fullscreen' ? 'h-full min-h-[560px]' : 'min-h-[520px] rounded-2xl'} w-full overflow-hidden flex flex-col justify-between p-5 text-white select-none cursor-pointer group shadow-2xl transition-all ${outroClass}`}
    >
      {/* Background Media: Video (.MP4) or Static / Glow (.PNG) */}
      {isVideo ? (
        liveSizeMode === 'fullscreen' ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              ref={videoRef}
              src={el.splashMediaUrl || 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4'}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              style={{ opacity }}
              className={`h-full w-full ${fit === 'contain' ? 'object-contain' : fit === 'fill' ? 'object-fill' : 'object-cover'} filter contrast-125 brightness-90`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
          </div>
        ) : (
          <div className={`absolute inset-0 z-0 overflow-hidden flex p-3 pointer-events-none ${
            alignment === 'top' ? 'items-start justify-center pt-14' :
            alignment === 'bottom' ? 'items-end justify-center pb-20' :
            'items-center justify-center'
          }`}>
            <div
              style={{
                width: `${customWidth}%`,
                borderRadius: `${borderRadius}px`,
                transform: `scale(${scale / 100})`,
              }}
              className={`relative overflow-hidden border border-purple-400/50 bg-black/90 transition-all ${
                liveAspectRatio === '9:16' ? 'aspect-[9/16] max-h-[82%]' :
                liveAspectRatio === '16:9' ? 'aspect-[16/9]' :
                liveAspectRatio === '1:1' ? 'aspect-square max-h-[72%]' :
                liveAspectRatio === '4:5' ? 'aspect-[4/5] max-h-[76%]' :
                liveAspectRatio === '4:3' ? 'aspect-[4/3]' :
                liveAspectRatio === '21:9' ? 'aspect-[21/9]' :
                'aspect-[9/16]'
              } ${hasGlow ? 'shadow-2xl shadow-purple-500/40 ring-1 ring-purple-500/50' : 'shadow-xl'}`}
            >
              <video
                ref={videoRef}
                src={el.splashMediaUrl || 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4'}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                style={{ opacity }}
                className={`h-full w-full ${fit === 'contain' ? 'object-contain' : fit === 'fill' ? 'object-fill' : 'object-cover'} filter contrast-125 brightness-95`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/40" />
              <div className="absolute bottom-2 left-2 rounded bg-black/70 backdrop-blur-md px-1.5 py-0.5 text-[8px] font-mono font-bold text-purple-200 border border-white/10">
                {liveAspectRatio} • {customWidth}%
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {el.splashMediaUrl && (
            <img 
              src={el.splashMediaUrl}
              alt={el.splashBrandTitle || 'Splash Media'}
              className="h-full w-full object-cover opacity-25 filter blur-xs"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-slate-950/80 to-slate-950" />
        </div>
      )}

      {/* Top Header Status Row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-white/10 px-2.5 py-1 backdrop-blur-md">
            {isVideo ? (
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-purple-300">
                <Video className="h-3 w-3 text-purple-400" /> .MP4 MOTION
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-blue-300">
                <Sparkles className="h-3 w-3 text-blue-400" /> .PNG SPLASH
              </span>
            )}
          </div>

          {isVideo && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLiveSizeMode((prev) => (prev === 'fullscreen' ? 'proportional' : 'fullscreen'));
              }}
              className="flex items-center gap-1 rounded-full bg-slate-900/80 border border-purple-500/30 px-2 py-1 text-[9px] font-mono font-semibold text-purple-300 hover:text-white hover:border-purple-400 backdrop-blur-md transition-all active:scale-95"
              title={liveSizeMode === 'fullscreen' ? 'Click to test Proportional Resizer Mode' : 'Click to test Full Screen Mode'}
            >
              {liveSizeMode === 'fullscreen' ? (
                <>
                  <Scaling className="h-2.5 w-2.5 text-cyan-400" />
                  <span>{liveAspectRatio} Resized</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-2.5 w-2.5 text-purple-400" />
                  <span>Full Screen</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Replay & Sound Controls */}
        <div className="flex items-center gap-1">
          {isVideo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="rounded-full bg-slate-900/80 border border-white/10 p-1.5 text-slate-300 hover:text-white backdrop-blur-md transition-colors"
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
          )}

          <button
            onClick={handleReplay}
            className="rounded-full bg-slate-900/80 border border-white/10 p-1.5 text-slate-300 hover:text-white backdrop-blur-md transition-colors"
            title="Replay Splash Intro Sequence"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Center Hero Brand Emblem */}
      <div className={`relative z-10 my-auto flex flex-col items-center justify-center text-center py-6 ${introClass}`}>
        <div className="relative mb-5 flex items-center justify-center">
          <AppLogo 
            size={76} 
            onBlueBackground={isBlueBg} 
            animated={true} 
            iconOnly={true} 
          />
          {/* Glowing pulse aura */}
          <div className={`absolute -inset-3 rounded-3xl blur-xl -z-10 animate-pulse ${
            isBlueBg ? 'bg-amber-400/40' : 'bg-blue-500/30'
          }`} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
          {el.splashBrandTitle || el.label || 'FlowCraft Pro'}
        </h1>

        {/* Tagline Follows with smooth staggered animated entrance */}
        <div className={`mt-2.5 transition-all duration-700 transform ${
          isTaglineRevealed 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-3 scale-95'
        }`}>
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-lg ${
            isBlueBg 
              ? 'bg-amber-400 text-slate-950 shadow-amber-500/40 ring-2 ring-amber-300' 
              : 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/30'
          }`}>
            <Sparkles className={`h-3.5 w-3.5 ${isBlueBg ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>{el.splashTagline || 'From Idea to Automated'}</span>
          </div>
        </div>

        {/* Dynamic Intro/Outro pill info */}
        <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-slate-400">
          <span className="rounded-md bg-black/40 border border-white/10 px-2 py-0.5">
            Intro: {introAnim}
          </span>
          <span className="rounded-md bg-black/40 border border-white/10 px-2 py-0.5">
            Outro: {outroAnim}
          </span>
        </div>
      </div>

      {/* Bottom Dwell Progress Bar & Skip CTA */}
      <div className="relative z-10 space-y-2 pt-4">
        {/* Progress Dwell bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div 
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-100 ease-linear"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Advancing in {timeLeft}s</span>
          <span className="flex items-center gap-1 font-semibold text-blue-300 group-hover:underline">
            Tap to enter <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
