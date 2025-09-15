<template>
    <div class="bg-white rounded-2xl p-6 shadow-xl border">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-4">
            <div v-for="activity in activities" :key="activity.id" class="flex items-start gap-3">
                <div 
                    :class="[
                        'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium',
                        activity.type === 'challenge' ? 'bg-primary' : 
                        activity.type === 'user' ? 'bg-green-500' : 'bg-yellow-500'
                    ]"
                >
                    <Icon 
                        :name="activity.type === 'challenge' ? 'heroicons:puzzle-piece-20-solid' : 
                               activity.type === 'user' ? 'heroicons:user-20-solid' : 'heroicons:trophy-20-solid'"
                        class="w-4 h-4"
                    />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-900">{{ activity.message }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatTime(activity.timestamp) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const activities = ref([
    {
        id: 1,
        type: 'challenge',
        message: 'New challenge "API Perpustakaan" has been created',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
        id: 2,
        type: 'user',
        message: '5 new users registered',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
        id: 3,
        type: 'winner',
        message: 'Winner announced for "React JS Portfolio"',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
        id: 4,
        type: 'challenge',
        message: 'Challenge "UI Design" deadline is approaching',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
])

const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) {
        return `${minutes} minutes ago`
    } else if (hours < 24) {
        return `${hours} hours ago`
    } else {
        return `${days} days ago`
    }
}
</script>