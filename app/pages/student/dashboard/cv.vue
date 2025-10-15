<template>
  <!-- Modal Peringatan -->
  <AlertModal
    v-model:is-open="alertModal.isOpen"
    :type="alertModal.type"
    :title="alertModal.title"
    :message="alertModal.message"
    @ok="alertModal.isOpen = false"
  />

  <!-- Modal Konfirmasi -->
  <ConfirmModal
    v-model:is-open="confirmModal.isOpen"
    :type="confirmModal.type"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :confirm-text="confirmModal.confirmText"
    @confirm="confirmModal.onConfirm"
    @cancel="confirmModal.isOpen = false"
  />

  <!-- Modal Buat CV -->
  <div
    v-if="createCvModal.isOpen"
    class="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm"
  >
    <div class="mx-4 w-full max-w-md bg-white rounded-xl shadow-xl">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Buat CV Baru</h3>
          <button
            @click="createCvModal.isOpen = false"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="createCvModal.errorMessage" class="p-4 m-6 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ createCvModal.errorMessage }}</p>
      </div>

      <form class="p-6 space-y-4" @submit.prevent="generateCv">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Judul CV</label>
          <input
            v-model="createCvModal.title"
            type="text"
            placeholder="Contoh: Software Developer CV - 2025"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="createCvModal.isOpen = false"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="createCvModal.isSubmitting"
            class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Icon
              v-if="createCvModal.isSubmitting"
              name="heroicons:arrow-path-20-solid"
              class="w-4 h-4 animate-spin"
            />
            {{ createCvModal.isSubmitting ? 'Membuat...' : 'Buat CV' }}
          </button>
        </div>
      </form>
    </div>
  </div>

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

    <!-- CV Preview Card (jika ada preview) -->
    <div v-if="cvPreview" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-blue-900 flex items-center gap-2">
          <Icon name="heroicons:document-text-20-solid" class="w-5 h-5" />
          Pratinjau CV Anda
        </h3>
        <div class="flex items-center gap-2">
          <span class="text-sm text-blue-600">ATS Score:</span>
          <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
            {{ cvPreview.ats_score?.overall || 0 }}/100
          </span>
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Nama:</strong> {{ cvPreview.content?.personal_info?.full_name || '-' }}</p>
          <p><strong>Email:</strong> {{ cvPreview.content?.personal_info?.email || '-' }}</p>
          <p><strong>Telepon:</strong> {{ cvPreview.content?.personal_info?.phone || '-' }}</p>
        </div>
        <div>
          <p><strong>Proyek:</strong> {{ cvPreview.content?.projects?.length || 0 }} proyek</p>
          <p><strong>Sertifikat:</strong> {{ cvPreview.content?.certifications?.length || 0 }} sertifikat</p>
          <p><strong>Keahlian:</strong> {{ cvPreview.content?.skills?.length || 0 }} keahlian</p>
        </div>
      </div>

      <div v-if="cvPreview.ats_score?.suggestions?.length" class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 class="text-sm font-medium text-yellow-800 mb-2">Saran Perbaikan:</h4>
        <ul class="text-sm text-yellow-700 space-y-1">
          <li v-for="suggestion in cvPreview.ats_score.suggestions" :key="suggestion" class="flex items-start gap-2">
            <Icon name="heroicons:light-bulb-20-solid" class="w-4 h-4 mt-0.5 flex-shrink-0" />
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>

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
              <button
                @click="viewCv(cv)"
                class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Lihat CV"
              >
                <Icon name="heroicons:eye-20-solid" class="w-5 h-5" />
              </button>
              <button
                @click="analyzeCv(cv)"
                class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                title="Analisis ATS"
              >
                <Icon name="heroicons:chart-bar-20-solid" class="w-5 h-5" />
              </button>
              <button
                @click="downloadCv(cv)"
                class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                title="Download PDF"
              >
                <Icon name="heroicons:arrow-down-tray-20-solid" class="w-5 h-5" />
              </button>
              <button
                @click="cv.status === 'published' ? unpublishCv(cv) : publishCv(cv)"
                class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                :title="cv.status === 'published' ? 'Batalkan Publikasi' : 'Publikasikan'"
              >
                <Icon
                  :name="cv.status === 'published' ? 'heroicons:eye-slash-20-solid' : 'heroicons:globe-alt-20-solid'"
                  class="w-5 h-5"
                />
              </button>
              <button
                @click="deleteCv(cv)"
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
          @click="openCreateCvModal"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Buat CV Pertama
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import ConfirmModal from '~/components/modal/basic-modal/ConfirmModal.vue'
import type { AlertType } from '~/components/modal/basic-modal/AlertModal.vue'
import type { ConfirmType } from '~/components/modal/basic-modal/ConfirmModal.vue'

definePageMeta({
  layout: 'dashboard-layout-student-dashboard-layout',
  ssr: false // Disable SSR
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

const createCvModal = ref({
  isOpen: false,
  title: '',
  isSubmitting: false,
  errorMessage: ''
})

// Data states
const cvPreview = ref(null)
const cvList = ref([])

// Fetch CV List dengan lazy loading
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

/* ======================= CV Actions ======================= */

// Preview CV
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

// Generate new CV
const openCreateCvModal = () => {
  createCvModal.value = {
    isOpen: true,
    title: '',
    isSubmitting: false,
    errorMessage: ''
  }
}

const generateCv = async () => {
  if (createCvModal.value.isSubmitting) return

  try {
    createCvModal.value.isSubmitting = true
    createCvModal.value.errorMessage = ''

    const response = await $fetch('/student/cv/generate', {
      baseURL: config.public.apiBase,
      credentials: 'include',
      method: 'POST',
      body: {
        title: createCvModal.value.title
      }
    })

    if (response?.success) {
      showAlert('success', 'Berhasil!', 'CV berhasil dibuat.')
      createCvModal.value.isOpen = false
      await refresh()
    }
  } catch (error: any) {
    console.error('Error generating CV:', error)
    createCvModal.value.errorMessage = error?.data?.message || 'Gagal membuat CV. Silakan coba lagi.'
  } finally {
    createCvModal.value.isSubmitting = false
  }
}

// View CV details
const viewCv = async (cv: any) => {
  try {
    const response = await $fetch(`/student/cv/${cv.id}`, {
      baseURL: config.public.apiBase,
      credentials: 'include',
      method: 'GET'
    })
    
    if (response?.success) {
      // You can implement a detailed view modal here
      console.log('CV Details:', response.data)
      showAlert('info', 'Detail CV', `CV "${cv.title}" berhasil dimuat.`)
    }
  } catch (error: any) {
    console.error('Error viewing CV:', error)
    showAlert('error', 'Gagal!', error?.data?.message || 'Gagal memuat detail CV.')
  }
}

// Analyze CV for ATS
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

// Download CV as PDF
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

// Publish CV
const publishCv = async (cv: any) => {
  confirmModal.value = {
    isOpen: true,
    type: 'info',
    title: 'Publikasikan CV',
    message: `Apakah Anda yakin ingin mempublikasikan CV "${cv.title}"? CV yang dipublikasi akan dapat diakses oleh publik.`,
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

// Unpublish CV
const unpublishCv = async (cv: any) => {
  confirmModal.value = {
    isOpen: true,
    type: 'warning',
    title: 'Batalkan Publikasi CV',
    message: `Apakah Anda yakin ingin membatalkan publikasi CV "${cv.title}"? CV tidak akan lagi dapat diakses oleh publik.`,
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

// Delete CV
const deleteCv = async (cv: any) => {
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

/* ======================= Utils ======================= */
const showAlert = (type: AlertType, title: string, message: string) => {
  alertModal.value = { isOpen: true, type, title, message }
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
</script>