'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getActiveEvent } from '@/lib/get-active-event'

export async function saveTeam(formData: FormData) {
  const supabase = await createClient()
  const event = await getActiveEvent()

  if (!event) {
    throw new Error('Nessun evento attivo trovato')
  }

  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError || !authData.user) {
    throw new Error('Utente non autenticato')
  }

  const userId = authData.user.id
  const teamName = String(formData.get('team_name') || '').trim()
  const selectedIds = formData.getAll('participant_ids').map((v) => Number(v))

  if (!teamName) {
    throw new Error('Nome squadra obbligatorio')
  }

  if (selectedIds.length !== event.max_team_size) {
    throw new Error(`Devi selezionare esattamente ${event.max_team_size} partecipanti`)
  }

  const { data: participants, error: participantsError } = await supabase
    .from('participants')
    .select('id, cost_foglia')
    .eq('event_id', event.id)
    .in('id', selectedIds)

  if (participantsError || !participants) {
    throw new Error('Errore caricamento partecipanti')
  }

  if (participants.length !== selectedIds.length) {
    throw new Error('Uno o più partecipanti non sono validi')
  }

  const spentFoglia = participants.reduce((sum, p) => sum + p.cost_foglia, 0)

  if (spentFoglia > event.budget_foglia) {
    throw new Error('Hai superato il budget disponibile')
  }

  const remainingFoglia = event.budget_foglia - spentFoglia

  const { data: existingTeam } = await supabase
    .from('teams')
    .select('id')
    .eq('event_id', event.id)
    .eq('user_id', userId)
    .maybeSingle()

  let teamId: number

  if (existingTeam) {
    const { error: updateError } = await supabase
      .from('teams')
      .update({
        team_name: teamName,
        spent_foglia: spentFoglia,
        remaining_foglia: remainingFoglia,
      })
      .eq('id', existingTeam.id)

    if (updateError) {
      throw new Error(updateError.message)
    }

    const { error: deleteMembersError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', existingTeam.id)

    if (deleteMembersError) {
      throw new Error(deleteMembersError.message)
    }

    teamId = existingTeam.id
  } else {
    const { data: teamInsert, error: teamInsertError } = await supabase
      .from('teams')
      .insert({
        event_id: event.id,
        user_id: userId,
        team_name: teamName,
        spent_foglia: spentFoglia,
        remaining_foglia: remainingFoglia,
      })
      .select('id')
      .single()

    if (teamInsertError || !teamInsert) {
      throw new Error(teamInsertError?.message || 'Errore creazione squadra')
    }

    teamId = teamInsert.id
  }

  const payload = selectedIds.map((participantId) => ({
    team_id: teamId,
    participant_id: participantId,
  }))

  const { error: membersInsertError } = await supabase
    .from('team_members')
    .insert(payload)

  if (membersInsertError) {
    throw new Error(membersInsertError.message)
  }

  revalidatePath('/mercato')
  revalidatePath('/mia-squadra')
  revalidatePath('/classifica')
}