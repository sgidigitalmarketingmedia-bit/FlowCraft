export type ElementType =
  | 'button'
  | 'input'
  | 'card'
  | 'header'
  | 'tabbar'
  | 'avatar'
  | 'avatar_group'
  | 'badge'
  | 'metric'
  | 'toggle'
  | 'checkbox'
  | 'radio_group'
  | 'slider_control'
  | 'segmented_control'
  | 'progress_bar'
  | 'rating'
  | 'accordion'
  | 'alert_banner'
  | 'list_item'
  | 'image_banner'
  | 'asset_slider'
  | 'shape'
  | 'divider'
  | 'social_login'
  | 'form_container'
  | 'media_placeholder'
  | 'video_player'
  | 'carousel'
  | 'splash_screen'
  // Financial Dashboard & Live Data Elements
  | 'line_chart'
  | 'bar_chart'
  | 'donut_chart'
  | 'live_ticker'
  | 'kpi_stat'
  | 'data_table'
  | 'gauge_diagram';

export type ActionTrigger = 'onClick' | 'onSubmit' | 'onChange';

export type ActionType = 'navigate' | 'back' | 'bottomSheet' | 'toast';

export type TransitionType =
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'fade'
  | 'pop'
  | 'flip'
  | 'bounce';

export interface TabItem {
  id: string;
  label: string;
  icon: string;
  targetScreenId?: string;
}

export interface FormFieldItem {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel';
}

export interface ColorPaletteTheme {
  id: string;
  name: string;
  category?: string;
  primary: string;       // e.g. #3B82F6
  primaryHover: string;  // e.g. #2563EB
  accent: string;        // e.g. #6366F1
  background: string;    // e.g. #0F172A
  surface: string;       // e.g. #1E293B
  cardBg: string;        // e.g. #1E293B
  textPrimary: string;   // e.g. #F8FAFC
  textSecondary: string; // e.g. #94A3B8
  border: string;        // e.g. #334155
}

export interface ElementProperties {
  id: string;
  type: ElementType;
  name: string;
  label: string;
  placeholder?: string;
  value?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  color?: string;
  bg?: string;
  textColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  helperText?: string;
  inputType?: 'text' | 'email' | 'password' | 'number' | 'search';
  metricValue?: string;
  metricLabel?: string;
  metricChange?: string;
  imageUrl?: string;
  badgeText?: string;
  toggleChecked?: boolean;
  tabItems?: TabItem[];
  
  // Social Login Custom Properties
  socialProvider?: 'google' | 'apple' | 'github' | 'microsoft' | 'stack';
  socialLayout?: 'stacked' | 'horizontal' | 'single';

  // Form Container Custom Properties
  formTitle?: string;
  formFields?: FormFieldItem[];
  formSubmitLabel?: string;
  formFooterNote?: string;

  // Media Placeholder Custom Properties
  mediaType?: 'video' | 'image' | 'audio' | 'document';
  mediaAspectRatio?: '16:9' | '4:3' | '1:1' | '9:16';
  mediaDuration?: string;
  mediaCaption?: string;

  // Splash Screen Properties
  splashFileType?: 'png' | 'mp4';
  splashMediaUrl?: string;
  splashBrandTitle?: string;
  splashTagline?: string;
  splashBgColor?: string;
  splashDwellDuration?: number; // e.g., 2.5 seconds
  splashAutoAdvance?: boolean;
  
  // Splash Intro Properties
  splashIntroAnimation?: 'fade-in' | 'scale-up' | 'blur-in' | 'slide-up' | 'pulse';
  splashIntroDuration?: number; // in seconds, e.g. 0.8
  splashIntroSound?: boolean;

  // Splash Outro Properties
  splashOutroAnimation?: 'fade-out' | 'slide-up-curtain' | 'zoom-through' | 'iris-wipe';
  splashOutroDuration?: number; // in seconds, e.g. 0.5
  splashTargetScreenId?: string;

  // Motion Video Splash Display & Proportional Resizer Properties
  splashVideoSizeMode?: 'fullscreen' | 'proportional';
  splashVideoAspectRatio?: '16:9' | '9:16' | '1:1' | '4:3' | '4:5' | '21:9' | 'custom';
  splashVideoCustomWidth?: number; // percentage (20 to 100) or px width
  splashVideoCustomHeight?: number; // height ratio / px / percentage
  splashVideoFit?: 'cover' | 'contain' | 'fill';
  splashVideoBorderRadius?: number; // px border radius (e.g., 0, 12, 20, 32)
  splashVideoScale?: number; // scale percentage (50 to 150)
  splashVideoOpacity?: number; // opacity percentage (20 to 100)
  splashVideoAlignment?: 'center' | 'top' | 'bottom';
  splashVideoLockProportions?: boolean; // locked aspect ratio constraint
  splashVideoGlow?: boolean; // stylish ambient glow behind video frame

  // Responsive Image & Fullscreen Display Properties
  imageSizeMode?: 'fullscreen' | 'responsive' | 'custom';
  imageAspectRatio?: '16:9' | '4:3' | '1:1' | '9:16' | '21:9' | 'custom';
  imageFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  imageCustomWidth?: number; // percentage (20 to 100) or px
  imageCustomHeight?: number; // px (60 to 700)
  imageBorderRadius?: number; // px (0 to 40)
  imageDarkScrim?: boolean; // subtle cinematic gradient overlay
  imageAllowFullscreenModal?: boolean; // tap to expand into fullscreen lightroom view

  // Video Streaming & Player Frame Properties
  videoUrl?: string; // internet video link (.mp4, direct stream, YouTube, or local blob)
  videoAutoplay?: boolean;
  videoLoop?: boolean;
  videoMuted?: boolean;
  videoControls?: boolean;
  videoPoster?: string;
  videoAspectRatio?: '16:9' | '9:16' | '4:3' | '1:1' | '21:9' | 'custom';
  videoHeight?: number;

  // Graphic Asset Slider / Carousel Properties
  sliderSlides?: SliderSlideItem[];
  sliderAutoPlay?: boolean;
  sliderInterval?: number; // ms dwell pause between slides (e.g. 3000)
  sliderPauseOnHover?: boolean;
  sliderPauseSection?: boolean; // pause auto-scroll at specific slide or section
  sliderPauseDuration?: number; // customizable pause duration in ms
  sliderHeight?: number; // px height of slider (e.g. 180)
  sliderAspectRatio?: '16:9' | '4:3' | '1:1' | '21:9' | 'custom';
  sliderFit?: 'cover' | 'contain' | 'fill';
  sliderShowDots?: boolean;
  sliderShowArrows?: boolean;
  sliderLoop?: boolean;
  sliderBorderRadius?: number;

  // Dedicated Banner Image Carousel Container Properties
  carouselSlides?: CarouselSlideItem[];
  carouselAutoplay?: boolean;
  carouselInterval?: number; // Dwell/Pause time between slides in ms (e.g. 3000ms) - "control the timing"
  carouselAnimationSpeed?: number; // Slide animation transition duration in ms (e.g. 500ms) - "how fast the animation slides are"
  carouselPauseOnHover?: boolean;
  carouselInfiniteLoop?: boolean;
  carouselHeight?: number;
  carouselBorderRadius?: number;
  carouselShowDots?: boolean;
  carouselShowArrows?: boolean;
  carouselShowIndicators?: boolean;
  carouselObjectFit?: 'cover' | 'contain' | 'fill';

  // Figma Vector Shapes & Primitive Controls Properties
  shapeKind?: 'rectangle' | 'circle' | 'triangle' | 'star' | 'line' | 'arrow';
  shapeStroke?: string;
  shapeStrokeWidth?: number;
  shapeFill?: string;
  ratingValue?: number;
  ratingMax?: number;
  progressPercent?: number;
  sliderMin?: number;
  sliderMax?: number;
  sliderCurrentVal?: number;
  segmentedOptions?: string[];
  segmentedActiveIndex?: number;
  checkboxChecked?: boolean;
  alertType?: 'info' | 'success' | 'warning' | 'danger';
  alertTitle?: string;
  avatarUrls?: string[];

  // Data Binding & Live Source Configuration
  dataBinding?: DataBindingConfig;

  // Financial Dashboard & Chart Properties
  chartTimeframe?: '1D' | '1W' | '1M' | '1Y' | 'ALL';
  chartShowAreaGradient?: boolean;
  chartLineColor?: string;
  chartFillColor?: string;
  chartShowGrid?: boolean;
  chartShowPoints?: boolean;
  chartPointsData?: { label: string; value: number }[];
  chartYAxisPrefix?: string; // e.g. "$"
  chartYAxisSuffix?: string; // e.g. "k"
  donutSegments?: { label: string; value: number; color: string; percentage?: number }[];
  tickerItems?: { symbol: string; price: string; change: string; isUp: boolean }[];
  gaugeValue?: number; // e.g. 785
  gaugeMax?: number;   // e.g. 850
  gaugeMin?: number;   // e.g. 300
  gaugeLabel?: string; // e.g. "Credit Score"
  gaugeStatus?: 'healthy' | 'moderate' | 'critical';
  tableRows?: Record<string, any>[];
  tableColumns?: { key: string; label: string; align?: 'left' | 'center' | 'right' }[];

  // Journey Flow / Interaction Action
  hasAction?: boolean;
  trigger?: ActionTrigger;
  actionType?: ActionType;
  targetScreenId?: string;
  transition?: TransitionType;
  transitionDuration?: number; // in milliseconds (e.g. 350)
  transitionEasing?: 'ease-out' | 'ease-in-out' | 'spring' | 'linear';
  toastMessage?: string;
}

export type DataSourceType = 'live_market_ws' | 'rest_api' | 'preset_dataset' | 'custom_json';

export interface DataBindingConfig {
  enabled: boolean;
  sourceType: DataSourceType;
  // REST API Configuration
  endpoint?: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  refreshIntervalSec?: number; // e.g. 5s
  dataPath?: string; // e.g. "prices" or "data.items"
  // Simulated Live Market Feed (WebSockets)
  marketTicker?: 'BTC/USD' | 'ETH/USD' | 'SOL/USD' | 'S&P 500' | 'NASDAQ' | 'AAPL' | 'NVDA' | 'EUR/USD';
  marketFrequencySec?: number; // 1s, 2s, 5s
  marketVolatility?: 'low' | 'medium' | 'high';
  // Preset Dataset
  presetId?: 'crypto_portfolio' | 'stock_tech_rally' | 'fintech_revenue_monthly' | 'defi_liquidity' | 'expense_breakdown' | 'credit_score_gauge';
  // Custom JSON Payload
  customJsonPayload?: string;
  // Dynamic Field Mappings
  labelKey?: string;   // e.g. "date", "time", "ticker", "category"
  valueKey?: string;   // e.g. "price", "amount", "balance", "percentage"
  changeKey?: string;  // e.g. "changePercent"
  currencyPrefix?: string; // "$", "€", "£", "¥", "BTC"
  unitSuffix?: string; // "%", "k", "M"
  showLivePulse?: boolean; // green/red pulsing indicator
}

export interface SliderSlideItem {
  id: string;
  imageUrl: string;
  title?: string;
  caption?: string;
  targetScreenId?: string; // Linkage to pages or sections within the app!
  transition?: TransitionType;
  transitionDuration?: number;
}

export interface CarouselSlideItem {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  badge?: string;
  targetScreenId?: string; // Hyperlink to navigate to screen within the app!
  targetActionLabel?: string;
  externalUrl?: string;    // Or external link
  transition?: TransitionType;
  transitionDuration?: number;
}

export interface GraphicAssetItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'vector';
  format: 'png' | 'jpg' | 'webp' | 'svg' | 'mp4' | 'webm';
  category: 'banner' | 'video' | 'ui' | 'avatar' | 'icon' | 'document' | 'user_upload';
  dimensions?: string;
  size?: string;
  tags: string[];
  createdAt?: string;
  isLocalUpload?: boolean;
}

export type AnnotationType = 'sticky_note' | 'pin';
export type AnnotationCategory = 'dev_note' | 'api_spec' | 'interaction' | 'business_logic' | 'todo';
export type AnnotationColor = 'yellow' | 'violet' | 'emerald' | 'amber' | 'rose' | 'blue' | 'slate';

export interface ScreenAnnotation {
  id: string;
  screenId: string;
  type: AnnotationType; // 'sticky_note' | 'pin'
  number?: number; // Pin sequence indicator (e.g. 1, 2, 3)
  title?: string;
  content: string; // The developer note / architectural context / implementation detail
  category: AnnotationCategory;
  color: AnnotationColor;
  author?: string; // e.g. "Lead UX Architect" or "Staff Engineer"
  x: number; // coordinate relative to screen top-left (px)
  y: number; // coordinate relative to screen top-left (px)
  width?: number; // for sticky notes
  height?: number;
  pinnedElementId?: string; // optionally pinned to a specific UI element
  isCollapsed?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Screen {
  id: string;
  title: string;
  route: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  statusBarColor: 'dark' | 'light';
  isEntry: boolean;
  elements: ElementProperties[];
  connectorPoints?: ('right' | 'left' | 'top' | 'bottom')[];
  annotations?: ScreenAnnotation[];
}

export interface FlowConnection {
  id: string;
  sourceScreenId: string;
  sourceElementId: string;
  targetScreenId: string;
  trigger: ActionTrigger;
  transition: TransitionType;
}

export type DevicePreset = 'iphone16pro' | 'pixel9' | 'galaxys25';

export interface DeviceSpec {
  name: string;
  width: number;
  height: number;
  cornerRadius: number;
  notchType: 'island' | 'punchhole' | 'pill';
  scale: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  devicePreset: DevicePreset;
  screens: Screen[];
  connections: FlowConnection[];
  activeTheme?: ColorPaletteTheme;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'Product Manager' | 'Lead UX Designer' | 'Staff Frontend Engineer';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  token: string;
}

export interface CanvasWorkspace {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  isShared: boolean;
  shareCode: string;
  role: 'owner' | 'editor' | 'viewer';
  project: Project;
  lastActive: string;
}
