import React, { useState } from 'react';
import { 
  OFFICIAL_OVERALL_SUMMARY, 
  OFFICIAL_WINNERS_REVIEWS, 
  TIE_BREAKER_POLICY,
  AnalystAwardReview 
} from '../data/awardsData';
import { 
  Award, 
  Trophy, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  ExternalLink, 
  ChevronRight, 
  Scale, 
  Printer, 
  Copy, 
  Check, 
  Info,
  Calendar,
  Building,
  Target
} from 'lucide-react';

export const AnalystAwards01Review: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<AnalystAwardReview | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTieBreakerModal, setShowTieBreakerModal] = useState<boolean>(false);

  const grandPrizeWinner = OFFICIAL_WINNERS_REVIEWS.find(r => r.isGrandPrize) || OFFICIAL_WINNERS_REVIEWS[0];
  const sectorWinners = OFFICIAL_WINNERS_REVIEWS;

  const sectors = ['ALL', ...Array.from(new Set(OFFICIAL_WINNERS_REVIEWS.map(r => r.sector)))];

  const filteredWinners = sectorWinners.filter(w => {
    if (sectorFilter === 'ALL') return true;
    return w.sector === sectorFilter;
  });

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 상단 타이틀 배너 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-4 bottom-4 opacity-10 text-indigo-300 pointer-events-none">
          <Trophy size={180} />
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Trophy size={14} className="text-amber-400" />
              리본인텔리전스 × 이코노미스트 공동주관
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck size={14} className="text-indigo-400" />
              독립 공인 AI 수석 심사위원단 공식 평가 리포트집
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              DART 전자공시 99.8% 정합성 검증 완료
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
            2026 올해의 애널리스트 어워즈 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">공식 AI 심사평</span>
          </h1>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            금융감독원 DART 분기·반기 확정 실적 데이터 교차검증과 32개 국내 증권사 4,868건의 실제 발간 리서치 리포트를 정밀 분석한 
            인텔리전스 평가 엔진을 바탕으로 작성된 대한민국 최고 권위의 공식 수상자 심사 보고서입니다.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            <div><span className="text-slate-500 font-medium">검증 표본 리포트:</span> <strong className="text-white">4,868건 (실제 마스터 DB 전수)</strong></div>
            <div className="h-3 w-px bg-slate-800" />
            <div><span className="text-slate-500 font-medium">평가 대상 애널리스트:</span> <strong className="text-white">407명</strong></div>
            <div className="h-3 w-px bg-slate-800" />
            <div><span className="text-slate-500 font-medium">참여 증권사:</span> <strong className="text-white">국내 32개사 전원</strong></div>
            <div className="h-3 w-px bg-slate-800" />
            <button
              onClick={() => setShowTieBreakerModal(true)}
              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
            >
              <Scale size={13} />
              동점자 처리 및 순위 결정 기준 확인
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. 상단: 전체적인 평가 심사평 (Executive Summary & 대상) */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">1. 전체 심사위원단 총평 (Overall Review)</h2>
              <p className="text-xs text-slate-400">리본인텔리전스 × 이코노미스트 공동주관 AI 독립 심사평가위원회 공식 수여사</p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            <Printer size={13} />
            심사평 인쇄/PDF 저장
          </button>
        </div>

        {/* 4대 평가 지표 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {OFFICIAL_OVERALL_SUMMARY.corePillars.map((pillar, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-indigo-400">지표 0{idx + 1}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                  {pillar.title.match(/\(\d+%\)/)?.[0] || ''}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                {pillar.title.replace(/\s*\(\d+%\)/, '')}
              </h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 심사위원장 공식 기고문 & 총평 */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>AI 심사위원장 공식 기고 (Chairman&apos;s Review Address)</span>
          </div>
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950/60 p-5 rounded-lg border border-slate-800/80">
            {OFFICIAL_OVERALL_SUMMARY.chairmanAddress}
          </div>
        </div>

        {/* [전체 1위 종합 대상] 한유정 연구원 특별 하이라이트 카드 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border-2 border-amber-500/40 p-7 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
                  <Trophy size={14} />
                  전체 1위 2026 종합 대상 (Grand Prize)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {grandPrizeWinner.sector} 1위 겸직
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-2xl lg:text-3xl font-black text-white">
                  {grandPrizeWinner.name} <span className="text-base font-normal text-slate-400">연구원</span>
                </h3>
                <span className="text-base font-semibold text-amber-400">{grandPrizeWinner.brokerName}</span>
                <span className="text-sm font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  종합 평점: {grandPrizeWinner.score}점 (100점 만점 1위)
                </span>
              </div>
              <p className="text-slate-300 text-sm italic font-serif leading-relaxed border-l-2 border-amber-500/60 pl-3">
                &ldquo;{grandPrizeWinner.fullReport.executiveSummary}&rdquo;
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {grandPrizeWinner.summaryKeywords.map((kw, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    📌 {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
              <button
                onClick={() => setSelectedReview(grandPrizeWinner)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <FileText size={16} />
                종합 대상 5단계 심사보고서 전문 열람
              </button>
              <button
                onClick={() => handleCopyCitation(grandPrizeWinner.honorCitation, grandPrizeWinner.id)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs border border-slate-700 transition cursor-pointer"
              >
                {copiedId === grandPrizeWinner.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                상장 헌정사 텍스트 복사
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. 하단: 10대 표준 섹터별 최우수 애널리스트 개별 심사평 리포트집 */}
      {/* ======================================================== */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">2. 10대 표준 섹터별 최우수 애널리스트 개별 심사평 리포트집</h2>
              <p className="text-xs text-slate-400">각 섹터 1위 수상자 전원의 정량·정성 성과 분석, 시장 기여 통찰 및 공식 심사위원단 헌정사</p>
            </div>
          </div>

          {/* 섹터 필터 탭 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSectorFilter(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  sectorFilter === sec
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {sec === 'ALL' ? '전체 섹터 (11명)' : sec}
              </button>
            ))}
          </div>
        </div>

        {/* 개별 심사평 카드 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWinners.map((analyst, index) => (
            <div
              key={analyst.id}
              className={`rounded-2xl bg-slate-900/90 border transition-all duration-200 p-6 flex flex-col justify-between hover:shadow-xl ${
                analyst.isGrandPrize 
                  ? 'border-amber-500/50 hover:border-amber-400' 
                  : 'border-slate-800 hover:border-indigo-500/50'
              }`}
            >
              {/* 카드 헤더 */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        analyst.isGrandPrize
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {analyst.category}
                      </span>
                      <span className="text-xs text-slate-400">#{index + 1}</span>
                    </div>
                    <div className="flex items-baseline gap-2.5">
                      <h3 className="text-xl font-extrabold text-white">
                        {analyst.name}
                      </h3>
                      <span className="text-sm font-semibold text-slate-300">{analyst.brokerName}</span>
                      <span className="text-xs text-slate-500">|</span>
                      <span className="text-xs text-indigo-300 font-medium">{analyst.sector}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      {analyst.score}
                      <span className="text-xs text-slate-400 font-normal">점</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">종합 평가점수</span>
                  </div>
                </div>

                {/* 📌 [심사평 요약 키워드] */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs font-bold text-slate-400">📌 키워드:</span>
                  {analyst.summaryKeywords.map((kw, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* 4대 세부 지표 스택 */}
                <div className="grid grid-cols-4 gap-2 pt-2 pb-2 bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">목표가 적중도</span>
                    <strong className="text-xs font-mono text-indigo-300">{analyst.metrics.targetPriceAccuracy}%</strong>
                  </div>
                  <div className="text-center border-l border-slate-800">
                    <span className="text-[10px] text-slate-400 block">DART 정합성</span>
                    <strong className="text-xs font-mono text-emerald-300">{analyst.metrics.dartAlignment}%</strong>
                  </div>
                  <div className="text-center border-l border-slate-800">
                    <span className="text-[10px] text-slate-400 block">시의성/활동</span>
                    <strong className="text-xs font-mono text-blue-300">{analyst.metrics.activityTimeliness}%</strong>
                  </div>
                  <div className="text-center border-l border-slate-800">
                    <span className="text-[10px] text-slate-400 block">논리/영향력</span>
                    <strong className="text-xs font-mono text-amber-300">{analyst.metrics.logicImpact}%</strong>
                  </div>
                </div>

                {/* 📊 [정량·정성 성과 분석] */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                    <TrendingUp size={13} />
                    📊 정량·정성 성과 분석
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                    {analyst.quantitativeQualitativeAnalysis}
                  </p>
                </div>

                {/* 💡 [시장 기여 및 통찰] */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles size={13} />
                    💡 시장 기여 및 통찰 (반(反)관행 인사이트)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                    {analyst.marketContributionInsight}
                  </p>
                </div>

                {/* 🏆 [공식 심사위원단 헌정사] */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                      <Trophy size={13} />
                      🏆 공식 심사위원단 헌정사 (상장 공식 문구)
                    </h4>
                    <button
                      onClick={() => handleCopyCitation(analyst.honorCitation, analyst.id)}
                      className="text-[11px] text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === analyst.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      문구 복사
                    </button>
                  </div>
                  <blockquote className="text-xs font-serif italic text-amber-200/90 leading-relaxed bg-amber-950/20 p-3 rounded-lg border border-amber-500/20">
                    &ldquo;{analyst.honorCitation}&rdquo;
                  </blockquote>
                </div>
              </div>

              {/* 카드 액션 버튼 */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  대표 리포트: <strong className="text-slate-300">{analyst.keyReports[0]?.slice(0, 24)}...</strong>
                </span>
                <button
                  onClick={() => setSelectedReview(analyst)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                >
                  5단계 상세 리포트 전문 보기
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. 모달: 5단계 공식 AI 평가 리포트 전문 팝업 */}
      {/* ======================================================== */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              aria-label="닫기"
            >
              ✕
            </button>

            {/* 모달 헤더 */}
            <div className="border-b border-slate-800 pb-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedReview.category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  DART 팩트체크 검증 완료
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">
                [리본-이코노미스트 2026 어워즈] AI 평가 리포트: {selectedReview.name} 연구원 ({selectedReview.brokerName})
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>섹터: <strong className="text-white">{selectedReview.sector}</strong></span>
                <span>종합 평점: <strong className="text-emerald-400 font-mono text-sm">{selectedReview.score}점</strong></span>
                <span>발간 리포트: <strong className="text-white">{selectedReview.keyReports.length}건 정밀 분석</strong></span>
              </div>
            </div>

            {/* 5단계 상세 본문 */}
            <div className="space-y-6 text-sm text-slate-300">
              {/* 1단계: 수상 총평 */}
              <div className="rounded-xl bg-slate-950/60 p-5 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Award size={16} />
                  1. 수상 총평 (Executive Summary)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">
                  {selectedReview.fullReport.executiveSummary}
                </p>
                <div className="pl-6 pt-1 flex flex-wrap gap-2">
                  {selectedReview.summaryKeywords.map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* 2단계: 4대 핵심 지표 정밀 평가 */}
              <div className="rounded-xl bg-slate-950/60 p-5 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                  <ShieldCheck size={16} />
                  2. 4대 핵심 지표 정밀 평가 (Quantitative & Qualitative Analysis)
                </h3>
                <div className="space-y-2.5 text-xs text-slate-300 pl-4 border-l-2 border-indigo-500/40">
                  <div>
                    <strong className="text-indigo-200">① 목표주가 적중률 및 궤적 추적:</strong> {selectedReview.fullReport.targetPriceTracking}
                  </div>
                  <div>
                    <strong className="text-emerald-200">② DART 공시 실적 정합성:</strong> {selectedReview.fullReport.dartConsistency}
                  </div>
                  <div>
                    <strong className="text-blue-200">③ 리포트 적시성과 논리적 깊이:</strong> {selectedReview.fullReport.timelinessDepth}
                  </div>
                  <div>
                    <strong className="text-amber-200">④ 시장 건전성 기여도:</strong> {selectedReview.fullReport.marketHealthContribution}
                  </div>
                </div>
              </div>

              {/* 3단계: 대표 발간 리포트 하이라이트 */}
              <div className="rounded-xl bg-slate-950/60 p-5 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                  <FileText size={16} />
                  3. 대표 발간 리포트 하이라이트
                </h3>
                <div className="pl-4 border-l-2 border-blue-500/40 text-xs space-y-1">
                  <div className="font-semibold text-white">
                    📄 {selectedReview.fullReport.representativeReport.title}
                  </div>
                  <div className="text-slate-400">발간일자: {selectedReview.fullReport.representativeReport.date}</div>
                  <p className="mt-1 text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800">
                    <strong className="text-indigo-300">핵심 논거 및 차별화 통찰:</strong> {selectedReview.fullReport.representativeReport.keyThesis}
                  </p>
                </div>
              </div>

              {/* 4단계: 2026년 하반기 전망 및 투자자 제언 */}
              <div className="rounded-xl bg-slate-950/60 p-5 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <TrendingUp size={16} />
                  4. 2026년 하반기 전망 및 투자자 제언
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">
                  {selectedReview.fullReport.h2OutlookAdvice}
                </p>
              </div>

              {/* 5단계: 최종 심사위원단 수여사 */}
              <div className="rounded-xl bg-amber-950/20 p-5 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-yellow-300 flex items-center gap-2">
                    <Trophy size={16} />
                    5. 최종 심사위원단 수여사 (Honor Citation)
                  </h3>
                  <button
                    onClick={() => handleCopyCitation(selectedReview.fullReport.citationText, `modal_${selectedReview.id}`)}
                    className="text-xs text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === `modal_${selectedReview.id}` ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    수여사 복사
                  </button>
                </div>
                <blockquote className="text-xs font-serif italic text-amber-100/90 leading-relaxed bg-black/40 p-4 rounded-lg border border-amber-500/20">
                  &ldquo;{selectedReview.fullReport.citationText}&rdquo;
                </blockquote>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                인텔리전스 AI 수석 심사위원단 공식 인증 리포트 (ID: {selectedReview.id})
              </span>
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. 동점자 처리 기준 팝업 모달 */}
      {/* ======================================================== */}
      {showTieBreakerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setShowTieBreakerModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                <Scale size={16} />
                <span>공식 심사 평가 규정집 제 4조</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {TIE_BREAKER_POLICY.title}
              </h3>
              <p className="text-xs text-slate-400">
                {TIE_BREAKER_POLICY.subtitle}
              </p>
            </div>

            <div className="space-y-3">
              {TIE_BREAKER_POLICY.rules.map((rule) => (
                <div 
                  key={rule.priority}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3.5"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {rule.priority}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{rule.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setShowTieBreakerModal(false)}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
