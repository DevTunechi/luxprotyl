import type { Metadata } from 'next'
import { Playfair_Display, Outfit, DM_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { Navbar } from '@/components/layout/navbar'
import { GrainOverlay } from '@/components/ui/grain'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const outfit   = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' })
const dmMono   = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'LuxProptyl — Premium Property Management',
  description: "Nigeria's premium digital property management platform. Fully compliant with Nigerian Housing Laws.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('luxproptyl-theme');
              var cl = document.documentElement.classList;
              if (!t || t === 'dark') { cl.add('dark'); cl.remove('light'); }
              else                    { cl.add('light'); cl.remove('dark'); }
            } catch(e) { document.documentElement.classList.add('dark'); }
          })();
        `}} />
      </head>
      <body
        className={`${playfair.variable} ${outfit.variable} ${dmMono.variable} font-outfit antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="luxproptyl-theme">
          <QueryProvider>
            {/* Grain texture across the entire UI */}
            <GrainOverlay />
            <Navbar />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  border: '1px solid var(--toast-border)',
                  fontFamily: 'var(--font-outfit)',
                  borderRadius: '10px',
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
