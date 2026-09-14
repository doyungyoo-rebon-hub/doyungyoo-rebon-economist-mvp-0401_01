import React from 'react';
import { X, Trophy, TrendingUp, Target, ShieldCheck, Award, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Analyst } from '../types';

interface AnalystDetailModalProps {
  analyst: Analyst | null;
  onClose: () => void;
  onSelectReportByStock?: (stockName: string) => void;
}

export const AnalystDetailModal: React.FC<AnalystDetailModalProps> = ({
  analyst,
  onClose,
  onSelectReportByStock,
}) => {
  if (!analyst) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>{analyst.name} 연구원 상세 트랙레코드</span>
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                  {analyst.brokerName}
                </span>
              </h3>
              <p className="text-xs text-slate-400">{analyst.sector} 담당 애널리스트</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Profile Card */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <img
                src={analyst.avatarUrl}
                alt={analyst.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/30 shadow-xl"
              />
              <div>
                <div className="flex items-center space-x-3">
                  <h4 className="text-2xl font-bold text-white">{analyst.name} <span className="text-sm text-slate-400 font-normal">팀장/연구원</span></h4>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    종합 {analyst.overallRank}위 (부문 {analyst.sectorRank}위)
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{analyst.brokerName} | 총 발간 리포트 {analyst.totalReports}건</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
                    부문: <strong>{analyst.sector}</strong>
                  </span>
                  <span className="bg-slate-800 text-emerald-400 px-2.5 py-1 rounded border border-slate-700">
                    평균 수익률: <strong>+{analyst.returnRate}%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Score Wheel/Badge */}
            <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block uppercase">종합 AI 어워드 스코어</span>
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  {analyst.overallScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>평균 주가 수익률</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">+{analyst.returnRate}%</div>
              <span className="text-[10px] text-slate-500">목표가 발간 후 6개월 내</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>가상 누적 수익금액</span>
              </div>
              <div className="text-2xl font-bold text-amber-300">+{analyst.totalProfitAmount}억원</div>
              <span className="text-[10px] text-slate-500">리포트 비중 시뮬레이션</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>목표주가 적중률</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">{analyst.targetPriceHitRate}%</div>
              <span className="text-[10px] text-slate-500">목표가 달성 성공률</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>AI 객관성/공정성</span>
              </div>
              <div className="text-2xl font-bold text-purple-300">{analyst.aiObjectivityScore}점</div>
              <span className="text-[10px] text-slate-500">셀사이드 편향 검증</span>
            </div>
          </div>

          {/* AI Evaluation Review Summary */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>AI 총평 및 공정성/객관성 리포트 분석</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
              {analyst.aiReviewSummary}
            </p>
          </div>

          {/* Top Stock Recommendations Track Record Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>주요 추천 종목 적중 현황</span>
            </h4>

            <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">종목명 / 종목코드</th>
                    <th className="px-4 py-3 font-semibold text-right">제시 목표가</th>
                    <th className="px-4 py-3 font-semibold text-right">달성 최고가</th>
                    <th className="px-4 py-3 font-semibold text-right">달성 수익률</th>
                    <th className="px-4 py-3 font-semibold text-center">목표가 달성 여부</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {analyst.topStockRecommendations.map((stock, idx) => (
                    <tr key={`${stock.stockCode}-${idx}`} className="hover:bg-slate-900/50">
                      <td className="px-4 py-3 font-bold text-white">
                        {stock.stockName} <span className="text-[10px] text-slate-500 font-normal">({stock.stockCode})</span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-300 font-medium">
                        {(stock.targetPrice || 0).toLocaleString()}원
                      </td>
                      <td className="px-4 py-3 text-right text-cyan-300 font-bold">
                        {(stock.achievedPrice || 0).toLocaleString()}원
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-extrabold">
                        +{stock.returnPercent}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        {stock.status === 'ACHIEVED' ? (
                          <span className="inline-flex items-center space-x-1 bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>목표가 달성</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                            <Clock className="w-3 h-3" />
                            <span>진행 중</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">데이터 동기화 기준: 2026-07-27 실시간 업데이트</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
