import { useState } from 'react'
import { Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { formatIDR, formatShortIDR } from '../lib/format'
import type { Debt } from '../lib/types'
import { PageHero } from '../components/PageHero'

export function Debts() {
  const debts = useAppStore((s) => s.debts)
  const addDebt = useAppStore((s) => s.addDebt)
  const deleteDebt = useAppStore((s) => s.deleteDebt)
  const [name, setName] = useState('')
  const [party, setParty] = useState('')
  const [type, setType] = useState<Debt['type']>('hutang')
  const [principal, setPrincipal] = useState('')
  const [remaining, setRemaining] = useState('')
  const [rate, setRate] = useState('')
  const [monthly, setMonthly] = useState('')
  const [due, setDue] = useState('')

  const hutang = debts.filter((d) => d.type === 'hutang')
  const piutang = debts.filter((d) => d.type === 'piutang')
  const totalHutang = hutang.reduce((s, d) => s + d.remaining, 0)
  const totalPiutang = piutang.reduce((s, d) => s + d.remaining, 0)
  const totalCicilan = hutang.reduce((s, d) => s + d.monthlyPayment, 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const p = Number(principal.replace(/[^\d]/g, ''))
    const r = Number(remaining.replace(/[^\d]/g, '')) || p
    if (!name.trim() || !p) return
    addDebt({ name: name.trim(), party: party.trim() || 'Pihak', type, principal: p, remaining: r, interestRate: Number(rate) || 0, monthlyPayment: Number(monthly.replace(/[^\d]/g, '')) || 0, dueDate: due || undefined })
    setName(''); setParty(''); setPrincipal(''); setRemaining(''); setRate(''); setMonthly(''); setDue('')
  }

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Kewajiban & piutang"
        title="Hutang & Cicilan"
        description="Pantau sisa kewajiban, cicilan bulanan, dan piutang dalam satu tampilan."
        variant="document"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center gap-2 text-sm text-[#7a8174]"><TrendingDown size={16} /> Total hutang</div>
          <div className="text-2xl font-bold mt-2 display tabular sensitive text-[#b3402f]">{formatIDR(totalHutang)}</div>
        </div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 text-sm text-[#7a8174]"><TrendingUp size={16} /> Piutang</div>
          <div className="text-2xl font-bold mt-2 display tabular sensitive text-[#3e6b22]">{formatIDR(totalPiutang)}</div>
        </div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '140ms' }}>
          <div className="text-sm text-[#7a8174]">Cicilan per bulan</div>
          <div className="text-2xl font-bold mt-2 display tabular sensitive">{formatIDR(totalCicilan)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4">
        <div className="card card-hover p-6 space-y-4 anim-fade-up" style={{ animationDelay: '180ms' }}>
          {debts.map((d) => {
            const pct = d.principal > 0 ? Math.min(100, Math.round(((d.principal - d.remaining) / d.principal) * 100)) : 0
            return (
              <div key={d.id} className="flex items-center gap-4 border-b border-[#eef0ea] pb-4 last:border-0 last:pb-0 row-hover -mx-2 px-2 rounded-xl">
                <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${d.type === 'hutang' ? 'bg-[#f7deda] text-[#b3402f]' : 'bg-[#e3eed9] text-[#3e6b22]'}`}>
                  {d.type === 'hutang' ? <TrendingDown size={17} /> : <TrendingUp size={17} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#1a1f16] truncate">{d.name}</div>
                  <div className="text-xs text-[#9aa094]">{d.party} · bunga {d.interestRate}% · cicilan {formatShortIDR(d.monthlyPayment)}/bln{d.dueDate ? ` · jatuh tempo ${d.dueDate}` : ''}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-[#eef0ea] overflow-hidden">
                    <div className="h-full bg-[#4f7a3a] progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold tabular sensitive text-[#1a1f16]">{formatShortIDR(d.remaining)}</div>
                  <div className="text-[11px] text-[#9aa094]">terbayar {pct}%</div>
                </div>
                <button onClick={() => deleteDebt(d.id)} className="w-8 h-8 rounded-lg grid place-items-center text-[#c9cdc2] hover:text-[#b3402f] hover:bg-[#f7deda]" title="Hapus">
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
          {debts.length === 0 && <div className="py-8 text-center text-[#8a8a85] text-sm">Belum ada data hutang/piutang.</div>}
        </div>

        <form onSubmit={submit} className="card card-hover p-6 h-fit anim-fade-up" style={{ animationDelay: '220ms' }}>
          <h2 className="font-semibold display mb-4">Tambah hutang / piutang</h2>
          <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Nama</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="KPR Rumah" className="field" /></label>
          <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Pihak</span><input value={party} onChange={(e) => setParty(e.target.value)} placeholder="Bank / orang" className="field" /></label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Jenis</span>
              <select value={type} onChange={(e) => setType(e.target.value as Debt['type'])} className="field">
                <option value="hutang">Hutang</option><option value="piutang">Piutang</option>
              </select>
            </label>
            <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Bunga %/thn</span><input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="numeric" placeholder="0" className="field" /></label>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Pokok (Rp)</span><input value={principal} onChange={(e) => setPrincipal(e.target.value)} inputMode="numeric" placeholder="0" className="field" /></label>
            <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Sisa (Rp)</span><input value={remaining} onChange={(e) => setRemaining(e.target.value)} inputMode="numeric" placeholder="0" className="field" /></label>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Cicilan/bln</span><input value={monthly} onChange={(e) => setMonthly(e.target.value)} inputMode="numeric" placeholder="0" className="field" /></label>
            <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Jatuh tempo</span><input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="field" /></label>
          </div>
          <button type="submit" className="btn-dark w-full px-4 py-2.5 text-sm font-semibold"><Plus size={16} className="inline mr-1" /> Simpan</button>
        </form>
      </div>
    </div>
  )
}
