'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Errore logout:', error.message)
        return
      }

      router.push('/login')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border px-3 py-2 text-sm"
    >
      {loading ? 'Uscita...' : 'Logout'}
    </button>
  )
}