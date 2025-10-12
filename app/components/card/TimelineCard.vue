<template>
  <div class="relative mb-8 md:mb-16">
    <!-- Timeline Dot with Step Number -->
    <div class="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-white shadow-lg z-10 flex items-center justify-center"
         :class="getDotClass()">
      <Icon v-if="item.isLocked" name="heroicons:lock-closed-20-solid" class="text-white w-4 h-4 md:w-5 md:h-5" />
      <Icon v-else-if="item.isCompleted" name="heroicons:check-20-solid" class="text-white w-4 h-4 md:w-5 md:h-5" />
      <span v-else class="text-white font-bold text-xs md:text-sm">{{ stepNumber }}</span>
    </div>
    
    <!-- Connecting Line Segments -->
    <div v-if="!isLast" class="absolute left-4 md:left-1/2 md:transform md:-translate-x-px top-8 md:top-12 w-0.5 h-full z-0"
         :class="getLineClass()">
    </div>
    
    <!-- Locked Badge -->
    <div v-if="item.isLocked" class="absolute -left-8 top-12 md:left-1/2 md:transform md:-translate-x-1/2 md:top-16 z-20">
      <div class="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
        <Icon name="heroicons:lock-closed-20-solid" class="w-3 h-3 inline mr-1" />
        Terkunci
      </div>
    </div>
    
    <!-- Step Label - Below the dot on mobile, separate column on desktop -->
    <div class="absolute -left-2 top-10 md:hidden z-20">
      <div class="text-white font-semibold text-xs backdrop-blur-sm rounded-lg px-2 py-0.5"
           :class="getStepLabelClass()">
        Step {{ stepNumber }}
      </div>
    </div>
        
    <!-- Content Layout -->
    <div class="flex flex-col md:flex-row md:items-center" :class="index % 2 === 0 ? 'md:flex-row-reverse' : ''">
      <!-- Card -->
      <div class="w-4/5 md:w-5/12 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 relative transition-all duration-300 ml-20 md:ml-0 z-10"
           :class="[
             index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto',
             item.isLocked ? 'opacity-60 bg-gray-50' : 'hover:shadow-md'
           ]">
        
        <!-- Locked Overlay -->
        <div v-if="item.isLocked" class="absolute inset-0 bg-gray-50/70 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-30">
          <div class="text-center">
            <Icon name="heroicons:lock-closed-20-solid" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-500 font-medium">Selesaikan step sebelumnya</p>
          </div>
        </div>

        <!-- Arrow for Desktop -->
        <div class="hidden md:block absolute top-8 w-3 h-3 bg-white border shadow-sm transform rotate-45 z-20"
             :class="index % 2 === 0 ? '-left-1.5 border-r-0 border-b-0' : '-right-1.5 border-l-0 border-t-0'"></div>
        
        <!-- Card Content -->
        <div class="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
          <!-- Icon -->
          <div class="flex-shrink-0 self-center sm:self-start">
            <div class="w-12 h-12 md:w-14 md:h-14 rounded-lg p-2.5 md:p-3 shadow-sm"
                 :class="getIconClass()">
              <Icon :name="item.icon" class="w-full h-full" 
                    :class="item.isLocked ? 'text-gray-400' : 'text-white'" />
            </div>
          </div>
          
          <!-- Content -->
          <div class="flex-1 text-center sm:text-left">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 md:mb-3">
              <h3 class="font-semibold text-gray-900 text-base md:text-lg leading-tight mb-2 sm:mb-0"
                  :class="item.isLocked ? 'text-gray-500' : 'text-gray-900'">
                {{ item.title }}
              </h3>
              <span v-if="getStatusBadge()" 
                    class="px-2 md:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-center sm:self-start sm:ml-2"
                    :class="getStatusBadgeClass()">
                {{ getStatusBadge() }}
              </span>
            </div>
            
            <p class="text-gray-600 text-sm mb-3 md:mb-4 leading-relaxed"
               :class="item.isLocked ? 'text-gray-400' : 'text-gray-600'">
              {{ item.description }}
            </p>
            
            <!-- Bottom section -->
            <div class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center justify-center sm:justify-start gap-2">
                <Icon name="heroicons:clock-20-solid" class="w-4 h-4" 
                      :class="item.isLocked ? 'text-gray-400' : 'text-primary'" />
                <span class="font-medium text-sm"
                      :class="item.isLocked ? 'text-gray-400' : 'text-primary'">
                  {{ item.duration }}
                </span>
              </div>
              
              <div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <!-- Progress indicator -->
                <div class="flex items-center gap-2" v-if="!item.isLocked">
                  <span class="text-xs text-gray-500">Progress</span>
                  <div class="w-12 sm:w-8 h-1 bg-gray-200 rounded-full">
                    <div class="h-full bg-primary rounded-full transition-all duration-300"
                         :style="{ width: `${getStepProgress()}%` }"></div>
                  </div>
                </div>

                <!-- Action Button -->
                <button @click="handleAction"
                        :disabled="item.isLocked"
                        class="font-medium text-sm transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg"
                        :class="getActionButtonClass()">
                  <span>{{ getActionButtonText() }}</span>
                  <Icon :name="getActionButtonIcon()" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step Info for Desktop -->
      <div class="hidden md:block md:w-2/12 text-center z-20">
        <div class="text-white font-semibold text-base backdrop-blur-sm rounded-lg py-2 px-3 inline-block"
             :class="getStepLabelClass()">
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
  isLast?: boolean
}>()

const emit = defineEmits<{
  'learn-more': [item: RoadmapTimelineItem]
  'start-step': [item: RoadmapTimelineItem]
}>()

const getDotClass = () => {
  if (props.item.isCompleted) {
    return 'bg-green-500 ring-2 md:ring-4 ring-green-500/20'
  } else if (props.item.isActive) {
    return 'bg-primary ring-2 md:ring-4 ring-primary/20'
  } else if (props.item.isLocked) {
    return 'bg-gray-400'
  } else {
    return 'bg-gray-300'
  }
}

const getLineClass = () => {
  if (props.item.isCompleted) {
    return 'bg-green-500'
  } else if (props.item.isActive) {
    return 'bg-gradient-to-b from-primary to-gray-300'
  } else {
    return 'bg-gray-300'
  }
}

const getIconClass = () => {
  if (props.item.isLocked) {
    return 'bg-gray-400'
  } else if (props.item.isCompleted) {
    return 'bg-gradient-to-br from-green-500 to-green-600'
  } else {
    return 'bg-gradient-to-br from-primary to-primary/80'
  }
}

const getStepLabelClass = () => {
  if (props.item.isLocked) {
    return 'bg-gray-400/20'
  } else if (props.item.isCompleted) {
    return 'bg-green-500/20'
  } else {
    return 'bg-white/10'
  }
}

const getStatusBadge = () => {
  if (props.item.isCompleted) return 'Selesai'
  if (props.item.isActive) return 'Aktif'
  if (props.item.isLocked) return 'Terkunci'
  return null
}

const getStatusBadgeClass = () => {
  if (props.item.isCompleted) {
    return 'bg-green-100 text-green-700 border border-green-200'
  } else if (props.item.isActive) {
    return 'bg-primary/10 text-primary border border-primary/20'
  } else if (props.item.isLocked) {
    return 'bg-gray-100 text-gray-500 border border-gray-200'
  }
  return ''
}

const getStepProgress = () => {
  if (props.item.isCompleted) return 100
  if (props.item.stepData?.started_at && !props.item.stepData?.completed_at) return 50
  return 0
}

const getActionButtonText = () => {
  if (props.item.isLocked) return 'Terkunci'
  if (props.item.isCompleted) return 'Lihat Detail'
  if (props.item.stepData?.started_at) return 'Lanjutkan'
  if (props.item.stepData?.can_start) return 'Mulai'
  return 'Lihat Detail'
}

const getActionButtonIcon = () => {
  if (props.item.isLocked) return 'heroicons:lock-closed-20-solid'
  if (props.item.isCompleted) return 'heroicons:eye-20-solid'
  if (props.item.stepData?.started_at) return 'heroicons:play-20-solid'
  if (props.item.stepData?.can_start) return 'heroicons:rocket-launch-20-solid'
  return 'heroicons:arrow-right-20-solid'
}

const getActionButtonClass = () => {
  if (props.item.isLocked) {
    return 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
  } else if (props.item.isCompleted) {
    return 'text-green-600 bg-green-50 border border-green-200 hover:bg-green-100'
  } else if (props.item.stepData?.can_start) {
    return 'text-white bg-primary border border-primary hover:bg-primary/90'
  } else {
    return 'text-primary bg-primary/5 border border-primary/20 hover:bg-primary/10'
  }
}

const handleAction = () => {
  if (props.item.isLocked) return
  
  if (props.item.stepData?.can_start && !props.item.stepData?.started_at) {
    // Start step
    emit('start-step', props.item)
  } else {
    // View details
    emit('learn-more', props.item)
  }
}
</script>