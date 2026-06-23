import { Languages } from "lucide-react";

import { useI18n } from "../localization/i18n.jsx";

export default function LanguageSwitcher({ compact = false }) {
  const { language, languages, setLanguage, t } = useI18n();

  return (
    <div
      className={`language-switcher${compact ? " compact" : ""}`}
      role="group"
      aria-label={t.login.languagePickerLabel}
    >
      {!compact && <Languages size={15} />}
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          className={language === item.code ? "active" : ""}
          aria-pressed={language === item.code}
          onClick={() => setLanguage(item.code)}
        >
          {compact ? item.shortLabel : item.label}
        </button>
      ))}
    </div>
  );
}
