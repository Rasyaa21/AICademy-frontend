<template>
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Guru</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Email</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Status</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Bergabung</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="teacher in paginatedTeachers" :key="teacher.id" class="border-b border-gray-100 hover:bg-gray-50">
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span class="text-primary font-semibold text-sm">{{ getInitials(teacher.fullname) }}</span>
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900 text-sm">{{ teacher.fullname }}</div>
                                    <div class="text-xs text-gray-500">{{ teacher.role }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-sm text-gray-600">{{ teacher.email }}</td>
                        <td class="py-4 px-6">
                            <span 
                                :class="[
                                    'px-2 py-1 rounded-full text-xs font-medium',
                                    teacher.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                ]"
                            >
                                {{ teacher.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                            </span>
                        </td>
                        <td class="py-4 px-6 text-sm text-gray-600">
                            {{ formatDate(teacher.created_at) }}
                        </td>
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-1">
                                <button 
                                    @click="$emit('view-teacher', teacher)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Lihat Detail"
                                >
                                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    @click="$emit('edit-teacher', teacher)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Edit"
                                >
                                    <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    @click="$emit('delete-teacher', teacher)"
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
import type { Teacher } from '~/types/Teacher'

defineProps<{
    paginatedTeachers: Teacher[]
}>()

defineEmits<{
    'view-teacher': [teacher: Teacher]
    'edit-teacher': [teacher: Teacher]
    'delete-teacher': [teacher: Teacher]
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
</script> 