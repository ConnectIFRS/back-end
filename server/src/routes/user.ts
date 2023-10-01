import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function userRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.get('/users/:id', async (request, reply) => {
        const { sub: userId } = request.user;
        const paramsSchema = z.object({
            id: z.string().uuid() 
        })
        const { id } = paramsSchema.parse(request.params)
        console.log(id)
        const user = await prisma.users.findUniqueOrThrow({
            select: {
                className: true,
                Post: {
                    select: {
                        id: true,
                        coverUrl: true
                    }
                },
                name: true,
                Followers: {
                    select: {
                        userId: true
                    }
                },
                Following: {
                    select: {
                        id: true
                    }
                },
                id: true,
                Preferences: true,
                profilePic: true,
                description: true
            },
            where: {
              id,
            }
        })
        const followedByUser = user.Followers.some((follower) => follower.userId === userId);
        return {
            id: user.id,
            preferences: user.Preferences,
            profilePic: user.profilePic,
            followers: user.Followers.length,
            following: user.Following.length,
            name: user.name,
            posts: user.Post,
            className: user.className,
            description: user.description,
            followedByUser
        }
    })
    app.put('/users/:id', async (request, reply) => {
        const { sub: userId } = request.user

        const paramsSchema = z.object({
            id: z.string().uuid() 
        })

        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            name: z.string(),
            profilePic: z.string().optional(),
            description: z.string()
        })

        const { name, profilePic, description } = bodySchema.parse(request.body)


        let user = await prisma.users.findUniqueOrThrow({
            where: {
              id,
            }, include: {
                className: true
            }
        })

        if (userId !== id) {
        return reply.status(401).send()
        }
        user = await prisma.users.update({
            include: {
                className: true
            },
            where: {
                id
            },
            data: profilePic ? {
                name,
                profilePic,
                description
            } : {
                name,
                description
            }
        })
        const token = app.jwt.sign(
            {
                name: user.name,
                className: user.className.className,
                createdAt: user.createdAt,
                profilePic: user.profilePic
            },
            {
                sub: user.id,
                expiresIn: '15 days'
            }
        )
        return {token}
    });

    app.delete('/users/:id', async (request, reply) => {
        const { sub: userId } = request.user

        const paramsSchema = z.object({
          id: z.string().uuid(),
        })
    
        const { id } = paramsSchema.parse(request.params)

        const user = await prisma.users.findUniqueOrThrow({
            where: {
                id
            }
        })

        if (userId !== id) {
            return reply.status(401).send()
        }

        await prisma.users.delete({
            where: {
                id
            }
        })
    })
}