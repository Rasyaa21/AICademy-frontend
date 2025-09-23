<template>
    <div class="text-center py-12">
        <div class="text-gray-400 mb-4">
            <Icon name="heroicons:users-20-solid" class="w-16 h-16 mx-auto" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada siswa ditemukan</h3>
        <p class="text-gray-500 mb-4">
            {{ searchQuery ? 'Coba ubah kata kunci pencarian atau' : 'Coba ubah' }} filter untuk melihat siswa lainnya
        </p>
        <button 
            @click="$emit('clear-filters')"
            class="text-primary hover:text-primary/80 font-medium"
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