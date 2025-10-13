<script setup lang="ts">
import type { Challenge } from "~/types/Challenge";

const props = defineProps<{
  challenge: Challenge;
}>();

// Helper
const formatDeadline = (deadline: string) =>
  new Date(deadline).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const isActive = (deadline: string) => new Date(deadline) > new Date();


const { public: publicConfig } = useRuntimeConfig()
const objectStorageUrl = publicConfig.objectStorageUrl
</script>

<template>
  <NuxtLink
    :to="`/student/dashboard/challanges/${challenge.id}`"
    class="group block relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
  >
    <div class="h-32 relative overflow-hidden">
      <NuxtImg :src="`${objectStorageUrl}/assets/smk-telkom.webp`" :alt="challenge.title" class="w-full h-full object-cover" loading="lazy" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      <div class="absolute top-4 right-4">
        <div v-if="challenge.prize" class="w-8 h-8 bg-yellow-500/90 rounded-full flex items-center justify-center">
          <Icon name="heroicons:star-20-solid" class="w-4 h-4 text-white" />
        </div>
      </div>
    </div>

    <div class="p-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{{ challenge.organizer }}</span>
        <div class="flex items-center text-xs text-gray-500">
          <Icon name="heroicons:user-group-20-solid" class="w-3.5 h-3.5 mr-1" />
          {{ challenge.participant }} peserta
        </div>
      </div>

      <h3 class="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
        {{ challenge.title }}
      </h3>

      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ challenge.description }}
      </p>

      <div v-if="challenge.prize" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center gap-2">
          <Icon name="heroicons:gift-20-solid" class="w-4 h-4 text-yellow-600" />
          <span class="text-xs font-medium text-yellow-800">Hadiah</span>
        </div>
        <p class="text-sm font-semibold text-yellow-900 mt-1">{{ challenge.prize }}</p>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p class="text-xs text-gray-500">Deadline</p>
          <p class="text-sm font-medium text-gray-900">{{ formatDeadline(challenge.deadline) }}</p>
        </div>
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            isActive(challenge.deadline) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          ]"
        >
          {{ isActive(challenge.deadline) ? 'Aktif' : 'Berakhir' }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
