<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">
                        {{ isEditing ? 'Edit Kuisioner' : 'Tambah Kuisioner Baru' }}
                    </h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form  class="p-6 space-y-4" @submit.prevent="handleSubmit">
                <MainTextfield 
                    v-model="formData.name"
                    name="name" 
                    placeholder="Nama Kuisioner" 
                    label="Nama Kuisioner"
                    required
                >
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5.25A2.25 2.25 0 0111.25 3h1.5A2.25 2.25 0 0115 5.25V6h1.5A2.5 2.5 0 0119 8.5v9A2.5 2.5 0 0116.5 20h-9A2.5 2.5 0 015 17.5v-9A2.5 2.5 0 017.5 6H9v-.75zM8.5 11h7m-7 4h7" />
                        </svg>
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="formData.question_count"
                    name="question_count" 
                    placeholder="Jumlah Kuisioner" 
                    label="Jumlah Kuisioner"
                >
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3.75 6.75A2.25 2.25 0 016 4.5h12a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0118 19.5H6a2.25 2.25 0 01-2.25-2.25V6.75z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8.25 10.5a1.75 1.75 0 103.5 0 1.75 1.75 0 00-3.5 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 15l-4.5-4.5a1.5 1.5 0 00-2.121 0L9 15" />
                        </svg>
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="formData.difficulty_level"
                    name="Tingkat Kesulitan" 
                    placeholder="easy, intermediate, hard" 
                    label="Tingkat Kesulitan"
                    :is-textarea="true"
                    rows="3"
                >
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 4.5h7.5L19.5 9V19a2 2 0 01-2 2H7a2 2 0 01-2-2V6.5a2 2 0 012-2z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 13h6m-6 4h6" />
                        </svg>
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-if="!isEditing"
                    v-model="formData.custom_instructions"
                    name="custom_instructions" 
                    placeholder="Instruksi Khusus" 
                    label="Instruksi Khusus"
                    :is-custom_instructions="true"
                    required
                >
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 4l1.2 3.6L14 9l-3.8 1.4L9 14l-1.2-3.6L4 9l3.8-1.4L9 4zM17 10l.9 2.7L21 14l-3.1 1.3L17 18l-.9-2.7L13 14l3.1-1.3L17 10zM12 17l.6 1.8L14 20l-1.4.6L12 22l-.6-1.4L10 20l1.4-1.2L12 17z" />
                        </svg>
                    </template>
                </MainTextfield>

                <div class="flex gap-3 pt-4">
                    <button
                        type="button"
                        @click="closeModal"
                        class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                    Batal
                    </button>
                    <button
                        type="submit"
                        class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                        {{ isEditing ? 'Update' : 'Simpan' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MainTextfield from '~/components/textfield/MainTextfield.vue';

const props = defineProps<{
    isOpen: boolean
    editData?: any
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'submit': [data: any]
}>()

const isEditing = computed(() => !!props.editData)

const formData = ref({
    name: '',
    question_count: '',
    target_roles: '',
    difficulty_level: '',
    focus_areas: '',
    custom_instructions: ''
})

const resetForm = () => {
    formData.value = {
        name: '',
        question_count: '',
        target_roles: '',
        difficulty_level: '',
        focus_areas: '',
        custom_instructions: ''
    }
}

const closeModal = () => {
    emit('update:isOpen', false)
    resetForm()
}

const handleSubmit = () => {
    // const submitData = { ...formData.value }
    // if (isEditing.value) {
    //     submitData.id = props.editData.id
    //     delete submitData.custom_instructions // Don't include custom_instructions in edit
    // }
    
    // emit('submit', submitData)
    // closeModal()
}

watch(() => props.editData, (newData) => {
    if (newData) {
        formData.value = {
            name: newData.name || '',
            question_count: newData.question_count || '',
            target_roles: newData.target_roles || '',
            difficulty_level: newData.difficulty_level || '',
            focus_areas: newData.focus_areas || '',
            custom_instructions: ''
        }
    }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})
</script>