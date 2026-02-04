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
  const [selectedPeriod, setSelectedPeriod] = useState('all')

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

  const getFilteredAvaliacoes = () => {
    if (selectedPeriod === 'all') return avaliacoes
    
    const today = new Date()
    const cutoffDate = new Date()
    
    switch(selectedPeriod) {
      case '30':
        cutoffDate.setDate(today.getDate() - 30)
        break
      case '90':
        cutoffDate.setDate(today.getDate() - 90)
        break
      case '180':
        cutoffDate.setDate(today.getDate() - 180)
        break
      default:
        return avaliacoes
    }
    
    return avaliacoes.filter(av => new Date(av.dataAvaliacao) >= cutoffDate)
  }

  const getWeightStats = () => {
    const filtered = getFilteredAvaliacoes()
    if (filtered.length < 2) return { diff: 0, trend: 'neutral', primeira: 0, ultima: 0, imc: 0 }
    
    const sorted = [...filtered].sort((a, b) => new Date(a.dataAvaliacao) - new Date(b.dataAvaliacao))
    const first = sorted[0].peso
    const last = sorted[sorted.length - 1].peso
    const diff = last - first
    const altura = clienteInfo.altura || 1.75
    const imc = (last / (altura * altura)).toFixed(1)
    
    return {
      diff: diff.toFixed(1),
      absDiff: Math.abs(diff).toFixed(1),
      trend: diff < 0 ? 'down' : diff > 0 ? 'up' : 'neutral',
      primeira: first.toFixed(1),
      ultima: last.toFixed(1),
      imc: imc,
      pesoIdeal: (22 * altura * altura).toFixed(1)
    }
  }

  const getWeeklyAverage = () => {
    const filtered = getFilteredAvaliacoes()
    if (filtered.length === 0) return 0
    
    const sorted = [...filtered].sort((a, b) => new Date(a.dataAvaliacao) - new Date(b.dataAvaliacao))
    const totalDays = (new Date(sorted[sorted.length - 1].dataAvaliacao) - new Date(sorted[0].dataAvaliacao)) / (1000 * 60 * 60 * 24)
    const weightChange = sorted[sorted.length - 1].peso - sorted[0].peso
    return (weightChange / (totalDays / 7)).toFixed(2)
  }

  const stats = getWeightStats()
  const filteredAvaliacoes = getFilteredAvaliacoes()

  if (loading) return <div className="loading-overlay">Carregando evolução...</div>

  if (error) {
    return (
      <div className="client-page-layout">
        <ClientSidebar />
        <div className="client-main-content">
          <div className="progresso-wrapper">
            <div className="error-message" style={{ padding: '2rem', textAlign: 'center' }}>
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="client-page-layout">
      <ClientSidebar />
      <div className="client-main-content">
        <div className="progresso-wrapper">
          
          {/* ===== HEADER COM KPIs ===== */}
          <header className="progresso-header-section">
            <div className="header-text">
              <h1>Minha Evolução</h1>
              <p>Acompanhe seu progresso e evolução corporal</p>
            </div>
            
            <div className="kpi-container">
              <div className={`kpi-card ${stats.trend}`}>
                <div className="kpi-icon">
                  <i className={`fas fa-weight-hanging`}></i>
                </div>
                <div className="kpi-info">
                  <span>{stats.trend === 'down' ? 'Eliminado' : stats.trend === 'up' ? 'Ganho' : 'Sem Mudança'}</span>
                  <h3>{stats.absDiff} <small>kg</small></h3>
                </div>
                <div className="trend-badge">
                   <i className={`fas fa-long-arrow-alt-${stats.trend === 'down' ? 'down' : stats.trend === 'up' ? 'up' : 'right'}`}></i>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">
                  <i className="fas fa-calculator"></i>
                </div>
                <div className="kpi-info">
                  <span>IMC Atual</span>
                  <h3>{stats.imc}</h3>
                </div>
              </div>
            </div>
          </header>

          {/* ===== SELEÇÃO DE PERÍODO ===== */}
          <div className="period-selector">
            <h3>Período de Análise</h3>
            <div className="period-buttons">
              <button 
                className={`period-btn ${selectedPeriod === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('all')}
              >
                Tudo
              </button>
              <button 
                className={`period-btn ${selectedPeriod === '30' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('30')}
              >
                30 Dias
              </button>
              <button 
                className={`period-btn ${selectedPeriod === '90' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('90')}
              >
                90 Dias
              </button>
              <button 
                className={`period-btn ${selectedPeriod === '180' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('180')}
              >
                6 Meses
              </button>
            </div>
          </div>

          {/* ===== CARD PRINCIPAL ===== */}
          <div className="progresso-card-main">
            <nav className="tabs-nav">
              <button 
                className={selectedMetric === 'weight' ? 'tab-active' : ''} 
                onClick={() => setSelectedMetric('weight')}
              >
                <i className="fas fa-weight"></i> Histórico de Peso
              </button>
              <button 
                className={selectedMetric === 'measurements' ? 'tab-active' : ''} 
                onClick={() => setSelectedMetric('measurements')}
              >
                <i className="fas fa-ruler"></i> Minhas Medidas
              </button>
              <button 
                className={selectedMetric === 'analysis' ? 'tab-active' : ''} 
                onClick={() => setSelectedMetric('analysis')}
              >
                <i className="fas fa-chart-bar"></i> Análise Detalhada
              </button>
            </nav>

            <section className="tab-content">
              {/* ===== ABA: PESO ===== */}
              {selectedMetric === 'weight' && (
                <div className="evolution-chart-container">
                  <div className="chart-header">
                    <h3>Evolução do Peso Corporal</h3>
                    <span>{filteredAvaliacoes.length} avaliação(ões)</span>
                  </div>

                  {filteredAvaliacoes.length > 0 ? (
                    <>
                      <div className="weight-stats-row">
                        <div className="stat-item">
                          <label>Peso Inicial</label>
                          <span className="stat-value">{stats.primeira} kg</span>
                        </div>
                        <div className="stat-item">
                          <label>Peso Atual</label>
                          <span className="stat-value">{stats.ultima} kg</span>
                        </div>
                        <div className="stat-item">
                          <label>Variação</label>
                          <span className={`stat-value ${stats.trend === 'down' ? 'success' : stats.trend === 'up' ? 'danger' : ''}`}>
                            {stats.diff > 0 ? '+' : ''}{stats.diff} kg
                          </span>
                        </div>
                        <div className="stat-item">
                          <label>Média Semanal</label>
                          <span className="stat-value">{getWeeklyAverage()} kg/sem</span>
                        </div>
                        <div className="stat-item">
                          <label>Peso Ideal (IMC 22)</label>
                          <span className="stat-value">{stats.pesoIdeal} kg</span>
                        </div>
                      </div>

                      <div className="visual-bars">
                        {filteredAvaliacoes.map((av, index) => {
                          const altura = clienteInfo.altura || 1.75
                          const maxWeight = Math.max(...filteredAvaliacoes.map(a => a.peso)) + 5
                          const height = (av.peso / maxWeight) * 100 
                          const dataFormatada = new Date(av.dataAvaliacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' })
                          return (
                            <div key={index} className="bar-item">
                              <div className="bar-tooltip">
                                <strong>{av.peso}kg</strong>
                                <br/><small>{dataFormatada}</small>
                              </div>
                              <div className="bar-column" style={{ height: `${height}%` }}></div>
                              <span className="bar-date">{dataFormatada}</span>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  ) : (
                    <p className="empty-msg">Nenhuma avaliação registrada. Solicite uma avaliação ao seu consultor.</p>
                  )}
                </div>
              )}

              {/* ===== ABA: MEDIDAS ===== */}
              {selectedMetric === 'measurements' && (
                <div className="measurements-section">
                  <div className="chart-header">
                    <h3>Minhas Medidas Corpóreas</h3>
                    <span>Medidas cadastradas</span>
                  </div>
                  <div className="measurements-grid-v2">
                    {[
                      { label: 'Tórax', val: clienteInfo.medidaPeito, icon: 'fa-child', ideal: '--' },
                      { label: 'Cintura', val: clienteInfo.medidaCintura, icon: 'fa-compress-arrows-alt', ideal: '--' },
                      { label: 'Quadril', val: clienteInfo.medidaQuadril, icon: 'fa-user-friends', ideal: '--' },
                      { label: 'Braço', val: clienteInfo.medidaBraco, icon: 'fa-dumbbell', ideal: '--' },
                      { label: 'Coxa', val: clienteInfo.medidaCoxa, icon: 'fa-running', ideal: '--' },
                      { label: 'Panturrilha', val: clienteInfo.medidaPanturrilha, icon: 'fa-heart-pulse', ideal: '--' },
                    ].map((m, i) => (
                      <div key={i} className="measurement-card-item">
                        <div className="m-icon-circle"><i className={`fas ${m.icon}`}></i></div>
                        <div className="m-data">
                          <label>{m.label}</label>
                          <p>{m.val ? `${m.val} cm` : '--'}</p>
                          <small>Meta: {m.ideal}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="measurements-note">
                    <i className="fas fa-info-circle"></i>
                    <p>As medidas são atualizadas durante suas avaliações com o consultor. Solicite uma nova medição se necessário.</p>
                  </div>
                </div>
              )}

              {/* ===== ABA: ANÁLISE DETALHADA ===== */}
              {selectedMetric === 'analysis' && (
                <div className="analysis-section">
                  <div className="chart-header">
                    <h3>Análise Detalhada de Evolução</h3>
                  </div>

                  {filteredAvaliacoes.length > 1 ? (
                    <div className="analysis-grid">
                      <div className="analysis-card">
                        <div className="analysis-header">
                          <i className="fas fa-arrow-trend-down"></i>
                          <h4>Tendência</h4>
                        </div>
                        <div className="analysis-content">
                          {stats.trend === 'down' && (
                            <p className="trend-message success">
                              <strong>Redução de Peso:</strong> Você está no caminho certo! Continue assim.
                            </p>
                          )}
                          {stats.trend === 'up' && (
                            <p className="trend-message warning">
                              <strong>Ganho de Peso:</strong> Verifique sua alimentação e exercícios com seu consultor.
                            </p>
                          )}
                          {stats.trend === 'neutral' && (
                            <p className="trend-message info">
                              <strong>Sem Mudanças:</strong> Seu peso está estável. Ajuste a intensidade dos treinos se necessário.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="analysis-card">
                        <div className="analysis-header">
                          <i className="fas fa-chart-line"></i>
                          <h4>Ritmo de Mudança</h4>
                        </div>
                        <div className="analysis-content">
                          <p><strong>{Math.abs(getWeeklyAverage())}</strong> kg/semana</p>
                          <small>{Math.abs(getWeeklyAverage()) > 1 ? 'Ritmo acelerado' : 'Ritmo moderado'}</small>
                        </div>
                      </div>

                      <div className="analysis-card">
                        <div className="analysis-header">
                          <i className="fas fa-flag-checkered"></i>
                          <h4>Progresso Total</h4>
                        </div>
                        <div className="analysis-content">
                          <p>{filteredAvaliacoes.length} avaliação(ões) registrada(s)</p>
                          <small>Período: {filteredAvaliacoes.length > 1 ? 
                            new Date(filteredAvaliacoes[0].dataAvaliacao).toLocaleDateString('pt-BR') + ' a ' + 
                            new Date(filteredAvaliacoes[filteredAvaliacoes.length - 1].dataAvaliacao).toLocaleDateString('pt-BR')
                            : 'Apenas uma avaliação'}
                          </small>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="empty-msg">Você precisa de pelo menos 2 avaliações para visualizar a análise detalhada.</p>
                  )}

                  {filteredAvaliacoes.length > 0 && (
                    <div className="evaluation-history">
                      <h4>Histórico de Avaliações</h4>
                      <table className="history-table">
                        <thead>
                          <tr>
                            <th>Data</th>
                            <th>Peso</th>
                            <th>IMC</th>
                            <th>Variação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...filteredAvaliacoes].reverse().map((av, index) => {
                            const prevAv = index > 0 ? [...filteredAvaliacoes].reverse()[index - 1] : null
                            const diff = prevAv ? (av.peso - prevAv.peso).toFixed(1) : '--'
                            const altura = clienteInfo.altura || 1.75
                            const imc = (av.peso / (altura * altura)).toFixed(1)
                            return (
                              <tr key={index}>
                                <td>{new Date(av.dataAvaliacao).toLocaleDateString('pt-BR')}</td>
                                <td><strong>{av.peso} kg</strong></td>
                                <td>{imc}</td>
                                <td className={diff > 0 ? 'positive' : diff < 0 ? 'negative' : ''}>
                                  {diff !== '--' ? `${diff > 0 ? '+' : ''}${diff}` : '--'}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}