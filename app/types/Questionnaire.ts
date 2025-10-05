export interface QuestionOption {
  label: string
  value: string
  score: number
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
  options?: QuestionOption[]
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
  id: string
  name: string
  version: number
  questions: Question[]
  instruction?: string
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

// Result interfaces
export interface RecommendedRole {
  role_id: string
  role_name: string
  description: string
  category: string
  score: number
  justification: string
}

export interface Recommendation {
  role_id: string
  role_name: string
  score: number
  justification: string
  category: string
  description?: string
}

export interface QuestionnaireResult {
  id: string
  questionnaire_id: string
  student_id: string
  submitted_at: string
  total_score: number
  max_score: number
  recommended_role: RecommendedRole
  recommendations?: Recommendation[]
  status: string
}