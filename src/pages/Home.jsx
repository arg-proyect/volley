import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  // Mock data con colores de equipos
  const teamColors = {
    'NOV': '#8B5CF6',
    'VIN': '#EC4899',
    'BOL': '#3B82F6',
    'NEW': '#6366F1',
    'DEF': '#10B981',
    'TRE': '#F59E0B',
    'MIS': '#EF4444',
    'JUS': '#F97316',
    '17': '#06B6D4',
    'PSM': '#8B5CF6',
    'API': '#14B8A6',
    'BLA': '#6B7280',
    'MIN': '#F59E0B',
    'PAI': '#EC4899',
    'DMO': '#EF4444',
    'UNL': '#10B981',
    '27': '#3B82F6',
    'TER': '#6366F1',
    'PAN': '#F97316',
    'DEF': '#10B981',
  }

  const matches = [
    { date: '8 FEB', team1: 'NOV', score1: 1, team2: 'VIN', score2: 3, category: 'Superiores' },
    { date: '8 FEB', team1: 'BOL', score1: 3, team2: 'NEW', score2: 2, category: 'Superiores' },
    { date: '8 FEB', team1: 'DEF', score1: 3, team2: 'TRE', score2: 1, category: 'Superiores' },
    { date: '8 FEB', team1: 'MIS', score1: 3, team2: 'JUS', score2: 1, category: 'Superiores' },
    { date: '8 FEB', team1: '17', score1: 3, team2: 'PSM', score2: 0, category: 'Superiores' },
    { date: '8 FEB', team1: 'API', score1: 3, team2: 'BLA', score2: 0, category: 'Superiores' },
    { date: '8 FEB', team1: 'MIN', score1: 0, team2: 'PAI', score2: 3, category: 'Superiores' },
    { date: '8 FEB', team1: 'DMO', score1: 0, team2: 'UNL', score2: 3, category: 'Superiores' },
  ]

  const tournaments = [
    { name: 'TORNEO DE VERANO', image: '🏐' },
    { name: 'OPEN CAÑUELAS', image: '🏐' },
  ]

  const sponsors = [
    'FRILAVP', 'NOTORIETY', 'AUTHAEDO', 'TIENDA DE CALDOS',
    'Thorium', 'SACNUM', 'molten', 'EL CLUB DEL HORNERO'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[500px] sm:h-96 bg-gradient-to-r from-blue-600 to-cyan-500 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-6 sm:mb-8">
              {tournaments.map((tournament, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 sm:mb-3 border-2 border-white/30">
                    <span className="text-4xl sm:text-5xl lg:text-6xl">{tournament.image}</span>
                  </div>
                  <h3 className="text-white font-bold text-xs sm:text-sm">{tournament.name}</h3>
                </div>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
              LA LIGA
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90">El Voley del Oeste</p>
          </div>
        </div>
      </div>

      {/* Sponsors */}
      <div className="bg-white py-6 sm:py-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-xs sm:text-sm font-semibold text-gray-500 mb-4 sm:mb-6 uppercase tracking-wider">
            Sponsors
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 lg:gap-8">
            {sponsors.map((sponsor, idx) => (
              <div key={idx} className="text-gray-400 font-medium text-xs sm:text-sm">
                {sponsor}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <button className="flex items-center space-x-2 text-yellow-500 font-medium text-sm sm:text-base">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="hidden sm:inline">Acceso Rápido</span>
            <span className="sm:hidden">Rápido</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-700 font-medium hover:text-blue-600 text-sm sm:text-base">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Buscar</span>
          </button>
        </div>

        <div className="flex space-x-2 sm:space-x-4 mb-6 overflow-x-auto">
          <button className="px-3 sm:px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium text-sm sm:text-base whitespace-nowrap">
            Resultados
          </button>
          <button className="px-3 sm:px-4 py-2 text-gray-600 hover:text-blue-600 font-medium text-sm sm:text-base whitespace-nowrap">
            Próximos
          </button>
        </div>

        {/* Results and Tournament Image Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Matches Grid - Left Side */}
          <div className="lg:col-span-2 grid gap-3 sm:gap-4">
            {matches.map((match, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
                  {/* Date and Category - Mobile */}
                  <div className="flex justify-between items-center sm:hidden">
                    <div className="text-xs text-gray-500 font-medium">
                      {match.date}
                    </div>
                    <span className="text-xs text-blue-600 font-medium">{match.category}</span>
                  </div>

                  {/* Date - Desktop */}
                  <div className="hidden sm:block text-sm text-gray-500 font-medium w-20">
                    {match.date}
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4">
                    {/* Team 1 */}
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-1">
                      <span className="font-bold text-sm sm:text-base lg:text-lg truncate">{match.team1}</span>
                      <div 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: teamColors[match.team1] || '#6B7280' }}
                      >
                        {match.team1.substring(0, 2)}
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
                        style={{ backgroundColor: teamColors[match.team2] || '#6B7280' }}
                      >
                        {match.team2.substring(0, 2)}
                      </div>
                      <span className="font-bold text-sm sm:text-base lg:text-lg truncate">{match.team2}</span>
                    </div>
                  </div>

                  {/* Category - Desktop */}
                  <div className="hidden sm:block text-right w-24 lg:w-32">
                    <span className="text-xs text-blue-600 font-medium">{match.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tournament Image - Right Side */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
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
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home
