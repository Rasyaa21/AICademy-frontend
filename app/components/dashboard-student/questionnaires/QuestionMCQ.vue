<!-- filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/dashboard-student/questionnaires/QuestionMCQ.vue -->
<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 leading-relaxed">
      {{ question.question_text }}
    </h3>
    
    <div class="space-y-3">
      <div 
        v-for="(option, index) in question.options" 
        :key="option.value"
        class="relative"
      >
        <label 
          :for="`mcq-${questionIndex}-${option.value}`"
          class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          :class="{ 
            'border-primary bg-primary/10': selectedValue === option.value,
            'border-red-300 bg-red-50': hasError && !selectedValue
          }"
        >
          <input
            :id="`mcq-${questionIndex}-${option.value}`"
            v-model="selectedValue"
            :value="option.value"
            type="radio"
            :name="`question-${questionIndex}`"
            class="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary/20 focus:ring-2"
            :aria-invalid="hasError && !selectedValue"
            @change="handleChange"
          />
          <span class="flex-1 text-sm text-gray-700 leading-relaxed">
            {{ option.label }}
          </span>
        </label>
      </div>
    </div>

    <div v-if="hasError && !selectedValue" class="text-red-600 text-sm flex items-center gap-2">
      <Icon name="heroicons:exclamation-circle-20-solid" class="w-4 h-4" />
      <span>Pilih salah satu jawaban untuk melanjutkan</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/Questionnaire'

const props = defineProps<{
  question: Question
  questionIndex: number
  modelValue?: string
  hasError?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedValue = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emit('update:modelValue', value)
})

const handleChange = () => {
  // Emit change event for validation
}
</script>