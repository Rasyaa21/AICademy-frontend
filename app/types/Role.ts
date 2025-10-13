export interface Role {
    id: string
    name: string
    slug: string
    description: string
    type: 'system' | 'custom'
    status: 'active' | 'draft'
    users_count: number
    permissions: string[]
    created_at: string
    updated_at: string
}