import React, { useState } from 'react';
import { FileText, Search, Filter, ShieldCheck, TrendingUp, Sparkles, AlertTriangle, ExternalLink, Calendar, Clock, Sliders, Play, RefreshCw, CheckCircle2, FileDown } from 'lucide-react';
import { InvestmentRating, Report, SectorCategory, isSectorMatch } from '../types';
import { triggerPdfDownload } from '../utils/downloadHelper';

interface ReportHubProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onManualAnalyzeClick: () => void;
  onReload: () => void;
  onClear: () => void;
  onNavigateToExplorer?: () => void;
}

export const ReportHub: React.FC<ReportHubProps> = ({
  reports = [],
  onSelectReport,
  onManualAnalyzeClick,
  onReload,
  onClear,
  onNavigateToExplorer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedRating, setSelectedRating] = useState<string>('ALL');
  const [onlyHighObjectivity, setOnlyHighObjectivity] = useState(false);

  // Evaluation / View Period & Re-filtering States
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-06-30');
  const [appliedPeriod, setAppliedPeriod] = useState<{ start: string; end: string }>({
    start: '2026-01-01',
    end: '2026-06-30',
  });
  const [activePreset, setActivePreset] = useState<string>('ALL');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

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

  // Date Normalizer
  const normalizeDate = (d?: string) => {
    if (!d) return '';
    return d.replace(/[\.\/]/g, '-').trim();
  };

  // Preset button click handler
  const handleApplyPreset = (presetKey: string) => {
    let start = '2026-01-01';
    let end = '2026-12-31';

    if (presetKey === '2026_2H') {
      start = '2026-07-01';
      end = '2026-12-31';
    } else if (presetKey === '2026_1H') {
      start = '2026-01-01';
      end = '2026-06-30';
    } else if (presetKey === '3M') {
      start = '2026-05-01';
      end = '2026-08-09';
    } else if (presetKey === '6M') {
      start = '2026-02-01';
      end = '2026-08-09';
    } else if (presetKey === 'ALL') {
      start = '2026-01-01';
      end = '2026-12-31';
    }

    setActivePreset(presetKey);
    setStartDate(start);
    setEndDate(end);
    runPeriodFilter(start, end);
  };

  // Run period re-filtering
  const runPeriodFilter = (start = startDate, end = endDate) => {
    setIsFiltering(true);
    setNotice(null);

    setTimeout(() => {
      setAppliedPeriod({ start, end });
      setIsFiltering(false);
      setNotice(`지정 리포트 발행 기간 [${start} ~ ${end}] 기준 AI 요약 리포트 목록이 새로 반영되었습니다.`);
    }, 600);
  };

  // Use reports directly
  const activeReportsList = reports || [];

  // Filter active reports list by applied date period first (using normalized string comparison)
  const periodFilteredReportsList = activeReportsList.filter((report) => {
    if (!report.publishDate) return true;
    const normDate = normalizeDate(report.publishDate);
    const normStart = normalizeDate(appliedPeriod.start);
    const normEnd = normalizeDate(appliedPeriod.end);
    return normDate >= normStart && normDate <= normEnd;
  });

  // Filter reports by search, sector, rating, objectivity score
  const filteredReports = periodFilteredReportsList.filter((report) => {
    // Search matching
    const sq = (searchQuery || '').toLowerCase();
    const matchSearch =
      (report.title || '').toLowerCase().includes(sq) ||
      (report.stockName || '').toLowerCase().includes(sq) ||
      (report.stockCode || '').includes(searchQuery) ||
      (report.analystName || '').toLowerCase().includes(sq) ||
      (report.brokerName || '').toLowerCase().includes(sq);

    if (!matchSearch) return false;

    // Sector matching using flexible helper
    if (selectedSector !== 'ALL' && !isSectorMatch(report.sector, selectedSector)) return false;

    // Rating matching
    if (selectedRating !== 'ALL' && report.rating !== selectedRating) return false;

    // High objectivity filter
    if (onlyHighObjectivity && (report.aiSummary?.objectivityScore || 0) < 90) return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">제휴 증권사 리포트 AI 통합 허브</h2>
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              LLM 핵심 요약 완료
            </span>
            <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>지정 기간 리포트: {periodFilteredReportsList.length}건 / 전체: {reports.length}건</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            실시간/월간 수집 파이프라인으로 반영된 증권사 분석 리포트의 3줄 핵심 요약 및 AI 공정성/객관성 점수 통합 조회
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
          {onNavigateToExplorer && (
            <button
              onClick={onNavigateToExplorer}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Search className="w-4 h-4 text-cyan-200" />
              <span>리포트 상세 조회 (PDF/애널리스트별)</span>
            </button>
          )}
          <button
            onClick={onReload}
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-700 transition-all hover:scale-[1.02]"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>다시 불러오기</span>
          </button>
          <button
            onClick={onClear}
            className="flex items-center justify-center space-x-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold px-3 py-2.5 rounded-xl border border-red-900/50 transition-all hover:scale-[1.02]"
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>초기화</span>
          </button>
          <button
            onClick={onManualAnalyzeClick}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>리포트 수집 & AI 분석하기</span>
          </button>
        </div>
      </div>

      {/* Report Date Period Selection & Re-summary Control Panel */}
      <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>리포트 조회 기간 지정 및 AI 요약 다시 반영</span>
                <span className="text-[11px] font-semibold bg-blue-500/20 text-cyan-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                  기간별 요약 필터링
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                분석 리포트의 발행 기간을 설정하여 해당 시기에 발행된 요약 리포트 목록을 집중 조회합니다.
              </p>
            </div>
          </div>

          {/* Current Applied Period Badge */}
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 self-start md:self-auto">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>적용 발행 기간:</span>
            <strong className="text-cyan-300 font-mono font-bold">
              {appliedPeriod.start} ~ {appliedPeriod.end}
            </strong>
            <span className="bg-blue-900/60 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-blue-700/50">
              해당 리포트 {periodFilteredReportsList.length}건
            </span>
          </div>
        </div>

        {/* Quick Presets & Date Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Quick Preset Buttons (7 cols) */}
          <div className="lg:col-span-7 space-y-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center">
              <Sliders className="w-3.5 h-3.5 mr-1 text-cyan-400" /> 빠른 기간 프리셋 선택:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'ALL', label: '2026년 전체 (1~12월)' },
                { key: '2026_2H', label: '2026년 하반기' },
                { key: '2026_1H', label: '2026년 상반기' },
                { key: '3M', label: '최근 3개월' },
                { key: '6M', label: '최근 6개월' },
              ].map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => handleApplyPreset(preset.key)}
                  disabled={isFiltering}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePreset === preset.key
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/30 border border-cyan-400/40'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Pickers & Action Button (5 cols) */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5">
            <div className="flex-1 space-y-1">
              <label className="text-[11px] font-medium text-slate-400 block">시작일</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setActivePreset('CUSTOM');
                }}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <span className="hidden sm:inline text-slate-500 pb-2">~</span>

            <div className="flex-1 space-y-1">
              <label className="text-[11px] font-medium text-slate-400 block">종료일</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setActivePreset('CUSTOM');
                }}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <button
              onClick={() => runPeriodFilter(startDate, endDate)}
              disabled={isFiltering}
              className="w-full sm:w-auto min-w-[130px] whitespace-nowrap bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 border border-cyan-400/30 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isFiltering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>적용 중...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
                  <span>기간 요약 적용</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Notice */}
        {notice && (
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-3.5 py-2 rounded-xl animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{notice}</span>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="종목명(삼성전자), 종목코드(005930), 애널리스트, 증권사, 제목 검색..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* High Objectivity Toggle */}
          <button
            onClick={() => setOnlyHighObjectivity(!onlyHighObjectivity)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              onlyHighObjectivity
                ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-md shadow-purple-950/50'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>AI 객관성 90점 이상만 보기</span>
          </button>
        </div>

        {/* Sector & Rating Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 flex items-center mr-1">
              <Filter className="w-3.5 h-3.5 mr-1" /> 부문:
            </span>
            {sectors.map((sec) => {
              const count = sec.key === 'ALL'
                ? periodFilteredReportsList.length
                : periodFilteredReportsList.filter((r) => isSectorMatch(r.sector, sec.key)).length;

              return (
                <button
                  key={sec.key}
                  onClick={() => setSelectedSector(sec.key)}
                  className={`whitespace-nowrap px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                    selectedSector === sec.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{sec.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedSector === sec.key
                        ? 'bg-blue-800 text-cyan-200'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {count}건
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-semibold">투자의견:</span>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">전체 투자의견</option>
              <option value="STRONG_BUY">강력매수 (Strong Buy)</option>
              <option value="BUY">매수 (Buy)</option>
              <option value="HOLD">중립 (Hold)</option>
              <option value="SELL">매도 (Sell)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400 space-y-4">
          <FileText className="w-12 h-12 mx-auto text-slate-600 mb-1" />
          {reports.length === 0 ? (
            <>
              <p className="text-base font-bold text-slate-200">등록된 분석 리포트가 없습니다.</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                현재 데이터베이스가 비어있는 상태입니다. 아래 버튼을 눌러 네이버 증권 실시간/월간 리포트를 파이프라인으로 수집하고 AI 요약을 바로 생성해 보세요.
              </p>
              <div className="pt-2">
                <button
                  onClick={onManualAnalyzeClick}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>네이버 증권 리포트 수집 및 AI 요약하기</span>
                </button>
              </div>
            </>
          ) : periodFilteredReportsList.length === 0 ? (
            <>
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>지정한 조회 기간 [{appliedPeriod.start} ~ {appliedPeriod.end}] 내 발행 리포트 0건</span>
              </div>
              <p className="text-base font-bold text-slate-200">선택하신 조회 기간에 해당하는 분석 리포트가 없습니다.</p>
              <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                현재 수집된 전체 {reports.length}건의 리포트 중 지정된 기간 내 발행 건이 없습니다. 조회 기간 프리셋을 변경하거나 해당 기간의 리포트를 파이프라인으로 새로 수집하실 수 있습니다.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => handleApplyPreset('ALL')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md"
                >
                  2026년 전체 리포트 {reports.length}건 보기
                </button>
                <button
                  onClick={() => handleApplyPreset('2026_2H')}
                  className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                >
                  2026년 하반기 (최신) 보기
                </button>
                <button
                  onClick={() => handleApplyPreset('2026_1H')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                >
                  2026년 상반기 보기
                </button>
                <button
                  onClick={onManualAnalyzeClick}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>해당 기간 데이터 수집하기</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-base font-bold text-slate-200">검색 조건에 맞는 리포트가 없습니다.</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                검색어 또는 부문/투자의견 필터를 변경해 보세요. (지정 기간 내 총 {periodFilteredReportsList.length}건 존재)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReports.map((report) => {
            const potentialGain = Math.round(
              ((report.targetPrice - report.currentPriceAtPublish) / report.currentPriceAtPublish) * 100
            );

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="group relative cursor-pointer bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between"
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-800 text-blue-300 border border-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        {report.brokerName}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {report.analystName} 연구원
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-500">{report.publishDate}</span>
                    </div>

                    {/* AI Objectivity Score Badge */}
                    <div className="flex items-center space-x-1 bg-purple-950/80 border border-purple-800 text-purple-300 px-2 py-0.5 rounded-full text-[11px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-purple-400" />
                      <span>객관성 {report.aiSummary?.objectivityScore || 0}점</span>
                    </div>
                  </div>

                  {/* Stock Name & Target Price Banner */}
                  <div className="flex items-center justify-between mb-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {report.stockName}
                        </h3>
                        <span className="text-xs text-slate-400">({report.stockCode})</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                          report.rating === 'STRONG_BUY'
                            ? 'bg-rose-950 border-rose-600 text-rose-300'
                            : report.rating === 'BUY'
                            ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                            : report.rating === 'HOLD'
                            ? 'bg-amber-950 border-amber-600 text-amber-300'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}>
                          {report.rating === 'STRONG_BUY' && '강력매수'}
                          {report.rating === 'BUY' && '매수'}
                          {report.rating === 'HOLD' && '중립'}
                          {report.rating === 'SELL' && '매도'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{report.sector}</span>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400">
                        발간당시 <span className="text-slate-200">{(report.currentPriceAtPublish || 0).toLocaleString()}원</span> → 목표가 <strong className="text-cyan-300 font-bold">{(report.targetPrice || 0).toLocaleString()}원</strong>
                      </div>
                      <div className="text-xs font-bold text-emerald-400">
                        기대 상승여력 +{potentialGain}%
                      </div>
                    </div>
                  </div>

                  {/* Sector & SubSector Extracted Tags */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-[11px] font-semibold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                      {report.sector}
                    </span>
                    {report.subSector && (
                      <span className="text-[11px] font-medium bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                        세부분야: {report.subSector}
                      </span>
                    )}
                    {report.sectorAnalysis?.sectorMomentumScore && (
                      <span className="text-[11px] text-amber-300 font-bold bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded ml-auto">
                        모멘텀 {report.sectorAnalysis.sectorMomentumScore}점
                      </span>
                    )}
                  </div>

                  {/* Report Title */}
                  <h4 className="font-bold text-sm text-slate-100 group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
                    {report.title}
                  </h4>

                  {/* Financial Forecast Snippet if available */}
                  {(report.aiSummary?.financialForecast) && (
                    <div className="bg-blue-950/30 border border-blue-900/50 p-2.5 rounded-lg mb-3 text-[11px] text-blue-200">
                      <strong className="text-blue-400 font-bold mr-1">[LLM 실적 전망]</strong>
                      <span className="line-clamp-1">{(report.aiSummary?.financialForecast)}</span>
                    </div>
                  )}

                  {/* 3-Bullet AI Takeaways Teaser */}
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5 mb-4">
                    <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center mb-1">
                      <Sparkles className="w-3 h-3 text-amber-400 mr-1" />
                      <span>LLM 3줄 핵심 요약</span>
                    </div>
                    {(report.aiSummary?.keyTakeaways || []).map((point, idx) => (
                      <p key={idx} className="text-xs text-slate-300 flex items-start space-x-1.5 leading-snug">
                        <span className="text-blue-400 font-bold">•</span>
                        <span className="line-clamp-1">{point}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-cyan-300 transition-colors">
                  <button
                    onClick={(e) => {
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
                    }}
                    className="flex items-center space-x-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                    title="원천데이터 (리서치센터 혹은 네이버증권 종목분석)분석결과 다운로드"
                  >
                    <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                    <span>원천데이터 (리서치센터 혹은 네이버증권 종목분석)분석결과</span>
                  </button>

                  <span className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors">
                    <span>상세보기</span>
                    <ExternalLink className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
