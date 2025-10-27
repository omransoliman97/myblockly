# Quick Troubleshooting Guide

## If Translations Still Show English Instead of Japanese

### Step 1: Check Browser Console
Open DevTools (F12) and check console for errors like:
- "Failed to load translations"
- Any 404 errors for `/i18n/ja.json`

### Step 2: Verify localStorage
In DevTools → Application → Local Storage:
```
site-lang: "ja"  ✅ Should be "ja" not "en"
```

### Step 3: Test JSON File Directly
Open in browser: `http://localhost:3000/i18n/ja.json`
- Should download/display the Japanese JSON file
- Should contain `docs.blocks.logic.if.name: "もし"`

### Step 4: Hard Refresh
- Windows/Linux: Ctrl + Shift + R
- Mac: Cmd + Shift + R

### Step 5: Check Translation Hook
Add this temporarily to `app/docs/page.tsx` after the `useTranslation()` line:

```typescript
const { t, lang, isLoading } = useTranslation();

// DEBUG: Add this temporarily
console.log('Current lang:', lang);
console.log('Is loading:', isLoading);
console.log('Test translation:', t('docs.blocks.logic.if.name'));
```

Expected console output:
```
Current lang: ja
Is loading: false
Test translation: もし
```

If you see:
```
Current lang: en  ❌ PROBLEM: Language not changing
Test translation: if  ❌ PROBLEM: Still loading English
```

### Step 6: Check If Language Switcher Updates Correctly
The language switcher should:
1. Update `localStorage.setItem('site-lang', 'ja')`
2. Dispatch custom event `site-lang-changed`
3. Trigger re-render in docs page

### Possible Issues & Fixes

#### Issue 1: Language not persisting
**Symptom**: Switches back to English on refresh
**Fix**: Check if localStorage is working:
```javascript
// In console
localStorage.setItem('test', 'value')
localStorage.getItem('test') // Should return 'value'
```

#### Issue 2: JSON not loading
**Symptom**: Console error "Failed to load translations"
**Fix**: Check file exists at correct path:
```
public/
  └── i18n/
      ├── en.json  ✓
      └── ja.json  ✓
```

#### Issue 3: Race condition
**Symptom**: Sometimes works, sometimes doesn't
**Fix**: Check if `isLoading` is true before rendering:
```typescript
if (isLoading) {
  return <div>Loading translations...</div>;
}
```

#### Issue 4: Cache issue
**Symptom**: Old translations showing
**Fix**: 
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Restart dev server

#### Issue 5: Wrong translation key
**Symptom**: Seeing the key path instead of translation
**Example**: Seeing "docs.blocks.logic.if.name" instead of "もし"
**Fix**: Check JSON structure matches exactly:
```json
{
  "docs": {
    "blocks": {
      "logic": {
        "if": {
          "name": "もし"
        }
      }
    }
  }
}
```

### Manual Test Procedure

1. **Open browser** to `http://localhost:3000/docs`
2. **Open DevTools** (F12) → Console tab
3. **Check localStorage**: 
   ```javascript
   localStorage.getItem('site-lang')
   ```
4. **If not "ja"**, set manually:
   ```javascript
   localStorage.setItem('site-lang', 'ja');
   window.location.reload();
   ```
5. **Check if translations load**:
   ```javascript
   fetch('/i18n/ja.json')
     .then(r => r.json())
     .then(data => console.log(data.docs.blocks.logic.if.name));
   // Should log: もし
   ```

### Expected Behavior

When language is set to Japanese:
- ✅ Header: "MyBlockly ドキュメント"
- ✅ Subtitle: "利用可能なすべてのブロックとプロジェクトでの使用方法について学びましょう。"
- ✅ Sidebar: "論理", "ループ", "数学", etc.
- ✅ Block names: "もし", "もし・それ以外", etc.
- ✅ Descriptions: All in Japanese
- ✅ UI buttons: "XMLをコピー", "XMLコードを表示"

### If Nothing Works

Last resort debugging:

1. **Check environment**: Are you in development mode?
   ```bash
   npm run dev
   ```

2. **Check Next.js**: Is the public folder being served?
   - Try accessing: `http://localhost:3000/i18n/en.json`
   - Should show/download the file

3. **Check file encoding**: Open `ja.json` in editor
   - Should be UTF-8 encoding
   - Should have no BOM (Byte Order Mark)
   - Should be valid JSON (use JSON validator)

4. **Nuclear option**: 
   ```bash
   # Stop server
   # Delete .next folder
   rm -rf .next
   # Restart server
   npm run dev
   ```

### Still Not Working? Share This Info:

1. Screenshot of browser DevTools → Console (any errors?)
2. Screenshot of browser DevTools → Application → localStorage
3. Output of:
   ```javascript
   localStorage.getItem('site-lang')
   ```
4. Output of loading JSON directly in browser:
   ```
   http://localhost:3000/i18n/ja.json
   ```
