<!-- components/dashboard-student/Team.vue -->
<template>
    <div class="bg-white rounded-3xl p-6 shadow-xl">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-800">Tim</h3>
            <button class="text-primary hover:text-primary/80 text-sm font-medium">
                Lihat Semua
            </button>
        </div>

        <ul class="space-y-4">
            <li 
                v-for="member in teamMembers" 
                :key="member.id"
                class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
                    <img 
                        :src="member.avatar" 
                        :alt="member.name" 
                        class="w-full h-full object-cover" 
                    />
                </div>
                <div class="min-w-0 flex-1">
                    <p class="text-sm font-semibold text-gray-800 leading-tight">{{ member.name }}</p>
                    <p class="text-xs text-gray-500 leading-tight truncate">
                        {{ member.role }} • {{ member.status }}
                    </p>
                </div>
            </li>
        </ul>

        <!-- Team Stats -->
        <div class="mt-6 pt-4 border-t border-gray-100">
            <div class="flex items-center justify-center flex-col">
                <p class="text-lg font-bold text-gray-800">{{ teamStats.totalMembers }}</p>
                <p class="text-xs text-gray-500">Total Anggota</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface TeamMember {
    id: number
    name: string
    role: string
    status: string
    avatar: string
    isOnline: boolean
}

// Team data
const teamMembers = ref<TeamMember[]>([
    {
        id: 1,
        name: 'Ahmad Rizky',
        role: 'Frontend Developer',
        status: 'Working on React project',
        avatar: 'https://i.pravatar.cc/100?img=1',
        isOnline: true
    },
    {
        id: 2,
        name: 'Siti Nurhaliza',
        role: 'Backend Developer',
        status: 'API Development',
        avatar: 'https://i.pravatar.cc/100?img=2',
        isOnline: true
    },
    {
        id: 3,
        name: 'Budi Santoso',
        role: 'UI/UX Designer',
        status: 'Design Review',
        avatar: 'https://i.pravatar.cc/100?img=3',
        isOnline: false
    },
    {
        id: 4,
        name: 'Dewi Lestari',
        role: 'Project Manager',
        status: 'Sprint Planning',
        avatar: 'https://i.pravatar.cc/100?img=4',
        isOnline: true
    }
])

// Team statistics
const teamStats = computed(() => {
    const totalMembers = teamMembers.value.length
    const activeMembers = teamMembers.value.filter(member => member.isOnline).length
    
    return {
        totalMembers,
        activeMembers
    }
})
</script>