import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import MainLayout from '@shared/layouts/main.layout'
import { ToastSuccess } from '@utils/toast.config'
import { ErrorHandle } from '@utils/error-handler'
import { useAuthStore } from '@store/store'

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore(state => state.login)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ username, password })

      navigate('/')
      ToastSuccess('Login success', { position: 'bottom-right' })
    } catch (e) {
      ErrorHandle(e, 'Error during login')
    }
  }

  return (
    <MainLayout mainStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Login</Title>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </LoginForm>
    </MainLayout>
  )
}

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`

const Title = styled.h2`
  margin: 0;
  text-align: center;
  color: #1e1e1e;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #3a3a3a;
  }
`

const Button = styled.button`
  padding: 0.75rem;
  background-color: #3a3a3a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #555;
  }
`
