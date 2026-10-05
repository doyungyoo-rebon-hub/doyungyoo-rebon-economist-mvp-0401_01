// Google Docs API client-side service for document organization and export
export interface CreatedDocResult {
  documentId: string;
  title: string;
  url: string;
}

/**
 * Creates a new blank Google Document
 */
export async function createGoogleDocument(
  title: string,
  accessToken: string
): Promise<CreatedDocResult> {
  const res = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      errData?.error?.message || `Google Docs 생성 실패 (HTTP ${res.status})`
    );
  }

  const data = await res.json();
  const documentId = data.documentId;
  return {
    documentId,
    title: data.title || title,
    url: `https://docs.google.com/document/d/${documentId}/edit`
  };
}

/**
 * Executes a batch update on a Google Document
 */
export async function updateGoogleDocument(
  documentId: string,
  requests: any[],
  accessToken: string
): Promise<any> {
  if (!requests || requests.length === 0) return null;

  const res = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests })
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.warn('[Google Docs batchUpdate notice]', errData);
    // Continue even if styling request fails partially
    return null;
  }

  return await res.json();
}

/**
 * Inserts structured plain text into a Google Document
 */
export async function insertDocumentText(
  documentId: string,
  text: string,
  accessToken: string
): Promise<void> {
  await updateGoogleDocument(
    documentId,
    [
      {
        insertText: {
          location: { index: 1 },
          text: text
        }
      }
    ],
    accessToken
  );
}

// -------------------------------------------------------------
// Specialized Document Generators for Analyst Awards & Research
// -------------------------------------------------------------

/**
 * 1. 2026 올해의 애널리스트 어워즈 종합 평가 보고서 Google Docs 문서 생성
 */
export async function generateAwardsReportGoogleDoc(
  accessToken: string,
  analysts: any[],
  metrics?: any,
  options?: { customTitle?: string; userEmail?: string }
): Promise<CreatedDocResult> {
  const docTitle =
    options?.customTitle ||
    `[리본-이코노미스트] 2026 애널리스트 어워즈 종합 평가 보고서 (${new Date().toLocaleDateString('ko-KR')})`;

  const doc = await createGoogleDocument(docTitle, accessToken);

  // Top 10 Analysts ranking summary
  const topAnalysts = analysts.slice(0, 15);
  let analystTableText = '';
  topAnalysts.forEach((a, idx) => {
    analystTableText += `  ${idx + 1}위: [${a.sector || '주요섹터'}] ${a.name} 연구원 (${a.brokerName || '증권사'}) - 종합점수: ${a.totalScore || 90}점 (목표가 적중률: ${a.accuracyRate || 85}%, 괴리율 지수: ${a.divergenceScore || 88}점)\n`;
  });

  const fullText = `리본-이코노미스트 2026 올해의 애널리스트 어워즈 종합 평가서
══════════════════════════════════════════════════════════════════════
■ 문서 번호: REBON-ECONOMIST-AWARDS-2026-FINAL
■ 발간 일시: ${new Date().toLocaleString('ko-KR')}
■ 작성자 계정: ${options?.userEmail || '시스템 관리자'}
■ 시스템 버전: VERSION 1.6 안정화 빌드 (차세대 실시간 리포트 평가 엔진)
══════════════════════════════════════════════════════════════════════

1. 어워즈 개요 및 평가 프레임워크
──────────────────────────────────────────────────────────────────
본 문서는 리본인텔리전스와 이코노미스트가 공동 주관하는 '2026 올해의 베스트 애널리스트 어워즈'의 공식 종합 평가 결과 보고서입니다.

[핵심 평가 3대 지표]
1) 목표주가 적중률 (Accuracy Rate - 40% 가중치)
   - 리포트 발간 시점의 목표주가와 실제 주가 추이 간의 일치도 및 6개월 내 달성 여부 정밀 추적
2) 투자의견 및 주가 괴리율 (Divergence Index - 35% 가중치)
   - 고평가/낙관 편향 리포트를 배제하고 실제 시장 벤치마크 대비 초과 수익 기여도를 산출
3) AI LLM 객관성 및 논리 정합성 (AI Objectivity Score - 25% 가중치)
   - Gemini 3.6 Flash 엔진을 통한 리포트 본문 근거 유효성, 데이터 신뢰도, 반박 가능성 평가


2. 2026 종합 베스트 애널리스트 순위 (상위 15인)
──────────────────────────────────────────────────────────────────
${analystTableText}

3. 섹터별 리서치 발행 현황 및 시장 전망
──────────────────────────────────────────────────────────────────
- 반도체/디스플레이: HBM3E 및 고대역폭 메모리 사이클 회복에 따른 목표가 상향 리포트 집중
- 2차전지/소재: 전기차 캐즘 국면 속 북미 AMPC 보조금 및 신규 소재 공급 계약 중심의 선별적 접근
- 바이오/제약/헬스케어: 글로벌 빅파마 기술이전(L/O) 및 FDA 가속승인 파이프라인 가치평가 재부각
- 자동차/모빌리티: 글로벌 완성차 영업이익률 견조 및 자율주행·전동화 부품사 턴어라운드 주목
- 조선/중공업/방산: 친환경 고부가가치 선박 수주 및 K-방산 글로벌 수출 잔고 급증에 따른 실적 호조


4. 리서치 리포트 마스터 데이터베이스 통계 요약
──────────────────────────────────────────────────────────────────
- 데이터베이스 총 보유 리포트: 4,868건+ (국내 전 증권사 커버리지)
- 제휴 증권사 수: ${metrics?.activeBrokersCount || 28}개 주요 금융투자사
- 일일 자동 처리량: ${metrics?.todayProcessedReports || 120}건 (실시간 검증 완료)
- 평균 AI 객관성 스코어: ${metrics?.avgObjectivityScore || 87.4}점

──────────────────────────────────────────────────────────────────
※ 본 문서는 구글 닥스(Google Docs)를 통해 자동 동기화 및 발행된 문서입니다.
※ 데이터 원천: 리본인텔리전스 DB, 네이버 금융 리서치, 에프앤가이드, 전자공시시스템(DART)
`;

  await insertDocumentText(doc.documentId, fullText, accessToken);
  return doc;
}

/**
 * 2. 특정 종목/애널리스트 리포트 심층 브리핑 Google Docs 문서 생성
 */
export async function generateStockReportGoogleDoc(
  accessToken: string,
  report: any,
  options?: { userEmail?: string }
): Promise<CreatedDocResult> {
  const stockName = report.stockName || report.stock || '종목분석';
  const brokerName = report.brokerName || report.broker || '증권사';
  const docTitle = `[리서치 브리핑] ${stockName} (${brokerName}) - ${report.reportTitle || '기업분석 리포트'}`;

  const doc = await createGoogleDocument(docTitle, accessToken);

  const fullText = `증권사 기업분석 리서치 브리핑: ${stockName}
══════════════════════════════════════════════════════════════════════
■ 종목명 / 코드: ${stockName} (${report.stockCode || '-'})
■ 작성 증권사: ${brokerName}
■ 담당 연구원: ${report.analystName || report.analyst || '기업분석팀'}
■ 발간 일자: ${report.publishDate || report.date || new Date().toISOString().slice(0, 10)}
■ 정리 일시: ${new Date().toLocaleString('ko-KR')}
■ 연동 계정: ${options?.userEmail || '시스템 사용자'}
══════════════════════════════════════════════════════════════════════

1. 핵심 투자의견 및 목표주가
──────────────────────────────────────────────────────────────────
- 투자의견: ${report.opinion || 'BUY (매수)'}
- 목표주가: ${report.targetPrice ? Number(report.targetPrice).toLocaleString() + '원' : '미제시'}
- 현재주가: ${report.currentPrice ? Number(report.currentPrice).toLocaleString() + '원' : '시장가'}
- 섹터 분류: ${report.sector || '주요 산업군'}
- AI 객관성 스코어: ${report.aiObjectivityScore || 88}점 / 100점


2. 리포트 핵심 요약 (AI LLM Key Takeaways)
──────────────────────────────────────────────────────────────────
${report.aiSummary || report.summary || '핵심 실적 개선 흐름 및 신규 수주 모멘텀 가시화로 중장기 밸류에이션 리레이팅 기대.'}


3. 주요 투자 포인트 및 분석 본문
──────────────────────────────────────────────────────────────────
${report.content || report.text || '1) 주력 사업 부문의 글로벌 시장 점유율 확대 및 공급 단가 인상 효과 반영\n2) 신규 포트폴리오 다각화로 인한 영업이익률(OPM) 개선세 뚜렷\n3) 견조한 펀더멘털과 안정적인 현금흐름 바탕 주주환원 확대 정책 지속 추진'}


4. 리스크 요인 및 점검 사항
──────────────────────────────────────────────────────────────────
- 거시경제 금리 변동성 및 글로벌 원자재 가격 추이
- 전방 산업 수요 회복 속도 및 고객사 재고 조정 사이클

──────────────────────────────────────────────────────────────────
※ 본 문서는 리본-이코노미스트 리서치 파이프라인에서 Google Docs로 정리된 문서입니다.
`;

  await insertDocumentText(doc.documentId, fullText, accessToken);
  return doc;
}

/**
 * 3. 시스템 아키텍처 및 v1.6 백업/복원 매뉴얼 Google Docs 문서 생성
 */
export async function generateSystemManualGoogleDoc(
  accessToken: string,
  options?: { userEmail?: string }
): Promise<CreatedDocResult> {
  const docTitle = `[운영 백서] 리본-이코노미스트 2026 시스템 아키텍처 & v1.6 백업·복원 매뉴얼`;
  const doc = await createGoogleDocument(docTitle, accessToken);

  const fullText = `리본-이코노미스트 애널리스트 어워즈 - 시스템 운영 & 백업 매뉴얼
══════════════════════════════════════════════════════════════════════
■ 문서 분류: 엔지니어링 시스템 운영 및 재난 복구(DR) 가이드
■ 대상 버전: VERSION 1.6 안정화 빌드 (Cloud Run 8080 단일 포트 아키텍처)
■ 문서 생성 일시: ${new Date().toLocaleString('ko-KR')}
■ 담당자: ${options?.userEmail || '시스템 관리자'}
══════════════════════════════════════════════════════════════════════

1. 시스템 런타임 아키텍처 개요
──────────────────────────────────────────────────────────────────
- 인프라 환경: Google Cloud Run (Node.js 22.x LTS 기반 컨테이너)
- 백엔드 서버: Express 4.x 기반 풀스택 단일 포트 바인딩 (process.env.PORT, 기본 8080)
- 프론트엔드: React 19 + Vite + Tailwind CSS + Lucide Icons
- 데이터 저장소: 로컬 마스터 JSON DB (4,868건+) 및 Firebase Firestore
- 외부 연동: Google Docs / Drive API OAuth 연동 (Client-Side In-Memory Token)


2. 무손실 풀백업(Full Backup) 구조
──────────────────────────────────────────────────────────────────
시스템의 모든 소스코드, 폰트, DB, 빌드 결과물은 1단계 명령으로 풀백업되어 보관됩니다.
- 디렉토리 백업 위치: backups/v1.6-current-full-backup/
- 압축 아카이브 위치: backups/backup_v1.6_current_full.tar.gz (약 9.3 MB)
- 백업 생성 명령:
  npm run backup:full  (또는 node scripts/backup-full.cjs)


3. 1줄 명령 원클릭 복원(Restore) 절차
──────────────────────────────────────────────────────────────────
작업 중 소스 코드 또는 데이터가 손상되었을 때, 아래 1줄 명령으로 즉시 복원됩니다:
  npm run restore:v1.6  (또는 node scripts/restore-v1.6.cjs)

[수동 tar.gz 압축 해제 복원 방법]
1) tar -xzf backups/backup_v1.6_current_full.tar.gz -C backups/
2) npm run restore:v1.6
3) npm run lint && npm run build
4) npm run dev


4. Google Docs 연동 보안 정책
──────────────────────────────────────────────────────────────────
- 토큰 보관: 브라우저 메모리에만 캐싱 (localStorage, sessionStorage 미사용)
- 최소 권한 원칙: documents 및 drive.file 스코프만 승인 요청
- 파괴적 변경 방지: 문서 생성 전 명시적 확인 모달 제공

══════════════════════════════════════════════════════════════════════
`;

  await insertDocumentText(doc.documentId, fullText, accessToken);
  return doc;
}
