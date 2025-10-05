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

        <template v-else>
            <!-- Filter Component -->
            <RoleFilter
                v-model:searchQuery="searchQuery"
                v-model:selectedType="selectedType"
                v-model:selectedStatus="selectedStatus"
                v-model:sortBy="sortBy"
                :filteredCount="totalItems"
                :totalCount="totalItems"
                :hasActiveFilters="hasActiveFilters"
                @clear-filters="clearAllFilters"
                @add-role="openRoleInput = true"
            />

            <!-- Roles Table -->
            <RolesTableSection 
                :paginated-roles="roles"
                @edit-role="editRole"
                @delete-role="deleteRole"
            />

            <!-- Empty State -->
            <RolesEmptyState 
                v-if="roles.length === 0"
                :search-query="searchQuery"
                @clear-filters="clearAllFilters"
                @add-role="openRoleInput = true"
            />

            <RolesPaginationSection
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

// ✅ FIXED: Build API query with all parameters
const buildApiQuery = () => {
    const params = new URLSearchParams({
        page: currentPage.value.toString(),
        limit: itemsPerPage.toString()
    })
    
    if (searchQuery.value.trim()) {
        params.append('search', searchQuery.value.trim())
    }
    
    if (selectedType.value) {
        params.append('type', selectedType.value)
    }
    
    if (selectedStatus.value) {
        params.append('status', selectedStatus.value)
    }
    
    if (sortBy.value) {
        params.append('sort', sortBy.value)
    }
    
    return params.toString()
}

// ✅ FIXED: Watch all filter parameters
const { data: rolesData, pending, error, refresh } = await useAsyncData('roleData', () => 
    $fetch(`/admin/questionnaires/target-roles?${buildApiQuery()}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
    }), {
        watch: [currentPage, searchQuery, selectedType, selectedStatus, sortBy]
    }
)

// ✅ FIXED: Use API data directly (no client-side filtering)
const roles = computed(() => rolesData.value?.data?.data || [])
const totalPages = computed(() => rolesData.value?.data?.total_pages || 1)
const totalItems = computed(() => rolesData.value?.data?.total || 0)

// ✅ FIXED: Remove client-side filtering and pagination
// const filteredRoles = computed(() => { ... }) // ← HAPUS
// const paginatedRoles = computed(() => { ... }) // ← HAPUS

const roleStats = computed(() => {
    // For accurate stats, you might need a separate API endpoint for all data
    const activeRoles = roles.value.filter(r => r.active).length
    const draftRoles = roles.value.filter(r => !r.active).length
    
    return {
        total: totalItems.value, // ✅ FIXED: Use totalItems from API
        active: activeRoles,
        draft: draftRoles,  
        totalUsers: 0
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
    if (confirm('Apakah Anda yakin ingin menghapus role ini?')) {
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
        refresh()
    }
}

// ✅ FIXED: Reset page when filters change
watch([searchQuery, selectedType, selectedStatus, sortBy], () => {
    currentPage.value = 1
})
</script>