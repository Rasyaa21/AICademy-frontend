<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
        <div class="mx-4 w-full max-w-2xl bg-white rounded-xl shadow-xl">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Tambah Roadmap Baru
                    </h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form class="p-6 space-y-4" @submit.prevent="createRoadmap">
                <MainTextfield 
                    v-model="roadmapData.roadmap_name"
                    name="roadmap_name" 
                    placeholder="Nama Roadmap" 
                    label="Nama Roadmap"
                    required
                >
                    <template #icon>
                        <Icon name="heroicons:clipboard-document-list-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="roadmapData.description"
                    name="description" 
                    placeholder="Deskripsi roadmap" 
                    label="Deskripsi"
                    :is-textarea="true"
                    rows="3"
                    required
                >
                    <template #icon>
                        <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <div>
                    <label for="targetRole" class="block text-sm font-semibold text-gray-700 mb-2">
                        Target Role <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <Icon name="heroicons:user-group-20-solid" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            v-model="roadmapData.profiling_role_id"
                            id="targetRole"
                            class="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-8 py-3 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 appearance-none"
                            required
                        >
                            <option value="" disabled>Pilih Target Role</option>
                            <option 
                                v-for="role in targetRoles" 
                                :key="role.id" 
                                :value="role.id"
                            >
                                {{ role.name }}
                            </option>
                        </select>
                        <Icon name="heroicons:chevron-down-20-solid" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                    <div v-if="loadingRoles" class="mt-2 text-sm text-gray-500">
                        <Icon name="heroicons:arrow-path-20-solid" class="w-4 h-4 inline animate-spin mr-1" />
                        Memuat target roles...
                    </div>
                    <div v-else-if="errorRoles" class="mt-2 text-sm text-red-500">
                        Gagal memuat target roles. 
                        <button type="button" @click="fetchTargetRoles" class="underline hover:no-underline">
                            Coba lagi
                        </button>
                    </div>
                </div>

                <div class="flex gap-3 pt-4">
                    <button
                        type="button"
                        @click="closeModal"
                        class="flex-1 px-4 py-2 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
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
import { ref, watch } from 'vue'
import MainTextfield from '~/components/textfield/MainTextfield.vue'
import type { CreateRoadmapRequest } from '~/types/Roadmap'

interface TargetRole {
    id: string
    name: string
    description: string
    category: string
    active: boolean
    created_at: string
    updated_at: string
}

const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'show-success-modal', message: string): void
    (e: 'show-error-modal', message: string): void
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const roadmapData = ref<CreateRoadmapRequest>({
    roadmap_name: '',
    description: '',
    profiling_role_id: ''
})

const targetRoles = ref<TargetRole[]>([])
const loadingRoles = ref(false)
const errorRoles = ref(false)
const isSubmitting = ref(false)

const resetForm = () => {
    roadmapData.value = {
        roadmap_name: '',
        description: '',
        profiling_role_id: ''
    }
}

const closeModal = () => {
    resetForm()
    emit('close')
}

const fetchTargetRoles = async () => {
    try {
        loadingRoles.value = true
        errorRoles.value = false
        
        const response = await $fetch('/admin/questionnaires/target-roles?page=1&limit=30', {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        
        if (response?.success && response?.data?.data) {
            targetRoles.value = response.data.data
        } else {
            throw new Error('Invalid response format')
        }
    } catch (error) {
        console.error('Error fetching target roles:', error)
        errorRoles.value = true
        targetRoles.value = []
    } finally {
        loadingRoles.value = false
    }
}

const createRoadmap = async () => {
    if (isSubmitting.value) return
    
    try {
        isSubmitting.value = true
        
        await $fetch('/admin/roadmaps', {
            method: 'POST',
            body: roadmapData.value,
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        
        emit('show-success-modal', 'Roadmap berhasil dibuat!')
        closeModal()
    } catch (error: any) {
        console.error('Error creating roadmap:', error)
        emit('show-error-modal', error?.data?.message || 'Gagal membuat roadmap. Silakan coba lagi.')
    } finally {
        isSubmitting.value = false
    }
}

// Fetch target roles when modal opens
watch(() => props.isOpen, (newValue) => {
    if (newValue && targetRoles.value.length === 0) {
        fetchTargetRoles()
    }
})

watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})
</script>

<style scoped>
/* Add any specific styles for this component here */
</style>