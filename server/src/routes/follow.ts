import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function followRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })
    app.post('/follow', async (request, reply) => {
        const { sub: userId } = request.user

        const bodySchema = z.object({
            toFollow: z.string(),
          })
      
          const { toFollow } = bodySchema.parse(request.body)

          const isFollowing = await prisma.followers.findFirst({
            where: {
                followerId: toFollow,
                userId
            }
          })

          if (!isFollowing) {
            await prisma.followers.create({
                data: {
                    followerId: toFollow,
                    userId
                }
            })
          } else {
            await prisma.followers.delete({
                where: {
                    id: isFollowing.id
                }
            })
          }

          const userFollowers = await prisma.users.findFirst({
            where: {
                id: toFollow
            }, include: {
                Followers: {
                    select: {
                        userId: true
                    }
                }
            }
          })

          const followedByUser = userFollowers?.Followers.some((follower) => follower.userId === userId);

          return {
            followers: userFollowers?.Followers.length,
            followedByUser
          }
      
    })
}