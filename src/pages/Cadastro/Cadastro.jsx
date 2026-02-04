import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as clienteService from '../../services/clienteService'
import SuccessModal from '../../components/common/SuccessModal/SuccessModal'
import './Cadastro.css'

/**
 * Componente funcional da tela de Cadastro de Cliente.
 * Gerencia a interface, o estado do formulário e orquestra a submissão dos dados
 * para a API de Backend, tratando os resultados e erros.
 */
export default function Cadastro() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showSuccess, setShowSuccess] = useState(false)
    
    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',           
        dataNascimento: '', 
        telefone: '',      
    })

    /**
     * Tratador universal de mudanças em elementos de input e seleção.
     * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de mudança.
     */
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((s) => ({ ...s, [name]: value }))
    }

    /**
     * Lógica de submissão. Executa validações primárias e inicia a comunicação com o Backend.
     * @param {React.FormEvent} e - Evento de submissão do formulário.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        // 1. VALIDAÇÃO DE OBRIGATORIEDADE
        if (!form.nome || !form.email || !form.senha || !form.cpf || !form.dataNascimento) {
            setError('❌ Preencha todos os campos obrigatórios: Nome, Email, Senha, CPF e Data de Nascimento.')
            return
        }
        
        // 2. VALIDAÇÃO DE EMAIL
        if (!form.email.includes('@')) {
            setError('❌ Digite um email válido.')
            return;
        }

        // 3. VALIDAÇÃO DE SENHA
        if (form.senha.length < 6) {
            setError('❌ A senha deve ter no mínimo 6 caracteres.')
            return;
        }
        
        // 4. VALIDAÇÃO DE REGRA DE DADOS (CPF)
        if (form.cpf.length !== 11 || !/^\d+$/.test(form.cpf)) {
             setError('❌ O CPF deve conter exatamente 11 dígitos numéricos.')
             return;
        }

        setLoading(true)

        // 5. CONSTRUÇÃO DO PAYLOAD
        const clienteData = {
            nome: form.nome.trim(),
            email: form.email.trim(),
            senha: form.senha,
            cpf: form.cpf.trim(),
            dataNascimento: form.dataNascimento,
        }
        
        // Adicionar telefone apenas se preenchido
        if (form.telefone && form.telefone.trim()) {
            clienteData.telefone = form.telefone.trim();
        }

        try {
            // 6. REQUISIÇÃO PARA A API USANDO O SERVIÇO
            await clienteService.criarCliente(clienteData)
            
            // Sucesso - Mostra modal de sucesso
            setShowSuccess(true)
            
            // Aguarda 2.5 segundos antes de redirecionar
            setTimeout(() => {
                navigate('/login')
            }, 2500)

        } catch (err) {
            console.error("Erro ao criar cliente:", err)
            
            let errorMessage = '❌ Erro ao realizar o cadastro. Tente novamente.';
            
            // Trata erros específicos do backend
            if (err.message && err.message.includes('já existe')) {
                errorMessage = '❌ Este CPF já está cadastrado no sistema.';
            } else if (err.message && err.message.includes('email')) {
                errorMessage = '❌ Este email já está cadastrado. Use outro email.';
            } else if (err.message && err.message.includes('CPF')) {
                errorMessage = '❌ CPF inválido. Verifique o número digitado.';
            } else if (err.message && err.message.includes('400')) {
                errorMessage = '❌ Dados inválidos. Verifique todas as informações.';
            } else if (err.message && err.message.includes('500')) {
                errorMessage = '❌ Erro no servidor. Tente novamente mais tarde.';
            } else if (err.message) {
                errorMessage = '❌ ' + err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    // ----------------------------------------------------------------------
    // RENDERIZAÇÃO
    // O markup do formulário deve refletir exatamente os campos definidos no estado 'form'.
    // ----------------------------------------------------------------------
    return (
        <>
            {showSuccess && (
                <SuccessModal 
                    title="Cadastro Concluído! 🎉"
                    message="Bem-vindo! Você já pode fazer login com suas credenciais."
                    autoClose={true}
                    autoCloseTime={2500}
                />
            )}
            <div className="main-cadastro-coluna-unica">
                <div className="card-cadastro">
                    <h1>Cadastre-se</h1>
                    
                    {/* Exibe a mensagem de erro da API ou de validação */}
                    {error && (
                        <p className="error-message">
                            <i className="fas fa-exclamation-triangle"></i>
                            {error}
                        </p>
                    )} 

                    <form id="form-cadastro" onSubmit={handleSubmit}>

                        {/* DADOS DE IDENTIFICAÇÃO BÁSICA */}
                        <div className="textfield">
                            <label htmlFor="nome">
                                Nome Completo <span className="required-asterisk">*</span>
                            </label>
                            <input type="text" id="nome" name="nome" placeholder="Seu Nome" value={form.nome} onChange={handleChange} required />
                        </div>

                        <div className="textfield">
                            <label htmlFor="email">
                                E-mail <span className="required-asterisk">*</span>
                            </label>
                            <input type="email" id="email" name="email" placeholder="email@exemplo.com" value={form.email} onChange={handleChange} required />
                        </div>

                        <div className="textfield">
                            <label htmlFor="senha">
                                Senha <span className="required-asterisk">*</span>
                            </label>
                            <input type="password" id="senha" name="senha" placeholder="Crie uma senha (mín. 6 caracteres)" value={form.senha} onChange={handleChange} required />
                        </div>

                        {/* DOCUMENTAÇÃO E CONTATO */}
                        <div className="form-row">
                            <div className="textfield">
                                <label htmlFor="cpf">
                                    CPF (Somente números) <span className="required-asterisk">*</span>
                                </label>
                                <input type="text" id="cpf" name="cpf" placeholder="00011122233" maxLength="11" value={form.cpf} onChange={handleChange} required />
                            </div>
                        </div>
                        
                        <div className="textfield">
                            <label htmlFor="dataNascimento">
                                Data de Nascimento <span className="required-asterisk">*</span>
                            </label>
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
        </>
    )
}