<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
        <div class="mx-4 w-full max-w-4xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Detail Kuisioner
                    </h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <!-- Loading State -->
                <div v-if="pending" class="text-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p class="text-gray-500 mt-2">Memuat detail kuisioner...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-8">
                    <p class="text-red-500">Error: {{ error.message }}</p>
                    <button @click="refreshData()" class="mt-2 px-4 py-2 bg-primary text-white rounded-lg">
                        Coba Lagi
                    </button>
                </div>

                <!-- Content -->
                <div v-else-if="questionnaireDetail" class="space-y-6">
                    <!-- Header Info -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ questionnaireDetail.name }}</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <span class="font-medium">Versi:</span> {{ questionnaireDetail.version }}
                            </div>
                            <div>
                                <span class="font-medium">Status:</span>
                                <span :class="questionnaireDetail.active ? 'text-green-600' : 'text-gray-600'">
                                    {{ questionnaireDetail.active ? 'Aktif' : 'Tidak Aktif' }}
                                </span>
                            </div>
                            <div>
                                <span class="font-medium">Total Pertanyaan:</span> {{ questionnaireDetail.questions?.length || 0 }}
                            </div>
                            <div>
                                <span class="font-medium">Total Respons:</span> {{ questionnaireDetail.total_submissions }}
                            </div>
                        </div>
                        <div v-if="questionnaireDetail.description" class="mt-3">
                            <span class="font-medium">Deskripsi:</span>
                            <p class="text-gray-600 mt-1">{{ questionnaireDetail.description }}</p>
                        </div>
                    </div>

                    <!-- Questions Stats -->
                    <div class="grid grid-cols-4 gap-4">
                        <div v-for="(count, type) in questionStats" :key="type" 
                             class="bg-white border rounded-lg p-4 text-center">
                            <div class="text-2xl font-bold text-primary">{{ count }}</div>
                            <div class="text-sm text-gray-600 capitalize">{{ getTypeLabel(type) }}</div>
                        </div>
                    </div>

                    <!-- Questions by Type -->
                    <div v-for="questionType in questionTypeOrder" :key="questionType" class="space-y-4">
                        <template v-if="groupedQuestions[questionType]?.length > 0">
                            <h5 class="text-md font-semibold text-gray-900 flex items-center gap-2">
                                <Icon :name="getTypeIcon(questionType)" class="w-5 h-5" />
                                {{ getTypeLabel(questionType) }} ({{ groupedQuestions[questionType].length }})
                            </h5>
                            
                            <div class="space-y-3">
                                <div v-for="(question, index) in groupedQuestions[questionType]" :key="question.id"
                                     class="border rounded-lg p-4 bg-gray-50">
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="text-sm font-medium text-gray-700">
                                            Pertanyaan {{ question.order }}
                                        </span>
                                        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {{ question.category }}
                                        </span>
                                    </div>
                                    
                                    <p class="text-gray-900 mb-3">{{ question.question_text }}</p>
                                    
                                    <!-- MCQ Options -->
                                    <div v-if="question.question_type === 'mcq' && question.options" class="space-y-2">
                                        <div v-for="(option, optIndex) in question.options" :key="optIndex"
                                             class="flex items-center gap-2 text-sm">
                                            <span class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                                {{ String.fromCharCode(65 + optIndex) }}
                                            </span>
                                            <span>{{ option.text }}</span>
                                            <span class="text-gray-500">(Skor: {{ option.score }})</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Likert Options -->
                                    <div v-else-if="question.question_type === 'likert' && question.options" class="space-y-2">
                                        <div class="flex flex-wrap gap-2">
                                            <div v-for="(option, optIndex) in question.options" :key="optIndex"
                                                 class="px-3 py-1 bg-gray-200 rounded-full text-sm">
                                                {{ option.text }} ({{ option.score }})
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Text/Case Question Info -->
                                    <div v-else-if="['text', 'case'].includes(question.question_type)" class="text-sm text-gray-600">
                                        <span class="italic">Jawaban terbuka - Skor maksimal: {{ question.max_score }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
    isOpen: boolean
    questionnaireId: string | null
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const questionnaireDetail = ref<any>(null)
const pending = ref(false)
const error = ref<any>(null)

// Order untuk menampilkan tipe pertanyaan
const questionTypeOrder = ['mcq', 'likert', 'case', 'text']

// Grouping questions by type
const groupedQuestions = computed(() => {
    if (!questionnaireDetail.value?.questions) return {}
    
    const groups: Record<string, any[]> = {}
    
    questionnaireDetail.value.questions.forEach((question: any) => {
        const type = question.question_type
        if (!groups[type]) {
            groups[type] = []
        }
        groups[type].push(question)
    })
    
    // Sort questions within each group by order
    Object.keys(groups).forEach(type => {
        groups[type].sort((a, b) => a.order - b.order)
    })
    
    return groups
})

// Statistics
const questionStats = computed(() => {
    const stats: Record<string, number> = {
        mcq: 0,
        likert: 0,
        case: 0,
        text: 0
    }
    
    if (questionnaireDetail.value?.questions) {
        questionnaireDetail.value.questions.forEach((question: any) => {
            if (stats.hasOwnProperty(question.question_type)) {
                stats[question.question_type]++
            }
        })
    }
    
    return stats
})

const fetchQuestionnaireDetail = async () => {
    if (!props.questionnaireId) return
    
    pending.value = true
    error.value = null
    
    try {
        const response = await $fetch(`/admin/questionnaires/${props.questionnaireId}`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        
        questionnaireDetail.value = response.data
    } catch (e: any) {
        error.value = e
        console.error('Error fetching questionnaire detail:', e)
    } finally {
        pending.value = false
    }
}

const refreshData = () => {
    fetchQuestionnaireDetail()
}

const closeModal = () => {
    emit('update:isOpen', false)
    questionnaireDetail.value = null
}

const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        mcq: 'Pilihan Ganda',
        likert: 'Skala Likert',
        case: 'Studi Kasus',
        text: 'Jawaban Terbuka'
    }
    return labels[type] || type
}

const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
        mcq: 'heroicons:list-bullet-20-solid',
        likert: 'heroicons:chart-bar-20-solid',
        case: 'heroicons:document-text-20-solid',
        text: 'heroicons:pencil-20-solid'
    }
    return icons[type] || 'heroicons:question-mark-circle-20-solid'
}

// Watch for modal open and fetch data
watch(() => props.isOpen, (isOpen) => {
    if (isOpen && props.questionnaireId) {
        fetchQuestionnaireDetail()
    }
})
</script>