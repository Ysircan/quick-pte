'use client';

import React from 'react';
import NavbarSkeleton from '@/components/default/NavbarSkeleton';
import BackgroundWall from './BackgroundWall';
import TypeFog from './TypeFog';

type NavItem = {
  label: string;
  href: string;
};

const links: NavItem[] = [

  { label: 'AGENCIES', href: '/agencies' },
  { label: 'FAQ', href: '/faq' },
  { label: 'LOGIN', href: '/auth/login' },
];

export default function QuickPortalShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarSkeleton brand="QUICK" links={links} />

      <TypeFog />
      <BackgroundWall />
      {children}
    </>
  );
}
