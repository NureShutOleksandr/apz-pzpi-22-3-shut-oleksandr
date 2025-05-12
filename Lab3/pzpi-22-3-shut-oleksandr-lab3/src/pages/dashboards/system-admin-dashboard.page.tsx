import React, { useState } from 'react'
import MainLayout from '@shared/layouts/main.layout'
import styled from 'styled-components'
import { useSystemAdminStore } from '@store/systemAdmin.store'
import { configExample } from '@shared/consts/config-example.const'
import { useTranslation } from 'react-i18next'

export const SystemAdminDashboard: React.FC = () => {
  const { lastExportedConfig, isExporting, isImporting, exportConfig, importConfig } = useSystemAdminStore()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [importConfigData, setImportConfigData] = useState<any[]>(configExample)
  const { t } = useTranslation()

  const handleExportConfig = async () => {
    try {
      const blob = await exportConfig()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'climate-config.json')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export config:', error)
    }
  }

  const handleImportConfig = async () => {
    try {
      await importConfig(importConfigData)
    } catch (error) {
      console.error('Failed to import config:', error)
    }
  }

  return (
    <MainLayout mainStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 0' }}>
      <DashboardContainer>
        <Header>
          <Title>{t('systemAdminDashboard.title')}</Title>
        </Header>
        <ActionsList>
          <ActionItem>
            <ActionLabel>{t('systemAdminDashboard.exportConfiguration')}</ActionLabel>
            <ExportButton onClick={handleExportConfig} disabled={isExporting}>
              {isExporting ? t('systemAdminDashboard.exporting') : t('systemAdminDashboard.exportButton')}
            </ExportButton>
            {lastExportedConfig && (
              <ConfigPreview>
                <ConfigLabel>{t('systemAdminDashboard.lastExportedConfig')}</ConfigLabel>
                <pre>{JSON.stringify(lastExportedConfig, null, 2)}</pre>
              </ConfigPreview>
            )}
          </ActionItem>
          <ActionItem>
            <ActionLabel>{t('systemAdminDashboard.importConfiguration')}</ActionLabel>
            <ImportInput
              value={JSON.stringify(importConfigData, null, 2)}
              onChange={e => setImportConfigData(JSON.parse(e.target.value))}
              placeholder={t('systemAdminDashboard.pasteConfigJson')}
              disabled={isImporting}
            />
            <ImportButton onClick={handleImportConfig} disabled={isImporting}>
              {isImporting ? t('systemAdminDashboard.importing') : t('systemAdminDashboard.importButton')}
            </ImportButton>
          </ActionItem>
        </ActionsList>
      </DashboardContainer>
    </MainLayout>
  )
}

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`

const Header = styled.div`
  margin-bottom: 1.5rem;
`

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`

const ActionsList = styled.ul`
  list-style: none;
  padding: 0;
`

const ActionItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`

const ActionLabel = styled.h3`
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`

const ExportButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #357abd;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
  }

  &:disabled {
    background-color: #a3bffa;
    cursor: not-allowed;
  }
`

const ImportButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #27ae60;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.3);
  }

  &:disabled {
    background-color: #a3d9b1;
    cursor: not-allowed;
  }
`

const ImportInput = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  width: 100%;
  min-height: 150px;
  resize: vertical;

  &:focus {
    border-color: #4a90e2;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #999;
  }
`

const ConfigPreview = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  overflow-x: auto;
`

const ConfigLabel = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #7f8c8d;
`
