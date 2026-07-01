import { Activity, Database, MapPin, UploadCloud, UserRound } from "lucide-react";
import { useI18n } from "../../localization/i18n.jsx";

const numberFormat = new Intl.NumberFormat("uz-UZ");

function formatNumber(value) {
  return numberFormat.format(Number(value || 0));
}

export default function WeeklyActivitySummaryPanel({ stats, model, isOperatorView = false }) {
  const { t, fmt } = useI18n();
  const topPerson = model.topOperator?.full_name || model.topOperator?.username || "-";
  const topArea = model.topRegion?.region || model.organizationRegionSummary?.[0]?.region || "-";

  const items = [
    {
      label: t.weeklySummary.records7,
      value: formatNumber(stats.records_last_7),
      meta: fmt(t.weeklySummary.days30Meta, { count: formatNumber(stats.records_last_30) }),
      icon: Database
    },
    {
      label: t.weeklySummary.uploads7,
      value: formatNumber(stats.uploads_last_7),
      meta: fmt(t.weeklySummary.thisMonthMeta, { count: formatNumber(stats.uploads_this_month) }),
      icon: UploadCloud
    },
    {
      label: isOperatorView ? t.common.region : t.dashboard.topOperator,
      value: isOperatorView ? topArea : topPerson,
      meta: isOperatorView ? t.weeklySummary.assignedScope : t.weeklySummary.last30Scope,
      icon: isOperatorView ? MapPin : UserRound
    },
    {
      label: t.weeklySummary.importQuality,
      value: `${model.importSuccessRate || 0}%`,
      meta: fmt(t.weeklySummary.importMeta, { count: formatNumber(model.totalImportedRows) }),
      icon: Activity
    }
  ];

  return (
    <section className="panel dashboard-panel weekly-summary-panel">
      <div className="panel-heading split">
        <div>
          <p className="panel-kicker">{t.weeklySummary.kicker}</p>
          <h2>{t.weeklySummary.title}</h2>
        </div>
      </div>

      <div className="weekly-summary-grid">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article className="weekly-summary-item" key={item.label}>
              <span className="weekly-summary-icon">
                <Icon size={16} strokeWidth={1.8} />
              </span>
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.meta}</small>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
