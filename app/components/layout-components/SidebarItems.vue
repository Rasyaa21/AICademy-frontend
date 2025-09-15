<script setup lang="ts">
const props = defineProps<{
  icon: string
  label: string
  path: string
  isSelected?: boolean 
  collapsed?: boolean
}>()

const route = useRoute()
const isActive = computed(() => route.path === props.path)
</script>

<template>
  <NuxtLink :to="path">
    <li
      class="flex items-center gap-3 px-3 py-3 rounded-xl transition hover:bg-gray-50 my-2"
      :class="[
        isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700',
        collapsed ? 'justify-center' : 'justify-start'
      ]"
      :title="collapsed ? label : undefined"
    >
      <Icon :name="icon" class="w-6 h-6" />

      <!-- Label: disembunyikan saat collapse -->
      <transition name="fade" mode="out-in">
        <span v-if="!collapsed" class="whitespace-nowrap">
          {{ label }}
        </span>
      </transition>
    </li>
  </NuxtLink>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>