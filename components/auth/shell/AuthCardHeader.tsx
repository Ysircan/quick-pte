"use client";

import { useEffect, useState } from "react";

export default function AuthCardHeader({
  t,
}: {
  t: (key: string) => string;
}) {
  const [health, setHealth] = useState<"ok" | "bad">("ok");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        await fetch("/api/auth/me", { method: "GET" });
        if (!alive) return;
        setHealth("ok");
      } catch {
        if (!alive) return;
        setHealth("bad");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="authHeader">
      <div className="authTitleRow">
        <div className="authTitle">{t("auth.header.title")}</div>

        <div className="authBadges" aria-hidden="true">
          <div className="badge dark">
            <span className={`dot ${health === "ok" ? "dotOk" : "dotBad"}`} />
            {t("auth.header.badgeOk")}
          </div>
        </div>
      </div>

      <div className="authSub">{t("auth.header.sub")}</div>
    </div>
  );
}
