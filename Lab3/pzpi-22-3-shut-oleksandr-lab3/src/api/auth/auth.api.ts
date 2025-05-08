import $api from '@api/api.config'
import type { AxiosResponse } from 'axios'
import type { User } from '~types/user.type'

export const logout = async () => {
  await $api.post('/auth/logout')
}

export const authMe = async (): Promise<AxiosResponse<User>> => {
  return await $api.get('/auth/auth-me')
}

type LoginReqBody = { username: string; password: string }
type LoginResBody = { message: string; token: { accessToken: string } }

export const login = async ({ username, password }: LoginReqBody): Promise<AxiosResponse<LoginResBody>> => {
  return await $api.post<LoginResBody>('/auth/login', { username, password })
}
