import { CalendarDays } from "lucide-react";

import GithubHeatmap from "../../components/GithubHeatmap.jsx";
import { useI18n } from "../../localization/i18n.jsx";

export default function ActivityHeatmapPanel({
  data = [],
  title,
  kicker,
  description,
  badgeText,
  densityLabel = "",
  scopeLabel = "",
  tone = "manager"
}) {
  const { t } = useI18n();
  const resolvedDensityLabel = densityLabel || t.dashboard.weeklyDensity;

  return (
    <section className={`panel dashboard-panel dashboard-heatmap-panel dashboard-heatmap-${tone}`}>
      <div className="panel-heading split">
        <div className="dashboard-heatmap-title-row">
          <span className="dashboard-heatmap-icon">
            <CalendarDays size={18} strokeWidth={1.8} />
          </span>
          <div>
            <p className="panel-kicker">{kicker}</p>
            <h2>{title}</h2>
          </div>
        </div>
        {badgeText && (
          <span className="panel-badge secondary">
            {badgeText}
          </span>
        )}
      </div>

      <div className="dashboard-heatmap-body">
        <div className="dashboard-heatmap-body-head">
          <div>
            <span>{resolvedDensityLabel}</span>
            {description && <p>{description}</p>}
          </div>
          {scopeLabel && <span className="dashboard-heatmap-scope">{scopeLabel}</span>}
          <div className="dashboard-heatmap-legend">
            <span>{t.dashboard.less}</span>
            <i className="heatmap-cell level-0" />
            <i className="heatmap-cell level-1" />
            <i className="heatmap-cell level-2" />
            <i className="heatmap-cell level-3" />
            <i className="heatmap-cell level-4" />
            <span>{t.dashboard.more}</span>
          </div>
        </div>

        <GithubHeatmap data={data} days={7} />
      </div>
    </section>
  );
}
