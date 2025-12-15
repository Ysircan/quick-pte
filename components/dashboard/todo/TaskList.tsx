"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TodoTask } from "./types";
import styles from "./todoCard.module.css";

type Props = {
  tasks: TodoTask[];
  onStartReview: (taskId: string) => void;
};

export default function TaskList({ tasks, onStartReview }: Props) {
  const wrapRef = useRef<HTMLUListElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const ids = useMemo(() => new Set(tasks.map((t) => t.id)), [tasks]);

  // 如果 tasks 变了，activeId 不在列表里就关闭
  useEffect(() => {
    if (activeId && !ids.has(activeId)) setActiveId(null);
  }, [activeId, ids]);

  // click outside close + ESC close
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const el = wrapRef.current;
      if (!el) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (!el.contains(target)) setActiveId(null);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveId(null);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <ul className={styles.taskList} ref={wrapRef}>
      {tasks.map((t) => {
        const isOpen = activeId === t.id;

        return (
          <li
            key={t.id}
            className={styles.taskItem}
            data-open={isOpen ? "true" : "false"}
          >
            <button
              className={styles.taskTop}
              type="button"
              aria-expanded={isOpen}
              onClick={() => setActiveId((cur) => (cur === t.id ? null : t.id))}
            >
              <span className={styles.taskLeft}>
                <span
                  className={`${styles.dot} ${styles.dotCoral}`}
                  aria-hidden="true"
                />
                <span className={styles.taskName}>{t.title}</span>
              </span>

              <span className={styles.taskMeta}>
                <span className={styles.pill}>{t.meta}</span>
                <span className={styles.arrow} aria-hidden="true">
                  ▾
                </span>
              </span>
            </button>

            <div
              className={styles.taskDetails}
              aria-hidden={!isOpen}
              // 防止展开区域点击冒泡影响外部关闭逻辑（可选）
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className={styles.detailsInner}>
                <p className={styles.detailsText}>{t.details}</p>
                <button
                  className={styles.btn}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartReview(t.id);
                  }}
                >
                  Start Review
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
