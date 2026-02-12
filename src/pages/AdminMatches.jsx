import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const AdminMatches = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [teams, setTeams] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMatch, setEditingMatch] = useState(null)
  const [formData, setFormData] = useState({
    team1_id: '',
    team2_id: '',
    score1: 0,
    score2: 0,
    match_date: '',
    category: 'Masculino',
    tournament_id: '',
    status: 'finished'
  })

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/login')
    }
  }, [isAuthenticated, authLoading, user, navigate])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchData()
    }
  }, [isAuthenticated, user])

  const fetchData = async () => {
    try {
      const [matchesData, teamsData, tournamentsData] = await Promise.all([
        api.get('/matches'),
        api.get('/teams'),
        api.get('/tournaments')
      ])
      setMatches(matchesData)
      setTeams(teamsData)
      setTournaments(tournamentsData)
    } catch (error) {
      console.error('Error al obtener datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Convertir tournament_id vacío a null
      const dataToSend = {
        ...formData,
        tournament_id: formData.tournament_id || null
      }
      
      if (editingMatch) {
        await api.put(`/matches/${editingMatch.id}`, dataToSend)
      } else {
        await api.post('/matches', dataToSend)
      }
      fetchData()
      resetForm()
    } catch (error) {
      console.error('Error al guardar partido:', error)
      alert(`Error al guardar el partido: ${error.message}`)
    }
  }

  const handleEdit = (match) => {
    setEditingMatch(match)
    // Convertir la fecha de MySQL (YYYY-MM-DD HH:MM:SS) a formato datetime-local (YYYY-MM-DDTHH:MM)
    let formattedDate = ''
    if (match.match_date) {
      const date = new Date(match.match_date)
      formattedDate = date.toISOString().slice(0, 16)
    }
    setFormData({
      team1_id: match.team1_id,
      team2_id: match.team2_id,
      score1: match.score1,
      score2: match.score2,
      match_date: formattedDate,
      category: match.category,
      tournament_id: match.tournament_id || '',
      status: match.status || 'finished'
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este partido?')) return
    
    try {
      await api.delete(`/matches/${id}`)
      fetchData()
    } catch (error) {
      console.error('Error al eliminar partido:', error)
      alert(`Error al eliminar el partido: ${error.message}`)
    }
  }

  const resetForm = () => {
    setFormData({
      team1_id: '',
      team2_id: '',
      score1: 0,
      score2: 0,
      match_date: '',
      category: 'Masculino',
      tournament_id: '',
      status: 'finished'
    })
    setEditingMatch(null)
    setIsFormOpen(false)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Partidos</h1>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Nuevo Partido
            </button>
          </div>

          {/* Formulario */}
          {isFormOpen && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">
                {editingMatch ? 'Editar Partido' : 'Nuevo Partido'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipo Local *
                    </label>
                    <select
                      value={formData.team1_id}
                      onChange={(e) => setFormData({ ...formData, team1_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar equipo</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipo Visitante *
                    </label>
                    <select
                      value={formData.team2_id}
                      onChange={(e) => setFormData({ ...formData, team2_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar equipo</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Goles Local
                    </label>
                    <input
                      type="number"
                      value={formData.score1}
                      onChange={(e) => setFormData({ ...formData, score1: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Goles Visitante
                    </label>
                    <input
                      type="number"
                      value={formData.score2}
                      onChange={(e) => setFormData({ ...formData, score2: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha y Hora *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.match_date}
                      onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Mixto">Mixto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Torneo
                    </label>
                    <select
                      value={formData.tournament_id}
                      onChange={(e) => setFormData({ ...formData, tournament_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sin torneo</option>
                      {tournaments.map((tournament) => (
                        <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="scheduled">Programado</option>
                      <option value="in_progress">En progreso</option>
                      <option value="finished">Finalizado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingMatch ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de partidos */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partido</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Resultado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Torneo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {matches.map((match) => (
                    <tr key={match.id}>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(match.match_date).toLocaleDateString('es-ES')}
                        <br />
                        <span className="text-xs text-gray-500">
                          {new Date(match.match_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{match.team1_name || 'Equipo 1'}</div>
                        <div className="text-sm text-gray-600">{match.team2_name || 'Equipo 2'}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {match.score1} - {match.score2}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{match.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{match.tournament_name || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          match.status === 'finished' ? 'bg-green-100 text-green-800' :
                          match.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          match.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {match.status === 'finished' ? 'Finalizado' :
                           match.status === 'in_progress' ? 'En juego' :
                           match.status === 'scheduled' ? 'Programado' :
                           'Cancelado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(match)}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(match.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {matches.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay partidos registrados
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AdminMatches
