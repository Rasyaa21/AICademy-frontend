<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div 
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            @click="closeModal"
        ></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 class="text-xl font-semibold text-gray-900">Detail Perusahaan</h3>
                <button 
                    @click="closeModal"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                </button>
            </div>
            
            <!-- Loading State -->
            <div v-if="loading" class="p-8 text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p class="text-gray-500 mt-2">Memuat data perusahaan...</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="error" class="p-8 text-center">
                <div class="text-red-500 mb-4">
                    <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <p class="text-red-600 font-medium">{{ error }}</p>
                <button 
                    @click="fetchCompanyDetail"
                    class="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
            
            <!-- Content -->
            <div v-else-if="companyDetail" class="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                <div class="space-y-6">
                    <!-- Profile Section -->
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                <img 
                                    v-if="companyDetail.company_logo && companyDetail.company_logo.trim()" 
                                    :src="companyDetail.company_logo" 
                                    :alt="companyDetail.company_name"
                                    class="w-full h-full object-cover rounded-lg"
                                    @error="onImageError"
                                >
                                <div v-else class="text-gray-400">
                                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h4 class="text-xl font-bold text-gray-900">{{ companyDetail.company_name || 'Nama tidak tersedia' }}</h4>
                            <p class="text-gray-600 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {{ companyDetail.email || 'Email tidak tersedia' }}
                            </p>
                            <p v-if="companyDetail.company_location && companyDetail.company_location.trim()" class="text-sm text-gray-500 mt-1 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                {{ companyDetail.company_location }}
                            </p>
                        </div>
                    </div>

                    <!-- Company Information -->
                    <div class="space-y-4">
                        <h5 class="font-semibold text-gray-900 border-b pb-2">Informasi Perusahaan</h5>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Nama Perusahaan</label>
                                <p class="mt-1 text-gray-900">{{ companyDetail.company_name || 'Tidak tersedia' }}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Email</label>
                                <p class="mt-1 text-gray-900">{{ companyDetail.email || 'Tidak tersedia' }}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Lokasi Perusahaan</label>
                                <p class="mt-1 text-gray-900">{{ companyDetail.company_location || 'Tidak tersedia' }}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Logo Perusahaan</label>
                                <p class="mt-1 text-gray-900">
                                    <span v-if="companyDetail.company_logo" class="text-green-600">Ada logo</span>
                                    <span v-else class="text-gray-500">Tidak ada logo</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Description Section -->
                    <div v-if="companyDetail.description && companyDetail.description.trim()">
                        <h5 class="font-semibold text-gray-900 border-b pb-2 mb-3">Deskripsi Perusahaan</h5>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <p class="text-gray-700 leading-relaxed">{{ companyDetail.description }}</p>
                        </div>
                    </div>

                    <!-- Empty Description State -->
                    <div v-else>
                        <h5 class="font-semibold text-gray-900 border-b pb-2 mb-3">Deskripsi Perusahaan</h5>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <p class="text-gray-500 italic">Tidak ada deskripsi tersedia</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button 
                    @click="closeModal"
                    class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Tutup
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface CompanyDetail {
    id: string
    user_id: string
    company_name: string
    company_logo: string | null
    company_location: string
    description: string
    email: string
    created_at: string
}

interface Props {
    isOpen: boolean
    companyId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const companyDetail = ref<CompanyDetail | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Watch for modal open and companyId changes
watch([() => props.isOpen, () => props.companyId], async ([isOpen, companyId]) => {
    if (isOpen && companyId) {
        await fetchCompanyDetail()
    } else {
        // Reset state when modal closes
        companyDetail.value = null
        error.value = null
        loading.value = false
    }
})

const fetchCompanyDetail = async () => {
    if (!props.companyId) {
        error.value = 'Company ID tidak tersedia'
        return
    }
    
    try {
        loading.value = true
        error.value = null
        
        console.log('Fetching company detail for ID:', props.companyId)
        
        const response = await $fetch(`/admin/users/companies/${props.companyId}`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        
        console.log('API Response:', response)
        
        if (response && response.success && response.data) {
            companyDetail.value = response.data
            console.log('Company detail set:', companyDetail.value)
        } else {
            throw new Error(response?.message || 'Data perusahaan tidak ditemukan')
        }
    } catch (err: any) {
        console.error('Error fetching company detail:', err)
        error.value = err.message || 'Gagal memuat detail perusahaan'
        companyDetail.value = null
    } finally {
        loading.value = false
    }
}

const closeModal = () => {
    emit('update:isOpen', false)
}

const onImageError = (event: Event) => {
    // Hide broken image and show building icon instead
    const img = event.target as HTMLImageElement
    img.style.display = 'none'
}
</script>