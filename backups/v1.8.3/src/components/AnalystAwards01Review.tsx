import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { 
  OFFICIAL_OVERALL_SUMMARY, 
  OFFICIAL_WINNERS_REVIEWS, 
  TIE_BREAKER_POLICY,
  AnalystAwardReview 
} from '../data/awardsData';
import {
  isAwardExcludedBroker,
  isTarget24Broker,
  BROKER_POLICY_V181,
  TARGET_24_BROKERS,
  AWARD_EXCLUDED_BROKERS
} from '../data/brokerConfig';
import { 
  Award, 
  Trophy, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Scale, 
  Printer, 
  Copy, 
  Check, 
  FileDown,
  Loader2,
  Calendar,
  Building,
  Target,
  Download,
  AlertCircle
} from 'lucide-react';

export const AnalystAwards01Review: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<AnalystAwardReview | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [awardEligibilityFilter, setAwardEligibilityFilter] = useState<'ALL' | 'ELIGIBLE' | 'EXCLUDED'>('ALL');
  const [showBrokerPolicyModal, setShowBrokerPolicyModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTieBreakerModal, setShowTieBreakerModal] = useState<boolean>(false);
  
  // PDF Generation State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [singlePdfAnalyst, setSinglePdfAnalyst] = useState<AnalystAwardReview | null>(null);

  const printableFullReviewRef = useRef<HTMLDivElement>(null);
  const printableSingleReviewRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const grandPrizeWinner = OFFICIAL_WINNERS_REVIEWS.find(r => r.isGrandPrize) || OFFICIAL_WINNERS_REVIEWS[0];
  const sectorWinners = OFFICIAL_WINNERS_REVIEWS;

  const sectors = ['ALL', ...Array.from(new Set(OFFICIAL_WINNERS_REVIEWS.map(r => r.sector)))];

  const filteredWinners = sectorWinners.filter(w => {
    if (sectorFilter !== 'ALL' && w.sector !== sectorFilter) return false;
    if (awardEligibilityFilter === 'ELIGIBLE' && isAwardExcludedBroker(w.brokerName)) return false;
    if (awardEligibilityFilter === 'EXCLUDED' && !isAwardExcludedBroker(w.brokerName)) return false;
    return true;
  });

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('상장 헌정사 문구가 클립보드에 복사되었습니다.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // 1. 전체 심사평집 PDF 다운로드 (총평 + 대상 포함 10인 수상자 전수)
  const handleDownloadFullReviewPDF = async () => {
    if (!printableFullReviewRef.current) return;
    setIsGeneratingPdf(true);
    setPdfProgress('A4 공문서 규격(백색 공인 모드)으로 심사평집 렌더링 준비 중...');

    await new Promise((resolve) => setTimeout(resolve, 300));

    const element = printableFullReviewRef.current;
    const origDisplay = element.style.display;
    const origWidth = element.style.width;
    const origMaxWidth = element.style.maxWidth;
    const origOverflow = element.style.overflow;
    const savedStyles = new Map<HTMLElement, string>();

    try {
      setPdfProgress('고해상도 공문서 벡터 및 데이터 표 캡처 중 (스크롤바 제거 및 확장)...');
      
      // Make element visible for htmlToImage capture
      element.style.display = 'block';
      element.style.width = '960px';
      element.style.maxWidth = '960px';
      element.style.overflow = 'visible';

      const scrollContainers = element.querySelectorAll<HTMLElement>('.overflow-x-auto, .overflow-y-auto, [class*="overflow-"]');
      scrollContainers.forEach((el) => {
        savedStyles.set(el, el.style.overflow);
        el.style.overflow = 'visible';
      });

      let canvas: HTMLCanvasElement;
      try {
        canvas = await htmlToImage.toCanvas(element, {
          backgroundColor: '#ffffff',
          pixelRatio: 1.5,
          skipFonts: true,
          cacheBust: true,
          style: {
            borderRadius: '0px',
            boxShadow: 'none',
            border: 'none',
            transform: 'none',
            width: '960px',
            maxWidth: '960px',
            overflow: 'visible',
          },
          filter: (node) => {
            if (node instanceof HTMLElement && (node.classList?.contains('print:hidden') || node.hasAttribute('data-no-pdf'))) {
              return false;
            }
            return true;
          }
        });
      } catch (firstErr) {
        console.warn('htmlToImage.toCanvas initial attempt failed, trying toPng fallback...', firstErr);
        setPdfProgress('대체 렌더링 엔진으로 PDF 래스터화 중...');
        const pngDataUrl = await htmlToImage.toPng(element, {
          backgroundColor: '#ffffff',
          pixelRatio: 1.2,
          skipFonts: true,
          style: {
            borderRadius: '0px',
            boxShadow: 'none',
            border: 'none',
            width: '960px',
            maxWidth: '960px',
            overflow: 'visible',
          }
        });
        const img = new Image();
        img.src = pngDataUrl;
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(null);
          img.onerror = (e) => reject(new Error('Failed to load converted PNG: ' + String(e)));
        });
        canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 960;
        canvas.height = img.naturalHeight || 1200;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
      }

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas render resulted in empty image');
      }

      setPdfProgress('A4 페이지 자동 분할 및 공식 심사평집 PDF 패키징 중...');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 8;
      const contentWidth = pageWidth - margin * 2; // 194mm
      const contentHeight = pageHeight - margin * 2; // 281mm

      const pageSliceHeightPx = Math.floor(canvas.width * (contentHeight / contentWidth));
      let renderedHeight = 0;
      let pageIndex = 0;

      while (renderedHeight < canvas.height) {
        const sliceHeight = Math.min(pageSliceHeightPx, canvas.height - renderedHeight);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageSliceHeightPx;
        const ctx = pageCanvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            renderedHeight,
            canvas.width,
            sliceHeight,
            0,
            0,
            canvas.width,
            sliceHeight
          );

          const imgData = pageCanvas.toDataURL('image/jpeg', 0.92);
          if (pageIndex > 0) {
            pdf.addPage();
          }
          pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
          pageIndex++;
        }
        renderedHeight += pageSliceHeightPx;
      }

      const today = new Date().toISOString().split('T')[0];
      const fileName = `2026_올해의_애널리스트_공식_심사평집(총평_및_대상포함_10인_수상자_전수)_${today}.pdf`;
      pdf.save(fileName);
      showToast(`✅ "${fileName}" 파일이 정상 다운로드되었습니다!`);
    } catch (err: any) {
      console.error('PDF export error:', err);
      showToast(`⚠️ PDF 생성 중 오류: ${err?.message || '알 수 없는 오류'}`);
    } finally {
      // Restore styles
      element.style.display = origDisplay;
      element.style.width = origWidth;
      element.style.maxWidth = origMaxWidth;
      element.style.overflow = origOverflow;
      savedStyles.forEach((val, el) => {
        el.style.overflow = val;
      });
      setIsGeneratingPdf(false);
      setPdfProgress('');
    }
  };

  // 2. 개별 수상자 1인 공식 심사평 PDF 다운로드
  const handleDownloadSingleReviewPDF = async (analyst: AnalystAwardReview) => {
    setSinglePdfAnalyst(analyst);
    setIsGeneratingPdf(true);
    setPdfProgress(`[${analyst.name} 연구원] 개별 심사평 및 5단계 평가서 PDF 준비 중...`);

    // Give React time to render single analyst offscreen container
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (!printableSingleReviewRef.current) {
      setIsGeneratingPdf(false);
      return;
    }

    const element = printableSingleReviewRef.current;
    const origDisplay = element.style.display;
    element.style.display = 'block';
    element.style.width = '960px';
    element.style.maxWidth = '960px';
    element.style.overflow = 'visible';

    try {
      setPdfProgress(`[${analyst.name} 연구원] 고해상도 PDF 벡터 변환 중...`);

      const canvas = await htmlToImage.toCanvas(element, {
        backgroundColor: '#ffffff',
        pixelRatio: 1.5,
        skipFonts: true,
        cacheBust: true,
        style: {
          borderRadius: '0px',
          boxShadow: 'none',
          border: 'none',
          width: '960px',
          maxWidth: '960px',
          overflow: 'visible',
        }
      });

      setPdfProgress('A4 규격 페이지 분할 및 PDF 문서 패키징 중...');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 8;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      const pageSliceHeightPx = Math.floor(canvas.width * (contentHeight / contentWidth));
      let renderedHeight = 0;
      let pageIndex = 0;

      while (renderedHeight < canvas.height) {
        const sliceHeight = Math.min(pageSliceHeightPx, canvas.height - renderedHeight);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageSliceHeightPx;
        const ctx = pageCanvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            renderedHeight,
            canvas.width,
            sliceHeight,
            0,
            0,
            canvas.width,
            sliceHeight
          );

          const imgData = pageCanvas.toDataURL('image/jpeg', 0.92);
          if (pageIndex > 0) {
            pdf.addPage();
          }
          pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
          pageIndex++;
        }
        renderedHeight += pageSliceHeightPx;
      }

      const fileName = `2026_심사평_[${analyst.name}_${analyst.brokerName}].pdf`;
      pdf.save(fileName);
      showToast(`✅ "${fileName}" 다운로드가 완료되었습니다!`);
    } catch (err: any) {
      console.error('Single PDF export error:', err);
      showToast(`⚠️ PDF 생성 중 오류: ${err?.message || '알 수 없는 오류'}`);
    } finally {
      element.style.display = origDisplay;
      setIsGeneratingPdf(false);
      setPdfProgress('');
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 토스트 알림 메시지 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-indigo-500/50 text-white text-xs font-semibold shadow-2xl animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PDF 생성 중 로딩 오버레이 */}
      {isGeneratingPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <FileDown size={28} className="text-amber-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">공식 심사평 PDF 문서 생성 중</h3>
              <p className="text-xs text-indigo-300 font-mono animate-pulse">{pdfProgress}</p>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              금융감독원 DART 공시 팩트체크 및 대상 포함 10인 공식 수상자 5단계 평가 보고서를 공인 A4 벡터 양식으로 패키징하고 있습니다. 잠시만 기다려 주세요.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 상단 타이틀 배너 및 핵심 다운로드 액션 바 */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-4 bottom-4 opacity-10 text-indigo-300 pointer-events-none">
          <Trophy size={180} />
        </div>

        <div className="relative z-10 max-w-5xl">
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
          <p className="mt-3 text-slate-300 text-sm lg:text-base leading-relaxed">
            금융감독원 DART 분기·반기 확정 실적 데이터 교차검증과 국내 24개 공식 대상 증권사 및 5개 시상제외 평가사 8,698건(2025.11.01 ~ 2026.10.31 누적 전수)의 실제 발간 리서치 리포트를 정밀 분석한 
            인텔리전스 평가 엔진을 바탕으로 작성된 공식 수상자 심사 보고서입니다. (종합 대상 1인 + 9개 핵심 산업별 최우수 챔피언 9인 = 대상 포함 총 10인 전수 공식 수록, 대상 배출 소비재 섹터는 종합 대상으로 단독 통합)
          </p>

          {/* 주요 다운로드 액션 툴바 */}
          <div className="mt-6 flex flex-wrap items-center gap-3 bg-slate-950/70 p-4 rounded-xl border border-indigo-500/30">
            <button
              onClick={handleDownloadFullReviewPDF}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
              <span>📄 공식 심사평집 PDF 다운로드 (총평 + 10인 수상자 전수)</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
            >
              <Printer size={15} />
              <span>브라우저 출력 / 인쇄</span>
            </button>

            <div className="ml-auto hidden xl:flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
              <Sparkles size={14} className="text-amber-400" />
              <span>A4 공문서 규격 자동 분할 & 대상 포함 10명 전원 5단계 세부 평가서 포함</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            <div><span className="text-slate-500 font-medium">검증 표본 리포트:</span> <strong className="text-white">8,698건 (2025.11~2026.10 마스터 DB 전수)</strong></div>
            <div className="h-3 w-px bg-slate-800" />
            <div><span className="text-slate-500 font-medium">공식 수상자:</span> <strong className="text-amber-300 font-bold">대상 포함 총 10명 (종합 대상 1명 + 9대 섹터 챔피언 9명)</strong></div>
            <div className="h-3 w-px bg-slate-800" />
            <div><span className="text-slate-500 font-medium">참여 증권사:</span> <strong className="text-white">공식 대상 24개사 · 평가 5개사</strong></div>
            <div className="h-3 w-px bg-slate-800" />
            <button
              onClick={() => setShowBrokerPolicyModal(true)}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
            >
              <ShieldCheck size={13} />
              v1.8.2 대상 24개사 및 시상제외 5개사 승계 규정 확인
            </button>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">1. 전체 심사위원단 총평 (Overall Juror Review)</h2>
              <p className="text-xs text-slate-400">리본인텔리전스 × 이코노미스트 공동주관 AI 독립 심사평가위원회 공식 수여사</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFullReviewPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md transition cursor-pointer"
            >
              <FileDown size={14} />
              총평+10인 PDF 받기
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Printer size={13} />
              화면 인쇄
            </button>
          </div>
        </div>

        {/* 6대 평가 지표 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950/60 p-5 rounded-lg border border-slate-800/80 font-serif">
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
                  {grandPrizeWinner.sector} 단독 분리 표창
                </span>
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
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

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 min-w-[260px]">
              <button
                onClick={() => setSelectedReview(grandPrizeWinner)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <FileText size={16} />
                종합 대상 5단계 심사보고서 전문 열람
              </button>
              <button
                onClick={() => handleDownloadSingleReviewPDF(grandPrizeWinner)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-700/80 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <FileDown size={14} />
                대상 심사평 개별 PDF 받기
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
        <div className="space-y-4 border-b border-slate-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <FileText size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  2. 9대 표준 섹터별 최우수 챔피언 공식 심사평 리포트집 (총 9인 / 대상 배출 섹터는 종합 대상으로 단독 통합)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  대상 1인 + 각 섹터 1위 수상자 9인의 정량·정성 성과 분석, 시장 기여 통찰 및 공식 심사위원단 헌정사 (대상 배출 소비재 섹터는 종합 대상으로 단독 통합)
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadFullReviewPDF}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition self-start sm:self-auto cursor-pointer"
            >
              <FileDown size={14} />
              심사평집 전체 PDF 다운로드
            </button>
          </div>

          {/* 필터 툴바 영역 */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 pt-1">
            {/* 섹터 필터 탭 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full w-full xl:w-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sectors.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSectorFilter(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    sectorFilter === sec
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {sec === 'ALL' ? '전체 수상자 (대상 포함 10명)' : sec}
                </button>
              ))}
            </div>

            {/* 시상 적격 필터 */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 self-start xl:self-auto">
              <button
                onClick={() => setAwardEligibilityFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  awardEligibilityFilter === 'ALL'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                전체 (대상 포함 10명)
              </button>
              <button
                onClick={() => setAwardEligibilityFilter('ELIGIBLE')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  awardEligibilityFilter === 'ELIGIBLE'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                <Award size={12} />
                공식 시상 대상 (24개사)
              </button>
              <button
                onClick={() => setAwardEligibilityFilter('EXCLUDED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  awardEligibilityFilter === 'EXCLUDED'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                시상 제외사 승계 건
              </button>
            </div>
          </div>
        </div>

        {/* 개별 심사평 카드 목록 (11명) */}
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
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <h3 className="text-xl font-extrabold text-white">
                        {analyst.name}
                      </h3>
                      <span className="text-sm font-semibold text-slate-300">{analyst.brokerName}</span>
                      <span className="text-xs text-slate-500">|</span>
                      <span className="text-xs text-indigo-300 font-medium">{analyst.sector}</span>
                      
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        공식 시상 챔피언
                      </span>
                    </div>
                    {analyst.awardSuccessionNote && (
                      <div className="text-[11px] text-amber-300/95 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md">
                        {analyst.awardSuccessionNote}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
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

              {/* 카드 액션 버튼 바 */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">
                  대표 리포트: <strong className="text-slate-300">{analyst.keyReports[0]?.slice(0, 24)}...</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadSingleReviewPDF(analyst)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-500/40 text-slate-300 text-xs border border-slate-700 transition cursor-pointer"
                    title="이 수상자의 심사평을 PDF로 다운로드합니다"
                  >
                    <FileDown size={13} className="text-rose-400" />
                    <span>개별 PDF</span>
                  </button>
                  <button
                    onClick={() => setSelectedReview(analyst)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                  >
                    5단계 상세 전문
                    <ChevronRight size={14} />
                  </button>
                </div>
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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedReview.category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  DART 팩트체크 검증 완료
                </span>
                {selectedReview.awardSuccessionNote && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    시상 승계
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white">
                [리본-이코노미스트 2026 어워즈] AI 심사 리포트: {selectedReview.name} 연구원 ({selectedReview.brokerName})
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                <span>섹터: <strong className="text-white">{selectedReview.sector}</strong></span>
                <span>종합 평점: <strong className="text-emerald-400 font-mono text-sm">{selectedReview.score}점</strong></span>
                <span>검증 리포트: <strong className="text-white">{selectedReview.keyReports.length}건 전수 분석</strong></span>
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

            {/* 모달 푸터 액션 바 */}
            <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                인텔리전스 AI 수석 심사위원단 공식 인증 리포트 (ID: {selectedReview.id})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadSingleReviewPDF(selectedReview)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow transition cursor-pointer"
                >
                  <FileDown size={14} />
                  이 수상자 심사평 PDF 다운로드
                </button>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium cursor-pointer"
                >
                  닫기
                </button>
              </div>
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

      {/* ======================================================== */}
      {/* 5. 모달: v1.8.2 증권사 선정 및 시상 운영 규정 팝업 */}
      {/* ======================================================== */}
      {showBrokerPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setShowBrokerPolicyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              aria-label="닫기"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <ShieldCheck size={16} />
                <span>VERSION 1.8.2 공식 증권사 선정 및 평가·시상 운영 규정</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {BROKER_POLICY_V181.title}
              </h3>
              <p className="text-xs text-slate-400">
                {BROKER_POLICY_V181.summary}
              </p>
            </div>

            <div className="space-y-4">
              {/* 24개 공식 대상 증권사 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                    <Award size={15} />
                    공식 대상 증권사 (24개사)
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">시상 적격</span>
                </div>
                <p className="text-xs text-slate-300">
                  국내 리서치 시장 핵심 24개사를 정규 심사 대상사로 확정하여 평가의 대표성과 산업 집중도를 극대화했습니다.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {TARGET_24_BROKERS.map(b => (
                    <span key={b} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-700 font-medium">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* 평가 진행 / 시상 제외 5개사 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck size={15} />
                    평가 진행 / 시상 제외 증권사 (5개사)
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">시상 제외 (평가 유지)</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>IBK투자증권, 삼성증권, 한국투자증권, 대신증권, iM증권</strong> 5개사는 컴플라이언스 및 사내 규정에 따라 공식 시상(트로피/상패) 대상에서는 제외하되, 시장 분석의 객관적 벤치마크 보존을 위해 AI 6대 KPI 성과 평가는 100% 동일하게 산정 및 공개하며 해당 섹터 1위 수상이 발생할 시 2위(차순위 적격사)에게 공식 수상이 승계됩니다.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {AWARD_EXCLUDED_BROKERS.map(b => (
                    <span key={b} className="text-[11px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setShowBrokerPolicyModal(false)}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
              >
                규정 확인 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. 숨김 출력용 컨테이너: 전체 심사평집 A4 PDF 출력용 (백색 모드) */}
      {/* ======================================================== */}
      <div 
        ref={printableFullReviewRef} 
        style={{ display: 'none' }}
        className="bg-white text-slate-900 font-sans p-10 space-y-8"
      >
        {/* 공문서 표제부 */}
        <div className="border-b-4 border-slate-900 pb-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-300 pb-2">
            <span>문서번호: REV-2026-AWARDS-FINAL-01</span>
            <span>발간일자: {new Date().toISOString().split('T')[0]}</span>
            <span>분류: 공인 AI 심사평가서 (전수 합본)</span>
          </div>
          <div className="text-center space-y-2 pt-2">
            <span className="inline-block px-3 py-1 rounded bg-slate-100 text-slate-800 text-xs font-extrabold border border-slate-300">
              리본인텔리전스 × 이코노미스트 공동주관 AI 독립 심사평가위원회
            </span>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">
              2026 올해의 애널리스트 어워즈 공식 심사평집
            </h1>
            <p className="text-sm text-slate-700 max-w-3xl mx-auto">
              금융감독원 DART 공시 99.8% 정합성 검증 및 24개 공식 대상 증권사·5개 시상제외 평가사 리포트 8,698건 전수 교차검증 기반
            </p>
          </div>
        </div>

        {/* Part 1: 심사 개요 및 6대 지표 */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 border-l-4 border-indigo-700 pl-3">
            제 1 부. 심사 개요 및 6대 핵심 지표 배점 체계
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong>① 목표주가 정확성 (30%):</strong> 괴리율 = ((기간별 실제주가 - 목표주가) / 목표주가) × 100
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong>② 실적 추정 정확성 (40% - 최고 가중치):</strong> 1Q(20%), 2Q(30%), 3Q(50%) × 영업이익(60%), 매출액(20%), 순이익(20%) 가중 평균 오차율
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong>③ 투자 논리의 타당성 (10%):</strong> 리포트 핵심 투자 포인트 및 데이터 실증성
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong>④ 위험 요소 분석 적절성 (10%):</strong> 하방 리스크 및 역발상 위험 요인 구체성
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong>⑤ 투자 리포트 발간 빈도 (5%):</strong> 정규 리서치 발간 편수 및 커버리지 종목 수
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong>⑥ SNS 주목도 및 언론 빈도 (5%):</strong> 투자자 SNS 관심도(2.5%) + 언론 노출 빈도(2.5%)
            </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs leading-relaxed text-slate-800">
            <strong className="block mb-1 text-slate-900">심사위원장 공식 기고 및 의결문:</strong>
            {OFFICIAL_OVERALL_SUMMARY.chairmanAddress}
          </div>
        </div>

        {/* Part 2: 종합 대상 한유정 연구원 */}
        <div className="space-y-4 pt-4 border-t-2 border-slate-300">
          <h2 className="text-xl font-black text-slate-900 border-l-4 border-amber-600 pl-3">
            제 2 부. 👑 2026 올해의 애널리스트 종합 대상 (Grand Prize)
          </h2>
          <div className="p-5 border-2 border-amber-500 rounded-xl bg-amber-50/40 space-y-3">
            <div className="flex justify-between items-baseline border-b border-amber-200 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">종합 1위 단독 대상</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  한유정 연구원 <span className="text-base font-semibold text-slate-700">({grandPrizeWinner.brokerName} / {grandPrizeWinner.sector})</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-700">{grandPrizeWinner.score}점</span>
                <span className="block text-[11px] text-slate-500">100점 만점 전수 1위</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 bg-white rounded border border-amber-200">
              <div>목표가 적중률: <strong>{grandPrizeWinner.metrics.targetPriceAccuracy}%</strong></div>
              <div>DART 정합성: <strong>{grandPrizeWinner.metrics.dartAlignment}%</strong></div>
              <div>활동성/시의성: <strong>{grandPrizeWinner.metrics.activityTimeliness}%</strong></div>
              <div>논리성/영향력: <strong>{grandPrizeWinner.metrics.logicImpact}%</strong></div>
            </div>

            <div className="text-xs space-y-2 text-slate-800 leading-relaxed">
              <p><strong>■ 정량·정성 성과 분석:</strong> {grandPrizeWinner.quantitativeQualitativeAnalysis}</p>
              <p><strong>■ 시장 기여 및 통찰:</strong> {grandPrizeWinner.marketContributionInsight}</p>
              <p><strong>■ 대표 리포트:</strong> {grandPrizeWinner.fullReport.representativeReport.title} ({grandPrizeWinner.fullReport.representativeReport.date})</p>
              <div className="p-3 bg-amber-100/70 border-l-4 border-amber-600 rounded text-xs font-serif italic text-amber-950">
                &ldquo;{grandPrizeWinner.honorCitation}&rdquo;
              </div>
            </div>
          </div>
        </div>

        {/* Part 3: 9대 핵심 산업별 최우수 챔피언 9인 공식 심사평 */}
        <div className="space-y-4 pt-4 border-t-2 border-slate-300">
          <h2 className="text-xl font-black text-slate-900 border-l-4 border-indigo-700 pl-3">
            제 3 부. 🏆 9대 표준 산업별 최우수 챔피언 9인 심사평 (전수, 대상 배출 소비재 섹터는 종합 대상으로 단독 통합)
          </h2>
          <div className="space-y-4">
            {OFFICIAL_WINNERS_REVIEWS.filter(w => !w.isGrandPrize).map((analyst, idx) => (
              <div key={analyst.id} className="p-4 border border-slate-300 rounded-lg bg-slate-50 space-y-2.5">
                <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-slate-950">
                      {analyst.name} 연구원 <span className="text-xs text-slate-600 font-normal">({analyst.brokerName} | {analyst.sector})</span>
                    </h4>
                    {analyst.awardSuccessionNote && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                        {analyst.awardSuccessionNote}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <strong className="text-base text-indigo-700 font-mono">{analyst.score}점</strong>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[11px] bg-white p-2 rounded border border-slate-200 text-slate-700">
                  <div>목표가 적중도: <strong>{analyst.metrics.targetPriceAccuracy}%</strong></div>
                  <div>DART 정합성: <strong>{analyst.metrics.dartAlignment}%</strong></div>
                  <div>시의성/활동: <strong>{analyst.metrics.activityTimeliness}%</strong></div>
                  <div>논리/영향력: <strong>{analyst.metrics.logicImpact}%</strong></div>
                </div>

                <div className="text-xs space-y-1.5 text-slate-800 leading-relaxed">
                  <p><strong>[정량·정성 성과]:</strong> {analyst.quantitativeQualitativeAnalysis}</p>
                  <p><strong>[시장 기여 통찰]:</strong> {analyst.marketContributionInsight}</p>
                  <p><strong>[대표 발간 리포트]:</strong> {analyst.fullReport.representativeReport.title} ({analyst.fullReport.representativeReport.date}) - {analyst.fullReport.representativeReport.keyThesis}</p>
                  <blockquote className="p-2.5 bg-slate-100 border-l-2 border-indigo-600 text-slate-900 italic font-serif text-[11px]">
                    &ldquo;{analyst.honorCitation}&rdquo;
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 4: 공인 직인 및 심사위원회 의결서 인증 */}
        <div className="border-t-2 border-slate-900 pt-6 mt-6 space-y-4">
          <div className="flex justify-between items-end">
            <div className="text-xs text-slate-600 space-y-1">
              <p>평가 기준기: 2025년 11월 1일 ~ 2026년 10월 31일 (누적 전수 8,698건)</p>
              <p>공동 주관: 리본인텔리전스 빅데이터 센터 · 이코노미스트 편집국</p>
              <p>검증 알고리즘: v1.8.2 가중 평균 오차율 결정론적 AI 심사 엔진</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs font-bold text-slate-800">AI 독립 심사평가위원회 위원장 직인</p>
              <div className="inline-block p-2 border-2 border-red-700 rounded text-red-700 font-serif font-black text-sm tracking-widest bg-red-50">
                공인 AI 심사의결인
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 7. 숨김 출력용 컨테이너: 개별 수상자 1인 전용 PDF 출력용 */}
      {/* ======================================================== */}
      {singlePdfAnalyst && (
        <div 
          ref={printableSingleReviewRef} 
          style={{ display: 'none' }}
          className="bg-white text-slate-900 font-sans p-10 space-y-6"
        >
          <div className="border-b-4 border-slate-900 pb-4 flex justify-between items-end">
            <div>
              <span className="text-[11px] font-bold text-indigo-700 block mb-1">
                2026 올해의 애널리스트 어워즈 공식 심사평가서
              </span>
              <h1 className="text-2xl font-black text-slate-950">
                {singlePdfAnalyst.name} 연구원 ({singlePdfAnalyst.brokerName})
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                전문 섹터: {singlePdfAnalyst.sector} | {singlePdfAnalyst.category}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-700 font-mono">{singlePdfAnalyst.score}점</span>
              <span className="block text-[11px] text-slate-500">종합 평가점수</span>
            </div>
          </div>

          {singlePdfAnalyst.awardSuccessionNote && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 font-semibold">
              {singlePdfAnalyst.awardSuccessionNote}
            </div>
          )}

          {/* 4대 핵심 지표 */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center text-xs">
            <div>
              <span className="block text-slate-500 text-[10px]">목표가 적중률</span>
              <strong className="text-sm font-mono text-indigo-700">{singlePdfAnalyst.metrics.targetPriceAccuracy}%</strong>
            </div>
            <div>
              <span className="block text-slate-500 text-[10px]">DART 정합성</span>
              <strong className="text-sm font-mono text-emerald-700">{singlePdfAnalyst.metrics.dartAlignment}%</strong>
            </div>
            <div>
              <span className="block text-slate-500 text-[10px]">활동성/시의성</span>
              <strong className="text-sm font-mono text-blue-700">{singlePdfAnalyst.metrics.activityTimeliness}%</strong>
            </div>
            <div>
              <span className="block text-slate-500 text-[10px]">논리/영향력</span>
              <strong className="text-sm font-mono text-amber-700">{singlePdfAnalyst.metrics.logicImpact}%</strong>
            </div>
          </div>

          {/* 5단계 평가서 상세 */}
          <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">1. 수상 총평 (Executive Summary)</h4>
              <p>{singlePdfAnalyst.fullReport.executiveSummary}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">2. 4대 핵심 지표 정밀 평가</h4>
              <p><strong>① 목표주가 궤적:</strong> {singlePdfAnalyst.fullReport.targetPriceTracking}</p>
              <p><strong>② DART 실적 정합성:</strong> {singlePdfAnalyst.fullReport.dartConsistency}</p>
              <p><strong>③ 리포트 적시성과 깊이:</strong> {singlePdfAnalyst.fullReport.timelinessDepth}</p>
              <p><strong>④ 시장 건전성 기여도:</strong> {singlePdfAnalyst.fullReport.marketHealthContribution}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">3. 대표 발간 리포트 하이라이트</h4>
              <p className="font-semibold text-slate-950 mb-0.5">📄 {singlePdfAnalyst.fullReport.representativeReport.title} ({singlePdfAnalyst.fullReport.representativeReport.date})</p>
              <p className="text-slate-700">{singlePdfAnalyst.fullReport.representativeReport.keyThesis}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">4. 2026년 하반기 전망 및 투자자 제언</h4>
              <p>{singlePdfAnalyst.fullReport.h2OutlookAdvice}</p>
            </div>

            <div className="p-4 bg-amber-50 rounded border border-amber-300">
              <h4 className="font-bold text-amber-950 text-sm mb-1.5">5. 최종 심사위원단 공식 수여사 (Honor Citation)</h4>
              <blockquote className="font-serif italic text-amber-900 leading-relaxed">
                &ldquo;{singlePdfAnalyst.fullReport.citationText}&rdquo;
              </blockquote>
            </div>
          </div>

          {/* 인증 직인 */}
          <div className="border-t border-slate-300 pt-4 flex justify-between items-center text-xs text-slate-600">
            <span>발간기관: 리본인텔리전스 × 이코노미스트 공동주관 AI 심사위원회</span>
            <div className="p-1.5 border border-red-600 text-red-600 font-serif font-black bg-red-50 text-[11px]">
              AI 심사 공인의결인
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
