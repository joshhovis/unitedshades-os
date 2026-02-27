'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`font-semibold px-3 py-2 rounded hover:bg-white/5 ${
        active ? 'bg-white/5' : ''
      }`}
    >
      {label}
    </Link>
  );
}

export default function Nav() {
  return (
    <div className='border-b'>
      <div className='max-w-5xl mx-auto p-4 flex gap-2'>
        <NavLink href='/customers' label='Customers' />
        <NavLink href='/inventory' label='Inventory' />
      </div>
    </div>
  );
}
