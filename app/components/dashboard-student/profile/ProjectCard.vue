<template>
    <div class="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
        <!-- Project Image/Photos -->
        <div class="h-48 bg-gray-100 relative overflow-hidden">
            <div v-if="project.photos && project.photos.length > 0" class="h-full">
                <img 
                    :src="project.photos[0]?.url" 
                    :alt="project.project_name"
                    class="w-full h-full object-cover"
                    @error="onImageError"
                >
                <div v-if="project.photos.length > 1" class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                    +{{ project.photos.length - 1 }} foto
                </div>
            </div>
            <div v-else class="h-full flex items-center justify-center text-gray-400">
                <Icon name="heroicons:photo-20-solid" class="w-12 h-12" />
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-2 left-2">
                <span v-if="project.is_completed" class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    Selesai
                </span>
                <span v-else class="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
                    Berlangsung
                </span>
            </div>
        </div>

        <!-- Project Info -->
        <div class="p-4">
            <h3 class="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                {{ project.project_name }}
            </h3>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ project.description }}
            </p>
            
            <!-- Project Details -->
            <div class="space-y-2 text-xs text-gray-500 mb-4">
                <div class="flex items-center gap-2">
                    <Icon name="heroicons:calendar-20-solid" class="w-4 h-4" />
                    <span>{{ formatDateRange(project.start_date, project.end_date) }}</span>
                </div>
                <div v-if="project.link_url" class="flex items-center gap-2">
                    <Icon name="heroicons:link-20-solid" class="w-4 h-4" />
                    <a :href="project.link_url" target="_blank" class="text-primary hover:underline truncate">
                        {{ project.link_url }}
                    </a>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
                <button 
                    class="flex-1 px-3 py-2 text-primary bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium"
                    @click="$emit('view', project)"
                >
                    Lihat Detail
                </button>
                <button 
                    class="px-3 py-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    @click="$emit('edit', project)"
                >
                    <Icon name="heroicons:pencil-20-solid" class="w-4 h-4" />
                </button>
                <button 
                    class="px-3 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    @click="$emit('delete', project)"
                >
                    <Icon name="heroicons:trash-20-solid" class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Project } from '~/types/Profile'

defineProps<{
    project: Project
}>()

defineEmits<{
    'view': [project: Project]
    'edit': [project: Project]
    'delete': [project: Project]
}>()

const formatDateRange = (startDate: string, endDate: string) => {
    try {
        const start = new Date(startDate).toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
        const end = new Date(endDate).toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
        return `${start} - ${end}`
    } catch {
        return 'Tanggal tidak valid'
    }
}

const onImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.style.display = 'none'
}
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>