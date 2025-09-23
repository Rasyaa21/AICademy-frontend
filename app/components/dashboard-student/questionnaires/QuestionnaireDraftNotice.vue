<template>
    <div v-if="hasDraft && !isDraftLoaded" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div class="flex items-start gap-3">
            <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-yellow-600 mt-0.5" />
            <div class="flex-1">
                <h3 class="font-medium text-yellow-800">Draft Tersimpan</h3>
                <p class="text-sm text-yellow-700 mt-1">
                    Kami menemukan jawaban yang belum selesai. Ingin melanjutkan dari terakhir kali?
                </p>
                <div class="flex gap-3 mt-3">
                    <button 
                        @click="$emit('load-draft')"
                        class="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                        Lanjutkan Draft
                    </button>
                    <button 
                        @click="$emit('start-fresh')"
                        class="text-sm text-yellow-700 hover:text-yellow-800"
                    >
                        Mulai Dari Awal
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    hasDraft: boolean
    isDraftLoaded: boolean
}>()

defineEmits<{
    'load-draft': []
    'start-fresh': []
}>()
</script> 