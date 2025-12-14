'use client';

import AuthField from '../ui/AuthField';
import AuthPrimaryButton from '../ui/AuthPrimaryButton';
import AuthRowLinks from '../ui/AuthRowLinks';
import AuthFinePrint from '../ui/AuthFinePrint';

export default function RegisterFormBlock({
  onGoLogin,
  submitting,
  error,
}: {
  onGoLogin: () => void;
  submitting?: boolean;
  error?: string | null;
}) {
  return (
    <>
      <h2>Create your Quick ID</h2>
      <p>One account for learning, tracking, and reporting.</p>

      <AuthField id="regEmail" label="Email" placeholder="you@example.com" autoComplete="email" />
      <AuthField id="regPwd" label="Password" type="password" placeholder="Create a password" autoComplete="new-password" />
      <AuthField id="regPwd2" label="Confirm" type="password" placeholder="Repeat password" autoComplete="new-password" />

      <AuthPrimaryButton text={submitting ? 'CREATING...' : 'CREATE ACCOUNT'} disabled={submitting} />

      {error ? (
        <div className="finePrint" role="alert">
          {error}
        </div>
      ) : null}

      <AuthRowLinks
        left={{ text: 'Already have an account?', onClick: onGoLogin }}
        right={{ text: 'Terms' }}
      />

      <AuthFinePrint />
    </>
  );
}
