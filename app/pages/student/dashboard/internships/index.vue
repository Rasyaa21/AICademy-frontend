<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 justify-between lg:flex-row lg:items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Internship untuk Siswa</h1>
        <p class="mt-1 text-gray-600">Temukan peluang magang terbaik untuk mengembangkan karir Anda</p>
      </div>
    </div>

    <CompaniesFilterSection
      v-model:search-query="searchQuery"
      v-model:selected-status="selectedStatus"
      :filtered-count="filteredInternships.length"
      :total-count="allInternships.length"
      :active-filters-count="activeFiltersCount"
      :has-active-filters="hasActiveFilters"
      @clear-filters="clearAllFilters"
    />

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <div v-else-if="error" class="bg-white rounded-xl p-8 shadow-sm border text-center">
      <Icon name="heroicons:exclamation-triangle-20-solid" class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
      <p class="text-gray-600 mb-4">Gagal memuat data internship. Silakan coba lagi.</p>
      <UniversalButton variant="primary" @click="refresh()" text="Coba Lagi">
      </UniversalButton>
    </div>

    <!-- Internship Display -->
    <CompaniesDisplaySection 
      v-else-if="paginatedInternships.length > 0" 
      :view-mode="viewMode" 
      :internships="paginatedInternships" 
    />

    <!-- Empty State -->
    <div v-else class="py-12 text-center">
      <div class="mb-4 text-gray-400">
        <Icon name="heroicons:briefcase-20-solid" class="mx-auto w-16 h-16" />
      </div>
      <h3 class="mb-2 text-lg font-semibold text-gray-900">Tidak ada internship ditemukan</h3>
      <p class="mb-4 text-gray-500">{{ searchQuery ? "Coba ubah kata kunci pencarian atau" : "Coba ubah" }} filter untuk melihat internship lainnya</p>
      <button @click="clearAllFilters" class="font-medium text-primary hover:text-primary/80">Reset semua filter</button>
    </div>

    <!-- Pagination (client-side) -->
    <div v-if="totalPages > 1" class="flex justify-center">
      <nav class="flex gap-2 items-center">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1 || pending" 
          class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Sebelumnya
        </button>

        <span class="px-4 py-2 text-sm text-gray-600"> 
          Halaman {{ currentPage }} dari {{ totalPages }} 
        </span>

        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages || pending" 
          class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Berikutnya
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import UniversalButton from "~/components/button/UniversalButton.vue"
import CompaniesDisplaySection from "~/components/dashboard-student/companies/CompaniesDisplaySection.vue"
import CompaniesFilterSection from "~/components/dashboard-student/companies/CompaniesFilterSection.vue"

interface CompanyProfile {
  id: string
  user_id: string
  user: {
    id: string
    email: string
    role: string
    created_at: string
    updated_at: string
  }
  company_name: string
  company_logo: string | null
  company_location: string
  description: string
  created_at: string
  photos: any | null
}

interface Internship {
  id: string
  company_profile_id: string
  title: string
  description: string
  type: string
  posted_at: string
  deadline: string
  created_at: string
  updated_at: string
  company_profile: CompanyProfile
}

definePageMeta({
  layout: "dashboard-layout-student-dashboard-layout",
  ssr: false
})

const config = useRuntimeConfig()

// State (client-side filter & pagination seperti Challenge)
const searchQuery = ref('')
const selectedStatus = ref('') // optional filter tambahan jika dibutuhkan nanti
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = 12

// Pola fetching disamakan dengan Challenge
const fetchOpts = {
  baseURL: config.public.apiBase as string,
  credentials: "include" as const,
  headers: process.server ? useRequestHeaders(["cookie"]) : undefined,
}

const {
  data: internshipsRes,
  pending,
  error,
  refresh
} = await useAsyncData(
  "student-internships",
  () => $fetch("/student/internships", fetchOpts),
  { server: false }
)

// Sumber data utama
const allInternships = computed<Internship[]>(
  () => (internshipsRes.value as any)?.data?.data ?? []
)

// Client-side searching seperti Challenge
const filteredInternships = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = allInternships.value
  if (q) {
    list = list.filter((i) => {
      const title = i.title?.toLowerCase() || ''
      const desc = i.description?.toLowerCase() || ''
      const company = i.company_profile?.company_name?.toLowerCase() || ''
      return title.includes(q) || desc.includes(q) || company.includes(q)
    })
  }
  // contoh filter status jika nanti dipakai
  if (selectedStatus.value) {
    // sesuaikan logic jika backend menyediakan field status
    // list = list.filter(i => i.status === selectedStatus.value)
  }
  return list
})

// Client-side pagination seperti Challenge
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredInternships.value.length / itemsPerPage))
)

const paginatedInternships = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredInternships.value.slice(start, start + itemsPerPage)
})

// Info untuk filter header
const hasActiveFilters = computed(() => !!(searchQuery.value || selectedStatus.value))
const activeFiltersCount = computed(() => {
  let c = 0
  if (searchQuery.value) c++
  if (selectedStatus.value) c++
  return c
})

// Actions
const clearAllFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// Reset ke halaman 1 saat search/status berubah
watch([searchQuery, selectedStatus], () => {
  currentPage.value = 1
})
</script>