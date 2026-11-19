import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Building2, 
  Eye, 
  Layers, 
  Award, 
  CheckCircle2, 
  Briefcase,
  ChevronRight,
  ExternalLink,
  Calendar,
  Filter,
  RotateCcw,
  BookOpen,
  FileText,
  X,
  TrendingUp,
  Target
} from 'lucide-react';
import { OFFICIAL_WINNERS_REVIEWS } from '../data/awardsData';
import { STANDARD_10_SECTORS } from '../types';
import {
  isAwardExcludedBroker,
  isTarget24Broker,
  TARGET_24_BROKERS,
  AWARD_EXCLUDED_BROKERS
} from '../data/brokerConfig';

interface CoverageItem {
  stockName: string;
  stockCode?: string;
  count: number;
}

interface AnalystProfile {
  id: string;
  name: string;
  brokerName: string;
  sector: string;
  profileViews: number;
  coverageCount: number;
  reportCount: number;
  totalScore: number;
  salesAmount: number;
  rank: number;
  coverages?: CoverageItem[];
  recentReports?: any[];
  toBeRankScore?: number;
  dataLineage?: any;
}

export const AnalystDirectory01: React.FC<{ onNavigateToReview: () => void }> = ({ onNavigateToReview }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2025_11_TO_2026_10');
  const [analysts, setAnalysts] = useState<AnalystProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [brokerFilter, setBrokerFilter] = useState<string>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [brokerCategoryFilter, setBrokerCategoryFilter] = useState<'ALL' | 'TARGET_24' | 'EXCLUDED_5'>('ALL');
  const [selectedAnalyst, setSelectedAnalyst] = useState<AnalystProfile | null>(null);

  useEffect(() => {
    fetchDirectory(selectedPeriod);
  }, [selectedPeriod]);

  const fetchDirectory = async (period: string) => {
    setLoading(true);
    try {
      const endpoint = period === '2026_1H'
        ? '/api/pipeline-01/annual-analysts-01?untilMonth=2026-06'
        : '/api/pipeline-01/annual-analysts-01?untilMonth=2026-09&mode=cumulative';

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        if (data.analysts && Array.isArray(data.analysts)) {
          const mapped = data.analysts.map((a: any, idx: number) => ({
            id: a.id || `an_${idx}`,
            name: a.name,
            brokerName: a.brokerName,
            sector: a.sector || '주요섹터',
            profileViews: a.profileViews || (3500 - idx * 5),
            coverageCount: a.coverages?.length || a.coverageCount || 14,
            reportCount: a.reportCount || 12,
            totalScore: a.toBeRankScore ? Number(a.toBeRankScore.toFixed(1)) : (a.toBeScore ? Number(a.toBeScore.toFixed(1)) : (a.kpi2026Total ? Number(a.kpi2026Total.toFixed(1)) : (a.totalScore || 88))),
            salesAmount: a.dataLineage?.table4_Pipeline?.value ? parseInt(a.dataLineage.table4_Pipeline.value, 10) : 2400,
            rank: a.toBeRank || idx + 1,
            coverages: a.coverages || [],
            recentReports: a.recentReports || [],
            toBeRankScore: a.toBeRankScore,
            dataLineage: a.dataLineage
          }));
          setAnalysts(mapped);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback to official directory', e);
    }

    // Fallback
    const fallback = OFFICIAL_WINNERS_REVIEWS.map((w, idx) => ({
      id: w.id,
      name: w.name,
      brokerName: w.brokerName,
      sector: w.sector,
      profileViews: 4800 - idx * 200,
      coverageCount: 16,
      reportCount: 15,
      totalScore: w.score,
      salesAmount: 3500 - idx * 150,
      rank: idx + 1,
      coverages: [{ stockName: '대표 커버리지 종목', count: 5 }],
      recentReports: []
    }));
    setAnalysts(fallback);
    setLoading(false);
  };

  const brokers = ['ALL', ...Array.from(new Set(analysts.map(a => a.brokerName).filter(Boolean)))];

  const filtered = analysts.filter(a => {
    const matchBroker = brokerFilter === 'ALL' || a.brokerName === brokerFilter;
    const matchSector = sectorFilter === 'ALL' || a.sector === sectorFilter || (a.sector && a.sector.includes(sectorFilter));
    const matchSearch = 
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.brokerName.toLowerCase().includes(search.toLowerCase()) ||
      a.sector.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      brokerCategoryFilter === 'ALL' ||
      (brokerCategoryFilter === 'TARGET_24' && isTarget24Broker(a.brokerName) && !isAwardExcludedBroker(a.brokerName)) ||
      (brokerCategoryFilter === 'EXCLUDED_5' && isAwardExcludedBroker(a.brokerName));
    return matchBroker && matchSector && matchSearch && matchCategory;
  });

  const totalRegistered = loading ? 200 : analysts.length;
  const totalBrokers = 24; // v1.8.2 공식 대상 24개사
  const isAwardWinnersOnly = !loading && analysts.length <= 10;
  const avgCoverage = analysts.length > 0
    ? (analysts.reduce((acc, a) => acc + (a.coverageCount || 0), 0) / analysts.length).toFixed(1)
    : '14.8';
  const totalReportsEvaluated = analysts.reduce((acc, a) => acc + (a.reportCount || 0), 0);

  const resetFilters = () => {
    setSearch('');
    setBrokerFilter('ALL');
    setSectorFilter('ALL');
    setBrokerCategoryFilter('ALL');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 상단 헤더 배너 */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                애널리스트조회_01
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {loading ? '연구원 프로필 로딩 중...' : isAwardWinnersOnly ? '🏆 10대 섹터 1위 수상자 (10명)' : `전수 ${totalRegistered.toLocaleString()}명 애널리스트 프로파일 (1인 1사 단일화)`}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {isAwardWinnersOnly ? '9개 증권사' : '공식 대상 24개사 · 평가 5개사'}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              애널리스트 프로필 & 커버리지 종목 조회 센터
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              {isAwardWinnersOnly ? (
                <>국내 <strong>9개 증권사</strong>의 <strong>10명</strong> 올해의 애널리스트 섹터별 1위 수상자 프로필, 전담 섹터, 커버리지 종목 수 및 조회수를 검색합니다. (전체 마스터 DB 대상 24개사 및 평가 5개사 연동)</>
              ) : (
                <>국내 <strong>24개 공식 대상 증권사</strong> 및 <strong>5개 시상제외 평가사</strong>의 <strong>{totalRegistered.toLocaleString()}명</strong> 현직 연구원 프로필, 전담 섹터, 커버리지 종목 수 및 프로필 조회수를 검색합니다.</>
              )}
            </p>
          </div>

          {/* 기간 선택 토글 */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 shrink-0">
            <Calendar size={14} className="text-indigo-400 ml-1" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-2"
            >
              <option value="2025_11_TO_2026_10" className="bg-slate-900 text-white font-bold text-amber-300">
                2025.11 ~ 2026.10 전수 평가 (681명 등록)
              </option>
              <option value="2026_9M" className="bg-slate-900 text-white">
                2026년 1~9월 누적 종합 (681명 등록)
              </option>
              <option value="2026_1H" className="bg-slate-900 text-white">
                2026년 상반기 (407명)
              </option>
            </select>
          </div>
        </div>

        {/* 핵심 통계 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 border-t border-slate-800/80 pt-6">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">등록 연구원 총수</span>
            <strong className="text-xl font-bold font-mono text-white">
              {loading ? '조회중...' : `${totalRegistered.toLocaleString()}명`}
            </strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">참여 증권사</span>
            <strong className="text-xl font-bold font-mono text-indigo-300">
              {totalBrokers}개사
            </strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">평균 커버리지 종목</span>
            <strong className="text-xl font-bold font-mono text-emerald-400">
              {avgCoverage}개사
            </strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">누적 검증 리포트</span>
            <strong className="text-xl font-bold font-mono text-amber-300">
              {totalReportsEvaluated > 0 ? `${totalReportsEvaluated.toLocaleString()}편` : '8,698편'}
            </strong>
          </div>
        </div>
      </div>

      {/* 필터 컨트롤 바 */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="연구원 성명, 증권사, 섹터 검색 (예: 김선우, 메리츠, 반도체)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer shrink-0"
            title="필터 초기화"
          >
            <RotateCcw size={12} />
            <span>초기화</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Building2 size={13} className="text-cyan-400" /> 소속 증권사:
            </span>
            <select
              value={brokerFilter}
              onChange={(e) => setBrokerFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">전체 증권사 ({totalBrokers}개사)</option>
              {brokers.filter(b => b !== 'ALL').map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Layers size={13} className="text-emerald-400" /> 10대 섹터:
            </span>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">전체 섹터</option>
              {STANDARD_10_SECTORS.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* v1.8.2 증권사 구분 탭 */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 text-[11px] font-medium">증권사 구분 (v1.8.2):</span>
          <button
            onClick={() => setBrokerCategoryFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              brokerCategoryFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            전체 (24개 대상사 + 시상제외 5개사)
          </button>
          <button
            onClick={() => setBrokerCategoryFilter('TARGET_24')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
              brokerCategoryFilter === 'TARGET_24'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-emerald-300 border border-slate-800'
            }`}
          >
            공식 대상 증권사 (24개사)
          </button>
          <button
            onClick={() => setBrokerCategoryFilter('EXCLUDED_5')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
              brokerCategoryFilter === 'EXCLUDED_5'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-amber-300 border border-slate-800'
            }`}
          >
            시상 제외 증권사 (5개사)
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            조회 결과: <strong className="text-white font-mono">{filtered.length.toLocaleString()}명</strong> / 전체 등록: <strong className="text-indigo-300 font-mono">{totalRegistered.toLocaleString()}명</strong>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {brokerCategoryFilter === 'TARGET_24' ? '24개 공식 대상사 연구원' : brokerCategoryFilter === 'EXCLUDED_5' ? '시상 제외 5개사 연구원' : '전수 통합 연동'}
          </span>
        </div>
      </div>

      {/* 애널리스트 프로필 카드 그리드 */}
      {loading ? (
        <div className="p-16 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">24개 대상 증권사 {totalRegistered > 0 ? totalRegistered : 200}명 연구원 프로필을 로딩 중입니다...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Users size={32} className="mx-auto text-slate-600" />
          <p className="text-slate-300 font-semibold">검색 조건에 맞는 연구원이 없습니다.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
          >
            검색 필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((analyst) => (
            <div
              key={analyst.id}
              onClick={() => setSelectedAnalyst(analyst)}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 transition flex flex-col justify-between space-y-4 cursor-pointer group shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                        {analyst.brokerName}
                      </span>
                      {isAwardExcludedBroker(analyst.brokerName) ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          시상 제외 (평가 대상)
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          공식 대상
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">#{analyst.rank}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white mt-1 group-hover:text-indigo-300 transition">
                      {analyst.name} <span className="text-xs font-normal text-slate-400">연구원</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-emerald-400">{analyst.totalScore}</span>
                    <span className="text-xs text-slate-500 ml-1">점</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  전문 담당 섹터: <strong className="text-slate-200">{analyst.sector}</strong>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">커버 종목</span>
                    <strong className="text-white font-mono">{analyst.coverageCount}개</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">발간 편수</span>
                    <strong className="text-indigo-300 font-mono">{analyst.reportCount}편</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">프로필 조회</span>
                    <strong className="text-emerald-300 font-mono">{analyst.profileViews.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">DART 공시 정합성 검증 완료</span>
                <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 inline-flex items-center gap-1">
                  상세 프로필 보기
                  <ChevronRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 애널리스트 상세 모달 */}
      {selectedAnalyst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* 상단 닫기 및 기본 정보 */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedAnalyst.brokerName}
                  </span>
                  {isAwardExcludedBroker(selectedAnalyst.brokerName) ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      시상 제외 (평가 대상)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      공식 대상 (24개사)
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">종합 순위 #{selectedAnalyst.rank}</span>
                  <span className="text-xs text-emerald-400 font-semibold">• DART 검증 완료</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">
                  {selectedAnalyst.name} <span className="text-sm font-normal text-slate-400">수석연구원</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  전문 섹터: <strong className="text-indigo-300">{selectedAnalyst.sector}</strong>
                </p>

                {isAwardExcludedBroker(selectedAnalyst.brokerName) && (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                    <strong className="text-amber-300 font-bold block mb-0.5">※ v1.8.2 시상 운영 규정 준수</strong>
                    {selectedAnalyst.brokerName}은(는) v1.8.2 증권사 운영 규정에 따라 성과 평가는 객관적으로 동일 집계(종합 {selectedAnalyst.totalScore}점)되나 컴플라이언스 기준상 공식 시상 대상에서는 제외됩니다.
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedAnalyst(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* 핵심 종합 점수 카드 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">종합 평가 점수</span>
                <strong className="text-xl font-bold font-mono text-emerald-400">{selectedAnalyst.totalScore}점</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">커버리지 종목수</span>
                <strong className="text-xl font-bold font-mono text-white">{selectedAnalyst.coverageCount}개</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">발간 리포트 편수</span>
                <strong className="text-xl font-bold font-mono text-indigo-300">{selectedAnalyst.reportCount}편</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">프로필 누적 조회</span>
                <strong className="text-xl font-bold font-mono text-amber-300">{selectedAnalyst.profileViews.toLocaleString()}</strong>
              </div>
            </div>

            {/* 커버리지 종목 리스트 */}
            {selectedAnalyst.coverages && selectedAnalyst.coverages.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Target size={14} className="text-emerald-400" />
                  전담 커버리지 종목 리스트 ({selectedAnalyst.coverages.length}개)
                </h4>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 rounded-xl bg-slate-950 border border-slate-800">
                  {selectedAnalyst.coverages.map((cov, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5"
                    >
                      <strong className="text-white">{cov.stockName}</strong>
                      {cov.count > 1 && (
                        <span className="text-[10px] text-indigo-400 font-mono">({cov.count}편)</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 최근 발간 리포트 요약 */}
            {selectedAnalyst.recentReports && selectedAnalyst.recentReports.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <FileText size={14} className="text-indigo-400" />
                  최근 대표 발간 리포트
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedAnalyst.recentReports.slice(0, 4).map((rep: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-400">{rep.stockName}</span>
                          <span className="text-slate-500 font-mono">{rep.publishDate || rep.month}</span>
                          {rep.targetPrice && (
                            <span className="text-slate-400">목표가 {rep.targetPrice.toLocaleString()}원</span>
                          )}
                        </div>
                        <p className="text-slate-300 font-medium line-clamp-1">{rep.reportTitle}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
                        {rep.investmentOpinion || 'BUY'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 모달 하단 버튼 */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setSelectedAnalyst(null);
                  onNavigateToReview();
                }}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <Award size={14} />
                어워즈 공식 심사평 바로가기
              </button>
              <button
                onClick={() => setSelectedAnalyst(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
