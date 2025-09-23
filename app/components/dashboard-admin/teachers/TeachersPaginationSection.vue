<template>
    <div v-if="showPagination" class="flex justify-center">
        <nav class="flex gap-2 items-center">
            <button 
                @click="$emit('page-changed', currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
                Previous
            </button>
            
            <span class="px-4 py-2 text-sm text-gray-600">
                Page {{ currentPage }} of {{ totalPages }}
            </span>
            
            <button 
                @click="$emit('page-changed', currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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

const props = defineProps<Props>()

defineEmits<{
    'page-changed': [page: number]
}>()

const showPagination = computed(() => {
    return props.totalItems > props.itemsPerPage
})
</script> 