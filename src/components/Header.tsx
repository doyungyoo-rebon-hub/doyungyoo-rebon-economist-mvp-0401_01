import React from 'react';
import { Award, FileText, Search, Cpu, BarChart3, Bell, Activity, Sparkles, Tag, Database, UserCheck } from 'lucide-react';
import { PipelineMetrics } from '../types';
import { CURRENT_VERSION } from '../data/versions';

interface HeaderProps {
  activeTab: 'awards' | 'annual_analysts_01' | 'reports' | 'explorer' | 'reports_lookup_01' | 'reports_01' | 'analysts_lookup_01' | 'pipeline' | 'pipeline_01' | 'stats' | 'notifications' | 'db_files';
  setActiveTab: (tab: 'awards' | 'annual_analysts_01' | 'reports' | 'explorer' | 'reports_lookup_01' | 'reports_01' | 'analysts_lookup_01' | 'pipeline' | 'pipeline_01' | 'stats' | 'notifications' | 'db_files') => void;
  metrics: PipelineMetrics;
  unreadNotificationCount: number;
  reportCount?: number;
  onClearData?: () => void;
  onOpenVersionModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  metrics,
  unreadNotificationCount,
  reportCount = 0,
  onClearData,
  onOpenVersionModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Banner Bar with Key Market Metrics */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
              파이프라인 가동중 ({metrics.activeBrokersCount}개 제휴 증권사)
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline" title="오늘 하루(당일) 실시간 수집 파이프라인을 통해 입고 및 AI 검증 완료된 실시간 처리 건수입니다.">오늘 자동 처리된 리포트: <strong className="text-slate-200">{metrics.todayProcessedReports}건</strong></span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline" title="전체 리포트의 AI LLM 객관성 평점 평균입니다.">평균 AI 객관성 스코어: <strong className="text-cyan-400">{metrics.avgObjectivityScore}점</strong></span>
          </div>

          <div className="flex items-center space-x-3 text-slate-400 text-xs">
            {onClearData && (
              <button
                onClick={onClearData}
                className="bg-rose-950/80 hover:bg-rose-900 border border-rose-700/70 text-rose-200 px-2.5 py-0.5 rounded text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
                title="수집된 모든 데이터 및 AI 분석 결과를 리셋합니다"
              >
                <span>🗑️ 전체 데이터 리셋 (초기화)</span>
              </button>
            )}
            <span className="inline-flex items-center bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-medium">
              <Sparkles className="w-3 h-3 mr-1" />
              이코노미스트 독자 평가 모델 기준 AI 강화 적용
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Container (2-Tier Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tier 1: Brand Logo, Title, Version, Subtitle & System Status */}
        <div className="flex items-center justify-between py-3 gap-4 border-b border-slate-800/80">
          {/* Logo & Brand Title */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('annual_analysts_01')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20 shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="font-bold text-base sm:text-lg text-white tracking-tight">AI 증권사 리포트 평가 & 파이프라인</h1>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  PRO AI
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenVersionModal?.();
                  }}
                  className="inline-flex items-center space-x-1 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-indigo-600/50 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all cursor-pointer shadow-sm hover:scale-105"
                  title={`버전 히스토리 및 ${CURRENT_VERSION.version} (${CURRENT_VERSION.releaseDate}) 릴리스 마일스톤 보기`}
                >
                  <Tag className="w-2.5 h-2.5" />
                  <span>{CURRENT_VERSION.version}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">제휴 리포트 실시간 수집 · LLM 객관성 검증 · 올해의 베스트 애널리스트</p>
            </div>
          </div>

          {/* Quick Status Pill */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveTab('notifications')}
              className="sm:hidden relative p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700"
              title="알림 센터"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs shadow-inner">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <div className="text-left">
                <div className="text-[10px] text-slate-500 leading-none">LLM AI 엔진</div>
                <div className="font-semibold text-slate-200">Gemini 3.6 Flash Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: Navigation Tabs (Displayed on the line below VERSION 1.4) */}
        <div className="py-2.5 overflow-x-auto no-scrollbar">
          <nav className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-950/90 border border-slate-800/90 w-max sm:w-full">
            <button
              onClick={() => setActiveTab('annual_analysts_01')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'annual_analysts_01'
                  ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-indigo-600 text-white shadow-md shadow-amber-600/40 ring-1 ring-amber-400/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>올해의 애널리스트_01</span>
              <span className="bg-amber-950/90 text-amber-300 text-[9px] px-1.5 py-0.2 rounded font-black border border-amber-600/60">
                신규로직
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports_01')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'reports_01'
                  ? 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white shadow-md shadow-teal-600/30 ring-1 ring-teal-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>애널리스트리포트_분석_01</span>
              <span className="bg-teal-950/90 text-teal-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-teal-700/60">
                DB분석
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports_lookup_01')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'reports_lookup_01'
                  ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-md shadow-amber-600/30 ring-1 ring-amber-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>애널리스트리포트_조회_01</span>
              <span className="bg-amber-950/90 text-amber-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-amber-700/60">
                수집조회
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analysts_lookup_01')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'analysts_lookup_01'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-cyan-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-300" />
              <span>애널리스트조회_01</span>
              <span className="bg-blue-950/90 text-cyan-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-cyan-800/60">
                성과·프로필
              </span>
            </button>

            <button
              onClick={() => setActiveTab('pipeline_01')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'pipeline_01'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>파이프라인_01</span>
              <span className="bg-emerald-950 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-emerald-800">
                수집엔진
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>월별통계_01</span>
              <span className="bg-blue-950/90 text-cyan-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-cyan-800/50">
                수집·섹터
              </span>
            </button>

            <button
              onClick={() => setActiveTab('db_files')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'db_files'
                  ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-md shadow-amber-600/30 ring-1 ring-amber-400/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>DB 보관 파일 조회</span>
              <span className="bg-amber-950 text-amber-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-amber-800">
                임시
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>알림</span>
              {unreadNotificationCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
