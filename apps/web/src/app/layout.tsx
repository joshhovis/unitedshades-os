import './globals.css';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <div className='border-b'>
          <div className='max-w-5xl mx-auto p-4 flex gap-4'>
            <Link className='font-semibold hover:underline' href='/customers'>
              Customers
            </Link>
            <Link className='font-semibold hover:underline' href='/inventory'>
              Inventory
            </Link>
          </div>
        </div>

        <main>{children}</main>
      </body>
    </html>
  );
}
