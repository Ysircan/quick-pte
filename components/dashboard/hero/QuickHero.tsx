// components/dashboard/hero/QuickHero.tsx
import styles from "./quickHero.module.css";

type QuickHeroProps = {
  /** 之后你给我 language->accent 的颜色时，直接传进来即可 */
  accent?: string;
};

export default function QuickHero({ accent }: QuickHeroProps) {
  const style = accent ? ({ ["--accent" as any]: accent } as React.CSSProperties) : undefined;

  return (
    <div className={styles.bgWorld} style={style}>
      <div className={styles.stage}>
        <section className={styles.hero}>
          <h1 className={styles.brand}>QUICK</h1>

          <p className={styles.headline}>
            EASILY <span className={styles.masterWord}>MASTER</span> LANGUAGES
          </p>

          <div className={styles.caps}>
            <span className={styles.capBtn}>
              <span className={styles.capDot} />
              GAMIFICATION
            </span>
            <span className={styles.capBtn}>
              <span className={styles.capDot} />
              ROGUELIKE
            </span>
          </div>

          <div className={styles.ctaRow}>
            <button className={styles.cta} type="button">
              START RUN
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
