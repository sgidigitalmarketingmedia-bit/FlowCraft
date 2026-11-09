import { DataBindingConfig } from '../types/builder';

export interface MarketTickerQuote {
  symbol: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  change24h: number;
  volume24h: string;
  high24h: number;
  low24h: number;
  sparkline: number[];
}

export const LIVE_MARKET_TICKERS: Record<string, MarketTickerQuote> = {
  'BTC/USD': {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    basePrice: 94250,
    currentPrice: 94250,
    change24h: 3.82,
    volume24h: '$38.4B',
    high24h: 95400,
    low24h: 91800,
    sparkline: [89000, 90200, 91500, 90800, 92400, 93800, 94250],
  },
  'ETH/USD': {
    symbol: 'ETH/USD',
    name: 'Ethereum',
    basePrice: 3420,
    currentPrice: 3420,
    change24h: 2.15,
    volume24h: '$19.2B',
    high24h: 3480,
    low24h: 3340,
    sparkline: [3200, 3250, 3310, 3280, 3360, 3390, 3420],
  },
  'SOL/USD': {
    symbol: 'SOL/USD',
    name: 'Solana',
    basePrice: 194.50,
    currentPrice: 194.50,
    change24h: 6.40,
    volume24h: '$8.5B',
    high24h: 198.00,
    low24h: 182.00,
    sparkline: [175, 179, 184, 182, 188, 191, 194.5],
  },
  'S&P 500': {
    symbol: 'S&P 500',
    name: 'Standard & Poor 500',
    basePrice: 5864.20,
    currentPrice: 5864.20,
    change24h: 0.84,
    volume24h: '$112B',
    high24h: 5880,
    low24h: 5830,
    sparkline: [5810, 5825, 5830, 5845, 5850, 5860, 5864.2],
  },
  'NASDAQ': {
    symbol: 'NASDAQ',
    name: 'Nasdaq Composite',
    basePrice: 18420.50,
    currentPrice: 18420.50,
    change24h: 1.28,
    volume24h: '$94B',
    high24h: 18490,
    low24h: 18250,
    sparkline: [18100, 18180, 18250, 18310, 18360, 18400, 18420.5],
  },
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    basePrice: 232.80,
    currentPrice: 232.80,
    change24h: -0.42,
    volume24h: '$12.4B',
    high24h: 235.10,
    low24h: 231.50,
    sparkline: [234, 235, 233, 234.5, 233, 232.5, 232.8],
  },
  'NVDA': {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    basePrice: 141.60,
    currentPrice: 141.60,
    change24h: 4.35,
    volume24h: '$42.1B',
    high24h: 143.20,
    low24h: 136.80,
    sparkline: [132, 134, 136, 135, 138, 140, 141.6],
  },
  'EUR/USD': {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    basePrice: 1.0875,
    currentPrice: 1.0875,
    change24h: 0.18,
    volume24h: '$480B',
    high24h: 1.0910,
    low24h: 1.0850,
    sparkline: [1.084, 1.085, 1.086, 1.0855, 1.0868, 1.0872, 1.0875],
  },
};

export interface DatasetPreset {
  id: string;
  name: string;
  category: 'Crypto' | 'Equities' | 'SaaS Finance' | 'DeFi' | 'Risk & Credit';
  description: string;
  iconName: string;
  defaultConfig: Partial<DataBindingConfig>;
  samplePoints: { label: string; value: number }[];
  sampleTable?: Record<string, any>[];
  sampleDonut?: { label: string; value: number; color: string; percentage: number }[];
  sampleGauge?: { value: number; max: number; min: number; label: string; status: 'healthy' | 'moderate' | 'critical' };
}

export const DATASET_PRESETS: DatasetPreset[] = [
  {
    id: 'crypto_portfolio',
    name: 'Crypto & Web3 Growth Vault',
    category: 'Crypto',
    description: 'High-frequency liquid crypto assets ($148,920.45 total balance, +12.4% 30d yield)',
    iconName: 'Coins',
    defaultConfig: {
      sourceType: 'preset_dataset',
      presetId: 'crypto_portfolio',
      currencyPrefix: '$',
      valueKey: 'price',
      labelKey: 'date',
      showLivePulse: true,
    },
    samplePoints: [
      { label: '09:00', value: 132400 },
      { label: '11:00', value: 136800 },
      { label: '13:00', value: 134200 },
      { label: '15:00', value: 141500 },
      { label: '17:00', value: 139800 },
      { label: '19:00', value: 144200 },
      { label: '21:00', value: 148920 },
    ],
    sampleDonut: [
      { label: 'Bitcoin (BTC)', value: 68500, color: '#F59E0B', percentage: 46 },
      { label: 'Ethereum (ETH)', value: 42300, color: '#8B5CF6', percentage: 28 },
      { label: 'Solana (SOL)', value: 24200, color: '#06B6D4', percentage: 16 },
      { label: 'USDC Vault', value: 13920, color: '#10B981', percentage: 10 },
    ],
    sampleTable: [
      { id: 'tx_1', asset: 'BTC', type: 'Buy Trade', amount: '+$4,250.00', status: 'Confirmed', time: '14:20:12' },
      { id: 'tx_2', asset: 'ETH', type: 'Staking Reward', amount: '+$312.40', status: 'Confirmed', time: '13:45:00' },
      { id: 'tx_3', asset: 'SOL', type: 'Instant Swap', amount: '-$1,850.00', status: 'Executed', time: '12:10:44' },
      { id: 'tx_4', asset: 'USDC', type: 'Yield Payout', amount: '+$94.20', status: 'Settled', time: '10:00:00' },
    ],
  },
  {
    id: 'stock_tech_rally',
    name: 'Tech Equities Growth Index',
    category: 'Equities',
    description: 'Nasdaq top-weighted technology basket with live multi-factor indicators ($420,800.00, +24.8%)',
    iconName: 'TrendingUp',
    defaultConfig: {
      sourceType: 'preset_dataset',
      presetId: 'stock_tech_rally',
      currencyPrefix: '$',
      valueKey: 'price',
      labelKey: 'date',
      showLivePulse: true,
    },
    samplePoints: [
      { label: 'Mon', value: 395000 },
      { label: 'Tue', value: 402000 },
      { label: 'Wed', value: 398500 },
      { label: 'Thu', value: 412000 },
      { label: 'Fri', value: 420800 },
    ],
    sampleDonut: [
      { label: 'NVIDIA (NVDA)', value: 155000, color: '#10B981', percentage: 37 },
      { label: 'Apple (AAPL)', value: 118000, color: '#3B82F6', percentage: 28 },
      { label: 'Microsoft (MSFT)', value: 92000, color: '#06B6D4', percentage: 22 },
      { label: 'Cash Reserves', value: 55800, color: '#64748B', percentage: 13 },
    ],
    sampleTable: [
      { id: 'eq_1', asset: 'NVDA', type: 'Dividend Reinvest', amount: '+$1,450.00', status: 'Settled', time: '09:30:00' },
      { id: 'eq_2', asset: 'AAPL', type: 'Limit Buy', amount: '-$4,800.00', status: 'Filled', time: '11:15:20' },
      { id: 'eq_3', asset: 'MSFT', type: 'Option Exercise', amount: '+$8,200.00', status: 'Executed', time: '15:45:10' },
    ],
  },
  {
    id: 'fintech_revenue_monthly',
    name: 'SaaS MRR & Payment Volume',
    category: 'SaaS Finance',
    description: 'Monthly Recurring Revenue stream with net expansion, churn and processing volume ($84,200.00/mo)',
    iconName: 'BarChart3',
    defaultConfig: {
      sourceType: 'preset_dataset',
      presetId: 'fintech_revenue_monthly',
      currencyPrefix: '$',
      valueKey: 'revenue',
      labelKey: 'month',
      showLivePulse: false,
    },
    samplePoints: [
      { label: 'Jan', value: 48000 },
      { label: 'Feb', value: 53200 },
      { label: 'Mar', value: 58900 },
      { label: 'Apr', value: 64100 },
      { label: 'May', value: 71500 },
      { label: 'Jun', value: 77800 },
      { label: 'Jul', value: 84200 },
    ],
    sampleDonut: [
      { label: 'Enterprise Annual', value: 44000, color: '#6366F1', percentage: 52 },
      { label: 'Growth Tier', value: 26000, color: '#3B82F6', percentage: 31 },
      { label: 'Self-Serve Pro', value: 14200, color: '#EC4899', percentage: 17 },
    ],
    sampleTable: [
      { id: 'sub_1', asset: 'Enterprise', type: 'New Contract (ACV)', amount: '+$24,000.00', status: 'Active', time: 'Today' },
      { id: 'sub_2', asset: 'Growth Tier', type: 'Seat Expansion (+12)', amount: '+$1,440.00', status: 'Active', time: 'Yesterday' },
      { id: 'sub_3', asset: 'Pro Team', type: 'Monthly Renewal', amount: '+$350.00', status: 'Auto-Renewed', time: 'Oct 02' },
    ],
  },
  {
    id: 'defi_liquidity',
    name: 'DeFi Liquidity Pool (AMM)',
    category: 'DeFi',
    description: 'Concentrated liquidity pool pair with live swap volume, fee APR and impermanent loss buffer ($1.24M TVL)',
    iconName: 'Zap',
    defaultConfig: {
      sourceType: 'preset_dataset',
      presetId: 'defi_liquidity',
      currencyPrefix: '$',
      valueKey: 'tvl',
      labelKey: 'time',
      showLivePulse: true,
    },
    samplePoints: [
      { label: '00:00', value: 1180000 },
      { label: '04:00', value: 1210000 },
      { label: '08:00', value: 1195000 },
      { label: '12:00', value: 1245000 },
      { label: '16:00', value: 1230000 },
      { label: '20:00', value: 1240500 },
    ],
    sampleDonut: [
      { label: 'WBTC (50%)', value: 620250, color: '#F59E0B', percentage: 50 },
      { label: 'USDC (50%)', value: 620250, color: '#10B981', percentage: 50 },
    ],
    sampleTable: [
      { id: 'swap_1', asset: 'WBTC / USDC', type: 'Swap In', amount: '+$84,200.00', status: '0.05% Fee Collected', time: 'Just now' },
      { id: 'swap_2', asset: 'USDC / WBTC', type: 'Swap Out', amount: '-$42,100.00', status: '0.05% Fee Collected', time: '3m ago' },
      { id: 'swap_3', asset: 'Liquidity Add', type: 'Mint Position', amount: '+$150,000.00', status: 'Concentrated', time: '14m ago' },
    ],
  },
  {
    id: 'credit_score_gauge',
    name: 'FICO & Risk Liquidation Gauge',
    category: 'Risk & Credit',
    description: 'Real-time financial risk health score, collateral ratio & credit index meter',
    iconName: 'ShieldCheck',
    defaultConfig: {
      sourceType: 'preset_dataset',
      presetId: 'credit_score_gauge',
      currencyPrefix: '',
      unitSuffix: ' pts',
      valueKey: 'score',
      showLivePulse: true,
    },
    samplePoints: [
      { label: '6m ago', value: 720 },
      { label: '4m ago', value: 745 },
      { label: '2m ago', value: 765 },
      { label: 'Current', value: 785 },
    ],
    sampleGauge: {
      value: 785,
      min: 300,
      max: 850,
      label: 'Credit Score',
      status: 'healthy',
    },
  },
];

// Generate simulated tick fluctuation for live market tickers
export function getSimulatedTick(currentVal: number, volatility: 'low' | 'medium' | 'high' = 'medium'): { nextVal: number; deltaPct: number; isUp: boolean } {
  const factor = volatility === 'low' ? 0.002 : volatility === 'high' ? 0.015 : 0.006;
  const changePct = (Math.random() * 2 - 0.98) * factor;
  const nextVal = Math.round((currentVal * (1 + changePct)) * 100) / 100;
  const deltaPct = Math.round(changePct * 10000) / 100;
  return {
    nextVal,
    deltaPct,
    isUp: deltaPct >= 0,
  };
}
