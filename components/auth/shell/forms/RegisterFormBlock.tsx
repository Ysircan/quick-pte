"use client";

import AuthField from "../ui/AuthField";
import AuthPrimaryButton from "../ui/AuthPrimaryButton";
import AuthRowLinks from "../ui/AuthRowLinks";
import AuthFinePrint from "../ui/AuthFinePrint";

export default function RegisterFormBlock({
  t,
  onGoLogin,
  submitting,
  error,
}: {
  t: (key: string) => string;
  onGoLogin: () => void;
  submitting?: boolean;
  error?: string | null;
}) {
  return (
    <>
      <h2>{t("auth.register.title")}</h2>
      <p>{t("auth.register.sub")}</p>

      <AuthField
        id="regName"
        label={t("auth.field.name")}
        placeholder={t("auth.field.name.ph")}
        autoComplete="name"
      />

      <AuthField
        id="regEmail"
        label={t("auth.field.email")}
        placeholder={t("auth.field.email.ph")}
        autoComplete="email"
      />

      <AuthField
        id="regPwd"
        label={t("auth.field.password")}
        type="password"
        placeholder={t("auth.field.passwordCreate.ph")}
        autoComplete="new-password"
      />

      <AuthField
        id="regPwd2"
        label={t("auth.field.passwordConfirm")}
        type="password"
        placeholder={t("auth.field.passwordConfirm.ph")}
        autoComplete="new-password"
      />

      <AuthPrimaryButton
        text={submitting ? t("auth.register.btn.loading") : t("auth.register.btn")}
        disabled={submitting}
      />

      {error ? (
        <div className="finePrint" role="alert">
          {error}
        </div>
      ) : null}

      <AuthRowLinks
        left={{ text: t("auth.register.toLogin"), onClick: onGoLogin }}
        right={{ text: t("auth.register.terms") }}
      />

      <AuthFinePrint />
    </>
  );
}
