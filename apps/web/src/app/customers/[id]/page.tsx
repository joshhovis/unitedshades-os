'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phoneRaw: string | null;
  notes: string | null;
};

type Vehicle = {
  id: string;
  customerId: string;
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  vin: string | null;
  notes: string | null;
  createdAt: string;
};

type Job = {
  id: string;
  customerId: string;
  vehicleId: string | null;
  status: 'DRAFT' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  scheduledAt: string | null;
  totalCents: number;
  createdAt: string;
};

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const customerId = params?.id;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  // vehicle form
  const [year, setYear] = useState<string>('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');

  // job form
  const [jobVehicleId, setJobVehicleId] = useState<string>('');

  const vehicleOptions = useMemo(() => {
    return vehicles.map((v) => {
      const label = [v.year ?? '', v.make ?? '', v.model ?? '', v.trim ?? '']
        .filter(Boolean)
        .join(' ');
      return { id: v.id, label: label || v.id };
    });
  }, [vehicles]);

  async function loadAll() {
    if (!customerId) return;

    const [c, v, j] = await Promise.all([
      api<Customer>(`/customers/${customerId}`),
      api<Vehicle[]>(`/vehicles?customerId=${customerId}`),
      api<Job[]>(`/jobs?customerId=${customerId}`),
    ]);

    setCustomer(c);
    setVehicles(v);
    setJobs(j);
  }

  async function createVehicle() {
    if (!customerId) return;

    const y = year.trim() ? Number(year) : undefined;
    await api<Vehicle>('/vehicles', {
      method: 'POST',
      body: JSON.stringify({
        customerId,
        year: Number.isFinite(y) ? y : undefined,
        make: make || undefined,
        model: model || undefined,
        trim: trim || undefined,
      }),
    });

    setYear('');
    setMake('');
    setModel('');
    setTrim('');
    await loadAll();
  }

  async function createJob() {
    if (!customerId) return;

    await api<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        customerId,
        vehicleId: jobVehicleId || undefined,
        notes: '',
      }),
    });

    setJobVehicleId('');
    await loadAll();
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  if (!customerId) return null;

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <Link className='text-sm underline opacity-70' href='/customers'>
            ← Back to customers
          </Link>
          <h1 className='text-2xl font-bold mt-2'>
            {customer ? customer.name : 'Loading...'}
          </h1>
          {customer?.email ? (
            <div className='text-sm opacity-70'>{customer.email}</div>
          ) : null}
          <div className='text-xs opacity-50 mt-1'>{customerId}</div>
        </div>
      </div>

      {/* Vehicles */}
      <div className='border rounded'>
        <div className='p-4 border-b font-semibold'>Vehicles</div>

        <div className='p-4 space-y-2 border-b'>
          <div className='text-sm font-medium'>Add vehicle</div>
          <div className='grid grid-cols-1 sm:grid-cols-4 gap-2'>
            <input
              className='border rounded px-3 py-2'
              placeholder='Year'
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <input
              className='border rounded px-3 py-2'
              placeholder='Make'
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
            <input
              className='border rounded px-3 py-2'
              placeholder='Model'
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <input
              className='border rounded px-3 py-2'
              placeholder='Trim'
              value={trim}
              onChange={(e) => setTrim(e.target.value)}
            />
          </div>
          <button
            className='border rounded px-3 py-2'
            onClick={createVehicle}
            disabled={!make.trim() && !model.trim() && !year.trim()}
          >
            Add vehicle
          </button>
        </div>

        <div>
          {vehicles.length === 0 ? (
            <div className='p-4 opacity-70'>No vehicles yet.</div>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} className='p-4 border-b last:border-b-0'>
                <div className='font-semibold'>
                  {[v.year, v.make, v.model, v.trim]
                    .filter(Boolean)
                    .join(' ') || 'Vehicle'}
                </div>
                <div className='text-xs opacity-50'>{v.id}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Jobs */}
      <div className='border rounded'>
        <div className='p-4 border-b font-semibold'>Jobs</div>

        <div className='p-4 space-y-2 border-b'>
          <div className='text-sm font-medium'>Create job</div>
          <div className='flex flex-col sm:flex-row gap-2'>
            <select
              className='border rounded px-3 py-2 flex-1'
              value={jobVehicleId}
              onChange={(e) => setJobVehicleId(e.target.value)}
            >
              <option value=''>(optional) Link a vehicle</option>
              {vehicleOptions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
            <button className='border rounded px-3 py-2' onClick={createJob}>
              Create job
            </button>
          </div>
        </div>

        <div>
          {jobs.length === 0 ? (
            <div className='p-4 opacity-70'>No jobs yet.</div>
          ) : (
            jobs.map((j) => (
              <Link
                key={j.id}
                href={`/jobs/${j.id}`}
                className='block p-4 border-b last:border-b-0 hover:bg-black/5'
              >
                <div className='flex items-center justify-between'>
                  <div className='font-semibold'>
                    Job • {j.status}
                    {j.vehicleId ? (
                      <span className='text-xs opacity-60 ml-2'>
                        (vehicle linked)
                      </span>
                    ) : null}
                  </div>
                  <div className='text-sm opacity-70'>
                    ${(j.totalCents / 100).toFixed(2)}
                  </div>
                </div>
                <div className='text-xs opacity-50 mt-1'>{j.id}</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
