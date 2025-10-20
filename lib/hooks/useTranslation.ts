import { useState, useEffect } from 'react';

export type SupportedLanguage = 
  | "en" | "fr" | "es" | "it" | "pt" | "de" | "nl" | "tr" 
  | "pl" | "hi" | "ru" | "id" | "ja" | "zh" | "ko" | "vi" 
  | "th" | "uk" | "ar";

interface TranslationData {
  [key: string]: any;
}

export function useTranslation() {
  const [lang, setLang] = useState<SupportedLanguage>("en");
  const [translations, setTranslations] = useState<TranslationData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("site-lang") as SupportedLanguage;
    if (savedLang) {
      setLang(savedLang);
    }
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
    setLang(newLang);
    localStorage.setItem("site-lang", newLang);
  };

  return {
    lang,
    t,
    changeLanguage,
    isLoading,
    translations
  };
}
