'use client';

import { QuickPortalShell, QuickPortalCard } from '@/components/auth/shell';

export default function RegisterClient() {
  return (
    <QuickPortalShell>
      <QuickPortalCard initialView="register" />
    </QuickPortalShell>
  );
}
