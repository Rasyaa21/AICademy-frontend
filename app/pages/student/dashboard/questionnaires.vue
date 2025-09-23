<template>
  <div class="mx-auto space-y-8 max-w-4xl">
    <!-- Header -->
    <div class="space-y-4 text-center">
      <div class="inline-flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-primary/10">
        <Icon name="heroicons:clipboard-document-list-20-solid" class="w-8 h-8 text-primary" />
      </div>
      <h1 class="text-3xl font-bold text-gray-900">Kuesioner Peminatan Karir IT</h1>
      <p class="mx-auto max-w-2xl text-lg text-gray-600">
        Jawab {{ totalQuestions }} pertanyaan berikut untuk mengetahui jalur karir IT yang paling sesuai dengan kepribadian dan minat Anda
      </p>
    </div>

    <!-- Draft Notice -->
    <div v-if="hasDraft && !isDraftLoaded" class="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
      <div class="flex gap-3 items-start">
        <Icon name="heroicons:exclamation-triangle-20-solid" class="mt-0.5 w-5 h-5 text-yellow-600" />
        <div class="flex-1">
          <h3 class="font-medium text-yellow-800">Draft Tersimpan</h3>
          <p class="mt-1 text-sm text-yellow-700">
            Kami menemukan jawaban yang belum selesai. Ingin melanjutkan dari terakhir kali?
          </p>
          <div class="flex gap-3 mt-3">
            <button 
              @click="loadDraft"
              class="px-3 py-1 text-sm text-yellow-800 bg-yellow-100 rounded-lg transition-colors hover:bg-yellow-200"
            >
              Lanjutkan Draft
            </button>
            <button 
              @click="startFresh"
              class="text-sm text-yellow-700 hover:text-yellow-800"
            >
              Mulai Dari Awal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Section -->
    <div class="p-6 bg-white rounded-xl border shadow-sm">
      <!-- Step Indicators with Full Line -->
      <div class="flex relative justify-between items-center mb-6">
        <!-- Background Line -->
        <div class="absolute right-0 left-0 top-1/2 h-1 bg-gray-200 rounded-full -translate-y-1/2"></div>
        <!-- Progress Line -->
        <div 
          class="absolute left-0 top-1/2 h-1 rounded-full transition-all duration-500 ease-out -translate-y-1/2 bg-primary"
          :style="{ width: `${stepProgress}%` }"
        ></div>
        
        <!-- Step Circles -->
        <div 
          v-for="step in totalSteps" 
          :key="step"
          class="relative z-10"
        >
          <div 
            class="flex justify-center items-center w-10 h-10 text-sm font-bold rounded-full border-2 transition-all duration-300"
            :class="getStepClass(step)"
          >
            <Icon 
              v-if="step < currentStep" 
              name="heroicons:check-20-solid" 
              class="w-5 h-5 text-white" 
            />
            <span v-else>{{ step }}</span>
          </div>
          <!-- Step Label -->
          <div class="absolute -bottom-8 left-1/2 text-xs font-medium text-gray-600 whitespace-nowrap transform -translate-x-1/2">
            Step {{ step }}
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mt-12 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Progress Keseluruhan</span>
          <span class="font-medium text-primary">{{ Math.round(overallProgress) }}% selesai</span>
        </div>
        <div class="w-full h-3 bg-gray-200 rounded-full">
          <div 
            class="h-3 bg-gradient-to-r rounded-full shadow-sm transition-all duration-500 ease-out from-primary to-primary/80"
            :style="{ width: `${overallProgress}%` }"
          ></div>
        </div>
        <div class="text-xs text-center text-gray-500">
          {{ answeredQuestions }} dari {{ totalQuestions }} pertanyaan dijawab
        </div>
      </div>
    </div>

    <!-- Question Card -->
    <div v-if="currentQuestion" class="p-8 bg-white rounded-xl border shadow-sm" id="question-card">
      <div class="space-y-6">
        <!-- Question Header -->
        <div class="flex justify-between items-center pb-4 border-b border-gray-100">
          <div class="space-y-1">
            <div class="flex gap-2 items-center text-sm text-gray-500">
              <Icon name="heroicons:chat-bubble-left-ellipsis-20-solid" class="w-4 h-4" />
              <span>Pertanyaan {{ currentQuestionNumber }} dari {{ totalQuestions }}</span>
            </div>
            <div class="text-xs text-gray-400 capitalize">
              Kategori: {{ currentQuestion.category }} • 
              Tipe: {{ getQuestionTypeLabel(currentQuestion.question_type) }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium text-gray-900">Step {{ currentStep }}</div>
            <div class="text-xs text-gray-500">{{ questionsPerStep }} pertanyaan</div>
          </div>
        </div>

        <!-- Question Component -->
        <div class="min-h-[400px]">
          <QuestionMCQ
            v-if="currentQuestion.question_type === 'mcq'"
            v-model="currentMCQAnswer"
            :question="currentQuestion"
            :question-index="currentQuestionIndex"
            :has-error="validationErrors[currentQuestionIndex] || false"
          />
          
          <QuestionLikert
            v-else-if="currentQuestion.question_type === 'likert'"
            v-model="currentLikertAnswer"
            :question="currentQuestion"
            :question-index="currentQuestionIndex"
            :has-error="validationErrors[currentQuestionIndex] || false"
          />
          
          <QuestionCase
            v-else-if="currentQuestion.question_type === 'case'"
            v-model="currentTextAnswer"
            :question="currentQuestion"
            :question-index="currentQuestionIndex"
            :has-error="validationErrors[currentQuestionIndex] || false"
          />
          
          <QuestionText
            v-else-if="currentQuestion.question_type === 'text'"
            v-model="currentTextAnswer"
            :question="currentQuestion"
            :question-index="currentQuestionIndex"
            :has-error="validationErrors[currentQuestionIndex] || false"
          />
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex flex-col gap-4 justify-between items-center p-6 bg-white rounded-xl border shadow-sm sm:flex-row">
      <!-- Left Side - Previous Button -->
      <button
        v-if="currentQuestionIndex > 0"
        @click="previousQuestion"
        class="flex gap-2 justify-center items-center px-6 py-3 w-full text-gray-700 rounded-lg border border-gray-300 transition-colors sm:w-auto hover:bg-gray-50"
      >
        <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4" />
        Sebelumnya
      </button>
      <div v-else class="w-full sm:w-auto"></div>

      <!-- Center - Save Draft -->
      <button
        @click="saveDraft"
        :disabled="!hasAnyAnswer"
        class="flex gap-2 justify-center items-center px-4 py-2 w-full text-gray-600 transition-colors sm:w-auto hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ 'text-green-600': draftSaved }"
      >
        <Icon :name="draftSaved ? 'heroicons:check-circle-20-solid' : 'heroicons:bookmark-20-solid'" class="w-4 h-4" />
        {{ draftSaved ? 'Draft Tersimpan' : 'Simpan Draft' }}
      </button>

      <!-- Right Side - Next/Submit Button -->
      <button
        @click="nextQuestion"
        :disabled="!canProceed"
        class="flex gap-2 justify-center items-center px-6 py-3 w-full text-white rounded-lg transition-colors sm:w-auto bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{{ isLastQuestion ? 'Kirim Jawaban' : 'Berikutnya' }}</span>
        <Icon 
          :name="isLastQuestion ? 'heroicons:paper-airplane-20-solid' : 'heroicons:arrow-right-20-solid'" 
          class="w-4 h-4" 
        />
      </button>
    </div>

    <!-- Question Summary -->
    <div v-if="isLastQuestion && answeredQuestions === totalQuestions" class="p-6 bg-green-50 rounded-xl border border-green-200">
      <div class="flex gap-3 items-start">
        <Icon name="heroicons:check-circle-20-solid" class="mt-0.5 w-6 h-6 text-green-600" />
        <div>
          <h3 class="mb-2 font-medium text-green-800">Semua Pertanyaan Telah Dijawab!</h3>
          <p class="mb-4 text-sm text-green-700">
            Terima kasih telah melengkapi kuesioner. Klik "Kirim Jawaban" untuk melihat hasil analisis peminatan karir IT Anda.
          </p>
          <div class="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div class="text-center">
              <div class="font-medium text-green-800">{{ answeredByType.mcq }}</div>
              <div class="text-green-600">Pilihan Ganda</div>
            </div>
            <div class="text-center">
              <div class="font-medium text-green-800">{{ answeredByType.likert }}</div>
              <div class="text-green-600">Skala Likert</div>
            </div>
            <div class="text-center">
              <div class="font-medium text-green-800">{{ answeredByType.case }}</div>
              <div class="text-green-600">Studi Kasus</div>
            </div>
            <div class="text-center">
              <div class="font-medium text-green-800">{{ answeredByType.text }}</div>
              <div class="text-green-600">Uraian</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Question, Answer, QuestionnaireState, QuestionnaireData } from '~/types/Questionnaire'
import QuestionLikert from '~/components/dashboard-student/questionnaires/QuestionLikert.vue'
import QuestionCase from '~/components/dashboard-student/questionnaires/QuestionCase.vue'
import QuestionText from '~/components/dashboard-student/questionnaires/QuestionText.vue'
import QuestionMCQ from '~/components/dashboard-student/questionnaires/QuestionMCQ.vue'

definePageMeta({
  layout: 'dashboard-layout-student-dashboard-layout'
})

// State
const questions = ref<Question[]>([])
const isLoading = ref(true)
const currentQuestionIndex = ref(0)
const answers = ref<Answer[]>([])
const validationErrors = ref<Record<number, boolean>>({})
const draftSaved = ref(false)
const hasDraft = ref(false)
const isDraftLoaded = ref(false)

// Load questions from JSON
const loadQuestions = async () => {
  try {
    const questionnaireData = await $fetch<QuestionnaireData>('/assets/json/question.json')
    questions.value = questionnaireData.questions || []
    isLoading.value = false
  } catch (error) {
    console.error('Error loading questions:', error)
    isLoading.value = false
  }
}

// Constants
const totalQuestions = computed(() => questions.value.length)
const questionsPerStep = 4
const totalSteps = computed(() => Math.ceil(totalQuestions.value / questionsPerStep))

// Computed properties
const currentStep = computed(() => Math.floor(currentQuestionIndex.value / questionsPerStep) + 1)
const currentQuestionNumber = computed(() => currentQuestionIndex.value + 1)
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || null)
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)

// Step progress for the line animation
const stepProgress = computed(() => {
  if (totalSteps.value <= 1) return 100
  return ((currentStep.value - 1) / (totalSteps.value - 1)) * 100
})

// Separate computed for each question type to handle type safety
const currentMCQAnswer = computed({
  get: (): string | undefined => {
    const answer = answers.value.find(a => a.questionIndex === currentQuestionIndex.value)
    return typeof answer?.value === 'string' ? answer.value : undefined
  },
  set: (value: string | undefined) => {
    if (value !== undefined) {
      updateAnswer(value)
    }
  }
})

const currentLikertAnswer = computed({
  get: (): number | undefined => {
    const answer = answers.value.find(a => a.questionIndex === currentQuestionIndex.value)
    return typeof answer?.value === 'number' ? answer.value : undefined
  },
  set: (value: number | undefined) => {
    if (value !== undefined) {
      updateAnswer(value)
    }
  }
})

const currentTextAnswer = computed({
  get: (): string | undefined => {
    const answer = answers.value.find(a => a.questionIndex === currentQuestionIndex.value)
    return typeof answer?.value === 'string' ? answer.value : undefined
  },
  set: (value: string | undefined) => {
    if (value !== undefined) {
      updateAnswer(value)
    }
  }
})

const answeredQuestions = computed(() => answers.value.length)
const overallProgress = computed(() => {
  if (totalQuestions.value === 0) return 0
  return (answeredQuestions.value / totalQuestions.value) * 100
})

const answeredByType = computed(() => {
  const types = { mcq: 0, likert: 0, case: 0, text: 0 }
  answers.value.forEach(answer => {
    const questionType = answer.questionType as keyof typeof types
    if (types.hasOwnProperty(questionType)) {
      types[questionType]++
    }
  })
  return types
})

const hasAnyAnswer = computed(() => answers.value.length > 0)

const canProceed = computed(() => {
  const question = currentQuestion.value
  if (!question) return false
  
  const answer = answers.value.find(a => a.questionIndex === currentQuestionIndex.value)
  if (!answer?.value) return false
  
  if (question.question_type === 'case' || question.question_type === 'text') {
    const value = answer.value as string
    const minLength = question.question_type === 'case' ? 50 : 100
    return value.toString().trim().length >= minLength
  }
  
  return true
})

// Methods
const updateAnswer = (value: string | number) => {
  const question = currentQuestion.value
  if (!question) return
  
  const existingIndex = answers.value.findIndex(a => a.questionIndex === currentQuestionIndex.value)
  const answer: Answer = {
    questionIndex: currentQuestionIndex.value,
    value,
    questionType: question.question_type
  }
  
  if (existingIndex !== -1) {
    answers.value[existingIndex] = answer
  } else {
    answers.value.push(answer)
  }
  
  // Clear validation error when user answers
  delete validationErrors.value[currentQuestionIndex.value]
  draftSaved.value = false
}

const getStepClass = (step: number): string => {
  if (step < currentStep.value) {
    return 'bg-primary border-primary text-white shadow-lg'
  } else if (step === currentStep.value) {
    return 'bg-primary border-primary text-white ring-4 ring-primary/20 shadow-lg'
  } else {
    return 'bg-white border-gray-300 text-gray-600 shadow-sm'
  }
}

const getQuestionTypeLabel = (type?: string): string => {
  const labels = {
    mcq: 'Pilihan Ganda',
    likert: 'Skala Likert',
    case: 'Studi Kasus',
    text: 'Uraian'
  }
  return labels[type as keyof typeof labels] || type || 'Unknown'
}

const validateCurrentQuestion = (): boolean => {
  const question = currentQuestion.value
  if (!question) return false
  
  const answer = answers.value.find(a => a.questionIndex === currentQuestionIndex.value)
  if (!answer?.value) {
    validationErrors.value[currentQuestionIndex.value] = true
    return false
  }
  
  if ((question.question_type === 'case' || question.question_type === 'text') && typeof answer.value === 'string') {
    const minLength = question.question_type === 'case' ? 50 : 100
    if (answer.value.trim().length < minLength) {
      validationErrors.value[currentQuestionIndex.value] = true
      return false
    }
  }
  
  delete validationErrors.value[currentQuestionIndex.value]
  return true
}

const scrollToQuestionCard = () => {
  const questionCard = document.getElementById('question-card')
  if (questionCard) {
    questionCard.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }
}

const nextQuestion = (): void => {
  if (!validateCurrentQuestion()) return
  
  if (isLastQuestion.value) {
    submitQuestionnaire()
  } else {
    currentQuestionIndex.value++
    // Smooth scroll to question card instead of top
    setTimeout(() => {
      scrollToQuestionCard()
    }, 100)
  }
}

const previousQuestion = (): void => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    setTimeout(() => {
      scrollToQuestionCard()
    }, 100)
  }
}

const saveDraft = (): void => {
  if (!hasAnyAnswer.value) return
  
  const draftData: QuestionnaireState = {
    currentStep: currentQuestionIndex.value,
    answers: answers.value,
    isDraft: true
  }
  
  localStorage.setItem('questionnaire_draft', JSON.stringify(draftData))
  draftSaved.value = true
  
  setTimeout(() => {
    draftSaved.value = false
  }, 3000)
}

const loadDraft = (): void => {
  const draftData = localStorage.getItem('questionnaire_draft')
  if (draftData) {
    try {
      const parsed: QuestionnaireState = JSON.parse(draftData)
      currentQuestionIndex.value = parsed.currentStep
      answers.value = parsed.answers
      isDraftLoaded.value = true
      hasDraft.value = false
    } catch (error) {
      console.error('Error loading draft:', error)
      localStorage.removeItem('questionnaire_draft')
    }
  }
}

const startFresh = (): void => {
  localStorage.removeItem('questionnaire_draft')
  hasDraft.value = false
  currentQuestionIndex.value = 0
  answers.value = []
  validationErrors.value = {}
}

const submitQuestionnaire = (): void => {
  console.log('Submitting questionnaire:', answers.value)
  
  // Save completed questionnaire
  const completedData: QuestionnaireState = {
    currentStep: totalQuestions.value,
    answers: answers.value,
    isDraft: false,
    completedAt: new Date().toISOString()
  }
  
  localStorage.setItem('questionnaire_completed', JSON.stringify(completedData))
  localStorage.removeItem('questionnaire_draft')
  
  // navigateTo('/student/dashboard/questionnaire-result')
}

// Lifecycle
onMounted(async () => {
  await loadQuestions()
  
  const draft = localStorage.getItem('questionnaire_draft')
  const completed = localStorage.getItem('questionnaire_completed')
  
  if (completed) {
    // User already completed, redirect to results
    await navigateTo('/student/dashboard/questionnaire-result')
  } else if (draft) {
    hasDraft.value = true
  }
})

// Watch for auto-save
watch(answers, () => {
  if (answers.value.length > 0) {
    saveDraft()
  }
}, { deep: true })
</script>