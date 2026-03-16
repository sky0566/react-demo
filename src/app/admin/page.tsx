'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';

/* ---------- Types ---------- */
interface TrafficPeriod { label: string; views: number; visitors: number; }
interface OverviewData {
  traffic: TrafficPeriod[];
  products: { total: number; active: number };
  categories: number;
  inquiries: { total: number; new: number };
}
interface DailyTraffic { date: string; views: number; visitors: number; }
interface PageStat { page_path: string; page_title: string; views: number; visitors: number; }
interface PieItem { name: string; value: number; }
interface CountryItem { name: string; views: number; visitors: number; }
interface VisitorItem {
  ip_hash: string; browser: string; os: string; device: string;
  country: string; referrer: string; views: number; last_visit: string;
}
interface ReferrerItem { name: string; views: number; }

/* ---------- Country to ISO code mapping (for flag images) ---------- */
const COUNTRY_CODES: Record<string, string> = {
  'United States': 'us', 'China': 'cn', 'Germany': 'de', 'United Kingdom': 'gb',
  'India': 'in', 'Japan': 'jp', 'Brazil': 'br', 'Australia': 'au',
  'Canada': 'ca', 'France': 'fr', 'Russia': 'ru', 'South Korea': 'kr',
  'Italy': 'it', 'Spain': 'es', 'Mexico': 'mx', 'Netherlands': 'nl',
  'Turkey': 'tr', 'Saudi Arabia': 'sa', 'UAE': 'ae', 'Singapore': 'sg',
  'Malaysia': 'my', 'Indonesia': 'id', 'Thailand': 'th', 'Vietnam': 'vn',
  'Egypt': 'eg', 'South Africa': 'za', 'Nigeria': 'ng', 'Iran': 'ir',
  'Pakistan': 'pk', 'Philippines': 'ph', 'Poland': 'pl', 'Sweden': 'se',
  'Switzerland': 'ch', 'Belgium': 'be', 'Portugal': 'pt', 'Argentina': 'ar',
  'Colombia': 'co', 'Chile': 'cl', 'Peru': 'pe', 'Ukraine': 'ua',
  'Czech Republic': 'cz', 'Romania': 'ro', 'Austria': 'at', 'Denmark': 'dk',
  'Norway': 'no', 'Finland': 'fi', 'Ireland': 'ie', 'New Zealand': 'nz',
  'Israel': 'il', 'Hong Kong': 'hk', 'Taiwan': 'tw', 'Greece': 'gr',
};

function CountryFlag({ country, size = 16 }: { country: string; size?: number }) {
  const code = COUNTRY_CODES[country];
  if (!code) return <span className="inline-block rounded-sm bg-gray-200" style={{ width: size, height: size * 0.75 }} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={country}
      width={size}
      height={size * 0.75}
      className="inline-block rounded-sm object-cover"
      style={{ width: size, height: size * 0.75 }}
    />
  );
}

/* ---------- Colors ---------- */
const CHART_BLUE = '#3b82f6';
const CHART_GREEN = '#22c55e';
const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#64748b'];

/* ---------- Range options ---------- */
const RANGE_OPTIONS = [
  { label: '7d', value: '7' },
  { label: '14d', value: '14' },
  { label: '30d', value: '30' },
  { label: '60d', value: '60' },
  { label: '90d', value: '90' },
];

/* ---------- Reusable Range Tabs ---------- */
function RangeTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-0.5">
      {RANGE_OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            value === o.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Widget Card ---------- */
function WidgetCard({ title, children, right, className = '' }: {
  title: string; children: React.ReactNode; right?: React.ReactNode; className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {right}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

/* ---------- Pie Widget (center overlay text + legend below, no clipped labels) ---------- */
function PieWidget({ title, data, right }: { title: string; data: PieItem[]; right?: React.ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = data.reduce((s, d) => s + d.value, 0);
  const active = data[activeIndex];
  return (
    <WidgetCard title={title} right={right}>
      {data.length > 0 ? (
        <div className="flex flex-col items-center">
          <div className="relative" style={{ width: 200, height: 200 }}>
            <PieChart width={200} height={200}>
              <Pie
                data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={78}
                dataKey="value" paddingAngle={2} stroke="none"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PIE_COLORS[i % PIE_COLORS.length]}
                    opacity={i === activeIndex ? 1 : 0.6}
                    style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
            </PieChart>
            {/* Center overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[13px] font-semibold text-gray-700 leading-tight">{active?.name}</span>
              <span className="text-[11px] text-gray-400">{total > 0 ? `${(((active?.value ?? 0) / total) * 100).toFixed(0)}%` : '0%'}</span>
            </div>
          </div>
          <div className="w-full space-y-1.5 mt-2">
            {data.map((d, i) => (
              <div
                key={d.name}
                className={`flex items-center justify-between text-xs px-2 py-1 rounded-md cursor-pointer transition-colors ${activeIndex === i ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-gray-700 font-medium">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{d.value}</span>
                  <span className="text-gray-400 w-8 text-right">{total > 0 ? `${(d.value / total * 100).toFixed(0)}%` : '0%'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : <p className="text-sm text-gray-400 text-center py-8">No data</p>}
    </WidgetCard>
  );
}

/* ---------- Custom Tooltip ---------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs">
      <p className="text-gray-400 mb-1 font-medium">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }, i: number) => (
        <p key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-semibold">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

/* ========== Main Dashboard ========== */
export default function AdminDashboard() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [trafficData, setTrafficData] = useState<DailyTraffic[]>([]);
  const [pages, setPages] = useState<PageStat[]>([]);
  const [browserData, setBrowserData] = useState<PieItem[]>([]);
  const [osData, setOsData] = useState<PieItem[]>([]);
  const [deviceData, setDeviceData] = useState<PieItem[]>([]);
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [visitors, setVisitors] = useState<VisitorItem[]>([]);
  const [referrers, setReferrers] = useState<ReferrerItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [trafficRange, setTrafficRange] = useState('30');
  const [pagesRange, setPagesRange] = useState('30');
  const [browserRange, setBrowserRange] = useState('30');
  const [countryRange, setCountryRange] = useState('30');
  const [visitorRange, setVisitorRange] = useState('7');
  const [referrerRange, setReferrerRange] = useState('30');
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineVisitors, setOnlineVisitors] = useState<{ ip_hash: string; browser: string; os: string; device: string; country: string; page_path: string; page_title: string; last_visit: string }[]>([]);

  /* Visitor filters */
  const [vSearch, setVSearch] = useState('');
  const [vCountry, setVCountry] = useState('');
  const [vBrowser, setVBrowser] = useState('');
  const [vDevice, setVDevice] = useState('');

  const fetchOverview = useCallback(async () => {
    const r = await fetch('/api/stats?type=overview');
    setOverview(await r.json());
  }, []);
  const fetchTraffic = useCallback(async () => {
    const r = await fetch(`/api/stats?type=traffic&range=${trafficRange}`);
    const d = await r.json();
    setTrafficData(d.data || []);
  }, [trafficRange]);
  const fetchPages = useCallback(async () => {
    const r = await fetch(`/api/stats?type=pages&range=${pagesRange}`);
    const d = await r.json();
    setPages(d.data || []);
  }, [pagesRange]);
  const fetchBrowsers = useCallback(async () => {
    const r = await fetch(`/api/stats?type=browsers&range=${browserRange}`);
    const d = await r.json();
    setBrowserData(d.browsers || []);
    setOsData(d.oses || []);
    setDeviceData(d.devices || []);
  }, [browserRange]);
  const fetchCountries = useCallback(async () => {
    const r = await fetch(`/api/stats?type=countries&range=${countryRange}`);
    const d = await r.json();
    setCountries(d.data || []);
  }, [countryRange]);
  const fetchVisitors = useCallback(async () => {
    const r = await fetch(`/api/stats?type=visitors&range=${visitorRange}`);
    const d = await r.json();
    setVisitors(d.data || []);
  }, [visitorRange]);
  const fetchReferrers = useCallback(async () => {
    const r = await fetch(`/api/stats?type=referrers&range=${referrerRange}`);
    const d = await r.json();
    setReferrers(d.data || []);
  }, [referrerRange]);

  const fetchOnline = useCallback(async () => {
    const r = await fetch('/api/stats?type=online');
    const d = await r.json();
    setOnlineCount(d.count || 0);
    setOnlineVisitors(d.data || []);
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchOverview(), fetchTraffic(), fetchPages(), fetchBrowsers(), fetchCountries(), fetchVisitors(), fetchReferrers(), fetchOnline()]);
    setRefreshing(false);
  }, [fetchOverview, fetchTraffic, fetchPages, fetchBrowsers, fetchCountries, fetchVisitors, fetchReferrers, fetchOnline]);

  useEffect(() => {
    Promise.all([fetchOverview(), fetchTraffic(), fetchPages(), fetchBrowsers(), fetchCountries(), fetchVisitors(), fetchReferrers(), fetchOnline()])
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh online count every 30 seconds
  useEffect(() => {
    const timer = setInterval(fetchOnline, 30000);
    return () => clearInterval(timer);
  }, [fetchOnline]);

  useEffect(() => { fetchTraffic(); }, [fetchTraffic]);
  useEffect(() => { fetchPages(); }, [fetchPages]);
  useEffect(() => { fetchBrowsers(); }, [fetchBrowsers]);
  useEffect(() => { fetchCountries(); }, [fetchCountries]);
  useEffect(() => { fetchVisitors(); }, [fetchVisitors]);
  useEffect(() => { fetchReferrers(); }, [fetchReferrers]);

  /* Unique filter options derived from visitors data */
  const visitorCountries = useMemo(() => [...new Set(visitors.map(v => v.country))].sort(), [visitors]);
  const visitorBrowsers = useMemo(() => [...new Set(visitors.map(v => v.browser))].sort(), [visitors]);
  const visitorDevices = useMemo(() => [...new Set(visitors.map(v => v.device))].sort(), [visitors]);

  const filteredVisitors = useMemo(() => {
    let list = visitors;
    if (vSearch) {
      const q = vSearch.toLowerCase();
      list = list.filter(v => v.ip_hash.toLowerCase().includes(q) || v.country.toLowerCase().includes(q) || v.browser.toLowerCase().includes(q) || v.os.toLowerCase().includes(q));
    }
    if (vCountry) list = list.filter(v => v.country === vCountry);
    if (vBrowser) list = list.filter(v => v.browser === vBrowser);
    if (vDevice) list = list.filter(v => v.device === vDevice);
    return list;
  }, [visitors, vSearch, vCountry, vBrowser, vDevice]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-blue-500" />
          <span className="text-sm text-gray-400">Loading analytics...</span>
        </div>
      </div>
    );
  }

  const fmt = (n: number) => n.toLocaleString();

  const todayViews = overview?.traffic.find(t => t.label === 'Today')?.views || 0;
  const yestViews = overview?.traffic.find(t => t.label === 'Yesterday')?.views || 0;
  const viewsDelta = yestViews > 0 ? ((todayViews - yestViews) / yestViews * 100) : 0;
  const todayVisitors = overview?.traffic.find(t => t.label === 'Today')?.visitors || 0;
  const yestVisitors = overview?.traffic.find(t => t.label === 'Yesterday')?.visitors || 0;
  const visitorsDelta = yestVisitors > 0 ? ((todayVisitors - yestVisitors) / yestVisitors * 100) : 0;

  const statCards = [
    {
      label: 'Page Views Today', value: todayViews, delta: viewsDelta,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Visitors Today', value: todayVisitors, delta: visitorsDelta,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Online Now', value: onlineCount, live: true,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />,
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      label: 'Total Products', value: overview?.products.total || 0,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
      gradient: 'from-violet-500 to-violet-600',
    },
    {
      label: 'Inquiries', value: overview?.inquiries.total || 0, badge: overview?.inquiries.new,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ===== Refresh Bar ===== */}
      <div className="flex items-center justify-end">
        <button
          onClick={refreshAll}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 shadow-sm transition-all"
        >
          <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* ===== Stat Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  {card.label}
                  {card.live && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" /></span>}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{fmt(card.value)}</p>
                {card.delta !== undefined && (
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${card.delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d={card.delta >= 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                    </svg>
                    {Math.abs(card.delta).toFixed(1)}% vs yesterday
                  </div>
                )}
              </div>
              <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center relative`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {card.icon}
                </svg>
                {card.badge ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg">
                    {card.badge}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Traffic Summary Row ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">Traffic Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <div className="flex divide-x divide-gray-100 min-w-[600px]">
            {(overview?.traffic || []).map((row) => (
              <div key={row.label} className="flex-1 px-5 py-4 text-center hover:bg-gray-50/50 transition-colors">
                <p className="text-xs text-gray-500 font-medium mb-2">{row.label}</p>
                <p className="text-lg font-bold text-gray-900">{fmt(row.views)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{fmt(row.visitors)} visitors</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Main chart + sidebar ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Traffic trend (2/3) */}
        <div className="xl:col-span-2">
          <WidgetCard title="Traffic Trend" right={<RangeTabs value={trafficRange} onChange={setTrafficRange} />}>
            {trafficData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="views" stroke={CHART_BLUE} strokeWidth={2} fill="url(#viewsGrad)" name="Views" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                  <Area type="monotone" dataKey="visitors" stroke={CHART_GREEN} strokeWidth={2} fill="url(#visitorsGrad)" name="Visitors" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-gray-400 text-center py-16">No traffic data yet</p>}
            <div className="flex items-center justify-center gap-6 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-blue-500" /> Views</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-emerald-500" /> Visitors</span>
            </div>
          </WidgetCard>
        </div>

        {/* Countries sidebar (1/3) */}
        <WidgetCard title="Top Countries" right={<RangeTabs value={countryRange} onChange={setCountryRange} />}>
          {countries.length > 0 ? (
            <div className="space-y-3">
              {countries.map((c, i) => {
                const maxViews = countries[0]?.views || 1;
                const pct = (c.views / maxViews) * 100;
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <CountryFlag country={c.name} size={18} />
                        <span className="text-sm text-gray-700 font-medium">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-blue-600 font-semibold">{fmt(c.views)}</span>
                        <span className="text-gray-400">{fmt(c.visitors)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${PIE_COLORS[i % PIE_COLORS.length]}, ${PIE_COLORS[i % PIE_COLORS.length]}88)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-8">No data</p>}
        </WidgetCard>
      </div>

      {/* ===== Three Pie Charts Row ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Browsers', data: browserData },
          { title: 'Operating Systems', data: osData },
          { title: 'Devices', data: deviceData },
        ].map(({ title, data }) => (
          <PieWidget key={title} title={title} data={data}
            right={title === 'Browsers' ? <RangeTabs value={browserRange} onChange={setBrowserRange} /> : undefined}
          />
        ))}
      </div>

      {/* ===== Referrals + Most Visited Pages ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Referrals */}
        <WidgetCard title="Referral Sources" right={<RangeTabs value={referrerRange} onChange={setReferrerRange} />}>
          {referrers.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={referrers} layout="vertical" barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v: string) => { try { return new URL(v).hostname; } catch { return v; } }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="views" fill={CHART_BLUE} radius={[0, 6, 6, 0]} name="Views" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-10">No referral data</p>}
        </WidgetCard>

        {/* Most Visited Pages */}
        <WidgetCard title="Most Visited Pages" right={<RangeTabs value={pagesRange} onChange={setPagesRange} />}>
          {pages.length > 0 ? (
            <div className="space-y-3">
              {pages.map((p, i) => {
                const maxViews = pages[0]?.views || 1;
                const pct = (p.views / maxViews) * 100;
                return (
                  <div key={p.page_path} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-xs font-bold text-gray-300 w-5 flex-shrink-0">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">{p.page_title || p.page_path}</p>
                          <p className="text-[11px] text-gray-400 truncate">{p.page_path}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs flex-shrink-0 ml-3">
                        <span className="font-semibold text-gray-700">{fmt(p.views)}</span>
                        <span className="text-blue-500">{fmt(p.visitors)}</span>
                      </div>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden ml-7">
                      <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-10">No page data</p>}
        </WidgetCard>
      </div>

      {/* ===== Currently Online Visitors ===== */}
      {onlineVisitors.length > 0 && (
        <WidgetCard
          title={`Currently Online (${onlineCount})`}
          right={
            <div className="flex items-center gap-1.5 text-xs text-rose-500">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" /></span>
              Live
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {onlineVisitors.map((v) => (
              <div key={v.ip_hash} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm flex-shrink-0">
                  {v.ip_hash.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                    <CountryFlag country={v.country} size={14} />
                    <span className="truncate">{v.country || 'Unknown'}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {v.page_title || v.page_path} &middot; {v.browser} &middot; {v.device}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      )}

      {/* ===== Most Active Visitors ===== */}
      <WidgetCard title="Recent Active Visitors" right={<RangeTabs value={visitorRange} onChange={setVisitorRange} />}>
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={vSearch}
              onChange={e => setVSearch(e.target.value)}
              placeholder="Search IP, country, browser..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50/50 transition-colors"
            />
          </div>
          <select
            value={vCountry}
            onChange={e => setVCountry(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
          >
            <option value="">All Countries</option>
            {visitorCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={vBrowser}
            onChange={e => setVBrowser(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
          >
            <option value="">All Browsers</option>
            {visitorBrowsers.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select
            value={vDevice}
            onChange={e => setVDevice(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
          >
            <option value="">All Devices</option>
            {visitorDevices.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {(vSearch || vCountry || vBrowser || vDevice) && (
            <button
              onClick={() => { setVSearch(''); setVCountry(''); setVBrowser(''); setVDevice(''); }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
          <span className="text-[11px] text-gray-400 ml-auto">{filteredVisitors.length} of {visitors.length}</span>
        </div>

        {filteredVisitors.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Visitor</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Views</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Country</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform</th>
                  <th className="text-left px-6 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredVisitors.map((v) => (
                  <tr key={v.ip_hash} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                          {v.ip_hash.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-gray-600 font-mono text-xs">{v.ip_hash}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-semibold text-xs px-2.5 py-1 rounded-full">
                        {v.views}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <CountryFlag country={v.country} size={16} />
                        {v.country}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-600">{v.browser} · {v.os}</div>
                      <div className="text-[11px] text-gray-400">{v.device}</div>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-500 whitespace-nowrap">{v.last_visit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-sm text-gray-400 text-center py-8">{visitors.length > 0 ? 'No visitors match the current filters' : 'No visitor data'}</p>}
      </WidgetCard>
    </div>
  );
}
