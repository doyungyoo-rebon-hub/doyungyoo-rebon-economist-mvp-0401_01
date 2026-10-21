import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Wallet, 
  Calculator, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sliders, 
  Search, 
  Award,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign
} from 'lucide-react';
import { 
  IRP_MARKET_SUMMARY, 
  IRP_BROKER_LEADERBOARD, 
  IRP_MODEL_PORTFOLIOS, 
  IRP_RECOMMENDED_ETFS,
  IRPBrokerPerformance,
  IRPModelPortfolio
} from '../data/irpData';

export const IRPDashboard: React.FC = () => {
  // 1. Model Portfolio selection state
  const [selectedModelId, setSelectedModelId] = useState<string>("growth_alpha");
  const selectedModel = useMemo(() => {
    return IRP_MODEL_PORTFOLIOS.find(m => m.id === selectedModelId) || IRP_MODEL_PORTFOLIOS[0];
  }, [selectedModelId]);

  // 2. Interactive user asset allocation state (customizable)
  const [userHoldings, setUserHoldings] = useState([
    { id: '1', name: 'TIGER 미국S&P500', code: '360750', category: '위험자산' as const, ratio: 40, yield1Y: 34.8, expense: 0.07 },
    { id: '2', name: 'ACE 미국나스닥100', code: '367380', category: '위험자산' as const, ratio: 28, yield1Y: 39.2, expense: 0.07 },
    { id: '3', name: 'ACE 미국30년국채액티브(H)', code: '453850', category: '안전(혼합)자산' as const, ratio: 20, yield1Y: 11.2, expense: 0.05 },
    { id: '4', name: 'KODEX KOFR금리액티브(합성)', code: '423160', category: '안전(혼합)자산' as const, ratio: 12, yield1Y: 3.65, expense: 0.03 }
  ]);

  // 3. Broker Leaderboard sorting & filtering
  const [brokerSearch, setBrokerSearch] = useState<string>('');
  const [brokerSortBy, setBrokerSortBy] = useState<'1Y' | '3Y' | '5Y' | 'balance' | 'guaranteed'>('1Y');
  const [feeFreeOnly, setFeeFreeOnly] = useState<boolean>(false);

  // 4. Tax & Compound Calculator state
  const [salaryBracket, setSalaryBracket] = useState<'under55m' | 'over55m'>('under55m');
  const [annualContributionWon, setAnnualContributionWon] = useState<number>(9000000); // 900만원 기본
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(8.5); // 8.5%
  const [investmentYears, setInvestmentYears] = useState<number>(20); // 20년

  // 5. ETF filter state
  const [etfCategoryFilter, setEtfCategoryFilter] = useState<'ALL' | '위험자산' | '안전(혼합)자산'>('ALL');

  // Calculations for user portfolio
  const riskAssetRatio = useMemo(() => {
    return userHoldings
      .filter(h => h.category === '위험자산')
      .reduce((sum, h) => sum + h.ratio, 0);
  }, [userHoldings]);

  const safeAssetRatio = useMemo(() => {
    return userHoldings
      .filter(h => h.category === '안전(혼합)자산')
      .reduce((sum, h) => sum + h.ratio, 0);
  }, [userHoldings]);

  const isRiskLimitCompliant = riskAssetRatio <= IRP_MARKET_SUMMARY.riskAssetLimitPct;

  const weightedPortfolioYield = useMemo(() => {
    const totalRatio = userHoldings.reduce((sum, h) => sum + h.ratio, 0);
    if (totalRatio === 0) return 0;
    const weighted = userHoldings.reduce((sum, h) => sum + (h.yield1Y * h.ratio), 0);
    return Math.round((weighted / totalRatio) * 10) / 10;
  }, [userHoldings]);

  // Apply model portfolio to user holdings
  const applyModelPortfolio = (model: IRPModelPortfolio) => {
    setSelectedModelId(model.id);
    const converted = model.items.map((item, idx) => {
      const etfMatch = IRP_RECOMMENDED_ETFS.find(e => e.code === item.code);
      return {
        id: String(idx + 1),
        name: item.name,
        code: item.code,
        category: item.category,
        ratio: item.ratio,
        yield1Y: etfMatch ? etfMatch.yield1Y : 8.5,
        expense: etfMatch ? etfMatch.expenseRatioPct : 0.05
      };
    });
    setUserHoldings(converted);
  };

  // Filtered & sorted brokers
  const processedBrokers = useMemo(() => {
    return IRP_BROKER_LEADERBOARD
      .filter(b => {
        if (feeFreeOnly && !b.isDirectFeeFree) return false;
        if (brokerSearch.trim()) {
          const q = brokerSearch.trim().toLowerCase();
          return b.brokerName.toLowerCase().includes(q) || b.topRecommendedEtf.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (brokerSortBy === '1Y') return b.nonGuaranteedYield1Y - a.nonGuaranteedYield1Y;
        if (brokerSortBy === '3Y') return b.nonGuaranteedYield3Y - a.nonGuaranteedYield3Y;
        if (brokerSortBy === '5Y') return b.nonGuaranteedYield5Y - a.nonGuaranteedYield5Y;
        if (brokerSortBy === 'balance') return b.totalBalanceEok - a.totalBalanceEok;
        if (brokerSortBy === 'guaranteed') return b.guaranteedYield1Y - a.guaranteedYield1Y;
        return 0;
      });
  }, [brokerSearch, brokerSortBy, feeFreeOnly]);

  // Tax calculation
  const taxRate = salaryBracket === 'under55m' ? 0.165 : 0.132;
  const eligibleDeductionWon = Math.min(annualContributionWon, IRP_MARKET_SUMMARY.maxTaxDeductionLimitWon);
  const annualTaxRefundWon = Math.round(eligibleDeductionWon * taxRate);

  // Future compound value calculation: FV = PMT * [((1 + r)^n - 1) / r]
  const compoundFutureValueWon = useMemo(() => {
    const r = expectedReturnRate / 100;
    const n = investmentYears;
    const pmt = annualContributionWon;
    if (r === 0) return pmt * n;
    const futureVal = pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    return Math.round(futureVal);
  }, [annualContributionWon, expectedReturnRate, investmentYears]);

  const totalPrincipalWon = annualContributionWon * investmentYears;
  const compoundEarningsWon = Math.max(0, compoundFutureValueWon - totalPrincipalWon);

  // Format money into Korean Eok/Man
  const formatKoreanMoney = (won: number) => {
    const eok = Math.floor(won / 100000000);
    const man = Math.floor((won % 100000000) / 10000);
    if (eok > 0) {
      return `${eok.toLocaleString()}억 ${man > 0 ? `${man.toLocaleString()}만` : ''}원`;
    }
    return `${man.toLocaleString()}만원`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ===================== [1. 상단 타이틀 & 헤더 바] ===================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <span>금융감독원 통합연금포털 공시 연동</span>
            <span aria-hidden="true">·</span>
            <span>2026 퇴직연금감독규정 개정 반영</span>
            <span aria-hidden="true">·</span>
            <span>위험자산 70% 준수 모니터링</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Wallet className="w-7 h-7 text-amber-400" />
            개인형 퇴직연금(IRP) 통합 분석 대시보드
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            국내 24개 증권사 IRP 공시 수익률 비교, 위험자산 70% 한도 컴플라이언스 체커, 
            세액공제 최대 148.5만원 절세 및 복리 운용 포트폴리오를 실시간 분석합니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-right">
            <span className="text-[11px] text-slate-400 block font-medium">연간 세액공제 한도</span>
            <span className="text-base font-bold text-emerald-400 font-mono">최대 900만원 (16.5%)</span>
          </div>
        </div>
      </div>

      {/* ===================== [2. 4대 핵심 시장 지표 KPI 카드] ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>IRP 전체 시장 적립금</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {IRP_MARKET_SUMMARY.totalMarketSizeJo}조원
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>전년 대비 +{IRP_MARKET_SUMMARY.marketGrowthRatePct}% 고속 성장</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>증권업 평균 실적배당 수익률</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            +{IRP_MARKET_SUMMARY.avgSecuritiesYield1Y}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            <span>은행업권(+{IRP_MARKET_SUMMARY.avgBankYield1Y}%) 대비 +5.88%p 초과</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>위험자산 70% 규제 한도</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 font-mono">
            최대 70.0%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            <span>안전자산(채권·TDF·예금) 30% 의무 편입</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>올해 연말정산 최대 환급</span>
            <Calculator className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {formatKoreanMoney(IRP_MARKET_SUMMARY.maxTaxRefundUnder55m)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            <span>총급여 5,500만원 이하 16.5% 세액공제</span>
          </div>
        </div>
      </div>

      {/* ===================== [3. 인터랙티브 위젯: IRP 포트폴리오 비중 & 위험자산 70% 규제 체커] ===================== */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <PieChartIcon className="w-4 h-4" />
              <span>Portfolio Allocation & Compliance Monitor</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              IRP 포트폴리오 자산배분 비중 및 위험자산 70% 규제 트래커
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              퇴직연금감독규정에 따라 주식형 ETF 등 위험자산은 계좌 평가액의 최대 70%까지만 매수할 수 있습니다.
            </p>
          </div>

          {/* 모델 포트폴리오 원클릭 적용 버튼 세트 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 mr-1">추천 모델 적용:</span>
            {IRP_MODEL_PORTFOLIOS.map(m => (
              <button
                key={m.id}
                onClick={() => applyModelPortfolio(m)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedModelId === m.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {m.title.split(' ')[0]} {m.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* 규제 한도 프로그레스 바 & 컴플라이언스 인디케이터 */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-slate-300">위험자산 편입 현황</span>
              {isRiskLimitCompliant ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  규제 준수 (안전)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  한도 초과 경고 (매수 불가)
                </span>
              )}
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400">포트폴리오 가중 1년 수익률: </span>
              <strong className="text-emerald-400 font-mono font-bold text-sm">+{weightedPortfolioYield}%</strong>
            </div>
          </div>

          {/* 양방향 스택 바 */}
          <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800 relative">
            {/* 70% 규제선 마커 */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
              style={{ left: '70%' }}
              title="위험자산 법정 최대 한도 (70%)"
            />
            <div 
              className={`h-full rounded-l-full transition-all duration-500 ${
                riskAssetRatio > 70 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
              }`}
              style={{ width: `${Math.min(100, riskAssetRatio)}%` }}
            />
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-r-full transition-all duration-500"
              style={{ width: `${Math.max(0, 100 - riskAssetRatio)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>위험자산(주식형 ETF): <strong>{riskAssetRatio}%</strong></span>
              <span className="text-slate-600">/ 법정 한도 70.0%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600">의무 30.0% /</span>
              <span>안전자산(채권·TDF·금리형): <strong>{safeAssetRatio}%</strong></span>
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            </div>
          </div>
        </div>

        {/* 현재 편입 자산 리스트 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">자산 구분</th>
                <th className="py-2.5 px-3">상품명 (ETF)</th>
                <th className="py-2.5 px-3">종목코드</th>
                <th className="py-2.5 px-3 text-right">포트폴리오 비중</th>
                <th className="py-2.5 px-3 text-right">1년 수익률</th>
                <th className="py-2.5 px-3 text-right">총보수</th>
                <th className="py-2.5 px-3 text-center">비중 조절</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {userHoldings.map((h, idx) => (
                <tr key={h.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      h.category === '위험자산' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {h.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-100 flex items-center gap-1.5">
                    <span>{h.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{h.code}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-bold font-mono text-sm text-white">{h.ratio}%</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">
                    +{h.yield1Y}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">
                    {h.expense}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => {
                          const updated = [...userHoldings];
                          if (updated[idx].ratio > 5) {
                            updated[idx].ratio -= 5;
                            setUserHoldings(updated);
                          }
                        }}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...userHoldings];
                          updated[idx].ratio += 5;
                          setUserHoldings(updated);
                        }}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 선택된 모델 포트폴리오 설명 카드 */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-semibold mb-0.5">
              {selectedModel.title} 가이드라인
            </strong>
            <span>{selectedModel.description}</span>
          </div>
        </div>
      </div>

      {/* ===================== [4. 인터랙티브 위젯: IRP 연말정산 세액공제 & 복리 은퇴자산 시뮬레이터] ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="lg:col-span-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" />
              <span>Tax & Compound Wealth Simulator</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              IRP 세액공제 & 복리 은퇴자산 시뮬레이터
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              연간 납입액과 기대수익률에 따라 돌려받는 세금 환급액과 10~20년 후 은퇴자산 복리 규모를 산출합니다.
            </p>
          </div>

          {/* 소득 구간 선택 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              나의 총급여(종합소득) 구간:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSalaryBracket('under55m')}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                  salaryBracket === 'under55m'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>총급여 5,500만원 이하</div>
                <div className="text-[11px] opacity-75 font-mono">16.5% 세액공제 (최대 148.5만)</div>
              </button>

              <button
                onClick={() => setSalaryBracket('over55m')}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                  salaryBracket === 'over55m'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>총급여 5,500만원 초과</div>
                <div className="text-[11px] opacity-75 font-mono">13.2% 세액공제 (최대 118.8만)</div>
              </button>
            </div>
          </div>

          {/* 연간 납입금액 슬라이더 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">연간 납입 금액:</span>
              <span className="font-bold text-white font-mono text-sm">{formatKoreanMoney(annualContributionWon)}</span>
            </div>
            <input
              type="range"
              min={1000000}
              max={18000000}
              step={500000}
              value={annualContributionWon}
              onChange={(e) => setAnnualContributionWon(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>100만원</span>
              <span className="text-amber-400 font-semibold">공제한도 900만원</span>
              <span>최대한도 1,800만원</span>
            </div>
          </div>

          {/* 기대수익률 슬라이더 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">연평균 기대수익률:</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{expectedReturnRate}%</span>
            </div>
            <input
              type="range"
              min={3.0}
              max={15.0}
              step={0.5}
              value={expectedReturnRate}
              onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>원리금보장 3.5%</span>
              <span className="text-slate-400">증권사 평균 8.5%</span>
              <span>미국지수 추종 12.0%+</span>
            </div>
          </div>

          {/* 운용 기간 슬라이더 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">은퇴까지 운용 기간:</span>
              <span className="font-bold text-white font-mono text-sm">{investmentYears}년</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={investmentYears}
              onChange={(e) => setInvestmentYears(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5년</span>
              <span>15년</span>
              <span>30년</span>
            </div>
          </div>
        </div>

        {/* 시뮬레이션 결과 디스플레이 */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/80 border border-slate-800 rounded-xl p-5 sm:p-6">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">
              시뮬레이션 산출 요약 ({investmentYears}년 누적)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400 block mb-1">올해 돌려받는 세액공제 환급금</span>
                <span className="text-2xl font-bold text-emerald-400 font-mono">
                  +{annualTaxRefundWon.toLocaleString()}원
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  (연간 납입 {formatKoreanMoney(eligibleDeductionWon)} × {(taxRate * 100).toFixed(1)}%)
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400 block mb-1">{investmentYears}년 후 만기 예상 은퇴 자산</span>
                <span className="text-2xl font-bold text-amber-400 font-mono">
                  {formatKoreanMoney(compoundFutureValueWon)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  (원금 {formatKoreanMoney(totalPrincipalWon)} + 복리이자 {formatKoreanMoney(compoundEarningsWon)})
                </span>
              </div>
            </div>

            {/* 시각화 프로그레스 & 복리 효과 */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">자산 구성: 원금 vs 복리 수익</span>
                <span className="text-amber-400 font-mono">수익률 기여 +{Math.round((compoundEarningsWon / totalPrincipalWon) * 100)}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                <div 
                  className="bg-slate-600 h-full"
                  style={{ width: `${Math.round((totalPrincipalWon / compoundFutureValueWon) * 100)}%` }}
                  title="납입 원금"
                />
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full"
                  style={{ width: `${Math.round((compoundEarningsWon / compoundFutureValueWon) * 100)}%` }}
                  title="복리 수익"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>납입 원금: {formatKoreanMoney(totalPrincipalWon)}</span>
                <span>복리 운용 수익: {formatKoreanMoney(compoundEarningsWon)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed">
            💡 <strong>과세이연 및 절세 혜택:</strong> 일반 계좌에서 ETF 매매 시 매년 15.4% 배당소득세가 원천징수되지만, 
            IRP 계좌에서는 만 55세 연금 수령 전까지 세금이 전혀 떼이지 않고 전액 재투자되며, 
            수령 시에도 3.3%~5.5%의 저율 연금소득세만 적용되어 장기 복리 효과가 극대화됩니다.
          </div>
        </div>
      </div>

      {/* ===================== [5. 인터랙티브 위젯: 24개 금융사 IRP 공시 성과 비교 리그테이블] ===================== */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Official Broker Performance & Fee Comparison</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              24개 금융투자사 IRP 공시 수익률 & 수수료 비교
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              금융감독원 통합연금포털 공시 기준 실적배당형 1년/3년/5년 누적 수익률 및 다이렉트 수수료 현황입니다.
            </p>
          </div>

          {/* 검색 및 정렬 컨트롤러 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="증권사 검색..."
                value={brokerSearch}
                onChange={(e) => setBrokerSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-36 sm:w-44"
              />
            </div>

            <select
              value={brokerSortBy}
              onChange={(e) => setBrokerSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="1Y">실적배당 1년 순</option>
              <option value="3Y">실적배당 3년 순</option>
              <option value="5Y">실적배당 5년 순</option>
              <option value="balance">적립금 규모 순</option>
              <option value="guaranteed">원리금보장형 순</option>
            </select>

            <button
              onClick={() => setFeeFreeOnly(!feeFreeOnly)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                feeFreeOnly
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              다이렉트 무료만 보기
            </button>
          </div>
        </div>

        {/* 리그테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40">
                <th className="py-2.5 px-3">순위</th>
                <th className="py-2.5 px-3">금융사명</th>
                <th className="py-2.5 px-3 text-right">적립금(조원)</th>
                <th className="py-2.5 px-3 text-right">실적배당 1년</th>
                <th className="py-2.5 px-3 text-right">실적배당 3년</th>
                <th className="py-2.5 px-3 text-right">실적배당 5년</th>
                <th className="py-2.5 px-3 text-right">원리금보장 1년</th>
                <th className="py-2.5 px-3">디폴트옵션 최고등급</th>
                <th className="py-2.5 px-3 text-center">비대면 수수료</th>
                <th className="py-2.5 px-3">대표 추천 ETF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {processedBrokers.map((b, idx) => (
                <tr key={b.brokerName} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">
                    #{idx + 1}
                  </td>
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                    <span>{b.brokerName}</span>
                    <span className="text-[10px] text-slate-500 font-normal">({b.category})</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    {(b.totalBalanceEok / 10000).toFixed(1)}조
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                    +{b.nonGuaranteedYield1Y.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    +{b.nonGuaranteedYield3Y.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    +{b.nonGuaranteedYield5Y.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">
                    +{b.guaranteedYield1Y.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] text-slate-300 block truncate max-w-[140px]">
                      {b.defaultOptionRank}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      (1년 +{b.defaultOptionYield1Y}%)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {b.isDirectFeeFree ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        평생 무료 (0%)
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">
                        {b.onlineFeeRate}%
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">
                    {b.topRecommendedEtf}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== [6. 인터랙티브 위젯: IRP 추천 ETF 큐레이션 풀] ===================== */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Research Curated ETF Universe</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              증권사 리서치센터 추천 IRP 핵심 ETF 풀
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              퇴직연금 계좌에서 매수 가능한 대표 지수, 월배당 인컴, 안전자산 채권형 ETF 라인업입니다.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setEtfCategoryFilter('ALL')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                etfCategoryFilter === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setEtfCategoryFilter('위험자산')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                etfCategoryFilter === '위험자산'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              위험자산 (최대 70%)
            </button>
            <button
              onClick={() => setEtfCategoryFilter('안전(혼합)자산')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                etfCategoryFilter === '안전(혼합)자산'
                  ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              안전자산 (100% 가능)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {IRP_RECOMMENDED_ETFS
            .filter(e => etfCategoryFilter === 'ALL' || e.category === etfCategoryFilter)
            .map(etf => (
              <div 
                key={etf.code}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-mono text-slate-500">{etf.code}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      etf.category === '위험자산'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {etf.irpEligibility}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                    {etf.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    <span>{etf.issuer}</span>
                    <span aria-hidden="true" className="mx-1">·</span>
                    <span>{etf.assetClass}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">1년 수익률</span>
                    <strong className="text-emerald-400 font-bold">+{etf.yield1Y}%</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">배당(분배)율</span>
                    <strong className="text-amber-300 font-bold">{etf.dividendYieldPct}%</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">총보수</span>
                    <span className="text-slate-400">{etf.expenseRatioPct}%</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
