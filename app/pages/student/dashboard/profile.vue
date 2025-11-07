<template>
  <!-- Modal Peringatan -->
  <AlertModal
    v-model:is-open="alertModal.isOpen"
    :type="alertModal.type"
    :title="alertModal.title"
    :message="alertModal.message"
    @ok="alertModal.isOpen = false"
  />

  <!-- Modal Konfirmasi -->
  <ConfirmModal
    v-model:is-open="confirmModal.isOpen"
    :type="confirmModal.type"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :confirm-text="confirmModal.confirmText"
    @confirm="confirmModal.onConfirm"
    @cancel="confirmModal.isOpen = false"
  />

  <!-- Modal Buat Proyek -->
  <CreateProjectModal
    :is-open="createProjectModal.isOpen"
    :edit-project="createProjectModal.editProject"
    @update:is-open="createProjectModal.isOpen = $event"
    @project-saved="handleProjectSaved"
    @show-success-modal="(msg) => showAlert('success', 'Berhasil!', msg)"
    @show-error-modal="(msg) => showAlert('error', 'Gagal!', msg)"
  />

  <!-- Modal Tambah Sertifikat -->
  <CreateCertificationModal
    :is-open="createCertificationModal.isOpen"
    @update:is-open="createCertificationModal.isOpen = $event"
    @certification-saved="handleCertificationSaved"
    @show-alert="showAlert"
  />

  <!-- Modal Tambah/Edit Pengalaman -->
  <CreateExperienceModal
    :is-open="createExperienceModal.isOpen"
    :edit-experience="createExperienceModal.editExperience"
    @update:is-open="createExperienceModal.isOpen = $event"
    @experience-saved="handleExperienceSaved"
    @show-alert="showAlert"
  />

  <!-- Modal Ubah Profil -->
  <EditProfileModal
    :is-open="editProfileModal.isOpen"
    :current-profile="publicProfile"
    @update:is-open="editProfileModal.isOpen = $event"
    @profile-updated="handleProfileUpdated"
    @show-alert="showAlert"
  />

  <!-- State Memuat (SSR-safe) -->
  <div v-if="pending || experiencesPending" class="flex justify-center items-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
      <p class="text-gray-600">Memuat profil...</p>
    </div>
  </div>

  <!-- ...existing code for main content... -->

  <!-- Konten Utama hanya di client -->
  <ClientOnly>
    <template #fallback>
      <!-- Skeleton saat SSR agar struktur stabil -->
      <div class="flex justify-center items-center min-h-screen">
        <div class="text-center">
          <div class="animate-pulse w-12 h-12 mx-auto mb-4 rounded-full bg-gray-200"></div>
          <p class="text-gray-600">Menyiapkan tampilan…</p>
        </div>
      </div>
    </template>

    <div v-if="!pending && !experiencesPending" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 justify-between lg:flex-row lg:items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Profil Saya</h1>
          <p class="mt-1 text-gray-600">Kelola profil, proyek, pengalaman, dan sertifikat Anda</p>
        </div>
      </div>

      <!-- Kartu Header Profil -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="relative bg-gradient-to-r from-red-50 to-rose-100 p-6">
          <!-- Tombol Ubah Profil -->
          <button
            class="absolute top-4 right-4 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium border border-gray-200"
            @click="openEditProfileModal"
          >
            <Icon name="heroicons:pencil-20-solid" class="w-4 h-4" />
            Ubah Profil
          </button>

          <div class="flex flex-col lg:flex-row items-start gap-6">
            <!-- Foto Profil -->
            <div class="flex-shrink-0 relative">
              <div v-if="publicProfile?.profile_picture" class="w-24 h-24 rounded-xl overflow-hidden ring-4 ring-white shadow-lg">
                <img :src="publicProfile.profile_picture" :alt="publicProfile.fullname" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg">
                {{ getInitials(publicProfile?.fullname || '') }}
              </div>
              <!-- Status Online -->
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>

            <!-- Info Profil -->
            <div class="flex-1 space-y-4">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <h2 class="text-2xl font-bold text-gray-900">{{ publicProfile?.fullname || 'Memuat...' }}</h2>
                  <span class="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                    {{ publicProfile?.class }}
                  </span>
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">NIS: {{ publicProfile?.nis 
                    }}</span>
                </div>

                <!-- Statistik -->
                <div class="grid grid-cols-4 gap-4 mt-4">
                  <div class="text-center">
                    <div class="text-xl font-bold text-primary">{{ publicProfile?.projects?.length || 0 }}</div>
                    <div class="text-sm text-gray-600">Proyek</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-bold text-blue-600">{{ experiences?.length || 0 }}</div>
                    <div class="text-sm text-gray-600">Pengalaman</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-bold text-green-600">{{ publicProfile?.certifications?.length || 0 }}</div>
                    <div class="text-sm text-gray-600">Sertifikat</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-bold text-purple-600">{{ publicProfile?.recommended_role?.score || 0 }}%</div>
                    <div class="text-sm text-gray-600">Skor Kecocokan</div>
                  </div>
                </div>
              </div>

              <!-- Headline & Bio -->
              <div v-if="publicProfile?.headline || publicProfile?.bio" class="space-y-3">
                <div v-if="publicProfile?.headline" class="bg-white/70 rounded-lg p-3">
                  <div class="flex items-center gap-2 mb-1">
                    <Icon name="heroicons:star-20-solid" class="w-4 h-4 text-yellow-500" />
                    <span class="text-xs font-medium text-gray-600">Judul Profil</span>
                  </div>
                  <p class="font-medium text-primary">{{ publicProfile.headline }}</p>
                </div>

                <div v-if="publicProfile?.bio" class="bg-white/70 rounded-lg p-3">
                  <div class="flex items-center gap-2 mb-1">
                    <Icon name="heroicons:document-text-20-solid" class="w-4 h-4 text-blue-500" />
                    <span class="text-xs font-medium text-gray-600">Bio</span>
                  </div>
                  <p class="text-gray-700 text-sm">{{ publicProfile.bio }}</p>
                </div>
              </div>

              <!-- Rekomendasi Peran -->
              <div v-if="publicProfile?.recommended_role" class="bg-white/70 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="heroicons:sparkles-20-solid" class="w-5 h-5 text-primary" />
                  <span class="text-sm font-medium text-primary">Rekomendasi Karier (AI)</span>
                </div>
                <h3 class="font-bold text-gray-900 mb-1">{{ publicProfile.recommended_role.role_name }}</h3>
                <p class="text-gray-700 text-sm mb-3">{{ publicProfile.recommended_role.role_description }}</p>
                <div class="flex items-center gap-3">
                  <span class="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">Kecocokan {{ publicProfile.recommended_role.score }}%</span>
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full transition-all duration-500" :style="{ width: `${publicProfile.recommended_role.score}%` }" />
                  </div>
                </div>
              </div>

              <!-- Info Tambahan -->
              <div v-if="publicProfile?.phone || publicProfile?.personal_email || publicProfile?.location || publicProfile?.languages?.length" class="space-y-3">
                <!-- Kontak -->
                <div v-if="publicProfile?.phone || publicProfile?.personal_email" class="bg-white/70 rounded-lg p-3">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="heroicons:phone-20-solid" class="w-4 h-4 text-green-500" />
                    <span class="text-xs font-medium text-gray-600">Kontak</span>
                  </div>
                  <div class="space-y-1 text-sm">
                    <p v-if="publicProfile?.phone" class="text-gray-700">📞 {{ publicProfile.phone }}</p>
                    <p v-if="publicProfile?.personal_email" class="text-gray-700">✉️ {{ publicProfile.personal_email }}</p>
                  </div>
                </div>

                <!-- Lokasi -->
                <div v-if="publicProfile?.location" class="bg-white/70 rounded-lg p-3">
                  <div class="flex items-center gap-1 mb-1">
                    <Icon name="heroicons:map-pin-20-solid" class="w-4 h-4 text-red-500" />
                    <span class="text-xs font-medium text-gray-600">Lokasi</span>
                  </div>
                  <p class="text-gray-700 text-sm">{{ publicProfile.location }}</p>
                </div>

                <!-- Bahasa -->
                <div v-if="publicProfile?.languages?.length" class="bg-white/70 rounded-lg p-3">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="heroicons:language-20-solid" class="w-4 h-4 text-purple-500" />
                    <span class="text-xs font-medium text-gray-600">Bahasa</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="lang in publicProfile.languages"
                      :key="lang.name"
                      :class="['px-2 py-1 rounded-full text-xs', lang.certified ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700']"
                    >
                      {{ lang.name }} ({{ lang.level }})
                      <Icon v-if="lang.certified" name="heroicons:check-badge-20-solid" class="w-3 h-3 ml-1 inline" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div> <!-- /header card -->
        </div>
      </div>

      <!-- Navigasi Tab -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-1 p-1 overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap',
                activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
              @click="activeTab = tab.id"
            >
              <Icon :name="tab.icon" class="w-4 h-4" />
              {{ tab.name }}
              <span
                v-if="tab.count !== undefined"
                :class="['px-2 py-0.5 text-xs rounded-full', activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600']"
              >
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Isi Tab -->
        <div
          class="p-6"
          :key="activeTab + ':' + (publicProfile?.projects?.length || 0) + ':' + (publicProfile?.certifications?.length || 0) + ':' + (experiences?.length || 0)"
        >
          <!-- Tab Proyek -->
          <div v-if="activeTab === 'projects'" class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Proyek Saya</h3>
                <p class="text-gray-600 text-sm">Tunjukkan karya dan pencapaian Anda</p>
              </div>
              <button
                @click="openCreateProjectModal"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                Tambah Proyek
              </button>
            </div>

            <!-- Grid Proyek -->
            <div v-if="publicProfile?.projects?.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="project in publicProfile.projects"
                :key="project.id"
                class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div class="flex items-start justify-between mb-3">
                  <h4 class="font-semibold text-gray-900 text-sm">{{ project.project_name }}</h4>
                  <div class="flex gap-1">
                    <button @click="editProject(project)" class="p-1 text-gray-400 hover:text-primary transition-colors" aria-label="Ubah proyek">
                      <Icon name="heroicons:pencil-20-solid" class="w-4 h-4" />
                    </button>
                    <button @click="deleteProject(project)" class="p-1 text-gray-400 hover:text-red-500 transition-colors" aria-label="Hapus proyek">
                      <Icon name="heroicons:trash-20-solid" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p class="text-gray-600 text-xs mb-3 line-clamp-2">{{ project.description || '—' }}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                  <span>{{ project.photo_count || 0 }} foto</span>
                  <span :class="project.is_completed ? 'text-green-600' : 'text-yellow-600'">
                    {{ project.is_completed ? 'Selesai' : 'Berjalan' }}
                  </span>
                </div>
                <div v-if="project.link_url" class="mt-2">
                  <a :href="project.link_url" target="_blank" class="text-primary hover:text-primary/80 text-xs flex items-center gap-1">
                    <Icon name="heroicons:link-20-solid" class="w-3 h-3" />
                    Lihat Proyek
                  </a>
                </div>
              </div>
            </div>

            <!-- Kosong Proyek -->
            <div v-else class="text-center py-12">
              <Icon name="heroicons:folder-20-solid" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada proyek</h3>
              <p class="text-gray-500 mb-4">Mulai tampilkan karya Anda dengan menambahkan proyek pertama</p>
              <button @click="openCreateProjectModal" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                Tambah Proyek Pertama
              </button>
            </div>
          </div>

          <!-- Tab Pengalaman -->
          <div v-else-if="activeTab === 'experiences'" class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Pengalaman Kerja</h3>
                <p class="text-gray-600 text-sm">Tunjukkan riwayat pekerjaan dan magang Anda</p>
              </div>
              <button @click="openCreateExperienceModal" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
                <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                Tambah Pengalaman
              </button>
            </div>

            <!-- Timeline Pengalaman -->
            <div v-if="experiences?.length" class="space-y-4">
              <div v-for="experience in experiences" :key="experience.id" class="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h4 class="font-bold text-gray-900 text-lg">{{ experience.position }}</h4>
                      <span :class="['px-3 py-1 rounded-full text-xs font-medium', experience.is_current ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600']">
                        {{ experience.is_current ? 'Aktif' : 'Selesai' }}
                      </span>
                      <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">{{ experience.employment_type }}</span>
                    </div>
                    <p class="font-semibold text-primary mb-1">{{ experience.company_name }}</p>
                    <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span class="flex items-center gap-1">
                        <Icon name="heroicons:calendar-20-solid" class="w-4 h-4" />
                        {{ formatDate(experience.start_date) }} -
                        {{ experience.is_current ? 'Sekarang' : formatDate(experience.end_date) }}
                      </span>
                      <span class="flex items-center gap-1">
                        <Icon name="heroicons:map-pin-20-solid" class="w-4 h-4" />
                        {{ experience.location }}
                      </span>
                      <span class="flex items-center gap-1">
                        <Icon name="heroicons:building-office-20-solid" class="w-4 h-4" />
                        {{ experience.location_type }}
                      </span>
                    </div>
                  </div>
                  <div class="flex gap-1">
                    <button @click="editExperience(experience)" class="p-2 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Edit pengalaman">
                      <Icon name="heroicons:pencil-20-solid" class="w-4 h-4" />
                    </button>
                    <button @click="deleteExperience(experience)" class="p-2 text-gray-400 hover:text-red-500 transition-colors" aria-label="Hapus pengalaman">
                      <Icon name="heroicons:trash-20-solid" class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div class="space-y-3">
                  <div v-if="experience.description">
                    <p class="text-gray-700 text-sm leading-relaxed">{{ experience.description }}</p>
                  </div>

                  <div v-if="experience.responsibilities" class="bg-white rounded-lg p-3">
                    <h5 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Icon name="heroicons:clipboard-document-list-20-solid" class="w-4 h-4 text-blue-500" />
                      Tanggung Jawab
                    </h5>
                    <div class="text-sm text-gray-700 whitespace-pre-line">{{ experience.responsibilities }}</div>
                  </div>

                  <div v-if="experience.achievements" class="bg-white rounded-lg p-3">
                    <h5 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Icon name="heroicons:trophy-20-solid" class="w-4 h-4 text-yellow-500" />
                      Pencapaian
                    </h5>
                    <div class="text-sm text-gray-700 whitespace-pre-line">{{ experience.achievements }}</div>
                  </div>

                  <div v-if="experience.skills" class="bg-white rounded-lg p-3">
                    <h5 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Icon name="heroicons:cpu-chip-20-solid" class="w-4 h-4 text-purple-500" />
                      Keahlian yang Digunakan
                    </h5>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="skill in experience.skills.split(',')"
                        :key="skill.trim()"
                        class="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        {{ skill.trim() }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Kosong Pengalaman -->
            <div v-else class="text-center py-12">
              <Icon name="heroicons:briefcase-20-solid" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada pengalaman kerja</h3>
              <p class="text-gray-500 mb-4">Tambahkan pengalaman kerja, magang, atau proyek freelance untuk memperkuat profil Anda</p>
              <button @click="openCreateExperienceModal" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Tambah Pengalaman Pertama
              </button>
            </div>
          </div>

          <!-- Tab Sertifikat -->
          <div v-else-if="activeTab === 'certifications'" class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Sertifikat Saya</h3>
                <p class="text-gray-600 text-sm">Pencapaian dan kredensial profesional Anda</p>
              </div>
              <button @click="openCreateCertificationModal" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium">
                <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                Tambah Sertifikat
              </button>
            </div>

            <!-- Grid Sertifikat -->
            <div v-if="publicProfile?.certifications?.length" class="grid gap-4 md:grid-cols-2">
              <div
                v-for="certification in publicProfile.certifications"
                :key="certification.id"
                class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 text-sm mb-1">{{ certification.name }}</h4>
                    <p class="text-gray-600 text-xs">{{ certification.issuing_organization }}</p>
                  </div>
                  <button @click="deleteCertification(certification)" class="p-1 text-gray-400 hover:text-red-500 transition-colors" aria-label="Hapus sertifikat">
                    <Icon name="heroicons:trash-20-solid" class="w-4 h-4" />
                  </button>
                </div>

                <div class="space-y-2 text-xs text-gray-500">
                  <div class="flex justify-between"><span>Diterbitkan:</span><span>{{ formatDate(certification.issue_date) }}</span></div>
                  <div class="flex justify-between">
                    <span>Kedaluwarsa:</span>
                    <span :class="certification.is_expired ? 'text-red-500' : certification.is_expiring_soon ? 'text-yellow-500' : ''">
                      {{ formatDate(certification.expiration_date) }}
                    </span>
                  </div>
                  <div v-if="certification.credential_id" class="flex justify-between">
                    <span>ID Kredensial:</span>
                    <span class="font-mono">{{ certification.credential_id }}</span>
                  </div>
                </div>

                <div v-if="certification.credential_url" class="mt-3">
                  <a :href="certification.credential_url" target="_blank" class="text-green-600 hover:text-green-700 text-xs flex items-center gap-1">
                    <Icon name="heroicons:link-20-solid" class="w-3 h-3" />
                    Verifikasi Sertifikat
                  </a>
                </div>
              </div>
            </div>

            <!-- Kosong Sertifikat -->
            <div v-else class="text-center py-12">
              <Icon name="heroicons:academic-cap-20-solid" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada sertifikat</h3>
              <p class="text-gray-500 mb-4">Tambahkan sertifikat profesional untuk menunjukkan keahlian Anda</p>
              <button @click="openCreateCertificationModal" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                Tambah Sertifikat Pertama
              </button>
            </div>
          </div>

          <!-- Tab Profil Publik -->
          <div v-else-if="activeTab === 'public'" class="text-center py-12">
            <Icon name="heroicons:globe-alt-20-solid" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Bagikan Profil Anda</h3>
            <p class="text-gray-500 mb-6 max-w-md mx-auto">Biarkan orang lain menemukan proyek, sertifikat, dan pencapaian Anda melalui profil publik.</p>

            <!-- URL Profil (pakai computed fallback kalau kosong) -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p class="text-sm text-gray-600 mb-2">URL profil Anda:</p>
              <code class="text-sm font-mono text-primary bg-white px-3 py-2 rounded border block break-all">
                {{ safeProfileUrl || '—' }}
              </code>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                @click="copyProfileUrl"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                :disabled="!safeProfileUrl"
              >
                <Icon name="heroicons:clipboard-20-solid" class="w-4 h-4" />
                Salin URL Profil
              </button>
              <button
                @click="openPublicProfile"
                class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
                :disabled="!safeProfileUrl"
              >
                <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
                Pratinjau Profil
              </button>
            </div>
          </div>
        </div>
      </div> <!-- /tabs card -->
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import ConfirmModal from '~/components/modal/basic-modal/ConfirmModal.vue'
import CreateProjectModal from '~/components/modal/student/dashboard/CreateProjectModal.vue'
import CreateCertificationModal from '~/components/modal/student/dashboard/CreateCertificationModal.vue'
import CreateExperienceModal from '~/components/modal/student/dashboard/CreateExperienceModal.vue'
import EditProfileModal from '~/components/modal/student/dashboard/EditProfileModal.vue'
import type { AlertType } from '~/components/modal/basic-modal/AlertModal.vue'
import type { ConfirmType } from '~/components/modal/basic-modal/ConfirmModal.vue'

definePageMeta({
  layout: 'dashboard-layout-student-dashboard-layout'
})

const config = useRuntimeConfig()
const userStore = useUserStore()

// Pastikan data pengguna termuat (client-only untuk hindari mismatch)
if (import.meta.client) {
  await userStore.fetchUser()
}

const activeTab = ref<'projects' | 'experiences' | 'certifications' | 'public'>('projects')

// Modal States
const createProjectModal = ref({ isOpen: false, editProject: null as any })
const createExperienceModal = ref({ isOpen: false, editExperience: null as any })
const createCertificationModal = ref({ isOpen: false })
const editProfileModal = ref({ isOpen: false })

const alertModal = ref({ isOpen: false, type: 'info' as AlertType, title: '', message: '' })
const confirmModal = ref({ 
  isOpen: false, 
  type: 'danger' as ConfirmType, 
  title: '', 
  message: '', 
  confirmText: 'Hapus',
  onConfirm: () => {} 
})

// Ambil profil publik (client-only)
const { data: publicProfile, pending, error, refresh } = await useAsyncData(
  'public-profile',
  async () => {
    return await $fetch(`/student/me`, {
      baseURL: config.public.apiBase,
      credentials: 'include',
      method: 'GET'
    })
  },
  {
    transform: (data: any) => {
      if (data?.success && data?.data?.student_profile) {
        return {
          ...data.data.student_profile,
          email: data.data.email,
          role: data.data.role,
          username: data.data.username,
          profile_url: data.data.profile_url // kalau backend sudah sediakan
        }
      }
      return null
    },
    default: () => null,
    server: false
  }
)

// Ambil data pengalaman kerja (client-only)
const { data: experiences, pending: experiencesPending, refresh: refreshExperiences } = await useAsyncData(
  'student-experiences',
  async () => {
    return await $fetch('/student/experiences', {
      baseURL: config.public.apiBase,
      credentials: 'include',
      method: 'GET'
    })
  },
  {
    transform: (data: any) => (data?.success && data?.data ? data.data : []),
    default: () => [],
    server: false
  }
)

// Tabs dengan counter
const tabs = computed(() => [
  { id: 'projects', name: 'Proyek', icon: 'heroicons:folder-20-solid', count: publicProfile.value?.projects?.length || 0 },
  { id: 'experiences', name: 'Pengalaman', icon: 'heroicons:briefcase-20-solid', count: experiences.value?.length || 0 },
  { id: 'certifications', name: 'Sertifikat', icon: 'heroicons:academic-cap-20-solid', count: publicProfile.value?.certifications?.length || 0 },
  { id: 'public', name: 'Profil Publik', icon: 'heroicons:globe-alt-20-solid' }
])

/* ======================= Actions ======================= */
// Proyek
const openCreateProjectModal = () => { createProjectModal.value.editProject = null; createProjectModal.value.isOpen = true }
const editProject = (project: any) => { createProjectModal.value.editProject = project; createProjectModal.value.isOpen = true }

const deleteProject = async (project: any) => {
  confirmModal.value = {
    isOpen: true,
    type: 'danger',
    title: 'Hapus Proyek',
    message: `Apakah Anda yakin ingin menghapus proyek "${project.project_name}"? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: 'Hapus Proyek',
    onConfirm: async () => {
      try {
        const response = await $fetch(`/student/projects/${project.id}`, { 
          method: 'DELETE', 
          baseURL: config.public.apiBase, 
          credentials: 'include' 
        })
        if (response?.success) { 
          showAlert('success', 'Berhasil!', 'Proyek berhasil dihapus.')
          await refresh() 
        }
      } catch (err: any) { 
        console.error(err)
        showAlert('error', 'Gagal!', err?.data?.message || 'Gagal menghapus proyek.') 
      }
    }
  }
}

const handleProjectSaved = () => { refresh() }

// Pengalaman
const openCreateExperienceModal = () => { createExperienceModal.value.editExperience = null; createExperienceModal.value.isOpen = true }
const editExperience = (experience: any) => { createExperienceModal.value.editExperience = experience; createExperienceModal.value.isOpen = true }

const deleteExperience = async (experience: any) => {
  confirmModal.value = {
    isOpen: true,
    type: 'danger',
    title: 'Hapus Pengalaman',
    message: `Apakah Anda yakin ingin menghapus pengalaman "${experience.position}" di ${experience.company_name}? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: 'Hapus Pengalaman',
    onConfirm: async () => {
      try {
        const response = await $fetch(`/student/experiences/${experience.id}`, { 
          method: 'DELETE', 
          baseURL: config.public.apiBase, 
          credentials: 'include' 
        })
        if (response?.success) { 
          showAlert('success', 'Berhasil!', 'Pengalaman berhasil dihapus.')
          await refreshExperiences() 
        }
      } catch (err: any) { 
        console.error(err)
        showAlert('error', 'Gagal!', err?.data?.message || 'Gagal menghapus pengalaman.') 
      }
    }
  }
}

const handleExperienceSaved = () => { refreshExperiences() }

// Sertifikat
const openCreateCertificationModal = () => { createCertificationModal.value.isOpen = true }

const deleteCertification = async (cert: any) => {
  confirmModal.value = {
    isOpen: true,
    type: 'danger',
    title: 'Hapus Sertifikat',
    message: `Apakah Anda yakin ingin menghapus sertifikat "${cert.name}" dari ${cert.issuing_organization}? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: 'Hapus Sertifikat',
    onConfirm: async () => {
      try {
        const response = await $fetch(`/student/certifications/${cert.id}`, { 
          method: 'DELETE', 
          baseURL: config.public.apiBase, 
          credentials: 'include' 
        })
        if (response?.success) { 
          showAlert('success', 'Berhasil!', 'Sertifikat berhasil dihapus.')
          await refresh() 
        }
      } catch (err: any) { 
        console.error(err)
        showAlert('error', 'Gagal!', err?.data?.message || 'Gagal menghapus sertifikat.') 
      }
    }
  }
}

const handleCertificationSaved = () => { refresh() }

// Profil
const openEditProfileModal = () => { editProfileModal.value.isOpen = true }
const handleProfileUpdated = () => { refresh() }

/* ======================= Utils ======================= */
const showAlert = (type: AlertType, title: string, message: string) => { alertModal.value = { isOpen: true, type, title, message } }

const getInitials = (name: string) =>
  name.split(' ').map(w => w.charAt(0)).join('').toUpperCase().slice(0, 2)

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })

const safeProfileUrl = computed(() => {
  const explicit = publicProfile?.value.nis
  if (explicit) return explicit
  const username = publicProfile.value?.username
  if (!username) return null
  if (typeof window === 'undefined') return null
  const origin = window.location.origin
  // Sesuaikan pola URL publik di app kamu
  return `aicademy.smktelkom-pwt.sch.id/profile/${publicProfile?.value.nis}`
})

const copyProfileUrl = async () => {
  if (!safeProfileUrl.value) {
    showAlert('error', 'Gagal!', 'URL profil belum tersedia.')
    return
  }
  try {
    await navigator.clipboard.writeText(safeProfileUrl.value)
    showAlert('success', 'Berhasil!', 'URL profil berhasil disalin.')
  } catch {
    showAlert('error', 'Gagal!', 'Tidak dapat menyalin URL profil.')
  }
}

const openPublicProfile = () => {
  if (safeProfileUrl.value) window.open(safeProfileUrl.value, '_blank')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>