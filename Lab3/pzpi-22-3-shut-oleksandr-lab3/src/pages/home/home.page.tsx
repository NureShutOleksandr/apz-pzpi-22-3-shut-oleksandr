import React from 'react'
import { useTranslation } from 'react-i18next'
import type { ResourcesType } from '~types/i18n.type'
import { Button } from './home.style'

export const Home: React.FC = () => {
  const [count, setCount] = React.useState(0)
  const { i18n, t } = useTranslation()

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value as ResourcesType)
  }

  function increment() {
    setCount(prev => prev + 1)
  }

  return (
    <>
      <Button onClick={increment}>
        {t('button')} with number count: {count}
      </Button>
      <select onChange={handleLanguageChange} value={i18n.language as ResourcesType}>
        <option value="en">EN</option>
        <option value="ua">UA</option>
      </select>
    </>
  )
}
