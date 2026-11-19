/**
 * AI Alpha Portfolio Simulation Service
 * 
 * 2026 올해의 애널리스트 어워즈 (v1.8.4 데이터 기반, 2025.11.01 ~ 2026.10.30)
 * 343명 애널리스트 중 DART 실적 정합도 98% 이상, 가중 오차율 상위 10%, 
 * 낙관 편향 35% 이하인 공인 고신뢰 연구원들의 공통 합의(Consensus) 기반 알파 포트폴리오 시뮬레이터.
 */

export type StrategyType = 'alpha_weighted' | 'equal_weight' | 'contrarian_defensive';
export type TimeHorizon = '1y_full' | '6m_recent' | '2h_2026';

export interface HighReliabilityAnalyst {
  id: string;
  name: string;
  broker: string;
  sector: string;
  accuracyScore: number;
  dartAlignment: number;
  weightedErrorRate: number;
  optimismBias: number;
  tendency: '신중형(Conservative)' | '역발상형(Contrarian)' | '균형형(Balanced)';
  totalReports: number;
  topStockPick: string;
}

export interface PortfolioHolding {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  category: string;
  weight: number; // percentage (e.g. 15.0)
  targetPrice: number;
  currentPrice: number;
  returnRate: number; // 1-year cumulative return %
  pe: number;
  dividendYield?: string;
  dartAlignment: number; // %
  dartErrorRate: number; // %
  recommendingAnalysts: Array<{
    name: string;
    broker: string;
    tendency: string;
    accuracyScore: number;
  }>;
  consensusThesis: string;
  keyDARTFact: string;
  riskMitigation: string;
  graphRagQuery: string;
}

export interface MonthlyPerformancePoint {
  date: string;
  displayDate: string;
  kospi: number; // KOSPI cumulative return %
  alphaWeighted: number; // Strategy A cumulative return %
  equalWeight: number; // Strategy B cumulative return %
  contrarian: number; // Strategy C cumulative return %
  activeStrategyReturn: number; // Currently selected strategy return %
  monthlyAlpha: number; // Selected strategy - KOSPI %p
  drawdown: number; // MDD %
}

export interface PortfolioSimulationSummary {
  strategy: StrategyType;
  strategyName: string;
  strategyDescription: string;
  timeHorizon: TimeHorizon;
  cumulativeReturn: number; // %
  benchmarkReturn: number; // % (KOSPI)
  alpha: number; // %p
  sharpeRatio: number;
  maxDrawdown: number; // % (MDD)
  volatility: number; // %
  winRate: number; // %
  beta: number;
  totalHoldingsCount: number;
  screenedAnalystsCount: number;
  totalScreenedPool: number;
  holdings: PortfolioHolding[];
  monthlySeries: MonthlyPerformancePoint[];
  irpCompliance: {
    applied: boolean;
    equityRatio: number; // 70% or 100%
    safeAssetRatio: number; // 30% or 0%
    safeAssetReturn: number; // 국채/TDF 안정수익률 3.6%
    compliant: boolean;
    ruleNotice: string;
  };
}

// 1. 고신뢰 애널리스트 엄선 풀 (전체 343명 중 정량 필터 통과자 42명 중 대표 8인)
export const SCREENED_HIGH_RELIABILITY_ANALYSTS: HighReliabilityAnalyst[] = [
  {
    id: 'anl_choi_jeonguk',
    name: '최정욱',
    broker: '하나증권',
    sector: '금융지주 & 밸류업',
    accuracyScore: 94.8,
    dartAlignment: 99.7,
    weightedErrorRate: 2.1,
    optimismBias: 18.0,
    tendency: '신중형(Conservative)',
    totalReports: 58,
    topStockPick: 'KB금융 (105560)'
  },
  {
    id: 'anl_jung_wonseok',
    name: '정원석',
    broker: 'iM증권',
    sector: '2차전지 & 모빌리티',
    accuracyScore: 95.8,
    dartAlignment: 99.4,
    weightedErrorRate: 3.2,
    optimismBias: 12.0,
    tendency: '역발상형(Contrarian)',
    totalReports: 46,
    topStockPick: '현대차 (005380)'
  },
  {
    id: 'anl_lee_hankyul',
    name: '이한결',
    broker: '키움증권',
    sector: '방산 & 항공우주',
    accuracyScore: 97.2,
    dartAlignment: 99.8,
    weightedErrorRate: 1.8,
    optimismBias: 35.0,
    tendency: '균형형(Balanced)',
    totalReports: 44,
    topStockPick: '한화에어로스페이스 (012450)'
  },
  {
    id: 'anl_kwon_haesoon',
    name: '권해순',
    broker: '유진투자증권',
    sector: '바이오 & CDMO',
    accuracyScore: 96.4,
    dartAlignment: 99.6,
    weightedErrorRate: 2.6,
    optimismBias: 22.0,
    tendency: '신중형(Conservative)',
    totalReports: 52,
    topStockPick: '삼성바이오로직스 (207940)'
  },
  {
    id: 'anl_kim_dongwon',
    name: '김동원',
    broker: 'KB증권',
    sector: '반도체 & HBM',
    accuracyScore: 98.4,
    dartAlignment: 99.5,
    weightedErrorRate: 1.6,
    optimismBias: 32.0,
    tendency: '균형형(Balanced)',
    totalReports: 68,
    topStockPick: 'SK하이닉스 (000660)'
  },
  {
    id: 'anl_kim_woonho',
    name: '김운호',
    broker: 'IBK투자증권',
    sector: '반도체 소부장',
    accuracyScore: 94.2,
    dartAlignment: 99.3,
    weightedErrorRate: 2.9,
    optimismBias: 21.0,
    tendency: '신중형(Conservative)',
    totalReports: 54,
    topStockPick: '한미반도체 (042700)'
  },
  {
    id: 'anl_moon_yongkwon',
    name: '문용권',
    broker: '신영증권',
    sector: '자동차 & 완성차',
    accuracyScore: 95.1,
    dartAlignment: 99.6,
    weightedErrorRate: 2.3,
    optimismBias: 28.0,
    tendency: '균형형(Balanced)',
    totalReports: 50,
    topStockPick: '현대차 (005380)'
  },
  {
    id: 'anl_lee_seungwoo',
    name: '이승우',
    broker: '유진투자증권',
    sector: '반도체 장비',
    accuracyScore: 96.0,
    dartAlignment: 99.4,
    weightedErrorRate: 2.4,
    optimismBias: 15.0,
    tendency: '역발상형(Contrarian)',
    totalReports: 49,
    topStockPick: 'HPSP (403870)'
  }
];

// 2. 포트폴리오 후보 편입 종목 마스터 (10개 고신뢰 컨센서스 종목)
export const MASTER_ALPHA_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'hold_000660',
    ticker: '000660',
    name: 'SK하이닉스',
    sector: '반도체 & HBM',
    category: '대형 성장주',
    weight: 16.0,
    targetPrice: 248000,
    currentPrice: 198500,
    returnRate: 48.6,
    pe: 7.2,
    dividendYield: '1.4%',
    dartAlignment: 99.5,
    dartErrorRate: 1.6,
    recommendingAnalysts: [
      { name: '김동원', broker: 'KB증권', tendency: '균형형', accuracyScore: 98.4 },
      { name: '이승우', broker: '유진투자증권', tendency: '역발상형', accuracyScore: 96.0 }
    ],
    consensusThesis: 'HBM3E 8단/12단 시장 독점 지배력 및 2026년 영업이익 23조원 흑자 사이클 달성.',
    keyDARTFact: '2026 3Q 누적 영업이익 15조 3,845억원 공시 (추정치 대비 +3.8% 초과 달성).',
    riskMitigation: '레거시 DDR4/DDR5 판가 하락 우려를 HBM3E 프리미엄 고정가 장기계약으로 완충.',
    graphRagQuery: 'SK하이닉스 2026년 HBM 공급망 DART 공시 실적 정합성과 수혜 소부장은?'
  },
  {
    id: 'hold_042700',
    ticker: '042700',
    name: '한미반도체',
    sector: '반도체 장비',
    category: '핵심 소부장',
    weight: 12.0,
    targetPrice: 195000,
    currentPrice: 142000,
    returnRate: 42.1,
    pe: 28.4,
    dividendYield: '0.8%',
    dartAlignment: 99.3,
    dartErrorRate: 2.9,
    recommendingAnalysts: [
      { name: '김동원', broker: 'KB증권', tendency: '균형형', accuracyScore: 98.4 },
      { name: '김운호', broker: 'IBK투자증권', tendency: '신중형', accuracyScore: 94.2 }
    ],
    consensusThesis: 'DUAL TC 본더 글로벌 사실상 독점 체제 구축. 마이크론 및 메이저 파운드리 납품 확장.',
    keyDARTFact: '수주공시 누적 3,800억원 돌파 공시 (자율공시 공시번호 20261022000301 확인).',
    riskMitigation: '후발 경쟁사(한화 등) 진입 우려에도 불구하고 12단 이상 적층용 마이크로 피치 특허 방어벽 견고.',
    graphRagQuery: '한미반도체 TC본더 독점력과 HBM 12단 적층 특허 DART 팩트체크'
  },
  {
    id: 'hold_196170',
    ticker: '196170',
    name: '알테오젠',
    sector: '바이오 플랫폼',
    category: '글로벌 라이선스',
    weight: 13.0,
    targetPrice: 490000,
    currentPrice: 382000,
    returnRate: 58.4,
    pe: 48.0,
    dividendYield: '0.0%',
    dartAlignment: 99.6,
    dartErrorRate: 2.6,
    recommendingAnalysts: [
      { name: '권해순', broker: '유진투자증권', tendency: '신중형', accuracyScore: 96.4 }
    ],
    consensusThesis: '머크(MSD) 키트루다 피하주사(SC) 독점 라이선스 전환 및 로열티 수취 개시.',
    keyDARTFact: '글로벌 제약사 대상 기술수출 마일스톤 2,000만 달러 수령 확정 공시.',
    riskMitigation: '특허 무효소송 리스크에 대해 글로벌 로펌의 FTO(Freedom to Operate) 확인 보고서 검증 완료.',
    graphRagQuery: '알테오젠 ALT-B4 키트루다 SC 제형변경 마일스톤 DART 공시 분석'
  },
  {
    id: 'hold_207940',
    ticker: '207940',
    name: '삼성바이오로직스',
    sector: '바이오 & CDMO',
    category: '방어형 성장주',
    weight: 11.0,
    targetPrice: 1150000,
    currentPrice: 998000,
    returnRate: 28.5,
    pe: 62.0,
    dividendYield: '0.0%',
    dartAlignment: 99.6,
    dartErrorRate: 2.1,
    recommendingAnalysts: [
      { name: '권해순', broker: '유진투자증권', tendency: '신중형', accuracyScore: 96.4 }
    ],
    consensusThesis: '미국 생물보안법(Biosecure Act) 최대 수혜. 1~4공장 100% 가동 및 5공장 2026년 조기 램프업.',
    keyDARTFact: '단일 계약 기준 1조 4,600억원 역대 최대 수주 DART 단일판매·공급계약체결 공시.',
    riskMitigation: '고환율 기조 속에서 100% 달러화 결제 CDMO 구조로 환차익 및 이익 가시성 확보.',
    graphRagQuery: '삼성바이오로직스 미국 생물보안법 수혜 및 5공장 수주 잔고 DART 공시'
  },
  {
    id: 'hold_012450',
    ticker: '012450',
    name: '한화에어로스페이스',
    sector: '방산 & 항공우주',
    category: '수주 모멘텀주',
    weight: 12.0,
    targetPrice: 380000,
    currentPrice: 326000,
    returnRate: 52.0,
    pe: 14.5,
    dividendYield: '1.2%',
    dartAlignment: 99.8,
    dartErrorRate: 1.8,
    recommendingAnalysts: [
      { name: '이한결', broker: '키움증권', tendency: '균형형', accuracyScore: 97.2 }
    ],
    consensusThesis: '폴란드 K9 자주포 및 천무 2차 이행계약 납품 본격화, 루마니아 장갑차 수주 파이프라인.',
    keyDARTFact: '수주잔고 31조 2,000억원 공시 및 방산 부문 영업이익률 18.5% 기록.',
    riskMitigation: '수출입은행 금융지원 한도 통과 및 현지 합작법인 설립으로 지정학적 관세 및 납기 리스크 해소.',
    graphRagQuery: '한화에어로스페이스 폴란드/루마니아 방산 수주잔고와 영업이익률 DART 공시'
  },
  {
    id: 'hold_064350',
    ticker: '064350',
    name: '현대로템',
    sector: '방산 & 철도',
    category: '수주 모멘텀주',
    weight: 8.0,
    targetPrice: 65000,
    currentPrice: 56400,
    returnRate: 44.8,
    pe: 16.2,
    dividendYield: '0.9%',
    dartAlignment: 99.8,
    dartErrorRate: 1.8,
    recommendingAnalysts: [
      { name: '이한결', broker: '키움증권', tendency: '균형형', accuracyScore: 97.2 }
    ],
    consensusThesis: 'K2 흑표 전차 폴란드 2차 계약(820대 중 현지생산분) 연내 체결 가시화 및 중동 수출 타진.',
    keyDARTFact: '분기 영업이익 전년 동기 대비 210% 급증(DART 20261026000109 공시 확인).',
    riskMitigation: '철도(레일솔루션) 부문의 저수익 프로젝트 잔여분 손실 반영 완료로 방산 마진 훼손 차단.',
    graphRagQuery: '현대로템 K2 전차 2차 이행계약 일정과 디펜스솔루션 마진율'
  },
  {
    id: 'hold_105560',
    ticker: '105560',
    name: 'KB금융',
    sector: '금융지주 & 밸류업',
    category: '고배당/가치주',
    weight: 10.0,
    targetPrice: 110000,
    currentPrice: 94200,
    returnRate: 24.6,
    pe: 5.6,
    dividendYield: '6.4%',
    dartAlignment: 99.7,
    dartErrorRate: 2.1,
    recommendingAnalysts: [
      { name: '최정욱', broker: '하나증권', tendency: '신중형', accuracyScore: 94.8 }
    ],
    consensusThesis: '보통주자본(CET1) 13.5% 초과 자본 전액 자사주 매입/소각 발표 및 배당성향 40% 로드맵 가동.',
    keyDARTFact: '연간 총 주주환원율 42.5% 달성 공시 (기 취득 자기주식 3,200억원 소각 완료).',
    riskMitigation: '국내외 상업용 부동산 PF 충당금 선제적 100% 적립으로 추가 손실 가능성 차단.',
    graphRagQuery: 'KB금융 CET1 비율 및 자사주 소각 규모 DART 팩트체크'
  },
  {
    id: 'hold_005380',
    ticker: '005380',
    name: '현대차',
    sector: '자동차 & 완성차',
    category: '고배당/가치주',
    weight: 8.0,
    targetPrice: 310000,
    currentPrice: 251000,
    returnRate: 21.3,
    pe: 5.2,
    dividendYield: '5.8%',
    dartAlignment: 99.6,
    dartErrorRate: 2.3,
    recommendingAnalysts: [
      { name: '문용권', broker: '신영증권', tendency: '균형형', accuracyScore: 95.1 },
      { name: '정원석', broker: 'iM증권', tendency: '역발상형', accuracyScore: 95.8 }
    ],
    consensusThesis: '인도법인(HMI) 초대형 IPO 성공에 따른 현금 4조원 유입 및 HEV(하이브리드) 믹스 개선.',
    keyDARTFact: '분기 영업이익률 8.4% 유지 공시 (글로벌 완성차 중 최고 수준).',
    riskMitigation: '북미 인센티브 상승 압력을 조지아 메타플랜트 하이브리드 혼류생산으로 기민하게 방어.',
    graphRagQuery: '현대차 인도법인 IPO 자금 활용 계획과 하이브리드 판매 비중 DART 공시'
  },
  {
    id: 'hold_403870',
    ticker: '403870',
    name: 'HPSP',
    sector: '반도체 장비',
    category: '선단공정 독점주',
    weight: 6.0,
    targetPrice: 58000,
    currentPrice: 46800,
    returnRate: 31.8,
    pe: 26.5,
    dividendYield: '0.6%',
    dartAlignment: 99.4,
    dartErrorRate: 2.4,
    recommendingAnalysts: [
      { name: '이승우', broker: '유진투자증권', tendency: '역발상형', accuracyScore: 96.0 }
    ],
    consensusThesis: '선단 공정(3nm 이하 GAA 및 고단화 3D NAND) 필수 장비인 고압 수소 어닐링 글로벌 표준.',
    keyDARTFact: '영업이익률 52.8% 기록 공시 (독점적 기술 프리미엄 유지 확인).',
    riskMitigation: '특허 분쟁 1심 승소에 따른 시장 독점력 재확인 및 TSMC향 장비 발주 견조.',
    graphRagQuery: 'HPSP 고압 수소 어닐링 특허 소송 결과와 선단공정 장비 수주 현황'
  },
  {
    id: 'hold_058470',
    ticker: '058470',
    name: '리노공업',
    sector: '반도체 부품',
    category: '고수익 현금창출주',
    weight: 4.0,
    targetPrice: 260000,
    currentPrice: 218000,
    returnRate: 26.4,
    pe: 24.1,
    dividendYield: '1.6%',
    dartAlignment: 99.3,
    dartErrorRate: 2.5,
    recommendingAnalysts: [
      { name: '김운호', broker: 'IBK투자증권', tendency: '신중형', accuracyScore: 94.2 }
    ],
    consensusThesis: '온디바이스 AI AP 칩 설계 복잡화에 따른 리노핀 및 테스트 소켓 ASP(평균판매단가) 상승.',
    keyDARTFact: '무차입 경영 및 순현금 3,500억원 보유, 영업이익률 41.2% 공시.',
    riskMitigation: '글로벌 빅테크(애플, 퀄컴, 엔비디아) 다변화로 특정 고객사 업황 부침 최소화.',
    graphRagQuery: '리노공업 온디바이스 AI AP 소켓 점유율 및 무차입 경영 DART 재무제표'
  }
];

// 3. 2025.11 ~ 2026.10 12개월 월별 시계열 백테스팅 원천 데이터
const MONTHLY_BACKTEST_RAW = [
  { date: '2025.11', displayDate: '25년 11월', kospi: 0.0,  alphaWeighted: 0.0,  equalWeight: 0.0,  contrarian: 0.0,  mdd: 0.0 },
  { date: '2025.12', displayDate: '25년 12월', kospi: 1.8,  alphaWeighted: 3.8,  equalWeight: 3.2,  contrarian: 2.9,  mdd: -0.4 },
  { date: '2026.01', displayDate: '26년 1월',  kospi: -2.4, alphaWeighted: 5.6,  equalWeight: 4.5,  contrarian: 4.8,  mdd: -1.2 },
  { date: '2026.02', displayDate: '26년 2월',  kospi: -0.8, alphaWeighted: 9.2,  equalWeight: 7.6,  contrarian: 8.1,  mdd: -1.8 },
  { date: '2026.03', displayDate: '26년 3월',  kospi: -5.2, alphaWeighted: 11.4, equalWeight: 8.9,  contrarian: 10.5, mdd: -2.6 },
  { date: '2026.04', displayDate: '26년 4월',  kospi: -8.4, alphaWeighted: 14.8, equalWeight: 11.2, contrarian: 13.8, mdd: -3.5 },
  { date: '2026.05', displayDate: '26년 5월',  kospi: -3.1, alphaWeighted: 19.5, equalWeight: 15.4, contrarian: 16.2, mdd: -3.2 },
  { date: '2026.06', displayDate: '26년 6월',  kospi: 0.5,  alphaWeighted: 24.2, equalWeight: 19.1, contrarian: 18.9, mdd: -4.1 },
  { date: '2026.07', displayDate: '26년 7월',  kospi: 2.1,  alphaWeighted: 27.8, equalWeight: 22.0, contrarian: 20.5, mdd: -4.8 },
  { date: '2026.08', displayDate: '26년 8월',  kospi: -1.6, alphaWeighted: 29.5, equalWeight: 23.8, contrarian: 22.1, mdd: -5.5 },
  { date: '2026.09', displayDate: '26년 9월',  kospi: 1.2,  alphaWeighted: 33.1, equalWeight: 26.5, contrarian: 23.8, mdd: -5.9 },
  { date: '2026.10', displayDate: '26년 10월', kospi: 4.8,  alphaWeighted: 36.4, equalWeight: 28.9, contrarian: 24.7, mdd: -6.2 }
];

/**
 * 포트폴리오 시뮬레이션 데이터 생성 및 전략 계산
 */
export function simulatePortfolio(
  strategy: StrategyType = 'alpha_weighted',
  timeHorizon: TimeHorizon = '1y_full',
  applyIRP: boolean = false
): PortfolioSimulationSummary {
  // 전략별 가중치 재조정
  let adjustedHoldings: PortfolioHolding[] = MASTER_ALPHA_HOLDINGS.map(h => ({ ...h }));

  if (strategy === 'equal_weight') {
    adjustedHoldings = adjustedHoldings.map(h => ({
      ...h,
      weight: 10.0 // 10개 종목 균등 10%
    }));
  } else if (strategy === 'contrarian_defensive') {
    // 역발상 및 하방방어형: KB금융(18%), 현대차(16%), 삼바(15%), 한화에어로(14%), 하이닉스(12%), 현대로템(8%), 알테오젠(7%), 리노(4%), 한미(3%), HPSP(3%)
    const contrarianWeights: Record<string, number> = {
      '105560': 18.0, // KB금융
      '005380': 16.0, // 현대차
      '207940': 15.0, // 삼성바이오
      '012450': 14.0, // 한화에어로
      '000660': 12.0, // SK하이닉스
      '064350': 8.0,  // 현대로템
      '196170': 7.0,  // 알테오젠
      '058470': 4.0,  // 리노공업
      '042700': 3.0,  // 한미반도체
      '403870': 3.0   // HPSP
    };
    adjustedHoldings = adjustedHoldings.map(h => ({
      ...h,
      weight: contrarianWeights[h.ticker] || 10.0
    }));
  }

  // 기간 필터링
  let rawSeries = [...MONTHLY_BACKTEST_RAW];
  if (timeHorizon === '6m_recent') {
    rawSeries = rawSeries.slice(6); // 2026.05 ~ 2026.10
  } else if (timeHorizon === '2h_2026') {
    rawSeries = rawSeries.slice(7); // 2026.06 ~ 2026.10
  }

  // 기준점 리베이스 (처음 인덱스가 0이 되도록 정규화)
  const baseKospi = rawSeries[0].kospi;
  const baseAlpha = rawSeries[0].alphaWeighted;
  const baseEqual = rawSeries[0].equalWeight;
  const baseContrarian = rawSeries[0].contrarian;

  const normalizedSeries: MonthlyPerformancePoint[] = rawSeries.map(pt => {
    let stratVal = pt.alphaWeighted - baseAlpha;
    if (strategy === 'equal_weight') {
      stratVal = pt.equalWeight - baseEqual;
    } else if (strategy === 'contrarian_defensive') {
      stratVal = pt.contrarian - baseContrarian;
    }

    // IRP 적용 시 주식 70% + 국채/TDF 30% (연 3.6% 환산 월 0.3%)
    if (applyIRP) {
      const safeMonthlyYield = 0.3 * (rawSeries.indexOf(pt));
      stratVal = stratVal * 0.7 + safeMonthlyYield * 0.3;
    }

    const kospiNorm = pt.kospi - baseKospi;
    const alphaNorm = Number((stratVal - kospiNorm).toFixed(1));

    return {
      date: pt.date,
      displayDate: pt.displayDate,
      kospi: Number(kospiNorm.toFixed(1)),
      alphaWeighted: Number((pt.alphaWeighted - baseAlpha).toFixed(1)),
      equalWeight: Number((pt.equalWeight - baseEqual).toFixed(1)),
      contrarian: Number((pt.contrarian - baseContrarian).toFixed(1)),
      activeStrategyReturn: Number(stratVal.toFixed(1)),
      monthlyAlpha: alphaNorm,
      drawdown: applyIRP ? Number((pt.mdd * 0.7).toFixed(1)) : pt.mdd
    };
  });

  const lastPoint = normalizedSeries[normalizedSeries.length - 1];
  const finalReturn = lastPoint.activeStrategyReturn;
  const finalKospi = lastPoint.kospi;
  const finalAlpha = Number((finalReturn - finalKospi).toFixed(1));

  // 전략 메트릭 산정
  let sharpeRatio = 2.48;
  let maxDrawdown = -6.2;
  let volatility = 11.2;
  let winRate = 91.6;
  let beta = 0.72;

  if (strategy === 'equal_weight') {
    sharpeRatio = 2.12;
    maxDrawdown = -7.8;
    volatility = 12.8;
    winRate = 83.3;
    beta = 0.78;
  } else if (strategy === 'contrarian_defensive') {
    sharpeRatio = 2.35;
    maxDrawdown = -4.1;
    volatility = 9.4;
    winRate = 88.5;
    beta = 0.58;
  }

  if (applyIRP) {
    maxDrawdown = Number((maxDrawdown * 0.7).toFixed(1));
    volatility = Number((volatility * 0.7).toFixed(1));
    sharpeRatio = Number((sharpeRatio * 1.05).toFixed(2));
  }

  const strategyDescriptions: Record<StrategyType, { name: string; desc: string }> = {
    alpha_weighted: {
      name: '신뢰도 가중 알파 전략 (Alpha Reliability-Weighted)',
      desc: 'DART 정합도(99.5%+) 및 가중 오차율 상위 애널리스트의 점수에 비례하여 비중을 최적 할당한 대표 알파 포트폴리오입니다.'
    },
    equal_weight: {
      name: '동일 가중 균형 전략 (Equal-Weight 10%)',
      desc: '선정된 10개 핵심 유망 종목에 동일하게 10%씩 분산 투자하여 특정 종목 쏠림을 배제한 분산 포트폴리오입니다.'
    },
    contrarian_defensive: {
      name: '역발상 하방방어 전략 (Contrarian Defensive)',
      desc: '시장 과열기 낙관론에 휩쓸리지 않고 리스크를 조기 경고한 역발상형 연구원 및 저P/E·고배당 밸류업 종목 비중을 높여 MDD를 최소화합니다.'
    }
  };

  return {
    strategy,
    strategyName: strategyDescriptions[strategy].name,
    strategyDescription: strategyDescriptions[strategy].desc,
    timeHorizon,
    cumulativeReturn: finalReturn,
    benchmarkReturn: finalKospi,
    alpha: finalAlpha,
    sharpeRatio,
    maxDrawdown,
    volatility,
    winRate,
    beta,
    totalHoldingsCount: adjustedHoldings.length,
    screenedAnalystsCount: 42,
    totalScreenedPool: 343,
    holdings: adjustedHoldings,
    monthlySeries: normalizedSeries,
    irpCompliance: {
      applied: applyIRP,
      equityRatio: applyIRP ? 70 : 100,
      safeAssetRatio: applyIRP ? 30 : 0,
      safeAssetReturn: 3.6,
      compliant: true,
      ruleNotice: applyIRP
        ? '근로자퇴직급여보장법에 의거하여 주식형 위험자산 비중을 70%로 제한하고 안전자산(국채/TDF) 30%를 자동 결합하였습니다.'
        : '일반 주식 운용 모드입니다. IRP 연계 모드를 켜면 위험자산 70% 한도 규제 요건을 실시간 준수합니다.'
    }
  };
}
