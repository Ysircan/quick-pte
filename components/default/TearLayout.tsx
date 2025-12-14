// components/default/TearLayout.tsx
import styles from "./tearLayout.module.css";
import Navbar from "./Navbar"; // 先沿用你现有的 Navbar.tsx（逻辑以后再拆）

export default function TearLayout(props: {
  hero?: React.ReactNode;
  paper?: React.ReactNode;
  bottom?: React.ReactNode;
}) {
  const { hero, paper, bottom } = props;

  return (
    <div className={styles.pageShell}>
      <section className={styles.heroLayer}>
        <div className={styles.heroBg} />

        {/* 先复用你现在的 Navbar */}
        <Navbar />

        {hero ?? <div className={styles.layerCenter}>HERO</div>}
      </section>

      <section className={styles.paperLayer}>
        {paper ?? <div className={styles.layerCenter}>PAPER</div>}
      </section>

      <section className={styles.comicLayer}>
        {bottom ?? <div className={styles.layerCenter}>PINK</div>}
      </section>
    </div>
  );
}
