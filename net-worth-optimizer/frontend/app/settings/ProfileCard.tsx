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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 mb-6">Profile</h2>

      {message && (
        <div className={`mb-4 p-4 rounded-lg border-l-4 ${
          message.type === 'success'
            ? 'bg-zinc-900 border-green-500 text-green-400'
            : 'bg-zinc-900 border-red-500 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-800 rounded-lg text-zinc-500 cursor-not-allowed"
          />
          <p className="text-xs text-zinc-600 mt-1">Email cannot be changed</p>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdateProfile}
          disabled={isLoading}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed mt-6 active:scale-[0.98]"
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  )
}
