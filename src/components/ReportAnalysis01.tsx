import React, { useState } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  FileCheck, 
  Target, 
  Award, 
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';

export const ReportAnalysis01: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<string>('반도체/IT/전자');

  const sectorMetrics = [
    {
      sector: '반도체/IT/전자',
      avgDepth: 94.8,
      avgContrarian: 91.2,
      targetAccuracy: 93.8,
      keyIssue: 'HBM4 아키텍처 전환 및 범용 D램 감산 해제에 따른 가격 스프레드 방어력 검증',
      topAnalyst: '김선우 (메리츠증권)'
    },
    {
      sector: '소비재/유통/음식료',
      avgDepth: 96.2,
      avgContrarian: 94.0,
      targetAccuracy: 98.4,
      keyIssue: 'K-Food 북미/유럽 침투율과 곡물 원가 래깅 효과에 따른 영업이익률 최고치 경신',
      topAnalyst: '한유정 (한화투자증권)'
    },
    {
      sector: '2차전지/배터리/소재',
      avgDepth: 91.5,
      avgContrarian: 89.6,
      targetAccuracy: 91.9,
      keyIssue: '전기차 캐즘 속 ESS 전력망 배터리 수요 급증 및 AMPC 보조금 현금흐름 정밀 분해',
      topAnalyst: '전창현 (대신증권)'
    },
    {
      sector: '바이오/제약/헬스케어',
      avgDepth: 88.4,
      avgContrarian: 85.9,
      targetAccuracy: 86.2,
      keyIssue: '차세대 ADC 플랫폼 임상 마일스톤과 반환의무 없는 계약금의 실질 가치 계량화',
      topAnalyst: '이안나 (교보증권)'
    },
    {
      sector: '자동차/모빌리티',
      avgDepth: 89.7,
      avgContrarian: 88.2,
      targetAccuracy: 88.5,
      keyIssue: '하이브리드(HEV) 고수익 믹스 방어와 완성차 자사주 매입·소각 등 밸류업 총주주환원율',
      topAnalyst: '강성진 (KB증권)'
    },
    {
      sector: '플랫폼/게임/엔터',
      avgDepth: 95.1,
      avgContrarian: 93.4,
      targetAccuracy: 97.2,
      keyIssue: '생성형 AI 검색 도입에 따른 플랫폼 체류시간 및 글로벌 엔터 팬덤 ARPU 구조적 성장',
      topAnalyst: '이선화 (KB증권)'
    },
    {
      sector: '금융/지주',
      avgDepth: 95.9,
      avgContrarian: 94.1,
      targetAccuracy: 96.8,
      keyIssue: '보통주자본(CET1) 비율 관리 목표와 은행 지주 총주주환원율 40% 도달 경로 선도 설계',
      topAnalyst: '김인 (유진투자증권)'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* 상단 헤더 배너 */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                애널리스트리포트_분석_01
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                분석 심도 & 객관성 가중치 30% 반영
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              리포트 분석 심도 & 정성·정량 평가 센터
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              단순 매수 일색의 리포트를 배제하고 팩트 기반 데이터 뎁스(Depth)와 역발상 리스크 경고(Contrarian) 지표를 정밀 계량화합니다.
            </p>
          </div>
        </div>

        {/* 4대 분석 평가 지표 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 border-t border-slate-800/80 pt-6">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">평균 리포트 심도 (Depth)</span>
            <strong className="text-xl font-bold font-mono text-emerald-400">92.8점 (S등급)</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">평균 역발상 리스크 점수</span>
            <strong className="text-xl font-bold font-mono text-indigo-300">91.5점</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">DART 추정 정밀도</span>
            <strong className="text-xl font-bold font-mono text-amber-300">95.8%</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">Table 1 평가 가중치</span>
            <strong className="text-xs font-mono text-purple-300 font-bold">TO-BE 30% / AS-IS 40%</strong>
          </div>
        </div>
      </div>

      {/* 섹터별 심도 및 쟁점 분석 그리드 */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-400" />
            <h3 className="text-base font-bold text-white">섹터별 리포트 분석 심도 및 핵심 쟁점 현황</h3>
          </div>
          <span className="text-xs text-slate-400">
            국내 10대 표준 섹터 전수 집계
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sectorMetrics.map((sec, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{sec.sector}</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                  심도 {sec.avgDepth}점
                </span>
              </div>

              <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                <strong className="text-slate-300 block mb-1">핵심 분석 쟁점:</strong>
                {sec.keyIssue}
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">섹터 최고 애널리스트:</span>
                <strong className="text-amber-300">{sec.topAnalyst}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
