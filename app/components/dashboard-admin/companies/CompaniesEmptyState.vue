<template>
    <div class="py-12 text-center">
        <div class="mb-4 text-gray-400">
            <Icon name="heroicons:building-office-20-solid" class="mx-auto w-16 h-16" />
        </div>
        <h3 class="mb-2 text-lg font-semibold text-gray-900">Tidak ada perusahaan ditemukan</h3>
        <p class="mb-4 text-gray-500">
            {{ searchQuery ? 'Coba ubah kata kunci pencarian atau' : 'Coba ubah' }} filter untuk melihat perusahaan lainnya
        </p>
        <button 
            @click="$emit('clear-filters')"
            class="font-medium text-primary hover:text-primary/80"
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