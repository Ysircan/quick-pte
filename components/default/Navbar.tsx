"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./navbar.module.css";
import useUser from "@/hooks/useUser";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();

  const isActive = (href: string) => pathname === href;

  const onLogout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  };

  return (
    <div className={styles.navBar}>
      <div className={styles.navInner}>
       <div className={styles.navLeft}>
  <Link className={styles.navLogo} href="/">
    QUICK
  </Link>
</div>


        <div className={styles.navRight}>
          <nav className={styles.navLinks}>
            <Link className={styles.navBtn} href="/demo">DEMO</Link>
            <Link className={styles.navBtn} href="/students">STUDENTS</Link>
            <Link className={styles.navBtn} href="/agencies">AGENCIES</Link>
            <Link className={styles.navBtn} href="/news">NEWS</Link>
            <Link className={styles.navBtn} href="/faq">FAQ</Link>
            <Link className={styles.navBtn} href="/about">ABOUT</Link>

            {!loading && user ? (
              <>
                <Link className={styles.navBtn} href="/dashboard">DASHBOARD</Link>
                <button className={styles.navBtn} onClick={onLogout}>LOGOUT</button>
              </>
            ) : (
            <Link className={styles.navBtn} href={`/auth/login?next=${encodeURIComponent(pathname || "/dashboard")}`}>
  LOGIN
</Link>

            )}
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
