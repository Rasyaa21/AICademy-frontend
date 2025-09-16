<template>
    <RoadmapPopuup 
        v-model:is-open="isRoadmapPopupOpen"
        :selected-item="selectedRoadmapItem"
        @submit-task="handleSubmitTask"
    />
    <section class="-m-6 min-w-screen py-6 md:py-8 bg-gradient-to-b from-primary to-red-700 relative overflow-hidden min-h-screen">
        <!-- Background Elements - Adjusted for mobile -->
        <div class="absolute -top-10 -left-10 w-48 h-48 md:w-72 md:h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -right-10 w-64 h-64 md:w-96 md:h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
        
        <div class="hidden md:block absolute top-32 right-32 w-16 h-16 bg-white/5 rounded-lg rotate-45"></div>
        <div class="hidden md:block absolute bottom-32 left-48 w-20 h-20 bg-white/5 rounded-full"></div>
        <div class="hidden sm:block absolute top-1/2 left-8 w-6 h-6 md:w-8 md:h-8 bg-white/10 rounded-full"></div>
        <div class="hidden sm:block absolute top-1/4 right-16 w-8 h-8 md:w-12 md:h-12 bg-white/5 rounded-lg rotate-12"></div>

        <!-- Floating Icons - Responsive positioning -->
        <div class="absolute top-16 md:top-24 left-8 md:left-32 lg:left-48 animate-float">
            <div class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg">
                <Icon name="heroicons:academic-cap-20-solid" class="w-full h-full text-white opacity-80" />
            </div>
        </div>

        <div class="absolute top-1/3 right-8 md:right-24 lg:right-32 animate-float-delayed">
            <div class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg">
                <Icon name="heroicons:book-open-20-solid" class="w-full h-full text-white opacity-80" />
            </div>
        </div>

        <div class="absolute bottom-32 md:bottom-40 left-4 md:left-16 animate-float-slow">
            <div class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg">
                <Icon name="heroicons:light-bulb-20-solid" class="w-full h-full text-white opacity-80" />
            </div>
        </div>

        <div class="container mx-auto px-4 py-8 md:py-16">
            <!-- Header - Responsive text sizes -->
            <div class="text-center mb-8 md:mb-16">
                <h1 class="text-white font-bold text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-4 px-4">
                    Frontend Development Roadmap
                </h1>
                <p class="text-white/80 text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-4">
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