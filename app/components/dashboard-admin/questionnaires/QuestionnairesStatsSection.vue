<template>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        <AdminStatsCard
            label="Total Kuisioner"
            :value="questionnaireStats.total"
            icon="heroicons:document-text-20-solid"
            color="primary"
        />
        <AdminStatsCard
            label="Kuisioner Aktif"
            :value="questionnaireStats.active"
            icon="heroicons:check-circle-20-solid"
            color="green"
        />
    </div>
</template>

<script setup lang="ts">
import AdminStatsCard from '~/components/dashboard-admin/shared/AdminStatsCard.vue'

interface QuestionnaireStats {
    total: number
    active: number
}

defineProps<{
    questionnaireStats: QuestionnaireStats
}>()
</script> 