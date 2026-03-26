'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveEvent } from '@/lib/get-active-event'

export async function createScoreEvent(formData: FormData) {
  const supabase = await createClient()
  const event = await getActiveEvent()

  if (!event) {
    throw new Error('Nessun evento attivo trovato')
  }

  const { data: authData } = await supabase.auth.getUser()

  if (!authData.user) {
    throw new Error('Utente non autenticato')
  }

  const participantId = Number(formData.get('participant_id'))
  const scoreDate = String(formData.get('score_date') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const points = Number(formData.get('points'))

  if (!participantId || !scoreDate || !description || !Number.isFinite(points)) {
    throw new Error('Dati non validi')
  }

  const { error: insertError } = await supabase.from('score_events').insert({
    event_id: event.id,
    participant_id: participantId,
    score_date: scoreDate,
    description,
    points,
    created_by: authData.user.id,
  })

  if (insertError) {
    throw new Error(insertError.message)
  }

  const { error: recalcError } = await supabase.rpc('recalculate_event_teams', {
    p_event_id: event.id,
  })

  if (recalcError) {
    throw new Error(recalcError.message)
  }

  revalidatePath('/admin/punteggi')
  revalidatePath('/classifica')
  revalidatePath('/mia-squadra')
}