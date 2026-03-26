import { createClient } from '@/lib/supabase/server'
import { getActiveEvent } from '@/lib/get-active-event'

export default async function PartecipantiPage() {
  const supabase = await createClient()
  const event = await getActiveEvent()

  if (!event) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Partecipanti</h1>
        <p className="mt-4">Nessun evento attivo trovato.</p>
      </main>
    )
  }

  const { data: participants, error } = await supabase
    .from('participants')
    .select('*')
    .eq('event_id', event.id)
    .eq('is_active', true)
    .order('cost_foglia', { ascending: false })
    .order('name', { ascending: true })

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Partecipanti</h1>
        <p className="mt-4">Errore: {error.message}</p>
      </main>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Partecipanti</h1>
      <p className="mt-2 text-sm text-gray-600">{event.name}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {participants?.map((p) => (
          <div key={p.id} className="rounded-2xl border bg-black p-4 shadow-md">
            <div className="flex items-center gap-4">
                {p.image_url ? (
                <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-16 w-16 rounded-xl object-cover"
                />
                ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-200 text-sm">
                    No foto
                </div>
                )}

                <div>
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="text-sm font-medium">💰 {p.cost_foglia} Foglia</p>
                </div>
            </div>
            </div>
        ))}
      </div>
    </main>
  )
}