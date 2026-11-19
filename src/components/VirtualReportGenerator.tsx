// src/components/VirtualReportGenerator.tsx
// 신규 종목 특정 시점(Point-in-Time) AI 애널리스트 리포트 생성 & 사후 적중률 검증기

import React, { useState, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  STOCK_PRESETS,
  StockPreset,
  VirtualReport,
  ReportMode,
  TargetPriceBand,
  FutureSensitivityScenario,
  generateVirtualReport,
  getAvailableChampionAnalysts,
  inferSectorFromStockName,
  lookupStockByNameOrCode,
  searchStocksAutocomplete,
  generateDeterministicCode,
  KnownStockInfo,
  KNOWN_KOREAN_STOCKS
} from '../services/virtualReportEngine';
import { AnalystAwardReview } from '../data/awardsData';
import { ReportReconciliationView } from './ReportReconciliationView';
import { WhiteBoxModelPanel } from './WhiteBoxModelPanel';
import { FeatureVerificationDashboard } from './FeatureVerificationDashboard';
import { formatUpsidePct } from '../services/financialMathEngine';
import {
  Brain,
  Calendar,
  Building,
  Target,
  TrendingUp,
  FileDown,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  Award,
  Loader2,
  Check,
  Copy,
  ChevronRight,
  Search,
  Scale,
  Sliders,
  History,
  Zap,
  HelpCircle,
  Compass,
  Gauge,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';

interface Props {
  onNavigateToAwardsReview?: () => void;
}

const SECTOR_OPTIONS = [
  '소비재/유통/음식료',
  '반도체/IT/전자',
  '2차전지/배터리/소재',
  '바이오/제약/헬스케어',
  '자동차/모빌리티',
  '조선/중공업/방산',
  '플랫폼/게임/엔터',
  '금융/지주',
  '화학/철강/원자재',
  '건설/부동산/인프라'
];

export const VirtualReportGenerator: React.FC<Props> = ({ onNavigateToAwardsReview }) => {
  const championAnalysts = getAvailableChampionAnalysts();
  
  // Navigation SubTab: 'verification' (8대 기능 검증 매트릭스 & 시나리오) vs 'reconciliation' (시계열 롤링 비교 대사기) vs 'generator' (리포트 단건 생성) vs 'whitebox' (화이트박스 모델러)
  const [subTab, setSubTab] = useState<'generator' | 'reconciliation' | 'whitebox' | 'verification'>('generator');

  // Dual Report Mode: 'future' (미래 예측) vs 'backtest' (과거 시점 백테스트)
  const [reportMode, setReportMode] = useState<ReportMode>('backtest');

  // Selection Mode: 'preset' or 'custom'
  const [stockMode, setStockMode] = useState<'preset' | 'custom'>('preset');

  // Preset State: 사용자 권고에 따라 최신 시점 2026-11-05 기본 설정 (또는 2026-03-31 시점 격리 선택 가능)
  const alteogenPreset = STOCK_PRESETS.find(p => p.code === '196170') || STOCK_PRESETS[0];
  const [selectedStock, setSelectedStock] = useState<StockPreset>(alteogenPreset);
  const [selectedPresetDate, setSelectedPresetDate] = useState<string>('2026-11-05');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Custom Stock State
  const [customStockName, setCustomStockName] = useState<string>('알테오젠');
  const [customStockCode, setCustomStockCode] = useState<string>('196170');
  const [customSector, setCustomSector] = useState<string>('바이오/제약/헬스케어');
  const [customDate, setCustomDate] = useState<string>('2026-11-05');
  const [stockSuggestions, setStockSuggestions] = useState<KnownStockInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Analyst Selection State: 한국투자증권 한유정 애널리스트
  const [selectedAnalystId, setSelectedAnalystId] = useState<string>('winner_overall_han');

  // Execution State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [report, setReport] = useState<VirtualReport | null>(null);
  
  // PDF & Action State
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const printableReportRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stock name change handler with auto-ticker and auto-sector synchronization
  const handleCustomStockNameChange = (val: string) => {
    setCustomStockName(val);

    // 1. 자동완성 목록 검색
    const matches = searchStocksAutocomplete(val);
    setStockSuggestions(matches);
    setShowSuggestions(matches.length > 0 && val.trim().length > 0);

    // 2. 종목명 또는 티커 코드 사전 조회
    const found = lookupStockByNameOrCode(val);
    if (found) {
      setCustomStockCode(found.code);
      setCustomSector(found.sector);
      if (found.recommendedAnalystId) {
        setSelectedAnalystId(found.recommendedAnalystId);
      }
    } else if (val.trim().length >= 2) {
      // 미등록 종목일 경우 고유 6자리 결정론적 티커 코드 및 섹터 자동 생성 (이전 종목 코드 잔류 방지)
      setCustomStockCode(generateDeterministicCode(val));
      setCustomSector(inferSectorFromStockName(val));
    } else if (val.trim().length === 0) {
      setCustomStockCode('');
    }
  };

  // 자동완성 추천 또는 퀵 칩 선택 시 실행
  const handleSelectSuggestedStock = (stock: KnownStockInfo) => {
    setCustomStockName(stock.name);
    setCustomStockCode(stock.code);
    setCustomSector(stock.sector);
    if (stock.recommendedAnalystId) {
      setSelectedAnalystId(stock.recommendedAnalystId);
    }
    setShowSuggestions(false);
  };

  // 티커 코드 수동 변경 시 (역방향 종목명/섹터 자동 동기화 지원)
  const handleCustomStockCodeChange = (codeVal: string) => {
    setCustomStockCode(codeVal);
    if (codeVal.trim().length === 6) {
      const match = lookupStockByNameOrCode(codeVal);
      if (match) {
        setCustomStockName(match.name);
        setCustomSector(match.sector);
        if (match.recommendedAnalystId) {
          setSelectedAnalystId(match.recommendedAnalystId);
        }
      }
    }
  };

  // Preset selection handler
  const handleSelectPreset = (preset: StockPreset) => {
    setSelectedStock(preset);
    setSelectedPresetDate(preset.historicalPoints[0].asOfDate);
    setSelectedAnalystId(preset.defaultAnalystId);
  };

  // Run report generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep(1);

    const isCustom = stockMode === 'custom';
    const targetStockCode = isCustom ? customStockCode || '035720' : selectedStock.code;
    const targetStockName = isCustom ? customStockName || '임의 신규 종목' : selectedStock.name;
    const targetSector = isCustom ? customSector : selectedStock.sector;
    const asOfDate = isCustom ? customDate : selectedPresetDate;

    // Simulation of 4-step pipeline for transparency
    setTimeout(() => setGenerationStep(2), 500);
    setTimeout(() => setGenerationStep(3), 1000);
    setTimeout(async () => {
      setGenerationStep(4);
      try {
        const result = await generateVirtualReport({
          stockCode: targetStockCode,
          stockName: targetStockName,
          sector: targetSector,
          asOfDate,
          analystId: selectedAnalystId,
          mode: reportMode
        });
        setReport(result);
        if (reportMode === 'future') {
          showToast(`${targetStockName} 2026~2027 AI 미래 예측 리포트 및 목표가 밴드 도출 완료!`);
        } else {
          showToast(`${targetStockName} AI 가상 리포트 및 사후 적중률 검증 완료!`);
        }
      } catch (err) {
        console.error(err);
        showToast('리포트 생성 중 오류가 발생했습니다.');
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };

  // Auto-generate initial report on first load
  useEffect(() => {
    handleGenerate();
  }, []);

  // PDF Download Handler
  const handleDownloadPdf = async () => {
    if (!printableReportRef.current || !report) return;
    setIsDownloadingPdf(true);

    try {
      const element = printableReportRef.current;
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

      pdf.save(`AI_Report_${report.stockName}_${report.asOfDate}_${report.analyst.name}.pdf`);
      showToast('공식 AI 리서치 리포트 PDF가 성공적으로 저장되었습니다.');
    } catch (e) {
      console.error('PDF error:', e);
      showToast('PDF 생성 중 오류가 발생했습니다. 브라우저 인쇄를 이용해 주세요.');
    } finally {
      setIsDownloadingPdf(false);
      if (printableReportRef.current) printableReportRef.current.style.display = 'none';
    }
  };

  const handleCopySummary = () => {
    if (!report) return;
    const text = `[${report.reportTitle}]\n담당: ${report.analyst.name} (${report.analyst.brokerName})\n기준일: ${report.asOfDate}\n목표주가: ${report.targetPrice.toLocaleString()}원 (상승여력: ${formatUpsidePct(report.upsidePct)})\n투자의견: ${report.rating}\n사후 백테스트: ${report.backtest.verdictBadge} (DART 가중오차율 ${report.backtest.weightedErrorRatePct}%)\n\n${report.executiveSummary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('리포트 요약이 클립보드에 복사되었습니다.');
  };

  const selectedAnalyst = championAnalysts.find(a => a.id === selectedAnalystId) || championAnalysts[0];

  const filteredPresets = STOCK_PRESETS.filter(p => 
    p.name.includes(searchQuery) || p.code.includes(searchQuery) || p.sector.includes(searchQuery)
  );

  return (
    <div className="space-y-8 pb-20 animate-fade-in text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-indigo-400/30 text-sm font-semibold animate-bounce">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Console Subtab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 px-2">
          <Scale size={16} className="text-indigo-400" />
          <span className="text-xs font-bold text-white">가상 리서치 센터 통합 분석 뷰:</span>
          <span className="text-[11px] text-slate-400 hidden md:inline">
            {subTab === 'verification'
              ? 'AI 가상 리포트 8대 핵심 기능 검증 매트릭스 & 시나리오 슬롯 관리'
              : subTab === 'reconciliation'
              ? '알테오젠 첨부 PDF 2종 롤링 검증 활성'
              : subTab === 'whitebox'
              ? 'DART 온톨로지 출발점 & DCF 바이오 파라미터 화이트박스 모델'
              : '임의 신규 종목 리포트 발간 및 백테스트'}
          </span>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs shrink-0 flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setSubTab('verification')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'verification'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 size={14} className={subTab === 'verification' ? 'text-cyan-300' : 'text-slate-400'} />
            <span>✅ 기능 검증 &amp; 시나리오</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 font-bold ml-0.5">
              8대 모듈
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('reconciliation')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'reconciliation'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale size={14} className={subTab === 'reconciliation' ? 'text-amber-300' : 'text-slate-400'} />
            <span>⚖️ 시계열 롤링 비교 대사기</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold ml-0.5">
              알테오젠
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('whitebox')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'whitebox'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={14} className={subTab === 'whitebox' ? 'text-amber-300' : 'text-slate-400'} />
            <span>🔬 화이트박스 금융 모델러</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-300 font-bold ml-0.5">
              100% 회계검증
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('generator')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'generator'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain size={14} className={subTab === 'generator' ? 'text-amber-300' : 'text-slate-400'} />
            <span>🔮 리포트 단건 발간 &amp; 시뮬레이터</span>
          </button>
        </div>
      </div>

      {subTab === 'verification' ? (
        <FeatureVerificationDashboard
          onApplyScenario={(scenarioParams) => {
            showToast(`시나리오 파라미터가 적용되었습니다. (전환율 ${(scenarioParams.scConversionRate * 100).toFixed(1)}%, 로열티 ${(scenarioParams.royaltyRate * 100).toFixed(1)}%)`);
            setSubTab('whitebox');
          }}
          onNavigateToReport={() => setSubTab('generator')}
          onNavigateToWhiteBox={() => setSubTab('whitebox')}
        />
      ) : subTab === 'reconciliation' ? (
        <ReportReconciliationView 
          onBackToGenerator={() => setSubTab('generator')}
          onOpenWhiteBox={() => setSubTab('whitebox')}
        />
      ) : subTab === 'whitebox' ? (
        <WhiteBoxModelPanel
          onApplyParametersToReport={(_params, evaluated) => {
            showToast(`화이트박스 파라미터가 적용되었습니다: 목표주가 ${evaluated.baseTargetPrice.toLocaleString()}원`);
            setSubTab('reconciliation');
          }}
        />
      ) : (
        <>
          {/* 1. Header Hero Banner */}
          <div className="relative rounded-2xl p-6 sm:p-8 overflow-hidden bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Brain size={14} className="text-indigo-400" />
                    Point-in-Time AI Research Engine
                  </span>
                  <span className="text-xs text-slate-400">
                    10대 챔피언 분석 모델 × DART 온톨로지 지식 그래프
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  신규 종목 특정 시점(Point-in-Time) AI 리포트 생성 & 사후 적중률 검증기
                </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              분석하고자 하는 <strong>임의의 신규 종목</strong>과 <strong>과거 특정 시점(Point-in-Time)</strong>을 지정하고 <strong>챔피언 애널리스트 모델</strong>을 선택하면, 
              당시 공시 데이터만을 기반으로 가상 리포트를 발간하고 이후 <strong>실제 실적 및 주가와의 사후 적중률을 정밀 검증</strong>합니다.
            </p>
          </div>

          {onNavigateToAwardsReview && (
            <button
              onClick={onNavigateToAwardsReview}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer self-start lg:self-center"
            >
              <Award size={15} className="text-amber-400" />
              <span>챔피언 10인 공식 심사평 보기</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Interactive Control Console */}
      <section className="bg-slate-900/90 rounded-2xl p-5 sm:p-7 border border-slate-800 shadow-lg space-y-6">
        {/* Mode Selector Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/90 border border-indigo-500/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Compass size={16} className="text-indigo-400" />
                리포트 발간 목적 & 분석 모드 선택
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                reportMode === 'future'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {reportMode === 'future' ? '2026~2027 선행 추정 모드' : '사후 적중률 실증 백테스트'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {reportMode === 'future'
                ? '과거 리포트와 DART 시계열을 학습하여 향후 12개월(2026~2027) 4개 분기 실적 추정표 및 Bull/Base/Bear 목표주가 밴드를 도출합니다.'
                : '과거 특정 시점(Point-in-Time) 공시만으로 리포트를 가상 발간하고, 이후 실제 주가 및 DART 확정 실적과의 적중률을 정밀 검증합니다.'}
            </p>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs shrink-0 self-start lg:self-center">
            <button
              type="button"
              onClick={() => {
                setReportMode('future');
                if (stockMode === 'custom') setCustomDate('2026-11-05');
              }}
              className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                reportMode === 'future'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles size={14} className={reportMode === 'future' ? 'text-amber-300' : 'text-slate-400'} />
              <span>🔮 AI 미래 예측 리포트 (2026~2027)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setReportMode('backtest');
                if (stockMode === 'custom') setCustomDate('2024-12-31');
              }}
              className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                reportMode === 'backtest'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History size={14} className={reportMode === 'backtest' ? 'text-amber-200' : 'text-slate-400'} />
              <span>⏳ 과거 시점 실증 백테스트</span>
            </button>
          </div>
        </div>

        {/* Console Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* A. 종목 선택 (Preset vs Custom Tabs) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Building size={14} />
                1. 분석 대상 종목 선택
              </label>
              
              {/* Mode Toggle Pills */}
              <div className="inline-flex p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setStockMode('preset')}
                  className={`px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                    stockMode === 'preset'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  대표 종목(15선)
                </button>
                <button
                  type="button"
                  onClick={() => setStockMode('custom')}
                  className={`px-2.5 py-1 rounded-md transition font-medium cursor-pointer flex items-center gap-1 ${
                    stockMode === 'custom'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles size={11} className="text-amber-400" />
                  <span>신규 직접입력</span>
                </button>
              </div>
            </div>

            {/* Mode 1: Preset Grid */}
            {stockMode === 'preset' ? (
              <div className="space-y-2">
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="프리셋 종목/코드 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                  {filteredPresets.map((p) => (
                    <button
                      key={p.code}
                      onClick={() => handleSelectPreset(p)}
                      className={`text-left p-2 rounded-lg transition cursor-pointer border ${
                        selectedStock.code === p.code
                          ? 'bg-indigo-600/30 text-white border-indigo-500 font-bold shadow-xs'
                          : 'bg-slate-900/40 text-slate-300 border-slate-800/80 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-semibold truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.code} · {p.sector.split('/')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Mode 2: Custom Stock Input */
              <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/40 space-y-3 text-xs">
                {/* 퀵 종목 선택 칩 */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">
                    인기 신규 분석 종목 (클릭 시 코드·섹터 즉시 연동):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { name: '대웅제약', code: '069620', sector: '바이오/제약/헬스케어', market: 'KOSPI' as const, recommendedAnalystId: 'winner_bio_shin_minsu' },
                      { name: '유한양행', code: '000100', sector: '바이오/제약/헬스케어', market: 'KOSPI' as const, recommendedAnalystId: 'winner_bio_shin_minsu' },
                      { name: '한미약품', code: '128940', sector: '바이오/제약/헬스케어', market: 'KOSPI' as const, recommendedAnalystId: 'winner_bio_shin_minsu' },
                      { name: '두산에너빌리티', code: '034020', sector: '조선/중공업/방산', market: 'KOSPI' as const, recommendedAnalystId: 'winner_ship_lee_jiho' },
                      { name: '하이브', code: '352820', sector: '플랫폼/게임/엔터', market: 'KOSPI' as const, recommendedAnalystId: 'winner_platform_ji_inhae' },
                      { name: '루닛', code: '328130', sector: '바이오/제약/헬스케어', market: 'KOSDAQ' as const, recommendedAnalystId: 'winner_bio_shin_minsu' },
                    ].map((stockChip) => (
                      <button
                        key={stockChip.code}
                        type="button"
                        onClick={() => handleSelectSuggestedStock(stockChip)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border transition cursor-pointer ${
                          customStockName === stockChip.name
                            ? 'bg-indigo-600 text-white border-indigo-400 font-bold'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {stockChip.name} <span className="text-[9px] opacity-70">({stockChip.code})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 종목명 입력창 및 자동완성 드롭다운 */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-300 font-semibold">
                      신규 종목명 (어떤 상장사든 가능)
                    </label>
                    <span className="text-[10px] text-indigo-400">
                      * 입력 시 종목코드 및 섹터 자동 변경
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="예: 대웅제약, 유한양행, 에코프로, 한미약품 등"
                    value={customStockName}
                    onChange={(e) => handleCustomStockNameChange(e.target.value)}
                    onFocus={() => {
                      if (stockSuggestions.length > 0) setShowSuggestions(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:border-indigo-500 focus:outline-none"
                  />

                  {/* 자동완성 드롭다운 */}
                  {showSuggestions && stockSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-slate-900 border border-indigo-500/50 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800">
                      {stockSuggestions.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleSelectSuggestedStock(item)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-950/60 flex items-center justify-between transition cursor-pointer text-slate-200"
                        >
                          <div>
                            <span className="font-bold text-white">{item.name}</span>
                            <span className="ml-2 font-mono text-[11px] text-indigo-300">[{item.code}]</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {item.sector.split('/')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 종목코드 & 섹터 2열 그리드 */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] text-slate-400">종목코드 (자동 연동)</label>
                      {customStockCode && (
                        <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
                          <Check size={10} /> 동기화됨
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="예: 069620"
                      value={customStockCode}
                      onChange={(e) => handleCustomStockCodeChange(e.target.value)}
                      className="w-full bg-slate-900 border border-indigo-500/60 rounded px-2 py-1 text-white font-mono text-xs font-bold text-indigo-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">산업 섹터 (자동 감지)</label>
                    <select
                      value={customSector}
                      onChange={(e) => setCustomSector(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-white text-[11px]"
                    >
                      {SECTOR_OPTIONS.map((sec) => (
                        <option key={sec} value={sec}>{sec.split('/')[0]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-2 rounded bg-indigo-950/40 border border-indigo-500/20 text-[10px] text-indigo-300 flex items-center gap-1.5">
                  <Zap size={12} className="text-amber-400 shrink-0" />
                  <span>종목명 입력 시 공시 6자리 코드·섹터·10인 챔피언 모델이 실시간 자동 동기화됩니다.</span>
                </div>
              </div>
            )}
          </div>

          {/* B. 기준 시점(Point-in-Time Date) 선택 */}
          <div className="space-y-2.5">
            <label className={`block text-xs font-bold flex items-center gap-1.5 ${
              reportMode === 'future' ? 'text-purple-300' : 'text-amber-300'
            }`}>
              <Calendar size={14} />
              {reportMode === 'future' ? '2. 미래 예측 발간 기준일 (2026~2027)' : '2. 분석 기준 일자 (Point-in-Time)'}
            </label>
            <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">
                {reportMode === 'future'
                  ? '🔮 2026~2027 선행 추정 기준 시점 설정:'
                  : '⏳ 사후 검증(백테스트)을 위한 과거 시점 설정:'}
              </span>

              {reportMode === 'future' ? (
                /* Future Mode Date Chips */
                <div className="space-y-2">
                  <div className="space-y-1.5">
                    {[
                      { date: '2026-11-05', label: '2026.11 기준 (현재 시점 선행 예측)', desc: '12M Forward ~2027.11' },
                      { date: '2026-12-31', label: '2026.12 결산 기준 (2027 선행)', desc: '12M Forward ~2027.12' },
                      { date: '2027-03-31', label: '2027.03 1Q 기준 (중기 선행)', desc: '12M Forward ~2028.03' }
                    ].map((item) => (
                      <button
                        key={item.date}
                        type="button"
                        onClick={() => {
                          if (stockMode === 'preset') {
                            setSelectedPresetDate(item.date);
                          } else {
                            setCustomDate(item.date);
                          }
                        }}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${
                          (stockMode === 'preset' ? selectedPresetDate === item.date : customDate === item.date)
                            ? 'bg-purple-500/20 border-purple-500/60 text-purple-200 font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-200">{item.label}</div>
                          <div className="text-[10px] text-purple-400">{item.desc}</div>
                        </div>
                        <span className="font-mono text-[11px] text-slate-300">{item.date}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1">
                    <label className="block text-[10px] text-slate-400 mb-1">예측 기준 일자 직접 지정</label>
                    <input
                      type="date"
                      value={stockMode === 'preset' ? selectedPresetDate : customDate}
                      onChange={(e) => {
                        if (stockMode === 'preset') {
                          setSelectedPresetDate(e.target.value);
                        } else {
                          setCustomDate(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              ) : (
                /* Backtest Mode Date Chips */
                stockMode === 'preset' ? (
                  <div className="space-y-1.5">
                    {selectedStock.historicalPoints.map((pt) => (
                      <label
                        key={pt.asOfDate}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          selectedPresetDate === pt.asOfDate
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-bold'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="asOfDate"
                            checked={selectedPresetDate === pt.asOfDate}
                            onChange={() => setSelectedPresetDate(pt.asOfDate)}
                            className="accent-amber-500"
                          />
                          <span>{pt.asOfDate} 기준</span>
                        </div>
                        <span className="font-mono text-[11px]">
                          당시 주가 {pt.currentPriceAtDate.toLocaleString()}원
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      {['2026-03-31', '2025-12-31', '2025-06-30', '2024-12-31'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setCustomDate(d)}
                          className={`p-2 rounded border text-center transition cursor-pointer ${
                            customDate === d
                              ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>

                    <div className="pt-1">
                      <label className="block text-[10px] text-slate-400 mb-1">사용자 지정 일자 직접 선택</label>
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                )
              )}

              <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
                {reportMode === 'future'
                  ? '※ AI가 현재까지의 DART 공시 및 증권사 리포트 온톨로지를 학습하여 향후 12개월(2027년까지)의 4개 분기 실적 추정표 및 Bull/Base/Bear 목표주가 밴드를 도출합니다.'
                  : '※ 이 날짜 이후의 공시 및 주가는 분석 당시에는 격리되며, 사후 백테스트 검증 섹션에서만 실증 대조군으로 사용됩니다.'}
              </p>
            </div>
          </div>

          {/* C. 챔피언 애널리스트 모델 선택 */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Award size={14} />
              3. 담당 챔피언 애널리스트 선택 (10인 중 택1)
            </label>
            <select
              value={selectedAnalystId}
              onChange={(e) => setSelectedAnalystId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {championAnalysts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.brokerName} | {a.sector} - {a.score}점)
                </option>
              ))}
            </select>

            {/* Selected Analyst Badge & Signature Profile */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{selectedAnalyst.name} 연구원</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                  종합 평점 {selectedAnalyst.score}점
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                <strong>시그니처:</strong> {selectedAnalyst.summaryKeywords.join(', ')}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {selectedAnalyst.fullReport.representativeReport.title}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            <span>선택한 챔피언의 고유 밸류에이션 프레임워크와 $1Q(20\%)+2Q(30\%)+3Q(50\%)$ DART 오차율 모델이 자동 결합됩니다.</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Point-in-Time AI 파이프라인 연산 중...</span>
              </>
            ) : (
              <>
                <Brain size={16} />
                <span>AI 가상 리포트 발간 및 사후 적중률 검증 실행</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Step-by-step progress indicator when generating */}
        {isGenerating && (
          <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/40 space-y-2 animate-fade-in">
            <div className="text-xs font-semibold text-indigo-300 flex items-center justify-between">
              <span>Point-in-Time AI 파이프라인 단계별 연산 현황</span>
              <span>{generationStep} / 4 단계</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-[11px]">
              <div className={`p-2 rounded border text-center ${generationStep >= 1 ? 'bg-indigo-950 border-indigo-500 text-indigo-200 font-bold' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                1. DART 재무 격리 수집
              </div>
              <div className={`p-2 rounded border text-center ${generationStep >= 2 ? 'bg-indigo-950 border-indigo-500 text-indigo-200 font-bold' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                2. 온톨로지 밸류체인 매핑
              </div>
              <div className={`p-2 rounded border text-center ${generationStep >= 3 ? 'bg-indigo-950 border-indigo-500 text-indigo-200 font-bold' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                3. 챔피언 가중 추정 연산
              </div>
              <div className={`p-2 rounded border text-center ${generationStep >= 4 ? 'bg-indigo-950 border-indigo-500 text-indigo-200 font-bold' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                4. 사후 주가·실적 교차검증
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Report Output Section */}
      {report && (
        <section className="space-y-6 animate-fade-in">
          {/* Top Report Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                발간 완료: {report.publishedAt}
              </span>
              <span className="text-xs text-slate-400">
                문서 ID: <span className="font-mono text-slate-300">{report.id}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>요약 복사</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>PDF 패키징 중...</span>
                  </>
                ) : (
                  <>
                    <FileDown size={14} />
                    <span>정규 4페이지 스타일 PDF 다운로드</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Report Viewer Main Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-8 shadow-xl">
            {/* Header: Title & Analyst Credit */}
            <div className="border-b border-slate-800 pb-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                    report.mode === 'future'
                      ? 'text-purple-300 bg-purple-500/15 border-purple-500/30'
                      : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                  }`}>
                    {report.mode === 'future' ? '🔮 2026~2027 AI 미래 예측 리포트' : '⏳ Point-in-Time 실증 백테스트'}
                  </span>
                  <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded">
                    {report.sector}
                  </span>
                  <span className="text-xs text-indigo-300 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {report.stockCode}
                  </span>
                  <span className="text-xs text-slate-500">|</span>
                  <span className="text-xs text-slate-400">
                    분석 기준일: <strong className="text-slate-200 font-mono">{report.asOfDate}</strong>
                  </span>
                </div>

                <div className="text-xs text-slate-400">
                  {report.isFactBasedOnly ? '분석 주체: ' : '담당 챔피언 애널리스트: '}
                  <strong className="text-amber-300">{report.analyst.name}</strong> ({report.analyst.brokerName})
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {report.reportTitle}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {report.executiveSummary}
              </p>
            </div>

            {/* Top 4 Key Valuation Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">
                  {report.mode === 'future' ? '발간 기준 주가' : '기준일 당시 주가'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-200 font-mono">
                  {report.currentPrice.toLocaleString()}원
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">{report.asOfDate} 종가</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 shadow-inner">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-indigo-300 font-semibold">
                    {report.isFactBasedOnly ? '수식 산출 목표가 (Base)' : report.mode === 'future' ? '기준 목표주가 (Base)' : 'AI 추정 목표주가'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                    12M Forward
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-indigo-300 font-mono">
                  {report.targetPrice.toLocaleString()}원
                </span>
                <div className="mt-1 space-y-0.5">
                  <span className={`block text-[10px] font-bold ${report.upsidePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    상승여력 {formatUpsidePct(report.upsidePct)} ({report.rating})
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    🎯 목표 시계: <strong className="text-slate-200 font-mono">~{report.backtest.targetHorizonDate}</strong>
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">타깃 밸류에이션 승수</span>
                <span className="text-sm sm:text-base font-bold text-amber-300 block truncate" title={report.valuationMultiple}>
                  {report.valuationMultiple.slice(0, 24)}...
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">
                  {report.isFactBasedOnly ? '보도 로열티 2% & 파이프라인 합산' : '챔피언 고유 멀티플'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">
                  {report.isFactBasedOnly
                    ? '가치평가 산출 방식'
                    : report.mode === 'future'
                    ? 'AI 예측 모델 신뢰도'
                    : 'DART 실적 정합도 점수'}
                </span>
                <span className={`text-base sm:text-lg font-black font-mono ${report.isFactBasedOnly ? 'text-indigo-400' : 'text-emerald-400'}`}>
                  {report.isFactBasedOnly
                    ? '100% 동적 DCF 수식'
                    : `${report.backtest.dartAlignmentScore}점`}
                </span>
                <span className="block text-[10px] text-slate-500 mt-1 truncate">
                  {report.isFactBasedOnly
                    ? (report.halozymeDisputeStatus ? `할로자임: ${report.halozymeDisputeStatus}` : '동적 수식 연산')
                    : report.mode === 'future'
                    ? '10대 챔피언 가중 융합'
                    : `가중오차율 ${report.backtest.weightedErrorRatePct}%`}
                </span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 🎯 [NEW] 목표주가 3대 시나리오 밴드 게이지 (Bull / Base / Bear) */}
            {/* ======================================================== */}
            {report.targetPriceBand && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Gauge size={18} className="text-indigo-400" />
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      AI 목표주가 3대 시나리오 밴드 (Bull / Base / Bear Scenario Band)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    12개월 선행 시계: <strong className="text-indigo-300">{report.asOfDate} ~ {report.backtest.targetHorizonDate}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. Bull Scenario */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp size={15} className="text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-300">Bull (강세 / 낙관)</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {report.isFactBasedOnly ? '낙관 밴드 (전환율 50% · 로열티 2.5%)' : '확률 30%'}
                      </span>
                    </div>
                    <div className="font-mono">
                      <div className="text-2xl font-black text-emerald-400">
                        {report.targetPriceBand.bull.toLocaleString()}원
                      </div>
                      <div className="text-xs text-emerald-300/80 font-bold">
                        상승여력 {formatUpsidePct(report.targetPriceBand.bullUpsidePct)}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                      {report.targetPriceBand.bullRationale}
                    </p>
                  </div>

                  {/* 2. Base Scenario */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border-2 border-indigo-500/60 space-y-2 shadow-lg shadow-indigo-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Target size={15} className="text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-200">Base (기본 가설 시나리오)</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/50">
                        {report.isFactBasedOnly ? '기본 밴드 (가이던스 35% · 보도 로열티 2.0%)' : '확률 55%'}
                      </span>
                    </div>
                    <div className="font-mono">
                      <div className="text-2xl font-black text-indigo-300">
                        {report.targetPriceBand.base.toLocaleString()}원
                      </div>
                      <div className="text-xs text-indigo-400 font-bold">
                        상승여력 {formatUpsidePct(report.targetPriceBand.baseUpsidePct)} ({report.rating})
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-relaxed border-t border-slate-800/80 pt-2">
                      {report.targetPriceBand.baseRationale}
                    </p>
                  </div>

                  {/* 3. Bear Scenario */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <TrendingDown size={15} className="text-rose-400" />
                        <span className="text-xs font-bold text-rose-300">Bear (약세 / 보수)</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {report.isFactBasedOnly ? '보수 밴드 (전환율 20% · 에스크로 1.6%)' : '확률 15%'}
                      </span>
                    </div>
                    <div className="font-mono">
                      <div className="text-2xl font-black text-rose-300">
                        {report.targetPriceBand.bear.toLocaleString()}원
                      </div>
                      <div className="text-xs text-rose-400 font-bold">
                        {formatUpsidePct(report.targetPriceBand.bearUpsidePct)} (하방지지선)
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                      {report.targetPriceBand.bearRationale}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 1: 분기 실적 추정 모델 표 */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-400" />
                    {report.isFactBasedOnly
                      ? '1. DART 공식 확정 실적 대사표 (Look-ahead bias 원천 배제: 과거 공시치만 표기)'
                      : report.mode === 'future'
                      ? '1. 2026~2027 4개 분기 선행 실적 추정 모델 (12M Forward Financial Estimates)'
                      : '1. DART 분기별 실적 추정 모델 ($1Q(20\\%) + 2Q(30\\%) + 3Q(50\\%)$ 가중 평가)'}
                  </h3>
                  {report.isFactBasedOnly && (
                    <p className="text-[11px] text-amber-300/90 mt-0.5">
                      ※ 3Q26(11/12 공시예정) 및 이후 미공시 분기는 추정 오염 및 Look-ahead bias를 원천 차단하기 위해 일체 기재하지 않고, DART 확정 공시된 과거 분기(2025 FY, 1Q26, 2Q26)만 표기합니다.
                    </p>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono self-end sm:self-auto">단위: 억원</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">구분</th>
                      <th className="py-2.5 px-3 font-semibold text-right">추정 매출액</th>
                      <th className="py-2.5 px-3 font-semibold text-right">추정 영업이익</th>
                      <th className="py-2.5 px-3 font-semibold text-right">추정 순이익</th>
                      <th className="py-2.5 px-3 font-semibold text-right">추정 영업익률(OPM)</th>
                      {report.mode === 'future' ? (
                        <th className="py-2.5 px-4 font-semibold text-right text-purple-300">선행 추정 근거 및 가설</th>
                      ) : (
                        <>
                          <th className="py-2.5 px-3 font-semibold text-right text-emerald-400">실제 확정 영업익(DART)</th>
                          <th className="py-2.5 px-4 font-semibold text-right text-amber-300">오차율(%)</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {report.financialEstimates.map((row) => (
                      <tr key={row.quarter} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-sans font-medium text-slate-200">{row.quarter}</td>
                        <td className="py-2.5 px-3 text-right text-slate-300">{row.estimatedSales.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right text-indigo-300 font-bold">{row.estimatedOp.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right text-slate-300">{row.estimatedNp.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right text-slate-400">{row.opmPct}%</td>
                        {report.mode === 'future' ? (
                          <td className="py-2.5 px-4 text-right font-sans text-[11px] text-purple-300 font-medium">
                            {row.quarter.includes('4Q') ? '계절적 성수기 및 신규 수주 온기 반영' :
                             row.quarter.includes('1Q') ? '비수기 방어 및 믹스 고도화' :
                             row.quarter.includes('2Q') ? '해외 침투 가속 및 원가 스프레드 확대' :
                             row.quarter.includes('3Q') ? 'CAPA 증설 물량 본격 램프업' :
                             '연간 실적 가이던스 상회 전망'}
                          </td>
                        ) : (
                          <>
                            <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                              {row.actualOp !== undefined ? (
                                row.actualOp.toLocaleString()
                              ) : (
                                <span className="text-[10px] text-amber-300 font-sans font-normal px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                                  미공시 선행추정
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 text-right text-amber-300 font-bold">
                              {row.opErrorPct !== undefined ? (
                                `${row.opErrorPct}%`
                              ) : (
                                <span className="text-[10px] text-slate-500 font-sans font-normal">
                                  대사 비대상 (공시 전)
                                </span>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: 3대 핵심 투자 가설 */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Layers size={16} className="text-blue-400" />
                2. 챔피언 시그니처 3대 핵심 투자 가설 (Investment Thesis)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.theses.map((th) => (
                  <div key={th.number} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold flex items-center justify-center font-mono">
                        {th.number}
                      </span>
                      <h4 className="text-xs font-bold text-slate-100 truncate">{th.headline}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {th.argument}
                    </p>
                    <div className="text-[10px] text-indigo-400/80 bg-indigo-950/40 px-2 py-1 rounded border border-indigo-500/20 truncate">
                      {th.ontologyLink}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: 하방 리스크 및 역발상 인사이트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/20 space-y-1.5">
                <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  하방 리스크 및 위험 요소 분석
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {report.downsideRisk}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/20 space-y-1.5">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  시장 기여 및 반(反)관행 역발상 통찰
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {report.contrarianInsight}
                </p>
              </div>
            </div>

            {/* ======================================================== */}
            {/* Section 4: 🎯 [사후 적중률 실증 백테스트 vs 미래 전망 모니터링] */}
            {/* ======================================================== */}
            {report.mode === 'future' ? (
              /* Future Mode Section 4: 12개월 선행 모니터링 및 감응도 분석 */
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-950/50 via-slate-950 to-indigo-950/50 border-2 border-purple-500/40 space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <Compass size={20} className="text-purple-400" />
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        🔮 향후 12개월 선행 전망 & 시나리오 감응도 모니터링 (Forward Milestone Tracker)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        발간일({report.asOfDate})부터 12개월 선행 시계(~{report.backtest.targetHorizonDate}) 동안 추적할 시나리오별 감응도 및 핵심 트리거
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border self-start sm:self-auto bg-purple-500/20 text-purple-300 border-purple-500/40">
                    {report.backtest.verdictBadge}
                  </span>
                </div>

                {/* Scenario Probability Bar */}
                <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold">시나리오 가중치 분포:</span>
                    <span className="font-mono text-purple-300 text-[11px]">
                      Bull 30% | Base 55% | Bear 15% (총 100%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div style={{ width: '30%' }} className="bg-emerald-500 transition-all" title="Bull 30%" />
                    <div style={{ width: '55%' }} className="bg-indigo-500 transition-all" title="Base 55%" />
                    <div style={{ width: '15%' }} className="bg-rose-500 transition-all" title="Bear 15%" />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span className="text-emerald-400">Bull 30%</span>
                    <span className="text-indigo-300">Base 55% (타깃)</span>
                    <span className="text-rose-400">Bear 15%</span>
                  </div>
                </div>

                {/* Future Sensitivity Scenarios Table */}
                {report.sensitivityScenarios && (
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">시나리오</th>
                          <th className="py-2.5 px-3 font-semibold text-center">확률</th>
                          <th className="py-2.5 px-3 font-semibold text-right">예측 목표주가</th>
                          <th className="py-2.5 px-3 font-semibold text-right">상승여력</th>
                          <th className="py-2.5 px-4 font-semibold">핵심 달성 조건 및 매크로/실적 트리거</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {report.sensitivityScenarios.map((sc) => (
                          <tr key={sc.scenario} className="hover:bg-slate-900/40">
                            <td className="py-2.5 px-4 font-semibold text-slate-200">{sc.scenario}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-300">{sc.probabilityPct}%</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                              {sc.targetPrice.toLocaleString()}원
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold">
                              <span className={sc.upsidePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                {sc.upsidePct >= 0 ? `+${sc.upsidePct}%` : `${sc.upsidePct}%`}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-300 text-[11px] leading-relaxed">
                              {sc.triggerConditions}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* AI Research Center Forward Guidance Commentary */}
                <div className="p-3.5 bg-purple-950/30 rounded-xl border border-purple-500/30 text-xs text-slate-200 leading-relaxed font-sans">
                  <strong className="text-purple-300 block mb-1">■ AI 가상 리서치 센터 포워드 가이던스 소견:</strong>
                  {report.backtest.verdictSummary}
                </div>
              </div>
            ) : report.isFactBasedOnly ? (
              /* Fact-Based Mode Section 4: 주당가치 워터폴 가치 브리지 & 현재가 정당화 역산 매트릭스 */
              <div className="space-y-6">
                {/* 1. Waterfall Value Bridge Table */}
                {report.valueBridge && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border-2 border-indigo-500/40 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-500/30 pb-3">
                      <div className="flex items-center gap-2">
                        <Layers size={20} className="text-indigo-400" />
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-white">
                            4-A. 주당가치 워터폴 가치 브리지 (Waterfall Value Bridge)
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            키트루다SC 피크매출($28B) 및 보도 로열티(2.0%)부터 파이프라인 DCF, 노바티스 계약(500억), 순현금 및 주당 적정가치까지의 수식 체인
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-indigo-300 font-mono font-bold bg-indigo-500/20 px-2.5 py-1 rounded border border-indigo-400/30 self-start sm:self-auto">
                        오픈 수식 100% 동적 산출
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3 font-semibold text-center w-12">단계</th>
                            <th className="py-2.5 px-4 font-semibold">밸류에이션 평가 항목</th>
                            <th className="py-2.5 px-4 font-semibold text-right">총 가치 (억원)</th>
                            <th className="py-2.5 px-4 font-semibold text-right">주당 가치 (원)</th>
                            <th className="py-2.5 px-3 font-semibold text-right">비중(%)</th>
                            <th className="py-2.5 px-4 font-semibold">산출 공식 및 팩트 근거</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {report.valueBridge.map((step) => {
                            const isFinal = step.category === 'per_share';
                            const isEV = step.category === 'ev' || step.category === 'equity';
                            return (
                              <tr
                                key={step.stepOrder}
                                className={`transition-colors ${
                                  isFinal
                                    ? 'bg-emerald-950/40 hover:bg-emerald-950/60 font-bold'
                                    : isEV
                                    ? 'bg-indigo-950/30 hover:bg-indigo-950/50 font-semibold'
                                    : 'hover:bg-slate-900/40'
                                }`}
                              >
                                <td className="py-2.5 px-3 text-center text-slate-400 text-[11px]">
                                  {step.stepOrder}
                                </td>
                                <td className={`py-2.5 px-4 font-sans ${isFinal ? 'text-emerald-300 font-bold text-sm' : isEV ? 'text-indigo-200' : 'text-slate-200'}`}>
                                  {step.itemName}
                                </td>
                                <td className={`py-2.5 px-4 text-right font-mono ${isFinal ? 'text-emerald-400 font-black text-base' : isEV ? 'text-indigo-300 font-bold' : 'text-slate-300'}`}>
                                  {step.valueKrw.toLocaleString()}억
                                </td>
                                <td className={`py-2.5 px-4 text-right font-mono ${isFinal ? 'text-emerald-300 font-black text-base' : 'text-slate-300'}`}>
                                  {step.perShareKrw.toLocaleString()}원
                                </td>
                                <td className="py-2.5 px-3 text-right text-slate-400 text-[11px]">
                                  {step.shareOfTotalPct}%
                                </td>
                                <td className="py-2.5 px-4 font-sans text-slate-400 text-[11px]">
                                  {step.description}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. Reverse Engineering Matrix Table */}
                {report.reverseEngineering && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border-2 border-indigo-500/40 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-500/30 pb-3">
                      <div className="flex items-center gap-2">
                        <Scale size={20} className="text-indigo-400" />
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-white">
                            4-B. 현재 주가 정당화 역산 매트릭스 (Reverse Engineering Analysis)
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            현재 주가({report.currentPrice.toLocaleString()}원)를 정당화하기 위해 요구되는 SC 전환율과 로열티율의 수학적 조합
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-400/30 self-start sm:self-auto">
                        현재가 정당화 영역 하이라이트
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
                      <table className="w-full text-center text-xs">
                        <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3 font-semibold text-left">SC 전환율 \ 로열티율</th>
                            {report.reverseEngineering.royaltyRatesPct.map((r) => (
                              <th
                                key={r}
                                className={`py-2.5 px-3 font-semibold ${
                                  r === 2.0 ? 'text-amber-300 bg-amber-500/10' : ''
                                }`}
                              >
                                {r.toFixed(1)}% {r === 2.0 ? '(보도기준)' : ''}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {report.reverseEngineering.matrix.map((row, idx) => {
                            const conversionRatePct = row[0]?.conversionRatePct ?? 0;
                            return (
                              <tr key={idx} className="hover:bg-slate-900/40">
                                <td className="py-2.5 px-3 text-left font-bold text-slate-200 font-sans">
                                  {conversionRatePct}%
                                  {conversionRatePct === 35 && (
                                    <span className="ml-1 text-[10px] text-indigo-400 font-normal">
                                      (가이던스)
                                    </span>
                                  )}
                                </td>
                                {row.map((cell) => {
                                  const justifies = cell.justifiesCurrentPrice;
                                  return (
                                    <td
                                      key={cell.royaltyRatePct}
                                      className={`py-2 px-3 text-right font-mono transition-colors ${
                                        justifies
                                          ? 'bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30 shadow-inner'
                                          : cell.royaltyRatePct === 2.0
                                          ? 'bg-slate-900 text-slate-300'
                                          : 'text-slate-400'
                                      }`}
                                    >
                                      <div className="flex items-center justify-end gap-1">
                                        {justifies && <CheckCircle2 size={12} className="text-emerald-400" />}
                                        <span>{cell.impliedTargetPrice.toLocaleString()}원</span>
                                      </div>
                                      <div className="text-[10px] text-slate-400">
                                        {formatUpsidePct(cell.upsidePct)}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Market Implied Required Condition Card */}
                    <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-xs text-slate-200 leading-relaxed space-y-2">
                      <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                        <Sparkles size={16} />
                        현재 주가({report.currentPrice.toLocaleString()}원) 정당화 요구조건 및 시장 시사점
                      </div>
                      <p>
                        ■ <strong>보도 로열티율 2.0% 기준 요구 전환율:</strong> 키트루다SC 환자 처방 전환율 약{' '}
                        <strong className="text-emerald-400 font-mono text-sm underline decoration-emerald-400">
                          {report.reverseEngineering.requiredConversionAtReportedRoyalty}%
                        </strong>
                        에 도달해야 현재 시장 가격이 정당화됩니다.
                      </p>
                      <p className="text-slate-300 text-[11px]">
                        ■ <strong>가이던스 대조 통찰:</strong> MSD 공식 24개월 목표(30~40%)를 초과하므로, 현재 주가는
                        키트루다SC의 빠른 채택뿐만 아니라{' '}
                        <strong className="text-amber-300">노바티스(Novartis) 라이선스 계약(연간 500억원)</strong> 및{' '}
                        <strong className="text-indigo-300">다이이찌산쿄(엔허투 ADC SC), GSK, 바이오젠 등 추가 L/O 가치</strong>와{' '}
                        <strong>2028년 IV 특허 만료 후 SC 비중의 계단식 급증(60~80%)</strong>이 복합적으로 시장에 선반영되어 있음을 수학적으로 입증합니다.
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. Street Consensus Gap Comparison Card */}
                {report.consensusGap && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border-2 border-indigo-500/40 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-500/30 pb-3">
                      <div className="flex items-center gap-2">
                        <Scale size={20} className="text-amber-400" />
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-white">
                            4-C. 모델 산출가({report.targetPrice.toLocaleString()}원) vs 증권사 컨센서스(45~54만원) 괴리 비교 분석
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            보수적 정적 단일년도 DCF 모델과 시장 증권사의 동적 멀티이어(2028 IV 만료·2043 특허) 가정 차이 완전 규명
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-amber-300 font-mono font-bold bg-amber-500/20 px-2.5 py-1 rounded border border-amber-400/30 self-start sm:self-auto">
                        가정 대조 분석
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Left: Conservative Static DCF (This Model) */}
                      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold text-indigo-300">① 본 모형: 보수적 정적 DCF</span>
                          <span className="text-sm font-black font-mono text-indigo-300">
                            {report.consensusGap.conservativeDcf.targetPrice.toLocaleString()}원 ({formatUpsidePct(report.consensusGap.conservativeDcf.upsidePct)})
                          </span>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                          {report.consensusGap.conservativeDcf.assumptions.map((item, i) => (
                            <li key={i} className="leading-relaxed text-[11px] text-slate-300">{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: Street Consensus (Brokers) */}
                      <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-500/30 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold text-amber-300">② 시장 증권사 컨센서스 (평균 {report.consensusGap.streetConsensus.averageTargetPrice.toLocaleString()}원)</span>
                          <div className="flex gap-1.5 font-mono text-xs">
                            {report.consensusGap.streetConsensus.brokerTargets.map((b) => (
                              <span key={b.broker} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]">
                                {b.broker}: {b.targetPrice / 10000}만
                              </span>
                            ))}
                          </div>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                          {report.consensusGap.streetConsensus.keyDrivers.map((item, i) => (
                            <li key={i} className="leading-relaxed text-[11px] text-slate-300">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                      <strong className="text-amber-400 block mb-1">■ 밸류에이션 괴리 평가 소견:</strong>
                      {report.consensusGap.gapBridgeReasoning}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Backtest Mode Section 4: 사후 적중률 실증 백테스트 결과 */
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-950 to-slate-900 border-2 border-indigo-500/40 space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <Target size={20} className="text-indigo-400" />
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        사후 적중률 실증 백테스트 검증 (Point-in-Time Backtest Outcome)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        기준일({report.asOfDate}) 이후 6개월~1년 실제 주가 및 DART 공시 실적과의 교차 검증 결과
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border self-start sm:self-auto ${
                    report.backtest.verdictBadge === '적중 (HIT)'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {report.backtest.verdictBadge}
                  </span>
                </div>

                {/* Price Trajectory Alignment Bar */}
                <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">주가 수렴 궤적:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      사후 최고가 달성률: +{report.backtest.maxUpsideAchievedPct}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 font-mono">
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">① 발간 기준일 ({report.asOfDate})</span>
                      <strong className="text-slate-300 text-sm block">{report.backtest.priceAtDate.toLocaleString()}원</strong>
                      <span className="text-[9px] text-slate-500">당시 확정 종가</span>
                    </div>
                    <div className="bg-indigo-950/50 p-2.5 rounded border border-indigo-500/30">
                      <span className="text-[10px] text-indigo-400 block">② AI 목표가 (기한 ~{report.backtest.targetHorizonDate})</span>
                      <strong className="text-indigo-300 text-sm block">{report.backtest.targetPrice.toLocaleString()}원</strong>
                      <span className="text-[9px] text-indigo-400/80">향후 12개월 목표 시계</span>
                    </div>
                    <div className="bg-emerald-950/50 p-2.5 rounded border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-400 block">③ 실제 달성일 ({report.backtest.actualPeakDate})</span>
                      <strong className="text-emerald-300 text-sm block">{report.backtest.actualPeakPrice.toLocaleString()}원</strong>
                      <span className="text-[9px] text-emerald-400/80">사후 최고가 도달</span>
                    </div>
                  </div>
                </div>

                {/* DART Earnings Accuracy Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-0.5">DART 가중 평균 오차율</span>
                    <strong className="text-base font-mono text-indigo-300">{report.backtest.weightedErrorRatePct}%</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">1Q(20%)+2Q(30%)+3Q(50%)</span>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-0.5">목표가 괴리율 (Gap)</span>
                    <strong className="text-base font-mono text-emerald-400">{report.backtest.targetPriceGapPct}%</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">목표가 대비 실제 도달차</span>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-0.5">공식 정합성 판정 점수</span>
                    <strong className="text-base font-mono text-amber-300">{report.backtest.dartAlignmentScore}점</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">100점 만점 기준</span>
                  </div>
                </div>

                {/* AI Scenario Modeling Commentary */}
                <div className="p-3.5 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-xs text-slate-200 leading-relaxed font-sans">
                  <strong className="text-indigo-300 block mb-1">■ AI 퀀트 알고리즘 가설 시나리오 분석관 소견:</strong>
                  {report.backtest.verdictSummary}
                </div>
              </div>
            )}

            {/* Regulatory & Legal Disclaimer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
              <strong className="text-amber-400 flex items-center gap-1.5 font-bold">
                <AlertTriangle size={14} />
                자본시장법 준수 및 규제 법적 고지 (Regulatory & Legal Disclaimer)
              </strong>
              <p className="leading-relaxed text-[11px] text-slate-400">
                {report.signatureCitation} 본 시뮬레이터는 공개된 공시 팩트와 가설적 파라미터(SC 처방 전환율, 로열티율, WACC)에 기반한 <strong>오픈소스 알고리즘 가설 시나리오 분석 도구</strong>입니다. 자본시장과 금융투자업에 관한 법률 제17조(투자자문업의 등록 등)에 따른 공인 금융투자분석사의 정규 조사분석자료나 특정 금융투자상품의 매매 권유가 아닙니다. 단순히 '유사투자자문이 아님'을 표시하는 것으로 법적 책임이 면제되지 않으므로, 본 프로그램을 외부에 공개 배포하거나 유료 서비스로 상용화할 경우 자본시장법 준수를 위한 전문 법률 자문(Legal Clearance)이 반드시 완료되어야 합니다.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 4. 숨김 출력용 컨테이너: 백색 공문서 스타일 PDF 인쇄용 */}
      {/* ======================================================== */}
      {report && (
        <div
          ref={printableReportRef}
          style={{ display: 'none' }}
          className="bg-white text-slate-900 font-sans p-10 space-y-6"
        >
          {/* Header */}
          <div className="border-b-4 border-indigo-900 pb-4 flex justify-between items-end">
            <div>
              <span className="text-xs font-bold text-indigo-700 block mb-1">
                {report.isFactBasedOnly
                  ? 'AI 퀀트 밸류에이션 리포트 (화이트박스 파이프라인 수식 평가서)'
                  : report.mode === 'future'
                  ? '2026~2027 AI 미래 예측 종목 애널리스트 리포트 (Forward Research)'
                  : '2026 AI 가상 종목 애널리스트 리포트 (Point-in-Time 실증 평가서)'}
              </span>
              <h1 className="text-2xl font-black text-slate-950">
                {report.stockName} ({report.stockCode})
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                섹터: {report.sector} | 기준 시점: <strong>{report.asOfDate}</strong> | {report.isFactBasedOnly ? '분석 모델:' : '담당:'} <strong>{report.analyst.name} ({report.analyst.brokerName})</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-700 font-mono">
                {report.targetPrice.toLocaleString()}원
              </span>
              <span className="block text-[11px] text-emerald-700 font-bold">
                목표가 (상승여력 {formatUpsidePct(report.upsidePct)}, ~{report.backtest.targetHorizonDate})
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center text-xs">
            <div>
              <span className="text-slate-500 text-[10px] block">기준일 주가 ({report.asOfDate})</span>
              <strong className="text-sm font-mono text-slate-800">{report.currentPrice.toLocaleString()}원</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">기준 목표주가 (12M Forward)</span>
              <strong className="text-sm font-mono text-indigo-700">
                {report.targetPrice.toLocaleString()}원 ({formatUpsidePct(report.upsidePct)})
              </strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">
                {report.isFactBasedOnly ? 'Bull 목표가 (상단)' : report.mode === 'future' ? 'Bull 목표가 (상단)' : `실제 최고가 (${report.backtest.actualPeakDate})`}
              </span>
              <strong className="text-sm font-mono text-emerald-700">
                {report.targetPriceBand ? `${report.targetPriceBand.bull.toLocaleString()}원` : `${report.backtest.actualPeakPrice.toLocaleString()}원`}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">
                {report.isFactBasedOnly ? '가치평가 방식' : report.mode === 'future' ? '모델 신뢰도' : 'DART 정합도'}
              </span>
              <strong className="text-sm font-mono text-indigo-700">
                {report.isFactBasedOnly ? '동적 DCF 수식' : `${report.backtest.dartAlignmentScore}점`}
              </strong>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">1. 리포트 개요 (Executive Summary)</h4>
            <p>{report.executiveSummary}</p>
          </div>

          {/* Scenario Band Table (if available) */}
          {report.targetPriceBand && (
            <div className="p-4 bg-white rounded border-2 border-indigo-200 text-xs text-slate-800 space-y-2">
              <h4 className="font-bold text-indigo-950 text-sm mb-1.5">
                2. AI 목표주가 3대 시나리오 밴드 (~{report.backtest.targetHorizonDate})
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-600 block">
                    {report.isFactBasedOnly ? 'Bull (낙관 밴드)' : 'Bull (낙관)'}
                  </span>
                  <strong className="text-sm font-mono text-emerald-700">
                    {report.targetPriceBand.bull.toLocaleString()}원 ({formatUpsidePct(report.targetPriceBand.bullUpsidePct)})
                  </strong>
                </div>
                <div className="p-2 bg-indigo-50 rounded border border-indigo-300">
                  <span className="text-[10px] text-indigo-700 block">
                    {report.isFactBasedOnly ? 'Base (기본 밴드)' : 'Base (기본)'}
                  </span>
                  <strong className="text-sm font-mono text-indigo-800">
                    {report.targetPriceBand.base.toLocaleString()}원 ({formatUpsidePct(report.targetPriceBand.baseUpsidePct)})
                  </strong>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-600 block">
                    {report.isFactBasedOnly ? 'Bear (보수 밴드)' : 'Bear (하방)'}
                  </span>
                  <strong className="text-sm font-mono text-slate-800">
                    {report.targetPriceBand.bear.toLocaleString()}원 ({formatUpsidePct(report.targetPriceBand.bearUpsidePct)})
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Financial Estimation Table */}
          <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              {report.isFactBasedOnly
                ? '3. DART 과거 확정 실적 대사표 (미공시 분기 배제)'
                : report.mode === 'future'
                ? '3. 2026~2027 4개 분기 선행 실적 추정 모델'
                : '3. DART 분기별 실적 추정 모델 및 확정치 대사표'}
            </h4>
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-slate-300 font-semibold text-slate-600">
                  <th className="py-1">보고서 구분</th>
                  <th className="py-1 text-right">매출 (억원)</th>
                  <th className="py-1 text-right">영업익 (억원)</th>
                  <th className="py-1 text-right">순익 (억원)</th>
                  <th className="py-1 text-right">OPM(%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {report.financialEstimates.map(r => (
                  <tr key={r.quarter}>
                    <td className="py-1.5 font-sans font-medium text-slate-900">{r.quarter}</td>
                    <td className="py-1.5 text-right text-slate-700">{r.actualSales ? r.actualSales.toLocaleString() : r.estimatedSales.toLocaleString()}</td>
                    <td className="py-1.5 text-right text-indigo-700 font-bold">{r.actualOp ? r.actualOp.toLocaleString() : r.estimatedOp.toLocaleString()}</td>
                    <td className="py-1.5 text-right text-slate-700">{r.actualNp ? r.actualNp.toLocaleString() : r.estimatedNp.toLocaleString()}</td>
                    <td className="py-1.5 text-right font-bold text-slate-800">{r.opmPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fact-Based Mode Printable Tables: 4-A, 4-B, 4-C */}
          {report.isFactBasedOnly && report.valueBridge && (
            <div className="p-4 bg-white rounded border border-slate-200 text-xs text-slate-800 space-y-2">
              <h4 className="font-bold text-indigo-950 text-sm mb-1.5">
                4-A. 주당가치 워터폴 가치 브리지 (Waterfall Value Bridge)
              </h4>
              <p className="text-[11px] text-slate-500 mb-2">
                키트루다SC 피크매출($28B) 및 보도 로열티(2.0%)부터 파이프라인 DCF, 노바티스 계약(500억), 순현금 및 주당 적정가치까지의 수식 체인
              </p>
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 font-semibold text-slate-600">
                    <th className="py-1 w-8 text-center">단계</th>
                    <th className="py-1">평가 항목</th>
                    <th className="py-1 text-right">총 가치 (억원)</th>
                    <th className="py-1 text-right">주당 가치 (원)</th>
                    <th className="py-1 text-right">비중(%)</th>
                    <th className="py-1">산출 공식 및 팩트 근거</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {report.valueBridge.map(step => (
                    <tr key={step.stepOrder} className={step.category === 'per_share' ? 'bg-indigo-50 font-bold' : ''}>
                      <td className="py-1.5 text-center text-slate-500">{step.stepOrder}</td>
                      <td className="py-1.5 font-sans font-medium text-slate-900">{step.itemName}</td>
                      <td className="py-1.5 text-right text-slate-800">{step.valueKrw.toLocaleString()}억</td>
                      <td className="py-1.5 text-right text-indigo-700 font-bold">{step.perShareKrw.toLocaleString()}원</td>
                      <td className="py-1.5 text-right text-slate-600">{step.shareOfTotalPct}%</td>
                      <td className="py-1.5 font-sans text-slate-600 text-[10px]">{step.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {report.isFactBasedOnly && report.reverseEngineering && (
            <div className="p-4 bg-white rounded border border-slate-200 text-xs text-slate-800 space-y-2">
              <h4 className="font-bold text-indigo-950 text-sm mb-1.5">
                4-B. 현재 주가 정당화 역산 매트릭스 (Reverse Engineering Analysis)
              </h4>
              <p className="text-[11px] text-slate-500 mb-2">
                현재 주가({report.currentPrice.toLocaleString()}원)를 정당화하기 위해 요구되는 SC 전환율과 로열티율의 수학적 조합
              </p>
              <table className="w-full text-center text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 font-semibold text-slate-600">
                    <th className="py-1 text-left">SC 전환율 \ 로열티율</th>
                    {report.reverseEngineering.royaltyRatesPct.map(r => (
                      <th key={r} className="py-1 text-right">{r.toFixed(1)}% {r === 2.0 ? '(보도기준)' : ''}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {report.reverseEngineering.matrix.map((row, idx) => {
                    const convPct = row[0]?.conversionRatePct ?? 0;
                    return (
                      <tr key={idx}>
                        <td className="py-1 text-left font-sans font-bold text-slate-800">
                          {convPct}% {convPct === 35 ? '(가이던스)' : ''}
                        </td>
                        {row.map(cell => (
                          <td key={cell.royaltyRatePct} className={`py-1 text-right ${cell.justifiesCurrentPrice ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600'}`}>
                            {cell.impliedTargetPrice.toLocaleString()}원 ({formatUpsidePct(cell.upsidePct)})
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[10px] text-slate-700">
                ■ 보도 로열티 2.0% 기준 현재가 정당화 필요 전환율: <strong>{report.reverseEngineering.requiredConversionAtReportedRoyalty}%</strong> (2028년 IV 특허 만료 후 SC 급증 및 복수 플랫폼 확장 선반영 입증)
              </div>
            </div>
          )}

          {report.isFactBasedOnly && report.consensusGap && (
            <div className="p-4 bg-white rounded border border-slate-200 text-xs text-slate-800 space-y-2">
              <h4 className="font-bold text-indigo-950 text-sm mb-1.5">
                4-C. 모델 산출가({report.targetPrice.toLocaleString()}원) vs 증권사 컨센서스(45~54만원) 괴리 비교 분석
              </h4>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-indigo-900 block">① 본 모형: 보수적 정적 DCF (목표가 {report.consensusGap.conservativeDcf.targetPrice.toLocaleString()}원)</span>
                  <ul className="list-disc list-inside text-slate-600 text-[10px] space-y-0.5">
                    {report.consensusGap.conservativeDcf.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-amber-900 block">② 시장 증권사 컨센서스 (평균 {report.consensusGap.streetConsensus.averageTargetPrice.toLocaleString()}원)</span>
                  <ul className="list-disc list-inside text-slate-600 text-[10px] space-y-0.5">
                    {report.consensusGap.streetConsensus.keyDrivers.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              </div>
              <p className="text-[10px] text-slate-600 pt-1 leading-relaxed">
                {report.consensusGap.gapBridgeReasoning}
              </p>
            </div>
          )}

          {/* Core Theses */}
          <div className="p-4 bg-white rounded border border-slate-200 text-xs text-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-950 text-sm mb-1.5">5. 핵심 가치평가 가설 및 리스크</h4>
            {report.theses.map(t => (
              <div key={t.number} className="pb-1">
                <p className="font-bold text-slate-900">[{t.number}] {t.headline}</p>
                <p className="text-slate-700 mt-0.5">{t.argument}</p>
              </div>
            ))}
          </div>

          {/* Guidance / Verdict Box */}
          <div className="p-4 bg-white rounded-lg border-2 border-indigo-300 text-xs text-slate-800 space-y-2">
            <div className="flex justify-between items-center border-b border-indigo-100 pb-1.5">
              <h4 className="font-bold text-indigo-950 text-sm">
                6. {report.isFactBasedOnly ? 'AI 퀀트 밸류에이션 종합 소견 및 시사점' : report.mode === 'future' ? 'AI 가상 리서치 센터 포워드 가이던스' : '사후 적중률 실증 백테스트 결과'}
              </h4>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                {report.backtest.verdictBadge}
              </span>
            </div>
            <p className="leading-relaxed">
              <strong>■ 발간 기준일:</strong> {report.asOfDate} | 
              <strong> 12M 목표시계:</strong> ~{report.backtest.targetHorizonDate} | 
              <strong> 가설 시나리오 산출주가:</strong> {report.targetPrice.toLocaleString()}원 ({formatUpsidePct(report.upsidePct)}) | 
              <strong> 평가 모형:</strong> {report.isFactBasedOnly ? '오픈 화이트박스 DCF (점수·백테스트 배제)' : `신뢰도 ${report.backtest.dartAlignmentScore}점`}
            </p>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
              {report.backtest.verdictSummary}
            </p>
          </div>

          {/* Official Signature & Legal Notice */}
          <div className="border-t border-slate-300 pt-4 flex justify-between items-center text-[10px] text-slate-500">
            <span>발간: 리본인텔리전스 AI 금융공학 랩 | 본 문서는 특정 종목 투자 권유가 아닌 알고리즘 가설 분석 결과입니다.</span>
            <div className="px-2 py-1 border border-slate-400 text-slate-600 font-mono font-bold bg-slate-100 text-[10px]">
              VIRTUAL QUANT MODEL
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
