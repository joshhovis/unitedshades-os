'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

type Customer = {
  id: string;
  name: string;
  email: string | null;
  createdAt: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [search, setSearch] = useState('');
  const [err, setErr] = useState('');

  async function load() {
    setErr('');
    try {
      const q = search.trim();
      const path = q.length
        ? `/customers?search=${encodeURIComponent(q)}`
        : '/customers';
      const data = await api<Customer[]>(path);
      setCustomers(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to load customers');
    }
  }

  async function create() {
    setErr('');
    try {
      const n = name.trim();
      const e = email.trim();

      await api<Customer>('/customers', {
        method: 'POST',
        body: JSON.stringify({
          name: n,
          email: e.length ? e : undefined,
        }),
      });

      setName('');
      setEmail('');
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to create customer');
    }
  }

  useEffect(() => {
    (async () => {
      const data = await api<Customer[]>('/customers');
      setCustomers(data);
    })();
  }, []);

  return (
    <div className='p-6 max-w-3xl mx-auto space-y-6'>
      <h1 className='text-2xl font-bold'>Customers</h1>

      <div className='border rounded p-4 space-y-2'>
        <div className='font-semibold'>Create customer</div>
        <div className='flex gap-2'>
          <input
            className='border rounded px-3 py-2 flex-1'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className='border rounded px-3 py-2 flex-1'
            placeholder='Email (optional)'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className='border rounded px-3 py-2'
            onClick={create}
            disabled={!name.trim()}
          >
            Add
          </button>
        </div>
      </div>

      {/* Search */}
      <div className='border rounded p-4 space-y-2'>
        <div className='font-semibold'>Search</div>
        <div className='flex gap-2'>
          <input
            className='border rounded px-3 py-2 flex-1'
            placeholder='Search name or email...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className='border rounded px-3 py-2' onClick={load}>
            Search
          </button>
          <button
            className='border rounded px-3 py-2'
            onClick={() => {
              setSearch('');
              setTimeout(load, 0);
            }}
          >
            Clear
          </button>
        </div>
        {err ? <div className='text-sm opacity-80'>{err}</div> : null}
      </div>

      {/* List */}
      <div className='border rounded'>
        {customers.map((c) => (
          <Link
            key={c.id}
            href={`/customers/${c.id}`}
            className='block p-3 border-b last:border-b-0 hover:bg-black/5'
          >
            <div className='font-semibold'>{c.name}</div>
            <div className='text-sm opacity-70'>{c.email ?? ''}</div>
            <div className='text-xs opacity-50'>{c.id}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
