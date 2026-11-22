import { useMemo, useState } from 'react'
import { Plus, Search, Trash2, Pencil, X, ArrowUpRight, ArrowDownRight, ArrowLeftRight } from 'lucide-react'
import { useAppStore, useAccountsById, useCategoriesById } from '../lib/store'
import { useUIStore } from '../lib/ui-store'
import { formatIDR } from '../lib/format'
import type { Transaction } from '../lib/types'
import { PageHero } from '../components/PageHero'

function EditModal({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  const updateTransaction = useAppStore((s) => s.updateTransaction)
  const accounts = useAppStore((s) => s.accounts)
  const categories = useAppStore((s) => s.categories)
  const [amount, setAmount] = useState(String(tx.amount))
  const [note, setNote] = useState(tx.note)
  const [date, setDate] = useState(tx.date)
  const [accountId, setAccountId] = useState(tx.accountId)
  const [categoryId, setCategoryId] = useState(tx.categoryId ?? '')
  const cats = categories.filter((c) => c.type === (tx.type === 'income' ? 'income' : 'expense'))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(amount.replace(/[^\d]/g, ''))
    if (!n) return
    updateTransaction(tx.id, { amount: n, note, date, accountId, categoryId: tx.type === 'transfer' ? undefined : categoryId || undefined })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-[#1a1f16]/25 backdrop-blur-[2px] anim-fade-in" onClick={onClose} />
      <form onSubmit={submit} className="card-white relative w-full max-w-md p-6 anim-pop">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold display text-[#1a1f16]">Edit transaksi</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg border border-[#e4e6e0] grid place-items-center text-[#7a8174] hover:bg-[#f4f5f1]"><X size={16} /></button>
        </div>
        <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Nominal (Rp)</span><input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" className="field tabular" /></label>
        <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Catatan</span><input value={note} onChange={(e) => setNote(e.target.value)} className="field" /></label>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Tanggal</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field" /></label>
          <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Akun</span>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="field">
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>
        </div>
        {tx.type !== 'transfer' && (
          <label className="block mb-5"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Kategori</span>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="field">
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        )}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-white px-4 py-2.5 text-sm font-medium">Batal</button>
          <button type="submit" className="btn-dark px-5 py-2.5 text-sm font-semibold">Simpan perubahan</button>
        </div>
      </form>
    </div>
  )
}

export function Transactions() {
  const transactions = useAppStore((s) => s.transactions)
  const deleteTransaction = useAppStore((s) => s.deleteTransaction)
  const cats = useCategoriesById()
  const accs = useAccountsById()
  const setQuickAddOpen = useUIStore((s) => s.setQuickAddOpen)
  const [q, setQ] = useState('')
  const [type, setType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all')
  const [editing, setEditing] = useState<Transaction | null>(null)

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (type !== 'all' && t.type !== type) return false
      if (!q) return true
      const cat = t.categoryId ? cats[t.categoryId]?.name ?? '' : 'transfer'
      const acc = accs[t.accountId]?.name ?? ''
      const hay = `${cat} ${acc} ${t.note} ${t.tags.join(' ')}`.toLowerCase()
      return hay.includes(q.toLowerCase())
    })
  }, [transactions, type, q, cats, accs])

  const income = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Pencatatan"
        title="Transaksi"
        description="Semua arus masuk, keluar, dan transfer — tersusun rapi dalam satu tempat."
        variant="finance"
      >
        <button onClick={() => setQuickAddOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur border border-white/25 text-white rounded-xl text-sm font-semibold hover:bg-white/25 transition">
          <Plus size={16} /> Tambah transaksi
        </button>
      </PageHero>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '60ms' }}><div className="text-sm text-[#7a8174]">Pemasukan</div><div className="text-2xl font-bold mt-1 text-[#3e6b22] sensitive tabular display">{formatIDR(income)}</div></div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '100ms' }}><div className="text-sm text-[#7a8174]">Pengeluaran</div><div className="text-2xl font-bold mt-1 text-[#b3402f] sensitive tabular display">{formatIDR(expense)}</div></div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '140ms' }}><div className="text-sm text-[#7a8174]">Jumlah transaksi</div><div className="text-2xl font-bold mt-1 tabular display">{filtered.length}</div></div>
      </div>

      <div className="card p-5 anim-fade-up" style={{ animationDelay: '180ms' }}>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-[#fbfbfa] border border-[#e4e6e0] rounded-xl px-3 py-2.5">
            <Search size={16} className="text-[#9aa094]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari catatan, kategori, akun..." className="bg-transparent outline-none text-sm w-full placeholder:text-[#9aa094]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all','income','expense','transfer'] as const).map((t) => (
              <button key={t} onClick={() => setType(t)} className={`px-3 py-2 rounded-xl text-sm font-medium border transition ${type===t ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white border-[#e4e6e0] text-[#4a5244] hover:bg-[#f4f5f1]'}`}>
                {t==='all'?'Semua':t==='income'?'Masuk':t==='expense'?'Keluar':'Transfer'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#9aa094] text-xs border-b border-[#eef0ea]">
                <th className="text-left font-medium py-3 pr-3">Tanggal</th>
                <th className="text-left font-medium py-3 pr-3">Keterangan</th>
                <th className="text-left font-medium py-3 pr-3">Akun</th>
                <th className="text-right font-medium py-3 pr-3">Nominal</th>
                <th className="py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const cat = t.categoryId ? cats[t.categoryId] : undefined
                const acc = accs[t.accountId]
                const to = t.toAccountId ? accs[t.toAccountId] : undefined
                const Icon = t.type === 'income' ? ArrowUpRight : t.type === 'expense' ? ArrowDownRight : ArrowLeftRight
                const color = t.type === 'income' ? 'text-[#3e6b22]' : t.type === 'expense' ? 'text-[#b3402f]' : 'text-[#4a5244]'
                return (
                  <tr key={t.id} className="row-hover border-b border-[#eef0ea]">
                    <td className="py-3.5 pr-3 text-[#7a8174] whitespace-nowrap">{t.date}</td>
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl grid place-items-center bg-[#f4f5f1] ${color}`}><Icon size={16} /></div>
                        <div>
                          <div className="font-medium text-[#1a1f16]">{t.note || cat?.name || (t.type === 'transfer' ? 'Transfer' : 'Transaksi')}</div>
                          <div className="text-xs text-[#9aa094]">{cat?.name ?? 'Transfer'}{t.type === 'transfer' && to ? ` → ${to.name}` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3 text-[#7a8174]">{acc?.name ?? '-'}</td>
                    <td className={`py-3.5 pr-3 text-right font-semibold tabular sensitive ${color}`}>{t.type === 'expense' ? '-' : '+'}{formatIDR(t.amount)}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditing(t)} className="w-8 h-8 rounded-lg grid place-items-center text-[#c9cdc2] hover:text-[#1a1f16] hover:bg-[#f4f5f1]" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteTransaction(t.id)} className="w-8 h-8 rounded-lg grid place-items-center text-[#c9cdc2] hover:text-[#b3402f] hover:bg-[#f7deda]" title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-12 text-center text-[#9aa094] text-sm">Belum ada transaksi yang cocok.</div>}
        </div>
      </div>

      {editing && <EditModal tx={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
