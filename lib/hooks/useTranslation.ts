import { useState, useEffect } from 'react';

export type SupportedLanguage = 
  | "en" | "fr" | "es" | "it" | "pt" | "de" | "nl" | "tr" 
  | "pl" | "hi" | "ru" | "id" | "ja" | "zh" | "ko" | "vi" 
  | "th" | "uk" | "ar";

interface TranslationData {
  [key: string]: any;
}

export function useTranslation() {
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('site-lang') as SupportedLanguage | null;
      if (saved) return saved;
    }
    return 'en';
  });
  const [translations, setTranslations] = useState<TranslationData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("site-lang") as SupportedLanguage;
    if (savedLang) {
      setLang(savedLang);
    }
    // Also ensure a default is set for first-time visitors
    if (!savedLang) {
      try { localStorage.setItem("site-lang", "en"); } catch {}
    }
  }, []);

  // Keep all hook instances in sync with external changes (Navbar, other components, other tabs)
  useEffect(() => {
    const onCustomLangChanged = () => {
      const saved = (localStorage.getItem("site-lang") as SupportedLanguage) || "en";
      setLang((prev) => (prev !== saved ? saved : prev));
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === "site-lang" && e.newValue) {
        const saved = e.newValue as SupportedLanguage;
        setLang((prev) => (prev !== saved ? saved : prev));
      }
    };

    window.addEventListener("site-lang-changed", onCustomLangChanged as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("site-lang-changed", onCustomLangChanged as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Load translations when language changes
  useEffect(() => {
    async function loadTranslations() {
      setIsLoading(true);
      try {
        const response = await fetch(`/i18n/${lang}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
        // Fallback to English if load fails
        if (lang !== 'en') {
          try {
            const response = await fetch('/i18n/en.json');
            const data = await response.json();
            setTranslations(data);
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadTranslations();
  }, [lang]);

  // Reflect language on document for proper layout direction
  useEffect(() => {
    if (typeof document !== 'undefined') {
      try {
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      } catch {}
    }
  }, [lang]);

  // Helper function to get nested translation by path
  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let value: any = translations;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return fallback || path;
      }
    }
    
    return typeof value === 'string' ? value : fallback || path;
  };

  // Change language and persist to localStorage
  const changeLanguage = (newLang: SupportedLanguage) => {
    if (newLang === lang) return;
    setLang(newLang);
    localStorage.setItem("site-lang", newLang);
    // Notify all listeners (including other hook instances)
    try { window.dispatchEvent(new CustomEvent("site-lang-changed")); } catch {}
  };

  return {
    lang,
    t,
    changeLanguage,
    isLoading,
    translations
  };
}
