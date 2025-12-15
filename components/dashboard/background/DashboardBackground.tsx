import styles from "./DashboardBackground.module.css";

type Props = {
  children: React.ReactNode;
};

export default function DashboardBackground({ children }: Props) {
  return (
    <div
      className={styles.root}
      style={{
        // 这一组变量完全对齐你 2.html 的 :root :contentReference[oaicite:3]{index=3}
        ["--bg-page" as any]: "#F3F1EA",
        ["--vignette" as any]: "rgba(0,0,0,.06)",
        ["--glow" as any]: "rgba(255,116,106,.06)",
        ["--noise-opacity" as any]: ".05",

        // 先保留，后面主题化用
        ["--accent" as any]: "#ff746a",
      }}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
}
