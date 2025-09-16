<template>
    <div class="relative max-w-6xl mx-auto px-4 md:px-0">
        <TimelineCard 
            v-for="(item, index) in timelineItems" 
            :key="index"
            :item="item"
            :index="index"
            :step-number="index + 1"
            @learn-more="handleLearnMore"
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
}>()

const handleLearnMore = (item: RoadmapTimelineItem) => {
    emit('learn-more', item)
}
</script>