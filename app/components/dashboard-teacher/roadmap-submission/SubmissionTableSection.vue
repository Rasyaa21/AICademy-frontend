<template>
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Roadmap & Step
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Evidence
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submitted
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="submission in submissions" :key="submission.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div>
                                <div class="text-sm font-medium text-gray-900">{{ submission.student_name }}</div>
                                <div class="text-sm text-gray-500">{{ submission.student_email }}</div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div>
                                <div class="text-sm font-medium text-gray-900">{{ submission.roadmap_name }}</div>
                                <div class="text-sm text-gray-500">Step {{ submission.step_order }}: {{ submission.step_title }}</div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                    {{ submission.evidence_type }}
                                </span>
                                <a 
                                    :href="submission.evidence_link" 
                                    target="_blank" 
                                    class="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-4 h-4" />
                                </a>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ formatDate(submission.submitted_at) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <button
                                class="inline-flex items-center px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                                @click="$emit('review-submission', submission)"
                            >
                                <Icon name="heroicons:eye-20-solid" class="w-4 h-4 mr-1" />
                                Review
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { RoadmapSubmission } from '~/types/RoadmapSubmission'

defineProps<{
    submissions: RoadmapSubmission[]
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}>()

defineEmits<{
    'review-submission': [submission: RoadmapSubmission]
    'page-changed': [page: number]
}>()

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return 'Invalid Date'
    }
}
</script>