'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

type Job = {
  id: string;
  customerId: string;
  vehicleId: string | null;
  status: 'DRAFT' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  scheduledAt: string | null;
  completedAt: string | null;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  notes: string | null;
};

type Customer = { id: string; name: string };
type Vehicle = {
  id: string;
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
};

type LineItem = {
  id: string;
  jobId: string;
  description: string;
  qty: number;
  unitPriceCents: number;
  totalCents: number;
};

type JobNote = {
  id: string;
  jobId: string;
  content: string;
  createdAt: string;
};
type JobPhoto = { id: string; jobId: string; s3Key: string; createdAt: string };

type JobDetail = Job & {
  customer: Customer;
  vehicle: Vehicle | null;
  lineItems: LineItem[];
  jobNotes: JobNote[];
  photos: JobPhoto[];
};

type UploadUrlResponse = {
  uploadUrl: string;
  key: string;
  photoId: string;
};

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;

  const [job, setJob] = useState<JobDetail | null>(null);

  const [desc, setDesc] = useState('');
  const [qty, setQty] = useState('1');
  const [unit, setUnit] = useState('0');

  const [note, setNote] = useState('');

  const [fileName, setFileName] = useState('test.jpg');
  const [contentType, setContentType] = useState('image/jpeg');
  const [uploadResp, setUploadResp] = useState<UploadUrlResponse | null>(null);
  const [uploadErr, setUploadErr] = useState<string>('');

  const [status, setStatus] = useState<Job['status']>('DRAFT');
  const [scheduledAt, setScheduledAt] = useState(''); // datetime-local value
  const [jobErr, setJobErr] = useState('');

  const money = useMemo(() => {
    const subtotal = (job?.subtotalCents ?? 0) / 100;
    const tax = (job?.taxCents ?? 0) / 100;
    const total = (job?.totalCents ?? 0) / 100;
    return { subtotal, tax, total };
  }, [job]);

  async function load() {
    if (!jobId) return;
    const data = await api<JobDetail>(`/jobs/${jobId}`);
    setJob(data);

    setStatus(data.status);
    setScheduledAt(data.scheduledAt ? data.scheduledAt.slice(0, 16) : '');
  }

  async function addLineItem() {
    if (!jobId) return;

    const q = Math.max(1, Number(qty || '1'));
    const u = Math.max(0, Number(unit || '0'));

    await api<LineItem>('/job-line-items', {
      method: 'POST',
      body: JSON.stringify({
        jobId,
        description: desc.trim(),
        qty: q,
        unitPriceCents: u,
      }),
    });

    setDesc('');
    setQty('1');
    setUnit('0');
    await load();
  }

  async function deleteLineItem(id: string) {
    await api<{ ok: true }>(`/job-line-items/${id}`, { method: 'DELETE' });
    await load();
  }

  async function addNote() {
    if (!jobId) return;

    await api<JobNote>('/job-notes', {
      method: 'POST',
      body: JSON.stringify({ jobId, content: note.trim() }),
    });

    setNote('');
    await load();
  }

  async function getUploadUrl() {
    if (!jobId || !job) return;

    setUploadErr('');
    setUploadResp(null);

    try {
      const resp = await api<UploadUrlResponse>('/photos/upload-url', {
        method: 'POST',
        body: JSON.stringify({
          jobId,
          customerId: job.customerId,
          fileName: fileName.trim(),
          contentType: contentType.trim(),
        }),
      });
      setUploadResp(resp);
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : 'Failed to get upload URL');
    }
  }

  async function updateJob() {
    if (!jobId) return;

    setJobErr('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = { status };

    if (scheduledAt.trim().length) {
      // datetime-local -> ISO
      body.scheduledAt = new Date(scheduledAt).toISOString();
    } else {
      body.scheduledAt = null;
    }

    try {
      await api(`/jobs/${jobId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      await load();
    } catch (e) {
      setJobErr(e instanceof Error ? e.message : 'Failed to update job');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  if (!jobId) return null;

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      <div>
        <Link className='text-sm underline opacity-70' href='/customers'>
          ← Back
        </Link>
        <h1 className='text-2xl font-bold mt-2'>Job</h1>
        <div className='text-xs opacity-50'>{jobId}</div>
      </div>

      {job ? (
        <>
          <div className='border rounded p-4 space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='font-semibold'>
                Customer:{' '}
                <Link
                  className='underline'
                  href={`/customers/${job.customerId}`}
                >
                  {job.customer?.name ?? job.customerId}
                </Link>
              </div>
              <div className='text-sm'>{job.status}</div>
            </div>

            <div className='text-sm opacity-80'>
              Vehicle:{' '}
              {job.vehicle
                ? [
                    job.vehicle.year,
                    job.vehicle.make,
                    job.vehicle.model,
                    job.vehicle.trim,
                  ]
                    .filter(Boolean)
                    .join(' ')
                : '(none)'}
            </div>

            <div className='text-sm opacity-80'>
              Totals: Subtotal ${money.subtotal.toFixed(2)} • Tax $
              {money.tax.toFixed(2)} • Total{' '}
              <span className='font-semibold'>${money.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Line Items */}
          <div className='border rounded'>
            <div className='p-4 border-b font-semibold'>Line Items</div>

            <div className='p-4 space-y-2 border-b'>
              <div className='text-sm font-medium'>Add line item</div>
              <input
                className='border rounded px-3 py-2 w-full'
                placeholder='Description'
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
                <input
                  className='border rounded px-3 py-2'
                  placeholder='Qty'
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
                <input
                  className='border rounded px-3 py-2'
                  placeholder='Unit Price (cents)'
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
                <button
                  className='border rounded px-3 py-2'
                  onClick={addLineItem}
                  disabled={!desc.trim()}
                >
                  Add
                </button>
              </div>
              <div className='text-xs opacity-60'>Example: 12500 = $125.00</div>
            </div>

            <div>
              {job.lineItems.length === 0 ? (
                <div className='p-4 opacity-70'>No line items yet.</div>
              ) : (
                job.lineItems.map((li) => (
                  <div
                    key={li.id}
                    className='p-4 border-b last:border-b-0 flex items-start justify-between gap-4'
                  >
                    <div>
                      <div className='font-semibold'>{li.description}</div>
                      <div className='text-sm opacity-70'>
                        {li.qty} × ${(li.unitPriceCents / 100).toFixed(2)} = $
                        {(li.totalCents / 100).toFixed(2)}
                      </div>
                      <div className='text-xs opacity-50'>{li.id}</div>
                    </div>
                    <button
                      className='border rounded px-3 py-2'
                      onClick={() => deleteLineItem(li.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Job Status */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2'>
            <select
              className='border rounded px-3 py-2'
              value={status}
              onChange={(e) => setStatus(e.target.value as Job['status'])}
            >
              <option value='DRAFT'>DRAFT</option>
              <option value='SCHEDULED'>SCHEDULED</option>
              <option value='IN_PROGRESS'>IN_PROGRESS</option>
              <option value='COMPLETED'>COMPLETED</option>
              <option value='CANCELED'>CANCELED</option>
            </select>

            <input
              className='border rounded px-3 py-2'
              type='datetime-local'
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />

            <button className='border rounded px-3 py-2' onClick={updateJob}>
              Update job
            </button>
          </div>

          {jobErr ? (
            <div className='text-sm opacity-80 pt-2'>{jobErr}</div>
          ) : null}

          {/* Notes */}
          <div className='border rounded'>
            <div className='p-4 border-b font-semibold'>Notes</div>

            <div className='p-4 space-y-2 border-b'>
              <div className='text-sm font-medium'>Add note</div>
              <div className='flex gap-2'>
                <input
                  className='border rounded px-3 py-2 flex-1'
                  placeholder='Note'
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button
                  className='border rounded px-3 py-2'
                  onClick={addNote}
                  disabled={!note.trim()}
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              {job.jobNotes.length === 0 ? (
                <div className='p-4 opacity-70'>No notes yet.</div>
              ) : (
                job.jobNotes.map((n) => (
                  <div key={n.id} className='p-4 border-b last:border-b-0'>
                    <div>{n.content}</div>
                    <div className='text-xs opacity-50'>{n.id}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className='border rounded'>
            <div className='p-4 border-b font-semibold'>Photos</div>

            <div className='p-4 space-y-3 border-b'>
              <div className='text-sm font-medium'>Generate upload URL</div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <input
                  className='border rounded px-3 py-2'
                  placeholder='Filename (e.g. before.jpg)'
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
                <input
                  className='border rounded px-3 py-2'
                  placeholder='Content-Type (e.g. image/jpeg)'
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                />
              </div>

              <button
                className='border rounded px-3 py-2'
                onClick={getUploadUrl}
              >
                Get upload URL
              </button>

              {uploadErr ? (
                <div className='text-sm opacity-80'>{uploadErr}</div>
              ) : null}

              {uploadResp ? (
                <div className='text-sm space-y-1'>
                  <div>
                    <span className='font-semibold'>photoId:</span>{' '}
                    {uploadResp.photoId}
                  </div>
                  <div>
                    <span className='font-semibold'>key:</span> {uploadResp.key}
                  </div>
                  <div className='break-words'>
                    <span className='font-semibold'>uploadUrl:</span>{' '}
                    {uploadResp.uploadUrl}
                  </div>
                  <div className='text-xs opacity-60'>
                    (We’re not uploading the file yet — this just proves the
                    backend flow.)
                  </div>
                </div>
              ) : null}
            </div>

            <div className='p-4'>
              {job.photos.length === 0
                ? 'No photo records yet.'
                : `${job.photos.length} photo record(s).`}
            </div>
          </div>
        </>
      ) : (
        <div className='opacity-70'>Loading...</div>
      )}
    </div>
  );
}
