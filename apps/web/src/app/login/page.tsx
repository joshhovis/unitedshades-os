'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@unitedshades.local');
  const [password, setPassword] = useState('ChangeMe123!');
  const [err, setErr] = useState('');

  async function login() {
    setErr('');

    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      setErr(text || 'Login failed');
      return;
    }

    router.replace('/customers');
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md border rounded bg-white p-6 space-y-4'>
        <div className='text-2xl font-bold text-black'>Login</div>

        <input
          className='border rounded px-3 py-2 w-full'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className='border rounded px-3 py-2 w-full'
          placeholder='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className='border rounded px-3 py-2 w-full' onClick={login}>
          Login
        </button>

        {err ? <div className='text-sm text-red-600'>{err}</div> : null}
      </div>
    </div>
  );
}
