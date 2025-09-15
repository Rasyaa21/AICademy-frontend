<!-- components/dashboard-student/MyProgress.vue -->
<template>
    <div class="flex flex-col space-y-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="font-bold text-xl">Progress Belajar Saya</h1>
                <p class="text-sm text-gray-500 mt-1">
                    {{ courses.length }} pembelajaran aktif 
                </p>
            </div>
            <button class="text-primary hover:text-primary/80 text-sm font-medium">
                Lihat Semua
            </button>
        </div>
        
        <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProgressStudentCard 
                v-for="course in courses"
                :key="course.id"
                :title="course.title" 
                :actual-value="course.actualValue" 
                :max-value="course.maxValue" 
                :span-list="course.technologies" 
                :icon="course.icon"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProgressStudentCard from './ProgressStudentCard.vue'

interface Course {
    id: number
    title: string
    actualValue: number
    maxValue: number
    technologies: string[]
    icon: string
}

// Course progress data
const courses = ref<Course[]>([
    {
        id: 1,
        title: 'Frontend Development',
        actualValue: 3,
        maxValue: 40,
        technologies: ['HTML', 'CSS', 'JavaScript'],
        icon: 'heroicons:book-open-16-solid'
    },
    {
        id: 2,
        title: 'Backend Development',
        actualValue: 15,
        maxValue: 30,
        technologies: ['Node.js', 'Express', 'MongoDB'],
        icon: 'heroicons:server-16-solid'
    },
    {
        id: 3,
        title: 'React Development',
        actualValue: 8,
        maxValue: 25,
        technologies: ['Components', 'Hooks', 'Router'],
        icon: 'heroicons:code-bracket-16-solid'
    }
])
</script>