<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import SidebarItems from '../../components/layout-components/SidebarItems.vue'

const isCollapse = ref(false)
const isOpen = ref(false)

const route = useRoute()
watch(() => route.path, () => { isOpen.value = false })

onMounted(() => {
  const saved = localStorage.getItem('sidebar:collapsed')
  if (saved !== null) isCollapse.value = saved === '1'
})
watch(isCollapse, v => localStorage.setItem('sidebar:collapsed', v ? '1' : '0'))
</script>

<template>
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
      <SidebarItems icon="heroicons:home-solid" label="Home" :is-selected="true"
                    path="/admin/dashboard" :collapsed="isCollapse" />
      <SidebarItems icon="heroicons:users-16-solid" label="Data Siswa"
                    :is-selected="false" path="/admin/dashboard/students" :collapsed="isCollapse" />
      <SidebarItems icon="heroicons:users-16-solid" label="Data Guru"
                    :is-selected="false" path="/admin/dashboard/teachers" :collapsed="isCollapse" />
      <SidebarItems icon="heroicons:users-16-solid" label="Data Perusahaan"
                    :is-selected="false" path="/admin/dashboard/companies" :collapsed="isCollapse" />
      <SidebarItems icon="heroicons:trophy-solid" label="Challange"
                    :is-selected="false" path="/admin/dashboard/challange" :collapsed="isCollapse" />
      <SidebarItems icon="tabler:clipboard-list" label="Profiling Kuisioner"
                    :is-selected="false" path="/admin/dashboard/questionnaires" :collapsed="isCollapse" />
    </ul>
  </aside>

  <!-- Content wrapper: margin mengikuti lebar sidebar -->
  <div :class="isCollapse ? 'lg:ml-20' : 'lg:ml-64'" class="ml-0">
    <!-- Header -->
    <header
      class="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur border-b px-6 flex items-center justify-between">
      <div class="flex items-center gap-3 w-full max-w-screen-md">
        <!-- Hamburger (mobile only) -->
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
        <button class="relative flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <Icon name="heroicons:bell-20-solid" class="w-6 h-6" />
        </button>

        <div class="flex items-center gap-x-3">
            <div class="hidden md:block">
                <div class="text-sm font-medium text-gray-700 hidden lg:flex">John Doe</div>
                <div class="text-xs text-gray-500 hidden lg:flex">Superadmin</div>
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
            <div class="flex flex-col gap-2">
              <SidebarItems icon="heroicons:home-solid" label="Home" path="/admin/dashboard" />
              <SidebarItems icon="heroicons:home-solid" label="Profiling" :is-selected="false" path="/admin/dashboard" />
              <SidebarItems icon="heroicons:users-16-solid" label="Data Guru" :is-selected="false" path="/admin/dashboard/teachers"/>
              <SidebarItems icon="heroicons:users-16-solid" label="Data Perusahaan" :is-selected="false" path="/admin/dashboard/companies"/>
              <SidebarItems icon="heroicons:trophy-solid" label="Challange" :is-selected="false" path="/admin/dashboard/challange" />
              <SidebarItems icon="tabler:clipboard-list" label="Profiling Kuisioner" :is-selected="false" path="/admin/dashboard/questionnaires" />
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