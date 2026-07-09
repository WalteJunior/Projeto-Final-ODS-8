const BASE_URL = 'http://localhost:8080'

export async function getVagas() {
    const res = await fetch(`${BASE_URL}/vagas`)
    return res.json()
}

export async function createVaga(vaga) {
    const res = await fetch(`${BASE_URL}/vagas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vaga)
    })
    return res.json()
}

export async function updateVaga(id, vaga) {
    const res = await fetch(`${BASE_URL}/vagas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vaga)
    })
    return res.json()
}

export async function deleteVaga(id) {
    await fetch(`${BASE_URL}/vagas/${id}`, { method: 'DELETE' })
}

export async function getServicos() {
    const res = await fetch(`${BASE_URL}/servicos`)
    return res.json()
}

export async function createServico(servico) {
    const res = await fetch(`${BASE_URL}/servicos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servico)
    })
    return res.json()
}

export async function updateServico(id, servico) {
    const res = await fetch(`${BASE_URL}/servicos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servico)
    })
    return res.json()
}

export async function deleteServico(id) {
    await fetch(`${BASE_URL}/servicos/${id}`, { method: 'DELETE' })
}

export async function getPessoaById(id) {
    const res = await fetch(`${BASE_URL}/pessoas/${id}`)
    return res.json()
}

export async function updatePessoa(id, pessoa) {
    const res = await fetch(`${BASE_URL}/pessoas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pessoa)
    })
    return res.json()
}

export async function getEmpresas() {
    const res = await fetch(`${BASE_URL}/empresas`)
    return res.json()
}

export async function getEmpresaById(id) {
    const res = await fetch(`${BASE_URL}/empresas/${id}`)
    return res.json()
}

export async function updateEmpresa(id, empresa) {
    const res = await fetch(`${BASE_URL}/empresas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresa)
    })
    return res.json()
}




