import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/navbar'

export const metadata: Metadata = {
  title: 'Fanta Sagra',
  description: 'Gioca al Fanta Sagra',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />

        <main className="mx-auto w-full max-w-md p-4 pb-24">
          {children}
        </main>
      </body>
    </html>
  )
}