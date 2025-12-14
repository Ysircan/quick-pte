'use client';

import { useState } from 'react';
import AuthCardHeader from './AuthCardHeader';
import AuthCardTabs from './AuthCardTabs';
import LoginFormBlock from './forms/LoginFormBlock';
import RegisterFormBlock from './forms/RegisterFormBlock';

const TOKEN_KEY = 'token';

export default function QuickPortalCard({ initialView }: { initialView: 'login' | 'register' }) {
  const [view, setView] = useState<'login' | 'register'>(initialView);

  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [registerSubmitting, setRegisterSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const afterAuth = async () => {
    // 可选：你想验证 me 就打开这段；不想就删掉
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      await fetch('/api/auth/me', {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } catch {}

    window.location.href = '/dashboard';
;
  };

  const onLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);
      const email = String(fd.get('email') ?? '').trim();
      const password = String(fd.get('pwd') ?? '');

      if (!email || !password) throw new Error('Please enter email and password.');

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(json?.error ?? json?.message ?? 'Login failed.');

      // ✅ 你后端已固定好：这里就直接取 token
      if (json?.token) localStorage.setItem(TOKEN_KEY, json.token);

      await afterAuth();
    } catch (err: any) {
      setLoginError(err?.message ?? 'Login failed.');
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
      const email = String(fd.get('regEmail') ?? '').trim();
      const password = String(fd.get('regPwd') ?? '');
      const confirmPassword = String(fd.get('regPwd2') ?? '');

      if (!email || !password) throw new Error('Please enter email and password.');
      if (confirmPassword && confirmPassword !== password) throw new Error('Passwords do not match.');

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(json?.error ?? json?.message ?? 'Register failed.');

      if (json?.token) localStorage.setItem(TOKEN_KEY, json.token);

      await afterAuth();
    } catch (err: any) {
      setRegisterError(err?.message ?? 'Register failed.');
    } finally {
      setRegisterSubmitting(false);
    }
  };

  return (
    <div className="loginLayer">
      <div className="loginCard" aria-label="Quick Auth">
        <AuthCardHeader />

        <div className="authBody">
          <AuthCardTabs view={view} onChange={setView} />

          <form
            className={`authForm ${view === 'login' ? 'show' : ''}`}
            autoComplete="on"
            onSubmit={onLoginSubmit}
          >
            <LoginFormBlock
              onGoRegister={() => setView('register')}
              submitting={loginSubmitting}
              error={loginError}
            />
          </form>

          <form
            className={`authForm ${view === 'register' ? 'show' : ''}`}
            autoComplete="on"
            onSubmit={onRegisterSubmit}
          >
            <RegisterFormBlock
              onGoLogin={() => setView('login')}
              submitting={registerSubmitting}
              error={registerError}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
