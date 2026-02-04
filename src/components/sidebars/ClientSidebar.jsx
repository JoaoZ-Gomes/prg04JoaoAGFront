import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../layouts/ClientLayout/ClientLayout.css'

/**
 * Sidebar de navegação para a Dashboard do Cliente.
 * Contém links para as principais seções que um cliente acessaria.
 */
export default function ClientSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const closeSidebar = () => setSidebarOpen(false);

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
            <aside className={`client-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h2>PH TEAM</h2>
                <button 
                    className="sidebar-close-btn"
                    onClick={closeSidebar}
                    aria-label="Fechar menu"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink 
                            to="/cliente/dashboard" 
                            end
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-home"></i> <span>Visão Geral</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/cliente/treino" 
                            end
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-dumbbell"></i> <span>Meu Treino</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink 
                            to="/cliente/progresso" 
                            end
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-chart-line"></i> <span>Meu Progresso</span>
                        </NavLink>
                    </li>
                    {/* Consultor tab removed per request */}
                    <li>
                        <NavLink 
                            to="/cliente/configuracoes" 
                            end
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-cog"></i> <span>Configurações</span>
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
        </>
    );
}