# AI 증권사 리포트 평가 대시보드 — 온프레미스(On-Premise) 풀백업 및 이전 가이드

본 문서는 Google AI Studio 클라우드 환경에서 운영 중인 **AI 증권사 리포트 평가 & 파이프라인 시스템** 전체 소스코드와 마스터 데이터베이스, PDF 원문 보관소, 분석 캐시를 온프레미스(사내 물리 서버, 자체 전산실 가상머신, 사내 프라이빗 클라우드 등)로 안전하게 이전하여 무중단 구축 및 운영하기 위한 **상세 풀백업 및 배포 매뉴얼**입니다.

---

## 1. 시스템 아키텍처 및 보관 데이터 구조

본 시스템은 **독립형 풀스택(Full-Stack) 단독 구동 아키텍처**로 설계되어 있어, 외부 클라우드 의존성 없이 로컬 환경에서 단독 서비스가 가능합니다.

```
📁 프로젝트 루트 디렉토리
├── 📄 server.ts                  # 백엔드 Express API & 크롤링 & AI 엔진 & 마스터 DB 핸들러
├── 📁 src/                       # 프론트엔드 React 18 + TypeScript + Tailwind UI
├── 📁 dist/                      # 프로덕션 빌드 결과물 (Vite 정적 자산 및 server.cjs)
├── 📁 downloads/                 # [★ 핵심 데이터 저장소 - 반드시 백업 필수]
│   ├── 📁 database/
│   │   ├── reports_master_db.json   # 4,868건+ 전체 증권사 리포트 마스터 데이터베이스
│   │   └── hall_of_fame_db.json     # 명예의 전당 베스트 애널리스트 및 평가 DB
│   ├── 📁 naver_pdfs/               # 증권사별 발행 원문 PDF 실물 파일 아카이브
│   ├── 📁 naver_reports/            # 수집된 원천 메타데이터 및 분석 캐시
│   └── naver_stock_reports_cache.json # 수집 캐시 인덱스
├── 📁 fonts/                     # NanumGothic 등 PDF 생성 및 렌더링용 폰트
├── 📄 Dockerfile.onprem          # 온프레미스 컨테이너 프로덕션 빌드 파일 (docker-compose 연동)
├── 📄 docker-compose.yml         # 원클릭 컨테이너 오케스트레이션 설정
├── 📄 onprem-start.sh            # Linux/macOS 원클릭 자동 설치 & 빌드 & 실행 스크립트
├── 📄 onprem-start.bat           # Windows 원클릭 자동 설치 & 빌드 & 실행 배치파일
├── 📄 nginx-onprem.conf          # 사내망 리버스 프록시 및 SSL 연동 설정 샘플
└── 📄 package.json               # 의존성 패키지 및 빌드 스크립트
```

> **💡 데이터베이스 독립성 안내**:
> 본 시스템은 클라우드 Firestore가 연결되지 않은 순수 온프레미스 독립 환경에서도 `downloads/database/` 경로의 로컬 JSON 마스터 DB 엔진이 자동으로 가동되어 **리포트 검색, 팩트체크, 신규 수집, AI 평가 데이터가 100% 정상 영구 보존**됩니다.

---

## 2. 전체 소스 및 데이터 풀백업 다운로드 방법

다음 3가지 방법 중 가장 편리한 방식을 선택하여 백업 파일을 내려받을 수 있습니다.

### 방법 A. 웹 UI 상단 '온프레미스 풀백업' 버튼 클릭 (가장 추천)
1. 웹 서비스 상단 헤더의 **버전 태그(`VERSION 1.5`)** 또는 **[온프레미스 풀백업]** 버튼을 클릭합니다.
2. 모달 창에서 **[전체 소스코드 + 마스터 DB 풀백업 (.zip)]** 버튼을 클릭하면 브라우저를 통해 즉시 다운로드됩니다.

### 방법 B. REST API 엔드포인트 직접 호출 (curl / wget)
브라우저 주소창에 직접 입력하거나 사내 서버 터미널에서 명령어로 바로 수신할 수 있습니다:

```bash
# 1) 소스코드 + 마스터DB + 캐시 백업 (약 12MB - 권장)
curl -o analyst_report_onprem.zip "https://ais-dev-xnxj2uprbaxefdmy5g3tr6-621860771525.asia-northeast1.run.app/api/export-project-zip"

# 2) 원본 PDF 파일 전체를 포함한 완전 무손실 풀백업 (약 25~50MB)
curl -o analyst_report_full_archive.zip "https://ais-dev-xnxj2uprbaxefdmy5g3tr6-621860771525.asia-northeast1.run.app/api/export-project-zip?full=true"
```

### 방법 C. Google AI Studio 상단 메뉴 Export 이용
Google AI Studio 웹 화면 우측 상단의 **Settings(설정) 또는 Export 메뉴** > **"Export to ZIP"** 또는 **"Export to GitHub"**를 클릭하여 코드 저장소를 내려받으실 수 있습니다.

---

## 3. 온프레미스 서버 환경 권장 사양

| 구분 | 최소 요구 사양 | 권장 사양 |
| :--- | :--- | :--- |
| **운영체제** | Ubuntu 20.04+, CentOS 7+, Rocky Linux 8+, Windows 10/Server 2019+, macOS 12+ | Ubuntu 22.04 / 24.04 LTS 또는 Rocky Linux 9 |
| **CPU** | 2 Core 이상 | 4 Core 이상 |
| **RAM** | 2 GB 이상 | 4 GB ~ 8 GB (마스터 DB 4,800건 인메모리 캐싱 최적화) |
| **디스크** | 최소 10 GB 여유 공간 | SSD 30 GB 이상 (리포트 PDF 장기 보관용) |
| **런타임** | Node.js v18.0.0 이상 또는 Docker 20.10+ | Node.js v20 LTS 또는 Docker & Docker Compose |
| **네트워크** | 사내 인트라넷 통신 (포트 3000 or 80) | Google Gemini API 통신용 아웃바운드 443(HTTPS) 허용 |

---

## 4. 온프레미스 배포 방안 (택 1)

### 🚀 방안 1: Docker Compose를 이용한 원클릭 컨테이너 배포 (가장 권장)

Docker가 설치된 온프레미스 환경이라면 환경 격리와 볼륨 마운트가 자동 처리되는 Docker Compose 방식을 가장 추천합니다.

1. **압축 파일 해제 및 디렉토리 이동**:
   ```bash
   mkdir -p /opt/ai-analyst-report
   unzip analyst_report_onprem.zip -d /opt/ai-analyst-report
   cd /opt/ai-analyst-report
   ```

2. **환경 변수(.env) 설정**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   `.env` 파일에 발급받으신 Gemini API 키를 입력합니다:
   ```env
   PORT=3000
   NODE_ENV=production
   GEMINI_API_KEY=AIzaSy...당신의_구글_API_키
   ```

3. **컨테이너 빌드 및 백그라운드 기동**:
   ```bash
   docker compose up -d --build
   ```

4. **상태 및 로그 확인**:
   ```bash
   docker compose ps
   docker compose logs -f
   ```
   브라우저에서 `http://서버IP:3000` 으로 접속하면 즉시 서비스가 열립니다.

---

### 💻 방안 2: Node.js 네이티브 배포 및 PM2 무중단 운영 (표준 리눅스)

물리 서버나 가상머신에 Node.js를 직접 설치하여 운영하는 방식입니다.

1. **Node.js v20 LTS 설치 (Ubuntu/Debian 기준)**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **압축 해제 및 제공된 자동 실행 스크립트 실행**:
   ```bash
   cd /opt/ai-analyst-report
   chmod +x onprem-start.sh
   ./onprem-start.sh
   ```
   *(스크립트가 npm 설치, 빌드, 마스터 DB 확인을 자동으로 완료합니다.)*

3. **PM2를 통한 24시간 365일 백그라운드 무중단 데몬 등록**:
   서버가 예기치 않게 재부팅되더라도 자동으로 서비스를 되살릴 수 있도록 PM2 프로세스 매니저를 구성합니다:
   ```bash
   # PM2 글로벌 설치
   sudo npm install -g pm2

   # 서비스 백그라운드 시작
   pm2 start dist/server.cjs --name "ai-analyst-report"

   # 서버 재부팅 시 자동 기동 등록
   pm2 startup
   pm2 save

   # 실시간 모니터링 및 로그 확인
   pm2 status
   pm2 logs ai-analyst-report
   ```

---

### 🪟 방안 3: Windows Server 환경 배포

1. [Node.js 공식 홈페이지](https://nodejs.org/)에서 `v20.x LTS (x64) .msi`를 다운로드하여 설치합니다.
2. 다운로드받은 압축 파일을 원하는 폴더(예: `C:\ai-analyst-report`)에 압축 해제합니다.
3. 프로젝트 폴더 내의 `onprem-start.bat` 파일을 마우스 우클릭 후 **관리자 권한으로 실행**합니다.
4. 모든 의존성 설치 및 빌드가 완료되면 웹 브라우저(`http://localhost:3000`)에서 즉시 실행됩니다.

---

## 5. 사내망 역방향 프록시 (Nginx) 및 사내 SSL/포트 연동

서비스를 표준 웹 포트(80 또는 443 HTTPS)로 사내 직원들에게 서비스할 경우, 함께 동봉된 `nginx-onprem.conf`를 적용합니다:

```bash
# Nginx 설치 (Ubuntu 기준)
sudo apt update && sudo apt install -y nginx

# 설정 파일 복사
sudo cp nginx-onprem.conf /etc/nginx/sites-available/ai-report.conf
sudo ln -s /etc/nginx/sites-available/ai-report.conf /etc/nginx/sites-enabled/

# Nginx 문법 검사 및 재시작
sudo nginx -t
sudo systemctl reload nginx
```
이제 사용자는 포트 번호(`:3000`) 없이 사내 도메인(`http://report-eval.company.local`)으로 편리하게 접속할 수 있습니다.

---

## 6. 정기 데이터 자동 백업 (Daily Cron Backup)

온프레미스 운영 중 수집되는 신규 리포트와 분석 데이터를 주기적으로 사내 스토리지나 백업 디렉토리에 저장하는 스크립트입니다:

```bash
# 백업 스크립트 작성 (/opt/ai-analyst-report/backup-cron.sh)
cat << 'EOF' > /opt/ai-analyst-report/backup-cron.sh
#!/bin/bash
BACKUP_DIR="/backup/ai-report/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"
cp -r /opt/ai-analyst-report/downloads "$BACKUP_DIR/"
echo "[$(date)] AI 리포트 마스터 데이터 백업 완료: $BACKUP_DIR" >> /var/log/ai-report-backup.log
EOF

chmod +x /opt/ai-analyst-report/backup-cron.sh

# crontab 등록 (매일 새벽 2시 자동 백업)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/ai-analyst-report/backup-cron.sh") | crontab -
```

---

## 7. 주요 헬스체크 및 트러블슈팅 FAQ

### Q1. Gemini API 키가 없거나 외부망 연결이 차단된 폐쇄망 환경에서는 어떻게 되나요?
- **답변**: 시스템 내부에 이미 4,868건의 증권사 리포트와 20개 증권사 명예의 전당 평가 데이터(`downloads/database/`)가 100% 로컬 인메모리 캐시로 적재되어 있습니다. Gemini API 키가 없어도 기존에 검증된 리포트 검색, 팩트체크 열람, 애널리스트 랭킹, PDF 스트리밍 기능은 온전히 정상 가동됩니다. 신규 미평가 리포트에 대해 실시간 AI 정밀 채점을 수행할 때만 Gemini API 통신이 사용됩니다.

### Q2. 헬스체크 API가 정상인지 어떻게 확인하나요?
- **답변**: 다음 명령어로 헬스체크 응답을 검증할 수 있습니다:
  ```bash
  curl http://localhost:3000/api/health
  # 기대 응답: {"status":"ok","version":"VERSION 1.5", ...}
  ```

### Q3. EADDRINUSE (포트 3000 충돌) 오류가 발생할 때
- **답변**: 사내 다른 프로세스가 3000번 포트를 사용 중인 경우:
  - Docker 사용 시: `docker-compose.yml`에서 `"8080:3000"` 처럼 호스트 외부 포트만 변경합니다.
  - Linux 사용 시: `sudo lsof -i :3000` 으로 기존 프로세스를 확인하고 종료합니다.
