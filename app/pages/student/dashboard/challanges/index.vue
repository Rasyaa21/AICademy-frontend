<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 justify-between lg:flex-row lg:items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Challenge</h1>
        <p class="mt-1 text-gray-600">Ikuti berbagai challenge untuk meningkatkan skill programming Anda</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="showCreateTeamModal = true"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Buat Tim
        </button>
      </div>
    </div>

    <!-- My Teams Section -->
    <div v-if="myTeams.length > 0" class="bg-white p-6 rounded-lg border">
      <h2 class="text-xl font-semibold mb-4">Tim Saya</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="team in myTeams"
          :key="team.id"
          class="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ team.team_name }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ team.about }}</p>
            </div>
          </div>
          <div class="mb-3">
            <p class="text-sm text-gray-500 mb-2">Anggota ({{ team.member_count }}):</p>
            <div class="space-y-1">
              <div
                v-for="member in team.members"
                :key="member.student_profile_id"
                class="flex items-center gap-2 text-sm"
              >
                <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                <span class="font-medium">{{ member.full_name }}</span>
                <span class="text-gray-500">({{ member.nis }})</span>
                <span
                  v-if="member.member_role === 'Leader'"
                  class="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full"
                >
                  Leader
                </span>
              </div>
            </div>
          </div>
          <div class="text-xs text-gray-500">
            Dibuat: {{ formatDate(team.created_at) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
          <div class="h-32 bg-gray-200 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
    
     <!-- Submission Saya -->
    <div v-if="mySubmissions.length > 0" class="bg-white p-6 rounded-lg border">
      <h2 class="text-xl font-semibold mb-4">Submission Saya</h2>
      <div class="space-y-4">
        <div
          v-for="submission in mySubmissions"
          :key="submission.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-semibold">{{ submission.title }}</h3>
              <p class="text-sm text-gray-600">Challenge: {{ submission.challenge_name }}</p>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-blue-600">{{ submission.points }} pts</div>
              <div class="text-xs text-gray-500">{{ formatDate(submission.submitted_at) }}</div>
            </div>
          </div>
          <div class="flex gap-4 text-sm">
            <a
              v-if="submission.github_url"
              :href="submission.github_url"
              target="_blank"
              class="text-blue-600 hover:text-blue-800"
            >
              GitHub Repository
            </a>
            <a
              v-if="submission.live_url"
              :href="submission.live_url"
              target="_blank"
              class="text-green-600 hover:text-green-800"
            >
              Live Demo
            </a>
          </div>
          <p class="text-sm text-gray-600 mt-2">{{ submission.description }}</p>
        </div>
      </div>
    </div>

    <!-- Challenges Grid -->
    <div v-else-if="filteredChallenges.length > 0" class="p-6">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="challenge in paginatedChallenges" :key="challenge.id">
          <ChallengeCard :challenge="challenge" />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex gap-2 items-center">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span class="px-4 py-2 text-sm text-gray-600">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-12 text-center">
      <div class="mb-4 text-gray-400">
        <Icon name="heroicons:magnifying-glass-20-solid" class="mx-auto w-16 h-16" />
      </div>
      <h3 class="mb-2 text-lg font-semibold text-gray-900">Tidak ada challenge ditemukan</h3>
      <p class="text-gray-500">
        {{ searchQuery ? 'Coba ubah kata kunci pencarian' : 'Belum ada challenge tersedia saat ini' }}
      </p>
    </div>

   

    <!-- Create Team Modal -->
    <CreateTeamModal
      :isOpen="showCreateTeamModal"
      @update:isOpen="showCreateTeamModal = $event"
      @team-created="onTeamCreated"
    />

    <!-- Register Challenge Modal -->
    <div
      v-if="showRegisterModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showRegisterModal = false"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Daftar Challenge</h3>
        <div v-if="selectedChallenge" class="mb-4">
          <h4 class="font-medium">{{ selectedChallenge.title }}</h4>
          <p class="text-sm text-gray-600">{{ selectedChallenge.description }}</p>
        </div>
        <form @submit.prevent="registerChallenge">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Tim</label>
              <select
                v-model="registerForm.team_id"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih tim...</option>
                <option v-for="team in myTeams" :key="team.id" :value="team.id">
                  {{ team.team_name }} 
                </option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="showRegisterModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="registering"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ registering ? 'Mendaftar...' : 'Daftar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Submit Challenge Modal -->
    <div
      v-if="showSubmitModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showSubmitModal = false"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h3 class="text-lg font-semibold mb-4">Submit Solusi</h3>
        <div v-if="selectedChallenge" class="mb-4">
          <h4 class="font-medium">{{ selectedChallenge.title }}</h4>
          <p class="text-sm text-gray-600">{{ selectedChallenge.description }}</p>
        </div>
        <form @submit.prevent="submitChallenge">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Submission</label>
              <input
                v-model="submitForm.title"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan judul submission"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">GitHub Repository URL</label>
              <input
                v-model="submitForm.github_url"
                type="url"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://github.com/username/repository"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Live Demo URL (Opsional)</label>
              <input
                v-model="submitForm.live_url"
                type="url"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://your-demo.com"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                v-model="submitForm.description"
                rows="4"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ceritakan tentang solusi Anda..."
              ></textarea>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              @click="showSubmitModal = false"
            >
              Batal
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              :disabled="submitting"
            >
              {{ submitting ? 'Mengirim...' : 'Submit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Alert Modal -->
  <AlertModal
    :isOpen="alertOpen"
    :type="alertType"
    :title="alertTitle"
    :message="alertMessage"
    :okText="alertOkText"
    @update:isOpen="alertOpen = $event"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import ChallengeCard from "~/components/card/ChallengeCard.vue";
import CreateTeamModal from "~/components/modal/student/dashboard/CreateTeamModal.vue";
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue';
import type { Challenge, Team } from "~/types/Challenge";

interface Submission {
  id: string;
  challenge_id: string;
  challenge_name: string;
  title: string;
  github_url: string;
  live_url: string;
  description: string;
  points: number;
  submitted_at: string;
}

definePageMeta({
  layout: "dashboard-layout-student-dashboard-layout",
});

// --- state lama yang tetap dipakai di template ---
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 12;

// Alert Modal state
type AlertKind = 'success' | 'error' | 'warning' | 'info'
const alertOpen = ref(false)
const alertType = ref<AlertKind>('info')
const alertTitle = ref('')
const alertMessage = ref('')
const alertOkText = ref('OK')
const showAlert = (opts: { type?: AlertKind; title?: string; message: string; okText?: string }) => {
  alertType.value = opts.type ?? 'info'
  alertTitle.value = opts.title ?? (opts.type === 'success' ? 'Berhasil' : opts.type === 'error' ? 'Terjadi Kesalahan' : 'Informasi')
  alertMessage.value = opts.message
  alertOkText.value = opts.okText ?? 'OK'
  alertOpen.value = true
}

// Modals
const showCreateTeamModal = ref(false);
const showRegisterModal = ref(false);
const showSubmitModal = ref(false);
const selectedChallenge = ref<Challenge | null>(null);

// Form states
const registering = ref(false);
const submitting = ref(false);

// Forms
const registerForm = ref({ team_id: "", challenge_id: "" });
const submitForm = ref({ challenge_id: "", title: "", github_url: "", live_url: "", description: "" });

// Runtime config untuk $fetch
const config = useRuntimeConfig();
const fetchOpts = {
  baseURL: config.public.apiBase as string,
  credentials: "include" as const,
  headers: process.server ? useRequestHeaders(["cookie"]) : undefined,
};

// ====== useAsyncData REPLACEMENT untuk 3 fetch ======
const {
  data: challengesRes,
  pending: challengesPending,
  error: challengesError,
  refresh: refreshChallenges,
} = await useAsyncData(
  "student-challenges",
  () => $fetch("/student/challenges", fetchOpts),
);

const {
  data: teamsRes,
  pending: teamsPending,
  error: teamsError,
  refresh: refreshTeams,
} = await useAsyncData(
  "student-challenge-teams",
  () => $fetch("/student/challenges/teams", fetchOpts),
);

const {
  data: submissionsRes,
  pending: submissionsPending,
  error: submissionsError,
  refresh: refreshSubmissions,
} = await useAsyncData(
  "student-challenge-submissions",
  () => $fetch("/student/challenges/submissions", fetchOpts),
);

// Assign ke bentuk array yang dipakai template-mu sekarang
const challenges = computed<Challenge[]>(() => (challengesRes.value as any)?.data?.data ?? []);
const myTeams = computed<Team[]>(() => (teamsRes.value as any)?.data ?? []);
const mySubmissions = computed<Submission[]>(() => (submissionsRes.value as any)?.data?.data ?? []);

// Loading gabungan (ganti loading ref sebelumnya)
const loading = computed(() => challengesPending.value || teamsPending.value || submissionsPending.value);

// API calls (POST) tetap pakai $api biar konsisten dengan interceptor/cookies-mu
const { $api } = useNuxtApp();

const onTeamCreated = async () => {
  await refreshTeams();
};

const openRegisterModal = (challenge: Challenge) => {
  selectedChallenge.value = challenge;
  registerForm.value.challenge_id = challenge.id;
  showRegisterModal.value = true;
};

const registerChallenge = async () => {
  try {
    registering.value = true;
    const response = await $api(`/student/challenges/${registerForm.value.challenge_id}/register`, {
      method: "POST",
      body: { team_id: registerForm.value.team_id },
      credentials: 'include'
    }) as any;

    if (response?.success) {
      showRegisterModal.value = false;
      registerForm.value = { team_id: "", challenge_id: "" };
      await Promise.all([refreshChallenges(), refreshSubmissions(), refreshTeams()]);
      showAlert({ type: 'success', message: 'Berhasil mendaftar challenge!' });
    } else {
      throw new Error(response?.message || "Gagal mendaftar challenge");
    }
  } catch (error) {
    console.error("Error registering challenge:", error);
    showAlert({ type: 'error', message: 'Gagal mendaftar challenge. Silakan coba lagi.' });
  } finally {
    registering.value = false;
  }
};

const openSubmitModal = (challenge: Challenge) => {
  selectedChallenge.value = challenge;
  submitForm.value.challenge_id = challenge.id;
  showSubmitModal.value = true;
};

const submitChallenge = async () => {
  try {
    submitting.value = true;
    const response = await $api(`/student/challenges/${submitForm.value.challenge_id}/submit`, {
      method: "POST",
      body: {
        title: submitForm.value.title,
        github_url: submitForm.value.github_url,
        live_url: submitForm.value.live_url,
        description: submitForm.value.description,
      },
      credentials: 'include'
    }) as any;

    if (response?.success) {
      showSubmitModal.value = false;
      submitForm.value = { challenge_id: "", title: "", github_url: "", live_url: "", description: "" };
      await refreshSubmissions();
      showAlert({ type: 'success', message: 'Submission berhasil dikirim!' });
    } else {
      throw new Error(response?.message || "Gagal mengirim submission");
    }
  } catch (error) {
    console.error("Error submitting challenge:", error);
    showAlert({ type: 'error', message: 'Gagal mengirim submission. Silakan coba lagi.' });
  } finally {
    submitting.value = false;
  }
};

// Helpers
const isRegistered = (challengeId: string) => {
  return mySubmissions.value.some(
    (submission) => submission.challenge_name && submission.challenge_id === challengeId
  );
};

const hasSubmitted = (challengeId: string) => {
  return mySubmissions.value.some((submission) => submission.challenge_id === challengeId);
};

// Computed properties
const filteredChallenges = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return challenges.value;
  return challenges.value.filter((c: Challenge) =>
    c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );
});

const paginatedChallenges = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredChallenges.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredChallenges.value.length / itemsPerPage)
);

// Utilities
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const isActive = (deadline: string) => new Date(deadline) > new Date();

// Watchers
watch([searchQuery], () => {
  currentPage.value = 1;
});
</script>
