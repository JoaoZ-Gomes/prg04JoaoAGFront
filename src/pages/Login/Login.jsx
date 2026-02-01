import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from '../../services/authService'
import './Login.css'

/**
 * Componente da tela de Login.
 * Realiza a submissão de credenciais para o Backend e armazena o token JWT.
 */
export default function Login() {
    const navigate = useNavigate()
    
    const [email, setEmail] = useState('') 
    const [senha, setSenha] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    /**
     * Função assíncrona para realizar o Login e obter o JWT.
     * Utiliza o serviço de autenticação.
     */
    const fazerLogin = async () => {
        setError(null);
        
        if (email.trim() === "" || senha.trim() === "") {
            setError("Preencha o email e a senha!");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.login(email, senha);
            
            // Redirecionamento baseado na role
            if (response.tipoUsuario === 'Consultor') {
                navigate('/consultor/dashboard');
            } else if (response.tipoUsuario === 'Cliente') {
                navigate('/cliente/dashboard');
            } else {
                // Fallback para roles não mapeadas
                navigate('/'); 
            }

        } catch (err) {
            console.error('Erro ao fazer login:', err);
            
            // Tratamento de erros
            if (err.message && err.message.includes('401')) {
                setError('Credenciais inválidas. Verifique seu email e senha.');
            } else {
                setError('Não foi possível conectar ao servidor de autenticação.');
            }
        } finally {
            setLoading(false);
        }
    }

    /**
     * Tratador para tecla 'Enter'.
     * @param {React.KeyboardEvent} e - Evento de teclado.
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fazerLogin();
        }
    }

    return (
        <div className="main-login">
            <div className="left-login">
                <h1>Faça login <br /> E entre pro nosso Time!</h1>
                {/* [Mantenha a sua imagem] */}
                <img src="/assets/svg/gymguy.svg" className="left-login-image" alt="gymguy" />
            </div>

            <div className="right-login">
                <div className="card-login">
                    <h1>Login</h1>

                    {/* Exibição da mensagem de erro */}
                    {error && <div className="error-message"><i className="fas fa-exclamation-triangle"></i>{error}</div>}

                    <div className="textfield">
                        <label htmlFor="email">Email</label>
                        {/* INPUT RENOMEADO PARA EMAIL */}
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Seu email"
                            required
                        />
                    </div>

                    <div className="textfield">
                        <label htmlFor="senha">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Senha"
                            required
                        />
                    </div>
                    
                    {/* Botão de Login com estado de carregamento/loading */}
                    <button className="btn-login" onClick={fazerLogin} disabled={loading}>
                        {loading ? 'Entrando...' : 'Login'}
                    </button>
                    
                    <button className="btn-cadastro" onClick={() => navigate('/cadastro')} disabled={loading}>
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