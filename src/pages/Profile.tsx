import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'

type SupabaseUser = Pick<User, 'email' | 'id' | 'created_at' | 'user_metadata'> & {
  user_metadata?: { full_name?: string }
}

export default function Profile() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-white">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-black p-6">
      
      {/* Profile Card */}
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl p-8">
        
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-white text-2xl font-bold">
            {user?.user_metadata?.full_name || 'VeeTube User'}
          </h1>
          <p className="text-gray-400 mt-1">{user?.email}</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-white font-bold truncate">{user?.email}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Account ID</p>
            <p className="text-white font-bold truncate">{user?.id?.slice(0, 8)}...</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Joined</p>
            <p className="text-white font-bold">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('hi-IN') : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Status</p>
            <p className="text-green-400 font-bold">✅ Active</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-white text-2xl font-bold">0</p>
            <p className="text-gray-400 text-sm">Videos</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-white text-2xl font-bold">0</p>
            <p className="text-gray-400 text-sm">Subscribers</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-white text-2xl font-bold">₹0</p>
            <p className="text-gray-400 text-sm">Earnings</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition"
        >
          🚪 Sign Out
        </button>

      </div>
    </div>
  )
}