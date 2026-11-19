// src/services/scenarioPresetService.ts
// AI 가상 리포트 생성기 시나리오 프리셋 관리 및 향후 학습/관리 연동 서비스

import { BioModelParameters, DEFAULT_ALTEOGEN_BIO_PARAMS, calculateWhiteBoxEvaluation } from './financialMathEngine';

export interface ValuationScenarioPreset {
  id: string;
  name: string;
  description: string;
  category: 'guidance' | 'consensus' | 'bull' | 'bear' | 'custom';
  createdAt: string;
  isBuiltIn?: boolean;
  params: BioModelParameters;
  metrics: {
    targetPrice: number;
    upsidePct: number;
    annualRoyaltyKrw: number;
    pipelineDcfKrw: number;
    equityValueKrw: number;
  };
  notes?: string;
}

const STORAGE_KEY = 'alteogen_valuation_scenario_presets_v1';

// 사전 정의된 4대 표준 시나리오 프리셋
export const BUILT_IN_SCENARIOS: ValuationScenarioPreset[] = [
  {
    id: 'preset_base_guidance',
    name: 'MSD 가이던스 보수적 기준 (Base)',
    description: 'MSD 공식 IR 가이던스(출시 18~24개월 내 30~40% 전환)의 중간값 35%와 보도된 표준 로열티 2.0%를 적용한 보수적 정적 DCF 모형',
    category: 'guidance',
    createdAt: '2026-11-05',
    isBuiltIn: true,
    params: {
      ...DEFAULT_ALTEOGEN_BIO_PARAMS,
      scConversionRate: 0.35,
      royaltyRate: 0.02,
      waccRate: 0.095,
      otherPartnershipsAnnualKrw: 500,
      milestoneExpectedYearKrw: 500
    },
    metrics: {
      targetPrice: 75000,
      upsidePct: -80.4,
      annualRoyaltyKrw: 2705,
      pipelineDcfKrw: 37947,
      equityValueKrw: 41447
    },
    notes: '키트루다 피크 매출 $28B, 환율 1,380원, 순현금 3,500억원 반영. 출시 초기 1개년 정적 관점.'
  },
  {
    id: 'preset_street_consensus',
    name: '증권사 멀티이어 컨센서스 (Street)',
    description: '2028년 IV 특허만료 후 SC 전환율 급증(65%) 및 누적 처방액 증가에 따른 슬라이딩 로열티 구간(3.2%)을 반영한 증권가 모델',
    category: 'consensus',
    createdAt: '2026-11-05',
    isBuiltIn: true,
    params: {
      ...DEFAULT_ALTEOGEN_BIO_PARAMS,
      scConversionRate: 0.65,
      royaltyRate: 0.032,
      waccRate: 0.090,
      otherPartnershipsAnnualKrw: 1200,
      milestoneExpectedYearKrw: 800
    },
    metrics: {
      targetPrice: 200000,
      upsidePct: -47.7,
      annualRoyaltyKrw: 8037,
      pipelineDcfKrw: 102967,
      equityValueKrw: 106467
    },
    notes: '대신증권(45만), 신한투자증권(54만) 등 국내 주요 증권사들이 가정하는 2028년 이후 SC 급격 전환 시나리오의 중간 단계.'
  },
  {
    id: 'preset_bull_expansion',
    name: '키트루다 독점 & 파트너십 확장 (Bull)',
    description: '키트루다 피크 SC 전환율 75%, 계단식 로열티 상단 4.0%, 다이이찌산쿄 엔허투 ADC SC 및 GSK/바이오젠 연간 기술료 2,000억원 반영',
    category: 'bull',
    createdAt: '2026-11-05',
    isBuiltIn: true,
    params: {
      ...DEFAULT_ALTEOGEN_BIO_PARAMS,
      scConversionRate: 0.75,
      royaltyRate: 0.040,
      waccRate: 0.085,
      otherPartnershipsAnnualKrw: 2000,
      milestoneExpectedYearKrw: 1200
    },
    metrics: {
      targetPrice: 320000,
      upsidePct: -16.3,
      annualRoyaltyKrw: 11592,
      pipelineDcfKrw: 167906,
      equityValueKrw: 171406
    },
    notes: '피하주사 제형의 완전한 표준치료제 등극 및 2043년까지의 ALT-B4 특허 독점권이 극대화되는 가설.'
  },
  {
    id: 'preset_bear_litigation',
    name: '보수적 방어 및 분쟁 리스크 (Bear)',
    description: '할로자임 소송 장기화 리스크 프리미엄(WACC 11.0%), 전환 속도 지연(25%), 최저 로열티 1.5%를 가정한 하방 방어 시나리오',
    category: 'bear',
    createdAt: '2026-11-05',
    isBuiltIn: true,
    params: {
      ...DEFAULT_ALTEOGEN_BIO_PARAMS,
      scConversionRate: 0.25,
      royaltyRate: 0.015,
      waccRate: 0.110,
      otherPartnershipsAnnualKrw: 300,
      milestoneExpectedYearKrw: 200
    },
    metrics: {
      targetPrice: 39000,
      upsidePct: -89.8,
      annualRoyaltyKrw: 1449,
      pipelineDcfKrw: 17264,
      equityValueKrw: 20764
    },
    notes: '최악의 환경에서도 보유 순현금 3,500억원과 기본 마일스톤으로 보장되는 안전마진 영역.'
  }
];

// 로컬 스토리지에서 시나리오 목록 가져오기 (내장 프리셋 + 사용자 저장 프리셋)
export const getScenarioPresets = (): ValuationScenarioPreset[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return BUILT_IN_SCENARIOS;
    const userCustom: ValuationScenarioPreset[] = JSON.parse(raw);
    return [...BUILT_IN_SCENARIOS, ...userCustom];
  } catch (err) {
    console.error('Failed to load scenario presets from storage', err);
    return BUILT_IN_SCENARIOS;
  }
};

// 사용자 정의 시나리오 저장
export const saveCustomScenarioPreset = (
  name: string,
  description: string,
  params: BioModelParameters,
  notes?: string
): ValuationScenarioPreset => {
  const evalResult = calculateWhiteBoxEvaluation(params);
  const newPreset: ValuationScenarioPreset = {
    id: `custom_${Date.now()}`,
    name: name.trim() || '사용자 커스텀 시나리오',
    description: description.trim() || '사용자가 직접 조정한 가설 파라미터 조합',
    category: 'custom',
    createdAt: new Date().toISOString().split('T')[0],
    isBuiltIn: false,
    params: { ...params },
    metrics: {
      targetPrice: evalResult.valuation.targetPriceRounded,
      upsidePct: evalResult.valuation.upsidePct,
      annualRoyaltyKrw: evalResult.valuation.annualRoyaltyKrw,
      pipelineDcfKrw: evalResult.valuation.pipelineDcfKrw,
      equityValueKrw: evalResult.valuation.equityValueKrw
    },
    notes: notes || '사용자 저장 슬롯'
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: ValuationScenarioPreset[] = raw ? JSON.parse(raw) : [];
    const updated = [newPreset, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save custom scenario preset', err);
  }

  return newPreset;
};

// 사용자 정의 시나리오 삭제
export const deleteCustomScenarioPreset = (id: string): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const existing: ValuationScenarioPreset[] = JSON.parse(raw);
    const updated = existing.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to delete custom scenario preset', err);
    return false;
  }
};

// JSON 내보내기
export const exportScenariosAsJson = (): string => {
  const allPresets = getScenarioPresets();
  return JSON.stringify(allPresets, null, 2);
};

// JSON 가져오기
export const importScenariosFromJson = (jsonStr: string): number => {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) throw new Error('JSON format is not an array');
    
    // 유효한 프리셋만 필터링
    const valid = parsed.filter(item => item && item.name && item.params && item.category === 'custom');
    if (valid.length === 0) return 0;

    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: ValuationScenarioPreset[] = raw ? JSON.parse(raw) : [];
    
    // ID 중복 방지
    const existingIds = new Set(existing.map(p => p.id));
    const toAdd = valid.filter(p => !existingIds.has(p.id));

    const updated = [...toAdd, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return toAdd.length;
  } catch (err) {
    console.error('Failed to import scenarios from JSON', err);
    return 0;
  }
};
