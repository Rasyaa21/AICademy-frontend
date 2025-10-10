<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="closeModal"
    >
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-lg font-semibold">Detail Roadmap</h2>
                    <button
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>

                <div v-if="pending" class="text-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p class="text-gray-500 mt-2">Memuat detail roadmap...</p>
                </div>

                <div v-else-if="error" class="text-center py-8">
                    <p class="text-red-500">Error: {{ error.message }}</p>
                    <button @click="refresh()" class="mt-2 px-4 py-2 bg-primary text-white rounded-lg">
                        Coba Lagi
                    </button>
                </div>

                <template v-else>
                    <div class="space-y-6">
                        <!-- Roadmap Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Nama Roadmap</label>
                                <p class="mt-1 text-sm text-gray-900">{{ roadmap.roadmap_name }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Status</label>
                                <span 
                                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1"
                                    :class="{
                                        'bg-green-100 text-green-800': roadmap.status === 'active',
                                        'bg-yellow-100 text-yellow-800': roadmap.status === 'draft',
                                        'bg-red-100 text-red-800': roadmap.status === 'inactive'
                                    }"
                                >
                                    {{ roadmap.status === 'active' ? 'Aktif' : roadmap.status === 'draft' ? 'Draft' : 'Tidak Aktif' }}
                                </span>
                            </div>

                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                                <p class="mt-1 text-sm text-gray-900">{{ roadmap.description }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Total Steps</label>
                                <p class="mt-1 text-sm text-gray-900">{{ roadmap.total_steps || 0 }} step</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Dibuat</label>
                                <p class="mt-1 text-sm text-gray-900">{{ formatDate(roadmap.created_at) }}</p>
                            </div>
                        </div>

                        <!-- Steps Section -->
                        <div class="border-t pt-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-medium text-gray-900">Step Roadmap</h3>
                                <button
                                    @click="openCreateStep"
                                    class="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    <Icon name="heroicons:plus-20-solid" class="w-4 h-4 mr-2" />
                                    Tambah Step
                                </button>
                            </div>
                            
                            <RoadmapStepsSection 
                                :steps="roadmapSteps"
                                :loading="pending"
                                @create-step="openCreateStep"
                                @edit-step="editStep"
                                @delete-step="confirmDeleteStep"
                            />
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <!-- Create Step Modal -->
    <CreateStepPopup
        :is-open="openCreateStepModal"
        :roadmap-id="roadmapId"
        @close="closeCreateStepModal"
        @show-success-modal="handleStepSuccess"
        @show-error-modal="handleStepError"
    />

    <!-- Edit Step Modal -->
    <EditStepPopup
        :is-open="openEditStepModal"
        :step-id="selectedStepId"
        :initial-data="selectedStepData"
        @close="closeEditStepModal"
        @show-success-modal="handleStepSuccess"
        @show-error-modal="handleStepError"
    />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import RoadmapStepsSection from '~/components/dashboard-admin/roadmap/RoadmapStepsSection.vue'
import CreateStepPopup from './CreateStepPopup.vue'
import EditStepPopup from './EditStepPopup.vue'
import type { Roadmap, RoadmapStep } from '~/types/Roadmap'

const props = defineProps<{
    isOpen: boolean
    roadmapId: string | null
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'show-success-modal', message: string): void
    (e: 'show-error-modal', message: string): void
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const confirmModal = ref({
    isOpen: false,
    type: 'danger' as 'danger' | 'warning',
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Batal',
    action: null as (() => Promise<void>) | null
})

const openCreateStepModal = ref(false)
const openEditStepModal = ref(false)
const selectedStepId = ref<string | null>(null)
const selectedStepData = ref<RoadmapStep | null>(null)

const closeModal = () => {
    emit('close')
}

const { data: roadmapData, pending, error, refresh } = await useAsyncData(
    `roadmap-${props.roadmapId}`, 
    () => props.roadmapId ? $fetch(`/admin/roadmaps/${props.roadmapId}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
    }) : null,
    {
        watch: [() => props.roadmapId]
    }
)

const roadmap = computed(() => roadmapData.value?.data || {} as Roadmap)

// Extract steps dari roadmap data dan sort berdasarkan step_order
const roadmapSteps = computed(() => {
    const steps = roadmap.value?.steps || []
    return steps.sort((a, b) => (a.step_order || 0) - (b.step_order || 0))
})

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const openCreateStep = () => {
    openCreateStepModal.value = true
}

const closeCreateStepModal = () => {
    openCreateStepModal.value = false
}

const editStep = (step: RoadmapStep) => {
    selectedStepId.value = step.id
    selectedStepData.value = step
    openEditStepModal.value = true
}

const closeEditStepModal = () => {
    openEditStepModal.value = false
    selectedStepId.value = null
    selectedStepData.value = null
}

const confirmDeleteStep = (step: RoadmapStep) => {
    confirmModal.value = {
        isOpen: true,
        type: 'danger',
        title: 'Hapus Step',
        message: `Apakah Anda yakin ingin menghapus step "${step.title}"? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: 'Hapus',
        cancelText: 'Batal',
        action: () => deleteStep(step)
    }
}

const deleteStep = async (step: RoadmapStep) => {
    try {
        // Coba beberapa kemungkinan endpoint URL
        const possibleEndpoints = [
            `/admin/roadmap-steps/${step.id}`,
            `/admin/roadmaps/${props.roadmapId}/steps/${step.id}`,
            `/admin/steps/${step.id}`
        ]

        let success = false
        let lastError = null

        for (const endpoint of possibleEndpoints) {
            try {
                await $fetch(endpoint, {
                    method: 'DELETE',
                    baseURL: config.public.apiBase,
                    credentials: 'include',
                    headers
                })
                success = true
                break
            } catch (error: any) {
                lastError = error
                if (error?.status !== 405 && error?.status !== 404) {
                    // Jika bukan 405 atau 404, lempar error
                    throw error
                }
            }
        }

        if (!success) {
            throw lastError
        }

        emit('show-success-modal', 'Step berhasil dihapus')
        refresh() // Refresh roadmap data untuk mendapatkan steps terbaru
        
    } catch (error: any) {
        console.error('Error deleting step:', error)
        
        // Handle specific error messages
        if (error?.status === 405) {
            emit('show-error-modal', 'Method tidak diizinkan. Endpoint mungkin belum tersedia.')
        } else if (error?.status === 404) {
            emit('show-error-modal', 'Step tidak ditemukan atau sudah dihapus.')
        } else if (error?.status === 403) {
            emit('show-error-modal', 'Tidak memiliki izin untuk menghapus step.')
        } else if (error?.status === 401) {
            emit('show-error-modal', 'Sesi telah berakhir. Silakan login kembali.')
        } else {
            emit('show-error-modal', error?.data?.message || 'Gagal menghapus step. Silakan coba lagi.')
        }
    }
}

const handleConfirmAction = async () => {
    if (confirmModal.value.action) {
        await confirmModal.value.action()
    }
    confirmModal.value.isOpen = false
}

const handleStepSuccess = (message: string) => {
    emit('show-success-modal', message)
    refresh() // Refresh roadmap data untuk mendapatkan steps terbaru
}

const handleStepError = (message: string) => {
    emit('show-error-modal', message)
}
</script>