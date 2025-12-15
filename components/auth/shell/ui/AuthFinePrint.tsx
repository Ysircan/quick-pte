"use client";

import { useUiLang } from "@/components/i18n/UiLangProvider";

export default function AuthFinePrint() {
  const { t } = useUiLang();

  return (
    <div className="finePrint">
      {t("auth.finePrint.prefix")}{" "}
      <a href="/terms" className="fineLink">
        {t("auth.finePrint.terms")}
      </a>{" "}
      {t("auth.finePrint.and")}{" "}
      <a href="/privacy" className="fineLink">
        {t("auth.finePrint.privacy")}
      </a>
      .
    </div>
  );
}
