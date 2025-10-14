<template>
  <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
    <div class="mx-4 w-full max-w-lg bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Submit Solusi</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
            <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Challenge Info -->
      <div v-if="challenge" class="p-6 border-b border-gray-100">
        <h4 class="font-semibold text-gray-900 mb-2">{{ challenge.title }}</h4>
        <p class="text-sm text-gray-600 line-clamp-3">{{ challenge.description }}</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="p-4 mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-2">
          <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-red-500" />
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>
      </div>

      <form class="p-6 space-y-4" @submit.prevent="submitSolution">
        <!-- Title -->
        <MainTextfield
          v-model="submitData.title"
          name="title"
          placeholder="Masukkan judul submission"
          label="Judul Submission"
          required
        >
          <template #icon>
            <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-gray-400" />
          </template>
        </MainTextfield>

        <!-- GitHub URL -->
        <MainTextfield
          v-model="submitData.github_url"
          name="github_url"
          placeholder="https://github.com/username/repository"
          label="GitHub Repository URL"
          type="url"
          required
        >
          <template #icon>
            <Icon name="heroicons:link-20-solid" class="w-5 h-5 text-gray-400" />
          </template>
        </MainTextfield>

        <!-- Live URL -->
        <MainTextfield
          v-model="submitData.live_url"
          name="live_url"
          placeholder="https://your-demo.com"
          label="Live Demo URL (Opsional)"
          type="url"
        >
          <template #icon>
            <Icon name="heroicons:globe-alt-20-solid" class="w-5 h-5 text-gray-400" />
          </template>
        </MainTextfield>

        <!-- Description -->
        <MainTextfield
          v-model="submitData.description"
          name="description"
          placeholder="Ceritakan tentang solusi Anda..."
          label="Deskripsi"
          :is-textarea="true"
          rows="4"
          required
        >
          <template #icon>
            <Icon name="heroicons:chat-bubble-left-ellipsis-20-solid" class="w-5 h-5 text-gray-400" />
          </template>
        </MainTextfield>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            class="flex-1 px-4 py-2 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
            @click="closeModal"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Icon v-if="isSubmitting" name="heroicons:arrow-path-20-solid" class="w-4 h-4 mr-2 animate-spin" />
            {{ isSubmitting ? 'Mengirim...' : 'Submit' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import MainTextfield from '~/components/textfield/MainTextfield.vue'
import type { Challenge } from '~/types/Challenge'

const props = defineProps<{
  isOpen: boolean
  challenge: Challenge | null
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'submitted': []
}>()

const config = useRuntimeConfig()

const submitData = ref({
  title: '',
  github_url: '',
  live_url: '',
  description: ''
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const resetForm = () => {
  submitData.value = {
    title: '',
    github_url: '',
    live_url: '',
    description: ''
  }
  errorMessage.value = ''
}

const closeModal = () => {
  resetForm()
  emit('update:isOpen', false)
}

const submitSolution = async () => {
  if (isSubmitting.value || !props.challenge) return

  try {
    isSubmitting.value = true
    errorMessage.value = ''

    const response = await $fetch(`/student/challenges/${props.challenge.id}/submit`, {
      method: 'POST',
      body: submitData.value,
      baseURL: config.public.apiBase,
      credentials: 'include'
    })

    if ((response as any).success) {
      emit('submitted')
      closeModal()
    }
  } catch (error: unknown) {
    console.error('Error submitting solution:', error)
    errorMessage.value =
      (error as { data?: { message?: string } })?.data?.message ||
      'Gagal mengirim submission. Silakan coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}

// Reset form when modal closes
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) resetForm()
  }
)
</script>