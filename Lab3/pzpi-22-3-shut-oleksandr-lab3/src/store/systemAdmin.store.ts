/* eslint-disable @typescript-eslint/no-explicit-any */
import $api from '@api/api.config'
import { ErrorHandle } from '@utils/error-handler'
import { ToastError, ToastSuccess } from '@utils/toast.config'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SystemAdminStoreState = {
  lastExportedConfig: Record<any, any>[] | null
  isExporting: boolean
  isImporting: boolean
  exportConfig: () => Promise<Blob>
  importConfig: (config: any[]) => Promise<void>
}

type ExportConfigRes = Record<any, any>[]

type ImportConfigRes = {
  message: string
}

export const useSystemAdminStore = create<SystemAdminStoreState>()(
  persist(
    set => ({
      lastExportedConfig: null,
      isExporting: false,
      isImporting: false,
      exportConfig: async () => {
        set({ isExporting: true })
        try {
          const { data } = await $api.get<ExportConfigRes>('/config/export')
          if (data) {
            const jsonString = JSON.stringify(data, null, 2)
            const blob = new Blob([jsonString], { type: 'application/json' })
            set({ isExporting: false })
            ToastSuccess('Config exported successfully')
            return blob
          } else {
            set({ isExporting: false })
            ToastError('Config export failed')
            throw new Error('Config export failed')
          }
        } catch (error) {
          set({ isExporting: false })
          ErrorHandle(error, 'Config export method failed')
          throw error
        }
      },
      importConfig: async (config: any[]) => {
        set({ isImporting: true })
        try {
          const { data } = await $api.post<ImportConfigRes>('/config/import', config)

          if (data) {
            set({ isImporting: false, lastExportedConfig: config })
            ToastSuccess('Config imported successfully')
          } else {
            set({ isImporting: false })
            ToastError('Config import failed')
            throw new Error('Config import failed')
          }
        } catch (error) {
          set({ isImporting: false })
          ErrorHandle(error, 'Config import method failed')
          throw error
        }
      },
    }),
    { name: 'system-admin-storage' },
  ),
)
