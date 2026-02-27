export default function DashboardPage() {
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='border rounded p-4 bg-white'>
          <div className='text-sm opacity-70'>New Leads</div>
          <div className='text-3xl font-bold'>0</div>
        </div>
        <div className='border rounded p-4 bg-white'>
          <div className='text-sm opacity-70'>Scheduled Jobs</div>
          <div className='text-3xl font-bold'>0</div>
        </div>
        <div className='border rounded p-4 bg-white'>
          <div className='text-sm opacity-70'>Low Inventory</div>
          <div className='text-3xl font-bold'>0</div>
        </div>
      </div>

      <div className='border rounded p-6 bg-white'>
        <div className='font-semibold mb-2'>Schedule (placeholder)</div>
        <div className='opacity-70'>We’ll add a real calendar view later.</div>
      </div>
    </div>
  );
}
