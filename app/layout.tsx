import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Elsewhere — One life. Endless possibilities.',description:'Explore the lives waiting in your choices. A playable constellation of chance, connection, and possibility.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className="dark"><body>{children}</body></html>}
