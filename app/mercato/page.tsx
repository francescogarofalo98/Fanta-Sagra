import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActiveEvent } from '@/lib/get-active-event'
import { saveTeam } from './actions'

export default async function MercatoPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  if (!authData.user) {
    redirect('/login')
  }

  const event = await getActiveEvent()

  if (!event) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Mercato</h1>
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
        <h1 className="text-2xl font-bold">Mercato</h1>
        <p className="mt-4">Errore: {error.message}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Mercato</h1>
      <p className="mt-2 text-sm text-gray-600">
        Budget: {event.budget_foglia} Foglia · Squadra da {event.max_team_size} partecipanti
      </p>

      <form action={saveTeam} className="mt-6 space-y-4">
        <input
            name="team_name"
            placeholder="Nome squadra"
            className="input text-black"
        />
        



        <div className="space-y-3">
        {participants?.map((p) => (
            <label
            key={p.id}
            className="flex items-center justify-between rounded-2xl border bg-black p-4 shadow-md"
            >
            <div className="flex items-center gap-4">
                {p.image_url ? (
                <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-14 w-14 rounded-xl object-cover"
                />
                ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-200 text-xs">
                    No foto
                </div>
                )}

                <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm font-medium">💰 {p.cost_foglia} Foglia</div>
                </div>
            </div>

            <input
                type="checkbox"
                name="participant_ids"
                value={p.id}
                className="h-5 w-5"
            />
            </label>
        ))}
        </div>

        <button className="button">Salva squadra</button>
      </form>
    </main>
  )
}