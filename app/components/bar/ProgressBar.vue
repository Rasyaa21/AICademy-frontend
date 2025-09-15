<!-- components/bar/ProgressBar.vue -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  maxValue: number
  actualValue: number
  height?: string
  showLabel?: boolean
  striped?: boolean
  animated?: boolean
}>(), {
  height: '8px',
  showLabel: true,
  striped: false,
  animated: false
})

const percentage = computed(() => {
  const pct = (props.actualValue / props.maxValue) * 100
  if (Number.isNaN(pct) || pct < 0) return 0
  if (pct > 100) return 100
  // Ensure minimum visible progress for very small percentages
  return pct < 1 && pct > 0 ? 1 : Math.round(pct * 100) / 100
})

const barClasses = computed(() => {
  const baseClasses = [
    "h-full rounded-full transition-[width] duration-500 ease-out will-change-[width]",
    "bg-gradient-to-r from-primary to-primary/80"
  ]
  
  if (props.striped) {
    baseClasses.push("bg-[length:24px_24px] [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.25)_0_10px,transparent_10px_20px)]")
  }
  
  if (props.animated) {
    baseClasses.push("animate-[bar-move_2s_linear_infinite]")
  }
  
  return baseClasses.join(" ")
})

// Add minimum width for visibility
const progressWidth = computed(() => {
  // Ensure at least 2% width is visible if there's any progress
  if (percentage.value > 0 && percentage.value < 2) {
    return '2%'
  }
  return `${percentage.value}%`
})
</script>

<template>
  <div
    class="w-full rounded-full bg-gray-200/70 overflow-hidden"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="percentage"
    :aria-label="`Progress ${percentage}%`"
    :style="{ height }"
  >
    <div
        :class="[
            'h-full rounded-full transition-[width] duration-500 ease-out will-change-[width]',
            'bg-primary' 
        ]"
        :style="{ 
            width: progressWidth, 
            height,
            minWidth: percentage > 0 ? '4px' : '0px' 
        }"
    />
  </div>

  <div v-if="showLabel" class="mt-2 flex items-center justify-between text-xs text-gray-600">
    <div class="flex items-center gap-1">
      <Icon name="heroicons:book-open-16-solid" class="w-4 h-4 text-gray-500" />
      <span>{{ actualValue }}/{{ maxValue }}</span>
      <span>Lesson</span>
    </div>
    <span class="font-semibold text-gray-800">{{ percentage.toFixed(1) }}%</span>
  </div>
</template>

<style scoped>
@keyframes bar-move {
  from { background-position: 0 0; }
  to   { background-position: 24px 0; }
}
</style>