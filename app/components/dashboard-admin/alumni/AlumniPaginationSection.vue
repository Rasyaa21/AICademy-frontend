<template>
    <div class="flex flex-col gap-4 justify-between items-center sm:flex-row">
        <div class="text-sm text-gray-700">
            Menampilkan {{ startItem }} - {{ endItem }} dari {{ totalItems }} alumni
        </div>
        
        <div class="flex items-center space-x-2">
            <button
                @click="$emit('page-changed', currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50 disabled:cursor-not-allowed"
            >
                Sebelumnya
            </button>
            
            <div class="flex space-x-1">
                <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="$emit('page-changed', page)"
                    :class="[
                        'px-3 py-2 text-sm font-medium rounded-md',
                        page === currentPage
                            ? 'text-white bg-primary'
                            : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                    ]"
                >
                    {{ page }}
                </button>
            </div>
            
            <button
                @click="$emit('page-changed', currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm font-medium text-gray-500 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50 disabled:cursor-not-allowed"
            >
                Selanjutnya
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}>()

defineEmits<{
    'page-changed': [page: number]
}>()

const startItem = computed(() => {
    return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
    return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(props.totalPages, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    
    return pages
})
</script>