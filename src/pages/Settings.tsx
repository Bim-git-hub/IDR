import { useRef, useState } from 'react'
import { Download, Upload, Shield, Trash2, Plus, Database } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { downloadBackup, importBackup } from '../lib/backup'
import { seedAccounts, seedAssets, seedBills, seedBudgets, seedCategories, seedDebts, seedGoals, seedTransactions } from '../lib/seed'
import { formatIDR } from '../lib/format'
import { PageHero } from '../components/PageHero'

export function Settings() {
  const privacyMode = useAppStore((s) => s.privacyMode)
  const togglePrivacy = useAppStore((s) => s.togglePrivacy)
  const accounts = useAppStore((s) => s.accounts)
  const addAccount = useAppStore((s) => s.addAccount)
  const replaceAll = useAppStore((s) => s.replaceAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')

  const onFile = async (file: File) => {
    const text = await file.text()
    const res = importBackup(text)
    setMessage({ ok: res.ok, text: res.message })
  }

  const resetAll = () => {
    if (!confirm('Hapus semua data dan kembalikan ke data contoh? Tindakan ini tidak bisa dibatalkan.')) return
    replaceAll({ accounts: seedAccounts, categories: seedCategories, transactions: seedTransactions, budgets: seedBudgets, goals: seedGoals, debts: seedDebts, bills: seedBills, assets: seedAssets })
    setMessage({ ok: true, text: 'Data dikembalikan ke contoh awal.' })
  }

  const addAcc = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    addAccount({ name: name.trim(), type: 'bank', balance: Number(balance.replace(/[^\d]/g, '')) || 0, color: '#4f7a3a', icon: 'bank' })
    setName(''); setBalance('')
  }

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Preferensi & data"
        title="Pengaturan"
        description="Kelola akun, backup data lokal, dan atur privasi tampilanmu."
        variant="office"
      />

      {message && (
        <div className={`rounded-xl border px-4 py-3 text-sm anim-fade-up ${message.ok ? 'bg-[#e3eed9] border-[#d5e6c4] text-[#3e6b22]' : 'bg-[#f7deda] border-[#f0cfc9] text-[#b3402f]'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card card-hover p-6 anim-fade-up" style={{ animationDelay: '60ms' }}>
          <h2 className="font-semibold display mb-4 flex items-center gap-2"><Database size={18} className="text-[#4f7a3a]" /> Data & backup</h2>
          <p className="text-sm text-[#7a8174] mb-5">Semua data tersimpan lokal di browser. Cadangkan secara berkala.</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={downloadBackup} className="btn-dark px-4 py-2.5 text-sm font-semibold inline-flex items-center gap-2"><Download size={16} /> Backup sekarang</button>
            <button onClick={() => fileRef.current?.click()} className="btn-white px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2"><Upload size={16} /> Restore</button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }} />
            <button onClick={resetAll} className="btn-white px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2 text-[#b3402f]"><Trash2 size={16} /> Reset data</button>
          </div>
        </div>

        <div className="card card-hover p-6 anim-fade-up" style={{ animationDelay: '100ms' }}>
          <h2 className="font-semibold display mb-4 flex items-center gap-2"><Shield size={18} className="text-[#4f7a3a]" /> Privasi</h2>
          <p className="text-sm text-[#7a8174] mb-4">Mode privasi menyembunyikan semua angka sensitif di layar.</p>
          <button onClick={togglePrivacy} className={`px-4 py-2.5 text-sm font-semibold rounded-xl border transition ${privacyMode ? 'bg-[#2e4a12] text-white border-[#2e4a12]' : 'btn-white'}`}>
            {privacyMode ? 'Mode privasi aktif' : 'Aktifkan mode privasi'}
          </button>
        </div>
      </div>

      <div className="card card-hover p-6 anim-fade-up" style={{ animationDelay: '140ms' }}>
        <h2 className="font-semibold display mb-4">Akun & dompet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {accounts.filter((a) => !a.archived).map((a) => (
            <div key={a.id} className="flex items-center justify-between border border-[#eef0ea] rounded-xl px-4 py-3 bg-[#fbfbfa]">
              <div><div className="font-medium text-[#1a1f16]">{a.name}</div><div className="text-xs text-[#9aa094]">{a.type}</div></div>
              <div className="font-semibold tabular sensitive text-[#1a1f16]">{formatIDR(a.balance)}</div>
            </div>
          ))}
        </div>
        <form onSubmit={addAcc} className="flex flex-col sm:flex-row gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama akun baru" className="field flex-1" />
          <input value={balance} onChange={(e) => setBalance(e.target.value)} inputMode="numeric" placeholder="Saldo awal" className="field sm:w-40" />
          <button type="submit" className="btn-dark px-4 py-2.5 text-sm font-semibold inline-flex items-center gap-2"><Plus size={16} /> Tambah</button>
        </form>
      </div>

      <div className="card card-hover p-6 anim-fade-up" style={{ animationDelay: '180ms' }}>
        <h2 className="font-semibold display mb-3">Tentang</h2>
        <p className="text-sm text-[#7a8174]">FinGlass · web-first MVP. Data tersimpan lokal (localStorage) dan siap dimigrasikan ke SQLite/SQLCipher saat dibungkus Tauri.</p>
      </div>
    </div>
  )
}
