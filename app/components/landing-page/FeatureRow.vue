<script setup lang="ts">
const props = withDefaults(defineProps<{
    title: string
    description?: string
    iconSrc?: string
    align?: 'left' | 'right'
    offset?: string
    cardClass?: string
    iconClass?: string
}>(), {
    align: 'right',
    offset: '',      
    cardClass: '',
    iconClass: '',
})
</script>

<template>
    <div
        class="w-full flex items-center justify-center"
        :class="[
        props.align === 'left'  ? 'lg:items-start lg:justify-start' : 'lg:items-end lg:justify-end',
        props.offset            
        ]"
    >
        <div class="flex flex-row items-center gap-4">
        <div
            v-if="props.iconSrc && props.align === 'right'"
            :class="['w-[75px] h-[75px] backdrop-blur-sm rounded-full p-3 shadow-lg bg-white/60 lg:flex hidden', props.iconClass]"
        >
            <img :src="props.iconSrc" alt="Icon" class="w-full h-full object-contain" />
        </div>

        <div class="p-4 rounded-xl bg-white/60">
            <div :class="['flex flex-col px-6 py-4 rounded-xl bg-white items-start text-start max-w-md', props.cardClass]">
            <h3 class="text-2xl font-bold">{{ props.title }}</h3>
            <p v-if="props.description" class="text-lg">{{ props.description }}</p>
            <slot />
            </div>
        </div>

        <div
            v-if="props.iconSrc && props.align === 'left'"
            :class="['w-[75px] h-[75px] backdrop-blur-sm rounded-full p-3 shadow-lg bg-white/60 lg:flex hidden', props.iconClass]"
        >
            <img :src="props.iconSrc" alt="Icon" class="w-full h-full object-contain" />
        </div>
        </div>
    </div>
</template>