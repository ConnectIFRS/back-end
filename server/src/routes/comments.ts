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
  app.post('/comments/:postId', async (request, reply) => {
    const { sub: userId } = request.user
    const paramsSchema = z.object({
      postId: z.string().uuid(),
    })

    const { postId } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
    })

    const { content } = bodySchema.parse(request.body)

    const comment = await prisma.comments.create({
      data: {
        content,
        postId,
        userId
      }
    })
    if (comment) {
      const comments = await prisma.comments.findMany({
        where: {
          postId
        }, select: {
          content: true,
          createdAt: true,
          user: true
        }
      })
      return comments
    } else {
      reply.status(409).send('Impossible to create a comment')
    }
  })
}