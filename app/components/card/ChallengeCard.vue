<script setup lang="ts">
import type { Challenge } from '~/types/Challange'

const props = defineProps<{
  challenge: Challenge
}>()

// Helper functions
const formatDeadline = (deadline: string) => {
  return new Date(deadline).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const isActive = (deadline: string) => {
  return new Date(deadline) > new Date()
}
</script>

<template>
  <div class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
    <!-- Thumbnail -->
    <div class="h-32 relative overflow-hidden">
      <img 
        :src="challenge.thumbnail_image" 
        :alt="challenge.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      
      <!-- Prize Badge -->
      <div class="absolute top-4 right-4">
        <div v-if="challenge.prize" class="w-8 h-8 bg-yellow-500/90 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
          {{ challenge.organizer }}
        </span>
        <div class="flex items-center text-xs text-gray-500">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
          </svg>
          {{ challenge.participant }} peserta
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
        {{ challenge.title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ challenge.description }}
      </p>

      <!-- Prize Section -->
      <div v-if="challenge.prize" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span class="text-xs font-medium text-yellow-800">Hadiah</span>
        </div>
        <p class="text-sm font-semibold text-yellow-900 mt-1">{{ challenge.prize }}</p>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="text-left">
          <p class="text-xs text-gray-500">Deadline</p>
          <p class="text-sm font-medium text-gray-900">{{ formatDeadline(challenge.deadline) }}</p>
        </div>

        <span 
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            isActive(challenge.deadline) 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          ]"
        >
          {{ isActive(challenge.deadline) ? 'Aktif' : 'Berakhir' }}
        </span>
      </div>
    </div>
  </div>
</template>