import { Metadata } from 'next';
import ParallaxBackground from './components/Background';
import './globals.css';
import { Inter, Instrument_Serif } from 'next/font/google';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const serif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Knot Fast',
  description: 'A small, cozy archive of my crochet works.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ParallaxBackground />
        {children}
      </body>
    </html>
  );
}
