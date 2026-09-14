import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  Copy,
  CheckCircle,
  FileText,
  ExternalLink,
  Code,
  Building2,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Eye,
  ChevronDown,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Report } from '../types';
import { getNaverReportUrl } from '../utils/naverHelper';

interface Step1MetadataViewerProps {
  reports?: Report[];
  selectedYear?: string;
  selectedMonth?: string;
  onSelectMonth?: (month: string) => void;
  onSelectReport?: (report: Report) => void;
  onOpenReportDetail?: (report: Report) => void;
  onDownloadPdf?: (report: Report) => void;
  onRefresh?: () => void;
}

export const Step1MetadataViewer: React.FC<Step1MetadataViewerProps> = ({
  reports = [],
  selectedYear = '2026',
  selectedMonth = 'ALL',
  onSelectMonth,
  onSelectReport,
  onOpenReportDetail,
  onDownloadPdf,
  onRefresh
}) => {
  const safeReports = Array.isArray(reports) ? reports : [];
  const handleOpenDetail = onSelectReport || onOpenReportDetail;

  const [activeView, setActiveView] = useState<'table' | 'json' | 'stats'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBroker, setSelectedBroker] = useState('ALL');
  const [selectedOpinion, setSelectedOpinion] = useState('ALL');
  const [targetPriceFilter, setTargetPriceFilter] = useState<'ALL' | 'WITH_PRICE' | 'NO_PRICE'>('ALL');
  const [filterMonth, setFilterMonth] = useState<string>(selectedMonth);
  const [sortField, setSortField] = useState<'publishDate' | 'stockName' | 'targetPrice' | 'brokerName'>('publishDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [copiedJson, setCopiedJson] = useState(false);
  const [jsonExpandedIndex, setJsonExpandedIndex] = useState<number | null>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Sync internal month filter with parent prop if changed
  React.useEffect(() => {
    setFilterMonth(selectedMonth);
  }, [selectedMonth]);

  // Extract unique brokers
  const brokersList = useMemo(() => {
    const set = new Set<string>();
    safeReports.forEach(r => {
      if (r && r.brokerName) set.add(r.brokerName);
    });
    return Array.from(set).sort();
  }, [safeReports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return safeReports.filter(r => {
      if (!r) return false;
      // Month filter
      if (filterMonth !== 'ALL') {
        const monthNum = filterMonth.padStart(2, '0');
        if (!r.publishDate?.includes(`-${monthNum}-`) && !r.publishDate?.startsWith(`2026-${monthNum}`)) {
          return false;
        }
      }

      // Broker filter
      if (selectedBroker !== 'ALL' && r.brokerName !== selectedBroker) {
        return false;
      }

      // Opinion filter
      if (selectedOpinion !== 'ALL') {
        const op = (r.opinion || '').toUpperCase();
        if (selectedOpinion === 'BUY' && !op.includes('BUY') && !op.includes('매수')) return false;
        if (selectedOpinion === 'HOLD' && !op.includes('HOLD') && !op.includes('중립') && !op.includes('보유')) return false;
        if (selectedOpinion === 'SELL' && !op.includes('SELL') && !op.includes('매도')) return false;
        if (selectedOpinion === 'NONE' && (op.includes('BUY') || op.includes('HOLD') || op.includes('SELL') || op.includes('매수'))) return false;
      }

      // Target Price Filter
      if (targetPriceFilter === 'WITH_PRICE' && (!r.targetPrice || r.targetPrice === 0)) return false;
      if (targetPriceFilter === 'NO_PRICE' && r.targetPrice && r.targetPrice > 0) return false;

      // Search keyword
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const sName = (r.stockName || '').toLowerCase();
        const sCode = (r.stockCode || '').toLowerCase();
        const aName = (r.analystName || '').toLowerCase();
        const bName = (r.brokerName || '').toLowerCase();
        const title = (r.title || '').toLowerCase();

        return sName.includes(q) || sCode.includes(q) || aName.includes(q) || bName.includes(q) || title.includes(q);
      }

      return true;
    }).sort((a, b) => {
      let valA: any = a[sortField] || '';
      let valB: any = b[sortField] || '';

      if (sortField === 'targetPrice') {
        valA = a.targetPrice || 0;
        valB = b.targetPrice || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [safeReports, filterMonth, selectedBroker, selectedOpinion, targetPriceFilter, searchTerm, sortField, sortOrder]);

  // Paginated reports
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(start, start + itemsPerPage);
  }, [filteredReports, currentPage, itemsPerPage]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const total = safeReports.length;
    const filteredTotal = filteredReports.length;
    
    // Unique analysts
    const analystSet = new Set<string>();
    safeReports.forEach(r => {
      if (r && r.analystName) analystSet.add(`${r.analystName}_${r.brokerName}`);
    });

    // Target price stats
    const withTargetPrice = safeReports.filter(r => r && r.targetPrice && r.targetPrice > 0);
    const targetPriceRatio = total > 0 ? Math.round((withTargetPrice.length / total) * 100) : 0;
    const avgTargetPrice = withTargetPrice.length > 0 
      ? Math.round(withTargetPrice.reduce((acc, cur) => acc + (cur.targetPrice || 0), 0) / withTargetPrice.length)
      : 0;

    // Buy opinions
    const buyCount = safeReports.filter(r => {
      if (!r) return false;
      const op = (r.opinion || '').toUpperCase();
      return op.includes('BUY') || op.includes('매수');
    }).length;
    const buyRatio = total > 0 ? Math.round((buyCount / total) * 100) : 0;

    return {
      total,
      filteredTotal,
      uniqueBrokers: brokersList.length,
      uniqueAnalysts: analystSet.size,
      targetPriceRatio,
      avgTargetPrice,
      buyRatio,
      buyCount
    };
  }, [safeReports, filteredReports, brokersList]);

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredReports.length === 0) return;

    const headers = [
      '수집ID',
      '발간일자',
      '종목명',
      '종목코드',
      '증권사',
      '담당애널리스트',
      '투자의견',
      '목표주가(원)',
      '현재주가(원)',
      '괴리율(%)',
      '리포트제목',
      '네이버상세URL',
      'PDF저장URL'
    ];

    const rows = filteredReports.map(r => [
      `"${r.id || ''}"`,
      `"${r.publishDate || ''}"`,
      `"${(r.stockName || '').replace(/"/g, '""')}"`,
      `"${r.stockCode || ''}"`,
      `"${(r.brokerName || '').replace(/"/g, '""')}"`,
      `"${(r.analystName || '').replace(/"/g, '""')}"`,
      `"${r.opinion || 'BUY'}"`,
      r.targetPrice || 0,
      r.currentPrice || 0,
      r.disparityRate || 0,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${r.reportUrl || ''}"`,
      `"${r.pdfUrl || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `1단계_리포트메타데이터_수집결과_${filterMonth === 'ALL' ? '2026_전체' : `2026_${filterMonth}월`}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJson = () => {
    if (filteredReports.length === 0) return;
    const jsonStr = JSON.stringify(filteredReports, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `1단계_리포트메타데이터_수집결과_${filterMonth === 'ALL' ? '2026_전체' : `2026_${filterMonth}월`}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    const sample = filteredReports.slice(0, 50);
    navigator.clipboard.writeText(JSON.stringify(sample, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Handle Sort Change
  const handleSort = (field: 'publishDate' | 'stockName' | 'targetPrice' | 'brokerName') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                <span>1단계: 리포트 메타데이터 수집 결과물</span>
              </h3>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold font-mono">
                {reports.length.toLocaleString()}건 수집완료
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              네이버 증권 리서치 및 32개 증권사로부터 실시간 수집·정규화된 종목명, 종목코드, 목표주가, 애널리스트, 발간일자 메타데이터 데이터베이스입니다.
            </p>
          </div>
        </div>

        {/* View Mode & Export Controls */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center space-x-1">
            <button
              onClick={() => setActiveView('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeView === 'table'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>메타데이터 표 ({filteredReports.length})</span>
            </button>

            <button
              onClick={() => setActiveView('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeView === 'json'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>JSON 데이터 원문</span>
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            disabled={filteredReports.length === 0}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            title="현재 필터링된 메타데이터를 CSV로 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV 저장</span>
          </button>

          <button
            onClick={handleExportJson}
            disabled={filteredReports.length === 0}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            title="현재 필터링된 메타데이터를 JSON 파일로 다운로드"
          >
            <Code className="w-3.5 h-3.5 text-teal-400" />
            <span>JSON 저장</span>
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
              title="데이터 새로고침"
            >
              <RefreshCw className="w-4 h-4 text-slate-300" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>총 메타데이터</span>
          </span>
          <div className="text-base font-black text-white font-mono">
            {kpis.total.toLocaleString()}건
          </div>
          <div className="text-[10px] text-emerald-400">네이버 정규화 완료</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <Building2 className="w-3 h-3 text-blue-400" />
            <span>커버리지 증권사</span>
          </span>
          <div className="text-base font-black text-blue-300 font-mono">
            {kpis.uniqueBrokers}개사
          </div>
          <div className="text-[10px] text-slate-400">국내 전 증권사</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <User className="w-3 h-3 text-purple-400" />
            <span>수집 애널리스트</span>
          </span>
          <div className="text-base font-black text-purple-300 font-mono">
            {kpis.uniqueAnalysts.toLocaleString()}명
          </div>
          <div className="text-[10px] text-slate-400">연구원 실명 매핑</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <DollarSign className="w-3 h-3 text-amber-400" />
            <span>목표주가 제시율</span>
          </span>
          <div className="text-base font-black text-amber-300 font-mono">
            {kpis.targetPriceRatio}%
          </div>
          <div className="text-[10px] text-slate-400">평균 {kpis.avgTargetPrice.toLocaleString()}원</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>BUY 매수 의견</span>
          </span>
          <div className="text-base font-black text-emerald-300 font-mono">
            {kpis.buyRatio}%
          </div>
          <div className="text-[10px] text-slate-400">{kpis.buyCount.toLocaleString()}건</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
            <Filter className="w-3 h-3 text-cyan-400" />
            <span>현재 필터 결과</span>
          </span>
          <div className="text-base font-black text-cyan-300 font-mono">
            {kpis.filteredTotal.toLocaleString()}건
          </div>
          <div className="text-[10px] text-cyan-400 font-mono">{totalPages} 페이지</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Month Selector */}
          <div>
            <label className="block text-[10px] text-slate-400 font-bold mb-1">대상 월 (Month)</label>
            <select
              value={filterMonth}
              onChange={(e) => {
                setFilterMonth(e.target.value);
                if (onSelectMonth) onSelectMonth(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="ALL">2026년 전체 (1월~12월)</option>
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, '0');
                return <option key={m} value={m}>2026년 {i + 1}월</option>;
              })}
            </select>
          </div>

          {/* Broker Filter */}
          <div>
            <label className="block text-[10px] text-slate-400 font-bold mb-1">증권사 (Broker)</label>
            <select
              value={selectedBroker}
              onChange={(e) => {
                setSelectedBroker(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="ALL">전체 증권사 ({brokersList.length}개사)</option>
              {brokersList.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Opinion Filter */}
          <div>
            <label className="block text-[10px] text-slate-400 font-bold mb-1">투자의견 (Opinion)</label>
            <select
              value={selectedOpinion}
              onChange={(e) => {
                setSelectedOpinion(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="ALL">전체 의견</option>
              <option value="BUY">매수 (BUY / Strong BUY)</option>
              <option value="HOLD">중립 (HOLD / Marketperform)</option>
              <option value="SELL">매도 (SELL / Underperform)</option>
              <option value="NONE">의견 미제시 (Not Rated)</option>
            </select>
          </div>

          {/* Target Price Status */}
          <div>
            <label className="block text-[10px] text-slate-400 font-bold mb-1">목표가 유무</label>
            <select
              value={targetPriceFilter}
              onChange={(e) => {
                setTargetPriceFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="ALL">전체 리포트</option>
              <option value="WITH_PRICE">목표주가 제시 리포트만</option>
              <option value="NO_PRICE">목표주가 미제시 리포트</option>
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-[10px] text-slate-400 font-bold mb-1">통합 검색</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="종목명, 6자리코드, 애널리스트..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area Based on Active View */}
      {activeView === 'table' ? (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-sans">
                  <th 
                    onClick={() => handleSort('publishDate')}
                    className="py-3 px-3.5 font-bold cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>발간일자</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('stockName')}
                    className="py-3 px-3.5 font-bold cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>종목명 (종목코드)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('brokerName')}
                    className="py-3 px-3.5 font-bold cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>증권사 / 애널리스트</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3.5 font-bold">리포트 제목</th>
                  <th className="py-3 px-3.5 font-bold text-center">투자의견</th>
                  <th 
                    onClick={() => handleSort('targetPrice')}
                    className="py-3 px-3.5 font-bold text-right cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>제시 목표주가</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3.5 font-bold text-center">원문 링크 / 액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {paginatedReports.length > 0 ? (
                  paginatedReports.map((report, idx) => (
                    <tr 
                      key={report.id || idx}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetail && handleOpenDetail(report)}
                    >
                      <td className="py-3 px-3.5 font-mono text-slate-300 font-medium whitespace-nowrap">
                        {report.publishDate || '2026-01-02'}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {report.stockName}
                          </span>
                          {report.stockCode && (
                            <span className="bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                              {report.stockCode}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-indigo-300 font-bold">{report.brokerName}</span>
                          <span className="text-slate-500">|</span>
                          <span className="text-slate-300">{report.analystName || '리서치센터'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 max-w-xs md:max-w-md">
                        <div className="truncate text-slate-200 font-semibold" title={report.naverMatchedTitle || report.naverArticleTitle || report.title}>
                          {report.naverMatchedTitle || report.naverArticleTitle || report.title}
                        </div>
                        {(report.coreThesis || ((report as any).title && (report as any).title !== (report.naverMatchedTitle || report.naverArticleTitle || report.title))) && (
                          <div className="text-[11px] text-cyan-400/90 truncate mt-0.5" title={report.coreThesis || (report as any).title}>
                            🎯 {report.coreThesis || (report as any).title}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          (report.opinion || '').toUpperCase().includes('BUY') || (report.opinion || '').includes('매수')
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : (report.opinion || '').toUpperCase().includes('HOLD') || (report.opinion || '').includes('중립')
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {report.opinion || 'BUY'}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {report.targetPrice && report.targetPrice > 0 ? (
                          <span>{report.targetPrice.toLocaleString()}원</span>
                        ) : (
                          <span className="text-slate-500 text-[11px] font-normal">N/A (미제시)</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center space-x-1.5">
                          {report.pdfUrl && (
                            <button
                              onClick={() => onDownloadPdf ? onDownloadPdf(report) : null}
                              className="p-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                              title="PDF 다운로드"
                            >
                              <Download className="w-3 h-3 text-cyan-400" />
                            </button>
                          )}
                          <a
                            href={getNaverReportUrl(report)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg transition-colors inline-flex items-center"
                            title={`${report.stockName || '종목'}(${report.stockCode || ''}) 네이버 증권 개별 리포트 원문 페이지 열기`}
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                          </a>
                          <button
                            onClick={() => handleOpenDetail && handleOpenDetail(report)}
                            className="p-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                            title="메타데이터 상세 보기"
                          >
                            <Eye className="w-3 h-3 text-emerald-400" />
                            <span>상세</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <Database className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                      <p className="text-sm font-bold text-slate-400">조건에 일치하는 수집 리포트 메타데이터가 없습니다.</p>
                      <p className="text-xs text-slate-500 mt-1">상단의 필터 조건을 변경하거나 1단계 데이터 수집을 실행해보세요.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <div>
                총 <span className="text-white font-bold">{filteredReports.length}</span>건 중 {(currentPage - 1) * itemsPerPage + 1}~{Math.min(filteredReports.length, currentPage * itemsPerPage)}건 표시
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] disabled:opacity-40 cursor-pointer"
                >
                  처음
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] disabled:opacity-40 cursor-pointer"
                >
                  이전
                </button>
                <span className="px-3 py-1 font-mono text-emerald-400 font-bold bg-slate-950 rounded border border-slate-800">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] disabled:opacity-40 cursor-pointer"
                >
                  다음
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] disabled:opacity-40 cursor-pointer"
                >
                  끝
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* JSON Raw Inspector View */
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center space-x-2 text-slate-300 font-bold">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>실시간 수집 메타데이터 JSON 트리 (샘플 50건 미리보기)</span>
            </div>
            <button
              onClick={handleCopyJson}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
            >
              {copiedJson ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>JSON 클립보드 복사</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed shadow-inner">
            <pre className="text-[11px]">
              {JSON.stringify(filteredReports.slice(0, 50), null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
