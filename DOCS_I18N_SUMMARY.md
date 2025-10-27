# MyBlockly Documentation i18n System - Summary

## System Overview

The MyBlockly documentation uses a comprehensive i18n (internationalization) system that translates all block documentation into multiple languages.

## File Structure

```
myblockly/
├── public/
│   └── i18n/
│       ├── en.json          # English translations
│       ├── ja.json          # Japanese translations (日本語)
│       ├── fr.json          # French translations
│       └── [other langs].json
├── app/
│   └── docs/
│       ├── page.tsx         # Main docs component
│       └── blockDefinitions.tsx  # Block structure
└── lib/
    └── hooks/
        └── useTranslation.ts # Translation hook
```

## How It Works

### 1. Translation JSON Structure

Each language has a JSON file with nested keys:

```json
{
  "docs": {
    "title": "MyBlockly Documentation",
    "blockCategories": {
      "logic": "Logic"
    },
    "blocks": {
      "logic": {
        "if": {
          "name": "if",
          "description": "Executes code if a condition is true",
          "code": "if (condition) {\n  // code\n}",
          "example": "Check if a number is positive"
        }
      }
    }
  }
}
```

### 2. Block Definitions (blockDefinitions.tsx)

Blocks reference translation keys:

```typescript
{
  nameKey: 'docs.blocks.logic.if.name',
  descriptionKey: 'docs.blocks.logic.if.description',
  codeKey: 'docs.blocks.logic.if.code',
  exampleKey: 'docs.blocks.logic.if.example',
  blockXml: '<block type="controls_if"></block>'
}
```

### 3. Translation Hook Usage

Components use the `useTranslation()` hook:

```typescript
const { t, lang } = useTranslation();

// Translate a key
<h1>{t('docs.title')}</h1>

// Translate block name
<CardTitle>{t(block.nameKey)}</CardTitle>
```

## Adding New Languages

To add a new language:

1. **Create translation file**: `public/i18n/[lang-code].json`
2. **Copy structure from en.json**
3. **Translate all strings**
4. **Add to SupportedLanguage type** in `lib/hooks/useTranslation.ts`
5. **Add to language selector** in navigation

## Translation Keys for Docs

### Page-Level Keys
- `docs.title` - Page title
- `docs.subtitle` - Page subtitle
- `docs.categories` - "Categories" heading
- `docs.visualBlock` - "Visual Block:" label
- `docs.copyXML` - "Copy XML" button
- `docs.showXMLCode` - "Show XML Code" toggle
- `docs.generatedCode` - "Generated Code:" label
- `docs.example` - "Example:" label

### Block Category Keys
- `docs.blockCategories.logic` - Logic category
- `docs.blockCategories.loops` - Loops category
- `docs.blockCategories.math` - Math category
- `docs.blockCategories.variables` - Variables category
- `docs.blockCategories.functions` - Functions category
- `docs.blockCategories.lists` - Lists category
- `docs.blockCategories.text` - Text category

### Block-Specific Keys
Each block has 4 keys:
- `docs.blocks.[category].[block].name` - Block name
- `docs.blocks.[category].[block].description` - Block description
- `docs.blocks.[category].[block].code` - Generated code example
- `docs.blocks.[category].[block].example` - Usage example (optional)

Example for the "if" block:
- `docs.blocks.logic.if.name`
- `docs.blocks.logic.if.description`
- `docs.blocks.logic.if.code`
- `docs.blocks.logic.if.example`

## Language-Specific Block Content

Some blocks have language-specific content using functions:

```typescript
// Example: "Hello, world!" in different languages
blockXml: (lang) => {
  const map = {
    en: 'Hello, world!',
    ja: 'こんにちは、世界！',
    // ... other languages
  };
  return `<block type="text"><field name="TEXT">${map[lang]}</field></block>`;
}
```

## Current Status

✅ **Fully Implemented**:
- Translation system with hook
- JSON structure for all languages
- Block definitions with translation keys
- Blockly messages integration
- Language switcher in navigation

✅ **Languages with Complete Translations**:
- English (en)
- Japanese (ja)
- French (fr)
- Spanish (es)
- And 15+ more languages...

## Testing Translations

1. **Open docs page**: Navigate to `/docs`
2. **Switch language**: Use language selector in header
3. **Verify translations**: 
   - Page title and subtitle
   - Category names in sidebar
   - Block names and descriptions
   - Code examples (stay in respective code syntax)
   - UI labels (Copy XML, Show XML Code, etc.)

## Troubleshooting

### Translations Not Showing

1. **Check JSON syntax**: Ensure valid JSON in language files
2. **Verify key paths**: Keys must match exactly (case-sensitive)
3. **Clear cache**: Try hard refresh (Cmd/Ctrl + Shift + R)
4. **Check localStorage**: Language preference stored as `site-lang`

### Adding Missing Translations

If a key is missing:
1. Add it to `en.json` first
2. Copy to all other language files
3. Translate the value (or use English as fallback)
4. Reference the key in your component with `t('key.path')`

## Code Examples Format

Code examples in JSON should:
- Use `\n` for line breaks
- Show the code syntax (not pseudocode)
- Be language-neutral (avoid English comments in non-English files)
- Use proper indentation

```json
{
  "code": "if (condition) {\n  // code to execute\n}"
}
```

## Best Practices

1. **Never hardcode strings** in JSX
2. **Always use translation keys** via `t()` function
3. **Keep keys organized** by feature/section
4. **Use descriptive key names** like `docs.blocks.logic.if.name`
5. **Test in multiple languages** before deployment
6. **Maintain consistency** across all language files

## Architecture Benefits

✅ **Scalability**: Easy to add new languages
✅ **Maintainability**: Centralized translations
✅ **Type Safety**: TypeScript integration
✅ **Performance**: JSON files loaded on demand
✅ **User Experience**: Seamless language switching
✅ **SEO Friendly**: Proper language attributes

## Future Enhancements

Potential improvements:
- [ ] Add language detection from browser
- [ ] Implement pluralization rules
- [ ] Add RTL (right-to-left) support for Arabic
- [ ] Create translation management tool
- [ ] Add translation completion status
- [ ] Implement lazy loading for languages
