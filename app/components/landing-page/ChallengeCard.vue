<script setup lang="ts">
interface Challenge {
  id: number
  title: string
  category: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  participants: number
  deadline: string
  author: {
    name: string
    avatar: string
    school: string
  }
  tech: string[]
  bgColor: string
}

const props = defineProps<{
  challenge: Challenge
}>()

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700', 
  Hard: 'bg-red-100 text-primary'
}
</script>

<template>
  <div class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
    <div class="absolute top-0 right-0 w-32 h-32 opacity-5">
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="currentColor" class="text-primary"/>
      </svg>
    </div>
    
    <div class="h-24 relative overflow-hidden">
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('/assets/images/smk-telkom.jpeg')"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-br from-primary/80 to-red-600/80"></div>
      
      <div class="absolute top-4 left-4 z-10">
        <span :class="difficultyColors[challenge.difficulty]" 
              class="px-3 py-1 rounded-full text-xs font-semibold">
          {{ challenge.difficulty }}
        </span>
      </div>
      <div class="absolute top-4 right-4 z-10">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Category -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
          {{ challenge.category }}
        </span>
        <div class="flex items-center text-xs text-gray-500">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
          </svg>
          {{ challenge.participants }}+ participants
        </div>
      </div>
      <h3 class="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
        {{ challenge.title }}
      </h3>

      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ challenge.description }}
      </p>

      <div class="flex flex-wrap gap-2 mb-4">
        <span v-for="tech in challenge.tech" :key="tech" 
              class="px-2.5 py-1 text-xs bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full border border-gray-200 hover:border-primary/30 transition-colors">
          {{ tech }}
        </span>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center space-x-3">
          <img :src="challenge.author.avatar" :alt="challenge.author.name" 
               class="w-8 h-8 rounded-full object-cover">
          <div>
            <p class="text-sm font-medium text-gray-900">{{ challenge.author.name }}</p>
            <p class="text-xs text-gray-500">{{ challenge.author.school }}</p>
          </div>
        </div>

        <div class="text-right">
          <p class="text-xs text-gray-500">Deadline</p>
          <p class="text-sm font-medium text-gray-900">{{ challenge.deadline }}</p>
        </div>
      </div>
    </div>

  </div>
</template>