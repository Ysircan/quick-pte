"use client";

import type { TodoTask } from "./types";
import styles from "./todoCard.module.css";
import TaskList from "./TaskList";

const MOCK_TASKS: TodoTask[] = [
  {
    id: "wfd-sprint",
    title: "WFD Sprint",
    meta: "15 items",
    details:
      "Type 15 sentences. Target 90% accuracy. Keep rhythm and avoid missing articles.",
  },
  {
    id: "mistake-review",
    title: "Mistake Review",
    meta: "8 wrong",
    details:
      "Fix 8 wrong sentences from your pool. Re-type until you get 2 clean passes.",
  },
  {
    id: "boss-challenge",
    title: "Boss Challenge",
    meta: "timed",
    details:
      "One timed run. No pause. Try to beat your last score and keep accuracy stable.",
  },
];

type Props = {
  title?: string;                 // 默认 "To Do"
  tasks?: TodoTask[];             // 不传就用 MOCK_TASKS
  description?: string;           // 默认说明
  onStartReview?: (taskId: string) => void; // 后面接路由/开始训练用
};

export default function TodayTodoCard({
  title = "To Do",
  tasks = MOCK_TASKS,
  description = "Tap a task row to expand details below.",
  onStartReview,
}: Props) {
  return (
    <section className={styles.card} aria-label="To Do">
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <span className={styles.badge}>{tasks.length} items</span>
      </header>

      <p className={styles.cardBody}>{description}</p>

      <TaskList
        tasks={tasks}
        onStartReview={(id) => {
          // MVP：先不做跳转也行，默认 console 一下
          if (onStartReview) return onStartReview(id);
          // eslint-disable-next-line no-console
          console.log("Start Review:", id);
        }}
      />
    </section>
  );
}
