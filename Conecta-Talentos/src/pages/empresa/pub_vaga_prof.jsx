import { useMemo, useState } from 'react'
import LayEmpresa from './layout_prof.jsx'

import '../../css/oferecer.css'

import { createVaga } from '../../services/api'

const AREAS = ['Desenvolvimento', 'Design', 'Marketing', 'Consultoria']
const TIPOS = ['CLT', 'PJ', 'ESTÁGIO', 'OUTROS']
const NIVEIS = ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista']

export default function PublicarVaga() {
    const usuarioLogado = useMemo(() => {
        try {
            const raw = localStorage.getItem('usuario')
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }, [])

    const perfilId = usuarioLogado?.perfilId

    // Informações básicas
    const [titulo, setTitulo] = useState('')
    const [area, setArea] = useState(AREAS[0])
    const [tipo, setTipo] = useState(TIPOS[0])
    const [nivelSenioridade, setNivelSenioridade] = useState(NIVEIS[1])
    const [localizacao, setLocalizacao] = useState('')
    const [remoto, setRemoto] = useState(false)

    // Remuneração
    const [salarioMinimo, setSalarioMinimo] = useState('')
    const [salarioMaximo, setSalarioMaximo] = useState('')

    // Detalhes
    const [descricao, setDescricao] = useState('')
    const [requisitos, setRequisitos] = useState('')
    const [beneficios, setBeneficios] = useState('')

    const [loading, setLoading] = useState(false)

    function handleCancelar() {
        window.history.back()
    }

    async function handlePublicar(e) {
        e.preventDefault()
        if (!titulo.trim()) return

        setLoading(true)
        try {
            const payload = {
                titulo: titulo.trim(),
                area,
                tipo,
                nivelSenioridade,
                localizacao: localizacao.trim(),
                remoto,
                salarioMinimo: salarioMinimo === '' ? null : Number(salarioMinimo),
                salarioMaximo: salarioMaximo === '' ? null : Number(salarioMaximo),
                descricao: descricao.trim(),
                requisitos: requisitos.trim(),
                beneficios: beneficios.trim(),
                empresaId: perfilId,
            }

            const created = await createVaga(payload)
            console.log('created vaga', created)
            alert('Vaga publicada com sucesso!')

            // limpa o formulário
            setTitulo('')
            setLocalizacao('')
            setRemoto(false)
            setSalarioMinimo('')
            setSalarioMaximo('')
            setDescricao('')
            setRequisitos('')
            setBeneficios('')
        } catch (err) {
            console.error(err)
            alert('Falha ao publicar vaga. Verifique o backend e o console.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <LayEmpresa>
            <div className="oferecer-page">
                <div className="cadastro-servico-container">
                    <header className="cadastro-servico-header">
                        <h1>Publicar Vaga</h1>
                        <p>Preencha os dados da vaga para começar a receber candidatos</p>
                    </header>

                    <form className="oferecer-form" onSubmit={handlePublicar}>
                        <section className="cadastro-servico-card">
                            <h2 className="cadastro-servico-card-title">
                                <span className="cadastro-servico-card-title-icone" aria-hidden>💼</span>
                                Informações Básicas
                            </h2>

                            <div className="field">
                                <label>
                                    Título da Vaga <span className="required">*</span>
                                </label>
                                <input
                                    className="input"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    placeholder="Ex: Desenvolvedor React Sênior"
                                    required
                                />
                            </div>

                            <div className="cadastro-servico-grid cadastro-servico-grid-2" style={{ marginTop: 14 }}>
                                <div className="field">
                                    <label>Área de Atuação</label>
                                    <select className="input" value={area} onChange={(e) => setArea(e.target.value)}>
                                        {AREAS.map((a) => (
                                            <option key={a} value={a}>{a}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Regime de Contratação</label>
                                    <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                                        {TIPOS.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="cadastro-servico-grid cadastro-servico-grid-2" style={{ marginTop: 14 }}>
                                <div className="field">
                                    <label>Nível de Seniordade</label>
                                    <select
                                        className="input"
                                        value={nivelSenioridade}
                                        onChange={(e) => setNivelSenioridade(e.target.value)}
                                    >
                                        {NIVEIS.map((n) => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Localização</label>
                                    <input
                                        className="input"
                                        value={localizacao}
                                        onChange={(e) => setLocalizacao(e.target.value)}
                                        placeholder="São Paulo, SP"
                                    />
                                </div>
                            </div>

                            <label className="checkbox-row" style={{ marginTop: 14 }}>
                                <input
                                    type="checkbox"
                                    checked={remoto}
                                    onChange={(e) => setRemoto(e.target.checked)}
                                />
                                Trabalho 100% remoto
                            </label>
                        </section>

                        <section className="cadastro-servico-card">
                            <h2 className="cadastro-servico-card-title">
                                <span className="cadastro-servico-card-title-icone" aria-hidden>💰</span>
                                Remuneração
                            </h2>

                            <div className="cadastro-servico-grid cadastro-servico-grid-2">
                                <div className="field">
                                    <label>Salário Mínimo (R$)</label>
                                    <input
                                        className="input"
                                        type="number"
                                        inputMode="decimal"
                                        value={salarioMinimo}
                                        onChange={(e) => setSalarioMinimo(e.target.value)}
                                        placeholder="Ex: 8000"
                                    />
                                </div>

                                <div className="field">
                                    <label>Salário Máximo (R$)</label>
                                    <input
                                        className="input"
                                        type="number"
                                        inputMode="decimal"
                                        value={salarioMaximo}
                                        onChange={(e) => setSalarioMaximo(e.target.value)}
                                        placeholder="Ex: 12000"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="cadastro-servico-card">
                            <h2 className="cadastro-servico-card-title">
                                <span className="cadastro-servico-card-title-icone" aria-hidden>📋</span>
                                Detalhes da Vaga
                            </h2>

                            <div className="field">
                                <label>Descrição da Vaga</label>
                                <textarea
                                    className="textarea"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Descreva as responsabilidades e o dia a dia do profissional..."
                                    rows={4}
                                />
                            </div>

                            <div className="field" style={{ marginTop: 14 }}>
                                <label>Requisitos</label>
                                <textarea
                                    className="textarea"
                                    value={requisitos}
                                    onChange={(e) => setRequisitos(e.target.value)}
                                    placeholder="Liste os requisitos técnicos e comportamentais necessários..."
                                    rows={4}
                                />
                            </div>

                            <div className="field" style={{ marginTop: 14 }}>
                                <label>Benefícios</label>
                                <textarea
                                    className="textarea"
                                    value={beneficios}
                                    onChange={(e) => setBeneficios(e.target.value)}
                                    placeholder="VT, VR, Plano de Saúde, Gympass, Home Office..."
                                    rows={3}
                                />
                            </div>
                        </section>

                        <footer className="cadastro-servico-footer">
                            <button type="button" className="btn btn-cancel" onClick={handleCancelar} disabled={loading}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Publicando...' : 'Publicar Vaga'}
                            </button>
                        </footer>
                    </form>
                </div>
            </div>
        </LayEmpresa>
    )
}
