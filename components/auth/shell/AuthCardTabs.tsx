"use client";

export default function AuthCardTabs({
  view,
  onChange,
  t,
}: {
  view: "login" | "register";
  onChange: (v: "login" | "register") => void;
  t: (key: string) => string;
}) {
  return (
    <div className="authTabs" role="tablist" aria-label="Auth Tabs">
      <button
        className={`tab ${view === "login" ? "active" : ""}`}
        type="button"
        aria-selected={view === "login"}
        onClick={() => onChange("login")}
      >
        {t("auth.tab.login")}
      </button>

      <button
        className={`tab ${view === "register" ? "active" : ""}`}
        type="button"
        aria-selected={view === "register"}
        onClick={() => onChange("register")}
      >
        {t("auth.tab.register")}
      </button>
    </div>
  );
}
