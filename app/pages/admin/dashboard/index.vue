<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mr-3" />
      <span class="text-gray-600">Loading dashboard...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="errMsg" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-2 text-red-800 mb-2">
        <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5" />
        <h3 class="font-medium">Failed to Load Dashboard</h3>
      </div>
      <p class="text-red-600 text-sm mb-3">{{ errMsg }}</p>
      <button 
        class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
        @click="refresh()"
      >
        Retry
      </button>
    </div>

    <!-- Dashboard Content -->
    <template v-else-if="dashboardData">
      <AdminDashboardHeader />
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Pengguna"   :value="dashboardData.totals.totalUsers"     icon="heroicons:users-16-solid" />
        <StatsCard title="Total Siswa"      :value="dashboardData.totals.totalStudents"  icon="heroicons:academic-cap-20-solid" />
        <StatsCard title="Total Guru"       :value="dashboardData.totals.totalTeachers"  icon="heroicons:user-group-20-solid" />
        <StatsCard title="Total Perusahaan" :value="dashboardData.totals.totalCompanies" icon="heroicons:building-office-20-solid" />
      </div>

      <!-- Participation Chart -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Distribusi Siswa per Jurusan</h3>
        <ParticipationChart :student-stats="dashboardData.student_stats" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/pages/admin/dashboard/index.vue
import AdminDashboardHeader from '~/components/dashboard-admin/sections/AdminDashboardHeader.vue'
import StatsCard from '~/components/dashboard-admin/index/StatsCard.vue'
import ParticipationChart from '~/components/dashboard-admin/index/ParticipationChart.vue'

definePageMeta({ layout: 'admin-dashboard-layout' })

const config = useRuntimeConfig()

interface ApiResponse {
  success: boolean
  message: string
  data: {
    totals: {
      total_users: number
      total_students: number
      total_teachers: number
      total_companies: number
    }
    student_stats: {
      total_tkj: number
      total_tja: number
      total_pplg: number
      total_rpl: number
    }
  }
}

interface DashboardVM {
  totals: {
    totalUsers: number
    totalStudents: number
    totalTeachers: number
    totalCompanies: number
  }
  student_stats: Array<{ name: string; count: number; percentage: number }>
}

function pct(count: number, total: number) {
  if (!total) return 0
  return Math.round((count / total) * 1000) / 10 // 1 desimal
}

const {
  data: dashboardData,
  pending,
  error,
  refresh
} = await useLazyAsyncData<DashboardVM>(
  'admin-dashboard',
  async () => {
    const res = await $fetch<ApiResponse>('/admin/dashboard', {
      baseURL: config.public.apiBase,
      credentials: 'include',
      method: 'GET'
    })

    const t = res.data.totals
    const s = res.data.student_stats
    const totalStudents = t.total_students

    return {
      totals: {
        totalUsers: t.total_users,
        totalStudents: t.total_students,
        totalTeachers: t.total_teachers,
        totalCompanies: t.total_companies
      },
      student_stats: [
        { name: 'TKJ',  count: s.total_tkj,  percentage: pct(s.total_tkj,  totalStudents) },
        { name: 'TJA',  count: s.total_tja,  percentage: pct(s.total_tja,  totalStudents) },
        { name: 'PPLG', count: s.total_pplg, percentage: pct(s.total_pplg, totalStudents) },
        { name: 'RPL',  count: s.total_rpl,  percentage: pct(s.total_rpl,  totalStudents) }
      ]
    }
  },
  {
    transform: (data: any) => data,
    default: () => null,
    server: false
  }
)

const errMsg = computed(() => {
  const e = error.value as any
  return e?.data?.message || e?.message || ''
})
</script>