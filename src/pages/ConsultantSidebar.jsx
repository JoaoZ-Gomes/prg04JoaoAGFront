import React from 'react'
import { NavLink } from 'react-router-dom'
import './ConsultantLayout.css'

export default function ConsultantSidebar() {
  const navItems = [
    { to: '/consultor/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { to: '/consultor/criar-treino', icon: 'fas fa-clipboard-list', label: 'Criar Treino' },
    { to: '/consultor/exercicios', icon: 'fas fa-database', label: 'Banco de Exercícios' },
    { to: '/consultor/feedback', icon: 'fas fa-comments', label: 'Feedbacks' },
  ]

  return (
    <aside className="consultant-sidebar">
      <div className="sidebar-header">
        <i className="fas fa-user-tie"></i>
        <span>Área do Consultor</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <i className={item.icon}></i>
            <span className="link-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <NavLink to="/" className="nav-link logout-link">
          <i className="fas fa-sign-out-alt"></i>
          <span className="link-text">Sair (Voltar ao Site)</span>
        </NavLink>
      </div>
    </aside>
  )
}
