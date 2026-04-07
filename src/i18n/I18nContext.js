import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { normalizeLocale, translations } from './translations';

const I18nContext = createContext(null);

function applyParams(str, params) {
  if (str == null) return '';
  let out = String(str);
  const p = params && typeof params === 'object' ? params : {};
  Object.keys(p).forEach((k) => {
    out = out.split(`{{${k}}}`).join(String(p[k] ?? ''));
  });
  return out;
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() =>
    normalizeLocale(
      typeof localStorage !== 'undefined' ? localStorage.getItem('selectedLanguage') : 'EN'
    )
  );

  const setLocale = useCallback((next) => {
    setLocaleState(normalizeLocale(next));
  }, []);

  const t = useCallback(
    (key, params) => {
      const table = translations[locale] || translations.EN;
      const fallback = translations.EN;
      const template = table[key] ?? fallback[key] ?? key;
      return applyParams(template, params);
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
