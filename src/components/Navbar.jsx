import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleHashClick = (e, hash) => {
    e.preventDefault()
    
    if (location.pathname === '/') {
      // Already on home page, just scroll
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to home first, then scroll
      navigate('/')
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
    setIsMenuOpen(false)
  }

  const navLinks = [
    { name: 'Torneos', path: '/#torneos', isHash: true },
    { name: 'Partidos', path: '/partidos' },
    { name: 'Clubes', path: '/clubes' },
    { name: 'Jugadores', path: '/jugadores' },
    { name: 'Estadísticas', path: '/estadisticas' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Documentos', path: '/documentos' },
  ]

  const adminLinks = [
    { name: 'Panel', path: '/admin' },
    { name: 'Carrusel', path: '/admin/carousel' },
    { name: 'Imágenes', path: '/admin/table-images' },
    { name: 'Sponsors', path: '/admin/sponsors' },
    { name: 'Torneos', path: '/admin/tournaments' },
    { name: 'Equipos', path: '/admin/teams' },
    { name: 'Partidos', path: '/admin/matches' },
  ]

  const displayLinks = isAuthenticated && user?.role === 'admin' ? adminLinks : navLinks

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
          <div className="hidden lg:flex items-center space-x-1">
            {displayLinks.map((link) => (
              link.isHash ? (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleHashClick(e, link.path.split('#')[1] ? `#${link.path.split('#')[1]}` : '')}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Auth button */}
          <div className="hidden lg:flex items-center space-x-2 sm:space-x-3">
            {isAuthenticated ? (
              <>
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
              </>
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {displayLinks.map((link) => (
              link.isHash ? (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleHashClick(e, link.path.split('#')[1] ? `#${link.path.split('#')[1]}` : '')}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  {link.name}
                </Link>
              )
            ))}
            
            {/* Auth buttons in mobile menu */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    {user?.name}
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      logout()
                    }}
                    className="w-full px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition text-center"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
  