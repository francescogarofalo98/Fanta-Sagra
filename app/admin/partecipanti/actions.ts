'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveEvent } from '@/lib/get-active-event'

export async function createParticipant(formData: FormData) {
  const supabase = await createClient()
  const event = await getActiveEvent()

  if (!event) {
    throw new Error('Nessun evento attivo trovato')
  }

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    throw new Error('Utente non autenticato')
  }

  const name = String(formData.get('name') || '').trim()
  const costFoglia = Number(formData.get('cost_foglia') || 0)
  const imageUrl = String(formData.get('image_url') || '').trim() || null

  if (!name) {
    throw new Error('Nome obbligatorio')
  }

  if (!Number.isFinite(costFoglia) || costFoglia <= 0) {
    throw new Error('Costo non valido')
  }

  const { error } = await supabase.from('participants').insert({
    event_id: event.id,
    name,
    cost_foglia: costFoglia,
    image_url: imageUrl,
    is_active: true,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/partecipanti')
  revalidatePath('/partecipanti')
  revalidatePath('/mercato')
}