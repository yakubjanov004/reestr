import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_STORAGE_KEY } from "./constants.js";
import { TRANSLATIONS } from "./translations/index.js";

export { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_STORAGE_KEY } from "./constants.js";
export { TRANSLATIONS } from "./translations/index.js";

const I18nContext = createContext(null);

export function getLanguage(value) {
  return TRANSLATIONS[value] ? value : DEFAULT_LANGUAGE;
}

function interpolate(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() =>
    getLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY))
  );

  const t = TRANSLATIONS[language] || TRANSLATIONS[DEFAULT_LANGUAGE];

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = t.htmlLang;
  }, [language, t.htmlLang]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (nextLanguage) => setLanguageState(getLanguage(nextLanguage)),
      languages: LANGUAGES,
      t,
      fmt: interpolate
    }),
    [language, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
