import { useMemo, useState } from 'react'
import { useAppStore, useCategoriesById } from '../lib/store'
import { formatIDR, formatShortIDR, monthKey } from '../lib/format'
import { PageHero } from '../components/PageHero'

export function Budgets() {
  const budgets = useAppStore((s) => s.budgets)
  const allCategories = useAppStore((s) => s.categories)
  const categories = useMemo(() => allCategories.filter((c) => c.type === 'expense'), [allCategories])
  const transactions = useAppStore((s) => s.transactions)
  const addBudget = useAppStore((s) => s.addBudget)
  const catsById = useCategoriesById()
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [limit, setLimit] = useState('')
  const currentMonth = monthKey(new Date())

  const rows = useMemo(() => budgets.map((b) => {
    const spent = transactions.filter((t) => t.type === 'expense' && t.categoryId === b.categoryId && monthKey(t.date) === currentMonth).reduce((s, t) => s + t.amount, 0)
    const cat = catsById[b.categoryId]
    const pct = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0
    return { ...b, spent, pct, name: cat?.name ?? 'Kategori' }
  }), [budgets, transactions, currentMonth, catsById])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(limit.replace(/[^\d]/g, ''))
    if (!categoryId || !n) return
    addBudget({ categoryId, limit: n, period: 'monthly' })
    setLimit('')
  }

  const totalLimit = rows.reduce((s, r) => s + r.limit, 0)
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0)

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Kontrol pengeluaran"
        title="Anggaran"
        description="Tetapkan batas, pantau pemakaian, dan jaga arus kas tetap sehat setiap bulan."
        variant="planning"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '60ms' }}><div className="text-sm text-[#7a8174]">Total batas</div><div className="text-2xl font-bold mt-1 display tabular sensitive">{formatIDR(totalLimit)}</div></div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '100ms' }}><div className="text-sm text-[#7a8174]">Terpakai</div><div className="text-2xl font-bold mt-1 text-[#c47a1a] display tabular sensitive">{formatIDR(totalSpent)}</div></div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '140ms' }}><div className="text-sm text-[#7a8174]">Sisa</div><div className="text-2xl font-bold mt-1 text-[#3e6b22] display tabular sensitive">{formatIDR(Math.max(0, totalLimit - totalSpent))}</div></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4">
        <div className="card card-hover p-6 space-y-5 anim-fade-up" style={{ animationDelay: '180ms' }}>
          {rows.map((r) => {
            const bar = r.pct >= 95 ? '#b3402f' : r.pct >= 80 ? '#c47a1a' : '#4f7a3a'
            return (
              <div key={r.id}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-[#1a1f16]">{r.name}</div>
                    <div className="text-xs text-[#9aa094] sensitive">{formatShortIDR(r.spent)} dari {formatShortIDR(r.limit)}</div>
                  </div>
                  <div className={`text-sm font-semibold tabular ${r.pct >= 100 ? 'text-[#b3402f]' : r.pct >= 80 ? 'text-[#c47a1a]' : 'text-[#7a8174]'}`}>{r.pct}%</div>
                </div>
                <div className="h-2.5 rounded-full bg-[#eef0ea] overflow-hidden">
                  <div className="h-full rounded-full progress-fill" style={{ width: `${Math.min(100, r.pct)}%`, backgroundColor: bar }} />
                </div>
              </div>
            )
          })}
          {rows.length === 0 && <div className="text-sm text-[#8a8a85] py-8 text-center">Belum ada anggaran.</div>}
        </div>

        <form onSubmit={submit} className="card card-hover p-6 h-fit anim-fade-up" style={{ animationDelay: '220ms' }}>
          <h2 className="font-semibold display mb-4">Atur anggaran</h2>
          <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Kategori</span>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="field">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block mb-4"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Batas bulanan (Rp)</span><input value={limit} onChange={(e) => setLimit(e.target.value)} inputMode="numeric" placeholder="1500000" className="field" /></label>
          <button type="submit" className="btn-dark w-full px-4 py-2.5 text-sm font-semibold">Simpan anggaran</button>
        </form>
      </div>
    </div>
  )
}
