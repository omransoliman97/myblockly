"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import type { WorkspaceSvg } from "blockly/core";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Volume2, VolumeX, Play, FolderOpen, Save, Trash2, StickyNote, Minus, LocateFixed, Download } from "lucide-react";
import { Menu, X } from 'lucide-react'; 
import Link from "next/link";

export default function Home() {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const workspaceRef = useRef<WorkspaceSvg | null>(null);
  const toolboxXmlRef = useRef<string>("");
  const resizeHandlerRef = useRef<(() => void) | null>(null);
  const workspaceChangeListenerRef = useRef<any>(null);
  const xmlDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isApplyingXmlRef = useRef<boolean>(false);
  const [xmlError, setXmlError] = useState<string>("");
  const [ready, setReady] = useState(false);
  type Tab = "blocks" | "javascript" | "python" | "php" | "xml" | "json";
  const [activeTab, setActiveTab] = useState<Tab>("blocks");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [filename, setFilename] = useState("blockly_project");
type Language = "en" | "zh" | "es" | "hi" | "ar" | "fr" | "ru" | "pt" | "id" | "de" | "ja" | "tr" | "ko" | "it" | "vi" | "th" | "nl" | "pl" | "uk";
  const [uiLang, setUiLang] = useState<Language>("en");
  const [t, setT] = useState<any>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Notes panel state
  const [showNote, setShowNote] = useState<boolean>(false);
  const [note, setNote] = useState<string>(() => {
    if (typeof window === 'undefined') return "";
    const v = localStorage.getItem('editor-note-content');
    return v ?? "";
  });
  const [notePos, setNotePos] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined') return { x: 20, y: 120 };
    try {
      const v = localStorage.getItem('editor-note-pos');
      const p = v ? JSON.parse(v) : null;
      if (p && typeof p.x === 'number' && typeof p.y === 'number') return p;
    } catch {}
    return { x: 20, y: 120 };
  });
  const [isDraggingNote, setIsDraggingNote] = useState<boolean>(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const noteInitRef = useRef<boolean>(false);
  const noteTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const noteGutterRef = useRef<HTMLDivElement | null>(null);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const v = localStorage.getItem('editor-note-lines');
    return v ? v === 'true' : true;
  });
  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window === 'undefined') return 14;
    const v = localStorage.getItem('editor-note-fontSize');
    return v ? Number(v) || 14 : 14;
  });
  const [fontWeight, setFontWeight] = useState<'normal'|'bold'>(() => {
    if (typeof window === 'undefined') return 'normal';
    const v = localStorage.getItem('editor-note-fontWeight');
    return (v === 'bold' ? 'bold' : 'normal');
  });
  const [showHighlight, setShowHighlight] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const v = localStorage.getItem('editor-note-highlight');
    return v ? v === 'true' : false;
  });
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Mark initialized after first paint, and hydrate showNote from storage
  useEffect(() => {
    const v = typeof window !== 'undefined' ? localStorage.getItem('editor-note-visible') : null;
    if (v != null) setShowNote(v === 'true');
    noteInitRef.current = true;
  }, []);

  // Persist notes content/position/visibility
  useEffect(() => {
    if (!noteInitRef.current) return;
    try { localStorage.setItem('editor-note-content', note); } catch {}
    // Update gutter line numbers on content change
    if (noteGutterRef.current) {
      const lines = Math.max(1, note.split('\n').length);
      const items = Array.from({ length: lines }, (_, i) => String(i + 1)).join('\n');
      noteGutterRef.current.textContent = items;
    }
  }, [note]);
  useEffect(() => {
    if (!noteInitRef.current) return;
    try { localStorage.setItem('editor-note-pos', JSON.stringify(notePos)); } catch {}
  }, [notePos]);
  useEffect(() => {
    if (!noteInitRef.current) return;
    try { localStorage.setItem('editor-note-visible', String(showNote)); } catch {}
  }, [showNote]);
  useEffect(() => {
    if (!noteInitRef.current) return;
    try { localStorage.setItem('editor-note-lines', String(showLineNumbers)); } catch {}
  }, [showLineNumbers]);
  useEffect(() => {
    if (!noteInitRef.current) return;
    try { localStorage.setItem('editor-note-fontSize', String(fontSize)); } catch {}
  }, [fontSize]);
  useEffect(() => {
    if (!noteInitRef.current) return;
    try { localStorage.setItem('editor-note-fontWeight', String(fontWeight)); } catch {}
  }, [fontWeight]);
  useEffect(() => {
    if (!noteInitRef.current) return;
    try { localStorage.setItem('editor-note-highlight', String(showHighlight)); } catch {}
  }, [showHighlight]);

  // Drag handlers for notes panel
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingNote) return;
      const point = (e as TouchEvent).touches && (e as TouchEvent).touches[0]
        ? (e as TouchEvent).touches[0]
        : (e as MouseEvent);
      const nx = (point as any).clientX - dragOffsetRef.current.x;
      const ny = (point as any).clientY - dragOffsetRef.current.y;
      setNotePos({ x: Math.max(0, nx), y: Math.max(64, ny) });
    };
    const onUp = () => setIsDraggingNote(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove as any);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDraggingNote]);

  // Undo/Redo handling
  const pushUndo = (value: string) => {
    setUndoStack((s) => [...s.slice(-99), value]);
    setRedoStack([]);
  };
  const handleNoteChange = (v: string) => {
    pushUndo(note);
    setNote(v);
  };
  const undoNote = () => {
    setUndoStack((s) => {
      if (s.length === 0) return s;
      const prev = s[s.length - 1];
      setRedoStack((r) => [...r, note]);
      setNote(prev);
      return s.slice(0, -1);
    });
  };
  const redoNote = () => {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      const next = r[r.length - 1];
      setUndoStack((s) => [...s, note]);
      setNote(next);
      return r.slice(0, -1);
    });
  };

  // Scroll sync for line numbers gutter
  const onNoteScroll = () => {
    if (!noteTextAreaRef.current || !noteGutterRef.current) return;
    noteGutterRef.current.scrollTop = noteTextAreaRef.current.scrollTop;
  };

  // Basic highlighter for JS/Python/PHP keywords
  const highlightHtml = (src: string) => {
    const escape = (s: string) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    let out = escape(src);
    const kw = ['function','return','var','let','const','if','else','for','while','switch','case','break','continue','try','catch','finally','class','new','this','import','from','export','def','elif','lambda','True','False','None','and','or','not','in','is','echo','foreach','endif'];
    const kwRe = new RegExp('\\b(' + kw.join('|') + ')\\b','g');
    out = out.replace(kwRe, '<span style="color:#60a5fa">$1</span>');
    out = out.replace(/("[^"]*"|'[^']*')/g, '<span style="color:#34d399">$1</span>');
    out = out.replace(/(\/\/.*$)/gm, '<span style="color:#9ca3af">$1</span>');
    out = out.replace(/(#.*$)/gm, '<span style="color:#9ca3af">$1</span>');
    out = out.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span style="color:#f59e0b">$1</span>');
    return out;
  };

  const startNoteDrag = (e: React.MouseEvent | React.TouchEvent) => {
    // Ignore drag start when clicking on interactive elements inside header
    const target = e.target as HTMLElement;
    if (target && target.closest('.note-no-drag')) {
      return;
    }
    const point = (e as React.TouchEvent).touches && (e as React.TouchEvent).touches[0]
      ? (e as React.TouchEvent).touches[0]
      : (e as React.MouseEvent);
    dragOffsetRef.current = {
      x: (point as any).clientX - notePos.x,
      y: (point as any).clientY - notePos.y,
    };
    setIsDraggingNote(true);
    e.preventDefault();
  };

  // Recenter the note to viewport
  const recenterNote = () => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 800;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 600;
    const defaultW = 360; const defaultH = 300;
    const nx = Math.max(10, (vw - defaultW) / 2);
    const ny = Math.max(70, (vh - defaultH) / 2 + 64); // offset for navbar/header
    setNotePos({ x: nx, y: ny });
  };

  // Download note content as TXT
  const saveNoteAsTxt = () => {
    const blob = new Blob([note || ""], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'note.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const CATEGORY_LABELS: Record<Language, Record<string, string>> = {
  en: {
    logic: "Logic",
    loops: "Loops", 
    math: "Math",
    text: "Text",
    lists: "Lists",
    variables: "Variables",
    functions: "Functions",
  },
  zh: {
    logic: "逻辑",
    loops: "循环",
    math: "数学", 
    text: "文本",
    lists: "列表",
    variables: "变量",
    functions: "函数",
  },
  es: {
    logic: "Lógica",
    loops: "Bucles",
    math: "Matemáticas",
    text: "Texto",
    lists: "Listas", 
    variables: "Variables",
    functions: "Funciones",
  },
  hi: {
    logic: "लॉजिक",
    loops: "लूप्स",
    math: "गणित",
    text: "टेक्स्ट",
    lists: "सूचियाँ",
    variables: "वेरिएबल्स",
    functions: "फ़ंक्शन्स",
  },
  ar: {
    logic: "المنطق",
    loops: "الحلقات", 
    math: "الرياضيات",
    text: "النص",
    lists: "القوائم",
    variables: "المتغيرات",
    functions: "الدوال",
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
  ru: {
    logic: "Логика",
    loops: "Циклы",
    math: "Математика",
    text: "Текст",
    lists: "Списки",
    variables: "Переменные",
    functions: "Функции",
  },
  pt: {
    logic: "Lógica",
    loops: "Loops",
    math: "Matemática",
    text: "Texto",
    lists: "Listas",
    variables: "Variáveis",
    functions: "Funções",
  },
  id: {
    logic: "Logika",
    loops: "Perulangan",
    math: "Matematika",
    text: "Teks",
    lists: "Daftar",
    variables: "Variabel",
    functions: "Fungsi",
  },
  de: {
    logic: "Logik",
    loops: "Schleifen",
    math: "Mathematik",
    text: "Text",
    lists: "Listen",
    variables: "Variablen",
    functions: "Funktionen",
  },
  ja: {
    logic: "ロジック",
    loops: "ループ",
    math: "数学",
    text: "テキスト",
    lists: "リスト",
    variables: "変数",
    functions: "関数",
  },
  tr: {
    logic: "Mantık",
    loops: "Döngüler",
    math: "Matematik",
    text: "Metin",
    lists: "Listeler",
    variables: "Değişkenler",
    functions: "Fonksiyonlar",
  },
  ko: {
    logic: "논리",
    loops: "반복",
    math: "수학",
    text: "텍스트",
    lists: "목록",
    variables: "변수",
    functions: "함수",
  },
  it: {
    logic: "Logica",
    loops: "Cicli",
    math: "Matematica",
    text: "Testo",
    lists: "Liste",
    variables: "Variabili",
    functions: "Funzioni",
  },
  vi: {
    logic: "Logic",
    loops: "Vòng lặp",
    math: "Toán học",
    text: "Văn bản",
    lists: "Danh sách",
    variables: "Biến số",
    functions: "Hàm",
  },
  th: {
    logic: "ตรรกะ",
    loops: "ลูป",
    math: "คณิตศาสตร์",
    text: "ข้อความ",
    lists: "รายการ",
    variables: "ตัวแปร",
    functions: "ฟังก์ชัน",
  },
  nl: {
    logic: "Logica",
    loops: "Lussen",
    math: "Wiskunde",
    text: "Tekst",
    lists: "Lijsten",
    variables: "Variabelen",
    functions: "Functies",
  },
  pl: {
    logic: "Logika",
    loops: "Pętle",
    math: "Matematyka",
    text: "Tekst",
    lists: "Listy",
    variables: "Zmienne",
    functions: "Funkcje",
  },
  uk: {
    logic: "Логіка",
    loops: "Цикли",
    math: "Математика",
    text: "Текст",
    lists: "Списки",
    variables: "Змінні",
    functions: "Функції",
  },
};

  const buildToolboxXml = (lang: Language) => `
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

    const savedLang = (typeof window !== 'undefined' ? (localStorage.getItem('site-lang') as Language | null) : null) || 'en';
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
  switch (savedLang) {
    case 'zh': try { messages = await import("blockly/msg/zh-hans"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'es': try { messages = await import("blockly/msg/es"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'hi': try { messages = await import("blockly/msg/hi"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'ar': try { messages = await import("blockly/msg/ar"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'fr': try { messages = await import("blockly/msg/fr"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'ru': try { messages = await import("blockly/msg/ru"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'pt': try { messages = await import("blockly/msg/pt-br"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'id': try { messages = await import("blockly/msg/id"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'de': try { messages = await import("blockly/msg/de"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'ja': try { messages = await import("blockly/msg/ja"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'tr': try { messages = await import("blockly/msg/tr"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'ko': try { messages = await import("blockly/msg/ko"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'it': try { messages = await import("blockly/msg/it"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'vi': try { messages = await import("blockly/msg/vi"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'th': try { messages = await import("blockly/msg/th"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'nl': try { messages = await import("blockly/msg/nl"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'pl': try { messages = await import("blockly/msg/pl"); } catch { messages = await import("blockly/msg/en"); } break;
    case 'uk': try { messages = await import("blockly/msg/uk"); } catch { messages = await import("blockly/msg/en"); } break;
    default: messages = await import("blockly/msg/en");
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
        rtl: savedLang === 'ar',
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
        saveWorkspaceToLocalStorage(); // Auto-save on every change
      };
      workspace.addChangeListener(changeListener);
      workspaceChangeListenerRef.current = changeListener;

      // Restore from autosave (used when switching languages via reload)
      try {
        const saved = window.localStorage.getItem("blockly_autosave_xml");
        if (saved) {
          const xml = Blockly.utils.xml.textToDom(saved);
          Blockly.Xml.domToWorkspace(xml, workspace);
          window.localStorage.removeItem("blockly_autosave_xml");
        } else {
          // Restore from persistent storage if no language switch save exists
          const persistent = window.localStorage.getItem("blockly_workspace_xml");
          if (persistent) {
            const xml = Blockly.utils.xml.textToDom(persistent);
            Blockly.Xml.domToWorkspace(xml, workspace);
          }
        }
      } catch {}

      const resize = () => {
        Blockly.svgResize(workspace);
      };
      resizeHandlerRef.current = resize;
      window.addEventListener("resize", resize);

      cleanup = () => {
        window.removeEventListener("resize", resize);
        try {
          if (workspaceChangeListenerRef.current) {
            try { workspace.removeChangeListener(workspaceChangeListenerRef.current); } catch {}
            workspaceChangeListenerRef.current = null;
          }
          workspace.dispose();
        } catch {}
        if (workspaceRef.current === workspace) {
          workspaceRef.current = null;
        }
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

  useEffect(() => {
  // Set RTL direction based on current language
  const direction = uiLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', direction);
}, [uiLang]);



  // Generate code based on selected tab (or an override when switching tabs)
  const updateGeneratedCode = async (tabOverride?: Tab) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const tab = tabOverride || activeTab;
    
    // Don't update XML if we're currently applying XML to avoid infinite loop
    if (tab === "xml" && isApplyingXmlRef.current) {
      return;
    }
    
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

  // Save workspace to localStorage
  const saveWorkspaceToLocalStorage = async () => {
    if (!workspaceRef.current) return;
    try {
      const Blockly = await import("blockly/core");
      const xmlDom = Blockly.Xml.workspaceToDom(workspaceRef.current);
      const xmlText = Blockly.Xml.domToText(xmlDom);
      window.localStorage.setItem("blockly_workspace_xml", xmlText);
    } catch (err) {
      console.error("Failed to save workspace:", err);
    }
  };

  // Handler for XML textarea changes with instant auto-apply
  const handleXmlChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const xmlText = e.target.value;
    setGeneratedCode(xmlText);
    setXmlError(""); // Clear previous errors
    
    // Clear previous timer
    if (xmlDebounceTimerRef.current) {
      clearTimeout(xmlDebounceTimerRef.current);
    }
    
    // Auto-apply changes after 300ms (fast but not instant to avoid performance issues)
    xmlDebounceTimerRef.current = setTimeout(() => {
      applyXmlToWorkspaceSilent(xmlText);
    }, 300);
  };

  // Apply XML to workspace silently (for real-time updates)
  const applyXmlToWorkspaceSilent = async (xmlText: string) => {
    if (!workspaceRef.current) return;
    
    // Set flag to prevent infinite loop
    isApplyingXmlRef.current = true;
    
    try {
      const Blockly = await import("blockly/core");
      
      if (!xmlText.trim()) {
        // If XML is empty, clear workspace
        workspaceRef.current.clear();
        window.localStorage.setItem("blockly_workspace_xml", "");
        setXmlError("");
      } else {
        // Parse and apply XML
        const xmlDom = Blockly.utils.xml.textToDom(xmlText);
        
        // Clear workspace and apply new XML
        workspaceRef.current.clear();
        Blockly.Xml.domToWorkspace(xmlDom, workspaceRef.current);
        
        // Auto-save after applying XML
        saveWorkspaceToLocalStorage();
        setXmlError(""); // Clear error on success
      }
    } catch (err) {
      // Show error in a non-intrusive way
      const errorMsg = (err as Error).message || "Invalid XML format";
      setXmlError("⚠️ XML Error: " + errorMsg);
      console.warn("XML parsing error:", err);
    } finally {
      // Reset flag after a short delay to allow workspace events to complete
      setTimeout(() => {
        isApplyingXmlRef.current = false;
      }, 150);
    }
  };

  // Copy XML to clipboard
  const copyXmlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      // Show a brief success message
      const originalText = generatedCode;
      setGeneratedCode("✓ Copied to clipboard!\n\n" + originalText);
      setTimeout(() => {
        setGeneratedCode(originalText);
      }, 1000);
    } catch (err) {
      alert("Failed to copy to clipboard. Please select and copy manually.");
      console.error("Copy failed:", err);
    }
  };

  // Update all tabs when workspace changes (used after XML paste)
  const updateAllTabs = async () => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    
    try {
      const Blockly = await import("blockly/core");
      
      // Generate code for all languages but don't change active tab
      // This ensures when user switches tabs, the code is already ready
      const { javascriptGenerator } = await import("blockly/javascript");
      const { pythonGenerator } = await import("blockly/python");
      const { phpGenerator } = await import("blockly/php");
      
      // Just trigger a workspace change to update the current active tab
      await updateGeneratedCode();
    } catch (err) {
      console.error("Failed updating tabs:", err);
    }
  };

  // Also regenerate when the active tab changes (e.g., initial mount or state changes)
  useEffect(() => {
    updateGeneratedCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, uiLang]);

  const changeLocaleAndReload = async (lang: Language) => {
  try { localStorage.setItem('site-lang', lang); } catch {}
  if (!workspaceRef.current) return;
  const Blockly = await import("blockly/core");
  
  // Save current workspace
  const xmlDom = Blockly.Xml.workspaceToDom(workspaceRef.current);
  const xmlText = Blockly.Xml.domToText(xmlDom);

  // Load locale messages
  try {
  let messages;
  switch (lang) {
    case "zh": messages = await import("blockly/msg/zh-hans"); break;
    case "es": messages = await import("blockly/msg/es"); break;
    case "hi": messages = await import("blockly/msg/hi"); break;
    case "ar": messages = await import("blockly/msg/ar"); break;
    case "fr": messages = await import("blockly/msg/fr"); break;
    case "ru": messages = await import("blockly/msg/ru"); break;
    case "pt": messages = await import("blockly/msg/pt-br"); break;
    case "id": messages = await import("blockly/msg/id"); break;
    case "de": messages = await import("blockly/msg/de"); break;
    case "ja": messages = await import("blockly/msg/ja"); break;
    case "tr": messages = await import("blockly/msg/tr"); break;
    case "ko": messages = await import("blockly/msg/ko"); break;
    case "it": messages = await import("blockly/msg/it"); break;
    case "vi": messages = await import("blockly/msg/vi"); break;
    case "th": messages = await import("blockly/msg/th"); break;
    case "nl": messages = await import("blockly/msg/nl"); break;
    case "pl": messages = await import("blockly/msg/pl"); break;
    case "uk": messages = await import("blockly/msg/uk"); break;
    default: messages = await import("blockly/msg/en");
  }
  
  // Apply locale messages
  const msgObj = messages.default || messages;
  if (msgObj && typeof msgObj === 'object') {
    Object.assign(Blockly.Msg, msgObj);
  }
} catch (e) {
  console.error(`Blockly locale "${lang}" not available, falling back to English`, e);
  // Fallback to English
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
      rtl: lang === 'ar',
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
    const changeListener = () => {
      updateGeneratedCode();
      saveWorkspaceToLocalStorage(); // Auto-save on every change
  };
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

// Apply current document theme to Blockly workspace (when theme changes externally)
const applyThemeFromDom = async () => {
  try {
    const Blockly = await import("blockly/core");
    if (workspaceRef.current) {
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
      // @ts-ignore - setTheme exists on WorkspaceSvg
      workspaceRef.current.setTheme(theme);
    }
  } catch {}
};

// Listen to Navbar events for language and theme changes
useEffect(() => {
  const onLang = async () => {
    const saved = (localStorage.getItem('site-lang') as Language) || 'en';
    if (saved && saved !== uiLang) {
      setUiLang(saved);
      await changeLocaleAndReload(saved);
    }
  };
  const onTheme = () => {
    applyThemeFromDom();
  };
  window.addEventListener('site-lang-changed', onLang as EventListener);
  window.addEventListener('theme-changed', onTheme as EventListener);
  return () => {
    window.removeEventListener('site-lang-changed', onLang as EventListener);
    window.removeEventListener('theme-changed', onTheme as EventListener);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [uiLang]);

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
    rtl: uiLang === 'ar',
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
  const changeListener = () => {
    updateGeneratedCode();
    saveWorkspaceToLocalStorage(); // Auto-save on every change
  };
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

// Discard all blocks from the current workspace
const handleDiscardAll = async () => {
  const ws = workspaceRef.current;
  if (!ws) return;
  const ok = window.confirm(t?.confirmDiscard || 'Discard all blocks? This cannot be undone.');
  if (!ok) return;
  ws.clear();
  await updateGeneratedCode();
  // Save empty workspace
  saveWorkspaceToLocalStorage();
  // Also clear notes content
  setNote('');
  try { localStorage.removeItem('editor-note-content'); } catch {}
};

return (
  <div className="blockly-page" style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: "100vh" }}>
    {/* Google Analytics */}
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-BNLPSLHQHF" strategy="afterInteractive" />
    <Script id="gtag-init" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-BNLPSLHQHF');
    `}</Script>
    
    {/* Editor Controls Header (no logo, no language/theme) */}
  <div style={{ position: 'sticky', top: '64px', zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.1)", background: 'var(--background)', backdropFilter: 'blur(6px)' }}>
      <div className="flex items-center gap-2">
        <Button onClick={() => setShowNote((v) => !v)} variant="outline" size="sm" aria-label="Toggle Notes">
          <StickyNote className="size-4" style={{ marginRight: 6 }} />
          {showNote ? 'Hide Notes' : 'Notes'}
        </Button>
        <Button onClick={recenterNote} variant="outline" size="sm" aria-label="Recenter Notes">
          <LocateFixed className="size-4" style={{ marginRight: 6 }} />
          Recenter
        </Button>
      </div>

      {/* Mobile menu button for actions */}
      <Button 
        className="mobile-menu-btn md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        size="icon" 
        variant="outline" 
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-2">
        <Button onClick={handleRun} disabled={!ready} variant="default">
          <Play className="size-4" style={{ marginRight: 6 }} />{t?.runProject || 'Run'}
        </Button>
        <Button onClick={handleOpenFilePicker} variant="outline">
          <FolderOpen className="size-4" style={{ marginRight: 6 }} />{t?.loadProject || 'Load'}
        </Button>
        <Button onClick={() => { setFilename("blockly_project"); setShowSaveModal(true); }} disabled={!ready} variant="outline">
          <Save className="size-4" style={{ marginRight: 6 }} />{t?.saveProject || 'Save'}
        </Button>
        <Button onClick={handleDiscardAll} disabled={!ready} variant="destructive" aria-label="Discard all blocks">
          <Trash2 className="size-4" style={{ marginRight: 6 }} />{t?.discardAll || 'Discard'}
        </Button>
        <Button onClick={toggleMute} size="icon" variant="outline" aria-label="Toggle sound">
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </Button>
      </div>
    </div>
    <input
      ref={fileInputRef}
      type="file"
      accept=".xml,text/xml,application/xml"
      onChange={handleLoadFile}
      style={{ display: "none" }}
    />

    {/* Mobile dropdown menu - Only shown when open */}
    {isMobileMenuOpen && (
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "var(--background)", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
        {/* Mobile Action Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <Button onClick={handleRun} disabled={!ready} size="sm" style={{ width: "100%" }}>
            <Play className="size-4" style={{ marginRight: 6 }} />{t?.runProject || 'Run'}
          </Button>
          <Button onClick={handleOpenFilePicker} size="sm" variant="outline" style={{ width: "100%" }}>
            <FolderOpen className="size-4" style={{ marginRight: 6 }} />{t?.loadProject || 'Load'}
          </Button>
          <Button onClick={() => { setFilename("blockly_project"); setShowSaveModal(true); }} disabled={!ready} size="sm" variant="outline" style={{ width: "100%" }}>
            <Save className="size-4" style={{ marginRight: 6 }} />{t?.saveProject || 'Save'}
          </Button>
          <Button onClick={handleDiscardAll} disabled={!ready} variant="destructive" size="sm" style={{ width: "100%" }}>
            <Trash2 className="size-4" style={{ marginRight: 6 }} />{t?.discardAll || 'Discard'}
          </Button>
        </div>
        {/* Mobile Sound Toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
          <Button onClick={toggleMute} size="sm" variant="outline" style={{ width: "100%" }}>
            {isMuted ? <VolumeX className="size-4" style={{ marginRight: 6 }} /> : <Volume2 className="size-4" style={{ marginRight: 6 }} />} 
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>
        </div>
      </div>
    )}

    {/* Floating Notes Panel */}
    {showNote && (
    <div
      style={{
        position: 'fixed',
        left: notePos.x,
        top: notePos.y,
        width: 'min(360px, 92vw)',
        height: 'min(300px, 65vh)',
        background: 'var(--background)',
        color: 'var(--foreground)',
        border: '1px solid rgba(0,0,0,0.15)',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        resize: 'both',
        minWidth: 220,
        minHeight: 200,
        maxWidth: '95vw',
        maxHeight: '80vh'
      }}
    >
      <div
        onMouseDown={startNoteDrag}
        onTouchStart={startNoteDrag}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          cursor: isDraggingNote ? 'grabbing' : 'grab',
          padding: '8px 10px',
          background: 'var(--accent)',
          color: 'var(--accent-foreground)'
        }}
      >
        {/* Top row: title + actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
          <span>Notes</span>
          <div className="note-no-drag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              className="note-no-drag"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={saveNoteAsTxt}
              aria-label="Save notes as text"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: 6,
                border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', color: 'inherit', cursor: 'pointer'
              }}
            >
              <Download className="size-4" />
            </button>
            <button
              className="note-no-drag"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setShowNote(false)}
              aria-label="Minimize notes"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: 6,
                border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', color: 'inherit', cursor: 'pointer'
              }}
            >
              <Minus className="size-4" />
            </button>
          </div>
        </div>
        {/* Toolbar row under */}
        <div className="note-no-drag" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button className="note-no-drag" onClick={undoNote} aria-label="Undo" style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', cursor: 'pointer' }}>Undo</button>
          <button className="note-no-drag" onClick={redoNote} aria-label="Redo" style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', cursor: 'pointer' }}>Redo</button>
          <button className="note-no-drag" onClick={() => setFontSize((s) => Math.min(28, s + 1))} aria-label="Increase font" style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', cursor: 'pointer' }}>A+</button>
          <button className="note-no-drag" onClick={() => setFontSize((s) => Math.max(10, s - 1))} aria-label="Decrease font" style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', cursor: 'pointer' }}>A-</button>
          <button className="note-no-drag" onClick={() => setFontWeight((w) => (w === 'normal' ? 'bold' : 'normal'))} aria-label="Toggle bold" style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', cursor: 'pointer' }}>Bold</button>
          <button className="note-no-drag" onClick={() => setShowLineNumbers((v) => !v)} aria-label="Toggle line numbers" style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', cursor: 'pointer' }}>{showLineNumbers ? 'Hide #' : 'Show #'}</button>
          <button className="note-no-drag" onClick={() => setShowHighlight((v) => !v)} aria-label="Toggle highlighting" style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', cursor: 'pointer' }}>{showHighlight ? 'No HL' : 'HL'}</button>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {showLineNumbers && (
          <div ref={noteGutterRef} aria-hidden style={{ userSelect: 'none', width: 36, padding: '10px 6px', textAlign: 'right', borderRight: '1px solid rgba(0,0,0,0.08)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize, lineHeight: '1.5', color: 'var(--muted-foreground)', overflow: 'hidden' }} />
        )}
        <textarea
          ref={noteTextAreaRef}
          value={note}
          onChange={(e) => handleNoteChange(e.target.value)}
          onScroll={onNoteScroll}
          spellCheck={false}
          placeholder="Write your notes here..."
          style={{
            flex: 1,
            width: '100%',
            padding: 10,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            resize: 'none',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize,
            fontWeight
          }}
        />
      </div>
      {showHighlight && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '8px 10px', maxHeight: '40%', overflow: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize }}>
          <pre style={{ margin: 0 }}>
            <code dangerouslySetInnerHTML={{ __html: highlightHtml(note) }} />
          </pre>
        </div>
      )}
    </div>
  )}

    {/* Tabs */}
  <div style={{ position: 'sticky', top: '113px', zIndex: 19, display: "flex", gap: "4px", padding: "8px 16px", borderBottom: "1px solid rgba(0,0,0,0.1)", background: 'var(--background)', overflowX: "auto" }}>
      {(["blocks","javascript","python","php","xml","json"] as Tab[]).map((tab) => (
        <Button
          key={tab}
          onClick={() => handleTabClick(tab)}
          variant={activeTab === tab ? "default" : "ghost"}
          style={{ 
            borderRadius: "0",
            borderBottom: activeTab === tab ? "2px solid #9810FA" : "2px solid transparent",
            fontWeight: activeTab === tab ? 600 : 400
          }}
        >
          {tab === "blocks" ? "Blocks" : tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Button>
      ))}
    </div>
    {/* Main Content Area */}
  <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1, padding: "16px" }}>
    <div className="blocklyArea" style={{ display: activeTab === "blocks" ? "block" : "none", flex: 1, minHeight: '60vh' }}>
      <div ref={blocklyDivRef} className="blocklyDiv" />
    </div>
    {activeTab !== "blocks" && (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minHeight: '55vh' }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ display: "block", margin: 0 }}>
        {activeTab === "xml" ? (
            <span>
              XML Code (Live Edit) 
            <span style={{ fontSize: 11, opacity: 0.7, marginLeft: 8 }}>✨ Changes apply automatically as you type</span>
        </span>
        ) : `Generated code (${activeTab}):`}
        </label>
        {activeTab === "xml" && (
        <Button onClick={copyXmlToClipboard} size="sm" variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}>
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            Copy
          </Button>
        )}
        </div>
        {activeTab === "xml" && xmlError && (
        <div style={{ padding: "8px 12px", background: "#fff3cd", color: "#856404", border: "1px solid #ffc107", borderRadius: 4, fontSize: 12, marginBottom: 4 }}>
            {xmlError}
            </div>
          )}
          <textarea
            readOnly={activeTab !== "xml"}
            value={generatedCode}
            onChange={activeTab === "xml" ? handleXmlChange : undefined}
            spellCheck={false}
            style={{ 
              width: "100%", 
              flex: 1, 
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", 
              fontSize: 12, 
              padding: 8, 
              borderRadius: 6, 
              border: xmlError && activeTab === "xml" ? "1px solid #ffc107" : "1px solid rgba(0,0,0,0.15)", 
              background: "var(--background)", 
              color: "var(--foreground)", 
              resize: "none" 
            }}
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
  </div>
  );
}
