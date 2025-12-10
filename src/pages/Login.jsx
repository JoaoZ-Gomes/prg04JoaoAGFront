import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  const fazerLogin = () => {
    if (usuario.trim() !== "" && senha.trim() !== "") {
      alert(`Login realizado! Bem-vindo ${usuario}`)
      setUsuario('')
      setSenha('')
    } else {
      alert("Preencha todos os campos!")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fazerLogin()
    }
  }

  return (
    <div className="main-login">
      <div className="left-login">
        <h1>Faça login <br /> E entre pro nosso Time!</h1>
        <img src="/assets/svg/gymguy.svg" className="left-login-image" alt="gymguy" />
      </div>

      <div className="right-login">
        <div className="card-login">
          <h1>Login</h1>

          <div className="textfield">
            <label htmlFor="usuario">Usuário</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Usuário"
              required
            />
          </div>

          <div className="textfield">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Senha"
              required
            />
          </div>

          <button className="btn-login" onClick={fazerLogin}>
            Login
          </button>
          <button className="btn-cadastro" onClick={() => navigate('/cadastro')}>
            Cadastrar
          </button>

          <div className="miss-password">
            <a href="#miss-password"><p>Esqueci minha senha</p></a>
          </div>

        
        </div>
      </div>
    </div>
  )
}
