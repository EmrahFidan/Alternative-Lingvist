import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Bu dosyayı birazdan oluşturacağız
import './index.css'     // EN ÖNEMLİ SATIR! Stillerimizi projeye dahil eder.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)