<template>
    <div class="overflow-hidden relative min-h-screen bg-gradient-to-b to-red-700 from-primary">
        <div class="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl md:w-72 md:h-72 bg-white/10"></div>
        <div class="absolute -right-10 -bottom-20 w-64 h-64 rounded-full blur-3xl md:w-96 md:h-96 bg-pink-400/20"></div>
        
        <div class="hidden absolute top-32 right-32 w-16 h-16 rounded-lg rotate-45 md:block bg-white/5"></div>
        <div class="hidden absolute bottom-32 left-48 w-20 h-20 rounded-full md:block bg-white/5"></div>
        <div class="hidden absolute left-8 top-1/2 w-6 h-6 rounded-full sm:block md:w-8 md:h-8 bg-white/10"></div>
        <div class="hidden absolute right-16 top-1/4 w-8 h-8 rounded-lg rotate-12 sm:block md:w-12 md:h-12 bg-white/5"></div>

        <div class="absolute right-8 top-1/3 md:right-24 lg:right-32 animate-float-delayed">
            <div class="p-2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 md:p-3">
                <Icon name="heroicons:star-20-solid" class="w-full h-full text-white opacity-80" />
            </div>
        </div>

        <div class="absolute left-4 bottom-32 md:bottom-40 md:left-16 animate-float-slow">
            <div class="p-2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 md:p-3">
                <Icon name="heroicons:briefcase-20-solid" class="w-full h-full text-white opacity-80" />
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                <p class="text-white">Memuat profil...</p>
            </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="flex items-center justify-center min-h-screen">
            <div class="text-center text-white">
                <div class="mb-4">
                    <Icon name="heroicons:exclamation-triangle-20-solid" class="w-16 h-16 mx-auto opacity-80" />
                </div>
                <h2 class="text-xl font-semibold mb-2">Profil Tidak Ditemukan</h2>
                <p class="mb-6 opacity-80">{{ error }}</p>
                <NuxtLink 
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Icon name="heroicons:home-20-solid" class="w-4 h-4 mr-2" />
                    Kembali ke Beranda
                </NuxtLink>
            </div>
        </div>

        <!-- Profile content -->
        <div v-else-if="profileData" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Profile Card -->
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
                <div class="flex flex-col lg:flex-row items-start gap-8">
                    <!-- Profile Picture -->
                    <div class="flex-shrink-0 relative">
                        <div v-if="profileData.profile_picture" class="w-36 h-36 rounded-2xl overflow-hidden shadow-lg">
                            <img 
                                :src="profileData.profile_picture" 
                                :alt="profileData.fullname"
                                class="w-full h-full object-cover"
                                @error="handleImageError"
                            >
                        </div>
                        <div v-else class="w-36 h-36 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                            {{ getInitials(profileData.fullname) }}
                        </div>
                        <!-- Online indicator -->
                        <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                    </div>
                    
                    <!-- Profile Info -->
                    <div class="flex-1 space-y-4">
                        <div>
                            <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ profileData.fullname }}</h1>
                            <div class="flex flex-wrap items-center gap-4 mb-3">
                                <span class="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                                    {{ profileData.class }}
                                </span>
                                <span class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                    NIS: {{ profileData.nis }}
                                </span>
                                <span class="text-gray-500 text-sm flex items-center gap-1">
                                    <Icon name="heroicons:calendar-20-solid" class="w-4 h-4" />
                                    Bergabung {{ formatJoinDate(profileData.joined_at) }}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Headline -->
                        <div v-if="profileData.headline">
                            <p class="text-xl text-primary font-semibold">{{ profileData.headline }}</p>
                        </div>
                        
                        <!-- Bio -->
                        <div v-if="profileData.bio">
                            <p class="text-gray-700 leading-relaxed text-lg">{{ profileData.bio }}</p>
                        </div>

                        <!-- Quick Stats -->
                        <div class="flex flex-wrap gap-6 pt-4">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-900">{{ profileData.projects?.length || 0 }}</div>
                                <div class="text-sm text-gray-600">Proyek</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-900">{{ profileData.experiences?.length || 0 }}</div>
                                <div class="text-sm text-gray-600">Pengalaman</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-900">{{ profileData.certifications?.length || 0 }}</div>
                                <div class="text-sm text-gray-600">Sertifikat</div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-3 pt-4">
                            <button
                                v-if="profileData.show_cv"
                                @click="viewCV"
                                class="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
                            >
                                <Icon name="heroicons:document-text-20-solid" class="w-5 h-5" />
                                Lihat CV
                            </button>
                            <button
                                v-if="profileData.show_email"
                                @click="copyEmail"
                                class="px-6 py-3 border-2 border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors flex items-center gap-2 font-medium"
                            >
                                <Icon name="heroicons:envelope-20-solid" class="w-5 h-5" />
                                Kontak
                            </button>
                            <button
                                @click="shareProfile"
                                class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            >
                                <Icon name="heroicons:share-20-solid" class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Recommended Role -->
                <div v-if="profileData.recommended_role" class="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div class="flex items-center gap-3 mb-4">
                        <Icon name="heroicons:sparkles-20-solid" class="w-6 h-6 text-blue-600" />
                        <span class="font-semibold text-blue-900 text-lg">Role Rekomendasi</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-blue-900 mb-2">{{ profileData.recommended_role.role_name }}</h3>
                            <p class="text-blue-800 mb-2">{{ profileData.recommended_role.role_description }}</p>
                            <p class="text-sm text-blue-700">{{ profileData.recommended_role.justification }}</p>
                        </div>
                        <div class="ml-6 text-center">
                            <div class="text-3xl font-bold text-blue-600">{{ profileData.recommended_role.score }}%</div>
                            <div class="text-sm text-blue-500">Match</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Tabs -->
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <!-- Tab Navigation -->
                <div class="border-b border-gray-200 bg-white/50">
                    <nav class="flex space-x-8 px-8" aria-label="Tabs">
                        <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            :class="[
                                activeTab === tab.id
                                    ? 'border-primary text-primary bg-primary/5'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                'whitespace-nowrap py-4 px-4 border-b-2 font-semibold text-sm rounded-t-lg transition-all'
                            ]"
                            @click="activeTab = tab.id"
                        >
                            <Icon :name="tab.icon" class="w-5 h-5 inline mr-2" />
                            {{ tab.name }}
                            <span v-if="tab.count !== undefined" class="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {{ tab.count }}
                            </span>
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div class="p-8">
                    <!-- Experience Tab -->
                    <div v-if="activeTab === 'experiences'">
                        <div v-if="!profileData?.experiences || profileData.experiences.length === 0" class="text-center py-16">
                            <div class="text-gray-400 mb-6">
                                <Icon name="heroicons:briefcase-20-solid" class="w-20 h-20 mx-auto" />
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-3">Belum Ada Pengalaman</h3>
                            <p class="text-gray-600">Student ini belum menambahkan pengalaman kerja.</p>
                        </div>
                        
                        <div v-else class="space-y-8">
                            <div 
                                v-for="experience in profileData.experiences" 
                                :key="experience.id"
                                class="flex gap-6 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <!-- Company Logo Placeholder -->
                                <div class="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                                    <Icon name="heroicons:building-office-2-20-solid" class="w-8 h-8 text-gray-400" />
                                </div>
                                
                                <div class="flex-1">
                                    <div class="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 class="text-xl font-bold text-gray-900 mb-1">{{ experience.position }}</h3>
                                            <p class="text-primary font-semibold text-lg">{{ experience.company_name }}</p>
                                            <div class="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                                <span class="flex items-center gap-1">
                                                    <Icon name="heroicons:calendar-20-solid" class="w-4 h-4" />
                                                    {{ formatWorkDuration(experience.start_date, experience.end_date, experience.is_current) }}
                                                </span>
                                                <span class="flex items-center gap-1">
                                                    <Icon name="heroicons:map-pin-20-solid" class="w-4 h-4" />
                                                    {{ experience.location }} • {{ experience.location_type }}
                                                </span>
                                                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                    {{ experience.employment_type }}
                                                </span>
                                            </div>
                                        </div>
                                        <span v-if="experience.is_current" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                            Saat Ini
                                        </span>
                                    </div>
                                    
                                    <div class="space-y-4 text-gray-700">
                                        <div v-if="experience.description">
                                            <p class="leading-relaxed">{{ experience.description }}</p>
                                        </div>
                                        
                                        <div v-if="experience.responsibilities" class="bg-white rounded-lg p-4">
                                            <h4 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <Icon name="heroicons:clipboard-document-list-20-solid" class="w-5 h-5 text-primary" />
                                                Tanggung Jawab
                                            </h4>
                                            <p class="text-sm leading-relaxed">{{ experience.responsibilities }}</p>
                                        </div>
                                        
                                        <div v-if="experience.achievements" class="bg-white rounded-lg p-4">
                                            <h4 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <Icon name="heroicons:trophy-20-solid" class="w-5 h-5 text-yellow-500" />
                                                Pencapaian
                                            </h4>
                                            <p class="text-sm leading-relaxed">{{ experience.achievements }}</p>
                                        </div>
                                        
                                        <div v-if="experience.skills" class="bg-white rounded-lg p-4">
                                            <h4 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <Icon name="heroicons:cog-6-tooth-20-solid" class="w-5 h-5 text-blue-500" />
                                                Keahlian
                                            </h4>
                                            <p class="text-sm leading-relaxed">{{ experience.skills }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Projects Tab -->
                    <div v-if="activeTab === 'projects'">                        
                        <div v-if="!profileData?.projects || profileData.projects.length === 0" class="text-center py-16">
                            <div class="text-gray-400 mb-6">
                                <Icon name="heroicons:folder-plus-20-solid" class="w-20 h-20 mx-auto" />
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-3">Belum Ada Proyek</h3>
                            <p class="text-gray-600">Student ini belum menambahkan proyek apapun.</p>
                        </div>
                        
                        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            <div 
                                v-for="project in profileData.projects" 
                                :key="project.id"
                                class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <!-- Project Image -->
                                <div class="aspect-video bg-gradient-to-br from-primary/10 to-blue-100">
                                    <img 
                                        v-if="project.photos && project.photos.length > 0"
                                        :src="project.photos[0].url" 
                                        :alt="project.project_name"
                                        class="w-full h-full object-cover"
                                    >
                                    <div v-else class="w-full h-full flex items-center justify-center text-primary">
                                        <Icon name="heroicons:code-bracket-20-solid" class="w-16 h-16" />
                                    </div>
                                </div>
                                
                                <!-- Project Content -->
                                <div class="p-6">
                                    <div class="flex items-start justify-between mb-3">
                                        <h3 class="font-bold text-gray-900 text-xl">{{ project.project_name }}</h3>
                                        <span 
                                            :class="[
                                                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                                                project.is_completed 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            ]"
                                        >
                                            {{ project.is_completed ? 'Selesai' : 'Berlangsung' }}
                                        </span>
                                    </div>
                                    
                                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ project.description }}</p>
                                    
                                    <!-- Project Dates -->
                                    <div class="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                        <Icon name="heroicons:calendar-20-solid" class="w-4 h-4" />
                                        {{ formatDate(project.start_date) }} - {{ formatDate(project.end_date) }}
                                    </div>
                                    
                                    <!-- Project Links -->
                                    <div class="flex gap-3">
                                        <a 
                                            v-if="project.link_url"
                                            :href="project.link_url" 
                                            target="_blank"
                                            class="flex-1 text-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                            <Icon name="heroicons:link-20-solid" class="w-4 h-4 inline mr-2" />
                                            Lihat Proyek
                                        </a>
                                        <div v-if="project.photo_count > 0" class="flex items-center gap-1 text-sm text-gray-500 px-3 py-2">
                                            <Icon name="heroicons:photo-20-solid" class="w-4 h-4" />
                                            {{ project.photo_count }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Certifications Tab -->
                    <div v-if="activeTab === 'certifications'">                        
                        <div v-if="!profileData?.certifications || profileData.certifications.length === 0" class="text-center py-16">
                            <div class="text-gray-400 mb-6">
                                <Icon name="heroicons:academic-cap-20-solid" class="w-20 h-20 mx-auto" />
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-3">Belum Ada Sertifikat</h3>
                            <p class="text-gray-600">Student ini belum menambahkan sertifikat apapun.</p>
                        </div>
                        
                        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            <div 
                                v-for="certification in profileData.certifications" 
                                :key="certification.id"
                                class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <!-- Certification Image -->
                                <div class="aspect-video bg-gradient-to-br from-yellow-50 to-orange-100">
                                    <img 
                                        v-if="certification.photos && certification.photos.length > 0"
                                        :src="certification.photos[0]?.url" 
                                        :alt="certification.name"
                                        class="w-full h-full object-cover"
                                    >
                                    <div v-else class="w-full h-full flex items-center justify-center text-yellow-600">
                                        <Icon name="heroicons:trophy-20-solid" class="w-16 h-16" />
                                    </div>
                                </div>
                                
                                <!-- Certification Content -->
                                <div class="p-6">
                                    <div class="flex items-start justify-between mb-3">
                                        <h3 class="font-bold text-gray-900 text-xl line-clamp-2">{{ certification.name }}</h3>
                                        <span 
                                            v-if="certification.expiration_date"
                                            :class="[
                                                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ml-2',
                                                certification.is_expired
                                                    ? 'bg-red-100 text-red-800'
                                                    : certification.is_expiring_soon
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            ]"
                                        >
                                            {{ certification.is_expired ? 'Kedaluwarsa' : certification.is_expiring_soon ? 'Segera Berakhir' : 'Berlaku' }}
                                        </span>
                                    </div>
                                    
                                    <p class="text-primary font-semibold mb-4">{{ certification.issuing_organization }}</p>
                                    
                                    <div class="text-sm text-gray-600 space-y-2 mb-4">
                                        <p class="flex items-center gap-2">
                                            <Icon name="heroicons:calendar-20-solid" class="w-4 h-4" />
                                            Terbit: {{ formatDate(certification.issue_date) }}
                                        </p>
                                        <p v-if="certification.expiration_date" class="flex items-center gap-2">
                                            <Icon name="heroicons:clock-20-solid" class="w-4 h-4" />
                                            Berakhir: {{ formatDate(certification.expiration_date) }}
                                        </p>
                                        <p v-if="certification.credential_id" class="text-xs text-gray-500">
                                            ID: {{ certification.credential_id }}
                                        </p>
                                    </div>
                                    
                                    <!-- Credential Link -->
                                    <div v-if="certification.credential_url">
                                        <a 
                                            :href="certification.credential_url" 
                                            target="_blank"
                                            class="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                            <Icon name="heroicons:link-20-solid" class="w-4 h-4 mr-2" />
                                            Lihat Kredensial
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Notification -->
        <div
            v-if="showToast"
            class="fixed bottom-6 right-6 bg-white text-gray-900 px-6 py-4 rounded-xl shadow-xl border border-gray-200 transition-all duration-300 z-50"
        >
            <div class="flex items-center gap-3">
                <Icon name="heroicons:check-circle-20-solid" class="w-5 h-5 text-green-500" />
                {{ toastMessage }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { StudentProfile } from '~/types/Profile'

const route = useRoute()
const config = useRuntimeConfig()

// Get NIS from route params
const nis = route.params.nis as string

// Reactive data
const activeTab = ref('experiences')
const profileData = ref<StudentProfile | null>(null)
const showToast = ref(false)
const toastMessage = ref('')

// Loading states
const loading = ref(true)
const error = ref<string | null>(null)

// Computed tabs with counts
const tabs = computed(() => [
    { 
        id: 'experiences', 
        name: 'Pengalaman', 
        icon: 'heroicons:briefcase-20-solid',
        count: profileData.value?.experiences?.length || 0
    },
    { 
        id: 'projects', 
        name: 'Proyek', 
        icon: 'heroicons:folder-20-solid',
        count: profileData.value?.projects?.length || 0
    },
    { 
        id: 'certifications', 
        name: 'Sertifikat', 
        icon: 'heroicons:academic-cap-20-solid',
        count: profileData.value?.certifications?.length || 0
    }
])

// Fetch profile data
const fetchProfile = async () => {
    try {
        const response = await $fetch<{success: boolean, data: StudentProfile, message: string}>(`/profile/${nis}`, {
            baseURL: config.public.apiBase
        })
        
        if (response?.success) {
            profileData.value = response.data
        } else {
            error.value = 'Profil tidak ditemukan'
        }
    } catch (err: unknown) {
        console.error('Error fetching profile:', err)
        error.value = 'Profil tidak ditemukan atau tidak tersedia untuk publik'
    } finally {
        loading.value = false
    }
}

// Actions
const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = '/cdn/assets/default-avatar.webp'
}

const viewCV = () => {
    navigateTo(`/cv/${nis}`)
}

const copyEmail = async () => {
    try {
        await navigator.clipboard.writeText(profileData.value?.email || '')
        showToastMessage('Email berhasil disalin!')
    } catch (error) {
        console.error('Failed to copy email:', error)
        showToastMessage('Gagal menyalin email')
    }
}

const shareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${nis}`
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: `Profil ${profileData.value?.fullname} - AICademy`,
                text: `Lihat profil ${profileData.value?.fullname} di AICademy`,
                url: profileUrl
            })
        } catch (error) {
            console.error('Error sharing:', error)
        }
    } else {
        try {
            await navigator.clipboard.writeText(profileUrl)
            showToastMessage('Link profil berhasil disalin!')
        } catch (error) {
            console.error('Failed to copy profile URL:', error)
            showToastMessage('Gagal menyalin link profil')
        }
    }
}

const showToastMessage = (message: string) => {
    toastMessage.value = message
    showToast.value = true
    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

// Utility functions
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
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long'
    })
}

const formatWorkDuration = (startDate: string, endDate: string, isCurrent: boolean) => {
    const start = new Date(startDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })
    if (isCurrent) return `${start} - Sekarang`
    const end = new Date(endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })
    return `${start} - ${end}`
}

// SEO Meta
useSeoMeta({
    title: () => profileData.value ? `${profileData.value.fullname} - Profil AICademy` : 'Profil Student - AICademy',
    description: () => profileData.value?.bio || 'Lihat profil siswa dan portofolio mereka di AICademy'
})

// Initialize
onMounted(() => {
    fetchProfile()
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@keyframes float-delayed {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(-5deg); }
}

@keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(3deg); }
}

.animate-float-delayed {
    animation: float-delayed 5s ease-in-out infinite;
}

.animate-float-slow {
    animation: float-slow 6s ease-in-out infinite;
}
</style>