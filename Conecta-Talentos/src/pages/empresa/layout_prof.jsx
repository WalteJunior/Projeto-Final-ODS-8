import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import BuildIcon from '@mui/icons-material/Build'
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ConstructionIcon from '@mui/icons-material/Construction';
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate, useLocation } from 'react-router-dom'

const DRAWER_WIDTH = 240

const menuItems = [
    { texto: 'Serviços',                icone: <BuildIcon/>,        rota: '/servicos' },
    { texto: 'Perfil da Empresa',       icone: <BusinessIcon/>,     rota: '/perfil_emp' },
    { texto: 'Publicar Vagas',          icone: <AddCircleIcon/>,    rota: '/pub_vaga' },
    { texto: 'Publicar serviços',       icone: <ConstructionIcon/>, rota: '/pub_serv' },
]

export default function Lay({ children }) {
    const navigate = useNavigate()
    const location = useLocation()

    function handleLogout() {
        navigate('/')
    }

    return (
        <div style={{ display: 'flex' }}>

            {/* ===== HEADER ===== */}
            <AppBar position="fixed" sx={{
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                zIndex: 1201
            }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: 36, height: 36,
                            borderRadius: 8,
                            background: '#2B4FD8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 'bold', fontSize: 13
                        }}>CT</div>
                        <Typography sx={{ color: '#2B4FD8', fontWeight: 'bold', fontSize: '1.1rem' }}>
                            ConectaTalentos
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>

            {/* ===== SIDEBAR ===== */}
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        top: '64px',
                        height: 'calc(100vh - 64px)',
                        backgroundColor: '#F9FAFB',
                        borderRight: '1px solid #E5E7EB',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    },
                }}
            >
                <div>
                    <Typography sx={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#9CA3AF',
                        padding: '1.5rem 1rem 0.5rem'
                    }}>
                        MENU PRINCIPAL
                    </Typography>

                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.texto} disablePadding sx={{ px: 1 }}>
                                <ListItemButton
                                    onClick={() => navigate(item.rota)}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 0.5,
                                        backgroundColor: location.pathname === item.rota ? '#2B4FD8' : 'transparent',
                                        color: location.pathname === item.rota ? 'white' : '#374151',
                                        '&:hover': {
                                            backgroundColor: location.pathname === item.rota ? '#2342C0' : '#F3F4F6'
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: location.pathname === item.rota ? 'white' : '#6B7280'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        {item.icone}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.texto}
                                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    {/* Card ODS */}
                    <div style={{
                        margin: '1rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#EEF2FF',
                        borderRadius: 12,
                        borderLeft: '3px solid #2B4FD8'
                    }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#2B4FD8' }}>
                            ODS 8 da ONU
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', mt: 0.5 }}>
                            Trabalho decente e crescimento econômico para todos.
                        </Typography>
                    </div>
                </div>

                {/* Logout */}
                <div>
                    <Divider />
                    <List>
                        <ListItem disablePadding sx={{ px: 1, pb: 1 }}>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{
                                    borderRadius: 2,
                                    color: '#EF4444',
                                    '&:hover': { backgroundColor: '#FEF2F2' },
                                    '& .MuiListItemIcon-root': { color: '#EF4444' }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Sair"
                                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </div>
            </Drawer>

            {/* ===== CONTEÚDO DA PÁGINA ===== */}
            <main style={{
                flexGrow: 1,
                padding: '2rem',
                marginTop: '64px',
                backgroundColor: '#F3F4F6',
                minHeight: '100vh'
            }}>
                {children}
            </main>

        </div>
    )
}