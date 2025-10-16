import { defineStore } from 'pinia'
import { getCookieConfig } from '~/utils/cookie-config'

type StudentProfile = {
  user_id: string
  fullname: string
  nis: string
  class: string
  profile_picture: string | null
}

interface MeResponse {
  success: boolean
  message: string
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
        const res = await $fetch(config.public.apiBase + '/auth/me', {
          method: 'GET',
          credentials: 'include',
        })
        const data: any = res
        if (!data?.success || !data?.data) throw new Error('Unauthenticated')
        this.user = data.data
        this.isAuthenticated = true
      } catch (e: any) {
        this.user = null
        this.isAuthenticated = false
        this.error = e?.data?.message || e?.message || 'Unauthorized'
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