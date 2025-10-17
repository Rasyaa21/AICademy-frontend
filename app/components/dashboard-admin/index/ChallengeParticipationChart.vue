<template>
  <div class="h-64">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
interface Challenge {
  id: string
  title: string
  max_participants: number
  current_participants: number
  is_active: boolean
}

interface Props {
  challenges: Challenge[]
}

const props = defineProps<Props>()
const chartCanvas = ref<HTMLCanvasElement>()

onMounted(async () => {
  if (!chartCanvas.value) return

  // Dynamically import Chart.js
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // Prepare data for chart
  const labels = props.challenges.slice(0, 5).map(c => c.title.substring(0, 20) + '...')
  const participationData = props.challenges.slice(0, 5).map(c => 
    Math.round((c.current_participants / c.max_participants) * 100)
  )

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Participation Rate (%)',
        data: participationData,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%'
            }
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            font: {
              size: 10
            }
          }
        }
      }
    }
  })
})
</script>