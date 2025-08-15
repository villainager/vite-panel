import Cookies from 'js-cookie'
import { create } from 'zustand'

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'
const USER_DATA = 'user_data'

interface AuthUser {
  id: number
  username: string
  roleId: number
}

interface TokenData {
  access_token: string
  refresh_token: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    accessToken: string
    refreshToken: string
    needsPasswordChange: boolean
    isAuthenticated: boolean
    setUser: (user: AuthUser | null) => void
    setTokens: (tokens: TokenData) => void
    setAccessToken: (accessToken: string) => void
    setPasswordChangeFlag: (needsPasswordChange: boolean) => void
    reset: () => void
    logout: () => void
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  // Initialize from cookies
  const initAccessToken = Cookies.get(ACCESS_TOKEN) || ''
  const initRefreshToken = Cookies.get(REFRESH_TOKEN) || ''
  const initUserData = Cookies.get(USER_DATA) 
    ? JSON.parse(Cookies.get(USER_DATA)!) 
    : null

  return {
    auth: {
      user: initUserData,
      accessToken: initAccessToken,
      refreshToken: initRefreshToken,
      needsPasswordChange: false,
      isAuthenticated: !!(initAccessToken && initUserData),

      setUser: (user) =>
        set((state) => {
          if (user) {
            Cookies.set(USER_DATA, JSON.stringify(user), { expires: 7 })
          } else {
            Cookies.remove(USER_DATA)
          }
          return { 
            ...state, 
            auth: { 
              ...state.auth, 
              user,
              isAuthenticated: !!(user && state.auth.accessToken)
            } 
          }
        }),

      setTokens: ({ access_token, refresh_token }) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, access_token, { expires: 1 }) // 1 day
          Cookies.set(REFRESH_TOKEN, refresh_token, { expires: 7 }) // 7 days
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken: access_token,
              refreshToken: refresh_token,
              isAuthenticated: !!(access_token && state.auth.user)
            }
          }
        }),

      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, accessToken, { expires: 1 })
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken,
              isAuthenticated: !!(accessToken && state.auth.user)
            }
          }
        }),

      setPasswordChangeFlag: (needsPasswordChange) =>
        set((state) => ({
          ...state,
          auth: { ...state.auth, needsPasswordChange }
        })),

      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          Cookies.remove(REFRESH_TOKEN)
          Cookies.remove(USER_DATA)
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              refreshToken: '',
              needsPasswordChange: false,
              isAuthenticated: false
            }
          }
        }),

      logout: () => {
        get().auth.reset()
      }
    }
  }
})

export const useAuth = () => useAuthStore((state) => state.auth)