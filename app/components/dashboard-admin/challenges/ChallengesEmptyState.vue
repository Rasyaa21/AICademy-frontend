<template>
    <div class="py-12 text-center">
        <div class="mb-4 text-gray-400">
            <Icon name="heroicons:trophy-20-solid" class="mx-auto w-16 h-16" />
        </div>
        <h3 class="mb-2 text-lg font-semibold text-gray-900">Tidak ada challenge ditemukan</h3>
        <p class="text-gray-500">
            {{ searchQuery ? 'Coba ubah kata kunci pencarian atau' : 'Coba ubah' }} filter untuk melihat challenge lainnya
        </p>
        <button 
            class="font-medium text-primary hover:text-primary/80"
            @click="$emit('clear-filters')"
        >
            Reset semua filter
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    searchQuery: string
}>()

defineEmits<{
    'clear-filters': []
}>()
</script>