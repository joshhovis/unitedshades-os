import './globals.css';
import Nav from '@/components/Nav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <Nav />
        <main className='max-w-5xl mx-auto'>{children}</main>
      </body>
    </html>
  );
}
