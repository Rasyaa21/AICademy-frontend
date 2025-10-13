import { defineStore } from 'pinia'

type StudentProfile = {
  user_id: string
  fullname: string
  nis: string
  class: string
  profile_picture: string | null
}

interface MeResponse {
  success: boolean
  data: {
    student_profile: StudentProfile
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as StudentProfile | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userInitials: (state) => {
      if (!state.user?.fullname) return ''
      return state.user.fullname
        .split(' ')
        .map(w => w.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
  },

  actions: {
    async fetchUser() {
      this.isLoading = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const res = await $fetch<MeResponse>('/student/me', {
          baseURL: config.public.apiBase,
          credentials: 'include',
          method: 'GET'
        })
        if (res?.success && res?.data?.student_profile) {
          this.user = res.data.student_profile
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err: unknown) {
        const e = err as { data?: { message?: string } }
        console.error('Error fetching user:', err)
        this.error = e?.data?.message || 'Failed to fetch user data'
        this.user = null
      } finally {
        this.isLoading = false
      }
    },

    refreshUser() {
      return this.fetchUser()
    },

    logout() {
      this.user = null
      this.error = null
    },

    updateUser(userData: Partial<StudentProfile>) {
      if (this.user) this.user = { ...this.user, ...userData }
    }
  },

  persist: true
})