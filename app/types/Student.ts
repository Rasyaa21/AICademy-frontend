export interface Student {
    id: string
    nis: string
    name: string
    username: string
    email: string
    class: string
    status: 'active' | 'inactive'
    created_at: string
}