export interface VerifiedAnalyst {
  name: string;
  broker: string;
  sector: string;
  verified: boolean;
}

export const VERIFIED_ANALYSTS: Record<string, VerifiedAnalyst> = {
  "한유정___한화투자증권": { name: "한유정", broker: "한화투자증권", sector: "소비재/유통/음식료", verified: true },
  "김선우___메리츠증권": { name: "김선우", broker: "메리츠증권", sector: "반도체/IT/전자", verified: true },
  "전창현___대신증권": { name: "전창현", broker: "대신증권", sector: "2차전지/배터리/소재", verified: true },
  "이안나___교보증권": { name: "이안나", broker: "교보증권", sector: "바이오/제약/헬스케어", verified: true },
  "강성진___KB증권": { name: "강성진", broker: "KB증권", sector: "자동차/모빌리티", verified: true },
  "이한결___다올투자증권": { name: "이한결", broker: "다올투자증권", sector: "조선/중공업/방산", verified: true },
  "이선화___KB증권": { name: "이선화", broker: "KB증권", sector: "플랫폼/게임/엔터", verified: true },
  "김인___유진투자증권": { name: "김인", broker: "유진투자증권", sector: "금융/지주", verified: true },
  "이용욱___IBK투자증권": { name: "이용욱", broker: "IBK투자증권", sector: "화학/철강/소재", verified: true },
  "김인___현대차증권": { name: "김인", broker: "현대차증권", sector: "건설/물류/기타", verified: true }
};

export function lookupVerifiedDirectoryAnalyst(name: string, broker?: string): VerifiedAnalyst | null {
  const cleanName = String(name || "").trim();
  const cleanBroker = String(broker || "").trim();
  const key = `${cleanName}___${cleanBroker}`;
  if (VERIFIED_ANALYSTS[key]) return VERIFIED_ANALYSTS[key];

  // Try finding by name
  for (const item of Object.values(VERIFIED_ANALYSTS)) {
    if (item.name === cleanName) {
      return item;
    }
  }
  return null;
}
