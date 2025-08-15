import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// API Endpoints
const ENDPOINTS = {
  AUTH: '/panel/v1/auth'
} as const

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  status: number
  message: string
  data: {
    user: {
      id: number
      username: string
      roleId: number
    }
    token: {
      access_token: string
      refresh_token: string
    }
    needsPasswordChange: boolean
  }
}

interface RefreshTokenRequest {
  refresh_token: string
}

interface RefreshTokenResponse {
  status: number
  message: string
  data: {
    access_token: string
  }
}

interface LogoutRequest {
  refresh_token: string
  all_devices?: boolean
}

interface LogoutResponse {
  status: number
  message: string
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

export const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH, 
      credentials
    )
    return response.data
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.put<RefreshTokenResponse>(
      ENDPOINTS.AUTH,
      { refresh_token: refreshToken }
    )
    return response.data
  },

  // Logout
  logout: async (refreshToken: string, allDevices: boolean = false): Promise<LogoutResponse> => {
    const response = await apiClient.delete<LogoutResponse>(
      ENDPOINTS.AUTH,
      { 
        data: { 
          refresh_token: refreshToken, 
          all_devices: allDevices 
        } 
      }
    )
    return response.data
  }
}

// Request interceptor untuk menambahkan auth header
apiClient.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1]
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Response interceptor untuk handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const refreshToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('refresh_token='))
        ?.split('=')[1]
      
      if (refreshToken) {
        try {
          const refreshResponse = await authApi.refreshToken(refreshToken)
          const newAccessToken = refreshResponse.data.access_token
          
          // Update token in store (import useAuthStore jika diperlukan)
          document.cookie = `access_token=${newAccessToken}; path=/`
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          window.location.href = '/sign-in'
          return Promise.reject(refreshError)
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient