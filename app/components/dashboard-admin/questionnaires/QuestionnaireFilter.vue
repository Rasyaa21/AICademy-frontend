<template>
    <div class="p-6 bg-white rounded-xl border shadow-sm">
        <div class="flex flex-col gap-4 justify-between mb-4 lg:flex-row lg:items-center">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">Filter & Pencarian</h3>
                <p class="mt-1 text-sm text-gray-500">
                    {{ filteredCount }} dari {{ totalCount }} profil karir ditemukan
                </p>
            </div>
        </div>

        <div class="flex flex-col gap-4 lg:flex-row">
            <!-- Search -->
            <div class="relative flex-1">
                <Icon
                    name="heroicons:magnifying-glass-20-solid"
                    class="absolute left-3 top-1/2 w-5 h-5 text-gray-400 -translate-y-1/2"
                />
                <input
                    :value="searchQuery"
                    @input="updateSearch"
                    type="text"
                    placeholder="Cari kuisioner profiling ...."
                    class="py-2 pr-4 pl-10 w-full text-sm rounded-xl border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            
            <button 
                v-if="hasActiveFilters"
                @click="clearFilters"
                class="flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-500 rounded-xl border border-gray-200 transition-colors duration-200 hover:text-gray-700 hover:bg-gray-100"
            >
                <Icon name="heroicons:x-mark-20-solid" class="w-4 h-4" />
                Clear All
            </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-4 justify-between items-start pt-4 mt-6 border-t border-gray-100 sm:flex-row sm:items-center">
            <div class="flex gap-2 items-center text-sm text-gray-600">
                <Icon name="heroicons:bars-arrow-down-20-solid" class="w-4 h-4" />
                <span>Urutkan berdasarkan:</span>
                <select 
                    :value="sortBy"
                    @change="updateSort"
                    class="font-medium bg-transparent border-none cursor-pointer text-primary focus:outline-none"
                >
                    <option value="newest">Terbaru</option>
                    <option value="student-name">Nama Siswa</option>
                    <option value="career-path">Jalur Karir</option>
                    <option value="score-high">Skor Tertinggi</option>
                    <option value="score-low">Skor Terendah</option>
                    <option value="class">Kelas</option>
                </select>
            </div>

            <div class="flex flex-row space-x-3">
                <button 
                    @click="$emit('generate-questionnaire')"
                    class="px-4 py-2 text-white rounded-xl shadow-sm transition-colors bg-primary hover:bg-primary/90"
                >
                    <div class="flex gap-2 items-center">
                        <Icon name="heroicons:document-chart-bar-20-solid" class="w-4 h-4" />
                        <span class="text-sm">Tambah Data Kuisioner</span>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    searchQuery: string
    selectedCareerPath: string
    selectedScoreRange: string
    selectedClass: string
    sortBy: string
    filteredCount: number
    totalCount: number
    hasActiveFilters: boolean
}

defineProps<Props>()

const emit = defineEmits<{
    'update:searchQuery': [value: string]
    'update:selectedCareerPath': [value: string]
    'update:selectedScoreRange': [value: string]
    'update:selectedClass': [value: string]
    'update:sortBy': [value: string]
    'clear-filters': []
    'export-data': []
    'generate-questionnaire': []
}>()

const updateSearch = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:searchQuery', target.value)
}

const updateCareerPath = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:selectedCareerPath', target.value)
}

const updateScoreRange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:selectedScoreRange', target.value)
}

const updateClass = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:selectedClass', target.value)
}

const updateSort = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:sortBy', target.value)
}

const clearFilters = () => {
    emit('clear-filters')
}
</script>