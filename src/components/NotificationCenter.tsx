import React, { useState } from 'react';
import { Bell, Check, ShieldCheck, Mail, Sliders, Sparkles, Filter, CheckCircle2, Trash2, Smartphone, Send, AlertTriangle } from 'lucide-react';
import { Analyst, NotificationItem, NotificationSetting, SectorCategory } from '../types';

interface NotificationCenterProps {
  settings: NotificationSetting;
  onUpdateSettings: (newSettings: NotificationSetting) => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onTriggerTestNotification: () => void;
  analysts: Analyst[];
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  settings,
  onUpdateSettings,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onTriggerTestNotification,
  analysts,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'settings'>('feed');
  const [feedFilter, setFeedFilter] = useState<string>('ALL');

  const allSectors: SectorCategory[] = [
    '반도체/디스플레이',
    '바이오/제약/헬스케어',
    '2차전지/배터리/소재',
    '자동차/모빌리티',
    'IT/모바일/전자',
    '금융/지주',
  ];

  const handleToggleSector = (sector: SectorCategory) => {
    const isSubscribed = settings.subscribedSectors.includes(sector);
    let updated: SectorCategory[];
    if (isSubscribed) {
      updated = settings.subscribedSectors.filter((s) => s !== sector);
    } else {
      updated = [...settings.subscribedSectors, sector];
    }
    onUpdateSettings({ ...settings, subscribedSectors: updated });
  };

  const handleToggleAnalyst = (analystId: string) => {
    const isFollowed = settings.followedAnalystIds.includes(analystId);
    let updated: string[];
    if (isFollowed) {
      updated = settings.followedAnalystIds.filter((id) => id !== analystId);
    } else {
      updated = [...settings.followedAnalystIds, analystId];
    }
    onUpdateSettings({ ...settings, followedAnalystIds: updated });
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (feedFilter === 'ALL') return true;
    if (feedFilter === 'UNREAD') return !notif.read;
    return notif.type === feedFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">사용자 맞춤형 알림 & 정보 피드</h2>
            {unreadCount > 0 && (
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                신규 알림 {unreadCount}건
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            구독 분야 신규 리포트, 목표가 10% 이상 변동, 투자의견 변경, 베스트 애널리스트 랭킹 갱신 실시간 알림
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'feed'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            알림 피드 ({notifications.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            맞춤 구독 설정
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'feed' ? (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center space-x-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => setFeedFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg ${feedFilter === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}
              >
                전체
              </button>
              <button
                onClick={() => setFeedFilter('UNREAD')}
                className={`px-2.5 py-1 rounded-lg ${feedFilter === 'UNREAD' ? 'bg-slate-800 text-rose-300 font-bold' : 'text-slate-400'}`}
              >
                미확인
              </button>
              <button
                onClick={() => setFeedFilter('TARGET_PRICE_CHANGE')}
                className={`px-2.5 py-1 rounded-lg ${feedFilter === 'TARGET_PRICE_CHANGE' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400'}`}
              >
                목표가 변동
              </button>
              <button
                onClick={() => setFeedFilter('BEST_ANALYST_UPDATE')}
                className={`px-2.5 py-1 rounded-lg ${feedFilter === 'BEST_ANALYST_UPDATE' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400'}`}
              >
                랭킹 변동
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={onTriggerTestNotification}
                className="flex items-center space-x-1.5 bg-indigo-950 border border-indigo-800 hover:bg-indigo-900 text-indigo-300 px-3 py-1.5 rounded-lg font-semibold transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>알림 시뮬레이션 테스트</span>
              </button>

              <button
                onClick={onMarkAllAsRead}
                className="text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-800"
              >
                모두 읽음
              </button>

              <button
                onClick={onClearAll}
                className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/40"
                title="모두 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications Feed List */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <Bell className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">표시할 알림이 없습니다.</p>
              <p className="text-xs text-slate-500 mt-1">상단의 "알림 시뮬레이션 테스트"를 눌러 실시간 알림을 생성할 수 있습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                      : 'bg-slate-900 border-blue-500/40 text-slate-200 shadow-md shadow-blue-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                        {notif.type === 'TARGET_PRICE_CHANGE' && <Sparkles className="w-4 h-4 text-cyan-400" />}
                        {notif.type === 'BEST_ANALYST_UPDATE' && <Bell className="w-4 h-4 text-amber-400" />}
                        {notif.type === 'NEW_REPORT' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {notif.type === 'OBJECTIVITY_WARNING' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-xs font-bold ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          )}
                        </div>
                        <p className="text-xs mt-1 text-slate-300 leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1.5 block">{notif.timestamp}</span>
                      </div>
                    </div>

                    {!notif.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notif.id);
                        }}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded"
                      >
                        읽음 표시
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Personalized Settings Panel */
        <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          {/* Subscribed Sectors */}
          <div className="space-y-3 pb-6 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>관심 분야 알림 구독 (Sector Subscriptions)</span>
            </h3>
            <p className="text-xs text-slate-400">선택한 분야의 신규 리포트 발행 및 분석 완료 시 즉시 알림을 수신합니다.</p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {allSectors.map((sector) => {
                const isSub = settings.subscribedSectors.includes(sector);
                return (
                  <button
                    key={sector}
                    onClick={() => handleToggleSector(sector)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSub
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{sector}</span>
                    {isSub && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Followed Top Analysts */}
          <div className="space-y-3 pb-6 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>관심 애널리스트 구독 (Follow Top Analysts)</span>
            </h3>
            <p className="text-xs text-slate-400">구독 중인 애널리스트의 신규 보고서 발간 시 알림을 받습니다.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {analysts.map((analyst) => {
                const isFollowed = settings.followedAnalystIds.includes(analyst.id);
                return (
                  <div
                    key={analyst.id}
                    onClick={() => handleToggleAnalyst(analyst.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isFollowed
                        ? 'bg-slate-950 border-amber-500/50 shadow-md shadow-amber-500/5'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={analyst.avatarUrl}
                        alt={analyst.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <div className="font-bold text-xs text-white">{analyst.name} 연구원</div>
                        <div className="text-[10px] text-slate-400">{analyst.brokerName} | {analyst.sector}</div>
                      </div>
                    </div>

                    <button
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isFollowed
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isFollowed ? '구독 중' : '구독하기'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alert Threshold Rules */}
          <div className="space-y-3 pb-6 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>알림 트리거 조건 설정 (Trigger Rules)</span>
            </h3>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200">목표주가 변동 임계치</span>
                  <p className="text-[11px] text-slate-400">제시 목표가 변동률이 설정값 이상일 때 알림 발송</p>
                </div>
                <select
                  value={settings.targetPriceChangeThresholdPercent}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, targetPriceChangeThresholdPercent: Number(e.target.value) })
                  }
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white"
                >
                  <option value={5}>5% 이상 변동 시</option>
                  <option value={10}>10% 이상 변동 시</option>
                  <option value={15}>15% 이상 변동 시</option>
                  <option value={20}>20% 이상 변동 시</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div>
                  <span className="font-bold text-slate-200">투자의견 변경 알림 (Upgrade / Downgrade)</span>
                  <p className="text-[11px] text-slate-400">매수 → 중립, 중립 → 강력매수 등 의견 변경 시 알림</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyRatingChanges}
                  onChange={(e) => onUpdateSettings({ ...settings, notifyRatingChanges: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div>
                  <span className="font-bold text-slate-200">AI 객관성 낮음 경고 알림</span>
                  <p className="text-[11px] text-slate-400">LLM 공정성 검증 결과 60점 미만 편향 리포트 시 알림</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyLowObjectivityAlert}
                  onChange={(e) => onUpdateSettings({ ...settings, notifyLowObjectivityAlert: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Email Digest Frequency */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>이메일 리포트 다이제스트 발송 주기</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {(['IMMEDIATE', 'DAILY', 'WEEKLY'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => onUpdateSettings({ ...settings, emailDigestFrequency: freq })}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    settings.emailDigestFrequency === freq
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {freq === 'IMMEDIATE' && '실시간 즉시 발송'}
                  {freq === 'DAILY' && '매일 아침 8시 다이제스트'}
                  {freq === 'WEEKLY' && '매주 월요일 주간 리포트'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
