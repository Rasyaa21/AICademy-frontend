<template>
    <PostInternshipModal
        v-model:isOpen="postInternshipModal.isOpen"
        :company-id="props.companyId"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
        @internship-posted="fetchCompanyInternships"
    />

    <SubmissionsListModal
        v-model:isOpen="submissionsModal.isOpen"
        :internship="selectedInternship"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
        @submission-updated="fetchCompanyInternships"
    />

    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            @click="closeModal"
        ></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <h3 class="text-xl font-semibold text-gray-900">Detail Perusahaan</h3>
                <button 
                    @click="closeModal"
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
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
            <div v-else-if="companyDetail" class="flex max-h-[calc(95vh-80px)]">
                <!-- Left Panel - Company Info -->
                <div class="w-2/5 border-r border-gray-200 overflow-y-auto bg-gray-50">
                    <div class="p-6 space-y-6">
                        <!-- Profile Section -->
                        <div class="flex items-start space-x-4 bg-white rounded-lg p-4 shadow-sm">
                            <div class="flex-shrink-0">
                                <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                    <img 
                                        v-if="companyDetail.company_logo && companyDetail.company_logo.trim()" 
                                        :src="companyDetail.company_logo" 
                                        :alt="companyDetail.company_name"
                                        class="w-full h-full object-cover rounded-lg"
                                        @error="onImageError"
                                    >
                                    <div v-else class="text-gray-400">
                                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="flex-1">
                                <h4 class="text-lg font-bold text-gray-900">{{ companyDetail.company_name || 'Nama tidak tersedia' }}</h4>
                                <p class="text-gray-600 text-sm flex items-center mt-1">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {{ companyDetail.email || 'Email tidak tersedia' }}
                                </p>
                                <p v-if="companyDetail.company_location && companyDetail.company_location.trim()" class="text-xs text-gray-500 mt-1 flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    {{ companyDetail.company_location }}
                                </p>
                            </div>
                        </div>

                        <!-- Company Information Grid -->
                        <div class="bg-white rounded-lg p-4 shadow-sm">
                            <h5 class="font-semibold text-gray-900 border-b pb-2 mb-4">Informasi Perusahaan</h5>
                            
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Perusahaan</label>
                                    <p class="mt-1 text-sm text-gray-900">{{ companyDetail.company_name || 'Tidak tersedia' }}</p>
                                </div>
                                
                                <div>
                                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                                    <p class="mt-1 text-sm text-gray-900">{{ companyDetail.email || 'Tidak tersedia' }}</p>
                                </div>
                                
                                <div>
                                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</label>
                                    <p class="mt-1 text-sm text-gray-900">{{ companyDetail.company_location || 'Tidak tersedia' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Description Section -->
                        <div class="bg-white rounded-lg p-4 shadow-sm">
                            <h5 class="font-semibold text-gray-900 border-b pb-2 mb-3">Deskripsi Perusahaan</h5>
                            <div class="bg-gray-50 rounded-lg p-3">
                                <p v-if="companyDetail.description && companyDetail.description.trim()" class="text-sm text-gray-700 leading-relaxed">
                                    {{ companyDetail.description }}
                                </p>
                                <p v-else class="text-sm text-gray-500 italic">Tidak ada deskripsi tersedia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Panel - Internships -->
                <div class="w-3/5 overflow-y-auto bg-white">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h5 class="text-lg font-semibold text-gray-900">Daftar Internship</h5>
                            <button
                                @click="postInternshipModal.isOpen = true"
                                class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 active:bg-primary/95 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                            >
                                <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                                Post Internship
                            </button>
                        </div>

                        <!-- Internships Loading -->
                        <div v-if="internshipsLoading" class="text-center py-8">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                            <p class="text-gray-500 mt-2 text-sm">Memuat internships...</p>
                        </div>

                        <!-- Internships Error -->
                        <div v-else-if="internshipsError" class="text-center py-8">
                            <p class="text-red-600 text-sm">{{ internshipsError }}</p>
                            <button 
                                @click="fetchCompanyInternships"
                                class="mt-2 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Coba Lagi
                            </button>
                        </div>

                        <!-- Internships List -->
                        <div v-else-if="internships && internships.length > 0" class="space-y-4">
                            <div 
                                v-for="internship in internships" 
                                :key="internship.id"
                                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white"
                            >
                                <div class="space-y-3">
                                    <h6 class="font-semibold text-gray-900 text-sm">{{ internship.title }}</h6>
                                    <p class="text-gray-600 text-xs line-clamp-2">{{ internship.description }}</p>
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3 text-xs text-gray-500">
                                            <span class="flex items-center gap-1">
                                                <Icon name="heroicons:tag-20-solid" class="w-3 h-3" />
                                                {{ internship.type }}
                                            </span>
                                            <span class="flex items-center gap-1">
                                                <Icon name="heroicons:users-20-solid" class="w-3 h-3" />
                                                {{ internship.submissions_count || 0 }}
                                            </span>
                                        </div>
                                        <button
                                            @click="viewSubmissions(internship)"
                                            class="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 active:bg-blue-200 transition-all duration-200 border border-blue-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            View ({{ internship.submissions_count || 0 }})
                                        </button>
                                    </div>
                                    <div class="text-xs text-gray-400">
                                        Deadline: {{ formatDate(internship.deadline) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empty Internships State -->
                        <div v-else class="text-center py-12">
                            <div class="text-gray-400 mb-4">
                                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6M16 6h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2" />
                                </svg>
                            </div>
                            <p class="text-gray-500 text-sm mb-4">Belum ada internship yang diposting</p>
                            <button
                                @click="postInternshipModal.isOpen = true"
                                class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 active:bg-primary/95 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                            >
                                Post Internship Pertama
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button 
                    @click="closeModal"
                    class="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:ring-offset-2"
                >
                    Tutup
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SubmissionsListModal from './SubmissionsListModal.vue'
import PostInternshipModal from './PostInternshipModal.vue'

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

interface Internship {
    id: string
    company_id: string
    title: string
    description: string
    type: string
    deadline: string
    created_at: string
    submissions_count: number
    submissions: Submission[]
}

interface Submission {
    id: string
    student_id: string
    internship_id: string
    status: 'pending' | 'approved' | 'rejected'
    applied_at: string
    student: {
        id: string
        fullname: string
        email: string
        nis: string
        class: string
        headline?: string
    }
}

interface Props {
    isOpen: boolean
    companyId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const companyDetail = ref<CompanyDetail | null>(null)
const internships = ref<Internship[]>([])
const loading = ref(false)
const internshipsLoading = ref(false)
const error = ref<string | null>(null)
const internshipsError = ref<string | null>(null)

// Modal states
const postInternshipModal = ref({ isOpen: false })
const submissionsModal = ref({ isOpen: false })
const selectedInternship = ref<Internship | null>(null)

// Watch for modal open and companyId changes
watch([() => props.isOpen, () => props.companyId], async ([isOpen, companyId]) => {
    console.log('Modal watch triggered:', { isOpen, companyId })
    if (isOpen && companyId) {
        await fetchCompanyDetail()
        await fetchCompanyInternships()
    } else {
        // Reset state when modal closes
        companyDetail.value = null
        internships.value = []
        error.value = null
        internshipsError.value = null
        loading.value = false
        internshipsLoading.value = false
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
        
        console.log('Company detail response:', response)
        
        if (response && response.success && response.data) {
            companyDetail.value = response.data
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

const fetchCompanyInternships = async () => {
    if (!props.companyId) {
        internshipsError.value = 'Company ID tidak tersedia'
        return
    }
    
    try {
        internshipsLoading.value = true
        internshipsError.value = null
        
        console.log('Fetching company internships for ID:', props.companyId)
        
        const response = await $fetch(`/admin/company/${props.companyId}/internships-with-submissions`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        
        console.log('Company internships response:', response)
        
        if (response && response.success) {
            internships.value = response.data || []
            console.log('Internships set to:', internships.value)
        } else {
            throw new Error(response?.message || 'Gagal memuat data internships')
        }
    } catch (err: any) {
        console.error('Error fetching company internships:', err)
        internshipsError.value = err.message || 'Gagal memuat data internships'
        internships.value = []
    } finally {
        internshipsLoading.value = false
    }
}

const viewSubmissions = (internship: Internship) => {
    selectedInternship.value = internship
    submissionsModal.value.isOpen = true
}

const closeModal = () => {
    emit('update:isOpen', false)
}

const onImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.style.display = 'none'
}

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } catch {
        return dateString
    }
}

const showSuccessModal = (message: string) => {
    emit('show-success-modal', message)
}

const showErrorModal = (message: string) => {
    emit('show-error-modal', message)
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>