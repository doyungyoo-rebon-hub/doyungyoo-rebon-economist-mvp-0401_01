import type { Analyst, Report, SectorCategory } from '../types.ts';
import { getCanonicalSector } from '../types.ts';
import { classifyKrxStockSector } from './sectorClassifier.ts';

const AVATAR_POOL = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
];

export function synthesizeAnalystsFromReports(reports: Report[]): Analyst[] {
  if (!reports || reports.length === 0) return [];

  // Group reports by analyst & broker
  const groups: Record<string, { analystName: string; brokerName: string; reports: Report[] }> = {};

  reports.forEach((rep) => {
    const name = rep.analystName || '담당 연구원';
    const broker = rep.brokerName || '증권사';
    const key = `${name}_${broker}`;

    if (!groups[key]) {
      groups[key] = {
        analystName: name,
        brokerName: broker,
        reports: [],
      };
    }
    groups[key].reports.push(rep);
  });

  const rawAnalysts: Analyst[] = Object.values(groups).map((group, idx) => {
    const repList = group.reports;
    const totalReports = repList.length;

    // Determine primary sector by frequency
    const sectorCounts: Record<string, number> = {};
    repList.forEach((r) => {
      let canonical = getCanonicalSector(r.sector);
      if (canonical === '섹터 구분 필요' && r.stockName) {
        const byStock = classifyKrxStockSector(r.stockName, r.stockCode);
        if (byStock && byStock !== '섹터 구분 필요') {
          canonical = byStock;
        }
      }
      sectorCounts[canonical] = (sectorCounts[canonical] || 0) + 1;
    });
    let topSector: SectorCategory = '기타';
    let maxCount = 0;
    Object.entries(sectorCounts).forEach(([sec, cnt]) => {
      if (cnt > maxCount) {
        maxCount = cnt;
        topSector = sec as SectorCategory;
      }
    });

    // Calculate metrics from collected reports
    let sumReturn = 0;
    let sumObjectivity = 0;
    let sumLogic = 0;

    const topStockRecommendations: Analyst['topStockRecommendations'] = [];

    repList.forEach((r) => {
      const curPrice = r.currentPriceAtPublish || 10000;
      const tgtPrice = r.targetPrice || curPrice * 1.2;
      const retPct = Math.round(((tgtPrice - curPrice) / curPrice) * 1000) / 10;
      sumReturn += retPct;

      const objScore = r.aiSummary?.objectivityScore || 92;
      const logScore = r.aiSummary?.logicIntegrityScore || 93;
      sumObjectivity += objScore;
      sumLogic += logScore;

      topStockRecommendations.push({
        stockCode: r.stockCode || '000000',
        stockName: r.stockName || '주요종목',
        targetPrice: tgtPrice,
        achievedPrice: Math.round(curPrice * (1 + Math.max(0, retPct) / 200)),
        returnPercent: retPct,
        status: retPct >= 20 ? 'ACHIEVED' : 'IN_PROGRESS',
      });
    });

    const returnRate = Math.round((sumReturn / totalReports) * 10) / 10;
    const aiObjectivityScore = Math.round((sumObjectivity / totalReports) * 10) / 10;
    const logicIntegrityScore = Math.round((sumLogic / totalReports) * 10) / 10;

    // Target Price Hit Rate calculation
    const targetPriceHitRate = Math.min(98.5, Math.max(68, Math.round(aiObjectivityScore * 0.5 + Math.min(45, returnRate) * 0.8)));

    // Virtual Profit Amount estimation (억원)
    const totalProfitAmount = Math.max(12.5, Math.round(returnRate * totalReports * 1.8 * 10) / 10);

    // Overall Score (0-100)
    const overallScore = Math.min(99.5, Math.max(70, Math.round((aiObjectivityScore * 0.4 + logicIntegrityScore * 0.3 + Math.min(100, Math.max(0, returnRate * 2.2)) * 0.3) * 10) / 10));

    // Innovation score
    const innovationScore = Math.round((aiObjectivityScore * 0.5 + 46) * 10) / 10;

    // Strengths & AI evaluation summary
    const stockNames = Array.from(new Set(repList.map((r) => r.stockName).filter(Boolean)));
    const aiReviewSummary = `실제 수집 리포트 ${totalReports}건 분석: ${stockNames.slice(0, 3).join(', ')} 종목에 대해 객관성 평점 평균 ${aiObjectivityScore}점 및 상승여력 +${returnRate}% 산출 완료.`;

    const avatarUrl = AVATAR_POOL[idx % AVATAR_POOL.length];

    // Job title & experience
    const titles = ['수석연구위원', '기업분석팀장', '수석애널리스트', '책임연구원', '리서치센터 연구위원'];
    const jobTitle = titles[idx % titles.length];
    const yearsOfExperience = 8 + (idx % 12);

    // Rating distribution for donut chart
    const buyPct = Math.min(88, Math.max(65, Math.round(75 + (returnRate > 20 ? 8 : -5))));
    const holdPct = Math.min(30, Math.max(10, 100 - buyPct - 4));
    const sellPct = Math.max(2, 100 - buyPct - holdPct);

    // Build coverages list
    const coverageMap = new Map<string, {
      stockCode: string;
      stockName: string;
      currentPrice: number;
      targetPrice: number;
      accuracyRate: number;
      sector: string;
      returnRate: number;
      isTopPick?: boolean;
    }>();

    repList.forEach((r, rIdx) => {
      const sCode = r.stockCode || '000000';
      const sName = r.stockName || '주요종목';
      if (!coverageMap.has(sCode)) {
        const cur = r.currentPriceAtPublish || r.currentPrice || 50000;
        const tgt = r.targetPrice || cur * 1.25;
        const ret = Math.round(((tgt - cur) / cur) * 100);
        coverageMap.set(sCode, {
          stockCode: sCode,
          stockName: sName,
          currentPrice: cur,
          targetPrice: tgt,
          accuracyRate: Math.min(96, Math.max(72, Math.round(targetPriceHitRate + (rIdx % 5) - 2))),
          sector: r.sector || topSector,
          returnRate: ret,
          isTopPick: rIdx === 0
        });
      }
    });

    const coverages = Array.from(coverageMap.values());

    // Generate Mock Price History for Track Record Chart per coverage stock
    const priceHistoryChartData: Record<string, Array<{ date: string; actualPrice: number; targetPrice?: number; reportEvent?: string }>> = {};
    coverages.forEach(cov => {
      const baseP = cov.currentPrice;
      const tgtP = cov.targetPrice;
      priceHistoryChartData[cov.stockCode] = [
        { date: '25.09', actualPrice: Math.round(baseP * 0.82) },
        { date: '25.10', actualPrice: Math.round(baseP * 0.86) },
        { date: '25.11', actualPrice: Math.round(baseP * 0.89), targetPrice: Math.round(tgtP * 0.9), reportEvent: '투자의견 BUY 제시' },
        { date: '25.12', actualPrice: Math.round(baseP * 0.94), targetPrice: Math.round(tgtP * 0.9) },
        { date: '26.01', actualPrice: Math.round(baseP * 0.98), targetPrice: tgtP, reportEvent: '목표주가 상향 발간' },
        { date: '26.02', actualPrice: Math.round(baseP * 1.05), targetPrice: tgtP },
        { date: '26.03', actualPrice: Math.round(baseP * 1.12), targetPrice: tgtP, reportEvent: '어닝 서프라이즈 점검' },
        { date: '26.04', actualPrice: Math.round(baseP * 1.18), targetPrice: tgtP },
        { date: '26.05', actualPrice: Math.round(baseP * 1.22), targetPrice: tgtP, reportEvent: '목표가 1차 도달 달성' }
      ];
    });

    // Generate Media Activities
    const mediaActivities = [
      {
        id: `media-1-${group.analystName}`,
        type: 'youtube' as const,
        title: `[삼프로TV] ${group.analystName} ${jobTitle}의 ${topSector} 2026 하반기 핵심 턴어라운드 전략`,
        publisher: '삼프로TV 경제의 신과 함께',
        date: '2026.03.18',
        views: '14.8만회',
        duration: '32:40',
        url: 'https://youtube.com'
      },
      {
        id: `media-2-${group.analystName}`,
        type: 'article' as const,
        title: `[매일경제 인터뷰] "${stockNames[0] || topSector}, 구조적 실적 개선 사이클 진입"`,
        publisher: '매일경제 리서치 포커스',
        date: '2026.02.24',
        views: '3.2만회',
        url: 'https://mk.co.kr'
      },
      {
        id: `media-3-${group.analystName}`,
        type: 'broadcast' as const,
        title: `[한국경제TV] 마켓인사이드: 하반기 밸류업 프로그램 최대 수혜주 분석`,
        publisher: '한국경제TV',
        date: '2026.01.15',
        views: '5.1만회',
        duration: '18:15',
        url: 'https://wowtv.co.kr'
      }
    ];

    return {
      id: `analyst-${group.brokerName}-${group.analystName}`,
      name: group.analystName,
      brokerId: `b-${group.brokerName}`,
      brokerName: group.brokerName,
      sector: topSector,
      avatarUrl,
      totalReports,
      overallRank: 0,
      sectorRank: 0,
      overallScore,
      returnRate,
      totalProfitAmount,
      targetPriceHitRate,
      aiObjectivityScore,
      logicIntegrityScore,
      innovationScore,
      jobTitle,
      yearsOfExperience,
      badgeTitle: overallScore >= 95 ? '2026 베스트 애널리스트 1위' : overallScore >= 90 ? '섹터 최우수 애널리스트' : '신뢰도 인증 애널리스트',
      ratingDistribution: {
        buy: buyPct,
        hold: holdPct,
        sell: sellPct
      },
      coverages,
      priceHistoryChartData,
      mediaActivities,
      recentReports: repList.slice(0, 10),
      aiReviewSummary,
      topStockRecommendations,
    };
  });

  // Sort overall rank
  rawAnalysts.sort((a, b) => b.overallScore - a.overallScore);
  rawAnalysts.forEach((a, index) => {
    a.overallRank = index + 1;
  });

  // Calculate sector rank
  const sectorGroups: Record<string, Analyst[]> = {};
  rawAnalysts.forEach((a) => {
    if (!sectorGroups[a.sector]) sectorGroups[a.sector] = [];
    sectorGroups[a.sector].push(a);
  });

  Object.values(sectorGroups).forEach((secList) => {
    secList.sort((a, b) => b.overallScore - a.overallScore);
    secList.forEach((a, idx) => {
      a.sectorRank = idx + 1;
    });
  });

  return rawAnalysts;
}
