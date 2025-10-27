'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { 
  Code2, 
  Code, 
  ListChecks, 
  FunctionSquare,
  Variable,
  ListOrdered,
  TextCursorInput,
  Menu,
  X,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { useTranslation, SupportedLanguage } from "@/lib/hooks/useTranslation";
import { loadBlocklyMessages } from "@/lib/blockly-i18n";

// Import the block categories from a separate file to keep this clean
import { blockCategories } from "./blockDefinitions";

// Component to render Blockly blocks with i18n support
const BlocklyBlockRenderer = ({ blockXml, lang }: { blockXml: string | ((lang: SupportedLanguage) => string); lang: SupportedLanguage }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<any>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;

    const initBlockly = async () => {
      if (!containerRef.current || !blockXml) return;

      try {
        setStatus('loading');
        
        const [BlocklyCore, BlocklyBlocks, BlocklyJS] = await Promise.all([
          import('blockly/core'),
          import('blockly/blocks'),
          import('blockly/javascript')
        ]);

        const Blockly = BlocklyCore.default || BlocklyCore;

        try {
          const messages = await loadBlocklyMessages(lang);
          if (messages && typeof (Blockly as any).setLocale === 'function' && Object.keys(messages as any).length > 0) {
            (Blockly as any).setLocale(messages as any);
          }
        } catch (e) {
          console.warn('Failed to load Blockly messages');
        }

        if (!isMounted || !containerRef.current) return;

        containerRef.current.innerHTML = '';
        const workspaceDiv = document.createElement('div');
        workspaceDiv.style.height = '280px';
        workspaceDiv.style.width = '100%';
        containerRef.current.appendChild(workspaceDiv);

        const workspace = Blockly.inject(workspaceDiv, {
          readOnly: true,
          move: { scrollbars: false, drag: false, wheel: false },
          zoom: { controls: false, wheel: false, startScale: 1.0, maxScale: 1.5, minScale: 0.7 },
          trashcan: false,
          sounds: false,
          renderer: 'zelos',
          theme: Blockly.Themes.Classic,
          rtl: lang === 'ar'
        });

        workspaceRef.current = workspace;

        const xmlSrc = typeof blockXml === 'function' ? blockXml(lang) : blockXml;
        const xmlText = xmlSrc.trim().startsWith('<xml>') 
          ? xmlSrc 
          : `<xml xmlns="https://developers.google.com/blockly/xml">${xmlSrc}</xml>`;
        
        const parser = new DOMParser();
        const xmlDom = parser.parseFromString(xmlText, 'text/xml');
        
        const parseError = xmlDom.querySelector('parsererror');
        if (parseError) {
          throw new Error('Invalid XML format');
        }

        Blockly.Xml.domToWorkspace(xmlDom.documentElement, workspace);

        setTimeout(() => {
          if (!isMounted) return;
          
          const blocks = workspace.getTopBlocks(false);
          if (blocks.length > 0) {
            blocks.forEach((block: any) => {
              block.moveBy(10, 10);
            });

            workspace.zoomToFit();
            
            setTimeout(() => {
              if (isMounted) {
                const metrics = workspace.getMetrics();
                if (metrics) {
                  const scale = Math.min(
                    (metrics.viewWidth - 40) / metrics.contentWidth,
                    (metrics.viewHeight - 40) / metrics.contentHeight,
                    1.2
                  );
                  workspace.setScale(scale);
                  
                  const xOffset = (metrics.viewWidth - (metrics.contentWidth * scale)) / 2;
                  workspace.scroll(xOffset, 10);
                }
                setStatus('loaded');
              }
            }, 50);
          } else {
            setStatus('loaded');
          }
        }, 200);

      } catch (error: any) {
        console.error('Blockly rendering error:', error);
        if (isMounted) {
          setErrorMsg(error.message || 'Failed to render block');
          setStatus('error');
        }
      }
    };
    initBlockly();

    return () => {
      isMounted = false;
      if (workspaceRef.current) {
        try {
          workspaceRef.current.dispose();
          workspaceRef.current = null;
        } catch (e) {
          console.warn('Error disposing workspace:', e);
        }
      }
    };
  }, [blockXml, lang]);

  if (status === 'error') {
    return (
      <div className="w-full h-60 bg-muted rounded-md border flex flex-col items-center justify-center p-4">
        <p className="text-sm text-muted-foreground mb-2">⚠️ {t('docs.couldNotRenderBlock')}</p>
        {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-md border overflow-hidden relative">
      <div 
        ref={containerRef}
        className="w-full"
        style={{ minHeight: '280px', width: '100%' }}
      />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
          <p className="text-sm text-muted-foreground">{t('docs.loadingBlock')}</p>
        </div>
      )}
    </div>
  );
};

const BlockCard = ({ block, lang }: { block: any; lang: SupportedLanguage }) => {
  const { t } = useTranslation();
  
  const getXmlString = () => {
    if (typeof block.blockXml === 'function') {
      return block.blockXml(lang);
    }
    return block.blockXml || '';
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl font-mono">{t(block.nameKey)}</CardTitle>
        <CardDescription className="text-sm">{t(block.descriptionKey)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {block.blockXml && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold">{t('docs.visualBlock')}</h4>
              <button
                onClick={() => {
                  const xmlString = getXmlString();
                  const xmlWithTags = `<xml>${xmlString}</xml>`;
                  navigator.clipboard.writeText(xmlWithTags);
                }}
                className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                {t('docs.copyXML')}
              </button>
            </div>
            
            <div className="mb-3">
              <BlocklyBlockRenderer blockXml={block.blockXml} lang={lang} />
            </div>
            
            <details className="group mt-2">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t('docs.showXMLCode')}
              </summary>
              <div className="mt-2 relative">
                <pre className="bg-muted p-2 sm:p-4 rounded-md overflow-x-auto text-xs sm:text-sm border">
                  <code className="text-green-600 whitespace-pre-wrap break-all">{`<xml>\n  ${getXmlString()}\n</xml>`}</code>
                </pre>
                <button
                  onClick={() => {
                    const xmlString = getXmlString();
                    const xmlWithTags = `<xml>${xmlString}</xml>`;
                    navigator.clipboard.writeText(xmlWithTags);
                  }}
                  className="absolute top-2 right-2 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                  {t('docs.copyXML')}
                </button>
              </div>
            </details>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-semibold mb-2">{t('docs.generatedCode')}</h4>
          <pre className="bg-muted p-3 sm:p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
            <code>{t(block.codeKey)}</code>
          </pre>
        </div>
        
        {block.exampleKey && (
          <div className="text-xs sm:text-sm text-muted-foreground pt-2 border-t">
            <span className="font-medium">{t('docs.example')}</span> {t(block.exampleKey)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BlockCategory = ({ category, lang }: { category: any; lang: SupportedLanguage }) => {
  const { t } = useTranslation();
  
  return (
    <div id={category.id} className="mb-8 sm:mb-12 scroll-mt-30">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          {category.icon}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold">{t(category.nameKey)}</h2>
      </div>
      <div className="space-y-6">
        {category.blocks.map((block: any, i: number) => (
          <BlockCard key={`${category.id}-${i}`} block={block} lang={lang} />
        ))}
      </div>
    </div>
  );
};

export default function DocsPage() {
  const { t, lang, changeLanguage, isLoading } = useTranslation();
  // DocsPage no longer needs to manually sync language; useTranslation handles it globally

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Main Content */}
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{t('docs.title')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('docs.subtitle')}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Mobile categories as a drawer sheet (fixed under navbar) */}
          <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto px-4 py-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <Menu className="size-4 mr-2" />
                    {t('docs.categories')}
                  </Button>
                </SheetTrigger>
                <SheetContent side={lang === 'ar' ? 'right' : 'left'} className="z-[80] w-[85vw] sm:w-[360px]">
                  <SheetTitle className="sr-only">{t('docs.categories')}</SheetTitle>
                  <div className="pt-2">
                    <h3 className="text-lg font-semibold mb-4">{t('docs.categories')}</h3>
                    <ScrollArea className="h-[calc(100vh-160px)] pr-3">
                      <div className="space-y-2">
                        {blockCategories.map((category) => (
                          <div key={category.id}>
                            <SheetClose asChild>
                              <a 
                                href={`#${category.id}`}
                                className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                              >
                                <span className="p-2 rounded-md bg-primary/10 text-primary">
                                  {category.icon}
                                </span>
                                <span className="font-medium">{t(category.nameKey)}</span>
                              </a>
                            </SheetClose>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          {/* Spacer to prevent overlap with fixed bar on mobile */}
          <div className="lg:hidden h-12" />

          {/* Desktop sidebar remains sticky */}
          <div className="hidden lg:block lg:w-1/4 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-lg font-semibold mb-4">{t('docs.categories')}</h3>
              <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                <div className="space-y-2">
                  {blockCategories.map((category) => (
                    <div key={category.id}>
                      <a 
                        href={`#${category.id}`}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                      >
                        {category.icon}
                        <span>{t(category.nameKey)}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex-1 lg:w-3/4">
            {blockCategories.map((category) => (
              <BlockCategory key={category.id} category={category} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
