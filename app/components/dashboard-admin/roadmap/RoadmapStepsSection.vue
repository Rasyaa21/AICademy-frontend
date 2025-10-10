<template>
    <div class="space-y-4">
        <div v-if="loading" class="flex flex-col items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p class="text-gray-500 mt-2">Memuat steps...</p>
        </div>

        <template v-else>
            <div v-if="steps.length === 0" class="text-center py-8">
                <Icon name="heroicons:document-text-20-solid" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p class="text-gray-500 font-medium">Belum ada step</p>
                <p class="text-gray-400 text-sm mt-1">Mulai dengan menambahkan step pertama</p>
                <button
                    @click="$emit('create-step')"
                    class="mt-4 flex items-center mx-auto px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Icon name="heroicons:plus-20-solid" class="w-4 h-4 mr-2" />
                    Tambah Step
                </button>
            </div>

            <div v-else class="space-y-3">
                <div
                    v-for="(step, index) in steps"
                    :key="step.id"
                    class="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3">
                                <span class="flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-primary rounded-full">
                                    {{ step.step_order || index + 1 }}
                                </span>
                                <h4 class="font-medium text-gray-900">{{ step.title }}</h4>
                            </div>
                            <p class="text-gray-600 mt-2 text-sm">{{ step.description }}</p>
                            
                            <!-- Learning Objectives -->
                            <div v-if="step.learning_objectives" class="mt-2">
                                <p class="text-xs font-medium text-gray-700">Tujuan Pembelajaran:</p>
                                <p class="text-xs text-gray-600">{{ step.learning_objectives }}</p>
                            </div>
                            
                            <!-- Submission Guidelines -->
                            <div v-if="step.submission_guidelines" class="mt-2">
                                <p class="text-xs font-medium text-gray-700">Panduan Pengumpulan:</p>
                                <p class="text-xs text-gray-600">{{ step.submission_guidelines }}</p>
                            </div>

                            <!-- Resource Links -->
                            <div v-if="step.resource_links && parsedResourceLinks(step.resource_links).length > 0" class="mt-2">
                                <p class="text-xs font-medium text-gray-700 mb-1">Resource Links:</p>
                                <div class="flex flex-wrap gap-1">
                                    <a 
                                        v-for="(link, linkIndex) in parsedResourceLinks(step.resource_links)" 
                                        :key="linkIndex"
                                        :href="link" 
                                        target="_blank"
                                        class="text-xs text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Link {{ linkIndex + 1 }}
                                    </a>
                                </div>
                            </div>

                            <div class="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                                <span class="flex items-center">
                                    <Icon name="heroicons:clock-20-solid" class="w-3 h-3 mr-1" />
                                    {{ step.estimated_duration || 0 }} min
                                </span>
                                <span 
                                    class="px-2 py-1 rounded-full text-xs font-medium"
                                    :class="{
                                        'bg-green-100 text-green-700': step.difficulty_level === 'beginner',
                                        'bg-yellow-100 text-yellow-700': step.difficulty_level === 'intermediate',
                                        'bg-red-100 text-red-700': step.difficulty_level === 'advanced'
                                    }"
                                >
                                    {{ step.difficulty_level || 'beginner' }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-2 ml-4">
                            <button
                                @click="$emit('edit-step', step)"
                                class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                title="Edit Step"
                            >
                                <Icon name="heroicons:pencil-20-solid" class="w-4 h-4" />
                            </button>
                            <button
                                @click="$emit('delete-step', step)"
                                class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                title="Hapus Step"
                            >
                                <Icon name="heroicons:trash-20-solid" class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Simple pagination info jika diperlukan -->
            <div v-if="steps.length > 0" class="text-center text-sm text-gray-500 pt-4">
                Menampilkan {{ steps.length }} step
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { RoadmapStep } from '~/types/Roadmap'

const props = defineProps<{
    steps: RoadmapStep[]
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'create-step'): void
    (e: 'edit-step', step: RoadmapStep): void
    (e: 'delete-step', step: RoadmapStep): void
}>()

// Parse resource links yang berupa JSON string
const parsedResourceLinks = (resourceLinks: string | null): string[] => {
    if (!resourceLinks) return []
    
    try {
        const parsed = JSON.parse(resourceLinks)
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.error('Failed to parse resource links:', error)
        return []
    }
}
</script>

<style scoped>
/* Add any specific styles for this component here */
</style>