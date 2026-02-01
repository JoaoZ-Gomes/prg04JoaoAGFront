import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientSidebar from '../../components/sidebars/ClientSidebar'
import * as clienteService from '../../services/clienteService'
import * as authService from '../../services/authService'
import '../../components/layouts/ClientLayout/ClientLayout.css'
import './Configuracoes.css'

export default function Configuracoes() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  const [profile, setProfile] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    pesoAtual: '',
    altura: '',
  })

  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    mealReminders: true,
    progressUpdates: false,
    consultantMessages: true
  })

  // Carregar dados do cliente ao montar
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const cliente = await clienteService.buscarMeuPerfil()
        
        setProfile({
          nome: cliente.nome || '',
          email: cliente.email || '',
          telefone: cliente.telefone || '',
          dataNascimento: cliente.dataNascimento || '',
          pesoAtual: cliente.pesoAtual || '',
          altura: cliente.altura || '',
        })
        
        setLoading(false)
      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
        setError('Erro ao carregar perfil. Tente novamente.')
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setNotifications(prev => ({ ...prev, [name]: checked }))
  }

  const handleSave = async () => {
    try {
      setError(null)
      setSuccess(null)

      // Preparar dados para atualização
      const updateData = {
        pesoAtual: profile.pesoAtual ? parseFloat(profile.pesoAtual) : null,
        altura: profile.altura ? parseFloat(profile.altura) : null,
      }

      await clienteService.atualizarCliente(authService.getUserId(), updateData)

      setSuccess('Configurações salvas com sucesso!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Erro ao salvar:', err)
      setError(`Erro ao salvar: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="client-page-layout">
        <ClientSidebar />
        <div className="client-main-content">
          <div className="configuracoes-container">
            <p>Carregando configurações...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="client-page-layout">
      <ClientSidebar />
      <div className="client-main-content">
        <div className="configuracoes-container">
          <div className="configuracoes-header">
            <h1>Configurações</h1>
            <p>Gerencie seu perfil e preferências</p>
          </div>

          {error && <div className="error-message"><i className="fas fa-exclamation-triangle"></i>{error}</div>}
          {success && <div className="success-message"><i className="fas fa-check-circle"></i>{success}</div>}

          <div className="configuracoes-content">
            <div className="settings-section">
              <h2>Perfil Pessoal</h2>
              <form className="profile-form">
                <div className="form-group">
                  <label htmlFor="nome">Nome:</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={profile.nome}
                    onChange={handleProfileChange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefone">Telefone:</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={profile.telefone}
                    onChange={handleProfileChange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dataNascimento">Data de Nascimento:</label>
                  <input
                    type="date"
                    id="dataNascimento"
                    name="dataNascimento"
                    value={profile.dataNascimento}
                    onChange={handleProfileChange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="altura">Altura (m):</label>
                  <input
                    type="number"
                    id="altura"
                    name="altura"
                    step="0.01"
                    value={profile.altura}
                    onChange={handleProfileChange}
                    placeholder="1.75"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pesoAtual">Peso (kg):</label>
                  <input
                    type="number"
                    id="pesoAtual"
                    name="pesoAtual"
                    step="0.1"
                    value={profile.pesoAtual}
                    onChange={handleProfileChange}
                    placeholder="74.2"
                    disabled
                  />
                </div>
              </form>
            </div>

            <div className="settings-section">
              <h2>Notificações</h2>
              <div className="notifications-form">
                <div className="notification-item">
                  <input
                    type="checkbox"
                    id="workoutReminders"
                    name="workoutReminders"
                    checked={notifications.workoutReminders}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="workoutReminders">Lembretes de treino</label>
                </div>
                <div className="notification-item">
                  <input
                    type="checkbox"
                    id="mealReminders"
                    name="mealReminders"
                    checked={notifications.mealReminders}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="mealReminders">Lembretes de refeições</label>
                </div>
                <div className="notification-item">
                  <input
                    type="checkbox"
                    id="progressUpdates"
                    name="progressUpdates"
                    checked={notifications.progressUpdates}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="progressUpdates">Atualizações de progresso</label>
                </div>
                <div className="notification-item">
                  <input
                    type="checkbox"
                    id="consultantMessages"
                    name="consultantMessages"
                    checked={notifications.consultantMessages}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="consultantMessages">Mensagens do consultor</label>
                </div>
              </div>
            </div>

            <div className="settings-actions">
              <button 
                type="button"
                className="save-button" 
                onClick={handleSave}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}