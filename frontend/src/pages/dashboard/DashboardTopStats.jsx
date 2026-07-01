import { Activity, CalendarDays, CheckCircle2, Database, UploadCloud, Users } from "lucide-react";

const numberFormat = new Intl.NumberFormat("uz-UZ");

function formatNumber(value) {
  return numberFormat.format(Number(value || 0));
}

export default function DashboardTopStats({ t, stats, model }) {
  const cards = [
    {
      label: t.dashboard.totalRecords,
      value: formatNumber(stats.total_records),
      meta: `${t.dashboard.days30Sub}: ${formatNumber(stats.records_last_30)}`,
      icon: Database,
      tone: "blue"
    },
    {
      label: t.dashboard.monthImport,
      value: formatNumber(stats.imported_this_month),
      meta: `${t.dashboard.days7Sub}: ${formatNumber(stats.records_last_7)}`,
      icon: CalendarDays,
      tone: "green"
    },
    {
      label: t.dashboard.uploads,
      value: formatNumber(stats.total_uploads),
      meta: `${t.dashboard.thisMonth}: ${formatNumber(stats.uploads_this_month)} • ${t.dashboard.last30}: ${formatNumber(stats.uploads_last_30)}`,
      icon: UploadCloud,
      tone: "cyan"
    },
    {
      label: t.common.operators,
      value: formatNumber(stats.active_operators),
      meta: `${t.common.total}: ${formatNumber(stats.total_operators)}`,
      icon: Users,
      tone: "violet"
    },
    {
      label: t.weeklySummary.importQuality,
      value: `${model.importSuccessRate}%`,
      meta: `${t.dashboard.imported}: ${formatNumber(model.totalImportedRows)} • ${t.upload.duplicate}: ${formatNumber(model.totalDuplicateRows)} • ${t.upload.skipped}: ${formatNumber(model.totalSkippedRows)}`,
      icon: CheckCircle2,
      tone: "amber"
    },
    {
      label: t.dashboard.fileRows,
      value: formatNumber(model.totalRowsInFiles),
      meta: `${t.dashboard.processedRows}: ${formatNumber(model.processedRows)}`,
      icon: Activity,
      tone: "slate"
    }
  ];

  return (
    <div className="dashboard-real-stats">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article className={`dashboard-real-card ${card.tone}`} key={card.label}>
            <div className="dashboard-real-card-top">
              <span>{card.label}</span>
              <Icon size={18} />
            </div>
            <strong>{card.value}</strong>
            <small>{card.meta}</small>
          </article>
        );
      })}
    </div>
  );
}
