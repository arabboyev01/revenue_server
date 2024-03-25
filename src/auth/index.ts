import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { AuthRequest } from '../global/global.s'
import { JwtPayload } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function auth(req: AuthRequest, res: Response, next: NextFunction) {
    const token: string = req.header('Authorization') as string

    if (!token) {
        return res.status(403).json({ success: false, message: 'Unauthorized - No token provided' })
    }

    try {
        const jwtSecret = process.env.JWT_SIGN || 'secret'
        const decoded: JwtPayload  = jwt.verify(token, jwtSecret) as JwtPayload
        const user = await prisma.user.findUnique({
            where: { id: decoded.user_id }
        })

        if (!user) return res.status(403).json({ success: false, message: 'Unauthorized - User not found' })

        req.user = user
        req.isAdmin = user.role === 'admin'
        req.isStaff = user.role === 'staff'

        next()
    } catch (error: unknown) {
        res.status(500).json({ success: false, message: (error as Error).message })
    }
}
export { auth }