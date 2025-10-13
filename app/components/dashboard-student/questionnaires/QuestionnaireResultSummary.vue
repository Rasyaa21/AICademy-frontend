<template>
  <div class="space-y-6">
    <!-- Compact Main Result Card -->
    <div class="relative overflow-hidden p-6 bg-gradient-to-r from-primary to-primary/80 rounded-2xl text-white shadow-lg">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-4 right-4 w-32 h-32 bg-white rounded-full transform rotate-12"></div>
        <div class="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full transform -rotate-12"></div>
      </div>
      
      <div class="relative z-10">
        <div class="flex flex-col md:flex-row md:items-center gap-6">
          <!-- Left: Role Info -->
          <div class="flex-1 space-y-3">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Icon name="heroicons:sparkles-20-solid" class="w-6 h-6 text-white" />
              </div>
              <div>
                <div class="text-sm text-white/80 font-medium">Rekomendasi Terbaik</div>
                <h2 class="text-2xl md:text-3xl font-bold text-white">
                  {{ mainRecommendedRole.role_name }}
                </h2>
              </div>
            </div>
            
            <!-- Description - Compact -->
            <p class="text-white/90 leading-relaxed line-clamp-2">
              {{ mainRecommendedRole.description }}
            </p>
          </div>
          
          <!-- Right: Score & Action -->
          <div class="flex flex-col items-center gap-4 md:min-w-[200px]">
            <!-- Score Circle -->
            <div class="relative">
              <div class="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                <div class="text-center">
                  <div class="text-2xl font-bold text-white">{{ mainRecommendedRole.score }}%</div>
                  <div class="text-xs text-white/80">Match</div>
                </div>
              </div>
              <!-- Animated ring -->
              <div 
                class="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"
                style="animation-duration: 3s;"
              ></div>
            </div>
            
            <!-- CTA Button -->
            <button
              @click="startLearning"
              class="px-6 py-3 bg-white text-primary rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <Icon name="heroicons:academic-cap-20-solid" class="w-5 h-5" />
              Mulai Belajar
              <Icon name="heroicons:arrow-right-20-solid" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    

    
    <!-- Compact Justification with Expandable -->
    <div class="p-5 bg-white rounded-xl border shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Icon name="heroicons:light-bulb-20-solid" class="w-5 h-5 text-yellow-500" />
            Mengapa {{ mainRecommendedRole.role_name }}?
          </h3>
          <p 
            class="text-gray-700 leading-relaxed transition-all duration-300"
            :class="{ 'line-clamp-3': !isExpanded }"
          >
            {{ mainRecommendedRole.justification }}
          </p>
          
          <!-- Expand/Collapse Button -->
          <button 
            v-if="mainRecommendedRole.justification.length > 150"
            @click="isExpanded = !isExpanded"
            class="mt-2 text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            {{ isExpanded ? 'Lihat Lebih Sedikit' : 'Lihat Selengkapnya' }}
            <Icon 
              :name="isExpanded ? 'heroicons:chevron-up-20-solid' : 'heroicons:chevron-down-20-solid'" 
              class="w-4 h-4" 
            />
          </button>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuestionnaireResult } from '~/types/Questionnaire'

interface Props {
  result: QuestionnaireResult
}

const props = defineProps<Props>()
const isExpanded = ref(false)

const mainRecommendedRole = computed(() => {
  // Get the highest scoring recommendation or fallback to recommended_role
  if (props.result.recommendations?.length) {
    return props.result.recommendations.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    )
  }
  return props.result.recommended_role
})

const recommendationsCount = computed(() => {
  return props.result.recommendations?.length || 1 // At least recommended_role
})

const confidenceLevel = computed(() => {
  const score = mainRecommendedRole.value.score
  if (score >= 90) return 'Sangat Tinggi'
  if (score >= 80) return 'Tinggi'
  if (score >= 70) return 'Sedang'
  if (score >= 60) return 'Cukup'
  return 'Rendah'
})

const startLearning = () => {
  navigateTo('/student/dashboard/roadmap')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>