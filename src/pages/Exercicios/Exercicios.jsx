import React, { useState, useEffect } from 'react'
import ConsultantSidebar from '../../components/sidebars/ConsultantSidebar'
import * as exercicioService from '../../services/exercicioService'
import '../../components/layouts/ConsultantLayout/ConsultantLayout.css'
import './Exercicios.css'

export default function Exercicios() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingExercise, setEditingExercise] = useState(null)
  const [newExercise, setNewExercise] = useState({
    nome: '',
    grupoMuscular: '',
    equipamento: '',
    descricao: '',
    urlVideo: ''
  })

  // Buscar exercícios do backend
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await exercicioService.buscarTodosExerciciosSemPaginacao()
        setExercises(data || [])
        setLoading(false)
      } catch (err) {
        console.error('Erro ao buscar exercícios:', err)
        setError('Erro ao carregar exercícios')
        setLoading(false)
      }
    }

    loadExercises()
  }, [])

  const categories = ['Todos', ...new Set(exercises.map(ex => ex.grupoMuscular))]

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.grupoMuscular.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || exercise.grupoMuscular === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleOpenModal = (exercise = null) => {
    if (exercise) {
      setEditingExercise(exercise)
      setNewExercise({
        nome: exercise.nome,
        grupoMuscular: exercise.grupoMuscular,
        equipamento: exercise.equipamento,
        descricao: exercise.descricao,
        urlVideo: exercise.urlVideo || ''
      })
    } else {
      setEditingExercise(null)
      setNewExercise({
        nome: '',
        grupoMuscular: '',
        equipamento: '',
        descricao: '',
        urlVideo: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingExercise(null)
    setNewExercise({
      nome: '',
      grupoMuscular: '',
      equipamento: '',
      descricao: '',
      urlVideo: ''
    })
  }

  const handleSaveExercise = async () => {
    if (!newExercise.nome.trim()) {
      setError('Preencha o nome do exercício')
      return
    }

    try {
      if (editingExercise) {
        // Atualizar exercício
        const updated = await exercicioService.atualizarExercicio(editingExercise.id, newExercise)
        setExercises(exercises.map(ex => ex.id === editingExercise.id ? updated : ex))
      } else {
        // Criar novo exercício
        const created = await exercicioService.criarExercicio(newExercise)
        setExercises([...exercises, created])
      }
      handleCloseModal()
    } catch (err) {
      console.error('Erro ao salvar exercício:', err)
      setError(`Erro ao salvar: ${err.message}`)
    }
  }

  const handleDeleteExercise = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este exercício?')) {
      try {
        await exercicioService.deletarExercicio(id)
        setExercises(exercises.filter(ex => ex.id !== id))
        setSelectedExercise(null)
      } catch (err) {
        console.error('Erro ao deletar exercício:', err)
        setError(`Erro ao deletar: ${err.message}`)
      }
    }
  }

  return (
    <div className="consultant-page-layout">
      <ConsultantSidebar />

      <div className="consultant-main-content">
        <div className="exercicios-container">
          <div className="exercicios-header">
            <h1>Banco de Exercícios</h1>
            <p>Gerencie e visualize todos os exercícios disponíveis</p>
            <button className="btn-primary" onClick={() => handleOpenModal()}>
              <i className="fas fa-plus"></i> Novo Exercício
            </button>
          </div>

          {error && <div className="error-message"><i className="fas fa-exclamation-triangle"></i>{error}</div>}

          <div className="filters">
            <input
              type="text"
              placeholder="Buscar exercício ou músculo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="exercicios-content">
            <div className="exercises-list">
              {loading ? (
                <p>Carregando exercícios...</p>
              ) : filteredExercises.length === 0 ? (
                <p>Nenhum exercício encontrado</p>
              ) : (
                filteredExercises.map(exercise => (
                  <div
                    key={exercise.id}
                    className={`exercise-item ${selectedExercise?.id === exercise.id ? 'selected' : ''}`}
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <h3>{exercise.nome}</h3>
                    <p><strong>Categoria:</strong> {exercise.grupoMuscular}</p>
                    <p><strong>Equipamento:</strong> {exercise.equipamento}</p>
                  </div>
                ))
              )}
            </div>

            {selectedExercise && (
              <div className="exercise-details">
                <h2>{selectedExercise.nome}</h2>
                <div className="detail-section">
                  <h3>Informações Gerais</h3>
                  <p><strong>Grupo Muscular:</strong> {selectedExercise.grupoMuscular}</p>
                  <p><strong>Equipamento:</strong> {selectedExercise.equipamento}</p>
                  <p><strong>Descrição:</strong> {selectedExercise.descricao || 'N/A'}</p>
                  {selectedExercise.urlVideo && (
                    <p><strong>Vídeo:</strong> <a href={selectedExercise.urlVideo} target="_blank" rel="noopener noreferrer">Ver vídeo</a></p>
                  )}
                </div>
                <div className="detail-actions">
                  <button className="btn-edit" onClick={() => handleOpenModal(selectedExercise)}>
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteExercise(selectedExercise.id)}>
                    <i className="fas fa-trash"></i> Deletar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL PARA CRIAR/EDITAR EXERCÍCIO */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingExercise ? 'Editar Exercício' : 'Novo Exercício'}</h3>
            <div className="modal-body">
              <label>
                Nome:
                <input
                  type="text"
                  value={newExercise.nome}
                  onChange={(e) => setNewExercise({...newExercise, nome: e.target.value})}
                  placeholder="Ex: Supino Reto"
                />
              </label>
              <label>
                Grupo Muscular:
                <input
                  type="text"
                  value={newExercise.grupoMuscular}
                  onChange={(e) => setNewExercise({...newExercise, grupoMuscular: e.target.value})}
                  placeholder="Ex: Peito"
                />
              </label>
              <label>
                Equipamento:
                <input
                  type="text"
                  value={newExercise.equipamento}
                  onChange={(e) => setNewExercise({...newExercise, equipamento: e.target.value})}
                  placeholder="Ex: Barra"
                />
              </label>
              <label>
                Descrição:
                <textarea
                  value={newExercise.descricao}
                  onChange={(e) => setNewExercise({...newExercise, descricao: e.target.value})}
                  placeholder="Instruções de execução"
                />
              </label>
              <label>
                URL do Vídeo (Opcional):
                <input
                  type="url"
                  value={newExercise.urlVideo}
                  onChange={(e) => setNewExercise({...newExercise, urlVideo: e.target.value})}
                  placeholder="https://..."
                />
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={handleCloseModal}>Cancelar</button>
              <button onClick={handleSaveExercise}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}