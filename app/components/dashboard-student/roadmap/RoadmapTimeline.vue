<template>
    <div class="relative max-w-6xl mx-auto px-4 md:px-0">
        <!-- Main Timeline Line -->
        <div class="absolute left-4 md:left-1/2 md:transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 via-primary to-primary/60 z-0"></div>
        
        <TimelineCard 
            v-for="(item, index) in timelineItems" 
            :key="index"
            :item="item"
            :index="index"
            :step-number="index + 1"
            :is-last="index === timelineItems.length - 1"
            @learn-more="handleLearnMore"
            @start-step="handleStartStep"
        />
    </div>
</template>

<script setup lang="ts">
import type { RoadmapTimelineItem } from '~/types/RoadmapTimeline';
import TimelineCard from '~/components/card/TimelineCard.vue';

const props = defineProps<{
    timelineItems: RoadmapTimelineItem[]
}>()

const emit = defineEmits<{
    'learn-more': [item: RoadmapTimelineItem]
    'start-step': [item: RoadmapTimelineItem]
}>()

const handleLearnMore = (item: RoadmapTimelineItem) => {
    emit('learn-more', item)
}

const handleStartStep = (item: RoadmapTimelineItem) => {
    emit('start-step', item)
}
</script>