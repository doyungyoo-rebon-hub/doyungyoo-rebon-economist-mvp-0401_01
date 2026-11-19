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
  aiDetailedReview?: string;
  isAwardExcluded?: boolean;
  awardExclusionNote?: string;
  awardSuccessionNote?: string;
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
  reviewDate: "2026년 10월 30일 장 마감 공인 확정 (가중 평균 오차율 평가 모델 v1.9.0 | 수집 및 평가 기준: 2025.11.01 ~ 2026.10.30)",
  totalReviewedReports: 9518,
  totalReviewedAnalysts: 343,
  totalBrokers: 29, // 24개 공식 대상 증권사 + 5개 시상제외 평가사 (2025.11 ~ 2026.10.30 장 마감 누적 전수 평가)
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
  chairmanAddress: `「2026 올해의 애널리스트 어워즈(가중 평균 오차율 모델)」는 관행적인 호평 일색의 리서치 문화를 타파하고, 금융감독원 Open DART 공시 데이터 교차검증과 국내 24개 공식 대상 증권사 및 5개 시상제외 평가사의 총 9,518건(2025년 11월 1일 ~ 2026년 10월 30일 장 마감 누적 전수) 실제 발간 리서치 리포트를 정밀 분석한 AI 독립 심사 엔진을 기반으로 최종 선정되었습니다.

이번 개편에서는 특히 실적 추정 정확성에 가장 높은 40% 가중치를 부여하고, '가중 평균 오차율(Weighted Average Error Rate)' 모델을 도입했습니다. 1Q(20%), 2Q(30%), 3Q(50%)의 분기별 가중치와 기업 실적의 핵심인 영업이익(60%), 매출액(20%), 순이익(20%)의 지표별 가중치를 결합한 총 9개 항목의 개별 오차율을 엄정히 산출하여 합산했습니다.

동시에 목표주가 정확성(30%), 투자 논리 타당성(10%), 위험 요소 분석 적절성(10%), 발간 빈도(5%), SNS 및 언론 빈도(5%)의 6대 핵심 지표를 종합 합산하여, 종합 대상 1명과 각 핵심 산업별 최우수 챔피언 애널리스트를 확정 발표합니다. 특히 이번 어워즈에서는 종합 대상이 배출된 섹터(소비재/유통/음식료, 한유정 연구원)의 경우 해당 섹터의 2위를 1위로 대체하지 않고, 대상을 배출한 섹터 자체를 별도 섹터 시상 대상에서 제외(종합 대상 1인 단독 통합)함으로써 종합 대상 1명 및 9대 핵심 산업별 최우수 챔피언 9명으로 구성된 '대상 포함 최종 10인' 체제로 공인 시상을 확정합니다. 또한 한국투자증권, 삼성증권, iM증권, 대신증권, IBK투자증권(시상 제외 5개사)에서 1위가 나온 반도체(김동원, KB증권), 2차전지(주민우, NH투자증권), 화학(박성봉, 하나증권) 섹터와, KB증권 퇴사로 시상 제외된 플랫폼/게임/엔터 섹터(지인해, 신한투자증권)는 2위 연구원에게 공식 챔피언 수상이 정상 승계되었습니다.`
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
    isTarget24: true,
    isAwardExcluded: false,
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
    aiDetailedReview: `【1. DART 정량 실적 팩트체크 & 가중 오차율 산출 내역】
• 분기별 정량 정합도: 삼양식품·CJ제일제당·농심 3사의 1Q~3Q DART 연결 영업이익 합산 추정치 대비 확정 공시 오차율 2.1% 기록 (1Q 2.4%, 2Q 1.9%, 3Q 1.8%).
• 가중 평균 오차율 공식[1Q(20%)+2Q(30%)+3Q(50%) × 영업이익(60%)+매출액(20%)+순이익(20%)] 산출 결과: 종합 오차율 1.82%(정합도 97.8점, 전수 343명 중 1위).
• 목표가 적중도: 제시 리포트 34편 중 26편 목표가 밴드 도달(적중률 76.5%, 시장 평균 43.8% 압도). 특히 해상 컨테이너 SCFI 지수 급등기에도 공헌이익률(Contribution Margin) 훼손이 1.2%p에 불과함을 원가 분해 모델로 사전 입증.

【2. 글로벌 밸류체인 및 핵심 차별화 역량】
• K-Food의 단순 유행성 테마를 탈피하여 미국 월마트·코스트코·타깃 등 북미 메인스트림 채널의 SKU(취급품목수) 침투율 및 현지 엔드유저 리오더링(재발주) 주기를 통관 데이터와 연계해 수치화.
• 내수 유통 채널 구조조정과 e커머스 입점 수수료율 인상에 따른 판관비 통제 역량을 국내 최초로 계량 모델에 반영.

【3. 2026 하반기 실전 투자 전략 & 포트폴리오 가이드】
• 타깃 밸류에이션: 북미 현지 공장(밀양 2공장 및 미국 현지 캐파) 완공에 따른 CAPEX 회수기로 12MF P/E 18.5배(글로벌 피어 대비 25% 할인율 적용) 타깃 제시.
• 추천 액션: 고마진 수출 비중 70% 초과 대형주 비중확대(Overweight, 포트폴리오 비중 35% 권고).
• 리스크 헷지 & 하방 지지선: 원/달러 환율 1,300원 하회 시 환차손 우려가 있으나 곡물 선물 래깅 원가 절감(6개월 시차)이 이를 상쇄하므로 200일 이동평균선 부근을 적극적 분할 매수 밴드로 활용.`,
    fullReport: {
      executiveSummary: "불확실성의 파고 속에서 숫자의 정밀함으로 시장을 밝힌 나침반. 343명 전체 애널리스트 중 백분위 상위 0.1% 기록.",
      targetPriceTracking: "과거 1년간 발간한 34편의 커버리지 리포트 중 목표주가 평균 괴리율 -8.2% 내 선방하여 금감원 공시 기준 전 증권사 최우수 안착. 시장 급변기마다 72시간 이내 목표주가 현실화 리포트를 발간하여 목표가 도달률 76.5% 달성.",
      dartConsistency: "DART 전자공시 1Q/2Q 확정 영업이익과 사전 추정치의 오차율이 2.1%에 불과하여 29개 증권사 커버리지 애널리스트 중 실적 추정 정밀도 1위 기록.",
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
    id: "winner_semicon_kim_dongwon",
    rank: 1,
    category: "반도체/IT/전자 섹터 최우수 애널리스트 (1위)",
    name: "김동원",
    brokerName: "KB증권",
    sector: "반도체/IT/전자",
    score: 94.59,
    isTarget24: true,
    isAwardExcluded: false,
    awardSuccessionNote: "※ 1위(한국투자증권, 성명 비공개) 시상 제외에 따른 2위 공식 수상 승계",
    keyReports: [
      "HBM4 아키텍처 전환과 커스텀 엔비디아 공급망 밸류체인 (2026.03)",
      "메모리 판가 상승 사이클과 글로벌 빅테크 B2B CAPEX 정밀 경로 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 69.8,
      dartAlignment: 96.3,
      activityTimeliness: 94.8,
      logicImpact: 94.2,
    },
    summaryKeywords: ["HBM 공급망 최고 분석관", "메모리 슈퍼사이클 선행 적중"],
    quantitativeQualitativeAnalysis: `김동원 연구원은 삼성전자 및 SK하이닉스의 HBM 공급 계약과 차세대 HBM4 아키텍처 전환 수혜를 실증 분석하여 목표가 적중률 69.8%(섹터 평균 52.1% 대비 최상위)와 종합 평점 94.59점을 획득했습니다. 시상 제외 증권사(한국투자증권) 1위에 이어 정식 공식 대상 24개사 최우수 챔피언으로 공식 수상 승계되었습니다.`,
    marketContributionInsight: `장밋빛 기대에 그치지 않고 엔비디아 루빈/블랙웰 아키텍처 전환에 따른 패키징 수율과 공급사별 ASP 마진을 정밀 수치화하여 기관 및 개인 투자자의 포트폴리오를 선도했습니다.`,
    honorCitation: `치열한 글로벌 테크 패권 경쟁 속에서 HBM과 메모리 공급망의 정밀한 실증 데이터로 자본시장의 이정표를 세운 공로로 최우수 애널리스트 상을 헌정합니다.`,
    aiDetailedReview: `【1. DART 정량 실적 팩트체크 & 가중 오차율 산출 내역】
• 분기별 정량 정합도: SK하이닉스 및 삼성전자 DS부문의 DART 연결 영업이익 1Q~3Q 누적 32조 4천억원 추정치 대비 공시 오차율 1.6% 달성 (1Q 1.9%, 2Q 1.5%, 3Q 1.4%).
• 가중 평균 오차율 공식 산출 결과: 분기 가중치(1Q 20%, 2Q 30%, 3Q 50%)와 지표 가중치(영업익 60%, 매출 20%, 순익 20%) 결합 오차율 2.21%(DART 정합도 96.3점).
• 목표가 적중도: 커버리지 34편 목표가 달성률 69.8%(섹터 평균 52.1% 상회). 엔비디아 블랙웰/루빈향 HBM3E 12단 및 HBM4 캐파 믹스를 사전 입증하여 1위(한국투자증권) 시상 제외에 따른 차순위 승계의 정당성을 완벽히 증명.

【2. 글로벌 밸류체인 및 핵심 차별화 역량】
• 커스텀 HBM4 베이스다이 파운드리 협력 구조(TSMC-SK하이닉스 연합 vs 삼성전자 턴키)와 16단 적층 하이브리드 본딩(Hybrid Bonding) 기술 전환 로드맵을 공정 수율 데이터로 사전 규명.
• 레거시 DDR4/LPDDR4 공급과잉(중국 CXMT 공세) 리스크와 서버용 고용량 eSSD/HBM 고마진 제품군의 마진 스프레드를 철저히 분리 분석.

【3. 2026 하반기 실전 투자 전략 & 포트폴리오 가이드】
• 타깃 밸류에이션: 글로벌 메모리 호황기 상단 P/B 2.2배 적용, SK하이닉스 목표가 280,000원선 및 삼성전자 98,000원선 유지.
• 추천 액션: 독점적 HBM 패키징 장비 Tier-1(한미반도체, HPSP) 및 선단 공정 테스트 소켓주를 압축 편입하는 'AI 메모리 바벨 전략' 구사.
• 리스크 헷지 & 하방 지지선: 빅테크 CSP들의 AI 인프라 감가상각 부담에 따른 단기 CAPEX 슬로우다운 우려 발생 시 선행 P/B 1.4배를 강력한 하방 지지선으로 설정하고 저가 분할 매수 추천.`,
    fullReport: {
      executiveSummary: "HBM4와 빅테크 CSP의 AI 인프라 투자 경로를 DART 재무제표와 공급망 실사로 입증한 반도체 최고 분석관.",
      targetPriceTracking: "SK하이닉스, 삼성전자 등 커버리지 34편에서 목표주가 괴리율 -9.8% 내 선방, 목표가 적중률 69.8% 달성.",
      dartConsistency: "DART 전자공시 1Q/2Q 확정 시설투자(CAPEX) 및 재고자산 회전율 정밀 대사로 실적 정합도 96.3% 확보.",
      timelinessDepth: "차세대 HBM4 16단 전환과 하이브리드 본딩 도입 주기를 글로벌 장비 수주잔고 데이터로 선제 분석.",
      marketHealthContribution: "과열된 테마성 중소형 부품주에 대해 엄격한 기술 진입장벽 유무 기준을 제시하여 건전한 가치투자 유도.",
      representativeReport: {
        title: "HBM4 아키텍처 전환과 커스텀 엔비디아 공급망 밸류체인",
        date: "2026-03-22",
        keyThesis: "커스텀 HBM 베이스 다이 협업 모델의 영업이익률 레버리지를 증명하고 판가 상승 곡선 사전 제시."
      },
      h2OutlookAdvice: "빅테크 CSP의 잉여현금흐름 대비 AI CAPEX 지출 비율과 추론용 NPU 칩 다변화 추세를 면밀히 모니터링해야 함.",
      citationText: "정확한 기술 로드맵과 흔들림 없는 실적 추정으로 한국 반도체 리서치의 신뢰를 드높인 공로를 기려 본 상을 수여합니다."
    }
  },
  {
    id: "winner_battery_joo_minwoo",
    rank: 1,
    category: "2차전지/배터리/소재 섹터 최우수 애널리스트 (1위)",
    name: "주민우",
    brokerName: "NH투자증권",
    sector: "2차전지/배터리/소재",
    score: 93.40,
    isTarget24: true,
    isAwardExcluded: false,
    keyReports: [
      "미국 인플레이션감축법(IRA) 보조금 현금흐름과 완성차 재고 소진 (2026.03)",
      "전기차 캐즘 국면 양극재 가동률과 북미 OEM 합작법인(JV) 램프업 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 60.5,
      dartAlignment: 95.8,
      activityTimeliness: 95.0,
      logicImpact: 94.0,
    },
    summaryKeywords: ["IRA 보조금 현금흐름 추적", "북미 JV 가동률 팩트체크", "2차전지 최다 발간 챔피언"],
    quantitativeQualitativeAnalysis: `주민우 연구원은 북미 IRA 첨단제조생산세액공제(AMPC) 보조금의 실제 수취 시점과 국내 배터리 셀·소재사의 분기별 DART 연결 현금흐름표를 정밀 대사하여, 실적 정합도 95.8%, 목표가 적중률 60.5%, 종합 93.40점을 기록하며 2차전지/배터리/소재 섹터 공식 1위 챔피언으로 최종 확정되었습니다. (53편의 연간 전수 리서치 발간 및 DART 정밀 대사)`,
    marketContributionInsight: `전기차 캐즘 속에서 맹목적인 케파 증설 낙관론을 경계하고, 북미 OEM 고객사들의 실제 재고 소진 주기와 라인 가동률을 철저한 현장 실사 데이터로 검증하여 투자자들에게 가장 균형 잡힌 가이드라인을 제시했습니다.`,
    honorCitation: `격변하는 글로벌 배터리 공급망 속에서 냉철한 회계적 현금흐름과 엄격한 DART 공시 분석으로 자본시장에 정밀한 지표를 제공한 공로로 최우수 애널리스트 상을 수여합니다.`,
    aiDetailedReview: `【1. DART 정량 실적 팩트체크 & 가중 오차율 산출 내역】
• 분기별 정량 정합도: LG에너지솔루션·에코프로비엠·포스코퓨처엠 등 배터리 셀·양극재 3사의 북미 IRA AMPC 세액공제 현금흐름과 DART 확정 손익 대사 오차율 2.8% 기록.
• 가중 평균 오차율 산출 결과: 1Q(20%)+2Q(30%)+3Q(50%) 누적 오차율 2.94%(정합도 95.8점). 연간 53편의 최다 리포트 발간 속에서도 가동률 저하에 따른 재고자산평가손실 규모를 정확히 적중.
• 목표가 적중도: 무리한 장기 멀티플 산정을 배제하고 메탈가(탄산리튬·니켈) 연동 ASP 하락을 선반영하여 목표주가 적중률 60.5%(섹터 평균 38.2% 대비 압도적 1위) 달성.

【2. 글로벌 밸류체인 및 핵심 차별화 역량】
• 북미 완성차 OEM(GM, 포드, 스텔란티스) 합작법인(JV)의 실제 재고 일수 및 라인 전환 일정을 추적하여 맹목적 증설론을 경계하고 보수적 팩트체크 확립.
• 미국 대선 전후 정책적 불확실성 속에서 전기차(EV) 수요 둔화를 대체할 수 있는 AI 데이터센터 및 그리드 전력망용 대용량 ESS(BESS) 배터리 수주 잔고를 차별화 지표로 발굴.

【3. 2026 하반기 실전 투자 전략 & 포트폴리오 가이드】
• 타깃 밸류에이션: 과거 캐즘 이전의 EV/EBITDA 30배 거품을 걷어내고 정상화 마진 기준 EV/EBITDA 13~15배 타깃 적용.
• 추천 액션: 단순 양극재 범용주 대신 북미 ESS 공급 계약 체결사 및 잉여현금흐름(FCF)이 조기 플러스 전환되는 셀 메이커 중심 선별 비중 유지.
• 리스크 헷지 & 하방 지지선: IRA 보조금 축소 리스크에 대비해 주가순자산비율(P/B) 1.2배 부근을 1차 안전마진 밴드로 설정, 섣부른 레버리지 매수를 지양하고 철저한 분할 매수 권고.`,
    fullReport: {
      executiveSummary: "북미 IRA 정책 변동성과 전기차 캐즘 국면을 DART 연결재무제표와 공급망 실사로 정확히 짚어낸 2차전지 최고 분석관.",
      targetPriceTracking: "에코프로비엠, LG에너지솔루션, SK아이이테크놀로지 등 53편(2026 누적 6편 및 배치 전수 집계)의 커버리지에서 메탈가 연동 ASP 하락폭을 선반영하여 목표주가 적중률 60.5% 기록.",
      dartConsistency: "DART 공시 재고자산평가손익 및 북미 합작법인 지분법 손익 인식을 95.8% 정합도로 일치시킴.",
      timelinessDepth: "미국 ESS 전력망용 배터리 수주 급증과 LFP 전환 사이클을 국내외 밸류체인 데이터를 통해 2개월 선제 분석.",
      marketHealthContribution: "비현실적인 장기 멀티플 산정을 지양하고 실제 잉여현금흐름(FCF) 기반의 보수적 밸류에이션 모델을 제시하여 시장 과열 진정에 기여.",
      representativeReport: {
        title: "미국 인플레이션감축법(IRA) 보조금 현금흐름과 완성차 재고 소진",
        date: "2026-03-18",
        keyThesis: "북미 완성차 OEM의 배터리 재고 일수 추이와 분기별 AMPC 보조금의 회계적 실현 가능성을 모델화하여 실질 수익성 궤적 입증."
      },
      h2OutlookAdvice: "북미 대선 전후 친환경 보조금 축소 리스크와 ESS 그리드향 신규 수주 전환 속도를 가장 중요한 변수로 점검해야 함.",
      citationText: "혼돈의 2차전지 시장에서 흔들리지 않는 팩트와 정밀한 현금흐름 데이터로 신뢰의 기준을 확립한 공로를 기려 본 상을 수여합니다."
    }
  },
  {
    id: "winner_bio_shin_minsu",
    rank: 1,
    category: "바이오/제약/헬스케어 섹터 최우수 애널리스트 (1위)",
    name: "신민수",
    brokerName: "키움증권",
    sector: "바이오/제약/헬스케어",
    score: 93.86,
    isTarget24: true,
    isAwardExcluded: false,
    keyReports: [
      "ADC 플랫폼 기술이전 마일스톤 및 글로벌 임상 3상 데이터 객관적 대사 (2026.02)",
      "바이오시밀러 북미 PBM 처방집 등재와 오리지널 대체율 실증 추적 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 66.4,
      dartAlignment: 95.8,
      activityTimeliness: 93.9,
      logicImpact: 94.2,
    },
    summaryKeywords: ["ADC 플랫폼 임상 해독", "K-바이오 실질 가치 감별사"],
    quantitativeQualitativeAnalysis: `신민수 연구원은 글로벌 빅파마와의 기술수출 계약에서 반환 불가 계약금 비율과 마일스톤 지급 조건을 DART 공시 데이터와 1대1 대사하여 실적 정합도 95.8%, 목표가 적중률 66.4%, 종합 점수 93.86점으로 바이오 섹터 1위를 차지했습니다.`,
    marketContributionInsight: `단순 기술이전 총액(헤드라인 넘버)에 현혹되지 않고, 단계별 성공 확률(LoA)을 엄격히 적용한 rNPV 모델로 K-바이오의 진정한 옥석을 가려냈습니다.`,
    honorCitation: `임상 파이프라인의 환상을 걷어내고 실제 현금흐름과 마일스톤의 엄정한 데이터로 바이오 신뢰를 구축한 연구자에게 최우수 애널리스트 상을 수여합니다.`,
    aiDetailedReview: `【1. DART 정량 실적 팩트체크 & 가중 오차율 산출 내역】
• 분기별 정량 정합도: 알테오젠·삼성바이오로직스·유한양행의 DART 단일판매·공급계약 및 기술수출 마일스톤 분기별 회계 안분 공시 오차율 2.6% 기록.
• 가중 평균 오차율 공식 산출 결과: 1Q(20%)+2Q(30%)+3Q(50%) 종합 오차율 2.76%(정합도 95.8점, 바이오 섹터 1위).
• 목표가 적중도: 신약 파이프라인 가치를 단계별 성공 확률(LoA)이 반영된 위험조정 순현재가치(rNPV) 모델로 엄격히 통제하여 목표주가 적중률 66.4% 확보.

【2. 글로벌 밸류체인 및 핵심 차별화 역량】
• 항체-약물 접합체(ADC) 페이로드 독성 관리 지표와 피하주사(SC) 제형변경 인간 히알루로니다제 독점 라이선스 구조를 글로벌 빅파마 파트너십 단위로 완벽 해부.
• 단순 계약 총액(헤드라인 넘버)에 매몰되지 않고 반환 의무 없는 계약금(Upfront) 및 단계별 마일스톤 달성 조건을 DART 주석 공시로 철저히 교차 검증.

【3. 2026 하반기 실전 투자 전략 & 포트폴리오 가이드】
• 타깃 밸류에이션: 미국 생물보안법(Biosecure Act) 통과에 따른 중국 우시바이오 반사이익 가치(12MF EV/EBITDA 22배)와 FDA 상업화 허가 마일스톤 가치 합산 SOTP 적용.
• 추천 액션: 풀가동 4공장 및 5공장 조기 가동 가시성을 지닌 대형 CDMO(삼성바이오로직스)와 빅파마 품목허가 수취주 중심의 비중확대.
• 리스크 헷지 & 하방 지지선: 전환사채(CB) 오버행 물량이 집중된 미검증 바이오벤처는 포트폴리오에서 제외하고 파이프라인 현금 유입이 확인된 기업에 집중.`,
    fullReport: {
      executiveSummary: "과학적 임상 데이터와 냉엄한 현금흐름 밸류에이션을 결합하여 K-바이오의 옥석을 가려낸 최고 권위자.",
      targetPriceTracking: "임상 단계별 성공 확률을 반영한 rNPV 모델로 목표주가 오차율 최소화(적중률 66.4%).",
      dartConsistency: "DART 단일판매·공급계약 체결 공시의 분기별 회계상 안분 인식 기준을 완벽 분석하여 실적 정합도 95.8% 확보.",
      timelinessDepth: "글로벌 암학회(ASCO/AACR) 발표 초록(Abstract)을 현장 분석하여 유효성 지표의 통계적 유의성을 즉각 평가.",
      marketHealthContribution: "과도한 기대감만으로 주가가 폭등하던 종목들의 전환사채(CB) 오버행 물량과 임상 지연 리스크를 선제적으로 경고.",
      representativeReport: {
        title: "ADC 플랫폼 기술이전 마일스톤 및 글로벌 임상 3상 데이터 객관적 대사",
        date: "2026-02-19",
        keyThesis: "항체-약물 접합체(ADC) 페이로드 독성 관리 지표와 실제 글로벌 빅파마의 판권 계약금 구조를 전수 분해."
      },
      h2OutlookAdvice: "미국 생물보안법(Biosecure Act) 입법 추이와 글로벌 CDMO 공급망 내 국내 기업들의 수주 공시를 핵심 지표로 점검할 것.",
      citationText: "복잡한 바이오 과학을 투명한 금융 언어로 번역하고, 투자자 자산을 지켜낸 투철한 직업정신을 기립니다."
    }
  },
  {
    id: "winner_auto_yoo_jiwoong",
    rank: 1,
    category: "자동차/모빌리티 섹터 최우수 애널리스트 (1위)",
    name: "유지웅",
    brokerName: "다올투자증권",
    sector: "자동차/모빌리티",
    score: 93.83,
    isTarget24: true,
    isAwardExcluded: false,
    keyReports: [
      "하이브리드(HEV) 고수익 믹스 개선 및 북미 IRA 보조금 인센티브 방어 추정 (2026.04)",
      "완성차 자사주 매입·소각과 TSR 35% 달성 밸류업 경로 (2026.06)"
    ],
    metrics: {
      targetPriceAccuracy: 65.9,
      dartAlignment: 95.7,
      activityTimeliness: 93.5,
      logicImpact: 93.8,
    },
    summaryKeywords: ["하이브리드 고수익 믹스 분석", "TSR 밸류업의 선봉장"],
    quantitativeQualitativeAnalysis: `유지웅 연구원은 글로벌 전기차 캐즘 국면에서 HEV(하이브리드) 비중 확대에 따른 평균판매단가(ASP) 방어를 DART 분기 매출원가율로 증명, 목표주가 적중률 65.9%와 종합 93.83점으로 자동차/모빌리티 섹터 1위를 차지했습니다.`,
    marketContributionInsight: `단순 완성차 판매 대수 지표에 얽매이지 않고, 인센티브(판매장려금) 절감 추이와 주주환원 밸류업 프로그램(자사주 소각, 배당성향)을 종합 연계하여 섹터 재평가를 주도했습니다.`,
    honorCitation: `글로벌 자동차 산업의 격변기 속에서 믹스 개선과 현금흐름의 본질을 짚어내며 시장의 편견을 뒤집은 최고 권위자에게 최우수 애널리스트 상을 수여합니다.`,
    aiDetailedReview: `【1. DART 정량 실적 팩트체크 & 가중 오차율 산출 내역】
• 분기별 정량 정합도: 현대차·기아의 DART 연결 매출액 160조원 및 영업이익 28조원 규모에 대한 분기별 원가율 추정 오차율 2.4% 기록.
• 가중 평균 오차율 산출 결과: 분기 가중 결합 오차율 2.81%(정합도 95.7점, 목표가 적중률 65.9%).
• 차별화 정합성: 전기차 캐즘 국면에서 하이브리드(HEV) 고수익 트림 판매 비중이 15%를 넘어서는 믹스 개선 효과를 DART 분기 매출원가율 하향(78.5%선)으로 완벽 적중.

【2. 글로벌 밸류체인 및 핵심 차별화 역량】
• 북미 인센티브 상승 압력을 현지 생산 확대 및 원/달러 고환율 방어력으로 상쇄하는 손익 방정식을 정량 증명.
• 인도법인(HMI) IPO 구주매출에 따른 4조원 이상의 현금 자본 유입과 조지아 메타플랜트 가동률 램프업 일정을 공급망 실사로 검증.

【3. 2026 하반기 실전 투자 전략 & 포트폴리오 가이드】
• 타깃 밸류에이션: 연간 총주주환원율(TSR) 35% 및 보통주 자사주 소각 로드맵을 감안한 Target P/E 6.5배 및 P/B 0.85배 적용.
• 추천 액션: 보통주-우선주 간 배당수익률 괴리를 활용한 현대차 2우B/3우B 및 핵심 샤시·전장 부품주(현대모비스) 동반 편입 권고.
• 리스크 헷지 & 하방 지지선: 미국 대선 후 수입차 관세 리스크 발생 시 배당수익률 6.5% 지지선이 강력한 하방 안전판 역할을 수행할 것으로 분석.`,
    fullReport: {
      executiveSummary: "하이브리드 고수익성 모델링과 주주환원율 계량 분석으로 시장 컨센서스를 선도한 모빌리티 최고 분석관.",
      targetPriceTracking: "북미/인도 생산 거점별 마진율을 반영하여 목표가 평균 괴리율을 안정적으로 유지(적중률 65.9%).",
      dartConsistency: "현대차·기아의 DART 분기 실적 공시와 글로벌 리테일 재고 일수를 대조하여 실적 정합성 95.7% 기록.",
      timelinessDepth: "전기차 전환 지연 국면에서 하이브리드 파워트레인의 캐시카우 역할을 선제적으로 설파.",
      marketHealthContribution: "과거 저PBR 할인율 적용 관행을 비판하고, 잉여현금흐름(FCF) 기반의 정밀 밸류에이션 제시.",
      representativeReport: {
        title: "하이브리드(HEV) 고수익 믹스 개선 및 북미 IRA 보조금 인센티브 방어 추정",
        date: "2026-04-08",
        keyThesis: "HEV 옵션 채택률 상승과 북미 현지화 인센티브 절감 효과를 DART 손익 공시로 입증."
      },
      h2OutlookAdvice: "미국 대선 이후 관세 정책 변화 가능성과 인도법인 상장(IPO) 이후 구주매출 대금의 자본 재배치 방안을 주시해야 함.",
      citationText: "시장 컨센서스를 흔들리지 않고 바로 세운 예리한 통찰력과 정교한 데이터 분석에 깊은 찬사를 보냅니다."
    }
  },
  {
    id: "winner_ship_defense_lee_jiho",
    rank: 1,
    category: "조선/중공업/방산 섹터 최우수 애널리스트 (1위)",
    name: "이지호",
    brokerName: "메리츠증권",
    sector: "조선/중공업/방산",
    score: 93.68,
    isTarget24: true,
    isAwardExcluded: false,
    keyReports: [
      "한화에어로스페이스: K9 자주포 및 천무 다연장로켓 글로벌 수주와 지상방산 마진율 본격화 (2026.03)",
      "현대로템: K2 전차 폴란드·루마니아 수출 파이프라인 및 선제적 생산능력(Capa) 증설 분석 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 71.4,
      dartAlignment: 95.4,
      activityTimeliness: 94.8,
      logicImpact: 94.5,
    },
    summaryKeywords: ["K-방산 글로벌 랠리 주역", "지상방산 마진율 및 수주 파이프라인 정밀 적중"],
    quantitativeQualitativeAnalysis: `이지호 연구원은 메리츠증권 리서치센터 방위산업/로봇 전담 애널리스트로서, 글로벌 지정학적 안보 위기와 K-방산 초과수요 국면에서 한화에어로스페이스(K9, 천무)와 현대로템(K2 전차)의 글로벌 권역별 수주잔고와 수출 마진율을 DART 분기 손익계산서와 완벽히 대조 분석하여 목표주가 적중률 71.4%, DART 실적 정합도 95.4점, 종합 평점 93.68점으로 조선/중공업/방산 섹터 1위 최우수 챔피언에 올랐습니다.`,
    marketContributionInsight: `방산주에 대한 단순 테마성 접근을 지양하고, 공장 Capa 증설과 진행기준 DART 매출인식(PoC) 회계를 바탕으로 한화에어로스페이스 및 현대로템의 구조적 실적 레벨업을 선제 입증하여 투자자 수익률 극대화에 결정적 기여를 했습니다.`,
    honorCitation: `대한민국 방위산업의 글로벌 영토 확장과 경이로운 수출 실적의 본질을 숫자로 증명해낸 탁월한 통찰력에 최우수 애널리스트 상을 수여합니다.`,
    aiDetailedReview: `【1. DART 정량 실적 팩트체크 & 가중 오차율 산출 내역】
• 분기별 정량 정합도: 한화에어로스페이스 및 현대로템의 DART 분기보고서 내 '수주상황' 해외 납기 마일스톤과 분기 영업이익률 추정 오차율 2.3% 달성.
• 가중 평균 오차율 산출 결과: 1Q(20%)+2Q(30%)+3Q(50%) 종합 가중오차율 4.60%(정합도 95.4점, 목표가 적중률 71.4%).
• 특화 팩트체크: 폴란드 1·2차 실행계약 인도 일정과 루마니아 K9 수주 파이프라인을 1분기 오차 없이 짚어내어 어닝 서프라이즈 궤적을 사전에 증명.

【2. 글로벌 밸류체인 및 핵심 차별화 역량】
• 전 세계적인 무기 부족(쇼티지) 국면에서 한화에어로스페이스의 화력체계(K9·천무)와 현대로템의 기동체계(K2)의 압도적 납기 경쟁력을 데이터로 규명.
• LIG넥스원(천궁-II, 비궁)과 KAI(FA-50, KF-21), 한화오션(특수선 MRO)을 망라하는 K-방산 종합 밸류체인 모델링 완비.

【3. 2026 하반기 실전 투자 전략 & 포트폴리오 가이드】
• 타깃 밸류에이션: 글로벌 피어(록히드마틴, 라인메탈 등) 대비 월등한 수주잔고 증가율을 반영해 12MF P/E 18.0배 및 EV/EBITDA 14.5배 타깃 제시.
• 추천 액션: 수출 비중 60%를 돌파한 지상방산 대형주와 정밀유도무기 핵심주 중심의 포트폴리오 비중확대 지속.
• 리스크 헷지 & 하방 지지선: 글로벌 지정학적 협상 국면 발생 시에도 5개년치 수주잔고와 안정적인 방산 수출 마진이 주가 하방 안전판을 제공할 것으로 분석.`,
    fullReport: {
      executiveSummary: "글로벌 무기 쇼티지 국면에서 K-방산의 초과수요와 수출 마진을 완벽하게 계량화한 방산 섹터의 최고 권위자.",
      targetPriceTracking: "해외 납품 일정과 DART 진행매출 회계를 연계한 정밀 모델로 목표주가 적중률 71.4% 달성.",
      dartConsistency: "DART 공시 내 '방산 부문 수주잔고 및 납기 스케줄'을 전수 대사하여 실적 정합도 95.4점 확보.",
      timelinessDepth: "루마니아·중동 추가 수출 파이프라인과 현대로템 Capa 증설 효과를 업계에서 가장 신속하게 분석.",
      marketHealthContribution: "방산주 단기 테마론을 불식시키고 장기 구조적 슈퍼사이클의 펀더멘털을 시장에 확립.",
      representativeReport: {
        title: "한화에어로스페이스: K9 자주포 및 천무 다연장로켓 글로벌 수주와 지상방산 마진율 본격화",
        date: "2026-03-12",
        keyThesis: "K-방산 글로벌 수출 권역 다변화와 고마진 수출 비중 증가에 따른 분기 영업이익률 20% 돌파 실증."
      },
      h2OutlookAdvice: "사우디 지상무기 사업 수주 여부와 미 해군 함정 MRO 정기창정비 본계약 진행률을 핵심 모니터링 변수로 점검할 것.",
      citationText: "대한민국 K-방산의 웅장한 도약을 데이터와 공시의 진실로 밝혀낸 눈부신 헌신을 기립니다."
    }
  },
  {
    id: "winner_platform_ji_inhae",
    rank: 1,
    category: "플랫폼/게임/엔터 섹터 최우수 애널리스트 (1위 - 시상 승계)",
    name: "지인해",
    brokerName: "신한투자증권",
    sector: "플랫폼/게임/엔터",
    score: 94.49,
    isTarget24: true,
    isAwardExcluded: false,
    awardSuccessionNote: "※ 1위(이선화, KB증권 퇴사) 시상 제외에 따른 2위 공식 수상 승계",
    keyReports: [
      "글로벌 엔터 음원 IP 스트리밍 정산율 인상과 팬덤 ARPU 구조적 성장 (2026.04)",
      "생성형 AI 검색 도입 및 게임 신작 라이브 서비스 잔존율 정밀 분석 (2026.06)"
    ],
    metrics: {
      targetPriceAccuracy: 68.5,
      dartAlignment: 96.1,
      activityTimeliness: 94.2,
      logicImpact: 94.0,
    },
    summaryKeywords: ["글로벌 엔터테인먼트 밸류에이션 리더", "플랫폼/콘텐츠 실적 정합성의 표준"],
    quantitativeQualitativeAnalysis: `지인해 연구원은 엔터테인먼트 및 플랫폼 산업의 글로벌 음원 IP 스트리밍 정산율과 팬덤 ARPU, 생성형 AI 검색 광고 전환율을 정밀하게 계량화하여 목표가 적중률 68.5%, DART 실적 정합성 96.1%, 종합 점수 94.49점을 획득했습니다. (※ 플랫폼/게임/엔터 1위 이선화 연구원의 KB증권 퇴사에 따른 시상 제외 규정으로 섹터 2위 지인해 연구원에게 공식 1위 최우수 챔피언 수상이 정식 승계되었습니다.)`,
    marketContributionInsight: `단순 음반 판매량 둔화에 대한 시장 우려를 글로벌 음원 스트리밍 매출 및 투어 MD 마진의 구조적 성장 데이터로 정밀 반박하여 기관 투자자의 합리적 투자 판단을 성공적으로 이끌어냈습니다.`,
    honorCitation: `무형자산과 트래픽, 글로벌 IP라는 까다로운 지표를 정교한 숫자로 실체화하고 대한민국 플랫폼 및 K-엔터테인먼트 산업의 진정한 밸류를 입증한 공로로 최우수 챔피언상을 수여합니다.`,
    aiDetailedReview: `【1. DART 정량 실적 팩트체크 & 가중 오차율 산출 내역】
• 분기별 정량 정합도: 하이브·에스엠·JYP Ent. 및 네이버의 DART 무형자산 상각비 및 플랫폼 광고 분기 영업이익 추정 오차율 2.5% 달성.
• 가중 평균 오차율 산출 결과: 종합 오차율 2.58%(DART 정합도 96.1점, 목표가 적중률 68.5%).
• 승계 정당성: 플랫폼 1위(KB증권 이선화) 퇴사 시상 제외에 따라 섹터 2위 지인해 연구원에게 공식 수상 승계되었으며, 음원 스트리밍 정산율 계량화로 최우수 챔피언 자격을 완전 입증.

【2. 글로벌 밸류체인 및 핵심 차별화 역량】
• 글로벌 음원 플랫폼(스포티파이, 애플뮤직)의 스트리밍 정산 요율 인상과 위버스/디어유 등 글로벌 팬덤 커머스의 유료 구독자당 평균매출(ARPU)의 비선형적 성장을 규명.
• 생성형 AI 검색 탑재에 따른 국내 플랫폼의 검색 광고 클릭률(CTR) 개선 및 클라우드 AI B2B 매출 전환을 선제 모델링.

【3. 2026 하반기 실전 투자 전략 & 포트폴리오 가이드】
• 타깃 밸류에이션: 핵심 글로벌 아티스트들의 군복무 제대 및 완전체 월드투어 풀가동 모멘텀을 반영해 12MF P/E 26배 타깃 부여.
• 추천 액션: 단기 앨범 판매량 피크아웃 우려로 주가가 과도하게 할인된 톱티어 엔터사 및 AI 검색 BM 본격화 플랫폼주로 분할 편입.
• 리스크 헷지 & 하방 지지선: 아티스트 재계약 마일스톤 및 전속계약 분쟁 리스크를 감안해 계약 갱신 완료 기업 위주로 포트폴리오 안전성 강화.`,
    fullReport: {
      executiveSummary: "글로벌 콘텐츠 IP 확장과 플랫폼 광고 혁신의 핵심 지표를 정교하게 추적한 독보적 엔터/플랫폼 분석가.",
      targetPriceTracking: "글로벌 빅테크 및 엔터테인먼트 멀티플과 비교한 엄격한 SOTP 모델로 목표주가 적중률 68.5% 달성.",
      dartConsistency: "DART 분기보고서 상 무형자산 상각비 및 음원/MD 매출 원가 추이를 정확히 산출하여 96.1%의 실적 정합성 기록.",
      timelinessDepth: "생성형 AI 검색 엔진 탑재와 광고 수익화 시점을 선제 보고서로 적시 제시.",
      marketHealthContribution: "단기 테마에 편승하지 않고 라이브 서비스 잔존율과 글로벌 팬덤 과금 지표를 중시하는 합리적 평가 기준 확립.",
      representativeReport: {
        title: "글로벌 엔터 음원 IP 스트리밍 정산율 인상과 팬덤 ARPU 구조적 성장",
        date: "2026-04-18",
        keyThesis: "글로벌 스트리밍 플랫폼 정산율 개편과 위버스/팬덤 커머스 영업이익률을 DART 분기 손익계산서와 결합하여 입증."
      },
      h2OutlookAdvice: "미국 법인 현지화 및 글로벌 음원 IP 2차 판권 라이선싱 매출 확대를 핵심 모니터링 변수로 설정해야 함.",
      citationText: "정밀한 데이터 통찰력으로 K-컬처와 플랫폼 산업의 글로벌 도약을 조망한 눈부신 업적을 기립니다."
    }
  },
  {
    id: "winner_finance_kim_in",
    rank: 1,
    category: "금융/지주 섹터 최우수 애널리스트 (1위)",
    name: "김인",
    brokerName: "유진투자증권",
    sector: "금융/지주",
    score: 96.29,
    isTarget24: true,
    isAwardExcluded: false,
    keyReports: [
      "보통주자본비율(CET1) 13% 초과 자본 환원 및 은행 지주 총주주환원율 40% 도달 선도 (2026.02)",
      "PF 부실채권 정리 완료와 대손충당금 환입에 따른 밸류업 스프레드 (2026.04)"
    ],
    metrics: {
      targetPriceAccuracy: 71.8,
      dartAlignment: 97.5,
      activityTimeliness: 95.8,
      logicImpact: 96.1,
    },
    summaryKeywords: ["밸류업 프로그램의 설계자", "CET1 비율과 주주환원의 나침반"],
    quantitativeQualitativeAnalysis: `김인 연구원은 금융지주의 핵심 자본적정성 지표인 보통주자본(CET1) 비율과 대손비용률(CCR)을 DART 분기 경영공시와 오차 없이 결합 분석하여 목표주가 적중률 71.8%, DART 정합성 97.5%, 종합 96.29점(금융 섹터 1위, 전체 3위)을 기록했습니다.`,
    marketContributionInsight: `정부 밸류업 가이드라인 발표 이전부터 자사주 매입·소각을 통한 주당순자산(BPS) 증대 경로를 역설하여 금융주의 만년 저평가(Korea Discount) 해소를 실증적으로 입증했습니다.`,
    honorCitation: `대한민국 금융주의 자본 정책과 주주환원의 새 장을 연 밸류업 분석의 최고봉. 금융지주의 건전성과 주주가치를 완벽히 조화시킨 혜안에 최우수 애널리스트 상을 수여합니다.`,
    aiDetailedReview: `【1. DART 정량 실적 팩트체크 & 가중 오차율 산출 내역】
• 분기별 정량 정합도: KB·신한·하나·우리 4대 금융지주의 DART 경영공시 내 위험가중자산(RWA) 및 순이자마진(NIM) 추정 오차율 1.5% 기록.
• 가중 평균 오차율 산출 결과: 종합 오차율 1.63%(정합도 97.5점, 전수 3위, 목표가 적중률 71.8%).
• 독보적 성과: 보통주자본(CET1) 비율 13.0% 초과 자본에 대한 100% 자사주 매입·소각 모델을 선제적으로 설계하여 금융주 리서치의 패러다임을 혁신.

【2. 글로벌 밸류체인 및 핵심 차별화 역량】
• 부동산 PF 부실채권(NPL) 정리 사이클과 대손충당금 환입 규모를 분기별 스트레스 테스트로 사전 검증하여 건전성 우려를 완벽 불식.
• 단순 배당수익률에만 매몰되던 관행적 시각에서 벗어나 자사주 매입·소각에 따른 유통주식수 감소와 주당순자산(BPS) 상승 복리 효과를 수치화.

【3. 2026 하반기 실전 투자 전략 & 포트폴리오 가이드】
• 타깃 밸류에이션: 총주주환원율 40% 도달 및 배당소득 분리과세 법제화 모멘텀을 반영해 Target P/B 0.65배(글로벌 은행 P/B 0.8배 대비 여전히 저평가) 제시.
• 추천 액션: CET1 비율 버퍼가 가장 두터운 최상위 금융지주사를 밸류업 핵심 코어 자산으로 포트폴리오의 30% 이상 비중 유지.
• 리스크 헷지 & 하방 지지선: 한국은행 기준금리 인하에 따른 NIM 축소 우려 발생 시에도 안정적인 비이자이익과 대손비용 감소가 이를 방어하므로 기말 배당락 전후 저가 매수 유효.`,
    fullReport: {
      executiveSummary: "금융지주 자본비율 규제와 주주환원 모델링에서 타의 추종을 불허하는 금융 섹터의 살아있는 전설.",
      targetPriceTracking: "배당수익률과 자사주 소각률을 결합한 총주주환원율 모델로 연간 목표주가 적중도 71.8% 달성.",
      dartConsistency: "DART 경영공시 내 위험가중자산(RWA) 증가율과 순이자마진(NIM) 추이를 97.5%의 정밀도로 예측.",
      timelinessDepth: "부동산 PF 관련 추가 충당금 적립 사이클의 정점을 선제 파악하여 은행주 실적 서프라이즈를 선제 제시.",
      marketHealthContribution: "단순 배당성향에 치중하던 시장 관행을 벗어나, 자본비율 버퍼에 기반한 자사주 소각의 강력한 주당가치 제고 효과 설파.",
      representativeReport: {
        title: "보통주자본비율(CET1) 13% 초과 자본 환원 및 은행 지주 총주주환원율 40% 도달 선도",
        date: "2026-02-27",
        keyThesis: "CET1 비율 13% 초과 자본의 전액 주주환원 룰을 시뮬레이션하여 2026년 주주환원 총액 10조원 시대 도래를 증명."
      },
      h2OutlookAdvice: "기준금리 인하 국면에서의 마진 방어 전략과 비이자이익 체력을 핵심 변수로 확인해야 함.",
      citationText: "한국 금융시장의 질적 도약을 이끈 밸류업 분석의 선구자로서 금융투자의 품격을 높인 공로를 기립니다."
    }
  },
  {
    id: "winner_chemical_park_sungbong",
    rank: 1,
    category: "화학/철강/소재 섹터 최우수 애널리스트 (1위)",
    name: "박성봉",
    brokerName: "하나증권",
    sector: "화학/철강/소재",
    score: 92.66,
    isTarget24: true,
    isAwardExcluded: false,
    awardSuccessionNote: "※ 1위(IBK투자증권, 성명 비공개) 시상 제외에 따른 2위 공식 수상 승계",
    keyReports: [
      "글로벌 철강 롤마진 스프레드 및 한계 화학 설비 구조조정 정밀 추정 (2026.03)",
      "글로벌 인프라 투자와 탄소국경조정제도(CBAM) 철강 마진 스프레드 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 40.4,
      dartAlignment: 95.9,
      activityTimeliness: 92.1,
      logicImpact: 92.5,
    },
    summaryKeywords: ["사이클 최저점의 나침반", "스프레드 팩트체크의 승부사"],
    quantitativeQualitativeAnalysis: `박성봉 연구원은 중국발 공급 과잉 속에서 열연-철광석 롤마진과 에틸렌-나프타 스프레드를 DART 제품별 매출액 공시와 철저히 대조 분석하여 DART 정합도 95.9%, 종합 평점 92.66점을 획득했습니다. 시상 제외 증권사(IBK투자증권) 1위에 이어 대상 24개사 최우수 챔피언으로 공식 수상 승계되었습니다.`,
    marketContributionInsight: `시장 일각의 조기 턴어라운드 낙관론을 경계하고, 범용 대신 스페셜티(고부가가치 소재) 비중 확대 기업만을 선별 추천함으로써 투자자 손실을 철저히 방어했습니다.`,
    honorCitation: `업황의 깊은 겨울 속에서도 글로벌 수급 지표와 스프레드의 엄정한 계산으로 봄을 준비하는 기업을 찾아낸 통찰력에 이 상을 수여합니다.`,
    aiDetailedReview: `【1. DART 정량 실적 팩트체크 & 가중 오차율 산출 내역】
• 분기별 정량 정합도: 포스코홀딩스·현대제철·LG화학의 DART 제품별 매출원가 공시와 글로벌 원자재 현물 가격 래깅 오차율 2.7% 기록.
• 가중 평균 오차율 산출 결과: 1Q~3Q 결합 오차율 2.72%(정합도 95.9점). 업황 침체기 속에서도 1위(IBK투자증권) 시상 제외에 따른 차순위 승계의 정당성을 철저한 팩트로 입증.
• 보수적 통찰: 중국산 저가 열연 및 에틸렌 공급 과잉으로 인한 스프레드 악화를 있는 그대로 공시 대사하여 과열된 턴어라운드 낙관론을 차단.

【2. 글로벌 밸류체인 및 핵심 차별화 역량】
• 유럽 탄소국경조정제도(CBAM) 전면 시행에 대응 가능한 저탄소 전기로 특수강 및 고기능성 엔지니어링 플라스틱(EP)의 기술적 해자를 분석.
• 한계 석유화학 NCC 라인의 가동 중단 및 매각 등 산업 구조조정 일정을 현장 실사로 추적하여 실질 생존 기업을 선별.

【3. 2026 하반기 실전 투자 전략 & 포트폴리오 가이드】
• 타깃 밸류에이션: 역사적 P/B 하단 밴드 0.45배~0.55배 수준에서 밸류에이션 바닥을 형성 중이나, Target P/B 0.7배를 목표로 보수적 접근.
• 추천 액션: 범용 석유화학·철강주의 무차별 추격 매수를 지양하고, 고부가가치 스페셜티 비중이 40%를 넘는 방어적 가치주로 압축 대응.
• 리스크 헷지 & 하방 지지선: 중국 경기 부양책 발표 후 단기 급등 시 차익 실현을 병행하며 분기 배당수익률 4.5% 이상을 배당 하방 안전선으로 활용.`,
    fullReport: {
      executiveSummary: "글로벌 원자재 공급 과잉 속에서 냉정한 스프레드 분석으로 스페셜티 옥석을 가려낸 최고 소재 분석가.",
      targetPriceTracking: "제품별 현물 스프레드의 래깅 반영 주기를 공식화하여 목표가 평균 괴리율을 안정적으로 방어.",
      dartConsistency: "DART 공시 내 품목별 가동률 및 재고평가손익 추정을 95.9%의 정합도로 구현.",
      timelinessDepth: "중국 석유화학 설비 폐쇄 정책 및 동남아 수요 회복세를 발 빠르게 추적.",
      marketHealthContribution: "과거 PBR 바닥론에 기댄 묻지마 매수를 비판하고 구조조정 완결성 중심의 엄격한 선별 기준 제시.",
      representativeReport: {
        title: "글로벌 철강 롤마진 스프레드 및 한계 화학 설비 구조조정 정밀 추정",
        date: "2026-03-30",
        keyThesis: "한계 설비의 통폐합 일정과 친환경·고기능성 엔지니어링 플라스틱의 마진 스프레드를 연결 공시로 실증."
      },
      h2OutlookAdvice: "중국 경기 부양책의 실질 수요 견인 강도와 유럽 탄소국경조정제도(CBAM) 전환 비용 부담률을 추적할 것.",
      citationText: "어려운 시황 속에서도 데이터의 진실을 놓치지 않고 바른길을 안내한 헌신을 높이 평가합니다."
    }
  },
  {
    id: "winner_construction_lee_sangho",
    rank: 1,
    category: "건설/물류/기타 섹터 최우수 애널리스트 (1위)",
    name: "이상호",
    brokerName: "교보증권",
    sector: "건설/물류/기타",
    score: 93.52,
    isTarget24: true,
    isAwardExcluded: false,
    keyReports: [
      "대형 건설사 주택 정비사업 예정원가율 현실화와 충당금 분석 (2026.02)",
      "부동산 PF 우발채무 리스크 점검 및 해외 플랜트 수주 옥석 가리기 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 58.2,
      dartAlignment: 95.6,
      activityTimeliness: 93.8,
      logicImpact: 93.0,
    },
    summaryKeywords: ["교보증권 건설 공인 승계", "DART 예정원가율·PF 우발채무 분석"],
    quantitativeQualitativeAnalysis: `이상호 연구원은 교보증권 리서치센터 건설/부동산 전담 애널리스트로서, 고금리와 원자재가 상승 국면에서 대형 및 중견 건설사의 DART 분기보고서 주석 내 '우발채무 및 PF 신용보강', 예정원가율 재조정을 철저히 팩트체크하여 목표가 적중률 58.2%, DART 실적 정합성 95.6%, 종합 평점 93.52점으로 건설/물류/기타 섹터 1위 챔피언에 올랐습니다.`,
    marketContributionInsight: `건설 부동산 시장 침체기 속에서 무리한 목표주가 인플레이션을 배제하고, 공사 원가율 상승을 선제 반영한 보수적 실적 모델을 제공하여 투자자 리스크 관리에 크게 기여했습니다.`,
    honorCitation: `건설 부동산 시장의 격변기 속에서 DART 재무제표와 공시 분석을 바탕으로 교보증권 건설 하우스의 신뢰를 지켜낸 공로로 최우수 애널리스트 상을 수여합니다.`,
    aiDetailedReview: `【1. DART 정량 실적 팩트체크 & 가중 오차율 산출 내역】
• 분기별 정량 정합도: 국내 주요 10대 건설사의 DART 분기보고서 주석 내 '우발채무 및 PF 신용보강' 잔여분과 예정원가율 조정을 전수 조사하여 DART 정합도 95.6%, 가중오차율 5.2% 기록.
• 가중 평균 오차율 산출 결과: 1Q(20%)+2Q(30%)+3Q(50%) 종합 오차율 5.2%(정합도 95.6점). 목표가 적중률은 58.2%로 건설 섹터 표본 평균(43.5%)을 +14.7%p 상회.
• 특화 팩트체크: 주택 도급 사업장의 원가율 재조정 주기를 1분기 오차 없이 짚어내어 어닝 쇼크를 선제적으로 경고.

【2. 글로벌 밸류체인 및 핵심 차별화 역량】
• 국내 주택 경기 침체에 따른 분양 위험과 공사비 증액 갈등을 현장 데이터로 수치화.
• 체코 원전, 중동 가스 플랜트 등 해외 수주 잔고가 탄탄한 우량 건설사와 물류 인프라 시공 능력을 보유한 최상위 EPC 기업을 엄선.

【3. 2026 하반기 실전 투자 전략 & 포트폴리오 가이드】
• 타깃 밸류에이션: 순현금 재무구조 및 해외 플랜트 수주잔고를 보유한 최우량 건설사에 한해 Target P/E 7.0배 및 P/B 0.65배 적용.
• 추천 액션: 부실 PF 우발채무 잔존 건설사는 철저히 투자 유의로 제외하고, 해외 원전/플랜트 수주 모멘텀을 보유한 대형 건설사로 집중 투자.
• 리스크 헷지 & 하방 지지선: 하반기 준공 현황 및 공사비 정산 타결 시점을 점검하며 순자산가치 대비 과도하게 할인된 종목을 중심으로 분할 매수.`,
    fullReport: {
      executiveSummary: "건설업계 재무 건전성 리스크를 공시 주석 단위로 정밀 추적하여 교보증권 건설 분석의 정통성을 입증한 연구원.",
      targetPriceTracking: "공사원가율 현실화와 실적 가시성을 감안한 보수적 밸류에이션으로 적중률 58.2% 달성.",
      dartConsistency: "DART 공시 내 '우발채무 및 약정사항' 주석의 신용보강 규모를 철저히 정량화(95.6% 정합도).",
      timelinessDepth: "주요 정비사업장 공사비 증액 협상 타결 여부와 해외 대형 수주 파이프라인의 진행률을 기민하게 포착.",
      marketHealthContribution: "실물 분석을 통해 부실 PF 위험을 사전에 경고하며 건설주 리스크 관리에 결정적 역할 수행.",
      representativeReport: {
        title: "대형 건설사 주택 정비사업 예정원가율 현실화와 충당금 분석",
        date: "2026-02-24",
        keyThesis: "주요 대형 건설사의 DART 분기보고서 주석을 전수 대조하여 실질 현금흐름 훼손 위험이 없는 우량주를 선별."
      },
      h2OutlookAdvice: "공공 발주 물량 확대 여부와 해외 원전·플랜트 EPC 마진율 회복 추세를 확인해야 함.",
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
      description: "종합 점수가 소수점 둘째 자리까지 동일할 경우, 평가 기준기(2025.11~2026.10) 제시한 목표주가와 실제 주가의 괴리율 절댓값이 0에 더 가까운(정확도가 높은) 애널리스트를 우선 선정합니다."
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
  isAwardSuccessor?: boolean;
  awardSuccessionNote?: string;
  keyReportTitle: string;
  comment: string;
}

// 10대 표준 산업 섹터별 TOP 10 공식 명단 (총 100명 + 대상 1명 한유정 단독 분리)
export const OFFICIAL_SECTOR_TOP10: Record<string, SectorRankedAnalyst[]> = {
  "소비재/유통/음식료": [
    {
      sectorRank: 1,
      name: "한유정",
      brokerName: "한화투자증권",
      sector: "소비재/유통/음식료",
      totalScore: 97.15,
      metrics: { targetPriceAccuracy: 76.5, dartAlignment: 97.8, weightedErrorRatePct: "2.10%", logicScore: 98.0, riskScore: 96.5, reportCount: 45, snsAndMediaScore: 95.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "K-Food 글로벌 구조적 침투율과 원가 스프레드 역학 분석",
      comment: "👑 2026 대한민국 올해의 애널리스트 종합 대상 & 소비재/유통/음식료 부문 공식 1위 최우수 챔피언"
    },
    {
      sectorRank: 2,
      name: "박상준",
      brokerName: "키움증권",
      sector: "소비재/유통/음식료",
      totalScore: 95.82,
      metrics: { targetPriceAccuracy: 74.2, dartAlignment: 97.6, weightedErrorRatePct: "2.40%", logicScore: 95.1, riskScore: 94.5, reportCount: 32, snsAndMediaScore: 93.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "K-Food 글로벌 구조적 침투율과 해외 법인 공헌이익률 분석",
      comment: "소비재/유통/음식료 부문 2위 (공식 시상 대상 24개사)"
    },
    {
      sectorRank: 3,
      name: "이경신",
      brokerName: "iM증권",
      sector: "소비재/유통/음식료",
      totalScore: 93.10,
      metrics: { targetPriceAccuracy: 71.5, dartAlignment: 96.2, weightedErrorRatePct: "3.80%", logicScore: 93.5, riskScore: 92.0, reportCount: 26, snsAndMediaScore: 91.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "음식료 소재 투입가 안정화와 편의점·대형마트 판관비 효율화",
      comment: "소비재/유통 섹터 3위 (시상 제외 5개사 규정 적용)"
    },
    {
      sectorRank: 4,
      name: "조상훈",
      brokerName: "신한투자증권",
      sector: "소비재/유통/음식료",
      totalScore: 92.40,
      metrics: { targetPriceAccuracy: 69.8, dartAlignment: 95.8, weightedErrorRatePct: "4.20%", logicScore: 92.0, riskScore: 91.5, reportCount: 28, snsAndMediaScore: 90.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "K-베이커리 글로벌 수출 확대와 식자재 유통 밸류체인",
      comment: "소비재/유통 섹터 4위 (공식 시상 대상 24개사)"
    },
    {
      sectorRank: 5,
      name: "김명주",
      brokerName: "한국투자증권",
      sector: "소비재/유통/음식료",
      totalScore: 91.80,
      metrics: { targetPriceAccuracy: 68.4, dartAlignment: 95.4, weightedErrorRatePct: "4.60%", logicScore: 91.0, riskScore: 90.5, reportCount: 24, snsAndMediaScore: 89.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "면세점 내외국인 트래픽 회복과 뷰티 인디 브랜드 수출",
      comment: "소비재/유통 섹터 5위 (시상 제외 5개사 규정 적용)"
    },
    {
      sectorRank: 6,
      name: "남성현",
      brokerName: "IBK투자증권",
      sector: "소비재/유통/음식료",
      totalScore: 90.90,
      metrics: { targetPriceAccuracy: 66.5, dartAlignment: 94.8, weightedErrorRatePct: "5.20%", logicScore: 90.5, riskScore: 89.0, reportCount: 22, snsAndMediaScore: 88.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "백화점 명품 MD 리뉴얼과 e커머스 멤버십 수익성 분석",
      comment: "소비재/유통 섹터 6위 (시상 제외 5개사 규정 적용)"
    },
    {
      sectorRank: 7,
      name: "하희지",
      brokerName: "현대차증권",
      sector: "소비재/유통/음식료",
      totalScore: 90.20,
      metrics: { targetPriceAccuracy: 65.2, dartAlignment: 94.2, weightedErrorRatePct: "5.80%", logicScore: 89.5, riskScore: 88.5, reportCount: 25, snsAndMediaScore: 87.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "가공식품 B2B 급식 채널 마진율과 소스류 북미 통관 데이터",
      comment: "소비재/유통 섹터 7위 (공식 시상 대상 24개사)"
    },
    {
      sectorRank: 8,
      name: "박은정",
      brokerName: "하나증권",
      sector: "소비재/유통/음식료",
      totalScore: 89.60,
      metrics: { targetPriceAccuracy: 64.0, dartAlignment: 93.8, weightedErrorRatePct: "6.20%", logicScore: 88.5, riskScore: 88.0, reportCount: 29, snsAndMediaScore: 87.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "K-뷰티 미국 아마존 매출 순위와 ODM/OEM 캐파 증설",
      comment: "소비재/유통 섹터 8위 (공식 시상 대상 24개사)"
    },
    {
      sectorRank: 9,
      name: "이지은",
      brokerName: "대신증권",
      sector: "소비재/유통/음식료",
      totalScore: 88.90,
      metrics: { targetPriceAccuracy: 63.1, dartAlignment: 93.2, weightedErrorRatePct: "6.80%", logicScore: 88.0, riskScore: 87.0, reportCount: 20, snsAndMediaScore: 86.5 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "대형마트 새벽배송 물류센터 손익분기점(BEP) 경로 분석",
      comment: "소비재/유통 섹터 9위 (시상 제외 5개사 규정 적용)"
    },
    {
      sectorRank: 10,
      name: "오린아",
      brokerName: "LS증권",
      sector: "소비재/유통/음식료",
      totalScore: 88.30,
      metrics: { targetPriceAccuracy: 62.0, dartAlignment: 92.7, weightedErrorRatePct: "7.30%", logicScore: 87.0, riskScore: 86.5, reportCount: 19, snsAndMediaScore: 86.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "유통 플랫폼 버티컬 커머스 수수료 개편과 풀필먼트 수율",
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
      name: "주민우",
      brokerName: "NH투자증권",
      sector: "2차전지/배터리/소재",
      totalScore: 93.40,
      metrics: { targetPriceAccuracy: 60.5, dartAlignment: 95.8, weightedErrorRatePct: "4.20%", logicScore: 94.0, riskScore: 94.0, reportCount: 53, snsAndMediaScore: 93.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "미국 인플레이션감축법(IRA) 보조금 현금흐름과 완성차 재고 소진",
      comment: "2차전지 섹터 🏆 공식 1위 챔피언 (53편 전수 발간 및 DART 정밀 대사)"
    },
    {
      sectorRank: 2,
      name: "이창민",
      brokerName: "KB증권",
      sector: "2차전지/배터리/소재",
      totalScore: 92.90,
      metrics: { targetPriceAccuracy: 47.3, dartAlignment: 95.3, weightedErrorRatePct: "4.70%", logicScore: 93.0, riskScore: 92.5, reportCount: 30, snsAndMediaScore: 92.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "2차전지 신규 소재 공급망 밸류에이션 및 수율 개선",
      comment: "2차전지 섹터 2위"
    },
    {
      sectorRank: 3,
      name: "전창현",
      brokerName: "대신증권",
      sector: "2차전지/배터리/소재",
      totalScore: 92.30,
      metrics: { targetPriceAccuracy: 61.8, dartAlignment: 96.4, weightedErrorRatePct: "3.60%", logicScore: 92.7, riskScore: 92.5, reportCount: 72, snsAndMediaScore: 92.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "캐즘(Chasm) 탈출의 조건: ESS 그리드 수요와 LFP 양산 원가 곡선",
      comment: "2차전지 섹터 3위 (시상 제외 5개사 규정 적용)"
    },
    {
      sectorRank: 4,
      name: "정원석",
      brokerName: "iM증권",
      sector: "2차전지/배터리/소재",
      totalScore: 90.80,
      metrics: { targetPriceAccuracy: 59.4, dartAlignment: 95.2, weightedErrorRatePct: "4.80%", logicScore: 91.0, riskScore: 90.5, reportCount: 25, snsAndMediaScore: 90.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "양극재 판가 스프레드 바닥 확인과 북미 AMPC 귀속 이익",
      comment: "2차전지 섹터 4위 (시상 제외 5개사)"
    },
    {
      sectorRank: 5,
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
      name: "이지호",
      brokerName: "메리츠증권",
      sector: "조선/중공업/방산",
      totalScore: 93.68,
      metrics: { targetPriceAccuracy: 71.4, dartAlignment: 95.4, weightedErrorRatePct: "4.60%", logicScore: 94.5, riskScore: 93.8, reportCount: 24, snsAndMediaScore: 93.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "한화에어로스페이스: K9 자주포 및 천무 다연장로켓 글로벌 수주와 지상방산 마진율 본격화",
      comment: "조선/중공업/방산 부문 🏆 공식 1위 최우수 챔피언 (K-방산 글로벌 수주 랠리 및 DART 정밀 대사)"
    },
    {
      sectorRank: 2,
      name: "곽민정",
      brokerName: "현대차증권",
      sector: "조선/중공업/방산",
      totalScore: 93.45,
      metrics: { targetPriceAccuracy: 52.5, dartAlignment: 95.2, weightedErrorRatePct: "4.80%", logicScore: 94.0, riskScore: 93.5, reportCount: 62, snsAndMediaScore: 92.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "원자력 발전 주기기(SMR) 해외 수출 잔고와 방산/중공업 밸류체인",
      comment: "조선/중공업/방산 섹터 2위 (조선·원전 부문 최우수, 실물 리포트 62편)"
    },
    {
      sectorRank: 3,
      name: "이한결",
      brokerName: "다올투자증권",
      sector: "조선/중공업/방산",
      totalScore: 84.84,
      metrics: { targetPriceAccuracy: 73.1, dartAlignment: 94.5, weightedErrorRatePct: "5.50%", logicScore: 84.6, riskScore: 84.5, reportCount: 28, snsAndMediaScore: 88.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "LNG선 슬롯 프리미엄과 고선가 선박 건조 마진 실현 주기",
      comment: "조선/중공업/방산 섹터 3위"
    },
    {
      sectorRank: 4,
      name: "변용진",
      brokerName: "하이투자증권",
      sector: "조선/중공업/방산",
      totalScore: 84.30,
      metrics: { targetPriceAccuracy: 72.2, dartAlignment: 94.0, weightedErrorRatePct: "6.00%", logicScore: 84.0, riskScore: 84.0, reportCount: 26, snsAndMediaScore: 87.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "K-방산 유럽 폴란드·루마니아 수주잔고와 납기 마일스톤",
      comment: "조선/중공업/방산 섹터 4위"
    },
    {
      sectorRank: 5,
      name: "정동익",
      brokerName: "KB증권",
      sector: "조선/중공업/방산",
      totalScore: 83.80,
      metrics: { targetPriceAccuracy: 71.5, dartAlignment: 93.5, weightedErrorRatePct: "6.50%", logicScore: 83.5, riskScore: 83.5, reportCount: 27, snsAndMediaScore: 87.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "미국 해군 MRO 사업 진출과 함정 특수선 수출 가치 평가",
      comment: "조선/중공업/방산 섹터 5위"
    },
    {
      sectorRank: 6,
      name: "양승윤",
      brokerName: "유진투자증권",
      sector: "조선/중공업/방산",
      totalScore: 83.20,
      metrics: { targetPriceAccuracy: 70.8, dartAlignment: 93.0, weightedErrorRatePct: "7.00%", logicScore: 83.0, riskScore: 83.0, reportCount: 24, snsAndMediaScore: 86.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "전력 인프라 변압기 쇼티지와 미국 노후 전력망 교체 사이클",
      comment: "조선/중공업/방산 섹터 6위"
    },
    {
      sectorRank: 7,
      name: "위경재",
      brokerName: "하나증권",
      sector: "조선/중공업/방산",
      totalScore: 82.70,
      metrics: { targetPriceAccuracy: 70.0, dartAlignment: 92.5, weightedErrorRatePct: "7.50%", logicScore: 82.5, riskScore: 82.2, reportCount: 23, snsAndMediaScore: 86.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "가스선(LPG/암모니아) 추진선 신조 발주와 친환경 엔진",
      comment: "조선/중공업/방산 섹터 7위"
    },
    {
      sectorRank: 8,
      name: "배성조",
      brokerName: "한화투자증권",
      sector: "조선/중공업/방산",
      totalScore: 82.10,
      metrics: { targetPriceAccuracy: 69.2, dartAlignment: 92.0, weightedErrorRatePct: "8.00%", logicScore: 82.0, riskScore: 81.8, reportCount: 25, snsAndMediaScore: 85.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "우주항공 발사체 및 위성 데이터 서비스 신사업 밸류에이션",
      comment: "조선/중공업/방산 섹터 8위"
    },
    {
      sectorRank: 9,
      name: "이동헌",
      brokerName: "신한투자증권",
      sector: "조선/중공업/방산",
      totalScore: 81.60,
      metrics: { targetPriceAccuracy: 68.5, dartAlignment: 91.5, weightedErrorRatePct: "8.50%", logicScore: 81.5, riskScore: 81.2, reportCount: 22, snsAndMediaScore: 85.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "공작기계 스마트 팩토리 로봇 자동화 라인 수주 추이",
      comment: "조선/중공업/방산 섹터 9위"
    },
    {
      sectorRank: 10,
      name: "엄경아",
      brokerName: "신영증권",
      sector: "조선/중공업/방산",
      totalScore: 81.10,
      metrics: { targetPriceAccuracy: 67.8, dartAlignment: 91.0, weightedErrorRatePct: "9.00%", logicScore: 81.0, riskScore: 80.8, reportCount: 21, snsAndMediaScore: 84.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "클락슨 신조선가지수(NPI) 상승세와 도크 슬롯 희소성",
      comment: "조선/중공업/방산 섹터 10위"
    }
  ],
  "플랫폼/게임/엔터": [
    {
      sectorRank: "시상제외" as any,
      name: "이선화",
      brokerName: "KB증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 96.51,
      metrics: { targetPriceAccuracy: 64.5, dartAlignment: 97.2, weightedErrorRatePct: "2.80%", logicScore: 96.3, riskScore: 95.8, reportCount: 32, snsAndMediaScore: 94.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "AI 검색 도입에 따른 플랫폼 체류시간과 커머스 수수료 개편 효과",
      comment: "플랫폼/게임/엔터 평가 1위 (KB증권 퇴사에 따른 시상 제외)",
      awardSuccessionNote: "※ KB증권 퇴사에 따른 시상 제외 및 2위(지인해, 신한투자증권)에게 공식 1위 수상 승계"
    },
    {
      sectorRank: 1,
      name: "지인해",
      brokerName: "신한투자증권",
      sector: "플랫폼/게임/엔터",
      totalScore: 94.49,
      metrics: { targetPriceAccuracy: 68.5, dartAlignment: 96.1, weightedErrorRatePct: "3.90%", logicScore: 94.2, riskScore: 94.0, reportCount: 30, snsAndMediaScore: 93.5 },
      isSectorChampion: true,
      isAwardSuccessor: true,
      isAwardExcluded: false,
      keyReportTitle: "K-POP 글로벌 음원 스트리밍 정산율 인상과 글로벌 팬덤 ARPU",
      comment: "플랫폼/게임/엔터 섹터 공식 1위 최우수 챔피언 (시상 승계)",
      awardSuccessionNote: "※ 1위(이선화, KB증권 퇴사) 시상 제외에 따른 2위 공식 수상 승계"
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
      brokerName: "BNK투자증권",
      sector: "금융/지주",
      totalScore: 96.29,
      metrics: { targetPriceAccuracy: 71.8, dartAlignment: 97.5, weightedErrorRatePct: "2.50%", logicScore: 96.1, riskScore: 95.8, reportCount: 31, snsAndMediaScore: 93.0 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "보통주자본비율(CET1) 관리 목표와 은행 지주 총주주환원율 40% 도달 경로",
      comment: "금융/지주 섹터 1위 최우수 챔피언 (전 유진투자증권)"
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
      name: "[성명 비공개]",
      brokerName: "IBK투자증권",
      sector: "화학/철강/소재",
      totalScore: 90.03,
      metrics: { targetPriceAccuracy: 58.4, dartAlignment: 95.9, weightedErrorRatePct: "4.10%", logicScore: 90.0, riskScore: 89.8, reportCount: 28, snsAndMediaScore: 90.0 },
      isSectorChampion: false,
      isAwardExcluded: true,
      keyReportTitle: "중국 증설 피크와 나프타 분해설비(NCC) 구조조정 마진 회복 시나리오",
      comment: "화학/철강 섹터 1위 (시상 제외 5개사 규정에 따른 성명 비공개 및 2위에게 공식 수상 승계)"
    },
    {
      sectorRank: 2,
      name: "박광래",
      brokerName: "신한투자증권",
      sector: "화학/철강/소재",
      totalScore: 89.50,
      metrics: { targetPriceAccuracy: 57.6, dartAlignment: 95.2, weightedErrorRatePct: "4.80%", logicScore: 89.5, riskScore: 89.2, reportCount: 26, snsAndMediaScore: 89.5 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "글로벌 탄소국경조정제도(CBAM) 철강 마진 스프레드와 전기로 전환",
      comment: "화학/철강 섹터 🏆 공식 1위 챔피언 (1위 IBK투자증권 시상 제외에 따른 승계)"
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
      name: "이상호",
      brokerName: "교보증권",
      sector: "건설/물류/기타",
      totalScore: 93.52,
      metrics: { targetPriceAccuracy: 58.2, dartAlignment: 95.6, weightedErrorRatePct: "5.20%", logicScore: 93.8, riskScore: 93.0, reportCount: 16, snsAndMediaScore: 91.5 },
      isSectorChampion: true,
      isAwardExcluded: false,
      keyReportTitle: "대형 건설사 주택 정비사업 예정원가율 현실화와 충당금 분석",
      comment: "건설/물류/기타 부문 🏆 공식 1위 최우수 챔피언 (교보증권 건설 공인 승계 및 DART 정밀 대사)"
    },
    {
      sectorRank: 2,
      name: "류제현",
      brokerName: "미래에셋증권",
      sector: "건설/물류/기타",
      totalScore: 93.10,
      metrics: { targetPriceAccuracy: 64.8, dartAlignment: 95.2, weightedErrorRatePct: "4.80%", logicScore: 92.5, riskScore: 92.0, reportCount: 34, snsAndMediaScore: 90.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "글로벌 해운 항공 운임지표와 물류 인프라 병목 현상 해소",
      comment: "건설/물류/기타 섹터 2위"
    },
    {
      sectorRank: 3,
      name: "이은상",
      brokerName: "NH투자증권",
      sector: "건설/물류/기타",
      totalScore: 82.60,
      metrics: { targetPriceAccuracy: 61.8, dartAlignment: 93.2, weightedErrorRatePct: "6.80%", logicScore: 79.2, riskScore: 79.0, reportCount: 25, snsAndMediaScore: 85.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "체코 원전 및 중동 가스 플랜트 EPC 해외 수주 파이프라인",
      comment: "건설/물류 섹터 3위"
    },
    {
      sectorRank: 4,
      name: "문경원",
      brokerName: "메리츠증권",
      sector: "건설/물류/기타",
      totalScore: 82.00,
      metrics: { targetPriceAccuracy: 61.0, dartAlignment: 92.6, weightedErrorRatePct: "7.40%", logicScore: 78.8, riskScore: 78.5, reportCount: 24, snsAndMediaScore: 85.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "한국전력 적자 해소와 송배전 전력망 신규 인프라 발주",
      comment: "건설/물류 섹터 4위"
    },
    {
      sectorRank: 5,
      name: "배세호",
      brokerName: "하이투자증권",
      sector: "건설/물류/기타",
      totalScore: 81.40,
      metrics: { targetPriceAccuracy: 60.2, dartAlignment: 92.0, weightedErrorRatePct: "8.00%", logicScore: 78.2, riskScore: 78.0, reportCount: 23, snsAndMediaScore: 84.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "해운 컨테이너 운임지수(SCFI) 변동성과 홍해 물류 희망봉 우회",
      comment: "건설/물류 섹터 5위"
    },
    {
      sectorRank: 6,
      name: "송유림",
      brokerName: "한화투자증권",
      sector: "건설/물류/기타",
      totalScore: 80.80,
      metrics: { targetPriceAccuracy: 59.5, dartAlignment: 91.5, weightedErrorRatePct: "8.50%", logicScore: 77.8, riskScore: 77.5, reportCount: 22, snsAndMediaScore: 84.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "주요 정비사업장 공사비 증액 협상 타결률과 주택 도급 마진",
      comment: "건설/물류 섹터 6위"
    },
    {
      sectorRank: 7,
      name: "신동현",
      brokerName: "현대차증권",
      sector: "건설/물류/기타",
      totalScore: 80.20,
      metrics: { targetPriceAccuracy: 58.8, dartAlignment: 91.0, weightedErrorRatePct: "9.00%", logicScore: 77.2, riskScore: 77.0, reportCount: 21, snsAndMediaScore: 83.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "수도권 광역급행철도(GTX) 및 철도 인프라 민자사업 착공률",
      comment: "건설/물류 섹터 7위"
    },
    {
      sectorRank: 8,
      name: "김기룡",
      brokerName: "미래에셋증권",
      sector: "건설/물류/기타",
      totalScore: 79.60,
      metrics: { targetPriceAccuracy: 58.0, dartAlignment: 90.4, weightedErrorRatePct: "9.60%", logicScore: 76.8, riskScore: 76.5, reportCount: 20, snsAndMediaScore: 83.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "데이터센터 전력 인프라 및 신재생 해상풍력 하부구조물 수주",
      comment: "건설/물류 섹터 8위"
    },
    {
      sectorRank: 9,
      name: "박세라",
      brokerName: "신영증권",
      sector: "건설/물류/기타",
      totalScore: 79.00,
      metrics: { targetPriceAccuracy: 57.2, dartAlignment: 89.8, weightedErrorRatePct: "10.20%", logicScore: 76.2, riskScore: 76.0, reportCount: 19, snsAndMediaScore: 82.5 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "시멘트·레미콘 가격 인상 합의와 원자재 유연탄 수입 단가",
      comment: "건설/물류 섹터 9위"
    },
    {
      sectorRank: 10,
      name: "장문준",
      brokerName: "KB증권",
      sector: "건설/물류/기타",
      totalScore: 78.40,
      metrics: { targetPriceAccuracy: 56.5, dartAlignment: 89.2, weightedErrorRatePct: "10.80%", logicScore: 75.8, riskScore: 75.5, reportCount: 18, snsAndMediaScore: 82.0 },
      isSectorChampion: false,
      isAwardExcluded: false,
      keyReportTitle: "종합 물류 기업의 풀필먼트 자동화 로봇 도입과 택배 단가",
      comment: "건설/물류 섹터 10위"
    }
  ]
};

