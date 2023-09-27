import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function likesRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
   })

   app.get('/likes/:postId', async (request, reply) => {

    const paramsSchema = z.object({
      postId: z.string().uuid(),
    })

    const { postId } = paramsSchema.parse(request.params)

    const likes = await prisma.likes.findMany({
      where: {
        postId,
      }
    })


    return likes
  })

  app.post('/likes', async (request) => {
    const { sub: userId } = request.user

    const bodySchema = z.object({
      postId: z.string(),
    })

    const { postId } = bodySchema.parse(request.body)

    const like = await prisma.likes.create({
      data: {
        userId,
        postId
      },
    })

    return like
  })
}