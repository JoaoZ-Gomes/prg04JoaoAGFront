import React, { useEffect, useState } from 'react'
import {
  buscarTodosObjetivos,
  criarObjetivo,
  deletarObjetivo,
} from '../../services/objetivoService'
import './Objetivos.css'

export default function Objetivos() {
  const [objetivos, setObjetivos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ titulo: '', descricao: '' })

  const load = async () => {
    setLoading(true)
    try {
      const data = await buscarTodosObjetivos(0, 1000)
      setObjetivos(Array.isArray(data) ? data : data)
    } catch (e) {
      setError(e.message || 'Erro ao carregar objetivos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await criarObjetivo(form)
      setForm({ titulo: '', descricao: '' })
      await load()
    } catch (e) {
      setError(e.message || 'Erro ao criar objetivo')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão do objetivo?')) return
    try {
      await deletarObjetivo(id)
      setObjetivos((prev) => prev.filter((o) => o.id !== id))
    } catch (e) {
      setError(e.message || 'Erro ao deletar objetivo')
    }
  }

  return (
    <div className="objetivos-page container">
      <h1>Objetivos</h1>

      <section className="objetivos-form">
        <h2>Novo Objetivo</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Título</label>
            <input name="titulo" value={form.titulo} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Descrição</label>
            <textarea name="descricao" value={form.descricao} onChange={handleChange} />
          </div>
          <button className="btn-primary" type="submit">Adicionar</button>
        </form>
      </section>

      <section className="objetivos-list">
        <h2>Lista de Objetivos</h2>
        {loading && <p>Carregando...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && objetivos && objetivos.length === 0 && <p>Nenhum objetivo.</p>}

        <ul>
          {objetivos && objetivos.map((o) => (
            <li key={o.id} className="objetivo-item">
              <div className="meta">
                <strong>{o.titulo || o.nome || 'Sem título'}</strong>
                <p>{o.descricao}</p>
              </div>
              <div className="actions">
                <button className="btn-danger" onClick={() => handleDelete(o.id)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
