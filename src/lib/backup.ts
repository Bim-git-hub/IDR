import { useAppStore } from './store'

const KEY = 'finglass-store-v1'

export function exportBackup(): string {
  const s = useAppStore.getState()
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    accounts: s.accounts,
    categories: s.categories,
    transactions: s.transactions,
    budgets: s.budgets,
    goals: s.goals,
    debts: s.debts,
    bills: s.bills,
    assets: s.assets,
  }
  return JSON.stringify(data, null, 2)
}

export function downloadBackup() {
  const blob = new Blob([exportBackup()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `finglass-backup-${stamp}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function importBackup(json: string): { ok: boolean; message: string } {
  try {
    const data = JSON.parse(json)
    const required = ['accounts', 'categories', 'transactions', 'budgets', 'goals', 'debts', 'bills', 'assets']
    for (const k of required) {
      if (!Array.isArray(data[k])) throw new Error(`Field "${k}" tidak valid`)
    }
    useAppStore.getState().replaceAll({
      accounts: data.accounts,
      categories: data.categories,
      transactions: data.transactions,
      budgets: data.budgets,
      goals: data.goals,
      debts: data.debts,
      bills: data.bills,
      assets: data.assets,
    })
    localStorage.setItem(KEY, JSON.stringify({ state: useAppStore.getState(), version: 0 }))
    return { ok: true, message: 'Backup berhasil dipulihkan.' }
  } catch (err) {
    return { ok: false, message: `Gagal memulihkan: ${err instanceof Error ? err.message : 'format tidak dikenal'}` }
  }
}
