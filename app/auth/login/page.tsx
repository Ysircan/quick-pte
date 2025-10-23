// app/auth/login/page.tsx
export const dynamic = 'force-dynamic'; // 强制生成 lambda
export const runtime = 'nodejs';

import LoginClient from './LoginClient';

export default function Page() {
  return <LoginClient />;
}
