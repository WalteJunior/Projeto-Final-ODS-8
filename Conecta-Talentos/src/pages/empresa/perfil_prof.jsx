import { useEffect, useMemo, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import LayEmpresa from './layout_prof.jsx'
import '../../css/perfil-pessoa.css'
import {
    getEmpresaById,
    updateEmpresa,
    getVagas,
    updateVaga,
    deleteVaga,
    getServicos,
    updateServico,
    deleteServico,
} from '../../services/api'

const AREAS = ['Desenvolvimento', 'Design', 'Marketing', 'Consultoria']
const TIPOS = ['CLT', 'PJ', 'ESTÁGIO', 'OUTROS']
const NIVEIS = ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista']

export default function PerfilEmpresa() {
    const [aba, setAba] = useState('vagas')

    const [loading, setLoading] = useState(true)
    const [empresa, setEmpresa] = useState(null)

    const [openEdit, setOpenEdit] = useState(false)
    const [descricaoEdit, setDescricaoEdit] = useState('')
    const [segmentoEdit, setSegmentoEdit] = useState('')

    // ===== Vagas =====
    const [loadingVagas, setLoadingVagas] = useState(false)
    const [vagas, setVagas] = useState([])
    const [erroVagas, setErroVagas] = useState('')

    const [openEditVaga, setOpenEditVaga] = useState(false)
    const [editingVaga, setEditingVaga] = useState(null)
    const [form, setForm] = useState(null)

    // ===== Serviços =====
    const [loadingServicos, setLoadingServicos] = useState(false)
    const [servicos, setServicos] = useState([])
    const [erroServicos, setErroServicos] = useState('')

    const [openEditServico, setOpenEditServico] = useState(false)
    const [editingServico, setEditingServico] = useState(null)
    const [editTitulo, setEditTitulo] = useState('')
    const [editDescricao, setEditDescricao] = useState('')
    const [editCategoria, setEditCategoria] = useState('')
    const [editPreco, setEditPreco] = useState('')

    const usuarioLogado = useMemo(() => {
        try {
            const raw = localStorage.getItem('usuario')
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }, [])

    const perfilId = usuarioLogado?.perfilId

    useEffect(() => {
        async function carregar() {
            setLoading(true)
            try {
                if (!perfilId) {
                    setEmpresa(null)
                    return
                }
                const data = await getEmpresaById(perfilId)
                setEmpresa(data)
            } finally {
                setLoading(false)
            }
        }
        carregar()
    }, [perfilId])

    useEffect(() => {
        async function carregarVagas() {
            if (!perfilId) {
                setErroVagas('Não foi possível identificar a empresa logada. Faça login novamente.')
                return
            }
            setLoadingVagas(true)
            setErroVagas('')
            try {
                const data = await getVagas()
                const filtradas = Array.isArray(data)
                    ? data.filter((v) => Number(v?.empresaId) === Number(perfilId))
                    : []
                setVagas(filtradas)
            } catch (err) {
                console.error(err)
                setErroVagas('Não foi possível carregar as vagas. Verifique se o servidor está rodando e tente novamente.')
                setVagas([])
            } finally {
                setLoadingVagas(false)
            }
        }
        carregarVagas()
    }, [perfilId])

    useEffect(() => {
        async function carregarServicos() {
            if (!perfilId) {
                setErroServicos('Não foi possível identificar a empresa logada. Faça login novamente.')
                return
            }
            setLoadingServicos(true)
            setErroServicos('')
            try {
                const data = await getServicos()
                // Só os serviços publicados pela própria empresa
                const filtrados = Array.isArray(data)
                    ? data.filter((s) => Number(s?.empresaId) === Number(perfilId))
                    : []
                setServicos(filtrados)
            } catch (err) {
                console.error(err)
                setErroServicos('Não foi possível carregar os serviços. Verifique se o servidor está rodando e tente novamente.')
                setServicos([])
            } finally {
                setLoadingServicos(false)
            }
        }
        carregarServicos()
    }, [perfilId])

    const nomeEmpresa = empresa?.razaoSocial ?? usuarioLogado?.nome ?? ''

    const avatarInitials = useMemo(() => {
        const parts = (nomeEmpresa || '').split(' ').filter(Boolean)
        if (parts.length === 0) return '??'
        const first = parts[0]?.[0] ?? ''
        const second = parts.length > 1 ? (parts[1]?.[0] ?? '') : ''
        return (first + second).toUpperCase()
    }, [nomeEmpresa])

    function abrirEdit() {
        setDescricaoEdit(empresa?.descricao ?? '')
        setSegmentoEdit(empresa?.segmento ?? '')
        setOpenEdit(true)
    }

    async function salvarEdit() {
        if (!perfilId) return
        const payload = { ...empresa, descricao: descricaoEdit, segmento: segmentoEdit }
        const atualizado = await updateEmpresa(perfilId, payload)
        setEmpresa(atualizado)
        setOpenEdit(false)
    }

    // ===== Vagas: editar/excluir =====
    function abrirEditVaga(vaga) {
        setEditingVaga(vaga)
        setForm({
            titulo: vaga.titulo ?? '',
            area: vaga.area ?? '',
            tipo: vaga.tipo ?? '',
            nivelSenioridade: vaga.nivelSenioridade ?? '',
            localizacao: vaga.localizacao ?? '',
            remoto: Boolean(vaga.remoto),
            salarioMinimo: vaga.salarioMinimo ?? '',
            salarioMaximo: vaga.salarioMaximo ?? '',
            descricao: vaga.descricao ?? '',
            requisitos: vaga.requisitos ?? '',
            beneficios: vaga.beneficios ?? '',
            status: vaga.status ?? 'aberta',
        })
        setOpenEditVaga(true)
    }

    async function salvarVaga() {
        if (!editingVaga?.id || !form) return
        try {
            const payload = {
                ...editingVaga,
                titulo: form.titulo.trim(),
                area: form.area,
                tipo: form.tipo,
                nivelSenioridade: form.nivelSenioridade,
                localizacao: form.localizacao.trim(),
                remoto: form.remoto,
                salarioMinimo: form.salarioMinimo === '' ? null : Number(form.salarioMinimo),
                salarioMaximo: form.salarioMaximo === '' ? null : Number(form.salarioMaximo),
                descricao: form.descricao.trim(),
                requisitos: form.requisitos.trim(),
                beneficios: form.beneficios.trim(),
                status: form.status,
            }
            const atualizada = await updateVaga(editingVaga.id, payload)
            setVagas((prev) => prev.map((v) => (v.id === atualizada.id ? atualizada : v)))
            setOpenEditVaga(false)
            alert('Vaga atualizada com sucesso!')
        } catch (err) {
            console.error(err)
            alert('Falha ao atualizar vaga.')
        }
    }

    async function excluirVaga(vaga) {
        if (!vaga?.id) return
        const ok = window.confirm('Tem certeza que deseja excluir esta vaga?')
        if (!ok) return
        try {
            await deleteVaga(vaga.id)
            setVagas((prev) => prev.filter((v) => v.id !== vaga.id))
            alert('Vaga excluída com sucesso!')
        } catch (err) {
            console.error(err)
            alert('Falha ao excluir vaga.')
        }
    }

    // ===== Serviços: editar/excluir =====
    function abrirEditServico(s) {
        setEditingServico(s)
        setEditTitulo(s.titulo ?? '')
        setEditDescricao(s.descricao ?? '')
        setEditCategoria(s.categoria ?? '')
        setEditPreco(s.preco ?? '')
        setOpenEditServico(true)
    }

    async function salvarServico() {
        if (!editingServico?.id) return
        try {
            const payload = {
                ...editingServico,
                titulo: (editTitulo ?? '').trim(),
                categoria: (editCategoria ?? '').trim(),
                descricao: (editDescricao ?? '').trim(),
                preco: typeof editPreco === 'string' && editPreco.trim() !== '' ? Number(editPreco) : editPreco,
            }
            const atualizado = await updateServico(editingServico.id, payload)
            setServicos((prev) => prev.map((x) => (x.id === atualizado.id ? atualizado : x)))
            setOpenEditServico(false)
            alert('Serviço atualizado com sucesso!')
        } catch (err) {
            console.error(err)
            alert('Falha ao atualizar serviço.')
        }
    }

    async function excluirServico(s) {
        if (!s?.id) return
        const ok = window.confirm('Tem certeza que deseja excluir este serviço?')
        if (!ok) return
        try {
            await deleteServico(s.id)
            setServicos((prev) => prev.filter((x) => x.id !== s.id))
            alert('Serviço excluído com sucesso!')
        } catch (err) {
            console.error(err)
            alert('Falha ao excluir serviço.')
        }
    }

    return (
        <LayEmpresa>
            <div className="perfil-header">
                <div className="banner" />

                <div className="perfil-info">
                    <div className="avatar">{avatarInitials}</div>

                    <div className="dados">
                        <h2>{nomeEmpresa || '—'}</h2>
                        <h4>{empresa?.segmento || 'Empresa'}</h4>
                        <p className="descricao">{empresa?.descricao || '—'}</p>
                    </div>

                    <button onClick={abrirEdit}>Editar Perfil</button>
                </div>
            </div>

            <div className="abas">
                <button
                    onClick={() => setAba('vagas')}
                    style={{ background: aba === 'vagas' ? '#2563eb' : undefined, color: aba === 'vagas' ? '#fff' : undefined }}
                >
                    Vagas Publicadas
                </button>
                <button
                    onClick={() => setAba('servicos')}
                    style={{ background: aba === 'servicos' ? '#2563eb' : undefined, color: aba === 'servicos' ? '#fff' : undefined }}
                >
                    Meus Serviços
                </button>
            </div>

            {loading && <p>Carregando perfil...</p>}

            {!loading && aba === 'vagas' && (
                <div className="servicos">
                    <h2>Vagas Publicadas</h2>
                    <p>Edite ou exclua as vagas cadastradas pela sua empresa.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
                        {loadingVagas ? (
                            <p>Carregando vagas...</p>
                        ) : erroVagas ? (
                            <p style={{ color: '#EF4444' }}>{erroVagas}</p>
                        ) : vagas.length === 0 ? (
                            <p>Nenhuma vaga publicada.</p>
                        ) : (
                            vagas.map((v) => (
                                <div
                                    key={v.id}
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 12,
                                        padding: 14,
                                        background: '#fff',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: 18 }}>{v.titulo || '—'}</h3>
                                            <p style={{ margin: '6px 0 0', color: '#6B7280' }}>
                                                {[v.area, v.tipo, v.nivelSenioridade].filter(Boolean).join(' • ')}
                                            </p>
                                            <p style={{ margin: '6px 0 0', color: '#374151' }}>
                                                {v.localizacao || ''}
                                                {v.remoto ? (v.localizacao ? ' • Remoto' : 'Remoto') : ''}
                                            </p>
                                            <p style={{ margin: '6px 0 0', color: '#374151' }}>
                                                {v.salarioMinimo || v.salarioMaximo
                                                    ? `R$ ${Number(v.salarioMinimo ?? 0).toLocaleString('pt-BR')} - R$ ${Number(v.salarioMaximo ?? 0).toLocaleString('pt-BR')}`
                                                    : ''}
                                            </p>
                                            <p style={{ margin: '8px 0 0', color: '#374151' }}>{v.descricao || ''}</p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                                            <Button variant="outlined" onClick={() => abrirEditVaga(v)}>
                                                Editar
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => excluirVaga(v)}>
                                                Excluir
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {!loading && aba === 'servicos' && (
                <div className="servicos">
                    <h2>Meus Serviços</h2>
                    <p>Edite ou exclua os serviços cadastrados pela sua empresa.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
                        {loadingServicos ? (
                            <p>Carregando serviços...</p>
                        ) : erroServicos ? (
                            <p style={{ color: '#EF4444' }}>{erroServicos}</p>
                        ) : servicos.length === 0 ? (
                            <p>Nenhum serviço cadastrado.</p>
                        ) : (
                            servicos.map((s) => (
                                <div
                                    key={s.id}
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 12,
                                        padding: 14,
                                        background: '#fff',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: 18 }}>{s.titulo || '—'}</h3>
                                            <p style={{ margin: '6px 0 0', color: '#6B7280' }}>{s.categoria || '—'}</p>
                                            <p style={{ margin: '6px 0 0', color: '#374151' }}>
                                                {typeof s.preco === 'number' ? `R$ ${s.preco.toLocaleString('pt-BR')}` : s.preco ? `R$ ${s.preco}` : ''}
                                            </p>
                                            <p style={{ margin: '8px 0 0', color: '#374151' }}>{s.descricao || ''}</p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                                            <Button variant="outlined" onClick={() => abrirEditServico(s)}>
                                                Editar
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => excluirServico(s)}>
                                                Excluir
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Editar perfil da empresa */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar perfil da empresa</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
                        <TextField
                            label="Segmento"
                            value={segmentoEdit}
                            onChange={(e) => setSegmentoEdit(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Descrição da empresa"
                            value={descricaoEdit}
                            onChange={(e) => setDescricaoEdit(e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)} color="inherit">Cancelar</Button>
                    <Button variant="contained" onClick={salvarEdit} disabled={!perfilId}>Salvar</Button>
                </DialogActions>
            </Dialog>

            {/* Editar vaga */}
            <Dialog open={openEditVaga} onClose={() => setOpenEditVaga(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar vaga</DialogTitle>
                <DialogContent>
                    {form && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
                            <TextField
                                label="Título da vaga"
                                value={form.titulo}
                                onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
                                fullWidth
                            />

                            <div style={{ display: 'flex', gap: 12 }}>
                                <TextField
                                    select
                                    label="Área"
                                    value={form.area}
                                    onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
                                    fullWidth
                                >
                                    {AREAS.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                                </TextField>

                                <TextField
                                    select
                                    label="Regime"
                                    value={form.tipo}
                                    onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
                                    fullWidth
                                >
                                    {TIPOS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                </TextField>
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <TextField
                                    select
                                    label="Nível de senioridade"
                                    value={form.nivelSenioridade}
                                    onChange={(e) => setForm((p) => ({ ...p, nivelSenioridade: e.target.value }))}
                                    fullWidth
                                >
                                    {NIVEIS.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                                </TextField>

                                <TextField
                                    label="Localização"
                                    value={form.localizacao}
                                    onChange={(e) => setForm((p) => ({ ...p, localizacao: e.target.value }))}
                                    fullWidth
                                />
                            </div>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.remoto}
                                        onChange={(e) => setForm((p) => ({ ...p, remoto: e.target.checked }))}
                                    />
                                }
                                label="Trabalho 100% remoto"
                            />

                            <div style={{ display: 'flex', gap: 12 }}>
                                <TextField
                                    label="Salário mínimo (R$)"
                                    type="number"
                                    value={form.salarioMinimo}
                                    onChange={(e) => setForm((p) => ({ ...p, salarioMinimo: e.target.value }))}
                                    fullWidth
                                />
                                <TextField
                                    label="Salário máximo (R$)"
                                    type="number"
                                    value={form.salarioMaximo}
                                    onChange={(e) => setForm((p) => ({ ...p, salarioMaximo: e.target.value }))}
                                    fullWidth
                                />
                            </div>

                            <TextField
                                label="Descrição da vaga"
                                value={form.descricao}
                                onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
                                multiline
                                rows={3}
                                fullWidth
                            />
                            <TextField
                                label="Requisitos"
                                value={form.requisitos}
                                onChange={(e) => setForm((p) => ({ ...p, requisitos: e.target.value }))}
                                multiline
                                rows={3}
                                fullWidth
                            />
                            <TextField
                                label="Benefícios"
                                value={form.beneficios}
                                onChange={(e) => setForm((p) => ({ ...p, beneficios: e.target.value }))}
                                multiline
                                rows={2}
                                fullWidth
                            />

                            <TextField
                                select
                                label="Status"
                                value={form.status}
                                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                                fullWidth
                            >
                                <MenuItem value="aberta">Aberta</MenuItem>
                                <MenuItem value="pausada">Pausada</MenuItem>
                                <MenuItem value="encerrada">Encerrada</MenuItem>
                            </TextField>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditVaga(false)} color="inherit">Cancelar</Button>
                    <Button variant="contained" onClick={salvarVaga} disabled={!editingVaga?.id}>Salvar</Button>
                </DialogActions>
            </Dialog>

            {/* Editar serviço */}
            <Dialog open={openEditServico} onClose={() => setOpenEditServico(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar serviço</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 2 }}>
                        <TextField
                            label="Título"
                            value={editTitulo}
                            onChange={(e) => setEditTitulo(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Categoria"
                            value={editCategoria}
                            onChange={(e) => setEditCategoria(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Preço"
                            type="number"
                            value={editPreco}
                            onChange={(e) => setEditPreco(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Descrição"
                            value={editDescricao}
                            onChange={(e) => setEditDescricao(e.target.value)}
                            multiline
                            rows={5}
                            fullWidth
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditServico(false)} color="inherit">Cancelar</Button>
                    <Button variant="contained" onClick={salvarServico} disabled={!editingServico?.id}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </LayEmpresa>
    )
}
