"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/components/default/navbar.module.css";
import LanguageExamCapsules from "./navbar/LanguageExamCapsules";
import UiLanguageGlobe from "./navbar/UiLanguageGlobe";
import { useUiLang } from "@/components/i18n/UiLangProvider";
import UserMenu from "./navbar/UserMenu";


type NavItem = { label: string; href: string };

export default function NavbarSkeleton(props: { brand?: string; links: NavItem[] }) {
  const { brand = "QUICK", links } = props;
  const pathname = usePathname() || "/";
  const { t } = useUiLang();

  return (
    <div className={styles.navBar}>
      <div className={styles.navInner}>
        <div className={styles.navLeft}>
          <Link className={styles.navLogo} href="/">
            {brand}
          </Link>
        </div>

        <div className={styles.navRight}>
          <nav className={styles.navLinks} aria-label="Primary">
            {links.map((x) => {
              const isActive =
                pathname === x.href || (x.href !== "/" && pathname.startsWith(x.href));

              return (
                <Link
                  key={x.href}
                  className={`${styles.navBtn} ${isActive ? styles.navBtnActive : ""}`}
                  href={x.href}
                >
                  {t(x.label)}
                </Link>
              );
            })}
          </nav>

          <LanguageExamCapsules />
          <UiLanguageGlobe />
          <UserMenu />

          
        </div>
      </div>
    </div>
  );
}
