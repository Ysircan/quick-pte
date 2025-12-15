"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/components/default/navbar.module.css";
import { EXAMS, LANGUAGE_META, LanguageKey } from "./languageExamMap";
import { getActiveLanguage, setActiveLanguage } from "./activeLanguageStore";

export default function LanguageExamCapsules() {
  const [activeLang, setActiveLang] = useState<LanguageKey>(() => getActiveLanguage().lang);
  const [activeExam, setActiveExam] = useState<string>("pte");
  const [open, setOpen] = useState<null | "lang" | "exam">(null);

  // 初次挂载时同步一次本地存储里的语言
  useEffect(() => {
    const stored = getActiveLanguage().lang;
    if (stored !== activeLang) setActiveLang(stored);
  }, [activeLang]);

  const accent = LANGUAGE_META[activeLang].accent;
  const langLabel = LANGUAGE_META[activeLang].label;

  const exams = useMemo(() => EXAMS[activeLang] ?? [], [activeLang]);
  const examLabel = useMemo(() => {
    const hit = exams.find((x) => x.key === activeExam);
    return hit?.label ?? exams[0]?.label ?? "EXAM";
  }, [exams, activeExam]);

  // †Ý'‘zo†^ÎŠîðŠù?†?Z exam „÷?†ð~†où‹¬OŠÎ¦†Sù†^Î†^øŠî¾ŠîðŠù?‡s"‡ªª„÷?„÷¦
  useEffect(() => {
    if (!exams.some((x) => x.key === activeExam) && exams[0]) {
      setActiveExam(exams[0].key);
    }
  }, [activeLang, exams, activeExam]);

  const rootRef = useRef<HTMLDivElement | null>(null);

  // click outside / ESC †.ü‚-ð
  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(null);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.capsuleRow}
      style={{ ["--accent" as any]: accent }}
    >
      {/* Language */}
      <div className={`${styles.capWrap} ${open === "lang" ? styles.open : ""}`}>
        <button
          type="button"
          className={styles.capBtn}
          aria-haspopup="menu"
          aria-expanded={open === "lang"}
          onClick={() => setOpen(open === "lang" ? null : "lang")}
        >
          <span className={styles.capDot} aria-hidden="true" />
          <span>{langLabel}</span>
          <span className={styles.caret} aria-hidden="true">
            
          </span>
        </button>

        <div className={styles.capMenu} role="menu" aria-label="Language">
          <div className={styles.capGroupTitle}>LANGUAGE</div>

          {(Object.keys(LANGUAGE_META) as LanguageKey[]).map((k) => (
            <button
              key={k}
              type="button"
              role="menuitem"
              className={styles.capItem}
              onClick={() => {
                setActiveLang(k);
                setActiveLanguage(k); // 同步到共享状态，Hero 可取用
                setOpen(null);
              }}
            >
              <span>{LANGUAGE_META[k].label}</span>
              <span className={styles.capTag}>{LANGUAGE_META[k].tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Exam */}
      <div
        className={`${styles.capWrap} ${styles.capWrapRight} ${
          open === "exam" ? styles.open : ""
        }`}
      >
        <button
          type="button"
          className={styles.capBtn}
          aria-haspopup="menu"
          aria-expanded={open === "exam"}
          onClick={() => setOpen(open === "exam" ? null : "exam")}
        >
          <span className={styles.capDot} aria-hidden="true" />
          <span>{examLabel}</span>
          <span className={styles.caret} aria-hidden="true">
            
          </span>
        </button>

        <div className={styles.capMenu} role="menu" aria-label="Exam">
          <div className={styles.capGroupTitle}>EXAMS</div>

          {exams.map((x) => (
            <button
              key={x.key}
              type="button"
              role="menuitem"
              className={styles.capItem}
              onClick={() => {
                setActiveExam(x.key);
                setOpen(null);
              }}
            >
              <span>{x.label}</span>
              <span className={styles.capTag}>{x.tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
