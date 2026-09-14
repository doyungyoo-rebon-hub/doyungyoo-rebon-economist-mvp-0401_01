import React from 'react';
import { Cpu, Wrench, Sparkles, Clock, Layers } from 'lucide-react';

export const Pipeline01Placeholder: React.FC = () => {
  return (
    <div id="pipeline-01-container" className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Header Card */}
      <div id="pipeline-01-header-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shadow-inner">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-slate-100">데이터 파이프라인_01</h1>
                  <span className="bg-emerald-900/60 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-700/60">
                    준비 중 (Under Development)
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  데이터 파이프라인 보조 아키텍처 및 신규 데이터 처리 모듈
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Empty State / Under Construction Card */}
      <div id="pipeline-01-empty-view" className="bg-slate-900/70 border border-slate-800 rounded-2xl p-12 lg:p-16 text-center flex flex-col items-center justify-center min-h-[460px] shadow-lg">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/30">
            <Wrench className="w-9 h-9 animate-pulse text-emerald-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg shadow-md">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">
          기능 추가 중입니다
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed mb-8">
          현재 <span className="text-emerald-400 font-semibold">데이터 파이프라인_01</span> 모듈의 새로운 기능을 준비하고 있습니다. 기능 구성이 완료되는 대로 화면이 업데이트됩니다.
        </p>

        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/70 text-xs text-slate-300 font-medium">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>파이프라인 버전: v0.1-alpha (준비 중)</span>
        </div>
      </div>
    </div>
  );
};
