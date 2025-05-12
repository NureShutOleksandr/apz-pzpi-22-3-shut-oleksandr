import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import MainLayout from '@shared/layouts/main.layout'
import { useAuthStore } from '@store/store'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from 'router/router.enum'

export const Home: React.FC = () => {
  const { t } = useTranslation()
  const isAuth = useAuthStore(state => state.isAuth)
  const navigate = useNavigate()

  const handleNavigateToRooms = () => {
    navigate(ROUTES.ROOMS_DASHBOARD)
  }

  const handleNavigateToAuth = () => {
    navigate(isAuth ? ROUTES.HOME : ROUTES.LOGIN)
  }

  return (
    <MainLayout mainStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <HomeContainer>
        <WelcomeTitle>{t('home.welcomeTitle')}</WelcomeTitle>
        <Description>{t('home.description')}</Description>
        <ButtonContainer>
          <Button onClick={handleNavigateToRooms}>{t('home.roomsButton')}</Button>
          {!isAuth && <Button onClick={handleNavigateToAuth}>{t('home.loginButton')}</Button>}
        </ButtonContainer>
      </HomeContainer>
    </MainLayout>
  )
}

export const Button = styled.button`
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

export const HomeContainer = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
`

export const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`

export const Description = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.5;
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`
