import React from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/store'
import { LanguageToggle } from '@shared/components/language-toggle.component'
import { useTranslation } from 'react-i18next'
import { ROUTES } from 'router/router.enum'

interface MainLayoutProps {
  children: React.ReactNode
  mainStyle?: React.CSSProperties
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, mainStyle }) => {
  const { t } = useTranslation()
  const isAuth = useAuthStore(state => state.isAuth)
  const user = useAuthStore(state => state.user)
  const navigate = useNavigate()
  const logout = useAuthStore(state => state.logout)

  const backToHomeNavigate = () => {
    navigate(ROUTES.HOME)
  }

  const navigateToRooms = () => {
    navigate(ROUTES.ROOMS_DASHBOARD)
  }

  const navigateToDbAdminDashboard = () => {
    navigate(ROUTES.DB_ADMIN_DASHBOARD)
  }

  const navigateToSystemAdminDashboard = () => {
    navigate(ROUTES.SYSTEM_ADMIN_DASHBOARD)
  }

  const navigateToPlatformAdminDashboard = () => {
    navigate(ROUTES.PLATFORM_ADMIN)
  }

  return (
    <Container>
      <Header>
        <NavSection>
          <Logo onClick={backToHomeNavigate}>APZ</Logo>
          <NavItem onClick={navigateToRooms}>Rooms</NavItem>
          {user?.roles.some(el => el.value === 'DATABASE_ADMIN') && (
            <NavItem onClick={navigateToDbAdminDashboard}>Database admin dashboard</NavItem>
          )}
          {user?.roles.some(el => el.value === 'SYSTEM_ADMIN') && (
            <NavItem onClick={navigateToSystemAdminDashboard}>System admin dashboard</NavItem>
          )}
          {user?.roles.some(el => el.value === 'PLATFORM_ADMIN') && (
            <NavItem onClick={navigateToPlatformAdminDashboard}>Platform admin dashboard</NavItem>
          )}
        </NavSection>
        {!isAuth ? (
          <AuthButtons>
            <StyledLink to="/login">{t('login')}</StyledLink>
            <StyledLink to="/register">{t('sign-up')}</StyledLink>
            <LanguageToggle />
          </AuthButtons>
        ) : (
          <UserSection>
            <Username>{user?.username}</Username>
            <LogoutButton onClick={logout}>{t('logout')}</LogoutButton>
            <LanguageToggle />
          </UserSection>
        )}
      </Header>
      <Main style={mainStyle}>{children}</Main>
    </Container>
  )
}

export default MainLayout

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1e1e1e;
  color: #fff;
`

const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;

  &:hover {
    cursor: pointer;
  }
`

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`

const StyledLink = styled(Link)`
  padding: 0.5rem 1rem;
  color: #fff;
  background-color: #3a3a3a;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #555;
  }
`

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #f5f5f5;
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const NavItem = styled.div`
  font-size: 1.2rem;
  margin: 0;

  &:hover {
    cursor: pointer;
  }
`

const Username = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: #cfcfcf;
`

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #ff5252;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e64545;
  }
`
