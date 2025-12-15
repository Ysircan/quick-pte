"use client";

import styles from "./todoCard.module.css";
import type { TodoTask } from "./types";

type Props = {
  task: TodoTask;
  isOpen: boolean;
  onToggle: () => void;
  onStartReview: () => void;
};

export default function TaskItem({ task, isOpen, onToggle, onStartReview }: Props) {
  return (
    <li className={styles.taskItem} data-open={isOpen ? "true" : "false"}>
      <button
        className={styles.taskTop}
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className={styles.taskLeft}>
          <span className={`${styles.dot} ${styles.dotCoral}`} aria-hidden="true" />
          <span className={styles.taskName}>{task.title}</span>
        </span>

        <span className={styles.taskMeta}>
          <span className={styles.pill}>{task.meta}</span>
          <span className={styles.arrow} aria-hidden="true">▾</span>
        </span>
      </button>

      <div
        className={styles.taskDetails}
        aria-hidden={!isOpen}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.detailsInner}>
          <p className={styles.detailsText}>{task.details}</p>
          <button
            className={styles.btn}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartReview();
            }}
          >
            Start Review
          </button>
        </div>
      </div>
    </li>
  );
}
