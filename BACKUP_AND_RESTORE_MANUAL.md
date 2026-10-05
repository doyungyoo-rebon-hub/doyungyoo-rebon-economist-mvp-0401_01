# 리본-이코노미스트 2026 애널리스트 어워즈 - v1.6 풀백업 및 복원 매뉴얼

현재 시스템(VERSION 1.6 안정화 빌드)의 전체 소스코드, 데이터베이스, 증권사 리포트 원문 및 설정 일체를 안전하게 백업 및 보관하였으며, 언제든 1단계 명령으로 즉시 복원할 수 있도록 구성되었습니다.

---

## 1. 백업 보관 현황 및 위치

- **디렉토리 풀백업 경로**:
  `backups/v1.6-current-full-backup/`
- **압축 아카이브 파일 (단일 파일 보관용)**:
  `backups/backup_v1.6_current_full.tar.gz` (약 9.3 MB, 무손실 압축)
- **백업 명세서**:
  `backups/v1.6-current-full-backup/BACKUP_MANIFEST.json`
- **백업 포함 항목**:
  1. `src/` 전체 프론트엔드 React 컴포넌트, 차트, 유틸리티
  2. `downloads/database/reports_master_db.json` (4,868건+ 마스터 DB)
  3. `downloads/database/hall_of_fame_db.json` (명예의 전당 DB)
  4. `downloads/naver_stock_reports_cache.json` 및 `all_240_analysts.json`
  5. `downloads/naver_pdfs/` 및 `downloads/naver_reports/` (원문 PDF 및 텍스트)
  6. `server.ts` (Cloud Run 8080 및 샌드박스 3000 전용 프로덕션 백엔드)
  7. `fonts/` (NanumGothic 한글 폰트 원본)
  8. `dist/` (프로덕션 컴파일된 정적 웹 자산)
  9. `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `metadata.json`
  10. `Dockerfile.onprem`, `docker-compose.yml`, `nginx-onprem.conf`, 온프레미스 실행 스크립트

> ※ `backups/` 디렉토리와 `*.tar.gz`는 `.gitignore` 및 `.gcloudignore`에 등록되어 있어, 클라우드 배포 시 불필요한 용량 증가나 배포 오류를 일으키지 않습니다.

---

## 2. 복원 (Restore) 절차

### 방법 A. 1줄 명령 자동 복원 (권장)
터미널에서 아래 명령을 실행하면 `backups/v1.6-current-full-backup/`의 모든 소스 및 데이터를 현재 작업 디렉토리로 즉시 원복합니다:

```bash
npm run restore:v1.6
```

또는 직접 스크립트 실행:
```bash
node scripts/restore-v1.6.cjs
```

실행 시:
- `BACKUP_MANIFEST.json`의 백업 일시 및 파일 수를 확인한 뒤,
- 모든 소스 파일, 설정, DB를 현재 프로젝트 루트로 안전하게 덮어씁니다.

---

### 방법 B. 압축 파일(`backup_v1.6_current_full.tar.gz`)에서 복원하는 방법
백업 디렉토리가 손상되었거나 별도 새 서버/PC 환경에서 압축 파일로 복원할 경우:

```bash
# 1. 프로젝트 루트로 이동
cd /path/to/project

# 2. tar.gz 압축 해제
tar -xzf backups/backup_v1.6_current_full.tar.gz -C backups/

# 3. 자동 복원 실행
npm run restore:v1.6
```

또는 수동 추출 후 루트로 바로 복사:
```bash
tar -xzf backups/backup_v1.6_current_full.tar.gz -C ./ --strip-components=1
```

---

### 방법 C. 신규 백업 생성 방법 (필요 시)
향후 작업 후 새로운 시점의 풀백업을 추가 생성하고자 할 때:

```bash
npm run backup:full
```
또는:
```bash
node scripts/backup-full.cjs
```
- 디렉토리 풀백업 및 `.tar.gz` 단일 아카이브 파일이 동시에 갱신됩니다.

---

## 3. 복원 후 서비스 정상 확인 절차

복원 완료 후 다음 3단계를 통해 시스템이 정상 가동되는지 확인합니다:

1. **타입스크립트 정적 검사**:
   ```bash
   npm run lint
   ```
2. **프로덕션 빌드 검사**:
   ```bash
   npm run build
   ```
3. **서버 구동 및 헬스체크**:
   ```bash
   # 개발 모드
   npm run dev

   # 헬스체크 확인
   curl http://localhost:3000/api/health
   # 응답: {"status":"ok","version":"VERSION 1.6",...}
   ```
