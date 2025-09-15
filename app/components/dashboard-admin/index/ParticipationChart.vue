<script setup lang="ts">
const donutData = ref([35, 25, 20, 15, 5]) // Percentages

const marketShareLabels = [
  { name: 'RPL', color: '#3b82f6' }, // Blue
  { name: 'PPLG', color: '#22c55e' }, // Green
  { name: 'TJKT', color: '#f59e0b' }, // Amber
  { name: 'PG', color: '#a855f7' }, // Purple
]
</script>

<template>
    <DonutChart
        :data="donutData"
        :height="300"
        :radius="0"
        :type="'full'"
        :labels="marketShareLabels"
    >
    <div class="absolute text-center">
        <div class="font-semibold">Data Jurusan</div>
        <div class="text-muted">Siswa</div>
    </div>
    </DonutChart>
</template>

