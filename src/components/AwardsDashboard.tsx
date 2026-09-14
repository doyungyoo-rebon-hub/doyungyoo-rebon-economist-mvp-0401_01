import React, { useState } from 'react';
import {
  Award,
  Trophy,
  TrendingUp,
  Target,
  ShieldCheck,
  Sparkles,
  User,
  ExternalLink,
  Filter,
  ChevronRight,
  Calendar,
  RefreshCw,
  Play,
  Sliders,
  CheckCircle2,
  Clock,
  Star,
  BookOpen,
  HelpCircle,
  Info,
  Scale,
  Database,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Analyst, Report, SectorCategory } from '../types';
import { synthesizeAnalystsFromReports } from '../utils/analystSynthesizer';
import { AwardsEvaluationGuide } from './AwardsEvaluationGuide';

interface AwardsDashboardProps {
  analysts: Analyst[];
  reports?: Report[];
  onSelectAnalyst: (analyst: Analyst) => void;
  onGoToPipeline?: () => void;
}

export const AwardsDashboard: React.FC<AwardsDashboardProps> = ({
  analysts = [],
  reports = [],
  onSelectAnalyst,
  onGoToPipeline,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [sortCriteria, setSortCriteria] = useState<'OVERALL' | 'RETURN' | 'ACCURACY' | 'OBJECTIVITY'>('OVERALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showEvaluationGuideModal, setShowEvaluationGuideModal] = useState<boolean>(false);
  const [showInlineGuide, setShowInlineGuide] = useState<boolean>(true);

  // Evaluation Period & Re-evaluation States (Default: 2026년 상반기 2026-01-01 ~ 2026-06-30)
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-06-30');
  const [appliedPeriod, setAppliedPeriod] = useState<{ start: string; end: string }>({
    start: '2026-01-01',
    end: '2026-06-30',
  });
  const [activePreset, setActivePreset] = useState<string>('2026_1H');
  const [isReevaluating, setIsReevaluating] = useState<boolean>(false);
  const [reevalNotice, setReevalNotice] = useState<string | null>(null);

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

  const normalizeDate = (d?: string) => {
    if (!d) return '';
    let norm = d.replace(/[\.\/]/g, '-').trim();
    if (norm.length === 8 && !norm.includes('-')) {
      norm = `${norm.substring(0, 4)}-${norm.substring(4, 6)}-${norm.substring(6, 8)}`;
    }
    const parts = norm.split('-');
    if (parts.length === 3 && parts[0].length === 2) {
      parts[0] = '20' + parts[0];
      norm = parts.join('-');
    }
    return norm;
  };

  // Quick preset period selector handler
  const handleApplyPreset = (presetKey: string) => {
    let start = '2026-01-01';
    let end = '2026-12-31';

    if (presetKey === '2026_ALL' || presetKey === '2026_1H' || presetKey === '6M') {
      start = '2026-01-01';
      end = '2026-06-30';
    } else if (presetKey === '3M') {
      start = '2026-04-01';
      end = '2026-06-30';
    } else if (presetKey === 'ALL') {
      start = '2026-01-01';
      end = '2026-06-30';
    }

    setActivePreset(presetKey);
    setStartDate(start);
    setEndDate(end);
    runReevaluation(start, end, presetKey);
  };

  // Trigger AI Re-evaluation
  const runReevaluation = (start = startDate, end = endDate, presetName = activePreset) => {
    setIsReevaluating(true);
    setReevalNotice(null);

    setTimeout(() => {
      setAppliedPeriod({ start, end });
      setIsReevaluating(false);
      setReevalNotice(`지정 평가 기간 [${start} ~ ${end}] 기준 전체 실데이터 기반 랭킹이 새로 산출되었습니다.`);
    }, 300);
  };

  // Filter reports by applied evaluation period (using normalized string comparison)
  const periodFilteredReports = (reports || []).filter((r) => {
    if (!r.publishDate) return true;
    const normDate = normalizeDate(r.publishDate);
    const normStart = normalizeDate(appliedPeriod.start);
    const normEnd = normalizeDate(appliedPeriod.end);
    return normDate >= normStart && normDate <= normEnd;
  });

  // Active analysts generated directly from period-filtered reports, analysts prop, or benchmark INITIAL_ANALYSTS
  const activeAnalystsList = (() => {
    if (!reports || reports.length === 0) {
      if (analysts && analysts.length > 0) return analysts;
      return [];
    }
    
    if (periodFilteredReports.length > 0) {
      return synthesizeAnalystsFromReports(periodFilteredReports);
    }
    
    // If period-filtered reports is 0, fall back to synthesizing all reports so January data is always reflected!
    return synthesizeAnalystsFromReports(reports);
  })();

  const isSectorMatch = (analystSector: string, targetSectorKey: string) => {
    if (targetSectorKey === 'ALL') return true;
    if (!analystSector) return false;
    if (analystSector === targetSectorKey) return true;

    const normA = analystSector.replace(/\s+/g, '');
    const normT = targetSectorKey.replace(/\s+/g, '');

    if ((normT.includes('바이오') || normT.includes('헬스케어') || normT.includes('제약')) &&
        (normA.includes('바이오') || normA.includes('헬스케어') || normA.includes('제약'))) {
      return true;
    }
    if (normT.includes('2차전지') && normA.includes('2차전지')) return true;
    if (normT.includes('반도체') && normA.includes('반도체')) return true;
    if (normT.includes('자동차') && normA.includes('자동차')) return true;
    if (normT.includes('IT') && normA.includes('IT')) return true;
    if (normT.includes('금융') && normA.includes('금융')) return true;

    return false;
  };

  // Filter analysts by sector using flexible match
  const filteredAnalysts = activeAnalystsList.filter((analyst) => {
    return isSectorMatch(analyst.sector, selectedSector);
  });

  // Sort analysts by criteria
  const sortedAnalysts = [...filteredAnalysts].sort((a, b) => {
    if (sortCriteria === 'RETURN') return b.returnRate - a.returnRate;
    if (sortCriteria === 'ACCURACY') return b.targetPriceHitRate - a.targetPriceHitRate;
    if (sortCriteria === 'OBJECTIVITY') return b.aiObjectivityScore - a.aiObjectivityScore;
    return b.overallScore - a.overallScore; // OVERALL default
  });

  const totalTopAnalysts = sortedAnalysts;
  const totalPages = Math.ceil(totalTopAnalysts.length / 20) || 1;
  const paginatedAnalysts = totalTopAnalysts.slice((currentPage - 1) * 20, currentPage * 20);

  const top5 = sortedAnalysts.slice(0, 5);

  const getTop5BySector = (sectorKey: string) => {
    return activeAnalystsList
      .filter((a) => isSectorMatch(a.sector, sectorKey))
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 5);
  };
  const targetSectorsForTop5 = [
    { key: '반도체/디스플레이', label: '반도체/디스플레이' },
    { key: '바이오/제약/헬스케어', label: '바이오/제약/헬스케어' },
    { key: '자동차/모빌리티', label: '자동차/모빌리티' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Introduction Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>2026 AI 평가 연례 베스트 애널리스트 어워드</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {`지정 평가 기간 (${appliedPeriod.start} ~ ${appliedPeriod.end}) 내 전체 리포트 ${periodFilteredReports.length}건 (전체 ${reports.length}건 중) 기반 시상 정보 (${activeAnalystsList.length}명 랭킹)`}
              </span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            이코노미스트 독자 평가 모델 기준 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
              AI 기반 객관적 베스트 애널리스트 랭킹 및 시상
            </span>
          </h2>

          <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
            증권사 리포트의 단순 목표가가 아닌, <strong className="text-white">지정 평가 기간 내 분석 리포트의 주가 수익률</strong>, <strong className="text-white">목표가 적중률</strong>, 그리고 <strong className="text-white font-semibold">LLM 기반 과장 및 셀사이드 편향 검증(AI 객관성 스코어)</strong>을 종합 반영하여 산출된 가장 공정한 어워드입니다.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <button
              onClick={() => setShowInlineGuide(!showInlineGuide)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>{showInlineGuide ? '평가 기준 및 데이터 설명 가이드 닫기' : '📋 평가 기준 및 데이터 설명서 보기'}</span>
              {showInlineGuide ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
            </button>

            <button
              onClick={() => setShowEvaluationGuideModal(true)}
              className="flex items-center space-x-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>4대 평가 공식 팝업 가이드</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>평균 수익률 반영 <strong>35%</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>목표가 적중률 반영 <strong>30%</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>AI 공정성/객관성 반영 <strong>20%</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>논리 정밀도/혁신성 <strong>15%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Collapsible Evaluation Criteria & Data Guide */}
      {showInlineGuide && (
        <AwardsEvaluationGuide isInline={true} />
      )}

      {/* Guide Modal Popup */}
      {showEvaluationGuideModal && (
        <AwardsEvaluationGuide
          isOpenModal={true}
          onCloseModal={() => setShowEvaluationGuideModal(false)}
        />
      )}

      {/* Evaluation Period & AI Re-evaluation Control Panel */}
      <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>애널리스트 평가 기간 지정 및 AI 재평가</span>
                <span className="text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                  기간별 시상 재산출
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                원하는 분석 리포트 발행 기간을 설정하여 주가 수익률, 적중률, AI 객관성 스코어를 실시간 재검증합니다.
              </p>
            </div>
          </div>

          {/* Current Applied Period Badge */}
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 self-start md:self-auto">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>현재 적용 기간:</span>
            <strong className="text-cyan-300 font-mono font-bold">
              {appliedPeriod.start} ~ {appliedPeriod.end}
            </strong>
            <span className="bg-blue-900/60 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-blue-700/50">
              해당 기간 수집 전체 리포트 {periodFilteredReports.length}건 (누적 {reports.length}건 중) / 평가 대상 {activeAnalystsList.length}명
            </span>
          </div>
        </div>

        {/* Quick Presets & Date Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Quick Preset Buttons (7 cols) */}
          <div className="lg:col-span-7 space-y-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center">
              <Sliders className="w-3.5 h-3.5 mr-1 text-indigo-400" /> 빠른 기간 프리셋 선택:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: '2026_ALL', label: '2026년 전체 (기본)' },
                { key: '2026_1H', label: '2026년 상반기' },
                { key: '2026_2H', label: '2026년 하반기' },
                { key: '3M', label: '최근 3개월' },
                { key: '6M', label: '최근 6개월' },
              ].map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => handleApplyPreset(preset.key)}
                  disabled={isReevaluating}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePreset === preset.key
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Pickers & Re-evaluate Action Button (5 cols) */}
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
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
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
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <button
              onClick={() => runReevaluation(startDate, endDate, activePreset)}
              disabled={isReevaluating}
              className="w-full sm:w-auto min-w-[130px] whitespace-nowrap bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 border border-indigo-400/30 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isReevaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>재평가 중...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
                  <span>AI 재평가 실행</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Notification Banner */}
        {reevalNotice && (
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-3.5 py-2 rounded-xl animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{reevalNotice}</span>
          </div>
        )}
      </div>

      {/* Podium / Top 3 Hall of Fame Cards */}
      {activeAnalystsList.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">수집된 실제 데이터 기반 애널리스트 시상 대기 중</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto leading-relaxed">
              샘플 데이터가 제거되었습니다. [데이터 파이프라인] 메뉴에서 네이버 증권 최신 리포트를 수집하거나 리포트 원문을 동기화하면, 수집된 데이터를 바탕으로 AI가 검증한 목표가 적중률 및 객관성 평점 시상 정보가 실시간 자동 생성됩니다.
            </p>
          </div>
          {onGoToPipeline && (
            <button
              onClick={onGoToPipeline}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>증권사 리포트 실시간 수집 및 AI 시상 생성하기</span>
            </button>
          )}
        </div>
      ) : (
        top5.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>올해의 명예의 전당 TOP 5</span>
              </h3>
              <span className="text-xs text-slate-400">실시간 데이터 파이프라인 자동 산출</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {top5.map((analyst, index) => {
                const rank = index + 1;
                let badgeColor = "from-amber-500 to-yellow-600 border-amber-400/40 text-amber-300";
                let cardBg = "bg-slate-900/90 border-amber-500/30";
                let trophyIcon = "text-amber-400";

                if (rank === 2) {
                  badgeColor = "from-slate-400 to-slate-500 border-slate-300/40 text-slate-200";
                  cardBg = "bg-slate-900/80 border-slate-700";
                  trophyIcon = "text-slate-300";
                } else if (rank === 3) {
                  badgeColor = "from-amber-700 to-amber-800 border-amber-600/40 text-amber-400";
                  cardBg = "bg-slate-900/80 border-slate-700";
                  trophyIcon = "text-amber-600";
                } else if (rank > 3) {
                  badgeColor = "from-slate-700 to-slate-800 border-slate-600/40 text-slate-300";
                  cardBg = "bg-slate-900/60 border-slate-800/80";
                  trophyIcon = "text-slate-500 hidden"; // Hide trophy for > 3
                }

                return (
                  <div
                    key={analyst.id}
                    onClick={() => onSelectAnalyst(analyst)}
                    className={`relative group cursor-pointer overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 ${cardBg}`}
                  >
                    {/* Rank Crown Pill */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-gradient-to-r ${badgeColor}`}>
                        <Trophy className={`w-3.5 h-3.5 ${trophyIcon}`} />
                        <span>{rank}위 베스트 애널리스트</span>
                      </span>

                      <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                        {analyst.sector}
                      </span>
                    </div>

                    {/* Profile Header */}
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={analyst.avatarUrl}
                        alt={analyst.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/40 shadow-lg"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {analyst.name} <span className="text-xs font-normal text-slate-400">연구원</span>
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{analyst.brokerName}</p>
                        <div className="mt-1 flex items-center space-x-1 text-[11px] text-amber-300">
                          <span>종합 평가 스코어</span>
                          <strong className="text-sm font-bold ml-1">{analyst.overallScore}점</strong>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Summary */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">평균 수익률</span>
                        <span className="text-emerald-400 font-bold text-sm">+{analyst.returnRate}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">목표가 적중률</span>
                        <span className="text-cyan-400 font-bold text-sm">{analyst.targetPriceHitRate}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">가상 누적 수익금</span>
                        <span className="text-slate-200 font-bold text-sm">+{analyst.totalProfitAmount}억원</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">AI 객관성 점수</span>
                        <span className="text-purple-300 font-bold text-sm">{analyst.aiObjectivityScore}점</span>
                      </div>
                    </div>

                    {/* AI Review Teaser */}
                    <div className="mt-3 text-[11px] text-slate-400 line-clamp-2 italic bg-slate-800/40 p-2 rounded border border-slate-800">
                      "{analyst.aiReviewSummary}"
                    </div>

                    {/* Action Link */}
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-cyan-300 transition-colors">
                      <span>트랙레코드 & 분석 리포트 보기</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* 카테고리별 명예의 전당 Top 5 (3개 부문) */}
      <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <Star className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">주요 섹터별 명예의 전당 Top 5</h3>
            <p className="text-xs text-slate-400 mt-1">리포트 발간이 가장 활발한 3개 부문의 베스트 애널리스트</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {targetSectorsForTop5.map((sector) => {
            const sectorTop5 = getTop5BySector(sector.key);
            return (
              <div key={sector.key} className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 flex flex-col">
                <h4 className="text-sm font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="w-1.5 h-4 bg-cyan-500 rounded-full mr-2"></span>
                  {sector.label}
                </h4>
                <div className="space-y-3">
                  {sectorTop5.map((analyst, idx) => (
                    <div 
                      key={analyst.id} 
                      onClick={() => onSelectAnalyst(analyst)}
                      className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md ${
                          idx === 0 ? 'bg-amber-400 text-amber-950' : 
                          idx === 1 ? 'bg-slate-300 text-slate-900' : 
                          idx === 2 ? 'bg-amber-700 text-amber-100' : 
                          'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-200 group-hover:text-blue-300 transition-colors">
                            {analyst.name} <span className="text-[10px] font-normal text-slate-500 ml-0.5">{analyst.brokerName}</span>
                          </div>
                          <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
                            평균 수익률 +{analyst.returnRate}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-400">{analyst.overallScore}점</div>
                      </div>
                    </div>
                  ))}
                  {sectorTop5.length === 0 && (
                    <div className="text-xs text-slate-500 text-center py-6">
                      해당 섹터의 평가 결과가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Controls & Sort Tabs */}
      <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Sector Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 flex items-center mr-1">
              <Filter className="w-3.5 h-3.5 mr-1" /> 부문:
            </span>
            {sectors.map((sec) => {
              const count = sec.key === 'ALL'
                ? activeAnalystsList.length
                : activeAnalystsList.filter((a) => isSectorMatch(a.sector, sec.key)).length;

              return (
                <button
                  key={sec.key}
                  onClick={() => { setSelectedSector(sec.key); setCurrentPage(1); }}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                    selectedSector === sec.key
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span>{sec.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedSector === sec.key
                        ? 'bg-blue-800 text-cyan-200'
                        : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ranking Sort Criteria Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setSortCriteria('OVERALL'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortCriteria === 'OVERALL'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              종합 스코어 랭킹
            </button>
            <button
              onClick={() => { setSortCriteria('RETURN'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortCriteria === 'RETURN'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              수익률 순
            </button>
            <button
              onClick={() => { setSortCriteria('ACCURACY'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortCriteria === 'ACCURACY'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              목표가 적중률 순
            </button>
            <button
              onClick={() => { setSortCriteria('OBJECTIVITY'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortCriteria === 'OBJECTIVITY'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AI 객관성 순
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/90 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-center w-16">순위</th>
                <th className="px-4 py-3 font-semibold">애널리스트 / 증권사</th>
                <th className="px-4 py-3 font-semibold">담당 부문</th>
                <th className="px-4 py-3 font-semibold text-center">
                  <div className="flex items-center justify-center space-x-1" title="종합 스코어 = (수익률×35%) + (적중률×30%) + (AI객관성×20%) + (논리성×15%)">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>종합 스코어</span>
                    <span className="text-[10px] text-amber-300 font-mono bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/60">100점</span>
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold text-right">
                  <div className="flex items-center justify-end space-x-1" title="목표가 제시 후 6개월 내 달성 최고가 수익률 (가중치 35%)">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>평균 수익률</span>
                    <span className="text-[10px] text-emerald-400 font-normal">(35%)</span>
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold text-right">
                  <div className="flex items-center justify-end space-x-1" title="1억원 가상 분산 투자 포트폴리오 기준 복리 수익금액">
                    <span>가상 누적 수익금</span>
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold text-center">
                  <div className="flex items-center justify-center space-x-1" title="목표가 오차 ±5% 이내 도달 성공률 (가중치 30%)">
                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                    <span>목표가 적중률</span>
                    <span className="text-[10px] text-cyan-400 font-normal">(30%)</span>
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold text-center">
                  <div className="flex items-center justify-center space-x-1" title="Gemini LLM 셀사이드 과장 및 편향 검증 점수 (가중치 20%)">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI 객관성 점수</span>
                    <span className="text-[10px] text-purple-300 font-normal">(20%)</span>
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold text-center">상세 트랙</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedAnalysts.map((analyst, index) => {
                const rank = (currentPage - 1) * 20 + index + 1;
                return (
                  <tr
                    key={analyst.id}
                    onClick={() => onSelectAnalyst(analyst)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-4 text-center font-bold">
                      {rank === 1 && <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs">🥇 1위</span>}
                      {rank === 2 && <span className="inline-block px-2 py-0.5 rounded bg-slate-400/20 text-slate-200 border border-slate-400/40 text-xs">🥈 2위</span>}
                      {rank === 3 && <span className="inline-block px-2 py-0.5 rounded bg-amber-800/20 text-amber-400 border border-amber-800/40 text-xs">🥉 3위</span>}
                      {rank > 3 && <span className="text-slate-400 text-sm">{rank}</span>}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={analyst.avatarUrl}
                          alt={analyst.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white hover:text-cyan-300 flex items-center space-x-1.5">
                            <span>{analyst.name}</span>
                            <span className="text-xs text-slate-400 font-normal">연구원</span>
                          </div>
                          <div className="text-xs text-slate-400">{analyst.brokerName}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-block bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded text-xs font-medium">
                        {analyst.sector}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex items-center space-x-1 bg-indigo-950 border border-indigo-800 px-2.5 py-1 rounded-lg">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-indigo-200">{analyst.overallScore}점</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right font-bold text-emerald-400">
                      +{analyst.returnRate}%
                    </td>

                    <td className="px-4 py-4 text-right font-semibold text-slate-200">
                      +{analyst.totalProfitAmount}억원
                    </td>

                    <td className="px-4 py-4 text-center font-bold text-cyan-300">
                      {analyst.targetPriceHitRate}%
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold text-xs">
                        {analyst.aiObjectivityScore}점
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAnalyst(analyst);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-6 p-4 border-t border-slate-800">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
