# 🛡️ VERSION 1.9.0 시스템 재해 복구 및 즉시 복원 운영 지침서
## Disaster Recovery & Instant Restoration Policy Guide (Gold Master)
*문서 식별 번호: REBON-ECONOMIST-RECOVERY-POLICY-v1.9.0*  
*공인 효력 발생일: 2026년 11월 12일 확정*  
*관리 대상 버전: VERSION 1.9.0 (골드 마스터 프로덕션 릴리즈)*  
*기반 시스템: 대한민국 24개 공식 대상 증권사 및 5개 시상제외 평가사 전수 9,518건 실증 분석*

---

### 1. 🎯 복구 정책 목적 및 범위 (Purpose & Scope)
본 복구 정책서는 **리본인텔리전스 × 이코노미스트 공동주관 「2026 올해의 애널리스트 어워즈」 VERSION 1.9.0** 시스템을 다운로드받은 단일 백업 아카이브(`analyst_report_eval_v1.9.0_full_backup.zip`)를 통해:
1. **Google AI Studio 내 신규/별도 애플리케이션으로 100% 동일하게 1분 내 즉시 복원**
2. **사내 온프레미스 로컬 리눅스/윈도우(WSL2)/맥 서버로 무결성 즉각 이전 및 단독 무중단 구동**
3. **불시의 시스템 장애, 데이터 손상 발생 시 RPO(목표 복구 시점) 0초, RTO(목표 복구 시간) 3분 내 완전 복원**

을 달성하기 위한 표준화된 운영 절차(SOP)와 복원 가이드를 규정합니다.

---

### 2. 📦 v1.9.0 백업본 자산 현황 및 데이터 무결성 규격

| 자산 구분 | 상세 내역 및 파일 경로 | 데이터 규격 및 검증 기준 |
| :--- | :--- | :--- |
| **골드 마스터 백업본** | `analyst_report_eval_v1.9.0_full_backup.zip` | • 보관 위치: `downloads/backups/` & `backups/v1.9.0/`<br>• 압축 용량: 약 13~18 MB (해제 시 90MB+ 풀스택 무손실 복구) |
| **다운로드 엔드포인트** | `GET /api/export-v1-9-0-backup-zip` | 웹 UI [버전 관리 & 백업] 상단 황금색 버튼 즉시 제공 |
| **직전 보존본** | • `GET /api/export-v1-8-4-backup-zip`<br>• `GET /api/export-v1-8-3-backup-zip`<br>• `GET /api/export-v1-8-2-backup-zip` | 다중 버전 계층형 이중/삼중 보존 체계 확립 |
| **핵심 빅데이터 DB** | `downloads/database/reports_master_db.json`<br>`downloads/database/hall_of_fame_db.json` | • 9,518건 실물 리포트 전수 분석 및 4,868건 마스터 DB<br>• 메리츠증권 이지호 방산 실물 리포트 24편 전수 수록<br>• 김형수/비자동차 강성진 오염 데이터 100% 제거 완료 |
| **10대 챔피언 라인업** | • 종합 대상: **한유정 (한화투자증권, 97.15점)**<br>• 조선/중공업/방산: **이지호 (메리츠증권, 93.68점, 24편)**<br>• 건설/물류/기타: **이상호 (교보증권, 93.52점, 16편)**<br>• 플랫폼/엔터: **지인해 (신한투자증권, 94.49점, 승계 1위)**<br>• 반도체: **김동원 (KB증권, 94.59점, 승계 1위)**<br>• 2차전지: **주민우 (NH투자증권, 93.40점, 1위)**<br>• 바이오: **신민수 (키움증권, 93.86점, 1위)**<br>• 자동차: **유지웅 (다올투자증권, 93.83점, 1위)**<br>• 금융/지주: **김인 (BNK투자증권, 96.29점, 1위)**<br>• 화학/철강: **박성봉 (하나증권, 92.66점, 승계 1위)** | 전 서브 보고서(총괄의결서·TOP100·오차율매트릭스·전수데이터북) 및 엑셀/PDF 내보내기 100% 일치 |
| **컴플라이언스 규정** | • 시상 제외 5개사(한국·삼성·iM·대신·IBK): 1위 **[성명 비공개]** 시상 제외 및 2위 승계<br>• 퇴사자(이선화, KB증권): 시상 제외 사유 명시 및 2위 지인해 공식 승계 | 백업본 내 전역 비즈니스 로직에 영구 불변성 보장 |

---

### 3. ⚡ 즉시 복원 절차 (Standard Operating Procedures)

#### 🚀 시나리오 A: Google AI Studio 새 앱으로 1분 즉시 복원 (가장 권장)

새로운 빈 앱(Empty Applet)을 생성하고 백업 ZIP 파일만 업로드하면 AI 엔지니어가 자동으로 모든 아키텍처를 원상태로 복원합니다.

1. **신규 프로젝트 생성**:
   Google AI Studio 홈에서 **[+ New App]**을 클릭하여 신규 빈 프로젝트를 생성합니다.
2. **백업 ZIP 파일 첨부**:
   채팅 입력창의 첨부(클립 아이콘)를 통해 `analyst_report_eval_v1.9.0_full_backup.zip`을 업로드합니다.
3. **복원 명령어 입력 (아래 프롬프트를 그대로 복사하여 입력)**:
   ```text
   첨부한 v1.9.0 골드 마스터 백업 ZIP 파일의 압축을 프로젝트 루트에 풀고 원상태로 복원해줘.
   1. downloads/database/ 내 reports_master_db.json 및 hall_of_fame_db.json DB 파일을 그대로 복구
   2. package.json, server.ts, src/ 등 소스 파일 일체 복원
   3. npm install 및 lint 검증 후 dev server를 재기동해줘.
   ```
4. **복원 완료 시간**: 약 40초 ~ 1분 소요 (모든 UI와 데이터가 현재 시스템과 100% 동일하게 복원됨).

---

#### 🏢 시나리오 B: 사내 온프레미스 로컬 리눅스/WSL 서버 즉시 복원

사내 보안망 환경에서 외부 인터넷 통신 없이 단독으로 설치 및 영구 가동하는 절차입니다.

```bash
# 1. 애플리케이션 전용 디렉터리 생성 및 압축 해제
mkdir -p /app/analyst-awards && cd /app/analyst-awards
unzip analyst_report_eval_v1.9.0_full_backup.zip -d .

# 2. 마스터 DB 파일 무결성 확인 (reports_master_db.json, hall_of_fame_db.json)
ls -lh downloads/database/

# 3. 런타임 종속성 설치
npm install

# 4. 타입스크립트 및 린트 검증
npm run lint

# 5. 프로덕션 최적화 빌드
npm run build

# 6. 상시 무중단 데몬 등록 (PM2 권장)
sudo npm install -g pm2
pm2 start server.ts --name "analyst-awards-v190" --interpreter ./node_modules/.bin/tsx --env PORT=3000
pm2 save && pm2 startup
```

---

#### 🐳 시나리오 C: Docker 컨테이너 기반 30초 원클릭 배포

```dockerfile
# Dockerfile 예시
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["node", "server.ts"]
```

```bash
# 빌드 및 실행
docker build -t analyst-awards:v1.9.0 .
docker run -d -p 3000:3000 --name analyst-awards-app --restart always analyst-awards:v1.9.0
```

---

### 4. 🔍 복원 직후 정상 작동 무결성 검증 5대 체크리스트 (Sanity Check)

복원 직후 브라우저 또는 터미널에서 다음 5대 핵심 항목을 확인하여 100% 무결성 복구 여부를 판정합니다:

| 점검 번호 | 검증 대상 및 방법 | 기대 정상 결과 (Expected Result) | 판정 기준 |
| :---: | :--- | :--- | :---: |
| **Check 1** | **시스템 헬스체크**<br>`curl http://localhost:3000/api/health` | `status: "ok"`, `version: "1.9.0"` 정상 응답 | 필수 |
| **Check 2** | **평가 엔진 빅데이터 API**<br>`curl http://localhost:3000/api/pipeline-01/hall-of-fame-eval?period=2025_11_TO_2026_10` | • 조선/방산 1위: **이지호 (메리츠증권, 93.68점, 24편)**<br>• 건설 1위: **이상호 (교보증권, 93.52점, 16편)**<br>• 종합 대상: **한유정 (한화투자증권, 97.15점)** | 필수 |
| **Check 3** | **평가결과_보고서_01 화면 탭 4종**<br>브라우저 `평가결과_보고서_01` 메뉴 | 1. 종합 총괄 의결서: 10대 챔피언 및 대표 적중 리포트 표시<br>2. 10대 섹터 TOP 10 심사 보고서: 100인 실물 리포트 제목 표시<br>3. 10대 산업 오차율 조망: 조선/방산 8.2% 우수 정합 구간 배치<br>4. 전체 전수 데이터북: 백광제 필터링 및 전수 조회 정상 작동 | 필수 |
| **Check 4** | **엑셀/CSV 및 PDF 내보내기 검증**<br>`평가결과_보고서_01` 내 다운로드 버튼 | • 전체 엑셀(.xlsx): [누적 발간 리포트수], [대표 적중 리포트] 정상 추출<br>• CSV(UTF-8 BOM): 한글 깨짐 없이 정상 출력<br>• PDF 인쇄: 인쇄 양식 정상 렌더링 | 필수 |
| **Check 5** | **백업 파일 다운로드 API 검증**<br>`curl -I http://localhost:3000/api/export-v1-9-0-backup-zip` | `HTTP/1.1 200 OK`, `Content-Type: application/zip` 반환 | 필수 |

---

### 5. 🛑 비상 대응 및 롤백 정책 (Disaster Recovery & Rollback)
- **RTO(목표 복구 시간)**: 1분 미만
- **v1.8.4 또는 v1.8.3으로 즉각 롤백 필요 시**:
  - `downloads/backups/analyst_report_eval_v1.8.4_full_backup.zip` 또는 `v1.8.3` 백업본을 압축 해제하여 덮어쓰기만 하면 즉시 다운그레이드 복원 완료.
- **데이터 불변성 보장**:
  - `downloads/database/` 디렉터리는 매 릴리즈마다 스냅샷으로 봉인 보관되므로, 소스코드 수정 중 예상치 못한 런타임 오류가 발생하더라도 백업본 내의 `reports_master_db.json` 파일을 덮어쓰기만 하면 즉시 초기 무결성 상태로 복귀합니다.
