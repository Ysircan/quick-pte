"use client";

import { useCallback, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  // 你的 /api/auth/me 目前没返回 avatarUrl，所以这里先做可选，避免 UI 读到 undefined 崩
  avatarUrl?: string | null;
  createdAt: string;
  isSystemAccount: boolean;
};

const TOKEN_KEY = "token";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearTokenAndUser = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    setLoading(true);

    let token: string | null = null;
    try {
      token = localStorage.getItem(TOKEN_KEY);
    } catch {
      token = null;
    }

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      // 401/403 这类就是 token 不对或过期：清掉 token，回到干净未登录态
      if (res.status === 401 || res.status === 403) {
        clearTokenAndUser();
        setLoading(false);
        return;
      }

      // 其它非 2xx：不要误判为“已登录”，但也要把用户状态置空
      if (!res.ok) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 你的后端格式：{ ok: true, user } 或 { ok: false, error }
      const data: any = await res.json();

      if (!data?.ok || !data?.user) {
        // ok:false 的情况（也可能是 404 user not found）
        // 这里保守处理：清 token，避免永远带着坏 token
        clearTokenAndUser();
        setLoading(false);
        return;
      }

      setUser(data.user as User);
    } catch (err) {
      // 网络错误/JSON错误：不要清 token（可能只是临时故障），但用户态置空
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [clearTokenAndUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 给登录成功后调用：await refresh()
  const refresh = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return { user, loading, refresh };
}
