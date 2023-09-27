import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function commentsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
   })
   app.get('/comments/:postId', async (request, reply) => {

    const paramsSchema = z.object({
      postId: z.string().uuid(),
    })

    const { postId } = paramsSchema.parse(request.params)

    const comments = await prisma.comments.findMany({
      where: {
        postId,
      }, include: {
        user: {
            select: {
                className: true,
                name: true,
                profilePic: true,
                id: true
            }
        }
      }
    })


    return comments.map((comment) => {
        return {
            id: comment.id,
            user: comment.user,
            content: comment.content,
            createdAt: comment.createdAt
        }
    })
  })
}