import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FinancialProvider } from './context/FinancialContext'
import { AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'College Wealth Builder',
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
        <AuthProvider>
          <FinancialProvider>
            <Navigation />
            {children}
          </FinancialProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
