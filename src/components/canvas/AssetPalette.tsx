import React, { useState } from 'react';
import { 
  Square, Type, CreditCard, LayoutTemplate, Sliders, ToggleLeft, 
  List, Image as ImageIcon, Award, Navigation, Plus, Sparkles, ChevronLeft,
  Search, Video, ShieldCheck, FileCheck, Mic, Smartphone,
  Layers, Lock, CheckCircle2, GripVertical, Check, Circle, Triangle,
  Star, Minus, ArrowRight, CheckSquare, Radio, SlidersHorizontal,
  BarChart3, User, Users, AlertCircle, HelpCircle, GalleryHorizontalEnd,
  Maximize2, Eye, Compass, TrendingUp, LineChart, PieChart, Activity,
  Gauge, Table, Zap, Database, Wifi, Coins
} from 'lucide-react';
import { ElementType, ElementProperties, FormFieldItem } from '../../types/builder';

export interface AssetTemplateItem {
  id: string;
  label: string;
  category: 
    | 'Financial Dashboard & Live Data'
    | 'Sliders & Media' 
    | 'Figma Shapes' 
    | 'Typography' 
    | 'UI Controls' 
    | 'Data & Feedback' 
    | 'Forms & Auth' 
    | 'Navigation' 
    | 'Launch & Splash';
  description: string;
  icon: any;
  badge?: string;
  template: Omit<ElementProperties, 'id'>;
}

export const ASSET_PALETTE_TEMPLATES: AssetTemplateItem[] = [
  // =========================================================================
  // 0. FINANCIAL DASHBOARD & LIVE DATA (Charts, Diagrams, Live Feeds, Gauges)
  // =========================================================================
  {
    id: 'asset_line_chart',
    label: 'Interactive Line Chart (Live Feed)',
    category: 'Financial Dashboard & Live Data',
    description: 'SVG price curve with gradient fill, timeframe selector (1D, 1W, 1M, 1Y, ALL) and WebSocket market binding',
    icon: LineChart,
    badge: 'Live Data',
    template: {
      type: 'line_chart',
      name: 'Portfolio Growth Curve',
      label: 'Portfolio Net Valuation',
      chartTimeframe: '1M',
      chartShowAreaGradient: true,
      chartLineColor: '#3B82F6',
      chartFillColor: 'rgba(59, 130, 246, 0.2)',
      chartShowGrid: true,
      chartShowPoints: true,
      chartYAxisPrefix: '$',
      chartPointsData: [
        { label: 'Mon', value: 142300 },
        { label: 'Tue', value: 144800 },
        { label: 'Wed', value: 143900 },
        { label: 'Thu', value: 146500 },
        { label: 'Fri', value: 147800 },
        { label: 'Sat', value: 147100 },
        { label: 'Sun', value: 148920 },
      ],
      dataBinding: {
        enabled: true,
        sourceType: 'live_market_ws',
        marketTicker: 'BTC/USD',
        marketFrequencySec: 2,
        marketVolatility: 'medium',
        showLivePulse: true,
        currencyPrefix: '$',
        labelKey: 'time',
        valueKey: 'price',
        changeKey: 'changePercent',
      },
      hasAction: true,
      trigger: 'onClick',
      actionType: 'toast',
      toastMessage: 'Streaming real-time chart market updates',
    },
  },
  {
    id: 'asset_bar_chart',
    label: 'Volume & Inflows Bar Chart',
    category: 'Financial Dashboard & Live Data',
    description: 'Financial histogram bar chart comparing monthly inflows, revenue velocity & settlement volumes',
    icon: BarChart3,
    badge: 'Histogram',
    template: {
      type: 'bar_chart',
      name: 'Monthly Settlement Volume',
      label: 'Capital Inflows & Settlement Volume',
      chartTimeframe: '1M',
      chartLineColor: '#10B981',
      chartPointsData: [
        { label: 'May', value: 34500 },
        { label: 'Jun', value: 48200 },
        { label: 'Jul', value: 41800 },
        { label: 'Aug', value: 62400 },
        { label: 'Sep', value: 58900 },
        { label: 'Oct', value: 76500 },
      ],
      dataBinding: {
        enabled: true,
        sourceType: 'preset_dataset',
        presetId: 'fintech_revenue_monthly',
        currencyPrefix: '$',
        unitSuffix: 'k',
        showLivePulse: true,
      },
    },
  },
  {
    id: 'asset_donut_chart',
    label: 'Portfolio Allocation Donut Diagram',
    category: 'Financial Dashboard & Live Data',
    description: 'Circular radial donut diagram displaying asset class distribution, color segments & live balances',
    icon: PieChart,
    badge: 'Diagram',
    template: {
      type: 'donut_chart',
      name: 'Asset Allocation Donut',
      label: 'Multi-Asset Liquidity Allocation',
      donutSegments: [
        { label: 'Bitcoin (BTC)', value: 62540, color: '#F59E0B', percentage: 42 },
        { label: 'Ethereum (ETH)', value: 41700, color: '#6366F1', percentage: 28 },
        { label: 'Solana (SOL)', value: 26800, color: '#10B981', percentage: 18 },
        { label: 'USDC Treasury', value: 17880, color: '#0EA5E9', percentage: 12 },
      ],
      dataBinding: {
        enabled: true,
        sourceType: 'preset_dataset',
        presetId: 'crypto_portfolio',
        currencyPrefix: '$',
        showLivePulse: true,
      },
    },
  },
  {
    id: 'asset_live_ticker',
    label: 'Live Market Ticker Stream',
    category: 'Financial Dashboard & Live Data',
    description: 'Continuous horizontal price ticker with simulated WebSocket pulse, flashing deltas & real-time quotes',
    icon: Activity,
    badge: 'WebSocket',
    template: {
      type: 'live_ticker',
      name: 'Global Markets Ticker Tape',
      label: 'Real-Time Market Feeds',
      tickerItems: [
        { symbol: 'BTC/USD', price: '$68,450.00', change: '+3.42%', isUp: true },
        { symbol: 'ETH/USD', price: '$3,520.80', change: '+2.15%', isUp: true },
        { symbol: 'SOL/USD', price: '$184.25', change: '+8.60%', isUp: true },
        { symbol: 'S&P 500', price: '5,815.20', change: '+0.54%', isUp: true },
        { symbol: 'NVDA', price: '$138.90', change: '-1.12%', isUp: false },
      ],
      dataBinding: {
        enabled: true,
        sourceType: 'live_market_ws',
        marketTicker: 'BTC/USD',
        marketFrequencySec: 1,
        marketVolatility: 'high',
        showLivePulse: true,
      },
    },
  },
  {
    id: 'asset_kpi_stat',
    label: 'Fintech KPI Metric Stat Card',
    category: 'Financial Dashboard & Live Data',
    description: 'High-contrast monospace KPI stat card with live data connection tag, delta badge & pulse dot',
    icon: TrendingUp,
    badge: 'Bound KPI',
    template: {
      type: 'kpi_stat',
      name: 'Liquid Capital Metric Card',
      label: 'Total Liquid Treasury Capital',
      metricValue: '$148,920.45',
      metricChange: '+14.2% past 30 days',
      dataBinding: {
        enabled: true,
        sourceType: 'live_market_ws',
        marketTicker: 'BTC/USD',
        marketFrequencySec: 2,
        currencyPrefix: '$',
        showLivePulse: true,
      },
    },
  },
  {
    id: 'asset_gauge_diagram',
    label: 'Credit & Risk Radial Gauge',
    category: 'Financial Dashboard & Live Data',
    description: 'Semi-circular radial gauge diagram illustrating credit rating (300-850), risk index & status score',
    icon: Gauge,
    badge: 'Gauge',
    template: {
      type: 'gauge_diagram',
      name: 'Credit Health Radial Gauge',
      label: 'Equifax Risk & Credit Score',
      gaugeValue: 785,
      gaugeMin: 300,
      gaugeMax: 850,
      gaugeLabel: 'Excellent Standing',
      gaugeStatus: 'healthy',
      dataBinding: {
        enabled: true,
        sourceType: 'preset_dataset',
        presetId: 'credit_score_gauge',
        showLivePulse: true,
      },
    },
  },
  {
    id: 'asset_data_table',
    label: 'Live Transactions Ledger Grid',
    category: 'Financial Dashboard & Live Data',
    description: 'Financial data grid displaying live timestamped transactions, amounts, counterparties & status pills',
    icon: Table,
    badge: 'Data Grid',
    template: {
      type: 'data_table',
      name: 'Live Settlement Ledger',
      label: 'Real-Time Clearing Ledger',
      tableColumns: [
        { key: 'time', label: 'Time' },
        { key: 'counterparty', label: 'Counterparty' },
        { key: 'status', label: 'Status' },
        { key: 'amount', label: 'Amount', align: 'right' },
      ],
      tableRows: [
        { id: 'tx_1', time: '14:28:02', counterparty: 'Stripe Settlement', status: 'Settled', amount: '+$14,250.00' },
        { id: 'tx_2', time: '13:50:11', counterparty: 'AWS Cloud Services', status: 'Cleared', amount: '-$840.20' },
        { id: 'tx_3', time: '12:15:44', counterparty: 'Silicon Valley Bank Wire', status: 'Settled', amount: '+$85,000.00' },
        { id: 'tx_4', time: '11:02:19', counterparty: 'Employee Payroll ACH', status: 'Processing', amount: '-$24,600.00' },
      ],
      dataBinding: {
        enabled: true,
        sourceType: 'live_market_ws',
        marketFrequencySec: 5,
        currencyPrefix: '$',
        showLivePulse: true,
      },
    },
  },

  // =========================================================================
  // 1. SLIDERS & MEDIA (Banner Image Carousel, Video Player, Responsive Images)
  // =========================================================================
  {
    id: 'asset_banner_carousel',
    label: 'Banner Image Carousel',
    category: 'Sliders & Media',
    description: 'Container for multiple banner images with auto-scroll, pause dwell, speed control & hyperlinks',
    icon: GalleryHorizontalEnd,
    badge: 'New • Carousel',
    template: {
      type: 'carousel',
      name: 'Banner Image Carousel',
      label: 'Featured Promotions',
      carouselHeight: 190,
      carouselAutoplay: true,
      carouselInterval: 3000,
      carouselAnimationSpeed: 500,
      carouselPauseOnHover: true,
      carouselShowDots: true,
      carouselShowArrows: true,
      carouselBorderRadius: 18,
      carouselObjectFit: 'cover',
      carouselSlides: [
        {
          id: 'carousel_slide_1',
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
          title: 'Season 9: Cyber Void Pass',
          subtitle: 'Tap to view exclusive armory loadout',
          targetScreenId: 'screen_transfer',
          transition: 'slide-left',
        },
        {
          id: 'carousel_slide_2',
          imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
          title: 'Holographic Plasma Weapon',
          subtitle: 'Special edition neon particle finish',
          targetScreenId: 'screen_dashboard',
          transition: 'fade',
        },
        {
          id: 'carousel_slide_3',
          imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
          title: 'Ranked 5v5 Tournament',
          subtitle: 'Registrations closing in 2 hours',
          targetScreenId: 'screen_success',
          transition: 'slide-up',
        },
      ],
      hasAction: true,
      trigger: 'onClick',
      actionType: 'navigate',
      transition: 'slide-left',
    },
  },
  {
    id: 'asset_internet_video_player',
    label: 'Internet Video / MP4 Player',
    category: 'Sliders & Media',
    description: '16:9 streaming video frame for internet URL (.mp4, direct stream, or local disk)',
    icon: Video,
    badge: 'HD Video',
    template: {
      type: 'video_player',
      name: 'Internet Video Player',
      label: 'Product Video Walkthrough',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4',
      videoAutoplay: false,
      videoLoop: true,
      videoMuted: true,
      videoControls: true,
      mediaDuration: '02:45',
      mediaCaption: 'Watch product overview and UI walkthrough stream',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      hasAction: true,
      trigger: 'onClick',
      actionType: 'toast',
      toastMessage: 'Playing high-definition internet video stream',
    },
  },
  {
    id: 'asset_graphic_slider',
    label: 'Graphic Asset Slider (.PNG)',
    category: 'Sliders & Media',
    description: 'Horizontal multi-PNG image slider with pause section & screen links',
    icon: GalleryHorizontalEnd,
    badge: 'Multi-PNG',
    template: {
      type: 'asset_slider',
      name: 'Graphic Asset Slider',
      label: 'Featured Promotions',
      sliderHeight: 180,
      sliderAutoPlay: true,
      sliderInterval: 3200,
      sliderPauseOnHover: true,
      sliderShowDots: true,
      sliderShowArrows: true,
      sliderBorderRadius: 16,
      sliderFit: 'cover',
      sliderSlides: [
        {
          id: 'slide_demo_1',
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          title: 'Season 9: Cyber Void Pass',
          caption: 'Tap to view exclusive armory loadout',
          transition: 'slide-left',
        },
        {
          id: 'slide_demo_2',
          imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
          title: 'Holographic Plasma Weapon',
          caption: 'Special edition neon particle finish',
          transition: 'fade',
        },
        {
          id: 'slide_demo_3',
          imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
          title: 'Ranked 5v5 Tournament',
          caption: 'Registrations closing in 2 hours',
          transition: 'slide-up',
        },
      ],
      hasAction: true,
      trigger: 'onClick',
      actionType: 'navigate',
      transition: 'slide-left',
    },
  },
  {
    id: 'asset_media_responsive_image',
    label: 'Responsive Image (Fullscreen)',
    category: 'Sliders & Media',
    description: 'High-res image with aspect ratio control & tap-to-fullscreen',
    icon: ImageIcon,
    badge: 'Responsive',
    template: {
      type: 'image_banner',
      name: 'Responsive Image Element',
      label: 'Architectural Design Preview',
      helperText: 'Tap to expand into fullscreen lightroom view',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      imageSizeMode: 'responsive',
      imageAspectRatio: '16:9',
      imageFit: 'cover',
      imageBorderRadius: 16,
      imageDarkScrim: true,
      imageAllowFullscreenModal: true,
      hasAction: true,
      trigger: 'onClick',
      actionType: 'toast',
      toastMessage: 'Opening fullscreen photo lightbox',
    },
  },
  {
    id: 'asset_media_video',
    label: 'Video Player Frame (16:9)',
    category: 'Sliders & Media',
    description: '16:9 streaming video frame with play control & duration',
    icon: Video,
    badge: '16:9',
    template: {
      type: 'media_placeholder',
      name: 'Video Showcase Frame',
      label: 'Product Walkthrough',
      mediaType: 'video',
      mediaAspectRatio: '16:9',
      mediaDuration: '02:45',
      mediaCaption: 'Watch quick 2-minute architectural overview',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      hasAction: true,
      trigger: 'onClick',
      actionType: 'toast',
      toastMessage: 'Streaming video player initiated',
    },
  },
  {
    id: 'asset_media_document_scanner',
    label: 'ID / Camera Scanner Viewfinder',
    category: 'Sliders & Media',
    description: 'Camera viewfinder frame with edge alignment guides',
    icon: FileCheck,
    badge: 'KYC Cam',
    template: {
      type: 'media_placeholder',
      name: 'Document Capture Viewfinder',
      label: 'Government ID Viewfinder',
      mediaType: 'document',
      mediaAspectRatio: '4:3',
      mediaCaption: 'Fit ID card within corner guides for automatic capture',
      hasAction: true,
      trigger: 'onClick',
      actionType: 'navigate',
      transition: 'pop',
      toastMessage: 'Document image captured successfully',
    },
  },
  {
    id: 'asset_media_audio_waveform',
    label: 'Audio Note & Waveform',
    category: 'Sliders & Media',
    description: 'Audio podcast player with playback scrubber & sound waves',
    icon: Mic,
    template: {
      type: 'media_placeholder',
      name: 'Audio Player Waveform',
      label: 'Voice Verification Memo',
      mediaType: 'audio',
      mediaDuration: '00:42',
      mediaCaption: 'Biometric voice sample recorded',
      hasAction: true,
      trigger: 'onClick',
      actionType: 'toast',
      toastMessage: 'Playing audio snippet',
    },
  },

  // =========================================================================
  // 2. FIGMA VECTOR SHAPES & CONTAINERS
  // =========================================================================
  {
    id: 'asset_shape_rect',
    label: 'Rectangle / Box Frame',
    category: 'Figma Shapes',
    description: 'Vector rectangle frame with customizable fill, stroke & radius',
    icon: Square,
    badge: 'Figma',
    template: {
      type: 'shape',
      name: 'Vector Rectangle',
      label: 'Surface Frame',
      shapeKind: 'rectangle',
      bg: '#1E293B',
      shapeStroke: '#3B82F6',
      shapeStrokeWidth: 1,
      borderRadius: 'lg',
      padding: 'md',
    },
  },
  {
    id: 'asset_shape_circle',
    label: 'Ellipse / Circle Avatar',
    category: 'Figma Shapes',
    description: 'Geometric circular avatar badge or icon backing',
    icon: Circle,
    badge: 'Figma',
    template: {
      type: 'shape',
      name: 'Vector Circle',
      label: 'Circular Accent',
      shapeKind: 'circle',
      bg: '#3B82F6',
      borderRadius: 'full',
      padding: 'sm',
    },
  },
  {
    id: 'asset_shape_triangle',
    label: 'Polygon / Triangle',
    category: 'Figma Shapes',
    description: 'Equilateral polygon vector shape indicator',
    icon: Triangle,
    badge: 'Figma',
    template: {
      type: 'shape',
      name: 'Vector Triangle',
      label: 'Directional Indicator',
      shapeKind: 'triangle',
      bg: '#6366F1',
    },
  },
  {
    id: 'asset_shape_star',
    label: 'Star / Badge Icon',
    category: 'Figma Shapes',
    description: 'Vector 5-point star rating or premium reward token',
    icon: Star,
    badge: 'Figma',
    template: {
      type: 'shape',
      name: 'Vector Star',
      label: 'Star Token',
      shapeKind: 'star',
      bg: '#F59E0B',
    },
  },
  {
    id: 'asset_shape_line',
    label: 'Hairline Divider / Rule',
    category: 'Figma Shapes',
    description: 'Subtle section rule with optional centered label',
    icon: Minus,
    template: {
      type: 'divider',
      name: 'Section Divider',
      label: 'or continue with',
    },
  },

  // =========================================================================
  // 3. TYPOGRAPHY & CONTENT BLOCKS
  // =========================================================================
  {
    id: 'asset_type_h1',
    label: 'Display Heading (H1)',
    category: 'Typography',
    description: 'High-impact bold display title for hero sections',
    icon: Type,
    badge: 'Display',
    template: {
      type: 'header',
      name: 'Display Heading',
      label: 'Design Without Limits',
      helperText: 'Craft production-ready native mobile prototypes in minutes',
      size: 'lg',
    },
  },
  {
    id: 'asset_type_h2',
    label: 'Section Subheader (H2)',
    category: 'Typography',
    description: 'Structured subsection header with icon & back link',
    icon: Type,
    template: {
      type: 'header',
      name: 'Section Subheader',
      label: 'Account Security Settings',
      helperText: 'Manage 2-factor authentication & security keys',
      size: 'md',
      hasAction: true,
      actionType: 'back',
    },
  },
  {
    id: 'asset_type_body',
    label: 'Body Paragraph & Card',
    category: 'Typography',
    description: 'Balanced typographic paragraph inside a subtle card container',
    icon: Type,
    template: {
      type: 'card',
      name: 'Content Paragraph Card',
      label: 'Cloud-Native Synchronization',
      helperText: 'All wireframe interactions sync deterministically to the simulator engine.',
      padding: 'md',
      borderRadius: 'xl',
    },
  },

  // =========================================================================
  // 4. UI CONTROLS & INPUTS (Figma Component Library)
  // =========================================================================
  {
    id: 'asset_btn_primary',
    label: 'Primary CTA Button',
    category: 'UI Controls',
    description: 'High-contrast primary action button to trigger state transitions',
    icon: Square,
    badge: 'Primary',
    template: {
      type: 'button',
      name: 'Primary Action Button',
      label: 'Continue Next Step',
      variant: 'primary',
      fullWidth: true,
      borderRadius: 'xl',
      hasAction: true,
      trigger: 'onClick',
      actionType: 'navigate',
      transition: 'slide-left',
    },
  },
  {
    id: 'asset_btn_secondary',
    label: 'Secondary Outline Button',
    category: 'UI Controls',
    description: 'Ghost/outline button for secondary navigation paths',
    icon: Square,
    template: {
      type: 'button',
      name: 'Secondary Button',
      label: 'Cancel or Return',
      variant: 'outline',
      fullWidth: true,
      borderRadius: 'xl',
      hasAction: true,
      trigger: 'onClick',
      actionType: 'back',
      transition: 'slide-right',
    },
  },
  {
    id: 'asset_input_field',
    label: 'Validated Text Input',
    category: 'UI Controls',
    description: 'Single-line text input with label and helper text',
    icon: Type,
    template: {
      type: 'input',
      name: 'Text Input Field',
      label: 'Work Email Address',
      placeholder: 'name@company.com',
      inputType: 'email',
      helperText: 'We will send a 6-digit verification code',
    },
  },
  {
    id: 'asset_input_search',
    label: 'Search Bar with Clear',
    category: 'UI Controls',
    description: 'Omni-search input for filtering items and queries',
    icon: Search,
    template: {
      type: 'input',
      name: 'Search Input',
      label: 'Search Assets',
      placeholder: 'Search transactions, stocks, or tags...',
      inputType: 'search',
    },
  },
  {
    id: 'asset_toggle_switch',
    label: 'Toggle Switch (Boolean)',
    category: 'UI Controls',
    description: 'Interactive boolean toggle with label and helper text',
    icon: ToggleLeft,
    template: {
      type: 'toggle',
      name: 'Push Notification Toggle',
      label: 'Instant Push Alerts',
      helperText: 'Get alerted immediately upon transaction settlement',
      toggleChecked: true,
    },
  },
  {
    id: 'asset_checkbox_control',
    label: 'Checkbox with Label',
    category: 'UI Controls',
    description: 'Interactive selection checkbox for terms or options',
    icon: CheckSquare,
    template: {
      type: 'checkbox',
      name: 'Terms Checkbox',
      label: 'I accept Terms of Service & Privacy Policy',
      checkboxChecked: true,
    },
  },
  {
    id: 'asset_segmented_control',
    label: 'Segmented Pill Control',
    category: 'UI Controls',
    description: 'Multi-option segmented tabs: Day / Week / Month / Year',
    icon: SlidersHorizontal,
    template: {
      type: 'segmented_control',
      name: 'Timeframe Selector',
      label: 'Performance Window',
      segmentedOptions: ['1D', '1W', '1M', '1Y', 'ALL'],
      segmentedActiveIndex: 2,
    },
  },
  {
    id: 'asset_slider_range',
    label: 'Range Slider (0 - 100)',
    category: 'UI Controls',
    description: 'Adjustable percentage or dollar range slider with live readout',
    icon: Sliders,
    template: {
      type: 'slider_control',
      name: 'Amount Range Slider',
      label: 'Allocation Percentage',
      sliderMin: 0,
      sliderMax: 100,
      sliderCurrentVal: 65,
    },
  },

  // =========================================================================
  // 5. DATA & FEEDBACK (Metrics, Lists, Alerts, Badges)
  // =========================================================================
  {
    id: 'asset_metric_kpi',
    label: 'Metric / KPI Stat Card',
    category: 'Data & Feedback',
    description: 'Monospace tabular metric with percentage delta tag',
    icon: BarChart3,
    badge: 'Stats',
    template: {
      type: 'metric',
      name: 'Liquid Capital KPI',
      label: 'Total Liquid Balance',
      metricValue: '$148,250.00',
      metricChange: '+14.2% past 30 days',
    },
  },
  {
    id: 'asset_list_row',
    label: 'Interactive List Item / Row',
    category: 'Data & Feedback',
    description: 'Transaction row with icon, subtext, and numeric value',
    icon: List,
    template: {
      type: 'list_item',
      name: 'Transaction Row',
      label: 'Cloud Hosting Subscription',
      helperText: 'Oct 04, 2026 · Auto-renewed',
      metricValue: '-$120.00',
      hasAction: true,
      trigger: 'onClick',
      actionType: 'toast',
      toastMessage: 'Viewing transaction details',
    },
  },
  {
    id: 'asset_avatar_stack',
    label: 'Avatar Team Stack',
    category: 'Data & Feedback',
    description: 'Overlapping collaborator avatars with +3 count pill',
    icon: Users,
    template: {
      type: 'avatar_group',
      name: 'Collaborators Stack',
      label: 'Sprint Team Members',
      avatarUrls: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
      ],
    },
  },
  {
    id: 'asset_progress_bar',
    label: 'Progress Bar (Linear)',
    category: 'Data & Feedback',
    description: 'Percentage progress bar for goals or checkout stages',
    icon: BarChart3,
    template: {
      type: 'progress_bar',
      name: 'KYC Verification Progress',
      label: 'Identity Onboarding Completed',
      progressPercent: 75,
    },
  },
  {
    id: 'asset_status_badge',
    label: 'Security Status Badge',
    category: 'Data & Feedback',
    description: 'Semantic verification indicator with lock or check',
    icon: Award,
    template: {
      type: 'badge',
      name: 'Verified Badge',
      label: 'SOC-2 Type II Verified & Bank Connected',
      variant: 'success',
    },
  },
  {
    id: 'asset_alert_banner',
    label: 'Semantic Alert Banner',
    category: 'Data & Feedback',
    description: 'Notice callout with icon for tips, alerts, or warnings',
    icon: AlertCircle,
    template: {
      type: 'alert_banner',
      name: 'Info Alert Banner',
      alertTitle: 'Instant Settlement Notice',
      label: 'ACH transfers settle immediately with zero hold fees.',
      alertType: 'info',
    },
  },

  // =========================================================================
  // 6. FORMS & AUTH (Containers & Social Login)
  // =========================================================================
  {
    id: 'asset_form_login',
    label: 'Sign In Form Container',
    category: 'Forms & Auth',
    description: 'Multi-field card: Work Email, Password, and Sign In action',
    icon: Type,
    badge: 'Container',
    template: {
      type: 'form_container',
      name: 'Sign In Form Container',
      label: 'Welcome Back',
      formTitle: 'Sign In to Your Account',
      formSubmitLabel: 'Sign In Securely',
      formFooterNote: '256-bit TLS encrypted authentication',
      formFields: [
        { id: 'f_email', label: 'Work Email', placeholder: 'name@company.com', type: 'email' },
        { id: 'f_pass', label: 'Password', placeholder: '••••••••', type: 'password' },
      ],
      hasAction: true,
      trigger: 'onSubmit',
      actionType: 'navigate',
      transition: 'slide-left',
    },
  },
  {
    id: 'asset_form_payment',
    label: 'Payment & Billing Vault',
    category: 'Forms & Auth',
    description: 'Credit Card, Expiration, and CVC container with Pay CTA',
    icon: CreditCard,
    badge: 'Container',
    template: {
      type: 'form_container',
      name: 'Payment Details Container',
      label: 'Payment Method',
      formTitle: 'Card & Billing Details',
      formSubmitLabel: 'Confirm & Authorize Payment',
      formFooterNote: 'PCI-DSS Level 1 compliant vault',
      formFields: [
        { id: 'f_cardholder', label: 'Cardholder Name', placeholder: 'Jane Doe', type: 'text' },
        { id: 'f_cardnum', label: 'Card Number', placeholder: '•••• •••• •••• 4242', type: 'text' },
        { id: 'f_expiry', label: 'Expires & CVC', placeholder: 'MM/YY  •  CVC', type: 'text' },
      ],
      hasAction: true,
      trigger: 'onSubmit',
      actionType: 'navigate',
      transition: 'slide-left',
    },
  },
  {
    id: 'asset_social_stack',
    label: 'Social Login Dual Stack',
    category: 'Forms & Auth',
    description: '1-tap Google & Apple sign-in buttons with quiet divider',
    icon: Lock,
    badge: 'Popular',
    template: {
      type: 'social_login',
      name: 'Social Login Stack',
      label: 'Continue with Social Providers',
      socialProvider: 'stack',
      socialLayout: 'stacked',
      hasAction: true,
      trigger: 'onClick',
      actionType: 'navigate',
      transition: 'slide-left',
      toastMessage: 'Signed in with Social Provider',
    },
  },

  // =========================================================================
  // 7. NAVIGATION
  // =========================================================================
  {
    id: 'asset_nav_header',
    label: 'App Navigation Header',
    category: 'Navigation',
    description: 'Top header with back button, screen title, and bell',
    icon: LayoutTemplate,
    template: {
      type: 'header',
      name: 'Screen Header',
      label: 'Account Security',
      helperText: 'Manage 2FA and connected accounts',
      hasAction: true,
      actionType: 'back',
    },
  },
  {
    id: 'asset_bottom_tabbar',
    label: 'Bottom Navigation Dock (3-Tab)',
    category: 'Navigation',
    description: 'Fixed dock navigation bar with Home, Cards, Settings',
    icon: Navigation,
    badge: 'Dock',
    template: {
      type: 'tabbar',
      name: 'Bottom Tab Dock',
      label: 'Bottom Dock',
    },
  },

  // =========================================================================
  // 8. LAUNCH & SPLASH
  // =========================================================================
  {
    id: 'asset_splash_png',
    label: 'Brand Splash Screen (.PNG)',
    category: 'Launch & Splash',
    description: 'Launch screen with brand logo, tagline, intro & outro animations',
    icon: Sparkles,
    badge: '.PNG',
    template: {
      type: 'splash_screen',
      name: 'Launch Splash Screen',
      label: 'Brand Launch Screen',
      splashFileType: 'png',
      splashBrandTitle: 'FlowCraft Pro',
      splashTagline: 'From Idea to Automated',
      splashMediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      splashBgColor: '#0A0E17',
      splashDwellDuration: 2.5,
      splashAutoAdvance: true,
      splashIntroAnimation: 'scale-up',
      splashIntroDuration: 0.8,
      splashIntroSound: true,
      splashOutroAnimation: 'fade-out',
      splashOutroDuration: 0.5,
      hasAction: true,
      trigger: 'onClick',
      actionType: 'navigate',
      transition: 'fade',
      transitionDuration: 500,
    },
  },
  {
    id: 'asset_splash_mp4',
    label: 'Motion Video Splash (.MP4)',
    category: 'Launch & Splash',
    description: 'Cinematic video launch sequence with curtain/zoom outro',
    icon: Video,
    badge: '.MP4',
    template: {
      type: 'splash_screen',
      name: 'Video Motion Splash',
      label: 'Motion Launch Screen',
      splashFileType: 'mp4',
      splashBrandTitle: 'FlowCraft Pro',
      splashTagline: 'From Idea to Automated',
      splashMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4',
      splashBgColor: '#05070D',
      splashVideoSizeMode: 'fullscreen',
      splashVideoAspectRatio: '9:16',
      splashVideoCustomWidth: 88,
      splashVideoFit: 'cover',
      splashVideoLockProportions: true,
      splashDwellDuration: 3.0,
      splashAutoAdvance: true,
      splashIntroAnimation: 'blur-in',
      splashIntroDuration: 1.0,
      splashIntroSound: false,
      splashOutroAnimation: 'slide-up-curtain',
      splashOutroDuration: 0.6,
      hasAction: true,
      trigger: 'onClick',
      actionType: 'navigate',
      transition: 'slide-up',
      transitionDuration: 600,
    },
  },
];

interface AssetPaletteProps {
  onAddElement: (template: Omit<ElementProperties, 'id'>) => void;
  activeScreenTitle?: string;
  onClose?: () => void;
}

export const AssetPalette: React.FC<AssetPaletteProps> = ({
  onAddElement,
  activeScreenTitle,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Financial Dashboard & Live Data',
    'Sliders & Media',
    'Figma Shapes',
    'Typography',
    'UI Controls',
    'Data & Feedback',
    'Forms & Auth',
    'Navigation',
    'Launch & Splash',
  ];

  const filteredAssets = ASSET_PALETTE_TEMPLATES.filter((asset) => {
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
    const matchesQuery = 
      asset.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleDragStart = (e: React.DragEvent, asset: AssetTemplateItem) => {
    const payload = JSON.stringify(asset.template);
    e.dataTransfer.setData('application/flowcraft-element', payload);
    e.dataTransfer.setData('text/plain', asset.label);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleInsertClick = (asset: AssetTemplateItem) => {
    onAddElement(asset.template);
    setRecentlyAddedId(asset.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1200);
  };

  return (
    <aside 
      aria-label="Figma Complete Asset Palette"
      className="flex h-full w-80 flex-col border-r border-violet-500/15 bg-[#0C0A18]/95 backdrop-blur-2xl text-slate-100 select-none shrink-0 z-30 transition-all duration-300 shadow-2xl shadow-black/60"
    >
      {/* Palette Header */}
      <div className="border-b border-violet-500/15 p-3.5 bg-[#090714]/85">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B39F4] to-[#8B5CF6] text-white shadow-md shadow-violet-600/35">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Asset Palette</h3>
                <span className="rounded bg-violet-600/20 border border-violet-500/30 px-1.5 py-0.2 text-[9px] font-bold text-violet-300">
                  Figma Kit
                </span>
              </div>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-lg border border-violet-500/20 bg-[#16122C] p-1 text-slate-400 hover:bg-[#221B40] hover:text-white transition-colors"
              title="Collapse Asset Palette"
            >
              <ChevronLeft className="h-4 w-4 text-violet-400" />
            </button>
          )}
        </div>

        {activeScreenTitle && (
          <div className="mt-2 flex items-center justify-between rounded-lg bg-[#141028]/90 px-2.5 py-1.5 border border-violet-500/20 text-[11px]">
            <span className="text-slate-400">Target Screen:</span>
            <span className="font-semibold text-violet-300 truncate max-w-[150px]">{activeScreenTitle}</span>
          </div>
        )}

        {/* Search input */}
        <div className="relative mt-2.5">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all Figma assets, sliders, shapes..."
            className="w-full rounded-xl border border-violet-500/25 bg-[#120F24]/90 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-violet-500/15 bg-[#090714]/60 p-2 text-xs no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] text-white shadow-sm shadow-violet-600/35 border border-violet-400/30'
                : 'text-slate-400 hover:bg-[#1A1435] hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Draggable Components List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-slate-500 text-xs">
            <Search className="h-6 w-6 text-slate-600 mb-2 stroke-[1.5]" />
            <p className="font-medium text-slate-400">No assets matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-2 text-[11px] text-violet-400 hover:underline font-semibold"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const Icon = asset.icon;
            const isRecentlyAdded = recentlyAddedId === asset.id;

            return (
              <div
                key={asset.id}
                draggable
                onDragStart={(e) => handleDragStart(e, asset)}
                onClick={() => handleInsertClick(asset)}
                className={`group relative flex items-start gap-2.5 rounded-xl border p-2.5 cursor-grab active:cursor-grabbing transition-all select-none ${
                  isRecentlyAdded
                    ? 'border-emerald-500/80 bg-emerald-500/10 shadow-md ring-1 ring-emerald-500/40'
                    : 'border-violet-500/15 bg-[#120F24]/60 hover:border-violet-500/50 hover:bg-[#1A1435] hover:shadow-lg hover:shadow-violet-950/40'
                }`}
                title="Drag and drop onto artboard, or click '+' to append"
              >
                {/* Drag Grip Handle */}
                <div className="flex items-center text-slate-600 group-hover:text-slate-400 mt-0.5 shrink-0">
                  <GripVertical className="h-3.5 w-3.5" />
                </div>

                {/* Component Icon */}
                <div className="rounded-lg bg-[#181335] p-2 text-slate-400 group-hover:bg-violet-600/20 group-hover:text-violet-300 transition-colors shrink-0 border border-violet-500/15">
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                      {asset.label}
                    </span>
                    {asset.badge && (
                      <span className="shrink-0 rounded bg-violet-600/20 border border-violet-500/25 px-1.5 py-0.2 text-[9px] font-mono font-bold text-violet-300">
                        {asset.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-400">
                    {asset.description}
                  </p>
                </div>

                {/* Quick Add or Confirmation */}
                <button
                  type="button"
                  aria-label={`Insert ${asset.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInsertClick(asset);
                  }}
                  className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-all shrink-0 ${
                    isRecentlyAdded
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-violet-500/25 bg-[#16122C] text-slate-400 opacity-60 group-hover:opacity-100 hover:bg-[#6B39F4] hover:border-violet-400 hover:text-white'
                  }`}
                  title="Click to insert into selected artboard"
                >
                  {isRecentlyAdded ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Footer */}
      <div className="border-t border-violet-500/15 p-3 bg-[#090714]/85">
        <div className="flex items-start gap-2 text-[11px] text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong className="text-slate-200">FlowCraft Figma Complete:</strong> Drag any component directly onto an artboard screen, or click <Plus className="inline h-2.5 w-2.5 mx-0.5" /> to append.
          </p>
        </div>
      </div>
    </aside>
  );
};
