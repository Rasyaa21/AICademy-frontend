<template>
    <div class="overflow-x-auto">
        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-2 font-semibold text-gray-900 text-sm">Challenge</th>
                    <th class="text-left py-3 px-2 font-semibold text-gray-900 text-sm">Penyelenggara</th>
                    <th class="text-left py-3 px-2 font-semibold text-gray-900 text-sm">Jumlah Peserta</th>
                    <th class="text-left py-3 px-2 font-semibold text-gray-900 text-sm">Deadline</th>
                    <th class="text-left py-3 px-2 font-semibold text-gray-900 text-sm">Status</th>
                    <th class="text-left py-3 px-2 font-semibold text-gray-900 text-sm">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="challenge in challenges" :key="challenge.id" class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-2">
                        <div class="flex items-center gap-3">
                            <img 
                                :src="challenge.thumbnail_image" 
                                :alt="challenge.title"
                                class="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                                <div class="font-medium text-gray-900 text-sm">{{ challenge.title }}</div>
                                <div class="text-xs text-gray-500">{{ challenge.prize || 'No Prize' }}</div>
                            </div>
                        </div>
                    </td>
                    <td class="py-3 px-2 text-sm text-gray-600">{{ challenge.organizer }}</td>
                    <td class="py-3 px-2">
                        <div class="flex items-center gap-1">
                            <Icon name="heroicons:users-20-solid" class="w-4 h-4 text-gray-400" />
                            <span class="text-sm text-gray-900">{{ challenge.participant }}</span>
                        </div>
                    </td>
                    <td class="py-3 px-2 text-sm text-gray-600">
                        {{ formatDate(challenge.deadline) }}
                    </td>
                    <td class="py-3 px-2">
                        <span 
                            :class="[
                                'px-2 py-1 rounded-full text-xs font-medium',
                                isActive(challenge.deadline) 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            ]"
                        >
                            {{ isActive(challenge.deadline) ? 'Aktif' : 'Berakhir' }}
                        </span>
                    </td>
                    <td class="py-3 px-2">
                        <div class="flex items-center gap-1">
                            <button class="p-1 hover:bg-gray-200 rounded">
                                <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                            </button>
                            <button class="p-1 hover:bg-gray-200 rounded">
                                <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import type { Challenge } from '~/types/Challange'

interface Props {
    challenges: Challenge[]
}

defineProps<Props>()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const isActive = (deadline: string) => {
    return new Date(deadline) > new Date()
}
</script>