'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ProfileCard from './ProfileCard'
import ChangePasswordForm from './ChangePasswordForm'

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

        <div className="space-y-6">
          <ProfileCard />
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  )
}
