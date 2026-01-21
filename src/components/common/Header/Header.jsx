import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Header.css'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <div className="brand">
          <div className="logo">
            <img src="/assets/imagens/ph_team.png" alt="Logo" />
          </div>
          <div className="brand-text">
            <div className="titulo">PH Team</div>
            <div className="subtitulo">Consultoria de Performance</div>
          </div>
        </div>

        <button
          className={`menu-toggle ${open ? 'open' : ''}`}
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <Link to="/">Home</Link>
          <a href="#servicos">Serviços</a>
          <a href="#planos">Planos</a>
          <a href="#sobre">Sobre</a>
          <Link to="/login">Login</Link>
          <a className="btn-cta" href="#contato">Quero Começar</a>
        </nav>
      </div>
    </header>
  )
}
