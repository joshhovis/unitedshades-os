import TopBar from '@/components/TopBar';
import SideNav from '@/components/SideNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen'>
      <TopBar />
      <div className='flex'>
        <SideNav />
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  );
}
