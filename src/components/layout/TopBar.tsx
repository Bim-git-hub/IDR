import { NavLink } from 'react-router-dom'
import { Bell, Plus, Search, Shield } from 'lucide-react'
import { useAppStore } from '../../lib/store'
import { useUIStore } from '../../lib/ui-store'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/transaksi', label: 'Transaksi' },
  { to: '/anggaran', label: 'Anggaran' },
  { to: '/tabungan', label: 'Tabungan' },
  { to: '/hutang', label: 'Hutang' },
  { to: '/tagihan', label: 'Tagihan' },
  { to: '/aset', label: 'Aset' },
  { to: '/laporan', label: 'Laporan' },
  { to: '/pengaturan', label: 'Pengaturan' },
]

export function TopBar() {
  const privacyMode = useAppStore((s) => s.privacyMode)
  const togglePrivacy = useAppStore((s) => s.togglePrivacy)
  const setCommandOpen = useUIStore((s) => s.setCommandOpen)
  const setQuickAddOpen = useUIStore((s) => s.setQuickAddOpen)

  return (
    <header className="sticky top-0 z-30">
      <div className="mx-1 flex items-center gap-2 rounded-full border border-[#e4e6e0]/90 bg-white/88 backdrop-blur-md px-2.5 py-2 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_4px_20px_rgba(26,31,22,0.04)]">
        <nav className="flex items-center gap-0.5 overflow-x-auto flex-1 min-w-0">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-200 ${
                  isActive ? 'bg-[#2e4a12] text-white shadow-[0_2px_8px_rgba(46,74,18,0.25)]' : 'text-[#4a5244] hover:bg-[#f0f1ed] hover:text-[#1a1f16]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block text-[17px] font-semibold tracking-tight display text-[#1a1f16] px-3 select-none">FinGlass</div>

        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <button onClick={() => setCommandOpen(true)} className="w-9 h-9 rounded-full grid place-items-center text-[#4a5244] hover:bg-[#f0f1ed]" aria-label="Cari" title="Cari (Ctrl+K)">
            <Search size={17} />
          </button>
          <button onClick={togglePrivacy} className={`w-9 h-9 rounded-full grid place-items-center transition ${privacyMode ? 'bg-[#2e4a12] text-white' : 'text-[#4a5244] hover:bg-[#f0f1ed]'}`} aria-label="Mode privasi" title="Mode privasi (Ctrl+P)">
            <Shield size={17} />
          </button>
          <button className="relative w-9 h-9 rounded-full grid place-items-center text-[#4a5244] hover:bg-[#f0f1ed]" aria-label="Notifikasi">
            <Bell size={17} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#b3402f]" />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#111] text-white grid place-items-center text-xs font-semibold">R</div>
          <button onClick={() => setQuickAddOpen(true)} className="ml-1 hidden sm:inline-flex items-center gap-2 rounded-full bg-[#111] text-white pl-4 pr-1.5 py-1.5 text-[13px] font-medium hover:bg-[#2b2b2b] hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-all duration-200 active:scale-[0.98]">
            Catat Transaksi
            <span className="w-6 h-6 rounded-md bg-white text-[#111] grid place-items-center"><Plus size={14} strokeWidth={2.5} /></span>
          </button>
        </div>
      </div>
    </header>
  )
}
