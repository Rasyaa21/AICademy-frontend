<template>
  <div class="bg-white rounded-lg border p-4">
    <div class="flex justify-between items-center">
      <!-- Sort -->
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <Icon name="heroicons:bars-arrow-down-20-solid" class="w-4 h-4" />
        <span>Urutkan:</span>
        <select 
          :value="sortBy"
          @change="$emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
          class="bg-transparent border-none text-primary font-medium cursor-pointer focus:outline-none"
        >
          <option value="newest">Terbaru</option>
          <option value="deadline">Deadline</option>
          <option value="participants">Peserta</option>
        </select>
      </div>

      <!-- View Mode -->
      <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
        <button
          @click="$emit('update:viewMode', 'grid')"
          :class="[
            'p-2 rounded-md transition-colors',
            viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
          ]"
        >
          <Icon name="heroicons:squares-2x2-20-solid" class="w-4 h-4" />
        </button>
        <button
          @click="$emit('update:viewMode', 'list')"
          :class="[
            'p-2 rounded-md transition-colors',
            viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
          ]"
        >
          <Icon name="heroicons:bars-3-20-solid" class="w-4 h-4" />
        </button>
      </div>
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