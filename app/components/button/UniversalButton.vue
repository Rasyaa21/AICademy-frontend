<template>
    <button 
        :type="type"
        :disabled="disabled || loading"
        :class="buttonClasses"
        v-bind="$attrs"
    >
        <div class="flex gap-2 justify-center items-center">
            <!-- Loading Spinner -->
            <div v-if="loading" class="animate-spin">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
                </svg>
            </div>
            
            <!-- Icon Slot -->
            <slot name="icon" v-if="!loading"></slot>
            
            <!-- Button Text -->
            <span>{{ loading ? loadingText : text }}</span>
        </div>
    </button>
</template>

<script setup lang="ts">
interface Props {
    text: string
    loadingText?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    loadingText: 'Loading...',
    type: 'button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false
})

const buttonClasses = computed(() => {
    const baseClasses = [
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform w-full',
        'hover:shadow-xl hover:-translate-y-0.5',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none'
    ]
    
    // Size classes
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-6 py-4 text-lg'
    }
    
    // Variant classes
    const variantClasses = {
        primary: [
            'bg-gradient-to-r from-primary to-red-600 text-white shadow-lg',
            'hover:from-primary/90 hover:to-red-600/90',
            'focus:ring-primary/50'
        ],
        secondary: [
            'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg',
            'hover:from-gray-700 hover:to-gray-800',
            'focus:ring-gray-500/50'
        ],
        danger: [
            'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg',
            'hover:from-red-600 hover:to-red-700',
            'focus:ring-red-500/50'
        ],
        success: [
            'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg',
            'hover:from-green-600 hover:to-green-700',
            'focus:ring-green-500/50'
        ],
        outline: [
            'border-2 border-primary text-primary bg-transparent',
            'hover:bg-primary hover:text-white',
            'focus:ring-primary/50'
        ]
    }
    
    // Width classes
    const widthClasses = props.fullWidth ? 'w-full' : ''
    
    return [
        ...baseClasses,
        sizeClasses[props.size],
        ...variantClasses[props.variant],
        widthClasses
    ].filter(Boolean).join(' ')
})
</script>
