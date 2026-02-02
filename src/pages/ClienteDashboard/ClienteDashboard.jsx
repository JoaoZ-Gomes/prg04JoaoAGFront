import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from '../../components/sidebars/ClientSidebar'
import '../../components/layouts/ClientLayout/ClientLayout.css'
import './ClienteDashboard.css'
import { buscarTodosObjetivos } from '../../services/objetivoService'
import { buscarTodasFichasSemPaginacao, criarFicha, atualizarFicha } from '../../services/fichaService'

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
                const response = await fetch('http://localhost:8080/api/clientes/meu-perfil', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPerfilData(data);
                    // Extrai o primeiro nome do cliente
                    setClienteNome(data.nome ? data.nome.split(' ')[0] : 'Cliente'); 
                } else if (response.status === 401 || response.status === 403) {
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

        
    }, [navigate]);

    // Após carregar o perfil, buscar objetivos e fichas para o cliente
    useEffect(() => {
        if (!perfilData) return;

        const loadObjetivosEFicha = async () => {
            try {
                setObjetivosError(null)
                const objs = await buscarTodosObjetivos(0, 1000)
                const listaObjs = Array.isArray(objs) ? objs : objs.content || objs
                setObjetivosDisponiveis(listaObjs)

                const fichas = await buscarTodasFichasSemPaginacao()
                const listaFichas = Array.isArray(fichas) ? fichas : fichas
                const minhaFicha = listaFichas.find(f => f.clienteId === perfilData.id)
                if (minhaFicha) {
                    setFicha(minhaFicha)
                    setSelectedObjetivo(minhaFicha.objetivo || null)
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
                        <h1>👋 Bem-vindo(a) de volta, {clienteNome}!</h1>
                        <p>Aqui você acompanha seu progresso, planos e interage com seu consultor.</p>
                        <button 
                          className="btn-voltar-home"
                          onClick={() => navigate('/')}
                          title="Voltar para página inicial"
                        >
                          ← Voltar para Home
                        </button>
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
                            <i className="fas fa-bullseye icon-primary"></i>
                            <span className="value">{(TIPO_OBJETIVO_LABELS[selectedObjetivo] || TIPO_OBJETIVO_LABELS[perfilData?.objetivo] || selectedObjetivo || perfilData?.objetivo) || '⚠️ Não definido'}</span>
                            <span className="label">Seu Objetivo</span>
                        </div>
                        <div className="metric-box dashboard-metric">
                            <i className="fas fa-weight icon-blue"></i>
                            <span className="value">{perfilData?.pesoAtual ? `${perfilData.pesoAtual.toFixed(1)} kg` : 'N/A'}</span>
                            <span className="label">Peso Atual</span>
                        </div>
                        <div className="metric-box dashboard-metric">
                            <i className="fas fa-ruler-vertical icon-green"></i>
                            <span className="value">{perfilData?.altura ? `${perfilData.altura.toFixed(2)} m` : 'N/A'}</span>
                            <span className="label">Sua Altura</span>
                        </div>
                        <div className="metric-box dashboard-metric">
                            <i className="fas fa-phone icon-warning"></i>
                            <span className="value">{perfilData?.telefone || 'N/A'}</span>
                            <span className="label">Telefone</span>
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
                                                                    // Salvamos o ENUM (tipo) na propriedade objetivo da ficha
                                                                    await atualizarFicha(ficha.id, { id: ficha.id, nome: ficha.nome || 'Minha Ficha', objetivo: selectedObjetivo })
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
                        <div className="module-card">
                            <h3><i className="fas fa-dumbbell"></i> Meu Plano de Treino</h3>
                            <p>Objetivo: <strong>{perfilData?.objetivo || '⚠️ Não configurado'}</strong></p>
                            <p>Frequência Semanal: <strong>{perfilData?.frequenciaSemanal || '4x por semana'}</strong></p>
                            <button 
                              className="btn-module-access"
                              onClick={() => navigate('/treino')}
                            >
                              Acessar Meu Treino
                            </button>
                        </div>

                        {/* MÓDULO: ACOMPANHAMENTO DA DIETA */}
                        <div className="module-card">
                            <h3><i className="fas fa-utensils"></i> Minha Dieta</h3>
                            <p>Tipo de Dieta: <strong>{perfilData?.objetivo === 'emagrecimento' ? '📉 Hipocalórica' : perfilData?.objetivo === 'ganho' ? '📈 Hipercalórica' : perfilData?.objetivo ? '⚖️ Balanceada' : '⚠️ Não configurada'}</strong></p>
                            <p>Meta Calórica: <strong>{perfilData?.metaCalorica || '2000 kcal'}</strong></p>
                            <button 
                              className="btn-module-access secondary"
                              onClick={() => navigate('/dieta')}
                            >
                              Acessar Minha Dieta
                            </button>
                        </div>

                        {/* MÓDULO: COMUNICAÇÃO COM O CONSULTOR */}
                        <div className="module-card">
                            <h3><i className="fas fa-comments"></i> Falar com o Consultor</h3>
                            <p>Horário de Atendimento: <strong>{perfilData?.horarioAtendimento || 'Seg-Sex 09:00 - 18:00'}</strong></p>
                            <p>Último Contato: <strong>Hoje</strong></p>
                            <button 
                              className="btn-module-access primary"
                              onClick={() => {
                                const numeroConsultor = '5575921792320'
                                const mensagem = encodeURIComponent('Olá, gostaria de falar com meu consultor!')
                                window.open(`https://wa.me/?text=${mensagem}`, '_blank')
                              }}
                            >
                              Enviar Mensagem via WhatsApp
                            </button>
                        </div>
                    </div>
                    
                    {/* -------------------- AÇÕES RÁPIDAS -------------------- */}
                    <div className="quick-access-section">
                        <h2><i className="fas fa-running"></i> Ações Rápidas</h2>
                        <div className="quick-action-cards">
                            <button 
                              className="quick-card"
                              onClick={() => navigate('/progresso')}
                            >
                                <i className="fas fa-chart-line"></i>
                                <span>Registrar Progresso</span>
                            </button>
                            <button 
                              className="quick-card"
                              onClick={() => navigate('/configuracoes')}
                            >
                                <i className="fas fa-calendar-alt"></i>
                                <span>Configurações</span>
                            </button>
                            <button 
                              className="quick-card logout-btn"
                              onClick={() => {
                                localStorage.removeItem('jwt_token');
                                localStorage.removeItem('user_role');
                                localStorage.removeItem('user_email');
                                localStorage.removeItem('user_id');
                                navigate('/login');
                            }}
                            >
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