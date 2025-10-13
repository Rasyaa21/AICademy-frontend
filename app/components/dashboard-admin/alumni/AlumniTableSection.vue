<template>
    <div class="overflow-hidden bg-white rounded-xl border shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Alumni</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Email</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Headline</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Bergabung</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="alumni in paginatedAlumni" :key="alumni.id" class="border-b border-gray-100 hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <div class="flex gap-3 items-center">
                                <!-- Alumni Avatar -->
                                <div class="flex justify-center items-center w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
                                    <img 
                                        v-if="alumni.profile_picture" 
                                        :src="alumni.profile_picture" 
                                        :alt="alumni.fullname"
                                        class="w-full h-full object-cover"
                                        @error="onImageError"
                                    />
                                    <span 
                                        v-else 
                                        class="text-sm font-semibold text-primary"
                                    >
                                        {{ getInitials(alumni.fullname) }}
                                    </span>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-sm font-medium text-gray-900 truncate">{{ alumni.fullname }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ alumni.email }}</td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ alumni.headline || '-' }}</td>
                        <td class="px-6 py-4 text-sm text-gray-600">
                            {{ formatDate(alumni.created_at) }}
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex gap-1 items-center">
                                <button 
                                    @click="$emit('view-alumni', alumni)"
                                    class="p-1 rounded hover:bg-gray-200"
                                    title="Lihat Detail"
                                >
                                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    @click="$emit('delete-alumni', alumni)"
                                    class="p-1 rounded hover:bg-gray-200"
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
import type { Alumni } from '~/types/Alumni'

defineProps<{
    paginatedAlumni: Alumni[]
}>()

defineEmits<{
    'view-alumni': [alumni: Alumni]
    'edit-alumni': [alumni: Alumni]
    'delete-alumni': [alumni: Alumni]
}>()

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

const onImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.style.display = 'none'
    // Show initials fallback
    const parent = target.parentElement
    if (parent) {
        parent.innerHTML = `<span class="text-sm font-semibold text-primary">${getInitials(target.alt || 'Alumni')}</span>`
    }
}
</script>