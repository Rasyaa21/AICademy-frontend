export interface QuestionOption {
  label: string
  value: string
}

export interface QuestionnaireState {
  questionnaireId?: string
  currentStep: number
  answers: Answer[]
  isDraft: boolean
  completedAt?: string
  savedAt?: string
  submissionId?: string
  pendingSubmission?: boolean
}

export interface Question {
  id: string
  question_text: string
  question_type: 'mcq' | 'likert' | 'case' | 'text'
  options?: Array<{
    value: string
    label: string
    score: number
  }>
  category: string
  order: number
}

export interface QuestionInputData {
  name: string
  question_count: number
  difficulty_level: string
  ai_personality: string
  custom_instructions: string
}

export interface QuestionnaireData {
  questions: Question[]
  metadata: {
    total_questions: number
    distribution: {
      mcq: number
      likert: number
      case: number
      text: number
    }
    target_roles_coverage: string[]
  }
}

export interface Answer {
  questionIndex: number
  value: string | number
  questionType: string
}

export interface QuestionnaireState {
  currentStep: number
  answers: Answer[]
  isDraft: boolean
  completedAt?: string
}

export interface Questionnaire {
    id: string
    name: string
    description: string
    version: string
    target_roles: string
    active: boolean
    created_at: string
    updated_at: string
}