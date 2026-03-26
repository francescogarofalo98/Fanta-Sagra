import { getActiveEvent } from '@/lib/get-active-event'
import { requireAdmin } from '@/lib/require-admin'
import ParticipantUploadForm from '@/components/admin/participant-upload-form'

export default async function AdminPartecipantiPage() {
  const { supabase } = await requireAdmin()
  const event = await getActiveEvent()

  if (!event) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Admin partecipanti</h1>
        <p className="mt-4">Nessun evento attivo trovato.</p>
      </main>
    )
  }

  const { data: participants } = await supabase
    .from('participants')
    .select('*')
    .eq('event_id', event.id)
    .order('created_at', { ascending: false })

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Admin partecipanti</h1>
      <p className="mt-2 text-sm opacity-70">{event.name}</p>

      <ParticipantUploadForm eventId={event.id} />

      <div className="mt-8 space-y-3">
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
                <div className="font-bold">{p.name}</div>
                <div className="text-sm font-medium">💰 {p.cost_foglia} Foglia</div>
                <div className="text-xs opacity-70">
                  {p.is_active ? 'Attivo' : 'Non attivo'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}