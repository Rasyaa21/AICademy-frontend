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

      <!-- Recent Activity (Mock Data) -->
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div class="space-y-3">
          <div v-if="dashboardData.submission_stats.total_submissions === 0" class="text-center py-8">
            <Icon name="heroicons:inbox-20-solid" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-500">No recent activity</p>
            <p class="text-sm text-gray-400">Submissions and challenges will appear here</p>
          </div>
          <div v-else class="space-y-3">
            <!-- Ini bisa diisi dengan data real activity dari API -->
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div class="p-2 bg-blue-100 rounded-full">
                <Icon name="heroicons:document-text-16-solid" class="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">New submission received</p>
                <p class="text-xs text-gray-500">Challenge: React Portfolio - 2 minutes ago</p>
              </div>
            </div>
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
</script>