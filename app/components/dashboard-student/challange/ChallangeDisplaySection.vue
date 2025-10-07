<template>
  <div>
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="challenge in paginatedChallenges" :key="challenge.id" class="cursor-pointer" @click="navigateToChallenge(challenge.id)">
        <ChallengeCard :challenge="challenge" :path="`/student/dashboard/challange/${challenge.id}`" />
      </div>
    </div>

    <div v-else class="space-y-4">
      <ChallengeListItem v-for="challenge in paginatedChallenges" :key="challenge.id" :challenge="challenge" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ChallengeCard from "~/components/card/ChallengeCard.vue";
import ChallengeListItem from "~/components/dashboard-student/challange/ChallangeListItem.vue";
import type { Challenge } from "~/types/Challenge";

const router = useRouter();

defineProps<{
  viewMode: "grid" | "list";
  paginatedChallenges: Challenge[];
}>();

const navigateToChallenge = (id: string) => {
  console.log("Navigating to challenge:", id);
  router.push(`/student/dashboard/challange/${id}`);
};
</script>
