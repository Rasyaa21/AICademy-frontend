<template>
    <RoadmapPopuup 
        v-model:is-open="isRoadmapPopupOpen"
        :selected-item="selectedRoadmapItem"
        @refresh-roadmap="handleRefreshRoadmap"
    />
    
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center min-h-screen bg-gradient-to-b from-primary to-red-700">
        <div class="text-center">
            <div class="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-white border-t-transparent rounded-full"></div>
            <p class="text-white">Memuat roadmap...</p>
        </div>
    </div>

    <!-- Profiling CTA Section -->
    <section v-else-if="!roadmapData" class="overflow-hidden relative py-6 -m-6 min-h-screen bg-gradient-to-b to-red-700 min-w-screen md:py-8 from-primary">
        <!-- Background Elements -->
        <div class="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl md:w-72 md:h-72 bg-white/10"></div>
        <div class="absolute -right-10 -bottom-20 w-64 h-64 rounded-full blur-3xl md:w-96 md:h-96 bg-pink-400/20"></div>
        
        <div class="container px-4 py-8 mx-auto md:py-16">
            <div class="max-w-2xl mx-auto text-center">
                <!-- Icon -->
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
                            <Icon name="heroicons:target-20-solid" class="w-8 h-8 mx-auto mb-2 text-white/80" />
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
        <div class="absolute left-8 top-16 md:top-24 md:left-32 lg:left-48 animate-float">
            <div class="p-2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 md:p-3">
                <Icon name="heroicons:academic-cap-20-solid" class="w-full h-full text-white opacity-80" />
            </div>
        </div>

        <div class="absolute right-8 top-1/3 md:right-24 lg:right-32 animate-float-delayed">
            <div class="p-2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 md:p-3">
                <Icon name="heroicons:book-open-20-solid" class="w-full h-full text-white opacity-80" />
            </div>
        </div>

        <div class="absolute left-4 bottom-32 md:bottom-40 md:left-16 animate-float-slow">
            <div class="p-2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 md:p-3">
                <Icon name="heroicons:light-bulb-20-solid" class="w-full h-full text-white opacity-80" />
            </div>
        </div>

        <div class="container px-4 py-8 mx-auto md:py-16">
            <!-- Header - Responsive text sizes -->
            <div class="mb-8 text-center md:mb-16">
                <h1 class="px-4 mb-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl md:mb-4">
                    {{ roadmapData?.roadmap_name || 'Roadmap Pembelajaran' }}
                </h1>
                <p class="px-4 mx-auto max-w-2xl text-sm text-white/80 md:text-base lg:text-lg">
                    {{ roadmapData?.description || 'Ikuti perjalanan pembelajaran yang terstruktur' }}
                </p>
                
                <!-- Progress Info -->
                <div v-if="roadmapData?.progress" class="mt-6 p-4 mx-auto max-w-md rounded-xl backdrop-blur-sm bg-white/10">
                    <div class="flex justify-between items-center mb-2 text-sm text-white/90">
                        <span>Progress</span>
                        <span>{{ roadmapData.progress.completed_steps }}/{{ roadmapData.progress.total_steps }}</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-white/20">
                        <div 
                            class="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                            :style="{ width: `${roadmapData.progress.progress_percent}%` }"
                        ></div>
                    </div>
                    <p class="mt-1 text-xs text-white/70">{{ roadmapData.progress.progress_percent }}% Complete</p>
                </div>
            </div>
            
            <!-- Timeline Container -->
            <RoadmapTimeline 
                :timeline-items="timelineItems"
                @learn-more="handleLearnMore"
                @start-step="handleStartStep"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import RoadmapTimeline from '~/components/dashboard-student/roadmap/RoadmapTimeline.vue'
import RoadmapPopuup from '~/components/modal/RoadmapPopuup.vue';
import UniversalButton from '~/components/button/UniversalButton.vue';
import type { RoadmapTimelineItem } from '~/types/RoadmapTimeline';

definePageMeta({
    layout: 'dashboard-layout-student-dashboard-layout'
})

const selectedRoadmapItem = ref<RoadmapTimelineItem | null>(null)
const isRoadmapPopupOpen = ref(false)
const roadmapData = ref<any>(null)
const errorMessage = ref<string>('')
const config = useRuntimeConfig()

// Fetch roadmap data using useAsyncData
const { data, pending, error, refresh } = await useAsyncData('my-roadmap', () => 
    $fetch('/student/my-roadmap', {
        method: 'GET',
        credentials: 'include',
        baseURL: config.public.apiBase,
    })
)

// Handle API response
watchEffect(() => {
    if (data.value?.success) {
        if (data.value.data) {
            roadmapData.value = data.value.data
        } else {
            errorMessage.value = data.value.message
        }
    } else if (error.value) {
        errorMessage.value = error.value.message || 'Terjadi kesalahan saat memuat roadmap'
    }
})

// Convert API data to timeline items
const timelineItems = computed(() => {
    if (!roadmapData.value?.steps) return []
    
    return roadmapData.value.steps.map((step: any, index: number) => ({
        title: step.title,
        description: step.description,
        duration: `${step.estimated_duration} hari`,
        icon: getStepIcon(step.difficulty_level),
        isActive: step.status === 'unlocked' || step.status === 'in_progress',
        isCompleted: step.status === 'completed',
        isLocked: step.is_locked,
        learningObjectives: step.learning_objectives ? [step.learning_objectives] : [],
        tasks: [], 
        submissions: [],
        resources: step.resource_links ? JSON.parse(step.resource_links).map((link: string, idx: number) => ({
            id: `res${idx}`,
            title: `Resource ${idx + 1}`,
            type: 'documentation',
            url: link
        })) : [],
        stepData: step
    }))
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
            const response = await $fetch('/student/roadmaps/steps/start', {
                method: 'POST',
                body: { step_id: item.stepData.id },
                baseURL: config.public.apiBase,
                credentials: 'include'
            })
            
            if (response.success) {
                await refresh()
                console.log('Step started successfully')
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