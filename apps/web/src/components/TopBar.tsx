'use client';

import Link from 'next/link';
import Image from 'next/image';
import usosLogo from '../../public/usos-logo.png';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchMe, logout, type Me } from '@/lib/auth';

export default function TopBar() {
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
    <div className='h-14 bg-zinc-900 text-white border-b border-white/10 flex items-center'>
      <div className='w-full px-4 flex items-center justify-between'>
        {/* Left: logo */}
        <Link href='/dashboard' className='flex items-center gap-2'>
          <Image
            src={usosLogo}
            alt='United Shades OS'
            width={180}
            height={100}
            priority
          />
        </Link>

        {/* Right: actions */}
        <div className='flex items-center gap-3'>
          <button className='px-3 py-2 rounded hover:bg-white/10 text-sm font-semibold'>
            Schedule
          </button>

          <div className='relative' ref={menuRef}>
            <button
              className='px-3 py-2 rounded hover:bg-white/10 text-sm font-semibold'
              onClick={() => setOpen((v) => !v)}
            >
              {me?.name ?? 'Account'} ▾
            </button>

            {open ? (
              <div className='absolute right-0 mt-2 w-48 rounded border border-white/10 bg-zinc-950 shadow text-white overflow-hidden'>
                <Link
                  className='block px-4 py-2 hover:bg-white/10 text-white'
                  href='/account'
                  onClick={() => setOpen(false)}
                >
                  Account
                </Link>
                <button
                  className='block w-full text-left px-4 py-2 hover:bg-white/10 text-white'
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
