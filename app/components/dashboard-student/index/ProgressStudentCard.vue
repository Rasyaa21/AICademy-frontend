<!-- CourseCard.vue -->
<template>
  <NuxtLink
    to="/course/basic-frontend" 
    class="group block bg-white p-6 rounded-2xl shadow-xl transition-all duration-300
           ring-1 ring-gray-100 "
  >
    <div class="flex items-start gap-4 mb-4">
      <div
        class="p-3 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20
               flex items-center justify-center shadow-inner transition"
      >
        <Icon :name="icon" class="w-7 h-7 text-primary" />
      </div>

      <div class="flex-1">
        <h2 class="text-lg font-bold text-gray-900 leading-snug">
          {{ title }}
        </h2>
        <div class="mt-1 flex flex-row gap-x-2 flex-wrap">
            <div class="mt-1 flex items-center gap-2 text-xs text-gray-500 flex-row" v-for="item in spanList">
                <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{{ item }}</span>
            </div>
        </div>
       
      </div>
    </div>

    <ProgressBar
        :max-value="maxValue"
        :actual-value="actualValue"
        height="10px"
        show-label
        striped
        animated
    />

    <div class="mt-5 flex items-center gap-1 text-primary font-semibold">
      <span>Lanjutkan Belajar</span>
      <Icon
        name="heroicons:arrow-right-circle-16-solid"
        class="w-4 h-4 translate-x-0 group-hover:translate-x-0.5 transition"
      />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import ProgressBar from '../../bar/ProgressBar.vue';

const valueProgress = 18 
const props = defineProps<{
    actualValue:number
    maxValue:number
    spanList:string[]
    title:string
    icon:string
}>()
</script>