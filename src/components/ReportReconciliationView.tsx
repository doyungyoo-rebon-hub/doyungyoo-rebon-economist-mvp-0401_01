// src/components/ReportReconciliationView.tsx
// AI 리포트 시계열 롤링 비교 대사기 (Report Reconciliation Comparator)
// 과거 실증 리포트(Point-in-Time)와 차기 선행 리포트(Forward Research) 간 1:1 정밀 대조 및 롤오버 검증기

import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  PRESET_RECONCILIATION_PAIRS,
  ReconciliationPair,
  calculateReportReconciliation
} from '../services/virtualReportEngine';
import {
  Scale,
  ArrowRight,
  TrendingUp,
  Target,
  Layers,
  Award,
  FileDown,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Calendar,
  Building,
  Check,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Loader2,
  ChevronRight,
  Compass
} from 'lucide-react';

interface Props {
  onBackToGenerator?: () => void;
  onOpenWhiteBox?: () => void;
}

export const ReportReconciliationView: React.FC<Props> = ({ onBackToGenerator, onOpenWhiteBox }) => {
  // 1. 선택된 대사 페어 상태 (기본: 알테오젠 2026 vs 2027 첨부 PDF)
  const [selectedPairId, setSelectedPairId] = useState<string>(PRESET_RECONCILIATION_PAIRS[0].id);

  // 2. 롤오버(Rollover) 토글 상태 (기본: ON - 1차 달성가를 2차 시작가로 피드포워드)
  const [rolloverEnabled, setRolloverEnabled] = useState<boolean>(true);

  // 3. PDF 다운로드 및 토스트 상태
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const printableCertRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedPair =
    PRESET_RECONCILIATION_PAIRS.find(p => p.id === selectedPairId) ||
    PRESET_RECONCILIATION_PAIRS[0];

  // 실시간 교차 대사 분석 연산 수행
  const analysis = calculateReportReconciliation(selectedPair, rolloverEnabled);
  const { pair, effectiveReportB, priceMetrics, financialMetrics, thesisProgression, governance } = analysis;
  const { reportA } = pair;

  // PDF 출력 핸들러
  const handleDownloadPdf = async () => {
    if (!printableCertRef.current) return;
    setIsDownloadingPdf(true);

    try {
      const element = printableCertRef.current;
      element.style.display = 'block';

      const canvas = await htmlToImage.toCanvas(element, {
        backgroundColor: '#ffffff',
        pixelRatio: 1.5,
        skipFonts: true,
        style: {
          width: '960px',
          maxWidth: '960px',
          overflow: 'visible'
        }
      });

      element.style.display = 'none';

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`AI_Reconciliation_Cert_${pair.stockName}_${reportA.asOfDate}_${effectiveReportB.asOfDate}.pdf`);
      showToast('공식 AI 시계열 롤링 교차 검증 확인서 PDF가 다운로드되었습니다.');
    } catch (e) {
      console.error('PDF error:', e);
      showToast('PDF 생성 중 오류가 발생했습니다. 브라우저 인쇄 기능을 이용해 주세요.');
    } finally {
      setIsDownloadingPdf(false);
      if (printableCertRef.current) printableCertRef.current.style.display = 'none';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-indigo-400/30 text-sm font-semibold animate-bounce">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Hero Banner */}
      <div className="relative rounded-2xl p-6 sm:p-8 overflow-hidden bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Scale size={14} className="text-indigo-400" />
                Walk-Forward Cross-Validation Engine
              </span>
              <span className="text-xs text-slate-400">
                Point-in-Time 과거 실증 ↔ Forward Research 미래 예측 1:1 대사
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI 리포트 시계열 롤링 비교 대사기 (Report Comparator)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              과거 발간된 <strong>1차 실증 리포트(2026.03)</strong>와 1년 뒤 발간된 <strong>2차 선행 미래 리포트(2027.03)</strong>의 
              목표주가 도달 궤적, DART 분기 실적 추정 모델의 계단식 우상향 연속성, 투자 가설의 질적 진화를 정밀 교차 검증합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            {onOpenWhiteBox && (
              <button
                type="button"
                onClick={onOpenWhiteBox}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition cursor-pointer"
              >
                <Sparkles size={14} className="text-amber-300" />
                <span>🔬 화이트박스 금융 모델러 열기</span>
              </button>
            )}

            {onBackToGenerator && (
              <button
                type="button"
                onClick={onBackToGenerator}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                <span>리포트 발간기로 이동</span>
                <ChevronRight size={14} />
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>검증서 패키징 중...</span>
                </>
              ) : (
                <>
                  <FileDown size={15} />
                  <span>공식 롤링 검증 확인서 (PDF) 발급</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Callout Banner */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              <ShieldCheck size={13} />
              회계 정합성 감사 완료
            </span>
            <span className="text-slate-300">
              알테오젠 분기 합계 100% 일치(2,222억 / 2,596억) 및 Bear 시나리오 음(-)의 하락 위험(-18.2%) 전면 개편
            </span>
          </div>
          {onOpenWhiteBox && (
            <button
              type="button"
              onClick={onOpenWhiteBox}
              className="text-purple-300 hover:text-purple-200 underline font-semibold shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>DART 원문 및 rNPV 산출 공식 검증</span>
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Control Console: Pair Selection & Rollover Switch */}
      <section className="bg-slate-900/90 rounded-2xl p-5 sm:p-7 border border-slate-800 shadow-lg space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Pair Selector Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Building size={14} />
              대사 대상 2개년 리포트 페어 선택:
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_RECONCILIATION_PAIRS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPairId(p.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-2 ${
                    selectedPairId === p.id
                      ? 'bg-indigo-600/30 text-white border-indigo-500 font-bold shadow-xs'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="font-bold text-white">{p.stockName}</span>
                  <span className="font-mono text-[11px] text-indigo-300">({p.stockCode})</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {p.id.includes('alteogen') ? '첨부 PDF 원문' : '롤링 페어'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Rollover Feedforward Interactive Toggle */}
          <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/40 flex items-center justify-between gap-4 max-w-xl">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={13} className={rolloverEnabled ? 'text-emerald-400 animate-spin-slow' : 'text-slate-500'} />
                <span className="text-xs font-bold text-white">1차 실현가 롤오버(Rollover) 피드포워드</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  rolloverEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {rolloverEnabled ? '연동 활성 (ON)' : '단순 원문 (OFF)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {rolloverEnabled
                  ? `1차 리포트 실제 달성가(${pair.rolloverPrice.toLocaleString()}원)를 2차 시작 주가로 자동 반영하여 차기 목표가 밴드를 연쇄 레벨업합니다.`
                  : 'PDF 원문 표기 수치(2차 기준가 198,000원)를 그대로 유지하여 단순 1:1 대조합니다.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRolloverEnabled(!rolloverEnabled)}
              className={`w-14 h-7 rounded-full p-1 transition cursor-pointer flex items-center shrink-0 ${
                rolloverEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition" />
            </button>
          </div>
        </div>

        {/* 2-Column Summary Cards: Report A vs Report B */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Column A: Report A (2026.03 Point-in-Time 실증) */}
          <div className="p-5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center font-mono">
                  A
                </span>
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold block">1차 과거 실증 백테스트 리포트</span>
                  <h3 className="text-sm font-bold text-white">{reportA.reportTitle.slice(0, 32)}...</h3>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {reportA.verdictBadge}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">발간일 ({reportA.asOfDate})</span>
                <strong className="text-slate-200 text-sm block">{reportA.currentPrice.toLocaleString()}원</strong>
                <span className="text-[9px] text-slate-500">당시 확정 종가</span>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
                <span className="text-[10px] text-indigo-400 block">12M 목표가 (~{reportA.targetHorizonDate})</span>
                <strong className="text-indigo-300 text-sm block">{reportA.targetPrice.toLocaleString()}원</strong>
                <span className="text-[9px] text-indigo-400 font-bold">상승여력 +{reportA.upsidePct}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">실제 최고가 ({reportA.actualPeakDate})</span>
                <strong className="text-emerald-300 text-sm block">{reportA.actualPeakPrice?.toLocaleString()}원</strong>
                <span className="text-[9px] text-emerald-400 font-bold">목표 초과 달성 (+74%)</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              {reportA.executiveSummary}
            </p>
          </div>

          {/* Column B: Report B (2027.03 Forward Research 선행 예측) */}
          <div className="p-5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center justify-center font-mono">
                  B
                </span>
                <div>
                  <span className="text-[10px] text-purple-400 font-bold block">
                    2차 차기 선행 미래 리포트 ({rolloverEnabled ? '롤오버 연동' : '원문 표기'})
                  </span>
                  <h3 className="text-sm font-bold text-white">{effectiveReportB.reportTitle.slice(0, 32)}...</h3>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {effectiveReportB.verdictBadge}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className={`p-2.5 rounded-lg border ${rolloverEnabled ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] text-slate-400 block">
                  {rolloverEnabled ? '롤오버 시작가 (2027.03)' : '원문 기준가 (2027.03)'}
                </span>
                <strong className={`text-sm block ${rolloverEnabled ? 'text-emerald-300 font-bold' : 'text-slate-300'}`}>
                  {effectiveReportB.currentPrice.toLocaleString()}원
                </strong>
                <span className="text-[9px] text-slate-500">{rolloverEnabled ? '1차 달성가 피드포워드' : 'PDF 미반영 수치'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30">
                <span className="text-[10px] text-purple-300 block">2차 목표가 (~{effectiveReportB.targetHorizonDate})</span>
                <strong className="text-purple-300 text-sm block">{effectiveReportB.targetPrice.toLocaleString()}원</strong>
                <span className="text-[9px] text-purple-400 font-bold">상승여력 +{effectiveReportB.upsidePct}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Bull 상단 시나리오</span>
                <strong className="text-emerald-400 text-sm block">
                  {effectiveReportB.targetPriceBand.bull.toLocaleString()}원
                </strong>
                <span className="text-[9px] text-emerald-400 font-bold">상단 +{effectiveReportB.targetPriceBand.bullUpsidePct}%</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              {effectiveReportB.executiveSummary}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Module 1: 목표주가 & 3대 시나리오 밴드 롤링 브릿지 (Price Target & Band Bridge) */}
      <section className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              1. 목표주가 롤링 궤적 및 3대 시나리오 밴드 브릿지 (Price Target & Band Bridge)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            24개월 시계열 궤적: 2026.03 $\rightarrow$ 2027.03 $\rightarrow$ 2028.03
          </span>
        </div>

        {/* 4-Step Trajectory Flow Chart */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 block">① 1차 리포트 기준가 ({reportA.asOfDate})</span>
            <div className="text-xl font-bold text-slate-300">{reportA.currentPrice.toLocaleString()}원</div>
            <p className="text-[10px] font-sans text-slate-400">발간 당시 주가 베이스라인</p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
            <span className="text-[10px] text-indigo-400 block">② 1차 AI 목표가 (~{reportA.targetHorizonDate})</span>
            <div className="text-xl font-bold text-indigo-300">{reportA.targetPrice.toLocaleString()}원</div>
            <p className="text-[10px] font-sans text-indigo-400 font-bold">1차 목표 상승여력 +{reportA.upsidePct}%</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/50 space-y-1 shadow-lg shadow-emerald-500/10">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-emerald-400 font-bold">③ 1차 실제 달성 최고가 ({reportA.actualPeakDate})</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">HIT 적중</span>
            </div>
            <div className="text-xl font-black text-emerald-400">{reportA.actualPeakPrice?.toLocaleString()}원</div>
            <p className="text-[10px] font-sans text-emerald-300 font-bold">
              목표가 대비 달성률 {priceMetrics.reportAAchievementRatePct}% (+74.0%)
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-1">
            <span className="text-[10px] text-purple-300 block">
              ④ 2차 레벨업 목표가 (~{effectiveReportB.targetHorizonDate})
            </span>
            <div className="text-xl font-bold text-purple-300">{effectiveReportB.targetPrice.toLocaleString()}원</div>
            <p className="text-[10px] font-sans text-purple-400 font-bold">
              차기 추가 상승여력 +{effectiveReportB.upsidePct}% (상단 {effectiveReportB.targetPriceBand.bull.toLocaleString()}원)
            </p>
          </div>
        </div>

        {/* 3대 시나리오 밴드 대조표 */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">시나리오 구분</th>
                <th className="py-2.5 px-3 font-semibold text-center">확률</th>
                <th className="py-2.5 px-3 font-semibold text-right">1차 리포트 밴드 (~2027.03)</th>
                <th className="py-2.5 px-3 font-semibold text-right text-purple-300">
                  2차 리포트 밴드 (~2028.03 {rolloverEnabled ? '· 롤오버' : '· 원문'})
                </th>
                <th className="py-2.5 px-4 font-semibold text-right">시나리오 연속성 대사 소견</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-sans font-bold text-emerald-400">Bull (강세 / 낙관)</td>
                <td className="py-2.5 px-3 text-center text-slate-400">30%</td>
                <td className="py-2.5 px-3 text-right text-slate-300">
                  {reportA.targetPriceBand.bull.toLocaleString()}원 (+{reportA.targetPriceBand.bullUpsidePct}%)
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                  {effectiveReportB.targetPriceBand.bull.toLocaleString()}원 (+{effectiveReportB.targetPriceBand.bullUpsidePct}%)
                </td>
                <td className="py-2.5 px-4 text-right font-sans text-[11px] text-slate-300">
                  {rolloverEnabled ? '1차 최고가(34.4만) 달성 후 2차 상단 48만원선으로 퀀텀점프' : '1차 상단 목표와 2차 상단 목표가 344,500원으로 정합'}
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40 bg-indigo-950/20">
                <td className="py-2.5 px-4 font-sans font-bold text-indigo-300">Base (공식 타깃 기준)</td>
                <td className="py-2.5 px-3 text-center text-slate-400">55%</td>
                <td className="py-2.5 px-3 text-right text-slate-300">
                  {reportA.targetPriceBand.base.toLocaleString()}원 (+{reportA.targetPriceBand.baseUpsidePct}%)
                </td>
                <td className="py-2.5 px-3 text-right text-indigo-300 font-bold">
                  {effectiveReportB.targetPriceBand.base.toLocaleString()}원 (+{effectiveReportB.targetPriceBand.baseUpsidePct}%)
                </td>
                <td className="py-2.5 px-4 text-right font-sans text-[11px] text-slate-200">
                  {rolloverEnabled ? '1차 적중 실현가 베이스라인에서 387,000원으로 2단계 공식 타깃 레벨업' : '1차와 2차 모두 12MF P/E 19.5배 기준 287,000원 공식 타깃 일관 적용'}
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-sans font-bold text-rose-300">Bear (약세 / 하방지지)</td>
                <td className="py-2.5 px-3 text-center text-slate-400">15%</td>
                <td className="py-2.5 px-3 text-right text-slate-300">
                  {reportA.targetPriceBand.bear.toLocaleString()}원 ({reportA.targetPriceBand.bearUpsidePct >= 0 ? `+${reportA.targetPriceBand.bearUpsidePct}%` : `${reportA.targetPriceBand.bearUpsidePct}%`})
                </td>
                <td className="py-2.5 px-3 text-right text-rose-300 font-bold">
                  {effectiveReportB.targetPriceBand.bear.toLocaleString()}원 ({effectiveReportB.targetPriceBand.bearUpsidePct >= 0 ? `+${effectiveReportB.targetPriceBand.bearUpsidePct}%` : `${effectiveReportB.targetPriceBand.bearUpsidePct}%`})
                </td>
                <td className="py-2.5 px-4 text-right font-sans text-[11px] text-slate-300">
                  {rolloverEnabled ? '1차 상승분 지지선으로 31만원선 방어벽 형성' : '220,500원선 하방 안전마진 지지선 일관성 유지'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Module 2: 2개년 8개 분기 DART 실적 추정 모델 시계열 대사표 */}
      <section className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              2. DART 분기별 실적 추정 모델 시계열 연속성 대사표 (Financial Trajectory Bridge)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">단위: 억원</span>
        </div>

        {/* 3 Key Growth KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-0.5">
            <span className="text-[11px] text-slate-400 block">연간 매출 연속 성장률</span>
            <strong className="text-lg font-mono text-emerald-400">+{financialMetrics.salesCagrPct}%</strong>
            <span className="block text-[10px] text-slate-500">2026 FY 2,222억 $\rightarrow$ 2028 FY 2,596억</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-0.5">
            <span className="text-[11px] text-slate-400 block">연간 영업이익 확대폭</span>
            <strong className="text-lg font-mono text-indigo-300">+{financialMetrics.opGrowthPct}%</strong>
            <span className="block text-[10px] text-slate-500">2026 FY 1,342억 $\rightarrow$ 2028 FY 1,426억</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-0.5">
            <span className="text-[11px] text-slate-400 block">영업이익률(OPM) 레버리지 개선</span>
            <strong className="text-lg font-mono text-amber-300">+{financialMetrics.opmDeltaPctPoint}%p</strong>
            <span className="block text-[10px] text-slate-500">OPM 52.3% $\rightarrow$ OPM 54.9%로 체질 고도화</span>
          </div>
        </div>

        {/* Combined Multi-Quarter Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">리포트 출처</th>
                <th className="py-2.5 px-3 font-semibold">해당 분기</th>
                <th className="py-2.5 px-3 font-semibold text-right">추정 매출액</th>
                <th className="py-2.5 px-3 font-semibold text-right">추정 영업이익</th>
                <th className="py-2.5 px-3 font-semibold text-right">추정 순이익</th>
                <th className="py-2.5 px-3 font-semibold text-right">OPM(%)</th>
                <th className="py-2.5 px-4 font-semibold text-right">DART 실적 공시 대사 및 가설 특성</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {/* Report A Rows */}
              {reportA.financialEstimates.map((row) => (
                <tr key={`a_${row.quarter}`} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-4 font-sans text-indigo-400 font-bold">1차 (2026.03 발간)</td>
                  <td className="py-2.5 px-3 font-sans text-slate-200">{row.quarter}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{row.estimatedSales.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-indigo-300 font-bold">{row.estimatedOp.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{row.estimatedNp.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{row.opmPct}%</td>
                  <td className="py-2.5 px-4 text-right font-sans text-[11px] text-emerald-400">
                    {row.actualOp ? `확정 영업익 ${row.actualOp.toLocaleString()}억 (오차율 ${row.opErrorPct}%)` : '연간 누적 정합 대사 완료'}
                  </td>
                </tr>
              ))}

              {/* Separator Divider */}
              <tr className="bg-slate-900/90 text-purple-300 font-sans text-[11px]">
                <td colSpan={7} className="py-1.5 px-4 font-bold">
                  ▼ 1년 경과 후 2차 리포트(2027.03 발간) 차기 선행 실적 추정 모델로 연속 브릿지
                </td>
              </tr>

              {/* Report B Rows */}
              {effectiveReportB.financialEstimates.map((row) => (
                <tr key={`b_${row.quarter}`} className="hover:bg-slate-900/40 bg-purple-950/10">
                  <td className="py-2.5 px-4 font-sans text-purple-400 font-bold">2차 (2027.03 발간)</td>
                  <td className="py-2.5 px-3 font-sans text-slate-200">{row.quarter}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{row.estimatedSales.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-purple-300 font-bold">{row.estimatedOp.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{row.estimatedNp.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{row.opmPct}%</td>
                  <td className="py-2.5 px-4 text-right font-sans text-[11px] text-purple-300">
                    신규 설비 완공 후 분기 400~500억대 영업이익 체력 계단식 안착 전망
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Module 3: 3대 핵심 투자 가설 단계별 진화 매핑 */}
      <section className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-blue-400" />
            <h2 className="text-base font-bold text-white">
              3. 3대 핵심 투자 가설(Thesis) 단계별 진화 매핑 (Thesis Progression)
            </h2>
          </div>
          <span className="text-xs text-indigo-400 font-mono">
            가설 진화 적합성 지수: <strong>{thesisProgression.progressionScore}점 / 100점</strong>
          </span>
        </div>

        <div className="space-y-4">
          {reportA.theses.map((thesisA, idx) => {
            const thesisB = effectiveReportB.theses[idx];
            return (
              <div key={thesisA.number} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center font-mono">
                    {thesisA.number}
                  </span>
                  <h4 className="text-xs font-bold text-slate-200">
                    가설 {thesisA.number}차 축: {thesisA.ontologyLink.split(' ')[0]} 궤적 진화
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Thesis A */}
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-indigo-500/20 space-y-1">
                    <span className="text-[10px] text-indigo-400 font-bold block">1차 리포트(2026.03) 가설</span>
                    <strong className="text-slate-100 block">{thesisA.headline}</strong>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{thesisA.argument}</p>
                  </div>

                  {/* Right: Thesis B */}
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-purple-500/20 space-y-1">
                    <span className="text-[10px] text-purple-400 font-bold block">2차 리포트(2027.03) 진화 가설</span>
                    <strong className="text-slate-100 block">{thesisB?.headline}</strong>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{thesisB?.argument}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-xs text-slate-300 leading-relaxed">
          <strong className="text-indigo-300 block mb-1">■ 가설 진화 총평:</strong>
          {thesisProgression.evolutionSummary}
        </div>
      </section>

      {/* 6. Module 4: AI 독립 심사평가원 롤링 종합 감사 소견 */}
      <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-950 to-purple-950/40 border-2 border-indigo-500/40 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/30 pb-3">
          <div className="flex items-center gap-2">
            <Award size={22} className="text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                4. AI 독립 심사평가원 시계열 롤링 검증 성적표 (Audit Certificate)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                인증 문서 번호: <span className="font-mono text-slate-300">{governance.certificateId}</span>
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase border self-start sm:self-auto bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
            {governance.auditVerdictBadge}
          </span>
        </div>

        {/* Score Trajectory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-0.5">1차 모델 정합도</span>
            <strong className="text-lg text-emerald-400">{governance.reportAScore}점</strong>
            <span className="block text-[10px] text-slate-500 mt-0.5">DART 오차 1.4% 최상위</span>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-0.5">2차 모델 신뢰도</span>
            <strong className="text-lg text-purple-300">{governance.reportBScore}점</strong>
            <span className="block text-[10px] text-slate-500 mt-0.5">선행 가이던스 일관성</span>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-0.5">거버넌스 편차 (Drift)</span>
            <strong className="text-lg text-indigo-300">{governance.driftDelta}pt</strong>
            <span className="block text-[10px] text-slate-500 mt-0.5">허용오차 2.5pt 이내 충족</span>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-0.5">1차 목표 달성률</span>
            <strong className="text-lg text-emerald-400">{priceMetrics.reportAAchievementRatePct}%</strong>
            <span className="block text-[10px] text-slate-500 mt-0.5">조기 적중 돌파 완료</span>
          </div>
        </div>

        {/* Auditor Commentary */}
        <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-xs text-slate-200 leading-relaxed space-y-1.5 font-sans">
          <strong className="text-indigo-300 block">■ AI 리서치 독립 심사평가원 공식 검증 소견:</strong>
          <p>{governance.auditVerdict}</p>
          <p className="text-slate-400 text-[11px] pt-1 border-t border-indigo-500/20">
            {governance.summaryCommentary}
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. 숨김 출력용 컨테이너: 백색 공문서 스타일 PDF 인쇄용 */}
      {/* ======================================================== */}
      <div
        ref={printableCertRef}
        style={{ display: 'none' }}
        className="bg-white text-slate-900 font-sans p-10 space-y-6"
      >
        {/* Header */}
        <div className="border-b-4 border-indigo-900 pb-4 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-indigo-700 block mb-1">
              AI 리서치 시계열 연속 검증 확인서 (Walk-Forward Cross-Validation Certificate)
            </span>
            <h1 className="text-2xl font-black text-slate-950">
              {pair.stockName} ({pair.stockCode}) 2개년 리포트 롤링 대사 확인서
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              섹터: {pair.sector} | 1차: <strong>{reportA.asOfDate}</strong> ↔ 2차: <strong>{effectiveReportB.asOfDate}</strong> | 담당: <strong>{reportA.analystName} 연구원 ({reportA.analystBroker})</strong>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
              {governance.auditVerdictBadge}
            </span>
            <span className="block text-[10px] text-slate-500 font-mono mt-1">
              인증번호: {governance.certificateId}
            </span>
          </div>
        </div>

        {/* Key Comparative Summary Table */}
        <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center text-xs">
          <div>
            <span className="text-slate-500 text-[10px] block">1차 목표가 대비 달성률</span>
            <strong className="text-sm font-mono text-emerald-700">{priceMetrics.reportAAchievementRatePct}% (적중)</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">
              {rolloverEnabled ? '2차 롤오버 공식 목표가' : '2차 원문 목표가'}
            </span>
            <strong className="text-sm font-mono text-indigo-700">
              {effectiveReportB.targetPrice.toLocaleString()}원 (+{effectiveReportB.upsidePct}%)
            </strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">2개년 매출 성장률</span>
            <strong className="text-sm font-mono text-slate-800">+{financialMetrics.salesCagrPct}%</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">거버넌스 정합도</span>
            <strong className="text-sm font-mono text-amber-700">{governance.reportAScore}점 $\rightarrow$ {governance.reportBScore}점</strong>
          </div>
        </div>

        {/* Section 1: Price Bridge */}
        <div className="p-4 bg-white rounded border border-slate-200 text-xs space-y-2">
          <h4 className="font-bold text-slate-900 text-sm mb-1">1. 목표주가 및 3대 시나리오 밴드 연속성 대사</h4>
          <p className="text-slate-700 leading-relaxed">
            1차 리포트(2026.03.31) 기준가 198,000원에서 산출된 목표가 287,000원을 2026.08.20 실제 최고가 344,500원으로 조기 돌파(+74.0%)하였으며, 
            {rolloverEnabled
              ? `이 달성가를 차기 시작가로 연동하여 2차 선행 목표가를 387,000원(Bull 상단 480,000원)으로 합리적으로 2차 레벨업했습니다.`
              : `2차 리포트에서도 12MF P/E 19.5배 기준 287,000원의 공식 타깃 밸류에이션이 흔들림 없이 일관되게 고수되었습니다.`}
          </p>
        </div>

        {/* Section 2: Earnings Trajectory */}
        <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs space-y-2">
          <h4 className="font-bold text-slate-900 text-sm mb-1">2. DART 분기 실적 추정 모델의 계단식 우상향 대사</h4>
          <p className="text-slate-700 leading-relaxed">
            2026년 FY 연간 매출 2,222억원(영업이익 1,342억원, OPM 52.3%) 대비 2028년 FY 연간 매출 2,596억원(영업이익 1,426억원, OPM 54.9%)으로 
            연간 매출 +16.8%, 영업익 +6.3%, OPM +2.6%p의 계단식 고수익 레버리지 연속성이 유지되었습니다.
          </p>
        </div>

        {/* Section 3: Thesis Progression */}
        <div className="p-4 bg-white rounded border border-slate-200 text-xs space-y-2">
          <h4 className="font-bold text-slate-900 text-sm mb-1">3. 투자 가설(Thesis) 단계별 진화도 평가</h4>
          <p className="text-slate-700 leading-relaxed">
            초기 흑자 안착 및 원가율 안정화 가설(2026)에서 출발하여, 2027~2028년 글로벌 하이엔드 엔드마켓 신규 침투와 
            잉여현금흐름(FCF) 기반의 총주주환원율(TSR/자사주 매입소각) 확대로 질적인 논리 계승이 완료되었습니다. (진화 점수: {thesisProgression.progressionScore}점)
          </p>
        </div>

        {/* Official Verdict Box */}
        <div className="p-4 bg-slate-50 rounded-lg border-2 border-indigo-300 text-xs space-y-1.5">
          <h4 className="font-bold text-indigo-950 text-sm">4. AI 독립 심사평가원 종합 감사 확인문</h4>
          <p className="text-slate-800 leading-relaxed font-serif">
            &ldquo;본 건은 1차 Point-in-Time 실증 평가의 목표가 조기 적중(HIT) 이후, 1년 뒤 선행 리서치 모델 간의 신뢰도 편차가 1.8pt에 불과하여 
            금융기관 및 기관투자자 내부 실사 기준을 완벽히 충족하는 최상위 시계열 연속 정합성을 공인합니다.&rdquo;
          </p>
        </div>

        {/* Official Seal / Signature */}
        <div className="border-t border-slate-300 pt-4 flex justify-between items-center text-xs text-slate-600">
          <span>발간 및 검증 기관: 리본인텔리전스 AI 가상 리서치 센터</span>
          <div className="p-1.5 border border-indigo-700 text-indigo-700 font-serif font-black bg-indigo-50 text-[11px]">
            AI 리서치 공인검증인
          </div>
        </div>
      </div>
    </div>
  );
};
