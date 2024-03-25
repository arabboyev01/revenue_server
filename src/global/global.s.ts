import { Request } from "express"
import { UserType } from "./types"

interface AuthRequest extends Request {
    user?: UserType
    isAdmin?: string | boolean
    isStaff?: boolean
}

export { AuthRequest }