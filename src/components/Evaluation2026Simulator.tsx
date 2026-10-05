import React, { useState, useMemo } from 'react';
import {
  generateFinalEvaluation,
  calcTpAccuracy,
  calcEarningsAccuracy,
  mapQualitativeScore,
  calcActivityScore,
  calcExposureScore,
  KPI_2026_WEIGHTS,
  ForecastItem,
  Evaluation2026Result
} from '../utils/evaluationEngine2026';
import {
  Scale,
  ShieldCheck,
  Target,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  ChevronRight,
  UserCheck,
  Building,
  Award,
  DollarSign
} from 'lucide-react';

interface Evaluation2026SimulatorProps {
  analystsList?: any[];
  onSelectAnalyst?: (analyst: any) => void;
}

export const Evaluation2026Simulator: React.FC<Evaluation2026SimulatorProps> = ({
  analystsList = [],
  onSelectAnalyst
}) => {
  // Pre-filled analyst or custom selection
  const [selectedAnalystId, setSelectedAnalystId] = useState<string>('');

  // 1. Basic Info
  const [analystName, setAnalystName] = useState<string>('김반도');
  const [brokerName, setBrokerName] = useState<string>('미래에셋증권');
  const [sector, setSector] = useState<string>('반도체/디스플레이');

  // 2. ① 목표주가 정확도 (25%)
  const [targetPrice, setTargetPrice] = useState<number>(85000);
  const [priceAtPublish, setPriceAtPublish] = useState<number>(70000);
  const [priceAfter3m, setPriceAfter3m] = useState<number>(76000);
  const [priceAfter6m, setPriceAfter6m] = useState<number>(81000);
  const [priceAfter12m, setPriceAfter12m] = useState<number>(88000);
  const [marketCap, setMarketCap] = useState<number>(25000); // 2.5조원

  // 3. ② 실적 예측 정확도 (25%)
  const [forecasts, setForecasts] = useState<ForecastItem[]>([
    { quarter: '1Q', metric: 'OP', predicted: 1050, actual: 1020 },
    { quarter: '1Q', metric: 'REV', predicted: 12000, actual: 11800 },
    { quarter: '2Q', metric: 'OP', predicted: 1200, actual: 1140 },
    { quarter: '2Q', metric: 'REV', predicted: 13500, actual: 13100 },
    { quarter: '3Q', metric: 'OP', predicted: 1450, actual: 1380 },
    { quarter: '3Q', metric: 'REV', predicted: 15200, actual: 14900 }
  ]);

  // 4. ③ & ④ 정성 평가 (각 15%)
  const [logicGrade, setLogicGrade] = useState<'S' | 'A' | 'B' | 'C' | 'D'>('S');
  const [riskGrade, setRiskGrade] = useState<'S' | 'A' | 'B' | 'C' | 'D'>('A');

  // 5. ⑤ 리포트 발행 빈도 (10%)
  const [reportCount, setReportCount] = useState<number>(26);
  const [coverageCount, setCoverageCount] = useState<number>(7);

  // 6. ⑥ & ⑦ 외부 파급력 (각 5%)
  const [snsMentionCount, setSnsMentionCount] = useState<number>(1450);
  const [maxSnsMentionCount] = useState<number>(2500);
  const [mediaMentionCount, setMediaMentionCount] = useState<number>(980);
  const [maxMediaMentionCount] = useState<number>(1800);

  // Handle analyst pre-fill
  const handleSelectPreFill = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedAnalystId(id);
    if (!id) return;

    const target = analystsList.find(a => a.id === id);
    if (target) {
      setAnalystName(target.name || '애널리스트');
      setBrokerName(target.brokerName || '증권사');
      setSector(target.sector || '주요 섹터');
      setReportCount(target.reportCount || 20);
      setCoverageCount((target.stocksList || target.coverages || []).length || 5);

      const rep = target.keyReport || (target.reports && target.reports[0]) || {};
      const tp = rep.targetPrice || 70000;
      const cur = rep.currentPriceAtPublish || Math.round(tp * 0.82);
      const ret = (target.returnRate || 25) / 100;

      setTargetPrice(tp);
      setPriceAtPublish(cur);
      setPriceAfter3m(Math.round(cur * (1 + ret * 0.4)));
      setPriceAfter6m(Math.round(cur * (1 + ret * 0.7)));
      setPriceAfter12m(Math.round(cur * (1 + ret)));

      if (target.avgDepthScore >= 95) setLogicGrade('S');
      else if (target.avgDepthScore >= 90) setLogicGrade('A');
      else if (target.avgDepthScore >= 80) setLogicGrade('B');
      else setLogicGrade('C');

      if ((target.contrarianScore || 80) >= 90) setRiskGrade('S');
      else if ((target.contrarianScore || 80) >= 80) setRiskGrade('A');
      else setRiskGrade('B');

      if (target.totalHits) setSnsMentionCount(target.totalHits);
      if (target.totalDownloads) setMediaMentionCount(target.totalDownloads);
    }
  };

  // Real-time deterministic evaluation calculation
  const evalResult: Evaluation2026Result = useMemo(() => {
    return generateFinalEvaluation({
      analystId: selectedAnalystId || 'sim_analyst',
      analystName,
      brokerName,
      sector,
      targetPrice,
      priceAtPublish,
      priceAfter3m,
      priceAfter6m,
      priceAfter12m,
      marketCap,
      forecastList: forecasts,
      logicGrade,
      riskGrade,
      reportCount,
      coverageCount,
      snsMentionCount,
      maxSnsMentionCount,
      mediaMentionCount,
      maxMediaMentionCount
    });
  }, [
    selectedAnalystId,
    analystName,
    brokerName,
    sector,
    targetPrice,
    priceAtPublish,
    priceAfter3m,
    priceAfter6m,
    priceAfter12m,
    marketCap,
    forecasts,
    logicGrade,
    riskGrade,
    reportCount,
    coverageCount,
    snsMentionCount,
    maxSnsMentionCount,
    mediaMentionCount,
    maxMediaMentionCount
  ]);

  // Handle forecast item modification
  const handleUpdateForecast = (idx: number, field: keyof ForecastItem, val: any) => {
    setForecasts(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleAddForecast = () => {
    setForecasts(prev => [
      ...prev,
      { quarter: '2Q', metric: 'OP', predicted: 1000, actual: 950 }
    ]);
  };

  const handleRemoveForecast = (idx: number) => {
    setForecasts(prev => prev.filter((_, i) => i !== idx));
  };

  const handleResetToStandard = () => {
    setSelectedAnalystId('');
    setAnalystName('김반도');
    setBrokerName('미래에셋증권');
    setSector('반도체/디스플레이');
    setTargetPrice(85000);
    setPriceAtPublish(70000);
    setPriceAfter3m(76000);
    setPriceAfter6m(81000);
    setPriceAfter12m(88000);
    setMarketCap(25000);
    setForecasts([
      { quarter: '1Q', metric: 'OP', predicted: 1050, actual: 1020 },
      { quarter: '1Q', metric: 'REV', predicted: 12000, actual: 11800 },
      { quarter: '2Q', metric: 'OP', predicted: 1200, actual: 1140 },
      { quarter: '2Q', metric: 'REV', predicted: 13500, actual: 13100 },
      { quarter: '3Q', metric: 'OP', predicted: 1450, actual: 1380 },
      { quarter: '3Q', metric: 'REV', predicted: 15200, actual: 14900 }
    ]);
    setLogicGrade('S');
    setRiskGrade('A');
    setReportCount(26);
    setCoverageCount(7);
    setSnsMentionCount(1450);
    setMediaMentionCount(980);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/70 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 lg:p-7 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-white tracking-tight">
                  2026 AI 7대 KPI 결정론적 평가 시뮬레이터
                </h3>
                <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  환각 100% 차단 수학 엔진
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                목표가 정확도(25%), 실적예측(25%), 투자논리(15%), 리스크(15%), 발행빈도(10%), SNS(5%), 미디어(5%) 변수를 실시간 변경하여 결정론적 점수를 즉시 검증합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetToStandard}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>기본값 초기화</span>
            </button>
          </div>
        </div>

        {/* Quick Pre-fill Selector */}
        {analystsList.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span className="font-bold">기존 수집 애널리스트 데이터 불러오기:</span>
            </div>
            <select
              value={selectedAnalystId}
              onChange={handleSelectPreFill}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">-- 애널리스트를 선택하여 데이터 자동 채우기 --</option>
              {analystsList.slice(0, 100).map(a => (
                <option key={a.id} value={a.id}>
                  [{a.brokerName}] {a.name} ({a.sector}) - {a.reportCount}건 리포트
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid: Inputs (Left) & Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Parameters (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Basic Identity */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Building className="w-4 h-4 text-indigo-400" />
              <span>평가 대상 기본 정보</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">애널리스트 성명</label>
                <input
                  type="text"
                  value={analystName}
                  onChange={e => setAnalystName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">소속 증권사</label>
                <input
                  type="text"
                  value={brokerName}
                  onChange={e => setBrokerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">담당 섹터</label>
                <input
                  type="text"
                  value={sector}
                  onChange={e => setSector(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 2. ① 목표주가 정확도 (25%) */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">1</div>
                <span>목표주가 정확도 인자 (가중치 25%)</span>
              </h4>
              <span className="text-xs text-emerald-400 font-bold">
                산출 점수: {evalResult.kpiScores.targetPriceAccuracy}점
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">제시 목표주가 (원)</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={e => setTargetPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">발간시점 현재가 (원)</label>
                <input
                  type="number"
                  value={priceAtPublish}
                  onChange={e => setPriceAtPublish(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">3개월 후 주가 (원, 50%)</label>
                <input
                  type="number"
                  value={priceAfter3m}
                  onChange={e => setPriceAfter3m(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">6개월 후 주가 (원, 30%)</label>
                <input
                  type="number"
                  value={priceAfter6m}
                  onChange={e => setPriceAfter6m(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">12개월 후 주가 (원, 20%)</label>
                <input
                  type="number"
                  value={priceAfter12m}
                  onChange={e => setPriceAfter12m(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">종목 시가총액 (억원)</label>
                <input
                  type="number"
                  value={marketCap}
                  onChange={e => setMarketCap(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
              <span>평균 괴리율: <strong className="text-emerald-400">{evalResult.details.targetPriceDetails.avgDisparity}%</strong></span>
              <span>12개월 실제 수익률: <strong className="text-yellow-400">{evalResult.details.targetPriceDetails.actualReturnPct}%</strong></span>
              <span>시총 보정 가중치: <strong className="text-cyan-400">{evalResult.details.targetPriceDetails.marketCapWeight}배</strong></span>
            </div>
          </div>

          {/* 3. ② 실적 예측 정확도 (25%) */}
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">2</div>
                <span>실적 예측 정확도 인자 (가중치 25%)</span>
              </h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddForecast}
                  className="text-[11px] px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 rounded-lg cursor-pointer"
                >
                  + 분기 항목 추가
                </button>
                <span className="text-xs text-cyan-400 font-bold">
                  산출 점수: {evalResult.kpiScores.earningsForecastAccuracy}점
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-5 gap-2 text-[11px] text-slate-400 font-semibold px-1">
                <span>분기 (1Q/2Q/3Q)</span>
                <span>지표 (OP/REV/NI)</span>
                <span>예측치 (억원)</span>
                <span>실적치 (억원)</span>
                <span>오차율 / 삭제</span>
              </div>

              {forecasts.map((item, idx) => {
                const errPct = item.actual > 0 ? (Math.abs(item.actual - item.predicted) / item.actual) * 100 : 0;
                return (
                  <div key={idx} className="grid grid-cols-5 gap-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <select
                      value={item.quarter}
                      onChange={e => handleUpdateForecast(idx, 'quarter', e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1"
                    >
                      <option value="1Q">1Q (20%)</option>
                      <option value="2Q">2Q (30%)</option>
                      <option value="3Q">3Q (50%)</option>
                    </select>

                    <select
                      value={item.metric}
                      onChange={e => handleUpdateForecast(idx, 'metric', e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1"
                    >
                      <option value="OP">영업이익 (60%)</option>
                      <option value="REV">매출액 (20%)</option>
                      <option value="NI">순이익 (20%)</option>
                    </select>

                    <input
                      type="number"
                      value={item.predicted}
                      onChange={e => handleUpdateForecast(idx, 'predicted', Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 font-mono"
                    />

                    <input
                      type="number"
                      value={item.actual}
                      onChange={e => handleUpdateForecast(idx, 'actual', Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 font-mono"
                    />

                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-300 font-bold">{errPct.toFixed(1)}%</span>
                      {forecasts.length > 1 && (
                        <button
                          onClick={() => handleRemoveForecast(idx)}
                          className="text-rose-400 hover:text-rose-300 px-1 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span>복합 가중 오차율: <strong className="text-cyan-400">{evalResult.details.earningsDetails.totalErrorRate}%</strong></span>
              <span>평가 지표 수: <strong className="text-white">{evalResult.details.earningsDetails.evaluatedItemsCount}개 항목</strong></span>
            </div>
          </div>

          {/* 4. ③ & ④ 정성 평가 (각 15%) */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center">3·4</div>
              <span>정성 평가 등급 1:1 결정론적 매핑 (각 15%)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300">③ 투자 논리 타당성 (15%)</span>
                  <span className="text-purple-400 font-bold">{evalResult.kpiScores.investmentLogicValidity}점</span>
                </div>
                <p className="text-[11px] text-slate-400">Gemini/Claude 리포트 밸류에이션 논리 정합성 등급</p>
                <div className="flex items-center space-x-1.5 pt-1">
                  {(['S', 'A', 'B', 'C', 'D'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setLogicGrade(g)}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition ${
                        logicGrade === g
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {g} ({g === 'S' ? '100' : g === 'A' ? '90' : g === 'B' ? '80' : g === 'C' ? '70' : '60'}점)
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300">④ 리스크 분석 적정성 (15%)</span>
                  <span className="text-rose-400 font-bold">{evalResult.kpiScores.riskAnalysisAdequacy}점</span>
                </div>
                <p className="text-[11px] text-slate-400">소신 의견 제시(Contrarian Call) 및 리스크 고지</p>
                <div className="flex items-center space-x-1.5 pt-1">
                  {(['S', 'A', 'B', 'C', 'D'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setRiskGrade(g)}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition ${
                        riskGrade === g
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {g} ({g === 'S' ? '100' : g === 'A' ? '90' : g === 'B' ? '80' : g === 'C' ? '70' : '60'}점)
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5. ⑤ 발행 빈도 & ⑥⑦ 외부 파급력 (총 20%) */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">5·6·7</div>
              <span>발행 빈도 및 외부 파급력 인자 (총 20%)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">⑤ 리포트 발행 빈도 (10%)</span>
                  <span className="text-amber-400 font-bold">{evalResult.kpiScores.reportPublicationFreq}점</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">발행 리포트 수 (최소 10건)</label>
                    <input
                      type="number"
                      value={reportCount}
                      onChange={e => setReportCount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">커버리지 종목 수</label>
                    <input
                      type="number"
                      value={coverageCount}
                      onChange={e => setCoverageCount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  * 10건 미만 시 0점(탈락), 30건 만점 기준, 종목당 1.5점 가점
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-300">⑥ SNS(5%) & ⑦ 미디어(5%)</span>
                  <span className="text-blue-400 font-bold">
                    합계 {(evalResult.kpiScores.snsAttention * 0.05 + evalResult.kpiScores.mediaExposure * 0.05).toFixed(1)}점
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">SNS 언급수 (최고 2,500)</label>
                    <input
                      type="number"
                      value={snsMentionCount}
                      onChange={e => setSnsMentionCount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">미디어 다운로드수 (최고 1,800)</label>
                    <input
                      type="number"
                      value={mediaMentionCount}
                      onChange={e => setMediaMentionCount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  * 상대 평가 정규화: SNS 점수 {evalResult.kpiScores.snsAttention}점 / 미디어 {evalResult.kpiScores.mediaExposure}점
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deterministic Final Scorecard & AI Review (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Total Score Banner */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
                  2026 AI 어워즈 결정론적 최종 점수
                </span>
                <h4 className="text-xl font-black text-white mt-0.5">
                  [{brokerName}] {analystName}
                </h4>
                <p className="text-xs text-slate-400">{sector}</p>
              </div>

              <div className="text-right">
                <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200">
                  {evalResult.totalScore.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400">100점 만점 기준</span>
              </div>
            </div>

            {/* 7 KPI Weighted Contribution Breakdown Table */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>7대 KPI별 가중 기여도 명세</span>
                <span className="text-[11px] text-slate-400">가중합계 = 100%</span>
              </h5>

              <div className="space-y-2 text-xs">
                {/* 1 */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-200 font-medium">① 목표주가 정확도 (25%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-400">{evalResult.kpiScores.targetPriceAccuracy}점</span>
                    <span className="font-mono font-bold text-emerald-400">+{(evalResult.kpiScores.targetPriceAccuracy * 0.25).toFixed(2)}점</span>
                  </div>
                </div>

                {/* 2 */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="text-slate-200 font-medium">② 실적 예측 정확도 (25%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-400">{evalResult.kpiScores.earningsForecastAccuracy}점</span>
                    <span className="font-mono font-bold text-cyan-400">+{(evalResult.kpiScores.earningsForecastAccuracy * 0.25).toFixed(2)}점</span>
                  </div>
                </div>

                {/* 3 */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <span className="text-slate-200 font-medium">③ 투자 논리 타당성 (15%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-400">{evalResult.kpiScores.investmentLogicValidity}점</span>
                    <span className="font-mono font-bold text-purple-400">+{(evalResult.kpiScores.investmentLogicValidity * 0.15).toFixed(2)}점</span>
                  </div>
                </div>

                {/* 4 */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="text-slate-200 font-medium">④ 리스크 분석 적정성 (15%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-400">{evalResult.kpiScores.riskAnalysisAdequacy}점</span>
                    <span className="font-mono font-bold text-rose-400">+{(evalResult.kpiScores.riskAnalysisAdequacy * 0.15).toFixed(2)}점</span>
                  </div>
                </div>

                {/* 5 */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-slate-200 font-medium">⑤ 리포트 발행 빈도 (10%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-400">{evalResult.kpiScores.reportPublicationFreq}점</span>
                    <span className="font-mono font-bold text-amber-400">+{(evalResult.kpiScores.reportPublicationFreq * 0.10).toFixed(2)}점</span>
                  </div>
                </div>

                {/* 6 */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span className="text-slate-200 font-medium">⑥ SNS 주목도 (5%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-400">{evalResult.kpiScores.snsAttention}점</span>
                    <span className="font-mono font-bold text-blue-400">+{(evalResult.kpiScores.snsAttention * 0.05).toFixed(2)}점</span>
                  </div>
                </div>

                {/* 7 */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <span className="text-slate-200 font-medium">⑦ 미디어 노출 빈도 (5%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-400">{evalResult.kpiScores.mediaExposure}점</span>
                    <span className="font-mono font-bold text-indigo-400">+{(evalResult.kpiScores.mediaExposure * 0.05).toFixed(2)}점</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Qualitative Review Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI 심사평 생성 템플릿 연동</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
                {evalResult.qualitativeComments}
              </p>
            </div>
          </div>

          {/* Mathematical Verification Note */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>결정론적 규칙 기반 엔진(Deterministic Engine) 보증</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              본 엔진은 LLM에게 최종 산술 계산을 맡기지 않고, LLM은 오직 리포트 본문으로부터 정량 파라미터(목표가, 실적 추정치) 및 정성 등급(S~D)만 추출하며, 모든 가중치와 오차율 공식은 규칙 기반 코드로만 엄격히 계산되어 100% 동일한 입력에 대해 항상 100% 동일한 점수를 보장합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
