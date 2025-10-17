<template>
    <div class="flex flex-col space-y-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="font-bold text-xl">Progress Roadmap Saya</h1>
                <p class="text-sm text-gray-500 mt-1">
                    {{ roadmap ? '1 roadmap aktif' : 'Belum ada roadmap aktif' }}
                </p>
            </div>
            <NuxtLink 
                to="/student/dashboard/roadmap"
                class="text-primary hover:text-primary/80 text-sm font-medium"
            >
                Lihat Semua
            </NuxtLink>
        </div>

        <!-- Filter Section -->
        <div class="flex items-center gap-3 mb-2">
            <div class="relative">
                <select
                    v-model="selectedDifficulty"
                    class="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 cursor-pointer shadow-sm"
                >
                    <option value="" class="text-gray-600">Semua Level</option>
                    <option value="beginner">🟢 Beginner</option>
                    <option value="intermediate">🟡 Intermediate</option>
                    <option value="advanced">🔴 Advanced</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>

            <div class="relative">
                <select
                    v-model="selectedStatus"
                    class="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 cursor-pointer shadow-sm"
                >
                    <option value="" class="text-gray-600">Semua Status</option>
                    <option value="completed">✅ Completed</option>
                    <option value="in_progress">⏳ In Progress</option>
                    <option value="locked">🔒 Locked</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>

            <button 
                v-if="selectedDifficulty || selectedStatus" 
                @click="clearFilters" 
                class="px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-1"
            >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Clear
            </button>
        </div>
        
        <!-- Timeline-style Cards Grid - Limit to 3 cards total (1 roadmap + 2 top steps) -->
        <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <!-- Current Roadmap Card with Timeline Style -->
            <div v-if="roadmap" 
                 class="group relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
                
                <!-- Status Badge -->
                <div class="absolute top-4 right-4">
                    <div class="w-8 h-8 bg-blue-500/90 rounded-full flex items-center justify-center">
                        <Icon name="heroicons:map-20-solid" class="w-4 h-4 text-white" />
                    </div>
                </div>

                <!-- Locked Overlay (if needed) -->
                <div v-if="roadmap.progress?.progress_percent === 0" 
                     class="absolute inset-0 bg-gray-50/70 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10">
                    <div class="text-center">
                        <Icon name="heroicons:play-circle-20-solid" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm text-gray-500 font-medium">Mulai roadmap pertama</p>
                    </div>
                </div>

                <!-- Card Content with Timeline style -->
                <div class="flex flex-col sm:flex-row items-start gap-4">
                    <!-- Icon -->
                    <div class="flex-shrink-0 self-center sm:self-start">
                        <div class="w-14 h-14 rounded-lg p-3 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600">
                            <Icon name="heroicons:map-20-solid" class="w-full h-full text-white" />
                        </div>
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-1 text-center sm:text-left">
                        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                            <h3 class="font-semibold text-gray-900 text-lg leading-tight mb-2 sm:mb-0 group-hover:text-primary transition-colors">
                                {{ roadmap.roadmap_name }}
                            </h3>
                            <span class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-center sm:self-start sm:ml-2 bg-blue-100 text-blue-700 border border-blue-200">
                                Active
                            </span>
                        </div>
                        
                        <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                            {{ roadmap.description }}
                        </p>
                        
                        <!-- Progress Section -->
                        <div class="mb-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm font-medium text-gray-700">Progress</span>
                                <span class="text-sm font-bold text-blue-600">{{ Math.round(roadmap.progress?.progress_percent || 0) }}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="h-2 bg-primary rounded-full transition-all duration-300"
                                     :style="{ width: `${roadmap.progress?.progress_percent || 0}%` }"></div>
                            </div>
                        </div>
                        
                        <!-- Bottom section with Timeline style -->
                        <div class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                            <div class="flex items-center justify-center sm:justify-start gap-2">
                                <Icon name="heroicons:clock-20-solid" class="w-4 h-4 text-primary" />
                                <span class="font-medium text-sm text-primary">
                                    {{ summary?.completed_steps || 0 }}/{{ summary?.total_steps || 0 }} Steps
                                </span>
                            </div>
                            
                            <!-- Action Button -->
                            <button class="font-medium text-sm transition-colors duration-200 flex items-center gap-1 px-4 py-2 rounded-lg text-white bg-primary border border-primary hover:bg-primary/90">
                                <span>Continue Learning</span>
                                <Icon name="heroicons:arrow-right-20-solid" class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top 2 Priority Steps Cards with Timeline Style -->
            <div v-for="step in topPrioritySteps" 
                 :key="step.id"
                 class="group relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
                 :class="step.is_locked ? 'opacity-60 bg-gray-50' : ''">
                
                <!-- Priority Badge -->
                <div class="absolute top-4 right-4">
                    <div v-if="step.status === 'completed'" class="w-8 h-8 bg-green-500/90 rounded-full flex items-center justify-center">
                        <Icon name="heroicons:check-20-solid" class="w-4 h-4 text-white" />
                    </div>
                    <div v-else-if="step.is_locked" class="w-8 h-8 bg-gray-400/90 rounded-full flex items-center justify-center">
                        <Icon name="heroicons:lock-closed-20-solid" class="w-4 h-4 text-white" />
                    </div>
                    <div v-else-if="step.step_order === 1" class="w-8 h-8 bg-yellow-500/90 rounded-full flex items-center justify-center">
                        <Icon name="heroicons:star-20-solid" class="w-4 h-4 text-white" />
                    </div>
                    <div v-else class="w-8 h-8 bg-primary/90 rounded-full flex items-center justify-center">
                        <span class="text-white font-bold text-xs">{{ step.step_order }}</span>
                    </div>
                </div>

                <!-- High Priority Label -->
                <div v-if="step.step_order <= 2" class="absolute top-4 left-4 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Priority #{{ step.step_order }}
                </div>

                <!-- Locked Overlay -->
                <div v-if="step.is_locked" 
                     class="absolute inset-0 bg-gray-50/70 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10">
                    <div class="text-center">
                        <Icon name="heroicons:lock-closed-20-solid" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm text-gray-500 font-medium">Selesaikan step sebelumnya</p>
                    </div>
                </div>

                <!-- Card Content -->
                <div class="flex flex-col sm:flex-row items-start gap-4 mt-8">
                    <!-- Icon -->
                    <div class="flex-shrink-0 self-center sm:self-start">
                        <div class="w-14 h-14 rounded-lg p-3 shadow-sm"
                             :class="getStepIconClass(step)">
                            <Icon name="heroicons:book-open-20-solid" class="w-full h-full" 
                                  :class="step.is_locked ? 'text-gray-400' : 'text-white'" />
                        </div>
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-1 text-center sm:text-left">
                        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                            <h3 class="font-semibold text-base leading-tight mb-2 sm:mb-0 group-hover:text-primary transition-colors"
                                :class="step.is_locked ? 'text-gray-500' : 'text-gray-900'">
                                {{ step.title }}
                            </h3>
                            <span class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-center sm:self-start sm:ml-2"
                                  :class="getStepStatusBadgeClass(step)">
                                {{ getStepStatusText(step) }}
                            </span>
                        </div>
                        
                        <p class="text-sm mb-4 leading-relaxed"
                           :class="step.is_locked ? 'text-gray-400' : 'text-gray-600'">
                            {{ step.description }}
                        </p>
                        
                        <!-- Bottom section -->
                        <div class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                            <div class="flex items-center justify-center sm:justify-start gap-2">
                                <Icon name="heroicons:clock-20-solid" class="w-4 h-4" 
                                      :class="step.is_locked ? 'text-gray-400' : 'text-primary'" />
                                <span class="font-medium text-sm"
                                      :class="step.is_locked ? 'text-gray-400' : 'text-primary'">
                                    {{ step.estimated_duration }}h
                                </span>
                            </div>
                            
                            <div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                                <!-- Progress indicator -->
                                <div class="flex items-center gap-2" v-if="!step.is_locked">
                                    <span class="text-xs text-gray-500">Progress</span>
                                    <div class="w-8 h-1 bg-gray-200 rounded-full">
                                        <div class="h-full bg-primary rounded-full transition-all duration-300"
                                             :style="{ width: `${getStepProgress(step)}%` }"></div>
                                    </div>
                                </div>

                                <!-- Action Button -->
                                <button :disabled="step.is_locked"
                                        class="font-medium text-sm transition-colors duration-200 flex items-center gap-1 px-4 py-2 rounded-lg"
                                        :class="getStepActionButtonClass(step)">
                                    <span>{{ getStepActionText(step) }}</span>
                                    <Icon :name="getStepActionIcon(step)" class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="!roadmap && topPrioritySteps.length === 0" class="text-center py-8">
            <div class="text-gray-400 mb-2">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
            </div>
            <p class="text-gray-500 font-medium">Tidak ada roadmap yang sesuai dengan filter</p>
            <p class="text-gray-400 text-sm mt-1">Coba ubah filter untuk melihat roadmap lainnya</p>
        </div>
    </div>
</template>

<script setup lang="ts">
// filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/dashboard-student/index/MyRoadmapProgress.vue
import { ref, computed } from 'vue'

interface Props {
    roadmap: any
    summary: any
}

const props = defineProps<Props>()

// Filter state
const selectedDifficulty = ref("")
const selectedStatus = ref("")

// Methods
const clearFilters = () => {
    selectedDifficulty.value = ""
    selectedStatus.value = ""
}

// Get next available steps
const nextSteps = computed(() => {
    if (!props.roadmap?.steps) return []
    
    return props.roadmap.steps
        .sort((a: any, b: any) => a.step_order - b.step_order)
})

// Get top 2 priority steps (by order and status priority)
const topPrioritySteps = computed(() => {
    let filtered = nextSteps.value

    // Filter by difficulty
    if (selectedDifficulty.value) {
        filtered = filtered.filter((step: any) => step.difficulty_level === selectedDifficulty.value)
    }

    // Filter by status
    if (selectedStatus.value) {
        filtered = filtered.filter((step: any) => step.status === selectedStatus.value)
    }

    // Sort by priority: in_progress > available > locked, then by step_order
    const sortedSteps = filtered.sort((a: any, b: any) => {
        // Priority scoring: in_progress = 3, available = 2, locked = 1
        const getPriority = (step: any) => {
            if (step.status === 'in_progress') return 3
            if (step.can_start && !step.is_locked) return 2
            return 1
        }
        
        const priorityDiff = getPriority(b) - getPriority(a)
        if (priorityDiff !== 0) return priorityDiff
        
        // If same priority, sort by step order
        return a.step_order - b.step_order
    })

    // Return top 2
    return sortedSteps.slice(0, 2)
})

// Step styling methods (similar to TimelineCard)
const getStepIconClass = (step: any) => {
    if (step.is_locked) {
        return 'bg-gray-400'
    } else if (step.status === 'completed') {
        return 'bg-gradient-to-br from-green-500 to-green-600'
    } else if (step.step_order === 1) {
        return 'bg-gradient-to-br from-yellow-500 to-yellow-600'
    } else {
        return 'bg-gradient-to-br from-primary to-primary/80'
    }
}

const getStepStatusBadgeClass = (step: any) => {
    if (step.status === 'completed') {
        return 'bg-green-100 text-green-700 border border-green-200'
    } else if (step.status === 'in_progress') {
        return 'bg-primary/10 text-primary border border-primary/20'
    } else if (step.is_locked) {
        return 'bg-gray-100 text-gray-500 border border-gray-200'
    }
    return 'bg-blue-100 text-blue-700 border border-blue-200'
}

const getStepStatusText = (step: any) => {
    if (step.status === 'completed') return 'Selesai'
    if (step.status === 'in_progress') return 'Aktif'
    if (step.is_locked) return 'Terkunci'
    return 'Tersedia'
}

const getStepProgress = (step: any) => {
    if (step.status === 'completed') return 100
    if (step.started_at && !step.completed_at) return 50
    return 0
}

const getStepActionText = (step: any) => {
    if (step.is_locked) return 'Terkunci'
    if (step.status === 'completed') return 'Lihat Detail'
    if (step.started_at) return 'Lanjutkan'
    if (step.can_start) return 'Mulai'
    return 'Lihat Detail'
}

const getStepActionIcon = (step: any) => {
    if (step.is_locked) return 'heroicons:lock-closed-20-solid'
    if (step.status === 'completed') return 'heroicons:eye-20-solid'
    if (step.started_at) return 'heroicons:play-20-solid'
    if (step.can_start) return 'heroicons:rocket-launch-20-solid'
    return 'heroicons:arrow-right-20-solid'
}

const getStepActionButtonClass = (step: any) => {
    if (step.is_locked) {
        return 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
    } else if (step.status === 'completed') {
        return 'text-green-600 bg-green-50 border border-green-200 hover:bg-green-100'
    } else if (step.can_start) {
        return 'text-white bg-primary border border-primary hover:bg-primary/90'
    } else {
        return 'text-primary bg-primary/5 border border-primary/20 hover:bg-primary/10'
    }
}
</script>

<style scoped>
/* Custom select styling */
select::-ms-expand {
    display: none;
}

select option {
    @apply py-2 px-3;
}

select:hover {
    @apply shadow-md;
}

select:focus {
    @apply shadow-lg;
}
</style>