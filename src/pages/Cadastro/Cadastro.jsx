import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cadastro.css'

// ----------------------------------------------------------------------
// CONFIGURAÇÃO DA API
// URL do endpoint para a criação de um novo Cliente.
// Em ambientes de produção, esta URL deve ser configurada via variáveis de ambiente.
// ----------------------------------------------------------------------
const API_URL = 'http://localhost:8080/api/clientes' 

/**
 * Componente funcional da tela de Cadastro de Cliente.
 * Gerencia a interface, o estado do formulário e orquestra a submissão dos dados
 * para a API de Backend, tratando os resultados e erros.
 */
export default function Cadastro() {
    // Hooks para navegação e controle do estado da requisição.
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    // O estado do formulário (useState) replica a estrutura do ClienteRequestDTO 
    // do Spring Boot para garantir a integridade do payload enviado.
    const [form, setForm] = useState({
        // Campos de Autenticação e Identificação (Obrigatórios)
        nome: '',
        email: '',
        senha: '',
        
        // Campos de Documentação (Obrigatórios no DTO)
        cpf: '',           
        dataNascimento: '', 
        
        // Campos de Contato (Opcionais)
        rg: '',            
        telefone: '',      
    })

    /**
     * Tratador universal de mudanças em elementos de input e seleção.
     * Atualiza o estado 'form' dinamicamente com base no atributo 'name'.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - Evento de mudança.
     */
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((s) => ({ ...s, [name]: value }))
    }

    /**
     * Lógica de submissão. Executa validações primárias e inicia a comunicação com o Backend.
     * Realiza o tratamento de erros de rede ou erros de validação da API (Status 4xx/5xx).
     * @param {React.FormEvent} e - Evento de submissão do formulário.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null) // Reseta o erro para nova tentativa

        // 1. VALIDAÇÃO DE OBRIGATORIEDADE
        if (!form.nome || !form.email || !form.senha || !form.cpf || !form.dataNascimento) {
            setError('Por favor, preencha todos os campos obrigatórios: Nome, Email, Senha, CPF e Data de Nascimento.')
            return
        }
        
        // 2. VALIDAÇÃO DE REGRA DE DADOS (CPF)
        if (form.cpf.length !== 11 || !/^\d+$/.test(form.cpf)) {
             setError('O CPF deve conter exatamente 11 dígitos numéricos.')
             return;
        }

        setLoading(true)

        // 3. CONSTRUÇÃO DO PAYLOAD
        // Mapeamento final dos dados para o formato JSON esperado pelo ClienteRequestDTO.
        const clienteData = {
            nome: form.nome,
            email: form.email,
            senha: form.senha,
            cpf: form.cpf,
            dataNascimento: form.dataNascimento, // Formato YYYY-MM-DD
            
            // Tratamento de campos opcionais: garante que sejam enviados como 'null' se vazios.
            rg: form.rg || null, 
            telefone: form.telefone || null,
        }

        try {
            // 4. REQUISIÇÃO POST PARA A API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData),
            })

            // 5. TRATAMENTO DA RESPOSTA
            if (response.ok) {
                // Sucesso (Status 200/201). Notifica o usuário e redireciona.
                alert('✅ Cadastro realizado com sucesso! Você já pode fazer login.')
                navigate('/login')
            } else {
                // Erro de API (4xx ou 5xx). Tenta ler a mensagem de erro fornecida pelo servidor.
                const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
                
                let errorMessage = '❌ Erro ao realizar o cadastro. Tente novamente.';
                
                if (errorData.message) {
                     // Exibe a mensagem de Regra de Negócio ou Validação do Backend (e.g., "E-mail já cadastrado").
                     errorMessage = errorData.message; 
                }

                setError(errorMessage);
            }
        } catch (err) {
            // Erro de comunicação (Servidor offline, CORS, etc.)
            console.error("Erro na comunicação com a API:", err)
            setError('❌ Não foi possível conectar ao servidor. Verifique sua conexão ou se a API está online.')
        } finally {
            setLoading(false)
        }
    }

    // ----------------------------------------------------------------------
    // RENDERIZAÇÃO
    // O markup do formulário deve refletir exatamente os campos definidos no estado 'form'.
    // ----------------------------------------------------------------------
    return (
        <div className="main-cadastro-coluna-unica">
            <div className="card-cadastro">
                <h1>Cadastre-se</h1>
                
                {/* Exibe a mensagem de erro da API ou de validação */}
                {error && <p className="error-message">{error}</p>} 

                <form id="form-cadastro" onSubmit={handleSubmit}>

                    {/* DADOS DE IDENTIFICAÇÃO BÁSICA */}
                    <div className="textfield">
                        <label htmlFor="nome">Nome Completo</label>
                        <input type="text" id="nome" name="nome" placeholder="Seu Nome" value={form.nome} onChange={handleChange} required />
                    </div>

                    <div className="textfield">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder="email@exemplo.com" value={form.email} onChange={handleChange} required />
                    </div>

                    <div className="textfield">
                        <label htmlFor="senha">Senha</label>
                        <input type="password" id="senha" name="senha" placeholder="Crie uma senha" value={form.senha} onChange={handleChange} required />
                    </div>

                    {/* DOCUMENTAÇÃO E CONTATO */}
                    <div className="form-row">
                        <div className="textfield">
                            <label htmlFor="cpf">CPF (Somente números)</label>
                            <input type="text" id="cpf" name="cpf" placeholder="00011122233" maxLength="11" value={form.cpf} onChange={handleChange} required />
                        </div>

                        <div className="textfield">
                            <label htmlFor="rg">RG (Opcional)</label>
                            <input type="text" id="rg" name="rg" placeholder="Opcional" value={form.rg} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <div className="textfield">
                        <label htmlFor="dataNascimento">Data de Nascimento</label>
                        {/* O atributo 'name' é crucial para a sincronização com o DTO */}
                        <input type="date" id="dataNascimento" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} required max="2025-12-31" />
                    </div>
                    
                    <div className="textfield">
                        <label htmlFor="telefone">Telefone (Opcional)</label>
                        <input type="tel" id="telefone" name="telefone" placeholder="(99) 99999-9999" value={form.telefone} onChange={handleChange} />
                    </div>
                    
                    {/* Botão de Submissão com estado de carregamento */}
                    <button type="submit" className="btn-login" style={{marginTop:25}} disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                    </button>
                </form>

                <div className="miss-password" style={{marginTop:20}}>
                    <a href="/login">Já tem conta? Faça Login</a>
                </div>

            </div>
        </div>
    )
}