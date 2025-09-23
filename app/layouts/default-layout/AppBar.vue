<script setup lang="ts">
const isOpen = ref(false)
const links = [
  { label: 'Home', to: '/' },
  { label: 'Challange', to: '/Challange' },
  { label: 'Project', to: '/Project' },
]

const route = useRoute()
const token = useCookie<string | null>('token')
const role = useCookie<string | null>('role') // Tambahkan role cookie

const isLoggedIn = computed(() => !!token.value)

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
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') isOpen.value = false }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-primary/90 backdrop-blur shadow-sm w-full">
    <nav class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
      <NuxtLink to="/" class="text-2xl font-bold text-white w-1/3">AICademy</NuxtLink>

      <ul class="hidden md:flex items-center gap-6 text-white font-medium w-1/3 justify-center">
        <li v-for="l in links" :key="l.to">
          <NuxtLink :to="l.to" class="hover:text-white/80">{{ l.label }}</NuxtLink>
        </li>
      </ul>

      <div v-if="isLoggedIn" class="hidden md:flex items-center gap-3 w-1/3 justify-end">
        <NuxtLink :to="getDashboardUrl()" class="px-4 py-2 rounded-lg border border-white text-white font-semibold hover:bg-white/10">
          Dashboard
        </NuxtLink>
      </div>

      <div v-else class="hidden md:flex items-center gap-3 w-1/3 justify-end">
        <NuxtLink to="/login" class="px-4 py-2 rounded-lg border border-white text-white font-semibold hover:bg-white/10">
          Log In
        </NuxtLink>
        <NuxtLink to="/register" class="px-4 py-2 rounded-lg bg-white text-primary font-semibold hover:bg-white/90">
          Register
        </NuxtLink>
      </div>

      <!-- Mobile: Hamburger -->
      <button
        class="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
        @click="isOpen = !isOpen"
        :aria-expanded="isOpen"
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
      >
        <!-- icon -->
        <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <div v-show="isOpen" id="mobile-menu" class="md:hidden bg-primary/95 backdrop-blur border-t border-white/10">
        <div class="px-4 py-3 space-y-2">
          <div class="flex flex-col gap-2">
            <NuxtLink
              v-for="l in links"
              :key="l.to"
              :to="l.to"
              class="block px-3 py-2 rounded-lg text-white/95 font-medium hover:bg-white/10"
            >
              {{ l.label }}
            </NuxtLink>
          </div>
          <div v-if="isLoggedIn" class="mt-3 grid grid-cols-1 gap-2">
            <NuxtLink :to="getDashboardUrl()" class="px-3 py-2 rounded-lg border border-white text-white text-center font-semibold hover:bg-white/10">
              Dashboard
            </NuxtLink>
          </div>
          <div v-else class="mt-3 grid grid-cols-2 gap-2">
            <NuxtLink to="/login" class="px-3 py-2 rounded-lg border border-white text-white text-center font-semibold hover:bg-white/10">
              Log In
            </NuxtLink>
            <NuxtLink to="/register" class="px-3 py-2 rounded-lg bg-white text-primary text-center font-semibold hover:bg-white/90">
              Register
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>