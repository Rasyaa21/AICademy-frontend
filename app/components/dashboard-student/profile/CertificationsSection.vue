<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-xl font-semibold text-gray-900">Certifications</h2>
                <p class="text-gray-600 text-sm mt-1">Your professional achievements</p>
            </div>
            <button 
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium"
                @click="$emit('create-certification')"
            >
                <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                Tambah Sertifikat
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-xl h-72 animate-pulse" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <div class="text-red-500 mb-4">
                <Icon name="heroicons:exclamation-triangle-20-solid" class="w-12 h-12 mx-auto" />
            </div>
            <p class="text-red-600 font-medium mb-4">{{ error }}</p>
            <button 
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                @click="$emit('retry')"
            >
                Coba Lagi
            </button>
        </div>

        <!-- Certifications Grid -->
        <div v-else-if="certifications.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CertificationCard 
                v-for="certification in certifications" 
                :key="certification.id"
                :certification="certification"
                @view="$emit('view-certification', $event)"
                @delete="$emit('delete-certification', $event)"
            />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <div class="text-gray-400 mb-4">
                <Icon name="heroicons:academic-cap-20-solid" class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada sertifikat</h3>
            <p class="text-gray-600 mb-6">Tampilkan keahlian Anda dengan menambahkan sertifikat profesional</p>
            <button 
                class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                @click="$emit('create-certification')"
            >
                Tambah Sertifikat Pertama
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Certification } from '~/types/Profile'
import CertificationCard from './CertificationCard.vue'

defineProps<{
    certifications: Certification[]
    loading: boolean
    error: string | null
}>()

defineEmits<{
    'create-certification': []
    'view-certification': [certification: Certification]
    'delete-certification': [certification: Certification]
    'retry': []
}>()
</script>