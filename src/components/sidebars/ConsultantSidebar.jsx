import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../layouts/ConsultantLayout/ConsultantLayout.css'

export default function ConsultantSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = () => setSidebarOpen(false)

  const navItems = [
    { to: '/consultor/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { to: '/consultor/criar-treino', icon: 'fas fa-clipboard-list', label: 'Criar Treino' },
    { to: '/consultor/exercicios', icon: 'fas fa-database', label: 'Banco de Exercícios' },
    { to: '/consultor/feedback', icon: 'fas fa-comments', label: 'Feedbacks' },
  ]

  return (
    <>
      <button 
        className="sidebar-toggle-btn" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Abrir menu"
      >
        <i className="fas fa-bars"></i>
      </button>
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      <aside className={`consultant-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="header-content">
            <i className="fas fa-user-tie"></i>
            <span>Área do Consultor</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              onClick={closeSidebar}
            >
              <i className={item.icon}></i>
              <span className="link-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <NavLink to="/" className="nav-link logout-link" onClick={closeSidebar}>
            <i className="fas fa-sign-out-alt"></i>
            <span className="link-text">Sair (Voltar ao Site)</span>
          </NavLink>
        </div>
      </aside>
    </>
  )
}
