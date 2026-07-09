import { useMemo, useState } from 'react'
import LayEmpresa from './layout_prof.jsx'

import '../../css/oferecer.css'

import { createServico } from '../../services/api'


const CATEGORIAS = ['Desenvolvimento', 'Design', 'Marketing', 'Consultoria']
const TIPOS_COBRANCA = ['Por hora', 'Projeto fechado', 'Mensal']

export default function PublicarServicoEmpresa() {
  const usuarioLogado = useMemo(() => {
    try {
      const raw = localStorage.getItem('usuario')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  // campos
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('Desenvolvimento')
  const [descricao, setDescricao] = useState('')

  const [tipoCobranca, setTipoCobranca] = useState('Por hora')
  const [valor, setValor] = useState('')

  const [loading, setLoading] = useState(false)
  const perfilId = usuarioLogado?.perfilId


  function handleCancelar() {
    window.history.back()
  }

  async function handleSalvar(e) {
    e.preventDefault()

    // validações mínimas (as que realmente precisam existir para persistir)
    if (!titulo.trim() || !descricao.trim()) return

    setLoading(true)
    try {
      // regras de preço:
      // - Por hora: R$ 20/h
      // - Mensal: R$ 200/m
      // - Projeto fechado: R$ 2.000/projeto
      const precoCalculado = (() => {
        const tipo = (tipoCobranca || '').toLowerCase()
        if (tipo.includes('hora')) return 20
        if (tipo.includes('mensal')) return 200
        return 2000
      })()

      const payload = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        preco: precoCalculado,
        categoria,
        empresaId: perfilId
      }


      const created = await createServico(payload)

      console.log('created servico', created)
      alert('Serviço cadastrado com sucesso!')

      setTitulo('')
      setDescricao('')
      setValor('')
    } catch (err) {
      console.error(err)
      alert('Falha ao salvar serviço. Verifique o backend e o console.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <LayEmpresa>
      <div className="oferecer-page">
        <div className="cadastro-servico-container">
          <header className="cadastro-servico-header">
            <h1>Publicar Serviço</h1>
            <p>Divulgue o serviço da sua empresa e conecte-se com profissionais e clientes.</p>
          </header>

          <form className="oferecer-form" onSubmit={handleSalvar}>
            <section className="cadastro-servico-card">
              <h2 className="cadastro-servico-card-title">
                <span className="cadastro-servico-card-title-icone" aria-hidden>
                  🧩
                </span>
                Detalhes do Serviço
              </h2>

              <div className="cadastro-servico-grid">
                <div className="field">
                  <label>
                    Título do Serviço <span className="required">*</span>
                  </label>
                  <input
                    className="input"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Consultoria em Transformação Digital"
                    required
                  />
                </div>

                <div className="field">
                  <label>Categoria</label>
                  <select className="input" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field" style={{ marginTop: 14 }}>
                <label>
                  Descrição <span className="required">*</span>
                </label>
                <textarea
                  className="textarea"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva detalhadamente o que a empresa oferece, sua metodologia e diferenciais... e informe um e-mail de contato"
                  rows={6}
                  required
                />
              </div>
            </section>

            <section className="cadastro-servico-card">
              <h2 className="cadastro-servico-card-title">
                <span className="cadastro-servico-card-title-icone" aria-hidden>
                  💰
                </span>
                Precificação
              </h2>

              <div className="cadastro-servico-grid cadastro-servico-grid-2">
                <div className="field">
                  <label>Tipo de Cobrança</label>
                  <select
                    className="input"
                    value={tipoCobranca}
                    onChange={(e) => setTipoCobranca(e.target.value)}
                  >
                    {TIPOS_COBRANCA.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Valor</label>
                  <input
                    className="input"
                    type="number"
                    inputMode="decimal"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="Ex: 150"
                    required
                  />
                </div>
              </div>
            </section>


            <footer className="cadastro-servico-footer">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleCancelar}
                disabled={loading}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Serviço'}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </LayEmpresa>
  )
}
