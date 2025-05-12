import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './home.style'
import MainLayout from '@shared/layouts/main.layout'

export const Home: React.FC = () => {
  const { t } = useTranslation()

  return (
    <MainLayout mainStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Button>{t('button')} Home page</Button>
    </MainLayout>
  )
}
