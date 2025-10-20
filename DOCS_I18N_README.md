# MyBlockly Documentation i18n Implementation

## Overview

This implementation provides full internationalization (i18n) support for the MyBlockly documentation page. All static text has been moved to language files, and Blockly blocks are rendered with Google's built-in i18n system.

## What Was Implemented

### 1. **Translation Hook** (`lib/hooks/useTranslation.ts`)
A custom React hook that:
- Reads language from `localStorage.getItem("site-lang")`
- Loads translations from `/public/i18n/{lang}.json`
- Provides a `t()` function for accessing nested translations
- Handles language switching with automatic persistence
- Falls back to English if a translation fails

**Usage:**
```typescript
const { t, lang, changeLanguage, isLoading } = useTranslation();

// Access translations
<h1>{t('docs.title')}</h1>
<p>{t('docs.subtitle')}</p>

// Change language
changeLanguage('fr'); // Automatically saves to localStorage
```

### 2. **Blockly i18n Utility** (`lib/blockly-i18n.ts`)
Maps your language codes to Blockly's language codes and loads the appropriate Blockly messages.

**Language Mapping:**
- `en` → `en`
- `fr` → `fr`
- `zh` → `zh-hans` (simplified Chinese)
- `pt` → `pt-br` (Brazilian Portuguese)
- etc.

### 3. **Updated i18n Files**
Extended all language files with documentation translations:

**Structure:**
```json
{
  "docs": {
    "title": "MyBlockly Documentation",
    "subtitle": "Learn about all available blocks...",
    "blockCategories": {
      "logic": "Logic",
      "loops": "Loops",
      ...
    },
    "blocks": {
      "logic": {
        "if": {
          "name": "if",
          "description": "Executes code if...",
          "code": "if (condition) {...}",
          "example": "Check if a number is positive"
        }
      }
    }
  }
}
```

### 4. **Updated Docs Page** (`app/docs/page.tsx`)
The documentation page now:
- Uses the `useTranslation()` hook for all text
- Renders Blockly blocks with language-specific messages
- Re-renders blocks when language changes
- Keeps XML structure unchanged (only visual representation changes)

### 5. **Block Definitions** (`app/docs/blockDefinitions.tsx`)
Separated block data into its own file with translation keys instead of hardcoded text.

## How It Works

### Language Detection & Loading

1. **On Page Load:**
   ```javascript
   const savedLang = localStorage.getItem("site-lang") || "en";
   ```

2. **Fetch Translations:**
   ```javascript
   const response = await fetch(`/i18n/${lang}.json`);
   const translations = await response.json();
   ```

3. **Apply to UI:**
   ```javascript
   <h1>{t('docs.title')}</h1>
   // Looks up translations.docs.title
   ```

### Blockly Block Translation

1. **Load Blockly Messages:**
   ```javascript
   const messages = await loadBlocklyMessages(lang);
   Blockly.setLocale(messages);
   ```

2. **Render Block:**
   ```javascript
   <BlocklyBlockRenderer blockXml={block.blockXml} lang={lang} />
   ```

3. **Result:** The block visual changes (e.g., "if" becomes "si" in French) but the XML stays the same.

## Key Features

### ✅ Static Text Translation
All UI text is translated:
- Page titles and subtitles
- Navigation links
- Button labels
- Category names
- Block descriptions

### ✅ Blockly Block Translation
Blocks render in the selected language using Google's official Blockly translations:
- Block labels change (e.g., "repeat" → "répéter")
- Dropdown options translate
- Field names translate
- **XML structure remains unchanged**

### ✅ XML Preservation
The XML code itself never changes:
```xml
<!-- Always the same regardless of language -->
<block type="controls_if">
  <field name="IF0">...</field>
</block>
```

Only the **visual rendering** changes based on language.

### ✅ Dynamic Language Switching
Users can change language on-the-fly:
- Dropdown in header
- Instant UI update
- Blocks re-render with new language
- Preference saved to localStorage

## Adding a New Language

### Step 1: Create Translation File
Create `/public/i18n/XX.json` (where XX is the language code):

```json
{
  "title": "...",
  "subtitle": "...",
  "docs": {
    "title": "...",
    "blockCategories": {
      "logic": "..."
    },
    "blocks": {
      "logic": {
        "if": {
          "name": "...",
          "description": "...",
          "code": "..."
        }
      }
    }
  }
}
```

### Step 2: Add to Type Definition
Update `lib/hooks/useTranslation.ts`:
```typescript
export type SupportedLanguage = 
  | "en" | "fr" | ... | "XX";
```

### Step 3: Add to Blockly Language Map
Update `lib/blockly-i18n.ts`:
```typescript
export const BLOCKLY_LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  // ...
  XX: 'blockly-lang-code', // Check Blockly's supported languages
};
```

### Step 4: Add to Language Selector
Update `app/docs/page.tsx`:
```jsx
<SelectContent>
  {/* ... */}
  <SelectItem value="XX">Language Name</SelectItem>
</SelectContent>
```

## File Structure

```
myblockly/
├── public/
│   └── i18n/
│       ├── en.json          # English translations
│       ├── fr.json          # French translations
│       └── ...              # Other languages
├── lib/
│   ├── hooks/
│   │   └── useTranslation.ts    # Translation hook
│   └── blockly-i18n.ts          # Blockly language loader
└── app/
    └── docs/
        ├── page.tsx             # Main docs page
        └── blockDefinitions.tsx # Block data with translation keys
```

## Translation Key Naming Convention

```
docs.                          # Documentation section
  blockCategories.             # Block category names
    logic                      # Category ID
  blocks.                      # Individual block translations
    logic.                     # Category
      if.                      # Block ID
        name                   # Block name
        description            # Block description
        code                   # Generated code example
        example                # Usage example (optional)
```

## Benefits of This Approach

1. **Separation of Concerns:** Translation data is separate from code
2. **Easy Maintenance:** Add languages by adding JSON files
3. **Type Safety:** TypeScript types for language codes
4. **Performance:** Translations load once per language change
5. **Flexibility:** Easy to add new translated strings
6. **Standards Compliant:** Uses Blockly's official i18n system
7. **XML Independence:** XML structure never changes, ensuring compatibility

## Usage Examples

### Basic Translation
```typescript
const { t } = useTranslation();
<h1>{t('docs.title')}</h1>
```

### With Fallback
```typescript
t('docs.someKey', 'Default Text')
```

### Language Switching
```typescript
const { changeLanguage } = useTranslation();
<button onClick={() => changeLanguage('fr')}>
  Français
</button>
```

### Block Rendering
```typescript
<BlocklyBlockRenderer 
  blockXml="<block type='controls_if'></block>"
  lang={lang}
/>
```

## Important Notes

1. **localStorage Dependency:** The system reads from `localStorage.getItem("site-lang")` as you requested
2. **XML Unchanged:** The XML code itself never changes, only the visual representation
3. **Blockly Messages:** Uses Google's official Blockly translation files
4. **Fallback Handling:** Falls back to English if a language file or translation is missing
5. **Client-Side Only:** All translations happen client-side (works with Next.js App Router)

## Testing

To test the implementation:

1. Visit `/docs`
2. Change language from dropdown
3. Observe:
   - All UI text changes
   - Block visuals update
   - Language persists on refresh
   - XML code remains the same

## Future Enhancements

Potential improvements:
- Add more languages
- Server-side rendering support
- Translation key validation
- Missing translation warnings in development
- Automatic translation file generation from a master file

---

**Created for MyBlockly Documentation**  
All static text is now translatable, and Blockly blocks render in the user's selected language while preserving XML structure.
