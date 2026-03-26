import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/auth/logout-button'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-xl font-bold">
          Fanta Sagra
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/partecipanti" className="rounded-lg border px-3 py-2">
            Partecipanti
          </Link>
          <Link href="/mercato" className="rounded-lg border px-3 py-2">
            Mercato
          </Link>
          <Link href="/mia-squadra" className="rounded-lg border px-3 py-2">
            Mia squadra
          </Link>
          <Link href="/classifica" className="rounded-lg border px-3 py-2">
            Classifica
          </Link>
          <Link href="/regolamento" className="rounded-lg border px-3 py-2">
            Regolamento
          </Link>

          {authData.user ? (
            <>
              <Link href="/dashboard" className="rounded-lg border px-3 py-2">
                Dashboard
              </Link>
              <Link href="/admin" className="rounded-lg border px-3 py-2">
                Admin
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg border px-3 py-2">
                Login
              </Link>
              <Link href="/register" className="rounded-lg border px-3 py-2">
                Registrati
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}