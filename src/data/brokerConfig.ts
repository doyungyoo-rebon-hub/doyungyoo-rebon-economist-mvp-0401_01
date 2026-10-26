/**
 * 국내 증권사 평가 및 시상 운영 규정 (v1.8.2)
 *
 * 1. 공식 대상 증권사 (24개사):
 *    미래에셋증권, NH투자증권, 하나증권, LS증권, KB증권, BNK투자증권, DB증권, DS투자증권,
 *    SK증권, 교보증권, 다올투자증권, 리딩투자증권, 메리츠증권, 상상인증권, 신영증권, 신한투자증권,
 *    유안타증권, 유진투자증권, 키움증권, 토스증권, 한국투자증권, 한양증권, 현대차증권, 흥국증권
 *
 * 2. 평가 진행 / 시상 제외 증권사 (5개사):
 *    IBK투자증권, 삼성증권, 한국투자증권, 대신증권, iM증권
 *    - 원칙: 시장의 객관적 벤치마크 확립과 리포트 전수 신뢰성을 위해 7대 AI KPI 평가는 100% 동일하게 진행
 *    - 시상: 컴플라이언스 및 자체 규정에 따라 올해의 애널리스트 공식 수상(트로피/상패) 대상에서는 제외
 */

export const TARGET_24_BROKERS = [
  '미래에셋증권',
  'NH투자증권',
  '하나증권',
  'LS증권',
  'KB증권',
  'BNK투자증권',
  'DB증권',
  'DS투자증권',
  'SK증권',
  '교보증권',
  '다올투자증권',
  '리딩투자증권',
  '메리츠증권',
  '상상인증권',
  '신영증권',
  '신한투자증권',
  '유안타증권',
  '유진투자증권',
  '키움증권',
  '토스증권',
  '한국투자증권',
  '한양증권',
  '현대차증권',
  '흥국증권'
] as const;

export const AWARD_EXCLUDED_BROKERS = [
  'IBK투자증권',
  '삼성증권',
  '한국투자증권',
  '대신증권',
  'iM증권'
] as const;

/**
 * 24개 공식 대상사 + 평가 진행(시상 제외 5개사 중 중복 제외) 통합 풀
 */
export const ALL_EVALUATED_BROKERS = Array.from(
  new Set([
    ...TARGET_24_BROKERS,
    ...AWARD_EXCLUDED_BROKERS,
    'DB금융투자' // DB증권의 이전 명칭 호환
  ])
);

/**
 * 증권사 명칭 정규화 (DB금융투자 -> DB증권)
 */
export function normalizeBrokerName(name: string): string {
  if (!name) return '';
  if (name === 'DB금융투자') return 'DB증권';
  return name;
}

/**
 * 해당 증권사가 시상 제외(평가 전용 5개사)에 해당하는지 판별
 */
export function isAwardExcludedBroker(brokerName: string): boolean {
  if (!brokerName) return false;
  const normalized = normalizeBrokerName(brokerName);
  return AWARD_EXCLUDED_BROKERS.some(
    (b) => normalized === b || brokerName.includes(b.replace('증권', ''))
  );
}

/**
 * 해당 증권사가 24개 공식 대상사에 해당하는지 판별
 */
export function isTarget24Broker(brokerName: string): boolean {
  if (!brokerName) return false;
  const normalized = normalizeBrokerName(brokerName);
  return TARGET_24_BROKERS.some(
    (b) => normalized === b || brokerName.includes(b.replace('증권', ''))
  );
}

export interface BrokerAwardStatus {
  isTarget24: boolean;
  isAwardExcluded: boolean;
  category: 'TARGET_AWARD_ELIGIBLE' | 'TARGET_AWARD_EXCLUDED' | 'EVALUATION_ONLY_EXCLUDED' | 'OTHER';
  label: string;
  badgeClass: string;
  policyNote: string;
}

export function getBrokerAwardStatus(brokerName: string): BrokerAwardStatus {
  const isExcluded = isAwardExcludedBroker(brokerName);
  const isTarget = isTarget24Broker(brokerName);

  if (isExcluded) {
    return {
      isTarget24: isTarget,
      isAwardExcluded: true,
      category: isTarget ? 'TARGET_AWARD_EXCLUDED' : 'EVALUATION_ONLY_EXCLUDED',
      label: '시상 제외 (평가 대상)',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      policyNote: 'v1.8.2 규정에 따라 성과 평가는 전수 집계되나 컴플라이언스 기준상 공식 시상(트로피) 대상에서 제외됩니다.'
    };
  }

  if (isTarget) {
    return {
      isTarget24: true,
      isAwardExcluded: false,
      category: 'TARGET_AWARD_ELIGIBLE',
      label: '공식 시상 대상 (24개사)',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      policyNote: '2026 어워즈 공식 24개 대상 증권사로 정규 시상 적격 자격을 보유합니다.'
    };
  }

  return {
    isTarget24: false,
    isAwardExcluded: false,
    category: 'OTHER',
    label: '일반 평가 대상',
    badgeClass: 'bg-slate-700/50 text-slate-300 border-slate-600',
    policyNote: '전체 리서치 마스터 DB 연동 평가 대상 증권사입니다.'
  };
}

export const BROKER_POLICY_V182 = {
  version: '1.8.2',
  title: 'v1.8.2 증권사 평가 및 시상 운영 규정',
  summary: '전체 32개 증권사 중 엄선된 24개 공식 대상 증권사 확정 및 5개사(IBK·삼성·한국투자·대신·iM) 평가 진행·시상 제외 규정 적용',
  effectiveDate: '2026.10',
  rules: [
    {
      title: '공식 대상 증권사 24개사 체계 확립',
      description: '국내 리서치 시장 핵심 24개사를 정규 심사 대상사로 확정하여 평가의 대표성과 산업 집중도를 극대화했습니다.'
    },
    {
      title: '5개 증권사 평가 진행 및 시상 제외 규정 준수',
      description: 'IBK투자증권, 삼성증권, 한국투자증권, 대신증권, iM증권 5개사는 컴플라이언스 및 사내 규정에 따라 공식 시상(트로피/상패) 대상에서는 제외하되, 시장 분석의 객관적 벤치마크 보존을 위해 AI 7대 KPI 성과 평가는 100% 동일하게 산정 및 공개합니다.'
    },
    {
      title: '다차원 시상 적격 필터링 및 투명성 뱃지 도입',
      description: '시상 리더보드 및 연구원 프로필에 [공식 시상 대상] 및 [시상 제외 (평가 대상)] 뱃지를 상시 표출하여 투자자와 업계의 정보 혼선을 완벽히 방지합니다.'
    }
  ]
};

export const BROKER_POLICY_V181 = BROKER_POLICY_V182;
