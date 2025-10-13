<template>
    <div class="overflow-hidden relative min-h-screen bg-gradient-to-b to-red-700 from-primary">

    <div class="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl md:w-72 md:h-72 bg-white/10"></div>
        <div class="absolute -right-10 -bottom-20 w-64 h-64 rounded-full blur-3xl md:w-96 md:h-96 bg-pink-400/20"></div>
        
        <!-- Additional decorative elements -->
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

        <div v-if="loading" class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p class="text-gray-600">Loading profile...</p>
            </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <div class="text-gray-400 mb-4">
                    <Icon name="heroicons:exclamation-triangle-20-solid" class="w-16 h-16 mx-auto" />
                </div>
                <h2 class="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
                <p class="text-gray-600 mb-6">{{ error }}</p>
                <NuxtLink 
                    to="/"
                    class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Icon name="heroicons:home-20-solid" class="w-4 h-4 mr-2" />
                    Back to Home
                </NuxtLink>
            </div>
        </div>

        <!-- Profile content -->
        <div v-else-if="profileData" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <div class="flex flex-col lg:flex-row items-start gap-8">
                    <!-- Profile Picture -->
                    <div class="flex-shrink-0">
                        <div v-if="profileData.profile_picture" class="w-32 h-32 rounded-xl overflow-hidden">
                            <img 
                                :src="profileData.profile_picture" 
                                :alt="profileData.fullname"
                                class="w-full h-full object-cover"
                            >
                        </div>
                        <div v-else class="w-32 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                            {{ getInitials(profileData.fullname) }}
                        </div>
                    </div>
                    
                    <!-- Profile Info -->
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ profileData.fullname }}</h1>
                        <div class="flex flex-wrap items-center gap-4 mb-4">
                            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {{ profileData.class }}
                            </span>
                            <span class="text-gray-500 text-sm">NIS: {{ profileData.nis }}</span>
                        </div>
                        
                        <!-- Headline -->
                        <div v-if="profileData.headline" class="mb-4">
                            <p class="text-xl text-primary font-medium">{{ profileData.headline }}</p>
                        </div>
                        
                        <!-- Bio -->
                        <div v-if="profileData.bio" class="mb-6">
                            <p class="text-gray-600 leading-relaxed">{{ profileData.bio }}</p>
                        </div>
                        
                        <!-- Recommended Role -->
                        <div v-if="profileData.recommended_role" class="bg-gradient-to-r from-primary/5 to-blue-50 border border-primary/20 rounded-lg p-6">
                            <div class="flex items-center gap-3 mb-3">
                                <Icon name="heroicons:sparkles-20-solid" class="w-6 h-6 text-primary" />
                                <span class="font-semibold text-primary text-lg">Recommended Career Path</span>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ profileData.recommended_role.role_name }}</h3>
                            <p class="text-gray-700 mb-3">{{ profileData.recommended_role.role_description }}</p>
                            <div class="flex items-center gap-2">
                                <div class="bg-primary/10 px-3 py-1 rounded-full">
                                    <span class="text-sm font-semibold text-primary">Match Score: {{ profileData.recommended_role.score }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs Navigation -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6" aria-label="Tabs">
                        <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            :class="[
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                            ]"
                            @click="activeTab = tab.id"
                        >
                            <Icon :name="tab.icon" class="w-5 h-5 inline mr-2" />
                            {{ tab.name }}
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div class="p-6">
                    <!-- Projects Tab -->
                    <div v-if="activeTab === 'projects'">                        
                        <div v-if="!profileData?.projects || profileData.projects.length === 0" class="text-center py-12">
                            <div class="text-gray-400 mb-4">
                                <Icon name="heroicons:folder-plus-20-solid" class="w-16 h-16 mx-auto" />
                            </div>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
                            <p class="text-gray-600">This student hasn't shared any projects yet.</p>
                        </div>
                        
                        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div 
                                v-for="project in profileData.projects" 
                                :key="project.id"
                                class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <!-- Project Image -->
                                <div class="aspect-video bg-gray-100">
                                    <img 
                                        v-if="project.photos && project.photos.length > 0"
                                        :src="project.photos[0].url" 
                                        :alt="project.project_name"
                                        class="w-full h-full object-cover"
                                    >
                                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                                        <Icon name="heroicons:photo-20-solid" class="w-12 h-12" />
                                    </div>
                                </div>
                                
                                <!-- Project Content -->
                                <div class="p-4">
                                    <div class="flex items-start justify-between mb-2">
                                        <h3 class="font-semibold text-gray-900 text-lg">{{ project.project_name }}</h3>
                                        <span 
                                            :class="[
                                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                                project.is_completed 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            ]"
                                        >
                                            {{ project.is_completed ? 'Completed' : 'In Progress' }}
                                        </span>
                                    </div>
                                    
                                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ project.description }}</p>
                                    
                                    <!-- Project Dates -->
                                    <div class="text-sm text-gray-500 mb-3">
                                        <p>{{ formatDate(project.start_date) }} - {{ formatDate(project.end_date) }}</p>
                                    </div>
                                    
                                    <!-- Project Links -->
                                    <div class="flex gap-2">
                                        <a 
                                            v-if="project.link_url"
                                            :href="project.link_url" 
                                            target="_blank"
                                            class="flex-1 text-center px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                            <Icon name="heroicons:link-20-solid" class="w-4 h-4 inline mr-1" />
                                            View Project
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Certifications Tab -->
                    <div v-if="activeTab === 'certifications'">                        
                        <div v-if="!profileData?.certifications || profileData.certifications.length === 0" class="text-center py-12">
                            <div class="text-gray-400 mb-4">
                                <Icon name="heroicons:academic-cap-20-solid" class="w-16 h-16 mx-auto" />
                            </div>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">No Certifications Yet</h3>
                            <p class="text-gray-600">This student hasn't shared any certifications yet.</p>
                        </div>
                        
                        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div 
                                v-for="certification in profileData.certifications" 
                                :key="certification.id"
                                class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <!-- Certification Image -->
                                <div class="aspect-video bg-gray-100">
                                    <img 
                                        v-if="certification.photos && certification.photos.length > 0"
                                        :src="certification.photos[0]?.url" 
                                        :alt="certification.name"
                                        class="w-full h-full object-cover"
                                    >
                                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                                        <Icon name="heroicons:academic-cap-20-solid" class="w-12 h-12" />
                                    </div>
                                </div>
                                
                                <!-- Certification Content -->
                                <div class="p-4">
                                    <div class="flex items-start justify-between mb-2">
                                        <h3 class="font-semibold text-gray-900 text-lg">{{ certification.name }}</h3>
                                        <span 
                                            v-if="certification.expiration_date"
                                            :class="[
                                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                                certification.is_expired
                                                    ? 'bg-red-100 text-red-800'
                                                    : certification.is_expiring_soon
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            ]"
                                        >
                                            {{ certification.is_expired ? 'Expired' : certification.is_expiring_soon ? 'Expiring Soon' : 'Valid' }}
                                        </span>
                                    </div>
                                    
                                    <p class="text-primary font-medium mb-2">{{ certification.issuing_organization }}</p>
                                    
                                    <div class="text-sm text-gray-600 mb-3">
                                        <p>Issued: {{ formatDate(certification.issue_date) }}</p>
                                        <p v-if="certification.expiration_date">Expires: {{ formatDate(certification.expiration_date) }}</p>
                                        <p v-if="certification.credential_id" class="text-xs">ID: {{ certification.credential_id }}</p>
                                    </div>
                                    
                                    <!-- Credential Link -->
                                    <div v-if="certification.credential_url" class="mt-3">
                                        <a 
                                            :href="certification.credential_url" 
                                            target="_blank"
                                            class="w-full inline-flex items-center justify-center px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                            <Icon name="heroicons:link-20-solid" class="w-4 h-4 mr-2" />
                                            View Credential
                                        </a>
                                    </div>
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
import type { StudentProfile } from '~/types/Profile'

const route = useRoute()
const config = useRuntimeConfig()

// Get NIS from route params
const nis = route.params.nis as string

// Reactive data
const activeTab = ref('projects')
const profileData = ref<StudentProfile | null>(null)

// Loading states
const loading = ref(true)

// Error state
const error = ref<string | null>(null)

// Tabs configuration
const tabs = [
    { id: 'projects', name: 'Projects', icon: 'heroicons:folder-20-solid' },
    { id: 'certifications', name: 'Certifications', icon: 'heroicons:academic-cap-20-solid' }
]

// Fetch profile data
const fetchProfile = async () => {
    try {
        const response = await $fetch<{success: boolean, data: StudentProfile, message: string}>(`/profile/${nis}`, {
            baseURL: config.public.apiBase
        })
        
        if (response?.success) {
            profileData.value = response.data
        } else {
            error.value = 'Profile not found'
        }
    } catch (err: unknown) {
        console.error('Error fetching profile:', err)
        error.value = 'Profile not found or is not public'
    } finally {
        loading.value = false
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
        month: 'long',
        day: 'numeric'
    })
}

// SEO Meta
useSeoMeta({
    title: () => profileData.value ? `${profileData.value.fullname} - Profile` : 'Student Profile',
    description: () => profileData.value?.bio || 'Student profile showcase'
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
</style>