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
                    <div v-if="currentProfile?.profile_picture && !profilePicturePreview" class="mb-3">
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

                <!-- Headline -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Headline
                    </label>
                    <input
                        v-model="profileData.headline"
                        type="text"
                        placeholder="e.g., Aspiring Full Stack Developer"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
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

                <!-- Phone -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        No. HP
                    </label>
                    <input
                        v-model="profileData.phone"
                        type="text"
                        placeholder="08123456789"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                </div>

                <!-- Personal Email -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Email Pribadi
                    </label>
                    <input
                        v-model="profileData.personal_email"
                        type="email"
                        placeholder="your.email@example.com"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                </div>

                <!-- Location -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Lokasi
                    </label>
                    <input
                        v-model="profileData.location"
                        type="text"
                        placeholder="Jakarta, Indonesia"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                </div>

                <!-- Languages -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Bahasa
                    </label>
                    <div class="space-y-3">
                        <div v-for="(lang, idx) in profileData.languages" :key="idx" class="flex gap-2 items-center">
                            <input 
                                v-model="lang.name" 
                                placeholder="Nama Bahasa" 
                                class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                            />
                            <select 
                                v-model="lang.level" 
                                class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                <option value="">Pilih Level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Native">Native</option>
                            </select>
                            <label class="flex items-center text-xs whitespace-nowrap">
                                <input type="checkbox" v-model="lang.certified" class="mr-1" /> 
                                Bersertifikat
                            </label>
                            <button 
                                type="button" 
                                @click="removeLanguage(idx)" 
                                v-if="profileData.languages.length > 1" 
                                class="text-red-500 hover:text-red-700 p-1"
                            >
                                <Icon name="heroicons:trash-20-solid" class="w-4 h-4" />
                            </button>
                        </div>
                        <button 
                            type="button" 
                            @click="addLanguage" 
                            class="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
                        >
                            <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                            Tambah Bahasa
                        </button>
                    </div>
                </div>

                <!-- CV File Upload -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        CV / Resume
                    </label>
                    
                    <!-- Current CV -->
                    <div v-if="currentProfile?.cv_file && !selectedCvFile" class="mb-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-gray-400" />
                            <span class="text-sm text-gray-700">Current CV</span>
                        </div>
                        <a :href="currentProfile.cv_file" target="_blank" class="text-primary hover:text-primary/80 text-sm">
                            View
                        </a>
                    </div>
                    
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
        headline?: string
        bio?: string
        cv_file?: string
        phone?: string
        personal_email?: string
        location?: string
        languages?: Array<{
            name: string
            level: string
            certified: boolean
        }>
    } | null
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-alert': [type: 'success' | 'error' | 'warning' | 'info', title: string, message: string]
    'profile-updated': []
}>()

const config = useRuntimeConfig()

const profileData = ref({
    headline: '',
    bio: '',
    phone: '',
    personal_email: '',
    location: '',
    languages: [
        { name: '', level: '', certified: false }
    ]
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
        profileData.value = {
            headline: profile.headline || '',
            bio: profile.bio || '',
            phone: profile.phone || '',
            personal_email: profile.personal_email || '',
            location: profile.location || '',
            languages: profile.languages?.length ? [...profile.languages] : [{ name: '', level: '', certified: false }]
        }
    }
}, { immediate: true })

const resetForm = () => {
    const profile = props.currentProfile
    profileData.value = {
        headline: profile?.headline || '',
        bio: profile?.bio || '',
        phone: profile?.phone || '',
        personal_email: profile?.personal_email || '',
        location: profile?.location || '',
        languages: profile?.languages?.length ? [...profile.languages] : [{ name: '', level: '', certified: false }]
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

// Language management
const addLanguage = () => {
    profileData.value.languages.push({ name: '', level: '', certified: false })
}

const removeLanguage = (index: number) => {
    if (profileData.value.languages.length > 1) {
        profileData.value.languages.splice(index, 1)
    }
}

// File handlers (same as before)
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

        // Create FormData
        const formData = new FormData()
        
        // Append text fields (only if they have values)
        if (profileData.value.headline) formData.append('headline', profileData.value.headline)
        if (profileData.value.bio) formData.append('bio', profileData.value.bio)
        if (profileData.value.phone) formData.append('phone', profileData.value.phone)
        if (profileData.value.personal_email) formData.append('personal_email', profileData.value.personal_email)
        if (profileData.value.location) formData.append('location', profileData.value.location)
        
        // Append languages as JSON string
        const validLanguages = profileData.value.languages.filter(lang => lang.name && lang.level)
        if (validLanguages.length > 0) {
            formData.append('languages', JSON.stringify(validLanguages))
        }
        
        // Append files
        if (selectedProfilePicture.value) {
            formData.append('profile_picture', selectedProfilePicture.value)
        }
        if (selectedCvFile.value) {
            formData.append('cv_file', selectedCvFile.value)
        }

        const response = await $fetch('/student/profile', {
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
