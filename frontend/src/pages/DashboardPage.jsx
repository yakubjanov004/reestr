import { useState, useEffect } from "react";
import {
  Calendar,
  Database,
  LayoutDashboard,
  Upload,
  Users
} from "lucide-react";

import { useAuth } from "../auth/AuthContext.jsx";
import PageHero from "../components/PageHero.jsx";
import { useI18n } from "../localization/i18n.jsx";
import BreakdownPanel from "./dashboard/BreakdownPanel.jsx";
import DashboardTopStats from "./dashboard/DashboardTopStats.jsx";
import DashboardWelcome from "./dashboard/DashboardWelcome.jsx";
import LiveMetricsPanel from "./dashboard/LiveMetricsPanel.jsx";
import MissingUploadsAlert from "./dashboard/MissingUploadsAlert.jsx";
import RecentUploadsPanel from "./dashboard/RecentUploadsPanel.jsx";
import SourceSummaryPanel from "./dashboard/SourceSummaryPanel.jsx";
import TrendPanel from "./dashboard/TrendPanel.jsx";
import OperatorListPanel from "./dashboard/OperatorListPanel.jsx";
import { createDashboardModel } from "./dashboard/dashboardModel.js";
import { useDashboardData } from "./dashboard/useDashboardData.js";
import api from "../api/client.js";

export default function DashboardPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedOperatorId, setSelectedOperatorId] = useState("");
  const { stats, loading } = useDashboardData(selectedOperatorId);

  if (loading && !stats) {
    return <div className="screen-message">{t.dashboard.loading}</div>;
  }

  const model = createDashboardModel(stats);
  const isManager = user?.role === "manager" || user?.is_superuser;

  return (
    <section className="page-stack dashboard-page">
      <PageHero
        kicker={t.dashboard.heroKicker}
        title={t.dashboard.heroTitle}
        description={t.dashboard.heroDescription}
        icon={LayoutDashboard}
        stats={[
          { label: t.dashboard.totalRecords, value: stats.total_records, icon: Database },
          { label: t.dashboard.uploads, value: stats.total_uploads, icon: Upload },
          { label: t.common.operators, value: stats.total_operators || 0, icon: Users },
          { label: t.dashboard.last30, value: stats.records_last_30 || 0, icon: Calendar }
        ]}
      />

      <div className="dashboard-frame dashboard-board">
        {isManager && (
          <div className="premium-tabs-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
            <div className="operator-filter" style={{ minWidth: '240px' }}>
              <select 
                className="premium-input" 
                value={selectedOperatorId} 
                onChange={(e) => setSelectedOperatorId(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: '#fff' }}
              >
                <option value="">Barcha operatorlar (Umumiy)</option>
                {model.operators && model.operators.map(op => (
                  <option key={op.id} value={op.id}>
                    {op.full_name || op.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <DashboardWelcome t={t} user={user} />

        <div className="dashboard-main-column">
          <DashboardTopStats t={t} stats={stats} model={model} />
          
          <div className="dashboard-real-grid">
            <TrendPanel
              t={t}
              stats={stats}
              daySeries={model.daySeries}
              maxDay={model.maxDay}
            />
            <SourceSummaryPanel
              t={t}
              sourceSummary={model.sourceSummary}
              totalSourceRecords={model.totalSourceRecords}
            />
          </div>

          <div className="dashboard-real-grid dashboard-real-grid-two">
            <BreakdownPanel
              kicker="Hudud"
              title="Hududlar bo'yicha reestr"
              items={model.regionSummary}
              labelField="region"
              emptyText="Hudud bo'yicha ma'lumot yo'q."
            />
            <BreakdownPanel
              kicker="Status"
              title="Statuslar bo'yicha reestr"
              items={model.statusSummary}
              labelField="status"
              emptyText="Status bo'yicha ma'lumot yo'q."
            />
          </div>

          {isManager && (
            <>
              <div className="dashboard-real-grid">
                <LiveMetricsPanel
                  t={t}
                  stats={stats}
                  missingYesterday={model.missingYesterday}
                  operatorRanking={model.operatorRanking}
                  topOperator={model.topOperator}
                  topRegion={model.topRegion}
                  topStatus={model.topStatus}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <MissingUploadsAlert t={t} stats={stats} missingYesterday={model.missingYesterday} />
                  <RecentUploadsPanel t={t} recentBatches={model.recentBatches} />
                </div>
              </div>

              {selectedOperatorId === "" && (
                <OperatorListPanel t={t} operators={model.operators} />
              )}
            </>
          )}

          {!isManager && (
            <div className="dashboard-panels">
              <RecentUploadsPanel t={t} recentBatches={model.recentBatches} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
