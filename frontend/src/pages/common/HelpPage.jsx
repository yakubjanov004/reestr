import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageSquareText,
  PhoneCall,
  Search,
  ShieldCheck
} from "lucide-react";

import { useAuth } from "../../auth/AuthContext.jsx";
import {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  effectiveRole
} from "../../auth/roles.js";
import { HELP_TRANSLATIONS } from "../../localization/help.js";
import { useI18n } from "../../localization/i18n.jsx";

/* ── Contact card icons by key ── */
const CONTACT_ICONS = {
  phone: PhoneCall,
  telegram: MessageSquareText,
  email: Mail
};

const CONTACT_TONES = {
  phone: "blue",
  telegram: "green",
  email: "purple"
};

/* ── FAQ Accordion Item ── */
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`help-faq-item ${open ? "help-faq-open" : ""}`}>
      <button
        className="help-faq-trigger"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <HelpCircle size={16} className="help-faq-icon" />
        <span className="help-faq-question">{question}</span>
        <ChevronDown size={16} className="help-faq-chevron" />
      </button>
      {open && (
        <div className="help-faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */
export default function HelpPage() {
  const { user } = useAuth();
  const { language } = useI18n();
  const copy = HELP_TRANSLATIONS[language] || HELP_TRANSLATIONS.uz;
  const userRole = effectiveRole(user) || ROLE_OPERATOR;

  /* Determine which FAQ sections are visible based on role */
  const faqSections = [];
  if (userRole === ROLE_OPERATOR) {
    faqSections.push({ key: "operator", ...copy.faq.operator });
  } else if (userRole === ROLE_SUPERVISOR) {
    faqSections.push({ key: "supervisor", ...copy.faq.supervisor });
    faqSections.push({ key: "operator", ...copy.faq.operator });
  } else if (userRole === ROLE_MANAGER) {
    faqSections.push({ key: "manager", ...copy.faq.manager });
    faqSections.push({ key: "supervisor", ...copy.faq.supervisor });
    faqSections.push({ key: "operator", ...copy.faq.operator });
  } else if (userRole === ROLE_ADMIN) {
    faqSections.push({ key: "admin", ...copy.faq.admin });
    faqSections.push({ key: "manager", ...copy.faq.manager });
    faqSections.push({ key: "supervisor", ...copy.faq.supervisor });
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState(faqSections[0]?.key || "operator");

  /* Filter FAQ by search query */
  const currentSection = faqSections.find((s) => s.key === activeSection) || faqSections[0];
  const filteredItems = searchQuery
    ? (currentSection?.items || []).filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentSection?.items || [];

  return (
    <section className="page-stack help-page">

      {/* ── Hero Banner ── */}
      <div className="help-hero-banner">
        <div className="help-hero-content">
          <div className="help-hero-icon-wrapper">
            <LifeBuoy size={28} strokeWidth={1.5} />
          </div>
          <div>
            <span className="help-hero-kicker">{copy.hero.kicker}</span>
            <h1>{copy.hero.title}</h1>
            <p>{copy.hero.description}</p>
          </div>
        </div>
        <div className="help-hero-decoration">
          <div className="circle circle-1" />
          <div className="circle circle-2" />
          <div className="circle circle-3" />
        </div>
      </div>

      {/* ── Contact Cards ── */}
      <div className="help-contacts-grid">
        {["phone", "telegram", "email"].map((key) => {
          const info = copy.contact[key];
          const Icon = CONTACT_ICONS[key];
          const tone = CONTACT_TONES[key];
          return (
            <div className={`help-contact-card help-contact-${tone}`} key={key}>
              <div className="help-contact-icon-wrap">
                <Icon size={22} />
              </div>
              <h3>{info.label}</h3>
              <p>{info.description}</p>
              <div className="help-contact-footer">
                <strong>{info.value}</strong>
                <small>
                  <Clock3 size={13} />
                  {info.hours}
                </small>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FAQ Section ── */}
      <section className="panel help-faq-section">
        <div className="help-faq-header">
          <div>
            <h2>{copy.faq.title}</h2>
            <p>{copy.faq.description}</p>
          </div>
          <ShieldCheck size={20} className="help-faq-header-icon" />
        </div>

        {/* FAQ role tabs */}
        <div className="help-faq-controls">
          <div className="help-faq-tabs">
            {faqSections.map((section) => (
              <button
                key={section.key}
                type="button"
                className={activeSection === section.key ? "active" : ""}
                onClick={() => setActiveSection(section.key)}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="help-faq-search">
            <Search size={15} />
            <input
              type="text"
              placeholder={copy.faq.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ items */}
        <div className="help-faq-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <FaqItem key={index} question={item.question} answer={item.answer} />
            ))
          ) : (
            <div className="help-faq-empty">
              <HelpCircle size={32} />
              <p>{copy.faq.empty}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Guidelines ── */}
      <section className="panel help-guidelines-section">
        <div className="help-guidelines-header">
          <h2>{copy.guidelines.title}</h2>
          <p>{copy.guidelines.description}</p>
        </div>
        <div className="help-guidelines-steps">
          {copy.guidelines.steps.map((step, index) => (
            <div className="help-guideline-step" key={index}>
              <div className="help-guideline-number">{index + 1}</div>
              <div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
