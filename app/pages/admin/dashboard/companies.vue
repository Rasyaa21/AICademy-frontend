<template>
    <CompanyInputPopup v-model:is-open="openCompanyInput"/>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Companies Management</h1>
                <p class="text-gray-600 mt-1">
                    Kelola data perusahaan partner dan monitor aktivitas mereka
                </p>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Total Perusahaan</p>
                        <p class="text-2xl font-bold text-gray-900">{{ companyStats.total }}</p>
                    </div>
                    <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:building-office-20-solid" class="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Perusahaan Aktif</p>
                        <p class="text-2xl font-bold text-green-600">{{ companyStats.active }}</p>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:check-circle-20-solid" class="w-6 h-6 text-green-600" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Challenge Sponsor</p>
                        <p class="text-2xl font-bold text-purple-600">{{ companyStats.challengeSponsors }}</p>
                    </div>
                    <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:trophy-20-solid" class="w-6 h-6 text-purple-600" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter Component -->
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

        <!-- Companies Table -->
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Perusahaan</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Email</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Lokasi</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Status</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Bergabung</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="company in paginatedCompanies" :key="company.id" class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span class="text-primary font-semibold text-sm">{{ getInitials(company.company_name) }}</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-900 text-sm">{{ company.company_name }}</div>
                                        <div class="text-xs text-gray-500 truncate max-w-[200px]">{{ company.description || 'No description' }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="py-4 px-6 text-sm text-gray-600">{{ company.email }}</td>
                            <td class="py-4 px-6 text-sm text-gray-600">{{ company.company_location || '-' }}</td>
                            <td class="py-4 px-6">
                                <span 
                                    :class="[
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        company.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    ]"
                                >
                                    {{ company.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                                </span>
                            </td>
                            <td class="py-4 px-6 text-sm text-gray-600">
                                {{ formatDate(company.created_at) }}
                            </td>
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-1">
                                    <button 
                                        @click="viewCompany(company)"
                                        class="p-1 hover:bg-gray-200 rounded"
                                        title="Lihat Detail"
                                    >
                                        <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button 
                                        @click="editCompany(company)"
                                        class="p-1 hover:bg-gray-200 rounded"
                                        title="Edit"
                                    >
                                        <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button 
                                        @click="deleteCompany(company)"
                                        class="p-1 hover:bg-gray-200 rounded"
                                        title="Hapus"
                                    >
                                        <Icon name="heroicons:trash-20-solid" class="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredCompanies.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
                <Icon name="heroicons:building-office-20-solid" class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada perusahaan ditemukan</h3>
            <p class="text-gray-500 mb-4">
                {{ searchQuery ? 'Coba ubah kata kunci pencarian atau' : 'Coba ubah' }} filter untuk melihat perusahaan lainnya
            </p>
            <button 
                @click="clearAllFilters"
                class="text-primary hover:text-primary/80 font-medium"
            >
                Reset semua filter
            </button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredCompanies.length > itemsPerPage" class="flex justify-center">
            <nav class="flex items-center gap-2">
                <button 
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-gray-50 transition-colors"
                >
                    Previous
                </button>
                
                <span class="px-4 py-2 text-sm text-gray-600">
                    Page {{ currentPage }} of {{ totalPages }}
                </span>
                
                <button 
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:bg-gray-50 transition-colors"
                >
                    Next
                </button>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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