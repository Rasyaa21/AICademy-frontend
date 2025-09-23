<!-- filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/dashboard-student/questionnaires/QuestionText.vue -->
<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 leading-relaxed">
      {{ question.question_text }}
    </h3>
    
    <div class="space-y-2">
      <label 
        :for="`text-${questionIndex}`"
        class="block text-sm font-medium text-gray-700"
      >
        Jawaban Anda <span class="text-red-500">*</span>
      </label>
      <textarea
        :id="`text-${questionIndex}`"
        v-model="textValue"
        rows="8"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all duration-200"
        :class="{ 
          'border-red-300 bg-red-50': hasError && !textValue?.trim()
        }"
        placeholder="Ceritakan pengalaman atau ide Anda secara detail..."
        :aria-invalid="hasError && !textValue?.trim()"
        @input="handleChange"
      />
      <div class="flex justify-between text-xs text-gray-500">
        <span>Minimum 100 karakter untuk jawaban yang berkualitas</span>
        <span>{{ (textValue || '').length }} karakter</span>
      </div>
    </div>

    <div v-if="hasError && !textValue?.trim()" class="text-red-600 text-sm flex items-center gap-2">
      <Icon name="heroicons:exclamation-circle-20-solid" class="w-4 h-4" />
      <span>Jawaban tidak boleh kosong</span>
    </div>
    
    <div v-else-if="hasError && textValue && textValue.length < 100" class="text-red-600 text-sm flex items-center gap-2">
      <Icon name="heroicons:exclamation-circle-20-solid" class="w-4 h-4" />
      <span>Jawaban minimal 100 karakter untuk hasil yang akurat</span>
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

const textValue = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emit('update:modelValue', value)
})

const handleChange = () => {
  // Emit change event for validation
}
</script>