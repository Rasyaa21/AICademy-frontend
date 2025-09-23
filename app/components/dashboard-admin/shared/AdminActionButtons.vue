<template>
    <div class="flex gap-1 items-center">
        <button 
            v-if="showView"
            @click="$emit('view', item)"
            class="p-1 rounded hover:bg-gray-200"
            title="Lihat Detail"
        >
            <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
        </button>
        <button 
            v-if="showEdit"
            @click="$emit('edit', item)"
            class="p-1 rounded hover:bg-gray-200"
            title="Edit"
        >
            <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-gray-600" />
        </button>
        <button 
            v-if="showDelete"
            @click="$emit('delete', item)"
            class="p-1 rounded hover:bg-gray-200"
            title="Hapus"
        >
            <Icon name="heroicons:trash-20-solid" class="w-4 h-4 text-red-600" />
        </button>
        <slot name="custom-actions" :item="item" />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    item: any
    showView?: boolean
    showEdit?: boolean
    showDelete?: boolean
}>()

defineEmits<{
    'view': [item: any]
    'edit': [item: any]
    'delete': [item: any]
}>()
</script> 