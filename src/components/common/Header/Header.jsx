import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { isAuthenticated, logout, getUser } from '../../../services/authService'
import './Header.css'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * Verifica o status de autenticação ao montar o componente
   * e quando a rota muda
   */
  useEffect(() => {
    checkAuthStatus()
  }, [location])

  /**
   * Verifica se o usuário está autenticado
   * Evita "pisque" carregando o status antes de renderizar
   */
  const checkAuthStatus = () => {
    if (isAuthenticated()) {
      setIsLoggedIn(true)
      const user = getUser()
      setUserData(user)
    } else {
      setIsLoggedIn(false)
      setUserData(null)
    }
  }

  /**
   * Realiza logout e redireciona para home
   */
  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setUserData(null)
    setOpen(false)
    navigate('/')
  }

  /**
   * Fecha o menu móvel
   */
  const closeMenu = () => setOpen(false)

  /**
   * Navega para página e fecha menu
   */
  const handleNavigation = (path) => {
    navigate(path)
    closeMenu()
  }

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
          <Link to="/" onClick={closeMenu}>Home</Link>
          <a href="#servicos" onClick={closeMenu}>Serviços</a>
          <a href="#planos" onClick={closeMenu}>Planos</a>
          <a href="#sobre" onClick={closeMenu}>Sobre</a>

          {/* RENDERIZAÇÃO CONDICIONAL: Logado vs Deslogado */}
          {!isLoggedIn ? (
            <>
              {/* Estado: NÃO LOGADO */}
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <a className="btn-cta" href="#contato" onClick={closeMenu}>
                Quero Começar
              </a>
            </>
          ) : (
            <>
              {/* Estado: LOGADO */}
              <Link to="/perfil" onClick={closeMenu} title={`Logado como: ${userData?.email}`}>
                Minha Conta
              </Link>
              <button
                className="btn-cta btn-logout"
                onClick={handleLogout}
                title="Sair da conta"
              >
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
