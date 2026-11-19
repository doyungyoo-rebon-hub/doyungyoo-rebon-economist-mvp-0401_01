import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain,
  Network,
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Database,
  Layers,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Info,
  Maximize2,
  Target,
  Briefcase,
  Scale,
  BarChart3,
  SlidersHorizontal,
  ArrowUpRight,
  ShieldAlert,
  DollarSign,
  Award,
  ChevronDown,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  MASTER_ONTOLOGY_DATA, 
  OntologyNode, 
  OntologyEdge, 
  NodeType 
} from '../data/ontologyData';
import { 
  executeGraphRagQuery, 
  GraphRagResponse, 
  getAnalystBiasDataset,
  AnalystBiasMetric,
  CitationItem
} from '../services/graphRagService';
import {
  simulatePortfolio,
  StrategyType,
  TimeHorizon,
  PortfolioHolding,
  HighReliabilityAnalyst,
  SCREENED_HIGH_RELIABILITY_ANALYSTS,
  PortfolioSimulationSummary
} from '../services/portfolioSimulationService';

interface ResearchIntelligence01Props {
  onNavigateToReportAnalysis?: (report: any) => void;
  onNavigateToAnalystReview?: () => void;
}

export const ResearchIntelligence01: React.FC<ResearchIntelligence01Props> = ({
  onNavigateToReportAnalysis: _onNavigateToReportAnalysis,
  onNavigateToAnalystReview: _onNavigateToAnalystReview
}) => {
  // 4대 서브모드 탭
  const [activeSubMode, setActiveSubMode] = useState<'rag_query' | 'graph_explorer' | 'analyst_bias' | 'alpha_portfolio'>('rag_query');

  // 모드 1: GraphRAG 질의 상태
  const [searchQuery, setSearchQuery] = useState<string>('HBM 공급망에서 2026년 실적 추정 오차가 가장 적었던 애널리스트와 DART 공시 결과는?');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ragResult, setRagResult] = useState<GraphRagResponse | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<CitationItem | null>(null);

  // 모드 2: 지식 그래프 탐색기 상태
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('all');
  const [selectedNodeTypeFilter, setSelectedNodeTypeFilter] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<OntologyNode | null>(null);
  const [highlightedNeighbors, setHighlightedNeighbors] = useState<string[]>([]);

  // 모드 3: 애널리스트 편향 분석기 상태
  const [biasFilter, setBiasFilter] = useState<string>('all');
  const [biasSearchTerm, setBiasSearchTerm] = useState<string>('');
  const [selectedAnalystMetric, setSelectedAnalystMetric] = useState<AnalystBiasMetric | null>(null);

  // 모드 4: AI 알파 포트폴리오 시뮬레이터 상태
  const [portfolioStrategy, setPortfolioStrategy] = useState<StrategyType>('alpha_weighted');
  const [portfolioHorizon, setPortfolioHorizon] = useState<TimeHorizon>('1y_full');
  const [applyIRP, setApplyIRP] = useState<boolean>(false);
  const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(null);

  const simulationResult: PortfolioSimulationSummary = useMemo(() => {
    return simulatePortfolio(portfolioStrategy, portfolioHorizon, applyIRP);
  }, [portfolioStrategy, portfolioHorizon, applyIRP]);

  const analystBiasData = useMemo(() => getAnalystBiasDataset(), []);

  // 초기 1회 기본 질의 실행
  useEffect(() => {
    handleRunQuery(searchQuery);
  }, []);

  const handleRunQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    try {
      const res = await executeGraphRagQuery(queryText);
      setRagResult(res);
      if (res.citations && res.citations.length > 0) {
        setSelectedCitation(res.citations[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // 프리셋 질문 리스트
  const PRESET_QUERIES = [
    {
      title: 'HBM 공급망 & DART 공시 실적 정합성',
      query: 'HBM 공급망에서 2026년 실적 추정 오차가 가장 적었던 애널리스트와 DART 공시 결과는?'
    },
    {
      title: '2차전지 캐즘 선제 경고 & 가동률 검증',
      query: '전기차 캐즘 국면에서 2차전지 가동률 하락과 마진 축소를 가장 먼저 경고한 애널리스트와 DART 공시는?'
    },
    {
      title: '343명 애널리스트 성향/편향 및 가중 오차율',
      query: '343명 애널리스트의 낙관 편향(Optimism Bias)과 가중 평균 오차율 모델 분석 결과는?'
    },
    {
      title: '바이오 ADC/SC 제형 기술수출 밸류체인',
      query: '알테오젠 ALT-B4 키트루다 SC 제형변경에 따른 마일스톤 공시 팩트체크와 수혜 밸류체인은?'
    }
  ];

  // 그래프 노드 필터링
  const filteredGraphNodes = useMemo(() => {
    return MASTER_ONTOLOGY_DATA.nodes.filter(node => {
      if (selectedNodeTypeFilter !== 'all' && node.type !== selectedNodeTypeFilter) return false;
      if (selectedSectorFilter !== 'all') {
        if (node.type === 'sector' && node.properties.code !== selectedSectorFilter) return false;
        if (node.type === 'company' && !node.properties.sector?.includes(selectedSectorFilter)) return false;
      }
      return true;
    });
  }, [selectedSectorFilter, selectedNodeTypeFilter]);

  const handleNodeClick = (node: OntologyNode) => {
    setSelectedNode(node);
    // 이웃 노드 탐색
    const neighborIds: string[] = [];
    MASTER_ONTOLOGY_DATA.edges.forEach(edge => {
      if (edge.source === node.id) neighborIds.push(edge.target);
      if (edge.target === node.id) neighborIds.push(edge.source);
    });
    setHighlightedNeighbors(neighborIds);
  };

  // 편향 데이터 필터링
  const filteredBiasData = useMemo(() => {
    return analystBiasData.filter(item => {
      if (biasFilter !== 'all' && !item.tendency.includes(biasFilter)) return false;
      if (biasSearchTerm.trim()) {
        const term = biasSearchTerm.toLowerCase();
        return item.name.toLowerCase().includes(term) ||
          item.broker.toLowerCase().includes(term) ||
          item.sector.toLowerCase().includes(term);
      }
      return true;
    });
  }, [analystBiasData, biasFilter, biasSearchTerm]);

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* 1. 상단 인텔리전스 허브 헤더 & 메트릭 배너 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                차세대 하이브리드 GraphRAG & 온톨로지 엔진
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                DART 정합도 99.8%
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                v1.8.4 실시간 연동
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Brain className="text-indigo-400 w-8 h-8" />
              AI 리서치 인텔리전스 (Research Intelligence)
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              단순 키워드 검색을 넘어 <strong>9,518건 리서치 원문</strong>, <strong>343명 애널리스트 메타데이터</strong>, 
              <strong>DART 전자공시 실물 실적</strong>을 연결한 <strong>하이브리드 GraphRAG 지식 그래프</strong>로 실시간 인과관계 추론과 엄밀한 팩트체크를 제공합니다.
            </p>
          </div>

          {/* 핵심 데이터 카운터 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-indigo-500/20 backdrop-blur-md">
            <div className="px-3 py-1.5 text-center">
              <div className="text-[11px] text-slate-400">인덱싱 리포트</div>
              <div className="text-lg font-black text-white">9,518<span className="text-xs text-indigo-400 ml-0.5">건</span></div>
            </div>
            <div className="px-3 py-1.5 text-center border-l border-slate-800">
              <div className="text-[11px] text-slate-400">분석 연구원</div>
              <div className="text-lg font-black text-emerald-400">343<span className="text-xs text-emerald-300 ml-0.5">명</span></div>
            </div>
            <div className="px-3 py-1.5 text-center border-l border-slate-800">
              <div className="text-[11px] text-slate-400">지식 노드/엣지</div>
              <div className="text-lg font-black text-amber-400">1,240<span className="text-xs text-amber-300 ml-0.5">/ 4.8k</span></div>
            </div>
            <div className="px-3 py-1.5 text-center border-l border-slate-800">
              <div className="text-[11px] text-slate-400">AI 추론 모델</div>
              <div className="text-sm font-bold text-indigo-300 font-mono mt-1">Gemini 3.8 Flash</div>
            </div>
          </div>
        </div>

        {/* 서브 모드 탭 내비게이션 */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveSubMode('rag_query')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubMode === 'rag_query'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/50'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Search size={16} />
            모드 1: 대화형 하이브리드 GraphRAG 질의응답
          </button>

          <button
            onClick={() => setActiveSubMode('graph_explorer')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubMode === 'graph_explorer'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/50'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Network size={16} />
            모드 2: 인터랙티브 지식 그래프 & 밸류체인 탐색기
          </button>

          <button
            onClick={() => setActiveSubMode('analyst_bias')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubMode === 'analyst_bias'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/50'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Compass size={16} />
            모드 3: 343명 애널리스트 성향/편향 레이더
          </button>

          <button
            onClick={() => setActiveSubMode('alpha_portfolio')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubMode === 'alpha_portfolio'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/50'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Briefcase size={16} className={activeSubMode === 'alpha_portfolio' ? 'text-amber-300' : 'text-emerald-400'} />
            <span>모드 4: AI 알파 포트폴리오 시뮬레이터</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono font-semibold">
              초과수익 실증
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 서브모드 1: 대화형 하이브리드 GraphRAG 질의응답                                 */}
      {/* ========================================================================= */}
      {activeSubMode === 'rag_query' && (
        <div className="space-y-6">
          {/* 검색 입력 및 추천 프리셋 바 */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunQuery(searchQuery)}
                  placeholder="금융 자연어 질의 입력 (예: HBM TC본더 독점 공급사와 실적 추정 오차율이 가장 낮았던 연구원은?)"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>
              <button
                onClick={() => handleRunQuery(searchQuery)}
                disabled={isLoading}
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    추론 진행 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    GraphRAG 분석
                  </>
                )}
              </button>
            </div>

            {/* 프리셋 빠른 질문 */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target size={13} className="text-indigo-400" />
                추천 금융 딥다이브 쿼리 (인과관계 및 팩트체크 프리셋)
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_QUERIES.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(preset.query);
                      handleRunQuery(preset.query);
                    }}
                    className="text-xs bg-slate-950 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 rounded-lg px-3 py-1.5 transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 쿼리 실행 결과 및 파이프라인 */}
          {ragResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 좌측: 실시간 추론 파이프라인 단계 및 종합 답변 (8컬럼) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4단계 추론 파이프라인 프로그레스 카드 */}
                <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4">
                  <div className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-indigo-300">
                      <Layers size={14} />
                      GraphRAG 실시간 다단계 추론 파이프라인 (Execution Trace)
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      총 소요시간: {ragResult.executionTimeMs}ms
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {ragResult.reasoningSteps.map((s) => (
                      <div key={s.step} className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-500/30">
                            STEP {s.step}
                          </span>
                          <CheckCircle2 size={13} className="text-emerald-400" />
                        </div>
                        <div className="text-xs font-bold text-white truncate">{s.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{s.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 종합 AI 답변 카드 */}
                <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                        <Brain size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                          GraphRAG Synthesis & Fact-Checked Result
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          지식 그래프 및 DART 공시 통합 분석 결과
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">팩트 정합성 신뢰도</div>
                      <div className="text-lg font-black text-emerald-400">{ragResult.confidenceScore}%</div>
                    </div>
                  </div>

                  {/* 이그제큐티브 서머리 콜아웃 */}
                  <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 text-sm font-medium leading-relaxed flex items-start gap-3">
                    <Info size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-indigo-300 uppercase mb-0.5">핵심 요약 결론 (Executive Summary)</div>
                      {ragResult.executiveSummary}
                    </div>
                  </div>

                  {/* 답변 본문 렌더링 */}
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-3 font-sans">
                    {ragResult.answer}
                  </div>

                  {/* 편향성 알림 배너 */}
                  {ragResult.biasAlert && (
                    <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
                      <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-300 mr-1.5">[시장 편향 경고 (Bias Alert)]:</span>
                        {ragResult.biasAlert}
                      </div>
                    </div>
                  )}

                  {/* 핵심 인텔리전스 인사이트 불릿 */}
                  <div className="border-t border-slate-800 pt-4 space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-emerald-400" />
                      주요 발견점 및 실무 투자 인텔리전스 (Key Findings)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ragResult.keyInsights.map((insight, i) => (
                        <div key={i} className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 우측: 탐색된 서브그래프 엔티티 & DART 원문 근거 (4컬럼) */}
              <div className="lg:col-span-4 space-y-6">
                {/* 1. 활성화된 온톨로지 엔티티 노드 목록 */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Network size={14} className="text-indigo-400" />
                      매칭된 온톨로지 엔티티 ({ragResult.matchedNodes.length}개)
                    </h4>
                    <span className="text-[10px] text-slate-500">2-Hop Traversal</span>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {ragResult.matchedNodes.map(node => (
                      <div
                        key={node.id}
                        onClick={() => handleNodeClick(node)}
                        className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0" 
                            style={{ backgroundColor: node.color || '#6366f1' }}
                          />
                          <div className="truncate">
                            <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                              {node.label}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {node.subLabel || node.category}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 shrink-0">
                          {node.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. DART 공시 및 리포트 원문 인용 (Citations Drawer) */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      근거 원문 팩트체크 ({ragResult.citations.length}건)
                    </h4>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                      DART 딥링크
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {ragResult.citations.map((cite) => {
                      const isSelected = selectedCitation?.id === cite.id;
                      return (
                        <div
                          key={cite.id}
                          onClick={() => setSelectedCitation(cite)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                            isSelected
                              ? 'bg-slate-950 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-slate-200 line-clamp-1">
                              {cite.title}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                              cite.type === 'dart' 
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                            }`}>
                              {cite.type === 'dart' ? 'DART 공시' : '리포트 원문'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            "{cite.excerpt}"
                          </p>

                          {cite.type === 'report' && cite.analyst && (
                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                              <span>{cite.broker} · {cite.analyst}</span>
                              <span className="font-mono text-emerald-400 font-semibold">적중률 {cite.accuracyRate}</span>
                            </div>
                          )}

                          {cite.dartFilingNo && (
                            <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-between">
                              <span>접수번호: {cite.dartFilingNo}</span>
                              <ExternalLink size={11} className="text-slate-500" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 서브모드 2: 인터랙티브 지식 그래프 & 밸류체인 탐색기                            */}
      {/* ========================================================================= */}
      {activeSubMode === 'graph_explorer' && (
        <div className="space-y-6">
          {/* 상단 그래프 제어 필터 바 */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Network size={14} className="text-indigo-400" />
                섹터 필터:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'SEMI', 'BATTERY', 'BIO', 'DEFENSE', 'AUTO', 'FINANCE'].map(sec => (
                  <button
                    key={sec}
                    onClick={() => setSelectedSectorFilter(sec)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedSectorFilter === sec
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {sec === 'all' ? '전체 산업' : sec}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">노드 타입:</span>
              <select
                value={selectedNodeTypeFilter}
                onChange={(e) => setSelectedNodeTypeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">전체 엔티티</option>
                <option value="sector">산업 섹터 (Sector)</option>
                <option value="company">기업 (Company)</option>
                <option value="analyst">애널리스트 (Analyst)</option>
                <option value="risk_factor">리스크 요인 (Risk)</option>
                <option value="report_chunk">리포트 원문 (Report)</option>
              </select>
            </div>
          </div>

          {/* 지식 그래프 시각화 인터랙티브 보드 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 메인 그래프 캔버스 (8컬럼) */}
            <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-6 min-h-[550px] relative overflow-hidden flex flex-col justify-between shadow-2xl">
              {/* 배경 그리드 패턴 */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none" 
                style={{
                  backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Interactive Ontology Canvas · <strong>{filteredGraphNodes.length}개 노드 렌더링 중</strong></span>
                </div>
                <div className="text-[11px] text-slate-500">
                  노드를 클릭하면 공급망 관계 및 DART 공시 정보가 조회됩니다
                </div>
              </div>

              {/* 인터랙티브 노드 클러스터 배치 렌더러 */}
              <div className="relative z-10 my-auto py-8">
                {/* 섹터 레벨 */}
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">1. Macro Sectors</div>
                <div className="flex flex-wrap gap-3 mb-6">
                  {filteredGraphNodes.filter(n => n.type === 'sector').map(node => {
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <button
                        key={node.id}
                        onClick={() => handleNodeClick(node)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-white scale-105 ring-2 ring-indigo-400'
                            : 'bg-slate-900 text-slate-200 border-indigo-500/30 hover:border-indigo-400 hover:bg-slate-850'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: node.color }} />
                        {node.label}
                      </button>
                    );
                  })}
                </div>

                {/* 기업 밸류체인 레벨 */}
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">2. Companies & Value Chain (대장주 & 소부장)</div>
                <div className="flex flex-wrap gap-2.5 mb-6">
                  {filteredGraphNodes.filter(n => n.type === 'company').map(node => {
                    const isSelected = selectedNode?.id === node.id;
                    const isNeighbor = highlightedNeighbors.includes(node.id);
                    return (
                      <button
                        key={node.id}
                        onClick={() => handleNodeClick(node)}
                        className={`px-3 py-2 rounded-xl border text-xs transition-all shadow flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-white scale-105 ring-2 ring-blue-400 font-bold'
                            : isNeighbor
                            ? 'bg-indigo-950/90 text-indigo-200 border-indigo-400 ring-1 ring-indigo-500/50 font-semibold'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                        <span>{node.label}</span>
                        {node.properties.supplyTier && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-950 text-slate-400 font-mono">
                            소부장
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 애널리스트 및 리스크 요인 레벨 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">3. Coverage Analysts</div>
                    <div className="flex flex-wrap gap-2">
                      {filteredGraphNodes.filter(n => n.type === 'analyst').map(node => {
                        const isSelected = selectedNode?.id === node.id;
                        const isNeighbor = highlightedNeighbors.includes(node.id);
                        return (
                          <button
                            key={node.id}
                            onClick={() => handleNodeClick(node)}
                            className={`px-3 py-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-sky-600 text-white border-white font-bold scale-105'
                                : isNeighbor
                                ? 'bg-sky-950 text-sky-200 border-sky-400 font-semibold'
                                : 'bg-slate-900 text-slate-300 border-slate-800'
                            }`}
                          >
                            <Users size={12} className="text-sky-400" />
                            <span>{node.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">4. Key Catalysts & Risks</div>
                    <div className="flex flex-wrap gap-2">
                      {filteredGraphNodes.filter(n => n.type === 'risk_factor').map(node => {
                        const isSelected = selectedNode?.id === node.id;
                        return (
                          <button
                            key={node.id}
                            onClick={() => handleNodeClick(node)}
                            className={`px-3 py-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-rose-600 text-white border-white font-bold'
                                : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            <AlertTriangle size={12} className="text-rose-400" />
                            <span>{node.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 범례 */}
              <div className="relative z-10 pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> 반도체/IT
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 2차전지
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> 바이오
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 방산
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> 금융지주
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  전체 온톨로지 1,240개 노드 자동 매핑
                </div>
              </div>
            </div>

            {/* 우측 엔티티 상세 인텔리전스 인스펙터 (4컬럼) */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info size={14} className="text-indigo-400" />
                  엔티티 인텔리전스 인스펙터
                </h4>
                {selectedNode && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-bold uppercase">
                    {selectedNode.type}
                  </span>
                )}
              </div>

              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedNode.label}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedNode.subLabel || selectedNode.category}</p>
                  </div>

                  {/* 세부 속성 렌더러 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">주요 도메인 속성</div>
                    {Object.entries(selectedNode.properties).map(([key, val]) => (
                      <div key={key} className="flex items-start justify-between text-xs py-1 border-b border-slate-900/80">
                        <span className="text-slate-500 font-mono text-[11px]">{key}</span>
                        <span className="text-slate-200 font-medium text-right max-w-[200px] truncate">{String(val)}</span>
                      </div>
                    ))}
                  </div>

                  {/* 공급망 연결 관계 (이웃 노드) */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>연결된 온톨로지 엣지 ({highlightedNeighbors.length}개)</span>
                    </div>
                    <div className="space-y-1.5">
                      {MASTER_ONTOLOGY_DATA.edges
                        .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                        .map(edge => {
                          const targetNode = MASTER_ONTOLOGY_DATA.nodes.find(n => 
                            n.id === (edge.source === selectedNode.id ? edge.target : edge.source)
                          );
                          return (
                            <div key={edge.id} className="text-xs p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                              <span className="text-indigo-400 font-bold text-[11px]">
                                {edge.label}
                              </span>
                              <span className="text-slate-300 font-medium">
                                {targetNode?.label}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* GraphRAG 쿼리 버튼 */}
                  <button
                    onClick={() => {
                      const q = `${selectedNode.label}의 실적 추정치와 DART 공시 교차검증 결과는?`;
                      setSearchQuery(q);
                      setActiveSubMode('rag_query');
                      handleRunQuery(q);
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search size={14} />
                    이 엔티티로 GraphRAG 질의하기
                  </button>
                </div>
              ) : (
                <div className="text-center py-16 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
                    <Network size={24} />
                  </div>
                  <div className="text-sm font-bold text-slate-400">노드를 선택하세요</div>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    좌측 지식 그래프 캔버스에서 산업, 기업, 애널리스트 노드를 클릭하면 공급망 관계와 DART 데이터가 표시됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 서브모드 3: 343명 애널리스트 성향/편향 레이더                                 */}
      {/* ========================================================================= */}
      {activeSubMode === 'analyst_bias' && (
        <div className="space-y-6">
          {/* 상단 필터 및 검색 바 */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400">성향 유형 필터:</span>
              {['all', '신중형', '역발상형', '균형형', '낙관형'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setBiasFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    biasFilter === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'all' ? '전체 성향' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                value={biasSearchTerm}
                onChange={(e) => setBiasSearchTerm(e.target.value)}
                placeholder="연구원명 또는 증권사 검색..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 4분면 성향 분석 및 테이블 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 4분면 매트릭스 카드 (5컬럼) */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={14} className="text-amber-400" />
                  343명 애널리스트 4분면 성향 매트릭스
                </h4>
                <span className="text-[10px] text-slate-500">낙관 편향 vs 실제 적중률</span>
              </div>

              {/* 4분면 그리드 */}
              <div className="grid grid-cols-2 gap-3 min-h-[320px]">
                {/* 2사분면: 신중형 (낮은 낙관, 높은 적중률) */}
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 size={13} /> 신중형 (Conservative)
                    </div>
                    <div className="text-[10px] text-emerald-400/80">낮은 낙관 편향 · 고적중률 (상위 22%)</div>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-2 space-y-1">
                    <div>• <strong>김동원</strong> (KB증권, 적중률 96.8%)</div>
                    <div>• <strong>권해순</strong> (유진투자, 적중률 95.1%)</div>
                  </div>
                </div>

                {/* 1사분면: 균형형 (적정 낙관, 고적중률) */}
                <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-blue-300 flex items-center gap-1">
                      <TrendingUp size={13} /> 균형형 (Balanced)
                    </div>
                    <div className="text-[10px] text-blue-400/80">성장 스토리 입증 · 고적중률 (15%)</div>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-2 space-y-1">
                    <div>• <strong>이한결</strong> (키움증권, 적중률 97.2%)</div>
                    <div>• <strong>이승훈</strong> (신한투자, 적중률 94.2%)</div>
                  </div>
                </div>

                {/* 3사분면: 역발상형 (보수적, 하방 경고) */}
                <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-purple-300 flex items-center gap-1">
                      <ShieldCheck size={13} /> 역발상형 (Contrarian)
                    </div>
                    <div className="text-[10px] text-purple-400/80">선제적 다운그레이드 (8%)</div>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-2 space-y-1">
                    <div>• <strong>정원석</strong> (하이투자, 캐즘 경고)</div>
                    <div>• <strong>최정욱</strong> (하나증권, 충당금 경고)</div>
                  </div>
                </div>

                {/* 4사분면: 낙관형 (과도한 목표가 상향) */}
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <AlertTriangle size={13} /> 낙관형 (Aggressive)
                    </div>
                    <div className="text-[10px] text-amber-400/80">높은 목표가 괴리율 (55%)</div>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-2 space-y-1">
                    <div>• <strong>문경준</strong> (IBK투자, 편향 55%)</div>
                    <div>• <strong>박종선</strong> (유진투자, 편향 48%)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 애널리스트 편향 데이터 리스트 테이블 (7컬럼) */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Database size={14} className="text-indigo-400" />
                  연구원별 편향 및 DART 팩트체크 프로파일링 ({filteredBiasData.length}명)
                </h4>
                <span className="text-[11px] text-slate-500">2026.10.30 마감 기준</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">애널리스트</th>
                      <th className="py-2.5 px-3">담당 섹터</th>
                      <th className="py-2.5 px-3 text-center">성향</th>
                      <th className="py-2.5 px-3 text-right">적중도</th>
                      <th className="py-2.5 px-3 text-right">DART 정합</th>
                      <th className="py-2.5 px-3 text-right">낙관 편향</th>
                      <th className="py-2.5 px-3 text-center">선제 리스크 분석</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredBiasData.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedAnalystMetric(item)}
                        className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          selectedAnalystMetric?.id === item.id ? 'bg-indigo-950/40' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-white">
                          <div>{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{item.broker}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{item.sector}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.tendency.includes('신중형')
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : item.tendency.includes('역발상형')
                              ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                              : item.tendency.includes('균형형')
                              ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}>
                            {item.tendency.split('(')[0]}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                          {item.accuracyScore}점
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300">
                          {item.dartAlignment}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-amber-400">
                          {item.optimismBias}%
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const q = `${item.name} 애널리스트의 ${item.topRiskCall} 리포트와 DART 팩트체크는?`;
                              setSearchQuery(q);
                              setActiveSubMode('rag_query');
                              handleRunQuery(q);
                            }}
                            className="text-[10px] bg-slate-950 hover:bg-indigo-900 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30 flex items-center gap-1 mx-auto transition-all cursor-pointer"
                          >
                            <span>검증</span>
                            <ArrowRight size={10} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 서브모드 4: AI 알파 포트폴리오 시뮬레이터 (Verified Alpha Simulation)            */}
      {/* ========================================================================= */}
      {activeSubMode === 'alpha_portfolio' && (
        <div className="space-y-6">
          {/* 1. 상단 컨트롤 바 & 전략 / IRP 설정 */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck size={13} />
                    DART 정합도 98%+ & 오차율 상위 10% 엄선 42인 컨센서스
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    실증 백테스팅 (2025.11 ~ 2026.10)
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="text-emerald-400 w-5 h-5" />
                  AI 알파 포트폴리오 시뮬레이터 (Verified Alpha Portfolio)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  시장 마케팅성 추천이 아닌, 공시 실적 정합성과 예측 오차율이 수학적으로 검증된 고신뢰 연구원들의 공통 추천 종목으로 초과수익을 실증합니다.
                </p>
              </div>

              {/* 기간 및 IRP 스위치 컨트롤 */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 분석 기간 선택 */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setPortfolioHorizon('1y_full')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      portfolioHorizon === '1y_full'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1년 전수(12개월)
                  </button>
                  <button
                    onClick={() => setPortfolioHorizon('6m_recent')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      portfolioHorizon === '6m_recent'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    최근 6개월
                  </button>
                  <button
                    onClick={() => setPortfolioHorizon('2h_2026')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      portfolioHorizon === '2h_2026'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    26년 하반기
                  </button>
                </div>

                {/* IRP 퇴직연금 모드 스위치 */}
                <button
                  onClick={() => setApplyIRP(!applyIRP)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                    applyIRP
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Scale size={14} className={applyIRP ? 'text-emerald-400' : 'text-slate-500'} />
                  <span>IRP 퇴직연금 모드 (주식 70% 한도)</span>
                  <span className={`w-2 h-2 rounded-full ${applyIRP ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                </button>
              </div>
            </div>

            {/* IRP 안내 알림 (활성화 시) */}
            {applyIRP && (
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-300 animate-fade-in">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>근로자퇴직급여보장법 규제 준수 시뮬레이션 적용:</strong> 주식형 고신뢰 알파 자산 70% + 국채/단기자금형 안전자산 30%(연 3.6% 금리 환산)로 자동 자산배분되었습니다. 최대 낙폭(MDD)과 변동성이 대폭 완화됩니다.
                </div>
              </div>
            )}
          </div>

          {/* 2. 4대 핵심 KPI 성과 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 누적 수익률 */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>포트폴리오 누적 수익률</span>
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                +{simulationResult.cumulativeReturn}%
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span>KOSPI 벤치마크</span>
                <span className="font-mono text-slate-300">+{simulationResult.benchmarkReturn}%</span>
              </div>
            </div>

            {/* 벤치마크 대비 초과 알파 */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>코스피 대비 초과 성과 (Alpha)</span>
                <Award size={16} className="text-amber-400" />
              </div>
              <div className="text-3xl font-black text-indigo-400 font-mono tracking-tight flex items-baseline gap-1.5">
                +{simulationResult.alpha}
                <span className="text-lg text-indigo-300 font-bold">%p</span>
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span>월별 초과수익 승률</span>
                <span className="font-mono text-indigo-300 font-bold">{simulationResult.winRate}%</span>
              </div>
            </div>

            {/* 샤프 지수 */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-teal-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>위험조정 수익률 (Sharpe)</span>
                <Scale size={16} className="text-teal-400" />
              </div>
              <div className="text-3xl font-black text-teal-400 font-mono tracking-tight">
                {simulationResult.sharpeRatio}
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span>연환산 변동성</span>
                <span className="font-mono text-slate-300">{simulationResult.volatility}% (베타 {simulationResult.beta})</span>
              </div>
            </div>

            {/* 최대 낙폭 MDD */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>최대 낙폭 (Max Drawdown)</span>
                <ShieldCheck size={16} className="text-purple-400" />
              </div>
              <div className="text-3xl font-black text-purple-400 font-mono tracking-tight">
                {simulationResult.maxDrawdown}%
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span>KOSPI MDD</span>
                <span className="font-mono text-rose-400">-18.2% (방어율 3배+)</span>
              </div>
            </div>
          </div>

          {/* 3. 3대 포트폴리오 전략 선택기 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 전략 A */}
            <div
              onClick={() => setPortfolioStrategy('alpha_weighted')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                portfolioStrategy === 'alpha_weighted'
                  ? 'bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  전략 A · 시스템 추천
                </span>
                {portfolioStrategy === 'alpha_weighted' && (
                  <CheckCircle2 size={16} className="text-indigo-400" />
                )}
              </div>
              <h4 className="text-base font-bold text-white mb-1">신뢰도 가중 알파 전략</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                DART 정합도(99.5%+) 및 가중 오차율 상위 애널리스트의 점수에 비례하여 비중을 최적 가중 배분합니다.
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>예상 연간 알파</span>
                <span className="font-bold font-mono text-emerald-400">+31.6%p</span>
              </div>
            </div>

            {/* 전략 B */}
            <div
              onClick={() => setPortfolioStrategy('equal_weight')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                portfolioStrategy === 'equal_weight'
                  ? 'bg-slate-800/90 border-teal-500 shadow-lg shadow-teal-500/20 ring-1 ring-teal-500'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  전략 B · 분산 균형
                </span>
                {portfolioStrategy === 'equal_weight' && (
                  <CheckCircle2 size={16} className="text-teal-400" />
                )}
              </div>
              <h4 className="text-base font-bold text-white mb-1">동일 가중 10% 균형 전략</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                엄선된 10개 핵심 유망주에 정확히 10%씩 균등 배분하여 특정 종목 및 단일 섹터 쏠림을 완전 배제합니다.
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>예상 연간 알파</span>
                <span className="font-bold font-mono text-emerald-400">+24.1%p</span>
              </div>
            </div>

            {/* 전략 C */}
            <div
              onClick={() => setPortfolioStrategy('contrarian_defensive')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                portfolioStrategy === 'contrarian_defensive'
                  ? 'bg-slate-800/90 border-purple-500 shadow-lg shadow-purple-500/20 ring-1 ring-purple-500'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  전략 C · 리스크 방어
                </span>
                {portfolioStrategy === 'contrarian_defensive' && (
                  <CheckCircle2 size={16} className="text-purple-400" />
                )}
              </div>
              <h4 className="text-base font-bold text-white mb-1">역발상 하방방어 전략</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                시장 낙관론에 휩쓸리지 않고 리스크를 선제 경고한 역발상형 연구원 추천 및 저P/E·고배당 밸류업 비중을 확대합니다.
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>최대 낙폭(MDD) 방어</span>
                <span className="font-bold font-mono text-purple-300">-4.1%</span>
              </div>
            </div>
          </div>

          {/* 4. 성과 비교 시계열 차트 (Recharts) */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="text-indigo-400 w-5 h-5" />
                  월별 누적 수익률 비교: AI 알파 전략 vs KOSPI 벤치마크
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  2025.11 ~ 2026.10 실제 DART 공시 실적 및 시장 수정주가 기준 백테스팅
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-emerald-300">{simulationResult.strategyName.split('(')[0]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-slate-400">KOSPI 벤치마크</span>
                </div>
              </div>
            </div>

            {/* Recharts Area 차트 */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationResult.monthlySeries} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAlpha" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorKospi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="displayDate"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `${val}%`}
                    tickLine={false}
                  />
                  <ReferenceLine y={0} stroke="#475569" strokeDasharray="2 2" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[200px]">
                            <div className="font-bold text-white border-b border-slate-800 pb-1">
                              {data.displayDate} ({data.date})
                            </div>
                            <div className="flex justify-between items-center text-emerald-400 font-bold">
                              <span>AI 알파 전략:</span>
                              <span className="font-mono">+{data.activeStrategyReturn}%</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                              <span>KOSPI 지수:</span>
                              <span className="font-mono">
                                {data.kospi >= 0 ? `+${data.kospi}%` : `${data.kospi}%`}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-indigo-300 pt-1 border-t border-slate-800 font-bold">
                              <span>초과 알파(Alpha):</span>
                              <span className="font-mono">
                                {data.monthlyAlpha >= 0 ? `+${data.monthlyAlpha}%p` : `${data.monthlyAlpha}%p`}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400 text-[10px]">
                              <span>구간 최대낙폭(MDD):</span>
                              <span className="font-mono text-purple-300">{data.drawdown}%</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="activeStrategyReturn"
                    name="AI 알파 전략"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorAlpha)"
                  />
                  <Area
                    type="monotone"
                    dataKey="kospi"
                    name="KOSPI 지수"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorKospi)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5. 고신뢰 연구원 엄선 필터 및 공인 연구원 풀 요약 */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="text-indigo-400 w-4 h-4" />
                  343명 중 수학적 검증을 통과한 고신뢰 공인 연구원 풀 (42인 엄선)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  아래 3가지 엄격한 퀀트 필터를 동시 충족한 상위 12.2% 연구원들의 추천 의견만을 집계하였습니다.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 text-slate-300 border border-slate-800">
                  통과율: <strong className="text-emerald-400">12.2%</strong> (42명 / 343명)
                </span>
              </div>
            </div>

            {/* 필터 기준 카드 3개 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">1차 정량 필터</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">DART 실적 정합도 98.0%+</div>
                <div className="text-[10px] text-slate-500 mt-1">공시 영업이익과 추정치 일치율</div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">2차 오차율 필터</div>
                <div className="text-sm font-bold text-indigo-400 mt-0.5">가중 오차율 상위 10% (≤4.5%)</div>
                <div className="text-[10px] text-slate-500 mt-1">1Q(20%)+2Q(30%)+3Q(50%) 모델</div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">3차 편향 필터</div>
                <div className="text-sm font-bold text-purple-400 mt-0.5">낙관 편향 35% 이하 (신중/역발상)</div>
                <div className="text-[10px] text-slate-500 mt-1">근거 없는 목표가 부풀리기 원천 배제</div>
              </div>
            </div>

            {/* 대표 연구원 칩 */}
            <div className="pt-2">
              <div className="text-xs text-slate-400 mb-2 font-medium">대표 참여 연구원:</div>
              <div className="flex flex-wrap gap-2">
                {SCREENED_HIGH_RELIABILITY_ANALYSTS.map((anl) => (
                  <div
                    key={anl.id}
                    className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all text-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-900/60 text-indigo-300 font-bold flex items-center justify-center text-[10px] border border-indigo-500/30">
                      {anl.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1">
                        <span>{anl.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({anl.broker})</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        DART {anl.dartAlignment}% · {anl.tendency.split('(')[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6. 포트폴리오 편입 종목 테이블 & DART 공시 팩트체크 */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="text-emerald-400 w-5 h-5" />
                  포트폴리오 구성 종목 (Top 10) 및 DART 실물 팩트체크
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  각 종목을 클릭하면 연구원들의 핵심 추천 논거, DART 공시 번호 및 리스크 완충 전략을 열람할 수 있습니다.
                </p>
              </div>
              <span className="text-xs text-slate-400">
                총 편입 비중: <strong className="text-white font-mono">100.0%</strong>
              </span>
            </div>

            {/* 편입 종목 테이블 */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-y border-slate-800">
                  <tr>
                    <th className="py-3 px-3">종목명 / 티커</th>
                    <th className="py-3 px-3">섹터 분류</th>
                    <th className="py-3 px-3 text-right">편입 비중</th>
                    <th className="py-3 px-3 text-right">누적 수익률</th>
                    <th className="py-3 px-3 text-right">P/E 배수</th>
                    <th className="py-3 px-3">추천 고신뢰 연구원</th>
                    <th className="py-3 px-3 text-center">DART 정합도</th>
                    <th className="py-3 px-3 text-center">심층 검증</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {simulationResult.holdings.map((holding) => {
                    const isSelected = selectedHolding?.id === holding.id;
                    return (
                      <tr
                        key={holding.id}
                        onClick={() => setSelectedHolding(isSelected ? null : holding)}
                        className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-950/40' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{holding.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({holding.ticker})</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal">{holding.category}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800">
                            {holding.sector}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-indigo-300">
                          {holding.weight.toFixed(1)}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                          +{holding.returnRate}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300">
                          {holding.pe}배
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {holding.recommendingAnalysts.map((a, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800"
                              >
                                {a.name}({a.broker})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                            {holding.dartAlignment}% (오차 {holding.dartErrorRate}%)
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedHolding(holding);
                            }}
                            className="text-[10px] bg-slate-950 hover:bg-indigo-900 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30 flex items-center gap-1 mx-auto transition-all cursor-pointer"
                          >
                            <span>팩트체크</span>
                            <ChevronDown size={11} className={isSelected ? 'rotate-180 transition-transform' : 'transition-transform'} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 7. 선택된 종목 심층 팩트체크 서랍 (Drawer) */}
            {selectedHolding && (
              <div className="mt-4 p-5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-4 animate-fade-in shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white">{selectedHolding.name}</span>
                      <span className="text-xs font-mono text-slate-400">({selectedHolding.ticker})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {selectedHolding.sector}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      포트폴리오 비중 <strong>{selectedHolding.weight}%</strong> · 목표주가 {selectedHolding.targetPrice.toLocaleString()}원 (현재가 {selectedHolding.currentPrice.toLocaleString()}원)
                    </div>
                  </div>

                  {/* GraphRAG 원클릭 연계 질의 버튼 */}
                  <button
                    onClick={() => {
                      setSearchQuery(selectedHolding.graphRagQuery);
                      setActiveSubMode('rag_query');
                      handleRunQuery(selectedHolding.graphRagQuery);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Search size={14} />
                    <span>GraphRAG 지식 그래프 검증</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 팩트체크 3대 세부 항목 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* 항목 1: 컨센서스 투자 논거 */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Target size={14} />
                      고신뢰 컨센서스 투자 논거
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {selectedHolding.consensusThesis}
                    </p>
                  </div>

                  {/* 항목 2: DART 공시 실물 검증 */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck size={14} />
                      DART 공시 팩트체크 (정합도 {selectedHolding.dartAlignment}%)
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {selectedHolding.keyDARTFact}
                    </p>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      추정 오차율: {selectedHolding.dartErrorRate}% (최저 오차 인증)
                    </div>
                  </div>

                  {/* 항목 3: 신중형 리스크 완충 전략 */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle size={14} />
                      신중형 연구원 리스크 완충 분석
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {selectedHolding.riskMitigation}
                    </p>
                  </div>
                </div>

                {/* 추천 참여 연구원 상세 성향 */}
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-slate-400">
                    추천 참여 연구원 점수:
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedHolding.recommendingAnalysts.map((a, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px]">
                        <span className="font-bold text-white">{a.name} ({a.broker})</span>
                        <span className="text-indigo-400 font-mono font-bold">{a.accuracyScore}점</span>
                        <span className="text-[10px] text-slate-400">[{a.tendency}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
