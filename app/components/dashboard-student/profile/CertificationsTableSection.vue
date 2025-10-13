<template>
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <div class="text-red-500 mb-4">{{ error }}</div>
            <button 
                @click="$emit('retry')"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
                Coba Lagi
            </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!certifications.length" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:academic-cap-20-solid" class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada sertifikat</h3>
            <p class="text-gray-500 mb-6">Tambahkan sertifikat untuk menunjukkan pencapaian dan kredibilitas Anda</p>
            <button 
                @click="$emit('create-certification')"
                class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto font-medium"
            >
                <Icon name="heroicons:plus-20-solid" class="w-5 h-5" />
                Tambah Sertifikat
            </button>
        </div>

        <!-- Table Content -->
        <div v-else class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Sertifikat</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Penerbit</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Tanggal Terbit</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Status</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="certification in certifications" :key="certification.id" class="border-b border-gray-100 hover:bg-gray-50">
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon name="heroicons:academic-cap-20-solid" class="w-5 h-5 text-green-600" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="font-medium text-gray-900 text-sm">{{ certification.name }}</div>
                                    <div v-if="certification.credential_id" class="text-xs text-gray-500">
                                        ID: {{ certification.credential_id }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-sm text-gray-600">
                            {{ certification.issuing_organization }}
                        </td>
                        <td class="py-4 px-6 text-sm text-gray-600">
                            <div class="space-y-1">
                                <div>{{ formatDate(certification.issue_date) }}</div>
                                <div v-if="certification.expiration_date" class="text-xs text-gray-500">
                                    Exp: {{ formatDate(certification.expiration_date) }}
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6">
                            <span :class="[
                                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                                getStatusClass(certification)
                            ]">
                                <div :class="[
                                    'w-1.5 h-1.5 rounded-full mr-1.5',
                                    getStatusDotClass(certification)
                                ]"></div>
                                {{ getStatusText(certification) }}
                            </span>
                        </td>
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-1">
                                <button 
                                    @click="$emit('view-certification', certification)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Lihat Detail"
                                >
                                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    v-if="certification.credential_url"
                                    @click="openLink(certification.credential_url)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Verifikasi Sertifikat"
                                >
                                    <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-4 h-4 text-blue-600" />
                                </button>
                                <button 
                                    @click="$emit('delete-certification', certification)"
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
import type { Certification } from '~/types/Profile'

defineProps<{
    certifications: Certification[]
    loading?: boolean
    error?: string | null
}>()

defineEmits<{
    'view-certification': [certification: Certification]
    'delete-certification': [certification: Certification]
    'create-certification': []
    'retry': []
}>()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const getStatusClass = (certification: Certification) => {
    if (certification.is_expired) {
        return 'bg-red-100 text-red-800'
    } else if (certification.is_expiring_soon) {
        return 'bg-yellow-100 text-yellow-800'
    } else {
        return 'bg-green-100 text-green-800'
    }
}

const getStatusDotClass = (certification: Certification) => {
    if (certification.is_expired) {
        return 'bg-red-400'
    } else if (certification.is_expiring_soon) {
        return 'bg-yellow-400'
    } else {
        return 'bg-green-400'
    }
}

const getStatusText = (certification: Certification) => {
    if (certification.is_expired) {
        return 'Kedaluwarsa'
    } else if (certification.is_expiring_soon) {
        return 'Akan Kedaluwarsa'
    } else {
        return 'Aktif'
    }
}

const openLink = (url: string) => {
    window.open(url, '_blank')
}
</script>