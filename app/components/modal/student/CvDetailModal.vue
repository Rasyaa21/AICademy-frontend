<template>
    <!-- PDF Viewer -->
    <PDFViewer
        v-model:is-open="pdfViewerOpen"
        :file-url="pdfViewerUrl"
        :title="pdfViewerTitle"
        :subtitle="pdfViewerSubtitle"
        :file-name="pdfViewerFileName"
        @download="handlePDFDownload"
        @view="handlePDFView"
    />

    <!-- CV Detail Modal -->
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
            class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            @click="closeModal"
        />
        
        <!-- Modal Container with proper sizing -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[95vh] flex flex-col">
            <!-- Fixed Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
                <div class="flex items-center gap-4">
                    <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                        <Icon name="heroicons:document-text-20-solid" class="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">{{ cvDetail?.title || 'CV Detail' }}</h2>
                        <div class="flex items-center gap-3 mt-1">
                            <span class="text-sm text-gray-500">Status: </span>
                            <span 
                                :class="[
                                    'px-2 py-1 text-xs font-medium rounded-full',
                                    cvDetail?.status === 'published' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                ]"
                            >
                                {{ cvDetail?.status === 'published' ? 'Published' : 'Draft' }}
                            </span>
                            <span v-if="cvDetail?.is_public" class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                Public
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                    <!-- ATS Score -->
                    <div v-if="cvDetail?.ats_score" class="text-center mr-4">
                        <div class="text-2xl font-bold text-green-600">{{ cvDetail.ats_score.overall }}/100</div>
                        <div class="text-xs text-gray-500">ATS Score</div>
                    </div>
                    
                    <!-- PDF Actions -->
                    <div v-if="cvDetail?.pdf_link" class="flex items-center gap-2 mr-4">
                        <!-- Preview PDF Button -->
                        <button
                            @click="openPDFViewer"
                            class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            title="Preview PDF"
                        >
                            <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
                            Preview PDF
                        </button>
                        
                        <!-- Quick Actions -->
                        <button
                            @click="openPDFInNewTab"
                            class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Open PDF in New Tab"
                        >
                            <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-5 h-5" />
                        </button>
                        
                        <button
                            @click="downloadPDF"
                            class="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download PDF"
                        >
                            <Icon name="heroicons:arrow-down-tray-20-solid" class="w-5 h-5" />
                        </button>
                    </div>
                    
                    <button 
                        @click="closeModal"
                        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Close"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Scrollable Content Area -->
            <div class="flex-1 overflow-y-auto min-h-0">
                <div v-if="loading" class="flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    <span class="ml-3 text-gray-600">Memuat Detail CV...</span>
                </div>

                <div v-else-if="error" class="text-center py-12">
                    <div class="text-red-500 mb-4">
                        <Icon name="heroicons:exclamation-triangle-20-solid" class="mx-auto w-12 h-12" />
                    </div>
                    <p class="text-gray-600 mb-4">{{ error }}</p>
                    <button 
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        @click="fetchCvDetail"
                    >
                        Ulangi
                    </button>
                </div>

                <div v-else-if="cvDetail" class="p-6 space-y-6">
                    <!-- PDF Preview Section -->
                    <div v-if="cvDetail.pdf_link" class="bg-red-50 rounded-xl p-6 border border-red-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon name="heroicons:document-arrow-down-20-solid" class="w-5 h-5 text-red-600" />
                            CV PDF Document
                        </h3>
                        
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-white rounded-lg border border-red-200 gap-4">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon name="heroicons:document-text-20-solid" class="w-6 h-6 text-red-600" />
                                </div>
                                <div class="min-w-0">
                                    <p class="font-medium text-gray-900 truncate">{{ cvDetail.title }}.pdf</p>
                                    <div class="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                        <span>PDF Format</span>
                                        <span>•</span>
                                        <span>Generated: {{ formatDate(cvDetail.generated_at) }}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- PDF Action Buttons -->
                            <div class="flex items-center gap-2 flex-shrink-0">
                                <button
                                    @click="openPDFViewer"
                                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
                                    Preview
                                </button>
                                
                                <button
                                    @click="openPDFInNewTab"
                                    class="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-4 h-4" />
                                    Buka
                                </button>
                                
                                <button
                                    @click="downloadPDF"
                                    class="px-4 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <Icon name="heroicons:arrow-down-tray-20-solid" class="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Personal Info Section -->
                    <div class="bg-blue-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon name="heroicons:user-20-solid" class="w-5 h-5 text-blue-600" />
                            Informasi Personal
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-600">Nama Lengkap</p>
                                <p class="font-medium text-gray-900 break-words">{{ cvDetail.content?.personal_info?.full_name || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Email</p>
                                <p class="font-medium text-gray-900 break-all">{{ cvDetail.content?.personal_info?.email || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">No Telp</p>
                                <p class="font-medium text-gray-900">{{ cvDetail.content?.personal_info?.phone || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Lokasi</p>
                                <p class="font-medium text-gray-900 break-words">{{ cvDetail.content?.personal_info?.location || '-' }}</p>
                            </div>
                        </div>
                        
                        <div v-if="cvDetail.content?.summary" class="mt-4">
                            <p class="text-sm text-gray-600 mb-2">Kesimpulan</p>
                            <p class="text-gray-900 leading-relaxed break-words">{{ cvDetail.content.summary }}</p>
                        </div>
                    </div>

                    <!-- Education Section -->
                    <div v-if="cvDetail.content?.education" class="bg-green-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon name="heroicons:academic-cap-20-solid" class="w-5 h-5 text-green-600" />
                            Education
                        </h3>
                        <div class="space-y-2">
                            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2">
                                <div class="min-w-0">
                                    <p class="font-medium text-gray-900 break-words">{{ cvDetail.content.education.degree }} in {{ cvDetail.content.education.major }}</p>
                                    <p class="text-gray-600 break-words">{{ cvDetail.content.education.school }}</p>
                                </div>
                                <span class="text-sm text-gray-500 flex-shrink-0">{{ cvDetail.content.education.start_year }} - {{ cvDetail.content.education.end_year }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Experience Section -->
                    <div v-if="cvDetail.content?.experiences?.length" class="bg-purple-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon name="heroicons:briefcase-20-solid" class="w-5 h-5 text-purple-600" />
                            Pengalaman Kerja
                        </h3>
                        <div class="space-y-4">
                            <div 
                                v-for="(exp, index) in cvDetail.content.experiences" 
                                :key="exp.id || index"
                                class="border-l-4 border-purple-200 pl-4"
                            >
                                <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2 mb-2">
                                    <div class="min-w-0">
                                        <h4 class="font-medium text-gray-900 break-words">{{ exp.position }}</h4>
                                        <p class="text-purple-600 font-medium break-words">{{ exp.company_name }}</p>
                                        <p class="text-sm text-gray-600 break-words">{{ exp.location }} • {{ exp.employment_type }}</p>
                                    </div>
                                    <span class="text-sm text-gray-500 flex-shrink-0">
                                        {{ formatDate(exp.start_date) }} - {{ exp.is_current ? 'Present' : formatDate(exp.end_date) }}
                                    </span>
                                </div>
                                <p class="text-gray-700 text-sm leading-relaxed break-words">{{ exp.description }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Projects Section -->
                    <div v-if="cvDetail.content?.projects?.length" class="bg-orange-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon name="heroicons:folder-20-solid" class="w-5 h-5 text-orange-600" />
                            Projects
                        </h3>
                        <div class="space-y-4">
                            <div 
                                v-for="(project, index) in cvDetail.content.projects" 
                                :key="project.id || index"
                                class="border border-orange-200 rounded-lg p-4"
                            >
                                <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2 mb-2">
                                    <div class="flex-1 min-w-0">
                                        <h4 class="font-medium text-gray-900 break-words">{{ project.name }}</h4>
                                        <p class="text-sm text-orange-600 font-medium break-words">{{ project.role }}</p>
                                    </div>
                                    <div class="text-sm text-gray-500 flex-shrink-0">
                                        {{ formatDate(project.start_date) }} - {{ formatDate(project.end_date) }}
                                    </div>
                                </div>
                                <p class="text-gray-700 text-sm mb-2 leading-relaxed break-words">{{ project.description }}</p>
                                
                                <!-- Tech Stack -->
                                <div v-if="project.technologies?.length" class="flex flex-wrap gap-2 mb-2">
                                    <span 
                                        v-for="tech in project.technologies" 
                                        :key="tech"
                                        class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full break-all"
                                    >
                                        {{ tech }}
                                    </span>
                                </div>
                                
                                <!-- Project URL -->
                                <div v-if="project.url" class="mt-2">
                                    <a 
                                        :href="project.url" 
                                        target="_blank" 
                                        class="text-orange-600 hover:text-orange-800 text-sm flex items-center gap-1 break-all"
                                    >
                                        <Icon name="heroicons:link-20-solid" class="w-4 h-4 flex-shrink-0" />
                                        <span class="truncate">Lihat Project</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Skills Section -->
                    <div v-if="cvDetail.content?.skills?.length" class="bg-indigo-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon name="heroicons:cog-6-tooth-20-solid" class="w-5 h-5 text-indigo-600" />
                            Skills
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div 
                                v-for="(skill, index) in cvDetail.content.skills" 
                                :key="index"
                                class="flex justify-between items-center p-3 bg-white rounded-lg min-w-0"
                            >
                                <span class="font-medium text-gray-900 truncate mr-2">{{ skill.name }}</span>
                                <span class="text-sm text-indigo-600 font-medium flex-shrink-0">{{ skill.level }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Certifications Section -->
                    <div v-if="cvDetail.content?.certifications?.length" class="bg-yellow-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon name="heroicons:trophy-20-solid" class="w-5 h-5 text-yellow-600" />
                            Sertifikasi
                        </h3>
                        <div class="space-y-3">
                            <div 
                                v-for="(cert, index) in cvDetail.content.certifications" 
                                :key="cert.id || index"
                                class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 p-3 bg-white rounded-lg"
                            >
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-medium text-gray-900 break-words">{{ cert.name }}</h4>
                                    <p class="text-sm text-gray-600 break-words">{{ cert.issuing_organization }}</p>
                                    <p class="text-xs text-gray-500 mt-1">
                                        Issued: {{ formatDate(cert.issue_date) }}
                                        {{ cert.expiration_date ? ` • Expires: ${formatDate(cert.expiration_date)}` : '' }}
                                    </p>
                                </div>
                                <div v-if="cert.credential_url" class="flex-shrink-0">
                                    <a 
                                        :href="cert.credential_url" 
                                        target="_blank" 
                                        class="text-yellow-600 hover:text-yellow-800"
                                    >
                                        <Icon name="heroicons:link-20-solid" class="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Languages Section -->
                    <div v-if="cvDetail.content?.languages?.length" class="bg-teal-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon name="heroicons:language-20-solid" class="w-5 h-5 text-teal-600" />
                            Bahasa
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                                v-for="(lang, index) in cvDetail.content.languages" 
                                :key="index"
                                class="flex justify-between items-center p-3 bg-white rounded-lg min-w-0"
                            >
                                <span class="font-medium text-gray-900 truncate mr-2">{{ lang.name }}</span>
                                <div class="flex items-center gap-2 flex-shrink-0">
                                    <span class="text-sm text-teal-600 font-medium">{{ lang.level }}</span>
                                    <Icon 
                                        v-if="lang.certified" 
                                        name="heroicons:check-badge-20-solid" 
                                        class="w-4 h-4 text-green-500" 
                                        title="Certified"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ATS Analysis Section -->
                    <div v-if="cvDetail.ats_score" class="bg-gray-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon name="heroicons:chart-bar-20-solid" class="w-5 h-5 text-gray-600" />
                            Analisis ATS
                        </h3>
                        
                        <!-- Score Breakdown -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div class="text-center p-3 bg-white rounded-lg">
                                <div class="text-2xl font-bold text-green-600">{{ cvDetail.ats_score.overall }}</div>
                                <div class="text-sm text-gray-600">Total</div>
                            </div>
                            <div class="text-center p-3 bg-white rounded-lg">
                                <div class="text-2xl font-bold text-blue-600">{{ cvDetail.ats_score.keywords }}</div>
                                <div class="text-sm text-gray-600">Kata Kunci</div>
                            </div>
                            <div class="text-center p-3 bg-white rounded-lg">
                                <div class="text-2xl font-bold text-purple-600">{{ cvDetail.ats_score.format }}</div>
                                <div class="text-sm text-gray-600">Format</div>
                            </div>
                            <div class="text-center p-3 bg-white rounded-lg">
                                <div class="text-2xl font-bold text-indigo-600">{{ cvDetail.ats_score.structure }}</div>
                                <div class="text-sm text-gray-600">Struktur</div>
                            </div>
                        </div>

                        <!-- Suggestions -->
                        <div v-if="cvDetail.ats_score.suggestions?.length" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 class="font-medium text-yellow-800 mb-2">Saran Perbaikan:</h4>
                            <ul class="space-y-1">
                                <li 
                                    v-for="suggestion in cvDetail.ats_score.suggestions" 
                                    :key="suggestion"
                                    class="text-sm text-yellow-700 flex items-start gap-2"
                                >
                                    <Icon name="heroicons:light-bulb-20-solid" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span class="break-words">{{ suggestion }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Bottom Padding for Better Scrolling -->
                    <div class="h-4"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/modal/student/CvDetailModal.vue
import { ref, watch } from 'vue'
import PDFViewer from '~/components/shared/PDFViewer.vue'

interface Props {
    isOpen: boolean
    cvId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-alert': [type: string, title: string, message: string]
}>()

const config = useRuntimeConfig()

// State
const cvDetail = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// PDF Viewer state
const pdfViewerOpen = ref(false)
const pdfViewerUrl = ref<string | null>(null)
const pdfViewerTitle = ref('')
const pdfViewerSubtitle = ref('')
const pdfViewerFileName = ref('')

// Watch for modal open and CV ID changes
watch([() => props.isOpen, () => props.cvId], ([isOpen, cvId]) => {
    if (isOpen && cvId) {
        fetchCvDetail()
    } else {
        resetState()
    }
})

const fetchCvDetail = async () => {
    if (!props.cvId) return
    
    try {
        loading.value = true
        error.value = null
        
        const response = await $fetch(`/student/cv/${props.cvId}`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            method: 'GET'
        })
        
        if (response?.success) {
            cvDetail.value = response.data
        } else {
            throw new Error(response?.message || 'Failed to fetch CV details')
        }
    } catch (err: any) {
        console.error('Error fetching CV details:', err)
        error.value = err?.data?.message || err.message || 'Failed to load CV details'
        cvDetail.value = null
    } finally {
        loading.value = false
    }
}

// PDF Viewer functions
const openPDFViewer = () => {
    if (cvDetail.value?.pdf_link) {
        pdfViewerUrl.value = cvDetail.value.pdf_link
        pdfViewerTitle.value = cvDetail.value.title || 'CV Document'
        pdfViewerSubtitle.value = `Generated on ${formatDate(cvDetail.value.generated_at)}`
        pdfViewerFileName.value = `${cvDetail.value.title || 'CV'}.pdf`
        pdfViewerOpen.value = true
    }
}

const openPDFInNewTab = () => {
    if (cvDetail.value?.pdf_link) {
        window.open(cvDetail.value.pdf_link, '_blank', 'noopener,noreferrer')
    }
}

const downloadPDF = () => {
    if (cvDetail.value?.pdf_link) {
        const link = document.createElement('a')
        link.href = cvDetail.value.pdf_link
        link.download = `${cvDetail.value.title || 'CV'}.pdf`
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        emit('show-alert', 'success', 'Success!', 'CV PDF downloaded successfully.')
    }
}

// Legacy functions for backward compatibility
const viewPDF = openPDFInNewTab

// PDF Viewer event handlers
const handlePDFView = (url: string) => {
    console.log('PDF viewed in viewer:', url)
}

const handlePDFDownload = (url: string) => {
    console.log('PDF downloaded from viewer:', url)
    emit('show-alert', 'success', 'Success!', 'CV PDF downloaded successfully.')
}

const closeModal = () => {
    emit('update:isOpen', false)
}

const resetState = () => {
    cvDetail.value = null
    loading.value = false
    error.value = null
    pdfViewerOpen.value = false
    pdfViewerUrl.value = null
    pdfViewerTitle.value = ''
    pdfViewerSubtitle.value = ''
    pdfViewerFileName.value = ''
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } catch {
        return dateString
    }
}
</script>

<style scoped>
/* Custom scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Firefox scrollbar */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;
}
</style>