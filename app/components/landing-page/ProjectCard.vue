<script setup lang="ts">
interface Project {
  id: number
  title: string
  description: string
  category: string
  rank: number
  author: {
    avatar: string
    team: string
  }
  tech: string[]
  image: string
  githubUrl?: string
  liveUrl?: string
}

const props = defineProps<{
  project: Project
  isWinner?: boolean
}>()

const rankColors = {
  1: 'from-yellow-400 to-yellow-600',
  2: 'from-gray-300 to-gray-500', 
  3: 'from-amber-600 to-amber-800'
}
</script>

<template>
  <div class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
       :class="[
         isWinner ? 'transform hover:-translate-y-4 scale-105' : 'transform hover:-translate-y-2',
         project.rank === 1 ? 'ring-4 ring-yellow-400/50' : ''
       ]">
    <div class="h-48 relative overflow-hidden">
      <img :src="project.image" :alt="project.title" 
           class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      
      <!-- Category Badge -->
      <div class="absolute top-4 left-4">
        <span class="bg-red-100 text-primary px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          {{ project.category }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Title -->
      <h3 class="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
        {{ project.title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
        {{ project.description }}
      </p>

      <!-- Tech Stack -->
      <div class="flex flex-wrap gap-1.5 mb-6">
        <span v-for="tech in project.tech" :key="tech" 
              class="px-2.5 py-1 text-xs bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full border border-gray-200 hover:border-primary/30 transition-colors">
          {{ tech }}
        </span>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <img :src="project.author.avatar" :alt="project.author.team" 
                 class="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20">
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ project.author.team }}</p>
          </div>
        </div>

        <div class="flex space-x-2">
          <a v-if="project.githubUrl" :href="project.githubUrl" 
             class="group/btn relative w-9 h-9 bg-gray-50 hover:bg-gray-900 border border-gray-200 hover:border-gray-900 rounded-lg flex items-center justify-center transition-all duration-300">
            <svg class="w-4 h-4 text-gray-600 group-hover/btn:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"/>
            </svg>
          </a>
          <a v-if="project.liveUrl" :href="project.liveUrl" 
             class="group/btn relative w-9 h-9 bg-primary hover:bg-primary/90 border border-primary rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Shine Effect for Winner -->
    <div v-if="project.rank === 1" 
         class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine pointer-events-none"></div>
  </div>
</template>

<style scoped>
@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shine {
  animation: shine 1.5s ease-in-out;
}
</style>