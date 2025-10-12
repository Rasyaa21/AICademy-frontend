<template>
    <ProjectsTableSection 
        :projects="projects"
        :loading="loading"
        :error="error"
        @create-project="$emit('create-project')"
        @view-project="$emit('view-project', $event)"
        @edit-project="$emit('edit-project', $event)"
        @delete-project="$emit('delete-project', $event)"
        @retry="$emit('retry')"
    />
</template>

<script setup lang="ts">
import type { Project } from '~/types/Profile'
import ProjectsTableSection from './ProjectsTableSection.vue'

defineProps<{
    projects: Project[]
    loading?: boolean
    error?: string | null
}>()

defineEmits<{
    'create-project': []
    'view-project': [project: Project]
    'edit-project': [project: Project]
    'delete-project': [project: Project]
    'retry': []
}>()
</script>