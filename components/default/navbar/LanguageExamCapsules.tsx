"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/components/default/navbar.module.css";
import { EXAMS, LANGUAGE_META, LanguageKey } from "./languageExamMap";

export default function LanguageExamCapsules() {
  const [activeLang, setActiveLang] = useState<LanguageKey>("english");
  const [activeExam, setActiveExam] = useState<string>("pte");
  const [open, setOpen] = useState<null | "lang" | "exam">(null);

  const accent = LANGUAGE_META[activeLang].accent;
  const langLabel = LANGUAGE_META[activeLang].label;

  const exams = useMemo(() => EXAMS[activeLang] ?? [], [activeLang]);
  const examLabel = useMemo(() => {
    const hit = exams.find((x) => x.key === activeExam);
    return hit?.label ?? exams[0]?.label ?? "EXAM";
  }, [exams, activeExam]);

  // 如果切语言后 exam 不存在，自动切到该语言的第一个
  useEffect(() => {
    if (!exams.some((x) => x.key === activeExam) && exams[0]) {
      setActiveExam(exams[0].key);
    }
  }, [activeLang, exams, activeExam]);

  const rootRef = useRef<HTMLDivElement | null>(null);

  // click outside / ESC 关闭
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
            ▾
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
            ▾
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
