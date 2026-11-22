import { useMemo } from 'react'
import { useAppStore, useCategoriesById } from '../lib/store'
import { formatIDR, formatShortIDR, monthKey } from '../lib/format'
import { PageHero } from '../components/PageHero'

export function Reports() {
  const transactions = useAppStore((s) => s.transactions)
  const cats = useCategoriesById()
  const currentMonth = monthKey(new Date())
  const monthTx = transactions.filter((t) => monthKey(t.date) === currentMonth)

  const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const net = income - expense

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of monthTx) {
      if (t.type !== 'expense' || !t.categoryId) continue
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount)
    }
    return [...map.entries()].map(([id, amount]) => ({ id, name: cats[id]?.name ?? 'Lainnya', color: cats[id]?.color ?? '#4f7a3a', amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [monthTx, cats])

  const max = Math.max(1, ...byCategory.map((c) => c.amount))

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Analitik"
        title="Laporan"
        description="Ringkasan bulanan, arus kas, dan pengeluaran per kategori — semuanya jelas dalam satu pandangan."
        variant="analytics"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '60ms' }}><div className="text-sm text-[#7a8174]">Pemasukan</div><div className="text-2xl font-bold mt-1 text-[#3e6b22] display tabular sensitive">{formatIDR(income)}</div></div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '100ms' }}><div className="text-sm text-[#7a8174]">Pengeluaran</div><div className="text-2xl font-bold mt-1 text-[#b3402f] display tabular sensitive">{formatIDR(expense)}</div></div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '140ms' }}><div className="text-sm text-[#7a8174]">Arus bersih</div><div className={`text-2xl font-bold mt-1 display tabular sensitive ${net >= 0 ? 'text-[#3e6b22]' : 'text-[#b3402f]'}`}>{formatIDR(net)}</div></div>
      </div>

      <div className="card card-hover p-6 anim-fade-up" style={{ animationDelay: '180ms' }}>
        <h2 className="text-lg font-semibold display mb-5 text-[#1a1f16]">Pengeluaran per kategori</h2>
        <div className="space-y-4">
          {byCategory.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2 text-[#2b2b2a]"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</span>
                <span className="text-[#7a8174] tabular sensitive">{formatShortIDR(c.amount)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#eef0ea] overflow-hidden">
                <div className="h-full rounded-full progress-fill" style={{ width: `${(c.amount / max) * 100}%`, backgroundColor: c.color }} />
              </div>
            </div>
          ))}
          {byCategory.length === 0 && <div className="text-sm text-[#8a8a85] py-8 text-center">Belum ada pengeluaran bulan ini.</div>}
        </div>
      </div>
    </div>
  )
}
