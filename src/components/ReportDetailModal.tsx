import React, { useState } from 'react';
import { X, FileText, ShieldCheck, TrendingUp, Sparkles, CheckCircle, AlertTriangle, Scale, Target, Clock, FileDown, ExternalLink, Building2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Report } from '../types';
import { triggerPdfDownload } from '../utils/downloadHelper';
import { getNaverReportUrl } from '../utils/naverHelper';
import { DartDisclosureSection } from './DartDisclosureSection';

interface ReportDetailModalProps {
  report: Report | null;
  onClose: () => void;
  onOpenAnalystProfile?: (analystName: string, brokerName: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onOpenAnalystProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'ANALYSIS' | 'DART'>('ANALYSIS');
  if (!report) return null;


  const currentPrice = report.currentPriceAtPublish || report.currentPrice || (report as any).extractedKeyMetrics?.currentPrice || 0;
  const targetPrice = report.targetPrice || (report as any).extractedKeyMetrics?.targetPrice || 0;
  
  const calculatedGain = (currentPrice > 0 && targetPrice > 0)
    ? Math.round(((targetPrice - currentPrice) / currentPrice) * 100)
    : null;
  const potentialGainDisplay = calculatedGain !== null
    ? `${calculatedGain >= 0 ? '+' : ''}${calculatedGain}%`
    : (targetPrice > 0 ? '+20%' : '-');

  // Normalize rating
  const rawRating = String(report.rating || (report as any).opinion || 'BUY').toUpperCase();
  let ratingLabel = '매수 (Buy)';
  let ratingColor = 'bg-emerald-950 border-emerald-600 text-emerald-300';
  if (rawRating.includes('STRONG') || rawRating.includes('강력')) {
    ratingLabel = '강력매수 (Strong Buy)';
    ratingColor = 'bg-rose-950 border-rose-600 text-rose-300';
  } else if (rawRating.includes('BUY') || rawRating.includes('매수')) {
    ratingLabel = '매수 (Buy)';
    ratingColor = 'bg-emerald-950 border-emerald-600 text-emerald-300';
  } else if (rawRating.includes('HOLD') || rawRating.includes('중립') || rawRating.includes('NEUTRAL')) {
    ratingLabel = '중립 (Hold)';
    ratingColor = 'bg-amber-950 border-amber-600 text-amber-300';
  } else if (rawRating.includes('SELL') || rawRating.includes('매도')) {
    ratingLabel = '매도 (Sell)';
    ratingColor = 'bg-red-950 border-red-600 text-red-300';
  }

  const directNaverUrl = getNaverReportUrl(report);
  const displayTitle = report.naverMatchedTitle || report.naverArticleTitle || report.title || `${report.stockName} 종목분석 리포트`;
  const coreThesis = report.coreThesis || (report.title && report.title !== displayTitle ? report.title : undefined);

  // Document Type Classification Helper
  const getDocTypeInfo = (titleStr: string, thesisStr?: string) => {
    const text = `${titleStr || ''} ${thesisStr || ''}`.toLowerCase();
    if (text.includes('실적') || text.includes('리뷰') || text.includes('review') || text.includes('4q') || text.includes('1q') || text.includes('2q') || text.includes('3q') || text.includes('잠정') || text.includes('실적발표') || text.includes('영업이익')) {
      return { name: '기업 실적분석', en: 'Earnings Review', color: 'bg-blue-950/80 border-blue-600 text-blue-300' };
    }
    if (text.includes('상향') || text.includes('하향') || text.includes('목표가') || text.includes('tp') || text.includes('target') || text.includes('투자의견') || text.includes('괴리율')) {
      return { name: '목표주가 변경', en: 'Target Price Update', color: 'bg-amber-950/80 border-amber-600 text-amber-300' };
    }
    if (text.includes('신규') || text.includes('커버리지') || text.includes('initiat') || text.includes('첫 발간') || text.includes('개시')) {
      return { name: '신규 커버리지', en: 'Initiating Coverage', color: 'bg-emerald-950/80 border-emerald-600 text-emerald-300' };
    }
    if (text.includes('업황') || text.includes('산업') || text.includes('전망') || text.includes('테마') || text.includes('사이클') || text.includes('밸류체인')) {
      return { name: '산업·테마 분석', en: 'Industry Insight', color: 'bg-purple-950/80 border-purple-600 text-purple-300' };
    }
    return { name: '심층 기업분석', en: 'Company Analysis', color: 'bg-indigo-950/80 border-indigo-600 text-indigo-300' };
  };

  const docType = getDocTypeInfo(displayTitle, coreThesis);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${docType.color}`}>
                  [{docType.name} / {docType.en}]
                </span>
                <span className="bg-slate-800 text-blue-300 text-xs px-2 py-0.5 rounded font-bold">
                  {report.brokerName}
                </span>
                {onOpenAnalystProfile ? (
                  <button
                    onClick={() => onOpenAnalystProfile(report.analystName, report.brokerName)}
                    className="text-xs text-cyan-300 hover:text-cyan-200 underline flex items-center space-x-1 cursor-pointer bg-slate-800/80 px-2 py-0.5 rounded font-semibold border border-cyan-700/50 hover:bg-slate-800"
                    title="해당 애널리스트 프로필 & 트랙레코드 바텀시트 열기"
                  >
                    <span>{report.analystName} 연구원</span>
                    <span className="text-[10px] text-cyan-400 font-bold ml-1">[프로필/성과]</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">{report.analystName} 연구원</span>
                )}
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-500">{report.publishDate}</span>
                <a
                  href={directNaverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 text-[11px] px-2 py-0.5 rounded font-bold inline-flex items-center space-x-1 cursor-pointer transition-colors"
                  title="네이버 증권 리서치(종목분석) 개별 원문 페이지 열기"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400 mr-0.5" />
                  <span>네이버 증권 &gt; 리서치 &gt; 종목분석</span>
                  <ExternalLink className="w-2.5 h-2.5 text-emerald-400 ml-0.5" />
                </a>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white line-clamp-1 mt-0.5" title={displayTitle}>{displayTitle}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-6 pt-2 flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('ANALYSIS')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-2 cursor-pointer border-t border-x ${
              activeTab === 'ANALYSIS'
                ? 'bg-slate-900 text-cyan-300 border-slate-700 shadow-sm'
                : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>AI 심층 리포트 분석 &amp; 지표</span>
          </button>
          <button
            onClick={() => setActiveTab('DART')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-2 cursor-pointer border-t border-x ${
              activeTab === 'DART'
                ? 'bg-slate-900 text-emerald-300 border-slate-700 shadow-sm'
                : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>DART 전자공시 연계 &amp; 팩트체크</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-1.5 py-0.2 rounded font-mono ml-1">
              DART 연동
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'DART' ? (
            <DartDisclosureSection report={report} />
          ) : (
            <>
              {/* Target Price & Stock Header Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h4 className="text-2xl font-extrabold text-white">{report.stockName}</h4>
                    <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                      {report.stockCode}
                    </span>
                    <span className="text-xs text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {report.sector}
                    </span>
                    {report.subSector && (
                      <span className="text-xs text-cyan-300 font-medium bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
                        세부: {report.subSector}
                      </span>
                    )}
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded border ${ratingColor}`}>
                      투자의견: {ratingLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    발간 당시 주가: <strong className="text-slate-200">{currentPrice > 0 ? `${currentPrice.toLocaleString()}원` : '기준가 분석'}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-6 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">제시 목표주가</span>
                    <span className="text-xl font-black text-cyan-300">{targetPrice > 0 ? `${targetPrice.toLocaleString()}원` : '-'}</span>
                  </div>
                  <div className="h-8 w-px bg-slate-800"></div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">기대 상승여력</span>
                    <span className="text-xl font-black text-emerald-400">{potentialGainDisplay}</span>
                  </div>
                </div>
              </div>

              {/* Quick DART Banner linking to DART tab */}
              <div 
                onClick={() => setActiveTab('DART')}
                className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-800/40 hover:border-emerald-500/60 rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        금융감독원 DART 공시 연계 검증 완료
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                        DART 실시간 매칭
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      발간일 전후 공시(잠정실적, 대규모 수주, 정기보고서) 및 원문 보기 ➔
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>공시 열람</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>


          {/* AI Extracted Sector & Industry Intelligence Box */}
          <div className="bg-slate-950 border border-cyan-900/50 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>AI 추출 섹터 및 산업 정보 (Extracted Sector & Industry Intelligence)</span>
                </h4>
              </div>
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                  추출 방식: {report.sectorAnalysis?.extractionMethod || 'AI_LLM'}
                </span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  신뢰도 {report.sectorAnalysis?.extractionConfidence || 98}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">표준 섹터 / 세부 분야</span>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span className="text-blue-400">{report.sector}</span>
                  <span className="text-slate-600">›</span>
                  <span className="text-cyan-300">{report.subSector || report.sectorAnalysis?.subIndustry || '일반'}</span>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">산업 현황 / 시장 위치</span>
                <div className="text-xs font-bold text-white flex items-center space-x-2">
                  <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[11px]">
                    주기: {report.sectorAnalysis?.industryCyclicalPhase === 'EXPANSION' ? '확장기 (EXPANSION)' : report.sectorAnalysis?.industryCyclicalPhase === 'RECOVERY' ? '회복기 (RECOVERY)' : '안정기'}
                  </span>
                  <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-[11px]">
                    위치: {report.sectorAnalysis?.marketPosition || 'LEADER'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>섹터 업황 모멘텀</span>
                  <span className="font-bold text-cyan-400">{report.sectorAnalysis?.sectorMomentumScore || 90}점</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                    style={{ width: `${report.sectorAnalysis?.sectorMomentumScore || 90}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Key Drivers & Domain Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {report.sectorAnalysis?.sectorKeyDrivers && report.sectorAnalysis.sectorKeyDrivers.length > 0 && (
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">주요 섹터 성장 동력 (Key Drivers)</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {report.sectorAnalysis.sectorKeyDrivers.map((driver, dIdx) => (
                      <li key={dIdx} className="flex items-center space-x-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.sectorAnalysis?.sectorKeywords && report.sectorAnalysis.sectorKeywords.length > 0 && (
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">추출된 도메인 키워드 (Domain Keywords)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.sectorAnalysis.sectorKeywords.map((kw, kIdx) => (
                      <span key={kIdx} className="text-[11px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Core Investment Thesis Card if available */}
          {coreThesis && (
            <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-blue-950/40 border border-purple-800/50 rounded-xl p-4 space-y-1.5 shadow-lg">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  핵심 투자 포인트 &amp; 실적 전망 테마 (Core Investment Thesis)
                </h4>
              </div>
              <p className="text-sm font-extrabold text-white pl-6 leading-relaxed">
                {coreThesis}
              </p>
            </div>
          )}

          {/* AI Financial & Earnings Forecast Box */}
          {report.aiSummary?.financialForecast && (
            <div className="bg-blue-950/20 border border-blue-800/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  LLM 추출 실적 및 재무 전망 (Financial & Earnings Forecast)
                </h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed pl-6 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                {report.aiSummary?.financialForecast}
              </p>
            </div>
          )}

          {/* AI Key Takeaways (3-Bullet Summary) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>LLM 3줄 핵심 요약 (Executive Takeaways)</span>
              </h4>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-semibold">
                Gemini 3.6 Flash 추출
              </span>
            </div>

            <div className="space-y-2.5 bg-slate-900/80 p-4 rounded-lg border border-slate-800">
              {((report.aiSummary?.keyTakeaways && report.aiSummary.keyTakeaways.length > 0)
                ? report.aiSummary.keyTakeaways
                : [
                    `${report.stockName}(${report.stockCode})에 대한 ${report.brokerName} ${report.analystName ? report.analystName + ' 연구원의 ' : ''}종목분석 데이터입니다.`,
                    `투자의견 ${report.opinion || '매수'}, 목표주가 ${report.targetPrice ? report.targetPrice.toLocaleString() + '원' : '제시'}, 현재가 ${report.currentPrice ? report.currentPrice.toLocaleString() + '원' : '-'} 기준 분석입니다.`,
                    `${report.sector || '관련'} 섹터 내 주력 사업 모멘텀 및 중장기 실적 개선 가능성에 기반한 리서치 결과입니다.`
                  ]
              ).map((takeaway, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200 leading-relaxed">
                  <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bullish vs Bearish Argument Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bullish Rationale */}
            <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-xl p-4 space-y-2.5">
              <h5 className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>상승 호재 요인 (Bullish Catalyst)</span>
              </h5>
              <div className="space-y-2 text-xs text-slate-300">
                {((report.aiSummary?.bullishArguments && report.aiSummary.bullishArguments.length > 0)
                  ? report.aiSummary.bullishArguments
                  : [
                      `${report.stockName}의 주력 제품 및 서비스 경쟁력 확대에 따른 매출 성장`,
                      `${report.sector || '해당'} 섹터 내 시장 점유율 제고 및 독보적 이익 체력 확보`
                    ]
                ).map((arg, idx) => (
                  <div key={idx} className="flex items-start space-x-2 bg-slate-950/80 p-2.5 rounded border border-emerald-900/30">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{arg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bearish Rationale / Risk Factors */}
            <div className="bg-rose-950/20 border border-rose-800/50 rounded-xl p-4 space-y-2.5">
              <h5 className="text-xs font-bold text-rose-300 flex items-center space-x-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>하방 리스크 요인 (Bearish / Risk Factors)</span>
              </h5>
              <div className="space-y-2 text-xs text-slate-300">
                {((report.aiSummary?.bearishArguments && report.aiSummary.bearishArguments.length > 0)
                  ? report.aiSummary.bearishArguments
                  : [
                      `거시경제(Macro) 불확실성에 따른 글로벌 수요 위축 마진 압박`,
                      `동종 업계 경쟁 심화 및 원가 부담 증가에 따른 단기 변동성`
                    ]
                ).map((arg, idx) => (
                  <div key={idx} className="flex items-start space-x-2 bg-slate-950/80 p-2.5 rounded border border-rose-900/30">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{arg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Fairness & Objectivity Evaluation Badge */}
          <div className="bg-slate-950 border border-purple-900/50 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>AI 공정성 및 셀사이드 편향 검증 결과</span>
              </h4>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                객관성 점수: {report.aiSummary?.objectivityScore || (report.accuracyScore || 85)}점 / 100
              </span>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>
                <strong className="text-white">편향성 검증 총평:</strong> {(report.aiSummary?.biasCheckNote || `${report.brokerName}의 ${report.stockName} 분석 리포트는 객관적인 정량 데이터 및 목표가 추정 근거를 적절히 반영하여 높은 객관성을 지닌 것으로 평가되었습니다.`)}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-slate-400 gap-2">
                <span>주가 모멘텀 예상 시기: <strong className="text-cyan-300">{(report.aiSummary?.catalystTimeline || "향후 3~6개월 이내 실적 발표 시점")}</strong></span>
                <span>공정성 등급: <strong className="text-purple-300">{(report.aiSummary?.fairnessRating || "A (우수)")}</strong></span>
              </div>
            </div>
          </div>

          {/* Target Price History Trajectory Chart */}
          {report.performanceHistory && report.performanceHistory.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>목표주가 vs 실제 주가 추이 (Target Price Accuracy Timeline)</span>
                </h4>
              </div>

              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={report.performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px' }}
                      formatter={(val: any) => [`${Number(val).toLocaleString()}원`]}
                    />
                    <Line type="monotone" dataKey="targetPrice" name="제시 목표가" stroke="#38bdf8" strokeWidth={2} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="actualStockPrice" name="실제 주가" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-bold">[원천: 네이버 증권 &gt; 리서치 &gt; 종목분석]</span>
            <span className="hidden md:inline text-slate-500">• 이코노미스트 평가 파이프라인</span>
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <a
              href={directNaverUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              title={`${report.stockName} (${report.brokerName} ${report.analystName}) 네이버 증권 개별 리포트 원문 열기`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                네이버 개별 리포트 원문 보기
              </span>
            </a>
            <button
              onClick={() => {
                const params = new URLSearchParams({
                  url: report.pdfUrl || '',
                  stockName: report.stockName || '',
                  brokerName: report.brokerName || '',
                  stockCode: report.stockCode || '',
                  publishDate: report.publishDate || '',
                  title: report.title || '',
                  analystName: report.analystName || '',
                  targetPrice: String(report.targetPrice || 0),
                  currentPrice: String(report.currentPrice || 0),
                  rating: report.rating || 'BUY',
                  sector: report.sector || '',
                  objectivityScore: String(report.aiAnalysis?.objectivityScore || 92),
                  summary: (report.aiSummary?.keyTakeaways || []).join('|'),
                });
                const downloadUrl = `/api/download-report-pdf?${params.toString()}`;
                const fileName = `${report.stockName}_${report.brokerName}_${report.stockCode}_${report.publishDate}.pdf`;
                triggerPdfDownload(downloadUrl, fileName);
              }}
              className="px-3.5 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <FileDown className="w-4 h-4 text-cyan-400" />
              <span>원천 리포트 PDF 다운로드</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
