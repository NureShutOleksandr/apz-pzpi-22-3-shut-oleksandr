import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './home.style'
import MainLayout from '@shared/layouts/main.layout'
import { useNavigate } from 'react-router-dom'

export const Home: React.FC = () => {
  const [count, setCount] = React.useState(0)
  const { t } = useTranslation()
  const navigate = useNavigate()

  function increment() {
    setCount(prev => prev + 1)
  }

  const handleNavigate = () => {
    navigate('/rooms-dashboard')
  }

  return (
    <MainLayout mainStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Button onClick={increment}>
        {t('button')} with count of labs that done: {count}
      </Button>
      <Button onClick={handleNavigate}>{t('button')} rooms</Button>
    </MainLayout>
  )
}
