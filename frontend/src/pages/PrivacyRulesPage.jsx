import { useState } from "react";
import {
  Database,
  Eye,
  FileSpreadsheet,
  Layers,
  ListChecks,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  ShieldOff
} from "lucide-react";

import PageHero from "../components/PageHero.jsx";
import SourceTypeTabs from "../components/SourceTypeTabs.jsx";
import { useI18n } from "../localization/i18n.jsx";
import { PRIVACY_RULES, countByTone } from "../utils/privacyRules.js";

const TONE_ICONS = {
  RED: ShieldOff,
  YELLOW: ShieldAlert,
  WHITE: ShieldCheck
};

function ToneCard({ tone, count, t }) {
  const meta = t.privacy.tones[tone];
  const Icon = TONE_ICONS[tone];
  return (
    <div className={`policy-overview-card policy-overview-card--${tone.toLowerCase()}`}>
      <div className="policy-card-header">
        <span className="policy-card-icon">
          <Icon size={20} />
        </span>
        <h3>{meta.label}</h3>
        <strong className="policy-card-count">{count}</strong>
      </div>
      <p className="policy-card-desc">{meta.desc}</p>
      <div className="policy-card-verdict">
        <span className="verdict-label">{t.privacy.statusLabel}</span>
        <strong className="verdict-value">{meta.verdict}</strong>
      </div>
    </div>
  );
}

function SourceCard({ sourceKey, data, t, fmt }) {
  const counts = countByTone(data.fields);
  const sourceName = sourceKey === "mobile" ? t.source.mobile : t.source.internet;
  const sourceLabel = t.privacy.sourceLabels[sourceKey] || sourceName;

  return (
    <section className={`panel rule-card rule-card--${sourceKey}`}>
      <div className="panel-heading split align-center rule-card-heading">
        <div>
          <p className="eyebrow">{sourceLabel}</p>
          <h2>{fmt(t.privacy.columnsFor, { source: sourceName })}</h2>
          <p className="rule-card-lead">
            {fmt(t.privacy.columnsLead, { count: data.fields.length })}
          </p>
        </div>
        <div className="rule-card-summary-pills">
          <span className="summary-pill summary-pill--red">
            <strong>{counts.RED}</strong> {t.privacy.notStored.toLowerCase()}
          </span>
          <span className="summary-pill summary-pill--yellow">
            <strong>{counts.YELLOW}</strong> {t.privacy.masked.toLowerCase()}
          </span>
          <span className="summary-pill summary-pill--white">
            <strong>{counts.WHITE}</strong> {t.privacy.original.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="table-wrap">
        <table className="rule-table">
          <thead>
            <tr>
              <th>№</th>
              <th>{t.privacy.columns} (Excel)</th>
              <th>{t.privacy.securityLevel}</th>
              <th>{t.privacy.storageStatus}</th>
              <th>{t.privacy.sample}</th>
            </tr>
          </thead>
          <tbody>
            {data.fields.map((field, index) => {
              const meta = t.privacy.tones[field.tone];
              const Icon = TONE_ICONS[field.tone];
              return (
                <tr key={field.name} className={`rule-row--${field.tone.toLowerCase()}`}>
                  <td className="rule-row-number">{index + 1}</td>
                  <td className="rule-field-name">{field.name}</td>
                  <td>
                    <span className={`rule-badge rule-badge--${field.tone.toLowerCase()}`}>
                      <Icon size={12} />
                      {meta.label}
                    </span>
                  </td>
                  <td className="rule-verdict">{meta.verdict}</td>
                  <td className="rule-example">
                    {field.tone === "RED" ? (
                      <span className="empty-text-dash">—</span>
                    ) : field.tone === "YELLOW" ? (
                      <code className="example-code-block">{field.example || "ABC***"}</code>
                    ) : (
                      <span className="original-val-badge">{t.privacy.original}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function PrivacyRulesPage() {
  const { t, fmt } = useI18n();
  const [activeSource, setActiveSource] = useState("mobile");
  const sources = Object.entries(PRIVACY_RULES);
  const activeData = PRIVACY_RULES[activeSource];
  const activeCounts = countByTone(activeData.fields);
  const allCounts = sources.reduce(
    (acc, [, source]) => {
      const counts = countByTone(source.fields);
      acc.RED += counts.RED;
      acc.YELLOW += counts.YELLOW;
      acc.WHITE += counts.WHITE;
      return acc;
    },
    { RED: 0, YELLOW: 0, WHITE: 0 }
  );
  const totalFields = sources.reduce((sum, [, source]) => sum + source.fields.length, 0);
  const protectedActiveFields = activeCounts.RED + activeCounts.YELLOW;

  const heroStats = [
    { label: t.privacy.totalColumns, value: totalFields, icon: FileSpreadsheet, tone: "blue" },
    { label: t.privacy.notStored, value: allCounts.RED, icon: LockKeyhole, tone: "red" },
    { label: t.privacy.masked, value: allCounts.YELLOW, icon: Eye, tone: "yellow" },
    { label: t.privacy.original, value: allCounts.WHITE, icon: Database, tone: "green" }
  ];
  const activeSourceName = activeSource === "mobile" ? t.source.mobile : t.source.internet;

  return (
    <section className="page-stack privacy-page">
      <PageHero
        kicker={t.privacy.heroKicker}
        title={t.privacy.title}
        description={t.privacy.description}
        icon={ShieldCheck}
        stats={heroStats}
      />

      <div className="privacy-section-heading">
        <div>
          <p className="panel-kicker">{t.privacy.levels}</p>
          <h2>{fmt(t.privacy.storageOrderFor, { source: activeSourceName })}</h2>
        </div>
        <span className="privacy-active-pill">
          <Layers size={15} />
          {fmt(t.privacy.protectedColumns, { count: protectedActiveFields })}
        </span>
      </div>

      <div className="policy-overview-grid">
        <ToneCard tone="RED" count={activeCounts.RED} t={t} />
        <ToneCard tone="YELLOW" count={activeCounts.YELLOW} t={t} />
        <ToneCard tone="WHITE" count={activeCounts.WHITE} t={t} />
      </div>

      <section className="panel privacy-toolbar">
        <div className="privacy-toolbar-heading">
          <span className="privacy-toolbar-icon">
            <ListChecks size={18} />
          </span>
          <div>
            <p className="panel-kicker">{t.privacy.detailTable}</p>
            <h2>{t.privacy.chooseSource}</h2>
          </div>
        </div>

        <div className="source-selector-section">
          <SourceTypeTabs value={activeSource} onChange={setActiveSource} />
        </div>

        <div className="privacy-active-summary">
          <div>
            <span>{t.privacy.activeRegistry}</span>
            <strong>{t.privacy.sourceLabels[activeSource]}</strong>
          </div>
          <div>
            <span>{t.privacy.columns}</span>
            <strong>{activeData.fields.length}</strong>
          </div>
          <div>
            <span>{t.privacy.protection}</span>
            <strong>{protectedActiveFields}</strong>
          </div>
        </div>
      </section>

      {sources
        .filter(([key]) => key === activeSource)
        .map(([key, data]) => (
          <SourceCard key={key} sourceKey={key} data={data} t={t} fmt={fmt} />
        ))}
    </section>
  );
}
