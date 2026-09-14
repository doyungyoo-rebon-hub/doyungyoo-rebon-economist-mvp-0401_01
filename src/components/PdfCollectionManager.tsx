import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Building2,
  Filter,
  BarChart3,
  Layers,
  Calendar,
  FileCheck2,
  Eye,
  FolderArchive,
  Check,
  User,
  HardDrive,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import {
  OriginalPdfStatus,
  PdfUnobtainedCategory,
  PDF_STATUS_LABELS,
  BrokerPdfStats,
  OverallPdfDashboardStats
} from '../types';
import { PdfFileViewerModal, PdfReportItem } from './PdfFileViewerModal';
import { getNaverReportUrl } from '../utils/naverHelper';
import { triggerPdfDownload } from '../utils/downloadHelper';

interface PdfCollectionManagerProps {
  initialMonth?: string;
  initialTab?: 'reports' | 'kpi' | 'unobtained';
  onRefreshParentReports?: () => void;
}

export const PdfCollectionManager: React.FC<PdfCollectionManagerProps> = ({
  initialMonth = 'ALL',
  initialTab = 'reports',
  onRefreshParentReports,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [loading, setLoading] = useState<boolean>(false);

  // Active Tab: 'reports' (수집 애널리스트 리포트 현황 & 개별 파일 보기) | 'kpi' (증권사별 수집현황) | 'unobtained' (원문 미확보 관리)
  const [activeTab, setActiveTab] = useState<'reports' | 'kpi' | 'unobtained'>(initialTab);

  // Stats Data from API
  const [kpiStats, setKpiStats] = useState<OverallPdfDashboardStats>({
    totalReports: 0,
    pdfSecuredCount: 0,
    pdfUnobtainedCount: 0,
    noOriginalCount: 0,
    undownloadableCount: 0,
    downloadFailedCount: 0,
    overallAcquisitionRate: 0,
  });

  const [brokerStats, setBrokerStats] = useState<BrokerPdfStats[]>([]);
  const [unobtainedList, setUnobtainedList] = useState<any[]>([]);
  const [allReportsList, setAllReportsList] = useState<PdfReportItem[]>([]);

  // Filtering Controls for Report Table
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // 'ALL' | 'OBTAINED' | OriginalPdfStatus
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL'); // 'ALL' | PdfUnobtainedCategory
  const [brokerFilter, setBrokerFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Individual PDF File Viewer Modal State
  const [selectedReportForViewer, setSelectedReportForViewer] = useState<PdfReportItem | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number>(-1);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState<boolean>(false);

  // Fetch status from backend
  const fetchPdfStatusData = async () => {
    setLoading(true);
    try {
      const monthParam = selectedMonth !== 'ALL' ? `&month=${selectedMonth}` : '';
      const res = await fetch(`/api/pdf-management/status?year=${selectedYear}${monthParam}`);
      const data = await res.json();

      if (data.success) {
        setKpiStats(data.kpi);
        setBrokerStats(data.brokerStats || []);
        setUnobtainedList(data.unobtainedReports || []);
        setAllReportsList(data.reports || []);
      }
    } catch (err) {
      console.error('Failed to fetch PDF status data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfStatusData();
  }, [selectedYear, selectedMonth]);

  // Click handler for "PDF 원문 미확보" KPI Card -> direct switch to unobtained view
  const handleUnobtainedKpiClick = () => {
    setActiveTab('unobtained');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
  };

  // Filtered All Collected Reports List
  const filteredAllReports = allReportsList.filter((item) => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'OBTAINED' && item.pdfStatus !== 'OBTAINED') return false;
      if (statusFilter !== 'OBTAINED' && item.pdfStatus !== statusFilter) return false;
    }
    if (categoryFilter !== 'ALL' && item.pdfUnobtainedCategory !== categoryFilter) return false;
    if (brokerFilter !== 'ALL' && item.brokerName !== brokerFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchStock = item.stockName?.toLowerCase().includes(q) || item.stockCode?.includes(q);
      const matchBroker = item.brokerName?.toLowerCase().includes(q);
      const matchAnalyst = item.analystName?.toLowerCase().includes(q);
      const matchTitle = (item.reportTitle || item.title || '')?.toLowerCase().includes(q);
      const matchReason = item.pdfFailReason?.toLowerCase().includes(q);
      return matchStock || matchBroker || matchAnalyst || matchTitle || matchReason;
    }
    return true;
  });

  // Filtered Unobtained List
  const filteredUnobtainedReports = unobtainedList.filter((item) => {
    if (statusFilter !== 'ALL' && item.pdfStatus !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && item.pdfUnobtainedCategory !== categoryFilter) return false;
    if (brokerFilter !== 'ALL' && item.brokerName !== brokerFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchStock = item.stockName?.toLowerCase().includes(q) || item.stockCode?.includes(q);
      const matchBroker = item.brokerName?.toLowerCase().includes(q);
      const matchAnalyst = item.analystName?.toLowerCase().includes(q);
      const matchTitle = (item.reportTitle || item.title || '')?.toLowerCase().includes(q);
      const matchReason = item.pdfFailReason?.toLowerCase().includes(q);
      return matchStock || matchBroker || matchAnalyst || matchTitle || matchReason;
    }
    return true;
  });

  const openFileViewer = (report: PdfReportItem, index: number, list: PdfReportItem[]) => {
    setSelectedReportForViewer(report);
    setViewerIndex(index);
    setIsViewerModalOpen(true);
  };

  const handleNavigateViewer = (newIndex: number) => {
    const list = activeTab === 'unobtained' ? filteredUnobtainedReports : filteredAllReports;
    if (newIndex >= 0 && newIndex < list.length) {
      setViewerIndex(newIndex);
      setSelectedReportForViewer(list[newIndex]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <FileCheck2 className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                애널리스트리포트 PDF (원문보관) 현황 & 개별 파일 보기
              </h2>
              <span className="text-[11px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2.5 py-0.5 rounded-full">
                32개 증권사 원문 아카이빙
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              수집된 종목분석 애널리스트 리포트 원문 PDF의 보관 현황을 확인하고, 개별 파일 열람·다운로드 및 무결성 검증 데이터를 실시간으로 조회합니다.
            </p>
          </div>

          {/* Year/Month Selector & Refresh button */}
          <div className="flex items-center space-x-2.5 shrink-0 flex-wrap gap-y-2">
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="2026">2026년</option>
              </select>
              <span className="text-slate-600">/</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL">전체 월 (1~12월)</option>
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchPdfStatusData}
              disabled={loading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>현황 새로고침</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards (All Clickable to filter views) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: 전체 리포트 */}
        <div
          onClick={() => { setActiveTab('reports'); setStatusFilter('ALL'); }}
          className={`bg-slate-900/90 border rounded-xl p-4 transition-all cursor-pointer shadow-sm group ${
            activeTab === 'reports' && statusFilter === 'ALL'
              ? 'border-cyan-500/80 ring-2 ring-cyan-500/20 bg-cyan-950/20'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">전체 수집 리포트</span>
            <FileText className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {kpiStats.totalReports.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 ml-1">건</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">수집 대상 총 리포트</p>
        </div>

        {/* KPI 2: 증권사 발행리포트원문 확보 */}
        <div 
          onClick={() => { setActiveTab('reports'); setStatusFilter('OBTAINED'); }}
          className={`bg-emerald-950/20 border rounded-xl p-4 transition-all cursor-pointer shadow-sm group ${
            activeTab === 'reports' && statusFilter === 'OBTAINED'
              ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/40'
              : 'border-emerald-900/50 hover:border-emerald-700/60'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400 mb-1.5">
            <span className="text-xs font-semibold">원문 PDF 확보 완료</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-300 font-mono">
            {kpiStats.pdfSecuredCount.toLocaleString()}
            <span className="text-xs font-normal text-emerald-500 ml-1">건</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px]">
            <span className="text-emerald-500/90 font-medium">바이너리 검증 완료</span>
            <span className="font-bold text-emerald-400">{kpiStats.overallAcquisitionRate}%</span>
          </div>
        </div>

        {/* KPI 3: 원문 미확보 */}
        <div
          onClick={handleUnobtainedKpiClick}
          className={`bg-amber-950/30 border-2 rounded-xl p-4 transition-all cursor-pointer shadow-md group relative overflow-hidden ${
            activeTab === 'unobtained'
              ? 'border-amber-400 ring-2 ring-amber-500/30 bg-amber-950/50'
              : 'border-amber-500/60 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between text-amber-300 mb-1.5">
            <span className="text-xs font-bold text-amber-200">원문 미확보 리포트</span>
            <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">
            {kpiStats.pdfUnobtainedCount.toLocaleString()}
            <span className="text-xs font-normal text-amber-500 ml-1">건</span>
          </div>
          <div className="mt-1 text-[10px] text-amber-400 font-bold flex items-center justify-between">
            <span>👇 클릭시 미확보 목록</span>
            <span className="bg-amber-900/80 text-amber-200 px-1.5 py-0.2 rounded text-[9px]">관리</span>
          </div>
        </div>

        {/* KPI 4: 원문 부재 */}
        <div
          onClick={() => { setActiveTab('unobtained'); setStatusFilter('MISSING_ORIGINAL'); }}
          className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">원문 부재</span>
            <HelpCircle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-slate-300 font-mono">
            {kpiStats.noOriginalCount.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 ml-1">건</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">링크 미제공 / 부재</p>
        </div>

        {/* KPI 5: 다운로드 불가 */}
        <div
          onClick={() => { setActiveTab('unobtained'); setStatusFilter('UNDOWNLOADABLE'); }}
          className="bg-orange-950/20 border border-orange-900/40 hover:border-orange-700/60 rounded-xl p-4 transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-orange-400 mb-1.5">
            <span className="text-xs font-medium">다운로드 불가</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-orange-300 font-mono">
            {kpiStats.undownloadableCount.toLocaleString()}
            <span className="text-xs font-normal text-orange-500 ml-1">건</span>
          </div>
          <p className="text-[10px] text-orange-400/80 mt-1">로그인/접근제한</p>
        </div>

        {/* KPI 6: 다운로드 실패 */}
        <div
          onClick={() => { setActiveTab('unobtained'); setStatusFilter('DOWNLOAD_FAILED'); }}
          className="bg-rose-950/20 border border-rose-900/40 hover:border-rose-700/60 rounded-xl p-4 transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-rose-400 mb-1.5">
            <span className="text-xs font-medium">다운로드 실패</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-300 font-mono">
            {kpiStats.downloadFailedCount.toLocaleString()}
            <span className="text-xs font-normal text-rose-500 ml-1">건</span>
          </div>
          <p className="text-[10px] text-rose-400/80 mt-1">타임아웃/네트워크오류</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 flex-wrap gap-y-2">
        <button
          onClick={() => { setActiveTab('reports'); setStatusFilter('ALL'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FolderArchive className="w-4 h-4 text-cyan-300" />
          <span>📄 수집 애널리스트 리포트 현황 & 개별 파일 보기</span>
          <span className="bg-cyan-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-1">
            {kpiStats.totalReports}건
          </span>
        </button>

        <button
          onClick={() => setActiveTab('kpi')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'kpi'
              ? 'bg-slate-700 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-slate-300" />
          <span>📊 증권사별 수집현황 대시보드</span>
        </button>

        <button
          onClick={() => setActiveTab('unobtained')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer relative ${
            activeTab === 'unobtained'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-900 text-amber-300 hover:text-amber-200 border border-amber-900/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-300" />
          <span>🛡️ 원문 미확보 리포트 관리 목록</span>
          {kpiStats.pdfUnobtainedCount > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ml-1">
              {kpiStats.pdfUnobtainedCount}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ALL COLLECTED ANALYST REPORTS & INDIVIDUAL FILE VIEWER */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          {/* Storage Directory Info Bar */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                원문 저장 경로: <strong className="text-cyan-300 font-mono">downloads/naver_pdfs/{selectedYear}{selectedMonth === 'ALL' ? '...' : selectedMonth}/</strong>
              </span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
              <span>원문 확보: <strong className="text-emerald-400 font-mono">{kpiStats.pdfSecuredCount}개</strong></span>
              <span className="text-slate-600">•</span>
              <span>확보율: <strong className="text-cyan-300 font-mono">{kpiStats.overallAcquisitionRate}%</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500">네이밍 룰: [종목명]_[증권사]_[종목코드]_[발간일].pdf</span>
            </div>
          </div>

          {/* Controls Bar: Filter & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
              <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs font-bold text-white">필터:</span>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="ALL">전체 보관 상태 (전체 {allReportsList.length}건)</option>
                <option value="OBTAINED">✅ 원문 PDF 확보 완료 ({kpiStats.pdfSecuredCount}건)</option>
                <option value="MISSING_ORIGINAL">⚠️ 원문 PDF 부재 ({kpiStats.noOriginalCount}건)</option>
                <option value="UNDOWNLOADABLE">🔒 PDF 다운로드 불가 ({kpiStats.undownloadableCount}건)</option>
                <option value="DOWNLOAD_FAILED">🚨 PDF 다운로드 실패 ({kpiStats.downloadFailedCount}건)</option>
              </select>

              {/* Broker Filter */}
              <select
                value={brokerFilter}
                onChange={(e) => setBrokerFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-cyan-300 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="ALL">전체 32개 증권사</option>
                {brokerStats.map((b) => (
                  <option key={b.brokerName} value={b.brokerName}>
                    {b.brokerName} ({b.totalReports}건)
                  </option>
                ))}
              </select>
            </div>

            {/* Search Box */}
            <div className="relative w-full lg:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="종목명, 종목코드, 애널리스트, 제목 검색..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Reports Table with Direct [개별 파일 보기] Action */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">발간일자</th>
                  <th className="py-3 px-3">증권사 & 애널리스트</th>
                  <th className="py-3 px-3">종목명 (코드)</th>
                  <th className="py-3 px-4">리포트 제목 & 투자의견</th>
                  <th className="py-3 px-3 text-center">원문 PDF 상태</th>
                  <th className="py-3 px-3">표준 보관 파일명</th>
                  <th className="py-3 px-4 text-center">개별 파일 작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredAllReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2 text-cyan-400">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>애널리스트 리포트 수집 현황을 조회중입니다...</span>
                        </div>
                      ) : (
                        <span>선택한 조건에 해당하는 수집 애널리스트 리포트가 없습니다.</span>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredAllReports.map((item, idx) => {
                    const isSecured = item.pdfStatus === 'OBTAINED' || !item.pdfStatus;
                    const stockName = item.stockName || '종목';
                    const brokerName = item.brokerName || '증권사';
                    const stockCode = item.stockCode || '000000';
                    const publishDate = item.publishDate || '2026-01-15';
                    const standardFileName = item.fileName || `${stockName}_${brokerName}_${stockCode}_${publishDate.replace(/[\.\/]/g, '-')}.pdf`;

                    return (
                      <tr 
                        key={idx} 
                        className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                        onClick={() => openFileViewer(item, idx, filteredAllReports)}
                      >
                        {/* 1. Date */}
                        <td className="py-3 px-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                          {publishDate}
                        </td>

                        {/* 2. Broker & Analyst */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-xs">{brokerName}</span>
                            <span className="text-[11px] text-slate-400 flex items-center mt-0.5">
                              <User className="w-3 h-3 mr-0.5 text-slate-500" />
                              {item.analystName || '연구원'}
                            </span>
                          </div>
                        </td>

                        {/* 3. Stock */}
                        <td className="py-3 px-3 font-mono">
                          <div className="flex flex-col">
                            <span className="font-bold text-cyan-300 text-xs">{stockName}</span>
                            <span className="text-[10px] text-slate-500">{stockCode}</span>
                          </div>
                        </td>

                        {/* 4. Title & Rating */}
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-semibold text-slate-200 truncate group-hover:text-white" title={item.naverMatchedTitle || item.naverArticleTitle || item.reportTitle || item.title}>
                            {item.naverMatchedTitle || item.naverArticleTitle || item.reportTitle || item.title || `${stockName} 종목분석`}
                          </div>
                          {(item.coreThesis || ((item as any).title && (item as any).title !== (item.naverMatchedTitle || item.naverArticleTitle || item.reportTitle || item.title))) && (
                            <div className="text-[10px] text-cyan-400/90 truncate mt-0.5" title={item.coreThesis || (item as any).title}>
                              🎯 {item.coreThesis || (item as any).title}
                            </div>
                          )}
                          <div className="flex items-center space-x-1.5 mt-0.5 text-[10px]">
                            {item.targetPrice && item.targetPrice > 0 && (
                              <span className="text-cyan-400 font-mono font-bold">
                                목표: {item.targetPrice.toLocaleString()}원
                              </span>
                            )}
                            {item.rating && (
                              <span className="text-slate-400">
                                · {item.rating}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 5. PDF Status */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {isSecured ? (
                            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center">
                              <Check className="w-3 h-3 text-emerald-400 mr-1" />
                              원문확보 완료
                            </span>
                          ) : (
                            <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center">
                              <AlertTriangle className="w-3 h-3 text-amber-400 mr-1" />
                              {item.pdfFailReason || '미확보'}
                            </span>
                          )}
                        </td>

                        {/* 6. File Name */}
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-400 max-w-[200px] truncate" title={standardFileName}>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{standardFileName}</span>
                          </div>
                        </td>

                        {/* 7. Action Buttons */}
                        <td className="py-3 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* [개별 파일 보기] Button */}
                            <button
                              onClick={() => openFileViewer(item, idx, filteredAllReports)}
                              className="px-2.5 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-[11px] rounded-lg transition-all flex items-center space-x-1 shadow-sm cursor-pointer hover:scale-105"
                              title="개별 PDF 파일 뷰어 및 리포트 본문 보기"
                            >
                              <Eye className="w-3 h-3" />
                              <span>개별 파일 보기</span>
                            </button>

                            {/* Download Button */}
                            <button
                              onClick={() => triggerPdfDownload({
                                url: item.pdfUrl || '',
                                stockName,
                                brokerName,
                                stockCode,
                                publishDate,
                                title: item.reportTitle || item.title || '',
                                analystName: item.analystName || '',
                                summary: item.summary || '',
                              })}
                              className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="PDF 파일 다운로드"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            {/* External Link Button */}
                            <a
                              href={getNaverReportUrl(item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                              title={`${item.stockName || '종목'}(${item.stockCode || ''}) 네이버 증권 개별 리포트 원문 링크`}
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BROKER STATISTICS DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'kpi' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">증권사별 증권사 발행리포트원문 수집 및 확보율 현황</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">총 {brokerStats.length}개 증권사 수집중</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">증권사명</th>
                  <th className="py-3 px-3 text-right">전체 리포트</th>
                  <th className="py-3 px-3 text-right text-emerald-400">PDF 확보</th>
                  <th className="py-3 px-3 text-right text-amber-400">원문 미확보</th>
                  <th className="py-3 px-3 text-right text-slate-400">원문 부재</th>
                  <th className="py-3 px-3 text-right text-orange-400">다운로드 불가</th>
                  <th className="py-3 px-3 text-right text-rose-400">다운로드 실패</th>
                  <th className="py-3 px-4 text-center">원문 확보율</th>
                  <th className="py-3 px-4">수집 방식 및 세션 연동</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {brokerStats.map((broker) => (
                  <tr key={broker.brokerName} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>{broker.brokerName}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold">{broker.totalReports.toLocaleString()}건</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold">{broker.pdfSecuredCount.toLocaleString()}건</td>
                    <td className="py-3 px-3 text-right text-amber-300 font-bold">{broker.pdfUnobtainedCount.toLocaleString()}건</td>
                    <td className="py-3 px-3 text-right text-slate-400">{broker.noOriginalCount}건</td>
                    <td className="py-3 px-3 text-right text-orange-300">{broker.undownloadableCount}건</td>
                    <td className="py-3 px-3 text-right text-rose-300">{broker.downloadFailedCount}건</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              broker.acquisitionRate >= 90
                                ? 'bg-emerald-500'
                                : broker.acquisitionRate >= 70
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${broker.acquisitionRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white shrink-0 min-w-[36px] text-right">
                          {broker.acquisitionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans text-[11px] text-slate-400">
                      <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-cyan-300">
                        {broker.accessMethod}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: UNOBTAINED REPORTS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'unobtained' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          {/* Top Cause Classification Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 mb-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white">증권사 발행리포트원문 미확보 3가지 주요 원인 분류 규정</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold text-slate-300 block mb-0.5">1. 원문 자체가 없는 경우</span>
                <p className="text-[11px] text-slate-400">네이버 또는 증권사 게시글에 PDF 자체가 첨부되어 있지 않은 경우</p>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-amber-900/50">
                <span className="font-bold text-amber-300 block mb-0.5">2. 원문은 있지만 다운로드 불가</span>
                <p className="text-[11px] text-slate-400">회원 로그인 필요, DRM 적용, HTTP 403 방화벽 차단 등</p>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-rose-900/50">
                <span className="font-bold text-rose-300 block mb-0.5">3. 일시적 다운로드 실패</span>
                <p className="text-[11px] text-slate-400">네트워크 타임아웃, URL 오류 등 향후 재시도시 수집 가능</p>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
              <Filter className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-bold text-white">필터:</span>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="ALL">전체 PDF 세부 상태 (7가지)</option>
                <option value="MISSING_ORIGINAL">원문 PDF 부재</option>
                <option value="UNDOWNLOADABLE">PDF 다운로드 불가</option>
                <option value="ACCESS_RESTRICTED">접근 제한 (HTTP 403)</option>
                <option value="DOWNLOAD_FAILED">PDF 다운로드 실패</option>
                <option value="INVALID_URL">URL 오류 (404)</option>
                <option value="CORRUPTED_PDF">PDF 파일 오류</option>
              </select>

              {/* Broker Filter */}
              <select
                value={brokerFilter}
                onChange={(e) => setBrokerFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="ALL">전체 증권사</option>
                {brokerStats.map((b) => (
                  <option key={b.brokerName} value={b.brokerName}>{b.brokerName}</option>
                ))}
              </select>
            </div>

            {/* Search Box */}
            <div className="relative w-full lg:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="종목명, 제목, 사유 검색..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Unobtained List Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">증권사</th>
                  <th className="py-3 px-3">종목명 (코드)</th>
                  <th className="py-3 px-4">리포트 제목</th>
                  <th className="py-3 px-3">작성일</th>
                  <th className="py-3 px-3">PDF 상태</th>
                  <th className="py-3 px-4">실패 및 미확보 사유</th>
                  <th className="py-3 px-3 text-center">개별 파일 보기 / 원문</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredUnobtainedReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      조건에 해당하는 원문 미확보 리포트가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredUnobtainedReports.map((item, idx) => {
                    const statusMeta = PDF_STATUS_LABELS[item.pdfStatus as OriginalPdfStatus] || {
                      label: item.pdfStatus,
                      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
                    };

                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-white shrink-0">
                          {item.brokerName}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span className="font-bold text-amber-300">{item.stockName}</span>
                          <span className="text-[10px] text-slate-500 ml-1">({item.stockCode})</span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-200 max-w-xs truncate" title={item.reportTitle || item.title}>
                          {item.reportTitle || item.title}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                          {item.publishDate}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusMeta.badgeColor}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-300 max-w-sm">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-rose-400">🚨</span>
                            <span className="text-slate-300 text-[11px] leading-snug">{item.pdfFailReason}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => openFileViewer(item, idx, filteredUnobtainedReports)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold rounded flex items-center space-x-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>개별 보기</span>
                            </button>
                            <a
                              href={getNaverReportUrl(item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-[11px] text-emerald-300 hover:text-white bg-slate-950 border border-emerald-800/80 px-2 py-1 rounded"
                              title={`${item.stockName || '종목'}(${item.stockCode || ''}) 네이버 증권 개별 리포트 원문 링크`}
                            >
                              <span>개별원문</span>
                              <ExternalLink className="w-3 h-3 text-emerald-400" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INDIVIDUAL PDF FILE VIEWER MODAL */}
      <PdfFileViewerModal
        report={selectedReportForViewer}
        reportsList={activeTab === 'unobtained' ? filteredUnobtainedReports : filteredAllReports}
        currentIndex={viewerIndex}
        isOpen={isViewerModalOpen}
        onClose={() => setIsViewerModalOpen(false)}
        onNavigate={handleNavigateViewer}
      />
    </div>
  );
};
