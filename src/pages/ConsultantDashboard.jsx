import React from 'react'
import ConsultantSidebar from './ConsultantSidebar'
import './ConsultantLayout.css'
import './ConsultantDashboard.css'

// Dados de Clientes de Exemplo
const clientData = [
  { id: 1, nome: 'João Gomes', plano: 'Premium', status: 'Ativo', peso: 85.5, renovacao: '01/12/2025' },
  { id: 2, nome: 'Mariana Lima', plano: 'Padrão', status: 'Ativo', peso: 62.1, renovacao: '15/12/2025' },
  { id: 3, nome: 'Pedro Henrique', plano: 'Básico', status: 'Inativo', peso: 78.0, renovacao: '28/11/2025' },
  { id: 4, nome: 'Ana Costa', plano: 'Premium', status: 'Ativo', peso: 58.9, renovacao: '05/01/2026' },
]

export default function ConsultantDashboard() {
  const activeClients = clientData.filter(c => c.status === 'Ativo').length
  const renewalDue = clientData.filter(c => c.renovacao === '28/11/2025').length

  return (
    <div className="consultant-page-layout">
      <ConsultantSidebar />

      <div className="consultant-main-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Bem-vindo(a), Consultor(a)!</h1>
            <p>Visão geral e gerenciamento dos seus clientes.</p>
          </div>

          {/* -------------------- RESUMO E MÉTRICAS -------------------- */}
          <div className="metrics-summary">
            <div className="metric-box dashboard-metric">
              <i className="fas fa-users icon-red"></i>
              <span className="value">{clientData.length}</span>
              <span className="label">Total de Clientes</span>
            </div>
            <div className="metric-box dashboard-metric">
              <i className="fas fa-check-circle icon-green"></i>
              <span className="value">{activeClients}</span>
              <span className="label">Clientes Ativos</span>
            </div>
            <div className="metric-box dashboard-metric alert">
              <i className="fas fa-exclamation-triangle icon-yellow"></i>
              <span className="value">{renewalDue}</span>
              <span className="label">Renovações Vencendo</span>
            </div>
            <div className="metric-box dashboard-metric">
              <i className="fas fa-dumbbell icon-blue"></i>
              <span className="value">42</span>
              <span className="label">Treinos Criados</span>
            </div>
          </div>

          {/* -------------------- GERENCIAMENTO DE CLIENTES -------------------- */}
          <div className="client-management-section">
            <div className="section-header">
              <h2><i className="fas fa-list-alt"></i> Lista de Clientes</h2>
              <button className="btn-primary"><i className="fas fa-user-plus"></i> Novo Cliente</button>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Plano</th>
                    <th>Status</th>
                    <th>Peso Atual (kg)</th>
                    <th>Próxima Renovação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientData.map(client => (
                    <tr key={client.id}>
                      <td data-label="Cliente">{client.nome}</td>
                      <td data-label="Plano"><span className={`plan-tag ${client.plano.toLowerCase()}`}>{client.plano}</span></td>
                      <td data-label="Status" className={client.status === 'Ativo' ? 'status-active' : 'status-inactive'}>
                        {client.status}
                      </td>
                      <td data-label="Peso">{client.peso}</td>
                      <td data-label="Renovação">{client.renovacao}</td>
                      <td data-label="Ações" className="action-cell">
                        <button className="btn-icon view-btn" title="Ver Perfil"><i className="fas fa-eye"></i></button>
                        <button className="btn-icon edit-btn" title="Editar Treino"><i className="fas fa-pencil-alt"></i></button>
                        <button className="btn-icon whatsapp-btn" title="Contatar"><i className="fab fa-whatsapp"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* -------------------- CRIAÇÃO DE TREINO RÁPIDA -------------------- */}
           <div className="quick-access-section">
            <h2><i className="fas fa-running"></i> Ações Rápidas</h2>
            <div className="quick-action-cards">
                <button className="quick-card">
                    <i className="fas fa-clipboard-list"></i>
                    <span>Montar Nova Ficha</span>
                </button>
                <button className="quick-card">
                    <i className="fas fa-chart-bar"></i>
                    <span>Ver Relatórios</span>
                </button>
                 <button className="quick-card">
                    <i className="fas fa-bell"></i>
                    <span>Ver Feedbacks (2)</span>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
