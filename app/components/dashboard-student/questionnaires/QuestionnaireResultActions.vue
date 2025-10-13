<template>
  <div class="p-6 bg-white rounded-xl border shadow-sm">
    <h3 class="mb-4 text-lg font-semibold text-gray-900">Langkah Selanjutnya</h3>
    
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <!-- Retake Questionnaire -->
      <button
        @click="$emit('retake')"
        class="flex flex-col items-center gap-3 p-4 text-center border border-gray-200 rounded-lg transition-colors hover:bg-gray-50"
      >
        <Icon name="heroicons:arrow-path-20-solid" class="w-6 h-6 text-gray-600" />
        <div>
          <div class="text-sm font-medium text-gray-900">Ulangi Kuesioner</div>
          <div class="text-xs text-gray-500">Isi ulang dengan jawaban baru</div>
        </div>
      </button>
      
      <!-- Download Result -->
      <button
        @click="$emit('download')"
        class="flex flex-col items-center gap-3 p-4 text-center border border-gray-200 rounded-lg transition-colors hover:bg-gray-50"
      >
        <Icon name="heroicons:arrow-down-tray-20-solid" class="w-6 h-6 text-gray-600" />
        <div>
          <div class="text-sm font-medium text-gray-900">Unduh Hasil</div>
          <div class="text-xs text-gray-500">Simpan hasil dalam format JSON</div>
        </div>
      </button>
      
      <!-- Dashboard -->
      <button
        @click="goToDashboard"
        class="flex flex-col items-center gap-3 p-4 text-center border border-gray-200 rounded-lg transition-colors hover:bg-gray-50"
      >
        <Icon name="heroicons:home-20-solid" class="w-6 h-6 text-gray-600" />
        <div>
          <div class="text-sm font-medium text-gray-900">Dashboard</div>
          <div class="text-xs text-gray-500">Kembali ke halaman utama</div>
        </div>
      </button>
      
      <!-- Share Result -->
      <button
        @click="shareResult"
        class="flex flex-col items-center gap-3 p-4 text-center border border-gray-200 rounded-lg transition-colors hover:bg-gray-50"
      >
        <Icon name="heroicons:share-20-solid" class="w-6 h-6 text-gray-600" />
        <div>
          <div class="text-sm font-medium text-gray-900">Bagikan</div>
          <div class="text-xs text-gray-500">Bagikan hasil ke media sosial</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  retake: []
  download: []
}>()

const goToDashboard = () => {
  navigateTo('/student/dashboard')
}

const shareResult = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Hasil Kuesioner Peminatan IT',
      text: 'Saya telah menyelesaikan kuesioner peminatan IT dan mendapatkan rekomendasi jalur karir!',
      url: window.location.href
    })
  } else {
    // Fallback untuk browser yang tidak mendukung Web Share API
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      alert('Link hasil telah disalin ke clipboard!')
    })
  }
}
</script>