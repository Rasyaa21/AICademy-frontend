<template>
    <AdminTableSection :columns="tableColumns">
        <template #rows>
            <tr v-for="questionnaire in paginatedQuestionnaires" :key="questionnaire.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div class="flex gap-3 items-center">
                        <div class="flex justify-center items-center w-10 h-10 rounded-lg bg-primary/10">
                            <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-primary" />
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="text-sm font-medium text-gray-900">
                        {{ questionnaire.name }}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ questionnaire.version }}</td>
                <td class="px-6 py-4">
                    <div class="flex gap-2 items-center">
                        <span 
                            :class="[
                                'px-2 py-1 rounded-full text-xs font-medium',
                                questionnaire.active === true
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            ]"
                        >
                            {{ questionnaire.active === true ? 'Aktif' : 'Draft' }}
                        </span>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                    {{ formatDate(questionnaire.created_at) }}
                </td>
                <td class="py-4 px-6">
                            <div class="flex items-center gap-1">
                                <button 
                                    @click="$emit('preview-questionnaire', questionnaire)"
                                    class="p-1 rounded hover:bg-gray-200"
                                    title="Lihat Detail"
                                >
                                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    @click="$emit('edit-questionnaire', questionnaire)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Edit"
                                >
                                    <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    @click="$emit('delete-questionnaire', questionnaire)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Hapus"
                                >
                                    <Icon name="heroicons:trash-20-solid" class="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </td>
                    </tr>
            </template>
        </AdminTableSection>
</template>

<script setup lang="ts">
import AdminTableSection from '~/components/dashboard-admin/shared/AdminTableSection.vue'
import type { Questionnaire } from '~/types/Questionnaire';


defineProps<{
    paginatedQuestionnaires: Questionnaire[]
}>()

defineEmits<{
    'toggle-status': [questionnaire: Questionnaire]
    'view-responses': [questionnaire: Questionnaire]
    'edit-questionnaire': [questionnaire: Questionnaire]
    'preview-questionnaire': [questionnaire: Questionnaire]
    'delete-questionnaire': [questionnaire: Questionnaire]
}>()

const tableColumns = [
    { key: 'questionnaire', label: 'Kuisioner' },
    { key: 'title', label: 'Nama' },
    { key: 'version', label: 'Versi' },
    { key: 'status', label: 'Status' },
    { key: 'created', label: 'Dibuat' },
    { key: 'actions', label: 'Aksi' }
]

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}
</script> 