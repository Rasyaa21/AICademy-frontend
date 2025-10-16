<template>
    <!-- PDF Viewer Modal -->
    <div v-if="isOpen" class="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
            class="absolute inset-0 bg-black bg-opacity-90 transition-opacity"
            @click="closeViewer"
        />
        
        <!-- Modal -->
        <div class="relative bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                        <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">{{ title || 'PDF Viewer' }}</h3>
                        <p class="text-sm text-gray-500">{{ subtitle }}</p>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                    <!-- Download Button -->
                    <button
                        @click="downloadFile"
                        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Download PDF"
                    >
                        <Icon name="heroicons:arrow-down-tray-20-solid" class="w-5 h-5" />
                    </button>
                    
                    <!-- Open in New Tab -->
                    <button
                        @click="openInNewTab"
                        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Open in New Tab"
                    >
                        <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-5 h-5" />
                    </button>
                    
                    <!-- Fullscreen Toggle -->
                    <button
                        @click="toggleFullscreen"
                        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Toggle Fullscreen"
                    >
                        <Icon :name="isFullscreen ? 'heroicons:arrows-pointing-in-20-solid' : 'heroicons:arrows-pointing-out-20-solid'" class="w-5 h-5" />
                    </button>
                    
                    <!-- Close Button -->
                    <button 
                        @click="closeViewer"
                        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Close"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-24">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
                    <p class="text-gray-600">Loading PDF document...</p>
                    <p class="text-sm text-gray-500 mt-2">Please wait while we prepare your document</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="flex items-center justify-center py-24">
                <div class="text-center max-w-md">
                    <div class="text-red-500 mb-4">
                        <Icon name="heroicons:exclamation-triangle-20-solid" class="mx-auto w-16 h-16" />
                    </div>
                    <h4 class="text-lg font-semibold text-gray-900 mb-2">Cannot Load PDF</h4>
                    <p class="text-gray-600 mb-6">{{ error }}</p>
                    <div class="flex gap-3 justify-center">
                        <button
                            @click="retryLoad"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Icon name="heroicons:arrow-path-20-solid" class="w-4 h-4 inline mr-1" />
                            Retry
                        </button>
                        <button
                            @click="openInNewTab"
                            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-4 h-4 inline mr-1" />
                            Open in New Tab
                        </button>
                        <button
                            @click="downloadFile"
                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Icon name="heroicons:arrow-down-tray-20-solid" class="w-4 h-4 inline mr-1" />
                            Download
                        </button>
                    </div>
                </div>
            </div>

            <!-- PDF Viewer Content -->
            <div v-else class="relative bg-gray-100" :style="viewerHeight">
                <iframe
                    v-if="pdfViewerUrl"
                    :src="pdfViewerUrl"
                    class="w-full h-full border-0"
                    @load="handleLoad"
                    @error="handleError"
                    :title="`PDF Viewer - ${title}`"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/shared/PDFViewer.vue
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
    isOpen: boolean
    fileUrl: string | null
    title?: string
    subtitle?: string
    fileName?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'download': [url: string]
    'view': [url: string]
}>()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const isFullscreen = ref(false)

// PDF.js viewer URL
const PDF_VIEWER_BASE = 'https://mozilla.github.io/pdf.js/web/viewer.html'

// Computed properties
const pdfViewerUrl = computed(() => {
    if (!props.fileUrl) return null
    
    try {
        const encodedPdfUrl = encodeURIComponent(props.fileUrl)
        return `${PDF_VIEWER_BASE}?file=${encodedPdfUrl}`
    } catch (err) {
        console.error('Error encoding PDF URL:', err)
        return null
    }
})

const viewerHeight = computed(() => {
    const baseHeight = isFullscreen.value ? '100vh' : 'calc(95vh - 80px)'
    return { height: baseHeight }
})

// Watch for file changes
watch(() => props.fileUrl, (newUrl) => {
    if (newUrl && props.isOpen) {
        loadPDF()
    }
})

watch(() => props.isOpen, (isOpen) => {
    if (isOpen && props.fileUrl) {
        loadPDF()
    } else {
        resetState()
    }
})

// Methods
const loadPDF = async () => {
    if (!props.fileUrl) return
    
    try {
        loading.value = true
        error.value = null
        
        // Validate if the URL is accessible
        const response = await fetch(props.fileUrl, { method: 'HEAD' })
        if (!response.ok) {
            throw new Error(`File not accessible (${response.status})`)
        }
        
        // Check if it's actually a PDF
        const contentType = response.headers.get('content-type')
        if (contentType && !contentType.includes('pdf')) {
            console.warn('File might not be a PDF:', contentType)
        }
        
        loading.value = false
        emit('view', props.fileUrl)
    } catch (err: any) {
        console.error('Error loading PDF:', err)
        error.value = err.message || 'Failed to load PDF document'
        loading.value = false
    }
}

const handleLoad = () => {
    loading.value = false
    error.value = null
}

const handleError = () => {
    loading.value = false
    error.value = 'Failed to load PDF document. The file might be corrupted or not accessible.'
}

const retryLoad = () => {
    loadPDF()
}

const downloadFile = () => {
    if (!props.fileUrl) return
    
    const link = document.createElement('a')
    link.href = props.fileUrl
    link.download = props.fileName || 'document.pdf'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    
    // Add the link to DOM, click it, then remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    emit('download', props.fileUrl)
}

const openInNewTab = () => {
    if (props.fileUrl) {
        // Open the direct PDF URL in new tab
        window.open(props.fileUrl, '_blank', 'noopener,noreferrer')
        emit('view', props.fileUrl)
    }
}

const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
}

const closeViewer = () => {
    emit('update:isOpen', false)
}

const resetState = () => {
    loading.value = false
    error.value = null
    isFullscreen.value = false
}

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
    if (!props.isOpen) return
    
    switch (event.key) {
        case 'Escape':
            closeViewer()
            break
        case 'F11':
            event.preventDefault()
            toggleFullscreen()
            break
        case 'd':
        case 'D':
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault()
                downloadFile()
            }
            break
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
})
</script>