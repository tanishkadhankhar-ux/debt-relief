import type { Metadata } from 'next'
import { Work_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import { GoogleMapsProvider } from '@/components/providers/GoogleMapsProvider'

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '500', '600', '700'],
})

const schnyderS = localFont({
  src: '../fonts/SchnyderS-Bold.otf',
  weight: '700',
  style: 'normal',
  variable: '--font-schnyder',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
})

export const metadata: Metadata = {
  title: 'Debt Relief - Forbes Advisor',
  description: 'See if you qualify for loan-free debt relief. Reduce what you owe by up to 50%.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${workSans.variable} ${schnyderS.variable}`}>
      <body className="font-sans">
        <GoogleMapsProvider>
          {children}
        </GoogleMapsProvider>
      </body>
    </html>
  )
}
