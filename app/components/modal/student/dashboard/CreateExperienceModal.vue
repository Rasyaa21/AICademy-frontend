<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="mx-4 w-full max-w-3xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        {{ editExperience ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru' }}
                    </h3>
                    <button 
                        class="text-gray-400 hover:text-gray-600"
                        @click="closeModal"
                    >
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

            <form class="p-6 space-y-4" @submit.prevent="submitExperience">
                <!-- Basic Fields -->
                <MainTextfield
                    v-model="experienceData.position"
                    name="position"
                    placeholder="e.g., Backend Developer Intern"
                    label="Posisi / Jabatan"
                    required
                >
                    <template #icon>
                        <Icon name="heroicons:briefcase-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield
                    v-model="experienceData.company_name"
                    name="company_name"
                    placeholder="e.g., Tech Solutions Indonesia"
                    label="Nama Perusahaan"
                    required
                >
                    <template #icon>
                        <Icon name="heroicons:building-office-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Jenis Pekerjaan -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Jenis Pekerjaan *
                        </label>
                        <div class="relative">
                            <Icon name="heroicons:clipboard-document-list-20-solid" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                v-model="experienceData.employment_type"
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                required
                            >
                                <option value="">Pilih jenis pekerjaan</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Volunteer">Volunteer</option>
                            </select>
                        </div>
                    </div>

                    <!-- Tipe Lokasi -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Tipe Lokasi *
                        </label>
                        <div class="relative">
                            <Icon name="heroicons:map-pin-20-solid" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                v-model="experienceData.location_type"
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                required
                            >
                                <option value="">Pilih tipe lokasi</option>
                                <option value="On-site">On-site</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>
                </div>

                <MainTextfield
                    v-model="experienceData.location"
                    name="location"
                    placeholder="e.g., Jakarta, Indonesia"
                    label="Lokasi"
                    required
                >
                    <template #icon>
                        <Icon name="heroicons:globe-alt-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MainTextfield
                        v-model="experienceData.start_date"
                        name="start_date"
                        label="Tanggal Mulai"
                        type="date"
                        required
                    >
                        <template #icon>
                            <Icon name="heroicons:calendar-20-solid" class="w-5 h-5 text-gray-400" />
                        </template>
                    </MainTextfield>

                    <div>
                        <MainTextfield
                            v-model="experienceData.end_date"
                            name="end_date"
                            label="Tanggal Selesai"
                            type="date"
                            :disabled="experienceData.is_current"
                        >
                            <template #icon>
                                <Icon name="heroicons:calendar-20-solid" class="w-5 h-5 text-gray-400" />
                            </template>
                        </MainTextfield>
                        <label class="flex items-center mt-2 text-sm">
                            <input
                                v-model="experienceData.is_current"
                                type="checkbox"
                                class="mr-2"
                                @change="handleCurrentJobChange"
                            >
                            Saya masih bekerja di posisi ini
                        </label>
                    </div>
                </div>

                <MainTextfield
                    v-model="experienceData.description"
                    name="description"
                    placeholder="Jelaskan secara singkat tentang pekerjaan Anda..."
                    label="Deskripsi Pekerjaan"
                    :is-textarea="true"
                    rows="3"
                >
                    <template #icon>
                        <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield
                    v-model="experienceData.responsibilities"
                    name="responsibilities"
                    placeholder="- Tanggung jawab pertama&#10;- Tanggung jawab kedua&#10;- Tanggung jawab ketiga"
                    label="Tanggung Jawab"
                    :is-textarea="true"
                    rows="4"
                    help-text="Pisahkan dengan baris baru atau gunakan tanda &quot;-&quot;"
                >
                    <template #icon>
                        <Icon name="heroicons:clipboard-document-list-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield
                    v-model="experienceData.achievements"
                    name="achievements"
                    placeholder="- Meningkatkan performa API sebesar 30%&#10;- Mengimplementasikan sistem caching Redis"
                    label="Pencapaian"
                    :is-textarea="true"
                    rows="3"
                >
                    <template #icon>
                        <Icon name="heroicons:trophy-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield
                    v-model="experienceData.skills"
                    name="skills"
                    placeholder="Go, PostgreSQL, Redis, Docker (pisahkan dengan koma)"
                    label="Keahlian yang Digunakan"
                    help-text="Pisahkan keahlian dengan koma"
                >
                    <template #icon>
                        <Icon name="heroicons:cpu-chip-20-solid" class="w-5 h-5 text-gray-400" />
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
                        class="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <Icon v-if="isSubmitting" name="heroicons:arrow-path-20-solid" class="w-4 h-4 mr-2 animate-spin" />
                        {{ isSubmitting ? 'Menyimpan...' : (editExperience ? 'Update' : 'Simpan') }}
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
    editExperience?: any
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-alert': [type: 'success' | 'error' | 'warning' | 'info', title: string, message: string]
    'experience-saved': []
}>()

const config = useRuntimeConfig()

const experienceData = ref({
    company_name: '',
    position: '',
    employment_type: '',
    location: '',
    location_type: '',
    description: '',
    responsibilities: '',
    achievements: '',
    skills: '',
    start_date: '',
    end_date: '',
    is_current: false
})

const isSubmitting = ref(false)
const errorMessage = ref('')

// Watch for edit experience changes
watch(() => props.editExperience, (experience) => {
    if (experience) {
        experienceData.value = {
            company_name: experience.company_name || '',
            position: experience.position || '',
            employment_type: experience.employment_type || '',
            location: experience.location || '',
            location_type: experience.location_type || '',
            description: experience.description || '',
            responsibilities: experience.responsibilities || '',
            achievements: experience.achievements || '',
            skills: experience.skills || '',
            start_date: experience.start_date ? new Date(experience.start_date).toISOString().split('T')[0] : '',
            end_date: experience.end_date ? new Date(experience.end_date).toISOString().split('T')[0] : '',
            is_current: experience.is_current || false
        }
    }
}, { immediate: true })

const resetForm = () => {
    experienceData.value = {
        company_name: '',
        position: '',
        employment_type: '',
        location: '',
        location_type: '',
        description: '',
        responsibilities: '',
        achievements: '',
        skills: '',
        start_date: '',
        end_date: '',
        is_current: false
    }
    errorMessage.value = ''
}

const closeModal = () => {
    resetForm()
    emit('update:isOpen', false)
}

const handleCurrentJobChange = () => {
    if (experienceData.value.is_current) {
        experienceData.value.end_date = ''
    }
}

const submitExperience = async () => {
    if (isSubmitting.value) return

    try {
        isSubmitting.value = true
        errorMessage.value = ''

        // Prepare payload
        const payload = {
            company_name: experienceData.value.company_name,
            position: experienceData.value.position,
            employment_type: experienceData.value.employment_type,
            location: experienceData.value.location,
            location_type: experienceData.value.location_type,
            description: experienceData.value.description || null,
            responsibilities: experienceData.value.responsibilities || null,
            achievements: experienceData.value.achievements || null,
            skills: experienceData.value.skills || null,
            start_date: new Date(experienceData.value.start_date).toISOString(),
            end_date: experienceData.value.is_current ? null : (experienceData.value.end_date ? new Date(experienceData.value.end_date).toISOString() : null),
            is_current: experienceData.value.is_current
        }

        const url = props.editExperience 
            ? `/student/experiences/${props.editExperience.id}`
            : '/student/experiences'
        
        const method = props.editExperience ? 'PUT' : 'POST'

        const response = await $fetch(url, {
            method,
            body: payload,
            baseURL: config.public.apiBase,
            credentials: 'include'
        })

        if ((response as any).success) {
            emit('show-alert', 'success', 'Berhasil!', `Pengalaman berhasil ${props.editExperience ? 'diupdate' : 'ditambahkan'}!`)
            emit('experience-saved')
            closeModal()
        }
    } catch (error: unknown) {
        console.error('Error saving experience:', error)
        errorMessage.value = (error as { data?: { message?: string } })?.data?.message || 'Gagal menyimpan pengalaman. Silakan coba lagi.'
        emit('show-alert', 'error', 'Error!', errorMessage.value)
    } finally {
        isSubmitting.value = false
    }
}

// Reset form when modal closes
watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})
</script>