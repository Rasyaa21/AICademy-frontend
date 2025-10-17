<script setup lang="ts">
interface CompanyProfile {
  id: string
  company_name: string
  company_location: string
  description: string
  user: {
    id: string
    email: string
    role: string
  }
}

interface Internship {
  id: string
  company_profile_id: string
  title: string
  description: string
  type: string
  posted_at: string
  deadline: string
  company_profile: CompanyProfile
}

const props = defineProps<{
  internship: Internship
}>()

// Helper functions
const formatDeadline = (deadline: string) =>
  new Date(deadline).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const isActive = (deadline: string) => new Date(deadline) > new Date()

const { public: publicConfig } = useRuntimeConfig()
const objectStorageUrl = publicConfig.objectStorageUrl
</script>

<template>
  <NuxtLink
    :to="`/student/dashboard/internships/${internship.id}`"
    class="group block relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
  >
    <!-- Header Section with SMK Telkom background -->
    <div class="h-32 relative overflow-hidden">
      <!-- Background Image -->
      <img 
        src="https://aicademy.galleryne.my.id/assets/smk-telkom.webp" 
        alt="SMK Telkom" 
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <!-- Dark overlay for better text readability -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
      
      <!-- Type Badge -->
      <div class="absolute top-4 left-4">
        <span 
          class="text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/30"
        >
          {{ internship.type }}
        </span>
      </div>

      <!-- Status Badge -->
      <div class="absolute top-4 right-4">
        <div 
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm',
            isActive(internship.deadline) ? 'bg-green-500/90' : 'bg-red-500/90'
          ]"
        >
          <Icon 
            :name="isActive(internship.deadline) ? 'heroicons:check-20-solid' : 'heroicons:x-mark-20-solid'" 
            class="w-4 h-4 text-white" 
          />
        </div>
      </div>

      <!-- Company Name in Header -->
      <div class="absolute bottom-4 left-4 right-4">
        <h4 class="text-white font-medium text-sm truncate drop-shadow-lg">{{ internship.company_profile.company_name }}</h4>
      </div>
    </div>

    <div class="p-6">
      <!-- Company Info -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
          {{ internship.company_profile.company_name }}
        </span>
        <div class="flex items-center text-xs text-gray-500">
          <Icon name="heroicons:map-pin-20-solid" class="w-3.5 h-3.5 mr-1" />
          {{ internship.company_profile.company_location }}
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
        {{ internship.title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ internship.description }}
      </p>

      <!-- Company Description -->
      <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center gap-2">
          <Icon name="heroicons:building-office-20-solid" class="w-4 h-4 text-blue-600" />
          <span class="text-xs font-medium text-blue-800">Tentang Perusahaan</span>
        </div>
        <p class="text-sm text-blue-900 mt-1 line-clamp-2">{{ internship.company_profile.description }}</p>
      </div>

      <!-- Footer with deadline -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p class="text-xs text-gray-500">Deadline</p>
          <p class="text-sm font-medium text-gray-900">{{ formatDeadline(internship.deadline) }}</p>
        </div>
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            isActive(internship.deadline) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          ]"
        >
          {{ isActive(internship.deadline) ? 'Aktif' : 'Tutup' }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>