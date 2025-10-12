<template>
  <div class="container mx-auto p-4">
    <!-- Loading state -->
    <div v-if="pending" class="space-y-6">
      <div class="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-white rounded-xl p-8 shadow-sm border text-center">
      <Icon name="heroicons:exclamation-triangle-20-solid" class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
      <p class="text-gray-600 mb-4">Gagal memuat detail internship. Silakan coba lagi.</p>
      <button
        class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        @click="refresh()"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="internshipData" class="space-y-6">
      <!-- Navigation -->
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <NuxtLink 
          to="/alumni/dashboard/internships" 
          class="hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4" />
          Kembali ke Daftar
        </NuxtLink>
        <Icon name="heroicons:chevron-right-20-solid" class="w-4 h-4" />
        <span>Detail Internship</span>
      </div>

      <!-- Header -->
      <div class="bg-white rounded-xl p-6 shadow-sm border">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ internshipData.title }}</h1>
            <div class="flex items-center gap-4 text-gray-600">
              <div class="flex items-center gap-2">
                <Icon name="heroicons:building-office-20-solid" class="w-5 h-5" />
                <span>{{ internshipData.company_profile?.company_name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="heroicons:map-pin-20-solid" class="w-5 h-5" />
                <span>{{ internshipData.company_profile?.company_location }}</span>
              </div>
            </div>
          </div>
          <div>
            <span 
              :class="[
                'px-4 py-2 rounded-full text-sm font-semibold',
                isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              ]"
            >
              {{ isActive ? 'Aktif' : 'Tutup' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Company Info -->
        <div class="bg-white rounded-xl p-6 shadow-sm border">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Informasi Perusahaan</h2>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-500 mb-1">Nama Perusahaan</p>
              <p class="font-medium text-gray-900">{{ internshipData.company_profile?.company_name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Lokasi</p>
              <p class="font-medium text-gray-900">{{ internshipData.company_profile?.company_location }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Email</p>
              <p class="font-medium text-gray-900">{{ internshipData.company_profile?.user?.email }}</p>
            </div>
          </div>
        </div>

        <!-- Internship Details -->
        <div class="bg-white rounded-xl p-6 shadow-sm border">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Detail Internship</h2>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-500 mb-1">Tipe</p>
              <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {{ internshipData.type }}
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Tanggal Posting</p>
              <p class="font-medium text-gray-900">{{ formatDate(internshipData.posted_at) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Deadline</p>
              <p class="font-medium text-gray-900">{{ formatDate(internshipData.deadline) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white rounded-xl p-6 shadow-sm border">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Deskripsi</h2>
        <div class="prose prose-gray max-w-none">
          <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ internshipData.description }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4">
        <button
          class="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          @click="goBack"
        >
          Kembali
        </button>
        <button
          :disabled="!isActive || hasApplied || isApplyLoading"
          :class="[
            'flex-1 px-6 py-3 rounded-lg font-semibold transition-colors',
            isActive && !hasApplied
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
          @click="handleApply"
        >
          {{ getApplyButtonText }}
        </button>
      </div>
    </div>

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model:isOpen="showConfirmModal"
      type="info"
      title="Konfirmasi Apply"
      :message="`Apakah Anda yakin ingin apply untuk posisi ${internshipData?.title}?`"
      confirm-text="Ya, Apply"
      cancel-text="Batal"
      @confirm="confirmApply"
    />

    <AlertModal
      v-model:isOpen="showAlertModal"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
    />
  </div>
</template>

<script setup lang="ts">
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import ConfirmModal from '~/components/modal/basic-modal/ConfirmModal.vue'

interface CompanyProfile {
  id: string
  company_name: string
  company_location: string
  description: string
  user: {
    id: string
    email: string
    role: string
  }
}

interface Internship {
  id: string
  company_profile_id: string
  title: string
  description: string
  type: string
  posted_at: string
  deadline: string
  company_profile: CompanyProfile
}

interface ApiResponse {
  success: boolean
  message: string
  data: Internship
}

definePageMeta({
  layout: "dashboard-layout-student-dashboard-layout",
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

// State
const showConfirmModal = ref(false)
const showAlertModal = ref(false)
const alertType = ref<'success' | 'error' | 'warning' | 'info'>('info')
const alertTitle = ref('')
const alertMessage = ref('')
const isApplyLoading = ref(false)
const hasApplied = ref(false)

// Data fetching - CHANGED TO /alumni endpoint
const { data, pending, error, refresh } = await useAsyncData<ApiResponse>(
  `alumni-internship-${route.params.id}`,
  () => $fetch(`/alumni/internship/${route.params.id}`, {
    baseURL: config.public.apiBase,
    credentials: 'include',
    headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
  })
)

// Computed - mengakses data dari response.data
const internshipData = computed(() => {
  return data.value?.data || null
})

const isActive = computed(() => {
  if (!internshipData.value) return false
  return new Date(internshipData.value.deadline) > new Date()
})

const getApplyButtonText = computed(() => {
  if (hasApplied.value) return 'Applied'
  if (!isActive.value) return 'Tutup'
  if (isApplyLoading.value) return 'Applying...'
  return 'Apply'
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }) + ' WIB'
}

const handleApply = () => {
  if (!isActive.value || hasApplied.value) return
  showConfirmModal.value = true
}

const confirmApply = async () => {
  if (!internshipData.value) return
  
  isApplyLoading.value = true
  
  try {
    // CHANGED TO /alumni endpoint
    await $fetch('/alumni/internship/apply', {
      method: 'POST',
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
      body: {
        internship_id: internshipData.value.id
      }
    })
    
    hasApplied.value = true
    alertType.value = 'success'
    alertTitle.value = 'Berhasil Apply'
    alertMessage.value = `Anda telah berhasil apply untuk posisi ${internshipData.value.title}. Perusahaan akan menghubungi Anda jika terpilih.`
    showAlertModal.value = true
    
  } catch (error: any) {
    alertType.value = 'error'
    alertTitle.value = 'Gagal Apply'
    alertMessage.value = error.data?.message || 'Terjadi kesalahan saat apply. Silakan coba lagi.'
    showAlertModal.value = true
  } finally {
    isApplyLoading.value = false
  }
}

const goBack = () => {
  router.push('/alumni/dashboard/internships')
}
</script>
