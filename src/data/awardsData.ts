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
  reviewDate: "2026년 10월 공인 확정",
  totalReviewedReports: 7842,
  totalReviewedAnalysts: 681,
  totalBrokers: 32,
  dartCrossCheckRatio: "99.8%",
  corePillars: [
    {
      title: "목표주가 적중도 및 주가 괴리율 (35%)",
      desc: "시장 변동성 속에서도 맹목적 상향을 지양하고 현실화 궤적을 철저히 추적",
    },
    {
      title: "투자의견 객관성 및 DART 실적 검증 (25%)",
      desc: "금융감독원 분기/반기 확정 공시 영업이익과의 오차율을 1%p 단위로 교차 검증",
    },
    {
      title: "리포트 발간 활동성 및 시의성 (20%)",
      desc: "업황 변곡점(Peak/Bottom) 직전 선제적 발간 및 독창적 산업 커버리지",
    },
    {
      title: "논리적 완성도 및 시장 영향력 (20%)",
      desc: "단순 뉴스 큐레이션을 초월하여 기관 및 개인 투자자의 실질 의사결정 견인",
    },
  ],
  chairmanAddress: `「2026 올해의 애널리스트 어워즈」는 관행적인 호평 일색의 리서치 문화를 타파하고, 금융감독원 Open DART 공시 데이터 교차검증과 32개 국내 증권사 7,158건(1~9월 누적 전수)의 실제 리서치 리포트를 정밀 분석한 AI 독립 심사 엔진을 기반으로 최종 선정되었습니다.

2026년 한국 자본시장은 글로벌 공급망 재편과 고금리 잔존 영향으로 그 어느 때보다 섹터별 차별화가 극심했습니다. 이러한 복합 위기 속에서 오직 숫자의 진실성과 산업 펀더멘털에 기초하여 과감한 투자의견을 제시하고, 투자자들에게 나침반이 되어준 10대 표준 섹터별 최우수 애널리스트와 종합 대상 수상자를 발표합니다.

이번 심사는 정량적 괴리율 측정(35%)과 DART 확정 실적 일치도(25%)를 합산 60% 비중으로 두어 실증적 데이터의 정밀함을 증명했으며, 맹목적 매수(Buy) 리포트를 지양하고 위험을 선제 경고한 연구원들에게 높은 가점을 부여했습니다. 자본시장의 건전한 발전을 위해 헌신한 수상자 전원에게 경의를 표합니다.`
};

export const OFFICIAL_WINNERS_REVIEWS: AnalystAwardReview[] = [
  {
    id: "winner_overall_han",
    rank: 1,
    category: "2026 종합 대상 (Grand Prize) & 소비재/유통/음식료 부문 1위",
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
      targetPriceAccuracy: 98.4,
      dartAlignment: 97.8,
      activityTimeliness: 95.9,
      logicImpact: 96.5,
    },
    summaryKeywords: ["데이터 완결성의 정점", "K-Food 글로벌 패러다임 설계자"],
    quantitativeQualitativeAnalysis: `한유정 연구원은 2026년 고물가와 내수 침체 속에서도 DART 분기 공시 영업이익 추정 오차율 2.1%라는 압도적인 정합성을 입증했습니다. 1년 간 제시한 목표주가 도달률 98.4%를 기록했으며, 곡물가 변동과 환율 요소를 분기별 밸류에이션 모델에 오차 없이 반영하여 정량 평가 전 항목에서 1위를 차지했습니다.`,
    marketContributionInsight: `관행적인 내수 방어주 프레임을 깨고, K-Food의 북미/유럽 침투율을 현지 바이어 데이터와 통관 공시로 실증 분석하여 시장의 밸류에이션 눈높이를 재정의했습니다. 과열 국면에서는 냉철한 이익 정점(Peak-out) 리스크를 조기 경고하며 투자자 자산을 보호했습니다.`,
    honorCitation: `숫자의 냉철함과 통찰의 깊이로 자본시장의 지표를 세운 최고의 애널리스트. DART 공시 실적과의 빈틈없는 정합성과 시장을 선도한 혜안은 2026년 대한민국 금융투자업계의 최고 귀감이 되었기에 종합 대상을 헌정합니다.`,
    fullReport: {
      executiveSummary: "불확실성의 파고 속에서 숫자의 정밀함으로 시장을 밝힌 나침반. 681명 전체 애널리스트 중 백분위 상위 0.1% 기록.",
      targetPriceTracking: "과거 1년간 발간한 34편의 커버리지 리포트 중 목표주가 평균 괴리율 3.4% 내 안착. 시장 급변기마다 72시간 이내 목표주가 현실화 리포트를 발간하여 목표가 도달률 98.4% 달성.",
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
      targetPriceAccuracy: 93.8,
      dartAlignment: 92.4,
      activityTimeliness: 93.1,
      logicImpact: 92.6,
    },
    summaryKeywords: ["HBM 생태계 정밀 타격", "반도체 사이클의 냉철한 메스"],
    quantitativeQualitativeAnalysis: `AI 반도체 밸류체인의 기술적 전환기 속에서 HBM 패키징 수율과 공급사별 ASP를 DART 설비투자 공시와 교차 검증하여 목표가 적중률 93.8%를 기록했습니다. 분기 실적 컨센서스가 흔들릴 때마다 오차율 3.2% 미만의 정교한 실적 모델을 제시했습니다.`,
    marketContributionInsight: `시장 전반의 장밋빛 AI 환상에 매몰되지 않고, 범용 메모리 레거시 공정의 가동률 회복 지연 및 테크 마이그레이션 병목 현상을 가감 없이 경고하여 기관 투자자의 헤지 전략에 결정적 기여를 했습니다.`,
    honorCitation: `초미세 공정의 복잡한 퍼즐을 명쾌한 실적 데이터로 풀어낸 반도체 섹터의 나침반. 기술과 숫자를 결합한 입체적 분석력으로 시장의 신뢰를 확립하였기에 최우수 애널리스트 상을 헌정합니다.`,
    fullReport: {
      executiveSummary: "글로벌 테크 패권 경쟁 속에서 기술 격차와 DART 재무제표를 결합한 최고의 반도체 분석관.",
      targetPriceTracking: "HBM 가격 상승분과 레거시 D램 재고평가손익 환입 효과를 분리 산출하여 연간 목표주가 괴리율 5.1%로 방어.",
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
    keyReports: [
      "캐즘(Chasm) 탈출의 조건: ESS 그리드 수요와 LFP 양산 원가 곡선 (2026.03)",
      "양극재 판가 스프레드 바닥 확인과 북미 AMPC 귀속 이익 (2026.06)"
    ],
    metrics: {
      targetPriceAccuracy: 91.9,
      dartAlignment: 93.1,
      activityTimeliness: 91.5,
      logicImpact: 92.7,
    },
    summaryKeywords: ["캐즘을 관통한 밸류에이션 정밀타격", "배터리 팩트 체크 수호자"],
    quantitativeQualitativeAnalysis: `전기차 캐즘 장기화 속에서도 리튬·니켈 메탈가와 연동된 판가 하락을 선제적으로 재무제표에 반영, 증권가 평균 괴리율(28%) 대비 현저히 낮은 6.2%의 목표가 괴리율을 달성하며 점수 92.30점을 획득했습니다.`,
    marketContributionInsight: `시장 과열기의 무조건적 반등 기대감을 배제하고, 미국 AMPC 보조금의 현금 유입 시차와 완성차 재고 소진 속도를 DART 연결재무제표로 낱낱이 해부하여 투자자들에게 현실적인 바닥 통과 시점을 제시했습니다.`,
    honorCitation: `감정이 지배하던 2차전지 시장에 냉철한 원가 스프레드와 공시 데이터의 잣대를 들이댄 용기 있는 연구자. 시장의 과열과 비관 속에서 균형 잡힌 시각을 견지한 공로로 본 상을 수여합니다.`,
    fullReport: {
      executiveSummary: "변동성의 소용돌이 속에서 오직 메탈 가격과 DART 연결공시 수치로 캐즘을 돌파한 정통파 애널리스트.",
      targetPriceTracking: "메탈 가격 래깅 타임(Lagging Time)을 수식화하여 분기별 ASP 궤적을 91.9% 정확도로 추적.",
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
      targetPriceAccuracy: 88.5,
      dartAlignment: 89.2,
      activityTimeliness: 86.8,
      logicImpact: 87.1,
    },
    summaryKeywords: ["완성차 피크아웃 반박의 선구자", "주주환원 밸류업의 선봉장"],
    quantitativeQualitativeAnalysis: `글로벌 완성차의 피크아웃 우려 속에서도 HEV(하이브리드) 비중 확대에 따른 평균판매단가(ASP) 방어를 DART 분기 매출원가율로 증명, 목표주가 적중률 88.5%와 점수 87.91점을 달성했습니다.`,
    marketContributionInsight: `단순 판매 대수 지표에 얽매이지 않고, 인센티브(판매장려금) 집행 추이와 완성차의 밸류업 프로그램(자사주 소각, 배당성향)을 종합 연계하여 국내 자동차 섹터의 재평가(Re-rating)를 주도했습니다.`,
    honorCitation: `글로벌 자동차 산업의 격변기 속에서 믹스 개선과 현금흐름의 본질을 짚어내며 시장의 편견을 뒤집은 모빌리티 분야 최고 권위자에게 최우수 애널리스트 상을 수여합니다.`,
    fullReport: {
      executiveSummary: "시장 컨센서스를 선도하는 하이브리드 고수익성 모델링과 주주환원율 계량 분석의 일인자.",
      targetPriceTracking: "북미/인도 시장 현지 생산 거점별 마진율을 반영하여 목표가 괴리율을 6% 이내로 안정적 유지.",
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
      targetPriceAccuracy: 85.3,
      dartAlignment: 84.9,
      activityTimeliness: 84.6,
      logicImpact: 84.6,
    },
    summaryKeywords: ["슈퍼사이클 도크의 정밀 항해사", "K-방산 수출잔고 해부학"],
    quantitativeQualitativeAnalysis: `조선소 도크(Dock)별 고선가 선박 건조 믹스를 DART 분기보고서 공사손실충당금 환입 내역과 매칭하여 실적 턴어라운드를 정확히 예측, 84.84점의 뛰어난 평가를 받았습니다.`,
    marketContributionInsight: `방산 수주잔고의 실제 납기(Delivery) 스케줄과 수출입은행 금융지원 조건을 면밀히 분석하여, 단순 MOU와 본계약의 차이를 명확히 구분하는 등 시장의 신뢰성 제고에 크게 기여했습니다.`,
    honorCitation: `오랜 침체를 딛고 일어선 조선·방산 슈퍼사이클의 긴 호흡을 도크의 현장 데이터와 공시로 입증한 탁월한 연구자에게 이 상을 수여합니다.`,
    fullReport: {
      executiveSummary: "조선소 건조 스케줄과 방산 납품 마일스톤을 공시로 정밀 추적한 중공업 섹터의 표준.",
      targetPriceTracking: "클락슨 신조선가지수와 도크 슬롯 잔여기간을 결합한 3개년 선가 모델로 적중률 85.3% 기록.",
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
      targetPriceAccuracy: 97.2,
      dartAlignment: 96.1,
      activityTimeliness: 96.4,
      logicImpact: 96.3,
    },
    summaryKeywords: ["AI 에이전트 전환기 통찰", "팬덤 이코노미 데이터 분석의 마스터"],
    quantitativeQualitativeAnalysis: `플랫폼 포털의 AI 검색 융합에 따른 광고 전환율과 글로벌 엔터 팬덤 ARPU(가입자당 평균매출)를 완벽히 계량화하여 전체 2위에 해당하는 96.51점의 높은 종합 점수를 획득했습니다.`,
    marketContributionInsight: `엔터테인먼트 산업의 단순 앨범 판매량 하락 공포를 글로벌 음원 스트리밍 매출 및 투어 MD 마진의 구조적 성장으로 반박하여 기관 투자자의 저가 매수 결단을 견인했습니다.`,
    honorCitation: `무형자산과 트래픽이라는 까다로운 플랫폼 지표를 명확한 숫자로 실체화하고, 콘텐츠 산업의 글로벌 가치를 증명한 선도적 분석가에게 최우수상을 수여합니다.`,
    fullReport: {
      executiveSummary: "디지털 전환과 K-컬처 글로벌 확장의 핵심 지표를 가장 날카롭게 포착한 독보적 플랫폼 연구원.",
      targetPriceTracking: "글로벌 빅테크 멀티플과 비교한 엄격한 SOTP(사업별 합산 밸류에이션)로 목표가 적중률 97.2% 달성.",
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
      targetPriceAccuracy: 96.8,
      dartAlignment: 96.5,
      activityTimeliness: 95.8,
      logicImpact: 96.1,
    },
    summaryKeywords: ["밸류업 프로그램의 설계자", "CET1 비율과 주주환원의 나침반"],
    quantitativeQualitativeAnalysis: `금융지주의 핵심 자본적정성 지표인 보통주자본(CET1) 비율과 대손비용률(CCR)을 DART 분기 경영공시와 오차 없이 결합 분석하여 종합 96.29점(섹터 1위, 전체 3위)을 기록했습니다.`,
    marketContributionInsight: `정부 밸류업 가이드라인 발표 이전부터 자사주 매입·소각을 통한 주당순자산(BPS) 증대 경로를 역설, 은행주의 만년 저평가(Korea Discount) 해소를 실증적으로 입증했습니다.`,
    honorCitation: `대한민국 금융주의 자본 정책과 주주환원의 새 장을 연 밸류업 분석의 최고봉. 금융지주의 건전성과 주주가치를 완벽히 조화시킨 혜안에 경의를 표하며 최우수 애널리스트 상을 수여합니다.`,
    fullReport: {
      executiveSummary: "금융지주 자본비율 규제와 주주환원 모델링에서 타의 추종을 불허하는 금융 섹터의 살아있는 전설.",
      targetPriceTracking: "배당수익률과 자사주 소각률을 결합한 총주주환원율 모델로 연간 목표주가 적중도 96.8% 달성.",
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
    keyReports: [
      "중국 증설 피크와 나프타 분해설비(NCC) 구조조정 마진 회복 시나리오 (2026.03)",
      "글로벌 인프라 투자와 탄소국경조정제도(CBAM) 철강 마진 스프레드 (2026.05)"
    ],
    metrics: {
      targetPriceAccuracy: 89.8,
      dartAlignment: 90.4,
      activityTimeliness: 89.9,
      logicImpact: 90.0,
    },
    summaryKeywords: ["사이클 최저점의 나침반", "스프레드 팩트체크의 승부사"],
    quantitativeQualitativeAnalysis: `중국발 증설 압박으로 침체된 화학·철강 섹터에서 에틸렌-나프타 스프레드 및 열연-철광석 롤마진을 DART 제품별 매출액 공시와 철저히 대조하여 90.03점을 달성했습니다.`,
    marketContributionInsight: `시장 일각의 조기 턴어라운드 낙관론을 경계하고, 범용 플라스틱 대신 스페셜티(고부가가치 소재) 비중 확대 기업만을 선별 추천함으로써 투자자 손실을 철저히 방어했습니다.`,
    honorCitation: `업황의 깊은 겨울 속에서도 글로벌 수급 지표와 스프레드의 엄정한 계산으로 봄을 준비하는 기업을 찾아낸 통찰력에 이 상을 수여합니다.`,
    fullReport: {
      executiveSummary: "글로벌 원자재 공급 과잉 속에서 냉정한 스프레드 분석으로 스페셜티 옥석을 가려낸 최고 소재 분석가.",
      targetPriceTracking: "제품별 현물 스프레드의 래깅 반영 주기를 공식화하여 목표가 괴리율 7% 이내 선방.",
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
      targetPriceAccuracy: 80.2,
      dartAlignment: 79.9,
      activityTimeliness: 79.5,
      logicImpact: 79.8,
    },
    summaryKeywords: ["원가율 정상화의 파수꾼", "해외 플랜트·물류 턴어라운드"],
    quantitativeQualitativeAnalysis: `고금리와 원자재 가격 상승으로 얼어붙은 건설 섹터에서 미착공 PF 우발채무와 주택 도급 사업장의 예정원가율 조정을 DART 주석 공시로 낱낱이 파헤쳐 79.86점으로 섹터 1위를 차지했습니다.`,
    marketContributionInsight: `부실 PF 사업장 정리 국면에서 무리한 저가 매수를 차단하고, 체코 원전 및 중동 플랜트 등 해외 수주 잔고가 탄탄한 우량 건설사와 물류 인프라 기업으로 시장의 포트폴리오를 전환시켰습니다.`,
    honorCitation: `건설 부동산 시장의 격변기 속에서 DART 재무제표 주석 뒤에 숨겨진 PF 우발채무의 실체를 밝히고 건전한 투자를 견인한 공로로 최우수 애널리스트 상을 헌정합니다.`,
    fullReport: {
      executiveSummary: "건설업계 재무 건전성 리스크를 공시 주석 단위로 팩트체크하여 시장의 신뢰를 지켜낸 최고의 건설 분석가.",
      targetPriceTracking: "공사원가율 현실화와 충당금 선반영 효과를 감안한 보수적 밸류에이션으로 적중률 80.2% 달성.",
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

// 동점자 처리 기준 5대 원칙 (공식 확정 규정)
export const TIE_BREAKER_POLICY = {
  title: "2026 올해의 애널리스트 어워즈 동점자 처리 및 순위 결정 기준",
  subtitle: "평가 점수 동점 발생 시 100% 결정론적 AI 심사 5단계 판정 알고리즘",
  rules: [
    {
      priority: 1,
      name: "목표주가 적중도 및 주가 괴리율 (가중치 35%)",
      description: "종합 점수가 소수점 둘째 자리까지 동일할 경우, 1년간 제시한 목표주가 도달률이 더 높고 괴리율이 낮은 애널리스트를 우선 선정합니다."
    },
    {
      priority: 2,
      name: "투자의견 객관성 및 DART 실적 검증 (가중치 25%)",
      description: "1순위가 동일한 경우, 금융감독원 DART 분기/반기 확정 공시 영업이익 대비 사전 추정 오차율이 더 낮은(정합성이 높은) 애널리스트를 우선합니다."
    },
    {
      priority: 3,
      name: "리포트 논리적 완성도 및 리스크 분석 (가중치 20%)",
      description: "2순위가 동일한 경우, 리포트 내 팩트 기반 데이터 뎁스(Depth) 및 역발상 위험 경고(Contrarian Score) 점수가 높은 연구원을 우선합니다."
    },
    {
      priority: 4,
      name: "리포트 발간 활동성 및 커버리지 (가중치 20%)",
      description: "3순위가 동일한 경우, 해당 평가 기간 내 정규 발간 리포트 총 편수 및 커버리지 종목 수가 더 다양한 연구원을 우대합니다."
    },
    {
      priority: 5,
      name: "시장 건전성 기여도 및 발간 리포트 총 조회/다운로드 수",
      description: "모든 항목이 동일할 경우, 기관 및 일반 투자자의 실질 의사결정에 기여한 리포트 열람 수치와 맹목적 매수 탈피도를 최종 판단 기준으로 삼습니다."
    }
  ]
};
