import Nav from '@/components/Nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className='max-w-5xl mx-auto'>{children}</main>
    </>
  );
}
