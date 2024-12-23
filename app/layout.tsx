import './globals.css';
import { Inter, Montserrat } from 'next/font/google';
import { ReactNode } from 'react';
import { Navbar } from './components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-heading' });

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh" className={`${inter.variable} ${montserrat.variable}`}>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
