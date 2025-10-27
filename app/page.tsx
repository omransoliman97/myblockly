"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function Home() {
  const { t, translations, isLoading } = useTranslation();

  return (
    <>
    {isLoading ? (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    ) : (

    <div className="blockly-page relative min-h-screen w-full flex items-center justify-center">
      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-BNLPSLHQHF" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-BNLPSLHQHF');
      `}</Script>
      {/* Background accents */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute" style={{ top: -120, right: -120, width: 380, height: 380, filter: "blur(80px)", opacity: 0.25, background: "radial-gradient(50% 50% at 50% 50%, #9810FA 0%, rgba(152,16,250,0) 70%)" }} />
        <div className="absolute" style={{ bottom: -140, left: -140, width: 420, height: 420, filter: "blur(80px)", opacity: 0.22, background: "radial-gradient(50% 50% at 50% 50%, #10B981 0%, rgba(16,185,129,0) 70%)" }} />
      </div>

      {/* Hero */}
      <div className="relative z-[1] w-full px-4 py-8 text-center flex flex-col gap-5 items-center">
        <div className="font-black tracking-[-0.5px] leading-tight text-3xl sm:text-4xl md:text-5xl" style={{
          background: "linear-gradient(90deg, #9810FA 0%, #10B981 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent"
        }}>
          {t('title','Build with Blocks. Learn by Doing.')}
        </div>

        <p className="opacity-85 max-w-none text-sm sm:text-base md:text-lg">{t('subtitle','Design programs visually using Blockly. Switch languages, toggle dark mode, and export your projects with a single click.')}</p>

        <div className="flex gap-3 flex-wrap items-center justify-center">
          <Button asChild>
            <a href="/editor" className="no-underline">{t('openEditor','Open Editor')}</a>
          </Button>
        </div>

        {/* Feature chips */}
        <div id="features" className="flex gap-2 flex-wrap justify-center mt-3">
          {((translations as any)?.features || []).map((txt: string) => (
            <span key={txt} className="px-2.5 py-1.5 rounded-full border text-[12px] opacity-90">
              {txt}
            </span>
          ))}
        </div>
      </div>
      
    </div>
    )}
    </>
  );
}
