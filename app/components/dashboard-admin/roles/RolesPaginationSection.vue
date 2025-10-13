<template>
    <div v-if="totalPages > 1" class="flex justify-center">
        <nav class="flex items-center gap-2">
            <button 
                @click="$emit('page-changed', currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:bg-gray-50 transition-colors"
            >
                Previous
            </button>
            
            <span class="px-4 py-2 text-sm text-gray-600">
                Page {{ currentPage }} of {{ totalPages }} ({{ totalItems }} total)
            </span>
            
            <button 
                @click="$emit('page-changed', currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:bg-gray-50 transition-colors"
            >
                Next
            </button>
        </nav>
    </div>
</template>

<script setup lang="ts">
interface Props {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}

interface Emits {
    (e: 'page-changed', page: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>