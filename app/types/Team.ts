export interface Team {
    id: string
    team_name: string
    about?: string | null
    team_profile_picture?: string | null
    created_by_student_name: string // Diganti dari student_profile_id ke string nama
    created_at: string
    member_count?: number 
}