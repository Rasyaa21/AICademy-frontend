export interface StudentProfile {
    nis: string
    fullname: string
    class: string
    profile_picture: string | null
    headline: string | null
    bio: string | null
    projects: Project[]
    certifications: Certification[]
    profile_url: string
    joined_at: string
    last_active: string
    recommended_role: RecommendedRole | null
    show_email: boolean
    show_cv: boolean
    is_public_profile: boolean
}

export interface Project {
    id: string
    project_name: string
    description: string
    link_url: string
    start_date: string
    end_date: string
    created_at: string
    photo_count?: number
    is_completed?: boolean
    photos?: ProjectPhoto[]
}

export interface ProjectPhoto {
    id: string
    project_id: string
    url: string
    caption: string | null
    is_primary: boolean
    created_at: string
}

export interface Certification {
    id: string
    name: string
    issuing_organization: string
    issue_date: string
    expiration_date: string
    credential_id: string
    credential_url: string
    is_expired: boolean
    is_expiring_soon: boolean
    created_at: string
    photos?: CertificationPhoto[]
}

export interface CertificationPhoto {
    id: string
    certification_id: string
    url: string
    caption: string | null
    is_primary: boolean
    created_at: string
}

export interface RecommendedRole {
    role_id: string
    role_name: string
    role_description: string
    role_category: string
    score: number
    justification: string
}

export interface CreateProjectRequest {
    project_name: string
    description: string
    link_url: string
    start_date: string
    end_date: string
}

export interface UpdateProjectRequest {
    project_name?: string
    description?: string
    link_url?: string
    start_date?: string
    end_date?: string
}

export interface CreateCertificationRequest {
    name: string
    issuing_organization: string
    issue_date: string
    expiration_date: string
    credential_id: string
    credential_url: string
}