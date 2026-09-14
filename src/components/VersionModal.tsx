import React from 'react';
import { X, Tag, CheckCircle2, Calendar, GitCommit, Sparkles } from 'lucide-react';
import { APP_VERSIONS, CURRENT_VERSION } from '../data/versions';

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionModal: React.FC<VersionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">버전 히스토리 & 마일스톤</h2>
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  현재 버전: {CURRENT_VERSION.version}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                개발 진행 이력 및 릴리스 노트 ({CURRENT_VERSION.releaseDate} 기준)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Current Version Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50 border border-blue-500/40 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-blue-300">현재 적용 버전 ({CURRENT_VERSION.version})</span>
              </div>
              <span className="text-xs text-slate-400 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {CURRENT_VERSION.releaseDate}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">{CURRENT_VERSION.title}</h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">{CURRENT_VERSION.summary}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-blue-900/50">
              {CURRENT_VERSION.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline of All Versions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <GitCommit className="w-4 h-4 mr-1.5 text-slate-500" />
              전체 버전 릴리스 내역
            </h4>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
              {APP_VERSIONS.map((v) => (
                <div key={v.version} className="relative flex items-start space-x-4 pl-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
                    v.isCurrent
                      ? 'bg-blue-500 text-white ring-4 ring-blue-950 shadow-lg shadow-blue-500/50'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {v.version.startsWith('VERSION ') ? '1.1' : v.version.replace('v', '')}
                  </div>
                  <div className="flex-1 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">{v.version}</span>
                        <span className="text-xs text-slate-300 font-medium">{v.title}</span>
                        {v.isCurrent && (
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-semibold border border-emerald-500/30">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{v.releaseDate}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{v.summary}</p>
                    <ul className="space-y-1">
                      {v.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-start space-x-1.5">
                          <span className="text-slate-600 mt-1">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>AI 증권사 리포트 평가 대시보드 {CURRENT_VERSION.version} ({CURRENT_VERSION.releaseDate})</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
