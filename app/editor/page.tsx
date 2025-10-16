"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import type { WorkspaceSvg } from "blockly/core";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Volume2, VolumeX, Play, FolderOpen, Save } from "lucide-react";

export default function Home() {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const workspaceRef = useRef<WorkspaceSvg | null>(null);
  const toolboxXmlRef = useRef<string>("");
  const resizeHandlerRef = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);
  type Tab = "blocks" | "javascript" | "python" | "php" | "xml" | "json";
  const [activeTab, setActiveTab] = useState<Tab>("blocks");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [filename, setFilename] = useState("blockly_project");
  const [uiLang, setUiLang] = useState<"en" | "fr">("en");
  const [t, setT] = useState<any>({});

  const CATEGORY_LABELS: Record<"en" | "fr", Record<string, string>> = {
    en: {
      logic: "Logic",
      loops: "Loops",
      math: "Math",
      text: "Text",
      lists: "Lists",
      variables: "Variables",
      functions: "Functions",
    },
    fr: {
      logic: "Logique",
      loops: "Boucles",
      math: "Maths",
      text: "Texte",
      lists: "Listes",
      variables: "Variables",
      functions: "Fonctions",
    },
  };

  const buildToolboxXml = (lang: "en" | "fr") => `
    <xml id="toolbox" style="display: none">
      <category name="${CATEGORY_LABELS[lang].logic}" colour="#5C81A6">
        <block type="controls_if"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_boolean"></block>
        <block type="logic_negate"></block>
        <block type="logic_null"></block>
        <block type="logic_ternary"></block>
      </category>
      <category name="${CATEGORY_LABELS[lang].loops}" colour="#5CA65C">
        <block type="controls_repeat_ext">
          <value name="TIMES">
            <shadow type="math_number">
              <field name="NUM">10</field>
            </shadow>
          </value>
        </block>
        <block type="controls_whileUntil"></block>
        <block type="controls_for">
          <value name="FROM">
            <shadow type="math_number"><field name="NUM">1</field></shadow>
          </value>
          <value name="TO">
            <shadow type="math_number"><field name="NUM">10</field></shadow>
          </value>
          <value name="BY">
            <shadow type="math_number"><field name="NUM">1</field></shadow>
          </value>
        </block>
        <block type="controls_forEach"></block>
        <block type="controls_flow_statements"></block>
      </category>
      <category name="${CATEGORY_LABELS[lang].math}" colour="#5C68A6">
        <block type="math_number"></block>
        <block type="math_arithmetic"></block>
        <block type="math_single"></block>
        <block type="math_trig"></block>
        <block type="math_constant"></block>
        <block type="math_number_property"></block>
        <block type="math_round"></block>
        <block type="math_on_list"></block>
        <block type="math_modulo"></block>
        <block type="math_constrain">
          <value name="LOW"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <value name="HIGH"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
        </block>
        <block type="math_random_int">
          <value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <value name="TO"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
        </block>
        <block type="math_random_float"></block>
      </category>
      <category name="${CATEGORY_LABELS[lang].text}" colour="#5CA68D">
        <block type="text"></block>
        <block type="text_join"></block>
        <block type="text_append"></block>
        <block type="text_length"></block>
        <block type="text_isEmpty"></block>
        <block type="text_indexOf"></block>
        <block type="text_charAt"></block>
        <block type="text_getSubstring"></block>
        <block type="text_changeCase"></block>
        <block type="text_trim"></block>
        <block type="text_print"></block>
        <block type="text_prompt_ext"></block>
      </category>
      <category name="${CATEGORY_LABELS[lang].lists}" colour="#745CA6">
        <block type="lists_create_with"><mutation items="3"></mutation></block>
        <block type="lists_repeat">
          <value name="NUM"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
        </block>
        <block type="lists_length"></block>
        <block type="lists_isEmpty"></block>
        <block type="lists_indexOf"></block>
        <block type="lists_getIndex"></block>
        <block type="lists_setIndex"></block>
        <block type="lists_getSublist"></block>
        <block type="lists_split"></block>
        <block type="lists_sort"></block>
        <block type="lists_reverse"></block>
      </category>
      <sep></sep>
      <category name="${CATEGORY_LABELS[lang].variables}" colour="#A65C81" custom="VARIABLE"></category>
      <category name="${CATEGORY_LABELS[lang].functions}" colour="#A6745C" custom="PROCEDURE"></category>
    </xml>
  `;

  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | null = null;

    const savedLang = (typeof window !== 'undefined' ? (localStorage.getItem('site-lang') as "en" | "fr" | null) : null) || 'en';
    if (uiLang !== savedLang) setUiLang(savedLang);

    // Read initial mute before injecting (state may lag)
    const initialMuted = (typeof window !== 'undefined' ? localStorage.getItem('blockly-muted') === 'true' : false);

    async function initBlockly() {
      const Blockly = await import("blockly/core");
      const getThemed = (dark: boolean) => {
        const name = dark ? 'MyDark' : 'MyLight';
        const reg = (Blockly as any).registry;
        const existing = reg?.getClass?.((Blockly as any).registry.Type.THEME, name);
        if (existing) return existing;
        const base = (dark && (Blockly as any).Themes?.Dark)
          ? (Blockly as any).Themes.Dark
          : (Blockly as any).Themes?.Classic || undefined;
        return (Blockly as any).Theme.defineTheme(name, {
          base,
          componentStyles: {
            toolboxForegroundColour: dark ? '#fff' : '#000',
            flyoutForegroundColour: dark ? '#fff' : '#000',
            flyoutForegroundOpacity: 1,
            toolboxBackgroundColour: dark ? '#15171c' : '#e5e7eb',
            flyoutBackgroundColour: dark ? '#1a1d24' : '#e5e7eb',
            scrollbarColour: dark ? '#6b7280' : '#9ca3af',
          },
        });
      };
      // Load locale messages BEFORE registering built-in blocks
      try {
        let messages: any;
        if (savedLang === 'fr') {
          try { messages = await import("blockly/msg/fr"); }
          catch { messages = await import("blockly/msg/en"); }
        } else {
          messages = await import("blockly/msg/en");
        }
        const msgObj = messages.default || messages;
        if (msgObj && typeof msgObj === 'object') {
          Object.assign(Blockly.Msg, msgObj);
        }
      } catch {}
      await import("blockly/blocks");

      if (!isMounted || !blocklyDivRef.current) return;

      toolboxXmlRef.current = buildToolboxXml(savedLang);

      const isDark = document.documentElement.classList.contains('dark');
      const theme = getThemed(isDark);
      const gridColour = isDark ? '#2b313d' : '#e5e7eb';

      const workspace = Blockly.inject(blocklyDivRef.current, {
        toolbox: Blockly.utils.xml.textToDom(toolboxXmlRef.current),
        collapse: true,
        comments: true,
        disable: false,
        maxBlocks: Infinity,
        trashcan: true,
        horizontalLayout: false,
        toolboxPosition: "start",
        css: true,
        media: "https://unpkg.com/blockly/media/",
        sounds: !initialMuted,
        renderer: "zelos",
        theme,
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
          pinch: true
        },
        move: {
          scrollbars: true,
          drag: true,
          wheel: true
        },
        grid: {
          spacing: 24,
          length: 1, // dotted grid
          colour: gridColour,
          snap: false
        }
      });

      workspaceRef.current = workspace;
      setReady(true);

      // Generate initial code and subscribe to workspace changes
      const changeListener = () => {
        updateGeneratedCode();
      };
      workspace.addChangeListener(changeListener);

      // Restore from autosave (used when switching languages via reload)
      try {
        const saved = window.localStorage.getItem("blockly_autosave_xml");
        if (saved) {
          const xml = Blockly.utils.xml.textToDom(saved);
          Blockly.Xml.domToWorkspace(xml, workspace);
          window.localStorage.removeItem("blockly_autosave_xml");
        }
      } catch {}

      const resize = () => {
        Blockly.svgResize(workspace);
      };
      resizeHandlerRef.current = resize;
      window.addEventListener("resize", resize);

      cleanup = () => {
        window.removeEventListener("resize", resize);
        workspace.dispose();
      };
    }

    // Initialize theme and sound: default to light mode, sounds on; use saved preference if present
    const savedTheme = localStorage.getItem("blockly-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      // Default to light mode
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("blockly-theme", "light");
    }

    const savedMuted = localStorage.getItem("blockly-muted");
    if (savedMuted === "true") setIsMuted(true);

    initBlockly();

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  // Load editor UI translations from public/i18n based on uiLang
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/i18n/${uiLang}.json`);
        const json = await res.json();
        setT(json);
      } catch {
        setT({
          language: "Language",
          runProject: "Run Project",
          loadProject: "Load Project",
          saveProject: "Save Project",
        });
      }
    }
    load();
  }, [uiLang]);

  // Generate code based on selected tab (or an override when switching tabs)
  const updateGeneratedCode = async (tabOverride?: Tab) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const tab = tabOverride || activeTab;
    try {
      if (tab === "javascript") {
        const { javascriptGenerator } = await import("blockly/javascript");
        const code = javascriptGenerator.workspaceToCode(workspace);
        setGeneratedCode(code || "");
      } else if (tab === "python") {
        const { pythonGenerator } = await import("blockly/python");
        const code = pythonGenerator.workspaceToCode(workspace);
        setGeneratedCode(code || "");
      } else if (tab === "php") {
        const { phpGenerator } = await import("blockly/php");
        const code = (phpGenerator as unknown as { workspaceToCode(ws: WorkspaceSvg): string }).workspaceToCode(workspace);
        setGeneratedCode(code || "");
      } else if (tab === "xml") {
        const Blockly = await import("blockly/core");
        const xmlDom = Blockly.Xml.workspaceToDom(workspace);
        const xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        setGeneratedCode(xmlText);
      } else if (tab === "json") {
        const Blockly = await import("blockly/core");
        const json = (Blockly.serialization as unknown as { workspaces: { save(ws: WorkspaceSvg): unknown } }).workspaces.save(workspace);
        setGeneratedCode(JSON.stringify(json, null, 2));
      } else {
        setGeneratedCode("");
      }
    } catch (err) {
      console.error("Failed generating code:", err);
      setGeneratedCode("// Failed to generate code");
    }
  };

  const handleDownload = async (format: 'xml' | 'txt') => {
    if (!workspaceRef.current) return;
    
    const Blockly = await import("blockly/core");
    const xmlDom = Blockly.Xml.workspaceToDom(workspaceRef.current);
    const xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    
    let content: string;
    let downloadFilename: string;
    let mimeType: string;
    
    // Clean filename (remove invalid characters)
    const cleanFilename = filename.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'blockly_project';
    
    if (format === 'txt') {
      // Save as TXT
      content = xmlText;
      downloadFilename = `${cleanFilename}.txt`;
      mimeType = "text/plain";
    } else {
      // Save as XML (default)
      content = xmlText;
      downloadFilename = `${cleanFilename}.xml`;
      mimeType = "text/xml";
    }
    
    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowSaveModal(false);
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleLoadFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !workspaceRef.current) return;
    const text = await file.text();
    const Blockly = await import("blockly/core");
    try {
      const xml = Blockly.utils.xml.textToDom(text);
      workspaceRef.current.clear();
      Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
    } catch (err) {
      // Basic guard: invalid XML
      alert("Failed to load XML. Please ensure the file is a valid Blockly export.");
      console.error(err);
    } finally {
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Removed human language switching

  const handleRun = async () => {
    if (!workspaceRef.current) return;
    try {
      const { javascriptGenerator } = await import("blockly/javascript");
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      // Execute in a sandboxed function scope with console available
      const runner = new Function("console", `"use strict";\n${code}`);
      runner(window.console);
    } catch (err) {
      alert("Failed to run project. See console for details.");
      console.error(err);
    }
  };

  const handleTabClick = async (tab: Tab) => {
    setActiveTab(tab);
    await updateGeneratedCode(tab);
  };

  // Also regenerate when the active tab changes (e.g., initial mount or state changes)
  useEffect(() => {
    updateGeneratedCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, uiLang]);

  const changeLocaleAndReload = async (lang: "en" | "fr") => {
    try { localStorage.setItem('site-lang', lang); } catch {}
    if (!workspaceRef.current) return;
    const Blockly = await import("blockly/core");
    
    // Save current workspace
    const xmlDom = Blockly.Xml.workspaceToDom(workspaceRef.current);
    const xmlText = Blockly.Xml.domToText(xmlDom);

    // Load locale messages
    try {
      let messages;
      if (lang === "fr") {
        try { messages = await import("blockly/msg/fr"); }
        catch { messages = await import("blockly/msg/en"); }
      } else {
        messages = await import("blockly/msg/en");
      }
      
      // Apply locale messages
      const msgObj = messages.default || messages;
      console.log(`Loading locale ${lang}:`, msgObj);
      if (msgObj && typeof msgObj === 'object') {
        Object.assign(Blockly.Msg, msgObj);
        console.log(`Applied locale ${lang}, sample message:`, Blockly.Msg.LOGIC_OPERATION_AND || 'not found');
      }
    } catch (e) {
      console.error("Failed to load locale", lang, e);
      // Fallback to English if French fails
      try {
        const messages = await import("blockly/msg/en");
        const msgObj = messages.default || messages;
        if (msgObj && typeof msgObj === 'object') {
          Object.assign(Blockly.Msg, msgObj);
        }
      } catch {}
    }

    // Re-register blocks with new locale
    await import("blockly/blocks");

    // Clean up current workspace
    if (resizeHandlerRef.current) {
      window.removeEventListener("resize", resizeHandlerRef.current);
    }
    workspaceRef.current.dispose();

    // Rebuild toolbox with translated labels
    toolboxXmlRef.current = buildToolboxXml(lang);

    // Re-inject workspace
    const theme = ((): any => {
      const dark = document.documentElement.classList.contains('dark');
      const name = dark ? 'MyDark' : 'MyLight';
      const reg = (Blockly as any).registry;
      const existing = reg?.getClass?.((Blockly as any).registry.Type.THEME, name);
      if (existing) return existing;
      const base = (dark && (Blockly as any).Themes?.Dark)
        ? (Blockly as any).Themes.Dark
        : (Blockly as any).Themes?.Classic || undefined;
      return (Blockly as any).Theme.defineTheme(name, {
        base,
        componentStyles: {
          toolboxForegroundColour: dark ? '#fff' : '#000',
          flyoutForegroundColour: dark ? '#fff' : '#000',
          flyoutForegroundOpacity: 1,
          toolboxBackgroundColour: dark ? '#15171c' : '#e5e7eb',
          flyoutBackgroundColour: dark ? '#1a1d24' : '#e5e7eb',
          scrollbarColour: dark ? '#6b7280' : '#9ca3af',
        },
      });
    })();

    const isDark = document.documentElement.classList.contains('dark');
    const newWorkspace = Blockly.inject(blocklyDivRef.current as HTMLDivElement, {
      toolbox: Blockly.utils.xml.textToDom(toolboxXmlRef.current),
      collapse: true,
      comments: true,
      disable: false,
      maxBlocks: Infinity,
      trashcan: true,
      horizontalLayout: false,
      toolboxPosition: "start",
      css: true,
      media: "https://unpkg.com/blockly/media/",
      sounds: false,
      renderer: "zelos",
      theme,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
        pinch: true
      },
      move: {
        scrollbars: true,
        drag: true,
        wheel: true
      },
      grid: {
        spacing: 24,
        length: 1,
        colour: isDark ? '#2b313d' : '#e5e7eb',
        snap: false
      }
    });

    // Restore blocks
    try {
      const savedXml = Blockly.utils.xml.textToDom(xmlText);
      Blockly.Xml.domToWorkspace(savedXml, newWorkspace);
    } catch {}

    workspaceRef.current = newWorkspace as WorkspaceSvg;
    const changeListener = () => updateGeneratedCode();
    newWorkspace.addChangeListener(changeListener);
    const resize = () => Blockly.svgResize(newWorkspace);
    resizeHandlerRef.current = resize;
    window.addEventListener("resize", resize);
    Blockly.svgResize(newWorkspace);
  };

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    const root = document.documentElement;
    root.classList.remove(newDarkMode ? 'light' : 'dark');
    root.classList.add(newDarkMode ? 'dark' : 'light');
    localStorage.setItem('blockly-theme', newDarkMode ? 'dark' : 'light');

    try {
      const Blockly = await import("blockly/core");
      if (workspaceRef.current) {
        const name = newDarkMode ? 'MyDark' : 'MyLight';
        const reg = (Blockly as any).registry;
        let theme = reg?.getClass?.((Blockly as any).registry.Type.THEME, name);
        if (!theme) {
          const base = (newDarkMode && (Blockly as any).Themes?.Dark)
            ? (Blockly as any).Themes.Dark
            : (Blockly as any).Themes?.Classic || undefined;
          theme = (Blockly as any).Theme.defineTheme(name, {
            base,
            componentStyles: {
              toolboxForegroundColour: newDarkMode ? '#fff' : '#000',
              flyoutForegroundColour: newDarkMode ? '#fff' : '#000',
              flyoutForegroundOpacity: 1,
              toolboxBackgroundColour: newDarkMode ? '#15171c' : '#e5e7eb',
              flyoutBackgroundColour: newDarkMode ? '#1a1d24' : '#e5e7eb',
              scrollbarColour: newDarkMode ? '#6b7280' : '#9ca3af',
            },
          });
        }
        // @ts-ignore - setTheme exists on WorkspaceSvg
        workspaceRef.current.setTheme(theme);
      }
    } catch {}

  try {
    const Blockly = await import("blockly/core");
    if (workspaceRef.current) {
      const name = newDarkMode ? 'MyDark' : 'MyLight';
      const reg = (Blockly as any).registry;
      let theme = reg?.getClass?.((Blockly as any).registry.Type.THEME, name);
      if (!theme) {
        const base = (newDarkMode && (Blockly as any).Themes?.Dark)
          ? (Blockly as any).Themes.Dark
          : (Blockly as any).Themes?.Classic || undefined;
        theme = (Blockly as any).Theme.defineTheme(name, {
          base,
          componentStyles: {
            toolboxForegroundColour: newDarkMode ? '#fff' : '#000',
            flyoutForegroundColour: newDarkMode ? '#fff' : '#000',
            flyoutForegroundOpacity: 1,
            toolboxBackgroundColour: newDarkMode ? '#15171c' : '#e5e7eb',
            flyoutBackgroundColour: newDarkMode ? '#1a1d24' : '#e5e7eb',
            scrollbarColour: newDarkMode ? '#6b7280' : '#9ca3af',
          },
        });
      }
      // @ts-ignore - setTheme exists on WorkspaceSvg
      workspaceRef.current.setTheme(theme);
    }
  } catch {}
};

// Reinject workspace preserving blocks and respecting current options (lang, sounds, theme)
const reinjectWorkspace = async (opts?: { soundsEnabled?: boolean }) => {
  if (!workspaceRef.current) return;
  const Blockly = await import("blockly/core");
  // Save current workspace
  const xmlDom = Blockly.Xml.workspaceToDom(workspaceRef.current);
  const xmlText = Blockly.Xml.domToText(xmlDom);

  // Dispose current
  if (resizeHandlerRef.current) {
    window.removeEventListener("resize", resizeHandlerRef.current);
  }
  workspaceRef.current.dispose();

  // Theme
  const dark = document.documentElement.classList.contains('dark');
  const name = dark ? 'MyDark' : 'MyLight';
  const reg = (Blockly as any).registry;
  let theme = reg?.getClass?.((Blockly as any).registry.Type.THEME, name);
  if (!theme) {
    const base = (dark && (Blockly as any).Themes?.Dark)
      ? (Blockly as any).Themes.Dark
      : (Blockly as any).Themes?.Classic || undefined;
    theme = (Blockly as any).Theme.defineTheme(name, {
      base,
      componentStyles: {
        toolboxForegroundColour: dark ? '#fff' : '#000',
        flyoutForegroundColour: dark ? '#fff' : '#000',
        flyoutForegroundOpacity: 1,
        toolboxBackgroundColour: dark ? '#15171c' : '#e5e7eb',
        flyoutBackgroundColour: dark ? '#1a1d24' : '#e5e7eb',
        scrollbarColour: dark ? '#6b7280' : '#9ca3af',
      },
    });
  }

  // Re-inject
  const newWorkspace = Blockly.inject(blocklyDivRef.current as HTMLDivElement, {
    toolbox: Blockly.utils.xml.textToDom(toolboxXmlRef.current),
    collapse: true,
    comments: true,
    disable: false,
    maxBlocks: Infinity,
    trashcan: true,
    horizontalLayout: false,
    toolboxPosition: "start",
    css: true,
    media: "https://unpkg.com/blockly/media/",
    sounds: opts?.soundsEnabled ?? !isMuted,
    renderer: "zelos",
    theme,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
      pinch: true
    },
    move: {
      scrollbars: true,
      drag: true,
      wheel: true
    },
    grid: {
      spacing: 24,
      length: 1,
      colour: dark ? '#2b313d' : '#e5e7eb',
      snap: false
    }
  });

  // Restore blocks
  try {
    const savedXml = Blockly.utils.xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(savedXml, newWorkspace);
  } catch {}

  workspaceRef.current = newWorkspace as WorkspaceSvg;
  const changeListener = () => updateGeneratedCode();
  newWorkspace.addChangeListener(changeListener);
  const resize = () => Blockly.svgResize(newWorkspace);
  resizeHandlerRef.current = resize;
  window.addEventListener("resize", resize);
  Blockly.svgResize(newWorkspace);
};

const toggleMute = async () => {
  const next = !isMuted;
  setIsMuted(next);
  localStorage.setItem('blockly-muted', String(next));
  // Pass explicit soundsEnabled to avoid race with async state update
  await reinjectWorkspace({ soundsEnabled: !next });
};

return (
  <div className="blockly-page" style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: "100vh" }}>
    {/* Google Analytics */}
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-BNLPSLHQHF" strategy="afterInteractive" />
    <Script id="gtag-init" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-BNLPSLHQHF');
    `}</Script>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between"}}>
      <div style={{ fontWeight: 700, fontSize: 22, lineHeight: "20px", color:"#9810FA"}}><a href="/">My Blockly</a></div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 20 }}>
        <Button onClick={toggleDarkMode} size="icon" variant="outline" aria-label="Toggle theme" style={{ minWidth: "auto", padding: "8px 12px" }}>
          {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <Button onClick={toggleMute} size="icon" variant="outline" aria-label="Toggle sound" style={{ minWidth: "auto", padding: "8px 12px" }}>
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </Button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label htmlFor="ui-lang" style={{ fontSize: 12, opacity: 0.8 }}>{t?.language || 'Language'}</label>
          <Select
            value={uiLang}
            onValueChange={async (newLang: "en" | "fr") => {
              setUiLang(newLang);
              localStorage.setItem('site-lang', newLang);
              await changeLocaleAndReload(newLang);
            }}
          >
            <SelectTrigger id="ui-lang" size="sm" aria-label="Language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleRun} disabled={!ready}>
          <Play className="size-4" style={{ marginRight: 6 }} />{t?.runProject || 'Run Project'}
        </Button>
        <Button onClick={handleOpenFilePicker}>
          <FolderOpen className="size-4" style={{ marginRight: 6 }} />{t?.loadProject || 'Load Project'}
        </Button>
        <Button onClick={() => { setFilename("blockly_project"); setShowSaveModal(true); }} disabled={!ready}>
          <Save className="size-4" style={{ marginRight: 6 }} />{t?.saveProject || 'Save Project'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xml,text/xml,application/xml"
          onChange={handleLoadFile}
          style={{ display: "none" }}
        />
      </div>
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      {(["blocks","javascript","python","php","xml","json"] as Tab[]).map((tab) => (
        <Button
          key={tab}
          onClick={() => handleTabClick(tab)}
          style={{ opacity: activeTab === tab ? 1 : 0.6 }}
        >
          {tab === "blocks" ? "Blocks" : tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Button>
      ))}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
      <div className="blocklyArea" style={{ display: activeTab === "blocks" ? "block" : "none", flex: 1 }}>
        <div ref={blocklyDivRef} className="blocklyDiv" />
      </div>
      {activeTab !== "blocks" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <label style={{ display: "block", marginBottom: 6 }}>Generated code ({activeTab}):</label>
          <textarea
            readOnly
            value={generatedCode}
            spellCheck={false}
            style={{ width: "100%", flex: 1, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, padding: 8, borderRadius: 6, border: "1px solid rgba(0,0,0,0.15)", background: "var(--background)", color: "var(--foreground)" }}
          />
        </div>
      )}
    </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            minWidth: '300px',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Save Project</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                File name:
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '14px'
                }}
                placeholder="blockly_project"
              />
            </div>
            
            <p style={{ margin: '0 0 20px 0', opacity: 0.8, fontSize: '14px' }}>
              Choose the file format:
            </p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <Button onClick={() => handleDownload('xml')} style={{ flex: 1 }}>
                Save as XML
              </Button>
              <Button onClick={() => handleDownload('txt')} style={{ flex: 1 }}>
                Save as TXT
              </Button>
            </div>
            <Button onClick={() => setShowSaveModal(false)} style={{ width: '100%', opacity: 0.7 }}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      <footer style={{ position: 'fixed', right: 8, bottom: 2, fontSize: 12, opacity: 0.8 }}>
        © 2025 <a href="https://www.instagram.com/omran.soliman97/" target="_blank" rel="noopener noreferrer">Omran SOLIMAN</a>. All rights reserved.
      </footer>
    </div>
  );
}
