import { create } from 'zustand'

interface UIState {
  commandOpen: boolean
  quickAddOpen: boolean
  setCommandOpen: (v: boolean) => void
  setQuickAddOpen: (v: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  commandOpen: false,
  quickAddOpen: false,
  setCommandOpen: (v) => set({ commandOpen: v }),
  setQuickAddOpen: (v) => set({ quickAddOpen: v }),
}))
