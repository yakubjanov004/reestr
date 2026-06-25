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

import { useAuth } from "../auth/AuthContext.jsx";
import {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  effectiveRole,
  roleLabel
} from "../auth/roles.js";
import PageHero from "../components/PageHero.jsx";
import { GUIDE_TRANSLATIONS } from "../localization/guide.js";
import { useI18n } from "../localization/i18n.jsx";

const stepIcons = {
  upload: UploadCloud,
  result: CheckCircle2,
  records: Search,
  dashboard: BarChart3,
  users: UserCog,
  audit: ScrollText,
  batches: History
};

const roleIntroIcons = {
  [ROLE_OPERATOR]: UploadCloud,
  [ROLE_SUPERVISOR]: UserCog,
  [ROLE_MANAGER]: Building2,
  [ROLE_ADMIN]: Building2
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
  const userRole = effectiveRole(user) || ROLE_OPERATOR;
  const activeRole = copy.roles[userRole] ? userRole : ROLE_OPERATOR;
  const guide = copy.roles[activeRole] || copy.roles[ROLE_OPERATOR];
  const visibleSteps = guide.steps.filter((step) => step.screen !== "privacy" && step.icon !== "privacy");
  const RoleIntroIcon = roleIntroIcons[activeRole] || BookOpenText;
  const screenCount = new Set(visibleSteps.map((step) => step.screen)).size;

  return (
    <section className="page-stack guide-page">
      <PageHero
        kicker={copy.heroKicker}
        title={guide.title}
        description={guide.intro}
        icon={RoleIntroIcon}
        stats={[
          { label: copy.stats.roles, value: roleLabel(t, activeRole), icon: Users },
          { label: copy.stats.screens, value: screenCount, icon: Database },
          { label: copy.stats.steps, value: visibleSteps.length, icon: ListChecks },
          { label: copy.stats.language, value: "UZ/RU", icon: BookOpenText }
        ]}
      />

      <section className="panel guide-overview github-style-panel">
        <div className="stats-panel-head">
          <div>
            <h2>{guide.checklistTitle}</h2>
            <p>Tizimdan foydalanish bo'yicha ketma-ket qadamlar va ko'rsatmalar.</p>
          </div>
          <ListChecks size={18} />
        </div>

        <div className="guide-overview-grid">
          <div className="guide-system-list">
            {visibleSteps.map((step) => {
              const Icon = stepIcons[step.icon] || CheckCircle2;
              return (
                <div key={step.title}>
                  <Icon size={16} />
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.text}</small>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="guide-checklist">
            <h3>{guide.checklistTitle}</h3>
            <ol>
              {guide.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="guide-step-grid">
        {visibleSteps.map((step) => {
          const Icon = stepIcons[step.icon] || BookOpenText;
          return (
            <article className="panel guide-step-card github-style-panel" key={step.title} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
              <div className="guide-step-copy">
                <span className="guide-step-icon">
                  <Icon size={18} />
                </span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#020617', margin: '0 0 6px 0' }}>{step.title}</h3>
                  <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: '1.6' }}>{step.text}</p>
                </div>
              </div>
              <ScreenshotMock type={step.screen} copy={copy} t={t} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
