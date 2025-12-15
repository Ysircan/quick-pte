// app/dashboard/layout.tsx
import DashboardBackground from "@/components/dashboard/background/DashboardBackground";
import NavbarSkeleton from "@/components/default/NavbarSkeleton";

const NAV_ITEMS = [
  { label: "DASHBOARD", href: "/dashboard" },
  { label: "LIBRARY", href: "/dashboard/library" },
  { label: "STORE", href: "/store" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardBackground>
      <NavbarSkeleton brand="QUICK" links={NAV_ITEMS} />
      <div style={{ paddingTop: 72 }}>{children}</div>
    </DashboardBackground>
  );
}
