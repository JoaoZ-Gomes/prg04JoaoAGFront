import React, { useState, useEffect } from 'react'
import ClientSidebar from '../../components/sidebars/ClientSidebar'
import * as fichaService from '../../services/fichaService'
import * as rotinaService from '../../services/rotinaService'
import * as clienteService from '../../services/clienteService'
import '../../components/layouts/ClientLayout/ClientLayout.css'
import './UserWorkouts.css'

export default function UserWorkouts() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fichas, setFichas] = useState([])
  const [selectedFichaId, setSelectedFichaId] = useState(null)
  const [rotinas, setRotinas] = useState([])
  const [clienteInfo, setClienteInfo] = useState({})
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)

  // Carregar dados do cliente e fichas
  useEffect(() => {
    const loadData = async () => {
      try {
        // Buscar informações do cliente
        const cliente = await clienteService.buscarMeuPerfil()
        setClienteInfo(cliente)

        // Buscar fichas do cliente
        const allFichas = await fichaService.buscarTodasFichasSemPaginacao()
        // Filtrar apenas fichas do cliente logado
        const fichasDoCliente = allFichas.filter(f => f.clienteId === cliente.id)
        setFichas(fichasDoCliente)

        if (fichasDoCliente.length > 0) {
          setSelectedFichaId(fichasDoCliente[0].id)
        }

        setLoading(false)
      } catch (err) {
        console.error('Erro ao carregar fichas:', err)
        setError('Erro ao carregar fichas de treino')
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Carregar rotinas quando uma ficha é selecionada
  useEffect(() => {
    const loadRotinas = async () => {
      if (!selectedFichaId) return

      try {
        const rotinasDaFicha = await rotinaService.buscarRotinasPorFicha(selectedFichaId)
        setRotinas(rotinasDaFicha || [])
        
        // Definir primeira dia como selecionada
        if (rotinasDaFicha && rotinasDaFicha.length > 0) {
          const dias = [...new Set(rotinasDaFicha.map(r => r.dia).filter(Boolean))]
          if (dias.length > 0) {
            setDiaSeleccionado(dias[0])
          }
        }
      } catch (err) {
        console.error('Erro ao carregar rotinas:', err)
        setError('Erro ao carregar rotinas')
      }
    }

    loadRotinas()
  }, [selectedFichaId])

  const selectedFicha = fichas.find(f => f.id === selectedFichaId)

  if (loading) {
    return (
      <div className="client-page-layout">
        <ClientSidebar />
        <div className="client-main-content">
          <div className="user-workouts-container">
            <h1>📋 Meus Treinos</h1>
            <p>Carregando fichas de treino...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="client-page-layout">
        <ClientSidebar />
        <div className="client-main-content">
          <div className="user-workouts-container">
            <h1>📋 Meus Treinos</h1>
            <p style={{color: 'red'}}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (fichas.length === 0) {
    return (
      <div className="client-page-layout">
        <ClientSidebar />
        <div className="client-main-content">
          <div className="user-workouts-container">
            <h1>📋 Meus Treinos</h1>
            <p>Nenhuma ficha de treino atribuída. Entre em contato com seu consultor.</p>
          </div>
        </div>
      </div>
    )
  }

  // Agrupar rotinas por dia
  const rotinasPorDia = {}
  rotinas.forEach(rotina => {
    const dia = rotina.dia || 'Geral'
    if (!rotinasPorDia[dia]) {
      rotinasPorDia[dia] = []
    }
    rotinasPorDia[dia].push(rotina)
  })

  const dias = Object.keys(rotinasPorDia).sort()
  const primeroDia = dias[0] || 'Geral'
  const diaAtual = diaSeleccionado || primeroDia
  const rotinasDelDia = rotinasPorDia[diaAtual] || []

  return (
    <div className="client-page-layout">
      <ClientSidebar />
      <div className="client-main-content">
        <div className="user-workouts-container">
          <div className="workout-page-header">
            <h1>Minha Ficha de Treino</h1>
            {selectedFicha && (
              <p className="plan-name">
                {selectedFicha.nome} | Cliente: {clienteInfo.nome}
                {selectedFicha.dataInicio && selectedFicha.dataFim && (
                  <span> | Vigência: {new Date(selectedFicha.dataInicio).toLocaleDateString('pt-BR')} a {new Date(selectedFicha.dataFim).toLocaleDateString('pt-BR')}</span>
                )}
              </p>
            )}
          </div>

          {fichas.length > 1 && (
            <div className="ficha-selector-card">
              <label>Selecionar Ficha:</label>
              <select 
                value={selectedFichaId} 
                onChange={(e) => setSelectedFichaId(Number(e.target.value))}
                className="ficha-select"
              >
                {fichas.map(f => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
            </div>
          )}

          <div className="workout-content-grid">
            
            {/* Coluna 1: Seleção de Dias */}
            <div className="day-selector-card">
              <h2>Selecione o Dia:</h2>
              <div className="day-buttons">
                {dias.length > 0 ? (
                  dias.map(dia => (
                    <button
                      key={dia}
                      className={`day-btn ${diaAtual === dia ? 'active-day' : ''}`}
                      onClick={() => setDiaSeleccionado(dia)}
                    >
                      Dia {dia}
                    </button>
                  ))
                ) : (
                  <p>Nenhuma rotina adicionada</p>
                )}
              </div>
              
              <div className="quick-info">
                <i className="fas fa-calendar-check icon-red"></i>
                <p>Acompanhe seus treinos!</p>
              </div>
            </div>

            {/* Coluna 2: Exercícios do Dia */}
            <div className="workout-details-card">
              <h2>Dia {diaAtual}: Exercícios</h2>
              
              {rotinasDelDia.length > 0 ? (
                <div className="exercises-list">
                  {rotinasDelDia.map((rotina, index) => (
                    <div key={rotina.id || index} className="exercise-item">
                      <div className="exercise-info">
                        <span className="index">{index + 1}.</span>
                                <div className="details">
                                  <span className="name">{rotina.nomeExercicio || rotina.nome || 'Exercício'}</span>
                                  <span className="specs">
                                    {rotina.series || '-'} séries × {rotina.repeticoes || '-'} reps | Descanso: {rotina.descanso || '-'}
                                  </span>
                                  <div className="exercise-extra-meta">
                                    {rotina.equipamento && <span className="meta-item">Equip: {rotina.equipamento}</span>}
                                    {rotina.urlVideo && (
                                      <a className="meta-item video-link" href={rotina.urlVideo} target="_blank" rel="noreferrer">Vídeo</a>
                                    )}
                                  </div>
                                  {rotina.notas && (
                                    <p className="notes">
                                      <i className="fas fa-sticky-note"></i> {rotina.notas}
                                    </p>
                                  )}
                                </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhum exercício neste dia</p>
              )}

              <button className="btn-primary finish-btn" disabled>
                Treino Carregado do Sistema
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
