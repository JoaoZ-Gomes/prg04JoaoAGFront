import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Profile from './pages/Profile'
import ConsultantDashboard from './pages/ConsultantDashboard'
import TrainingCreator from './pages/TrainingCreator'
import './App.css'

function AppContent() {
  const location = useLocation()
  const isLoginPage =
    location.pathname === '/login' ||
    location.pathname === '/cadastro' ||
    location.pathname.startsWith('/consultor')

  return (
    <>
      {!isLoginPage && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/consultor/dashboard" element={<ConsultantDashboard />} />
          <Route path="/consultor/criar-treino" element={<TrainingCreator />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
