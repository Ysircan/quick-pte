"use client";

import Link from "next/link";
import styles from "@/components/default/navbar.module.css";

type NavItem = { label: string; href: string };

export default function NavbarSkeleton(props: {
  brand?: string;
  links: NavItem[];
}) {
  const { brand = "QUICK ENGINE", links } = props;

  return (
    <div className={styles.navBar}>
      <div className={styles.navInner}>
        <div className={styles.navLeft}>
          <div className={styles.navLogo}>{brand}</div>
        </div>

        <div className={styles.navRight}>
          <nav className={styles.navLinks}>
            {links.map((x) => (
              <Link key={x.href} className={styles.navBtn} href={x.href}>
                {x.label}
              </Link>
            ))}
          </nav>

          <div className={styles.langToggle}>
            <button className={`${styles.langSeg} ${styles.langSegActive}`}>EN</button>
            <button className={styles.langSeg}>中</button>
          </div>
        </div>
      </div>
    </div>
  );
}
