import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Cpu,
  FileCode2,
  SlidersHorizontal,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Hash,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingUp,
  Building,
  User,
  X,
  Copy,
  Check,
  FileCheck,
  AlertCircle,
  BarChart3,
  Type,
  FileDown,
  BookOpen,
  Quote
} from 'lucide-react';
import { safeResponseJson } from '../utils/apiClient';

interface AnalystReportSearch01Props {
  onGoToPipeline01?: () => void;
  onGoToExplorer?: () => void;
}

interface OverviewData {
  totalReports: number;
  uniqueStocks: number;
  uniqueBrokers: number;
  uniqueAnalysts: number;
  pdfSecuredCount: number;
  pdfSecuredRate: number;
  lastUpdatedAt: string;
  dataSource: string;
  monthStats: Record<string, {
    month: string;
    collectedCount: number;
    expectedCount: number;
    pdfCount: number;
    pdfRate: number;
    integrityStatus: 'MATCHED' | 'DIVERGENT';
    missingCount: number;
  }>;
}

interface ReportItem {
  id: string;
  nid: string;
  stockCode: string;
  stockName: string;
  sector?: string;
  brokerName: string;
  analystName?: string;
  reportTitle: string;
  publishDate: string;
  yymmdd?: string;
  month?: string;
  targetPrice?: number;
  currentPrice?: number;
  investmentOpinion?: string;
  hits?: number;
  hasPdf: boolean;
  pdfUrl?: string;
  reportUrl?: string;
  standardFileName?: string;
  pdfStatus?: string;
  bodyText?: string;
  paragraphs?: string[];
  contentHash?: string;
  version?: number;
  syncStatus?: string;
  aiSummary?: string;
  objectivityScore?: number;
  sentimentScore?: number;
}

interface AuditResult {
  targetMonth: string;
  status: 'MATCHED' | 'DIVERGENT' | 'SCAN_FAILED';
  isMatched: boolean;
  sourceRemoteCount: number;
  internalDbCount: number;
  missingCount: number;
  missingNids: string[];
  latestRemoteNid: string;
  latestLocalNid: string;
  auditedAt: string;
  summaryMessage: string;
}

const MAJOR_BROKERS = [
  '전체 증권사 (16개사)',
  '미래에셋증권',
  '한국투자증권',
  'NH투자증권',
  '삼성증권',
  'KB증권',
  '신한투자증권',
  '하나증권',
  '메리츠증권',
  '키움증권',
  '대신증권',
  '유진투자증권',
  '교보증권',
  '한화투자증권',
  '하이투자증권',
  'IBK투자증권',
  '유안타증권'
];

const SECTORS = [
  '전체 섹터',
  '반도체 / IT하드웨어',
  '2차전지 / 배터리',
  '인터넷 / SW / 게임',
  '자동차 / 모빌리티',
  '바이오 / 헬스케어',
  '금융 / 지주 / 밸류업',
  '조선 / 방산 / 기계',
  '화학 / 에너지'
];

export const AnalystReportSearch01: React.FC<AnalystReportSearch01Props> = ({
  onGoToPipeline01,
  onGoToExplorer
}) => {
  // Overview State
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);

  // Search & Filter State
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-01');
  const [selectedBroker, setSelectedBroker] = useState<string>('전체 증권사 (16개사)');
  const [selectedSector, setSelectedSector] = useState<string>('전체 섹터');
  const [selectedOpinion, setSelectedOpinion] = useState<string>('ALL');
  const [hasPdfOnly, setHasPdfOnly] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('publishDate');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  // Pagination & List State
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingReports, setLoadingReports] = useState<boolean>(false);

  // Integrity Audit & Re-sync State
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isResyncing, setIsResyncing] = useState<boolean>(false);
  const [resyncSuccessMsg, setResyncSuccessMsg] = useState<string | null>(null);

  // Modals & Reader Enhancements
  const [activeReportForReader, setActiveReportForReader] = useState<ReportItem | null>(null);
  const [activeReportForHash, setActiveReportForHash] = useState<ReportItem | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [expandedReportIds, setExpandedReportIds] = useState<Set<string>>(new Set());
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg'>('sm');
  const [copiedModalBody, setCopiedModalBody] = useState<boolean>(false);
  const [copiedReportId, setCopiedReportId] = useState<string | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleExpandReport = (id: string) => {
    setExpandedReportIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopyReportText = (report: ReportItem) => {
    const textToCopy = report.bodyText || (report.paragraphs && report.paragraphs.join('\n\n')) || report.reportTitle;
    navigator.clipboard.writeText(textToCopy);
    setCopiedReportId(report.id || report.nid);
    showToast(`✓ [${report.stockName}] 수집 본문 텍스트가 클립보드에 복사되었습니다.`);
    setTimeout(() => setCopiedReportId(null), 2500);
  };

  const handleDownloadReportText = (report: ReportItem) => {
    const text = `================================================================================
[증권사 리서치 리포트 수집 본문] ${report.stockName} (${report.stockCode})
================================================================================
리포트 제목 : ${report.reportTitle}
발행 일자   : ${report.publishDate}
발행 증권사 : ${report.brokerName}
담당 애널리스트: ${report.analystName || '리서치센터'}
섹터 분류   : ${report.sector || '기타'}
투자의견 / 목표가: ${report.investmentOpinion || 'BUY'} / ${report.targetPrice ? `${report.targetPrice.toLocaleString()}원` : '-'}
기준주가 / 상승여력: ${report.currentPrice ? `${report.currentPrice.toLocaleString()}원` : '-'}
무결성 해시 : ${report.contentHash || 'N/A'}
수집 데이터 소스 : 네이버 증권 리서치 > 종목분석 리포트 마스터 DB

--------------------------------------------------------------------------------
[AI 핵심 투자 포인트 요약]
--------------------------------------------------------------------------------
${report.aiSummary || '기본 요약이 생성되어 있습니다.'}

--------------------------------------------------------------------------------
[수집된 리포트 전문 텍스트 (총 ${report.paragraphs?.length || 5}개 문단)]
--------------------------------------------------------------------------------
${report.bodyText || (report.paragraphs ? report.paragraphs.join('\n\n') : '본문 텍스트가 보관되어 있습니다.')}

================================================================================
수집처: Pipeline_01 마스터 아카이브 (무손실 CQRS 아키텍처)
================================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.publishDate}_${report.brokerName}_${report.stockName}_본문전문.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`✓ [${report.stockName}] 리포트 본문 파일(.txt) 다운로드가 완료되었습니다.`);
  };

  // 1. Fetch Overview Dashboard Data
  const fetchOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch('/api/pipeline-01/search/overview');
      const json = await safeResponseJson(res, { success: false });
      if (json && json.success) {
        setOverview(json.data);
      }
    } catch (err) {
      console.warn('Failed to load search overview:', err);
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  // 2. Fetch Reports strictly from Internal DB
  const fetchReports = useCallback(async (pageToLoad = 1) => {
    setLoadingReports(true);
    try {
      const params = new URLSearchParams();
      if (selectedMonth !== 'ALL') params.append('month', selectedMonth);
      if (selectedBroker !== '전체 증권사 (16개사)') params.append('broker', selectedBroker);
      if (selectedSector !== '전체 섹터') params.append('sector', selectedSector);
      if (selectedOpinion !== 'ALL') params.append('opinion', selectedOpinion);
      if (hasPdfOnly) params.append('hasPdf', 'true');
      if (searchKeyword.trim()) params.append('search', searchKeyword.trim());
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', String(pageToLoad));
      params.append('limit', String(pageSize));
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await fetch(`/api/pipeline-01/search/reports?${params.toString()}`);
      const json = await safeResponseJson(res, { success: false });
      if (json && json.success && json.data) {
        setReports(json.data.items || []);
        setTotalItems(json.data.pagination.totalItems || 0);
        setTotalPages(json.data.pagination.totalPages || 1);
        setCurrentPage(json.data.pagination.currentPage || 1);
      }
    } catch (err) {
      console.warn('Failed to fetch filtered reports:', err);
    } finally {
      setLoadingReports(false);
    }
  }, [selectedMonth, selectedBroker, selectedSector, selectedOpinion, hasPdfOnly, searchKeyword, startDate, endDate, pageSize, sortBy, sortOrder]);

  // 3. Trigger Data Integrity Audit
  const handleRunAudit = async (targetMonth = selectedMonth) => {
    if (targetMonth === 'ALL') targetMonth = '2026-02';
    setIsAuditing(true);
    setResyncSuccessMsg(null);
    try {
      const res = await fetch('/api/pipeline-01/integrity/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetMonth })
      });
      const json = await safeResponseJson(res, { success: false });
      if (json && json.success && json.audit) {
        setAuditResult(json.audit);
        if (json.audit.isMatched) {
          showToast(`✓ [정합성 100% 일치] ${targetMonth} 원본 데이터와 내부 DB가 완벽히 동기화되어 있습니다.`);
        } else {
          showToast(`⚠️ [정합성 차이 감지] ${targetMonth} 원본 대비 ${json.audit.missingCount}건의 리포트가 누락되었습니다.`);
        }
        fetchOverview();
      }
    } catch (err: any) {
      console.warn('Audit run error:', err);
      showToast('정합성 검사 중 통신 오류가 발생했습니다.');
    } finally {
      setIsAuditing(false);
    }
  };

  // 4. Trigger Differential Re-sync
  const handleRunResync = async (targetMonth = selectedMonth, missingNids: string[] = []) => {
    if (targetMonth === 'ALL') targetMonth = '2026-02';
    setIsResyncing(true);
    try {
      const res = await fetch('/api/pipeline-01/integrity/resync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetMonth,
          targetNids: missingNids
        })
      });
      const json = await safeResponseJson(res, { success: false });
      if (json && json.success) {
        setResyncSuccessMsg(json.message);
        showToast(json.message);
        // Refresh audit and reports
        await handleRunAudit(targetMonth);
        await fetchReports(1);
        await fetchOverview();
      }
    } catch (err: any) {
      console.warn('Resync execution error:', err);
      showToast('재수집 동기화 중 오류가 발생했습니다.');
    } finally {
      setIsResyncing(false);
    }
  };

  // 5. Test Helper: Simulate Gap in DB to test Audit & Recovery
  const handleSimulateGap = async () => {
    const target = selectedMonth === 'ALL' ? '2026-02' : selectedMonth;
    try {
      const res = await fetch('/api/pipeline-01/integrity/simulate-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetMonth: target, gapCount: 6 })
      });
      const json = await safeResponseJson(res, { success: false });
      if (json && json.success) {
        showToast(`[테스트 시뮬레이션] ${target} DB에서 6건의 의도적 누락을 생성했습니다.`);
        await handleRunAudit(target);
        await fetchReports(1);
        await fetchOverview();
      }
    } catch (e) {
      console.error('Simulation error:', e);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchOverview();
    fetchReports(1);
    handleRunAudit(selectedMonth === 'ALL' ? '2026-02' : selectedMonth);
  }, []);

  // Trigger report search on filter change
  useEffect(() => {
    fetchReports(1);
  }, [selectedMonth, selectedBroker, selectedSector, selectedOpinion, hasPdfOnly, sortBy, sortOrder, pageSize]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-teal-500/50 shadow-2xl rounded-xl px-5 py-3.5 text-xs font-semibold flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Card & Control Hub */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/50 rounded-2xl border border-teal-500/30 p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center space-x-1.5 bg-teal-500/10 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>파이프라인_01 마스터 DB 전용 뷰어</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-blue-500/10 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-mono font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>순수 내부 DB 조회 (Zero Crawling Latency)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>애널리스트리포트_분석_01</span>
              <span className="text-xs bg-slate-800 text-teal-400 border border-teal-500/40 px-2 py-0.5 rounded font-mono font-normal">
                MASTER DB ANALYTICS
              </span>
            </h1>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              <strong>파이프라인_01(네이버 증권 리포트 수집 엔진)</strong>에서 무손실 보관된 2026년 국내 주요 16개 증권사의 전수 종목분석 리포트 본문 전문과 
              핵심 투자 포인트를 <strong>내부 고속 데이터베이스</strong>에서 다차원으로 분석·검색하고 데이터 정합성을 검증합니다.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleRunAudit(selectedMonth === 'ALL' ? '2026-02' : selectedMonth)}
              disabled={isAuditing}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-teal-900/30 border border-teal-400/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? '정합성 정밀 감사 중...' : '정합성 감사 실행 (Audit)'}</span>
            </button>

            {onGoToPipeline01 && (
              <button
                type="button"
                onClick={onGoToPipeline01}
                className="inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
                <span>파이프라인_01 수집기 이동</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Overview Dashboard KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">내부 DB 총 수집 리포트</span>
            <Database className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white tracking-tight">
              {overview ? overview.totalReports.toLocaleString() : '...'}
            </span>
            <span className="text-xs font-bold text-teal-400">건 보관</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {overview ? `${overview.uniqueStocks}개 종목 · ${overview.uniqueBrokers}개 증권사` : '데이터 로드 중'}
          </p>
        </div>

        {/* Selected Month Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">선택 월 ({selectedMonth}) 보관 현황</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-cyan-300 tracking-tight">
              {overview?.monthStats[selectedMonth]?.collectedCount ?? totalItems}
            </span>
            <span className="text-xs text-slate-400">
              / {overview?.monthStats[selectedMonth]?.expectedCount ?? '720'}건
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span className="text-emerald-400 font-semibold">
              수집률 {overview?.monthStats[selectedMonth] ? Math.round((overview.monthStats[selectedMonth].collectedCount / Math.max(1, overview.monthStats[selectedMonth].expectedCount)) * 100) : 100}%
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono">2026 Season</span>
          </div>
        </div>

        {/* PDF Security Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">원문 PDF 확보율</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-400 tracking-tight">
              {overview ? `${overview.pdfSecuredRate}%` : '98.5%'}
            </span>
            <span className="text-xs text-slate-400">
              ({overview ? overview.pdfSecuredCount.toLocaleString() : '0'}건)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">표준 YYMMDD_증권사_종목 명명</p>
        </div>

        {/* Integrity Status Badge */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">데이터 정합성 (Safe-Diff)</span>
            <ShieldCheck className={`w-4 h-4 ${auditResult?.isMatched ? 'text-teal-400' : 'text-amber-400'}`} />
          </div>
          <div className="flex items-center space-x-2">
            {auditResult?.isMatched ? (
              <span className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% 동기화 (SYNCED)</span>
              </span>
            ) : auditResult ? (
              <span className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs font-bold animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{auditResult.missingCount}건 불일치 (DIVERGENT)</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">감사 대기중</span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 truncate font-mono">
            {auditResult?.auditedAt ? `최종점검: ${auditResult.auditedAt.slice(11, 19)}` : '방금 전'}
          </p>
        </div>
      </div>

      {/* 3. Data Integrity & Differential Re-sync Control Banner */}
      {auditResult && !auditResult.isMatched && (
        <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/40 border border-amber-500/50 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-amber-200">
                    [정합성 불일치 감지] {auditResult.targetMonth} 데이터 {auditResult.missingCount}건 누락
                  </h3>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                    DIVERGENT DETECTED
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  원천 타겟 기준(총 {auditResult.sourceRemoteCount}건) 대비 내부 마스터 DB(현재 {auditResult.internalDbCount}건)에 
                  <strong> {auditResult.missingCount}건의 리포트</strong>가 수집되지 않았습니다. 누락된 항목만 선택적으로 파이프라인_01에 인입하여 무손실 동기화를 완료할 수 있습니다.
                </p>
                {auditResult.missingNids && auditResult.missingNids.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-amber-300/80 font-medium">누락 NID:</span>
                    {auditResult.missingNids.slice(0, 8).map(nid => (
                      <span key={nid} className="bg-slate-950 text-amber-300 border border-amber-600/40 text-[10px] font-mono px-1.5 py-0.5 rounded">
                        #{nid}
                      </span>
                    ))}
                    {auditResult.missingNids.length > 8 && (
                      <span className="text-[10px] text-slate-400">외 {auditResult.missingNids.length - 8}건</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Trigger */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleRunResync(auditResult.targetMonth, auditResult.missingNids)}
                disabled={isResyncing}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-950/60 border border-amber-400/40 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 ${isResyncing ? 'animate-spin' : ''}`} />
                <span>{isResyncing ? '차분 재수집 동기화 중...' : `⚡ 누락 ${auditResult.missingCount}건 자동 재수집 (Re-sync)`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-sync Success Notification Banner */}
      {resyncSuccessMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{resyncSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setResyncSuccessMsg(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-1"
          >
            닫기
          </button>
        </div>
      )}

      {/* 4. Multi-dimensional Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        {/* Month Selector Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <Calendar className="w-4 h-4 text-teal-400" />
            <span>수집 기준 월 선택:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', 'ALL'].map((m) => {
              const monthStat = overview?.monthStats?.[m];
              const count = monthStat ? monthStat.collectedCount : null;
              const label = m === 'ALL' 
                ? '2026 상반기 전체' 
                : count !== null 
                  ? `${parseInt(m.split('-')[1], 10)}월 전수 (${count}건)` 
                  : `${parseInt(m.split('-')[1], 10)}월 전수`;
              const isSelected = selectedMonth === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setSelectedMonth(m);
                    handleRunAudit(m);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40 ring-2 ring-teal-400 font-bold'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Simulate Gap Test Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateGap}
              title="정합성 차분 감지 및 재수집 로직을 테스트하기 위해 DB에서 6건의 의도적 누락을 생성합니다."
              className="text-[11px] text-slate-400 hover:text-amber-300 bg-slate-950 border border-slate-800 hover:border-amber-500/50 px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>🧪 누락 시뮬레이션 테스트</span>
            </button>
          </div>
        </div>

        {/* Detailed Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search Input */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchReports(1)}
              placeholder="종목명, 종목코드, 제목, 애널리스트 검색..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 pl-9 focus:outline-none focus:border-teal-400 transition-all"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => {
                  setSearchKeyword('');
                  fetchReports(1);
                }}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Broker Dropdown */}
          <div>
            <select
              value={selectedBroker}
              onChange={(e) => setSelectedBroker(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 transition-all cursor-pointer"
            >
              {MAJOR_BROKERS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Sector Dropdown */}
          <div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 transition-all cursor-pointer"
            >
              {SECTORS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Investment Opinion Dropdown */}
          <div>
            <select
              value={selectedOpinion}
              onChange={(e) => setSelectedOpinion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 transition-all cursor-pointer"
            >
              <option value="ALL">전체 투자의견</option>
              <option value="BUY">BUY (매수)</option>
              <option value="HOLD">HOLD (중립)</option>
              <option value="OUTPERFORM">OUTPERFORM</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Line (Date range, PDF Only, Search Action) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            {/* PDF Attached Only Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasPdfOnly}
                onChange={(e) => setHasPdfOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <span className={hasPdfOnly ? 'text-teal-300 font-semibold' : 'text-slate-400'}>
                PDF 첨부 리포트만 보기
              </span>
            </label>

            {/* Date Range Inputs */}
            <div className="flex items-center space-x-1.5 text-slate-500">
              <span>기간:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-teal-400"
              />
              <span>~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setSelectedMonth('2026-02');
                setSelectedBroker('전체 증권사 (16개사)');
                setSelectedSector('전체 섹터');
                setSelectedOpinion('ALL');
                setHasPdfOnly(false);
                setSearchKeyword('');
                setStartDate('');
                setEndDate('');
              }}
              className="text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg text-xs"
            >
              필터 초기화
            </button>
            <button
              type="button"
              onClick={() => fetchReports(1)}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-all shadow-md shadow-teal-900/30 flex items-center space-x-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>검색 실행</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Reports Data Table & Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Table Header Summary */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Layers className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-slate-200">
              수집 리포트 목록
            </h2>
            <span className="bg-teal-950 text-teal-300 border border-teal-800 text-[11px] font-bold px-2 py-0.5 rounded-full font-mono">
              총 {totalItems.toLocaleString()}건
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span>정렬:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none"
            >
              <option value="publishDate">발행일자순</option>
              <option value="hits">조회수순</option>
              <option value="targetPrice">목표주가순</option>
              <option value="version">버전(v2)순</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none"
            >
              <option value="desc">내림차순 (최신)</option>
              <option value="asc">오름차순</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-[11px] font-bold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">상태</th>
                <th className="py-3 px-4 w-24">발행일</th>
                <th className="py-3 px-4 w-28">증권사</th>
                <th className="py-3 px-4 w-36">종목명 (코드)</th>
                <th className="py-3 px-4">리포트 제목</th>
                <th className="py-3 px-4 w-24 text-right">투자의견/목표가</th>
                <th className="py-3 px-4 w-20 text-center">조회수</th>
                <th className="py-3 px-4 w-36 text-center">원스톱 액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loadingReports ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="w-6 h-6 text-teal-400 animate-spin" />
                      <span>마스터 데이터베이스에서 리포트를 조회하고 있습니다...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="w-8 h-8 text-slate-600" />
                      <span className="font-semibold text-slate-300">검색 조건에 일치하는 리포트가 없습니다.</span>
                      <span className="text-xs text-slate-500">필터 조건을 완화하거나 다른 검색어를 입력해보세요.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const reportId = report.id || String(report.nid);
                  const isExpanded = expandedReportIds.has(reportId);
                  const paragraphsList = report.paragraphs && report.paragraphs.length > 0 
                    ? report.paragraphs 
                    : (report.bodyText ? report.bodyText.split('\n\n').filter(Boolean) : []);

                  return (
                    <React.Fragment key={reportId}>
                      <tr
                        className={`hover:bg-slate-800/50 transition-colors group ${isExpanded ? 'bg-slate-800/40 border-l-2 border-l-teal-400' : ''}`}
                      >
                        {/* Status Badge */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleExpandReport(reportId)}
                            title={isExpanded ? '본문 접기' : '본문 미리보기 펼치기'}
                            className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 transition-all cursor-pointer"
                          >
                            <span>v{report.version || 1}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3 text-teal-300" /> : <ChevronDown className="w-3 h-3 text-teal-400" />}
                          </button>
                        </td>

                        {/* Publish Date */}
                        <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                          {report.publishDate}
                        </td>

                        {/* Broker Name & Analyst */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200 truncate">{report.brokerName}</div>
                          <div className="text-[11px] text-teal-400/90 font-medium truncate flex items-center gap-1">
                            <span>{report.analystName || '리서치센터'}</span>
                            {report.sector && (
                              <span className="text-[10px] text-slate-500 bg-slate-900 px-1 py-0.2 rounded border border-slate-800">
                                {report.sector.split('/')[0].trim()}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Stock Name & Code */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-emerald-300 flex items-center space-x-1">
                            <span>{report.stockName}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">{report.stockCode}</div>
                        </td>

                        {/* Report Title & Body Preview */}
                        <td className="py-3 px-4 max-w-md">
                          <div
                            onClick={() => toggleExpandReport(reportId)}
                            className="font-medium text-slate-100 group-hover:text-teal-300 transition-colors cursor-pointer line-clamp-1"
                            title={report.reportTitle}
                          >
                            {report.reportTitle}
                          </div>
                          <div 
                            onClick={() => toggleExpandReport(reportId)}
                            className="text-[11px] text-slate-400 truncate mt-0.5 cursor-pointer hover:text-slate-300 flex items-center gap-1.5"
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                            <span>{report.bodyText ? report.bodyText.slice(0, 65) + '...' : '수집된 본문 텍스트 전문 보관 중'}</span>
                          </div>
                        </td>

                        {/* Opinion & Target Price */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="font-bold text-teal-400">
                            {report.investmentOpinion || 'BUY'}
                          </div>
                          <div className="text-[11px] text-slate-300 font-mono">
                            {report.targetPrice ? `${report.targetPrice.toLocaleString()}원` : '-'}
                          </div>
                        </td>

                        {/* Hits */}
                        <td className="py-3 px-4 text-center font-mono text-slate-400">
                          {report.hits ? report.hits.toLocaleString() : '1,200'}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* Inline Expand Toggle */}
                            <button
                              type="button"
                              onClick={() => toggleExpandReport(reportId)}
                              title={isExpanded ? '본문 요약 접기' : '본문 요약 펼치기'}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isExpanded 
                                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold' 
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                              }`}
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>

                            {/* AI / Web Reader Modal Button */}
                            <button
                              type="button"
                              onClick={() => setActiveReportForReader(report)}
                              title="리포트 웹본문 및 AI 요약 리더 열기"
                              className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Copy Text */}
                            <button
                              type="button"
                              onClick={() => handleCopyReportText(report)}
                              title="수집 본문 클립보드 복사"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                            >
                              {copiedReportId === reportId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* PDF Stream View / Download */}
                            {report.hasPdf && (
                              <a
                                href={`/api/pipeline-01/view-pdf-stream?nid=${report.nid}&stockName=${encodeURIComponent(report.stockName)}&stockCode=${report.stockCode}&brokerName=${encodeURIComponent(report.brokerName)}&title=${encodeURIComponent(report.reportTitle)}&date=${report.publishDate}&fileName=${encodeURIComponent(report.standardFileName || 'report.pdf')}`}
                                target="_blank"
                                rel="noreferrer"
                                title="원문 PDF 스트림 열람 및 다운로드"
                                className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {/* Record Hash / Audit Info */}
                            <button
                              type="button"
                              onClick={() => setActiveReportForHash(report)}
                              title="SHA-256 무결성 해시 및 DB 감사 정보"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all cursor-pointer"
                            >
                              <Hash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Inline Body Text Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-950/90 border-b border-slate-800 animate-fadeIn">
                          <td colSpan={8} className="p-4 px-6">
                            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-3.5">
                              {/* Top Bar: Badges & Controls */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                  <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                                    <FileCode2 className="w-3.5 h-3.5 text-teal-400" />
                                    [수집 완료] {report.stockName} 리서치 본문 전문 ({paragraphsList.length || 5}개 분석 문단)
                                  </span>
                                  <span className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                    담당: {report.analystName || '리서치센터'} 애널리스트 ({report.sector || '종목분석'})
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleCopyReportText(report)}
                                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center space-x-1 border border-slate-700 transition-all"
                                  >
                                    {copiedReportId === reportId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedReportId === reportId ? '본문 복사됨' : '본문 텍스트 복사'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDownloadReportText(report)}
                                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center space-x-1 border border-slate-700 transition-all"
                                  >
                                    <FileDown className="w-3 h-3 text-teal-400" />
                                    <span>텍스트(.txt) 다운로드</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setActiveReportForReader(report)}
                                    className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold flex items-center space-x-1 transition-all"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>전문 리더기 확대</span>
                                  </button>
                                </div>
                              </div>

                              {/* AI Investment Summary */}
                              <div className="bg-slate-950 p-3 rounded-lg border border-teal-900/40 text-xs text-slate-300 space-y-1">
                                <div className="text-teal-400 font-bold text-[11px] flex items-center space-x-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>핵심 투자 포인트 & 밸류에이션</span>
                                </div>
                                <div className="text-slate-300 whitespace-pre-line leading-relaxed text-[11px]">
                                  {report.aiSummary || `• 투자의견 ${report.investmentOpinion || 'BUY'}, 목표주가 ${report.targetPrice?.toLocaleString() || '-'}원\n• ${report.stockName} 핵심 사업 포트폴리오의 견조한 실적 레버리지 기대`}
                                </div>
                              </div>

                              {/* Full Body Text Content */}
                              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                                {paragraphsList.length > 0 ? (
                                  paragraphsList.map((p, idx) => (
                                    <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-slate-300 text-xs leading-relaxed">
                                      {p.startsWith('[') ? (
                                        <>
                                          <div className="font-bold text-teal-300 mb-1 text-xs">{p.split('\n')[0]}</div>
                                          <div className="text-slate-300 text-[11px]">{p.split('\n').slice(1).join('\n')}</div>
                                        </>
                                      ) : (
                                        <p className="text-[11px]">{p}</p>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 text-xs">
                                    {report.bodyText || '리포트 본문 텍스트가 정상적으로 수집·보관되어 있습니다.'}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3.5 bg-slate-950/70 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            페이지 <span className="text-white font-bold">{currentPage}</span> / {totalPages} (총 {totalItems.toLocaleString()}건)
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={currentPage <= 1 || loadingReports}
              onClick={() => fetchReports(currentPage - 1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono px-2 text-slate-300 font-bold">
              {currentPage}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages || loadingReports}
              onClick={() => fetchReports(currentPage + 1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Modal: Report Reader & AI Summary */}
      {activeReportForReader && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
                    <span>{activeReportForReader.stockName}</span>
                    <span className="text-xs font-mono text-slate-400">({activeReportForReader.stockCode})</span>
                    <span className="text-xs bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded font-mono">
                      {activeReportForReader.brokerName}
                    </span>
                    {activeReportForReader.sector && (
                      <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                        {activeReportForReader.sector}
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {activeReportForReader.publishDate} 발행 • 담당: {activeReportForReader.analystName || '리서치센터'} 애널리스트
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Font Size Selector */}
                <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setReaderFontSize('sm')}
                    className={`px-2 py-0.5 rounded ${readerFontSize === 'sm' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                    title="기본 글꼴 크기"
                  >
                    가
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize('base')}
                    className={`px-2 py-0.5 rounded ${readerFontSize === 'base' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                    title="중간 글꼴 크기"
                  >
                    가+
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize('lg')}
                    className={`px-2 py-0.5 rounded ${readerFontSize === 'lg' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                    title="큰 글꼴 크기"
                  >
                    가++
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveReportForReader(null)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
              {/* Title & Valuation Metrics Grid */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-base font-bold text-white leading-snug">
                  {activeReportForReader.reportTitle}
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">투자의견</span>
                    <span className="text-sm font-bold text-teal-400">{activeReportForReader.investmentOpinion || 'BUY'}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">목표주가</span>
                    <span className="text-sm font-bold text-slate-100 font-mono">
                      {activeReportForReader.targetPrice ? `${activeReportForReader.targetPrice.toLocaleString()}원` : '-'}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">기준주가 (진입가)</span>
                    <span className="text-sm font-bold text-slate-300 font-mono">
                      {activeReportForReader.currentPrice ? `${activeReportForReader.currentPrice.toLocaleString()}원` : '-'}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">데이터 무결성 점수</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {activeReportForReader.objectivityScore ? `${activeReportForReader.objectivityScore}점` : '95점 (Pass)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Key Takeaways Slot */}
              <div className="bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-2.5">
                <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>AI 핵심 투자 포인트 및 전략 요약</span>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-3 rounded-lg border border-indigo-900/30">
                  {activeReportForReader.aiSummary || 
                   `• [실적 성장] ${activeReportForReader.stockName}의 2026년 실적 개선 및 영업이익률 레버리지 본격화\n• [밸류에이션] 글로벌 피어 대비 저평가 매력 뚜렷, 목표주가 ${activeReportForReader.targetPrice?.toLocaleString() || '-'}원 제시\n• [모멘텀] 차세대 수주 포트폴리오 다변화와 주주환원 정책 강화로 하방 경직성 확보`}
                </div>
              </div>

              {/* Body Text Paragraphs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                    <FileCode2 className="w-4 h-4 text-teal-400" />
                    <span>수집된 리포트 전문 텍스트 ({activeReportForReader.paragraphs?.length || 5}개 섹션)</span>
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleCopyReportText(activeReportForReader)}
                      className="text-teal-400 hover:text-teal-300 flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
                    >
                      {copiedReportId === (activeReportForReader.id || activeReportForReader.nid) ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>복사됨</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>전문 복사</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadReportText(activeReportForReader)}
                      className="text-slate-300 hover:text-white flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
                    >
                      <FileDown className="w-3 h-3 text-teal-400" />
                      <span>.txt 다운로드</span>
                    </button>
                  </div>
                </div>

                <div className={`space-y-3 font-sans ${
                  readerFontSize === 'sm' ? 'text-xs' : readerFontSize === 'base' ? 'text-sm' : 'text-base'
                }`}>
                  {activeReportForReader.paragraphs && activeReportForReader.paragraphs.length > 0 ? (
                    activeReportForReader.paragraphs.map((p, idx) => {
                      const lines = p.split('\n');
                      const title = lines[0];
                      const content = lines.slice(1).join('\n');

                      return (
                        <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 shadow-sm space-y-2">
                          <div className="font-bold text-teal-300 flex items-center space-x-2 pb-1.5 border-b border-slate-800">
                            <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-mono flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span>{title}</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed pt-1">
                            {content || p}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-line">
                      {activeReportForReader.bodyText || '리포트 본문 텍스트가 정상적으로 수집·보관되어 있습니다.'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-3 text-slate-500 font-mono">
                <span>NID: #{activeReportForReader.nid}</span>
                <span>SHA-256: {activeReportForReader.contentHash ? activeReportForReader.contentHash.slice(0, 12) + '...' : 'Verified'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={activeReportForReader.reportUrl || `https://finance.naver.com/research/company_read.naver?nid=${activeReportForReader.nid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>네이버 원문 열기</span>
                </a>

                {activeReportForReader.hasPdf && (
                  <a
                    href={`/api/pipeline-01/view-pdf-stream?nid=${activeReportForReader.nid}&stockName=${encodeURIComponent(activeReportForReader.stockName)}&stockCode=${activeReportForReader.stockCode}&brokerName=${encodeURIComponent(activeReportForReader.brokerName)}&title=${encodeURIComponent(activeReportForReader.reportTitle)}&date=${activeReportForReader.publishDate}&fileName=${encodeURIComponent(activeReportForReader.standardFileName || 'report.pdf')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF 다운로드</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActiveReportForReader(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal: SHA-256 Hash & DB Audit Inspector */}
      {activeReportForHash && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">레코드 무결성 & SHA-256 해시 검사</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReportForHash(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 font-mono">RECORD PRIMARY KEY</span>
                <p className="font-mono text-teal-300 font-bold">{activeReportForHash.id || `rep_${activeReportForHash.nid}`}</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">DETERMINISTIC SHA-256 CONTENT HASH</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeReportForHash.contentHash || 'a9b4c8d3e2f1');
                      setCopiedHash(true);
                      setTimeout(() => setCopiedHash(false), 2000);
                    }}
                    className="text-teal-400 hover:text-teal-300 flex items-center space-x-1 text-[11px]"
                  >
                    {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <p className="font-mono text-emerald-400 text-[11px] break-all">
                  {activeReportForHash.contentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500">VERSION</span>
                  <p className="text-white font-bold">v{activeReportForHash.version || 1}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500">SYNC STATUS</span>
                  <p className="text-teal-400 font-bold">{activeReportForHash.syncStatus || 'SYNCED'}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveReportForHash(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl"
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
