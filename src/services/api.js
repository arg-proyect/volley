const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper para obtener el token
const getToken = () => {
  return localStorage.getItem('token')
}

// Helper para headers con autenticación
const getAuthHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// Función genérica para llamadas a API
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error en la petición')
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Servicios de Autenticación
export const authService = {
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (name, email, password) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),

  getProfile: () => apiCall('/auth/profile')
}

// Servicios de Partidos
export const matchService = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/matches${queryString ? `?${queryString}` : ''}`)
  },

  getById: (id) => apiCall(`/matches/${id}`),

  create: (matchData) =>
    apiCall('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData)
    }),

  update: (id, matchData) =>
    apiCall(`/matches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(matchData)
    }),

  delete: (id) =>
    apiCall(`/matches/${id}`, {
      method: 'DELETE'
    })
}

// Servicios de Equipos
export const teamService = {
  getAll: () => apiCall('/teams'),

  getById: (id) => apiCall(`/teams/${id}`),

  getStats: (id) => apiCall(`/teams/${id}/stats`),

  create: (teamData) =>
    apiCall('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData)
    }),

  update: (id, teamData) =>
    apiCall(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData)
    }),

  delete: (id) =>
    apiCall(`/teams/${id}`, {
      method: 'DELETE'
    })
}

// Servicios de Torneos
export const tournamentService = {
  getAll: () => apiCall('/tournaments'),

  getById: (id) => apiCall(`/tournaments/${id}`),

  create: (tournamentData) =>
    apiCall('/tournaments', {
      method: 'POST',
      body: JSON.stringify(tournamentData)
    }),

  update: (id, tournamentData) =>
    apiCall(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tournamentData)
    }),

  delete: (id) =>
    apiCall(`/tournaments/${id}`, {
      method: 'DELETE'
    })
}

export default {
  auth: authService,
  matches: matchService,
  teams: teamService,
  tournaments: tournamentService,
  // Métodos genéricos para uso directo
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error en la petición')
    }
    return response.json()
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error en la petición')
    }
    return response.json()
  },
  put: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error en la petición')
    }
    return response.json()
  },
  delete: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error en la petición')
    }
    return response.json()
  }
}
