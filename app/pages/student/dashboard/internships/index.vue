<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 justify-between lg:flex-row lg:items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Internship untuk Mahasiswa</h1>
        <p class="mt-1 text-gray-600">Temukan peluang magang terbaik untuk mengembangkan karir Anda</p>
      </div>
    </div>

    <CompaniesFilterSection
      v-model:search-query="searchQuery"
      v-model:selected-status="selectedStatus"
      :filtered-count="pageData.list.length"
      :total-count="pageData.total"
      :active-filters-count="activeFiltersCount"
      :has-active-filters="hasActiveFilters"
      @clear-filters="clearAllFilters"
    />

    <CompaniesSortViewSection v-model:sort-by="sortBy" v-model:view-mode="viewMode" />

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-xl p-8 shadow-sm border text-center">
      <Icon name="heroicons:exclamation-triangle-20-solid" class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
      <p class="text-gray-600 mb-4">Gagal memuat data internship. Silakan coba lagi.</p>
      <UniversalButton variant="primary" @click="refresh()">
        Coba Lagi
      </UniversalButton>
    </div>

    <!-- Internship Display -->
    <CompaniesDisplaySection 
      v-else-if="pageData.list.length > 0" 
      :view-mode="viewMode" 
      :internships="pageData.list" 
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

    <!-- Pagination -->
    <div v-if="pageData.total_pages > 1" class="flex justify-center">
      <nav class="flex gap-2 items-center">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1 || pending" 
          class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Sebelumnya
        </button>

        <span class="px-4 py-2 text-sm text-gray-600"> 
          Halaman {{ currentPage }} dari {{ pageData.total_pages }} 
        </span>

        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === pageData.total_pages || pending" 
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
import CompaniesSortViewSection from "~/components/dashboard-student/companies/CompaniesSortViewSection.vue"

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

interface ApiResponse {
  success: boolean
  message: string
  data: {
    data: Internship[]
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

definePageMeta({
  layout: "dashboard-layout-student-dashboard-layout",
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

// State
const searchQuery = ref('')
const selectedStatus = ref('')
const sortBy = ref('newest')
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = computed(() => parseInt(route.query.page as string) || 1)
const limit = 10

// Data fetching dengan endpoint yang benar
const { data, pending, error, refresh } = await useAsyncData<ApiResponse>(
  'internships',
  () => $fetch('/student/internships', {
    baseURL: config.public.apiBase,
    credentials: 'include',
    headers: process.server ? useRequestHeaders(['cookie']) : undefined,
    query: {
      page: currentPage.value,
      limit,
      search: route.query.search || '',
      status: route.query.status || '',
      sort: route.query.sort || 'newest'
    }
  }),
  {
    watch: [() => route.query],
    default: () => ({
      success: false,
      message: '',
      data: {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0
      }
    })
  }
)

// --- Normalizer untuk hindari undefined ---
const pageData = computed(() => {
  const fallback = { list: [], total: 0, total_pages: 0, page: 1 }
  const d = data.value?.data
  if (!d) return fallback

  const list = Array.isArray(d.data) ? d.data : []
  const total = typeof d.total === 'number' ? d.total : 0
  const total_pages = typeof d.total_pages === 'number' ? d.total_pages : 0
  const page = typeof d.page === 'number' ? d.page : 1

  return { list, total, total_pages, page }
})

// Computed - perbaiki akses data
const internshipStats = computed(() => {
  const list = pageData.value.list
  if (!list.length) {
    return { total: 0, companies: 0, active: 0, pkl: 0 }
  }

  const now = new Date()
  const companies = new Set(list.map(item => item.company_profile?.company_name).filter(Boolean))
  const active = list.filter(item => new Date(item.deadline) > now).length
  const pkl = list.filter(item => item.type === 'PKL').length

  return {
    total: pageData.value.total,
    companies: companies.size,
    active,
    pkl
  }
})

const hasActiveFilters = computed(() => {
  return !!(route.query.search || route.query.status)
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (route.query.search) count++
  if (route.query.status) count++
  return count
})

// Methods
const handleSearch = () => {
  router.push({
    query: {
      ...route.query,
      search: searchQuery.value || undefined,
      status: selectedStatus.value || undefined,
      sort: sortBy.value,
      page: 1
    }
  })
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  sortBy.value = 'newest'
  router.push({
    query: {
      page: 1
    }
  })
}

const goToPage = (page: number) => {
  router.push({
    query: {
      ...route.query,
      page
    }
  })
}

// Watch for filter changes
watch([searchQuery, selectedStatus, sortBy], () => {
  handleSearch()
})

// Initialize from URL
onMounted(() => {
  searchQuery.value = (route.query.search as string) || ''
  selectedStatus.value = (route.query.status as string) || ''
  sortBy.value = (route.query.sort as string) || 'newest'
})
</script>