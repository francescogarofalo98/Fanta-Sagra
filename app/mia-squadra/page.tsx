import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActiveEvent } from '@/lib/get-active-event'

export default async function MiaSquadraPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  if (!authData.user) {
    redirect('/login')
  }

  const event = await getActiveEvent()

  if (!event) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Mia squadra</h1>
        <p className="mt-4">Nessun evento attivo trovato.</p>
      </main>
    )
  }

  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('event_id', event.id)
    .eq('user_id', authData.user.id)
    .maybeSingle()

  if (!team) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Mia squadra</h1>
        <p className="mt-4">Non hai ancora creato una squadra.</p>
      </main>
    )
  }

    const { data: members } = await supabase
  .from('team_members')
  .select(`
    id,
    participant_id,
    participants (
      id,
      name,
      cost_foglia,
      image_url
    )
  `)
  .eq('team_id', team.id)

  const participantIds =
    members?.map((member) => member.participant_id).filter(Boolean) ?? []

  const { data: scoreEvents } = participantIds.length
    ? await supabase
        .from('score_events')
        .select(`
          id,
          score_date,
          description,
          points,
          participant_id,
          participants (
            name
          )
        `)
        .eq('event_id', event.id)
        .in('participant_id', participantIds)
        .order('score_date', { ascending: false })
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">{team.team_name}</h1>
      <p className="mt-2 text-sm text-gray-600">
        Spesi: {team.spent_foglia} Foglia · Residui: {team.remaining_foglia} · Punti: {team.total_points}
      </p>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Componenti squadra</h2>
        <div className="space-y-3">
        {members?.map((m) => {
            const participant = Array.isArray(m.participants)
            ? m.participants[0]
            : m.participants

            return (
            <div key={m.id} className="rounded-2xl border bg-black p-4 shadow-md">
                <div className="flex items-center gap-4">
                {'image_url' in (participant || {}) && participant?.image_url ? (
                    <img
                    src={participant.image_url}
                    alt={participant.name}
                    className="h-14 w-14 rounded-xl object-cover"
                    />
                ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-200 text-xs">
                    No foto
                    </div>
                )}

                <div>
                    <div className="font-bold">{participant?.name}</div>
                    <div className="text-sm font-medium">💰 {participant?.cost_foglia} Foglia</div>
                </div>
                </div>
            </div>
            )
        })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Storico bonus / malus</h2>
        <div className="mt-4 space-y-3">
          {scoreEvents?.length ? (
            scoreEvents.map((score) => {
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
            })
          ) : (
            <p className="text-sm text-gray-600">Nessun punteggio registrato.</p>
          )}
        </div>
      </div>
    </main>
  )
}