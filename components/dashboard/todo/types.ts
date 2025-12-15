// components/dashboard/todo/types.ts

export type TodoTask = {
  id: string;
  title: string;
  meta: string;     // 右侧 pill（例如：15 items / 8 wrong / timed）
  details: string;  // 展开后的描述文本
};
