'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

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

  async function load() {
    const data = await api<Customer[]>('/customers');
    setCustomers(data);
  }

  async function create() {
    await api<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify({ name, email: email || undefined }),
    });
    setName('');
    setEmail('');
    await load();
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

      <div className='border rounded'>
        {customers.map((c) => (
          <div key={c.id} className='p-3 border-b last:border-b-0'>
            <div className='font-semibold'>{c.name}</div>
            <div className='text-sm opacity-70'>{c.email ?? ''}</div>
            <div className='text-xs opacity-50'>{c.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
