"use client";

import QuickHero from "@/components/dashboard/hero/QuickHero";
import { useActiveLanguage } from "@/components/default/navbar/activeLanguageStore";

export default function DashboardClient() {
  const { accent } = useActiveLanguage();

  return (
    <main style={{ padding: 24 }}>
      <QuickHero accent={accent} />
    </main>
  );
}
