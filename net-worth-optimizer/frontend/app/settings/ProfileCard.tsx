'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { supabase } from '@/lib/supabase'

export default function ProfileCard() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (user) {
      // Load user profile
      supabase
        .from('users_public')
        .select('full_name')
        .eq('id', user.id)
        .single()
        .then(({ data }: { data: { full_name: string | null } | null }) => {
          if (data?.full_name) {
            setFullName(data.full_name)
          }
        })
    }
  }, [user])

  const handleUpdateProfile = async () => {
    if (!user || !fullName.trim()) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('users_public')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update profile' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-white mb-6">Profile</h2>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
          />
          <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdateProfile}
          disabled={isLoading}
          className="w-full py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  )
}
