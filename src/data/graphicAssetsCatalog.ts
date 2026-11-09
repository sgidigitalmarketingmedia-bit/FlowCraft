import { GraphicAssetItem } from '../types/builder';

export const DEFAULT_GRAPHIC_ASSETS: GraphicAssetItem[] = [
  // =========================================================================
  // 1. PROMOTIONAL BANNERS & CAROUSEL ASSETS (Multi-PNG / High-Res)
  // =========================================================================
  {
    id: 'asset_banner_cyber_season9',
    name: 'Season 9: Cyber Void Promotional Banner',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    type: 'image',
    format: 'png',
    category: 'banner',
    dimensions: '1920x1080',
    size: '1.4 MB',
    tags: ['banner', 'carousel', 'cyberpunk', 'gaming', 'promo', 'dark mode'],
    createdAt: '2026-02-15',
  },
  {
    id: 'asset_banner_fintech_metal_card',
    name: 'Titanium Prime Metal Card Launch Banner',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
    type: 'image',
    format: 'png',
    category: 'banner',
    dimensions: '1920x1080',
    size: '1.2 MB',
    tags: ['banner', 'carousel', 'fintech', 'banking', 'luxury', 'cards'],
    createdAt: '2026-03-01',
  },
  {
    id: 'asset_banner_neon_plasma',
    name: 'Neon Hologram Horizon Banner',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    type: 'image',
    format: 'png',
    category: 'banner',
    dimensions: '1920x1080',
    size: '980 KB',
    tags: ['banner', 'carousel', 'neon', 'arcade', 'glow', 'interactive'],
    createdAt: '2026-03-12',
  },
  {
    id: 'asset_banner_ai_workspace',
    name: 'Autonomous AI Cloud Studio Hero',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    type: 'image',
    format: 'png',
    category: 'banner',
    dimensions: '1920x1080',
    size: '1.1 MB',
    tags: ['banner', 'carousel', 'saas', 'dashboard', 'ai', 'cloud'],
    createdAt: '2026-03-20',
  },
  {
    id: 'asset_banner_minimal_architecture',
    name: 'Architectural Modern Loft Banner',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    type: 'image',
    format: 'png',
    category: 'banner',
    dimensions: '1920x1080',
    size: '1.5 MB',
    tags: ['banner', 'carousel', 'architecture', 'interior', 'minimal', 'lifestyle'],
    createdAt: '2026-04-01',
  },
  {
    id: 'asset_banner_crypto_vault',
    name: 'Hardware Biometric Ledger Banner',
    url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&auto=format&fit=crop&q=80',
    type: 'image',
    format: 'png',
    category: 'banner',
    dimensions: '1920x1080',
    size: '890 KB',
    tags: ['banner', 'carousel', 'crypto', 'web3', 'security', 'vault'],
    createdAt: '2026-04-10',
  },

  // =========================================================================
  // 2. VIDEO STREAMING & INTERNET VIDEO SOURCES (.MP4 / Loops)
  // =========================================================================
  {
    id: 'asset_video_digital_screens',
    name: 'Mixkit Digital Animation of Screens Loop',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4',
    type: 'video',
    format: 'mp4',
    category: 'video',
    dimensions: '1920x1080 (16:9)',
    size: '4.8 MB',
    tags: ['video', 'mp4', 'internet', 'tech', 'animation', 'loop', 'hd'],
    createdAt: '2026-01-10',
  },
  {
    id: 'asset_video_ocean_waves',
    name: 'Mixkit Water Surface Waves Motion Loop',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    type: 'video',
    format: 'mp4',
    category: 'video',
    dimensions: '1920x1080 (16:9)',
    size: '3.9 MB',
    tags: ['video', 'mp4', 'internet', 'nature', 'calm', 'waves', 'ambient'],
    createdAt: '2026-01-18',
  },
  {
    id: 'asset_video_stars_space',
    name: 'Mixkit Cosmic Nebula & Deep Space Stars',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
    type: 'video',
    format: 'mp4',
    category: 'video',
    dimensions: '1920x1080 (16:9)',
    size: '5.2 MB',
    tags: ['video', 'mp4', 'internet', 'space', 'cinematic', 'cosmic', 'stars'],
    createdAt: '2026-02-04',
  },
  {
    id: 'asset_video_developer_code',
    name: 'Software Engineer Code IDE Terminal Loop',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1728-large.mp4',
    type: 'video',
    format: 'mp4',
    category: 'video',
    dimensions: '1920x1080 (16:9)',
    size: '4.1 MB',
    tags: ['video', 'mp4', 'internet', 'code', 'developer', 'terminal', 'engineering'],
    createdAt: '2026-02-22',
  },

  // =========================================================================
  // 3. APP UI ASSETS & GRAPHIC FRAMES
  // =========================================================================
  {
    id: 'asset_ui_credit_card_front',
    name: 'Holographic Visa Platinum Chip Card',
    url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    format: 'png',
    category: 'ui',
    dimensions: '800x500',
    size: '420 KB',
    tags: ['ui', 'card', 'payment', 'fintech', 'checkout'],
    createdAt: '2026-03-05',
  },
  {
    id: 'asset_ui_vitals_health_graph',
    name: 'HealthTech Biometrics Heart Rate Wave',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    format: 'jpg',
    category: 'ui',
    dimensions: '800x600',
    size: '510 KB',
    tags: ['ui', 'health', 'vitals', 'medical', 'sensor'],
    createdAt: '2026-03-08',
  },
  {
    id: 'asset_ui_analytics_dashboard_card',
    name: 'Revenue Metric Growth Chart Visual',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    format: 'jpg',
    category: 'ui',
    dimensions: '800x600',
    size: '620 KB',
    tags: ['ui', 'chart', 'analytics', 'fintech', 'metrics'],
    createdAt: '2026-03-14',
  },

  // =========================================================================
  // 4. KYC DOCUMENT SCANNERS & IDENTITY ASSETS
  // =========================================================================
  {
    id: 'asset_doc_id_card_sample',
    name: 'Government Photoid Card KYC Specimen',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    format: 'jpg',
    category: 'document',
    dimensions: '850x540',
    size: '340 KB',
    tags: ['document', 'kyc', 'passport', 'id', 'identity', 'scanner'],
    createdAt: '2026-02-10',
  },
  {
    id: 'asset_doc_passport_biometric',
    name: 'Biometric Passport RFID Booklet Sample',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    format: 'jpg',
    category: 'document',
    dimensions: '800x600',
    size: '480 KB',
    tags: ['document', 'passport', 'travel', 'border', 'kyc'],
    createdAt: '2026-02-12',
  },
];

const LOCAL_STORAGE_KEY = 'flowcraft_graphic_cms_assets';

/**
 * Load all assets from defaults + user local computer imports saved in localStorage
 */
export function getAllCmsAssets(): GraphicAssetItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return DEFAULT_GRAPHIC_ASSETS;
    const parsed: GraphicAssetItem[] = JSON.parse(raw);
    // Merge custom user uploads with defaults, preserving unique IDs
    const merged = [...parsed];
    DEFAULT_GRAPHIC_ASSETS.forEach((def) => {
      if (!merged.some((m) => m.id === def.id)) {
        merged.push(def);
      }
    });
    return merged;
  } catch (e) {
    console.error('Failed to load CMS assets from storage:', e);
    return DEFAULT_GRAPHIC_ASSETS;
  }
}

/**
 * Save user custom asset into the CMS library
 */
export function saveCmsAsset(asset: GraphicAssetItem): GraphicAssetItem[] {
  const current = getAllCmsAssets();
  const filtered = current.filter((a) => a.id !== asset.id);
  const updated = [asset, ...filtered];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save asset to localStorage:', e);
  }
  return updated;
}

/**
 * Delete a user asset from the CMS library
 */
export function deleteCmsAsset(assetId: string): GraphicAssetItem[] {
  const current = getAllCmsAssets();
  const updated = current.filter((a) => a.id !== assetId);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove asset from localStorage:', e);
  }
  return updated;
}
