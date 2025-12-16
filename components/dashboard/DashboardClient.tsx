"use client";

import QuickHero from "@/components/dashboard/hero/QuickHero";
import TodayTodoCard from "@/components/dashboard/todo/TodayTodoCard";
import { useActiveLanguage } from "@/components/default/navbar/activeLanguageStore";

// components/dashboard/DashboardClient.tsx
export default function DashboardClient() {
  const { accent } = useActiveLanguage();

  return (
    <main style={{ display: "grid", gap: 0, paddingBottom: 0
     }}>
      <QuickHero accent={accent} fullHeight={false} />
      <TodayTodoCard />
    </main>
  );
}
