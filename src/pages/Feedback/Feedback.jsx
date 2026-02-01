import React, { useState } from 'react'
import ConsultantSidebar from '../../components/sidebars/ConsultantSidebar'
import '../../components/layouts/ConsultantLayout/ConsultantLayout.css'
import './Feedback.css'

const feedbacksData = [
  {
    id: 1,
    clientName: 'João Gomes',
    date: '2025-11-25',
    type: 'Treino',
    rating: 4,
    comment: 'Treino muito bom! Senti bastante os exercícios de peito. Só gostaria de mais variação nos exercícios de tríceps.',
    status: 'Novo'
  },
  {
    id: 2,
    clientName: 'Maria Silva',
    date: '2025-11-24',
    type: 'Dieta',
    rating: 5,
    comment: 'A dieta está perfeita! Estou me sentindo mais energizada e os resultados estão aparecendo.',
    status: 'Lido'
  },
  {
    id: 3,
    clientName: 'Carlos Santos',
    date: '2025-11-23',
    type: 'Geral',
    rating: 3,
    comment: 'Gostei do acompanhamento, mas às vezes demora para responder as mensagens.',
    status: 'Respondido'
  },
  {
    id: 4,
    clientName: 'Ana Oliveira',
    date: '2025-11-22',
    type: 'Treino',
    rating: 4,
    comment: 'Os treinos estão desafiadores e eficientes. Parabéns pelo trabalho!',
    status: 'Novo'
  }
]

export default function Feedback() {
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [filterStatus, setFilterStatus] = useState('Todos')

  const statuses = ['Todos', 'Novo', 'Lido', 'Respondido']

  const filteredFeedbacks = feedbacksData.filter(feedback =>
    filterStatus === 'Todos' || feedback.status === filterStatus
  )

  const handleStatusChange = (id, newStatus) => {
    // Simular mudança de status
    console.log(`Mudando status do feedback ${id} para ${newStatus}`)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
    ))
  }

  return (
    <div className="consultant-page-layout">
      <ConsultantSidebar />

      <div className="consultant-main-content">
        <div className="feedback-container">
          <div className="feedback-header">
            <h1>Feedbacks dos Clientes</h1>
            <p>Veja e gerencie os feedbacks recebidos</p>
          </div>

          <div className="filters">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-select"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="feedback-content">
            <div className="feedbacks-list">
              {filteredFeedbacks.map(feedback => (
                <div
                  key={feedback.id}
                  className={`feedback-item ${selectedFeedback?.id === feedback.id ? 'selected' : ''} ${feedback.status.toLowerCase()}`}
                  onClick={() => setSelectedFeedback(feedback)}
                >
                  <div className="feedback-header">
                    <h3>{feedback.clientName}</h3>
                    <span className={`status-badge ${feedback.status.toLowerCase()}`}>{feedback.status}</span>
                  </div>
                  <p className="feedback-type">{feedback.type}</p>
                  <div className="rating">{renderStars(feedback.rating)}</div>
                  <p className="feedback-date">{new Date(feedback.date).toLocaleDateString('pt-BR')}</p>
                  <p className="feedback-preview">{feedback.comment.substring(0, 100)}...</p>
                </div>
              ))}
            </div>

            {selectedFeedback && (
              <div className="feedback-details">
                <h2>Detalhes do Feedback</h2>
                <div className="detail-section">
                  <h3>Cliente: {selectedFeedback.clientName}</h3>
                  <p><strong>Data:</strong> {new Date(selectedFeedback.date).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Tipo:</strong> {selectedFeedback.type}</p>
                  <p><strong>Avaliação:</strong> {renderStars(selectedFeedback.rating)}</p>
                  <p><strong>Status:</strong>
                    <select
                      value={selectedFeedback.status}
                      onChange={(e) => handleStatusChange(selectedFeedback.id, e.target.value)}
                      className="status-select-small"
                    >
                      {statuses.slice(1).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </p>
                </div>
                <div className="detail-section">
                  <h3>Comentário</h3>
                  <p>{selectedFeedback.comment}</p>
                </div>
                <div className="actions">
                  <button className="btn-primary">Responder</button>
                  <button className="btn-secondary">Marcar como Lido</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}