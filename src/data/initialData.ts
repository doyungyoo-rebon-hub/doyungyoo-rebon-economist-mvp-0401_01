import type { Analyst, Broker, NotificationItem, NotificationSetting, PipelineLog, PipelineMetrics, Report } from '../types.ts';

export const INITIAL_BROKERS: Broker[] = [
  { id: "b1", name: "미래에셋증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b2", name: "한국투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b3", name: "NH투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b4", name: "삼성증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b5", name: "KB증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b6", name: "신한투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b7", name: "하나증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b8", name: "메리츠증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b9", name: "키움증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b10", name: "대신증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b11", name: "현대차증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b12", name: "한화투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b13", name: "유진투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b14", name: "교보증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b15", name: "하이투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b16", name: "IBK투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b17", name: "DB금융투자", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b18", name: "BNK투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b19", name: "다올투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b20", name: "iM증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b21", name: "SK증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b22", name: "상상인증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b23", name: "케이프투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b24", name: "부국증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b25", name: "신영증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b26", name: "LS증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b27", name: "DS투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b28", name: "리딩투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b29", name: "한양증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b30", name: "코리아에셋투자증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b31", name: "흥국증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 },
  { id: "b32", name: "유안타증권", reportCount: 0, lastSyncTime: "-", status: "idle", accuracyRate: 0 }
];

export const INITIAL_ANALYSTS: Analyst[] = [];

export const INITIAL_REPORTS: Report[] = [];

export const INITIAL_PIPELINE_LOGS: PipelineLog[] = [];

export const INITIAL_PIPELINE_METRICS: PipelineMetrics = {
  activeBrokersCount: 32,
  todayProcessedReports: 0,
  avgObjectivityScore: 0,
  pipelineStatus: 'IDLE',
  lastRunTimestamp: '-',
  throughputPerMinute: 0,
};

export const INITIAL_NOTIFICATION_SETTINGS: NotificationSetting = {
  enableAlerts: true,
  targetPriceChangeThresholdPercent: 10,
  notifyRatingChanges: true,
  notifyLowObjectivityAlert: true,
  subscribedSectors: ['반도체/디스플레이', '2차전지/배터리/소재', '바이오/제약/헬스케어', '자동차/모빌리티', '조선/중공업/방산'],
  followedAnalystIds: [],
  emailDigestFrequency: 'DAILY',
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

