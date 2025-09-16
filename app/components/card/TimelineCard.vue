<template>
  <div class="relative mb-8 md:mb-16">
    <!-- Timeline Line -->
    <div class="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/60 via-primary to-primary/60"></div>
    
    <!-- Timeline Dot with Step Number -->
    <div class="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-primary rounded-full border-2 md:border-4 border-white shadow-lg z-10 flex items-center justify-center"
         :class="{ 'bg-primary/80 ring-2 md:ring-4 ring-primary/20': item.isActive }">
      <span class="text-white font-bold text-xs md:text-sm">{{ stepNumber }}</span>
    </div>
    
    <!-- Step Label - Below the dot on mobile, separate column on desktop -->
    <div class="absolute -left-2 top-10 md:hidden">
      <div class="text-white font-semibold text-xs bg-white/10 backdrop-blur-sm rounded-lg px-2 py-0.5">
        Step {{ stepNumber }}
      </div>
    </div>
        
    <!-- Content Layout -->
    <div class="flex flex-col md:flex-row md:items-center" :class="index % 2 === 0 ? 'md:flex-row-reverse' : ''">
      <!-- Card -->
      <div class="w-4/5 md:w-5/12 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 relative hover:shadow-md transition-shadow duration-300 ml-20 md:ml-0"
           :class="index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'">
        <!-- Arrow for Desktop -->
        <div class="hidden md:block absolute top-8 w-3 h-3 bg-white border shadow-sm transform rotate-45"
             :class="index % 2 === 0 ? '-left-1.5 border-r-0 border-b-0' : '-right-1.5 border-l-0 border-t-0'"></div>
        
        <!-- Card Content -->
        <div class="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
          <!-- Icon -->
          <div class="flex-shrink-0 self-center sm:self-start">
            <div class="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary to-primary/80 rounded-lg p-2.5 md:p-3 shadow-sm">
              <Icon :name="item.icon" class="w-full h-full text-white" />
            </div>
          </div>
          
          <!-- Content -->
          <div class="flex-1 text-center sm:text-left">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 md:mb-3">
              <h3 class="font-semibold text-gray-900 text-base md:text-lg leading-tight mb-2 sm:mb-0">
                {{ item.title }}
              </h3>
              <span v-if="item.isActive" 
                    class="bg-primary/10 text-primary px-2 md:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-center sm:self-start sm:ml-2">
                Saat Ini
              </span>
            </div>
            
            <p class="text-gray-600 text-sm mb-3 md:mb-4 leading-relaxed">
              {{ item.description }}
            </p>
            
            <!-- Bottom section -->
            <div class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center justify-center sm:justify-start gap-2">
                <Icon name="heroicons:clock-20-solid" class="w-4 h-4 text-primary" />
                <span class="text-primary font-medium text-sm">{{ item.duration }}</span>
              </div>
              
              <div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-500">{{ completedTasks }}/{{ item.tasks.length }} Tugas</span>
                  <div class="w-12 sm:w-8 h-1 bg-gray-200 rounded-full">
                    <div class="h-full bg-primary rounded-full transition-all duration-300"
                         :style="{ width: `${progressPercentage}%` }"></div>
                  </div>
                </div>
                <button @click="handleLearnMore"
                        class="text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 sm:px-0 sm:py-0 border border-primary/20 rounded-lg sm:border-none sm:rounded-none hover:bg-primary/5 sm:hover:bg-transparent">
                  <span>Pelajari</span>
                  <Icon name="heroicons:arrow-right-20-solid" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step Info for Desktop -->
      <div class="hidden md:block md:w-2/12 text-center">
        <div class="text-white font-semibold text-base bg-white/10 backdrop-blur-sm rounded-lg py-2 px-3 inline-block">
          Step {{ stepNumber }}
        </div>
      </div>
      
      <!-- Empty space for alternating layout -->
      <div class="hidden md:block md:w-5/12"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RoadmapTimelineItem } from '~/types/RoadmapTimeline'

const props = defineProps<{
  item: RoadmapTimelineItem
  index: number
  stepNumber: number
}>()

const emit = defineEmits<{
  'learn-more': [item: RoadmapTimelineItem]
}>()

const completedTasks = computed(() => props.item.tasks.filter(t => t.isCompleted).length)

const progressPercentage = computed(() => {
  if (props.item.tasks.length === 0) return 0
  return (completedTasks.value / props.item.tasks.length) * 100
})

const handleLearnMore = () => emit('learn-more', props.item)
</script>