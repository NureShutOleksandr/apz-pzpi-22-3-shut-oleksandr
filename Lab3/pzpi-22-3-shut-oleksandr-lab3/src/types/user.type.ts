interface Role {
  _id: string
  value: string
  description: string
  __v: number
}

export interface User {
  _id: string
  username: string
  password: string
  roles: Role[]
  notifications: string[]
  __v: number
}
