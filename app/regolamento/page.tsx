import { createClient } from '@/lib/supabase/server'
import { getActiveEvent } from '@/lib/get-active-event'

export default async function RegolamentoPage() {
  const supabase = await createClient()
  const event = await getActiveEvent()

  if (!event) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold">Regolamento</h1>
        <p className="mt-4">Nessun evento attivo trovato.</p>
      </main>
    )
  }

  const { data: rules, error } = await supabase
    .from('rules')
    .select('*')
    .eq('event_id', event.id)
    .order('id', { ascending: true })

  if (error) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold">Regolamento</h1>
        <p className="mt-4">Errore: {error.message}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Regolamento</h1>
      <p className="mt-2 text-sm text-gray-600">{event.name}</p>

      <div className="mt-6 space-y-4">
        {rules?.length ? (
          rules.map((rule) => (
            <section key={rule.id} className="rounded-xl border p-4">
              <h2 className="text-lg font-semibold">{rule.title}</h2>
              <p className="mt-2 whitespace-pre-line text-gray-700">
                {rule.content}
              </p>
            </section>
          ))
        ) : (
          <p>Nessun regolamento pubblicato.</p>
        )}
      </div>
    </main>
  )
}