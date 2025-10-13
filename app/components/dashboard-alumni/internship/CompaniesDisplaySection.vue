<template>
  <div>
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <InternshipCard
        v-for="internship in internships"
        :key="internship.id"
        :internship="internship"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import InternshipCard from '~/components/card/InternshipCard.vue'

interface CompanyProfile {
  id: string
  company_name: string
  company_location: string
  description: string
}

interface Internship {
  id: string
  company_profile_id: string
  title: string
  description: string
  type: string
  posted_at: string
  deadline: string
  company_profile: CompanyProfile
}

defineProps<{
  viewMode: "grid" | "list"
  internships: Internship[]
}>()
</script>
