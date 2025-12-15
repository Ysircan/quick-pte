"use client";

import AuthField from "../ui/AuthField";
import AuthPrimaryButton from "../ui/AuthPrimaryButton";
import AuthRowLinks from "../ui/AuthRowLinks";

export default function LoginFormBlock({
  t,
  onGoRegister,
  submitting,
  error,
}: {
  t: (key: string) => string;
  onGoRegister: () => void;
  submitting?: boolean;
  error?: string | null;
}) {
  return (
    <>
      <h2>{t("auth.login.title")}</h2>
      <p>{t("auth.login.sub")}</p>

      <AuthField
        id="email"
        label={t("auth.field.email")}
        placeholder={t("auth.field.email.ph")}
        autoComplete="email"
      />

      <AuthField
        id="pwd"
        label={t("auth.field.password")}
        type="password"
        placeholder={t("auth.field.password.ph")}
        autoComplete="current-password"
      />

      <AuthPrimaryButton
        text={submitting ? t("auth.login.btn.loading") : t("auth.login.btn")}
        disabled={submitting}
      />

      {error ? (
        <div className="finePrint" role="alert">
          {error}
        </div>
      ) : null}

      <AuthRowLinks
        left={{ text: t("auth.login.forgot") }}
        right={{ text: t("auth.login.toRegister"), onClick: onGoRegister }}
      />
    </>
  );
}
