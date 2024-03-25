import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { comparePassword } from '../hash'
import { generateToken } from '../token'

const login = Router()
const prisma = new PrismaClient()

login.post('/', async (req: Request, res: Response) => {
    const { username, password, remember } = req.body
    try {
        const user: any = await prisma.user.findUnique({
            where: { username: username }
        })

        if (!user) {
            return res.status(403).json({ success: false, message: 'user not found!' })
        }

        const compare = await comparePassword(password, user.password)
        if (!compare) {
            return res.status(403).json({ success: false, message: 'incorrect password!' })
        }

        const token = generateToken(user.id, remember)

        return res.json({ success: true, token, message: 'logged in', remember })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message })
    }
})

export default login