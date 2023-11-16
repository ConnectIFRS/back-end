/* eslint-disable prettier/prettier */
import { compare, hash } from 'bcrypt'
import { FastifyInstance } from 'fastify'
import { randomInt } from 'node:crypto'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
    app.post('/users', async (request, reply) => {
        const bodySchema = z.object({
            name: z.string(),
            login: z.string().includes('feliz.ifrs.edu.br').email(),
            password: z.string(),
            class: z.number(),
            description: z.string(),
            profilePic: z.string().optional(),
            instagramName: z.string().optional(),
            whatsappName: z.string().optional()
        })

        const { name, login, password, class: userClass, profilePic, description, instagramName, whatsappName } = bodySchema.parse(request.body)

        const avatarUrl = profilePic ?? 'http://192.168.2.17:3333/uploads/profilePics/fc581326-d3f5-46bf-ac1a-30bcef3412d1.png'

        let user = await prisma.users.findUnique({
            where: {
              login,
            }, include: {
                className: true
            }
          })

        if (!user) {
            const randomSalt = randomInt(10, 16)
            const passwordHash = await hash(password, randomSalt)
            user = await prisma.users.create({
                data: {
                    login,
                    name,
                    password: passwordHash,
                    classId: userClass,
                    profilePic: avatarUrl,
                    description
                },
                include: {
                    className: true
                }
            })
        }
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

    app.post('/login', async (request, reply) => {
        const bodySchema = z.object({
            login: z.string(),
            password: z.string(),
        })

        const { login, password } = bodySchema.parse(request.body)

        let user = await prisma.users.findUnique({
            where: {
              login,
            }, include: {
                className: true
            }
          })
          if (user) {

            const isValidPassword = await compare(password, user.password)
            if (isValidPassword) {
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
            } else {
                reply.status(401).send('Login ou senha informados incorretamente')
            }
          }
    })
}