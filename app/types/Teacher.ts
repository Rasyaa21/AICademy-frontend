export interface Teacher {
    id: string
    user_id: string
    fullname: string
    email: string
    role: string
    status: 'active' | 'inactive'
    profile_picture?: string
    created_at: string
}