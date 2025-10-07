export interface Challenge {
    id: string
    thumbnail_image: string
    title: string
    description: string
    organizer: string
    deadline: string
    prize: string | null
    participant: number
    winner_team_id: string | null
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