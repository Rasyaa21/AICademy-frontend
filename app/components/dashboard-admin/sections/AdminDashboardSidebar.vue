<template>
    <div class="space-y-6">
        <Calendar />
        <QuickActions />
        <RecentActivity />
    </div>
</template>

<script setup lang="ts">
import Calendar from '~/components/calendar/Calendar.vue'
import QuickActions from '~/components/dashboard-admin/index/QuickAction.vue'
import RecentActivity from '~/components/dashboard-admin/index/RecentActivity.vue'
</script> 