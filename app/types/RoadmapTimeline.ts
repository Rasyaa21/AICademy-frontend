export interface RoadmapTimelineItem {
    title: string
    description: string
    duration: string
    icon: string
    isActive: boolean
    tasks: Task[]
    submissions: Submission[]
    learningObjectives: string[]
    resources: Resource[]
}

export interface Task {
    id: string
    title: string
    description: string
    type: 'assignment' | 'project' | 'quiz' | 'reading'
    deadline?: string
    isCompleted: boolean
}

export interface Submission {
    id: string
    taskId: string
    title: string
    description: string
    fileUrl?: string
    submittedAt?: string
    status: 'pending' | 'submitted' | 'graded'
}

export interface Resource {
    id: string
    title: string
    type: 'video' | 'article' | 'documentation' | 'tutorial'
    url: string
    duration?: string
}