import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

// Endpoint de Autenticação configurado no seu Spring Security
const LOGIN_API_URL = 'http://localhost:8080/api/auth/login';

/**
 * Componente da tela de Login.
 * Realiza a submissão de credenciais para o Backend e armazena o token JWT.
 */
export default function Login() {
    const navigate = useNavigate()
    
    // RENOMEADO: 'usuario' para 'email' para alinhar com o DTO do Backend
    const [email, setEmail] = useState('') 
    const [senha, setSenha] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null) // Para exibir erros da API

    /**
     * Função assíncrona para realizar o Login e obter o JWT.
     * Alinhada com o LoginRequestDTO {email, senha} do Backend.
     */
    const fazerLogin = async () => {
        setError(null);
        
        if (email.trim() === "" || senha.trim() === "") {
            setError("Preencha o email e a senha!");
            return;
        }

        setLoading(true);
        
        // Payload alinhado com o LoginRequestDTO
        const credentials = { email, senha };

        try {
            const response = await fetch(LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                // Sucesso: Recebe o JWT e os dados do usuário (LoginResponseDTO)
                const data = await response.json(); 
                
                // 1. ARMAZENAMENTO DO TOKEN E ROLE NO LOCAL STORAGE
                localStorage.setItem('jwt_token', data.token);
                localStorage.setItem('user_role', data.tipoUsuario); // Ex: Cliente ou Consultor

                // 2. REDIRECIONAMENTO BASEADO NA ROLE
                if (data.tipoUsuario === 'Consultor') {
                    navigate('/consultor/dashboard');
                } else if (data.tipoUsuario === 'Cliente') {
                    navigate('/cliente/dashboard');
                } else {
                    // Fallback para roles não mapeadas
                    navigate('/'); 
                }

            } else if (response.status === 401) {
                // Credenciais Inválidas (Spring Security / AuthenticationManager falhou)
                setError('Credenciais inválidas. Verifique seu email e senha.');
            } else {
                // Outros erros da API
                setError('Erro ao efetuar login. Tente novamente mais tarde.');
            }

        } catch (err) {
            console.error('Erro de rede/API:', err);
            setError('Não foi possível conectar ao servidor de autenticação.');
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