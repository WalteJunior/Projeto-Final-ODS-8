import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/create.css'

const BASE_URL = 'http://localhost:8080'

function formatarTelefone(value) {
    value = value.replace(/\D/g, '')
    value = value.replace(/^(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
    return value.slice(0, 15)
}

function formatarCpf(value) {
    value = value.replace(/\D/g, '')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    return value.slice(0, 14)
}

function formatarCnpj(value) {
    value = value.replace(/\D/g, '')
    value = value.replace(/^(\d{2})(\d)/, '$1.$2')
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
    return value.slice(0, 18)
}

export default function Create() {
    const navigate = useNavigate()

    const [tipoUsuario, setTipoUsuario] = useState('pessoa')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [senha, setSenha] = useState('')
    const [cpf, setCpf] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const novoUsuario = {
            nome,
            email,
            senha,
            telefone,
            tipo: tipoUsuario,
            cpf: tipoUsuario === 'pessoa' ? cpf : null,
            cnpj: tipoUsuario === 'empresa' ? cnpj : null
        }

        try {
            const res = await fetch(`${BASE_URL}/cadastro`, { // ← só isso mudou
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoUsuario)
            })

            if (!res.ok) throw new Error('Erro ao cadastrar')

            alert('Conta criada com sucesso!')
            navigate('/')
        } catch (error) {
            console.error(error)
            alert('Não foi possível criar a conta. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container-pai">
            <section className='empresa'>
                <p>CT</p>
                <h2>ConectaTalentos</h2>
            </section>

            <section className="registro">
                <h2 className="form-title">Crie sua conta</h2>
                <p className="form-title">Preencha os seus dados para começar</p>

                <div className="seletor-tipo">
                    <div
                        id="opcao-profissional"
                        className={`opcao ${tipoUsuario === 'pessoa' ? 'ativa' : ''}`}
                        onClick={() => setTipoUsuario('pessoa')}
                    >
                        <span className="icone-opcao">👤</span>
                        <strong>Sou Profissional</strong>
                        <p>Busco vagas ou ofereço serviços</p>
                    </div>

                    <div
                        id="opcao-empresa"
                        className={`opcao ${tipoUsuario === 'empresa' ? 'ativa' : ''}`}
                        onClick={() => setTipoUsuario('empresa')}
                    >
                        <span className="icone-opcao">🏢</span>
                        <strong>Sou Empresa</strong>
                        <p>Publico vagas e contrato</p>
                    </div>
                </div>

                <form className="create-form" onSubmit={handleSubmit}>

                    <div className="campo-nome">
                        <label>{tipoUsuario === 'pessoa' ? 'Nome Completo' : 'Razão Social'}</label>
                        <div className="input-icone">
                            <span className="icone">{tipoUsuario === 'pessoa' ? '👤' : '🏭'}</span>
                            <input
                                type="text"
                                placeholder={tipoUsuario === 'pessoa' ? 'João Paulo Silva' : 'Tech Solutions Ltda'}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="campo-email">
                        <label>Email</label>
                        <div className="input-icone">
                            <span className="icone">✉️</span>
                            <input
                                type="email"
                                placeholder='joao.silva@example.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="campo-telefone">
                        <label>Telefone</label>
                        <div className="input-icone">
                            <span className="icone">📞</span>
                            <input
                                type="text"
                                placeholder='(11) 91010-1010'
                                value={telefone}
                                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                                maxLength={15}
                                required
                            />
                        </div>
                    </div>

                    {tipoUsuario === 'pessoa' ? (
                        <div className="campo-cpf">
                            <label>CPF</label>
                            <div className="input-icone">
                                <span className="icone">🪪</span>
                                <input
                                    type="text"
                                    placeholder='000.000.000-00'
                                    value={cpf}
                                    onChange={(e) => setCpf(formatarCpf(e.target.value))}
                                    maxLength={14}
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="campo-cnpj">
                            <label>CNPJ</label>
                            <div className="input-icone">
                                <span className="icone">🏢</span>
                                <input
                                    type="text"
                                    placeholder='00.000.000/0000-00'
                                    value={cnpj}
                                    onChange={(e) => setCnpj(formatarCnpj(e.target.value))}
                                    maxLength={18}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="campo-senha">
                        <label>Senha</label>
                        <div className="input-icone">
                            <span className="icone">🔑</span>
                            <input
                                type={mostrarSenha ? 'text' : 'password'}
                                placeholder='Mínimo 8 caracteres'
                                minLength="8"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                            <span
                                className="icone-direita"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                style={{ cursor: 'pointer' }}
                            >
                                👁
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="btn-entrar" disabled={loading}>
                        {loading ? 'Criando conta...' : 'Criar Conta'}
                    </button>

                    <p className="rodape-form">
                        Já tem uma conta? <Link to="/">Faça login</Link>
                    </p>
                </form>
            </section>
        </div>
    )
}