import { Languages, Monitor } from "lucide-react";
import LanguageSwitcher from "../../components/LanguageSwitcher.jsx";
import ThemeSwitcher from "../../components/ThemeSwitcher.jsx";
import { useI18n } from "../../localization/i18n.jsx";

export default function SettingsPage() {
  const { t } = useI18n();

  return (
    <section className="page-stack settings-page">
      <div className="settings-grid">
        <section className="panel settings-card">
          <div className="settings-card-head">
            <span className="settings-card-icon">
              <Languages size={18} />
            </span>
            <div>
              <h2>{t.settings.languageTitle}</h2>
              <p>{t.settings.languageDescription}</p>
            </div>
          </div>
          <div className="settings-card-body">
            <LanguageSwitcher />
          </div>
        </section>

        <section className="panel settings-card">
          <div className="settings-card-head">
            <span className="settings-card-icon">
              <Monitor size={18} />
            </span>
            <div>
              <h2>{t.settings.themeTitle}</h2>
              <p>{t.settings.themeDescription}</p>
            </div>
          </div>
          <div className="settings-card-body">
            <ThemeSwitcher />
          </div>
        </section>
      </div>
    </section>
  );
}
