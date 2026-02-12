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
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg sm:text-xl">L</span>
            </div>
            <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">LA LIGA TDV</span>
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
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xs sm:text-sm text-gray-700 hidden md:inline truncate max-w-[100px] lg:max-w-none">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-2 sm:px-4 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-700 transition whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Cerrar sesión</span>
                  <span className="sm:hidden">Salir</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 sm:px-4 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
              >
                <span className="hidden sm:inline">Iniciar sesión</span>
                <span className="sm:hidden">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-1 px-3 py-2.5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md whitespace-nowrap transition"
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
