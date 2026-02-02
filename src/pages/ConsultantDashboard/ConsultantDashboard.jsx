import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConsultantSidebar from '../../components/sidebars/ConsultantSidebar'
import * as consultorService from '../../services/consultorService'
import * as clienteService from '../../services/clienteService'
import { buscarTodosObjetivos } from '../../services/objetivoService'
import { buscarTodasFichasSemPaginacao, criarFicha, atualizarFicha } from '../../services/fichaService'
import '../../components/layouts/ConsultantLayout/ConsultantLayout.css'
import './ConsultantDashboard.css'

export default function ConsultantDashboard() {

  // -------------------- ESTADOS --------------------
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [newPeso, setNewPeso] = useState('')
  const [newAltura, setNewAltura] = useState('')
  const [objetivosDisponiveis, setObjetivosDisponiveis] = useState([])
  const [selectedObjetivoModal, setSelectedObjetivoModal] = useState('')
  const [objetivosError, setObjetivosError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // -------------------- BUSCA NO BACKEND --------------------
  // Função para carregar objetivos (disponível para retry)
  const loadObjetivos = async () => {
    try {
      setObjetivosError(null)
      const objs = await buscarTodosObjetivos(0, 1000)
      const lista = Array.isArray(objs) ? objs : objs
      setObjetivosDisponiveis(lista)
    } catch (e) {
      console.error('Erro ao carregar objetivos:', e)
      setObjetivosError(e.message || 'Erro ao carregar objetivos')
    }
  }

  useEffect(() => {
    // Verifica autenticação/role mínima para acessar o dashboard do consultor
    const token = localStorage.getItem('jwt_token')
    const role = localStorage.getItem('user_role')
    if (!token || role !== 'Consultor') {
      setErrorMessage('Acesso não autorizado. Faça login como Consultor.')
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('user_role')
      setTimeout(() => navigate('/login'), 1500)
      setLoading(false)
      return
    }

    const buscarClientes = async () => {
      try {
        const data = await consultorService.buscarMeusClientes()
        setClients(data || [])
        setLoading(false)
      } catch (err) {
        console.error('Erro ao buscar clientes:', err)
        setErrorMessage('Erro ao carregar clientes. Verifique sua conexão.')
        setLoading(false)
      }
    }

    buscarClientes()
    loadObjetivos()
  }, [navigate])

  // -------------------- FUNÇÕES PARA MODAL --------------------
  const openEditModal = (client) => {
    setSelectedClient(client)
    setNewPeso(client.pesoAtual || '')
    setNewAltura(client.altura || '')
    setSelectedObjetivoModal(client.objetivo || '')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedClient(null)
    setNewPeso('')
    setNewAltura('')
  }

  const handleUpdateClient = async () => {
    if (!selectedClient) return

    try {
      const clienteData = {
        pesoAtual: parseFloat(newPeso),
        altura: parseFloat(newAltura)
      }

      await clienteService.atualizarCliente(selectedClient.id, clienteData)

      // Atualiza objetivo via ficha (backend guarda objetivo na ficha)
      try {
        const fichas = await buscarTodasFichasSemPaginacao()
        const listaFichas = Array.isArray(fichas) ? fichas : fichas
        const fichaDoCliente = listaFichas.find(f => f.clienteId === selectedClient.id)
        if (fichaDoCliente) {
          await atualizarFicha(fichaDoCliente.id, { id: fichaDoCliente.id, nome: fichaDoCliente.nome || 'Ficha', objetivo: selectedObjetivoModal })
        } else {
          await criarFicha({ nome: 'Ficha', objetivo: selectedObjetivoModal, clienteId: selectedClient.id })
        }
      } catch (e) {
        console.error('Erro ao salvar objetivo na ficha:', e)
      }

      // Atualizar a lista de clientes localmente (peso/altura/objetivo)
      setClients(clients.map(c => c.id === selectedClient.id ? { ...c, ...clienteData, objetivo: selectedObjetivoModal || c.objetivo } : c))
      closeModal()
      setSuccessMessage('Cliente atualizado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      setErrorMessage(`Erro ao atualizar cliente: ${error.message}`)
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  // -------------------- MÉTRICAS --------------------
  const totalClientes = clients.length
  const clientesAtivos = clients.length // ajuste quando tiver status
  const renovacoesVencendo = 0 // placeholder até existir no backend

  // -------------------- FILTRAGEM DE CLIENTES --------------------
  const filteredClients = clients.filter(client =>
    client.nome && client.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

// -------------------- FUNÇÃO WHATSAPP --------------------
  const openWhatsApp = (telefone, nome) => {
  if (!telefone) {
    setErrorMessage('Cliente não possui telefone cadastrado.')
    setTimeout(() => setErrorMessage(''), 4000)
    return
  }

  // Remove tudo que não for número
  const numeroLimpo = telefone.replace(/\D/g, '')

  // Garante que tenha o código do Brasil
  const numeroComCodigo = numeroLimpo.startsWith('55')
    ? numeroLimpo
    : `55${numeroLimpo}`

  const mensagem = encodeURIComponent(`Olá ${nome}, tudo bem? Sou seu consultor e estou entrando em contato sobre seus treinos 💪`)

  const url = `https://wa.me/${numeroComCodigo}?text=${mensagem}`

  window.open(url, '_blank')
}


  // -------------------- RENDER --------------------
  return (
    <div className="consultant-page-layout">
      <ConsultantSidebar />

      <div className="consultant-main-content">
        <div className="dashboard-container">

          <div className="dashboard-header">
            <h1>Bem-vindo(a), Consultor(a)!</h1>
            <p>Visão geral e gerenciamento dos seus clientes.</p>
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

          {/* -------------------- MÉTRICAS -------------------- */}
          <div className="metrics-summary">
            <div className="metric-box dashboard-metric">
              <i className="fas fa-users icon-red"></i>
              <span className="value">{totalClientes}</span>
              <span className="label">Total de Clientes</span>
            </div>

            <div className="metric-box dashboard-metric">
              <i className="fas fa-check-circle icon-green"></i>
              <span className="value">{clientesAtivos}</span>
              <span className="label">Clientes Ativos</span>
            </div>

            <div className="metric-box dashboard-metric alert">
              <i className="fas fa-exclamation-triangle icon-yellow"></i>
              <span className="value">{renovacoesVencendo}</span>
              <span className="label">Renovações Vencendo</span>
            </div>

            <div className="metric-box dashboard-metric">
              <i className="fas fa-dumbbell icon-blue"></i>
              <span className="value">0</span>
              <span className="label">Treinos Criados</span>
            </div>
          </div>

          {/* -------------------- LISTA DE CLIENTES -------------------- */}
          <div className="client-management-section">
            <div className="section-header">
              <h2><i className="fas fa-list-alt"></i> Lista de Clientes</h2>
              <button className="btn-primary">
                <i className="fas fa-user-plus"></i> Novo Cliente
              </button>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar cliente por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="table-responsive">
              {loading ? (
                <p>Carregando clientes...</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Objetivo</th>
                      <th>Peso Atual (kg)</th>
                      <th>Altura (m)</th>
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {clients.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                          Nenhum cliente vinculado.
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map(client => (
                        <tr key={client.id}>

                          {/* CLIENTE */}
                          <td data-label="Cliente">
                            <div className="client-info">
                              <div className="avatar">
                                {(client.nome || 'U').charAt(0).toUpperCase()}
                              </div>
                              <span className="client-name">
                                {client.nome || 'Cliente'}
                              </span>
                            </div>
                          </td>

                          {/* OBJETIVO */}
                          <td data-label="Objetivo">
                            <span className={`badge-objetivo ${(client.objetivo || '').toLowerCase().replace(/\s+/g, '-')}`}>
                              {client.objetivo || 'Não definido'}
                            </span>
                          </td>

                          {/* PESO */}
                          <td data-label="Peso Atual">
                            {client.pesoAtual ? `${client.pesoAtual} kg` : '—'}
                          </td>

                          {/* ALTURA */}
                          <td data-label="Altura">
                            {client.altura ? `${client.altura} m` : '—'}
                          </td>

                          {/* AÇÕES */}
                          <td data-label="Ações" className="action-cell">
                            <button
                              className="btn-icon edit-btn"
                              title="Editar Peso, Altura e Objetivo"
                              onClick={() => openEditModal(client)}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>

                            <button
                              className="btn-icon whatsapp-btn"
                              title="Contatar"
                              onClick={() => openWhatsApp(client.telefone, client.nome)}
                            >
                              <i className="fab fa-whatsapp"></i>
                            </button>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* -------------------- AÇÕES RÁPIDAS -------------------- */}
          <div className="quick-access-section">
            <h2><i className="fas fa-running"></i> Ações Rápidas</h2>

            <div className="quick-action-cards">
              <button className="quick-card">
                <i className="fas fa-clipboard-list"></i>
                <span>Montar Nova Ficha</span>
              </button>

              <button className="quick-card">
                <i className="fas fa-chart-bar"></i>
                <span>Ver Relatórios</span>
              </button>

              <button className="quick-card">
                <i className="fas fa-bell"></i>
                <span>Ver Feedbacks</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* -------------------- MODAL DE EDIÇÃO -------------------- */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Editar {selectedClient?.nome}</h3>
            <div className="modal-body">
              <label>
                Peso Atual (kg):
                <input
                  type="number"
                  value={newPeso}
                  onChange={(e) => setNewPeso(e.target.value)}
                  step="0.1"
                />
              </label>
              <label>
                Altura (m):
                <input
                  type="number"
                  value={newAltura}
                  onChange={(e) => setNewAltura(e.target.value)}
                  step="0.01"
                />
              </label>
              <label>
                Objetivo:
                <select value={selectedObjetivoModal} onChange={(e) => setSelectedObjetivoModal(e.target.value)}>
                  <option value="">-- Selecionar objetivo --</option>
                  {objetivosDisponiveis.map(o => (
                    <option key={o.id} value={o.tipo || o.descricao}>
                      {o.tipo ? `${o.tipo} — ${o.descricao}` : o.descricao}
                    </option>
                  ))}
                </select>
              </label>
              {objetivosError && (
                <div className="error" style={{marginTop:8}}>
                  Erro ao carregar objetivos: {objetivosError}
                  <button className="btn-alert" style={{marginLeft:8}} onClick={loadObjetivos}>Tentar novamente</button>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={closeModal}>Cancelar</button>
              <button onClick={handleUpdateClient}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
