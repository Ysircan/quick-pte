'use client';
import { QuickPortalShell, QuickPortalCard } from '@/components/auth/shell';

export default function LoginClient() {
  return (
    <QuickPortalShell>
      <QuickPortalCard initialView="login" />
    </QuickPortalShell>
  );
}
