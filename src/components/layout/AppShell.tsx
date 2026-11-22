import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { useUIStore } from '../../lib/ui-store'
import { useAppStore } from '../../lib/store'
import { CommandPalette } from '../CommandPalette'
import { QuickAddModal } from '../QuickAddModal'

export function AppShell() {
  const { commandOpen, quickAddOpen, setCommandOpen, setQuickAddOpen } = useUIStore()
  const privacyMode = useAppStore((s) => s.privacyMode)
  const togglePrivacy = useAppStore((s) => s.togglePrivacy)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCommandOpen(!commandOpen) }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') { e.preventDefault(); setQuickAddOpen(!quickAddOpen) }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { e.preventDefault(); togglePrivacy() }
      if (e.key === 'Escape') { setCommandOpen(false); setQuickAddOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commandOpen, quickAddOpen, setCommandOpen, setQuickAddOpen, togglePrivacy])

  return (
    <div className={`grain h-full bg-[#f4f5f1] ${privacyMode ? 'privacy-on' : ''}`}>
      <div className="h-full flex flex-col p-3 md:p-4 gap-4 overflow-hidden">
        <TopBar />
        <main className="flex-1 min-h-0 overflow-auto pr-1 pb-6">
          <Outlet />
        </main>
      </div>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </div>
  )
}
