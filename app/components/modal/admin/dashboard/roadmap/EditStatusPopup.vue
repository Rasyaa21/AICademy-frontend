<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
        <div class="mx-4 w-full max-w-2xl bg-white rounded-xl shadow-xl">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Update Status Roadmap
                    </h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form class="p-6 space-y-4" @submit.prevent="updateStatus">
                <div>
                    <label for="status" class="block text-sm font-semibold text-gray-700 mb-2">
                        Status Roadmap
                    </label>
                    <select
                        id="status"
                        v-model="formData.status"
                        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    >
                        <option value="draft">Draft</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                    </select>
                </div>

                <div class="flex gap-3 pt-4">
                    <button
                        type="button"
                        @click="closeModal"
                        class="flex-1 px-4 py-2 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                        {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    isOpen: boolean
    roadmapId: string | null
    currentStatus?: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'show-success-modal', message: string): void
    (e: 'show-error-modal', message: string): void
    (e: 'status-updated'): void
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const formData = ref({
    status: 'draft'
})

const isSubmitting = ref(false)

const closeModal = () => {
    emit('close')
}

const updateStatus = async () => {
    if (!props.roadmapId || isSubmitting.value) return

    try {
        isSubmitting.value = true
        
        await $fetch(`/admin/roadmaps/${props.roadmapId}`, {
            method: 'PUT',
            body: { status: formData.value.status },
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })

        emit('show-success-modal', 'Status roadmap berhasil diperbarui')
        emit('status-updated')
        closeModal()
    } catch (error: any) {
        console.error('Error updating status:', error)
        emit('show-error-modal', error?.data?.message || 'Gagal memperbarui status roadmap')
    } finally {
        isSubmitting.value = false
    }
}

watch(() => props.isOpen, (newVal) => {
    if (newVal && props.currentStatus) {
        formData.value.status = props.currentStatus
    }
})
</script>