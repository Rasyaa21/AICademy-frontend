<!-- components/dashboard-student/Calendar.vue -->
<template>
    <div class="bg-white rounded-3xl p-6 shadow-xl h-fit">
        <!-- Calendar Header -->
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800">{{ currentMonthYear }}</h3>
            <div class="flex items-center space-x-2">
                <button @click="previousMonth" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-container">
            <!-- Day Headers -->
            <div class="grid grid-cols-7 gap-1 mb-2">
                <div v-for="day in dayNames" :key="day" class="text-center text-sm font-medium text-gray-500 py-2">
                    {{ day }}
                </div>
            </div>

            <!-- Calendar Days -->
            <div class="grid grid-cols-7 gap-1">
                <!-- Previous month days -->
                <div 
                    v-for="day in previousMonthDays" 
                    :key="`prev-${day}`"
                    class="text-center py-2 text-sm text-gray-300"
                >
                    {{ day }}
                </div>

                <!-- Current month days -->
                <div 
                    v-for="day in currentMonthDays" 
                    :key="`current-${day}`"
                    @click="selectDate(day)"
                    :class="[
                        'text-center py-2 text-sm cursor-pointer rounded-lg transition-all duration-200',
                        isToday(day) ? 'bg-red-500 text-white font-bold' : 'text-gray-700 hover:bg-gray-100',
                        selectedDate === day ? 'bg-blue-500 text-white' : ''
                    ]"
                >
                    {{ day }}
                </div>

                <!-- Next month days -->
                <div 
                    v-for="day in nextMonthDays" 
                    :key="`next-${day}`"
                    class="text-center py-2 text-sm text-gray-300"
                >
                    {{ day }}
                </div>
            </div>
        </div>

        <!-- Challenge Deadline Reminder -->
        <div class="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
            <h4 class="text-sm font-semibold text-red-800 mb-2">Challenge Deadline</h4>
            <p class="text-xs text-red-600">API Perpustakaan - 20 Agustus 2025</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Calendar state
const currentDate = ref(new Date())
const selectedDate = ref<number | null>(null)

// Day names (Indonesian)
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

// Month names (Indonesian)
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

// Computed properties
const currentMonthYear = computed(() => {
    const month = monthNames[currentDate.value.getMonth()]
    const year = currentDate.value.getFullYear()
    return `${month} ${year}`
})

const currentMonthDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => i + 1)
})

const previousMonthDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    
    const days = []
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push(daysInPrevMonth - i)
    }
    return days
})

const nextMonthDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const lastDayOfMonth = new Date(year, month + 1, 0).getDay()
    const remainingDays = 6 - lastDayOfMonth
    
    return Array.from({ length: remainingDays }, (_, i) => i + 1)
})

// Methods
const isToday = (day: number) => {
    const today = new Date()
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    
    return today.getFullYear() === year &&
           today.getMonth() === month &&
           today.getDate() === day
}

const selectDate = (day: number) => {
    selectedDate.value = day
}

const previousMonth = () => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() - 1)
    currentDate.value = newDate
}

const nextMonth = () => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + 1)
    currentDate.value = newDate
}
</script>

<style scoped>
.calendar-container {
    @apply text-sm;
}

.calendar-container div:hover {
    @apply transition-all duration-200;
}

.bg-red-500 {
    box-shadow: 0 0 0 2px #ef4444;
}

.bg-blue-500 {
    box-shadow: 0 0 0 2px #3b82f6;
}
</style>