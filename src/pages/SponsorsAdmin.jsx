import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const API_URL = 'http://localhost:5000/api'

const SponsorsAdmin = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website: '',
    order_index: 0,
    is_active: true
  })

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        navigate('/login')
        return
      }
      fetchSponsors()
    }
  }, [authLoading, isAuthenticated, user, navigate])

  const fetchSponsors = async () => {
    try {
      const response = await fetch(`${API_URL}/sponsors`)
      const data = await response.json()
      setSponsors(data)
    } catch (error) {
      console.error('Error al cargar sponsors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    try {
      const url = editingId 
        ? `${API_URL}/sponsors/${editingId}` 
        : `${API_URL}/sponsors`
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchSponsors()
        resetForm()
        alert(editingId ? 'Sponsor actualizado' : 'Sponsor creado')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar')
    }
  }

  const handleEdit = (sponsor) => {
    setFormData({
      name: sponsor.name,
      logo_url: sponsor.logo_url,
      website: sponsor.website || '',
      order_index: sponsor.order_index,
      is_active: sponsor.is_active
    })
    setEditingId(sponsor.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este sponsor?')) return
    
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API_URL}/sponsors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchSponsors()
        alert('Sponsor eliminado')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      logo_url: '',
      website: '',
      order_index: 0,
      is_active: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              ← Volver al panel
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Sponsors</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            {showForm ? 'Cancelar' : '+ Nuevo Sponsor'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Editar Sponsor' : 'Nuevo Sponsor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL de Logo</label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sitio Web (opcional)</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Orden</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="mr-2 h-5 w-5"
                  />
                  <label className="text-sm font-medium">Activo</label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  sponsor.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {sponsor.is_active ? 'Activo' : 'Inactivo'}
                </span>
                <span className="text-sm text-gray-500">Orden: {sponsor.order_index}</span>
              </div>
              
              <div className="mb-4 h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                <img 
                  src={sponsor.logo_url} 
                  alt={sponsor.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              
              <h3 className="text-lg font-bold mb-2">{sponsor.name}</h3>
              
              {sponsor.website && (
                <a 
                  href={sponsor.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline block mb-4 truncate"
                >
                  {sponsor.website}
                </a>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(sponsor)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(sponsor.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {sponsors.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No hay sponsors registrados
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SponsorsAdmin
