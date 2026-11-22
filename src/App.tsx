import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Budgets } from './pages/Budgets'
import { Goals } from './pages/Goals'
import { Accounts } from './pages/Accounts'
import { Reports } from './pages/Reports'
import { Debts } from './pages/Debts'
import { Bills } from './pages/Bills'
import { Assets } from './pages/Assets'
import { Insights } from './pages/Insights'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transaksi" element={<Transactions />} />
          <Route path="/anggaran" element={<Budgets />} />
          <Route path="/tabungan" element={<Goals />} />
          <Route path="/hutang" element={<Debts />} />
          <Route path="/tagihan" element={<Bills />} />
          <Route path="/aset" element={<Assets />} />
          <Route path="/laporan" element={<Reports />} />
          <Route path="/saran" element={<Insights />} />
          <Route path="/akun" element={<Accounts />} />
          <Route path="/pengaturan" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
