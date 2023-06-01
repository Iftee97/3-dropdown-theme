import React from 'react'
import { Routes, Route } from 'react-router-dom'

// pages:
import Home from './pages/Home'
import SingleCollection from './pages/SingleCollection'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/collections/:handle' element={<SingleCollection />} />
    </Routes>
  )
}
