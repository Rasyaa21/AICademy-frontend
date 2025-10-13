<template>
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <div class="text-red-500 mb-4">{{ error }}</div>
            <button 
                @click="$emit('retry')"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
                Coba Lagi
            </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!projects.length" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:folder-20-solid" class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada project</h3>
            <p class="text-gray-500 mb-6">Mulai tambahkan project pertama Anda untuk menampilkan portofolio</p>
            <button 
                @click="$emit('create-project')"
                class="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto font-medium"
            >
                <Icon name="heroicons:plus-20-solid" class="w-5 h-5" />
                Tambah Project
            </button>
        </div>

        <!-- Table Content -->
        <div v-else class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Project</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Deskripsi</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Durasi</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Status</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="project in projects" :key="project.id" class="border-b border-gray-100 hover:bg-gray-50">
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon name="heroicons:folder-20-solid" class="w-5 h-5 text-primary" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="font-medium text-gray-900 text-sm truncate">{{ project.project_name }}</div>
                                    <div class="text-xs text-gray-500 flex items-center gap-1">
                                        <Icon name="heroicons:photo-20-solid" class="w-3 h-3" />
                                        {{ project.photo_count || 0 }} foto
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6">
                            <p class="text-sm text-gray-600 max-w-xs truncate" :title="project.description">
                                {{ project.description }}
                            </p>
                        </td>
                        <td class="py-4 px-6 text-sm text-gray-600">
                            <div class="space-y-1">
                                <div class="text-xs text-gray-500">
                                    {{ formatDate(project.start_date) }} - {{ formatDate(project.end_date) }}
                                </div>
                                <div class="text-xs text-gray-400">
                                    {{ calculateDuration(project.start_date, project.end_date) }}
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6">
                            <span :class="[
                                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                                project.is_completed 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            ]">
                                <div :class="[
                                    'w-1.5 h-1.5 rounded-full mr-1.5',
                                    project.is_completed ? 'bg-green-400' : 'bg-yellow-400'
                                ]"></div>
                                {{ project.is_completed ? 'Selesai' : 'Dalam Progress' }}
                            </span>
                        </td>
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-1">
                                <button 
                                    @click="$emit('view-project', project)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Lihat Detail"
                                >
                                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    v-if="project.link_url"
                                    @click="openLink(project.link_url)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Buka Link"
                                >
                                    <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-4 h-4 text-blue-600" />
                                </button>
                                <button 
                                    @click="$emit('edit-project', project)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Edit"
                                >
                                    <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    @click="$emit('delete-project', project)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Hapus"
                                >
                                    <Icon name="heroicons:trash-20-solid" class="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Project } from '~/types/Profile'

defineProps<{
    projects: Project[]
    loading?: boolean
    error?: string | null
}>()

defineEmits<{
    'view-project': [project: Project]
    'edit-project': [project: Project]
    'delete-project': [project: Project]
    'create-project': []
    'retry': []
}>()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
        return `${diffDays} hari`
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `${months} bulan`
    } else {
        const years = Math.floor(diffDays / 365)
        const remainingDays = diffDays % 365
        const months = Math.floor(remainingDays / 30)
        return months > 0 ? `${years} tahun ${months} bulan` : `${years} tahun`
    }
}

const openLink = (url: string) => {
    window.open(url, '_blank')
}
</script>