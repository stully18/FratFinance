'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HeroSection from './components/landing/HeroSection'
import DashboardPreview from './components/landing/DashboardPreview'
import FeaturesSection from './components/landing/FeaturesSection'
import StatsSection from './components/landing/StatsSection'
import CTASection from './components/landing/CTASection'
import Footer from './components/landing/Footer'
import { useAuth } from './context/AuthContext'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/tools')
    }
  }, [isLoading, user, router])

  if (!isLoading && user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <DashboardPreview />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
