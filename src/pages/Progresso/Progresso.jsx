import React, { useState, useEffect } from 'react'
import ClientSidebar from '../../components/sidebars/ClientSidebar'
import * as clienteService from '../../services/clienteService'
import * as avaliacaoService from '../../services/avaliacaoService'
import '../../components/layouts/ClientLayout/ClientLayout.css'
import './Progresso.css'

export default function Progresso() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [clienteInfo, setClienteInfo] = useState({})
  const [avaliacoes, setAvaliacoes] = useState([])
  const [selectedMetric, setSelectedMetric] = useState('weight')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cliente, avals] = await Promise.all([
          clienteService.buscarMeuPerfil(),
          avaliacaoService.buscarMinhasAvaliacoes()
        ])
        setClienteInfo(cliente)
        setAvaliacoes(avals || [])
        setLoading(false)
      } catch (err) {
        setError('Erro ao carregar dados de evolução')
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const getWeightStats = () => {
    if (avaliacoes.length < 2) return { diff: 0, trend: 'neutral' }
    const sorted = [...avaliacoes].sort((a, b) => new Date(a.dataAvaliacao) - new Date(b.dataAvaliacao))
    const first = sorted[0].peso
    const last = sorted[sorted.length - 1].peso
    const diff = last - first
    return {
      diff: Math.abs(diff).toFixed(1),
      trend: diff <= 0 ? 'down' : 'up' 
    }
  }

  const stats = getWeightStats()

  if (loading) return <div className="loading-overlay">Carregando evolução...</div>

  return (
    <div className="client-page-layout">
      <ClientSidebar />
      <div className="client-main-content">
        <div className="progresso-wrapper">
          
          <header className="progresso-header-section">
            <div className="header-text">
              <h1>Minha Evolução</h1>
              <p>Olá, <strong>{clienteInfo.nome}</strong>. Veja seu progresso até hoje.</p>
            </div>
            
            <div className="kpi-container">
              <div className={`kpi-card ${stats.trend}`}>
                <div className="kpi-icon">
                  <i className={`fas fa-weight-hanging`}></i>
                </div>
                <div className="kpi-info">
                  <span>{stats.trend === 'down' ? 'Eliminado' : 'Ganho'}</span>
                  <h3>{stats.diff} <small>kg</small></h3>
                </div>
                <div className="trend-badge">
                   <i className={`fas fa-long-arrow-alt-${stats.trend === 'down' ? 'down' : 'up'}`}></i>
                </div>
              </div>
            </div>
          </header>

          <div className="progresso-card-main">
            <nav className="tabs-nav">
              <button 
                className={selectedMetric === 'weight' ? 'tab-active' : ''} 
                onClick={() => setSelectedMetric('weight')}
              >
                Histórico de Peso
              </button>
              <button 
                className={selectedMetric === 'measurements' ? 'tab-active' : ''} 
                onClick={() => setSelectedMetric('measurements')}
              >
                Minhas Medidas
              </button>
            </nav>

            <section className="tab-content">
              {selectedMetric === 'weight' && (
                <div className="evolution-chart-container">
                  <div className="chart-header">
                    <h3>Peso Corporal</h3>
                    <span>Últimas {avaliacoes.length} avaliações</span>
                  </div>
                  <div className="visual-bars">
                    {avaliacoes.length > 0 ? avaliacoes.map((av, index) => {
                      const height = (av.peso / 140) * 100 
                      return (
                        <div key={index} className="bar-item">
                          <div className="bar-tooltip">{av.peso}kg</div>
                          <div className="bar-column" style={{ height: `${height}%` }}></div>
                          <span className="bar-date">
                            {new Date(av.dataAvaliacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      )
                    }) : <p className="empty-msg">Nenhuma avaliação encontrada.</p>}
                  </div>
                </div>
              )}

              {selectedMetric === 'measurements' && (
                <div className="measurements-grid-v2">
                  {[
                    { label: 'Tórax', val: clienteInfo.medidaPeito, icon: 'fa-child' },
                    { label: 'Cintura', val: clienteInfo.medidaCintura, icon: 'fa-compress-arrows-alt' },
                    { label: 'Quadril', val: clienteInfo.medidaQuadril, icon: 'fa-user-friends' },
                    { label: 'Braço', val: clienteInfo.medidaBraco, icon: 'fa-dumbbell' },
                    { label: 'Coxa', val: clienteInfo.medidaCoxa, icon: 'fa-running' },
                  ].map((m, i) => (
                    <div key={i} className="measurement-card-item">
                      <div className="m-icon-circle"><i className={`fas ${m.icon}`}></i></div>
                      <div className="m-data">
                        <label>{m.label}</label>
                        <p>{m.val ? `${m.val} cm` : '--'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}