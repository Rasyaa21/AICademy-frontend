<template>
    <div class="flex flex-col space-y-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="font-bold text-xl">Progress Challenge Saya</h1>
                <p class="text-sm text-gray-500 mt-1">{{ activeChallenges.length }} challenge aktif dari {{ challenges?.length || 0 }} total</p>
            </div>
            <NuxtLink 
                to="/student/dashboard/challenges"
                class="text-primary hover:text-primary/80 text-sm font-medium"
            >
                Lihat Semua
            </NuxtLink>
        </div>

        <!-- Challenge Cards Grid with SMK Telkom Header -->
        <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <NuxtLink
                v-for="challenge in filteredChallenges" 
                :key="challenge.challenge_id"
                :to="`/student/dashboard/challenges/${challenge.challenge_id}`"
                class="group block relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
                <!-- Challenge Image/Header with SMK Telkom Photo -->
                <div class="h-32 relative overflow-hidden">
                    <!-- SMK Telkom Background Image -->
                    <img 
                        src="https://aicademy.galleryne.my.id/assets/smk-telkom.webp"
                        alt="SMK Telkom"
                        class="w-full h-full object-cover object-center"
                    />
                    
                    <!-- Overlay for better text readability -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
                    
                    <!-- Status Badge -->
                    <div class="absolute top-4 right-4">
                        <div v-if="challenge.points >= 80" class="w-8 h-8 bg-yellow-500/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-yellow-300/50">
                            <Icon name="heroicons:star-20-solid" class="w-4 h-4 text-white" />
                        </div>
                        <div v-else-if="challenge.submission_id" class="w-8 h-8 bg-green-500/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-300/50">
                            <Icon name="heroicons:check-20-solid" class="w-4 h-4 text-white" />
                        </div>
                        <div v-else class="w-8 h-8 bg-purple-500/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-300/50">
                            <Icon name="heroicons:trophy-20-solid" class="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <!-- SMK Telkom Branding -->
                    <div class="absolute top-4 left-4">
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                            <span class="text-white text-xs font-medium">SMK Telkom</span>
                        </div>
                    </div>

                    <!-- Challenge Points in Header -->
                    <div class="absolute bottom-4 left-4">
                        <div class="flex items-center gap-2 text-white">
                            <div class="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                                <div class="flex items-center gap-2">
                                    <Icon name="heroicons:star-20-solid" class="w-4 h-4" />
                                    <span class="text-lg font-bold">{{ challenge.points }}</span>
                                    <span class="text-sm">pts</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Team Badge in Header -->
                    <div class="absolute bottom-4 right-4">
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                            <div class="flex items-center gap-1 text-white text-xs">
                                <Icon name="heroicons:user-group-20-solid" class="w-3.5 h-3.5" />
                                <span>Team</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card Content -->
                <div class="p-6">
                    <!-- Challenge Info Header -->
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {{ challenge.team_name || 'Individual' }}
                        </span>
                        <div class="flex items-center text-xs text-gray-500">
                            <Icon name="heroicons:building-office-2-20-solid" class="w-3.5 h-3.5 mr-1" />
                            SMK Telkom Challenge
                        </div>
                    </div>

                    <!-- Challenge Title -->
                    <h3 class="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {{ challenge.challenge_title }}
                    </h3>

                    <!-- Challenge Description/Progress -->
                    <div class="mb-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium text-gray-700">Progress</span>
                            <span 
                                :class="[
                                    'text-xs px-2 py-1 rounded-full font-medium',
                                    challenge.submission_id ? 'bg-green-100 text-green-700' :
                                    challenge.is_active ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                ]"
                            >
                                {{ challenge.submission_id ? 'Submitted' : challenge.is_active ? 'In Progress' : 'Not Started' }}
                            </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                :class="[
                                    'h-2 rounded-full transition-all duration-300',
                                    challenge.submission_id ? 'bg-green-600' : 
                                    challenge.is_active ? 'bg-yellow-600' : 'bg-gray-400'
                                ]"
                                :style="{ 
                                    width: challenge.submission_id ? '100%' : 
                                           challenge.is_active ? '50%' : '25%' 
                                }"
                            ></div>
                        </div>
                    </div>

                    <!-- Points Prize Section (if high points) -->
                    <div v-if="challenge.points >= 80" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div class="flex items-center gap-2">
                            <Icon name="heroicons:gift-20-solid" class="w-4 h-4 text-yellow-600" />
                            <span class="text-xs font-medium text-yellow-800">High Value Challenge</span>
                        </div>
                        <p class="text-sm font-semibold text-yellow-900 mt-1">{{ challenge.points }} Points Reward</p>
                    </div>


                    <!-- Challenge Footer Info -->
                    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                            <p class="text-xs text-gray-500">Status</p>
                            <p class="text-sm font-medium" 
                               :class="challenge.is_active ? 'text-green-600' : 'text-gray-600'">
                                {{ challenge.is_active ? 'Active' : 'Inactive' }}
                            </p>
                        </div>
                        
                        <!-- Deadline (if available and valid) -->
                        <div v-if="isValidDate(challenge.deadline)">
                            <p class="text-xs text-gray-500">Deadline</p>
                            <p class="text-sm font-medium text-gray-900">{{ formatDate(challenge.deadline) }}</p>
                        </div>
                        
                        <!-- Submission Status -->
                        <span
                            :class="[
                                'px-3 py-1 rounded-full text-xs font-medium',
                                challenge.submission_id ? 'bg-green-100 text-green-700' : 
                                challenge.is_active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                            ]"
                        >
                            {{ challenge.submission_id ? 'Done' : challenge.is_active ? 'Join' : 'View' }}
                        </span>
                    </div>
                </div>
            </NuxtLink>
        </div>

        <!-- Empty State -->
        <div v-if="filteredChallenges.length === 0" class="text-center py-8">
            <div class="text-gray-400 mb-2">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
                </svg>
            </div>
            <p class="text-gray-500 font-medium">Tidak ada challenge yang tersedia</p>
            <p class="text-gray-400 text-sm mt-1">Challenge baru akan segera hadir dari SMK Telkom</p>
        </div>
    </div>
</template>

<script setup lang="ts">
// Script remains the same as previous version
// filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/dashboard-student/index/MyChallengeProgress.vue
import { ref, computed } from 'vue'

interface Props {
    challenges: any[]
    summary: any
}

const props = defineProps<Props>()

// Filter state
const selectedStatus = ref("")
const selectedPointsRange = ref("")

// Methods
const clearFilters = () => {
    selectedStatus.value = ""
    selectedPointsRange.value = ""
}

// Get active challenges
const activeChallenges = computed(() => {
    return props.challenges?.filter(challenge => challenge.is_active) || []
})

// Filtered challenges
const filteredChallenges = computed(() => {
    let filtered = props.challenges || []

    // Filter by status
    if (selectedStatus.value) {
        if (selectedStatus.value === 'active') {
            filtered = filtered.filter(c => c.is_active)
        } else if (selectedStatus.value === 'submitted') {
            filtered = filtered.filter(c => c.submission_id)
        } else if (selectedStatus.value === 'inactive') {
            filtered = filtered.filter(c => !c.is_active)
        }
    }

    // Filter by points range
    if (selectedPointsRange.value) {
        if (selectedPointsRange.value === 'high') {
            filtered = filtered.filter(c => c.points >= 80)
        } else if (selectedPointsRange.value === 'medium') {
            filtered = filtered.filter(c => c.points >= 50 && c.points < 80)
        } else if (selectedPointsRange.value === 'low') {
            filtered = filtered.filter(c => c.points < 50)
        }
    }

    return filtered
})

// Utility functions
const isValidDate = (dateString: string) => {
    if (!dateString || dateString === '0001-01-01T00:00:00Z') return false
    const date = new Date(dateString)
    return !isNaN(date.getTime()) && date.getFullYear() > 1900
}

const formatDate = (dateString: string) => {
    if (!isValidDate(dateString)) return ''
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    } catch {
        return ''
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

/* Line clamp for challenge title */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>