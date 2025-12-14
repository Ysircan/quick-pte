'use client';

import { useEffect } from 'react';

export default function AuthBodyMode() {
  useEffect(() => {
    document.body.classList.add('auth-mode');
    return () => document.body.classList.remove('auth-mode');
  }, []);

  return null;
}
