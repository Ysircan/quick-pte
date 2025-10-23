// app/auth/register/page.tsx
export const dynamic = 'force-dynamic'; // 强制生成 lambda
export const runtime = 'nodejs';

import RegisterClient from './RegisterClient';

export default function Page() {
  return <RegisterClient />;
}
