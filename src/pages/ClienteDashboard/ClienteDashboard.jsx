import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from '../../components/sidebars/ClientSidebar'
import '../../components/layouts/ClientLayout/ClientLayout.css'
import './ClienteDashboard.css'

// URL de uma rota protegida de cliente para buscar dados.
// EX: Uma API que retorna os dados do cliente logado.
const PROTECTED_API_URL = 'http://localhost:8080/api/clientes/meu-perfil'; 

/**
 * Componente principal da Dashboard do Cliente.
 * Apresenta uma visão geral personalizada, acompanhamento de progresso e acesso rápido a funcionalidades.
 * Inclui uma verificação inicial de autenticação via JWT para garantir acesso.
 */
export default function ClienteDashboard() {
    const navigate = useNavigate();
    const [clienteNome, setClienteNome] = useState('Cliente');
    const [loading, setLoading] = useState(true);
    const [perfilData, setPerfilData] = useState(null); // Dados do perfil do cliente da API
    const [errorMessage, setErrorMessage] = useState(null); // Para exibir erros
    const [successMessage, setSuccessMessage] = useState(null); // Para exibir sucessos

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const role = localStorage.getItem('user_role');

        // 1. Verificação de Autenticação e Autorização (Temporária, será melhorada com AuthContext)
        if (!token || role !== 'Cliente') {
            setErrorMessage('Acesso não autorizado. Faça login como Cliente.');
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_role');
            setTimeout(() => navigate('/login'), 3000); // Delay para mostrar mensagem
            return;
        }

        // 2. Requisição Protegida para Obter os Dados do Cliente
        const fetchPerfil = async () => {
            try {
                const response = await fetch(PROTECTED_API_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envio do JWT para a rota protegida
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPerfilData(data);
                    // Assume que 'data.nome' está disponível e é uma string
                    setClienteNome(data.nome ? data.nome.split(' ')[0] : 'Cliente'); 
                } else if (response.status === 401 || response.status === 403) {
                    // Token inválido, expirado ou usuário sem permissão
                    setErrorMessage('Sessão expirada ou acesso negado. Faça login novamente.');
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('user_role');
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    const errorDetails = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
                    setErrorMessage(`Erro ao carregar perfil: ${errorDetails.message || response.statusText}`);
                    console.error('Erro ao carregar perfil:', response.status, errorDetails);
                }
            } catch (err) {
                setErrorMessage('Erro de conexão com o servidor. Tente novamente mais tarde.');
                console.error('Erro de rede:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, [navigate]); // navigate como dependência para o hook useEffect

    // Exibição de estado de carregamento ou erro
    if (loading) {
        return <div className="loading-screen">Carregando Dashboard...</div>;
    }

    if (errorMessage) {
        return (
            <div className="client-page-layout">
                <ClientSidebar />
                <div className="client-main-content">
                    <div className="dashboard-container">
                        <div className="message error-message">
                            <i className="fas fa-exclamation-triangle"></i>
                            {errorMessage}
                        </div>
                        <button className="btn-primary" onClick={() => window.location.reload()}>Recarregar</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="client-page-layout">
            <ClientSidebar /> {/* Componente de barra lateral do cliente */}

            <div className="client-main-content">
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <h1>👋 Bem-vindo(a) de volta, {clienteNome}!</h1>
                        <p>Aqui você acompanha seu progresso, planos e interage com seu consultor.</p>
                    </div>

                    {successMessage && (
                        <div className="message success-message">
                            <i className="fas fa-check-circle"></i>
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="message error-message">
                            <i className="fas fa-exclamation-triangle"></i>
                            {errorMessage}
                        </div>
                    )}

                    {/* -------------------- MÉTRICAS RÁPIDAS DO CLIENTE -------------------- */}
                    <div className="metrics-summary">
                        <div className="metric-box dashboard-metric">
                            <i className="fas fa-clipboard-list icon-primary"></i> {/* Ícone de treino */}
                            <span className="value">Treino Ativo</span>
                            <span className="label">Foco: {perfilData?.objetivo || 'Não definido'}</span>
                        </div>
                        <div className="metric-box dashboard-metric">
                            <i className="fas fa-weight-handing icon-blue"></i> {/* Ícone de peso */}
                            <span className="value">{perfilData?.pesoAtual ? `${perfilData.pesoAtual} kg` : 'N/A'}</span>
                            <span className="label">Seu Peso Atual</span>
                        </div>
                        <div className="metric-box dashboard-metric">
                            <i className="fas fa-chart-line icon-green"></i> {/* Ícone de progresso */}
                            <span className="value">3.5kg</span> {/* Exemplo, vindo da API */}
                            <span className="label">Ganho/Perda Recente</span>
                        </div>
                        <div className="metric-box dashboard-metric alert">
                            <i className="fas fa-bell icon-warning"></i> {/* Ícone de aviso */}
                            <span className="value">1</span> 
                            <span className="label">Feedback Pendente</span>
                        </div>
                    </div>

                    {/* -------------------- MÓDULOS DE CONTEÚDO -------------------- */}
                    <div className="client-modules-grid">
                        {/* MÓDULO: SEU PLANO DE TREINO */}
                        <div className="module-card">
                            <h3><i className="fas fa-dumbbell"></i> Meu Plano de Treino</h3>
                            <p>Plano atual: **{perfilData?.objetivo || 'Personalizado'}**</p>
                            <p>Próximo Treino: **Perna e Glúteo (Dia 1)**</p>
                            <button className="btn-module-access">Acessar Treino</button>
                        </div>

                        {/* MÓDULO: ACOMPANHAMENTO DA DIETA */}
                        <div className="module-card">
                            <h3><i className="fas fa-utensils"></i> Minha Dieta</h3>
                            <p>Objetivo: **{perfilData?.objetivo === 'emagrecimento' ? 'Déficit Calórico' : 'Ganho de Massa'}**</p>
                            <p>Última atualização: 10/11/2025</p>
                            <button className="btn-module-access secondary">Ver Dieta Detalhada</button>
                        </div>

                        {/* MÓDULO: COMUNICAÇÃO COM O CONSULTOR */}
                        <div className="module-card">
                            <h3><i className="fas fa-comments"></i> Falar com o Consultor</h3>
                            <p>Nome: João Gomes</p>
                            <p>Status: Online</p>
                            <button className="btn-module-access primary">Enviar Mensagem</button>
                        </div>
                    </div>
                    
                    {/* -------------------- AÇÕES RÁPIDAS -------------------- */}
                    <div className="quick-access-section">
                        <h2><i className="fas fa-running"></i> Ações Rápidas</h2>
                        <div className="quick-action-cards">
                            <button className="quick-card">
                                <i className="fas fa-chart-line"></i>
                                <span>Registrar Progresso</span>
                            </button>
                            <button className="quick-card">
                                <i className="fas fa-calendar-alt"></i>
                                <span>Meu Calendário</span>
                            </button>
                            <button className="quick-card" onClick={() => {
                                localStorage.removeItem('jwt_token');
                                localStorage.removeItem('user_role');
                                navigate('/login');
                            }}>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Sair da Conta</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}