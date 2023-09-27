import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function postsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.get('/posts', async (request) => {
        const { sub: userId } = request.user
    
        const posts = await prisma.post.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
                select: {
                    className: true,
                    name: true,
                    profilePic: true
                }
            }
          }
        })
    
        return posts.map((post) => {
          return {
            id: post.id,
            coverUrl: post.coverUrl,
            content: post.content.substring(0, 115).concat('...'),
            createdAt: post.createdAt,
            user: post.user
          }
        })
      })

      app.get('/posts/:id', async (request, reply) => {
        const { sub: userId } = request.user
    
        const paramsSchema = z.object({
          id: z.string().uuid(),
        })
    
        const { id } = paramsSchema.parse(request.params)
    
        const post = await prisma.post.findUniqueOrThrow({
          where: {
            id,
          },
        })
    
        if (post.userId !== userId) {
          return reply.status(401).send()
        }
    
        return post
      })

      app.post('/posts', async (request) => {
        const { sub: userId } = request.user
    
        const bodySchema = z.object({
          content: z.string(),
          coverUrl: z.string(),
        })
    
        const { content, coverUrl } = bodySchema.parse(request.body)
    
        const post = await prisma.post.create({
          data: {
            content,
            coverUrl,
            userId,
          },
        })
    
        return post
      })

      app.put('/posts/:id', async (request, reply) => {
        const { sub: userId } = request.user
    
        const paramsSchema = z.object({
          id: z.string().uuid(),
        })
    
        const { id } = paramsSchema.parse(request.params)
    
        const bodySchema = z.object({
          content: z.string(),
          coverUrl: z.string(),
        })
    
        const { content, coverUrl } = bodySchema.parse(request.body)
    
        let post = await prisma.post.findUniqueOrThrow({
          where: {
            id,
          },
        })
    
        if (post.userId !== userId) {
          return reply.status(401).send()
        }
    
        post = await prisma.post.update({
          where: {
            id,
          },
          data: {
            content,
            coverUrl,
          },
        })
    
        return post
      })

      app.delete('/posts/:id', async (request, reply) => {
        const { sub: userId } = request.user
    
        const paramsSchema = z.object({
          id: z.string().uuid(),
        })
    
        const { id } = paramsSchema.parse(request.params)
    
        const post = await prisma.post.findUniqueOrThrow({
          where: {
            id,
          },
        })
    
        if (post.userId !== userId) {
          return reply.status(401).send()
        }
    
        await prisma.post.delete({
          where: {
            id,
          },
        })
      })
}