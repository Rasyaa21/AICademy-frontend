<script setup lang="ts">
const year = new Date().getFullYear()

const socialLinks = [
  { href: "https://www.instagram.com/stematelpwt/", icon: "mdi:instagram" },
  { href: "https://www.youtube.com/@stematelpwt", icon: "mdi:youtube" },
  { href: "https://www.tiktok.com/@stematelpwt", icon: "ic:baseline-tiktok" }
]

const aboutLinks = [
  { label: "Features", to: "/features" },
  { label: "Challenge", to: "/challenge" },
  { label: "Project of The Month", to: "/projects" },
]

const startLinks = [
  { label: "Login", to: "/login" },
  { label: "Register (Alumni)", to: "/register" },
]
</script>

<template>
  <footer class="bg-gradient-to-b from-gray-900 to-black text-gray-300 relative">
    <div class="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">
      <!-- Brand & Contact -->
      <div class="space-y-6">
        <h2 class="text-2xl font-extrabold text-white">AICademy</h2>
        <p class="flex items-start gap-3">
          <span class="text-primary">📍</span>
          Jl. DI Panjaitan No.128, Kec. Purwokerto Sel.,<br />
          Kabupaten Banyumas, Jawa Tengah 53141
        </p>
        <p class="flex items-center gap-3">
          <span class="text-primary">✉️</span>
          office@smktelkom-pwt.sch.id
        </p>
        <p class="flex items-center gap-3">
          <span class="text-primary">☎️</span>
          (0281) 632138
        </p>

        <!-- Sosial Media -->
        <div class="flex space-x-4">
          <a
            v-for="s in socialLinks"
            :key="s.icon"
            :href="s.href"
            target="_blank"
            rel="noopener"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary hover:text-white transition"
          >
            <Icon :name="s.icon" class="w-5 h-5" />
          </a>
        </div>
      </div>

      <!-- About -->
      <div>
        <h3 class="text-lg font-semibold text-white mb-4">About</h3>
        <ul class="space-y-2">
          <li v-for="l in aboutLinks" :key="l.label">
            <NuxtLink
              :to="l.to"
              class="hover:text-primary transition"
            >{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Get Started -->
      <div>
        <h3 class="text-lg font-semibold text-white mb-4">Get Started</h3>
        <ul class="space-y-2">
          <li v-for="l in startLinks" :key="l.label">
            <NuxtLink
              :to="l.to"
              class="hover:text-primary transition"
            >{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/10 mt-10">
      <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
        <p>© {{ year }} SMK Telkom Purwokerto. All rights reserved.</p>
        <p class="mt-2 sm:mt-0">Built with ❤️ by AICademy Team</p>
      </div>
    </div>
  </footer>
</template>