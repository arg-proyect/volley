import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const API_URL = 'http://localhost:5000/api'

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [carouselImages, setCarouselImages] = useState([])
  const [sponsors, setSponsors] = useState([])
  const [tableImages, setTableImages] = useState([])
  const [finishedMatches, setFinishedMatches] = useState([])
  const [scheduledMatches, setScheduledMatches] = useState([])
  const [standings, setStandings] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('Superiores')
  const [activeTab, setActiveTab] = useState('results')
  const [loading, setLoading] = useState(true)
  const [tournaments, setTournaments] = useState([])

  // Cargar datos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carouselRes, sponsorsRes, tableImagesRes, matchesRes, standingsRes, tournamentsRes] = await Promise.all([
          fetch(`${API_URL}/carousel/active`),
          fetch(`${API_URL}/sponsors/active`),
          fetch(`${API_URL}/table-images/active`),
          fetch(`${API_URL}/matches`),
          fetch(`${API_URL}/standings`),
          fetch(`${API_URL}/tournaments`)
        ])

        const carouselData = await carouselRes.json()
        const sponsorsData = await sponsorsRes.json()
        const tableImagesData = await tableImagesRes.json()
        const matchesData = await matchesRes.json()
        const standingsData = await standingsRes.json()
        const tournamentsData = await tournamentsRes.json()

        setCarouselImages(carouselData)
        setSponsors(sponsorsData)
        setTableImages(tableImagesData)
        
        // Filtrar torneos activos o próximos (no finalizados)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const activeTournaments = tournamentsData.filter(t => {
          const endDate = t.end_date ? new Date(t.end_date) : null
          return !endDate || endDate >= today
        })
        setTournaments(activeTournaments)
        
        // Filtrar partidos finalizados y ordenar por fecha descendente
        const finished = matchesData
          .filter(m => m.status === 'finished')
          .sort((a, b) => new Date(b.match_date) - new Date(a.match_date))
          .slice(0, 8) // Mostrar últimos 8 resultados
        
        // Filtrar partidos programados y ordenar por fecha ascendente
        const scheduled = matchesData
          .filter(m => m.status === 'scheduled' || m.status === 'in_progress')
          .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
          .slice(0, 8) // Mostrar próximos 8 partidos
        
        setFinishedMatches(finished)
        setScheduledMatches(scheduled)
        setStandings(standingsData)
        
        // Seleccionar la primera categoría disponible
        const categories = Object.keys(standingsData)
        if (categories.length > 0) {
          setSelectedCategory(categories[0])
        }
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Auto-avance del carrusel
  useEffect(() => {
    if (carouselImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000) // Cambiar cada 5 segundos

    return () => clearInterval(interval)
  }, [carouselImages.length])

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('es-ES', { month: 'short' }).toUpperCase()
    return `${day} ${month}`
  }

  // Formatear hora para mostrar
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  // Obtener color del equipo
  const getTeamColor = (color) => {
    return color || '#6B7280'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Banner with Carousel */}
      <div className="relative h-[500px] sm:h-96 bg-gradient-to-r from-blue-600 to-cyan-500 overflow-hidden">
        {carouselImages.length > 0 ? (
          <div className="absolute inset-0">
            {carouselImages.map((image, idx) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={image.image_url} 
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ))}
            {/* Carousel controls */}
            {carouselImages.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition ${
                      idx === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 bg-black opacity-20"></div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center justify-center z-10">
          <div className="text-center">
            {tournaments.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-6 sm:mb-8">
                {tournaments.map((tournament) => (
                  <div key={tournament.id} className="text-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 sm:mb-3 border-2 border-white/30">
                      <span className="text-4xl sm:text-5xl lg:text-6xl">{tournament.image || '🏐'}</span>
                    </div>
                    <h3 className="text-white font-bold text-xs sm:text-sm uppercase">{tournament.name}</h3>
                  </div>
                ))}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
              LA LIGA
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 drop-shadow-lg">El Voley del Oeste</p>
          </div>
        </div>
      </div>

      {/* Sponsors */}
      {sponsors.length > 0 && (
        <div className="bg-white py-6 sm:py-8 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-center text-xs sm:text-sm font-semibold text-gray-500 mb-4 sm:mb-6 uppercase tracking-wider">
              Sponsors
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || '#'}
                  target={sponsor.website ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group"
                >
                  <img 
                    src={sponsor.logo_url} 
                    alt={sponsor.name}
                    className="h-8 sm:h-10 lg:h-12 object-contain opacity-60 group-hover:opacity-100 transition"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div id="torneos" className="max-w-7xl mx-auto px-4 py-8 sm:py-12 scroll-mt-20">
        {/* Torneos Section */}
        {tournaments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Torneos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {tournaments.map((tournament) => (
                <div 
                  key={tournament.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-6 text-center">
                    <div className="text-6xl mb-3">{tournament.image || '🏐'}</div>
                    <h3 className="text-xl font-bold text-white uppercase">{tournament.name}</h3>
                  </div>
                  <div className="p-4">
                    {tournament.description && (
                      <p className="text-gray-600 text-sm mb-3">{tournament.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Inicio:</span> {new Date(tournament.start_date).toLocaleDateString('es-ES')}
                      </div>
                      {tournament.end_date && (
                        <div>
                          <span className="font-medium">Fin:</span> {new Date(tournament.end_date).toLocaleDateString('es-ES')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2 sm:space-x-4 mb-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('results')}
            className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap transition ${
              activeTab === 'results' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Resultados
          </button>
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap transition ${
              activeTab === 'upcoming' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Próximos
          </button>
        </div>

        {/* Results and Tournament Image Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Matches Grid - Left Side */}
          <div className="lg:col-span-2 grid gap-3 sm:gap-4">
            {activeTab === 'results' && finishedMatches.length > 0 ? finishedMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
                  {/* Date and Category - Mobile */}
                  <div className="flex justify-between items-center sm:hidden">
                    <div className="text-xs text-gray-500 font-medium">
                      {formatDate(match.match_date)}
                    </div>
                    <span className="text-xs text-blue-600 font-medium">{match.category}</span>
                  </div>

                  {/* Date - Desktop */}
                  <div className="hidden sm:block text-sm text-gray-500 font-medium w-20">
                    {formatDate(match.match_date)}
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4">
                    {/* Team 1 */}
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-1">
                      <span className="font-bold text-sm sm:text-base lg:text-lg truncate">{match.team1_short || match.team1_name}</span>
                      <div 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: getTeamColor(match.team1_color) }}
                      >
                        {(match.team1_short || match.team1_name).substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Score */}
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg flex-shrink-0">
                      <span className="text-lg sm:text-xl font-bold text-gray-900 w-5 sm:w-6 text-center">{match.score1}</span>
                      <span className="text-gray-400 text-sm sm:text-base">-</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-900 w-5 sm:w-6 text-center">{match.score2}</span>
                    </div>
                    
                    {/* Team 2 */}
                    <div className="flex items-center justify-start space-x-1 sm:space-x-2 flex-1">
                      <div 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: getTeamColor(match.team2_color) }}
                      >
                        {(match.team2_short || match.team2_name).substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-sm sm:text-base lg:text-lg truncate">{match.team2_short || match.team2_name}</span>
                    </div>
                  </div>

                  {/* Category - Desktop */}
                  <div className="hidden sm:block text-right w-24 lg:w-32">
                    <span className="text-xs text-blue-600 font-medium">{match.category}</span>
                  </div>
                </div>
              </div>
            )) : activeTab === 'upcoming' && scheduledMatches.length > 0 ? scheduledMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
                  {/* Date and Category - Mobile */}
                  <div className="flex justify-between items-center sm:hidden">
                    <div className="text-xs text-gray-500 font-medium">
                      {formatDate(match.match_date)}
                    </div>
                    <span className="text-xs text-blue-600 font-medium">{match.category}</span>
                  </div>

                  {/* Date - Desktop */}
                  <div className="hidden sm:block text-sm text-gray-500 font-medium w-20">
                    {formatDate(match.match_date)}
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4">
                    {/* Team 1 */}
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-1">
                      <span className="font-bold text-sm sm:text-base lg:text-lg truncate">{match.team1_short || match.team1_name}</span>
                      <div 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: getTeamColor(match.team1_color) }}
                      >
                        {(match.team1_short || match.team1_name).substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Time */}
                    <div className="flex items-center justify-center bg-blue-50 px-3 sm:px-4 py-2 rounded-lg flex-shrink-0">
                      <span className="text-sm sm:text-base font-bold text-blue-600">{formatTime(match.match_date)}</span>
                    </div>
                    
                    {/* Team 2 */}
                    <div className="flex items-center justify-start space-x-1 sm:space-x-2 flex-1">
                      <div 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: getTeamColor(match.team2_color) }}
                      >
                        {(match.team2_short || match.team2_name).substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-sm sm:text-base lg:text-lg truncate">{match.team2_short || match.team2_name}</span>
                    </div>
                  </div>

                  {/* Category - Desktop */}
                  <div className="hidden sm:block text-right w-24 lg:w-32">
                    <span className="text-xs text-blue-600 font-medium">{match.category}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                {activeTab === 'results' ? 'No hay resultados disponibles' : 'No hay partidos programados'}
              </div>
            )}
          </div>

          {/* Tournament Image - Right Side */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              {tableImages.length > 0 && tableImages[0] ? (
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <a 
                    href={tableImages[0].link || '#'}
                    target={tableImages[0].link ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img 
                      src={tableImages[0].image_url} 
                      alt={tableImages[0].title}
                      className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
                    />
                  </a>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl overflow-hidden shadow-xl">
                  <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center p-6 sm:p-8">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-black/20"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 text-center text-white">
                      <div className="mb-4 sm:mb-6 lg:mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl mb-3 sm:mb-4 lg:mb-6 border-2 sm:border-4 border-white/30">
                          <span className="text-4xl sm:text-5xl lg:text-7xl">🏐</span>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 drop-shadow-lg">
                        TDV
                      </h2>
                      
                      <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 lg:mb-8">
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-wider">
                          Torneo de
                        </p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase">
                          Verano
                        </p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
                          26"
                        </p>
                      </div>
                      
                      <div className="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 border-t border-white/30">
                        <p className="text-base sm:text-lg lg:text-xl font-medium mb-1 sm:mb-2">La Liga</p>
                        <p className="text-xs sm:text-sm opacity-90">El Voley del Oeste</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Posiciones */}
      {Object.keys(standings).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Tabla de Posiciones</h2>
          
          {/* Tabs de categorías */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {Object.keys(standings).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PJ</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">G</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SF</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SC</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Dif</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {standings[selectedCategory]?.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 text-sm font-bold text-gray-900">{team.position}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{team.short_name}</span>
                          <span className="text-xs text-gray-500 hidden sm:inline">- {team.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-700">{team.played}</td>
                      <td className="px-4 py-4 text-center text-sm text-green-600 font-medium">{team.won}</td>
                      <td className="px-4 py-4 text-center text-sm text-red-600 font-medium">{team.lost}</td>
                      <td className="px-4 py-4 text-center text-sm text-gray-700">{team.sets_for}</td>
                      <td className="px-4 py-4 text-center text-sm text-gray-700">{team.sets_against}</td>
                      <td className={`px-4 py-4 text-center text-sm font-medium ${
                        team.diff > 0 ? 'text-green-600' : team.diff < 0 ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        {team.diff > 0 ? '+' : ''}{team.diff}
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-blue-600">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(!standings[selectedCategory] || standings[selectedCategory].length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No hay datos de posiciones para esta categoría
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Home
