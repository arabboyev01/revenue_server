import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { auth } from '../../auth'
import { AuthRequest } from '../../global/global.s'

const user = Router()
const prisma = new PrismaClient()

user.get('/', auth, async (req: AuthRequest, res: Response) => {
    try {

        if (req?.user) {
            const user = await prisma.user.findUnique({
                where: { username: req.user.username }
            })

            if (!user) {
                return res.status(500).json({ success: false, message: 'User not found' })
            }

            return res.status(200).json({ success: true, message: 'user successfully', data: user })
        }

    } catch (error: unknown) {
        return res.status(500).json({ success: false, message: (error as Error).message })
    }
})
export default user