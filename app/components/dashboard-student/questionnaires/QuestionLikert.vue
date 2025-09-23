<!-- filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/dashboard-student/questionnaires/QuestionLikert.vue -->
<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold text-gray-900 leading-relaxed">
      {{ question.question_text }}
    </h3>
    
    <div class="space-y-4">
      <!-- Scale Labels -->
      <div class="flex justify-between text-sm text-gray-600 px-2">
        <span>Sangat Tidak Setuju</span>
        <span>Sangat Setuju</span>
      </div>
      
      <!-- Likert Scale -->
      <div class="flex justify-between items-center gap-2">
        <div 
          v-for="scale in 5" 
          :key="scale"
          class="flex-1 text-center"
        >
          <label 
            :for="`likert-${questionIndex}-${scale}`"
            class="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <input
              :id="`likert-${questionIndex}-${scale}`"
              v-model="selectedValue"
              :value="scale"
              type="radio"
              :name="`question-${questionIndex}`"
              class="w-6 h-6 text-primary border-gray-300 focus:ring-primary/20 focus:ring-2"
              :aria-invalid="hasError && !selectedValue"
              @change="handleChange"
            />
            <div 
              class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-medium transition-all duration-200 group-hover:border-primary/50"
              :class="{ 
                'border-primary bg-primary text-white': selectedValue == scale,
                'border-red-300 bg-red-50': hasError && !selectedValue
              }"
            >
              {{ scale }}
            </div>
            <span class="text-xs text-gray-500 group-hover:text-primary transition-colors">
              {{ scale === 1 ? 'STS' : scale === 2 ? 'TS' : scale === 3 ? 'N' : scale === 4 ? 'S' : 'SS' }}
            </span>
          </label>
        </div>
      </div>
      
      <!-- Scale Description -->
      <div class="grid grid-cols-5 gap-2 text-xs text-gray-500 text-center">
        <span>Sangat Tidak Setuju</span>
        <span>Tidak Setuju</span>
        <span>Netral</span>
        <span>Setuju</span>
        <span>Sangat Setuju</span>
      </div>
    </div>

    <div v-if="hasError && !selectedValue" class="text-red-600 text-sm flex items-center gap-2">
      <Icon name="heroicons:exclamation-circle-20-solid" class="w-4 h-4" />
      <span>Pilih skala penilaian untuk melanjutkan</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/Questionnaire'

const props = defineProps<{
  question: Question
  questionIndex: number
  modelValue?: number
  hasError?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const selectedValue = computed({
  get: () => props.modelValue || null,
  set: (value: number) => emit('update:modelValue', value)
})

const handleChange = () => {
  // Emit change event for validation
}
</script>