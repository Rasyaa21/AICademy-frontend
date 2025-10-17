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

      <!-- Second Row Stats -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Challenges" :value="dashboardData.challenges.length" icon="heroicons:trophy-20-solid" />
        <StatsCard title="Active Challenges" :value="dashboardData.activeChallenges" icon="heroicons:fire-20-solid" />
        <StatsCard title="Pending Submissions" :value="dashboardData.pendingSubmissions" icon="heroicons:clock-20-solid" />
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Student Distribution Chart -->
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Distribusi Siswa per Jurusan</h3>
          <ParticipationChart :student-stats="dashboardData.student_stats" />
        </div>

        <!-- Challenge Participation Chart -->
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Partisipasi Challenge</h3>
          <ChallengeParticipationChart :challenges="dashboardData.challenges" />
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Recent Challenges -->
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Recent Challenges</h3>
            <NuxtLink to="/admin/dashboard/challenges" class="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </NuxtLink>
          </div>
          <div class="space-y-3">
            <div v-for="challenge in dashboardData.challenges.slice(0, 3)" :key="challenge.id" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 text-sm">{{ challenge.title }}</h4>
                <p class="text-xs text-gray-600 mt-1">{{ challenge.current_participants }}/{{ challenge.max_participants }} participants</p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="challenge.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ challenge.is_active ? 'Active' : 'Inactive' }}
                </span>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatDate(challenge.deadline) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Submissions -->
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Recent Submissions</h3>
            <NuxtLink to="/admin/dashboard/submissions" class="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </NuxtLink>
          </div>
          <div class="space-y-3">
            <div v-for="submission in dashboardData.roadmap_submissions.slice(0, 4)" :key="submission.id"
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 text-sm">{{ submission.step_title }}</h4>
                <p class="text-xs text-gray-600 mt-1">by {{ submission.student_name }}</p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusClass(submission.status)">
                  {{ formatStatus(submission.status) }}
                </span>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatDate(submission.submitted_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import AdminDashboardHeader from '~/components/dashboard-admin/sections/AdminDashboardHeader.vue'
import StatsCard from '~/components/dashboard-admin/index/StatsCard.vue'
import ParticipationChart from '~/components/dashboard-admin/index/ParticipationChart.vue'
import ChallengeParticipationChart from '~/components/dashboard-admin/index/ChallengeParticipationChart.vue'

definePageMeta({ layout: 'admin-dashboard-layout' })

const config = useRuntimeConfig()

interface Challenge {
  id: string
  title: string
  description: string
  deadline: string
  prize: string
  max_participants: number
  current_participants: number
  is_active: boolean
  created_at: string
}

interface RoadmapSubmission {
  id: string
  roadmap_step_id: string
  step_title: string
  student_profile_id: string
  student_name: string
  evidence_link: string
  evidence_type: string
  submission_notes: string
  validation_notes: string | null
  validation_score: number | null
  status: string
  submitted_at: string
  is_validated: boolean
}

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
    challenges: Challenge[]
    roadmap_submissions: RoadmapSubmission[]
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
  challenges: Challenge[]
  roadmap_submissions: RoadmapSubmission[]
  activeChallenges: number
  pendingSubmissions: number
}

function pct(count: number, total: number) {
  if (!total) return 0
  return Math.round((count / total) * 1000) / 10 // 1 desimal
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function formatStatus(status: string) {
  const statusMap: Record<string, string> = {
    'submitted': 'Submitted',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'pending': 'Pending'
  }
  return statusMap[status] || status
}

function getStatusClass(status: string) {
  const classMap: Record<string, string> = {
    'submitted': 'bg-blue-100 text-blue-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'pending': 'bg-yellow-100 text-yellow-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
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

    // Calculate active challenges and pending submissions
    const activeChallenges = res.data.challenges.filter(c => c.is_active).length
    const pendingSubmissions = res.data.roadmap_submissions.filter(sub => sub.status === 'submitted').length

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
      ],
      challenges: res.data.challenges,
      roadmap_submissions: res.data.roadmap_submissions,
      activeChallenges,
      pendingSubmissions
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