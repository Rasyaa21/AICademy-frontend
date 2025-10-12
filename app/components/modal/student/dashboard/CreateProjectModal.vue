<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
        <div class="mx-4 w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        {{ editMode ? 'Edit Project' : 'Tambah Project Baru' }}
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

            <form class="p-6 space-y-4" @submit.prevent="submitProject">
                <MainTextfield 
                    v-model="projectData.project_name"
                    name="project_name" 
                    placeholder="Nama Project" 
                    label="Nama Project"
                    required
                >
                    <template #icon>
                        <Icon name="heroicons:folder-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="projectData.description"
                    name="description" 
                    placeholder="Deskripsi project" 
                    label="Deskripsi"
                    :is-textarea="true"
                    rows="3"
                    required
                >
                    <template #icon>
                        <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="projectData.link_url"
                    name="link_url" 
                    placeholder="https://github.com/username/project" 
                    label="Link Project"
                    type="url"
                    required
                >
                    <template #icon>
                        <Icon name="heroicons:link-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MainTextfield 
                        v-model="projectData.start_date"
                        name="start_date" 
                        label="Tanggal Mulai"
                        type="date"
                        required
                    >
                        <template #icon>
                            <Icon name="heroicons:calendar-20-solid" class="w-5 h-5 text-gray-400" />
                        </template>
                    </MainTextfield>

                    <MainTextfield 
                        v-model="projectData.end_date"
                        name="end_date" 
                        label="Tanggal Selesai"
                        type="date"
                        required
                    >
                        <template #icon>
                            <Icon name="heroicons:calendar-20-solid" class="w-5 h-5 text-gray-400" />
                        </template>
                    </MainTextfield>
                </div>

                <!-- File Upload Section -->
                <div v-if="!editMode">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Foto Project
                    </label>
                    <div 
                        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors"
                        @drop.prevent="handleDrop"
                        @dragover.prevent
                        @dragenter.prevent
                    >
                        <input 
                            ref="fileInput"
                            type="file"
                            multiple
                            accept="image/*"
                            class="hidden"
                            @change="handleFileSelect"
                        >
                        <Icon name="heroicons:cloud-arrow-up-20-solid" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p class="text-gray-600 mb-2">Drag & drop foto atau</p>
                        <button 
                            type="button"
                            class="text-primary hover:text-primary/80 font-medium"
                            @click="$refs.fileInput?.click()"
                        >
                            Browse Files
                        </button>
                        <p class="text-xs text-gray-500 mt-2">PNG, JPG, JPEG up to 10MB</p>
                    </div>

                    <!-- Selected Files Preview -->
                    <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
                        <div 
                            v-for="(file, index) in selectedFiles" 
                            :key="index"
                            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                            <div class="flex items-center gap-3">
                                <Icon name="heroicons:photo-20-solid" class="w-5 h-5 text-gray-400" />
                                <span class="text-sm text-gray-700">{{ file.name }}</span>
                                <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
                            </div>
                            <button 
                                type="button"
                                class="text-red-500 hover:text-red-700"
                                @click="removeFile(index)"
                            >
                                <Icon name="heroicons:x-mark-20-solid" class="w-4 h-4" />
                            </button>
                        </div>
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
                        {{ isSubmitting ? 'Menyimpan...' : (editMode ? 'Update' : 'Simpan') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import MainTextfield from '~/components/textfield/MainTextfield.vue'
import type { CreateProjectRequest, UpdateProjectRequest, Project } from '~/types/Profile'

const props = defineProps<{
    isOpen: boolean
    editProject?: Project | null
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
    'project-saved': []
}>()

const config = useRuntimeConfig()

const editMode = computed(() => !!props.editProject)
const projectData = ref<CreateProjectRequest | UpdateProjectRequest>({
    project_name: '',
    description: '',
    link_url: '',
    start_date: '',
    end_date: ''
})

const selectedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement>()
const isSubmitting = ref(false)
const errorMessage = ref('')

// Watch for edit project changes
watch(() => props.editProject, (project) => {
    if (project) {
        projectData.value = {
            project_name: project.project_name,
            description: project.description,
            link_url: project.link_url,
            start_date: project.start_date.split('T')[0], // Format for date input
            end_date: project.end_date.split('T')[0],
        }
    }
}, { immediate: true })

const resetForm = () => {
    projectData.value = {
        project_name: '',
        description: '',
        link_url: '',
        start_date: '',
        end_date: ''
    }
    selectedFiles.value = []
    errorMessage.value = ''
}

const closeModal = () => {
    resetForm()
    emit('update:isOpen', false)
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files) {
        selectedFiles.value = Array.from(target.files)
    }
}

const handleDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files) {
        selectedFiles.value = Array.from(event.dataTransfer.files)
    }
}

const removeFile = (index: number) => {
    selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const submitProject = async () => {
    if (isSubmitting.value) return
    
    try {
        isSubmitting.value = true
        errorMessage.value = ''

        if (editMode.value) {
            // Update project
            const response = await $fetch(`/student/projects/${props.editProject?.id}`, {
                method: 'PUT',
                body: projectData.value,
                baseURL: config.public.apiBase,
                credentials: 'include'
            })
            
            if (response.success) {
                emit('show-success-modal', 'Project berhasil diupdate!')
                emit('project-saved')
                closeModal()
            }
        } else {
            // Create project with FormData for file upload
            const formData = new FormData()
            
            // Append project data
            Object.entries(projectData.value).forEach(([key, value]) => {
                if (value) formData.append(key, value as string)
            })
            
            // Append files
            selectedFiles.value.forEach(file => {
                formData.append('photos', file)
            })

            const response = await $fetch('/student/projects', {
                method: 'POST',
                body: formData,
                baseURL: config.public.apiBase,
                credentials: 'include'
            })
            
            if (response.success) {
                emit('show-success-modal', 'Project berhasil dibuat!')
                emit('project-saved')
                closeModal()
            }
        }
    } catch (error: unknown) {
        console.error('Error saving project:', error)
        errorMessage.value = (error as { data?: { message?: string } })?.data?.message || 'Gagal menyimpan project. Silakan coba lagi.'
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