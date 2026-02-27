'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Item({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/80 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className='w-2 h-2 rounded-full bg-white/30' />
      {label}
    </Link>
  );
}

export default function SideNav() {
  return (
    <aside className='w-60 bg-zinc-950 text-white border-r border-white/10 min-h-[calc(100vh-56px)]'>
      <div className='py-2'>
        <Item href='/dashboard' label='Dashboard' />
        <Item href='/customers' label='Customers' />
        <Item href='/inventory' label='Inventory' />
      </div>
    </aside>
  );
}
