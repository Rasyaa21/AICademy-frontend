<template>
    <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
                <p v-if="description" class="text-gray-600 mt-1">{{ description }}</p>
            </div>
            <div v-if="$slots.actions" class="flex items-center gap-3">
                <slot name="actions" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title: string
    description?: string
}

defineProps<Props>()
</script>