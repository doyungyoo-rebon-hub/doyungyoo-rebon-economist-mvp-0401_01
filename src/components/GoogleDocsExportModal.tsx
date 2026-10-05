import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Sparkles,
  ExternalLink,
  Award,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogIn,
  LogOut,
  FolderOpen,
  BookOpen,
  FileCheck
} from 'lucide-react';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  AuthState
} from '../utils/googleAuth';
import {
  generateAwardsReportGoogleDoc,
  generateStockReportGoogleDoc,
  generateSystemManualGoogleDoc,
  CreatedDocResult
} from '../utils/googleDocsService';

interface GoogleDocsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysts: any[];
  reports: any[];
  currentReport?: any;
  pipelineMetrics?: any;
}

export const GoogleDocsExportModal: React.FC<GoogleDocsExportModalProps> = ({
  isOpen,
  onClose,
  analysts,
  reports,
  currentReport,
  pipelineMetrics
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false
  });
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<'awards' | 'stock' | 'manual'>('awards');
  const [selectedStockId, setSelectedStockId] = useState<string>(
    currentReport?.id || reports[0]?.id || ''
  );
  const [customTitle, setCustomTitle] = useState<string>('');
  const [createdDoc, setCreatedDoc] = useState<CreatedDocResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth((state) => {
      setAuthState(state);
    });
    return () => unsubscribe();
  }, []);

  // Update selectedStockId when currentReport changes
  useEffect(() => {
    if (currentReport?.id) {
      setSelectedStockId(currentReport.id);
      setSelectedType('stock');
    }
  }, [currentReport]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      setAuthState({
        user: res.user,
        accessToken: res.accessToken,
        isAuthenticated: true
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleSignOut();
      setAuthState({
        user: null,
        accessToken: null,
        isAuthenticated: false
      });
      setCreatedDoc(null);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleExport = async () => {
    if (!authState.accessToken) {
      setErrorMessage('Google 계정 로그인이 필요합니다.');
      return;
    }

    setIsExporting(true);
    setErrorMessage(null);
    setCreatedDoc(null);

    try {
      let docResult: CreatedDocResult;

      if (selectedType === 'awards') {
        docResult = await generateAwardsReportGoogleDoc(
          authState.accessToken,
          analysts,
          pipelineMetrics,
          {
            customTitle: customTitle.trim() || undefined,
            userEmail: authState.user?.email || undefined
          }
        );
      } else if (selectedType === 'stock') {
        const targetRep =
          reports.find((r) => r.id === selectedStockId) ||
          currentReport ||
          reports[0] ||
          { stockName: '삼성전자', brokerName: '미래에셋증권' };

        docResult = await generateStockReportGoogleDoc(
          authState.accessToken,
          targetRep,
          {
            userEmail: authState.user?.email || undefined
          }
        );
      } else {
        docResult = await generateSystemManualGoogleDoc(authState.accessToken, {
          userEmail: authState.user?.email || undefined
        });
      }

      setCreatedDoc(docResult);
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Google Docs 문서 생성 중 오류가 발생했습니다.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Google Docs 문서 정리 센터</span>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  Workspace 연동
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                증권사 리서치 리포트 및 애널리스트 어워즈 평가서를 Google Docs로 자동 생성·정리합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-x-0 space-y-5 text-slate-200 text-sm">
          {/* 1. Google Authentication Section */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {authState.isAuthenticated && authState.user ? (
              <div className="flex items-center space-x-3">
                {authState.user.photoURL ? (
                  <img
                    src={authState.user.photoURL}
                    alt="profile"
                    className="w-9 h-9 rounded-full ring-2 ring-emerald-500/50"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    {authState.user.displayName?.[0] || 'U'}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-xs">
                      {authState.user.displayName || 'Google 사용자'}
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full font-semibold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Google 연동됨</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {authState.user.email}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-semibold text-white text-xs flex items-center space-x-1.5">
                  <LogIn className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Docs 연동 필요</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  문서 생성을 위해 Google 계정으로 1회 로그인해 주세요.
                </div>
              </div>
            )}

            <div>
              {authState.isAuthenticated ? (
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium flex items-center space-x-1.5 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>로그아웃</span>
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer hover:scale-105 disabled:opacity-50"
                >
                  {isSigningIn ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  ) : (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                  )}
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. Document Template Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              정리할 문서 양식 선택
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedType('awards')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedType === 'awards'
                    ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/20 ring-1 ring-blue-500/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2 text-amber-400 mb-1.5">
                    <Award className="w-4 h-4" />
                    <span className="font-bold text-xs text-white">
                      어워즈 종합 평가서
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    2026 베스트 애널리스트 순위, 평가 지표 및 12개 섹터별 통계 종합본
                  </p>
                </div>
                <span className="text-[10px] text-blue-400 font-semibold mt-2.5">
                  ✓ 대표 공식 리포트
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('stock')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedType === 'stock'
                    ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/20 ring-1 ring-blue-500/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2 text-teal-400 mb-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-bold text-xs text-white">
                      개별 종목 브리핑
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    선택 종목의 투자의견, 목표주가, AI LLM 요약 및 본문 전문 정리
                  </p>
                </div>
                <span className="text-[10px] text-teal-400 font-semibold mt-2.5">
                  ✓ 특정 종목 심층 분석
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('manual')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedType === 'manual'
                    ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/20 ring-1 ring-blue-500/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2 text-emerald-400 mb-1.5">
                    <FileCheck className="w-4 h-4" />
                    <span className="font-bold text-xs text-white">
                      시스템 백업·운영 백서
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    클라우드 런 단일 포트 아키텍처 및 1줄 복원 매뉴얼 문서화
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold mt-2.5">
                  ✓ 운영 기술 매뉴얼
                </span>
              </button>
            </div>
          </div>

          {/* If 'stock' type selected, pick target stock report */}
          {selectedType === 'stock' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                정리 대상 종목 리포트 선택 ({reports.length}개 보유)
              </label>
              <select
                value={selectedStockId}
                onChange={(e) => setSelectedStockId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
              >
                {reports.slice(0, 100).map((r) => (
                  <option
                    key={r.id || `${r.stockName}_${r.date}`}
                    value={r.id}
                  >
                    [{r.stockName || '종목'}] {r.reportTitle || '리포트'} -{' '}
                    {r.brokerName || '증권사'} ({r.publishDate || r.date || ''})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Custom Document Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Google Docs 문서 제목 (선택 입력)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="미입력 시 기본 추천 제목으로 생성됩니다."
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 placeholder-slate-500"
            />
          </div>

          {/* Success Banner */}
          {createdDoc && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex flex-col space-y-2.5 animate-fadeIn">
              <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Google Docs 문서가 성공적으로 생성 및 정리되었습니다!</span>
              </div>
              <div className="text-[11px] text-slate-300">
                문서명: <strong className="text-white">{createdDoc.title}</strong>
              </div>
              <div>
                <a
                  href={createdDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-105"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>생성된 Google Docs 문서 열기 (새 창)</span>
                </a>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 flex items-center space-x-2 text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            문서 생성 시 Google Docs 및 Google Drive의 최소 권한만 사용됩니다.
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              닫기
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || !authState.isAuthenticated}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 flex items-center space-x-1.5 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>문서 정리 및 생성 중...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>구글 닥스로 문서 정리 생성</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
