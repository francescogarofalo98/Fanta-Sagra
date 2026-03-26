export type Participant = {
  id: number
  event_id: number
  name: string
  image_url: string | null
  cost_foglia: number
  is_active: boolean
  created_at: string
}

export type Event = {
  id: number
  name: string
  budget_foglia: number
  max_team_size: number
  market_open: boolean
  market_close_at: string | null
  created_at: string
}

export type Team = {
  id: number
  event_id: number
  user_id: string
  team_name: string
  spent_foglia: number
  remaining_foglia: number
  total_points: number
  created_at: string
}