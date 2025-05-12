import React, { useState } from 'react'
import MainLayout from '@shared/layouts/main.layout'
import styled from 'styled-components'
import { useDbAdminStore } from '@store/dbAdmin.store'
import { useTranslation } from 'react-i18next'

export const DbAdminDashboard: React.FC = () => {
  const { t } = useTranslation()
  const { lastBackupPath, isCreatingBackup, isRestoringBackup, createBackup, restoreBackup } = useDbAdminStore()
  const [backupName, setBackupName] = useState('')

  const handleCreateBackup = async () => {
    try {
      await createBackup()
    } catch (error) {
      console.error('Failed to create backup:', error)
    }
  }

  const handleRestoreBackup = async () => {
    if (!backupName) {
      alert('Please enter a backup name')
      return
    }
    try {
      await restoreBackup(backupName)
    } catch (error) {
      console.error('Failed to restore backup:', error)
    }
  }

  return (
    <MainLayout mainStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 0' }}>
      <DashboardContainer>
        <Header>
          <Title>{t('dbAdminDashboard.title')}</Title>
        </Header>
        <ActionsList>
          <ActionItem>
            <ActionLabel>{t('dbAdminDashboard.createBackup')}</ActionLabel>
            <CreateBackupButton onClick={handleCreateBackup} disabled={isCreatingBackup}>
              {isCreatingBackup ? t('dbAdminDashboard.creating') : t('dbAdminDashboard.createBackupButton')}
            </CreateBackupButton>
            {lastBackupPath && (
              <BackupPath>{t('dbAdminDashboard.lastBackupPath', { path: lastBackupPath })}</BackupPath>
            )}
          </ActionItem>
          <ActionItem>
            <ActionLabel>{t('dbAdminDashboard.restoreBackup')}</ActionLabel>
            <InputGroup>
              <RestoreInput
                type="text"
                value={backupName}
                onChange={e => setBackupName(e.target.value)}
                placeholder={t('dbAdminDashboard.enterBackupFolderName')}
                disabled={isRestoringBackup}
              />
              <RestoreButton onClick={handleRestoreBackup} disabled={isRestoringBackup}>
                {isRestoringBackup ? t('dbAdminDashboard.restoring') : t('dbAdminDashboard.restoreButton')}
              </RestoreButton>
            </InputGroup>
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

const CreateBackupButton = styled.button`
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

const RestoreButton = styled.button`
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

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`

const RestoreInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  flex: 1;

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

const BackupPath = styled.p`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
`
