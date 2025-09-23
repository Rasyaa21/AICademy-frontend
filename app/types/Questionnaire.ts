export interface QuestionOption {
  label: string
  value: string
}

export interface Question {
  question_text: string
  question_type: 'mcq' | 'likert' | 'case' | 'text'
  options?: QuestionOption[] | null
  category: string
  reasoning: string
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