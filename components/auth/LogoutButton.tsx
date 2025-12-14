'use client';

import { useRouter } from 'next/navigation';

type Props = {
  className?: string;
  redirectTo?: string; // 默认跳回 /auth/login
  tokenKey?: string;   // 默认 'token'
  children?: React.ReactNode;
};

export default function LogoutButton({
  className,
  redirectTo = '/auth/login',
  tokenKey = 'token',
  children = 'Logout',
}: Props) {
  const router = useRouter();

  const onLogout = () => {
    try {
      localStorage.removeItem(tokenKey);
      // 如果你还存过别的键（如 user），也可以一起清：
      // localStorage.removeItem('user');
    } catch {}

    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <button type="button" className={className} onClick={onLogout}>
      {children}
    </button>
  );
}
