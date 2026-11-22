export const formatIDR = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

export const formatShortIDR = (value: number) => {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1_000_000_000) return `${sign}Rp ${(abs / 1_000_000_000).toFixed(1).replace('.', ',')} M`
  if (abs >= 1_000_000) return `${sign}Rp ${(abs / 1_000_000).toFixed(1).replace('.', ',')} jt`
  if (abs >= 1_000) return `${sign}Rp ${(abs / 1_000).toFixed(0)} rb`
  return formatIDR(value)
}

export const todayISO = () => new Date().toISOString().slice(0, 10)

export const monthKey = (d: string | Date) => {
  const date = typeof d === 'string' ? new Date(d) : d
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export const uid = () => crypto.randomUUID()
