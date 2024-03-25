import { Router, Request, Response } from 'express'
import { hashingPassword } from '../hash'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const signUp = Router()

signUp.post('/', async (req: Request, res: Response) => {
    try {
        const { username, email, password, role, fullName } = req.body
        const hash = await hashingPassword(password)

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hash,
                role,
                fullName
            }
        })

        if (!user) return res.status(403).json({ success: false, message: 'user did not create' })

        const jwt_secret: string = process.env.jwt_sign as string
        const token = jwt.sign({ user_id: user.id }, jwt_secret, { expiresIn: '1h' })

        return res.status(201).json({ success: true, token: token, message: 'user created' })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message })
    }
})

export default signUp