<script setup lang="ts">
const isOpen = ref(false)
const links = [
  { label: 'Home', to: '/' },
  { label: 'Challange', to: '/Challange' },
  { label: 'Project', to: '/Project' },
]

const route = useRoute()

// Client-only state untuk menghindari hydration mismatch
const isClient = ref(false)
const token = useCookie<string | null>('token', {
  default: () => null,
  httpOnly: false,
  secure: false,
  sameSite: 'lax'
})
const role = useCookie<string | null>('role', {
  default: () => null,
  httpOnly: false,
  secure: false,
  sameSite: 'lax'
})

const isLoggedIn = computed(() => isClient.value && !!token.value)

// Fungsi untuk mendapatkan dashboard URL berdasarkan role
const getDashboardUrl = () => {
  if (!role.value) return '/dashboard'
  
  switch (role.value) {
    case 'admin': return '/admin/dashboard'
    case 'teacher': return '/teacher/dashboard'
    case 'alumni': return '/alumni/dashboard'
    case 'company': return '/company/dashboard'
    case 'student':
    default: return '/student/dashboard'
  }
}

watch(() => route.fullPath, () => (isOpen.value = false))

onMounted(() => {
  // Set client flag setelah component ter-mount
  isClient.value = true
  
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') isOpen.value = false }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})
</script>

<template>
  <header class="sticky top-0 z-50 w-full shadow-sm backdrop-blur bg-primary/90">
    <nav class="flex justify-between items-center px-4 py-3 mx-auto max-w-7xl sm:px-6">
      <NuxtLink to="/" class="w-1/3 text-2xl font-bold text-white">AICademy</NuxtLink>

      <ul class="hidden gap-6 justify-center items-center w-1/3 font-medium text-white md:flex">
        <li v-for="l in links" :key="l.to">
          <NuxtLink :to="l.to" class="hover:text-white/80">{{ l.label }}</NuxtLink>
        </li>
      </ul>

      <!-- Desktop Auth Buttons -->
      <div class="hidden gap-3 justify-end items-center w-1/3 md:flex">
        <template v-if="isClient">
          <template v-if="isLoggedIn">
            <NuxtLink :to="getDashboardUrl()" class="px-4 py-2 font-semibold text-white rounded-lg border border-white hover:bg-white/10">
              Dashboard
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="px-4 py-2 font-semibold text-white rounded-lg border border-white hover:bg-white/10">
              Log In
            </NuxtLink>
            <NuxtLink to="/register" class="px-4 py-2 font-semibold bg-white rounded-lg text-primary hover:bg-white/90">
              Register
            </NuxtLink>
          </template>
        </template>
        <!-- Loading state saat hydration -->
        <div v-else class="w-20 h-10 rounded-lg animate-pulse bg-white/10"></div>
      </div>

      <!-- Mobile: Hamburger -->
      <button
        class="inline-flex justify-center items-center p-2 text-white rounded-lg md:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
        @click="isOpen = !isOpen"
        :aria-expanded="isOpen"
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
      >
        <!-- icon -->
        <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </nav>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-show="isOpen" id="mobile-menu" class="border-t backdrop-blur md:hidden bg-primary/95 border-white/10">
        <div class="px-4 py-3 space-y-2">
          <div class="flex flex-col gap-2">
            <NuxtLink
              v-for="l in links"
              :key="l.to"
              :to="l.to"
              class="block px-3 py-2 font-medium rounded-lg text-white/95 hover:bg-white/10"
            >
              {{ l.label }}
            </NuxtLink>
          </div>
          
          <!-- Mobile Auth Buttons -->
          <template v-if="isClient">
            <div v-if="isLoggedIn" class="grid grid-cols-1 gap-2 mt-3">
              <NuxtLink :to="getDashboardUrl()" class="px-3 py-2 font-semibold text-center text-white rounded-lg border border-white hover:bg-white/10">
                Dashboard
              </NuxtLink>
            </div>
            <div v-else class="grid grid-cols-2 gap-2 mt-3">
              <NuxtLink to="/login" class="px-3 py-2 font-semibold text-center text-white rounded-lg border border-white hover:bg-white/10">
                Log In
              </NuxtLink>
              <NuxtLink to="/register" class="px-3 py-2 font-semibold text-center bg-white rounded-lg text-primary hover:bg-white/90">
                Register
              </NuxtLink>
            </div>
          </template>
          <!-- Loading state mobile -->
          <div v-else class="grid grid-cols-2 gap-2 mt-3">
            <div class="h-10 rounded-lg animate-pulse bg-white/10"></div>
            <div class="h-10 rounded-lg animate-pulse bg-white/10"></div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>