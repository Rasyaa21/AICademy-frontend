<template>
    <!-- Modals -->
    <AlertModal
        v-model:is-open="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="alertModal.isOpen = false"
    />

    <ConfirmModal
        v-model:is-open="confirmModal.isOpen"
        :type="confirmModal.type"
        :title="confirmModal.title"
        :message="confirmModal.message"
        :confirm-text="confirmModal.confirmText"
        @confirm="confirmModal.onConfirm"
        @cancel="confirmModal.isOpen = false"
    />

    <CvCreateModal
        v-model:is-open="createCvModal.isOpen"
        @cv-created="handleCvCreated"
        @show-alert="showAlert"
    />

    <CvDetailModal
        v-model:is-open="cvDetailModal.isOpen"
        :cv-id="cvDetailModal.cvId"
        @show-alert="showAlert"
    />

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
        <div class="text-center">
            <div class="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
            <p class="text-gray-600">Memuat CV...</p>
        </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-4 justify-between lg:flex-row lg:items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Manajemen CV</h1>
                <p class="mt-1 text-gray-600">Kelola CV Anda dengan AI dan analisis ATS</p>
            </div>
            <div class="flex gap-3">
                <button
                    @click="previewCv"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
                    Pratinjau CV
                </button>
                <button
                    @click="openCreateCvModal"
                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                    Buat CV Baru
                </button>
            </div>
        </div>

        <!-- CV Preview -->
        <CvPreview :cv-preview="cvPreview" />

        <!-- CV List -->
        <CvList 
            :cv-list="cvList"
            @view-cv="viewCv"
            @analyze-cv="analyzeCv"
            @download-cv="downloadCv"
            @publish-cv="publishCv"
            @unpublish-cv="unpublishCv"
            @delete-cv="deleteCv"
            @create-cv="openCreateCvModal"
            @show-alert="handleShowAlert"
        />
    </div>
</template>

<script setup lang="ts">
// filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/pages/student/dashboard/cv.vue
import { ref } from 'vue'
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import ConfirmModal from '~/components/modal/basic-modal/ConfirmModal.vue'
import CvCreateModal from '~/components/modal/student/CvCreateModal.vue'
import CvDetailModal from '~/components/modal/student/CvDetailModal.vue'
import CvList from '~/components/dashboard-student/cv/CvList.vue'
import CvPreview from '~/components/dashboard-student/cv/CvPreview.vue'
import type { AlertType } from '~/components/modal/basic-modal/AlertModal.vue'
import type { ConfirmType } from '~/components/modal/basic-modal/ConfirmModal.vue'

definePageMeta({
    layout: 'dashboard-layout-student-dashboard-layout',
    ssr: false
})

const config = useRuntimeConfig()

// Modal States
const alertModal = ref({ isOpen: false, type: 'info' as AlertType, title: '', message: '' })
const confirmModal = ref({ 
    isOpen: false, 
    type: 'danger' as ConfirmType, 
    title: '', 
    message: '', 
    confirmText: 'Hapus',
    onConfirm: () => {} 
})
const createCvModal = ref({ isOpen: false })
const cvDetailModal = ref({ isOpen: false, cvId: null as string | null })

// Data states
const cvPreview = ref(null)
const cvList = ref([])

// Fetch CV List
const { data: cvListData, pending, refresh } = await useLazyAsyncData(
    'cv-list',
    async () => {
        return await $fetch('/student/cv/', {
            baseURL: config.public.apiBase,
            credentials: 'include',
            method: 'GET'
        })
    },
    {
        transform: (data: any) => (data?.success && data?.data ? data.data : []),
        default: () => [],
        server: false
    }
)

// Watch for data changes
watchEffect(() => {
    if (cvListData.value) {
        cvList.value = cvListData.value
    }
})

// CV Actions
const previewCv = async () => {
    try {
        const response = await $fetch('/student/cv/preview', {
            baseURL: config.public.apiBase,
            credentials: 'include',
            method: 'GET'
        })
        
        if (response?.success) {
            cvPreview.value = response.data
            showAlert('success', 'Berhasil!', 'Pratinjau CV berhasil dimuat.')
        }
    } catch (error: any) {
        console.error('Error previewing CV:', error)
        showAlert('error', 'Gagal!', error?.data?.message || 'Gagal memuat pratinjau CV.')
    }
}

const openCreateCvModal = () => {
    createCvModal.value.isOpen = true
}

const handleCvCreated = async () => {
    await refresh()
}

const viewCv = (cv: any) => {
    cvDetailModal.value = {
        isOpen: true,
        cvId: cv.id
    }
}

const analyzeCv = async (cv: any) => {
    try {
        const response = await $fetch(`/student/cv/${cv.id}/analyze`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            method: 'GET'
        })
        
        if (response?.success) {
            const atsScore = response.data
            showAlert('info', 'Analisis ATS', 
                `Skor ATS: ${atsScore.overall}/100\n` +
                `Keywords: ${atsScore.keywords}/100\n` +
                `Format: ${atsScore.format}/100\n` +
                `Struktur: ${atsScore.structure}/100`
            )
        }
    } catch (error: any) {
        console.error('Error analyzing CV:', error)
        showAlert('error', 'Gagal!', error?.data?.message || 'Gagal menganalisis CV.')
    }
}

const downloadCv = async (cv: any) => {
    try {
        const response = await fetch(`${config.public.apiBase}/student/cv/${cv.id}/download`, {
            credentials: 'include',
            method: 'GET'
        })
        
        if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${cv.title}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            
            showAlert('success', 'Berhasil!', 'CV berhasil diunduh.')
        } else {
            throw new Error('Failed to download CV')
        }
    } catch (error: any) {
        console.error('Error downloading CV:', error)
        showAlert('error', 'Gagal!', 'Gagal mengunduh CV.')
    }
}

const publishCv = (cv: any) => {
    confirmModal.value = {
        isOpen: true,
        type: 'info',
        title: 'Publikasikan CV',
        message: `Apakah Anda yakin ingin mempublikasikan CV "${cv.title}"?`,
        confirmText: 'Publikasikan',
        onConfirm: async () => {
            try {
                const response = await $fetch(`/student/cv/${cv.id}/publish`, {
                    baseURL: config.public.apiBase,
                    credentials: 'include',
                    method: 'PUT'
                })
                
                if (response?.success) {
                    showAlert('success', 'Berhasil!', 'CV berhasil dipublikasikan.')
                    await refresh()
                }
            } catch (error: any) {
                console.error('Error publishing CV:', error)
                showAlert('error', 'Gagal!', error?.data?.message || 'Gagal mempublikasikan CV.')
            }
        }
    }
}

const unpublishCv = (cv: any) => {
    confirmModal.value = {
        isOpen: true,
        type: 'warning',
        title: 'Batalkan Publikasi CV',
        message: `Apakah Anda yakin ingin membatalkan publikasi CV "${cv.title}"?`,
        confirmText: 'Batalkan Publikasi',
        onConfirm: async () => {
            try {
                const response = await $fetch(`/student/cv/${cv.id}/unpublish`, {
                    baseURL: config.public.apiBase,
                    credentials: 'include',
                    method: 'PUT'
                })
                
                if (response?.success) {
                    showAlert('success', 'Berhasil!', 'Publikasi CV berhasil dibatalkan.')
                    await refresh()
                }
            } catch (error: any) {
                console.error('Error unpublishing CV:', error)
                showAlert('error', 'Gagal!', error?.data?.message || 'Gagal membatalkan publikasi CV.')
            }
        }
    }
}

const deleteCv = (cv: any) => {
    confirmModal.value = {
        isOpen: true,
        type: 'danger',
        title: 'Hapus CV',
        message: `Apakah Anda yakin ingin menghapus CV "${cv.title}"? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: 'Hapus CV',
        onConfirm: async () => {
            try {
                const response = await $fetch(`/student/cv/${cv.id}`, {
                    baseURL: config.public.apiBase,
                    credentials: 'include',
                    method: 'DELETE'
                })
                
                if (response?.success) {
                    showAlert('success', 'Berhasil!', 'CV berhasil dihapus.')
                    await refresh()
                }
            } catch (error: any) {
                console.error('Error deleting CV:', error)
                showAlert('error', 'Gagal!', error?.data?.message || 'Gagal menghapus CV.')
            }
        }
    }
}

// Add show alert handler for components
const handleShowAlert = (type: any, title: string, message: string) => {
    showAlert(type, title, message)
}

const showAlert = (type: AlertType, title: string, message: string) => {
    alertModal.value = { isOpen: true, type, title, message }
}
</script>