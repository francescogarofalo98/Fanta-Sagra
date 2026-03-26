'use server'

import { revalidatePath } from 'next/cache'
import { getActiveEvent } from '@/lib/get-active-event'
import { createClient } from '@/lib/supabase/server'

export async function createRule(formData: FormData) {
  const supabase = await createClient()
  const event = await getActiveEvent()

  if (!event) {
    throw new Error('Nessun evento attivo trovato')
  }

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    throw new Error('Utente non autenticato')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .maybeSingle()

  if (!profile || profile.role !== 'admin') {
    throw new Error('Utente non autorizzato')
  }

  const title = String(formData.get('title') || '').trim()
  const content = String(formData.get('content') || '').trim()

  if (!title || !content) {
    throw new Error('Titolo e contenuto sono obbligatori')
  }

  const { error } = await supabase.from('rules').insert({
    event_id: event.id,
    title,
    content,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/regolamento')
  revalidatePath('/admin/regolamento')
}