import React from 'react';
import { NavLink } from 'react-router-dom';
import '../layouts/ClientLayout/ClientLayout.css'

/**
 * Sidebar de navegação para a Dashboard do Cliente.
 * Contém links para as principais seções que um cliente acessaria.
 */
export default function ClientSidebar() {
    return (
        <aside className="client-sidebar">
            <div className="sidebar-header">
                {/* Você pode colocar um logo ou nome da empresa aqui */}
                <h2>PH TEAM</h2>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/cliente/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <i className="fas fa-home"></i> Visão Geral
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/cliente/treino" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <i className="fas fa-dumbbell"></i> Meu Treino
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/cliente/dieta" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <i className="fas fa-utensils"></i> Minha Dieta
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/cliente/progresso" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <i className="fas fa-chart-line"></i> Meu Progresso
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/cliente/consultor" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <i className="fas fa-comments"></i> Consultor
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/cliente/configuracoes" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <i className="fas fa-cog"></i> Configurações
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                {/* Informações adicionais ou link de logout */}
                <button 
                    className="btn-logout" 
                    onClick={() => {
                        localStorage.removeItem('jwt_token');
                        localStorage.removeItem('user_role');
                        window.location.href = '/login'; // Redireciona para o login de forma "forçada"
                    }}
                >
                    <i className="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </aside>
    );
}