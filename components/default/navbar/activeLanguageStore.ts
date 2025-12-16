// components/default/navbar/activeLanguageStore.ts
"use client";

import { useEffect, useState } from "react";
import { LANGUAGE_META, LanguageKey } from "./languageExamMap";

const STORAGE_KEY = "active-language";
const DEFAULT_LANG: LanguageKey = "english";
const DEFAULT_STATE: LangState = {
  lang: DEFAULT_LANG,
  accent: LANGUAGE_META[DEFAULT_LANG].accent,
};

type LangState = { lang: LanguageKey; accent: string };

function normalizeLang(raw: any): LanguageKey {
  return raw === "english" || raw === "chinese" || raw === "japanese" ? raw : DEFAULT_LANG;
}

function readState(): LangState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as { lang?: string };
    const lang = normalizeLang(saved.lang);
    return { lang, accent: LANGUAGE_META[lang].accent };
  } catch {
    return DEFAULT_STATE;
  }
}

const listeners = new Set<(state: LangState) => void>();

export function setActiveLanguage(lang: LanguageKey) {
  const next = { lang, accent: LANGUAGE_META[lang].accent };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lang }));
  } catch {}
  listeners.forEach((fn) => fn(next));
}

export function getActiveLanguage(): LangState {
  return readState();
}

export function useActiveLanguage(): LangState {
  // 初始与 SSR 一致，挂载后再读 localStorage 以避免 hydration mismatch
  const [state, setState] = useState<LangState>(DEFAULT_STATE);

  useEffect(() => {
    const handler = (next: LangState) => setState(next);
    listeners.add(handler);
    // sync once on mount in case storage changed before listener added
    setState(readState());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(readState());
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(handler);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return state;
}
