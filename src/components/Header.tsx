import React from 'react';
import { 
  Trophy, 
  Award, 
  FileText, 
  BarChart3, 
  Users, 
  Layers, 
  ShieldCheck, 
  GitBranch,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  const [activeJob, setActiveJob] = React.useState<any>(null);

  React.useEffect(() => {
    const checkJob = async () => {
      try {
        const res = await fetch('/api/pipeline/background-job-status');
        if (res.ok) {
          const data = await res.json();
          if (data.job) setActiveJob(data.job);
        }
      } catch (e) {}
    };
    checkJob();
    const timer = setInterval(checkJob, 2000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    {
      id: 'analysts_01',
      label: '올해의 애널리스트_01',
      shortLabel: '올해의 애널리스트',
      icon: Trophy,
      badge: 'TOP 20',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'analysts_01_review',
      label: '올해의 애널리스트_01 심사평',
      shortLabel: '심사평',
      icon: Award,
      badge: 'AI 공식 평가집',
      badgeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
      highlight: true
    },
    {
      id: 'report_lookup_01',
      label: '애널리스트리포트_조회_01',
      shortLabel: '리포트 조회',
      icon: FileText,
      badge: '7,158건',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    {
      id: 'report_analysis_01',
      label: '애널리스트리포트_분석_01',
      shortLabel: '리포트 분석',
      icon: BarChart3,
      badge: '심도 92.8',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'analyst_directory_01',
      label: '애널리스트조회_01',
      shortLabel: '연구원 조회',
      icon: Users,
      badge: '407명',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'pipeline_01',
      label: '파이프라인_01',
      shortLabel: '파이프라인',
      icon: Layers,
      badge: '32개사',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'dart_fact_check',
      label: 'DART 공시 팩트체크',
      shortLabel: 'DART 검증',
      icon: ShieldCheck,
      badge: '99.8%',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'version_manager',
      label: '버전 관리 & 백업',
      shortLabel: '버전 관리',
      icon: GitBranch,
      badge: 'v1.8',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/95 border-b border-slate-800 shadow-md">
      {/* 1행: 서비스 브랜딩 & 상단 요약 바 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-md">
            <Trophy size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
                리본인텔리전스 × 이코노미스트
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                VERSION 1.8
              </span>
              <span className="hidden sm:inline-block text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.2 rounded border border-emerald-500/30 font-medium">
                실데이터 4,868건 연동
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              2026 올해의 애널리스트 어워즈 & 차세대 실시간 리포트 평가 대시보드
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeJob && activeJob.status === 'running' && (
            <button
              onClick={() => onTabChange('pipeline_01')}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer shadow-md shadow-amber-500/10 animate-pulse"
              title="클릭하여 파이프라인 수집 화면으로 이동"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>⚡ {activeJob.month}월 백그라운드 수집 중: {activeJob.percent}% ({activeJob.currentCount}/{activeJob.totalItems}건)</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck size={14} className="text-emerald-400" />
              DART 정합성 99.8%
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300">32개 증권사 전수</span>
          </div>
        </div>
      </div>

      {/* 2행: 1.7 스타일의 8대 전 메뉴 전체 상시 노출 바 (flex-wrap으로 전 메뉴 100% 가시성 보장) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                    : item.highlight
                    ? 'text-yellow-400 hover:text-yellow-300 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/40'
                    : 'text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800'
                }`}
                title={item.label}
              >
                <Icon size={14} className={isActive && !item.highlight ? 'text-indigo-200' : ''} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full border font-mono font-medium ${
                    isActive 
                      ? item.highlight 
                        ? 'bg-slate-950/20 text-slate-950 border-slate-950/30' 
                        : 'bg-white/20 text-white border-white/30'
                      : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
