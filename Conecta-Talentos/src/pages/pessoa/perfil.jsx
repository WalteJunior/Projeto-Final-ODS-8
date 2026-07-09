import { useEffect, useMemo, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Lay from './layout'
import '../../css/perfil-pessoa.css'
import {
    getPessoaById,
    updatePessoa,
    getServicos,
    updateServico,
    deleteServico,
} from '../../services/api'

function splitHabilidades(habilidades) {
    const raw = (habilidades ?? '').toString().trim()
    if (!raw) return []

    // suporta vírgula e ponto e vírgula
    const parts = raw
        .split(/[;,]/g)
        .map((p) => p.trim())
        .filter(Boolean)

    return parts.length ? parts : [raw]
}

export default function Perfil() {
    const [aba, setAba] = useState('visao')

    const [loading, setLoading] = useState(true)
    const [pessoa, setPessoa] = useState(null)

    const [openEdit, setOpenEdit] = useState(false)
    const [resumoEdit, setResumoEdit] = useState('')
    const [novaHabilidade, setNovaHabilidade] = useState('')

    const [loadingServicos, setLoadingServicos] = useState(false)
    const [servicos, setServicos] = useState([])

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
                    setPessoa(null)
                    return
                }
                const data = await getPessoaById(perfilId)
                setPessoa(data)
            } finally {
                setLoading(false)
            }
        }

        carregar()
    }, [perfilId])

    useEffect(() => {
        async function carregarServicos() {
            if (!perfilId) return

            setLoadingServicos(true)
            try {
                const data = await getServicos()
                // Filtra pelo usuário logado
                const filtrados = Array.isArray(data)
                    ? data.filter((s) => {
                        const idPessoa = s?.pessoasId ?? s?.pessoaId ?? s?.pessoa_id ?? s?.pessoas_id
                        return Number(idPessoa) === Number(perfilId)
                    })
                    : []
                setServicos(filtrados)
            } catch (err) {
                console.error(err)
                setServicos([])
            } finally {
                setLoadingServicos(false)
            }
        }

        carregarServicos()
    }, [perfilId])

    const nomeCompleto = pessoa?.nome ?? usuarioLogado?.nome ?? ''

    const avatarInitials = useMemo(() => {
        const parts = (nomeCompleto || '').split(' ').filter(Boolean)
        if (parts.length === 0) return '??'

        const first = parts[0]?.[0] ?? ''
        const second = parts.length > 1 ? (parts[1]?.[0] ?? '') : ''
        return (first + second).toUpperCase()
    }, [nomeCompleto])

    const habilidadesTags = useMemo(() => splitHabilidades(pessoa?.habilidades), [pessoa?.habilidades])

    function abrirEdit() {
        setResumoEdit(pessoa?.resumo ?? '')
        setOpenEdit(true)
    }

    async function salvarEdit() {
        if (!perfilId) return

        const payload = {
            ...pessoa,
            resumo: resumoEdit
        }

        const atualizado = await updatePessoa(perfilId, payload)
        setPessoa(atualizado)
        setOpenEdit(false)
    }

    return (
        <Lay>
            <div className="perfil-header">
                <div className="banner" />

                <div className="perfil-info">
                    <div className="avatar">{avatarInitials}</div>

                    <div className="dados">
                        <h2>{nomeCompleto || '—'}</h2>
                        <h4>Pessoa Profissional</h4>

                        <p className="descricao">{pessoa?.resumo || '—'}</p>
                    </div>

                    <button onClick={abrirEdit}>Editar Perfil</button>
                </div>
            </div>

            <div className="abas">
                <button
                    onClick={() => setAba('visao')}
                    style={{ background: aba === 'visao' ? '#2563eb' : undefined, color: aba === 'visao' ? '#fff' : undefined }}
                >
                    Visão Geral
                </button>
                <button
                    onClick={() => setAba('servicos')}
                    style={{ background: aba === 'servicos' ? '#2563eb' : undefined, color: aba === 'servicos' ? '#fff' : undefined }}
                >
                    Meus Serviços
                </button>
            </div>

            {loading && <p>Carregando perfil...</p>}

            {!loading && aba === 'visao' && (
                <div className="habilidades">
                    <h2>Habilidades</h2>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                        {habilidadesTags.length === 0 ? (
                            <span style={{ color: '#6B7280' }}>Nenhuma habilidade cadastrada.</span>
                        ) : (
                            habilidadesTags.map((tag) => (
                                <span
                                    key={tag}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        background: '#e8f0ff',
                                        color: '#2563eb',
                                        padding: '8px 15px',
                                        borderRadius: 30,
                                        fontSize: 14
                                    }}
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const next = habilidadesTags.filter((t) => t !== tag)
                                            setResumoEdit(pessoa?.resumo ?? '')
                                            // salva rapidamente atualizando apenas a coluna habilidades
                                            const payload = { ...pessoa, habilidades: next.join(', ') }
                                            updatePessoa(perfilId, payload)
                                                .then((atualizado) => setPessoa(atualizado))
                                                .catch(console.error)
                                        }}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            color: '#2563eb',
                                            fontWeight: 700,
                                            lineHeight: 1
                                        }}
                                        aria-label={`Remover habilidade ${tag}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))
                        )}
                    </div>

                    <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField
                            size="small"
                            label="Adicionar habilidade"
                            variant="outlined"
                            value={novaHabilidade}
                            onChange={(e) => setNovaHabilidade(e.target.value)}
                        />

                        <Button
                            variant="contained"
                            disableElevation
                            disableRipple
                            onClick={async () => {
                                const clean = (novaHabilidade ?? '').trim()
                                if (!clean) return
                                if (!perfilId) return

                                const next = Array.from(new Set([...habilidadesTags, clean]))
                                const payload = { ...pessoa, habilidades: next.join(', ') }
                                const atualizado = await updatePessoa(perfilId, payload)
                                setPessoa(atualizado)
                                setNovaHabilidade('')
                            }}
                            disabled={!perfilId}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '999px',
                                fontWeight: 700,
                                backgroundColor: '#2563eb',
                                color: '#fff',
                                boxShadow: 'none',

                                '&:hover': {
                                    backgroundColor: '#2563eb',
                                    boxShadow: 'none',
                                },

                                '&:active': {
                                    backgroundColor: '#2563eb',
                                    boxShadow: 'none',
                                },

                                '&:focus': {
                                    backgroundColor: '#2563eb',
                                    boxShadow: 'none',
                                },

                                '&.Mui-focusVisible': {
                                    backgroundColor: '#2563eb',
                                    boxShadow: 'none',
                                },

                                '&.Mui-disabled': {
                                    backgroundColor: '#93c5fd',
                                    color: '#fff',
                                },
                            }}
                        >
                            Adicionar
                        </Button>

                    </div>

                </div>
            )}

            {!loading && aba === 'servicos' && (
                <div className="servicos">
                    <h2>Meus Serviços</h2>
                    <p>Edite ou exclua seus serviços cadastrados.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {loadingServicos ? (
                            <p>Carregando serviços...</p>
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
                                            <p style={{ margin: '8px 0 0', color: '#374151' }}>
                                                {s.descricao || ''}
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => {
                                                    setEditingServico(s)
                                                    setEditTitulo(s.titulo ?? '')
                                                    setEditDescricao(s.descricao ?? '')
                                                    setEditCategoria(s.categoria ?? '')
                                                    setEditPreco(s.preco ?? '')
                                                    setOpenEditServico(true)
                                                }}
                                            >
                                                Editar
                                            </Button>

                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={async () => {
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
                                                }}
                                            >
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

            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar descrição do perfil</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Resumo (perfil)"
                        value={resumoEdit}
                        onChange={(e) => setResumoEdit(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)} color="inherit">
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={salvarEdit} disabled={!perfilId}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openEditServico}
                onClose={() => setOpenEditServico(false)}
                maxWidth="sm"
                fullWidth
            >
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
                    <Button onClick={() => setOpenEditServico(false)} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
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
                                setServicos((prev) =>
                                    prev.map((x) => (x.id === atualizado.id ? atualizado : x))
                                )
                                setOpenEditServico(false)
                                alert('Serviço atualizado com sucesso!')
                            } catch (err) {
                                console.error(err)
                                alert('Falha ao atualizar serviço.')
                            }
                        }}
                        disabled={!editingServico?.id}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Lay>
    )
}

