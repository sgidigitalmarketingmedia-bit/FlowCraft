import React, { useState, useEffect } from 'react';
import { 
  X, Download, Copy, Check, FileCode, Braces, BookOpen, 
  Layers, Package, Shield, ExternalLink, Terminal, Smartphone, 
  Cpu, Sparkles, FileText, ArrowRight, Printer, CheckCircle2,
  Sliders, Palette, ShieldCheck, MapPin, StickyNote, Image as ImageIcon, Eye, FolderArchive,
  ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';
import { Project, Screen, ElementProperties } from '../../types/builder';
import { generateReactProjectCode } from '../../utils/codeGenerator';
import { generateComponentSchema, generateHandoffDataPayload } from '../../utils/schemaGenerator';
import { downloadProjectZip, downloadJsonFile, downloadTextFile } from '../../utils/zipExporter';
import { 
  generateSwiftUICode, 
  generateJetpackComposeCode, 
  generateReactNativeCode, 
  generateFlutterCode 
} from '../../utils/nativeCodeGenerators';
import { downloadDeveloperHandoffPdf, generateDeveloperHandoffPdf } from '../../utils/pdfGenerator';
import { generateFigmaRestApiPayload, generateFigmaPluginScript } from '../../utils/figmaExporter';
import { DEVICE_PRESETS } from '../../data/initialProject';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  initialTab?: ExportTab;
}

export type ExportTab = 
  | 'bundle'
  | 'figma'
  | 'pdf'
  | 'swiftui' 
  | 'compose' 
  | 'react-native' 
  | 'flutter' 
  | 'react-web' 
  | 'schema' 
  | 'machine' 
  | 'docs';

export const PROJECT_SCREENSHOTS = [
  {
    id: 'splash',
    title: '00. Motion Launch Splash Screen',
    filename: '00-motion-splash-screen.png',
    path: '/screenshots/00-motion-splash-screen.png',
    resolution: '750 × 1520',
    description: 'Motion launch splash with brand emblem, particle circles, and 2.8s auto-advance dwell timer.',
  },
  {
    id: 'onboarding',
    title: '01. Welcome Onboarding & Walkthrough',
    filename: '01-welcome-onboarding-screen.png',
    path: '/screenshots/01-welcome-onboarding-screen.png',
    resolution: '750 × 1520',
    description: 'Hero visual banner, Zero-Fee value prop card, internet video walkthrough player, and SOC-2 badge.',
  },
  {
    id: 'auth',
    title: '02. Biometric Authentication & FaceID',
    filename: '02-biometric-authentication-screen.png',
    path: '/screenshots/02-biometric-authentication-screen.png',
    resolution: '750 × 1520',
    description: 'Work email/password fields, FaceID biometric switch, passkey button, and security fallback sticky note.',
  },
  {
    id: 'dashboard',
    title: '03. Wealth & Cash Dashboard',
    filename: '03-portfolio-dashboard-screen.png',
    path: '/screenshots/03-portfolio-dashboard-screen.png',
    resolution: '750 × 1520',
    description: 'Net liquid assets metric, interactive featured promotions carousel with hyperlinks, transactions list, and tab dock.',
  },
  {
    id: 'transfer',
    title: '04. Instant Transfer & Pay Form',
    filename: '04-instant-transfer-screen.png',
    path: '/screenshots/04-instant-transfer-screen.png',
    resolution: '750 × 1520',
    description: 'Recipient tag/IBAN input, amount keypad field ($2,500.00), memo note, and 30s zero-fee routing card.',
  },
  {
    id: 'success',
    title: '05. Transfer Completed Receipt',
    filename: '05-transfer-receipt-success.png',
    path: '/screenshots/05-transfer-receipt-success.png',
    resolution: '750 × 1520',
    description: 'Settlement confirmed checkmark halo, cryptographic proof hash #FP-994021, and PDF receipt download.',
  },
  {
    id: 'canvas',
    title: '06. Full Canvas Workspace Overview',
    filename: '06-full-canvas-workspace-overview.png',
    path: '/screenshots/06-full-canvas-workspace-overview.png',
    resolution: '1920 × 1080',
    description: 'Panoramic studio artboard sequence connected with visual bezier navigation flow wires and annotations.',
  },
  {
    id: 'inspector',
    title: '07. Properties Panel & CMS Inspector',
    filename: '07-properties-panel-and-cms-inspector.png',
    path: '/screenshots/07-properties-panel-and-cms-inspector.png',
    resolution: '1920 × 1080',
    description: 'Element Properties Inspector showing internet video URL source, timing sliders, local PC search, and CMS assets.',
  },
];

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  project,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<ExportTab>(initialTab || 'bundle');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [screenshotZoom, setScreenshotZoom] = useState<'fit' | '100%' | '125%'>('fit');
  const [figmaSubmode, setFigmaSubmode] = useState<'json' | 'script'>('json');
  const [copied, setCopied] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const reactFiles = generateReactProjectCode(project);
  const mainAppCode = reactFiles['src/App.tsx'] || '';
  const componentSchema = generateComponentSchema(project);
  const handoffPayload = generateHandoffDataPayload(project);
  const swiftCode = generateSwiftUICode(project);
  const composeCode = generateJetpackComposeCode(project);
  const reactNativeCode = generateReactNativeCode(project);
  const flutterCode = generateFlutterCode(project);
  const figmaRestPayload = generateFigmaRestApiPayload(project);
  const figmaPluginScript = generateFigmaPluginScript(project);
  const initialScreen = project.screens.find(s => s.isEntry) || project.screens[0];
  const transitions = project.screens.flatMap(screen =>
    screen.elements
      .filter(e => e.hasAction)
      .map(e => ({
        sourceScreen: screen.id,
        triggerElement: e.label || e.name,
        triggerEvent: e.trigger || 'onClick',
        targetScreen: e.targetScreenId || (e.actionType === 'back' ? 'Previous Screen' : 'Action Handler'),
        transitionAnimation: e.transition || 'slide-left',
        action: e.actionType || 'navigate',
      }))
  );

  const handleDownloadFigmaJson = () => {
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadJsonFile(`${slug}-figma-rest.json`, figmaRestPayload);
  };

  const handleDownloadFigmaScript = () => {
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadTextFile(`${slug}-figma-importer.js`, figmaPluginScript, 'application/javascript');
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case 'bundle':
        return `# Project Delivery Bundle: Build + Screenshots + Source
Archive: flowcraft-finpulse-build-and-screenshots.zip (4.22 MB)

Files included:
- /build/ (Production Vite + Tailwind CSS static app)
- /screenshots/ (8 High-Res PNG screenshots of screens and canvas)
- /code-exports/figma/ (Figma REST API document + 1-Click script)
- /code-exports/ios-native/ (SwiftUI ContentView.swift)
- /code-exports/android-native/ (Jetpack Compose MainActivity.kt)
- /code-exports/react-native/ (App.tsx)
- /code-exports/flutter/ (lib/main.dart)
- /code-exports/schemas/ (JSON Schema & State Machine)
- /code-exports/web-prototype/ (React source files)
- README.md`;
      case 'figma':
        return figmaSubmode === 'script' ? figmaPluginScript : JSON.stringify(figmaRestPayload, null, 2);
      case 'swiftui':
        return swiftCode;
      case 'compose':
        return composeCode;
      case 'react-native':
        return reactNativeCode;
      case 'flutter':
        return flutterCode;
      case 'react-web':
        return mainAppCode;
      case 'schema':
        return JSON.stringify(componentSchema, null, 2);
      case 'machine':
        return JSON.stringify(handoffPayload.journeyFlowStateMachine, null, 2);
      case 'docs':
        return generateDeveloperMarkdown(project);
      case 'pdf':
        return generateDeveloperMarkdown(project);
      default:
        return '';
    }
  };

  const getFilenameForActiveTab = () => {
    const slug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    switch (activeTab) {
      case 'bundle': return `flowcraft-finpulse-build-and-screenshots.zip`;
      case 'figma': return figmaSubmode === 'script' ? `${slug}-figma-importer.js` : `${slug}-figma-rest.json`;
      case 'pdf': return `${slug}-technical-handoff-spec.pdf`;
      case 'swiftui': return `ContentView.swift`;
      case 'compose': return `MainActivity.kt`;
      case 'react-native': return `App.tsx`;
      case 'flutter': return `main.dart`;
      case 'react-web': return `App.tsx`;
      case 'schema': return `${slug}-component-schema.json`;
      case 'machine': return `${slug}-state-machine.json`;
      case 'docs': return `${slug}-developer-specs.md`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      downloadDeveloperHandoffPdf(project);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadSingleFile = () => {
    if (activeTab === 'pdf') {
      handleDownloadPdf();
      return;
    }
    const filename = getFilenameForActiveTab();
    const content = getActiveCode();
    downloadTextFile(filename, content, 'text/plain');
  };

  const handleDownloadZip = async () => {
    try {
      setIsExportingZip(true);
      await downloadProjectZip(project);
    } catch (err) {
      console.error('ZIP generation error:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleDownloadJsonSchema = () => {
    downloadJsonFile(`${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-component-schema.json`, componentSchema);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/30">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Developer Technical Handoff & Code Generator
                </h2>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  Ready to Integrate
                </span>
              </div>
              <p className="text-xs text-slate-400">
                PDF Technical Documentation, Component Schema Contracts, Flow Pathways, and Native iOS & Android Source
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Download Technical PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-600/20 px-3.5 py-2 text-xs font-bold text-red-300 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
              title="Generate and download developer technical handoff PDF specification"
            >
              <FileText className="h-4 w-4" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Spec (.pdf)'}</span>
            </button>

            {/* Download Complete Bundle ZIP (Build + Screenshots) */}
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/flowcraft-finpulse-build-and-screenshots.zip';
                link.download = 'flowcraft-finpulse-build-and-screenshots.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition-all active:scale-95"
              title="Download full project package containing production build, 8 high-res screenshots, Figma REST JSON, and native source code"
            >
              <Package className="h-4 w-4" />
              <span>Bundle ZIP (Build + Screenshots)</span>
              <span className="rounded bg-black/20 text-white text-[9px] px-1 font-bold">4.2MB</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-2 overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 flex-nowrap">
            {/* Master Bundle: Build & Screenshots */}
            <button
              onClick={() => setActiveTab('bundle')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'bundle'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm font-bold'
                  : 'text-amber-300 hover:text-white hover:bg-amber-600/20'
              }`}
              title="Full Delivery Package with High-Res Screenshots, Production Build, and Multi-Platform Source"
            >
              <Package className="h-3.5 w-3.5 text-amber-300" />
              <span>Screenshots & Build ZIP</span>
              <span className="rounded bg-amber-500/30 text-white text-[9px] px-1 font-bold">4.2MB</span>
            </button>

            {/* Figma REST API Document & Layouts */}
            <button
              onClick={() => setActiveTab('figma')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'figma'
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-sm font-bold'
                  : 'text-pink-300 hover:text-white hover:bg-pink-600/20'
              }`}
              title="Export Screen Layouts and Element Hierarchies in Figma REST API JSON format"
            >
              <Layers className="h-3.5 w-3.5 text-pink-300" />
              <span>Figma REST API</span>
              <span className="rounded bg-pink-500/30 text-white text-[9px] px-1 font-bold">REST</span>
            </button>

            {/* PDF Technical Documentation */}
            <button
              onClick={() => setActiveTab('pdf')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'pdf'
                  ? 'bg-red-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>PDF Handoff Spec</span>
            </button>

            {/* Swift / SwiftUI for iPhone 16 Pro */}
            <button
              onClick={() => setActiveTab('swiftui')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'swiftui'
                  ? 'bg-orange-500 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>SwiftUI (iOS)</span>
            </button>

            {/* Jetpack Compose for Pixel 9 & Galaxy S25 */}
            <button
              onClick={() => setActiveTab('compose')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'compose'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Jetpack Compose (Android)</span>
            </button>

            {/* React Native */}
            <button
              onClick={() => setActiveTab('react-native')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'react-native'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>React Native</span>
            </button>

            {/* Flutter */}
            <button
              onClick={() => setActiveTab('flutter')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'flutter'
                  ? 'bg-cyan-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Flutter</span>
            </button>

            {/* React Web Prototype */}
            <button
              onClick={() => setActiveTab('react-web')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'react-web'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>React Web</span>
            </button>

            {/* JSON Schema */}
            <button
              onClick={() => setActiveTab('schema')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'schema'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Braces className="h-3.5 w-3.5" />
              <span>JSON Schema</span>
            </button>

            {/* Flow State Machine */}
            <button
              onClick={() => setActiveTab('machine')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'machine'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>State Machine</span>
            </button>

            {/* Developer Specs Markdown */}
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'docs'
                  ? 'bg-slate-700 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Specs (MD)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== 'pdf' && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleDownloadSingleFile}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors shrink-0"
              title="Download only this active file"
            >
              <Download className="h-3.5 w-3.5 text-blue-400" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Viewport Area */}
        {activeTab === 'bundle' ? (
          /* Master Bundle (Build + Screenshots) Interactive Explorer */
          <div className="relative flex-1 overflow-auto bg-slate-950 p-6">
            <div className="mx-auto max-w-6xl space-y-6">
              {/* Master Bundle Hero Banner */}
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-[#1e1710] to-[#2b1705] p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600"></div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-amber-500/20 text-amber-300 px-2 py-0.5 text-xs font-bold border border-amber-500/30 uppercase tracking-wide flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5" />
                        Complete Delivery Archive
                      </span>
                      <span className="rounded-md bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-xs font-bold border border-emerald-500/30">
                        Production Build Ready • 4.22 MB
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                      <span>Bundle Package: Production Build & High-Res Screenshots</span>
                    </h2>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      Download a self-contained ZIP archive containing the compiled web application build (<code className="text-amber-300">dist/</code>),
                      8 high-resolution 4K/retina mobile screenshots, Figma REST API JSON hierarchy, and complete native iOS/Android code.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <a
                      href="/flowcraft-finpulse-build-and-screenshots.zip"
                      download="flowcraft-finpulse-build-and-screenshots.zip"
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-amber-500/30 hover:from-amber-400 hover:to-orange-500 transition-all active:scale-95"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Master ZIP (.ZIP)</span>
                    </a>
                  </div>
                </div>

                {/* Bundle Metrics Bar */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-amber-500/20 pl-2">
                  <div className="rounded-xl bg-slate-900/80 p-3 border border-amber-500/20">
                    <span className="text-[10px] uppercase font-bold text-amber-400/80 block">Screenshots Included</span>
                    <span className="text-xl font-bold text-white font-mono">8 PNG Images</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">750x1520 & 1920x1080</span>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 p-3 border border-amber-500/20">
                    <span className="text-[10px] uppercase font-bold text-emerald-400/80 block">Production Build</span>
                    <span className="text-xl font-bold text-emerald-400 font-mono">dist/ Ready</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">HTML5 • CSS • Vite Bundle</span>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 p-3 border border-amber-500/20">
                    <span className="text-[10px] uppercase font-bold text-pink-400/80 block">Figma Integration</span>
                    <span className="text-xl font-bold text-pink-400 font-mono">REST & Plugin</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">1-Click Desktop Console</span>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 p-3 border border-amber-500/20">
                    <span className="text-[10px] uppercase font-bold text-purple-400/80 block">Native Exports</span>
                    <span className="text-xl font-bold text-purple-400 font-mono">5 Platforms</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">SwiftUI, Compose, RN, Flutter</span>
                  </div>
                </div>
              </div>

              {/* High-Resolution Screenshots Gallery */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-amber-400" />
                      <span>Product Mockup Screenshots ({PROJECT_SCREENSHOTS.length} High-Res Assets)</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pixel-perfect device mockups with Dynamic Island, typography, live video player, banner carousel, and full panoramic canvas view.
                    </p>
                  </div>
                  <a
                    href="/flowcraft-finpulse-build-and-screenshots.zip"
                    download="flowcraft-finpulse-build-and-screenshots.zip"
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>Download All in ZIP</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PROJECT_SCREENSHOTS.map((item) => (
                    <div
                      key={item.id}
                      className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-lg hover:border-amber-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        {/* Screenshot Thumbnail with Hover Overlay */}
                        <div
                          onClick={() => setSelectedScreenshot(item.path)}
                          className="relative aspect-[9/16] max-h-56 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer flex items-center justify-center group-hover:shadow-md group-hover:shadow-amber-500/10"
                        >
                          <img
                            src={item.path}
                            alt={item.title}
                            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <span className="flex items-center gap-1 rounded-lg bg-amber-500/90 text-white px-2.5 py-1 text-xs font-bold shadow-lg">
                              <Eye className="h-3 w-3" />
                              View Preview
                            </span>
                          </div>
                          <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-mono text-slate-300 border border-white/10">
                            {item.resolution}
                          </span>
                        </div>

                        {/* Title and details */}
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Download Individual PNG Button */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-slate-500 truncate">{item.filename}</span>
                        <a
                          href={item.path}
                          download={item.filename}
                          className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-white px-2 py-1 text-[11px] font-semibold text-slate-200 transition-colors shrink-0"
                          title="Download high-resolution PNG"
                        >
                          <Download className="h-3 w-3" />
                          <span>PNG</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ZIP Archive Content Explorer Tree */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderArchive className="h-4 w-4 text-amber-400" />
                    <span>Archive Hierarchy Structure (flowcraft-finpulse-build-and-screenshots.zip)</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Total Uncompressed: 6.93 MB • 44 Files</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                  <div className="text-amber-400 font-bold">📦 flowcraft-finpulse-build-and-screenshots.zip</div>
                  <div className="pl-4 text-emerald-400">├── 📁 build/                     <span className="text-slate-500 font-normal"># Complete compiled web application build</span></div>
                  <div className="pl-8 text-slate-400">├── index.html</div>
                  <div className="pl-8 text-slate-400">└── 📁 assets/                 <span className="text-slate-500 font-normal">(index-*.js, index-*.css, html2canvas, purify)</span></div>
                  <div className="pl-4 text-amber-400">├── 📁 screenshots/               <span className="text-slate-500 font-normal"># High-resolution PNG screen mockups</span></div>
                  <div className="pl-8 text-slate-400">├── 00-motion-splash-screen.png</div>
                  <div className="pl-8 text-slate-400">├── 01-welcome-onboarding-screen.png</div>
                  <div className="pl-8 text-slate-400">├── 02-biometric-authentication-screen.png</div>
                  <div className="pl-8 text-slate-400">├── 03-portfolio-dashboard-screen.png</div>
                  <div className="pl-8 text-slate-400">├── 04-instant-transfer-screen.png</div>
                  <div className="pl-8 text-slate-400">├── 05-transfer-receipt-success.png</div>
                  <div className="pl-8 text-slate-400">├── 06-full-canvas-workspace-overview.png</div>
                  <div className="pl-8 text-slate-400">├── 07-properties-panel-and-cms-inspector.png</div>
                  <div className="pl-8 text-slate-400">└── README-screenshots.md</div>
                  <div className="pl-4 text-pink-400">├── 📁 code-exports/</div>
                  <div className="pl-8 text-pink-400">├── 📁 figma/                  <span className="text-slate-500 font-normal">(figma-rest-document.json, figma-plugin-import.js)</span></div>
                  <div className="pl-8 text-orange-400">├── 📁 ios-native/            <span className="text-slate-500 font-normal">(ContentView.swift for Xcode 16 / iOS 18)</span></div>
                  <div className="pl-8 text-emerald-400">├── 📁 android-native/        <span className="text-slate-500 font-normal">(MainActivity.kt for Jetpack Compose)</span></div>
                  <div className="pl-8 text-blue-400">├── 📁 react-native/           <span className="text-slate-500 font-normal">(App.tsx cross-platform mobile component)</span></div>
                  <div className="pl-8 text-cyan-400">├── 📁 flutter/                <span className="text-slate-500 font-normal">(lib/main.dart cross-platform Dart app)</span></div>
                  <div className="pl-8 text-purple-400">├── 📁 schemas/                <span className="text-slate-500 font-normal">(component-schema.json, state-machine.json)</span></div>
                  <div className="pl-8 text-indigo-400">└── 📁 web-prototype/          <span className="text-slate-500 font-normal">(modular React + Tailwind CSS code)</span></div>
                  <div className="pl-4 text-white">└── 📄 README.md                 <span className="text-slate-500 font-normal"># Master setup, deployment, & integration instructions</span></div>
                </div>
              </div>

              {/* How to Deploy & Use Callout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">1</span>
                    <span>Host the Production Build</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Unzip and deploy the <code className="text-slate-300">build/</code> folder directly to Vercel, Netlify, Cloudflare Pages, AWS S3, or any web server without building.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px]">2</span>
                    <span>Use Mockup Screenshots</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Drop the high-res PNGs in <code className="text-slate-300">screenshots/</code> into pitch decks, investor demos, marketing landing pages, and App Store listings.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500/20 text-pink-400 font-mono text-[10px]">3</span>
                    <span>Import to Figma</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Open Figma desktop → <strong>Plugins → Development → Open Console</strong> → Paste <code className="text-slate-300">figma-plugin-import.js</code> to generate all artboards.
                  </p>
                </div>
              </div>
            </div>

            {/* Lightbox Preview Modal with Responsive Zoom & 100% Native Resolution */}
            {selectedScreenshot && (
              <div
                onClick={() => setSelectedScreenshot(null)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 sm:p-4 backdrop-blur-md animate-in fade-in"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-h-[96vh] w-full max-w-5xl flex flex-col items-center gap-3 bg-[#0d1117]/90 p-4 rounded-3xl border border-slate-700/80 shadow-2xl"
                >
                  {/* Top Control Bar with 100% / Fit / Zoom buttons */}
                  <div className="flex flex-wrap items-center justify-between w-full border-b border-slate-800 pb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                        {selectedScreenshot.split('/').pop()}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        High-Resolution Retina Graphic
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1">
                      <button
                        onClick={() => setScreenshotZoom('fit')}
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                          screenshotZoom === 'fit' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                        }`}
                        title="Fit within window"
                      >
                        <Maximize2 className="h-3 w-3" />
                        <span>Fit Viewport</span>
                      </button>

                      <button
                        onClick={() => setScreenshotZoom('100%')}
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-colors ${
                          screenshotZoom === '100%' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                        }`}
                        title="100% Actual Native Scale (1:1 Pixels)"
                      >
                        100% Native
                      </button>

                      <button
                        onClick={() => setScreenshotZoom('125%')}
                        className={`hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-mono font-bold rounded-lg transition-colors ${
                          screenshotZoom === '125%' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                        }`}
                        title="125% Enlarged Zoom"
                      >
                        125%
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedScreenshot(null)}
                      className="rounded-xl bg-slate-800 hover:bg-slate-700 p-1.5 text-slate-300 hover:text-white transition-colors"
                      title="Close Preview (Esc)"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Image Display Area with Smooth Scroll in 100% mode */}
                  <div className="relative w-full flex-1 max-h-[75vh] overflow-auto flex items-center justify-center p-2 rounded-2xl bg-black/60 border border-slate-800/80 custom-scrollbar">
                    <img
                      src={selectedScreenshot}
                      alt="High Resolution Screenshot Preview"
                      style={{
                        width: screenshotZoom === '100%' ? '750px' : screenshotZoom === '125%' ? '937px' : undefined,
                        maxWidth: screenshotZoom === 'fit' ? '100%' : 'none',
                        maxHeight: screenshotZoom === 'fit' ? '70vh' : 'none',
                      }}
                      className={`rounded-xl border border-slate-800 shadow-2xl transition-all duration-200 ${
                        screenshotZoom === 'fit' ? 'object-contain' : 'object-none'
                      }`}
                    />
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between w-full pt-1 gap-2 text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      Mode: <strong className="text-slate-200">{screenshotZoom === '100%' ? '100% 1:1 Pixel Scale (Scroll to inspect full detail)' : screenshotZoom === '125%' ? '125% Magnified' : 'Fit to Window'}</strong>
                    </span>
                    <div className="flex items-center gap-3">
                      <a
                        href={selectedScreenshot}
                        download={selectedScreenshot.split('/').pop()}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-400 transition-colors shadow-lg"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download High-Res PNG</span>
                      </a>
                      <button
                        onClick={() => setSelectedScreenshot(null)}
                        className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'pdf' ? (
          /* PDF Technical Documentation Interactive Preview */
          <div className="relative flex-1 overflow-auto bg-slate-950 p-6">
            <div className="mx-auto max-w-4xl space-y-6">
              {/* Document Cover Header Card */}
              <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30 p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-2 bg-blue-600"></div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-blue-600/20 text-blue-400 text-[10px] font-mono font-bold px-2 py-0.5 border border-blue-500/30">
                        OFFICIAL TECHNICAL SPECIFICATION
                      </span>
                      <span className="text-slate-400 text-xs">• Draft-07 Compliant</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      Developer Technical Handoff Document
                    </h1>
                    <p className="text-sm font-semibold text-blue-300">
                      {project.name}
                    </p>
                    <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                      {project.description || 'Full-stack mobile journey and native implementation specifications.'}
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-500/25 hover:bg-red-500 transition-all active:scale-95"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Download PDF Document (.pdf)</span>
                  </button>
                </div>

                {/* KPI Metrics */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 pl-2">
                  <div className="rounded-xl bg-slate-800/50 p-3 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Screens</span>
                    <span className="text-xl font-bold text-white font-mono">{project.screens.length} Artboards</span>
                  </div>
                  <div className="rounded-xl bg-slate-800/50 p-3 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Flow Pathways</span>
                    <span className="text-xl font-bold text-emerald-400 font-mono">{transitions.length} Transitions</span>
                  </div>
                  <div className="rounded-xl bg-slate-800/50 p-3 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Initial Entry</span>
                    <span className="text-sm font-bold text-blue-400 font-mono truncate block">{initialScreen?.route || '/'}</span>
                  </div>
                  <div className="rounded-xl bg-slate-800/50 p-3 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Hardware Presets</span>
                    <span className="text-sm font-bold text-purple-300 truncate block">iPhone 16 • Pixel 9 • S25</span>
                  </div>
                </div>
              </div>

              {/* Section 1: Screen Architecture */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-400" />
                    1. Screen Hierarchy & Architecture Summary
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">{project.screens.length} Total Screens</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Screen Name</th>
                        <th className="py-2.5 px-3">Route Path</th>
                        <th className="py-2.5 px-3">Entry Status</th>
                        <th className="py-2.5 px-3">Components</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {project.screens.map((scr, idx) => (
                        <tr key={scr.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2 px-3 font-mono text-slate-500">0{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-white">{scr.title.replace(/^\d+\.\s*/, '')}</td>
                          <td className="py-2 px-3 font-mono text-blue-400">{scr.route}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              scr.isEntry ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {scr.isEntry ? 'Initial Entry' : 'Destination'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-400">{scr.elements.length} elements</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: Flow Pathways & Transitions */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-emerald-400" />
                    2. User Journey Flow Pathways & State Transitions
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">{transitions.length} Mapped Interactions</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Source Screen</th>
                        <th className="py-2.5 px-3">Trigger Component</th>
                        <th className="py-2.5 px-3">Event</th>
                        <th className="py-2.5 px-3">Destination Screen</th>
                        <th className="py-2.5 px-3">Motion Animation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {transitions.map((trans, idx) => {
                        const srcScreen = project.screens.find(s => s.id === trans.sourceScreen);
                        const targetScreen = project.screens.find(s => s.id === trans.targetScreen);

                        return (
                          <tr key={`trans_${idx}`} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-2 px-3 font-semibold text-white">
                              {srcScreen ? srcScreen.title.replace(/^\d+\.\s*/, '') : trans.sourceScreen}
                            </td>
                            <td className="py-2 px-3 text-slate-300 font-medium">
                              {trans.triggerElement}
                            </td>
                            <td className="py-2 px-3 font-mono text-blue-400">
                              {trans.triggerEvent || 'onClick'}
                            </td>
                            <td className="py-2 px-3 font-semibold text-emerald-400 flex items-center gap-1">
                              <span>{targetScreen ? targetScreen.title.replace(/^\d+\.\s*/, '') : (trans.targetScreen || 'Action')}</span>
                            </td>
                            <td className="py-2 px-3 font-mono text-[11px] text-slate-400">
                              {trans.transitionAnimation || 'slide-left'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2.1: Developer Sticky Notes & Screen Annotations */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-amber-400" />
                    2.1 Screen Developer Sticky Notes & Architecture Context
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {project.screens.reduce((sum, s) => sum + (s.annotations?.length || 0), 0)} Placed Notes & Pins
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Screen</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Developer Context / Instruction</th>
                        <th className="py-2.5 px-3">Pinned Component</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {project.screens.flatMap(screen =>
                        (screen.annotations || []).map((ann, aIdx) => {
                          const attachedEl = screen.elements.find(e => e.id === ann.pinnedElementId);
                          return (
                            <tr key={`${screen.id}_ann_${aIdx}`} className="hover:bg-slate-800/30 transition-colors">
                              <td className="py-2 px-3 font-semibold text-white">
                                {screen.title.replace(/^\d+\.\s*/, '')}
                              </td>
                              <td className="py-2 px-3">
                                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                  ann.type === 'sticky_note' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                }`}>
                                  {ann.type === 'sticky_note' ? '📝 Sticky Note' : '📍 Pin'}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-mono text-[11px] text-blue-400">
                                {ann.category.toUpperCase()}
                              </td>
                              <td className="py-2 px-3 text-slate-200">
                                <span className="font-bold text-white block">{ann.title || 'Note'}</span>
                                <span className="text-[11px] text-slate-400">{ann.content}</span>
                              </td>
                              <td className="py-2 px-3 font-mono text-[11px] text-slate-400">
                                {attachedEl ? attachedEl.name : 'Whole Screen'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                      {project.screens.every(s => !s.annotations || s.annotations.length === 0) && (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-500 italic">
                            No sticky notes placed yet. Use the Annotate tool on canvas to drop notes and pins.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Component Specifications */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-purple-400" />
                  3. Screen & Component Prop Specifications
                </h3>

                <div className="space-y-3">
                  {project.screens.map((screen, sIdx) => (
                    <div key={screen.id} className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                      <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span className="text-slate-500 font-mono">0{sIdx + 1}.</span>
                          <span>{screen.title}</span>
                          <span className="font-mono text-blue-400 font-normal">({screen.route})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          bg: {screen.backgroundColor} • status: {screen.statusBarColor}
                        </div>
                      </div>

                      <div className="p-3 divide-y divide-slate-800/50">
                        {screen.elements.map(el => (
                          <div key={el.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="rounded bg-blue-600/20 text-blue-400 text-[10px] font-mono px-2 py-0.5 uppercase font-bold shrink-0">
                                {el.type}
                              </span>
                              <span className="font-semibold text-white truncate">{el.label || el.name}</span>
                              {el.helperText && (
                                <span className="text-slate-500 text-[11px] truncate hidden md:inline">
                                  — {el.helperText}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 shrink-0 text-[11px]">
                              <span className="text-slate-400">Variant: {el.variant || 'default'}</span>
                              {el.hasAction ? (
                                <span className="text-emerald-400 font-semibold font-mono">
                                  → {el.targetScreenId || el.actionType}
                                </span>
                              ) : (
                                <span className="text-slate-500">Static</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Design Tokens & Style Specifications */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="h-4 w-4 text-amber-400" />
                  4. Design System Tokens & Style Specifications
                </h3>

                {/* Color Swatches */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300">Brand Color Palette Tokens</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { name: 'Primary Blue', hex: '#2563EB', desc: 'Buttons & Accents' },
                      { name: 'Deep Slate', hex: '#0F172A', desc: 'Background Viewport' },
                      { name: 'Surface Slate', hex: '#1E293B', desc: 'Cards & Containers' },
                      { name: 'Success Emerald', hex: '#10B981', desc: 'Verified Badges' },
                      { name: 'Amber Glow', hex: '#F59E0B', desc: 'Highlights & Alerts' },
                    ].map(c => (
                      <div key={c.hex} className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 flex flex-col gap-1.5">
                        <div style={{ backgroundColor: c.hex }} className="h-8 w-full rounded-lg shadow-inner border border-white/10" />
                        <span className="text-xs font-bold text-white">{c.name}</span>
                        <span className="text-[10px] font-mono text-blue-400">{c.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tokens Standards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2 text-xs">
                    <span className="font-bold text-white block">Typography Hierarchy</span>
                    <div className="text-slate-400 text-[11px] space-y-1">
                      <div><strong className="text-slate-300">UI Font:</strong> Plus Jakarta Sans, system-ui, sans-serif</div>
                      <div><strong className="text-slate-300">Mono & Numbers:</strong> JetBrains Mono, monospace</div>
                      <div><strong className="text-slate-300">Headings:</strong> Bold 700 / 800, tight tracking</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2 text-xs">
                    <span className="font-bold text-white block">Border Radii Specifications</span>
                    <div className="text-slate-400 text-[11px] space-y-1">
                      <div><strong className="text-slate-300">Cards & Modals:</strong> 16px (1.0rem)</div>
                      <div><strong className="text-slate-300">Action Buttons:</strong> 14px (0.875rem)</div>
                      <div><strong className="text-slate-300">Inputs & TextFields:</strong> 12px (0.75rem)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Hardware & Integration Guides */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-400" />
                  5. Hardware Device Profiles & Native Framework Integration
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs space-y-1">
                    <div className="font-bold text-white">Apple iPhone 16 Pro</div>
                    <div className="text-[11px] text-blue-400 font-mono">393 × 852 pt • iOS 18+</div>
                    <p className="text-[10px] text-slate-400 leading-tight">SwiftUI NavigationStack with Dynamic Island status padding.</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs space-y-1">
                    <div className="font-bold text-white">Google Pixel 9 Pro</div>
                    <div className="text-[11px] text-emerald-400 font-mono">412 × 915 dp • Android 15</div>
                    <p className="text-[10px] text-slate-400 leading-tight">Jetpack Compose Material 3 Scaffold with NavHost navigation.</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs space-y-1">
                    <div className="font-bold text-white">Samsung Galaxy S25</div>
                    <div className="text-[11px] text-purple-400 font-mono">384 × 832 dp • One UI 7</div>
                    <p className="text-[10px] text-slate-400 leading-tight">Edge-to-edge system bars and squared titanium corner radii.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'figma' ? (
          /* Figma REST API Document & Layouts Interactive Preview */
          <div className="relative flex-1 overflow-auto bg-slate-950 p-6">
            <div className="mx-auto max-w-5xl space-y-6">
              {/* Figma Export Hero Banner Card */}
              <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-br from-slate-900 via-[#181126] to-[#260e22] p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-purple-500 via-pink-500 to-rose-500"></div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-pink-500/20 text-pink-300 px-2 py-0.5 text-xs font-bold border border-pink-500/30 uppercase tracking-wide flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5" />
                        Figma REST API Format
                      </span>
                      <span className="rounded-md bg-purple-500/20 text-purple-300 px-2 py-0.5 text-xs font-mono">
                        File Schema v0.0.1
                      </span>
                      <span className="rounded-md bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-xs font-bold">
                        Auto-Layout & Prototyping Ready
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-white tracking-tight">
                      Figma REST API Screen Layouts & Element Hierarchies
                    </h2>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      Generated canonical Figma REST API node tree (<code className="text-pink-300">DOCUMENT → CANVAS → FRAME</code>) containing all mobile screen artboards, nested component hierarchies (Buttons, Inputs, Carousels, Video Players, Cards, Headers), auto-layout properties, and interactive prototyping transition links.
                    </p>
                  </div>

                  {/* Direct Download Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleDownloadFigmaJson}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-pink-500/25 transition-all active:scale-95"
                      title="Download full Figma REST API compatible JSON file"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Figma JSON</span>
                    </button>

                    <button
                      onClick={handleDownloadFigmaScript}
                      className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-600/20 hover:bg-purple-600 hover:text-white px-3.5 py-2 text-xs font-bold text-purple-200 transition-all active:scale-95 shadow-sm"
                      title="Download 1-Click Figma Desktop Plugin Importer Script"
                    >
                      <FileCode className="h-4 w-4 text-purple-300" />
                      <span>Plugin Script (.js)</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pl-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Screen Artboard Frames</div>
                    <div className="mt-1 font-mono text-xl font-bold text-white">{project.screens.length} Screens</div>
                    <div className="text-[10px] text-pink-400 font-medium">Mapped to Figma FRAMEs</div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Element Hierarchy Nodes</div>
                    <div className="mt-1 font-mono text-xl font-bold text-white">
                      {project.screens.reduce((acc, s) => acc + s.elements.length, 0)} Elements
                    </div>
                    <div className="text-[10px] text-purple-400 font-medium">Auto-layout + nested text</div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prototype Transition Links</div>
                    <div className="mt-1 font-mono text-xl font-bold text-white">
                      {project.screens.reduce((acc, s) => acc + s.elements.filter(e => e.hasAction && e.targetScreenId).length, 0)} Links
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">Figma Prototype Vectors</div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Figma Design Styles</div>
                    <div className="mt-1 font-mono text-xl font-bold text-white">
                      {Object.keys(figmaRestPayload.styles).length} Token Styles
                    </div>
                    <div className="text-[10px] text-blue-400 font-medium">Color & typography tokens</div>
                  </div>
                </div>
              </div>

              {/* Format Toggle & Quick Copy */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">View Format:</span>
                  <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                    <button
                      onClick={() => setFigmaSubmode('json')}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                        figmaSubmode === 'json'
                          ? 'bg-pink-600 text-white shadow-sm font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Braces className="h-3.5 w-3.5" />
                      <span>Figma REST API Document (JSON)</span>
                    </button>
                    <button
                      onClick={() => setFigmaSubmode('script')}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                        figmaSubmode === 'script'
                          ? 'bg-purple-600 text-white shadow-sm font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Terminal className="h-3.5 w-3.5" />
                      <span>1-Click Figma Console Script (JS)</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 3 Step Integration Guide Callout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 font-mono text-[10px]">1</span>
                    <span>Direct Figma Desktop Console</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Open Figma Desktop → Select <strong>Plugins → Development → Open Console</strong> (or Scripter) → Paste the Script tab contents and hit Run. All frames render with native auto-layout!
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500/20 text-pink-400 font-mono text-[10px]">2</span>
                    <span>Figma REST API & Webhooks</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Use the JSON with the official Figma REST API (<code className="text-slate-300">GET/POST /v1/files</code>), CI/CD design token sync pipelines, or automated document transformers.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">3</span>
                    <span>Community Plugins</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Load directly into popular community importer plugins like <strong>JSON to Figma</strong>, <strong>Builder.io Figma Plugin</strong>, or <strong>html-to-figma</strong>.
                  </p>
                </div>
              </div>

              {/* Formatted Code Inspector */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{figmaSubmode === 'script' ? `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-figma-importer.js` : `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-figma-rest.json`}</span>
                  <span>{figmaSubmode === 'script' ? 'JavaScript (Figma Plugin API)' : 'JSON (Figma REST Document)'}</span>
                </div>
                <div className="p-4 max-h-[460px] overflow-auto font-mono text-xs text-slate-300 leading-relaxed">
                  <pre className="overflow-x-auto whitespace-pre font-mono">
                    {figmaSubmode === 'script' ? figmaPluginScript : JSON.stringify(figmaRestPayload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Code View Area for other tabs */
          <div className="relative flex-1 overflow-auto bg-slate-950 p-6 font-mono text-xs text-slate-300">
            <pre className="overflow-x-auto whitespace-pre font-mono leading-relaxed">
              {getActiveCode()}
            </pre>
          </div>
        )}

        {/* Footer Info Bar */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/90 px-6 py-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">
              Technical handoff documentation includes component contracts, flow state transitions, style tokens, and hardware specs.
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            JSON Schema Draft-07 • jsPDF Multi-Page Generator • SwiftUI • Jetpack Compose
          </span>
        </div>
      </div>
    </div>
  );
};

function generateDeveloperMarkdown(project: Project): string {
  const initialScreen = project.screens.find(s => s.isEntry) || project.screens[0];

  return `# Developer Technical Handoff Specification
**Project:** ${project.name}  
**Target Mobile Models:** Apple iPhone 16 Pro, Google Pixel 9 Pro, Samsung Galaxy S25 Ultra  
**Entry Route:** ${initialScreen?.route || '/'}  
**Generated Date:** ${new Date().toISOString()}  

---

## 1. User Journey Flow Interaction Matrix

| Source Screen | Trigger Element | Event Trigger | Destination Screen | Transition Motion |
|---|---|---|---|---|
${project.screens.flatMap(screen => 
  screen.elements
    .filter(e => e.hasAction)
    .map(e => `| **${screen.title}** (\`${screen.route}\`) | ${e.name} (\`${e.type}\`) | \`${e.trigger || 'onClick'}\` | **${project.screens.find(s => s.id === e.targetScreenId)?.title || 'Previous Screen'}** | \`${e.transition || 'slide-left'}\` |`)
).join('\n')}

---

## 2. Developer Sticky Notes & Architecture Context Matrix

| Screen | Type | Category | Instruction & Developer Context | Author | Target Component |
|---|---|---|---|---|---|
${project.screens.flatMap(screen =>
  (screen.annotations || []).map(a => {
    const el = screen.elements.find(e => e.id === a.pinnedElementId);
    return `| **${screen.title}** | ${a.type === 'pin' ? '📍 Pin' : '📝 Sticky Note'} | \`${a.category.toUpperCase()}\` | ${a.content.replace(/\|/g, '-')} | ${a.author || 'Architect'} | ${el ? `\`${el.name}\`` : 'Whole Screen'} |`;
  })
).join('\n') || '| *No annotations placed* | - | - | - | - | - |'}

---

## 3. Multi-Platform Native Architecture Guide

### iOS (Apple iPhone 16 Pro)
- **Language:** Swift 6.0 / SwiftUI 5+
- **Entry File:** \`ios-native/SwiftUI/ContentView.swift\`
- **Key Features:** \`NavigationStack\`, Dynamic Island safe-area padding, SF Symbols, smooth spring transitions.

### Android (Google Pixel 9 Pro & Samsung Galaxy S25)
- **Language:** Kotlin 2.0 / Jetpack Compose BOM 2024.09+
- **Entry File:** \`android-native/JetpackCompose/MainActivity.kt\`
- **Key Features:** Material 3 \`Scaffold\`, \`NavHost\` navigation graph, Dynamic color adaptation, edge-to-edge system bars.

### Universal Cross-Platform
- **React Native / Expo:** \`react-native/App.tsx\`
- **Flutter / Dart:** \`flutter/lib/main.dart\`

---

## 4. Screen Hierarchy, Component Prop Contracts & Annotations

${project.screens.map((screen, idx) => `
### 0${idx + 1}. ${screen.title}
- **Route Path:** \`${screen.route}\`
- **Background Color:** \`${screen.backgroundColor}\`
- **Status Bar:** \`${screen.statusBarColor}\`
- **Initial Entry Point:** \`${screen.isEntry}\`
${screen.annotations && screen.annotations.length > 0 ? `- **Developer Annotations (${screen.annotations.length}):**\n${screen.annotations.map(a => `  - **[${a.type === 'pin' ? 'PIN' : 'STICKY NOTE'} • ${a.category.toUpperCase()}]** ${a.title ? `${a.title}: ` : ''}${a.content} *(Author: ${a.author || 'Architect'})*`).join('\n')}` : '- **Developer Annotations:** None'}
- **Components:**
${screen.elements.map(el => `  - **${el.name}** (\`${el.type}\`): ${el.label} ${el.hasAction ? `*(Navigates to: ${el.targetScreenId})*` : ''}`).join('\n')}
`).join('\n')}

---

## 4. Run & Test Instructions

1. Extract the downloaded ZIP archive.
2. For iOS: Open Xcode, import \`ios-native/SwiftUI/ContentView.swift\` into a new SwiftUI App, and run on iPhone 16 Pro Simulator.
3. For Android: Open Android Studio, copy \`android-native/JetpackCompose/MainActivity.kt\` into \`com.flowcraft.mobile.ui\`, and run on Pixel 9 Pro or Galaxy S25.
4. For Web Prototype: Run \`npm install && npm run dev\` inside \`web-prototype/\`.
`;
}
