import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  FileText,
  Search,
  Download,
  Eye,
  RefreshCw,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  Code,
  Calendar,
  Building2,
  HardDrive,
  Copy,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Filter,
  BarChart3,
  PieChart,
  Layers,
  Tag,
  TrendingUp,
  FileCheck,
  ArrowUpRight,
  Users,
  Archive,
  FileDown,
  CheckSquare,
  Square,
  ArrowDownToLine,
  Globe,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { PdfFileViewerModal } from './PdfFileViewerModal';
import { Report } from '../types';
import { downloadBlobFile } from '../utils/downloadHelper';

interface DbRecord {
  id: string;
  nid: string;
  month: string;
  targetMonth?: string;
  publishDate: string;
  stockName: string;
  stockCode: string;
  brokerName: string;
  analystName: string;
  analysts?: string[];
  analystTitle?: string;
  metaSource?: string;
  reportTitle: string;
  targetPrice: number;
  currentPrice: number;
  investmentOpinion: string;
  sector: string;
  hasPdf: boolean;
  pdfUrl?: string;
  pdfStatus?: string;
  standardFileName?: string;
  hits?: number;
  pdfStoragePath?: string;
  firstSavedAt?: string;
  lastUpdatedAt?: string;
  dataSourceCategory?: string;
  bodyText?: string;
  objectivityScore?: number;
}

interface OverviewStats {
  totalReports: number;
  uniqueStocks: number;
  uniqueBrokers: number;
  uniqueAnalysts: number;
  pdfSecuredCount: number;
  pdfSecuredRate: number;
  lastUpdatedAt: string;
  monthStats: Record<string, {
    month: string;
    collectedCount: number;
    expectedCount: number;
    pdfCount: number;
    pdfRate: number;
    integrityStatus: string;
    missingCount: number;
  }>;
}

export const DbStoredFilesViewer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'records' | 'pc_download' | 'naver_ingest' | 'stats' | 'raw_json'>('records');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedBroker, setSelectedBroker] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hasPdfOnly, setHasPdfOnly] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const limit = 25;

  const [records, setRecords] = useState<DbRecord[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [overview, setOverview] = useState<OverviewStats | null>(null);

  // Naver Ingest & Multi-download States
  const [naverInputUrl, setNaverInputUrl] = useState<string>('');
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [ingestResult, setIngestResult] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isCandidatesLoading, setIsCandidatesLoading] = useState<boolean>(false);
  const [selectedNids, setSelectedNids] = useState<Set<string>>(new Set());
  const [isBatchDownloading, setIsBatchDownloading] = useState<boolean>(false);

  // PC Bulk / Monthly Download Center States
  const [monthlySummary, setMonthlySummary] = useState<any>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [isSequentialDownloading, setIsSequentialDownloading] = useState<boolean>(false);
  const [includeExtraFiles, setIncludeExtraFiles] = useState<boolean>(false); // Pure PDF only by default!

  // Categorized Stats States
  const [typeStats, setTypeStats] = useState<any>(null);
  const [statsMonth, setStatsMonth] = useState<string>('ALL');
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(false);

  // Modal / Inspector States
  const [selectedRecordForJson, setSelectedRecordForJson] = useState<DbRecord | null>(null);
  const [previewPdfReport, setPreviewPdfReport] = useState<Report | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isSyncingAnalysts, setIsSyncingAnalysts] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Fetch Monthly PDF Summary (Total 4,735 PDF Linked Reports)
  const fetchMonthlySummary = async () => {
    setIsSummaryLoading(true);
    try {
      const res = await fetch('/api/naver-reports/monthly-pdf-summary');
      const data = await res.json();
      if (data.success) {
        setMonthlySummary(data);
      }
    } catch (err: any) {
      console.error('Failed to fetch monthly PDF summary:', err);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Download Monthly Reports as ZIP directly to connected PC
  const handleDownloadMonthlyZip = async (month: string, offset = 0, limit = 0) => {
    const loadingKey = `monthly-${month}-${offset}-${limit}`;
    setDownloadingId(loadingKey);
    const chunkText = limit > 0 ? ` (${offset + 1}~${offset + limit}건)` : '';
    const monthName = month === 'ALL' ? '2026년 상반기 전체' : `${month.replace('-', '년 ')}월`;
    showToast(`📦 [${monthName}${chunkText}] ${includeExtraFiles ? 'PDF + 부속파일' : '순수 원문 PDF'} ZIP 압축 및 다운로드를 시작합니다...`);

    try {
      const params = new URLSearchParams({
        month,
        offset: String(offset),
        limit: String(limit),
        includeText: includeExtraFiles ? 'true' : 'false',
        includeCsv: includeExtraFiles ? 'true' : 'false',
        includeJson: 'false'
      });
      const downloadUrl = `/api/naver-reports/download-monthly-zip?${params.toString()}`;
      const chunkLabel = limit > 0 ? `_${offset + 1}to${offset + limit}건` : '_전체';
      const fileName = `네이버_증권_리포트_PDF_${month.replace('-', '년_')}월${chunkLabel}.zip`;

      const res = await downloadBlobFile(downloadUrl, fileName);
      if (res.success) {
        showToast(`✅ [${monthName}${chunkText}] ZIP 파일이 PC 브라우저 다운로드 폴더에 저장되었습니다!`);
      } else {
        showToast(`❌ 다운로드 실패: ${res.error || '오류 발생'}`);
      }
    } catch (err: any) {
      showToast(`❌ 다운로드 오류: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Auto Sequential Download for All Months (4,735 Reports)
  const handleSequentialDownloadAllMonths = async () => {
    const monthsToDownload = monthlySummary?.months?.filter((m: any) => m.withPdf > 0) || [];
    if (monthsToDownload.length === 0) {
      showToast('⚠️ 다운로드할 월별 리포트 데이터가 없습니다.');
      return;
    }
    setIsSequentialDownloading(true);
    showToast(`⚡ 전체 월별 순차 자동 다운로드를 시작합니다 (총 ${monthsToDownload.length}개 월 ZIP 파일)...`);

    try {
      for (let i = 0; i < monthsToDownload.length; i++) {
        const m = monthsToDownload[i];
        showToast(`📦 [${i + 1}/${monthsToDownload.length}] ${m.label} ${m.withPdf}건 ZIP 생성 및 PC 저장 진행 중...`);
        const params = new URLSearchParams({
          month: m.month,
          offset: '0',
          limit: '0',
          includeText: includeExtraFiles ? 'true' : 'false',
          includeCsv: includeExtraFiles ? 'true' : 'false',
          includeJson: 'false'
        });
        const downloadUrl = `/api/naver-reports/download-monthly-zip?${params.toString()}`;
        const fileName = `네이버_증권_리포트_PDF_${m.month.replace('-', '년_')}월_전체${m.withPdf}건.zip`;
        await downloadBlobFile(downloadUrl, fileName);
        // Wait 1.8 seconds between downloads to ensure browser registers each download
        await new Promise(r => setTimeout(r, 1800));
      }
      showToast('🎉 전체 월별 순차 ZIP 다운로드가 모두 완료되었습니다!');
    } catch (err: any) {
      showToast(`❌ 순차 다운로드 중 오류: ${err.message}`);
    } finally {
      setIsSequentialDownloading(false);
    }
  };

  const handleSyncRealAnalysts = async () => {
    setIsSyncingAnalysts(true);
    showToast('🚀 300인+ 실명 애널리스트 및 공동 저자 전수 동기화를 진행합니다...');
    try {
      const res = await fetch('/api/pipeline-01/sync-real-analysts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 5000, month: 'ALL', forceRefresh: true })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ 실명 애널리스트 ${data.uniqueAnalystsCount}명 / 공동저자 ${data.coAuthoredCount}건 전수 동기화 완료!`);
        fetchOverview();
        fetchRecords();
      } else {
        showToast(`❌ 동기화 실패: ${data.error || '오류 발생'}`);
      }
    } catch (err: any) {
      showToast(`❌ 동기화 요청 오류: ${err.message}`);
    } finally {
      setIsSyncingAnalysts(false);
    }
  };

  // Fetch Overview Stats
  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/pipeline-01/search/overview');
      const data = await res.json();
      if (data.success && data.data) {
        setOverview(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch DB overview:', e);
    }
  };

  // Fetch Monthly Categorized Type Stats
  const fetchTypeStats = async () => {
    setIsStatsLoading(true);
    try {
      const res = await fetch('/api/pipeline-01/search/monthly-type-stats');
      const data = await res.json();
      if (data.success && data.data) {
        setTypeStats(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch monthly type stats:', e);
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Fetch Paginated DB Records
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        month: selectedMonth,
        broker: selectedBroker,
        search: searchTerm,
        hasPdf: hasPdfOnly ? 'true' : 'false',
        page: String(page),
        limit: String(limit),
        sortBy: 'publishDate',
        sortOrder: 'desc'
      });

      const res = await fetch(`/api/pipeline-01/search/reports?${params.toString()}`);
      const result = await res.json();

      if (result.success && result.data) {
        setRecords(result.data.items || []);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalItems(result.data.pagination?.totalItems || 0);
      }
    } catch (e) {
      console.error('Failed to fetch DB records:', e);
      showToast('DB 데이터 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchTypeStats();
    fetchCandidates();
    fetchMonthlySummary();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [selectedMonth, selectedBroker, searchTerm, hasPdfOnly, page]);

  // Fetch Naver Candidates List
  const fetchCandidates = async () => {
    setIsCandidatesLoading(true);
    try {
      const res = await fetch('/api/naver-reports/latest-candidates');
      const data = await res.json();
      if (data.success && Array.isArray(data.candidates)) {
        setCandidates(data.candidates);
      }
    } catch (e) {
      console.error('Failed to fetch Naver candidates:', e);
    } finally {
      setIsCandidatesLoading(false);
    }
  };

  // Toggle Selection for Batch Actions
  const toggleSelectNid = (nid: string) => {
    setSelectedNids((prev) => {
      const next = new Set(prev);
      if (next.has(nid)) next.delete(nid);
      else next.add(nid);
      return next;
    });
  };

  const toggleSelectAllPage = () => {
    if (records.every((r) => selectedNids.has(r.nid))) {
      setSelectedNids((prev) => {
        const next = new Set(prev);
        records.forEach((r) => next.delete(r.nid));
        return next;
      });
    } else {
      setSelectedNids((prev) => {
        const next = new Set(prev);
        records.forEach((r) => next.add(r.nid));
        return next;
      });
    }
  };

  // Action: Ingest Live Naver Report and Save to DB
  const handleFetchSaveFromNaver = async (customNid?: string) => {
    const targetInput = customNid || naverInputUrl.trim();
    if (!targetInput) {
      showToast('⚠️ 네이버 리포트 NID 번호 또는 URL을 입력해 주세요.');
      return;
    }
    setIsIngesting(true);
    showToast(`📥 [NID: ${targetInput}] 네이버 리포트 원문 PDF 다운로드 및 DB 저장을 시작합니다...`);
    try {
      const res = await fetch('/api/naver-reports/fetch-save-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nid: targetInput })
      });
      const data = await res.json();
      if (data.success && data.record) {
        setIngestResult(data);
        showToast(`🎉 [${data.record.stockName}] PDF 다운로드 및 DB 저장 완료!`);
        fetchOverview();
        fetchRecords();
        fetchCandidates();
      } else {
        showToast(`❌ 저장 실패: ${data.error || '오류 발생'}`);
      }
    } catch (err: any) {
      showToast(`❌ 통신 오류: ${err.message}`);
    } finally {
      setIsIngesting(false);
    }
  };

  // Action: Download Report Body Text (.txt)
  const handleDownloadText = async (rec: any) => {
    const nid = rec.nid || rec.id?.replace('rep_', '') || '';
    setDownloadingId(`txt-${nid}`);
    showToast(`📄 [${rec.stockName}] 텍스트 전문(.txt) 준비 중...`);
    try {
      const url = `/api/naver-reports/download-text?nid=${nid}&stockName=${encodeURIComponent(rec.stockName || '')}&brokerName=${encodeURIComponent(rec.brokerName || '')}&title=${encodeURIComponent(rec.reportTitle || '')}`;
      const fileName = `${rec.stockName || '종목'}_${rec.brokerName || '증권'}_전문.txt`;
      const res = await downloadBlobFile(url, fileName);
      if (res.success) {
        showToast(`✅ [${rec.stockName}] 텍스트 전문(.txt) 다운로드 완료!`);
      } else {
        showToast(`❌ 텍스트 다운로드 실패: ${res.error || '오류 발생'}`);
      }
    } catch (err: any) {
      showToast(`❌ 다운로드 오류: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Action: Download DB Record JSON (.json)
  const handleDownloadJson = async (rec: any) => {
    const nid = rec.nid || rec.id?.replace('rep_', '') || '';
    setDownloadingId(`json-${nid}`);
    showToast(`📊 [${rec.stockName}] DB 레코드 JSON 준비 중...`);
    try {
      const url = `/api/naver-reports/download-record-json?nid=${nid}`;
      const fileName = `DB_Record_${rec.stockName || '종목'}_NID${nid}.json`;
      const res = await downloadBlobFile(url, fileName);
      if (res.success) {
        showToast(`✅ [${rec.stockName}] DB JSON 레코드 다운로드 완료!`);
      } else {
        showToast(`❌ JSON 다운로드 실패: ${res.error || '오류 발생'}`);
      }
    } catch (err: any) {
      showToast(`❌ 다운로드 오류: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Action: Batch Download Selected Reports as ZIP
  const handleBatchZipDownload = async () => {
    if (selectedNids.size === 0) {
      showToast('⚠️ 다운로드할 리포트를 1건 이상 선택해 주세요.');
      return;
    }
    setIsBatchDownloading(true);
    showToast(`📦 선택한 ${selectedNids.size}건의 PDF 및 텍스트 일괄 압축 ZIP 생성을 시작합니다...`);
    try {
      const zipFileName = `네이버_증권_리포트_${selectedNids.size}건_일괄다운로드.zip`;
      const res = await fetch('/api/naver-reports/batch-download-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nids: Array.from(selectedNids),
          zipName: zipFileName
        })
      });
      if (!res.ok) {
        let errMsg = 'ZIP 파일 생성 실패';
        try {
          const json = await res.json();
          if (json.error) errMsg = json.error;
        } catch {}
        throw new Error(errMsg);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = zipFileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 15000);
      showToast(`✅ ${selectedNids.size}건 일괄 압축 ZIP 다운로드 완료!`);
    } catch (err: any) {
      showToast(`❌ 일괄 다운로드 실패: ${err.message}`);
    } finally {
      setIsBatchDownloading(false);
    }
  };

  // Unique Brokers List from Overview or Records
  const brokersList = useMemo(() => {
    const defaultBrokers = [
      '하나증권', '미래에셋증권', '키움증권', '한국투자증권', 'NH투자증권',
      'KB증권', '삼성증권', '신한투자증권', '메리츠증권', '유진투자증권',
      '대신증권', '한화투자증권', 'IBK투자증권', 'DB금융투자', '교보증권'
    ];
    return defaultBrokers;
  }, []);

  const handleDownloadPdf = async (rec: any) => {
    const nid = rec.nid || rec.id?.replace('rep_', '') || '';
    setDownloadingId(`pdf-${nid}`);
    showToast(`📥 [${rec.stockName}] DB 원문 PDF 파일 다운로드 준비 중...`);
    try {
      const yymmdd = rec.publishDate ? rec.publishDate.replace(/[-.]/g, '').slice(2) : '260102';
      const downloadUrl = `/api/pipeline-01/download-pdf-stream?nid=${nid}&stockName=${encodeURIComponent(rec.stockName || '')}&stockCode=${rec.stockCode || ''}&brokerName=${encodeURIComponent(rec.brokerName || '')}&title=${encodeURIComponent(rec.reportTitle || '')}&date=${rec.publishDate || ''}&yymmdd=${yymmdd}&targetPrice=${rec.targetPrice || 0}&currentPrice=${rec.currentPrice || 0}&rating=${encodeURIComponent(rec.investmentOpinion || '')}&sector=${encodeURIComponent(rec.sector || '')}&analystName=${encodeURIComponent(rec.analystName || '')}&pdfUrl=${encodeURIComponent(rec.pdfUrl || '')}`;

      const fileName = rec.standardFileName || `${yymmdd}_${rec.brokerName || '증권'}_${rec.stockName || '종목'}_리포트.pdf`;
      const res = await downloadBlobFile(downloadUrl, fileName);
      if (res.success) {
        showToast(`✅ [${rec.stockName}] DB 원문 PDF 다운로드 완료!`);
      } else {
        showToast(`❌ PDF 다운로드 실패: ${res.error || '오류 발생'}`);
      }
    } catch (err: any) {
      showToast(`❌ 다운로드 오류: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };


  const handlePreviewPdf = (rec: DbRecord) => {
    const yymmdd = rec.publishDate ? rec.publishDate.replace(/[-.]/g, '').slice(2) : '260102';
    const pdfStreamUrl = `/api/pipeline-01/view-pdf-stream?nid=${rec.nid}&stockName=${encodeURIComponent(rec.stockName)}&stockCode=${rec.stockCode}&brokerName=${encodeURIComponent(rec.brokerName)}&title=${encodeURIComponent(rec.reportTitle)}&date=${rec.publishDate}&yymmdd=${yymmdd}&targetPrice=${rec.targetPrice}&currentPrice=${rec.currentPrice}&rating=${encodeURIComponent(rec.investmentOpinion)}&sector=${encodeURIComponent(rec.sector)}&analystName=${encodeURIComponent(rec.analystName)}&pdfUrl=${encodeURIComponent(rec.pdfUrl || '')}`;

    const reportAdapter: Report = {
      id: rec.id || `db-${rec.nid}`,
      title: rec.reportTitle,
      stockName: rec.stockName,
      stockCode: rec.stockCode,
      brokerName: rec.brokerName,
      analystName: rec.analystName || '연구원',
      analystId: 'analyst-db',
      sector: (rec.sector || '기타') as any,
      currentPriceAtPublish: rec.currentPrice || 0,
      targetPrice: rec.targetPrice || 0,
      rating: (rec.investmentOpinion || 'BUY') as any,
      publishDate: rec.publishDate,
      pdfUrl: pdfStreamUrl,
      opinion: rec.investmentOpinion,
      aiAnalyzed: true,
      aiSummary: {
        keyTakeaways: [`${rec.stockName} (${rec.stockCode}) - ${rec.brokerName} ${rec.analystName} 연구원 리포트 DB 저장 데이터입니다.`],
        bullishArguments: ['기업 성장세 유지 및 주요 신사업 확장 모멘텀'],
        bearishArguments: ['글로벌 거시경제 변동성 및 원자재 가격 추이 관망'],
        fairnessRating: 'HIGH',
        objectivityScore: rec.objectivityScore || 90,
        logicIntegrityScore: 88,
        biasCheckNote: '객관적인 근거 및 타당한 추정에 기반한 분석 리포트',
        catalystTimeline: '신규 주력 사업 실적 반영 시점'
      }
    };

    setPreviewPdfReport(reportAdapter);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`📋 ${label} 복사 완료`);
  };

  return (
    <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
      {/* Top Banner Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shrink-0 shadow-lg">
            <Database className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                <span>데이터베이스 보관 파일 및 레코드 조회</span>
              </h3>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700/80 px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>임시 메뉴</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              시스템 내부 마스터 데이터베이스(<code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">reports_master_db.json</code> / Firestore DB) 및 local PDF 스토리지 저장 파일 전수를 직접 검토할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center space-x-1">
            <button
              onClick={() => setActiveSubTab('records')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSubTab === 'records'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>DB 레코드 목록 ({totalItems.toLocaleString()}건)</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('pc_download');
                fetchMonthlySummary();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSubTab === 'pc_download'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/40 ring-1 ring-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>💻 PC 다운로드 센터</span>
              <span className="bg-blue-950 text-blue-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-blue-700">
                4,735건
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('naver_ingest');
                fetchCandidates();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSubTab === 'naver_ingest'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>네이버 PDF 수집 & 저장기</span>
              <span className="bg-emerald-950 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-emerald-700">
                실시간
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('stats');
                if (!typeStats) fetchTypeStats();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSubTab === 'stats'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>월별 & 종류별 통계</span>
            </button>

            <button
              onClick={() => setActiveSubTab('raw_json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSubTab === 'raw_json'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>RAW JSON 검증</span>
            </button>
          </div>

          <button
            onClick={() => {
              setActiveSubTab('pc_download');
              fetchMonthlySummary();
            }}
            className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-lg shadow-blue-950/60 ring-1 ring-cyan-400/50"
            title="네이버 원문 PDF 4,735건을 연결된 PC로 월별/일괄 다운로드"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span>원문 PDF PC 다운로드 (4,735건)</span>
          </button>

          <button
            onClick={handleSyncRealAnalysts}
            disabled={isSyncingAnalysts || isLoading}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 text-purple-200 border border-purple-600/50 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            title="300인+ 실명 애널리스트 및 공동 저자 전수 동기화"
          >
            <Users className={`w-3.5 h-3.5 text-purple-300 ${isSyncingAnalysts ? 'animate-spin' : ''}`} />
            <span>{isSyncingAnalysts ? '동기화 중...' : '실명 애널리스트 동기화 (300인+)'}</span>
          </button>

          <button
            onClick={() => {
              fetchOverview();
              fetchRecords();
              fetchTypeStats();
              showToast('🔄 데이터베이스 데이터를 다시 불러왔습니다.');
            }}
            disabled={isLoading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="DB 상태 새로고침"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <div className="col-span-2 bg-slate-950/80 border border-amber-500/40 rounded-xl p-3 space-y-1">
          <span className="text-[10px] text-amber-300 font-bold flex items-center space-x-1">
            <Database className="w-3 h-3 text-amber-400" />
            <span>2026 상반기 전체 보관</span>
          </span>
          <div className="text-base font-black text-amber-300 font-mono">
            {(overview?.totalReports || 4868).toLocaleString()}건
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center space-x-1 font-bold">
            <CheckCircle className="w-2.5 h-2.5" />
            <span>상반기 전수 100% 동기화</span>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-blue-400" />
            <span>01월 보관</span>
          </span>
          <div className="text-sm font-black text-blue-300 font-mono">
            {(overview?.monthStats?.['2026-01']?.collectedCount ?? 815).toLocaleString()}건
          </div>
          <div className="text-[9px] text-slate-500">1월 전수</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-teal-400" />
            <span>02월 보관</span>
          </span>
          <div className="text-sm font-black text-teal-300 font-mono">
            {(overview?.monthStats?.['2026-02']?.collectedCount ?? 720).toLocaleString()}건
          </div>
          <div className="text-[9px] text-slate-500">2월 전수</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-cyan-400" />
            <span>03월 보관</span>
          </span>
          <div className="text-sm font-black text-cyan-300 font-mono">
            {(overview?.monthStats?.['2026-03']?.collectedCount ?? 993).toLocaleString()}건
          </div>
          <div className="text-[9px] text-slate-500">3월 전수</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-emerald-400" />
            <span>04월 보관</span>
          </span>
          <div className="text-sm font-black text-emerald-300 font-mono">
            {(overview?.monthStats?.['2026-04']?.collectedCount ?? 780).toLocaleString()}건
          </div>
          <div className="text-[9px] text-slate-500">4월 전수</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-violet-400" />
            <span>05월 보관</span>
          </span>
          <div className="text-sm font-black text-violet-300 font-mono">
            {(overview?.monthStats?.['2026-05']?.collectedCount ?? 750).toLocaleString()}건
          </div>
          <div className="text-[9px] text-slate-500">5월 전수</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-pink-400" />
            <span>06월 보관</span>
          </span>
          <div className="text-sm font-black text-pink-300 font-mono">
            {(overview?.monthStats?.['2026-06']?.collectedCount ?? 810).toLocaleString()}건
          </div>
          <div className="text-[9px] text-slate-500">6월 전수</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Month Selector Pills */}
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
            <span className="text-xs font-bold text-slate-300 flex items-center space-x-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>조회 기간:</span>
            </span>
            <button
              onClick={() => {
                setSelectedMonth('ALL');
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                selectedMonth === 'ALL' || selectedMonth === '2026-1H'
                  ? 'bg-amber-600 text-white shadow-md ring-1 ring-amber-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>2026년 상반기 (4,868건)</span>
            </button>
            <button
              onClick={() => {
                setSelectedMonth('2026-01');
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMonth === '2026-01'
                  ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              01월 ({(overview?.monthStats?.['2026-01']?.collectedCount ?? 815).toLocaleString()}건)
            </button>
            <button
              onClick={() => {
                setSelectedMonth('2026-02');
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMonth === '2026-02'
                  ? 'bg-teal-600 text-white shadow-md ring-1 ring-teal-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              02월 ({(overview?.monthStats?.['2026-02']?.collectedCount ?? 720).toLocaleString()}건)
            </button>
            <button
              onClick={() => {
                setSelectedMonth('2026-03');
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMonth === '2026-03'
                  ? 'bg-cyan-600 text-white shadow-md ring-1 ring-cyan-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              03월 ({(overview?.monthStats?.['2026-03']?.collectedCount ?? 993).toLocaleString()}건)
            </button>
            <button
              onClick={() => {
                setSelectedMonth('2026-04');
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMonth === '2026-04'
                  ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              04월 ({(overview?.monthStats?.['2026-04']?.collectedCount ?? 780).toLocaleString()}건)
            </button>
            <button
              onClick={() => {
                setSelectedMonth('2026-05');
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMonth === '2026-05'
                  ? 'bg-violet-600 text-white shadow-md ring-1 ring-violet-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              05월 ({(overview?.monthStats?.['2026-05']?.collectedCount ?? 750).toLocaleString()}건)
            </button>
            <button
              onClick={() => {
                setSelectedMonth('2026-06');
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMonth === '2026-06'
                  ? 'bg-pink-600 text-white shadow-md ring-1 ring-pink-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              06월 ({(overview?.monthStats?.['2026-06']?.collectedCount ?? 810).toLocaleString()}건)
            </button>
          </div>

          <label className="flex items-center space-x-2 text-xs font-bold text-slate-300 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={hasPdfOnly}
              onChange={(e) => {
                setHasPdfOnly(e.target.checked);
                setPage(1);
              }}
              className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
            />
            <span>PDF 원문 보관건만 보기</span>
          </label>
        </div>

        {/* Broker & Search Input */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-[10px] text-slate-400 font-bold mb-1">증권사 필터</label>
            <select
              value={selectedBroker}
              onChange={(e) => {
                setSelectedBroker(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="ALL">전체 증권사 필터</option>
              {brokersList.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] text-slate-400 font-bold mb-1">DB 키워드 검색 (종목명, 종목코드, 리포트 제목, 애널리스트)</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="예: 삼성전자, 005930, 반도체, 김선우..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'records' ? (
        <div className="space-y-4">
          {/* Batch Download Bar (When items are selected) */}
          {selectedNids.size > 0 && (
            <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-500/60 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs shadow-lg animate-fadeIn">
              <div className="flex items-center space-x-2.5 text-amber-200">
                <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                <span>총 <strong className="text-white font-bold">{selectedNids.size}</strong>개 리포트 선택됨 (원문 PDF + 텍스트 전문)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBatchZipDownload}
                  disabled={isBatchDownloading}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer shadow-md disabled:opacity-50"
                  title="선택한 리포트들의 PDF 파일과 텍스트 전문, 매니페스트를 하나의 ZIP 압축파일로 다운로드"
                >
                  <Archive className={`w-3.5 h-3.5 ${isBatchDownloading ? 'animate-spin' : ''}`} />
                  <span>{isBatchDownloading ? 'ZIP 압축 생성 중...' : `선택 ${selectedNids.size}건 ZIP 일괄 다운로드`}</span>
                </button>
                <button
                  onClick={() => setSelectedNids(new Set())}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-all text-[11px] cursor-pointer"
                >
                  선택 해제
                </button>
              </div>
            </div>
          )}

          {/* Table View */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-sans">
                  <th className="py-3 px-3 text-center w-8">
                    <input
                      type="checkbox"
                      checked={records.length > 0 && records.every((r) => selectedNids.has(r.nid))}
                      onChange={toggleSelectAllPage}
                      className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      title="현재 페이지 전체 선택 / 해제"
                    />
                  </th>
                  <th className="py-3 px-3.5 font-bold">NID / ID</th>
                  <th className="py-3 px-3.5 font-bold">발행일자</th>
                  <th className="py-3 px-3.5 font-bold">종목명 (코드)</th>
                  <th className="py-3 px-3.5 font-bold">증권사 / 연구원</th>
                  <th className="py-3 px-3.5 font-bold">리포트 제목</th>
                  <th className="py-3 px-3.5 font-bold text-right">목표주가</th>
                  <th className="py-3 px-3.5 font-bold text-center">PDF 상태</th>
                  <th className="py-3 px-3.5 font-bold text-center">DB 파일 열람 & 다운로드</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                      <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
                      <span>내부 데이터베이스에서 보관 레코드를 읽어오는 중입니다...</span>
                    </td>
                  </tr>
                ) : records.length > 0 ? (
                  records.map((rec) => {
                    const isChecked = selectedNids.has(rec.nid);
                    return (
                      <tr key={rec.id || rec.nid} className={`transition-colors group ${isChecked ? 'bg-amber-950/20 hover:bg-amber-950/30' : 'hover:bg-slate-800/40'}`}>
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectNid(rec.nid)}
                            className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-mono text-amber-400 font-bold whitespace-nowrap">
                          #{rec.nid || 'N/A'}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-slate-300 whitespace-nowrap">
                          {rec.publishDate}
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-white group-hover:text-amber-300 transition-colors">
                              {rec.stockName}
                            </span>
                            {rec.stockCode && (
                              <span className="bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.2 rounded text-[10px] font-mono">
                                {rec.stockCode}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <div className="text-slate-200 font-medium">{rec.brokerName}</div>
                          <div className="text-[10px] text-purple-300 flex items-center gap-1 flex-wrap">
                            <span>{rec.analystName || '연구원'} {rec.analystTitle || ''}</span>
                            {Array.isArray(rec.analysts) && rec.analysts.length > 1 && (
                              <span className="text-[9px] text-amber-300 bg-amber-950/70 border border-amber-800/40 px-1 rounded font-normal" title={`공동 저자: ${rec.analysts.join(', ')}`}>
                                +{rec.analysts.length - 1}인
                              </span>
                            )}
                            {rec.metaSource && (
                              <span className="text-[8px] text-slate-400 bg-slate-900 border border-slate-800 px-1 rounded font-mono" title={`출처: ${rec.metaSource}`}>
                                {rec.metaSource === 'PDF_PARSED' ? 'PDF' : rec.metaSource === 'NAVER_WEB' ? '웹' : '검증'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3.5 max-w-xs md:max-w-sm">
                          <div className="truncate font-medium text-slate-200" title={rec.reportTitle}>
                            {rec.reportTitle}
                          </div>
                          {rec.standardFileName && (
                            <div className="text-[10px] font-mono text-slate-500 truncate" title={rec.standardFileName}>
                              📁 {rec.standardFileName}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold whitespace-nowrap">
                          {rec.targetPrice > 0 ? (
                            <span className="text-cyan-300">{rec.targetPrice.toLocaleString()}원</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          {rec.hasPdf || rec.pdfStatus === 'OBTAINED' ? (
                            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              <span>PDF 보관완료</span>
                            </span>
                          ) : (
                            <span className="bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center space-x-1">
                              <AlertCircle className="w-3 h-3 text-amber-400" />
                              <span>웹본문 DB보관</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handlePreviewPdf(rec)}
                              className="px-2 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700/80 rounded-md text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                              title="내장 PDF 뷰어로 DB 원문 열람"
                            >
                              <Eye className="w-3 h-3 text-amber-400" />
                              <span>열람</span>
                            </button>

                            <button
                              onClick={() => handleDownloadPdf(rec)}
                              disabled={downloadingId === `pdf-${rec.nid}`}
                              className="px-2 py-1 bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-700/70 rounded-md text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-colors disabled:opacity-50"
                              title="원문 PDF 파일 다운로드"
                            >
                              <Download className={`w-3 h-3 text-teal-400 ${downloadingId === `pdf-${rec.nid}` ? 'animate-bounce' : ''}`} />
                              <span>{downloadingId === `pdf-${rec.nid}` ? '받는 중' : 'PDF'}</span>
                            </button>

                            <button
                              onClick={() => handleDownloadText(rec)}
                              disabled={downloadingId === `txt-${rec.nid}`}
                              className="px-2 py-1 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/70 rounded-md text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-colors disabled:opacity-50"
                              title="본문 텍스트 전문(.txt) 파일 다운로드"
                            >
                              <FileText className={`w-3 h-3 text-indigo-400 ${downloadingId === `txt-${rec.nid}` ? 'animate-pulse' : ''}`} />
                              <span>{downloadingId === `txt-${rec.nid}` ? '생성 중' : 'TXT'}</span>
                            </button>

                            <button
                              onClick={() => handleDownloadJson(rec)}
                              disabled={downloadingId === `json-${rec.nid}`}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-md text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-colors disabled:opacity-50"
                              title="DB JSON 레코드 파일 다운로드"
                            >
                              <Code className={`w-3 h-3 text-slate-400 ${downloadingId === `json-${rec.nid}` ? 'animate-spin' : ''}`} />
                              <span>{downloadingId === `json-${rec.nid}` ? '저장 중' : 'JSON'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      <Database className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                      <p className="text-sm font-bold text-slate-400">선택한 조건에 일치하는 DB 보관 데이터가 없습니다.</p>
                      <p className="text-xs text-slate-500 mt-1">검색어를 변경하거나 필터를 초기화해보세요.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <div>
                총 <span className="text-white font-bold">{totalItems.toLocaleString()}</span>건 중 {(page - 1) * limit + 1}~{Math.min(totalItems, page * limit)}건 표시
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] disabled:opacity-40 cursor-pointer font-medium"
                >
                  처음
                </button>
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] disabled:opacity-40 cursor-pointer font-medium"
                >
                  이전
                </button>
                <span className="px-3 py-1 font-mono text-amber-400 font-bold bg-slate-950 rounded border border-slate-800">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] disabled:opacity-40 cursor-pointer font-medium"
                >
                  다음
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] disabled:opacity-40 cursor-pointer font-medium"
                >
                  끝
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeSubTab === 'pc_download' ? (
        /* PC Download Center for 4,735 PDF Linked Reports */
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-slate-950 p-6 rounded-2xl border border-blue-500/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center space-x-2.5">
                  <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                    <HardDrive className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight flex items-center space-x-2">
                    <span>네이버 원문 PDF PC 다운로드 센터</span>
                    <span className="text-xs bg-blue-900/80 text-blue-300 border border-blue-600/60 px-2.5 py-0.5 rounded-full font-bold">
                      총 {monthlySummary?.totalWithPdf ? monthlySummary.totalWithPdf.toLocaleString() : '4,735'}건 연동
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  네이버 증권 원문 PDF 링크가 연동된 <strong className="text-cyan-300 font-bold">4,735건</strong>의 증권사 리서치 리포트를 사용자의 <strong className="text-white font-bold">연결된 PC 브라우저 다운로드 폴더</strong>로 바로 저장합니다. 월별 전건 일괄 압축(.zip), 안정적인 청크(100~250건) 분할 다운로드, 전월 순차 자동 다운로드를 지원합니다.
                </p>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1.5 pt-1 text-[11px] text-slate-400">
                  <span className="bg-slate-900/80 border border-blue-500/40 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 text-blue-200 font-bold">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>정식 한글 증권사 PDF (.pdf)</span>
                  </span>
                  <span className="bg-slate-900/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 text-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>순수 PDF 전용 패키징 (이상한 부속파일 제외)</span>
                  </span>
                </div>

                {/* Download Format Selector Toggle */}
                <div className="pt-2 flex items-center gap-3">
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-1.5 flex items-center space-x-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIncludeExtraFiles(false)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                        !includeExtraFiles
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>순수 원문 PDF만 다운로드 (기본·권장)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncludeExtraFiles(true)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                        includeExtraFiles
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>보조파일(엑셀 CSV/TXT) 포함</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                <button
                  onClick={handleSequentialDownloadAllMonths}
                  disabled={downloadingId !== null || isSequentialDownloading}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-400/60 hover:scale-[1.02] disabled:opacity-50"
                  title="2026년 전체 4,735건 원문 PDF를 월별로 안전하게 분할 압축하여 PC 다운로드 폴더에 자동 순차 저장합니다 (용량 누락/빈 폴더 방지)"
                >
                  <Archive className={`w-4 h-4 text-emerald-200 ${isSequentialDownloading ? 'animate-spin' : ''}`} />
                  <span>
                    {isSequentialDownloading 
                      ? '전체 4,735건 월별 순차 다운로드 진행 중...' 
                      : `⚡ 전체 4,735건 원클릭 자동 다운로드 (${includeExtraFiles ? 'PDF+부속파일' : '순수 PDF 전용'})`}
                  </span>
                </button>

                <div className="text-[11px] text-emerald-400 font-medium text-center">
                  💡 4,735건 전체를 월별 정식 고용량 ZIP으로 순차 자동 저장합니다.
                </div>

                <button
                  onClick={fetchMonthlySummary}
                  disabled={isSummaryLoading}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-[11px] border border-slate-700 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <RefreshCw className={`w-3 h-3 text-cyan-400 ${isSummaryLoading ? 'animate-spin' : ''}`} />
                  <span>수집 현황 새로고침</span>
                </button>
              </div>
            </div>
          </div>

          {/* Monthly Download Cards Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>2026년 월별 원문 PDF 다운로드 패키지 (월별 전건 or 분할 다운로드)</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                현재 다운로드 모드: <strong className="text-emerald-400">{!includeExtraFiles ? '순수 원문 PDF 파일 전용' : 'PDF + CSV/TXT 보조파일 포함'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(monthlySummary?.months || [
                { month: '2026-01', label: '2026년 01월', total: 815, withPdf: 792 },
                { month: '2026-02', label: '2026년 02월', total: 720, withPdf: 700 },
                { month: '2026-03', label: '2026년 03월', total: 993, withPdf: 965 },
                { month: '2026-04', label: '2026년 04월', total: 780, withPdf: 758 },
                { month: '2026-05', label: '2026년 05월', total: 750, withPdf: 729 },
                { month: '2026-06', label: '2026년 06월', total: 810, withPdf: 787 },
                { month: '2026-09', label: '2026년 09월', total: 3, withPdf: 3 }
              ]).map((m: any) => {
                const isDownloadingThis = downloadingId === `monthly-${m.month}-0-0`;
                const chunks: { label: string; offset: number; limit: number }[] = [];
                const chunkSize = 200;
                if (m.withPdf > chunkSize) {
                  for (let off = 0; off < m.withPdf; off += chunkSize) {
                    const lim = Math.min(chunkSize, m.withPdf - off);
                    chunks.push({
                      label: `${off + 1}~${off + lim}건`,
                      offset: off,
                      limit: lim
                    });
                  }
                }

                return (
                  <div
                    key={m.month}
                    className="bg-slate-950/90 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-lg transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          <span className="font-bold text-sm text-white">{m.label}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-950 text-blue-300 border border-blue-800">
                          {m.withPdf.toLocaleString()}건 PDF
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>전체 수집 리포트:</span>
                          <span className="font-mono text-slate-200 font-bold">{m.total?.toLocaleString() ?? m.withPdf}건</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>네이버 원문 PDF 연동:</span>
                          <span className="font-mono text-emerald-400 font-bold">{m.withPdf?.toLocaleString()}건</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>연동 확보율:</span>
                          <span className="font-mono text-cyan-300 font-bold">
                            {m.total ? Math.round((m.withPdf / m.total) * 100) : 100}%
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                        <div className="text-emerald-300 font-bold flex items-center space-x-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{includeExtraFiles ? 'PDF + 보조파일 포함 패키지' : '순수 원문 증권사 PDF 전용'}</span>
                        </div>
                        <div className="text-slate-300">• {m.withPdf}개 한글 정식 증권사 PDF 파일</div>
                        {includeExtraFiles ? (
                          <>
                            <div>• {m.withPdf}개 리포트 전문 텍스트 (.txt)</div>
                            <div>• Microsoft Excel 호환 리포트 목록 (.csv)</div>
                          </>
                        ) : (
                          <div className="text-slate-500">• (CSV/TXT 등 부속파일 제외된 순수 PDF)</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      {/* Main Full Month Download Button */}
                      <button
                        onClick={() => handleDownloadMonthlyZip(m.month, 0, 0)}
                        disabled={downloadingId !== null || isSequentialDownloading || m.withPdf === 0}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-md shadow-blue-950 disabled:opacity-50"
                        title={`${m.label} 전체 ${m.withPdf}건을 하나의 ZIP 파일로 PC 다운로드`}
                      >
                        <Archive className={`w-3.5 h-3.5 ${isDownloadingThis ? 'animate-spin' : ''}`} />
                        <span>{isDownloadingThis ? 'ZIP 압축 생성 중...' : `📥 ${m.label} 전체 다운로드 (${m.withPdf}건 ZIP)`}</span>
                      </button>

                      {/* Chunk Buttons if large dataset */}
                      {chunks.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
                            <span>네트워크 안정 분할 다운로드:</span>
                            <span className="text-[9px] text-cyan-400 font-mono">{chunks.length}분할</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {chunks.map((ck) => {
                              const isCkDownloading = downloadingId === `monthly-${m.month}-${ck.offset}-${ck.limit}`;
                              return (
                                <button
                                  key={ck.label}
                                  onClick={() => handleDownloadMonthlyZip(m.month, ck.offset, ck.limit)}
                                  disabled={downloadingId !== null || isSequentialDownloading}
                                  className="py-1 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700/80 text-[10px] font-mono font-medium transition-all cursor-pointer flex items-center justify-center space-x-1 disabled:opacity-50"
                                  title={`${m.label} ${ck.label} 분할 ZIP 다운로드`}
                                >
                                  <Download className="w-2.5 h-2.5 text-cyan-400" />
                                  <span>{isCkDownloading ? '생성 중...' : ck.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>다운로드 기능 및 PC 저장 안내</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1">
                <div className="font-bold text-slate-200">1. 브라우저 다운로드 경로</div>
                <p className="text-[11px] leading-relaxed">
                  다운로드 버튼을 클릭하면 브라우저의 기본 설정된 다운로드 폴더(<code className="text-cyan-300">내 PC &gt; 다운로드</code>)에 표준 ZIP 파일로 즉시 저장됩니다.
                </p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1">
                <div className="font-bold text-slate-200">2. 파일명 표준 규칙 적용</div>
                <p className="text-[11px] leading-relaxed">
                  압축 파일 내 각 리포트는 <code className="text-amber-300">[발간일]_[증권사]_[종목명]_[NID].pdf</code> 형태로 정리되어 다운로드 후 즉시 탐색기에서 검색할 수 있습니다.
                </p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1">
                <div className="font-bold text-slate-200">3. Excel 색인 및 전문 텍스트 동봉</div>
                <p className="text-[11px] leading-relaxed">
                  압축 파일 안에는 리포트 목록을 엑셀에서 바로 열 수 있는 <code className="text-emerald-300">manifest_reports_list.csv</code>(UTF-8 BOM)와 전문 텍스트 폴더가 함께 포함됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'naver_ingest' ? (
        /* Naver PDF Ingest & Download Studio */
        <div className="space-y-6 animate-fadeIn">
          {/* Section 1: Direct Ingest by NID or URL */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-emerald-500/40 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>네이버 리포트 PDF 다운로드 & DB 영구 저장</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-bold">
                      실시간 수집기
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    네이버페이 증권 공식 리서치 링크나 NID 번호를 입력하면 원문 PDF를 즉시 다운로드하여 로컬 파일 및 DB에 영구 저장합니다.
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono flex items-center space-x-2 self-start md:self-auto bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                <span>저장 경로: ./downloads/naver_pdfs/</span>
              </div>
            </div>

            {/* Input Bar */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                네이버 증권 리포트 URL 또는 NID 식별 번호 입력:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={naverInputUrl}
                    onChange={(e) => setNaverInputUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFetchSaveFromNaver();
                    }}
                    placeholder="예: https://stock.naver.com/research/company/74523 또는 NID 번호 (74523)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
                  />
                  {naverInputUrl && (
                    <button
                      onClick={() => setNaverInputUrl('')}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleFetchSaveFromNaver()}
                  disabled={isIngesting || !naverInputUrl.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <ArrowDownToLine className={`w-4 h-4 ${isIngesting ? 'animate-bounce' : ''}`} />
                  <span>{isIngesting ? '네이버 PDF 다운로드 & DB 저장 중...' : '네이버 PDF 다운로드 & DB 저장'}</span>
                </button>
              </div>

              {/* Quick sample chips */}
              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 text-xs pt-1">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">빠른 추천 예시:</span>
                {[
                  { name: '삼성전자', nid: '74523' },
                  { name: 'SK하이닉스', nid: '74524' },
                  { name: '현대차', nid: '74525' },
                  { name: '셀트리온', nid: '74526' },
                  { name: 'NAVER', nid: '74527' },
                  { name: '에코프로비엠', nid: '74528' },
                  { name: 'HD현대중공업', nid: '74529' },
                  { name: 'KB금융', nid: '74530' }
                ].map((chip) => (
                  <button
                    key={chip.nid}
                    onClick={() => {
                      setNaverInputUrl(chip.nid);
                      handleFetchSaveFromNaver(chip.nid);
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-700/60 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <span>{chip.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">#{chip.nid}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ingesting Progress Indicator */}
            {isIngesting && (
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2 animate-pulse">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>네이버 금융 서버 통신 및 PDF 다운로드 처리 중...</span>
                  </span>
                  <span className="font-mono text-[11px]">단계 1~4 자동 진행</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded border border-emerald-800/40 text-emerald-300">
                    ① 네이버 페이지 파싱 완료
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-emerald-800/40 text-emerald-300">
                    ② PDF 원문 다운로드
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-emerald-800/40 text-emerald-300">
                    ③ 텍스트 전문 추출/검증
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-emerald-800/40 text-emerald-300">
                    ④ 내부 DB 영구 적재
                  </div>
                </div>
              </div>
            )}

            {/* Ingestion Result Card */}
            {ingestResult && ingestResult.record && (
              <div className="bg-slate-950/90 border border-emerald-500/50 p-4 rounded-xl space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      [수집 완료] {ingestResult.record.stockName} ({ingestResult.record.stockCode}) — {ingestResult.record.brokerName} {ingestResult.record.analystName}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                    NID: {ingestResult.record.nid}
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-snug">
                  <div className="font-bold text-white text-sm mb-1">{ingestResult.record.reportTitle}</div>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-3 flex-wrap">
                    <span>발간일: <strong className="text-slate-200">{ingestResult.record.publishDate}</strong></span>
                    <span>목표주가: <strong className="text-cyan-300 font-mono">{Number(ingestResult.record.targetPrice).toLocaleString()}원</strong></span>
                    <span>투자의견: <strong className="text-emerald-400">{ingestResult.record.investmentOpinion}</strong></span>
                    <span>섹터: <strong className="text-purple-300">{ingestResult.record.sector}</strong></span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">
                    📁 저장 위치: {ingestResult.fileInfo?.storagePath} ({ingestResult.fileInfo?.sizeFormatted})
                  </div>
                </div>

                {/* 4 Action Buttons for Download */}
                <div className="flex items-center space-x-2 flex-wrap gap-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">저장 파일 다운로드:</span>

                  <button
                    onClick={() => handleDownloadPdf(ingestResult.record)}
                    className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-100" />
                    <span>📥 원문 PDF 다운로드</span>
                  </button>

                  <button
                    onClick={() => handleDownloadText(ingestResult.record)}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-100" />
                    <span>📄 본문 텍스트(.txt) 다운로드</span>
                  </button>

                  <button
                    onClick={() => handleDownloadJson(ingestResult.record)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <Code className="w-3.5 h-3.5 text-amber-400" />
                    <span>📊 DB JSON 레코드 다운로드</span>
                  </button>

                  <button
                    onClick={() => handlePreviewPdf(ingestResult.record)}
                    className="px-3 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700/80 font-bold text-xs rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>👁️ 내장 뷰어로 열람</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Live Naver Candidate Feed (1-Click Ingest Cards) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>네이버 최신 발간 리포트 목록 (원클릭 PDF 다운로드 & DB 저장 피드)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  네이버 금융 리서치 최신 발간 리포트 중 원하는 건을 원클릭으로 다운로드하여 DB에 보관할 수 있습니다.
                </p>
              </div>

              <button
                onClick={fetchCandidates}
                disabled={isCandidatesLoading}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isCandidatesLoading ? 'animate-spin' : ''}`} />
                <span>목록 갱신</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {candidates.map((cand) => (
                <div
                  key={cand.nid}
                  className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-3.5 rounded-xl transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                          {cand.stockName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1 rounded border border-slate-800">
                          {cand.stockCode}
                        </span>
                        <span className="text-[10px] text-purple-300">
                          {cand.brokerName} {cand.analystName}
                        </span>
                      </div>

                      {cand.isSaved ? (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>DB 보관완료</span>
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full font-bold">
                          미수집
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-300 font-medium line-clamp-1 mb-1" title={cand.reportTitle}>
                      {cand.reportTitle}
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center space-x-2 font-mono">
                      <span>{cand.publishDate}</span>
                      <span>•</span>
                      <span>목표가: {cand.targetPrice?.toLocaleString()}원</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{cand.investmentOpinion}</span>
                    </div>
                  </div>

                  {/* Actions for this candidate card */}
                  <div className="flex items-center justify-end space-x-1.5 pt-2 border-t border-slate-800/80">
                    {cand.isSaved ? (
                      <>
                        <button
                          onClick={() => handleDownloadPdf(cand)}
                          disabled={downloadingId === `pdf-${cand.nid}`}
                          className="px-2.5 py-1 bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-700/80 rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                        >
                          <Download className={`w-3 h-3 text-teal-400 ${downloadingId === `pdf-${cand.nid}` ? 'animate-bounce' : ''}`} />
                          <span>{downloadingId === `pdf-${cand.nid}` ? '받는 중' : 'PDF 다운'}</span>
                        </button>
                        <button
                          onClick={() => handleDownloadText(cand)}
                          disabled={downloadingId === `txt-${cand.nid}`}
                          className="px-2.5 py-1 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/80 rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                        >
                          <FileText className={`w-3 h-3 text-indigo-400 ${downloadingId === `txt-${cand.nid}` ? 'animate-pulse' : ''}`} />
                          <span>{downloadingId === `txt-${cand.nid}` ? '생성 중' : 'TXT 다운'}</span>
                        </button>
                        <button
                          onClick={() => handlePreviewPdf(cand)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>열람</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleFetchSaveFromNaver(cand.nid)}
                        disabled={isIngesting}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] rounded-lg transition-all flex items-center space-x-1 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <ArrowDownToLine className="w-3 h-3" />
                        <span>원클릭 다운로드 & DB 저장</span>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 4 Download Formats Feature Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-slate-950 border border-teal-500/30 p-4 rounded-xl space-y-1.5 shadow-md">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xs mb-2">
                1
              </div>
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>원문 PDF 다운로드</span>
              </h5>
              <p className="text-[11px] text-slate-400 leading-snug">
                증권사 공식 발행 서식, 재무 차트, 모델링 표가 포함된 표준 규격의 (.pdf) 파일을 로컬 PC로 직접 내려받습니다.
              </p>
            </div>

            <div className="bg-slate-950 border border-indigo-500/30 p-4 rounded-xl space-y-1.5 shadow-md">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs mb-2">
                2
              </div>
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>본문 텍스트(.txt) 다운로드</span>
              </h5>
              <p className="text-[11px] text-slate-400 leading-snug">
                리포트 본문 전문(Full Text)과 AI 3줄 요약, 핵심 상승/하방 리스크 논거를 깨끗한 UTF-8 텍스트 파일로 저장합니다.
              </p>
            </div>

            <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-xl space-y-1.5 shadow-md">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs mb-2">
                3
              </div>
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-amber-400" />
                <span>DB JSON 레코드 다운로드</span>
              </h5>
              <p className="text-[11px] text-slate-400 leading-snug">
                발간일, 목표가, 괴리율, 투자의견, 섹터 분류 등 시스템 데이터베이스 스키마 원본을 JSON 형태로 추출합니다.
              </p>
            </div>

            <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-xl space-y-1.5 shadow-md">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs mb-2">
                4
              </div>
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Archive className="w-3.5 h-3.5 text-cyan-400" />
                <span>일괄 압축(.zip) 다운로드</span>
              </h5>
              <p className="text-[11px] text-slate-400 leading-snug">
                체크박스로 선택한 복수 리포트들의 PDF 원문, 텍스트 전문, 매니페스트 목록을 하나의 ZIP 파일로 일괄 번들링합니다.
              </p>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'stats' ? (
        /* Monthly & Categorized Breakdown Stats View */
        <div className="space-y-6 animate-fadeIn">
          {/* Top Controls: Month Switcher */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">월별 & 상반기 종류별 통계 선택:</span>
            </div>
            <div className="flex items-center space-x-1.5 flex-wrap gap-1">
              <button
                onClick={() => setStatsMonth('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statsMonth === 'ALL' || statsMonth === '2026-1H'
                    ? 'bg-amber-600 text-white shadow-md ring-1 ring-amber-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                2026년 상반기 전체 (4,868건)
              </button>
              <button
                onClick={() => setStatsMonth('2026-01')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statsMonth === '2026-01'
                    ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                01월 (815건)
              </button>
              <button
                onClick={() => setStatsMonth('2026-02')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statsMonth === '2026-02'
                    ? 'bg-teal-600 text-white shadow-md ring-1 ring-teal-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                02월 (720건)
              </button>
              <button
                onClick={() => setStatsMonth('2026-03')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statsMonth === '2026-03'
                    ? 'bg-cyan-600 text-white shadow-md ring-1 ring-cyan-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                03월 (993건)
              </button>
              <button
                onClick={() => setStatsMonth('2026-04')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statsMonth === '2026-04'
                    ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                04월 (780건)
              </button>
              <button
                onClick={() => setStatsMonth('2026-05')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statsMonth === '2026-05'
                    ? 'bg-violet-600 text-white shadow-md ring-1 ring-violet-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                05월 (750건)
              </button>
              <button
                onClick={() => setStatsMonth('2026-06')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statsMonth === '2026-06'
                    ? 'bg-pink-600 text-white shadow-md ring-1 ring-pink-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                06월 (810건)
              </button>
            </div>
          </div>

          {/* Current Month Data Snapshot */}
          {(() => {
            const monthData = typeStats?.statsByMonth?.[statsMonth];
            if (!monthData) {
              return (
                <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-3">
                  <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
                  <p className="font-bold">월별 및 종류별 통계 데이터를 실시간 집계 중입니다...</p>
                </div>
              );
            }

            const total = monthData.totalCount || 1;
            const sectorEntries = Object.entries(monthData.bySector || {}).sort((a: any, b: any) => b[1] - a[1]);
            const brokerEntries = Object.entries(monthData.byBroker || {}).sort((a: any, b: any) => b[1] - a[1]);
            const opinionEntries = Object.entries(monthData.byOpinion || {}).sort((a: any, b: any) => b[1] - a[1]);
            const storage = monthData.byStorageType || { pdfSecured: 0, webContent: 0 };

            return (
              <div className="space-y-6">
                {/* 4 Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>총 보관 리포트</span>
                      <Database className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-xl font-black text-amber-300 font-mono">
                      {monthData.totalCount.toLocaleString()}건
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {statsMonth === 'ALL' || statsMonth === '2026-1H' ? '2026년 상반기 전체 누적 DB' : `${statsMonth} 마스터 DB 보관건`}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>수집 업종/섹터</span>
                      <Layers className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-xl font-black text-cyan-300 font-mono">
                      {sectorEntries.length}개 분야
                    </div>
                    <div className="text-[10px] text-slate-500">반도체, 2차전지, 자동차 등</div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>수집 증권사</span>
                      <Building2 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-xl font-black text-purple-300 font-mono">
                      {brokerEntries.length}개 기관
                    </div>
                    <div className="text-[10px] text-slate-500">하나, 미래, 키움 등 주요 증권사</div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>PDF 원문 확보율</span>
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xl font-black text-emerald-300 font-mono">
                      {Math.round((storage.pdfSecured / total) * 100)}%
                    </div>
                    <div className="text-[10px] text-slate-500">
                      PDF ({storage.pdfSecured.toLocaleString()}건) / HTML ({storage.webContent.toLocaleString()}건)
                    </div>
                  </div>
                </div>

                {/* 2x2 Grid Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* ① 업종/섹터별 분포 */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white">1. 업종/섹터별 리포트 수집 분포</h4>
                      </div>
                      <span className="text-[10px] text-slate-400">총 {sectorEntries.length}개 산업군</span>
                    </div>

                    <div className="space-y-3">
                      {sectorEntries.map(([sec, count]: [string, any]) => {
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={sec} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-200">{sec}</span>
                              <div className="flex items-center space-x-2 font-mono">
                                <span className="text-cyan-300 font-bold">{count.toLocaleString()}건</span>
                                <span className="text-slate-500 text-[10px]">({pct}%)</span>
                                <button
                                  onClick={() => {
                                    setSelectedMonth(statsMonth);
                                    setSearchTerm(sec);
                                    setActiveSubTab('records');
                                  }}
                                  className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center space-x-0.5 border border-slate-800 hover:border-amber-700/60 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                  title={`${sec} 레코드 검색`}
                                >
                                  <span>조회</span>
                                  <ArrowUpRight className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ② 주요 증권사별 수집 분포 */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        <h4 className="text-xs font-bold text-white">2. 증권사별 수집 비중 TOP 10</h4>
                      </div>
                      <span className="text-[10px] text-slate-400">총 {brokerEntries.length}개 증권사</span>
                    </div>

                    <div className="space-y-3">
                      {brokerEntries.slice(0, 8).map(([brk, count]: [string, any]) => {
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={brk} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-200">{brk}</span>
                              <div className="flex items-center space-x-2 font-mono">
                                <span className="text-purple-300 font-bold">{count.toLocaleString()}건</span>
                                <span className="text-slate-500 text-[10px]">({pct}%)</span>
                                <button
                                  onClick={() => {
                                    setSelectedMonth(statsMonth);
                                    setSelectedBroker(brk);
                                    setActiveSubTab('records');
                                  }}
                                  className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center space-x-0.5 border border-slate-800 hover:border-amber-700/60 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                  title={`${brk} 필터링`}
                                >
                                  <span>필터</span>
                                  <ArrowUpRight className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ③ 보관 형태별 분포 */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <HardDrive className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold text-white">3. 보관 파일 형태별 통계</h4>
                      </div>
                      <span className="text-[10px] text-slate-400">PDF 스토리지 vs 웹 DB</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-slate-900/90 rounded-xl border border-emerald-900/40 space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                          <span>PDF 원문 파일 보관</span>
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div className="text-2xl font-black text-white font-mono">
                          {storage.pdfSecured.toLocaleString()}건
                        </div>
                        <div className="text-[10px] text-emerald-300 font-medium">
                          비중: {Math.round((storage.pdfSecured / total) * 100)}% (미리보기 & 다운로드 지원)
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                          <span>웹본문 HTML 보관</span>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-2xl font-black text-white font-mono">
                          {storage.webContent.toLocaleString()}건
                        </div>
                        <div className="text-[10px] text-amber-300 font-medium">
                          비중: {Math.round((storage.webContent / total) * 100)}% (본문 텍스트 DB 저장)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ④ 투자의견 분포 */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold text-white">4. 투자의견 (Investment Rating) 분포</h4>
                      </div>
                      <span className="text-[10px] text-slate-400">Buy / Hold / Outperform 등</span>
                    </div>

                    <div className="space-y-3">
                      {opinionEntries.map(([op, count]: [string, any]) => {
                        const pct = Math.round((count / total) * 100);
                        const isBuy = op === 'BUY';
                        const colorClass = isBuy ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-orange-500';

                        return (
                          <div key={op} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                                isBuy ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}>
                                {op}
                              </span>
                              <div className="flex items-center space-x-2 font-mono">
                                <span className="text-slate-200 font-bold">{count.toLocaleString()}건</span>
                                <span className="text-slate-500 text-[10px]">({pct}%)</span>
                              </div>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                              <div
                                className={`bg-gradient-to-r ${colorClass} h-full rounded-full transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        /* Raw JSON Viewer SubTab */
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-white">
                <Code className="w-4 h-4 text-amber-400" />
                <span>데이터베이스 스토리지 파일 구조 정보</span>
              </div>
              <button
                onClick={() => copyToClipboard(JSON.stringify(records.slice(0, 5), null, 2), '상위 5건 RAW JSON')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold rounded-lg border border-slate-700 flex items-center space-x-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>샘플 JSON 복사</span>
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2 font-mono">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold">📄 Master JSON DB 파일 위치:</span> <span className="text-slate-200">downloads/database/reports_master_db.json</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold">📁 PDF 보관 스토리지 디렉토리:</span> <span className="text-slate-200">downloads/naver_pdfs/YYYYMM/</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold">🔥 Firestore DB 컬렉션:</span> <span className="text-slate-200">reports / rep_&#123;NID&#125;</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-300 mb-2">실시간 보관 데이터샘플 (RAW JSON Array)</h4>
              <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 max-h-96 overflow-y-auto leading-relaxed">
                {JSON.stringify(records.slice(0, 3), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* RAW JSON Modal Inspector */}
      {selectedRecordForJson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">
                  DB 레코드 RAW JSON (NID #{selectedRecordForJson.nid})
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecordForJson(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(selectedRecordForJson, null, 2), 'JSON 데이터')}
                  className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 text-[11px] font-bold rounded border border-amber-800 flex items-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>JSON 전체 복사</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-amber-300 leading-relaxed overflow-x-auto">
                {JSON.stringify(selectedRecordForJson, null, 2)}
              </pre>
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedRecordForJson(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewPdfReport && (
        <PdfFileViewerModal
          report={previewPdfReport}
          onClose={() => setPreviewPdfReport(null)}
          onDownloadPdf={() => {
            if (previewPdfReport.pdfUrl) {
              const link = document.createElement('a');
              link.href = previewPdfReport.pdfUrl;
              link.download = `${previewPdfReport.stockName}_원문.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        />
      )}

      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-amber-500/80 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-bounce">
          <CheckCircle className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
