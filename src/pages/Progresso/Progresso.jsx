import React, { useState, useEffect } from 'react'
import ClientSidebar from '../../components/sidebars/ClientSidebar'
import * as clienteService from '../../services/clienteService'
import '../../components/layouts/ClientLayout/ClientLayout.css'
import './Progresso.css'

export default function Progresso() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [clienteInfo, setClienteInfo] = useState({})
  const [selectedMetric, setSelectedMetric] = useState('weight')

  useEffect(() => {
    const loadData = async () => {
      try {
        const cliente = await clienteService.buscarMeuPerfil()
        setClienteInfo(cliente)
        setLoading(false)
      } catch (err) {
        console.error('Erro ao carregar informações:', err)
        setError('Erro ao carregar dados')
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Dados simulados de progresso (até integração com backend)
  const progressData = {
    weight: [
      { date: '01/11', weight: 75.5 },
      { date: '08/11', weight: 75.2 },
      { date: '15/11', weight: 74.8 },
      { date: '22/11', weight: 74.5 },
      { date: '29/11', weight: 74.2 },
    ],
    measurements: {
      chest: clienteInfo.medidaPeito || 95,
      waist: clienteInfo.medidaCintura || 80,
      hips: clienteInfo.medidaQuadril || 100,
      arms: clienteInfo.medidaBraco || 35,
      thighs: clienteInfo.medidaCoxa || 60,
    },
    workouts: [
      { date: '01/11', completed: 3, total: 3 },
      { date: '08/11', completed: 3, total: 3 },
      { date: '15/11', completed: 2, total: 3 },
      { date: '22/11', completed: 3, total: 3 },
      { date: '29/11', completed: 3, total: 3 },
    ]
  }

  if (loading) {
    return (
      <div className="client-page-layout">
        <ClientSidebar />
        <div className="client-main-content">
          <div className="progresso-container">
            <h1>📊 Meu Progresso</h1>
            <p>Carregando dados...</p>
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
          <div className="progresso-container">
            <h1>📊 Meu Progresso</h1>
            <p style={{color: 'red'}}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const renderWeightChart = () => {
    const maxWeight = Math.max(...progressData.weight.map(d => d.weight))
    const minWeight = Math.min(...progressData.weight.map(d => d.weight))
    const range = maxWeight - minWeight

    return (
      <div className="chart-container">
        <h3>Evolução do Peso</h3>
        <div className="simple-chart">
          {progressData.weight.map((data, index) => {
            const height = ((data.weight - minWeight) / range) * 100
            return (
              <div key={index} className="chart-bar">
                <div
                  className="bar-fill"
                  style={{ height: `${height}%` }}
                  title={`${data.weight}kg`}
                ></div>
                <span className="bar-label">{data.date}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWorkoutChart = () => {
    return (
      <div className="chart-container">
        <h3>Treinos Concluídos</h3>
        <div className="simple-chart">
          {progressData.workouts.map((data, index) => {
            const percentage = (data.completed / data.total) * 100
            return (
              <div key={index} className="chart-bar">
                <div
                  className="bar-fill workout-bar"
                  style={{ height: `${percentage}%` }}
                  title={`${data.completed}/${data.total}`}
                ></div>
                <span className="bar-label">{data.date}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="client-page-layout">
      <ClientSidebar />
      <div className="client-main-content">
        <div className="progresso-container">
          <div className="progresso-header">
            <h1>📊 Meu Progresso</h1>
            <p>Acompanhe sua evolução ao longo do tempo</p>
            <p className="client-name">Cliente: {clienteInfo.nome}</p>
          </div>

          <div className="metric-selector">
            <button
              className={selectedMetric === 'weight' ? 'active' : ''}
              onClick={() => setSelectedMetric('weight')}
            >
              Peso
            </button>
            <button
              className={selectedMetric === 'measurements' ? 'active' : ''}
              onClick={() => setSelectedMetric('measurements')}
            >
              Medidas
            </button>
            <button
              className={selectedMetric === 'workouts' ? 'active' : ''}
              onClick={() => setSelectedMetric('workouts')}
            >
              Treinos
            </button>
          </div>

          <div className="progress-content">
            {selectedMetric === 'weight' && renderWeightChart()}
            {selectedMetric === 'measurements' && (
              <div className="measurements-container">
                <h3>Medidas Corporais (cm)</h3>
                <div className="measurements-grid">
                  <div className="measurement-item">
                    <span className="measurement-label">Peito:</span>
                    <span className="measurement-value">{progressData.measurements.chest} cm</span>
                  </div>
                  <div className="measurement-item">
                    <span className="measurement-label">Cintura:</span>
                    <span className="measurement-value">{progressData.measurements.waist} cm</span>
                  </div>
                  <div className="measurement-item">
                    <span className="measurement-label">Quadris:</span>
                    <span className="measurement-value">{progressData.measurements.hips} cm</span>
                  </div>
                  <div className="measurement-item">
                    <span className="measurement-label">Braços:</span>
                    <span className="measurement-value">{progressData.measurements.arms} cm</span>
                  </div>
                  <div className="measurement-item">
                    <span className="measurement-label">Coxas:</span>
                    <span className="measurement-value">{progressData.measurements.thighs} cm</span>
                  </div>
                </div>
              </div>
            )}
            {selectedMetric === 'workouts' && renderWorkoutChart()}
          </div>
        </div>
      </div>
    </div>
  )
}