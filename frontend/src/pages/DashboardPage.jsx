import { useEffect, useState } from "react";

import {
  Calendar,
  Clock,
  Database,
  LayoutDashboard,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Upload,
  Users
} from "lucide-react";

import api from "../api/client.js";
import PageHero from "../components/PageHero.jsx";
import StatCard from "../components/StatCard.jsx";
import { useI18n } from "../localization/i18n.jsx";
import { formatDateTime } from "../utils/format.js";

export default function DashboardPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/records/stats/")
      .then((response) => setStats(response.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="screen-message">{t.dashboard.loading}</div>;
  }

  const daySeries = stats.records_by_day_30 || stats.records_by_day || [];
  const maxDay = Math.max(...daySeries.map((item) => item.count), 1);
  const mobile = stats.source_summary?.mobile || {};
  const internet = stats.source_summary?.internet || {};
  const missingYesterday = stats.upload_alerts?.missing_yesterday || [];
  const operatorRanking = stats.operator_ranking || [];
  const recentBatches = stats.recent_batches || [];
  const regionSummary = stats.region_summary || [];
  const statusSummary = stats.status_summary || [];
  const sourceSummary = Object.entries(stats.source_summary || {}).map(([sourceType, item]) => ({
    sourceType,
    ...item
  }));
  const totalSourceRecords = sourceSummary.reduce((sum, item) => sum + (item.records || 0), 0) || 0;
  const topOperator = operatorRanking[0];
  const topRegion = regionSummary[0];
  const topStatus = statusSummary[0];

  const topStats = [
    {
      label: t.dashboard.totalRecords,
      value: stats.total_records,
      tone: "teal",
      icon: Database,
      subtitle: `${t.dashboard.operatorsPrefix}: ${stats.total_operators || 0}`
    },
    {
      label: t.dashboard.uploads,
      value: stats.total_uploads,
      tone: "amber",
      icon: Upload,
      subtitle: `${t.dashboard.lastUploadPrefix}: ${stats.last_upload_by || "-"}`
    },
    {
      label: t.dashboard.monthImport,
      value: stats.imported_this_month,
      tone: "green",
      icon: Calendar,
      subtitle: t.dashboard.last30Sub
    },
    {
      label: t.dashboard.last7,
      value: stats.records_last_7,
      tone: "teal",
      icon: Clock,
      subtitle: t.dashboard.days7Sub
    },
    {
      label: t.dashboard.last30,
      value: stats.records_last_30,
      tone: "amber",
      icon: Calendar,
      subtitle: t.dashboard.days30Sub
    }
  ];

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
        <header className="dashboard-header">
          <div>
            <p className="eyebrow dashboard-eyebrow">Reestr Telecom</p>
            <h2>{t.dashboard.introTitle}</h2>
            <p className="dashboard-intro">
              {t.dashboard.intro}
            </p>
          </div>
        </header>

        {missingYesterday.length > 0 && (
          <section className="alert-panel dashboard-alert">
            <div className="alert-panel-title">
              <ShieldCheck size={18} />
              <h2>{t.dashboard.missingYesterday}</h2>
            </div>
            <p>{stats.upload_alerts.date}</p>
            <div>
              {missingYesterday.map((operator) => (
                <span key={operator.id}>{operator.full_name}</span>
              ))}
            </div>
          </section>
        )}

        <div className="dashboard-grid">
          <div className="dashboard-main-column">
            <div className="stats-grid dashboard-stats">
              {topStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="dashboard-panels">
              <section className="panel dashboard-panel large-panel">
                <div className="panel-heading split">
                  <div>
                    <p className="panel-kicker">{t.dashboard.trend}</p>
                    <h2>{t.dashboard.last30Import}</h2>
                  </div>
                  <span className="panel-badge">{stats.records_last_30 || 0} {t.common.itemSuffix} {t.common.recordsWord}</span>
                </div>
                <div className="bar-list dashboard-bars">
                  {daySeries.length === 0 && <p className="empty-text">{t.dashboard.noImportsMonth}</p>}
                  {daySeries.map((item) => (
                    <div className="bar-row" key={item.date}>
                      <span>{item.date}</span>
                      <div className="bar-track">
                        <div style={{ width: `${(item.count / maxDay) * 100}%` }} />
                      </div>
                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel dashboard-panel split-panel">
                <div className="panel-heading split">
                  <div>
                    <p className="panel-kicker">{t.dashboard.sections}</p>
                    <h2>{t.dashboard.mobileInternet}</h2>
                  </div>
                  <MapPinned size={18} />
                </div>
                <div className="type-grid dashboard-type-grid">
                  <section className="type-panel mobile">
                    <h2>{t.source.mobile}</h2>
                    <div>
                      <span>{t.dashboard.registry}</span>
                      <strong>{mobile.records || 0}</strong>
                    </div>
                    <div>
                      <span>{t.dashboard.upload}</span>
                      <strong>{mobile.uploads || 0}</strong>
                    </div>
                    <div>
                      <span>{t.dashboard.thisMonth}</span>
                      <strong>{mobile.imported_this_month || 0}</strong>
                    </div>
                  </section>
                  <section className="type-panel internet">
                    <h2>{t.source.internet}</h2>
                    <div>
                      <span>{t.dashboard.registry}</span>
                      <strong>{internet.records || 0}</strong>
                    </div>
                    <div>
                      <span>{t.dashboard.upload}</span>
                      <strong>{internet.uploads || 0}</strong>
                    </div>
                    <div>
                      <span>{t.dashboard.thisMonth}</span>
                      <strong>{internet.imported_this_month || 0}</strong>
                    </div>
                  </section>
                </div>
              </section>

              <section className="panel dashboard-panel">
                <div className="panel-heading split">
                  <div>
                    <p className="panel-kicker">{t.dashboard.table}</p>
                    <h2>{t.dashboard.recentUploads}</h2>
                  </div>
                  <span className="panel-badge secondary">{recentBatches.length} {t.common.batchWord}</span>
                </div>
                <div className="table-wrap compact dashboard-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{t.common.file}</th>
                        <th>{t.common.operator}</th>
                        <th>{t.dashboard.imported}</th>
                        <th>{t.common.date}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBatches.map((batch) => (
                        <tr key={batch.id}>
                          <td>{batch.original_filename}</td>
                          <td>{batch.uploaded_by_username}</td>
                          <td>{batch.imported_count}</td>
                          <td>{formatDateTime(batch.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>

          <aside className="dashboard-side-column">
            <section className="panel dashboard-panel source-panel">
              <div className="panel-heading split">
                <div>
                  <p className="panel-kicker">{t.dashboard.source}</p>
                  <h2>{t.dashboard.sourceSummary}</h2>
                </div>
                <Sparkles size={18} />
              </div>
              <div className="source-overview">
                <div className="source-total">
                  <span>{t.dashboard.totalSourceRecord}</span>
                  <strong>{totalSourceRecords}</strong>
                </div>
                <div className="summary-list source-summary">
                  {sourceSummary.length > 0 ? (
                    sourceSummary.map((item) => {
                      const share = totalSourceRecords > 0 ? Math.round((item.records / totalSourceRecords) * 100) : 0;
                      return (
                        <div className="source-row" key={item.sourceType}>
                          <div className="summary-row">
                            <span>{item.sourceType === "mobile" ? t.source.mobile : t.source.internet}</span>
                            <strong>{item.records || 0}</strong>
                          </div>
                          <div className="source-meta">
                            <span>{t.dashboard.sourceUploads}: {item.uploads || 0}</span>
                            <span>{t.dashboard.sourceMonth}: {item.imported_this_month || 0}</span>
                            <span>{share}%</span>
                          </div>
                          <div className="bar-track source-track">
                            <div style={{ width: `${share}%` }} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="empty-text">{t.dashboard.sourceNoData}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="panel dashboard-panel live-panel">
              <div className="panel-heading split">
                <div>
                  <p className="panel-kicker">{t.dashboard.state}</p>
                  <h2>{t.dashboard.realtime}</h2>
                </div>
                <ShieldCheck size={18} />
              </div>
              <div className="live-metrics">
                <div className="live-metric">
                  <span>{t.dashboard.missingCount}</span>
                  <strong>{missingYesterday.length}</strong>
                </div>
                <div className="live-metric">
                  <span>{t.dashboard.last30Sub}</span>
                  <strong>{stats.records_last_30 || 0}</strong>
                </div>
                <div className="live-metric">
                  <span>{t.dashboard.topOperator}</span>
                  <strong>{topOperator ? topOperator.full_name : "-"}</strong>
                  {topOperator && <small>{topOperator.records_count} {t.common.recordsWord}</small>}
                </div>
                <div className="live-metric">
                  <span>{t.dashboard.topRegion}</span>
                  <strong>{topRegion ? topRegion.region : "-"}</strong>
                  {topRegion && <small>{topRegion.count} {t.common.recordsWord}</small>}
                </div>
                <div className="live-metric">
                  <span>{t.dashboard.topStatus}</span>
                  <strong>{topStatus ? topStatus.status : "-"}</strong>
                  {topStatus && <small>{topStatus.count} {t.common.recordsWord}</small>}
                </div>
              </div>
              <div className="summary-list mini-ranking">
                {operatorRanking.length > 0 ? (
                  operatorRanking.slice(0, 5).map((operator, index) => (
                    <div className="summary-row ranking-row" key={operator.id}>
                      <span>
                        {index + 1}. {operator.full_name}
                      </span>
                      <strong>{operator.records_count}</strong>
                    </div>
                  ))
                ) : (
                  <p className="empty-text">{t.dashboard.noOperatorRating}</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
