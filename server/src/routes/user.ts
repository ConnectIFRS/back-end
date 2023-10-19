import { hash } from "bcrypt";
import { randomInt } from "crypto";
import { FastifyInstance } from "fastify";
import { unlink } from "fs";
import { resolve } from "path";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function userRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.get('/user/:id', async (request, reply) => {
        const { sub: userId } = request.user;
        const paramsSchema = z.object({
            id: z.string().uuid() 
        })
        const { id } = paramsSchema.parse(request.params)
        if (id === userId) {
            const user = await prisma.users.findUniqueOrThrow({
                select: {
                    name: true,
                    id: true,
                    Preferences: true,
                    profilePic: true,
                    description: true,
                    classId: true,
                },
                where: {
                  id,
                }
            })
            return {
                id: user.id,
                preferences: user.Preferences,
                profilePic: user.profilePic,
                name: user.name,
                classId: user.classId,
                description: user.description,
            }
        } else {
            return reply.status(401).send("Para ter acesso a este endpoint você deve passar o seu id de usuário como parâmetro!")
        }
    })

    app.get('/users/:id', async (request, reply) => {
        const { sub: userId } = request.user;
        const paramsSchema = z.object({
            id: z.string().uuid() 
        })
        const { id } = paramsSchema.parse(request.params)
        const user = await prisma.users.findUniqueOrThrow({
            select: {
                className: true,
                Post: {
                    select: {
                        id: true,
                        coverUrl: true
                    }, orderBy: {
                        createdAt: 'desc'
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
    app.get('/users/community', async (request, reply) => {
        const { sub: userId } = request.user;
        const user = await prisma.users.findUniqueOrThrow({
            select: {
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
            },
            where: {
              id: userId,
            }
        })
        return {
            id: user.id,
            followers: user.Followers,
            following: user.Following,
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
            description: z.string(),
            password: z.string(),
            classId: z.number()
        })

        const { name, profilePic, description, classId, password } = bodySchema.parse(request.body)


        let user = await prisma.users.findUniqueOrThrow({
            where: {
              id,
            }, include: {
                className: true,
            }
        })

        
        if (userId !== id) {
            return reply.status(401).send()
        }
        const randomSalt = randomInt(10, 16)
        const passwordHash = await hash(password, randomSalt)
        const profilePicName = user.profilePic.split('/')
        const ppPath = resolve(__dirname, '../../uploads/profilePics/', profilePicName[profilePicName.length - 1])
        unlink(ppPath, (err) => {
            if (err) {
              console.error(`Erro ao excluir o arquivo: ${err}`);
            } else {
              console.log('Arquivo excluído com sucesso.');
            }})
        user = await prisma.users.update({
            include: {
                className: true
            },
            where: {
                id
            },
            data: {
                name,
                profilePic,
                description,
                password: passwordHash,
                classId
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