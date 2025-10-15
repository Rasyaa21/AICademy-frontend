<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <!-- Pending Review -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600">Pending Review</p>
                    <p class="text-2xl font-bold text-yellow-600">{{ submissionStats.pending }}</p>
                </div>
                <div class="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl">
                    <Icon name="heroicons:clock-20-solid" class="w-6 h-6 text-yellow-600" />
                </div>
            </div>
        </div>

        <!-- Approved -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600">Approved</p>
                    <p class="text-2xl font-bold text-green-600">{{ submissionStats.approved }}</p>
                </div>
                <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                    <Icon name="heroicons:check-circle-20-solid" class="w-6 h-6 text-green-600" />
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600">Rejected</p>
                    <p class="text-2xl font-bold text-red-600">{{ submissionStats.rejected }}</p>
                </div>
                <div class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl">
                    <Icon name="heroicons:x-circle-20-solid" class="w-6 h-6 text-red-600" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SubmissionStats {
    total: number
    pending: number
    approved: number
    rejected: number
}

const props = defineProps<{
    submissionStats: SubmissionStats
}>()

const approvalRate = computed(() => {
    const reviewed = props.submissionStats.approved + props.submissionStats.rejected
    if (reviewed === 0) return 0
    return Math.round((props.submissionStats.approved / reviewed) * 100)
})
</script>