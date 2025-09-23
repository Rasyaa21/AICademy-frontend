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
                        placeholder="Cari kuisioner..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                </div>
            </div>

            <!-- Status Filter -->
            <div class="w-full lg:w-48">
                <select
                    v-model="selectedStatus"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            <!-- Type Filter -->
            <div class="w-full lg:w-48">
                <select
                    v-model="selectedType"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="">Semua Tipe</option>
                    <option value="ai-generated">AI Generated</option>
                    <option value="manual">Manual</option>
                </select>
            </div>

            <!-- Sort -->
            <div class="w-full lg:w-48">
                <select
                    v-model="sortBy"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="newest">Terbaru</option>
                    <option value="title">Nama A-Z</option>
                    <option value="responses">Respons Terbanyak</option>
                    <option value="questions">Pertanyaan Terbanyak</option>
                </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
                <button
                    @click="$emit('generate-questionnaire')"
                    class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium whitespace-nowrap flex items-center gap-2"
                >
                    <Icon name="heroicons:sparkles-20-solid" class="w-4 h-4" />
                    Generate AI
                </button>
            </div>
        </div>

        <!-- Filter Summary -->
        <div v-if="hasActiveFilters" class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm text-gray-600">
                <span>Menampilkan {{ filteredCount }} dari {{ totalCount }} kuisioner</span>
                <span v-if="activeFiltersCount > 0" class="text-primary">
                    ({{ activeFiltersCount }} filter aktif)
                </span>
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
    selectedStatus: string
    selectedType: string
    sortBy: string
    filteredCount: number
    totalCount: number
    activeFiltersCount: number
    hasActiveFilters: boolean
}


const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:selectedStatus', value: string): void
  (e: 'update:selectedType', value: string): void
  (e: 'update:sortBy', value: string): void
  (e: 'clear-filters'): void
  (e: 'generate-questionnaire'): void
  (e: 'add-questionnaire'): void
}>()

const props = defineProps<Props>()


const searchQuery = computed({
    get: () => props.searchQuery,
    set: (value) => emit('update:searchQuery', value)
})

const selectedStatus = computed({
    get: () => props.selectedStatus,
    set: (value) => emit('update:selectedStatus', value)
})

const selectedType = computed({
    get: () => props.selectedType,
    set: (value) => emit('update:selectedType', value)
})

const sortBy = computed({
    get: () => props.sortBy,
    set: (value) => emit('update:sortBy', value)
})
</script>