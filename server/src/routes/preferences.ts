import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'


export async function preferencesRoutes(app: FastifyInstance) {

    app.get('/preferences', async () => {
        const preferences = await prisma.preferences.findMany({
            orderBy: {
                id: 'asc',
            },
        })
        return preferences
    })



    app.post('/preferences', async (request) => {
        const bodySchema = z.object({
            icon: z.string(),
            title: z.string()
        })
        const { icon, title } = bodySchema.parse(request.body)

        const preferences = await prisma.preferences.create({
            data: {
                icon, title
            }
        })

        return preferences
    })



    app.put('/preferences', async () => {

    })

    app.delete('/preferences', async () => {

    })

}