'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

type InventoryItem = {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  reorderThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  onHand: number;
  belowThreshold: boolean;
};

type Movement = {
  id: string;
  itemId: string;
  qtyChange: number;
  reason: 'RESTOCK' | 'JOB_USAGE' | 'WASTE' | 'ADJUSTMENT';
  note: string | null;
  jobId: string | null;
  createdAt: string;
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  // create item form
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [unit, setUnit] = useState('roll');
  const [threshold, setThreshold] = useState('0');

  // adjust form
  const [qtyChange, setQtyChange] = useState('0');
  const [reason, setReason] = useState<Movement['reason']>('RESTOCK');
  const [note, setNote] = useState('');

  async function loadItems() {
    const data = await api<InventoryItem[]>('/inventory/items');
    setItems(data);
    if (!selectedItemId && data.length) setSelectedItemId(data[0].id);
  }

  async function loadMovements(itemId?: string) {
    if (!itemId) {
      setMovements([]);
      return;
    }
    const data = await api<Movement[]>(`/inventory/movements?itemId=${itemId}`);
    setMovements(data);
  }

  async function createItem() {
    const n = name.trim();
    const s = sku.trim();
    const u = unit.trim();
    const t = threshold.trim() ? Number(threshold) : 0;

    await api('/inventory/items', {
      method: 'POST',
      body: JSON.stringify({
        name: n,
        sku: s.length ? s : undefined,
        unit: u.length ? u : undefined,
        reorderThreshold: Number.isFinite(t) ? t : 0,
      }),
    });

    setName('');
    setSku('');
    setUnit('roll');
    setThreshold('0');
    await loadItems();
  }

  async function adjustStock() {
    if (!selectedItemId) return;

    const q = Number(qtyChange);
    if (!Number.isFinite(q) || q === 0) return;

    await api('/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({
        itemId: selectedItemId,
        qtyChange: q,
        reason,
        note: note.trim() || undefined,
      }),
    });

    setQtyChange('0');
    setNote('');
    await loadItems();
    await loadMovements(selectedItemId);
  }

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadMovements(selectedItemId);
  }, [selectedItemId]);

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-6'>
      <div>
        <Link className='text-sm underline opacity-70' href='/customers'>
          ← Customers
        </Link>
        <h1 className='text-2xl font-bold mt-2'>Inventory</h1>
      </div>

      {/* Create item */}
      <div className='border rounded p-4 space-y-2'>
        <div className='font-semibold'>Create item</div>
        <div className='grid grid-cols-1 sm:grid-cols-4 gap-2'>
          <input
            className='border rounded px-3 py-2'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className='border rounded px-3 py-2'
            placeholder='SKU (optional)'
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <input
            className='border rounded px-3 py-2'
            placeholder='Unit (roll/each/ft)'
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
          <input
            className='border rounded px-3 py-2'
            placeholder='Reorder threshold'
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
        </div>
        <button
          className='border rounded px-3 py-2'
          onClick={createItem}
          disabled={!name.trim()}
        >
          Add item
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Items list */}
        <div className='border rounded'>
          <div className='p-4 border-b font-semibold'>Items</div>
          {items.length === 0 ? (
            <div className='p-4 opacity-70'>No inventory items yet.</div>
          ) : (
            items.map((it) => (
              <button
                key={it.id}
                onClick={() => setSelectedItemId(it.id)}
                className={`w-full text-left p-4 border-b last:border-b-0 hover:bg-black/5 ${
                  selectedItemId === it.id ? 'bg-black/5' : ''
                }`}
              >
                <div className='flex items-center justify-between gap-3'>
                  <div className='font-semibold'>{it.name}</div>
                  <div
                    className={`text-xs px-2 py-1 rounded border ${
                      it.belowThreshold ? 'opacity-100' : 'opacity-70'
                    }`}
                  >
                    On hand: {it.onHand}
                  </div>
                </div>
                <div className='text-sm opacity-70'>
                  {it.sku ? `SKU: ${it.sku} • ` : ''}
                  Unit: {it.unit} • Threshold: {it.reorderThreshold}
                </div>
                {it.belowThreshold ? (
                  <div className='text-sm mt-1 font-semibold'>
                    Low stock (below threshold)
                  </div>
                ) : null}
                <div className='text-xs opacity-40 mt-1'>{it.id}</div>
              </button>
            ))
          )}
        </div>

        {/* Adjust + Movements */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='border rounded p-4 space-y-2'>
            <div className='font-semibold'>Adjust stock</div>
            <div className='grid grid-cols-1 sm:grid-cols-4 gap-2'>
              <input
                className='border rounded px-3 py-2'
                placeholder='+5 or -1'
                value={qtyChange}
                onChange={(e) => setQtyChange(e.target.value)}
              />
              <select
                className='border rounded px-3 py-2'
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value as Movement['reason'])
                }
              >
                <option value='RESTOCK'>RESTOCK</option>
                <option value='JOB_USAGE'>JOB_USAGE</option>
                <option value='WASTE'>WASTE</option>
                <option value='ADJUSTMENT'>ADJUSTMENT</option>
              </select>
              <input
                className='border rounded px-3 py-2 sm:col-span-2'
                placeholder='Note (optional)'
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <button
              className='border rounded px-3 py-2'
              onClick={adjustStock}
              disabled={!selectedItemId}
            >
              Apply
            </button>
            <div className='text-xs opacity-60'>
              Use negative numbers to subtract stock.
            </div>
          </div>

          <div className='border rounded'>
            <div className='p-4 border-b font-semibold'>Movements</div>
            {movements.length === 0 ? (
              <div className='p-4 opacity-70'>No movements yet.</div>
            ) : (
              movements.map((m) => (
                <div key={m.id} className='p-4 border-b last:border-b-0'>
                  <div className='flex items-center justify-between'>
                    <div className='font-semibold'>
                      {m.reason} • {m.qtyChange > 0 ? '+' : ''}
                      {m.qtyChange}
                    </div>
                    <div className='text-xs opacity-60'>
                      {new Date(m.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {m.note ? (
                    <div className='text-sm opacity-80'>{m.note}</div>
                  ) : null}
                  {m.jobId ? (
                    <div className='text-xs opacity-60'>Job: {m.jobId}</div>
                  ) : null}
                  <div className='text-xs opacity-40 mt-1'>{m.id}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
