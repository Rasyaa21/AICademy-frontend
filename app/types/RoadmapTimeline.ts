export interface RoadmapTimelineItem {
    title: string
    description: string
    duration: string
    icon: string
    isActive: boolean
    isCompleted: boolean
    isLocked: boolean
    tasks: Task[]
    submissions: Submission[]
    learningObjectives: string[]
    resources: Resource[]
    stepData?: StepData // Add step data from API
}

export interface StepData {
    id: string
    step_order: number
    title: string
    description: string
    learning_objectives: string
    submission_guidelines: string
    resource_links: string
    estimated_duration: number
    difficulty_level: 'beginner' | 'intermediate' | 'advanced'
    status: 'locked' | 'unlocked' | 'in_progress' | 'completed'
    evidence_link?: string | null
    evidence_type?: string | null
    submission_notes?: string | null
    validation_notes?: string | null
    validation_score?: number | null
    started_at?: string | null
    submitted_at?: string | null
    completed_at?: string | null
    can_start: boolean
    can_submit: boolean
    is_locked: boolean
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

export interface StartStepRequest {
    step_id: string
}

export interface SubmitStepRequest {
    evidence_link: string
    evidence_type: string
    submission_notes?: string
}