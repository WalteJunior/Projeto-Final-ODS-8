import Login from './pages/login'
import Create from './pages/create'

import LayPessoa from './pages/pessoa/layout.jsx'
import Vaga from './pages/pessoa/vaga.jsx'
import Servico from './pages/pessoa/servico.jsx'
import Perfil from './pages/pessoa/perfil.jsx'
import Pj from './pages/pessoa/oferecer.jsx'

import LayEmpresa from './pages/empresa/layout_prof.jsx'
import Servicos from './pages/empresa/servico_prof.jsx'
import PublicarServico from './pages/empresa/pub_serv_prof.jsx'
import PublicarVaga from './pages/empresa/pub_vaga_prof.jsx'
import PerfilEmpresa from './pages/empresa/perfil_prof.jsx'


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './css/login.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create" element={<Create />} />

        {/* Rotas para o perfil de pessoa */}
        <Route path="/layout" element={<LayPessoa />} />
        <Route path="/vagas" element={<Vaga />} />
        <Route path="/srv" element={<Servico />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/oferecer" element={<Pj />} />

        {/* Rotas para o perfil de empresa */}
        <Route path="/layEmpresa" element={<LayEmpresa />} />
        <Route path="/perfil_emp" element={<PerfilEmpresa />} />
        <Route path="/pub_vaga" element={<PublicarVaga />} />
        <Route path="/pub_serv" element={<PublicarServico />} />
        <Route path="/servicos" element={<Servicos />} />

      </Routes>
    </Router>
  )
}

export default App

