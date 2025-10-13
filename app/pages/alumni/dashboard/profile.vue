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
                            <div v-if="publicProfile?.headline" class="flex items-center gap-2">
                                <Icon name="heroicons:briefcase-20-solid" class="w-5 h-5 text-primary" />
                                <p class="text-gray-700 font-medium">{{ publicProfile.headline }}</p>
                            </div>
                            <div v-if="publicProfile?.bio">
                                <p class="text-gray-600 leading-relaxed">{{ publicProfile.bio }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex gap-2 overflow-x-auto">
                <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                        'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap',
                        activeTab === tab.id
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                    ]"
                >
                    <Icon :name="tab.icon" class="w-5 h-5" />
                    <span>{{ tab.name }}</span>
                    <span v-if="tab.count !== undefined" class="px-2 py-0.5 text-xs rounded-full"
                        :class="activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'">
                        {{ tab.count }}
                    </span>
                </button>
            </div>
        </div>

        <!-- Projects Tab -->
        <div v-if="activeTab === 'projects'" class="space-y-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-900">Projects</h2>
                <button
                    @click="openCreateProjectModal"
                    class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Icon name="heroicons:plus-20-solid" class="w-5 h-5" />
                    <span>Tambah Project</span>
                </button>
            </div>

            <div v-if="!publicProfile?.projects?.length" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Icon name="heroicons:folder-open-20-solid" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum ada project</h3>
                <p class="text-gray-600 mb-6">Tambahkan project pertama Anda untuk menampilkan portfolio</p>
                <button
                    @click="openCreateProjectModal"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Icon name="heroicons:plus-20-solid" class="w-5 h-5" />
                    <span>Tambah Project</span>
                </button>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    v-for="project in publicProfile.projects"
                    :key="project.id"
                    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                    <div v-if="project.photos?.length" class="aspect-video bg-gray-100 overflow-hidden">
                        <img :src="project.photos[0]" :alt="project.project_name" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ project.project_name }}</h3>
                        <p class="text-gray-600 mb-4 line-clamp-2">{{ project.description }}</p>
                        <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <Icon name="heroicons:calendar-20-solid" class="w-4 h-4" />
                            <span>{{ formatDate(project.start_date) }} - {{ formatDate(project.end_date) }}</span>
                        </div>
                        <div class="flex gap-2">
                            <a
                                :href="project.link_url"
                                target="_blank"
                                class="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                            >
                                <Icon name="heroicons:link-20-solid" class="w-4 h-4" />
                                <span>View</span>
                            </a>
                            <button
                                @click="editProject(project)"
                                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Icon name="heroicons:pencil-20-solid" class="w-4 h-4" />
                            </button>
                            <button
                                @click="deleteProject(project)"
                                class="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Icon name="heroicons:trash-20-solid" class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Certifications Tab -->
        <div v-if="activeTab === 'certifications'" class="space-y-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-900">Certifications</h2>
                <button
                    @click="openCreateCertificationModal"
                    class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Icon name="heroicons:plus-20-solid" class="w-5 h-5" />
                    <span>Tambah Certification</span>
                </button>
            </div>

            <div v-if="!publicProfile?.certifications?.length" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Icon name="heroicons:academic-cap-20-solid" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum ada sertifikat</h3>
                <p class="text-gray-600 mb-6">Tambahkan sertifikat Anda untuk meningkatkan kredibilitas</p>
                <button
                    @click="openCreateCertificationModal"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Icon name="heroicons:plus-20-solid" class="w-5 h-5" />
                    <span>Tambah Certification</span>
                </button>
            </div>

            <div v-else class="grid grid-cols-1 gap-4">
                <div
                    v-for="cert in publicProfile.certifications"
                    :key="cert.id"
                    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div class="flex items-start gap-4">
                        <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <Icon name="heroicons:academic-cap-20-solid" class="w-8 h-8 text-white" />
                        </div>
                        <div class="flex-1">
                            <h3 class="text-lg font-bold text-gray-900">{{ cert.certification_name }}</h3>
                            <p class="text-gray-600 mt-1">{{ cert.issuer }}</p>
                            <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <div class="flex items-center gap-1">
                                    <Icon name="heroicons:calendar-20-solid" class="w-4 h-4" />
                                    <span>{{ formatDate(cert.issue_date) }}</span>
                                </div>
                                <div v-if="cert.expiry_date" class="flex items-center gap-1">
                                    <Icon name="heroicons:clock-20-solid" class="w-4 h-4" />
                                    <span>Expires: {{ formatDate(cert.expiry_date) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <a
                                v-if="cert.credential_url"
                                :href="cert.credential_url"
                                target="_blank"
                                class="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                            >
                                <Icon name="heroicons:link-20-solid" class="w-4 h-4" />
                            </a>
                            <button
                                @click="deleteCertification(cert)"
                                class="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Icon name="heroicons:trash-20-solid" class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Public Profile Tab -->
        <div v-if="activeTab === 'public'" class="space-y-4">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Public Profile URL</h2>
                <div class="flex gap-2">
                    <input
                        type="text"
                        :value="publicProfile?.profile_url"
                        readonly
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    >
                    <button
                        @click="copyProfileUrl"
                        class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Icon name="heroicons:clipboard-document-20-solid" class="w-5 h-5" />
                    </button>
                    <button
                        @click="openPublicProfile"
                        class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Profile Modal -->
    <EditProfileModal 
        v-model:is-open="editProfileModal.isOpen"
        :current-profile="publicProfile"
        @profile-updated="handleProfileUpdated"
    />
</template>

<script setup lang="ts">
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import CreateProjectModal from '~/components/modal/alumni/dashboard/CreateProjectModal.vue'
import CreateCertificationModal from '~/components/modal/alumni/dashboard/CreateCertificationModal.vue'
import EditProfileModal from '~/components/modal/alumni/dashboard/EditProfileModal.vue'
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
const editProfileModal = ref({
    isOpen: false
})

const createProjectModal = ref({
    isOpen: false,
    editProject: null as any
})

const createCertificationModal = ref({
    isOpen: false
})

const alertModal = ref({
    isOpen: false,
    type: 'info' as AlertType,
    title: '',
    message: ''
})

// Fetch public profile data - CHANGED TO /alumni
const { data: publicProfile, pending, error, refresh } = await useAsyncData(
    'alumni-public-profile',
    () => $fetch(`/alumni/profile/${userNis.value}`, {
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
        // CHANGED TO /alumni
        const response = await $fetch(`/alumni/projects/${project.id}`, {
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

// Certification actions
const openCreateCertificationModal = () => {
    createCertificationModal.value.isOpen = true
}

const deleteCertification = async (certification: any) => {
    if (!confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) return
    
    try {
        // CHANGED TO /alumni
        const response = await $fetch(`/alumni/certifications/${certification.id}`, {
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
const openEditProfileModal = () => {
    editProfileModal.value.isOpen = true
}

const handleProfileUpdated = () => {
    refresh()
}

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
