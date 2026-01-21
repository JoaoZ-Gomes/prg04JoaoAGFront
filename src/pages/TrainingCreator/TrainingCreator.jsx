import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ConsultantSidebar from '../../components/sidebars/ConsultantSidebar'
import '../../components/layouts/ConsultantLayout/ConsultantLayout.css'
import './TrainingCreator.css'

// Banco de dados simulado de exercícios
const availableExercises = [
  { id: 1, name: 'Supino Reto com Barra', muscle: 'Peito', difficulty: 'Média' },
  { id: 2, name: 'Agachamento Livre', muscle: 'Pernas', difficulty: 'Alta' },
  { id: 3, name: 'Remada Curvada', muscle: 'Costas', difficulty: 'Média' },
  { id: 4, name: 'Desenvolvimento c/ Halteres', muscle: 'Ombros', difficulty: 'Média' },
  { id: 5, name: 'Rosca Direta', muscle: 'Bíceps', difficulty: 'Baixa' },
  { id: 6, name: 'Extensão de Tríceps (Corda)', muscle: 'Tríceps', difficulty: 'Baixa' },
]

export default function TrainingCreator() {
  const location = useLocation()
  const [selectedClient, setSelectedClient] = useState('Cliente Não Selecionado')
  const [workoutRoutine, setWorkoutRoutine] = useState([]) // Ficha de treino sendo montada

  useEffect(() => {
    if (location.state && location.state.clientId) {
      setSelectedClient(location.state.clientName || `Cliente ID: ${location.state.clientId}`)
    }
  }, [location.state])

  const handleAddExercise = (exercise) => {
    // Adiciona o exercício com configurações padrão (pode ser ajustado depois)
    const newEntry = {
      ...exercise,
      routineId: Date.now(), // ID único para a rotina
      series: 3,
      repetitions: '10-12',
      restTime: '60s',
      notes: '',
    }
    setWorkoutRoutine([...workoutRoutine, newEntry])
  }

  const handleUpdateExercise = (routineId, field, value) => {
    setWorkoutRoutine(
      workoutRoutine.map(item =>
        item.routineId === routineId ? { ...item, [field]: value } : item
      )
    )
  }

  const handleRemoveExercise = (routineId) => {
    setWorkoutRoutine(workoutRoutine.filter(item => item.routineId !== routineId))
  }

  const handleSubmitWorkout = () => {
    if (workoutRoutine.length === 0 || selectedClient === 'Cliente Não Selecionado') {
      alert('Selecione um cliente e adicione pelo menos um exercício!')
      return
    }
    // Lógica para enviar a ficha de treino para o banco de dados
    console.log(`Ficha de Treino salva para: ${selectedClient}`, workoutRoutine)
    alert(`Ficha de treino salva e atribuída a ${selectedClient}!`)
    setWorkoutRoutine([])
    setSelectedClient('Cliente Não Selecionado')
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

          <div className="creator-selector-bar">
        <label htmlFor="client-select">Atribuir a:</label>
        <select
          id="client-select"
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="client-select-input"
        >
          <option value="Cliente Não Selecionado" disabled>-- Selecione o Cliente --</option>
          <option value="João Gomes">João Gomes</option>
          <option value="Mariana Lima">Mariana Lima</option>
          {/* Outros clientes viriam de uma API */}
        </select>
        <button 
          className="btn-primary" 
          onClick={handleSubmitWorkout}
          disabled={workoutRoutine.length === 0 || selectedClient === 'Cliente Não Selecionado'}
        >
          <i className="fas fa-save"></i> Salvar e Atribuir Ficha
        </button>
      </div>

      <div className="creator-content-grid">
        {/* Lado Esquerdo: Banco de Exercícios */}
        <div className="exercise-bank">
          <h2><i className="fas fa-database"></i> Banco de Exercícios</h2>
          <div className="exercise-list">
            {availableExercises.map(exercise => (
              <div key={exercise.id} className="exercise-item">
                <span className="exercise-name">{exercise.name}</span>
                <span className="exercise-details">{exercise.muscle} | {exercise.difficulty}</span>
                <button 
                  className="add-btn" 
                  onClick={() => handleAddExercise(exercise)}
                  title="Adicionar ao Treino"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            ))}
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
                <div key={item.routineId} className="routine-card">
                  <div className="card-header">
                    <h4>{index + 1}. {item.name}</h4>
                    <button 
                      className="remove-btn" 
                      onClick={() => handleRemoveExercise(item.routineId)}
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
                        onChange={(e) => handleUpdateExercise(item.routineId, 'series', e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Repetições</label>
                      <input 
                        type="text" 
                        value={item.repetitions} 
                        onChange={(e) => handleUpdateExercise(item.routineId, 'repetitions', e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Descanso (s)</label>
                      <input 
                        type="text" 
                        value={item.restTime} 
                        onChange={(e) => handleUpdateExercise(item.routineId, 'restTime', e.target.value)}
                      />
                    </div>
                    <div className="full-row">
                      <label>Observações (Carga, Técnica)</label>
                      <input 
                        type="text" 
                        value={item.notes} 
                        onChange={(e) => handleUpdateExercise(item.routineId, 'notes', e.target.value)}
                        placeholder="Ex: Foco na fase excêntrica."
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
