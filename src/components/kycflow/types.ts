export type NodeCategory = 
  | 'Discovery & Acquisition'
  | 'Onboarding & Activation'
  | 'Core Engagement & Navigation'
  | 'Retention & Re-engagement'
  | 'Conversion & Transaction'
  | 'Support & Feedback'
  | 'Account Management & System'
  | 'Identity & OCR'
  | 'Biometrics'
  | 'Risk & Fraud'
  | 'Contact Verification'
  | 'Compliance & AML'
  | 'Logic & Branching';

export interface NodePropertyConfig {
  // Common & Time Estimation
  estimatedCompletionSeconds: number;

  // Identity & OCR
  ocrConfidenceThreshold?: number; // e.g. 95%
  allowedDocTypes?: string[]; // ['Passport', 'Driver License', 'National ID']
  extractionMode?: 'realtime' | 'async';
  barcodeParsing?: boolean;

  // Biometrics & Liveness
  livenessMode?: 'passive' | 'active_challenge';
  depthSensitivity?: number; // 0.1 to 1.0
  antiSpoofModel?: string; // 'v3.4-neural-biometric'
  timeoutSeconds?: number;

  // Risk & Fraud
  riskThreshold?: number; // e.g. 15 / 100
  fraudEngine?: 'Internal ML' | 'LexisNexis' | 'Chainalysis';
  sanctionsCheck?: boolean;
  geoIpVelocity?: boolean;

  // Contact
  smsOtpLength?: number;
  otpRetryLimit?: number;
  emailMxCheck?: boolean;

  // Address
  addressValidityDays?: number; // 90 days
  matchingRigor?: 'strict' | 'fuzzy';

  // 1. Discovery & Acquisition
  campaignSource?: 'Meta / Instagram' | 'Google Search' | 'Organic / Referral' | 'TikTok';
  attributionWindowDays?: number;
  deepLinkPath?: string;
  fallbackWebUrl?: string;
  deferredRouting?: boolean;
  appStorePlatform?: 'Apple App Store' | 'Google Play Store' | 'Universal';
  conversionRateGoal?: number;

  // 2. Onboarding & Activation
  splashDurationSeconds?: number;
  carouselSlidesCount?: number;
  skipEnabled?: boolean;
  authProviders?: string[];
  mfaRequired?: boolean;
  permissionsRequired?: string[];
  permissionExplanationRigor?: 'gentle' | 'standard' | 'strict';
  personalizationTags?: string[];
  walkthroughStepsCount?: number;

  // 3. Core Engagement & Navigation
  dashboardWidgets?: string[];
  refreshIntervalSeconds?: number;
  navStyle?: 'Bottom Tab Bar' | 'Drawer / Hamburger' | 'Floating Rail';
  activeTabsCount?: number;
  searchFilterTags?: string[];
  instantAutoSuggest?: boolean;
  detailLayoutTemplate?: 'Card Grid' | 'Hero Media' | 'List Rows';
  actionConfirmStyle?: 'Modal Sheet' | 'Toast Snackbar' | 'Haptic Check';
  emptyStateActionLabel?: string;

  // 4. Retention & Re-engagement
  pushCadence?: 'Immediate' | 'Daily Digest' | 'Smart AI Optimized';
  pushPriority?: 'High' | 'Normal';
  inAppBannerPosition?: 'Top Floating' | 'Bottom Drawer' | 'Center Modal';
  activityFeedRetentionDays?: number;
  loyaltyTierLevels?: number;
  pointsMultiplier?: number;

  // 5. Conversion & Transaction
  pricingBillingCycle?: 'Monthly' | 'Annual (20% Off)' | 'Lifetime';
  paywallDiscountPercent?: number;
  checkoutStepCount?: number;
  guestCheckoutAllowed?: boolean;
  paymentMethods?: string[];
  biometricPayAuth?: boolean;
  automatedEmailReceipt?: boolean;

  // 6. Support & Feedback
  faqCategoryCount?: number;
  liveChatProvider?: 'Zendesk' | 'Intercom' | 'AI Assistant';
  chatResponseTargetMins?: number;
  feedbackTriggerEvent?: 'Post-Transaction' | 'Milestone Reached' | 'Manual Help';
  npsScale?: '1-10 NPS' | '5-Star Emoji';
  ratingMinMilestone?: number;

  // 7. Account Management & System
  securityMfaMethod?: 'TOTP Authenticator' | 'SMS' | 'Hardware Key';
  offlineCacheDurationHours?: number;
  forceAppUpdateMinVersion?: string;
  gdprDataExportFormat?: 'JSON' | 'CSV' | 'Encrypted Archive';
  deletionCoolingOffDays?: number;
}

export interface StudioNode {
  id: string;
  type: string;
  name: string;
  category: NodeCategory;
  x: number;
  y: number;
  status: 'idle' | 'running' | 'completed' | 'error';
  description: string;
  properties: NodePropertyConfig;
}

export interface StudioCable {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}

export interface AIQuestion {
  id: string;
  question: string;
  subtitle: string;
  options: {
    id: string;
    label: string;
    description: string;
    estimatedSecondsDelta: number;
    recommendedNodes: string[];
  }[];
}
