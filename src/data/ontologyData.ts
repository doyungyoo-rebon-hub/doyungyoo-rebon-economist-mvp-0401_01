export type NodeType = 'sector' | 'company' | 'analyst' | 'report_chunk' | 'dart_fact' | 'risk_factor';

export interface OntologyNode {
  id: string;
  type: NodeType;
  label: string;
  subLabel?: string;
  category?: string;
  group?: string;
  val: number; // Node importance / size
  color?: string;
  properties: Record<string, any>;
}

export interface OntologyEdge {
  id: string;
  source: string;
  target: string;
  relation: 
    | 'SUPPLIES_TO' 
    | 'COMPETES_WITH' 
    | 'COVERED_BY' 
    | 'FACT_CHECKED_WITH' 
    | 'PREDICTS' 
    | 'EXPOSES_RISK' 
    | 'BELONGS_TO'
    | 'OUTPERFORMS';
  label: string;
  weight?: number;
  direction?: 'forward' | 'bidirectional';
  meta?: Record<string, any>;
}

export interface KnowledgeGraphData {
  nodes: OntologyNode[];
  edges: OntologyEdge[];
  stats: {
    totalSectors: number;
    totalCompanies: number;
    totalAnalysts: number;
    totalReportChunks: number;
    totalDartFacts: number;
    totalRiskFactors: number;
    totalRelations: number;
  };
}

// 1. 한국 주식시장 핵심 섹터 노드
export const ONTOLOGY_SECTORS: OntologyNode[] = [
  {
    id: 'sec_semi',
    type: 'sector',
    label: '반도체 & HBM AI 가속기',
    subLabel: '시총 비중 28.4% · 리포트 2,340건',
    category: 'IT/전기전자',
    group: 'sector',
    val: 45,
    color: '#3b82f6',
    properties: {
      code: 'SEMI',
      totalReports: 2340,
      activeAnalysts: 64,
      avgAccuracy: 88.4,
      keyDriver: 'HBM3E/HBM4 엔비디아 탑재 및 커스텀 AI 칩 수주 사이클',
      macroRisk: '레거시 메모리 수요 둔화 및 중국 CXMT 공급과잉 우려',
      dartAlignmentAvg: '99.2%'
    }
  },
  {
    id: 'sec_battery',
    type: 'sector',
    label: '2차전지 & 친환경 모빌리티',
    subLabel: '시총 비중 11.2% · 리포트 1,480건',
    category: '소재/에너지',
    group: 'sector',
    val: 38,
    color: '#10b981',
    properties: {
      code: 'BATTERY',
      totalReports: 1480,
      activeAnalysts: 42,
      avgAccuracy: 79.6,
      keyDriver: '북미 IRA 첨단제조 세액공제(AMPC) 및 LFP/전고체 R&D 가속',
      macroRisk: '전기차 캐즘(Chasm) 장기화 및 메탈(리튬·니켈) 가격 변동성',
      dartAlignmentAvg: '98.7%'
    }
  },
  {
    id: 'sec_bio',
    type: 'sector',
    label: '바이오 & 제약 / CDMO',
    subLabel: '시총 비중 9.5% · 리포트 1,120건',
    category: '헬스케어',
    group: 'sector',
    val: 35,
    color: '#8b5cf6',
    properties: {
      code: 'BIO',
      totalReports: 1120,
      activeAnalysts: 36,
      avgAccuracy: 84.1,
      keyDriver: '미국 생물보안법(Biosecure Act) 수혜 및 글로벌 대형 기술수출(L/O)',
      macroRisk: 'FDA 임상 지연 및 마일스톤 유입 불확실성',
      dartAlignmentAvg: '99.4%'
    }
  },
  {
    id: 'sec_defense',
    type: 'sector',
    label: '방산 & 항공우주',
    subLabel: '시총 비중 6.8% · 리포트 840건',
    category: '기계/중공업',
    group: 'sector',
    val: 32,
    color: '#f59e0b',
    properties: {
      code: 'DEFENSE',
      totalReports: 840,
      activeAnalysts: 28,
      avgAccuracy: 92.6,
      keyDriver: '동유럽·중동 K-방산 수주잔고 급증 및 다연장·자주포 양산',
      macroRisk: '현지화 생산 조건 및 환율 변동성',
      dartAlignmentAvg: '99.9%'
    }
  },
  {
    id: 'sec_auto',
    type: 'sector',
    label: '자동차 & 미래 SDV',
    subLabel: '시총 비중 8.1% · 리포트 980건',
    category: '운송장비',
    group: 'sector',
    val: 32,
    color: '#06b6d4',
    properties: {
      code: 'AUTO',
      totalReports: 980,
      activeAnalysts: 31,
      avgAccuracy: 89.2,
      keyDriver: '하이브리드(HEV) 고수익성 믹스 개선 및 주주환원 밸류업',
      macroRisk: '글로벌 관세 인상 우려 및 인센티브 증가',
      dartAlignmentAvg: '99.6%'
    }
  },
  {
    id: 'sec_finance',
    type: 'sector',
    label: '금융지주 & 밸류업 프로그램',
    subLabel: '시총 비중 10.4% · 리포트 1,020건',
    category: '금융/은행',
    group: 'sector',
    val: 34,
    color: '#ec4899',
    properties: {
      code: 'FINANCE',
      totalReports: 1020,
      activeAnalysts: 33,
      avgAccuracy: 91.5,
      keyDriver: '자사주 소각, 배당성향 50% 확대, CET1 비율 기반 주주환원',
      macroRisk: 'PF 대출 부실 잔존 및 기준금리 인하에 따른 NIM 축소',
      dartAlignmentAvg: '99.8%'
    }
  }
];

// 2. 기업 노드 (대장주 + 밸류체인 소부장)
export const ONTOLOGY_COMPANIES: OntologyNode[] = [
  // 반도체
  {
    id: 'comp_000660',
    type: 'company',
    label: 'SK하이닉스',
    subLabel: '000660 · HBM 글로벌 1위',
    category: '반도체',
    group: 'company',
    val: 40,
    color: '#60a5fa',
    properties: {
      code: '000660',
      sector: '반도체 & HBM AI 가속기',
      hbmRole: 'HBM3E 8단/12단 독점 공급사',
      marketCap: '142조원',
      pe: 7.2,
      analystCoverageCount: 52,
      avgTargetPrice: 248000,
      dartOpProfit2026Q3: '7조 3,000억원 (흑자 대폭 확대)',
      dartFilingNo: '20261028000412'
    }
  },
  {
    id: 'comp_005930',
    type: 'company',
    label: '삼성전자',
    subLabel: '005930 · 메모리 & 파운드리',
    category: '반도체',
    group: 'company',
    val: 42,
    color: '#3b82f6',
    properties: {
      code: '005930',
      sector: '반도체 & HBM AI 가속기',
      hbmRole: 'HBM3E 엔비디아 퀄 테스트 및 HBM4 턴키 공급 준비',
      marketCap: '380조원',
      pe: 11.4,
      analystCoverageCount: 58,
      avgTargetPrice: 84000,
      dartOpProfit2026Q3: '9조 1,800억원',
      dartFilingNo: '20261030000199'
    }
  },
  {
    id: 'comp_042700',
    type: 'company',
    label: '한미반도체',
    subLabel: '042700 · TC 본더 독점',
    category: '반도체 장비',
    group: 'company',
    val: 28,
    color: '#93c5fd',
    properties: {
      code: '042700',
      sector: '반도체 & HBM AI 가속기',
      supplyTier: 'Tier-1 핵심 후공정 장비',
      keyProduct: 'DUAL TC BONDER 1.0 Griffin / Dragon',
      majorClient: 'SK하이닉스, 마이크론',
      avgTargetPrice: 195000,
      dartFilingNo: '20261022000301'
    }
  },
  {
    id: 'comp_403870',
    type: 'company',
    label: 'HPSP',
    subLabel: '403870 · 고압 수소 어닐링',
    category: '반도체 장비',
    group: 'company',
    val: 24,
    color: '#93c5fd',
    properties: {
      code: '403870',
      sector: '반도체 & HBM AI 가속기',
      supplyTier: '선단공정 미세화 핵심 장비',
      keyProduct: 'High-Pressure Hydrogen Annealing',
      majorClient: 'TSMC, 삼성전자, 인텔',
      avgTargetPrice: 58000,
      dartFilingNo: '20261015000214'
    }
  },
  {
    id: 'comp_058470',
    type: 'company',
    label: '리노공업',
    subLabel: '058470 · 테스트 핀/소켓',
    category: '반도체 부품',
    group: 'company',
    val: 22,
    color: '#93c5fd',
    properties: {
      code: '058470',
      sector: '반도체 & HBM AI 가속기',
      supplyTier: '온디바이스 AI AP 테스트 소켓 독점력',
      keyProduct: 'LEENO PIN, IC TEST SOCKET',
      majorClient: '퀄컴, 애플, 엔비디아',
      avgTargetPrice: 260000,
      dartFilingNo: '20261018000089'
    }
  },

  // 2차전지
  {
    id: 'comp_373220',
    type: 'company',
    label: 'LG에너지솔루션',
    subLabel: '373220 · 글로벌 배터리 1위권',
    category: '2차전지',
    group: 'company',
    val: 36,
    color: '#34d399',
    properties: {
      code: '373220',
      sector: '2차전지 & 친환경 모빌리티',
      marketCap: '92조원',
      pe: 45.2,
      majorClient: '테슬라, GM, 현대차',
      avgTargetPrice: 470000,
      dartFilingNo: '20261025000512'
    }
  },
  {
    id: 'comp_247540',
    type: 'company',
    label: '에코프로비엠',
    subLabel: '247540 · 하이니켈 양극재',
    category: '2차전지 소재',
    group: 'company',
    val: 26,
    color: '#6ee7b7',
    properties: {
      code: '247540',
      sector: '2차전지 & 친환경 모빌리티',
      supplyTier: 'Tier-1 양극재 주력 공급사',
      majorClient: '삼성SDI, SK온',
      avgTargetPrice: 215000,
      dartFilingNo: '20261021000188'
    }
  },

  // 바이오
  {
    id: 'comp_207940',
    type: 'company',
    label: '삼성바이오로직스',
    subLabel: '207940 · 글로벌 CDMO 1위',
    category: '바이오',
    group: 'company',
    val: 35,
    color: '#a78bfa',
    properties: {
      code: '207940',
      sector: '바이오 & 제약 / CDMO',
      marketCap: '71조원',
      pe: 62.0,
      keyAdvantage: '1~4공장 풀가동 및 5공장 조기 가동, ADC 생산시설 확보',
      avgTargetPrice: 1150000,
      dartFilingNo: '20261024000311'
    }
  },
  {
    id: 'comp_196170',
    type: 'company',
    label: '알테오젠',
    subLabel: '196170 · SC 제형변경 플랫폼',
    category: '바이오 플랫폼',
    group: 'company',
    val: 30,
    color: '#c4b5fd',
    properties: {
      code: '196170',
      sector: '바이오 & 제약 / CDMO',
      keyAdvantage: '하이브로자임(ALT-B4) 키트루다 독점 라이선스 계약',
      avgTargetPrice: 490000,
      dartFilingNo: '20261019000045'
    }
  },

  // 방산
  {
    id: 'comp_012450',
    type: 'company',
    label: '한화에어로스페이스',
    subLabel: '012450 · K-방산 종합 총괄',
    category: '방산/항공',
    group: 'company',
    val: 32,
    color: '#fbbf24',
    properties: {
      code: '012450',
      sector: '방산 & 항공우주',
      keyProduct: 'K9 자주포, 천무, 항공기 엔진',
      orderBacklog: '30조원 돌파',
      avgTargetPrice: 380000,
      dartFilingNo: '20261027000215'
    }
  },
  {
    id: 'comp_064350',
    type: 'company',
    label: '현대로템',
    subLabel: '064350 · K2 전차 폴란드 수주',
    category: '방산/철도',
    group: 'company',
    val: 28,
    color: '#fcd34d',
    properties: {
      code: '064350',
      sector: '방산 & 항공우주',
      keyProduct: 'K2 흑표 전차 2차 이행계약 체결 가시화',
      avgTargetPrice: 65000,
      dartFilingNo: '20261026000109'
    }
  },

  // 자동차 & 금융
  {
    id: 'comp_005380',
    type: 'company',
    label: '현대차',
    subLabel: '005380 · 인도법인 상장 & 하이브리드',
    category: '자동차',
    group: 'company',
    val: 34,
    color: '#22d3ee',
    properties: {
      code: '005380',
      sector: '자동차 & 미래 SDV',
      marketCap: '54조원',
      dividendYield: '5.8%',
      avgTargetPrice: 310000,
      dartFilingNo: '20261029000230'
    }
  },
  {
    id: 'comp_105560',
    type: 'company',
    label: 'KB금융',
    subLabel: '105560 · 밸류업 대장주',
    category: '금융지주',
    group: 'company',
    val: 32,
    color: '#f472b6',
    properties: {
      code: '105560',
      sector: '금융지주 & 밸류업 프로그램',
      keyAdvantage: 'CET1 13.5% 초과 자본 전액 자사주 매입/소각 발표',
      avgTargetPrice: 110000,
      dartFilingNo: '20261025000177'
    }
  }
];

// 3. 핵심 애널리스트 노드 (343명 중 분야별 대표 연구원)
export const ONTOLOGY_ANALYSTS: OntologyNode[] = [
  {
    id: 'anl_kim_dongwon',
    type: 'analyst',
    label: '김동원 연구위원',
    subLabel: 'KB증권 · 반도체/디스플레이',
    category: '애널리스트',
    group: 'analyst',
    val: 30,
    color: '#38bdf8',
    properties: {
      name: '김동원',
      broker: 'KB증권',
      sector: '반도체 & HBM AI 가속기',
      totalReports: 78,
      accuracyScore: 96.8,
      dartAlignment: 99.4,
      biasType: '신중형(Conservative)',
      optimismScore: 4.8, // 1~10 (낮을수록 보수적 팩트 기반)
      hitRate: '88.5%',
      topPick: 'SK하이닉스, 삼성전자',
      keyThesisCitation: 'HBM3E 공급 과부족 및 8단·12단 엔비디아 공급 타임라인 적중'
    }
  },
  {
    id: 'anl_lee_seunghoon',
    type: 'analyst',
    label: '이승훈 수석연구위원',
    subLabel: '신한투자증권 · 반도체 장비',
    category: '애널리스트',
    group: 'analyst',
    val: 26,
    color: '#38bdf8',
    properties: {
      name: '이승훈',
      broker: '신한투자증권',
      sector: '반도체 & HBM AI 가속기',
      totalReports: 62,
      accuracyScore: 94.2,
      dartAlignment: 98.9,
      biasType: '균형형(Balanced)',
      optimismScore: 5.4,
      hitRate: '84.0%',
      topPick: '한미반도체, HPSP',
      keyThesisCitation: '본더 장비의 마이크론 진출 및 하이브리드 본딩 전환 선제 분석'
    }
  },
  {
    id: 'anl_jung_wonseok',
    type: 'analyst',
    label: '정원석 연구위원',
    subLabel: '하이투자증권 · 2차전지',
    category: '애널리스트',
    group: 'analyst',
    val: 25,
    color: '#34d399',
    properties: {
      name: '정원석',
      broker: '하이투자증권',
      sector: '2차전지 & 친환경 모빌리티',
      totalReports: 51,
      accuracyScore: 92.4,
      dartAlignment: 99.1,
      biasType: '역발상형(Contrarian)',
      optimismScore: 3.2, // 낙관론 배제, 냉정한 밸류에이션 분석가
      hitRate: '86.2%',
      topPick: 'LG에너지솔루션 (보수적 목표가 유지)',
      keyThesisCitation: '전기차 캐즘에 따른 가동률 저하 및 실적 하향을 가장 먼저 경고'
    }
  },
  {
    id: 'anl_kwon_haesoon',
    type: 'analyst',
    label: '권해순 이사',
    subLabel: '유진투자증권 · 바이오/헬스케어',
    category: '애널리스트',
    group: 'analyst',
    val: 26,
    color: '#c084fc',
    properties: {
      name: '권해순',
      broker: '유진투자증권',
      sector: '바이오 & 제약 / CDMO',
      totalReports: 49,
      accuracyScore: 95.1,
      dartAlignment: 99.6,
      biasType: '신중형(Conservative)',
      optimismScore: 4.5,
      hitRate: '89.1%',
      topPick: '알테오젠, 삼성바이오로직스',
      keyThesisCitation: 'ALT-B4 글로벌 기술수출 가치 정량화 및 파이프라인 NPV 정확도 1위'
    }
  },
  {
    id: 'anl_lee_hankyul',
    type: 'analyst',
    label: '이한결 연구위원',
    subLabel: '키움증권 · 방위산업',
    category: '애널리스트',
    group: 'analyst',
    val: 25,
    color: '#fbbf24',
    properties: {
      name: '이한결',
      broker: '키움증권',
      sector: '방산 & 항공우주',
      totalReports: 44,
      accuracyScore: 97.2,
      dartAlignment: 99.8,
      biasType: '균형형(Balanced)',
      optimismScore: 6.0,
      hitRate: '93.2%',
      topPick: '한화에어로스페이스, 현대로템',
      keyThesisCitation: '폴란드 2차 계약 납기 일정 및 수출 마진율 DART 분기 공시와 99% 일치'
    }
  },
  {
    id: 'anl_choi_jeonguk',
    type: 'analyst',
    label: '최정욱 팀장',
    subLabel: '하나증권 · 은행/금융',
    category: '애널리스트',
    group: 'analyst',
    val: 25,
    color: '#f472b6',
    properties: {
      name: '최정욱',
      broker: '하나증권',
      sector: '금융지주 & 밸류업 프로그램',
      totalReports: 58,
      accuracyScore: 94.8,
      dartAlignment: 99.7,
      biasType: '신중형(Conservative)',
      optimismScore: 4.9,
      hitRate: '87.5%',
      topPick: 'KB금융, 신한지주',
      keyThesisCitation: '자본비율 민감도와 주주환원율 상관분석 모델 제공'
    }
  }
];

// 4. 거시 리스크 및 카탈리스트 노드
export const ONTOLOGY_RISK_FACTORS: OntologyNode[] = [
  {
    id: 'risk_hbm_competition',
    type: 'risk_factor',
    label: 'HBM4 기술 규격 & 3사 경쟁 심화',
    subLabel: '파운드리 베이스다이 협업 리스크',
    category: '기술 경쟁',
    group: 'risk',
    val: 20,
    color: '#ef4444',
    properties: {
      affectedSectors: ['반도체 & HBM AI 가속기'],
      impactLevel: 'High',
      description: 'HBM4부터 TSMC 및 첨단 파운드리 공정 적용에 따른 후공정 본딩 난이도 급상승 및 마진 배분 문제'
    }
  },
  {
    id: 'risk_ev_chasm',
    type: 'risk_factor',
    label: '전기차 캐즘(Chasm) 및 OEM 감산',
    subLabel: '글로벌 완성차 배터리 투자 속도 조절',
    category: '전방 수요 둔화',
    group: 'risk',
    val: 20,
    color: '#ef4444',
    properties: {
      affectedSectors: ['2차전지 & 친환경 모빌리티'],
      impactLevel: 'Critical',
      description: '유럽 탄소규제 유예 논의 및 북미 설비 가동률 저하에 따른 고정비 부담 가중'
    }
  },
  {
    id: 'risk_biosecure_act',
    type: 'risk_factor',
    label: '미국 생물보안법(Biosecure Act) 입법',
    subLabel: '우시바이오텍 대체 수혜 반사이익',
    category: '글로벌 규제/기회',
    group: 'risk',
    val: 18,
    color: '#10b981',
    properties: {
      affectedSectors: ['바이오 & 제약 / CDMO'],
      impactLevel: 'High Positive Opportunity',
      description: '중국 바이오 기업 배제 시 한국 대형 CDMO(삼성바이오로직스 등)의 수주 잔고 급증 촉매'
    }
  },
  {
    id: 'risk_valueup_governance',
    type: 'risk_factor',
    label: '밸류업 지수 편입 및 세제 인센티브',
    subLabel: '배당소득 분리과세 및 자사주 소각 유도',
    category: '정책 드라이브',
    group: 'risk',
    val: 18,
    color: '#3b82f6',
    properties: {
      affectedSectors: ['금융지주 & 밸류업 프로그램', '자동차 & 미래 SDV'],
      impactLevel: 'Medium High',
      description: '주주가치 제고 공시 우수 기업에 대한 외국인 패시브 자금 순유입 가속화'
    }
  }
];

// 5. 리포트 원문 청크 및 DART 팩트체크 결합 노드 (핵심 9,518건 원문 인덱싱 샘플)
export const ONTOLOGY_REPORT_CHUNKS: OntologyNode[] = [
  {
    id: 'rep_hbm_01',
    type: 'report_chunk',
    label: '[KB] HBM3E 12단 승기 굳히기',
    subLabel: '리포트#9518-KB-001 (2026.09.15)',
    category: '리포트 원문',
    group: 'report',
    val: 16,
    color: '#64748b',
    properties: {
      reportNo: '9518-KB-001',
      analyst: '김동원',
      broker: 'KB증권',
      targetStock: 'SK하이닉스 (000660)',
      targetPrice: 280000,
      actualPriceAtReview: 245000,
      accuracyRate: '92.8%',
      chunkExcerpt: 'SK하이닉스는 12단 HBM3E를 엔비디아에 세계 최초로 양산 공급하며 경쟁사 대비 최소 6개월의 수율 우위를 점유하고 있다. 2026년 3분기 영업이익은 7조원을 상회할 것으로 추정한다.',
      dartFactCheck: 'DART 2026.10.28 공시: 3분기 잠정 영업이익 7조 300억원 일치 (오차율 0.4% 미만)',
      dartFilingId: '20261028000412'
    }
  },
  {
    id: 'rep_bonder_02',
    type: 'report_chunk',
    label: '[신한] 듀얼 TC 본더의 거스를 수 없는 대세',
    subLabel: '리포트#9518-SH-088 (2026.08.20)',
    category: '리포트 원문',
    group: 'report',
    val: 15,
    color: '#64748b',
    properties: {
      reportNo: '9518-SH-088',
      analyst: '이승훈',
      broker: '신한투자증권',
      targetStock: '한미반도체 (042700)',
      targetPrice: 210000,
      actualPriceAtReview: 188000,
      accuracyRate: '89.5%',
      chunkExcerpt: '마이크론과의 HBM3E 전용 TC 본더 추가 수주가 현실화됨에 따라 해외 고객사 다변화가 본격화되고 있다. 연간 영업이익률 40% 초과 달성이 무난하다.',
      dartFactCheck: 'DART 수주공시 2026.09.10: 해외 반도체 제조사향 410억원 본더 공급 계약 확인 완료',
      dartFilingId: '20260910000142'
    }
  },
  {
    id: 'rep_battery_03',
    type: 'report_chunk',
    label: '[하이] 캐즘 국면, 옥석 가리기와 보수적 접근',
    subLabel: '리포트#9518-HI-042 (2026.07.12)',
    category: '리포트 원문',
    group: 'report',
    val: 15,
    color: '#64748b',
    properties: {
      reportNo: '9518-HI-042',
      analyst: '정원석',
      broker: '하이투자증권',
      targetStock: 'LG에너지솔루션 (373220)',
      targetPrice: 420000,
      actualPriceAtReview: 395000,
      accuracyRate: '94.0%',
      chunkExcerpt: '유럽 배터리 합작공장 가동률 저하와 AMPC 세액공제 불확실성을 반영해 투자의견 중립과 함께 목표가를 하향 조정한다. 무리한 설비 증설 리스크 경계 필요.',
      dartFactCheck: 'DART 분기보고서: 유럽 법인 가동률 58% 기록, 애널리스트 경고 논리와 완전 일치',
      dartFilingId: '20260814000329'
    }
  },
  {
    id: 'rep_bio_04',
    type: 'report_chunk',
    label: '[유진] ALT-B4, 머크 키트루다 독점의 경제적 실체',
    subLabel: '리포트#9518-EU-019 (2026.06.30)',
    category: '리포트 원문',
    group: 'report',
    val: 15,
    color: '#64748b',
    properties: {
      reportNo: '9518-EU-019',
      analyst: '권해순',
      broker: '유진투자증권',
      targetStock: '알테오젠 (196170)',
      targetPrice: 480000,
      actualPriceAtReview: 450000,
      accuracyRate: '93.7%',
      chunkExcerpt: '키트루다 SC 변경에 따른 마일스톤 및 로열티 수입은 2026년부터 본격적으로 인식될 것이며 연간 현금 창출력은 바이오텍 사상 최대치가 될 것이다.',
      dartFactCheck: 'DART 기술이전 마일스톤 수령 공시: 2,500만 달러 정밀 수령 확인',
      dartFilingId: '20260718000091'
    }
  }
];

// 온톨로지 엣지 (관계)
export const ONTOLOGY_EDGES: OntologyEdge[] = [
  // 섹터 소속 관계
  { id: 'e_sec_skh', source: 'comp_000660', target: 'sec_semi', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_sec', source: 'comp_005930', target: 'sec_semi', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_hanmi', source: 'comp_042700', target: 'sec_semi', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_hpsp', source: 'comp_403870', target: 'sec_semi', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_leeno', source: 'comp_058470', target: 'sec_semi', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_lges', source: 'comp_373220', target: 'sec_battery', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_ecopro', source: 'comp_247540', target: 'sec_battery', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_sbiologics', source: 'comp_207940', target: 'sec_bio', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_alteogen', source: 'comp_196170', target: 'sec_bio', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_hanwha', source: 'comp_012450', target: 'sec_defense', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_rotem', source: 'comp_064350', target: 'sec_defense', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_hyundai', source: 'comp_005380', target: 'sec_auto', relation: 'BELONGS_TO', label: '소속 섹터' },
  { id: 'e_sec_kb', source: 'comp_105560', target: 'sec_finance', relation: 'BELONGS_TO', label: '소속 섹터' },

  // 공급망 밸류체인 관계 (SUPPLIES_TO)
  { id: 'e_sup_hanmi_skh', source: 'comp_042700', target: 'comp_000660', relation: 'SUPPLIES_TO', label: 'TC 본더 독점 공급', meta: { product: 'Dual TC Bonder' } },
  { id: 'e_sup_hpsp_sec', source: 'comp_403870', target: 'comp_005930', relation: 'SUPPLIES_TO', label: '고압 수소 어닐링 장비 납품', meta: { share: '85%' } },
  { id: 'e_sup_ecopro_lges', source: 'comp_247540', target: 'comp_373220', relation: 'SUPPLIES_TO', label: '하이니켈 양극재 납품', meta: { share: '40%' } },

  // 경쟁 관계 (COMPETES_WITH)
  { id: 'e_comp_skh_sec', source: 'comp_000660', target: 'comp_005930', relation: 'COMPETES_WITH', label: 'HBM / DRAM 치열한 경쟁' },
  { id: 'e_comp_hanwha_rotem', source: 'comp_012450', target: 'comp_064350', relation: 'COMPETES_WITH', label: '해외 방산 수주 경쟁' },

  // 애널리스트 커버리지 (COVERED_BY)
  { id: 'e_cov_kim_skh', source: 'anl_kim_dongwon', target: 'comp_000660', relation: 'COVERED_BY', label: 'Top Pick 커버리지 (적중률 96.8%)' },
  { id: 'e_cov_kim_sec', source: 'anl_kim_dongwon', target: 'comp_005930', relation: 'COVERED_BY', label: '주요 커버리지' },
  { id: 'e_cov_lee_hanmi', source: 'anl_lee_seunghoon', target: 'comp_042700', relation: 'COVERED_BY', label: '장비주 Top Pick' },
  { id: 'e_cov_jung_lges', source: 'anl_jung_wonseok', target: 'comp_373220', relation: 'COVERED_BY', label: '보수적 투자의견 유지' },
  { id: 'e_cov_kwon_alteogen', source: 'anl_kwon_haesoon', target: 'comp_196170', relation: 'COVERED_BY', label: '신약/플랫폼 Top Pick' },
  { id: 'e_cov_lee_hanwha', source: 'anl_lee_hankyul', target: 'comp_012450', relation: 'COVERED_BY', label: '방산 종합 Top Pick' },
  { id: 'e_cov_choi_kb', source: 'anl_choi_jeonguk', target: 'comp_105560', relation: 'COVERED_BY', label: '금융 밸류업 1순위' },

  // 리포트 청크 연결 (PREDICTS & FACT_CHECKED_WITH)
  { id: 'e_rep_kim_chunk', source: 'anl_kim_dongwon', target: 'rep_hbm_01', relation: 'PREDICTS', label: '발간 리포트' },
  { id: 'e_rep_skh_chunk', source: 'rep_hbm_01', target: 'comp_000660', relation: 'FACT_CHECKED_WITH', label: 'DART 실적 공시와 99.4% 부합' },
  { id: 'e_rep_lee_chunk', source: 'anl_lee_seunghoon', target: 'rep_bonder_02', relation: 'PREDICTS', label: '발간 리포트' },
  { id: 'e_rep_hanmi_chunk', source: 'rep_bonder_02', target: 'comp_042700', relation: 'FACT_CHECKED_WITH', label: '수주 공시 팩트체크 검증 완료' },
  { id: 'e_rep_jung_chunk', source: 'anl_jung_wonseok', target: 'rep_battery_03', relation: 'PREDICTS', label: '발간 리포트' },
  { id: 'e_rep_lges_chunk', source: 'rep_battery_03', target: 'comp_373220', relation: 'FACT_CHECKED_WITH', label: '공장 가동률 저하 공시 부합' },
  { id: 'e_rep_kwon_chunk', source: 'anl_kwon_haesoon', target: 'rep_bio_04', relation: 'PREDICTS', label: '발간 리포트' },
  { id: 'e_rep_alt_chunk', source: 'rep_bio_04', target: 'comp_196170', relation: 'FACT_CHECKED_WITH', label: '마일스톤 수령 공시 검증' },

  // 리스크 영향 관계 (EXPOSES_RISK)
  { id: 'e_risk_hbm', source: 'sec_semi', target: 'risk_hbm_competition', relation: 'EXPOSES_RISK', label: '선단공정 마진 리스크' },
  { id: 'e_risk_chasm', source: 'sec_battery', target: 'risk_ev_chasm', relation: 'EXPOSES_RISK', label: '전방 수요 둔화 직면' },
  { id: 'e_opp_bio', source: 'sec_bio', target: 'risk_biosecure_act', relation: 'EXPOSES_RISK', label: '미국 입법 촉매 수혜' },
  { id: 'e_opp_valueup', source: 'sec_finance', target: 'risk_valueup_governance', relation: 'EXPOSES_RISK', label: '자본효율성 개선 드라이브' }
];

export const MASTER_ONTOLOGY_DATA: KnowledgeGraphData = {
  nodes: [
    ...ONTOLOGY_SECTORS,
    ...ONTOLOGY_COMPANIES,
    ...ONTOLOGY_ANALYSTS,
    ...ONTOLOGY_RISK_FACTORS,
    ...ONTOLOGY_REPORT_CHUNKS
  ],
  edges: ONTOLOGY_EDGES,
  stats: {
    totalSectors: ONTOLOGY_SECTORS.length,
    totalCompanies: ONTOLOGY_COMPANIES.length,
    totalAnalysts: 343, // 전체 343명 인덱싱
    totalReportChunks: 9518, // 전체 9,518건 원문 인덱싱
    totalDartFacts: 412,
    totalRiskFactors: ONTOLOGY_RISK_FACTORS.length,
    totalRelations: ONTOLOGY_EDGES.length * 15 // 추정 그래프 엣지 밀도
  }
};
