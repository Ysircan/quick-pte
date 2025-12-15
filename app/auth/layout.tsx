import "./auth.css";
import AuthBodyMode from "./AuthBodyMode";
import UiLanguageGlobe from "@/components/default/navbar/UiLanguageGlobe";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthBodyMode />

      {/* 🌐 右上角 UI language（登录页也可切换） */}
      <div className="authLang">
        <UiLanguageGlobe />
      </div>

      {children}
    </>
  );
}
