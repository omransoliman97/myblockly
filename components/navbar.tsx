"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation, SupportedLanguage } from "@/lib/hooks/useTranslation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";

type UiLang = "en" | "fr" | "es" | "it" | "pt" | "de" | "nl" | "tr" | "pl" | "hi" | "ru" | "id" | "ja" | "zh" | "ko" | "vi" | "th" | "uk" | "ar";

export function Navbar() {
  const [uiLang, setUiLang] = useState<UiLang>((typeof window !== "undefined" && (localStorage.getItem("site-lang") as UiLang)) || "en");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, lang, changeLanguage } = useTranslation();

  useEffect(() => {
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("blockly-theme") : null;
    const dark = savedTheme === "dark";
    setIsDarkMode(dark);
    const root = document.documentElement;
    root.classList.remove(dark ? "light" : "dark");
    root.classList.add(dark ? "dark" : "light");
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    const root = document.documentElement;
    root.classList.remove(next ? "light" : "dark");
    root.classList.add(next ? "dark" : "light");
    localStorage.setItem("blockly-theme", next ? "dark" : "light");
    window.dispatchEvent(new CustomEvent("theme-changed"));
  };

  // Keep local select value in sync with global language
  useEffect(() => {
    if (lang && lang !== uiLang) {
      setUiLang(lang as UiLang);
    }
  }, [lang]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="sm:hidden" size="icon" variant="outline" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="z-[80]">
              <SheetTitle className="sr-only">{t('nav.menu', 'Navigation Menu')}</SheetTitle>
              <nav className="flex flex-col gap-1 p-2">
                <SheetClose asChild>
                  <Link href="/" className="px-2 py-2 rounded-md hover:bg-accent">{t('nav.home','Home')}</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/editor" className="px-2 py-2 rounded-md hover:bg-accent">{t('nav.editor','Editor')}</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/docs" className="px-2 py-2 rounded-md hover:bg-accent">{t('nav.docs','Docs')}</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/about" className="px-2 py-2 rounded-md hover:bg-accent">{t('nav.about','About')}</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/donation" className="px-2 py-2 rounded-md hover:bg-accent">{t('nav.donation','Donation')}</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/contact" className="px-2 py-2 rounded-md hover:bg-accent">{t('nav.contact','Contact')}</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/exercises" className="px-2 py-2 rounded-md hover:bg-accent">{t('nav.exercises','Exercises')}</Link>
                </SheetClose>
              </nav>
              <div className="p-2 mt-2 flex items-center gap-2">
                <Button onClick={toggleDarkMode} size="icon" variant="outline" aria-label="Toggle theme">
                  {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
                <Select
                  value={uiLang}
                  onValueChange={(lang: UiLang) => {
                    setUiLang(lang);
                    changeLanguage(lang as SupportedLanguage);
                  }}
                >
                  <SelectTrigger size="sm" aria-label="Language" className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" className="z-[90]">
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
              <div className="p-2">
                <SheetClose asChild>
                  <Button className="w-full" variant="secondary">{t('nav.close','Close Menu')}</Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="font-black text-[20px] sm:text-[24px] leading-[1.1] tracking-[-0.5px] gradient-text-myblockly">MyBlockly</Link>
        </div>
        <div className="flex-1 hidden md:flex items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">{t('nav.home','Home')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/editor">{t('nav.editor','Editor')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/docs">{t('nav.docs','Docs')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/about">{t('nav.about','About')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/donation">{t('nav.donation','Donation')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/contact">{t('nav.contact','Contact')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/exercises">{t('nav.exercises','Exercises')}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button onClick={toggleDarkMode} size="icon" variant="outline" aria-label="Toggle theme">
            {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Select
            value={uiLang}
            onValueChange={(lang: UiLang) => {
              setUiLang(lang);
              changeLanguage(lang as SupportedLanguage);
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
      </div>
    </div>
  );
}

export default Navbar;
