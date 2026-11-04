import './globals.css';
import './home-header.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  metadataBase: new URL('https://amber-recording.de'),
  title: 'AMBER Recording Studio | Berlin',
  description: 'Mixing, mastering, production, songwriting, film scoring and vocal recording in Berlin.',
  openGraph: {
    type: 'website',
    siteName: 'AMBER Recording Studio Berlin',
    url: 'https://amber-recording.de',
    title: 'AMBER Recording Studio | Berlin',
    description: 'Recording, mixing, mastering and music production in Berlin.',
  },
};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html suppressHydrationWarning><body>{children}</body></html>}
