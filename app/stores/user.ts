import { defineStore } from 'pinia'

type StudentProfile = {
  user_id: string
  fullname: string
  nis: string
  class: string
  profile_picture: string | null
  // tambahkan field lain bila perlu
}

interface MeResponse {
  success: boolean
  message: string
  // API Anda mengembalikan data langsung StudentProfile (lihat contoh /auth/me)
  data: StudentProfile | { student_profile: StudentProfile }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as StudentProfile | null,
    isLoading: false,
    error: null as string | null,
    isAuthenticated: false,
  }),

  getters: {
    getUserAuthenticated: (state) => !!state.user,
    userInitials: (state) => {
      if (!state.user?.fullname) return ''
      return state.user.fullname
        .split(' ')
        .map((w) => w.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },
  },

  actions: {
    async fetchUser() {
      this.isLoading = true
      this.error = null
      try {
        const config = useRuntimeConfig()

        const accessTokenCookie = useCookie<string | null>('access_token', { secure: true, sameSite: 'lax' })
        const tokenCookie = useCookie<string | null>('token', { secure: true, sameSite: 'lax' })
        const token = accessTokenCookie.value || tokenCookie.value

        const res = await $fetch<MeResponse>(config.public.apiBase + '/auth/me', {
          credentials: 'include',
          method: 'GET',
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        })

        if (res?.success && res?.data) {
          const userData = 'student_profile' in res.data ? res.data.student_profile : (res.data as StudentProfile)
          this.user = userData
          this.isAuthenticated = true
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err: any) {
        this.error = err?.data?.message || 'Failed to fetch user data'
        this.user = null
        this.isAuthenticated = false
      } finally {
        this.isLoading = false
      }
    },

    async refreshUser() {
      return this.fetchUser()
    },

    logout() {
      this.user = null
      this.error = null
      this.isAuthenticated = false
    },

    updateUser(userData: Partial<StudentProfile>) {
      if (this.user) this.user = { ...this.user, ...userData }
    },
  },
})