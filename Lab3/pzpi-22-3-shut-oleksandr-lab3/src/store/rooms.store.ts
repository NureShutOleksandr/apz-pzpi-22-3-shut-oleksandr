import $api from '@api/api.config'
import { create } from 'zustand'
import type { CreateRoomDto, Room, RoomAnalysis } from '~types/room.type'
import { ErrorHandle } from '@utils/error-handler'
import { ToastSuccess } from '@utils/toast.config'
import { persist } from 'zustand/middleware'

type RoomStoreState = {
  rooms: Room[] | null
  setRooms: (rooms: Room[] | null) => void
  createRoom: (credentials: CreateRoomDto) => Promise<Room>
  getRooms: (userId: string | undefined) => Promise<void>

  roomStatistic: RoomAnalysis | null
  analyzeRoom: (roomId: string | undefined, userId: string | undefined) => Promise<void>
  deleteRoom: (roomId: string | undefined) => Promise<void>
}

export const useRoomStore = create<RoomStoreState>()(
  persist(
    (set, get) => ({
      rooms: null,
      roomStatistic: null,
      setRooms: rooms => set({ rooms }),
      createRoom: async (credentials: CreateRoomDto) => {
        try {
          const { data: room } = await $api.post<Room>('/rooms', credentials)

          set(state => ({
            rooms: state.rooms ? [room, ...state.rooms] : [room],
          }))

          ToastSuccess('Room has created')
          return room
        } catch (error) {
          ErrorHandle(error, 'Creating room has failed')
          throw error
        }
      },
      getRooms: async (userId: string | undefined) => {
        try {
          if (!userId) throw Error('userId for getRooms possibly undefined')
          const { data: rooms } = await $api.get<Room[]>(`/rooms/all-rooms-by-user/${userId}`)
          set({ rooms })
        } catch (error) {
          ErrorHandle(error, 'Fetch rooms failed')
        }
      },
      analyzeRoom: async (roomId: string | undefined, userId: string | undefined) => {
        try {
          if (!roomId) throw Error('roomId for get analyze room possibly undefined')
          const { data: roomStatistic } = await $api.get<RoomAnalysis>(`/rooms/${roomId}/analyze`)
          set({ roomStatistic })
          const state = get()

          await state.getRooms(userId)
        } catch (error) {
          ErrorHandle(error, 'Fetch rooms failed')
        }
      },
      deleteRoom: async (roomId: string | undefined) => {
        try {
          if (!roomId) throw Error('roomId for deleteRoom possibly undefined')

          await $api.delete(`/rooms/${roomId}`)

          set(state => ({
            rooms: state.rooms ? state.rooms.filter(room => room._id.toString() !== roomId) : null,
          }))

          ToastSuccess('Room has been deleted')
        } catch (error) {
          ErrorHandle(error, 'Deleting room has failed')
          throw error
        }
      },
    }),
    { name: 'rooms-storage' },
  ),
)
