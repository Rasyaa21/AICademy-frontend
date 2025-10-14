<template>
  <div class="bg-white rounded-lg border">
    <!-- View Mode Toggle -->
    <div class="flex justify-between items-center p-6 border-b">
      <h2 class="text-xl font-semibold">Challenge Tersedia</h2>
      <div class="flex gap-2">
        <button
          @click="$emit('update:viewMode', 'grid')"
          :class="[
            'p-2 rounded-lg transition-colors',
            viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          <Icon name="heroicons:squares-2x2-20-solid" class="w-4 h-4" />
        </button>
        <button
          @click="$emit('update:viewMode', 'list')"
          :class="[
            'p-2 rounded-lg transition-colors',
            viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          <Icon name="heroicons:bars-3-20-solid" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="p-6">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="challenge in challenges" :key="challenge.id">
          <ChallengeCard :challenge="challenge" />
          <!-- Action buttons -->
          <div class="mt-3 flex gap-2">
            <slot 
              name="register-button" 
              :challenge="challenge" 
              :is-active="isActive(challenge.deadline)"
            />
            <slot 
              name="submit-button" 
              :challenge="challenge" 
              :is-active="isActive(challenge.deadline)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="p-6">
      <div class="space-y-4">
        <div
          v-for="challenge in challenges"
          :key="challenge.id"
          class="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
        >
          <div class="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">{{ challenge.title }}</h3>
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ challenge.description }}</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>Deadline: {{ formatDate(challenge.deadline) }}</span>
              <span>{{ challenge.current_participants }}/{{ challenge.max_participants }} peserta</span>
            </div>
          </div>
          <div class="flex gap-2">
            <slot 
              name="register-button" 
              :challenge="challenge" 
              :is-active="isActive(challenge.deadline)"
            />
            <slot 
              name="submit-button" 
              :challenge="challenge" 
              :is-active="isActive(challenge.deadline)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChallengeCard from '~/components/card/ChallengeCard.vue'
import type { Challenge } from '~/types/Challenge'

interface Props {
  challenges: Challenge[]
  viewMode: 'grid' | 'list'
}

defineProps<Props>()

defineEmits<{
  'update:viewMode': [value: 'grid' | 'list']
}>()

// Helper functions
const isActive = (deadline: string) => new Date(deadline) > new Date()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>