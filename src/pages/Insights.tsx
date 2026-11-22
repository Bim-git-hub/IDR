import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, PiggyBank, CalendarClock, RefreshCcw, CreditCard, TrendingUp, Target, ArrowRight } from 'lucide-react'
import { useAppStore, useCategoriesById } from '../lib/store'
import { formatShortIDR, monthKey } from '../lib/format'
import { PageHero } from '../components/PageHero'

interface Insight {
  id: string
  icon: any
  title: string
  reason: string
  action: string
  to: string
  tone: 'danger' | 'good' | 'neutral'
}

export function Insights() {
  const transactions = useAppStore((s) => s.transactions)
  const budgets = useAppStore((s) => s.budgets)
  const bills = useAppStore((s) => s.bills)
  const debts = useAppStore((s) => s.debts)
  const goals = useAppStore((s) => s.goals)
  const categoriesById = useCategoriesById()
  const nav = useNavigate()

  const insights = useMemo<Insight[]>(() => {
    const list: Insight[] = []
    const now = new Date()
    const currentMonth = monthKey(now)
    const monthTx = transactions.filter((t) => monthKey(t.date) === currentMonth)
    const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

    for (const b of budgets) {
      const spent = monthTx.filter((t) => t.type === 'expense' && t.categoryId === b.categoryId).reduce((s, t) => s + t.amount, 0)
      const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0
      if (pct >= 80) {
        list.push({ id: `budget-${b.id}`, icon: AlertTriangle, title: `${categoriesById[b.categoryId]?.name ?? 'Kategori'} hampir habis`, reason: `Sudah terpakai ${Math.round(pct)}% dari batas ${formatShortIDR(b.limit)} bulan ini.`, action: 'Atur anggaran', to: '/anggaran', tone: pct >= 100 ? 'danger' : 'neutral' })
      }
    }

    const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0
    list.push({ id: 'saving', icon: PiggyBank, title: savingsRate >= 20 ? 'Rasio tabungan sehat' : 'Rasio tabungan perlu dinaikkan', reason: savingsRate >= 20 ? `Kamu menyisihkan ${savingsRate}% dari pemasukan bulan ini.` : `Hanya ${savingsRate}% pemasukan yang tersisa. Target minimal 20%.`, action: 'Lihat target', to: '/tabungan', tone: savingsRate >= 20 ? 'good' : 'neutral' })

    const unpaid = bills.filter((b) => !b.paid)
    if (unpaid.length > 0) {
      const total = unpaid.reduce((s, b) => s + b.amount, 0)
      list.push({ id: 'bills', icon: CalendarClock, title: `${unpaid.length} tagihan belum dibayar`, reason: `Total ${formatShortIDR(total)} dengan jatuh tempo terdekat ${unpaid.map((b) => b.dueDate).sort()[0]}.`, action: 'Lihat tagihan', to: '/tagihan', tone: 'neutral' })
    }

    const subs = bills.filter((b) => b.category === 'Langganan' && b.cycle === 'monthly')
    if (subs.length > 0) {
      const total = subs.reduce((s, b) => s + b.amount, 0)
      list.push({ id: 'subs', icon: RefreshCcw, title: `Langganan ${formatShortIDR(total)}/bulan`, reason: `${subs.length} layanan berlangganan aktif.`, action: 'Kelola langganan', to: '/tagihan', tone: 'neutral' })
    }

    const hutang = debts.filter((d) => d.type === 'hutang')
    const cicilan = hutang.reduce((s, d) => s + d.monthlyPayment, 0)
    if (income > 0 && cicilan > 0) {
      const dti = Math.round((cicilan / income) * 100)
      list.push({ id: 'dti', icon: CreditCard, title: `Rasio cicilan ${dti}% dari penghasilan`, reason: dti > 30 ? 'Cicilan melebihi batas sehat 30%. Pertimbangkan pelunasan hutang bunga tinggi.' : 'Cicilan masih dalam batas sehat.', action: 'Lihat hutang', to: '/hutang', tone: dti > 30 ? 'danger' : 'good' })
    }

    const goal = goals.find((g) => g.target > 0 && g.saved / g.target >= 0.8 && g.saved < g.target)
    if (goal) {
      list.push({ id: `goal-${goal.id}`, icon: Target, title: `${goal.name} hampir tercapai`, reason: `Sudah ${Math.round((goal.saved / goal.target) * 100)}% dari target ${formatShortIDR(goal.target)}.`, action: 'Lihat target', to: '/tabungan', tone: 'good' })
    }

    if (expense > income && income > 0) {
      list.push({ id: 'cashflow', icon: TrendingUp, title: 'Pengeluaran melebihi pemasukan', reason: `Bulan ini keluar ${formatShortIDR(expense)} vs masuk ${formatShortIDR(income)}.`, action: 'Lihat laporan', to: '/laporan', tone: 'danger' })
    }
    return list
  }, [transactions, budgets, bills, debts, goals, categoriesById])

  const toneBox = (t: Insight['tone']) => t === 'danger' ? 'bg-[#f7deda] border-[#f0cfc9]' : t === 'good' ? 'bg-[#e3eed9] border-[#d5e6c4]' : 'bg-white border-[#e6e8e2]'
  const toneIcon = (t: Insight['tone']) => t === 'danger' ? 'bg-[#b3402f] text-white' : t === 'good' ? 'bg-[#3e6b22] text-white' : 'bg-[#1a1f16] text-white'

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Mesin saran lokal"
        title="Saran Cerdas"
        description="Insight berbasis aturan dari data transaksimu. Berjalan offline, tanpa AI."
        variant="workspace"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins, i) => {
          const Icon = ins.icon
          return (
            <div key={ins.id} className={`rounded-2xl border p-5 anim-fade-up card-hover ${toneBox(ins.tone)}`} style={{ animationDelay: `${60 + i * 40}ms` }}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${toneIcon(ins.tone)}`}><Icon size={18} /></div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[#1a1f16]">{ins.title}</div>
                  <div className="text-[13px] text-[#7a8174] mt-1 leading-relaxed">{ins.reason}</div>
                  <button onClick={() => nav(ins.to)} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1a1f16] hover:text-[#3e6b22] transition">
                    {ins.action} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {insights.length === 0 && <div className="card p-8 text-center text-[#8a8a85]">Belum ada insight. Mulai catat transaksi.</div>}
      <p className="text-xs text-[#9aa094]">Saran ini bersifat informatif, bukan nasihat keuangan profesional.</p>
    </div>
  )
}
