import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  FileText,
  Download,
  ExternalLink,
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
  Layers,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  FileMinus,
  BookOpen,
  Copy,
  Check,
  FolderDown,
  ArrowRight,
  Tag,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  PieChart,
  ChevronDown,
  ChevronUp,
  Building2,
  ShieldCheck
} from 'lucide-react';
import {
  STANDARD_12_SECTORS,
  SectorCategory,
  getCanonicalSector,
  isSectorMatch,
  Pipeline01NaverReport
} from '../types';
import { classifyKrxStockSector } from '../utils/sectorClassifier';
import { DartDisclosureSection } from './DartDisclosureSection';

export const SECTOR_STYLES: Record<string, { badge: string; border: string; dot: string; text: string; bg: string }> = {
  '반도체/디스플레이': { badge: 'bg-blue-950/80 text-blue-300 border-blue-800/80 hover:bg-blue-900/80', border: 'border-blue-500/40', dot: 'bg-blue-400', text: 'text-blue-400', bg: 'bg-blue-500/10' },
  '2차전지/배터리/소재': { badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/80', border: 'border-emerald-500/40', dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  '바이오/제약/헬스케어': { badge: 'bg-purple-950/80 text-purple-300 border-purple-800/80 hover:bg-purple-900/80', border: 'border-purple-500/40', dot: 'bg-purple-400', text: 'text-purple-400', bg: 'bg-purple-500/10' },
  '자동차/모빌리티': { badge: 'bg-amber-950/80 text-amber-300 border-amber-800/80 hover:bg-amber-900/80', border: 'border-amber-500/40', dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  '조선/중공업/방산': { badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80 hover:bg-cyan-900/80', border: 'border-cyan-500/40', dot: 'bg-cyan-400', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  'IT/모바일/전자': { badge: 'bg-sky-950/80 text-sky-300 border-sky-800/80 hover:bg-sky-900/80', border: 'border-sky-500/40', dot: 'bg-sky-400', text: 'text-sky-400', bg: 'bg-sky-500/10' },
  '플랫폼/게임/엔터': { badge: 'bg-rose-950/80 text-rose-300 border-rose-800/80 hover:bg-rose-900/80', border: 'border-rose-500/40', dot: 'bg-rose-400', text: 'text-rose-400', bg: 'bg-rose-500/10' },
  '금융/지주': { badge: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80 hover:bg-indigo-900/80', border: 'border-indigo-500/40', dot: 'bg-indigo-400', text: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  '화학/정유/에너지': { badge: 'bg-orange-950/80 text-orange-300 border-orange-800/80 hover:bg-orange-900/80', border: 'border-orange-500/40', dot: 'bg-orange-400', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  '철강/금속/소재': { badge: 'bg-teal-950/80 text-teal-300 border-teal-800/80 hover:bg-teal-900/80', border: 'border-teal-500/40', dot: 'bg-teal-400', text: 'text-teal-400', bg: 'bg-teal-500/10' },
  '소비재/유통/음식료': { badge: 'bg-lime-950/80 text-lime-300 border-lime-800/80 hover:bg-lime-900/80', border: 'border-lime-500/40', dot: 'bg-lime-400', text: 'text-lime-400', bg: 'bg-lime-500/10' },
  '건설/물류/기타': { badge: 'bg-stone-950/80 text-stone-300 border-stone-800/80 hover:bg-stone-900/80', border: 'border-stone-500/40', dot: 'bg-stone-400', text: 'text-stone-400', bg: 'bg-stone-500/10' },
  '섹터 구분 필요': { badge: 'bg-red-950/80 text-red-300 border-red-800/80 hover:bg-red-900/80', border: 'border-red-500/40', dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10' },
};

interface AnalystReportLookup01Props {
  onNavigateToAnalysis?: () => void;
  onNavigateToExplorer?: () => void;
  onNavigateToPipeline01?: () => void;
}

export const AnalystReportLookup01: React.FC<AnalystReportLookup01Props> = ({
  onNavigateToAnalysis,
  onNavigateToExplorer,
  onNavigateToPipeline01,
}) => {
  // Target Month / Scope Mode
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-01');
  const [mode, setMode] = useState<'monthly' | 'all_2026' | '2026_first'>('monthly');

  // Loaded Reports Data
  const [reports, setReports] = useState<Pipeline01NaverReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters and Controls
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [brokerFilter, setBrokerFilter] = useState<string>('ALL');
  const [attachmentFilter, setAttachmentFilter] = useState<'ALL' | 'PDF_ONLY' | 'NO_PDF'>('ALL');
  const [sortOption, setSortOption] = useState<'default' | 'earliest' | 'hits' | 'name'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedNids, setSelectedNids] = useState<Set<string>>(new Set());
  const [showSectorOverview, setShowSectorOverview] = useState<boolean>(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Action / Modal States
  const [downloadingNid, setDownloadingNid] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [selectedReportForDetail, setSelectedReportForDetail] = useState<Pipeline01NaverReport | null>(null);
  const [selectedDartReport, setSelectedDartReport] = useState<Pipeline01NaverReport | null>(null);
  const [previewReport, setPreviewReport] = useState<Pipeline01NaverReport | null>(null);
  const [previewPdfType, setPreviewPdfType] = useState<'original' | 'ai_generated'>('original');

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

  // DB Origin & Smart Fallback Status State
  const [dataOrigin, setDataOrigin] = useState<{
    isDb: boolean;
    message: string;
    count: number;
    syncedAt?: string;
  }>({
    isDb: false,
    message: '데이터 소스 확인 중...',
    count: 0
  });
  const [isSyncingLiveToDb, setIsSyncingLiveToDb] = useState<boolean>(false);

  // Month Definitions and Dynamic Counts State
  const [monthCountsMap, setMonthCountsMap] = useState<Record<string, { count: number; label: string; isVerified: boolean; badge: string }>>({
    '2026-01': { count: 815, label: '2026년 1월', isVerified: true, badge: '1월 전수' },
    '2026-02': { count: 720, label: '2026년 2월 전수', isVerified: true, badge: '2월 전수' },
    '2026-03': { count: 993, label: '2026년 3월 전수', isVerified: true, badge: '3월 전수' },
    '2026-04': { count: 780, label: '2026년 4월', isVerified: true, badge: '어닝' },
    '2026-05': { count: 750, label: '2026년 5월', isVerified: true, badge: '리뷰' },
    '2026-06': { count: 810, label: '2026년 6월', isVerified: true, badge: '상반기' },
    'all_2026': { count: 4868, label: '2026 상반기 전체', isVerified: true, badge: '상반기종합' },
  });

  // Dynamic Months List generated from current state
  const MONTHS_LIST = useMemo(() => {
    return [
      { key: '2026-01', label: '2026년 1월', count: `${monthCountsMap['2026-01']?.count || 815}건 (실측전수)`, badge: '1월 전수' },
      { key: '2026-02', label: '2026년 2월 전수', count: `${monthCountsMap['2026-02']?.count || 720}건 (실측전수)`, badge: '2월 전수' },
      { key: '2026-03', label: '2026년 3월 전수', count: `${monthCountsMap['2026-03']?.count || 993}건 (실측전수)`, badge: '3월 전수' },
      { key: '2026-04', label: '2026년 4월', count: `${monthCountsMap['2026-04']?.count || 780}건 (실측전수)`, badge: '어닝' },
      { key: '2026-05', label: '2026년 5월', count: `${monthCountsMap['2026-05']?.count || 750}건 (실측전수)`, badge: '리뷰' },
      { key: '2026-06', label: '2026년 6월', count: `${monthCountsMap['2026-06']?.count || 810}건 (실측전수)`, badge: '상반기' },
      { key: 'all_2026', label: '2026 상반기 전체', count: `${monthCountsMap['all_2026']?.count || 4868}건 (상반기종합)`, badge: '상반기종합' },
    ];
  }, [monthCountsMap]);

  // Fetch DB storage stats to synchronize actual stored report counts per month
  const refreshDbStatsCounts = async () => {
    try {
      const res = await fetch('/api/pipeline-01/db/stats');
      const data = await res.json();
      if (data.success && data.stats?.monthlyBreakdown) {
        const breakdown = data.stats.monthlyBreakdown;
        setMonthCountsMap(prev => {
          const next = { ...prev };
          let totalAll = 0;
          Object.keys(breakdown).forEach(m => {
            const mTotal = breakdown[m]?.total || 0;
            if (mTotal > 0) {
              totalAll += mTotal;
              next[m] = {
                count: mTotal,
                label: `2026년 ${parseInt(m.split('-')[1], 10)}월 전수`,
                isVerified: true,
                badge: `${parseInt(m.split('-')[1], 10)}월 전수`
              };
            }
          });
          if (totalAll > 0) {
            next['all_2026'] = {
              count: totalAll,
              label: '2026 연간 전체',
              isVerified: true,
              badge: '연간종합'
            };
          }
          return next;
        });
      }
    } catch (e) {
      console.warn('Failed to refresh DB stats counts:', e);
    }
  };

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

  // Converter: DB Master Record -> Pipeline01NaverReport with Automatic KRX Standard Sector Classification
  const dbRecordToReport = (r: any): Pipeline01NaverReport => {
    const nid = r.nid || (r.id ? String(r.id).replace('rep_', '') : '0');
    const stockName = r.stockName || '종목';
    const stockCode = r.stockCode || '000000';

    // Sector resolution:
    // If r.sector is already a canonical sector and not generic, use it; otherwise classify via KRX stock database
    let resolvedSector = '섹터 구분 필요';
    if (r.sector && r.sector !== '기타' && r.sector !== '기업분석' && r.sector !== '미분류' && r.sector !== '섹터 구분 필요') {
      resolvedSector = getCanonicalSector(r.sector);
    } else {
      resolvedSector = classifyKrxStockSector(stockName, stockCode);
    }

    return {
      nid,
      stockName,
      stockCode,
      sector: resolvedSector,
      reportTitle: r.reportTitle || `${stockName} 종목분석`,
      brokerName: r.brokerName || '증권사',
      analystName: r.analystName || '리서치센터',
      publishDate: r.publishDate || '2026-01-02',
      rawDate: r.rawDate || r.publishDate || '26.01.02',
      yymmdd: r.yymmdd || (r.publishDate ? r.publishDate.replace(/[-.]/g, '').slice(2, 8) : '260102'),
      month: r.month || (r.publishDate ? r.publishDate.slice(0, 7) : '2026-01'),
      targetPrice: r.targetPrice || 0,
      currentPrice: r.currentPrice || 0,
      investmentOpinion: r.investmentOpinion || 'BUY',
      hits: r.hits || 0,
      hasPdf: Boolean(r.hasPdf),
      pdfUrl: r.pdfUrl || '',
      reportUrl: r.reportUrl || `https://finance.naver.com/research/company_read.naver?nid=${nid}`,
      standardFileName: r.standardFileName || `${r.yymmdd || '260102'}_${r.brokerName || '증권사'}_${stockName}.pdf`,
      attachment_status: r.hasPdf ? 'SUCCESS' : 'NOT_FOUND',
      bodyText: r.bodyText || '',
      paragraphs: r.paragraphs || [],
      characterCount: r.characterCount || 0
    };
  };

  // Smart Fallback Fetch Engine
  const fetchReports = async (monthVal = selectedMonth, modeVal = mode, forceLive = false) => {
    setIsLoading(true);
    setError(null);
    setDownloadSuccessMessage(null);

    try {
      // 1순위: DB 우선 로딩 (forceLive가 아닐 경우 DB에서 밀리초 단위로 조회)
      if (!forceLive) {
        try {
          const dbUrl = `/api/pipeline-01/db/records?month=${modeVal === 'all_2026' ? 'ALL' : monthVal}&limit=2000`;
          const dbRes = await fetch(dbUrl);
          const dbData = await dbRes.json();

          if (dbData.success && Array.isArray(dbData.records) && dbData.records.length > 0) {
            const mapped = dbData.records.map(dbRecordToReport);
            setReports(mapped);
            setSelectedNids(new Set<string>(mapped.map((r: Pipeline01NaverReport) => r.nid)));
            setCurrentPage(1);

            // Update dynamic month counts map with loaded record count
            setMonthCountsMap(prev => ({
              ...prev,
              [monthVal]: {
                count: mapped.length,
                label: modeVal === 'all_2026' ? '2026 연간 전체' : `2026년 ${parseInt(monthVal.split('-')[1] || '1', 10)}월 전수`,
                isVerified: true,
                badge: `${parseInt(monthVal.split('-')[1] || '1', 10)}월 전수`
              }
            }));

            setDataOrigin({
              isDb: true,
              message: `⚡ [DB 초고속 로드] 데이터베이스에서 ${mapped.length}건을 즉시 조회했습니다.`,
              count: mapped.length,
              syncedAt: new Date().toLocaleTimeString('ko-KR')
            });

            // Cache in LocalStorage
            try {
              const cacheKey = modeVal === 'all_2026' ? 'all_2026' : monthVal;
              const saved = localStorage.getItem('pipeline01_reports_cache');
              const cacheObj = saved ? JSON.parse(saved) : {};
              cacheObj[cacheKey] = mapped;
              localStorage.setItem('pipeline01_reports_cache', JSON.stringify(cacheObj));
            } catch (e) {}

            setIsLoading(false);
            refreshDbStatsCounts();
            return;
          }
        } catch (dbErr) {
          console.warn('DB query missed or error, executing Smart Fallback to live fetch:', dbErr);
        }
      }

      // 2순위: SMART FALLBACK (DB 부재/미동기화 시 live 수집 후 DB에 백필 저장)
      setIsSyncingLiveToDb(true);
      let liveUrl = `/api/pipeline-01/naver-reports?depth=full`;
      if (modeVal === 'all_2026') {
        liveUrl += `&mode=all_2026`;
      } else if (modeVal === '2026_first') {
        liveUrl += `&mode=2026_first`;
      } else {
        liveUrl += `&mode=monthly&month=${monthVal}`;
      }

      const res = await fetch(liveUrl);
      const data = await res.json();

      if (data.success && Array.isArray(data.reports)) {
        const mappedReports: Pipeline01NaverReport[] = data.reports.map((r: any) => {
          let resolvedSector = '섹터 구분 필요';
          if (r.sector && r.sector !== '기타' && r.sector !== '기업분석' && r.sector !== '미분류' && r.sector !== '섹터 구분 필요') {
            resolvedSector = getCanonicalSector(r.sector);
          } else {
            resolvedSector = classifyKrxStockSector(r.stockName || '', r.stockCode || '');
          }
          return {
            ...r,
            sector: resolvedSector
          };
        });

        setReports(mappedReports);
        setSelectedNids(new Set<string>(mappedReports.map((r: Pipeline01NaverReport) => r.nid)));
        setCurrentPage(1);

        // Update dynamic month counts map with live count
        setMonthCountsMap(prev => ({
          ...prev,
          [monthVal]: {
            count: mappedReports.length,
            label: modeVal === 'all_2026' ? '2026 연간 전체' : `2026년 ${parseInt(monthVal.split('-')[1] || '1', 10)}월 전수`,
            isVerified: true,
            badge: `${parseInt(monthVal.split('-')[1] || '1', 10)}월 전수`
          }
        }));

        // DB에 자동 백필 (Backfill) 동기화 실행
        try {
          const syncRes = await fetch('/api/pipeline-01/db/sync-reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reports: mappedReports,
              month: monthVal
            })
          });
          const syncData = await syncRes.json();
          const syncSummary = syncData.success 
            ? `(DB 자동 동기화: 신규 ${syncData.insertedCount}건, 갱신 ${syncData.updatedCount}건)`
            : '';

          setDataOrigin({
            isDb: false,
            message: `🔄 [Smart Fallback: Live 수집 & DB 백필 완료] ${mappedReports.length}건 원천 수집 후 DB에 저장했습니다 ${syncSummary}`,
            count: mappedReports.length,
            syncedAt: new Date().toLocaleTimeString('ko-KR')
          });
          refreshDbStatsCounts();
        } catch (syncErr) {
          setDataOrigin({
            isDb: false,
            message: `🔄 [Live 원천 수집 완료] ${mappedReports.length}건 데이터를 원천에서 불러왔습니다.`,
            count: mappedReports.length,
            syncedAt: new Date().toLocaleTimeString('ko-KR')
          });
        }

        // Cache into local storage
        try {
          const cacheKey = modeVal === 'all_2026' ? 'all_2026' : monthVal;
          const saved = localStorage.getItem('pipeline01_reports_cache');
          const cacheObj = saved ? JSON.parse(saved) : {};
          cacheObj[cacheKey] = mappedReports;
          localStorage.setItem('pipeline01_reports_cache', JSON.stringify(cacheObj));
        } catch (e) {}

      } else {
        setError(data.error || '리포트 데이터를 불러오지 못했습니다.');
      }
    } catch (err: any) {
      console.error('Report fetch error:', err);
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setIsSyncingLiveToDb(false);
    }
  };

  // Manual DB Sync Handler for user
  const handleManualSyncToDb = async () => {
    if (!reports || reports.length === 0) return;
    setIsSyncingLiveToDb(true);
    try {
      const res = await fetch('/api/pipeline-01/db/sync-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reports: reports,
          month: selectedMonth
        })
      });
      const data = await res.json();
      if (data.success) {
        setDownloadSuccessMessage(`🗄️ [DB 저장 & 동기화 완료] 총 ${data.totalChecked}건 중 신규 저장 ${data.insertedCount}건, 변경 업데이트 ${data.updatedCount}건, 유지 ${data.skippedCount}건이 DB에 안착되었습니다.`);
        setDataOrigin({
          isDb: true,
          message: `⚡ [DB 동기화 완료] 최신 ${reports.length}건 데이터가 DB와 완벽하게 연결되었습니다.`,
          count: reports.length,
          syncedAt: new Date().toLocaleTimeString('ko-KR')
        });
        // Update monthCountsMap
        setMonthCountsMap(prev => ({
          ...prev,
          [selectedMonth]: {
            count: reports.length,
            label: mode === 'all_2026' ? '2026 연간 전체' : `2026년 ${parseInt(selectedMonth.split('-')[1] || '1', 10)}월 전수`,
            isVerified: true,
            badge: `${parseInt(selectedMonth.split('-')[1] || '1', 10)}월 전수`
          }
        }));
        refreshDbStatsCounts();
      } else {
        alert(data.error || 'DB 동기화에 실패했습니다.');
      }
    } catch (e: any) {
      alert(e.message || 'DB 동기화 요청 중 오류가 발생했습니다.');
    } finally {
      setIsSyncingLiveToDb(false);
    }
  };

  // Initial load
  useEffect(() => {
    refreshDbStatsCounts();

    // Check localStorage cache first
    try {
      const saved = localStorage.getItem('pipeline01_reports_cache');
      if (saved) {
        const cacheObj = JSON.parse(saved);
        if (cacheObj['2026-01'] && cacheObj['2026-01'].length > 0) {
          const cachedReports = cacheObj['2026-01'].map((r: any) => ({
            ...r,
            sector: (r.sector && r.sector !== '기타' && r.sector !== '기업분석' && r.sector !== '미분류' && r.sector !== '섹터 구분 필요')
              ? getCanonicalSector(r.sector)
              : classifyKrxStockSector(r.stockName || '', r.stockCode || '')
          }));
          setReports(cachedReports);
          setSelectedNids(new Set(cachedReports.map((r: Pipeline01NaverReport) => r.nid)));
          // If cached data is slightly less than 815, refresh in background
          if (cachedReports.length < 815) {
            fetchReports('2026-01', 'monthly');
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }

    // Default fetch 2026-01 full dataset
    fetchReports('2026-01', 'monthly');
  }, []);

  // Handle Month / Mode Change
  const handleSelectMonth = (mKey: string) => {
    if (mKey === 'all_2026') {
      setMode('all_2026');
      fetchReports('2026-01', 'all_2026');
    } else {
      setMode('monthly');
      setSelectedMonth(mKey);
      fetchReports(mKey, 'monthly');
      const mNum = parseInt(mKey.split('-')[1] || '1', 10);
      setDownloadSuccessMessage(`⚡ [2026년 ${mNum}월 조회 실행] 네이버 증권 ${mNum}월 종목분석 리포트 데이터를 불러왔습니다.`);
    }
  };

  // Unique Brokers List
  const brokersList = useMemo(() => {
    const set = new Set<string>();
    reports.forEach(r => {
      if (r.brokerName) set.add(r.brokerName);
    });
    return Array.from(set).sort();
  }, [reports]);

  // Sector Counts & Distribution calculation
  const sectorDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    STANDARD_12_SECTORS.forEach(sec => {
      counts[sec] = 0;
    });
    counts['섹터 구분 필요'] = 0;

    reports.forEach(r => {
      const sec = r.sector || classifyKrxStockSector(r.stockName, r.stockCode);
      const canonical = getCanonicalSector(sec);
      if (counts[canonical] !== undefined) {
        counts[canonical]++;
      } else {
        counts['섹터 구분 필요'] = (counts['섹터 구분 필요'] || 0) + 1;
      }
    });

    return counts;
  }, [reports]);

  // Total unclassified reports count
  const unclassifiedSectorCount = sectorDistribution['섹터 구분 필요'] || 0;

  // Attachment Counts
  const pdfCount = useMemo(() => reports.filter(r => r.hasPdf && r.attachment_status !== 'FAILED').length, [reports]);
  const noPdfCount = useMemo(() => reports.filter(r => !r.hasPdf || r.attachment_status === 'FAILED').length, [reports]);

  // Filtered and Sorted Reports
  const filteredReports = useMemo(() => {
    let result = [...reports];

    // 1. Sector Filter (12대 표준 대분류 및 섹터 구분 필요)
    if (sectorFilter !== 'ALL') {
      result = result.filter(r => isSectorMatch(r.sector, sectorFilter));
    }

    // 2. Attachment Filter
    if (attachmentFilter === 'PDF_ONLY') {
      result = result.filter(r => r.hasPdf && r.attachment_status !== 'FAILED');
    } else if (attachmentFilter === 'NO_PDF') {
      result = result.filter(r => !r.hasPdf || r.attachment_status === 'FAILED');
    }

    // 3. Broker Filter
    if (brokerFilter !== 'ALL') {
      result = result.filter(r => r.brokerName === brokerFilter);
    }

    // 4. Search Term (Stock name, stock code, report title, broker, sector, filename)
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(r =>
        (r.stockName && r.stockName.toLowerCase().includes(q)) ||
        (r.stockCode && r.stockCode.toLowerCase().includes(q)) ||
        (r.reportTitle && r.reportTitle.toLowerCase().includes(q)) ||
        (r.brokerName && r.brokerName.toLowerCase().includes(q)) ||
        (r.sector && r.sector.toLowerCase().includes(q)) ||
        (r.standardFileName && r.standardFileName.toLowerCase().includes(q))
      );
    }

    // 5. Sorting
    result.sort((a, b) => {
      if (sortOption === 'earliest') {
        return (a.publishDate || '').localeCompare(b.publishDate || '');
      }
      if (sortOption === 'hits') {
        return (b.hits || 0) - (a.hits || 0);
      }
      if (sortOption === 'name') {
        return (a.stockName || '').localeCompare(b.stockName || '', 'ko');
      }
      // Default: publishDate desc, then nid desc
      const dateCmp = (b.publishDate || '').localeCompare(a.publishDate || '');
      if (dateCmp !== 0) return dateCmp;
      return parseInt(b.nid || '0', 10) - parseInt(a.nid || '0', 10);
    });

    return result;
  }, [reports, sectorFilter, attachmentFilter, brokerFilter, searchTerm, sortOption]);

  // Pagination Calculation
  const totalItems = filteredReports.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedReports = useMemo(() => {
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, startIndex, endIndex]);

  // Page Numbers List
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safeCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (safeCurrentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages);
      }
    }
    return pages;
  }, [totalPages, safeCurrentPage]);

  // Selection Handlers
  const toggleSelectOne = (nid: string) => {
    setSelectedNids(prev => {
      const next = new Set(prev);
      if (next.has(nid)) next.delete(nid);
      else next.add(nid);
      return next;
    });
  };

  const toggleSelectCurrentPage = () => {
    const pageNids = paginatedReports.map(r => r.nid);
    const allPageSelected = pageNids.every(id => selectedNids.has(id));

    setSelectedNids(prev => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageNids.forEach(id => next.delete(id));
      } else {
        pageNids.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedNids.size === filteredReports.length && filteredReports.length > 0) {
      setSelectedNids(new Set());
    } else {
      setSelectedNids(new Set(filteredReports.map(r => r.nid)));
    }
  };

  const clearSelection = () => {
    setSelectedNids(new Set());
  };

  // Open Web Article Reader Modal
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

  // Copy Article Text to Clipboard
  const handleCopyArticleContent = () => {
    if (!webArticleData) return;
    const textToCopy = `[${webArticleData.brokerName}] ${webArticleData.stockName} - ${webArticleData.reportTitle} (${webArticleData.publishDate})\n\n${webArticleData.bodyText}\n\n출처: 네이버 증권 (${webArticleData.reportUrl})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    });
  };

  // Direct Single PDF Download (Supports both Original Broker PDF & AI Result PDF)
  const handleDownloadSinglePdf = async (report: Pipeline01NaverReport, pdfType: 'original' | 'ai_generated' = 'original') => {
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
        yymmdd: report.yymmdd || '260228',
        targetPrice: String(report.targetPrice || 0),
        currentPrice: String(report.currentPrice || 0),
        investmentOpinion: report.investmentOpinion || '',
        sector: report.sector || '',
        analystName: report.analystName || '',
        type: pdfType
      });
      const downloadStreamUrl = `/api/pipeline-01/download-pdf-stream?${params.toString()}`;

      const res = await fetch(downloadStreamUrl);
      if (!res.ok) {
        throw new Error(`다운로드 응답 오류 (${res.status})`);
      }

      let fileNameToSave = report.standardFileName || '';
      if (pdfType === 'ai_generated') {
        fileNameToSave = `AI_결과검증서_${fileNameToSave}`;
      }

      const contentDisposition = res.headers.get('Content-Disposition');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/) || contentDisposition.match(/filename="([^"]+)"/);
        if (match && match[1]) {
          try {
            fileNameToSave = decodeURIComponent(match[1]);
          } catch {
            fileNameToSave = match[1];
          }
        }
      }
      if (!fileNameToSave) {
        fileNameToSave = `${report.stockName}_${pdfType === 'ai_generated' ? 'AI검증서' : '원문리포트'}.pdf`;
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileNameToSave);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      const typeLabel = pdfType === 'ai_generated' ? 'AI 결과 검증서 PDF' : '증권사 원본 PDF';
      setDownloadSuccessMessage(`✓ [${typeLabel} 저장 완료] "${fileNameToSave}" (${(blob.size / 1024).toFixed(1)} KB) 파일이 내 PC에 정상 저장되었습니다.`);
    } catch (err: any) {
      console.error('Direct download error:', err);
      const fallbackParams = new URLSearchParams({
        nid: report.nid || '',
        pdfUrl: report.pdfUrl || '',
        fileName: report.standardFileName || '',
        stockName: report.stockName || '',
        stockCode: report.stockCode || '',
        brokerName: report.brokerName || '',
        title: report.reportTitle || '',
        type: pdfType
      });
      window.open(`/api/pipeline-01/download-pdf-stream?${fallbackParams.toString()}`, '_blank');
      setDownloadSuccessMessage(`[다운로드 시작] 브라우저 새 창에서 PDF 파일 다운로드가 시작되었습니다.`);
    } finally {
      setDownloadingNid(null);
    }
  };

  // Batch ZIP Download
  const handleBatchZipDownload = async () => {
    const selectedList = reports.filter(r => selectedNids.has(r.nid) && r.hasPdf);
    if (selectedList.length === 0) {
      alert('일괄 다운로드할 PDF 첨부 리포트를 1건 이상 선택해주세요.');
      return;
    }
    setIsDownloadingZip(true);
    setDownloadSuccessMessage(null);
    try {
      const zipFileName = `2026_네이버증권_종목분석_${selectedList.length}건.zip`;
      const res = await fetch('/api/pipeline-01/download-batch-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reports: selectedList,
          zipFileName
        })
      });
      const data = await res.json();
      if (data.success && data.downloadUrl) {
        window.location.href = data.downloadUrl;
        setDownloadSuccessMessage(`✓ [일괄 ZIP 생성 완료] 총 ${data.zipCount}개 PDF 리포트가 압축 파일(${data.zipFileName})로 다운로드되었습니다.`);
      } else {
        alert(data.error || '일괄 압축 파일 생성 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      console.error('Batch zip download error:', err);
      alert('일괄 압축 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Jump to Page Handler
  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpPageInput('');
    }
  };

  return (
    <div id="analyst-report-lookup-01-container" className="space-y-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 animate-fadeIn">
      {/* Top Header Card */}
      <div id="lookup-01-header-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  애널리스트리포트_조회_01
                </h1>
                <span className="bg-amber-950/90 text-amber-300 border border-amber-600/70 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  수집 데이터 조회 전용
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                수집된 네이버 증권 종목분석 리포트 원문 및 첨부파일(PDF)을 실시간으로 조회하고 열람합니다.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* DB Smart Sync / Manual Sync Button */}
            <button
              type="button"
              onClick={handleManualSyncToDb}
              disabled={isSyncingLiveToDb || reports.length === 0}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-950/50 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              title="현재 조회된 데이터를 DB(Firestore & Master JSON DB)에 동기화하여 저장"
            >
              <Database className={`w-3.5 h-3.5 ${isSyncingLiveToDb ? 'animate-spin text-purple-200' : 'text-purple-200'}`} />
              <span>{isSyncingLiveToDb ? 'DB 동기화 중...' : `🗄️ DB 동기화 (${reports.length}건)`}</span>
            </button>

            <button
              type="button"
              onClick={() => fetchReports(selectedMonth, mode, true)}
              disabled={isLoading || isSyncingLiveToDb}
              className="px-3 py-2 bg-slate-800/90 hover:bg-slate-800 text-cyan-300 border border-cyan-800/80 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
              title="DB를 거치지 않고 네이버 원천에서 강제 재수집(Live)하고 DB에 다시 저장합니다."
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>🔄 Live 재수집 &amp; DB 동기화</span>
            </button>

            {/* Dynamic Full Scope Collection / Target Month Button */}
            {(() => {
              const currentMonthNum = mode === 'all_2026' ? '연간' : parseInt(selectedMonth.split('-')[1] || '1', 10);
              const currentCount = reports.length > 0 ? reports.length : (monthCountsMap[selectedMonth]?.count || 993);
              const currentLabel = mode === 'all_2026' ? `2026 연간 (${currentCount}건)` : `${currentMonthNum}월 전수 (${currentCount}건)`;
              
              return (
                <button
                  type="button"
                  onClick={() => fetchReports(selectedMonth, mode, true)}
                  disabled={isLoading || isSyncingLiveToDb}
                  className="px-3.5 py-2 text-xs font-extrabold rounded-xl border border-amber-400/80 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-amber-950/60 ring-2 ring-amber-400/40 active:scale-95 disabled:opacity-50"
                  title={`네이버 증권 2026년 ${currentMonthNum}월 종목분석 리포트 실측 전수(${currentCount}건) 재수집 및 DB 동기화`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                  <span>✨ {currentLabel}</span>
                </button>
              );
            })()}

            {onNavigateToAnalysis && (
              <button
                type="button"
                onClick={onNavigateToAnalysis}
                className="px-3.5 py-2 bg-teal-600/90 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-950/40 flex items-center space-x-1.5 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>DB분석 대시보드 이동</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Data Origin Status Banner */}
        {dataOrigin.message && (
          <div className={`mt-3.5 p-2.5 px-3.5 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 shadow-inner ${
            dataOrigin.isDb 
              ? 'bg-purple-950/70 border-purple-800/80 text-purple-200'
              : 'bg-cyan-950/70 border-cyan-800/80 text-cyan-200'
          }`}>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                dataOrigin.isDb ? 'bg-purple-900 text-purple-100 border border-purple-600' : 'bg-cyan-900 text-cyan-100 border border-cyan-600'
              }`}>
                {dataOrigin.isDb ? 'DB 초고속 조회' : 'Smart Fallback Live'}
              </span>
              <span className="font-semibold">{dataOrigin.message}</span>
            </div>
            {dataOrigin.syncedAt && (
              <span className="text-[11px] text-slate-400 font-mono">
                동기화 시각: {dataOrigin.syncedAt}
              </span>
            )}
          </div>
        )}

        {/* Quick Month / Dataset Selector Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap flex items-center space-x-1 mr-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>수집 대상 선택:</span>
          </span>
          {MONTHS_LIST.map((item) => {
            const isSelected = (mode === 'all_2026' && item.key === 'all_2026') || (mode === 'monthly' && selectedMonth === item.key);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSelectMonth(item.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40 ring-1 ring-amber-400 font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{item.label}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${isSelected ? 'bg-amber-950/80 text-amber-200' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Notification Banner */}
      {downloadSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/70 text-emerald-200 text-xs font-medium flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessMessage(null)}
            className="text-emerald-400 hover:text-emerald-200 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FILTER & EXPLORER CONTROLS WITH 12 KRX STANDARD SECTORS */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* 1. Attachment Status Filter Tabs & Sector Ribbon Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                setAttachmentFilter('ALL');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                attachmentFilter === 'ALL'
                  ? 'bg-slate-800 text-white shadow font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              전체 ({reports.length}건)
            </button>
            <button
              onClick={() => {
                setAttachmentFilter('PDF_ONLY');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                attachmentFilter === 'PDF_ONLY'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold shadow'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>PDF 첨부 ({pdfCount}건)</span>
            </button>
            <button
              onClick={() => {
                setAttachmentFilter('NO_PDF');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                attachmentFilter === 'NO_PDF'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold shadow'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>PDF 미첨부 / 웹본문 ({noPdfCount}건)</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => setShowSectorOverview(!showSectorOverview)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer hover:border-slate-700 transition-all"
              title="12대 표준 섹터 퀵 바 접기/펼치기"
            >
              <PieChart className="w-3.5 h-3.5 text-amber-400" />
              <span>12대 표준 섹터 퀵 바</span>
              {showSectorOverview ? (
                <ChevronUp className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              )}
            </button>
            <span className="hidden sm:inline-flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>PDF 첨부 완료</span>
            </span>
            <span className="hidden sm:inline-flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>웹본문 (PDF 없음)</span>
            </span>
          </div>
        </div>

        {/* 2. 12 KRX Standard Sector Quick Filter Ribbon */}
        {showSectorOverview && (
          <div className="pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-slate-300">
                  12대 표준 대분류 섹터 퀵 필터
                </span>
                {sectorFilter !== 'ALL' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold flex items-center space-x-1">
                    <span>선택: {sectorFilter}</span>
                    <button
                      onClick={() => {
                        setSectorFilter('ALL');
                        setCurrentPage(1);
                      }}
                      className="hover:text-white cursor-pointer ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                총 {STANDARD_12_SECTORS.length}개 표준 대분류
              </span>
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 custom-scrollbar">
              {/* All Sector Chip */}
              <button
                type="button"
                onClick={() => {
                  setSectorFilter('ALL');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                  sectorFilter === 'ALL'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40 ring-1 ring-amber-400 font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>전체 섹터</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${sectorFilter === 'ALL' ? 'bg-amber-950/80 text-amber-200' : 'bg-slate-900 text-slate-400'}`}>
                  {reports.length}
                </span>
              </button>

              {/* 12 Standard Sector Chips */}
              {STANDARD_12_SECTORS.map((sec) => {
                const count = sectorDistribution[sec] || 0;
                const isSelected = sectorFilter === sec;
                const style = SECTOR_STYLES[sec] || { badge: 'bg-slate-950 text-slate-300 border-slate-800', dot: 'bg-slate-400', text: 'text-slate-300', bg: 'bg-slate-900' };

                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      setSectorFilter(isSelected ? 'ALL' : sec);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 border ${
                      isSelected
                        ? `${style.badge} ring-2 ring-amber-400 font-bold shadow-lg`
                        : count > 0
                        ? `${style.badge} opacity-85 hover:opacity-100 hover:border-slate-600`
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span>{sec}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${isSelected ? 'bg-black/40 text-white font-bold' : 'bg-slate-900/90 text-slate-300'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}

              {/* Unclassified Sector Chip if any */}
              {unclassifiedSectorCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSectorFilter(sectorFilter === '섹터 구분 필요' ? 'ALL' : '섹터 구분 필요');
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 border ${
                    sectorFilter === '섹터 구분 필요'
                      ? 'bg-red-950 text-red-200 border-red-500 ring-2 ring-red-400 shadow-lg'
                      : 'bg-red-950/60 text-red-300 border-red-800/80 hover:bg-red-900/60'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <span>섹터 구분 필요</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-red-950 text-red-200 border border-red-800">
                    {unclassifiedSectorCount}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3. Search, Sector, Broker, Sort, PageSize, ViewMode Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1">
          {/* Search Input */}
          <div className="sm:col-span-3 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="종목명, 코드, 제목, 증권사, 섹터..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* 12 Standard Sector Dropdown Selector */}
          <div className="sm:col-span-3 relative">
            <select
              value={sectorFilter}
              onChange={(e) => {
                setSectorFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer font-semibold ${
                sectorFilter !== 'ALL'
                  ? 'border-amber-500 text-amber-300 ring-1 ring-amber-500/50'
                  : 'border-slate-800 text-slate-200'
              }`}
            >
              <option value="ALL">🏷️ 전체 12대 표준 섹터 ({reports.length}건)</option>
              {STANDARD_12_SECTORS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec} ({sectorDistribution[sec] || 0}건)
                </option>
              ))}
              {unclassifiedSectorCount > 0 && (
                <option value="섹터 구분 필요">
                  ⚠️ 섹터 구분 필요 ({unclassifiedSectorCount}건)
                </option>
              )}
            </select>
          </div>

          {/* Broker Dropdown */}
          <div className="sm:col-span-2">
            <select
              value={brokerFilter}
              onChange={(e) => {
                setBrokerFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">전체 증권사 ({brokersList.length}개)</option>
              {brokersList.map((broker) => (
                <option key={broker} value={broker}>{broker}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="sm:col-span-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="default">발행일 최신순</option>
              <option value="earliest">2026 최초 발행순</option>
              <option value="hits">조회수 높은순</option>
              <option value="name">종목명 가나다순</option>
            </select>
          </div>

          {/* Page Size */}
          <div className="sm:col-span-1">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer text-center"
              title="한 페이지에 표시할 리포트 개수"
            >
              <option value={10}>10개</option>
              <option value={15}>15개</option>
              <option value={20}>20개</option>
              <option value={30}>30개</option>
              <option value={50}>50개</option>
              <option value={100}>100개</option>
            </select>
          </div>

          {/* View Mode & Reset Button */}
          <div className="sm:col-span-1 flex items-center justify-end space-x-1">
            {(sectorFilter !== 'ALL' || brokerFilter !== 'ALL' || attachmentFilter !== 'ALL' || searchTerm.trim() !== '') && (
              <button
                type="button"
                onClick={() => {
                  setSectorFilter('ALL');
                  setBrokerFilter('ALL');
                  setAttachmentFilter('ALL');
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 transition-all border border-slate-700 cursor-pointer"
                title="모든 필터 초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="카드 뷰"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="테이블 뷰"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Selection & Batch Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Current Page Selection Toggle */}
            <button
              onClick={toggleSelectCurrentPage}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-medium hover:border-slate-700 transition-all cursor-pointer"
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

            {/* All Selection Toggle */}
            <button
              onClick={toggleSelectAll}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-medium hover:border-slate-700 transition-all cursor-pointer"
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
                className="text-[11px] text-slate-500 hover:text-rose-400 underline px-1.5 py-0.5 cursor-pointer"
              >
                선택 해제
              </button>
            )}

            {/* Batch Action Buttons */}
            {selectedNids.size > 0 && (
              <button
                onClick={handleBatchZipDownload}
                disabled={isDownloadingZip}
                className="ml-2 px-3 py-1 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="선택된 PDF 리포트를 일괄 ZIP 압축 파일로 다운로드"
              >
                <FolderDown className="w-3.5 h-3.5" />
                <span>선택 {selectedNids.size}건 일괄 ZIP 다운로드</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {sectorFilter !== 'ALL' && (
              <span className="text-amber-400 font-semibold text-xs flex items-center space-x-1 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded-lg">
                <Tag className="w-3 h-3 text-amber-400" />
                <span>{sectorFilter}</span>
              </span>
            )}
            <span className="text-emerald-400 text-xs font-semibold flex items-center space-x-1.5 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {totalItems > 0 ? `${startIndex + 1} - ${endIndex}` : '0'} / 총 <strong className="font-mono">{totalItems}</strong>건 
                <span className="text-slate-400 font-normal ml-1 font-mono">({safeCurrentPage}/{totalPages}p)</span>
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REPORTS LISTING: GRID OR TABLE */}
      {/* ========================================================================= */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-slate-900/40 rounded-2xl border border-slate-800">
          <RefreshCw className="w-9 h-9 text-amber-400 animate-spin" />
          <div className="text-center">
            <p className="text-slate-200 text-sm font-bold">
              수집된 리포트 데이터를 불러오고 있습니다...
            </p>
            <p className="text-slate-500 text-xs mt-1 font-mono">
              대상: {selectedMonth === 'all_2026' || mode === 'all_2026' ? '2026 연간 전체' : selectedMonth} 종목분석 리포트
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-rose-950/40 border border-rose-800 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <div className="text-rose-200 font-bold text-sm">{error}</div>
          <button
            onClick={() => fetchReports(selectedMonth, mode)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>다시 시도</span>
          </button>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
          <FileText className="w-10 h-10 mx-auto mb-2 text-slate-600" />
          <p className="text-sm font-medium">선택된 조건의 리포트가 없습니다.</p>
          <p className="text-xs text-slate-600 mt-1">검색어를 변경하거나 필터를 초기화해보세요.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ========================================================================= */
        /* GRID VIEW (EXACT TO USER SCREENSHOT) */
        /* ========================================================================= */
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
                      ? 'bg-slate-900/95 border-amber-700/80 hover:border-amber-600'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Card Header Top */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleSelectOne(item.nid)}
                          className="text-slate-400 hover:text-slate-200 cursor-pointer"
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
                        {item.sector && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setSectorFilter(item.sector === sectorFilter ? 'ALL' : item.sector);
                              setCurrentPage(1);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border cursor-pointer transition-all ${
                              SECTOR_STYLES[item.sector]?.badge || 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                            title={`클릭하여 '${item.sector}' 섹터 필터링`}
                          >
                            {item.sector}
                          </span>
                        )}
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDartReport(item);
                          }}
                          className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/80 text-[10px] font-bold flex items-center space-x-1 transition-all cursor-pointer shadow-sm"
                          title="금융감독원 DART 공시 연계 & 팩트체크 보기"
                        >
                          <Building2 className="w-2.5 h-2.5 text-emerald-400" />
                          <span>DART 공시</span>
                        </button>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[11px] font-semibold">
                          {item.brokerName}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4
                      className="text-xs font-bold line-clamp-2 transition-colors cursor-pointer mb-2 text-slate-100 hover:text-amber-300"
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

                    {/* Meta Info Box (Exact layout from Screenshot) */}
                    <div className="space-y-1.5 text-[11px] text-slate-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">발행일자:</span>
                        <span className="font-mono text-slate-300 font-semibold">{item.publishDate} ({item.rawDate})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">조회수:</span>
                        <span className="font-mono text-emerald-400 font-bold">{item.hits?.toLocaleString()} 회</span>
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

                  {/* Bottom Action Row */}
                  <div className="flex flex-col gap-2 pt-3 mt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center space-x-1">
                        {hasValidAttachment ? (
                          <button
                            onClick={() => {
                              setPreviewPdfType('original');
                              setPreviewReport(item);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer"
                            title="증권사 원본 PDF 바로보기 (스트림 뷰어)"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        ) : null}
                        <button
                          onClick={() => openWebArticleReader(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                          title="웹본문 텍스트/요약 읽기"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedReportForDetail(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 transition-colors cursor-pointer"
                          title="JSON 상세 메타데이터 보기"
                        >
                          <Code className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedDartReport(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950/80 hover:border-emerald-700 text-emerald-400 border border-slate-700/80 transition-colors cursor-pointer"
                          title="DART 전자공시 연계 & 팩트체크 열기"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleDownloadSinglePdf(item, 'ai_generated')}
                        disabled={downloadingNid === item.nid}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-bold border border-purple-800 transition-all active:scale-95 shadow-sm cursor-pointer"
                        title="AI 분석 검증서 PDF 변환 및 다운로드"
                      >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>AI 결과 PDF</span>
                      </button>
                    </div>

                    {hasValidAttachment ? (
                      <button
                        onClick={() => handleDownloadSinglePdf(item, 'original')}
                        disabled={downloadingNid === item.nid}
                        className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
                        title="증권사에서 수집한 원본 PDF 파일 다운로드"
                      >
                        <Download className={`w-3.5 h-3.5 ${downloadingNid === item.nid ? 'animate-bounce' : ''}`} />
                        <span>{downloadingNid === item.nid ? '저장 중...' : '📥 증권사 원본 PDF 다운로드'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openWebArticleReader(item)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-800 transition-all active:scale-95 shadow-sm cursor-pointer"
                        title="네이버 증권 리포트 웹본문 내용 읽기"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>📖 웹본문 읽기 (원문PDF 미첨부건)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* TABLE VIEW */
        /* ========================================================================= */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <button onClick={toggleSelectCurrentPage} title="현재 페이지 전체 선택/해제" className="cursor-pointer">
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
                        <button onClick={() => toggleSelectOne(item.nid)} className="cursor-pointer">
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
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-100">{item.stockName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({item.stockCode})</span>
                        </div>
                        {item.sector && (
                          <div className="mt-1 flex items-center space-x-1">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setSectorFilter(item.sector === sectorFilter ? 'ALL' : item.sector);
                                setCurrentPage(1);
                              }}
                              className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold border cursor-pointer transition-all ${
                                SECTOR_STYLES[item.sector]?.badge || 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                              title={`클릭하여 '${item.sector}' 섹터 필터링`}
                            >
                              {item.sector}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDartReport(item);
                              }}
                              className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 text-[10px] font-bold cursor-pointer transition-colors"
                              title="DART 전자공시 연계 & 팩트체크 보기"
                            >
                              <Building2 className="w-2.5 h-2.5 text-emerald-400" />
                              <span>DART</span>
                            </button>
                          </div>
                        )}
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
                              className="px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-300 text-[10px] font-bold border border-amber-800/80 shrink-0 inline-flex items-center space-x-1 hover:bg-amber-900 transition-colors cursor-pointer"
                              title="웹본문 내용 바로 읽기"
                            >
                              <BookOpen className="w-2.5 h-2.5 text-amber-400" />
                              <span>웹본문</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => openWebArticleReader(item)}
                              className="px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 text-[10px] font-bold border border-emerald-800/80 shrink-0 inline-flex items-center space-x-1 hover:bg-emerald-900 transition-colors cursor-pointer"
                              title="웹본문 내용 및 요약 읽기"
                            >
                              <BookOpen className="w-2.5 h-2.5 text-emerald-400" />
                              <span>본문/요약</span>
                            </button>
                          )}
                          <div
                            className="font-medium line-clamp-1 cursor-pointer text-slate-100 hover:text-amber-300 transition-colors"
                            onClick={() => openWebArticleReader(item)}
                            title={`${item.reportTitle} (클릭하여 본문 및 요약 내용 읽기)`}
                          >
                            {item.reportTitle}
                          </div>
                        </div>
                        <div className="text-[10px] font-mono truncate max-w-md mt-0.5">
                          {hasValidAttachment ? (
                            <span className="text-slate-400 hover:text-emerald-300 cursor-pointer" onClick={() => openWebArticleReader(item)}>
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
                        {item.hits?.toLocaleString()}
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
                        ) : (
                          <button
                            onClick={() => openWebArticleReader(item)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-[10px] font-medium border border-amber-800/80 transition-colors cursor-pointer" 
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
                                onClick={() => handleDownloadSinglePdf(item, 'original')}
                                disabled={downloadingNid === item.nid}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-950/40 transition-all inline-flex items-center space-x-1 active:scale-95 disabled:opacity-50 cursor-pointer"
                                title="증권사 원본 PDF 파일 다운로드"
                              >
                                <Download className={`w-3 h-3 ${downloadingNid === item.nid ? 'animate-bounce' : ''}`} />
                                <span>{downloadingNid === item.nid ? '저장...' : '원본 PDF'}</span>
                              </button>
                              <button
                                onClick={() => handleDownloadSinglePdf(item, 'ai_generated')}
                                disabled={downloadingNid === item.nid}
                                className="px-2.5 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-bold border border-purple-800 transition-all inline-flex items-center space-x-1 active:scale-95 cursor-pointer"
                                title="AI 검증 결과 PDF 변환 다운로드"
                              >
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                <span>AI PDF</span>
                              </button>
                              <button
                                onClick={() => {
                                  setPreviewPdfType('original');
                                  setPreviewReport(item);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 transition-all cursor-pointer"
                                title="원본 PDF 바로보기 (스트림 뷰어)"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openWebArticleReader(item)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-all cursor-pointer"
                                title="웹본문 텍스트 및 요약 읽기"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => openWebArticleReader(item)}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-800 transition-all inline-flex items-center space-x-1 shadow-sm cursor-pointer"
                                title="네이버 증권 리포트 본문 내용 읽기"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>웹본문 읽기</span>
                              </button>
                              <button
                                onClick={() => handleDownloadSinglePdf(item, 'ai_generated')}
                                disabled={downloadingNid === item.nid}
                                className="px-2.5 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-bold border border-purple-800 transition-all inline-flex items-center space-x-1 active:scale-95 cursor-pointer"
                                title="AI 검증 결과 PDF 변환 다운로드"
                              >
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                <span>AI PDF</span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedReportForDetail(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 transition-all cursor-pointer"
                            title="JSON 상세 메타데이터 보기"
                          >
                            <Code className="w-3.5 h-3.5" />
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

      {/* ========================================================================= */}
      {/* BOTTOM PAGINATION NAVIGATION BAR */}
      {/* ========================================================================= */}
      {filteredReports.length > 0 && (
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
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
              className="p-1.5 sm:p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              title="첫 페이지로 이동"
            >
              <ChevronsLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Previous Page (<) */}
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
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
                    className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-950/60 border border-amber-500/40 scale-105'
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
              className="p-1.5 sm:p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              title="다음 페이지"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Last Page (>>) */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
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
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
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
                className="w-12 px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-white font-mono placeholder-slate-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <span className="text-slate-500 text-xs font-mono">/ {totalPages}</span>
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95 cursor-pointer"
              >
                이동
              </button>
            </form>
          </div>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950 gap-3">
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
                    {previewPdfType === 'ai_generated' ? `AI_검증서_${previewReport.standardFileName}` : previewReport.standardFileName}
                  </div>
                </div>
              </div>

              {/* PDF Type Selector Tabs */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setPreviewPdfType('original')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    previewPdfType === 'original'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Download className="w-3 h-3" />
                  <span>증권사 원본 PDF</span>
                </button>
                <button
                  onClick={() => setPreviewPdfType('ai_generated')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    previewPdfType === 'ai_generated'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI 결과 PDF</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => {
                    const rep = previewReport;
                    setPreviewReport(null);
                    openWebArticleReader(rep);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-800/80 inline-flex items-center space-x-1.5 transition-all cursor-pointer"
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
                    date: previewReport.publishDate || '',
                    type: previewPdfType
                  }).toString()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center space-x-1.5 transition-all"
                  title="새 창에서 PDF 전체화면 열기"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">새 창에서 열기</span>
                </a>

                <button
                  onClick={() => handleDownloadSinglePdf(previewReport, previewPdfType)}
                  className={`px-3.5 py-1.5 rounded-xl text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
                    previewPdfType === 'ai_generated' ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-950/40' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>내 PC 저장</span>
                </button>

                <button
                  onClick={() => setPreviewReport(null)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-900/40 text-slate-400 hover:text-rose-200 border border-slate-700/80 hover:border-rose-700/80 transition-all flex items-center justify-center cursor-pointer"
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
                  date: previewReport.publishDate || '',
                  yymmdd: previewReport.yymmdd || '',
                  targetPrice: String(previewReport.targetPrice || 0),
                  currentPrice: String(previewReport.currentPrice || 0),
                  investmentOpinion: previewReport.investmentOpinion || '',
                  sector: previewReport.sector || '',
                  analystName: previewReport.analystName || '',
                  type: previewPdfType
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
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-200 border border-slate-700/80 hover:border-rose-700/80 transition-all cursor-pointer"
                title="닫기 (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <span className="font-bold text-slate-300 flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    <span>메인 메타데이터</span>
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

              {/* JSON Output Viewer */}
              <div>
                <span className="text-slate-400 font-semibold block mb-1.5 flex items-center justify-between">
                  <span>추출 JSON 스키마 규격:</span>
                  <span className="text-[10px] text-slate-500 font-mono">파이프라인_01</span>
                </span>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-52">
                  {JSON.stringify(selectedReportForDetail, null, 2)}
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
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF 다운로드</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    const rep = selectedReportForDetail;
                    setSelectedReportForDetail(null);
                    setSelectedDartReport(rep);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>DART 공시 팩트체크</span>
                </button>
                <button
                  onClick={() => {
                    const rep = selectedReportForDetail;
                    setSelectedReportForDetail(null);
                    openWebArticleReader(rep);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-md shadow-amber-950/40 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>웹본문 리더로 읽기</span>
                </button>
                <button
                  onClick={() => setSelectedReportForDetail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DART DISCLOSURE & FACT-CHECK MODAL */}
      {/* ========================================================================= */}
      {selectedDartReport && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedDartReport(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden cursor-default"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600/30 to-blue-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h3 className="text-base font-bold text-white truncate">
                      {selectedDartReport.stockName} ({selectedDartReport.stockCode})
                    </h3>
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                      {selectedDartReport.brokerName} | 발간일: {selectedDartReport.publishDate}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                      DART 전자공시 크로스체크
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate" title={selectedDartReport.reportTitle}>
                    {selectedDartReport.reportTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDartReport(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="닫기 (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with DART Disclosure Component */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <DartDisclosureSection
                report={{
                  id: String(selectedDartReport.nid),
                  title: selectedDartReport.reportTitle,
                  stockName: selectedDartReport.stockName,
                  stockCode: selectedDartReport.stockCode,
                  brokerName: selectedDartReport.brokerName,
                  analystName: selectedDartReport.analystName || '',
                  sector: selectedDartReport.sector as any,
                  publishDate: selectedDartReport.publishDate,
                  pdfUrl: selectedDartReport.pdfUrl
                } as any}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3 text-xs">
              <div className="text-slate-500">
                원천: 금융감독원 전자공시시스템(DART) 오픈 API 연동
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const rep = selectedDartReport;
                    setSelectedDartReport(null);
                    openWebArticleReader(rep);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>웹본문 보기</span>
                </button>
                <button
                  onClick={() => setSelectedDartReport(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all border border-slate-700 cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WEB ARTICLE READER MODAL */}
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
                    <span>조회수: <strong className="text-emerald-400 font-mono">{readingWebArticleReport.hits?.toLocaleString()}</strong>회</span>
                  </span>
                  <span>•</span>
                  <span className="text-[11px] font-mono text-slate-500">NID: {readingWebArticleReport.nid}</span>
                </div>
              </div>

              <button
                onClick={() => setReadingWebArticleReport(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700 transition-all shrink-0 cursor-pointer"
                title="닫기 (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
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
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/60 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-emerald-800/80 inline-flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
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
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>리서치 리포트 제목</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {webArticleData.characterCount?.toLocaleString()}자 / {webArticleData.paragraphCount}개 단락
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 leading-snug tracking-tight">
                      {webArticleData.reportTitle || readingWebArticleReport.reportTitle}
                    </h2>
                  </div>

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

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                {readingWebArticleReport.hasPdf && (
                  <>
                    <button
                      onClick={() => handleDownloadSinglePdf(readingWebArticleReport)}
                      disabled={downloadingNid === readingWebArticleReport.nid}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-950/50 active:scale-95 disabled:opacity-50 cursor-pointer"
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
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-emerald-800/80 inline-flex items-center space-x-1.5 transition-all cursor-pointer"
                      title="PDF 스트림 뷰어로 보기"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>PDF 뷰어</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    const rep = readingWebArticleReport;
                    setReadingWebArticleReport(null);
                    setSelectedDartReport(rep);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-800 inline-flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                  title="해당 종목의 DART 전자공시 & 팩트체크 열람"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DART 공시 연계</span>
                </button>

                <button
                  onClick={handleCopyArticleContent}
                  disabled={!webArticleData || isLoadingArticle}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 inline-flex items-center space-x-1.5 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
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
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
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
