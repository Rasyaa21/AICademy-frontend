<template>
    <RoadmapPopuup 
        v-model:is-open="isRoadmapPopupOpen"
        :selected-item="selectedRoadmapItem"
        @submit-task="handleSubmitTask"
    />
    <section class="overflow-hidden relative py-6 -m-6 min-h-screen bg-gradient-to-b to-red-700 min-w-screen md:py-8 from-primary">
        <!-- Background Elements - Adjusted for mobile -->
        <div class="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl md:w-72 md:h-72 bg-white/10"></div>
        <div class="absolute -right-10 -bottom-20 w-64 h-64 rounded-full blur-3xl md:w-96 md:h-96 bg-pink-400/20"></div>
        
        <div class="hidden absolute top-32 right-32 w-16 h-16 rounded-lg rotate-45 md:block bg-white/5"></div>
        <div class="hidden absolute bottom-32 left-48 w-20 h-20 rounded-full md:block bg-white/5"></div>
        <div class="hidden absolute left-8 top-1/2 w-6 h-6 rounded-full sm:block md:w-8 md:h-8 bg-white/10"></div>
        <div class="hidden absolute right-16 top-1/4 w-8 h-8 rounded-lg rotate-12 sm:block md:w-12 md:h-12 bg-white/5"></div>

        <!-- Floating Icons - Responsive positioning -->
        <div class="absolute left-8 top-16 md:top-24 md:left-32 lg:left-48 animate-float">
            <div class="p-2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 md:p-3">
                <Icon name="heroicons:academic-cap-20-solid" class="w-full h-full text-white opacity-80" />
            </div>
        </div>

        <div class="absolute right-8 top-1/3 md:right-24 lg:right-32 animate-float-delayed">
            <div class="p-2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 md:p-3">
                <Icon name="heroicons:book-open-20-solid" class="w-full h-full text-white opacity-80" />
            </div>
        </div>

        <div class="absolute left-4 bottom-32 md:bottom-40 md:left-16 animate-float-slow">
            <div class="p-2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 md:p-3">
                <Icon name="heroicons:light-bulb-20-solid" class="w-full h-full text-white opacity-80" />
            </div>
        </div>

        <div class="container px-4 py-8 mx-auto md:py-16">
            <!-- Header - Responsive text sizes -->
            <div class="mb-8 text-center md:mb-16">
                <h1 class="px-4 mb-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl md:mb-4">
                    Frontend Development Roadmap
                </h1>
                <p class="px-4 mx-auto max-w-2xl text-sm text-white/80 md:text-base lg:text-lg">
                    Ikuti perjalanan pembelajaran yang terstruktur untuk menjadi Frontend Developer yang kompeten
                </p>
            </div>
            
            <!-- Timeline Container -->
            <RoadmapTimeline 
                :timeline-items="timelineItems"
                @learn-more="handleLearnMore"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import RoadmapTimeline from '~/components/dashboard-student/roadmap/RoadmapTimeline.vue'
import RoadmapPopuup from '~/components/modal/RoadmapPopuup.vue';
import type { RoadmapTimelineItem, Task } from '~/types/RoadmapTimeline';

definePageMeta({
    layout: 'dashboard-layout-student-dashboard-layout'
})

const selectedRoadmapItem = ref<RoadmapTimelineItem | null>(null)
const isRoadmapPopupOpen = ref(false)

const handleLearnMore = (item: RoadmapTimelineItem) => {
    selectedRoadmapItem.value = item
    isRoadmapPopupOpen.value = true
}

const timelineItems = ref<RoadmapTimelineItem[]>([
    {
        title: "HTML & CSS Fundamentals",
        description: "Pelajari dasar-dasar struktur HTML dan styling CSS. Kuasai semantic HTML, CSS Grid, Flexbox, dan prinsip responsive design.",
        duration: "1 Month",
        icon: "heroicons:code-bracket-square-20-solid",
        isActive: true,
        learningObjectives: [
            "Memahami struktur dasar HTML dan semantic elements",
            "Menguasai CSS selectors, properties, dan values", 
            "Mengimplementasikan responsive design dengan CSS Grid dan Flexbox",
            "Membuat layout yang modern dan accessible"
        ],
        tasks: [
            {
                id: "1",
                title: "HTML Structure Assignment",
                description: "Buat struktur HTML untuk website portfolio pribadi",
                type: "assignment",
                deadline: "2024-01-15",
                isCompleted: true,
            },
            {
                id: "2", 
                title: "CSS Styling Project",
                description: "Style website portfolio menggunakan CSS modern",
                type: "project",
                deadline: "2024-01-20",
                isCompleted: false,
            },
            {
                id: "3",
                title: "Responsive Design Quiz",
                description: "Quiz tentang prinsip responsive design",
                type: "quiz",
                deadline: "2024-01-25",
                isCompleted: false,
            }
        ],
        submissions: [
            {
                id: "sub1",
                taskId: "1",
                title: "Portfolio HTML Structure",
                description: "Submitted HTML structure for personal portfolio",
                fileUrl: "portfolio.html",
                submittedAt: "2024-01-14",
                status: "graded",
            }
        ],
        resources: [
            {
                id: "res1",
                title: "HTML & CSS Crash Course",
                type: "video",
                url: "https://youtube.com/watch?v=example",
                duration: "2 hours"
            },
            {
                id: "res2",
                title: "MDN HTML Documentation",
                type: "documentation", 
                url: "https://developer.mozilla.org/en-US/docs/Web/HTML"
            }
        ]
    },
    // Add more timeline items as needed
])

const handleSubmitTask = (task: Task) => {
    console.log('Submit task:', task)
    // Handle submission logic here
}
</script>

<style scoped>
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

@keyframes float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
}

@keyframes float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float-delayed 8s ease-in-out infinite;
}

.animate-float-slow {
    animation: float-slow 10s ease-in-out infinite;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
    .animate-float,
    .animate-float-delayed,
    .animate-float-slow {
        animation: none;
    }
}
</style>