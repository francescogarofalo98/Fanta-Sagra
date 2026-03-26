import { createClient } from '@/lib/supabase/server'
import { getActiveEvent } from '@/lib/get-active-event'

export default async function ClassificaPage() {
  const supabase = await createClient()
  const event = await getActiveEvent()

  if (!event) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Classifica</h1>
        <p className="mt-4">Nessun evento attivo trovato.</p>
      </main>
    )
  }

  const { data: teams, error } = await supabase
    .from('teams')
    .select(`
      id,
      team_name,
      total_points,
      spent_foglia,
      remaining_foglia
    `)
    .eq('event_id', event.id)
    .order('total_points', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Classifica</h1>
        <p className="mt-4">Errore: {error.message}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Classifica generale</h1>
      <p className="mt-2 text-sm text-gray-600">{event.name}</p>

      <div className="space-y-3">
    {teams?.map((team, index) => (
        <div
        key={team.id}
        className={`rounded-2xl p-4 shadow-md ${
            index === 0
            ? 'bg-yellow-400 text-black'
            : index === 1
            ? 'bg-gray-300 text-black'
            : index === 2
            ? 'bg-orange-300 text-black'
            : 'bg-white'
        }`}
        >
        <div className="flex justify-between items-center">
            <div>
            <div className="font-bold">
                #{index + 1} {team.team_name}
            </div>
            </div>

            <div className="text-xl font-bold">
            {team.total_points}
            </div>
        </div>
        </div>
    ))}
    </div>
    </main>
  )
}