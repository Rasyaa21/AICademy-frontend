<template>
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Roadmap</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Status</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Steps</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Dibuat</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="roadmap in roadmaps" :key="roadmap.id" class="border-b border-gray-100 hover:bg-gray-50">
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Icon name="heroicons:map-20-solid" class="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900 text-sm">{{ roadmap.roadmap_name }}</div>
                                    <div class="text-xs text-gray-500 max-w-xs truncate">{{ roadmap.description }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6">
                            <span 
                                class="px-2 py-1 rounded-full text-xs font-medium"
                                :class="{
                                    'bg-green-100 text-green-800': roadmap.status === 'active',
                                    'bg-yellow-100 text-yellow-800': roadmap.status === 'draft',
                                    'bg-red-100 text-red-800': roadmap.status === 'inactive'
                                }"
                            >
                                {{ roadmap.status === 'active' ? 'Aktif' : roadmap.status === 'draft' ? 'Draft' : 'Tidak Aktif' }}
                            </span>
                        </td>
                        <td class="py-4 px-6 text-sm text-gray-600">
                            {{ roadmap.total_steps || 0 }} step
                        </td>
                        <td class="py-4 px-6 text-sm text-gray-600">
                            {{ formatDate(roadmap.created_at) }}
                        </td>
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-1">
                                <button 
                                    @click="$emit('view-roadmap', roadmap)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Lihat Detail"
                                >
                                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    @click="$emit('edit-roadmap', roadmap)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Edit"
                                >
                                    <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-blue-600" />
                                </button>
                                <button 
                                    @click="$emit('edit-status', roadmap)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Ubah Status"
                                >
                                    <Icon name="heroicons:arrow-path-20-solid" class="w-4 h-4 text-yellow-600" />
                                </button>
                                <button 
                                    @click="$emit('delete-roadmap', roadmap)"
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
</template>

<script setup lang="ts">
import type { Roadmap } from '~/types/Roadmap'

defineProps<{
    roadmaps: Roadmap[]
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}>()

const emit = defineEmits<{
    (e: 'view-roadmap', roadmap: Roadmap): void
    (e: 'edit-roadmap', roadmap: Roadmap): void
    (e: 'delete-roadmap', roadmap: Roadmap): void
    (e: 'edit-status', roadmap: Roadmap): void
    (e: 'page-changed', page: number): void
}>()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}
</script>

<style scoped>
/* Add any specific styles for the RoadmapTableSection component here */
</style>