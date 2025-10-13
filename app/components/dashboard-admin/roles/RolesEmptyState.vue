<template>
    <div class="text-center py-12">
        <div class="text-gray-400 mb-4">
            <Icon name="heroicons:shield-check-20-solid" class="w-16 h-16 mx-auto" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ searchQuery ? 'Tidak ada peran ditemukan' : 'Belum ada peran' }}
        </h3>
        <p class="text-gray-500 mb-4">
            {{ 
                searchQuery 
                    ? 'Coba ubah kata kunci pencarian atau reset filter' 
                    : 'Mulai dengan menambahkan peran baru untuk mengatur akses pengguna' 
            }}
        </p>
        <div class="flex justify-center gap-3">
            <button 
                v-if="searchQuery"
                @click="$emit('clear-filters')"
                class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium"
            >
                Reset Filter
            </button>
            <button 
                @click="$emit('add-role')"
                class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium"
            >
                Tambah Peran
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    searchQuery: string
}

interface Emits {
    (e: 'clear-filters'): void
    (e: 'add-role'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>