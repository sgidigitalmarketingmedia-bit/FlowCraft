import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, Square, Save, Settings, Eye, CheckCircle2, AlertCircle, Scan, 
  Camera, ShieldAlert, FileText, MapPin, Mail, Sparkles, Check, 
  RefreshCw, X, ChevronRight, ChevronLeft, HelpCircle, ArrowRight, CornerDownRight, 
  Terminal, ShieldCheck, UserCheck, Layers, Cpu, Search, Plus, 
  Link2, Trash2, Smartphone, Shield, Sliders, SmartphoneCharging, Clock,
  Volume2, VolumeX, SplitSquareVertical, Move, Minimize2, Maximize2,
  Share2, Compass, Download, Bell, MessageSquare, Gift, CreditCard,
  ShoppingCart, Star, WifiOff, RefreshCcw, User, ExternalLink, Award,
  Filter, RotateCw
} from 'lucide-react';
import { StudioNode, StudioCable, NodeCategory } from './types';
import { DeveloperPropertiesPanel } from './DeveloperPropertiesPanel';
import { AIFlowGeneratorModal } from './AIFlowGeneratorModal';
import { KYCNodeMobileScreen } from './KYCNodeMobileScreen';
import { speakUKExplanation, stopSpeechNarration } from '../../utils/speechNarration';

export const NodeJourneyStudio: React.FC = () => {
  // Master Comprehensive Node Library with ALL Categories (Zero Duplicates)
  const FULL_NODE_LIBRARY: {
    type: string;
    name: string;
    category: NodeCategory;
    icon: any;
    desc: string;
    narration: string;
    defaultProps: StudioNode['properties'];
  }[] = [
    // =========================================================
    // 1. DISCOVERY & ACQUISITION NODES
    // =========================================================
    {
      type: 'marketing_touchpoint',
      name: 'Marketing Touchpoint',
      category: 'Discovery & Acquisition',
      icon: Share2,
      desc: 'Social media ads, search engine results, or blog posts',
      narration: 'Marketing Touchpoint. Initial external discovery touchpoint bringing users into the product ecosystem.',
      defaultProps: { campaignSource: 'Meta / Instagram', attributionWindowDays: 7, estimatedCompletionSeconds: 5 }
    },
    {
      type: 'deep_link',
      name: 'Deep Link / Universal Link',
      category: 'Discovery & Acquisition',
      icon: ExternalLink,
      desc: 'Transition from web browser or external link directly to in-app route',
      narration: 'Universal Deep Link. Seamlessly routing external web visitors into targeted native screen states.',
      defaultProps: { deepLinkPath: 'finpulse://invite/alpha-launch', deferredRouting: true, estimatedCompletionSeconds: 2 }
    },
    {
      type: 'app_store_listing',
      name: 'App Store Listing',
      category: 'Discovery & Acquisition',
      icon: Download,
      desc: 'App Store or Google Play page optimized with screenshots and reviews',
      narration: 'App Store Listing. Presenting conversion-optimized product screenshots, user ratings, and feature previews.',
      defaultProps: { appStorePlatform: 'Apple App Store', conversionRateGoal: 32, estimatedCompletionSeconds: 15 }
    },

    // =========================================================
    // 2. ONBOARDING & ACTIVATION NODES
    // =========================================================
    {
      type: 'splash_screen',
      name: 'Splash Screen',
      category: 'Onboarding & Activation',
      icon: Sparkles,
      desc: 'Initial loading screen displaying branding and visual tone',
      narration: 'Splash Screen. Displaying product branding and establishing visual tone while initializing dependencies.',
      defaultProps: { splashDurationSeconds: 2, estimatedCompletionSeconds: 2 }
    },
    {
      type: 'value_prop_tour',
      name: 'Value Proposition Tour',
      category: 'Onboarding & Activation',
      icon: Compass,
      desc: '3 to 4-screen swipeable carousel highlighting core features and benefits',
      narration: 'Value Proposition Tour. Walk through swipeable benefit cards showcasing primary value propositions.',
      defaultProps: { carouselSlidesCount: 3, skipEnabled: true, estimatedCompletionSeconds: 12 }
    },
    {
      type: 'identity_provision',
      name: 'Identity Provision (Sign up/Login)',
      category: 'Onboarding & Activation',
      icon: UserCheck,
      desc: 'Social sign-ons (Apple, Google), biometrics (FaceID), or email',
      narration: 'Identity Provision. Enabling frictionless social sign-on and biometric credentials with zero password fatigue.',
      defaultProps: { authProviders: ['Apple', 'Google', 'Biometric Passkey'], mfaRequired: true, estimatedCompletionSeconds: 18 }
    },
    {
      type: 'permissions_request',
      name: 'System Permissions Request',
      category: 'Onboarding & Activation',
      icon: ShieldAlert,
      desc: 'Contextual prompts explaining camera, location, and notification access',
      narration: 'System Permissions Request. Contextually explaining why camera, location, or notifications are needed.',
      defaultProps: { permissionsRequired: ['Camera', 'Location'], permissionExplanationRigor: 'standard', estimatedCompletionSeconds: 8 }
    },
    {
      type: 'profile_personalization',
      name: 'Profile Personalization',
      category: 'Onboarding & Activation',
      icon: User,
      desc: 'Initial preference selection to customize dashboard goals',
      narration: 'Profile Personalization. Capturing user goals and financial risk tolerances to tailor the workspace.',
      defaultProps: { personalizationTags: ['Global Transfers', 'Crypto Vault', 'High APY Yield'], estimatedCompletionSeconds: 14 }
    },
    {
      type: 'interactive_walkthrough',
      name: 'Interactive Guided Walkthrough',
      category: 'Onboarding & Activation',
      icon: Play,
      desc: 'Contextual step-by-step tutorial guiding user to their "Aha!" moment',
      narration: 'Interactive Guided Walkthrough. Step-by-step micro-tutorial ensuring the user experiences their primary aha moment.',
      defaultProps: { walkthroughStepsCount: 3, estimatedCompletionSeconds: 20 }
    },

    // =========================================================
    // 3. CORE ENGAGEMENT & NAVIGATION NODES
    // =========================================================
    {
      type: 'home_dashboard',
      name: 'Home Dashboard',
      category: 'Core Engagement & Navigation',
      icon: Layers,
      desc: 'Central hub displaying personalized content, balance, and quick actions',
      narration: 'Home Dashboard. The central operational hub displaying live vault balances and quick transfer actions.',
      defaultProps: { refreshIntervalSeconds: 15, dashboardWidgets: ['Vault Balance', 'Quick Pay', 'Activity'], estimatedCompletionSeconds: 10 }
    },
    {
      type: 'global_navigation',
      name: 'Global Navigation',
      category: 'Core Engagement & Navigation',
      icon: Compass,
      desc: 'Bottom tab bar or hamburger menu providing instant section access',
      narration: 'Global Navigation. Providing persistent, thumb-friendly access across the primary application artboards.',
      defaultProps: { navStyle: 'Bottom Tab Bar', activeTabsCount: 4, estimatedCompletionSeconds: 2 }
    },
    {
      type: 'search_discovery',
      name: 'Search & Discovery',
      category: 'Core Engagement & Navigation',
      icon: Search,
      desc: 'Search bar with filters, auto-suggestions, and recent history',
      narration: 'Search and Discovery. Real-time indexed query engine with auto-suggestions across payees and assets.',
      defaultProps: { instantAutoSuggest: true, estimatedCompletionSeconds: 6 }
    },
    {
      type: 'detail_item_view',
      name: 'Detail/Item Views',
      category: 'Core Engagement & Navigation',
      icon: FileText,
      desc: 'Dedicated page for deep-diving into specific content, products, or data',
      narration: 'Detail Item View. Rich multi-metric breakdown including performance sparklines and order parameters.',
      defaultProps: { detailLayoutTemplate: 'Hero Media', estimatedCompletionSeconds: 12 }
    },
    {
      type: 'action_confirmation',
      name: 'Action Confirmation',
      category: 'Core Engagement & Navigation',
      icon: CheckCircle2,
      desc: 'Dialogs, bottom sheets, or snackbars confirming task completion or failure',
      narration: 'Action Confirmation. Explicit haptic feedback acknowledging state changes and transaction commitments.',
      defaultProps: { actionConfirmStyle: 'Modal Sheet', estimatedCompletionSeconds: 3 }
    },
    {
      type: 'empty_state',
      name: 'Empty States',
      category: 'Core Engagement & Navigation',
      icon: FileText,
      desc: 'Engaging placeholders guiding users when a screen has no data yet',
      narration: 'Empty States. Action-oriented empty views transforming inactive moments into guided activation steps.',
      defaultProps: { emptyStateActionLabel: 'Make First Deposit', estimatedCompletionSeconds: 5 }
    },

    // =========================================================
    // 4. RETENTION & RE-ENGAGEMENT NODES
    // =========================================================
    {
      type: 'push_notifications',
      name: 'Push Notifications',
      category: 'Retention & Re-engagement',
      icon: Bell,
      desc: 'Targeted, contextual alerts delivered to the device lock screen',
      narration: 'Push Notifications. Delivering timely, high-value alerts directly to the device lock screen to re-engage.',
      defaultProps: { pushCadence: 'Smart AI Optimized', pushPriority: 'High', estimatedCompletionSeconds: 4 }
    },
    {
      type: 'in_app_messages',
      name: 'In-App Messages',
      category: 'Retention & Re-engagement',
      icon: MessageSquare,
      desc: 'Banners or modals during active usage to announce updates or rewards',
      narration: 'In-App Messages. Contextual modal announcement highlighting promotions and newly unlocked benefits.',
      defaultProps: { inAppBannerPosition: 'Top Floating', estimatedCompletionSeconds: 6 }
    },
    {
      type: 'activity_feed',
      name: 'Activity Feed / Notifications Center',
      category: 'Retention & Re-engagement',
      icon: Bell,
      desc: 'Dedicated inbox logging all relevant updates, alerts, and interactions',
      narration: 'Activity Feed and Notification Center. Consolidated audit trail logging financial events and compliance milestones.',
      defaultProps: { activityFeedRetentionDays: 90, estimatedCompletionSeconds: 8 }
    },
    {
      type: 'gamification_rewards',
      name: 'Gamification / Loyalty Rewards',
      category: 'Retention & Re-engagement',
      icon: Gift,
      desc: 'Progress bars, badges, or points pages rewarding consistent usage',
      narration: 'Gamification and Loyalty Rewards. Tiered milestone progression awarding fee waivers for frequent volume.',
      defaultProps: { loyaltyTierLevels: 5, pointsMultiplier: 1.5, estimatedCompletionSeconds: 10 }
    },

    // =========================================================
    // 5. CONVERSION & TRANSACTION NODES
    // =========================================================
    {
      type: 'paywall_pricing',
      name: 'Paywall / Pricing Tier View',
      category: 'Conversion & Transaction',
      icon: CreditCard,
      desc: 'Clear presentation of premium features, subscriptions, or prices',
      narration: 'Paywall and Pricing Tier. Value-dense comparison card highlighting institutional membership advantages.',
      defaultProps: { pricingBillingCycle: 'Annual (20% Off)', paywallDiscountPercent: 20, estimatedCompletionSeconds: 16 }
    },
    {
      type: 'cart_checkout',
      name: 'Cart / Checkout Flow',
      category: 'Conversion & Transaction',
      icon: ShoppingCart,
      desc: 'Frictionless, multi-step or single-page view to review purchases',
      narration: 'Cart and Checkout Flow. Single-screen invoice breakdown displaying order line items and shipping details.',
      defaultProps: { checkoutStepCount: 1, guestCheckoutAllowed: false, estimatedCompletionSeconds: 15 }
    },
    {
      type: 'payment_gateway',
      name: 'Payment Gateway Integration',
      category: 'Conversion & Transaction',
      icon: CreditCard,
      desc: 'Secure payment nodes (Apple Pay, Google Pay) with biometric validation',
      narration: 'Payment Gateway Integration. One-touch cryptographic payment verification with Apple Pay and Google Pay.',
      defaultProps: { paymentMethods: ['Apple Pay', 'Google Pay', 'Credit Card'], biometricPayAuth: true, estimatedCompletionSeconds: 8 }
    },
    {
      type: 'success_receipt',
      name: 'Success & Receipt Generation',
      category: 'Conversion & Transaction',
      icon: CheckCircle2,
      desc: 'Explicit confirmation screen alongside an automated email receipt',
      narration: 'Success and Receipt Generation. Confirmed transaction settlement with verifiable digital cryptographic receipt.',
      defaultProps: { automatedEmailReceipt: true, estimatedCompletionSeconds: 4 }
    },

    // =========================================================
    // 6. SUPPORT & FEEDBACK NODES
    // =========================================================
    {
      type: 'help_center_faq',
      name: 'Help Center / FAQ',
      category: 'Support & Feedback',
      icon: HelpCircle,
      desc: 'Searchable database of articles solving common user pain points',
      narration: 'Help Center and FAQ. Curated self-service troubleshooting guides covering transfers, limits, and accounts.',
      defaultProps: { faqCategoryCount: 6, estimatedCompletionSeconds: 15 }
    },
    {
      type: 'live_chat_support',
      name: 'Live Chat / Ticketing Support',
      category: 'Support & Feedback',
      icon: MessageSquare,
      desc: 'In-app channel to speak with customer service or an AI chatbot',
      narration: 'Live Chat and Support Ticketing. Direct real-time channel connecting customers to support engineers.',
      defaultProps: { liveChatProvider: 'AI Assistant', chatResponseTargetMins: 1, estimatedCompletionSeconds: 25 }
    },
    {
      type: 'in_app_feedback',
      name: 'In-App Feedback Prompt',
      category: 'Support & Feedback',
      icon: Star,
      desc: 'Micro-surveys (e.g. Net Promoter Score) triggered after positive milestone',
      narration: 'In-App Feedback Prompt. Lightweight Net Promoter Score micro-survey measuring onboarding satisfaction.',
      defaultProps: { feedbackTriggerEvent: 'Post-Transaction', npsScale: '1-10 NPS', estimatedCompletionSeconds: 8 }
    },
    {
      type: 'app_store_rating',
      name: 'App Store Rating Prompt',
      category: 'Support & Feedback',
      icon: Star,
      desc: 'System-level prompt asking for a 5-star review after success milestone',
      narration: 'App Store Rating Prompt. System-level five-star review dialogue triggered following a successful milestone.',
      defaultProps: { ratingMinMilestone: 3, estimatedCompletionSeconds: 6 }
    },

    // =========================================================
    // 7. ACCOUNT MANAGEMENT & SYSTEM NODES
    // =========================================================
    {
      type: 'profile_settings',
      name: 'Profile / Settings Adjustment',
      category: 'Account Management & System',
      icon: Settings,
      desc: 'Managing personal info, security, and notification preferences',
      narration: 'Profile and Settings Adjustment. Managing cryptographic passkeys, two-factor authentication, and app appearance.',
      defaultProps: { securityMfaMethod: 'TOTP Authenticator', estimatedCompletionSeconds: 15 }
    },
    {
      type: 'offline_mode',
      name: 'Offline Mode Indicator',
      category: 'Account Management & System',
      icon: WifiOff,
      desc: 'Visual cues showing limited functionality when connectivity is lost',
      narration: 'Offline Mode Indicator. Displaying network resilience cues and serving locally verified cached ledgers.',
      defaultProps: { offlineCacheDurationHours: 24, estimatedCompletionSeconds: 4 }
    },
    {
      type: 'app_update_modal',
      name: 'App Update / Maintenance Modals',
      category: 'Account Management & System',
      icon: RefreshCcw,
      desc: 'Forced or optional update screens ensuring latest version security',
      narration: 'App Update and Maintenance Modals. Ensuring client compatibility with essential security patch updates.',
      defaultProps: { forceAppUpdateMinVersion: 'v4.2.0', estimatedCompletionSeconds: 5 }
    },
    {
      type: 'account_deletion',
      name: 'Account Deletion / Data Export',
      category: 'Account Management & System',
      icon: Trash2,
      desc: 'GDPR/CCPA compliant flows to seamlessly delete account or export data',
      narration: 'Account Deletion and Data Export. Full regulatory compliance for data subject rights and account erasure.',
      defaultProps: { gdprDataExportFormat: 'JSON', deletionCoolingOffDays: 30, estimatedCompletionSeconds: 20 }
    },

    // =========================================================
    // 8. IDENTITY & OCR NODES (PRESERVED)
    // =========================================================
    { 
      type: 'id_scan_passport', 
      name: 'ID Scan (Passport)', 
      category: 'Identity & OCR', 
      icon: Scan, 
      desc: 'Machine-Readable Zone (MRZ) & optical character extraction',
      narration: 'ID Scan Passport. The camera detects the machine-readable zone and extracts authenticated personal details.',
      defaultProps: { ocrConfidenceThreshold: 96, extractionMode: 'realtime', barcodeParsing: true, estimatedCompletionSeconds: 22 }
    },
    { 
      type: 'id_scan_dl', 
      name: 'ID Scan (Driver License)', 
      category: 'Identity & OCR', 
      icon: Scan, 
      desc: 'PDF417 barcode decoding and DMV identity cross-check',
      narration: 'ID Scan Driver License. Decoding the PDF 417 barcode and verifying with motor vehicle records.',
      defaultProps: { ocrConfidenceThreshold: 92, extractionMode: 'realtime', barcodeParsing: true, estimatedCompletionSeconds: 20 }
    },
    { 
      type: 'doc_upload', 
      name: 'Document Upload', 
      category: 'Identity & OCR', 
      icon: FileText, 
      desc: 'Bank statement or utility bill proof with auto-deskew',
      narration: 'Document Upload. Auto-deskewing proof of address and confirming the document date is within ninety days.',
      defaultProps: { addressValidityDays: 90, matchingRigor: 'strict', estimatedCompletionSeconds: 35 }
    },

    // =========================================================
    // 9. BIOMETRICS NODES (PRESERVED)
    // =========================================================
    { 
      type: 'liveness_3d', 
      name: '3D Liveness Detection', 
      category: 'Biometrics', 
      icon: Camera, 
      desc: 'Passive sub-millimeter biometric face depth validation',
      narration: 'Three D Liveness Detection. Verifying sub-millimetre facial depth to guarantee a live presence without spoofing.',
      defaultProps: { livenessMode: 'passive', depthSensitivity: 0.88, antiSpoofModel: 'neural-depth-v3.4', estimatedCompletionSeconds: 12 }
    },
    { 
      type: 'face_match', 
      name: 'Facial 1:1 Match', 
      category: 'Biometrics', 
      icon: UserCheck, 
      desc: 'Compare live selfie biometrics to photo ID avatar',
      narration: 'Facial One to One Match. Performing neural comparison between government ID portrait and live selfie capture.',
      defaultProps: { depthSensitivity: 0.95, antiSpoofModel: 'biometric-match-v4.0', estimatedCompletionSeconds: 6 }
    },

    // =========================================================
    // 10. RISK & FRAUD NODES (PRESERVED)
    // =========================================================
    { 
      type: 'risk_score', 
      name: 'AI Risk Score', 
      category: 'Risk & Fraud', 
      icon: ShieldAlert, 
      desc: 'Real-time fraud network probability ML engine',
      narration: 'A I Risk Score calculation. Checking device telemetry, IP velocity, and fraud networks in real time.',
      defaultProps: { riskThreshold: 15, fraudEngine: 'Internal ML', sanctionsCheck: true, estimatedCompletionSeconds: 3 }
    },
    { 
      type: 'geoip_velocity', 
      name: 'GeoIP & Device Velocity', 
      category: 'Risk & Fraud', 
      icon: MapPin, 
      desc: 'Detect VPN proxy, spoofed location, and emulator hardware',
      narration: 'Geo I P and Device Velocity. Authenticating genuine device hardware and checking for V P N or proxy masking.',
      defaultProps: { geoIpVelocity: true, riskThreshold: 20, estimatedCompletionSeconds: 2 }
    },

    // =========================================================
    // 11. CONTACT VERIFICATION NODES (PRESERVED)
    // =========================================================
    { 
      type: 'sms_otp', 
      name: 'Phone SMS OTP', 
      category: 'Contact Verification', 
      icon: Smartphone, 
      desc: 'Carrier SS7 lookup and 6-digit cryptographic passcode',
      narration: 'Phone S M S verification. Sending a one-time passcode and validating telecom carrier authenticity.',
      defaultProps: { smsOtpLength: 6, otpRetryLimit: 3, estimatedCompletionSeconds: 18 }
    },
    { 
      type: 'email_verify', 
      name: 'Email Deliverability', 
      category: 'Contact Verification', 
      icon: Mail, 
      desc: 'Verify MX records, disposable domain check & age rating',
      narration: 'Email deliverability check. Verifying mail exchange servers and screening against disposable email providers.',
      defaultProps: { emailMxCheck: true, estimatedCompletionSeconds: 2 }
    },

    // =========================================================
    // 12. COMPLIANCE & AML NODES (PRESERVED)
    // =========================================================
    { 
      type: 'address_registry', 
      name: 'Address Verification', 
      category: 'Compliance & AML', 
      icon: MapPin, 
      desc: 'National postal address authority database cross-match',
      narration: 'Postal registry verification. Cross-referencing national databases to confirm the residential address.',
      defaultProps: { addressValidityDays: 90, matchingRigor: 'strict', estimatedCompletionSeconds: 15 }
    },
    { 
      type: 'aml_sanctions', 
      name: 'AML & Sanctions PEP', 
      category: 'Compliance & AML', 
      icon: Shield, 
      desc: 'Screen OFAC, UN, EU watchlists and Politically Exposed Persons',
      narration: 'Anti-money laundering and sanctions screening. Searching global watchlists and politically exposed persons registries.',
      defaultProps: { sanctionsCheck: true, estimatedCompletionSeconds: 4 }
    },
  ];

  // Active nodes on canvas
  const [nodes, setNodes] = useState<StudioNode[]>([
    {
      id: 'node_1',
      type: 'id_scan_passport',
      name: 'ID Scan (Passport)',
      category: 'Identity & OCR',
      x: 80,
      y: 100,
      status: 'completed',
      description: 'OCR Passport extraction',
      properties: { ocrConfidenceThreshold: 96, extractionMode: 'realtime', barcodeParsing: true, estimatedCompletionSeconds: 22 },
    },
    {
      id: 'node_2',
      type: 'liveness_3d',
      name: '3D Liveness Detection',
      category: 'Biometrics',
      x: 340,
      y: 100,
      status: 'completed',
      description: '3D biometric face depth validation',
      properties: { livenessMode: 'passive', depthSensitivity: 0.88, antiSpoofModel: 'neural-depth-v3.4', estimatedCompletionSeconds: 12 },
    },
    {
      id: 'node_3',
      type: 'risk_score',
      name: 'AI Risk Score',
      category: 'Risk & Fraud',
      x: 600,
      y: 100,
      status: 'completed',
      description: 'Calculates risk threshold',
      properties: { riskThreshold: 15, fraudEngine: 'Internal ML', sanctionsCheck: true, estimatedCompletionSeconds: 3 },
    },
    {
      id: 'node_4',
      type: 'address_registry',
      name: 'Address Verification',
      category: 'Compliance & AML',
      x: 340,
      y: 310,
      status: 'completed',
      description: 'Postal address database match',
      properties: { addressValidityDays: 90, matchingRigor: 'strict', estimatedCompletionSeconds: 15 },
    },
  ]);

  // Cable connections
  const [cables, setCables] = useState<StudioCable[]>([
    { id: 'c1', fromNodeId: 'node_1', toNodeId: 'node_2' },
    { id: 'c2', fromNodeId: 'node_2', toNodeId: 'node_3' },
    { id: 'c3', fromNodeId: 'node_2', toNodeId: 'node_4' },
  ]);

  // Interactive connector pin dragging/linking state
  const [connectingFromNodeId, setConnectingFromNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node_1');
  const [selectedCableId, setSelectedCableId] = useState<string | null>(null);

  // Right Side Panel View: 'simulator' | 'properties' | 'split'
  const [rightPanelView, setRightPanelView] = useState<'simulator' | 'properties' | 'split'>('simulator');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Library Category & Search filter
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Audio Voice Narration
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Execution & Simulator State
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExecutionPaused, setIsExecutionPaused] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [executionSpeed, setExecutionSpeed] = useState<number>(1);
  const [executionProgress, setExecutionProgress] = useState(100);
  const [previewOrientation, setPreviewOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [executionSteps, setExecutionSteps] = useState<StudioNode[]>([]);
  const [logs, setLogs] = useState<{ id: string; timestamp: string; message: string; type: 'info' | 'success' | 'warn' }[]>([
    { id: 'initial_l1', timestamp: '14:21:02', message: 'Initializing KYC verification flow...', type: 'info' },
    { id: 'initial_l2', timestamp: '14:21:03', message: 'ID Scan parsed: Passport verified (Score 98%)', type: 'info' },
    { id: 'initial_l3', timestamp: '14:21:03', message: '3D Liveness check passed (Depth confidence 99.8%)', type: 'success' },
    { id: 'initial_l4', timestamp: '14:21:04', message: 'Risk Score calculated: 12/100 - Low Risk', type: 'info' },
    { id: 'initial_l5', timestamp: '14:21:05', message: 'Risk Assessment: Approved', type: 'success' },
  ]);

  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepIndexRef = useRef(0);
  const isExecutingRef = useRef(false);
  const isPausedRef = useRef(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // AI Modal & Guided Tutorial State
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const TUTORIAL_STEPS = [
    {
      title: 'Step 1: Move Nodes Freely',
      text: 'Click and drag any node on the canvas to reposition it anywhere. Cables automatically stay connected.',
    },
    {
      title: 'Step 2: Instant Mobile Preview',
      text: 'Click on any node to immediately see its live mobile screen on the smartphone simulator.',
    },
    {
      title: 'Step 3: Complete UK Voice Narration',
      text: 'Click "Execute Build" to watch the virtual phone simulate each stage with full UK female voice narration.',
    },
    {
      title: 'Step 4: Developer Properties & JSON Schema',
      text: 'Toggle to Developer Properties to adjust parameters and export frontend component schemas.',
    },
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      stopSpeechNarration();
    };
  }, []);

  // Update refs
  useEffect(() => {
    isExecutingRef.current = isExecuting;
    isPausedRef.current = isExecutionPaused;
  }, [isExecuting, isExecutionPaused]);

  // Calculate total pipeline completion time
  const totalPipelineSeconds = nodes.reduce((sum, n) => sum + (n.properties?.estimatedCompletionSeconds || 15), 0);

  // Categories list for tab filtering
  const CATEGORY_TABS: (string | NodeCategory)[] = [
    'All',
    'Discovery & Acquisition',
    'Onboarding & Activation',
    'Core Engagement & Navigation',
    'Retention & Re-engagement',
    'Conversion & Transaction',
    'Support & Feedback',
    'Account Management & System',
    'Identity & OCR',
    'Biometrics',
    'Risk & Fraud',
    'Compliance & AML',
  ];

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filtered nodes
  const filteredLibraryNodes = FULL_NODE_LIBRARY.filter(node => {
    const matchesCategory = activeCategory === 'All' || node.category === activeCategory;
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          node.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // DRAG & MOVE NODE ON CANVAS
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('[data-pin]')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    setSelectedNodeId(nodeId);

    const targetNode = nodes.find(n => n.id === nodeId);
    if (!targetNode) return;

    setDraggingNodeId(nodeId);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialNodeX = targetNode.x;
    const initialNodeY = targetNode.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      setNodes(prev => prev.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            x: Math.max(10, initialNodeX + deltaX),
            y: Math.max(10, initialNodeY + deltaY),
          };
        }
        return n;
      }));
    };

    const onMouseUp = () => {
      setDraggingNodeId(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Handle adding connector cable
  const handlePinClick = (nodeId: string, pinType: 'input' | 'output') => {
    if (pinType === 'output') {
      setConnectingFromNodeId(nodeId);
    } else if (pinType === 'input' && connectingFromNodeId) {
      if (connectingFromNodeId !== nodeId) {
        const exists = cables.some(c => c.fromNodeId === connectingFromNodeId && c.toNodeId === nodeId);
        if (!exists) {
          const newCable: StudioCable = {
            id: `cable_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            fromNodeId: connectingFromNodeId,
            toNodeId: nodeId,
          };
          setCables(prev => [...prev, newCable]);
        }
      }
      setConnectingFromNodeId(null);
    }
  };

  const getTimeString = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  const getStepNarration = (node: StudioNode, index: number, total: number) => {
    const libItem = FULL_NODE_LIBRARY.find(item => item.type === node.type || item.name === node.name);
    if (libItem?.narration) {
      return `Step ${index + 1} of ${total}. ${libItem.narration}`;
    }
    return `Step ${index + 1} of ${total}. Executing ${node.name}. Validating compliance parameters.`;
  };

  // CRITICAL FIX: Ensure UK Female voice COMPLETES 100% of her sentence BEFORE advancing to next step
  const executeStep = useCallback((stepIdx: number, pipeline: StudioNode[]) => {
    if (!isExecutingRef.current) return;
    if (stepIdx >= pipeline.length) {
      setExecutionProgress(100);
      setIsExecuting(false);
      isExecutingRef.current = false;
      const endMsg = 'Journey Complete: All flow states have executed successfully.';
      setLogs(prev => [...prev, { id: `log_end_${Date.now()}`, timestamp: getTimeString(), message: endMsg, type: 'success' }]);

      if (isVoiceEnabled) {
        setIsSpeaking(true);
        speakUKExplanation('Journey flow simulation completed successfully. All gates have passed.', {
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
      return;
    }

    const currentNode = pipeline[stepIdx];
    stepIndexRef.current = stepIdx;
    setActiveStepIndex(stepIdx);
    setSelectedNodeId(currentNode.id);

    const progressVal = Math.round(((stepIdx + 1) / pipeline.length) * 100);
    setExecutionProgress(progressVal);

    const logMsg = `Executing ${currentNode.name}... [${currentNode.category}]`;
    setLogs(prev => [...prev, { id: `log_step_${stepIdx}_${Date.now()}`, timestamp: getTimeString(), message: logMsg, type: 'info' }]);

    const advanceToNext = () => {
      if (isExecutingRef.current && !isPausedRef.current) {
        const successMsg = `${currentNode.name} step completed.`;
        setLogs(prev => [...prev, { id: `log_succ_${stepIdx}_${Date.now()}`, timestamp: getTimeString(), message: successMsg, type: 'success' }]);
        // Breath pause (850ms) so transitions feel natural
        stepTimeoutRef.current = setTimeout(() => {
          executeStep(stepIdx + 1, pipeline);
        }, 850);
      }
    };

    if (isVoiceEnabled) {
      setIsSpeaking(true);
      const textToSpeak = getStepNarration(currentNode, stepIdx, pipeline.length);

      // Advance ONLY after speech synthesis onEnd fires!
      speakUKExplanation(textToSpeak, {
        onEnd: () => {
          setIsSpeaking(false);
          advanceToNext();
        },
        onError: () => {
          setIsSpeaking(false);
          advanceToNext();
        },
      });

      // Safety timeout (14 seconds max) in case of rare browser silence
      stepTimeoutRef.current = setTimeout(() => {
        if (isSpeaking) {
          setIsSpeaking(false);
          advanceToNext();
        }
      }, 14000);
    } else {
      // Voice is off: comfortable normal duration
      const duration = Math.round(3600 / executionSpeed);
      stepTimeoutRef.current = setTimeout(() => {
        advanceToNext();
      }, duration);
    }
  }, [executionSpeed, isVoiceEnabled]);

  const getOrderedPipeline = (): StudioNode[] => {
    if (nodes.length === 0) return [];
    
    const incomingTargetIds = new Set(cables.map(c => c.toNodeId));
    const entryNodes = nodes.filter(n => !incomingTargetIds.has(n.id));

    const visitedIds = new Set<string>();
    const ordered: StudioNode[] = [];

    const traverse = (nodeId: string) => {
      if (visitedIds.has(nodeId)) return;
      visitedIds.add(nodeId);
      const n = nodes.find(item => item.id === nodeId);
      if (n) ordered.push(n);

      const outgoingCables = cables.filter(c => c.fromNodeId === nodeId);
      outgoingCables.forEach(c => traverse(c.toNodeId));
    };

    if (entryNodes.length > 0) {
      entryNodes.forEach(e => traverse(e.id));
    }

    nodes.forEach(n => {
      if (!visitedIds.has(n.id)) {
        ordered.push(n);
      }
    });

    return ordered;
  };

  const handleExecute = () => {
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    stopSpeechNarration();

    const pipeline = getOrderedPipeline();
    if (pipeline.length === 0) return;

    setExecutionSteps(pipeline);
    setIsExecuting(true);
    setIsExecutionPaused(false);
    isExecutingRef.current = true;
    isPausedRef.current = false;
    setExecutionProgress(0);
    setActiveStepIndex(0);
    setLogs([{ id: `log_start_${Date.now()}`, timestamp: getTimeString(), message: 'Starting journey build simulation...', type: 'info' }]);

    if (rightPanelView === 'properties') {
      setRightPanelView('simulator');
    }

    if (isVoiceEnabled) {
      setIsSpeaking(true);
      speakUKExplanation('Starting journey simulation. Follow along on the mobile screen as each stage is processed.', {
        onEnd: () => {
          setIsSpeaking(false);
          executeStep(0, pipeline);
        },
        onError: () => {
          setIsSpeaking(false);
          executeStep(0, pipeline);
        }
      });
    } else {
      executeStep(0, pipeline);
    }
  };

  const handlePauseResume = () => {
    if (isExecutionPaused) {
      setIsExecutionPaused(false);
      isPausedRef.current = false;
      executeStep(stepIndexRef.current, executionSteps);
    } else {
      setIsExecutionPaused(true);
      isPausedRef.current = true;
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      stopSpeechNarration();
      setIsSpeaking(false);
    }
  };

  const handleStopExecution = () => {
    setIsExecuting(false);
    setIsExecutionPaused(false);
    isExecutingRef.current = false;
    isPausedRef.current = false;
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    stopSpeechNarration();
    setIsSpeaking(false);
    setLogs(prev => [...prev, { id: `log_stop_${Date.now()}`, timestamp: getTimeString(), message: 'Simulation stopped by user.', type: 'warn' }]);
  };

  const handleAddNodeToCanvas = (template: typeof FULL_NODE_LIBRARY[0]) => {
    const newNode: StudioNode = {
      id: `node_${Date.now()}`,
      type: template.type,
      name: template.name,
      category: template.category,
      x: 100 + (nodes.length % 3) * 230,
      y: 100 + Math.floor(nodes.length / 3) * 170,
      status: 'idle',
      description: template.desc,
      properties: { ...template.defaultProps },
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const handleUpdateNodeProperties = (nodeId: string, updatedProps: Partial<StudioNode['properties']>) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          properties: { ...n.properties, ...updatedProps },
        };
      }
      return n;
    }));
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setCables(prev => prev.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const handleDeleteCable = (cableId: string) => {
    setCables(prev => prev.filter(c => c.id !== cableId));
    setSelectedCableId(null);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0] || null;
  const getNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="relative flex h-full w-full bg-[#08070D] text-slate-100 select-none overflow-hidden font-sans">
      {/* LEFT: Master Node Library Sidebar (OneSeven Tech Styling) */}
      <div className="flex h-full w-80 flex-col border-r border-violet-500/15 bg-[#0C0A18] z-20 shrink-0 shadow-2xl shadow-black/50">
        {/* Library Header */}
        <div className="border-b border-violet-500/15 p-4 bg-[#090714]/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">Master Node Library</span>
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <span className="rounded-full bg-violet-600/20 px-2 py-0.5 font-mono text-[10px] font-bold text-violet-300 border border-violet-500/30">
              {FULL_NODE_LIBRARY.length} Tools
            </span>
          </div>

          {/* Search bar */}
          <div className="relative mt-2.5">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search all journey nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-violet-500/25 bg-[#141028] pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-violet-500 focus:outline-none"
            />
          </div>

          {/* Category Dropdown Selector - Solves all cut-off menu items! */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-[#161F30] px-2.5 py-1.5 text-xs text-slate-200 font-medium focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              {CATEGORY_TABS.map((cat, idx) => {
                const count = cat === 'All' 
                  ? FULL_NODE_LIBRARY.length 
                  : FULL_NODE_LIBRARY.filter(n => n.category === cat).length;
                return (
                  <option key={`cat_opt_${cat}_${idx}`} value={cat} className="bg-[#111827] text-white">
                    {cat} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Category Horizontal Pills with Smooth Scroll Arrows */}
        <div className="relative flex items-center border-b border-slate-800 bg-[#0A0E14] px-1 py-1.5">
          <button
            onClick={() => scrollCategories('left')}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
            title="Scroll categories left"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <div 
            ref={categoryScrollRef}
            className="flex-1 flex gap-1 overflow-x-auto scrollbar-none px-1 text-[10px]"
          >
            {CATEGORY_TABS.map((cat, idx) => (
              <button
                key={`cat_${cat}_${idx}`}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-2.5 py-1 font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollCategories('right')}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
            title="Scroll categories right"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Nodes List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredLibraryNodes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={`lib_${item.type}_${idx}`}
                onClick={() => handleAddNodeToCanvas(item)}
                className="group flex w-full items-start justify-between rounded-xl border border-slate-800 bg-[#111827] p-3 text-left transition-all hover:border-blue-500/60 hover:bg-[#161F30] hover:shadow-lg"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/30 group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-blue-300 truncate">
                      {item.name}
                    </div>
                    <div className="text-[9px] text-blue-400/90 font-mono font-medium truncate">
                      {item.category}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {item.desc}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[9px] font-mono text-blue-400/90">
                      <Clock className="h-2.5 w-2.5" />
                      <span>~{item.defaultProps.estimatedCompletionSeconds}s</span>
                    </div>
                  </div>
                </div>

                <div className="rounded p-1 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="h-3.5 w-3.5 text-blue-400" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Real-time Time Gauge Footer */}
        <div className="border-t border-slate-800 p-3 bg-[#0A0E14] text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Duration:</span>
            <span className={`font-mono text-xs font-bold ${totalPipelineSeconds <= 120 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {Math.floor(totalPipelineSeconds / 60)}m {totalPipelineSeconds % 60}s {totalPipelineSeconds <= 120 ? '✅ (<2m)' : '⚠️ (>2m)'}
            </span>
          </div>
        </div>
      </div>

      {/* CENTER: Journey Canvas & Interactive Wires */}
      <div className="relative flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar Contract - OneSeven Tech Styling */}
        <div className="flex h-14 items-center justify-between border-b border-violet-500/15 bg-[#090812]/95 px-5 backdrop-blur-2xl z-30 shrink-0 shadow-md shadow-black/40">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="h-4 w-4 text-violet-400" />
              Journey Canvas Workboard
            </h2>
            <div className="flex items-center gap-1.5 rounded-full bg-[#141026] border border-violet-500/25 px-2.5 py-0.5 text-[10px] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse"></span>
              <span>{nodes.length} Nodes</span>
              <span className="text-slate-600">·</span>
              <span>{cables.length} Cables</span>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 ml-2">
              <Move className="h-3 w-3 text-violet-400" />
              <span>Drag nodes to arrange freely</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* UK VOICE NARRATION TOGGLE */}
            <button
              onClick={() => {
                const nextState = !isVoiceEnabled;
                setIsVoiceEnabled(nextState);
                if (!nextState) stopSpeechNarration();
              }}
              title="UK Female Voice Narration"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                isVoiceEnabled
                  ? 'border-violet-500/50 bg-violet-600/20 text-violet-300 shadow-sm shadow-violet-950/40'
                  : 'border-violet-500/20 bg-[#120F24] text-slate-400 hover:text-white'
              }`}
            >
              {isVoiceEnabled ? <Volume2 className="h-3.5 w-3.5 text-violet-400" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">UK Voice:</span>
              <span>{isVoiceEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* AI FLOW GENERATOR */}
            <button
              onClick={() => setIsAIOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-gradient-to-r from-violet-600/20 to-purple-600/20 px-3.5 py-1.5 text-xs font-bold text-violet-300 shadow-sm hover:from-violet-600 hover:to-purple-600 hover:text-white transition-all active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-400 fill-violet-400" />
              <span className="hidden sm:inline">AI Flow Intelligence</span>
              <span className="sm:hidden">AI</span>
            </button>

            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="flex items-center gap-1.5 rounded-xl border border-violet-500/25 bg-[#141026] px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <HelpCircle className="h-3.5 w-3.5 text-violet-400" />
              <span>Guide</span>
            </button>

            {/* ONESEVEN VIVID VIOLET EXECUTE BUTTON */}
            {!isExecuting ? (
              <button
                onClick={handleExecute}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-600/35 border border-violet-400/30 transition-all active:scale-95"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Execute Build</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePauseResume}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all"
                >
                  {isExecutionPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
                  <span>{isExecutionPaused ? 'Resume' : 'Pause'}</span>
                </button>

                <button
                  onClick={handleStopExecution}
                  className="flex items-center gap-1 rounded-xl bg-rose-600 px-2.5 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-500 transition-all"
                >
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Canvas & Workspace Body */}
        <div className="relative flex-1 flex overflow-hidden bg-[#080B11]">
          {/* Node Grid Canvas Area */}
          <div 
            onClick={() => {
              setConnectingFromNodeId(null);
            }}
            className="relative flex-1 overflow-auto cursor-default"
          >
            {/* FlowCraft Pro Blue Canvas Dot Matrix Grid */}
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#3B82F6 0.75px, transparent 0.75px), radial-gradient(#1E293B 0.75px, transparent 0.75px)',
                backgroundSize: '28px 28px',
                backgroundPosition: '0 0, 14px 14px',
              }}
            />

            {/* Active Connecting Indicator Banner */}
            {connectingFromNodeId && (
              <div className="absolute top-4 left-6 z-30 flex items-center gap-2 rounded-full border border-blue-500 bg-blue-600/20 px-3.5 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md animate-pulse">
                <Link2 className="h-4 w-4" />
                <span>Click [Input] pin on destination node to connect cable</span>
                <button 
                  onClick={() => setConnectingFromNodeId(null)}
                  className="rounded-full p-0.5 hover:bg-blue-500/30 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* SVG Glowing Electric Blue / Indigo Prototype Cables matching Canvas Workflow */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible z-10">
              <defs>
                <linearGradient id="flowcraftCableGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>

                <filter id="blueGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {cables.map((cable, idx) => {
                const fromNode = getNode(cable.fromNodeId);
                const toNode = getNode(cable.toNodeId);
                if (!fromNode || !toNode) return null;

                const startX = fromNode.x + 180;
                const startY = fromNode.y + 44;
                const endX = toNode.x;
                const endY = toNode.y + 44;

                const deltaX = Math.abs(endX - startX);
                const controlX = Math.max(deltaX * 0.5, 40);

                const pathData = `M ${startX} ${startY} C ${startX + controlX} ${startY}, ${endX - controlX} ${endY}, ${endX} ${endY}`;
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;

                return (
                  <g key={`cable_${cable.id}_${idx}`} className="pointer-events-auto cursor-pointer group">
                    <path
                      d={pathData}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="18"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCable(cable.id);
                      }}
                    />

                    {/* Glowing Cable Halo */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="5"
                      strokeOpacity="0.4"
                      filter="url(#blueGlow)"
                    />

                    {/* Main Electric Blue & Indigo Cable */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="url(#flowcraftCableGradient)"
                      strokeWidth="2.5"
                      className="group-hover:stroke-blue-300 transition-colors"
                    />

                    {/* Connection End Nodes */}
                    <circle cx={startX} cy={startY} r="4.5" fill="#3B82F6" stroke="#080B11" strokeWidth="2" />
                    <circle cx={endX} cy={endY} r="4.5" fill="#8B5CF6" stroke="#080B11" strokeWidth="2" />

                    <foreignObject
                      x={midX - 12}
                      y={midY - 12}
                      width="24"
                      height="24"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        title="Delete cable connection"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCable(cable.id);
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-md hover:scale-110"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>

            {/* Draggable & Freely Movable Node Cards with FlowCraft Pro Blue Branding */}
            {nodes.map((node, nodeIdx) => {
              const Icon = FULL_NODE_LIBRARY.find(item => item.name === node.name || item.type === node.type)?.icon || Scan;
              const isSelected = selectedNodeId === node.id;
              const isConnecting = connectingFromNodeId === node.id;
              const isBeingDragged = draggingNodeId === node.id;
              const isActiveExecutionStep = isExecuting && executionSteps[activeStepIndex]?.id === node.id;

              return (
                <div
                  key={`node_${node.id}_${nodeIdx}`}
                  style={{ 
                    transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                    cursor: isBeingDragged ? 'grabbing' : 'grab'
                  }}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                  }}
                  className={`absolute top-0 left-0 w-46 rounded-2xl border-2 bg-[#111827]/95 p-3.5 shadow-2xl backdrop-blur-md select-none z-20 transition-shadow ${
                    isActiveExecutionStep
                      ? 'border-blue-500 ring-4 ring-blue-500/50 shadow-[0_0_30px_#3B82F6] scale-105 transition-transform'
                      : isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-blue-500/25'
                      : 'border-slate-800 hover:border-blue-500/60 hover:shadow-lg'
                  }`}
                >
                  {/* Drag Handle & Title */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/30 shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-white truncate">{node.name}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isActiveExecutionStep ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-400 animate-ping"></span>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-blue-500/80"></div>
                      )}
                    </div>
                  </div>

                  {/* Node Subtitle & Real-world time */}
                  <div className="text-[10px] text-slate-400 truncate mb-1">
                    {node.description}
                  </div>
                  <div className="text-[9px] text-blue-400 font-mono font-medium truncate mb-2">
                    {node.category}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[10px]">
                    <span className="font-semibold text-slate-400">Input</span>
                    <span className="font-mono text-blue-400 text-[9px]">~{node.properties?.estimatedCompletionSeconds || 15}s</span>
                    <span className="font-semibold text-blue-400">Output</span>
                  </div>

                  {/* Left INPUT Connector Pin */}
                  <div
                    data-pin="input"
                    title="Input Port (Click when connecting from another node)"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePinClick(node.id, 'input');
                    }}
                    className={`absolute -left-2.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-[#111827] flex items-center justify-center cursor-pointer transition-transform hover:scale-125 z-30 ${
                      connectingFromNodeId && connectingFromNodeId !== node.id
                        ? 'bg-blue-500 ring-4 ring-blue-500/40 animate-pulse'
                        : 'bg-slate-800 hover:bg-blue-500'
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>

                  {/* Right OUTPUT Connector Pin */}
                  <div
                    data-pin="output"
                    title="Output Port (Click to start cable connection)"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePinClick(node.id, 'output');
                    }}
                    className={`absolute -right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-[#111827] flex items-center justify-center cursor-pointer transition-transform hover:scale-125 z-30 ${
                      isConnecting
                        ? 'bg-blue-500 ring-4 ring-blue-500/50 scale-125 animate-pulse'
                        : 'bg-blue-600 hover:ring-2 hover:ring-blue-400'
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDE RAIL: Coordinated Simulator & Developer Properties Panel */}
          <div className="border-l border-slate-800 bg-[#0D1117] flex flex-col z-20 shrink-0">
            {/* Right Rail View Switcher Bar */}
            <div className="flex h-11 items-center justify-between border-b border-slate-800 bg-[#111827] px-3 shrink-0">
              <div className="flex items-center gap-1 rounded-xl bg-[#080B11] p-1 border border-slate-800">
                <button
                  onClick={() => setRightPanelView('simulator')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    rightPanelView === 'simulator'
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mobile Simulator</span>
                </button>

                <button
                  onClick={() => setRightPanelView('properties')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    rightPanelView === 'properties'
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Developer Properties</span>
                </button>

                <button
                  onClick={() => setRightPanelView('split')}
                  title="Show both Mobile Simulator and Properties side-by-side"
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-all ${
                    rightPanelView === 'split'
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <SplitSquareVertical className="h-3.5 w-3.5" />
                  <span>Split View</span>
                </button>
              </div>

              {selectedNode && (
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
                  <span className="text-slate-500">Active:</span>
                  <span className="font-bold text-blue-300 truncate max-w-[120px]">{selectedNode.name}</span>
                </div>
              )}
            </div>

            {/* Container for Simulator and/or Properties */}
            <div className="flex-1 flex flex-row overflow-hidden">
              {/* VIRTUAL MOBILE SIMULATOR */}
              {(rightPanelView === 'simulator' || rightPanelView === 'split') && (
                <div className="w-[380px] flex flex-col h-full bg-[#080B11] border-r border-slate-800 overflow-hidden shrink-0">
                  {/* Simulator Control Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 bg-[#0D1117] px-4 py-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-[11px] font-bold text-white">
                        {isExecuting ? `Simulating Step ${activeStepIndex + 1}/${executionSteps.length}` : 'Live Node View'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isExecuting && (
                        <button
                          onClick={() => setExecutionSpeed(prev => (prev === 1 ? 2 : 1))}
                          className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[9px] font-bold text-blue-400 hover:bg-slate-700"
                        >
                          {executionSpeed}x Speed
                        </button>
                      )}

                      <button
                        onClick={() => setPreviewOrientation(prev => (prev === 'portrait' ? 'landscape' : 'portrait'))}
                        className="flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-amber-300 hover:bg-slate-700 transition-colors"
                        title="Rotate preview between Vertical and Landscape"
                      >
                        <RotateCw className="h-3 w-3" />
                        <span className="capitalize">{previewOrientation}</span>
                      </button>

                      <span className="text-[10px] font-mono text-slate-500">iPhone 16 Pro</span>
                    </div>
                  </div>

                  {/* Simulator Phone Stage */}
                  <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
                    <div 
                      style={{
                        width: previewOrientation === 'landscape' ? '460px' : '280px',
                        height: previewOrientation === 'landscape' ? '300px' : '580px',
                      }}
                      className="relative rounded-[40px] border-[8px] border-slate-800 bg-black shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between transition-all duration-300"
                    >
                      <KYCNodeMobileScreen
                        node={selectedNode}
                        isSimulatingStep={isExecuting}
                        stepIndex={isExecuting ? activeStepIndex + 1 : 1}
                        totalSteps={isExecuting ? executionSteps.length : nodes.length}
                        progressPercent={isExecuting ? executionProgress : 100}
                        isSpeaking={isSpeaking}
                        onDoneAction={() => {
                          if (!isExecuting) {
                            handleExecute();
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Mini Telemetry Logs at bottom of simulator */}
                  <div className="h-32 border-t border-slate-800 bg-[#0D1117] p-3 overflow-y-auto flex flex-col shrink-0 font-mono text-[10px]">
                    <div className="flex items-center justify-between text-slate-400 pb-1 mb-1 border-b border-slate-800">
                      <span className="flex items-center gap-1 font-bold text-white">
                        <Terminal className="h-3 w-3 text-blue-400" />
                        Execution Telemetry
                      </span>
                      {isSpeaking && (
                        <span className="text-blue-400 text-[9px] animate-pulse">● UK Voice Narrating</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      {logs.slice(-4).map((log, idx) => (
                        <div key={`log_${log.id}_${idx}`} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                          <span className={log.type === 'success' ? 'text-emerald-400 font-semibold' : log.type === 'warn' ? 'text-amber-400' : 'text-slate-300'}>
                            {log.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* DEVELOPER PROPERTIES PANEL */}
              {(rightPanelView === 'properties' || rightPanelView === 'split') && (
                <div className="w-[360px] flex flex-col h-full bg-[#0D1117] overflow-hidden shrink-0">
                  <DeveloperPropertiesPanel
                    selectedNode={selectedNode}
                    onClose={() => setRightPanelView('simulator')}
                    onUpdateProperties={handleUpdateNodeProperties}
                    onDeleteNode={handleDeleteNode}
                    onSwitchToSimulator={() => setRightPanelView('simulator')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING INTERACTIVE GUIDE / TUTORIAL COACHMARK */}
      {showTutorial && (
        <div className="absolute bottom-6 left-84 z-50 w-96 rounded-2xl border-2 border-blue-500/80 bg-[#0D1117]/95 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                {tutorialStep + 1}
              </div>
              <h4 className="text-xs font-bold text-white tracking-tight">
                {TUTORIAL_STEPS[tutorialStep].title}
              </h4>
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className="rounded p-1 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            {TUTORIAL_STEPS[tutorialStep].text}
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
            <span className="font-mono text-[10px] text-blue-400 font-semibold">
              Step {tutorialStep + 1} of {TUTORIAL_STEPS.length}
            </span>

            <div className="flex items-center gap-2">
              {tutorialStep > 0 && (
                <button
                  onClick={() => setTutorialStep(prev => prev - 1)}
                  className="rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Previous
                </button>
              )}

              {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
                <button
                  onClick={() => setTutorialStep(prev => prev + 1)}
                  className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-500"
                >
                  <span>Next Step</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowTutorial(false)}
                  className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Finish Tutorial
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI FLOW GENERATOR MODAL */}
      <AIFlowGeneratorModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onCommitFlow={(aiNodes, aiCables) => {
          setNodes(aiNodes);
          setCables(aiCables);
          setSelectedNodeId(aiNodes[0]?.id || null);
          handleExecute();
        }}
      />
    </div>
  );
};
