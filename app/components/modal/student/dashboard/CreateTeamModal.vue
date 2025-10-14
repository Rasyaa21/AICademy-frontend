<template>
  <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div class="mx-4 w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Buat Tim Baru</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
            <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="p-4 m-6 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-2">
          <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-red-500" />
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>
      </div>

      <form class="p-6 space-y-4" @submit.prevent="submitTeam">
        <!-- Team Name -->
        <MainTextfield
          v-model="teamData.team_name"
          name="team_name"
          placeholder="Nama Tim"
          label="Nama Tim"
          required
        >
          <template #icon>
            <Icon name="heroicons:user-group-20-solid" class="w-5 h-5 text-gray-400" />
          </template>
        </MainTextfield>

        <!-- About Team -->
        <MainTextfield
          v-model="teamData.about"
          name="about"
          placeholder="Ceritakan tentang tim Anda"
          label="Tentang Tim"
          :is-textarea="true"
          rows="3"
          required
        >
          <template #icon>
            <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-gray-400" />
          </template>
        </MainTextfield>

        <!-- Team Members Section -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-semibold text-gray-700">Anggota Tim</label>
            <button
              type="button"
              class="text-sm text-primary hover:text-primary/80"
              @click="addMember()"
            >
              + Tambah Anggota
            </button>
          </div>

          <div
            v-for="(row, idx) in members"
            :key="row.id"
            class="p-3 mb-3 border rounded-lg bg-gray-50"
          >
            <div class="grid grid-cols-1 md:grid-cols-1 gap-3">
              <!-- Student searchable dropdown -->
              <div class="relative">
                <label class="block text-xs font-medium text-gray-600 mb-1">Siswa</label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="row.studentQuery"
                    type="text"
                    class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Cari siswa berdasarkan nama..."
                    @input="onStudentInput(row)"
                    @focus="openStudentDropdown(row)"
                  />
                  <button
                    v-if="row.student"
                    type="button"
                    class="px-2 text-xs text-gray-500 hover:text-gray-700"
                    @click="clearStudent(row)"
                    title="Hapus pilihan siswa"
                  >
                    Clear
                  </button>
                </div>
                <div
                  v-if="row.isStudentOpen"
                  class="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-56 overflow-auto"
                >
                  <div v-if="row.loadingStudent" class="p-2 text-xs text-gray-500">Loading...</div>
                  <template v-else>
                    <button
                      v-for="s in row.studentOptions"
                      :key="s.id"
                      type="button"
                      class="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                      @click="selectStudent(row, s)"
                    >
                      <div class="font-medium">{{ s.fullname }}</div>
                      <div class="text-xs text-gray-500">NIS: {{ s.nis }} <span v-if="s.class">· {{ s.class }}</span></div>
                    </button>
                    <div v-if="!row.studentOptions.length" class="px-3 py-2 text-xs text-gray-500">Tidak ada hasil</div>
                  </template>
                </div>
                <p v-if="row.student" class="mt-1 text-xs text-gray-600">
                  Dipilih: {{ row.student.fullname }} ({{ row.student.nis }})
                </p>
              </div>
            </div>

            <div class="flex justify-end mt-3">
              <button
                v-if="members.length > 1"
                type="button"
                class="text-xs text-red-500 hover:text-red-700"
                @click="removeMember(idx)"
              >
                Hapus
              </button>
            </div>
          </div>
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
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Icon v-if="isSubmitting" name="heroicons:arrow-path-20-solid" class="w-4 h-4 mr-2 animate-spin" />
            {{ isSubmitting ? 'Membuat...' : 'Buat Tim' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import MainTextfield from '~/components/textfield/MainTextfield.vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'team-created': []
}>()

const config = useRuntimeConfig()

type StudentOption = { id: string; fullname: string; nis: string; class?: string }

type MemberRow = {
  id: string
  student: StudentOption | null
  role: string
  studentQuery: string
  studentOptions: StudentOption[]
  isStudentOpen: boolean
  loadingStudent: boolean
  studentTimer?: ReturnType<typeof setTimeout>
}

const teamData = ref({
  team_name: '',
  about: ''
})

const members = ref<MemberRow[]>([
  {
    id: cryptoRandomId(),
    student: null,
    role: 'Leader',
    studentQuery: '',
    studentOptions: [],
    isStudentOpen: false,
    loadingStudent: false
  }
])

const isSubmitting = ref(false)
const errorMessage = ref('')

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10)
}

const resetForm = () => {
  teamData.value = {
    team_name: '',
    about: ''
  }
  members.value = [
    {
      id: cryptoRandomId(),
      student: null,
      role: 'Leader',
      studentQuery: '',
      studentOptions: [],
      isStudentOpen: false,
      loadingStudent: false
    }
  ]
  errorMessage.value = ''
}

const closeModal = () => {
  resetForm()
  emit('update:isOpen', false)
}

/* Members controls */
const addMember = () => {
  members.value.push({
    id: cryptoRandomId(),
    student: null,
    role: 'Member',
    studentQuery: '',
    studentOptions: [],
    isStudentOpen: false,
    loadingStudent: false
  })
}

const removeMember = (idx: number) => {
  members.value.splice(idx, 1)
}

/* Search Students */
const fetchStudents = async (query: string) => {
  const url = `/student/users/students?page=1&limit=10&search=${encodeURIComponent(query || '')}`
  const res = await $fetch<{ success: boolean; data: StudentOption[] }>(url, {
    baseURL: config.public.apiBase,
    credentials: 'include'
  })
  return res?.success ? res.data : []
}

const onStudentInput = (row: MemberRow) => {
  row.loadingStudent = true
  row.isStudentOpen = true
  if (row.studentTimer) clearTimeout(row.studentTimer)
  row.studentTimer = setTimeout(async () => {
    try {
      row.studentOptions = await fetchStudents(row.studentQuery)
    } finally {
      row.loadingStudent = false
    }
  }, 300)
}

const openStudentDropdown = (row: MemberRow) => {
  row.isStudentOpen = true
  if (!row.studentOptions.length && row.studentQuery) onStudentInput(row)
}

const selectStudent = (row: MemberRow, s: StudentOption) => {
  row.student = s
  row.studentQuery = `${s.fullname} (${s.nis})`
  row.isStudentOpen = false
}

const clearStudent = (row: MemberRow) => {
  row.student = null
  row.studentQuery = ''
}

/* Submit */
const submitTeam = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    errorMessage.value = ''

    // collect only IDs as the API expects
    const memberIds = members.value
      .filter((m) => m.student)
      .map((m) => m.student!.id)

    if (memberIds.length === 0) {
      errorMessage.value = 'Minimal harus ada satu anggota tim'
      return
    }

    // ...existing code...
    const body = {
      team_name: teamData.value.team_name,
      about: teamData.value.about,
      member_ids: memberIds
    }

    const response = await $fetch('/student/challenges/teams', {
      method: 'POST',
      body,
      baseURL: config.public.apiBase,
      credentials: 'include'
    })

    if ((response as any).success) {
      emit('team-created')
      closeModal()
    }
  } catch (error: unknown) {
    console.error('Error creating team:', error)
    errorMessage.value =
      (error as { data?: { message?: string } })?.data?.message ||
      'Gagal membuat tim. Silakan coba lagi.'
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