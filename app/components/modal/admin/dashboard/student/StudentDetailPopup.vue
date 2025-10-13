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
                <h3 class="text-xl font-semibold text-gray-900">Detail Siswa</h3>
                <button 
                    @click="closeModal"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <!-- Loading State -->
            <div v-if="loading" class="p-8 text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p class="text-gray-500 mt-2">Memuat data siswa...</p>
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
                    @click="fetchStudentDetail"
                    class="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
            
            <!-- Content -->
            <div v-else-if="studentDetail" class="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                <div class="space-y-6">
                    <!-- Profile Section -->
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                <img 
                                    v-if="studentDetail.profile_picture && studentDetail.profile_picture.trim()" 
                                    :src="studentDetail.profile_picture" 
                                    :alt="studentDetail.fullname"
                                    class="w-full h-full object-cover"
                                    @error="onImageError"
                                >
                                <div v-else class="text-gray-400 text-2xl font-bold">
                                    {{ getInitials(studentDetail.fullname) }}
                                </div>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h4 class="text-xl font-bold text-gray-900">{{ studentDetail.fullname || 'Nama tidak tersedia' }}</h4>
                            <p class="text-gray-600">{{ studentDetail.email || 'Email tidak tersedia' }}</p>
                            <p v-if="studentDetail.headline && studentDetail.headline.trim()" class="text-sm text-gray-500 mt-1">{{ studentDetail.headline }}</p>
                        </div>
                    </div>

                    <!-- Student Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <h5 class="font-semibold text-gray-900 border-b pb-2">Informasi Akademik</h5>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700">NIS</label>
                                <p class="mt-1 text-gray-900">{{ studentDetail.nis || 'Tidak tersedia' }}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Kelas</label>
                                <p class="mt-1 text-gray-900">{{ studentDetail.class || 'Tidak tersedia' }}</p>
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <h5 class="font-semibold text-gray-900 border-b pb-2">Informasi Sistem</h5>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Student ID</label>
                                <p class="mt-1 text-gray-900 font-mono text-sm">{{ studentDetail.id || 'Tidak tersedia' }}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700">User ID</label>
                                <p class="mt-1 text-gray-900 font-mono text-sm">{{ studentDetail.user_id || 'Tidak tersedia' }}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Tanggal Dibuat</label>
                                <p class="mt-1 text-gray-900">{{ studentDetail.created_at ? formatDate(studentDetail.created_at) : 'Tidak tersedia' }}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Terakhir Diperbarui</label>
                                <p class="mt-1 text-gray-900">{{ studentDetail.updated_at ? formatDate(studentDetail.updated_at) : 'Tidak tersedia' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Bio Section -->
                    <div v-if="studentDetail.bio && studentDetail.bio.trim()">
                        <h5 class="font-semibold text-gray-900 border-b pb-2 mb-3">Bio</h5>
                        <p class="text-gray-700 leading-relaxed">{{ studentDetail.bio }}</p>
                    </div>

                    <div v-if="studentDetail.cv_file">
                        <h5 class="font-semibold text-gray-900 border-b pb-2 mb-3">CV File</h5>
                        <div class="flex items-center space-x-2">
                            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                            </svg>
                            <a 
                                :href="studentDetail.cv_file" 
                                target="_blank"
                                class="text-primary hover:text-primary/80 transition-colors"
                            >
                                Download CV
                            </a>
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
import type { Student } from '~/types/Student'

interface Props {
    isOpen: boolean
    studentId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const studentDetail = ref<Student | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const isDev = process.env.NODE_ENV === 'development'

// Watch for modal open and studentId changes
watch([() => props.isOpen, () => props.studentId], async ([isOpen, studentId]) => {
    if (isOpen && studentId) {
        await fetchStudentDetail()
    } else {
        // Reset state when modal closes
        studentDetail.value = null
        error.value = null
        loading.value = false
    }
})

const fetchStudentDetail = async () => {
    if (!props.studentId) {
        error.value = 'Student ID tidak tersedia'
        return
    }
    
    try {
        loading.value = true
        error.value = null
        
        console.log('Fetching student detail for ID:', props.studentId)
        
        const response = await $fetch(`/admin/users/students/${props.studentId}`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        
        console.log('API Response:', response)
        
        if (response && response.success && response.data) {
            studentDetail.value = response.data
            console.log('Student detail set:', studentDetail.value)
        } else {
            throw new Error(response?.message || 'Data siswa tidak ditemukan')
        }
    } catch (err: any) {
        console.error('Error fetching student detail:', err)
        error.value = err.message || 'Gagal memuat detail siswa'
        studentDetail.value = null
    } finally {
        loading.value = false
    }
}

const closeModal = () => {
    emit('update:isOpen', false)
}

const getInitials = (name: string): string => {
    if (!name) return 'N/A'
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2)
}

const formatDate = (dateString: string): string => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (error) {
        return 'Format tanggal tidak valid'
    }
}

const onImageError = (event: Event) => {
    // Hide broken image and show initials instead
    const img = event.target as HTMLImageElement
    img.style.display = 'none'
}
</script>