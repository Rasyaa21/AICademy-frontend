<template>
    <div class="bg-white rounded-xl shadow-sm border p-6">
        <div class="flex flex-col lg:flex-row gap-4">
            <!-- Search Input -->
            <div class="flex-1">
                <div class="relative">
                    <Icon name="heroicons:magnifying-glass-20-solid" class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari peran..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                </div>
            </div>


            <!-- Add Role Button -->
            <div>
                <button
                    @click="$emit('add-role')"
                    class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium whitespace-nowrap flex items-center gap-2"
                >
                    <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                    Tambah Peran
                </button>
            </div>
        </div>

        <!-- Filter Summary -->
        <div v-if="hasActiveFilters" class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm text-gray-600">
                <span>Menampilkan {{ filteredCount }} dari {{ totalCount }} peran</span>
            </div>
            <button
                @click="$emit('clear-filters')"
                class="text-sm text-gray-500 hover:text-gray-700"
            >
                Reset Filter
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    searchQuery: string
    selectedType: string
    selectedStatus: string
    sortBy: string
    filteredCount: number
    totalCount: number
    hasActiveFilters: boolean
}

interface Emits {
    (e: 'update:searchQuery', value: string): void
    (e: 'clear-filters'): void
    (e: 'add-role'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = computed({
    get: () => props.searchQuery,
    set: (value) => emit('update:searchQuery', value)
})

</script>