'use client';

import { useEffect, useState } from 'react';
import { fetchMe, type Me } from '@/lib/auth';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function AccountPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [msg, setMsg] = useState('');

  async function save() {
    setMsg('');

    const res = await fetch(`${API}/auth/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phoneRaw: phoneRaw.trim().length ? phoneRaw.trim() : null,
        timezone: timezone.trim(),
      }),
    });

    if (!res.ok) {
      setMsg('Save failed');
      return;
    }

    setMsg('Saved');

    const updated = await fetchMe();
    setMe(updated);
    setName(updated.name);
    setEmail(updated.email);
    setPhoneRaw(updated.phoneRaw ?? '');
    setTimezone(updated.timezone);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await fetchMe();
      if (cancelled) return;

      setMe(data);
      setName(data.name);
      setEmail(data.email);
      setPhoneRaw(data.phoneRaw ?? '');
      setTimezone(data.timezone);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Account</h1>

      {!me ? (
        <div className='opacity-70'>Loading...</div>
      ) : (
        <div className='max-w-xl border rounded p-4 space-y-3 bg-white'>
          <div className='space-y-1'>
            <div className='text-sm font-semibold'>Name</div>
            <input
              className='border rounded px-3 py-2 w-full'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className='space-y-1'>
            <div className='text-sm font-semibold'>Email</div>
            <input
              className='border rounded px-3 py-2 w-full'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='space-y-1'>
            <div className='text-sm font-semibold'>Mobile Phone</div>
            <input
              className='border rounded px-3 py-2 w-full'
              value={phoneRaw}
              onChange={(e) => setPhoneRaw(e.target.value)}
              placeholder='+17043186040'
            />
          </div>

          <div className='space-y-1'>
            <div className='text-sm font-semibold'>Timezone</div>
            <input
              className='border rounded px-3 py-2 w-full'
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder='America/New_York'
            />
          </div>

          <div className='flex items-center gap-2'>
            <button
              className='border rounded px-3 py-2 text-[#111827]'
              onClick={save}
            >
              Save
            </button>
            {msg ? <div className='text-sm opacity-70'>{msg}</div> : null}
          </div>
        </div>
      )}
    </div>
  );
}
