import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PieceSelector from './components/PieceSelector'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PieceSelector />
    </>
  )
}

export default App
