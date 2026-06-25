import { Activity, Database, MapPin, UploadCloud, UserRound } from "lucide-react";

const numberFormat = new Intl.NumberFormat("uz-UZ");

function formatNumber(value) {
  return numberFormat.format(Number(value || 0));
}

export default function WeeklyActivitySummaryPanel({ stats, model, isOperatorView = false }) {
  const topPerson = model.topOperator?.full_name || model.topOperator?.username || "-";
  const topArea = model.topRegion?.region || model.organizationRegionSummary?.[0]?.region || "-";

  const items = [
    {
      label: "7 kunlik reestr",
      value: formatNumber(stats.records_last_7),
      meta: `30 kun: ${formatNumber(stats.records_last_30)}`,
      icon: Database
    },
    {
      label: "7 kunlik yuklash",
      value: formatNumber(stats.uploads_last_7),
      meta: `Shu oy: ${formatNumber(stats.uploads_this_month)}`,
      icon: UploadCloud
    },
    {
      label: isOperatorView ? "Hudud" : "Top operator",
      value: isOperatorView ? topArea : topPerson,
      meta: isOperatorView ? "Sizga tegishli scope" : "Oxirgi 30 kun bo'yicha",
      icon: isOperatorView ? MapPin : UserRound
    },
    {
      label: "Import sifati",
      value: `${model.importSuccessRate || 0}%`,
      meta: `Import: ${formatNumber(model.totalImportedRows)}`,
      icon: Activity
    }
  ];

  return (
    <section className="panel dashboard-panel weekly-summary-panel">
      <div className="panel-heading split">
        <div>
          <p className="panel-kicker">Haftalik xulosa</p>
          <h2>Oxirgi 7 kun ko'rsatkichlari</h2>
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
