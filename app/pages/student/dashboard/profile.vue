<template>
    <!-- Modals -->
    <CreateProjectModal
        :is-open="createProjectModal.isOpen"
        :edit-project="createProjectModal.editProject"
        @update:is-open="createProjectModal.isOpen = $event"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
        @project-saved="handleProjectSaved"
    />

    <CreateCertificationModal
        :is-open="createCertificationModal.isOpen"
        @update:is-open="createCertificationModal.isOpen = $event"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
        @certification-saved="handleCertificationSaved"
    />

    <!-- Success/Error Modals -->
    <SuccessModal
        :is-open="successModal.isOpen"
        :message="successModal.message"
        @update:is-open="successModal.isOpen = $event"
    />

    <ErrorModal
        :is-open="errorModal.isOpen"
        :message="errorModal.message"
        :show-retry="errorModal.showRetry"
        @update:is-open="errorModal.isOpen = $event"
        @retry="errorModal.retryAction"
    />

    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Profile Header with Enhanced Design -->
            <div class="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                <!-- Background Pattern -->
                <div class="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-50/30 to-indigo-100/20"></div>
                <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-primary/10 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
                
                <div class="relative p-8">
                    <div class="flex flex-col lg:flex-row items-start gap-8">
                        <!-- Enhanced Profile Picture -->
                        <div class="flex-shrink-0 relative group">
                            <div class="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                            <div v-if="profileData?.profile_picture" class="relative w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
                                <img 
                                    :src="profileData.profile_picture" 
                                    :alt="profileData.fullname"
                                    class="w-full h-full object-cover"
                                >
                            </div>
                            <div v-else class="relative w-32 h-32 bg-gradient-to-br from-primary via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white shadow-lg">
                                {{ getInitials(profileData?.fullname || '') }}
                            </div>
                            <!-- Online Status Indicator -->
                            <div class="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                        </div>
                        
                        <!-- Enhanced Profile Info -->
                        <div class="flex-1 space-y-6">
                            <!-- Name and Basic Info -->
                            <div>
                                <div class="flex items-center gap-3 mb-3">
                                    <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        {{ profileData?.fullname || 'Loading...' }}
                                    </h1>
                                    <div class="flex items-center gap-2">
                                        <span class="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-full shadow-sm">
                                            {{ profileData?.class }}
                                        </span>
                                        <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                            NIS: {{ profileData?.nis }}
                                        </span>
                                    </div>
                                </div>
                                
                                <!-- Stats Cards -->
                                <div class="grid grid-cols-3 gap-4 mb-6">
                                    <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                                        <div class="text-2xl font-bold text-primary">{{ profileData?.projects?.length || 0 }}</div>
                                        <div class="text-sm text-gray-600">Projects</div>
                                    </div>
                                    <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                                        <div class="text-2xl font-bold text-green-600">{{ profileData?.certifications?.length || 0 }}</div>
                                        <div class="text-sm text-gray-600">Certifications</div>
                                    </div>
                                    <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                                        <div class="text-2xl font-bold text-purple-600">{{ profileData?.recommended_role?.score || 0 }}%</div>
                                        <div class="text-sm text-gray-600">Match Score</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Headline & Bio with Better Typography -->
                            <div class="space-y-4">
                                <div v-if="profileData?.headline" class="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                                    <div class="flex items-center gap-2 mb-2">
                                        <Icon name="heroicons:star-20-solid" class="w-5 h-5 text-yellow-500" />
                                        <span class="text-sm font-medium text-gray-700">Professional Headline</span>
                                    </div>
                                    <p class="text-lg font-semibold text-primary">{{ profileData.headline }}</p>
                                </div>
                                
                                <div v-if="profileData?.bio" class="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                                    <div class="flex items-center gap-2 mb-2">
                                        <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-blue-500" />
                                        <span class="text-sm font-medium text-gray-700">About Me</span>
                                    </div>
                                    <p class="text-gray-700 leading-relaxed">{{ profileData.bio }}</p>
                                </div>
                            </div>
                            
                            <!-- Enhanced Recommended Role -->
                            <div v-if="profileData?.recommended_role" class="relative overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-50 to-indigo-100/50 rounded-2xl"></div>
                                <div class="relative bg-white/80 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-lg">
                                    <div class="flex items-center gap-3 mb-4">
                                        <div class="w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center">
                                            <Icon name="heroicons:sparkles-20-solid" class="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <span class="font-bold text-primary text-lg">AI Recommended Career Path</span>
                                            <p class="text-sm text-gray-600">Based on your skills and interests</p>
                                        </div>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ profileData.recommended_role.role_name }}</h3>
                                    <p class="text-gray-700 mb-4 leading-relaxed">{{ profileData.recommended_role.role_description }}</p>
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-4">
                                            <div class="bg-gradient-to-r from-primary to-blue-600 px-4 py-2 rounded-lg">
                                                <span class="text-white font-semibold">{{ profileData.recommended_role.score }}% Match</span>
                                            </div>
                                            <div class="w-32 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    class="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-500"
                                                    :style="{ width: `${profileData.recommended_role.score}%` }"
                                                ></div>
                                            </div>
                                        </div>
                                        <button class="px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200 font-medium">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Tabs Navigation -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 mb-8">
                <div class="border-b border-gray-100">
                    <nav class="flex space-x-1 p-2" aria-label="Tabs">
                        <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            :class="[
                                'flex items-center gap-3 px-6 py-4 rounded-xl font-medium text-sm transition-all duration-200',
                                activeTab === tab.id
                                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg transform scale-105'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            ]"
                            @click="activeTab = tab.id"
                        >
                            <Icon :name="tab.icon" class="w-5 h-5" />
                            {{ tab.name }}
                            <span v-if="tab.id === 'projects'" :class="[
                                'px-2 py-1 text-xs rounded-full',
                                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                            ]">
                                {{ profileData?.projects?.length || 0 }}
                            </span>
                            <span v-if="tab.id === 'certifications'" :class="[
                                'px-2 py-1 text-xs rounded-full',
                                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                            ]">
                                {{ profileData?.certifications?.length || 0 }}
                            </span>
                        </button>
                    </nav>
                </div>

                <!-- Enhanced Tab Content -->
                <div class="p-8">
                    <!-- Projects Tab -->
                    <div v-if="activeTab === 'projects'" class="space-y-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">My Projects</h2>
                                <p class="text-gray-600">Showcase your work and achievements</p>
                            </div>
                            <button 
                                @click="openCreateProjectModal"
                                class="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium"
                            >
                                <Icon name="heroicons:plus-20-solid" class="w-5 h-5" />
                                Add Project
                            </button>
                        </div>
                        
                        <ProjectsSection 
                            :projects="profileData?.projects || []"
                            :loading="profileLoading"
                            :error="profileError"
                            @create-project="openCreateProjectModal"
                            @view-project="viewProject"
                            @edit-project="editProject"
                            @delete-project="deleteProject"
                            @retry="fetchProfile"
                        />
                    </div>

                    <!-- Certifications Tab -->
                    <div v-if="activeTab === 'certifications'" class="space-y-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">My Certifications</h2>
                                <p class="text-gray-600">Your professional achievements and credentials</p>
                            </div>
                            <button 
                                @click="openCreateCertificationModal"
                                class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium"
                            >
                                <Icon name="heroicons:plus-20-solid" class="w-5 h-5" />
                                Add Certification
                            </button>
                        </div>
                        
                        <CertificationsSection 
                            :certifications="profileData?.certifications || []"
                            :loading="profileLoading"
                            :error="profileError"
                            @create-certification="openCreateCertificationModal"
                            @view-certification="viewCertification"
                            @delete-certification="deleteCertification"
                            @retry="fetchProfile"
                        />
                    </div>

                    <!-- Enhanced Public Profile Tab -->
                    <div v-if="activeTab === 'public'" class="text-center py-16">
                        <div class="max-w-md mx-auto">
                            <div class="w-20 h-20 bg-gradient-to-r from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Icon name="heroicons:globe-alt-20-solid" class="w-10 h-10 text-white" />
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-3">Share Your Profile</h3>
                            <p class="text-gray-600 mb-8 leading-relaxed">
                                Let others discover your projects, certifications, and achievements. 
                                Your public profile showcases your professional journey.
                            </p>
                            
                            <!-- Profile URL Preview -->
                            <div v-if="profileData?.profile_url" class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                                <p class="text-sm text-gray-600 mb-2">Your profile URL:</p>
                                <code class="text-sm font-mono text-primary bg-white px-3 py-2 rounded-lg border">
                                    {{ profileData.profile_url }}
                                </code>
                            </div>
                            
                            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    class="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                                    @click="copyProfileUrl"
                                >
                                    <Icon name="heroicons:clipboard-20-solid" class="w-5 h-5" />
                                    Copy Profile URL
                                </button>
                                <button 
                                    v-if="profileData?.profile_url"
                                    class="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                                    @click="openPublicProfile"
                                >
                                    <Icon name="heroicons:eye-20-solid" class="w-5 h-5" />
                                    Preview Profile
                                </button>
                            </div>
                            
                            <!-- Social Sharing Options -->
                            <div class="mt-8 pt-6 border-t border-gray-200">
                                <p class="text-sm text-gray-600 mb-4">Share on social media:</p>
                                <div class="flex justify-center gap-3">
                                    <button class="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                                        <Icon name="heroicons:share-20-solid" class="w-5 h-5" />
                                    </button>
                                    <button class="w-10 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                                        <Icon name="heroicons:link-20-solid" class="w-5 h-5" />
                                    </button>
                                    <button class="w-10 h-10 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                                        <Icon name="heroicons:envelope-20-solid" class="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CreateProjectModal from '~/components/modal/student/dashboard/CreateProjectModal.vue'
import CreateCertificationModal from '~/components/modal/student/dashboard/CreateCertificationModal.vue'
import ProjectsSection from '~/components/dashboard-student/profile/ProjectsSection.vue'
import CertificationsSection from '~/components/dashboard-student/profile/CertificationsSection.vue'
import SuccessModal from '~/components/modal/basic-modal/SuccessModal.vue'
import ErrorModal from '~/components/modal/basic-modal/ErrorModal.vue'
import type { StudentProfile, Project, Certification } from '~/types/Profile'

definePageMeta({
    layout: 'dashboard-layout-student-dashboard-layout'
})

const config = useRuntimeConfig()

// Reactive data
const activeTab = ref('projects')
const profileData = ref<StudentProfile | null>(null)

// Loading states
const profileLoading = ref(false)

// Error states
const profileError = ref<string | null>(null)

// Modal states
const createProjectModal = ref({
    isOpen: false,
    editProject: null as Project | null
})

const createCertificationModal = ref({
    isOpen: false
})

const successModal = ref({
    isOpen: false,
    message: ''
})

const errorModal = ref({
    isOpen: false,
    message: '',
    showRetry: false,
    retryAction: () => {}
})

// Tabs configuration
const tabs = [
    { id: 'projects', name: 'Projects', icon: 'heroicons:folder-20-solid' },
    { id: 'certifications', name: 'Certifications', icon: 'heroicons:academic-cap-20-solid' },
    { id: 'public', name: 'Public Profile', icon: 'heroicons:globe-alt-20-solid' }
]

// Fetch profile with all data
const fetchProfile = async () => {
    try {
        profileLoading.value = true
        profileError.value = null
        
        const response = await $fetch<{success: boolean, data: StudentProfile, message: string}>('/student/profile', {
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
        
        if (response?.success) {
            profileData.value = response.data
        }
    } catch (error: unknown) {
        console.error('Error fetching profile:', error)
        profileError.value = (error as { data?: { message?: string } })?.data?.message || 'Gagal memuat profile'
    } finally {
        profileLoading.value = false
    }
}

// Project actions
const openCreateProjectModal = () => {
    createProjectModal.value.editProject = null
    createProjectModal.value.isOpen = true
}

const editProject = (project: Project) => {
    createProjectModal.value.editProject = project
    createProjectModal.value.isOpen = true
}

const viewProject = async (project: Project) => {
    try {
        const response = await $fetch(`/student/projects/${project.id}`, {
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
        
        if (response?.success) {
            console.log('Project details:', response.data)
        }
    } catch (error: unknown) {
        console.error('Error fetching project details:', error)
        showErrorModal('Gagal memuat detail project')
    }
}

const deleteProject = async (project: Project) => {
    if (!confirm('Apakah Anda yakin ingin menghapus project ini?')) return
    
    try {
        await $fetch(`/student/projects/${project.id}`, {
            method: 'DELETE',
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
        
        showSuccessModal('Project berhasil dihapus!')
        await fetchProfile()
    } catch (error: unknown) {
        console.error('Error deleting project:', error)
        showErrorModal('Gagal menghapus project')
    }
}

// Certification actions
const openCreateCertificationModal = () => {
    createCertificationModal.value.isOpen = true
}

const viewCertification = async (certification: Certification) => {
    try {
        const response = await $fetch(`/student/certifications/${certification.id}`, {
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
        
        if (response?.success) {
            console.log('Certification details:', response.data)
        }
    } catch (error: unknown) {
        console.error('Error fetching certification details:', error)
        showErrorModal('Gagal memuat detail sertifikat')
    }
}

const deleteCertification = async (certification: Certification) => {
    if (!confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) return
    
    try {
        await $fetch(`/student/certifications/${certification.id}`, {
            method: 'DELETE',
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
        
        showSuccessModal('Sertifikat berhasil dihapus!')
        await fetchProfile()
    } catch (error: unknown) {
        console.error('Error deleting certification:', error)
        showErrorModal('Gagal menghapus sertifikat')
    }
}

// Event handlers
const handleProjectSaved = () => {
    fetchProfile()
}

const handleCertificationSaved = () => {
    fetchProfile()
}

const showSuccessModal = (message: string) => {
    successModal.value.message = message
    successModal.value.isOpen = true
}

const showErrorModal = (message: string, retryAction?: () => void) => {
    errorModal.value.message = message
    errorModal.value.showRetry = !!retryAction
    errorModal.value.retryAction = retryAction || (() => {})
    errorModal.value.isOpen = true
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

const copyProfileUrl = async () => {
    if (profileData.value?.profile_url) {
        try {
            await navigator.clipboard.writeText(profileData.value.profile_url)
            showSuccessModal('URL profile berhasil disalin!')
        } catch {
            showErrorModal('Gagal menyalin URL profile')
        }
    }
}

const openPublicProfile = () => {
    if (profileData.value?.profile_url) {
        window.open(profileData.value.profile_url, '_blank')
    }
}

// Initialize data
onMounted(() => {
    fetchProfile()
})
</script>

<style scoped>
/* Custom animations and effects */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.float-animation {
    animation: float 6s ease-in-out infinite;
}

/* Glassmorphism effect */
.glass-effect {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #667eea, #764ba2);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #5a67d8, #6b46c1);
}
</style>