# MyBlockly

A modern Blockly playground built with Next.js (App Router), shadcn/ui, and TailwindCSS. Design programs visually using blocks, preview generated code (JS/Python/PHP/XML/JSON), switch UI languages, toggle dark/light mode, and control editor sounds — all with a clean, responsive UI.

## Features
- **Visual programming with Blockly**: Drag/drop blocks and generate code.
- **Multi-language UI (i18n)**: English/French landing content via `public/i18n/*.json`.
- **Editor locale sync**: Editor Blockly messages sync with the website language via `localStorage` key `site-lang`.
- **Dark/Light theme**: Global class-based theming using `.dark`/`.light`, shared across pages.
- **Sound control**: Editor sound effects with a mute/unmute toggle (persisted).
- **shadcn/ui components**: Consistent UI with `Button` and `Select`.
- **Code preview tabs**: View generated `javascript`, `python`, `php`, `xml`, `json` from your workspace.
- **Import/Export**: Load and save workspace as XML/TXT.

## Tech Stack
- **Next.js** 15 (App Router)
- **React** + **TypeScript**
- **TailwindCSS** + **shadcn/ui**
- **Blockly**
- **lucide-react** icons

## Project Structure
- `app/page.tsx` — Landing page with theme and language selectors (shadcn).
- `app/editor/page.tsx` — Blockly editor with tabs, theme, language, and sound toggle.
- `app/globals.css` — Global styles, Tailwind layers, design tokens, and `.dark`/`.light` overrides.
- `components/ui/` — shadcn-style components (e.g., `button.tsx`, `select.tsx`).
- `public/i18n/` — Landing page i18n JSON files (`en.json`, `fr.json`).
- `media/` — Optional local Blockly sounds/icons if you choose to serve locally (see below).

## Getting Started
1. Install dependencies:
```bash
npm install
```
2. Run the dev server:
```bash
npm run dev
```
3. Open http://localhost:3000

## Theming
- Theme is stored as `localStorage` key `blockly-theme` with values `dark` or `light`.
- The root element gets `.dark` or `.light` and CSS variables are overridden accordingly in `app/globals.css`.

## Internationalization (i18n)
- Landing page strings are fetched from `/i18n/{lang}.json`.
- The selected language is stored as `localStorage` key `site-lang`.
- The editor reads `site-lang` on mount and loads corresponding Blockly messages (`blockly/msg/en` or `blockly/msg/fr`).
- Changing language in either place updates `site-lang` and keeps both in sync.

## Sound Control
- The editor injects Blockly with `sounds: true/false`.
- Mute state is stored in `localStorage` key `blockly-muted`.
- Toggling mute reinjects the workspace to apply the change without losing blocks.

### Using Local Media (Optional)
By default, Blockly loads its media from the CDN (`https://unpkg.com/blockly/media/`).
If you want to serve media locally:
- Move `media/` to `public/media/`.
- Update both Blockly `inject()` calls in `app/editor/page.tsx`:
```ts
media: "/media/",
```

## Scripts
- `dev` — Start the development server.
- `build` — Build the application.
- `start` — Start in production mode.
- `lint` — Lint the project (if configured).

## Deployment
- Any Next.js-compatible hosting can deploy this app.
- For Vercel/Netlify, just connect your Git repository and use the default Next.js build settings.

## Contributing
- Fork the repo, create a feature branch, open a PR.
- Please keep UI changes consistent with shadcn styles and project tokens.

## License
- Add your preferred license (e.g., MIT) and update this section accordingly.
