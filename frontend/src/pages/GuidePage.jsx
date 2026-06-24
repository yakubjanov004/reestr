import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpenText,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  History,
  ListChecks,
  ScrollText,
  Search,
  ShieldCheck,
  UploadCloud,
  UserCog,
  Users
} from "lucide-react";

import { useAuth } from "../auth/AuthContext.jsx";
import { canManageUsers } from "../auth/roles.js";
import PageHero from "../components/PageHero.jsx";
import { GUIDE_TRANSLATIONS } from "../localization/guide.js";
import { useI18n } from "../localization/i18n.jsx";

const stepIcons = {
  upload: UploadCloud,
  result: CheckCircle2,
  records: Search,
  privacy: ShieldCheck,
  dashboard: BarChart3,
  users: UserCog,
  audit: ScrollText,
  batches: History
};

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

function ScreenshotMock({ type, copy }) {
  const s = copy.screen[type];

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

  if (type === "privacy") {
    return (
      <MiniBrowser title={s.title}>
        <div className="guide-shot-heading">
          <strong>{s.title}</strong>
          <small>Excel columns</small>
        </div>
        <div className="guide-rule-grid">
          <span className="red">{s.red}</span>
          <span className="yellow">{s.yellow}</span>
          <span className="white">{s.white}</span>
        </div>
        <div className="guide-rule-lines">
          <span />
          <span />
          <span />
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

export default function GuidePage() {
  const { user } = useAuth();
  const { language, t } = useI18n();
  const copy = GUIDE_TRANSLATIONS[language] || GUIDE_TRANSLATIONS.uz;
  const hasManagementAccess = canManageUsers(user);
  const defaultRole = hasManagementAccess ? "manager" : "operator";
  const [activeRole, setActiveRole] = useState(defaultRole);
  const guide = copy.roles[activeRole];
  const isManagerSection = activeRole === "manager";

  useEffect(() => {
    setActiveRole(hasManagementAccess ? "manager" : "operator");
  }, [hasManagementAccess]);

  return (
    <section className="page-stack guide-page">
      <PageHero
        kicker={copy.heroKicker}
        title={copy.title}
        description={copy.description}
        icon={BookOpenText}
        stats={[
          { label: copy.stats.roles, value: "2", icon: Users },
          { label: copy.stats.screens, value: "8", icon: Database },
          { label: copy.stats.steps, value: guide.steps.length, icon: ListChecks },
          { label: copy.stats.language, value: "UZ/RU", icon: ShieldCheck }
        ]}
      />

      <section className="panel guide-overview">
        <div className="panel-heading split">
          <h2>{copy.whatSystemDoes.title}</h2>
        </div>

        <div className="guide-overview-grid">
          <div className="guide-system-list">
            {copy.whatSystemDoes.items.map((item) => (
              <div key={item}>
                <CheckCircle2 size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="guide-checklist">
            <h3>{guide.checklistTitle}</h3>
            <ol>
              {guide.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            {isManagerSection && !hasManagementAccess && (
              <p className="guide-role-note">{copy.roleNote}</p>
            )}
          </div>
        </div>
      </section>

      <section className="guide-role-intro">
        <span className="guide-role-icon">
          {activeRole === "manager" ? <UserCog size={20} /> : <UploadCloud size={20} />}
        </span>
        <div>
          <h2>{guide.title}</h2>
          <p>{guide.intro}</p>
        </div>
      </section>

      <div className="guide-step-grid">
        {guide.steps.map((step) => {
          const Icon = stepIcons[step.icon] || BookOpenText;
          return (
            <article className="guide-step-card" key={step.title}>
              <div className="guide-step-copy">
                <span className="guide-step-icon">
                  <Icon size={18} />
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
              <ScreenshotMock type={step.screen} copy={copy} t={t} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
