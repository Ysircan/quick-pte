'use client';

export default function AuthCardTabs({
  view,
  onChange,
}: {
  view: 'login' | 'register';
  onChange: (v: 'login' | 'register') => void;
}) {
  return (
    <div className="authTabs" role="tablist" aria-label="Auth Tabs">
      <button
        className={`tab ${view === 'login' ? 'active' : ''}`}
        type="button"
        aria-selected={view === 'login'}
        onClick={() => onChange('login')}
      >
        SIGN IN
      </button>
      <button
        className={`tab ${view === 'register' ? 'active' : ''}`}
        type="button"
        aria-selected={view === 'register'}
        onClick={() => onChange('register')}
      >
        REGISTER
      </button>
    </div>
  );
}
