<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import SidebarItems from '../../components/layout-components/SidebarItems.vue'

const isCollapse = ref(false)
const isOpen = ref(false)

const route = useRoute()
watch(() => route.path, () => { isOpen.value = false })

// Stores
const authStore = useAuthStore()
const userStore = useUserStore()

// Fetch student profile after auth is loaded
onMounted(async () => {
  const saved = localStorage.getItem('sidebar:collapsed')
  if (saved !== null) isCollapse.value = saved === '1'

  if (!userStore.user) {
    try { await userStore.fetchUser() } catch {}
  }
})
watch(isCollapse, v => localStorage.setItem('sidebar:collapsed', v ? '1' : '0'))

// UI bindings
const displayName = computed(() =>
  userStore.user?.fullname || authStore.user?.name || 'User'
)
const studentClass = computed(() => userStore.user?.class || '')
const nis = computed(() => userStore.user?.nis || '')
const profilePicture = computed(() => userStore.user?.profile_picture || '')

const initials = computed(() => {
  const name = displayName.value || ''
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('') || 'U'
})
</script>

<template>
  <!-- Sidebar (desktop) -->
  <aside
    class="fixed top-0 left-0 h-screen hidden lg:flex bg-white border-r flex-col transition-all duration-300"
    :class="isCollapse ? 'w-20 p-4 items-center' : 'w-64 p-6'"
  >
    <!-- Header -->
    <div class="flex items-center w-full"
         :class="isCollapse ? 'justify-center' : 'justify-between'">
      <h1
        class="font-bold text-2xl transition-opacity duration-200"
        :class="isCollapse ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'"
      >
        AICademy
      </h1>
      <button
        class="rounded-xl p-2 hover:bg-gray-100"
        :aria-expanded="!isCollapse"
        @click="isCollapse = !isCollapse"
        :title="isCollapse ? 'Expand' : 'Collapse'"
      >
        <Icon name="heroicons:bars-3" class="w-6 h-6" />
      </button>
    </div>

    <h2
      class="text-gray-400 text-start mb-2 mt-4 transition-opacity duration-200"
      :class="isCollapse ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'"
    >
      MENU
    </h2>

    <ul class="space-y-2 w-full">
      <SidebarItems icon="heroicons:home-solid" label="Dashboard" :is-selected="true"
                    path="/student/dashboard" :collapsed="isCollapse" />
      <SidebarItems icon="tabler:clipboard-list" label="Profiling"
                    :is-selected="false" path="/student/dashboard/questionnaires" :collapsed="isCollapse" />
      <SidebarItems icon="streamline-plump:arrow-roadmap-solid" label="Roadmap"
                    :is-selected="false" path="/student/dashboard/roadmap" :collapsed="isCollapse" />
      <SidebarItems icon="heroicons:trophy-solid" label="Challange"
                    :is-selected="false" path="/student/dashboard/challange" :collapsed="isCollapse" />
      <SidebarItems icon="tabler:clipboard-list" label="Peruhsaaan" :is-selected="false" path="/student/dashboard/internships" />
      <SidebarItems icon="heroicons:trophy-solid" label="Profile"
                    :is-selected="false" path="/student/dashboard/Profile" :collapsed="isCollapse" />
    </ul>
  </aside>

  <div :class="isCollapse ? 'lg:ml-20' : 'lg:ml-64'" class="ml-0">
    <header
      class="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur border-b px-6 flex items-center justify-between">
      <div class="flex items-center gap-3 w-full max-w-screen-md">
        <button
          class="lg:hidden inline-flex items-center justify-center"
          @click="isOpen = !isOpen"
          :aria-expanded="isOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          aria-label="Toggle Menu">
          <Icon v-if="!isOpen" name="heroicons:bars-3-20-solid" class="w-8 h-8" />
          <Icon v-else name="heroicons:x-mark-20-solid" class="w-8 h-8" />
        </button>

        <!-- Search -->
        <div class="relative w-full">
          <Icon name="heroicons:magnifying-glass-20-solid"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search…"
            class="border rounded-2xl pl-10 pr-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
          />
        </div>
      </div>

      <div class="flex flex-row items-center space-x-3 ml-3">

        <div class="flex items-center gap-x-3">
          <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shrink-0 flex items-center justify-center bg-gray-100">
            <img
              v-if="profilePicture"
              :src="profilePicture"
              :alt="displayName"
              class="w-full h-full object-cover block"
            />
            <span v-else class="text-sm font-semibold text-gray-600">{{ initials }}</span>
          </div>
          <div class="hidden md:block">
            <div class="text-sm font-medium text-gray-700 hidden lg:flex">
              {{ displayName }}
            </div>
            <div class="text-xs text-gray-500 hidden lg:flex">
              <span v-if="nis">NIS: {{ nis }}</span>
              <span v-if="nis && studentClass" class="mx-1">·</span>
              <span v-if="studentClass">{{ studentClass }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isOpen" id="mobile-menu"
             class="absolute left-0 right-0 top-full z-20 md:hidden bg-white backdrop-blur border-t">
          <div class="px-4 py-3">
            <div class="flex flex-col">
              <SidebarItems icon="heroicons:home-solid" label="Dashboard" path="/student/dashboard" />
              <SidebarItems icon="tabler:clipboard-list" label="Profiling" path="/student/dashboard/questionnaires" />
              <SidebarItems icon="streamline-plump:arrow-roadmap-solid" label="Roadmap" path="/student/dashboard/roadmap"/>
              <SidebarItems icon="heroicons:trophy-solid" label="Challange" path="/student/dashboard/challange" />
              <SidebarItems icon="tabler:clipboard-list" label="Peruhsaaan" path="/student/dashboard/internships" />
              <SidebarItems icon="heroicons:trophy-solid" label="Profile" path="/student/dashboard/Profile"/>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <main class="p-6">
      <slot />
    </main>
  </div>
</template>