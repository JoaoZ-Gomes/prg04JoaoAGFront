import React, { useState } from 'react'
import ClientSidebar from '../../components/sidebars/ClientSidebar'
import '../../components/layouts/ClientLayout/ClientLayout.css'
import './Consultor.css'

function ChatTab() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Consultor', text: 'Olá! Como posso ajudar você hoje?', timestamp: '10:30' },
    { id: 2, sender: 'Você', text: 'Tenho dúvidas sobre o treino de peito.', timestamp: '10:32' },
    { id: 3, sender: 'Consultor', text: 'Claro! O que você gostaria de saber?', timestamp: '10:35' },
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'Você',
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, newMessage])
      setMessage('')
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender === 'Você' ? 'sent' : 'received'}`}>
            <div className="message-content">
              <p>{msg.text}</p>
              <span className="timestamp">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  )
}

function HistoricoTab() {
  const [items] = useState([
    { id: 1, date: '2026-01-20', subject: 'Ajuste de treino', summary: 'Troca de exercícios no treino A' },
    { id: 2, date: '2026-01-10', subject: 'Avaliação inicial', summary: 'Feedback sobre dores e limitações' },
  ])

  return (
    <div className="historico">
      <h3>Histórico de atendimentos</h3>
      <ul>
        {items.map(i => (
          <li key={i.id} className="hist-item">
            <strong>{i.subject}</strong>
            <div className="hist-meta">{i.date} — {i.summary}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function InfoTab() {
  return (
    <div className="info">
      <h3>Informações do Consultor</h3>
      <p>Horário de atendimento: Seg-Sex, 09:00 - 18:00</p>
      <p>Email: suporte@phteam.com</p>
      <p>Telefone: (11) 9xxxx-xxxx</p>
      <p>Observação: Para solicitações de treino personalizada, envie uma mensagem no chat.</p>
    </div>
  )
}

export default function Consultor() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="client-page-layout">
      <ClientSidebar />
      <div className="client-main-content">
        <div className="consultor-container">
          <div className="consultor-header">
            <h1>Atendimento ao Cliente</h1>
            <p>Fale com um consultor ou revise atendimentos anteriores</p>
          </div>

          <div className="tabs">
            <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>Chat</button>
            <button className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`} onClick={() => setActiveTab('historico')}>Histórico</button>
            <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Info</button>
          </div>

          <div className="tab-content">
            {activeTab === 'chat' && <ChatTab />}
            {activeTab === 'historico' && <HistoricoTab />}
            {activeTab === 'info' && <InfoTab />}
          </div>
        </div>
      </div>
    </div>
  )
}