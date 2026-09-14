import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Calendar,
  Layers,
  Building2,
  Search,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Database,
  ArrowUpDown,
  Download,
  Info,
  CheckCircle2,
  FileText,
  DollarSign,
  UserCheck,
  ShieldCheck,
  Eye,
  X,
  Trophy,
  Target,
  Zap,
  Flame,
  Star,
  Cpu,
  BatteryCharging,
  Dna,
  Share2,
  Check,
  Printer,
  ChevronDown
} from 'lucide-react';
import { AnalystBottomSheet } from './AnalystBottomSheet';
import { STANDARD_12_SECTORS } from '../types';
import { safeResponseJson } from '../utils/apiClient';

interface AnnualAnalystAwards01Props {
  onSelectReportByStock?: (stockName: string) => void;
  onViewReportDetail?: (report: any) => void;
}

export const AnnualAnalystAwards01: React.FC<AnnualAnalystAwards01Props> = ({
  onSelectReportByStock,
  onViewReportDetail
}) => {
  // Main Category Tab
  const [activeCategoryTab, setActiveCategoryTab] = useState<'hall_of_fame' | 'sector_top5' | 'convergence' | 'special_theme' | 'all_ranking'>('hall_of_fame');

  // Evaluation Period Selection
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026_1H');
  const [untilMonth, setUntilMonth] = useState<string>('2026-06');
  const [aggregationMode, setAggregationMode] = useState<'cumulative' | 'single'>('cumulative');

  // Sector Sub-tab for Sector Hall of Fame
  const [activeSector, setActiveSector] = useState<string>('반도체/디스플레이');

  // Filters & Sorting for All Ranking View
  const [selectedBroker, setSelectedBroker] = useState<string>('ALL');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('toBeRank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Evaluation Data
  const [hofData, setHofData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReEvaluating, setIsReEvaluating] = useState<boolean>(false);
  const [reEvalProgress, setReEvalProgress] = useState<number>(0);

  // Selected Detail Modal States
  const [selectedAnalystForSheet, setSelectedAnalystForSheet] = useState<any | null>(null);
  const [certificateWinner, setCertificateWinner] = useState<any | null>(null);
  const [lineageModalAnalyst, setLineageModalAnalyst] = useState<any | null>(null);
  const [showLogicInfoModal, setShowLogicInfoModal] = useState<boolean>(false);
  const [showDbCacheModal, setShowDbCacheModal] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string>('');

  const PERIOD_OPTIONS = [
    { key: '2026_1H', label: '2026년 상반기 (1H)', badge: '1월~6월 통합', desc: '1H 정기 평가' },
    { key: '2026_2H', label: '2026년 하반기 (2H)', badge: '7월~12월', desc: '2H 정기 평가' },
    { key: '2026_1Q', label: '2026년 1분기 (1Q)', badge: '1월~3월', desc: '1분기 집계' },
    { key: '2026_2Q', label: '2026년 2분기 (2Q)', badge: '4월~6월', desc: '2분기 집계' },
    { key: '2026_3Q', label: '2026년 3분기 (3Q)', badge: '7월~9월', desc: '3분기 집계' },
    { key: '2026_4Q', label: '2026년 4분기 (4Q)', badge: '10월~12월', desc: '4분기 집계' },
    { key: '2026_ANNUAL', label: '2026년 연간 종합 (Annual)', badge: '연간 전수', desc: '연간 총괄 대상' }
  ];

  const MONTHS_LIST = [
    { key: '2026-01', num: 1, label: '1월' },
    { key: '2026-02', num: 2, label: '2월' },
    { key: '2026-03', num: 3, label: '3월' },
    { key: '2026-04', num: 4, label: '4월' },
    { key: '2026-05', num: 5, label: '5월' },
    { key: '2026-06', num: 6, label: '6월' }
  ];

  // Fetch Hall of Fame Evaluation Data
  const fetchHallOfFame = useCallback(async (force: boolean = false) => {
    if (force) {
      setIsReEvaluating(true);
      setReEvalProgress(15);
      const timer = setInterval(() => {
        setReEvalProgress(prev => (prev < 85 ? prev + 25 : prev));
      }, 200);

      try {
        const res = await fetch('/api/pipeline-01/hall-of-fame-eval/re-evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ period: selectedPeriod })
        });
        const data = await safeResponseJson(res, { success: false });
        clearInterval(timer);
        setReEvalProgress(100);
        setTimeout(() => {
          setIsReEvaluating(false);
          setReEvalProgress(0);
          if (data && data.success) {
            setHofData(data);
          }
        }, 400);
      } catch (e) {
        clearInterval(timer);
        setIsReEvaluating(false);
        console.error('Re-evaluation error:', e);
      }
    } else {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/pipeline-01/hall-of-fame-eval?period=${selectedPeriod}&force=false`);
        const data = await safeResponseJson(res, { success: false });
        if (data && data.success && data.top20 && data.top20.length > 0) {
          setHofData(data);
        } else {
          // If initial cached fetch is empty or failed, auto-trigger evaluation
          const retryRes = await fetch('/api/pipeline-01/hall-of-fame-eval/re-evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ period: selectedPeriod })
          });
          const retryData = await safeResponseJson(retryRes, { success: false });
          if (retryData && retryData.success) {
            setHofData(retryData);
          }
        }
      } catch (err) {
        console.warn('Failed to load hall of fame data, trying evaluation endpoint:', err);
        try {
          const retryRes = await fetch('/api/pipeline-01/hall-of-fame-eval/re-evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ period: selectedPeriod })
          });
          const retryData = await safeResponseJson(retryRes, { success: false });
          if (retryData && retryData.success) {
            setHofData(retryData);
          }
        } catch (retryErr) {
          console.error('Secondary eval also failed:', retryErr);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchHallOfFame(false);
  }, [fetchHallOfFame]);

  // Filtered analysts for all ranking table
  const filteredAllAnalysts = useMemo(() => {
    if (!hofData || !hofData.allAnalysts) return [];
    let list = [...hofData.allAnalysts];

    if (selectedBroker !== 'ALL') {
      list = list.filter(a => a.brokerName === selectedBroker);
    }
    if (selectedSectorFilter !== 'ALL') {
      list = list.filter(a => (a.sector || '').includes(selectedSectorFilter));
    }
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.brokerName.toLowerCase().includes(q) ||
        (a.sector || '').toLowerCase().includes(q) ||
        (a.stocksList || []).some((s: string) => s.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      let diff = 0;
      if (sortBy === 'toBeRank') diff = a.rank - b.rank;
      else if (sortBy === 'sales') diff = b.salesPipelineAmount - a.salesPipelineAmount;
      else if (sortBy === 'depth') diff = b.avgDepthScore - a.avgDepthScore;
      else if (sortBy === 'hitRate') diff = b.hitRate - a.hitRate;
      else if (sortBy === 'returnRate') diff = b.returnRate - a.returnRate;
      else if (sortBy === 'hits') diff = b.totalHits - a.totalHits;
      else if (sortBy === 'reports') diff = b.reportCount - a.reportCount;
      else if (sortBy === 'name') diff = a.name.localeCompare(b.name, 'ko');
      else diff = a.rank - b.rank;
      return sortOrder === 'desc' ? -diff : diff;
    });

    return list;
  }, [hofData, selectedBroker, selectedSectorFilter, searchTerm, sortBy, sortOrder]);

  const uniqueBrokers = useMemo(() => {
    if (!hofData || !hofData.allAnalysts) return [];
    const s = new Set<string>();
    hofData.allAnalysts.forEach((a: any) => { if (a.brokerName) s.add(a.brokerName); });
    return Array.from(s).sort();
  }, [hofData]);

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredAllAnalysts || filteredAllAnalysts.length === 0) return;
    const headers = ['순위', '성명', '증권사', '담당섹터', '종합점수', '목표가적중률(%)', '실현수익률(%)', '영업기여액(억원)', '평균심도', '리포트수', '총조회수', '대표종목'];
    const rows = filteredAllAnalysts.map(a => [
      a.rank,
      a.name,
      a.brokerName,
      `"${a.sector}"`,
      a.totalScore,
      `${a.hitRate}%`,
      `+${a.returnRate}%`,
      `${a.salesPipelineAmountEok}억`,
      a.avgDepthScore,
      a.reportCount,
      a.totalHits,
      `"${(a.stocksList || []).slice(0, 3).join(', ')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `올해의애널리스트01_평가결과_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccessMsg('CSV 파일이 성공적으로 다운로드되었습니다.');
    setTimeout(() => setDownloadSuccessMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Toast Notification */}
      {downloadSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">{downloadSuccessMsg}</span>
        </div>
      )}

      {/* Top Banner & Title */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>AI AWARDS ENGINE 2026</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-500/40">
                  신규 TO-BE 평가 로직
                </span>
                {hofData?.isCached ? (
                  <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-600/40">
                    <Database className="w-3 h-3" />
                    <span>DB 캐시 로드됨</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-xs text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-600/40">
                    <Zap className="w-3 h-3 text-indigo-400" />
                    <span>AI 실시간 평가 생성</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                <span>올해의 애널리스트_01</span>
                <span className="text-amber-400 font-extrabold text-lg sm:text-xl">
                  &bull; {hofData?.periodTitle || '2026년 상반기 (1H)'} 명예의 전당
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1.5 max-w-3xl">
                평가 기간(상반기/하반기/분기/연간)을 지정하고 AI 앙상블 재평가를 통해{' '}
                <strong className="text-amber-300 font-semibold">명예의 전당 TOP 20, 섹터별 TOP 5, AI·반도체 융합상, 적중률/고수익/다작/신인/소신파 대상</strong>을 정밀 선발합니다.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowLogicInfoModal(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                <Info className="w-4 h-4 text-amber-400" />
                <span>TO-BE 가중치 가이드</span>
              </button>

              <button
                onClick={() => setShowDbCacheModal(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                <Database className="w-4 h-4 text-indigo-400" />
                <span>DB 파일 저장상태</span>
              </button>

              <button
                onClick={() => fetchHallOfFame(true)}
                disabled={isReEvaluating}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isReEvaluating ? 'animate-spin' : ''}`} />
                <span>{isReEvaluating ? 'AI 재평가 연산 중...' : '🤖 AI 재평가 실행 (Force Re-eval)'}</span>
              </button>
            </div>
          </div>

          {/* AI Re-eval Progress Bar */}
          {isReEvaluating && (
            <div className="mt-4 p-3 bg-amber-950/40 rounded-xl border border-amber-500/30">
              <div className="flex justify-between text-xs text-amber-300 font-semibold mb-1">
                <span>마스터 DB 4대 테이블 수집 & AI 심사평 앙상블 생성 중...</span>
                <span>{reEvalProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${reEvalProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel: Evaluation Period Selector */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Period Selector Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 flex items-center space-x-1 mr-2 whitespace-nowrap">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>시상 평가 기간:</span>
              </span>
              {PERIOD_OPTIONS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPeriod(p.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    selectedPeriod === p.key
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 ring-1 ring-amber-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                  }`}
                >
                  <span>{p.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    selectedPeriod === p.key ? 'bg-amber-900/40 text-amber-950' : 'bg-slate-900 text-amber-400/90'
                  }`}>
                    {p.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Export & Stats */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>평가결과 CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* KPI Summary Cards */}
        {hofData?.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">평가 대상 리포트</span>
                <FileText className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-xl font-extrabold text-white">{hofData.stats.totalReports.toLocaleString()}</span>
                <span className="text-xs text-slate-400">건</span>
              </div>
              <p className="text-[11px] text-indigo-400 mt-1">심층 분석_01 DB 전수</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">평가 애널리스트</span>
                <UserCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-xl font-extrabold text-white">{hofData.stats.totalAnalysts.toLocaleString()}</span>
                <span className="text-xs text-slate-400">명</span>
              </div>
              <p className="text-[11px] text-amber-400 mt-1">32개 증권사 풀</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">총 영업기여액</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-xl font-extrabold text-emerald-400">{hofData.stats.totalSalesEok.toLocaleString()}</span>
                <span className="text-xs text-emerald-400">억원</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">파이프라인_01 가중 40%</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">평균 목표가 적중률</span>
                <Target className="w-4 h-4 text-rose-400" />
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-xl font-extrabold text-rose-400">{hofData.stats.avgHitRate}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">오차 범위 ±3% 이내</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">평균 실현 알파수익</span>
                <TrendingUp className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-xl font-extrabold text-yellow-400">+{hofData.stats.avgReturnRate}%</span>
              </div>
              <p className="text-[11px] text-yellow-400/90 mt-1">KOSPI 벤치마크 초과</p>
            </div>
          </div>
        )}

        {/* Category Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 mb-6 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategoryTab('hall_of_fame')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeCategoryTab === 'hall_of_fame'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>🏆 올해의 명예의 전당 TOP 20</span>
          </button>

          <button
            onClick={() => setActiveCategoryTab('sector_top5')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeCategoryTab === 'sector_top5'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>🎯 주요 섹터별 TOP 5</span>
          </button>

          <button
            onClick={() => setActiveCategoryTab('convergence')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeCategoryTab === 'convergence'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>🚀 융합(Convergence) 특별상</span>
            <span className="text-[10px] bg-purple-950 text-pink-300 px-1.5 py-0.5 rounded font-black border border-purple-500/40">
              AI&반도체 등
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryTab('special_theme')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeCategoryTab === 'special_theme'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-300" />
            <span>🏅 스페셜 테마 5대 어워즈</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-black border border-emerald-500/40">
              적중률/소신파 등
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryTab('all_ranking')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeCategoryTab === 'all_ranking'
                ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-slate-400" />
            <span>📊 전수 순위 & 4대 테이블 비교</span>
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-400">
              {selectedPeriod} 평가 데이터 및 AI 심사평 로딩 중...
            </p>
          </div>
        )}

        {/* EMPTY / RETRY STATE */}
        {!isLoading && !hofData && (
          <div className="py-16 text-center space-y-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 my-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">평가 데이터 준비 중입니다</h4>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              서버리스 환경에서 데이터베이스 초기화가 진행 중이거나 평가 캐시 생성이 필요합니다. 아래 버튼을 클릭하여 AI 평가 및 랭킹을 즉시 생성하십시오.
            </p>
            <button
              onClick={() => fetchHallOfFame(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>AI 평가 및 랭킹 즉시 생성</span>
            </button>
          </div>
        )}

        {/* TAB 1: HALL OF FAME TOP 20 */}
        {!isLoading && activeCategoryTab === 'hall_of_fame' && (
          <div className="space-y-6">
            {/* Grand Top 3 Podium Cards */}
            {(hofData?.top20 || hofData?.top10) && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2nd Place (Silver) */}
                {hofData.top10[1] && (
                  <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-slate-400/40 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between order-2 lg:order-1">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-slate-400/10 rounded-full blur-2xl" />
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-300 text-slate-900 shadow">
                          <span>🥈 2위 최우수상 (Best)</span>
                        </span>
                        <span className="text-2xl font-black text-slate-300">
                          {hofData.top10[1].totalScore}점
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={hofData.top10[1].avatarUrl}
                          alt={hofData.top10[1].name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-400 shadow-md"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {hofData.top10[1].name}
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                              {hofData.top10[1].brokerName}
                            </span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">{hofData.top10[1].sector} 전문</p>
                          <p className="text-xs text-amber-400 font-semibold mt-1">
                            대표 커버리지: {hofData.top10[1].keyStock}
                          </p>
                        </div>
                      </div>

                      {/* AI Review Quote */}
                      <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 mb-4 text-xs text-slate-300 leading-relaxed">
                        <p className="line-clamp-3">{hofData.top10[1].aiJurorComment}</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-800/40 rounded-2xl border border-slate-800">
                        <div>
                          <div className="text-[10px] text-slate-400 font-medium">적중률</div>
                          <div className="text-sm font-bold text-rose-400">{hofData.top10[1].hitRate}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-medium">실현 알파</div>
                          <div className="text-sm font-bold text-yellow-400">+{hofData.top10[1].returnRate}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-medium">영업기여</div>
                          <div className="text-sm font-bold text-emerald-400">{hofData.top10[1].salesPipelineAmountEok}억</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAnalystForSheet(hofData.top10[1])}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                      >
                        프로필 & 트랙레코드
                      </button>
                      <button
                        onClick={() => setCertificateWinner(hofData.top10[1])}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white flex items-center space-x-1"
                        title="상장 보기"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>상장</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 1st Place (Grand Prize - Gold) */}
                {hofData.top10[0] && (
                  <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-400 rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-amber-500/20 flex flex-col justify-between order-1 lg:order-2 ring-1 ring-amber-400/50">
                    <div className="absolute -right-8 -top-8 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl" />
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md">
                          <Trophy className="w-3.5 h-3.5 fill-current" />
                          <span>🏆 1위 종합 대상 (Grand Prize)</span>
                        </span>
                        <span className="text-3xl font-black text-amber-400">
                          {hofData.top10[0].totalScore}점
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={hofData.top10[0].avatarUrl}
                          alt={hofData.top10[0].name}
                          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-amber-400 shadow-xl"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-2xl font-black text-white">{hofData.top10[0].name}</h3>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                              {hofData.top10[0].brokerName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium mt-1">{hofData.top10[0].sector} 부문 수석</p>
                          <p className="text-xs text-amber-300 font-bold mt-1">
                            핵심 성과주: {hofData.top10[0].keyStock}
                          </p>
                        </div>
                      </div>

                      {/* AI Review Quote */}
                      <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/40 mb-4 text-xs text-amber-100 leading-relaxed shadow-inner">
                        <p className="font-semibold text-amber-300 mb-1 flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI 심사위원회 총평</span>
                        </p>
                        <p className="line-clamp-3">{hofData.top10[0].aiJurorComment}</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 text-center p-3 bg-amber-950/30 rounded-2xl border border-amber-500/30">
                        <div>
                          <div className="text-[10px] text-amber-300/80 font-medium">적중률</div>
                          <div className="text-base font-black text-rose-400">{hofData.top10[0].hitRate}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-amber-300/80 font-medium">실현 알파</div>
                          <div className="text-base font-black text-yellow-300">+{hofData.top10[0].returnRate}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-amber-300/80 font-medium">영업기여</div>
                          <div className="text-base font-black text-emerald-400">{hofData.top10[0].salesPipelineAmountEok}억</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAnalystForSheet(hofData.top10[0])}
                        className="flex-1 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30 transition"
                      >
                        대상 프로필 & 트랙레코드
                      </button>
                      <button
                        onClick={() => setCertificateWinner(hofData.top10[0])}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 flex items-center space-x-1 shadow"
                        title="상장 보기"
                      >
                        <Award className="w-4 h-4" />
                        <span>상장 수여증</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3rd Place (Bronze) */}
                {hofData.top10[2] && (
                  <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-amber-800/40 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between order-3">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-800/10 rounded-full blur-2xl" />
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-800/80 text-amber-100 shadow border border-amber-600/40">
                          <span>🥉 3위 우수상 (Excellence)</span>
                        </span>
                        <span className="text-2xl font-black text-amber-400/90">
                          {hofData.top10[2].totalScore}점
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={hofData.top10[2].avatarUrl}
                          alt={hofData.top10[2].name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-700 shadow-md"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {hofData.top10[2].name}
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                              {hofData.top10[2].brokerName}
                            </span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">{hofData.top10[2].sector} 전문</p>
                          <p className="text-xs text-amber-400 font-semibold mt-1">
                            대표 커버리지: {hofData.top10[2].keyStock}
                          </p>
                        </div>
                      </div>

                      {/* AI Review Quote */}
                      <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 mb-4 text-xs text-slate-300 leading-relaxed">
                        <p className="line-clamp-3">{hofData.top10[2].aiJurorComment}</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-800/40 rounded-2xl border border-slate-800">
                        <div>
                          <div className="text-[10px] text-slate-400 font-medium">적중률</div>
                          <div className="text-sm font-bold text-rose-400">{hofData.top10[2].hitRate}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-medium">실현 알파</div>
                          <div className="text-sm font-bold text-yellow-400">+{hofData.top10[2].returnRate}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-medium">영업기여</div>
                          <div className="text-sm font-bold text-emerald-400">{hofData.top10[2].salesPipelineAmountEok}억</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAnalystForSheet(hofData.top10[2])}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                      >
                        프로필 & 트랙레코드
                      </button>
                      <button
                        onClick={() => setCertificateWinner(hofData.top10[2])}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white flex items-center space-x-1"
                        title="상장 보기"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>상장</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TOP 4 ~ TOP 20 Roster */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span>명예의 전당 헌액자 리스트 (TOP 4 ~ TOP 20)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(hofData?.top20 || hofData?.top10 || []).slice(3, 20).map((a: any) => (
                  <div
                    key={a.id}
                    className="p-4 bg-slate-950/60 hover:bg-slate-800/50 border border-slate-800/80 rounded-2xl transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Top #{a.rank}
                        </span>
                        <span className="text-sm font-bold text-white">{a.totalScore}점</span>
                      </div>

                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={a.avatarUrl}
                          alt={a.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                            {a.name}
                            <span className="text-xs px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              {a.brokerName}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400">{a.sector}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {a.aiJurorComment}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800/60">
                        <span>적중률 <strong className="text-rose-400 font-semibold">{a.hitRate}%</strong></span>
                        <span>알파 <strong className="text-yellow-400 font-semibold">+{a.returnRate}%</strong></span>
                        <span>기여 <strong className="text-emerald-400 font-semibold">{a.salesPipelineAmountEok}억</strong></span>
                      </div>
                    </div>

                    <div className="mt-3.5 flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAnalystForSheet(a)}
                        className="flex-1 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      >
                        상세보기
                      </button>
                      <button
                        onClick={() => setCertificateWinner(a)}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition"
                        title="상장 보기"
                      >
                        <Award className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECTOR HALL OF FAME TOP 5 */}
        {!isLoading && activeCategoryTab === 'sector_top5' && (
          <div className="space-y-6">
            {/* Sector Selector Chips */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {Object.keys(hofData?.sectorAwards || {}).map(sec => (
                <button
                  key={sec}
                  onClick={() => setActiveSector(sec)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    activeSector === sec
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{sec}</span>
                </button>
              ))}
            </div>

            {/* Active Sector Top 5 Card Grid */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
                    <span className="text-blue-400">{activeSector}</span>
                    <span>업종 명예의 전당 TOP 5</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    해당 섹터 커버리지 종목 분석 심도, 밸류체인 진단, 업종 초과 수익률(Alpha) 앙상블 기준
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-600/40 shrink-0">
                  {selectedPeriod} 평가
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {(hofData?.sectorAwards?.[activeSector] || []).map((a: any, idx: number) => {
                  const is1st = idx === 0;
                  return (
                    <div
                      key={a.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        is1st
                          ? 'bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border-blue-500/60 ring-1 ring-blue-400/40 shadow-xl'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                            is1st ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {idx === 0 ? '🥇 1위 (섹터 베스트)' : `#${idx + 1}위`}
                          </span>
                          <span className="text-sm font-black text-white">{a.totalScore}점</span>
                        </div>

                        <div className="flex flex-col items-center text-center my-3">
                          <img
                            src={a.avatarUrl}
                            alt={a.name}
                            className={`w-16 h-16 rounded-2xl object-cover mb-2 ${
                              is1st ? 'ring-2 ring-blue-400 shadow-md' : 'ring-1 ring-slate-700'
                            }`}
                          />
                          <h4 className="text-base font-bold text-white">{a.name}</h4>
                          <span className="text-xs text-blue-400 font-semibold">{a.brokerName}</span>
                        </div>

                        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 mb-3 text-[11px] text-slate-300 leading-relaxed">
                          <p className="line-clamp-3">{a.aiSectorComment}</p>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40">
                          <div className="flex justify-between">
                            <span>적중률</span>
                            <span className="font-bold text-rose-400">{a.hitRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>실현 알파</span>
                            <span className="font-bold text-yellow-400">+{a.returnRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>영업기여</span>
                            <span className="font-bold text-emerald-400">{a.salesPipelineAmountEok}억</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedAnalystForSheet(a)}
                          className="flex-1 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                        >
                          프로필
                        </button>
                        <button
                          onClick={() => setCertificateWinner({ ...a, awardTitle: `${activeSector} 섹터 TOP #${idx + 1}` })}
                          className="p-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition"
                          title="상장 보기"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONVERGENCE (융합) SPECIAL AWARDS */}
        {!isLoading && activeCategoryTab === 'convergence' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/40 border border-purple-800/40 rounded-3xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-pink-400 fill-current" />
                <h3 className="text-xl font-extrabold text-white">특정 섹터 & 산업 융합(Convergence) 특별상</h3>
              </div>
              <p className="text-sm text-slate-300">
                단일 섹터를 넘어 <strong className="text-pink-300 font-semibold">AI+반도체, 모빌리티+2차전지, 디지털헬스+바이오, AI데이터센터+전력망</strong> 등 이종 산업 간의 융합 생태계를 입체적으로 조망한 혁신 연구원을 시상합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(hofData?.convergenceAwards || []).map((conv: any) => (
                <div
                  key={conv.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-purple-500/50 transition"
                >
                  <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl" />
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md">
                        {conv.title}
                      </span>
                      <span className="text-xs text-purple-300 font-bold bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/40">
                        {selectedPeriod}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-medium mb-4">{conv.subtitle}</p>

                    <div className="flex items-center space-x-4 p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 mb-4">
                      <img
                        src={conv.winner.avatarUrl}
                        alt={conv.winner.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-400 shadow-md"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-black text-white">{conv.winner.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-semibold">
                            {conv.winner.brokerName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{conv.winner.sector}</p>
                        <p className="text-xs text-pink-400 font-bold mt-1">
                          융합 테마: {conv.keyTheme}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-purple-950/30 rounded-2xl border border-purple-500/30 mb-4 text-xs text-purple-100 leading-relaxed">
                      <p className="font-semibold text-purple-300 mb-1 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI 심사위원회 헌정사</span>
                      </p>
                      <p>{conv.aiComment}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950 px-3 py-2.5 rounded-xl border border-slate-800">
                      <span>핵심 수혜주: <strong className="text-white">{conv.keyStock}</strong></span>
                      <span>적중률: <strong className="text-rose-400">{conv.winner.hitRate}%</strong></span>
                      <span>알파: <strong className="text-yellow-400">+{conv.winner.returnRate}%</strong></span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedAnalystForSheet(conv.winner)}
                      className="flex-1 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
                    >
                      수상자 프로필 & 리포트
                    </button>
                    <button
                      onClick={() => setCertificateWinner({ ...conv.winner, awardTitle: conv.title })}
                      className="px-3.5 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center space-x-1 transition"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>특별상 상장</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SPECIAL THEMATIC AWARDS (5 Categories) */}
        {!isLoading && activeCategoryTab === 'special_theme' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-800/40 rounded-3xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-emerald-400 fill-current" />
                <h3 className="text-xl font-extrabold text-white">스페셜 테마 5대 어워즈 (AI 특화 시상)</h3>
              </div>
              <p className="text-sm text-slate-300">
                수익률과 적중률뿐만 아니라, <strong className="text-emerald-300 font-semibold">소신파/역발상 대상, 양질의 다작왕, 미래를 이끌 슈퍼 루키</strong> 등 시장 다양성과 건전성을 증진한 애널리스트를 특별 선발합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {(hofData?.specialAwards || []).map((sp: any, idx: number) => {
                const isContrarian = sp.id === 'special_contrarian';
                const isRookie = sp.id === 'special_rookie';
                return (
                  <div
                    key={sp.id}
                    className={`bg-slate-900/90 border rounded-3xl p-6 shadow-xl flex flex-col justify-between ${
                      isContrarian
                        ? 'lg:col-span-2 border-amber-500/50 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900'
                        : isRookie
                        ? 'border-teal-500/50'
                        : 'border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow">
                          {sp.badge}
                        </span>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">{sp.highlightLabel}</span>
                          <span className="text-lg font-black text-amber-400">{sp.highlightValue}</span>
                        </div>
                      </div>

                      <h4 className="text-base font-black text-white mb-3">{sp.title}</h4>

                      <div className="flex items-center space-x-4 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 mb-4">
                        <img
                          src={sp.winner.avatarUrl}
                          alt={sp.winner.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-md"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="text-lg font-black text-white">{sp.winner.name}</h5>
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                              {sp.winner.brokerName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{sp.winner.sector} 연구원</p>
                          <p className="text-xs text-emerald-400 font-semibold mt-1">
                            영업기여액: {sp.winner.salesPipelineAmountEok}억원
                          </p>
                        </div>
                      </div>

                      {/* Contrarian specific calls view */}
                      {isContrarian && sp.winner.contrarianCalls && sp.winner.contrarianCalls.length > 0 && (
                        <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 mb-3 text-xs text-amber-200">
                          <span className="font-bold block mb-1">🛡️ 대표 소신의견 사례:</span>
                          <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-300">
                            {sp.winner.contrarianCalls.slice(0, 2).map((c: string, cIdx: number) => (
                              <li key={cIdx} className="line-clamp-1">{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-4 text-xs text-slate-300 leading-relaxed">
                        <p>{sp.aiComment}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAnalystForSheet(sp.winner)}
                        className="flex-1 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
                      >
                        연구원 프로필
                      </button>
                      <button
                        onClick={() => setCertificateWinner({ ...sp.winner, awardTitle: sp.title })}
                        className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center space-x-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>특별상장</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: ALL RANKING & DATA LINEAGE TABLE */}
        {!isLoading && activeCategoryTab === 'all_ranking' && (
          <div className="space-y-6">
            {/* Filter Controls */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="연구원명, 증권사, 종목 검색..."
                    className="w-full bg-slate-950 text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Broker Filter */}
                <div>
                  <select
                    value={selectedBroker}
                    onChange={(e) => setSelectedBroker(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="ALL">전체 증권사 ({uniqueBrokers.length}개사)</option>
                    {uniqueBrokers.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Sector Filter */}
                <div>
                  <select
                    value={selectedSectorFilter}
                    onChange={(e) => setSelectedSectorFilter(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="ALL">전체 섹터</option>
                    {STANDARD_12_SECTORS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="toBeRank">TO-BE 종합 순위순</option>
                    <option value="sales">영업 기여액순 (40%)</option>
                    <option value="depth">분석 심도 점수순 (30%)</option>
                    <option value="hitRate">목표가 적중률순</option>
                    <option value="returnRate">실현 수익률(Alpha)순</option>
                    <option value="hits">리포트 조회수순 (20%)</option>
                    <option value="reports">리포트 발간 건수순</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">순위</th>
                      <th className="py-3.5 px-4">애널리스트</th>
                      <th className="py-3.5 px-4">섹터 / 커버리지</th>
                      <th className="py-3.5 px-4 text-center">TO-BE 종합점수</th>
                      <th className="py-3.5 px-4 text-right">적중률</th>
                      <th className="py-3.5 px-4 text-right">실현 알파</th>
                      <th className="py-3.5 px-4 text-right">영업기여액 (40%)</th>
                      <th className="py-3.5 px-4 text-right">분석심도 (30%)</th>
                      <th className="py-3.5 px-4 text-right">조회수 (20%)</th>
                      <th className="py-3.5 px-4 text-center">데이터 리니지</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredAllAnalysts.map((a: any) => (
                      <tr key={a.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                            a.rank === 1 ? 'bg-amber-400 text-slate-950' :
                            a.rank === 2 ? 'bg-slate-300 text-slate-950' :
                            a.rank === 3 ? 'bg-amber-700 text-white' :
                            a.rank <= 10 ? 'bg-amber-950 text-amber-300 border border-amber-600/40' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {a.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={a.avatarUrl}
                              alt={a.name}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                            />
                            <div>
                              <button
                                onClick={() => setSelectedAnalystForSheet(a)}
                                className="font-bold text-white hover:text-amber-400 transition"
                              >
                                {a.name}
                              </button>
                              <p className="text-[11px] text-slate-400">{a.brokerName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-200">{a.sector}</p>
                          <p className="text-[11px] text-amber-400/90 truncate max-w-[150px]">
                            {(a.stocksList || []).slice(0, 3).join(', ')}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="text-sm font-black text-amber-400">{a.totalScore}점</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-bold text-rose-400">{a.hitRate}%</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-bold text-yellow-400">+{a.returnRate}%</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-bold text-emerald-400">{a.salesPipelineAmountEok}억원</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-bold text-indigo-300">{a.avgDepthScore}점</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-slate-300">{(a.totalHits || 0).toLocaleString()}회</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setLineageModalAnalyst(a)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition"
                            title="4대 테이블 산출 근거 보기"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: AWARD CERTIFICATE / TROPHY MODAL */}
      {certificateWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-950 border-2 border-amber-400/80 rounded-3xl max-w-xl w-full p-8 text-center shadow-2xl relative">
            <button
              onClick={() => setCertificateWinner(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full flex items-center justify-center text-slate-950 shadow-xl ring-4 ring-amber-400/40">
              <Trophy className="w-10 h-10 fill-current" />
            </div>

            <span className="text-xs font-black text-amber-400 tracking-widest uppercase mb-1 block">
              2026 AI FINANCIAL ANALYST AWARDS
            </span>
            <h2 className="text-2xl font-black text-white mb-2">
              {certificateWinner.awardTitle || '올해의 애널리스트 명예의 전당'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">{selectedPeriod} 정기 평가</p>

            <div className="p-6 bg-slate-950/80 border border-amber-500/30 rounded-2xl text-left mb-6 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">수상자:</span>
                <span className="text-base font-black text-amber-300">
                  {certificateWinner.brokerName} &bull; {certificateWinner.name} 연구원
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">전문 분야:</span>
                <span className="text-xs font-semibold text-white">{certificateWinner.sector}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">종합 평가 점수:</span>
                <span className="text-sm font-black text-amber-400">{certificateWinner.totalScore}점</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1">AI 심사위원회 공적 요약:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl">
                  {certificateWinner.aiJurorComment || certificateWinner.aiComment || `${certificateWinner.name} 연구원은 탁월한 통찰력과 데이터 기반 분석으로 2026년 금융 시장과 투자자 신뢰 형성에 크게 기여하여 본 상을 수여합니다.`}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center space-x-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>인쇄 / PDF 저장</span>
              </button>
              <button
                onClick={() => setCertificateWinner(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 4-TABLE DATA LINEAGE INSPECTOR */}
      {lineageModalAnalyst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <span>4대 테이블 데이터 리니지 ({lineageModalAnalyst.name})</span>
              </h3>
              <button
                onClick={() => setLineageModalAnalyst(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold text-indigo-400 mb-1">
                  <span>1. 파이프라인_01 (영업 기여액 가중 40%)</span>
                  <span>{lineageModalAnalyst.salesPipelineAmountEok}억원</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  리포트 발간 후 법인영업/IB 및 리테일 자금 유입 실적 매핑
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold text-amber-400 mb-1">
                  <span>2. 애널리스트리포트_분석_01 (분석 심도 가중 30%)</span>
                  <span>{lineageModalAnalyst.avgDepthScore}점</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  AI 텍스트 심층성, 재무제표 밸류에이션 모델 정밀도 및 객관성 점수
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold text-blue-400 mb-1">
                  <span>3. 애널리스트리포트_조회_01 (조회수 20% & 다운로드 10%)</span>
                  <span>조회 {(lineageModalAnalyst.totalHits || 0).toLocaleString()}회 / 다운 {(lineageModalAnalyst.totalDownloads || 0).toLocaleString()}건</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  네이버 금융 및 증권사 포털 실시간 리포트 조회/PDF 다운로드 실적
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold text-emerald-400 mb-1">
                  <span>4. 애널리스트조회_01 (연구원 프로필 & 트랙레코드)</span>
                  <span>커버리지 {lineageModalAnalyst.stocksList?.length || 0}종목</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  전문 섹터 내 담당 종목 풀 및 연차별 목표주가 적중 이력 데이터
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setLineageModalAnalyst(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LOGIC INFO MODAL */}
      {showLogicInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Info className="w-5 h-5 text-amber-400" />
                <span>TO-BE 시상 평가 가중치 모델</span>
              </h3>
              <button
                onClick={() => setShowLogicInfoModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 mb-6 leading-relaxed">
              <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30">
                <span className="font-bold text-amber-300 block mb-1">TO-BE 신규 평가 가중치 공식:</span>
                <p className="text-[11px]">
                  <strong>(영업기여 40%)</strong> + <strong>(분석심도 30%)</strong> + <strong>(조회수 20%)</strong> + <strong>(다운로드 10%)</strong>
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block mb-1">스페셜 테마 및 융합 선발 기준:</span>
                <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                  <li><strong>적중률 제왕</strong>: 목표주가와 실제 주가 일치율(오차 3% 이내) 1위</li>
                  <li><strong>고수익 챔피언</strong>: 커버리지 종목 평균 실현 알파 수익률 1위</li>
                  <li><strong>소신파/역발상 대상</strong>: 시장 과열/비관 속 소신의견(Hold/Sell) 정확도 1위</li>
                  <li><strong>융합 특별상</strong>: 반도체+AI, 모빌리티+배터리 등 이종 융합 분석력</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowLogicInfoModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DB CACHE STATUS MODAL */}
      {showDbCacheModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <span>DB 파일 저장 및 캐시 인스펙터</span>
              </h3>
              <button
                onClick={() => setShowDbCacheModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 mb-6">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">DB 영구 저장 경로:</span>
                <code className="text-indigo-300 text-xs font-mono">downloads/database/hall_of_fame_db.json</code>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">현재 기간:</span>
                  <span className="text-white font-bold">{hofData?.periodTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">캐시 상태:</span>
                  <span className={hofData?.isCached ? 'text-emerald-400 font-bold' : 'text-indigo-300 font-bold'}>
                    {hofData?.isCached ? '🟢 저장된 DB 캐시 로드' : '⚡ 실시간 생성됨 (DB 저장 완료)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">평가 시각:</span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {hofData?.evaluatedAt ? new Date(hofData.evaluatedAt).toLocaleString() : '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDbCacheModal(false);
                  fetchHallOfFame(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
              >
                캐시 갱신 (AI 재평가)
              </button>
              <button
                onClick={() => setShowDbCacheModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analyst Bottom Sheet Drawer */}
      <AnalystBottomSheet
        analyst={selectedAnalystForSheet}
        isOpen={Boolean(selectedAnalystForSheet)}
        onClose={() => setSelectedAnalystForSheet(null)}
        onViewReportDetail={onViewReportDetail}
      />
    </div>
  );
};
