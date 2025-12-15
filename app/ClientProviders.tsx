"use client";

import { UiLangProvider } from "@/components/i18n/UiLangProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <UiLangProvider>{children}</UiLangProvider>;
}
