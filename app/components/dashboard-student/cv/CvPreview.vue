<template>
    <!-- CV Preview Card -->
    <div v-if="cvPreview" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-blue-900 flex items-center gap-2">
                <Icon name="heroicons:document-text-20-solid" class="w-5 h-5" />
                Pratinjau CV Anda
            </h3>
            <div class="flex items-center gap-2">
                <span class="text-sm text-blue-600">ATS Score:</span>
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {{ cvPreview.ats_score?.overall || 0 }}/100
                </span>
            </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div>
                <p><strong>Nama:</strong> {{ cvPreview.content?.personal_info?.full_name || '-' }}</p>
                <p><strong>Email:</strong> {{ cvPreview.content?.personal_info?.email || '-' }}</p>
                <p><strong>Telepon:</strong> {{ cvPreview.content?.personal_info?.phone || '-' }}</p>
            </div>
            <div>
                <p><strong>Proyek:</strong> {{ cvPreview.content?.projects?.length || 0 }} proyek</p>
                <p><strong>Sertifikat:</strong> {{ cvPreview.content?.certifications?.length || 0 }} sertifikat</p>
                <p><strong>Keahlian:</strong> {{ cvPreview.content?.skills?.length || 0 }} keahlian</p>
            </div>
        </div>

        <div v-if="cvPreview.ats_score?.suggestions?.length" class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 class="text-sm font-medium text-yellow-800 mb-2">Saran Perbaikan:</h4>
            <ul class="text-sm text-yellow-700 space-y-1">
                <li v-for="suggestion in cvPreview.ats_score.suggestions" :key="suggestion" class="flex items-start gap-2">
                    <Icon name="heroicons:light-bulb-20-solid" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {{ suggestion }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
// filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/dashboard-student/cv/CvPreview.vue
interface Props {
    cvPreview: any
}

defineProps<Props>()
</script>