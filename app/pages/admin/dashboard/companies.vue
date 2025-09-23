<template>
    <CompanyInputPopup v-model:is-open="openCompanyInput"/>
    <div class="space-y-6">
        <AdminPageHeader
            title="Companies Management"
            description="Kelola data perusahaan partner dan monitor aktivitas mereka"
        />

        <CompaniesStatsSection :company-stats="companyStats" />

        <CompanyFilter
            v-model:searchQuery="searchQuery"
            v-model:selectedLocation="selectedLocation"
            v-model:selectedStatus="selectedStatus"
            v-model:sortBy="sortBy"
            :filteredCount="filteredCompanies.length"
            :totalCount="companies.length"
            :activeFiltersCount="activeFiltersCount"
            :hasActiveFilters="hasActiveFilters"
            @clear-filters="clearAllFilters"
            @add-company="openCompanyInput = true"
        />

        <CompaniesTableSection
            :paginated-companies="paginatedCompanies"
            @view-company="viewCompany"
            @edit-company="editCompany"
            @delete-company="deleteCompany"
        />

        <CompaniesEmptyState
            v-if="filteredCompanies.length === 0"
            :search-query="searchQuery"
            @clear-filters="clearAllFilters"
        />

        <CompaniesPaginationSection
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="filteredCompanies.length"
            :items-per-page="itemsPerPage"
            @page-changed="(page: number) => currentPage = page"
        />
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
import CompanyInputPopup from '~/components/modal/CompanyInputPopup.vue'
import type { Company } from '~/types/Company'

definePageMeta({
    layout: 'admin-dashboard-layout'
})

// Types


// Filter states
const openCompanyInput = ref(false)
const searchQuery = ref('')
const selectedLocation = ref('')
const selectedStatus = ref('')
const sortBy = ref('newest')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Sample data
const companies = ref<Company[]>([
    {
        id: '1',
        user_id: 'user1',
        company_name: 'PT. Telkom Indonesia',
        company_location: 'Jakarta',
        description: 'Leading telecommunications company in Indonesia',
        email: 'partnership@telkom.co.id',
        status: 'active',
        created_at: '2024-01-10T08:00:00Z'
    },
    {
        id: '2',
        user_id: 'user2',
        company_name: 'PT. Gojek Indonesia',
        company_location: 'Jakarta',
        description: 'Super app platform and on-demand services',
        email: 'talent@gojek.com',
        status: 'active',
        created_at: '2024-01-12T08:00:00Z'
    },
    {
        id: '3',
        user_id: 'user3',
        company_name: 'PT. Tokopedia',
        company_location: 'Jakarta',
        description: 'Leading e-commerce platform in Indonesia',
        email: 'careers@tokopedia.com',
        status: 'inactive',
        created_at: '2024-01-15T08:00:00Z'
    }
])

// Computed properties
const filteredCompanies = computed(() => {
    let filtered = companies.value

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(company => 
            company.company_name.toLowerCase().includes(query) ||
            company.email.toLowerCase().includes(query) ||
            (company.description && company.description.toLowerCase().includes(query))
        )
    }

    // Location filter
    if (selectedLocation.value) {
        filtered = filtered.filter(c => c.company_location === selectedLocation.value)
    }

    // Status filter
    if (selectedStatus.value) {
        filtered = filtered.filter(c => c.status === selectedStatus.value)
    }

    // Sort
    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case 'name':
                return a.company_name.localeCompare(b.company_name)
            case 'location':
                return (a.company_location || '').localeCompare(b.company_location || '')
            default:
                return 0
        }
    })

    return filtered
})

const paginatedCompanies = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredCompanies.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredCompanies.value.length / itemsPerPage)
})

const companyStats = computed(() => {
    const active = companies.value.filter(c => c.status === 'active').length
    
    return {
        total: companies.value.length,
        active,
        challengeSponsors: Math.floor(companies.value.length * 0.6)
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

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

// Action handlers
const viewCompany = (company: Company) => {
    console.log('View company:', company)
}

const editCompany = (company: Company) => {
    console.log('Edit company:', company)
}

const deleteCompany = (company: Company) => {
    console.log('Delete company:', company)
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedLocation, selectedStatus], () => {
    currentPage.value = 1
})
</script>