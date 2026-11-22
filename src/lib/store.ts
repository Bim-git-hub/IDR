import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedAccounts, seedAssets, seedBills, seedBudgets, seedCategories, seedDebts, seedGoals, seedTransactions } from './seed'
import { uid } from './format'
import type { Account, Asset, Bill, Budget, Category, Debt, Goal, Transaction } from './types'

interface AppState {
  accounts: Account[]
  categories: Category[]
  transactions: Transaction[]
  budgets: Budget[]
  goals: Goal[]
  debts: Debt[]
  bills: Bill[]
  assets: Asset[]
  privacyMode: boolean
  togglePrivacy: () => void
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void
  updateTransaction: (id: string, patch: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void
  deleteTransaction: (id: string) => void
  addAccount: (a: Omit<Account, 'id' | 'archived'>) => void
  addBudget: (b: Omit<Budget, 'id'>) => void
  addGoal: (g: Omit<Goal, 'id'>) => void
  updateGoalSaved: (id: string, amount: number) => void
  addDebt: (d: Omit<Debt, 'id'>) => void
  deleteDebt: (id: string) => void
  addBill: (b: Omit<Bill, 'id'>) => void
  deleteBill: (id: string) => void
  toggleBillPaid: (id: string) => void
  addAsset: (a: Omit<Asset, 'id'>) => void
  deleteAsset: (id: string) => void
  updateAssetPrice: (id: string, price: number) => void
  replaceAll: (data: Partial<AppState>) => void
}

function applyTx(accounts: Account[], tx: Pick<Transaction, 'type' | 'amount' | 'accountId' | 'toAccountId'>, dir: 1 | -1): Account[] {
  return accounts.map((a) => {
    if (tx.type === 'income' && a.id === tx.accountId) return { ...a, balance: a.balance + tx.amount * dir }
    if (tx.type === 'expense' && a.id === tx.accountId) return { ...a, balance: a.balance - tx.amount * dir }
    if (tx.type === 'transfer') {
      if (a.id === tx.accountId) return { ...a, balance: a.balance - tx.amount * dir }
      if (a.id === tx.toAccountId) return { ...a, balance: a.balance + tx.amount * dir }
    }
    return a
  })
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      accounts: seedAccounts,
      categories: seedCategories,
      transactions: seedTransactions,
      budgets: seedBudgets,
      goals: seedGoals,
      debts: seedDebts,
      bills: seedBills,
      assets: seedAssets,
      privacyMode: false,
      togglePrivacy: () => set((s) => ({ privacyMode: !s.privacyMode })),
      addTransaction: (tx) =>
        set((s) => {
          const newTx: Transaction = { ...tx, id: uid(), createdAt: new Date().toISOString() }
          return { transactions: [newTx, ...s.transactions], accounts: applyTx(s.accounts, newTx, 1) }
        }),
      updateTransaction: (id, patch) =>
        set((s) => {
          const old = s.transactions.find((t) => t.id === id)
          if (!old) return s
          const updated: Transaction = { ...old, ...patch }
          let accounts = applyTx(s.accounts, old, -1)
          accounts = applyTx(accounts, updated, 1)
          return { transactions: s.transactions.map((t) => (t.id === id ? updated : t)), accounts }
        }),
      deleteTransaction: (id) =>
        set((s) => {
          const tx = s.transactions.find((t) => t.id === id)
          if (!tx) return s
          return { transactions: s.transactions.filter((t) => t.id !== id), accounts: applyTx(s.accounts, tx, -1) }
        }),
      addAccount: (a) => set((s) => ({ accounts: [...s.accounts, { ...a, id: uid(), archived: false }] })),
      addBudget: (b) => set((s) => ({ budgets: [...s.budgets.filter((x) => x.categoryId !== b.categoryId), { ...b, id: uid() }] })),
      addGoal: (g) => set((s) => ({ goals: [...s.goals, { ...g, id: uid() }] })),
      updateGoalSaved: (id, amount) => set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, saved: Math.max(0, g.saved + amount) } : g)) })),
      addDebt: (d) => set((s) => ({ debts: [...s.debts, { ...d, id: uid() }] })),
      deleteDebt: (id) => set((s) => ({ debts: s.debts.filter((d) => d.id !== id) })),
      addBill: (b) => set((s) => ({ bills: [...s.bills, { ...b, id: uid() }] })),
      deleteBill: (id) => set((s) => ({ bills: s.bills.filter((b) => b.id !== id) })),
      toggleBillPaid: (id) => set((s) => ({ bills: s.bills.map((b) => (b.id === id ? { ...b, paid: !b.paid } : b)) })),
      addAsset: (a) => set((s) => ({ assets: [...s.assets, { ...a, id: uid() }] })),
      deleteAsset: (id) => set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),
      updateAssetPrice: (id, price) => set((s) => ({ assets: s.assets.map((a) => (a.id === id ? { ...a, currentPrice: price } : a)) })),
      replaceAll: (data) => set(data),
    }),
    { name: 'finglass-store-v1' },
  ),
)

export const useCategoriesById = () => {
  const cats = useAppStore((s) => s.categories)
  return Object.fromEntries(cats.map((c) => [c.id, c]))
}

export const useAccountsById = () => {
  const accs = useAppStore((s) => s.accounts)
  return Object.fromEntries(accs.map((a) => [a.id, a]))
}
