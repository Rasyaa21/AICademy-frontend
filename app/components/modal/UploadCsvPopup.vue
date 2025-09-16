<template>  
    <div v-if="isOpen" class=" fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 min-h-screen">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-3">
            <div class="flex flex-row justify-between">
                <h1 class="font-bold">Upload CSV File</h1>
                <button @click="closeModal">
                    <Icon name="heroicons:x-mark-16-solid" class="w-6 h-6"/>
                </button>
            </div>
            <form action="" class="space-y-3 mb-4">
                <input 
                    type="file" 
                    accept=".csv,text/csv"
                    ref="fileInput"
                    @change="onFileChange"
                    class="block w-full rounded-lg border px-2 py-3 mb-4"
                >
                    <div class="text-sm text-gray-600" v-if="fileName">
                    Selected: <span class="font-medium">{{ fileName }}</span>
                    </div>

                    <div class="flex items-center gap-2">
                    <button
                        type="submit"
                        :disabled="loading"
                        class="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
                    >
                        {{ loading ? 'Uploading…' : 'Upload CSV' }}
                    </button>

                    <button type="button" class="px-3 py-2 rounded-lg border" @click="reset">
                        Reset
                    </button>
                    </div>

                    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
                    <p v-if="message" class="text-sm text-green-600">{{ message }}</p>
            </form>
        </div>
    </div>
</template>
<script setup lang="ts">

const file = ref<File | null>(null)
const fileName = computed(() => file.value?.name ?? '')
const loading = ref(false)
const error = ref('')
const message = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const props = defineProps<{
    isOpen:boolean
}> ()

function onFileChange(e: Event) {
    error.value = ''
    const input = e.target as HTMLInputElement
    const f = input.files?.[0] || null
    if (!f) { file.value = null; return }
    if (!f.name.toLowerCase().endsWith('.csv')) {
        error.value = 'Please select a .csv file.'
        file.value = null
        return
    }
    file.value = f
}

function reset() {
    if (fileInput.value) fileInput.value.value = ''
    file.value = null
    error.value = ''
    message.value = ''
    fileInput.value?.dispatchEvent(new Event('change'))
}

const emit = defineEmits<{
    (event: 'update:isOpen', value : boolean) : void
}>()

function closeModal() {
    emit('update:isOpen', false)
}
</script>