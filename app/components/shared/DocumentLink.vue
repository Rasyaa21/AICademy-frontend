<template>
    <PDFViewer
        v-model:is-open="pdfViewerOpen"
        :file-url="fileUrl"
        :title="title"
        :subtitle="subtitle"
        :file-name="fileName"
        @download="handleDownload"
        @view="handleView"
    />

    <div class="flex items-center gap-2">
        <!-- Preview PDF Button -->
        <button
            v-if="showPreview && isPDF"
            @click="openPDFViewer"
            class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
        >
            <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
            {{ previewText }}
        </button>

        <!-- Direct Link Button -->
        <a 
            :href="fileUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 rounded-lg transition-colors"
            :class="linkColorClass"
            @click="handleDirectLink"
        >
            <Icon :name="linkIcon" class="w-4 h-4" />
            {{ linkText }}
        </a>

        <!-- Download Button -->
        <button
            v-if="showDownload"
            @click="downloadFile"
            class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
        >
            <Icon name="heroicons:arrow-down-tray-20-solid" class="w-4 h-4" />
            Download
        </button>
    </div>
</template>

<script setup lang="ts">
// filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/shared/DocumentLink.vue
import { ref, computed } from 'vue'
import PDFViewer from './PDFViewer.vue'

interface Props {
    fileUrl: string | null
    title?: string
    subtitle?: string
    fileName?: string
    linkText?: string
    previewText?: string
    showPreview?: boolean
    showDownload?: boolean
    type?: 'cv' | 'document' | 'github' | 'live'
}

const props = withDefaults(defineProps<Props>(), {
    linkText: 'View',
    previewText: 'Preview',
    showPreview: true,
    showDownload: true,
    type: 'document'
})

const emit = defineEmits<{
    'download': [url: string]
    'view': [url: string]
}>()

const pdfViewerOpen = ref(false)

// Check if file is PDF
const isPDF = computed(() => {
    if (!props.fileUrl) return false
    return props.fileUrl.toLowerCase().includes('.pdf') || 
           props.fileUrl.toLowerCase().includes('pdf') ||
           props.type === 'cv' || 
           props.type === 'document'
})

const linkIcon = computed(() => {
    switch (props.type) {
        case 'cv':
            return 'heroicons:document-text-20-solid'
        case 'github':
            return 'heroicons:code-bracket-20-solid'
        case 'live':
            return 'heroicons:globe-alt-20-solid'
        case 'document':
            return 'heroicons:document-20-solid'
        default:
            return 'heroicons:document-20-solid'
    }
})

const linkColorClass = computed(() => {
    switch (props.type) {
        case 'cv':
            return 'text-green-600 hover:text-green-800'
        case 'github':
            return 'text-blue-600 hover:text-blue-800'
        case 'live':
            return 'text-purple-600 hover:text-purple-800'
        case 'document':
            return 'text-orange-600 hover:text-orange-800'
        default:
            return 'text-gray-600 hover:text-gray-800'
    }
})

const openPDFViewer = () => {
    if (props.fileUrl && isPDF.value) {
        pdfViewerOpen.value = true
    }
}

const handleDirectLink = () => {
    if (props.fileUrl) {
        emit('view', props.fileUrl)
    }
}

const downloadFile = () => {
    if (!props.fileUrl) return
    
    const link = document.createElement('a')
    link.href = props.fileUrl
    link.download = props.fileName || 'document'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    emit('download', props.fileUrl)
}

const handleDownload = (url: string) => {
    emit('download', url)
}

const handleView = (url: string) => {
    emit('view', url)
}
</script>