import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="card-dark">
        <h1 className="text-2xl font-bold">Fanta Sagra</h1>
        <p className="mt-2 text-sm opacity-80">
          Costruisci la squadra. Vinci tutto.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-black">
        <Link href="/mercato" className="card">🛒 Mercato</Link>
        <Link href="/mia-squadra" className="card">👤 Squadra</Link>
        <Link href="/classifica" className="card">🏆 Classifica</Link>
        <Link href="/partecipanti" className="card">🎤 Partecipanti</Link>
        <Link href="/regolamento" className="card">📜 Regole</Link>
        <Link href="/admin" className="card">⚙️ Admin</Link>
      </div>
    </div>
  )
}