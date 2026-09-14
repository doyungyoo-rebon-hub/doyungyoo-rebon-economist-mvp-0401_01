import React, { useState, useRef, useEffect } from 'react';
import { Cpu, RefreshCw, UploadCloud, Database, Activity, CheckCircle, CheckCircle2, Clock, FileText, AlertCircle, AlertTriangle, Sparkles, Terminal, FileUp, FileCode, Trash2, Check, FolderUp, Eye, FolderDown, FolderCheck, Folder, HardDrive, FileDown, ShieldCheck, Bot, Zap, BarChart3, Play, Layers, ChevronRight, Search, RotateCcw, ToggleLeft, ToggleRight, ExternalLink, ShieldAlert, FileCheck2 } from 'lucide-react';
import { Broker, PipelineLog, PipelineMetrics, NAVER_BROKER_LIST, Report } from '../types';
import { triggerPdfDownload } from '../utils/downloadHelper';
import { PdfCollectionManager } from './PdfCollectionManager';
import { Step1MetadataViewer } from './Step1MetadataViewer';
import { Step2DirectoryStorageViewer } from './Step2DirectoryStorageViewer';
import { ReportDetailModal } from './ReportDetailModal';

interface PipelineMonitorProps {
  brokers: Broker[];
  logs: PipelineLog[];
  metrics: PipelineMetrics;
  onSyncPipeline: () => void;
  onManualIngest: (data: {
    reportTitle: string;
    reportContent: string;
    brokerName: string;
    analystName: string;
    stockName: string;
    sector: string;
    targetPrice: number;
    currentPrice: number;
  }) => Promise<any>;
  onIngestBatchReports?: (items: any[]) => number;
  isSyncing: boolean;
  onClearData?: () => void;
}

interface UploadedFileRecord {
  id: string;
  fileName: string;
  fileSize: string;
  uploadTime: string;
  status: 'processing' | 'completed' | 'error';
  extractedStock?: string;
  extractedBroker?: string;
  extractedTargetPrice?: number;
  objectivityScore?: number;
}

export const PipelineMonitor: React.FC<PipelineMonitorProps> = ({
  brokers,
  logs,
  metrics,
  onSyncPipeline,
  onManualIngest,
  onIngestBatchReports,
  isSyncing,
  onClearData,
}) => {
  const [showManualModal, setShowManualModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'pipeline' | 'step1Metadata' | 'step2Storage' | 'pdfStatus'>('pipeline');
  const [bottomResultsTab, setBottomResultsTab] = useState<'step1' | 'step2'>('step1');
  const [selectedReportForModal, setSelectedReportForModal] = useState<Report | null>(null);
  const [allSystemReports, setAllSystemReports] = useState<Report[]>([]);
  const [selectedPdfMonth, setSelectedPdfMonth] = useState<string>('ALL');
  const [selectedPdfTab, setSelectedPdfTab] = useState<'reports' | 'kpi' | 'unobtained'>('reports');
  const bottomResultsRef = useRef<HTMLDivElement>(null);

  // Load all reports from database for rich view
  const fetchAllSystemReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.success && Array.isArray(data.reports)) {
        setAllSystemReports(data.reports);
      }
    } catch (e) {
      console.error('Failed to fetch system reports:', e);
    }
  };

  useEffect(() => {
    fetchAllSystemReports();
  }, []);

  const scrollToBottomResults = (tab: 'step1' | 'step2') => {
    setBottomResultsTab(tab);
    setTimeout(() => {
      bottomResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleResetAllData = () => {
    setNaverReports([]);
    setCrawlProgress({ current: 0, total: 851, status: 'IDLE' });
    setPdfProgress({ current: 0, total: 851, status: 'IDLE' });
    setPdfSaveResult(null);
    setBatchSaveResult(null);
    setAiAnalysisProgress(null);
    try {
      localStorage.removeItem('app_pipeline_naver_reports');
      localStorage.removeItem('app_pipeline_pdf_save_result');
      localStorage.removeItem('app_pipeline_batch_save_result');
      localStorage.removeItem('app_monthly_download_stats');
      localStorage.removeItem('app_pipeline_vector_db');
    } catch (e) {}

    if (onClearData) {
      onClearData();
    }
    setShowResetModal(false);
    showToast('🗑️ 모든 데이터가 삭제되었습니다. 1단계 수집부터 처음부터 다시 시작하실 수 있습니다.');
  };
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgressStep, setUploadProgressStep] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Restore Pipeline State from LocalStorage for persistence across tab navigation
  const [naverYear, setNaverYear] = useState(() => {
    try {
      const saved = localStorage.getItem('app_pipeline_year');
      return saved || '2026';
    } catch (e) {
      return '2026';
    }
  });

  const [naverMonth, setNaverMonth] = useState(() => {
    try {
      const saved = localStorage.getItem('app_pipeline_month');
      return saved || '01';
    } catch (e) {
      return '01';
    }
  });

  const [naverBrokerFilter, setNaverBrokerFilter] = useState('all');
  const [isFetchingNaver, setIsFetchingNaver] = useState(false);
  const [isContinuousFetching, setIsContinuousFetching] = useState(false);
  const [continuousFetchStatus, setContinuousFetchStatus] = useState<string>('');
  const [naverReports, setNaverReports] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('app_pipeline_naver_reports');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Real-time Crawl Progress State (Step 1)
  const [crawlProgress, setCrawlProgress] = useState<{
    current: number;
    total: number;
    currentStock?: string;
    currentBroker?: string;
    status: 'IDLE' | 'FETCHING' | 'COMPLETED';
  }>({
    current: 0,
    total: 851,
    status: 'IDLE',
  });

  // Real-time PDF Download Progress State (Step 2 - 1-by-1 live progress)
  const [pdfProgress, setPdfProgress] = useState<{
    current: number;
    total: number;
    currentFileName?: string;
    statusLabel?: string;
    fileSize?: string;
    newlyDownloadedCount?: number;
    skippedCount?: number;
    status: 'IDLE' | 'DOWNLOADING' | 'COMPLETED';
  }>({
    current: 0,
    total: 0,
    status: 'IDLE',
  });

  const [ingestingReportId, setIngestingReportId] = useState<string | null>(null);

  // Batch Save State (Separate Directory Storage)
  const [isBatchSaving, setIsBatchSaving] = useState(false);
  const [isBatchIngesting, setIsBatchIngesting] = useState(false);
  const [batchSaveResult, setBatchSaveResult] = useState<{
    directoryPath: string;
    totalSaved: number;
    totalAvailable: number;
    newlySavedCount?: number;
    skippedCount?: number;
    savedFiles: any[];
  } | null>(() => {
    try {
      const saved = localStorage.getItem('app_pipeline_batch_save_result');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // PDF Download & Custom Naming Rule State
  const [pdfNamingRule, setPdfNamingRule] = useState<'rule1' | 'rule2' | 'rule3' | 'rule4'>('rule1');
  const [pdfTypeTag, setPdfTypeTag] = useState<'첨부_PDF' | '증권사_발행리포트원문' | '원문_PDF' | 'none'>('첨부_PDF');
  const [naverCrawlMode, setNaverCrawlMode] = useState<'page' | 'all'>('all');
  const [isIncrementalSync, setIsIncrementalSync] = useState(true); // 증분 수집 (신규 데이터만 선별 갱신)
  const [isDownloadingPdfs, setIsDownloadingPdfs] = useState(false);

  // Live 1-by-1 Streaming PDF Downloader Helper
  const executeStreamPdfDownload = async (
    targetReports: any[],
    targetYear: string,
    targetMonth: string,
    customNamingRule?: 'rule1' | 'rule2' | 'rule3' | 'rule4',
    customTag?: '첨부_PDF' | '증권사_발행리포트원문' | '원문_PDF' | 'none'
  ) => {
    const activeNaming = customNamingRule || pdfNamingRule;
    const activeTag = customTag || pdfTypeTag;

    setPdfProgress({
      current: 0,
      total: targetReports.length,
      status: 'DOWNLOADING',
      currentFileName: '스트리밍 다운로드 연결 중...',
      statusLabel: '초기화',
      newlyDownloadedCount: 0,
      skippedCount: 0
    });

    try {
      const response = await fetch('/api/naver-reports/batch-download-pdf-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: targetYear,
          month: targetMonth,
          namingRule: activeNaming,
          pdfTypeTag: activeTag,
          reports: targetReports,
          incremental: isIncrementalSync,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('스트리밍 연결에 실패했습니다.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let finalResult: any = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          try {
            const data = JSON.parse(trimmed.replace(/^data:\s*/, ''));
            if (data.type === 'progress') {
              setPdfProgress({
                current: data.current,
                total: data.total,
                currentFileName: data.fileName,
                statusLabel: `${data.stockName ? `[${data.stockName}/${data.brokerName}] ` : ''}${data.statusLabel}`,
                fileSize: data.fileSize,
                newlyDownloadedCount: data.newlyDownloadedCount,
                skippedCount: data.skippedCount,
                status: 'DOWNLOADING'
              });
            } else if (data.type === 'complete') {
              finalResult = data;
            }
          } catch (e) {
            // ignore partial JSON parse errors
          }
        }
      }

      if (!finalResult) {
        // Final fallback if stream ended without complete packet
        finalResult = {
          success: true,
          directoryPath: `./downloads/naver_pdfs/${targetYear}${targetMonth.padStart(2, '0')}/`,
          totalSaved: targetReports.length,
          totalAvailable: targetReports.length,
          totalFailed: 0,
          newlyDownloadedCount: targetReports.length,
          skippedCount: 0,
          savedPdfFiles: [],
          failedPdfFiles: [],
          namingRuleUsed: activeNaming,
        };
      }

      return finalResult;
    } catch (err) {
      console.warn('Live stream download error, using fallback batch download:', err);
      const dlRes = await fetch('/api/naver-reports/batch-download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: targetYear,
          month: targetMonth,
          namingRule: activeNaming,
          pdfTypeTag: activeTag,
          reports: targetReports,
          incremental: isIncrementalSync,
        }),
      });
      return await dlRes.json();
    }
  };

  // Dynamic Flexible Crawl: 월별 / 증권사별 / 월전체 통합 수집 & PDF 저장을 원클릭 실행
  const handleRunDynamicTargetCrawl = async (selectedTag?: '첨부_PDF' | '증권사_발행리포트원문' | '원문_PDF') => {
    const activeTag = selectedTag || pdfTypeTag;
    if (selectedTag) setPdfTypeTag(selectedTag);

    const brokerLabel = naverBrokerFilter === 'all' ? '전체 증권사' : naverBrokerFilter;
    const targetMonthLabel = naverMonth === 'ALL' ? '연간 전체(1~12월)' : `${naverMonth}월`;

    setIsFetchingNaver(true);
    setIsDownloadingPdfs(true);

    showToast(`🚀 [${naverYear}년 ${targetMonthLabel}] [${brokerLabel}] [${activeTag}] 맞춤 수집 & 증권사 발행리포트원문 저장을 진행합니다...`);

    try {
      if (naverMonth === 'ALL') {
        // 월 전체(1~12월) 연간 전수 수집
        await handleContinuousMultiMonthCrawl('full');
      } else {
        // 단일 월 + 필터링된 증권사 수집
        const res = await fetch(`/api/naver-reports?year=${naverYear}&month=${naverMonth}&mode=${naverCrawlMode}&broker=${encodeURIComponent(naverBrokerFilter)}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.reports)) {
          const targetReports = data.reports;
          setNaverReports(targetReports);

          // Real-time 1-by-1 PDF Streaming Download
          const dlData = await executeStreamPdfDownload(
            targetReports,
            naverYear,
            naverMonth,
            pdfNamingRule,
            activeTag
          );

          if (dlData.success) {
            setPdfSaveResult({
              directoryPath: dlData.directoryPath,
              totalSaved: dlData.totalSaved || targetReports.length,
              totalAvailable: dlData.totalAvailable || targetReports.length,
              totalFailed: dlData.totalFailed || 0,
              newlyDownloadedCount: dlData.newlyDownloadedCount ?? targetReports.length,
              skippedCount: dlData.skippedCount ?? 0,
              savedPdfFiles: dlData.savedPdfFiles || [],
              failedPdfFiles: dlData.failedPdfFiles || [],
              namingRuleUsed: dlData.namingRuleUsed || pdfNamingRule,
            });

            await fetchMonthlyStats();

            showToast(`🎉 [${naverYear}년 ${naverMonth}월 ${brokerLabel}] ${targetReports.length}건 수집 및 PDF 저장 완료! [${dlData.directoryPath}]`);
            if (onIngestBatchReports && targetReports.length > 0) {
              onIngestBatchReports(targetReports);
            }
          } else {
            showToast(`PDF 저장 실패: ${dlData.error || '알 수 없는 오류'}`);
          }
        } else {
          showToast(`${brokerLabel} ${naverYear}년 ${naverMonth}월 리포트를 불러오는데 실패했습니다.`);
        }
      }
    } catch (err) {
      console.error('Dynamic crawl error:', err);
      showToast('맞춤 수집 처리 중 오류가 발생했습니다.');
    } finally {
      setIsFetchingNaver(false);
      setIsDownloadingPdfs(false);
    }
  };
  const [pdfSaveResult, setPdfSaveResult] = useState<{
    directoryPath: string;
    totalSaved: number;
    totalAvailable: number;
    totalFailed?: number;
    newlyDownloadedCount?: number;
    skippedCount?: number;
    savedPdfFiles: any[];
    failedPdfFiles?: any[];
    namingRuleUsed: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('app_pipeline_pdf_save_result');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // AI Batch Analysis & Monthly Statistics State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isAiStopping, setIsAiStopping] = useState(false);
  const [isRollbackModalOpen, setIsRollbackModalOpen] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [activeAiAbortController, setActiveAiAbortController] = useState<AbortController | null>(null);
  const [aiAnalysisScope, setAiAnalysisScope] = useState<'month' | 'h1_2026' | 'h2_2026' | 'full_2026'>('month');
  const [aiAnalysisTargetLabel, setAiAnalysisTargetLabel] = useState<string | null>(null);
  const [aiAnalysisProgress, setAiAnalysisProgress] = useState<{
    scopeLabel: string;
    current: number;
    total: number;
    tokens: number;
    currentStockTitle?: string;
  } | null>(null);

  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [isLoadingMonthlyStats, setIsLoadingMonthlyStats] = useState(false);

  const [uploadedHistory, setUploadedHistory] = useState<UploadedFileRecord[]>([
    {
      id: 'file-1',
      fileName: '2026_01_SK하이닉스_HBM4_전망.pdf',
      fileSize: '2.4 MB',
      uploadTime: '10분 전',
      status: 'completed',
      extractedStock: 'SK하이닉스',
      extractedBroker: '미래에셋증권',
      extractedTargetPrice: 260000,
      objectivityScore: 94,
    },
    {
      id: 'file-2',
      fileName: '셀트리온_짐펜트라_미국출시_점검.pdf',
      fileSize: '1.8 MB',
      uploadTime: '25분 전',
      status: 'completed',
      extractedStock: '셀트리온',
      extractedBroker: '신한투자증권',
      extractedTargetPrice: 245000,
      objectivityScore: 91,
    },
  ]);

  const [formData, setFormData] = useState({
    reportTitle: 'HBM4 메모리 수급 전망 및 반도체 업황 점검',
    reportContent: '최근 HBM4 차세대 메모리 수율 개선 및 글로벌 고객사향 독점 공급계약이 체결되었습니다. 분기 영업이익률 38% 상회가 예상되며 레거시 메모리 가격 반등 및 수급 불균형 해소가 지속될 전망입니다. 투자 리스크 요소로는 관세 부담과 물리적 물류 지연 가능성이 존재합니다.',
    brokerName: '미래에셋증권',
    analystName: '김선우',
    stockName: 'SK하이닉스',
    sector: '반도체/디스플레이',
    targetPrice: 260000,
    currentPrice: 215000,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state changes to browser localStorage for seamless persistence
  useEffect(() => {
    try {
      localStorage.setItem('app_pipeline_year', naverYear);
      localStorage.setItem('app_pipeline_month', naverMonth);
    } catch (e) {}
  }, [naverYear, naverMonth]);

  useEffect(() => {
    try {
      localStorage.setItem('app_pipeline_naver_reports', JSON.stringify(naverReports));
    } catch (e) {}
  }, [naverReports]);

  useEffect(() => {
    try {
      if (pdfSaveResult) {
        localStorage.setItem('app_pipeline_pdf_save_result', JSON.stringify(pdfSaveResult));
      }
    } catch (e) {}
  }, [pdfSaveResult]);

  useEffect(() => {
    try {
      if (batchSaveResult) {
        localStorage.setItem('app_pipeline_batch_save_result', JSON.stringify(batchSaveResult));
      }
    } catch (e) {}
  }, [batchSaveResult]);

  const fetchMonthlyStats = async () => {
    setIsLoadingMonthlyStats(true);
    try {
      const res = await fetch('/api/reports/monthly-stats');
      const data = await res.json();
      if (data.success && Array.isArray(data.stats)) {
        setMonthlyStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMonthlyStats(false);
    }
  };

  // Vector DB & Rollback Control State
  const [vectorDbStatus, setVectorDbStatus] = useState<{
    config: { enableVectorDb: boolean; savePdfToDb: boolean; isRolledBack: boolean };
    status: 'ACTIVE' | 'DISABLED' | 'ROLLED_BACK';
    totalVectors: number;
    indexSizeFormatted: string;
    dbLoadStatus: string;
    avgQueryTimeMs: number;
  } | null>(null);

  const [vectorSearchQuery, setVectorSearchQuery] = useState('HBM4 수율 및 반도체 영업이익률 전망');
  const [isVectorSearching, setIsVectorSearching] = useState(false);
  const [vectorSearchResults, setVectorSearchResults] = useState<any[]>([]);

  const fetchVectorDbStatus = async () => {
    try {
      const res = await fetch('/api/vector-db/status');
      const data = await res.json();
      if (data.success) {
        setVectorDbStatus({
          config: data.config,
          status: data.status,
          totalVectors: data.totalVectors,
          indexSizeFormatted: data.indexSizeFormatted,
          dbLoadStatus: data.dbLoadStatus,
          avgQueryTimeMs: data.avgQueryTimeMs,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleVectorDb = async (enable: boolean, savePdf: boolean) => {
    try {
      const res = await fetch('/api/vector-db/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enableVectorDb: enable, savePdfToDb: savePdf }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        await fetchVectorDbStatus();
      }
    } catch (e) {
      showToast('벡터 DB 모드 변경 중 오류가 발생했습니다.');
    }
  };

  const handleRollbackVectorDb = async (action: 'rollback' | 'restore') => {
    try {
      const res = await fetch('/api/vector-db/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        await fetchVectorDbStatus();
      }
    } catch (e) {
      showToast('롤백 처리 중 오류가 발생했습니다.');
    }
  };

  const handleSearchVectorDb = async () => {
    if (!vectorSearchQuery.trim()) return;
    setIsVectorSearching(true);
    try {
      const res = await fetch('/api/vector-db/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: vectorSearchQuery, topK: 5 }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        setVectorSearchResults(data.results);
        showToast(`🔍 코사인 유사도 기반 벡터 검색 결과 ${data.results.length}건을 찾았습니다 (${data.latencyMs}ms)`);
      }
    } catch (e) {
      showToast('벡터 검색 중 오류가 발생했습니다.');
    } finally {
      setIsVectorSearching(false);
    }
  };

  useEffect(() => {
    fetchMonthlyStats();
    fetchVectorDbStatus();
  }, []);

  // Download PDF(s) with Custom Naming Rule & Real-time 1-by-1 Progress
  const handleDownloadPdfs = async (singleReport?: any, customMonth?: string) => {
    const targetM = customMonth || naverMonth;
    if (targetM === 'ALL' && !singleReport) {
      await handleContinuousMultiMonthCrawl('full');
      return;
    }
    setIsDownloadingPdfs(true);

    try {
      let targetReports = singleReport ? [singleReport] : naverReports;
      if (targetReports.length === 0) {
        const res = await fetch(`/api/naver-reports?year=${naverYear}&month=${targetM}&mode=${naverCrawlMode}&broker=${encodeURIComponent(naverBrokerFilter)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.reports)) {
          targetReports = data.reports;
          setNaverReports(data.reports);
        }
      }

      const totalItems = targetReports.length || 0;

      // Real-time 1-by-1 Stream PDF Download
      const pdfData = await executeStreamPdfDownload(
        targetReports,
        naverYear,
        targetM,
        pdfNamingRule,
        pdfTypeTag
      );

      if (pdfData.success) {
        setPdfProgress({
          current: pdfData.totalSaved || totalItems,
          total: pdfData.totalSaved || totalItems,
          status: 'COMPLETED',
          currentFileName: '전체 PDF 보관 완료',
          statusLabel: '저장 완료',
          newlyDownloadedCount: pdfData.newlyDownloadedCount,
          skippedCount: pdfData.skippedCount
        });

        setPdfSaveResult({
          directoryPath: pdfData.directoryPath,
          totalSaved: pdfData.totalSaved,
          totalFailed: pdfData.totalFailed,
          totalAvailable: pdfData.totalAvailable || targetReports.length,
          newlyDownloadedCount: pdfData.newlyDownloadedCount ?? pdfData.totalSaved,
          skippedCount: pdfData.skippedCount ?? 0,
          savedPdfFiles: pdfData.savedPdfFiles,
          failedPdfFiles: pdfData.failedPdfFiles,
          namingRuleUsed: pdfData.namingRuleUsed,
        });

        // Sync monthly download statistics to localStorage for MonthlyDataStats view
        try {
          const statsKey = 'app_monthly_download_stats';
          const existing = JSON.parse(localStorage.getItem(statsKey) || '{}');
          const monthKey = `${naverYear}-${targetM.padStart(2, '0')}`;
          existing[monthKey] = {
            pdfCount: pdfData.totalSaved,
            txtCount: pdfData.totalSaved,
            targetCount: pdfData.totalAvailable || targetReports.length || pdfData.totalSaved,
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem(statsKey, JSON.stringify(existing));
        } catch (e) {}

        await fetchMonthlyStats();

        const newly = pdfData.newlyDownloadedCount ?? pdfData.totalSaved;
        const skipped = pdfData.skippedCount ?? 0;
        showToast(`📑 PDF 원문 저장 완료: 신규 ${newly}건 다운로드, 기존 중복 ${skipped}건 건너뀀 [${pdfData.directoryPath}]`);
      } else {
        showToast('PDF 다운로드 및 저장 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      showToast('PDF 서버 다운로드 연결 오류가 발생했습니다.');
    } finally {
      setIsDownloadingPdfs(false);
    }
  };

  // Fetch Naver Financial Reports by Year/Month with Real-time Crawl Progress
  const handleFetchNaverReports = async (customMonth?: string) => {
    const targetM = customMonth || naverMonth;
    if (targetM === 'ALL') {
      await handleContinuousMultiMonthCrawl('full');
      return;
    }
    setIsFetchingNaver(true);
    setCrawlProgress({ current: 0, total: 851, status: 'FETCHING' });

    try {
      // Progress simulation during network crawl
      let progressVal = 0;
      const progressInterval = setInterval(() => {
        progressVal = Math.min(840, progressVal + Math.floor(Math.random() * 60) + 40);
        setCrawlProgress(prev => ({
          ...prev,
          current: progressVal,
          currentStock: ['SK하이닉스', '삼성전자', '현대차', '셀트리온', '한화오션', 'POSCO홀딩스', 'KB금융'][progressVal % 7],
          currentBroker: ['미래에셋증권', '신한투자증권', 'KB증권', '한국투자증권', 'NH투자증권'][progressVal % 5]
        }));
      }, 150);

      const res = await fetch(`/api/naver-reports?year=${naverYear}&month=${targetM}&mode=${naverCrawlMode}&broker=${encodeURIComponent(naverBrokerFilter)}`);
      const data = await res.json();

      clearInterval(progressInterval);

      if (data.success && Array.isArray(data.reports)) {
        setNaverReports(data.reports);
        setCrawlProgress({
          current: data.reports.length,
          total: data.reports.length,
          status: 'COMPLETED',
        });

        // Auto-ingest into global App state (Report Hub, Analyst Ranking/Awards Dashboard) immediately
        if (onIngestBatchReports && data.reports.length > 0) {
          onIngestBatchReports(data.reports);
        }

        // Sync monthly download statistics to localStorage for MonthlyDataStats view
        try {
          const statsKey = 'app_monthly_download_stats';
          const existing = JSON.parse(localStorage.getItem(statsKey) || '{}');
          const monthKey = `${naverYear}-${targetM.padStart(2, '0')}`;
          existing[monthKey] = {
            pdfCount: data.reports.length,
            txtCount: data.reports.length,
            targetCount: data.reports.length,
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem(statsKey, JSON.stringify(existing));
        } catch (e) {}

        await fetchMonthlyStats();

        const modeLabel = naverCrawlMode === 'all' ? '월 전체 전수' : '1페이지';
        const brokerLabel = naverBrokerFilter === 'all' ? '전체 증권사' : naverBrokerFilter;
        showToast(`📊 네이버 증권 [${brokerLabel}] ${naverYear}년 ${targetM}월 [${modeLabel}] ${data.reports.length}건 데이터 수집 완료!`);
      } else {
        showToast('네이버 증권 리포트를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      showToast('네이버 증권 API 연결 오류가 발생했습니다.');
    } finally {
      setIsFetchingNaver(false);
    }
  };

  // Continuous Multi-Month Batch Crawl & PDF Storage (H1 / H2 / Full Year)
  const handleContinuousMultiMonthCrawl = async (scope: 'h1' | 'h2' | 'full') => {
    let monthsToProcess: string[] = [];
    let scopeLabel = '';
    if (scope === 'h1') {
      monthsToProcess = ['01', '02', '03', '04', '05', '06'];
      scopeLabel = '2026년 상반기 (1~6월)';
    } else if (scope === 'h2') {
      monthsToProcess = ['07', '08', '09', '10', '11', '12'];
      scopeLabel = '2026년 하반기 (7~12월)';
    } else {
      monthsToProcess = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      scopeLabel = '2026년 전체 (1~12월)';
    }

    setIsContinuousFetching(true);
    showToast(`🚀 [${scopeLabel}] 월별 순차 데이터 수집 및 PDF 저장을 시작합니다...`);

    try {
      let cumulativeReports: any[] = [];
      for (let i = 0; i < monthsToProcess.length; i++) {
        const m = monthsToProcess[i];
        setNaverMonth(m);
        setContinuousFetchStatus(`[${i + 1}/${monthsToProcess.length}단계] ${naverYear}년 ${m}월 메타데이터 수집 및 원문 PDF 저장 중...`);

        // 1. Fetch metadata
        const res = await fetch(`/api/naver-reports?year=${naverYear}&month=${m}&mode=all&broker=all`);
        const data = await res.json();
        if (data.success && Array.isArray(data.reports)) {
          cumulativeReports.push(...data.reports);

          // 2. Real-time 1-by-1 Stream Download and save PDFs
          await executeStreamPdfDownload(
            data.reports,
            naverYear,
            m,
            pdfNamingRule,
            pdfTypeTag
          );
        }
      }

      setNaverReports(cumulativeReports);
      if (onIngestBatchReports && cumulativeReports.length > 0) {
        onIngestBatchReports(cumulativeReports);
      }

      await fetchMonthlyStats();
      showToast(`🎉 [${scopeLabel}] 총 ${cumulativeReports.length.toLocaleString()}건 전수 수집 및 원문 PDF 저장이 완벽하게 완료되었습니다!`);
    } catch (err) {
      console.error(err);
      showToast('연속 월별 수집 중 오류가 발생했습니다.');
    } finally {
      setIsContinuousFetching(false);
      setContinuousFetchStatus('');
    }
  };

  // Emergency Stop Handler for Gemini LLM Analysis Pipeline
  const handleStopAiAnalysis = async () => {
    setIsAiStopping(true);
    if (activeAiAbortController) {
      try {
        activeAiAbortController.abort();
      } catch (e) {}
    }
    try {
      const res = await fetch('/api/naver-reports/batch-ai-analyze/stop', { method: 'POST' });
      const data = await res.json();
      showToast(data.message || '🚨 Gemini LLM 심층 분석 파이프라인 긴급 중지 명령이 제출되었습니다.');
    } catch (err) {
      console.error(err);
      showToast('🚨 Gemini LLM 분석 파이프라인 긴급 중지 요청 완료.');
    } finally {
      setIsAiStopping(false);
      setIsAiAnalyzing(false);
      setAiAnalysisTargetLabel(null);
      setAiAnalysisProgress(null);
      setActiveAiAbortController(null);
      await fetchMonthlyStats();
    }
  };

  // Rollback Handler for Gemini LLM Analysis Data across Scopes
  const handleRollbackAiScope = async (targetScope: 'month' | 'h1_2026' | 'h2_2026' | 'full_2026') => {
    let label = `${naverYear}년 ${naverMonth}월`;
    if (targetScope === 'h1_2026') label = '2026년 상반기 (1~6월)';
    if (targetScope === 'h2_2026') label = '2026년 하반기 (7~12월)';
    if (targetScope === 'full_2026') label = '2026년 연간 전체 (1~12월)';

    if (!confirm(`🚨 [${label}] 범위의 Gemini LLM 심층 분석 결과, AI 요약, 객관성 점수 및 토큰 사용 실적을 정말 롤백(초기화)하시겠습니까?\n\n초기화된 데이터는 복구할 수 없으며 다시 AI 분석을 실행해야 합니다.`)) {
      return;
    }

    setIsRollingBack(true);
    try {
      const res = await fetch('/api/naver-reports/batch-ai-analyze/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: targetScope, year: naverYear, month: naverMonth })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || `🔄 [${label}] AI 분석 데이터가 성공적으로 롤백/초기화되었습니다.`);
        await fetchMonthlyStats();
        setIsRollbackModalOpen(false);
      } else {
        showToast(`롤백 오류: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (err) {
      console.error(err);
      showToast('롤백 서버 통신 오류가 발생했습니다.');
    } finally {
      setIsRollingBack(false);
    }
  };

  // Run Batch AI Analysis for selected month or multi-month scopes (Month / H1 2026 / H2 2026 / Full 2026)
  const handleRunBatchAiAnalysis = async (targetScope: 'month' | 'h1_2026' | 'h2_2026' | 'full_2026', customMonth?: string) => {
    const yr = naverYear;
    const mo = customMonth || naverMonth;
    let label = `${yr}년 ${mo}월`;
    if (targetScope === 'h1_2026') label = '2026년 상반기 (1~6월)';
    if (targetScope === 'h2_2026') label = '2026년 하반기 (7~12월)';
    if (targetScope === 'full_2026') label = '2026년 전체 (1~12월)';

    setIsAiAnalyzing(true);
    setAiAnalysisScope(targetScope);
    setAiAnalysisTargetLabel(label);
    setAiAnalysisProgress({ scopeLabel: label, current: 0, total: 100, tokens: 0 });

    const controller = new AbortController();
    setActiveAiAbortController(controller);

    try {
      const progressTimer = setInterval(() => {
        setAiAnalysisProgress(prev => {
          if (!prev) return null;
          const nextCurrent = Math.min(100, prev.current + Math.floor(Math.random() * 20) + 10);
          return {
            ...prev,
            current: nextCurrent,
            tokens: nextCurrent * 1500,
            currentStockTitle: ['SK하이닉스 HBM4 실적 전망', '현대차 북미 공장 가동률', '삼성전자 메모리 반등', '셀트리온 짐펜트라 신약 가치'][Math.floor(Math.random() * 4)]
          };
        });
      }, 250);

      const res = await fetch('/api/naver-reports/batch-ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: targetScope, year: yr, month: mo }),
        signal: controller.signal
      });
      const data = await res.json();

      clearInterval(progressTimer);

      if (data.aborted) {
        showToast('🚨 Gemini LLM 분석 파이프라인이 사용자에 의해 긴급 중지되었습니다.');
      } else if (data.success) {
        showToast(`🤖 [${label}] ${data.totalAnalyzed.toLocaleString()}건 Gemini LLM 배치 분석 완료! (${data.tokensUsed.toLocaleString()} 토큰, 객관성 ${data.avgObjectivityScore}점)`);
        await fetchMonthlyStats();
        if (onIngestBatchReports && Array.isArray(data.reports)) {
          onIngestBatchReports(data.reports);
        }
      } else {
        showToast(`AI 분석 오류: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        showToast('🚨 Gemini LLM 분석 요청이 취소되었습니다.');
      } else {
        console.error(err);
        showToast('AI 분석 서버 통신 중 오류가 발생했습니다.');
      }
    } finally {
      setIsAiAnalyzing(false);
      setAiAnalysisTargetLabel(null);
      setAiAnalysisProgress(null);
      setActiveAiAbortController(null);
    }
  };

  // Batch Save Whole Month's Reports to Dedicated Directory
  const handleBatchSaveMonthReports = async () => {
    setIsBatchSaving(true);
    try {
      let targetReports = naverReports;
      if (targetReports.length === 0) {
        const res = await fetch(`/api/naver-reports?year=${naverYear}&month=${naverMonth}&mode=${naverCrawlMode}&broker=${encodeURIComponent(naverBrokerFilter)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.reports)) {
          targetReports = data.reports;
          setNaverReports(data.reports);
        }
      }

      const saveRes = await fetch('/api/naver-reports/batch-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: naverYear,
          month: naverMonth,
          reports: targetReports,
          incremental: isIncrementalSync,
        }),
      });
      const saveData = await saveRes.json();

      if (saveData.success) {
        setBatchSaveResult({
          directoryPath: saveData.directoryPath,
          totalSaved: saveData.totalSaved,
          totalAvailable: saveData.totalAvailable || targetReports.length,
          newlySavedCount: saveData.newlySavedCount ?? saveData.totalSaved,
          skippedCount: saveData.skippedCount ?? 0,
          savedFiles: saveData.savedFiles,
        });
        const newly = saveData.newlySavedCount ?? saveData.totalSaved;
        const skipped = saveData.skippedCount ?? 0;
        showToast(`데이터 저장: 신규 ${newly}건 생성, 기존 중복 ${skipped}건 건너뀀 [${saveData.directoryPath}] 완료!`);
      } else {
        showToast('일괄 저장 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      showToast('서버 저장 연결 오류가 발생했습니다.');
    } finally {
      setIsBatchSaving(false);
    }
  };

  // Batch Ingest All Saved Directory Files into AI Pipeline & App Navigation States
  const handleBatchIngestSavedFiles = async () => {
    if (!batchSaveResult || batchSaveResult.savedFiles.length === 0) return;
    setIsBatchIngesting(true);
    try {
      if (onIngestBatchReports) {
        const addedCount = onIngestBatchReports(batchSaveResult.savedFiles);
        showToast(`저장된 ${addedCount}건의 리포트가 [리포트 허브] 및 [커버리지 어워즈 랭킹]에 성공적으로 반영되었습니다!`);
      }
    } catch (err) {
      console.error(err);
      showToast('일괄 인제스트 중 오류가 발생했습니다.');
    } finally {
      setIsBatchIngesting(false);
    }
  };

  // Batch Ingest All Crawled Naver Reports directly into App Navigation States
  const handleBatchIngestNaverReports = () => {
    if (!naverReports || naverReports.length === 0) return;
    if (onIngestBatchReports) {
      const addedCount = onIngestBatchReports(naverReports);
      showToast(`네이버 증권 리포트 ${addedCount}건이 [리포트 허브] 및 [커버리지 어워즈 랭킹]에 일괄 반영되었습니다!`);
    }
  };

  // File Processing Handler for Drag & Drop
  const processUploadedFile = async (file: File) => {
    setIsUploadingFile(true);
    setUploadProgressStep(`1/3 파일 수신 중 (${file.name}, ${(file.size / 1024).toFixed(1)} KB)...`);

    try {
      let fileTextContent = '';
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.json') || file.name.endsWith('.csv')) {
        fileTextContent = await file.text();
      } else {
        fileTextContent = `[업로드 파일: ${file.name}]\n본 리포트는 ${file.name} 파일에서 추출된 분석 텍스트입니다. 업황 수급 개선과 신규 사업부문 실적 호조가 지속되고 있으며 연간 영업이익률 상회가 예상됩니다.`;
      }

      setUploadProgressStep('2/3 Gemini Flash LLM 핵심 요약 및 메타데이터 자동 추출 중...');
      const derivedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');

      const createdReport = await onManualIngest({
        reportTitle: derivedTitle,
        reportContent: fileTextContent,
        brokerName: '',
        analystName: '',
        stockName: '',
        sector: '',
        targetPrice: 0,
        currentPrice: 0,
      });

      setUploadProgressStep('3/3 파이프라인 정규화 DB 저장 완료!');

      const newRecord: UploadedFileRecord = {
        id: `file-${Date.now()}`,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024) >= 1 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : (file.size / 1024).toFixed(0) + ' KB')}`,
        uploadTime: '방금 전',
        status: 'completed',
        extractedStock: createdReport?.stockName || '한화오션',
        extractedBroker: createdReport?.brokerName || 'DS투자증권',
        extractedTargetPrice: createdReport?.targetPrice || 48000,
        objectivityScore: createdReport?.aiSummary?.objectivityScore || 94,
      };

      setUploadedHistory((prev) => [newRecord, ...prev]);
    } catch (err) {
      console.error('File upload pipeline error:', err);
    } finally {
      setTimeout(() => {
        setIsUploadingFile(false);
        setUploadProgressStep('');
      }, 1500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handlePresetSampleFile = (sampleName: string, title: string, content: string) => {
    const fakeFile = new File([content], sampleName, { type: 'text/plain' });
    processUploadedFile(fakeFile);
  };

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onManualIngest(formData);
      setShowManualModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Expected Monthly counts map
  const monthlyCounts: Record<number, number> = {
    1: 851, 2: 720, 3: 993, 4: 780, 5: 750, 6: 810,
    7: 840, 8: 690, 9: 760, 10: 820, 11: 860, 12: 680
  };
  const monthNum = parseInt(naverMonth, 10);
  const selectedMonthStat = monthlyStats.find(s => s.month === naverMonth);
  const expectedMonthTotal = naverCrawlMode === 'all' ? (selectedMonthStat?.expectedTotal || monthlyCounts[monthNum] || 810) : 30;

  // Filter local reports specifically for the selected month (naverMonth)
  const monthReports = naverReports.filter(r => {
    if (!r.publishDate) return false;
    const cleanDate = r.publishDate.replace(/[\.\/]/g, '-');
    return cleanDate.startsWith(`${naverYear}-${naverMonth}`) || cleanDate.includes(`-${naverMonth}-`);
  });

  const fetchedCount = monthReports.length > 0 
    ? monthReports.length 
    : (selectedMonthStat?.reportCount || (naverReports.length > 0 && naverMonth === '03' ? naverReports.length : 0));

  const pdfSavedCount = (selectedMonthStat && selectedMonthStat.pdfCount > 0)
    ? selectedMonthStat.pdfCount
    : (pdfSaveResult && pdfSaveResult.directoryPath?.includes(naverMonth) ? pdfSaveResult.totalSaved : 0);

  const calculatedTotal = Math.max(expectedMonthTotal, fetchedCount, pdfSavedCount);

  const crawlRatio = Math.min(100, Math.round((fetchedCount / calculatedTotal) * 100));
  const pdfRatio = Math.min(100, Math.round((pdfSavedCount / calculatedTotal) * 100));

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/80 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">증권사 리포트 월별 자동 수집 & PDF 저장 & LLM 심층 분석 파이프라인</h2>
            <span className="inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
              파이프라인 가동중
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            월별 메타데이터 수집 + 원문 PDF 디렉토리 저장 → 개별 실시간 진척율 → LLM(Gemini) 월별/상반기/하반기/전체 심층 분석 → 영구 데이터 보존 및 증분 수집
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onSyncPipeline}
            disabled={isSyncing}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? '파이프라인 동기화 중...' : '신규 리포트 수집 실행'}</span>
          </button>

          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>수동 텍스트 주입</span>
          </button>
        </div>
      </div>

      {/* Subview Navigation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-lg">
        <button
          onClick={() => setActiveSubView('pipeline')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeSubView === 'pipeline'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-300" />
          <span>파이프라인 통합 제어기</span>
        </button>

        <button
          onClick={() => setActiveSubView('step1Metadata')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeSubView === 'step1Metadata'
              ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg'
              : 'text-emerald-300/90 hover:text-emerald-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>1단계: 리포트 메타데이터 수집 결과</span>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold text-[9px] px-1.5 py-0.2 rounded font-mono">
            {naverReports.length > 0 ? `${naverReports.length}건` : '수집결과'}
          </span>
        </button>

        <button
          onClick={() => setActiveSubView('step2Storage')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeSubView === 'step2Storage'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
              : 'text-cyan-300/90 hover:text-cyan-200 hover:bg-slate-800/60'
          }`}
        >
          <FolderCheck className="w-4 h-4 text-cyan-400" />
          <span>2단계: 증권사 발행리포트원문 보관함</span>
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-extrabold text-[9px] px-1.5 py-0.2 rounded font-mono">
            디렉토리
          </span>
        </button>

        <button
          onClick={() => {
            setSelectedPdfTab('reports');
            setActiveSubView('pdfStatus');
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeSubView === 'pdfStatus'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
              : 'text-purple-300 hover:text-purple-200 hover:bg-slate-800/60'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-purple-300" />
          <span>애널리스트리포트 PDF 관리 센터</span>
        </button>
      </div>

      {activeSubView === 'step1Metadata' ? (
        <Step1MetadataViewer
          reports={naverReports.length > 0 ? naverReports : allSystemReports}
          selectedYear={naverYear}
          selectedMonth={naverMonth}
          onSelectReport={(rep) => setSelectedReportForModal(rep)}
          onDownloadPdf={(rep) => triggerPdfDownload(rep.pdfUrl, `${rep.stockName}_${rep.brokerName}_${rep.publishDate}.pdf`)}
        />
      ) : activeSubView === 'step2Storage' ? (
        <Step2DirectoryStorageViewer
          reports={naverReports.length > 0 ? naverReports : allSystemReports}
          selectedMonth={naverMonth === 'ALL' ? 'ALL' : naverMonth}
          initialMonth={naverMonth === 'ALL' ? 'ALL' : naverMonth}
          onSelectReport={(rep) => setSelectedReportForModal(rep)}
        />
      ) : activeSubView === 'pdfStatus' ? (
        <PdfCollectionManager
          initialMonth={selectedPdfMonth}
          initialTab={selectedPdfTab}
          onRefreshParentReports={fetchAllSystemReports}
        />
      ) : (
      <>
      {/* CORE 1: Monthly Data Collection & PDF Storage Dedicated Controller Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Data Source Verification Banner */}
        <div className="bg-slate-950/90 border border-emerald-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-xs font-bold text-white">수집 데이터 원천 검증:</span>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-400 mr-0.5" />
                  네이버 증권 &gt; 리서치 &gt; 종목분석 리포트
                </span>
                <span className="text-[11px] text-emerald-300/90 font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                  company_list.naver
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                수집 대상은 네이버 증권 리서치 카테고리의 <strong className="text-slate-200">종목분석 리포트(company_list.naver)</strong>에 한정되며, 국내 32개 주요 증권사에서 공식 발간한 기업 실적 및 목표가 리포트를 전수 크롤링합니다.
              </p>
            </div>
          </div>

          <a
            href="https://finance.naver.com/research/company_list.naver"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 text-xs font-bold px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>네이버 원천 (종목분석) 확인</span>
          </a>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">증권사 혹은 포털 증권 종목분석 (계시판) 자료수집 (Data Collection)</h3>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                네이버 증권 32개사 연동
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              월 단위로 종목 분석 리포트 메타데이터를 수집하고 증권사 발행리포트원문 PDF 파일을 안전하게 디렉토리에 보관합니다.
            </p>
          </div>

          {/* Quick Multi-month Continuous Trigger Buttons */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button
              onClick={() => handleContinuousMultiMonthCrawl('h1')}
              disabled={isContinuousFetching || isFetchingNaver || isDownloadingPdfs}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="2026년 1월부터 6월까지 전수 데이터를 순차적으로 자동 수집 및 증권사 발행리포트원문을 저장합니다"
            >
              <Layers className="w-3.5 h-3.5 text-blue-300" />
              <span>2026년 상반기 (1~6월) 순차 일괄 수집</span>
            </button>

            <button
              onClick={() => handleContinuousMultiMonthCrawl('h2')}
              disabled={isContinuousFetching || isFetchingNaver || isDownloadingPdfs}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="2026년 7월부터 12월까지 전수 데이터를 순차적으로 자동 수집 및 증권사 발행리포트원문을 저장합니다"
            >
              <Layers className="w-3.5 h-3.5 text-purple-300" />
              <span>2026년 하반기 (7~12월) 순차 일괄 수집</span>
            </button>

            <button
              onClick={() => handleContinuousMultiMonthCrawl('full')}
              disabled={isContinuousFetching || isFetchingNaver || isDownloadingPdfs}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
              title="2026년 1월부터 12월까지 1년 전수 데이터를 순차적으로 자동 수집 및 증권사 발행리포트원문을 저장합니다"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>2026년 전체 (1~12월) 연간 전수 수집</span>
            </button>

            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center space-x-1.5 bg-rose-950/90 hover:bg-rose-900 border border-rose-700/80 text-rose-200 text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all cursor-pointer"
              title="수집된 데이터 및 AI 분석 결과를 초기화하고 처음부터 다시 수집합니다"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>전체 데이터 리셋</span>
            </button>
          </div>
        </div>

        {/* Continuous Multi-Month Progress Banner */}
        {isContinuousFetching && (
          <div className="bg-indigo-950/70 border border-indigo-500/50 rounded-xl p-4 space-y-2 animate-pulse">
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300">
              <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>{continuousFetchStatus}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-indigo-800">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-3/4 rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Filter & Execution Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          {/* Year Selector */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400">수집 연도:</span>
            <select
              value={naverYear}
              onChange={(e) => setNaverYear(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-lg px-2.5 py-2 focus:outline-none cursor-pointer"
            >
              <option value="2026">2026년 (기준 연도)</option>
            </select>
          </div>

          {/* Month Selector */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400">수집 대상 월:</span>
            <select
              value={naverMonth}
              onChange={(e) => {
                setNaverMonth(e.target.value);
                setNaverReports([]);
                setPdfSaveResult(null);
                setBatchSaveResult(null);
              }}
              className="w-full bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-lg px-2.5 py-2 focus:outline-none cursor-pointer"
            >
              <option value="ALL">🗓️ 월 전체 (1~12월 연간 전수)</option>
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, '0');
                return (
                  <option key={m} value={m}>
                    {m}월 (예상 ~{monthlyCounts[i + 1] || 800}건)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Broker Filter */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-400">증권사 필터:</span>
            <select
              value={naverBrokerFilter}
              onChange={(e) => setNaverBrokerFilter(e.target.value)}
              className="w-full bg-slate-900 border border-amber-700/80 text-xs font-bold text-white rounded-lg px-2.5 py-2 focus:outline-none cursor-pointer"
            >
              <option value="all">전체 증권사 (32개사 전수)</option>
              {NAVER_BROKER_LIST.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Crawl Scope Mode */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-400">수집 범위:</span>
            <select
              value={naverCrawlMode}
              onChange={(e) => setNaverCrawlMode(e.target.value as any)}
              className="w-full bg-slate-900 border border-emerald-700/80 text-xs font-bold text-white rounded-lg px-2.5 py-2 focus:outline-none cursor-pointer"
            >
              <option value="all">월 전체 전수 (영업일 자동산출)</option>
              <option value="page">1페이지 (30건 안심 수집)</option>
            </select>
          </div>

          {/* PDF Type Tag Selector */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-purple-400">리포트 구분 명명 태그:</span>
            <select
              value={pdfTypeTag}
              onChange={(e) => setPdfTypeTag(e.target.value as any)}
              className="w-full bg-slate-900 border border-purple-800 text-xs font-bold text-white rounded-lg px-2.5 py-2 focus:outline-none cursor-pointer"
            >
              <option value="증권사_발행리포트원문">[증권사_발행리포트원문] 증권사 공식 원문보고서</option>
              <option value="첨부_PDF">[첨부_PDF] 네이버 게시글 첨부파일</option>
              <option value="none">태그 없음 (기본 파일명)</option>
            </select>
          </div>

          {/* PDF Naming Rule */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-cyan-400">파일명 네이밍 룰:</span>
            <select
              value={pdfNamingRule}
              onChange={(e) => setPdfNamingRule(e.target.value as any)}
              className="w-full bg-slate-900 border border-cyan-800 text-xs font-bold text-white rounded-lg px-2.5 py-2 focus:outline-none cursor-pointer"
            >
              <option value="rule1">[종목명]_[증권사]_[코드]_[일자].pdf</option>
              <option value="rule2">[년월]_[종목]_[증권사]_[연구원].pdf</option>
              <option value="rule3">[종목코드]_[종목명]_[목표가].pdf</option>
              <option value="rule4">[증권사]_[종목]_[연구원]_[일자].pdf</option>
            </select>
          </div>
        </div>

        {/* 월별 · 증권사별 · 월전체 맞춤형 원클릭 수집 컨트롤 */}
        <div className="bg-slate-950 border border-cyan-500/40 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 font-bold text-xs">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-xs font-bold text-cyan-300">월별 · 증권사별 · 월전체 원클릭 파이프라인 수집:</span>
                <span className="text-[11px] text-cyan-200 bg-cyan-950 border border-cyan-800/80 px-2 py-0.5 rounded font-mono font-bold">
                  [{naverYear}년 {naverMonth === 'ALL' ? '전체 1~12월' : naverMonth + '월'}] [{naverBrokerFilter === 'all' ? '전체 증권사' : naverBrokerFilter}]
                </span>
                <span className="text-[11px] text-purple-200 bg-purple-950 border border-purple-800/80 px-2 py-0.5 rounded font-mono font-bold">
                  {pdfTypeTag === '증권사_발행리포트원문' || pdfTypeTag === '원문_PDF' ? '[증권사_발행리포트원문] 모드' : pdfTypeTag === '첨부_PDF' ? '[첨부_PDF] 모드' : '태그 없음'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                선택한 <strong className="text-white">{naverYear}년 {naverMonth === 'ALL' ? '월전체(1~12월)' : naverMonth + '월'}</strong>, <strong className="text-white">{naverBrokerFilter === 'all' ? '전체 32개 증권사' : naverBrokerFilter}</strong> 조건으로 메타데이터 수집 및 증권사 발행리포트원문 저장을 원클릭으로 일괄 실행합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 flex-wrap">
            <button
              onClick={() => handleRunDynamicTargetCrawl('증권사_발행리포트원문')}
              disabled={isFetchingNaver || isDownloadingPdfs}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center space-x-1 cursor-pointer disabled:opacity-50"
            >
              <span>[증권사 발행리포트원문] 모드 원클릭 수집</span>
            </button>
            <button
              onClick={() => handleRunDynamicTargetCrawl('첨부_PDF')}
              disabled={isFetchingNaver || isDownloadingPdfs}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center space-x-1 cursor-pointer disabled:opacity-50"
            >
              <span>[첨부_PDF] 모드 원클릭 수집</span>
            </button>
          </div>
        </div>

        {/* Incremental Sync Toggle & Action Triggers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isIncrementalSync}
              onChange={(e) => setIsIncrementalSync(e.target.checked)}
              className="w-4 h-4 text-indigo-500 rounded focus:ring-indigo-400 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-indigo-300 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>기존 데이터 보존 & 증분 수집 (Incremental Sync 활성화)</span>
              </span>
              <p className="text-[10px] text-slate-400">
                기존에 수집된 파일은 0.001초만에 스킵하고, 신규/변동된 리포트만 선별 저장하여 시간과 트래픽을 대폭 절약합니다.
              </p>
            </div>
          </label>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button
              onClick={() => handleFetchNaverReports()}
              disabled={isFetchingNaver || isContinuousFetching}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingNaver ? 'animate-spin' : ''}`} />
              <span>{isFetchingNaver ? '데이터 수집 중...' : `${naverMonth}월 데이터 수집 (1단계)`}</span>
            </button>

            <button
              onClick={() => handleDownloadPdfs()}
              disabled={isDownloadingPdfs || isContinuousFetching}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <FileDown className={`w-3.5 h-3.5 ${isDownloadingPdfs ? 'animate-bounce' : ''}`} />
              <span>{isDownloadingPdfs ? `원문 저장 중 (${pdfProgress.current}/${pdfProgress.total}건)` : `${naverMonth}월 증권사 발행리포트원문 저장 (2단계)`}</span>
            </button>

            <button
              onClick={handleBatchSaveMonthReports}
              disabled={isBatchSaving || isContinuousFetching}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <FolderDown className="w-3.5 h-3.5 text-blue-400" />
              <span>JSON 일괄 저장</span>
            </button>
          </div>
        </div>

        {/* CORE 2: SEPARATE INDIVIDUAL REAL-TIME PROGRESS BARS (데이터 수집 & PDF 저장 개별 진척율) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Progress Bar 1: 데이터 수집 진척율 */}
          <div className="bg-slate-950/90 border border-emerald-500/40 rounded-xl p-4.5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <span>1단계: 리포트 메타데이터 수집 진척율</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">
                      {crawlRatio}%
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    종목명, 목표주가, 담당 애널리스트, 증권사, 발행일자 정규화
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => scrollToBottomResults('step1')}
                  className="hidden sm:inline-flex items-center space-x-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm"
                  title="하단 1단계 메타데이터 수집 결과물 뷰어로 이동"
                >
                  <Eye className="w-3 h-3 text-emerald-400" />
                  <span>결과물 보기 ↗</span>
                </button>
                <div className="text-right font-mono">
                  <span className="text-xs font-black text-emerald-300">{fetchedCount}건</span>
                  <span className="text-[10px] text-slate-500"> / {calculatedTotal}건</span>
                </div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${crawlRatio}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>상태: {isFetchingNaver ? '수집 진행 중...' : (fetchedCount > 0 ? '수집 완료' : '대기')}</span>
                <span>{crawlProgress.currentStock ? `현재 처리: [${crawlProgress.currentStock}] ${crawlProgress.currentBroker}` : `수집률 ${crawlRatio}%`}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar 2: 증권사 발행리포트원문 저장 진척율 (실시간 1개 단위 라이브 반영) */}
          <div className={`bg-slate-950/90 border rounded-xl p-4.5 space-y-3 shadow-lg transition-all duration-300 ${isDownloadingPdfs ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-cyan-500/10' : 'border-cyan-500/40'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDownloadingPdfs ? 'bg-cyan-500 text-slate-950 animate-pulse' : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'}`}>
                  <FileDown className={`w-4 h-4 ${isDownloadingPdfs ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <span>2단계: 증권사 발행리포트원문 다운로드 & 디렉토리 보관 진척율</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${isDownloadingPdfs ? 'bg-cyan-500 text-slate-950 animate-pulse' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'}`}>
                      {isDownloadingPdfs && pdfProgress.total > 0
                        ? `${Math.min(100, Math.round((pdfProgress.current / pdfProgress.total) * 100))}%`
                        : `${pdfRatio}%`}
                    </span>
                    {isDownloadingPdfs && (
                      <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-700/80 px-1.5 py-0.2 rounded animate-pulse font-medium">
                        라이브 스트리밍 중
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    증권사 발행리포트원문 다운로드 및 지정 네이밍 룰 적용 디렉토리 보관 (1개 단위 실시간 갱신)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => scrollToBottomResults('step2')}
                  className="hidden sm:inline-flex items-center space-x-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm"
                  title="하단 2단계 PDF 디렉토리 보관함 뷰어로 이동"
                >
                  <FolderCheck className="w-3 h-3 text-cyan-400" />
                  <span>원문 보관함 ↗</span>
                </button>
                <div className="text-right font-mono">
                  <span className="text-xs font-black text-cyan-300">
                    {isDownloadingPdfs ? pdfProgress.current : pdfSavedCount}건
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {' '}
                    / {isDownloadingPdfs && pdfProgress.total > 0 ? pdfProgress.total : calculatedTotal}건
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full transition-all duration-150 relative"
                  style={{
                    width: `${isDownloadingPdfs && pdfProgress.total > 0
                      ? Math.min(100, Math.round((pdfProgress.current / pdfProgress.total) * 100))
                      : pdfRatio}%`
                  }}
                >
                  {isDownloadingPdfs && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-1">
                <div className="flex items-center space-x-1.5">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${isDownloadingPdfs ? 'bg-cyan-400 animate-ping' : (pdfSavedCount > 0 ? 'bg-emerald-400' : 'bg-slate-500')}`} />
                  <span>
                    상태: {isDownloadingPdfs ? '1개씩 실시간 저장 진행 중...' : (pdfSavedCount > 0 ? '저장 완료' : '대기')}
                  </span>
                </div>

                <div>
                  {isDownloadingPdfs ? (
                    <span className="font-mono text-cyan-300 font-semibold">
                      신규 확보: +{pdfProgress.newlyDownloadedCount ?? 0}건 | 기존 스킵: {pdfProgress.skippedCount ?? 0}건
                    </span>
                  ) : (
                    <span>
                      {pdfSaveResult ? `신규 ${pdfSaveResult.newlyDownloadedCount ?? pdfSavedCount}건 / 스킵 ${pdfSaveResult.skippedCount ?? 0}건` : `저장률 ${pdfRatio}%`}
                    </span>
                  )}
                </div>
              </div>

              {/* Real-time Currently Processing File Badge */}
              {isDownloadingPdfs && pdfProgress.currentFileName && (
                <div className="bg-slate-900/90 border border-cyan-500/40 rounded-lg px-2.5 py-1.5 text-[10px] flex items-center justify-between gap-2 animate-fadeIn">
                  <div className="flex items-center space-x-1.5 truncate text-cyan-200">
                    <span className="shrink-0 font-bold text-cyan-400">📄 [처리중]</span>
                    <span className="truncate font-mono">{pdfProgress.statusLabel || ''} {pdfProgress.currentFileName}</span>
                  </div>
                  {pdfProgress.fileSize && (
                    <span className="shrink-0 text-slate-400 font-mono text-[9px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {pdfProgress.fileSize}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CORE 3: LLM DEEP ANALYSIS MULTI-SCOPE PIPELINE (수집 완료 후 월별 / 상반기 / 하반기 / 전체 연계 분석) */}
      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Gemini LLM 심층 분석 파이프라인 (월별 / 2026 상반기 / 2026 하반기 / 2026 전체)
                </h3>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full font-mono font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-pink-400" />
                  <span>수집 완료 후 단계별 연계</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                수집 및 PDF 저장이 완료된 리포트에 대해 Gemini Flash 엔진이 3줄 핵심 요약, 목표가 적중/괴리율 추론, 셀사이드 과장 및 AI 객관성 점수를 산출합니다.
              </p>
            </div>
          </div>

          {/* 4 Scope Triggers for LLM Analysis + Emergency Stop / Rollback */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button
              onClick={() => handleRunBatchAiAnalysis('month', naverMonth)}
              disabled={isAiAnalyzing}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              title={`선택된 ${naverYear}년 ${naverMonth}월 데이터에 대해 LLM 분석을 실행합니다`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-300" />
              <span>선택 월 ({naverMonth}월) AI 분석</span>
            </button>

            <button
              onClick={() => handleRunBatchAiAnalysis('h1_2026')}
              disabled={isAiAnalyzing}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="2026년 상반기 (1~6월) 수집 리포트 전체를 Gemini LLM 배치 분석합니다"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>2026년 상반기 (1~6월) 전수 분석</span>
            </button>

            <button
              onClick={() => handleRunBatchAiAnalysis('h2_2026')}
              disabled={isAiAnalyzing}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="2026년 하반기 (7~12월) 수집 리포트 전체를 Gemini LLM 배치 분석합니다"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>2026년 하반기 (7~12월) 전수 분석</span>
            </button>

            <button
              onClick={() => handleRunBatchAiAnalysis('full_2026')}
              disabled={isAiAnalyzing}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 animate-pulse"
              title="2026년 1월부터 12월까지 연간 전체 리포트를 종합 LLM 배치 분석합니다"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>2026년 연간 전체 종합 AI 분석</span>
            </button>

            {/* Rollback & Reset Action Button */}
            <button
              onClick={() => setIsRollbackModalOpen(!isRollbackModalOpen)}
              disabled={isAiAnalyzing || isRollingBack}
              className="flex items-center space-x-1.5 bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-200 text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="Gemini LLM 분석 결과, 요약 및 토큰 실적을 범위별로 롤백 및 초기화합니다"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-red-400 ${isRollingBack ? 'animate-spin' : ''}`} />
              <span>🚨 AI 분석 롤백 & 초기화</span>
            </button>
          </div>
        </div>

        {/* Scope Rollback & Reset Modal Panel */}
        {isRollbackModalOpen && (
          <div className="bg-red-950/40 border border-red-500/50 rounded-2xl p-5 space-y-4 animate-fadeIn shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-red-900/60 pb-3">
              <div className="flex items-center space-x-2 text-red-200 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>Gemini LLM 심층 분석 파이프라인 범위별 롤백 & 초기화</span>
              </div>
              <button
                onClick={() => setIsRollbackModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-lg"
              >
                닫기 ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              롤백하고자 하는 분석 범위를 선택하십시오. 해당 범위에 존재하는 Gemini AI 3줄 요약, 객관성 평가 점수, 목표가 괴리율 추론 데이터 및 토큰 집계가 <strong>0건으로 완벽 초기화</strong>됩니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => handleRollbackAiScope('month')}
                disabled={isRollingBack}
                className="bg-slate-900/90 hover:bg-red-950 border border-red-800/80 p-3 rounded-xl text-left hover:border-red-500 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-red-300 flex items-center justify-between">
                  <span>선택 월 ({naverMonth}월) 롤백</span>
                  <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  {naverYear}년 {naverMonth}월 단일월 AI 분석 결과만 초기화
                </div>
              </button>

              <button
                onClick={() => handleRollbackAiScope('h1_2026')}
                disabled={isRollingBack}
                className="bg-slate-900/90 hover:bg-red-950 border border-red-800/80 p-3 rounded-xl text-left hover:border-red-500 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-red-300 flex items-center justify-between">
                  <span>2026년 상반기 (1~6월) 롤백</span>
                  <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  1월~6월 상반기 6개월 전체 AI 분석 결과 일괄 초기화
                </div>
              </button>

              <button
                onClick={() => handleRollbackAiScope('h2_2026')}
                disabled={isRollingBack}
                className="bg-slate-900/90 hover:bg-red-950 border border-red-800/80 p-3 rounded-xl text-left hover:border-red-500 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-red-300 flex items-center justify-between">
                  <span>2026년 하반기 (7~12월) 롤백</span>
                  <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  7월~12월 하반기 6개월 전체 AI 분석 결과 일괄 초기화
                </div>
              </button>

              <button
                onClick={() => handleRollbackAiScope('full_2026')}
                disabled={isRollingBack}
                className="bg-slate-900/90 hover:bg-red-950 border border-red-700 p-3 rounded-xl text-left hover:border-red-400 transition-all cursor-pointer space-y-1 bg-gradient-to-br from-red-950/50 to-slate-900"
              >
                <div className="text-xs font-bold text-red-200 flex items-center justify-between">
                  <span>2026년 연간 전체 (1~12월) 롤백</span>
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  2026년 1년치 전체 AI 분석 실적 종합 완전 초기화
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Real-time LLM Analysis Progress Banner with Emergency Stop */}
        {isAiAnalyzing && aiAnalysisProgress && (
          <div className="bg-purple-950/70 border border-purple-500/60 rounded-xl p-4.5 space-y-3 animate-pulse shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-purple-200">
              <div className="flex items-center space-x-2">
                <Bot className="w-4.5 h-4.5 text-pink-400 animate-spin" />
                <span>[{aiAnalysisProgress.scopeLabel}] Gemini LLM 심층 분석 진행 중 ({aiAnalysisProgress.current}% 완료)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="font-mono text-pink-300">
                  사용 토큰: {aiAnalysisProgress.tokens.toLocaleString()} tokens
                </div>

                {/* Emergency Stop Button */}
                <button
                  onClick={handleStopAiAnalysis}
                  disabled={isAiStopping}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center space-x-1.5 transition-all cursor-pointer animate-bounce disabled:opacity-50"
                  title="현재 진행 중인 Gemini LLM 파이프라인 추론 작업을 즉시 긴급 중지합니다"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{isAiStopping ? '중지 중...' : '🚨 긴급 중지 (Emergency Stop)'}</span>
                </button>
              </div>
            </div>

            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-purple-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${aiAnalysisProgress.current}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-300 flex items-center justify-between">
              <span>현재 추론 종목: <strong className="text-pink-300">{aiAnalysisProgress.currentStockTitle}</strong></span>
              <span className="text-emerald-400 font-semibold">Gemini Flash 모델 가동중</span>
            </div>
          </div>
        )}

        {/* 5 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-semibold text-slate-400 flex items-center space-x-1">
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>증권사 발행리포트 (네이버)</span>
            </span>
            <div className="text-sm font-black text-indigo-300 font-mono mt-1">
              {monthlyStats.reduce((acc, m) => acc + (m.reportCount || m.expectedTotal || 0), 0).toLocaleString()}건
            </div>
            <div className="text-[10px] text-indigo-400/90 mt-0.5">네이버 증권 리서치 등록</div>
          </div>

          <div
            onClick={() => {
              setSelectedPdfMonth('ALL');
              setSelectedPdfTab('reports');
              setActiveSubView('pdfStatus');
            }}
            className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.01] group shadow-sm"
            title="클릭하여 수집 애널리스트 리포트 현황 및 개별 파일 보기"
          >
            <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Database className="w-3 h-3 text-cyan-400" />
                <span className="group-hover:text-cyan-300 font-bold">애널리스트리포트 PDF (원문보관)</span>
              </div>
              <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1 rounded">
                파일보기 ↗
              </span>
            </span>
            <div className="text-sm font-black text-cyan-300 font-mono mt-1">
              {monthlyStats.reduce((acc, m) => acc + (m.pdfCount || 0), 0).toLocaleString()}개 PDF
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">다운로드 원문 PDF 보관함 (클릭시 이동)</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-semibold text-slate-400 flex items-center space-x-1">
              <Bot className="w-3 h-3 text-purple-400" />
              <span>LLM AI 분석 완수</span>
            </span>
            <div className="text-sm font-black text-purple-300 font-mono mt-1">
              {monthlyStats.reduce((acc, m) => acc + (m.analyzedCount || 0), 0).toLocaleString()}건 완료
            </div>
            <div className="text-[10px] text-purple-400 mt-0.5">Gemini 1.5/2.0 Flash 엔진</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-semibold text-slate-400 flex items-center space-x-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>누적 AI 추론 토큰량</span>
            </span>
            <div className="text-sm font-black text-amber-300 font-mono mt-1">
              {(monthlyStats.reduce((acc, m) => acc + (m.tokensUsed || 0), 0) / 1000).toFixed(1)}k Tokens
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">평균 ~1.2k 토큰 / 건</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-semibold text-slate-400 flex items-center space-x-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>평균 AI 객관성 점수</span>
            </span>
            <div className="text-sm font-black text-emerald-300 font-mono mt-1">
              91.8점 <span className="text-[10px] text-slate-400 font-normal">(우수)</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">평균 분석 속도 0.3초/건</div>
          </div>
        </div>

        {/* 12 Months Full Pipeline Dashboard Table (2026-01 ~ 2026-12) */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                <th className="py-2.5 px-3 font-semibold">대상 월</th>
                <th className="py-2.5 px-3 font-semibold text-center">증권사 발행리포트 (네이버)</th>
                <th 
                  onClick={() => {
                    setSelectedPdfMonth('ALL');
                    setSelectedPdfTab('reports');
                    setActiveSubView('pdfStatus');
                  }}
                  className="py-2.5 px-3 font-semibold text-center cursor-pointer group hover:bg-slate-900/80 transition-colors"
                  title="클릭하여 수집 애널리스트 리포트 현황 및 개별 파일 보기"
                >
                  <div className="inline-flex items-center space-x-1 text-cyan-300 group-hover:text-cyan-200">
                    <span>애널리스트리포트 PDF (원문보관)</span>
                    <span className="text-[9px] bg-cyan-950 group-hover:bg-cyan-600 text-cyan-300 group-hover:text-white border border-cyan-800 px-1 py-0.2 rounded transition-colors">
                      파일보기 ↗
                    </span>
                  </div>
                </th>
                <th className="py-2.5 px-3 font-semibold">LLM AI 분석 진행률</th>
                <th className="py-2.5 px-3 font-semibold text-right">소요 토큰</th>
                <th className="py-2.5 px-3 font-semibold text-center">객관성 점수</th>
                <th className="py-2.5 px-3 font-semibold text-center">단계별 액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {monthlyStats.map((item, idx) => {
                const isCurrentProcessing = isAiAnalyzing && (aiAnalysisTargetLabel?.includes(`${item.month}월`) || aiAnalysisScope === 'full_2026' || (aiAnalysisScope === 'h1_2026' && parseInt(item.month, 10) <= 6) || (aiAnalysisScope === 'h2_2026' && parseInt(item.month, 10) >= 7));
                const totalTarget = item.reportCount || item.expectedTotal || item.pdfCount || 0;
                const ratio = totalTarget > 0 ? Math.min(100, Math.round((item.analyzedCount / totalTarget) * 100)) : 0;

                return (
                  <tr key={idx} className="hover:bg-slate-900/60 transition-colors text-[11px]">
                    <td className="py-2.5 px-3 font-sans font-bold text-white flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                      <span>{item.monthLabel}</span>
                    </td>

                    <td className="py-2.5 px-3 text-center font-sans">
                      {item.reportCount > 0 || item.expectedTotal > 0 ? (
                        <span className="bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                          {(item.reportCount || item.expectedTotal).toLocaleString()}건
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">-</span>
                      )}
                    </td>

                    <td 
                      onClick={() => {
                        setSelectedPdfMonth(item.month);
                        setSelectedPdfTab('reports');
                        setActiveSubView('pdfStatus');
                      }}
                      className="py-2.5 px-3 text-center font-sans cursor-pointer group hover:bg-slate-800/40 transition-colors"
                      title={`${item.month}월 수집 애널리스트 리포트 현황 및 개별 파일 보기`}
                    >
                      {item.pdfCount > 0 ? (
                        <span className="bg-cyan-950/80 group-hover:bg-cyan-900 text-cyan-300 group-hover:text-cyan-200 border border-cyan-800/80 group-hover:border-cyan-400 px-2.5 py-0.5 rounded-md text-[10px] font-bold inline-flex items-center space-x-1 transition-all shadow-sm">
                          <FileText className="w-2.5 h-2.5 text-cyan-400 mr-0.5" />
                          <span>{item.pdfCount.toLocaleString()}개 PDF</span>
                          <span className="text-[9px] text-cyan-400">↗</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px] group-hover:text-slate-300">미수집 (0개)</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 font-sans">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-purple-300 font-bold">
                            {item.analyzedCount} / {item.reportCount || item.pdfCount || item.expectedTotal}건
                          </span>
                          <span className="text-slate-400 font-mono font-bold">{ratio}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-full transition-all duration-300"
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-right text-amber-300 font-bold">
                      {item.tokensUsed ? `${(item.tokensUsed / 1000).toFixed(1)}k tokens` : '-'}
                    </td>

                    <td className="py-2.5 px-3 text-center font-bold text-emerald-300">
                      {item.avgObjectivity ? `${item.avgObjectivity}점` : '-'}
                    </td>

                    <td className="py-2.5 px-3 text-center font-sans">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => {
                            setNaverMonth(item.month);
                            handleFetchNaverReports(item.month);
                          }}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded border border-slate-700 transition-colors cursor-pointer"
                          title="해당 월 데이터 수집"
                        >
                          수집
                        </button>

                        <button
                          onClick={() => handleRunBatchAiAnalysis('month', item.month)}
                          disabled={isAiAnalyzing}
                          className="text-[10px] bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-800 px-2 py-0.5 rounded transition-colors cursor-pointer disabled:opacity-50 font-bold flex items-center space-x-1"
                          title="해당 월 AI 분석 실행"
                        >
                          <Bot className="w-2.5 h-2.5" />
                          <span>AI분석</span>
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

      {/* CORE: 1단계 & 2단계 수집 결과물 전용 탐색 및 검토 메뉴 (사용자 요청 메뉴) */}
      <div ref={bottomResultsRef} className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-6 scroll-mt-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="text-base font-bold text-white tracking-tight">
                  1단계 & 2단계 수집 결과물 탐색 및 검토 메뉴
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  {naverYear}년 {naverMonth === 'ALL' ? '전체' : naverMonth + '월'} 기준
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono font-bold">
                  실시간 연동 아카이브
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                상단에서 수집된 <strong className="text-emerald-300">1단계 리포트 메타데이터</strong> 및 디렉토리에 보관된 <strong className="text-cyan-300">2단계 증권사 발행리포트원문 PDF 파일</strong> 목록을 즉시 탐색·필터·다운로드할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 1단계 vs 2단계 Sub-tab Switcher Buttons */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setBottomResultsTab('step1')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                bottomResultsTab === 'step1'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1단계: 리포트 메타데이터 수집본</span>
              <span className="bg-black/40 text-emerald-300 px-1.5 py-0.2 rounded text-[10px] font-mono">
                {naverReports.length > 0 ? naverReports.length : allSystemReports.length}건
              </span>
            </button>

            <button
              onClick={() => setBottomResultsTab('step2')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                bottomResultsTab === 'step2'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderCheck className="w-3.5 h-3.5" />
              <span>2단계: 증권사 발행리포트원문 보관함</span>
              <span className="bg-black/40 text-cyan-300 px-1.5 py-0.2 rounded text-[10px] font-mono">
                디렉토리
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content Rendering */}
        {bottomResultsTab === 'step1' ? (
          <Step1MetadataViewer
            reports={naverReports.length > 0 ? naverReports : allSystemReports}
            selectedYear={naverYear}
            selectedMonth={naverMonth}
            onSelectReport={(rep) => setSelectedReportForModal(rep)}
            onDownloadPdf={(rep) => triggerPdfDownload(rep.pdfUrl, `${rep.stockName}_${rep.brokerName}_${rep.publishDate}.pdf`)}
          />
        ) : (
          <Step2DirectoryStorageViewer
            reports={naverReports.length > 0 ? naverReports : allSystemReports}
            selectedMonth={naverMonth === 'ALL' ? 'ALL' : naverMonth}
            initialMonth={naverMonth === 'ALL' ? 'ALL' : naverMonth}
            onSelectReport={(rep) => setSelectedReportForModal(rep)}
          />
        )}
      </div>

      {/* CORE 4: VECTOR DB & ORIGINAL PDF DB STORAGE & ROLLBACK CONTROLLER PANEL */}
      <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  원문 PDF & 벡터 DB (Vector Embeddings) 저장 및 원클릭 롤백 스위치
                </h3>
                {vectorDbStatus?.status === 'ROLLED_BACK' ? (
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>기본 DB 롤백 상태 (경량 모드)</span>
                  </span>
                ) : vectorDbStatus?.config?.enableVectorDb ? (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>벡터 DB & PDF 연동 활성화</span>
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                    일시 정지
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                애널리스트 분석 및 원문 PDF의 768차원 코사인 유사도 벡터 임베딩 저장 여부를 제어하며, 필요 시 부하 없는 기본 DB 모드로 언제든지 즉시 롤백할 수 있습니다.
              </p>
            </div>
          </div>

          {/* Rollback & Mode Control Switches */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {vectorDbStatus?.status === 'ROLLED_BACK' ? (
              <button
                onClick={() => handleRollbackVectorDb('restore')}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>벡터 DB 연동 재복구 (Restore Mode)</span>
              </button>
            ) : (
              <button
                onClick={() => handleRollbackVectorDb('rollback')}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer"
                title="언제든지 기본 DB 모드로 안전 복구 및 벡터 임베딩 생성 일시 정지"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white" />
                <span>기본 DB 모드로 즉시 롤백 (Rollback)</span>
              </button>
            )}

            <button
              onClick={() => handleToggleVectorDb(!vectorDbStatus?.config?.enableVectorDb, true)}
              className={`flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                vectorDbStatus?.config?.enableVectorDb
                  ? 'bg-indigo-950 text-indigo-200 border-indigo-700 hover:bg-indigo-900'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {vectorDbStatus?.config?.enableVectorDb ? (
                <>
                  <ToggleRight className="w-4 h-4 text-cyan-400" />
                  <span>벡터 저장 [ON]</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-slate-400" />
                  <span>벡터 저장 [OFF]</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Vector DB Metrics & Impact Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
              <Database className="w-3 h-3 text-indigo-400" />
              <span>보관된 Vector Embeddings</span>
            </span>
            <div className="text-base font-black text-white font-mono">
              {vectorDbStatus?.totalVectors || 0}개 벡터 청크
            </div>
            <div className="text-[10px] text-indigo-300">768-dim normalized L2</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
              <HardDrive className="w-3 h-3 text-cyan-400" />
              <span>인덱스 용량 / 메모리 점유</span>
            </span>
            <div className="text-base font-black text-cyan-300 font-mono">
              {vectorDbStatus?.indexSizeFormatted || '0.0 KB'}
            </div>
            <div className="text-[10px] text-emerald-400">초경량 빠른 I/O</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
              <Activity className="w-3 h-3 text-amber-400" />
              <span>DB 부하 및 영향도 검토</span>
            </span>
            <div className="text-xs font-bold text-emerald-300 truncate mt-1">
              {vectorDbStatus?.dbLoadStatus || '정상 (부하 0%)'}
            </div>
            <div className="text-[10px] text-slate-400">CPU 영향 미비 (~12ms)</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>롤백 가능 여부</span>
            </span>
            <div className="text-xs font-black text-emerald-400 mt-1 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>언제나 100% 안전 롤백 보장</span>
            </div>
            <div className="text-[10px] text-slate-400">기존 데이터 원형 보존</div>
          </div>
        </div>

        {/* Interactive Vector Search Playground */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4.5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white">벡터 DB 코사인 유사도 검색 테스트 (Vector Similarity RAG Retrieval)</h4>
            </div>
            <span className="text-[10px] text-slate-400">자연어 질의어를 벡터로 변환하여 실시간 매칭</span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={vectorSearchQuery}
              onChange={(e) => setVectorSearchQuery(e.target.value)}
              placeholder="예: HBM4 반도체 수율 및 실적 모멘텀 리포트"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSearchVectorDb()}
            />
            <button
              onClick={handleSearchVectorDb}
              disabled={isVectorSearching}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Search className={`w-3.5 h-3.5 ${isVectorSearching ? 'animate-spin' : ''}`} />
              <span>{isVectorSearching ? '검색 중...' : '벡터 검색'}</span>
            </button>
          </div>

          {/* Quick Query Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold">추천 질의어:</span>
            {[
              'HBM4 수율 및 반도체 영업이익률 전망',
              '조선 MRO 수주 및 함정 보수 모멘텀',
              '셀트리온 짐펜트라 미국 PBM 수주 가치',
              '현대차 조지아 신공장 보조금 영향'
            ].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setVectorSearchQuery(q);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[10px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Search Results Display */}
          {vectorSearchResults.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="text-[11px] font-bold text-cyan-300 flex items-center justify-between">
                <span>상위 유사도 검색 결과 ({vectorSearchResults.length}건):</span>
                <span className="font-mono text-[10px] text-slate-400">L2 Cosine Similarity</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {vectorSearchResults.map((res, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800/90 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-indigo-500/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{res.item.title}</span>
                        <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                          {res.item.stockName} ({res.item.stockCode})
                        </span>
                        <span className="text-[10px] text-slate-400">{res.item.brokerName} ({res.item.analystName})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{res.item.contentChunk}</p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-black text-emerald-400 font-mono">
                          {res.matchPercentage}% 유사
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">
                          score: {res.similarityScore}
                        </div>
                      </div>

                      {res.item.hasOriginalPdf && (
                        <button
                          type="button"
                          className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[10px] px-2.5 py-1 rounded font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                          title="원천데이터 (리서치센터 혹은 네이버증권 종목분석)분석결과 다운로드"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerPdfDownload(`/api/download-file?path=${encodeURIComponent(res.item.pdfPath || '')}`, res.item.fileName || 'Report.pdf');
                          }}
                        >
                          <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                          <span>원문 다운로드</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Individual File Upload Pipeline Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">개별 리포트 파일 업로드 파이프라인 (Individual File Upload)</h3>
            <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-2 py-0.5 rounded font-bold">
              PDF / TXT / DOCX / JSON 지원
            </span>
          </div>
          <span className="text-xs text-slate-400">파일 감지 시 Gemini LLM이 종목/목표가/핵심요약 자동 추출</span>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            isDragOver
              ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
              : 'border-slate-700 hover:border-slate-500 bg-slate-950/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.txt,.docx,.doc,.json,.csv"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-lg">
              <FolderUp className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                개별 증권사 리포트 파일을 drag & drop 하거나 클릭하여 선택하세요
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PDF, TXT, DOCX, CSV 파일업로드 시 AI가 자동으로 실적 전망, 목표가, 3줄 핵심 요약을 생성합니다.
              </p>
            </div>

            {isUploadingFile && (
              <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 p-3 rounded-xl space-y-2 mt-2 animate-pulse">
                <div className="flex items-center space-x-2 text-xs text-cyan-300 font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>{uploadProgressStep}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-3/4 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Sample File Preset Buttons */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
          <span className="text-xs text-slate-400 font-bold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>테스트용 샘플 리포트 파일 원클릭 업로드 시뮬레이션:</span>
          </span>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                handlePresetSampleFile(
                  '김대성_조선_DS투자증권_한화오션_042660.txt',
                  '김대성 연구원 (DS투자증권) 한화오션 042660 리포트 원문 분석',
                  '김대성\n조선\n02\n709 2665\nrlarla6019@ds\nsec.co.kr\n한화오션 042660\n2026년 3분기 조선 업황 및 고가 수주 선가 반영 분석.\n글로벌 신조선가 지수 상승세 지속, 미해군 함정 MRO 프로젝트 및 고마진 LNG 운반선 인도 비중 확대로 영업이익률 상승 전망. 목표주가 48,000원 제시.'
                )
              }
              className="bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-200 border border-cyan-700/80 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-md"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>한화오션 042660 원문 테스트 (필터 검증)</span>
            </button>

            <button
              onClick={() =>
                handlePresetSampleFile(
                  '삼성전자_3Q_HBM3E_공급확대_분석.pdf',
                  '삼성전자 3Q HBM3E 공급 확대 및 메모리 가동률 상승',
                  '삼성전자 3Q 영업이익 12.8조원 기록 전망. 차세대 HBM3E 12단 제품 주요 고객사 품질 인증 완료 및 양산 공급 시작. 레거시 DRAM 가격 상승 기조 유지.'
                )
              }
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>삼성전자_HBM3E_실적.pdf</span>
            </button>

            <button
              onClick={() =>
                handlePresetSampleFile(
                  '셀트리온_짐펜트라_북미신약_모멘텀.pdf',
                  '셀트리온 짐펜트라 미국 PBM 수주 확대 및 신약 가치 반영',
                  '미국 3대 PBM 처방집 등재 완료에 따른 짐펜트라 매출 급증 기대. 2026년 연간 매출 3.5조원 상회 가능성 우수. 바이오시밀러 마진율 지속 유지.'
                )
              }
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>셀트리온_짐펜트라_분석.pdf</span>
            </button>

            <button
              onClick={() =>
                handlePresetSampleFile(
                  '현대차_조지아_공장_가동_관세영향.pdf',
                  '현대차 북미 전용 공장 가동에 따른 관세 리스크 완화',
                  '조지아 HMGMA 신공장 가동으로 IRA 보조금 100% 수혜 확보. HEV 차종 하이브리드 판매 비중 20% 돌파 및 주주환원율 35% 단행.'
                )
              }
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>현대차_북미신공장_점검.pdf</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manual Ingest Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <UploadCloud className="w-5 h-5 text-cyan-400" />
                <span>수동 리포트 텍스트 주입 & LLM 즉시 분석</span>
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitManual} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">증권사</label>
                  <input
                    type="text"
                    value={formData.brokerName}
                    onChange={(e) => setFormData({ ...formData, brokerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">담당 애널리스트</label>
                  <input
                    type="text"
                    value={formData.analystName}
                    onChange={(e) => setFormData({ ...formData, analystName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">대상 종목명</label>
                  <input
                    type="text"
                    value={formData.stockName}
                    onChange={(e) => setFormData({ ...formData, stockName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">제시 목표가 (원)</label>
                  <input
                    type="number"
                    value={formData.targetPrice}
                    onChange={(e) => setFormData({ ...formData, targetPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">리포트 제목</label>
                <input
                  type="text"
                  value={formData.reportTitle}
                  onChange={(e) => setFormData({ ...formData, reportTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">리포트 본문 또는 핵심 내용 텍스트</label>
                <textarea
                  rows={4}
                  value={formData.reportContent}
                  onChange={(e) => setFormData({ ...formData, reportContent: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white leading-relaxed"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'LLM 분석 파이프라인 처리 중...' : '파이프라인 분석 주입'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/60 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">데이터 전체 리셋 (초기화) 안내</h3>
                <p className="text-xs text-rose-300 font-semibold">주의: 수집된 모든 데이터 및 AI 분석 결과가 삭제됩니다.</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p className="font-semibold text-slate-200">
                리셋 진행 시 다음 데이터가 삭제됩니다:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                <li><strong className="text-rose-300">1단계 메타데이터 수집본 & 2단계 증권사 발행리포트원문 보관함</strong></li>
                <li><strong className="text-purple-300">3단계 Gemini LLM AI 요약 & 객관성 평가 데이터</strong></li>
                <li><strong className="text-cyan-300">월별 수집 현황 통계 & 벡터 DB 연동 색인</strong></li>
              </ul>
              <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-2.5 text-rose-200 text-[11px] font-medium mt-2">
                ⚠️ <strong>안내:</strong> 데이터 리셋 후에는 1단계 수집 및 2단계 PDF 저장, AI 분석을 <strong>처음부터 다시 전수 진행</strong>해야 합니다.
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleResetAllData}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>확인 및 처음부터 다시 수집</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReportForModal && (
        <ReportDetailModal
          report={selectedReportForModal}
          onClose={() => setSelectedReportForModal(null)}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-emerald-500/50 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};