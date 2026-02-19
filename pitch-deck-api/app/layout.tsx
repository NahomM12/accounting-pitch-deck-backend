import type { Metadata, Viewport } from 'next'
import { DM_Sans, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Ascend Finance & Advisory - Pitch Deck Platform',
  description: 'Browse, discover, and download pitch decks from innovative founders. Ascend Finance & Advisory connects investors with the best startups.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#21445d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${montserrat.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster richColors />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
