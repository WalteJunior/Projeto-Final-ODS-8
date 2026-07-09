import { useEffect, useMemo, useState } from 'react';
import LayEmpresa from './layout_prof.jsx';
import '../../css/serviço.css';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { getServicos } from '../../services/api';

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

const CATEGORIAS = ['Desenvolvimento', 'Design', 'Marketing', 'Consultoria']

function normalizeString(value) {
    return (value ?? '').toString().toLowerCase()
}

function splitHabilidades(habilidades) {
    const raw = (habilidades ?? '').toString().trim()
    if (!raw) return []

    // suporta vírgula e ponto e vírgula
    return raw
        .split(/[;,]/g)
        .map((h) => h.trim())
        .filter(Boolean)
}

export default function ServicosEmpresa() {
    const usuarioLogado = useMemo(() => {
        try {
            const raw = localStorage.getItem('usuario')
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }, [])

    const perfilId = usuarioLogado?.perfilId

    const [servicos, setServicos] = useState([]);

    const [busca, setBusca] = useState('')
    const [categoria, setCategoria] = useState('')

    const [openDetalhes, setOpenDetalhes] = useState(false)
    const [detalhesServico, setDetalhesServico] = useState(null)

    const [openContratar, setOpenContratar] = useState(false)
    const [contratarServico, setContratarServico] = useState(null)


    useEffect(() => {
        getServicos().then((data) => {
            // Normaliza resposta do backend para garantir que sempre seja array
            const arr = Array.isArray(data)
                ? data
                : (data?.servicos || data?.content || data?.data || []);
            // Não mostra pra empresa os próprios serviços publicados por ela mesma
            const semProprios = arr.filter((s) => Number(s?.empresaId) !== Number(perfilId))
            setServicos(semProprios);
        }).catch(() => setServicos([]));
    }, [perfilId]);

    const servicosFiltrados = useMemo(() => {
        const q = normalizeString(busca).trim()
        return servicos.filter((servico) => {
            const bateBusca = !q
                || normalizeString(servico.titulo).includes(q)
                || normalizeString(servico.descricao).includes(q)

            const bateCategoria = !categoria || servico.categoria === categoria

            return bateBusca && bateCategoria
        })
    }, [servicos, busca, categoria])

    return (
        <LayEmpresa>
            <h1>Serviços</h1>
            <p>Encontre o profissional ou empresa ideal para o seu projeto</p>

            <div className='pesquisa'>
                <TextField
                    type="search"
                    placeholder="Buscar serviços..."
                    variant="outlined"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    sx={{
                        width: '60vw',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '15px',
                            backgroundColor: 'white',
                            '& fieldset': {
                                borderColor: '#D1D5DB',
                            },
                            '&:hover fieldset': {
                                borderColor: '#9CA3AF',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#2B4FD8',
                            },
                        }
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#9CA3AF' }} />
                                </InputAdornment>
                            )
                        }
                    }}
                />
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option value={''}>Áreas</option>
                    {CATEGORIAS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {servicosFiltrados.length === 0 && <p>Nenhum serviço encontrado.</p>}

            <div className="vaga-grid">

                {servicosFiltrados.map((servico) => (
                    <div key={servico.id} className="vaga-card">
                        <div className="vaga-card-topo">
                            <div className="vaga-avatar">
                                {(servico.categoria || servico.titulo || '').toString().charAt(0)}
                            </div>
                            <div className="vaga-info">
                                <h3>{servico.titulo}</h3>
                                <p className="vaga-empresa">
                                    {servico.categoria}
                                    {servico.nomeDono ? ` • ${servico.nomeDono}` : ''}
                                </p>
                                <div className="vaga-tags">
                                    <span className="tag">{servico.tipo?.toUpperCase()}</span>
                                    <span className="tag-descricao">{servico.descricao}</span>
                                </div>
                                {servico.habilidadesUsuario && (
                                    <div className="vaga-tags">
                                        {splitHabilidades(servico.habilidadesUsuario).map((h) => (
                                            <span key={h} className="tag">{h}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="vaga-card-rodape">
                            <span className="vaga-salario">R$ {servico.preco?.toLocaleString('pt-BR')}</span>
                            <div className="vaga-acoes">
                                <button
                                    className="btn-detalhes"
                                    onClick={() => {
                                        setDetalhesServico(servico)
                                        setOpenDetalhes(true)
                                    }}
                                >
                                    Ver Detalhes
                                </button>
                                <button
                                    className="btn-candidatar"
                                    onClick={() => {
                                        setContratarServico(servico)
                                        setOpenContratar(true)
                                    }}
                                >
                                    Contratar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Popup ver detalhes */}
            <Dialog open={openDetalhes} onClose={() => setOpenDetalhes(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Detalhes do serviço</DialogTitle>
                <DialogContent>
                    {detalhesServico ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 2 }}>
                            <p><b>Categoria:</b> {detalhesServico.categoria}</p>
                            <p><b>Preço:</b> R$ {typeof detalhesServico.preco === 'number' ? detalhesServico.preco.toLocaleString('pt-BR') : detalhesServico.preco}</p>
                            <p><b>Descrição:</b> {detalhesServico.descricao}</p>
                        </div>
                    ) : (
                        <p>—</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetalhes(false)} color="inherit">Fechar</Button>
                </DialogActions>
            </Dialog>

            {/* Popup contratar */}
            <Dialog open={openContratar} onClose={() => setOpenContratar(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Contato</DialogTitle>
                <DialogContent>
                    {contratarServico ? (
                        <p style={{ margin: 0 }}>
                            Favor entrar em contato por email {contratarServico.emailUsuario || contratarServico.email || ''}
                        </p>
                    ) : (
                        <p>—</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenContratar(false)} color="inherit">Fechar</Button>
                </DialogActions>
            </Dialog>
        </LayEmpresa>
    );
}
