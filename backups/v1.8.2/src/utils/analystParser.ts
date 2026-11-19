import { lookupVerifiedDirectoryAnalyst } from './realAnalystDirectory.ts';

export function resolveReportAnalyst(rawText: string, brokerHint?: string): { name: string; broker: string } {
  if (!rawText) return { name: "미지정", broker: brokerHint || "국내증권사" };

  let clean = String(rawText).trim();
  // Strip common suffixes
  clean = clean.replace(/(연구원|애널리스트|수석|위원|팀장|책임|선임)/g, "").trim();

  // If contains broker name
  const brokerList = [
    "한화투자증권", "메리츠증권", "대신증권", "교보증권", "KB증권", 
    "다올투자증권", "유진투자증권", "IBK투자증권", "현대차증권", "미래에셋증권",
    "한국투자증권", "NH투자증권", "삼성증권", "신한투자증권", "하나증권"
  ];

  let detectedBroker = brokerHint || "KB증권";
  for (const b of brokerList) {
    if (clean.includes(b)) {
      detectedBroker = b;
      clean = clean.replace(b, "").trim();
      break;
    }
  }

  const verified = lookupVerifiedDirectoryAnalyst(clean, detectedBroker);
  if (verified) {
    return { name: verified.name, broker: verified.broker };
  }

  return {
    name: clean.length > 1 ? clean.slice(0, 4) : "애널리스트",
    broker: detectedBroker
  };
}
