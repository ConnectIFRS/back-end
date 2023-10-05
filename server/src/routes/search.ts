import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function searchRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.post('/search', async (request, reply) => {
        const { sub: userId } = request.user;
        const paramsSchema = z.object({
            userName: z.string()
        })
        const { userName } = paramsSchema.parse(request.body);

        const users = await prisma.users.findMany({
            where: {
                name: {
                    contains: userName
                }
            }, select: {
                className: true,
                name: true,
                profilePic: true,
                id: true,
                Followers: {
                    select: {
                        userId: true
                    }
                }
            }
        })
        
        return users.map((user) => {
            const followedByUser = user.Followers.some((follower) => follower.userId === userId);

          return {
            id: user.id,
            profilePic: user.profilePic,
            name: user.name.length >=30 ? user.name.substring(0, 30).concat('...') : user.name,
            userClass: user.className.className.length >=30 ? user.className.className.substring(0, 30).concat('...') : user.className.className,
            followedByUser
          }
        })
    })

    app.post('/search/followers/:id', async (request, reply) => {
        const { sub: userId } = request.user;
        const paramsSchema = z.object({
            id: z.string().uuid(),
          })
      
          const { id } = paramsSchema.parse(request.params)
      
        const bodySchema = z.object({
            userName: z.string()
        })
        const { userName } = bodySchema.parse(request.body);

        const users = await prisma.followers.findMany({
            where: {
                followerId: id,
                user: {
                    name: {
                        contains: userName
                    }
                }
              }, select: {
                user: {
                    select: {
                        className: true,
                        name: true,
                        profilePic: true,
                        id: true,
                        Followers: {
                            select: {
                                userId: true
                            }
                        }
                    }
                }
            }
        })
        
        return users.map((user) => {
            const followedByUser = user.user.Followers.some((follower) => follower.userId === userId);

          return {
            id: user.user.id,
            profilePic: user.user.profilePic,
            name: user.user.name.length >=38 ? user.user.name.substring(0, 38).concat('...') : user.user.name,
            userClass: user.user.className.className.length >=38 ? user.user.className.className.substring(0, 38).concat('...') : user.user.className.className,
            followedByUser
          }
        })
    })

    app.post('/search/following/:id', async (request, reply) => {
        const { sub: userId } = request.user;
        const paramsSchema = z.object({
            id: z.string().uuid(),
          })
      
          const { id } = paramsSchema.parse(request.params)
      
        const bodySchema = z.object({
            userName: z.string()
        })
        const { userName } = bodySchema.parse(request.body);

        const users = await prisma.followers.findMany({
            where: {
                userId: id,
                user: {
                    name: {
                        contains: userName
                    }
                }
              }, select: {
                follower: {
                    select: {
                        className: true,
                        name: true,
                        profilePic: true,
                        id: true,
                        Followers: {
                            select: {
                                userId: true
                            }
                        }
                    }
                }
            }
        })
        
        return users.map((user) => {
            const followedByUser = user.follower.Followers.some((follower) => follower.userId === userId);

          return {
            id: user.follower.id,
            profilePic: user.follower.profilePic,
            name: user.follower.name.length >=38 ? user.follower.name.substring(0, 38).concat('...') : user.follower.name,
            userClass: user.follower.className.className.length >=38 ? user.follower.className.className.substring(0, 38).concat('...') : user.follower.className.className,
            followedByUser
          }
        })
    })
}
