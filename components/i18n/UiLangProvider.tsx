"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UiLang = "EN" | "ZH";
const KEY = "quick_ui_lang";

type Ctx = {
  uiLang: UiLang;
  setUiLang: (v: UiLang) => void;
  t: (key: string) => string;
};

const UiLangContext = createContext<Ctx | null>(null);

// ✅ 先做最小字典：你用到哪个 key 就加哪个
const DICT: Record<UiLang, Record<string, string>> = {
  EN: {
    // 你之前的 key（如果你已经在用）
    "nav.dashboard": "DASHBOARD",
    "nav.library": "LIBRARY",
    "nav.store": "STORE",

    // ✅ 兼容你目前 links.label 直接传大写的写法
    DASHBOARD: "DASHBOARD",
    LIBRARY: "LIBRARY",
    STORE: "STORE",
    
    "auth.header.title": "QUICK PORTAL",
"auth.header.badgeNew": "NEW",
"auth.header.badgeOk": "STATUS OK",
"auth.header.sub": "TRAINING · TASKS · PROGRESS · REPORTS",
"auth.tab.login": "SIGN IN",
"auth.tab.register": "REGISTER",
"auth.login.title": "Sign in to Quick",
"auth.login.sub": "Welcome back. Pick up where you left off.",
"auth.field.email": "Email",
"auth.field.email.ph": "you@example.com",
"auth.field.password": "Password",
"auth.field.password.ph": "••••••••",
"auth.login.btn": "LOGIN",
"auth.login.btn.loading": "LOGGING IN...",
"auth.login.forgot": "Forgot password?",
"auth.login.toRegister": "Create account",
"auth.register.title": "Create your Quick ID",
"auth.register.sub": "One account for learning, tracking, and reporting.",
"auth.field.name": "Name",
"auth.field.name.ph": "Your name",
"auth.field.passwordCreate.ph": "Create a password",
"auth.field.passwordConfirm": "Confirm",
"auth.field.passwordConfirm.ph": "Repeat password",
"auth.register.btn": "CREATE ACCOUNT",
"auth.register.btn.loading": "CREATING...",
"auth.register.toLogin": "Already have an account?",
"auth.register.terms": "Terms",
"auth.finePrint.prefix": "By creating an account, you agree to our",
"auth.finePrint.terms": "Terms",
"auth.finePrint.and": "and",
"auth.finePrint.privacy": "Privacy",


  },
  ZH: {
    "nav.dashboard": "仪表盘",
    "nav.library": "题库",
    "nav.store": "商城",

    // ✅ 兼容
    DASHBOARD: "仪表盘",
    LIBRARY: "题库",
    STORE: "商城",
    "auth.header.title": "QUICK 入口",
"auth.header.badgeNew": "新",
"auth.header.badgeOk": "状态正常",
"auth.header.sub": "训练 · 任务 · 进度 · 报告",
"auth.tab.login": "登录",
"auth.tab.register": "注册",
"auth.login.title": "登录 Quick",
"auth.login.sub": "欢迎回来，继续你上次的进度。",
"auth.field.email": "邮箱",
"auth.field.email.ph": "你的邮箱",
"auth.field.password": "密码",
"auth.field.password.ph": "••••••••",
"auth.login.btn": "登录",
"auth.login.btn.loading": "正在登录…",
"auth.login.forgot": "忘记密码？",
"auth.login.toRegister": "注册账号",
"auth.register.title": "创建 Quick 账号",
"auth.register.sub": "一个账号，用于学习、追踪与报告。",
"auth.field.name": "姓名",
"auth.field.name.ph": "你的名字",
"auth.field.passwordCreate.ph": "设置密码",
"auth.field.passwordConfirm": "确认密码",
"auth.field.passwordConfirm.ph": "再次输入密码",
"auth.register.btn": "创建账号",
"auth.register.btn.loading": "正在创建…",
"auth.register.toLogin": "已经有账号？",
"auth.register.terms": "条款",
"auth.finePrint.prefix": "创建账号即表示你同意我们的",
"auth.finePrint.terms": "服务条款",
"auth.finePrint.and": "和",
"auth.finePrint.privacy": "隐私政策",


  },
  
};

export function UiLangProvider({ children }: { children: React.ReactNode }) {
  const [uiLang, setUiLang] = useState<UiLang>("EN");

  // load once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as UiLang | null;
      if (saved === "EN" || saved === "ZH") setUiLang(saved);
    } catch {}
  }, []);

  // persist + reflect to <html>
  useEffect(() => {
    try {
      localStorage.setItem(KEY, uiLang);
    } catch {}
    document.documentElement.setAttribute("data-ui-lang", uiLang);
    document.documentElement.lang = uiLang === "ZH" ? "zh-CN" : "en";
  }, [uiLang]);

  const t = useMemo(() => {
    return (key: string) => DICT[uiLang]?.[key] ?? key;
  }, [uiLang]);

  const value = useMemo(() => ({ uiLang, setUiLang, t }), [uiLang, t]);

  return <UiLangContext.Provider value={value}>{children}</UiLangContext.Provider>;
}

export function useUiLang() {
  const ctx = useContext(UiLangContext);
  if (!ctx) throw new Error("useUiLang must be used inside UiLangProvider");
  return ctx;
}
