<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
        <div class="mx-4 w-full max-w-2xl bg-white rounded-xl shadow-xl">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Edit Roadmap
                    </h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form class="p-6 space-y-4" @submit.prevent="updateRoadmap">
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
                        class="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                        {{ isSubmitting ? 'Menyimpan...' : 'Update' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MainTextfield from '~/components/textfield/MainTextfield.vue'
import type { Roadmap, UpdateRoadmapRequest } from '~/types/Roadmap'

const props = defineProps<{
    isOpen: boolean
    roadmapId: string | null
    initialData?: Roadmap
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'show-success-modal', message: string): void
    (e: 'show-error-modal', message: string): void
    (e: 'roadmap-updated'): void
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const roadmapData = ref<UpdateRoadmapRequest>({
    roadmap_name: '',
    description: ''
})

const isSubmitting = ref(false)

const closeModal = () => {
    emit('close')
}

const updateRoadmap = async () => {
    if (!props.roadmapId || isSubmitting.value) return

    try {
        isSubmitting.value = true
        
        await $fetch(`/admin/roadmaps/${props.roadmapId}`, {
            method: 'PUT',
            body: roadmapData.value,
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        
        emit('show-success-modal', 'Roadmap berhasil diperbarui')
        emit('roadmap-updated')
        closeModal()
    } catch (error: any) {
        console.error('Error updating roadmap:', error)
        emit('show-error-modal', error?.data?.message || 'Gagal memperbarui roadmap')
    } finally {
        isSubmitting.value = false
    }
}

watch(() => props.isOpen, (newVal) => {
    if (newVal && props.initialData) {
        roadmapData.value = {
            roadmap_name: props.initialData.roadmap_name,
            description: props.initialData.description
        }
    }
})
</script>