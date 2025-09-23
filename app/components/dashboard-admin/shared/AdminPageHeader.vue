<template>
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
            <p class="text-gray-600 mt-1">
                {{ description }}
            </p>
        </div>
        <div v-if="$slots.actions" class="flex gap-2">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    description: string
}>()
</script> 