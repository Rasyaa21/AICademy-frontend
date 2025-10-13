export interface Roadmap {
    id: string;
    profiling_role_id: string;
    roadmap_name: string;
    description: string;
    status: 'draft' | 'active' | 'inactive';
    total_steps: number;
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface RoadmapStep {
    id: string;
    roadmap_id: string;
    step_order: number;
    title: string;
    description: string;
    learning_objectives: string;
    submission_guidelines: string;
    resource_links: string | string[]; // Could be JSON string or array
    estimated_duration: number;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    created_at: string;
    updated_at: string;
}

// Add Step interface for creation/editing (without backend-generated fields)
export interface Step {
    id?: string;
    title: string;
    description: string;
    learning_objectives?: string;
    submission_guidelines?: string;
    resource_links?: string | string[];
    estimated_duration: number;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    step_order?: number;
    roadmap_id?: string;
}

export interface RoadmapStats {
    total: number;
    active: number;
    inactive: number;
    draft: number;
}

export interface CreateRoadmapRequest {
    profiling_role_id: string;
    roadmap_name: string;
    description: string;
}

export interface UpdateRoadmapRequest {
    roadmap_name?: string;
    description?: string;
    status?: 'draft' | 'active' | 'inactive';
}

export interface CreateStepRequest {
    title: string;
    description: string;
    learning_objectives?: string;
    submission_guidelines?: string;
    resource_links?: string;
    estimated_duration: number;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
}

export interface UpdateStepRequest {
    title?: string;
    description?: string;
    learning_objectives?: string;
    submission_guidelines?: string;
    resource_links?: string;
    estimated_duration?: number;
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
}