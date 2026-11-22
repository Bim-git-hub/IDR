import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Wallet, PiggyBank, CreditCard, Receipt, TrendingUp, BarChart3, Sparkles, Settings } from 'lucide-react'

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transaksi', label: 'Transaksi', icon: ArrowLeftRight },
  { to: '/anggaran', label: 'Anggaran', icon: Wallet },
  { to: '/tabungan', label: 'Tabungan', icon: PiggyBank },
  { to: '/hutang', label: 'Hutang', icon: CreditCard },
  { to: '/tagihan', label: 'Tagihan', icon: Receipt },
  { to: '/aset', label: 'Aset', icon: TrendingUp },
  { to: '/laporan', label: 'Laporan', icon: BarChart3 },
  { to: '/saran', label: 'Saran', icon: Sparkles },
]

const linkClass = (active: boolean) =>
  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
    active ? 'bg-[#141414] text-white' : 'text-[#70706b] hover:bg-[#f4f4f2] hover:text-[#141414]'
  }`

export function Sidebar() {
  return (
    <aside className="surface flex flex-col h-full min-h-0 overflow-hidden">
      <div className="px-5 pt-5 pb-6 border-b border-[#ececea]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#141414] text-white grid place-items-center">
            <span className="font-display font-bold text-sm">FG</span>
          </div>
          <div>
            <div className="text-[22px] font-bold tracking-tight leading-none display text-[#141414]">FinGlass</div>
            <div className="text-[10px] text-[#9b9b96] mt-1.5 tracking-[0.16em] uppercase font-semibold">Personal Finance</div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 pb-2">
        <div className="upper-label">Workspace</div>
      </div>
      <nav className="flex-1 px-3 space-y-0.5 overflow-auto pb-4">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => linkClass(isActive)}>
            {({ isActive }) => <><Icon size={17} strokeWidth={1.8} className={isActive ? 'text-white' : 'text-[#8a8a85]'} /><span>{label}</span></>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-[#ececea] space-y-0.5">
        <NavLink to="/pengaturan" className={({ isActive }) => linkClass(isActive)}>
          {({ isActive }) => <><Settings size={17} strokeWidth={1.8} className={isActive ? 'text-white' : 'text-[#8a8a85]'} /><span>Pengaturan</span></>}
        </NavLink>
        <div className="px-3.5 py-3 mt-1 rounded-xl bg-[#f7f7f5]">
          <div className="text-xs font-semibold text-[#141414]">Data lokal</div>
          <div className="text-[11px] text-[#8a8a85] mt-0.5">Tersimpan di perangkat ini.</div>
        </div>
      </div>
    </aside>
  )
}
