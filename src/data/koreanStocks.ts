export interface StockInfo {
  code: string;
  name: string;
  sector: string;
  market?: string;
}

export const KOREAN_TOP_STOCKS: StockInfo[] = [
  { code: "005930", name: "삼성전자", sector: "반도체/IT/전자", market: "KOSPI" },
  { code: "000660", name: "SK하이닉스", sector: "반도체/IT/전자", market: "KOSPI" },
  { code: "373220", name: "LG에너지솔루션", sector: "2차전지/배터리/소재", market: "KOSPI" },
  { code: "207940", name: "삼성바이오로직스", sector: "바이오/제약/헬스케어", market: "KOSPI" },
  { code: "005380", name: "현대차", sector: "자동차/모빌리티", market: "KOSPI" },
  { code: "000270", name: "기아", sector: "자동차/모빌리티", market: "KOSPI" },
  { code: "035420", name: "NAVER", sector: "플랫폼/게임/엔터", market: "KOSPI" },
  { code: "105560", name: "KB금융", sector: "금융/지주", market: "KOSPI" },
  { code: "005490", name: "POSCO홀딩스", sector: "화학/철강/소재", market: "KOSPI" },
  { code: "003230", name: "삼양식품", sector: "소비재/유통/음식료", market: "KOSPI" },
  { code: "329180", name: "HD현대중공업", sector: "조선/중공업/방산", market: "KOSPI" },
  { code: "012330", name: "현대모비스", sector: "자동차/모빌리티", market: "KOSPI" },
  { code: "055550", name: "신한지주", sector: "금융/지주", market: "KOSPI" },
  { code: "035720", name: "카카오", sector: "플랫폼/게임/엔터", market: "KOSPI" },
  { code: "068270", name: "셀트리온", sector: "바이오/제약/헬스케어", market: "KOSPI" },
  { code: "086520", name: "에코프로", sector: "2차전지/배터리/소재", market: "KOSDAQ" },
  { code: "247540", name: "에코프로비엠", sector: "2차전지/배터리/소재", market: "KOSDAQ" },
  { code: "047810", name: "한국항공우주", sector: "조선/중공업/방산", market: "KOSPI" },
  { code: "000720", name: "현대건설", sector: "건설/물류/기타", market: "KOSPI" },
  { code: "010130", name: "고려아연", sector: "화학/철강/소재", market: "KOSPI" }
];

export const KOREAN_ALL_STOCKS: StockInfo[] = [
  ...KOREAN_TOP_STOCKS,
  { code: "051910", name: "LG화학", sector: "화학/철강/소재", market: "KOSPI" },
  { code: "096770", name: "SK이노베이션", sector: "화학/철강/소재", market: "KOSPI" },
  { code: "010950", name: "S-Oil", sector: "화학/철강/소재", market: "KOSPI" },
  { code: "009540", name: "HD한국조선해양", sector: "조선/중공업/방산", market: "KOSPI" },
  { code: "042660", name: "한화오션", sector: "조선/중공업/방산", market: "KOSPI" },
  { code: "012450", name: "한화에어로스페이스", sector: "조선/중공업/방산", market: "KOSPI" },
  { code: "078930", name: "GS", sector: "금융/지주", market: "KOSPI" },
  { code: "086790", name: "하나금융지주", sector: "금융/지주", market: "KOSPI" },
  { code: "316140", name: "우리금융지주", sector: "금융/지주", market: "KOSPI" },
  { code: "036570", name: "엔씨소프트", sector: "플랫폼/게임/엔터", market: "KOSPI" },
  { code: "259960", name: "크래프톤", sector: "플랫폼/게임/엔터", market: "KOSPI" },
  { code: "352820", name: "하이브", sector: "플랫폼/게임/엔터", market: "KOSPI" },
  { code: "028260", name: "삼성물산", sector: "건설/물류/기타", market: "KOSPI" },
  { code: "006360", name: "GS건설", sector: "건설/물류/기타", market: "KOSPI" },
  { code: "000100", name: "유한양행", sector: "바이오/제약/헬스케어", market: "KOSPI" },
  { code: "128940", name: "한미약품", sector: "바이오/제약/헬스케어", market: "KOSPI" },
  { code: "097950", name: "CJ제일제당", sector: "소비재/유통/음식료", market: "KOSPI" },
  { code: "023530", name: "롯데쇼핑", sector: "소비재/유통/음식료", market: "KOSPI" },
  { code: "139480", name: "이마트", sector: "소비재/유통/음식료", market: "KOSPI" },
  { code: "090430", name: "아모레퍼시픽", sector: "소비재/유통/음식료", market: "KOSPI" }
];
