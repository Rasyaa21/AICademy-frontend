<template>
  <div class="min-h-screen bg-gradient-to-br">
    <div class="container mx-auto p-4 space-y-6">
      <!-- Back Navigation -->
      <div class="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <NuxtLink 
          to="/student/dashboard/challanges" 
          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
        >
          <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4" />
          <span class="font-medium">Kembali ke Challenges</span>
        </NuxtLink>
        <Icon name="heroicons:chevron-right-20-solid" class="w-4 h-4" />
        <span class="text-gray-800 font-medium">Detail Challenge</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div class="bg-white rounded-2xl p-8 shadow-lg border animate-pulse">
          <div class="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Challenge Content -->
      <div v-else-if="challenge" class="space-y-8">
        <!-- Hero Header -->
        <div class="relative bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-6">
              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-4 mb-4">
                  <h1 class="text-4xl font-bold">{{ challenge.title }}</h1>
                  <span 
                    class="px-4 py-2 rounded-full text-sm font-semibold border"
                    :class="isActive
                      ? 'bg-green-500/20 text-green-100 border-green-300/30'
                      : 'bg-red-500/20 text-red-100 border-red-300/30'"
                  >
                    <Icon 
                      :name="isActive ? 'heroicons:bolt-20-solid' : 'heroicons:stop-circle-20-solid'"
                      class="w-4 h-4 inline mr-2" 
                    />
                    {{ isActive ? 'Challenge Aktif' : 'Challenge Berakhir' }}
                  </span>
                </div>
                <p class="text-red-100 text-lg leading-relaxed max-w-3xl">{{ challenge.description }}</p>
              </div>
              <div class="text-right">
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div class="text-3xl font-bold mb-1">{{ remainingSlots }}</div>
                  <div class="text-red-100 text-sm">Slot Tersisa</div>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="heroicons:calendar-days-20-solid" class="w-5 h-5 text-red-200" />
                  <span class="text-red-100 text-sm font-medium">Deadline</span>
                </div>
                <div class="text-white font-semibold">{{ formatDate(challenge.deadline, true) }}</div>
              </div>
              
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="heroicons:user-group-20-solid" class="w-5 h-5 text-red-200" />
                  <span class="text-red-100 text-sm font-medium">Peserta</span>
                </div>
                <div class="text-white font-semibold">{{ challenge.current_participants }}/{{ challenge.max_participants }}</div>
              </div>

              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="heroicons:document-check-20-solid" class="w-5 h-5 text-red-200" />
                  <span class="text-red-100 text-sm font-medium">Submissions</span>
                </div>
                <div class="text-white font-semibold">{{ challenge.submissions?.length || 0 }}</div>
              </div>

              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="heroicons:clock-20-solid" class="w-5 h-5 text-red-200" />
                  <span class="text-red-100 text-sm font-medium">Dibuat</span>
                </div>
                <div class="text-white font-semibold">{{ formatDate(challenge.created_at, true) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Left Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Tim Terdaftar -->
            <div v-if="registeredTeam" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-white/20 rounded-lg">
                    <Icon name="heroicons:check-circle-20-solid" class="w-6 h-6" />
                  </div>
                  <div>
                    <h2 class="text-xl font-bold">Tim Terdaftar</h2>
                    <p class="text-green-100">Anda sudah terdaftar dalam challenge ini</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <h3 class="text-xl font-bold text-green-900 mb-3">{{ registeredTeam.team_name }}</h3>
                  <p class="text-green-700 mb-4" v-if="registeredTeam.about">{{ registeredTeam.about }}</p>
                  <div class="flex items-center gap-4 text-sm text-green-900">
                    <span class="px-3 py-1 rounded-full bg-green-100 border border-green-200">
                      Anggota: {{ registeredTeam.member_count ?? registeredTeam.members?.length ?? 0 }}
                    </span>
                    <span v-if="isActive" class="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200">
                      Siap berkompetisi!
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submissions Terkini -->
            <div v-if="challenge.submissions && challenge.submissions.length > 0" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-white/20 rounded-lg">
                    <Icon name="heroicons:trophy-20-solid" class="w-6 h-6" />
                  </div>
                  <div>
                    <h2 class="text-xl font-bold">Submissions Terbaik</h2>
                    <p class="text-red-100">{{ challenge.submissions.length }} submission telah dikirim</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <div class="space-y-4">
                  <div
                    v-for="(submission, index) in challenge.submissions.slice(0, 5)"
                    :key="submission.id"
                    class="group relative bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div class="flex items-start justify-between">
                      <div>
                        <div class="flex items-center gap-2 mb-1">
                          <span class="inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200">{{ index + 1 }}</span>
                          <h4 class="font-semibold text-gray-900">{{ submission.title || 'Untitled Submission' }}</h4>
                        </div>
                        <p class="text-sm text-gray-600">
                          Tim: {{ submission.team?.team_name || 'Tidak diketahui' }}
                          <span v-if="submission.points" class="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">{{ submission.points }} pts</span>
                        </p>
                        <p v-if="submission.description" class="text-sm text-gray-700 mt-2 line-clamp-2">{{ submission.description }}</p>
                        <div class="flex gap-4 text-sm mt-3">
                          <a v-if="submission.github_url" :href="submission.github_url" target="_blank" class="text-red-600 hover:text-red-800 flex items-center gap-1">
                            <Icon name="mdi:github" class="w-4 h-4" /> Repo
                          </a>
                          <a v-if="submission.live_url" :href="submission.live_url" target="_blank" class="text-green-600 hover:text-green-800 flex items-center gap-1">
                            <Icon name="mdi:open-in-new" class="w-4 h-4" /> Live
                          </a>
                        </div>
                      </div>
                      <div class="text-right text-sm text-gray-500">
                        <div>{{ formatDate(submission.submitted_at || submission.created_at) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State untuk Submissions -->
            <div v-else class="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:document-plus-20-solid" class="w-8 h-8 text-gray-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum Ada Submissions</h3>
              <p class="text-gray-500">Jadilah yang pertama mengirim karya untuk challenge ini!</p>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="space-y-6">
            <!-- Action Card -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
              <div class="p-6 border-b border-gray-100">
                <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Icon name="heroicons:bolt-20-solid" class="w-5 h-5 text-yellow-500" />
                  Quick Actions
                </h3>
              </div>
              
              <div class="p-6 space-y-4">
                <!-- Register Button -->
                <button
                  v-if="!registeredTeam && isActive && myTeams.length > 0"
                  @click="showRegisterModal = true"
                  class="w-full bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Icon name="heroicons:plus-circle-20-solid" class="w-5 h-5" />
                  Daftar Challenge
                </button>

                <!-- Submit Button -->
                <button
                  v-if="registeredTeam && isActive"
                  @click="showSubmitModal = true"
                  class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Icon name="heroicons:paper-airplane-20-solid" class="w-5 h-5" />
                  Submit Karya
                </button>

                <!-- No Team Message -->
                <div v-if="myTeams.length === 0" class="text-center space-y-4">
                  <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-yellow-600 mx-auto mb-2" />
                    <p class="text-sm text-yellow-700">Anda belum memiliki tim.</p>
                  </div>
                  <button
                    type="button"
                    @click="showCreateTeamModal = true"
                    class="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                  >
                    <Icon name="heroicons:user-group-20-solid" class="w-5 h-5" />
                    Buat Tim
                  </button>
                </div>

                <!-- Challenge Ended -->
                <div v-if="!isActive" class="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                  <Icon name="heroicons:clock-20-solid" class="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p class="text-red-700 font-semibold">Challenge Telah Berakhir</p>
                  <p class="text-red-600 text-sm mt-1">Tidak dapat mendaftar atau submit</p>
                </div>
              </div>
            </div>

            <!-- Tim Saya -->
            <div v-if="myTeams.length > 0" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="p-6 border-b border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Icon name="heroicons:user-group-20-solid" class="w-5 h-5 text-red-500" />
                  Tim Saya
                </h3>
              </div>
              
              <div class="p-6 space-y-3">
                <div
                  v-for="team in myTeams"
                  :key="team.id"
                  class="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-semibold text-gray-900">{{ team.team_name }}</div>
                      <div class="text-xs text-gray-600">Anggota: {{ team.member_count ?? team.members?.length ?? 0 }}</div>
                    </div>
                    <span class="text-xs text-gray-500 group-hover:text-gray-700">Detail</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Challenge Stats -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="p-6 border-b border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Icon name="heroicons:chart-bar-20-solid" class="w-5 h-5 text-green-500" />
                  Challenge Info
                </h3>
              </div>
              
              <div class="p-6 space-y-4">
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-600 flex items-center gap-2">
                    <Icon :name="isActive ? 'heroicons:bolt-20-solid' : 'heroicons:stop-circle-20-solid'" class="w-4 h-4" />
                    Status
                  </span>
                  <span class="font-semibold" :class="isActive ? 'text-green-700' : 'text-red-700'">
                    {{ isActive ? 'Aktif' : 'Berakhir' }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-600 flex items-center gap-2">
                    <Icon name="heroicons:calendar-days-20-solid" class="w-4 h-4" />
                    Deadline
                  </span>
                  <span class="font-semibold text-gray-900">{{ formatDate(challenge.deadline) }}</span>
                </div>
                
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-600 flex items-center gap-2">
                    <Icon name="heroicons:user-group-20-solid" class="w-4 h-4" />
                    Kuota
                  </span>
                  <span class="font-semibold text-gray-900">{{ challenge.current_participants }}/{{ challenge.max_participants }} (Sisa: {{ remainingSlots }})</span>
                </div>
                
                <div class="flex justify-between items-center py-2 border-t pt-4">
                  <span class="text-gray-600 flex items-center gap-2">
                    <Icon name="heroicons:clock-20-solid" class="w-4 h-4" />
                    Dibuat
                  </span>
                  <span class="font-semibold text-gray-900">{{ formatDate(challenge.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-20">
        <div class="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="heroicons:exclamation-triangle-20-solid" class="w-12 h-12 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Challenge Tidak Ditemukan</h3>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">Challenge yang Anda cari tidak ada atau telah dihapus dari sistem.</p>
        <NuxtLink
          to="/student/dashboard/challanges"
          class="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Icon name="heroicons:arrow-left-20-solid" class="w-5 h-5" />
          Kembali ke Challenges
        </NuxtLink>
      </div>

      <!-- Modals (Register & Submit) -->
      <!-- Register Modal -->
      <div
        v-if="showRegisterModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showRegisterModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">Daftar Challenge</h3>
              <button @click="showRegisterModal = false" class="text-gray-400 hover:text-gray-600">
                <Icon name="heroicons:x-mark-20-solid" class="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <form @submit.prevent="registerChallenge" class="p-6">
            <div v-if="challenge" class="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 class="font-semibold text-red-900">{{ challenge.title }}</h4>
              <p class="text-sm text-red-700 mt-1">{{ challenge.description }}</p>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Pilih Tim</label>
                <select
                  v-model="registerForm.team_id"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                >
                  <option value="">Pilih tim...</option>
                  <option v-for="team in myTeams" :key="team.id" :value="team.id">
                    {{ team.team_name }} ({{ team.member_count ?? team.members?.length ?? 0 }} anggota)
                  </option>
                </select>
              </div>
            </div>
            
            <div class="flex gap-3 mt-8">
              <button
                type="button"
                @click="showRegisterModal = false"
                class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="registering"
                class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                <Icon v-if="registering" name="heroicons:arrow-path-20-solid" class="w-4 h-4 animate-spin" />
                {{ registering ? 'Mendaftar...' : 'Daftar Sekarang' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Submit Modal -->
      <div
        v-if="showSubmitModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showSubmitModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">Submit Karya</h3>
              <button @click="showSubmitModal = false" class="text-gray-400 hover:text-gray-600">
                <Icon name="heroicons:x-mark-20-solid" class="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <form @submit.prevent="submitChallenge" class="p-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Judul Submission</label>
                <input
                  v-model="submitForm.title"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Masukkan judul submission"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">GitHub Repository URL</label>
                <input
                  v-model="submitForm.github_url"
                  type="url"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="https://github.com/username/repository"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Live Demo URL (Opsional)</label>
                <input
                  v-model="submitForm.live_url"
                  type="url"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="https://your-demo.com"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  v-model="submitForm.description"
                  rows="4"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Ceritakan tentang Karya Anda..."
                ></textarea>
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button
                type="button"
                @click="showSubmitModal = false"
                class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                <Icon v-if="submitting" name="heroicons:arrow-path-20-solid" class="w-4 h-4 animate-spin" />
                {{ submitting ? 'Mengirim...' : 'Submit' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Create Team Modal -->
      <CreateTeamModal
        :isOpen="showCreateTeamModal"
        @update:isOpen="showCreateTeamModal = $event"
        @team-created="onTeamCreated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Challenge, Team } from "~/types/Challenge";
import CreateTeamModal from "~/components/modal/student/dashboard/CreateTeamModal.vue"

definePageMeta({
  layout: "dashboard-layout-student-dashboard-layout",
});

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();

// State
const loading = ref(true);
const challenge = ref<Challenge | null>(null);
const myTeams = ref<Team[]>([]);
const registeredTeam = ref<Team | null>(null);

// Modals
const showRegisterModal = ref(false);
const showSubmitModal = ref(false);
const showCreateTeamModal = ref(false);

// Form states
const registering = ref(false);
const submitting = ref(false);

// Forms
const registerForm = ref({
  team_id: ''
});

const submitForm = ref({
  title: '',
  github_url: '',
  live_url: '',
  description: ''
});

// Computed
const isActive = computed(() => {
  if (!challenge.value) return false;
  return new Date(challenge.value.deadline) > new Date();
});

const remainingSlots = computed(() => {
  if (!challenge.value) return 0
  return Math.max((challenge.value.max_participants || 0) - (challenge.value.current_participants || 0), 0)
})

// API calls
const fetchChallenge = async (id: string) => {
  try {
    const response = await $api(`/student/challenges/${id}`, {
      method: 'GET'
    }) as any;
    if (response.success) {
      challenge.value = response.data;
      
      // Try resolve registered team (fallback based on submissions)
      if (challenge.value?.submissions && myTeams.value?.length) {
        const userSubmission = challenge.value.submissions.find((submission: any) => 
          myTeams.value.some(team => team.id === submission.team_id || team.id === submission.team?.id)
        );
        if (userSubmission) {
          registeredTeam.value = userSubmission.team || myTeams.value.find(t => t.id === userSubmission.team_id) || null;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching challenge:', error);
  }
};

const fetchMyTeams = async () => {
  try {
    const response = await $api('/student/challenges/teams', {
      method: 'GET'
    }) as any;
    if (response.success) {
      myTeams.value = response.data || [];
    }
  } catch (error) {
    console.error('Error fetching teams:', error);
  }
};

const onTeamCreated = async () => {
  await fetchMyTeams();
};

// Actions
const registerChallenge = async () => {
  try {
    registering.value = true;
    
    const response = await $api(`/student/challenges/register`, {
      method: 'POST',
      credentials: 'include',
      body: {
        challenge_id: challenge.value?.id
      }
    }) as any;

    if (response.success) {
      showRegisterModal.value = false;

      // Set registered team
      registeredTeam.value = myTeams.value.find(t => t.id === registerForm.value.team_id) || null;

      // Clear form
      registerForm.value = { team_id: '' };

      // Refresh challenge data
      await fetchChallenge(challenge.value!.id);
      alert('Berhasil mendaftar challenge!');
    }
  } catch (error) {
    console.error('Error registering challenge:', error);
    alert('Gagal mendaftar challenge. Silakan coba lagi.');
  } finally {
    registering.value = false;
  }
};

const submitChallenge = async () => {
  try {
    submitting.value = true;
    
    const response = await $api(`/student/challenges/${challenge.value!.id}/submit`, {
      method: 'POST',
      body: {
        title: submitForm.value.title,
        github_url: submitForm.value.github_url,
        live_url: submitForm.value.live_url,
        description: submitForm.value.description
      }
    }) as any;

    if (response.success) {
      showSubmitModal.value = false;
      submitForm.value = {
        title: '',
        github_url: '',
        live_url: '',
        description: ''
      };
      await fetchChallenge(challenge.value!.id);
      alert('Submission berhasil dikirim!');
    }
  } catch (error) {
    console.error('Error submitting challenge:', error);
    alert('Gagal mengirim submission. Silakan coba lagi.');
  } finally {
    submitting.value = false;
  }
};

// Utilities
const formatDate = (dateString: string, shortFormat = false) => {
  const options = shortFormat 
    ? { month: 'short', day: 'numeric' }
    : {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      } as const;
  
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Lifecycle
onMounted(async () => {
  try {
    const challengeId = route.params.id as string;
    await Promise.all([
      fetchMyTeams(),
      fetchChallenge(challengeId)
    ]);
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    loading.value = false;
  }
});
</script>
