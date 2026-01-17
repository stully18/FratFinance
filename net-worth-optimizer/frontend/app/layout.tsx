import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Net Worth Optimizer',
  description: 'Optimize your financial decisions: debt repayment vs investing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-app-bg min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
