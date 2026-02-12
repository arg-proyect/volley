import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth()

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Torneos', path: '/torneos' },
    { name: 'Partidos', path: '/partidos' },
    { name: 'Clubes', path: '/clubes' },
    { name: 'Jugadores', path: '/jugadores' },
    { name: 'Estadísticas', path: '/estadisticas' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Documentos', path: '/documentos' },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LA LIGA TDV</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search & Auth */}
          <div className="flex items-center space-x-4">
            {/* Search icon */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hidden sm:block">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Auth button */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50 overflow-x-auto">
        <div className="flex space-x-2 px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-3 py-1 text-xs font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
