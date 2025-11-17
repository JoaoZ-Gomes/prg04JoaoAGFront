import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cadastro.css'

export default function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    objetivo: '',
    peso: '',
    altura: '',
    nascimento: '',
    tem_condicoes: 'nao',
    descricao_saude: '',
    dias: []
  })

  const toggleDia = (value) => {
    setForm((s) => {
      const dias = s.dias.includes(value) ? s.dias.filter(d => d !== value) : [...s.dias, value]
      return { ...s, dias }
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // validação simples
    if (!form.nome || !form.email || !form.senha) {
      alert('Preencha nome, email e senha')
      return
    }

    // aqui você salvaria os dados (API/localStorage)
    alert('Cadastro realizado com sucesso!')
    navigate('/login')
  }

  return (
    <div className="main-cadastro-coluna-unica">
      <div className="card-cadastro">
        <h1>Cadastre-se</h1>

        <form id="form-cadastro" onSubmit={handleSubmit}>

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

          <div className="textfield">
            <label htmlFor="objetivo">Objetivo Principal</label>
            <select id="objetivo" name="objetivo" value={form.objetivo} onChange={handleChange} required>
              <option value="" disabled>Selecione seu objetivo...</option>
              <option value="emagrecimento">Emagrecimento</option>
              <option value="hipertrofia">Hipertrofia (Ganho de Massa)</option>
              <option value="definicao">Definição Muscular</option>
              <option value="performance">Aumento de Performance</option>
              <option value="saude">Saúde e Bem-Estar</option>
            </select>
          </div>

          <div className="textfield">
            <label>Dias da Semana Disponíveis para Treino</label>
            <div className="form-row dias-disponiveis-container">
              {['segunda','terca','quarta','quinta','sexta','sabado','domingo'].map(d => (
                <label key={d} className={`checkbox-label-dias ${form.dias.includes(d) ? 'checked' : ''}`}>
                  <input type="checkbox" name="dias_disponiveis" value={d} checked={form.dias.includes(d)} onChange={() => toggleDia(d)} />
                  <span>{d.substring(0,3).charAt(0).toUpperCase() + d.substring(1,3)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="textfield">
              <label htmlFor="peso">Peso (em kg)</label>
              <input type="number" id="peso" name="peso" placeholder="Ex: 75.5" step="0.1" min="20" max="600" value={form.peso} onChange={handleChange} required />
            </div>
            <div className="textfield">
              <label htmlFor="altura">Altura (em metros)</label>
              <input type="number" id="altura" name="altura" placeholder="Ex: 1.75" step="0.01" min="0.50" max="3.00" value={form.altura} onChange={handleChange} required />
            </div>
          </div>

          <div className="textfield">
            <label htmlFor="nascimento">Data de Nascimento</label>
            <input type="date" id="nascimento" name="nascimento" value={form.nascimento} onChange={handleChange} required max="2025-11-07" />
          </div>

          <div className="textfield">
            <label>Possui alguma condição médica, lesão crônica ou dor limitante?</label>
            <div style={{display: 'flex', gap: '20px', marginTop: 5}}>
              <label>
                <input type="radio" id="condicoes-sim" name="tem_condicoes" value="sim" checked={form.tem_condicoes === 'sim'} onChange={handleChange} /> Sim
              </label>
              <label>
                <input type="radio" id="condicoes-nao" name="tem_condicoes" value="nao" checked={form.tem_condicoes === 'nao'} onChange={handleChange} /> Não
              </label>
            </div>
          </div>

          <div className="textfield">
            <label htmlFor="descricao-saude">Descreva sua condição/lesão (se aplicável):</label>
            <textarea id="descricao-saude" name="descricao_saude" rows="4" placeholder="Ex: Hipertensão, dor na lombar. Se não houver, deixe em branco." value={form.descricao_saude} onChange={handleChange}></textarea>
          </div>

          <button type="submit" className="btn-login" style={{marginTop:25}}>Finalizar Cadastro</button>
        </form>

        <div className="miss-password" style={{marginTop:20}}>
          <a href="/login">Já tem conta? Faça Login</a>
        </div>

      </div>
    </div>
  )
}
