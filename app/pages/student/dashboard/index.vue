<template>
    <div class="w-full flex lg:flex-row lg:space-x-4 flex-col space-y-5 lg:space-y-0 bg-white/80">
        <div class="flex-[7] space-y-5">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p class="text-gray-600 mt-1">
                        Kelola data siswa dan monitor aktivitas mereka
                    </p>
                </div>
            </div>
            <ProfilingBanner />

            <MyProgress />

            <MyChallange/>
        </div>

        <div class="flex-[3] space-y-5">
            <Calendar />

            <Team />
        </div>
    </div>
</template>

<script setup lang="ts">
import Calendar from '~/components/calendar/Calendar.vue';
import MyChallange from '~/components/dashboard-student/index/MyChallange.vue';
import MyProgress from '~/components/dashboard-student/index/MyProgress.vue';
import ProfilingBanner from '~/components/dashboard-student/index/ProfilingBanner.vue';
import Team from '~/components/dashboard-student/Team.vue';



definePageMeta({
    layout: 'dashboard-layout-student-dashboard-layout'
})
</script>