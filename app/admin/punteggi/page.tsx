import { getActiveEvent } from '@/lib/get-active-event'
import { createScoreEvent } from './actions'
import { requireAdmin } from '@/lib/require-admin'

export default async function AdminPunteggiPage() {
  const { supabase } = await requireAdmin()
  const event = await getActiveEvent()

  if (!event) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Admin punteggi</h1>
        <p className="mt-4">Nessun evento attivo trovato.</p>
      </main>
    )
  }

  const { data: participants } = await supabase
    .from('participants')
    .select('id, name, cost_foglia')
    .eq('event_id', event.id)
    .eq('is_active', true)
    .order('name', { ascending: true })

  const { data: latestScores } = await supabase
    .from('score_events')
    .select(`
      id,
      score_date,
      description,
      points,
      participants (
        name
      )
    `)
    .eq('event_id', event.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const today = new Date().toISOString().split('T')[0]

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Admin punteggi</h1>
      <p className="mt-2 text-sm text-gray-600">{event.name}</p>

      <form action={createScoreEvent} className="mt-6 space-y-4 rounded-xl border p-4">
        <select
          name="participant_id"
          className="w-full rounded border p-3"
          required
          defaultValue=""
        >
          <option value="" disabled>
            Seleziona partecipante
          </option>
          {participants?.map((participant) => (
            <option key={participant.id} value={participant.id}>
              {participant.name} — {participant.cost_foglia} Foglia
            </option>
          ))}
        </select>

        <input
          name="score_date"
          type="date"
          defaultValue={today}
          className="w-full rounded border p-3"
          required
        />

        <input
          name="description"
          type="text"
          placeholder="Descrizione bonus/malus"
          className="w-full rounded border p-3"
          required
        />

        <input
          name="points"
          type="number"
          placeholder="Punti (+ o -)"
          className="w-full rounded border p-3"
          required
        />

        <button type="submit" className="rounded bg-black px-4 py-3 text-white">
          Salva punteggio
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Ultimi movimenti</h2>

        <div className="mt-4 space-y-3">
          {latestScores?.map((score) => {
            const participant = Array.isArray(score.participants)
              ? score.participants[0]
              : score.participants

            return (
              <div key={score.id} className="rounded-xl border p-4">
                <div className="font-semibold">
                  {participant?.name || 'Partecipante'}
                </div>
                <div className="text-sm text-gray-600">
                  {score.score_date} · {score.description}
                </div>
                <div className="mt-1 text-sm">
                  {score.points > 0 ? '+' : ''}
                  {score.points} punti
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}