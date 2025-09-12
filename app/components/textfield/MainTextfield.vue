<script setup lang="ts">

    const props = withDefaults(defineProps<{
        modelValue?: string,
        id?: string,
        name?:string,
        label?:string,
        type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
        placeholder?: string
        required?:boolean
        disabled?:boolean
        error?:string
        isPassword?: boolean
        isConfirmationPassword?:boolean
    }> (), {
        type: 'text',
        required: false,
        disabled: false, 
        isConfirmationPassword: false,
        isPassword: false
    })

     const emit = defineEmits<{
        (e: 'update:modelValue', v: string):void
        (e: 'focus', ev: FocusEvent): void
        (e: 'blur', ev: FocusEvent): void
        (e: 'enter'): void
    }>()

    const value = computed({
        get: () => props.modelValue ?? "",
        set: (v: string) => emit('update:modelValue', v)
    })

    const isObscure = ref(props.isPassword)
    const inputType = computed(() => {
        if (props.isPassword) {
            return isObscure.value ? 'password' : 'text'
        }
        return props.type
    })

    function toogleObscure() {
        if (props.isPassword) {
            isObscure.value = !isObscure.value
        }
    }

    const inputId = computed(() => props.id || props.name || `tf-${Math.random().toString(36).slice(2)}`)
</script>

<template>
    <div class="space-y-2">
        <label v-if="label" :for="inputId" class="text-sm font-semibold text-gray-700 block">{{ label }}</label>
            <div class="relative w-full">
                <div v-if="$slots.icon" class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                    <slot name="icon" />
                </div>

                <input 
                    :type="inputType" 
                    :id="inputId"
                    :name="name"
                    v-model="value"
                    :placeholder="placeholder"
                    :required="required"
                    :disabled="disabled"
                    :aria-invalid="!!error"
                    class="border border-gray-200 rounded-xl w-full py-4 px-4 pl-10 text-gray-700 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none" 
                    @focus="emit('focus', $event)"
                    @blur="emit('blur', $event)"
                    @keyup.enter="emit('enter')"
                />
                <button
                    v-if="props.isPassword"
                    type="button"
                    class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                    @click="toogleObscure"
                    >
                    <svg v-if="isObscure" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/>
                        <circle cx="12" cy="12" r="3" stroke-width="2"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-width="2" d="M3 3l18 18M9.9 9.9A3 3 0 0012 15a3 3 0 002.1-.9M6.7 6.7C4.3 8.3 3 12 3 12s3.5 7 10 7a10.9 10.9 0 006.3-2.1M14.1 7.5A10.3 10.3 0 0012 5c-6.5 0-10 7-10 7a16.3 16.3 0 004.2 5.2"/>
                    </svg>
                </button>
                </div>
        <p v-if="error" class="text-xs text-primary mt-1">{{ error }}</p>
    </div>
</template>