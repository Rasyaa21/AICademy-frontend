<template>
  <div class="mx-auto space-y-8 max-w-4xl">
    <!-- Alert Modal -->
    <AlertModal 
      v-model:isOpen="alertModal.isOpen"
      :type="alertModal.type"
      :title="alertModal.title"
      :message="alertModal.message"
      @ok="alertModal.isOpen = false"
    />

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
      <div class="text-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="text-gray-600">
          {{ hasCompletedQuestionnaire ? 'Memuat hasil kuesioner...' : 'Memuat kuesioner...' }}
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else-if="hasCompletedQuestionnaire || questionnaire">
      <!-- Show results directly if questionnaire is already completed -->
      <template v-if="hasCompletedQuestionnaire && completedResults">
        <div class="space-y-8">
          <!-- Header -->
          <div class="mb-8">
            <QuestionnaireResultHeader :result="completedResults" />
          </div>
          
          <!-- Summary Statistics -->
          <div class="mb-8">
            <QuestionnaireResultSummary :result="completedResults"/>
          </div>
        </div>
      </template>

      <!-- Original questionnaire form and results content -->
      <template v-else>
        <!-- QUESTIONNAIRE FORM SECTION -->
        <div v-if="!showResults" class="space-y-8">
          <!-- Header -->
          <div class="space-y-6 text-center">
            <div class="inline-flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-primary/10">
              <Icon name="heroicons:clipboard-document-list-20-solid" class="w-8 h-8 text-primary" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900">{{ questionnaire.name }}</h1>
            <p class="mx-auto max-w-2xl text-lg text-gray-600">
              {{ questionnaire.instruction || `Jawab ${totalQuestions} pertanyaan berikut untuk mengetahui jalur karir IT yang paling sesuai dengan kepribadian dan minat Anda` }}
            </p>
          </div>

          <!-- Draft Notice -->
          <div v-if="hasDraft && !isDraftLoaded" class="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
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
              :disabled="!canProceed || isSubmitting"
              class="flex gap-2 justify-center items-center px-6 py-3 w-full text-white rounded-lg transition-colors sm:w-auto bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon 
                v-if="isSubmitting" 
                name="heroicons:arrow-path-20-solid" 
                class="w-4 h-4 animate-spin" 
              />
              <span>{{ isLastQuestion ? 'Kirim Jawaban' : 'Berikutnya' }}</span>
              <Icon 
                v-if="!isSubmitting"
                :name="isLastQuestion ? 'heroicons:paper-airplane-20-solid' : 'heroicons:arrow-right-20-solid'" 
                class="w-4 h-4" 
              />
            </button>
          </div>
        </div>

        <!-- RESULTS SECTION -->
        <div v-else-if="showResults" class="space-y-8">
          <!-- Loading Results -->
          <div v-if="isLoadingResults || isProcessingResults" class="flex justify-center items-center min-h-[500px]">
            <div class="text-center space-y-6">
              <div class="flex justify-center">
                <div class="relative">
                  <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <Icon name="heroicons:cpu-chip-20-solid" class="w-6 h-6 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div class="space-y-4">
                <h3 class="text-xl font-semibold text-gray-900">
                  {{ isProcessingResults || isCountingDown ? 'AI Sedang Memproses Hasil Anda...' : 'Memuat Hasil Kuesioner...' }}
                </h3>
                <p class="text-gray-600">
                  {{ isProcessingResults || isCountingDown ? 'Mohon tunggu, sistem AI sedang menganalisis jawaban Anda untuk memberikan rekomendasi karir yang tepat.' : 'Mengambil data hasil kuesioner...' }}
                </p>
                
                <!-- Countdown Progress Bar -->
                <div v-if="isCountingDown" class="max-w-md mx-auto space-y-3">
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Memuat hasil otomatis dalam:</span>
                    <span class="font-medium">{{ countdown }} detik</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      class="bg-primary h-3 rounded-full transition-all duration-1000 ease-linear"
                      :style="{ width: `${progressPercent}%` }"
                    ></div>
                  </div>
                  <button 
                    @click="loadResults"
                    class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Muat Sekarang
                  </button>
                </div>
                
                <!-- Manual Refresh Button -->
                <div v-else-if="isProcessingResults" class="space-y-2">
                  <div class="text-sm text-gray-500">
                    {{ processingTime }}
                  </div>
                  <button 
                    @click="loadResults"
                    class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Periksa Status
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Results Error -->
          <div v-else-if="resultsError" class="p-6 bg-red-50 rounded-xl border border-red-200">
            <div class="flex gap-3 items-start">
              <Icon name="heroicons:exclamation-triangle-20-solid" class="mt-0.5 w-6 h-6 text-red-600" />
              <div>
                <h3 class="font-medium text-red-800">Gagal Memuat Hasil</h3>
                <p class="mt-1 text-sm text-red-700">{{ resultsError }}</p>
                <div class="flex gap-2 mt-3">
                  <button 
                    @click="retryLoadResults"
                    class="px-4 py-2 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Coba Lagi
                  </button>
                  <button 
                    @click="resetToQuestionnaire"
                    class="px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Kembali ke Kuesioner
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Results Content -->
          <template v-else-if="results">
            <!-- Header -->
            <div class="mb-8">
              <QuestionnaireResultHeader :result="results" />
            </div>
            
            <!-- Summary Statistics -->
            <div class="mb-8">
              <QuestionnaireResultSummary :result="results"/>
            </div>
            
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { 
  Answer, 
  QuestionnaireState, 
  QuestionnaireData, 
  QuestionnaireResult 
} from '~/types/Questionnaire'
import QuestionLikert from '~/components/dashboard-student/questionnaires/QuestionLikert.vue'
import QuestionCase from '~/components/dashboard-student/questionnaires/QuestionCase.vue'
import QuestionText from '~/components/dashboard-student/questionnaires/QuestionText.vue'
import QuestionMCQ from '~/components/dashboard-student/questionnaires/QuestionMCQ.vue'
import QuestionnaireResultHeader from '~/components/dashboard-student/questionnaires/QuestionnaireResultHeader.vue'
import QuestionnaireResultSummary from '~/components/dashboard-student/questionnaires/QuestionnaireResultSummary.vue'
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import type { ApiInterface } from '~/types/ApiResponse'

definePageMeta({
  layout: 'dashboard-layout-student-dashboard-layout'
})

// Alert Modal State
const alertModal = ref({
  isOpen: false,
  type: 'error' as 'success' | 'error' | 'warning' | 'info',
  title: '',
  message: ''
})

const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
  alertModal.value = {
    isOpen: true,
    type,
    title,
    message
  }
}

const config = useRuntimeConfig()

// State
const currentQuestionIndex = ref(0)
const answers = ref<Answer[]>([])
const validationErrors = ref<Record<number, boolean>>({})
const draftSaved = ref(false)
const hasDraft = ref(false)
const isDraftLoaded = ref(false)
const isSubmitting = ref(false)

// Results state
const showResults = ref(false)
const results = ref<QuestionnaireResult | null>(null)
const isLoadingResults = ref(false)
const isProcessingResults = ref(false)
const resultsError = ref('')
const processingTime = ref('')
const responseId = ref<string | null>(null)

// Add the missing countdown variables
const isCountingDown = ref(false)
const countdown = ref(0)
const progressPercent = ref(0)

// Auto-save timeout
let saveTimeout: NodeJS.Timeout
let processingInterval: NodeJS.Timeout

const headers = useRequestHeaders(['cookie'])

// First, fetch student role to check if questionnaire is already completed
const { data: studentRoleData, pending: rolePending } = await useAsyncData(
  'student-role',
  () => $fetch('/student/role', {
    baseURL: config.public.apiBase,
    credentials: 'include',
    headers,
    timeout: 10000,
    retry: 2,
    retryDelay: 1000,
    server: false
  })
)

// Check if student has completed questionnaire
const hasCompletedQuestionnaire = computed(() => {
  return studentRoleData.value?.data?.has_completed_questionnaire === true
})

// If already completed, use the recommended role as results
const completedResults = computed(() => {
  if (hasCompletedQuestionnaire.value && studentRoleData.value?.data?.recommended_role) {
    const roleData = studentRoleData.value.data.recommended_role
    
    // Structure the data to match what the result components expect
    return {
      status: 'completed',
      mainRecommendedRole: {
        role_id: roleData.role_id,
        role_name: roleData.role_name,
        description: roleData.description,
        category: roleData.category,
        score: roleData.score,
        justification: roleData.justification
      },
      // Add other expected properties
      recommendations: [
        {
          role_id: roleData.role_id,
          role_name: roleData.role_name,
          description: roleData.description,
          category: roleData.category,
          score: roleData.score,
          justification: roleData.justification
        }
      ],
      // Add any additional properties that might be expected
      totalScore: roleData.score,
      completedAt: new Date().toISOString()
    }
  }
  return null
})

// Conditionally fetch questionnaire only if not completed
const shouldFetchQuestionnaire = computed(() => !hasCompletedQuestionnaire.value)

const { data: QuestionnaireData, pending: questionnairePending, error, refresh } = await useAsyncData(
  'student-questionnaire-active',
  (): Promise<ApiInterface<QuestionnaireData>> => {
    if (!shouldFetchQuestionnaire.value) {
      return Promise.resolve({
        success: false,
        message: 'Questionnaire already completed',
        data: null
      } as ApiInterface<QuestionnaireData>)
    }
    
    return $fetch<ApiInterface<QuestionnaireData>>(`/student/questionnaire/active`, {
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers,
      timeout: 10000,
      retry: 2,
      retryDelay: 1000,
    })
  },
  {
    default: (): ApiInterface<QuestionnaireData> => ({
      success: false,
      message: 'No data',
      data: null
    }),
    transform: (data: ApiInterface<QuestionnaireData>) => {
      if (!shouldFetchQuestionnaire.value) {
        return data
      }
      
      if (!data?.success || !data?.data?.questions) {
        throw new Error(data?.message || 'Invalid questionnaire data')
      }
      
      data.data.questions.sort((a, b) => (a.order || 0) - (b.order || 0))
      return data
    }
  }
)

// Overall pending state
const pending = computed(() => rolePending.value || (shouldFetchQuestionnaire.value && questionnairePending.value))

// Computed properties
const questionnaire = computed(() => QuestionnaireData.value?.data || null)
const questions = computed(() => questionnaire.value?.questions || [])
const totalQuestions = computed(() => questions.value.length)
const questionsPerStep = 4
const totalSteps = computed(() => Math.ceil(totalQuestions.value / questionsPerStep))

const currentStep = computed(() => Math.floor(currentQuestionIndex.value / questionsPerStep) + 1)
const currentQuestionNumber = computed(() => currentQuestionIndex.value + 1)
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || null)
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)

const stepProgress = computed(() => {
  if (totalSteps.value <= 1) return 100
  return ((currentStep.value - 1) / (totalSteps.value - 1)) * 100
})

// Answer computed properties
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

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const nextQuestion = (): void => {
  if (!validateCurrentQuestion()) return
  
  if (isLastQuestion.value) {
    submitQuestionnaire()
  } else {
    currentQuestionIndex.value++
    setTimeout(() => {
      const questionCard = document.getElementById('question-card')
      if (questionCard) {
        questionCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
}

const previousQuestion = (): void => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    setTimeout(() => {
      const questionCard = document.getElementById('question-card')
      if (questionCard) {
        questionCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
}

const saveDraft = (): void => {
  if (!hasAnyAnswer.value || !questionnaire.value) return
  
  const draftData: QuestionnaireState = {
    questionnaireId: questionnaire.value.id,
    currentStep: currentQuestionIndex.value,
    answers: answers.value,
    isDraft: true,
    savedAt: new Date().toISOString()
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
      if (!parsed.questionnaireId || parsed.questionnaireId === questionnaire.value?.id) {
        currentQuestionIndex.value = parsed.currentStep
        answers.value = parsed.answers
        isDraftLoaded.value = true
        hasDraft.value = false
      } else {
        localStorage.removeItem('questionnaire_draft')
        hasDraft.value = false
      }
    } catch (error) {
      console.error('Error loading draft:', error)
      localStorage.removeItem('questionnaire_draft')
      hasDraft.value = false
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

// Processing timer
const startProcessingTimer = () => {
  let seconds = 0
  processingInterval = setInterval(() => {
    seconds++
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    processingTime.value = minutes > 0 
      ? `${minutes} menit ${remainingSeconds} detik` 
      : `${remainingSeconds} detik`
  }, 1000)
}

const stopProcessingTimer = () => {
  if (processingInterval) {
    clearInterval(processingInterval)
  }
}

// Load results function
const loadResults = async () => {
  if (!responseId.value) {
    resultsError.value = 'Response ID tidak ditemukan'
    return
  }

  try {
    isLoadingResults.value = true
    resultsError.value = ''
    
    const response = await $fetch(`/student/questionnaire/result/${responseId.value}`, {
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers,
      timeout: 10000,
      retry: 1
    })

    if (response.data?.status === 'processing') {
      isProcessingResults.value = true
      startProcessingTimer()
      
      // Poll every 5 seconds until processing is complete
      const pollResults = async () => {
        try {
          const pollResponse = await $fetch(`/student/questionnaire/result/${responseId.value}`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers,
            timeout: 10000
          })

          console.log("res data");
          
          if (pollResponse.data?.status === 'completed') {
            results.value = pollResponse.data
            isProcessingResults.value = false
            stopProcessingTimer()
          } else {
            setTimeout(pollResults, 5000)
          }
        } catch (error) {
          isProcessingResults.value = false
          stopProcessingTimer()
          resultsError.value = 'Gagal memuat hasil. Silakan coba lagi.'
        }
      }
      
      setTimeout(pollResults, 5000)
    } else {
      results.value = response.data
    }
    
  } catch (error: any) {
    resultsError.value = error.message || 'Gagal memuat hasil'
  } finally {
    isLoadingResults.value = false
  }
}

// Submit questionnaire (send RAW JSON)
const submitQuestionnaire = async (): Promise<void> => {
  if (!questionnaire.value) return

  try {
    isSubmitting.value = true

    const submissionData = {
      questionnaire_id: questionnaire.value.id,
      answers: answers.value.map(answer => {
        const question = questions.value[answer.questionIndex]
        if (!question?.id) {
          console.error('Question not found for index:', answer.questionIndex)
          return null
        }

      const answerData: any = {
        question_id: question.id,
        // semua jenis question pakai field 'answer'
        answer: String(answer.value)
      }

      // skor tetap disesuaikan tipe pertanyaan
      switch (question.question_type) {
        case 'mcq':
          answerData.score = 5
          break
        case 'likert':
          answerData.score = Number(answer.value)
          break
        case 'case':
        case 'text':
          answerData.score = 1
          break
        default:
          answerData.score = 1
      }

      return answerData
    }).filter(Boolean)
  }

    console.log('=== FRONTEND SUBMISSION DEBUG ===')
    console.log('Questionnaire ID:', submissionData.questionnaire_id)
    console.log('Answers count:', submissionData.answers.length)
    console.log('Full payload:', JSON.stringify(submissionData, null, 2))
    console.log('Request body:', JSON.stringify(submissionData))


    // Validate data
    if (!submissionData.questionnaire_id) {
      throw new Error('Questionnaire ID is missing')
    }
    
    if (!submissionData.answers || submissionData.answers.length === 0) {
      throw new Error('No answers to submit')
    }


    const response = await $fetch(`/student/questionnaire/submit`, {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: headers,
      credentials: 'include', 
      body: JSON.stringify(submissionData) 
    })

    console.log('Response status:', response.status)

    console.log('Success response:', response)

    showAlert('success', 'Berhasil!', 'Jawaban Anda telah berhasil dikirim. Sedang memproses hasil...')

    responseId.value = response?.data?.response_id
    if (responseId.value) {
      localStorage.setItem('questionnaire_response_id', responseId.value)
      localStorage.removeItem('questionnaire_draft')
      
      showResults.value = true
      scrollToTop()
      
      await loadResults()
    } else {
      throw new Error('No response ID received from server')
    }
    
  } catch (err: any) {
    console.error('=== SUBMISSION ERROR ===', err)
    
    let errorTitle = 'Gagal Mengirim Jawaban'
    let errorMessage = 'Terjadi kesalahan saat mengirim jawaban Anda.'
    
    if (err.message?.includes('400')) {
      errorTitle = 'Data Tidak Valid'
      errorMessage = `Server menolak data yang dikirim (400). Kemungkinan ada masalah dengan format jawaban. Detail: ${err.message}`
    } else if (err.message?.includes('401')) {
      errorTitle = 'Sesi Berakhir'
      errorMessage = 'Sesi Anda telah berakhir. Silakan login ulang dan coba lagi.'
    } else if (err.message?.includes('403')) {
      errorTitle = 'Akses Ditolak'
      errorMessage = 'Anda tidak memiliki izin untuk mengirim jawaban kuesioner ini.'
    } else if (err.message?.includes('500')) {
      errorTitle = 'Error Server'
      errorMessage = 'Terjadi kesalahan di server. Silakan coba lagi beberapa saat.'
    } else if (err.message) {
      errorMessage = err.message
    }
    
    showAlert('error', errorTitle, errorMessage)
    
  } finally {
    isSubmitting.value = false
  }
}

// Results actions
const retryLoadResults = async () => {
  isCountingDown.value = false
  countdown.value = 0
  progressPercent.value = 0
  await loadResults()
}

const resetToQuestionnaire = () => {
  showResults.value = false
  results.value = null
  responseId.value = null
  resultsError.value = ''
  isLoadingResults.value = false
  isProcessingResults.value = false
  isCountingDown.value = false
  countdown.value = 0
  progressPercent.value = 0
  stopProcessingTimer()
  scrollToTop()
}

// Lifecycle
onMounted(async () => {
  // If questionnaire is already completed, show results immediately
  if (hasCompletedQuestionnaire.value && completedResults.value) {
    results.value = completedResults.value
    showResults.value = true
    return
  }

  // Otherwise, handle draft logic for questionnaire
  if (questionnaire.value) {
    const draft = localStorage.getItem('questionnaire_draft')
    const completed = localStorage.getItem('questionnaire_completed')
    
    if (completed) {
      try {
        const parsedCompleted = JSON.parse(completed)
        if (!parsedCompleted.questionnaireId || parsedCompleted.questionnaireId === questionnaire.value.id) {
          const storedResponseId = localStorage.getItem('questionnaire_response_id')
          if (storedResponseId) {
            responseId.value = storedResponseId
            showResults.value = true
            await loadResults()
            return
          }
        }
      } catch {
        localStorage.removeItem('questionnaire_completed')
      }
    }
    
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft)
        if (!parsedDraft.questionnaireId || parsedDraft.questionnaireId === questionnaire.value.id) {
          hasDraft.value = true
        } else {
          localStorage.removeItem('questionnaire_draft')
        }
      } catch {
        localStorage.removeItem('questionnaire_draft')
      }
    }
  }
})

// Enhanced auto-save
watch(answers, () => {
  if (answers.value.length > 0 && questionnaire.value) {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      saveDraft()
    }, 1000)
  }
}, { deep: true })

// Cleanup
onUnmounted(() => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  isCountingDown.value = false
  stopProcessingTimer()
})
</script>