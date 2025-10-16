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

    <!-- CV List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Daftar CV Anda</h3>
            <p class="text-gray-600 text-sm mt-1">{{ cvList?.length || 0 }} CV tersimpan</p>
        </div>

        <div v-if="cvList?.length" class="divide-y divide-gray-200">
            <div
                v-for="cv in cvList"
                :key="cv.id"
                class="p-6 hover:bg-gray-50 transition-colors"
            >
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h4 class="font-semibold text-gray-900">{{ cv.title }}</h4>
                            <span
                                :class="[
                                    'px-2 py-1 text-xs font-medium rounded-full',
                                    cv.status === 'published' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                ]"
                            >
                                {{ cv.status === 'published' ? 'Dipublikasi' : 'Draft' }}
                            </span>
                            <span
                                v-if="cv.is_public"
                                class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700"
                            >
                                Publik
                            </span>
                        </div>
                        <div class="flex items-center gap-4 text-sm text-gray-500">
                            <span>Dibuat: {{ formatDate(cv.created_at) }}</span>
                            <span v-if="cv.published_at">Dipublikasi: {{ formatDate(cv.published_at) }}</span>
                            <span v-if="cv.has_pdf" class="flex items-center gap-1">
                                <Icon name="heroicons:document-arrow-down-20-solid" class="w-4 h-4" />
                                PDF Tersedia
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <!-- PDF Preview Button (if PDF available) -->
                        <button
                            v-if="cv.pdf_link"
                            @click="openCVPDFViewer(cv)"
                            class="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                            title="Preview PDF"
                        >
                            <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
                            PDF
                        </button>
                        
                        <!-- View CV Details -->
                        <button
                            @click="$emit('view-cv', cv)"
                            class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Lihat Detail CV"
                        >
                            <Icon name="heroicons:document-text-20-solid" class="w-5 h-5" />
                        </button>
                        
                        <button
                            @click="$emit('analyze-cv', cv)"
                            class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                            title="Analisis ATS"
                        >
                            <Icon name="heroicons:chart-bar-20-solid" class="w-5 h-5" />
                        </button>
                        
                        <!-- PDF Download (if available) -->
                        <button
                            v-if="cv.pdf_link"
                            @click="downloadCVPDF(cv)"
                            class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Download PDF"
                        >
                            <Icon name="heroicons:arrow-down-tray-20-solid" class="w-5 h-5" />
                        </button>
                        
                        <!-- Fallback Download Button -->
                        <button
                            v-else
                            @click="$emit('download-cv', cv)"
                            class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Download CV"
                        >
                            <Icon name="heroicons:arrow-down-tray-20-solid" class="w-5 h-5" />
                        </button>
                        
                        <button
                            @click="cv.status === 'published' ? $emit('unpublish-cv', cv) : $emit('publish-cv', cv)"
                            class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                            :title="cv.status === 'published' ? 'Batalkan Publikasi' : 'Publikasikan'"
                        >
                            <Icon
                                :name="cv.status === 'published' ? 'heroicons:eye-slash-20-solid' : 'heroicons:globe-alt-20-solid'"
                                class="w-5 h-5"
                            />
                        </button>
                        <button
                            @click="$emit('delete-cv', cv)"
                            class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Hapus CV"
                        >
                            <Icon name="heroicons:trash-20-solid" class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <Icon name="heroicons:document-text-20-solid" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada CV</h3>
            <p class="text-gray-500 mb-4">Buat CV pertama Anda dengan bantuan AI</p>
            <button
                @click="$emit('create-cv')"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
                Buat CV Pertama
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
// filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/dashboard-student/cv/CvList.vue
import { ref } from 'vue'
import PDFViewer from '~/components/shared/PDFViewer.vue'

interface Props {
    cvList: any[]
}

defineProps<Props>()

const emit = defineEmits<{
    'view-cv': [cv: any]
    'analyze-cv': [cv: any]
    'download-cv': [cv: any]
    'publish-cv': [cv: any]
    'unpublish-cv': [cv: any]
    'delete-cv': [cv: any]
    'create-cv': []
    'show-alert': [type: string, title: string, message: string]
}>()

// PDF Viewer state
const pdfViewerOpen = ref(false)
const pdfViewerUrl = ref<string | null>(null)
const pdfViewerTitle = ref('')
const pdfViewerSubtitle = ref('')
const pdfViewerFileName = ref('')

// PDF Functions
const openCVPDFViewer = (cv: any) => {
    if (cv.pdf_link) {
        pdfViewerUrl.value = cv.pdf_link
        pdfViewerTitle.value = cv.title || 'CV Document'
        pdfViewerSubtitle.value = `Status: ${cv.status === 'published' ? 'Published' : 'Draft'} • Created: ${formatDate(cv.created_at)}`
        pdfViewerFileName.value = `${cv.title || 'CV'}.pdf`
        pdfViewerOpen.value = true
    }
}

const downloadCVPDF = (cv: any) => {
    if (cv.pdf_link) {
        const link = document.createElement('a')
        link.href = cv.pdf_link
        link.download = `${cv.title || 'CV'}.pdf`
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        emit('show-alert', 'success', 'Success!', 'CV PDF downloaded successfully.')
    }
}

// PDF Viewer event handlers
const handlePDFView = (url: string) => {
    console.log('PDF viewed in viewer:', url)
}

const handlePDFDownload = (url: string) => {
    console.log('PDF downloaded from viewer:', url)
    emit('show-alert', 'success', 'Success!', 'CV PDF downloaded successfully.')
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } catch {
        return dateString
    }
}
</script>