<template>
    <div class="overflow-hidden bg-white rounded-xl border shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Perusahaan</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Email</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Lokasi</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Status</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Bergabung</th>
                        <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="company in paginatedCompanies" :key="company.id" class="border-b border-gray-100 hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <div class="flex gap-3 items-center">
                                <div class="flex justify-center items-center w-10 h-10 rounded-full bg-primary/10">
                                    <span class="text-sm font-semibold text-primary">{{ getInitials(company.company_name) }}</span>
                                </div>
                                <div>
                                    <div class="text-sm font-medium text-gray-900">{{ company.company_name }}</div>
                                    <div class="text-xs text-gray-500 truncate max-w-[200px]">{{ company.description || 'No description' }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ company.email }}</td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ company.company_location || '-' }}</td>
                        <td class="px-6 py-4">
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
                        <td class="px-6 py-4 text-sm text-gray-600">
                            {{ formatDate(company.created_at) }}
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex gap-1 items-center">
                                <button 
                                    @click="$emit('view-company', company)"
                                    class="p-1 rounded hover:bg-gray-200"
                                    title="Lihat Detail"
                                >
                                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    @click="$emit('edit-company', company)"
                                    class="p-1 rounded hover:bg-gray-200"
                                    title="Edit"
                                >
                                    <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    @click="$emit('delete-company', company)"
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
import type { Company } from '~/types/Company'

defineProps<{
    paginatedCompanies: Company[]
}>()

defineEmits<{
    'view-company': [company: Company]
    'edit-company': [company: Company]
    'delete-company': [company: Company]
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