import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Home from './pages/Home'
import AdminPanel from './pages/AdminPanel'
import CarouselAdmin from './pages/CarouselAdmin'
import TableImagesAdmin from './pages/TableImagesAdmin'
import SponsorsAdmin from './pages/SponsorsAdmin'
import AdminTournaments from './pages/AdminTournaments'
import AdminTeams from './pages/AdminTeams'
import AdminMatches from './pages/AdminMatches'

// Componente para rutas protegidas (opcional para futuro)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }
  
  return children
}

// Placeholder pages para las otras rutas
const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">Esta sección está en desarrollo.</p>
    </div>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          
          {/* Rutas de administración */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/carousel" element={<CarouselAdmin />} />
          <Route path="/admin/table-images" element={<TableImagesAdmin />} />
          <Route path="/admin/sponsors" element={<SponsorsAdmin />} />
          <Route path="/admin/tournaments" element={<AdminTournaments />} />
          <Route path="/admin/teams" element={<AdminTeams />} />
          <Route path="/admin/matches" element={<AdminMatches />} />
          
          {/* Rutas placeholder */}
          <Route path="/torneos" element={<PlaceholderPage title="Torneos" />} />
          <Route path="/partidos" element={<PlaceholderPage title="Partidos" />} />
          <Route path="/clubes" element={<PlaceholderPage title="Clubes" />} />
          <Route path="/jugadores" element={<PlaceholderPage title="Jugadores" />} />
          <Route path="/estadisticas" element={<PlaceholderPage title="Estadísticas" />} />
          <Route path="/noticias" element={<PlaceholderPage title="Noticias" />} />
          <Route path="/documentos" element={<PlaceholderPage title="Documentos" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
