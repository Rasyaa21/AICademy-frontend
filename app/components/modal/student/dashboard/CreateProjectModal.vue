<template>
  <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
    <div class="mx-4 w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editMode ? 'Edit Project' : 'Tambah Project Baru' }}
          </h3>
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

      <form class="p-6 space-y-4" @submit.prevent="submitProject">
        <!-- Basic fields -->
        <MainTextfield
          v-model="projectData.project_name"
          name="project_name"
          placeholder="Nama Project"
          label="Nama Project"
          required
        >
          <template #icon>
            <Icon name="heroicons:folder-20-solid" class="w-5 h-5 text-gray-400" />
          </template>
        </MainTextfield>

        <MainTextfield
          v-model="projectData.description"
          name="description"
          placeholder="Deskripsi project"
          label="Deskripsi"
          :is-textarea="true"
          rows="3"
          required
        >
          <template #icon>
            <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-gray-400" />
          </template>
        </MainTextfield>

        <MainTextfield
          v-model="projectData.link_url"
          name="link_url"
          placeholder="https://github.com/username/project"
          label="Link Project"
          type="url"
          required
        >
          <template #icon>
            <Icon name="heroicons:link-20-solid" class="w-5 h-5 text-gray-400" />
          </template>
        </MainTextfield>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MainTextfield v-model="projectData.start_date" name="start_date" label="Tanggal Mulai" type="date" required>
            <template #icon>
              <Icon name="heroicons:calendar-20-solid" class="w-5 h-5 text-gray-400" />
            </template>
          </MainTextfield>

          <MainTextfield v-model="projectData.end_date" name="end_date" label="Tanggal Selesai" type="date" required>
            <template #icon>
              <Icon name="heroicons:calendar-20-solid" class="w-5 h-5 text-gray-400" />
            </template>
          </MainTextfield>
        </div>

        <!-- File Upload Section (only in create) -->
        <div v-if="!editMode">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Foto Project</label>
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors"
            @drop.prevent="handleDrop"
            @dragover.prevent
            @dragenter.prevent
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            />
            <Icon name="heroicons:cloud-arrow-up-20-solid" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 mb-2">Drag & drop foto atau</p>
            <button
              type="button"
              class="text-primary hover:text-primary/80 font-medium"
              @click="$refs.fileInput?.click()"
            >
              Browse Files
            </button>
            <p class="text-xs text-gray-500 mt-2">PNG, JPG, JPEG up to 10MB</p>
          </div>

          <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <Icon name="heroicons:photo-20-solid" class="w-5 h-5 text-gray-400" />
                <span class="text-sm text-gray-700">{{ file.name }}</span>
                <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
              </div>
              <button type="button" class="text-red-500 hover:text-red-700" @click="removeFile(index)">
                <Icon name="heroicons:x-mark-20-solid" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Contributors Section -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-semibold text-gray-700">Kontributor</label>
            <button
              type="button"
              class="text-sm text-primary hover:text-primary/80"
              @click="addContributor()"
            >
              + Tambah Kontributor
            </button>
          </div>

          <div
            v-for="(row, idx) in contributors"
            :key="row.id"
            class="p-3 mb-3 border rounded-lg bg-gray-50"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
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

              <!-- Role searchable dropdown -->
              <div class="relative">
                <label class="block text-xs font-medium text-gray-600 mb-1">Role</label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="row.roleQuery"
                    type="text"
                    class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Cari role kontributor..."
                    @input="onRoleInput(row)"
                    @focus="openRoleDropdown(row)"
                  />
                  <button
                    v-if="row.role"
                    type="button"
                    class="px-2 text-xs text-gray-500 hover:text-gray-700"
                    @click="clearRole(row)"
                    title="Hapus pilihan role"
                  >
                    Clear
                  </button>
                </div>
                <div
                  v-if="row.isRoleOpen"
                  class="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-56 overflow-auto"
                >
                  <div v-if="row.loadingRole" class="p-2 text-xs text-gray-500">Loading...</div>
                  <template v-else>
                    <button
                      v-for="r in row.roleOptions"
                      :key="r.id"
                      type="button"
                      class="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                      @click="selectRole(row, r)"
                    >
                      <div class="font-medium">{{ r.name }}</div>
                    </button>
                    <div v-if="!row.roleOptions.length" class="px-3 py-2 text-xs text-gray-500">Tidak ada hasil</div>
                  </template>
                </div>
                <p v-if="row.role" class="mt-1 text-xs text-gray-600">
                  Dipilih: {{ row.role.name }}
                </p>
              </div>
            </div>

            <div class="flex justify-end mt-3">
              <button
                v-if="contributors.length > 1"
                type="button"
                class="text-xs text-red-500 hover:text-red-700"
                @click="removeContributor(idx)"
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
            {{ isSubmitting ? 'Menyimpan...' : (editMode ? 'Update' : 'Simpan') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/modal/student/dashboard/CreateProjectModal.vue
import MainTextfield from '~/components/textfield/MainTextfield.vue'
import type { CreateProjectRequest, UpdateProjectRequest, Project } from '~/types/Profile'

const props = defineProps<{
  isOpen: boolean
  editProject?: Project | null
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'show-success-modal': [message: string]
  'show-error-modal': [message: string]
  'project-saved': []
}>()

const config = useRuntimeConfig()

const editMode = computed(() => !!props.editProject)
const projectData = ref<CreateProjectRequest | UpdateProjectRequest>({
  project_name: '',
  description: '',
  link_url: '',
  start_date: '',
  end_date: ''
})

const selectedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement>()
const isSubmitting = ref(false)
const errorMessage = ref('')

type RoleOption = { id: string; name: string }
type StudentOption = { id: string; fullname: string; nis: string; class?: string }

type ContributorRow = {
  id: string
  student: StudentOption | null
  role: RoleOption | null
  studentQuery: string
  roleQuery: string
  studentOptions: StudentOption[]
  roleOptions: RoleOption[]
  isStudentOpen: boolean
  isRoleOpen: boolean
  loadingStudent: boolean
  loadingRole: boolean
  studentTimer?: ReturnType<typeof setTimeout>
  roleTimer?: ReturnType<typeof setTimeout>
}

const contributors = ref<ContributorRow[]>([
  {
    id: cryptoRandomId(),
    student: null,
    role: null,
    studentQuery: '',
    roleQuery: '',
    studentOptions: [],
    roleOptions: [],
    isStudentOpen: false,
    isRoleOpen: false,
    loadingStudent: false,
    loadingRole: false
  }
])

function cryptoRandomId() {
  // minimal random id for v-for keys
  return Math.random().toString(36).slice(2, 10)
}

// Watch for edit project changes
watch(
  () => props.editProject,
  (project) => {
    if (project) {
      projectData.value = {
        project_name: project.project_name,
        description: project.description,
        link_url: project.link_url,
        start_date: project.start_date.split('T')[0],
        end_date: project.end_date.split('T')[0]
      }
      // If you have project.contributors from API, prefill here (optional)
      // contributors.value = mapFromProject(project.contributors)
    }
  },
  { immediate: true }
)

const resetForm = () => {
  projectData.value = {
    project_name: '',
    description: '',
    link_url: '',
    start_date: '',
    end_date: ''
  }
  selectedFiles.value = []
  errorMessage.value = ''
  contributors.value = [
    {
      id: cryptoRandomId(),
      student: null,
      role: null,
      studentQuery: '',
      roleQuery: '',
      studentOptions: [],
      roleOptions: [],
      isStudentOpen: false,
      isRoleOpen: false,
      loadingStudent: false,
      loadingRole: false
    }
  ]
}

const closeModal = () => {
  resetForm()
  emit('update:isOpen', false)
}

/* Files */
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files)
  }
}
const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files) {
    selectedFiles.value = Array.from(event.dataTransfer.files)
  }
}
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/* Contributors controls */
const addContributor = () => {
  contributors.value.push({
    id: cryptoRandomId(),
    student: null,
    role: null,
    studentQuery: '',
    roleQuery: '',
    studentOptions: [],
    roleOptions: [],
    isStudentOpen: false,
    isRoleOpen: false,
    loadingStudent: false,
    loadingRole: false
  })
}
const removeContributor = (idx: number) => {
  contributors.value.splice(idx, 1)
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
const onStudentInput = (row: ContributorRow) => {
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
const openStudentDropdown = (row: ContributorRow) => {
  row.isStudentOpen = true
  if (!row.studentOptions.length && row.studentQuery) onStudentInput(row)
}
const selectStudent = (row: ContributorRow, s: StudentOption) => {
  row.student = s
  row.studentQuery = `${s.fullname} (${s.nis})`
  row.isStudentOpen = false
}
const clearStudent = (row: ContributorRow) => {
  row.student = null
  row.studentQuery = ''
}

/* Search Roles */
const fetchRoles = async (query: string) => {
  const url = `/student/questionnaires/target-roles?page=1&limit=10&search=${encodeURIComponent(query || '')}`
  const res = await $fetch<{
    success: boolean
    data: { data: RoleOption[] }
  }>(url, { baseURL: config.public.apiBase, credentials: 'include' })
  return res?.success ? res.data.data : []
}
const onRoleInput = (row: ContributorRow) => {
  row.loadingRole = true
  row.isRoleOpen = true
  if (row.roleTimer) clearTimeout(row.roleTimer)
  row.roleTimer = setTimeout(async () => {
    try {
      row.roleOptions = await fetchRoles(row.roleQuery)
    } finally {
      row.loadingRole = false
    }
  }, 300)
}
const openRoleDropdown = (row: ContributorRow) => {
  row.isRoleOpen = true
  if (!row.roleOptions.length && row.roleQuery) onRoleInput(row)
}
const selectRole = (row: ContributorRow, r: RoleOption) => {
  row.role = r
  row.roleQuery = r.name
  row.isRoleOpen = false
}
const clearRole = (row: ContributorRow) => {
  row.role = null
  row.roleQuery = ''
}

/* Submit */
const submitProject = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    errorMessage.value = ''

    const contributorsPayload = contributors.value
      .filter((c) => c.student && c.role)
      .map((c) => ({
        student_id: c.student!.id,
        role_id: c.role!.id
      }))

    if (editMode.value) {
      // Update project (JSON)
      const body = {
        ...projectData.value,
        contributors: contributorsPayload
      }
      const response = await $fetch(`/student/projects/${props.editProject?.id}`, {
        method: 'PUT',
        body,
        baseURL: config.public.apiBase,
        credentials: 'include'
      })
      if ((response as any).success) {
        emit('show-success-modal', 'Project berhasil diupdate!')
        emit('project-saved')
        closeModal()
      }
    } else {
      // Create project with FormData
      const formData = new FormData()
      Object.entries(projectData.value).forEach(([key, value]) => {
        if (value) formData.append(key, value as string)
      })
      // files
      selectedFiles.value.forEach((file) => formData.append('photos', file))
      // contributors as JSON string
      formData.append('contributors', JSON.stringify(contributorsPayload))

      const response = await $fetch('/student/projects', {
        method: 'POST',
        body: formData,
        baseURL: config.public.apiBase,
        credentials: 'include'
      })

      if ((response as any).success) {
        emit('show-success-modal', 'Project berhasil dibuat!')
        emit('project-saved')
        closeModal()
      }
    }
  } catch (error: unknown) {
    console.error('Error saving project:', error)
    errorMessage.value =
      (error as { data?: { message?: string } })?.data?.message ||
      'Gagal menyimpan project. Silakan coba lagi.'
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