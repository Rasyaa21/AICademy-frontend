<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            Edit Role
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Body / Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Loading state -->
        <div v-if="pending" class="flex items-center gap-3 text-gray-500">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span>Memuat detail role…</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-red-500">
          Terjadi kesalahan saat memuat data role. Silakan coba lagi.
        </div>

        <!-- Form fields -->
        <template v-else>
          <MainTextfield
            v-model="formData.name"
            name="name"
            placeholder="Nama Role"
            label="Nama Role"
            required
          >
            <template #icon>
              <Icon name="heroicons:clipboard-document-list" class="w-5 h-5 text-gray-400" />
            </template>
          </MainTextfield>

          <MainTextfield
            v-model="formData.description"
            name="description"
            placeholder="Deskripsi Role"
            label="Deskripsi Role"
          >
            <template #icon>
              <Icon name="heroicons:clipboard-document-list" class="w-5 h-5 text-gray-400" />
            </template>
          </MainTextfield>

          <MainTextfield
            v-model="formData.category"
            name="category"
            placeholder="Kategori"
            label="Kategori"
          >
            <template #icon>
              <Icon name="heroicons:clipboard-document-list" class="w-5 h-5 text-gray-400" />
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
              :disabled="submitting"
              class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="submitting">Menyimpan…</span>
              <span v-else>Update</span>
            </button>
          </div>
        </template>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import MainTextfield from '../../../../textfield/MainTextfield.vue'

const config = useRuntimeConfig()

const props = defineProps<{
  isOpen: boolean
  roleId: string | null
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'show-success-modal': [message: string]
  'show-error-modal': [message: string]
  'updated': []
}>()

const isEditing = computed(() => !!props.roleId)

const formData = ref({
  name: '',
  description: '',
  category: '',
})

const submitting = ref(false)

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    category: '',
  }
}

const closeModal = () => {
  emit('update:isOpen', false)
  resetForm()
}

const headers = useRequestHeaders(['cookie'])

// Fetch detail role berdasarkan roleId
const { data: roleDetail, pending, error, refresh } = await useAsyncData(
    () => `roleDetail-${props.roleId}`,
    () => {
        if (!props.roleId) return null
        return $fetch(`/admin/questionnaires/target-roles/${props.roleId}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
        })
    },
    {
        watch: [() => props.roleId, () => props.isOpen] // refetch kalau ID atau modal dibuka kembali
    }
)

watch(
  () => roleDetail.value,
  (val) => {
    const r = val?.data
    if (r) {
      formData.value = {
        name: r.name ?? '',
        description: r.description ?? '',
        category: r.category ?? '',
      }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// Bersihkan form ketika modal ditutup
watch(() => props.isOpen, (open) => {
  if (!open) resetForm()
})

const handleSubmit = async () => {
  if (!props.roleId) {
    emit('show-error-modal', 'Role ID tidak ditemukan')
    return
  }

  const payload = {
    name: formData.value.name,
    description: formData.value.description,
    category: formData.value.category,
  }

  submitting.value = true
  try {
    await $fetch(`/admin/questionnaires/target-roles/${props.roleId}`, {
      method: 'PUT',
      body: payload,
      credentials: 'include',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      baseURL: config.public.apiBase
    })

    emit('show-success-modal', 'Berhasil memperbarui role')
    emit('updated') // supaya parent bisa refresh()
    closeModal()
  } catch (e: any) {
    // Bangun pesan error yang ramah
    let msg = 'Terjadi kesalahan saat menyimpan perubahan'
    if (e?.data?.message) msg = e.data.message
    else if (e?.message) msg = e.message
    emit('show-error-modal', msg)
  } finally {
    submitting.value = false
  }
}
</script>