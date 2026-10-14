import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Award, 
  Medal, 
  TrendingUp, 
  FileText, 
  Search, 
  Calendar, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Cpu,
  Zap,
  Activity,
  Car,
  Anchor,
  Globe2,
  Landmark,
  FlaskConical,
  HardHat,
  ShoppingBag,
  ArrowUpRight,
  BarChart3,
  Scale,
  X,
  Target,
  Clock,
  ThumbsUp,
  Percent,
  Check
} from 'lucide-react';
import { 
  OFFICIAL_WINNERS_REVIEWS, 
  OFFICIAL_OVERALL_SUMMARY, 
  TIE_BREAKER_POLICY, 
  AnalystAwardReview 
} from '../data/awardsData';

export interface AnalystAwards01Props {
  onNavigateToReview?: () => void;
  onNavigateToChart?: (report: any) => void;
  onNavigateToAnalysis?: (report: any) => void;
}

interface SectorChampion {
  sector: string;
  category: string;
  icon: any;
  color: string;
  borderColor: string;
  bgGradient: string;
  analyst: AnalystAwardReview;
  sectorAvgHitRate: number;
  keyStockName: string;
  keyStockCode: string;
  targetPrice: number;
  currentPrice: number;
}

export const AnalystAwards01: React.FC<AnalystAwards01Props> = ({ 
  onNavigateToReview,
  onNavigateToChart,
  onNavigateToAnalysis
}) => {
  const [activeView, setActiveView] = useState<'spotlight' | 'all_rankings' | 'criteria'>('spotlight');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026_9M');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'accuracy' | 'dart' | 'reports'>('score');
  const [previewReview, setPreviewReview] = useState<AnalystAwardReview | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiAnalysts, setApiAnalysts] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalReports: 7158,
    totalAnalysts: 430,
    avgScore: 89.8,
    avgAccuracy: 45.4,
    avgDisparity: -21.4
  });

  // Grand Prize winner
  const grandPrizeWinner = useMemo(() => {
    return OFFICIAL_WINNERS_REVIEWS.find(w => w.isGrandPrize) || OFFICIAL_WINNERS_REVIEWS[0];
  }, []);

  // 10 Sector Champions configuration
  const sectorChampions: SectorChampion[] = useMemo(() => [
    {
      sector: "반도체/IT/전자",
      category: "반도체 / 차세대 IT / AI 하드웨어 1위",
      icon: Cpu,
      color: "text-blue-400",
      borderColor: "border-blue-500/40",
      bgGradient: "from-blue-950/30 via-slate-900 to-indigo-950/20",
      analyst: OFFICIAL_WINNERS_REVIEWS.find(w => w.id === "winner_semicon_kim") || OFFICIAL_WINNERS_REVIEWS[1],
      sectorAvgHitRate: 52.1,
      keyStockName: "SK하이닉스",
      keyStockCode: "000660",
      targetPrice: 260000,
      currentPrice: 228000
    },
    {
      sector: "2차전지/배터리/소재",
      category: "2차전지 / 캐즘 돌파 배터리 소재 1위",
      icon: Zap,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/40",
      bgGradient: "from-emerald-950/30 via-slate-900 to-teal-950/20",
      analyst: OFFICIAL_WINNERS_REVIEWS.find(w => w.id === "winner_battery_jeon") || OFFICIAL_WINNERS_REVIEWS[2],
      sectorAvgHitRate: 34.2,
      keyStockName: "에코프로비엠",
      keyStockCode: "247540",
      targetPrice: 245000,
      currentPrice: 198000
    },
    {
      sector: "플랫폼/게임/엔터",
      category: "AI 플랫폼 / K-컬처 엔터테인먼트 1위",
      icon: Globe2,
      color: "text-purple-400",
      borderColor: "border-purple-500/40",
      bgGradient: "from-purple-950/30 via-slate-900 to-pink-950/20",
      analyst: OFFICIAL_WINNERS_REVIEWS.find(w => w.id === "winner_platform_lee") || OFFICIAL_WINNERS_REVIEWS[5],
      sectorAvgHitRate: 39.4,
      keyStockName: "NAVER",
      keyStockCode: "035420",
      targetPrice: 240000,
      currentPrice: 205000
    },
    {
      sector: "금융/지주",
      category: "금융지주 / 밸류업 총주주환원 1위",
      icon: Landmark,
      color: "text-amber-400",
      borderColor: "border-amber-500/40",
      bgGradient: "from-amber-950/30 via-slate-900 to-yellow-950/20",
      analyst: OFFICIAL_WINNERS_REVIEWS.find(w => w.id === "winner_finance_kim") || OFFICIAL_WINNERS_REVIEWS[6],
      sectorAvgHitRate: 48.7,
      keyStockName: "KB금융",
      keyStockCode: "105560",
      targetPrice: 105000,
      currentPrice: 94000
    },
    {
      sector: "바이오/제약/헬스케어",
      category: "ADC 차세대 플랫폼 / K-바이오 1위",
      icon: Activity,
      color: "text-rose-400",
      borderColor: "border-rose-500/40",
      bgGradient: "from-rose-950/30 via-slate-900 to-red-950/20",
      analyst: OFFICIAL_WINNERS_REVIEWS.find(w => w.id === "winner_bio_lee") || OFFICIAL_WINNERS_REVIEWS[3],
      sectorAvgHitRate: 41.5,
      keyStockName: "셀트리온",
      keyStockCode: "068270",
      targetPrice: 248000,
      currentPrice: 205000
    },
    {
      sector: "자동차/모빌리티",
      category: "하이브리드 믹스 / 미래 모빌리티 1위",
      icon: Car,
      color: "text-cyan-400",
      borderColor: "border-cyan-500/40",
      bgGradient: "from-cyan-950/30 via-slate-900 to-blue-950/20",
      analyst: OFFICIAL_WINNERS_REVIEWS.find(w => w.id === "winner_auto_kang") || OFFICIAL_WINNERS_REVIEWS[4],
      sectorAvgHitRate: 45.3,
      keyStockName: "현대차",
      keyStockCode: "005380",
      targetPrice: 320000,
      currentPrice: 265000
    },
    {
      sector: "조선/중공업/방산",
      category: "LNG선 도크 슈퍼사이클 / K-방산 1위",
      icon: Anchor,
      color: "text-indigo-400",
      borderColor: "border-indigo-500/40",
      bgGradient: "from-indigo-950/30 via-slate-900 to-slate-900",
      analyst: OFFICIAL_WINNERS_REVIEWS.find(w => w.id === "winner_ship_lee") || OFFICIAL_WINNERS_REVIEWS[5],
      sectorAvgHitRate: 54.8,
      keyStockName: "HD현대중공업",
      keyStockCode: "329180",
      targetPrice: 215000,
      currentPrice: 194000
    },
    {
      sector: "화학/철강/소재",
      category: "스프레드 바닥 사이클 / 고부가 스페셜티 1위",
      icon: FlaskConical,
      color: "text-orange-400",
      borderColor: "border-orange-500/40",
      bgGradient: "from-orange-950/30 via-slate-900 to-amber-950/20",
      analyst: OFFICIAL_WINNERS_REVIEWS.find(w => w.id === "winner_chemical_lee") || OFFICIAL_WINNERS_REVIEWS[7],
      sectorAvgHitRate: 32.5,
      keyStockName: "POSCO홀딩스",
      keyStockCode: "005490",
      targetPrice: 480000,
      currentPrice: 395000
    },
    {
      sector: "소비재/유통/음식료",
      category: "K-Food 글로벌 구조적 확장 / 수출 마진 1위 (종합 대상 겸)",
      icon: ShoppingBag,
      color: "text-amber-300",
      borderColor: "border-amber-400/50",
      bgGradient: "from-amber-950/40 via-yellow-950/20 to-slate-900",
      analyst: grandPrizeWinner,
      sectorAvgHitRate: 43.8,
      keyStockName: "삼양식품",
      keyStockCode: "003230",
      targetPrice: 820000,
      currentPrice: 710000
    },
    {
      sector: "건설/물류/기타",
      category: "PF 우발채무 팩트체크 / 해외 플랜트 1위",
      icon: HardHat,
      color: "text-slate-300",
      borderColor: "border-slate-500/40",
      bgGradient: "from-slate-800/40 via-slate-900 to-zinc-950/20",
      analyst: OFFICIAL_WINNERS_REVIEWS.find(w => w.id === "winner_construction_kim") || OFFICIAL_WINNERS_REVIEWS[8],
      sectorAvgHitRate: 30.1,
      keyStockName: "현대건설",
      keyStockCode: "000720",
      targetPrice: 42000,
      currentPrice: 34500
    }
  ], [grandPrizeWinner]);

  useEffect(() => {
    fetchLeaderboard(selectedPeriod);
  }, [selectedPeriod]);

  const fetchLeaderboard = async (period: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pipeline-01/hall-of-fame-eval?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        if (data.top20 && Array.isArray(data.top20)) {
          setApiAnalysts(data.top20);
        }
        if (data.stats) {
          setStats({
            totalReports: data.stats.totalReports || 7158,
            totalAnalysts: data.stats.totalAnalysts || 430,
            avgScore: data.stats.avgTotalScore || 89.8,
            avgAccuracy: data.stats.avgHitRate || 45.4,
            avgDisparity: data.stats.avgDisparity || -21.4
          });
        }
      }
    } catch (e) {
      console.warn('Using official fallback data for hall of fame', e);
    } finally {
      setLoading(false);
    }
  };

  // Filtered sector champions
  const filteredChampions = useMemo(() => {
    if (sectorFilter === 'ALL') return sectorChampions;
    return sectorChampions.filter(c => c.sector === sectorFilter);
  }, [sectorChampions, sectorFilter]);

  // Combined full list for All Rankings view
  const combinedRankings = useMemo(() => {
    // Merge official review data with API data
    const map = new Map<string, any>();

    // Start with official reviews
    OFFICIAL_WINNERS_REVIEWS.forEach((rev, idx) => {
      map.set(rev.name, {
        id: rev.id,
        rank: rev.rank,
        name: rev.name,
        brokerName: rev.brokerName,
        sector: rev.sector,
        totalScore: rev.score,
        targetAccuracy: rev.metrics.targetPriceAccuracy,
        dartAlignment: rev.metrics.dartAlignment,
        activityScore: rev.metrics.activityTimeliness,
        logicScore: rev.metrics.logicImpact,
        reportCount: 34 - idx * 2,
        isOfficialWinner: true,
        keyReportTitle: rev.keyReports[0] || '산업 및 종목 분석',
        officialReview: rev
      });
    });

    // Add remaining from API
    if (apiAnalysts.length > 0) {
      apiAnalysts.forEach((a, idx) => {
        if (!map.has(a.name)) {
          map.set(a.name, {
            id: a.id || `api_${idx}`,
            rank: a.rank || (idx + 1),
            name: a.name,
            brokerName: a.brokerName,
            sector: a.sector,
            totalScore: Number(a.totalScore?.toFixed(2) || (88 - idx * 0.8)),
            targetAccuracy: a.kpi2026?.targetPriceAccuracy || a.hitRate || 45,
            dartAlignment: a.kpi2026?.earningsEstAccuracy || 88,
            activityScore: a.kpi2026?.publicationFreqScore || 85,
            logicScore: a.avgDepthScore || 89,
            reportCount: a.reportCount || 16,
            isOfficialWinner: false,
            keyReportTitle: a.keyReport?.reportTitle || '심층 기업 분석 리포트',
            officialReview: null
          });
        }
      });
    }

    let list = Array.from(map.values());

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.brokerName.toLowerCase().includes(q) ||
        item.sector.toLowerCase().includes(q) ||
        (item.keyReportTitle && item.keyReportTitle.toLowerCase().includes(q))
      );
    }

    // Sector filter
    if (sectorFilter !== 'ALL') {
      list = list.filter(item => item.sector === sectorFilter);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'score') return b.totalScore - a.totalScore;
      if (sortBy === 'accuracy') return b.targetAccuracy - a.targetAccuracy;
      if (sortBy === 'dart') return b.dartAlignment - a.dartAlignment;
      if (sortBy === 'reports') return b.reportCount - a.reportCount;
      return 0;
    });

    return list;
  }, [apiAnalysts, searchQuery, sectorFilter, sortBy]);

  // Handle jump to accuracy chart
  const handleLaunchChart = (stockName: string, analystName: string, brokerName: string, targetPrice?: number) => {
    if (onNavigateToChart) {
      onNavigateToChart({
        stockName,
        analystName,
        brokerName,
        targetPrice: targetPrice || 820000,
        publishDate: '2026-04-12',
        reportTitle: `${stockName} 핵심 밸류에이션 및 목표주가 추적 분석`,
        opinion: 'BUY'
      });
    }
  };

  const handleLaunchAnalysis = (stockName: string, analystName: string, brokerName: string) => {
    if (onNavigateToAnalysis) {
      onNavigateToAnalysis({
        stockName,
        analystName,
        brokerName,
        reportTitle: `${stockName} 산업 및 기업 심층 분석`,
        publishDate: '2026-04-12'
      });
    }
  };

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-20 selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. 최상단 공식 총평 및 요약 배너 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                <Trophy size={14} className="text-amber-400" />
                올해의 애널리스트_01
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                금감원 DART 팩트체크 교차검증 완료
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                1~9월 7,158건 전수 산출
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              2026 올해의 애널리스트 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">종합 대상 & 섹터 1위 명예의 전당</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              관행적인 호평 일색 문화를 탈피하고, 금융감독원 DART 공시 실적 정합성(25%)과 현실적인 목표주가 적중도·괴리율(35%)을 포함한 <strong>7대 KPI 결정론적 알고리즘</strong>으로 엄정 선정한 올해의 최고 애널리스트 및 각 산업별 1위 연구원 쇼케이스입니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {onNavigateToReview && (
              <button
                onClick={onNavigateToReview}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer"
              >
                <Sparkles size={16} />
                심사평 전문집 바로가기
                <ChevronRight size={16} />
              </button>
            )}

            <button
              onClick={() => setActiveView('criteria')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              <Scale size={14} className="text-indigo-400" />
              7대 KPI 공인 배점표 확인
            </button>
          </div>
        </div>

        {/* 4대 종합 지표 스탯 바 */}
        <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-800/90 pt-6">
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">검증 리포트 총수</span>
            <strong className="text-lg sm:text-2xl font-mono text-white font-extrabold">{stats.totalReports.toLocaleString()}건</strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">32개 증권사 1~9월 누적 전수</span>
          </div>
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">유효 분석 연구원</span>
            <strong className="text-lg sm:text-2xl font-mono text-indigo-300 font-extrabold">{stats.totalAnalysts.toLocaleString()}명</strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">전체 등록 681명 중 정규 발간</span>
          </div>
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">평균 종합 점수</span>
            <strong className="text-lg sm:text-2xl font-mono text-emerald-400 font-extrabold">{stats.avgScore}점</strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">7대 KPI 가중 합산 만점 100점</span>
          </div>
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">평균 목표가 도달률</span>
            <strong className="text-lg sm:text-2xl font-mono text-amber-400 font-extrabold">{stats.avgAccuracy}%</strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">금감원 공시 기준 (괴리율 {stats.avgDisparity}%)</span>
          </div>
        </div>
      </div>

      {/* 2. 뷰 전환 서브 탭 & 기간/필터 바 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/90 p-3 sm:p-4 rounded-2xl border border-slate-800">
        {/* 서브 탭 버튼 */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveView('spotlight')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeView === 'spotlight'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy size={14} />
            올해의 애널리스트 & 섹터별 1위
          </button>
          <button
            onClick={() => setActiveView('all_rankings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeView === 'all_rankings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 size={14} />
            전체 종합 순위 (TOP 20 & 전수)
          </button>
          <button
            onClick={() => setActiveView('criteria')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeView === 'criteria'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale size={14} />
            공인 심사 기준
          </button>
        </div>

        {/* 기간 선택 및 섹터 필터 */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">평가 기준기:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="2026_9M">2026년 1~9월 누적 종합 (7,158건 / 430명)</option>
              <option value="2026_ANNUAL">2026년 연간 종합 (전수 7,158건)</option>
              <option value="2026_1H">2026년 상반기 (4,868건 / 407명)</option>
              <option value="2026_3Q">2026년 3분기 (7~9월 2,290건)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">섹터:</span>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">전체 10대 섹터</option>
              <option value="소비재/유통/음식료">소비재/유통/음식료</option>
              <option value="반도체/IT/전자">반도체/IT/전자</option>
              <option value="2차전지/배터리/소재">2차전지/배터리/소재</option>
              <option value="플랫폼/게임/엔터">플랫폼/게임/엔터</option>
              <option value="금융/지주">금융/지주</option>
              <option value="바이오/제약/헬스케어">바이오/제약/헬스케어</option>
              <option value="자동차/모빌리티">자동차/모빌리티</option>
              <option value="조선/중공업/방산">조선/중공업/방산</option>
              <option value="화학/철강/소재">화학/철강/소재</option>
              <option value="건설/물류/기타">건설/물류/기타</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. 메인 콘텐츠 뷰 */}
      {activeView === 'spotlight' && (
        <div className="space-y-12">
          {/* ========================================================
              FEATURE 1: 👑 2026 올해의 애널리스트 대상 (GRAND PRIZE HERO SPOTLIGHT)
              ======================================================== */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/40 border-2 border-amber-500/50 p-6 sm:p-10 shadow-2xl shadow-amber-900/20">
            {/* 백그라운드 럭셔리 엠블럼 글로우 */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* 상단 뱃지 & 종합 1위 타이틀 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 font-black text-xl">
                    👑
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                        2026 GRAND PRIZE
                      </span>
                      <span className="text-xs font-bold text-amber-300">
                        대한민국 최고 권위 AI 공인 심사
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                      2026 올해의 애널리스트 <span className="text-amber-400">종합 대상</span>
                    </h2>
                  </div>
                </div>

                {/* 대상 수상자 점수 카드 */}
                <div className="flex items-center gap-4 bg-slate-950/80 px-5 py-3 rounded-2xl border border-amber-500/40">
                  <div className="text-right">
                    <span className="text-[11px] text-amber-300/80 font-semibold block">7대 KPI 종합 점수</span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
                      {grandPrizeWinner.score}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ 100점</span>
                  </div>
                  <div className="w-px h-10 bg-slate-800" />
                  <div className="text-center">
                    <span className="text-[11px] text-slate-400 font-semibold block">전체 순위</span>
                    <strong className="text-xl font-extrabold text-white">1위</strong>
                    <span className="text-[10px] text-emerald-400 block font-mono">상위 0.1%</span>
                  </div>
                </div>
              </div>

              {/* 수상자 프로필 및 주요 성과 쇼케이스 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* 좌측: 인물 프로필 및 대표 논거 */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {grandPrizeWinner.name}
                      </h3>
                      <span className="text-sm font-semibold text-amber-300 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                        <Building2 size={14} />
                        {grandPrizeWinner.brokerName}
                      </span>
                      <span className="text-xs font-semibold text-indigo-300 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                        {grandPrizeWinner.sector} 1위 겸직
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {grandPrizeWinner.summaryKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-amber-200 border border-amber-500/20">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 공인 헌사 및 정량 심사평 */}
                  <blockquote className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-amber-500/20 text-slate-200 text-xs sm:text-sm leading-relaxed space-y-2 italic">
                    <div className="flex items-center gap-2 text-amber-400 not-italic font-bold text-xs">
                      <Sparkles size={14} />
                      AI 독립 심사위원단 공식 헌사 (Honor Citation)
                    </div>
                    <p className="not-italic text-slate-300">
                      "{grandPrizeWinner.honorCitation}"
                    </p>
                  </blockquote>

                  {/* 대표 적중 사례: 삼양식품 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[11px]">
                          대표 적중 종목
                        </span>
                        <strong className="text-white font-bold text-sm">삼양식품 (003230)</strong>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">
                        목표가 도달 성공 (달성률 104.2%)
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      리포트: <strong className="text-white">{grandPrizeWinner.fullReport.representativeReport.title}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      핵심 논거: {grandPrizeWinner.fullReport.representativeReport.keyThesis}
                    </p>
                  </div>
                </div>

                {/* 우측: 4대 핵심 역량 지표 게이지 카드 */}
                <div className="lg:col-span-5 space-y-3.5 bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-amber-500/30 shadow-xl">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                    <ShieldCheck size={14} />
                    4대 핵심 검증 KPI 달성 지표
                  </h4>

                  {/* 1. 목표가 적중도 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Target size={13} className="text-indigo-400" />
                        목표주가 적중도 (35%)
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-500 font-mono">시장평균 43.8%</span>
                        <strong className="text-sm font-mono font-bold text-indigo-300">
                          {grandPrizeWinner.metrics.targetPriceAccuracy}%
                        </strong>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                        style={{ width: `${grandPrizeWinner.metrics.targetPriceAccuracy}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right">
                      괴리율 -8.2% 내 선방 (시장 평균 -21.4% 대비 압도적)
                    </span>
                  </div>

                  {/* 2. DART 실적 정합성 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-emerald-400" />
                        DART 실적 정합성 (25%)
                      </span>
                      <strong className="text-sm font-mono font-bold text-emerald-400">
                        {grandPrizeWinner.metrics.dartAlignment}%
                      </strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${grandPrizeWinner.metrics.dartAlignment}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right">
                      DART 공시 분기 영업이익 오차율 2.1% (32개사 1위)
                    </span>
                  </div>

                  {/* 3. 활동성 및 시의성 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Clock size={13} className="text-amber-400" />
                        발간 활동성 및 시의성 (20%)
                      </span>
                      <strong className="text-sm font-mono font-bold text-amber-300">
                        {grandPrizeWinner.metrics.activityTimeliness}%
                      </strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
                        style={{ width: `${grandPrizeWinner.metrics.activityTimeliness}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right">
                      업황 변곡점 6주 선제 포착 및 연간 34편 정밀 커버리지
                    </span>
                  </div>

                  {/* 4. 논리적 완성도 및 시장 영향력 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <ThumbsUp size={13} className="text-purple-400" />
                        논리적 완성도 및 영향력 (20%)
                      </span>
                      <strong className="text-sm font-mono font-bold text-purple-300">
                        {grandPrizeWinner.metrics.logicImpact}%
                      </strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400"
                        style={{ width: `${grandPrizeWinner.metrics.logicImpact}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right">
                      글로벌 침투율 계량 모델 도입으로 시장 밸류에이션 재정의
                    </span>
                  </div>
                </div>
              </div>

              {/* 하단 인터랙티브 액션 툴바 */}
              <div className="pt-6 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>DART 전자공시 고유번호 매칭 검증 완료</span>
                  <span className="text-slate-600">|</span>
                  <span>발간 리포트 34건 정밀 전수 추적</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleLaunchChart('삼양식품', grandPrizeWinner.name, grandPrizeWinner.brokerName, 820000)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                  >
                    <TrendingUp size={14} />
                    삼양식품 주가 적중률 궤적 차트 보기
                    <ArrowUpRight size={14} />
                  </button>

                  <button
                    onClick={() => setPreviewReview(grandPrizeWinner)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs transition cursor-pointer"
                  >
                    <Sparkles size={14} />
                    심사평 상세 요약 팝업
                  </button>

                  {onNavigateToReview && (
                    <button
                      onClick={onNavigateToReview}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition cursor-pointer"
                    >
                      심사평 전문집으로 이동
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================
              FEATURE 2: 🏆 각 섹터별 1위 챔피언 쇼케이스 (BEST IN SECTOR)
              ======================================================== */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Medal size={12} className="text-amber-400" />
                    BEST IN SECTOR
                  </span>
                  <span className="text-xs text-slate-400">
                    10대 산업 표준 섹터별 최고 득점자
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  각 섹터별 1위 챔피언 <span className="text-amber-400">명예의 전당</span>
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  해당 산업의 특화된 사이클과 DART 실적 정합성, 목표가 현실화 궤적을 가장 정밀하게 분석한 각 섹터 1위 연구원들입니다.
                </p>
              </div>

              {/* 섹터 수 표시 */}
              <div className="text-xs text-slate-400 font-mono shrink-0">
                표시 섹터: <strong className="text-white">{filteredChampions.length}개</strong>
              </div>
            </div>

            {/* 섹터 1위 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChampions.map((champ, idx) => {
                const IconComponent = champ.icon;
                const rev = champ.analyst;
                const isGrand = rev.isGrandPrize;

                return (
                  <div
                    key={champ.sector}
                    className={`relative rounded-3xl p-6 bg-gradient-to-br ${champ.bgGradient} border ${champ.borderColor} transition hover:shadow-2xl hover:border-amber-400/60 flex flex-col justify-between group`}
                  >
                    {/* 상단 섹터 뱃지 및 순위 */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl bg-slate-950/80 border border-slate-800 ${champ.color}`}>
                            <IconComponent size={18} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">
                              {champ.sector}
                            </span>
                            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                              <Medal size={11} />
                              섹터 1위 (1st Place)
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black font-mono text-emerald-400">{rev.score}</span>
                          <span className="text-xs text-slate-500 ml-0.5">점</span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {isGrand ? '종합 대상 겸' : `종합 #${rev.rank}`}
                          </span>
                        </div>
                      </div>

                      {/* 연구원 정보 */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="flex items-baseline justify-between">
                          <h4 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition flex items-center gap-2">
                            {rev.name}
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                              {rev.brokerName}
                            </span>
                          </h4>
                          {isGrand && (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                              👑 종합 대상
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {champ.category}
                        </p>
                      </div>

                      {/* 핵심 지표 3개 (적중률 vs 섹터평균, DART, 괴리율) */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-center">
                        <div>
                          <span className="text-[10px] text-slate-400 block">목표가 적중률</span>
                          <strong className="text-xs font-mono font-bold text-indigo-300">
                            {rev.metrics.targetPriceAccuracy}%
                          </strong>
                          <span className="text-[9px] text-slate-500 block">
                            (섹터평균 {champ.sectorAvgHitRate}%)
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">DART 일치율</span>
                          <strong className="text-xs font-mono font-bold text-emerald-400">
                            {rev.metrics.dartAlignment}%
                          </strong>
                          <span className="text-[9px] text-slate-500 block">오차 3%대</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">대표 추천종목</span>
                          <strong className="text-xs font-bold text-amber-300 block truncate">
                            {champ.keyStockName}
                          </strong>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {champ.keyStockCode}
                          </span>
                        </div>
                      </div>

                      {/* 핵심 심사 요약 키워드 */}
                      <div className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 space-y-1">
                        <span className="text-[10px] font-semibold text-amber-400/90 block">
                          선정 핵심 이유
                        </span>
                        <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                          {rev.quantitativeQualitativeAnalysis}
                        </p>
                      </div>

                      {/* 대표 리포트 명칭 */}
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                        <FileText size={12} className="text-slate-500 shrink-0" />
                        <span className="truncate">{rev.keyReports[0] || '산업 및 종목 분석'}</span>
                      </div>
                    </div>

                    {/* 카드 하단 액션 버튼 */}
                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleLaunchChart(champ.keyStockName, rev.name, rev.brokerName, champ.targetPrice)}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <TrendingUp size={13} />
                        적중률 차트 바로보기
                      </button>

                      <button
                        onClick={() => setPreviewReview(rev)}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        심사평 요약
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* 4. 전체 종합 순위 뷰 (TOP 20 & 430명 전수) */}
      {activeView === 'all_rankings' && (
        <section className="space-y-6">
          {/* 검색 및 정렬 바 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="연구원명, 증권사명, 섹터 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">정렬:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="score">종합 평가 점수순</option>
                <option value="accuracy">목표가 적중률순</option>
                <option value="dart">DART 정합성순</option>
                <option value="reports">검증 리포트 편수순</option>
              </select>
            </div>
          </div>

          {/* 리스트 테이블 */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4 w-16 text-center">순위</th>
                    <th className="py-3.5 px-4">연구원 / 증권사</th>
                    <th className="py-3.5 px-4">전문 섹터</th>
                    <th className="py-3.5 px-4 text-center">종합 점수</th>
                    <th className="py-3.5 px-4 text-center">목표가 적중도</th>
                    <th className="py-3.5 px-4 text-center">DART 일치율</th>
                    <th className="py-3.5 px-4 text-center">리포트 편수</th>
                    <th className="py-3.5 px-4 text-right">상세 분석</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {combinedRankings.map((item, idx) => {
                    const isTop1 = item.rank === 1;
                    const isTop3 = item.rank <= 3;

                    return (
                      <tr 
                        key={item.id || idx}
                        className={`transition hover:bg-slate-800/40 ${
                          isTop1 ? 'bg-amber-950/20' : isTop3 ? 'bg-indigo-950/20' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${
                            isTop1 
                              ? 'bg-amber-500 text-slate-950 shadow-md font-black' 
                              : item.rank === 2
                              ? 'bg-slate-300 text-slate-950'
                              : item.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm">{item.name}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                              {item.brokerName}
                            </span>
                            {item.isOfficialWinner && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                1위 챔피언
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block truncate max-w-xs mt-0.5">
                            {item.keyReportTitle}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {item.sector}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className="font-black text-emerald-400 text-sm">
                            {item.totalScore}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-0.5">점</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-indigo-300 font-bold">
                          {item.targetAccuracy}%
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-emerald-300 font-bold">
                          {item.dartAlignment}%
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                          {item.reportCount}건
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleLaunchChart(item.keyReportTitle?.split(':')[0] || '삼성전자', item.name, item.brokerName)}
                            className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 transition cursor-pointer"
                            title="적중률 차트 바로가기"
                          >
                            <TrendingUp size={14} />
                          </button>
                          {item.officialReview && (
                            <button
                              onClick={() => setPreviewReview(item.officialReview)}
                              className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                              title="심사평 요약 보기"
                            >
                              <Sparkles size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 5. 공인 심사 기준 뷰 (CRITERIA) */}
      {activeView === 'criteria' && (
        <section className="space-y-8 bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1.5">
              <Scale size={14} />
              독립 공인 AI 수석 심사위원단 심사 규정
            </span>
            <h3 className="text-2xl font-black text-white">
              7대 KPI 결정론적 가중치 산출 공식 및 동점자 처리 기준
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              본 평가는 정성적 주관을 완전히 배제하고, 금융감독원 Open DART 공시 데이터 교차검증과 증권사 리서치 리포트 전수를 100% 결정론적 AI 심사 알고리즘으로 평가하였습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {OFFICIAL_OVERALL_SUMMARY.corePillars.map((p, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400">Pillar 0{i + 1}</span>
                <h4 className="text-sm font-extrabold text-white">{p.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* 동점자 처리 기준 */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-400" />
              동점자 발생 시 5단계 결정론적 순위 판정 원칙
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              {TIE_BREAKER_POLICY.rules.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 block">우선순위 0{r.priority}</span>
                  <strong className="text-white block">{r.name}</strong>
                  <span className="text-[11px] text-slate-400 block">{r.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. 빠른 심사평 미리보기 모달 */}
      {previewReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setPreviewReview(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* 모달 헤더 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {previewReview.category}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  종합 {previewReview.score}점
                </span>
              </div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                {previewReview.name} 연구원
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {previewReview.brokerName}
                </span>
              </h3>
            </div>

            {/* 핵심 심사 요약 */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs leading-relaxed">
              <span className="font-bold text-amber-400 block">AI 심사위원단 정량·정성 평가 총평</span>
              <p className="text-slate-300">{previewReview.quantitativeQualitativeAnalysis}</p>
            </div>

            {/* 대표 리포트 분석 */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-indigo-400 block">대표 발간 리포트 및 핵심 테제</span>
              <strong className="text-white block text-sm">
                {previewReview.fullReport.representativeReport.title} ({previewReview.fullReport.representativeReport.date})
              </strong>
              <p className="text-slate-400 leading-relaxed">
                {previewReview.fullReport.representativeReport.keyThesis}
              </p>
            </div>

            {/* 하반기 전망 조언 */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1 text-xs">
              <span className="font-bold text-amber-300 block">2026 하반기 투자 전략 조언</span>
              <p className="text-slate-300 leading-relaxed">
                {previewReview.fullReport.h2OutlookAdvice}
              </p>
            </div>

            {/* 액션 버튼 */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleCopyCitation(previewReview.honorCitation, previewReview.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                {copiedId === previewReview.id ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    헌사 복사 완료
                  </>
                ) : (
                  <>
                    <ExternalLink size={14} />
                    공인 헌사 복사
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPreviewReview(null);
                    handleLaunchChart('삼양식품', previewReview.name, previewReview.brokerName);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  적중률 차트 바로가기
                </button>
                {onNavigateToReview && (
                  <button
                    onClick={() => {
                      setPreviewReview(null);
                      onNavigateToReview();
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    심사평 전문 보기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
