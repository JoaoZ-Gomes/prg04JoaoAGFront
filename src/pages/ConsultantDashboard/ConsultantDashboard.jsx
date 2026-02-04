import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ConsultantSidebar from '../../components/sidebars/ConsultantSidebar'
import * as consultorService from '../../services/consultorService'
import * as clienteService from '../../services/clienteService'
import * as avaliacaoService from '../../services/avaliacaoService'
import { buscarTodosObjetivos } from '../../services/objetivoService'
import { buscarTodasFichasSemPaginacao, criarFicha, atualizarFicha } from '../../services/fichaService'
import '../../components/layouts/ConsultantLayout/ConsultantLayout.css'
import './ConsultantDashboard.css'

export default function ConsultantDashboard() {
  // -------- HOOKS DE NAVEGAÇÃO --------
  const navigate = useNavigate()
  const location = useLocation()

  // -------- ESTADOS --------
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('clients')
  const [avaliacoes, setAvaliacoes] = useState([])
  const [filterClientId, setFilterClientId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal editar cliente
  const [showModal, setShowModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [newPeso, setNewPeso] = useState('')
  const [newAltura, setNewAltura] = useState('')
  const [selectedObjetivoModal, setSelectedObjetivoModal] = useState('')
  
  // Modal avaliação
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false)
  const [avalPeso, setAvalPeso] = useState('')
  const [avalPercentual, setAvalPercentual] = useState('')
  const [avalObservacoes, setAvalObservacoes] = useState('')
  const [avaliacaoLoading, setAvaliacaoLoading] = useState(false)
  
  // Mensagens e validação
  const [objetivosDisponiveis, setObjetivosDisponiveis] = useState([])
  const [objetivosError, setObjetivosError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // -------- LOGICA DE SINCRONIZAÇÃO COM A URL (SIDEBAR) --------
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tab = queryParams.get('tab')

    if (tab === 'avaliacoes') {
      setActiveTab('avaliacoes')
      loadAvaliacoes()
    } else {
      setActiveTab('clients')
    }
  }, [location.search])

  // -------- CARREGAMENTO INICIAL --------
  useEffect(() => {
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

    const buscarDados = async () => {
      try {
        const data = await consultorService.buscarMeusClientes()
        setClients(data || [])
      } catch (err) {
        console.error('Erro ao buscar clientes:', err)
        setErrorMessage('Erro ao carregar clientes.')
      } finally {
        setLoading(false)
      }
    }

    buscarDados()
    loadObjetivos()
  }, [navigate])

  // -------- FUNÇÕES AUXILIARES --------
  const loadObjetivos = async () => {
    try {
      const objs = await buscarTodosObjetivos(0, 1000)
      const lista = Array.isArray(objs) ? objs : objs.content || []
      setObjetivosDisponiveis(lista)
    } catch (e) {
      setObjetivosError('Erro ao carregar objetivos')
    }
  }

  const loadAvaliacoes = async () => {
    setLoading(true)
    try {
      const data = await avaliacaoService.buscarAvaliacoesMeusClientes()
      setAvaliacoes(data || [])
    } catch (e) {
      console.error('Erro ao carregar avaliações:', e)
      setAvaliacoes([])
    } finally {
      setLoading(false)
    }
  }

  // -------- MODAIS --------
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
  }

  const closeAvaliacaoModal = () => {
    setShowAvaliacaoModal(false)
    setAvalPeso('')
    setAvalPercentual('')
    setAvalObservacoes('')
    if (activeTab !== 'avaliacoes') setSelectedClient(null)
  }

  // -------- HANDLERS (SUBMIT) --------
  const handleUpdateClient = async () => {
    try {
      const clienteData = { pesoAtual: parseFloat(newPeso), altura: parseFloat(newAltura) }
      await clienteService.atualizarCliente(selectedClient.id, clienteData)
      
      setClients(clients.map(c => c.id === selectedClient.id ? { ...c, ...clienteData, objetivo: selectedObjetivoModal } : c))
      setSuccessMessage('Cliente atualizado!')
      closeModal()
    } catch (error) {
      setErrorMessage('Erro ao atualizar.')
    }
  }

  const handleCriarAvaliacao = async () => {
    if (!selectedClient || !avalPeso || !avalPercentual) {
      setErrorMessage('Preencha os campos obrigatórios.')
      return
    }
    setAvaliacaoLoading(true)
    try {
      const payload = {
        clienteId: selectedClient.id,
        peso: parseFloat(avalPeso),
        percentualGordura: parseFloat(avalPercentual),
        observacoes: avalObservacoes.trim()
      }
      await avaliacaoService.criarAvaliacao(payload)
      setSuccessMessage('✅ Avaliação criada!')
      closeAvaliacaoModal()
      loadAvaliacoes()
    } catch (e) {
      setErrorMessage('Erro ao criar avaliação.')
    } finally {
      setAvaliacaoLoading(false)
    }
  }

  const openWhatsApp = (telefone, nome) => {
    if (!telefone) return alert('Telefone não cadastrado')
    const numero = telefone.replace(/\D/g, '')
    const url = `https://wa.me/55${numero}?text=Olá ${nome}, tudo bem?`
    window.open(url, '_blank')
  }

  const filteredClients = clients.filter(c => c.nome?.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="consultant-page-layout">
      <ConsultantSidebar />

      <div className="consultant-main-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Painel do Consultor</h1>
                <p>Gerenciamento de clientes e progresso</p>
              </div>
            </div>
            
            <div className="dashboard-tabs">
              <button className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => navigate('/consultor/dashboard')}>Clientes</button>
              <button className={`tab-btn ${activeTab === 'avaliacoes' ? 'active' : ''}`} onClick={() => navigate('/consultor/dashboard?tab=avaliacoes')}>Avaliações</button>
            </div>
          </div>

          {successMessage && <div className="message success-message">{successMessage}</div>}
          {errorMessage && <div className="message error-message">{errorMessage}</div>}

          {activeTab === 'clients' ? (
            <div className="client-management-section">
              <div className="search-container">
                <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
              </div>

              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Objetivo</th>
                      <th>Peso (kg)</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map(client => (
                      <tr key={client.id}>
                        <td>{client.nome}</td>
                        <td>{client.objetivo || 'N/A'}</td>
                        <td>{client.pesoAtual || '—'}</td>
                        <td className="action-cell">
                          <button className="btn-icon" onClick={() => openEditModal(client)}><i className="fas fa-pencil-alt"></i></button>
                          <button className="btn-icon" onClick={() => openWhatsApp(client.telefone, client.nome)}><i className="fab fa-whatsapp"></i></button>
                          <button className="btn-icon" onClick={() => { setSelectedClient(client); setShowAvaliacaoModal(true); }}><i className="fas fa-notes-medical"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="avaliacoes-section">
              <div className="section-header">
                <h2>Histórico de Avaliações</h2>
                <button className="btn-primary" onClick={() => setShowAvaliacaoModal(true)}>+ Nova Avaliação</button>
              </div>
              
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Data</th>
                      <th>Peso</th>
                      <th>% Gordura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avaliacoes.map(a => (
                      <tr key={a.id}>
                        <td>{a.clienteNome}</td>
                        <td>{new Date(a.dataAvaliacao).toLocaleDateString()}</td>
                        <td>{a.peso} kg</td>
                        <td>{a.percentualGordura}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL EDITAR CLIENTE */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Editar Cliente</h3>
            <div className="modal-body">
              <input type="number" placeholder="Peso" value={newPeso} onChange={e => setNewPeso(e.target.value)} />
              <input type="number" placeholder="Altura" value={newAltura} onChange={e => setNewAltura(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button onClick={closeModal}>Cancelar</button>
              <button onClick={handleUpdateClient}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AVALIAÇÃO */}
      {showAvaliacaoModal && (
        <div className="modal-overlay" onClick={closeAvaliacaoModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{selectedClient ? `Avaliar ${selectedClient.nome}` : 'Nova Avaliação'}</h3>
            <div className="modal-body">
              {!selectedClient && (
                <select onChange={(e) => setSelectedClient(clients.find(c => c.id === Number(e.target.value)))}>
                  <option value="">Selecione um cliente</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              )}
              <input type="number" placeholder="Peso (kg)" value={avalPeso} onChange={e => setAvalPeso(e.target.value)} />
              <input type="number" placeholder="% Gordura" value={avalPercentual} onChange={e => setAvalPercentual(e.target.value)} />
              <textarea placeholder="Observações" value={avalObservacoes} onChange={e => setAvalObservacoes(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button onClick={closeAvaliacaoModal}>Cancelar</button>
              <button onClick={handleCriarAvaliacao} disabled={avaliacaoLoading}>
                {avaliacaoLoading ? 'Salvando...' : 'Salvar Avaliação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}