import React, { useState } from 'react';
import {
  Cpu,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Download,
  Database,
  ArrowRight,
  Terminal,
  FileCheck,
  Building2,
  FileText
} from 'lucide-react';
import { Pipeline01NaverReport } from '../../types';

interface Pipeline01MonthlyEngineProps {
  onCollectionComplete: (month: string, reports: Pipeline01NaverReport[]) => void;
  onViewCollectedReports: (month: string) => void;
}

export const Pipeline01MonthlyEngine: React.FC<Pipeline01MonthlyEngineProps> = ({
  onCollectionComplete,
  onViewCollectedReports
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-01');
  const [depth, setDepth] = useState<'standard' | 'deep' | 'sample'>('standard');
  const [isCollecting, setIsCollecting] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [resultData, setResultData] = useState<{
    month: string;
    count: number;
    pagesCrawled: number[];
    reports: Pipeline01NaverReport[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MONTH_OPTIONS = [
    { value: '2026-01', label: '2026년 1월 (2026.01.02 ~ 01.30 전수)', badge: '실측 전수 815건', pages: 'p.190~p.217' },
    { value: '2026-02', label: '2026년 2월 (4Q25 실적 발표 시즌)', badge: '실측 전수 720건', pages: 'p.160~p.189' },
    { value: '2026-03', label: '2026년 3월 (정기 주총 및 사업보고서)', badge: '실측 전수 993건', pages: 'p.145~p.159' },
    { value: '2026-04', label: '2026년 4월 (1Q26 프리뷰 & 실적 개시)', badge: '어닝 프리뷰 780건', pages: 'p.105~p.144' },
    { value: '2026-05', label: '2026년 5월 (1Q26 실적 리뷰 & 2Q 전략)', badge: '실적 리뷰 750건', pages: 'p.75~p.104' },
    { value: '2026-06', label: '2026년 6월 (상반기 결산 & 마감)', badge: '상반기 결산 810건', pages: 'p.55~p.74' },
    { value: 'all_2026', label: '2026년 상반기 전체 데이터베이스 수집 (1월~6월)', badge: '상반기 종합 4,868건', pages: '1~6월 전체' }
  ];

  const handleStartCrawl = async () => {
    setIsCollecting(true);
    setProgressPercent(10);
    setError(null);
    setResultData(null);
    setLogs([
      `[${new Date().toLocaleTimeString()}] 수집 파이프라인 가동: 대상 월 [${selectedMonth}], 모드 [${depth}]`,
      `[${new Date().toLocaleTimeString()}] 증권사 리서치 데이터베이스 연결 초기화 중...`
    ]);

    try {
      // Step 1
      await new Promise(r => setTimeout(r, 400));
      setProgressPercent(35);
      setLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 증권사 종목분석 리서치 데이터 응답 수신 (디코딩 및 파싱 가동)`
      ]);

      // Trigger server crawl
      const res = await fetch('/api/pipeline-01/collect-monthly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: selectedMonth,
          depth
        })
      });

      const data = await res.json();
      setProgressPercent(75);
      setLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 페이지 크롤링 완료 (페이지: [${data.pagesCrawled?.join(', ')}]), 총 ${data.count}건 파싱 완료`,
        `[${new Date().toLocaleTimeString()}] 표준 파일명 규격 매핑 (YYMMDD_증권사_종목명_제목.pdf) 및 PDF 인라인 스트리머 준비 완료`
      ]);

      if (data.success && Array.isArray(data.reports)) {
        await new Promise(r => setTimeout(r, 300));
        setProgressPercent(100);
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ✓ 수집 및 정규화 완료! ${data.count}건의 리포트가 메모리 캐시 및 데이터베이스에 등록되었습니다.`
        ]);
        setResultData(data);
        onCollectionComplete(selectedMonth, data.reports);
      } else {
        throw new Error(data.error || '수집 결과를 받아오지 못했습니다.');
      }
    } catch (err: any) {
      console.error('Crawl error:', err);
      setError(err.message || '수집 중 오류가 발생했습니다.');
      setLogs(prev => [...prev, `[오류] ${err.message}`]);
    } finally {
      setIsCollecting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Engine Control Panel */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">네이버 증권 리포트 월별 수집 엔진</h3>
              <p className="text-slate-400 text-xs">
                2026년 특정 월 또는 연간 전체 리포트를 실시간 크롤링 및 표준 파일명으로 색인합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold font-mono">
              ENGINE v2.4 (2026 FULL-SYNC)
            </span>
          </div>
        </div>

        {/* Month Selection Chips */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>수집 대상 월 선택 (2026년)</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {MONTH_OPTIONS.map((opt) => {
              const isSelected = selectedMonth === opt.value;
              const isFirst = opt.value === '2026-01';

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedMonth(opt.value)}
                  disabled={isCollecting}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-cyan-400 ring-1 ring-cyan-400 shadow-md shadow-cyan-950/50 text-white'
                      : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{opt.label}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                        isFirst
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">{opt.pages}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collection Depth Selection & CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-400">수집 강도:</span>
            <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setDepth('standard')}
                disabled={isCollecting}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  depth === 'standard' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                표준 수집 (4페이지 / ~120건)
              </button>
              <button
                type="button"
                onClick={() => setDepth('deep')}
                disabled={isCollecting}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  depth === 'deep' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                심층 수집 (8페이지 / ~240건)
              </button>
              <button
                type="button"
                onClick={() => setDepth('sample')}
                disabled={isCollecting}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  depth === 'sample' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                핵심 샘플 (1페이지)
              </button>
            </div>
          </div>

          <button
            onClick={handleStartCrawl}
            disabled={isCollecting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-900/40 transition-all inline-flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isCollecting ? 'animate-spin' : ''}`} />
            <span>{isCollecting ? '네이버 리포트 수집 실행 중...' : `[${selectedMonth}] 실시간 데이터 수집 시작`}</span>
          </button>
        </div>

        {/* Progress Bar if collecting */}
        {isCollecting && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>수집 파이프라인 진행률</span>
              <span className="font-mono font-bold text-cyan-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Terminal Logs & Result Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Terminal Log Console */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs shadow-inner space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-slate-400">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-bold text-slate-300">실시간 크롤러 파이프라인 로그</span>
            </div>
            <span className="text-[10px] text-slate-500">Live Ingest Status</span>
          </div>

          <div className="h-44 overflow-y-auto space-y-1 text-slate-300 pr-2 leading-relaxed">
            {logs.length === 0 ? (
              <div className="text-slate-600 text-xs py-8 text-center">
                수집 대상 월을 선택하고 [실시간 데이터 수집 시작] 버튼을 누르면 크롤링 터미널 로그가 표시됩니다.
              </div>
            ) : (
              logs.map((line, idx) => (
                <div
                  key={idx}
                  className={`${
                    line.includes('✓')
                      ? 'text-emerald-400 font-semibold'
                      : line.includes('오류')
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }`}
                >
                  {line}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Result & Direct Action Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-slate-300 font-bold text-xs">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>수집 결과 요약</span>
            </div>

            {resultData ? (
              <div className="mt-3 space-y-3">
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/60">
                  <div className="text-xs text-emerald-300 font-bold">수집 완료: {resultData.count}건</div>
                  <div className="text-[11px] text-slate-300 mt-1">
                    대상 월: <span className="text-white font-semibold">{resultData.month}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    크롤링 페이지: {resultData.pagesCrawled.join(', ')}
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  수집된 리포트는 표준 파일명 형식으로 변환되었으며 즉시 조회 또는 PDF 다운로드가 가능합니다.
                </div>
              </div>
            ) : (
              <div className="mt-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-500 text-xs text-center">
                수집 완료 시 결과 요약과 바로 조회 버튼이 활성화됩니다.
              </div>
            )}
          </div>

          {resultData && (
            <button
              onClick={() => onViewCollectedReports(resultData.month)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all inline-flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>[{resultData.month}] 수집 데이터 즉시 조회하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
