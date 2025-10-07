<template>
  <div class="container mx-auto p-4">
    <!-- Loading state -->
    <div v-if="!challenge" class="flex justify-center items-center h-64">
      <ProgressBar />
    </div>

    <!-- Challenge content -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg p-6 shadow-md">
        <h1 class="text-2xl font-bold mb-2">{{ challenge.title }}</h1>
        <p class="text-gray-600">{{ challenge.description }}</p>
      </div>

      <!-- Challenge details -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Left column -->
        <div class="bg-white rounded-lg p-6 shadow-md">
          <h2 class="text-xl font-semibold mb-4">Challenge Details</h2>
          <div class="space-y-4">
            <div>
              <h3 class="font-medium text-gray-700">Organizer</h3>
              <p>{{ challenge.organizer }}</p>
            </div>
            <div>
              <h3 class="font-medium text-gray-700">Deadline</h3>
              <p>{{ new Date(challenge.deadline).toLocaleDateString() }}</p>
            </div>
            <div>
              <h3 class="font-medium text-gray-700">Participants</h3>
              <p>{{ challenge.participant }}</p>
            </div>
            <div>
              <h3 class="font-medium text-gray-700">Prize</h3>
              <p>{{ challenge.prize || "No prize" }}</p>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="bg-white rounded-lg p-6 shadow-md">
          <h2 class="text-xl font-semibold mb-4">Team Information</h2>
          <p class="text-gray-600">No team assigned yet</p>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-4">
        <UniversalButton variant="primary" @click="handleSubmission"> Submit Solution </UniversalButton>
        <UniversalButton variant="secondary" @click="goBackToChallenges"> Back to Challenges </UniversalButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define page meta harus berada di dalam script setup
definePageMeta({
  layout: "dashboard-layout-student-dashboard-layout",
});

const route = useRoute();
console.log("Route params:", route.params); // Debug log

import { ref, onMounted } from "vue";
import type { Challenge } from "~/types/Challenge";

const router = useRouter();
const challenge = ref<Challenge | null>(null);

// Handle navigation back to challenges list
const goBackToChallenges = () => {
  router.push("/student/dashboard/challange");
};

// Handle challenge submission
const handleSubmission = () => {
  console.log("Submitting challenge:", challenge.value?.id);
};

// Dummy data
const dummyData: Challenge[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    thumbnail_image: "/assets/images/smk-telkom.jpeg",
    title: "API Perpustakaan",
    description: "Buatlah REST API untuk sistem perpustakaan dengan skema database yang telah ditentukan",
    organizer: "Agus Dwi Cahaya S.Kom",
    deadline: "2025-08-20T23:59:59Z",
    prize: "Rp 2.000.000 + Certificate",
    participant: 47,
    winner_team_id: null,
  },
  // ...tambahkan data dummy lainnya dari challange.vue
];

onMounted(async () => {
  try {
    const { id } = route.params;
    // Cari challenge berdasarkan ID dari data dummy
    const foundChallenge = dummyData.find((c) => c.id === id);

    if (foundChallenge) {
      challenge.value = foundChallenge;
    } else {
      console.error("Challenge not found");
      router.push("/student/dashboard/challange");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
</script>
