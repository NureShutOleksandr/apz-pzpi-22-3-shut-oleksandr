import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import type { ResourcesType } from '~types/i18n.type'

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation()

  const handleLanguageChange = (lang: ResourcesType) => {
    i18n.changeLanguage(lang)
  }

  return (
    <ToggleContainer>
      <ToggleButton $isActive={i18n.language === 'en'} onClick={() => handleLanguageChange('en')}>
        EN
      </ToggleButton>
      <ToggleButton $isActive={i18n.language === 'ua'} onClick={() => handleLanguageChange('ua')}>
        UA
      </ToggleButton>
    </ToggleContainer>
  )
}

const ToggleContainer = styled.div`
  display: flex;
  background-color: #2a2a2a;
  border-radius: 20px;
  padding: 2px;
`

const ToggleButton = styled.button<{ $isActive: boolean }>`
  padding: 6px 12px;
  border: none;
  background-color: ${({ $isActive }) => ($isActive ? '#4a90e2' : 'transparent')};
  color: ${({ $isActive }) => ($isActive ? '#fff' : '#ccc')};
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? '#4a90e2' : '#3a3a3a')};
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`
