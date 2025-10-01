<template>
    <AlertModal 
        v-model:isOpen="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="handleAlertOk"
    />
    <RoleInputPopup 
        v-model:is-open="openRoleInput"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
    />

    <RoleInputPopup 
        v-model:is-open="openRoleInput"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
    />


    <RoleEditPopup
        v-model:is-open="openEditRoleInput"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
        :role-id="selectedRoleId"
    />
    <div class="space-y-6">
        <div class="flex flex-col gap-4 justify-between lg:flex-row lg:items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Roles Management</h1>
                <p class="mt-1 text-gray-600">
                    Kelola peran pengguna dan permission dalam sistem
                </p>
            </div>
        </div>

        <RolesStatsSection :role-stats="roleStats" />

        <!-- Filter Component -->
        <RoleFilter
            v-model:searchQuery="searchQuery"
            v-model:selectedType="selectedType"
            v-model:selectedStatus="selectedStatus"
            v-model:sortBy="sortBy"
            :filteredCount="filteredRoles.length"
            :totalCount="totalRoles"
            :hasActiveFilters="hasActiveFilters"
            @clear-filters="clearAllFilters"
            @add-role="openRoleInput = true"
        />

        <!-- Loading State -->
        <div v-if="pending" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="text-gray-500 mt-2">Memuat data roles...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
            <p class="text-red-500">Error: {{ error.message }}</p>
            <button @click="refresh()" class="mt-2 px-4 py-2 bg-primary text-white rounded-lg">
                Coba Lagi
            </button>
        </div>

        <!-- Roles Table -->
        <RolesTableSection 
            v-else
            :paginated-roles="paginatedRoles"
            @edit-role="editRole"
            @delete-role="deleteRole"
        />

        <!-- Empty State -->
        <RolesEmptyState 
            v-if="!pending && !error && filteredRoles.length === 0"
            :search-query="searchQuery"
            @clear-filters="clearAllFilters"
            @add-role="openRoleInput = true"
        />

        <!-- Pagination -->
        <RolesPaginationSection
            v-if="!pending && !error && totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="totalRoles"
            :items-per-page="itemsPerPage"
            @page-changed="handlePageChange"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import RoleFilter from '~/components/dashboard-admin/roles/RoleFilter.vue'
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import RolesStatsSection from '~/components/dashboard-admin/roles/RolesStatsSection.vue'
import RolesTableSection from '~/components/dashboard-admin/roles/RolesTableSection.vue'
import RolesEmptyState from '~/components/dashboard-admin/roles/RolesEmptyState.vue'
import RolesPaginationSection from '~/components/dashboard-admin/roles/RolesPaginationSection.vue'
import RoleInputPopup from '~/components/modal/admin/dashboard/role/RoleInputPopup.vue'
import RoleEditPopup from '~/components/modal/admin/dashboard/role/RoleEditPopup.vue'

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

const openRoleInput = ref(false)
const openEditRoleInput = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const sortBy = ref('newest')

const selectedRoleId = ref<string | null>(null)

const currentPage = ref(1)
const itemsPerPage = 10

const headers = useRequestHeaders(['cookie']) 
const { data: rolesData, pending, error, refresh } = await useAsyncData('roleData', () => 
    $fetch(`/admin/questionnaires/target-roles?page=${currentPage.value}&limit=${itemsPerPage}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
    }), {
        watch: [currentPage]
    }
)

// Computed properties based on API response structure
const roles = computed(() => rolesData.value?.data?.data || [])
const totalRoles = computed(() => rolesData.value?.data?.total || 0)
const totalPagesFromAPI = computed(() => rolesData.value?.data?.total_pages || 1)

const filteredRoles = computed(() => {
    let filtered = [...roles.value]

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(role => 
            role.name.toLowerCase().includes(query) ||
            role.description.toLowerCase().includes(query) ||
            role.category.toLowerCase().includes(query)
        )
    }

    if (selectedType.value) {
        filtered = filtered.filter(r => r.category === selectedType.value)
    }

    if (selectedStatus.value) {
        const isActive = selectedStatus.value === 'active'
        filtered = filtered.filter(r => r.active === isActive)
    }

    // Sort
    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case 'name':
                return a.name.localeCompare(b.name)
            case 'category':
                return a.category.localeCompare(b.category)
            default:
                return 0
        }
    })

    return filtered
})

const paginatedRoles = computed(() => {
    // Jika menggunakan server-side pagination, return semua filtered roles
    // Jika menggunakan client-side pagination, slice berdasarkan currentPage
    return filteredRoles.value
})

const totalPages = computed(() => {
    // Jika menggunakan filter client-side, hitung ulang total pages
    if (hasActiveFilters.value) {
        return Math.ceil(filteredRoles.value.length / itemsPerPage)
    }
    // Jika tidak ada filter, gunakan total pages dari API
    return totalPagesFromAPI.value
})

const roleStats = computed(() => {
    const activeRoles = roles.value.filter(r => r.active).length
    const draftRoles = roles.value.filter(r => !r.active).length
    
    return {
        total: totalRoles.value,
        active: activeRoles,
        draft: draftRoles,
        totalUsers: 0 // API tidak menyediakan data users_count
    }
})

const hasActiveFilters = computed(() => {
    return !!(searchQuery.value || selectedType.value || selectedStatus.value)
})

// Methods
const clearAllFilters = () => {
    searchQuery.value = ''
    selectedType.value = ''
    selectedStatus.value = ''
    currentPage.value = 1
}

const handlePageChange = (page: number) => {
    currentPage.value = page
}

const editRole = (role: any) => {
    selectedRoleId.value = role.id
    openEditRoleInput.value = true
}

const deleteRole = async (role: any) => {
    try {
        await $fetch(`/admin/questionnaires/target-roles/${role.id}`, {
            method: 'DELETE',
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        showSuccessModal('Role berhasil dihapus')
        refresh() 
    } catch (error) {
        console.error('Error deleting role:', error)
        showErrorModal('Gagal menghapus role')
    }
}


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
        refresh() // Refresh data after success
    }
}

watch([searchQuery, selectedType, selectedStatus], () => {
    currentPage.value = 1
})
</script>