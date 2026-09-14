import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  RefreshCw,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Database,
  Eye,
  Code,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  Cpu,
  BarChart3,
  Layers,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  FolderDown,
  Info,
  Clock,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Globe,
  FileMinus,
  BookOpen,
  Copy,
  Check,
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import {
  Pipeline01NaverReport,
  Pipeline01CollectionOverview,
  Pipeline01SelectionEstimate,
  CollectionScopeConfig
} from '../types';
import { Pipeline01StatusOverview } from './pipeline01/Pipeline01StatusOverview';
import { Pipeline01MonthlyEngine } from './pipeline01/Pipeline01MonthlyEngine';
import { Pipeline01DatabaseStorage } from './pipeline01/Pipeline01DatabaseStorage';

interface Pipeline01NaverCollectorProps {
  onIngestReportsToHub?: (reports: Pipeline01NaverReport[]) => void;
}

// Built-in Static Fast Estimate Reference Matrix
const DEFAULT_ESTIMATES: Record<string, Pipeline01SelectionEstimate> = {
  '2026_first': {
    targetKey: '2026_first',
    title: '2026년 첫 거래일 (2026.01.02 최초 등록)',
    subtitle: '2026년 1호 리포트 앵커',
    estimatedCount: 4,
    pageRange: 'p.217 (2026년 시작 페이지)',
    estimatedPagesCount: 1,
    estimatedPdfSizeMb: 2.1,
    estimatedDurationSec: '0.3초 ~ 0.5초',
    topLikelyBrokers: ['하나증권', '유진투자증권', '키움증권', 'BNK투자증권'],
    keyHighlight: 'POSCO홀딩스, 셀트리온, 천보, 주성엔지니어링',
    badge: '2026 1호',
    badgeColor: 'emerald',
    description: '2026년 1월 2일 09시 새해 첫 개장과 함께 등록된 최초 4개 종목분석 리포트입니다.'
  },
  '2026-01': {
    targetKey: '2026-01',
    title: '2026년 1월 (실측 전수 데이터)',
    subtitle: '1월 업황 및 연초 전망 (실측 전수 815건 / 완비)',
    estimatedCount: 815,
    pageRange: 'p.191 ~ p.218 (28개 페이지 전수)',
    estimatedPagesCount: 28,
    estimatedPdfSizeMb: 423.8,
    estimatedDurationSec: '1.2초 ~ 2.2초',
    topLikelyBrokers: ['하나증권', '유진투자증권', '키움증권', '미래에셋증권'],
    keyHighlight: '2026년 1월 815건 실측 전수 수집 데이터',
    badge: '실측 전수 815건',
    badgeColor: 'blue',
    description: '2026년 1월 2일부터 1월 30일까지 발행된 종목분석 리포트 815건 전수(28개 페이지)를 수집합니다.'
  },
  '2026-02': {
    targetKey: '2026-02',
    title: '2026년 2월 (4Q25 실적 발표 시즌)',
    subtitle: '연간 실적 및 어닝 서프라이즈 (실측 전수 720건 완비)',
    estimatedCount: 720,
    pageRange: 'p.160 ~ p.189 (30개 페이지 전수)',
    estimatedPagesCount: 30,
    estimatedPdfSizeMb: 374.4,
    estimatedDurationSec: '0.7초 ~ 1.3초',
    topLikelyBrokers: ['미래에셋증권', '삼성증권', 'NH투자증권', 'KB증권'],
    keyHighlight: '4Q25 확정 실적 및 연간 배당 공시 분석',
    badge: '실적 시즌 720건',
    badgeColor: 'blue',
    description: '전년도 4분기 및 연간 실적 결산 리포트가 집중된 어닝 시즌 데이터입니다.'
  },
  '2026-03': {
    targetKey: '2026-03',
    title: '2026년 3월 (정기 주총 및 사업보고서)',
    subtitle: '주주환원 정책 및 밸류업 로드맵 (실측 전수 993건 완비)',
    estimatedCount: 993,
    pageRange: 'p.145 ~ p.159 (15개 페이지 전수)',
    estimatedPagesCount: 15,
    estimatedPdfSizeMb: 516.4,
    estimatedDurationSec: '0.5초 ~ 0.9초',
    topLikelyBrokers: ['한국투자증권', '신한투자증권', '메리츠증권', '하나증권'],
    keyHighlight: '정기 주총 안건 및 사업보고서 심층 리뷰 (993건 전수 수집 완료)',
    badge: '실측 전수 993건',
    badgeColor: 'blue',
    description: '3월 정기 주주총회와 기업 가치제고(밸류업) 계획 분석 중심의 종목분석 리포트 993건 전수 데이터입니다.'
  },
  '2026-04': {
    targetKey: '2026-04',
    title: '2026년 4월 (1Q26 프리뷰 & 실적 개시)',
    subtitle: '1분기 어닝 프리뷰 (실측 전수 780건 완비)',
    estimatedCount: 780,
    pageRange: 'p.105 ~ p.144 (40개 페이지 전수)',
    estimatedPagesCount: 40,
    estimatedPdfSizeMb: 405.6,
    estimatedDurationSec: '0.8초 ~ 1.4초',
    topLikelyBrokers: ['키움증권', '대신증권', '유진투자증권', '교보증권'],
    keyHighlight: '1분기 실적 프리뷰 및 분기 성장률 추정',
    badge: '어닝 프리뷰 780건',
    badgeColor: 'blue',
    description: '1분기 실적 시즌을 앞두고 발행된 섹터별 프리뷰 리포트 모음입니다.'
  },
  '2026-05': {
    targetKey: '2026-05',
    title: '2026년 5월 (1Q26 실적 리뷰 & 2Q 전략)',
    subtitle: '1분기 실적 결산 및 2분기 전망 (실측 전수 750건 완비)',
    estimatedCount: 750,
    pageRange: 'p.75 ~ p.104 (30개 페이지 전수)',
    estimatedPagesCount: 30,
    estimatedPdfSizeMb: 390.0,
    estimatedDurationSec: '0.7초 ~ 1.2초',
    topLikelyBrokers: ['하나증권', '유안타증권', 'IBK투자증권', '하이투자증권'],
    keyHighlight: '1Q26 실적 컨센서스 상회 기업 및 목표가 상향',
    badge: '실적 리뷰 750건',
    badgeColor: 'blue',
    description: '1분기 실적 확정치 발표와 목표주가 재조정이 활발했던 데이터입니다.'
  },
  '2026-06': {
    targetKey: '2026-06',
    title: '2026년 6월 (상반기 결산 & 하반기 전망)',
    subtitle: '하반기 유망 섹터 및 탑픽 (실측 전수 810건 완비)',
    estimatedCount: 810,
    pageRange: 'p.55 ~ p.74 (20개 페이지 전수)',
    estimatedPagesCount: 20,
    estimatedPdfSizeMb: 421.2,
    estimatedDurationSec: '0.6초 ~ 1.0초',
    topLikelyBrokers: ['미래에셋증권', 'KB증권', '삼성증권', '한화투자증권'],
    keyHighlight: '2026 하반기 산업 전망 및 섹터별 Top Pick',
    badge: '하반기 전망 810건',
    badgeColor: 'blue',
    description: '상반기 결산 및 2026년 하반기 투자 유망 종목 분석 리포트입니다.'
  },
  '2026-07': {
    targetKey: '2026-07',
    title: '2026년 7월 (2Q26 어닝 시즌)',
    subtitle: '2분기 실적 발표 및 중간배당 (실측 전수 840건 완비)',
    estimatedCount: 840,
    pageRange: 'p.15 ~ p.54 (40개 페이지 전수)',
    estimatedPagesCount: 40,
    estimatedPdfSizeMb: 436.8,
    estimatedDurationSec: '0.7초 ~ 1.3초',
    topLikelyBrokers: ['유진투자증권', '하나증권', '키움증권', '다올투자증권'],
    keyHighlight: '2Q26 실적 서프라이즈 및 하반기 이익 모멘텀',
    badge: '2Q 실적 840건',
    badgeColor: 'blue',
    description: '2분기 및 반기 실적 발표 리포트가 집중된 어닝 시즌 데이터입니다.'
  },
  '2026-08': {
    targetKey: '2026-08',
    title: '2026년 8월 (최신 실시간 수집)',
    subtitle: '현재 거래일 기준 최신 리포트 (실측 690건 완비)',
    estimatedCount: 690,
    pageRange: 'p.1 ~ p.14 (14개 페이지 Live)',
    estimatedPagesCount: 14,
    estimatedPdfSizeMb: 358.8,
    estimatedDurationSec: '0.4초 ~ 0.8초',
    topLikelyBrokers: ['하나증권', '미래에셋증권', '키움증권', '유진투자증권'],
    keyHighlight: '현재 거래일 기준 최신 발행 종목분석 리포트',
    badge: 'Live 최신 690건',
    badgeColor: 'emerald',
    description: '실시간으로 네이버 증권에 업로드되고 있는 최신 종목분석 리포트입니다.'
  },
  'all_2026': {
    targetKey: 'all_2026',
    title: '2026년 연간 전체 데이터베이스',
    subtitle: '2026년 1월 ~ 8월 전수 통합 (총 6,398건+ 아카이브)',
    estimatedCount: 6398,
    pageRange: 'p.1 ~ p.217 (217개 페이지 전수)',
    estimatedPagesCount: 217,
    estimatedPdfSizeMb: 3326.9,
    estimatedDurationSec: '1.2초 ~ 2.2초',
    topLikelyBrokers: ['32개 전 증권사 통합'],
    keyHighlight: '2026.01.02 최초 리포트부터 현재까지 전수 아카이브',
    badge: '2026 연간 종합 6,398건+',
    badgeColor: 'indigo',
    description: '2026년 연간 누적된 네이버 증권 리포트 전수 통합 데이터베이스입니다.'
  }
};

export const Pipeline01NaverCollector: React.FC<Pipeline01NaverCollectorProps> = ({
  onIngestReportsToHub
}) => {
  // Navigation Tabs: 'status' (수집 현황) | 'monthly_engine' (월별 수집) | 'explorer' (수집 데이터 조회) | 'database' (DB 안전 저장 & AI 스키마)
  const [activeTab, setActiveTab] = useState<'status' | 'monthly_engine' | 'explorer' | 'database'>('explorer');

  // Filter and Target Modes
  const [mode, setMode] = useState<'monthly' | 'latest' | 'january_2026' | 'all_2026' | 'page'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-01');
  const [multiMonths, setMultiMonths] = useState<string[]>(['2026-01']);
  const [isMultiMonthMode, setIsMultiMonthMode] = useState<boolean>(false);
  const [customPage, setCustomPage] = useState<number>(217);

  // Reports Cache Store: In-memory + LocalStorage Cache for instant display
  const [reportsCache, setReportsCache] = useState<Record<string, Pipeline01NaverReport[]>>(() => {
    try {
      const saved = localStorage.getItem('pipeline01_reports_cache');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Estimates State
  const [estimatesMap, setEstimatesMap] = useState<Record<string, Pipeline01SelectionEstimate>>(DEFAULT_ESTIMATES);
  const [hasFetchedCurrent, setHasFetchedCurrent] = useState<boolean>(false);
  const [autoFetchOnClick, setAutoFetchOnClick] = useState<boolean>(true);

  // Loaded Reports Data State
  const [reports, setReports] = useState<Pipeline01NaverReport[]>([]);
  const [firstReport2026, setFirstReport2026] = useState<Pipeline01NaverReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [brokerFilter, setBrokerFilter] = useState<string>('ALL');
  const [attachmentFilter, setAttachmentFilter] = useState<'ALL' | 'PDF_ONLY' | 'NO_PDF'>('ALL');
  const [sortOption, setSortOption] = useState<'default' | 'earliest' | 'hits' | 'name'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedNids, setSelectedNids] = useState<Set<string>>(new Set());

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Overview Status Metrics State
  const [overviewStats, setOverviewStats] = useState<Pipeline01CollectionOverview | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState<boolean>(false);

  // Download / Ingest / Modal Action States
  const [downloadingNid, setDownloadingNid] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [isSyncingDb, setIsSyncingDb] = useState<boolean>(false);
  const [ingestSuccessMessage, setIngestSuccessMessage] = useState<string | null>(null);
  const [selectedReportForDetail, setSelectedReportForDetail] = useState<Pipeline01NaverReport | null>(null);
  const [previewReport, setPreviewReport] = useState<Pipeline01NaverReport | null>(null);

  // Web Article Reader State
  const [readingWebArticleReport, setReadingWebArticleReport] = useState<Pipeline01NaverReport | null>(null);
  const [webArticleData, setWebArticleData] = useState<{
    nid: string;
    stockName: string;
    stockCode: string;
    reportTitle: string;
    brokerName: string;
    publishDate: string;
    hits: number;
    hasPdf: boolean;
    pdfUrl: string | null;
    reportUrl: string;
    bodyText: string;
    paragraphs: string[];
    paragraphCount: number;
    characterCount: number;
    fetchedAt: string;
  } | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState<boolean>(false);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Keyboard shortcut: ESC to close any open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedReportForDetail(null);
        setPreviewReport(null);
        setReadingWebArticleReport(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Open Web Article Reader and fetch full body content
  const openWebArticleReader = async (item: Pipeline01NaverReport) => {
    setReadingWebArticleReport(item);
    setWebArticleData(null);
    setIsLoadingArticle(true);
    setArticleError(null);
    setCopiedText(false);

    try {
      const res = await fetch(`/api/pipeline-01/naver-report-content?nid=${item.nid}`);
      const data = await res.json();
      if (data.success) {
        setWebArticleData(data);
      } else {
        setArticleError(data.error || '네이버 증권에서 리포트 본문을 불러오지 못했습니다.');
      }
    } catch (err: any) {
      setArticleError(err.message || '네이버 웹본문 연동 중 네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoadingArticle(false);
    }
  };

  // Copy article text to clipboard
  const handleCopyArticleContent = () => {
    if (!webArticleData) return;
    const textToCopy = `[${webArticleData.brokerName}] ${webArticleData.stockName} - ${webArticleData.reportTitle} (${webArticleData.publishDate})\n\n${webArticleData.bodyText}\n\n출처: 네이버 증권 (${webArticleData.reportUrl})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    });
  };

  // Helper to persist cache to LocalStorage
  const saveReportsToCache = (key: string, newReports: Pipeline01NaverReport[]) => {
    setReportsCache(prev => {
      const updated = { ...prev, [key]: newReports };
      try {
        localStorage.setItem('pipeline01_reports_cache', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage quota or write error:', e);
      }
      return updated;
    });
  };

  // Fetch selection estimates table
  const fetchEstimates = async () => {
    try {
      const res = await fetch('/api/pipeline-01/selection-estimates');
      const data = await res.json();
      if (data.success && data.estimates) {
        setEstimatesMap(data.estimates);
      }
    } catch (err) {
      console.error('Fetch estimates error:', err);
    }
  };

  // Scope Lock State (2026 1H MVP Lock)
  const [scopeConfig, setScopeConfig] = useState<CollectionScopeConfig | null>(null);
  const [isTogglingScope, setIsTogglingScope] = useState<boolean>(false);

  // Fetch Scope Lock Configuration
  const fetchScopeConfig = async () => {
    try {
      const res = await fetch('/api/pipeline-01/collection-scope');
      const data = await res.json();
      if (data.success && data.config) {
        setScopeConfig(data.config);
      }
    } catch (err) {
      console.error('Fetch scope config error:', err);
    }
  };

  // Toggle Scope Lock (Block / Unblock Post July)
  const handleToggleScopeLock = async (blockPostJuly: boolean) => {
    setIsTogglingScope(true);
    try {
      const res = await fetch('/api/pipeline-01/collection-scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockPostJuly })
      });
      const data = await res.json();
      if (data.success && data.config) {
        setScopeConfig(data.config);
        // Clear local cache if locking to avoid displaying out-of-scope data
        if (blockPostJuly) {
          try {
            const currentCache = JSON.parse(localStorage.getItem('pipeline01_reports_cache') || '{}');
            delete currentCache['2026-07'];
            delete currentCache['2026-08'];
            delete currentCache['all_2026'];
            localStorage.setItem('pipeline01_reports_cache', JSON.stringify(currentCache));
          } catch (e) {
            // ignore
          }
        }
        // Refresh overview and estimates
        await fetchOverviewStats();
        await fetchEstimates();
        // If current month is 7월 or 8월 and we locked, switch back to 2026-06 or 2026-01
        if (blockPostJuly && (selectedMonth === '2026-07' || selectedMonth === '2026-08')) {
          handleTargetChange('monthly', '2026-06');
        }
        setDownloadSuccessMessage(
          blockPostJuly
            ? '🔒 2026 상반기 MVP 검증 모드가 활성화되었습니다 (7월 이후 수집 차단).'
            : '🔓 상반기 잠금이 해제되었습니다 (2026년 전체 및 7~8월 Live 수집 허용).'
        );
      }
    } catch (err: any) {
      console.error('Toggle scope lock error:', err);
      setError(err.message || '수집 범위 설정 변경 중 오류가 발생했습니다.');
    } finally {
      setIsTogglingScope(false);
    }
  };

  // Fetch Monthly Overview KPI Stats
  const fetchOverviewStats = async () => {
    setIsLoadingOverview(true);
    try {
      const res = await fetch('/api/pipeline-01/monthly-stats');
      const data = await res.json();
      if (data.success && data.overview) {
        setOverviewStats(data.overview);
        if (data.overview.scopeConfig) {
          setScopeConfig(data.overview.scopeConfig);
        }
      }
    } catch (err) {
      console.error('Fetch overview error:', err);
    } finally {
      setIsLoadingOverview(false);
    }
  };

  // Calculate current dynamic estimate based on selection
  const getCurrentEstimate = (): Pipeline01SelectionEstimate => {
    if (mode === '2026_first') {
      return estimatesMap['2026_first'] || DEFAULT_ESTIMATES['2026_first'];
    }
    if (mode === 'all_2026') {
      return estimatesMap['all_2026'] || DEFAULT_ESTIMATES['all_2026'];
    }
    if (mode === 'page') {
      return {
        targetKey: 'page',
        title: `증권사 리서치 리포트 Page ${customPage}`,
        subtitle: `페이지 지정 조회 (Page ${customPage})`,
        estimatedCount: 30,
        pageRange: `p.${customPage}`,
        estimatedPagesCount: 1,
        estimatedPdfSizeMb: 15.6,
        estimatedDurationSec: '0.3초 ~ 0.5초',
        topLikelyBrokers: ['다수 증권사'],
        keyHighlight: customPage === 217 ? '2026.01.02 최초 등록 리포트 위치' : `Page ${customPage} 등록 리포트`,
        badge: `Page ${customPage}`,
        badgeColor: 'blue',
        description: `증권사 리서치 센터의 ${customPage}페이지에 등록된 30건의 리포트를 조회합니다.`
      };
    }
    if (isMultiMonthMode && multiMonths.length > 1) {
      const totalCount = multiMonths.reduce((acc, m) => acc + (estimatesMap[m]?.estimatedCount || 100), 0);
      const totalMb = multiMonths.reduce((acc, m) => acc + (estimatesMap[m]?.estimatedPdfSizeMb || 50), 0);
      const totalPages = multiMonths.reduce((acc, m) => acc + (estimatesMap[m]?.estimatedPagesCount || 25), 0);
      return {
        targetKey: 'multi',
        title: `선택된 ${multiMonths.length}개 월 (${multiMonths.map(m => m.replace('2026-', '') + '월').join(', ')})`,
        subtitle: '다중 월 복합 데이터 수집',
        estimatedCount: totalCount,
        pageRange: `${totalPages}개 페이지 복합`,
        estimatedPagesCount: totalPages,
        estimatedPdfSizeMb: Math.round(totalMb * 10) / 10,
        estimatedDurationSec: '0.8초 ~ 1.8초',
        topLikelyBrokers: ['32개 전 증권사'],
        keyHighlight: `${multiMonths.join(', ')} 통합 리포트 모음`,
        badge: `${multiMonths.length}개 월 선택`,
        badgeColor: 'indigo',
        description: `선택하신 ${multiMonths.length}개 월의 종목분석 리포트 전체를 통합 조회합니다.`
      };
    }
    return estimatesMap[selectedMonth] || DEFAULT_ESTIMATES[selectedMonth] || DEFAULT_ESTIMATES['2026-01'];
  };

  const currentEstimate = getCurrentEstimate();

  // Fetch Reports from Backend Live Naver Scraper
  const fetchNaverReports = async (
    fetchMode = mode,
    monthVal = isMultiMonthMode ? multiMonths.join(',') : selectedMonth,
    pageNum = customPage,
    depth: 'sample' | 'full' = 'full'
  ) => {
    setIsLoading(true);
    setError(null);
    setDownloadSuccessMessage(null);
    setIngestSuccessMessage(null);

    const cacheKey = isMultiMonthMode
      ? multiMonths.join(',')
      : fetchMode === '2026_first'
      ? '2026_first'
      : fetchMode === 'all_2026'
      ? 'all_2026'
      : fetchMode === 'page'
      ? `page_${pageNum}`
      : monthVal;

    try {
      let url = `/api/pipeline-01/naver-reports?mode=${fetchMode}&depth=${depth}`;
      if (fetchMode === 'monthly' || monthVal) {
        url += `&month=${monthVal}`;
      }
      if (fetchMode === 'page') {
        url += `&page=${pageNum}`;
      }
      if (brokerFilter !== 'ALL') {
        url += `&broker=${encodeURIComponent(brokerFilter)}`;
      }
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (sortOption !== 'default') {
        url += `&sort=${sortOption}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.reports)) {
        // Accumulate and deduplicate with existing cached reports by NID
        const existingCache = reportsCache[cacheKey] || [];
        const reportMap = new Map<string, Pipeline01NaverReport>();
        existingCache.forEach((r: Pipeline01NaverReport) => reportMap.set(r.nid, r));
        data.reports.forEach((r: Pipeline01NaverReport) => reportMap.set(r.nid, r));
        const accumulatedReports = Array.from(reportMap.values());

        setReports(accumulatedReports);
        setFirstReport2026(data.firstReport2026 || (accumulatedReports.length > 0 ? accumulatedReports[0] : null));
        saveReportsToCache(cacheKey, accumulatedReports);
        // Auto select all by default
        const allNids = new Set<string>(accumulatedReports.map((r: Pipeline01NaverReport) => r.nid));
        setSelectedNids(allNids);
        setHasFetchedCurrent(true);
      } else {
        setError(data.error || '네이버 증권 리포트를 불러오지 못했습니다.');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || '네이버 증권 서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load: Fetch estimates, overview stats, and immediately load / show 1월 data!
  useEffect(() => {
    fetchEstimates();
    fetchOverviewStats();

    // If 1월 data is already in cache, load it immediately; otherwise fetch it so user sees it directly!
    const savedCache = (() => {
      try {
        const s = localStorage.getItem('pipeline01_reports_cache');
        return s ? JSON.parse(s) : {};
      } catch (e) {
        return {};
      }
    })();

    if (savedCache['2026-01'] && savedCache['2026-01'].length > 0) {
      setReports(savedCache['2026-01']);
      setFirstReport2026(savedCache['2026-01'][0] || null);
      setSelectedNids(new Set(savedCache['2026-01'].map((r: Pipeline01NaverReport) => r.nid)));
      setHasFetchedCurrent(true);

      // If cached count is less than full 815 (e.g. previous 800 items), auto-fetch full 815 items to complete archive!
      if (savedCache['2026-01'].length < 815) {
        fetchNaverReports('monthly', '2026-01', 218, 'full');
      }
    } else {
      // Auto fetch 1월 full data on first mount (815 items)
      fetchNaverReports('monthly', '2026-01', 218, 'full');
    }
  }, []);

  // When selection changes: check cache first to display instantly; otherwise fetch full dataset!
  const handleTargetChange = (
    newMode: '2026_first' | 'monthly' | 'latest' | 'january_2026' | 'all_2026' | 'page',
    newMonth?: string,
    newPage?: number
  ) => {
    setMode(newMode);
    const targetMonthVal = newMonth || selectedMonth;
    if (newMonth) setSelectedMonth(newMonth);
    if (newPage) setCustomPage(newPage);

    const cacheKey = newMode === '2026_first'
      ? '2026_first'
      : newMode === 'all_2026'
      ? 'all_2026'
      : newMode === 'page'
      ? `page_${newPage || customPage}`
      : targetMonthVal;

    const targetEstimateCount = estimatesMap[targetMonthVal]?.estimatedCount || (targetMonthVal === '2026-02' ? 720 : 815);
    const cached = reportsCache[cacheKey];

    if (cached && cached.length >= targetEstimateCount) {
      // Full data already collected: Show immediately!
      setReports(cached);
      setSelectedNids(new Set(cached.map(r => r.nid)));
      setHasFetchedCurrent(true);
    } else {
      // If no cached data or cache only contains sample (< targetEstimateCount), auto-fetch full dataset!
      fetchNaverReports(newMode, targetMonthVal, newPage || customPage, 'full');
    }
  };

  const handleToggleMultiMonth = (m: string) => {
    let next: string[];
    if (multiMonths.includes(m)) {
      next = multiMonths.filter(item => item !== m);
      if (next.length === 0) next = [m];
    } else {
      next = [...multiMonths, m].sort();
    }
    setMultiMonths(next);
    setMode('monthly');

    const multiKey = next.join(',');
    if (reportsCache[multiKey] && reportsCache[multiKey].length > 0) {
      setReports(reportsCache[multiKey]);
      setSelectedNids(new Set(reportsCache[multiKey].map(r => r.nid)));
      setHasFetchedCurrent(true);
    } else {
      fetchNaverReports('monthly', multiKey, customPage, 'full');
    }
  };

  // Handle Download Single PDF (Direct file download to user's PC)
  const handleDownloadSinglePdf = async (report: Pipeline01NaverReport) => {
    setDownloadingNid(report.nid);
    setDownloadSuccessMessage(null);
    try {
      const params = new URLSearchParams({
        nid: report.nid || '',
        pdfUrl: report.pdfUrl || '',
        fileName: report.standardFileName || '',
        stockName: report.stockName || '',
        stockCode: report.stockCode || '',
        brokerName: report.brokerName || '',
        title: report.reportTitle || '',
        date: report.publishDate || '',
        yymmdd: report.yymmdd || '260102'
      });
      const downloadStreamUrl = `/api/pipeline-01/download-pdf-stream?${params.toString()}`;

      const res = await fetch(downloadStreamUrl);
      if (!res.ok) {
        throw new Error(`다운로드 응답 오류 (${res.status})`);
      }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', report.standardFileName || `${report.stockName}_리포트.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // Async save to server local cache
      fetch('/api/pipeline-01/download-single-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report,
          targetFolder: report.yymmdd || '260102'
        })
      }).catch(console.error);

      setDownloadSuccessMessage(`✓ [다운로드 완료] "${report.standardFileName}" (${(blob.size / 1024).toFixed(1)} KB) 파일이 내 PC에 정상 저장되었습니다.`);
      setReports(prev => prev.map(r => r.nid === report.nid ? { ...r, isDownloaded: true, fileSizeBytes: blob.size } : r));
    } catch (err: any) {
      console.error('Direct download error:', err);
      const fallbackParams = new URLSearchParams({
        nid: report.nid || '',
        pdfUrl: report.pdfUrl || '',
        fileName: report.standardFileName || '',
        stockName: report.stockName || '',
        stockCode: report.stockCode || '',
        brokerName: report.brokerName || '',
        title: report.reportTitle || ''
      });
      window.open(`/api/pipeline-01/download-pdf-stream?${fallbackParams.toString()}`, '_blank');
      setDownloadSuccessMessage(`[다운로드 시작] 브라우저 새 창에서 PDF 파일 다운로드가 시작되었습니다.`);
    } finally {
      setDownloadingNid(null);
    }
  };

  // Handle Batch ZIP Download
  const handleBatchZipDownload = async () => {
    if (selectedReports.length === 0) {
      alert('일괄 다운로드할 리포트를 1건 이상 선택해주세요.');
      return;
    }
    setIsDownloadingZip(true);
    setDownloadSuccessMessage(null);
    try {
      const zipFileName = `2026_증권사_종목분석_${selectedReports.length}건.zip`;
      const res = await fetch('/api/pipeline-01/download-batch-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reports: selectedReports,
          zipFileName
        })
      });

      if (!res.ok) {
        throw new Error(`ZIP 생성 실패 (${res.status})`);
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', zipFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccessMessage(`✓ [일괄 ZIP 다운로드 완료] 선택한 ${selectedReports.length}건의 리포트가 "${zipFileName}" (${(blob.size / 1024 / 1024).toFixed(2)} MB) 압축 파일로 PC에 정상 저장되었습니다.`);
      setReports(prev => prev.map(r => selectedNids.has(r.nid) ? { ...r, isDownloaded: true } : r));
    } catch (err: any) {
      alert(`ZIP 일괄 다운로드 오류: ${err.message}`);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Handle Ingest to Database / Hub
  const handleIngestToHub = async () => {
    if (selectedReports.length === 0) {
      alert('등록할 리포트를 1건 이상 선택해주세요.');
      return;
    }

    setIsIngesting(true);
    setIngestSuccessMessage(null);
    try {
      const res = await fetch('/api/pipeline-01/ingest-to-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reports: selectedReports })
      });
      const data = await res.json();
      if (data.success) {
        setIngestSuccessMessage(data.message || `리포트 ${selectedReports.length}건이 성공적으로 등록되었습니다.`);
        if (onIngestReportsToHub) {
          onIngestReportsToHub(selectedReports);
        }
      } else {
        alert(`등록 실패: ${data.error}`);
      }
    } catch (err: any) {
      alert(`오류: ${err.message}`);
    } finally {
      setIsIngesting(false);
    }
  };

  // Synchronize reports to Database (Firestore & Durable Master JSON Storage)
  const handleSyncToDatabase = async (reportsToSync?: Pipeline01NaverReport[]) => {
    const list = reportsToSync || (selectedReports.length > 0 ? selectedReports : reports);
    if (!list || list.length === 0) {
      alert('저장 및 동기화할 리포트 데이터가 없습니다.');
      return;
    }

    setIsSyncingDb(true);
    setDownloadSuccessMessage(null);
    try {
      const res = await fetch('/api/pipeline-01/db/sync-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reports: list,
          month: selectedMonth
        })
      });
      const data = await res.json();
      if (data.success) {
        setDownloadSuccessMessage(`🗄️ [DB 동기화 완료] 총 ${data.totalChecked}건 중 신규 저장 ${data.insertedCount}건, 변경 업데이트 ${data.updatedCount}건, 유지 ${data.skippedCount}건이 DB에 안전하게 보관되었습니다 (${data.durationMs}ms).`);
        fetchOverviewStats();
      } else {
        setError(data.error || 'DB 동기화 처리에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || 'DB 동기화 통신 중 오류가 발생했습니다.');
    } finally {
      setIsSyncingDb(false);
    }
  };

  // Filtering & Sorting Logic
  const brokersList = useMemo(() => {
    return Array.from(new Set(reports.map(r => r.brokerName))).filter(Boolean);
  }, [reports]);

  const pdfCount = useMemo(() => {
    return reports.filter(r => r.hasPdf && r.attachment_status !== 'FAILED').length;
  }, [reports]);

  const noPdfCount = useMemo(() => {
    return reports.filter(r => !r.hasPdf || r.attachment_status === 'FAILED' || r.attachment_status === 'NOT_FOUND').length;
  }, [reports]);

  const filteredReports = useMemo(() => {
    let list = reports.filter(r => {
      const matchesSearch = 
        searchTerm === '' ||
        r.stockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.stockCode.includes(searchTerm) ||
        r.reportTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.brokerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBroker = brokerFilter === 'ALL' || r.brokerName === brokerFilter;

      const matchesAttachment = 
        attachmentFilter === 'ALL' ? true :
        attachmentFilter === 'PDF_ONLY' ? (r.hasPdf && r.attachment_status !== 'FAILED') :
        (!r.hasPdf || r.attachment_status === 'FAILED' || r.attachment_status === 'NOT_FOUND');

      return matchesSearch && matchesBroker && matchesAttachment;
    });

    if (sortOption === 'earliest') {
      list = [...list].sort((a, b) => (a.publishDate || '').localeCompare(b.publishDate || ''));
    } else if (sortOption === 'hits') {
      list = [...list].sort((a, b) => (b.hits || 0) - (a.hits || 0));
    } else if (sortOption === 'name') {
      list = [...list].sort((a, b) => a.stockName.localeCompare(b.stockName));
    }

    return list;
  }, [reports, searchTerm, brokerFilter, attachmentFilter, sortOption]);

  // Reset to page 1 whenever filters or search terms change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, brokerFilter, attachmentFilter, sortOption, mode, selectedMonth, reports.length]);

  // Pagination Calculations
  const totalItems = filteredReports.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedReports = useMemo(() => {
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, startIndex, endIndex]);

  // Generate dynamic array of visible page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (safeCurrentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages];
  }, [safeCurrentPage, totalPages]);

  // Jump to specific page handler
  const handleJumpPage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpPageInput('');
    }
  };

  const selectedReports = filteredReports.filter(r => selectedNids.has(r.nid));

  // Selection toggle functions
  const toggleSelectAll = () => {
    if (selectedNids.size === filteredReports.length && filteredReports.length > 0) {
      setSelectedNids(new Set());
    } else {
      setSelectedNids(new Set(filteredReports.map(r => r.nid)));
    }
  };

  const toggleSelectCurrentPage = () => {
    const currentPageNids = paginatedReports.map(r => r.nid);
    const allCurrentSelected = currentPageNids.length > 0 && currentPageNids.every(nid => selectedNids.has(nid));
    const next = new Set(selectedNids);
    if (allCurrentSelected) {
      currentPageNids.forEach(nid => next.delete(nid));
    } else {
      currentPageNids.forEach(nid => next.add(nid));
    }
    setSelectedNids(next);
  };

  const clearSelection = () => {
    setSelectedNids(new Set());
  };

  const toggleSelectOne = (nid: string) => {
    const next = new Set(selectedNids);
    if (next.has(nid)) {
      next.delete(nid);
    } else {
      next.add(nid);
    }
    setSelectedNids(next);
  };

  // Month Transition Handlers from other tabs
  const handleSelectMonthFromStatus = (month: string) => {
    handleTargetChange('monthly', month);
    setActiveTab('explorer');
  };

  const handleStartCrawlFromStatus = (month: string) => {
    setSelectedMonth(month);
    setActiveTab('monthly_engine');
  };

  const handleMonthlyCollectionDone = (month: string, collectedReports: Pipeline01NaverReport[]) => {
    fetchOverviewStats();
    saveReportsToCache(month, collectedReports);
    setReports(collectedReports);
    setSelectedNids(new Set(collectedReports.map(r => r.nid)));
    setHasFetchedCurrent(true);
  };

  const isScopeLocked = scopeConfig ? scopeConfig.blockPostJuly : true;

  const monthOptions = useMemo(() => {
    const rawOptions = [
      { month: '2026-01', label: '1월', fullLabel: '2026.01', defaultCount: 815, defaultBadge: '실측 전수 815건', isLocked: false },
      { month: '2026-02', label: '2월', fullLabel: '2026.02', defaultCount: 720, defaultBadge: '2월 전수 720건', isLocked: false },
      { month: '2026-03', label: '3월', fullLabel: '2026.03', defaultCount: 993, defaultBadge: '실측 전수 993건', isLocked: false },
      { month: '2026-04', label: '4월', fullLabel: '2026.04', defaultCount: 780, defaultBadge: '1Q 프리뷰 780건', isLocked: false },
      { month: '2026-05', label: '5월', fullLabel: '2026.05', defaultCount: 750, defaultBadge: '1Q 리뷰 750건', isLocked: false },
      { month: '2026-06', label: '6월', fullLabel: '2026.06', defaultCount: 810, defaultBadge: '상반기 결산 810건', isLocked: false },
      { month: '2026-07', label: '7월', fullLabel: '2026.07', defaultCount: 840, defaultBadge: isScopeLocked ? '🔒 7월 잠김 (MVP)' : '2Q 어닝 840건', isLocked: isScopeLocked },
      { month: '2026-08', label: '8월', fullLabel: '2026.08', defaultCount: 690, defaultBadge: isScopeLocked ? '🔒 8월 잠김 (MVP)' : 'Live 최신 690건', isLocked: isScopeLocked }
    ];

    return rawOptions.map(opt => {
      const estimate = estimatesMap[opt.month];
      const count = opt.isLocked ? 0 : (estimate?.estimatedCount ?? opt.defaultCount);
      const badge = opt.isLocked ? '🔒 잠김 (상반기 MVP)' : (estimate?.badge ?? opt.defaultBadge);
      return {
        ...opt,
        count,
        badge
      };
    });
  }, [estimatesMap, isScopeLocked]);

  // Partial vs Full Data Possession Metrics
  const expectedTotal = currentEstimate.estimatedCount;
  const currentCount = reports.length;
  const isPartialData = hasFetchedCurrent && currentCount > 0 && currentCount < expectedTotal;
  const isFullData = hasFetchedCurrent && currentCount >= expectedTotal;
  const missingCount = Math.max(0, expectedTotal - currentCount);
  const possessionRate = expectedTotal > 0 ? Math.min(100, Math.round((currentCount / expectedTotal) * 1000) / 10) : 100;

  return (
    <div id="pipeline-01-collector-container" className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Header Card */}
      <div id="pipeline-01-header-banner" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-slate-100">데이터 파이프라인_01</h1>
                  <span className="bg-emerald-900/60 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-700/60 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1"></span>
                    증권사 리서치 수집 &amp; 통합 시스템
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  2026년 첫 번째 데이터(2026.01.02 최초 등록) · 월별 리포트 수집 엔진 · 수집 현황 대시보드 · 추정 건수 선조회 &amp; 선택 수집
                </p>
              </div>
            </div>

            {/* Quick Meta Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px]">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700">
                <Database className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                원천: 증권사 리서치 센터 &gt; 종목분석
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                추정 건수 선제공 &amp; 선택 시 로딩 정책 적용
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/70">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                2026년 1호 리포트 (2026.01.02) 앵커 동기화
              </span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {reports.length > 0 && (
              <button
                onClick={() => handleSyncToDatabase()}
                disabled={isSyncingDb || reports.length === 0}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-900/40 transition-all active:scale-95 disabled:opacity-50"
                title="수집된 리포트 데이터를 DB(Firestore & Master JSON Store)에 안전하게 저장 및 동기화합니다."
              >
                <Database className={`w-3.5 h-3.5 ${isSyncingDb ? 'animate-spin' : ''}`} />
                <span>{isSyncingDb ? 'DB 저장 중...' : `🗄️ DB 동기화 (${reports.length}건)`}</span>
              </button>
            )}

            <button
              onClick={() => {
                fetchOverviewStats();
                fetchEstimates();
                if (hasFetchedCurrent) {
                  fetchNaverReports(mode, isMultiMonthMode ? multiMonths.join(',') : selectedMonth, customPage);
                }
              }}
              disabled={isLoading || isLoadingOverview}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>

            {hasFetchedCurrent && selectedReports.length > 0 && (
              <>
                <button
                  onClick={handleBatchZipDownload}
                  disabled={isDownloadingZip || selectedReports.length === 0}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  title="선택된 모든 리포트를 단일 ZIP 파일로 압축하여 내 PC에 저장"
                >
                  <Download className={`w-3.5 h-3.5 text-cyan-400 ${isDownloadingZip ? 'animate-bounce' : ''}`} />
                  <span>{isDownloadingZip ? 'ZIP 생성 중...' : `선택 (${selectedReports.length}건) 일괄 ZIP 다운`}</span>
                </button>

                <button
                  onClick={handleIngestToHub}
                  disabled={isIngesting || selectedReports.length === 0}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{selectedReports.length}건 허브 등록</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3 Core Functional Mode Switcher Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-2 ${
              activeTab === 'status'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 ring-2 ring-blue-400/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-300" />
            <span>수집 현황 대시보드</span>
            {overviewStats && (
              <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-200 text-[10px]">
                {overviewStats.totalReportsCollected}건
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('monthly_engine')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-2 ${
              activeTab === 'monthly_engine'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40 ring-2 ring-cyan-400/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-300" />
            <span>월별 데이터 수집 엔진</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-200 text-[10px]">
              {isScopeLocked ? '2026 1~6월 (상반기 MVP)' : '2026 1월~8월'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-2 ${
              activeTab === 'explorer'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-2 ring-emerald-400/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-300" />
            <span>수집 데이터 조회 &amp; 다운로드</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-200 text-[10px]">
              {hasFetchedCurrent ? `${reports.length}건 로드됨` : `추정 ${currentEstimate.estimatedCount}건`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-2 ${
              activeTab === 'database'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 ring-2 ring-purple-400/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-purple-300" />
            <span>차분 안전 DB &amp; AI 스키마</span>
            <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-200 text-[10px]">
              Safe Diff Storage
            </span>
          </button>
        </div>
      </div>

      {/* Success Notification Banners */}
      {downloadSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
          <button onClick={() => setDownloadSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-200 text-xs font-bold px-2 py-0.5">
            ✕
          </button>
        </div>
      )}

      {ingestSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-200 text-xs flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{ingestSuccessMessage}</span>
          </div>
          <button onClick={() => setIngestSuccessMessage(null)} className="text-blue-400 hover:text-blue-200 text-xs font-bold px-2 py-0.5">
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: 수집 현황 대시보드 (COLLECTION STATUS & METRICS) */}
      {/* ========================================================================= */}
      {activeTab === 'status' && (
        <Pipeline01StatusOverview
          overview={overviewStats}
          isLoading={isLoadingOverview}
          onRefresh={fetchOverviewStats}
          onSelectMonthForInquiry={handleSelectMonthFromStatus}
          onStartMonthlyCrawl={handleStartCrawlFromStatus}
          onToggleScopeLock={handleToggleScopeLock}
          isTogglingScope={isTogglingScope}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 월별 데이터 수집 엔진 (MONTHLY COLLECTION ENGINE) */}
      {/* ========================================================================= */}
      {activeTab === 'monthly_engine' && (
        <Pipeline01MonthlyEngine
          onCollectionComplete={handleMonthlyCollectionDone}
          onViewCollectedReports={(month) => {
            handleTargetChange('monthly', month);
            setActiveTab('explorer');
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 수집 데이터 조회 및 다운로드 (DATA EXPLORER & QUERY) */}
      {/* ========================================================================= */}
      {activeTab === 'explorer' && (
        <div className="space-y-6 animate-fadeIn">
          {/* ADVANCED TARGET SELECTION & ESTIMATION CONTROL BAR */}
          <div id="pipeline-01-controls" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            {/* Top Row: Mode & Policy Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>수집 대상 선택 (추정 건수 확인 후 가져오기)</span>
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  On-Demand Loading
                </span>
                {isScopeLocked && (
                  <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-700/60 font-semibold flex items-center space-x-1">
                    <Lock className="w-3 h-3 mr-1" />
                    7월 이후 잠김 (상반기 MVP)
                  </span>
                )}
              </div>

              {/* Auto-fetch toggle */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 text-[11px]">다중 월 선택:</span>
                <button
                  type="button"
                  onClick={() => setIsMultiMonthMode(!isMultiMonthMode)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                    isMultiMonthMode
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {isMultiMonthMode ? 'ON' : 'OFF'}
                </button>

                <span className="text-slate-600">|</span>

                <span className="text-slate-400 text-[11px]">선택 시 자동 즉시 로드:</span>
                <button
                  type="button"
                  onClick={() => setAutoFetchOnClick(!autoFetchOnClick)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                    autoFetchOnClick
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {autoFetchOnClick ? 'ON' : 'OFF (추정치 먼저 확인)'}
                </button>
              </div>
            </div>

            {/* Month & Target Selector Chips with Estimated Counts Displayed Upfront */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {/* Monthly Chips */}
                {monthOptions.map(m => {
                  const isSelectedSingle = mode === 'monthly' && selectedMonth === m.month && !isMultiMonthMode;
                  const isSelectedMulti = isMultiMonthMode && multiMonths.includes(m.month);
                  const isSelected = isMultiMonthMode ? isSelectedMulti : isSelectedSingle;

                  if (m.isLocked) {
                    return (
                      <button
                        key={m.month}
                        type="button"
                        onClick={() => {
                          setDownloadSuccessMessage(`🔒 ${m.fullLabel}은 2026 상반기 MVP 검증 모드로 인해 수집이 잠겨있습니다. 상단 '현황 대시보드'에서 잠금을 해제할 수 있습니다.`);
                        }}
                        className="px-3 py-2 rounded-xl text-xs transition-all flex items-center space-x-1.5 bg-slate-900/60 text-slate-500 border border-slate-800/80 cursor-not-allowed opacity-60 hover:opacity-80"
                        title="2026 상반기 MVP 검증 모드로 인해 7월 이후 수집이 잠겨있습니다."
                      >
                        <Lock className="w-3 h-3 text-amber-500/70" />
                        <span>{m.fullLabel}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-950 text-amber-500/60 border border-amber-950">
                          잠김
                        </span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={m.month}
                      type="button"
                      onClick={() => {
                        if (isMultiMonthMode) {
                          handleToggleMultiMonth(m.month);
                        } else {
                          handleTargetChange('monthly', m.month);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-xs transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40 ring-2 ring-blue-400/40 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>{m.fullLabel}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                          isSelected
                            ? 'bg-blue-950 text-blue-200'
                            : 'bg-slate-900 text-cyan-300 border border-slate-700'
                        }`}
                      >
                        추정 {m.count}건
                      </span>
                    </button>
                  );
                })}

                {/* 2026 Full Year / 1H MVP Chip */}
                <button
                  type="button"
                  onClick={() => handleTargetChange('all_2026', 'all_2026')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    mode === 'all_2026' && !isMultiMonthMode
                      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{isScopeLocked ? '2026 상반기 전체' : '2026 연간 전체'}</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-indigo-300 text-[10px] font-mono border border-slate-700">
                    추정 {(estimatesMap['all_2026']?.estimatedCount || (isScopeLocked ? 4868 : 6398)).toLocaleString()}건
                  </span>
                </button>

                {/* Custom Page Mode Chip */}
                <button
                  type="button"
                  onClick={() => handleTargetChange('page', selectedMonth, customPage)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    mode === 'page' && !isMultiMonthMode
                      ? 'bg-slate-700 text-white shadow-md ring-2 ring-slate-400/40 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>페이지 직접입력</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-700">
                    30건/페이지
                  </span>
                </button>
              </div>
            </div>

            {/* Custom Page Input if in Page Mode */}
            {mode === 'page' && !isMultiMonthMode && (
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs animate-fadeIn">
                <span className="text-slate-300 font-semibold">네이버 증권 페이지 번호 (1 ~ 250):</span>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={customPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 1;
                    setCustomPage(val);
                    setHasFetchedCurrent(false);
                  }}
                  className="w-24 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => fetchNaverReports('page', selectedMonth, customPage)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm"
                >
                  해당 페이지 ({customPage}p) 데이터 가져오기
                </button>
                <span className="text-[11px] text-slate-500">
                  * 2026년 첫 거래일 리포트는 217페이지에 위치합니다.
                </span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* ESTIMATED SUMMARY & FETCH CONFIRMATION HERO PANEL */}
            {/* ========================================================================= */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      선택 대상 추정 메트릭
                    </span>
                    <h3 className="text-white font-bold text-sm">
                      {currentEstimate.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    {currentEstimate.description}
                  </p>
                </div>

                {/* Primary CTA Button to Fetch Reports */}
                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => fetchNaverReports(mode, isMultiMonthMode ? multiMonths.join(',') : selectedMonth, customPage, 'full')}
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all inline-flex items-center space-x-2 active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>
                      {isLoading
                        ? '실시간 전수 수집/누적 중...'
                        : hasFetchedCurrent && reports.length >= currentEstimate.estimatedCount
                        ? `[전수 완료] 데이터 다시 불러오기`
                        : `선택한 리포트 전수 누적 수집하기 (추정 ${currentEstimate.estimatedCount}건)`}
                    </span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Stats Pill Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-900 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">
                      {hasFetchedCurrent && reports.length > 0 ? '실제 수집 완료 건수' : '총 추정 건수'}
                    </div>
                    <div className="font-extrabold text-slate-200 font-mono text-xs sm:text-sm">
                      {hasFetchedCurrent && reports.length > 0 ? (
                        <span className="text-emerald-300 font-bold">{reports.length.toLocaleString()}건</span>
                      ) : (
                        `약 ${currentEstimate.estimatedCount.toLocaleString()}건`
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">크롤링 대상 범위</div>
                    <div className="font-semibold text-purple-300 text-[11px] truncate max-w-[130px]" title={currentEstimate.pageRange}>
                      {currentEstimate.pageRange}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                    <FolderDown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">예상 PDF 용량</div>
                    <div className="font-semibold text-emerald-300 font-mono text-xs">
                      약 {currentEstimate.estimatedPdfSizeMb} MB
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">예상 소요 시간</div>
                    <div className="font-semibold text-amber-300 font-mono text-xs">
                      {currentEstimate.estimatedDurationSec}
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* STATUS NOTIFICATION BANNER: PARTIAL POSSESSION VS FULL DATA GUIDANCE */}
              {/* ========================================================================= */}
              {hasFetchedCurrent && isPartialData && (
                <div className="p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500/70 text-amber-200 space-y-3 shadow-xl animate-fadeIn">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-amber-100">
                            [{currentEstimate.title}] 데이터 일부 보유 중 ({currentCount}건 / 전체 {expectedTotal}건 중 {possessionRate}%)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-900/90 text-amber-300 text-[10px] font-bold border border-amber-600">
                            미수집 {missingCount}건
                          </span>
                        </div>
                        <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                          현재 <strong>{currentCount}건의 리포트가 화면에 표시</strong>되고 있습니다. 전체 {expectedTotal}건 중 <strong>{missingCount}건의 리포트가 아직 수집되지 않은 상태</strong>입니다. 아래 버튼을 눌러 나머지 리포트를 추가 수집하여 전수 데이터를 완성하세요.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                      <button
                        type="button"
                        onClick={() => fetchNaverReports(mode, isMultiMonthMode ? multiMonths.join(',') : selectedMonth, customPage, 'full')}
                        disabled={isLoading}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-amber-950/50 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>나머지 {missingCount}건 전수 수집 중...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>나머지 {missingCount}건 추가 전수 수집하기 (전체 {expectedTotal}건 완성)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {hasFetchedCurrent && isFullData && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/60 text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-fadeIn">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-emerald-100">
                        [{currentEstimate.title}] 전수 데이터 완비 ({currentCount}건 / 100% 수집 완료)
                      </span>
                      <span className="text-[11px] text-emerald-400/80 ml-2 hidden lg:inline">
                        2026.01.02 최초 리포트부터 전체 아카이브 완료
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchNaverReports(mode, isMultiMonthMode ? multiMonths.join(',') : selectedMonth, customPage, 'full')}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 text-xs font-semibold border border-emerald-700/60 flex items-center space-x-1.5 transition-all self-end sm:self-auto"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>실시간 데이터 다시 갱신</span>
                  </button>
                </div>
              )}

              {/* 1월 Special Note & Full/Fast Guide */}
              {(selectedMonth === '2026-01' || mode === 'january_2026') && (
                <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200 flex items-start space-x-2">
                  <span className="text-blue-400 font-bold shrink-0 mt-0.5">ℹ️ 네이버 증권 1월 실측 안내:</span>
                  <div className="space-y-1 text-[11px] leading-relaxed">
                    <p>
                      <strong>네이버 증권 2026년 1월 실제 등록 리포트는 총 29개 페이지(p.189 ~ p.217)에 걸쳐 실측 814~815건</strong>입니다.
                    </p>
                    <p className="text-slate-300">
                      • <strong>수치 차이 원인</strong>: 2026년 1월 전체 리포트 815건 중 <strong>PDF 첨부 리포트가 717건</strong>, <strong>증권사 웹 링크/본문 리포트가 98건</strong>이며, 시작 페이지(p.189 1건) 및 1월 첫 거래일(p.217 4건)의 경계 데이터 포함 여부에 따라 814~815건으로 산출됩니다.<br/>
                      • <strong>1월 전수 수집</strong>: 2026.01.02 최초 등록(217p)부터 1월 말(189p)까지 815건 전수 수집.<br/>
                      • <strong>고속 샘플 모드</strong>: 신속한 조회를 위해 대표 8개 페이지(241건)를 실시간 샘플링합니다.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* If reports are loaded: Search, Broker Filter, Sorting, Page Size, View Modes */}
            {hasFetchedCurrent && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                {/* Attachment Status Quick Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                  <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => setAttachmentFilter('ALL')}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        attachmentFilter === 'ALL'
                          ? 'bg-slate-800 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      전체 ({reports.length}건)
                    </button>
                    <button
                      onClick={() => setAttachmentFilter('PDF_ONLY')}
                      className={`px-3 py-1 rounded-lg font-medium inline-flex items-center space-x-1.5 transition-all ${
                        attachmentFilter === 'PDF_ONLY'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold shadow'
                          : 'text-slate-400 hover:text-emerald-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>PDF 첨부 ({pdfCount}건)</span>
                    </button>
                    <button
                      onClick={() => setAttachmentFilter('NO_PDF')}
                      className={`px-3 py-1 rounded-lg font-medium inline-flex items-center space-x-1.5 transition-all ${
                        attachmentFilter === 'NO_PDF'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold shadow'
                          : 'text-slate-400 hover:text-amber-400'
                      }`}
                    >
                      <FileMinus className="w-3 h-3 text-amber-400" />
                      <span>PDF 미첨부 / 웹본문 ({noPdfCount}건)</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span className="inline-flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>PDF 첨부 완료</span>
                    </span>
                    <span className="inline-flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span>웹본문 (PDF 없음)</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-4 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="종목명, 종목코드, 리포트 제목, 증권사 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={brokerFilter}
                      onChange={(e) => setBrokerFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="ALL">전체 증권사 ({brokersList.length}개)</option>
                      {brokersList.map((broker) => (
                        <option key={broker} value={broker}>{broker}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="default">발행일 최신순</option>
                      <option value="earliest">2026 최초 발행순</option>
                      <option value="hits">조회수 높은순</option>
                      <option value="name">종목명 가나다순</option>
                    </select>
                  </div>

                  {/* Page Size Selector */}
                  <div className="sm:col-span-2">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                      title="한 페이지에 표시할 리포트 개수"
                    >
                      <option value={10}>10개씩 보기</option>
                      <option value={15}>15개씩 보기</option>
                      <option value={20}>20개씩 보기</option>
                      <option value={30}>30개씩 보기</option>
                      <option value={50}>50개씩 보기</option>
                      <option value={100}>100개씩 보기</option>
                    </select>
                  </div>

                  {/* Table / Grid Mode Toggle */}
                  <div className="sm:col-span-1 flex items-center justify-end space-x-1">
                    <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        title="카드 뷰"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`p-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'table' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        title="테이블 뷰"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selection & Batch Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Current Page Selection Toggle */}
                    <button
                      onClick={toggleSelectCurrentPage}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-medium hover:border-slate-700 transition-all"
                    >
                      {paginatedReports.length > 0 && paginatedReports.every(r => selectedNids.has(r.nid)) ? (
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>
                        현재 페이지 ({paginatedReports.filter(r => selectedNids.has(r.nid)).length}/{paginatedReports.length}건)
                      </span>
                    </button>

                    {/* All Pages Selection Toggle */}
                    <button
                      onClick={toggleSelectAll}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-medium hover:border-slate-700 transition-all"
                    >
                      {selectedNids.size === filteredReports.length && filteredReports.length > 0 ? (
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>
                        전체 선택 ({selectedNids.size}/{filteredReports.length}건)
                      </span>
                    </button>

                    {selectedNids.size > 0 && (
                      <button
                        onClick={clearSelection}
                        className="text-[11px] text-slate-500 hover:text-rose-400 underline px-1.5 py-0.5"
                      >
                        선택 해제
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-emerald-400 text-xs font-semibold flex items-center space-x-1.5 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {totalItems > 0 ? `${startIndex + 1} - ${endIndex}` : '0'} / 총 <strong className="font-mono">{totalItems}</strong>건 
                        <span className="text-slate-400 font-normal ml-1 font-mono">({safeCurrentPage}/{totalPages}p)</span>
                      </span>
                    </span>
                    <button
                      onClick={() => setHasFetchedCurrent(false)}
                      className="text-slate-500 hover:text-slate-300 text-[11px] underline"
                    >
                      추정치 미리보기 모드로 접기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* REPORT LISTING (GRID OR TABLE) OR ESTIMATE PREVIEW STATE */}
          {/* ========================================================================= */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-slate-900/40 rounded-2xl border border-slate-800">
              <RefreshCw className="w-9 h-9 text-emerald-400 animate-spin" />
              <div className="text-center">
                <p className="text-slate-200 text-sm font-bold">
                  [{currentEstimate.title}] 리포트를 실시간 수집 및 파싱하고 있습니다...
                </p>
                <p className="text-slate-500 text-xs mt-1 font-mono">
                  대상 범위: {currentEstimate.pageRange} · 예상 건수: {currentEstimate.estimatedCount}건
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl bg-rose-950/40 border border-rose-800 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <div className="text-rose-200 font-bold text-sm">{error}</div>
              <button
                onClick={() => fetchNaverReports(mode)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다시 시도</span>
              </button>
            </div>
          ) : !hasFetchedCurrent ? (
            /* ESTIMATE PREVIEW CARD (BEFORE FETCHING) */
            <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 text-center space-y-5 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              
              <div className="max-w-xl mx-auto space-y-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  추정 건수 선제공 모드
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  {currentEstimate.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentEstimate.description} 불필요한 전체 대량 트래픽을 방지하기 위해 개별 리포트를 사전에 자동 로드하지 않습니다. 아래 버튼을 클릭하여 선택한 리포트 목록을 실시간으로 가져오세요.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fetchNaverReports(mode, isMultiMonthMode ? multiMonths.join(',') : selectedMonth, customPage, 'full')}
                  disabled={isLoading}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-sm font-bold shadow-xl shadow-emerald-950/50 transition-all inline-flex items-center space-x-2 active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>전체 전수 수집 및 목록 조회 ({currentEstimate.estimatedCount}건)</span>
                </button>
                <button
                  type="button"
                  onClick={() => fetchNaverReports(mode, isMultiMonthMode ? multiMonths.join(',') : selectedMonth, customPage, 'sample')}
                  disabled={isLoading}
                  className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold border border-slate-700 transition-all inline-flex items-center space-x-2 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <span>고속 샘플 목록 즉시 조회</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-900 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-500 font-mono">
                <span>✓ 예상 페이지: {currentEstimate.pageRange}</span>
                <span>✓ 예상 PDF 용량: ~{currentEstimate.estimatedPdfSizeMb} MB</span>
                <span>✓ 대표 증권사: {currentEstimate.topLikelyBrokers.join(', ')}</span>
              </div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium">선택된 조건의 리포트가 없습니다.</p>
              <p className="text-xs text-slate-600 mt-1">검색어를 변경하거나 필터를 초기화해보세요.</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedReports.map((item) => {
                  const isSelected = selectedNids.has(item.nid);
                  const is2026FirstAnchor = item.is2026First || item.rawDate === '26.01.02';
                  const hasValidAttachment = item.hasPdf && item.attachment_status !== 'FAILED';

                  return (
                    <div
                      key={item.nid}
                      className={`border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:shadow-xl relative ${
                        !hasValidAttachment
                          ? 'bg-slate-900/90 border-amber-800/50 hover:border-amber-600/70 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20'
                          : is2026FirstAnchor
                          ? 'bg-slate-900 border-emerald-700/60 bg-gradient-to-b from-slate-900 to-emerald-950/20 hover:border-emerald-600'
                          : isSelected
                          ? 'bg-slate-900/95 border-cyan-800/80 hover:border-cyan-700'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Card Header Top */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleSelectOne(item.nid)}
                              className="text-slate-400 hover:text-slate-200"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-600" />
                              )}
                            </button>
                            <span className="font-bold text-slate-100 text-sm">
                              {item.stockName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              {item.stockCode}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            {is2026FirstAnchor && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800 flex items-center space-x-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>2026 1호</span>
                              </span>
                            )}
                            {!hasValidAttachment && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openWebArticleReader(item);
                                }}
                                className="px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 text-[10px] font-bold border border-amber-800/80 flex items-center space-x-1 hover:bg-amber-900 transition-colors cursor-pointer"
                                title="웹본문 내용 바로 읽기"
                              >
                                <BookOpen className="w-2.5 h-2.5 text-amber-400" />
                                <span>웹본문</span>
                              </button>
                            )}
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[11px] font-semibold">
                              {item.brokerName}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4
                          className="text-xs font-bold line-clamp-2 transition-colors cursor-pointer mb-2 text-slate-100 hover:text-emerald-300"
                          onClick={() => openWebArticleReader(item)}
                          title={`${item.reportTitle} (클릭하여 본문 및 요약 내용 읽기)`}
                        >
                          {!hasValidAttachment && (
                            <span className="inline-block px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 text-[10px] font-bold border border-amber-800/80 mr-1.5 align-middle">
                              웹본문
                            </span>
                          )}
                          {item.reportTitle}
                        </h4>

                        {/* Meta Info */}
                        <div className="space-y-1.5 text-[11px] text-slate-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">발행일자:</span>
                            <span className="font-mono text-slate-300 font-semibold">{item.publishDate} ({item.rawDate})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">조회수:</span>
                            <span className="font-mono text-emerald-400 font-bold">{item.hits.toLocaleString()} 회</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">첨부 상태:</span>
                            {hasValidAttachment ? (
                              <span 
                                onClick={() => setPreviewReport(item)}
                                className="font-mono text-emerald-300 font-semibold truncate max-w-[170px] cursor-pointer hover:underline flex items-center space-x-1" 
                                title="클릭하여 PDF 미리보기"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>PDF 첨부 완료 (보기/다운)</span>
                              </span>
                            ) : (
                              <span 
                                onClick={() => openWebArticleReader(item)}
                                className="font-mono text-amber-400 font-semibold flex items-center space-x-1 cursor-pointer hover:underline" 
                                title="클릭하여 웹본문 내용 읽기"
                              >
                                <BookOpen className="w-3 h-3 text-amber-400" />
                                <span>PDF 미첨부 (웹본문)</span>
                              </span>
                            )}
                          </div>
                          {hasValidAttachment && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">표준 파일명:</span>
                              <span className="font-mono text-cyan-300 truncate max-w-[170px]" title={item.standardFileName}>
                                {item.standardFileName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 gap-2">
                        <div className="flex items-center space-x-1.5">
                          {hasValidAttachment ? (
                            <>
                              <button
                                onClick={() => setPreviewReport(item)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 transition-colors"
                                title="PDF 바로보기 (스트림 뷰어)"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openWebArticleReader(item)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 transition-colors"
                                title="웹본문 텍스트/요약 읽기"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <a
                              href={item.reportUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                              title="네이버 증권 리포트 원문 페이지 새창 열기"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => setSelectedReportForDetail(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                            title="JSON 상세 메타데이터 보기"
                          >
                            <Code className="w-3.5 h-3.5 text-purple-400" />
                          </button>
                        </div>

                        {hasValidAttachment ? (
                          <button
                            onClick={() => handleDownloadSinglePdf(item)}
                            disabled={downloadingNid === item.nid}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all disabled:opacity-50 active:scale-95"
                            title="표준 파일명으로 내 PC에 PDF 파일 다운로드"
                          >
                            <Download className={`w-3.5 h-3.5 ${downloadingNid === item.nid ? 'animate-bounce' : ''}`} />
                            <span>{downloadingNid === item.nid ? '저장 중...' : 'PDF 다운로드'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => openWebArticleReader(item)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-800 transition-all active:scale-95 shadow-sm shadow-amber-950/40"
                            title="네이버 증권 리포트 웹본문 내용 읽기"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>웹본문 읽기</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <button onClick={toggleSelectCurrentPage} title="현재 페이지 전체 선택/해제">
                            {paginatedReports.length > 0 && paginatedReports.every(r => selectedNids.has(r.nid)) ? (
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-600" />
                            )}
                          </button>
                        </th>
                        <th className="p-3 w-28">등록일자</th>
                        <th className="p-3 w-36">종목명 (코드)</th>
                        <th className="p-3 w-28">증권사</th>
                        <th className="p-3">리포트 제목</th>
                        <th className="p-3 w-20 text-right">조회수</th>
                        <th className="p-3 w-28 text-center">첨부파일</th>
                        <th className="p-3 w-40 text-center">액션</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {paginatedReports.map((item) => {
                        const isSelected = selectedNids.has(item.nid);
                        const is2026FirstAnchor = item.is2026First || item.rawDate === '26.01.02';
                        const hasValidAttachment = item.hasPdf && item.attachment_status !== 'FAILED';

                        return (
                          <tr
                            key={item.nid}
                            className={`transition-colors ${
                              !hasValidAttachment
                                ? 'bg-amber-950/10 border-l-2 border-l-amber-500/60 hover:bg-amber-950/20'
                                : is2026FirstAnchor
                                ? 'bg-emerald-950/20 hover:bg-emerald-950/30'
                                : isSelected
                                ? 'bg-slate-800/30 hover:bg-slate-800/40'
                                : 'hover:bg-slate-800/50'
                            }`}
                          >
                            <td className="p-3 text-center">
                              <button onClick={() => toggleSelectOne(item.nid)}>
                                {isSelected ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-slate-600" />
                                )}
                              </button>
                            </td>
                            <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                              <div className="flex items-center space-x-1">
                                <span>{item.publishDate}</span>
                                {is2026FirstAnchor && (
                                  <Sparkles className="w-3 h-3 text-emerald-400" />
                                )}
                              </div>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="font-bold text-slate-100">{item.stockName}</span>
                              <span className="text-[10px] text-slate-400 font-mono ml-1.5">({item.stockCode})</span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[11px] font-semibold">
                                {item.brokerName}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center space-x-1.5">
                                {!hasValidAttachment ? (
                                  <button
                                    onClick={() => openWebArticleReader(item)}
                                    className="px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-300 text-[10px] font-bold border border-amber-800/80 shrink-0 inline-flex items-center space-x-1 hover:bg-amber-900 transition-colors"
                                    title="웹본문 내용 바로 읽기"
                                  >
                                    <BookOpen className="w-2.5 h-2.5 text-amber-400" />
                                    <span>웹본문</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => openWebArticleReader(item)}
                                    className="px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 text-[10px] font-bold border border-emerald-800/80 shrink-0 inline-flex items-center space-x-1 hover:bg-emerald-900 transition-colors"
                                    title="웹본문 내용 및 요약 읽기"
                                  >
                                    <BookOpen className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>본문/요약</span>
                                  </button>
                                )}
                                <div
                                  className="font-medium line-clamp-1 cursor-pointer text-slate-100 hover:text-emerald-300 transition-colors"
                                  onClick={() => openWebArticleReader(item)}
                                  title={`${item.reportTitle} (클릭하여 본문 및 요약 내용 읽기)`}
                                >
                                  {item.reportTitle}
                                </div>
                              </div>
                              <div className="text-[10px] font-mono truncate max-w-md mt-0.5">
                                {hasValidAttachment ? (
                                  <span className="text-slate-400 hover:text-emerald-300 cursor-pointer" onClick={() => openWebArticleReader(item)} title="클릭하여 리포트 본문 및 첨부파일 확인">
                                    {item.standardFileName}
                                  </span>
                                ) : (
                                  <span className="text-amber-400/80 cursor-pointer hover:underline" onClick={() => openWebArticleReader(item)}>
                                    HTML 웹본문 리포트 (클릭하여 본문 읽기)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-right font-mono text-emerald-400 font-bold whitespace-nowrap">
                              {item.hits.toLocaleString()}
                            </td>
                            <td className="p-3 text-center whitespace-nowrap">
                              {hasValidAttachment ? (
                                <button
                                  onClick={() => setPreviewReport(item)}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800 hover:bg-emerald-900 transition-colors cursor-pointer"
                                  title="클릭하여 PDF 바로보기"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>PDF 첨부 완료</span>
                                </button>
                              ) : item.attachment_status === 'FAILED' ? (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 text-[10px] font-semibold border border-rose-800/80" title={item.attachment_error || '첨부파일 연동 오류'}>
                                  <AlertCircle className="w-3 h-3 text-rose-400" />
                                  <span>연동 오류</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => openWebArticleReader(item)}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-[10px] font-medium border border-amber-800/80 transition-colors" 
                                  title="클릭하여 네이버 증권 웹본문 내용 읽기"
                                >
                                  <BookOpen className="w-3 h-3 text-amber-400" />
                                  <span>PDF 미첨부 (웹본문)</span>
                                </button>
                              )}
                            </td>
                            <td className="p-3 text-center whitespace-nowrap">
                              <div className="inline-flex items-center space-x-1.5">
                                {hasValidAttachment ? (
                                  <>
                                    <button
                                      onClick={() => handleDownloadSinglePdf(item)}
                                      disabled={downloadingNid === item.nid}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-950/40 transition-all inline-flex items-center space-x-1 active:scale-95 disabled:opacity-50"
                                      title="내 PC에 PDF 파일 다운로드"
                                    >
                                      <Download className={`w-3 h-3 ${downloadingNid === item.nid ? 'animate-bounce' : ''}`} />
                                      <span>{downloadingNid === item.nid ? '저장...' : 'PDF 다운로드'}</span>
                                    </button>
                                    <button
                                      onClick={() => openWebArticleReader(item)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-all"
                                      title="웹본문 텍스트 및 요약 읽기"
                                    >
                                      <BookOpen className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setPreviewReport(item)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 transition-all"
                                      title="PDF 바로보기 (스트림 뷰어)"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setSelectedReportForDetail(item)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 transition-all"
                                      title="JSON 상세 메타데이터 보기"
                                    >
                                      <Code className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => openWebArticleReader(item)}
                                      className="px-2.5 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-800 transition-all inline-flex items-center space-x-1 shadow-sm"
                                      title="네이버 증권 리포트 본문 내용 읽기"
                                    >
                                      <BookOpen className="w-3 h-3" />
                                      <span>웹본문 읽기</span>
                                    </button>
                                    <a
                                      href={item.reportUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
                                      title="네이버 증권 리포트 원문 웹페이지 열기"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    <button
                                      onClick={() => setSelectedReportForDetail(item)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 transition-all"
                                      title="JSON 상세 메타데이터 보기"
                                    >
                                      <Code className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* BOTTOM PAGINATION NAVIGATION BAR */}
          {/* ========================================================================= */}
          {hasFetchedCurrent && filteredReports.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              {/* Left: Summary & Selection Indicator */}
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <div>
                  총 <strong className="text-emerald-400 font-mono font-bold">{totalItems.toLocaleString()}</strong>건 중{' '}
                  <span className="font-mono text-slate-200 font-semibold">{totalItems > 0 ? startIndex + 1 : 0} - {endIndex}</span>건 표시
                  <span className="text-slate-500 ml-1">
                    ({safeCurrentPage} / {totalPages} 페이지)
                  </span>
                </div>

                {selectedNids.size > 0 && (
                  <span className="text-emerald-300 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 text-[11px] flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{selectedNids.size}건 선택됨</span>
                  </span>
                )}
              </div>

              {/* Center: Numeric & Arrow Navigation */}
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                {/* First Page (<<) */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={safeCurrentPage === 1}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="첫 페이지로 이동"
                >
                  <ChevronsLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Previous Page (<) */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="이전 페이지"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {pageNumbers.map((num, idx) => {
                    if (num === '...') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-600 font-mono text-xs select-none">
                          ...
                        </span>
                      );
                    }

                    const pageVal = num as number;
                    const isActive = pageVal === safeCurrentPage;

                    return (
                      <button
                        key={`page-${pageVal}`}
                        onClick={() => setCurrentPage(pageVal)}
                        className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 rounded-xl text-xs font-bold font-mono transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-500/40 scale-105'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {pageVal}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page (>) */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="다음 페이지"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Last Page (>>) */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safeCurrentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="마지막 페이지로 이동"
                >
                  <ChevronsRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Right: Page Size Selector & Direct Jump */}
              <div className="flex items-center space-x-2 text-xs">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value={10}>10개씩</option>
                  <option value={15}>15개씩</option>
                  <option value={20}>20개씩</option>
                  <option value={30}>30개씩</option>
                  <option value={50}>50개씩</option>
                  <option value={100}>100개씩</option>
                </select>

                {/* Page Jump Form */}
                <form onSubmit={handleJumpPage} className="flex items-center space-x-1">
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    placeholder={String(safeCurrentPage)}
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                    className="w-12 px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-white font-mono placeholder-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-slate-500 text-xs font-mono">/ {totalPages}</span>
                  <button
                    type="submit"
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95"
                  >
                    이동
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* INLINE PDF PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewReport && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewReport(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full h-[90vh] shadow-2xl flex flex-col overflow-hidden cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-100 text-sm truncate">{previewReport.stockName} ({previewReport.stockCode})</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-semibold border border-emerald-800">
                      {previewReport.brokerName}
                    </span>
                    <span className="text-slate-400 text-xs">{previewReport.publishDate}</span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-300 truncate">
                    {previewReport.standardFileName}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => {
                    const rep = previewReport;
                    setPreviewReport(null);
                    openWebArticleReader(rep);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-800/80 inline-flex items-center space-x-1.5 transition-all"
                  title="네이버 웹본문 텍스트 및 핵심 요약 읽기로 전환"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">본문/요약 읽기</span>
                </button>

                <a
                  href={`/api/pipeline-01/view-pdf-stream?${new URLSearchParams({
                    nid: previewReport.nid || '',
                    pdfUrl: previewReport.pdfUrl || '',
                    fileName: previewReport.standardFileName || '',
                    stockName: previewReport.stockName || '',
                    stockCode: previewReport.stockCode || '',
                    brokerName: previewReport.brokerName || '',
                    title: previewReport.reportTitle || '',
                    date: previewReport.publishDate || ''
                  }).toString()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center space-x-1.5 transition-all"
                  title="새 창에서 원본 PDF 전체화면 열기"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">새 창에서 열기</span>
                </a>

                <button
                  onClick={() => handleDownloadSinglePdf(previewReport)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-950/40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>내 PC 다운로드</span>
                </button>

                <button
                  onClick={() => setPreviewReport(null)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-900/40 text-slate-400 hover:text-rose-200 border border-slate-700/80 hover:border-rose-700/80 transition-all flex items-center justify-center"
                  title="닫기 (ESC)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Iframe PDF Body */}
            <div className="flex-1 bg-slate-950 p-2 relative">
              <iframe
                src={`/api/pipeline-01/view-pdf-stream?${new URLSearchParams({
                  nid: previewReport.nid || '',
                  pdfUrl: previewReport.pdfUrl || '',
                  fileName: previewReport.standardFileName || '',
                  stockName: previewReport.stockName || '',
                  stockCode: previewReport.stockCode || '',
                  brokerName: previewReport.brokerName || '',
                  title: previewReport.reportTitle || '',
                  date: previewReport.publishDate || ''
                }).toString()}`}
                title={previewReport.reportTitle}
                className="w-full h-full rounded-xl border border-slate-800 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAIL MODAL (JSON / METADATA VIEWER) */}
      {/* ========================================================================= */}
      {selectedReportForDetail && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReportForDetail(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-slate-100">
                  {selectedReportForDetail.stockName} - 리포트 메타데이터 상세
                </h3>
              </div>
              <button
                onClick={() => setSelectedReportForDetail(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-200 border border-slate-700/80 hover:border-rose-700/80 transition-all"
                title="닫기 (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Main Metadata Section */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <span className="font-bold text-slate-300 flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    <span>메인 메타데이터 (수집 필수 보장)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-mono border border-blue-800">
                    NID: {selectedReportForDetail.nid}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">종목명/코드</span>
                    <span className="font-bold text-slate-200">{selectedReportForDetail.stockName} ({selectedReportForDetail.stockCode})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">발행 증권사</span>
                    <span className="font-bold text-slate-200">{selectedReportForDetail.brokerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">발행일자</span>
                    <span className="font-mono text-slate-200">{selectedReportForDetail.publishDate} ({selectedReportForDetail.rawDate})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">조회수</span>
                    <span className="font-mono text-emerald-400 font-bold">{selectedReportForDetail.hits?.toLocaleString()}회</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 block text-[10px]">리포트 제목</span>
                  <p className="font-medium text-slate-200 text-xs">{selectedReportForDetail.reportTitle}</p>
                </div>
              </div>

              {/* Attachment File Section with Graceful Degradation */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <span className="font-bold text-slate-300 flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>첨부 파일 데이터 (Graceful Degradation 분리)</span>
                  </span>
                  <div>
                    {selectedReportForDetail.attachment_status === 'SUCCESS' || (selectedReportForDetail.hasPdf && !selectedReportForDetail.attachment_status) ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>attachment_status: "SUCCESS"</span>
                      </span>
                    ) : selectedReportForDetail.attachment_status === 'FAILED' ? (
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-800 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                        <span>attachment_status: "FAILED"</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800 flex items-center space-x-1">
                        <Info className="w-3 h-3 text-amber-400" />
                        <span>attachment_status: "NOT_FOUND"</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">PDF 파일 존재 여부 (hasPdf)</span>
                    <span className="font-mono font-bold text-slate-200">
                      {selectedReportForDetail.hasPdf ? 'true (첨부파일 확보)' : 'false (첨부 없음/웹본문)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">파일 크기 / 다운로드 상태</span>
                    <span className="font-mono text-slate-200">
                      {selectedReportForDetail.fileSizeBytes ? `${(selectedReportForDetail.fileSizeBytes / 1024).toFixed(1)} KB` : '0 KB (미첨부)'}
                    </span>
                  </div>
                </div>

                {selectedReportForDetail.attachment_error && (
                  <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 text-[11px]">
                    <span className="font-bold">첨부 상태 안내: </span>
                    <span>{selectedReportForDetail.attachment_error}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-500 block mb-0.5">표준 파일명 규칙</span>
                  <span className="font-mono text-emerald-400 break-all text-[11px]">{selectedReportForDetail.standardFileName}</span>
                </div>
              </div>

              {/* JSON Output Viewer */}
              <div>
                <span className="text-slate-400 font-semibold block mb-1.5 flex items-center justify-between">
                  <span>추출 JSON 스키마 (Main & Attachment 분리):</span>
                  <span className="text-[10px] text-slate-500 font-mono">파이프라인_01 규격</span>
                </span>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-52">
                  {JSON.stringify({
                    nid: selectedReportForDetail.nid,
                    stockName: selectedReportForDetail.stockName,
                    stockCode: selectedReportForDetail.stockCode,
                    reportTitle: selectedReportForDetail.reportTitle,
                    brokerName: selectedReportForDetail.brokerName,
                    rawDate: selectedReportForDetail.rawDate,
                    publishDate: selectedReportForDetail.publishDate,
                    yymmdd: selectedReportForDetail.yymmdd,
                    month: selectedReportForDetail.month || selectedReportForDetail.publishDate?.slice(0, 7) || '2026-01',
                    hits: selectedReportForDetail.hits,
                    pdfUrl: selectedReportForDetail.pdfUrl || '',
                    hasPdf: selectedReportForDetail.hasPdf,
                    attachment_status: selectedReportForDetail.attachment_status || (selectedReportForDetail.hasPdf ? 'SUCCESS' : 'NOT_FOUND'),
                    attachment_error: selectedReportForDetail.attachment_error !== undefined ? selectedReportForDetail.attachment_error : (selectedReportForDetail.hasPdf ? null : '첨부 PDF 파일 링크가 존재하지 않음 (HTML 본문 전용 또는 미등재)'),
                    reportUrl: selectedReportForDetail.reportUrl,
                    standardFileName: selectedReportForDetail.standardFileName,
                    is2026First: Boolean(selectedReportForDetail.is2026First),
                    isEarliestOf2026: Boolean(selectedReportForDetail.isEarliestOf2026),
                    dataSourceCategory: selectedReportForDetail.dataSourceCategory || '네이버 증권 > 리서치 > 종목분석 리포트',
                    dataSourceUrl: selectedReportForDetail.dataSourceUrl || 'https://finance.naver.com/research/company_list.naver',
                    isDownloaded: selectedReportForDetail.isDownloaded !== undefined ? selectedReportForDetail.isDownloaded : selectedReportForDetail.hasPdf,
                    fileSizeBytes: selectedReportForDetail.fileSizeBytes || (selectedReportForDetail.hasPdf ? 1353972 : 0)
                  }, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="text-[11px] text-slate-500">
                <span className="text-slate-400">ESC</span> 키 또는 바깥 영역 클릭으로 닫을 수 있습니다.
              </div>
              <div className="flex items-center space-x-2">
                {selectedReportForDetail.hasPdf && (
                  <button
                    onClick={() => handleDownloadSinglePdf(selectedReportForDetail)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-950/40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF 다운로드</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    const rep = selectedReportForDetail;
                    setSelectedReportForDetail(null);
                    openWebArticleReader(rep);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-md shadow-amber-950/40"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>웹본문 리더로 읽기</span>
                </button>
                <button
                  onClick={() => setSelectedReportForDetail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 차분 안전 DB & AI 스키마 관리 (SAFE DIFF DATABASE & AI-READY SYNC) */}
      {/* ========================================================================= */}
      {activeTab === 'database' && (
        <Pipeline01DatabaseStorage
          currentReports={reports}
          selectedMonth={selectedMonth}
          onSyncComplete={(result) => {
            fetchOverviewStats();
          }}
          onViewReportArticle={(rep) => {
            openWebArticleReader(rep as any);
          }}
          onDownloadPdf={(rep) => {
            handleDownloadSinglePdf(rep as any);
          }}
          onViewPdfStream={(rep) => {
            setPreviewReport(rep as any);
          }}
          onOpenExternalUrl={(url) => {
            window.open(url, '_blank');
          }}
        />
      )}
      {/* ========================================================================= */}
      {readingWebArticleReport && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setReadingWebArticleReport(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden cursor-default"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/90 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {readingWebArticleReport.hasPdf ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 text-emerald-300 text-xs font-bold border border-emerald-800/80 inline-flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>리포트 본문 & PDF 첨부 허브</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-950/90 text-amber-300 text-xs font-bold border border-amber-800/80 inline-flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>HTML 웹본문 리포트 리더</span>
                    </span>
                  )}
                  <span className="font-bold text-slate-100 text-sm sm:text-base">
                    {readingWebArticleReport.stockName}
                  </span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {readingWebArticleReport.stockCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-xs font-semibold">
                    {readingWebArticleReport.brokerName}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>발행일자: {readingWebArticleReport.publishDate}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>조회수: <strong className="text-emerald-400 font-mono">{readingWebArticleReport.hits.toLocaleString()}</strong>회</span>
                  </span>
                  <span>•</span>
                  <span className="text-[11px] font-mono text-slate-500">NID: {readingWebArticleReport.nid}</span>
                </div>
              </div>

              <button
                onClick={() => setReadingWebArticleReport(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700 transition-all shrink-0"
                title="닫기 (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
              {/* PDF Attachment Showcase Card if PDF is available */}
              {readingWebArticleReport.hasPdf ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-700/70 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-900/90 text-emerald-200 text-[10px] font-bold border border-emerald-600 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                        <span>정식 애널리스트 PDF 첨부파일 보유</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {readingWebArticleReport.fileSizeBytes ? `${(readingWebArticleReport.fileSizeBytes / 1024).toFixed(0)} KB` : 'PDF 리포트'}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-emerald-300 font-bold truncate" title={readingWebArticleReport.standardFileName}>
                      {readingWebArticleReport.standardFileName}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleDownloadSinglePdf(readingWebArticleReport)}
                      disabled={downloadingNid === readingWebArticleReport.nid}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/60 transition-all active:scale-95 disabled:opacity-50"
                      title="내 PC에 표준 파일명으로 다운로드"
                    >
                      <Download className={`w-3.5 h-3.5 ${downloadingNid === readingWebArticleReport.nid ? 'animate-bounce' : ''}`} />
                      <span>{downloadingNid === readingWebArticleReport.nid ? '다운로드 중...' : 'PDF 첨부파일 다운로드'}</span>
                    </button>
                    <button
                      onClick={() => {
                        const rep = readingWebArticleReport;
                        setReadingWebArticleReport(null);
                        setPreviewReport(rep);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-emerald-800/80 inline-flex items-center justify-center space-x-1.5 transition-all"
                      title="스트림 PDF 뷰어로 전환"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>PDF 뷰어</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between text-xs text-amber-300">
                  <div className="flex items-center space-x-2">
                    <FileMinus className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>네이버 증권에 별도 PDF 파일이 등재되지 않은 웹본문 리포트입니다. 전문과 핵심 포인트를 바로 확인하실 수 있습니다.</span>
                  </div>
                  <a
                    href={readingWebArticleReport.reportUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline font-bold text-[11px] shrink-0 ml-2"
                  >
                    네이버 원문 ↗
                  </a>
                </div>
              )}

              {isLoadingArticle ? (
                /* Loading Skeleton */
                <div className="space-y-5 py-8 animate-pulse">
                  <div className="h-7 bg-slate-800 rounded-lg w-3/4"></div>
                  <div className="flex items-center space-x-3">
                    <div className="h-4 bg-slate-800 rounded w-24"></div>
                    <div className="h-4 bg-slate-800 rounded w-32"></div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-slate-800/80">
                    <div className="h-20 bg-slate-800/60 rounded-xl"></div>
                    <div className="h-28 bg-slate-800/40 rounded-xl"></div>
                    <div className="h-16 bg-slate-800/30 rounded-xl"></div>
                  </div>
                  <div className="text-center text-xs text-amber-400/80 pt-4 flex items-center justify-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>네이버 증권 서버에서 리포트 본문과 투자 포인트를 실시간으로 추출 중입니다...</span>
                  </div>
                </div>
              ) : articleError ? (
                /* Error State */
                <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-center space-y-4">
                  <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-rose-200 text-sm">본문 내용을 불러올 수 없습니다</h4>
                    <p className="text-xs text-rose-300/80">{articleError}</p>
                  </div>
                  <div className="pt-2">
                    <a
                      href={readingWebArticleReport.reportUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 inline-flex items-center space-x-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>네이버 증권 원문 페이지 직접 열기</span>
                    </a>
                  </div>
                </div>
              ) : webArticleData ? (
                /* Full Article Content */
                <div className="space-y-5">
                  {/* Article Title Banner */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>리서치 리포트 제목</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {webArticleData.characterCount.toLocaleString()}자 / {webArticleData.paragraphCount}개 단락
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 leading-snug tracking-tight">
                      {webArticleData.reportTitle || readingWebArticleReport.reportTitle}
                    </h2>
                  </div>

                  {/* Summary & Body Paragraphs */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>리포트 본문 및 핵심 분석 내용</span>
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>네이버 증권 원문 실시간 연동</span>
                      </span>
                    </div>

                    {webArticleData.paragraphs.map((para, idx) => {
                      const isFirst = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl leading-relaxed text-sm transition-colors ${
                            isFirst
                              ? 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-800/40 text-amber-100 font-medium'
                              : 'bg-slate-950/60 border border-slate-800/80 text-slate-200'
                          }`}
                        >
                          {isFirst && (
                            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 mb-1.5 flex items-center space-x-1">
                              <span>KEY POINT / 요약</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{para}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                {readingWebArticleReport.hasPdf && (
                  <>
                    <button
                      onClick={() => handleDownloadSinglePdf(readingWebArticleReport)}
                      disabled={downloadingNid === readingWebArticleReport.nid}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-950/50 active:scale-95 disabled:opacity-50"
                      title="표준 파일명으로 PDF 파일 다운로드"
                    >
                      <Download className={`w-3.5 h-3.5 ${downloadingNid === readingWebArticleReport.nid ? 'animate-bounce' : ''}`} />
                      <span>{downloadingNid === readingWebArticleReport.nid ? '다운로드 중...' : 'PDF 다운로드'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const rep = readingWebArticleReport;
                        setReadingWebArticleReport(null);
                        setPreviewReport(rep);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-emerald-800/80 inline-flex items-center space-x-1.5 transition-all"
                      title="PDF 스트림 뷰어로 보기"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>PDF 뷰어</span>
                    </button>
                  </>
                )}

                <button
                  onClick={handleCopyArticleContent}
                  disabled={!webArticleData || isLoadingArticle}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 inline-flex items-center space-x-1.5 transition-all disabled:opacity-50 active:scale-95"
                  title="본문 텍스트를 클립보드에 복사"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-semibold">복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>본문 복사</span>
                    </>
                  )}
                </button>

                <a
                  href={readingWebArticleReport.reportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 inline-flex items-center space-x-1.5 transition-all"
                  title="네이버 증권 원문 페이지 새 창으로 열기"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>네이버 원문 보기</span>
                </a>
              </div>

              <button
                onClick={() => setReadingWebArticleReport(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
