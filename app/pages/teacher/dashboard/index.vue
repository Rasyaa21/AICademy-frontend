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
        @click="refresh()"
        class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
      >
        Retry
      </button>
    </div>

    <!-- Dashboard Content -->
    <template v-else-if="dashboardData">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p class="text-gray-600 mt-1">Kelola challenge dan monitor submission siswa</p>
        </div>
      </div>

      <!-- Challenge Stats Cards -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Challenges</p>
              <p class="text-3xl font-bold text-gray-900">{{ dashboardData.challenge_stats.total_challenges }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <Icon name="heroicons:puzzle-piece-20-solid" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Challenges</p>
              <p class="text-3xl font-bold text-green-600">{{ dashboardData.challenge_stats.active_challenges }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <Icon name="heroicons:play-20-solid" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Completed Challenges</p>
              <p class="text-3xl font-bold text-purple-600">{{ dashboardData.challenge_stats.completed_challenges }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <Icon name="heroicons:check-circle-20-solid" class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Submission Stats Cards -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Submissions</p>
              <p class="text-3xl font-bold text-gray-900">{{ dashboardData.submission_stats.total_submissions }}</p>
            </div>
            <div class="p-3 bg-indigo-100 rounded-full">
              <Icon name="heroicons:document-text-20-solid" class="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Scored Submissions</p>
              <p class="text-3xl font-bold text-emerald-600">{{ dashboardData.submission_stats.scored_submissions }}</p>
            </div>
            <div class="p-3 bg-emerald-100 rounded-full">
              <Icon name="heroicons:star-20-solid" class="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending Submissions</p>
              <p class="text-3xl font-bold text-orange-600">{{ dashboardData.submission_stats.pending_submissions }}</p>
            </div>
            <div class="p-3 bg-orange-100 rounded-full">
              <Icon name="heroicons:clock-20-solid" class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Roadmap Stats Cards -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Step Submissions</p>
              <p class="text-3xl font-bold text-blue-600">{{ dashboardData.roadmap_stats.total_step_submissions }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <Icon name="heroicons:clipboard-document-list-20-solid" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Validated Submissions</p>
              <p class="text-3xl font-bold text-green-600">{{ dashboardData.roadmap_stats.validated_submissions }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <Icon name="heroicons:check-badge-20-solid" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending Validations</p>
              <p class="text-3xl font-bold text-amber-600">{{ dashboardData.roadmap_stats.pending_validations }}</p>
            </div>
            <div class="p-3 bg-amber-100 rounded-full">
              <Icon name="heroicons:exclamation-triangle-20-solid" class="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Roadmap Submissions -->
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">Recent Roadmap Submissions</h3>
          <NuxtLink 
            to="/teacher/dashboard/roadmap"
            class="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View All
          </NuxtLink>
        </div>
        
        <div v-if="dashboardData.roadmap_submissions?.length === 0" class="text-center py-8">
          <Icon name="heroicons:inbox-20-solid" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p class="text-gray-500">No recent submissions</p>
          <p class="text-sm text-gray-400">Roadmap submissions will appear here</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="submission in dashboardData.roadmap_submissions.slice(0, 5)" 
            :key="submission.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-full" :class="getSubmissionStatusClass(submission.status)">
                  <Icon :name="getSubmissionStatusIcon(submission.status)" class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 text-sm">{{ submission.step_title }}</h4>
                  <p class="text-xs text-gray-600 mt-1">by {{ submission.student_name }}</p>
                </div>
              </div>
            </div>
            <div class="text-right">
              <span 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(submission.status)"
              >
                {{ formatStatus(submission.status) }}
              </span>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatDate(submission.submitted_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Challenge Activity (if any challenges exist) -->
      <div v-if="dashboardData.challenges?.length > 0" class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">Recent Challenge Activity</h3>
          <NuxtLink 
            to="/teacher/dashboard/challenges"
            class="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View All
          </NuxtLink>
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="challenge in dashboardData.challenges.slice(0, 3)" 
            :key="challenge.id"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div class="p-2 bg-blue-100 rounded-full">
              <Icon name="heroicons:trophy-16-solid" class="w-4 h-4 text-blue-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ challenge.title }}</p>
              <p class="text-xs text-gray-500">{{ challenge.current_participants }} participants</p>
            </div>
            <span 
              class="text-xs px-2 py-1 rounded-full"
              :class="new Date(challenge.deadline) > new Date() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ new Date(challenge.deadline) > new Date() ? 'Active' : 'Ended' }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  layout: 'teacher-dashboard-layout'
})

const config = useRuntimeConfig()

interface Challenge {
  id: string
  title: string
  deadline: string
  current_participants: number
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
    challenge_stats: {
      total_challenges: number
      active_challenges: number
      completed_challenges: number
    }
    submission_stats: {
      total_submissions: number
      scored_submissions: number
      pending_submissions: number
    }
    roadmap_stats: {
      total_step_submissions: number
      validated_submissions: number
      pending_validations: number
    }
    challenges: Challenge[]
    challenge_submissions: any[]
    roadmap_submissions: RoadmapSubmission[]
  }
}

const {
  data: dashboardData,
  pending,
  error,
  refresh
} = await useLazyAsyncData(
  'teacher-dashboard',
  async () => {
    const res = await $fetch<ApiResponse>('/teacher/dashboard', {
      baseURL: config.public.apiBase,
      credentials: 'include',
      method: 'GET'
    })
    
    return res.data
  },
  {
    transform: (data: any) => data,
    default: () => null,
    server: false
  }
)

// Error message handling
const errMsg = computed(() => {
  const e = error.value as any
  return e?.data?.message || e?.message || ''
})

// Helper functions
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Invalid Date'
  }
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'submitted': 'Pending Review',
    'approved': 'Approved',
    'rejected': 'Rejected'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'submitted': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const getSubmissionStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'submitted': 'bg-yellow-100',
    'approved': 'bg-green-100',
    'rejected': 'bg-red-100'
  }
  return classMap[status] || 'bg-gray-100'
}

const getSubmissionStatusIcon = (status: string) => {
  const iconMap: Record<string, string> = {
    'submitted': 'heroicons:clock-16-solid',
    'approved': 'heroicons:check-16-solid',
    'rejected': 'heroicons:x-mark-16-solid'
  }
  return iconMap[status] || 'heroicons:document-16-solid'
}
</script>