import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', data.user.id)
    .maybeSingle()

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-3">
        Benvenuto{profile?.display_name ? `, ${profile.display_name}` : ''}.
      </p>
      <p className="mt-1 text-sm text-gray-600">{data.user.email}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/mercato" className="rounded-xl border p-4">
          Vai al mercato
        </Link>
        <Link href="/mia-squadra" className="rounded-xl border p-4">
          Vedi la tua squadra
        </Link>
        <Link href="/classifica" className="rounded-xl border p-4">
          Vedi classifica
        </Link>
        <Link href="/regolamento" className="rounded-xl border p-4">
          Leggi regolamento
        </Link>

        {profile?.role === 'admin' && (
          <Link href="/admin" className="rounded-xl border p-4">
            Entra nell’area admin
          </Link>
        )}
      </div>
    </main>
  )
}