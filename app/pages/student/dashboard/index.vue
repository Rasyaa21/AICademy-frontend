<template>
    <div class="w-full flex lg:flex-row lg:space-x-4 flex-col space-y-5 lg:space-y-0 bg-white/80">
        <div class="flex-[7] space-y-5">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p class="text-gray-600 mt-1">
                        Kelola progress belajar dan monitor aktivitas Anda
                    </p>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="pending" class="flex justify-center items-center py-12">
                <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mr-3" />
                <span class="text-gray-600">Memuat dashboard...</span>
            </div>

            <!-- Error State -->
            <div v-else-if="error || errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-center gap-2 text-red-800 mb-2">
                    <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5" />
                    <h3 class="font-medium">Gagal Memuat Dashboard</h3>
                </div>
                <p class="text-red-600 text-sm mb-3">{{ errorMessage || error }}</p>
                <button 
                    @click="refresh()"
                    class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                    Retry
                </button>
            </div>

            <!-- Dashboard Content -->
            <template v-else-if="dashboardData">
                <ProfilingBanner />

                <!-- Roadmap Progress -->
                <MyRoadmapProgress 
                    :roadmap="dashboardData.roadmap"
                    :summary="dashboardData.summary"
                />

                <!-- Active Challenges -->
                <MyChallengeProgress 
                    :challenges="dashboardData.challenges"
                    :summary="dashboardData.summary"
                />
            </template>
        </div>

        <div class="flex-[3] space-y-5">
            <Calendar />
        </div>
    </div>
</template>

<script setup lang="ts">
import Calendar from '~/components/calendar/Calendar.vue'
import MyRoadmapProgress from '~/components/dashboard-student/index/MyRoadmapProgress.vue'
import MyChallengeProgress from '~/components/dashboard-student/index/MyChallengeProgress.vue'
import ProfilingBanner from '~/components/dashboard-student/index/ProfilingBanner.vue'

definePageMeta({
    layout: 'dashboard-layout-student-dashboard-layout',
    ssr: false
})

const config = useRuntimeConfig()
const dashboardData = ref<any>(null)
const errorMessage = ref<string>('')

// Fetch dashboard data from API - menggunakan pattern yang sama seperti roadmap
const { data, pending, error, refresh } = await useLazyAsyncData(
    'student-dashboard',
    async () => {
        return await $fetch('/student/dashboard', {
            baseURL: config.public.apiBase,
            credentials: 'include',
            method: 'GET'
        })
    },
    {
        server: false,
        default: () => null
    }
)

// Watch for data changes and update dashboardData
watch(data, (newData) => {
  if (newData?.success && newData?.data) {
    dashboardData.value = newData.data
  } else if (newData && !newData.success) {
    errorMessage.value = newData.message || 'Gagal memuat dashboard'
  }
}, { immediate: true })

// Watch for error changes
watch(error, (newError) => {
  if (newError) {
    console.error('Error loading dashboard:', newError)
    errorMessage.value = 'Terjadi kesalahan saat memuat dashboard'
  }
}, { immediate: true })

// Initialize data on mount
onMounted(() => {
  if (data.value?.success && data.value?.data) {
    dashboardData.value = data.value.data
  } else if (data.value && !data.value.success) {
    errorMessage.value = data.value.message || 'Gagal memuat dashboard'
  }
})
</script>