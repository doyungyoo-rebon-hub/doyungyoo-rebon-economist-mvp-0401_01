import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  TrendingUp, 
  FileSpreadsheet,
  ExternalLink,
  Scale
} from 'lucide-react';

export const DartFactCheck: React.FC = () => {
  const [searchStock, setSearchStock] = useState<string>('삼성전자');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('2026-1Q');

  const mockFactChecks = [
    {
      stock: '삼성전자',
      code: '005930',
      broker: '메리츠증권',
      analyst: '김선우',
      reportTitle: 'HBM4 아키텍처 전환과 커스텀 파운드리 수율 변곡점',
      publishDate: '2026-03-18',
      analystEstOperatingProfit: '6.65조원',
      dartActualOperatingProfit: '6.61조원',
      errorRate: '0.6%',
      verdict: 'EXACT_MATCH',
      surpriseType: 'SURPRISE',
      dartReportName: '제58기 1분기보고서 (2026.05.15 공시)',
      dartUrl: 'https://dart.fss.or.kr'
    },
    {
      stock: '삼양식품',
      code: '003230',
      broker: '한화투자증권',
      analyst: '한유정',
      reportTitle: 'K-Food 글로벌 구조적 침투율과 원가 스프레드 역학 분석',
      publishDate: '2026-04-12',
      analystEstOperatingProfit: '840억원',
      dartActualOperatingProfit: '852억원',
      errorRate: '1.4%',
      verdict: 'EXACT_MATCH',
      surpriseType: 'SURPRISE',
      dartReportName: '제66기 1분기보고서 (2026.05.15 공시)',
      dartUrl: 'https://dart.fss.or.kr'
    },
    {
      stock: 'LG에너지솔루션',
      code: '373220',
      broker: '대신증권',
      analyst: '전창현',
      reportTitle: '캐즘 탈출의 조건: ESS 그리드 수요와 LFP 양산 원가 곡선',
      publishDate: '2026-03-24',
      analystEstOperatingProfit: '1,570억원',
      dartActualOperatingProfit: '1,573억원',
      errorRate: '0.2%',
      verdict: 'EXACT_MATCH',
      surpriseType: 'INLINE',
      dartReportName: '제6기 1분기보고서 (2026.05.14 공시)',
      dartUrl: 'https://dart.fss.or.kr'
    },
    {
      stock: '현대자동차',
      code: '005380',
      broker: 'KB증권',
      analyst: '강성진',
      reportTitle: '하이브리드(HEV) 믹스 개선에 따른 완성차 영업이익률 피크아웃 논쟁 종결',
      publishDate: '2026-04-08',
      analystEstOperatingProfit: '3.62조원',
      dartActualOperatingProfit: '3.56조원',
      errorRate: '1.7%',
      verdict: 'EXACT_MATCH',
      surpriseType: 'INLINE',
      dartReportName: '제60기 1분기보고서 (2026.05.15 공시)',
      dartUrl: 'https://dart.fss.or.kr'
    },
    {
      stock: 'KB금융',
      code: '105560',
      broker: '유진투자증권',
      analyst: '김인',
      reportTitle: '보통주자본비율(CET1) 관리 목표와 은행 지주 총주주환원율 40% 도달 경로',
      publishDate: '2026-02-27',
      analystEstOperatingProfit: '1.51조원',
      dartActualOperatingProfit: '1.49조원',
      errorRate: '1.3%',
      verdict: 'EXACT_MATCH',
      surpriseType: 'INLINE',
      dartReportName: '제19기 1분기보고서 (2026.05.15 공시)',
      dartUrl: 'https://dart.fss.or.kr'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-slate-800 p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Open DART API 전자공시망 교차검증 엔진
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                실적 추정 오차율 25% 가중치 반영
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              금융감독원 DART 공시 팩트체크 검증 센터
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              애널리스트가 리포트에서 제시한 분기·반기 영업이익 추정치를 기업의 실제 DART 확정 공시 재무제표와 1대 1 매칭하여 오차율을 정밀 계산합니다.
            </p>
          </div>
        </div>

        {/* 팩트체크 핵심 스탯 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 border-t border-slate-800/80 pt-6">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">DART 매칭 대상 공시</span>
            <strong className="text-xl font-bold font-mono text-white">4,868건 (전수)</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">평균 영업이익 오차율</span>
            <strong className="text-xl font-bold font-mono text-emerald-400">2.4% (초정밀)</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">어닝 서프라이즈 적중률</span>
            <strong className="text-xl font-bold font-mono text-indigo-300">91.8%</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">AI 환각 차단율</span>
            <strong className="text-xl font-bold font-mono text-amber-300">100% (원문 대조)</strong>
          </div>
        </div>
      </div>

      {/* 팩트체크 교차검증 목록 테이블 */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <h3 className="text-base font-bold text-white">수상자 주요 리포트 DART 실적 대사 검증표</h3>
          </div>
          <span className="text-xs text-slate-400">
            검증 기준: 발간일 기준 전후 30일 내 기업 확정 분기/사업보고서
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold">
                <th className="p-4">대상 기업</th>
                <th className="p-4">애널리스트 (증권사)</th>
                <th className="p-4">리포트명 / 발간일</th>
                <th className="p-4 text-right">리포트 추정치</th>
                <th className="p-4 text-right">DART 확정 공시</th>
                <th className="p-4 text-center">추정 오차율</th>
                <th className="p-4 text-center">검증 결과</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mockFactChecks.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-bold text-white">
                    {row.stock} <span className="text-[10px] text-slate-500 font-mono">({row.code})</span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-200 font-semibold">{row.analyst}</span>
                    <span className="text-slate-500 text-[11px] block">{row.broker}</span>
                  </td>
                  <td className="p-4 max-w-xs">
                    <span className="text-slate-300 block truncate font-medium">{row.reportTitle}</span>
                    <span className="text-slate-500 text-[10px]">{row.publishDate}</span>
                  </td>
                  <td className="p-4 text-right font-mono font-semibold text-indigo-300">
                    {row.analystEstOperatingProfit}
                  </td>
                  <td className="p-4 text-right font-mono font-semibold text-emerald-300">
                    {row.dartActualOperatingProfit}
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {row.errorRate}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 size={13} />
                      일치 (PASS)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
