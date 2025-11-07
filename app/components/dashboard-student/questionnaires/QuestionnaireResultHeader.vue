<template>
  <div class="relative overflow-hidden p-8 bg-gradient-to-r from-primary to-primary/80 rounded-2xl text-white shadow-lg">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-4 right-4 w-32 h-32 bg-white rounded-full transform rotate-12"></div>
      <div class="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full transform -rotate-12"></div>
    </div>
    
    <div class="relative z-10 text-center space-y-6">
      <div class="inline-flex justify-center items-center mb-4 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm">
        <Icon name="heroicons:academic-cap-20-solid" class="w-10 h-10 text-white" />
      </div>
      
      <div class="space-y-3">
        <h1 class="text-3xl font-bold text-white">
          Hasil Analisis Kuesioner Peminatan IT
        </h1>
        <p class="mx-auto max-w-2xl text-lg text-white/90">
          Berdasarkan jawaban Anda, sistem AI telah menganalisis dan memberikan rekomendasi jalur karir IT yang paling sesuai dengan kepribadian dan minat Anda.
        </p>
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

const formattedDate = computed(() => {
  return new Date(props.result.submitted_at).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>