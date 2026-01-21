import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/common/Header/Header'
import Footer from './components/common/Footer/Footer'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
import Profile from './pages/Profile/Profile'
import ConsultantDashboard from './pages/ConsultantDashboard/ConsultantDashboard'
import TrainingCreator from './pages/TrainingCreator/TrainingCreator'
import ClienteDashboard from './pages/ClienteDashboard/ClienteDashboard'
import './App.css'

function AppContent() {
  const location = useLocation()
  const isLoginPage =
    location.pathname === '/login' ||
    location.pathname === '/cadastro' ||
    location.pathname.startsWith('/consultor') ||
    location.pathname.startsWith('/cliente')

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
          <Route path="/cliente/dashboard" element={<ClienteDashboard />} />
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
