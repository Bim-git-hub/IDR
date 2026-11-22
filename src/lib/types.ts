export type AccountType = 'cash' | 'bank' | 'ewallet' | 'credit' | 'investment' | 'other'
export type TxType = 'income' | 'expense' | 'transfer'

export interface Account {
  id: string
  name: string
  type: AccountType
  balance: number // integer rupiah
  color: string
  icon: string
  archived: boolean
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
}

export interface Transaction {
  id: string
  type: TxType
  amount: number
  categoryId?: string
  accountId: string
  toAccountId?: string
  date: string // YYYY-MM-DD
  note: string
  tags: string[]
  createdAt: string
}

export interface Budget {
  id: string
  categoryId: string
  limit: number
  period: 'monthly'
}

export interface Goal {
  id: string
  name: string
  target: number
  saved: number
  deadline?: string
  color: string
}

export interface Debt {
  id: string
  name: string
  party: string
  type: 'hutang' | 'piutang'
  principal: number
  remaining: number
  interestRate: number
  monthlyPayment: number
  dueDate?: string
}

export interface Bill {
  id: string
  name: string
  amount: number
  cycle: 'monthly' | 'yearly' | 'once'
  dueDate: string
  category: string
  paid: boolean
}

export interface Asset {
  id: string
  name: string
  type: string
  quantity: number
  buyPrice: number
  currentPrice: number
}
