import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const AdminPanel = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/login')
    }
  }, [loading, isAuthenticated, user, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  const adminSections = [
    {
      title: 'Carrusel',
      description: 'Gestiona las imágenes del carrusel principal',
      icon: '🎠',
      path: '/admin/carousel',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Imágenes de Tabla',
      description: 'Gestiona las imágenes junto a la tabla de posiciones',
      icon: '🖼️',
      path: '/admin/table-images',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Sponsors',
      description: 'Administra los patrocinadores',
      icon: '🤝',
      path: '/admin/sponsors',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Torneos',
      description: 'Gestiona los torneos',
      icon: '🏆',
      path: '/admin/tournaments',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Equipos',
      description: 'Administra los equipos',
      icon: '⚡',
      path: '/admin/teams',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Partidos',
      description: 'Gestiona los partidos y resultados',
      icon: '🏐',
      path: '/admin/matches',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Bienvenido, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
            <button
              key={index}
              onClick={() => navigate(section.path)}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">{section.icon}</div>
                  <svg 
                    className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminPanel
