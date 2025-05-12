import React, { useEffect, useState } from 'react'
import MainLayout from '@shared/layouts/main.layout'
import styled from 'styled-components'
import { usePlatformAdminStore } from '@store/platformAdmin.store'
import { useAuthStore } from '@store/store'
import { useTranslation } from 'react-i18next'

export const PlatformAdminDashboard: React.FC = () => {
  const { roles, isLoadingRoles, isUpdatingRole, getRoles, updateUserRole } = usePlatformAdminStore()
  const { user: currentUser, setUser, users, getUsers } = useAuthStore()
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getRoles()
        await getUsers()
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
  }, [getRoles, getUsers])

  const handleUpdateRole = async () => {
    if (!selectedUserId || !selectedRole) {
      alert('Please select a user and a role')
      return
    }
    try {
      const updatedUser = await updateUserRole(selectedUserId, selectedRole)
      await getUsers()
      if (currentUser?._id === updatedUser._id) {
        setUser(updatedUser)
      }
      setSelectedUserId('')
      setSelectedRole('')
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId)
  }

  const filteredUsers = users?.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())) || []

  return (
    <MainLayout mainStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 0' }}>
      <DashboardContainer>
        <Header>
          <Title>{t('platformAdminDashboard.title')}</Title>
        </Header>
        <ActionsList>
          <ActionItem>
            <ActionLabel>{t('platformAdminDashboard.updateUserRole')}</ActionLabel>
            {isLoadingRoles ? (
              <LoadingText>{t('platformAdminDashboard.loadingRoles')}</LoadingText>
            ) : (
              <>
                <SelectContainer>
                  <SelectedUserText>
                    {selectedUserId
                      ? t('platformAdminDashboard.selectedUser', {
                          username: users?.find(u => u._id === selectedUserId)?.username || 'Unknown',
                        })
                      : t('platformAdminDashboard.noUserSelected')}
                  </SelectedUserText>
                  <Select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                    disabled={isUpdatingRole}
                  >
                    <option value="">{t('platformAdminDashboard.selectRole')}</option>
                    {roles?.map(role => (
                      <option key={role._id} value={role.value}>
                        {role.value} ({role.description})
                      </option>
                    ))}
                  </Select>
                </SelectContainer>
                <UpdateButton onClick={handleUpdateRole} disabled={isUpdatingRole}>
                  {isUpdatingRole ? t('platformAdminDashboard.updating') : t('platformAdminDashboard.updateRoleButton')}
                </UpdateButton>
              </>
            )}
          </ActionItem>
          <ActionItem>
            <ActionLabel>{t('platformAdminDashboard.userList')}</ActionLabel>
            <SearchInput
              type="text"
              placeholder={t('platformAdminDashboard.searchUsers')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <UserList>
              {filteredUsers.map(user => (
                <UserItem
                  key={user._id}
                  onClick={() => handleSelectUser(user._id)}
                  isSelected={user._id === selectedUserId}
                >
                  {user.username} - {user.roles.map(r => r.value).join(', ')}
                </UserItem>
              ))}
            </UserList>
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

const SelectContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
`

const SelectedUserText = styled.p`
  font-size: 1rem;
  color: #2c3e50;
  margin: 0;
`

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  width: 100%;
  max-width: 300px;

  &:focus {
    border-color: #4a90e2;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`

const UpdateButton = styled.button`
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

const LoadingText = styled.p`
  font-size: 1rem;
  color: #7f8c8d;
`

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  width: 100%;
  margin-bottom: 1rem;

  &:focus {
    border-color: #4a90e2;
  }
`

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
`

const UserItem = styled.li<{ isSelected: boolean }>`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  color: #2c3e50;
  cursor: pointer;
  background-color: ${props => (props.isSelected ? '#e6f0fa' : 'transparent')};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f0f0f0;
  }
`
