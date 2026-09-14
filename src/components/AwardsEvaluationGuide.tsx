import React, { useState } from 'react';
import {
  Award,
  Trophy,
  TrendingUp,
  Target,
  ShieldCheck,
  Sparkles,
  Database,
  Cpu,
  FileText,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Percent,
  Sliders,
  Clock,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Info,
  Building2,
  X
} from 'lucide-react';

interface AwardsEvaluationGuideProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
  isInline?: boolean;
}

export const AwardsEvaluationGuide: React.FC<AwardsEvaluationGuideProps> = ({
  isOpenModal = false,
  onCloseModal,
  isInline = false,
}) => {
  const [activeTab, setActiveTab] = useState<'CRITERIA' | 'PIPELINE' | 'GLOSSARY' | 'FAQ'>('CRITERIA');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const content = (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('CRITERIA')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'CRITERIA'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>4대 핵심 평가 기준 & 가중치</span>
        </button>

        <button
          onClick={() => setActiveTab('PIPELINE')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'PIPELINE'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4 text-cyan-400" />
          <span>데이터 출처 및 수집 파이프라인</span>
        </button>

        <button
          onClick={() => setActiveTab('GLOSSARY')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'GLOSSARY'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>지표별 용어 해설 사전</span>
        </button>

        <button
          onClick={() => setActiveTab('FAQ')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'FAQ'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>자주 묻는 질문 (FAQ)</span>
        </button>
      </div>

      {/* TAB 1: 4대 핵심 평가 기준 & 가중치 */}
      {activeTab === 'CRITERIA' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Formula Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 p-5 rounded-2xl border border-indigo-500/30 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2.5">
                <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
                <h4 className="text-base font-bold text-white">
                  종합 평가 스코어(Overall Score) 산출 공식 (100점 만점)
                </h4>
              </div>
              <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-1 rounded-full self-start md:self-auto">
                이코노미스트 독자 평가 모델 + AI 객관성 검증
              </span>
            </div>

            {/* Formula display */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-mono text-xs md:text-sm text-slate-200 overflow-x-auto space-y-2">
              <div className="text-amber-300 font-bold">
                Overall Score = (평균 주가 수익률 점수 × 0.35) + (목표주가 적중률 × 0.30) + (AI 객관성/공정성 점수 × 0.20) + (논리 정밀도 & 혁신성 × 0.15)
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                * 각 지표는 0~100점 척도로 정규화(Normalization)된 후 위 가중치에 따라 합산되어 최종 베스트 애널리스트 랭킹이 결정됩니다.
              </p>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. 평균 수익률 (35%) */}
            <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>평균 주가 수익률</span>
                      </h5>
                      <span className="text-[11px] text-slate-400">Average Return Rate</span>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs px-2.5 py-1 rounded-full">
                    가중치 35%
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  애널리스트가 목표가를 제시한 발간일 기준 3개월~6개월 내 실제 시장에서 기록한 최고 주가의 수익률을 산출합니다.
                </p>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>산출 공식:</span>
                    <strong className="text-emerald-300 font-mono">((달성 최고가 - 발간일 종가) / 발간일 종가) × 100%</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 border-t border-slate-800/60 pt-1">
                    <span>가상 누적 수익금:</span>
                    <span className="text-slate-300 font-semibold">1억원 기준 리포트 비중 분산 포트폴리오 가상 복리 환산</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/50">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>단기 테마성 왜곡을 배제하고 실질적인 투자 수익 기여도를 가장 높은 비중으로 평가합니다.</span>
              </div>
            </div>

            {/* 2. 목표주가 적중률 (30%) */}
            <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-cyan-400" />
                        <span>목표주가 적중률</span>
                      </h5>
                      <span className="text-[11px] text-slate-400">Target Price Hit Rate</span>
                    </div>
                  </div>
                  <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs px-2.5 py-1 rounded-full">
                    가중치 30%
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  제시된 목표주가에 실제 주가가 도달했는지 여부를 엄격하게 검증합니다. (허용 오차 밴드 ±5% 적용)
                </p>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>달성 기준:</span>
                    <strong className="text-cyan-300">실제 최고가 ≥ (목표주가 × 0.95)</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 border-t border-slate-800/60 pt-1">
                    <span>과도한 고평가 페널티:</span>
                    <span className="text-amber-300 font-semibold">목표가 대비 30% 이상 괴리 지속 시 감점</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-cyan-300 bg-cyan-950/40 p-2 rounded-lg border border-cyan-900/50">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>터무니없는 목표가 인플레이션을 방지하고 예측의 정밀성을 확보합니다.</span>
              </div>
            </div>

            {/* 3. AI 객관성 / 공정성 스코어 (20%) */}
            <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs">
                      3
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-purple-400" />
                        <span>AI 객관성 / 공정성 점수</span>
                      </h5>
                      <span className="text-[11px] text-slate-400">LLM Objectivity & Bias Verification</span>
                    </div>
                  </div>
                  <span className="bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-xs px-2.5 py-1 rounded-full">
                    가중치 20%
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Gemini LLM 엔진이 리포트 원문을 정밀 분석하여 셀사이드(Sell-side) 편향과 근거 없는 매수 권고를 필터링합니다.
                </p>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>리스크 요인 분석:</span>
                    <strong className="text-purple-300">하방 리스크(Bearish Factor) 기술 충실도</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 border-t border-slate-800/60 pt-1">
                    <span>재무제표 근거:</span>
                    <span className="text-slate-300 font-semibold">매출/영업이익 추정 및 밸류에이션 수치 제시</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-purple-300 bg-purple-950/40 p-2 rounded-lg border border-purple-900/50">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>증권사 관행적인 '무조건 매수' 편향을 배제하고 투자자 관점의 객관성을 보장합니다.</span>
              </div>
            </div>

            {/* 4. 논리 정밀도 & 혁신성 (15%) */}
            <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                      4
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>논리 정밀도 & 혁신성</span>
                      </h5>
                      <span className="text-[11px] text-slate-400">Logic Integrity & Innovation</span>
                    </div>
                  </div>
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs px-2.5 py-1 rounded-full">
                    가중치 15%
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  산업 사이클 분석의 정교함, 독창적인 가치평가 모델(SOTP, DCF 등) 적용, 시장 최초 종목 발굴 선도성을 평가합니다.
                </p>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>퍼스트 무버(First Mover):</span>
                    <strong className="text-amber-300">신규 성장 섹터 최초 리포트 발간 가산점</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 border-t border-slate-800/60 pt-1">
                    <span>사이클 분석:</span>
                    <span className="text-slate-300 font-semibold">업황 턴어라운드 및 모멘텀 예측 정확도</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-900/50">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>남들보다 한발 앞서 신성장 동력을 발굴하고 깊이 있는 논리를 제공한 연구원을 우대합니다.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 데이터 출처 및 수집 파이프라인 */}
      {activeTab === 'PIPELINE' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Data Sources Overview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>데이터 출처 (Data Sources)</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              본 시스템은 <strong>네이버 증권 리서치 센터</strong> 및 국내 <strong>32개 주요 증권사</strong>(미래에셋, 한국투자, NH투자, KB, 삼성, 신한, 키움, 하나, 메리츠, 대신 등)에서 공식 발행하는 일일 기업/산업 분석 리포트를 기반으로 합니다.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                '미래에셋증권', '한국투자증권', 'NH투자증권', 'KB증권', '삼성증권', '신한투자증권', '키움증권', '하나증권',
                '메리츠증권', '대신증권', '유진투자증권', 'IBK투자증권', '다올투자증권', '교보증권', '한화투자증권', '현대차증권'
              ].map((name) => (
                <span key={name} className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                  {name}
                </span>
              ))}
              <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-semibold">
                +16개 중소형 증권사 포함 총 32개사
              </span>
            </div>
          </div>

          {/* 4-Step Pipeline Flow */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>4단계 실시간 데이터 정제 & AI 어워즈 파이프라인</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">CRAWL & INGEST</span>
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white">실시간 리포트 수집</h6>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    네이버 증권 리서치 웹 순회 크롤러를 통해 일별 리포트 메타데이터(발행일, 종목, 연구원, 목표가) 자동 수집
                  </p>
                </div>
                <div className="text-[10px] text-blue-400 font-medium">IP 차단 방지 지연 적용</div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">PDF ARCHIVE</span>
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white">원문 PDF 자동 아카이빙</h6>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    증권사 원문 PDF 파일을 안전하게 다운로드하여 로컬 파일 시스템(downloads/naver_pdfs/YYYYMM)에 보관
                  </p>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">규칙 기반 네이밍 & 무결성 검증</div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">GEMINI LLM</span>
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white">Gemini 3.6 Flash 요약</h6>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    본문 텍스트를 구조화 파싱하여 3줄 핵심 요약, 상승/하락 논거, 재무 전망, 객관성/편향도 점수 자동 산출
                  </p>
                </div>
                <div className="text-[10px] text-purple-400 font-medium">0.3초/건 초고속 추론</div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">SYNTHESIS & RANK</span>
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white">트랙레코드 합성 & 랭킹</h6>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    수집된 전체 리포트를 연구원별/섹터별로 집계하여 수익률, 적중률, 종합 스코어 및 베스트 애널리스트 실시간 산출
                  </p>
                </div>
                <div className="text-[10px] text-amber-400 font-medium">지정 기간별 실시간 재평가</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 지표별 용어 해설 사전 */}
      {activeTab === 'GLOSSARY' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h6 className="text-xs font-bold text-white">종합 평가 스코어 (Overall Score)</h6>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                수익률(35%), 적중률(30%), AI 객관성(20%), 논리성/혁신성(15%)을 합산한 100점 만점의 통합 지표로, 올해의 베스트 애널리스트 랭킹 결정의 절대적 기준입니다.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h6 className="text-xs font-bold text-white">평균 주가 수익률 (Average Return Rate)</h6>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                해당 연구원이 발간한 모든 리포트의 제시일 대비 6개월 내 달성 최고가 수익률의 산술 평균값(%)입니다.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <h6 className="text-xs font-bold text-white">목표주가 적중률 (Target Price Hit Rate)</h6>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                발간 리포트 중 실제 주가가 목표주가의 95% 이상에 도달한 리포트의 백분율(%)입니다. 무리한 목표가 제시 여부를 판단하는 척도입니다.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <h6 className="text-xs font-bold text-white">AI 객관성/공정성 점수 (Objectivity Score)</h6>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                LLM이 리포트 본문의 수치적 밸류에이션 근거 제시 여부와 하방 리스크(Risk Factors) 분석 비중을 평가하여 셀사이드 편향을 제거한 순수 공정성 점수(0~100점)입니다.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <h6 className="text-xs font-bold text-white">가상 누적 수익금 (Cumulative Profit)</h6>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                해당 애널리스트의 추천 종목에 1억원 가상 포트폴리오를 분산 투자했을 때 실현된 누적 가상 수익금(억원) 시뮬레이션 지표입니다.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h6 className="text-xs font-bold text-white">섹터 모멘텀 스코어 (Sector Momentum)</h6>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                수집된 리포트들의 업황 사이클(회복기/확장기/호황기/둔화기) 및 수주 잔고, 수급 분석을 종합하여 산출한 섹터별 투자 유망도 점수입니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 자주 묻는 질문 (FAQ) */}
      {activeTab === 'FAQ' && (
        <div className="space-y-3 animate-fadeIn">
          {[
            {
              q: '평가 기간(예: 2026년 상반기, 최근 3개월)을 변경하면 랭킹이 어떻게 달라지나요?',
              a: '사용자가 설정한 기간 내에 발간된 리포트들만을 대상으로 필터링한 후, 해당 기간 동안의 수익률, 적중률, 객관성 평점을 실시간 재계산(Re-evaluation)하여 즉시 순위를 다시 산출합니다. 따라서 상반기 1위와 최근 3개월 1위 연구원이 다를 수 있습니다.'
            },
            {
              q: 'AI 객관성 점수는 어떤 기준으로 계산되나요?',
              a: 'Google Gemini LLM 엔진이 증권사 리포트 전문을 분석하여 1) 구체적인 재무제표 수치(매출, 영업이익, EPS 등) 제시 여부, 2) 장밋빛 전망 외에 하방 리스크(원가 상승, 환율, 수주 지연 등)를 충실히 기술했는지 여부, 3) 과도한 낙관적 형용사 사용 빈도를 종합 검증하여 100점 만점으로 채점합니다.'
            },
            {
              q: '목표가 적중률에서 오차 허용 밴드(±5%)는 무엇인가요?',
              a: '주식 시장의 호가 틱 및 일시적 변동성을 고려하여, 제시 목표주가의 95% 이상 가격에 도달한 경우 목표주가 적중(ACHIEVED)으로 인정합니다. 예를 들어 목표가 100,000원 종목이 96,000원까지 도달했다면 적중으로 처리됩니다.'
            },
            {
              q: '네이버 증권에서 신규 리포트가 수집되면 랭킹에 언제 반영되나요?',
              a: '[데이터 파이프라인]에서 실시간 수집 또는 월간 일괄 수집을 실행하면, 다운로드된 즉시 애널리스트 트랙레코드 합성기(Synthesizer)가 가동되어 어워즈 대시보드와 리포트 허브에 즉시 실시간 동기화됩니다.'
            },
            {
              q: '가상 누적 수익금은 어떻게 계산되나요?',
              a: '연구원의 총 발간 리포트 수와 평균 수익률을 바탕으로, 기초 자산 1억 원을 추천 종목들에 균등/가중 분산 투자했을 때 거둘 수 있는 가상 시뮬레이션 수익 금액(억원 단위)을 산출합니다.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-4 py-3.5 text-left flex items-center justify-between text-xs font-bold text-white hover:bg-slate-900/80 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-amber-400 font-mono">Q{idx + 1}.</span>
                  <span>{item.q}</span>
                </span>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {expandedFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-900 bg-slate-900/40">
                  <p className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold font-mono">A.</span>
                    <span>{item.a}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-scaleUp">
          {/* Modal Header */}
          <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>베스트 애널리스트 어워즈 평가 기준 및 데이터 설명</span>
                  <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                    공식 가이드
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  이코노미스트 독자 평가 모델 · 4대 핵심 가중치 산출 공식 · 네이버 증권 32개사 데이터 파이프라인
                </p>
              </div>
            </div>

            {onCloseModal && (
              <button
                onClick={onCloseModal}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto">{content}</div>

          {/* Modal Footer */}
          <div className="bg-slate-950 border-t border-slate-800 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AI 공정성 검증 및 실시간 데이터 파이프라인 정합성 보증</span>
            </div>
            {onCloseModal && (
              <button
                onClick={onCloseModal}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                확인 완료
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 lg:p-7 shadow-xl space-y-5 relative overflow-hidden backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>베스트 애널리스트 평가 기준 및 데이터 설명</span>
              <span className="text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                어워즈 공식 산출 가이드
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              주가 수익률(35%), 목표가 적중률(30%), AI 객관성 스코어(20%), 논리 정밀도(15%)의 산출 방식과 네이버 증권 32개사 리포트 수집 프로세스를 안내합니다.
            </p>
          </div>
        </div>
      </div>

      {content}
    </div>
  );
};
