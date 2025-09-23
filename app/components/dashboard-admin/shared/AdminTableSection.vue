<template>
    <div class="overflow-hidden bg-white rounded-xl border shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th 
                            v-for="column in columns" 
                            :key="column.key"
                            class="px-6 py-3 text-sm font-semibold text-left text-gray-900"
                        >
                            {{ column.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <slot name="rows" />
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
interface TableColumn {
    key: string
    label: string
}

defineProps<{
    columns: TableColumn[]
}>()
</script> 