import { ShieldCheck } from "lucide-react";

export default function MissingUploadsAlert({ t, stats, missingYesterday }) {
  if (missingYesterday.length === 0) {
    return null;
  }

  return (
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
  );
}
