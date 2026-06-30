import {
  BarChart3,
  BookOpenText,
  Building2,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  History,
  ListChecks,
  ScrollText,
  Search,
  UploadCloud,
  UserCog,
  Users
} from "lucide-react";

import { useAuth } from "../../auth/AuthContext.jsx";
import {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  effectiveRole,
  roleLabel
} from "../../auth/roles.js";
import { GUIDE_TRANSLATIONS } from "../../localization/guide.js";
import { useI18n } from "../../localization/i18n.jsx";

/* ── Icon map ── */
const STEP_ICONS = {
  upload: UploadCloud,
  result: CheckCircle2,
  records: Search,
  dashboard: BarChart3,
  users: UserCog,
  audit: ScrollText,
  batches: History
};

/* ── Gradient per role ── */
const ROLE_GRADIENTS = {
  [ROLE_OPERATOR]: "var(--brand-gradient)",
  [ROLE_SUPERVISOR]: "var(--brand-gradient)",
  [ROLE_MANAGER]: "var(--brand-gradient)",
  [ROLE_ADMIN]: "var(--brand-gradient)"
};

const ROLE_HERO_ICONS = {
  [ROLE_OPERATOR]: UploadCloud,
  [ROLE_SUPERVISOR]: UserCog,
  [ROLE_MANAGER]: Building2,
  [ROLE_ADMIN]: Building2
};

/* ── Mini Browser Preview ── */
function MiniBrowser({ title, children }) {
  return (
    <div className="guide-shot" aria-label={title}>
      <div className="guide-shot-bar">
        <span />
        <span />
        <span />
        <strong>{title}</strong>
      </div>
      <div className="guide-shot-body">
        {children}
      </div>
    </div>
  );
}

/* ── Screenshot Mocks ── */
function ScreenshotMock({ type, copy }) {
  const s = copy.screen[type];
  if (!s) return null;

  if (type === "upload") {
    return (
      <MiniBrowser title={s.title}>
        <div className="guide-shot-heading">
          <strong>{s.title}</strong>
          <small>{s.source}</small>
        </div>
        <div className="guide-pill-row">
          <span className="active">{s.mobile}</span>
          <span>{s.internet}</span>
        </div>
        <div className="guide-drop-preview">
          <FileSpreadsheet size={24} />
          <span>{s.drop}</span>
        </div>
        <div className="guide-shot-button">{s.action}</div>
      </MiniBrowser>
    );
  }

  if (type === "result") {
    return (
      <MiniBrowser title={s.title}>
        <div className="guide-shot-heading">
          <strong>{s.title}</strong>
          <small>reestr_mobile.xlsx</small>
        </div>
        <div className="guide-metric-grid">
          <span><strong>124</strong>{s.imported}</span>
          <span><strong>8</strong>{s.duplicate}</span>
          <span><strong>3</strong>{s.skipped}</span>
          <span><strong>1</strong>{s.issues}</span>
        </div>
      </MiniBrowser>
    );
  }

  if (type === "records") {
    return (
      <MiniBrowser title={s.title}>
        <div className="guide-search-preview">{s.search}</div>
        <div className="guide-table-preview">
          <div>
            {s.columns.map((column) => <span key={column}>{column}</span>)}
          </div>
          <div><span>Abd***</span><span>Mobil</span><span>Toshkent</span><span>OK</span><span>23.06</span></div>
          <div><span>Kar***</span><span>Internet</span><span>Samarqand</span><span>OK</span><span>23.06</span></div>
        </div>
      </MiniBrowser>
    );
  }

  if (type === "dashboard") {
    return (
      <MiniBrowser title={s.title}>
        <div className="guide-card-grid">
          {s.cards.map((card, index) => (
            <span key={card}><strong>{[1240, 42, 9, 318][index]}</strong>{card}</span>
          ))}
        </div>
        <div className="guide-bars-preview">
          <span style={{ width: "82%" }} />
          <span style={{ width: "58%" }} />
          <span style={{ width: "71%" }} />
        </div>
      </MiniBrowser>
    );
  }

  if (type === "users") {
    return (
      <MiniBrowser title={s.title}>
        <div className="guide-users-preview">
          <div>
            <strong>{s.form}</strong>
            <span />
            <span />
            <span className="button" />
          </div>
          <div>
            <strong>{s.table}</strong>
            <span />
            <span />
            <span />
          </div>
        </div>
      </MiniBrowser>
    );
  }

  if (type === "audit" || type === "batches") {
    return (
      <MiniBrowser title={s.title}>
        <div className="guide-shot-heading">
          <strong>{s.title}</strong>
          <small>{copy.screen.browserTitle}</small>
        </div>
        <div className="guide-table-preview compact">
          <div>
            {s.columns.map((column) => <span key={column}>{column}</span>)}
          </div>
          <div><span>23.06</span><span>admin</span><span>Import</span><span>OK</span></div>
          <div><span>23.06</span><span>operator</span><span>Login</span><span>IP</span></div>
        </div>
      </MiniBrowser>
    );
  }

  return null;
}

/* ── Main Component ── */
export default function GuidePage() {
  const { user } = useAuth();
  const { language, t } = useI18n();
  const copy = GUIDE_TRANSLATIONS[language] || GUIDE_TRANSLATIONS.uz;
  const userRole = effectiveRole(user) || ROLE_OPERATOR;
  const activeRole = copy.roles[userRole] ? userRole : ROLE_OPERATOR;
  const guide = copy.roles[activeRole] || copy.roles[ROLE_OPERATOR];
  const visibleSteps = guide.steps.filter((step) => step.screen !== "privacy" && step.icon !== "privacy");
  const HeroIcon = ROLE_HERO_ICONS[activeRole] || BookOpenText;
  const gradient = ROLE_GRADIENTS[activeRole] || ROLE_GRADIENTS[ROLE_OPERATOR];

  return (
    <section className="page-stack guide-page">

      {/* ── Hero Banner (rolga qarab gradient) ── */}
      <div className="guide-hero-banner" style={{ background: gradient }}>
        <div className="guide-hero-content">
          <div className="guide-hero-icon-wrap">
            <HeroIcon size={26} strokeWidth={1.5} />
          </div>
          <div>
            <span className="guide-hero-kicker">{copy.heroKicker}</span>
            <h1>{guide.title}</h1>
            <p>{guide.intro}</p>
          </div>
        </div>
        <div className="guide-hero-stats">
          <div className="guide-hero-stat">
            <strong>{roleLabel(t, activeRole)}</strong>
            <small>{copy.stats.roles}</small>
          </div>
          <div className="guide-hero-stat">
            <strong>{visibleSteps.length}</strong>
            <small>{copy.stats.steps}</small>
          </div>
          <div className="guide-hero-stat">
            <strong>UZ/RU</strong>
            <small>{copy.stats.language}</small>
          </div>
        </div>
        <div className="guide-hero-decoration">
          <div className="gd-circle gd-circle-1" />
          <div className="gd-circle gd-circle-2" />
        </div>
      </div>

      {/* ── Checklist ── */}
      <section className="panel guide-checklist-panel">
        <div className="guide-checklist-head">
          <div>
            <h2>{guide.checklistTitle}</h2>
            <p>{copy.description || "Tizimdan foydalanish bo'yicha ketma-ket qadamlar."}</p>
          </div>
          <ListChecks size={20} className="guide-checklist-icon" />
        </div>
        <div className="guide-checklist-items">
          {guide.checklist.map((item, index) => (
            <div className="guide-checklist-row" key={index}>
              <div className="guide-checklist-num">{index + 1}</div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Step-by-step cards (timeline) ── */}
      <div className="guide-timeline">
        {visibleSteps.map((step, index) => {
          const Icon = STEP_ICONS[step.icon] || BookOpenText;
          return (
            <article className="guide-timeline-card" key={step.title}>
              {/* Timeline connector */}
              <div className="guide-timeline-line">
                <div className="guide-timeline-dot">
                  <span>{index + 1}</span>
                </div>
                {index < visibleSteps.length - 1 && <div className="guide-timeline-connector" />}
              </div>

              {/* Content */}
              <div className="panel guide-timeline-body">
                <div className="guide-timeline-copy">
                  <span className="guide-step-icon">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </div>
                <ScreenshotMock type={step.screen} copy={copy} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
