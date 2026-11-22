import type { Account, Asset, Bill, Budget, Category, Debt, Goal, Transaction } from './types'

const now = new Date()
const iso = (d: Date) => d.toISOString().slice(0, 10)
const daysAgo = (n: number) => { const d = new Date(now); d.setDate(d.getDate() - n); return iso(d) }

export const seedAccounts: Account[] = [
  { id: 'a1', name: 'BCA Utama', type: 'bank', balance: 32500000, color: '#7C5CFF', icon: 'bank', archived: false },
  { id: 'a2', name: 'GoPay', type: 'ewallet', balance: 850000, color: '#14D6B4', icon: 'wallet', archived: false },
  { id: 'a3', name: 'Tunai', type: 'cash', balance: 450000, color: '#FFB020', icon: 'cash', archived: false },
  { id: 'a4', name: 'Jenius', type: 'bank', balance: 14450000, color: '#FF5C9E', icon: 'bank', archived: false },
]

export const seedCategories: Category[] = [
  { id: 'c-income-salary', name: 'Gaji', type: 'income', icon: 'briefcase', color: '#14D6B4' },
  { id: 'c-income-freelance', name: 'Freelance', type: 'income', icon: 'laptop', color: '#7C5CFF' },
  { id: 'c-food', name: 'Makan & Minum', type: 'expense', icon: 'utensils', color: '#FFB020' },
  { id: 'c-transport', name: 'Transportasi', type: 'expense', icon: 'car', color: '#14D6B4' },
  { id: 'c-fun', name: 'Hiburan', type: 'expense', icon: 'film', color: '#FF5C9E' },
  { id: 'c-shop', name: 'Belanja', type: 'expense', icon: 'bag', color: '#7C5CFF' },
  { id: 'c-bills', name: 'Tagihan', type: 'expense', icon: 'receipt', color: '#FF7A7A' },
  { id: 'c-health', name: 'Kesehatan', type: 'expense', icon: 'heart', color: '#5BF0D4' },
]

export const seedTransactions: Transaction[] = [
  { id: 't1', type: 'income', amount: 12000000, categoryId: 'c-income-salary', accountId: 'a1', date: daysAgo(20), note: 'Gaji November', tags: ['gaji'], createdAt: now.toISOString() },
  { id: 't2', type: 'income', amount: 3000000, categoryId: 'c-income-freelance', accountId: 'a4', date: daysAgo(7), note: 'Proyek desain', tags: ['freelance'], createdAt: now.toISOString() },
  { id: 't3', type: 'expense', amount: 35000, categoryId: 'c-food', accountId: 'a2', date: daysAgo(0), note: 'Makan siang', tags: ['makan'], createdAt: now.toISOString() },
  { id: 't4', type: 'expense', amount: 28000, categoryId: 'c-food', accountId: 'a2', date: daysAgo(1), note: 'Kopi', tags: ['kopi'], createdAt: now.toISOString() },
  { id: 't5', type: 'expense', amount: 450000, categoryId: 'c-transport', accountId: 'a1', date: daysAgo(3), note: 'Isi bensin', tags: ['transport'], createdAt: now.toISOString() },
  { id: 't6', type: 'expense', amount: 1200000, categoryId: 'c-bills', accountId: 'a1', date: daysAgo(5), note: 'Listrik & internet', tags: ['tagihan'], createdAt: now.toISOString() },
  { id: 't7', type: 'expense', amount: 750000, categoryId: 'c-fun', accountId: 'a1', date: daysAgo(2), note: 'Nonton & makan malam', tags: ['hiburan'], createdAt: now.toISOString() },
  { id: 't8', type: 'expense', amount: 3200000, categoryId: 'c-shop', accountId: 'a1', date: daysAgo(10), note: 'Belanja bulanan', tags: ['belanja'], createdAt: now.toISOString() },
  { id: 't9', type: 'expense', amount: 150000, categoryId: 'c-health', accountId: 'a3', date: daysAgo(4), note: 'Vitamin', tags: ['kesehatan'], createdAt: now.toISOString() },
  { id: 't10', type: 'expense', amount: 4200000, categoryId: 'c-fun', accountId: 'a4', date: daysAgo(12), note: 'Gadget aksesori', tags: ['hiburan'], createdAt: now.toISOString() },
  { id: 't11', type: 'transfer', amount: 500000, accountId: 'a1', toAccountId: 'a2', date: daysAgo(1), note: 'Top up GoPay', tags: ['transfer'], createdAt: now.toISOString() },
]

export const seedBudgets: Budget[] = [
  { id: 'b1', categoryId: 'c-food', limit: 2500000, period: 'monthly' },
  { id: 'b2', categoryId: 'c-transport', limit: 1000000, period: 'monthly' },
  { id: 'b3', categoryId: 'c-fun', limit: 1500000, period: 'monthly' },
  { id: 'b4', categoryId: 'c-shop', limit: 4000000, period: 'monthly' },
]

export const seedGoals: Goal[] = [
  { id: 'g1', name: 'Dana Darurat', target: 30000000, saved: 20400000, color: '#4f7a3a' },
  { id: 'g2', name: 'Liburan Bali', target: 10000000, saved: 4200000, color: '#8dae74' },
  { id: 'g3', name: 'Laptop Baru', target: 18000000, saved: 15660000, color: '#2e4a12' },
]

export const seedDebts: Debt[] = [
  { id: 'd1', name: 'KPR Rumah', party: 'Bank BCA', type: 'hutang', principal: 450000000, remaining: 380000000, interestRate: 7.5, monthlyPayment: 4200000, dueDate: '2026-12-15' },
  { id: 'd2', name: 'Cicilan Motor', party: 'Finance', type: 'hutang', principal: 24000000, remaining: 8400000, interestRate: 12, monthlyPayment: 1200000, dueDate: '2026-12-20' },
  { id: 'd3', name: 'Piutang Rani', party: 'Rani', type: 'piutang', principal: 1500000, remaining: 1000000, interestRate: 0, monthlyPayment: 0, dueDate: '2026-12-30' },
]

export const seedBills: Bill[] = [
  { id: 'bl1', name: 'Listrik & Air', amount: 450000, cycle: 'monthly', dueDate: '2026-12-10', category: 'Tagihan', paid: false },
  { id: 'bl2', name: 'Internet', amount: 350000, cycle: 'monthly', dueDate: '2026-12-12', category: 'Tagihan', paid: false },
  { id: 'bl3', name: 'Netflix', amount: 140000, cycle: 'monthly', dueDate: '2026-12-15', category: 'Langganan', paid: false },
  { id: 'bl4', name: 'Spotify', amount: 55000, cycle: 'monthly', dueDate: '2026-12-15', category: 'Langganan', paid: false },
  { id: 'bl5', name: 'Gym', amount: 250000, cycle: 'monthly', dueDate: '2026-12-18', category: 'Langganan', paid: true },
]

export const seedAssets: Asset[] = [
  { id: 'as1', name: 'Tabungan Jangka', type: 'Deposito', quantity: 1, buyPrice: 20000000, currentPrice: 21000000 },
  { id: 'as2', name: 'Reksa Dana', type: 'Reksa Dana', quantity: 1, buyPrice: 10000000, currentPrice: 11500000 },
  { id: 'as3', name: 'Emas', type: 'Emas', quantity: 2, buyPrice: 1500000, currentPrice: 1800000 },
]
