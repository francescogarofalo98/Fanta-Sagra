import Link from 'next/link'
import { requireAdmin } from '@/lib/require-admin'

export default async function AdminPage() {
  await requireAdmin()

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Area admin</h1>
      <p className="mt-2 text-gray-600">
        Gestisci partecipanti, punteggi e regolamento.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/admin/partecipanti" className="rounded-xl border p-4">
          Gestione partecipanti
        </Link>
        <Link href="/admin/punteggi" className="rounded-xl border p-4">
          Inserimento punteggi
        </Link>
        <Link href="/admin/regolamento" className="rounded-xl border p-4">
          Gestione regolamento
        </Link>
      </div>
    </main>
  )
}