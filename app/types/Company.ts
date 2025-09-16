export interface Company {
    id: string
    user_id: string
    company_name: string
    company_logo?: string
    company_location?: string
    description?: string
    email: string
    status: 'active' | 'inactive'
    created_at: string
}