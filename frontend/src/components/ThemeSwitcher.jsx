import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/ThemeContext.jsx";
import { useI18n } from "../localization/i18n.jsx";

export default function ThemeSwitcher() {
  const { theme, setDarkMode } = useTheme();
  const { t } = useI18n();

  return (
    <div className="language-switcher" style={{ width: "100%", flexDirection: "column" }}>
      <button
        type="button"
        className={theme === "light" ? "active" : ""}
        onClick={() => setDarkMode(false)}
        aria-pressed={theme === "light"}
      >
        <Sun size={16} style={{ marginRight: 8, display: "inline-block" }} />
        {t.theme.light}
      </button>
      <button
        type="button"
        className={theme === "dark" ? "active" : ""}
        onClick={() => setDarkMode(true)}
        aria-pressed={theme === "dark"}
      >
        <Moon size={16} style={{ marginRight: 8, display: "inline-block" }} />
        {t.theme.dark}
      </button>
    </div>
  );
}
