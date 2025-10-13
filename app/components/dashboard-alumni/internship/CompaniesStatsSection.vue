<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">Total Posisi</p>
          <p class="text-2xl font-bold text-gray-900">{{ internshipStats.total }}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Icon name="heroicons:briefcase-20-solid" class="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">Perusahaan</p>
          <p class="text-2xl font-bold text-green-600">{{ internshipStats.companies }}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Icon name="heroicons:building-office-20-solid" class="w-6 h-6 text-green-600" />
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">Aktif</p>
          <p class="text-2xl font-bold text-yellow-600">{{ internshipStats.active }}</p>
        </div>
        <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
          <Icon name="heroicons:clock-20-solid" class="w-6 h-6 text-yellow-600" />
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">PKL</p>
          <p class="text-2xl font-bold text-purple-600">{{ internshipStats.pkl }}</p>
        </div>
        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Icon name="heroicons:academic-cap-20-solid" class="w-6 h-6 text-purple-600" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface InternshipStats {
  total: number
  companies: number
  active: number
  pkl: number
}

defineProps<{
  internshipStats: InternshipStats
}>()
</script>
