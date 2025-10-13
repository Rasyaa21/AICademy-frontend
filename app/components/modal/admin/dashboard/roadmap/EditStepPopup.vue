<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
        <div class="mx-4 w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Edit Step
                    </h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form class="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]" @submit.prevent="updateStep">
                <MainTextfield 
                    v-model="stepData.title"
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
                    v-model="stepData.description"
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
                    v-model="stepData.learning_objectives"
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
                    v-model="stepData.submission_guidelines"
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
                    v-model="stepData.resource_links"
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
                        v-model="stepData.estimated_duration"
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
                            v-model="stepData.difficulty_level"
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
import type { RoadmapStep, UpdateStepRequest } from '~/types/Roadmap'

const props = defineProps<{
    stepId: string | null
    isOpen: boolean
    initialData?: RoadmapStep
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'show-success-modal', message: string): void
    (e: 'show-error-modal', message: string): void
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const stepData = ref<UpdateStepRequest>({
    title: '',
    description: '',
    learning_objectives: '',
    submission_guidelines: '',
    resource_links: '',
    estimated_duration: 0,
    difficulty_level: 'beginner'
})

const isSubmitting = ref(false)

const closeModal = () => {
    emit('close')
}

const updateStep = async () => {
    if (!props.stepId || isSubmitting.value) return

    try {
        isSubmitting.value = true
        
        await $fetch(`/admin/roadmaps/steps/${props.stepId}`, {
            method: 'PUT',
            body: stepData.value,
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        
        emit('show-success-modal', 'Step berhasil diperbarui')
        closeModal()
    } catch (error: any) {
        console.error('Error updating step:', error)
        emit('show-error-modal', error?.data?.message || 'Gagal memperbarui step')
    } finally {
        isSubmitting.value = false
    }
}

watch(() => props.isOpen, (newVal) => {
    if (newVal && props.initialData) {
        stepData.value = {
            title: props.initialData.title,
            description: props.initialData.description,
            learning_objectives: props.initialData.learning_objectives,
            submission_guidelines: props.initialData.submission_guidelines,
            resource_links: typeof props.initialData.resource_links === 'string' 
                ? props.initialData.resource_links 
                : JSON.stringify(props.initialData.resource_links),
            estimated_duration: props.initialData.estimated_duration,
            difficulty_level: props.initialData.difficulty_level
        }
    }
})
</script>

<style scoped>
/* Add any specific styles for this component here */
</style>