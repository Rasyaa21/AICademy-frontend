<template>
    <div class="p-6 bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl shadow-xl flex flex-row space-x-4 items-center border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div class="p-3 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-2xl w-14 h-14 flex items-center justify-center shadow-inner">
            <Icon :name="icon" class="w-7 h-7 text-primary"/>
        </div>
        <div class="flex flex-col space-y-1 flex-1">
            <h2 class="text-sm font-medium text-gray-500 tracking-wide">{{ title }}</h2>
            <div class="flex items-center gap-2">
                <h1 class="text-3xl font-bold text-black">{{ formattedValue }}</h1>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title: string
    value: number
    icon: string
}

const props = defineProps<Props>()

const formattedValue = computed(() => {
    return props.value.toLocaleString()
})
</script>