"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./todoCard.module.css";
import TaskList from "./TaskList";
import type { TodoTask } from "./types";

const MOCK_TASKS: TodoTask[] = [
  { id: "wfd", title: "WFD Sprint", meta: "15 items", details: "Type 15 sentences. Target 90% accuracy. Keep rhythm and avoid missing articles." },
  { id: "mistake", title: "Mistake Review", meta: "8 wrong", details: "Fix 8 wrong sentences from your pool. Re-type until you get 2 clean passes." },
  { id: "boss", title: "Boss Challenge", meta: "timed", details: "One timed run. No pause. Try to beat your last score and keep accuracy stable." },
];

export default function TodayTodoCard() {
  const tasks = MOCK_TASKS;
  const router = useRouter();

  const badgeText = useMemo(() => {
    const n = tasks.length;
    return `${n} item${n === 1 ? "" : "s"}`;
  }, [tasks.length]);

  return (
    <section className={styles.card} aria-label="To Do">
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>To Do</h2>
        <span className={styles.badge}>{badgeText}</span>
      </div>

      <p className={styles.cardBody}>Tap a task row to expand details below.</p>

      <TaskList
        tasks={tasks}
        onStartReview={(taskId) => {
          // Navigate to the WFD map page when starting a run
          router.push("/engine/wfd/map");
        }}
      />
    </section>
  );
}
