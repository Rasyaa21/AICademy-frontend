<template>
    <div class="py-12 text-center">
        <div class="mb-4 text-gray-400">
            <Icon :name="icon" class="mx-auto w-16 h-16" />
        </div>
        <h3 class="mb-2 text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="mb-4 text-gray-500">
            {{ description }}
        </p>
        <button 
            v-if="showClearButton"
            @click="$emit('clear-filters')"
            class="font-medium text-primary hover:text-primary/80"
        >
            Reset semua filter
        </button>
        <div v-if="$slots.actions" class="flex justify-center gap-3 mt-4">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    icon: string
    title: string
    description: string
    showClearButton?: boolean
}>()

defineEmits<{
    'clear-filters': []
}>()
</script> 