import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserEmail, getUserRole } from '../../services/authService';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const email = getUserEmail();
    const role = getUserRole();

    if (!email) {
      navigate('/login');
      return;
    }

    setUserEmail(email);
    setUserRole(role || 'Usuário');
    setLoading(false);
  }, [navigate]);

  const getDashboardPath = () => {
    if (userRole === 'Cliente') return '/cliente/dashboard';
    if (userRole === 'Consultor') return '/consultor/dashboard';
    return '/';
  };

  if (loading) {
    return <div className="profile-container">Carregando...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Minha Conta</h1>
          <p>Informações do seu perfil</p>
        </div>

        <div className="profile-card">
          <div className="profile-section">
            <h2>Dados da Conta</h2>
            
            <div className="profile-field">
              <label>Email</label>
              <p className="profile-value">{userEmail}</p>
            </div>

            <div className="profile-field">
              <label>Tipo de Usuário</label>
              <p className="profile-value">
                {userRole === 'Cliente' ? '👤 Cliente' : userRole === 'Consultor' ? '👨‍🏫 Consultor' : userRole}
              </p>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="btn-voltar-dashboard"
              onClick={() => navigate(getDashboardPath())}
            >
              ← Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;