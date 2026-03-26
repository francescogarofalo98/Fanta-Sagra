'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const BUCKET = 'participants-images'

type Props = {
  eventId: number
}

export default function ParticipantUploadForm({ eventId }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [costFoglia, setCostFoglia] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!name.trim()) {
      setMessage('Nome obbligatorio')
      return
    }

    const cost = Number(costFoglia)
    if (!Number.isFinite(cost) || cost <= 0) {
      setMessage('Costo non valido')
      return
    }

    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError || !authData.user) {
        setMessage('Sessione non valida')
        return
      }

      let imageUrl: string | null = null

      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const filePath = `${authData.user.id}/${crypto.randomUUID()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          })

        if (uploadError) {
          setMessage(`Errore upload immagine: ${uploadError.message}`)
          return
        }

        const { data: publicUrlData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(filePath)

        imageUrl = publicUrlData.publicUrl
      }

      const { error: insertError } = await supabase.from('participants').insert({
        event_id: eventId,
        name: name.trim(),
        cost_foglia: cost,
        image_url: imageUrl,
        is_active: true,
      })

      if (insertError) {
        setMessage(`Errore salvataggio partecipante: ${insertError.message}`)
        return
      }

      setName('')
      setCostFoglia('')
      setFile(null)
      setMessage('Partecipante creato con successo')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border bg-black p-4 shadow-md">
      <input
        type="text"
        placeholder="Nome partecipante"
        className="w-full rounded-xl border p-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Costo in Foglia"
        className="w-full rounded-xl border p-3"
        min={1}
        value={costFoglia}
        onChange={(e) => setCostFoglia(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="w-full rounded-xl border p-3"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-black p-3 font-semibold text-white"
      >
        {loading ? 'Caricamento...' : 'Aggiungi partecipante'}
      </button>

      {message ? <p className="text-sm font-medium">{message}</p> : null}
    </form>
  )
}