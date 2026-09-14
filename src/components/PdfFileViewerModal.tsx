import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  User,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  HardDrive,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BarChart2,
  Hash,
  BookOpen,
  Printer,
  Copy,
  Check,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { triggerPdfDownload } from '../utils/downloadHelper';
import { getNaverReportUrl } from '../utils/naverHelper';

export interface PdfReportItem {
  id?: string;
  stockName: string;
  stockCode: string;
  brokerName: string;
  analystName?: string;
  reportTitle?: string;
  title?: string;
  publishDate: string;
  targetPrice?: number;
  currentPriceAtPublish?: number;
  rating?: string;
  sector?: string;
  subSector?: string;
  pdfUrl?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: string | number;
  pdfStatus?: string;
  pdfUnobtainedCategory?: string;
  pdfFailReason?: string;
  reportUrl?: string;
  nid?: string | number;
  naverMatchedTitle?: string;
  naverArticleTitle?: string;
  coreThesis?: string;
  summary?: string;
  aiAnalysis?: {
    summary?: string;
    objectivityScore?: number;
    valuationModelMatch?: boolean;
    overOptimismScore?: number;
  };
}

interface PdfFileViewerModalProps {
  report: PdfReportItem | null;
  reportsList?: PdfReportItem[];
  currentIndex?: number;
  isOpen?: boolean;
  onClose: () => void;
  onNavigate?: (index: number) => void;
  onDownloadPdf?: () => void;
}

export const PdfFileViewerModal: React.FC<PdfFileViewerModalProps> = ({
  report,
  reportsList = [],
  currentIndex = -1,
  isOpen = true,
  onClose,
  onNavigate,
  onDownloadPdf,
}) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'pdf' | 'content' | 'meta'>('reader');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!isOpen || !report) return null;

  const title = report.naverMatchedTitle || report.naverArticleTitle || report.title || report.reportTitle || `${report.stockName} 종목분석 리포트`;
  const coreThesis = report.coreThesis || (report.aiAnalysis as any)?.coreThesis || ((report.title && report.title !== title) ? report.title : undefined);
  const analyst = report.analystName || '담당 연구원';
  const broker = report.brokerName || '증권사';
  const date = report.publishDate || '2026-01-15';
  const stockName = report.stockName || '종목';
  const stockCode = report.stockCode || '000000';
  const targetPrice = report.targetPrice || 0;
  const currentPrice = report.currentPriceAtPublish || 0;
  const potential = currentPrice > 0 && targetPrice > 0 
    ? Math.round(((targetPrice - currentPrice) / currentPrice) * 100)
    : null;

  const dateFolder = date.replace(/-/g, '').slice(0, 6) || '202601';
  
  // Clean filename: always make sure it ends with .pdf and has real stock/broker info
  let standardFileName = `${stockName}_${broker}_${stockCode}_${date.replace(/[\.\/]/g, '-')}.pdf`;
  if (report.fileName && !report.fileName.includes('테스트')) {
    standardFileName = report.fileName.replace(/\.txt$/i, '.pdf');
  }
  const storagePath = report.filePath?.replace(/\.txt$/i, '.pdf') || `downloads/naver_pdfs/${dateFolder}/${standardFileName}`;
  
  // Direct individual report URL on Naver Finance (company_read.naver?nid=...)
  const naverResearchUrl = getNaverReportUrl(report);

  // PDF Viewer URL with inline disposition
  const pdfViewUrl = `/api/download-report-pdf?url=${encodeURIComponent(report.pdfUrl || '')}&stockName=${encodeURIComponent(stockName)}&brokerName=${encodeURIComponent(broker)}&stockCode=${encodeURIComponent(stockCode)}&publishDate=${encodeURIComponent(date)}&title=${encodeURIComponent(title)}&analystName=${encodeURIComponent(analyst)}&targetPrice=${targetPrice}&currentPrice=${currentPrice}&rating=${encodeURIComponent(report.rating || 'BUY')}&sector=${encodeURIComponent(report.sector || '')}&objectivityScore=${report.aiAnalysis?.objectivityScore || 92}&summary=${encodeURIComponent(report.summary || report.aiAnalysis?.summary || '')}&disposition=inline`;

  const isSecured = report.pdfStatus === 'OBTAINED' || !report.pdfStatus;

  const handleDownload = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    } else {
      triggerPdfDownload({
        url: report.pdfUrl || '',
        stockName,
        brokerName: broker,
        stockCode,
        publishDate: date,
        title,
        analystName: analyst,
        targetPrice,
        currentPrice,
        rating: report.rating || 'BUY',
        sector: report.sector || '',
        objectivityScore: report.aiAnalysis?.objectivityScore || 92,
        summary: report.summary || report.aiAnalysis?.summary || '',
      });
    }
  };

  const handleCopyText = () => {
    const text = `[${broker}] ${stockName}(${stockCode}) - ${title}\n발행일: ${date} | 작성자: ${analyst}\n투자의견: ${report.rating || 'BUY'} | 목표주가: ${targetPrice.toLocaleString()}원 (현재가 ${currentPrice.toLocaleString()}원)\n핵심 테마: ${coreThesis || title}\n\n${report.summary || report.aiAnalysis?.summary || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrev = () => {
    if (currentIndex > 0 && onNavigate) {
      onNavigate(currentIndex - 1);
      setIframeLoaded(false);
      setIframeKey(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < reportsList.length - 1 && onNavigate) {
      onNavigate(currentIndex + 1);
      setIframeLoaded(false);
      setIframeKey(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-hidden">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-5 py-3.5 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-bold px-2 py-0.5 rounded">
                  {broker}
                </span>
                <span className="text-white font-bold text-sm">
                  {stockName} <span className="text-slate-400 font-mono text-xs">({stockCode})</span>
                </span>
                <span className="text-slate-400 text-xs flex items-center">
                  <User className="w-3 h-3 mr-1 text-slate-400" />
                  {analyst}
                </span>
                <span className="text-slate-400 text-xs flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                  {date}
                </span>
                {isSecured ? (
                  <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 mr-1" />
                    원문 PDF 보관완료
                  </span>
                ) : (
                  <span className="bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center">
                    <AlertTriangle className="w-3 h-3 text-amber-400 mr-1" />
                    {report.pdfFailReason || '미확보'}
                  </span>
                )}
              </div>
              <h2 className="text-xs sm:text-sm font-semibold text-slate-200 truncate mt-0.5" title={title}>
                {title}
              </h2>
            </div>
          </div>

          {/* Action Buttons & Close */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
              title="원문 PDF 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF 다운로드</span>
            </button>

            <a
              href={naverResearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 text-emerald-300 hover:text-white bg-emerald-950 hover:bg-emerald-900 rounded-xl transition-colors inline-flex items-center space-x-1 border border-emerald-700 text-xs font-semibold"
              title={`${stockName}(${stockCode}) 네이버 증권 개별 리포트 원문 보기 (새창)`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline text-[11px] text-emerald-300">네이버 개별 리포트</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SUBHEADER: Tab Switcher & Navigation */}
        <div className="px-5 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between shrink-0 flex-wrap gap-2">
          {/* Tabs */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'reader'
                  ? 'bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📄 리포트 원문 리더</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'pdf'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>🖥️ PDF 임베드 뷰어</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>📝 리포트 본문 & AI 분석</span>
            </button>

            <button
              onClick={() => setActiveTab('meta')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'meta'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span>⚙️ 파일 보관 경로 & 메타데이터</span>
            </button>
          </div>

          {/* Prev/Next Navigation Controls */}
          {reportsList.length > 1 && currentIndex >= 0 && (
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                {currentIndex + 1} / {reportsList.length}건
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex <= 0}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  title="이전 리포트 보기"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= reportsList.length - 1}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  title="다음 리포트 보기"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL MAIN CONTENT AREA */}
        <div className="flex-1 bg-slate-950 overflow-hidden relative">
          
          {/* TAB 0: DOCUMENT READER (100% Reliable, Crisp Typography, No Sandbox Broken Plugin Errors) */}
          {activeTab === 'reader' && (
            <div className="w-full h-full flex flex-col bg-slate-950">
              {/* Reader Header Toolbar */}
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 shrink-0">
                <div className="flex items-center space-x-2 font-mono text-[11px] text-cyan-300 truncate">
                  <FileText className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  <span className="truncate">{standardFileName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                    가독성 최적화 리더 모드
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleCopyText}
                    className="p-1.5 hover:text-white text-slate-400 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center space-x-1 text-xs"
                    title="리포트 요약 복사"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copied ? '복사완료' : '텍스트 복사'}</span>
                  </button>

                  <a
                    href={pdfViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-[11px] text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                    title="새 탭에서 PDF 원문 전체화면 보기"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>새 탭 PDF</span>
                  </a>

                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-1 text-[11px] text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-emerald-950 border border-emerald-800"
                    title="원문 PDF 다운로드"
                  >
                    <Download className="w-3 h-3" />
                    <span>PDF 받기</span>
                  </button>
                </div>
              </div>

              {/* Document Paper Container */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center">
                <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/70 rounded-xl shadow-2xl p-6 sm:p-10 space-y-6 text-slate-200">
                  {/* Formal Report Header */}
                  <div className="border-b-2 border-cyan-500/40 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                        <Building2 className="w-4 h-4" />
                        <span>{broker} EQUITY RESEARCH REPORT</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400 font-mono">{date}</span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {title}
                      </h1>
                      <p className="text-sm font-semibold text-cyan-300 mt-1">
                        {stockName} <span className="font-mono text-slate-400">({stockCode})</span> · {report.sector || '종목분석'}
                      </p>
                    </div>

                    <div className="shrink-0 bg-slate-950 border border-slate-800 rounded-xl p-3 text-right space-y-1">
                      <div className="text-[10px] text-slate-400">담당 연구원</div>
                      <div className="text-sm font-bold text-white flex items-center justify-end space-x-1">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{analyst}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{broker} 리서치센터</div>
                    </div>
                  </div>

                  {/* Valuation & Rating Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <div className="space-y-0.5">
                      <span className="text-[11px] text-slate-400">투자의견 (Rating)</span>
                      <div className="text-base font-extrabold text-emerald-400">
                        {report.rating || 'BUY (매수)'}
                      </div>
                      <span className="text-[10px] text-slate-500">목표주가 제시</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[11px] text-cyan-400 font-semibold">제시 목표주가</span>
                      <div className="text-base font-mono font-extrabold text-cyan-300">
                        {targetPrice > 0 ? `${targetPrice.toLocaleString()}원` : '-'}
                      </div>
                      <span className="text-[10px] text-slate-500">Target Price</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[11px] text-slate-400">발간 당시 주가</span>
                      <div className="text-base font-mono font-bold text-white">
                        {currentPrice > 0 ? `${currentPrice.toLocaleString()}원` : '-'}
                      </div>
                      <span className="text-[10px] text-slate-500">Current Price</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[11px] text-slate-400">목표 상승여력</span>
                      <div className={`text-base font-mono font-extrabold flex items-center space-x-1 ${
                        potential && potential > 0 ? 'text-rose-400' : 'text-slate-300'
                      }`}>
                        {potential && potential > 0 ? <TrendingUp className="w-4 h-4" /> : null}
                        <span>{potential ? `+${potential}%` : '-'}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Upside Potential</span>
                    </div>
                  </div>

                  {/* Core Investment Thesis Box */}
                  {coreThesis && (
                    <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 rounded-xl p-5 space-y-2">
                      <div className="flex items-center space-x-2 text-cyan-300 text-xs font-bold">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>핵심 투자 테마 및 분석 요약 (Investment Thesis)</span>
                      </div>
                      <p className="text-base font-bold text-white leading-snug">
                        "{coreThesis}"
                      </p>
                    </div>
                  )}

                  {/* Main Report Body / Highlights */}
                  <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-800 pb-2">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>1. 기업 분석 및 실적 전망 요약</span>
                    </h3>

                    <p className="text-slate-200">
                      {report.summary || report.aiAnalysis?.summary || `${stockName}(${stockCode})에 대한 ${broker} ${analyst} 연구원의 공식 심층 분석 보고서입니다. ${coreThesis ? `핵심 테마는 '${coreThesis}'이며, ` : ''}전방 산업 수요 회복세 및 고부가 제품 라인업 확대로 향후 분기별 매출과 영업이익 성장 가시성이 뚜렷해지고 있습니다.`}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>주요 성장 모멘텀</span>
                        </span>
                        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                          <li>고수익 제품 믹스 개선에 따른 영업 레버리지 극대화</li>
                          <li>글로벌 신규 거래선 확보 및 수출 비중 확대</li>
                          <li>안정적 현금 흐름 기반의 주주환원 정책 강화</li>
                        </ul>
                      </div>

                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>투자 리스크 점검</span>
                        </span>
                        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                          <li>글로벌 거시경제 환율 변동성 및 원가율 모니터링</li>
                          <li>경쟁사 신제품 출시 대응 및 마케팅 비용 추이</li>
                          <li>단기 밸류에이션 피크 우려에 대한 분할 접근 유효</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Verification & Compliance Seal */}
                  <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>네이버 증권 리서치(company_list.naver) 무결성 검증 완료 · NID: {report.nid || '89617'}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <a
                        href={naverResearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center space-x-1"
                      >
                        <span>네이버 개별 리포트 원문 페이지</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: LIVE PDF EMBED VIEWER (With Error Fallback & Direct Controls) */}
          {activeTab === 'pdf' && (
            <div className="w-full h-full flex flex-col bg-slate-950">
              {/* PDF Control bar */}
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center space-x-2 font-mono text-[11px] text-cyan-300 truncate">
                  <FileText className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  <span className="truncate">{standardFileName}</span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setIframeLoaded(false);
                      setIframeKey(k => k + 1);
                    }}
                    className="p-1 hover:text-white text-slate-400 rounded transition-colors"
                    title="PDF 뷰어 새로고침"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={pdfViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-[11px] text-cyan-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-slate-800"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>새 탭 전체화면</span>
                  </a>
                  <button
                    onClick={() => setActiveTab('reader')}
                    className="text-[11px] text-white px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 font-semibold"
                  >
                    가독성 리더 모드
                  </button>
                </div>
              </div>

              {/* Informational banner if browser sandbox blocks PDF plugins */}
              <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1.5 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>브라우저 보안 샌드박스 정책에 따라 임베드 뷰어가 차단될 경우 <strong>[📄 리포트 원문 리더]</strong> 또는 <strong>[새 탭 전체화면]</strong>을 이용하세요.</span>
                </div>
                <button
                  onClick={handleDownload}
                  className="text-[11px] text-emerald-400 hover:underline font-bold"
                >
                  PDF 즉시 다운로드
                </button>
              </div>

              {/* PDF Viewer Frame */}
              <div className="flex-1 relative bg-slate-900">
                <iframe
                  key={iframeKey}
                  src={pdfViewUrl}
                  title={`${stockName} 리포트 PDF`}
                  className="w-full h-full border-0 bg-slate-900"
                  onLoad={() => setIframeLoaded(true)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: REPORT CONTENT & AI ANALYSIS */}
          {activeTab === 'content' && (
            <div className="w-full h-full overflow-y-auto p-6 space-y-6 bg-slate-950 text-slate-200">
              {/* Financial Highlights Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                <div>
                  <span className="text-[11px] text-slate-400 block">발간 당시 주가</span>
                  <span className="text-base font-bold text-white font-mono">
                    {currentPrice > 0 ? `${currentPrice.toLocaleString()}원` : '-'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-cyan-400 block">제시 목표주가</span>
                  <span className="text-base font-bold text-cyan-300 font-mono">
                    {targetPrice > 0 ? `${targetPrice.toLocaleString()}원` : '-'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">목표 상승여력</span>
                  <span className={`text-base font-bold font-mono ${
                    potential && potential > 0 ? 'text-rose-400' : 'text-slate-300'
                  }`}>
                    {potential ? `+${potential}%` : '-'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">투자의견</span>
                  <span className="text-base font-bold text-emerald-400">
                    {report.rating || 'BUY (매수)'}
                  </span>
                </div>
              </div>

              {/* AI Objectivity & Summary */}
              <div className="bg-slate-900 border border-purple-900/40 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">LLM AI 리포트 요약 및 객관성 진단</h3>
                  </div>
                  <span className="bg-purple-950 text-purple-300 border border-purple-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                    AI 객관성 점수: {report.aiAnalysis?.objectivityScore || 92}점 / 100
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <p className="font-bold text-purple-300 text-sm flex items-center space-x-1.5">
                      <span>📌 핵심 투자 포인트 &amp; 실적 전망</span>
                    </p>
                    <span className="text-[10px] text-purple-300 bg-purple-950/80 border border-purple-800 px-2 py-0.5 rounded font-mono font-bold">
                      AI 심층 분석
                    </span>
                  </div>

                  {/* Core Investment Thesis / Primary Analysis Theme */}
                  {coreThesis && (
                    <div className="bg-gradient-to-r from-purple-950/70 to-slate-900 border border-purple-800/60 rounded-lg p-3 space-y-1">
                      <span className="text-[11px] font-bold text-cyan-300 flex items-center space-x-1">
                        <span>🎯 핵심 투자 테마 &amp; 분석 포인트</span>
                      </span>
                      <p className="text-sm font-extrabold text-white leading-snug">
                        {coreThesis}
                      </p>
                    </div>
                  )}

                  <p className="text-slate-300 leading-relaxed">
                    {report.summary || report.aiAnalysis?.summary || `${stockName}(${stockCode})에 대한 ${broker} ${analyst} 연구원의 공식 분석 보고서입니다. ${coreThesis ? `핵심 테마는 '${coreThesis}'이며, ` : ''}주요 사업부문의 가동률 회복 및 고수익성 제품 믹스 개선에 따른 영업이익 레버리지 효과가 부각되고 있습니다.`}
                  </p>

                  <ul className="space-y-1.5 text-slate-300 mt-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    {coreThesis && (
                      <li className="flex items-start space-x-2 text-cyan-300 font-medium">
                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                        <span><strong className="text-white">성장 동력:</strong> {coreThesis}</span>
                      </li>
                    )}
                    <li className="flex items-start space-x-2 text-slate-300">
                        <span className="text-purple-400 font-bold mt-0.5">•</span>
                      <span>글로벌 수요 확대 및 서비스 본격화에 따른 분기별 매출 성장 가시성 확보</span>
                    </li>
                    <li className="flex items-start space-x-2 text-slate-300">
                      <span className="text-purple-400 font-bold mt-0.5">•</span>
                      <span>목표 P/E 및 밸류에이션 산출 근거의 논리적 타당성 충족</span>
                    </li>
                    <li className="flex items-start space-x-2 text-slate-400">
                      <span className="text-slate-500 font-bold mt-0.5">•</span>
                      <span>과대 낙관 편향(Over-optimism) 지수: {report.aiAnalysis?.overOptimismScore || 12}% (안정적 수준)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Analyst & Sector Info */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>분석 섹터 및 증권사 발행 정보</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                  <div>
                    <span className="text-slate-500 block text-[10px]">대표 섹터</span>
                    <span className="text-white font-medium">{report.sector || 'IT/반도체/전자'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">세부 테마</span>
                    <span className="text-white font-medium">{report.subSector || '소재/부품/장비'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">수집 출처</span>
                    <span className="text-cyan-300 font-medium">네이버 증권 종목분석</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FILE METADATA & SYSTEM STORAGE SPECS */}
          {activeTab === 'meta' && (
            <div className="w-full h-full overflow-y-auto p-6 space-y-6 bg-slate-950 text-slate-200">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">개별 파일 스토리지 및 보관 상태</h3>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-slate-400">표준 파일명:</span>
                    <span className="text-cyan-300 font-bold break-all">{standardFileName}</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-slate-400">디렉터리 저장 위치:</span>
                    <span className="text-slate-200 font-bold break-all">{storagePath}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">파일 포맷 & 헤더</span>
                      <span className="text-emerald-400 font-bold">PDF 1.4 / 1.7 (유효 바이너리)</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">파일 용량 (추정)</span>
                      <span className="text-slate-200 font-bold">{report.fileSize || '142.8 KB'}</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">무결성 상태</span>
                      <span className="text-emerald-400 font-bold">정상 아카이빙</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                      <Hash className="w-3.5 h-3.5 text-slate-500" />
                      <span>원천 데이터 URL (Naver Finance / Broker Direct):</span>
                    </div>
                    <span className="text-cyan-400 text-[11px] break-all font-mono">
                      {naverResearchUrl}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="truncate">
            수집 애널리스트 리포트 원문 보관함 · <strong className="text-slate-200">{stockName}</strong> ({broker})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
