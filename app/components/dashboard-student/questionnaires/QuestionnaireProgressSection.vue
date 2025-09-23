<template>
    <div class="p-6 bg-white rounded-xl border shadow-sm">
        <!-- Step Indicators with Full Line -->
        <div class="flex relative justify-between items-center mb-6">
            <!-- Background Line -->
            <div class="absolute right-0 left-0 top-1/2 h-1 bg-gray-200 rounded-full -translate-y-1/2"></div>
            <!-- Progress Line -->
            <div 
                class="absolute left-0 top-1/2 h-1 rounded-full transition-all duration-500 ease-out -translate-y-1/2 bg-primary"
                :style="{ width: `${stepProgress}%` }"
            ></div>
            
            <!-- Step Circles -->
            <div 
                v-for="step in totalSteps" 
                :key="step"
                class="relative z-10"
            >
                <div 
                    class="flex justify-center items-center w-10 h-10 text-sm font-bold rounded-full border-2 transition-all duration-300"
                    :class="getStepClass(step)"
                >
                    <Icon 
                        v-if="step < currentStep" 
                        name="heroicons:check-20-solid" 
                        class="w-5 h-5 text-white" 
                    />
                    <span v-else>{{ step }}</span>
                </div>
                <!-- Step Label -->
                <div class="absolute -bottom-8 left-1/2 text-xs font-medium text-gray-600 whitespace-nowrap transform -translate-x-1/2">
                    Step {{ step }}
                </div>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-12 space-y-2">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Progress Keseluruhan</span>
                <span class="font-medium text-primary">{{ Math.round(overallProgress) }}% selesai</span>
            </div>
            <div class="w-full h-3 bg-gray-200 rounded-full">
                <div 
                    class="h-3 bg-gradient-to-r rounded-full shadow-sm transition-all duration-500 ease-out from-primary to-primary/80"
                    :style="{ width: `${overallProgress}%` }"
                ></div>
            </div>
            <div class="text-xs text-center text-gray-500">
                {{ answeredQuestions }} dari {{ totalQuestions }} pertanyaan dijawab
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    currentStep: number
    totalSteps: number
    stepProgress: number
    overallProgress: number
    answeredQuestions: number
    totalQuestions: number
}

const props = defineProps<Props>()

const getStepClass = (step: number): string => {
    if (step < props.currentStep) {
        return 'bg-primary border-primary text-white shadow-lg'
    } else if (step === props.currentStep) {
        return 'bg-primary border-primary text-white ring-4 ring-primary/20 shadow-lg'
    } else {
        return 'bg-white border-gray-300 text-gray-600 shadow-sm'
    }
}
</script> 