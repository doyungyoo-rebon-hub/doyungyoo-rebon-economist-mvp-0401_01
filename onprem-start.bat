@echo off
REM ====================================================================
REM AI 증권사 리포트 평가 & 파이프라인 (윈도우 온프레미스 원클릭 실행 스크립트)
REM ====================================================================

chcp 65001 > nul
echo ====================================================================
echo  🚀 AI 증권사 리포트 평가 대시보드 윈도우 온프레미스 배포 시작
echo ====================================================================

REM 1. Node.js 확인
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js가 설치되어 있지 않습니다.
    echo 👉 https://nodejs.org/ 에서 Node.js v20 LTS 버전을 먼저 설치해 주세요.
    pause
    exit /b 1
)

REM 2. .env 확인
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo ✅ .env 파일 복사 완료 (.env.example -^> .env)
    ) else (
        echo PORT=3000 > .env
        echo NODE_ENV=production >> .env
        echo GEMINI_API_KEY= >> .env
    )
    echo 💡 메모장으로 .env 파일을 열어 GEMINI_API_KEY를 입력하시면 AI 기능을 바로 쓰실 수 있습니다.
)

REM 3. 디렉토리 확인
if not exist downloads\database mkdir downloads\database
if not exist downloads\naver_pdfs mkdir downloads\naver_pdfs
if not exist downloads\naver_reports mkdir downloads\naver_reports

REM 4. 패키지 설치
echo 📦 npm 의존성 패키지 설치 중...
call npm install --legacy-peer-deps

REM 5. 빌드
echo 🔨 프로덕션 빌드 진행 중...
call npm run build

echo ====================================================================
echo  🎉 빌드 완료!
echo  🌐 웹 브라우저에서 http://localhost:3000 으로 접속하십시오.
echo ====================================================================
echo ⚡ 서비스를 시작합니다...

call npm start
pause
