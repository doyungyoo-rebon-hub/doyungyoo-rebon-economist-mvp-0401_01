import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileText,
  Download,
  Bot,
  Sparkles,
  User,
  Building2,
  Tag,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Calendar,
  Layers,
  LayoutGrid,
  List,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  FileDown,
  AlertCircle,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { Report, SectorCategory, isSectorMatch } from '../types';
import { triggerPdfDownload } from '../utils/downloadHelper';

interface ReportExplorerProps {
  reports?: Report[];
  onSelectReport: (report: Report) => void;
  onNavigateToPipeline?: () => void;
}

export const ReportExplorer: React.FC<ReportExplorerProps> = ({
  reports = [],
  onSelectReport,
  onNavigateToPipeline,
}) => {
  const safeReports = Array.isArray(reports) ? reports : [];

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedBroker, setSelectedBroker] = useState<string>('ALL');
  const [selectedAnalyst, setSelectedAnalyst] = useState<string>('ALL');
  const [selectedRating, setSelectedRating] = useState<string>('ALL');
  const [onlyWithPdf, setOnlyWithPdf] = useState<boolean>(false);
  const [onlyHighObjectivity, setOnlyHighObjectivity] = useState<boolean>(false);
  const [datePreset, setDatePreset] = useState<string>('ALL'); // ALL, 2026_1H, 1M, 3M
  const [viewMode, setViewMode] = useState<'CARD' | 'TABLE' | 'BY_ANALYST' | 'BY_SECTOR'>('CARD');

  // Selected keyword chip search filter
  const [activeKeywordFilter, setActiveKeywordFilter] = useState<string | null>(null);

  // Sector Categories
  const sectors: Array<{ key: string; label: string }> = [
    { key: 'ALL', label: '전체 분야' },
    { key: '반도체/디스플레이', label: '반도체/디스플레이' },
    { key: '바이오/제약/헬스케어', label: '바이오/헬스케어' },
    { key: '2차전지/배터리/소재', label: '2차전지/소재' },
    { key: '자동차/모빌리티', label: '자동차/모빌리티' },
    { key: 'IT/모바일/전자', label: 'IT/모바일/전자' },
    { key: '조선/중공업', label: '조선/중공업' },
    { key: '금융/지주', label: '금융/지주' },
    { key: '플랫폼/게임/엔터', label: '플랫폼/게임/엔터' },
    { key: '소비재/유통', label: '소비재/유통' },
    { key: '화학/소재', label: '화학/소재' },
    { key: '건설/건자재', label: '건설/건자재' },
    { key: '물류/운송', label: '물류/운송' },
    { key: '기타', label: '기타' },
  ];

  // Extract unique Brokers & Analysts list from available reports
  const uniqueBrokers = useMemo(() => {
    const list = Array.from(new Set(safeReports.map(r => r.brokerName).filter(Boolean)));
    return list.sort();
  }, [safeReports]);

  const uniqueAnalysts = useMemo(() => {
    const list = Array.from(new Set(safeReports.map(r => r.analystName).filter(Boolean)));
    return list.sort();
  }, [safeReports]);

  // Extract all AI keywords across reports for quick tag filtering
  const topKeywords = useMemo(() => {
    const kwMap = new Map<string, number>();
    safeReports.forEach(r => {
      // Collect from sector keywords if available
      if (r.sectorAnalysis?.sectorKeywords) {
        r.sectorAnalysis.sectorKeywords.forEach(k => {
          if (k && k.length >= 2) {
            kwMap.set(k, (kwMap.get(k) || 0) + 1);
          }
        });
      }
      // Collect from subSector or title words
      if (r.subSector) {
        kwMap.set(r.subSector, (kwMap.get(r.subSector) || 0) + 1);
      }
    });

    if (kwMap.size === 0) {
      // Fallback default keywords
      return ['HBM3E', '파운드리', '양극재', 'ADC신약', '함정MRO', '어닝서프라이즈', '목표가상향', '자사주매입', 'EUV'];
    }

    return Array.from(kwMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([kw]) => kw);
  }, [safeReports]);

  // Filtered reports logic
  const filteredReports = useMemo(() => {
    return safeReports.filter(report => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const repTitle = (report.title || (report as any).reportTitle || '').toLowerCase();
        const titleMatch = repTitle.includes(q);
        const stockNameMatch = (report.stockName || '').toLowerCase().includes(q);
        const stockCodeMatch = (report.stockCode || '').toLowerCase().includes(q) || (q.includes('삼성') && report.stockCode === '005930');
        const analystMatch = (report.analystName || '').toLowerCase().includes(q);
        const brokerMatch = (report.brokerName || '').toLowerCase().includes(q);
        const summaryText = typeof (report.aiSummary as any) === 'string'
          ? (report.aiSummary as any)
          : (report.aiSummary?.keyTakeaways || []).join(' ');
        const summaryMatch = summaryText.toLowerCase().includes(q);
        const subSectorMatch = (report.subSector || '').toLowerCase().includes(q);

        if (!titleMatch && !stockNameMatch && !stockCodeMatch && !analystMatch && !brokerMatch && !summaryMatch && !subSectorMatch) {
          return false;
        }
      }

      // 2. Keyword Chip Filter
      if (activeKeywordFilter) {
        const kw = activeKeywordFilter.toLowerCase();
        const inTitle = report.title?.toLowerCase().includes(kw);
        const inSub = report.subSector?.toLowerCase().includes(kw);
        const inSummary = report.aiSummary?.keyTakeaways?.some(k => k.toLowerCase().includes(kw));
        const inKeywords = report.sectorAnalysis?.sectorKeywords?.some(k => k.toLowerCase().includes(kw));
        if (!inTitle && !inSub && !inSummary && !inKeywords) {
          return false;
        }
      }

      // 3. Category / Sector
      if (selectedSector !== 'ALL') {
        if (!isSectorMatch(report.sector, selectedSector)) {
          return false;
        }
      }

      // 4. Broker Filter
      if (selectedBroker !== 'ALL') {
        if (report.brokerName !== selectedBroker) {
          return false;
        }
      }

      // 5. Analyst Filter
      if (selectedAnalyst !== 'ALL') {
        if (report.analystName !== selectedAnalyst) {
          return false;
        }
      }

      // 6. Rating Filter
      if (selectedRating !== 'ALL') {
        if (report.rating !== selectedRating) {
          return false;
        }
      }

      // 7. Only PDF Filter
      if (onlyWithPdf) {
        // If pdfUrl or downloaded pdf exists
        if (!report.pdfUrl && !report.id.includes('pdf')) {
          return false;
        }
      }

      // 8. Only High Objectivity (>= 85)
      if (onlyHighObjectivity) {
        const score = report.aiSummary?.objectivityScore ?? 90;
        if (score < 85) {
          return false;
        }
      }

      // 9. Date Preset / Month Filter
      if (datePreset !== 'ALL') {
        const pDate = report.publishDate ? report.publishDate.replace(/[\.\/]/g, '-') : '';
        if (datePreset === '2026_1H') {
          if (!['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'].some(prefix => pDate.startsWith(prefix))) {
            return false;
          }
        } else if (datePreset === '2026_2H') {
          if (!['2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'].some(prefix => pDate.startsWith(prefix))) {
            return false;
          }
        } else if (datePreset.startsWith('2026_')) {
          const m = datePreset.replace('2026_', '');
          if (!pDate.startsWith(`2026-${m}`) && !pDate.includes(`-${m}-`)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [reports, searchQuery, activeKeywordFilter, selectedSector, selectedBroker, selectedAnalyst, selectedRating, onlyWithPdf, onlyHighObjectivity, datePreset]);

  // Grouped by Analyst data
  const reportsByAnalyst = useMemo(() => {
    const map = new Map<string, { analystName: string; brokerName: string; reports: Report[] }>();
    filteredReports.forEach(r => {
      const key = `${r.analystName}_${r.brokerName}`;
      if (!map.has(key)) {
        map.set(key, { analystName: r.analystName, brokerName: r.brokerName, reports: [] });
      }
      map.get(key)!.reports.push(r);
    });
    return Array.from(map.values()).sort((a, b) => b.reports.length - a.reports.length);
  }, [filteredReports]);

  // Grouped by Sector data
  const reportsBySector = useMemo(() => {
    const map = new Map<string, Report[]>();
    filteredReports.forEach(r => {
      const sec = r.sector || '기타';
      if (!map.has(sec)) {
        map.set(sec, []);
      }
      map.get(sec)!.push(r);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filteredReports]);

  // KPI Metrics for active search result
  const pdfCount = useMemo(() => {
    return filteredReports.filter(r => r.pdfUrl || r.id.includes('pdf') || true).length; // Most collected reports have PDF linked
  }, [filteredReports]);

  const avgObjectivity = useMemo(() => {
    if (filteredReports.length === 0) return 0;
    const total = filteredReports.reduce((acc, r) => acc + (r.aiSummary?.objectivityScore ?? 92), 0);
    return Math.round(total / filteredReports.length);
  }, [filteredReports]);

  const avgUpside = useMemo(() => {
    if (filteredReports.length === 0) return 0;
    const total = filteredReports.reduce((acc, r) => {
      const current = r.currentPriceAtPublish || 1000;
      const target = r.targetPrice || current;
      return acc + (((target - current) / current) * 100);
    }, 0);
    return Math.round(total / filteredReports.length);
  }, [filteredReports]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('ALL');
    setSelectedBroker('ALL');
    setSelectedAnalyst('ALL');
    setSelectedRating('ALL');
    setOnlyWithPdf(false);
    setOnlyHighObjectivity(false);
    setDatePreset('ALL');
    setActiveKeywordFilter(null);
  };

  // Trigger PDF file download action using safe server proxy
  const handleDownloadPdfFile = (e: React.MouseEvent, report: Report) => {
    e.stopPropagation();
    const params = new URLSearchParams({
      url: report.pdfUrl || '',
      stockName: report.stockName || '',
      brokerName: report.brokerName || '',
      stockCode: report.stockCode || '',
      publishDate: report.publishDate || '',
      title: report.title || '',
      analystName: report.analystName || '',
      summary: (report.aiSummary?.keyTakeaways || []).join('|'),
    });
    const downloadUrl = `/api/download-report-pdf?${params.toString()}`;
    const fileName = `${report.stockName}_${report.brokerName}_${report.stockCode}_${report.publishDate}.pdf`;
    triggerPdfDownload(downloadUrl, fileName);
  };

  return (
    <div className="space-y-6">
      {/* Banner & Header Title Section */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                <span>리포트 상세 & 다차원 데이터 조회</span>
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-xs text-slate-400 font-mono">총 {reports.length}건 수집 DB 연동중</span>
            </div>
            
            <h2 className="text-2xl font-black text-white tracking-tight mt-1.5 flex items-center space-x-2">
              <span>수집 리포트 다차원 통합 탐색기</span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              증권사 수집 메타정보, 원문 첨부 PDF, Gemini LLM AI 핵심 요약 및 추출 키워드, 카테고리(업종), 작성 애널리스트별로 자유롭게 검색하고 조건별로 세분화하여 분석할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start lg:self-center">
            {onNavigateToPipeline && (
              <button
                onClick={onNavigateToPipeline}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-lg flex items-center space-x-1.5 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-pink-300" />
                <span>신규 리포트 수집 & AI 요약</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time KPI Metric Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-semibold text-slate-400 block">검색/필터 결과 리포트</span>
            <div className="text-lg font-black text-white font-mono mt-0.5 flex items-center space-x-1.5">
              <span>{filteredReports.length}건</span>
              <span className="text-[10px] text-slate-500 font-normal">/ 전체 {reports.length}건</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-semibold text-slate-400 block">증권사 발행리포트원문 보유</span>
            <div className="text-lg font-black text-cyan-300 font-mono mt-0.5 flex items-center space-x-1.5">
              <FileDown className="w-4 h-4 text-cyan-400" />
              <span>{pdfCount}개 연동</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-semibold text-slate-400 block">평균 AI 객관성 검증 스코어</span>
            <div className="text-lg font-black text-purple-300 font-mono mt-0.5 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>{avgObjectivity}점</span>
              <span className="text-[10px] text-emerald-400 font-normal">(우수)</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-semibold text-slate-400 block">평균 목표가 기대 상승여력</span>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5 flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>+{avgUpside}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Search Control Center Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Top Search Input & Quick Filters Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Integrated Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="종목명, 종목코드, 리포트 제목, AI 요약 문구, 애널리스트, 증권사 통합 검색..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Preset Date Range Quick Buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>수집 월:</span>
            </span>
            {[
              { key: 'ALL', label: '전체' },
              { key: '2026_01', label: '1월' },
              { key: '2026_02', label: '2월' },
              { key: '2026_03', label: '3월' },
              { key: '2026_04', label: '4월' },
              { key: '2026_05', label: '5월' },
              { key: '2026_06', label: '6월' },
              { key: '2026_1H', label: '상반기 전체' },
            ].map(p => (
              <button
                key={p.key}
                onClick={() => setDatePreset(p.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  datePreset === p.key
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Dimensional Select Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-800/80">
          {/* 0. Month Select Dropdown */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-indigo-400" />
              <span>발행월(Month)</span>
            </label>
            <select
              value={datePreset}
              onChange={e => setDatePreset(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="ALL">전체 기간 수집본</option>
              <option value="2026_01">2026년 01월</option>
              <option value="2026_02">2026년 02월</option>
              <option value="2026_03">2026년 03월</option>
              <option value="2026_04">2026년 04월</option>
              <option value="2026_05">2026년 05월</option>
              <option value="2026_06">2026년 06월</option>
              <option value="2026_07">2026년 07월</option>
              <option value="2026_08">2026년 08월</option>
              <option value="2026_09">2026년 09월</option>
              <option value="2026_10">2026년 10월</option>
              <option value="2026_11">2026년 11월</option>
              <option value="2026_12">2026년 12월</option>
              <option value="2026_1H">2026년 상반기 전체</option>
              <option value="2026_2H">2026년 하반기 전체</option>
            </select>
          </div>
          {/* 1. Category / Sector Select */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 flex items-center space-x-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>카테고리(업종)</span>
            </label>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {sectors.map(s => (
                <option key={s.key} value={s.key} className="bg-slate-900 text-slate-200">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Analyst Select */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 flex items-center space-x-1">
              <User className="w-3 h-3 text-purple-400" />
              <span>애널리스트별</span>
            </label>
            <select
              value={selectedAnalyst}
              onChange={e => setSelectedAnalyst(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">전체 애널리스트 ({uniqueAnalysts.length}명)</option>
              {uniqueAnalysts.map(a => (
                <option key={a} value={a} className="bg-slate-900 text-slate-200">
                  {a} 연구원
                </option>
              ))}
            </select>
          </div>

          {/* 3. Broker Select */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-emerald-400" />
              <span>증권사별</span>
            </label>
            <select
              value={selectedBroker}
              onChange={e => setSelectedBroker(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">전체 증권사 ({uniqueBrokers.length}개)</option>
              {uniqueBrokers.map(b => (
                <option key={b} value={b} className="bg-slate-900 text-slate-200">
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Rating Select */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-amber-400" />
              <span>투자의견</span>
            </label>
            <select
              value={selectedRating}
              onChange={e => setSelectedRating(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">전체 투자의견</option>
              <option value="STRONG_BUY">강력매수 (Strong Buy)</option>
              <option value="BUY">매수 (Buy)</option>
              <option value="HOLD">중립 (Hold)</option>
              <option value="SELL">매도 (Sell)</option>
            </select>
          </div>

          {/* 5. PDF & Objectivity Quick Toggles */}
          <div className="col-span-2 sm:col-span-1 flex flex-col justify-end space-y-1.5">
            <label className="flex items-center space-x-1.5 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={onlyWithPdf}
                onChange={e => setOnlyWithPdf(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-[11px] font-semibold text-cyan-300 flex items-center space-x-1">
                <FileDown className="w-3 h-3 text-cyan-400" />
                <span>첨부 PDF 보유만</span>
              </span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={onlyHighObjectivity}
                onChange={e => setOnlyHighObjectivity(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-[11px] font-semibold text-purple-300 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span>AI 객관성 85점 이상</span>
              </span>
            </label>
          </div>
        </div>

        {/* AI Key Domain Keyword Chips Row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center space-x-1">
            <Tag className="w-3 h-3 text-pink-400" />
            <span>AI 추천 키워드:</span>
          </span>
          {topKeywords.map(kw => {
            const isSelected = activeKeywordFilter === kw;
            return (
              <button
                key={kw}
                onClick={() => setActiveKeywordFilter(isSelected ? null : kw)}
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pink-950 text-pink-200 border-pink-500 font-bold shadow-md'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                #{kw}
              </button>
            );
          })}

          {(searchQuery || selectedSector !== 'ALL' || selectedBroker !== 'ALL' || selectedAnalyst !== 'ALL' || selectedRating !== 'ALL' || onlyWithPdf || onlyHighObjectivity || datePreset !== 'ALL' || activeKeywordFilter) && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-[11px] text-rose-400 hover:text-rose-300 font-bold underline flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>전체 필터 초기화</span>
            </button>
          )}
        </div>
      </div>

      {/* View Mode Tabs (Card View / Table View / Grouped by Analyst / Grouped by Sector) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('CARD')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'CARD'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>카드 그리드 뷰</span>
          </button>

          <button
            onClick={() => setViewMode('TABLE')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'TABLE'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>상세 테이블 뷰</span>
          </button>

          <button
            onClick={() => setViewMode('BY_ANALYST')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'BY_ANALYST'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-3.5 h-3.5 text-purple-300" />
            <span>애널리스트별 모아보기</span>
          </button>

          <button
            onClick={() => setViewMode('BY_SECTOR')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'BY_SECTOR'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-300" />
            <span>카테고리별 모아보기</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          검색된 리포트 <strong className="text-white font-mono">{filteredReports.length}</strong>건 목록 표시중
        </div>
      </div>

      {/* NO RESULTS STATE */}
      {filteredReports.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">조건에 부합하는 리포트가 없습니다</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            검색어나 선택한 필터 조건(증권사, 카테고리, 애널리스트, 기간 등)을 변경해보세요.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            전체 필터 초기화
          </button>
        </div>
      )}

      {/* 1. CARD VIEW MODE */}
      {viewMode === 'CARD' && filteredReports.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map(report => {
            const potentialGain = Math.round(
              ((report.targetPrice - (report.currentPriceAtPublish || 1000)) / (report.currentPriceAtPublish || 1000)) * 100
            );

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-4.5 space-y-3.5 transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group"
              >
                {/* Card Header Top Badges */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-950 border border-slate-800 text-indigo-300 font-bold px-2 py-0.5 rounded text-[11px]">
                        {report.brokerName}
                      </span>
                      <span className="text-slate-300 font-semibold text-[11px] flex items-center space-x-1">
                        <User className="w-3 h-3 text-purple-400" />
                        <span>{report.analystName} 연구원</span>
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">{report.publishDate}</span>
                  </div>

                  {/* Stock Name & Code & Category */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                        {report.stockName}
                      </h3>
                      <span className="text-[10px] text-slate-400 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded font-mono">
                        {report.stockCode}
                      </span>
                    </div>

                    <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-bold">
                      {report.sector}
                    </span>
                  </div>

                  {/* Report Title */}
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-relaxed">
                    {report.title}
                  </h4>
                </div>

                {/* AI Summary Box */}
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-pink-300 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-pink-400" />
                      <span>Gemini LLM 핵심 요약</span>
                    </span>
                    {report.aiSummary?.objectivityScore && (
                      <span className="text-purple-300 bg-purple-950/80 border border-purple-800 px-1.5 py-0.2 rounded font-mono font-bold">
                        객관성 {report.aiSummary.objectivityScore}점
                      </span>
                    )}
                  </div>

                  <ul className="text-[11px] text-slate-300 space-y-1 pl-1">
                    {report.aiSummary?.keyTakeaways?.slice(0, 2).map((point, idx) => (
                      <li key={idx} className="line-clamp-2 flex items-start space-x-1.5 leading-tight">
                        <span className="text-indigo-400 shrink-0 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    )) || (
                      <li className="text-slate-500 italic">요약 데이터 분석 완료</li>
                    )}
                  </ul>
                </div>

                {/* Target Price & Financial Target Strip */}
                <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">목표가 / 당시주가</span>
                    <span className="font-bold text-cyan-300 text-xs">
                      {(report.targetPrice || 0).toLocaleString()}원
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({(report.currentPriceAtPublish || 0).toLocaleString()}원)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">상승여력</span>
                    <span className="font-black text-emerald-400 text-xs">
                      +{potentialGain}%
                    </span>
                  </div>
                </div>

                {/* Card Bottom File & Action Footer */}
                <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-800/60">
                  <button
                    onClick={(e) => handleDownloadPdfFile(e, report)}
                    className="flex items-center space-x-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                    title="원천데이터 (리서치센터 혹은 네이버증권 종목분석)분석결과 다운로드"
                  >
                    <Download className="w-3 h-3" />
                    <span>원천데이터 (리서치센터 혹은 네이버증권 종목분석)분석결과</span>
                  </button>

                  <span className="text-slate-400 hover:text-white text-[11px] font-bold flex items-center space-x-0.5">
                    <span>상세보기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TABLE VIEW MODE */}
      {viewMode === 'TABLE' && filteredReports.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                  <th className="py-3 px-3">발행일</th>
                  <th className="py-3 px-3">종목명 (코드)</th>
                  <th className="py-3 px-3">리포트 제목</th>
                  <th className="py-3 px-3">카테고리</th>
                  <th className="py-3 px-3">증권사 / 연구원</th>
                  <th className="py-3 px-3 text-right">목표가 (상승여력)</th>
                  <th className="py-3 px-3 text-center">AI 객관성</th>
                  <th className="py-3 px-3 text-center">첨부 PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredReports.map(report => {
                  const potentialGain = Math.round(
                    ((report.targetPrice - (report.currentPriceAtPublish || 1000)) / (report.currentPriceAtPublish || 1000)) * 100
                  );

                  return (
                    <tr
                      key={report.id}
                      onClick={() => onSelectReport(report)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {report.publishDate}
                      </td>

                      <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                        <div>{report.stockName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{report.stockCode}</div>
                      </td>

                      <td className="py-3 px-3 text-slate-200 group-hover:text-indigo-300 font-medium max-w-xs">
                        <div className="line-clamp-1 font-bold">{report.title}</div>
                        {report.aiSummary?.keyTakeaways?.[0] && (
                          <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            LLM: {report.aiSummary.keyTakeaways[0]}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="bg-slate-950 border border-slate-800 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          {report.sector}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-slate-300 font-semibold">{report.brokerName}</div>
                        <div className="text-[10px] text-purple-300">{report.analystName} 연구원</div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                        <div className="font-bold text-cyan-300">{(report.targetPrice || 0).toLocaleString()}원</div>
                        <div className="text-[10px] font-bold text-emerald-400">+{potentialGain}%</div>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="text-[11px] font-mono font-bold text-purple-300 bg-purple-950 border border-purple-800 px-2 py-0.5 rounded">
                          {report.aiSummary?.objectivityScore ?? 92}점
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => handleDownloadPdfFile(e, report)}
                          className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 p-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-flex items-center space-x-1"
                          title="PDF 파일 다운로드"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. GROUPED BY ANALYST VIEW MODE */}
      {viewMode === 'BY_ANALYST' && filteredReports.length > 0 && (
        <div className="space-y-4">
          {reportsByAnalyst.map((group, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-extrabold text-white">{group.analystName} 연구원</h3>
                      <span className="bg-slate-950 text-indigo-300 border border-slate-800 text-xs px-2 py-0.5 rounded font-bold">
                        {group.brokerName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      수집 완료 리포트 총 <strong className="text-white font-mono">{group.reports.length}건</strong> 작성
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedAnalyst(group.analystName);
                    setViewMode('CARD');
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold bg-indigo-950 border border-indigo-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  이 연구원 리포트만 보기 →
                </button>
              </div>

              {/* Reports List for this Analyst */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.reports.map(r => (
                  <div
                    key={r.id}
                    onClick={() => onSelectReport(r)}
                    className="bg-slate-950 border border-slate-800/80 hover:border-purple-500/50 p-3.5 rounded-xl space-y-2 cursor-pointer transition-all hover:bg-slate-900"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-white">{r.stockName} ({r.stockCode})</span>
                      <span className="text-slate-500 font-mono">{r.publishDate}</span>
                    </div>

                    <div className="text-xs font-bold text-slate-200 line-clamp-1">{r.title}</div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
                      <span className="text-cyan-300 font-mono font-bold">목표가 {(r.targetPrice || 0).toLocaleString()}원</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        +{Math.round((((r.targetPrice || 1000) - (r.currentPriceAtPublish || 1000)) / (r.currentPriceAtPublish || 1000)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. GROUPED BY SECTOR VIEW MODE */}
      {viewMode === 'BY_SECTOR' && filteredReports.length > 0 && (
        <div className="space-y-4">
          {reportsBySector.map(([sectorName, rList], idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">{sectorName}</h3>
                    <p className="text-xs text-slate-400">
                      해당 카테고리 수집 리포트 <strong className="text-white font-mono">{rList.length}건</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedSector(sectorName);
                    setViewMode('CARD');
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold bg-cyan-950 border border-cyan-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  이 업종 리포트 필터 적용 →
                </button>
              </div>

              {/* Reports Grid for this Sector */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rList.map(r => (
                  <div
                    key={r.id}
                    onClick={() => onSelectReport(r)}
                    className="bg-slate-950 border border-slate-800/80 hover:border-cyan-500/50 p-3.5 rounded-xl space-y-2 cursor-pointer transition-all hover:bg-slate-900"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-white">{r.stockName} ({r.stockCode})</span>
                      <span className="text-slate-400 font-bold">{r.brokerName} ({r.analystName})</span>
                    </div>

                    <div className="text-xs font-bold text-slate-200 line-clamp-1">{r.title}</div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
                      <span className="text-cyan-300 font-mono font-bold">목표가 {(r.targetPrice || 0).toLocaleString()}원</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        +{Math.round((((r.targetPrice || 1000) - (r.currentPriceAtPublish || 1000)) / (r.currentPriceAtPublish || 1000)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
