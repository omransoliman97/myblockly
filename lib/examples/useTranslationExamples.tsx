// Example: Using the Translation System in Other Components
// This file shows how to use the i18n system throughout your app

import { useTranslation } from "@/lib/hooks/useTranslation";
import { loadBlocklyMessages } from "@/lib/blockly-i18n";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

// ============================================
// Example 1: Simple Component with Translation
// ============================================
export function WelcomeMessage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
}

// ============================================
// Example 2: Component with Language Switcher
// ============================================
export function LanguageSwitcher() {
  const { lang, changeLanguage } = useTranslation();
  
  return (
    <select 
      value={lang} 
      onChange={(e) => changeLanguage(e.target.value as any)}
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
    </select>
  );
}

// ============================================
// Example 3: Dynamic Translation with Fallback
// ============================================
export function UserGreeting({ username }: { username: string }) {
  const { t } = useTranslation();
  
  // If translation key doesn't exist, use fallback
  const greeting = t('user.greeting', 'Hello');
  
  return <p>{greeting}, {username}!</p>;
}

// ============================================
// Example 4: Loading State While Translations Load
// ============================================
export function MyPage() {
  const { t, isLoading } = useTranslation();
  
  if (isLoading) {
    return <div>Loading translations...</div>;
  }
  
  return (
    <div>
      <h1>{t('page.title')}</h1>
      <p>{t('page.content')}</p>
    </div>
  );
}

// ============================================
// Example 5: Using with Blockly in Editor
// ============================================
export function BlocklyEditorExample() {
  const { lang } = useTranslation();
  const workspaceRef = useRef<any>(null);
  
  useEffect(() => {
    async function initBlockly() {
      const Blockly = await import('blockly/core');
      const messages = await loadBlocklyMessages(lang);
      // Set Blockly locale if available
      if (typeof (Blockly as any).setLocale === 'function') {
        (Blockly as any).setLocale(messages as any);
      }
      
      // Initialize workspace with translated blocks
      const toolbox = undefined as unknown as any;
      workspaceRef.current = Blockly.inject('blocklyDiv', {
        toolbox
      });
    }
    
    initBlockly();
  }, [lang]); // Re-initialize when language changes
  
  return <div id="blocklyDiv" style={{ height: '600px' }} />;
}

// ============================================
// Example 6: Nested Translation Keys
// ============================================
export function BlockDocumentation({ blockId }: { blockId: string }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3>{t(`docs.blocks.logic.${blockId}.name`)}</h3>
      <p>{t(`docs.blocks.logic.${blockId}.description`)}</p>
      <code>{t(`docs.blocks.logic.${blockId}.code`)}</code>
    </div>
  );
}

// ============================================
// Example 7: Custom Hook for Specific Section
// ============================================
export function useDocsTranslation() {
  const { t, lang, changeLanguage, isLoading } = useTranslation();
  
  // Create specialized translation function for docs
  const tDocs = (key: string, fallback?: string) => {
    return t(`docs.${key}`, fallback);
  };
  
  return { tDocs, lang, changeLanguage, isLoading };
}

// Usage of custom hook:
export function DocsComponent() {
  const { tDocs } = useDocsTranslation();
  
  return (
    <div>
      <h1>{tDocs('title')}</h1>
      <p>{tDocs('subtitle')}</p>
    </div>
  );
}

/*
============================================
Translation File Structure Example
============================================

public/i18n/en.json:
{
  "title": "Build with Blocks",
  "subtitle": "Design programs visually",
  "language": "Language",
  "theme": "Theme",
  "user": {
    "greeting": "Hello",
    "welcome": "Welcome back"
  },
  "docs": {
    "title": "Documentation",
    "subtitle": "Learn about blocks",
    "blockCategories": {
      "logic": "Logic",
      "loops": "Loops"
    },
    "blocks": {
      "logic": {
        "if": {
          "name": "if",
          "description": "Executes code if condition is true",
          "code": "if (condition) {\n  // code\n}"
        }
      }
    }
  }
}

============================================
Best Practices
============================================

1. Use descriptive keys:
   ✅ t('docs.blocks.logic.if.name')
   ❌ t('n1')

2. Provide fallbacks for optional content:
   t('feature.new', 'New Feature')

3. Keep translations in logical groups:
   docs.*, editor.*, user.*

4. Use nested objects for related content

5. Test with all languages before deploying

6. Keep translation files in sync
*/
