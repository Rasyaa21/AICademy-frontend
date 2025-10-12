<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-xl font-semibold text-gray-900">Projects</h2>
                <p class="text-gray-600 text-sm mt-1">Showcase your amazing projects</p>
            </div>
            <button 
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium"
                @click="$emit('create-project')"
            >
                <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                Tambah Project
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-xl h-80 animate-pulse" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <div class="text-red-500 mb-4">
                <Icon name="heroicons:exclamation-triangle-20-solid" class="w-12 h-12 mx-auto" />
            </div>
            <p class="text-red-600 font-medium mb-4">{{ error }}</p>
            <button 
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                @click="$emit('retry')"
            >
                Coba Lagi
            </button>
        </div>

        <!-- Projects Grid -->
        <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard 
                v-for="project in projects" 
                :key="project.id"
                :project="project"
                @view="$emit('view-project', $event)"
                @edit="$emit('edit-project', $event)"
                @delete="$emit('delete-project', $event)"
            />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <div class="text-gray-400 mb-4">
                <Icon name="heroicons:folder-open-20-solid" class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada project</h3>
            <p class="text-gray-600 mb-6">Mulai showcase karya terbaik Anda dengan menambahkan project pertama</p>
            <button 
                class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                @click="$emit('create-project')"
            >
                Tambah Project Pertama
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Project } from '~/types/Profile'
import ProjectCard from './ProjectCard.vue'

defineProps<{
    projects: Project[]
    loading: boolean
    error: string | null
}>()

defineEmits<{
    'create-project': []
    'view-project': [project: Project]
    'edit-project': [project: Project]
    'delete-project': [project: Project]
    'retry': []
}>()
</script>