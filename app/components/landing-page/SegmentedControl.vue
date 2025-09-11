<script setup lang="ts">
/** 
 * Props:
 * - options: daftar label untuk setiap segment
 * - modelValue: nilai yang sedang aktif (untuk v-model)
 */
const props = withDefaults(defineProps<{
  options: string[]
  modelValue?: string
}>(), {
  modelValue: undefined
})

const emit = defineEmits<{ 
  (e: 'update:modelValue', v: string): void 
}>()

// Computed untuk two-way binding - perbaikan type handling
const active = computed({
  get: () => props.modelValue || props.options[0] || '', // Gunakan || untuk fallback
  set: (v: string) => emit('update:modelValue', v)
})

// Mencari index dari opsi yang aktif (untuk positioning slider)
const activeIndex = computed(() => {
  const activeValue = active.value
  const index = props.options.findIndex(o => o === activeValue)
  return index >= 0 ? index : 0 // Fallback ke 0 jika tidak ditemukan
})

// Keyboard navigation dengan arrow keys
function onKey(e: KeyboardEvent) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
  e.preventDefault()
  
  const direction = e.key === 'ArrowRight' ? 1 : -1
  const currentIndex = activeIndex.value
  
  // Hitung index berikutnya dengan wrapping
  const nextIndex = (currentIndex + direction + props.options.length) % props.options.length
  active.value = props.options[nextIndex] || ''
}
</script>

<template>
  <div
    class="relative inline-flex w-full max-w-4xl bg-gray-100 rounded-full p-1 select-none shadow-sm"
    role="tablist"
    tabindex="0"
    @keydown="onKey"
  >
    <!-- Segment buttons -->
    <button
      v-for="(option, index) in props.options"
      :key="option"
      role="tab"
      :aria-selected="active === option"
      :tabindex="active === option ? 0 : -1"
      @click="active = option"
      class="flex-1 text-center font-semibold px-4 py-3 rounded-full 
             focus:outline-none transition-all duration-300 ease-out"
      :class="[
        active === option 
          ? 'text-white bg-primary shadow-lg' 
          : 'text-gray-700 hover:text-gray-900 bg-transparent'
      ]"
    >
      {{ option }}
    </button>
  </div>
</template>