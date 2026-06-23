export default function StatCard({ label, value, tone = "neutral", icon: Icon, subtitle }) {
  return (
    <div className={`stat-card ${tone}`}>
      {Icon && (
        <div className="stat-icon">
          <Icon size={18} />
        </div>
      )}
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value ?? 0}</strong>
        {subtitle && <small className="stat-sub">{subtitle}</small>}
      </div>
    </div>
  );
}
