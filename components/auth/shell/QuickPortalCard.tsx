"use client";

import { useState } from "react";
import AuthCardHeader from "./AuthCardHeader";
import AuthCardTabs from "./AuthCardTabs";
import LoginFormBlock from "./forms/LoginFormBlock";
import RegisterFormBlock from "./forms/RegisterFormBlock";
import { useUiLang } from "@/components/i18n/UiLangProvider";

const TOKEN_KEY = "token";

export default function QuickPortalCard({
  initialView,
}: {
  initialView: "login" | "register";
}) {
  const { t } = useUiLang();

  const [view, setView] = useState<"login" | "register">(initialView);

  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [registerSubmitting, setRegisterSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const afterAuth = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      await fetch("/api/auth/me", {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } catch {}

    window.location.href = "/dashboard";
  };

  const onLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);
      const email = String(fd.get("email") ?? "").trim();
      const password = String(fd.get("pwd") ?? "");

      if (!email || !password) throw new Error(t("auth.err.missingEmailPwd"));

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok)
        throw new Error(
          json?.error ?? json?.message ?? t("auth.err.loginFailed")
        );

      if (json?.token) localStorage.setItem(TOKEN_KEY, json.token);

      await afterAuth();
    } catch (err: any) {
      setLoginError(err?.message ?? t("auth.err.loginFailed"));
    } finally {
      setLoginSubmitting(false);
    }
  };

  const onRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError(null);
    setRegisterSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);

      const name = String(fd.get("regName") ?? "").trim();
      const email = String(fd.get("regEmail") ?? "").trim();
      const password = String(fd.get("regPwd") ?? "");
      const confirmPassword = String(fd.get("regPwd2") ?? "");

      if (!name) throw new Error(t("auth.err.missingName"));
      if (!email || !password) throw new Error(t("auth.err.missingRegisterFields"));
      if (confirmPassword && confirmPassword !== password)
        throw new Error(t("auth.err.passwordMismatch"));

      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const regJson = await regRes.json().catch(() => ({}));
      if (!regRes.ok)
        throw new Error(
          regJson?.error ?? regJson?.message ?? t("auth.err.registerFailed")
        );

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginJson = await loginRes.json().catch(() => ({}));
      if (!loginRes.ok)
        throw new Error(
          loginJson?.error ?? loginJson?.message ?? t("auth.err.autoLoginFailed")
        );

      if (loginJson?.token) {
        localStorage.setItem(TOKEN_KEY, loginJson.token);
      } else {
        throw new Error(t("auth.err.tokenMissing"));
      }

      await afterAuth();
    } catch (err: any) {
      setRegisterError(err?.message ?? t("auth.err.registerFailed"));
    } finally {
      setRegisterSubmitting(false);
    }
  };

  return (
    <div className="loginLayer">
      <div className="loginCard" aria-label="Quick Auth">
        <AuthCardHeader t={t} />

        <div className="authBody">
          <AuthCardTabs view={view} onChange={setView} t={t} />

          <form
            className={`authForm ${view === "login" ? "show" : ""}`}
            autoComplete="on"
            onSubmit={onLoginSubmit}
          >
            <LoginFormBlock
              t={t}
              onGoRegister={() => setView("register")}
              submitting={loginSubmitting}
              error={loginError}
            />
          </form>

          <form
            className={`authForm ${view === "register" ? "show" : ""}`}
            autoComplete="on"
            onSubmit={onRegisterSubmit}
          >
            <RegisterFormBlock
              t={t}
              onGoLogin={() => setView("login")}
              submitting={registerSubmitting}
              error={registerError}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
