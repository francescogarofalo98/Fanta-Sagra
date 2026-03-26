import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/types/db'

export async function getActiveEvent(): Promise<Event | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('market_open', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Errore caricamento evento:', error.message)
    return null
  }

  return data
}