<template>
    <div class="overflow-hidden bg-white rounded-xl border shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Challenge</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Prize</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Deadline</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Peserta</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Status</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="challenge in paginatedChallenges" :key="challenge.id" class="border-b border-gray-100 hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <div class="flex gap-3 items-center">
                                <div class="flex justify-center items-center w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
                                    <Icon name="heroicons:trophy-20-solid" class="w-6 h-6 text-primary" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-sm font-medium text-gray-900 truncate">{{ challenge.title }}</div>
                                    <div class="text-xs text-gray-500 truncate max-w-[200px]">{{ challenge.description || 'No description' }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ challenge.prize }}</td>
                        <td class="px-6 py-4 text-sm text-gray-600">
                            {{ formatDate(challenge.deadline) }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">
                            {{ challenge.current_participants || 0 }} / {{ challenge.max_participants }}
                        </td>
                        <td class="px-6 py-4">
                            <span 
                                :class="getStatusClass(challenge.deadline)"
                                class="px-2 py-1 text-xs font-medium rounded-full"
                            >
                                {{ getStatusText(challenge.deadline) }}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex gap-1 items-center">
                                <button 
                                    class="p-1 rounded hover:bg-gray-200"
                                    title="Lihat Detail"
                                    @click="$emit('view-challenge', challenge)"
                                >
                                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    class="p-1 rounded hover:bg-gray-200"
                                    title="Edit"
                                    @click="$emit('edit-challenge', challenge)"
                                >
                                    <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    class="p-1 rounded hover:bg-gray-200"
                                    title="Hapus"
                                    @click="$emit('delete-challenge', challenge)"
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
import type { Challenge } from '~/types/Challenge'

defineProps<{
    paginatedChallenges: Challenge[]
}>()

defineEmits<{
    'view-challenge': [challenge: Challenge]
    'edit-challenge': [challenge: Challenge]
    'delete-challenge': [challenge: Challenge]
}>()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getStatusText = (deadline: string) => {
    return new Date(deadline) > new Date() ? 'Aktif' : 'Selesai'
}

const getStatusClass = (deadline: string) => {
    return new Date(deadline) > new Date() 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
}
</script>