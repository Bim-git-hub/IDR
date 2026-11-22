import { useState } from 'react'
import { Plus, Trash2, Check, CalendarClock } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { formatIDR, formatShortIDR } from '../lib/format'
import { PageHero } from '../components/PageHero'

export function Bills() {
  const bills = useAppStore((s) => s.bills)
  const addBill = useAppStore((s) => s.addBill)
  const deleteBill = useAppStore((s) => s.deleteBill)
  const toggleBillPaid = useAppStore((s) => s.toggleBillPaid)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [cycle, setCycle] = useState<'monthly' | 'yearly' | 'once'>('monthly')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('Tagihan')

  const unpaid = bills.filter((b) => !b.paid)
  const totalUnpaid = unpaid.reduce((s, b) => s + b.amount, 0)
  const monthlyTotal = bills.filter((b) => b.cycle === 'monthly').reduce((s, b) => s + b.amount, 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(amount.replace(/[^\d]/g, ''))
    if (!name.trim() || !n) return
    addBill({ name: name.trim(), amount: n, cycle, dueDate: dueDate || new Date().toISOString().slice(0, 10), category, paid: false })
    setName(''); setAmount(''); setDueDate('')
  }

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Kewajiban berulang"
        title="Tagihan & Langganan"
        description="Jangan pernah lewat jatuh tempo. Kelola tagihan rutin dan langgananmu di sini."
        variant="calendar"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '60ms' }}><div className="text-sm text-[#7a8174]">Belum dibayar</div><div className="text-2xl font-bold mt-2 display tabular sensitive text-[#b3402f]">{formatIDR(totalUnpaid)}</div></div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '100ms' }}><div className="text-sm text-[#7a8174]">Total langganan bulanan</div><div className="text-2xl font-bold mt-2 display tabular sensitive">{formatIDR(monthlyTotal)}</div></div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '140ms' }}><div className="text-sm text-[#7a8174]">Jumlah tagihan</div><div className="text-2xl font-bold mt-2 display tabular">{bills.length}</div></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4">
        <div className="card card-hover p-6 space-y-3 anim-fade-up" style={{ animationDelay: '180ms' }}>
          {bills.map((b) => (
            <div key={b.id} className="flex items-center gap-4 border-b border-[#eef0ea] pb-3 last:border-0 last:pb-0 row-hover -mx-2 px-2 rounded-xl">
              <button onClick={() => toggleBillPaid(b.id)} className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 border transition ${b.paid ? 'bg-[#2e4a12] border-[#2e4a12] text-white' : 'border-[#d3d6cc] text-transparent hover:border-[#4f7a3a]'}`} title={b.paid ? 'Tandai belum bayar' : 'Tandai lunas'}>
                <Check size={16} />
              </button>
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${b.paid ? 'text-[#9aa094] line-through' : 'text-[#1a1f16]'}`}>{b.name}</div>
                <div className="text-xs text-[#9aa094] flex items-center gap-1.5"><CalendarClock size={12} /> {b.dueDate} · {b.cycle === 'monthly' ? 'Bulanan' : b.cycle === 'yearly' ? 'Tahunan' : 'Sekali'} · {b.category}</div>
              </div>
              <div className="font-semibold tabular sensitive text-[#1a1f16]">{formatShortIDR(b.amount)}</div>
              <button onClick={() => deleteBill(b.id)} className="w-8 h-8 rounded-lg grid place-items-center text-[#c9cdc2] hover:text-[#b3402f] hover:bg-[#f7deda]" title="Hapus">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {bills.length === 0 && <div className="py-8 text-center text-[#8a8a85] text-sm">Belum ada tagihan.</div>}
        </div>

        <form onSubmit={submit} className="card card-hover p-6 h-fit anim-fade-up" style={{ animationDelay: '220ms' }}>
          <h2 className="font-semibold display mb-4">Tambah tagihan</h2>
          <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Nama</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Internet" className="field" /></label>
          <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Nominal (Rp)</span><input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" placeholder="350000" className="field" /></label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Siklus</span>
              <select value={cycle} onChange={(e) => setCycle(e.target.value as any)} className="field">
                <option value="monthly">Bulanan</option><option value="yearly">Tahunan</option><option value="once">Sekali</option>
              </select>
            </label>
            <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Kategori</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="field">
                <option>Tagihan</option><option>Langganan</option><option>Lainnya</option>
              </select>
            </label>
          </div>
          <label className="block mb-4"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Jatuh tempo</span><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="field" /></label>
          <button type="submit" className="btn-dark w-full px-4 py-2.5 text-sm font-semibold"><Plus size={16} className="inline mr-1" /> Simpan</button>
        </form>
      </div>
    </div>
  )
}
