<template>
  <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
    <div class="mx-4 w-full max-w-md bg-white rounded-xl shadow-xl">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Daftar Challenge</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
            <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Challenge Info -->
      <div v-if="challenge" class="p-6 border-b border-gray-100">
        <h4 class="font-semibold text-gray-900 mb-2">{{ challenge.title }}</h4>
        <p class="text-sm text-gray-600 line-clamp-3">{{ challenge.description }}</p>
        <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span>{{ challenge.current_participants }}/{{ challenge.max_participants }} peserta</span>
          <span>Deadline: {{ formatDate(challenge.deadline) }}</span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="p-4 mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-2">
          <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-red-500" />
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>
      </div>

      <form class="p-6 space-y-4" @submit.prevent="submitRegister">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Tim</label>
          <select
            v-model="selectedTeamId"
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Pilih tim...</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">
              {{ team.team_name }} ({{ team.members.length }} anggota)
            </option>
          </select>
        </div>

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
            :disabled="isSubmitting || !selectedTeamId"
            class="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Icon v-if="isSubmitting" name="heroicons:arrow-path-20-solid" class="w-4 h-4 mr-2 animate-spin" />
            {{ isSubmitting ? 'Mendaftar...' : 'Daftar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Challenge, Team } from '~/types/Challenge'

const props = defineProps<{
  isOpen: boolean
  challenge: Challenge | null
  teams: Team[]
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'registered': []
}>()

const config = useRuntimeConfig()

const selectedTeamId = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const resetForm = () => {
  selectedTeamId.value = ''
  errorMessage.value = ''
}

const closeModal = () => {
  resetForm()
  emit('update:isOpen', false)
}

const submitRegister = async () => {
  if (isSubmitting.value || !props.challenge) return

  try {
    isSubmitting.value = true
    errorMessage.value = ''

    const response = await $fetch(`/student/challenges/${props.challenge.id}/register`, {
      method: 'POST',
      body: {
        team_id: selectedTeamId.value
      },
      baseURL: config.public.apiBase,
      credentials: 'include'
    })

    if ((response as any).success) {
      emit('registered')
      closeModal()
    }
  } catch (error: unknown) {
    console.error('Error registering challenge:', error)
    errorMessage.value =
      (error as { data?: { message?: string } })?.data?.message ||
      'Gagal mendaftar challenge. Silakan coba lagi.'
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