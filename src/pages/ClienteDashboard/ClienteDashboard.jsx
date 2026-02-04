import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from '../../components/sidebars/ClientSidebar'
import '../../components/layouts/ClientLayout/ClientLayout.css'
import './ClienteDashboard.css'
import { buscarTodosObjetivos } from '../../services/objetivoService'
import { buscarTodasFichasSemPaginacao, criarFicha, atualizarFicha } from '../../services/fichaService'
import { apiGet } from '../../services/apiConfig'

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
    const [objetivosDisponiveis, setObjetivosDisponiveis] = useState([])
    const [ficha, setFicha] = useState(null)
    const [selectedObjetivo, setSelectedObjetivo] = useState(null)
    const [objetivosError, setObjetivosError] = useState(null)

        const TIPO_OBJETIVO_LABELS = {
            EMAGRECIMENTO: 'Emagrecimento',
            HIPERTROFIA: 'Hipertrofia',
            GANHAR_MASSA: 'Ganho de Massa',
            RECONDICIONAMENTO: 'Recondicionamento',
            SAUDE_GERAL: 'Saúde Geral',
        }

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const role = localStorage.getItem('user_role');

        // 1. Verificação de Autenticação e Autorização
        if (!token || role !== 'Cliente') {
            setErrorMessage('Acesso não autorizado. Faça login como Cliente.');
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_role');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        // 2. Requisição Protegida para Obter os Dados do Cliente
        const fetchPerfil = async () => {
            try {
                const data = await apiGet('/clientes/meu-perfil');
                setPerfilData(data);
                // Extrai o primeiro nome do cliente
                setClienteNome(data.nome ? data.nome.split(' ')[0] : 'Cliente');
            } catch (err) {
                if (err.message && err.message.includes('401')) {
                    setErrorMessage('Sessão expirada ou acesso negado. Faça login novamente.');
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('user_role');
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setErrorMessage('Erro de conexão com o servidor. Tente novamente mais tarde.');
                    console.error('Erro de rede:', err);
                }
            } finally {
                setLoading(false);
            }
        };

                fetchPerfil();

        
    }, [navigate]);

    // Após carregar o perfil, buscar objetivos e fichas para o cliente
    useEffect(() => {
        if (!perfilData) return;

        const loadObjetivosEFicha = async () => {
            try {
                setObjetivosError(null)
                const objs = await buscarTodosObjetivos(0, 1000)
                const listaObjs = Array.isArray(objs) ? objs : objs.content || objs
                console.log('Objetivos carregados:', listaObjs)
                setObjetivosDisponiveis(listaObjs)

                const fichas = await buscarTodasFichasSemPaginacao()
                const listaFichas = Array.isArray(fichas) ? fichas : fichas
                console.log('Fichas carregadas:', listaFichas)
                const minhaFicha = listaFichas.find(f => f.clienteId === perfilData.id)
                console.log('Minha ficha encontrada:', minhaFicha)
                if (minhaFicha) {
                    setFicha(minhaFicha)
                    setSelectedObjetivo(minhaFicha.objetivo || null)
                    console.log('Objetivo selecionado:', minhaFicha.objetivo)
                }
            } catch (e) {
                console.error('Erro ao carregar objetivos/fichas:', e)
                setObjetivosError(e.message || 'Erro ao carregar objetivos')
            }
        }

        loadObjetivosEFicha()
    }, [perfilData])

        // Quando perfilData é carregado, reprocura ficha do cliente se não encontrada
        useEffect(() => {
            const ensureFicha = async () => {
                if (!perfilData || ficha) return
                try {
                    const fichas = await buscarTodasFichasSemPaginacao()
                    const listaFichas = Array.isArray(fichas) ? fichas : fichas
                    const minhaFicha = listaFichas.find(f => f.clienteId === perfilData.id)
                    if (minhaFicha) {
                        setFicha(minhaFicha)
                        setSelectedObjetivo(minhaFicha.objetivo || null)
                    }
                } catch (e) {
                    console.error('Erro ao garantir ficha:', e)
                }
            }
            ensureFicha()
        }, [perfilData, ficha])

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
                        <div className="header-content">
                            <div className="header-text">
                                <h1>Bem-vindo(a), {clienteNome}!</h1>
                                <p>Seu espaço para acompanhar progresso, planos e comunicação com seu consultor</p>
                            </div>
                            <button 
                              className="btn-voltar-home"
                              onClick={() => navigate('/')}
                              title="Voltar para página inicial"
                            >
                              Voltar para Home
                            </button>
                        </div>
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
                        <div className="metric-box">
                            <div className="metric-icon">
                                <i className="fas fa-bullseye"></i>
                            </div>
                            <div className="metric-content">
                                <span className="metric-label">Seu Objetivo</span>
                                <span className="metric-value">{(TIPO_OBJETIVO_LABELS[selectedObjetivo] || TIPO_OBJETIVO_LABELS[perfilData?.objetivo] || selectedObjetivo || perfilData?.objetivo) || 'Não definido'}</span>
                            </div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-icon">
                                <i className="fas fa-weight"></i>
                            </div>
                            <div className="metric-content">
                                <span className="metric-label">Peso Atual</span>
                                <span className="metric-value">{perfilData?.pesoAtual ? `${perfilData.pesoAtual.toFixed(1)} kg` : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-icon">
                                <i className="fas fa-ruler-vertical"></i>
                            </div>
                            <div className="metric-content">
                                <span className="metric-label">Altura</span>
                                <span className="metric-value">{perfilData?.altura ? `${perfilData.altura.toFixed(2)} m` : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-icon">
                                <i className="fas fa-phone"></i>
                            </div>
                            <div className="metric-content">
                                <span className="metric-label">Telefone</span>
                                <span className="metric-value">{perfilData?.telefone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* ALERTA: Objetivo não definido */}
                                        {!selectedObjetivo && !perfilData?.objetivo && (
                        <div className="alert-banner warning">
                            <i className="fas fa-exclamation-circle"></i>
                            <div>
                                <strong>Objetivo não configurado!</strong>
                                <p>Configure seu objetivo para receber recomendações personalizadas de treino e dieta.</p>
                            </div>
                            <button className="btn-alert" onClick={() => navigate('/configuracoes')}>
                                Configurar Objetivo
                            </button>
                        </div>
                    )}

                                        {/* Se houver objetivos no backend, permitir escolher aqui */}
                                        {objetivosDisponiveis && objetivosDisponiveis.length > 0 && (
                                            <div className="objetivo-selector">
                                                <h3>Escolher Objetivo</h3>
                                                <div className="selector-row">
                                                    <select value={selectedObjetivo || ''} onChange={(e) => setSelectedObjetivo(e.target.value)}>
                                                        <option value="">-- Selecionar objetivo --</option>
                                                        {objetivosDisponiveis.map(o => (
                                                        <option key={o.id} value={o.tipo || o.descricao}>
                                                            {o.tipo ? `${TIPO_OBJETIVO_LABELS[o.tipo] || o.tipo} — ${o.descricao}` : o.descricao}
                                                        </option>
                                                        ))}
                                                    </select>
                                                    <button className="btn-selector-save" onClick={async () => {
                                                            try {
                                                                if (ficha && ficha.id) {
                                                                    // Enviamos id, nome e objetivo no body
                                                                    await atualizarFicha(ficha.id, { 
                                                                        id: ficha.id,
                                                                        nome: ficha.nome || 'Minha Ficha', 
                                                                        objetivo: selectedObjetivo 
                                                                    })
                                                                    setSuccessMessage('Objetivo atualizado com sucesso')
                                                                    // atualizar localmente
                                                                    setFicha(prev => ({ ...prev, objetivo: selectedObjetivo }))
                                                                } else {
                                                                    const novo = await criarFicha({ nome: 'Minha Ficha', objetivo: selectedObjetivo, clienteId: perfilData.id })
                                                                    setFicha(novo)
                                                                    setSuccessMessage('Ficha criada e objetivo definido')
                                                                }
                                                            } catch (e) {
                                                                console.error('Erro ao salvar objetivo na ficha:', e)
                                                                setErrorMessage(e.message || 'Erro ao salvar objetivo')
                                                            }
                                                            setTimeout(() => setSuccessMessage(null), 3000)
                                                        }}>Salvar</button>
                                                </div>
                                                                                                {objetivosError && (
                                                                                                    <div className="error" style={{marginTop:8}}>
                                                                                                        Erro ao carregar objetivos: {objetivosError}
                                                                                                        <button className="btn-alert" style={{marginLeft:8}} onClick={async () => {
                                                                                                            setObjetivosError(null)
                                                                                                            try {
                                                                                                                const objs = await buscarTodosObjetivos(0,1000)
                                                                                                                setObjetivosDisponiveis(Array.isArray(objs) ? objs : objs.content || objs)
                                                                                                            } catch (err) {
                                                                                                                setObjetivosError(err.message || 'Erro ao carregar objetivos')
                                                                                                            }
                                                                                                        }}>Tentar novamente</button>
                                                                                                    </div>
                                                                                                )}
                                                                                        </div>
                                        )}

                    {/* -------------------- MÓDULOS DE CONTEÚDO -------------------- */}
                    <div className="client-modules-grid">
                        {/* MÓDULO: SEU PLANO DE TREINO */}
                        <div className="module-card training-module">
                            <div className="module-header">
                                <div className="module-icon">
                                    <i className="fas fa-dumbbell"></i>
                                </div>
                                <h3>Meu Plano de Treino</h3>
                            </div>
                            <div className="module-info">
                                <div className="info-item">
                                    <span className="info-label">Objetivo</span>
                                    <span className="info-value">{ficha?.objetivo || selectedObjetivo || perfilData?.objetivo || 'Não configurado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Frequência</span>
                                    <span className="info-value">{perfilData?.frequenciaSemanal || '4x por semana'}</span>
                                </div>
                            </div>
                            <button 
                              className="btn-module-access"
                              onClick={() => navigate('cliente/treino')}
                            >
                              Ver Meu Treino
                            </button>
                        </div>

                        {/* MÓDULO: COMUNICAÇÃO COM O CONSULTOR */}
                        <div className="module-card contact-module">
                            <div className="module-header">
                                <div className="module-icon">
                                    <i className="fas fa-comments"></i>
                                </div>
                                <h3>Contato com Consultor</h3>
                            </div>
                            <div className="module-info">
                                <div className="info-item">
                                    <span className="info-label">Atendimento</span>
                                    <span className="info-value">Seg-Sex 09:00 - 18:00</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Via</span>
                                    <span className="info-value">WhatsApp</span>
                                </div>
                            </div>
                            <button 
                              className="btn-module-access primary"
                              onClick={() => {
                                const numeroConsultor = '5575921792320'
                                const mensagem = encodeURIComponent('Olá, gostaria de falar com meu consultor!')
                                window.open(`https://wa.me/?text=${mensagem}`, '_blank')
                              }}
                            >
                              Enviar Mensagem
                            </button>
                        </div>
                    </div>
                    
                    {/* -------------------- AÇÕES RÁPIDAS -------------------- */}
                    <div className="quick-access-section">
                        <h2>Ações Rápidas</h2>
                        <div className="quick-action-cards">
                            <button 
                              className="quick-card training-card"
                              onClick={() => navigate('/cliente/treino')}
                            >
                                <div className="quick-card-icon">
                                    <i className="fas fa-dumbbell"></i>
                                </div>
                                <span>Meu Treino</span>
                            </button>
                            <button 
                              className="quick-card progress-card"
                              onClick={() => navigate('/cliente/progresso')}
                            >
                                <div className="quick-card-icon">
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <span>Progresso</span>
                            </button>
                            <button 
                              className="quick-card consultant-card"
                              onClick={() => {
                                const numeroConsultor = '5575921792320'
                                const mensagem = encodeURIComponent('Olá, gostaria de falar com meu consultor!')
                                window.open(`https://wa.me/?text=${mensagem}`, '_blank')
                              }}
                            >
                                <div className="quick-card-icon">
                                    <i className="fas fa-comments"></i>
                                </div>
                                <span>Consultor</span>
                            </button>
                            <button 
                              className="quick-card settings-card"
                              onClick={() => navigate('/cliente/configuracoes')}
                            >
                                <div className="quick-card-icon">
                                    <i className="fas fa-cog"></i>
                                </div>
                                <span>Configurações</span>
                            </button>
                            <button 
                              className="quick-card logout-card"
                              onClick={() => {
                                localStorage.removeItem('jwt_token');
                                localStorage.removeItem('user_role');
                                localStorage.removeItem('user_email');
                                localStorage.removeItem('user_id');
                                navigate('/login');
                            }}
                            >
                                <div className="quick-card-icon">
                                    <i className="fas fa-sign-out-alt"></i>
                                </div>
                                <span>Sair</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}