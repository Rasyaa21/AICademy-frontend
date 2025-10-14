<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="mx-4 w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Edit Profile
                    </h3>
                    <button 
                        class="text-gray-400 hover:text-gray-600"
                        @click="closeModal"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-4 m-6 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center gap-2">
                    <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-red-500" />
                    <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
            </div>

            <form class="p-6 space-y-4" @submit.prevent="submitProfile">
                <!-- Profile Picture Upload -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Foto Profil
                    </label>
                    
                    <!-- Current Photo Preview -->
                    <div v-if="currentProfile?.profile_picture && !selectedProfilePicture" class="mb-3">
                        <img 
                            :src="currentProfile.profile_picture" 
                            alt="Current profile"
                            class="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                        >
                    </div>
                    
                    <!-- New Photo Preview -->
                    <div v-if="profilePicturePreview" class="mb-3">
                        <img 
                            :src="profilePicturePreview" 
                            alt="New profile"
                            class="w-24 h-24 rounded-full object-cover border-2 border-primary"
                        >
                    </div>
                    
                    <div 
                        class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer"
                        @drop.prevent="handleProfilePictureDrop"
                        @dragover.prevent
                        @dragenter.prevent
                        @click="$refs.profilePictureInput?.click()"
                    >
                        <input 
                            ref="profilePictureInput"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            @change="handleProfilePictureSelect"
                        >
                        <Icon name="heroicons:camera-20-solid" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm text-gray-600">Click or drag to upload profile picture</p>
                        <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                </div>

                <!-- Bio -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Bio
                    </label>
                    <textarea
                        v-model="profileData.bio"
                        rows="3"
                        placeholder="Tell us about yourself..."
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    ></textarea>
                </div>

                <!-- Headline -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Headline
                    </label>
                    <input
                        v-model="profileData.headline"
                        type="text"
                        placeholder="e.g., Junior Programmer"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                </div>

                <!-- CV File Upload -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        CV / Resume
                    </label>
                    
                    <!-- Selected File Preview -->
                    <div v-if="selectedCvFile" class="mb-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-gray-400" />
                            <span class="text-sm text-gray-700">{{ selectedCvFile.name }}</span>
                            <span class="text-xs text-gray-500">({{ formatFileSize(selectedCvFile.size) }})</span>
                        </div>
                        <button 
                            type="button"
                            class="text-red-500 hover:text-red-700"
                            @click="removeCvFile"
                        >
                            <Icon name="heroicons:x-mark-20-solid" class="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div 
                        class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer"
                        @drop.prevent="handleCvFileDrop"
                        @dragover.prevent
                        @dragenter.prevent
                        @click="$refs.cvFileInput?.click()"
                    >
                        <input 
                            ref="cvFileInput"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            class="hidden"
                            @change="handleCvFileSelect"
                        >
                        <Icon name="heroicons:document-arrow-up-20-solid" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm text-gray-600">Click or drag to upload CV</p>
                        <p class="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                </div>

                <div class="flex gap-3 pt-4">
                    <button
                        type="button"
                        class="flex-1 px-4 py-2 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
                        @click="closeModal"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <Icon v-if="isSubmitting" name="heroicons:arrow-path-20-solid" class="w-4 h-4 mr-2 animate-spin" />
                        {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    isOpen: boolean
    currentProfile?: {
        profile_picture?: string
        bio?: string
        headline?: string
    } | null
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-alert': [type: 'success' | 'error' | 'warning' | 'info', title: string, message: string]
    'profile-updated': []
}>()

const config = useRuntimeConfig()

const profileData = ref({
    bio: '',
    headline: ''
})

const selectedProfilePicture = ref<File | null>(null)
const profilePicturePreview = ref<string | null>(null)
const selectedCvFile = ref<File | null>(null)
const profilePictureInput = ref<HTMLInputElement>()
const cvFileInput = ref<HTMLInputElement>()
const isSubmitting = ref(false)
const errorMessage = ref('')

// Watch for current profile changes
watch(() => props.currentProfile, (profile) => {
    if (profile) {
        profileData.value.bio = profile.bio || ''
        profileData.value.headline = profile.headline || ''
    }
}, { immediate: true })

const resetForm = () => {
    profileData.value = {
        bio: props.currentProfile?.bio || '',
        headline: props.currentProfile?.headline || ''
    }
    selectedProfilePicture.value = null
    profilePicturePreview.value = null
    selectedCvFile.value = null
    errorMessage.value = ''
}

const closeModal = () => {
    resetForm()
    emit('update:isOpen', false)
}

/* Profile Picture Handlers */
const handleProfilePictureSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        if (file.size > 5 * 1024 * 1024) {
            errorMessage.value = 'File size must be less than 5MB'
            return
        }
        selectedProfilePicture.value = file
        profilePicturePreview.value = URL.createObjectURL(file)
    }
}

const handleProfilePictureDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0]
        if (file.size > 5 * 1024 * 1024) {
            errorMessage.value = 'File size must be less than 5MB'
            return
        }
        selectedProfilePicture.value = file
        profilePicturePreview.value = URL.createObjectURL(file)
    }
}

/* CV File Handlers */
const handleCvFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        if (file.size > 10 * 1024 * 1024) {
            errorMessage.value = 'CV file size must be less than 10MB'
            return
        }
        selectedCvFile.value = file
    }
}

const handleCvFileDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0]
        if (file.size > 10 * 1024 * 1024) {
            errorMessage.value = 'CV file size must be less than 10MB'
            return
        }
        selectedCvFile.value = file
    }
}

const removeCvFile = () => {
    selectedCvFile.value = null
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const submitProfile = async () => {
    if (isSubmitting.value) return
    
    try {
        isSubmitting.value = true
        errorMessage.value = ''

        // Create FormData for file uploads
        const formData = new FormData()
        
        // Append text fields
        if (profileData.value.bio) formData.append('bio', profileData.value.bio)
        if (profileData.value.headline) formData.append('headline', profileData.value.headline)
        
        // Append files
        if (selectedProfilePicture.value) {
            formData.append('profile_picture', selectedProfilePicture.value)
        }
        if (selectedCvFile.value) {
            formData.append('cv_file', selectedCvFile.value)
        }

        // CHANGED TO /alumni endpoint
        const response = await $fetch('/alumni/profile', {
            method: 'PUT',
            body: formData,
            baseURL: config.public.apiBase,
            credentials: 'include'
        })
        
        if ((response as any).success) {
            emit('show-alert', 'success', 'Berhasil!', 'Profile berhasil diupdate!')
            emit('profile-updated')
            closeModal()
        }
    } catch (error: unknown) {
        console.error('Error updating profile:', error)
        errorMessage.value = (error as { data?: { message?: string } })?.data?.message || 'Gagal mengupdate profile. Silakan coba lagi.'
        emit('show-alert', 'error', 'Error!', errorMessage.value)
    } finally {
        isSubmitting.value = false
    }
}

// Reset form when modal closes
watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})
</script>
