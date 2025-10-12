<template>
    <!-- Alert Modal -->
    <AlertModal
        v-model:is-open="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="alertModal.isOpen = false"
    />

    <!-- Create Project Modal -->
    <CreateProjectModal
        :is-open="createProjectModal.isOpen"
        :edit-project="createProjectModal.editProject"
        @update:is-open="createProjectModal.isOpen = $event"
        @project-saved="handleProjectSaved"
        @show-alert="showAlert"
    />

    <!-- Create Certification Modal -->
    <CreateCertificationModal
        :is-open="createCertificationModal.isOpen"
        @update:is-open="createCertificationModal.isOpen = $event"
        @certification-saved="handleCertificationSaved"
        @show-alert="showAlert"
    />

    <!-- Edit Profile Modal -->
    <EditProfileModal
        :is-open="editProfileModal.isOpen"
        :current-profile="publicProfile"
        @update:is-open="editProfileModal.isOpen = $event"
        @profile-updated="handleProfileUpdated"
        @show-alert="showAlert"
    />

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
        <div class="text-center">
            <div class="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full"></div>
            <p class="text-gray-600">Memuat profil...</p>
        </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-4 justify-between lg:flex-row lg:items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Profil Saya</h1>
                <p class="mt-1 text-gray-600">Kelola profil, project, dan sertifikat Anda</p>
            </div>
        </div>

        <!-- Profile Header Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Background Pattern with Edit Button -->
            <div class="relative bg-gradient-to-r from-red-50 to-rose-100 p-6">
                <!-- Edit Profile Button -->
                <button 
                    class="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium border border-gray-200"
                    @click="openEditProfileModal"
                >
                    <Icon name="heroicons:pencil-20-solid" class="w-4 h-4" />
                    Edit Profile
                </button>
                
                <div class="flex flex-col lg:flex-row items-start gap-6">
                    <!-- Profile Picture -->
                    <div class="flex-shrink-0 relative">
                        <div v-if="publicProfile?.profile_picture" class="w-24 h-24 rounded-xl overflow-hidden ring-4 ring-white shadow-lg">
                            <img 
                                :src="publicProfile.profile_picture" 
                                :alt="publicProfile.fullname"
                                class="w-full h-full object-cover"
                            >
                        </div>
                        <div v-else class="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg">
                            {{ getInitials(publicProfile?.fullname || '') }}
                        </div>
                        <!-- Online Status -->
                        <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                    </div>
                    
                    <!-- Profile Info -->
                    <div class="flex-1 space-y-4">
                        <div>
                            <div class="flex items-center gap-3 mb-2">
                                <h2 class="text-2xl font-bold text-gray-900">
                                    {{ publicProfile?.fullname || 'Loading...' }}
                                </h2>
                                <span class="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                                    {{ publicProfile?.class }}
                                </span>
                                <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                    NIS: {{ publicProfile?.nis }}
                                </span>
                            </div>
                            
                            <!-- Stats -->
                            <div class="grid grid-cols-3 gap-4 mt-4">
                                <div class="text-center">
                                    <div class="text-xl font-bold text-primary">{{ publicProfile?.projects?.length || 0 }}</div>
                                    <div class="text-sm text-gray-600">Projects</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-xl font-bold text-green-600">{{ publicProfile?.certifications?.length || 0 }}</div>
                                    <div class="text-sm text-gray-600">Certifications</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-xl font-bold text-purple-600">{{ publicProfile?.recommended_role?.score || 0 }}%</div>
                                    <div class="text-sm text-gray-600">Match Score</div>
                                </div>
                            </div>
                        </div>

                        <!-- Headline & Bio -->
                        <div v-if="publicProfile?.headline || publicProfile?.bio" class="space-y-3">
                            <div v-if="publicProfile?.headline" class="bg-white/70 rounded-lg p-3">
                                <div class="flex items-center gap-2 mb-1">
                                    <Icon name="heroicons:star-20-solid" class="w-4 h-4 text-yellow-500" />
                                    <span class="text-xs font-medium text-gray-600">Headline</span>
                                </div>
                                <p class="font-medium text-primary">{{ publicProfile.headline }}</p>
                            </div>
                            
                            <div v-if="publicProfile?.bio" class="bg-white/70 rounded-lg p-3">
                                <div class="flex items-center gap-2 mb-1">
                                    <Icon name="heroicons:document-text-20-solid" class="w-4 h-4 text-blue-500" />
                                    <span class="text-xs font-medium text-gray-600">Bio</span>
                                </div>
                                <p class="text-gray-700 text-sm">{{ publicProfile.bio }}</p>
                            </div>
                        </div>
                        
                        <!-- Recommended Role -->
                        <div v-if="publicProfile?.recommended_role" class="bg-white/70 rounded-lg p-4">
                            <div class="flex items-center gap-2 mb-2">
                                <Icon name="heroicons:sparkles-20-solid" class="w-5 h-5 text-primary" />
                                <span class="text-sm font-medium text-primary">AI Recommended Career</span>
                            </div>
                            <h3 class="font-bold text-gray-900 mb-1">{{ publicProfile.recommended_role.role_name }}</h3>
                            <p class="text-gray-700 text-sm mb-3">{{ publicProfile.recommended_role.role_description }}</p>
                            <div class="flex items-center gap-3">
                                <span class="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
                                    {{ publicProfile.recommended_role.score }}% Match
                                </span>
                                <div class="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                        class="bg-primary h-2 rounded-full transition-all duration-500"
                                        :style="{ width: `${publicProfile.recommended_role.score}%` }"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="border-b border-gray-200">
                <nav class="flex space-x-1 p-1">
                    <button
                        v-for="tab in tabs"
                        :key="tab.id"
                        :class="[
                            'flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200',
                            activeTab === tab.id
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        ]"
                        @click="activeTab = tab.id"
                    >
                        <Icon :name="tab.icon" class="w-4 h-4" />
                        {{ tab.name }}
                        <span v-if="tab.count !== undefined" :class="[
                            'px-2 py-0.5 text-xs rounded-full',
                            activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                        ]">
                            {{ tab.count }}
                        </span>
                    </button>
                </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
                <!-- Projects Tab -->
                <div v-if="activeTab === 'projects'" class="space-y-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">My Projects</h3>
                            <p class="text-gray-600 text-sm">Showcase your work and achievements</p>
                        </div>
                        <button 
                            @click="openCreateProjectModal"
                            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                            Add Project
                        </button>
                    </div>
                    
                    <!-- Projects Grid -->
                    <div v-if="publicProfile?.projects?.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div 
                            v-for="project in publicProfile.projects" 
                            :key="project.id"
                            class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                        >
                            <div class="flex items-start justify-between mb-3">
                                <h4 class="font-semibold text-gray-900 text-sm">{{ project.project_name }}</h4>
                                <div class="flex gap-1">
                                    <button 
                                        @click="editProject(project)"
                                        class="p-1 text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <Icon name="heroicons:pencil-20-solid" class="w-4 h-4" />
                                    </button>
                                    <button 
                                        @click="deleteProject(project)"
                                        class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Icon name="heroicons:trash-20-solid" class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p class="text-gray-600 text-xs mb-3 line-clamp-2">{{ project.description }}</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>{{ project.photo_count }} photos</span>
                                <span :class="project.is_completed ? 'text-green-600' : 'text-yellow-600'">
                                    {{ project.is_completed ? 'Completed' : 'In Progress' }}
                                </span>
                            </div>
                            <div v-if="project.link_url" class="mt-2">
                                <a 
                                    :href="project.link_url" 
                                    target="_blank"
                                    class="text-primary hover:text-primary/80 text-xs flex items-center gap-1"
                                >
                                    <Icon name="heroicons:link-20-solid" class="w-3 h-3" />
                                    View Project
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Empty State -->
                    <div v-else class="text-center py-12">
                        <Icon name="heroicons:folder-20-solid" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                        <p class="text-gray-500 mb-4">Start showcasing your work by adding your first project</p>
                        <button 
                            @click="openCreateProjectModal"
                            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                        >
                            Add Your First Project
                        </button>
                    </div>
                </div>

                <!-- Certifications Tab -->
                <div v-if="activeTab === 'certifications'" class="space-y-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">My Certifications</h3>
                            <p class="text-gray-600 text-sm">Your professional achievements and credentials</p>
                        </div>
                        <button 
                            @click="openCreateCertificationModal"
                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                            Add Certification
                        </button>
                    </div>
                    
                    <!-- Certifications Grid -->
                    <div v-if="publicProfile?.certifications?.length" class="grid gap-4 md:grid-cols-2">
                        <div 
                            v-for="certification in publicProfile.certifications" 
                            :key="certification.id"
                            class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200"
                        >
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900 text-sm mb-1">{{ certification.name }}</h4>
                                    <p class="text-gray-600 text-xs">{{ certification.issuing_organization }}</p>
                                </div>
                                <button 
                                    @click="deleteCertification(certification)"
                                    class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Icon name="heroicons:trash-20-solid" class="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div class="space-y-2 text-xs text-gray-500">
                                <div class="flex justify-between">
                                    <span>Issued:</span>
                                    <span>{{ formatDate(certification.issue_date) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Expires:</span>
                                    <span :class="certification.is_expired ? 'text-red-500' : certification.is_expiring_soon ? 'text-yellow-500' : ''">
                                        {{ formatDate(certification.expiration_date) }}
                                    </span>
                                </div>
                                <div v-if="certification.credential_id" class="flex justify-between">
                                    <span>ID:</span>
                                    <span class="font-mono">{{ certification.credential_id }}</span>
                                </div>
                            </div>
                            
                            <div v-if="certification.credential_url" class="mt-3">
                                <a 
                                    :href="certification.credential_url" 
                                    target="_blank"
                                    class="text-green-600 hover:text-green-700 text-xs flex items-center gap-1"
                                >
                                    <Icon name="heroicons:link-20-solid" class="w-3 h-3" />
                                    Verify Certificate
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Empty State -->
                    <div v-else class="text-center py-12">
                        <Icon name="heroicons:academic-cap-20-solid" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No certifications yet</h3>
                        <p class="text-gray-500 mb-4">Add your professional certifications to showcase your expertise</p>
                        <button 
                            @click="openCreateCertificationModal"
                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            Add Your First Certification
                        </button>
                    </div>
                </div>

                <!-- Public Profile Tab -->
                <div v-if="activeTab === 'public'" class="text-center py-12">
                    <Icon name="heroicons:globe-alt-20-solid" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Share Your Profile</h3>
                    <p class="text-gray-500 mb-6 max-w-md mx-auto">
                        Let others discover your projects, certifications, and achievements through your public profile.
                    </p>
                    
                    <!-- Profile URL -->
                    <div v-if="publicProfile?.profile_url" class="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                        <p class="text-sm text-gray-600 mb-2">Your profile URL:</p>
                        <code class="text-sm font-mono text-primary bg-white px-3 py-2 rounded border block">
                            {{ publicProfile.profile_url }}
                        </code>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                            @click="copyProfileUrl"
                            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <Icon name="heroicons:clipboard-20-solid" class="w-4 h-4" />
                            Copy Profile URL
                        </button>
                        <button 
                            v-if="publicProfile?.profile_url"
                            @click="openPublicProfile"
                            class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
                            Preview Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import CreateProjectModal from '~/components/modal/student/dashboard/CreateProjectModal.vue'
import CreateCertificationModal from '~/components/modal/student/dashboard/CreateCertificationModal.vue'
import EditProfileModal from '~/components/modal/student/dashboard/EditProfileModal.vue'
import type { AlertType } from '~/components/modal/basic-modal/AlertModal.vue'

definePageMeta({
    layout: 'dashboard-layout-student-dashboard-layout'
})

const config = useRuntimeConfig()
// Updated to use the new store
const userStore = useUserStore()
if (!userStore.user) {
    await userStore.fetchUser()
}
const userNis = computed(() => userStore.user?.nis)


// Reactive data
const activeTab = ref('projects')

// Modal states
const createProjectModal = ref({
    isOpen: false,
    editProject: null as any
})

const createCertificationModal = ref({
    isOpen: false
})

const editProfileModal = ref({
    isOpen: false
})

const alertModal = ref({
    isOpen: false,
    type: 'info' as AlertType,
    title: '',
    message: ''
})

// Fetch public profile data
const { data: publicProfile, pending, error, refresh } = await useAsyncData(
    'public-profile',
    () => $fetch(`/profile/${userNis.value}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        method: 'GET'
    }),
    {
        transform: (data: any) => data?.success ? data.data : null
    }
)

// Tabs configuration with counts
const tabs = computed(() => [
    { 
        id: 'projects', 
        name: 'Projects', 
        icon: 'heroicons:folder-20-solid',
        count: publicProfile.value?.projects?.length || 0
    },
    { 
        id: 'certifications', 
        name: 'Certifications', 
        icon: 'heroicons:academic-cap-20-solid',
        count: publicProfile.value?.certifications?.length || 0
    },
    { 
        id: 'public', 
        name: 'Public Profile', 
        icon: 'heroicons:globe-alt-20-solid'
    }
])

// Project actions
const openCreateProjectModal = () => {
    createProjectModal.value.editProject = null
    createProjectModal.value.isOpen = true
}

const editProject = (project: any) => {
    createProjectModal.value.editProject = project
    createProjectModal.value.isOpen = true
}

const deleteProject = async (project: any) => {
    if (!confirm('Apakah Anda yakin ingin menghapus project ini?')) return
    
    try {
        const response = await $fetch(`/student/projects/${project.id}`, {
            method: 'DELETE',
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
        
        if (response?.success) {
            showAlert('success', 'Berhasil!', 'Project berhasil dihapus')
            await refresh()
        }
    } catch (error: any) {
        console.error('Error deleting project:', error)
        showAlert('error', 'Error!', error?.data?.message || 'Gagal menghapus project')
    }
}

// Profile actions
const openEditProfileModal = () => {
    editProfileModal.value.isOpen = true
}

const handleProfileUpdated = () => {
    refresh()
}

// Certification actions
const openCreateCertificationModal = () => {
    createCertificationModal.value.isOpen = true
}

const deleteCertification = async (certification: any) => {
    if (!confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) return
    
    try {
        const response = await $fetch(`/student/certifications/${certification.id}`, {
            method: 'DELETE',
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
        
        if (response?.success) {
            showAlert('success', 'Berhasil!', 'Sertifikat berhasil dihapus')
            await refresh()
        }
    } catch (error: any) {
        console.error('Error deleting certification:', error)
        showAlert('error', 'Error!', error?.data?.message || 'Gagal menghapus sertifikat')
    }
}

// Event handlers
const handleProjectSaved = () => {
    refresh()
}

const handleCertificationSaved = () => {
    refresh()
}

const showAlert = (type: AlertType, title: string, message: string) => {
    alertModal.value = {
        isOpen: true,
        type,
        title,
        message
    }
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
        month: 'short',
        day: 'numeric'
    })
}

const copyProfileUrl = async () => {
    if (publicProfile.value?.profile_url) {
        try {
            await navigator.clipboard.writeText(publicProfile.value.profile_url)
            showAlert('success', 'Berhasil!', 'URL profil berhasil disalin!')
        } catch {
            showAlert('error', 'Error!', 'Gagal menyalin URL profil')
        }
    }
}

const openPublicProfile = () => {
    if (publicProfile.value?.profile_url) {
        window.open(publicProfile.value.profile_url, '_blank')
    }
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