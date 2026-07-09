import Lay from './layout';
import '../../css/vaga.css';
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useEffect, useMemo, useState } from 'react'
import { getVagas, getEmpresas } from '../../services/api'

const AREAS = ['Desenvolvimento', 'Design', 'Marketing', 'Consultoria']
const CONTRATOS = ['CLT', 'PJ', 'ESTÁGIO', 'OUTROS']

function normalizeString(value) {
    return (value ?? '').toString().toLowerCase()
}

export default function Vaga() {
    const [vagas, setVagas] = useState([])
    const [empresasPorId, setEmpresasPorId] = useState({})
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState('')

    const [busca, setBusca] = useState('')
    const [area, setArea] = useState('')
    const [contrato, setContrato] = useState('')

    const [vagaSelecionada, setVagaSelecionada] = useState(null)
    const [openDetalhes, setOpenDetalhes] = useState(false)
    const [openCandidatar, setOpenCandidatar] = useState(false)

    useEffect(() => {
        async function carregar() {
            setLoading(true)
            setErro('')
            try {
                const [vagasData, empresasData] = await Promise.all([
                    getVagas(),
                    getEmpresas(),
                ])

                setVagas(Array.isArray(vagasData) ? vagasData : [])

                const mapa = {}
                if (Array.isArray(empresasData)) {
                    empresasData.forEach((emp) => {
                        mapa[emp.id] = emp
                    })
                }
                setEmpresasPorId(mapa)
            } catch (err) {
                console.error(err)
                setErro('Não foi possível carregar as vagas. Verifique se o servidor está rodando e tente novamente.')
                setVagas([])
            } finally {
                setLoading(false)
            }
        }
        carregar()
    }, [])

    const vagasFiltradas = useMemo(() => {
        const q = normalizeString(busca).trim()
        return vagas.filter((vaga) => {
            const bateBusca = !q
                || normalizeString(vaga.titulo).includes(q)
                || normalizeString(vaga.descricao).includes(q)

            const bateArea = !area || vaga.area === area
            const bateContrato = !contrato || vaga.tipo === contrato

            return bateBusca && bateArea && bateContrato
        })
    }, [vagas, busca, area, contrato])

    function nomeEmpresa(vaga) {
        return empresasPorId[vaga.empresaId]?.razaoSocial || `Empresa #${vaga.empresaId}`
    }

    function emailEmpresa(vaga) {
        return empresasPorId[vaga.empresaId]?.email || ''
    }

    function abrirDetalhes(vaga) {
        setVagaSelecionada(vaga)
        setOpenDetalhes(true)
    }

    function abrirCandidatar(vaga) {
        setVagaSelecionada(vaga)
        setOpenCandidatar(true)
    }

    function formatarSalario(vaga) {
        if (vaga.salarioMinimo || vaga.salarioMaximo) {
            const min = vaga.salarioMinimo ? Number(vaga.salarioMinimo).toLocaleString('pt-BR') : null
            const max = vaga.salarioMaximo ? Number(vaga.salarioMaximo).toLocaleString('pt-BR') : null
            if (min && max) return `R$ ${min} - R$ ${max}`
            return `R$ ${min ?? max}`
        }
        if (vaga.salario) return `R$ ${Number(vaga.salario).toLocaleString('pt-BR')}`
        return 'A combinar'
    }

    const mailtoHref = vagaSelecionada
        ? `mailto:${emailEmpresa(vagaSelecionada)}?subject=${encodeURIComponent(`Candidatura para vaga: ${vagaSelecionada.titulo ?? ''}`)}`
        : '#'

    return (
        <Lay>
            <h1>Vagas</h1>
            <p>Encontre a oportunidade perfeita para sua carreira</p>

            <div className='pesquisa'>
                <TextField
                    type="search"
                    placeholder="Buscar vagas..."
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
                <select value={area} onChange={(e) => setArea(e.target.value)}>
                    <option value={''}>Áreas</option>
                    {AREAS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
                <select value={contrato} onChange={(e) => setContrato(e.target.value)}>
                    <option value={''}>Contrato</option>
                    {CONTRATOS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {loading && <p>Carregando vagas...</p>}
            {!loading && erro && <p style={{ color: '#EF4444' }}>{erro}</p>}
            {!loading && !erro && vagasFiltradas.length === 0 && <p>Nenhuma vaga encontrada.</p>}

            {!loading && !erro && vagasFiltradas.map(vaga => (
                <div key={vaga.id} className="vaga-card">
                    <div className="vaga-card-topo">
                        <div className="vaga-avatar">
                            {vaga.titulo?.charAt(0)}
                        </div>
                        <div className="vaga-info">
                            <h3>{vaga.titulo}</h3>
                            <p className="vaga-empresa">{nomeEmpresa(vaga)}</p>
                            <div className="vaga-tags">
                                <span className="tag">{vaga.tipo?.toUpperCase()}</span>
                                <span className="tag-descricao">{vaga.descricao}</span>
                            </div>
                        </div>
                    </div>

                    <div className="vaga-card-rodape">
                        <span className="vaga-salario">{formatarSalario(vaga)}</span>
                        <div className="vaga-acoes">
                            <button className="btn-detalhes" onClick={() => abrirDetalhes(vaga)}>Ver Detalhes</button>
                            <button className="btn-candidatar" onClick={() => abrirCandidatar(vaga)}>Candidatar-se</button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Pop-up: Ver detalhes */}
            <Dialog open={openDetalhes} onClose={() => setOpenDetalhes(false)} maxWidth="sm" fullWidth>
                {vagaSelecionada && (
                    <>
                        <DialogTitle>{vagaSelecionada.titulo}</DialogTitle>
                        <DialogContent>
                            <p style={{ color: '#6B7280', marginTop: 0 }}>{nomeEmpresa(vagaSelecionada)}</p>

                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0 16px' }}>
                                {vagaSelecionada.tipo && <span className="tag">{vagaSelecionada.tipo.toUpperCase()}</span>}
                                {vagaSelecionada.area && <span className="tag">{vagaSelecionada.area}</span>}
                                {vagaSelecionada.nivelSenioridade && <span className="tag">{vagaSelecionada.nivelSenioridade}</span>}
                            </div>

                            <p><strong>Localização:</strong> {vagaSelecionada.localizacao || '—'}{vagaSelecionada.remoto ? ' (Remoto)' : ''}</p>
                            <p><strong>Salário:</strong> {formatarSalario(vagaSelecionada)}</p>

                            <h4 style={{ marginBottom: 4 }}>Descrição</h4>
                            <p style={{ marginTop: 0, whiteSpace: 'pre-wrap' }}>{vagaSelecionada.descricao || '—'}</p>

                            <h4 style={{ marginBottom: 4 }}>Requisitos</h4>
                            <p style={{ marginTop: 0, whiteSpace: 'pre-wrap' }}>{vagaSelecionada.requisitos || '—'}</p>

                            <h4 style={{ marginBottom: 4 }}>Benefícios</h4>
                            <p style={{ marginTop: 0, whiteSpace: 'pre-wrap' }}>{vagaSelecionada.beneficios || '—'}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDetalhes(false)} color="inherit">Fechar</Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setOpenDetalhes(false)
                                    abrirCandidatar(vagaSelecionada)
                                }}
                            >
                                Candidatar-se
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Pop-up: Candidatar-se */}
            <Dialog open={openCandidatar} onClose={() => setOpenCandidatar(false)} maxWidth="xs" fullWidth>
                {vagaSelecionada && (
                    <>
                        <DialogTitle>Candidatar-se: {vagaSelecionada.titulo}</DialogTitle>
                        <DialogContent>
                            {emailEmpresa(vagaSelecionada) ? (
                                <p>
                                    Para se candidatar, envie um e-mail para{' '}
                                    <strong>{emailEmpresa(vagaSelecionada)}</strong> com seus dados e currículo.
                                </p>
                            ) : (
                                <p>Esta empresa ainda não cadastrou um e-mail de contato.</p>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenCandidatar(false)} color="inherit">Fechar</Button>
                            {emailEmpresa(vagaSelecionada) && (
                                <Button
                                    variant="contained"
                                    component="a"
                                    href={mailtoHref}
                                    onClick={() => setOpenCandidatar(false)}
                                >
                                    Enviar e-mail
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Lay>
    )
}
