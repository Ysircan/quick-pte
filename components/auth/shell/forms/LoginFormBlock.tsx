'use client';

import AuthField from '../ui/AuthField';
import AuthPrimaryButton from '../ui/AuthPrimaryButton';
import AuthRowLinks from '../ui/AuthRowLinks';

export default function LoginFormBlock({
  onGoRegister,
  submitting,
  error,
}: {
  onGoRegister: () => void;
  submitting?: boolean;
  error?: string | null;
}) {
  return (
    <>
      <h2>Sign in to Quick</h2>
      <p>Welcome back. Pick up where you left off.</p>

      <AuthField id="email" label="Email" placeholder="you@example.com" autoComplete="email" />
      <AuthField id="pwd" label="Password" type="password" placeholder="••••••••" autoComplete="current-password" />

      <AuthPrimaryButton text={submitting ? 'LOGGING IN...' : 'LOGIN'} disabled={submitting} />

      {error ? (
        <div className="finePrint" role="alert">
          {error}
        </div>
      ) : null}

      <AuthRowLinks
        left={{ text: 'Forgot password?' }}
        right={{ text: 'Create account', onClick: onGoRegister }}
      />
    </>
  );
}
