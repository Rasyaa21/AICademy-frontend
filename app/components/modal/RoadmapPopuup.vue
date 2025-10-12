<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg p-2.5">
                            <Icon :name="selectedItem?.icon || 'heroicons:academic-cap-20-solid'" class="w-full h-full text-white" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-gray-900">{{ selectedItem?.title }}</h3>
                            <p class="text-sm text-gray-500">{{ selectedItem?.stepData?.submission_guidelines }}</p>
                        </div>
                    </div>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <Icon name="heroicons:x-mark-20-solid" class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <!-- Loading State for Step Progress -->
            <div v-if="loadingStepProgress" class="p-6 flex justify-center">
                <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-4 m-6 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center gap-2">
                    <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-red-500" />
                    <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="p-4 m-6 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center gap-2">
                    <Icon name="heroicons:check-circle-20-solid" class="w-5 h-5 text-green-500" />
                    <p class="text-sm text-green-700">{{ successMessage }}</p>
                </div>
            </div>

            <div v-else class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Description -->
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-2">Deskripsi</h4>
                            <p class="text-gray-600 leading-relaxed">{{ stepProgress?.description || selectedItem?.description }}</p>
                        </div>

                        <!-- Duration & Status -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="flex items-center gap-2 text-sm">
                                <Icon name="heroicons:clock-20-solid" class="w-5 h-5 text-primary" />
                                <span class="font-medium text-gray-900">Durasi:</span>
                                <span class="text-primary font-semibold">{{ stepProgress?.estimated_duration || selectedItem?.stepData?.estimated_duration }} hari</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm">
                                <Icon name="heroicons:flag-20-solid" class="w-5 h-5 text-primary" />
                                <span class="font-medium text-gray-900">Status:</span>
                                <span class="font-semibold" :class="getStatusColor()">
                                    {{ getStatusText() }}
                                </span>
                            </div>
                        </div>

                        <!-- Learning Objectives -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="font-semibold text-gray-900 flex items-center gap-2">
                                    <Icon name="heroicons:academic-cap-20-solid" class="w-5 h-5 text-primary" />
                                    Objektif Pembelajaran
                                </h4>
                                <button 
                                    @click="expandedSection = expandedSection === 'objectives' ? null : 'objectives'"
                                    class="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                                >
                                    {{ expandedSection === 'objectives' ? 'Tutup' : 'Lihat Detail' }}
                                    <Icon 
                                        name="heroicons:chevron-down-20-solid" 
                                        class="w-4 h-4 transition-transform duration-200"
                                        :class="{ 'rotate-180': expandedSection === 'objectives' }"
                                    />
                                </button>
                            </div>
                            
                            <div v-if="expandedSection === 'objectives'" class="space-y-2">
                                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p class="text-gray-700 text-sm leading-relaxed">
                                        {{ stepProgress?.learning_objectives || selectedItem?.stepData?.learning_objectives }}
                                    </p>
                                </div>
                            </div>
                            <div v-else class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <p class="text-gray-600 text-sm line-clamp-2">
                                    {{ stepProgress?.learning_objectives || selectedItem?.stepData?.learning_objectives }}
                                </p>
                            </div>
                        </div>

                        <!-- Resources -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="font-semibold text-gray-900 flex items-center gap-2">
                                    <Icon name="heroicons:book-open-20-solid" class="w-5 h-5 text-primary" />
                                    Learning Resources
                                </h4>
                                <button 
                                    @click="expandedSection = expandedSection === 'resources' ? null : 'resources'"
                                    class="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                                >
                                    {{ expandedSection === 'resources' ? 'Tutup' : 'Lihat Semua' }}
                                    <Icon 
                                        name="heroicons:chevron-down-20-solid" 
                                        class="w-4 h-4 transition-transform duration-200"
                                        :class="{ 'rotate-180': expandedSection === 'resources' }"
                                    />
                                </button>
                            </div>
                            
                            <div class="space-y-2">
                                <template v-if="expandedSection === 'resources'">
                                    <a v-for="resource in currentResources" :key="resource.id" 
                                       :href="resource.url" target="_blank"
                                       class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary/20 hover:bg-gray-50 transition-colors">
                                        <Icon name="heroicons:link-20-solid" class="w-5 h-5 text-primary" />
                                        <div class="flex-1">
                                            <p class="text-sm font-medium text-gray-900">{{ resource.title }}</p>
                                            <p class="text-xs text-gray-500">{{ resource.url }}</p>
                                        </div>
                                        <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-4 h-4 text-gray-400" />
                                    </a>
                                </template>
                                <template v-else>
                                    <div class="grid grid-cols-1 gap-2">
                                        <a v-for="resource in currentResources.slice(0, 2)" :key="resource.id" 
                                           :href="resource.url" target="_blank"
                                           class="flex items-center gap-2 p-2 border border-gray-200 rounded text-xs hover:border-primary/20 transition-colors">
                                            <Icon name="heroicons:link-20-solid" class="w-4 h-4 text-primary" />
                                            <span class="flex-1 truncate">{{ resource.title }}</span>
                                            <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-3 h-3 text-gray-400" />
                                        </a>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- Submission Guidelines -->
                        <div v-if="currentStepData?.submission_guidelines">
                            <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Icon name="heroicons:clipboard-document-check-20-solid" class="w-5 h-5 text-primary" />
                                Petunjuk Submission
                            </h4>
                            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p class="text-gray-700 text-sm">{{ currentStepData.submission_guidelines }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Actions -->
                    <div class="space-y-6">
                        <!-- Submission Status -->
                        <div v-if="currentStepData">
                            <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Icon name="heroicons:paper-airplane-20-solid" class="w-5 h-5 text-primary" />
                                Status Submission
                            </h4>
                            
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <div class="flex items-center gap-2 mb-2">
                                    <Icon :name="getSubmissionStatusIcon()" class="w-4 h-4" :class="getSubmissionStatusColor()" />
                                    <span class="text-sm font-medium text-gray-900">
                                        {{ getSubmissionStatusText() }}
                                    </span>
                                </div>
                                
                                <div v-if="currentStepData.evidence_link" class="mt-3">
                                    <p class="text-xs text-gray-500 mb-1">Link Evidence:</p>
                                    <a :href="currentStepData.evidence_link" target="_blank" 
                                       class="text-xs text-blue-600 hover:text-blue-800 underline break-all">
                                        {{ currentStepData.evidence_link }}
                                    </a>
                                </div>
                                
                                <div v-if="currentStepData.validation_notes" class="mt-3">
                                    <p class="text-xs text-gray-500 mb-1">Catatan Validasi:</p>
                                    <p class="text-xs text-gray-700">{{ currentStepData.validation_notes }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Start Step Button -->
                        <div v-if="currentStepData?.can_start && !currentStepData?.started_at">
                            <button 
                                @click="handleStartStep"
                                :disabled="startingStep"
                                class="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Icon v-if="startingStep" name="heroicons:arrow-path-20-solid" class="w-5 h-5 animate-spin" />
                                <Icon v-else name="heroicons:rocket-launch-20-solid" class="w-5 h-5" />
                                {{ startingStep ? 'Memulai...' : 'Mulai Step' }}
                            </button>
                        </div>

                        <!-- Submission Form -->
                        <div v-if="currentStepData?.can_submit && !currentStepData.submitted_at">
                            <div v-if="!showSubmissionForm">
                                <button 
                                    @click="toggleSubmissionForm"
                                    class="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <Icon name="heroicons:paper-airplane-20-solid" class="w-5 h-5" />
                                    Submit Evidence
                                </button>
                            </div>
                            
                            <div v-else class="space-y-4">
                                <h4 class="font-semibold text-gray-900">Submit Evidence</h4>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Evidence Link *
                                    </label>
                                    <input 
                                        v-model="submissionForm.evidenceLink"
                                        type="url" 
                                        placeholder="https://github.com/yourusername/project"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Evidence Type
                                    </label>
                                    <select 
                                        v-model="submissionForm.evidenceType"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                    >
                                        <option value="url">URL/Link</option>
                                        <option value="github_link">GitHub Repository</option>
                                        <option value="drive_link">Google Drive</option>
                                        <option value="other_link">Other Link</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Catatan (Opsional)
                                    </label>
                                    <textarea 
                                        v-model="submissionForm.submissionNotes"
                                        rows="3"
                                        placeholder="Tambahkan catatan untuk submission Anda..."
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                                    ></textarea>
                                </div>
                                
                                <div class="flex gap-2">
                                    <button 
                                        @click="handleSubmission"
                                        :disabled="!submissionForm.evidenceLink || submittingStep"
                                        class="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        {{ submittingStep ? 'Submitting...' : 'Submit' }}
                                    </button>
                                    <button 
                                        @click="toggleSubmissionForm"
                                        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Status Messages -->
                        <div class="space-y-3">
                            <div v-if="currentStepData?.status === 'locked'" class="w-full bg-gray-100 text-gray-600 px-4 py-3 rounded-lg font-medium text-center">
                                <Icon name="heroicons:lock-closed-20-solid" class="w-5 h-5 inline mr-2" />
                                Step Terkunci - Selesaikan step sebelumnya
                            </div>
                            
                            <div v-else-if="currentStepData?.started_at && currentStepData?.can_submit && !currentStepData?.submitted_at" class="w-full bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium text-center">
                                <Icon name="heroicons:information-circle-20-solid" class="w-5 h-5 inline mr-2" />
                                Step sudah dimulai - Silakan submit evidence
                            </div>
                            
                            <div v-else-if="currentStepData?.submitted_at && !currentStepData?.completed_at" class="w-full bg-yellow-100 text-yellow-700 px-4 py-3 rounded-lg font-medium text-center">
                                <Icon name="heroicons:clock-20-solid" class="w-5 h-5 inline mr-2" />
                                Menunggu review dari mentor
                            </div>
                            
                            <div v-else-if="currentStepData?.completed_at" class="w-full bg-green-100 text-green-700 px-4 py-3 rounded-lg font-medium text-center">
                                <Icon name="heroicons:check-circle-20-solid" class="w-5 h-5 inline mr-2" />
                                Step selesai - Lanjut ke step berikutnya
                            </div>
                            
                            <button 
                                @click="closeModal"
                                class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { RoadmapTimelineItem } from '~/types/RoadmapTimeline';

const props = defineProps<{
    isOpen: boolean
    selectedItem?: RoadmapTimelineItem | null
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'submit-step': [stepId: string, evidenceLink: string, evidenceType: string, submissionNotes?: string]
    'start-step': [stepId: string]
    'refresh-roadmap': []
}>()

const config = useRuntimeConfig()
const expandedSection = ref<'objectives' | 'resources' | null>(null)
const submissionForm = ref({
    evidenceLink: '',
    evidenceType: 'url',
    submissionNotes: ''
})
const showSubmissionForm = ref(false)
const stepProgress = ref<any>(null)
const loadingStepProgress = ref(false)
const startingStep = ref(false)
const submittingStep = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Computed properties
const currentStepData = computed(() => stepProgress.value || props.selectedItem?.stepData)
const currentResources = computed(() => {
    if (stepProgress.value?.resource_links) {
        try {
            const links = JSON.parse(stepProgress.value.resource_links)
            return links.map((link: string, idx: number) => ({
                id: `res${idx}`,
                title: `Resource ${idx + 1}`,
                type: 'documentation',
                url: link
            }))
        } catch {
            return []
        }
    }
    return props.selectedItem?.resources || []
})

// Clear messages when form changes
watch(() => submissionForm.value, () => {
    errorMessage.value = ''
    successMessage.value = ''
}, { deep: true })

// Fetch step progress when modal opens
watch(() => props.isOpen, async (isOpen) => {
    if (isOpen && props.selectedItem?.stepData?.id) {
        errorMessage.value = ''
        successMessage.value = ''
        await fetchStepProgress(props.selectedItem.stepData.id)
    }
})

const fetchStepProgress = async (stepId: string) => {
    loadingStepProgress.value = true
    try {
        const response = await $fetch(`/student/roadmaps/steps/${stepId}/progress`, {
            method: 'GET',
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
        
        if (response.success) {
            stepProgress.value = response.data
        }
    } catch (error) {
        console.error('Error fetching step progress:', error)
        errorMessage.value = 'Gagal memuat data step'
    } finally {
        loadingStepProgress.value = false
    }
}

const handleStartStep = async () => {
    if (!currentStepData.value?.id) return
    
    startingStep.value = true
    errorMessage.value = ''
    
    try {
        const response = await $fetch('/student/roadmaps/steps/start', {
            method: 'POST',
            body: { step_id: currentStepData.value.id },
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
        
        if (response.success) {
            successMessage.value = 'Step berhasil dimulai!'
            // Refresh step progress
            await fetchStepProgress(currentStepData.value.id)
            // Emit to refresh roadmap
            emit('refresh-roadmap')
        }
    } catch (error: any) {
        console.error('Error starting step:', error)
        errorMessage.value = error.data?.message || 'Gagal memulai step'
    } finally {
        startingStep.value = false
    }
}

const validateSubmissionForm = () => {
    if (!submissionForm.value.evidenceLink.trim()) {
        return 'Evidence link tidak boleh kosong'
    }
    
    // Basic URL validation
    try {
        new URL(submissionForm.value.evidenceLink)
    } catch {
        return 'Format URL tidak valid'
    }
    
    if (!submissionForm.value.evidenceType) {
        return 'Evidence type harus dipilih'
    }
    
    return null
}

const closeModal = () => {
    expandedSection.value = null
    showSubmissionForm.value = false
    submissionForm.value = {
        evidenceLink: '',
        evidenceType: 'url',
        submissionNotes: ''
    }
    stepProgress.value = null
    errorMessage.value = ''
    successMessage.value = ''
    emit('update:isOpen', false)
}

const handleSubmission = async () => {
    if (!currentStepData.value?.id) {
        errorMessage.value = 'Step ID tidak ditemukan'
        return
    }
    
    // Validate form
    const validationError = validateSubmissionForm()
    if (validationError) {
        errorMessage.value = validationError
        return
    }
    
    submittingStep.value = true
    errorMessage.value = ''
    
    try {
        // Prepare request body exactly as specified
        const requestBody = {
            step_id: currentStepData.value.id,
            evidence_link: submissionForm.value.evidenceLink.trim(),
            evidence_type: submissionForm.value.evidenceType,
            ...(submissionForm.value.submissionNotes.trim() && {
                submission_notes: submissionForm.value.submissionNotes.trim()
            })
        }
        
        console.log('Submitting with body:', requestBody) // Debug log
        
        const response = await $fetch('/student/roadmaps/steps/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody,
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
        
        if (response.success) {
            successMessage.value = 'Evidence berhasil disubmit!'
            // Refresh step progress
            await fetchStepProgress(currentStepData.value.id)
            // Emit to refresh roadmap
            emit('refresh-roadmap')
            showSubmissionForm.value = false
            
            // Reset form
            submissionForm.value = {
                evidenceLink: '',
                evidenceType: 'url',
                submissionNotes: ''
            }
        } else {
            errorMessage.value = response.message || 'Gagal submit evidence'
        }
    } catch (error: any) {
        console.error('Error submitting step:', error)
        
        // More detailed error handling
        if (error.status === 400) {
            errorMessage.value = error.data?.message || 'Request tidak valid. Periksa kembali data yang diinput.'
        } else if (error.status === 401) {
            errorMessage.value = 'Sesi Anda telah berakhir. Silakan login kembali.'
        } else if (error.status === 403) {
            errorMessage.value = 'Anda tidak memiliki akses untuk submit step ini.'
        } else if (error.status === 422) {
            errorMessage.value = 'Data yang diinput tidak valid. Periksa kembali form.'
        } else {
            errorMessage.value = error.data?.message || 'Gagal submit evidence. Silakan coba lagi.'
        }
    } finally {
        submittingStep.value = false
    }
}

const toggleSubmissionForm = () => {
    showSubmissionForm.value = !showSubmissionForm.value
    errorMessage.value = ''
    successMessage.value = ''
}

const getStatusText = () => {
    if (currentStepData.value?.completed_at) return 'Selesai'
    if (currentStepData.value?.submitted_at) return 'Menunggu Review'
    if (currentStepData.value?.started_at) return 'Sedang Berjalan'
    if (currentStepData.value?.can_start) return 'Dapat Dimulai'
    return 'Terkunci'
}

const getStatusColor = () => {
    if (currentStepData.value?.completed_at) return 'text-green-600'
    if (currentStepData.value?.submitted_at) return 'text-blue-600'
    if (currentStepData.value?.started_at) return 'text-orange-600'
    if (currentStepData.value?.can_start) return 'text-primary'
    return 'text-gray-500'
}

const getSubmissionStatusIcon = () => {
    if (currentStepData.value?.completed_at) return 'heroicons:check-circle-20-solid'
    if (currentStepData.value?.submitted_at) return 'heroicons:clock-20-solid'
    return 'heroicons:exclamation-circle-20-solid'
}

const getSubmissionStatusColor = () => {
    if (currentStepData.value?.completed_at) return 'text-green-500'
    if (currentStepData.value?.submitted_at) return 'text-blue-500'
    return 'text-gray-400'
}

const getSubmissionStatusText = () => {
    if (currentStepData.value?.completed_at) return 'Submission Diterima'
    if (currentStepData.value?.submitted_at) return 'Menunggu Review'
    return 'Belum Submit'
}
</script>