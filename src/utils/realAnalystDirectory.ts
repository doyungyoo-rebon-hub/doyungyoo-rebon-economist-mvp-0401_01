export interface VerifiedAnalyst {
  name: string;
  broker: string;
  sector: string;
  verified: boolean;
  pastBrokers?: string[];
  isTransferred?: boolean;
}

export interface MasterAnalystInfo {
  broker: string;
  sector: string;
  pastBrokers?: string[];
  isTransferred?: boolean;
}

export const OFFICIAL_ANALYST_MASTER_ROSTER: Record<string, MasterAnalystInfo> = {
  "한유정": {
    "broker": "한화투자증권",
    "sector": "소비재/유통/음식료",
    "pastBrokers": [
      "KB증권"
    ],
    "isTransferred": true
  },
  "박상준": {
    "broker": "키움증권",
    "sector": "소비재/유통/음식료"
  },
  "김선우": {
    "broker": "메리츠증권",
    "sector": "반도체/IT/전자"
  },
  "전창현": {
    "broker": "대신증권",
    "sector": "2차전지/배터리/소재"
  },
  "이안나": {
    "broker": "교보증권",
    "sector": "바이오/제약/헬스케어"
  },
  "강성진": {
    "broker": "KB증권",
    "sector": "자동차/모빌리티"
  },
  "이한결": {
    "broker": "다올투자증권",
    "sector": "조선/중공업/방산"
  },
  "이선화": {
    "broker": "KB증권",
    "sector": "플랫폼/게임/엔터",
    "pastBrokers": [
      "유진투자증권"
    ],
    "isTransferred": true
  },
  "김인": {
    "broker": "BNK투자증권",
    "sector": "금융/지주",
    "pastBrokers": [
      "유진투자증권"
    ],
    "isTransferred": true
  },
  "이용욱": {
    "broker": "IBK투자증권",
    "sector": "화학/철강/소재"
  },
  "이경신": {
    "broker": "iM증권",
    "sector": "소비재/유통/음식료"
  },
  "조상훈": {
    "broker": "신한투자증권",
    "sector": "소비재/유통/음식료"
  },
  "김명주": {
    "broker": "한국투자증권",
    "sector": "소비재/유통/음식료"
  },
  "남성현": {
    "broker": "IBK투자증권",
    "sector": "소비재/유통/음식료"
  },
  "하희지": {
    "broker": "현대차증권",
    "sector": "소비재/유통/음식료"
  },
  "박은정": {
    "broker": "하나증권",
    "sector": "소비재/유통/음식료"
  },
  "이지은": {
    "broker": "대신증권",
    "sector": "소비재/유통/음식료"
  },
  "오린아": {
    "broker": "LS증권",
    "sector": "소비재/유통/음식료"
  },
  "주영훈": {
    "broker": "유진투자증권",
    "sector": "소비재/유통/음식료"
  },
  "이승우": {
    "broker": "유진투자증권",
    "sector": "반도체/IT/전자"
  },
  "노근창": {
    "broker": "현대차증권",
    "sector": "반도체/IT/전자"
  },
  "박유악": {
    "broker": "키움증권",
    "sector": "반도체/IT/전자"
  },
  "김동원": {
    "broker": "KB증권",
    "sector": "반도체/IT/전자"
  },
  "정원석": {
    "broker": "iM증권",
    "sector": "2차전지/배터리/소재"
  },
  "백길현": {
    "broker": "유안타증권",
    "sector": "반도체/IT/전자"
  },
  "이수빈": {
    "broker": "대신증권",
    "sector": "반도체/IT/전자"
  },
  "채민숙": {
    "broker": "한국투자증권",
    "sector": "반도체/IT/전자",
    "pastBrokers": [
      "유진투자증권",
      "DB금융투자"
    ],
    "isTransferred": true
  },
  "고영민": {
    "broker": "다올투자증권",
    "sector": "반도체/IT/전자"
  },
  "주민우": {
    "broker": "NH투자증권",
    "sector": "2차전지/배터리/소재"
  },
  "김현수": {
    "broker": "하나증권",
    "sector": "2차전지/배터리/소재"
  },
  "권준수": {
    "broker": "키움증권",
    "sector": "2차전지/배터리/소재"
  },
  "박진수": {
    "broker": "신영증권",
    "sector": "2차전지/배터리/소재"
  },
  "윤혁진": {
    "broker": "SK증권",
    "sector": "2차전지/배터리/소재"
  },
  "이창민": {
    "broker": "KB증권",
    "sector": "2차전지/배터리/소재"
  },
  "허혜민": {
    "broker": "키움증권",
    "sector": "바이오/제약/헬스케어"
  },
  "박재경": {
    "broker": "하나증권",
    "sector": "바이오/제약/헬스케어"
  },
  "김승민": {
    "broker": "미래에셋증권",
    "sector": "바이오/제약/헬스케어"
  },
  "권해순": {
    "broker": "유진투자증권",
    "sector": "바이오/제약/헬스케어"
  },
  "이선경": {
    "broker": "SK증권",
    "sector": "바이오/제약/헬스케어"
  },
  "위해주": {
    "broker": "한국투자증권",
    "sector": "바이오/제약/헬스케어"
  },
  "정유경": {
    "broker": "신영증권",
    "sector": "바이오/제약/헬스케어"
  },
  "장민환": {
    "broker": "LS증권",
    "sector": "바이오/제약/헬스케어"
  },
  "하태기": {
    "broker": "상상인증권",
    "sector": "바이오/제약/헬스케어"
  },
  "임은영": {
    "broker": "삼성증권",
    "sector": "자동차/모빌리티"
  },
  "김평모": {
    "broker": "DB금융투자",
    "sector": "자동차/모빌리티"
  },
  "조희승": {
    "broker": "iM증권",
    "sector": "자동차/모빌리티"
  },
  "이병근": {
    "broker": "흥국증권",
    "sector": "자동차/모빌리티"
  },
  "신윤철": {
    "broker": "키움증권",
    "sector": "자동차/모빌리티"
  },
  "유지웅": {
    "broker": "다올투자증권",
    "sector": "자동차/모빌리티"
  },
  "문용권": {
    "broker": "신영증권",
    "sector": "자동차/모빌리티"
  },
  "남주신": {
    "broker": "교보증권",
    "sector": "자동차/모빌리티"
  },
  "김진석": {
    "broker": "미래에셋증권",
    "sector": "자동차/모빌리티"
  },
  "변용진": {
    "broker": "하이투자증권",
    "sector": "조선/중공업/방산"
  },
  "정동익": {
    "broker": "KB증권",
    "sector": "조선/중공업/방산"
  },
  "양승윤": {
    "broker": "유진투자증권",
    "sector": "조선/중공업/방산"
  },
  "위경재": {
    "broker": "하나증권",
    "sector": "조선/중공업/방산"
  },
  "배성조": {
    "broker": "한화투자증권",
    "sector": "조선/중공업/방산"
  },
  "이동헌": {
    "broker": "신한투자증권",
    "sector": "조선/중공업/방산"
  },
  "엄경아": {
    "broker": "신영증권",
    "sector": "조선/중공업/방산"
  },
  "최진명": {
    "broker": "교보증권",
    "sector": "조선/중공업/방산"
  },
  "곽민정": {
    "broker": "현대차증권",
    "sector": "조선/중공업/방산"
  },
  "이기훈": {
    "broker": "하나증권",
    "sector": "플랫폼/게임/엔터"
  },
  "안도영": {
    "broker": "한국투자증권",
    "sector": "플랫폼/게임/엔터"
  },
  "김소혜": {
    "broker": "한화투자증권",
    "sector": "플랫폼/게임/엔터"
  },
  "정의훈": {
    "broker": "유진투자증권",
    "sector": "플랫폼/게임/엔터"
  },
  "김하정": {
    "broker": "다올투자증권",
    "sector": "플랫폼/게임/엔터"
  },
  "임희석": {
    "broker": "미래에셋증권",
    "sector": "플랫폼/게임/엔터"
  },
  "정호윤": {
    "broker": "한국투자증권",
    "sector": "플랫폼/게임/엔터"
  },
  "오동환": {
    "broker": "삼성증권",
    "sector": "플랫폼/게임/엔터"
  },
  "이효진": {
    "broker": "메리츠증권",
    "sector": "플랫폼/게임/엔터"
  },
  "정준섭": {
    "broker": "NH투자증권",
    "sector": "금융/지주"
  },
  "백두산": {
    "broker": "한국투자증권",
    "sector": "금융/지주"
  },
  "박혜진": {
    "broker": "대신증권",
    "sector": "금융/지주"
  },
  "조아해": {
    "broker": "메리츠증권",
    "sector": "금융/지주"
  },
  "설용진": {
    "broker": "SK증권",
    "sector": "금융/지주"
  },
  "김도하": {
    "broker": "한화투자증권",
    "sector": "금융/지주"
  },
  "은경완": {
    "broker": "신한투자증권",
    "sector": "금융/지주"
  },
  "강승건": {
    "broker": "KB증권",
    "sector": "금융/지주"
  },
  "우도형": {
    "broker": "IBK투자증권",
    "sector": "금융/지주"
  },
  "박광래": {
    "broker": "신한투자증권",
    "sector": "화학/철강/소재"
  },
  "윤재성": {
    "broker": "하나증권",
    "sector": "화학/철강/소재"
  },
  "이동욱": {
    "broker": "IBK투자증권",
    "sector": "화학/철강/소재"
  },
  "이진명": {
    "broker": "신한투자증권",
    "sector": "화학/철강/소재"
  },
  "백영찬": {
    "broker": "상상인증권",
    "sector": "화학/철강/소재"
  },
  "박현욱": {
    "broker": "현대차증권",
    "sector": "화학/철강/소재"
  },
  "이유진": {
    "broker": "유진투자증권",
    "sector": "화학/철강/소재"
  },
  "이현욱": {
    "broker": "IBK투자증권",
    "sector": "화학/철강/소재"
  },
  "전우제": {
    "broker": "KB증권",
    "sector": "화학/철강/소재"
  },
  "이은상": {
    "broker": "NH투자증권",
    "sector": "건설/물류/기타"
  },
  "문경원": {
    "broker": "메리츠증권",
    "sector": "건설/물류/기타"
  },
  "배세호": {
    "broker": "하이투자증권",
    "sector": "건설/물류/기타"
  },
  "송유림": {
    "broker": "한화투자증권",
    "sector": "건설/물류/기타"
  },
  "신동현": {
    "broker": "현대차증권",
    "sector": "건설/물류/기타"
  },
  "김기룡": {
    "broker": "미래에셋증권",
    "sector": "건설/물류/기타"
  },
  "박세라": {
    "broker": "신영증권",
    "sector": "건설/물류/기타"
  },
  "장문준": {
    "broker": "KB증권",
    "sector": "건설/물류/기타"
  },
  "백광제": {
    "broker": "교보증권",
    "sector": "건설/물류/기타"
  },
  "지인해": {
    "broker": "신한투자증권",
    "sector": "플랫폼/게임/엔터",
    "pastBrokers": [
      "한화투자증권"
    ],
    "isTransferred": true
  },
  "신민수": {
    "broker": "키움증권",
    "sector": "바이오/제약/헬스케어"
  },
  "정태준": {
    "broker": "미래에셋증권",
    "sector": "금융/지주",
    "pastBrokers": [
      "유안타증권"
    ]
  },
  "이민희": {
    "broker": "BNK투자증권",
    "sector": "반도체/IT/전자",
    "pastBrokers": [
      "유진투자증권"
    ],
    "isTransferred": true
  },
  "류제현": {
    "broker": "미래에셋증권",
    "sector": "건설/물류/기타"
  },
  "양지환": {
    "broker": "대신증권",
    "sector": "건설/물류/기타"
  },
  "최보영": {
    "broker": "교보증권",
    "sector": "반도체/IT/전자"
  },
  "박성봉": {
    "broker": "하나증권",
    "sector": "화학/철강/소재"
  },
  "오진원": {
    "broker": "하나증권",
    "sector": "금융/지주"
  },
  "백재승": {
    "broker": "삼성증권",
    "sector": "화학/철강/소재"
  }
};

export const VERIFIED_ANALYSTS: Record<string, VerifiedAnalyst> = {
  "한유정___한화투자증권": { name: "한유정", broker: "한화투자증권", sector: "소비재/유통/음식료", verified: true, pastBrokers: ["KB증권"] },
  "김선우___메리츠증권": { name: "김선우", broker: "메리츠증권", sector: "반도체/IT/전자", verified: true },
  "전창현___대신증권": { name: "전창현", broker: "대신증권", sector: "2차전지/배터리/소재", verified: true },
  "이안나___교보증권": { name: "이안나", broker: "교보증권", sector: "바이오/제약/헬스케어", verified: true },
  "강성진___KB증권": { name: "강성진", broker: "KB증권", sector: "자동차/모빌리티", verified: true },
  "이한결___다올투자증권": { name: "이한결", broker: "다올투자증권", sector: "조선/중공업/방산", verified: true },
  "이선화___KB증권": { name: "이선화", broker: "KB증권", sector: "플랫폼/게임/엔터", verified: true, pastBrokers: ["유진투자증권"] },
  "김인___BNK투자증권": { name: "김인", broker: "BNK투자증권", sector: "금융/지주", verified: true, pastBrokers: ["유진투자증권"] },
  "채민숙___한국투자증권": { name: "채민숙", broker: "한국투자증권", sector: "반도체/IT/전자", verified: true, pastBrokers: ["유진투자증권", "DB금융투자"] },
  "김동원___KB증권": { name: "김동원", broker: "KB증권", sector: "반도체/IT/전자", verified: true },
  "지인해___신한투자증권": { name: "지인해", broker: "신한투자증권", sector: "플랫폼/게임/엔터", verified: true, pastBrokers: ["한화투자증권"] },
  "신민수___키움증권": { name: "신민수", broker: "키움증권", sector: "바이오/제약/헬스케어", verified: true },
  "유지웅___다올투자증권": { name: "유지웅", broker: "다올투자증권", sector: "자동차/모빌리티", verified: true },
  "정태준___미래에셋증권": { name: "정태준", broker: "미래에셋증권", sector: "금융/지주", verified: true, pastBrokers: ["유안타증권"] },
  "이민희___BNK투자증권": { name: "이민희", broker: "BNK투자증권", sector: "반도체/IT/전자", verified: true, pastBrokers: ["유진투자증권"] },
  "류제현___미래에셋증권": { name: "류제현", broker: "미래에셋증권", sector: "건설/물류/기타", verified: true },
  "양지환___대신증권": { name: "양지환", broker: "대신증권", sector: "건설/물류/기타", verified: true },
  "이용욱___IBK투자증권": { name: "이용욱", broker: "IBK투자증권", sector: "화학/철강/소재", verified: true }
};

export function lookupVerifiedDirectoryAnalyst(name: string, broker?: string): VerifiedAnalyst | null {
  const cleanName = String(name || "").trim();
  const cleanBroker = String(broker || "").trim();
  const key = `${cleanName}___${cleanBroker}`;
  if (VERIFIED_ANALYSTS[key]) return VERIFIED_ANALYSTS[key];

  if (OFFICIAL_ANALYST_MASTER_ROSTER[cleanName]) {
    const info = OFFICIAL_ANALYST_MASTER_ROSTER[cleanName];
    return {
      name: cleanName,
      broker: info.broker,
      sector: info.sector,
      verified: true,
      pastBrokers: info.pastBrokers,
      isTransferred: info.isTransferred
    };
  }

  // Try finding by name in VERIFIED_ANALYSTS
  for (const item of Object.values(VERIFIED_ANALYSTS)) {
    if (item.name === cleanName) {
      return item;
    }
  }
  return null;
}
