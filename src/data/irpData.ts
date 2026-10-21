export interface IRPBrokerPerformance {
  brokerName: string;
  category: '증권' | '은행' | '보험';
  totalBalanceEok: number; // 적립금 (억원)
  nonGuaranteedYield1Y: number; // 실적배당형 1년 수익률 (%)
  nonGuaranteedYield3Y: number; // 실적배당형 3년 수익률 (%)
  nonGuaranteedYield5Y: number; // 실적배당형 5년 수익률 (%)
  guaranteedYield1Y: number; // 원리금보장형 1년 수익률 (%)
  defaultOptionRank: string; // 디폴트옵션 최고 등급
  defaultOptionYield1Y: number; // 디폴트옵션 1년 수익률 (%)
  onlineFeeRate: number; // 비대면 개설 수수료율 (운용+자산관리, %)
  isDirectFeeFree: boolean; // 다이렉트 수수료 평생 무료 여부
  rating: string;
  topRecommendedEtf: string;
}

export interface IRPAssetAllocationItem {
  id: string;
  name: string;
  category: '위험자산' | '안전(혼합)자산';
  subCategory: string;
  ratio: number; // 비중 (%)
  amountWon: number; // 금액 (원)
  yield1Y: number; // 1년 수익률 (%)
  dividendYield: number; // 연간 배당(분배) 수익률 (%)
  tickerCode: string;
  expenseRatioPct: number; // 총보수 (%)
  issuer: string;
}

export interface IRPModelPortfolio {
  id: string;
  title: string;
  tagline: string;
  targetRiskProfile: '공격투자형 (위험 70%)' | '중립배당형 (균형 60%)' | '안정성장형 (TDF 중심)';
  expectedAnnualReturn: number;
  riskAssetRatio: number;
  safeAssetRatio: number;
  description: string;
  items: {
    name: string;
    code: string;
    ratio: number;
    category: '위험자산' | '안전(혼합)자산';
    role: string;
  }[];
}

export const IRP_MARKET_SUMMARY = {
  totalMarketSizeJo: 87.4, // 전체 시장 규모 (조원)
  marketGrowthRatePct: 24.8, // 전년비 적립금 성장률 (%)
  equityFundTransitionPct: 41.2, // 실적배당형(ETF/펀드) 편입 비중 (%)
  avgSecuritiesYield1Y: 14.82, // 증권업권 평균 실적배당형 수익률 (%)
  avgBankYield1Y: 8.94, // 은행업권 평균 실적배당형 수익률 (%)
  maxTaxDeductionLimitWon: 9000000, // 최대 세액공제 납입한도 (900만원)
  maxTaxRefundUnder55m: 1485000, // 총급여 5,500만원 이하 최대 환급 (148.5만원, 16.5%)
  maxTaxRefundOver55m: 1188000, // 총급여 5,500만원 초과 최대 환급 (118.8만원, 13.2%)
  riskAssetLimitPct: 70, // 퇴직연금감독규정상 위험자산 최대 한도 (%)
  safeAssetMinPct: 30, // 안전자산 의무 보유 최소 비율 (%)
};

export const IRP_BROKER_LEADERBOARD: IRPBrokerPerformance[] = [
  {
    brokerName: "미래에셋증권",
    category: "증권",
    totalBalanceEok: 154200,
    nonGuaranteedYield1Y: 16.84,
    nonGuaranteedYield3Y: 28.50,
    nonGuaranteedYield5Y: 48.90,
    guaranteedYield1Y: 3.78,
    defaultOptionRank: "고위험 포트폴리오 1호",
    defaultOptionYield1Y: 18.25,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "AAA",
    topRecommendedEtf: "TIGER 미국S&P500"
  },
  {
    brokerName: "한국투자증권",
    category: "증권",
    totalBalanceEok: 121500,
    nonGuaranteedYield1Y: 15.92,
    nonGuaranteedYield3Y: 26.80,
    nonGuaranteedYield5Y: 45.40,
    guaranteedYield1Y: 3.82,
    defaultOptionRank: "중위험 포트폴리오 2호",
    defaultOptionYield1Y: 15.60,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "AAA",
    topRecommendedEtf: "ACE 미국나스닥100"
  },
  {
    brokerName: "삼성증권",
    category: "증권",
    totalBalanceEok: 135800,
    nonGuaranteedYield1Y: 15.45,
    nonGuaranteedYield3Y: 25.90,
    nonGuaranteedYield5Y: 44.10,
    guaranteedYield1Y: 3.75,
    defaultOptionRank: "고위험 포트폴리오 1호",
    defaultOptionYield1Y: 17.10,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "AAA",
    topRecommendedEtf: "KODEX 미국배당다우존스"
  },
  {
    brokerName: "KB증권",
    category: "증권",
    totalBalanceEok: 98600,
    nonGuaranteedYield1Y: 15.18,
    nonGuaranteedYield3Y: 24.80,
    nonGuaranteedYield5Y: 42.60,
    guaranteedYield1Y: 3.72,
    defaultOptionRank: "고위험 포트폴리오 3호",
    defaultOptionYield1Y: 16.45,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "AA+",
    topRecommendedEtf: "KBSTAR 미국S&P500"
  },
  {
    brokerName: "신한투자증권",
    category: "증권",
    totalBalanceEok: 74200,
    nonGuaranteedYield1Y: 14.65,
    nonGuaranteedYield3Y: 23.90,
    nonGuaranteedYield5Y: 41.20,
    guaranteedYield1Y: 3.70,
    defaultOptionRank: "중위험 포트폴리오 1호",
    defaultOptionYield1Y: 14.80,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "AA+",
    topRecommendedEtf: "SOL 미국배당다우존스(월배당)"
  },
  {
    brokerName: "키움증권",
    category: "증권",
    totalBalanceEok: 42500,
    nonGuaranteedYield1Y: 16.20,
    nonGuaranteedYield3Y: 27.10,
    nonGuaranteedYield5Y: 46.50,
    guaranteedYield1Y: 3.85,
    defaultOptionRank: "고위험 포트폴리오 2호",
    defaultOptionYield1Y: 17.80,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "AA",
    topRecommendedEtf: "KOSEF 미국블록체인"
  },
  {
    brokerName: "NH투자증권",
    category: "증권",
    totalBalanceEok: 89300,
    nonGuaranteedYield1Y: 14.88,
    nonGuaranteedYield3Y: 24.20,
    nonGuaranteedYield5Y: 42.10,
    guaranteedYield1Y: 3.74,
    defaultOptionRank: "고위험 포트폴리오 1호",
    defaultOptionYield1Y: 16.10,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "AA+",
    topRecommendedEtf: "TIGER 미국빅테크TOP10"
  },
  {
    brokerName: "하나증권",
    category: "증권",
    totalBalanceEok: 51200,
    nonGuaranteedYield1Y: 14.15,
    nonGuaranteedYield3Y: 22.80,
    nonGuaranteedYield5Y: 39.80,
    guaranteedYield1Y: 3.68,
    defaultOptionRank: "중위험 포트폴리오 2호",
    defaultOptionYield1Y: 14.20,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "AA",
    topRecommendedEtf: "ACE 글로벌반도체TOP4"
  },
  {
    brokerName: "대신증권",
    category: "증권",
    totalBalanceEok: 36800,
    nonGuaranteedYield1Y: 13.90,
    nonGuaranteedYield3Y: 22.10,
    nonGuaranteedYield5Y: 38.50,
    guaranteedYield1Y: 3.65,
    defaultOptionRank: "중위험 포트폴리오 1호",
    defaultOptionYield1Y: 13.95,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "AA-",
    topRecommendedEtf: "KODEX 미국AI테크"
  },
  {
    brokerName: "BNK투자증권",
    category: "증권",
    totalBalanceEok: 19800,
    nonGuaranteedYield1Y: 13.75,
    nonGuaranteedYield3Y: 21.60,
    nonGuaranteedYield5Y: 37.20,
    guaranteedYield1Y: 3.80,
    defaultOptionRank: "중위험 포트폴리오 1호",
    defaultOptionYield1Y: 13.50,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "A+",
    topRecommendedEtf: "TIGER 미국필라델피아반도체"
  },
  {
    brokerName: "유진투자증권",
    category: "증권",
    totalBalanceEok: 18400,
    nonGuaranteedYield1Y: 14.05,
    nonGuaranteedYield3Y: 22.40,
    nonGuaranteedYield5Y: 38.90,
    guaranteedYield1Y: 3.75,
    defaultOptionRank: "고위험 포트폴리오 1호",
    defaultOptionYield1Y: 15.20,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "A+",
    topRecommendedEtf: "SOL 미국배당다우존스"
  },
  {
    brokerName: "다올투자증권",
    category: "증권",
    totalBalanceEok: 11200,
    nonGuaranteedYield1Y: 13.60,
    nonGuaranteedYield3Y: 21.10,
    nonGuaranteedYield5Y: 36.80,
    guaranteedYield1Y: 3.82,
    defaultOptionRank: "중위험 포트폴리오 1호",
    defaultOptionYield1Y: 13.10,
    onlineFeeRate: 0.0,
    isDirectFeeFree: true,
    rating: "A",
    topRecommendedEtf: "TIGER 200대형주"
  }
];

export const IRP_MODEL_PORTFOLIOS: IRPModelPortfolio[] = [
  {
    id: "growth_alpha",
    title: "글로벌 혁신 성장형 (Max Alpha 70:30)",
    tagline: "퇴직연금 위험자산 70% 한도를 미국 주도 혁신 지수 ETF에 집중",
    targetRiskProfile: "공격투자형 (위험 70%)",
    expectedAnnualReturn: 12.4,
    riskAssetRatio: 70,
    safeAssetRatio: 30,
    description: "미국 S&P500과 나스닥100을 주축으로 글로벌 기술 패권을 추종하며, 의무 안전자산 30%를 미국 30년 국채 혼합 및 단기 채권으로 배치하여 변동성을 완충하는 스탠다드 포트폴리오입니다.",
    items: [
      { name: "TIGER 미국S&P500", code: "360750", ratio: 40, category: "위험자산", role: "글로벌 핵심 우량 500개 기업 분산" },
      { name: "ACE 미국나스닥100", code: "367380", ratio: 30, category: "위험자산", role: "AI·빅테크 혁신 성장주 레버리지" },
      { name: "ACE 미국30년국채액티브(H)", code: "453850", ratio: 20, category: "안전(혼합)자산", role: "금리 인하 시 자본차익 & 안전자산 인정" },
      { name: "KODEX KOFR금리액티브(합성)", code: "423160", ratio: 10, category: "안전(혼합)자산", role: "무위험 파킹 및 리밸런싱 대기자금" }
    ]
  },
  {
    id: "monthly_income",
    title: "월배당 인컴 밸류형 (Income Compound 70:30)",
    tagline: "매월 현금흐름 분배금을 수령하여 복리 자동 재투자",
    targetRiskProfile: "중립배당형 (균형 60%)",
    expectedAnnualReturn: 9.8,
    riskAssetRatio: 65,
    safeAssetRatio: 35,
    description: "미국 배당성장(SCHD)과 국내 고배당 밸류업 ETF를 위험자산 한도 내에서 편입하고, 안전자산 35%를 월지급식 우량 회사채 및 만기매칭형 채권으로 구성하여 정기적인 배당 재투자로 원금을 불려나가는 전략입니다.",
    items: [
      { name: "SOL 미국배당다우존스", code: "446720", ratio: 35, category: "위험자산", role: "연 3.8% 월분배금 지급 + 배당성장" },
      { name: "TIGER 한국가치성장고배당", code: "411060", ratio: 30, category: "위험자산", role: "기업 밸류업 프로그램 및 주주환원 수혜" },
      { name: "TIGER 미국달러단기채권액티브", code: "329750", ratio: 20, category: "안전(혼합)자산", role: "달러 자산 분산 및 고금리 쿠폰 수취" },
      { name: "KODEX 25-11 회사채(AA-이상)액티브", code: "472170", ratio: 15, category: "안전(혼합)자산", role: "만기보유 확정 수익률(YTM 4.1%)" }
    ]
  },
  {
    id: "tdf_lifecycle",
    title: "스마트 TDF 생애주기형 (Auto Pilot 2050)",
    tagline: "은퇴 시점에 맞추어 위험자산 비중이 자동으로 조절되는 글라이드패스",
    targetRiskProfile: "안정성장형 (TDF 중심)",
    expectedAnnualReturn: 8.6,
    riskAssetRatio: 60,
    safeAssetRatio: 40,
    description: "생애주기 펀드(TDF 2050)는 퇴직연금 규정상 전액 편입이 가능하며, 펀드 내부에서 나이가 들수록 주식 비중을 줄이고 채권 비중을 자동으로 늘려주어 별도의 리밸런싱 부담이 없는 최적의 연금 솔루션입니다.",
    items: [
      { name: "TIGER TDF2050액티브", code: "437630", ratio: 60, category: "위험자산", role: "은퇴 시점 기준 글로벌 자산배분 자동 조절" },
      { name: "KODEX 국고채30년액티브", code: "439870", ratio: 25, category: "안전(혼합)자산", role: "장기 초우량 국채 듀레이션 헤지" },
      { name: "정기예금 / 퇴직연금 ELB", code: "FIXED_DEPOSIT", ratio: 15, category: "안전(혼합)자산", role: "원리금 100% 보장 확정형 이자(3.8%)" }
    ]
  }
];

export const IRP_RECOMMENDED_ETFS = [
  {
    code: "360750",
    name: "TIGER 미국S&P500",
    issuer: "미래에셋자산운용",
    category: "위험자산",
    assetClass: "해외주식형",
    expenseRatioPct: 0.07,
    yield1Y: 34.8,
    dividendYieldPct: 1.45,
    netAssetEok: 48500,
    isRecommended: true,
    irpEligibility: "위험자산 (최대 70% 한도)"
  },
  {
    code: "367380",
    name: "ACE 미국나스닥100",
    issuer: "한국투자신탁운용",
    category: "위험자산",
    assetClass: "해외주식형",
    expenseRatioPct: 0.07,
    yield1Y: 39.2,
    dividendYieldPct: 0.72,
    netAssetEok: 36200,
    isRecommended: true,
    irpEligibility: "위험자산 (최대 70% 한도)"
  },
  {
    code: "446720",
    name: "SOL 미국배당다우존스",
    issuer: "신한자산운용",
    category: "위험자산",
    assetClass: "해외배당형(월배당)",
    expenseRatioPct: 0.05,
    yield1Y: 22.4,
    dividendYieldPct: 3.85,
    netAssetEok: 12800,
    isRecommended: true,
    irpEligibility: "위험자산 (최대 70% 한도)"
  },
  {
    code: "453850",
    name: "ACE 미국30년국채액티브(H)",
    issuer: "한국투자신탁운용",
    category: "안전(혼합)자산",
    assetClass: "해외채권형",
    expenseRatioPct: 0.05,
    yield1Y: 11.2,
    dividendYieldPct: 4.10,
    netAssetEok: 18400,
    isRecommended: true,
    irpEligibility: "안전자산 (100% 편입 가능)"
  },
  {
    code: "423160",
    name: "KODEX KOFR금리액티브(합성)",
    issuer: "삼성자산운용",
    category: "안전(혼합)자산",
    assetClass: "단기금리/파킹형",
    expenseRatioPct: 0.03,
    yield1Y: 3.65,
    dividendYieldPct: 0.0,
    netAssetEok: 38900,
    isRecommended: true,
    irpEligibility: "안전자산 (100% 편입 가능)"
  },
  {
    code: "437630",
    name: "TIGER TDF2050액티브",
    issuer: "미래에셋자산운용",
    category: "안전(혼합)자산",
    assetClass: "생애주기 TDF",
    expenseRatioPct: 0.18,
    yield1Y: 18.9,
    dividendYieldPct: 1.80,
    netAssetEok: 4200,
    isRecommended: true,
    irpEligibility: "안전자산 (100% 편입 가능 - TDF 특례)"
  },
  {
    code: "411060",
    name: "TIGER 200금융",
    issuer: "미래에셋자산운용",
    category: "위험자산",
    assetClass: "국내섹터(밸류업)",
    expenseRatioPct: 0.15,
    yield1Y: 36.5,
    dividendYieldPct: 5.20,
    netAssetEok: 6100,
    isRecommended: true,
    irpEligibility: "위험자산 (최대 70% 한도)"
  },
  {
    code: "091180",
    name: "KODEX 반도체",
    issuer: "삼성자산운용",
    category: "위험자산",
    assetClass: "국내섹터",
    expenseRatioPct: 0.15,
    yield1Y: 42.1,
    dividendYieldPct: 1.10,
    netAssetEok: 14200,
    isRecommended: true,
    irpEligibility: "위험자산 (최대 70% 한도)"
  }
];
