import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { formatIDR, formatShortIDR } from '../lib/format'
import { PageHero } from '../components/PageHero'

export function Goals() {
  const goals = useAppStore((s) => s.goals)
  const addGoal = useAppStore((s) => s.addGoal)
  const updateGoalSaved = useAppStore((s) => s.updateGoalSaved)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [saved, setSaved] = useState('')
  const [amounts, setAmounts] = useState<Record<string, string>>({})

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = Number(target.replace(/[^\d]/g, ''))
    const s = Number(saved.replace(/[^\d]/g, ''))
    if (!name.trim() || !t) return
    const colors = ['#4f7a3a', '#8dae74', '#2e4a12', '#c47a1a']
    addGoal({ name: name.trim(), target: t, saved: s || 0, color: colors[goals.length % colors.length] })
    setName(''); setTarget(''); setSaved('')
  }

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Impian & dana"
        title="Tabungan & Target"
        description="Bangun target yang jelas, lacak progres, dan capai tujuan finansialmu lebih terarah."
        variant="nature"
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g, i) => {
            const pct = g.target > 0 ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0
            const addVal = amounts[g.id] ?? ''
            return (
              <div key={g.id} className="card card-hover p-5 anim-fade-up" style={{ animationDelay: `${60 + i * 40}ms` }}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="font-semibold text-[#1a1f16]">{g.name}</div>
                    <div className="text-xs text-[#9aa094] mt-1 sensitive">{formatShortIDR(g.saved)} / {formatShortIDR(g.target)}</div>
                  </div>
                  <div className="text-sm font-bold tabular text-[#2e4a12]">{pct}%</div>
                </div>
                <div className="h-2.5 rounded-full bg-[#eef0ea] overflow-hidden mb-2">
                  <div className="h-full rounded-full progress-fill" style={{ width: `${pct}%`, backgroundColor: g.color }} />
                </div>
                <div className="text-xs text-[#8a8a85] mb-4">Sisa <span className="sensitive">{formatIDR(Math.max(0, g.target - g.saved))}</span></div>
                <div className="flex gap-2">
                  <input value={addVal} onChange={(e) => setAmounts((p) => ({ ...p, [g.id]: e.target.value }))} inputMode="numeric" placeholder="Tambah Rp..." className="field" />
                  <button onClick={() => { const n = Number(addVal.replace(/[^\d]/g, '')); if (n) { updateGoalSaved(g.id, n); setAmounts((p) => ({ ...p, [g.id]: '' })) } }} className="btn-white px-4 py-2.5 text-sm font-medium shrink-0">Setor</button>
                </div>
              </div>
            )
          })}
          {goals.length === 0 && <div className="card p-8 text-center text-[#8a8a85] md:col-span-2">Belum ada target.</div>}
        </div>

        <form onSubmit={submit} className="card card-hover p-6 h-fit anim-fade-up" style={{ animationDelay: '120ms' }}>
          <h2 className="font-semibold display mb-4 flex items-center gap-2"><Target size={18} className="text-[#4f7a3a]" /> Target baru</h2>
          <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Nama target</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dana darurat" className="field" /></label>
          <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Target (Rp)</span><input value={target} onChange={(e) => setTarget(e.target.value)} inputMode="numeric" placeholder="10000000" className="field" /></label>
          <label className="block mb-4"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Terkumpul awal (Rp)</span><input value={saved} onChange={(e) => setSaved(e.target.value)} inputMode="numeric" placeholder="0" className="field" /></label>
          <button type="submit" className="btn-dark w-full px-4 py-2.5 text-sm font-semibold"><Plus size={16} className="inline mr-1" /> Buat target</button>
        </form>
      </div>
    </div>
  )
}
