export interface UserType {
    id: number
    username: string
    email: string
    password: string
    createdAt: Date
    fullName: string
    role: UserRole
}

type UserRole = 'admin' | 'staff'