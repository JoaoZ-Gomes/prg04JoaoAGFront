import React, { useState } from 'react'
import './UserWorkouts.css'

// Dados simulados da ficha de treino atual do usuário
const currentWorkoutPlan = {
  clientName: "João Gomes",
  planName: "Foco em Hipertrofia - Ciclo 1",
  startDate: "20/11/2025",
  endDate: "20/12/2025",
  workouts: [
    { day: 'A', name: 'Peito, Ombro e Tríceps', exercises: [
      { id: 101, name: 'Supino Reto c/ Barra', sets: 4, reps: '8-10', rest: '90s', notes: 'Carga média/alta', completed: false },
      { id: 102, name: 'Desenvolvimento Militar', sets: 3, reps: '10-12', rest: '60s', notes: '', completed: false },
      { id: 103, name: 'Crossover (Cabo Alto)', sets: 3, reps: '12-15', rest: '45s', notes: 'Foco no pico de contração', completed: false },
      { id: 104, name: 'Tríceps Testa', sets: 4, reps: '10', rest: '60s', notes: 'Controlar a descida', completed: false },
    ]},
    { day: 'B', name: 'Costas e Bíceps', exercises: [
      { id: 201, name: 'Puxada Alta (Pegada Pronada)', sets: 4, reps: '8-10', rest: '90s', notes: 'Amplitude total', completed: false },
      { id: 202, name: 'Remada Curvada (Halteres)', sets: 3, reps: '10', rest: '60s', notes: 'Movimento explosivo na subida', completed: false },
      { id: 203, name: 'Rosca Alternada', sets: 3, reps: '12', rest: '45s', notes: 'Foco na isometria no topo', completed: false },
    ]},
    { day: 'C', name: 'Pernas e Abdominais', exercises: [
      { id: 301, name: 'Agachamento Livre', sets: 4, reps: '8', rest: '120s', notes: 'Priorizar profundidade', completed: false },
      { id: 302, name: 'Extensora', sets: 3, reps: '15', rest: '45s', notes: 'Drop set na última série', completed: false },
    ]},
  ]
}

export default function UserWorkouts() {
  // Estado para controlar qual treino (A, B, C) está sendo visualizado
  const [selectedDay, setSelectedDay] = useState(currentWorkoutPlan.workouts[0].day)
  
  // Estado para simular o progresso (marcação de concluído)
  const [currentPlan, setCurrentPlan] = useState(currentWorkoutPlan)

  const selectedWorkout = currentPlan.workouts.find(w => w.day === selectedDay)

  const handleToggleCompletion = (exerciseId) => {
    setCurrentPlan(prevPlan => {
      const updatedWorkouts = prevPlan.workouts.map(workout => {
        if (workout.day === selectedDay) {
          const updatedExercises = workout.exercises.map(ex => 
            ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
          )
          return { ...workout, exercises: updatedExercises }
        }
        return workout
      })
      return { ...prevPlan, workouts: updatedWorkouts }
    })
  }
  
  // Calcula o progresso do treino atual
  const totalExercises = selectedWorkout.exercises.length
  const completedExercises = selectedWorkout.exercises.filter(ex => ex.completed).length
  const progressPercentage = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0
  
  const completionMessage = progressPercentage === 100 ? '✅ Treino Concluído! Excelente trabalho!' : `Progresso: ${progressPercentage}%`

  return (
    <div className="user-workouts-container">
      <div className="workout-page-header">
        <h1>Minha Ficha de Treino Atual</h1>
        <p className="plan-name">{currentPlan.planName} | Vigência: {currentPlan.startDate} a {currentPlan.endDate}</p>
      </div>

      <div className="workout-content-grid">
        
        {/* Coluna 1: Navegação/Seleção do Dia */}
        <div className="day-selector-card">
            <h2>Selecione o Dia:</h2>
            <div className="day-buttons">
                {currentPlan.workouts.map(workout => (
                    <button
                        key={workout.day}
                        className={`day-btn ${selectedDay === workout.day ? 'active-day' : ''}`}
                        onClick={() => setSelectedDay(workout.day)}
                    >
                        Dia {workout.day} - {workout.name}
                    </button>
                ))}
            </div>
            
            <div className="quick-info">
                <i className="fas fa-calendar-check icon-red"></i>
                <p>Lembre-se de registrar cada treino!</p>
            </div>
        </div>

        {/* Coluna 2: Detalhes do Treino Selecionado */}
        <div className="workout-details-card">
          <div className="workout-progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
              title={completionMessage}
            ></div>
            <span className="progress-text">{completionMessage}</span>
          </div>
          
          <h2>Treino {selectedWorkout.day}: {selectedWorkout.name}</h2>
          
          <div className="exercises-list">
            {selectedWorkout.exercises.map((exercise, index) => (
              <div key={exercise.id} className={`exercise-item ${exercise.completed ? 'completed' : ''}`}>
                <div className="exercise-info">
                  <span className="index">{index + 1}.</span>
                  <div className="details">
                    <span className="name">{exercise.name}</span>
                    <span className="specs">
                      {exercise.sets} Séries de {exercise.reps} | Descanso: {exercise.rest}
                    </span>
                    {exercise.notes && <p className="notes"><i className="fas fa-sticky-note"></i> {exercise.notes}</p>}
                  </div>
                </div>
                
                <button 
                  className="toggle-btn"
                  onClick={() => handleToggleCompletion(exercise.id)}
                  title={exercise.completed ? "Desmarcar" : "Marcar como concluído"}
                >
                  <i className={`fas ${exercise.completed ? 'fa-check-square' : 'fa-square'}`}></i>
                </button>
              </div>
            ))}
          </div>

          <button className="btn-primary finish-btn">
            Finalizar Treino e Enviar
          </button>
        </div>
      </div>
      
      {/* Opções adicionais (link para histórico) */}
      <div className="action-footer">
        <a href="#" className="footer-link-action">
            <i className="fas fa-history"></i> Ver Histórico Completo de Treinos
        </a>
      </div>
    </div>
  )
}
