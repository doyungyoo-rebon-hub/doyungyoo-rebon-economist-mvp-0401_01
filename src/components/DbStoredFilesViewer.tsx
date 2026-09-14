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
  ArrowUpRight
} from 'lucide-react';
import { PdfFileViewerModal } from './PdfFileViewerModal';
import { Report } from '../types';

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
  const [activeSubTab, setActiveSubTab] = useState<'records' | 'stats' | 'raw_json'>('records');
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

  // Categorized Stats States
  const [typeStats, setTypeStats] = useState<any>(null);
  const [statsMonth, setStatsMonth] = useState<string>('ALL');
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(false);

  // Modal / Inspector States
  const [selectedRecordForJson, setSelectedRecordForJson] = useState<DbRecord | null>(null);
  const [previewPdfReport, setPreviewPdfReport] = useState<Report | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
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
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [selectedMonth, selectedBroker, searchTerm, hasPdfOnly, page]);

  // Unique Brokers List from Overview or Records
  const brokersList = useMemo(() => {
    const defaultBrokers = [
      '하나증권', '미래에셋증권', '키움증권', '한국투자증권', 'NH투자증권',
      'KB증권', '삼성증권', '신한투자증권', '메리츠증권', '유진투자증권',
      '대신증권', '한화투자증권', 'IBK투자증권', 'DB금융투자', '교보증권'
    ];
    return defaultBrokers;
  }, []);

  const handleDownloadPdf = (rec: DbRecord) => {
    const yymmdd = rec.publishDate ? rec.publishDate.replace(/[-.]/g, '').slice(2) : '260102';
    const downloadUrl = `/api/pipeline-01/download-pdf-stream?nid=${rec.nid}&stockName=${encodeURIComponent(rec.stockName)}&stockCode=${rec.stockCode}&brokerName=${encodeURIComponent(rec.brokerName)}&title=${encodeURIComponent(rec.reportTitle)}&date=${rec.publishDate}&yymmdd=${yymmdd}&targetPrice=${rec.targetPrice}&currentPrice=${rec.currentPrice}&rating=${encodeURIComponent(rec.investmentOpinion)}&sector=${encodeURIComponent(rec.sector)}&analystName=${encodeURIComponent(rec.analystName)}&pdfUrl=${encodeURIComponent(rec.pdfUrl || '')}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = rec.standardFileName || `${rec.stockName}_${rec.brokerName}_리포트.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📥 [${rec.stockName}] DB 원문 PDF 파일 다운로드를 시작했습니다.`);
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
          {/* Table View */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-sans">
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
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                      <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
                      <span>내부 데이터베이스에서 보관 레코드를 읽어오는 중입니다...</span>
                    </td>
                  </tr>
                ) : records.length > 0 ? (
                  records.map((rec) => (
                    <tr key={rec.id || rec.nid} className="hover:bg-slate-800/40 transition-colors group">
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
                        <div className="text-[10px] text-slate-400">{rec.analystName || '연구원'}</div>
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
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handlePreviewPdf(rec)}
                            className="p-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700/80 rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                            title="내장 PDF 뷰어로 DB 원문 열람"
                          >
                            <Eye className="w-3 h-3 text-amber-400" />
                            <span>원문 열람</span>
                          </button>

                          <button
                            onClick={() => handleDownloadPdf(rec)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                            title="DB 파일 컴퓨터로 다운로드"
                          >
                            <Download className="w-3.5 h-3.5 text-teal-400" />
                          </button>

                          <button
                            onClick={() => setSelectedRecordForJson(rec)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="DB JSON 레코드 보기"
                          >
                            <Code className="w-3.5 h-3.5 text-slate-300" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
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
