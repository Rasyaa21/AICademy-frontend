<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">Rekomendasi Jalur Karir IT</h2>
      <div class="text-sm text-gray-500">
        {{ displayRecommendations.length }} rekomendasi tersedia
      </div>
    </div>
    
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <div 
        v-for="(recommendation, index) in displayRecommendations" 
        :key="recommendation.role_id"
        class="relative p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 group"
        :class="{ 'ring-2 ring-primary ring-opacity-50': index === 0 }"
      >
        <!-- Best Match Badge -->
        <div 
          v-if="index === 0" 
          class="absolute -top-3 -right-3 px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80"
        >
          Terbaik
        </div>
        
        <!-- Rank -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <div 
              class="flex justify-center items-center w-8 h-8 rounded-full text-sm font-bold"
              :class="getRankClass(index)"
            >
              {{ index + 1 }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {{ recommendation.role_name }}
              </h3>
              <div class="text-xs text-gray-500 capitalize">
                {{ recommendation.category }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Score -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Tingkat Kecocokan</span>
            <span class="text-lg font-bold text-primary">{{ recommendation.score }}%</span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full">
            <div 
              class="h-2 rounded-full transition-all duration-1000 ease-out"
              :class="getScoreBarClass(recommendation.score)"
              :style="{ width: `${recommendation.score}%` }"
            ></div>
          </div>
        </div>
        
        <!-- Description (if available) -->
        <div v-if="recommendation.description" class="mb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-1">Deskripsi:</h4>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ recommendation.description }}
          </p>
        </div>
        
        <!-- Justification -->
        <div class="space-y-2">
          <h4 class="text-sm font-medium text-gray-700">Alasan Rekomendasi:</h4>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ recommendation.justification }}
          </p>
        </div>
        
        <!-- Action Button -->
        <div class="mt-4">
          <button 
            @click="learnMore(recommendation)"
            class="w-full px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg transition-colors hover:bg-primary hover:text-white"
          >
            Pelajari Lebih Lanjut
          </button>
        </div>
      </div>
    </div>
    
    <!-- No Recommendations -->
    <div v-if="displayRecommendations.length === 0" class="text-center py-12">
      <Icon name="heroicons:exclamation-triangle-20-solid" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak Ada Rekomendasi</h3>
      <p class="text-gray-600">Sistem belum dapat memberikan rekomendasi berdasarkan jawaban Anda.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recommendation } from '~/types/Questionnaire'

interface Props {
  recommendations: Recommendation[]
}

const props = defineProps<Props>()

const displayRecommendations = computed(() => {
  // Sort recommendations by score (highest first)
  return [...props.recommendations].sort((a, b) => b.score - a.score)
})

const getRankClass = (index: number): string => {
  switch (index) {
    case 0:
      return 'bg-yellow-500 text-white'
    case 1:
      return 'bg-gray-400 text-white'
    case 2:
      return 'bg-orange-500 text-white'
    default:
      return 'bg-gray-300 text-gray-700'
  }
}

const getScoreBarClass = (score: number): string => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 80) return 'bg-blue-500'
  if (score >= 70) return 'bg-yellow-500'
  if (score >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

const learnMore = (recommendation: Recommendation) => {
  // You can implement navigation to role details page
  console.log('Learn more about:', recommendation.role_name)
  // navigateTo(`/roles/${recommendation.role_id}`)
}
</script>