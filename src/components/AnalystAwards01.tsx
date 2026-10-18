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
  Check,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { 
  OFFICIAL_WINNERS_REVIEWS, 
  OFFICIAL_OVERALL_SUMMARY, 
  TIE_BREAKER_POLICY, 
  AnalystAwardReview,
  OFFICIAL_SECTOR_TOP10,
  SectorRankedAnalyst
} from '../data/awardsData';
import {
  isAwardExcludedBroker,
  isTarget24Broker,
  getBrokerAwardStatus,
  TARGET_24_BROKERS,
  AWARD_EXCLUDED_BROKERS,
  BROKER_POLICY_V181
} from '../data/brokerConfig';
import { EvaluationReportExport } from './EvaluationReportExport';

export interface AnalystAwards01Props {
  onNavigateToReview?: () => void;
  onNavigateToReport?: () => void;
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
  onNavigateToReport,
  onNavigateToChart,
  onNavigateToAnalysis
}) => {
  const [activeView, setActiveView] = useState<'spotlight' | 'sector_top10' | 'all_rankings' | 'criteria' | 'report_export'>('spotlight');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026_9M');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'accuracy' | 'dart' | 'reports'>('score');
  const [previewReview, setPreviewReview] = useState<AnalystAwardReview | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiAnalysts, setApiAnalysts] = useState<any[]>([]);
  const [apiSectorAwards, setApiSectorAwards] = useState<Record<string, any[]>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [awardEligibilityFilter, setAwardEligibilityFilter] = useState<'ALL' | 'ELIGIBLE' | 'EXCLUDED'>('ALL');
  const [showBrokerPolicyModal, setShowBrokerPolicyModal] = useState<boolean>(false);

  const [stats, setStats] = useState({
    totalReports: 7842,
    totalAnalysts: 681,
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
      category: "K-Food 글로벌 구조적 확장 / 수출 마진 최우수 (1위)",
      icon: ShoppingBag,
      color: "text-amber-300",
      borderColor: "border-amber-400/50",
      bgGradient: "from-amber-950/40 via-yellow-950/20 to-slate-900",
      analyst: OFFICIAL_WINNERS_REVIEWS.find(w => w.id === "winner_consumer_park") || OFFICIAL_WINNERS_REVIEWS[1],
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
        if (data.sectorAwards) {
          setApiSectorAwards(data.sectorAwards);
        }
        if (data.stats) {
          setStats({
            totalReports: data.stats.totalReports || 7842,
            totalAnalysts: data.stats.totalAnalysts || 681,
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

  // Filtered sector champions (v1.8.1 시상 적격 필터 적용)
  const filteredChampions = useMemo(() => {
    let list = sectorChampions;
    if (sectorFilter !== 'ALL') {
      list = list.filter(c => c.sector === sectorFilter);
    }
    if (awardEligibilityFilter === 'ELIGIBLE') {
      list = list.filter(c => !isAwardExcludedBroker(c.analyst.brokerName));
    } else if (awardEligibilityFilter === 'EXCLUDED') {
      list = list.filter(c => isAwardExcludedBroker(c.analyst.brokerName));
    }
    return list;
  }, [sectorChampions, sectorFilter, awardEligibilityFilter]);

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

    // v1.8.1 시상 적격/제외 필터
    if (awardEligibilityFilter === 'ELIGIBLE') {
      list = list.filter(item => !isAwardExcludedBroker(item.brokerName));
    } else if (awardEligibilityFilter === 'EXCLUDED') {
      list = list.filter(item => isAwardExcludedBroker(item.brokerName));
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
  }, [apiAnalysts, searchQuery, sectorFilter, sortBy, awardEligibilityFilter]);

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

            <button
              onClick={() => {
                if (onNavigateToReport) onNavigateToReport();
                else setActiveView('report_export');
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/30 transition cursor-pointer"
            >
              <FileSpreadsheet size={15} />
              공인 평가 보고서 추출
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* 4대 종합 지표 스탯 바 */}
        <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-800/90 pt-6">
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">검증 리포트 총수</span>
            <strong className="text-lg sm:text-2xl font-mono text-white font-extrabold">{stats.totalReports.toLocaleString()}건</strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">대상 24개사 · 평가 5개사 누적 전수</span>
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
            올해의 애널리스트 & 섹터 1위
          </button>
          <button
            onClick={() => setActiveView('sector_top10')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeView === 'sector_top10'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award size={14} />
            10대 섹터별 TOP 10 (총 100명)
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
          <button
            onClick={() => setActiveView('report_export')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeView === 'report_export'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet size={14} />
            📑 평가 결과 보고서 추출
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

          {/* v1.8.1 시상 적격 퀵 필터 */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setAwardEligibilityFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                awardEligibilityFilter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              전체 (24개+5개사)
            </button>
            <button
              onClick={() => setAwardEligibilityFilter('ELIGIBLE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                awardEligibilityFilter === 'ELIGIBLE'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <Award size={12} />
              공식 시상 대상 (24개사)
            </button>
            <button
              onClick={() => setAwardEligibilityFilter('EXCLUDED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                awardEligibilityFilter === 'EXCLUDED'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              시상 제외 5개사
            </button>
          </div>
        </div>
      </div>

      {/* v1.8.1 증권사 선정 & 시상 운영 규정 요약 알림 바 */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0">
            <ShieldCheck size={13} className="text-amber-400" />
            v1.8.1 규정 시행
          </span>
          <p className="text-slate-300 leading-snug">
            <strong>공식 대상 24개 증권사</strong> 중심 평가 체계 확립 | <strong>5개 증권사(IBK·삼성·한국투자·대신·iM)</strong>는 7대 KPI 성과 평가는 100% 동일 집계하되 사내 컴플라이언스 기준에 따라 시상 대상에서는 제외됩니다.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">대상 24개사 · 평가 5개사</span>
          <button
            onClick={() => setShowBrokerPolicyModal(true)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow"
          >
            <ShieldCheck size={12} />
            규정 전문 보기
          </button>
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

                {/* 우측: 6대 핵심 역량 지표 게이지 카드 */}
                <div className="lg:col-span-5 space-y-3 bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-amber-500/30 shadow-xl">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                    <ShieldCheck size={14} />
                    6대 핵심 검증 KPI 달성 지표 (가중 평균 오차율 모델)
                  </h4>

                  {/* 1. 목표주가 정확성 (30%) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Target size={13} className="text-indigo-400" />
                        1. 목표주가 정확성 (30%)
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[11px] text-slate-500 font-mono">괴리율 -8.2%</span>
                        <strong className="text-sm font-mono font-bold text-indigo-300">
                          {grandPrizeWinner.metrics.targetPriceAccuracy}점
                        </strong>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                        style={{ width: `${grandPrizeWinner.metrics.targetPriceAccuracy}%` }}
                      />
                    </div>
                  </div>

                  {/* 2. 실적 추정 정확성 (40% - 최고 가중치) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-emerald-400" />
                        2. 실적 추정 정확성 (40% - 최고 가중치)
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[11px] text-emerald-400/90 font-mono">가중오차율 2.10%</span>
                        <strong className="text-sm font-mono font-bold text-emerald-400">
                          {grandPrizeWinner.metrics.dartAlignment}점
                        </strong>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${grandPrizeWinner.metrics.dartAlignment}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right">
                      1Q(20%)·2Q(30%)·3Q(50%) × 영업이익(60%)·매출(20%)·순익(20%) 9개 항목 전수 1위
                    </span>
                  </div>

                  {/* 3. 투자 논리의 타당성 (10%) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <ThumbsUp size={13} className="text-purple-400" />
                        3. 투자 논리의 타당성 (10%)
                      </span>
                      <strong className="text-sm font-mono font-bold text-purple-300">
                        {grandPrizeWinner.metrics.logicImpact}점 (S등급)
                      </strong>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400"
                        style={{ width: `${grandPrizeWinner.metrics.logicImpact}%` }}
                      />
                    </div>
                  </div>

                  {/* 4. 위험 요소 분석 적절성 (10%) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-rose-400" />
                        4. 위험 요소 분석 적절성 (10%)
                      </span>
                      <strong className="text-sm font-mono font-bold text-rose-300">
                        97.0점 (S등급)
                      </strong>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500"
                        style={{ width: `97%` }}
                      />
                    </div>
                  </div>

                  {/* 5. 발간 빈도(5%) & 6. SNS·언론(5%) */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-400 block">5. 발간 빈도 (5%)</span>
                      <strong className="text-xs font-mono font-bold text-amber-300">96.0점 (34편)</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-400 block">6. SNS·언론 빈도 (5%)</span>
                      <strong className="text-xs font-mono font-bold text-blue-300">96.0점 (최다)</strong>
                    </div>
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
                          <div className="flex items-center gap-1.5">
                            {isAwardExcludedBroker(rev.brokerName) ? (
                              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                                시상 제외 (평가 1위)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                                공식 시상 대상
                              </span>
                            )}
                            {isGrand && (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                                👑 종합 대상
                              </span>
                            )}
                          </div>
                        </div>

                        {isAwardExcludedBroker(rev.brokerName) && (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300">
                            ※ v1.8.1 시상 제외 규정사: 성과 평가는 객관적으로 동일 산정(1위)되나 컴플라이언스 기준상 공식 시상에서 제외됩니다.
                          </div>
                        )}

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

      {/* ========================================================
          NEW FEATURE: 10대 섹터별 TOP 10 랭킹 뷰 (대상 1명 + 섹터별 10명 총 100명 명단)
          ======================================================== */}
      {activeView === 'sector_top10' && (
        <section className="space-y-8 animate-fade-in">
          {/* 상단 안내 배너 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/30">
                  <Award size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                      SECTOR TOP 10 LINEUP
                    </span>
                    <span className="text-xs font-semibold text-emerald-300">
                      공인 확정 10대 산업 표준
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1">
                    2026 올해의 애널리스트 <span className="text-emerald-400">10대 섹터별 TOP 10</span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono">
                  평가 기준: 2026 1~9월 누적 7,842건 전수
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-bold">
                  가중 평균 오차율 모델 40%
                </span>
              </div>
            </div>

            {/* 소비재 유통 대상 단독 분리 및 섹터 1위 승계 원칙 안내 */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-3">
              <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-bold block mb-1">
                  👑 종합 대상 단독 표창 및 섹터 1위 승계 규정:
                </strong>
                소비재/유통/음식료 섹터에서 1위를 기록한 <strong className="text-white font-bold">한유정 연구원(한화투자증권, 종합 97.15점)</strong>은 전체 평가 1위로 <strong className="text-amber-300">2026 종합 대상 1명</strong>으로 단독 표창되며, 종합 대상 단독 분리 원칙에 따라 해당 섹터 차순위(2위)였던 <strong className="text-emerald-300 font-bold">박상준 연구원(키움증권, 종합 95.82점)</strong>이 소비재/유통/음식료 부문 1위 최우수 챔피언으로 공식 승계 선정되었습니다.
              </div>
            </div>
          </div>

          {/* 10개 섹터 리스트 반복 렌더링 */}
          <div className="space-y-10">
            {Object.entries(OFFICIAL_SECTOR_TOP10).map(([secName, defaultList]) => {
              // API에서 수신한 리스트가 있으면 우선 사용, 없으면 공식 검증 리스트 사용
              const sectorAnalysts = (apiSectorAwards[secName] && apiSectorAwards[secName].length > 0)
                ? apiSectorAwards[secName]
                : defaultList;

              // 필터 적용
              if (sectorFilter !== 'ALL' && sectorFilter !== secName) return null;

              const filteredList = sectorAnalysts.filter(a => {
                if (awardEligibilityFilter === 'ELIGIBLE') return !isAwardExcludedBroker(a.brokerName);
                if (awardEligibilityFilter === 'EXCLUDED') return isAwardExcludedBroker(a.brokerName);
                return true;
              });

              if (filteredList.length === 0) return null;

              const champion = defaultList.find(a => a.sectorRank === 1) || defaultList[0];

              return (
                <div key={secName} className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-5 shadow-xl">
                  {/* 섹터 헤더 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          표준 산업 섹터
                        </span>
                        <h4 className="text-xl sm:text-2xl font-black text-white">
                          {secName}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        {secName === "소비재/유통/음식료"
                          ? "종합 대상(한유정) 제외 후 섹터 순위 산정 (섹터 1위: 박상준 연구원 / 키움증권)"
                          : `섹터 1위 최우수 챔피언: ${champion.name} 연구원 (${champion.brokerName}, ${champion.totalScore}점)`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-950 text-slate-300 border border-slate-800">
                        선정 인원: {filteredList.length}명
                      </span>
                    </div>
                  </div>

                  {/* 섹터 TOP 10 테이블 */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold">
                          <th className="py-3 px-4 w-16 text-center">순위</th>
                          <th className="py-3 px-4 min-w-[140px]">애널리스트 / 증권사</th>
                          <th className="py-3 px-4 text-center">종합 점수</th>
                          <th className="py-3 px-4 text-center">목표주가 (30%)</th>
                          <th className="py-3 px-4 text-center">가중 실적오차 (40%)</th>
                          <th className="py-3 px-4 text-center hidden md:table-cell">논리 타당성 (10%)</th>
                          <th className="py-3 px-4 text-center hidden md:table-cell">위험 분석 (10%)</th>
                          <th className="py-3 px-4 text-center hidden lg:table-cell">리포트 편수</th>
                          <th className="py-3 px-4 min-w-[200px]">대표 발간 리포트</th>
                          <th className="py-3 px-4 text-right">상세</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {filteredList.map((a: any, idx: number) => {
                          const rank = a.sectorRank || idx + 1;
                          const isRank1 = rank === 1;
                          const isExcluded = isAwardExcludedBroker(a.brokerName);
                          const totalScore = a.totalScore ? Number(a.totalScore).toFixed(2) : "88.00";
                          const targetAcc = a.metrics?.targetPriceAccuracy || a.kpi2026?.targetPriceAccuracy || 68.5;
                          const dartAlign = a.metrics?.dartAlignment || a.kpi2026?.earningsEstAccuracy || 94.0;
                          const errorPct = a.metrics?.weightedErrorRatePct || (a.evaluation2026?.weightedEarningsModel?.weightedAverageErrorRatePct) || "3.80%";
                          const logicScore = a.metrics?.logicScore || a.kpi2026?.logicValidityScore || 89.0;
                          const riskScore = a.metrics?.riskScore || a.kpi2026?.riskAnalysisScore || 88.5;
                          const reportCount = a.metrics?.reportCount || a.reportCount || 24;
                          const keyReport = a.keyReportTitle || a.keyReport?.title || a.keyReport?.reportTitle || "산업 및 밸류체인 분석 리포트";

                          return (
                            <tr 
                              key={a.name + rank}
                              className={`transition hover:bg-slate-800/40 ${
                                isRank1 
                                  ? 'bg-amber-950/20 font-bold' 
                                  : idx % 2 === 1 ? 'bg-slate-900/20' : 'bg-transparent'
                              }`}
                            >
                              {/* 순위 */}
                              <td className="py-3.5 px-4 text-center">
                                {isRank1 ? (
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 font-black shadow-md shadow-amber-500/20 text-xs">
                                    1위
                                  </span>
                                ) : rank === 2 ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-300 text-slate-950 font-bold text-xs">
                                    2위
                                  </span>
                                ) : rank === 3 ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-700/80 text-white font-bold text-xs">
                                    3위
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-mono text-xs">
                                    #{rank}
                                  </span>
                                )}
                              </td>

                              {/* 연구원 / 증권사 */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <strong className="text-sm font-extrabold text-white">
                                      {a.name}
                                    </strong>
                                    {isRank1 && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        섹터 1위
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <span>{a.brokerName}</span>
                                    {isExcluded ? (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                        시상제외 5개사
                                      </span>
                                    ) : (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                        공식 24개사
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* 종합 점수 */}
                              <td className="py-3.5 px-4 text-center">
                                <strong className={`font-mono text-sm ${isRank1 ? 'text-amber-400 font-black' : 'text-emerald-400 font-extrabold'}`}>
                                  {totalScore}
                                </strong>
                                <span className="text-[10px] text-slate-500 block">점</span>
                              </td>

                              {/* 목표주가 정확성 (30%) */}
                              <td className="py-3.5 px-4 text-center">
                                <span className="font-mono text-indigo-300 font-semibold">
                                  {targetAcc}점
                                </span>
                              </td>

                              {/* 가중 평균 오차율 (40%) */}
                              <td className="py-3.5 px-4 text-center">
                                <span className="font-mono text-emerald-400 font-bold block">
                                  {dartAlign}점
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono block">
                                  오차율 {errorPct}
                                </span>
                              </td>

                              {/* 논리 타당성 (10%) */}
                              <td className="py-3.5 px-4 text-center hidden md:table-cell text-slate-300 font-mono">
                                {logicScore}점
                              </td>

                              {/* 위험 분석 (10%) */}
                              <td className="py-3.5 px-4 text-center hidden md:table-cell text-slate-300 font-mono">
                                {riskScore}점
                              </td>

                              {/* 리포트 편수 */}
                              <td className="py-3.5 px-4 text-center hidden lg:table-cell text-slate-400 font-mono">
                                {reportCount}건
                              </td>

                              {/* 대표 리포트 */}
                              <td className="py-3.5 px-4 text-slate-300">
                                <p className="line-clamp-1 text-xs" title={keyReport}>
                                  📄 {keyReport}
                                </p>
                              </td>

                              {/* 상세 버튼 */}
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => {
                                    const rev = OFFICIAL_WINNERS_REVIEWS.find(r => r.name === a.name);
                                    if (rev) {
                                      setPreviewReview(rev);
                                    } else {
                                      // 모의 리뷰 생성
                                      setPreviewReview({
                                        id: `rev_${a.name}`,
                                        rank,
                                        category: `${secName} ${rank}위`,
                                        name: a.name,
                                        brokerName: a.brokerName,
                                        sector: secName,
                                        score: Number(totalScore),
                                        keyReports: [keyReport],
                                        metrics: {
                                          targetPriceAccuracy: targetAcc,
                                          dartAlignment: dartAlign,
                                          activityTimeliness: 88.0,
                                          logicImpact: logicScore
                                        },
                                        summaryKeywords: [secName, "정량검증"],
                                        quantitativeQualitativeAnalysis: `${a.name} 연구원은 ${secName} 분야에서 1~9월 누적 가중 평균 오차율 ${errorPct}의 뛰어난 정합성을 달성하였습니다.`,
                                        marketContributionInsight: "철저한 DART 공시 데이터 교차검증과 시장 밸류에이션 추적으로 투자자 자산 보호에 기여했습니다.",
                                        honorCitation: `${secName} 분야에서 데이터의 엄밀함과 객관적 분석을 입증한 공로를 치하합니다.`,
                                        fullReport: {
                                          executiveSummary: `${a.name} 연구원 ${secName} ${rank}위 기록`,
                                          targetPriceTracking: `목표주가 정확성 ${targetAcc}점`,
                                          dartConsistency: `가중 평균 오차율 ${errorPct} 달성`,
                                          timelinessDepth: "정규 리포트 발간 및 변곡점 적시 포착",
                                          marketHealthContribution: "팩트 중심의 리서치 문화 조성",
                                          representativeReport: {
                                            title: keyReport,
                                            date: "2026-05-15",
                                            keyThesis: "재무제표와 분기 실적의 정합성에 기반한 밸류에이션 모델"
                                          },
                                          h2OutlookAdvice: "하반기 업황 변곡점과 거시경제 지표를 유의할 것",
                                          citationText: `${secName} 부문 우수 연구원 상을 헌정합니다.`
                                        }
                                      });
                                    }
                                  }}
                                  className="text-xs px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium transition cursor-pointer"
                                >
                                  심사평
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. 전체 순위 리스트 뷰 (ALL RANKINGS) */}
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
                            {isAwardExcludedBroker(item.brokerName) ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                                시상 제외 (평가 대상)
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                                공식 대상 (24개사)
                              </span>
                            )}
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
        <section className="space-y-8 bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 animate-fade-in">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1.5">
              <Scale size={14} />
              독립 공인 AI 수석 심사위원단 공식 평가 규정
            </span>
            <h3 className="text-2xl font-black text-white">
              AI가 뽑은 스타 애널리스트 6대 평가 항목 및 가중 평균 오차율 산출 공식
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              본 평가는 정성적 주관을 완전히 배제하고, 금융감독원 Open DART 공시 데이터 교차검증과 국내 24개 공식 대상 증권사 및 5개 시상제외 평가사의 총 7,842건(1~9월 누적 전수) 실제 발간 리서치 리포트를 100% 결정론적 AI 심사 알고리즘으로 평가하였습니다.
            </p>
          </div>

          {/* 6대 핵심 평가 항목 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFFICIAL_OVERALL_SUMMARY.corePillars.map((p, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition">
                <span className="text-xs font-bold text-amber-400">항목 0{i + 1}</span>
                <h4 className="text-sm font-extrabold text-white">{p.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* 실적 추정 정확성(40%) - 가중 평균 오차율 모델 3단계 상세 안내 */}
          <div className="p-6 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  Σ
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    실적 추정 정확성(가장 높은 가중치 항목 40%) : 가중 평균 오차율 모델
                  </h4>
                  <p className="text-xs text-emerald-400/90">
                    "모든 예측이 동등하게 중요하지는 않다" — 시기별·지표별 중요도에 따른 9개 항목 복합 가중치 적용
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-mono font-bold">
                합계 가중치 100% (1.00)
              </span>
            </div>

            {/* 3단계 계산 공식 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="font-bold text-emerald-400 block">1단계: 개별 예측 오차율(E) 계산</span>
                <p className="text-slate-300 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                  E = |A - F| / |A|
                </p>
                <p className="text-[11px] text-slate-400">
                  A: 실제 확정 실적 (DART 공시)<br />
                  F: 애널리스트 사전 추정치<br />
                  9개 개별 항목(E1 ~ E9)의 오차율을 산출합니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="font-bold text-amber-400 block">2단계: 복합 가중치(W) 설정</span>
                <p className="text-slate-300 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                  W = W_시기 × W_지표
                </p>
                <p className="text-[11px] text-slate-400">
                  시기별: 1Q 20%, 2Q 30%, 3Q 50%<br />
                  지표별: 영업이익 60%, 매출액 20%, 순이익 20%<br />
                  (예: 1Q 영업이익 W = 0.20 × 0.60 = 0.12)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 block">3단계: 최종 가중 평균 오차율</span>
                <p className="text-slate-300 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                  가중 평균 오차율 = Σ (Ei × Wi)
                </p>
                <p className="text-[11px] text-slate-400">
                  9개 개별 오차율에 각각의 가중치를 곱하여 최종 합산.<br />
                  정확도 점수 = (1 - 가중평균오차율) × 100
                </p>
              </div>
            </div>

            {/* 9대 세부 항목 가중치 매트릭스 표 */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                    <th className="py-2.5 px-4 text-left">평가 분기 (시기 가중치)</th>
                    <th className="py-2.5 px-4">매출액 (지표 20%)</th>
                    <th className="py-2.5 px-4 bg-emerald-950/30 text-emerald-300">영업이익 (지표 60% - 핵심)</th>
                    <th className="py-2.5 px-4">순이익 (지표 20%)</th>
                    <th className="py-2.5 px-4 font-mono">분기 소계</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-2.5 px-4 text-left font-bold text-white">2026년 1분기 (1Q : 20%)</td>
                    <td className="py-2.5 px-4 font-mono">0.20 × 0.20 = <strong>4%</strong></td>
                    <td className="py-2.5 px-4 font-mono bg-emerald-950/20 text-emerald-300 font-bold">0.20 × 0.60 = <strong>12%</strong></td>
                    <td className="py-2.5 px-4 font-mono">0.20 × 0.20 = <strong>4%</strong></td>
                    <td className="py-2.5 px-4 font-mono font-bold text-white">20%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-left font-bold text-white">2026년 2분기 (2Q : 30%)</td>
                    <td className="py-2.5 px-4 font-mono">0.30 × 0.20 = <strong>6%</strong></td>
                    <td className="py-2.5 px-4 font-mono bg-emerald-950/20 text-emerald-300 font-bold">0.30 × 0.60 = <strong>18%</strong></td>
                    <td className="py-2.5 px-4 font-mono">0.30 × 0.20 = <strong>6%</strong></td>
                    <td className="py-2.5 px-4 font-mono font-bold text-white">30%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-left font-bold text-white">2026년 3분기 (3Q : 50%)</td>
                    <td className="py-2.5 px-4 font-mono">0.50 × 0.20 = <strong>10%</strong></td>
                    <td className="py-2.5 px-4 font-mono bg-emerald-950/20 text-emerald-300 font-bold">0.50 × 0.60 = <strong>30%</strong></td>
                    <td className="py-2.5 px-4 font-mono">0.50 × 0.20 = <strong>10%</strong></td>
                    <td className="py-2.5 px-4 font-mono font-bold text-white">50%</td>
                  </tr>
                  <tr className="bg-slate-900/80 font-bold text-white">
                    <td className="py-2.5 px-4 text-left">지표별 총 가중치 합산</td>
                    <td className="py-2.5 px-4 font-mono">20%</td>
                    <td className="py-2.5 px-4 font-mono text-emerald-400">60%</td>
                    <td className="py-2.5 px-4 font-mono">20%</td>
                    <td className="py-2.5 px-4 font-mono text-amber-400">총합 100% (1.00)</td>
                  </tr>
                </tbody>
              </table>
            </div>
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

      {/* 5. 공인 평가 결과 보고서 추출 뷰 */}
      {activeView === 'report_export' && (
        <section className="space-y-6">
          <EvaluationReportExport
            onBackToAwards={() => setActiveView('spotlight')}
            onNavigateToChart={onNavigateToChart}
          />
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {previewReview.category}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  종합 {previewReview.score}점
                </span>
                {isAwardExcludedBroker(previewReview.brokerName) ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    시상 제외 규정사
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    공식 시상 대상 (24개사)
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                {previewReview.name} 연구원
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {previewReview.brokerName}
                </span>
              </h3>

              {isAwardExcludedBroker(previewReview.brokerName) && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 mt-2 space-y-1">
                  <strong className="text-amber-300 font-bold block">※ v1.8.1 시상 운영 규정 준수 안내</strong>
                  <p>
                    {previewReview.brokerName}은(는) 2026 어워즈 운영 규정에 따라 성과 지표(종합 {previewReview.score}점)는 공정하게 전수 평가되나, 사내 컴플라이언스 및 자체 규정에 따라 공식 시상(트로피/상패) 대상에서는 제외됩니다.
                  </p>
                </div>
              )}
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

      {/* ======================================================== */}
      {/* 5. 모달: v1.8.1 증권사 선정 및 평가·시상 운영 규정 팝업 */}
      {/* ======================================================== */}
      {showBrokerPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setShowBrokerPolicyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              aria-label="닫기"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <ShieldCheck size={16} />
                <span>VERSION 1.8.1 공식 증권사 선정 및 평가·시상 운영 규정</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {BROKER_POLICY_V181.title}
              </h3>
              <p className="text-xs text-slate-400">
                {BROKER_POLICY_V181.summary}
              </p>
            </div>

            <div className="space-y-4">
              {/* 24개 공식 대상 증권사 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                    <Award size={15} />
                    공식 대상 증권사 (24개사)
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">시상 적격</span>
                </div>
                <p className="text-xs text-slate-300">
                  국내 리서치 시장 핵심 24개사를 정규 심사 대상사로 확정하여 평가의 대표성과 산업 집중도를 극대화했습니다.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {TARGET_24_BROKERS.map(b => (
                    <span key={b} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-700 font-medium">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* 평가 진행 / 시상 제외 5개사 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck size={15} />
                    평가 진행 / 시상 제외 증권사 (5개사)
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">시상 제외 (평가 유지)</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>IBK투자증권, 삼성증권, 한국투자증권, 대신증권, iM증권</strong> 5개사는 컴플라이언스 및 사내 규정에 따라 공식 시상(트로피/상패) 대상에서는 제외하되, 시장 분석의 객관적 벤치마크 보존을 위해 AI 7대 KPI 성과 평가는 100% 동일하게 산정 및 공개합니다.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {AWARD_EXCLUDED_BROKERS.map(b => (
                    <span key={b} className="text-[11px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setShowBrokerPolicyModal(false)}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
              >
                규정 확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
