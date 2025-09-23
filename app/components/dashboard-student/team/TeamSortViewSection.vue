<template>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-2 text-sm text-gray-600">
            <Icon name="heroicons:bars-arrow-down-20-solid" class="w-4 h-4" />
            <span>Urutkan berdasarkan:</span>
            <select 
                :value="sortBy"
                @change="$emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
                class="bg-transparent border-none text-primary font-medium cursor-pointer focus:outline-none"
            >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="name">Nama Team</option>
                <option value="members">Jumlah Member</option>
            </select>
        </div>

        <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Tampilan:</span>
            <button 
                @click="$emit('update:viewMode', 'grid')"
                :class="[
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
            >
                <Icon name="heroicons:squares-2x2-20-solid" class="w-4 h-4" />
            </button>
            <button 
                @click="$emit('update:viewMode', 'list')"
                :class="[
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
            >
                <Icon name="heroicons:list-bullet-20-solid" class="w-4 h-4" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    sortBy: string
    viewMode: 'grid' | 'list'
}>()

defineEmits<{
    'update:sortBy': [value: string]
    'update:viewMode': [value: 'grid' | 'list']
}>()
</script> 