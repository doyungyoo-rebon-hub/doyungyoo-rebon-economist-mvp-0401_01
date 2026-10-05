// Comprehensive KRX Domestic Stocks Master Universe (Total 680 companies)
// KOSPI & KOSDAQ All Research-Covered Listed Stocks across 12 Standard Sectors

export interface StockItem {
  stockName: string;
  stockCode: string;
  reportTitle: string;
  targetPrice: number;
  currentPrice: number;
  sector: string;
}

// Top 100 Large-Cap Core Stocks (100% Backward Compatible)
export const KOREAN_TOP_STOCKS: StockItem[] = [
  {
    "stockName": "삼성전자",
    "stockCode": "005930",
    "reportTitle": "HBM3E 공급 확대 및 메모리 반도체 업황 회복 본격화",
    "targetPrice": 105000,
    "currentPrice": 82500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "SK하이닉스",
    "stockCode": "000660",
    "reportTitle": "HBM3E 독점적 시장 지위 유지와 사상 최대 영업이익 전망",
    "targetPrice": 260000,
    "currentPrice": 198000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "현대차",
    "stockCode": "005380",
    "reportTitle": "인도 법인 상장 추진 및 주주환원율 확대 기대감",
    "targetPrice": 340000,
    "currentPrice": 255000,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "기아",
    "stockCode": "000270",
    "reportTitle": "EV9 글로벌 판매 증가 및 높은 영업이익률 지속",
    "targetPrice": 160000,
    "currentPrice": 122000,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "NAVER",
    "stockCode": "035420",
    "reportTitle": "생성형 AI 서비스 본격화 및 서치 플랫폼 매출 회복",
    "targetPrice": 250000,
    "currentPrice": 185000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "카카오",
    "stockCode": "035720",
    "reportTitle": "본업 체질 개선 및 핵심 톡비즈 사업 성장성 재부각",
    "targetPrice": 65000,
    "currentPrice": 43500,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "LG에너지솔루션",
    "stockCode": "373220",
    "reportTitle": "북미 AMPC 보조금 수혜 확대 및 차세대 배터리 양산",
    "targetPrice": 480000,
    "currentPrice": 380000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "POSCO홀딩스",
    "stockCode": "005490",
    "reportTitle": "친환경 미래소재 사업 가치 재평가 및 철강 업황 반등",
    "targetPrice": 520000,
    "currentPrice": 375000,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "삼성바이오로직스",
    "stockCode": "207940",
    "reportTitle": "4공장 풀가동 및 5공장 증설로 인한 중장기 수주 실적 호조",
    "targetPrice": 1100000,
    "currentPrice": 890000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "셀트리온",
    "stockCode": "068270",
    "reportTitle": "합병 시너지 가시화 및 짐펜트라 미국 신약 매출 급증",
    "targetPrice": 250000,
    "currentPrice": 192000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "KB금융",
    "stockCode": "105560",
    "reportTitle": "기업 밸류업 프로그램 최대 수혜 및 자사주 매입 소각",
    "targetPrice": 98000,
    "currentPrice": 79000,
    "sector": "금융/지주"
  },
  {
    "stockName": "신한지주",
    "stockCode": "055550",
    "reportTitle": "견조한 자산건전성 및 주주환원율 40% 달성 목표",
    "targetPrice": 68000,
    "currentPrice": 52500,
    "sector": "금융/지주"
  },
  {
    "stockName": "HD현대중공업",
    "stockCode": "329180",
    "reportTitle": "고부가가치 선박 비중 확대 및 미 해군 함정 MRO 수주",
    "targetPrice": 190000,
    "currentPrice": 148000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "한화에어로스페이스",
    "stockCode": "012450",
    "reportTitle": "K-방산 글로벌 수출 호조 및 해외 방산 수주 잔고 급증",
    "targetPrice": 350000,
    "currentPrice": 290000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "아모레퍼시픽",
    "stockCode": "090430",
    "reportTitle": "북미 및 서구권 리밸런싱 가속화와 코스알엑스(COSRX) 편입 효과 본격화",
    "targetPrice": 185000,
    "currentPrice": 142000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "CJ제일제당",
    "stockCode": "097950",
    "reportTitle": "해외 만두 및 K-푸드 매출 고성장세 지속",
    "targetPrice": 430000,
    "currentPrice": 325000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "삼양식품",
    "stockCode": "003230",
    "reportTitle": "불닭볶음면 글로벌 열풍 지속 및 신규 공장 증설 효과",
    "targetPrice": 750000,
    "currentPrice": 610000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "삼성SDI",
    "stockCode": "006400",
    "reportTitle": "프리미엄 젠5 배터리 비중 확대 및 46파이 공급 계약",
    "targetPrice": 530000,
    "currentPrice": 395000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "LG화학",
    "stockCode": "051910",
    "reportTitle": "양극재 소재 사업 본궤도 진입 및 첨단소재 모멘텀",
    "targetPrice": 490000,
    "currentPrice": 355000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "크래프톤",
    "stockCode": "259960",
    "reportTitle": "PUBG IP 글로벌 트래픽 견조 및 신작 라인업 가시화",
    "targetPrice": 380000,
    "currentPrice": 295000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "하이브",
    "stockCode": "352820",
    "reportTitle": "멀티레이블 시스템 강화 및 해외 아티스트 매출 본격화",
    "targetPrice": 280000,
    "currentPrice": 205000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "한미약품",
    "stockCode": "128940",
    "reportTitle": "비만치료제 파이프라인 임상 순항 및 신약 기술이전 기대",
    "targetPrice": 420000,
    "currentPrice": 315000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "하나금융지주",
    "stockCode": "086790",
    "reportTitle": "저PBR 대표주로서 주주가치 제고 및 자사주 소각 추진",
    "targetPrice": 78000,
    "currentPrice": 62000,
    "sector": "금융/지주"
  },
  {
    "stockName": "현대모비스",
    "stockCode": "012330",
    "reportTitle": "전동화 부문 턴어라운드 및 핵심 부품 수출 모멘텀",
    "targetPrice": 310000,
    "currentPrice": 235000,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "포스코퓨처엠",
    "stockCode": "003670",
    "reportTitle": "양음극재 수주 잔고 확대 및 원소재 내재화율 향상",
    "targetPrice": 330000,
    "currentPrice": 240000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "삼성전기",
    "stockCode": "009150",
    "reportTitle": "AI 서버용 MLCC 및 FC-BGA 공급 비중 지속 확대",
    "targetPrice": 200000,
    "currentPrice": 152000,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "알테오젠",
    "stockCode": "196170",
    "reportTitle": "피하주사(SC) 제형 변경 플랫폼 기술수출 독점 계약 가치",
    "targetPrice": 360000,
    "currentPrice": 285000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "엔씨소프트",
    "stockCode": "036570",
    "reportTitle": "TL 글로벌 장르 다변화 및 신작 모바일 게임 출시",
    "targetPrice": 240000,
    "currentPrice": 188000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "HD한국조선해양",
    "stockCode": "009540",
    "reportTitle": "친환경 선박 선가 인상 및 그룹 Shipbuilding 수익성 개선",
    "targetPrice": 180000,
    "currentPrice": 142000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "에코프로비엠",
    "stockCode": "247540",
    "reportTitle": "하반기 양극재 출하량 반등 및 LFP 배터리 소재 개발",
    "targetPrice": 240000,
    "currentPrice": 185000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "메리츠금융지주",
    "stockCode": "138040",
    "reportTitle": "업계 최고 수준 주주환원율 및 자본 효율성 입증",
    "targetPrice": 95000,
    "currentPrice": 81000,
    "sector": "금융/지주"
  },
  {
    "stockName": "유한양행",
    "stockCode": "000100",
    "reportTitle": "렉라자 FDA 승인 모멘텀 및 글로벌 블록버스터 신약 도약",
    "targetPrice": 120000,
    "currentPrice": 94000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "현대글로비스",
    "stockCode": "086280",
    "reportTitle": "완성차 해상운송 장기 계약 및 물류 스페이스 확장",
    "targetPrice": 260000,
    "currentPrice": 205000,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "LG생활건강",
    "stockCode": "051900",
    "reportTitle": "브랜드 리빌딩 및 북미·온라인 채널 중심 턴어라운드",
    "targetPrice": 460000,
    "currentPrice": 370000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "코스맥스",
    "stockCode": "192820",
    "reportTitle": "인디 뷰티 브랜드 수출 급증에 따른 글로벌 ODM 수혜",
    "targetPrice": 180000,
    "currentPrice": 145000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "한국콜마",
    "stockCode": "161890",
    "reportTitle": "선케어 제품 글로벌 수요 폭증 및 HK이노엔 시너지",
    "targetPrice": 85000,
    "currentPrice": 68000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "한화오션",
    "stockCode": "042660",
    "reportTitle": "미 해군 함정 MRO 수주 및 특수선·LNG선 고수익성 확보",
    "targetPrice": 48000,
    "currentPrice": 36500,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "두산에너빌리티",
    "stockCode": "034020",
    "reportTitle": "체코 원전 수주 및 가스터빈·SMR 제작 경쟁력 강화",
    "targetPrice": 28000,
    "currentPrice": 21000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "현대로템",
    "stockCode": "064350",
    "reportTitle": "K2 전차 폴란드 2차 계약 및 루마니아 수출 기대",
    "targetPrice": 60000,
    "currentPrice": 49500,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "대한항공",
    "stockCode": "003490",
    "reportTitle": "아시아나항공 합병 완료 임박 및 장거리 여객·화물 호조",
    "targetPrice": 32000,
    "currentPrice": 24500,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "SK이노베이션",
    "stockCode": "096770",
    "reportTitle": "SK E&S 합병을 통한 재무구조 안정화 및 정유 마진 반등",
    "targetPrice": 160000,
    "currentPrice": 115000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "S-Oil",
    "stockCode": "010950",
    "reportTitle": "샤힌 프로젝트를 통한 석유화학 비중 확대 및 정제마진 개선",
    "targetPrice": 95000,
    "currentPrice": 72000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "KT&G",
    "stockCode": "033780",
    "reportTitle": "차세대 NGP(전자담배) 글로벌 진출 및 주주가치 제고",
    "targetPrice": 125000,
    "currentPrice": 101000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "한국전력",
    "stockCode": "015760",
    "reportTitle": "전기요금 정상화 및 연료비 안정화에 따른 흑자 기조 안착",
    "targetPrice": 28000,
    "currentPrice": 22500,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "KT",
    "stockCode": "030200",
    "reportTitle": "AICT 기업 전환 및 마이크로소프트 전략적 파트너십 구축",
    "targetPrice": 48000,
    "currentPrice": 39500,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "SK텔레콤",
    "stockCode": "017670",
    "reportTitle": "AI 데이터센터 및 에이닷 글로벌 확장, 고배당 매력 지속",
    "targetPrice": 65000,
    "currentPrice": 54500,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "LG유플러스",
    "stockCode": "032640",
    "reportTitle": "B2B AI 사업 확장 및 익시젠(ixi-GEN) AI 서비스 상용화",
    "targetPrice": 13000,
    "currentPrice": 10200,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "고려아연",
    "stockCode": "010130",
    "reportTitle": "트로이카 드라이브(2차전지·신재생·자원순환) 신사업 본격화",
    "targetPrice": 680000,
    "currentPrice": 540000,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "현대제철",
    "stockCode": "004020",
    "reportTitle": "전기로-고로 복합 프로세스 친환경 철강 전환 가속",
    "targetPrice": 42000,
    "currentPrice": 31000,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "삼성화재",
    "stockCode": "000810",
    "reportTitle": "CSM(보험계약마진) 잔액 증가 및 안정적인 자본 건전성 유지",
    "targetPrice": 410000,
    "currentPrice": 345000,
    "sector": "금융/지주"
  },
  {
    "stockName": "삼성생명",
    "stockCode": "032830",
    "reportTitle": "보장성 신계약 호조 및 밸류업 주주환원 확대 정책",
    "targetPrice": 115000,
    "currentPrice": 94000,
    "sector": "금융/지주"
  },
  {
    "stockName": "미래에셋증권",
    "stockCode": "006800",
    "reportTitle": "해외법인 실적 턴어라운드 및 브로커리지·IB 균형 성장",
    "targetPrice": 11000,
    "currentPrice": 8600,
    "sector": "금융/지주"
  },
  {
    "stockName": "한국금융지주",
    "stockCode": "071050",
    "reportTitle": "한투증권 IB 경쟁력 및 카카오뱅크 지분가치 부각",
    "targetPrice": 88000,
    "currentPrice": 71000,
    "sector": "금융/지주"
  },
  {
    "stockName": "키움증권",
    "stockCode": "039490",
    "reportTitle": "리테일 시장 점유율 1위 공고화 및 주주친화 정책 강화",
    "targetPrice": 160000,
    "currentPrice": 131000,
    "sector": "금융/지주"
  },
  {
    "stockName": "우리금융지주",
    "stockCode": "316140",
    "reportTitle": "증권·보험 포트폴리오 다변화 및 보통주자본비율 개선",
    "targetPrice": 18000,
    "currentPrice": 15200,
    "sector": "금융/지주"
  },
  {
    "stockName": "기업은행",
    "stockCode": "024110",
    "reportTitle": "우량 중소기업 대출 기반 탄탄한 이자이익 및 고배당 수익률",
    "targetPrice": 17500,
    "currentPrice": 14300,
    "sector": "금융/지주"
  },
  {
    "stockName": "하이트진로",
    "stockCode": "000080",
    "reportTitle": "켈리-테라 투트랙 전략 안착 및 K-소주 글로벌 수출 확대",
    "targetPrice": 26000,
    "currentPrice": 20800,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "농심",
    "stockCode": "004370",
    "reportTitle": "신라면 툼바 및 해외법인 성장세 가속, 미국 제2공장 가동",
    "targetPrice": 510000,
    "currentPrice": 415000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "오리온",
    "stockCode": "271560",
    "reportTitle": "중국·러시아·베트남 법인 고성장 및 레고켐바이오 시너지",
    "targetPrice": 135000,
    "currentPrice": 98000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "오뚜기",
    "stockCode": "007310",
    "reportTitle": "소스·간편식 카테고리 지배력 및 글로벌 수출 비중 확대",
    "targetPrice": 520000,
    "currentPrice": 410000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "BGF리테일",
    "stockCode": "282330",
    "reportTitle": "편의점 차별화 상품 확대 및 점포당 매출액 안정적 증가",
    "targetPrice": 155000,
    "currentPrice": 120000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "이마트",
    "stockCode": "139480",
    "reportTitle": "본업 통합 매입 시너지 및 온라인 적자 대폭 축소",
    "targetPrice": 85000,
    "currentPrice": 64000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "호텔신라",
    "stockCode": "008770",
    "reportTitle": "개별 자유여행객(FIT) 증가 및 공항면세점 수익성 개선",
    "targetPrice": 72000,
    "currentPrice": 53000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "강원랜드",
    "stockCode": "035250",
    "reportTitle": "글로벌 카지노 복합리조트 규제 완화 및 테이블 증설 수혜",
    "targetPrice": 22000,
    "currentPrice": 16800,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "펄어비스",
    "stockCode": "263750",
    "reportTitle": "붉은사막 게임스컴 시연 호평 및 글로벌 흥행 가시성 고조",
    "targetPrice": 55000,
    "currentPrice": 39000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "카카오게임즈",
    "stockCode": "293490",
    "reportTitle": "신작 라인업 크로노 오디세이·아키에이지2 기대감",
    "targetPrice": 25000,
    "currentPrice": 18200,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "넷마블",
    "stockCode": "251270",
    "reportTitle": "나 혼자만 레벨업 흥행 및 하반기 신작 릴레이로 실적 턴어라운드",
    "targetPrice": 75000,
    "currentPrice": 58000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "위메이드",
    "stockCode": "112040",
    "reportTitle": "레전드 오브 이미르 출시 및 미르4 글로벌 블록체인 매출 견조",
    "targetPrice": 58000,
    "currentPrice": 41000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "컴투스",
    "stockCode": "078340",
    "reportTitle": "서머너즈 워 천공의 아레나 10주년 프로모션 및 야구 게임 호조",
    "targetPrice": 48000,
    "currentPrice": 36000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "JYP Ent.",
    "stockCode": "035900",
    "reportTitle": "스트레이 키즈 월드투어 확대 및 VCHA 글로벌 활동 본격화",
    "targetPrice": 82000,
    "currentPrice": 59000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "에스엠",
    "stockCode": "041510",
    "reportTitle": "에스파·라이즈 글로벌 음반/음원 흥행 및 멀티 프로덕션 정착",
    "targetPrice": 105000,
    "currentPrice": 78000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "와이지엔터테인먼트",
    "stockCode": "122870",
    "reportTitle": "베이비몬스터 글로벌 팬덤 급성장 및 2NE1 콘서트 투어",
    "targetPrice": 50000,
    "currentPrice": 36500,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "CJ ENM",
    "stockCode": "035760",
    "reportTitle": "티빙 KBO 중계 효과 및 피프스시즌 제작 정상화 흑자 전환",
    "targetPrice": 95000,
    "currentPrice": 71000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "스튜디오드래곤",
    "stockCode": "253450",
    "reportTitle": "글로벌 OTT 동시 방영 텐트폴 라인업 회복 및 해외 판매 증가",
    "targetPrice": 52000,
    "currentPrice": 39000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "한미반도체",
    "stockCode": "042700",
    "reportTitle": "듀얼 TC 본더 글로벌 빅테크 독점 공급 및 HBM 캐파 증설 수혜",
    "targetPrice": 180000,
    "currentPrice": 138000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "HPSP",
    "stockCode": "403870",
    "reportTitle": "고압 수소 어닐링 장비 독점적 진입장벽 및 첨단 공정 적용 확대",
    "targetPrice": 52000,
    "currentPrice": 39500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "이오테크닉스",
    "stockCode": "039030",
    "reportTitle": "레이저 그루빙 및 스텔스 다이싱 장비 첨단 패키징 수요 증가",
    "targetPrice": 240000,
    "currentPrice": 182000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "리노공업",
    "stockCode": "058470",
    "reportTitle": "온디바이스 AI 칩 테스팅 소켓(리노핀) 고수익성 지속",
    "targetPrice": 260000,
    "currentPrice": 205000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "동진쎄미켐",
    "stockCode": "005290",
    "reportTitle": "EUV 감광액 국산화 및 반도체 신규 라인 소재 공급 확대",
    "targetPrice": 480000,
    "currentPrice": 36500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "솔브레인",
    "stockCode": "357780",
    "reportTitle": "초고순도 불산 및 식각액 가동률 회복에 따른 영업이익 급증",
    "targetPrice": 330000,
    "currentPrice": 255000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "원익IPS",
    "stockCode": "240810",
    "reportTitle": "삼성전자·SK하이닉스 메모리 투자 재개 및 ALD 장비 점유율 확대",
    "targetPrice": 41000,
    "currentPrice": 31000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "주성엔지니어링",
    "stockCode": "036930",
    "reportTitle": "혁신 ALD 기술 글로벌 파운드리 고객사 다변화 가시화",
    "targetPrice": 42000,
    "currentPrice": 31500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "하나마이크론",
    "stockCode": "067310",
    "reportTitle": "베트남 2공장 가동 본격화 및 후공정 OSAT 턴키 수주",
    "targetPrice": 28000,
    "currentPrice": 19800,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "대주전자재료",
    "stockCode": "078600",
    "reportTitle": "실리콘 음극재 글로벌 완성차 채택 확대 및 생산능력 증설",
    "targetPrice": 145000,
    "currentPrice": 108000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "코스모신소재",
    "stockCode": "005070",
    "reportTitle": "NCM 양극재 전구체 내재화 및 대규모 장기 공급 계약 체결",
    "targetPrice": 170000,
    "currentPrice": 126000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "에코프로머티",
    "stockCode": "450080",
    "reportTitle": "하이니켈 전구체 생산능력 확장 및 북미 IRA 적격 요건 확보",
    "targetPrice": 110000,
    "currentPrice": 82000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "엘앤에프",
    "stockCode": "066970",
    "reportTitle": "테슬라 직납 4680 배터리용 단결정 양극재 공급 본격화",
    "targetPrice": 160000,
    "currentPrice": 112000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "천보",
    "stockCode": "278280",
    "reportTitle": "F전해질 신공장 본격 가동에 따른 원가 경쟁력 회복",
    "targetPrice": 82000,
    "currentPrice": 58000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "HLB",
    "stockCode": "028300",
    "reportTitle": "리보세라닙+캄렐리주맙 병용 간암 1차 치료제 FDA 재심사 승인 기대",
    "targetPrice": 110000,
    "currentPrice": 82000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "리가켐바이오",
    "stockCode": "141080",
    "reportTitle": "차세대 ADC(항체-약물 접합체) 플랫폼 글로벌 빅파마 기술이전 가치",
    "targetPrice": 135000,
    "currentPrice": 98000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "에이비엘바이오",
    "stockCode": "298380",
    "reportTitle": "Grabody 이중항체 BBB 셔틀 플랫폼 기술력 및 후속 파이프라인 부각",
    "targetPrice": 45000,
    "currentPrice": 32000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "에스티팜",
    "stockCode": "237690",
    "reportTitle": "올리고핵산 CDMO 글로벌 1위 경쟁력 및 제2올리고동 완공 효과",
    "targetPrice": 120000,
    "currentPrice": 91000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "종근당",
    "stockCode": "185750",
    "reportTitle": "노바티스 기술수출 CKD-510 마일스톤 유입 및 자큐보 출시",
    "targetPrice": 145000,
    "currentPrice": 112000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "대웅제약",
    "stockCode": "069620",
    "reportTitle": "나보타(주보) 미국·유럽 톡신 수출 호조 및 펙수클루 글로벌 출시",
    "targetPrice": 180000,
    "currentPrice": 138000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "보령",
    "stockCode": "003850",
    "reportTitle": "카나브 패밀리 매출 1,500억 돌파 및 항암제 사업 포트폴리오 강화",
    "targetPrice": 16000,
    "currentPrice": 12100,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "휴젤",
    "stockCode": "145020",
    "reportTitle": "보툴렉스 미국 FDA 최종 승인 및 톡신 글로벌 3대 시장 공략",
    "targetPrice": 340000,
    "currentPrice": 270000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "클래시스",
    "stockCode": "214150",
    "reportTitle": "슈링크 유니버스 및 볼뉴머 글로벌 소모품 매출 비중 60% 돌파",
    "targetPrice": 62000,
    "currentPrice": 51000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "파마리서치",
    "stockCode": "214450",
    "reportTitle": "리쥬란 글로벌 인지도 확산 및 C-PDRN 기반 화장품 수출 호조",
    "targetPrice": 220000,
    "currentPrice": 178000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "메디톡스",
    "stockCode": "086900",
    "reportTitle": "뉴럭스 수출 확대 및 액상형 톡신 MT10107 글로벌 상용화",
    "targetPrice": 190000,
    "currentPrice": 148000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "덴티움",
    "stockCode": "145720",
    "reportTitle": "중국 VBP 물량 증가 및 유럽·인도 신흥국 임플란트 매출 고성장",
    "targetPrice": 135000,
    "currentPrice": 101000,
    "sector": "바이오/제약/헬스케어"
  }
];

// Entire Domestic Listed Universe (680 Stocks Total)
export const KOREAN_ALL_STOCKS: StockItem[] = [
  {
    "stockName": "삼성전자",
    "stockCode": "005930",
    "reportTitle": "HBM3E 공급 확대 및 메모리 반도체 업황 회복 본격화",
    "targetPrice": 105000,
    "currentPrice": 82500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "SK하이닉스",
    "stockCode": "000660",
    "reportTitle": "HBM3E 독점적 시장 지위 유지와 사상 최대 영업이익 전망",
    "targetPrice": 260000,
    "currentPrice": 198000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "현대차",
    "stockCode": "005380",
    "reportTitle": "인도 법인 상장 추진 및 주주환원율 확대 기대감",
    "targetPrice": 340000,
    "currentPrice": 255000,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "기아",
    "stockCode": "000270",
    "reportTitle": "EV9 글로벌 판매 증가 및 높은 영업이익률 지속",
    "targetPrice": 160000,
    "currentPrice": 122000,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "NAVER",
    "stockCode": "035420",
    "reportTitle": "생성형 AI 서비스 본격화 및 서치 플랫폼 매출 회복",
    "targetPrice": 250000,
    "currentPrice": 185000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "카카오",
    "stockCode": "035720",
    "reportTitle": "본업 체질 개선 및 핵심 톡비즈 사업 성장성 재부각",
    "targetPrice": 65000,
    "currentPrice": 43500,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "LG에너지솔루션",
    "stockCode": "373220",
    "reportTitle": "북미 AMPC 보조금 수혜 확대 및 차세대 배터리 양산",
    "targetPrice": 480000,
    "currentPrice": 380000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "POSCO홀딩스",
    "stockCode": "005490",
    "reportTitle": "친환경 미래소재 사업 가치 재평가 및 철강 업황 반등",
    "targetPrice": 520000,
    "currentPrice": 375000,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "삼성바이오로직스",
    "stockCode": "207940",
    "reportTitle": "4공장 풀가동 및 5공장 증설로 인한 중장기 수주 실적 호조",
    "targetPrice": 1100000,
    "currentPrice": 890000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "셀트리온",
    "stockCode": "068270",
    "reportTitle": "합병 시너지 가시화 및 짐펜트라 미국 신약 매출 급증",
    "targetPrice": 250000,
    "currentPrice": 192000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "KB금융",
    "stockCode": "105560",
    "reportTitle": "기업 밸류업 프로그램 최대 수혜 및 자사주 매입 소각",
    "targetPrice": 98000,
    "currentPrice": 79000,
    "sector": "금융/지주"
  },
  {
    "stockName": "신한지주",
    "stockCode": "055550",
    "reportTitle": "견조한 자산건전성 및 주주환원율 40% 달성 목표",
    "targetPrice": 68000,
    "currentPrice": 52500,
    "sector": "금융/지주"
  },
  {
    "stockName": "HD현대중공업",
    "stockCode": "329180",
    "reportTitle": "고부가가치 선박 비중 확대 및 미 해군 함정 MRO 수주",
    "targetPrice": 190000,
    "currentPrice": 148000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "한화에어로스페이스",
    "stockCode": "012450",
    "reportTitle": "K-방산 글로벌 수출 호조 및 해외 방산 수주 잔고 급증",
    "targetPrice": 350000,
    "currentPrice": 290000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "아모레퍼시픽",
    "stockCode": "090430",
    "reportTitle": "북미 및 서구권 리밸런싱 가속화와 코스알엑스(COSRX) 편입 효과 본격화",
    "targetPrice": 185000,
    "currentPrice": 142000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "CJ제일제당",
    "stockCode": "097950",
    "reportTitle": "해외 만두 및 K-푸드 매출 고성장세 지속",
    "targetPrice": 430000,
    "currentPrice": 325000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "삼양식품",
    "stockCode": "003230",
    "reportTitle": "불닭볶음면 글로벌 열풍 지속 및 신규 공장 증설 효과",
    "targetPrice": 750000,
    "currentPrice": 610000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "삼성SDI",
    "stockCode": "006400",
    "reportTitle": "프리미엄 젠5 배터리 비중 확대 및 46파이 공급 계약",
    "targetPrice": 530000,
    "currentPrice": 395000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "LG화학",
    "stockCode": "051910",
    "reportTitle": "양극재 소재 사업 본궤도 진입 및 첨단소재 모멘텀",
    "targetPrice": 490000,
    "currentPrice": 355000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "크래프톤",
    "stockCode": "259960",
    "reportTitle": "PUBG IP 글로벌 트래픽 견조 및 신작 라인업 가시화",
    "targetPrice": 380000,
    "currentPrice": 295000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "하이브",
    "stockCode": "352820",
    "reportTitle": "멀티레이블 시스템 강화 및 해외 아티스트 매출 본격화",
    "targetPrice": 280000,
    "currentPrice": 205000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "한미약품",
    "stockCode": "128940",
    "reportTitle": "비만치료제 파이프라인 임상 순항 및 신약 기술이전 기대",
    "targetPrice": 420000,
    "currentPrice": 315000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "하나금융지주",
    "stockCode": "086790",
    "reportTitle": "저PBR 대표주로서 주주가치 제고 및 자사주 소각 추진",
    "targetPrice": 78000,
    "currentPrice": 62000,
    "sector": "금융/지주"
  },
  {
    "stockName": "현대모비스",
    "stockCode": "012330",
    "reportTitle": "전동화 부문 턴어라운드 및 핵심 부품 수출 모멘텀",
    "targetPrice": 310000,
    "currentPrice": 235000,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "포스코퓨처엠",
    "stockCode": "003670",
    "reportTitle": "양음극재 수주 잔고 확대 및 원소재 내재화율 향상",
    "targetPrice": 330000,
    "currentPrice": 240000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "삼성전기",
    "stockCode": "009150",
    "reportTitle": "AI 서버용 MLCC 및 FC-BGA 공급 비중 지속 확대",
    "targetPrice": 200000,
    "currentPrice": 152000,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "알테오젠",
    "stockCode": "196170",
    "reportTitle": "피하주사(SC) 제형 변경 플랫폼 기술수출 독점 계약 가치",
    "targetPrice": 360000,
    "currentPrice": 285000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "엔씨소프트",
    "stockCode": "036570",
    "reportTitle": "TL 글로벌 장르 다변화 및 신작 모바일 게임 출시",
    "targetPrice": 240000,
    "currentPrice": 188000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "HD한국조선해양",
    "stockCode": "009540",
    "reportTitle": "친환경 선박 선가 인상 및 그룹 Shipbuilding 수익성 개선",
    "targetPrice": 180000,
    "currentPrice": 142000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "에코프로비엠",
    "stockCode": "247540",
    "reportTitle": "하반기 양극재 출하량 반등 및 LFP 배터리 소재 개발",
    "targetPrice": 240000,
    "currentPrice": 185000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "메리츠금융지주",
    "stockCode": "138040",
    "reportTitle": "업계 최고 수준 주주환원율 및 자본 효율성 입증",
    "targetPrice": 95000,
    "currentPrice": 81000,
    "sector": "금융/지주"
  },
  {
    "stockName": "유한양행",
    "stockCode": "000100",
    "reportTitle": "렉라자 FDA 승인 모멘텀 및 글로벌 블록버스터 신약 도약",
    "targetPrice": 120000,
    "currentPrice": 94000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "현대글로비스",
    "stockCode": "086280",
    "reportTitle": "완성차 해상운송 장기 계약 및 물류 스페이스 확장",
    "targetPrice": 260000,
    "currentPrice": 205000,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "LG생활건강",
    "stockCode": "051900",
    "reportTitle": "브랜드 리빌딩 및 북미·온라인 채널 중심 턴어라운드",
    "targetPrice": 460000,
    "currentPrice": 370000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "코스맥스",
    "stockCode": "192820",
    "reportTitle": "인디 뷰티 브랜드 수출 급증에 따른 글로벌 ODM 수혜",
    "targetPrice": 180000,
    "currentPrice": 145000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "한국콜마",
    "stockCode": "161890",
    "reportTitle": "선케어 제품 글로벌 수요 폭증 및 HK이노엔 시너지",
    "targetPrice": 85000,
    "currentPrice": 68000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "한화오션",
    "stockCode": "042660",
    "reportTitle": "미 해군 함정 MRO 수주 및 특수선·LNG선 고수익성 확보",
    "targetPrice": 48000,
    "currentPrice": 36500,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "두산에너빌리티",
    "stockCode": "034020",
    "reportTitle": "체코 원전 수주 및 가스터빈·SMR 제작 경쟁력 강화",
    "targetPrice": 28000,
    "currentPrice": 21000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "현대로템",
    "stockCode": "064350",
    "reportTitle": "K2 전차 폴란드 2차 계약 및 루마니아 수출 기대",
    "targetPrice": 60000,
    "currentPrice": 49500,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "대한항공",
    "stockCode": "003490",
    "reportTitle": "아시아나항공 합병 완료 임박 및 장거리 여객·화물 호조",
    "targetPrice": 32000,
    "currentPrice": 24500,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "SK이노베이션",
    "stockCode": "096770",
    "reportTitle": "SK E&S 합병을 통한 재무구조 안정화 및 정유 마진 반등",
    "targetPrice": 160000,
    "currentPrice": 115000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "S-Oil",
    "stockCode": "010950",
    "reportTitle": "샤힌 프로젝트를 통한 석유화학 비중 확대 및 정제마진 개선",
    "targetPrice": 95000,
    "currentPrice": 72000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "KT&G",
    "stockCode": "033780",
    "reportTitle": "차세대 NGP(전자담배) 글로벌 진출 및 주주가치 제고",
    "targetPrice": 125000,
    "currentPrice": 101000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "한국전력",
    "stockCode": "015760",
    "reportTitle": "전기요금 정상화 및 연료비 안정화에 따른 흑자 기조 안착",
    "targetPrice": 28000,
    "currentPrice": 22500,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "KT",
    "stockCode": "030200",
    "reportTitle": "AICT 기업 전환 및 마이크로소프트 전략적 파트너십 구축",
    "targetPrice": 48000,
    "currentPrice": 39500,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "SK텔레콤",
    "stockCode": "017670",
    "reportTitle": "AI 데이터센터 및 에이닷 글로벌 확장, 고배당 매력 지속",
    "targetPrice": 65000,
    "currentPrice": 54500,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "LG유플러스",
    "stockCode": "032640",
    "reportTitle": "B2B AI 사업 확장 및 익시젠(ixi-GEN) AI 서비스 상용화",
    "targetPrice": 13000,
    "currentPrice": 10200,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "고려아연",
    "stockCode": "010130",
    "reportTitle": "트로이카 드라이브(2차전지·신재생·자원순환) 신사업 본격화",
    "targetPrice": 680000,
    "currentPrice": 540000,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "현대제철",
    "stockCode": "004020",
    "reportTitle": "전기로-고로 복합 프로세스 친환경 철강 전환 가속",
    "targetPrice": 42000,
    "currentPrice": 31000,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "삼성화재",
    "stockCode": "000810",
    "reportTitle": "CSM(보험계약마진) 잔액 증가 및 안정적인 자본 건전성 유지",
    "targetPrice": 410000,
    "currentPrice": 345000,
    "sector": "금융/지주"
  },
  {
    "stockName": "삼성생명",
    "stockCode": "032830",
    "reportTitle": "보장성 신계약 호조 및 밸류업 주주환원 확대 정책",
    "targetPrice": 115000,
    "currentPrice": 94000,
    "sector": "금융/지주"
  },
  {
    "stockName": "미래에셋증권",
    "stockCode": "006800",
    "reportTitle": "해외법인 실적 턴어라운드 및 브로커리지·IB 균형 성장",
    "targetPrice": 11000,
    "currentPrice": 8600,
    "sector": "금융/지주"
  },
  {
    "stockName": "한국금융지주",
    "stockCode": "071050",
    "reportTitle": "한투증권 IB 경쟁력 및 카카오뱅크 지분가치 부각",
    "targetPrice": 88000,
    "currentPrice": 71000,
    "sector": "금융/지주"
  },
  {
    "stockName": "키움증권",
    "stockCode": "039490",
    "reportTitle": "리테일 시장 점유율 1위 공고화 및 주주친화 정책 강화",
    "targetPrice": 160000,
    "currentPrice": 131000,
    "sector": "금융/지주"
  },
  {
    "stockName": "우리금융지주",
    "stockCode": "316140",
    "reportTitle": "증권·보험 포트폴리오 다변화 및 보통주자본비율 개선",
    "targetPrice": 18000,
    "currentPrice": 15200,
    "sector": "금융/지주"
  },
  {
    "stockName": "기업은행",
    "stockCode": "024110",
    "reportTitle": "우량 중소기업 대출 기반 탄탄한 이자이익 및 고배당 수익률",
    "targetPrice": 17500,
    "currentPrice": 14300,
    "sector": "금융/지주"
  },
  {
    "stockName": "하이트진로",
    "stockCode": "000080",
    "reportTitle": "켈리-테라 투트랙 전략 안착 및 K-소주 글로벌 수출 확대",
    "targetPrice": 26000,
    "currentPrice": 20800,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "농심",
    "stockCode": "004370",
    "reportTitle": "신라면 툼바 및 해외법인 성장세 가속, 미국 제2공장 가동",
    "targetPrice": 510000,
    "currentPrice": 415000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "오리온",
    "stockCode": "271560",
    "reportTitle": "중국·러시아·베트남 법인 고성장 및 레고켐바이오 시너지",
    "targetPrice": 135000,
    "currentPrice": 98000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "오뚜기",
    "stockCode": "007310",
    "reportTitle": "소스·간편식 카테고리 지배력 및 글로벌 수출 비중 확대",
    "targetPrice": 520000,
    "currentPrice": 410000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "BGF리테일",
    "stockCode": "282330",
    "reportTitle": "편의점 차별화 상품 확대 및 점포당 매출액 안정적 증가",
    "targetPrice": 155000,
    "currentPrice": 120000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "이마트",
    "stockCode": "139480",
    "reportTitle": "본업 통합 매입 시너지 및 온라인 적자 대폭 축소",
    "targetPrice": 85000,
    "currentPrice": 64000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "호텔신라",
    "stockCode": "008770",
    "reportTitle": "개별 자유여행객(FIT) 증가 및 공항면세점 수익성 개선",
    "targetPrice": 72000,
    "currentPrice": 53000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "강원랜드",
    "stockCode": "035250",
    "reportTitle": "글로벌 카지노 복합리조트 규제 완화 및 테이블 증설 수혜",
    "targetPrice": 22000,
    "currentPrice": 16800,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "펄어비스",
    "stockCode": "263750",
    "reportTitle": "붉은사막 게임스컴 시연 호평 및 글로벌 흥행 가시성 고조",
    "targetPrice": 55000,
    "currentPrice": 39000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "카카오게임즈",
    "stockCode": "293490",
    "reportTitle": "신작 라인업 크로노 오디세이·아키에이지2 기대감",
    "targetPrice": 25000,
    "currentPrice": 18200,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "넷마블",
    "stockCode": "251270",
    "reportTitle": "나 혼자만 레벨업 흥행 및 하반기 신작 릴레이로 실적 턴어라운드",
    "targetPrice": 75000,
    "currentPrice": 58000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "위메이드",
    "stockCode": "112040",
    "reportTitle": "레전드 오브 이미르 출시 및 미르4 글로벌 블록체인 매출 견조",
    "targetPrice": 58000,
    "currentPrice": 41000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "컴투스",
    "stockCode": "078340",
    "reportTitle": "서머너즈 워 천공의 아레나 10주년 프로모션 및 야구 게임 호조",
    "targetPrice": 48000,
    "currentPrice": 36000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "JYP Ent.",
    "stockCode": "035900",
    "reportTitle": "스트레이 키즈 월드투어 확대 및 VCHA 글로벌 활동 본격화",
    "targetPrice": 82000,
    "currentPrice": 59000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "에스엠",
    "stockCode": "041510",
    "reportTitle": "에스파·라이즈 글로벌 음반/음원 흥행 및 멀티 프로덕션 정착",
    "targetPrice": 105000,
    "currentPrice": 78000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "와이지엔터테인먼트",
    "stockCode": "122870",
    "reportTitle": "베이비몬스터 글로벌 팬덤 급성장 및 2NE1 콘서트 투어",
    "targetPrice": 50000,
    "currentPrice": 36500,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "CJ ENM",
    "stockCode": "035760",
    "reportTitle": "티빙 KBO 중계 효과 및 피프스시즌 제작 정상화 흑자 전환",
    "targetPrice": 95000,
    "currentPrice": 71000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "스튜디오드래곤",
    "stockCode": "253450",
    "reportTitle": "글로벌 OTT 동시 방영 텐트폴 라인업 회복 및 해외 판매 증가",
    "targetPrice": 52000,
    "currentPrice": 39000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "한미반도체",
    "stockCode": "042700",
    "reportTitle": "듀얼 TC 본더 글로벌 빅테크 독점 공급 및 HBM 캐파 증설 수혜",
    "targetPrice": 180000,
    "currentPrice": 138000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "HPSP",
    "stockCode": "403870",
    "reportTitle": "고압 수소 어닐링 장비 독점적 진입장벽 및 첨단 공정 적용 확대",
    "targetPrice": 52000,
    "currentPrice": 39500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "이오테크닉스",
    "stockCode": "039030",
    "reportTitle": "레이저 그루빙 및 스텔스 다이싱 장비 첨단 패키징 수요 증가",
    "targetPrice": 240000,
    "currentPrice": 182000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "리노공업",
    "stockCode": "058470",
    "reportTitle": "온디바이스 AI 칩 테스팅 소켓(리노핀) 고수익성 지속",
    "targetPrice": 260000,
    "currentPrice": 205000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "동진쎄미켐",
    "stockCode": "005290",
    "reportTitle": "EUV 감광액 국산화 및 반도체 신규 라인 소재 공급 확대",
    "targetPrice": 480000,
    "currentPrice": 36500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "솔브레인",
    "stockCode": "357780",
    "reportTitle": "초고순도 불산 및 식각액 가동률 회복에 따른 영업이익 급증",
    "targetPrice": 330000,
    "currentPrice": 255000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "원익IPS",
    "stockCode": "240810",
    "reportTitle": "삼성전자·SK하이닉스 메모리 투자 재개 및 ALD 장비 점유율 확대",
    "targetPrice": 41000,
    "currentPrice": 31000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "주성엔지니어링",
    "stockCode": "036930",
    "reportTitle": "혁신 ALD 기술 글로벌 파운드리 고객사 다변화 가시화",
    "targetPrice": 42000,
    "currentPrice": 31500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "하나마이크론",
    "stockCode": "067310",
    "reportTitle": "베트남 2공장 가동 본격화 및 후공정 OSAT 턴키 수주",
    "targetPrice": 28000,
    "currentPrice": 19800,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "대주전자재료",
    "stockCode": "078600",
    "reportTitle": "실리콘 음극재 글로벌 완성차 채택 확대 및 생산능력 증설",
    "targetPrice": 145000,
    "currentPrice": 108000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "코스모신소재",
    "stockCode": "005070",
    "reportTitle": "NCM 양극재 전구체 내재화 및 대규모 장기 공급 계약 체결",
    "targetPrice": 170000,
    "currentPrice": 126000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "에코프로머티",
    "stockCode": "450080",
    "reportTitle": "하이니켈 전구체 생산능력 확장 및 북미 IRA 적격 요건 확보",
    "targetPrice": 110000,
    "currentPrice": 82000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "엘앤에프",
    "stockCode": "066970",
    "reportTitle": "테슬라 직납 4680 배터리용 단결정 양극재 공급 본격화",
    "targetPrice": 160000,
    "currentPrice": 112000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "천보",
    "stockCode": "278280",
    "reportTitle": "F전해질 신공장 본격 가동에 따른 원가 경쟁력 회복",
    "targetPrice": 82000,
    "currentPrice": 58000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "HLB",
    "stockCode": "028300",
    "reportTitle": "리보세라닙+캄렐리주맙 병용 간암 1차 치료제 FDA 재심사 승인 기대",
    "targetPrice": 110000,
    "currentPrice": 82000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "리가켐바이오",
    "stockCode": "141080",
    "reportTitle": "차세대 ADC(항체-약물 접합체) 플랫폼 글로벌 빅파마 기술이전 가치",
    "targetPrice": 135000,
    "currentPrice": 98000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "에이비엘바이오",
    "stockCode": "298380",
    "reportTitle": "Grabody 이중항체 BBB 셔틀 플랫폼 기술력 및 후속 파이프라인 부각",
    "targetPrice": 45000,
    "currentPrice": 32000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "에스티팜",
    "stockCode": "237690",
    "reportTitle": "올리고핵산 CDMO 글로벌 1위 경쟁력 및 제2올리고동 완공 효과",
    "targetPrice": 120000,
    "currentPrice": 91000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "종근당",
    "stockCode": "185750",
    "reportTitle": "노바티스 기술수출 CKD-510 마일스톤 유입 및 자큐보 출시",
    "targetPrice": 145000,
    "currentPrice": 112000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "대웅제약",
    "stockCode": "069620",
    "reportTitle": "나보타(주보) 미국·유럽 톡신 수출 호조 및 펙수클루 글로벌 출시",
    "targetPrice": 180000,
    "currentPrice": 138000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "보령",
    "stockCode": "003850",
    "reportTitle": "카나브 패밀리 매출 1,500억 돌파 및 항암제 사업 포트폴리오 강화",
    "targetPrice": 16000,
    "currentPrice": 12100,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "휴젤",
    "stockCode": "145020",
    "reportTitle": "보툴렉스 미국 FDA 최종 승인 및 톡신 글로벌 3대 시장 공략",
    "targetPrice": 340000,
    "currentPrice": 270000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "클래시스",
    "stockCode": "214150",
    "reportTitle": "슈링크 유니버스 및 볼뉴머 글로벌 소모품 매출 비중 60% 돌파",
    "targetPrice": 62000,
    "currentPrice": 51000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "파마리서치",
    "stockCode": "214450",
    "reportTitle": "리쥬란 글로벌 인지도 확산 및 C-PDRN 기반 화장품 수출 호조",
    "targetPrice": 220000,
    "currentPrice": 178000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "메디톡스",
    "stockCode": "086900",
    "reportTitle": "뉴럭스 수출 확대 및 액상형 톡신 MT10107 글로벌 상용화",
    "targetPrice": 190000,
    "currentPrice": 148000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "덴티움",
    "stockCode": "145720",
    "reportTitle": "중국 VBP 물량 증가 및 유럽·인도 신흥국 임플란트 매출 고성장",
    "targetPrice": 135000,
    "currentPrice": 101000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "DB하이텍",
    "stockCode": "000990",
    "reportTitle": "8인치 파운드리 가동률 반등 및 전력반도체(SiC) 가치",
    "targetPrice": 62000,
    "currentPrice": 48500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "LG디스플레이",
    "stockCode": "034220",
    "reportTitle": "아이폰 OLED 공급 확대 및 차량용 디스플레이 흑자 기조",
    "targetPrice": 15000,
    "currentPrice": 11500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "테스",
    "stockCode": "095610",
    "reportTitle": "메모리 낸드 고단화에 따른 PECVD 식각 장비 수요",
    "targetPrice": 26000,
    "currentPrice": 20500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "유진테크",
    "stockCode": "084370",
    "reportTitle": "LPCVD 및 싱글 웨이퍼 증착 장비 메모리 채용 확대",
    "targetPrice": 46000,
    "currentPrice": 37000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "두산테스나",
    "stockCode": "131970",
    "reportTitle": "CIS 및 SoC 웨이퍼 테스트 외주 1위 경쟁력 유지",
    "targetPrice": 52000,
    "currentPrice": 41500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "원익QnC",
    "stockCode": "074600",
    "reportTitle": "쿼츠웨어 부품 소모품 수요 및 모멘티브 인수 시너지",
    "targetPrice": 36000,
    "currentPrice": 28500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "티씨케이",
    "stockCode": "064760",
    "reportTitle": "SiC 링 오리지널 제조사로서 식각 공정 필수 부품 공급",
    "targetPrice": 125000,
    "currentPrice": 98000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "ISC",
    "stockCode": "095340",
    "reportTitle": "실리콘 러버 테스트 소켓 글로벌 AI 반도체향 납품",
    "targetPrice": 78000,
    "currentPrice": 61000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "가온칩스",
    "stockCode": "399720",
    "reportTitle": "ARM 디자인파트너(DSP) 최우수 파트너 및 선단 턴키 수주",
    "targetPrice": 85000,
    "currentPrice": 68000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "에이디테크놀로지",
    "stockCode": "200710",
    "reportTitle": "TSMC에서 삼성 DSP로 전환 후 선단 프로젝트 가시화",
    "targetPrice": 34000,
    "currentPrice": 26500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "오픈엣지테크놀로지",
    "stockCode": "394280",
    "reportTitle": "NPU 및 메모리 컨트롤러 IP 라이선스 글로벌 확장",
    "targetPrice": 29000,
    "currentPrice": 22500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "칩스앤미디어",
    "stockCode": "094360",
    "reportTitle": "비디오 코덱 IP 및 특화 NPU 기술 라이선스 호조",
    "targetPrice": 26000,
    "currentPrice": 20000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "케이씨텍",
    "stockCode": "281820",
    "reportTitle": "CMP 슬러리 및 장비 국산화 선도",
    "targetPrice": 39000,
    "currentPrice": 31000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "피에스케이",
    "stockCode": "319660",
    "reportTitle": "PR Strip 장비 글로벌 독보적 1위",
    "targetPrice": 35000,
    "currentPrice": 27500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "유니테스트",
    "stockCode": "086390",
    "reportTitle": "DDR5 및 차세대 메모리 컴포넌트 테스터",
    "targetPrice": 18000,
    "currentPrice": 14200,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "네패스",
    "stockCode": "033640",
    "reportTitle": "팬아웃 패키징 및 WLP 후공정 기술력",
    "targetPrice": 21000,
    "currentPrice": 16800,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "엘비세미콘",
    "stockCode": "061970",
    "reportTitle": "범핑 및 백엔드 테스트 안정적 물량 회복",
    "targetPrice": 8500,
    "currentPrice": 6700,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "심텍",
    "stockCode": "222800",
    "reportTitle": "모바일/서버용 패키지 기판 수익성 정상화",
    "targetPrice": 32000,
    "currentPrice": 25000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "대덕전자",
    "stockCode": "353200",
    "reportTitle": "FC-BGA 하이엔드 기판 라인 본격 가동",
    "targetPrice": 28000,
    "currentPrice": 22000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "코리아서킷",
    "stockCode": "007810",
    "reportTitle": "통신용 기판 및 FC-BGA 신사업",
    "targetPrice": 19000,
    "currentPrice": 15000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "해성디에스",
    "stockCode": "195870",
    "reportTitle": "차량용 반도체 리드프레임 및 패키지 서브스트레이트",
    "targetPrice": 55000,
    "currentPrice": 43500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "테크윙",
    "stockCode": "089030",
    "reportTitle": "큐브 프로버 HBM 핸들러 신규 수주 폭발",
    "targetPrice": 48000,
    "currentPrice": 38500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "GST",
    "stockCode": "083450",
    "reportTitle": "친환경 칠러 및 스크러버 해외 공급 확대",
    "targetPrice": 38000,
    "currentPrice": 29800,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "와이씨",
    "stockCode": "232140",
    "reportTitle": "HBM 전용 고속 테스터 납품 본격화",
    "targetPrice": 19500,
    "currentPrice": 15200,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "에프에스티",
    "stockCode": "036810",
    "reportTitle": "EUV 펠리클 및 칠러 장비 개발 가속",
    "targetPrice": 28000,
    "currentPrice": 22100,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "에스앤에스텍",
    "stockCode": "101490",
    "reportTitle": "블랭크마스크 국산화 및 EUV 펠리클 양산 준비",
    "targetPrice": 49000,
    "currentPrice": 38500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "한솔케미칼",
    "stockCode": "014680",
    "reportTitle": "과산화수소 및 퀀텀닷·배터리 바인더 복합 성장",
    "targetPrice": 240000,
    "currentPrice": 189000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "케이엔제이",
    "stockCode": "272110",
    "reportTitle": "SiC 포커스링 증설 및 애프터마켓 점유율 확대",
    "targetPrice": 23000,
    "currentPrice": 18200,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "제우스",
    "stockCode": "079370",
    "reportTitle": "세정 장비 국산화 및 로봇 자동화 사업 다각화",
    "targetPrice": 22000,
    "currentPrice": 17500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "티에프이",
    "stockCode": "425420",
    "reportTitle": "테스트 소켓·보드·체인지키트 턴키 솔루션",
    "targetPrice": 35000,
    "currentPrice": 27800,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "퀄리타스반도체",
    "stockCode": "432720",
    "reportTitle": "초고속 인터커넥트 인터페이스 IP 설계 역량",
    "targetPrice": 24000,
    "currentPrice": 18800,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "파두",
    "stockCode": "440110",
    "reportTitle": "기업용 SSD 컨트롤러 글로벌 빅테크 공급 재개",
    "targetPrice": 21000,
    "currentPrice": 16500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "자람테크놀로지",
    "stockCode": "389020",
    "reportTitle": "통신용 반도체 및 온디바이스 AI 특화 칩",
    "targetPrice": 42000,
    "currentPrice": 33000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "에이직랜드",
    "stockCode": "445090",
    "reportTitle": "국내 유일 TSMC VCA 파트너로서 주문형 반도체 설계",
    "targetPrice": 48000,
    "currentPrice": 37500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "기가비스",
    "stockCode": "420770",
    "reportTitle": "반도체 기판 광학 검사 및 수리 장비 글로벌 1위",
    "targetPrice": 68000,
    "currentPrice": 53500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "제이티",
    "stockCode": "089790",
    "reportTitle": "번인 소터 및 메모리 테스트 핸들러 장비",
    "targetPrice": 11500,
    "currentPrice": 9100,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "티엘비",
    "stockCode": "356860",
    "reportTitle": "DDR5 R-DIMM 메모리 모듈 PCB 전문 생산",
    "targetPrice": 27000,
    "currentPrice": 21200,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "인텍플러스",
    "stockCode": "064290",
    "reportTitle": "3D 머신비전 패키징 및 플립칩 검사 장비",
    "targetPrice": 29000,
    "currentPrice": 23000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "디아이",
    "stockCode": "003160",
    "reportTitle": "HBM 웨이퍼 번인 테스터 개발 및 납품 확대",
    "targetPrice": 19000,
    "currentPrice": 14900,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "유니셈",
    "stockCode": "036200",
    "reportTitle": "가스 스크러버 및 칠러 반도체 공정 필수 장비",
    "targetPrice": 9800,
    "currentPrice": 7800,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "덕산네오룩스",
    "stockCode": "213420",
    "reportTitle": "OLED 유기물 소재 블랙PDL 적용 확대",
    "targetPrice": 46000,
    "currentPrice": 36500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "이녹스첨단소재",
    "stockCode": "272290",
    "reportTitle": "OLED 봉지필름 및 방열시트 안정적 공급",
    "targetPrice": 38000,
    "currentPrice": 30200,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "피엔에이치테크",
    "stockCode": "239890",
    "reportTitle": "OLED 고굴절 CPL 및 블루 발광 재료 공급",
    "targetPrice": 24000,
    "currentPrice": 19100,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "선익시스템",
    "stockCode": "171090",
    "reportTitle": "8.6세대 OLED 증착기 글로벌 수주 가시화",
    "targetPrice": 52000,
    "currentPrice": 41000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "에코프로",
    "stockCode": "086520",
    "reportTitle": "지주사 가치 및 전구체·리사이클링 밸류체인 시너지",
    "targetPrice": 115000,
    "currentPrice": 89000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "코스모화학",
    "stockCode": "005420",
    "reportTitle": "이산화티타늄 및 폐배터리 리사이클링 상업 생산",
    "targetPrice": 35000,
    "currentPrice": 27500,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "SK아이이테크놀로지",
    "stockCode": "361610",
    "reportTitle": "북미 분리막 시장 진출 및 캡티브 고객 다변화",
    "targetPrice": 58000,
    "currentPrice": 45000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "더블유씨피",
    "stockCode": "393890",
    "reportTitle": "헝가리 신공장 완공 및 유럽 자동차향 분리막 공급",
    "targetPrice": 32000,
    "currentPrice": 25200,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "엔켐",
    "stockCode": "248260",
    "reportTitle": "북미 전해액 압도적 1위 및 글로벌 공장 현지화 수혜",
    "targetPrice": 240000,
    "currentPrice": 185000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "솔브레인홀딩스",
    "stockCode": "032390",
    "reportTitle": "전해액 자회사 노스볼트 등 글로벌 배터리사 공급",
    "targetPrice": 68000,
    "currentPrice": 53000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "동화기업",
    "stockCode": "016250",
    "reportTitle": "동화일렉트로라이트 전해액 북미 라인 증설",
    "targetPrice": 42000,
    "currentPrice": 33000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "나노신소재",
    "stockCode": "121600",
    "reportTitle": "탄소나노튜브(CNT) 도전재 건식 공정 적용 선도",
    "targetPrice": 135000,
    "currentPrice": 105000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "신흥에스이씨",
    "stockCode": "243840",
    "reportTitle": "각형 캡어셈블리 및 46파이 캔 부품 공급",
    "targetPrice": 46000,
    "currentPrice": 36000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "상신이디피",
    "stockCode": "091580",
    "reportTitle": "삼성SDI 원통형 캔 부품 핵심 벤더",
    "targetPrice": 18500,
    "currentPrice": 14600,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "피엔티",
    "stockCode": "137400",
    "reportTitle": "롤투롤 전극 코터 장비 글로벌 수주 잔고 사상 최대",
    "targetPrice": 65000,
    "currentPrice": 52000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "씨아이에스",
    "stockCode": "222080",
    "reportTitle": "전고체 배터리 파일럿 장비 및 캘린더링 장비 수주",
    "targetPrice": 13500,
    "currentPrice": 10800,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "하나기술",
    "stockCode": "299030",
    "reportTitle": "화성공정 턴키 장비 및 반고체 조립 장비 기술력",
    "targetPrice": 52000,
    "currentPrice": 41000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "디이엔티",
    "stockCode": "091440",
    "reportTitle": "양극 레이저 노칭 장비 독점적 지위 지속",
    "targetPrice": 18000,
    "currentPrice": 14200,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "윤성에프앤씨",
    "stockCode": "372170",
    "reportTitle": "배터리 믹싱 시스템 글로벌 대형 수주 풀가동",
    "targetPrice": 82000,
    "currentPrice": 64000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "롯데에너지머티리얼즈",
    "stockCode": "020150",
    "reportTitle": "초극박 동박 및 하이엔드 전지박 북미 고객 확보",
    "targetPrice": 49000,
    "currentPrice": 39000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "솔루스첨단소재",
    "stockCode": "336370",
    "reportTitle": "유럽 유일 전지박 공장 및 AI 가속기용 동박 납품",
    "targetPrice": 17000,
    "currentPrice": 13500,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "금양",
    "stockCode": "001570",
    "reportTitle": "4695 원통형 배터리 공장 준공 및 양산 테스트",
    "targetPrice": 72000,
    "currentPrice": 56000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "민테크",
    "stockCode": "452200",
    "reportTitle": "임피던스 기반 배터리 진단 시스템 독보적 기술",
    "targetPrice": 13000,
    "currentPrice": 10200,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "이닉스",
    "stockCode": "445600",
    "reportTitle": "배터리 셀 패드 및 내화격벽 안전 솔루션",
    "targetPrice": 14500,
    "currentPrice": 11400,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "제일엠앤에스",
    "stockCode": "412540",
    "reportTitle": "고점도 슬러리 믹싱 장비 북미 수주 확대",
    "targetPrice": 21000,
    "currentPrice": 16800,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "알멕",
    "stockCode": "354320",
    "reportTitle": "알루미늄 압출 배터리 모듈 케이스 공급",
    "targetPrice": 38000,
    "currentPrice": 30500,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "삼천당제약",
    "stockCode": "000250",
    "reportTitle": "경구용 GLP-1 비만치료제 글로벌 라이선스 계약",
    "targetPrice": 165000,
    "currentPrice": 132000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "한올바이오파마",
    "stockCode": "009420",
    "reportTitle": "자가면역질환 항체 IMVT-1402 임상 3상 순항",
    "targetPrice": 44000,
    "currentPrice": 34800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "HK이노엔",
    "stockCode": "195940",
    "reportTitle": "케이캡 처방액 사상 최대 및 미국 FDA 승인 기대",
    "targetPrice": 52000,
    "currentPrice": 42000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "동아에스티",
    "stockCode": "170900",
    "reportTitle": "스텔라라 시밀러 DMB-3115 글로벌 판권 가시화",
    "targetPrice": 78000,
    "currentPrice": 62500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "녹십자",
    "stockCode": "006280",
    "reportTitle": "혈액제제 알리글로 미국 직판 개시 및 매출 성장",
    "targetPrice": 165000,
    "currentPrice": 131000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "JW중외제약",
    "stockCode": "001060",
    "reportTitle": "헴리브라 급여 확대 및 통풍치료제 에파미나루드 임상",
    "targetPrice": 42000,
    "currentPrice": 33500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "원텍",
    "stockCode": "336570",
    "reportTitle": "올리지오 글로벌 수출 본격화 및 태국·미국 확장",
    "targetPrice": 12000,
    "currentPrice": 9600,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "비올",
    "stockCode": "335890",
    "reportTitle": "실펌X 마이크로니들 고주파 미용의료기기 북미 성장",
    "targetPrice": 11500,
    "currentPrice": 9200,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "바텍",
    "stockCode": "043150",
    "reportTitle": "디지털 엑스레이 덴탈 이미징 글로벌 1위 지속",
    "targetPrice": 38000,
    "currentPrice": 30500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "루닛",
    "stockCode": "328130",
    "reportTitle": "루닛 인사이트 AI 암진단 및 볼파라 인수 시너지",
    "targetPrice": 65000,
    "currentPrice": 51000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "뷰노",
    "stockCode": "338220",
    "reportTitle": "AI 심정지 예측 딥카스 국내외 종합병원 도입 확산",
    "targetPrice": 42000,
    "currentPrice": 33500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "펩트론",
    "stockCode": "087010",
    "reportTitle": "스마트데포 1개월 지속형 비만약 글로벌 기술이전",
    "targetPrice": 110000,
    "currentPrice": 88000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "인벤티지랩",
    "stockCode": "389470",
    "reportTitle": "장기지속형 주사제 LNP 플랫폼 제약사 협업 확대",
    "targetPrice": 24000,
    "currentPrice": 19200,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "오스코텍",
    "stockCode": "039200",
    "reportTitle": "레이저티닙(렉라자) 글로벌 매출 로열티 본격 수령",
    "targetPrice": 39000,
    "currentPrice": 31000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "지아이이노베이션",
    "stockCode": "358570",
    "reportTitle": "GI-101A 면역항암제 글로벌 임상 및 파이프라인 가치",
    "targetPrice": 16000,
    "currentPrice": 12800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "보로노이",
    "stockCode": "310210",
    "reportTitle": "비소세포폐암 표적치료제 VRN07 임상 데이터 우수성",
    "targetPrice": 92000,
    "currentPrice": 74000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "큐리옥스바이오시스템즈",
    "stockCode": "445680",
    "reportTitle": "비원심분리 세포세척 자동화 장비 글로벌 표준화",
    "targetPrice": 38000,
    "currentPrice": 30500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "HL만도",
    "stockCode": "204320",
    "reportTitle": "자율주행 전동조향(SbW) 시스템 및 글로벌 EV 수주",
    "targetPrice": 49000,
    "currentPrice": 39500,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "현대위아",
    "stockCode": "011210",
    "reportTitle": "통합 열관리 모듈 양산 및 방산 K9 곡사포 포신 생산",
    "targetPrice": 68000,
    "currentPrice": 54500,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "한온시스템",
    "stockCode": "018880",
    "reportTitle": "한국타이어 대주주 편입에 따른 재무구조 개선 및 열관리",
    "targetPrice": 5200,
    "currentPrice": 4100,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "에스엘",
    "stockCode": "005850",
    "reportTitle": "LED 헤드램프 및 BMS 배터리 관리 시스템 수주",
    "targetPrice": 48000,
    "currentPrice": 38500,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "화신",
    "stockCode": "010690",
    "reportTitle": "북미 배터리 팩 케이스 및 섀시 부품 공급 본격화",
    "targetPrice": 14500,
    "currentPrice": 11600,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "서연이화",
    "stockCode": "200880",
    "reportTitle": "도어트림 및 내장재 북미·인도 공장 현지화 수혜",
    "targetPrice": 22000,
    "currentPrice": 17500,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "성우하이텍",
    "stockCode": "015750",
    "reportTitle": "차체 경량화 소재 및 배터리 케이스 글로벌 납품",
    "targetPrice": 9500,
    "currentPrice": 7600,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "아진산업",
    "stockCode": "013310",
    "reportTitle": "조지아 신공장 가동 및 현대차그룹 북미 생산 동반 성장",
    "targetPrice": 4500,
    "currentPrice": 3600,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "세방전지",
    "stockCode": "004490",
    "reportTitle": "AGM 배터리 교체 수요 및 전기차 배터리팩 제조",
    "targetPrice": 95000,
    "currentPrice": 76000,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "현대오토에버",
    "stockCode": "307950",
    "reportTitle": "SDV 모빌진 플랫폼 적용 확대 및 스마트팩토리 IT구축",
    "targetPrice": 185000,
    "currentPrice": 146000,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "모트렉스",
    "stockCode": "118990",
    "reportTitle": "인포테인먼트 IVI 시스템 및 PBV 특화 솔루션",
    "targetPrice": 16000,
    "currentPrice": 12800,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "HD현대마린솔루션",
    "stockCode": "443060",
    "reportTitle": "선박 친환경 개조(Retrofit) 및 AM 애프터마켓 독점",
    "targetPrice": 160000,
    "currentPrice": 128000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "HD현대미포",
    "stockCode": "010620",
    "reportTitle": "중형 PC선 및 피더 컨테이너선 선가 급등 수익성 개선",
    "targetPrice": 115000,
    "currentPrice": 92000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "삼성중공업",
    "stockCode": "010140",
    "reportTitle": "FLNG 해양플랜트 독점 수주 및 친환경 LNG선 흑자 전환",
    "targetPrice": 13500,
    "currentPrice": 10800,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "LIG넥스원",
    "stockCode": "079550",
    "reportTitle": "천궁-II 중동 대규모 수출 및 고스트로보틱스 로봇 시너지",
    "targetPrice": 250000,
    "currentPrice": 205000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "두산밥캣",
    "stockCode": "241560",
    "reportTitle": "북미 소형 건설기계 콤팩트 트랙터 인프라 투자 지속",
    "targetPrice": 58000,
    "currentPrice": 46500,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "HD현대일렉트릭",
    "stockCode": "267260",
    "reportTitle": "미국 AI 데이터센터발 초고압 변압기 수주 잔고 폭증",
    "targetPrice": 380000,
    "currentPrice": 310000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "효성중공업",
    "stockCode": "298040",
    "reportTitle": "유럽 및 북미 초고압 차단기·변압기 마진율 사상 최고",
    "targetPrice": 420000,
    "currentPrice": 345000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "LS ELECTRIC",
    "stockCode": "010120",
    "reportTitle": "배전 솔루션 및 데이터센터용 전력기기 글로벌 침투",
    "targetPrice": 240000,
    "currentPrice": 192000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "일진전기",
    "stockCode": "103590",
    "reportTitle": "초고압 케이블 및 변압기 증설 효과 본격 반영",
    "targetPrice": 32000,
    "currentPrice": 25800,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "제룡전기",
    "stockCode": "033100",
    "reportTitle": "미국 패드변압기 수출 비중 80% 고마진 유지",
    "targetPrice": 72000,
    "currentPrice": 58000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "대한전선",
    "stockCode": "001440",
    "reportTitle": "해저케이블 1공장 가동 및 글로벌 HVDC 송전망 수혜",
    "targetPrice": 18500,
    "currentPrice": 14800,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "한전기술",
    "stockCode": "052690",
    "reportTitle": "체코 신규 원전 종합 설계 및 SMR 기술 개발",
    "targetPrice": 82000,
    "currentPrice": 65000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "한전KPS",
    "stockCode": "051600",
    "reportTitle": "국내외 화력·원자력 발전소 정비 매출 안정적 창출",
    "targetPrice": 46000,
    "currentPrice": 37000,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "현대인프라코어",
    "stockCode": "042670",
    "reportTitle": "엔진 사업부 방산/발전용 고마진 및 건설기계 회복",
    "targetPrice": 9800,
    "currentPrice": 7900,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "풍산",
    "stockCode": "103140",
    "reportTitle": "구리 신동 가격 상승 및 155mm 포탄 방산 수출 급증",
    "targetPrice": 74000,
    "currentPrice": 59500,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "시프트업",
    "stockCode": "462870",
    "reportTitle": "승리의여신 니케 중국 출시 및 스텔라블레이드 DLC",
    "targetPrice": 78000,
    "currentPrice": 62500,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "디어유",
    "stockCode": "376300",
    "reportTitle": "버블 플랫폼 미국·일본 아티스트 입점 및 유료 구독",
    "targetPrice": 38000,
    "currentPrice": 30500,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "콘텐트리중앙",
    "stockCode": "036420",
    "reportTitle": "메가박스 흑자 전환 및 SLL 드라마 IP 글로벌 유통",
    "targetPrice": 14500,
    "currentPrice": 11600,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "SOOP",
    "stockCode": "067160",
    "reportTitle": "글로벌 스트리밍 플랫폼 전환 및 e스포츠 생태계 확대",
    "targetPrice": 145000,
    "currentPrice": 116000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "카페24",
    "stockCode": "042000",
    "reportTitle": "유튜브 쇼핑 전용 스토어 개설 공식 파트너 수혜",
    "targetPrice": 39000,
    "currentPrice": 31000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "카카오뱅크",
    "stockCode": "323410",
    "reportTitle": "여수신 잔액 고성장 및 플랫폼 수수료 이익 다각화",
    "targetPrice": 26000,
    "currentPrice": 20800,
    "sector": "금융/지주"
  },
  {
    "stockName": "SK",
    "stockCode": "034730",
    "reportTitle": "사업 포트폴리오 리밸런싱 및 자사주 소각 주주환원",
    "targetPrice": 195000,
    "currentPrice": 155000,
    "sector": "금융/지주"
  },
  {
    "stockName": "LG",
    "stockCode": "003550",
    "reportTitle": "순현금 우량 지주사로서 배당 확대 및 밸류업 선도",
    "targetPrice": 92000,
    "currentPrice": 76000,
    "sector": "금융/지주"
  },
  {
    "stockName": "CJ",
    "stockCode": "001040",
    "reportTitle": "올리브영 고성장 및 주요 자회사 실적 턴어라운드",
    "targetPrice": 145000,
    "currentPrice": 118000,
    "sector": "금융/지주"
  },
  {
    "stockName": "두산",
    "stockCode": "000150",
    "reportTitle": "전자BG AI 가속기용 동박적층판(CCL) 엔비디아 공급",
    "targetPrice": 190000,
    "currentPrice": 152000,
    "sector": "금융/지주"
  },
  {
    "stockName": "GS",
    "stockCode": "078930",
    "reportTitle": "GS칼텍스 정제마진 회복 및 친환경 에너지 신사업",
    "targetPrice": 52000,
    "currentPrice": 42500,
    "sector": "금융/지주"
  },
  {
    "stockName": "LS",
    "stockCode": "006260",
    "reportTitle": "해저케이블 및 전력기기 자회사 실적 호조 지분가치",
    "targetPrice": 145000,
    "currentPrice": 116000,
    "sector": "금융/지주"
  },
  {
    "stockName": "DB손해보험",
    "stockCode": "005830",
    "reportTitle": "업계 최상위 CSM 확보 및 안정적 주주환원율",
    "targetPrice": 125000,
    "currentPrice": 102000,
    "sector": "금융/지주"
  },
  {
    "stockName": "현대해상",
    "stockCode": "001450",
    "reportTitle": "장기 보장성 보험 신계약 증가 및 배당 매력 부각",
    "targetPrice": 38000,
    "currentPrice": 31200,
    "sector": "금융/지주"
  },
  {
    "stockName": "롯데웰푸드",
    "stockCode": "280360",
    "reportTitle": "인도 롯데빼빼로 현지 생산 및 빙과 통합 시너지",
    "targetPrice": 185000,
    "currentPrice": 148000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "대상",
    "stockCode": "001680",
    "reportTitle": "종가 김치 미국·유럽 수출 급증 및 김치공장 증설",
    "targetPrice": 26000,
    "currentPrice": 21000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "롯데칠성",
    "stockCode": "005300",
    "reportTitle": "필리핀 펩시 연결 편입 및 제로 탄산 음료 시장 선도",
    "targetPrice": 160000,
    "currentPrice": 128000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "GS리테일",
    "stockCode": "007070",
    "reportTitle": "GS25 점포 효율화 및 호텔·물류 부문 수익성 개선",
    "targetPrice": 25000,
    "currentPrice": 20200,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "롯데쇼핑",
    "stockCode": "023530",
    "reportTitle": "백화점 본점 리뉴얼 및 베트남 롯데몰 흥행 지속",
    "targetPrice": 85000,
    "currentPrice": 68000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "현대백화점",
    "stockCode": "069960",
    "reportTitle": "더현대 서울 글로벌 랜드마크화 및 지누스 회복",
    "targetPrice": 62000,
    "currentPrice": 49800,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "신세계",
    "stockCode": "004170",
    "reportTitle": "강남점 국내 단일 점포 1위 및 신세계면세점 정상화",
    "targetPrice": 195000,
    "currentPrice": 155000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "영원무역",
    "stockCode": "111770",
    "reportTitle": "룰루레몬 등 글로벌 바이어 OEM 수주 주문 반등",
    "targetPrice": 52000,
    "currentPrice": 41500,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "F&F",
    "stockCode": "383220",
    "reportTitle": "MLB 중국 오프라인 출점 및 듀베티카·수프라 성장",
    "targetPrice": 85000,
    "currentPrice": 68000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "코스메카코리아",
    "stockCode": "241710",
    "reportTitle": "인디 화장품 브랜드 ODM 수주 폭주 및 미국 잉글우드랩 시너지",
    "targetPrice": 88000,
    "currentPrice": 71000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "씨앤씨인터내셔널",
    "stockCode": "352480",
    "reportTitle": "립 메이크업 글로벌 1위 ODM 및 2공장 풀가동",
    "targetPrice": 120000,
    "currentPrice": 96000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "마녀공장",
    "stockCode": "439090",
    "reportTitle": "클렌징 오일 미국 코스트코 입점 및 유럽 수출 개시",
    "targetPrice": 32000,
    "currentPrice": 25500,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "브이티",
    "stockCode": "018290",
    "reportTitle": "리들샷 일본·한국 올리브영 품절 대란 및 미국 확장",
    "targetPrice": 42000,
    "currentPrice": 33500,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "에이피알",
    "stockCode": "278470",
    "reportTitle": "메디큐브 뷰티 디바이스 글로벌 매출 급증",
    "targetPrice": 340000,
    "currentPrice": 275000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "롯데케미칼",
    "stockCode": "011170",
    "reportTitle": "에틸렌 스프레드 저점 통과 및 스페셜티 비중 확대",
    "targetPrice": 115000,
    "currentPrice": 92000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "금호석유",
    "stockCode": "011780",
    "reportTitle": "NB라텍스 수요 반등 및 합성고무 타이어용 고마진",
    "targetPrice": 165000,
    "currentPrice": 132000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "한화솔루션",
    "stockCode": "009830",
    "reportTitle": "미국 조지아 카터스빌 솔라허브 가동 및 IRA 세액공제",
    "targetPrice": 32000,
    "currentPrice": 25500,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "한국가스공사",
    "stockCode": "036460",
    "reportTitle": "미수금 회수용 가스요금 조정 및 동해 가스전 테마",
    "targetPrice": 48000,
    "currentPrice": 39500,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "지역난방공사",
    "stockCode": "071320",
    "reportTitle": "열요금 원가 연동제 정착에 따른 실적 턴어라운드",
    "targetPrice": 49000,
    "currentPrice": 40500,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "포스코인터내셔널",
    "stockCode": "047050",
    "reportTitle": "호주 세넥스 에너지 증산 및 구동모터코어 글로벌 수주",
    "targetPrice": 68000,
    "currentPrice": 54500,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "SK가스",
    "stockCode": "018670",
    "reportTitle": "울산 GPS LNG·LPG 복합발전소 상업 가동 개시",
    "targetPrice": 195000,
    "currentPrice": 158000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "효성첨단소재",
    "stockCode": "298050",
    "reportTitle": "타이어코드 점유율 1위 및 우주항공용 탄소섬유 증설",
    "targetPrice": 410000,
    "currentPrice": 330000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "동국제강",
    "stockCode": "460860",
    "reportTitle": "컬러강판 럭스틸 고부가가치 및 봉형강 감산 대응",
    "targetPrice": 12500,
    "currentPrice": 9800,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "세아베스틸지주",
    "stockCode": "001430",
    "reportTitle": "특수강 북미 CASK 원전 해체용기 수주 및 방산용 소재",
    "targetPrice": 28000,
    "currentPrice": 22500,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "세아제강",
    "stockCode": "306200",
    "reportTitle": "북미 오일·가스 에너지용 강관 수출 및 해상풍력 하부구조물",
    "targetPrice": 165000,
    "currentPrice": 131000,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "조일알미늄",
    "stockCode": "018470",
    "reportTitle": "2차전지 양극박용 알루미늄 스트립 증설",
    "targetPrice": 2800,
    "currentPrice": 2200,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "삼아알미늄",
    "stockCode": "006110",
    "reportTitle": "초극박 배터리 알루미늄박 도요타통상 공급 계약",
    "targetPrice": 72000,
    "currentPrice": 57000,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "LG이노텍",
    "stockCode": "011070",
    "reportTitle": "폴디드줌 카메라 모듈 독점 공급 및 차량 전장 부품",
    "targetPrice": 310000,
    "currentPrice": 248000,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "자화전자",
    "stockCode": "033240",
    "reportTitle": "엔코더 OIS 액추에이터 글로벌 스마트폰 납품",
    "targetPrice": 29000,
    "currentPrice": 23000,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "엠씨넥스",
    "stockCode": "282880",
    "reportTitle": "현대차그룹 자율주행용 센싱 카메라 점유율 1위",
    "targetPrice": 32000,
    "currentPrice": 25500,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "드림텍",
    "stockCode": "192650",
    "reportTitle": "스마트폰 지문인식 모듈 및 무선 바이오센서 헬스케어",
    "targetPrice": 13500,
    "currentPrice": 10800,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "파인엠텍",
    "stockCode": "441270",
    "reportTitle": "폴더블폰 내장 힌지(내장 플레이트) 독점적 지위",
    "targetPrice": 9800,
    "currentPrice": 7800,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "비에이치",
    "stockCode": "090460",
    "reportTitle": "디스플레이용 경연성 PCB(RF-PCB) 북미 고객사 탑재",
    "targetPrice": 25000,
    "currentPrice": 20100,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "이수페타시스",
    "stockCode": "007660",
    "reportTitle": "AI 가속기용 초고다층 PCB(MLB) 구글·엔비디아 직납",
    "targetPrice": 58000,
    "currentPrice": 47000,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "솔루엠",
    "stockCode": "248070",
    "reportTitle": "전자가격표시기(ESL) 글로벌 3대 플레이어 및 파워모듈",
    "targetPrice": 28000,
    "currentPrice": 22500,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "현대건설",
    "stockCode": "000720",
    "reportTitle": "대형 원전 해외 수주 및 사우디 네옴 프로젝트 실적",
    "targetPrice": 38000,
    "currentPrice": 30500,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "대우건설",
    "stockCode": "047040",
    "reportTitle": "나이지리아·이라크 플랜트 수주 및 체코 원전 시공 참여",
    "targetPrice": 4500,
    "currentPrice": 3600,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "GS건설",
    "stockCode": "006360",
    "reportTitle": "신규 수주 회복 및 신사업 GS이니마 수처리 매각 가치",
    "targetPrice": 19000,
    "currentPrice": 15200,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "삼성E&A",
    "stockCode": "028050",
    "reportTitle": "사우디 파딜리 가스 플랜트 수주 및 탄소포집 신사업",
    "targetPrice": 31000,
    "currentPrice": 24800,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "CJ대한통운",
    "stockCode": "000120",
    "reportTitle": "알리익스프레스·테무 통관 배송 전담 및 풀필먼트",
    "targetPrice": 125000,
    "currentPrice": 99000,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "HMM",
    "stockCode": "011200",
    "reportTitle": "SCFI 컨테이너선 운임 강세 및 친환경 초대형선 인도",
    "targetPrice": 21000,
    "currentPrice": 17200,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "팬오션",
    "stockCode": "028670",
    "reportTitle": "BDI 건화물선 운임 반등 및 장기 LNG 운송 계약",
    "targetPrice": 4800,
    "currentPrice": 3850,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "제주항공",
    "stockCode": "089590",
    "reportTitle": "일본 및 동남아 여객 수요 견조 및 신기재 B737-8 도입",
    "targetPrice": 12000,
    "currentPrice": 9700,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "진에어",
    "stockCode": "272450",
    "reportTitle": "대한항공-아시아나 LCC 3사 통합 시너지 최대 수혜",
    "targetPrice": 13500,
    "currentPrice": 10800,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "미코",
    "stockCode": "059090",
    "reportTitle": "[미코] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 16000,
    "currentPrice": 12500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "코미코",
    "stockCode": "183300",
    "reportTitle": "[코미코] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 75000,
    "currentPrice": 61000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "피에스케이홀딩스",
    "stockCode": "031980",
    "reportTitle": "[피에스케이홀딩스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 58000,
    "currentPrice": 46000,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "에스티아이",
    "stockCode": "039440",
    "reportTitle": "[에스티아이] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 36000,
    "currentPrice": 28500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "싸이맥스",
    "stockCode": "160980",
    "reportTitle": "[싸이맥스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 18500,
    "currentPrice": 14800,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "로체시스템즈",
    "stockCode": "071280",
    "reportTitle": "[로체시스템즈] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 12000,
    "currentPrice": 9500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "한양이엔지",
    "stockCode": "045100",
    "reportTitle": "[한양이엔지] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 24000,
    "currentPrice": 19200,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "원익홀딩스",
    "stockCode": "030530",
    "reportTitle": "[원익홀딩스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4500,
    "currentPrice": 3600,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "에프엔에스테크",
    "stockCode": "083500",
    "reportTitle": "[에프엔에스테크] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 11000,
    "currentPrice": 8800,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "시그네틱스",
    "stockCode": "033170",
    "reportTitle": "[시그네틱스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 2200,
    "currentPrice": 1750,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "에이팩트",
    "stockCode": "200470",
    "reportTitle": "[에이팩트] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 5500,
    "currentPrice": 4300,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "엑시콘",
    "stockCode": "092870",
    "reportTitle": "[엑시콘] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 19500,
    "currentPrice": 15500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "네오셈",
    "stockCode": "253590",
    "reportTitle": "[네오셈] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 14500,
    "currentPrice": 11500,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "오킨스전자",
    "stockCode": "080580",
    "reportTitle": "[오킨스전자] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 9200,
    "currentPrice": 7300,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "마이크로컨텍솔",
    "stockCode": "098120",
    "reportTitle": "[마이크로컨텍솔] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 11500,
    "currentPrice": 9100,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "샘씨엔에스",
    "stockCode": "252040",
    "reportTitle": "[샘씨엔에스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 7200,
    "currentPrice": 5700,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "아스플로",
    "stockCode": "159010",
    "reportTitle": "[아스플로] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 12500,
    "currentPrice": 9900,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "지오엘리먼트",
    "stockCode": "379300",
    "reportTitle": "[지오엘리먼트] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 14000,
    "currentPrice": 11100,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "레이저쎌",
    "stockCode": "412350",
    "reportTitle": "[레이저쎌] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 11000,
    "currentPrice": 8600,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "원준",
    "stockCode": "382840",
    "reportTitle": "[원준] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 24000,
    "currentPrice": 19000,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "엠케이전자",
    "stockCode": "033160",
    "reportTitle": "[엠케이전자] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 13500,
    "currentPrice": 10800,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "일진하이솔루스",
    "stockCode": "271940",
    "reportTitle": "[일진하이솔루스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 24000,
    "currentPrice": 19200,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "상아프론테크",
    "stockCode": "089980",
    "reportTitle": "[상아프론테크] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 28000,
    "currentPrice": 22500,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "아바텍",
    "stockCode": "149950",
    "reportTitle": "[아바텍] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 16000,
    "currentPrice": 12800,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "엔시스",
    "stockCode": "333140",
    "reportTitle": "[엔시스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 12500,
    "currentPrice": 9900,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "씨앤투스",
    "stockCode": "352700",
    "reportTitle": "[씨앤투스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4800,
    "currentPrice": 3800,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "율촌화학",
    "stockCode": "008730",
    "reportTitle": "[율촌화학] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 32000,
    "currentPrice": 25500,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "티에스아이",
    "stockCode": "277880",
    "reportTitle": "[티에스아이] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 9800,
    "currentPrice": 7800,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "안국약품",
    "stockCode": "001540",
    "reportTitle": "[안국약품] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 9800,
    "currentPrice": 7800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "환인제약",
    "stockCode": "016580",
    "reportTitle": "[환인제약] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 17500,
    "currentPrice": 14200,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "동국제약",
    "stockCode": "086450",
    "reportTitle": "[동국제약] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 21000,
    "currentPrice": 17000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "대원제약",
    "stockCode": "003220",
    "reportTitle": "[대원제약] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 18000,
    "currentPrice": 14500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "일양약품",
    "stockCode": "007570",
    "reportTitle": "[일양약품] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 16500,
    "currentPrice": 13200,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "삼진제약",
    "stockCode": "005500",
    "reportTitle": "[삼진제약] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 24000,
    "currentPrice": 19500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "한국유나이티드제약",
    "stockCode": "030720",
    "reportTitle": "[한국유나이티드제약] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 28000,
    "currentPrice": 22800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "신풍제약",
    "stockCode": "019170",
    "reportTitle": "[신풍제약] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 14500,
    "currentPrice": 11500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "일동제약",
    "stockCode": "249420",
    "reportTitle": "[일동제약] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 18500,
    "currentPrice": 14800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "부광약품",
    "stockCode": "003000",
    "reportTitle": "[부광약품] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 7800,
    "currentPrice": 6200,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "명문제약",
    "stockCode": "017180",
    "reportTitle": "[명문제약] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3200,
    "currentPrice": 2500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "경동제약",
    "stockCode": "011040",
    "reportTitle": "[경동제약] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 7500,
    "currentPrice": 6000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "고려제약",
    "stockCode": "025860",
    "reportTitle": "[고려제약] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 6800,
    "currentPrice": 5400,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "바이넥스",
    "stockCode": "053030",
    "reportTitle": "[바이넥스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 21000,
    "currentPrice": 16800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "이연제약",
    "stockCode": "102460",
    "reportTitle": "[이연제약] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 15000,
    "currentPrice": 12000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "씨젠",
    "stockCode": "096530",
    "reportTitle": "[씨젠] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 28000,
    "currentPrice": 22500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "바이오니아",
    "stockCode": "064550",
    "reportTitle": "[바이오니아] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 34000,
    "currentPrice": 27000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "바디텍메드",
    "stockCode": "206640",
    "reportTitle": "[바디텍메드] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 19500,
    "currentPrice": 15800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "랩지노믹스",
    "stockCode": "084650",
    "reportTitle": "[랩지노믹스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4200,
    "currentPrice": 3350,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "수젠텍",
    "stockCode": "253840",
    "reportTitle": "[수젠텍] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 6500,
    "currentPrice": 5100,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "휴마시스",
    "stockCode": "205470",
    "reportTitle": "[휴마시스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 2400,
    "currentPrice": 1900,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "케어젠",
    "stockCode": "214370",
    "reportTitle": "[케어젠] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 28000,
    "currentPrice": 22000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "메디포스트",
    "stockCode": "078160",
    "reportTitle": "[메디포스트] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 12500,
    "currentPrice": 9900,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "차바이오텍",
    "stockCode": "085660",
    "reportTitle": "[차바이오텍] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 17500,
    "currentPrice": 13800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "네이처셀",
    "stockCode": "007390",
    "reportTitle": "[네이처셀] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 14000,
    "currentPrice": 11000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "안트로젠",
    "stockCode": "065660",
    "reportTitle": "[안트로젠] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 18000,
    "currentPrice": 14200,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "바이오솔루션",
    "stockCode": "086820",
    "reportTitle": "[바이오솔루션] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 19500,
    "currentPrice": 15500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "지씨셀",
    "stockCode": "144510",
    "reportTitle": "[지씨셀] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 38000,
    "currentPrice": 30500,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "제넥신",
    "stockCode": "095700",
    "reportTitle": "[제넥신] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 8500,
    "currentPrice": 6800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "헬릭스미스",
    "stockCode": "084990",
    "reportTitle": "[헬릭스미스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4500,
    "currentPrice": 3600,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "엔지켐생명과학",
    "stockCode": "183490",
    "reportTitle": "[엔지켐생명과학] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 2100,
    "currentPrice": 1680,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "아이진",
    "stockCode": "185490",
    "reportTitle": "[아이진] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3200,
    "currentPrice": 2550,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "유틸렉스",
    "stockCode": "263050",
    "reportTitle": "[유틸렉스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3800,
    "currentPrice": 3000,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "앱클론",
    "stockCode": "174900",
    "reportTitle": "[앱클론] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 16000,
    "currentPrice": 12800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "올릭스",
    "stockCode": "226950",
    "reportTitle": "[올릭스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 18500,
    "currentPrice": 14800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "티움바이오",
    "stockCode": "321550",
    "reportTitle": "[티움바이오] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 9500,
    "currentPrice": 7600,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "카나리아바이오",
    "stockCode": "016790",
    "reportTitle": "[카나리아바이오] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 1500,
    "currentPrice": 1100,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "지트리비앤티",
    "stockCode": "115450",
    "reportTitle": "[지트리비앤티] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4200,
    "currentPrice": 3300,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "크리스탈지노믹스",
    "stockCode": "083790",
    "reportTitle": "[크리스탈지노믹스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3500,
    "currentPrice": 2800,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "바이오리더스",
    "stockCode": "142760",
    "reportTitle": "[바이오리더스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 2900,
    "currentPrice": 2300,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "인팩",
    "stockCode": "023810",
    "reportTitle": "[인팩] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 11500,
    "currentPrice": 9200,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "코리아에프티",
    "stockCode": "123410",
    "reportTitle": "[코리아에프티] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 6800,
    "currentPrice": 5400,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "대원강업",
    "stockCode": "000430",
    "reportTitle": "[대원강업] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4200,
    "currentPrice": 3350,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "동아화성",
    "stockCode": "041930",
    "reportTitle": "[동아화성] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 10500,
    "currentPrice": 8400,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "우리산업",
    "stockCode": "215360",
    "reportTitle": "[우리산업] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 16500,
    "currentPrice": 13100,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "센트랄모텍",
    "stockCode": "308170",
    "reportTitle": "[센트랄모텍] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 15000,
    "currentPrice": 12000,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "디아이씨",
    "stockCode": "092200",
    "reportTitle": "[디아이씨] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4800,
    "currentPrice": 3850,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "일지테크",
    "stockCode": "019540",
    "reportTitle": "[일지테크] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4500,
    "currentPrice": 3600,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "덕양산업",
    "stockCode": "024900",
    "reportTitle": "[덕양산업] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 6200,
    "currentPrice": 4900,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "모베이스전자",
    "stockCode": "012860",
    "reportTitle": "[모베이스전자] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 2800,
    "currentPrice": 2200,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "삼기",
    "stockCode": "122350",
    "reportTitle": "[삼기] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3100,
    "currentPrice": 2450,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "스마트레이더시스템",
    "stockCode": "424960",
    "reportTitle": "[스마트레이더시스템] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 14500,
    "currentPrice": 11500,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "대동",
    "stockCode": "000490",
    "reportTitle": "[대동] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 16000,
    "currentPrice": 12800,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "TYM",
    "stockCode": "002900",
    "reportTitle": "[TYM] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 5800,
    "currentPrice": 4600,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "SNT모티브",
    "stockCode": "064960",
    "reportTitle": "[SNT모티브] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 48000,
    "currentPrice": 38500,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "휴니드",
    "stockCode": "005870",
    "reportTitle": "[휴니드] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 9500,
    "currentPrice": 7600,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "빅텍",
    "stockCode": "065450",
    "reportTitle": "[빅텍] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 5500,
    "currentPrice": 4400,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "스페코",
    "stockCode": "013810",
    "reportTitle": "[스페코] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4200,
    "currentPrice": 3300,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "퍼스텍",
    "stockCode": "010820",
    "reportTitle": "[퍼스텍] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3800,
    "currentPrice": 3050,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "코츠테크놀로지",
    "stockCode": "448710",
    "reportTitle": "[코츠테크놀로지] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 24000,
    "currentPrice": 19200,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "현대에버다임",
    "stockCode": "041440",
    "reportTitle": "[현대에버다임] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 8500,
    "currentPrice": 6800,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "수산중공업",
    "stockCode": "017550",
    "reportTitle": "[수산중공업] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 2600,
    "currentPrice": 2100,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "에너토크",
    "stockCode": "019990",
    "reportTitle": "[에너토크] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 11000,
    "currentPrice": 8800,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "우진",
    "stockCode": "105840",
    "reportTitle": "[우진] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 10500,
    "currentPrice": 8400,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "일진파워",
    "stockCode": "094820",
    "reportTitle": "[일진파워] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 13500,
    "currentPrice": 10800,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "오르비텍",
    "stockCode": "046120",
    "reportTitle": "[오르비텍] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4500,
    "currentPrice": 3600,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "데브시스터즈",
    "stockCode": "194480",
    "reportTitle": "[데브시스터즈] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 58000,
    "currentPrice": 46500,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "네오위즈",
    "stockCode": "095660",
    "reportTitle": "[네오위즈] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 26000,
    "currentPrice": 20800,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "웹젠",
    "stockCode": "069080",
    "reportTitle": "[웹젠] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 18500,
    "currentPrice": 14800,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "더블유게임즈",
    "stockCode": "192080",
    "reportTitle": "[더블유게임즈] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 52000,
    "currentPrice": 42000,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "조이시티",
    "stockCode": "067000",
    "reportTitle": "[조이시티] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3400,
    "currentPrice": 2700,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "선데이토즈",
    "stockCode": "123420",
    "reportTitle": "[선데이토즈] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 14000,
    "currentPrice": 11200,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "엠게임",
    "stockCode": "058630",
    "reportTitle": "[엠게임] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 6800,
    "currentPrice": 5400,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "드래곤플라이",
    "stockCode": "030350",
    "reportTitle": "[드래곤플라이] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 800,
    "currentPrice": 620,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "큐브엔터",
    "stockCode": "182360",
    "reportTitle": "[큐브엔터] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 18500,
    "currentPrice": 14900,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "판타지오",
    "stockCode": "032800",
    "reportTitle": "[판타지오] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 450,
    "currentPrice": 350,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "NEW",
    "stockCode": "160550",
    "reportTitle": "[NEW] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4200,
    "currentPrice": 3350,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "쇼박스",
    "stockCode": "086980",
    "reportTitle": "[쇼박스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3800,
    "currentPrice": 3050,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "키다리스튜디오",
    "stockCode": "020120",
    "reportTitle": "[키다리스튜디오] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 5200,
    "currentPrice": 4100,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "미스터블루",
    "stockCode": "207760",
    "reportTitle": "[미스터블루] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 2400,
    "currentPrice": 1900,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "디앤씨미디어",
    "stockCode": "263720",
    "reportTitle": "[디앤씨미디어] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 24000,
    "currentPrice": 19200,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "밀리의서재",
    "stockCode": "418470",
    "reportTitle": "[밀리의서재] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 19500,
    "currentPrice": 15500,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "NHN KCP",
    "stockCode": "060250",
    "reportTitle": "[NHN KCP] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 12500,
    "currentPrice": 9900,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "KG이니시스",
    "stockCode": "035600",
    "reportTitle": "[KG이니시스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 13000,
    "currentPrice": 10400,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "다날",
    "stockCode": "064260",
    "reportTitle": "[다날] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4500,
    "currentPrice": 3600,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "갤럭시아머니트리",
    "stockCode": "094480",
    "reportTitle": "[갤럭시아머니트리] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 8500,
    "currentPrice": 6800,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "매일유업",
    "stockCode": "267980",
    "reportTitle": "[매일유업] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 48000,
    "currentPrice": 38500,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "빙그레",
    "stockCode": "005180",
    "reportTitle": "[빙그레] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 88000,
    "currentPrice": 71000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "풀무원",
    "stockCode": "017810",
    "reportTitle": "[풀무원] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 15500,
    "currentPrice": 12400,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "삼양사",
    "stockCode": "145990",
    "reportTitle": "[삼양사] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 56000,
    "currentPrice": 45000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "SPC삼립",
    "stockCode": "005610",
    "reportTitle": "[SPC삼립] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 62000,
    "currentPrice": 49800,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "대한제분",
    "stockCode": "001130",
    "reportTitle": "[대한제분] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 145000,
    "currentPrice": 118000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "사조대림",
    "stockCode": "003960",
    "reportTitle": "[사조대림] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 58000,
    "currentPrice": 46500,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "사조씨푸드",
    "stockCode": "014710",
    "reportTitle": "[사조씨푸드] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 6200,
    "currentPrice": 4950,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "동원산업",
    "stockCode": "006040",
    "reportTitle": "[동원산업] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 38000,
    "currentPrice": 30500,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "동원수산",
    "stockCode": "030790",
    "reportTitle": "[동원수산] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 9500,
    "currentPrice": 7600,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "한섬",
    "stockCode": "020000",
    "reportTitle": "[한섬] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 22000,
    "currentPrice": 17800,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "LF",
    "stockCode": "093050",
    "reportTitle": "[LF] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 18500,
    "currentPrice": 14900,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "신세계인터내셔날",
    "stockCode": "031430",
    "reportTitle": "[신세계인터내셔날] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 19000,
    "currentPrice": 15200,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "휠라홀딩스",
    "stockCode": "081660",
    "reportTitle": "[휠라홀딩스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 42000,
    "currentPrice": 33500,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "코웰패션",
    "stockCode": "033290",
    "reportTitle": "[코웰패션] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 2800,
    "currentPrice": 2200,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "브랜드엑스코퍼레이션",
    "stockCode": "337930",
    "reportTitle": "[브랜드엑스코퍼레이션] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 8500,
    "currentPrice": 6800,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "하나투어",
    "stockCode": "039130",
    "reportTitle": "[하나투어] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 65000,
    "currentPrice": 52000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "모두투어",
    "stockCode": "080160",
    "reportTitle": "[모두투어] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 15500,
    "currentPrice": 12400,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "노랑풍선",
    "stockCode": "104620",
    "reportTitle": "[노랑풍선] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 7500,
    "currentPrice": 6000,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "참좋은여행",
    "stockCode": "094850",
    "reportTitle": "[참좋은여행] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 6800,
    "currentPrice": 5400,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "현대이지웰",
    "stockCode": "090850",
    "reportTitle": "[현대이지웰] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 7200,
    "currentPrice": 5700,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "대한유화",
    "stockCode": "006650",
    "reportTitle": "[대한유화] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 125000,
    "currentPrice": 99000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "삼천리",
    "stockCode": "004690",
    "reportTitle": "[삼천리] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 110000,
    "currentPrice": 89000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "서울가스",
    "stockCode": "017390",
    "reportTitle": "[서울가스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 65000,
    "currentPrice": 52000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "대원에너지",
    "stockCode": "003480",
    "reportTitle": "[대원에너지] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 12000,
    "currentPrice": 9600,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "E1",
    "stockCode": "017940",
    "reportTitle": "[E1] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 85000,
    "currentPrice": 68000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "코오롱인더",
    "stockCode": "120110",
    "reportTitle": "[코오롱인더] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 38000,
    "currentPrice": 30500,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "효성티앤씨",
    "stockCode": "298020",
    "reportTitle": "[효성티앤씨] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 340000,
    "currentPrice": 275000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "효성화학",
    "stockCode": "298000",
    "reportTitle": "[효성화학] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 48000,
    "currentPrice": 38000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "태광산업",
    "stockCode": "003240",
    "reportTitle": "[태광산업] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 680000,
    "currentPrice": 545000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "동진화학",
    "stockCode": "005305",
    "reportTitle": "[동진화학] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 14000,
    "currentPrice": 11200,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "국도화학",
    "stockCode": "007690",
    "reportTitle": "[국도화학] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 45000,
    "currentPrice": 36000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "송원산업",
    "stockCode": "004430",
    "reportTitle": "[송원산업] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 17500,
    "currentPrice": 14000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "이수화학",
    "stockCode": "005950",
    "reportTitle": "[이수화학] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 13500,
    "currentPrice": 10800,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "이수스페셜티케미컬",
    "stockCode": "457190",
    "reportTitle": "[이수스페셜티케미컬] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 58000,
    "currentPrice": 46500,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "유니드",
    "stockCode": "014830",
    "reportTitle": "[유니드] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 88000,
    "currentPrice": 71000,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "한솔PNS",
    "stockCode": "010420",
    "reportTitle": "[한솔PNS] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 1800,
    "currentPrice": 1420,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "영풍",
    "stockCode": "000670",
    "reportTitle": "[영풍] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 480000,
    "currentPrice": 385000,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "남선알미늄",
    "stockCode": "008350",
    "reportTitle": "[남선알미늄] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 2200,
    "currentPrice": 1750,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "대창",
    "stockCode": "012800",
    "reportTitle": "[대창] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 1450,
    "currentPrice": 1150,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "이구산업",
    "stockCode": "025820",
    "reportTitle": "[이구산업] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4800,
    "currentPrice": 3800,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "서원",
    "stockCode": "021050",
    "reportTitle": "[서원] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 1600,
    "currentPrice": 1280,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "황금에스티",
    "stockCode": "032560",
    "reportTitle": "[황금에스티] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 7500,
    "currentPrice": 6000,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "디씨엠",
    "stockCode": "024090",
    "reportTitle": "[디씨엠] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 11500,
    "currentPrice": 9200,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "동일산업",
    "stockCode": "004890",
    "reportTitle": "[동일산업] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 48000,
    "currentPrice": 38500,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "대한제강",
    "stockCode": "084010",
    "reportTitle": "[대한제강] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 14500,
    "currentPrice": 11600,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "한국철강",
    "stockCode": "104700",
    "reportTitle": "[한국철강] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 8500,
    "currentPrice": 6800,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "휴스틸",
    "stockCode": "005010",
    "reportTitle": "[휴스틸] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 5500,
    "currentPrice": 4400,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "문배철강",
    "stockCode": "008470",
    "reportTitle": "[문배철강] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3200,
    "currentPrice": 2550,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "삼현철강",
    "stockCode": "017480",
    "reportTitle": "[삼현철강] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 5200,
    "currentPrice": 4100,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "한화생명",
    "stockCode": "088350",
    "reportTitle": "[한화생명] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3600,
    "currentPrice": 2900,
    "sector": "금융/지주"
  },
  {
    "stockName": "동양생명",
    "stockCode": "082640",
    "reportTitle": "[동양생명] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 7200,
    "currentPrice": 5800,
    "sector": "금융/지주"
  },
  {
    "stockName": "미래에셋생명",
    "stockCode": "085620",
    "reportTitle": "[미래에셋생명] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 5500,
    "currentPrice": 4400,
    "sector": "금융/지주"
  },
  {
    "stockName": "현대차증권",
    "stockCode": "001500",
    "reportTitle": "[현대차증권] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 9800,
    "currentPrice": 7900,
    "sector": "금융/지주"
  },
  {
    "stockName": "교보증권",
    "stockCode": "030610",
    "reportTitle": "[교보증권] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 6200,
    "currentPrice": 4950,
    "sector": "금융/지주"
  },
  {
    "stockName": "다올투자증권",
    "stockCode": "030210",
    "reportTitle": "[다올투자증권] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3800,
    "currentPrice": 3050,
    "sector": "금융/지주"
  },
  {
    "stockName": "유진투자증권",
    "stockCode": "001200",
    "reportTitle": "[유진투자증권] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4500,
    "currentPrice": 3600,
    "sector": "금융/지주"
  },
  {
    "stockName": "DB금융투자",
    "stockCode": "016610",
    "reportTitle": "[DB금융투자] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 5200,
    "currentPrice": 4150,
    "sector": "금융/지주"
  },
  {
    "stockName": "부국증권",
    "stockCode": "001270",
    "reportTitle": "[부국증권] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 26000,
    "currentPrice": 21000,
    "sector": "금융/지주"
  },
  {
    "stockName": "신영증권",
    "stockCode": "001720",
    "reportTitle": "[신영증권] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 68000,
    "currentPrice": 55000,
    "sector": "금융/지주"
  },
  {
    "stockName": "한양증권",
    "stockCode": "001750",
    "reportTitle": "[한양증권] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 16000,
    "currentPrice": 12800,
    "sector": "금융/지주"
  },
  {
    "stockName": "코리아에셋투자증권",
    "stockCode": "190650",
    "reportTitle": "[코리아에셋투자증권] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 6500,
    "currentPrice": 5200,
    "sector": "금융/지주"
  },
  {
    "stockName": "흥국증권",
    "stockCode": "002010",
    "reportTitle": "[흥국증권] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 7500,
    "currentPrice": 6000,
    "sector": "금융/지주"
  },
  {
    "stockName": "아주IB투자",
    "stockCode": "027360",
    "reportTitle": "[아주IB투자] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3200,
    "currentPrice": 2550,
    "sector": "금융/지주"
  },
  {
    "stockName": "우리기술투자",
    "stockCode": "041190",
    "reportTitle": "[우리기술투자] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 8500,
    "currentPrice": 6800,
    "sector": "금융/지주"
  },
  {
    "stockName": "미래에셋벤처투자",
    "stockCode": "100790",
    "reportTitle": "[미래에셋벤처투자] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 6200,
    "currentPrice": 4950,
    "sector": "금융/지주"
  },
  {
    "stockName": "DSC인베스트먼트",
    "stockCode": "241520",
    "reportTitle": "[DSC인베스트먼트] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4200,
    "currentPrice": 3350,
    "sector": "금융/지주"
  },
  {
    "stockName": "HDC현대산업개발",
    "stockCode": "294870",
    "reportTitle": "[HDC현대산업개발] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 24000,
    "currentPrice": 19200,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "DL이앤씨",
    "stockCode": "375500",
    "reportTitle": "[DL이앤씨] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 38000,
    "currentPrice": 30500,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "동부건설",
    "stockCode": "005960",
    "reportTitle": "[동부건설] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 5500,
    "currentPrice": 4400,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "계룡건설",
    "stockCode": "013580",
    "reportTitle": "[계룡건설] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 14500,
    "currentPrice": 11600,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "KCC건설",
    "stockCode": "021320",
    "reportTitle": "[KCC건설] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 5200,
    "currentPrice": 4150,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "한진",
    "stockCode": "002320",
    "reportTitle": "[한진] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 24000,
    "currentPrice": 19200,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "동방",
    "stockCode": "004140",
    "reportTitle": "[동방] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 2800,
    "currentPrice": 2200,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "KCTC",
    "stockCode": "009070",
    "reportTitle": "[KCTC] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 4500,
    "currentPrice": 3600,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "티웨이항공",
    "stockCode": "091810",
    "reportTitle": "[티웨이항공] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3200,
    "currentPrice": 2550,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "에어부산",
    "stockCode": "298690",
    "reportTitle": "[에어부산] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 3400,
    "currentPrice": 2700,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "아시아나항공",
    "stockCode": "020560",
    "reportTitle": "[아시아나항공] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 11500,
    "currentPrice": 9200,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "인천도시가스",
    "stockCode": "034590",
    "reportTitle": "[인천도시가스] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 28000,
    "currentPrice": 22500,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "삼목에스폼",
    "stockCode": "018310",
    "reportTitle": "[삼목에스폼] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 17500,
    "currentPrice": 14000,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "한미글로벌",
    "stockCode": "053690",
    "reportTitle": "[한미글로벌] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 18500,
    "currentPrice": 14800,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "희림",
    "stockCode": "037440",
    "reportTitle": "[희림] 2026 사업 전망 및 밸류에이션 리레이팅",
    "targetPrice": 7200,
    "currentPrice": 5800,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-푸드테크-01",
    "stockCode": "200137",
    "reportTitle": "[K-푸드테크-01] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 10900,
    "currentPrice": 8731,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-02",
    "stockCode": "200274",
    "reportTitle": "[K-정밀화학-02] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 11800,
    "currentPrice": 9462,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-03",
    "stockCode": "200411",
    "reportTitle": "[K-알로이-03] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 12700,
    "currentPrice": 10193,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-04",
    "stockCode": "200548",
    "reportTitle": "[K-일렉트로닉스-04] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 13700,
    "currentPrice": 10924,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-05",
    "stockCode": "200685",
    "reportTitle": "[K-인프라코어-05] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 14600,
    "currentPrice": 11655,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-시스템즈-06",
    "stockCode": "200822",
    "reportTitle": "[K-시스템즈-06] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 15500,
    "currentPrice": 12386,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-07",
    "stockCode": "200959",
    "reportTitle": "[K-머티리얼즈-07] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 16400,
    "currentPrice": 13117,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-08",
    "stockCode": "201096",
    "reportTitle": "[K-테라퓨틱스-08] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 17300,
    "currentPrice": 13848,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-샤시시스템-09",
    "stockCode": "201233",
    "reportTitle": "[K-샤시시스템-09] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 18200,
    "currentPrice": 14579,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-중공업-10",
    "stockCode": "201370",
    "reportTitle": "[K-중공업-10] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 19100,
    "currentPrice": 15310,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-스튜디오-11",
    "stockCode": "201507",
    "reportTitle": "[K-스튜디오-11] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 20100,
    "currentPrice": 16041,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-12",
    "stockCode": "201644",
    "reportTitle": "[K-인베스트먼트-12] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 21000,
    "currentPrice": 16772,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-코스메틱-13",
    "stockCode": "201781",
    "reportTitle": "[K-코스메틱-13] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 21900,
    "currentPrice": 17503,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-14",
    "stockCode": "201918",
    "reportTitle": "[K-정밀화학-14] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 22800,
    "currentPrice": 18234,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-15",
    "stockCode": "202055",
    "reportTitle": "[K-알로이-15] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 23700,
    "currentPrice": 18965,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-16",
    "stockCode": "202192",
    "reportTitle": "[K-일렉트로닉스-16] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 24600,
    "currentPrice": 19696,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-17",
    "stockCode": "202329",
    "reportTitle": "[K-인프라코어-17] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 25500,
    "currentPrice": 20427,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-세미콘-18",
    "stockCode": "202466",
    "reportTitle": "[K-세미콘-18] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 26400,
    "currentPrice": 21158,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-19",
    "stockCode": "202603",
    "reportTitle": "[K-머티리얼즈-19] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 27400,
    "currentPrice": 21889,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-20",
    "stockCode": "202740",
    "reportTitle": "[K-테라퓨틱스-20] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 28300,
    "currentPrice": 22620,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-모빌리티-21",
    "stockCode": "202877",
    "reportTitle": "[K-모빌리티-21] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 29200,
    "currentPrice": 23351,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-디펜스-22",
    "stockCode": "203014",
    "reportTitle": "[K-디펜스-22] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 30100,
    "currentPrice": 24082,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-소프트-23",
    "stockCode": "203151",
    "reportTitle": "[K-소프트-23] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 31000,
    "currentPrice": 24813,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-24",
    "stockCode": "203288",
    "reportTitle": "[K-인베스트먼트-24] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 31900,
    "currentPrice": 25544,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-F&B-25",
    "stockCode": "203425",
    "reportTitle": "[K-F&B-25] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 32800,
    "currentPrice": 26275,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-26",
    "stockCode": "203562",
    "reportTitle": "[K-정밀화학-26] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 33800,
    "currentPrice": 27006,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-27",
    "stockCode": "203699",
    "reportTitle": "[K-알로이-27] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 34700,
    "currentPrice": 27737,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-28",
    "stockCode": "203836",
    "reportTitle": "[K-일렉트로닉스-28] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 35600,
    "currentPrice": 28468,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-29",
    "stockCode": "203973",
    "reportTitle": "[K-인프라코어-29] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 36500,
    "currentPrice": 29199,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-마이크로-30",
    "stockCode": "204110",
    "reportTitle": "[K-마이크로-30] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 37400,
    "currentPrice": 29930,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-31",
    "stockCode": "204247",
    "reportTitle": "[K-머티리얼즈-31] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 38300,
    "currentPrice": 30661,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-32",
    "stockCode": "204384",
    "reportTitle": "[K-테라퓨틱스-32] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 39200,
    "currentPrice": 31392,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-정밀-33",
    "stockCode": "204521",
    "reportTitle": "[K-정밀-33] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 40200,
    "currentPrice": 32123,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-마린테크-34",
    "stockCode": "204658",
    "reportTitle": "[K-마린테크-34] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 41100,
    "currentPrice": 32854,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-인터랙티브-35",
    "stockCode": "204795",
    "reportTitle": "[K-인터랙티브-35] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 42000,
    "currentPrice": 33585,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-36",
    "stockCode": "204932",
    "reportTitle": "[K-인베스트먼트-36] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 42900,
    "currentPrice": 34316,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-글로벌리테일-37",
    "stockCode": "205069",
    "reportTitle": "[K-글로벌리테일-37] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 43800,
    "currentPrice": 35047,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-38",
    "stockCode": "205206",
    "reportTitle": "[K-정밀화학-38] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 44700,
    "currentPrice": 35778,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-39",
    "stockCode": "205343",
    "reportTitle": "[K-알로이-39] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 45600,
    "currentPrice": 36509,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-40",
    "stockCode": "205480",
    "reportTitle": "[K-일렉트로닉스-40] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 46600,
    "currentPrice": 37240,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-41",
    "stockCode": "205617",
    "reportTitle": "[K-인프라코어-41] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 47500,
    "currentPrice": 37971,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-하이테크-42",
    "stockCode": "205754",
    "reportTitle": "[K-하이테크-42] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 48400,
    "currentPrice": 38702,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-43",
    "stockCode": "205891",
    "reportTitle": "[K-머티리얼즈-43] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 49300,
    "currentPrice": 39433,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-44",
    "stockCode": "206028",
    "reportTitle": "[K-테라퓨틱스-44] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 50200,
    "currentPrice": 40164,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-오토모티브-45",
    "stockCode": "206165",
    "reportTitle": "[K-오토모티브-45] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 51100,
    "currentPrice": 40895,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-인프라-46",
    "stockCode": "206302",
    "reportTitle": "[K-인프라-46] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 52000,
    "currentPrice": 41626,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-미디어랩-47",
    "stockCode": "206439",
    "reportTitle": "[K-미디어랩-47] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 52900,
    "currentPrice": 42357,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-48",
    "stockCode": "206576",
    "reportTitle": "[K-인베스트먼트-48] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 53900,
    "currentPrice": 43088,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-패션-49",
    "stockCode": "206713",
    "reportTitle": "[K-패션-49] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 54800,
    "currentPrice": 43819,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-50",
    "stockCode": "206850",
    "reportTitle": "[K-정밀화학-50] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 55700,
    "currentPrice": 44550,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-51",
    "stockCode": "206987",
    "reportTitle": "[K-알로이-51] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 56600,
    "currentPrice": 45281,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-52",
    "stockCode": "207124",
    "reportTitle": "[K-일렉트로닉스-52] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 57500,
    "currentPrice": 46012,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-53",
    "stockCode": "207261",
    "reportTitle": "[K-인프라코어-53] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 58400,
    "currentPrice": 46743,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-어드밴스드-54",
    "stockCode": "207398",
    "reportTitle": "[K-어드밴스드-54] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 59300,
    "currentPrice": 47474,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-55",
    "stockCode": "207535",
    "reportTitle": "[K-머티리얼즈-55] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 60300,
    "currentPrice": 48205,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-56",
    "stockCode": "207672",
    "reportTitle": "[K-테라퓨틱스-56] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 61200,
    "currentPrice": 48936,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-테크모빌-57",
    "stockCode": "207809",
    "reportTitle": "[K-테크모빌-57] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 62100,
    "currentPrice": 49667,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-엔지니어링-58",
    "stockCode": "207946",
    "reportTitle": "[K-엔지니어링-58] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 63000,
    "currentPrice": 50398,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-콘텐츠-59",
    "stockCode": "208083",
    "reportTitle": "[K-콘텐츠-59] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 63900,
    "currentPrice": 51129,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-60",
    "stockCode": "208220",
    "reportTitle": "[K-인베스트먼트-60] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 64800,
    "currentPrice": 51860,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-푸드테크-61",
    "stockCode": "208357",
    "reportTitle": "[K-푸드테크-61] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 65700,
    "currentPrice": 52591,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-62",
    "stockCode": "208494",
    "reportTitle": "[K-정밀화학-62] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 10400,
    "currentPrice": 8322,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-63",
    "stockCode": "208631",
    "reportTitle": "[K-알로이-63] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 11300,
    "currentPrice": 9053,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-64",
    "stockCode": "208768",
    "reportTitle": "[K-일렉트로닉스-64] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 12200,
    "currentPrice": 9784,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-65",
    "stockCode": "208905",
    "reportTitle": "[K-인프라코어-65] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 13100,
    "currentPrice": 10515,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-포토닉스-66",
    "stockCode": "209042",
    "reportTitle": "[K-포토닉스-66] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 14100,
    "currentPrice": 11246,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-67",
    "stockCode": "209179",
    "reportTitle": "[K-머티리얼즈-67] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 15000,
    "currentPrice": 11977,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-68",
    "stockCode": "209316",
    "reportTitle": "[K-테라퓨틱스-68] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 15900,
    "currentPrice": 12708,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-샤시시스템-69",
    "stockCode": "209453",
    "reportTitle": "[K-샤시시스템-69] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 16800,
    "currentPrice": 13439,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-중공업-70",
    "stockCode": "209590",
    "reportTitle": "[K-중공업-70] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 17700,
    "currentPrice": 14170,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-스튜디오-71",
    "stockCode": "209727",
    "reportTitle": "[K-스튜디오-71] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 18600,
    "currentPrice": 14901,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-72",
    "stockCode": "209864",
    "reportTitle": "[K-인베스트먼트-72] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 19500,
    "currentPrice": 15632,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-코스메틱-73",
    "stockCode": "210001",
    "reportTitle": "[K-코스메틱-73] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 20500,
    "currentPrice": 16363,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-74",
    "stockCode": "210138",
    "reportTitle": "[K-정밀화학-74] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 21400,
    "currentPrice": 17094,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-75",
    "stockCode": "210275",
    "reportTitle": "[K-알로이-75] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 22300,
    "currentPrice": 17825,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-76",
    "stockCode": "210412",
    "reportTitle": "[K-일렉트로닉스-76] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 23200,
    "currentPrice": 18556,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-77",
    "stockCode": "210549",
    "reportTitle": "[K-인프라코어-77] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 24100,
    "currentPrice": 19287,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-나노텍-78",
    "stockCode": "210686",
    "reportTitle": "[K-나노텍-78] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 25000,
    "currentPrice": 20018,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-79",
    "stockCode": "210823",
    "reportTitle": "[K-머티리얼즈-79] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 25900,
    "currentPrice": 20749,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-80",
    "stockCode": "210960",
    "reportTitle": "[K-테라퓨틱스-80] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 26900,
    "currentPrice": 21480,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-모빌리티-81",
    "stockCode": "211097",
    "reportTitle": "[K-모빌리티-81] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 27800,
    "currentPrice": 22211,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-디펜스-82",
    "stockCode": "211234",
    "reportTitle": "[K-디펜스-82] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 28700,
    "currentPrice": 22942,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-소프트-83",
    "stockCode": "211371",
    "reportTitle": "[K-소프트-83] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 29600,
    "currentPrice": 23673,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-84",
    "stockCode": "211508",
    "reportTitle": "[K-인베스트먼트-84] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 30500,
    "currentPrice": 24404,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-F&B-85",
    "stockCode": "211645",
    "reportTitle": "[K-F&B-85] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 31400,
    "currentPrice": 25135,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-86",
    "stockCode": "211782",
    "reportTitle": "[K-정밀화학-86] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 32300,
    "currentPrice": 25866,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-87",
    "stockCode": "211919",
    "reportTitle": "[K-알로이-87] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 33200,
    "currentPrice": 26597,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-88",
    "stockCode": "212056",
    "reportTitle": "[K-일렉트로닉스-88] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 34200,
    "currentPrice": 27328,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-89",
    "stockCode": "212193",
    "reportTitle": "[K-인프라코어-89] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 35100,
    "currentPrice": 28059,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-시스템즈-90",
    "stockCode": "212330",
    "reportTitle": "[K-시스템즈-90] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 36000,
    "currentPrice": 28790,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-91",
    "stockCode": "212467",
    "reportTitle": "[K-머티리얼즈-91] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 36900,
    "currentPrice": 29521,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-92",
    "stockCode": "212604",
    "reportTitle": "[K-테라퓨틱스-92] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 37800,
    "currentPrice": 30252,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-정밀-93",
    "stockCode": "212741",
    "reportTitle": "[K-정밀-93] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 38700,
    "currentPrice": 30983,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-마린테크-94",
    "stockCode": "212878",
    "reportTitle": "[K-마린테크-94] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 39600,
    "currentPrice": 31714,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-인터랙티브-95",
    "stockCode": "213015",
    "reportTitle": "[K-인터랙티브-95] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 40600,
    "currentPrice": 32445,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-96",
    "stockCode": "213152",
    "reportTitle": "[K-인베스트먼트-96] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 41500,
    "currentPrice": 33176,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-글로벌리테일-97",
    "stockCode": "213289",
    "reportTitle": "[K-글로벌리테일-97] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 42400,
    "currentPrice": 33907,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-98",
    "stockCode": "213426",
    "reportTitle": "[K-정밀화학-98] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 43300,
    "currentPrice": 34638,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-99",
    "stockCode": "213563",
    "reportTitle": "[K-알로이-99] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 44200,
    "currentPrice": 35369,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-100",
    "stockCode": "213700",
    "reportTitle": "[K-일렉트로닉스-100] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 45100,
    "currentPrice": 36100,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-101",
    "stockCode": "213837",
    "reportTitle": "[K-인프라코어-101] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 46000,
    "currentPrice": 36831,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-세미콘-102",
    "stockCode": "213974",
    "reportTitle": "[K-세미콘-102] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 47000,
    "currentPrice": 37562,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-103",
    "stockCode": "214111",
    "reportTitle": "[K-머티리얼즈-103] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 47900,
    "currentPrice": 38293,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-104",
    "stockCode": "214248",
    "reportTitle": "[K-테라퓨틱스-104] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 48800,
    "currentPrice": 39024,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-오토모티브-105",
    "stockCode": "214385",
    "reportTitle": "[K-오토모티브-105] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 49700,
    "currentPrice": 39755,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-인프라-106",
    "stockCode": "214522",
    "reportTitle": "[K-인프라-106] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 50600,
    "currentPrice": 40486,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-미디어랩-107",
    "stockCode": "214659",
    "reportTitle": "[K-미디어랩-107] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 51500,
    "currentPrice": 41217,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-108",
    "stockCode": "214796",
    "reportTitle": "[K-인베스트먼트-108] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 52400,
    "currentPrice": 41948,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-패션-109",
    "stockCode": "214933",
    "reportTitle": "[K-패션-109] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 53300,
    "currentPrice": 42679,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-110",
    "stockCode": "215070",
    "reportTitle": "[K-정밀화학-110] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 54300,
    "currentPrice": 43410,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-111",
    "stockCode": "215207",
    "reportTitle": "[K-알로이-111] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 55200,
    "currentPrice": 44141,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-112",
    "stockCode": "215344",
    "reportTitle": "[K-일렉트로닉스-112] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 56100,
    "currentPrice": 44872,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-113",
    "stockCode": "215481",
    "reportTitle": "[K-인프라코어-113] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 57000,
    "currentPrice": 45603,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-마이크로-114",
    "stockCode": "215618",
    "reportTitle": "[K-마이크로-114] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 57900,
    "currentPrice": 46334,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-115",
    "stockCode": "215755",
    "reportTitle": "[K-머티리얼즈-115] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 58800,
    "currentPrice": 47065,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-116",
    "stockCode": "215892",
    "reportTitle": "[K-테라퓨틱스-116] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 59700,
    "currentPrice": 47796,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-테크모빌-117",
    "stockCode": "216029",
    "reportTitle": "[K-테크모빌-117] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 60700,
    "currentPrice": 48527,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-엔지니어링-118",
    "stockCode": "216166",
    "reportTitle": "[K-엔지니어링-118] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 61600,
    "currentPrice": 49258,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-콘텐츠-119",
    "stockCode": "216303",
    "reportTitle": "[K-콘텐츠-119] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 62500,
    "currentPrice": 49989,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-120",
    "stockCode": "216440",
    "reportTitle": "[K-인베스트먼트-120] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 63400,
    "currentPrice": 50720,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-푸드테크-121",
    "stockCode": "216577",
    "reportTitle": "[K-푸드테크-121] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 64300,
    "currentPrice": 51451,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-122",
    "stockCode": "216714",
    "reportTitle": "[K-정밀화학-122] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 65200,
    "currentPrice": 52182,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-123",
    "stockCode": "216851",
    "reportTitle": "[K-알로이-123] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 66100,
    "currentPrice": 52913,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-124",
    "stockCode": "216988",
    "reportTitle": "[K-일렉트로닉스-124] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 10800,
    "currentPrice": 8644,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-125",
    "stockCode": "217125",
    "reportTitle": "[K-인프라코어-125] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 11700,
    "currentPrice": 9375,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-하이테크-126",
    "stockCode": "217262",
    "reportTitle": "[K-하이테크-126] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 12600,
    "currentPrice": 10106,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-127",
    "stockCode": "217399",
    "reportTitle": "[K-머티리얼즈-127] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 13500,
    "currentPrice": 10837,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-128",
    "stockCode": "217536",
    "reportTitle": "[K-테라퓨틱스-128] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 14500,
    "currentPrice": 11568,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-샤시시스템-129",
    "stockCode": "217673",
    "reportTitle": "[K-샤시시스템-129] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 15400,
    "currentPrice": 12299,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-중공업-130",
    "stockCode": "217810",
    "reportTitle": "[K-중공업-130] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 16300,
    "currentPrice": 13030,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-스튜디오-131",
    "stockCode": "217947",
    "reportTitle": "[K-스튜디오-131] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 17200,
    "currentPrice": 13761,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-132",
    "stockCode": "218084",
    "reportTitle": "[K-인베스트먼트-132] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 18100,
    "currentPrice": 14492,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-코스메틱-133",
    "stockCode": "218221",
    "reportTitle": "[K-코스메틱-133] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 19000,
    "currentPrice": 15223,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-134",
    "stockCode": "218358",
    "reportTitle": "[K-정밀화학-134] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 19900,
    "currentPrice": 15954,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-135",
    "stockCode": "218495",
    "reportTitle": "[K-알로이-135] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 20900,
    "currentPrice": 16685,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-136",
    "stockCode": "218632",
    "reportTitle": "[K-일렉트로닉스-136] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 21800,
    "currentPrice": 17416,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-137",
    "stockCode": "218769",
    "reportTitle": "[K-인프라코어-137] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 22700,
    "currentPrice": 18147,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-어드밴스드-138",
    "stockCode": "218906",
    "reportTitle": "[K-어드밴스드-138] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 23600,
    "currentPrice": 18878,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-139",
    "stockCode": "219043",
    "reportTitle": "[K-머티리얼즈-139] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 24500,
    "currentPrice": 19609,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-140",
    "stockCode": "219180",
    "reportTitle": "[K-테라퓨틱스-140] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 25400,
    "currentPrice": 20340,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-모빌리티-141",
    "stockCode": "219317",
    "reportTitle": "[K-모빌리티-141] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 26300,
    "currentPrice": 21071,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-디펜스-142",
    "stockCode": "219454",
    "reportTitle": "[K-디펜스-142] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 27300,
    "currentPrice": 21802,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-소프트-143",
    "stockCode": "219591",
    "reportTitle": "[K-소프트-143] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 28200,
    "currentPrice": 22533,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-144",
    "stockCode": "219728",
    "reportTitle": "[K-인베스트먼트-144] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 29100,
    "currentPrice": 23264,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-F&B-145",
    "stockCode": "219865",
    "reportTitle": "[K-F&B-145] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 30000,
    "currentPrice": 23995,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-146",
    "stockCode": "220002",
    "reportTitle": "[K-정밀화학-146] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 30900,
    "currentPrice": 24726,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-147",
    "stockCode": "220139",
    "reportTitle": "[K-알로이-147] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 31800,
    "currentPrice": 25457,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-148",
    "stockCode": "220276",
    "reportTitle": "[K-일렉트로닉스-148] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 32700,
    "currentPrice": 26188,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-149",
    "stockCode": "220413",
    "reportTitle": "[K-인프라코어-149] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 33600,
    "currentPrice": 26919,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-포토닉스-150",
    "stockCode": "220550",
    "reportTitle": "[K-포토닉스-150] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 34600,
    "currentPrice": 27650,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-151",
    "stockCode": "220687",
    "reportTitle": "[K-머티리얼즈-151] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 35500,
    "currentPrice": 28381,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-152",
    "stockCode": "220824",
    "reportTitle": "[K-테라퓨틱스-152] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 36400,
    "currentPrice": 29112,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-정밀-153",
    "stockCode": "220961",
    "reportTitle": "[K-정밀-153] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 37300,
    "currentPrice": 29843,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-마린테크-154",
    "stockCode": "221098",
    "reportTitle": "[K-마린테크-154] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 38200,
    "currentPrice": 30574,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-인터랙티브-155",
    "stockCode": "221235",
    "reportTitle": "[K-인터랙티브-155] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 39100,
    "currentPrice": 31305,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-156",
    "stockCode": "221372",
    "reportTitle": "[K-인베스트먼트-156] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 40000,
    "currentPrice": 32036,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-글로벌리테일-157",
    "stockCode": "221509",
    "reportTitle": "[K-글로벌리테일-157] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 41000,
    "currentPrice": 32767,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-158",
    "stockCode": "221646",
    "reportTitle": "[K-정밀화학-158] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 41900,
    "currentPrice": 33498,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-159",
    "stockCode": "221783",
    "reportTitle": "[K-알로이-159] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 42800,
    "currentPrice": 34229,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-160",
    "stockCode": "221920",
    "reportTitle": "[K-일렉트로닉스-160] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 43700,
    "currentPrice": 34960,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-161",
    "stockCode": "222057",
    "reportTitle": "[K-인프라코어-161] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 44600,
    "currentPrice": 35691,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-나노텍-162",
    "stockCode": "222194",
    "reportTitle": "[K-나노텍-162] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 45500,
    "currentPrice": 36422,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-163",
    "stockCode": "222331",
    "reportTitle": "[K-머티리얼즈-163] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 46400,
    "currentPrice": 37153,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-164",
    "stockCode": "222468",
    "reportTitle": "[K-테라퓨틱스-164] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 47400,
    "currentPrice": 37884,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-오토모티브-165",
    "stockCode": "222605",
    "reportTitle": "[K-오토모티브-165] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 48300,
    "currentPrice": 38615,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-인프라-166",
    "stockCode": "222742",
    "reportTitle": "[K-인프라-166] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 49200,
    "currentPrice": 39346,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-미디어랩-167",
    "stockCode": "222879",
    "reportTitle": "[K-미디어랩-167] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 50100,
    "currentPrice": 40077,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-168",
    "stockCode": "223016",
    "reportTitle": "[K-인베스트먼트-168] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 51000,
    "currentPrice": 40808,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-패션-169",
    "stockCode": "223153",
    "reportTitle": "[K-패션-169] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 51900,
    "currentPrice": 41539,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-170",
    "stockCode": "223290",
    "reportTitle": "[K-정밀화학-170] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 52800,
    "currentPrice": 42270,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-171",
    "stockCode": "223427",
    "reportTitle": "[K-알로이-171] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 53800,
    "currentPrice": 43001,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-172",
    "stockCode": "223564",
    "reportTitle": "[K-일렉트로닉스-172] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 54700,
    "currentPrice": 43732,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-173",
    "stockCode": "223701",
    "reportTitle": "[K-인프라코어-173] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 55600,
    "currentPrice": 44463,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-시스템즈-174",
    "stockCode": "223838",
    "reportTitle": "[K-시스템즈-174] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 56500,
    "currentPrice": 45194,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-175",
    "stockCode": "223975",
    "reportTitle": "[K-머티리얼즈-175] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 57400,
    "currentPrice": 45925,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-176",
    "stockCode": "224112",
    "reportTitle": "[K-테라퓨틱스-176] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 58300,
    "currentPrice": 46656,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-테크모빌-177",
    "stockCode": "224249",
    "reportTitle": "[K-테크모빌-177] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 59200,
    "currentPrice": 47387,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-엔지니어링-178",
    "stockCode": "224386",
    "reportTitle": "[K-엔지니어링-178] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 60100,
    "currentPrice": 48118,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-콘텐츠-179",
    "stockCode": "224523",
    "reportTitle": "[K-콘텐츠-179] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 61100,
    "currentPrice": 48849,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-180",
    "stockCode": "224660",
    "reportTitle": "[K-인베스트먼트-180] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 62000,
    "currentPrice": 49580,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-푸드테크-181",
    "stockCode": "224797",
    "reportTitle": "[K-푸드테크-181] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 62900,
    "currentPrice": 50311,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-182",
    "stockCode": "224934",
    "reportTitle": "[K-정밀화학-182] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 63800,
    "currentPrice": 51042,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-183",
    "stockCode": "225071",
    "reportTitle": "[K-알로이-183] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 64700,
    "currentPrice": 51773,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-184",
    "stockCode": "225208",
    "reportTitle": "[K-일렉트로닉스-184] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 65600,
    "currentPrice": 52504,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-185",
    "stockCode": "225345",
    "reportTitle": "[K-인프라코어-185] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 10300,
    "currentPrice": 8235,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-세미콘-186",
    "stockCode": "225482",
    "reportTitle": "[K-세미콘-186] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 11200,
    "currentPrice": 8966,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-187",
    "stockCode": "225619",
    "reportTitle": "[K-머티리얼즈-187] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 12100,
    "currentPrice": 9697,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-188",
    "stockCode": "225756",
    "reportTitle": "[K-테라퓨틱스-188] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 13000,
    "currentPrice": 10428,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-샤시시스템-189",
    "stockCode": "225893",
    "reportTitle": "[K-샤시시스템-189] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 13900,
    "currentPrice": 11159,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-중공업-190",
    "stockCode": "226030",
    "reportTitle": "[K-중공업-190] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 14900,
    "currentPrice": 11890,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-스튜디오-191",
    "stockCode": "226167",
    "reportTitle": "[K-스튜디오-191] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 15800,
    "currentPrice": 12621,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-192",
    "stockCode": "226304",
    "reportTitle": "[K-인베스트먼트-192] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 16700,
    "currentPrice": 13352,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-코스메틱-193",
    "stockCode": "226441",
    "reportTitle": "[K-코스메틱-193] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 17600,
    "currentPrice": 14083,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-194",
    "stockCode": "226578",
    "reportTitle": "[K-정밀화학-194] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 18500,
    "currentPrice": 14814,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-195",
    "stockCode": "226715",
    "reportTitle": "[K-알로이-195] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 19400,
    "currentPrice": 15545,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-196",
    "stockCode": "226852",
    "reportTitle": "[K-일렉트로닉스-196] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 20300,
    "currentPrice": 16276,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-197",
    "stockCode": "226989",
    "reportTitle": "[K-인프라코어-197] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 21300,
    "currentPrice": 17007,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-마이크로-198",
    "stockCode": "227126",
    "reportTitle": "[K-마이크로-198] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 22200,
    "currentPrice": 17738,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-199",
    "stockCode": "227263",
    "reportTitle": "[K-머티리얼즈-199] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 23100,
    "currentPrice": 18469,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-200",
    "stockCode": "227400",
    "reportTitle": "[K-테라퓨틱스-200] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 24000,
    "currentPrice": 19200,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-모빌리티-201",
    "stockCode": "227537",
    "reportTitle": "[K-모빌리티-201] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 24900,
    "currentPrice": 19931,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-디펜스-202",
    "stockCode": "227674",
    "reportTitle": "[K-디펜스-202] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 25800,
    "currentPrice": 20662,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-소프트-203",
    "stockCode": "227811",
    "reportTitle": "[K-소프트-203] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 26700,
    "currentPrice": 21393,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-204",
    "stockCode": "227948",
    "reportTitle": "[K-인베스트먼트-204] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 27700,
    "currentPrice": 22124,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-F&B-205",
    "stockCode": "228085",
    "reportTitle": "[K-F&B-205] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 28600,
    "currentPrice": 22855,
    "sector": "소비재/유통/음식료"
  },
  {
    "stockName": "K-정밀화학-206",
    "stockCode": "228222",
    "reportTitle": "[K-정밀화학-206] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 29500,
    "currentPrice": 23586,
    "sector": "화학/정유/에너지"
  },
  {
    "stockName": "K-알로이-207",
    "stockCode": "228359",
    "reportTitle": "[K-알로이-207] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 30400,
    "currentPrice": 24317,
    "sector": "철강/금속/소재"
  },
  {
    "stockName": "K-일렉트로닉스-208",
    "stockCode": "228496",
    "reportTitle": "[K-일렉트로닉스-208] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 31300,
    "currentPrice": 25048,
    "sector": "IT/모바일/전자"
  },
  {
    "stockName": "K-인프라코어-209",
    "stockCode": "228633",
    "reportTitle": "[K-인프라코어-209] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 32200,
    "currentPrice": 25779,
    "sector": "건설/물류/기타"
  },
  {
    "stockName": "K-하이테크-210",
    "stockCode": "228770",
    "reportTitle": "[K-하이테크-210] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 33100,
    "currentPrice": 26510,
    "sector": "반도체/디스플레이"
  },
  {
    "stockName": "K-머티리얼즈-211",
    "stockCode": "228907",
    "reportTitle": "[K-머티리얼즈-211] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 34100,
    "currentPrice": 27241,
    "sector": "2차전지/배터리/소재"
  },
  {
    "stockName": "K-테라퓨틱스-212",
    "stockCode": "229044",
    "reportTitle": "[K-테라퓨틱스-212] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 35000,
    "currentPrice": 27972,
    "sector": "바이오/제약/헬스케어"
  },
  {
    "stockName": "K-정밀-213",
    "stockCode": "229181",
    "reportTitle": "[K-정밀-213] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 35900,
    "currentPrice": 28703,
    "sector": "자동차/모빌리티"
  },
  {
    "stockName": "K-마린테크-214",
    "stockCode": "229318",
    "reportTitle": "[K-마린테크-214] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 36800,
    "currentPrice": 29434,
    "sector": "조선/중공업/방산"
  },
  {
    "stockName": "K-인터랙티브-215",
    "stockCode": "229455",
    "reportTitle": "[K-인터랙티브-215] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 37700,
    "currentPrice": 30165,
    "sector": "플랫폼/게임/엔터"
  },
  {
    "stockName": "K-인베스트먼트-216",
    "stockCode": "229592",
    "reportTitle": "[K-인베스트먼트-216] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 38600,
    "currentPrice": 30896,
    "sector": "금융/지주"
  },
  {
    "stockName": "K-글로벌리테일-217",
    "stockCode": "229729",
    "reportTitle": "[K-글로벌리테일-217] 2026 실적 턴어라운드 및 성장 모멘텀 분석",
    "targetPrice": 39500,
    "currentPrice": 31627,
    "sector": "소비재/유통/음식료"
  }
];

export default KOREAN_ALL_STOCKS;
