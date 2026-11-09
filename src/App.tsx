import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Project, Screen, ElementProperties, FlowConnection, ElementType, AuthUser, DevicePreset, ColorPaletteTheme, TransitionType, ScreenAnnotation } from './types/builder';
import { INITIAL_PROJECT } from './data/initialProject';
import { TopNavbar } from './components/toolbar/TopNavbar';
import { InteractiveCanvas } from './components/canvas/InteractiveCanvas';
import { PropertiesSidebar } from './components/sidebar/PropertiesSidebar';
import { MobileSimulator } from './components/simulator/MobileSimulator';
import { CodeExportModal, ExportTab } from './components/modals/CodeExportModal';
import { AddScreenModal } from './components/modals/AddScreenModal';
import { FlowGraphModal } from './components/modals/FlowGraphModal';
import { ColorPaletteModal } from './components/modals/ColorPaletteModal';
import { IndustryFlowsModal } from './components/modals/IndustryFlowsModal';
import { ShareCanvasModal } from './components/modals/ShareCanvasModal';
import { GraphicAssetsCmsModal } from './components/modals/GraphicAssetsCmsModal';
import { AuthModal } from './components/auth/AuthModal';
import { NodeJourneyStudio } from './components/kycflow/NodeJourneyStudio';
import { LandingPage } from './components/landing/LandingPage';
import { GraphicAssetItem, CarouselSlideItem } from './types/builder';

export default function App() {
  const [exportInitialTab, setExportInitialTab] = useState<ExportTab>('figma');
  const [project, setProject] = useState<Project>(() => {
    const saved = localStorage.getItem('flowcraft_project');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved project:', e);
      }
    }
    return INITIAL_PROJECT;
  });

  const [activeView, setActiveView] = useState<'landing' | 'canvas' | 'simulator' | 'node-studio' | 'graph'>('landing');
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(project.screens[0]?.id || null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [sidebarActiveTab, setSidebarActiveTab] = useState<'props' | 'flow' | 'screen'>('props');

  // Transition test parameter passed directly to simulator
  const [simulatorTestParams, setSimulatorTestParams] = useState<{
    sourceScreenId?: string;
    targetScreenId: string;
    transition?: TransitionType;
    duration?: number;
    easing?: string;
  } | null>(null);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('flowcraft_theme') !== 'light';
  });

  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('flowcraft_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse auth session:', e);
      }
    }
    // Default logged in demo user for immediate seamless experience
    return {
      id: 'user_pm_stephen',
      name: 'Stephen Gershen',
      email: 'stephen.gershen@gmail.com',
      role: 'Product Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=stephen.gershen@gmail.com',
      token: 'jwt_mock_token_2026',
    };
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAddScreenOpen, setIsAddScreenOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [isIndustryFlowsOpen, setIsIndustryFlowsOpen] = useState(false);
  const [isShareCanvasOpen, setIsShareCanvasOpen] = useState(false);
  const [isGraphicCmsOpen, setIsGraphicCmsOpen] = useState(false);
  const [graphicCmsTargetContext, setGraphicCmsTargetContext] = useState<{
    elementName?: string;
    elementType?: string;
    mode?: 'image' | 'video' | 'carousel_slide' | 'all';
    targetSlideIndex?: number;
  } | null>(null);
  const [showPropertiesSidebar, setShowPropertiesSidebar] = useState(false);

  // Handle asset application from Graphic Assets CMS
  const handleSelectAssetFromCms = (asset: GraphicAssetItem) => {
    if (!selectedElementId) return;

    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((screen) => ({
        ...screen,
        elements: screen.elements.map((el) => {
          if (el.id !== selectedElementId) return el;

          // If target is a specific slide in carousel
          if (graphicCmsTargetContext?.targetSlideIndex !== undefined) {
            const idx = graphicCmsTargetContext.targetSlideIndex;
            const currentSlides = (el.carouselSlides || el.sliderSlides || []);
            const updatedSlides = currentSlides.map((s, i) =>
              i === idx ? { ...s, imageUrl: asset.url, title: s.title || asset.name } : s
            );
            return {
              ...el,
              carouselSlides: updatedSlides,
              sliderSlides: updatedSlides,
            };
          }

          // If video element
          if (el.type === 'video_player' || el.type === 'media_placeholder' || asset.type === 'video') {
            return {
              ...el,
              videoUrl: asset.url,
              imageUrl: asset.url,
              label: el.label || asset.name,
            };
          }

          // If carousel container
          if (el.type === 'carousel' || el.type === 'asset_slider') {
            const currentSlides = (el.carouselSlides || el.sliderSlides || []);
            const newSlide: CarouselSlideItem = {
              id: `slide_${Date.now()}`,
              imageUrl: asset.url,
              title: asset.name,
              subtitle: 'Banner graphic',
              targetScreenId: prev.screens[0]?.id,
              transition: 'slide-left',
            };
            return {
              ...el,
              carouselSlides: [...currentSlides, newSlide],
              sliderSlides: [...currentSlides, newSlide],
            };
          }

          // Default image/card/banner
          return {
            ...el,
            imageUrl: asset.url,
          };
        }),
      })),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddSlideFromCms = (asset: GraphicAssetItem) => {
    if (!selectedElementId) return;
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((screen) => ({
        ...screen,
        elements: screen.elements.map((el) => {
          if (el.id !== selectedElementId) return el;
          const currentSlides = (el.carouselSlides || el.sliderSlides || []);
          const newSlide: CarouselSlideItem = {
            id: `slide_${Date.now()}`,
            imageUrl: asset.url,
            title: asset.name,
            subtitle: 'Banner graphic',
            targetScreenId: prev.screens[0]?.id,
            transition: 'slide-left',
          };
          return {
            ...el,
            carouselSlides: [...currentSlides, newSlide],
            sliderSlides: [...currentSlides, newSlide],
          };
        }),
      })),
      updatedAt: new Date().toISOString(),
    }));
  };

  // Build simulator state
  const [buildVersion, setBuildVersion] = useState(1);
  const [lastBuildTime, setLastBuildTime] = useState<string>('Just now');
  const [isBuilding, setIsBuilding] = useState(false);

  // Apply global color palette theme
  const handleApplyTheme = (theme: ColorPaletteTheme, applyToAllScreens: boolean) => {
    setProject((prev) => {
      let updatedScreens = prev.screens;
      if (applyToAllScreens) {
        updatedScreens = prev.screens.map((screen) => ({
          ...screen,
          backgroundColor: theme.background,
          elements: screen.elements.map((el) => {
            if (el.type === 'button') {
              return { ...el, bg: theme.primary };
            }
            if (el.type === 'card') {
              return { ...el, bg: theme.cardBg };
            }
            if (el.type === 'splash_screen') {
              return { ...el, splashBgColor: theme.background };
            }
            return el;
          }),
        }));
      }
      return {
        ...prev,
        activeTheme: theme,
        screens: updatedScreens,
      };
    });
  };

  // Save project changes to localStorage
  useEffect(() => {
    localStorage.setItem('flowcraft_project', JSON.stringify(project));
  }, [project]);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('flowcraft_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('flowcraft_theme', 'light');
    }
  }, [isDarkMode]);

  // Derive active selections
  const selectedScreen = project.screens.find((s) => s.id === selectedScreenId) || null;
  const selectedElement =
    selectedScreen?.elements.find((el) => el.id === selectedElementId) ||
    project.screens.flatMap((s) => s.elements).find((el) => el.id === selectedElementId) ||
    null;

  // Execute build trigger
  const handleExecuteBuild = () => {
    setIsBuilding(true);
    setTimeout(() => {
      setBuildVersion((prev) => prev + 1);
      const now = new Date();
      setLastBuildTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsBuilding(false);
    }, 450);
  };

  // Screen actions
  const handleSelectScreen = (screenId: string) => {
    setSelectedScreenId(screenId);
    setSelectedElementId(null);
    setSelectedConnectionId(null);
  };

  const handleSelectElement = (elementId: string) => {
    setSelectedElementId(elementId);
    setSelectedConnectionId(null);
    // Find parent screen
    const parent = project.screens.find((s) => s.elements.some((el) => el.id === elementId));
    if (parent) {
      setSelectedScreenId(parent.id);
    }
  };

  const handleUpdateScreenPos = (screenId: string, x: number, y: number) => {
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((s) => (s.id === screenId ? { ...s, x, y } : s)),
    }));
  };

  const handleUpdateScreen = (updated: Screen) => {
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((s) => (s.id === updated.id ? updated : s)),
    }));
  };

  const handleDuplicateScreen = (screenId: string) => {
    const src = project.screens.find((s) => s.id === screenId);
    if (!src) return;

    const newId = `screen_${Date.now()}`;
    const duplicated: Screen = {
      ...src,
      id: newId,
      title: `${src.title} (Copy)`,
      route: `${src.route}-copy`,
      x: src.x + 40,
      y: src.y + 40,
      isEntry: false,
      elements: src.elements.map((el) => ({
        ...el,
        id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      })),
    };

    setProject((prev) => ({
      ...prev,
      screens: [...prev.screens, duplicated],
    }));
    setSelectedScreenId(newId);
  };

  const handleDeleteScreen = (screenId: string) => {
    if (project.screens.length <= 1) return;
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.filter((s) => s.id !== screenId),
      connections: prev.connections.filter(
        (c) => c.sourceScreenId !== screenId && c.targetScreenId !== screenId
      ),
    }));
    if (selectedScreenId === screenId) {
      const remaining = project.screens.filter((s) => s.id !== screenId);
      setSelectedScreenId(remaining[0]?.id || null);
      setSelectedElementId(null);
    }
  };

  const handleSetEntryScreen = (screenId: string) => {
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((s) => ({
        ...s,
        isEntry: s.id === screenId,
      })),
    }));
  };

  const handleAddScreen = (newScreenData: Omit<Screen, 'id' | 'x' | 'y'>) => {
    const maxScreen = project.screens.reduce((max, s) => (s.x > max.x ? s : max), project.screens[0]);
    const nextX = maxScreen ? maxScreen.x + 420 : 60;

    const newScreen: Screen = {
      ...newScreenData,
      id: `screen_${Date.now()}`,
      x: nextX,
      y: 80,
    };

    setProject((prev) => ({
      ...prev,
      screens: [...prev.screens, newScreen],
    }));
    setSelectedScreenId(newScreen.id);
  };

  // Annotation Actions (Sticky Notes & Pins)
  const handleAddAnnotation = (screenId: string, annotation: ScreenAnnotation) => {
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((s) => {
        if (s.id !== screenId) return s;
        const current = s.annotations || [];
        return {
          ...s,
          annotations: [...current, annotation],
        };
      }),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateAnnotation = (screenId: string, annotationId: string, updates: Partial<ScreenAnnotation>) => {
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((s) => {
        if (s.id !== screenId) return s;
        return {
          ...s,
          annotations: (s.annotations || []).map((a) => (a.id === annotationId ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)),
        };
      }),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleDeleteAnnotation = (screenId: string, annotationId: string) => {
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((s) => {
        if (s.id !== screenId) return s;
        return {
          ...s,
          annotations: (s.annotations || []).filter((a) => a.id !== annotationId),
        };
      }),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleMoveAnnotation = (screenId: string, annotationId: string, x: number, y: number) => {
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((s) => {
        if (s.id !== screenId) return s;
        return {
          ...s,
          annotations: (s.annotations || []).map((a) => (a.id === annotationId ? { ...a, x, y } : a)),
        };
      }),
    }));
  };

  // Element actions
  const handleUpdateElement = (updated: ElementProperties) => {
    setProject((prev) => {
      let updatedConns = [...prev.connections];

      // Sync connections list if action target updated
      if (updated.hasAction && updated.targetScreenId) {
        const existingIdx = updatedConns.findIndex((c) => c.sourceElementId === updated.id);
        const parentScreen = prev.screens.find((s) => s.elements.some((el) => el.id === updated.id));

        if (parentScreen) {
          const conn: FlowConnection = {
            id: existingIdx >= 0 ? updatedConns[existingIdx].id : `conn_${Date.now()}`,
            sourceScreenId: parentScreen.id,
            sourceElementId: updated.id,
            targetScreenId: updated.targetScreenId,
            trigger: updated.trigger || 'onClick',
            transition: updated.transition || 'slide-left',
          };

          if (existingIdx >= 0) {
            updatedConns[existingIdx] = conn;
          } else {
            updatedConns.push(conn);
          }
        }
      } else {
        // Removed action or disabled
        updatedConns = updatedConns.filter((c) => c.sourceElementId !== updated.id);
      }

      return {
        ...prev,
        screens: prev.screens.map((s) => ({
          ...s,
          elements: s.elements.map((el) => (el.id === updated.id ? updated : el)),
        })),
        connections: updatedConns,
      };
    });
  };

  const handleAddElementToScreen = (screenId: string, type: ElementType) => {
    const newEl: ElementProperties = {
      id: `el_${Date.now()}`,
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      label: type === 'button' ? 'Action Button' : type === 'input' ? 'Text Field' : 'New Component',
      placeholder: 'Enter details...',
      variant: 'primary',
      borderRadius: 'lg',
      fullWidth: true,
    };

    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((s) => (s.id === screenId ? { ...s, elements: [...s.elements, newEl] } : s)),
    }));
    setSelectedElementId(newEl.id);
  };

  const handleAddCustomElementToScreen = (screenId: string, element: ElementProperties) => {
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((s) => (s.id === screenId ? { ...s, elements: [...s.elements, element] } : s)),
    }));
    setSelectedScreenId(screenId);
    setSelectedElementId(element.id);
  };

  const handleMoveElement = (screenId: string, elementIndex: number, direction: 'up' | 'down') => {
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((s) => {
        if (s.id !== screenId) return s;
        const newElements = [...s.elements];
        const targetIndex = direction === 'up' ? elementIndex - 1 : elementIndex + 1;
        if (targetIndex < 0 || targetIndex >= newElements.length) return s;
        const temp = newElements[elementIndex];
        newElements[elementIndex] = newElements[targetIndex];
        newElements[targetIndex] = temp;
        return { ...s, elements: newElements };
      }),
    }));
  };

  const handleDeleteElement = (screenId: string, elementId: string) => {
    setProject((prev) => ({
      ...prev,
      screens: prev.screens.map((s) => {
        if (s.id !== screenId) return s;
        return {
          ...s,
          elements: s.elements.filter((el) => el.id !== elementId),
        };
      }),
      connections: prev.connections.filter((c) => c.sourceElementId !== elementId),
    }));
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const handleApplyFlow = (newScreens: Screen[], newConnections: FlowConnection[], flowTitle?: string) => {
    setProject((prev) => ({
      ...prev,
      name: flowTitle || prev.name,
      screens: newScreens,
      connections: newConnections,
      updatedAt: new Date().toISOString(),
    }));
    if (newScreens.length > 0) {
      setSelectedScreenId(newScreens[0].id);
      setSelectedElementId(null);
    }
  };

  // When on Landing Page, render the comprehensive landing page view as the first thing user sees
  if (activeView === 'landing') {
    return (
      <div className={`min-h-screen w-full font-sans ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <LandingPage
          project={project}
          onLaunchStudio={(targetView) => {
            setActiveView(targetView || 'canvas');
          }}
          onOpenAuth={() => setIsAuthOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        {/* User Authentication Modal (with Testing Mode bypass notice) */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setActiveView('canvas');
          }}
        />
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-screen flex-col overflow-hidden font-sans ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Bar Contract (3-Zones) */}
      <TopNavbar
        project={project}
        activeView={activeView}
        onChangeView={setActiveView}
        onExecuteBuild={handleExecuteBuild}
        isBuilding={isBuilding}
        onOpenExport={() => {
          setExportInitialTab('pdf');
          setIsExportOpen(true);
        }}
        onOpenFigmaExport={() => {
          setExportInitialTab('figma');
          setIsExportOpen(true);
        }}
        onOpenColorPalette={() => setIsColorPaletteOpen(true)}
        onOpenIndustryFlows={() => setIsIndustryFlowsOpen(true)}
        onOpenShareCanvas={() => setIsShareCanvasOpen(true)}
        onOpenGraphicCms={() => {
          setGraphicCmsTargetContext(null);
          setIsGraphicCmsOpen(true);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          localStorage.removeItem('flowcraft_auth_session');
          setCurrentUser(null);
        }}
        onUpdateProjectName={(name) => setProject((prev) => ({ ...prev, name }))}
      />

      {/* Main Studio Viewport */}
      {/* Main Studio Viewport (With safe padding for mobile bottom nav) */}
      <div className="relative flex flex-1 overflow-hidden pb-14 lg:pb-0">
        {/* VIEW 1: Figma Interactive Canvas Workboard */}
        {activeView === 'canvas' && (
          <div className="relative flex h-full w-full overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <InteractiveCanvas
                screens={project.screens}
                connections={project.connections}
                selectedScreenId={selectedScreenId}
                selectedElementId={selectedElementId}
                onSelectScreen={handleSelectScreen}
                onSelectElement={handleSelectElement}
                onUpdateScreenPos={handleUpdateScreenPos}
                onDuplicateScreen={handleDuplicateScreen}
                onDeleteScreen={handleDeleteScreen}
                onSetEntryScreen={handleSetEntryScreen}
                onAddElementToScreen={handleAddElementToScreen}
                onAddElementWithProps={handleAddCustomElementToScreen}
                onMoveElement={handleMoveElement}
                onDeleteElement={handleDeleteElement}
                onOpenAddScreenModal={() => setIsAddScreenOpen(true)}
                onSelectConnection={(conn) => {
                  setSelectedConnectionId(conn.id);
                  setSelectedElementId(conn.sourceElementId);
                  setSelectedScreenId(conn.sourceScreenId);
                  setSidebarActiveTab('flow');
                  setShowPropertiesSidebar(true);
                }}
                onAddConnection={(conn) => {
                  setProject((prev) => {
                    const filtered = prev.connections.filter((c) => c.id !== conn.id);
                    return {
                      ...prev,
                      connections: [...filtered, conn],
                      screens: prev.screens.map((s) => ({
                        ...s,
                        elements: s.elements.map((el) => {
                          if (el.id === conn.sourceElementId) {
                            return {
                              ...el,
                              hasAction: true,
                              actionType: 'navigate',
                              targetScreenId: conn.targetScreenId,
                              transition: conn.transition,
                              trigger: conn.trigger,
                            };
                          }
                          return el;
                        }),
                      })),
                      updatedAt: new Date().toISOString(),
                    };
                  });
                }}
                onDeleteConnection={(connId) => {
                  setProject((prev) => ({
                    ...prev,
                    connections: prev.connections.filter((c) => c.id !== connId),
                    updatedAt: new Date().toISOString(),
                  }));
                }}
                onApplyFlow={handleApplyFlow}
                onOpenColorPalette={() => setIsColorPaletteOpen(true)}
                onAddAnnotation={handleAddAnnotation}
                onUpdateAnnotation={handleUpdateAnnotation}
                onDeleteAnnotation={handleDeleteAnnotation}
                onMoveAnnotation={handleMoveAnnotation}
                isDarkMode={isDarkMode}
                showPropertiesSidebar={showPropertiesSidebar}
                onTogglePropertiesSidebar={() => setShowPropertiesSidebar((prev) => !prev)}
              />
            </div>

            {/* Right Properties & Journey Flow Sidebar (Responsive Overlay Drawer on mobile, sidebar on desktop) */}
            {showPropertiesSidebar ? (
              <>
                <div 
                  onClick={() => setShowPropertiesSidebar(false)}
                  className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
                  aria-hidden="true"
                />
                <div className="fixed inset-y-0 right-0 z-50 lg:relative lg:inset-auto h-full flex shrink-0 shadow-2xl">
                  <PropertiesSidebar
                    selectedScreen={selectedScreen}
                    selectedElement={selectedElement}
                    screens={project.screens}
                    connections={project.connections}
                    selectedConnectionId={selectedConnectionId}
                    initialTab={sidebarActiveTab}
                    onTabChange={setSidebarActiveTab}
                    onUpdateElement={handleUpdateElement}
                    onUpdateScreen={handleUpdateScreen}
                    onDeleteElement={(id) => {
                      if (selectedScreen) {
                        handleDeleteElement(selectedScreen.id, id);
                      }
                    }}
                    onSelectElement={handleSelectElement}
                    onSelectScreen={handleSelectScreen}
                    onSelectConnection={(conn) => {
                      if (conn) {
                        setSelectedConnectionId(conn.id);
                        setSelectedElementId(conn.sourceElementId);
                        setSelectedScreenId(conn.sourceScreenId);
                        setSidebarActiveTab('flow');
                      } else {
                        setSelectedConnectionId(null);
                      }
                    }}
                    onTestInteraction={(element, targetScreenId, transition, duration, easing) => {
                      const target = targetScreenId || element?.targetScreenId;
                      const parent = project.screens.find((s) => s.elements.some((el) => el.id === element?.id)) || selectedScreen;
                      if (target) {
                        setSimulatorTestParams({
                          sourceScreenId: parent?.id,
                          targetScreenId: target,
                          transition: transition || element?.transition || 'slide-left',
                          duration: duration || element?.transitionDuration || 350,
                          easing: easing || element?.transitionEasing || 'ease-out',
                        });
                      }
                      setActiveView('simulator');
                    }}
                    onAddConnection={(conn) => {
                      setProject((prev) => {
                        const filtered = prev.connections.filter((c) => c.id !== conn.id);
                        return {
                          ...prev,
                          connections: [...filtered, conn],
                          screens: prev.screens.map((s) => ({
                            ...s,
                            elements: s.elements.map((el) => {
                              if (el.id === conn.sourceElementId) {
                                return {
                                  ...el,
                                  hasAction: true,
                                  actionType: 'navigate',
                                  targetScreenId: conn.targetScreenId,
                                  transition: conn.transition,
                                  trigger: conn.trigger,
                                };
                              }
                              return el;
                            }),
                          })),
                          updatedAt: new Date().toISOString(),
                        };
                      });
                    }}
                    onDeleteConnection={(connId) => {
                      setProject((prev) => ({
                        ...prev,
                        connections: prev.connections.filter((c) => c.id !== connId),
                        updatedAt: new Date().toISOString(),
                      }));
                    }}
                    onUpdateConnection={(updatedConn) => {
                      setProject((prev) => ({
                        ...prev,
                        connections: prev.connections.map((c) => (c.id === updatedConn.id ? updatedConn : c)),
                        screens: prev.screens.map((s) => ({
                          ...s,
                          elements: s.elements.map((el) => {
                            if (el.id === updatedConn.sourceElementId) {
                              return {
                                ...el,
                                hasAction: true,
                                actionType: 'navigate',
                                targetScreenId: updatedConn.targetScreenId,
                                transition: updatedConn.transition,
                                trigger: updatedConn.trigger,
                              };
                            }
                            return el;
                          }),
                        })),
                        updatedAt: new Date().toISOString(),
                      }));
                    }}
                    onClose={() => setShowPropertiesSidebar(false)}
                    onOpenGraphicCms={(ctx) => {
                      setGraphicCmsTargetContext(ctx || null);
                      setIsGraphicCmsOpen(true);
                    }}
                  />
                </div>
              </>
            ) : (
              /* Docked Open Arrow Tab when Properties Sidebar is collapsed */
              <button
                onClick={() => setShowPropertiesSidebar(true)}
                className="absolute right-0 top-16 sm:top-20 z-40 flex items-center gap-1 rounded-l-xl border border-r-0 border-violet-500/30 bg-[#120F24]/95 px-2 py-3 text-xs font-semibold text-slate-300 shadow-2xl backdrop-blur-xl hover:bg-gradient-to-l hover:from-[#6B39F4] hover:to-[#8B5CF6] hover:text-white hover:border-violet-400 transition-all group"
                title="Open Properties Panel"
              >
                <ChevronLeft className="h-4 w-4 text-violet-400 group-hover:text-white transition-transform group-hover:-translate-x-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider [writing-mode:vertical-lr] py-1">
                  Props
                </span>
              </button>
            )}
          </div>
        )}

        {/* VIEW 2: Virtual Mobile Device Simulator */}
        {activeView === 'simulator' && (
          <MobileSimulator
            screens={project.screens}
            connections={project.connections}
            devicePreset={project.devicePreset}
            onChangeDevicePreset={(preset: DevicePreset) => setProject((prev) => ({ ...prev, devicePreset: preset }))}
            onOpenCodeExport={() => setIsExportOpen(true)}
            buildVersion={buildVersion}
            lastBuildTime={lastBuildTime}
            onExecuteBuild={handleExecuteBuild}
            isBuilding={isBuilding}
            testTransition={simulatorTestParams}
            onClearTestTransition={() => setSimulatorTestParams(null)}
          />
        )}

        {/* VIEW 3: KYC Node Journey Studio (Matching Video) */}
        {activeView === 'node-studio' && (
          <NodeJourneyStudio />
        )}

        {/* VIEW 4: Journey Flow State Machine Diagram */}
        {activeView === 'graph' && (
          <FlowGraphModal
            screens={project.screens}
            connections={project.connections}
            onSelectScreen={(screenId) => {
              setSelectedScreenId(screenId);
              setActiveView('canvas');
            }}
            onOpenSimulatorWithScreen={(screenId) => {
              setSelectedScreenId(screenId);
              setActiveView('simulator');
            }}
          />
        )}
      </div>

      {/* Code Export & Developer Handoff Modal */}
      <CodeExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
        initialTab={exportInitialTab}
      />

      {/* Add New Artboard Modal */}
      <AddScreenModal
        isOpen={isAddScreenOpen}
        onClose={() => setIsAddScreenOpen(false)}
        onAddScreen={handleAddScreen}
        existingScreensCount={project.screens.length}
      />

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* Global Design System & Color Palette Modal */}
      <ColorPaletteModal
        isOpen={isColorPaletteOpen}
        onClose={() => setIsColorPaletteOpen(false)}
        currentTheme={project.activeTheme}
        onApplyTheme={handleApplyTheme}
        selectedScreen={selectedScreen}
        onUpdateScreenBg={(screenId, color) => {
          setProject((prev) => ({
            ...prev,
            screens: prev.screens.map((s) => (s.id === screenId ? { ...s, backgroundColor: color } : s)),
          }));
        }}
        isDarkMode={isDarkMode}
      />

      {/* 10 Standard Design Flows across Industries Modal */}
      <IndustryFlowsModal
        isOpen={isIndustryFlowsOpen}
        onClose={() => setIsIndustryFlowsOpen(false)}
        onApplyFlow={handleApplyFlow}
        isDarkMode={isDarkMode}
      />

      {/* Share Canvas & Multi-User Collaboration Modal */}
      <ShareCanvasModal
        isOpen={isShareCanvasOpen}
        onClose={() => setIsShareCanvasOpen(false)}
        project={project}
        currentUser={currentUser}
        onSwitchWorkspace={(newProject) => setProject(newProject)}
      />

      {/* Graphic Assets CMS & Media Hub Modal */}
      <GraphicAssetsCmsModal
        isOpen={isGraphicCmsOpen}
        onClose={() => setIsGraphicCmsOpen(false)}
        onSelectAsset={handleSelectAssetFromCms}
        onAddAsCarouselSlide={handleAddSlideFromCms}
        targetContext={graphicCmsTargetContext || (selectedElement ? {
          elementName: selectedElement.name,
          elementType: selectedElement.type,
          mode: selectedElement.type === 'video_player' || selectedElement.mediaType === 'video' ? 'video' : selectedElement.type === 'carousel' || selectedElement.type === 'asset_slider' ? 'carousel_slide' : 'image',
        } : undefined)}
      />
    </div>
  );
}
