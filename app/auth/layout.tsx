import './auth.css';
import AuthBodyMode from './AuthBodyMode';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthBodyMode />
      {children}
    </>
  );
}
