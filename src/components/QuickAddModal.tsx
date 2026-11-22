import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { todayISO } from '../lib/format'
import type { TxType } from '../lib/types'

export function QuickAddModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const allAccounts = useAppStore((s) => s.accounts)
  const accounts = useMemo(() => allAccounts.filter((a) => !a.archived), [allAccounts])
  const categories = useAppStore((s) => s.categories)
  const addTransaction = useAppStore((s) => s.addTransaction)
  const [type, setType] = useState<TxType>('expense')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState('')
  const [toAccountId, setToAccountId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')

  useEffect(() => {
    if (open) {
      setType('expense')
      setAmount('')
      const firstAcc = accounts[0]?.id ?? ''
      setAccountId(firstAcc)
      setToAccountId(accounts.find((a) => a.id !== firstAcc)?.id ?? '')
      setCategoryId(categories.find((c) => c.type === 'expense')?.id ?? '')
      setDate(todayISO())
      setNote('')
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const list = categories.filter((c) => c.type === (type === 'income' ? 'income' : 'expense'))
    if (type !== 'transfer' && !list.find((c) => c.id === categoryId)) setCategoryId(list[0]?.id ?? '')
  }, [type, categories, categoryId])

  if (!open) return null
  const cats = categories.filter((c) => c.type === (type === 'income' ? 'income' : 'expense'))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(amount.replace(/[^\d]/g, ''))
    if (!n || !accountId) return
    if (type === 'transfer' && !toAccountId) return
    addTransaction({ type, amount: n, accountId, toAccountId: type === 'transfer' ? toAccountId : undefined, categoryId: type === 'transfer' ? undefined : categoryId, date, note, tags: [] })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-[#1a1f16]/25 backdrop-blur-[2px] anim-fade-in" onClick={onClose} />
      <form onSubmit={submit} className="card-white relative w-full max-w-xl p-6 anim-pop">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="upper-label mb-1.5">Pencatatan cepat</div>
            <h2 className="text-[22px] font-bold display text-[#1a1f16]">Tambah Transaksi</h2>
            <p className="text-sm text-[#7a8174] mt-1">Catat pemasukan, pengeluaran, atau transfer.</p>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-xl border border-[#e2e2dd] grid place-items-center text-[#7a8174] hover:bg-[#f4f5f1]"><X size={18} /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {([['expense', 'Keluar'], ['income', 'Masuk'], ['transfer', 'Transfer']] as const).map(([v, l]) => (
            <button key={v} type="button" onClick={() => setType(v)} className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition ${type === v ? 'btn-dark' : 'btn-white'}`}>{l}</button>
          ))}
        </div>

        <label className="block mb-4">
          <span className="text-xs font-semibold text-[#7a8174] mb-1.5 block">Nominal (Rp)</span>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" autoFocus placeholder="50.000" className="field text-2xl! py-3! font-bold tabular" />
        </label>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <label className="block">
            <span className="text-xs font-semibold text-[#7a8174] mb-1.5 block">Akun</span>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="field">
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>
          {type !== 'transfer' ? (
            <label className="block">
              <span className="text-xs font-semibold text-[#7a8174] mb-1.5 block">Kategori</span>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="field">
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          ) : (
            <label className="block">
              <span className="text-xs font-semibold text-[#7a8174] mb-1.5 block">Ke akun</span>
              <select value={toAccountId} onChange={(e) => setToAccountId(e.target.value)} className="field">
                {accounts.filter((a) => a.id !== accountId).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </label>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <label className="block">
            <span className="text-xs font-semibold text-[#7a8174] mb-1.5 block">Tanggal</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#7a8174] mb-1.5 block">Catatan</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Contoh: kopi pagi" className="field" />
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#eef0ea]">
          <button type="button" onClick={onClose} className="btn-white px-4 py-2.5 text-sm font-medium">Batal</button>
          <button type="submit" className="btn-dark px-5 py-2.5 text-sm font-semibold">Simpan transaksi</button>
        </div>
      </form>
    </div>
  )
}
