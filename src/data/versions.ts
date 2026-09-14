import type { VersionInfo } from '../types.ts';

export const APP_VERSIONS: VersionInfo[] = [
  {
    version: 'VERSION 1.5',
    releaseDate: '2026-08-25',
    title: '차세대 인텔리전스 & AI 리포트 분석 고도화 (VERSION 1.5 신규 개발 라인)',
    summary: 'VERSION 1.4 최종 완료본(스냅샷 백업 완료)을 기반으로 추가 기능 확장 및 지능형 고도화를 진행하는 신규 활성 버전',
    isCurrent: true,
    highlights: [
      'VERSION 1.4 최종 안정화 버전(명예의 전당 TOP 20, 32개 증권사 실시간 수집, DART 전자공시 연계 팩트체크) 100% 무손실 백업 보존 (backups/v1.4-final-backup.tar.gz)',
      '언제든지 1클릭 복구 가능한 v1.4 복원 엔진(npm run restore:v1.4) 및 복구 스크립트(scripts/restore-v1.4.cjs) 구축',
      '신규 VERSION 1.5 전용 기능 확장 및 분석 파이프라인 성능 최적화 진행',
      'AI 앙상블 리서치 평가 모델 심화 및 사용자 맞춤형 인텔리전스 확장'
    ]
  },
  {
    version: 'VERSION 1.4 (최종 완료본)',
    releaseDate: '2026-08-25',
    title: '올해의 명예의 전당 TOP 20 & DART 공시 팩트체크 통합 (v1.4 최종)',
    summary: '명예의 전당 TOP 20 확장, DART 전자공시 실시간 연계 & 팩트체크, 32개 증권사 리포트 실시간 수집 뷰어가 완성된 최종 안정화 버전 (영구 백업 보존)',
    isCurrent: false,
    highlights: [
      '🏆 올해의 애널리스트 명예의 전당 TOP 20 전원 선발 및 AI 심사평/상장 수여증 완성',
      '🏛️ 금융감독원 Open DART API 서버사이드 프록시 & 전후 30일 공시 타임라인 매칭',
      '🔍 AI 팩트체크 & 어닝 서프라이즈 교차 검증 (리포트 실적 추정치 ↔ DART 공시)',
      '📊 32개 국내 증권사 리서치 실시간 수집, PDF 원문 뷰어, HTML 본문 인라인 리더',
      '💾 전체 프로젝트 v1.4 최종 스냅샷 백업 완료 (backups/v1.4-final/ 및 v1.4-final-backup.tar.gz)'
    ]
  },
  {
    version: 'VERSION 1.3',
    releaseDate: '2026-08-19',
    title: '금융감독원 DART 전자공시 연계 & 리포트 실시간 팩트체크 엔진',
    summary: 'Open DART API 연동 및 리포트 발간일 기준 전후 공시 타임라인 매칭, 어닝 서프라이즈 교차 검증, DART 원문 바로가기 뷰어 제공',
    isCurrent: false,
    highlights: [
      '금융감독원 Open DART API 서버사이드 프록시 연계 및 OPENDART_API_KEY 설정 체계',
      '리포트 상세 모달 내 [🏛️ DART 전자공시 연계 & 팩트체크] 전용 탭 신설',
      '리포트 발간일 기준 전후 30일 공시(잠정실적, 대규모 수주, 정기보고서, 지분변동 등) 타임라인 매칭',
      'AI 팩트체크 & 어닝 서프라이즈 교차 검증 (리포트 실적 추정치 ↔ DART 공시 100% 교차 검증)',
      'DART 접수번호(rcept_no) 기반 금감원 전자공시 원문 즉시 열람 링크 제공',
      '애널리스트리포트_조회_01 그리드/테이블/모달 전 영역 DART 공시 연동 일괄 적용',
      'Open DART API 키 미등록 시에도 지능형 스마트 타임라인 매칭 모드로 무중단 작동 지원'
    ]
  },
  {
    version: 'VERSION 1.2',
    releaseDate: '2026-08-18',
    title: '올해의 애널리스트_01 & 명예의 전당 AI 재평가 시상 시스템',
    summary: '평가 기간 지정(상·하반기/분기별/연간), DB 영구 저장 캐시 & AI 재평가, 명예의 전당 TOP 20, 섹터별 TOP 5, AI·반도체 융합상 및 5대 스페셜 테마(적중률·고수익·다작·신인·소신파) 선발 엔진 완성',
    isCurrent: false,
    highlights: [
      '신규 메뉴 [올해의 애널리스트_01] 고도화 및 평가 기간(2026 상반기, 하반기, 1Q~4Q, 연간 종합) 지정 필터',
      'AI 재평가 엔진 & DB 영구 저장 캐싱 (downloads/database/hall_of_fame_db.json): 저장된 결과 즉시 로드 및 필요 시 AI 강제 재평가(Force Re-eval)',
      '🏆 올해의 명예의 전당 TOP 20 (종합 대상, 최우수상, 우수상 등 헌액자 1~20위)',
      '🎯 주요 섹터별 명예의 전당 TOP 5 (반도체, 2차전지, 바이오, 모빌리티 등 9대 섹터별 1~5위)',
      '🚀 특정 섹터 / 융합(Convergence) 특별상: AI&차세대반도체, 모빌리티&2차전지, 디지털헬스&바이오, AI데이터센터&전력망 융합 혁신상',
      '🏅 스페셜 테마 5대 어워즈: 적중률 제왕(목표가 적중률 1위), 고수익 챔피언(알파 수익률 1위), 다작왕(최다 발간 1위), 슈퍼 루키(신인상), 소신파/역발상 대상(모두가 살 때 매도/중립, 모두가 팔 때 매수 외친 소신파)',
      '📜 수상 인증서/상장 수여증 모달 보기 및 인쇄(PDF) 지원',
      '4대 테이블(분석, 조회, 프로필, 파이프라인) 데이터 리니지 인스펙터 및 평가 결과 CSV 내보내기'
    ]
  },
  {
    version: 'VERSION 1.1',
    releaseDate: '2026-08-10',
    title: '네이버 증권 리포트 수집 엔진 & 이코노미스트 평가 AI 완성 (VERSION 1.1)',
    summary: '32개 증권사 대상 실시간 리포트 수집, PDF 원문 고속 아카이빙, 이코노미스트 독자 평가 AI 및 순수 실데이터 체계 전면 가동',
    isCurrent: false,
    highlights: [
      '32개 주요 증권사 대상 네이버 금융 리포트 실시간 수집 및 일괄 파이프라인 완성',
      'PDF 원문 자동 다운로드, 바이너리 유효성 검증 및 연도/월별 디렉터리 아카이빙',
      '이코노미스트 독자 평가 모델 기반 LLM 객관성·신뢰도·논리성 종합 채점 시스템',
      '부문별 베스트 애널리스트 랭킹 및 애널리스트 상세 프로필·적중률 분석',
      'KOSPI/KOSDAQ 2,600+ 종목 매핑 (종목코드, 한글명, 표준 섹터 자동 매핑)',
      'Vector DB 리포트 텍스트 임베딩 및 유사 리포트/지식 검색 시스템',
      '리포트 익스플로러 & 상세 모달 (원문 링크 연결, 목표가 괴리율, 투자의견 추적)',
      '월별 데이터 통계 및 7단계 PDF 원문 수집 상태(확보/미확보/제한 등) 시각화',
      '섹터 및 관심 애널리스트 맞춤형 실시간 알림 센터',
      '샘플(Mock) 데이터 완전 배제 및 순수 네이버 실데이터 파이프라인 기반 운영 체계'
    ]
  },
  {
    version: 'v0.9',
    releaseDate: '2026-08-09',
    title: '네이버 증권 리포트 수집 엔진 & 이코노미스트 평가 AI 베타 완성',
    summary: '32개 증권사 대상 실시간 리포트 수집 및 PDF 원문 아카이빙 체계 구축',
    isCurrent: false,
    highlights: [
      '32개 주요 증권사 대상 네이버 금융 리포트 실시간 수집 파이프라인 구축',
      'PDF 원문 자동 다운로드 및 바이너리 유효성 검증 체계',
      '이코노미스트 평가 기준 LLM 객관성 평가 시스템 기초 모델'
    ]
  },
  {
    version: 'v0.8',
    releaseDate: '2026-08-08',
    title: 'PDF 원문 수집 관리자 및 데이터 현황 대시보드',
    summary: 'PDF 다운로드 파이프라인 고도화, 7단계 수집 상태 분류 및 월별/증권사별 통계 대시보드 구현',
    isCurrent: false,
    highlights: [
      'PDFCollectionManager 및 MonthlyDataStats 컴포넌트 구축',
      '증권사별 PDF 원문 확보율 및 미확보 사유(부재/접근제한/오류 등) 통계화',
      '다운로드 중단 및 재시도, 일괄 수집 제어 인터페이스'
    ]
  },
  {
    version: 'v0.7',
    releaseDate: '2026-08-07',
    title: '이코노미스트 평가 기준 가중치 모델 및 랭킹 엔진',
    summary: '한국경제/이코노미스트 베스트 애널리스트 평가 프레임워크를 적용한 정량/정성 평가 엔진',
    isCurrent: false,
    highlights: [
      '추천종목 수익률, 리포트 논리성, 데이터 신뢰도, 투자의견 객관성 다면 평가',
      'AwardsDashboard 및 AwardsEvaluationGuide 구현',
      '섹터별 가중치 차등 적용 및 애널리스트 종합 점수 산출'
    ]
  },
  {
    version: 'v0.5',
    releaseDate: '2026-08-05',
    title: '증권사 리포트 수집 파이프라인 및 LLM 객관성 검증',
    summary: '기본 크롤러 엔진 및 Gemini LLM을 활용한 리포트 객관성 분석 파이프라인',
    isCurrent: false,
    highlights: [
      'PipelineMonitor 및 실시간 처리 로그 스트림',
      'LLM 기반 리포트 핵심 요약 및 바이어스(과대낙관/근거부족) 검증',
      'ReportExplorer 필터링 및 정렬 기능'
    ]
  },
  {
    version: 'v0.1',
    releaseDate: '2026-08-01',
    title: '증권사 리포트 모니터링 시스템 초기 프로토타입',
    summary: '기본 UI 레이아웃 구성 및 대시보드 와이어프레임 설계',
    isCurrent: false,
    highlights: [
      '초기 UI 테마 및 반응형 레이아웃 설계',
      '종목 및 증권사 데이터 모델 정의'
    ]
  }
];

export const CURRENT_VERSION = APP_VERSIONS[0];
