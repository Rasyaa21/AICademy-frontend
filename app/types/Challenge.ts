export interface Challenge {
    id: string
    title: string
    description: string
    deadline: string
    prize: string | null
    max_participants: number
    current_participants: number
    winner_team_id: string | null
    created_by_admin_id: string | null
    created_by_teacher_id: string | null
    created_at: string
    updated_at: string
    submissions?: ChallengeSubmission[]
}

export interface ChallengeSubmission {
    id: string
    challenge_id: string
    title: string
    team_id: string
    student_profile_id: string | null
    image_url: string | null
    repo_url: string
    docs_url: string
    submitted_at: string
    points: number
    scored_by_admin_id: string | null
    scored_by_teacher_id: string | null
    scored_at: string | null
    team?: Team
}

export interface Team {
    id: string
    team_name: string
    about: string
    team_profile_picture: string | null
    created_by_student_profile_id: string
    created_at: string
    members: TeamMember[]
}

export interface TeamMember {
    team_id: string
    student_profile_id: string
    member_role: string
    profiling_role_id: string | null
    joined_at: string
    full_name?: string
    nis?: string
}

export interface ChallengeStats {
    total: number
    active: number
    completed: number
}

export interface ChallengeFilters {
    searchQuery: string
    selectedOrganizer: string
    selectedStatus: string
}