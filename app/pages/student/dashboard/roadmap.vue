<template>
    <RoadmapPopuup 
        v-model:is-open="isRoadmapPopupOpen"
        :selected-item="selectedRoadmapItem"
        @refresh-roadmap="handleRefreshRoadmap"
    />
    
    <div v-if="pending" class="flex justify-center items-center min-h-screen bg-gradient-to-b from-primary to-red-700">
        <div class="text-center">
            <div class="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-white border-t-transparent rounded-full"></div>
            <p class="text-white">Memuat roadmap...</p>
        </div>
    </div>

    <section v-else-if="!roadmapData" class="overflow-hidden relative py-6 -m-6 min-h-screen bg-gradient-to-b to-red-700 min-w-screen md:py-8 from-primary">
        <div class="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl md:w-72 md:h-72 bg-white/10"></div>
        <div class="absolute -right-10 -bottom-20 w-64 h-64 rounded-full blur-3xl md:w-96 md:h-96 bg-pink-400/20"></div>
        
        <div class="container px-4 py-8 mx-auto md:py-16">
            <div class="max-w-2xl mx-auto text-center">
                <div class="mb-8">
                    <div class="p-6 w-24 h-24 mx-auto rounded-full shadow-lg backdrop-blur-sm bg-white/10">
                        <Icon name="heroicons:clipboard-document-list-20-solid" class="w-full h-full text-white" />
                    </div>
                </div>

                <!-- Title & Description -->
                <h1 class="mb-4 text-3xl font-bold text-white md:text-4xl">
                    Roadmap Pembelajaran Anda
                </h1>
                <p class="mb-8 text-lg text-white/90 leading-relaxed">
                    {{ errorMessage || 'Silakan lengkapi questionnaire profiling karir terlebih dahulu untuk melihat roadmap yang sesuai dengan minat dan kemampuan Anda' }}
                </p>

                <!-- CTA Button -->
                <UniversalButton
                    text="Mulai Profiling Karir"
                    size="lg"
                    class="mx-auto"
                    @click="navigateToProfile"
                >
                    <template #icon>
                        <Icon name="heroicons:arrow-right-20-solid" class="w-5 h-5" />
                    </template>
                </UniversalButton>

                <!-- Additional Info -->
                <div class="mt-12 p-6 rounded-2xl backdrop-blur-sm bg-white/10">
                    <h3 class="mb-4 text-xl font-semibold text-white">Mengapa Profiling Penting?</h3>
                    <div class="grid gap-4 md:grid-cols-3">
                        <div class="text-center">
                            <Icon name="heroicons:cursor-arrow-rays-20-solid" class="w-8 h-8 mx-auto mb-2 text-white/80" />
                            <p class="text-sm text-white/80">Pembelajaran yang Tepat Sasaran</p>
                        </div>
                        <div class="text-center">
                            <Icon name="heroicons:chart-bar-20-solid" class="w-8 h-8 mx-auto mb-2 text-white/80" />
                            <p class="text-sm text-white/80">Progress yang Terukur</p>
                        </div>
                        <div class="text-center">
                            <Icon name="heroicons:academic-cap-20-solid" class="w-8 h-8 mx-auto mb-2 text-white/80" />
                            <p class="text-sm text-white/80">Karir yang Terarah</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Main Roadmap Section -->
    <section v-else class="overflow-hidden relative py-6 -m-6 min-h-screen bg-gradient-to-b to-red-700 min-w-screen md:py-8 from-primary">
        <!-- Background Elements - Adjusted for mobile -->
        <div class="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl md:w-72 md:h-72 bg-white/10"></div>
        <div class="absolute -right-10 -bottom-20 w-64 h-64 rounded-full blur-3xl md:w-96 md:h-96 bg-pink-400/20"></div>
        
        <div class="hidden absolute top-32 right-32 w-16 h-16 rounded-lg rotate-45 md:block bg-white/5"></div>
        <div class="hidden absolute bottom-32 left-48 w-20 h-20 rounded-full md:block bg-white/5"></div>
        <div class="hidden absolute left-8 top-1/2 w-6 h-6 rounded-full sm:block md:w-8 md:h-8 bg-white/10"></div>
        <div class="hidden absolute right-16 top-1/4 w-8 h-8 rounded-lg rotate-12 sm:block md:w-12 md:h-12 bg-white/5"></div>

        <!-- Floating Icons - Responsive positioning -->
                <!-- Floating Icons - Responsive positioning -->
        <div class="absolute left-8 top-16 md:top-24 md:left-32 lg:left-48 animate-float">
            <div class="p-2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 md:p-3">
                <NuxtImg src="https://aicademy.galleryne.my.id/assets/home-icon.webp" alt="Home" class="object-contain w-full h-full opacity-80"  />
            </div>
        </div>

        <div class="absolute right-8 top-1/3 md:right-24 lg:right-32 animate-float-delayed">
            <div class="p-2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 md:p-3">
                <NuxtImg src="https://aicademy.galleryne.my.id/assets/book-icon.webp" alt="Book" class="object-contain w-full h-full opacity-80"  />
            </div>
        </div>

        <div class="absolute left-4 bottom-32 md:bottom-40 md:left-16 animate-float-slow">
            <div class="p-2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 md:p-3">
                <NuxtImg src="https://aicademy.galleryne.my.id/assets/gear-icon.webp" alt="Settings" class="object-contain w-full h-full opacity-80"  />
            </div>
        </div>

        <div class="container px-4 py-8 mx-auto md:py-16">
            <!-- Header -->
            <div class="mb-8 text-center md:mb-16">
                <h1 class="px-4 mb-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl md:mb-4">
                    {{ roadmapData?.roadmap_name || 'Roadmap Pembelajaran' }}
                </h1>
                <p class="px-4 mx-auto max-w-2xl text-sm text-white/80 md:text-base lg:text-lg">
                    {{ roadmapData?.description || 'Ikuti perjalanan pembelajaran yang terstruktur' }}
                </p>

                <!-- Start Roadmap Button - Show if not started yet -->
                <div v-if="!isRoadmapStarted && roadmapData?.id" class="mt-6">
                    <UniversalButton
                        :text="isStartingRoadmap ? 'Memulai...' : 'Mulai Roadmap'"
                        :disabled="isStartingRoadmap"
                        size="lg"
                        class="mx-auto"
                        @click="handleStartRoadmap"
                    >
                        <template #icon>
                            <Icon 
                                :name="isStartingRoadmap ? 'heroicons:arrow-path-20-solid' : 'heroicons:play-circle-20-solid'" 
                                :class="{ 'animate-spin': isStartingRoadmap }"
                                class="w-5 h-5" 
                            />
                        </template>
                    </UniversalButton>
                </div>

                <!-- Progress Info - Show if started -->
                <div v-if="isRoadmapStarted && roadmapData?.progress" class="mt-6 p-4 mx-auto max-w-md rounded-xl backdrop-blur-sm bg-white/10">
                    <div class="flex justify-between items-center mb-2 text-sm text-white/90">
                        <span>Progress</span>
                        <span>{{ progressText }}%</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-white/20">
                        <div 
                            class="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300"
                            :style="{ width: progressBarWidth }"
                        ></div>
                    </div>
                    <p class="mt-1 text-xs text-white/70">{{ progressText }}% Complete</p>
                </div>

                <!-- Roadmap Started Status -->
                <div v-if="isRoadmapStarted" class="mt-4">
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm bg-green-500/20 border border-green-400/30">
                        <Icon name="heroicons:check-circle-20-solid" class="w-4 h-4 text-green-400" />
                        <span class="text-sm text-green-100">Roadmap Dimulai</span>
                    </div>
                </div>
            </div>

            <!-- Timeline - Show only if roadmap started -->
            <div v-if="isRoadmapStarted">
                <ClientOnly>
                  <RoadmapTimeline 
                    :key="timelineItems.length"
                    :timeline-items="timelineItems"
                    @learn-more="handleLearnMore"
                    @start-step="handleStartStep"
                  />
                </ClientOnly>
            </div>

            <!-- Not Started Message -->
            <div v-else class="text-center py-12">
                <div class="mb-6">
                    <Icon name="heroicons:lock-closed-20-solid" class="w-16 h-16 mx-auto text-white/60" />
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">Roadmap Belum Dimulai</h3>
                <p class="text-white/80">Klik tombol "Mulai Roadmap" di atas untuk memulai perjalanan pembelajaran Anda.</p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import RoadmapTimeline from '~/components/dashboard-student/roadmap/RoadmapTimeline.vue'
import RoadmapPopuup from '~/components/modal/RoadmapPopuup.vue';
import UniversalButton from '~/components/button/UniversalButton.vue';
import type { RoadmapTimelineItem } from '~/types/RoadmapTimeline';

definePageMeta({
    layout: 'dashboard-layout-student-dashboard-layout',
    ssr: false 
})

const selectedRoadmapItem = ref<RoadmapTimelineItem | null>(null)
const isRoadmapPopupOpen = ref(false)
const isStartingRoadmap = ref(false)
const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

// Ganti useLazyAsyncData -> useAsyncData + transform (seperti kuisioner)
const { data: roadmapState, pending, error, refresh } = await useAsyncData(
  'student-my-roadmap',
  async () => {
    return await $fetch('/student/my-roadmap', {
      method: 'GET',
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers
    })
  },
  {
    server: false,
    transform: (res: any) => {
      return {
        success: !!res?.success,
        message: res?.message || '',
        payload: res?.data || null
      }
    }
  }
)

// roadmapData dan errorMessage jadi computed agar selalu sinkron
const roadmapData = computed(() => roadmapState.value?.payload || null)
const errorMessage = computed(() => {
  return roadmapState.value && roadmapState.value.success === false
    ? roadmapState.value.message || 'Gagal memuat roadmap'
    : ''
})

// Check if roadmap is started from localStorage
const isRoadmapStarted = ref(false)

// Check localStorage on mount
onMounted(() => {
  if (process.client && roadmapData.value?.id) {
    const startedRoadmaps = JSON.parse(localStorage.getItem('startedRoadmaps') || '[]')
    isRoadmapStarted.value = startedRoadmaps.includes(roadmapData.value.id)
  }
})

// Watch roadmapData changes to check localStorage
watch(roadmapData, (newData) => {
  if (process.client && newData?.id) {
    const startedRoadmaps = JSON.parse(localStorage.getItem('startedRoadmaps') || '[]')
    isRoadmapStarted.value = startedRoadmaps.includes(newData.id)
  }
}, { immediate: true })

// Handle start roadmap
const handleStartRoadmap = async () => {
  if (!roadmapData.value?.id || isStartingRoadmap.value) return
  
  isStartingRoadmap.value = true
  
  try {
    const payload = { roadmap_id: roadmapData.value.id }
    const response = await $fetch('/student/roadmaps/start', {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
      },
      baseURL: config.public.apiBase,
      credentials: 'include'
    })
    
    if (response.success) {
      // Save to localStorage
      if (process.client) {
        const startedRoadmaps = JSON.parse(localStorage.getItem('startedRoadmaps') || '[]')
        if (!startedRoadmaps.includes(roadmapData.value.id)) {
          startedRoadmaps.push(roadmapData.value.id)
          localStorage.setItem('startedRoadmaps', JSON.stringify(startedRoadmaps))
        }
        isRoadmapStarted.value = true
      }
      
      // Refresh roadmap data
      await refresh()
      
      console.log('Roadmap started successfully')
    }
  } catch (error) {
    console.error('Error starting roadmap:', error)
  } finally {
    isStartingRoadmap.value = false
  }
}

const timelineItems = computed(() => {
  const steps = roadmapData.value?.steps
  if (!steps || !Array.isArray(steps)) return []

  return steps.map((step: any, index: number) => {
    // Safe parse resource_links
    let links: string[] = []
    try {
      if (Array.isArray(step.resource_links)) {
        links = step.resource_links
      } else if (typeof step.resource_links === 'string') {
        links = JSON.parse(step.resource_links || '[]')
      }
    } catch {
      links = []
    }

    return {
      title: step.title,
      description: step.description,
      duration: `${step.estimated_duration} Jam`,
      icon: getStepIcon(step.difficulty_level),
      isActive: step.status === 'unlocked' || step.status === 'in_progress',
      isCompleted: step.status === 'completed',
      isLocked: step.is_locked,
      learningObjectives: step.learning_objectives ? [step.learning_objectives] : [],
      tasks: [],
      submissions: [],
      resources: links.map((link: string, idx: number) => ({
        id: `res${idx}`,
        title: `Resource ${idx + 1}`,
        type: 'documentation',
        url: link
      })),
      stepData: step
    } as RoadmapTimelineItem
  })
})

// Helper function to get icon based on difficulty
const getStepIcon = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'heroicons:play-circle-20-solid'
    case 'intermediate': return 'heroicons:puzzle-piece-20-solid'
    case 'advanced': return 'heroicons:rocket-launch-20-solid'
    default: return 'heroicons:book-open-20-solid'
  }
}

const handleLearnMore = (item: RoadmapTimelineItem) => {
  selectedRoadmapItem.value = item
  isRoadmapPopupOpen.value = true
}

const handleStartStep = async (item: RoadmapTimelineItem) => {
  if (item.stepData?.id && item.stepData?.can_start) {
    try {
      const payload = { step_id: String(item.stepData.id) }
      const response = await $fetch('/student/roadmaps/steps/start', {
        method: 'POST',
        body: payload,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers
        },
        baseURL: config.public.apiBase,
        credentials: 'include'
      })
      if (response.success) {
        await refresh()
      }
    } catch (error) {
      console.error('Error starting step:', error)
    }
  }
}

const handleRefreshRoadmap = async () => {
  await refresh()
}

const navigateToProfile = () => {
  navigateTo('/student/dashboard/questionnaires')
}

// Progress guard (hindari NaN/Infinity)
const progressText = computed(() => {
  const p = roadmapData.value?.progress
  if (!p || !p.total_steps) return 0
  const v = (p.completed_steps / p.total_steps) * 100
  return Number.isFinite(v) ? Number(v.toFixed(1)) : 0
})
const progressBarWidth = computed(() => `${roadmapData.value?.progress?.progress_percent ?? progressText.value}%`)
</script>

<style scoped>
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

@keyframes float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
}

@keyframes float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float-delayed 8s ease-in-out infinite;
}

.animate-float-slow {
    animation: float-slow 10s ease-in-out infinite;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
    .animate-float,
    .animate-float-delayed,
    .animate-float-slow {
        animation: none;
    }
}
</style>