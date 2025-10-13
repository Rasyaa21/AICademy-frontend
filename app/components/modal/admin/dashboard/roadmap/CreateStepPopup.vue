<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
        <div class="mx-4 w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Tambah Step Baru
                    </h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form class="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]" @submit.prevent="createStep">
                <MainTextfield 
                    v-model="step.title"
                    name="title" 
                    placeholder="Judul step" 
                    label="Judul Step"
                    required
                >
                    <template #icon>
                        <Icon name="heroicons:clipboard-document-list-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="step.description"
                    name="description" 
                    placeholder="Deskripsi step" 
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
                    v-model="step.learning_objectives"
                    name="learning_objectives" 
                    placeholder="Tujuan pembelajaran" 
                    label="Tujuan Pembelajaran"
                    :is-textarea="true"
                    rows="2"
                >
                    <template #icon>
                        <Icon name="heroicons:academic-cap-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="step.submission_guidelines"
                    name="submission_guidelines" 
                    placeholder="Panduan pengumpulan tugas" 
                    label="Panduan Submission"
                    :is-textarea="true"
                    rows="2"
                >
                    <template #icon>
                        <Icon name="heroicons:document-check-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="step.resource_links"
                    name="resource_links" 
                    placeholder='["https://example.com", "https://example2.com"]' 
                    label="Resource Links (JSON format)"
                    :is-textarea="true"
                    rows="2"
                >
                    <template #icon>
                        <Icon name="heroicons:link-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <div class="grid grid-cols-2 gap-4">
                    <MainTextfield 
                        v-model="step.estimated_duration"
                        name="estimated_duration" 
                        type="number"
                        placeholder="120" 
                        label="Durasi (menit)"
                        required
                    >
                        <template #icon>
                            <Icon name="heroicons:clock-20-solid" class="w-5 h-5 text-gray-400" />
                        </template>
                    </MainTextfield>

                    <div>
                        <label for="difficulty_level" class="block text-sm font-semibold text-gray-700 mb-2">
                            Tingkat Kesulitan
                        </label>
                        <select
                            id="difficulty_level"
                            v-model="step.difficulty_level"
                            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                            required
                        >
                            <option value="beginner">Pemula</option>
                            <option value="intermediate">Menengah</option>
                            <option value="advanced">Lanjutan</option>
                        </select>
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
                        class="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                        {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainTextfield from '~/components/textfield/MainTextfield.vue'
import type { CreateStepRequest } from '~/types/Roadmap'

const props = defineProps<{
    roadmapId: string | null
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'show-success-modal', message: string): void
    (e: 'show-error-modal', message: string): void
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const step = ref<CreateStepRequest>({
    title: '',
    description: '',
    learning_objectives: '',
    submission_guidelines: '',
    resource_links: '',
    estimated_duration: 0,
    difficulty_level: 'beginner'
})

const isSubmitting = ref(false)

const resetForm = () => {
    step.value = {
        title: '',
        description: '',
        learning_objectives: '',
        submission_guidelines: '',
        resource_links: '',
        estimated_duration: 0,
        difficulty_level: 'beginner'
    }
}

const closeModal = () => {
    resetForm()
    emit('close')
}

const createStep = async () => {
    if (!props.roadmapId || isSubmitting.value) return

    try {
        isSubmitting.value = true
        
        await $fetch(`/admin/roadmaps/${props.roadmapId}/steps`, {
            method: 'POST',
            body: step.value,
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        
        emit('show-success-modal', 'Step berhasil dibuat')
        closeModal()
    } catch (error: any) {
        console.error('Error creating step:', error)
        emit('show-error-modal', error?.data?.message || 'Gagal membuat step')
    } finally {
        isSubmitting.value = false
    }
}
</script>