import $api from '@api/api.config'
import { ErrorHandle } from '@utils/error-handler'
import { ToastError, ToastSuccess } from '@utils/toast.config'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DbAdminStoreState = {
  lastBackupPath: string | null
  isCreatingBackup: boolean
  isRestoringBackup: boolean
  createBackup: () => Promise<void>
  restoreBackup: (backupName: string) => Promise<void>
}

type BackupCreateRes = {
  message: string
  success: boolean
}

type BackupRestoreRes = {
  message: string
  success: boolean
}

export const useDbAdminStore = create<DbAdminStoreState>()(
  persist(
    set => ({
      lastBackupPath: null,
      isCreatingBackup: false,
      isRestoringBackup: false,
      createBackup: async () => {
        set({ isCreatingBackup: true })
        try {
          const { data } = await $api.post<BackupCreateRes>('/backup/create', {})

          if (data.success && data.message) {
            const path = data.message.split(`\\`)
            set({ lastBackupPath: path[path.length - 1], isCreatingBackup: false })
            ToastSuccess('Backup creation success')
          } else {
            set({ isCreatingBackup: false })
            ToastError('Backup creation failed')
            throw new Error('Backup creation failed')
          }
          set({ isCreatingBackup: false })
        } catch (error) {
          set({ isCreatingBackup: false })
          ErrorHandle(error, 'Backup creation method failed')
        }
      },
      restoreBackup: async (backupName: string) => {
        set({ isRestoringBackup: true })
        try {
          const { data } = await $api.post<BackupRestoreRes>('/backup/restore', { backupName })

          if (data.success) {
            set({ isRestoringBackup: false })
            ToastSuccess('Restore success')
          } else {
            set({ isRestoringBackup: false })
            ToastError('Restore failed')
            throw new Error('Restore failed')
          }
        } catch (error) {
          set({ isRestoringBackup: false })
          ErrorHandle(error, 'Restore failed')
          throw error
        }
      },
    }),
    { name: 'db-admin-storage' },
  ),
)
