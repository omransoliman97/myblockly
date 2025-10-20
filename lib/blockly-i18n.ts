import { SupportedLanguage } from './hooks/useTranslation';

// Map our language codes to Blockly's language codes
export const BLOCKLY_LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  en: 'en',
  fr: 'fr',
  es: 'es',
  it: 'it',
  pt: 'pt-br', // Blockly uses pt-br
  de: 'de',
  nl: 'nl',
  tr: 'tr',
  pl: 'pl',
  hi: 'hi',
  ru: 'ru',
  id: 'id',
  ja: 'ja',
  zh: 'zh-hans', // Blockly uses zh-hans for simplified Chinese
  ko: 'ko',
  vi: 'vi',
  th: 'th',
  uk: 'uk',
  ar: 'ar'
};

// Load Blockly messages for a given language
export async function loadBlocklyMessages(lang: SupportedLanguage) {
  const blocklyLang = BLOCKLY_LANGUAGE_MAP[lang] || 'en';
  
  try {
    // Dynamically import the Blockly messages
    const messages = await import(`blockly/msg/${blocklyLang}`);
    return messages;
  } catch (error) {
    console.warn(`Failed to load Blockly messages for ${blocklyLang}, falling back to English`);
    // Fallback to English
    const messages = await import('blockly/msg/en');
    return messages;
  }
}
