import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Layers,
  ArrowRight,
  FileText,
  Building2,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck2,
  HardDrive,
  Cpu,
  History,
  ShieldCheck,
  GitBranch,
  FileDiff,
  Download,
  Info,
  ExternalLink,
  BookOpen,
  FileCode,
  CheckSquare,
  Square,
  X,
  BookMarked
} from 'lucide-react';
import {
  Pipeline01NaverReport,
  ReportDbRecord,
  DbSyncResult,
  DbStorageStats,
  DbSyncStatus
} from '../../types';

interface Pipeline01DatabaseStorageProps {
  currentReports?: Pipeline01NaverReport[];
  selectedMonth?: string;
  onSyncComplete?: (result: DbSyncResult) => void;
  onViewReportArticle?: (report: Pipeline01NaverReport) => void;
  onDownloadPdf?: (report: Pipeline01NaverReport) => void;
  onViewPdfStream?: (report: Pipeline01NaverReport) => void;
  onOpenExternalUrl?: (url: string) => void;
}

export const Pipeline01DatabaseStorage: React.FC<Pipeline01DatabaseStorageProps> = ({
  currentReports = [],
  selectedMonth = '2026-01',
  onSyncComplete,
  onViewReportArticle,
  onDownloadPdf,
  onViewPdfStream,
  onOpenExternalUrl
}) => {
  // DB Stats State
  const [stats, setStats] = useState<DbStorageStats | null>(null);
  const [schemaInfo, setSchemaInfo] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);

  // Stored Records List State
  const [records, setRecords] = useState<ReportDbRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(false);

  // Filter & Search State
  const [filterMonth, setFilterMonth] = useState<string>('ALL');
  const [filterSyncStatus, setFilterSyncStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sync Execution State
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncResult, setLastSyncResult] = useState<DbSyncResult | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Sync Logs History State
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [showLogsModal, setShowLogsModal] = useState<boolean>(false);

  // Schema & Detail Inspector Modals
  const [selectedRecord, setSelectedRecord] = useState<ReportDbRecord | null>(null);
  const [showSchemaModal, setShowSchemaModal] = useState<boolean>(false);
  const [showDocModal, setShowDocModal] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Helper converter: ReportDbRecord -> Pipeline01NaverReport
  const toReport = (r: ReportDbRecord): Pipeline01NaverReport => {
    const nid = r.nid || r.id.replace('rep_', '');
    return {
      nid,
      stockName: r.stockName,
      stockCode: r.stockCode,
      reportTitle: r.reportTitle,
      brokerName: r.brokerName,
      analystName: r.analystName,
      rawDate: r.rawDate || r.publishDate?.slice(2).replace(/-/g, '.') || '26.01.02',
      publishDate: r.publishDate,
      yymmdd: r.yymmdd || r.publishDate?.slice(2).replace(/-/g, '') || '260102',
      month: r.month || r.publishDate?.slice(0, 7) || '2026-01',
      hits: r.hits || 0,
      pdfUrl: r.pdfUrl || '',
      hasPdf: Boolean(r.hasPdf),
      targetPrice: r.targetPrice,
      currentPrice: r.currentPrice,
      investmentOpinion: r.investmentOpinion,
      sector: r.sector,
      attachment_status: r.hasPdf ? 'SUCCESS' : 'NOT_FOUND',
      reportUrl: r.reportUrl || `https://finance.naver.com/research/company_read.naver?nid=${nid}`,
      standardFileName: r.standardFileName || `${r.publishDate?.slice(2).replace(/-/g, '') || '260102'}_${r.brokerName || '증권'}_${r.stockName || '종목'}_${(r.reportTitle || '리포트').replace(/[\/\\:*?"<>|]/g, '_')}.pdf`,
      bodyText: r.bodyText,
      paragraphs: r.paragraphs,
      characterCount: r.characterCount,
      contentHash: r.contentHash,
      dbVersion: r.version,
      dbSyncStatus: r.syncStatus,
      isAIAnalyzed: r.isAIAnalyzed,
      aiSummary: r.aiSummary,
      objectivityScore: r.objectivityScore,
    };
  };

  // Action Handlers
  const handleViewArticle = (r: ReportDbRecord) => {
    const rep = toReport(r);
    if (onViewReportArticle) {
      onViewReportArticle(rep);
    }
  };

  const handleDownloadPdf = (r: ReportDbRecord) => {
    const rep = toReport(r);
    if (onDownloadPdf) {
      onDownloadPdf(rep);
    } else {
      const url = `/api/pipeline-01/download-single-pdf?${new URLSearchParams({
        nid: rep.nid,
        pdfUrl: rep.pdfUrl || '',
        fileName: rep.standardFileName || '',
        stockName: rep.stockName || '',
        stockCode: rep.stockCode || '',
        brokerName: rep.brokerName || '',
        title: rep.reportTitle || '',
        date: rep.publishDate || ''
      }).toString()}`;
      const a = document.createElement('a');
      a.href = url;
      a.download = rep.standardFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleViewPdfStream = (r: ReportDbRecord) => {
    const rep = toReport(r);
    if (onViewPdfStream) {
      onViewPdfStream(rep);
    } else {
      const url = `/api/pipeline-01/view-pdf-stream?${new URLSearchParams({
        nid: rep.nid,
        pdfUrl: rep.pdfUrl || '',
        fileName: rep.standardFileName || '',
        stockName: rep.stockName || '',
        stockCode: rep.stockCode || '',
        brokerName: rep.brokerName || '',
        title: rep.reportTitle || '',
        date: rep.publishDate || ''
      }).toString()}`;
      window.open(url, '_blank');
    }
  };

  const handleOpenNaverUrl = (r: ReportDbRecord) => {
    const url = r.reportUrl || `https://finance.naver.com/research/company_read.naver?nid=${r.nid || r.id.replace('rep_', '')}`;
    if (onOpenExternalUrl) {
      onOpenExternalUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  // Load Database Stats
  const fetchDbStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch('/api/pipeline-01/db/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setSchemaInfo(data.schemaInfo);
      }
    } catch (err) {
      console.error('Fetch DB stats error:', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Load Stored Records
  const fetchDbRecords = async (page = 1) => {
    setIsLoadingRecords(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        month: filterMonth,
        syncStatus: filterSyncStatus,
        search: searchTerm
      });
      const res = await fetch(`/api/pipeline-01/db/records?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Fetch DB records error:', err);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  // Load Sync Logs
  const fetchSyncLogs = async () => {
    try {
      const res = await fetch('/api/pipeline-01/db/sync-logs');
      const data = await res.json();
      if (data.success) {
        setSyncLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Fetch sync logs error:', err);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchDbStats();
    fetchDbRecords(1);
    fetchSyncLogs();
  }, []);

  // Refetch records when filters change
  useEffect(() => {
    fetchDbRecords(1);
  }, [filterMonth, filterSyncStatus, pageSize]);

  // Execute Safe Synchronize (Update only on change)
  const handleExecuteSafeSync = async (reportsToSync: Pipeline01NaverReport[] = currentReports, month = selectedMonth) => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch('/api/pipeline-01/db/sync-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reports: reportsToSync,
          month
        })
      });
      const data: DbSyncResult = await res.json();
      if (data.success) {
        setLastSyncResult(data);
        if (onSyncComplete) onSyncComplete(data);
        // Refresh stats, records, and logs
        await fetchDbStats();
        await fetchDbRecords(1);
        await fetchSyncLogs();
      } else {
        setSyncError((data as any).error || 'DB 동기화 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setSyncError(err.message || '네트워크 통신 오류가 발생했습니다.');
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shadow-inner">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                    차분 안전 데이터베이스 (Safe Diff Storage & AI-Ready Hub)
                  </h2>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    변경 시에만 업데이트 (SHA-256)
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  수집된 리포트 원문 및 본문을 무손실 보존하며, 내용 변경 시에만 안전하게 버전(v1→v2)을 갱신하여 AI 분석에 즉시 활용합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowDocModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/80 rounded-xl transition-all flex items-center gap-2 shadow-sm"
              title="데이터베이스 아키텍처 및 AI 스키마 기술 명세서 열기"
            >
              <BookMarked className="w-4 h-4 text-emerald-400" />
              <span>DB 아키텍처 기술 명세서</span>
            </button>
            <button
              onClick={() => setShowSchemaModal(true)}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all flex items-center gap-2 shadow-sm"
            >
              <FileDiff className="w-4 h-4 text-cyan-400" />
              <span>AI 스키마 설계도</span>
            </button>
            <button
              onClick={() => {
                fetchSyncLogs();
                setShowLogsModal(true);
              }}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all flex items-center gap-2 shadow-sm"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>동기화 이력 ({syncLogs.length}건)</span>
            </button>
            <button
              disabled={isSyncing}
              onClick={() => handleExecuteSafeSync()}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                isSyncing
                  ? 'bg-slate-700 cursor-not-allowed opacity-70'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? '차분 검증 및 DB 저장 중...' : '현재 리포트 DB 안전 저장 (Safe Sync)'}</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">총 DB 저장 리포트</span>
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-slate-100">
              {isLoadingStats ? '...' : (stats?.totalStoredRecords?.toLocaleString() || 0)}
              <span className="text-xs text-slate-400 font-normal ml-1">건</span>
            </div>
            <div className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>무손실 영구 저장</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">원문 PDF 확보율</span>
              <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-cyan-300">
              {isLoadingStats ? '...' : (stats?.pdfSecuredCount?.toLocaleString() || 0)}
              <span className="text-xs text-slate-400 font-normal ml-1">
                ({stats?.totalStoredRecords ? Math.round((stats.pdfSecuredCount / stats.totalStoredRecords) * 100) : 0}%)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              증권사 발행 원본 보존
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">웹 본문 텍스트 연동</span>
              <FileText className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-blue-300">
              {isLoadingStats ? '...' : (stats?.bodyTextExtractedCount?.toLocaleString() || 0)}
              <span className="text-xs text-slate-400 font-normal ml-1">건</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              LLM 입력용 텍스트 확보
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">AI 준비율 (Ready Index)</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-purple-300">
              {isLoadingStats ? '...' : (stats?.aiReadyIndex || 0)}
              <span className="text-xs text-slate-400 font-normal ml-0.5">%</span>
            </div>
            <div className="text-[11px] text-purple-400/90 mt-1">
              임베딩/요약 슬롯 완비
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">버전 관리 (v1 / v2+)</span>
              <GitBranch className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-300">
              {isLoadingStats ? '...' : `${stats?.versionStats?.v1Count || 0} / ${stats?.versionStats?.updatedVersionsCount || 0}`}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              차분 변경 시 버전 승격
            </div>
          </div>
        </div>

        {/* Sync Success / Error Alert Banner */}
        {lastSyncResult && (
          <div className="mt-4 p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl flex items-start justify-between gap-4 animate-fadeIn">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-emerald-200">
                  {lastSyncResult.message}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-emerald-300/80">
                  <span className="px-2 py-0.5 bg-emerald-900/60 rounded border border-emerald-700/50">
                    🟢 신규 저장: {lastSyncResult.insertedCount}건
                  </span>
                  <span className="px-2 py-0.5 bg-amber-900/60 rounded border border-amber-700/50 text-amber-300">
                    🟡 변경 업데이트: {lastSyncResult.updatedCount}건
                  </span>
                  <span className="px-2 py-0.5 bg-slate-800/80 rounded border border-slate-700 text-slate-300">
                    ⚪ 변경 없음 (중복 쓰기 방지): {lastSyncResult.skippedCount}건
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    동기화 시각: {new Date(lastSyncResult.syncedAt).toLocaleTimeString()} ({lastSyncResult.durationMs}ms)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setLastSyncResult(null)}
              className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 bg-slate-900/50 rounded"
            >
              닫기
            </button>
          </div>
        )}

        {syncError && (
          <div className="mt-4 p-4 bg-rose-950/60 border border-rose-800/80 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div className="text-sm text-rose-200">{syncError}</div>
            </div>
            <button
              onClick={() => setSyncError(null)}
              className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 bg-slate-900/50 rounded"
            >
              닫기
            </button>
          </div>
        )}
      </div>

      {/* Storage Filter and Search Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">발행 월:</span>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">전체 월 (All Months)</option>
              <option value="2026-01">2026년 1월 (전수 815건)</option>
              <option value="2026-02">2026년 2월 (실적 시즌)</option>
              <option value="2026-03">2026년 3월 (주총 시즌)</option>
              <option value="2026-04">2026년 4월</option>
            </select>
          </div>

          {/* Sync Status Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">동기화 상태:</span>
            <select
              value={filterSyncStatus}
              onChange={(e) => setFilterSyncStatus(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">전체 상태 (All)</option>
              <option value="INSERTED">🟢 신규 저장 (v1)</option>
              <option value="UPDATED">🟡 변경 업데이트 (v2+)</option>
              <option value="UNCHANGED">⚪ 변경 없음 (Unchanged)</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 pl-2">
            총 <span className="font-semibold text-emerald-400">{totalCount.toLocaleString()}</span>건 조회됨
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="종목명, 종목코드, 증권사, 연구원 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchDbRecords(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => fetchDbRecords(1)}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
          >
            검색
          </button>
        </div>
      </div>

      {/* Database Stored Records Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200">
              데이터베이스 보존 레코드 목록 (Master DB Stored Records)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>페이지 당:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300"
            >
              <option value={10}>10건</option>
              <option value={20}>20건</option>
              <option value={50}>50건</option>
              <option value={100}>100건</option>
            </select>
          </div>
        </div>

        {isLoadingRecords ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto opacity-80" />
            <p className="text-sm">데이터베이스 레코드를 안전하게 조회하는 중입니다...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <HardDrive className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-medium text-slate-300">저장된 데이터베이스 레코드가 없습니다.</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              상단의 [현재 리포트 DB 안전 저장 (Safe Sync)] 버튼을 클릭하여 수집된 데이터를 영구 DB에 저장하십시오.
            </p>
            <button
              onClick={() => handleExecuteSafeSync()}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg"
            >
              지금 데이터베이스에 저장하기
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3 w-14 text-center">버전</th>
                  <th className="py-3 px-3 w-24">발행일자</th>
                  <th className="py-3 px-3 w-32">종목명 (코드)</th>
                  <th className="py-3 px-3 w-28">증권사 / 연구원</th>
                  <th className="py-3 px-3 min-w-[200px]">리포트 제목 & 원문/본문 상태</th>
                  <th className="py-3 px-3 w-24 text-right">목표가 / 의견</th>
                  <th className="py-3 px-3 w-28 text-center">차분 해시</th>
                  <th className="py-3 px-3 w-24 text-center">AI 슬롯</th>
                  <th className="py-3 px-3 w-64 text-center">리포트 열람 / PDF 다운로드 / DB 액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {records.map((r) => {
                  const isV1 = !r.version || r.version === 1;
                  const hasBody = Boolean(r.bodyText && r.bodyText.length > 50);
                  const hashShort = r.contentHash ? `${r.contentHash.slice(0, 8)}...` : 'N/A';

                  return (
                    <tr key={r.id || r.nid} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold rounded-md ${
                            isV1
                              ? 'bg-slate-800 text-slate-300 border border-slate-700'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          v{r.version || 1}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-400">
                        <div className="font-medium text-slate-200">{r.publishDate}</div>
                        <div className="text-[11px] text-slate-500">{r.month}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div
                          onClick={() => handleViewArticle(r)}
                          className="font-bold text-slate-100 hover:text-emerald-400 cursor-pointer flex items-center gap-1 group/name"
                          title="클릭하여 웹 리포트 본문 리더 열기"
                        >
                          <span>{r.stockName}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover/name:opacity-100 text-emerald-400 transition-opacity" />
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{r.stockCode}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-200 font-medium">{r.brokerName}</div>
                        <div className="text-[11px] text-slate-400">{r.analystName || '리서치센터'}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div
                          onClick={() => handleViewArticle(r)}
                          className="font-medium text-slate-100 line-clamp-1 group-hover:text-emerald-300 transition-colors cursor-pointer"
                          title="클릭하여 웹 리포트 본문 리더 열기"
                        >
                          {r.reportTitle}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {r.hasPdf ? (
                            <button
                              onClick={() => handleViewPdfStream(r)}
                              className="px-1.5 py-0.5 text-[10px] bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/80 rounded flex items-center gap-1 transition-colors"
                              title="증권사 발행 PDF 원문 스트림 보기"
                            >
                              <FileCheck2 className="w-3 h-3 text-emerald-400" />
                              <span>PDF원문 확보</span>
                            </button>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[10px] bg-slate-900 text-slate-500 border border-slate-800 rounded">
                              원문부재
                            </span>
                          )}

                          {hasBody ? (
                            <button
                              onClick={() => handleViewArticle(r)}
                              className="px-1.5 py-0.5 text-[10px] bg-blue-950/80 text-blue-300 border border-blue-800/80 rounded cursor-pointer hover:bg-blue-900 flex items-center gap-1 transition-colors"
                              title="웹 게시글 텍스트 전문 리더 열기"
                            >
                              <FileText className="w-3 h-3 text-blue-400" />
                              <span>본문 ({r.bodyText?.length}자)</span>
                            </button>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[10px] bg-slate-900 text-slate-500 border border-slate-800 rounded">
                              본문미수집
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="font-bold text-slate-100">
                          {r.targetPrice ? `${r.targetPrice.toLocaleString()}원` : '-'}
                        </div>
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-950 text-emerald-400 rounded">
                          {r.investmentOpinion || 'BUY'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div
                          onClick={() => copyToClipboard(r.contentHash, r.id)}
                          className="font-mono text-[11px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 inline-flex items-center gap-1 cursor-pointer hover:border-emerald-700 hover:text-slate-200 transition-colors"
                          title="클릭하여 SHA-256 해시 복사"
                        >
                          <span>{hashShort}</span>
                          {copiedHash === r.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-600" />
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/80 rounded-full flex items-center justify-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>AI 준비</span>
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. Web Article Reader */}
                          <button
                            onClick={() => handleViewArticle(r)}
                            className="px-2 py-1.5 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/80 rounded-lg transition-all flex items-center gap-1 shadow-sm"
                            title="게시판 웹 본문 읽기 및 AI 요약 리더"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[11px] font-medium hidden sm:inline">본문보기</span>
                          </button>

                          {/* 2. PDF Download */}
                          {r.hasPdf ? (
                            <button
                              onClick={() => handleDownloadPdf(r)}
                              className="px-2 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 rounded-lg transition-all flex items-center gap-1 shadow-sm"
                              title="증권사 제공 리포트 PDF 파일 다운로드 (내 PC 저장)"
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[11px] font-medium hidden sm:inline">PDF다운</span>
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-2 py-1.5 bg-slate-900 text-slate-600 border border-slate-800 rounded-lg cursor-not-allowed flex items-center gap-1 opacity-50"
                              title="증권사에서 제공한 원문 PDF가 없는 리포트입니다"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-600" />
                              <span className="text-[11px] font-medium hidden sm:inline">PDF없음</span>
                            </button>
                          )}

                          {/* 3. PDF Stream Viewer */}
                          {r.hasPdf && (
                            <button
                              onClick={() => handleViewPdfStream(r)}
                              className="p-1.5 bg-slate-800 hover:bg-cyan-900 text-cyan-300 hover:border-cyan-700 border border-slate-700 rounded-lg transition-all"
                              title="증권사 PDF 스트림 바로보기"
                            >
                              <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            </button>
                          )}

                          {/* 4. Naver Research External Link */}
                          <button
                            onClick={() => handleOpenNaverUrl(r)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg transition-all"
                            title="네이버 증권 원문 게시글 새 창에서 열기"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          {/* 5. Database Record Inspector */}
                          <button
                            onClick={() => setSelectedRecord(r)}
                            className="p-1.5 bg-slate-800 hover:bg-purple-900 text-purple-300 hover:border-purple-700 border border-slate-700 rounded-lg transition-all"
                            title="DB 레코드 스키마 및 감사 이력 상세 검사"
                          >
                            <Database className="w-3.5 h-3.5 text-purple-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            총 <span className="font-semibold text-slate-200">{totalCount}</span>개 레코드 중{' '}
            <span className="font-semibold text-slate-200">{((currentPage - 1) * pageSize) + 1}</span> -{' '}
            <span className="font-semibold text-slate-200">{Math.min(currentPage * pageSize, totalCount)}</span> 표시
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => fetchDbRecords(currentPage - 1)}
              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-lg">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => fetchDbRecords(currentPage + 1)}
              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SCHEMA BLUEPRINT MODAL */}
      {showSchemaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                  <FileDiff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    AI 분석 친화적 데이터베이스 스키마 설계도 (Schema Blueprint)
                  </h3>
                  <p className="text-xs text-slate-400">
                    수석 데이터베이스 아키텍트(Senior DB Architect) 권장 규격 준수
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSchemaModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-3 py-1.5 bg-slate-800 rounded-lg"
              >
                닫기 (ESC)
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              {/* Architecture 4 Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    1. 무손실 원본 보존 (Raw Data)
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    크롤링 원문 HTML, 원본 PDF 바이너리 파일 경로, 증권사 고유 메타데이터를 수정 없이 100% 영구 보존합니다.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    2. AI 분석 친화 구조 (AI-Ready)
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    768차원 텍스트 임베딩 벡터 슬롯(embeddingVector), AI 요약(aiSummary), 객관성 지수 및 감성 점수를 기본 탑재합니다.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4" />
                    3. 차분 변경 감지 (Update-on-Change)
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    SHA-256 결정론적 해시로 내용 변경을 실시간 감지하여, 데이터가 변경된 경우에만 버전을 승격(v1→v2)하고 변경 로그를 남깁니다.
                  </p>
                </div>
              </div>

              {/* JSON Schema Definition */}
              <div className="space-y-2">
                <div className="font-bold text-slate-200 text-xs">엔티티 상세 스키마 정의 (JSON Schema draft-07)</div>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`{
  "entity": "Report",
  "storageEngine": "Cloud Firestore & JSON Master Store",
  "changeDetection": "SHA-256 Deterministic Content Hash",
  "fields": {
    "id": "string (Primary Key, e.g. rep_88888)",
    "nid": "string (Naver Research Article Unique ID)",
    "stockCode": "string (6-digit KRX code, e.g. 005930)",
    "stockName": "string (Official company name)",
    "brokerName": "string (Securities firm name)",
    "analystName": "string (Publishing analyst)",
    "publishDate": "string (YYYY-MM-DD)",
    "targetPrice": "number (KRW)",
    "currentPrice": "number (KRW)",
    "investmentOpinion": "string (BUY / HOLD / SELL)",
    "bodyText": "string (Extracted article text for LLM RAG)",
    "paragraphs": "string[] (Structured paragraph array)",
    "contentHash": "string (SHA-256 content signature)",
    "version": "number (Monotonically incrementing schema version)",
    "syncStatus": "'INSERTED' | 'UPDATED' | 'UNCHANGED'",
    "firstSavedAt": "string (ISO timestamp)",
    "lastUpdatedAt": "string (ISO timestamp)",
    "changeLog": "[{ timestamp, version, changedFields, prevHash, newHash, reason }]",
    "embeddingVector": "number[] (768-dim vector embeddings slot)",
    "aiSummary": "string (LLM key takeaways)",
    "objectivityScore": "number (0-100)",
    "sentimentScore": "number (-1.0 ~ +1.0)"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECORD DETAIL & CHANGELOG INSPECTOR MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-100">
                      {selectedRecord.stockName} <span className="font-mono text-slate-400 font-normal">({selectedRecord.stockCode})</span>
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800 rounded">
                      버전 v{selectedRecord.version || 1}
                    </span>
                    {selectedRecord.hasPdf ? (
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded flex items-center gap-1">
                        <FileCheck2 className="w-3 h-3" />
                        PDF확보
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[11px] bg-slate-900 text-slate-400 border border-slate-800 rounded">
                        원문부재
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {selectedRecord.brokerName} · {selectedRecord.publishDate} · {selectedRecord.reportTitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const rep = toReport(selectedRecord);
                    setSelectedRecord(null);
                    handleViewArticle(selectedRecord);
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <BookOpen className="w-4 h-4 text-slate-950" />
                  <span>웹본문/요약 읽기</span>
                </button>

                {selectedRecord.hasPdf && (
                  <button
                    onClick={() => handleDownloadPdf(selectedRecord)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF 다운로드</span>
                  </button>
                )}

                {selectedRecord.hasPdf && (
                  <button
                    onClick={() => {
                      const rep = toReport(selectedRecord);
                      setSelectedRecord(null);
                      handleViewPdfStream(selectedRecord);
                    }}
                    className="px-3 py-1.5 bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/80 rounded-lg text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>PDF 뷰어</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-slate-400 hover:text-slate-200 text-xs px-2.5 py-1.5 bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              {/* Primary Key & Hash Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[11px]">레코드 식별자 (ID):</span>
                  <div className="font-mono text-slate-200 mt-0.5 font-bold">{selectedRecord.id}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">발행 증권사 & 연구원:</span>
                  <div className="text-slate-200 mt-0.5">{selectedRecord.brokerName} / {selectedRecord.analystName || '리서치센터'}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">목표주가 / 투자의견:</span>
                  <div className="text-slate-200 mt-0.5 font-semibold">
                    {selectedRecord.targetPrice ? `${selectedRecord.targetPrice.toLocaleString()}원` : 'N/A'} ({selectedRecord.investmentOpinion || 'BUY'})
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">표준 파일명:</span>
                  <div className="text-slate-300 mt-0.5 font-mono text-[10px] truncate" title={selectedRecord.standardFileName}>
                    {selectedRecord.standardFileName || 'N/A'}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 text-[11px]">SHA-256 콘텐츠 해시 (차분 감지용):</span>
                  <div className="font-mono text-emerald-400 mt-0.5 break-all text-[11px] bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    {selectedRecord.contentHash}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">최초 등록 시각:</span>
                  <div className="text-slate-300 mt-0.5">{selectedRecord.firstSavedAt || selectedRecord.publishDate}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">최근 변경 갱신 시각:</span>
                  <div className="text-slate-300 mt-0.5">{selectedRecord.lastUpdatedAt || selectedRecord.publishDate}</div>
                </div>
              </div>

              {/* Action Toolbar Callout */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <BookMarked className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-200 font-medium">
                    본 리포트의 원문과 본문을 열람하거나 다운로드할 수 있습니다:
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      const rep = toReport(selectedRecord);
                      setSelectedRecord(null);
                      handleViewArticle(selectedRecord);
                    }}
                    className="px-3 py-1.5 bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-800 rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>웹본문 전문 리더 열기</span>
                  </button>

                  {selectedRecord.hasPdf && (
                    <button
                      onClick={() => handleDownloadPdf(selectedRecord)}
                      className="px-3 py-1.5 bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 rounded-lg text-xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>증권사 원문 PDF 다운로드</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenNaverUrl(selectedRecord)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>네이버 원문 페이지 새 창</span>
                  </button>
                </div>
              </div>

              {/* Change Log History */}
              <div className="space-y-2">
                <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <History className="w-4 h-4 text-amber-400" />
                  <span>차분 변경 이력 (Change Audit Log)</span>
                </div>
                {selectedRecord.changeLog && selectedRecord.changeLog.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRecord.changeLog.map((log, idx) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                          <span className="font-semibold text-amber-300">버전 v{log.version}</span>
                          <span className="text-[11px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-500">사유: </span>{log.reason}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          <span className="text-slate-500">변경 항목: </span>{log.changedFields?.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-500 text-center">
                    초기 등록(v1) 이후 내용 변경이 발생하지 않았습니다.
                  </div>
                )}
              </div>

              {/* Extracted Body Text Slot */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>웹 본문 / PDF 텍스트 (LLM RAG 입력 데이터)</span>
                  </div>
                  {selectedRecord.bodyText && (
                    <span className="text-[11px] text-slate-400">
                      총 {selectedRecord.bodyText.length.toLocaleString()}자 확보됨
                    </span>
                  )}
                </div>
                {selectedRecord.bodyText ? (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 max-h-48 overflow-y-auto leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedRecord.bodyText}
                  </div>
                ) : (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-500 text-center">
                    연동된 웹 본문 텍스트가 없습니다. 상단 [웹본문/요약 읽기] 버튼을 누르면 실시간 크롤링하여 본문을 표시합니다.
                  </div>
                )}
              </div>

              {/* AI Vector & Analysis Schema Slot */}
              <div className="space-y-2">
                <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI 분석 메타데이터 슬롯 (AI Metadata Slots)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[11px]">AI 객관성 평가 점수:</span>
                    <div className="text-sm font-bold text-purple-300 mt-0.5">
                      {selectedRecord.objectivityScore ? `${selectedRecord.objectivityScore}점` : '미평가 (90점 슬롯 준비)'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">AI 감성 분석 톤:</span>
                    <div className="text-sm font-bold text-emerald-300 mt-0.5">
                      {selectedRecord.sentimentScore !== undefined ? `${selectedRecord.sentimentScore > 0 ? '+' : ''}${selectedRecord.sentimentScore}` : '+0.35 (슬롯 준비)'}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 text-[11px]">텍스트 임베딩 벡터 슬롯 (768차원):</span>
                    <div className="font-mono text-[11px] text-cyan-400 mt-0.5">
                      {selectedRecord.embeddingVector && selectedRecord.embeddingVector.length > 0
                        ? `[${selectedRecord.embeddingVector.slice(0, 5).join(', ')} ... (${selectedRecord.embeddingVector.length} dims)]`
                        : '[Float32Array: 768 dimensions RAG Vector Ready]'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Storage: Master JSON DB & Cloud Firestore Sync Ready
              </span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE DB ARCHITECTURE & AI SCHEMA SPECIFICATION DOCUMENT MODAL */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-fadeIn">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <BookMarked className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-100">
                      데이터베이스 아키텍처 및 AI 스키마 기술 명세서
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full">
                      v2.4 Production Spec
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    네이버 금융 종목 리서치 크롤링 데이터 및 증권사 원본 PDF 통합 저장·AI 분석(RAG/LLM) 아키텍처
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-3 py-1.5 bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>닫기</span>
              </button>
            </div>

            {/* Document Content */}
            <div className="p-6 overflow-y-auto space-y-8 text-xs text-slate-300 leading-relaxed">
              {/* Section 1: Overview & 4 Pillars */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 border-b border-slate-800 pb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>1. 아키텍처 개요 및 4대 핵심 설계 원칙 (Core Architectural Principles)</span>
                </div>
                <p className="text-slate-300 text-xs">
                  본 시스템은 대규모 증권사 리포트 및 네이버 금융 웹 게시판 데이터를 안전하게 수집하고, 데이터 변경 시에만 차분(Safe-Diff)을 적용하여 저장하며, 향후 Gemini/LLM AI RAG(검색 증강 생성) 및 머신러닝 분석에 즉각 활용될 수 있도록 설계된 차세대 데이터베이스 아키텍처입니다.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>원칙 1: 무손실 원본 보존 (Raw Data Retention)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      크롤링한 원문 HTML 본문, 증권사 원본 PDF 바이너리 파일 경로, 네이버 게시판 고유 메타데이터(NID, 게시일, 증권사명 등)를 가공 없이 원형 그대로 영구 보존합니다.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                      <GitBranch className="w-4 h-4" />
                      <span>원칙 2: SHA-256 차분 감지 및 멱등 업데이트 (Safe Diff Engine)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      수집된 데이터의 핵심 필드들을 결합하여 결정론적 SHA-256 해시를 생성합니다. 기존 DB의 해시와 비교하여 <strong>내용이 변경된 경우에만 버전을 승격(v1→v2)</strong>하고 변경 감사 로그를 기록하여 중복 쓰기를 완벽히 방지합니다.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-purple-400 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>원칙 3: AI RAG 및 분석 친화 슬롯 완비 (AI-Ready Schema)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      768차원 고밀도 텍스트 임베딩 벡터 슬롯(embeddingVector), LLM 핵심 요약(aiSummary), 객관성 지수(objectivityScore), 감성 점수(sentimentScore) 전용 필드를 스키마에 내장하여 즉시 AI 파이프라인에 연결됩니다.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-cyan-400 flex items-center gap-1.5 text-xs">
                      <HardDrive className="w-4 h-4" />
                      <span>원칙 4: 이중 영속 계층 (Dual Persistence Tier)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      안정적인 로컬 마스터 JSON 데이터베이스(Master JSON Repository)와 클라우드 분산 데이터베이스(Google Cloud Firestore)를 연동하여 오프라인 캐싱 및 클라우드 동기화를 동시에 보장합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Schema Columns Specification Table */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 border-b border-slate-800 pb-2">
                  <Database className="w-4 h-4" />
                  <span>2. 엔티티 및 테이블 스키마 상세 명세 (Schema Entity Specs)</span>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                        <th className="py-2.5 px-3">컬럼명 (Field)</th>
                        <th className="py-2.5 px-3">타입 (Type)</th>
                        <th className="py-2.5 px-3">제약조건</th>
                        <th className="py-2.5 px-3">설명 및 비즈니스 로직</th>
                        <th className="py-2.5 px-3">AI / RAG 역할</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      <tr>
                        <td className="py-2 px-3 text-emerald-400 font-bold">id</td>
                        <td className="py-2 px-3 text-slate-300">string</td>
                        <td className="py-2 px-3 text-amber-400 font-bold">PK (Unique)</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">고유 레코드 ID (예: `rep_12345`)</td>
                        <td className="py-2 px-3 text-slate-400 font-sans">고유 식별자</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-emerald-400">nid</td>
                        <td className="py-2 px-3 text-slate-300">string</td>
                        <td className="py-2 px-3 text-slate-400">Indexed</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">네이버 증권 리서치 게시글 고유 식별 번호</td>
                        <td className="py-2 px-3 text-slate-400 font-sans">원천 소스 매핑</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-emerald-400">stockCode / Name</td>
                        <td className="py-2 px-3 text-slate-300">string</td>
                        <td className="py-2 px-3 text-slate-400">Indexed</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">6자리 KRX 종목코드 및 정식 종목명</td>
                        <td className="py-2 px-3 text-slate-400 font-sans">종목별 AI 필터링</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-emerald-400">brokerName / Analyst</td>
                        <td className="py-2 px-3 text-slate-300">string</td>
                        <td className="py-2 px-3 text-slate-400">Indexed</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">발행 증권사명 및 담당 연구원명</td>
                        <td className="py-2 px-3 text-slate-400 font-sans">증권사별 성향/신뢰도 분석</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-emerald-400">publishDate / yymmdd</td>
                        <td className="py-2 px-3 text-slate-300">string</td>
                        <td className="py-2 px-3 text-slate-400">Indexed</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">발행 일자 (`YYYY-MM-DD`, `YYMMDD`)</td>
                        <td className="py-2 px-3 text-slate-400 font-sans">시계열 트렌드 분석</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-emerald-400">targetPrice / Opinion</td>
                        <td className="py-2 px-3 text-slate-300">number / string</td>
                        <td className="py-2 px-3 text-slate-400">Nullable</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">목표주가(원) 및 투자의견 (BUY/HOLD 등)</td>
                        <td className="py-2 px-3 text-slate-400 font-sans">정량적 예측 모델링</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-cyan-400 font-bold">bodyText / paragraphs</td>
                        <td className="py-2 px-3 text-slate-300">string / string[]</td>
                        <td className="py-2 px-3 text-slate-400">Nullable</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">정제된 웹 본문 텍스트 및 단락 배열</td>
                        <td className="py-2 px-3 text-purple-300 font-bold font-sans">LLM 프롬프트 & RAG 원문</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-cyan-400 font-bold">pdfUrl / standardFileName</td>
                        <td className="py-2 px-3 text-slate-300">string</td>
                        <td className="py-2 px-3 text-slate-400">Nullable</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">증권사 PDF 다운로드 URL 및 표준 명명 파일명</td>
                        <td className="py-2 px-3 text-slate-400 font-sans">원문 바이너리 확보</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-amber-400 font-bold">contentHash</td>
                        <td className="py-2 px-3 text-slate-300">string (64-hex)</td>
                        <td className="py-2 px-3 text-slate-400">Indexed</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">SHA-256 결정론적 내용 검증 시그니처</td>
                        <td className="py-2 px-3 text-amber-300 font-sans">차분 변경 감지 & 멱등성</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-amber-400 font-bold">version / changeLog</td>
                        <td className="py-2 px-3 text-slate-300">number / array</td>
                        <td className="py-2 px-3 text-slate-400">Default: 1</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">단조 증가 버전 번호 및 상세 변경 감사 이력</td>
                        <td className="py-2 px-3 text-amber-300 font-sans">데이터 신뢰성 검증 감사</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-purple-400 font-bold">embeddingVector</td>
                        <td className="py-2 px-3 text-slate-300">number[] (768-dim)</td>
                        <td className="py-2 px-3 text-slate-400">Nullable</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">Gemini text-embedding-004 벡터 임베딩</td>
                        <td className="py-2 px-3 text-purple-300 font-bold font-sans">RAG 유사도 코사인 검색</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-purple-400 font-bold">objectivity / sentiment</td>
                        <td className="py-2 px-3 text-slate-300">number / number</td>
                        <td className="py-2 px-3 text-slate-400">Nullable</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">AI 객관성 평가 점수(0~100) 및 감성 점수(-1~+1)</td>
                        <td className="py-2 px-3 text-purple-300 font-bold font-sans">정량적 시장 감성 지표</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Safe-Diff Sync Workflow Diagram */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>3. 차분 감지 및 안전 동기화 파이프라인 (Safe-Diff Pipeline Flow)</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-[11px]">
                  <div className="text-slate-300">
                    [1. 데이터 수집] 네이버 금융 리서치 목록 및 본문 웹 크롤링 수집
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;↓
                    <br />
                    [2. 해시 계산] SHA256(stockCode + title + broker + publishDate + targetPrice + opinion + bodyText + pdfUrl)
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;↓
                    <br />
                    [3. 기존 DB 조회] `id` (rep_NID) 기준으로 기존 레코드 존재 여부 및 기존 `contentHash` 비교
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;↓
                    <br />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-2 font-sans">
                      <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-300 text-xs">
                        <strong>🟢 Case A: 신규 레코드</strong>
                        <div className="text-[11px] text-slate-300 mt-1">version = 1 로 DB에 신규 INSERT 등록</div>
                      </div>
                      <div className="p-2.5 bg-amber-950/60 border border-amber-800/80 rounded-lg text-amber-300 text-xs">
                        <strong>🟡 Case B: 내용 변경 감지</strong>
                        <div className="text-[11px] text-slate-300 mt-1">version = prev + 1 로 승격, changeLog 기록 후 UPDATE</div>
                      </div>
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 text-xs">
                        <strong>⚪ Case C: 해시 일치 (변경 없음)</strong>
                        <div className="text-[11px] text-slate-400 mt-1">불필요한 쓰기 생략 (SKIP / 멱등성 유지)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: AI RAG & Vector Integration */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-purple-400 border-b border-slate-800 pb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>4. AI RAG(검색 증강 생성) & 머신러닝 연동 파이프라인</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="font-bold text-purple-300 text-xs flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      <span>임베딩 벡터화 (Embedding-004)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      리포트 본문 텍스트(`bodyText`)를 의미 단위 단락(`paragraphs`)으로 청킹한 뒤, Google Gemini `text-embedding-004` 모델을 통해 768차원 고밀도 벡터로 변환하여 `embeddingVector` 컬럼에 저장합니다.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>RAG 질의응답 및 감성 분석</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      사용자 질의(예: "2026년 반도체 HBM 공급 전망은?") 발생 시, 코사인 유사도 검색으로 상위 관련 리포트를 추출하여 LLM 프롬프트에 주입하고 신뢰성 있는 근거 기반 답변을 생성합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Confidential · Rebon Associates AI Architecture Specification
              </span>
              <button
                onClick={() => setShowDocModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs transition-colors"
              >
                확인 완료 (명세서 닫기)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SYNC AUDIT LOGS MODAL */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    데이터베이스 동기화 감사 이력 (Sync Audit History)
                  </h3>
                  <p className="text-xs text-slate-400">
                    차분 동기화 배치 실행 내역 및 중복 쓰기 방지 통계
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-3 py-1.5 bg-slate-800 rounded-lg"
              >
                닫기 (ESC)
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 text-xs text-slate-300">
              {syncLogs.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  기록된 동기화 감사 로그가 없습니다.
                </div>
              ) : (
                syncLogs.map((log, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-200 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px]">
                          {log.targetMonth || 'ALL'}
                        </span>
                        <span>{log.message || '동기화 완료'}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(log.syncedAt || log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                      <span>검사: {log.totalChecked}건</span>
                      <span className="text-emerald-400 font-medium">신규: {log.insertedCount}건</span>
                      <span className="text-amber-400 font-medium">변경: {log.updatedCount}건</span>
                      <span className="text-slate-500 font-medium">유지(스킵): {log.skippedCount}건</span>
                      <span>소요: {log.durationMs}ms</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
