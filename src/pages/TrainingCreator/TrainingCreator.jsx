import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ConsultantSidebar from '../../components/sidebars/ConsultantSidebar'
import * as fichaService from '../../services/fichaService'
import * as rotinaService from '../../services/rotinaService'
import * as exercicioService from '../../services/exercicioService'
import * as consultorService from '../../services/consultorService'
import '../../components/layouts/ConsultantLayout/ConsultantLayout.css'
import './TrainingCreator.css'

export default function TrainingCreator() {
  const location = useLocation()
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [exercises, setExercises] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGroup, setFilterGroup] = useState('Todos')
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedClientId, setSelectedClientId] = useState('')
  const [workoutRoutine, setWorkoutRoutine] = useState([])
  const [fichaName, setFichaName] = useState('')
  const [fichaObjetivo, setFichaObjetivo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Buscar clientes e exercícios do backend
  useEffect(() => {
    const loadData = async () => {
      try {
        // Buscar clientes do consultor
        const clientesData = await consultorService.buscarMeusClientes()
        setClients(clientesData || [])

        // Buscar todos os exercícios
        const exerciciosData = await exercicioService.buscarTodosExerciciosSemPaginacao()
        setExercises(exerciciosData || [])

        setLoading(false)
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setError('Erro ao carregar clientes e exercícios')
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSelectClient = (e) => {
    const clientId = e.target.value
    const client = clients.find(c => c.id === parseInt(clientId))
    setSelectedClientId(clientId)
    setSelectedClient(client?.nome || '')
  }

  const handleAddExercise = (exercise) => {
    // evita duplicar o mesmo exercício na ficha
    if (workoutRoutine.some(w => w.exercicioId === exercise.id)) return

    const newEntry = {
      exercicioId: exercise.id,
      exercicioNome: exercise.nome,
      series: 3,
      repeticoes: '10',
      _tempId: Date.now(),
    }
    setWorkoutRoutine(prev => [...prev, newEntry])
  }

  const handleUpdateExercise = (tempId, field, value) => {
    setWorkoutRoutine(
      workoutRoutine.map(item =>
        item._tempId === tempId ? { ...item, [field]: value } : item
      )
    )
  }

  const handleRemoveExercise = (tempId) => {
    setWorkoutRoutine(workoutRoutine.filter(item => item._tempId !== tempId))
  }

  const handleSubmitWorkout = async () => {
    if (!selectedClientId) {
      setError('Selecione um cliente!')
      return
    }

    if (!fichaName.trim()) {
      setError('Digite um nome para a ficha!')
      return
    }

    if (workoutRoutine.length === 0) {
      setError('Adicione pelo menos um exercício!')
      return
    }

    try {
      setError('')
      setSuccess('')

      // 1. Criar a ficha
      const fichaData = {
        nome: fichaName,
        objetivo: fichaObjetivo || 'Treino Geral',
        clienteId: parseInt(selectedClientId)
      }

      const fichaResponse = await fichaService.criarFicha(fichaData)
      const fichaId = fichaResponse.id

      // 2. Criar as rotinas para essa ficha
      for (const exercicio of workoutRoutine) {
        const rotinaData = {
          nome: exercicio.exercicioNome,
          fichaId: fichaId,
          exercicioId: exercicio.exercicioId,
          series: parseInt(exercicio.series),
          repeticoes: exercicio.repeticoes
        }

        await rotinaService.criarRotina(rotinaData)
      }

      setSuccess(`Ficha de treino criada com sucesso para ${selectedClient}!`)
      
      // Limpar formulário
      setTimeout(() => {
        setWorkoutRoutine([])
        setSelectedClient('')
        setSelectedClientId('')
        setFichaName('')
        setFichaObjetivo('')
        setSuccess('')
      }, 2000)

    } catch (err) {
      console.error('Erro ao salvar ficha:', err)
      setError(`Erro ao salvar ficha: ${err.message}`)
    }
  }

  return (
    <div className="consultant-page-layout">
      <ConsultantSidebar />

      <div className="consultant-main-content">
        <div className="creator-container">
          <div className="creator-header">
            <h1>Montar Nova Ficha de Treino</h1>
            <p>Selecione exercícios e personalize as configurações para o cliente.</p>
          </div>

          {error && <div className="error-message"><i className="fas fa-exclamation-triangle"></i>{error}</div>}
          {success && <div className="success-message"><i className="fas fa-check-circle"></i>{success}</div>}

          <div className="creator-selector-bar">
            <label htmlFor="client-select">Atribuir a:</label>
            <select
              id="client-select"
              value={selectedClientId}
              onChange={handleSelectClient}
              className="client-select-input"
            >
              <option value="">-- Selecione o Cliente --</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.nome}</option>
              ))}
            </select>

            <label htmlFor="ficha-name">Nome da Ficha:</label>
            <input
              id="ficha-name"
              type="text"
              value={fichaName}
              onChange={(e) => setFichaName(e.target.value)}
              placeholder="Ex: Ficha de Peito e Costas"
              className="ficha-input"
            />

            <label htmlFor="ficha-objetivo">Objetivo (Opcional):</label>
            <input
              id="ficha-objetivo"
              type="text"
              value={fichaObjetivo}
              onChange={(e) => setFichaObjetivo(e.target.value)}
              placeholder="Ex: Ganho de Massa"
              className="ficha-input"
            />

            <button 
              className="btn-primary" 
              onClick={handleSubmitWorkout}
              disabled={!selectedClientId || workoutRoutine.length === 0 || loading}
            >
              <i className="fas fa-save"></i> Salvar e Atribuir Ficha
            </button>
          </div>

          <div className="creator-content-grid">
            {/* Lado Esquerdo: Banco de Exercícios */}
            <div className="exercise-bank">
              <h2><i className="fas fa-database"></i> Banco de Exercícios</h2>
              <div className="exercise-controls">
                <input
                  type="text"
                  placeholder="Buscar exercício..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="exercise-search"
                />
                <select className="filter-select" value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)}>
                  <option>Todos</option>
                  <option>Peito</option>
                  <option>Costas</option>
                  <option>Pernas</option>
                  <option>Ombros</option>
                  <option>Braços</option>
                  <option>Antebraços</option>
                  <option>Abdômen</option>
                  <option>Glúteos</option>
                  <option>Panturrilha</option>
                </select>
              </div>
              <div className="exercise-list">
                {loading ? (
                  <p>Carregando exercícios...</p>
                ) : exercises.length === 0 ? (
                  <p>Nenhum exercício disponível</p>
                ) : (
                  exercises
                    .filter(ex => filterGroup === 'Todos' || ex.grupoMuscular === filterGroup)
                    .filter(ex => ex.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(exercise => (
                      <div key={exercise.id} className="exercise-item">
                        <div>
                          <div className="exercise-name">{exercise.nome}</div>
                          <div className="exercise-meta">{exercise.grupoMuscular} • {exercise.equipamento || 'Corpo Livre'}</div>
                        </div>
                        <div className="exercise-actions">
                          {exercise.urlVideo && (
                            <a href={exercise.urlVideo} target="_blank" rel="noreferrer" className="video-link" title="Ver vídeo">
                              <i className="fas fa-play-circle"></i>
                            </a>
                          )}
                          <button 
                            className="add-btn" 
                            onClick={() => handleAddExercise(exercise)}
                            title="Adicionar ao Treino"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Lado Direito: Rotina de Treino Sendo Montada */}
            <div className="workout-routine">
              <h2><i className="fas fa-list-ol"></i> Ficha de Treino ({workoutRoutine.length} Exercícios)</h2>
              
              {workoutRoutine.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-arrow-left"></i>
                  <p>Comece adicionando exercícios do banco à esquerda.</p>
                </div>
              ) : (
                <div className="routine-list">
                  {workoutRoutine.map((item, index) => (
                    <div key={item._tempId} className="routine-card">
                      <div className="card-header">
                        <h4>{index + 1}. {item.exercicioNome}</h4>
                        <button 
                          className="remove-btn" 
                          onClick={() => handleRemoveExercise(item._tempId)}
                          title="Remover"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      
                      <div className="card-details-grid">
                        <div>
                          <label>Séries</label>
                          <input 
                            type="number" 
                            value={item.series} 
                            onChange={(e) => handleUpdateExercise(item._tempId, 'series', e.target.value)}
                          />
                        </div>
                        <div>
                          <label>Repetições</label>
                          <input 
                            type="text" 
                            value={item.repeticoes} 
                            onChange={(e) => handleUpdateExercise(item._tempId, 'repeticoes', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
