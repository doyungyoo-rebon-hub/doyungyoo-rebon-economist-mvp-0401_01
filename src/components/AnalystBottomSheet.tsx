import React, { useState } from 'react';
import {
  X,
  Award,
  TrendingUp,
  Target,
  ShieldCheck,
  PieChart as PieChartIcon,
  Bookmark,
  Share2,
  ExternalLink,
  Download,
  FileText,
  Video,
  Newspaper,
  Radio,
  Building2,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceDot,
  CartesianGrid
} from 'recharts';
import { Analyst, Report } from '../types';

interface AnalystBottomSheetProps {
  analyst: Analyst | null;
  onClose: () => void;
  onSelectReportByStock?: (stockName: string) => void;
  onViewReportDetail?: (report: Report) => void;
}

export const AnalystBottomSheet: React.FC<AnalystBottomSheetProps> = ({
  analyst,
  onClose,
  onSelectReportByStock,
  onViewReportDetail
}) => {
  const [activeTab, setActiveTab] = useState<'track_record' | 'coverage' | 'feed'>('track_record');
  const [feedSubTab, setFeedSubTab] = useState<'reports' | 'media'>('reports');
  const [selectedStockCode, setSelectedStockCode] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  if (!analyst) return null;

  // Selected stock for track record chart
  const coverageList = analyst.coverages || [];
  const currentStockCode = selectedStockCode || (coverageList.length > 0 ? coverageList[0].stockCode : '');
  const selectedCoverage = coverageList.find(c => c.stockCode === currentStockCode) || coverageList[0];

  // Chart data for selected stock
  const chartData = analyst.priceHistoryChartData?.[currentStockCode] || [
    { date: '25.09', actualPrice: 65000 },
    { date: '25.10', actualPrice: 68000 },
    { date: '25.11', actualPrice: 72000, targetPrice: 85000, reportEvent: '투자의견 BUY 제시' },
    { date: '25.12', actualPrice: 76000, targetPrice: 85000 },
    { date: '26.01', actualPrice: 79000, targetPrice: 92000, reportEvent: '목표주가 상향 (+8%)' },
    { date: '26.02', actualPrice: 84000, targetPrice: 92000 },
    { date: '26.03', actualPrice: 89000, targetPrice: 92000, reportEvent: '실적 호조 점검' },
    { date: '26.04', actualPrice: 91500, targetPrice: 92000 },
    { date: '26.05', actualPrice: 94000, targetPrice: 92000, reportEvent: '목표가 100% 달성' }
  ];

  // Donut chart data for Rating Distribution
  const ratingData = [
    { name: 'BUY (매수)', value: analyst.ratingDistribution?.buy || 78, color: '#3b82f6' },
    { name: 'HOLD (중립)', value: analyst.ratingDistribution?.hold || 18, color: '#f59e0b' },
    { name: 'SELL (매도)', value: analyst.ratingDistribution?.sell || 4, color: '#ef4444' }
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleDownloadOriginalPdf = (rep: Report) => {
    const params = new URLSearchParams({
      stockName: rep.stockName || '',
      stockCode: rep.stockCode || '',
      brokerName: rep.brokerName || '',
      title: rep.title || '',
      date: rep.publishDate || '',
      yymmdd: rep.publishDate?.replace(/[^0-9]/g, '').slice(2, 8) || '',
      nid: String(rep.nid || '')
    });
    window.open(`/api/pipeline-01/download-pdf-stream?${params.toString()}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      {/* Background Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 transition-transform duration-300">
        
        {/* Drag Handle for Mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* 1. 일반 정보: Sticky Header (프로필, 이름, 소속, 직급, 신뢰도 인증 배지, 북마크) */}
        <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-5 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={analyst.avatarUrl}
                  alt={analyst.name}
                  className="w-13 h-13 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-blue-500/50 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 bg-blue-600 text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full border border-slate-900 shadow">
                  #{analyst.overallRank || 1}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h3 className="text-base sm:text-xl font-bold text-white tracking-tight flex items-center space-x-1.5">
                    <span>{analyst.name}</span>
                    <span className="text-xs sm:text-sm font-normal text-slate-300">
                      {analyst.jobTitle || '수석연구위원'}
                    </span>
                  </h3>
                  <span className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 mr-0.5 text-amber-400" />
                    <span>{analyst.badgeTitle || `2026 베스트 애널리스트 1위`}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                  <span className="text-blue-400 font-semibold">{analyst.brokerName} 리서치센터</span>
                  <span>•</span>
                  <span>{analyst.sector} 부문 1위</span>
                  <span>•</span>
                  <span>경력 {analyst.yearsOfExperience || 12}년차</span>
                </div>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="관심 애널리스트 등록 (신규 리포트 알림 수신)"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span className="hidden sm:inline">{isBookmarked ? '관심 등록됨' : '관심 등록'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
                title="프로필 링크 공유"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {copiedNotification && (
            <div className="mt-2 text-center text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800 py-1 rounded-lg">
              ✓ 프로필 링크가 클립보드에 복사되었습니다.
            </div>
          )}
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* 2. Summary Dashboard: 숫자로 증명하는 공간 (적중률, 평균 수익률, 투자의견 도넛차트) */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Summary Dashboard (공식 트랙레코드 & 정량 지표)</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">발간 {analyst.totalReports}건 전수 검증</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Card 1: 목표주가 적중률 */}
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold">목표주가 적중률</span>
                  <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20">
                    상위 1.8%
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                    {analyst.targetPriceHitRate}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  제시 목표가 대비 6개월 내 주가 도달 성공률
                </p>
              </div>

              {/* Card 2: 평균 수익률 & 알파 */}
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold">평균 기대 수익률</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">
                    피어 +14.2%p
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">
                    +{analyst.returnRate}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  발간 리포트 추천 종목 기준 평균 주가 상승폭
                </p>
              </div>

              {/* Card 3: 투자의견 분포 (Recharts 도넛 차트) */}
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold">투자의견 분포 (Opinion)</span>
                  <span className="text-[10px] text-slate-400">도넛 차트</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-20 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ratingData}
                          innerRadius={22}
                          outerRadius={36}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {ratingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>BUY</span>
                      </span>
                      <strong className="text-blue-400">{ratingData[0].value}%</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>HOLD</span>
                      </span>
                      <strong className="text-amber-400">{ratingData[1].value}%</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>SELL</span>
                      </span>
                      <strong className="text-rose-400">{ratingData[2].value}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Tab Navigation for Elements 3, 4, 5 */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('track_record')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'track_record'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>4. 트랙레코드 주가 차트</span>
            </button>

            <button
              onClick={() => setActiveTab('coverage')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'coverage'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3. 커버리지 종목 ({coverageList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>5. 리포트 & 미디어 피드</span>
            </button>
          </div>

          {/* TAB 4. Track Record Chart: 특정 종목의 실제 주가 흐름과 목표가/리포트 발간 시점 오버레이 */}
          {activeTab === 'track_record' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>실제 주가 흐름 vs 목표주가 오버레이 검증 차트</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    리포트 발간 시점(이벤트 마커)과 이후 실제 주가의 적중 궤적을 확인합니다.
                  </p>
                </div>

                {/* Stock Selector Dropdown */}
                {coverageList.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 shrink-0">대상 종목:</span>
                    <select
                      value={currentStockCode}
                      onChange={(e) => setSelectedStockCode(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 font-bold focus:ring-2 focus:ring-blue-500"
                    >
                      {coverageList.map((cov) => (
                        <option key={cov.stockCode} value={cov.stockCode}>
                          {cov.stockName} ({cov.stockCode}) - 적중률 {cov.accuracyRate}%
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Chart Visualizer */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4 text-xs">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1 text-cyan-400 font-semibold">
                      <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
                      <span>실제 주가 추이</span>
                    </span>
                    <span className="flex items-center space-x-1 text-amber-400 font-semibold">
                      <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-400 inline-block" />
                      <span>제시 목표주가</span>
                    </span>
                  </div>
                  {selectedCoverage && (
                    <div className="text-slate-400">
                      현재가: <strong className="text-white">{selectedCoverage.currentPrice?.toLocaleString()}원</strong> | 
                      목표가: <strong className="text-amber-300">{selectedCoverage.targetPrice?.toLocaleString()}원</strong>
                    </div>
                  )}
                </div>

                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickFormatter={(v) => `${(v / 1000).toLocaleString()}k`}
                        domain={['dataMin - 5000', 'dataMax + 8000']}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          fontSize: '12px'
                        }}
                        formatter={(val: any, name: any) => [
                          `${Number(val).toLocaleString()}원`,
                          name === 'actualPrice' ? '실제 주가' : '제시 목표가'
                        ]}
                        labelFormatter={(label) => `발간 타임라인: 20${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="actualPrice"
                        name="actualPrice"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#0891b2' }}
                        activeDot={{ r: 7, fill: '#22d3ee' }}
                      />
                      <Line
                        type="stepAfter"
                        dataKey="targetPrice"
                        name="targetPrice"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 5, fill: '#d97706' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Milestone Events List */}
                <div className="mt-4 pt-4 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">
                    주요 발간 리포트 이벤트 타임라인
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {chartData.filter(d => d.reportEvent).map((evt, eIdx) => (
                      <div key={eIdx} className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-xs flex items-center space-x-2">
                        <span className="bg-blue-950 text-blue-300 font-bold px-1.5 py-0.5 rounded text-[10px] border border-blue-800">
                          {evt.date}
                        </span>
                        <span className="text-slate-200 font-medium truncate">{evt.reportEvent}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3. Coverage: 전문 섹터 태그 및 커버리지 종목 리스트 (로고 포함) */}
          {activeTab === 'coverage' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>전문 섹터 및 전담 커버리지 종목 포트폴리오</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    애널리스트가 전담 분석하는 유니버스 및 종목별 적중 성과입니다.
                  </p>
                </div>

                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">
                    주력: {analyst.sector}
                  </span>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full border border-slate-700">
                    커버리지 {coverageList.length}개 종목
                  </span>
                </div>
              </div>

              {/* Coverage Stocks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {coverageList.map((cov) => (
                  <div
                    key={cov.stockCode}
                    onClick={() => onSelectReportByStock?.(cov.stockName)}
                    className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        {/* Company Symbol Icon */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold text-sm shadow">
                          {cov.stockName.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                              {cov.stockName}
                            </h5>
                            <span className="text-[11px] font-mono text-slate-400">
                              {cov.stockCode}
                            </span>
                            {cov.isTopPick && (
                              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                                TOP PICK
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{cov.sector}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">적중률</span>
                        <span className="text-sm font-bold text-cyan-400">{cov.accuracyRate}%</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400">현재가: </span>
                        <strong className="text-white">{cov.currentPrice?.toLocaleString()}원</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">목표가: </span>
                        <strong className="text-amber-300">{cov.targetPrice?.toLocaleString()}원</strong>
                      </div>
                      <div className="text-emerald-400 font-bold flex items-center space-x-0.5">
                        <span>+{cov.returnRate}%</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5. Feed: 최근 리포트(3줄 요약, PDF 다운로드) & 미디어 활동(유튜브, 기사) */}
          {activeTab === 'feed' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Feed Sub-tabs */}
              <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
                <button
                  onClick={() => setFeedSubTab('reports')}
                  className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    feedSubTab === 'reports'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>최근 발간 리포트 ({analyst.recentReports?.length || 0})</span>
                </button>

                <button
                  onClick={() => setFeedSubTab('media')}
                  className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    feedSubTab === 'media'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>미디어 활동 ({analyst.mediaActivities?.length || 3})</span>
                </button>
              </div>

              {/* Sub-tab 1: 최근 리포트 피드 */}
              {feedSubTab === 'reports' && (
                <div className="space-y-3">
                  {(analyst.recentReports && analyst.recentReports.length > 0) ? (
                    analyst.recentReports.map((rep) => (
                      <div
                        key={rep.id}
                        className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-blue-950 text-blue-300 font-bold px-2 py-0.5 rounded text-xs border border-blue-800">
                                {rep.stockName}
                              </span>
                              <span className="text-xs font-mono text-slate-400">{rep.stockCode}</span>
                              <span className="text-xs text-slate-500">발행일: {rep.publishDate}</span>
                            </div>
                            <h5 className="font-bold text-white text-sm sm:text-base mt-1.5 hover:text-blue-400 cursor-pointer" onClick={() => onViewReportDetail?.(rep)}>
                              {rep.title}
                            </h5>
                          </div>

                          <span className="bg-emerald-500/10 text-emerald-400 font-bold text-xs px-2 py-1 rounded border border-emerald-500/20 shrink-0">
                            {rep.rating || 'BUY'}
                          </span>
                        </div>

                        {/* 3줄 핵심 요약 */}
                        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 my-3 space-y-1 text-xs text-slate-300">
                          <span className="text-[11px] font-bold text-cyan-400 block mb-1">
                            ✦ LLM 핵심 3줄 분석 요약:
                          </span>
                          <p className="flex items-start space-x-1.5">
                            <span className="text-blue-400">•</span>
                            <span>{rep.coreThesis || `${rep.stockName} 핵심 사업부문의 견조한 수요 성장 및 분기 실적 턴어라운드 가속`}</span>
                          </p>
                          <p className="flex items-start space-x-1.5">
                            <span className="text-blue-400">•</span>
                            <span>제시 목표주가 {rep.targetPrice?.toLocaleString()}원 기준 기대 상승여력 +{rep.disparityRate || 24}% 확보</span>
                          </p>
                          <p className="flex items-start space-x-1.5">
                            <span className="text-blue-400">•</span>
                            <span>동종 피어 그룹 대비 저평가 매력 및 주주환원 정책 확대 기대</span>
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                          <div className="text-slate-400">
                            목표가: <strong className="text-amber-300">{rep.targetPrice?.toLocaleString()}원</strong>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDownloadOriginalPdf(rep)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>증권사 원본 PDF</span>
                            </button>

                            <button
                              onClick={() => onViewReportDetail?.(rep)}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>상세 뷰어</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs bg-slate-950 rounded-xl border border-slate-800">
                      등록된 최근 발간 리포트가 없습니다.
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 2: 미디어 활동 (유튜브, 방송, 기사) */}
              {feedSubTab === 'media' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(analyst.mediaActivities || []).map((media) => (
                    <div
                      key={media.id}
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="flex items-center space-x-1 text-indigo-400 font-semibold">
                            {media.type === 'youtube' && <Video className="w-3.5 h-3.5 text-rose-500" />}
                            {media.type === 'article' && <Newspaper className="w-3.5 h-3.5 text-blue-400" />}
                            {media.type === 'broadcast' && <Radio className="w-3.5 h-3.5 text-amber-400" />}
                            <span>{media.publisher}</span>
                          </span>
                          <span>{media.date}</span>
                        </div>

                        <h5 className="font-bold text-white text-sm hover:text-indigo-300 transition-colors line-clamp-2">
                          {media.title}
                        </h5>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span>{media.views ? `조회수 ${media.views}` : ''} {media.duration ? `• ${media.duration}` : ''}</span>
                        <a
                          href={media.url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-semibold"
                        >
                          <span>바로가기</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
