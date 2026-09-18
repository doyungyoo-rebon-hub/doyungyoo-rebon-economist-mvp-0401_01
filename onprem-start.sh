#!/usr/bin/env bash
# ====================================================================
# AI 증권사 리포트 평가 & 파이프라인 (온프레미스 원클릭 자동 실행 스크립트)
# 지원 환경: Linux (Ubuntu, CentOS, Rocky Linux, RHEL) 및 macOS
# ====================================================================

set -e

echo "===================================================================="
echo " 🚀 AI 증권사 리포트 평가 대시보드 온프레미스 배포 스크립트 시작"
echo "===================================================================="

# 1. Node.js 설치 확인
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되어 있지 않습니다."
    echo "👉 Node.js v18 이상 (권장: v20 LTS) 버전을 먼저 설치해 주시기 바랍니다."
    echo "   참고: https://nodejs.org/ or 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs'"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 감지됨: ${NODE_VERSION}"

# 2. .env 파일 검사 및 기본 생성
if [ ! -f .env ]; then
    echo "⚠️  .env 파일이 존재하지 않아 .env.example로부터 기본 파일을 생성합니다."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env 파일 복사 완료"
    else
        touch .env
        echo "PORT=3000" >> .env
        echo "NODE_ENV=production" >> .env
        echo "GEMINI_API_KEY=" >> .env
    fi
    echo "💡 팁: nano .env 명령어로 GEMINI_API_KEY를 설정하시면 AI 리포트 심층 평가 기능을 즉시 활용할 수 있습니다."
fi

# 3. 필수 디렉토리 확인 및 생성
mkdir -p downloads/database downloads/naver_pdfs downloads/naver_reports

# 4. 의존성 패키지 설치
echo "📦 npm 의존성 패키지 설치 및 검증 중..."
npm install --legacy-peer-deps

# 5. 프론트엔드 및 백엔드 프로덕션 빌드
echo "🔨 프로덕션 빌드 진행 중 (Vite 정적 컴파일 및 esbuild 번들링)..."
npm run build

echo "===================================================================="
echo " 🎉 빌드가 성공적으로 완료되었습니다!"
echo " 🌐 로컬 접속 주소: http://localhost:3000"
echo " 📡 네트워크 접속 주소: http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo '서버IP'):3000"
echo " 💡 백그라운드 무중단 실행을 원하시면 PM2를 권장합니다: 'npx pm2 start dist/server.cjs --name ai-report'"
echo "===================================================================="
echo "⚡ 프로덕션 서버를 시작합니다 (종료: Ctrl + C)..."

npm start
