<template>
    <AlertModal 
        v-model:isOpen="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="handleAlertOk"
    />
    <CompanyInputPopup 
        v-model:is-open="openCompanyInput"
        :edit-data="editingCompany"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
    />
    <CompanyDetailPopup
        v-model:is-open="openCompanyDetail"
        :company-id="selectedCompanyId"
    />
    
    <div class="space-y-6">
        <AdminPageHeader
            title="Companies Management"
            description="Kelola data perusahaan partner dan monitor aktivitas mereka"
        />

        <CompaniesStatsSection :company-stats="companyStats" />

        <!-- Loading State -->
        <div v-if="pending" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="text-gray-500 mt-2">Memuat data perusahaan...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
            <p class="text-red-500">Error: {{ error.message }}</p>
            <button @click="refresh()" class="mt-2 px-4 py-2 bg-primary text-white rounded-lg">
                Coba Lagi
            </button>
        </div>

        <!-- Content -->
        <template v-else>
            <CompanyFilter
                v-model:searchQuery="searchQuery"
                v-model:selectedLocation="selectedLocation"
                v-model:selectedStatus="selectedStatus"
                v-model:sortBy="sortBy"
                :filteredCount="totalItems"
                :totalCount="totalItems"
                :activeFiltersCount="activeFiltersCount"
                :hasActiveFilters="hasActiveFilters"
                @clear-filters="clearAllFilters"
                @add-company="openCompanyInput = true"
            />

            <CompaniesTableSection
                :paginated-companies="companies"
                @view-company="viewCompany"
                @edit-company="editCompany"
                @delete-company="deleteCompany"
            />

            <CompaniesEmptyState
                v-if="companies.length === 0"
                :search-query="searchQuery"
                @clear-filters="clearAllFilters"
            />

            <CompaniesPaginationSection
                v-if="totalPages > 1"
                :current-page="currentPage"
                :total-pages="totalPages"
                :total-items="totalItems"
                :items-per-page="itemsPerPage"
                @page-changed="handlePageChange"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AdminPageHeader from '~/components/dashboard-admin/shared/AdminPageHeader.vue'
import CompaniesStatsSection from '~/components/dashboard-admin/companies/CompaniesStatsSection.vue'
import CompaniesTableSection from '~/components/dashboard-admin/companies/CompaniesTableSection.vue'
import CompaniesEmptyState from '~/components/dashboard-admin/companies/CompaniesEmptyState.vue'
import CompaniesPaginationSection from '~/components/dashboard-admin/companies/CompaniesPaginationSection.vue'
import CompanyFilter from '~/components/dashboard-admin/companies/CompaniesFilter.vue'
import CompanyInputPopup from '~/components/modal/admin/dashboard/company/CompanyInputPopup.vue'
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import CompanyDetailPopup from '~/components/modal/admin/dashboard/company/CompanyDetailPopup.vue'
import type { Company } from '~/types/Company'

definePageMeta({
    layout: 'admin-dashboard-layout'
})

const config = useRuntimeConfig()

const alertModal = ref({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
})

// Filter states
const openCompanyInput = ref(false)
const openCompanyDetail = ref(false)
const searchQuery = ref('')
const selectedLocation = ref('')
const selectedStatus = ref('')
const sortBy = ref('newest')
const selectedCompanyId = ref<string | null>(null)
const editingCompany = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const headers = useRequestHeaders(['cookie'])

// ✅ Build API query with all parameters
const buildApiQuery = () => {
    const params = new URLSearchParams({
        page: currentPage.value.toString(),
        limit: itemsPerPage.toString()
    })
    
    if (searchQuery.value.trim()) {
        params.append('search', searchQuery.value.trim())
    }
    
    if (selectedLocation.value) {
        params.append('location', selectedLocation.value)
    }
    
    if (selectedStatus.value) {
        params.append('status', selectedStatus.value)
    }
    
    if (sortBy.value) {
        params.append('sort', sortBy.value)
    }
    
    return params.toString()
}

// ✅ Fetch data from API
const { data: companyData, pending, error, refresh } = await useAsyncData('companyData', () => 
    $fetch(`/admin/users/companies?${buildApiQuery()}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
    }), {
        watch: [currentPage, searchQuery, selectedLocation, selectedStatus, sortBy]
    }
)

// ✅ Use API data directly (no client-side filtering)
const companies = computed(() => companyData.value?.data || [])
const totalPages = computed(() => companyData.value?.data?.total_pages || 1)
const totalItems = computed(() => companyData.value?.data?.total || 0)

// ✅ Company stats from API data
const companyStats = computed(() => {
    // For accurate stats, you might need a separate API endpoint for all data
    const activeCompanies = companies.value.filter(c => c.status === 'active').length
    
    return {
        total: totalItems.value, // ✅ Use totalItems from API
        active: activeCompanies,
    }
})

const hasActiveFilters = computed(() => {
    return !!(searchQuery.value || selectedLocation.value || selectedStatus.value)
})

const activeFiltersCount = computed(() => {
    let count = 0
    if (searchQuery.value) count++
    if (selectedLocation.value) count++
    if (selectedStatus.value) count++
    return count
})

// Methods
const clearAllFilters = () => {
    searchQuery.value = ''
    selectedLocation.value = ''
    selectedStatus.value = ''
    currentPage.value = 1
}

// ✅ Proper page change handler
const handlePageChange = (page: number) => {
    currentPage.value = page
}

// Action handlers
const viewCompany = (company: Company) => {
    selectedCompanyId.value = company.id
    openCompanyDetail.value = true
}

const editCompany = (company: Company) => {
    editingCompany.value = {
        id: company.id,
        company_name: company.company_name,
        company_logo: company.company_logo,
        company_location: company.company_location,
        description: company.description,
        email: company.email
    }
    openCompanyInput.value = true
}

const deleteCompany = async (company: Company) => {
    if (confirm('Apakah Anda yakin ingin menghapus perusahaan ini?')) {
        try {
            await $fetch(`/admin/users/companies/${company.id}`, {
                method: 'DELETE',
                baseURL: config.public.apiBase,
                credentials: 'include',
                headers
            })
            showSuccessModal('Perusahaan berhasil dihapus')
            refresh()
        } catch (error) {
            console.error('Error deleting company:', error)
            showErrorModal('Gagal menghapus perusahaan')
        }
    }
}

// Alert modal handlers
const showSuccessModal = (message: string) => {
    alertModal.value = {
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message: message
    }
}

const showErrorModal = (message: string) => {
    alertModal.value = {
        isOpen: true,
        type: 'error',
        title: 'Gagal',
        message: message
    }
}

const handleAlertOk = () => {
    alertModal.value.isOpen = false
    if (alertModal.value.type === 'success') {
        refresh()
    }
}

// ✅ Reset page when filters change
watch([searchQuery, selectedLocation, selectedStatus, sortBy], () => {
    currentPage.value = 1
})
</script>