import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const API_URL = 'http://localhost:5000/api'

const TableImagesAdmin = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link: '',
    position: 'right',
    is_active: true
  })

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        navigate('/login')
        return
      }
      fetchImages()
    }
  }, [authLoading, isAuthenticated, user, navigate])

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_URL}/table-images`)
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error('Error al cargar imágenes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    try {
      const url = editingId 
        ? `${API_URL}/table-images/${editingId}` 
        : `${API_URL}/table-images`
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchImages()
        resetForm()
        alert(editingId ? 'Imagen actualizada' : 'Imagen creada')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar')
    }
  }

  const handleEdit = (image) => {
    setFormData({
      title: image.title,
      image_url: image.image_url,
      link: image.link || '',
      position: image.position,
      is_active: image.is_active
    })
    setEditingId(image.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta imagen?')) return
    
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API_URL}/table-images/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchImages()
        alert('Imagen eliminada')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      link: '',
      position: 'right',
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
            <h1 className="text-3xl font-bold text-gray-900">Imágenes de Tabla</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            {showForm ? 'Cancelar' : '+ Nueva Imagen'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Editar Imagen' : 'Nueva Imagen'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Enlace (opcional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Posición</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="mr-2 h-5 w-5"
                  />
                  <label className="text-sm font-medium">Activa</label>
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

        <div className="grid gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-lg p-6 flex gap-6">
              <img 
                src={image.image_url} 
                alt={image.title}
                className="w-48 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{image.title}</h3>
                    <p className="text-sm text-gray-500">Posición: {image.position === 'left' ? 'Izquierda' : 'Derecha'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    image.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {image.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                {image.link && (
                  <p className="text-sm text-blue-600 mb-4">{image.link}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(image)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {images.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No hay imágenes configuradas
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TableImagesAdmin
