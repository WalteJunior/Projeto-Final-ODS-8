import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/login.css'

const BASE_URL = 'http://localhost:8080'

export default function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setErro('')

        try {
            const res = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            })

            if (!res.ok) {
                setErro('Email ou senha incorretos.')
                return
            }

            const usuario = await res.json()

            // salva no localStorage
            localStorage.setItem('usuario', JSON.stringify(usuario))

            // redireciona conforme o perfil
            if (usuario.perfil === 'empresa') {
                navigate('/servicos')
            } else {
                navigate('/vagas')
            }

        } catch (error) {
            console.error(error)
            setErro('Erro ao conectar com o servidor.')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="container">
            <section className='login_left'>

                <div className='conteudo'>
                    <h1>ConectaTalentos</h1>
                    <h2 style={{ fontSize: '25px' }}>Seu próximo passo começa aqui.</h2>
                    <p style={{ fontSize: '18px' }}>Conectamos profissionais talentosos com as melhores oportunidades do mercado</p>
                </div>

            </section>

            <section className="painel_direito">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Bem-vindo de volta</h2>
                    <p className="subtitulo">Entre na sua conta para continuar</p>

                    {erro && (
                        <div style={{
                            background: '#FEF2F2',
                            border: '1px solid #FCA5A5',
                            borderRadius: 8,
                            padding: '10px 14px',
                            color: '#EF4444',
                            fontSize: '0.875rem',
                            marginBottom: '1rem'
                        }}>
                            {erro}
                        </div>
                    )}

                    <div className="campo">
                        <label>E-mail</label>
                        <div className="input-icone">
                            <span className="icone">✉</span>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="campo">
                        <div className="campo-topo">
                            <label>Senha</label>
                        </div>
                        <div className="input-icone">
                            <span className="icone">🔒</span>
                            <input
                                type={mostrarSenha ? 'text' : 'password'}
                                placeholder="••••••••"
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
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                    <p className="rodape-form">
                        Não tem uma conta? <Link to="/create">Criar conta</Link>
                    </p>
                </form>
            </section>
        </div>
    )
}