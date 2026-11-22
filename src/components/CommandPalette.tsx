import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Shield, LayoutDashboard, ArrowLeftRight, Wallet, PiggyBank, BarChart3 } from 'lucide-react'
import { useUIStore } from '../lib/ui-store'
import { useAppStore } from '../lib/store'

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const setQuickAddOpen = useUIStore((s) => s.setQuickAddOpen)
  const togglePrivacy = useAppStore((s) => s.togglePrivacy)
  useEffect(() => { if (open) setQ('') }, [open])

  const actions = useMemo(() => [
    { id: 'qa', label: 'Tambah transaksi', hint: 'Ctrl+N', icon: Plus, run: () => { onClose(); setQuickAddOpen(true) } },
    { id: 'priv', label: 'Toggle mode privasi', hint: 'Ctrl+P', icon: Shield, run: () => { togglePrivacy(); onClose() } },
    { id: 'dash', label: 'Buka Dashboard', icon: LayoutDashboard, run: () => { nav('/'); onClose() } },
    { id: 'tx', label: 'Buka Transaksi', icon: ArrowLeftRight, run: () => { nav('/transaksi'); onClose() } },
    { id: 'bud', label: 'Buka Anggaran', icon: Wallet, run: () => { nav('/anggaran'); onClose() } },
    { id: 'goal', label: 'Buka Tabungan', icon: PiggyBank, run: () => { nav('/tabungan'); onClose() } },
    { id: 'rep', label: 'Buka Laporan', icon: BarChart3, run: () => { nav('/laporan'); onClose() } },
  ], [nav, onClose, setQuickAddOpen, togglePrivacy])

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()))
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-start justify-center pt-[12vh] p-4">
      <div className="absolute inset-0 bg-[#1a1f16]/20 backdrop-blur-[2px] anim-fade-in" onClick={onClose} />
      <div className="card-white relative w-full max-w-2xl overflow-hidden anim-pop">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#eef0ea]">
          <Search size={18} className="text-[#9aa094]" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari halaman atau aksi..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#9aa094]" />
          <kbd className="text-[11px] px-2 py-1 rounded-md bg-[#f4f5f1] border border-[#e2e2dd] text-[#7a8174]">Esc</kbd>
        </div>
        <div className="p-2 max-h-[360px] overflow-auto">
          {filtered.map((a) => {
            const Icon = a.icon
            return (
              <button key={a.id} onClick={a.run} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f4f5f1] text-left transition">
                <div className="w-8 h-8 rounded-lg bg-[#f4f5f1] border border-[#eef0ea] grid place-items-center text-[#4a5244]"><Icon size={16} /></div>
                <span className="flex-1 text-sm font-medium text-[#1a1f16]">{a.label}</span>
                {a.hint && <span className="text-xs text-[#9b9b96]">{a.hint}</span>}
              </button>
            )
          })}
          {filtered.length === 0 && <div className="px-4 py-8 text-sm text-[#9aa094] text-center">Tidak ada hasil.</div>}
        </div>
      </div>
    </div>
  )
}
