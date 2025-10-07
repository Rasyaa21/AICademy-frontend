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
          <h2 class="text-xl font-semibold mb-4">Detail</h2>
          <ul class="space-y-3 text-sm">
            <li><span class="font-medium text-gray-700">Organizer:</span> {{ challenge.organizer }}</li>
            <li><span class="font-medium text-gray-700">Deadline:</span> {{ new Date(challenge.deadline).toLocaleDateString('id-ID') }}</li>
            <li><span class="font-medium text-gray-700">Peserta:</span> {{ challenge.participant }}</li>
            <li><span class="font-medium text-gray-700">Hadiah:</span> {{ challenge.prize || 'Tidak ada' }}</li>
          </ul>
        </div>

        <!-- Right column -->
        <div class="bg-white rounded-lg p-6 shadow-md">
          <h2 class="text-xl font-semibold mb-4">Team</h2>
          <p class="text-gray-500 text-sm">Belum ada data tim.</p>
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
import { ref, onMounted } from "vue";
import type { Challenge } from "~/types/Challenge";

// Define page meta harus berada di dalam script setup
definePageMeta({
  layout: "dashboard-layout-student-dashboard-layout",
});

const route = useRoute();
const router = useRouter();
const challenge = ref<Challenge | null>(null);

// Sinkronkan semua data dummy (SAMAKAN dengan halaman list)
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
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    thumbnail_image: "/assets/images/smk-telkom.jpeg",
    title: "React JS Portfolio",
    description: "Buat portfolio website menggunakan React JS dengan design yang responsive dan modern",
    organizer: "Siti Nurhasanah S.Pd",
    deadline: "2025-08-25T23:59:59Z",
    prize: null,
    participant: 32,
    winner_team_id: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    thumbnail_image: "/assets/images/smk-telkom.jpeg",
    title: "UI Design Challenge",
    description: "Desain interface aplikasi mobile untuk e-commerce dengan fokus pada user experience",
    organizer: "Ahmad Rizki M.Kom",
    deadline: "2025-08-30T23:59:59Z",
    prize: "Sertifikat + Portfolio Review",
    participant: 28,
    winner_team_id: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    thumbnail_image: "/assets/images/smk-telkom.jpeg",
    title: "CTF Web Security",
    description: "Selesaikan tantangan keamanan web dengan berbagai teknik penetration testing",
    organizer: "Agus Dwi Cahaya S.Kom",
    deadline: "2025-09-15T23:59:59Z",
    prize: null,
    participant: 15,
    winner_team_id: null,
  },
];

onMounted(() => {
  const { id } = route.params;
  challenge.value = dummyData.find((c) => c.id === id) || null;
});
</script>
