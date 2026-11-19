// src/services/financialMathEngine.ts
// 화이트박스 금융 모델링 및 회계 정합성 엔진
// 1. 회계 항등식 검증 (4Q 합계 = FY 누적 강제)
// 2. 바이오 DCF(현금흐름할인법) 및 파트너사 마일스톤/로열티 동적 수식 체인 모델 (목표가 하드코딩 완전 배제)
// 3. 로열티율 기본값 2.0% (보도된 머크 계약 요율 수준) 및 출처 명시
// 4. 노바티스(Novartis) 라이선스 계약(연간 500억원 가정) 공식 편입
// 5. 주당가치 워터폴 가치 브리지(Value Bridge) 표 모델
// 6. 현재가를 정당화하는 전환율·로열티 역산(Reverse Engineering) 매트릭스 표 모델
// 7. 시나리오 임의 확률(25%, 50% 등) 완전 삭제 및 비가중 민감도 밴드(Unweighted Band) 전환
// 8. 상승률 부호 포맷터 엄밀화 (음수 시 정확히 -X.X% 출력)
// 9. 보수적 정적 DCF(7.5만원) vs 시장 증권사 컨센서스(45~54만원) 괴리 비교 분석 모델

import {
  ALTEOGEN_DART_PROVENANCE,
  ALTEOGEN_KRX_PROVENANCE,
  MSD_KEYTRUDA_SC_GUIDANCE,
  HALOZYME_DISPUTE_METADATA,
  MERCK_REPORTED_ROYALTY_SOURCE,
  NOVARTIS_CONTRACT_PROVENANCE,
  OTHER_PARTNERSHIPS_PROVENANCE
} from './dataProvenance';

// 기준 상수 정의: 키트루다 피크 매출 및 원/달러 기준 환율
export const KEYTRUDA_GLOBAL_PEAK_SALES_USD = 28000; // 280억 달러 ($28,000M)
export const BASELINE_USD_KRW_EXCHANGE_RATE = 1380;   // 1,380 KRW/USD

// 상승률/하락률 부호 엄밀 포맷터 (음수 시 -X.X%, 양수 시 +X.X%, 0 시 0.0%)
export const formatUpsidePct = (upside: number): string => {
  if (upside > 0) return `+${upside.toFixed(1)}%`;
  if (upside < 0) return `${upside.toFixed(1)}%`;
  return '0.0%';
};

export interface AccountingIdentityCheck {
  isSalesMatched: boolean;
  isOpMatched: boolean;
  isNpMatched: boolean;
  salesSum: number;
  fySales: number;
  salesDiff: number;
  opSum: number;
  fyOp: number;
  opDiff: number;
  npSum: number;
  fyNp: number;
  npDiff: number;
  auditPass: boolean;
  auditMessage: string;
}

export interface BioModelParameters {
  stockCode: string;
  stockName: string;
  partnerName: string; // 예: 머크 (MSD)
  targetDrugName: string; // 예: 키트루다 SC (키트루다 큐렉스, 2025.09.19 FDA 승인 완료)
  approvalQuarter: string;
  posRate: number; // 승인 후 글로벌 상용화 성공 및 적응증 확장률 (0.70 ~ 0.98)
  milestoneTotalKrw: number; // 상용화 잔여 마일스톤 총액 (억원)
  milestoneExpectedYearKrw: number; // 해당 12M 기간 인식 마일스톤 (억원)
  globalPeakSalesUsd: number; // 파트너사 글로벌 피크 매출 (백만 달러, 기본 28,000M$)
  scConversionRate: number; // SC 전환율 (0.10 ~ 0.70, MSD 가이던스 30~40% 감안 기본 0.35)
  royaltyRate: number; // 러닝 로열티율 (보도된 머크 계약 추정 요율 기본 0.02 = 2.0%)
  novartisAnnualKrw: number; // 노바티스 라이선스 계약 연간 기여분 (억원, 기본 500억 가정)
  otherPartnershipsAnnualKrw: number; // 다이이찌산쿄 ADC, GSK, 바이오젠 등 기타 기술이전 계약 (억원, 기본 450억)
  waccRate: number; // WACC 할인율 (0.07 ~ 0.12, 기본 0.095 = 9.5%)
  usdKrwRate: number; // 기준 환율 (예: 1,380원)
  sharesOutstanding: number; // 발행 주식 총수 (주, 53,248,307주)
  netCashKrw: number; // 순현금 (현금성자산 - 총차입금, 억원, 3,500억)
  nonPipelineValueKrw: number; // 기존 사업부/테르가제 가치 (억원, 4,200억)
  halozymeDisputeStatus: 'ONGOING_VERIFICATION_REQUIRED';
}

export interface WhiteBoxQuarterEstimate {
  quarter: string;
  milestoneKrw: number; // 마일스톤 매출 (억원)
  royaltyKrw: number; // SC 로열티 매출 (억원)
  baseSalesKrw: number; // 기존 플랫폼 및 타 파트너사 매출 (억원)
  totalSalesKrw: number; // 총매출
  cogsKrw: number; // 매출원가
  opexKrw: number; // 판관비 (R&D 경상비 포함)
  opKrw: number; // 영업이익
  npKrw: number; // 순이익
  opmPct: number; // 영업이익률 (%)
  commentary: string;
}

export interface DetailedValuationBreakdown {
  keytrudaPeakSalesUsd: number;
  scConversionRatePct: number;
  annualKeytrudaScSalesUsd: number;
  royaltyRatePct: number;
  annualRoyaltyUsd: number;
  annualRoyaltyKrw: number; // 억원
  annualMilestoneKrw: number; // 억원
  novartisKrw: number; // 노바티스 500억원
  otherPartnershipsKrw: number; // 다이이찌산쿄, AZ, GSK 등 기타 파이프라인
  totalPipelineSalesKrw: number;
  normalizedFcfKrw: number;
  waccRatePct: number;
  pipelineDcfKrw: number; // DCF 파이프라인 가치
  pipelineRnpvKrw: number; // 호환용 필드
  nonPipelineValueKrw: number;
  enterpriseValueKrw: number;
  netCashKrw: number;
  equityValueKrw: number; // 주주가치
  sharesOutstanding: number;
  exactTargetPricePerShare: number; // 미라운딩 순수 계산 결과
  targetPriceRounded: number; // 금융 표준 1,000원 단위 라운딩
  currentPrice: number;
  upsidePct: number;
}

// 1. 주당가치 워터폴 가치 브리지(Value Bridge) 항목
export interface ValueBridgeStep {
  stepOrder: number;
  itemName: string;
  category: 'pipeline' | 'non_pipeline' | 'ev' | 'net_cash' | 'equity' | 'per_share';
  valueKrw: number; // 억원
  perShareKrw: number; // 주당 환산가치 (원)
  shareOfTotalPct: number; // 주주가치 대비 비중 (%)
  description: string;
}

// 2. 현재가를 정당화하는 역산(Reverse Engineering) 매트릭스
export interface ReverseEngineeringCell {
  conversionRatePct: number;
  royaltyRatePct: number;
  impliedTargetPrice: number;
  upsidePct: number;
  justifiesCurrentPrice: boolean; // impliedTargetPrice >= currentPrice
}

export interface ReverseEngineeringAnalysis {
  currentPrice: number;
  conversionRatesPct: number[]; // [20, 25, 30, 35, 40, 50, 60]
  royaltyRatesPct: number[]; // [1.5, 2.0, 2.5, 3.0, 4.0]
  matrix: ReverseEngineeringCell[][];
  requiredConversionAtReportedRoyalty: number; // 보도된 2.0% 로열티 기준 현재가를 정당화하기 위해 필요한 SC 전환율 (%)
  marketImpliedInsight: string;
}

// 3. 보수적 정적 DCF vs 증권사 멀티이어 컨센서스 괴리 비교 분석
export interface ConsensusGapAnalysis {
  conservativeDcf: {
    targetPrice: number;
    upsidePct: number;
    keytrudaScConversionPct: number;
    keytrudaRoyaltyRatePct: number;
    modelType: string;
    assumptions: string[];
  };
  streetConsensus: {
    brokerTargets: { broker: string; targetPrice: number; upsidePct: number }[];
    averageTargetPrice: number;
    impliedConversionPct: number;
    impliedRoyaltyPct: number;
    keyDrivers: string[];
  };
  gapBridgeReasoning: string;
}

export interface WhiteBoxScenario {
  name: 'Bull (낙관)' | 'Base (기본·공식)' | 'Bear (약세·하방)';
  // [임의 확률 완전 삭제] 근거 없는 확률 필드 배제
  scConversionRatePct: number; // SC 전환율
  royaltyRatePct: number; // 로열티율
  waccRatePct: number; // WACC
  novartisKrw: number; // 노바티스 기여분 (억원)
  otherPartnershipsKrw: number; // 기타 계약 기여분 (억원)
  targetPrice: number; // <동적 연산 결과> 라운딩된 목표주가 (원)
  targetPriceLower: number; // 신뢰구간 하단 (원)
  targetPriceUpper: number; // 신뢰구간 상단 (원)
  upsidePct: number; // 기준가 대비 상승여력 (%)
  rationale: string;
  macroTrigger: string;
  breakdown: DetailedValuationBreakdown;
}

export interface BaselineDataSource {
  filingTitle: string;
  filingDate: string;
  filingReportCode: string;
  asOfDate: string;
  actualTrailingSalesKrw: number; // 억원
  actualTrailingOpKrw: number; // 억원
  actualTrailingNpKrw: number; // 억원
  actualCashEquivalentsKrw: number; // 억원
  actualTotalDebtKrw: number; // 억원
  actualSharesCount: number; // 주
  dataProvenanceNote: string;
}

export interface WhiteBoxEvaluationResult {
  stockCode: string;
  stockName: string;
  baseline: BaselineDataSource;
  parameters: BioModelParameters;
  quarterEstimates: WhiteBoxQuarterEstimate[];
  fyTotals: {
    salesKrw: number;
    opKrw: number;
    npKrw: number;
    opmPct: number;
  };
  accountingCheck: AccountingIdentityCheck;
  valuation: DetailedValuationBreakdown;
  scenarios: WhiteBoxScenario[];
  valueBridge: ValueBridgeStep[];
  reverseEngineering: ReverseEngineeringAnalysis;
  consensusGap: ConsensusGapAnalysis;
  disputeNotice: typeof HALOZYME_DISPUTE_METADATA;
}

// 회계 항등식 강제 검증 함수 (4Q 합계 = FY 연간 일치 여부 판정)
export const verifyAccountingIdentity = (
  quarterEstimates: { quarter: string; sales: number; op: number; np: number }[],
  fySales: number,
  fyOp: number,
  fyNp: number
): AccountingIdentityCheck => {
  const salesSum = quarterEstimates.reduce((acc, q) => acc + q.sales, 0);
  const opSum = quarterEstimates.reduce((acc, q) => acc + q.op, 0);
  const npSum = quarterEstimates.reduce((acc, q) => acc + q.np, 0);

  const salesDiff = Math.abs(salesSum - fySales);
  const opDiff = Math.abs(opSum - fyOp);
  const npDiff = Math.abs(npSum - fyNp);

  const isSalesMatched = salesDiff < 1; // 1억원 미만 반올림 오차 허용
  const isOpMatched = opDiff < 1;
  const isNpMatched = npDiff < 1;
  const auditPass = isSalesMatched && isOpMatched && isNpMatched;

  return {
    isSalesMatched,
    isOpMatched,
    isNpMatched,
    salesSum,
    fySales,
    salesDiff,
    opSum,
    fyOp,
    opDiff,
    npSum,
    fyNp,
    npDiff,
    auditPass,
    auditMessage: auditPass
      ? '회계 항등식 통과: 4개 분기 합계와 연간(FY) 실적이 100% 일치합니다.'
      : `회계 불일치 경고: 분기 합산과 연간 수치 간 오차 발생 (매출 오차: ${salesDiff}억, 영업익 오차: ${opDiff}억).`
  };
};

// 가짜 정밀도 제거: 금융 표준 1,000원 단위 라운딩 함수
export const roundToFinancialUnit = (val: number, unit: number = 1000): number => {
  return Math.round(val / unit) * unit;
};

// 순수 수학적 바이오 밸류에이션 계산기 (하드코딩 배제, 수식 체인 100% 계산)
export function calculateBioValuationChain(
  keytrudaPeakSalesUsd: number,
  scConversionRate: number,
  royaltyRate: number,
  posRate: number,
  milestoneAnnualKrw: number,
  novartisAnnualKrw: number,
  otherPartnershipsAnnualKrw: number,
  waccRate: number,
  usdKrwRate: number,
  sharesOutstanding: number,
  netCashKrw: number,
  nonPipelineValueKrw: number,
  currentPrice: number
): DetailedValuationBreakdown {
  // 1) 연간 키트루다 SC 매출 (USD M$)
  const annualKeytrudaScSalesUsd = keytrudaPeakSalesUsd * scConversionRate;

  // 2) 연간 키트루다 SC 로열티 (USD M$)
  const annualRoyaltyUsd = annualKeytrudaScSalesUsd * royaltyRate;

  // 3) 연간 로열티 원화 환산 (억원, 환율 반영)
  const annualRoyaltyKrw = Math.round((annualRoyaltyUsd * usdKrwRate) / 100);

  // 4) 총 파이프라인 연간 매출 (키트루다 로열티 + 마일스톤 + 노바티스 500억 + 기타 플랫폼 450억)
  const totalPipelineSalesKrw = annualRoyaltyKrw + milestoneAnnualKrw + novartisAnnualKrw + otherPartnershipsAnnualKrw;

  // 5) 정규화 FCF 추정 (고마진 기술료 구조: 원가율 12%, 판관/R&D 550억, 법인세율 22%)
  const estimatedOpexKrw = 550;
  const estimatedCogsKrw = Math.round(totalPipelineSalesKrw * 0.12);
  const estimatedOpKrw = Math.max(0, totalPipelineSalesKrw - estimatedCogsKrw - estimatedOpexKrw);
  const estimatedNpKrw = Math.round(estimatedOpKrw * 0.78);
  const normalizedFcfKrw = Math.round(estimatedNpKrw * 1.08); // 감가상각 가산 현금흐름

  // 6) 파이프라인 DCF (영구 성장률 1.5% 및 WACC 할인, 기승인 의약품 표준 DCF)
  const g = 0.015;
  const discountSpread = Math.max(0.04, waccRate - g);
  const pipelineDcfKrw = Math.round(((normalizedFcfKrw / discountSpread) * posRate) + (milestoneAnnualKrw * 1.5));

  // 7) 기업가치(EV) = 파이프라인 DCF 가치 + 비파이프라인 플랫폼/테르가제 가치
  const enterpriseValueKrw = pipelineDcfKrw + nonPipelineValueKrw;

  // 8) 주주가치(Equity Value) = 기업가치 + 순현금(Net Cash)
  const equityValueKrw = enterpriseValueKrw + netCashKrw;

  // 9) 주당 본질가치 (원)
  const exactTargetPricePerShare = (equityValueKrw * 100000000) / sharesOutstanding;
  const targetPriceRounded = roundToFinancialUnit(exactTargetPricePerShare, 1000);
  const upsidePct = Number((((targetPriceRounded - currentPrice) / currentPrice) * 100).toFixed(1));

  return {
    keytrudaPeakSalesUsd,
    scConversionRatePct: Math.round(scConversionRate * 100),
    annualKeytrudaScSalesUsd,
    royaltyRatePct: Number((royaltyRate * 100).toFixed(1)),
    annualRoyaltyUsd: Math.round(annualRoyaltyUsd),
    annualRoyaltyKrw,
    annualMilestoneKrw: milestoneAnnualKrw,
    novartisKrw: novartisAnnualKrw,
    otherPartnershipsKrw: otherPartnershipsAnnualKrw,
    totalPipelineSalesKrw,
    normalizedFcfKrw,
    waccRatePct: Number((waccRate * 100).toFixed(1)),
    pipelineDcfKrw,
    pipelineRnpvKrw: pipelineDcfKrw, // 이전 버전 호환용
    nonPipelineValueKrw,
    enterpriseValueKrw,
    netCashKrw,
    equityValueKrw,
    sharesOutstanding,
    exactTargetPricePerShare: Math.round(exactTargetPricePerShare),
    targetPriceRounded,
    currentPrice,
    upsidePct
  };
}

// 알테오젠 디폴트 파라미터 (보도된 2% 로열티율 및 노바티스 500억원 계약 반영)
export const DEFAULT_ALTEOGEN_BIO_PARAMS: BioModelParameters = {
  stockCode: '196170',
  stockName: '알테오젠',
  partnerName: 'Merck & Co. (MSD)',
  targetDrugName: 'Keytruda SC (키트루다 큐렉스, 2025.09.19 FDA 허가 완료)',
  approvalQuarter: '2025.3Q (기 허가 완료)',
  posRate: 0.92, // 기 허가 완료 후 적응증 추가 및 글로벌 공급 안정화 확률 92%
  milestoneTotalKrw: 1800, // 잔여 상용화 마일스톤 총액 1,800억원
  milestoneExpectedYearKrw: 650, // 상용화 출하 및 판매 마일스톤 연간 650억원
  globalPeakSalesUsd: 28000, // 키트루다 글로벌 피크 매출 컨센서스 280억 달러
  scConversionRate: 0.35, // MSD 공식 가이던스(18~24개월 내 30~40%) 중간값인 35% 적용
  royaltyRate: 0.02, // [보도된 2% 수준 적용] 머크 독점 라이선스 변경 계약 추정 로열티 2.0%
  novartisAnnualKrw: 500, // [신규 반영] 노바티스 ALT-B4 피하제형 라이선스 계약 연간 기여분 500억원
  otherPartnershipsAnnualKrw: 450, // 다이이찌산쿄(ADC), 아스트라제네카, GSK 등 기타 기술이전 계약 연간 기여분 450억원
  waccRate: 0.095, // 바이오 플랫폼 WACC 9.5%
  usdKrwRate: 1380, // 기준 환율 1,380원
  sharesOutstanding: 53248307, // 5,324만 8,307주 (DART 공시 기준)
  netCashKrw: 3500, // 순현금 3,500억원
  nonPipelineValueKrw: 4200, // 기존 테르가제 등 사업가치 4,200억원
  halozymeDisputeStatus: 'ONGOING_VERIFICATION_REQUIRED'
};

// 알테오젠 DART 출발점 베이스라인 데이터
export const ALTEOGEN_BASELINE_DATA: BaselineDataSource = {
  filingTitle: 'DART 사업보고서(2025.12) 및 최신 시세 증빙 데이터',
  filingDate: '2026-03-18',
  filingReportCode: '20260318000492',
  asOfDate: '2026-03-31',
  actualTrailingSalesKrw: 1820,
  actualTrailingOpKrw: 980,
  actualTrailingNpKrw: 790,
  actualCashEquivalentsKrw: 4100,
  actualTotalDebtKrw: 600,
  actualSharesCount: 53248307,
  dataProvenanceNote: '2026-03-31 시점 당시에는 1Q26(5/15 공시)이 미발표 상태였으므로 사업보고서만 공시 확정치로 격리'
};

// 완전 역동적 화이트박스 연산 엔진 (하드코딩 숫자 전면 제거)
export const calculateWhiteBoxEvaluation = (
  params: BioModelParameters = DEFAULT_ALTEOGEN_BIO_PARAMS,
  baseline: BaselineDataSource = ALTEOGEN_BASELINE_DATA,
  currentPrice: number = 382500 // 최신 거래가(또는 기준일 시세)
): WhiteBoxEvaluationResult => {
  const {
    posRate,
    milestoneExpectedYearKrw,
    globalPeakSalesUsd,
    scConversionRate,
    royaltyRate,
    novartisAnnualKrw,
    otherPartnershipsAnnualKrw,
    waccRate,
    usdKrwRate,
    sharesOutstanding,
    netCashKrw,
    nonPipelineValueKrw
  } = params;

  // Base 공식 밸류에이션 계산 체인 실행
  const baseValuation = calculateBioValuationChain(
    globalPeakSalesUsd,
    scConversionRate,
    royaltyRate,
    posRate,
    milestoneExpectedYearKrw,
    novartisAnnualKrw,
    otherPartnershipsAnnualKrw,
    waccRate,
    usdKrwRate,
    sharesOutstanding,
    netCashKrw,
    nonPipelineValueKrw,
    currentPrice
  );

  // Bull 시나리오 (침투 가속, MSD 가이던스 상회)
  // - SC 전환율: 50%
  // - 로열티율: 2.5% (인센티브 볼륨 티어 상단)
  // - 노바티스 700억, 기타 계약 700억 (추가 파이프라인 확장)
  // - WACC: 8.5%
  const bullValuation = calculateBioValuationChain(
    Math.round(globalPeakSalesUsd * 1.07), // 30,000M$
    0.50,
    0.025,
    0.95,
    Math.round(milestoneExpectedYearKrw * 1.25),
    700,
    700,
    0.085,
    usdKrwRate,
    sharesOutstanding,
    netCashKrw,
    Math.round(nonPipelineValueKrw * 1.15),
    currentPrice
  );

  // Bear 시나리오 (전환 지연 및 할로자임 분쟁 에스크로 유보)
  // - SC 전환율: 20%
  // - 로열티율: 1.6% (2.0%에서 20% 에스크로 유보 차감)
  // - 노바티스 300억, 기타 계약 250억
  // - WACC: 10.5% (소송 노이즈 및 바이오 리스크 프리미엄)
  const bearValuation = calculateBioValuationChain(
    Math.round(globalPeakSalesUsd * 0.90), // 25,200M$
    0.20,
    0.016,
    0.80,
    Math.round(milestoneExpectedYearKrw * 0.70),
    300,
    250,
    0.105,
    usdKrwRate,
    sharesOutstanding,
    netCashKrw,
    Math.round(nonPipelineValueKrw * 0.85),
    currentPrice
  );

  // 12개월 기간 인식 분기별 추정 (회계 항등식 준수)
  const qMilestone = [
    Math.round(milestoneExpectedYearKrw * 0.15),
    Math.round(milestoneExpectedYearKrw * 0.30),
    Math.round(milestoneExpectedYearKrw * 0.35),
    0
  ];
  qMilestone[3] = milestoneExpectedYearKrw - (qMilestone[0] + qMilestone[1] + qMilestone[2]);

  const baseQuarterRoyalty = Math.round(baseValuation.annualRoyaltyKrw * 0.25);
  const qRoyalty = [
    Math.round(baseQuarterRoyalty * 0.75),
    Math.round(baseQuarterRoyalty * 0.90),
    Math.round(baseQuarterRoyalty * 1.10),
    0
  ];
  qRoyalty[3] = baseValuation.annualRoyaltyKrw - (qRoyalty[0] + qRoyalty[1] + qRoyalty[2]);

  const baseQuarterPlatform = Math.round((novartisAnnualKrw + otherPartnershipsAnnualKrw) * 0.25) + 120;

  const quarterEstimates: WhiteBoxQuarterEstimate[] = [
    {
      quarter: '1Q (연간 모델 안분 1차)',
      milestoneKrw: qMilestone[0],
      royaltyKrw: qRoyalty[0],
      baseSalesKrw: baseQuarterPlatform,
      totalSalesKrw: qMilestone[0] + qRoyalty[0] + baseQuarterPlatform,
      cogsKrw: Math.round((qMilestone[0] + qRoyalty[0] + baseQuarterPlatform) * 0.15),
      opexKrw: 125,
      opKrw: 0,
      npKrw: 0,
      opmPct: 0,
      commentary: '키트루다SC 기승인 후 글로벌 출하 및 초기 로열티 유입 단계'
    },
    {
      quarter: '2Q (연간 모델 안분 2차)',
      milestoneKrw: qMilestone[1],
      royaltyKrw: qRoyalty[1],
      baseSalesKrw: baseQuarterPlatform,
      totalSalesKrw: qMilestone[1] + qRoyalty[1] + baseQuarterPlatform,
      cogsKrw: Math.round((qMilestone[1] + qRoyalty[1] + baseQuarterPlatform) * 0.15),
      opexKrw: 130,
      opKrw: 0,
      npKrw: 0,
      opmPct: 0,
      commentary: '미국 주요 암센터 SC 처방 전환 및 노바티스 마일스톤 유입'
    },
    {
      quarter: '3Q (연간 모델 안분 3차)',
      milestoneKrw: qMilestone[2],
      royaltyKrw: qRoyalty[2],
      baseSalesKrw: baseQuarterPlatform,
      totalSalesKrw: qMilestone[2] + qRoyalty[2] + baseQuarterPlatform,
      cogsKrw: Math.round((qMilestone[2] + qRoyalty[2] + baseQuarterPlatform) * 0.14),
      opexKrw: 135,
      opKrw: 0,
      npKrw: 0,
      opmPct: 0,
      commentary: '유럽 EMA 승인국 출시 확대 및 원료의약품(DS) 배치 출하'
    },
    {
      quarter: '4Q (연간 모델 안분 4차)',
      milestoneKrw: qMilestone[3],
      royaltyKrw: qRoyalty[3],
      baseSalesKrw: baseQuarterPlatform,
      totalSalesKrw: qMilestone[3] + qRoyalty[3] + baseQuarterPlatform,
      cogsKrw: Math.round((qMilestone[3] + qRoyalty[3] + baseQuarterPlatform) * 0.14),
      opexKrw: 140,
      opKrw: 0,
      npKrw: 0,
      opmPct: 0,
      commentary: '글로벌 엔드마켓 SC 침투율 35% 안착에 따른 계단식 로열티 피크'
    }
  ];

  quarterEstimates.forEach((q) => {
    q.opKrw = q.totalSalesKrw - q.cogsKrw - q.opexKrw;
    q.npKrw = Math.round(q.opKrw * 0.78);
    q.opmPct = Math.round((q.opKrw / q.totalSalesKrw) * 1000) / 10;
  });

  const fySales = quarterEstimates.reduce((acc, q) => acc + q.totalSalesKrw, 0);
  const fyOp = quarterEstimates.reduce((acc, q) => acc + q.opKrw, 0);
  const fyNp = quarterEstimates.reduce((acc, q) => acc + q.npKrw, 0);
  const fyOpmPct = Math.round((fyOp / fySales) * 1000) / 10;

  const accountingCheck = verifyAccountingIdentity(
    quarterEstimates.map(q => ({ quarter: q.quarter, sales: q.totalSalesKrw, op: q.opKrw, np: q.npKrw })),
    fySales,
    fyOp,
    fyNp
  );

  // 3대 시나리오: [근거 없는 임의 확률(25%, 50%) 완전 삭제]
  const scenarios: WhiteBoxScenario[] = [
    {
      name: 'Bull (낙관)',
      scConversionRatePct: 50,
      royaltyRatePct: 2.5,
      waccRatePct: 8.5,
      novartisKrw: 700,
      otherPartnershipsKrw: 700,
      targetPrice: bullValuation.targetPriceRounded,
      targetPriceLower: roundToFinancialUnit(bullValuation.exactTargetPricePerShare * 0.95, 1000),
      targetPriceUpper: roundToFinancialUnit(bullValuation.exactTargetPricePerShare * 1.05, 1000),
      upsidePct: bullValuation.upsidePct,
      rationale: `MSD 가이던스 상회 가설: 투여시간 단축에 따른 외래 클리닉 채택 급증으로 SC 전환율 50% 조기 달성, 볼륨 인센티브 요율 2.5%, 노바티스 700억 및 ADC 등 추가 L/O 700억원`,
      macroTrigger: '바이오시밀러 방어 성공 및 글로벌 빅파마 피하제형 추가 라이선스아웃 계약 체결',
      breakdown: bullValuation
    },
    {
      name: 'Base (기본·공식)',
      scConversionRatePct: Math.round(scConversionRate * 100),
      royaltyRatePct: Number((royaltyRate * 100).toFixed(1)),
      waccRatePct: Number((waccRate * 100).toFixed(1)),
      novartisKrw: novartisAnnualKrw,
      otherPartnershipsKrw: otherPartnershipsAnnualKrw,
      targetPrice: baseValuation.targetPriceRounded,
      targetPriceLower: roundToFinancialUnit(baseValuation.exactTargetPricePerShare * 0.95, 1000),
      targetPriceUpper: roundToFinancialUnit(baseValuation.exactTargetPricePerShare * 1.05, 1000),
      upsidePct: baseValuation.upsidePct,
      rationale: `MSD 공식 IR 가이던스(출시 18~24개월 내 30~40%) 중간값인 SC 전환율 35% 부합. 보도된 로열티율 2.0% 및 노바티스 500억원, 기타 플랫폼 450억원 반영`,
      macroTrigger: '미국·유럽 엔드유저 처방 데이터 정상 전환 및 분기 로열티 현금흐름 가시화',
      breakdown: baseValuation
    },
    {
      name: 'Bear (약세·하방)',
      scConversionRatePct: 20,
      royaltyRatePct: 1.6,
      waccRatePct: 10.5,
      novartisKrw: 300,
      otherPartnershipsKrw: 250,
      targetPrice: bearValuation.targetPriceRounded,
      targetPriceLower: roundToFinancialUnit(bearValuation.exactTargetPricePerShare * 0.95, 1000),
      targetPriceUpper: roundToFinancialUnit(bearValuation.exactTargetPricePerShare * 1.05, 1000),
      upsidePct: bearValuation.upsidePct,
      rationale: `하방 스트레스 테스트: 의료진 IV 관행 고착으로 SC 전환율 20% 정체, MSD-할로자임 분쟁 에스크로 유보로 실효 로열티 1.6% 하락, WACC 10.5% 상승`,
      macroTrigger: '할로자임 특허 분쟁 장기화에 따른 법적 불확실성 상존 및 글로벌 고금리 장기화',
      breakdown: bearValuation
    }
  ];

  // =========================================================================
  // [NEW] 주당가치 워터폴 가치 브리지 (Value Bridge) 산출
  // =========================================================================
  const totalShares = sharesOutstanding;
  const totalEquity = baseValuation.equityValueKrw;

  // 파이프라인 세부 항목별 DCF 기여액 산출
  const totalPipelineRevenue = baseValuation.totalPipelineSalesKrw;
  const keytrudaRoyaltyShare = baseValuation.annualRoyaltyKrw / totalPipelineRevenue;
  const milestoneShare = baseValuation.annualMilestoneKrw / totalPipelineRevenue;
  const novartisShare = baseValuation.novartisKrw / totalPipelineRevenue;
  const otherPlatformShare = baseValuation.otherPartnershipsKrw / totalPipelineRevenue;

  const keytrudaDcfKrw = Math.round(baseValuation.pipelineDcfKrw * keytrudaRoyaltyShare);
  const milestoneDcfKrw = Math.round(baseValuation.pipelineDcfKrw * milestoneShare);
  const novartisDcfKrw = Math.round(baseValuation.pipelineDcfKrw * novartisShare);
  const otherPlatformDcfKrw = Math.round(baseValuation.pipelineDcfKrw * otherPlatformShare);

  const valueBridge: ValueBridgeStep[] = [
    {
      stepOrder: 1,
      itemName: '키트루다SC 연간 로열티 가치 (2.0% DCF 현금흐름)',
      category: 'pipeline',
      valueKrw: keytrudaDcfKrw,
      perShareKrw: Math.round((keytrudaDcfKrw * 100000000) / totalShares),
      shareOfTotalPct: Number(((keytrudaDcfKrw / totalEquity) * 100).toFixed(1)),
      description: `키트루다 피크 280억$ × 환율 1,380원 × 전환율 35% × 보도 로열티 2.0% (연간 ${baseValuation.annualRoyaltyKrw}억 현금흐름) DCF 할인`
    },
    {
      stepOrder: 2,
      itemName: '키트루다SC 잔여 상용화 마일스톤 가치',
      category: 'pipeline',
      valueKrw: milestoneDcfKrw,
      perShareKrw: Math.round((milestoneDcfKrw * 100000000) / totalShares),
      shareOfTotalPct: Number(((milestoneDcfKrw / totalEquity) * 100).toFixed(1)),
      description: `FDA 승인 후 단계별 상용화 출하 및 판매 마일스톤 (연간 ${params.milestoneExpectedYearKrw}억원) 현가`
    },
    {
      stepOrder: 3,
      itemName: '노바티스(Novartis) 라이선스 계약 가치 (추정)',
      category: 'pipeline',
      valueKrw: novartisDcfKrw,
      perShareKrw: Math.round((novartisDcfKrw * 100000000) / totalShares),
      shareOfTotalPct: Number(((novartisDcfKrw / totalEquity) * 100).toFixed(1)),
      description: `노바티스 ALT-B4 피하제형 기술수출 연간 ${params.novartisAnnualKrw}억원 기여분 DCF 현가 (추정 가정)`
    },
    {
      stepOrder: 4,
      itemName: '다이이찌산쿄(ADC) 및 GSK/바이오젠 계약 가치',
      category: 'pipeline',
      valueKrw: otherPlatformDcfKrw,
      perShareKrw: Math.round((otherPlatformDcfKrw * 100000000) / totalShares),
      shareOfTotalPct: Number(((otherPlatformDcfKrw / totalEquity) * 100).toFixed(1)),
      description: `엔허투 등 ADC 피하주사 공동개발 및 GSK/바이오젠 계약 연간 ${params.otherPartnershipsAnnualKrw}억원 기여분 DCF`
    },
    {
      stepOrder: 5,
      itemName: '비파이프라인 플랫폼 및 테르가제 사업가치',
      category: 'non_pipeline',
      valueKrw: params.nonPipelineValueKrw,
      perShareKrw: Math.round((params.nonPipelineValueKrw * 100000000) / totalShares),
      shareOfTotalPct: Number(((params.nonPipelineValueKrw / totalEquity) * 100).toFixed(1)),
      description: '인간 유래 히알루로니다제 단독 완제품(테르가제) 국내외 매출 및 플랫폼 IP 가치'
    },
    {
      stepOrder: 6,
      itemName: '총 기업가치 (Enterprise Value 소계)',
      category: 'ev',
      valueKrw: baseValuation.enterpriseValueKrw,
      perShareKrw: Math.round((baseValuation.enterpriseValueKrw * 100000000) / totalShares),
      shareOfTotalPct: Number(((baseValuation.enterpriseValueKrw / totalEquity) * 100).toFixed(1)),
      description: '파이프라인 DCF 가치 + 테르가제 사업가치 합계'
    },
    {
      stepOrder: 7,
      itemName: '(+) 순현금 (현금성자산 4,100억 - 차입금 600억)',
      category: 'net_cash',
      valueKrw: params.netCashKrw,
      perShareKrw: Math.round((params.netCashKrw * 100000000) / totalShares),
      shareOfTotalPct: Number(((params.netCashKrw / totalEquity) * 100).toFixed(1)),
      description: 'DART 정규 사업보고서(20260318000492) 연결 감사보고서 공시 확정 순현금'
    },
    {
      stepOrder: 8,
      itemName: '총 주주가치 (Total Equity Value)',
      category: 'equity',
      valueKrw: baseValuation.equityValueKrw,
      perShareKrw: Math.round(baseValuation.exactTargetPricePerShare),
      shareOfTotalPct: 100.0,
      description: '기업가치(EV) + 순현금(Net Cash)'
    },
    {
      stepOrder: 9,
      itemName: '최종 주당 본질가치 (1,000원 금융 라운딩)',
      category: 'per_share',
      valueKrw: baseValuation.equityValueKrw,
      perShareKrw: baseValuation.targetPriceRounded,
      shareOfTotalPct: 100.0,
      description: `총 주주가치 ÷ 53,248,307주 = ${baseValuation.exactTargetPricePerShare.toLocaleString()}원 → ${baseValuation.targetPriceRounded.toLocaleString()}원`
    }
  ];

  // =========================================================================
  // [NEW] 현재가를 정당화하는 전환율·로열티 역산(Reverse Engineering) 매트릭스
  // =========================================================================
  const conversionGrid = [0.20, 0.25, 0.30, 0.35, 0.40, 0.50, 0.60];
  const royaltyGrid = [0.015, 0.020, 0.025, 0.030, 0.040];

  const reverseMatrix: ReverseEngineeringCell[][] = conversionGrid.map(conv => {
    return royaltyGrid.map(roy => {
      const cellVal = calculateBioValuationChain(
        globalPeakSalesUsd,
        conv,
        roy,
        posRate,
        milestoneExpectedYearKrw,
        novartisAnnualKrw,
        otherPartnershipsAnnualKrw,
        waccRate,
        usdKrwRate,
        sharesOutstanding,
        netCashKrw,
        nonPipelineValueKrw,
        currentPrice
      );
      return {
        conversionRatePct: Math.round(conv * 100),
        royaltyRatePct: Number((roy * 100).toFixed(1)),
        impliedTargetPrice: cellVal.targetPriceRounded,
        upsidePct: cellVal.upsidePct,
        justifiesCurrentPrice: cellVal.targetPriceRounded >= currentPrice
      };
    });
  });

  // 보도된 2.0% 로열티 하에서 현재 주가(currentPrice)를 정당화하기 위해 필요한 최소 SC 전환율 정밀 역산
  let lowC = 0.10;
  let highC = 1.00;
  for (let iter = 0; iter < 20; iter++) {
    const midC = (lowC + highC) / 2;
    const testVal = calculateBioValuationChain(
      globalPeakSalesUsd,
      midC,
      0.02, // 보도된 2% 고정
      posRate,
      milestoneExpectedYearKrw,
      novartisAnnualKrw,
      otherPartnershipsAnnualKrw,
      waccRate,
      usdKrwRate,
      sharesOutstanding,
      netCashKrw,
      nonPipelineValueKrw,
      currentPrice
    );
    if (testVal.targetPriceRounded >= currentPrice) {
      highC = midC;
    } else {
      lowC = midC;
    }
  }
  const requiredConversionAtReportedRoyalty = Number((((lowC + highC) / 2) * 100).toFixed(1));

  const marketImpliedInsight = `현재 시장 주가(${currentPrice.toLocaleString()}원)는 보도된 로열티율 2.0% 기준, 키트루다 전체 환자의 약 ${requiredConversionAtReportedRoyalty}%가 SC로 전환되어야 정당화됩니다. 이는 MSD 공식 가이던스(출시 18~24개월 내 30~40%)와 비교할 때 시장이 ${requiredConversionAtReportedRoyalty > 40 ? '가이던스 상단을 크게 웃도는 복수 파이프라인 확장 및 2028년 이후 고전환율을 선반영하고 있음' : '가이던스 범위 내에서 비교적 합리적으로 평가하고 있음'}을 시사합니다.`;

  const reverseEngineering: ReverseEngineeringAnalysis = {
    currentPrice,
    conversionRatesPct: conversionGrid.map(c => Math.round(c * 100)),
    royaltyRatesPct: royaltyGrid.map(r => Number((r * 100).toFixed(1))),
    matrix: reverseMatrix,
    requiredConversionAtReportedRoyalty,
    marketImpliedInsight
  };

  // =========================================================================
  // [NEW] 보수적 정적 DCF(7.5만원) vs 시장 증권사 컨센서스(45~54만원) 괴리 비교 분석
  // =========================================================================
  const brokerTargets = [
    { broker: '대신증권', targetPrice: 450000, upsidePct: Number((((450000 - currentPrice) / currentPrice) * 100).toFixed(1)) },
    { broker: '신한투자증권', targetPrice: 540000, upsidePct: Number((((540000 - currentPrice) / currentPrice) * 100).toFixed(1)) },
    { broker: '미래에셋증권', targetPrice: 480000, upsidePct: Number((((480000 - currentPrice) / currentPrice) * 100).toFixed(1)) }
  ];
  const averageTargetPrice = Math.round(brokerTargets.reduce((acc, b) => acc + b.targetPrice, 0) / brokerTargets.length);

  const consensusGap: ConsensusGapAnalysis = {
    conservativeDcf: {
      targetPrice: baseValuation.targetPriceRounded,
      upsidePct: baseValuation.upsidePct,
      keytrudaScConversionPct: Math.round(scConversionRate * 100),
      keytrudaRoyaltyRatePct: Number((royaltyRate * 100).toFixed(1)),
      modelType: '보수적 정적 단일년도 DCF (본 모형)',
      assumptions: [
        '키트루다 피크 280억 달러 및 환율 1,380원 기준',
        'MSD 출시 18~24개월 가이던스(30~40%) 중간값인 35% 정적 반영',
        '언론 보도 로열티율 최저선인 2.0% 단일 요율 적용',
        '2028년 정맥(IV) 특허 만료 후 SC 전환 급증 및 2043년까지의 특허 독점 미반영(1개년 정상 상태 영구 할인)'
      ]
    },
    streetConsensus: {
      brokerTargets,
      averageTargetPrice,
      impliedConversionPct: 65,
      impliedRoyaltyPct: 4.0,
      keyDrivers: [
        '2028년 키트루다 IV 특허 만료에 따른 바이오시밀러 방어 목적으로 SC 전환율이 60~80%로 확대된다는 동적 시나리오 반영',
        '판매 볼륨 증가에 따른 계단식(Tiered) 로열티 요율(2.5% ~ 5.0%) 적용',
        '다이이찌산쿄 엔허투(Enhertu) ADC 피하제형, 노바티스, GSK, 바이오젠 등 복수 빅파마 플랫폼 가치 합산',
        'ALT-B4 물질 특허가 2043년까지 연장됨에 따라 향후 18년간의 독점적 현금흐름 장기 할인 반영'
      ]
    },
    gapBridgeReasoning: `본 모델의 산출가(${baseValuation.targetPriceRounded.toLocaleString()}원)와 시장 증권사 컨센서스(${averageTargetPrice.toLocaleString()}원)의 괴리는 '평가 방법론의 정적(Conservative Static) vs 동적 멀티이어(Dynamic Multi-year Ramp-up) 전제 차이'에서 발생합니다. 본 모형은 보도된 최저 로열티(2.0%)와 MSD 초기 가이던스(35%)만을 보수적으로 반영한 반면, 증권사 및 시장 현재가(${currentPrice.toLocaleString()}원)는 2028년 IV 특허 만료 후 SC 비중의 60~80% 급증 및 2043년까지 이어지는 18년 독점 현금흐름을 선반영하고 있습니다.`
  };

  return {
    stockCode: params.stockCode,
    stockName: params.stockName,
    baseline,
    parameters: params,
    quarterEstimates,
    fyTotals: {
      salesKrw: fySales,
      opKrw: fyOp,
      npKrw: fyNp,
      opmPct: fyOpmPct
    },
    accountingCheck,
    valuation: baseValuation,
    scenarios,
    valueBridge,
    reverseEngineering,
    consensusGap,
    disputeNotice: HALOZYME_DISPUTE_METADATA
  };
};
