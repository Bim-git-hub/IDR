import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Plus, AlertTriangle, Star, Clock } from 'lucide-react'
import { useAppStore, useCategoriesById } from '../lib/store'
import { useUIStore } from '../lib/ui-store'
import { formatIDR, formatShortIDR, monthKey } from '../lib/format'
import { Hills } from '../components/Hills'

function useCountUp(value: number, duration = 700) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(Math.round(value * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return v
}

function ArrowBtn({ dark = false }: { dark?: boolean }) {
  return <span className={`w-5 h-5 rounded-md grid place-items-center text-[11px] ${dark ? 'bg-[#111] text-white' : 'bg-[#111] text-white'}`}>↗</span>
}

function InsightRow({ icon, title, desc, action, tone }: { icon: React.ReactNode; title: string; desc: string; action: string; tone: 'white' | 'dark' | 'soft' }) {
  const box = tone === 'dark' ? 'bg-[#2e4a12] border-[#2e4a12]' : tone === 'soft' ? 'bg-[#e3eed9] border-[#e3eed9]' : 'bg-white border-[#e6e8e2]'
  const iconBox = tone === 'dark' ? 'bg-white/15 text-white' : tone === 'soft' ? 'bg-[#e3eed9] text-[#3e6b22]' : 'bg-[#f7deda] text-[#b3402f]'
  const titleColor = tone === 'dark' ? 'text-white' : 'text-[#1a1f16]'
  const descColor = tone === 'dark' ? 'text-white/70' : 'text-[#7a8174]'
  return (
    <div className={`rounded-2xl border p-3.5 flex items-center gap-3.5 ${box}`}>
      <div className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 ${iconBox}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className={`text-[14px] font-medium leading-snug ${titleColor}`}>{title}</div>
        <div className={`text-xs mt-0.5 leading-relaxed ${descColor}`}>{desc}</div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`pill py-1.5! px-3! ${tone === 'dark' ? 'bg-white/90! border-transparent!' : ''}`}>{action}</span>
        <ArrowBtn />
      </div>
    </div>
  )
}

export function Dashboard() {
  const transactions = useAppStore((s) => s.transactions)
  const accounts = useAppStore((s) => s.accounts)
  const budgets = useAppStore((s) => s.budgets)
  const goals = useAppStore((s) => s.goals)
  const categoriesById = useCategoriesById()
  const setQuickAddOpen = useUIStore((s) => s.setQuickAddOpen)

  const now = new Date()
  const currentMonth = monthKey(now)
  const monthTx = transactions.filter((t) => monthKey(t.date) === currentMonth)
  const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalBalance = accounts.filter((a) => !a.archived).reduce((s, a) => s + a.balance, 0)
  const budgetTotal = budgets.reduce((s, b) => s + b.limit, 0)
  const animatedBalance = useCountUp(totalBalance)

  const budgetRows = budgets.map((b) => {
    const spent = monthTx.filter((t) => t.type === 'expense' && t.categoryId === b.categoryId).reduce((s, t) => s + t.amount, 0)
    const cat = categoriesById[b.categoryId]
    const pct = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0
    return { id: b.id, name: cat?.name ?? 'Kategori', spent, limit: b.limit, pct }
  })
  const overBudget = budgetRows.find((b) => b.pct >= 85)
  const usedPct = budgetTotal > 0 ? Math.round((expense / budgetTotal) * 100) : 0

  const insights = useMemo(() => {
    const list: { icon: React.ReactNode; title: string; desc: string; action: string; tone: 'white' | 'dark' | 'soft' }[] = []
    if (overBudget) list.push({ icon: <AlertTriangle size={18} />, title: `Anggaran ${overBudget.name} hampir habis`, desc: `Dengan laju sekarang, habis ${Math.max(1, 30 - Math.round((overBudget.spent / overBudget.limit) * 30))} hari sebelum akhir bulan.`, action: 'Atur', tone: 'white' })
    list.push({ icon: <Star size={16} />, title: 'Sisihkan Rp 750 rb per bulan', desc: 'Dana darurat 6 bulan tercapai pada Oktober 2027.', action: 'Buat', tone: 'dark' })
    list.push({ icon: <Clock size={16} />, title: '3 tagihan jatuh tempo minggu depan', desc: 'Total Rp 2,4 juta, saldo Anda mencukupi.', action: 'Lihat', tone: 'soft' })
    return list.slice(0, 3)
  }, [overBudget])

  const recent = transactions.slice(0, 5)

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[28px] border border-[#dfe3d8] anim-fade-up">
        <Hills className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,255,255,0.22),transparent_55%)] pointer-events-none" />
        <div className="relative px-6 py-10 md:py-14 text-center">
          <span className="pill bg-white/30! border-white/50! text-white! backdrop-blur-sm">Total Saldo · Nov 2026</span>
          <div className="mt-5 text-[42px] md:text-[64px] leading-none font-light tracking-tight text-white tabular display sensitive">{formatIDR(animatedBalance)}</div>
          <p className="mt-3 text-sm text-white/90">Naik 6,2% dari bulan lalu · aman belanja Rp 185.000 hari ini</p>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-5">
        <div className="space-y-5">
          <div className="anim-fade-up" style={{ animationDelay: '60ms' }}>
            <span className="pill">Ringkasan Bulanan</span>
            <h1 className="mt-4 text-[32px] md:text-[38px] leading-[1.1] font-normal display text-[#1a1f16]">Keuangan Anda,<br />terkendali bulan ini.</h1>
            <p className="mt-4 text-sm leading-relaxed text-[#7a8174] max-w-md">FinGlass membaca pola pemasukan dan pengeluaran Anda lalu memberi saran yang jelas dan bisa langsung dijalankan.</p>
          </div>

          <div className="card card-hover p-6 anim-fade-up" style={{ animationDelay: '120ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium display text-[#1a1f16]">Saran Hari Ini</h2>
              <span className="pill">{insights.length} saran baru</span>
            </div>
            <div className="space-y-3">
              {insights.map((ins) => <InsightRow key={ins.title} {...ins} />)}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card card-hover p-6 flex gap-5 anim-fade-up" style={{ animationDelay: '160ms' }}>
            <div className="flex-1 min-w-0">
              <h2 className="text-[22px] font-normal display text-[#1a1f16]">Pemasukan</h2>
              <p className="mt-1.5 text-[13px] text-[#7a8174]"><span className="sensitive">{formatShortIDR(income)}</span> · gaji dan freelance, naik 8% dari bulan lalu</p>
              <div className="mt-5 flex items-center gap-1.5">
                <span className="pill">Lihat detail</span>
                <ArrowBtn />
              </div>
            </div>
            <div className="w-[120px] h-[100px] rounded-2xl shrink-0 bg-gradient-to-br from-[#9dbf7f] to-[#4f7a3a] relative overflow-hidden">
              <svg viewBox="0 0 120 100" className="absolute inset-0 w-full h-full">
                <path d="M10 84 C30 70 40 78 58 56 S92 46 104 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                <circle cx="104" cy="24" r="5" fill="#fff" />
              </svg>
            </div>
          </div>

          <div className="card-dark card-hover p-6 anim-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="flex gap-5">
              <div className="flex-1 min-w-0">
                <h2 className="text-[22px] font-normal display text-white">Pengeluaran vs Anggaran</h2>
                <p className="mt-1.5 text-[13px] text-white/70">Rp {formatShortIDR(expense)} dari Rp {formatShortIDR(budgetTotal)} · sisa 8 hari</p>
                <div className="mt-5 flex items-center gap-1.5">
                  <span className="pill bg-white/90! border-transparent!">Atur anggaran</span>
                  <ArrowBtn />
                </div>
                <div className="mt-6 space-y-3.5">
                  {budgetRows.slice(0, 3).map((b) => (
                    <div key={b.id}>
                      <div className="text-[11px] text-white/75 mb-1.5">{b.name}</div>
                      <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                        <div className="h-full rounded-full progress-fill" style={{ width: `${Math.min(100, b.pct)}%`, backgroundColor: b.pct >= 95 ? '#f28b7a' : b.pct >= 80 ? '#e8c14a' : '#9dd07a' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[120px] h-[100px] rounded-2xl shrink-0 bg-gradient-to-br from-[#4c7a2e] to-[#1f3510] relative grid place-items-center">
                <svg viewBox="0 0 100 100" className="w-20 h-20 -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="9" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(usedPct / 100) * 239} 239`} className="ring-fill" />
                </svg>
                <span className="absolute text-white text-sm font-medium">{usedPct}%</span>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6 anim-fade-up" style={{ animationDelay: '240ms' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-[22px] font-normal display text-[#1a1f16]">Target Tabungan</h2>
                <p className="mt-1.5 text-[13px] text-[#7a8174]">Dana Darurat 68% · Liburan Bali 42% · Laptop Baru 87%</p>
                <div className="mt-5 flex items-center gap-1.5">
                  <span className="pill">Lihat target</span>
                  <ArrowBtn />
                </div>
              </div>
              <button onClick={() => setQuickAddOpen(true)} className="w-12 h-12 rounded-2xl bg-[#111] text-white grid place-items-center shrink-0 hover:bg-[#2b2b2b]" aria-label="Tambah target">
                <Plus size={22} />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {goals.slice(0, 3).map((g) => {
                const pct = g.target > 0 ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0
                return (
                  <div key={g.id} className="text-center">
                    <div className="relative w-[72px] h-[72px] mx-auto">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="34" fill="none" stroke="#dce0d6" strokeWidth="9" />
                        <circle cx="50" cy="50" r="34" fill="none" stroke={g.color} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 214} 214`} className="ring-fill" />
                      </svg>
                      <span className="absolute inset-0 grid place-items-center text-[13px] font-medium text-[#1a1f16]">{pct}%</span>
                    </div>
                    <div className="mt-2 text-xs text-[#7a8174] truncate">{g.name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <section className="card-white card-white-hover p-6 anim-fade-up" style={{ animationDelay: '280ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium display text-[#1a1f16]">Transaksi terakhir</h2>
          <span className="text-xs text-[#7a8174]">{recent.length} terbaru</span>
        </div>
        <div className="divide-y divide-[#eef0ea]">
          {recent.map((t) => {
            const cat = t.categoryId ? categoriesById[t.categoryId] : undefined
            const positive = t.type === 'income'
            return (
              <div key={t.id} className="row-hover flex items-center gap-4 py-3 -mx-2 px-2 rounded-xl">
                <div className={`w-9 h-9 rounded-xl grid place-items-center ${positive ? 'bg-[#e3eed9] text-[#3e6b22]' : 'bg-[#f7deda] text-[#b3402f]'}`}>
                  <ArrowUpRight size={16} className={positive ? '' : 'rotate-180'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#1a1f16] truncate">{t.note || cat?.name || 'Transfer'}</div>
                  <div className="text-xs text-[#9aa094]">{t.date} · {cat?.name ?? 'Transfer'}</div>
                </div>
                <div className={`text-sm font-semibold tabular sensitive ${positive ? 'text-[#3e6b22]' : 'text-[#b3402f]'}`}>{positive ? '+' : '-'}{formatIDR(t.amount)}</div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
