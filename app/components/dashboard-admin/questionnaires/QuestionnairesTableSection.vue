<template>
    <AdminTableSection :columns="tableColumns">
        <template #rows>
            <tr v-for="questionnaire in paginatedQuestionnaires" :key="questionnaire.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div class="flex gap-3 items-center">
                        <div class="flex justify-center items-center w-10 h-10 rounded-lg bg-primary/10">
                            <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-900">{{ questionnaire.title }}</div>
                            <div class="text-xs text-gray-500">{{ questionnaire.description }}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span 
                        :class="[
                            'px-2 py-1 rounded-full text-xs font-medium',
                            questionnaire.type === 'ai-generated' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                        ]"
                    >
                        {{ questionnaire.type === 'ai-generated' ? 'AI Generated' : 'Manual' }}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ questionnaire.questions_count }} pertanyaan</td>
                <td class="px-6 py-4">
                    <div class="flex gap-2 items-center">
                        <span 
                            :class="[
                                'px-2 py-1 rounded-full text-xs font-medium',
                                questionnaire.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            ]"
                        >
                            {{ questionnaire.status === 'active' ? 'Aktif' : 'Draft' }}
                        </span>
                        <button 
                            @click="$emit('toggle-status', questionnaire)"
                            class="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Toggle
                        </button>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                    <div class="flex gap-2 items-center">
                        <span>{{ questionnaire.responses_count }}</span>
                        <button 
                            v-if="questionnaire.responses_count > 0"
                            @click="$emit('view-responses', questionnaire)"
                            class="text-xs text-primary hover:text-primary/80"
                        >
                            Lihat
                        </button>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                    {{ formatDate(questionnaire.created_at) }}
                </td>
                <td class="px-6 py-4">
                    <AdminActionButtons
                        :item="questionnaire"
                        :show-view="true"
                        :show-edit="false"
                        :show-delete="true"
                        @view="$emit('preview-questionnaire', $event)"
                        @delete="$emit('delete-questionnaire', $event)"
                    />
                </td>
            </tr>
        </template>
    </AdminTableSection>
</template>

<script setup lang="ts">
import AdminTableSection from '~/components/dashboard-admin/shared/AdminTableSection.vue'
import AdminActionButtons from '~/components/dashboard-admin/shared/AdminActionButtons.vue'

interface Questionnaire {
    id: string
    title: string
    description: string
    type: string
    status: string
    questions_count: number
    responses_count: number
    created_at: string
    updated_at: string
}

defineProps<{
    paginatedQuestionnaires: Questionnaire[]
}>()

defineEmits<{
    'toggle-status': [questionnaire: Questionnaire]
    'view-responses': [questionnaire: Questionnaire]
    'preview-questionnaire': [questionnaire: Questionnaire]
    'delete-questionnaire': [questionnaire: Questionnaire]
}>()

const tableColumns = [
    { key: 'questionnaire', label: 'Kuisioner' },
    { key: 'type', label: 'Tipe' },
    { key: 'questions', label: 'Jumlah Pertanyaan' },
    { key: 'status', label: 'Status' },
    { key: 'responses', label: 'Respons' },
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