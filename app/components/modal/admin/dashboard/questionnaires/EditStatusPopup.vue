<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
        <div class="mx-4 w-full max-w-2xl bg-white rounded-xl shadow-xl">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Update Status Kuisioner
                    </h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form class="p-6 space-y-4" @submit.prevent="handleSubmit">
                <div>
                    <label for="status" class="block text-sm font-semibold text-gray-700 mb-2">
                        Status Kuisioner
                    </label>
                    <select
                        id="status"
                        v-model="formData.active"
                        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    >
                        <option :value="true">Active</option>
                        <option :value="false">Tidak Aktif</option>
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
                        :disabled="submitting"
                        class="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                        {{ submitting ? 'Menyimpan...' : 'Simpan' }}
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
    questionnairesId: string | null
    currentStatus?: boolean
}>()

const config = useRuntimeConfig()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
}>()

const submitting = ref(false)

const formData = ref({
    active: false
})

// Watch untuk mengupdate formData ketika currentStatus berubah
watch(() => props.currentStatus, (newStatus) => {
    if (newStatus !== undefined) {
        formData.value.active = newStatus
    }
}, { immediate: true })

// Reset formData ketika modal dibuka
watch(() => props.isOpen, (isOpen) => {
    if (isOpen && props.currentStatus !== undefined) {
        formData.value.active = props.currentStatus
    }
})

const closeModal = () => {
    emit('update:isOpen', false)
}

const headers = useRequestHeaders(['cookie'])

const handleSubmit = async () => {
    if (!props.questionnairesId) {
        emit('show-error-modal', 'Questionnaire ID tidak ditemukan')
        return
    }

    submitting.value = true

    try {
        const payload = {
            active: formData.value.active
        }

        await $fetch(`/admin/questionnaires/${props.questionnairesId}/activate`, {
            method: 'PUT',
            body: payload,
            credentials: 'include',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            baseURL: config.public.apiBase
        })
        
        emit('show-success-modal', 'Berhasil memperbarui status kuisioner')
        closeModal()
    } catch (e: any) {
        let msg = 'Terjadi kesalahan saat menyimpan perubahan'
        if (e?.data?.message) msg = e.data.message
        else if (e?.message) msg = e.message
        emit('show-error-modal', msg)
    } finally {
        submitting.value = false
    }
}
</script>