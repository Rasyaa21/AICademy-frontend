<template>
    <div class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
        <Icon name="heroicons:academic-cap" class="mx-auto w-12 h-12 text-gray-400" />
        <h3 class="mt-4 text-sm font-medium text-gray-900">
            {{ searchQuery ? 'Alumni tidak ditemukan' : 'Belum ada alumni' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
            {{ searchQuery 
                ? `Tidak ada alumni yang cocok dengan pencarian "${searchQuery}"` 
                : 'Mulai dengan menambahkan alumni pertama Anda.'
            }}
        </p>
        <div class="mt-6">
            <button
                v-if="searchQuery"
                @click="$emit('clear-filters')"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md border border-transparent shadow-sm bg-primary hover:bg-primary/90"
            >
                Hapus Filter
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    searchQuery?: string
}>()

defineEmits<{
    'clear-filters': []
}>()
</script>