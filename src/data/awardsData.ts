export interface AnalystAwardReview {
  id: string;
  rank: number;
  category: string;
  isGrandPrize?: boolean;
  name: string;
  brokerName: string;
  sector: string;
  score: number;
  keyReports: string[];
  metrics: {
    targetPriceAccuracy: number; // 목표주가 적중도 (35%)
    dartAlignment: number;       // DART 실적 정합성 (25%)
    activityTimeliness: number;  // 활동성 및 시의성 (20%)
    logicImpact: number;         // 논리적 완성도 및 시장 영향력 (20%)
  };
  summaryKeywords: string[];
  quantitativeQualitativeAnalysis: string;
  marketContributionInsight: string;
  honorCitation: string;
  isAwardExcluded?: boolean;
  awardExclusionNote?: string;
  isTarget24?: boolean;
  // 5단계 상세 리포트
  fullReport: {
    executiveSummary: string;
    targetPriceTracking: string;
    dartConsistency: string;
    timelinessDepth: string;
    marketHealthContribution: string;
    representativeReport: {
      title: string;
      date: string;
      keyThesis: string;
    };
    h2OutlookAdvice: string;
    citationText: string;
  };
}

export const OFFICIAL_OVERALL_SUMMARY = {
  title: "2026 올해의 애널리스트 어워즈 AI 심사위원단 총평 (Executive Chairman Review)",
  organization: "리본인텔리전스 × 이코노미스트 공동주관 AI 독립 심사평가위원회",
  reviewDate: "2026년 10월 공인 확정 (가중 평균 오차율 평가 모델 v1.8.1)",
  totalReviewedReports: 7842,
  totalReviewedAnalysts: 681,
  totalBrokers: 24, // 24개 공식 대상 증권사 (시상 제외 5개사 포함 1~9월 누적 전수 평가)
  dartCrossCheckRatio: "99.8%",
  corePillars: [
    {
      title: "1. 목표주가 정확성 (30%)",
      desc: "괴리율: (기간별 실제주가 - 목표주가) / 목표주가 * 100 (절댓값이 0에 가까울수록 최고점)",
    },
    {
      title: "2. 실적 추정 정확성 (40% - 최고 가중치)",
      desc: "가중 평균 오차율 모델: 1Q(20%), 2Q(30%), 3Q(50%) × 영업이익(60%), 매출액(20%), 순이익(20%) 9개 항목 정밀 교차검증",
    },
    {
      title: "3. 투자 논리의 타당성 (10%)",
      desc: "리포트에서 핵심 투자 포인트를 얼마나 논리적이고 실증 데이터로 타당하게 입증했는가",
    },
    {
      title: "4. 위험 요소 분석 적절성 (10%)",
      desc: "종목의 하방 리스크와 역발상 위험 요소를 얼마나 구체적이고 합리적으로 제시했는가",
    },
    {
      title: "5. 투자 리포트 발간 빈도 (5%)",
      desc: "정규 리서치 발간 편수와 산업 커버리지 종목 수 기반 활동성 평가",
    },
    {
      title: "6. SNS 주목도 및 언론 빈도 (5%)",
      desc: "투자자 SNS 관심도/언급량(2.5%)과 미디어 언론 보도 빈도(2.5%)의 대외 파급력",
    },
  ],
  chairmanAddress: `「2026 올해의 애널리스트 어워즈(가중 평균 오차율 모델)」는 관행적인 호평 일색의 리서치 문화를 타파하고, 금융감독원 Open DART 공시 데이터 교차검증과 국내 24개 공식 대상 증권사 및 5개 시상제외 평가사의 총 7,842건(1~9월 누적 전수) 실제 발간 리서치 리포트를 정밀 분석한 AI 독립 심사 엔진을 기반으로 최종 선정되었습니다.

이번 개편에서는 특히 실적 추정 정확성에 가장 높은 40% 가중치를 부여하고, '가중 평균 오차율(Weighted Average Error Rate)' 모델을 도입했습니다. 1Q(20%), 2Q(30%), 3Q(50%)의 분기별 가중치와 기업 실적의 핵심인 영업이익(60%), 매출액(20%), 순이익(20%)의 지표별 가중치를 결합한 총 9개 항목의 개별 오차율을 엄정히 산출하여 합산했습니다.

동시에 목표주가 정확성(30%), 투자 논리 타당성(10%), 위험 요소 분석 적절성(10%), 발간 빈도(5%), SNS 및 언론 빈도(5%)의 6대 핵심 지표를 종합 합산하여, 종합 대상 1명과 10대 표준 섹터별 TOP 10 애널리스트(총 100명)를 확정 발표합니다. 특히 소비재/유통/음식료 섹터는 대상 수상자(한유정)를 종합 대상으로 단독 분리하고, 2위였던 박상준 연구원이 섹터 1위 최우수 애널리스트로 공식 승계되었습니다.`
};

export const OFFICIAL_WINNERS_REVIEWS: AnalystAwardReview[] = [
  {
    id: "winner_overall_han",
    rank: 1,
    category: "2026 종합 대상 (Grand Prize)",
    isGrandPrize: true,
    name: "한유정",
    brokerName: "한화투자증권",
    sector: "소비재/유통/음식료",
    score: 97.15,
    keyReports: [
      "K-Food 글로벌 구조적 침투율과 원가 스프레드 역학 분석 (2026.04)",
      "내수 유통 채널 구조조정과 플랫폼 역마진 해소 시나리오 (2026.02)"
    ],
    metrics: {
      targetPriceAccuracy: 76.5,
      dartAlignment: 97.8,
      activityTimeliness: 95.9,
      logicImpact: 96.5,
    },
    summaryKeywords: ["데이터 완결성의 정점", "K-Food 글로벌 패러다임 설계자"],
    quantitativeQualitativeAnalysis: `한유정 연구원은 2026년 고물가와 내수 침체 속에서도 DART 분기 공시 영업이익 추정 오차율 2.1%라는 압도적인 정합성을 입증했습니다. 1년간 제시한 목표주가 달성 성공률 76.5%를 기록(시장 평균 43.8% 대비 압도적 1위)했으며, 곡물가 변동과 환율 요소를 분기별 밸류에이션 모델에 오차 없이 반영하여 정량 평가 전 항목에서 1위를 차지했습니다.`,
    marketContributionInsight: `관행적인 내수 방어주 프레임을 깨고, K-Food의 북미/유럽 침투율을 현지 바이어 데이터와 통관 공시로 실증 분석하여 시장의 밸류에이션 눈높이를 재정의했습니다. 과열 국면에서는 냉철한 이익 정점(Peak-out) 리스크를 조기 경고하며 투자자 자산을 보호했습니다.`,
    honorCitation: `숫자의 냉철함과 통찰의 깊이로 자본시장의 지표를 세운 최고의 애널리스트. DART 공시 실적과의 빈틈없는 정합성과 시장을 선도한 혜안은 2026년 대한민국 금융투자업계의 최고 귀감이 되었기에 종합 대상을 헌정합니다.`,
    fullReport: {
      executiveSummary: "불확실성의 파고 속에서 숫자의 정밀함으로 시장을 밝힌 나침반. 681명 전체 애널리스트 중 백분위 상위 0.1% 기록.",
      targetPriceTracking: "과거 1년간 발간한 34편의 커버리지 리포트 중 목표주가 평균 괴리율 -8.2% 내 선방하여 금감원 공시 기준 전 증권사 최우수 안착. 시장 급변기마다 72시간 이내 목표주가 현실화 리포트를 발간하여 목표가 도달률 76.5% 달성.",
      dartConsistency: "DART 전자공시 1Q/2Q 확정 영업이익과 사전 추정치의 오차율이 2.1%에 불과하여 32개 증권사 커버리지 애널리스트 중 실적 추정 정밀도 1위 기록.",
      timelinessDepth: "음식료 원재료 소맥·대두박 선물 가격의 실시간 스프레드 분석과 해상 운임 팩트를 독점 취합하여 업황 턴어라운드를 6주 선제 포착.",
      marketHealthContribution: "과열된 일부 테마주 섹터에 휩쓸리지 않고, 실적이 뒷받침되지 않는 종목에 대해 '보유(Hold)' 의견을 선제 개진하여 맹목적 매수 관행을 정면 돌파.",
      representativeReport: {
        title: "K-Food 글로벌 구조적 침투율과 원가 스프레드 역학 분석",
        date: "2026-04-12",
        keyThesis: "글로벌 유통 체인의 엔드유저 리오더링 주기 단축과 원자재 래깅 효과를 DART 분기 손익계산서와 결합하여 사상 최대 영업이익률 경로를 사전 증명."
      },
      h2OutlookAdvice: "2026년 하반기는 해외 현지 캐파(CAPEX) 완공에 따른 고정비 감가상각 개시와 환율 변동성이 핵심 변수이며, 단순 매출 성장이 아닌 공헌이익률(Contribution Margin) 유지를 핵심 관전 포인트로 삼아야 함.",
      citationText: "정량적 데이터의 완벽성과 금융시장을 선도한 독보적 통찰로 대한민국 리서치의 품격을 드높인 공로를 기려 2026 올해의 애널리스트 종합 대상을 수여합니다."
    }
  },
  {
    id: "winner_consumer_park",
    rank: 2,
    category: "소비재/유통/음식료 섹터 최우수 애널리스트 (1위)",
    isGrandPrize: false,
    name: "박상준",
    brokerName: "키움증권",
    sector: "소비재/유통/음식료",
    score: 95.82,
    isTarget24: true,
    isAwardExcluded: false,
    keyReports: [
      "K-Food 글로벌 구조적 침투율과 해외 법인 공헌이익률 분석 (2026.04)",
      "음식료 원가 래깅 효과 소멸과 판가 수혜의 스프레드 구조 (2026.02)"
    ],
    metrics: {
      targetPriceAccuracy: 74.2,
      dartAlignment: 96.8,
      activityTimeliness: 94.5,
      logicImpact: 95.1,
    },
    summaryKeywords: ["K-Food 글로벌 확장 선도", "원가-판가 스프레드 정밀 타격"],
    quantitativeQualitativeAnalysis: `박상준 연구원은 2026년 원자재 가격 안정화와 K-Food 글로벌 수출 급증 국면에서 삼양식품, 농심, 오리온의 해외 현지 채널 침투율과 수출액 통관 데이터를 실증 분석하여 목표가 적중률 74.2%(섹터 평균 43.8% 대비 압도적 우위)를 달성했습니다. 종합 대상(한유정)에 이은 소비재/유통 섹터 2위의 독보적 실적으로, 종합 대상 단독 분리 원칙에 따라 소비재/유통/음식료 섹터 1위 최우수 애널리스트로 공식 선정되었습니다.`,
    marketContributionInsight: `관행적인 내수 방어주 시각에서 탈피하여 북미 및 유럽 메인스트림 채널 입점률과 분기별 선적 통계를 결합 분석함으로써 K-Food 기업들의 밸류에이션 리레이팅을 시장에 선제 제시했습니다.`,
    honorCitation: `데이터의 빈틈없는 정합성과 산업 패러다임 변화를 꿰뚫는 통찰력으로 음식료/소비재 섹터의 새로운 지평을 열었기에 소비재/유통/음식료 부문 최우수 애널리스트 상을 헌정합니다.`,
    fullReport: {
      executiveSummary: "불확실한 글로벌 매크로 환경 속에서 K-Food의 수출 경로를 실증 데이터로 정밀 추적한 소비재 최고 분석관.",
      targetPriceTracking: "삼양식품, 농심 등 28편의 커버리지 리포트에서 해외 법인 실적과 수출 통관 데이터 교차검증을 통해 목표주가 적중률 74.2% 달성.",
      dartConsistency: "DART 전자공시 1Q/2Q 확정 영업이익과의 추정 오차율 2.4% 기록하여 전 증권사 음식료 커버리지 중 최상위 정합성 입증.",
      timelinessDepth: "소맥·유지류 글로벌 선물 가격 하향 안정화와 환율 효과를 선제 반영하여 이익 서프라이즈 시점을 2개월 앞서 포착.",
      marketHealthContribution: "과열된 테마성 외식주에 대한 무분별한 매수 추천을 지양하고, 실질 수출 현금흐름이 창출되는 종목군으로 시장의 건전한 투자 방향 유도.",
      representativeReport: {
        title: "K-Food 글로벌 구조적 침투율과 해외 법인 공헌이익률 분석",
        date: "2026-04-18",
        keyThesis: "미국 및 유럽 대형 유통 체인 입점률 확대와 원가 하향 안정화에 따른 해외 영업이익률 20% 상회 경로 입증."
      },
      h2OutlookAdvice: "하반기는 해외 현지 공장 증설에 따른 고정비 증가와 마케팅비 집행 추이를 모니터링하며 영업이익률 방어 여부를 핵심 지표로 점검해야 함.",
      citationText: "뛰어난 정량 분석과 산업 구조 변화를 포착한 탁월한 통찰력으로 소비재/음식료 리서치의 위상을 높였기에 본 상을 수여합니다."
    }
  },
  {
    id: "winner_semicon_kim",
    rank: 2,
    category: "반도체/IT/전자 섹터 최우수 애널리스트 (1위)",
    name: "김선우",
    brokerName: "메리츠증권",
    sector: "반도체/IT/전자",
    score: 92.97,
    keyReports: [
      "HBM4 아키텍처 전환과 커스텀 파운드리 수율 변곡점 (2026.03)",
      "메모리 사이클 3단계: 범용 D램 공급 제약과 B2B CAPEX 경로 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 72.4,
      dartAlignment: 92.4,
      activityTimeliness: 93.1,
      logicImpact: 92.6,
    },
    summaryKeywords: ["HBM 생태계 정밀 타격", "반도체 사이클의 냉철한 메스"],
    quantitativeQualitativeAnalysis: `AI 반도체 밸류체인의 기술적 전환기 속에서 HBM 패키징 수율과 공급사별 ASP를 DART 설비투자 공시와 교차 검증하여 목표가 적중률 72.4%(섹터 평균 52.1% 대비 최상위)를 기록했습니다. 분기 실적 컨센서스가 흔들릴 때마다 오차율 3.2% 미만의 정교한 실적 모델을 제시했습니다.`,
    marketContributionInsight: `시장 전반의 장밋빛 AI 환상에 매몰되지 않고, 범용 메모리 레거시 공정의 가동률 회복 지연 및 테크 마이그레이션 병목 현상을 가감 없이 경고하여 기관 투자자의 헤지 전략에 결정적 기여를 했습니다.`,
    honorCitation: `초미세 공정의 복잡한 퍼즐을 명쾌한 실적 데이터로 풀어낸 반도체 섹터의 나침반. 기술과 숫자를 결합한 입체적 분석력으로 시장의 신뢰를 확립하였기에 최우수 애널리스트 상을 헌정합니다.`,
    fullReport: {
      executiveSummary: "글로벌 테크 패권 경쟁 속에서 기술 격차와 DART 재무제표를 결합한 최고의 반도체 분석관.",
      targetPriceTracking: "HBM 가격 상승분과 레거시 D램 재고평가손익 환입 효과를 분리 산출하여 연간 목표주가 평균 괴리율 -9.5%로 선방(적중률 72.4%).",
      dartConsistency: "삼성전자 및 SK하이닉스의 분기 보고서 내 시설투자(CAPEX) 집행률 및 재고자산 회전율을 정확히 역산하여 실적 정합성 92.4% 기록.",
      timelinessDepth: "차세대 HBM4 16단 적층 전환에 따른 하이브리드 본딩 도입 시점을 글로벌 장비사 수주잔고 데이터로 3개월 앞서 적시 발간.",
      marketHealthContribution: "단순 테마성 중소형 부품주에 대해 무분별한 Buy 의견을 자제하고, 기술 진입장벽 유무에 따른 철저한 차별화 전략 권고.",
      representativeReport: {
        title: "HBM4 아키텍처 전환과 커스텀 파운드리 수율 변곡점",
        date: "2026-03-18",
        keyThesis: "메모리-파운드리 간 베이스 다이 협업 모델의 마진 구조를 정량화하여 2026년 하반기 실적 레버리지를 증명."
      },
      h2OutlookAdvice: "빅테크 CSP의 AI 인프라 투자 지속 여부와 추론용 ASIC 칩 다변화에 따른 메모리 탑재 용량 변화를 모니터링해야 함.",
      citationText: "치열한 반도체 전쟁 속에서 정확한 기술 로드맵과 실적 교차 검증으로 시장의 눈을 밝힌 공로를 기립니다."
    }
  },
  {
    id: "winner_battery_jeon",
    rank: 3,
    category: "2차전지/배터리/소재 섹터 최우수 애널리스트 (1위)",
    name: "전창현",
    brokerName: "대신증권",
    sector: "2차전지/배터리/소재",
    score: 92.30,
    isAwardExcluded: true,
    awardExclusionNote: "※ 본 증권사(대신증권)는 2026 어워즈 [평가 대상이나 시상 제외 5개사] 규정에 해당하여, 성과 지표(종합 92.30점/적중률 61.8%)는 공정하게 공개되나 공식 시상(트로피) 대상에서는 제외됩니다.",
    keyReports: [
      "캐즘(Chasm) 탈출의 조건: ESS 그리드 수요와 LFP 양산 원가 곡선 (2026.03)",
      "양극재 판가 스프레드 바닥 확인과 북미 AMPC 귀속 이익 (2026.06)"
    ],
    metrics: {
      targetPriceAccuracy: 61.8,
      dartAlignment: 93.1,
      activityTimeliness: 91.5,
      logicImpact: 92.7,
    },
    summaryKeywords: ["캐즘을 관통한 밸류에이션 정밀타격", "배터리 팩트 체크 수호자"],
    quantitativeQualitativeAnalysis: `전기차 캐즘 장기화 속에서도 리튬·니켈 메탈가와 연동된 판가 하락을 선제적으로 재무제표에 반영, 증권가 2차전지 평균 괴리율(-27.8%) 대비 현저히 우수한 -13.5%의 목표가 괴리율과 적중률 61.8%(섹터 평균 34.2%)를 달성하며 점수 92.30점을 획득했습니다.`,
    marketContributionInsight: `시장 과열기의 무조건적 반등 기대감을 배제하고, 미국 AMPC 보조금의 현금 유입 시차와 완성차 재고 소진 속도를 DART 연결재무제표로 낱낱이 해부하여 투자자들에게 현실적인 바닥 통과 시점을 제시했습니다.`,
    honorCitation: `감정이 지배하던 2차전지 시장에 냉철한 원가 스프레드와 공시 데이터의 잣대를 들이댄 용기 있는 연구자. 시장의 과열과 비관 속에서 균형 잡힌 시각을 견지한 공로로 본 상을 수여합니다.`,
    fullReport: {
      executiveSummary: "변동성의 소용돌이 속에서 오직 메탈 가격과 DART 연결공시 수치로 캐즘을 돌파한 정통파 애널리스트.",
      targetPriceTracking: "메탈 가격 래깅 타임(Lagging Time)을 수식화하여 분기별 ASP 궤적을 추적, 목표가 평균 괴리율 -13.5%로 방어.",
      dartConsistency: "배터리 3사 및 양극재 4사의 DART 공시 재고자산평가손실 규모를 사전 추정치와 93.1% 정합도로 일치시킴.",
      timelinessDepth: "미국 ESS 프로젝트 발주 급증과 그리드향 배터리 전환 흐름을 선제적으로 감지하여 연초 섹터 리밸런싱 근거 제공.",
      marketHealthContribution: "과거 관행화되었던 먼 미래(2030년) 실적을 무리하게 당겨온 밸류에이션 방식을 지양하고, 현금흐름할인(DCF) 엄격 적용.",
      representativeReport: {
        title: "캐즘(Chasm) 탈출의 조건: ESS 그리드 수요와 LFP 양산 원가 곡선",
        date: "2026-03-24",
        keyThesis: "전기차 수요 정체를 상쇄하는 전력망용 ESS 배터리 수주잔고와 DART 수주상황 공시의 상관관계를 최초로 모델화."
      },
      h2OutlookAdvice: "북미 인플레이션감축법(IRA) 규정 변경 여부와 유럽 배터리 여권제 시행에 따른 탄소발자국 인증 비용을 면밀히 관찰해야 함.",
      citationText: "혼돈의 배터리 시장에서 냉엄한 팩트와 정밀한 재무 분석으로 신뢰의 기준점을 세운 공로를 높이 평가합니다."
    }
  },
  {
    id: "winner_bio_lee",
    rank: 4,
    category: "바이오/제약/헬스케어 섹터 최우수 애널리스트 (1위)",
    name: "이안나",
    brokerName: "교보증권",
    sector: "바이오/제약/헬스케어",
    score: 85.67,
    keyReports: [
      "ADC 차세대 플랫폼의 임상 마일스톤과 기술수출 계약의 실질 가치 (2026.02)",
      "바이오시밀러 북미 PBM 등재 현황과 오리지널 대체율 추적 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 86.2,
      dartAlignment: 85.4,
      activityTimeliness: 85.9,
      logicImpact: 85.2,
    },
    summaryKeywords: ["임상 데이터의 냉철한 해독", "K-바이오 실질 가치 감별사"],
    quantitativeQualitativeAnalysis: `바이오 임상 파이프라인의 성공 확률(LoA)을 임상 단계별·적응증별로 정밀 계량화하여 목표주가를 도출했습니다. 계약금(Upfront)과 마일스톤의 실제 DART 수령 공시를 확인하여 매출 인식 오차를 최소화했습니다.`,
    marketContributionInsight: `단순 기술이전 총액(헤드라인 넘버)에 현혹되지 않고, 반환 불가 계약금 비율과 마일스톤 지급 조건을 분리 공시 기반으로 검증하여 바이오 버블을 예방하는 방파제 역할을 완수했습니다.`,
    honorCitation: `임상 파이프라인의 환상을 걷어내고 실제 현금흐름과 마일스톤의 엄정한 데이터로 바이오 신뢰를 구축한 연구자. 정밀한 과학적 분석과 금융 밸류에이션을 결합한 성과를 기려 본 상을 수여합니다.`,
    fullReport: {
      executiveSummary: "과학적 임상 데이터와 냉엄한 현금흐름 밸류에이션을 결합하여 K-바이오의 진정한 옥석을 가려낸 최고 권위자.",
      targetPriceTracking: "임상 1/2/3상 단계별 성공 확률을 반영한 rNPV(Risk-adjusted NPV) 모델로 목표주가 오차율 7.8% 달성.",
      dartConsistency: "DART 단일판매·공급계약 체결 공시의 분기별 회계상 안분 인식 기준을 완벽 분석하여 실적 정합도 85.4% 확보.",
      timelinessDepth: "ASCO 및 AACR 등 글로벌 암학회 발표 초록(Abstract)을 현장 분석하여 유효성 지표의 통계적 유의성을 즉각 평가.",
      marketHealthContribution: "과도한 기대감만으로 주가가 폭등하던 종목들의 전환사채(CB) 오버행 물량과 임상 지연 리스크를 선제적으로 경고.",
      representativeReport: {
        title: "ADC 차세대 플랫폼의 임상 마일스톤과 기술수출 계약의 실질 가치",
        date: "2026-02-19",
        keyThesis: "항체-약물 접합체(ADC) 페이로드 독성 관리 지표와 실제 글로벌 빅파마의 판권 계약금 구조를 전수 분해."
      },
      h2OutlookAdvice: "미국 생물보안법(Biosecure Act) 입법 추이와 글로벌 CDMO 공급망 내 국내 기업들의 수주 공시를 핵심 지표로 점검할 것.",
      citationText: "복잡한 바이오 과학을 투명한 금융 언어로 번역하고, 투자자 자산을 지켜낸 투철한 직업정신을 기립니다."
    }
  },
  {
    id: "winner_auto_kang",
    rank: 5,
    category: "자동차/모빌리티 섹터 최우수 애널리스트 (1위)",
    name: "강성진",
    brokerName: "KB증권",
    sector: "자동차/모빌리티",
    score: 87.91,
    keyReports: [
      "하이브리드(HEV) 믹스 개선에 따른 완성차 영업이익률 피크아웃 논쟁 종결 (2026.04)",
      "SDV 전환 비용과 완성차 자사주 매입·소각의 주주환원 수익률 (2026.06)"
    ],
    metrics: {
      targetPriceAccuracy: 68.2,
      dartAlignment: 89.2,
      activityTimeliness: 86.8,
      logicImpact: 87.1,
    },
    summaryKeywords: ["완성차 피크아웃 반박의 선구자", "주주환원 밸류업의 선봉장"],
    quantitativeQualitativeAnalysis: `글로벌 완성차의 피크아웃 우려 속에서도 HEV(하이브리드) 비중 확대에 따른 평균판매단가(ASP) 방어를 DART 분기 매출원가율로 증명, 목표주가 적중률 68.2%(섹터 평균 45.3% 대비 1위)와 점수 87.91점을 달성했습니다.`,
    marketContributionInsight: `단순 판매 대수 지표에 얽매이지 않고, 인센티브(판매장려금) 집행 추이와 완성차의 밸류업 프로그램(자사주 소각, 배당성향)을 종합 연계하여 국내 자동차 섹터의 재평가(Re-rating)를 주도했습니다.`,
    honorCitation: `글로벌 자동차 산업의 격변기 속에서 믹스 개선과 현금흐름의 본질을 짚어내며 시장의 편견을 뒤집은 모빌리티 분야 최고 권위자에게 최우수 애널리스트 상을 수여합니다.`,
    fullReport: {
      executiveSummary: "시장 컨센서스를 선도하는 하이브리드 고수익성 모델링과 주주환원율 계량 분석의 일인자.",
      targetPriceTracking: "북미/인도 시장 현지 생산 거점별 마진율을 반영하여 목표가 평균 괴리율을 -11.4%로 안정적 유지(적중률 68.2%).",
      dartConsistency: "현대차·기아의 DART 분기 실적 공시와 글로벌 리테일 재고 일수를 대조하여 실적 정합성 89.2% 기록.",
      timelinessDepth: "전기차 전환 지연 국면에서 하이브리드 파워트레인의 캐시카우 역할을 8개월 전부터 확신 있게 설파.",
      marketHealthContribution: "과거 트라우마에 갇힌 저PBR 할인율 적용 관행을 비판하고, 잉여현금흐름(FCF) 기반의 정밀 밸류에이션 제시.",
      representativeReport: {
        title: "하이브리드(HEV) 믹스 개선에 따른 완성차 영업이익률 피크아웃 논쟁 종결",
        date: "2026-04-08",
        keyThesis: "HEV의 옵션 채택률 상승과 북미 현지화 인센티브 절감 효과를 DART 손익 공시로 입증하여 피크아웃 공포를 불식."
      },
      h2OutlookAdvice: "미국 대선 이후 관세 정책 변화 가능성과 인도법인 상장(IPO) 이후 구주매출 대금의 자본 재배치 방안을 주시해야 함.",
      citationText: "시장 컨센서스를 흔들리지 않고 바로 세운 예리한 통찰력과 정교한 데이터 분석에 깊은 찬사를 보냅니다."
    }
  },
  {
    id: "winner_ship_lee",
    rank: 6,
    category: "조선/중공업/방산 섹터 최우수 애널리스트 (1위)",
    name: "이한결",
    brokerName: "다올투자증권",
    sector: "조선/중공업/방산",
    score: 84.84,
    keyReports: [
      "LNG선 슬롯 프리미엄과 고선가 선박 건조 마진 실현 주기 (2026.01)",
      "K-방산 유럽·중동 현지화 파트너십과 수주잔고 납기 스케줄 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 73.1,
      dartAlignment: 84.9,
      activityTimeliness: 84.6,
      logicImpact: 84.6,
    },
    summaryKeywords: ["슈퍼사이클 도크의 정밀 항해사", "K-방산 수출잔고 해부학"],
    quantitativeQualitativeAnalysis: `조선소 도크(Dock)별 고선가 선박 건조 믹스를 DART 분기보고서 공사손실충당금 환입 내역과 매칭하여 실적 턴어라운드를 정확히 예측, 적중률 73.1%(섹터 평균 54.8%)와 84.84점의 뛰어난 평가를 받았습니다.`,
    marketContributionInsight: `방산 수주잔고의 실제 납기(Delivery) 스케줄과 수출입은행 금융지원 조건을 면밀히 분석하여, 단순 MOU와 본계약의 차이를 명확히 구분하는 등 시장의 신뢰성 제고에 크게 기여했습니다.`,
    honorCitation: `오랜 침체를 딛고 일어선 조선·방산 슈퍼사이클의 긴 호흡을 도크의 현장 데이터와 공시로 입증한 탁월한 연구자에게 이 상을 수여합니다.`,
    fullReport: {
      executiveSummary: "조선소 건조 스케줄과 방산 납품 마일스톤을 공시로 정밀 추적한 중공업 섹터의 표준.",
      targetPriceTracking: "클락슨 신조선가지수와 도크 슬롯 잔여기간을 결합한 3개년 선가 모델로 적중률 73.1%, 목표주가 평균 괴리율 -9.8% 달성.",
      dartConsistency: "DART 공시 내 '수주상황' 항목의 납품 기한과 계약 금액 변경 공시를 철저히 추적하여 실적 오차 최소화.",
      timelinessDepth: "후판 가격 하향 안정화와 인력 수급 개선 시점을 야드 현장 팩트체크로 적시 분석.",
      marketHealthContribution: "과열된 루머성 방산 수출 기사에 대해 계약 조건의 마진율을 검증하며 냉정한 투자 기준 제시.",
      representativeReport: {
        title: "LNG선 슬롯 프리미엄과 고선가 선박 건조 마진 실현 주기",
        date: "2026-01-22",
        keyThesis: "2023년 수주한 고선가 친환경 선박의 본격 매출화 구간 진입에 따른 영업이익률 두 자릿수 안착 경로 규명."
      },
      h2OutlookAdvice: "미국 해군 MRO(유지·보수·정비) 사업 수주 가시성과 특수선 수주 마진율을 향후 모멘텀의 핵심으로 점검할 것.",
      citationText: "거친 파도 속에서 도크의 진실을 캐내어 투자자에게 안정적인 나침반을 제공한 공로를 치하합니다."
    }
  },
  {
    id: "winner_platform_lee",
    rank: 7,
    category: "플랫폼/게임/엔터 섹터 최우수 애널리스트 (1위)",
    name: "이선화",
    brokerName: "KB증권",
    sector: "플랫폼/게임/엔터",
    score: 96.51,
    keyReports: [
      "AI 검색 도입에 따른 플랫폼 체류시간과 커머스 수수료 개편 효과 (2026.03)",
      "글로벌 음원 스트리밍 정산율 인상과 글로벌 팬덤 ARPU 분해 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 64.5,
      dartAlignment: 96.1,
      activityTimeliness: 96.4,
      logicImpact: 96.3,
    },
    summaryKeywords: ["AI 에이전트 전환기 통찰", "팬덤 이코노미 데이터 분석의 마스터"],
    quantitativeQualitativeAnalysis: `플랫폼 포털의 AI 검색 융합에 따른 광고 전환율과 글로벌 엔터 팬덤 ARPU(가입자당 평균매출)를 완벽히 계량화하여 적중률 64.5%(섹터 평균 39.4% 대비 1위), 전체 2위에 해당하는 96.51점의 높은 종합 점수를 획득했습니다.`,
    marketContributionInsight: `엔터테인먼트 산업의 단순 앨범 판매량 하락 공포를 글로벌 음원 스트리밍 매출 및 투어 MD 마진의 구조적 성장으로 반박하여 기관 투자자의 저가 매수 결단을 견인했습니다.`,
    honorCitation: `무형자산과 트래픽이라는 까다로운 플랫폼 지표를 명확한 숫자로 실체화하고, 콘텐츠 산업의 글로벌 가치를 증명한 선도적 분석가에게 최우수상을 수여합니다.`,
    fullReport: {
      executiveSummary: "디지털 전환과 K-컬처 글로벌 확장의 핵심 지표를 가장 날카롭게 포착한 독보적 플랫폼 연구원.",
      targetPriceTracking: "글로벌 빅테크 멀티플과 비교한 엄격한 SOTP(사업별 합산 밸류에이션)로 목표가 적중률 64.5%, 평균 괴리율 -12.1% 달성.",
      dartConsistency: "DART 분기보고서 상 무형자산 상각비 및 외주용역비 증감 추이를 정확히 산출하여 96.1%의 실적 정합성 기록.",
      timelinessDepth: "생성형 AI 검색 엔진 탑재에 따른 광고 단가(CPC/CPM) 회복 시점을 선제 보고서로 적시 제시.",
      marketHealthContribution: "게임 신작 흥행 기대감에 기댄 막연한 매수를 경계하고 라이브 서비스 잔존율 지표를 중시하는 평가 기준 확립.",
      representativeReport: {
        title: "AI 검색 도입에 따른 플랫폼 체류시간과 커머스 수수료 개편 효과",
        date: "2026-03-14",
        keyThesis: "네이버·카카오의 로컬 데이터베이스와 AI 요약 검색 간 시너지를 DART 광고 사업부문 매출 추정과 결합."
      },
      h2OutlookAdvice: "미국 법인 상장 및 현지 웹툰·음원 IP의 2차 판권 라이선싱 매출 확대를 주시해야 함.",
      citationText: "플랫폼 혁신과 K-엔터테인먼트의 역동성을 정교한 데이터로 꿰뚫어본 눈부신 업적을 기립니다."
    }
  },
  {
    id: "winner_finance_kim",
    rank: 8,
    category: "금융/지주 섹터 최우수 애널리스트 (1위)",
    name: "김인",
    brokerName: "유진투자증권",
    sector: "금융/지주",
    score: 96.29,
    keyReports: [
      "보통주자본비율(CET1) 관리 목표와 은행 지주 총주주환원율 40% 도달 경로 (2026.02)",
      "PF 부실채권 정리 완료와 대손충당금 환입에 따른 밸류업 스프레드 (2026.04)"
    ],
    metrics: {
      targetPriceAccuracy: 71.8,
      dartAlignment: 96.5,
      activityTimeliness: 95.8,
      logicImpact: 96.1,
    },
    summaryKeywords: ["밸류업 프로그램의 설계자", "CET1 비율과 주주환원의 나침반"],
    quantitativeQualitativeAnalysis: `금융지주의 핵심 자본적정성 지표인 보통주자본(CET1) 비율과 대손비용률(CCR)을 DART 분기 경영공시와 오차 없이 결합 분석하여 목표주가 적중률 71.8%(섹터 평균 48.7%), 종합 96.29점(섹터 1위, 전체 3위)을 기록했습니다.`,
    marketContributionInsight: `정부 밸류업 가이드라인 발표 이전부터 자사주 매입·소각을 통한 주당순자산(BPS) 증대 경로를 역설, 은행주의 만년 저평가(Korea Discount) 해소를 실증적으로 입증했습니다.`,
    honorCitation: `대한민국 금융주의 자본 정책과 주주환원의 새 장을 연 밸류업 분석의 최고봉. 금융지주의 건전성과 주주가치를 완벽히 조화시킨 혜안에 경의를 표하며 최우수 애널리스트 상을 수여합니다.`,
    fullReport: {
      executiveSummary: "금융지주 자본비율 규제와 주주환원 모델링에서 타의 추종을 불허하는 금융 섹터의 살아있는 전설.",
      targetPriceTracking: "배당수익률과 자사주 소각률을 결합한 총주주환원율 모델로 연간 목표주가 적중도 71.8%, 평균 괴리율 -10.3% 달성.",
      dartConsistency: "DART 경영공시 내 위험가중자산(RWA) 증가율과 순이자마진(NIM) 추이를 96.5%의 정밀도로 예측.",
      timelinessDepth: "부동산 PF 관련 추가 충당금 적립 사이클의 정점을 선제 파악하여 은행주 실적 서프라이즈를 선제 제시.",
      marketHealthContribution: "단순 배당성향에 치중하던 시장 관행을 벗어나, 자본비율 버퍼에 기반한 자사주 소각의 강력한 주당가치 제고 효과 설파.",
      representativeReport: {
        title: "보통주자본비율(CET1) 관리 목표와 은행 지주 총주주환원율 40% 도달 경로",
        date: "2026-02-27",
        keyThesis: "CET1 비율 13% 초과 자본의 전액 주주환원 룰을 시뮬레이션하여 2026년 주주환원 총액 10조원 시대 도래를 증명."
      },
      h2OutlookAdvice: "기준금리 인하 국면에서의 마진 방어 전략과 비이자이익(수수료 및 유가증권 운용손익) 체력을 핵심 변수로 확인해야 함.",
      citationText: "한국 금융시장의 질적 도약을 이끈 밸류업 분석의 선구자로서 금융투자의 품격을 높인 공로를 기립니다."
    }
  },
  {
    id: "winner_chemical_lee",
    rank: 9,
    category: "화학/철강/소재 섹터 최우수 애널리스트 (1위)",
    name: "이용욱",
    brokerName: "IBK투자증권",
    sector: "화학/철강/소재",
    score: 90.03,
    isAwardExcluded: true,
    awardExclusionNote: "※ 본 증권사(IBK투자증권)는 2026 어워즈 [평가 대상이나 시상 제외 5개사] 규정에 해당하여, 성과 지표(종합 90.03점/적중률 58.4%)는 공정하게 공개되나 공식 시상(트로피) 대상에서는 제외됩니다.",
    keyReports: [
      "중국 증설 피크와 나프타 분해설비(NCC) 구조조정 마진 회복 시나리오 (2026.03)",
      "글로벌 인프라 투자와 탄소국경조정제도(CBAM) 철강 마진 스프레드 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 58.4,
      dartAlignment: 90.4,
      activityTimeliness: 89.9,
      logicImpact: 90.0,
    },
    summaryKeywords: ["사이클 최저점의 나침반", "스프레드 팩트체크의 승부사"],
    quantitativeQualitativeAnalysis: `중국발 증설 압박으로 침체된 화학·철강 섹터에서 에틸렌-나프타 스프레드 및 열연-철광석 롤마진을 DART 제품별 매출액 공시와 철저히 대조하여 섹터 평균 괴리율(-28.9%) 대비 뛰어난 -14.2% 괴리율과 적중률 58.4%(섹터 평균 32.5% 대비 1위)로 90.03점을 달성했습니다.`,
    marketContributionInsight: `시장 일각의 조기 턴어라운드 낙관론을 경계하고, 범용 플라스틱 대신 스페셜티(고부가가치 소재) 비중 확대 기업만을 선별 추천함으로써 투자자 손실을 철저히 방어했습니다.`,
    honorCitation: `업황의 깊은 겨울 속에서도 글로벌 수급 지표와 스프레드의 엄정한 계산으로 봄을 준비하는 기업을 찾아낸 통찰력에 이 상을 수여합니다.`,
    fullReport: {
      executiveSummary: "글로벌 원자재 공급 과잉 속에서 냉정한 스프레드 분석으로 스페셜티 옥석을 가려낸 최고 소재 분석가.",
      targetPriceTracking: "제품별 현물 스프레드의 래깅 반영 주기를 공식화하여 목표가 평균 괴리율 -14.2%로 선방(적중률 58.4%).",
      dartConsistency: "DART 공시 내 품목별 가동률 및 재고평가손익 추정을 90.4%의 정합도로 구현.",
      timelinessDepth: "중국 석유화학 설비 폐쇄 정책 및 동남아 수요 회복세를 발 빠르게 추적.",
      marketHealthContribution: "과거 PBR 바닥론에 기댄 묻지마 매수를 비판하고, 구조조정 완결성 중심의 엄격한 선별 기준 제시.",
      representativeReport: {
        title: "중국 증설 피크와 나프타 분해설비(NCC) 구조조정 마진 회복 시나리오",
        date: "2026-03-30",
        keyThesis: "한계 NCC 설비의 통폐합 일정과 친환경·고기능성 엔지니어링 플라스틱의 마진 스프레드를 연결 공시로 실증."
      },
      h2OutlookAdvice: "중국 경기 부양책의 실질 수요 견인 강도와 유럽 탄소국경조정제도(CBAM) 전환 비용 부담률을 추적할 것.",
      citationText: "어려운 시황 속에서도 데이터의 진실을 놓치지 않고 바른길을 안내한 헌신을 높이 평가합니다."
    }
  },
  {
    id: "winner_construction_kim",
    rank: 10,
    category: "건설/물류/기타 섹터 최우수 애널리스트 (1위)",
    name: "김인",
    brokerName: "현대차증권",
    sector: "건설/물류/기타",
    score: 79.86,
    keyReports: [
      "PF 우발채무 잔존 리스크와 준공 후 미분양 사업장의 원가율 해소 (2026.04)",
      "원전·플랜트 해외 수주와 데이터센터 물류 인프라 신성장 믹스 (2026.06)"
    ],
    metrics: {
      targetPriceAccuracy: 62.5,
      dartAlignment: 79.9,
      activityTimeliness: 79.5,
      logicImpact: 79.8,
    },
    summaryKeywords: ["원가율 정상화의 파수꾼", "해외 플랜트·물류 턴어라운드"],
    quantitativeQualitativeAnalysis: `고금리와 원자재 가격 상승으로 얼어붙은 건설 섹터에서 미착공 PF 우발채무와 주택 도급 사업장의 예정원가율 조정을 DART 주석 공시로 낱낱이 파헤쳐 섹터 평균 괴리율(-31.4%) 대비 -15.8% 괴리율과 적중률 62.5%(섹터 평균 30.1% 대비 1위)로 79.86점을 기록했습니다.`,
    marketContributionInsight: `부실 PF 사업장 정리 국면에서 무리한 저가 매수를 차단하고, 체코 원전 및 중동 플랜트 등 해외 수주 잔고가 탄탄한 우량 건설사와 물류 인프라 기업으로 시장의 포트폴리오를 전환시켰습니다.`,
    honorCitation: `건설 부동산 시장의 격변기 속에서 DART 재무제표 주석 뒤에 숨겨진 PF 우발채무의 실체를 밝히고 건전한 투자를 견인한 공로로 최우수 애널리스트 상을 헌정합니다.`,
    fullReport: {
      executiveSummary: "건설업계 재무 건전성 리스크를 공시 주석 단위로 팩트체크하여 시장의 신뢰를 지켜낸 최고의 건설 분석가.",
      targetPriceTracking: "공사원가율 현실화와 충당금 선반영 효과를 감안한 보수적 밸류에이션으로 적중률 62.5%, 목표가 평균 괴리율 -15.8% 달성.",
      dartConsistency: "DART 공시 내 '우발채무 및 약정사항' 주석의 신용보강 규모를 철저히 정량화.",
      timelinessDepth: "주요 정비사업장 공사비 증액 협상 타결 여부와 해외 대형 수주 파이프라인의 진행률을 기민하게 포착.",
      marketHealthContribution: "국내 주택 착공 감소 리스크를 가감 없이 보고서에 담아 건설주 리스크 관리에 결정적 역할 수행.",
      representativeReport: {
        title: "PF 우발채무 잔존 리스크와 준공 후 미분양 사업장의 원가율 해소",
        date: "2026-04-18",
        keyThesis: "주요 대형 건설사 10곳의 DART 분기보고서 주석을 전수 대조하여 실질 현금흐름 훼손 위험이 없는 옥석을 판별."
      },
      h2OutlookAdvice: "공공 발주 물량의 확대 여부와 해외 원전·신재생 플랜트 EPC(설계·조달·시공) 마진율 회복 추세를 확인해야 함.",
      citationText: "어려운 건설 환경 속에서도 원칙을 지키며 객관적인 위험 신호를 시장에 전달한 용기에 찬사를 보냅니다."
    }
  }
];

// 동점자 처리 기준 5대 원칙 (공식 확정 규정 - 가중 평균 오차율 평가 모델)
export const TIE_BREAKER_POLICY = {
  title: "2026 올해의 애널리스트 어워즈 동점자 처리 및 순위 결정 기준",
  subtitle: "평가 점수 동점 발생 시 100% 결정론적 AI 심사 5단계 판정 알고리즘",
  rules: [
    {
      priority: 1,
      name: "1. 목표주가 정확성 (가중치 30%)",
      description: "종합 점수가 소수점 둘째 자리까지 동일할 경우, 1~9월 제시한 목표주가와 실제 주가의 괴리율 절댓값이 0에 더 가까운(정확도가 높은) 애널리스트를 우선 선정합니다."
    },
    {
      priority: 2,
      name: "2. 실적 추정 정확성 (가중치 40% - 최고 가중치)",
      description: "1순위가 동일한 경우, 1Q(20%), 2Q(30%), 3Q(50%) × 영업이익(60%), 매출액(20%), 순이익(20%)의 '가중 평균 오차율'이 더 낮은(추정 정합도가 높은) 애널리스트를 우선합니다."
    },
    {
      priority: 3,
      name: "3. 투자 논리의 타당성 (가중치 10%)",
      description: "2순위가 동일한 경우, 리포트 내 팩트 기반 데이터 뎁스(Depth) 및 핵심 투자 포인트 논증 점수가 높은 연구원을 우선합니다."
    },
    {
      priority: 4,
      name: "4. 위험 요소 분석 적절성 (가중치 10%)",
      description: "3순위가 동일한 경우, 종목의 다운사이드 리스크 및 역발상 위험 경고(Contrarian Score) 점수가 높은 연구원을 우선합니다."
    },
    {
      priority: 5,
      name: "5. 리포트 발간 빈도 (5%) 및 SNS 주목도·언론 빈도 (5%)",
      description: "모든 항목이 동일할 경우, 정규 리서치 발간 편수와 시장 의사결정 파급력(SNS 및 언론 노출 빈도)이 높은 연구원을 최종 우선합니다."
    }
  ]
};

export interface SectorRankedAnalyst {
  sectorRank: number;
  name: string;
  brokerName: string;
  sector: string;
  totalScore: number;
  metrics: {
    targetPriceAccuracy: number;  // 목표주가 정확성 (30%)
    dartAlignment: number;        // 실적 추정 정확성 (40%)
    weightedErrorRatePct: string; // 가중 평균 오차율 (예: "2.40%")
    logicScore: number;           // 투자 논리 타당성 (10%)
    riskScore: number;            // 위험 요소 분석 (10%)
    reportCount: number;          // 발간 편수 (5%)
    snsAndMediaScore: number;     // SNS 및 언론 빈도 (5%)
  };
  isSectorChampion: boolean;
  isGrandPrize?: boolean;
  isAwardExcluded: boolean;
  keyReportTitle: string;
  comment: string;
}

// 10대 표준 산업 섹터별 TOP 10 공식 명단 (총 100명 + 대상 1명 한유정 단독 분리)
export const OFFICIAL_SECTOR_TOP10: Record<string, SectorRankedAnalyst[]> = {
  "소비재/유통/음식료": [
    {
      sectorRank: 1,
      name: "박상준",
      brokerName: "키움증권",
      sector: "소비재/유통/음식료",
      totalScore: 95.82,
      metrics: { targetPriceAccuracy: 74.2, dartAlignment: 97.6, weightedErrorRatePct: "2.40%", logicScore: 95.1, riskScore: 94.5, reportCount: 32, snsAndMediaScore: 93.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "K-Food 글로벌 구조적 침투율과 해외 법인 공헌이익률 분석",
      comment: "종합 대상(한유정) 단독 분리에 따라 소비재/유통/음식료 부문 섹터 1위 최우수 챔피언 공식 승계"
    },
    {
      sectorRank: 2,
      name: "이경신",
      brokerName: "iM증권",
      sector: "소비재/유통/음식료",
      totalScore: 93.10,
      metrics: { targetPriceAccuracy: 71.5, dartAlignment: 96.2, weightedErrorRatePct: "3.80%", logicScore: 93.5, riskScore: 92.0, reportCount: 26, snsAndMediaScore: 91.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "음식료 소재 투입가 안정화와 편의점·대형마트 판관비 효율화",
      comment: "소비재/유통 섹터 2위 (시상 제외 5개사 규정 적용)"
    },
    {
      sectorRank: 3,
      name: "조상훈",
      brokerName: "신한투자증권",
      sector: "소비재/유통/음식료",
      totalScore: 92.40,
      metrics: { targetPriceAccuracy: 69.8, dartAlignment: 95.8, weightedErrorRatePct: "4.20%", logicScore: 92.0, riskScore: 91.5, reportCount: 28, snsAndMediaScore: 90.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "K-베이커리 글로벌 수출 확대와 식자재 유통 밸류체인",
      comment: "소비재/유통 섹터 3위 (공식 시상 대상 24개사)"
    },
    {
      sectorRank: 4,
      name: "김명주",
      brokerName: "한국투자증권",
      sector: "소비재/유통/음식료",
      totalScore: 91.80,
      metrics: { targetPriceAccuracy: 68.4, dartAlignment: 95.4, weightedErrorRatePct: "4.60%", logicScore: 91.0, riskScore: 90.5, reportCount: 24, snsAndMediaScore: 89.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "면세점 내외국인 트래픽 회복과 뷰티 인디 브랜드 수출",
      comment: "소비재/유통 섹터 4위 (시상 제외 5개사 규정 적용)"
    },
    {
      sectorRank: 5,
      name: "남성현",
      brokerName: "IBK투자증권",
      sector: "소비재/유통/음식료",
      totalScore: 90.90,
      metrics: { targetPriceAccuracy: 66.5, dartAlignment: 94.8, weightedErrorRatePct: "5.20%", logicScore: 90.5, riskScore: 89.0, reportCount: 22, snsAndMediaScore: 88.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "백화점 명품 MD 리뉴얼과 e커머스 멤버십 수익성 분석",
      comment: "소비재/유통 섹터 5위 (시상 제외 5개사 규정 적용)"
    },
    {
      sectorRank: 6,
      name: "하희지",
      brokerName: "현대차증권",
      sector: "소비재/유통/음식료",
      totalScore: 90.20,
      metrics: { targetPriceAccuracy: 65.2, dartAlignment: 94.2, weightedErrorRatePct: "5.80%", logicScore: 89.5, riskScore: 88.5, reportCount: 25, snsAndMediaScore: 87.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "가공식품 B2B 급식 채널 마진율과 소스류 북미 통관 데이터",
      comment: "소비재/유통 섹터 6위 (공식 시상 대상 24개사)"
    },
    {
      sectorRank: 7,
      name: "박은정",
      brokerName: "하나증권",
      sector: "소비재/유통/음식료",
      totalScore: 89.60,
      metrics: { targetPriceAccuracy: 64.0, dartAlignment: 93.8, weightedErrorRatePct: "6.20%", logicScore: 88.5, riskScore: 88.0, reportCount: 29, snsAndMediaScore: 87.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "K-뷰티 미국 아마존 매출 순위와 ODM/OEM 캐파 증설",
      comment: "소비재/유통 섹터 7위 (공식 시상 대상 24개사)"
    },
    {
      sectorRank: 8,
      name: "이지은",
      brokerName: "대신증권",
      sector: "소비재/유통/음식료",
      totalScore: 88.90,
      metrics: { targetPriceAccuracy: 63.1, dartAlignment: 93.2, weightedErrorRatePct: "6.80%", logicScore: 88.0, riskScore: 87.0, reportCount: 20, snsAndMediaScore: 86.5 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "대형마트 새벽배송 물류센터 손익분기점(BEP) 경로 분석",
      comment: "소비재/유통 섹터 8위 (시상 제외 5개사 규정 적용)"
    },
    {
      sectorRank: 9,
      name: "오린아",
      brokerName: "LS증권",
      sector: "소비재/유통/음식료",
      totalScore: 88.30,
      metrics: { targetPriceAccuracy: 62.0, dartAlignment: 92.7, weightedErrorRatePct: "7.30%", logicScore: 87.0, riskScore: 86.5, reportCount: 19, snsAndMediaScore: 86.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "유통 플랫폼 버티컬 커머스 수수료 개편과 풀필먼트 수율",
      comment: "소비재/유통 섹터 9위 (공식 시상 대상 24개사)"
    },
    {
      sectorRank: 10,
      name: "주영훈",
      brokerName: "유진투자증권",
      sector: "소비재/유통/음식료",
      totalScore: 87.80,
      metrics: { targetPriceAccuracy: 61.2, dartAlignment: 92.1, weightedErrorRatePct: "7.90%", logicScore: 86.5, riskScore: 86.0, reportCount: 21, snsAndMediaScore: 85.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "소비 양극화 속 가성비 PB 상품 점유율 확대와 이익 체력",
      comment: "소비재/유통 섹터 10위 (공식 시상 대상 24개사)"
    }
  ],
  "반도체/IT/전자": [
    {
      sectorRank: 1,
      name: "김선우",
      brokerName: "메리츠증권",
      sector: "반도체/IT/전자",
      totalScore: 92.97,
      metrics: { targetPriceAccuracy: 72.4, dartAlignment: 96.8, weightedErrorRatePct: "3.20%", logicScore: 92.6, riskScore: 92.0, reportCount: 34, snsAndMediaScore: 93.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "HBM4 아키텍처 전환과 커스텀 파운드리 수율 변곡점",
      comment: "반도체/IT/전자 섹터 1위 최우수 챔피언"
    },
    {
      sectorRank: 2,
      name: "이승우",
      brokerName: "유진투자증권",
      sector: "반도체/IT/전자",
      totalScore: 92.15,
      metrics: { targetPriceAccuracy: 70.8, dartAlignment: 96.2, weightedErrorRatePct: "3.80%", logicScore: 92.0, riskScore: 91.5, reportCount: 30, snsAndMediaScore: 92.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "범용 메모리 재고 소진과 온디바이스 AI 칩 탑재율",
      comment: "반도체/IT/전자 섹터 2위"
    },
    {
      sectorRank: 3,
      name: "노근창",
      brokerName: "현대차증권",
      sector: "반도체/IT/전자",
      totalScore: 91.40,
      metrics: { targetPriceAccuracy: 69.5, dartAlignment: 95.6, weightedErrorRatePct: "4.40%", logicScore: 91.0, riskScore: 90.8, reportCount: 28, snsAndMediaScore: 91.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "AI 가속기 서버 투자 사이클과 실리콘 카바이드(SiC) 전력 반도체",
      comment: "반도체/IT/전자 섹터 3위"
    },
    {
      sectorRank: 4,
      name: "박유악",
      brokerName: "키움증권",
      sector: "반도체/IT/전자",
      totalScore: 90.85,
      metrics: { targetPriceAccuracy: 68.1, dartAlignment: 95.1, weightedErrorRatePct: "4.90%", logicScore: 90.5, riskScore: 90.0, reportCount: 31, snsAndMediaScore: 90.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "1c 나노 D램 양산 로드맵과 극자외선(EUV) 펠리클 수율",
      comment: "반도체/IT/전자 섹터 4위"
    },
    {
      sectorRank: 5,
      name: "김동원",
      brokerName: "KB증권",
      sector: "반도체/IT/전자",
      totalScore: 90.20,
      metrics: { targetPriceAccuracy: 67.2, dartAlignment: 94.6, weightedErrorRatePct: "5.40%", logicScore: 90.0, riskScore: 89.5, reportCount: 33, snsAndMediaScore: 91.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "글로벌 테크 CSP의 커스텀 ASIC 개발 동향과 HBM 공급망",
      comment: "반도체/IT/전자 섹터 5위"
    },
    {
      sectorRank: 6,
      name: "정원석",
      brokerName: "하이투자증권",
      sector: "반도체/IT/전자",
      totalScore: 89.50,
      metrics: { targetPriceAccuracy: 66.0, dartAlignment: 94.0, weightedErrorRatePct: "6.00%", logicScore: 89.0, riskScore: 88.5, reportCount: 25, snsAndMediaScore: 89.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "디스플레이 OLED IT 패널 채택률과 구동 IC 수급 현황",
      comment: "반도체/IT/전자 섹터 6위"
    },
    {
      sectorRank: 7,
      name: "백길현",
      brokerName: "유안타증권",
      sector: "반도체/IT/전자",
      totalScore: 88.90,
      metrics: { targetPriceAccuracy: 65.1, dartAlignment: 93.5, weightedErrorRatePct: "6.50%", logicScore: 88.5, riskScore: 88.0, reportCount: 24, snsAndMediaScore: 88.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "후공정 OSAT 어드밴스드 패키징 CAPEX 투자 회수 사이클",
      comment: "반도체/IT/전자 섹터 7위"
    },
    {
      sectorRank: 8,
      name: "이수빈",
      brokerName: "대신증권",
      sector: "반도체/IT/전자",
      totalScore: 88.30,
      metrics: { targetPriceAccuracy: 64.0, dartAlignment: 93.0, weightedErrorRatePct: "7.00%", logicScore: 88.0, riskScore: 87.5, reportCount: 22, snsAndMediaScore: 88.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "글로벌 파운드리 2나노 게이트올어라운드(GAA) 공정 비교",
      comment: "반도체/IT/전자 섹터 8위 (시상 제외 5개사)"
    },
    {
      sectorRank: 9,
      name: "채민숙",
      brokerName: "한국투자증권",
      sector: "반도체/IT/전자",
      totalScore: 87.70,
      metrics: { targetPriceAccuracy: 63.2, dartAlignment: 92.4, weightedErrorRatePct: "7.60%", logicScore: 87.0, riskScore: 86.8, reportCount: 27, snsAndMediaScore: 87.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "반도체 전공정 장비사 수주잔고와 웨이퍼 팹 가동률",
      comment: "반도체/IT/전자 섹터 9위 (시상 제외 5개사)"
    },
    {
      sectorRank: 10,
      name: "고영민",
      brokerName: "다올투자증권",
      sector: "반도체/IT/전자",
      totalScore: 87.20,
      metrics: { targetPriceAccuracy: 62.4, dartAlignment: 91.9, weightedErrorRatePct: "8.10%", logicScore: 86.5, riskScore: 86.0, reportCount: 23, snsAndMediaScore: 86.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "유리기판(Glass Substrate) 상용화 일정과 소부장 수혜주",
      comment: "반도체/IT/전자 섹터 10위"
    }
  ],
  "2차전지/배터리/소재": [
    {
      sectorRank: 1,
      name: "전창현",
      brokerName: "대신증권",
      sector: "2차전지/배터리/소재",
      totalScore: 92.30,
      metrics: { targetPriceAccuracy: 61.8, dartAlignment: 96.4, weightedErrorRatePct: "3.60%", logicScore: 92.7, riskScore: 92.5, reportCount: 30, snsAndMediaScore: 92.0 },
      isSectorChampion: true,
      isAwardExcluded: true,
      keyReportTitle: "캐즘(Chasm) 탈출의 조건: ESS 그리드 수요와 LFP 양산 원가 곡선",
      comment: "2차전지 섹터 1위 (시상 제외 5개사 규정 적용 / 평가 1위 유지)"
    },
    {
      sectorRank: 2,
      name: "주민우",
      brokerName: "NH투자증권",
      sector: "2차전지/배터리/소재",
      totalScore: 91.60,
      metrics: { targetPriceAccuracy: 60.5, dartAlignment: 95.8, weightedErrorRatePct: "4.20%", logicScore: 92.0, riskScore: 91.5, reportCount: 28, snsAndMediaScore: 91.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "미국 인플레이션감축법(IRA) 보조금 현금흐름과 완성차 재고 소진",
      comment: "2차전지 섹터 2위 (공식 시상 대상 24개사 최우수)"
    },
    {
      sectorRank: 3,
      name: "정원석",
      brokerName: "iM증권",
      sector: "2차전지/배터리/소재",
      totalScore: 90.80,
      metrics: { targetPriceAccuracy: 59.4, dartAlignment: 95.2, weightedErrorRatePct: "4.80%", logicScore: 91.0, riskScore: 90.5, reportCount: 25, snsAndMediaScore: 90.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "양극재 판가 스프레드 바닥 확인과 북미 AMPC 귀속 이익",
      comment: "2차전지 섹터 3위 (시상 제외 5개사)"
    },
    {
      sectorRank: 4,
      name: "이용욱",
      brokerName: "한화투자증권",
      sector: "2차전지/배터리/소재",
      totalScore: 90.10,
      metrics: { targetPriceAccuracy: 58.7, dartAlignment: 94.6, weightedErrorRatePct: "5.40%", logicScore: 90.5, riskScore: 90.0, reportCount: 26, snsAndMediaScore: 89.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "리튬·니켈 메탈 선물가 안정화에 따른 재고평가손익 환입",
      comment: "2차전지 섹터 4위"
    },
    {
      sectorRank: 5,
      name: "이안나",
      brokerName: "유진투자증권",
      sector: "2차전지/배터리/소재",
      totalScore: 89.40,
      metrics: { targetPriceAccuracy: 57.8, dartAlignment: 94.0, weightedErrorRatePct: "6.00%", logicScore: 90.0, riskScore: 89.2, reportCount: 24, snsAndMediaScore: 89.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "차세대 전고체 배터리 파일럿 라인과 황화물계 고체전해질",
      comment: "2차전지 섹터 5위"
    },
    {
      sectorRank: 6,
      name: "김현수",
      brokerName: "하나증권",
      sector: "2차전지/배터리/소재",
      totalScore: 88.70,
      metrics: { targetPriceAccuracy: 56.9, dartAlignment: 93.5, weightedErrorRatePct: "6.50%", logicScore: 89.0, riskScore: 88.5, reportCount: 27, snsAndMediaScore: 88.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "배터리 3사 수주잔고와 유럽 탄소발자국 인증 대응 비용",
      comment: "2차전지 섹터 6위"
    },
    {
      sectorRank: 7,
      name: "권준수",
      brokerName: "키움증권",
      sector: "2차전지/배터리/소재",
      totalScore: 88.10,
      metrics: { targetPriceAccuracy: 56.0, dartAlignment: 93.0, weightedErrorRatePct: "7.00%", logicScore: 88.5, riskScore: 88.0, reportCount: 23, snsAndMediaScore: 88.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "음극재 실리콘 첨가제 상용화와 CNT 도전재 채택률",
      comment: "2차전지 섹터 7위"
    },
    {
      sectorRank: 8,
      name: "박진수",
      brokerName: "신영증권",
      sector: "2차전지/배터리/소재",
      totalScore: 87.50,
      metrics: { targetPriceAccuracy: 55.2, dartAlignment: 92.4, weightedErrorRatePct: "7.60%", logicScore: 88.0, riskScore: 87.2, reportCount: 21, snsAndMediaScore: 87.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "분리막 코팅 기술 다변화와 원통형 4680 폼팩터 양산",
      comment: "2차전지 섹터 8위"
    },
    {
      sectorRank: 9,
      name: "윤혁진",
      brokerName: "SK증권",
      sector: "2차전지/배터리/소재",
      totalScore: 86.90,
      metrics: { targetPriceAccuracy: 54.5, dartAlignment: 91.9, weightedErrorRatePct: "8.10%", logicScore: 87.0, riskScore: 86.8, reportCount: 22, snsAndMediaScore: 87.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "동박 전력비 부담 완화와 말레이시아 현지 공장 가동률",
      comment: "2차전지 섹터 9위"
    },
    {
      sectorRank: 10,
      name: "이창민",
      brokerName: "KB증권",
      sector: "2차전지/배터리/소재",
      totalScore: 86.40,
      metrics: { targetPriceAccuracy: 53.8, dartAlignment: 91.4, weightedErrorRatePct: "8.60%", logicScore: 86.5, riskScore: 86.0, reportCount: 20, snsAndMediaScore: 86.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "배터리 리사이클링 폐배터리 블랙매스 회수율과 경제성",
      comment: "2차전지 섹터 10위"
    }
  ],
  "바이오/제약/헬스케어": [
    {
      sectorRank: 1,
      name: "이안나",
      brokerName: "교보증권",
      sector: "바이오/제약/헬스케어",
      totalScore: 85.67,
      metrics: { targetPriceAccuracy: 86.2, dartAlignment: 94.8, weightedErrorRatePct: "5.20%", logicScore: 85.2, riskScore: 85.0, reportCount: 25, snsAndMediaScore: 88.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "ADC 차세대 플랫폼의 임상 마일스톤과 기술수출 계약의 실질 가치",
      comment: "바이오/제약/헬스케어 섹터 1위 최우수 챔피언"
    },
    {
      sectorRank: 2,
      name: "허혜민",
      brokerName: "키움증권",
      sector: "바이오/제약/헬스케어",
      totalScore: 85.10,
      metrics: { targetPriceAccuracy: 85.0, dartAlignment: 94.2, weightedErrorRatePct: "5.80%", logicScore: 84.8, riskScore: 84.5, reportCount: 28, snsAndMediaScore: 87.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "글로벌 비만치료제(GLP-1) 파이프라인과 국내 개발사 L/O 가능성",
      comment: "바이오/제약 섹터 2위"
    },
    {
      sectorRank: 3,
      name: "박재경",
      brokerName: "하나증권",
      sector: "바이오/제약/헬스케어",
      totalScore: 84.60,
      metrics: { targetPriceAccuracy: 84.1, dartAlignment: 93.8, weightedErrorRatePct: "6.20%", logicScore: 84.2, riskScore: 84.0, reportCount: 26, snsAndMediaScore: 87.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "미국 생물보안법(Biosecure Act) 입법 수혜와 국내 CDMO 수주",
      comment: "바이오/제약 섹터 3위"
    },
    {
      sectorRank: 4,
      name: "김승민",
      brokerName: "미래에셋증권",
      sector: "바이오/제약/헬스케어",
      totalScore: 84.10,
      metrics: { targetPriceAccuracy: 83.2, dartAlignment: 93.3, weightedErrorRatePct: "6.70%", logicScore: 83.8, riskScore: 83.5, reportCount: 24, snsAndMediaScore: 86.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "바이오시밀러 미국 PBM 등재 현황과 자가면역질환 처방 점유율",
      comment: "바이오/제약 섹터 4위"
    },
    {
      sectorRank: 5,
      name: "권해순",
      brokerName: "유진투자증권",
      sector: "바이오/제약/헬스케어",
      totalScore: 83.50,
      metrics: { targetPriceAccuracy: 82.5, dartAlignment: 92.8, weightedErrorRatePct: "7.20%", logicScore: 83.2, riskScore: 83.0, reportCount: 22, snsAndMediaScore: 86.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "알츠하이머 치료제 항체 의약품 뇌혈관장벽(BBB) 통과율",
      comment: "바이오/제약 섹터 5위"
    },
    {
      sectorRank: 6,
      name: "이선경",
      brokerName: "SK증권",
      sector: "바이오/제약/헬스케어",
      totalScore: 83.00,
      metrics: { targetPriceAccuracy: 81.8, dartAlignment: 92.3, weightedErrorRatePct: "7.70%", logicScore: 82.5, riskScore: 82.5, reportCount: 23, snsAndMediaScore: 85.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "세포·유전자 치료제(CGT) 위탁개발생산 공정 마진 구조",
      comment: "바이오/제약 섹터 6위"
    },
    {
      sectorRank: 7,
      name: "위해주",
      brokerName: "한국투자증권",
      sector: "바이오/제약/헬스케어",
      totalScore: 82.40,
      metrics: { targetPriceAccuracy: 81.0, dartAlignment: 91.8, weightedErrorRatePct: "8.20%", logicScore: 82.0, riskScore: 82.0, reportCount: 21, snsAndMediaScore: 85.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "국내 전통 제약사 ETC 신약 개량신약 처방액 및 R&D 비중",
      comment: "바이오/제약 섹터 7위 (시상 제외 5개사)"
    },
    {
      sectorRank: 8,
      name: "정유경",
      brokerName: "신영증권",
      sector: "바이오/제약/헬스케어",
      totalScore: 81.90,
      metrics: { targetPriceAccuracy: 80.2, dartAlignment: 91.2, weightedErrorRatePct: "8.80%", logicScore: 81.5, riskScore: 81.5, reportCount: 20, snsAndMediaScore: 84.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "에스테틱 미용 의료기기 및 톡신 북미·남미 수출 통관",
      comment: "바이오/제약 섹터 8위"
    },
    {
      sectorRank: 9,
      name: "장민환",
      brokerName: "LS증권",
      sector: "바이오/제약/헬스케어",
      totalScore: 81.30,
      metrics: { targetPriceAccuracy: 79.5, dartAlignment: 90.7, weightedErrorRatePct: "9.30%", logicScore: 81.0, riskScore: 81.0, reportCount: 19, snsAndMediaScore: 84.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "연속혈당측정기(CGM) 글로벌 침투율과 건강보험 급여화",
      comment: "바이오/제약 섹터 9위"
    },
    {
      sectorRank: 10,
      name: "하태기",
      brokerName: "상상인증권",
      sector: "바이오/제약/헬스케어",
      totalScore: 80.80,
      metrics: { targetPriceAccuracy: 78.8, dartAlignment: 90.1, weightedErrorRatePct: "9.90%", logicScore: 80.5, riskScore: 80.2, reportCount: 18, snsAndMediaScore: 83.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "원료의약품(API) 글로벌 다변화와 국산 신약의 로열티 현금흐름",
      comment: "바이오/제약 섹터 10위"
    }
  ],
  "자동차/모빌리티": [
    {
      sectorRank: 1,
      name: "강성진",
      brokerName: "KB증권",
      sector: "자동차/모빌리티",
      totalScore: 87.91,
      metrics: { targetPriceAccuracy: 68.2, dartAlignment: 95.4, weightedErrorRatePct: "4.60%", logicScore: 87.1, riskScore: 87.0, reportCount: 31, snsAndMediaScore: 89.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "하이브리드(HEV) 믹스 개선에 따른 완성차 영업이익률 피크아웃 논쟁 종결",
      comment: "자동차/모빌리티 섹터 1위 최우수 챔피언"
    },
    {
      sectorRank: 2,
      name: "임은영",
      brokerName: "삼성증권",
      sector: "자동차/모빌리티",
      totalScore: 87.20,
      metrics: { targetPriceAccuracy: 67.5, dartAlignment: 94.8, weightedErrorRatePct: "5.20%", logicScore: 86.5, riskScore: 86.5, reportCount: 29, snsAndMediaScore: 88.5 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "인도법인 상장(IPO)과 신흥국 현지화 공장 캐파 레버리지",
      comment: "자동차/모빌리티 섹터 2위 (시상 제외 5개사)"
    },
    {
      sectorRank: 3,
      name: "김평모",
      brokerName: "DB금융투자",
      sector: "자동차/모빌리티",
      totalScore: 86.70,
      metrics: { targetPriceAccuracy: 66.8, dartAlignment: 94.2, weightedErrorRatePct: "5.80%", logicScore: 86.0, riskScore: 86.0, reportCount: 27, snsAndMediaScore: 88.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "완성차 총주주환원율(자사주 소각+배당) 35% 달성 시나리오",
      comment: "자동차/모빌리티 섹터 3위"
    },
    {
      sectorRank: 4,
      name: "조희승",
      brokerName: "iM증권",
      sector: "자동차/모빌리티",
      totalScore: 86.10,
      metrics: { targetPriceAccuracy: 66.0, dartAlignment: 93.7, weightedErrorRatePct: "6.30%", logicScore: 85.5, riskScore: 85.2, reportCount: 24, snsAndMediaScore: 87.5 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "미국 대선 관세 리스크와 조지아 전기차 메타플랜트(HMGMA) 가동",
      comment: "자동차/모빌리티 섹터 4위 (시상 제외 5개사)"
    },
    {
      sectorRank: 5,
      name: "이병근",
      brokerName: "흥국증권",
      sector: "자동차/모빌리티",
      totalScore: 85.50,
      metrics: { targetPriceAccuracy: 65.2, dartAlignment: 93.1, weightedErrorRatePct: "6.90%", logicScore: 85.0, riskScore: 84.8, reportCount: 22, snsAndMediaScore: 87.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "자동차 1차 부품사 전장화 부품 믹스 개선과 마진 스프레드",
      comment: "자동차/모빌리티 섹터 5위"
    },
    {
      sectorRank: 6,
      name: "신윤철",
      brokerName: "키움증권",
      sector: "자동차/모빌리티",
      totalScore: 85.00,
      metrics: { targetPriceAccuracy: 64.5, dartAlignment: 92.6, weightedErrorRatePct: "7.40%", logicScore: 84.5, riskScore: 84.0, reportCount: 25, snsAndMediaScore: 86.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "SDV 전환에 따른 차량용 OS 개발비 상각과 OTA 구독 모델",
      comment: "자동차/모빌리티 섹터 6위"
    },
    {
      sectorRank: 7,
      name: "유지웅",
      brokerName: "다올투자증권",
      sector: "자동차/모빌리티",
      totalScore: 84.40,
      metrics: { targetPriceAccuracy: 63.8, dartAlignment: 92.0, weightedErrorRatePct: "8.00%", logicScore: 84.0, riskScore: 83.5, reportCount: 23, snsAndMediaScore: 86.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "유럽 배출가스 유로7 규제 대응과 하이브리드 파워트레인",
      comment: "자동차/모빌리티 섹터 7위"
    },
    {
      sectorRank: 8,
      name: "문용권",
      brokerName: "신영증권",
      sector: "자동차/모빌리티",
      totalScore: 83.90,
      metrics: { targetPriceAccuracy: 63.0, dartAlignment: 91.5, weightedErrorRatePct: "8.50%", logicScore: 83.5, riskScore: 83.0, reportCount: 21, snsAndMediaScore: 85.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "타이어 원자재 고무 가격 안정화와 전기차 전용 타이어 ASP",
      comment: "자동차/모빌리티 섹터 8위"
    },
    {
      sectorRank: 9,
      name: "남주신",
      brokerName: "교보증권",
      sector: "자동차/모빌리티",
      totalScore: 83.30,
      metrics: { targetPriceAccuracy: 62.3, dartAlignment: 91.0, weightedErrorRatePct: "9.00%", logicScore: 83.0, riskScore: 82.5, reportCount: 20, snsAndMediaScore: 85.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "글로벌 물류비 하향 안정화에 따른 완성차 수출 해상운임 절감",
      comment: "자동차/모빌리티 섹터 9위"
    },
    {
      sectorRank: 10,
      name: "김진석",
      brokerName: "미래에셋증권",
      sector: "자동차/모빌리티",
      totalScore: 82.80,
      metrics: { targetPriceAccuracy: 61.5, dartAlignment: 90.4, weightedErrorRatePct: "9.60%", logicScore: 82.5, riskScore: 82.0, reportCount: 19, snsAndMediaScore: 84.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "로보택시 및 자율주행 라이다 센서 채택률과 상용화 일정",
      comment: "자동차/모빌리티 섹터 10위"
    }
  ],
  "조선/중공업/방산": [
    {
      sectorRank: 1,
      name: "이한결",
      brokerName: "다올투자증권",
      sector: "조선/중공업/방산",
      totalScore: 84.84,
      metrics: { targetPriceAccuracy: 73.1, dartAlignment: 94.5, weightedErrorRatePct: "5.50%", logicScore: 84.6, riskScore: 84.5, reportCount: 28, snsAndMediaScore: 88.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "LNG선 슬롯 프리미엄과 고선가 선박 건조 마진 실현 주기",
      comment: "조선/중공업/방산 섹터 1위 최우수 챔피언"
    },
    {
      sectorRank: 2,
      name: "변용진",
      brokerName: "하이투자증권",
      sector: "조선/중공업/방산",
      totalScore: 84.30,
      metrics: { targetPriceAccuracy: 72.2, dartAlignment: 94.0, weightedErrorRatePct: "6.00%", logicScore: 84.0, riskScore: 84.0, reportCount: 26, snsAndMediaScore: 87.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "K-방산 유럽 폴란드·루마니아 수주잔고와 납기 마일스톤",
      comment: "조선/중공업/방산 섹터 2위"
    },
    {
      sectorRank: 3,
      name: "정동익",
      brokerName: "KB증권",
      sector: "조선/중공업/방산",
      totalScore: 83.80,
      metrics: { targetPriceAccuracy: 71.5, dartAlignment: 93.5, weightedErrorRatePct: "6.50%", logicScore: 83.5, riskScore: 83.5, reportCount: 27, snsAndMediaScore: 87.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "미국 해군 MRO 사업 진출과 함정 특수선 수출 가치 평가",
      comment: "조선/중공업/방산 섹터 3위"
    },
    {
      sectorRank: 4,
      name: "양승윤",
      brokerName: "유진투자증권",
      sector: "조선/중공업/방산",
      totalScore: 83.20,
      metrics: { targetPriceAccuracy: 70.8, dartAlignment: 93.0, weightedErrorRatePct: "7.00%", logicScore: 83.0, riskScore: 83.0, reportCount: 24, snsAndMediaScore: 86.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "전력 인프라 변압기 쇼티지와 미국 노후 전력망 교체 사이클",
      comment: "조선/중공업/방산 섹터 4위"
    },
    {
      sectorRank: 5,
      name: "위경재",
      brokerName: "하나증권",
      sector: "조선/중공업/방산",
      totalScore: 82.70,
      metrics: { targetPriceAccuracy: 70.0, dartAlignment: 92.5, weightedErrorRatePct: "7.50%", logicScore: 82.5, riskScore: 82.2, reportCount: 23, snsAndMediaScore: 86.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "가스선(LPG/암모니아) 추진선 신조 발주와 친환경 엔진",
      comment: "조선/중공업/방산 섹터 5위"
    },
    {
      sectorRank: 6,
      name: "배성조",
      brokerName: "한화투자증권",
      sector: "조선/중공업/방산",
      totalScore: 82.10,
      metrics: { targetPriceAccuracy: 69.2, dartAlignment: 92.0, weightedErrorRatePct: "8.00%", logicScore: 82.0, riskScore: 81.8, reportCount: 25, snsAndMediaScore: 85.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "우주항공 발사체 및 위성 데이터 서비스 신사업 밸류에이션",
      comment: "조선/중공업/방산 섹터 6위"
    },
    {
      sectorRank: 7,
      name: "이동헌",
      brokerName: "신한투자증권",
      sector: "조선/중공업/방산",
      totalScore: 81.60,
      metrics: { targetPriceAccuracy: 68.5, dartAlignment: 91.5, weightedErrorRatePct: "8.50%", logicScore: 81.5, riskScore: 81.2, reportCount: 22, snsAndMediaScore: 85.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "공작기계 스마트 팩토리 로봇 자동화 라인 수주 추이",
      comment: "조선/중공업/방산 섹터 7위"
    },
    {
      sectorRank: 8,
      name: "엄경아",
      brokerName: "신영증권",
      sector: "조선/중공업/방산",
      totalScore: 81.10,
      metrics: { targetPriceAccuracy: 67.8, dartAlignment: 91.0, weightedErrorRatePct: "9.00%", logicScore: 81.0, riskScore: 80.8, reportCount: 21, snsAndMediaScore: 84.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "클락슨 신조선가지수(NPI) 상승세와 도크 슬롯 희소성",
      comment: "조선/중공업/방산 섹터 8위"
    },
    {
      sectorRank: 9,
      name: "최진명",
      brokerName: "교보증권",
      sector: "조선/중공업/방산",
      totalScore: 80.60,
      metrics: { targetPriceAccuracy: 67.0, dartAlignment: 90.4, weightedErrorRatePct: "9.60%", logicScore: 80.5, riskScore: 80.2, reportCount: 19, snsAndMediaScore: 84.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "유도무기 및 방공체계 중동 수출 계약의 금융지원 구조",
      comment: "조선/중공업/방산 섹터 9위"
    },
    {
      sectorRank: 10,
      name: "곽민정",
      brokerName: "현대차증권",
      sector: "조선/중공업/방산",
      totalScore: 80.10,
      metrics: { targetPriceAccuracy: 66.2, dartAlignment: 89.9, weightedErrorRatePct: "10.10%", logicScore: 80.0, riskScore: 79.8, reportCount: 20, snsAndMediaScore: 83.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "원자력 발전 주기기(SMR) 해외 수출 잔고와 제작 마진",
      comment: "조선/중공업/방산 섹터 10위"
    }
  ],
  "플랫폼/게임/엔터": [
    {
      sectorRank: 1,
      name: "이선화",
      brokerName: "KB증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 96.51,
      metrics: { targetPriceAccuracy: 64.5, dartAlignment: 97.2, weightedErrorRatePct: "2.80%", logicScore: 96.3, riskScore: 95.8, reportCount: 32, snsAndMediaScore: 94.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "AI 검색 도입에 따른 플랫폼 체류시간과 커머스 수수료 개편 효과",
      comment: "플랫폼/게임/엔터 섹터 1위 최우수 챔피언"
    },
    {
      sectorRank: 2,
      name: "이기훈",
      brokerName: "하나증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 95.80,
      metrics: { targetPriceAccuracy: 63.8, dartAlignment: 96.5, weightedErrorRatePct: "3.50%", logicScore: 95.5, riskScore: 95.0, reportCount: 30, snsAndMediaScore: 93.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "K-POP 글로벌 음원 스트리밍 정산율 인상과 글로벌 팬덤 ARPU",
      comment: "플랫폼/게임/엔터 섹터 2위"
    },
    {
      sectorRank: 3,
      name: "안도영",
      brokerName: "한국투자증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 95.10,
      metrics: { targetPriceAccuracy: 63.0, dartAlignment: 96.0, weightedErrorRatePct: "4.00%", logicScore: 95.0, riskScore: 94.5, reportCount: 28, snsAndMediaScore: 93.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "엔터 4사 콘서트 투어 MD 마진율과 위버스 커머스 수익성",
      comment: "플랫폼/게임/엔터 섹터 3위 (시상 제외 5개사)"
    },
    {
      sectorRank: 4,
      name: "김소혜",
      brokerName: "한화투자증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 94.40,
      metrics: { targetPriceAccuracy: 62.2, dartAlignment: 95.4, weightedErrorRatePct: "4.60%", logicScore: 94.2, riskScore: 94.0, reportCount: 26, snsAndMediaScore: 92.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "포털 AI 브리핑 탑재에 따른 검색광고 CPC 반등 효과",
      comment: "플랫폼/게임/엔터 섹터 4위"
    },
    {
      sectorRank: 5,
      name: "정의훈",
      brokerName: "유진투자증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 93.80,
      metrics: { targetPriceAccuracy: 61.5, dartAlignment: 94.8, weightedErrorRatePct: "5.20%", logicScore: 93.5, riskScore: 93.2, reportCount: 25, snsAndMediaScore: 92.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "웹툰 미국 법인 상장 이후 IP 영상화 2차 판권 라이선싱",
      comment: "플랫폼/게임/엔터 섹터 5위"
    },
    {
      sectorRank: 6,
      name: "김하정",
      brokerName: "다올투자증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 93.10,
      metrics: { targetPriceAccuracy: 60.8, dartAlignment: 94.2, weightedErrorRatePct: "5.80%", logicScore: 93.0, riskScore: 92.5, reportCount: 27, snsAndMediaScore: 91.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "모바일 게임 라이브 서비스 잔존율과 PC/콘솔 신작 파이프라인",
      comment: "플랫폼/게임/엔터 섹터 6위"
    },
    {
      sectorRank: 7,
      name: "임희석",
      brokerName: "미래에셋증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 92.50,
      metrics: { targetPriceAccuracy: 60.0, dartAlignment: 93.6, weightedErrorRatePct: "6.40%", logicScore: 92.2, riskScore: 91.8, reportCount: 24, snsAndMediaScore: 91.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "숏폼 숏드라마 플랫폼 결제액 추이와 해외 현지화 수익 모델",
      comment: "플랫폼/게임/엔터 섹터 7위"
    },
    {
      sectorRank: 8,
      name: "정호윤",
      brokerName: "한국투자증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 91.90,
      metrics: { targetPriceAccuracy: 59.2, dartAlignment: 93.0, weightedErrorRatePct: "7.00%", logicScore: 91.5, riskScore: 91.2, reportCount: 23, snsAndMediaScore: 90.5 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "클라우드 서비스(MSP) 수익성 전환과 AI B2B 솔루션 매출",
      comment: "플랫폼/게임/엔터 섹터 8위 (시상 제외 5개사)"
    },
    {
      sectorRank: 9,
      name: "오동환",
      brokerName: "삼성증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 91.30,
      metrics: { targetPriceAccuracy: 58.5, dartAlignment: 92.4, weightedErrorRatePct: "7.60%", logicScore: 91.0, riskScore: 90.5, reportCount: 22, snsAndMediaScore: 90.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "게임 신작 출시 지연 리스크와 개발 인건비 통제 효과",
      comment: "플랫폼/게임/엔터 섹터 9위 (시상 제외 5개사)"
    },
    {
      sectorRank: 10,
      name: "이효진",
      brokerName: "메리츠증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 90.70,
      metrics: { targetPriceAccuracy: 57.8, dartAlignment: 91.8, weightedErrorRatePct: "8.20%", logicScore: 90.2, riskScore: 89.8, reportCount: 21, snsAndMediaScore: 89.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "미디어 드라마 제작사 외주제작비 마진과 넷플릭스 리쿱율",
      comment: "플랫폼/게임/엔터 섹터 10위"
    }
  ],
  "금융/지주": [
    {
      sectorRank: 1,
      name: "김인",
      brokerName: "유진투자증권",
      sector: "금융/지주",
      totalScore: 96.29,
      metrics: { targetPriceAccuracy: 71.8, dartAlignment: 97.5, weightedErrorRatePct: "2.50%", logicScore: 96.1, riskScore: 95.8, reportCount: 31, snsAndMediaScore: 93.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "보통주자본비율(CET1) 관리 목표와 은행 지주 총주주환원율 40% 도달 경로",
      comment: "금융/지주 섹터 1위 최우수 챔피언"
    },
    {
      sectorRank: 2,
      name: "정준섭",
      brokerName: "NH투자증권",
      sector: "금융/지주",
      totalScore: 95.60,
      metrics: { targetPriceAccuracy: 71.0, dartAlignment: 96.8, weightedErrorRatePct: "3.20%", logicScore: 95.4, riskScore: 95.0, reportCount: 29, snsAndMediaScore: 92.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "보험업계 IFRS17 신계약 CSM(보험계약마진) 성장률과 해약환급금",
      comment: "금융/지주 섹터 2위"
    },
    {
      sectorRank: 3,
      name: "백두산",
      brokerName: "한국투자증권",
      sector: "금융/지주",
      totalScore: 95.00,
      metrics: { targetPriceAccuracy: 70.2, dartAlignment: 96.2, weightedErrorRatePct: "3.80%", logicScore: 94.8, riskScore: 94.2, reportCount: 28, snsAndMediaScore: 92.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "증권사 브로커리지 수수료율 회복과 해외주식 예탁자산 수익",
      comment: "금융/지주 섹터 3위 (시상 제외 5개사)"
    },
    {
      sectorRank: 4,
      name: "박혜진",
      brokerName: "대신증권",
      sector: "금융/지주",
      totalScore: 94.30,
      metrics: { targetPriceAccuracy: 69.5, dartAlignment: 95.6, weightedErrorRatePct: "4.40%", logicScore: 94.0, riskScore: 93.5, reportCount: 26, snsAndMediaScore: 91.5 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "부동산 PF 추가 대손충당금 적립 사이클의 종료와 CCR 안정화",
      comment: "금융/지주 섹터 4위 (시상 제외 5개사)"
    },
    {
      sectorRank: 5,
      name: "조아해",
      brokerName: "메리츠증권",
      sector: "금융/지주",
      totalScore: 93.70,
      metrics: { targetPriceAccuracy: 68.8, dartAlignment: 95.0, weightedErrorRatePct: "5.00%", logicScore: 93.5, riskScore: 93.0, reportCount: 27, snsAndMediaScore: 91.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "기준금리 인하 국면 은행 순이자마진(NIM) 방어 전략 분석",
      comment: "금융/지주 섹터 5위"
    },
    {
      sectorRank: 6,
      name: "설용진",
      brokerName: "SK증권",
      sector: "금융/지주",
      totalScore: 93.10,
      metrics: { targetPriceAccuracy: 68.0, dartAlignment: 94.4, weightedErrorRatePct: "5.60%", logicScore: 92.8, riskScore: 92.2, reportCount: 25, snsAndMediaScore: 90.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "생명·손해보험사 K-ICS(지급여력비율) 규제와 배당 여력",
      comment: "금융/지주 섹터 6위"
    },
    {
      sectorRank: 7,
      name: "김도하",
      brokerName: "한화투자증권",
      sector: "금융/지주",
      totalScore: 92.50,
      metrics: { targetPriceAccuracy: 67.2, dartAlignment: 93.8, weightedErrorRatePct: "6.20%", logicScore: 92.0, riskScore: 91.5, reportCount: 24, snsAndMediaScore: 90.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "비은행 계열사(카드·캐피탈) 조달비용 안정화와 조달 스프레드",
      comment: "금융/지주 섹터 7위"
    },
    {
      sectorRank: 8,
      name: "은경완",
      brokerName: "신한투자증권",
      sector: "금융/지주",
      totalScore: 91.90,
      metrics: { targetPriceAccuracy: 66.5, dartAlignment: 93.2, weightedErrorRatePct: "6.80%", logicScore: 91.4, riskScore: 91.0, reportCount: 23, snsAndMediaScore: 89.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "지주회사 브랜드 로열티 수취 구조와 자사주 소각 실질 효과",
      comment: "금융/지주 섹터 8위"
    },
    {
      sectorRank: 9,
      name: "강승건",
      brokerName: "KB증권",
      sector: "금융/지주",
      totalScore: 91.30,
      metrics: { targetPriceAccuracy: 65.8, dartAlignment: 92.6, weightedErrorRatePct: "7.40%", logicScore: 90.8, riskScore: 90.2, reportCount: 22, snsAndMediaScore: 89.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "금융지주 밸류업 공시 이행 현황과 분기 균등배당 정책",
      comment: "금융/지주 섹터 9위"
    },
    {
      sectorRank: 10,
      name: "우도형",
      brokerName: "IBK투자증권",
      sector: "금융/지주",
      totalScore: 90.70,
      metrics: { targetPriceAccuracy: 65.0, dartAlignment: 92.0, weightedErrorRatePct: "8.00%", logicScore: 90.0, riskScore: 89.5, reportCount: 21, snsAndMediaScore: 88.5 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "지방금융지주 지역 중소기업 대출 연체율 관리와 충당금 버퍼",
      comment: "금융/지주 섹터 10위 (시상 제외 5개사)"
    }
  ],
  "화학/철강/소재": [
    {
      sectorRank: 1,
      name: "이용욱",
      brokerName: "IBK투자증권",
      sector: "화학/철강/소재",
      totalScore: 90.03,
      metrics: { targetPriceAccuracy: 58.4, dartAlignment: 95.9, weightedErrorRatePct: "4.10%", logicScore: 90.0, riskScore: 89.8, reportCount: 28, snsAndMediaScore: 90.0 },
      isSectorChampion: true,
      isAwardExcluded: true,
      keyReportTitle: "중국 증설 피크와 나프타 분해설비(NCC) 구조조정 마진 회복 시나리오",
      comment: "화학/철강 섹터 1위 (시상 제외 5개사 규정 적용 / 평가 1위 유지)"
    },
    {
      sectorRank: 2,
      name: "박광래",
      brokerName: "신한투자증권",
      sector: "화학/철강/소재",
      totalScore: 89.50,
      metrics: { targetPriceAccuracy: 57.6, dartAlignment: 95.2, weightedErrorRatePct: "4.80%", logicScore: 89.5, riskScore: 89.2, reportCount: 26, snsAndMediaScore: 89.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "글로벌 탄소국경조정제도(CBAM) 철강 마진 스프레드와 전기로 전환",
      comment: "화학/철강 섹터 2위 (공식 시상 대상 24개사 최우수)"
    },
    {
      sectorRank: 3,
      name: "윤재성",
      brokerName: "하나증권",
      sector: "화학/철강/소재",
      totalScore: 88.90,
      metrics: { targetPriceAccuracy: 56.8, dartAlignment: 94.6, weightedErrorRatePct: "5.40%", logicScore: 89.0, riskScore: 88.5, reportCount: 27, snsAndMediaScore: 89.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "정유사 정제마진(복합마진) 바닥 통과와 항공유 수요 회복",
      comment: "화학/철강 섹터 3위"
    },
    {
      sectorRank: 4,
      name: "이동욱",
      brokerName: "IBK투자증권",
      sector: "화학/철강/소재",
      totalScore: 88.30,
      metrics: { targetPriceAccuracy: 56.0, dartAlignment: 94.0, weightedErrorRatePct: "6.00%", logicScore: 88.2, riskScore: 88.0, reportCount: 25, snsAndMediaScore: 88.5 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "스페셜티 고기능성 합성고무 및 친환경 바이오 플라스틱 마진",
      comment: "화학/철강 섹터 4위 (시상 제외 5개사)"
    },
    {
      sectorRank: 5,
      name: "이진명",
      brokerName: "신한투자증권",
      sector: "화학/철강/소재",
      totalScore: 87.70,
      metrics: { targetPriceAccuracy: 55.2, dartAlignment: 93.4, weightedErrorRatePct: "6.60%", logicScore: 87.6, riskScore: 87.2, reportCount: 24, snsAndMediaScore: 88.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "중국 부동산 부양책에 따른 열연·철근 유통가격 반등 강도",
      comment: "화학/철강 섹터 5위"
    },
    {
      sectorRank: 6,
      name: "백영찬",
      brokerName: "상상인증권",
      sector: "화학/철강/소재",
      totalScore: 87.10,
      metrics: { targetPriceAccuracy: 54.5, dartAlignment: 92.8, weightedErrorRatePct: "7.20%", logicScore: 87.0, riskScore: 86.8, reportCount: 23, snsAndMediaScore: 87.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "에틸렌-나프타 스프레드 손익분기점(BEP) 250달러 돌파 시기",
      comment: "화학/철강 섹터 6위"
    },
    {
      sectorRank: 7,
      name: "박현욱",
      brokerName: "현대차증권",
      sector: "화학/철강/소재",
      totalScore: 86.50,
      metrics: { targetPriceAccuracy: 53.8, dartAlignment: 92.2, weightedErrorRatePct: "7.80%", logicScore: 86.5, riskScore: 86.2, reportCount: 22, snsAndMediaScore: 87.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "후판 가격 조선사 공급 단가 협상 결과와 자동차용 강판 ASP",
      comment: "화학/철강 섹터 7위"
    },
    {
      sectorRank: 8,
      name: "이유진",
      brokerName: "유진투자증권",
      sector: "화학/철강/소재",
      totalScore: 85.90,
      metrics: { targetPriceAccuracy: 53.0, dartAlignment: 91.6, weightedErrorRatePct: "8.40%", logicScore: 86.0, riskScore: 85.5, reportCount: 21, snsAndMediaScore: 86.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "비철금속(구리·알루미늄) LME 재고량과 AI 데이터센터 구리 수요",
      comment: "화학/철강 섹터 8위"
    },
    {
      sectorRank: 9,
      name: "이현욱",
      brokerName: "IBK투자증권",
      sector: "화학/철강/소재",
      totalScore: 85.30,
      metrics: { targetPriceAccuracy: 52.2, dartAlignment: 91.0, weightedErrorRatePct: "9.00%", logicScore: 85.5, riskScore: 85.0, reportCount: 20, snsAndMediaScore: 86.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "태양광 폴리실리콘 공급 과잉과 페로브스카이트 탠덤 셀 효율",
      comment: "화학/철강 섹터 9위 (시상 제외 5개사)"
    },
    {
      sectorRank: 10,
      name: "전우제",
      brokerName: "KB증권",
      sector: "화학/철강/소재",
      totalScore: 84.70,
      metrics: { targetPriceAccuracy: 51.5, dartAlignment: 90.4, weightedErrorRatePct: "9.60%", logicScore: 85.0, riskScore: 84.5, reportCount: 19, snsAndMediaScore: 85.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "탄소 포집·활용(CCU) 블루수소 전환 비용과 탄소배출권 가격",
      comment: "화학/철강 섹터 10위"
    }
  ],
  "건설/물류/기타": [
    {
      sectorRank: 1,
      name: "김인",
      brokerName: "현대차증권",
      sector: "건설/물류/기타",
      totalScore: 83.15,
      metrics: { targetPriceAccuracy: 62.5, dartAlignment: 93.8, weightedErrorRatePct: "6.20%", logicScore: 79.8, riskScore: 79.5, reportCount: 26, snsAndMediaScore: 86.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "PF 우발채무 잔존 리스크와 준공 후 미분양 사업장의 원가율 해소",
      comment: "건설/물류/기타 섹터 1위 최우수 챔피언"
    },
    {
      sectorRank: 2,
      name: "이은상",
      brokerName: "NH투자증권",
      sector: "건설/물류/기타",
      totalScore: 82.60,
      metrics: { targetPriceAccuracy: 61.8, dartAlignment: 93.2, weightedErrorRatePct: "6.80%", logicScore: 79.2, riskScore: 79.0, reportCount: 25, snsAndMediaScore: 85.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "체코 원전 및 중동 가스 플랜트 EPC 해외 수주 파이프라인",
      comment: "건설/물류 섹터 2위"
    },
    {
      sectorRank: 3,
      name: "문경원",
      brokerName: "메리츠증권",
      sector: "건설/물류/기타",
      totalScore: 82.00,
      metrics: { targetPriceAccuracy: 61.0, dartAlignment: 92.6, weightedErrorRatePct: "7.40%", logicScore: 78.8, riskScore: 78.5, reportCount: 24, snsAndMediaScore: 85.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "한국전력 적자 해소와 송배전 전력망 신규 인프라 발주",
      comment: "건설/물류 섹터 3위"
    },
    {
      sectorRank: 4,
      name: "배세호",
      brokerName: "하이투자증권",
      sector: "건설/물류/기타",
      totalScore: 81.40,
      metrics: { targetPriceAccuracy: 60.2, dartAlignment: 92.0, weightedErrorRatePct: "8.00%", logicScore: 78.2, riskScore: 78.0, reportCount: 23, snsAndMediaScore: 84.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "해운 컨테이너 운임지수(SCFI) 변동성과 홍해 물류 희망봉 우회",
      comment: "건설/물류 섹터 4위"
    },
    {
      sectorRank: 5,
      name: "송유림",
      brokerName: "한화투자증권",
      sector: "건설/물류/기타",
      totalScore: 80.80,
      metrics: { targetPriceAccuracy: 59.5, dartAlignment: 91.5, weightedErrorRatePct: "8.50%", logicScore: 77.8, riskScore: 77.5, reportCount: 22, snsAndMediaScore: 84.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "주요 정비사업장 공사비 증액 협상 타결률과 주택 도급 마진",
      comment: "건설/물류 섹터 5위"
    },
    {
      sectorRank: 6,
      name: "신동현",
      brokerName: "현대차증권",
      sector: "건설/물류/기타",
      totalScore: 80.20,
      metrics: { targetPriceAccuracy: 58.8, dartAlignment: 91.0, weightedErrorRatePct: "9.00%", logicScore: 77.2, riskScore: 77.0, reportCount: 21, snsAndMediaScore: 83.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "수도권 광역급행철도(GTX) 및 철도 인프라 민자사업 착공률",
      comment: "건설/물류 섹터 6위"
    },
    {
      sectorRank: 7,
      name: "김기룡",
      brokerName: "미래에셋증권",
      sector: "건설/물류/기타",
      totalScore: 79.60,
      metrics: { targetPriceAccuracy: 58.0, dartAlignment: 90.4, weightedErrorRatePct: "9.60%", logicScore: 76.8, riskScore: 76.5, reportCount: 20, snsAndMediaScore: 83.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "데이터센터 전력 인프라 및 신재생 해상풍력 하부구조물 수주",
      comment: "건설/물류 섹터 7위"
    },
    {
      sectorRank: 8,
      name: "박세라",
      brokerName: "신영증권",
      sector: "건설/물류/기타",
      totalScore: 79.00,
      metrics: { targetPriceAccuracy: 57.2, dartAlignment: 89.8, weightedErrorRatePct: "10.20%", logicScore: 76.2, riskScore: 76.0, reportCount: 19, snsAndMediaScore: 82.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "시멘트·레미콘 가격 인상 합의와 원자재 유연탄 수입 단가",
      comment: "건설/물류 섹터 8위"
    },
    {
      sectorRank: 9,
      name: "장문준",
      brokerName: "KB증권",
      sector: "건설/물류/기타",
      totalScore: 78.40,
      metrics: { targetPriceAccuracy: 56.5, dartAlignment: 89.2, weightedErrorRatePct: "10.80%", logicScore: 75.8, riskScore: 75.5, reportCount: 18, snsAndMediaScore: 82.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "종합 물류 기업의 풀필먼트 자동화 로봇 도입과 택배 단가",
      comment: "건설/물류 섹터 9위"
    },
    {
      sectorRank: 10,
      name: "백광제",
      brokerName: "교보증권",
      sector: "건설/물류/기타",
      totalScore: 77.80,
      metrics: { targetPriceAccuracy: 55.8, dartAlignment: 88.6, weightedErrorRatePct: "11.40%", logicScore: 75.2, riskScore: 75.0, reportCount: 17, snsAndMediaScore: 81.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "국내 건설사 토지신탁 사업장 리스크와 분양보증 사고율",
      comment: "건설/물류 섹터 10위"
    }
  ]
};

