import { getActiveEvent } from '@/lib/get-active-event'
import { requireAdmin } from '@/lib/require-admin'
import { createRule } from './actions'

export default async function AdminRegolamentoPage() {
  const { supabase } = await requireAdmin()
  const event = await getActiveEvent()

  if (!event) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold">Admin regolamento</h1>
        <p className="mt-4">Nessun evento attivo trovato.</p>
      </main>
    )
  }

  const { data: rules } = await supabase
    .from('rules')
    .select('*')
    .eq('event_id', event.id)
    .order('id', { ascending: true })

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Admin regolamento</h1>
      <p className="mt-2 text-sm text-gray-600">{event.name}</p>

      <form action={createRule} className="mt-6 space-y-4 rounded-xl border p-4">
        <input
          name="title"
          type="text"
          placeholder="Titolo regola"
          className="w-full rounded border p-3"
          required
        />

        <textarea
          name="content"
          placeholder="Contenuto regola"
          className="min-h-32 w-full rounded border p-3"
          required
        />

        <button type="submit" className="rounded bg-black px-4 py-3 text-white">
          Pubblica regola
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {rules?.map((rule) => (
          <section key={rule.id} className="rounded-xl border p-4">
            <h2 className="text-lg font-semibold">{rule.title}</h2>
            <p className="mt-2 whitespace-pre-line text-gray-700">
              {rule.content}
            </p>
          </section>
        ))}
      </div>
    </main>
  )
}