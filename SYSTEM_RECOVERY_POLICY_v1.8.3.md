# 🛡️ VERSION 1.8.3 시스템 재해 복구 및 즉시 복원 운영 지침서
## Disaster Recovery & Instant Restoration Policy Guide
*문서 식별 번호: REBON-ECONOMIST-RECOVERY-POLICY-v1.8.3*  
*공인 효력 발생일: 2026년 10월 31일 확정*  
*관리 대상 버전: VERSION 1.8.3 (골드 마스터 프로덕션 릴리즈)*

---

### 1. 🎯 복구 정책 목적 및 범위 (Purpose & Scope)
본 복구 정책서는 **리본인텔리전스 × 이코노미스트 공동주관 「2026 올해의 애널리스트 어워즈」 VERSION 1.8.3** 시스템을 다운로드받은 단일 백업 아카이브(`analyst_report_eval_v1.8.3_full_backup.zip`)를 통해:
1. **Google AI Studio 내 신규/별도 애플리케이션으로 100% 동일하게 1분 내 즉시 복원**
2. **사내 온프레미스 로컬 리눅스/윈도우/맥 서버로 무결성 즉각 이전 및 구동**
3. **불시의 시스템 오류, 데이터 왜곡 발생 시 RPO(목표 복구 시점) 0초, RTO(목표 복구 시간) 3분 내 완전 복원**

을 달성하기 위한 표준화된 운영 절차(SOP)를 규정합니다.

---

### 2. 📦 백업본 자산 현황 및 데이터 무결성 규격

| 자산 구분 | 상세 내역 및 파일 경로 | 데이터 규격 및 검증 기준 |
| :--- | :--- | :--- |
| **백업 파일명** | `analyst_report_eval_v1.8.3_full_backup.zip` | 압축 용량: 약 11.88 MB (해제 시 원본 72MB+ 무손실 복구) |
| **다운로드 엔드포인트** | `GET /api/export-v1-8-3-backup-zip` | 웹 UI [버전 관리 & 백업] 상단 에메랄드 버튼 즉시 제공 |
| **직전 보존본** | `GET /api/export-v1-8-2-backup-zip` | v1.8.2 정규 백업본 동시 이중 보존 체계 |
| **핵심 빅데이터 DB** | `downloads/database/hall_of_fame_db.json`<br>`downloads/database/reports_master_db.json` | • 8,698건 리포트 전수 및 4,868건 마스터 DB 원문<br>• 261명 평가 대상 애널리스트 7대 KPI 산출값<br>• 681명 실존 애널리스트 프로파일 마스터 로스터 |
| **어워즈 핵심 정책** | • 종합 대상: **한유정 (한화투자증권, 97.15점)**<br>• 플랫폼 1위: **지인해 (신한투자증권, 94.49점) 공식 승계**<br>• 시상 제외: **이선화 (KB증권 퇴사 사유 명시)**<br>• 5개사(한국·삼성·iM·대신·IBK): 1위 **[성명 비공개]** 시상 제외 및 2위 승계 | 데이터베이스 및 코드 전역에 100% 반영되어 영구 불변성 보장 |

---

### 3. ⚡ 즉시 복원 절차 (Standard Operating Procedures)

#### 🚀 시나리오 A: Google AI Studio 새 앱으로 1분 즉시 복원 (가장 권장)

새로운 빈 앱(Empty Applet)을 열고 백업 ZIP 파일만 올리면 AI 엔지니어가 자동으로 모든 아키텍처를 원상태로 복원합니다.

1. **새 프로젝트 생성**:
   Google AI Studio 홈에서 **[+ New App]**을 클릭하여 신규 빈 프로젝트를 생성합니다.
2. **백업 ZIP 파일 첨부**:
   채팅 입력창 클립 아이콘(또는 드래그 앤 드롭)을 통해 다운로드해 둔 `analyst_report_eval_v1.8.3_full_backup.zip`을 업로드합니다.
3. **복원 명령어 입력 (그대로 복사하여 입력)**:
   ```text
   첨부한 v1.8.3 백업 ZIP 파일의 압축을 프로젝트 루트에 풀고 원상태로 복원해줘.
   1. downloads/database/ 폴더 내 hall_of_fame_db.json 및 reports_master_db.json DB 파일을 그대로 복구
   2. package.json 및 server.ts 등 소스 파일 일체 복원
   3. npm install 실행 및 린트 검증 후 dev server를 재기동해줘.
   ```
4. **복원 완료 시간**: 약 40초 ~ 1분 소요 (모든 UI와 데이터가 현재 시스템과 쌍둥이처럼 완벽 재현됨).

---

#### 🏢 시나리오 B: 사내 온프레미스 로컬 서버(Linux/WSL) 즉시 복원

사내 고유 서버 환경에서 외부 클라우드 통신 없이 단독으로 실행하는 단계입니다.

```bash
# 1. 애플리케이션 전용 디렉터리 생성 및 압축 해제
mkdir -p /app/analyst-awards && cd /app/analyst-awards
unzip analyst_report_eval_v1.8.3_full_backup.zip -d .

# 2. 파일 무결성 및 DB 존재 여부 즉시 확인 (출력: 35M, 32M 확인)
ls -lh downloads/database/

# 3. 로컬 런타임 종속성 설치
npm install

# 4. 타입스크립트 및 코드 무결성 검증
npm run lint

# 5. 프론트엔드 최적화 빌드
npm run build

# 6. 상시 무중단 데몬 등록 (PM2 권장)
sudo npm install -g pm2
pm2 start server.ts --name "analyst-awards" --interpreter ./node_modules/.bin/tsx --env PORT=3000
pm2 save && pm2 startup
```

---

### 4. 🔍 복원 직후 정상 작동 무결성 검증 5대 체크리스트 (Sanity Check)

복원 직후 브라우저 또는 터미널에서 다음 5대 핵심 항목을 확인하여 100% 정상 복구 여부를 판정합니다:

| 점검 번호 | 검증 대상 및 방법 | 기대 정상 결과 (Expected Result) | 판정 기준 |
| :---: | :--- | :--- | :---: |
| **Check 1** | **시스템 헬스체크**<br>`curl http://localhost:3000/api/health` | `status: "ok"`, `version: "VERSION 1.8.3"` 반환 | 필수 |
| **Check 2** | **평가 엔진 빅데이터 API**<br>`curl http://localhost:3000/api/pipeline-01/hall-of-fame-eval?period=1Y` | `totalEvaluatedReports: 8698`, `evaluatedAnalysts: 261` 정상 응답 | 필수 |
| **Check 3** | **종합 대상자 검증**<br>화면 1 & 화면 3 (평가결과 보고서) | **소비재/유통/음식료 1위 및 2026 종합 대상: 한유정 (한화투자증권, 97.15점)** 헌액 | 필수 |
| **Check 4** | **플랫폼 섹터 승계 검증**<br>화면 1, 화면 2, 화면 3 챔피언 테이블 | **1위 🏆 지인해 (신한투자증권, 94.49점) 공식 승계**<br>**이선화 (KB증권): 시상제외 (퇴사 사유 명시)** | 필수 |
| **Check 5** | **보고서 및 백업 추출 기능**<br>`평가결과_보고서_01` 메뉴 | PDF 인쇄 미리보기, Excel 다운로드, CSV 추출 정상 실행 | 필수 |

---

### 5. 🛑 비상 대응 및 롤백 정책 (Disaster Recovery & Rollback)
- **롤백 소요 시간**: 즉시 (RTO < 1분)
- **v1.8.2로 즉각 롤백 필요 시**:
  시스템 내 보관 중인 `downloads/backups/analyst_report_eval_v1.8.2_full_backup.zip`을 사용하여 동일한 방식으로 즉시 다운그레이드 복원이 가능합니다.
- **데이터 유실 방지(Zero Data Loss)**:
  `downloads/database/` 디렉터리는 매 빌드 및 백업 시 정적 스냅샷으로 봉인되므로, 소스코드 수정 중 에러가 발생하더라도 백업 압축 파일 내의 DB 파일을 덮어쓰기만 하면 즉시 초기 무결성 상태로 회복됩니다.

---
*공동주관: 리본인텔리전스 × 이코노미스트 독립 AI 심사평가위원회 IT 운영본부*
