<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
        <div class="mx-4 w-full max-w-2xl bg-white rounded-xl shadow-xl">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Detail Alumni
                    </h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="pending" class="p-6">
                <div class="text-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p class="text-gray-500 mt-2">Memuat data alumni...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-6">
                <div class="text-center py-8">
                    <p class="text-red-500">Error: {{ error.message }}</p>
                    <button @click="refresh()" class="mt-2 px-4 py-2 bg-primary text-white rounded-lg">
                        Coba Lagi
                    </button>
                </div>
            </div>

            <!-- Alumni Details -->
            <div v-else-if="alumni" class="p-6 space-y-4">
                <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <img 
                            v-if="alumni.profile_picture" 
                            :src="alumni.profile_picture" 
                            :alt="alumni.fullname"
                            class="w-16 h-16 rounded-full object-cover"
                        />
                        <Icon v-else name="heroicons:user-circle-20-solid" class="w-16 h-16 text-gray-400" />
                    </div>
                    <div>
                        <h4 class="text-xl font-semibold text-gray-900">{{ alumni.fullname }}</h4>
                        <p class="text-gray-600">{{ alumni.email }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                        <p class="text-gray-900">{{ alumni.user_id }}</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Bergabung</label>
                        <p class="text-gray-900">{{ formatDate(alumni.created_at) }}</p>
                    </div>
                </div>

                <div v-if="alumni.headline">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                    <p class="text-gray-900">{{ alumni.headline }}</p>
                </div>

                <div v-if="alumni.bio">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <p class="text-gray-900">{{ alumni.bio }}</p>
                </div>

                <div v-if="alumni.cv_file">
                    <label class="block text-sm font-medium text-gray-700 mb-1">CV File</label>
                    <a :href="alumni.cv_file" target="_blank" class="text-primary hover:text-primary/80">
                        Download CV
                    </a>
                </div>
            </div>

            <div class="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                    @click="closeModal"
                    class="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
                >
                    Tutup
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Alumni } from '~/types/Alumni'

const config = useRuntimeConfig()

const props = defineProps<{
    isOpen: boolean
    alumniId?: string
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
}>()

const headers = useRequestHeaders(['cookie'])

const { data: alumniData, pending, error, refresh } = await useAsyncData(
    `alumni-${props.alumniId}`,
    () => {
        if (!props.alumniId) return null
        return $fetch(`/admin/users/alumni/${props.alumniId}`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
    },
    {
        watch: [() => props.alumniId],
        server: false
    }
)

const alumni = computed(() => alumniData.value?.data as Alumni | null)

const closeModal = () => {
    emit('update:isOpen', false)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>