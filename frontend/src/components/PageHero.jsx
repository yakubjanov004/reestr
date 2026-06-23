import { ShieldCheck } from "lucide-react";

export default function PageHero({
  kicker,
  title,
  description,
  icon: Icon = ShieldCheck,
  stats = []
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-main">
        <span className="page-hero-kicker">
          <Icon size={18} />
          {kicker}
        </span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {stats.length > 0 && (
        <div className="page-hero-stats">
          {stats.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <div className="page-hero-stat" key={stat.label}>
                {StatIcon && (
                  <span className="page-hero-stat-icon">
                    <StatIcon size={17} />
                  </span>
                )}
                <div>
                  <strong>{stat.value ?? 0}</strong>
                  <small>{stat.label}</small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
