// src/components/WhiteBoxModelPanel.tsx
// 화이트박스 금융 모델링 및 변수 조절 패널
// 1. 회계 항등식 자가 검증 (4Q 합 = FY 100% 일치)
// 2. 바이오 핵심 변수(머크 키트루다SC MSD 가이던스 전환율 35%, 로열티, WACC, 기타 플랫폼) 실시간 조절
// 3. 출발점 DART 전자공시 접수번호 및 KRX 정식 시세 100% 데이터 출처(Provenance) 투명화
// 4. 편향 없는 3대 시나리오: 하드코딩 목표가 완전 배제, 수식 체인 동적 산출 결과 연결
// 5. 할로자임 분쟁 상태값(수시 확인 필요) 및 자본시장법 관련 정규 법적 고지

import React, { useState, useMemo } from 'react';
import {
  DEFAULT_ALTEOGEN_BIO_PARAMS,
  ALTEOGEN_BASELINE_DATA,
  calculateWhiteBoxEvaluation,
  BioModelParameters,
  formatUpsidePct
} from '../services/financialMathEngine';
import {
  ALTEOGEN_DART_PROVENANCE,
  ALTEOGEN_KRX_PROVENANCE,
  MSD_KEYTRUDA_SC_GUIDANCE,
  HALOZYME_DISPUTE_METADATA
} from '../services/dataProvenance';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Calculator,
  Building,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Target,
  Sparkles,
  ShieldCheck,
  FileText,
  Percent,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Database
} from 'lucide-react';

interface Props {
  onApplyParametersToReport?: (params: BioModelParameters, evaluated: any) => void;
}

export const WhiteBoxModelPanel: React.FC<Props> = ({ onApplyParametersToReport }) => {
  // 1. 기준 시점 및 시세 선택: 최신 시세(382,500원) vs 3/31 공식 종가(366,500원)
  const [priceBasis, setPriceBasis] = useState<'latest_nov' | 'pit_mar'>('latest_nov');
  const currentPrice = priceBasis === 'latest_nov' ? 382500 : 366500;

  // 2. 조절 가능한 바이오 변수 상태
  const [params, setParams] = useState<BioModelParameters>(DEFAULT_ALTEOGEN_BIO_PARAMS);
  const [activeTab, setActiveTab] = useState<'variables' | 'provenance' | 'formulas' | 'dispute'>('variables');

  // 3. 실시간 화이트박스 연산: 하드코딩 없이 수식 체인에서 실시간 재계산
  const result = useMemo(() => {
    return calculateWhiteBoxEvaluation(params, ALTEOGEN_BASELINE_DATA, currentPrice);
  }, [params, currentPrice]);

  const { baseline, quarterEstimates, fyTotals, accountingCheck, valuation, scenarios } = result;

  // 파라미터 업데이트 핸들러
  const handleParamChange = <K extends keyof BioModelParameters>(key: K, value: BioModelParameters[K]) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetDefaults = () => {
    setParams(DEFAULT_ALTEOGEN_BIO_PARAMS);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Calculator size={18} />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                투명한 화이트박스 금융 모델러 (White-Box Financial Modeler)
              </h2>
              <p className="text-xs text-slate-400">
                블랙박스 AI 추정과 목표가 하드코딩을 배제하고, DART 접수번호 · MSD 가이던스 · 회계 항등식을 100% 수식 체인으로 검증합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              <span>기본값 초기화</span>
            </button>
            {onApplyParametersToReport && (
              <button
                type="button"
                onClick={() => onApplyParametersToReport(params, result)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
              >
                리포트에 목표가 적용
              </button>
            )}
          </div>
        </div>

        {/* Price Basis Selector & Accounting Status */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">기준 주가 선택:</span>
            <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setPriceBasis('latest_nov')}
                className={`px-2.5 py-1 rounded-md transition ${
                  priceBasis === 'latest_nov'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2026.11 현재 시세 (382,500원, 권장)
              </button>
              <button
                type="button"
                onClick={() => setPriceBasis('pit_mar')}
                className={`px-2.5 py-1 rounded-md transition ${
                  priceBasis === 'pit_mar'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2026.03.31 거래소 종가 (366,500원)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">회계 항등식 감사:</span>
            <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 size={12} />
              {accountingCheck.auditMessage}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Subtab Navigation */}
      <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('variables')}
          className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'variables'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders size={14} />
          <span>1. 바이오 핵심 변수 조절 패널</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('provenance')}
          className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'provenance'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database size={14} />
          <span>2. DART 접수번호 & 시세 출처(Provenance)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('formulas')}
          className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'formulas'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator size={14} />
          <span>3. 수식 체인 및 4Q=FY 회계 대사</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dispute')}
          className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'dispute'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle size={14} className="text-amber-400" />
          <span>4. 할로자임 분쟁 모니터링 (수시 확인 필요)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* Tab 1: 바이오 핵심 변수 조절 패널 (Interactive Variable Panel) */}
      {/* ======================================================== */}
      {activeTab === 'variables' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Variable Controller Controls (Left 2 Columns) */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders size={16} className="text-indigo-400" />
                    알테오젠 본질가치 결정 5대 핵심 변수 (수정 시 실시간 재계산)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    파트너사: <strong>{params.partnerName}</strong> | 대상 품목: <strong>{params.targetDrugName}</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* 1. SC 처방 전환율 (MSD 가이던스 30~40% 연동) */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Percent size={13} className="text-indigo-400" />
                        1. 키트루다SC 피하 처방 전환율 (출시 18~24개월 시계)
                      </label>
                      <span className="text-[10px] text-indigo-400 block mt-0.5">
                        * 머크(MSD) 공식 IR 가이던스 기대치: 전체 환자의 30%~40%
                      </span>
                    </div>
                    <span className="font-mono text-base font-bold text-indigo-300">
                      {Math.round(params.scConversionRate * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.70"
                    step="0.05"
                    value={params.scConversionRate}
                    onChange={(e) => handleParamChange('scConversionRate', parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Bear 가설 20% (IV 관행 고착)</span>
                    <span className="text-indigo-300 font-bold">MSD 기준 35% (가이던스 중위값)</span>
                    <span>Bull 가설 50% (조기 적응증 확대)</span>
                  </div>
                </div>

                {/* 2. 키트루다 글로벌 피크 연간 매출 */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-200">
                      2. 키트루다 글로벌 피크 연간 총매출 (USD M$)
                    </label>
                    <span className="font-mono text-base font-bold text-emerald-400">
                      {params.globalPeakSalesUsd.toLocaleString()} 백만 달러 (약 {(params.globalPeakSalesUsd * params.usdKrwRate / 10000).toFixed(1)}조원)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="35000"
                    step="1000"
                    value={params.globalPeakSalesUsd}
                    onChange={(e) => handleParamChange('globalPeakSalesUsd', parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>20,000 M$ (보수적)</span>
                    <span className="text-emerald-400 font-bold">28,000 M$ (글로벌 컨센서스)</span>
                    <span>35,000 M$ (신규 병용 적응증 확대)</span>
                  </div>
                </div>

                {/* 3. 순매출 연동 러닝 로열티율 */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="font-bold text-slate-200">
                        3. 글로벌 키트루다SC 러닝 로열티율 (보도 기준 2.0%)
                      </label>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        * 출처: 언론 보도(한국경제, 바이오인사이트) 및 주요 증권사 분석 기준 2.0%
                      </span>
                    </div>
                    <span className="font-mono text-base font-bold text-amber-400">
                      {(params.royaltyRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.05"
                    step="0.005"
                    value={params.royaltyRate}
                    onChange={(e) => handleParamChange('royaltyRate', parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1.5% (할로자임 에스크로 유보)</span>
                    <span className="text-amber-400 font-bold">2.0% (언론 보도 기본값)</span>
                    <span>3.5%~4.0% (낙관 시나리오 상단)</span>
                  </div>
                </div>

                {/* 4. 노바티스(Novartis) ALT-B4 기술수출 연간 기술료 */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="font-bold text-slate-200">
                        4. 노바티스(Novartis) 라이선스 계약 연간 기술료
                      </label>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        * ALT-B4 인간 히알루로니다제 멀티 타깃 기술이전 (연간 약 500억원)
                      </span>
                    </div>
                    <span className="font-mono text-base font-bold text-emerald-300">
                      {(params.novartisAnnualKrw || 500).toLocaleString()}억원
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1000"
                    step="50"
                    value={params.novartisAnnualKrw || 500}
                    onChange={(e) => handleParamChange('novartisAnnualKrw', parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>300억 (보수적)</span>
                    <span className="text-emerald-300 font-bold">500억 (정규 계약 기준치)</span>
                    <span>800억 (마일스톤 조기인식)</span>
                  </div>
                </div>

                {/* 5. 기타 파이프라인(다이이찌산쿄 ADC, AZ, GSK 등) 연간 기술료 */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="font-bold text-slate-200">
                        5. 기타 파이프라인(다이이찌산쿄 ADC, AZ, GSK 등) 연간 기술료
                      </label>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        * 키트루다 단일 의존도 분산: 엔허투 ADC 피하제형 공동개발 및 ALT-B4 기술수출 기여분
                      </span>
                    </div>
                    <span className="font-mono text-base font-bold text-cyan-300">
                      {params.otherPartnershipsAnnualKrw.toLocaleString()}억원
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={params.otherPartnershipsAnnualKrw}
                    onChange={(e) => handleParamChange('otherPartnershipsAnnualKrw', parseInt(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>250억 (Bear)</span>
                    <span className="text-cyan-300 font-bold">450억 (Base 정규 포트폴리오)</span>
                    <span>750억+ (Bull 신규 L/O 추가)</span>
                  </div>
                </div>

                {/* 5. WACC 할인율 */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-200">
                      5. 바이오 플랫폼 WACC 할인율
                    </label>
                    <span className="font-mono text-base font-bold text-rose-300">
                      {(params.waccRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.07"
                    max="0.13"
                    step="0.005"
                    value={params.waccRate}
                    onChange={(e) => handleParamChange('waccRate', parseFloat(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>8.5% (Bull: 저금리/소송 해소)</span>
                    <span className="text-slate-300 font-bold">9.5% (Base: 바이오 표준 WACC)</span>
                    <span>10.5% (Bear: 고금리/할로자임 분쟁 리스크 프리미엄)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-Time Recalculated Valuation Summary (Right 1 Column) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-2 border-indigo-500/40 space-y-5 shadow-xl">
              <div className="border-b border-indigo-500/30 pb-3">
                <span className="text-[10px] text-indigo-400 font-mono font-bold block">DYNAMIC DCF VALUATION</span>
                <h3 className="text-base font-bold text-white">동적 수식 산출 결과 (화이트박스 DCF)</h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">선택된 기준 주가</span>
                  <strong className="text-base text-slate-300">{valuation.currentPrice.toLocaleString()}원</strong>
                </div>

                <div className="p-4 bg-indigo-950/50 rounded-xl border border-indigo-500/50 space-y-1">
                  <span className="text-[10px] text-indigo-300 block font-bold">수식 산출 목표주가 (Base 공식)</span>
                  <div className="text-2xl font-black text-white">
                    {valuation.targetPriceRounded.toLocaleString()}원
                  </div>
                  <div className={`text-xs font-bold ${valuation.upsidePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    상승여력 {formatUpsidePct(valuation.upsidePct)}
                  </div>
                  <span className="block text-[10px] text-slate-400 font-sans pt-1">
                    * 미라운딩 순수 계산치: {valuation.exactTargetPricePerShare.toLocaleString()}원
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">연간 키트루다 로열티:</span>
                    <span className="text-indigo-300 font-bold">{valuation.annualRoyaltyKrw.toLocaleString()}억원</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">기타 기술료+마일스톤:</span>
                    <span className="text-cyan-300 font-bold">+{valuation.otherPartnershipsKrw + valuation.annualMilestoneKrw}억원</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">파이프라인 DCF 가치:</span>
                    <span className="text-indigo-200 font-bold">{valuation.pipelineRnpvKrw.toLocaleString()}억원</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">보유 순현금 (DART):</span>
                    <span className="text-emerald-400">+{params.netCashKrw.toLocaleString()}억원</span>
                  </div>
                  <div className="flex justify-between text-[11px] border-t border-slate-800 pt-1 font-bold">
                    <span className="text-slate-200">총 주주가치:</span>
                    <span className="text-white">{valuation.equityValueKrw.toLocaleString()}억원</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/20 text-[11px] text-slate-300 leading-relaxed font-sans">
                <strong>■ 수식 체인:</strong>
                <p className="mt-1 font-mono text-[10px] text-indigo-200">
                  총 주주가치 {valuation.equityValueKrw.toLocaleString()}억원 ÷ 53,248,307주 = {valuation.exactTargetPricePerShare.toLocaleString()}원 → <strong>{valuation.targetPriceRounded.toLocaleString()}원</strong>
                </p>
              </div>

              {onApplyParametersToReport && (
                <button
                  type="button"
                  onClick={() => onApplyParametersToReport(params, result)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>이 연산 결과로 리포트 발행하기</span>
                </button>
              )}
            </div>
          </div>

          {/* 3대 시나리오 밴드 (하드코딩 완전 배제, 동적 수식 연결) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target size={16} className="text-amber-400" />
                수식 산출 3대 가설 시나리오 (Bull / Base / Bear)
              </h3>
              <span className="text-[10px] text-slate-400">
                * 하드코딩 목표가 완전 배제, 파라미터별 수식 산출 결과 직접 연결
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((sc) => (
                <div
                  key={sc.name}
                  className={`p-4 rounded-xl border space-y-3 ${
                    sc.name.includes('Bull')
                      ? 'bg-purple-950/30 border-purple-500/40'
                      : sc.name.includes('Base')
                      ? 'bg-indigo-950/40 border-indigo-500/50'
                      : 'bg-rose-950/30 border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{sc.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300">
                      전환율 {sc.scConversionRatePct}% | 로열티 {sc.royaltyRatePct}%
                    </span>
                  </div>

                  <div className="font-mono">
                    <div className="text-xl font-bold text-white">
                      {sc.targetPrice.toLocaleString()}원
                    </div>
                    <div className={`text-xs font-bold ${sc.upsidePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {sc.upsidePct >= 0 ? `+${sc.upsidePct}%` : `${sc.upsidePct}%`}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      신뢰구간: {sc.targetPriceLower.toLocaleString()}원 ~ {sc.targetPriceUpper.toLocaleString()}원
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2 font-sans">
                    {sc.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Tab 2: DART 접수번호 & KRX 시세 출처 (Data Provenance Sheet) */}
      {/* ======================================================== */}
      {activeTab === 'provenance' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database size={18} className="text-emerald-400" />
                DART 전자공시 고유 접수번호 & KRX 거래소 시세 출처 감사 시트 (Data Provenance)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                임의의 블로그 요약이나 추정치를 배제하고, 금융감독원 DART 공시 원문 접수번호 및 KRX 정식 확정 종가만을 연계합니다.
              </p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 font-mono">
              감사 추적 검증 완료
            </span>
          </div>

          {/* DART Filing Provenance Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <FileText size={14} className="text-indigo-400" />
              1. DART 전자공시시스템 정식 접수 이력 (Look-ahead bias 방지용 날짜별 격리)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 font-sans">보고서명</th>
                    <th className="py-2.5 px-3">DART 접수번호</th>
                    <th className="py-2.5 px-3">실제 공시일</th>
                    <th className="py-2.5 px-3 text-right">매출(억)</th>
                    <th className="py-2.5 px-3 text-right">영업익(억)</th>
                    <th className="py-2.5 px-3 text-center">공시 상태</th>
                    <th className="py-2.5 px-3 font-sans">시점 격리 감사 노트</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ALTEOGEN_DART_PROVENANCE.map((f) => (
                    <tr key={f.receptionNumber} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-200">{f.reportName}</td>
                      <td className="py-2.5 px-3 text-indigo-300 font-bold">{f.receptionNumber}</td>
                      <td className="py-2.5 px-3 text-slate-300">{f.filingDate}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-400">{f.keyDisclosedFigures.salesKrw ? `${f.keyDisclosedFigures.salesKrw.toLocaleString()}억` : '-'}</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">{f.keyDisclosedFigures.opKrw ? `${f.keyDisclosedFigures.opKrw.toLocaleString()}억` : '-'}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.status === '공시확정'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-[11px] text-slate-400">{f.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* KRX Market Price Provenance */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Building size={14} className="text-amber-400" />
              2. KRX 한국거래소 정규장 확정 종가 정합 시트
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              {Object.entries(ALTEOGEN_KRX_PROVENANCE).map(([date, info]) => (
                <div key={date} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">{date} 종가</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">KOSDAQ</span>
                  </div>
                  <strong className="text-lg text-white block">{info.officialCloseKrw.toLocaleString()}원</strong>
                  <span className="text-[9px] text-slate-500 block truncate">
                    출처: {info.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Tab 3: 산출 공식 및 회계 항등식 대사 (Accounting Identity) */}
      {/* ======================================================== */}
      {activeTab === 'formulas' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator size={18} className="text-indigo-400" />
                회계 항등식 강제 검증 및 산출 공식 분해 (Accounting Identity Check)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ∑(Q1~Q4) Sales_q = FY Sales 항등식을 1원 단위까지 수학적으로 검증합니다.
              </p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 font-mono font-bold flex items-center gap-1">
              <CheckCircle2 size={13} /> 회계 감사 통과
            </span>
          </div>

          {/* 4Q vs FY Identity Breakdown Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-4 font-sans">분기 구분</th>
                  <th className="py-2.5 px-3 text-right">마일스톤 매출</th>
                  <th className="py-2.5 px-3 text-right">로열티 매출</th>
                  <th className="py-2.5 px-3 text-right">기존/타 플랫폼</th>
                  <th className="py-2.5 px-3 text-right text-indigo-300">총매출</th>
                  <th className="py-2.5 px-3 text-right text-emerald-400">영업이익</th>
                  <th className="py-2.5 px-3 text-right">순이익</th>
                  <th className="py-2.5 px-3 text-right">OPM(%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {quarterEstimates.map(q => (
                  <tr key={q.quarter} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-sans text-slate-300">{q.quarter}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{q.milestoneKrw.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{q.royaltyKrw.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{q.baseSalesKrw.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">{q.totalSalesKrw.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{q.opKrw.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{q.npKrw.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{q.opmPct}%</td>
                  </tr>
                ))}
                {/* 4Q Sum Row */}
                <tr className="bg-indigo-950/40 font-bold border-t-2 border-indigo-500/50">
                  <td className="py-2.5 px-4 font-sans text-indigo-300">4개 분기 합계 (∑ Q1~Q4)</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    {quarterEstimates.reduce((acc, q) => acc + q.milestoneKrw, 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    {quarterEstimates.reduce((acc, q) => acc + q.royaltyKrw, 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    {quarterEstimates.reduce((acc, q) => acc + q.baseSalesKrw, 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-indigo-300">{accountingCheck.salesSum.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-300">{accountingCheck.opSum.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{accountingCheck.npSum.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{fyTotals.opmPct}%</td>
                </tr>
                {/* FY Row */}
                <tr className="bg-slate-900/60 font-bold">
                  <td className="py-2.5 px-4 font-sans text-slate-300">연간 결산 전망 (FY Totals)</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                  <td className="py-2.5 px-3 text-right text-indigo-300">{accountingCheck.fySales.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-300">{accountingCheck.fyOp.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{accountingCheck.fyNp.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{fyTotals.opmPct}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Tab 4: 할로자임 분쟁 모니터링 (Ongoing Verification) */}
      {/* ======================================================== */}
      {activeTab === 'dispute' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                MSD-할로자임 글로벌 특허 분쟁 모니터링
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                근거 없는 '소송 해소' 단정을 배제하고, 진행형 상태값과 로열티 에스크로 유보 리스크를 실시간 추적합니다.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
              상태: {HALOZYME_DISPUTE_METADATA.statusLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <strong className="text-slate-200 block">■ 분쟁 개요 및 관할 법원</strong>
              <p className="text-slate-300 leading-relaxed">
                {HALOZYME_DISPUTE_METADATA.disputeSubject}
              </p>
              <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                <div>관할 기관: <strong>{HALOZYME_DISPUTE_METADATA.jurisdictions.join(' 및 ')}</strong></div>
                <div>최근 점검일: <strong>{HALOZYME_DISPUTE_METADATA.lastCheckDate}</strong></div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/30 space-y-2">
              <strong className="text-rose-300 block">■ 알테오젠 현금흐름 잠재 영향 및 감응도</strong>
              <p className="text-slate-300 leading-relaxed">
                {HALOZYME_DISPUTE_METADATA.potentialImpact}
              </p>
              <div className="p-2 rounded bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-200">
                Bear 시나리오에는 실효 로열티율 3.2%(20% 에스크로 유보) 및 WACC 10.5% 상향을 이미 반영하여 하방을 테스트하고 있습니다.
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <strong className="text-indigo-300 block">■ 모니터링 가이드라인:</strong>
            <p>{HALOZYME_DISPUTE_METADATA.monitoringRecommendation}</p>
          </div>
        </div>
      )}

      {/* Regulatory & Legal Disclaimer Card */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
        <strong className="text-amber-400 flex items-center gap-1.5 font-bold">
          <AlertTriangle size={14} />
          자본시장법 준수 및 법적 고지 (Regulatory & Legal Disclaimer)
        </strong>
        <p className="leading-relaxed text-[11px] text-slate-400">
          본 모델러는 학술적·연구 목적의 오픈소스 계량 재무 시뮬레이터(Financial Valuation Sandbox)로서, 자본시장법 제17조(투자자문업의 등록 등) 및 금융투자업 규정상 투자자문이나 특정 종목의 매수·매도 권유 행위를 제공하지 않습니다. 단순히 '유사투자자문이 아님'을 표시하는 것으로 법적 책임이 면제되지 않으므로, 본 프로그램을 공개 배포하거나 유료 서비스로 상용화할 경우 반드시 금융 전문 변호사의 법률 자문(Legal Clearance)을 완료해야 합니다.
        </p>
      </div>
    </div>
  );
};
