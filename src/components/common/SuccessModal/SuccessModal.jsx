import { useState, useEffect } from 'react'
import './SuccessModal.css'

/**
 * Componente Modal de Sucesso
 * Exibe uma mensagem bonita ao usuário quando uma ação é concluída com sucesso
 */
export default function SuccessModal({ title, message, onClose, autoClose = true, autoCloseTime = 2500 }) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                handleClose()
            }, autoCloseTime)
            return () => clearTimeout(timer)
        }
    }, [autoClose, autoCloseTime])

    const handleClose = () => {
        setIsVisible(false)
        if (onClose) onClose()
    }

    if (!isVisible) return null

    return (
        <div className="success-modal-overlay">
            <div className="success-modal-content">
                <div className="success-icon">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="32" fill="#10B981" opacity="0.1" />
                        <path d="M27 38L19 30M27 38L45 20" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2 className="success-title">{title}</h2>
                <p className="success-message">{message}</p>
                <button className="success-btn" onClick={handleClose}>
                    OK
                </button>
            </div>
        </div>
    )
}
