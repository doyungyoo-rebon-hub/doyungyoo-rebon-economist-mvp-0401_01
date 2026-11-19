# 🚀 2026 대한민국 올해의 애널리스트 어워즈 시스템
## 온프레미스 로컬 서버 이전 및 운영 완벽 가이드 (Local Server Migration Guide)
*버전: v1.8.2 백업본 기반 v1.8.3 환경 이전 규격*  
*발행일: 2026년 10월 26일 공인 확정*

---

### 1. 📦 백업 파일 개요
- **백업 파일명**: `analyst_report_eval_v1.8.2_full_backup.zip` (약 18.06 MB)
- **보관 위치**:
  - 시스템 내부: `/backups/v1.8.2/analyst_report_eval_v1.8.2_full_backup.zip`
  - 다운로드 디렉터리: `/downloads/backups/analyst_report_eval_v1.8.2_full_backup.zip`
  - 웹 다운로드 API: `http://<서버주소>/api/export-v1-8-2-backup-zip`
- **포함 데이터**:
  - 풀스택 소스코드 (`src/`, `server.ts`, `vite.config.ts`, `package.json`, `tsconfig.json`)
  - 마스터 빅데이터 파일 (`downloads/database/`, `extracted_roster.json`, `final_master_roster.json`)
  - 8,698건 리서치 리포트 전수 메타데이터 및 DART 팩트체크 엔진
  - 10대 산업별 TOP 10 (100인 풀 스코어카드) 및 2026 종합 대상(한유정)·10대 챔피언 데이터

---

### 2. 🖥️ 로컬 서버 시스템 최소 및 권장 사양

| 구분 | 최소 요구 사양 (Minimal) | 권장 사양 (Recommended) | 비고 |
| :--- | :--- | :--- | :--- |
| **운영체제 (OS)** | Ubuntu 20.04/22.04 LTS, macOS 13+, Windows 10/11 (WSL2) | Ubuntu 22.04 / 24.04 LTS 또는 RHEL 9 | 사내 온프레미스 Linux 서버 최적 |
| **Node.js** | v20.12.0 이상 | **v22.x LTS** | Node.js 22 네이티브 권장 |
| **CPU** | 2 Core 이상 | 4 Core 이상 | 빅데이터 배치 및 PDF 파싱 연산 |
| **RAM** | 4 GB 이상 | 8 GB 이상 | 8,698건 인메모리 연산 및 캐싱 |
| **Disk** | 10 GB 이상 SSD | 50 GB 이상 NVMe SSD | PDF 원문 및 DB 캐시 누적 보관 |
| **네트워크** | 사내망 또는 80/443/3000 포트 개방 | 사내 고정 IP 및 방화벽 인바운드 허용 | 클라이언트 웹 브라우저 접속용 |

---

### 3. 🛠️ 단계별 로컬 서버 설치 및 이전 절차 (Step-by-Step)

#### [1단계] Node.js 및 필수 도구 설치
서버 터미널에서 Node.js v22와 필수 유틸리티를 설치합니다.

```bash
# Ubuntu / Debian 계열 기준
sudo apt-get update && sudo apt-get install -y curl git unzip build-essential

# Node.js 22 LTS NodeSource 저장소 등록 및 설치
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 설치 버전 확인 (node >= 20, npm >= 10)
node -v
npm -v
```

#### [2단계] 백업 압축 파일 해제
다운로드한 `analyst_report_eval_v1.8.2_full_backup.zip` 파일을 로컬 서버의 원하는 디렉터리에 복사한 후 압축을 해제합니다.

```bash
# 작업 디렉터리 생성
mkdir -p /app/analyst-awards
cd /app/analyst-awards

# 백업 zip 파일 압축 해제 (파일명 확인)
unzip /path/to/analyst_report_eval_v1.8.2_full_backup.zip -d .

# 디렉터리 구조 확인 (src, server.ts, package.json 등이 정상 해제되었는지 확인)
ls -la
```

#### [3단계] 종속 패키지(npm modules) 클린 설치
백업본에는 순수 소스코드와 데이터만 포함되어 있으므로, 로컬 환경에 맞춰 npm 패키지를 설치합니다.

```bash
# 로컬 빌드 환경 종속성 설치
npm install

# TypeScript 컴파일 및 린트 사전 검증
npm run lint
```

#### [4단계] 환경 설정 (.env) 구성
사내 로컬 환경에 맞추어 포트 및 옵션 환경 변수를 설정합니다.

```bash
# .env 파일 생성 또는 편집
cat << 'EOF' > .env
# 서버 기본 포트 (기본값: 3000)
PORT=3000
NODE_ENV=production

# (선택 사항) Gemini AI 연동 시 Google AI Studio API Key
# GEMINI_API_KEY=your_gemini_api_key_here
EOF
```

#### [5단계] 프론트엔드 프로덕션 빌드 (선택/권장)
최적의 응답 속도와 사내망 배포를 위해 Vite 프로덕션 번들을 생성합니다.

```bash
npm run build
```

#### [6단계] 서비스 기동 및 접속 확인
```bash
# 프로덕션 단독 서버 구동
npm start

# 또는 개발/디버그 모드 구동
npm run dev
```

브라우저에서 접속:
- 로컬 브라우저: `http://localhost:3000`
- 사내 네트워크: `http://<서버_사내_IP>:3000`

---

### 4. 🔄 상시 운영(프로덕션 무중단 서비스) 설정

사내 온프레미스 서버 재부팅 시에도 자동으로 실행되도록 **PM2 프로세스 매니저** 또는 **Linux Systemd** 데몬 등록을 권장합니다.

#### 옵션 A: PM2 프로세스 매니저 (가장 추천)
```bash
# 1. PM2 전역 설치
sudo npm install -g pm2

# 2. PM2 에코시스템 실행
pm2 start server.ts --name "analyst-awards-app" --interpreter ./node_modules/.bin/tsx --env PORT=3000

# 3. 서버 부팅 시 자동 시작 설정
pm2 save
pm2 startup
```

- 로그 확인: `pm2 logs analyst-awards-app`
- 상태 점검: `pm2 status`
- 재시작: `pm2 restart analyst-awards-app`

---

#### 옵션 B: Linux Systemd 데몬 서비스 등록
```bash
# 1. 서비스 유닛 파일 생성
sudo tee /etc/systemd/system/analyst-awards.service > /dev/null << 'EOF'
[Unit]
Description=Reborn-Economist Analyst Awards System
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/app/analyst-awards
Environment=PORT=3000
Environment=NODE_ENV=production
ExecStart=/usr/bin/npx tsx /app/analyst-awards/server.ts
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 2. 데몬 리로드 및 활성화
sudo systemctl daemon-reload
sudo systemctl enable analyst-awards
sudo systemctl start analyst-awards

# 3. 서비스 상태 확인
sudo systemctl status analyst-awards
```

---

### 5. 🌐 Nginx 사내망 리버스 프록시 연동 가이드

80(HTTP) 또는 443(HTTPS) 표준 포트로 임직원 및 사내망에 제공하려면 Nginx를 앞단에 구성합니다.

```nginx
# /etc/nginx/sites-available/analyst-awards.conf
server {
    listen 80;
    server_name analyst-awards.yourcompany.local; # 사내 도메인 또는 IP

    # 대용량 리포트 및 PDF 스트리밍 버퍼 설정
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 타임아웃 방지 (빅데이터 계산 시)
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
}
```

```bash
# Nginx 설정 활성화 및 재기동
sudo ln -s /etc/nginx/sites-available/analyst-awards.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

### 6. 🚨 이전 후 정상 작동 체크리스트 (Verification Checklist)

로컬 서버 구동 후 브라우저 또는 curl로 아래 5가지 핵심 기능이 100% 정상인지 확인합니다:

- [ ] **헬스체크 API**:
  `curl http://localhost:3000/api/health` -> `status: "ok"`, `version: "VERSION 1.8.3"` 반환 확인
- [ ] **평가 엔진 빅데이터 API**:
  `curl http://localhost:3000/api/pipeline-01/hall-of-fame-eval?period=1Y` -> 정상 JSON 반환 확인
- [ ] **종합 대상자 확인**:
  `소비재/유통/음식료` 섹터 1위 및 종합 대상에 **한유정(한화투자증권)** 등록 여부 확인
- [ ] **플랫폼/게임/엔터 1위 승계 확인**:
  1위 **지인해(신한투자증권)** 공식 챔피언 승계 및 1위 연구원(이선화) KB증권 퇴사 시상 제외 표기 확인
- [ ] **보고서 내보내기 기능**:
  웹 화면 `평가결과_보고서_01` 메뉴에서 `PDF 인쇄 / Excel / Markdown` 다운로드가 사내망에서 즉시 구동되는지 확인

---
*가이드 작성: 리본인텔리전스 × 이코노미스트 공동주관 AI 독립 심사평가 기술운영팀*
