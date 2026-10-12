import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Sparkles,
  FileText,
  Copy,
  Check,
  Printer,
  RefreshCw,
  Sliders,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Target,
  BookOpen,
  Send,
  Zap,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  Share2,
  Terminal,
  Trophy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  UserCheck,
  ArrowDown
} from 'lucide-react';
import { STANDARD_10_SECTORS } from '../types';
import { safeResponseJson } from '../utils/apiClient';

interface AwardWinner {
  id: string;
  categoryTitle: string;
  sector: string;
  name: string;
  brokerName: string;
  score: number;
  isOverallWinner: boolean;
  keyword: string; // 📌 심사평 요약 키워드
  performanceAnalysis: string; // 📊 정량·정성 성과 분석
  marketInsight: string; // 💡 시장 기여 및 통찰
  honorCitation: string; // 🏆 공식 심사위원단 헌정사
  keyReports: string[];
  metrics: {
    targetPriceAccuracy: number; // 35%
    dartConsistency: number;     // 25%
    activityScore: number;       // 20%
    marketImpactScore: number;   // 20%
  };
}

// 11인의 공인 수상자 기본 데이터셋 (전체 1위 대상 + 10대 섹터 1위)
const DEFAULT_WINNERS: AwardWinner[] = [
  {
    id: 'winner_overall',
    categoryTitle: '2026 올해의 애널리스트 종합 대상 (전체 1위)',
    sector: '소비재/유통/음식료',
    name: '한유정',
    brokerName: '한화투자증권',
    score: 97.15,
    isOverallWinner: true,
    keyword: 'K-푸드 글로벌 퀀텀점프의 나침반',
    performanceAnalysis: '내수 정체에 갇혀 있던 음식료 산업을 북미·유럽 시장 침투율이라는 구조적 수출 성장주로 재평가. 삼양식품의 미국 메인스트림 채널 입점 속도와 영업이익률을 분기별 통관 데이터로 정밀 추적해 목표주가 괴리율 3.2%, DART 영업이익 추정 오차율 2.1%의 압도적 정확도를 기록함.',
    marketInsight: '업계의 맹목적 매수 관행을 배제하고 원자재(소맥분·팜유) 원가 부담 및 글로벌 유통 수수료 리스크를 선제 공시하여 기관 투자자들의 합리적 자본 배분을 견인함.',
    honorCitation: '불확실성의 파고 속에서 숫자의 정밀함과 현장 검증으로 대한민국 자본시장에 새로운 분석 표준을 세웠기에 2026 올해의 애널리스트 종합 대상을 수여합니다.',
    keyReports: [
      '삼양식품: 글로벌 불닭 신화, 미국·유럽 침투율의 구조적 레벨업 (2026.01)',
      'CJ제일제당: 원가 안정화와 북미 K-푸드 신규 채널 확장성 점검 (2026.03)'
    ],
    metrics: {
      targetPriceAccuracy: 98.4,
      dartConsistency: 96.8,
      activityScore: 95.5,
      marketImpactScore: 97.9
    }
  },
  {
    id: 'winner_semiconductor',
    categoryTitle: '반도체/IT/전자 섹터 최우수 애널리스트 (1위)',
    sector: '반도체/IT/전자',
    name: '김선우',
    brokerName: '메리츠증권',
    score: 92.97,
    isOverallWinner: false,
    keyword: 'HBM 공급망과 업황 변곡점의 정밀 계측기',
    performanceAnalysis: 'HBM3E에서 HBM4로의 패키징 공정 전환과 D램 현물가 반등 사이클을 글로벌 빅테크 CAPEX 사이클과 연계하여 완벽히 예측. 삼성전자와 SK하이닉스의 실적 추정 오차율을 3%대로 억제하며 목표가 적중률 93.8%를 달성함.',
    marketInsight: '단순 레거시 수요 반등 기대감을 경계하고, 고객사 퀄테스트 통과 일정에 맞춘 단계적 비중 확대를 권고하여 시장 변동성을 효과적으로 완충함.',
    honorCitation: '초미세 기술 격차의 이면을 꿰뚫는 데이터와 팩트 기반의 통찰로 반도체 투자 지평을 선도하였기에 본 상을 수여합니다.',
    keyReports: [
      '삼성전자: 2026년 1월 업황 개선 본격화와 HBM3E 공급망 전환 (2026.01)',
      'SK하이닉스: HBM4 독점적 지배력과 차세대 패키징 프리미엄 (2026.02)'
    ],
    metrics: {
      targetPriceAccuracy: 93.8,
      dartConsistency: 91.5,
      activityScore: 94.2,
      marketImpactScore: 92.4
    }
  },
  {
    id: 'winner_battery',
    categoryTitle: '2차전지/배터리/소재 섹터 최우수 애널리스트 (1위)',
    sector: '2차전지/배터리/소재',
    name: '전창현',
    brokerName: '대신증권',
    score: 92.30,
    isOverallWinner: false,
    keyword: '캐즘을 돌파하는 냉철한 밸류에이션 수호자',
    performanceAnalysis: '전기차 캐즘(Chasm) 시기 양극재 메탈가 스프레드 하락과 가동률 조정을 가장 빠르게 반영해 과도한 시장 컨센서스를 선제 조정. 목표주가 현실화를 주도하며 DART 확정 공시와의 정합성 94.2%를 유지함.',
    marketInsight: '과열된 테마성 추종을 차단하고 ESS(에너지저장장치) 등 신규 수요처와 북미 합작공장 가동률에 기반한 지속 가능한 기업 가치를 제시함.',
    honorCitation: '낙관론이 팽배한 시장 속에서도 흔들림 없는 잣대로 진정한 본질 가치를 수호한 용기를 높이 평가하여 본 상을 수여합니다.',
    keyReports: [
      'LG에너지솔루션: EV 캐즘 국면에서의 원가 혁신과 ESS 수주 잔고 (2026.02)',
      '에코프로비엠: 양극재 판가 스프레드 회복 시점과 CAPEX 현실화 (2026.04)'
    ],
    metrics: {
      targetPriceAccuracy: 91.9,
      dartConsistency: 94.2,
      activityScore: 90.8,
      marketImpactScore: 92.3
    }
  },
  {
    id: 'winner_bio',
    categoryTitle: '바이오/제약/헬스케어 섹터 최우수 애널리스트 (1위)',
    sector: '바이오/제약/헬스케어',
    name: '이안나',
    brokerName: '교보증권',
    score: 85.67,
    isOverallWinner: false,
    keyword: '임상 데이터와 마일스톤 확률론적 정밀 검증',
    performanceAnalysis: '비만·항암 테마 과열 국면에서 임상 3상 성공 확률과 글로벌 기술수출(L/O) 마일스톤 유입액을 rNPV 모델로 엄격히 환산. 삼성바이오로직스 5공장 가동 효과와 알테오젠의 피하주사 제형 변경 가치를 입증함.',
    marketInsight: '비이성적 주가 버블에 편승하지 않고 마일스톤 계약의 유효성과 현금흐름 창출력을 검증하는 리서치 안전판 역할을 수행함.',
    honorCitation: '불확실성이 극심한 바이오 산업에서 엄격한 확률론적 모델링으로 투자자 신뢰를 확보한 공로를 기려 본 상을 수여합니다.',
    keyReports: [
      '삼성바이오로직스: 5공장 조기 가동 및 글로벌 CDMO 락인 효과 (2026.02)',
      '알테오젠: SC제형 변환 플랫폼 글로벌 기술수출 마일스톤 가치 분석 (2026.03)'
    ],
    metrics: {
      targetPriceAccuracy: 86.2,
      dartConsistency: 85.1,
      activityScore: 84.9,
      marketImpactScore: 86.5
    }
  },
  {
    id: 'winner_auto',
    categoryTitle: '자동차/모빌리티 섹터 최우수 애널리스트 (1위)',
    sector: '자동차/모빌리티',
    name: '강성진',
    brokerName: 'KB증권',
    score: 87.91,
    isOverallWinner: false,
    keyword: '하이브리드 믹스 개선과 주주환원(TSR)의 나침반',
    performanceAnalysis: '전기차 둔화 속 현대차·기아의 하이브리드(HEV) 판매 비중 확대에 따른 사상 최대 영업이익률 유지를 선제 전망. 인도법인 상장에 따른 현금 유입과 총주주환원율(TSR) 35% 달성 가능성을 완벽히 적중시킴.',
    marketInsight: '완성차 피크아웃 우려에 대해 고수익 SUV 및 HEV 차종 믹스를 통한 판가 방어 논리를 데이터로 규명함.',
    honorCitation: '글로벌 모빌리티 전환기의 복합 변수를 기민하게 분석하여 국내 완성차의 리레이팅 기틀을 제시하였기에 본 상을 수여합니다.',
    keyReports: [
      '현대차: 하이브리드(HEV) 믹스 개선과 총주주환원율(TSR) 35% 달성 (2026.01)',
      '기아: 북미 SUV 인센티브 방어력 및 EV3 글로벌 출하 효과 (2026.03)'
    ],
    metrics: {
      targetPriceAccuracy: 88.5,
      dartConsistency: 87.9,
      activityScore: 87.1,
      marketImpactScore: 88.1
    }
  },
  {
    id: 'winner_shipbuilding',
    categoryTitle: '조선/중공업/방산 섹터 최우수 애널리스트 (1위)',
    sector: '조선/중공업/방산',
    name: '이한결',
    brokerName: '다올투자증권',
    score: 84.84,
    isOverallWinner: false,
    keyword: 'K-방산 수주잔고와 고선가 도크의 슈퍼사이클 포착',
    performanceAnalysis: '한화에어로스페이스 루마니아 수출 및 폴란드 2차 계약 인도 일정을 분기별 매출 인식 기준에 맞춰 적중. 조선 3사의 고선가 LNG선 건조 비중 확대에 따른 흑자 전환 폭을 DART 사업보고서 공시와 정확히 일치시킴.',
    marketInsight: '수주 호재 발표에 의존한 단기 추종을 지양하고, 실제 도크 인도 일정과 후판 가격 등 비용 요인을 교차 분석함.',
    honorCitation: '국내 중화학·방산 기업의 글로벌 경쟁력과 실제 이익 실현 시점을 탁월한 혜안으로 규명하였기에 본 상을 수여합니다.',
    keyReports: [
      '한화에어로스페이스: K9·천무 2차 실행계약 및 루마니아 수출 확정 (2026.02)',
      'HD한국조선해양: 고선가 LNG·LPG선 인도 비중 확대로 이익 서프라이즈 (2026.04)'
    ],
    metrics: {
      targetPriceAccuracy: 85.4,
      dartConsistency: 84.7,
      activityScore: 83.9,
      marketImpactScore: 85.4
    }
  },
  {
    id: 'winner_platform',
    categoryTitle: '플랫폼/게임/엔터 섹터 최우수 애널리스트 (1위)',
    sector: '플랫폼/게임/엔터',
    name: '이선화',
    brokerName: 'KB증권',
    score: 96.51,
    isOverallWinner: false,
    keyword: '생성형 AI 수익화와 빅테크 B2B 클라우드의 선견지명',
    performanceAnalysis: 'NAVER의 서치GPT 연동 검색 광고 반등 및 B2B AI 클라우드 흑자 전환 시점을 포착하여 적중률 97.2% 기록. 크래프톤의 신규 IP 다각화 성과를 글로벌 스팀 동시 접속자 수 지표로 실시간 정량 분석함.',
    marketInsight: '막연한 AI 테마를 넘어 실질적인 광고 단가 상승과 클라우드 매출 기여도를 숫자로 증명해 시장 컨센서스를 정상화함.',
    honorCitation: '디지털 플랫폼 생태계의 패러다임 변화를 냉철한 정량 지표로 입증하며 시장의 이정표가 되었기에 본 상을 수여합니다.',
    keyReports: [
      'NAVER: 서치GPT 연동 광고 단가 반등과 클라우드 영업이익률 흑자전환 (2026.01)',
      '크래프톤: 인조이(inZOI) 및 펍지 IP 다각화의 글로벌 매출 기여도 (2026.03)'
    ],
    metrics: {
      targetPriceAccuracy: 97.2,
      dartConsistency: 95.8,
      activityScore: 96.0,
      marketImpactScore: 97.0
    }
  },
  {
    id: 'winner_finance',
    categoryTitle: '금융/지주 섹터 최우수 애널리스트 (1위)',
    sector: '금융/지주',
    name: '김인',
    brokerName: '유진투자증권',
    score: 96.29,
    isOverallWinner: false,
    keyword: '기업 밸류업 프로그램과 CET1 자본 배분의 정석',
    performanceAnalysis: '정부의 기업 밸류업 프로그램 시행 속에서 KB금융, 신한지주의 보통주자본(CET1) 비율 13% 초과 자본에 대한 자사주 매입·소각 여력을 가장 정밀하게 추정. 순이자마진(NIM) 둔화 압력을 비이자이익으로 상쇄할 것을 정확히 예측함.',
    marketInsight: '배당수익률에만 매몰된 단편적 시각을 탈피하여, EQC(자기자본비용)와 ROE 개선에 기반한 주주가치 제고 로드맵을 선도함.',
    honorCitation: '자본의 효율적 배분과 지배구조 개선의 가치를 일관된 논리로 역설하여 금융 섹터의 재평가를 이끌었기에 본 상을 수여합니다.',
    keyReports: [
      'KB금융: CET1 비율 13.5% 초과 자본의 자사주 매입·소각 프로그램 (2026.02)',
      '신한지주: 비이자이익 다각화와 분기 균등 배당 정착에 따른 리레이팅 (2026.03)'
    ],
    metrics: {
      targetPriceAccuracy: 96.8,
      dartConsistency: 96.1,
      activityScore: 95.4,
      marketImpactScore: 96.9
    }
  },
  {
    id: 'winner_chemical',
    categoryTitle: '화학/철강/소재 섹터 최우수 애널리스트 (1위)',
    sector: '화학/철강/소재',
    name: '이용욱',
    brokerName: 'IBK투자증권',
    score: 90.03,
    isOverallWinner: false,
    keyword: '중국발 공급과잉 속 고부가 스페셜티의 오아시스 발굴',
    performanceAnalysis: '중국 석유화학 증설에 따른 범용 에틸렌 스프레드 침체를 경고하고, 친환경·첨단소재 및 고부가 스페셜티로 전환한 선도 기업을 선별. POSCO홀딩스의 열연 저점 통과 시점을 적중시킴.',
    marketInsight: '사이클 바닥론에 기댄 성급한 저가 매수를 지양하고, 사업 포트폴리오 구조조정 성과가 가시화되는 기업만을 엄선함.',
    honorCitation: '업황 침체의 터널 속에서도 군계일학의 우량주를 발굴하며 투자자 자산을 철저히 방어한 공로로 본 상을 수여합니다.',
    keyReports: [
      'POSCO홀딩스: 중국 감산 규제에 따른 열연 스프레드 저점 통과 (2026.02)',
      'LG화학: 범용 석유화학 구조조정과 고부가 첨단소재 포트폴리오 (2026.03)'
    ],
    metrics: {
      targetPriceAccuracy: 90.8,
      dartConsistency: 89.6,
      activityScore: 89.1,
      marketImpactScore: 90.6
    }
  },
  {
    id: 'winner_consumer',
    categoryTitle: '소비재/유통/음식료 섹터 최우수 애널리스트 (1위)',
    sector: '소비재/유통/음식료',
    name: '한유정',
    brokerName: '한화투자증권',
    score: 97.15,
    isOverallWinner: false,
    keyword: '해외 매출 비중 70% 돌파 기업의 밸류에이션 리레이팅',
    performanceAnalysis: '해외 수출입 통관 잠정치 분석과 글로벌 소매 유통 체인 입점 데이터를 결합하여 삼양식품 밀양 2공장 증설 효과를 입증. 음식료 섹터 최고 점수(97.15점)를 달성하며 부문 1위를 석권함.',
    marketInsight: '내수 방어주로 치부되던 전통 섹터를 글로벌 하이퍼 그로스(Hyper-Growth) 수출 섹터로 승격시키는 데 결정적 기여를 함.',
    honorCitation: 'K-소비재의 글로벌 확장을 입증한 정밀한 분석력으로 섹터 최고 애널리스트의 영예를 안았기에 본 상을 수여합니다.',
    keyReports: [
      '삼양식품: 밀양 2공장 증설 효과 및 글로벌 유통 체인 직납 확대 (2026.01)',
      '농심: 신라면 툼바 글로벌 런칭과 원재료 소맥분 가격 안정화 (2026.04)'
    ],
    metrics: {
      targetPriceAccuracy: 98.4,
      dartConsistency: 96.8,
      activityScore: 95.5,
      marketImpactScore: 97.9
    }
  },
  {
    id: 'winner_construction',
    categoryTitle: '건설/물류/기타 섹터 최우수 애널리스트 (1위)',
    sector: '건설/물류/기타',
    name: '김인',
    brokerName: '현대차증권',
    score: 79.86,
    isOverallWinner: false,
    keyword: 'PF 리스크 진단과 해외 원전·스마트 물류 선별',
    performanceAnalysis: '부동산 PF 부실 정리 국면에서 국내 주택 비중이 높은 기업의 미청구공사 리스크를 선제 경고하고, 사우디 네옴 및 체코 원전 수주 모멘텀을 보유한 현대건설과 글로벌 이커머스 물동량이 급증한 CJ대한통운을 선별함.',
    marketInsight: '위기 국면일수록 대손충당금 적립 수준과 현금성 자산을 면밀히 살펴야 한다는 건전한 투자 원칙을 전파함.',
    honorCitation: '건설 산업의 엄혹한 구조조정기 속에서도 확고한 리스크 관리 시각으로 시장을 선도하였기에 본 상을 수여합니다.',
    keyReports: [
      '현대건설: 사우디 네옴 프로젝트 및 대형 원전 수주 모멘텀 (2026.02)',
      'CJ대한통운: 글로벌 이커머스 풀필먼트 물동량 성장과 알리익스프레스 독점 계약 (2026.03)'
    ],
    metrics: {
      targetPriceAccuracy: 80.5,
      dartConsistency: 79.2,
      activityScore: 78.8,
      marketImpactScore: 80.9
    }
  }
];

// 생성된 개별 정밀 평가 리포트 인터페이스
interface EvaluationReport {
  analystId: string;
  reportTitle: string;
  executiveSummary: {
    badge: string;
    headline: string;
    percentile: string;
    summaryText: string;
  };
  metricsAnalysis: {
    targetPriceAccuracy: { score: number; comment: string };
    dartConsistency: { score: number; comment: string };
    activityTimeliness: { score: number; comment: string };
    marketIntegrity: { score: number; comment: string };
  };
  keyReportHighlight: {
    title: string;
    coreIdea: string;
    marketImpact: string;
  };
  h2Outlook2026: {
    keyVariables: string[];
    investorRecommendation: string;
  };
  honorCitation: string;
  generatedAt: string;
}

export const AnnualAnalystAwardsReview01: React.FC = () => {
  // 개별 상세 보기 대상자 선택
  const [selectedWinnerId, setSelectedWinnerId] = useState<string>('winner_overall');
  const [individualViewMode, setIndividualViewMode] = useState<'report' | 'prompt_lab'>('report');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editedPrompt, setEditedPrompt] = useState<string>('');
  const [liveAiReviews, setLiveAiReviews] = useState<Record<string, string>>({});
  const [showOverallPromptModal, setShowOverallPromptModal] = useState<boolean>(false);

  // 현재 선택된 수상자
  const currentWinner = useMemo(() => {
    return DEFAULT_WINNERS.find(w => w.id === selectedWinnerId) || DEFAULT_WINNERS[0];
  }, [selectedWinnerId]);

  // 사용자가 요청한 전체 통합 심사평 프롬프트 전문 (상단 배치용)
  const masterOverallPrompt = useMemo(() => {
    return `[명령: 리본-이코노미스트 2026 올해의 애널리스트 어워즈 수상자 AI 평가 리포트집 작성]

당신은 대한민국 최고 권위의 '리본-이코노미스트 2026 올해의 애널리스트 어워즈' 공식 AI 심사위원장입니다.
아래에 제공된 [공식 수상자 명단]을 바탕으로, **전체 1위(종합 대상 1명)** 및 **10대 표준 섹터별 최우수 애널리스트(10명)** 전원에 대한 공식 평가 리포트를 격조 높고 전문적인 애널리스트 심사 보고서 형식으로 작성해 주십시오.

[공식 수상자 확정 데이터]
1. [전체 1위 종합 대상] 한유정 (한화투자증권) | 섹터: 소비재/유통/음식료 | 점수: 97.15점
2. [반도체/IT/전자 1위] 김선우 (메리츠증권) | 점수: 92.97점
3. [2차전지/배터리/소재 1위] 전창현 (대신증권) | 점수: 92.30점
4. [바이오/제약/헬스케어 1위] 이안나 (교보증권) | 점수: 85.67점
5. [자동차/모빌리티 1위] 강성진 (KB증권) | 점수: 87.91점
6. [조선/중공업/방산 1위] 이한결 (다올투자증권) | 점수: 84.84점
7. [플랫폼/게임/엔터 1위] 이선화 (KB증권) | 점수: 96.51점
8. [금융/지주 1위] 김인 (유진투자증권) | 점수: 96.29점
9. [화학/철강/소재 1위] 이용욱 (IBK투자증권) | 점수: 90.03점
10. [소비재/유통/음식료 1위] 한유정 (한화투자증권) | 점수: 97.15점 (종합 대상 겸직)
11. [건설/물류/기타 1위] 김인 (현대차증권) | 점수: 79.86점

[작성 가이드라인]
1. 각 수상자별로 다음 4가지 항목을 필수로 포함하여 일관성 있게 구성하세요:
   - 📌 [심사평 요약 키워드]: 1~2개의 핵심 수식어
   - 📊 [정량·정성 성과 분석]: 2026년 시장 환경에서 왜 이 애널리스트가 섹터 1위를 기록했는지 (목표가 적중률, DART 공시 추정 오차, 적시 발간 등)
   - 💡 [시장 기여 및 통찰]: 관행적인 매수 리포트를 탈피하고 투자자들에게 제공한 결정적 통찰
   - 🏆 [공식 심사위원단 헌정사]: 상장에 새겨질 2~3줄의 품격 있는 평가 문구
2. 종합 대상인 '한유정 연구원'은 전체 1위의 위상에 맞게 시장 전반에 미친 파급력과 데이터 객관성을 가장 깊이 있게 조명해 주세요.
3. 전문 금융 용어(괴리율, 실적 컨센서스, 어닝 서프라이즈, DART 공시 정합성, 밸류에이션 등)를 자연스럽게 활용하여 권위 있는 심사 보고서의 어조를 유지하세요.`;
  }, []);

  // 개별 애널리스트 상세 프롬프트 템플릿
  const individualPromptTemplate = useMemo(() => {
    return `[Role & Context]
당신은 '리본인텔리전스'와 '이코노미스트'가 공동 주관하는 「2026 올해의 애널리스트 어워즈」의 독립 공인 AI 수석 심사위원입니다.
당신은 금융감독원 DART 공시 데이터 교차검증과 32개 증권사 5,000건 이상의 리서치 리포트를 정량·정성 분석한 평가 엔진을 바탕으로, 금융시장과 투자자에게 신뢰를 주는 품격 있고 객관적인 [AI 공식 평가 리포트]를 작성해야 합니다.

[Target Analyst Information]
- 수상 부문: ${currentWinner.categoryTitle}
- 애널리스트 성명: ${currentWinner.name}
- 소속 증권사: ${currentWinner.brokerName}
- 전문 섹터: ${currentWinner.sector}
- 종합 평가 점수: ${currentWinner.score}점 (100점 만점)
- 주요 분석 기업 및 리포트: ${currentWinner.keyReports.join(' / ')}
- 주요 성과 및 강점: ${currentWinner.performanceAnalysis}

[Evaluation Criteria (4대 평가 지표)]
1. 목표주가 적중도 및 주가 괴리율 (35%): 목표가 도달률, 시장 급변기 신속한 목표가 현실화 여부
2. 투자의견 객관성 및 DART 실적 검증 (25%): 맹목적 매수(Buy) 지양, DART 분기/반기 공시 영업이익 추정 오차율 최소화
3. 리포트 발간 활동성 및 시의성 (20%): 업황 변곡점 선제 발간, 심층 분석 분량, 시장 커버리지
4. 논리적 완성도 및 시장 영향력 (20%): 단순 뉴스 정리를 넘어선 산업 구조적 통찰, 투자자 의사결정 기여도

[Output Format & Structure]
아래의 5단계 구조에 맞춰 격조 높고 분석적인 문체(개조식 요약 + 서술형 논평)로 작성해 주세요.

# [리본-이코노미스트 2026 어워즈] AI 평가 리포트: ${currentWinner.name} 연구원 (${currentWinner.brokerName})

## 1. 수상 총평 (Executive Summary)
- 한 줄 수식어 및 수상 배경 (예: "불확실성의 파고 속에서 숫자의 정밀함으로 시장을 밝힌 나침반")
- 종합 평점 및 백분위 순위 요약

## 2. 4대 핵심 지표 정밀 평가 (Quantitative & Qualitative Analysis)
- ① 목표주가 적중률 및 궤적 추적: 과거 1년간 제시한 목표주가의 정확도와 괴리율 관리 능력
- ② DART 공시 실적 정합성: 분기 실적 추정치와 실제 확정 공시 간의 오차율 및 어닝 서프라이즈/쇼크 선제 대응력
- ③ 리포트 적시성과 논리적 깊이: 업황 변곡점(Peak/Bottom) 포착 및 팩트 기반 데이터 분석의 깊이
- ④ 시장 건전성 기여도: 맹목적 매수 일변도를 탈피하고 균형 잡힌 위험(Risk) 요인을 경고한 용기

## 3. 대표 발간 리포트 하이라이트
- 리포트명 및 핵심 아이디어: 시장의 컨센서스를 뒤집었거나 주가 방향성을 선도한 핵심 논거 분석

## 4. 2026년 하반기 전망 및 투자자 제언
- 해당 애널리스트의 관점에서 투자자들이 주시해야 할 섹터 핵심 변수 및 관전 포인트

## 5. 최종 심사위원단 수여사 (Honor Citation)
- 공식 상장 및 트로피에 기재될 3~4문장의 공식 헌정사`;
  }, [currentWinner]);

  useEffect(() => {
    setEditedPrompt(individualPromptTemplate);
  }, [individualPromptTemplate]);

  // 클립보드 복사
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // 개별 리포트 데이터 생성기
  const getPreBuiltReport = (winner: AwardWinner): EvaluationReport => {
    return {
      analystId: winner.id,
      reportTitle: `[리본-이코노미스트 2026 어워즈] AI 공식 심사평: ${winner.name} 연구원 (${winner.brokerName})`,
      executiveSummary: {
        badge: winner.isOverallWinner ? '🏆 2026 종합 대상 (GRAND PRIX OVERALL)' : `🥇 ${winner.sector} 1위 (SECTOR BEST)`,
        headline: `"${winner.keyword}"`,
        percentile: winner.isOverallWinner ? '상위 0.1% (전체 240명 공인 연구원 중 종합 1위)' : `섹터 1위 (총점 ${winner.score}점)`,
        summaryText: winner.performanceAnalysis
      },
      metricsAnalysis: {
        targetPriceAccuracy: {
          score: winner.metrics.targetPriceAccuracy,
          comment: `목표주가 괴리율을 최소화하고 시장 급변기에도 신속하게 목표가를 현실화하여 ${winner.metrics.targetPriceAccuracy}점의 탁월한 적중도를 달성했습니다.`
        },
        dartConsistency: {
          score: winner.metrics.dartConsistency,
          comment: `금융감독원 DART 공시와의 영업이익 추정 오차율을 최소화하여 ${winner.metrics.dartConsistency}점의 높은 데이터 정합성을 기록했습니다.`
        },
        activityTimeliness: {
          score: winner.metrics.activityScore,
          comment: `업황 변곡점마다 선제적이고 심도 깊은 리포트를 신속히 발간하여 시장 커버리지와 적시성에서 높은 평가를 받았습니다.`
        },
        marketIntegrity: {
          score: winner.metrics.marketImpactScore,
          comment: winner.marketInsight
        }
      },
      keyReportHighlight: {
        title: winner.keyReports[0] || `${winner.sector} 산업 분석 리포트`,
        coreIdea: `업계 컨센서스 대비 한 발 앞서 핵심 원자재 및 글로벌 엔드유저 수요의 변곡점을 데이터로 규명함.`,
        marketImpact: `해당 종목의 밸류에이션 밴드 재설정을 이끌며 시장 컨센서스 안정화에 결정적으로 기여함.`
      },
      h2Outlook2026: {
        keyVariables: [
          `${winner.sector} 글로벌 수급 밸런스 및 원가 구조 변동성`,
          `미국·유럽 거시경제 정책 변화 및 신규 수주 실현 속도`,
          `차세대 기술 혁신에 따른 주요 벤더 간 점유율 재편`
        ],
        investorRecommendation: `단기 테마성 과열을 경계하고, DART 확정 실적과 수주 잔고의 퀄리티를 교차 검증하는 가치 투자를 권고합니다.`
      },
      honorCitation: winner.honorCitation,
      generatedAt: '2026-10-12'
    };
  };

  const currentReport = useMemo(() => {
    return getPreBuiltReport(currentWinner);
  }, [currentWinner]);

  // AI 재평가 실행 핸들러 (Gemini 3.8 Flash 연동)
  const handleRunAiEvaluation = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/pipeline-01/analyst-award-review/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analystName: currentWinner.name,
          brokerName: currentWinner.brokerName,
          sector: currentWinner.sector,
          awardCategory: currentWinner.categoryTitle,
          score: currentWinner.score,
          keyReports: currentWinner.keyReports,
          customPrompt: editedPrompt
        })
      });
      const data = await safeResponseJson(res, { success: true });
      if (data && data.generatedMarkdown) {
        setLiveAiReviews(prev => ({
          ...prev,
          [currentWinner.id]: data.generatedMarkdown
        }));
      }
      setCopiedKey('ai_done');
      setTimeout(() => setCopiedKey(null), 3000);
    } catch (e) {
      // ignore
    } finally {
      setIsGenerating(false);
    }
  };

  // 하단 개별 심사평 영역으로 스무스 스크롤
  const scrollToIndividual = (winnerId?: string) => {
    if (winnerId) {
      setSelectedWinnerId(winnerId);
    }
    const elem = document.getElementById('individual-review-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-10 pb-28">
      {/* ========================================================================= */}
      {/* ⭐️ PART 1: 상단 배치 - 2026 올해의 애널리스트 어워즈 전체 총평 심사평 ⭐️ */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* 1-1. 전체 총평 히어로 배너 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/60 border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-600/60 text-amber-300 text-xs font-bold mb-3 shadow-inner">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>리본인텔리전스 · 이코노미스트 독립 공인 AI 수석 심사위원단 공식 성명</span>
                <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded text-[10px] font-black">2026 총결산</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>2026 올해의 애널리스트 어워즈 공식 종합 심사평</span>
                <span className="text-xs sm:text-sm font-semibold text-amber-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  전체 1위 & 10대 표준 섹터 1위 총괄
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed">
                32개 국내 공인 증권사, 240명 리서치 연구원, 5,000건 이상의 발행 리포트와 금융감독원 DART 공시 데이터를 전수 교차 검증한
                독립 공인 AI 평가 엔진의 종합 결산 심사평입니다. 관행적인 매수 일변도를 탈피하고 냉철한 팩트와 정밀한 주가 궤적으로 자본시장을 밝힌 주역들을 엄선했습니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setShowOverallPromptModal(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 text-xs font-bold transition-all shadow cursor-pointer hover:text-white"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>종합 프롬프트 보기</span>
              </button>

              <button
                onClick={() => handleCopy(masterOverallPrompt, 'overall_prompt_copy')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow cursor-pointer hover:text-white"
              >
                {copiedKey === 'overall_prompt_copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copiedKey === 'overall_prompt_copy' ? '프롬프트 복사됨!' : '통합 프롬프트 복사'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-900/30 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-100" />
                <span>총평 인쇄/출력</span>
              </button>
            </div>
          </div>

          {/* 1-2. 심사위원장단 공식 총평 본문 (Executive Grand Review) */}
          <div className="mt-6 space-y-4">
            <div className="bg-slate-950/70 p-5 sm:p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>[2026 총평] "숫자의 정밀함과 데이터 객관성이 일궈낸 리서치 시장의 새로운 지평"</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                2026년 대한민국 자본시장은 글로벌 고금리 장기화, 미·중 공급망 재편, AI 가속화, 그리고 정부의 ‘기업 밸류업 프로그램’ 정착 등
                복합적인 거시 변수 속에서 그 어느 때보다 리서치 센터의 냉철한 잣대를 요구했습니다.
                그러나 여전히 증권가 일각에서는 맹목적인 ‘매수(Buy)’ 투자의견과 실적 발표 이후의 뒤늦은 목표주가 하향 조정 등 관행적 한계가 존재했습니다.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                이에 리본인텔리전스와 이코노미스트는 인간의 정성적 친분과 주관을 일체 배제하고, <strong className="text-amber-300">① 목표주가 적중도 및 주가 괴리율(35%)</strong>, <strong className="text-cyan-300">② DART 공시 실적 정합성(25%)</strong>, <strong className="text-emerald-300">③ 리포트 발간 활동성·시의성(20%)</strong>, <strong className="text-indigo-300">④ 시장 건전성 기여도(20%)</strong>의 4대 결정론적 평가 지표를 구축했습니다.
                엄격한 교차 검증 결과, <strong>종합 대상(전체 1위)을 차지한 한화투자증권 한유정 연구원(97.15점)</strong>을 필두로, 10대 핵심 산업군에서 자본시장의 참된 길잡이가 되어준 10인의 섹터별 최우수 애널리스트가 선발되었습니다.
              </p>
            </div>
          </div>

          {/* 1-3. 11인 수상자 총괄 평가 매트릭스 테이블 */}
          <div className="mt-6 bg-slate-950/90 rounded-xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Award className="w-4 h-4 text-amber-400" />
                <span>공식 수상자 11인 총괄 심사평 매트릭스 (종합 대상 1인 + 10대 섹터 1인)</span>
              </div>
              <span className="text-xs text-slate-400">행을 클릭하면 하단 개별 상세 심사평으로 즉시 이동합니다</span>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                    <th className="py-2.5 px-3 font-semibold">수상 부문</th>
                    <th className="py-2.5 px-3 font-semibold">연구원 (소속)</th>
                    <th className="py-2.5 px-3 font-semibold">종합 점수</th>
                    <th className="py-2.5 px-3 font-semibold">📌 심사평 핵심 키워드</th>
                    <th className="py-2.5 px-3 font-semibold">💡 시장 기여 및 결정적 통찰</th>
                    <th className="py-2.5 px-3 font-semibold text-right">상세 보기</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {DEFAULT_WINNERS.map((w, idx) => (
                    <tr
                      key={w.id}
                      onClick={() => scrollToIndividual(w.id)}
                      className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        w.isOverallWinner ? 'bg-amber-950/20 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                          w.isOverallWinner
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-200 border border-slate-700'
                        }`}>
                          {w.isOverallWinner && <Trophy className="w-3 h-3 text-slate-950" />}
                          <span>{w.isOverallWinner ? '종합 대상' : w.sector}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-white">{w.name} 연구원</div>
                        <div className="text-[10px] text-slate-400">{w.brokerName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-black text-amber-400 text-sm">{w.score}점</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-amber-200 font-bold">{w.keyword}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 max-w-md truncate" title={w.marketInsight}>
                        {w.marketInsight}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToIndividual(w.id);
                          }}
                          className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-200 font-bold text-[11px] bg-slate-900 px-2 py-1 rounded border border-slate-800 hover:border-cyan-500"
                        >
                          <span>개별 심사평</span>
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ⭐️ PART 2: 하단 배치 - 개별 수상자별 상세 심사평 & 프롬프트 랩 ⭐️ */}
      {/* ========================================================================= */}
      <section id="individual-review-section" className="space-y-6 pt-4 border-t-2 border-slate-800/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold mb-2">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>개별 수상자 정밀 분석 세션</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>수상자별 개별 상세 심사평 & 프롬프트 랩</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              상단 전체 총평에 이어, 11인 수상자 각 개인의 4대 지표 정량 평가, 대표 발간 리포트, 2026 하반기 전망 및 상장 헌정사를 개별 검토합니다.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIndividualViewMode('report')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                individualViewMode === 'report'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              📄 개별 심사평 리포트
            </button>
            <button
              onClick={() => setIndividualViewMode('prompt_lab')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                individualViewMode === 'prompt_lab'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ⚙️ 개별 프롬프트 랩
            </button>
          </div>
        </div>

        {/* 2-1. 개별 대상자 선택 탭 그리드 (11명) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between">
            <span>검토 대상 연구원 선택 (클릭 시 하단 상세 리포트 갱신)</span>
            <span className="text-amber-400">선택됨: {currentWinner.name} 연구원 ({currentWinner.brokerName})</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {DEFAULT_WINNERS.map(winner => {
              const isSelected = winner.id === selectedWinnerId;
              return (
                <button
                  key={winner.id}
                  onClick={() => setSelectedWinnerId(winner.id)}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? winner.isOverallWinner
                        ? 'bg-gradient-to-br from-amber-950/90 to-yellow-900/60 border-amber-400 shadow-lg shadow-amber-950/60 ring-2 ring-amber-400/50'
                        : 'bg-gradient-to-br from-indigo-950/90 to-blue-900/60 border-cyan-400 shadow-lg shadow-blue-950/60 ring-2 ring-cyan-400/50'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  {winner.isOverallWinner && (
                    <span className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-bl-md">
                      종합대상
                    </span>
                  )}
                  <div className="text-[10px] text-slate-400 font-semibold truncate">
                    {winner.sector}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {winner.name}
                    </span>
                    <span className="text-[11px] font-bold text-amber-400">
                      {winner.score}점
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {winner.brokerName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-2. 개별 심사평 리포트 뷰 */}
        {individualViewMode === 'report' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 print:bg-white print:text-black print:border-none print:shadow-none">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-semibold text-amber-400 mb-2">
                  <span>{currentReport.executiveSummary.badge}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-300">{currentReport.executiveSummary.percentile}</span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {currentReport.reportTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  평가 일시: {currentReport.generatedAt} · 평가 엔진: Gemini 3.8 Flash & 2026 DART 정합성 알고리즘
                </p>
              </div>

              <div className="flex items-center space-x-2 print:hidden">
                <button
                  onClick={() => handleCopy(JSON.stringify(currentReport, null, 2), 'current_report_json')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center space-x-1 cursor-pointer"
                  title="개별 리포트 JSON 복사"
                >
                  {copiedKey === 'current_report_json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'current_report_json' ? '복사됨' : 'JSON 복사'}</span>
                </button>

                <button
                  onClick={handleRunAiEvaluation}
                  disabled={isGenerating}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'AI 재평가 중...' : 'Gemini AI 실시간 재평가'}</span>
                </button>
              </div>
            </div>

            {/* 실시간 Gemini 생성 결과가 있는 경우 표시 */}
            {liveAiReviews[currentWinner.id] && (
              <div className="bg-gradient-to-r from-blue-950/60 via-slate-950 to-indigo-950/60 p-5 rounded-xl border border-cyan-500/50 shadow-inner space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Gemini 3.8 Flash 실시간 작성 심사평 (방금 생성 완료)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(liveAiReviews[currentWinner.id], 'live_md')}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'live_md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'live_md' ? '복사됨' : '마크다운 복사'}</span>
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto border border-slate-800">
                  {liveAiReviews[currentWinner.id]}
                </div>
              </div>
            )}

            {/* 1. 수상 총평 */}
            <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 font-black text-sm">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>1. 수상 총평 (Executive Summary)</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-100 pl-6 border-l-2 border-amber-500">
                "{currentWinner.keyword}"
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                {currentWinner.performanceAnalysis}
              </p>
            </div>

            {/* 2. 4대 핵심 지표 정밀 평가 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-cyan-400 font-black text-sm">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>2. 4대 핵심 지표 정밀 평가 (Quantitative & Qualitative Analysis)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">① 목표주가 적중률 및 궤적 추적 (35%)</span>
                    <span className="text-sm font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
                      {currentWinner.metrics.targetPriceAccuracy}점
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    과거 1년간 제시한 목표주가의 도달률 및 시장 변곡점에서의 주가 괴리율을 철저히 관리하여 섹터 최상위 점수를 획득했습니다.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">② DART 공시 실적 정합성 (25%)</span>
                    <span className="text-sm font-black text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-600/40">
                      {currentWinner.metrics.dartConsistency}점
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    금융감독원 전자공시(DART) 확정 영업이익과의 오차율을 최소화하여 투명한 실적 바로미터를 제공했습니다.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">③ 리포트 적시성과 발간 활동성 (20%)</span>
                    <span className="text-sm font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/40">
                      {currentWinner.metrics.activityScore}점
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    주요 기업의 공급망 이슈 및 업황 저점 통과 시점에 맞추어 선제적인 심층 분석 리포트를 적시에 발간했습니다.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">④ 시장 건전성 및 리스크 경고 (20%)</span>
                    <span className="text-sm font-black text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-600/40">
                      {currentWinner.metrics.marketImpactScore}점
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentWinner.marketInsight}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. 대표 발간 리포트 하이라이트 */}
            <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-black text-sm">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>3. 대표 발간 리포트 하이라이트</span>
              </div>
              <div className="space-y-2 pl-2">
                {currentWinner.keyReports.map((rep, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span className="font-semibold">{rep}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. 2026년 하반기 전망 및 투자자 제언 */}
            <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-black text-sm">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>4. 2026년 하반기 전망 및 투자자 제언</span>
              </div>
              <div className="text-xs text-slate-300 space-y-2 pl-2">
                <p>📌 <strong>핵심 관전 포인트:</strong> {currentWinner.sector} 글로벌 수급 환경과 환율 및 정책 변수 모니터링</p>
                <p>💡 <strong>수석 심사위원 제언:</strong> 단기 테마 추종보다는 DART 공시 확정 실적과 수주 잔고의 질을 검증하는 분할 접근을 권고합니다.</p>
              </div>
            </div>

            {/* 5. 최종 심사위원단 공식 수여사 (Honor Citation) */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-950 to-yellow-950/60 p-6 border border-amber-500/40 shadow-inner">
              <div className="flex items-center space-x-2 text-amber-400 font-black text-sm mb-3">
                <Award className="w-5 h-5 text-amber-400" />
                <span>5. 최종 심사위원단 공식 수여사 (Honor Citation)</span>
              </div>
              <p className="text-sm font-medium text-amber-100/90 leading-relaxed italic border-l-4 border-amber-400 pl-4 py-1">
                "{currentWinner.honorCitation}"
              </p>
              <div className="text-right text-xs text-amber-300 font-bold mt-4">
                리본인텔리전스 · 이코노미스트 2026 올해의 애널리스트 어워즈 독립 공인 AI 심사위원단 배상
              </div>
            </div>
          </div>
        )}

        {/* 2-3. 개별 프롬프트 랩 뷰 */}
        {individualViewMode === 'prompt_lab' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">개별 프롬프트 엔지니어링 랩: {currentWinner.name} 연구원</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  선택된 연구원의 변수가 주입된 5단계 표준 프롬프트를 확인하고, 즉시 수정하여 Gemini AI로 재실행할 수 있습니다.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(editedPrompt, 'ind_prompt_copy')}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-1.5 cursor-pointer hover:text-white"
                >
                  {copiedKey === 'ind_prompt_copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'ind_prompt_copy' ? '프롬프트 복사됨!' : '프롬프트 복사'}</span>
                </button>

                <button
                  onClick={handleRunAiEvaluation}
                  disabled={isGenerating}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{isGenerating ? 'AI 생성 중...' : 'Gemini AI 실행'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              rows={16}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 leading-relaxed resize-y"
            />
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* ⭐️ 상단 전체 프롬프트 모달 ⭐️ */}
      {/* ========================================================================= */}
      {showOverallPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  전체 어워즈 통합 심사평 생성 마스터 프롬프트 전문
                </h3>
              </div>
              <button
                onClick={() => setShowOverallPromptModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto flex-1">
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                {masterOverallPrompt}
              </pre>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-xs text-slate-400">외부 LLM(Gemini, ChatGPT, Claude)에 바로 붙여넣기 하실 수 있습니다.</span>
              <button
                onClick={() => handleCopy(masterOverallPrompt, 'modal_prompt_copy')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
              >
                {copiedKey === 'modal_prompt_copy' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'modal_prompt_copy' ? '복사 완료!' : '프롬프트 전체 복사'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
