export const STANDARD_10_SECTORS = [
  "소비재/유통/음식료",
  "반도체/IT/전자",
  "2차전지/배터리/소재",
  "바이오/제약/헬스케어",
  "자동차/모빌리티",
  "조선/중공업/방산",
  "플랫폼/게임/엔터",
  "금융/지주",
  "화학/철강/소재",
  "건설/물류/기타"
] as const;

export type StandardSector = typeof STANDARD_10_SECTORS[number];

export function getCanonicalSector(rawSector?: string): StandardSector {
  if (!rawSector) return "건설/물류/기타";
  const s = String(rawSector).trim();
  if (s.includes("반도체") || s.includes("IT") || s.includes("전자") || s.includes("디스플레이")) return "반도체/IT/전자";
  if (s.includes("2차전지") || s.includes("배터리") || s.includes("2차 전지")) return "2차전지/배터리/소재";
  if (s.includes("바이오") || s.includes("제약") || s.includes("헬스케어") || s.includes("의료")) return "바이오/제약/헬스케어";
  if (s.includes("자동차") || s.includes("모빌리티") || s.includes("운송장비") || s.includes("부품")) return "자동차/모빌리티";
  if (s.includes("조선") || s.includes("중공업") || s.includes("방산") || s.includes("기계")) return "조선/중공업/방산";
  if (s.includes("플랫폼") || s.includes("게임") || s.includes("엔터") || s.includes("미디어") || s.includes("소프트웨어")) return "플랫폼/게임/엔터";
  if (s.includes("금융") || s.includes("은행") || s.includes("증권") || s.includes("보험") || s.includes("지주")) return "금융/지주";
  if (s.includes("화학") || s.includes("철강") || s.includes("정유") || s.includes("비철금속")) return "화학/철강/소재";
  if (s.includes("소비재") || s.includes("유통") || s.includes("음식료") || s.includes("화장품") || s.includes("패션")) return "소비재/유통/음식료";
  return "건설/물류/기타";
}
