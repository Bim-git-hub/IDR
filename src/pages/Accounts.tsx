import { useState } from 'react'
import { Plus, Wallet, Landmark, Smartphone, Banknote } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { formatIDR } from '../lib/format'
import type { AccountType } from '../lib/types'
import { PageHero } from '../components/PageHero'

const typeLabel: Record<AccountType, string> = { cash: 'Tunai', bank: 'Rekening Bank', ewallet: 'E-Wallet', credit: 'Kartu Kredit', investment: 'Investasi', other: 'Lainnya' }
const typeIcon: Record<AccountType, any> = { cash: Banknote, bank: Landmark, ewallet: Smartphone, credit: Wallet, investment: Wallet, other: Wallet }

export function Accounts() {
  const accounts = useAppStore((s) => s.accounts)
  const addAccount = useAppStore((s) => s.addAccount)
  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType>('bank')
  const [balance, setBalance] = useState('')
  const total = accounts.filter((a) => !a.archived).reduce((s, a) => s + a.balance, 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(balance.replace(/[^\d-]/g, ''))
    if (!name.trim()) return
    const colors = ['#4f7a3a', '#2e4a12', '#8dae74', '#c47a1a', '#7a8174']
    addAccount({ name: name.trim(), type, balance: n || 0, color: colors[accounts.length % colors.length], icon: type })
    setName(''); setBalance('')
  }

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Pengaturan"
        title="Akun & Dompet"
        description="Kelola semua sumber dana — rekening, e-wallet, tunai — dalam satu tampilan bersih."
        variant="wallet"
      />

      <div className="card card-hover p-5 flex items-center justify-between anim-fade-up" style={{ animationDelay: '60ms' }}>
        <div>
          <div className="text-sm text-[#7a8174]">Total saldo aktif</div>
          <div className="text-2xl font-bold mt-1 display tabular sensitive">{formatIDR(total)}</div>
        </div>
        <div className="text-sm text-[#8a8a85]">{accounts.filter(a=>!a.archived).length} akun</div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.filter((a) => !a.archived).map((a, i) => {
            const Icon = typeIcon[a.type] || Wallet
            return (
              <div key={a.id} className="card card-hover p-5 flex items-center gap-4 anim-fade-up" style={{ animationDelay: `${100 + i * 40}ms` }}>
                <div className="w-11 h-11 rounded-xl grid place-items-center bg-[#e3eed9] text-[#3e6b22]"><Icon size={20} strokeWidth={1.8} /></div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate text-[#1a1f16]">{a.name}</div>
                  <div className="text-xs text-[#9aa094]">{typeLabel[a.type]}</div>
                </div>
                <div className="font-semibold tabular sensitive text-[#1a1f16]">{formatIDR(a.balance)}</div>
              </div>
            )
          })}
        </div>

        <form onSubmit={submit} className="card card-hover p-6 h-fit anim-fade-up" style={{ animationDelay: '140ms' }}>
          <h2 className="font-semibold display mb-4">Tambah akun</h2>
          <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Nama akun</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="BCA Utama" className="field" /></label>
          <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Jenis</span>
            <select value={type} onChange={(e) => setType(e.target.value as AccountType)} className="field">
              {Object.entries(typeLabel).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="block mb-4"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Saldo awal (Rp)</span><input value={balance} onChange={(e) => setBalance(e.target.value)} inputMode="numeric" placeholder="0" className="field" /></label>
          <button type="submit" className="btn-dark w-full px-4 py-2.5 text-sm font-semibold"><Plus size={16} className="inline mr-1" /> Tambah akun</button>
        </form>
      </div>
    </div>
  )
}
