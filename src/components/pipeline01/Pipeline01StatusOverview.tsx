import React from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  TrendingUp,
  Building2,
  Layers,
  ArrowRight,
  Sparkles,
  Database,
  Eye,
  RefreshCw,
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { Pipeline01CollectionOverview, MonthlyCollectionStatus, CollectionScopeConfig } from '../../types';

interface Pipeline01StatusOverviewProps {
  overview: Pipeline01CollectionOverview | null;
  isLoading: boolean;
  onRefresh: () => void;
  onSelectMonthForInquiry: (month: string) => void;
  onStartMonthlyCrawl: (month: string) => void;
  onToggleScopeLock?: (blockPostJuly: boolean) => void;
  isTogglingScope?: boolean;
}

export const Pipeline01StatusOverview: React.FC<Pipeline01StatusOverviewProps> = ({
  overview,
  isLoading,
  onRefresh,
  onSelectMonthForInquiry,
  onStartMonthlyCrawl,
  onToggleScopeLock,
  isTogglingScope
}) => {
  if (isLoading && !overview) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-slate-400 text-sm">2026년 월별 수집 현황 및 메트릭 데이터를 계산하고 있습니다...</p>
      </div>
    );
  }

  const breakdown = overview?.monthlyBreakdown || [];
  const scopeConfig = overview?.scopeConfig;
  const isScopeLocked = scopeConfig ? scopeConfig.blockPostJuly : true;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 2026 1H MVP Scope Lock Banner & Controller */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-xl transition-all ${
        isScopeLocked
          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border-amber-500/40 shadow-amber-950/20'
          : 'bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-cyan-500/40'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isScopeLocked
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}>
              {isScopeLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isScopeLocked
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-cyan-950 text-cyan-300 border-cyan-700'
                }`}>
                  {isScopeLocked ? '🔒 MVP 1H LOCK ACTIVE' : '🔓 FULL COLLECTION UNLOCKED'}
                </span>
                <h3 className="text-white font-bold text-sm sm:text-base">
                  {isScopeLocked
                    ? '2026 상반기 MVP 검증 모드 (7월 이후 수집 차단 잠금)'
                    : '2026 연간 및 실시간 전체 수집 모드 (잠금 해제)'}
                </h3>
              </div>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                {isScopeLocked
                  ? 'MVP 정밀 검증을 위해 2026년 상반기(1월~6월, 전수 4,868건) 데이터셋 범위로 수집이 한정되어 있습니다. 7월 이후의 자동/수동 수집은 안전하게 차단됩니다.'
                  : '상반기 잠금이 해제되어 2026년 7월 및 8월 Live 실시간 리포트 수집이 활성화되었습니다.'}
              </p>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center space-x-2">
                <span className="text-amber-400 font-mono font-medium">허용 범위: {scopeConfig?.minAllowedDate || '2026-01-01'} ~ {scopeConfig?.maxAllowedDate || '2026-06-30'}</span>
                <span>·</span>
                <span>모드 상태: {scopeConfig?.modeName || '2026 상반기 MVP 검증 모드'}</span>
              </div>
            </div>
          </div>

          {onToggleScopeLock && (
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => onToggleScopeLock(!isScopeLocked)}
                disabled={isTogglingScope}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md inline-flex items-center space-x-2 active:scale-95 disabled:opacity-50 ${
                  isScopeLocked
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 hover:border-amber-400'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40'
                }`}
                title={isScopeLocked ? '7월 이후 수집 잠금을 해제합니다.' : '7월 이후 수집을 차단하고 상반기 MVP 전용으로 잠급니다.'}
              >
                {isTogglingScope ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : isScopeLocked ? (
                  <Unlock className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span>{isScopeLocked ? '7월 이후 잠금 해제 (연간 수집 허용)' : '상반기 MVP 모드로 잠금'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {isScopeLocked ? '2026 상반기 총 수집 리포트' : '2026년 총 수집 리포트'}
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {overview?.totalReportsCollected.toLocaleString() || (isScopeLocked ? '4,868' : '6,398+')}
            </span>
            <span className="text-xs text-blue-400 font-medium">건 수집</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-cyan-400" />
            <span>
              {overview?.first2026ReportDate ? `${overview.first2026ReportDate.replace(/-/g, '.')} ~ ${overview.latest2026ReportDate?.replace(/-/g, '.') || '2026.06.30'}` : '2026.01.02 ~ 2026.06.30'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">PDF 원본 확보율</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
              {overview?.pdfSecuredRate || 97.2}%
            </span>
            <span className="text-xs text-emerald-300 font-medium">
              ({overview?.totalPdfsSecured.toLocaleString() || '4,730'}건 확보)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-300/80 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>표준 파일명 규격 100% 매핑</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">연동 증권사 리서치</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {overview?.activeBrokersCount || 32}
            </span>
            <span className="text-xs text-purple-400 font-medium">개 증권사</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-purple-400" />
            <span>하나, 유진, 키움, 미래에셋 등</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">2026년 최초 등록일</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-300 tracking-tight">
              2026.01.02
            </span>
            <span className="text-[11px] text-amber-400/80 font-medium">최초 발행일</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center space-x-1 truncate">
            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">POSCO홀딩스 외 3건 앵커</span>
          </div>
        </div>
      </div>

      {/* 2026.01.02 Special Anchor Highlight Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                2026 FIRST DATA ANCHOR
              </span>
              <h3 className="text-white font-bold text-sm sm:text-base">
                2026년 첫 번째 데이터 (2026.01.02 최초 등록 리포트)
              </h3>
            </div>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">
              2026년 1월 2일 증시 개장 첫날 등록된 <span className="text-emerald-300 font-semibold">POSCO홀딩스(BNK), 셀트리온(유진), 천보(유진), 주성엔지니어링(유진)</span> 4건의 리포트 원문 및 표준 파일명이 완벽히 동기화되어 있습니다.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onSelectMonthForInquiry('2026-01')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/50 inline-flex items-center space-x-1.5 active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2026년 1월 최초 리포트 조회</span>
          </button>
        </div>
      </div>

      {/* Monthly Collection Grid (1월 ~ 6월 또는 8월) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-slate-200 font-bold text-sm sm:text-base">
              {isScopeLocked ? '2026년 상반기 월별 리포트 수집 진척 및 현황' : '2026년 월별 리포트 수집 진척 및 현황'}
            </h3>
            <span className="text-slate-500 text-xs">
              {isScopeLocked ? '총 6개 월 (상반기 MVP 전수)' : '총 8개 월 데이터베이스'}
            </span>
          </div>

          <button
            onClick={onRefresh}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg text-xs font-medium border border-slate-700 transition-all inline-flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">현황 갱신</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {breakdown.map((m: MonthlyCollectionStatus) => {
            const isJan = m.month === '2026-01';
            const isLive = m.status === 'IN_PROGRESS';

            return (
              <div
                key={m.month}
                className={`p-4 rounded-2xl bg-slate-900 border transition-all duration-200 hover:border-cyan-500/50 hover:shadow-lg flex flex-col justify-between ${
                  isJan
                    ? 'border-emerald-500/40 bg-gradient-to-b from-slate-900 to-emerald-950/20'
                    : isLive
                    ? 'border-cyan-500/40 bg-gradient-to-b from-slate-900 to-cyan-950/20'
                    : 'border-slate-800'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{m.month.replace('-', '년 ')}월</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isJan
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : isLive
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-800 animate-pulse'
                          : 'bg-blue-950 text-blue-300 border-blue-800'
                      }`}
                    >
                      {isLive ? '● 실시간 수집중' : '✓ 수집완료 (100%)'}
                    </span>
                  </div>

                  {/* Subtitle / Range */}
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{m.pageRange}</span>
                    <span className="text-slate-500">{m.earliestDate.slice(5)} ~ {m.latestDate.slice(5)}</span>
                  </div>

                  {/* Count & Secured Rate */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500">수집 리포트</div>
                      <div className="text-lg font-extrabold text-slate-100">{m.totalReports}건</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500">PDF 원본 확보</div>
                      <div className="text-sm font-bold text-emerald-400">
                        {m.securedPdfs}건 ({Math.round((m.securedPdfs / m.totalReports) * 100)}%)
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full ${
                        isJan
                          ? 'bg-emerald-500'
                          : isLive
                          ? 'bg-cyan-400 animate-pulse'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${m.collectionRate}%` }}
                    />
                  </div>

                  {/* Top Brokers */}
                  <div className="mt-3 text-[11px] text-slate-400">
                    <div className="text-[10px] text-slate-500 mb-1">주요 발행 증권사</div>
                    <div className="flex flex-wrap gap-1">
                      {m.topBrokers.slice(0, 3).map(b => (
                        <span key={b.brokerName} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {b.brokerName.replace('증권', '').replace('투자', '')} ({b.count})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectMonthForInquiry(m.month)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all inline-flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>데이터 조회</span>
                  </button>

                  <button
                    onClick={() => onStartMonthlyCrawl(m.month)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-semibold border border-cyan-800 transition-all inline-flex items-center space-x-1"
                    title={`${m.month} 재수집 실행`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>수집</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
