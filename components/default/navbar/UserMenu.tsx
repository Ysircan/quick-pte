"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/components/default/navbar.module.css";

type MeResponse =
  | { name?: string; email?: string }
  | { user?: { name?: string; email?: string } }
  | Record<string, any>;

const TOKEN_KEY = "token";

function pickNameEmail(me: MeResponse): { name?: string; email?: string } {
  const name = (me as any)?.name ?? (me as any)?.user?.name;
  const email = (me as any)?.email ?? (me as any)?.user?.email;
  return {
    name: typeof name === "string" ? name : undefined,
    email: typeof email === "string" ? email : undefined,
  };
}

export default function UserMenu() {
  const [hasToken, setHasToken] = useState(false);
  const [health, setHealth] = useState<"ok" | "bad">("ok");
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>("PROFILE");
  const [rawName, setRawName] = useState<string | undefined>(undefined);

  const rootRef = useRef<HTMLDivElement | null>(null);

  // Šî¯ token
  useEffect(() => {
    try {
      setHasToken(!!localStorage.getItem(TOKEN_KEY));
    } catch {
      setHasToken(false);
    }
  }, []);

  // ‘o% token ‘%?†?s†?¾†§ú‘œ?‘Y¾ & †?-‘~æ‡õø
  useEffect(() => {
    if (!hasToken) return;

    (async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);

        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) {
          setHealth("bad");
          return;
        }

        setHealth("ok");

        const json = (await res.json().catch(() => ({}))) as MeResponse;
        const { name, email } = pickNameEmail(json);
        const raw = (name || (email ? email.split("@")[0] : undefined))?.trim();
        setRawName(raw);
        const show = (name || email || "PROFILE").trim();
        setDisplayName(show.length > 18 ? show.slice(0, 18) + "…" : show);
      } catch {
        setHealth("bad");
      }
    })();
  }, [hasToken]);

  // ‡'û†Î¯†Ï-‚Ÿù†.ü‚-ð
  useEffect(() => {
    function onDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const initial = useMemo(() => {
    const source = rawName || displayName?.trim();
    if (!source) return "U";
    const first = Array.from(source)[0] || "U";
    return /^[a-z]/i.test(first) ? first.toUpperCase() : first;
  }, [displayName, rawName]);

  const doLogout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    window.location.href = "/auth/login";
  };

  // ‘o¦‡T¯†«‹¬s†?¦‘~ó‡Ï§ SIGN IN‹¬^„÷?‘~ó‡Ï§‡Sô‘??‡?î‹¬%
  if (!hasToken) {
    return (
      <Link className={styles.navBtn} href="/auth/login">
        SIGN IN
      </Link>
    );
  }

  return (
    <div ref={rootRef} className={styles.userWrap}>
      <button
        type="button"
        className={styles.userBtn}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`User menu (${displayName})`}
      >
        <span
          className={`${styles.statusDot} ${
            health === "ok" ? styles.statusOk : styles.statusBad
          }`}
          aria-hidden="true"
        />
        <span className={styles.avatarCircle} aria-hidden="true">
          {initial}
        </span>
        <span className={styles.caret} aria-hidden="true">
          
        </span>
      </button>

      <div
        className={`${styles.userMenu} ${open ? styles.userMenuOpen : ""}`}
        role="menu"
        aria-label="User menu"
      >
        <Link className={styles.userItem} href="/profile" role="menuitem">
          PROFILE 
        </Link>
        <Link className={styles.userItem} href="/settings" role="menuitem">
          SETTINGS
        </Link>
        <button
          className={styles.userItemBtn}
          type="button"
          onClick={doLogout}
          role="menuitem"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}
