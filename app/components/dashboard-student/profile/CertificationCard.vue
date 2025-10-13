<template>
    <div class="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
        <!-- Certification Image -->
        <div class="h-40 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
            <div v-if="certification.photos && certification.photos.length > 0" class="h-full">
                <img 
                    :src="certification.photos[0]?.url" 
                    :alt="certification.name"
                    class="w-full h-full object-cover"
                    @error="onImageError"
                >
            </div>
            <div v-else class="h-full flex items-center justify-center text-primary">
                <Icon name="heroicons:academic-cap-20-solid" class="w-12 h-12" />
            </div>
            
            <!-- Status Badges -->
            <div class="absolute top-2 left-2 space-y-1">
                <span v-if="certification.is_expired" class="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium block">
                    Expired
                </span>
                <span v-else-if="certification.is_expiring_soon" class="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium block">
                    Akan Expired
                </span>
                <span v-else class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium block">
                    Valid
                </span>
            </div>
        </div>

        <!-- Certification Info -->
        <div class="p-4">
            <h3 class="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                {{ certification.name }}
            </h3>
            <p class="text-primary text-sm font-medium mb-3">
                {{ certification.issuing_organization }}
            </p>
            
            <!-- Certification Details -->
            <div class="space-y-2 text-xs text-gray-500 mb-4">
                <div class="flex items-center gap-2">
                    <Icon name="heroicons:calendar-20-solid" class="w-4 h-4" />
                    <span>Issued: {{ formatDate(certification.issue_date) }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <Icon name="heroicons:clock-20-solid" class="w-4 h-4" />
                    <span>Expires: {{ formatDate(certification.expiration_date) }}</span>
                </div>
                <div v-if="certification.credential_id" class="flex items-center gap-2">
                    <Icon name="heroicons:identification-20-solid" class="w-4 h-4" />
                    <span class="truncate">ID: {{ certification.credential_id }}</span>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
                <button 
                    v-if="certification.credential_url"
                    class="flex-1 px-3 py-2 text-primary bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium"
                    @click="openCredentialUrl"
                >
                    Verify
                </button>
                <button 
                    class="flex-1 px-3 py-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    @click="$emit('view', certification)"
                >
                    Detail
                </button>
                <button 
                    class="px-3 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    @click="$emit('delete', certification)"
                >
                    <Icon name="heroicons:trash-20-solid" class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Certification } from '~/types/Profile'

const props = defineProps<{
    certification: Certification
}>()

defineEmits<{
    'view': [certification: Certification]
    'delete': [certification: Certification]
}>()

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } catch {
        return dateString
    }
}

const openCredentialUrl = () => {
    if (props.certification.credential_url) {
        window.open(props.certification.credential_url, '_blank')
    }
}

const onImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.style.display = 'none'
}
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>