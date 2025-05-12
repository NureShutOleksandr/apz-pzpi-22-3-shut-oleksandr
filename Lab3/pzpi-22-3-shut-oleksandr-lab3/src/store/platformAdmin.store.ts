import $api from '@api/api.config'
import { ErrorHandle } from '@utils/error-handler'
import { ToastError, ToastSuccess } from '@utils/toast.config'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '~types/user.type'

interface Role {
  _id: string
  value: string
  description: string
  __v: number
}

type PlatformAdminStoreState = {
  roles: Role[] | null
  isLoadingRoles: boolean
  isUpdatingRole: boolean
  getRoles: () => Promise<void>
  updateUserRole: (userId: string, roleName: string) => Promise<User>
}

type UpdateUserRoleDto = {
  user_id: string
  role_name: string
}

export const usePlatformAdminStore = create<PlatformAdminStoreState>()(
  persist(
    set => ({
      roles: null,
      isLoadingRoles: false,
      isUpdatingRole: false,
      getRoles: async () => {
        set({ isLoadingRoles: true })
        try {
          const { data } = await $api.get<Role[]>('/roles')
          if (data) {
            set({ roles: data, isLoadingRoles: false })
          } else {
            set({ isLoadingRoles: false })
            ToastError('Failed to load roles')
            throw new Error('Failed to load roles')
          }
        } catch (error) {
          set({ isLoadingRoles: false })
          ErrorHandle(error, 'Get roles method failed')
          throw error
        }
      },
      updateUserRole: async (userId: string, roleName: string) => {
        set({ isUpdatingRole: true })
        try {
          const { data } = await $api.patch<User>('/roles/update-user-role', {
            user_id: userId,
            role_name: roleName,
          } as UpdateUserRoleDto)
          if (data) {
            set({ isUpdatingRole: false })
            ToastSuccess('User role updated successfully')
            return data
          } else {
            set({ isUpdatingRole: false })
            ToastError('Failed to update user role')
            throw new Error('Failed to update user role')
          }
        } catch (error) {
          set({ isUpdatingRole: false })
          ErrorHandle(error, 'Update user role method failed')
          throw error
        }
      },
    }),
    { name: 'platform-admin-storage' },
  ),
)
