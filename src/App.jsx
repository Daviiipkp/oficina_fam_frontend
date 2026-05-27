import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Checkin from './Checkin'
import Abobora from './Abobora'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/checkin" replace />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/abobora" element={<Abobora />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App