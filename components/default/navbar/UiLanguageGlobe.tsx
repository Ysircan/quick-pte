"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/components/default/navbar.module.css";
import { useUiLang } from "@/components/i18n/UiLangProvider";

export default function UiLanguageGlobe() {
  const { uiLang, setUiLang } = useUiLang();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.capWrap}>
      <button
        type="button"
        className={styles.capBtn}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.globe} aria-hidden="true">🌐</span>
        <span>{uiLang}</span>
        <span className={styles.caret} aria-hidden="true">▾</span>
      </button>

      <div
        className={`${styles.capMenu} ${open ? styles.capMenuOpen : ""}`}
        role="menu"
        aria-label="UI Language"
        style={{ width: 180 }}
      >
        <div className={styles.capGroupTitle}>UI LANGUAGE</div>

        <button
          type="button"
          role="menuitem"
          className={styles.capItem}
          onClick={() => { setUiLang("EN"); setOpen(false); }}
        >
          <span>EN</span>
          <span className={styles.capTag}>English</span>
        </button>

        <button
          type="button"
          role="menuitem"
          className={styles.capItem}
          onClick={() => { setUiLang("ZH"); setOpen(false); }}
        >
          <span>中文</span>
          <span className={styles.capTag}>Chinese</span>
        </button>
      </div>
    </div>
  );
}
