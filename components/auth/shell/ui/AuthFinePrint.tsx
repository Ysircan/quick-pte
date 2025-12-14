'use client';

export default function AuthFinePrint() {
  return (
    <div className="finePrint">
      By creating an account, you agree to our{' '}
      <a href="#" onClick={(e) => e.preventDefault()}>
        Terms
      </a>{' '}
      and{' '}
      <a href="#" onClick={(e) => e.preventDefault()}>
        Privacy
      </a>
      .
    </div>
  );
}
