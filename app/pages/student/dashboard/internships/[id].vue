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
      <UniversalButton variant="primary" @click="refresh()" text="Coba Lagi">
        
      </UniversalButton>
    </div>

    <!-- Content -->
    <div v-else-if="internshipData" class="space-y-6">
      <!-- Navigation -->
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <NuxtLink 
          to="/student/dashboard/internships" 
          class="hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4" />
          Kembali
        </NuxtLink>
        <Icon name="heroicons:chevron-right-20-solid" class="w-4 h-4" />
        <span>Detail Internship</span>
      </div>

      <!-- Header -->
      <div class="bg-white rounded-xl p-6 shadow-sm border">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold text-gray-900">{{ internshipData.title }}</h1>
              <span 
                class="text-sm font-medium px-3 py-1 rounded-full"
                :class="internshipData.type === 'PKL' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
              >
                {{ internshipData.type }}
              </span>
            </div>
            <div class="flex items-center gap-4 text-gray-600">
              <div class="flex items-center gap-2">
                <Icon name="heroicons:building-office-20-solid" class="w-5 h-5" />
                <span class="font-medium">{{ internshipData.company_profile.company_name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="heroicons:map-pin-20-solid" class="w-5 h-5" />
                <span>{{ internshipData.company_profile.company_location }}</span>
              </div>
            </div>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            ]"
          >
            {{ isActive ? 'Aktif' : 'Tutup' }}
          </span>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Company Info -->
        <div class="bg-white rounded-xl p-6 shadow-sm border">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon name="heroicons:building-office-20-solid" class="w-5 h-5 text-blue-600" />
            Tentang Perusahaan
          </h2>
          <div class="space-y-3">
            <div>
              <span class="font-medium text-gray-700">Nama:</span>
              <span class="ml-2">{{ internshipData.company_profile.company_name }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Lokasi:</span>
              <span class="ml-2">{{ internshipData.company_profile.company_location }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Deskripsi:</span>
              <p class="mt-1 text-gray-600">{{ internshipData.company_profile.description }}</p>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="bg-white rounded-xl p-6 shadow-sm border">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon name="heroicons:clock-20-solid" class="w-5 h-5 text-green-600" />
            Timeline
          </h2>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <span class="font-medium text-gray-700">Diposting</span>
                <p class="text-sm text-gray-600">{{ formatDate(internshipData.posted_at) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div 
                class="w-3 h-3 rounded-full"
                :class="isActive ? 'bg-yellow-500' : 'bg-red-500'"
              ></div>
              <div>
                <span class="font-medium text-gray-700">Deadline</span>
                <p class="text-sm text-gray-600">{{ formatDate(internshipData.deadline) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white rounded-xl p-6 shadow-sm border">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-purple-600" />
          Deskripsi Posisi
        </h2>
        <div class="prose max-w-none">
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ internshipData.description }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4">
        <UniversalButton 
        :text="getApplyButtonText"
          variant="primary" 
          @click="handleApply"
          :disabled="!isActive || isApplyLoading || hasApplied"
          :loading="isApplyLoading"
        >
        </UniversalButton>
        <UniversalButton 
        text="Kembali Ke Halaman Perusahaan"
          variant="secondary" 
          @click="goBack"
        >
        </UniversalButton>
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
import UniversalButton from '~/components/button/UniversalButton.vue'
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

// Data fetching - memperbaiki endpoint dan struktur response
const { data, pending, error, refresh } = await useAsyncData<ApiResponse>(
  `internship-${route.params.id}`,
  () => $fetch(`/student/internship/${route.params.id}`, {
    baseURL: config.public.apiBase,
    credentials: 'include',
    headers: process.server ? useRequestHeaders(['cookie']) : undefined,
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
    await $fetch('/student/internship/apply', {
      method: 'POST',
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers: process.server ? useRequestHeaders(['cookie']) : undefined,
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
  router.push('/student/dashboard/internships')
}
</script>