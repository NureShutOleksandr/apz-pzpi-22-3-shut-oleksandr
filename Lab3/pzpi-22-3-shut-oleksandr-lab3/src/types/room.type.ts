export interface RoomHistoryChange {
  temperature: number
  moisture: number
  carbonDioxide: number
  illumination: number
  updatedAt: Date
}

export interface Room {
  _id: string
  user: string
  roomName: string
  temperature: number
  moisture: number
  carbonDioxide: number
  illumination: number
  historyChanges: RoomHistoryChange[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateRoomDto {
  user: string
  roomName: string
  temperature: number
  moisture: number
  carbonDioxide: number
  illumination: number
}

export type RoomAnalysis = {
  analysis: {
    statistics: {
      temperature_mean: number
      temperature_median: number
      temperature_min: number
      temperature_max: number
      temperature_range: number
      moisture_mean: number
      moisture_median: number
      moisture_min: number
      moisture_max: number
      moisture_range: number
      carbonDioxide_mean: number
      carbonDioxide_median: number
      carbonDioxide_min: number
      carbonDioxide_max: number
      carbonDioxide_range: number
      illumination_mean: number
      illumination_median: number
      illumination_min: number
      illumination_max: number
      illumination_range: number
    }
    trends: string[]
    correlation: {
      'temperature-moisture': number
      'temperature-carbonDioxide': number
      'temperature-illumination': number
      'moisture-carbonDioxide': number
      'moisture-illumination': number
      'carbonDioxide-illumination': number
    }
    regression: string
    recommendations: string[]
  }
}
