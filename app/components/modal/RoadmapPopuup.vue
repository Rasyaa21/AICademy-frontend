<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg p-2.5">
                            <Icon :name="selectedItem?.icon || 'heroicons:academic-cap-20-solid'" class="w-full h-full text-white" />
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-gray-900">{{ selectedItem?.title }}</h3>
                            <p class="text-sm text-gray-500">Learning Path Details</p>
                        </div>
                    </div>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 space-y-6">
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-2">Deskripsi</h4>
                            <p class="text-gray-600 leading-relaxed">{{ selectedItem?.description }}</p>
                        </div>

                        <!-- Duration & Progress -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="flex items-center gap-2 text-sm">
                                <Icon name="heroicons:clock-20-solid" class="w-5 h-5 text-primary" />
                                <span class="font-medium text-gray-900">Durasi:</span>
                                <span class="text-primary font-semibold">{{ selectedItem?.duration }}</span>
                            </div>
                            <div v-if="selectedItem?.isActive" class="flex items-center gap-2 text-sm">
                                <Icon name="heroicons:chart-bar-20-solid" class="w-5 h-5 text-primary" />
                                <span class="font-medium text-gray-900">Progress:</span>
                                <span class="text-primary font-semibold">{{ completedTasksCount }}/{{ totalTasksCount }} tasks</span>
                            </div>
                        </div>

                        <!-- Progress Bar -->
                        <div v-if="selectedItem?.isActive">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-semibold text-gray-900">Progress Pembelajaran</h4>
                                <span class="text-sm text-gray-600">{{ Math.round(progressPercentage) }}% selesai</span>
                            </div>
                            <div class="bg-gray-100 rounded-full h-3">
                                <div 
                                    class="bg-primary rounded-full h-3 transition-all duration-300"
                                    :style="{ width: `${progressPercentage}%` }"
                                ></div>
                            </div>
                        </div>

                        <!-- Learning Objectives -->
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Icon name="heroicons:academic-cap-20-solid" class="w-5 h-5 text-primary" />
                                Yang Akan Dipelajari
                            </h4>
                            <ul class="space-y-2">
                                <li v-for="objective in selectedItem?.learningObjectives" :key="objective" class="flex items-start gap-2">
                                    <Icon name="heroicons:check-circle-20-solid" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span class="text-gray-600 text-sm">{{ objective }}</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Tasks & Assignments -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="font-semibold text-gray-900 flex items-center gap-2">
                                    <Icon name="heroicons:clipboard-document-list-20-solid" class="w-5 h-5 text-primary" />
                                    Tugas & Assignment
                                </h4>
                                <button 
                                    @click="expandedSection = expandedSection === 'tasks' ? null : 'tasks'"
                                    class="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                                >
                                    {{ expandedSection === 'tasks' ? 'Tutup' : 'Lihat Semua' }}
                                    <Icon 
                                        name="heroicons:chevron-down-20-solid" 
                                        class="w-4 h-4 transition-transform duration-200"
                                        :class="{ 'rotate-180': expandedSection === 'tasks' }"
                                    />
                                </button>
                            </div>
                            
                            <div class="space-y-3">
                                <template v-if="expandedSection === 'tasks'">
                                    <div v-for="task in selectedItem?.tasks" :key="task.id" 
                                         class="border border-gray-200 rounded-lg p-4 hover:border-primary/20 transition-colors">
                                        <div class="flex items-start justify-between mb-2">
                                            <div class="flex items-center gap-2">
                                                <Icon 
                                                    :name="getTaskIcon(task.type)" 
                                                    class="w-4 h-4"
                                                    :class="task.isCompleted ? 'text-green-500' : 'text-gray-400'"
                                                />
                                                <h5 class="font-medium text-gray-900 text-sm">{{ task.title }}</h5>
                                                <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs capitalize">
                                                    {{ task.type }}
                                                </span>
                                            </div>
                                        </div>
                                        <p class="text-gray-600 text-xs mb-3">{{ task.description }}</p>
                                        <div class="flex items-center justify-between">
                                            <span v-if="task.deadline" class="text-xs text-gray-500">
                                                Deadline: {{ formatDate(task.deadline) }}
                                            </span>
                                            <button 
                                                v-if="!task.isCompleted && selectedItem?.isActive"
                                                @click="handleSubmission(task)"
                                                class="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary/90 transition-colors"
                                            >
                                                Submit Task
                                            </button>
                                            <span v-else-if="task.isCompleted" class="text-xs text-green-600 font-medium">
                                                ✓ Completed
                                            </span>
                                            <span v-else class="text-xs text-gray-400">
                                                Locked
                                            </span>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div v-for="task in selectedItem?.tasks.slice(0, 4)" :key="task.id" 
                                             class="flex items-center gap-2 p-2 border border-gray-200 rounded text-xs">
                                            <Icon 
                                                :name="getTaskIcon(task.type)" 
                                                class="w-3 h-3"
                                                :class="task.isCompleted ? 'text-green-500' : 'text-gray-400'"
                                            />
                                            <span class="flex-1 truncate">{{ task.title }}</span>
                                            <Icon 
                                                :name="task.isCompleted ? 'heroicons:check-circle-20-solid' : 'heroicons:clock-20-solid'" 
                                                class="w-3 h-3"
                                                :class="task.isCompleted ? 'text-green-500' : 'text-orange-500'"
                                            />
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- Resources -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="font-semibold text-gray-900 flex items-center gap-2">
                                    <Icon name="heroicons:book-open-20-solid" class="w-5 h-5 text-primary" />
                                    Learning Resources
                                </h4>
                                <button 
                                    @click="expandedSection = expandedSection === 'resources' ? null : 'resources'"
                                    class="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                                >
                                    {{ expandedSection === 'resources' ? 'Tutup' : 'Lihat Semua' }}
                                    <Icon 
                                        name="heroicons:chevron-down-20-solid" 
                                        class="w-4 h-4 transition-transform duration-200"
                                        :class="{ 'rotate-180': expandedSection === 'resources' }"
                                    />
                                </button>
                            </div>
                            
                            <div class="space-y-2">
                                <template v-if="expandedSection === 'resources'">
                                    <a v-for="resource in selectedItem?.resources" :key="resource.id" 
                                       :href="resource.url" target="_blank"
                                       class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary/20 hover:bg-gray-50 transition-colors">
                                        <Icon 
                                            :name="getResourceIcon(resource.type)" 
                                            class="w-5 h-5 text-primary"
                                        />
                                        <div class="flex-1">
                                            <p class="text-sm font-medium text-gray-900">{{ resource.title }}</p>
                                            <div class="flex items-center gap-2 text-xs text-gray-500">
                                                <span class="capitalize">{{ resource.type }}</span>
                                                <span v-if="resource.duration">• {{ resource.duration }}</span>
                                            </div>
                                        </div>
                                        <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-4 h-4 text-gray-400" />
                                    </a>
                                </template>
                                <template v-else>
                                    <div class="grid grid-cols-1 gap-2">
                                        <a v-for="resource in selectedItem?.resources.slice(0, 3)" :key="resource.id" 
                                           :href="resource.url" target="_blank"
                                           class="flex items-center gap-2 p-2 border border-gray-200 rounded text-xs hover:border-primary/20 transition-colors">
                                            <Icon 
                                                :name="getResourceIcon(resource.type)" 
                                                class="w-4 h-4 text-primary"
                                            />
                                            <span class="flex-1 truncate">{{ resource.title }}</span>
                                            <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-3 h-3 text-gray-400" />
                                        </a>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Submissions -->
                    <div class="space-y-6">
                        <div v-if="selectedItem?.submissions && selectedItem.submissions.length > 0">
                            <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Icon name="heroicons:paper-airplane-20-solid" class="w-5 h-5 text-primary" />
                                Submission Status
                            </h4>
                            <div class="space-y-3">
                                <div v-for="submission in selectedItem.submissions" :key="submission.id" 
                                     class="p-3 bg-gray-50 rounded-lg">
                                    <div class="flex items-start gap-2 mb-2">
                                        <Icon 
                                            :name="getSubmissionIcon(submission.status)" 
                                            class="w-4 h-4 mt-0.5"
                                            :class="getSubmissionColor(submission.status)"
                                        />
                                        <div class="flex-1">
                                            <p class="text-sm font-medium text-gray-900">{{ submission.title }}</p>
                                            <p class="text-xs text-gray-500 mb-2">{{ submission.description }}</p>
                                            <span 
                                                class="px-2 py-1 rounded-full text-xs font-medium"
                                                :class="getSubmissionStatusClass(submission.status)"
                                            >
                                                {{ getSubmissionStatusText(submission.status) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="space-y-3">
                            <button 
                                v-if="selectedItem?.isActive"
                                class="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                                Lanjutkan Belajar
                            </button>
                            <button 
                                v-else
                                class="w-full bg-gray-100 text-gray-600 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                disabled
                            >
                                Belum Tersedia
                            </button>
                            <button 
                                @click="closeModal"
                                class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { RoadmapTimelineItem, Task } from '~/types/RoadmapTimeline';

const props = defineProps<{
    isOpen: boolean
    selectedItem?: RoadmapTimelineItem | null
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'submit-task': [task: Task]
}>()

const expandedSection = ref<'tasks' | 'resources' | null>(null)

const completedTasksCount = computed(() => {
    return props.selectedItem?.tasks.filter(task => task.isCompleted).length || 0
})

const totalTasksCount = computed(() => {
    return props.selectedItem?.tasks.length || 0
})

const progressPercentage = computed(() => {
    if (totalTasksCount.value === 0) return 0
    return (completedTasksCount.value / totalTasksCount.value) * 100
})

const closeModal = () => {
    expandedSection.value = null
    emit('update:isOpen', false)
}

const handleSubmission = (task: Task) => {
    emit('submit-task', task)
}

const getTaskIcon = (type: string) => {
    const icons = {
        assignment: 'heroicons:document-text-20-solid',
        project: 'heroicons:code-bracket-square-20-solid',
        quiz: 'heroicons:question-mark-circle-20-solid',
        reading: 'heroicons:book-open-20-solid'
    }
    return icons[type as keyof typeof icons] || 'heroicons:clipboard-document-list-20-solid'
}

const getResourceIcon = (type: string) => {
    const icons = {
        video: 'heroicons:play-circle-20-solid',
        article: 'heroicons:document-text-20-solid',
        documentation: 'heroicons:book-open-20-solid',
        tutorial: 'heroicons:academic-cap-20-solid'
    }
    return icons[type as keyof typeof icons] || 'heroicons:link-20-solid'
}

const getSubmissionIcon = (status: string) => {
    const icons = {
        pending: 'heroicons:clock-20-solid',
        submitted: 'heroicons:check-circle-20-solid',
        graded: 'heroicons:star-20-solid'
    }
    return icons[status as keyof typeof icons] || 'heroicons:document-20-solid'
}

const getSubmissionColor = (status: string) => {
    const colors = {
        pending: 'text-orange-500',
        submitted: 'text-blue-500',
        graded: 'text-green-500'
    }
    return colors[status as keyof typeof colors] || 'text-gray-500'
}

const getSubmissionStatusClass = (status: string) => {
    const classes = {
        pending: 'bg-orange-100 text-orange-600',
        submitted: 'bg-blue-100 text-blue-600',
        graded: 'bg-green-100 text-green-600'
    }
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-600'
}

const getSubmissionStatusText = (status: string) => {
    const texts = {
        pending: 'Pending',
        submitted: 'Submitted',
        graded: 'Graded'
    }
    return texts[status as keyof typeof texts] || 'Unknown'
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}
</script>