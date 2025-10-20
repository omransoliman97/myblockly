"use client";
import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

type UiLang = "en" | "fr";

export default function Home() {
  const [uiLang, setUiLang] = useState<UiLang>("en");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [t, setT] = useState<any>({});

  useEffect(() => {
    // Theme init
    const savedTheme = localStorage.getItem("blockly-theme");
    const dark = savedTheme === "dark";
    setIsDarkMode(dark);
    const root = document.documentElement;
    root.classList.remove(dark ? "light" : "dark");
    root.classList.add(dark ? "dark" : "light");
  }, []);

  useEffect(() => {
    // Language init
    const savedLang = (localStorage.getItem("site-lang") as UiLang) || "en";
    setUiLang(savedLang);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/i18n/${uiLang}.json`);
        const json = await res.json();
        setT(json);
      } catch {
        // fallback
        setT({
          title: "Build with Blocks. Learn by Doing.",
          subtitle: "Design programs visually using Blockly. Switch languages, toggle dark mode, and export your projects with a single click.",
          openEditor: "Open Editor",
          exploreFeatures: "Explore Features",
          features: [
            "Drag & drop blocks",
            "Code preview (JS/Python/PHP)",
            "Dark / Light themes",
            "Import/Export XML",
          ],
          language: "Language",
          theme: "Theme",
        });
      }
    }
    load();
  }, [uiLang]);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    const root = document.documentElement;
    root.classList.remove(next ? "light" : "dark");
    root.classList.add(next ? "dark" : "light");
    localStorage.setItem("blockly-theme", next ? "dark" : "light");
  };

  return (
    
    
    <div className="blockly-page" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-BNLPSLHQHF" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-BNLPSLHQHF');
      `}</Script>
      {/* Top controls */}
      <div className="absolute mb-8 flex gap-8 top-8 ">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/">Home</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/editor">Editor</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/docs">Docs</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
      </div>
      
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8, alignItems: "center" }}>
        
        <Button onClick={toggleDarkMode} size="icon" variant="outline" aria-label="Toggle theme">
          {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        
        <Select
          value={uiLang}
          onValueChange={(lang: UiLang) => {
            setUiLang(lang);
            localStorage.setItem("site-lang", lang);
          }}
        >
          <SelectTrigger size="sm" aria-label="Language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="it">Italiano</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="nl">Nederlands</SelectItem>
              <SelectItem value="tr">Türkçe</SelectItem>
               <SelectItem value="pl">Polski</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
              <SelectItem value="ru">Русский</SelectItem>
              <SelectItem value="id">Bahasa Indonesia</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="ko">한국어</SelectItem>
              <SelectItem value="vi">Tiếng Việt</SelectItem>
              <SelectItem value="th">ไทย</SelectItem>
              <SelectItem value="uk">Українська</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Background accents */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 380, height: 380, filter: "blur(80px)", opacity: 0.25, background: "radial-gradient(50% 50% at 50% 50%, #9810FA 0%, rgba(152,16,250,0) 70%)" }} />
        <div style={{ position: "absolute", bottom: -140, left: -140, width: 420, height: 420, filter: "blur(80px)", opacity: 0.22, background: "radial-gradient(50% 50% at 50% 50%, #10B981 0%, rgba(16,185,129,0) 70%)" }} />
      </div>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 1, padding: 24, textAlign: "center", display: "flex", flexDirection: "column", gap: 16, alignItems: "center", maxWidth: 920 }}>
        <div style={{ fontWeight: 900, fontSize: 42, lineHeight: 1.1, letterSpacing: -0.5,
          background: "linear-gradient(90deg, #9810FA 0%, #10B981 100%)",
          WebkitBackgroundClip: "text" as any,
          backgroundClip: "text",
          color: "transparent"
        }}>
          {t?.title || "Build with Blocks. Learn by Doing."}
        </div>

        <p style={{ opacity: 0.85, maxWidth: 720, fontSize: 16 }}>{t?.subtitle}</p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
          <Button asChild>
            <a href="/editor" style={{ textDecoration: "none" }}>{t?.openEditor}</a>
          </Button>
        </div>

        {/* Feature chips */}
        <div id="features" style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
          {(t?.features || []).map((txt: string) => (
            <span key={txt} style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.12)", fontSize: 12, opacity: 0.9 }}>
              {txt}
            </span>
          ))}
        </div>
      </div>
      {/* Footer */}
      <footer style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center", fontSize: 12, opacity: 0.8 }}>
        © 2025 <a href="https://www.instagram.com/omran.soliman97/" target="_blank" rel="noopener noreferrer">Omran SOLIMAN</a>. All rights reserved.
      </footer>
    </div>
  );
}
