import React, { useState } from 'react'
import ClientSidebar from '../../components/sidebars/ClientSidebar'
import '../../components/layouts/ClientLayout/ClientLayout.css'
import './Consultor.css'

export default function Consultor() {
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
      setMessages([...messages, newMessage])
      setMessage('')
    }
  }

  return (
    <div className="client-page-layout">
      <ClientSidebar />
      <div className="client-main-content">
        <div className="consultor-container">
          <div className="consultor-header">
            <h1>Fale com seu Consultor</h1>
            <p>Envie mensagens e tire suas dúvidas</p>
          </div>

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
        </div>
      </div>
    </div>
  )
}