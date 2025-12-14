"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useUser from "./useUser";

/**
 * 页面登录校验：未登录自动跳转到 login 页
 * - 用 replace 避免回退弹簧
 * - 带 next 参数，登录后可回跳
 */
export default function useAuth(redirectTo: string = "/auth/login") {
  const { user, loading, refresh } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;
    if (user) return;

    const current = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    const url = `${redirectTo}?next=${encodeURIComponent(current || "/dashboard")}`;

    // 用 replace：用户点返回不会再回到受保护页触发二次跳转
    router.replace(url);
  }, [user, loading, redirectTo, router, pathname, searchParams]);

  return { user, loading, refresh };
}





