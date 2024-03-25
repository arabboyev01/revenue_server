import { Response, Router } from "express"
import { auth } from "../../auth"
import { AuthRequest } from "../../global/global.s"
import { PrismaClient } from "@prisma/client"
import { DateTime } from 'luxon'

const prisma = new PrismaClient()
const revenues = Router()

class RevenueController {
    async createRevenue(req: AuthRequest, res: Response) {
        try {
            const { managerName, pointAddress, revenuePerDay, } = req.body

            if (!req.isStaff) return res.status(403).json({ success: false, message: "Please provide a stuff user" })

            const newRevenues = await prisma.revenue.create({
                data: {
                    managerName,
                    pointAddress,
                    revenuePerDay: Number(revenuePerDay),
                    menegerId: Number(req?.user?.id)
                }
            })
            return res.json({ success: true, data: newRevenues })
        } catch (error) {
            return res.status(500).json({ success: false, error: "Unable to create revenues" })
        }
    }

    async getRevenues(req: AuthRequest, res: Response) {
        try {
            if (req.isStaff) {
                const revenues = await prisma.revenue.findMany({
                    where: {
                        menegerId: Number(req?.user?.id)
                    }
                })
                return res.json({ success: true, data: revenues })
            }

            if (req.isAdmin) {
                const revenues = await prisma.revenue.findMany()
                return res.json({ success: true, data: revenues })
            }

            return res.status(403).json({ success: false, message: "unaviable user" })
        } catch (error) {
            res.status(500).json({ error: "Unable to retrieve revenues categories" })
        }
    }

    async getRevenueById(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id)
            const revenues = await prisma.revenue.findUnique({
                where: { id }
            });
            if (!revenues) {
                return res.status(404).json({ success: false, error: "Plants category not found" })
            }
            return res.json({ success: true, data: revenues })
        } catch (error) {
            return res.status(500).json({ success: false, error: "Unable to get revenues" })
        }
    }

    async updateRevenue(req: AuthRequest, res: Response) {
        try {

            const id = parseInt(req.params.id)
            const { managerName, pointAddress, revenuePerDay, } = req.body

            if (!req.isStaff) return res.status(403).json({ success: false, message: "Please provide a stuff user" })

            const existingRevenue = await prisma.revenue.findUnique({
                where: { id },
            })

            if (!existingRevenue) {
                return res.status(404).json({ success: false, message: "Revenue record not found" })
            }

            const createdAt = existingRevenue.createdAt

            const now = DateTime.now()
            const createdDate = DateTime.fromJSDate(createdAt)
            const diffInDays = now.diff(createdDate, 'days').days

            if (diffInDays > 30) {
                return res.status(403).json({ success: false, message: "Cannot update revenue, created date is more than a month old" })
            }

            const updateRevenue = await prisma.revenue.update({
                where: { id },
                data: {
                    managerName,
                    pointAddress,
                    revenuePerDay: Number(revenuePerDay),
                    menegerId: Number(req?.user?.id)
                }
            })

            return res.json({ success: true, data: updateRevenue, message: "Revenue updated" })
        } catch (error) {
            return res.status(500).json({ success: false, error: "Unable to create revenues" })
        }
    }

    async deleteRevenue(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id)
            await prisma.revenue.delete({
                where: { id }
            })
            return res.json({ success: true, message: "Revenue deleted successfully" })
        } catch (error) {
            return res.status(500).json({ success: false, error: "Unable to revenue" })
        }
    }
}

const revenueController = new RevenueController()

revenues.post("/", auth, revenueController.createRevenue)
revenues.get("/", auth, revenueController.getRevenues)
revenues.get("/:id", revenueController.getRevenueById)
revenues.put("/:id", auth, revenueController.updateRevenue)
revenues.delete("/:id", auth, revenueController.deleteRevenue)

export default revenues