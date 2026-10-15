import React, { useState } from 'react';
import { Header } from './components/Header';
import { AnalystAwards01Review } from './components/AnalystAwards01Review';
import { AnalystAwards01 } from './components/AnalystAwards01';
import { ReportLookup01 } from './components/ReportLookup01';
import { ReportAnalysis01 } from './components/ReportAnalysis01';
import { AnalystDirectory01 } from './components/AnalystDirectory01';
import { Pipeline01 } from './components/Pipeline01';
import { DartFactCheck } from './components/DartFactCheck';
import { TargetPriceAccuracyChart } from './components/TargetPriceAccuracyChart';
import { VersionManager } from './components/VersionManager';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('analysts_01');
  const [selectedReportForChart, setSelectedReportForChart] = useState<any>(null);
  const [selectedReportForAnalysis, setSelectedReportForAnalysis] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'analysts_01' && (
          <AnalystAwards01 
            onNavigateToReview={() => setCurrentTab('analysts_01_review')}
            onNavigateToChart={(report) => {
              if (report) setSelectedReportForChart(report);
              setCurrentTab('target_price_accuracy');
            }}
            onNavigateToAnalysis={(report) => {
              if (report) setSelectedReportForAnalysis(report);
              setCurrentTab('report_analysis_01');
            }}
          />
        )}

        {currentTab === 'analysts_01_review' && (
          <AnalystAwards01Review />
        )}

        {currentTab === 'report_lookup_01' && (
          <ReportLookup01 
            onNavigateToAnalysis={(report) => {
              if (report) setSelectedReportForAnalysis(report);
              setCurrentTab('report_analysis_01');
            }}
          />
        )}

        {currentTab === 'report_analysis_01' && (
          <ReportAnalysis01 
            initialSelectedReport={selectedReportForAnalysis}
            onNavigateToChart={(report) => {
              if (report) setSelectedReportForChart(report);
              setCurrentTab('target_price_accuracy');
            }} 
          />
        )}

        {currentTab === 'target_price_accuracy' && (
          <TargetPriceAccuracyChart 
            initialReport={selectedReportForChart}
            onNavigateToReportAnalysis={(report) => {
              if (report) setSelectedReportForAnalysis(report);
              setCurrentTab('report_analysis_01');
            }}
          />
        )}

        {currentTab === 'analyst_directory_01' && (
          <AnalystDirectory01 onNavigateToReview={() => setCurrentTab('analysts_01_review')} />
        )}

        {currentTab === 'pipeline_01' && (
          <Pipeline01 />
        )}

        {currentTab === 'dart_fact_check' && (
          <DartFactCheck />
        )}

        {currentTab === 'version_manager' && (
          <VersionManager />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-400">
            리본인텔리전스 × 이코노미스트 공동주관 「2026 올해의 애널리스트 어워즈」
          </p>
          <p>
            독립 공인 AI 수석 심사평가 엔진 | DART 금융감독원 전자공시 팩트체크 검증 완료 | VERSION 1.8.1
          </p>
          <p className="text-[11px] text-slate-500">
            본 평가 리포트는 금융감독원 공시 데이터와 국내 24개 공식 대상 증권사 및 5개 시상제외 평가사(총 7,158건 / 1~9월 전수)의 실제 발간 리서치 리포트를 정밀 분석한 독립 AI 평가 결과입니다.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
