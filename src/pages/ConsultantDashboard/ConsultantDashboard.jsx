import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConsultantSidebar from '../../components/sidebars/ConsultantSidebar'
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
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // -------------------- BUSCA NO BACKEND --------------------
 useEffect(() => {
  const token = localStorage.getItem('jwt_token')
  console.log('Token obtido do localStorage:', token)

  fetch('http://localhost:8080/api/clientes', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      console.log('Status da resposta:', res.status)

      if (!res.ok) {
        return res.text().then(text => {
          console.log('Corpo do erro:', text)
          throw new Error(`Erro ${res.status}`)
        })
      }

      return res.json()
    })
    .then(data => {
      console.log('Resposta completa da API:', data)
      console.log('Clientes (content):', data.content)

      setClients(data.content) // 🔥 AQUI É O PONTO-CHAVE
      setLoading(false)
    })
    .catch(err => {
      console.error('Erro ao buscar clientes:', err)
      setLoading(false)
    })
}, [])

  // -------------------- FUNÇÕES PARA MODAL --------------------
  const openEditModal = (client) => {
    setSelectedClient(client)
    setNewPeso(client.pesoAtual || '')
    setNewAltura(client.altura || '')
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

    const token = localStorage.getItem('jwt_token')
    if (!token) {
      setErrorMessage('Token de autenticação não encontrado. Faça login novamente.')
      setTimeout(() => setErrorMessage(''), 5000)
      navigate('/login')
      return
    }

    console.log('Token usado na atualização:', token)
    console.log('ID do cliente:', selectedClient.id)
    console.log('Dados enviados:', { pesoAtual: parseFloat(newPeso), altura: parseFloat(newAltura) })

    try {
      const response = await fetch(`http://localhost:8080/api/clientes/${selectedClient.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pesoAtual: parseFloat(newPeso),
          altura: parseFloat(newAltura)
        })
      })

      console.log('Status da resposta:', response.status)
      console.log('Headers da resposta:', response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.log('Corpo do erro:', errorText)
        throw new Error(`Erro ${response.status}: ${errorText}`)
      }

      // Atualizar a lista de clientes localmente
      setClients(clients.map(c => c.id === selectedClient.id ? { ...c, pesoAtual: parseFloat(newPeso), altura: parseFloat(newAltura) } : c))
      closeModal()
      setSuccessMessage('Cliente atualizado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 5000) // Limpar após 5 segundos
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      setErrorMessage(`Erro ao atualizar cliente: ${error.message}`)
      setTimeout(() => setErrorMessage(''), 5000) // Limpar após 5 segundos
    }
  }

  // -------------------- MÉTRICAS --------------------
  const totalClientes = clients.length
  const clientesAtivos = clients.length // ajuste quando tiver status
  const renovacoesVencendo = 0 // placeholder até existir no backend

  // -------------------- RENDER --------------------
  return (
    <div className="consultant-page-layout">
      <ConsultantSidebar />

      <div className="consultant-main-content">
        <div className="dashboard-container">

          <div className="dashboard-header">
            <h1>Bem-vindo(a), Consultor(a)!</h1>
            <p>Visão geral e gerenciamento dos seus clientes.</p>
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
                        <td colSpan="5">Nenhum cliente vinculado.</td>
                      </tr>
                    ) : (
                      clients.map(client => (
                        <tr key={client.id}>
                          <td data-label="Cliente">
                            <div className="client-info">
                              <div className="avatar">{(client.nome || 'U').charAt(0).toUpperCase()}</div>
                              <span className="client-name">{client.nome || 'Cliente'}</span>
                            </div>
                          </td>
                          <td data-label="Objetivo">
                            <span className={`badge-objetivo ${(client.objetivo || '').toLowerCase().replace(' ', '-')}`}>
                              {client.objetivo || 'Não definido'}
                            </span>
                          </td>
                          <td data-label="Peso">{client.pesoAtual || '—'}</td>
                          <td data-label="Altura">{client.altura || '—'}</td>
                          <td data-label="Ações" className="action-cell">
                            <button className="btn-icon view-btn" title="Ver Perfil">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn-icon edit-btn" title="Editar Peso e Altura" onClick={() => openEditModal(client)}>
                              <i className="fas fa-pencil-alt"></i>
                            </button>
                            <button className="btn-icon whatsapp-btn" title="Contatar">
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
