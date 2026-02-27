'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { fetchMe, logout, type Me } from '@/lib/auth';

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`font-semibold px-3 py-2 rounded hover:bg-black/5 ${
        active ? 'bg-black/5' : ''
      }`}
    >
      {label}
    </Link>
  );
}

export default function Nav() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMe()
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  async function onLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <div className='border-b'>
      <div className='max-w-5xl mx-auto p-4 flex items-center justify-between'>
        <div className='flex gap-2'>
          <NavLink href='/customers' label='Customers' />
          <NavLink href='/inventory' label='Inventory' />
        </div>

        <div className='relative' ref={menuRef}>
          <button
            className='font-semibold px-3 py-2 rounded hover:bg-black/5 text-white'
            onClick={() => setOpen((v) => !v)}
          >
            {me?.name ?? 'Account'} ▾
          </button>

          {open ? (
            <div className='absolute right-0 mt-2 w-48 border rounded bg-zinc-900 text-white shadow'>
              <Link
                className='block px-4 py-2 hover:bg-white/10'
                href='/account'
                onClick={() => setOpen(false)}
              >
                Account
              </Link>
              <button
                className='block w-full text-left px-4 py-2 hover:bg-white/10'
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
