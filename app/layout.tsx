import './globals.css';
import './home-header.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {title:'AMBER Recording Studio | Berlin', description:'Mixing, mastering, production, songwriting, film scoring and vocal recording in Berlin.'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html><body>{children}</body></html>}
