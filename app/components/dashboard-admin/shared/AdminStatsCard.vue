<template>
    <div class="p-6 bg-white rounded-xl border shadow-sm">
        <div class="flex justify-between items-center">
            <div>
                <p class="text-sm text-gray-500">{{ label }}</p>
                <p class="text-2xl font-bold" :class="valueClass">{{ value }}</p>
            </div>
            <div class="flex justify-center items-center w-12 h-12 rounded-xl" :class="iconBgClass">
                <Icon :name="icon" class="w-6 h-6" :class="iconClass" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    label: string
    value: string | number
    icon: string
    color?: 'primary' | 'green' | 'purple' | 'blue' | 'red' | 'yellow'
}

const props = withDefaults(defineProps<Props>(), {
    color: 'primary'
})

const colorClasses = {
    primary: {
        value: 'text-gray-900',
        iconBg: 'bg-primary/10',
        icon: 'text-primary'
    },
    green: {
        value: 'text-green-600',
        iconBg: 'bg-green-100',
        icon: 'text-green-600'
    },
    purple: {
        value: 'text-purple-600',
        iconBg: 'bg-purple-100',
        icon: 'text-purple-600'
    },
    blue: {
        value: 'text-blue-600',
        iconBg: 'bg-blue-100',
        icon: 'text-blue-600'
    },
    red: {
        value: 'text-red-600',
        iconBg: 'bg-red-100',
        icon: 'text-red-600'
    },
    yellow: {
        value: 'text-yellow-600',
        iconBg: 'bg-yellow-100',
        icon: 'text-yellow-600'
    }
}

const valueClass = computed(() => colorClasses[props.color].value)
const iconBgClass = computed(() => colorClasses[props.color].iconBg)
const iconClass = computed(() => colorClasses[props.color].icon)
</script> 