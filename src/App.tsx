import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'

const Admin = lazy(() => import('@/pages/Admin'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-svh bg-jmc-noche" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
