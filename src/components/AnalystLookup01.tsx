import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Award,
  TrendingUp,
  Target,
  ShieldCheck,
  Building2,
  Filter,
  Sparkles,
  ChevronRight,
  Layers,
  ArrowUpDown,
  FileText,
  UserCheck,
  Star,
  Calendar,
  RefreshCw,
  LayoutGrid,
  List,
  ExternalLink,
  Download,
  CheckCircle2,
  PieChart as PieChartIcon,
  Briefcase,
  SlidersHorizontal,
  X,
  Eye,
  Info
} from 'lucide-react';
import { safeResponseJson } from '../utils/apiClient';
import { Analyst, Report, STANDARD_12_SECTORS } from '../types';
import { AnalystBottomSheet } from './AnalystBottomSheet';

interface AnalystLookup01Props {
  analysts?: Analyst[];
  reports?: Report[];
  onSelectReportByStock?: (stockName: string) => void;
  onViewReportDetail?: (report: Report) => void;
}

interface FilterOptions {
  brokers: Array<{ name: string; count: number; analystCount: number }>;
  sectors: Array<{ name: string; count: number; analystCount: number }>;
  stocks: Array<{ name: string; code: string; count: number; analystCount: number }>;
  months: Array<{ month: string; label: string; count: number }>;
}

interface KpiSummary {
  totalAnalysts: number;
  totalReports: number;
  activeBrokersCount: number;
  coveredStocksCount: number;
  avgReportsPerAnalyst: number;
  avgHitRate: number;
  avgReturnRate: number;
  topBroker: string;
  topSector: string;
}

export const AnalystLookup01: React.FC<AnalystLookup01Props> = ({
  onSelectReportByStock,
  onViewReportDetail
}) => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBroker, setSelectedBroker] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedStock, setSelectedStock] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('reports');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Data States
  const [analystsList, setAnalystsList] = useState<any[]>([]);
  const [kpi, setKpi] = useState<KpiSummary | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAnalyst, setSelectedAnalyst] = useState<Analyst | null>(null);
  const [reportHistoryModalAnalyst, setReportHistoryModalAnalyst] = useState<any | null>(null);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string>('');

  // Fetch analysts from the 2026 1H master database API
  const fetchAnalystsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBroker !== 'ALL') params.append('broker', selectedBroker);
      if (selectedSector !== 'ALL') params.append('sector', selectedSector);
      if (selectedStock !== 'ALL') params.append('stock', selectedStock);
      if (selectedMonth !== 'ALL') params.append('month', selectedMonth);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await fetch(`/api/pipeline-01/analysts-overview?${params.toString()}`);
      const data = await safeResponseJson(res, { success: false });
      if (data && data.success) {
        setAnalystsList(data.analysts || []);
        setKpi(data.kpi || null);
        if (data.filterOptions) {
          setFilterOptions(data.filterOptions);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch analysts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBroker, selectedSector, selectedStock, selectedMonth, startDate, endDate, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    fetchAnalystsData();
  }, [fetchAnalystsData]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBroker('ALL');
    setSelectedSector('ALL');
    setSelectedStock('ALL');
    setSelectedMonth('ALL');
    setStartDate('');
    setEndDate('');
    setSortBy('reports');
    setSortOrder('desc');
  };

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedBroker !== 'ALL' ||
    selectedSector !== 'ALL' ||
    selectedStock !== 'ALL' ||
    selectedMonth !== 'ALL' ||
    startDate !== '' ||
    endDate !== '';

  const handleDownloadPdf = (pdfUrl: string, title: string) => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.replace(/[/\\?%*:|"<>]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccessMsg(`✅ [${title.slice(0, 20)}...] PDF 원문 다운로드가 시작되었습니다.`);
    setTimeout(() => setDownloadSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Top Banner / Hero Header with 2026 1H MVP Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                <span>애널리스트조회_01</span>
              </span>
              <span className="bg-emerald-950/80 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-700/60 font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                2026 상반기(1~6월) 전수 실측 아카이브 (4,868건 연동)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2 flex items-center space-x-2">
              <span>국내 증권사 애널리스트 전체 현황 & 다차원 트랙레코드</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              증권사별 · 12대 섹터별 · 종목별 · 기간별 4대 다차원 필터링을 통해 국내 증권사 소속 공인 연구원의 발간 활동성, 목표가 적중률, 투자의견 성향을 실시간으로 추적·비교합니다.
            </p>
          </div>

          {/* Quick Realtime KPI Stats */}
          {kpi && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/90 border border-slate-800 p-3 rounded-xl shrink-0">
              <div className="text-center px-2 py-1">
                <span className="text-[10px] text-slate-400 block font-semibold">총 애널리스트</span>
                <span className="text-base sm:text-lg font-black text-cyan-400">{kpi.totalAnalysts.toLocaleString()}명</span>
              </div>
              <div className="text-center px-2 py-1 border-l border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">발간 리포트</span>
                <span className="text-base sm:text-lg font-black text-white">{kpi.totalReports.toLocaleString()}건</span>
              </div>
              <div className="text-center px-2 py-1 border-l border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">평균 적중률</span>
                <span className="text-base sm:text-lg font-black text-emerald-400">{kpi.avgHitRate}%</span>
              </div>
              <div className="text-center px-2 py-1 border-l border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">평균 수익률</span>
                <span className="text-base sm:text-lg font-black text-amber-300">+{kpi.avgReturnRate}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Download Alert Banner */}
      {downloadSuccessMsg && (
        <div className="bg-emerald-950/90 border border-emerald-600/80 text-emerald-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccessMsg}</span>
          </div>
          <button onClick={() => setDownloadSuccessMsg('')} className="text-emerald-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* 2. 다차원 정밀 필터 컨트롤 바 (Multi-Dimensional Filter Bar) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        {/* 상단 컨트롤: 검색창 + 기간(월) + 정렬 + 보기모드 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* 검색창 */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="애널리스트명, 증권사, 종목명 검색..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* 증권사 드롭다운 */}
          <div className="md:col-span-3">
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedBroker}
                onChange={(e) => setSelectedBroker(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="ALL">🏢 전체 증권사 ({filterOptions?.brokers.length || 16}개사)</option>
                {filterOptions?.brokers.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} ({b.count}건 / {b.analystCount}명)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 종목 필터 드롭다운/검색 */}
          <div className="md:col-span-3">
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="ALL">🎯 전체 커버리지 종목 ({filterOptions?.stocks.length || 100}종목)</option>
                {filterOptions?.stocks.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.code}) - {s.count}건 ({s.analystCount}명)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 뷰 모드 전환 및 리셋 버튼 */}
          <div className="md:col-span-2 flex items-center justify-end space-x-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="카드 그리드 뷰"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="정밀 테이블 뷰"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center space-x-1 border border-slate-700 transition-all cursor-pointer"
                title="필터 전체 초기화"
              >
                <RefreshCw className="w-3 h-3" />
                <span>초기화</span>
              </button>
            )}
          </div>
        </div>

        {/* 2열: 기간(월별 칩스) & 날짜 범위 직접 선택 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          {/* 월별 칩스 (2026.01 ~ 2026.06) */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1 mr-1 shrink-0">
              <Calendar className="w-3 h-3 text-cyan-400" />
              <span>기간:</span>
            </span>

            <button
              type="button"
              onClick={() => {
                setSelectedMonth('ALL');
                setStartDate('');
                setEndDate('');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedMonth === 'ALL' && !startDate && !endDate
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              2026 상반기 전체 (1~6월)
            </button>

            {filterOptions?.months.map((m) => (
              <button
                key={m.month}
                type="button"
                onClick={() => {
                  setSelectedMonth(m.month);
                  setStartDate('');
                  setEndDate('');
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedMonth === m.month
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{m.month.replace('2026-', '')}월</span>
                <span className="text-[10px] opacity-75">({m.count}건)</span>
              </button>
            ))}
          </div>

          {/* 직접 날짜 범위 선택 */}
          <div className="flex items-center space-x-2 shrink-0 text-xs">
            <span className="text-slate-400 text-[11px]">직접 입력:</span>
            <input
              type="date"
              value={startDate}
              min="2026-01-01"
              max="2026-06-30"
              onChange={(e) => {
                setStartDate(e.target.value);
                setSelectedMonth('ALL');
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-slate-500">~</span>
            <input
              type="date"
              value={endDate}
              min="2026-01-01"
              max="2026-06-30"
              onChange={(e) => {
                setEndDate(e.target.value);
                setSelectedMonth('ALL');
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 3열: 12대 표준 섹터 칩스 */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1 mr-1 shrink-0">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>섹터:</span>
            </span>

            <button
              type="button"
              onClick={() => setSelectedSector('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSector === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              전체 12개 섹터
            </button>

            {STANDARD_12_SECTORS.map((sec) => {
              const secMeta = filterOptions?.sectors.find((s) => s.name.includes(sec) || sec.includes(s.name));
              const count = secMeta?.count || 0;
              const isSelected = selectedSector === sec || (selectedSector !== 'ALL' && selectedSector.includes(sec));

              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{sec}</span>
                  {count > 0 && <span className="text-[10px] opacity-75 font-mono">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4열: 정렬 옵션 & 조회 결과 카운트 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-semibold text-slate-300">조회 결과:</span>
            <span className="text-cyan-400 font-bold">{analystsList.length}명</span>
            <span>(리포트 {kpi?.totalReports.toLocaleString() || 0}건)</span>
            {hasActiveFilters && (
              <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded text-[10px] border border-blue-800">
                필터 적용 중
              </span>
            )}
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 text-[11px] mr-1">정렬 기준:</span>
            {[
              { key: 'reports', label: '발간건수순' },
              { key: 'latestDate', label: '최신발간순' },
              { key: 'hitRate', label: '적중률순' },
              { key: 'returnRate', label: '수익률순' },
              { key: 'coverages', label: '커버리지순' },
              { key: 'name', label: '이름순' },
              { key: 'broker', label: '증권사순' }
            ].map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  if (sortBy === s.key) {
                    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                  } else {
                    setSortBy(s.key);
                    setSortOrder('desc');
                  }
                }}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-0.5 cursor-pointer ${
                  sortBy === s.key
                    ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{s.label}</span>
                {sortBy === s.key && (
                  <ArrowUpDown className="w-3 h-3 ml-0.5 text-cyan-400 inline" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 애널리스트 목록 (카드 그리드 뷰 or 정밀 테이블 뷰) */}
      {isLoading ? (
        <div className="py-24 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">2026 상반기 애널리스트 데이터를 분석 및 집계 중입니다...</p>
        </div>
      ) : analystsList.length === 0 ? (
        <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 space-y-3">
          <Search className="w-10 h-10 mx-auto text-slate-600" />
          <p className="font-bold text-sm text-slate-200">조건에 부합하는 애널리스트가 없습니다.</p>
          <p className="text-xs text-slate-500">증권사, 섹터, 종목 또는 기간 필터를 변경해 보세요.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
          >
            필터 전체 초기화
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {analystsList.map((analyst, index) => {
            const buyPct = analyst.ratingDistribution?.buy || 80;
            const holdPct = analyst.ratingDistribution?.hold || 15;
            const sellPct = analyst.ratingDistribution?.sell || 5;

            return (
              <div
                key={analyst.id || index}
                onClick={() => setSelectedAnalyst(analyst)}
                className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5 relative overflow-hidden"
              >
                {/* Card Top Header */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={analyst.avatarUrl}
                          alt={analyst.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30 shadow-md bg-slate-800"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] font-black text-white px-1.5 py-0.2 rounded-full border border-slate-900 shadow">
                          #{analyst.overallRank || index + 1}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                            {analyst.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {analyst.jobTitle || '수석연구위원'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-0.5">
                          <span className="text-blue-400 font-semibold">{analyst.brokerName}</span>
                          <span>•</span>
                          <span className="text-slate-300 font-medium">{analyst.sector}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {analyst.badgeTitle || '2026 상반기'}
                    </span>
                  </div>

                  {/* 3대 핵심 성과 메트릭 */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 mb-3 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">발간 건수</span>
                      <strong className="text-sm font-black text-white">{analyst.totalReports}건</strong>
                    </div>
                    <div className="border-x border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">목표가 적중률</span>
                      <strong className="text-sm font-black text-cyan-400">{analyst.targetPriceHitRate}%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">평균 수익률</span>
                      <strong className="text-sm font-black text-emerald-400">+{analyst.returnRate}%</strong>
                    </div>
                  </div>

                  {/* 투자의견 분포 미니 바 */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold">투자의견 성향 분포</span>
                      <span className="text-[10px] font-mono">
                        <span className="text-blue-400">BUY {buyPct}%</span> / <span className="text-amber-400">HOLD {holdPct}%</span> / <span className="text-rose-400">SELL {sellPct}%</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex">
                      <div style={{ width: `${buyPct}%` }} className="bg-blue-500 h-full" title={`BUY: ${buyPct}%`} />
                      <div style={{ width: `${holdPct}%` }} className="bg-amber-500 h-full" title={`HOLD: ${holdPct}%`} />
                      <div style={{ width: `${sellPct}%` }} className="bg-rose-500 h-full" title={`SELL: ${sellPct}%`} />
                    </div>
                  </div>

                  {/* 커버리지 종목 리스트 */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">주요 커버리지 ({analyst.coverages?.length || 0}개)</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(analyst.coverages || []).slice(0, 3).map((c: any) => (
                        <button
                          key={c.stockCode || c.stockName}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStock(c.stockName);
                          }}
                          className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center space-x-1 transition-colors"
                        >
                          <span>{c.stockName}</span>
                          <span className="text-cyan-400 text-[10px]">({c.reportCount}건)</span>
                        </button>
                      ))}
                      {(analyst.coverages?.length || 0) > 3 && (
                        <span className="text-[10px] text-slate-500 font-medium self-center px-1">
                          +{(analyst.coverages?.length || 0) - 3}개
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 최신 발간 리포트 프리뷰 */}
                  {analyst.latestReport && (
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 text-xs space-y-1 mb-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-mono">{analyst.latestReport.publishDate}</span>
                        <span className="bg-blue-950 text-blue-300 font-bold px-1.5 py-0.2 rounded border border-blue-800 text-[10px]">
                          {analyst.latestReport.stockName} ({analyst.latestReport.investmentOpinion || 'BUY'})
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium truncate text-xs" title={analyst.latestReport.title}>
                        {analyst.latestReport.title}
                      </p>
                      {analyst.latestReport.targetPrice > 0 && (
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>목표가: <strong className="text-amber-300">{analyst.latestReport.targetPrice.toLocaleString()}원</strong></span>
                          {analyst.latestReport.pdfUrl && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadPdf(analyst.latestReport.pdfUrl, analyst.latestReport.title);
                              }}
                              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-0.5"
                            >
                              <Download className="w-3 h-3 mr-0.5" />
                              PDF 원문
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action Controls */}
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/70">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAnalyst(analyst);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1 shadow cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>트랙레코드 바텀시트</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReportHistoryModalAnalyst(analyst);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-2.5 rounded-xl border border-slate-700 transition-all flex items-center space-x-1 cursor-pointer"
                    title="해당 애널리스트의 모든 상반기 리포트 히스토리 보기"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>리포트 ({analyst.totalReports})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dense Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
                <tr>
                  <th className="py-3.5 px-4 text-center">순위</th>
                  <th className="py-3.5 px-4">애널리스트</th>
                  <th className="py-3.5 px-4">소속 증권사</th>
                  <th className="py-3.5 px-4">주력 섹터</th>
                  <th className="py-3.5 px-4 text-center">발간 건수</th>
                  <th className="py-3.5 px-4 text-center">목표가 적중률</th>
                  <th className="py-3.5 px-4 text-center">평균 수익률</th>
                  <th className="py-3.5 px-4">투자의견 (BUY/HOLD/SELL)</th>
                  <th className="py-3.5 px-4">주요 커버리지</th>
                  <th className="py-3.5 px-4 text-center">최신 발간일</th>
                  <th className="py-3.5 px-4 text-center">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {analystsList.map((analyst, index) => {
                  const buyPct = analyst.ratingDistribution?.buy || 80;
                  const holdPct = analyst.ratingDistribution?.hold || 15;
                  const sellPct = analyst.ratingDistribution?.sell || 5;

                  return (
                    <tr
                      key={analyst.id || index}
                      onClick={() => setSelectedAnalyst(analyst)}
                      className="hover:bg-slate-850 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 text-center">
                        <span className="bg-blue-900/60 text-blue-300 font-bold px-2 py-0.5 rounded-full text-[11px] border border-blue-700/60 font-mono">
                          #{analyst.overallRank || index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={analyst.avatarUrl}
                            alt={analyst.name}
                            className="w-8 h-8 rounded-full object-cover bg-slate-800 ring-1 ring-slate-700"
                          />
                          <div>
                            <div className="font-bold text-white text-xs">{analyst.name}</div>
                            <div className="text-[10px] text-slate-500">{analyst.jobTitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-blue-400">{analyst.brokerName}</td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md text-[11px] font-medium border border-slate-700">
                          {analyst.sector}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-white">{analyst.totalReports}건</td>
                      <td className="py-3 px-4 text-center font-bold text-cyan-400">{analyst.targetPriceHitRate}%</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-400">+{analyst.returnRate}%</td>
                      <td className="py-3 px-4">
                        <div className="w-28 space-y-1">
                          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex">
                            <div style={{ width: `${buyPct}%` }} className="bg-blue-500 h-full" />
                            <div style={{ width: `${holdPct}%` }} className="bg-amber-500 h-full" />
                            <div style={{ width: `${sellPct}%` }} className="bg-rose-500 h-full" />
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono flex justify-between">
                            <span>B:{buyPct}%</span>
                            <span>H:{holdPct}%</span>
                            <span>S:{sellPct}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(analyst.coverages || []).slice(0, 2).map((c: any) => (
                            <span
                              key={c.stockCode}
                              className="bg-slate-800 text-slate-200 text-[10px] px-1.5 py-0.2 rounded border border-slate-700"
                            >
                              {c.stockName}
                            </span>
                          ))}
                          {(analyst.coverages?.length || 0) > 2 && (
                            <span className="text-[10px] text-slate-500">
                              +{(analyst.coverages?.length || 0) - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-400">
                        {analyst.latestReport?.publishDate || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAnalyst(analyst);
                            }}
                            className="p-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                            title="바텀시트 열람"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReportHistoryModalAnalyst(analyst);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg transition-colors border border-slate-700 cursor-pointer"
                            title="리포트 히스토리 모달"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. 애널리스트 상반기 전수 발간 리포트 모달 (Report History Modal) */}
      {reportHistoryModalAnalyst && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={reportHistoryModalAnalyst.avatarUrl}
                  alt={reportHistoryModalAnalyst.name}
                  className="w-11 h-11 rounded-full object-cover bg-slate-800 ring-2 ring-blue-500/40"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{reportHistoryModalAnalyst.name}</h3>
                    <span className="text-xs text-slate-400">{reportHistoryModalAnalyst.jobTitle}</span>
                    <span className="bg-blue-950 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-800">
                      {reportHistoryModalAnalyst.brokerName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    2026 상반기 발간 리포트 히스토리 전수 ({reportHistoryModalAnalyst.recentReports?.length || 0}건)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReportHistoryModalAnalyst(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Reports List */}
            <div className="p-5 overflow-y-auto space-y-3 divide-y divide-slate-800/80">
              {reportHistoryModalAnalyst.recentReports && reportHistoryModalAnalyst.recentReports.length > 0 ? (
                reportHistoryModalAnalyst.recentReports.map((rep: any, idx: number) => (
                  <div key={rep.nid || idx} className="pt-3 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-slate-400 text-[11px]">{rep.publishDate}</span>
                        <span className="bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-800 text-[11px]">
                          {rep.stockName}
                        </span>
                        <span className="bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.2 rounded text-[10px]">
                          {rep.investmentOpinion || 'BUY'}
                        </span>
                      </div>

                      {rep.targetPrice > 0 && (
                        <span className="text-amber-300 font-bold text-xs">
                          목표가 {rep.targetPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>

                    <h5 className="font-semibold text-white text-xs sm:text-sm">{rep.title}</h5>

                    {rep.aiSummary && (
                      <p className="text-xs text-slate-400 line-clamp-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                        {rep.aiSummary}
                      </p>
                    )}

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      {rep.pdfUrl && (
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(rep.pdfUrl, rep.title)}
                          className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF 다운로드</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  등록된 상세 리포트가 없습니다.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">2026 상반기 실측 검증 데이터베이스</span>
              <button
                type="button"
                onClick={() => setReportHistoryModalAnalyst(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 5대 요소 완비 모바일/데스크톱 바텀시트 팝업 */}
      {selectedAnalyst && (
        <AnalystBottomSheet
          analyst={selectedAnalyst}
          onClose={() => setSelectedAnalyst(null)}
          onSelectReportByStock={onSelectReportByStock}
          onViewReportDetail={onViewReportDetail}
        />
      )}
    </div>
  );
};
