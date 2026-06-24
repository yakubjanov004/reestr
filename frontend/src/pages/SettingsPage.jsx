import { Languages, Monitor, Settings } from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";
import { useI18n } from "../localization/i18n.jsx";

export default function SettingsPage() {
  const { t } = useI18n();

  return (
    <section className="page-stack profile-page">
      <header className="profile-compact-header">
        <div className="profile-compact-title">
          <span className="section-kicker">Tizim sozlamalari</span>
          <h1>Sozlamalar</h1>
          <p>Tizim tili va ko'rinishini o'zgartirish.</p>
        </div>
      </header>

      <div className="profile-grid">
        <div className="profile-side-stack" style={{ width: '100%', maxWidth: '400px' }}>
          <section className="panel profile-language-panel">
            <div className="panel-heading">
              <div className="panel-title-with-icon">
                <Languages size={18} />
                <h2>{t.login.languagePickerLabel}</h2>
              </div>
            </div>
            <div className="profile-language-body">
              <LanguageSwitcher />
            </div>
          </section>

          <section className="panel profile-language-panel">
            <div className="panel-heading">
              <div className="panel-title-with-icon">
                <Monitor size={18} />
                <h2>Tizim ko'rinishi</h2>
              </div>
            </div>
            <div className="profile-language-body">
              <ThemeSwitcher />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
