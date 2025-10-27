import { SupportedLanguage } from './hooks/useTranslation';

export const BLOCKLY_LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  en: 'en', fr: 'fr', es: 'es', it: 'it', pt: 'pt-br', de: 'de', nl: 'nl', tr: 'tr', pl: 'pl', hi: 'hi', ru: 'ru', id: 'id', ja: 'ja', zh: 'zh-hans', ko: 'ko', vi: 'vi', th: 'th', uk: 'uk', ar: 'ar'
};

const inFlight: Record<string, Promise<any>> = {};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-blockly-msg="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if ((existing as any)._loaded) return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Blockly msg script')));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.dataset.blocklyMsg = src;
    s.addEventListener('load', () => { (s as any)._loaded = true; resolve(); });
    s.addEventListener('error', () => reject(new Error('Failed to load Blockly msg script')));
    document.head.appendChild(s);
  });
}

export async function loadBlocklyMessages(lang: SupportedLanguage) {
  if (typeof window === 'undefined') return {} as any;
  const code = BLOCKLY_LANGUAGE_MAP[lang] || 'en';
  const url = `https://unpkg.com/blockly/msg/${code}.js`;
  if (!inFlight[code]) {
    inFlight[code] = loadScript(url).then(() => {
      const win = window as any;
      // Some builds attach messages under win.Blockly.Msg
      const messages = win?.Blockly?.Msg || {};
      return messages;
    }).catch(() => ({}));
  }
  return inFlight[code];
}
