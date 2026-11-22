import { useState } from 'react'
import { Plus, Trash2, Gem, TrendingUp, TrendingDown } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { formatIDR, formatShortIDR } from '../lib/format'
import { PageHero } from '../components/PageHero'

export function Assets() {
  const assets = useAppStore((s) => s.assets)
  const addAsset = useAppStore((s) => s.addAsset)
  const deleteAsset = useAppStore((s) => s.deleteAsset)
  const updateAssetPrice = useAppStore((s) => s.updateAssetPrice)
  const [name, setName] = useState('')
  const [type, setType] = useState('Reksa Dana')
  const [quantity, setQuantity] = useState('1')
  const [buyPrice, setBuyPrice] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [prices, setPrices] = useState<Record<string, string>>({})

  const totalBuy = assets.reduce((s, a) => s + a.buyPrice * a.quantity, 0)
  const totalCurrent = assets.reduce((s, a) => s + a.currentPrice * a.quantity, 0)
  const gain = totalCurrent - totalBuy
  const gainPct = totalBuy > 0 ? Math.round((gain / totalBuy) * 100) : 0

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = Number(quantity) || 1
    const b = Number(buyPrice.replace(/[^\d]/g, ''))
    const c = Number(currentPrice.replace(/[^\d]/g, '')) || b
    if (!name.trim() || !b) return
    addAsset({ name: name.trim(), type, quantity: q, buyPrice: b, currentPrice: c })
    setName(''); setBuyPrice(''); setCurrentPrice(''); setQuantity('1')
  }

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Portofolio"
        title="Aset & Investasi"
        description="Lihat kekayaan bersihmu bertumbuh. Catat aset, update harga, dan pantau kinerja."
        variant="market"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '60ms' }}><div className="text-sm text-[#7a8174]">Nilai saat ini</div><div className="text-2xl font-bold mt-2 display tabular sensitive">{formatIDR(totalCurrent)}</div></div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '100ms' }}><div className="text-sm text-[#7a8174]">Total beli</div><div className="text-2xl font-bold mt-2 display tabular sensitive">{formatIDR(totalBuy)}</div></div>
        <div className="card card-hover p-5 anim-fade-up" style={{ animationDelay: '140ms' }}><div className="text-sm text-[#7a8174]">Untung / rugi</div>
          <div className={`text-2xl font-bold mt-2 display tabular sensitive flex items-center gap-2 ${gain >= 0 ? 'text-[#3e6b22]' : 'text-[#b3402f]'}`}>
            {gain >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}{formatShortIDR(Math.abs(gain))} <span className="text-sm">({gainPct}%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4">
        <div className="card card-hover p-6 space-y-4 anim-fade-up" style={{ animationDelay: '180ms' }}>
          {assets.map((a) => {
            const itemGain = (a.currentPrice - a.buyPrice) * a.quantity
            const itemPct = a.buyPrice > 0 ? Math.round(((a.currentPrice - a.buyPrice) / a.buyPrice) * 100) : 0
            const val = prices[a.id] ?? ''
            return (
              <div key={a.id} className="flex items-center gap-4 border-b border-[#eef0ea] pb-4 last:border-0 last:pb-0 row-hover -mx-2 px-2 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-[#e3eed9] text-[#3e6b22] grid place-items-center shrink-0"><Gem size={17} /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#1a1f16] truncate">{a.name}</div>
                  <div className="text-xs text-[#9aa094]">{a.type} · {a.quantity} unit · beli {formatShortIDR(a.buyPrice)}</div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <input value={val} onChange={(e) => setPrices((p) => ({ ...p, [a.id]: e.target.value }))} inputMode="numeric" placeholder="Harga kini" className="field py-1.5! text-xs! w-32!" />
                  <button onClick={() => { const n = Number(val.replace(/[^\d]/g, '')); if (n) { updateAssetPrice(a.id, n); setPrices((p) => ({ ...p, [a.id]: '' })) } }} className="btn-white px-2.5 py-1.5 text-xs">Update</button>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold tabular sensitive text-[#1a1f16]">{formatShortIDR(a.currentPrice * a.quantity)}</div>
                  <div className={`text-[11px] tabular ${itemGain >= 0 ? 'text-[#3e6b22]' : 'text-[#b3402f]'}`}>{itemGain >= 0 ? '+' : ''}{formatShortIDR(itemGain)} ({itemPct}%)</div>
                </div>
                <button onClick={() => deleteAsset(a.id)} className="w-8 h-8 rounded-lg grid place-items-center text-[#c9cdc2] hover:text-[#b3402f] hover:bg-[#f7deda]" title="Hapus">
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
          {assets.length === 0 && <div className="py-8 text-center text-[#8a8a85] text-sm">Belum ada aset.</div>}
        </div>

        <form onSubmit={submit} className="card card-hover p-6 h-fit anim-fade-up" style={{ animationDelay: '220ms' }}>
          <h2 className="font-semibold display mb-4">Tambah aset</h2>
          <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Nama</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Emas" className="field" /></label>
          <label className="block mb-3"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Jenis</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="field">
              {['Deposito','Reksa Dana','Saham','Kripto','Emas','Properti','Kendaraan','Lainnya'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Jumlah</span><input value={quantity} onChange={(e) => setQuantity(e.target.value)} inputMode="numeric" className="field" /></label>
            <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Harga beli</span><input value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} inputMode="numeric" placeholder="0" className="field" /></label>
            <label className="block"><span className="text-xs font-medium text-[#7a8174] mb-1.5 block">Harga kini</span><input value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} inputMode="numeric" placeholder="0" className="field" /></label>
          </div>
          <button type="submit" className="btn-dark w-full px-4 py-2.5 text-sm font-semibold"><Plus size={16} className="inline mr-1" /> Simpan</button>
        </form>
      </div>
    </div>
  )
}
